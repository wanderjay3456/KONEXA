import express, { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import {
  createProject,
  DomainRuleError,
  submitApplication,
  submitFinalEvaluation,
  submitWeeklyEvaluation,
  updateApplicationStatus
} from '../platform/domain/enterpriseCore';
import { ApplicationStatus, Notification, ProjectStatus, User } from '../types';
import { ServerConfig } from './config';
import { appendOperationalState, PlatformRepository } from './repository';
import {
  asObject,
  readApplicationStatus,
  readHiringDecision,
  readMilestones,
  readNumber,
  readOptionalString,
  readProjectStatus,
  readString,
  readStringArray,
  RequestValidationError
} from './validation';

interface RequestWithActor extends Request {
  actor?: User;
}

interface ApiMetrics {
  startedAt: string;
  requestCount: number;
  errorCount: number;
  deniedCount: number;
  writeCount: number;
}

const metrics: ApiMetrics = {
  startedAt: new Date().toISOString(),
  requestCount: 0,
  errorCount: 0,
  deniedCount: 0,
  writeCount: 0
};

const notification = (userId: string, title: string, message: string, type: Notification['type']): Notification => ({
  id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  userId,
  title,
  message,
  type,
  isRead: false,
  createdAt: new Date().toISOString()
});

function requireActor(req: RequestWithActor, repository: PlatformRepository) {
  const actorId = req.header('x-konexa-user-id');
  if (!actorId) {
    throw new RequestValidationError('Missing x-konexa-user-id header.');
  }

  const actor = repository.read().users.find((user) => user.id === actorId);
  if (!actor) {
    throw new RequestValidationError('Unknown KONEXA actor.', { 'x-konexa-user-id': 'User does not exist.' });
  }

  req.actor = actor;
  return actor;
}

function sendState(res: Response, repository: PlatformRepository) {
  const state = repository.read();
  res.json({
    users: state.users,
    studentProfiles: state.studentProfiles,
    companyProfiles: state.companyProfiles,
    projects: state.projects,
    applications: state.applications,
    submissions: state.submissions,
    evaluations: state.evaluations,
    finalEvaluations: state.finalEvaluations,
    notifications: state.notifications,
    companyEvaluations: state.companyEvaluations,
    warnings: state.warnings
  });
}

export function createKonexaApp(repository: PlatformRepository, config: ServerConfig) {
  const app = express();
  app.disable('x-powered-by');

  app.use(express.json({ limit: config.requestBodyLimit }));
  app.use((req, res, next) => {
    metrics.requestCount += 1;
    const requestId = req.header('x-request-id') || crypto.randomUUID();
    res.setHeader('x-request-id', requestId);
    res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('x-frame-options', 'DENY');
    res.setHeader('referrer-policy', 'no-referrer');
    res.setHeader('permissions-policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-konexa-user-id, x-konexa-api-key, x-request-id');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
  });

  app.use((req, res, next) => {
    if (!config.apiKey) return next();
    if (req.path === '/api/health') return next();
    const providedKey = req.header('x-konexa-api-key') || '';
    const expected = Buffer.from(config.apiKey);
    const provided = Buffer.from(providedKey);
    const isValid = expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
    if (!isValid) {
      metrics.deniedCount += 1;
      metrics.errorCount += 1;
      return res.status(401).json({ error: { code: 'API_KEY_REQUIRED', message: 'Valid KONEXA API key is required.' } });
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'konexa-api', time: new Date().toISOString() });
  });

  app.get('/api/metrics', (_req, res) => {
    const state = repository.read();
    const averageTrustScore = state.trustScores.length
      ? Math.round(state.trustScores.reduce((sum, item) => sum + item.score, 0) / state.trustScores.length)
      : 0;
    res.json({
      ...metrics,
      auditLogCount: state.auditLogs.length,
      domainEventCount: state.domainEvents.length,
      trustScoreCount: state.trustScores.length,
      averageTrustScore
    });
  });

  app.get('/api/state', (_req, res) => sendState(res, repository));
  app.get('/api/projects', (_req, res) => res.json(repository.read().projects));
  app.get('/api/audit-logs', (_req, res) => res.json(repository.read().auditLogs));
  app.get('/api/trust-scores/:entityType/:entityId', (req, res) => {
    const score = repository.read().trustScores.find((item) => item.entityType === req.params.entityType && item.entityId === req.params.entityId);
    if (!score) return res.status(404).json({ error: { code: 'TRUST_SCORE_NOT_FOUND', message: 'Trust score has not been calculated yet.' } });
    res.json(score);
  });

  app.post('/api/projects', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const company = repository.read().companyProfiles.find((item) => item.userId === actor.id);
      if (!company) throw new RequestValidationError('Company profile is required.');

      const result = createProject(actor, company, {
        title: readString(body, 'title', 2),
        description: readString(body, 'description', 20),
        expectedOutcome: readString(body, 'expectedOutcome', 10),
        durationWeeks: readNumber(body, 'durationWeeks', 1, 12),
        compensation: readString(body, 'compensation', 1),
        requiredSkills: readStringArray(body, 'requiredSkills'),
        weeklyHours: readNumber(body, 'weeklyHours', 1, 30),
        status: body.status ? readProjectStatus(body) : ProjectStatus.PENDING_APPROVAL,
        milestones: readMilestones(body)
      });

      repository.update((state) => appendOperationalState({ ...state, projects: [...state.projects, result.entity] }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores
      }));
      metrics.writeCount += 1;
      res.status(201).json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/projects/:projectId/applications', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const state = repository.read();
      const result = submitApplication(actor, state, {
        projectId: req.params.projectId,
        coverLetter: readString(body, 'coverLetter', 10),
        portfolioUrl: readOptionalString(body, 'portfolioUrl')
      });
      const project = state.projects.find((item) => item.id === req.params.projectId);

      repository.update((current) => appendOperationalState({
        ...current,
        applications: [...current.applications, result.entity],
        notifications: project
          ? [notification(project.companyId, 'New Project Applicant', `${result.entity.studentName} applied for ${result.entity.projectTitle}.`, 'info'), ...current.notifications]
          : current.notifications
      }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores
      }));
      metrics.writeCount += 1;
      res.status(201).json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/applications/:applicationId/status', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const state = repository.read();
      const application = state.applications.find((item) => item.id === req.params.applicationId);
      if (!application) return res.status(404).json({ error: { code: 'APPLICATION_NOT_FOUND', message: 'Application does not exist.' } });
      const status = readApplicationStatus(body);
      const result = updateApplicationStatus(actor, application, status);

      repository.update((current) => appendOperationalState({
        ...current,
        applications: current.applications.map((item) => item.id === application.id ? result.entity : item),
        projects: status === ApplicationStatus.ACCEPTED
          ? current.projects.map((item) => item.id === application.projectId ? { ...item, status: ProjectStatus.RUNNING } : item)
          : current.projects,
        notifications: [
          notification(application.studentId, 'Application Status Update', `Your application to "${application.projectTitle}" has been ${status.toLowerCase()}.`, status === ApplicationStatus.ACCEPTED ? 'success' : 'info'),
          ...current.notifications
        ]
      }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores
      }));
      metrics.writeCount += 1;
      res.json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/projects/:projectId/submissions', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const state = repository.read();
      const project = state.projects.find((item) => item.id === req.params.projectId);
      const accepted = state.applications.some((item) => item.projectId === req.params.projectId && item.studentId === actor.id && item.status === ApplicationStatus.ACCEPTED);
      if (!project) return res.status(404).json({ error: { code: 'PROJECT_NOT_FOUND', message: 'Project does not exist.' } });
      if (!actor.isVerified || actor.status !== 'ACTIVE' || !accepted) {
        return res.status(403).json({ error: { code: 'SUBMISSION_DENIED', message: 'Only accepted verified students can submit weekly deliverables.' } });
      }

      const weekNumber = readNumber(body, 'weekNumber', 1, project.durationWeeks);
      if (state.submissions.some((item) => item.projectId === project.id && item.studentId === actor.id && item.weekNumber === weekNumber)) {
        return res.status(409).json({ error: { code: 'DUPLICATE_SUBMISSION', message: 'Weekly deliverable already exists.' } });
      }

      const submission = {
        id: `sub_${project.id}_w${weekNumber}_${Date.now()}`,
        projectId: project.id,
        studentId: actor.id,
        weekNumber,
        submittedAt: new Date().toISOString(),
        deliverableFile: readString(body, 'deliverableFile', 5),
        progressReport: readString(body, 'progressReport', 20),
        reflection: readString(body, 'reflection', 10),
        isEvaluated: false
      };

      repository.update((current) => ({
        ...current,
        submissions: [...current.submissions, submission],
        notifications: [notification(project.companyId, 'New Weekly Submission', `Week ${weekNumber} deliverable is ready for evaluation.`, 'info'), ...current.notifications]
      }));
      metrics.writeCount += 1;
      res.status(201).json(submission);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/submissions/:submissionId/evaluations', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const state = repository.read();
      const submission = state.submissions.find((item) => item.id === req.params.submissionId);
      if (!submission) return res.status(404).json({ error: { code: 'SUBMISSION_NOT_FOUND', message: 'Submission does not exist.' } });
      const result = submitWeeklyEvaluation(actor, state, {
        submissionId: submission.id,
        projectId: submission.projectId,
        studentId: submission.studentId,
        weekNumber: submission.weekNumber,
        communication: readNumber(body, 'communication', 1, 5),
        responsibility: readNumber(body, 'responsibility', 1, 5),
        quality: readNumber(body, 'quality', 1, 5),
        deadline: readNumber(body, 'deadline', 1, 5),
        problemSolving: readNumber(body, 'problemSolving', 1, 5),
        professionalism: readNumber(body, 'professionalism', 1, 5),
        comment: readString(body, 'comment', 10)
      });

      repository.update((current) => appendOperationalState({
        ...current,
        evaluations: [...current.evaluations, result.entity],
        submissions: current.submissions.map((item) => item.id === submission.id ? { ...item, isEvaluated: true } : item),
        notifications: [notification(submission.studentId, `Week ${submission.weekNumber} Evaluation Published`, 'Your project evidence has been evaluated.', 'success'), ...current.notifications]
      }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores
      }));
      metrics.writeCount += 1;
      res.status(201).json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/projects/:projectId/final-evaluations', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const result = submitFinalEvaluation(actor, repository.read(), {
        projectId: req.params.projectId,
        studentId: readString(body, 'studentId', 2),
        hiringDecision: readHiringDecision(body),
        feedback: readString(body, 'feedback', 10)
      });

      repository.update((current) => appendOperationalState({
        ...current,
        finalEvaluations: [...current.finalEvaluations, result.entity],
        projects: current.projects.map((item) => item.id === req.params.projectId ? { ...item, status: ProjectStatus.COMPLETED } : item),
        notifications: [notification(result.entity.studentId, 'Hiring Pipeline Choice Finalized', `Decision: ${result.entity.hiringDecision.replace('_', ' ')}`, 'success'), ...current.notifications]
      }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores
      }));
      metrics.writeCount += 1;
      res.status(201).json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, req: RequestWithActor, res: Response, _next: NextFunction) => {
    metrics.errorCount += 1;
    if (error instanceof DomainRuleError) {
      metrics.deniedCount += 1;
      repository.update((state) => appendOperationalState(state, { auditLogs: error.auditLogs }));
      return res.status(403).json({ error: { code: error.code, message: error.message } });
    }

    if (error instanceof RequestValidationError) {
      return res.status(400).json({ error: { code: 'REQUEST_VALIDATION_FAILED', message: error.message, details: error.details } });
    }

    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'KONEXA API failed to process the request.' } });
  });

  return app;
}
