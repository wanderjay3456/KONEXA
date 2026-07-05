import express, { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import {
  createProject,
  DomainRuleError,
  approveUserVerification,
  issueStudentWarning,
  registerCompanyAccount,
  registerStudentAccount,
  submitApplication,
  submitFinalEvaluation,
  submitWeeklyEvaluation,
  updateCompanyProfile,
  updateProjectStatus,
  updateStudentProfile,
  updateApplicationStatus,
  type AuditLog,
  type DomainEvent
} from '../platform/domain/enterpriseCore';
import { ApplicationStatus, CompanyProfile, Notification, ProjectStatus, StudentProfile, User } from '../types';
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

const notification = (
  userId: string,
  title: string,
  message: string,
  type: Notification['type'],
  options: Pick<Notification, 'priority' | 'category' | 'channels' | 'scheduledFor'> = {}
): Notification => ({
  id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  userId,
  title,
  message,
  type,
  priority: options.priority ?? 'NORMAL',
  category: options.category ?? 'SYSTEM',
  channels: options.channels ?? ['IN_APP'],
  scheduledFor: options.scheduledFor,
  isRead: false,
  createdAt: new Date().toISOString()
});

function notificationAudit(actor: User, action: AuditLog['action'], notificationItem: Notification, reason: string): AuditLog {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actorId: actor.id,
    actorRole: actor.role,
    action,
    resourceType: 'NOTIFICATION',
    resourceId: notificationItem.id,
    decision: 'ALLOW',
    reason,
    metadata: {
      notificationUserId: notificationItem.userId,
      category: notificationItem.category ?? 'SYSTEM',
      priority: notificationItem.priority ?? 'NORMAL'
    },
    createdAt: new Date().toISOString()
  };
}

function notificationEvent(actor: User, type: DomainEvent['type'], notificationItem: Notification): DomainEvent {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    actorId: actor.id,
    aggregateId: notificationItem.id,
    payload: {
      userId: notificationItem.userId,
      category: notificationItem.category ?? 'SYSTEM',
      priority: notificationItem.priority ?? 'NORMAL'
    },
    occurredAt: new Date().toISOString()
  };
}

function canAccessNotification(actor: User, notificationItem: Notification) {
  return notificationItem.userId === actor.id || actor.role === 'ADMIN' || actor.role === 'SUPER_ADMIN';
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { passwordHash, passwordSalt: salt };
}

function verifyPassword(password: string, passwordHash: string, passwordSalt: string) {
  const computed = hashPassword(password, passwordSalt).passwordHash;
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(passwordHash, 'hex'));
}

function readPassword(body: Record<string, unknown>) {
  const password = readString(body, 'password', 8);
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new RequestValidationError('Invalid request body.', { password: 'Must include at least one letter and one number.' });
  }
  return password;
}

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
    warnings: state.warnings,
    profileVersions: state.profileVersions
  });
}

function optionalStringArray(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return readStringArray(body, field);
}

function optionalString(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return readOptionalString(body, field);
}

function optionalNotificationPreferences(body: Record<string, unknown>) {
  const value = body.notificationPreferences;
  if (value === undefined) return undefined;
  const pref = asObject(value);
  const readPreference = (key: string) => {
    if (typeof pref[key] !== 'boolean') {
      throw new RequestValidationError('Invalid notification preferences.', { [key]: 'Must be a boolean.' });
    }
    return pref[key] as boolean;
  };
  return {
    inApp: readPreference('inApp'),
    email: readPreference('email'),
    projectUpdates: readPreference('projectUpdates'),
    applicationUpdates: readPreference('applicationUpdates'),
    aiRecommendations: readPreference('aiRecommendations'),
    trustUpdates: readPreference('trustUpdates'),
    weeklyReminders: readPreference('weeklyReminders')
  };
}

function optionalPrivacySettings(body: Record<string, unknown>) {
  const value = body.privacySettings;
  if (value === undefined) return undefined;
  const settings = asObject(value);
  const readSetting = (key: string) => {
    if (typeof settings[key] !== 'boolean') {
      throw new RequestValidationError('Invalid privacy settings.', { [key]: 'Must be a boolean.' });
    }
    return settings[key] as boolean;
  };
  return {
    showPortfolio: readSetting('showPortfolio'),
    showGithub: readSetting('showGithub'),
    showLinkedIn: readSetting('showLinkedIn'),
    allowCompanyDiscovery: readSetting('allowCompanyDiscovery')
  };
}

function optionalTeamMembers(body: Record<string, unknown>) {
  const value = body.teamMembers;
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new RequestValidationError('Invalid team members.', { teamMembers: 'Must be an array.' });
  }
  return value.map((item, index) => {
    const member = asObject(item);
    return {
      id: optionalString(member, 'id') || `team_${index}_${Date.now()}`,
      name: readString(member, 'name', 2),
      role: readString(member, 'role', 2),
      email: readString(member, 'email', 5)
    };
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

  app.post('/api/auth/register', (req, res, next) => {
    try {
      const body = asObject(req.body);
      const role = readString(body, 'role');
      const email = readString(body, 'email', 5).toLowerCase();
      const password = readPassword(body);
      const state = repository.read();
      if (state.users.some((item) => item.email.toLowerCase() === email)) {
        return res.status(409).json({ error: { code: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered.' } });
      }

      const result = role === 'STUDENT'
        ? registerStudentAccount({
            email,
            fullName: readString(body, 'fullName', 2),
            university: readOptionalString(body, 'university'),
            major: readString(body, 'major', 2)
          })
        : role === 'COMPANY'
          ? registerCompanyAccount({
              email,
              companyName: readString(body, 'companyName', 2),
              businessRegistrationFile: readString(body, 'businessRegistrationFile', 2)
            })
          : undefined;

      if (!result) {
        throw new RequestValidationError('Invalid request body.', { role: 'Must be STUDENT or COMPANY.' });
      }

      const { passwordHash, passwordSalt } = hashPassword(password);
      const createdAt = new Date().toISOString();
      repository.update((current) => appendOperationalState({
        ...current,
        users: [...current.users, result.entity.user],
        studentProfiles: 'studentProfile' in result.entity ? [...current.studentProfiles, result.entity.studentProfile] : current.studentProfiles,
        companyProfiles: 'companyProfile' in result.entity ? [...current.companyProfiles, result.entity.companyProfile] : current.companyProfiles,
        authCredentials: [...current.authCredentials, {
          userId: result.entity.user.id,
          passwordHash,
          passwordSalt,
          createdAt,
          updatedAt: createdAt
        }],
        notifications: [
          notification(result.entity.user.id, 'Account Created', 'Your KONEXA profile is ready. Complete your profile while verification is reviewed.', 'success', { category: 'SYSTEM', priority: 'HIGH', channels: ['IN_APP', 'EMAIL'] }),
          ...current.notifications
        ]
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

  app.post('/api/auth/login', (req, res, next) => {
    try {
      const body = asObject(req.body);
      const role = readString(body, 'role');
      const email = readString(body, 'email', 5).toLowerCase();
      const password = readPassword(body);
      const state = repository.read();
      const user = state.users.find((item) => item.email.toLowerCase() === email && item.role === role);
      const credential = user ? state.authCredentials.find((item) => item.userId === user.id) : undefined;
      if (!user || !credential || !verifyPassword(password, credential.passwordHash, credential.passwordSalt)) {
        return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Check your email address or password.' } });
      }

      res.json({
        user,
        studentProfile: state.studentProfiles.find((item) => item.userId === user.id),
        companyProfile: state.companyProfiles.find((item) => item.userId === user.id)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/state', (_req, res) => sendState(res, repository));
  app.get('/api/projects', (_req, res) => res.json(repository.read().projects));
  app.get('/api/audit-logs', (_req, res) => res.json(repository.read().auditLogs));
  app.get('/api/trust-scores/:entityType/:entityId', (req, res) => {
    const score = repository.read().trustScores.find((item) => item.entityType === req.params.entityType && item.entityId === req.params.entityId);
    if (!score) return res.status(404).json({ error: { code: 'TRUST_SCORE_NOT_FOUND', message: 'Trust score has not been calculated yet.' } });
    res.json(score);
  });

  app.get('/api/notifications', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const limit = Math.min(Math.max(Number(req.query.limit ?? 50), 1), 100);
      const offset = Math.max(Number(req.query.offset ?? 0), 0);
      const unreadOnly = req.query.unread === 'true';
      const includeArchived = req.query.includeArchived === 'true';
      const includeDismissed = req.query.includeDismissed === 'true';
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;

      const items = repository.read().notifications
        .filter((item) => canAccessNotification(actor, item))
        .filter((item) => !unreadOnly || !item.isRead)
        .filter((item) => includeArchived || !item.archivedAt)
        .filter((item) => includeDismissed || !item.dismissedAt)
        .filter((item) => !category || item.category === category)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

      res.json({
        items: items.slice(offset, offset + limit),
        total: items.length,
        limit,
        offset,
        unreadCount: items.filter((item) => !item.isRead).length
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/notifications/read-all', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const now = new Date().toISOString();
      const changed = repository.read().notifications.filter((item) => canAccessNotification(actor, item) && !item.isRead && !item.dismissedAt && !item.archivedAt);
      repository.update((state) => appendOperationalState({
        ...state,
        notifications: state.notifications.map((item) => changed.some((changedItem) => changedItem.id === item.id) ? { ...item, isRead: true, readAt: now } : item)
      }, {
        auditLogs: changed.map((item) => notificationAudit(actor, 'notification.read', item, 'Notification marked as read.')),
        domainEvents: changed.map((item) => notificationEvent(actor, 'notification.read', item))
      }));
      metrics.writeCount += 1;
      res.json({ updated: changed.length });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/notifications/:notificationId/:action', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const action = req.params.action;
      if (!['read', 'archive', 'dismiss'].includes(action)) {
        return res.status(404).json({ error: { code: 'NOTIFICATION_ACTION_NOT_FOUND', message: 'Notification action does not exist.' } });
      }

      const current = repository.read().notifications.find((item) => item.id === req.params.notificationId);
      if (!current || !canAccessNotification(actor, current)) {
        return res.status(404).json({ error: { code: 'NOTIFICATION_NOT_FOUND', message: 'Notification does not exist.' } });
      }

      const now = new Date().toISOString();
      const patch: Partial<Notification> = action === 'read'
        ? { isRead: true, readAt: current.readAt ?? now }
        : action === 'archive'
          ? { archivedAt: current.archivedAt ?? now, isRead: true, readAt: current.readAt ?? now }
          : { dismissedAt: current.dismissedAt ?? now, isRead: true, readAt: current.readAt ?? now };
      const nextNotification = { ...current, ...patch };
      const eventType = action === 'read' ? 'notification.read' : action === 'archive' ? 'notification.archived' : 'notification.dismissed';

      repository.update((state) => appendOperationalState({
        ...state,
        notifications: state.notifications.map((item) => item.id === current.id ? nextNotification : item)
      }, {
        auditLogs: [notificationAudit(actor, eventType, nextNotification, `Notification ${action} completed.`)],
        domainEvents: [notificationEvent(actor, eventType, nextNotification)]
      }));
      metrics.writeCount += 1;
      res.json(nextNotification);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/verifications/:userId/approve', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const state = repository.read();
      const target = state.users.find((item) => item.id === req.params.userId);
      if (!target) return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User does not exist.' } });
      const companyProfile = state.companyProfiles.find((item) => item.userId === target.id);
      const result = approveUserVerification(actor, target, companyProfile);

      repository.update((current) => appendOperationalState({
        ...current,
        users: current.users.map((item) => item.id === target.id ? result.entity.user : item),
        companyProfiles: result.entity.companyProfile
          ? current.companyProfiles.map((item) => item.userId === result.entity.companyProfile?.userId ? result.entity.companyProfile : item)
          : current.companyProfiles,
        notifications: [
          notification(target.id, 'Verification Approved', 'Your KONEXA account has been verified for project-first hiring workflows.', 'success', { category: 'TRUST', priority: 'HIGH', channels: ['IN_APP', 'EMAIL'] }),
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

  app.post('/api/admin/students/:studentId/warnings', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const result = issueStudentWarning(actor, repository.read(), {
        studentId: req.params.studentId,
        reason: readString(body, 'reason', 10)
      });

      repository.update((current) => appendOperationalState({
        ...current,
        warnings: [result.entity, ...current.warnings],
        notifications: [
          notification(result.entity.studentId, 'Administrator Action Warning', `You have received a formal warning: "${result.entity.reason}".`, 'warning', { category: 'TRUST', priority: 'CRITICAL', channels: ['IN_APP', 'EMAIL'] }),
          ...current.notifications
        ]
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

  app.patch('/api/students/:studentId/profile', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const current = repository.read().studentProfiles.find((item) => item.userId === req.params.studentId);
      if (!current) return res.status(404).json({ error: { code: 'STUDENT_PROFILE_NOT_FOUND', message: 'Student profile does not exist.' } });

      const patch: Partial<StudentProfile> = {
        avatarUrl: optionalString(body, 'avatarUrl'),
        fullName: optionalString(body, 'fullName'),
        university: optionalString(body, 'university'),
        major: optionalString(body, 'major'),
        graduationDate: optionalString(body, 'graduationDate'),
        englishProficiency: optionalString(body, 'englishProficiency'),
        languages: optionalStringArray(body, 'languages'),
        skills: optionalStringArray(body, 'skills'),
        certificates: optionalStringArray(body, 'certificates'),
        resumeFileName: optionalString(body, 'resumeFileName'),
        portfolioUrl: optionalString(body, 'portfolioUrl'),
        githubUrl: optionalString(body, 'githubUrl'),
        linkedinUrl: optionalString(body, 'linkedinUrl'),
        preferredCountry: optionalString(body, 'preferredCountry'),
        preferredIndustry: optionalString(body, 'preferredIndustry'),
        preferredRole: optionalString(body, 'preferredRole'),
        availability: optionalString(body, 'availability'),
        biography: optionalString(body, 'biography'),
        careerGoals: optionalString(body, 'careerGoals'),
        contactEmail: optionalString(body, 'contactEmail'),
        contactPhone: optionalString(body, 'contactPhone'),
        notificationPreferences: optionalNotificationPreferences(body),
        privacySettings: optionalPrivacySettings(body)
      };

      const result = updateStudentProfile(actor, current, Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined)));
      repository.update((state) => appendOperationalState({
        ...state,
        studentProfiles: state.studentProfiles.map((item) => item.userId === result.entity.userId ? result.entity : item),
        applications: state.applications.map((item) => item.studentId === result.entity.userId ? { ...item, studentName: result.entity.fullName, studentAvatar: result.entity.avatarUrl } : item),
        notifications: [
          notification(result.entity.userId, 'Profile Updated', 'Your verified profile was synchronized across KONEXA AI and matching systems.', 'success', { category: 'AI', priority: 'NORMAL' }),
          ...state.notifications
        ]
      }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores,
        profileVersions: result.profileVersion ? [result.profileVersion] : []
      }));
      metrics.writeCount += 1;
      res.json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/companies/:companyId/profile', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const current = repository.read().companyProfiles.find((item) => item.userId === req.params.companyId);
      if (!current) return res.status(404).json({ error: { code: 'COMPANY_PROFILE_NOT_FOUND', message: 'Company profile does not exist.' } });

      const patch: Partial<CompanyProfile> = {
        logoUrl: optionalString(body, 'logoUrl'),
        companyName: optionalString(body, 'companyName'),
        industry: optionalString(body, 'industry'),
        description: optionalString(body, 'description'),
        website: optionalString(body, 'website'),
        companySize: optionalString(body, 'companySize'),
        location: optionalString(body, 'location'),
        englishAvailability: optionalString(body, 'englishAvailability'),
        hiringPreferences: optionalStringArray(body, 'hiringPreferences'),
        preferredMajors: optionalStringArray(body, 'preferredMajors'),
        preferredSkills: optionalStringArray(body, 'preferredSkills'),
        languages: optionalStringArray(body, 'languages'),
        recruitmentStatus: optionalString(body, 'recruitmentStatus') as CompanyProfile['recruitmentStatus'],
        contactEmail: optionalString(body, 'contactEmail'),
        contactPhone: optionalString(body, 'contactPhone'),
        notificationPreferences: optionalNotificationPreferences(body),
        teamMembers: optionalTeamMembers(body),
        employerBranding: optionalString(body, 'employerBranding')
      };

      const result = updateCompanyProfile(actor, current, Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined)));
      repository.update((state) => appendOperationalState({
        ...state,
        companyProfiles: state.companyProfiles.map((item) => item.userId === result.entity.userId ? result.entity : item),
        projects: state.projects.map((item) => item.companyId === result.entity.userId ? { ...item, companyName: result.entity.companyName, companyLogo: result.entity.logoUrl } : item),
        applications: state.applications.map((item) => {
          const project = state.projects.find((projectItem) => projectItem.id === item.projectId);
          return project?.companyId === result.entity.userId ? { ...item, companyName: result.entity.companyName } : item;
        }),
        notifications: [
          notification(result.entity.userId, 'Company Profile Updated', 'Your employer profile was synchronized across KONEXA AI and matching systems.', 'success', { category: 'AI', priority: 'NORMAL' }),
          ...state.notifications
        ]
      }, {
        auditLogs: result.auditLogs,
        domainEvents: result.events,
        trustScores: result.trustScores,
        profileVersions: result.profileVersion ? [result.profileVersion] : []
      }));
      metrics.writeCount += 1;
      res.json(result.entity);
    } catch (error) {
      next(error);
    }
  });

  if (config.serveStatic) {
    const staticRoot = path.resolve(config.staticDir);
    app.use(express.static(staticRoot, {
      index: false,
      maxAge: '1h',
      etag: true
    }));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(staticRoot, 'index.html'));
    });
  }

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

  app.patch('/api/projects/:projectId/status', (req: RequestWithActor, res, next) => {
    try {
      const actor = requireActor(req, repository);
      const body = asObject(req.body);
      const project = repository.read().projects.find((item) => item.id === req.params.projectId);
      if (!project) return res.status(404).json({ error: { code: 'PROJECT_NOT_FOUND', message: 'Project does not exist.' } });
      const result = updateProjectStatus(actor, project, readProjectStatus(body));

      repository.update((current) => appendOperationalState({
        ...current,
        projects: current.projects.map((item) => item.id === project.id ? result.entity : item),
        notifications: [
          notification(project.companyId, 'Project Status Updated', `"${project.title}" is now ${result.entity.status}.`, result.entity.status === ProjectStatus.OPEN ? 'success' : 'info', { category: 'PROJECT', priority: result.entity.status === ProjectStatus.OPEN ? 'HIGH' : 'NORMAL' }),
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
          ? [notification(project.companyId, 'New Project Applicant', `${result.entity.studentName} applied for ${result.entity.projectTitle}.`, 'info', { category: 'APPLICATION', priority: 'HIGH' }), ...current.notifications]
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
          notification(application.studentId, 'Application Status Update', `Your application to "${application.projectTitle}" has been ${status.toLowerCase()}.`, status === ApplicationStatus.ACCEPTED ? 'success' : 'info', { category: 'APPLICATION', priority: status === ApplicationStatus.ACCEPTED ? 'HIGH' : 'NORMAL' }),
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
        notifications: [notification(project.companyId, 'New Weekly Submission', `Week ${weekNumber} deliverable is ready for evaluation.`, 'info', { category: 'PROJECT', priority: 'HIGH' }), ...current.notifications]
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
        notifications: [notification(submission.studentId, `Week ${submission.weekNumber} Evaluation Published`, 'Your project evidence has been evaluated.', 'success', { category: 'PERFORMANCE', priority: 'HIGH' }), ...current.notifications]
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
        notifications: [notification(result.entity.studentId, 'Hiring Pipeline Choice Finalized', `Decision: ${result.entity.hiringDecision.replace('_', ' ')}`, 'success', { category: 'APPLICATION', priority: 'CRITICAL', channels: ['IN_APP', 'EMAIL'] }), ...current.notifications]
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
