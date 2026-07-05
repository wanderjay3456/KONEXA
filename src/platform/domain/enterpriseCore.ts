import {
  Application,
  ApplicationStatus,
  CompanyEvaluation,
  CompanyProfile,
  HiringDecision,
  ProfileVersion,
  Project,
  ProjectStatus,
  StudentProfile,
  StudentWarning,
  User,
  UserRole,
  WeeklyEvaluation,
  WeeklySubmission
} from '../../types';

export type Actor = Pick<User, 'id' | 'role' | 'status' | 'isVerified'>;

export type DomainEventType =
  | 'audit.recorded'
  | 'application.submitted'
  | 'application.status_changed'
  | 'project.created'
  | 'project.completed'
  | 'submission.created'
  | 'evaluation.weekly_created'
  | 'evaluation.final_created'
  | 'verification.approved'
  | 'warning.issued'
  | 'trust.score_recalculated'
  | 'student.updated'
  | 'company.updated'
  | 'ai.context_invalidated'
  | 'notification.created'
  | 'notification.read'
  | 'notification.archived'
  | 'notification.dismissed';

export interface DomainEvent<TPayload = Record<string, unknown>> {
  id: string;
  type: DomainEventType;
  actorId: string;
  aggregateId: string;
  payload: TPayload;
  occurredAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: DomainEventType | 'permission.denied' | 'validation.failed';
  resourceType: string;
  resourceId: string;
  decision: 'ALLOW' | 'DENY';
  reason: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface TrustScore {
  entityId: string;
  entityType: 'STUDENT' | 'COMPANY' | 'PROJECT';
  score: number;
  evidence: string[];
  recalculatedAt: string;
}

export interface PlatformState {
  users: User[];
  studentProfiles: StudentProfile[];
  companyProfiles: CompanyProfile[];
  projects: Project[];
  applications: Application[];
  submissions: WeeklySubmission[];
  evaluations: WeeklyEvaluation[];
  companyEvaluations: CompanyEvaluation[];
  warnings: StudentWarning[];
}

export interface MutationResult<T> {
  entity: T;
  events: DomainEvent[];
  auditLogs: AuditLog[];
  trustScores: TrustScore[];
  profileVersion?: ProfileVersion;
}

export class DomainRuleError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly auditLogs: AuditLog[]
  ) {
    super(message);
  }
}

const nowIso = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function audit(
  actor: Actor,
  action: AuditLog['action'],
  resourceType: string,
  resourceId: string,
  decision: AuditLog['decision'],
  reason: string,
  metadata: Record<string, unknown> = {}
): AuditLog {
  return {
    id: id('audit'),
    actorId: actor.id,
    actorRole: actor.role,
    action,
    resourceType,
    resourceId,
    decision,
    reason,
    metadata,
    createdAt: nowIso()
  };
}

function event<TPayload extends Record<string, unknown>>(
  type: DomainEventType,
  actor: Actor,
  aggregateId: string,
  payload: TPayload
): DomainEvent<TPayload> {
  return {
    id: id('evt'),
    type,
    actorId: actor.id,
    aggregateId,
    payload,
    occurredAt: nowIso()
  };
}

function deny(actor: Actor, action: AuditLog['action'], resourceType: string, resourceId: string, reason: string): never {
  const log = audit(actor, action, resourceType, resourceId, 'DENY', reason);
  throw new DomainRuleError(reason, String(action).toUpperCase().replaceAll('.', '_'), [log]);
}

function requireActiveVerified(actor: Actor, action: AuditLog['action'], resourceType: string, resourceId: string) {
  if (!actor.isVerified || actor.status !== 'ACTIVE') {
    deny(actor, action, resourceType, resourceId, 'Only active verified accounts can perform this action.');
  }
}

function requireRole(actor: Actor, roles: UserRole[], action: AuditLog['action'], resourceType: string, resourceId: string) {
  if (!roles.includes(actor.role)) {
    deny(actor, action, resourceType, resourceId, `Required role: ${roles.join(', ')}.`);
  }
}

function assertText(value: string | undefined, field: string, actor: Actor, resourceType: string) {
  if (!value || value.trim().length < 2) {
    deny(actor, 'validation.failed', resourceType, field, `${field} must contain meaningful evidence.`);
  }
}

function assertOptionalUrl(value: string | undefined, field: string, actor: Actor) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
  } catch {
    deny(actor, 'validation.failed', 'profile', field, `${field} must be a valid HTTP URL.`);
  }
}

function assertOptionalEmail(value: string | undefined, field: string, actor: Actor) {
  if (!value) return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    deny(actor, 'validation.failed', 'profile', field, `${field} must be a valid email address.`);
  }
}

function cleanStringArray(value: string[] | undefined, field: string, actor: Actor) {
  if (!value) return undefined;
  const cleaned = value.map((item) => item.trim()).filter(Boolean);
  if (cleaned.length !== value.length) {
    deny(actor, 'validation.failed', 'profile', field, `${field} cannot contain empty values.`);
  }
  return Array.from(new Set(cleaned));
}

function changedFields<T extends Record<string, unknown>>(previous: T, next: T) {
  return Object.keys(next).filter((key) => JSON.stringify(previous[key]) !== JSON.stringify(next[key]));
}

function assertRating(value: number, field: string, actor: Actor) {
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    deny(actor, 'validation.failed', 'rating', field, `${field} must be a number between 1 and 5.`);
  }
}

export function calculateStudentTrustScore(
  studentId: string,
  evaluations: WeeklyEvaluation[],
  warnings: StudentWarning[],
  submissions: WeeklySubmission[]
): TrustScore {
  const studentEvaluations = evaluations.filter((item) => item.studentId === studentId);
  const studentWarnings = warnings.filter((item) => item.studentId === studentId);
  const studentSubmissions = submissions.filter((item) => item.studentId === studentId);

  const evaluationScore = studentEvaluations.length
    ? studentEvaluations.reduce((sum, item) => {
        return sum + (item.communication + item.responsibility + item.quality + item.deadline + item.problemSolving + item.professionalism) / 6;
      }, 0) / studentEvaluations.length / 5 * 100
    : 82;

  const completionScore = studentSubmissions.length
    ? studentSubmissions.filter((item) => item.isEvaluated).length / studentSubmissions.length * 100
    : 80;

  const warningPenalty = studentWarnings.length * 12;
  const score = Math.max(0, Math.min(100, Math.round(evaluationScore * 0.65 + completionScore * 0.35 - warningPenalty)));

  return {
    entityId: studentId,
    entityType: 'STUDENT',
    score,
    evidence: [
      `${studentEvaluations.length} weekly evaluations`,
      `${studentSubmissions.length} submitted deliverables`,
      `${studentWarnings.length} administrative warnings`
    ],
    recalculatedAt: nowIso()
  };
}

export function updateStudentProfile(
  actor: Actor,
  current: StudentProfile,
  patch: Partial<StudentProfile>
): MutationResult<StudentProfile> {
  requireActiveVerified(actor, 'student.updated', 'student_profile', current.userId);
  requireRole(actor, [UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN], 'student.updated', 'student_profile', current.userId);
  if (actor.role === UserRole.STUDENT && actor.id !== current.userId) {
    deny(actor, 'student.updated', 'student_profile', current.userId, 'Students can only update their own profile.');
  }

  const next: StudentProfile = {
    ...current,
    ...patch,
    userId: current.userId,
    fullName: patch.fullName?.trim() ?? current.fullName,
    university: patch.university?.trim() ?? current.university,
    major: patch.major?.trim() ?? current.major,
    englishProficiency: patch.englishProficiency?.trim() ?? current.englishProficiency,
    skills: cleanStringArray(patch.skills, 'skills', actor) ?? current.skills,
    languages: cleanStringArray(patch.languages, 'languages', actor) ?? current.languages,
    certificates: cleanStringArray(patch.certificates, 'certificates', actor) ?? current.certificates,
    biography: patch.biography?.trim() ?? current.biography,
    careerGoals: patch.careerGoals?.trim() ?? current.careerGoals,
    profileVersion: (current.profileVersion ?? 1) + 1,
    updatedAt: nowIso()
  };

  assertText(next.fullName, 'fullName', actor, 'student_profile');
  assertText(next.university, 'university', actor, 'student_profile');
  assertText(next.major, 'major', actor, 'student_profile');
  assertText(next.englishProficiency, 'englishProficiency', actor, 'student_profile');
  if (!next.skills.length) deny(actor, 'validation.failed', 'student_profile', current.userId, 'At least one verified skill is required.');
  assertOptionalUrl(next.avatarUrl, 'avatarUrl', actor);
  assertOptionalUrl(next.portfolioUrl, 'portfolioUrl', actor);
  assertOptionalUrl(next.githubUrl, 'githubUrl', actor);
  assertOptionalUrl(next.linkedinUrl, 'linkedinUrl', actor);
  assertOptionalEmail(next.contactEmail, 'contactEmail', actor);

  const fields = changedFields(current as unknown as Record<string, unknown>, next as unknown as Record<string, unknown>);
  if (fields.length === 0) {
    deny(actor, 'validation.failed', 'student_profile', current.userId, 'Profile update must change at least one field.');
  }

  const profileVersion: ProfileVersion = {
    id: id('profile_version'),
    profileType: 'STUDENT',
    profileId: current.userId,
    version: next.profileVersion ?? 1,
    changedBy: actor.id,
    changedFields: fields,
    snapshot: next,
    createdAt: nowIso()
  };

  return {
    entity: next,
    profileVersion,
    events: [
      event('student.updated', actor, current.userId, { changedFields: fields, version: profileVersion.version }),
      event('ai.context_invalidated', actor, current.userId, { profileType: 'STUDENT', engines: ['memory', 'prompt', 'matching', 'growth', 'resume', 'portfolio', 'recommendation'] })
    ],
    auditLogs: [audit(actor, 'student.updated', 'student_profile', current.userId, 'ALLOW', 'Student profile updated with versioned evidence.', { changedFields: fields })],
    trustScores: []
  };
}

export function updateCompanyProfile(
  actor: Actor,
  current: CompanyProfile,
  patch: Partial<CompanyProfile>
): MutationResult<CompanyProfile> {
  requireActiveVerified(actor, 'company.updated', 'company_profile', current.userId);
  requireRole(actor, [UserRole.COMPANY, UserRole.ADMIN, UserRole.SUPER_ADMIN], 'company.updated', 'company_profile', current.userId);
  if (actor.role === UserRole.COMPANY && actor.id !== current.userId) {
    deny(actor, 'company.updated', 'company_profile', current.userId, 'Companies can only update their own profile.');
  }

  const next: CompanyProfile = {
    ...current,
    ...patch,
    userId: current.userId,
    companyName: patch.companyName?.trim() ?? current.companyName,
    industry: patch.industry?.trim() ?? current.industry,
    website: patch.website?.trim() ?? current.website,
    location: patch.location?.trim() ?? current.location,
    companySize: patch.companySize?.trim() ?? current.companySize,
    englishAvailability: patch.englishAvailability?.trim() ?? current.englishAvailability,
    hiringPreferences: cleanStringArray(patch.hiringPreferences, 'hiringPreferences', actor) ?? current.hiringPreferences,
    preferredMajors: cleanStringArray(patch.preferredMajors, 'preferredMajors', actor) ?? current.preferredMajors,
    preferredSkills: cleanStringArray(patch.preferredSkills, 'preferredSkills', actor) ?? current.preferredSkills,
    languages: cleanStringArray(patch.languages, 'languages', actor) ?? current.languages,
    profileVersion: (current.profileVersion ?? 1) + 1,
    updatedAt: nowIso()
  };

  assertText(next.companyName, 'companyName', actor, 'company_profile');
  assertText(next.industry, 'industry', actor, 'company_profile');
  assertText(next.location, 'location', actor, 'company_profile');
  assertOptionalUrl(next.logoUrl, 'logoUrl', actor);
  assertOptionalUrl(next.website, 'website', actor);
  assertOptionalEmail(next.contactEmail, 'contactEmail', actor);

  const fields = changedFields(current as unknown as Record<string, unknown>, next as unknown as Record<string, unknown>);
  if (fields.length === 0) {
    deny(actor, 'validation.failed', 'company_profile', current.userId, 'Profile update must change at least one field.');
  }

  const profileVersion: ProfileVersion = {
    id: id('profile_version'),
    profileType: 'COMPANY',
    profileId: current.userId,
    version: next.profileVersion ?? 1,
    changedBy: actor.id,
    changedFields: fields,
    snapshot: next,
    createdAt: nowIso()
  };

  return {
    entity: next,
    profileVersion,
    events: [
      event('company.updated', actor, current.userId, { changedFields: fields, version: profileVersion.version }),
      event('ai.context_invalidated', actor, current.userId, { profileType: 'COMPANY', engines: ['matching', 'recruiter', 'recommendation', 'trust', 'analytics'] })
    ],
    auditLogs: [audit(actor, 'company.updated', 'company_profile', current.userId, 'ALLOW', 'Company profile updated with versioned employer evidence.', { changedFields: fields })],
    trustScores: []
  };
}

export function submitApplication(
  actor: Actor,
  state: PlatformState,
  input: { projectId: string; coverLetter: string; portfolioUrl?: string }
): MutationResult<Application> {
  requireActiveVerified(actor, 'application.submitted', 'project', input.projectId);
  requireRole(actor, [UserRole.STUDENT], 'application.submitted', 'project', input.projectId);

  const student = state.studentProfiles.find((item) => item.userId === actor.id);
  const project = state.projects.find((item) => item.id === input.projectId);
  if (!student || !project) deny(actor, 'validation.failed', 'application', input.projectId, 'Student and project records must exist.');
  if (project.status !== ProjectStatus.OPEN) deny(actor, 'application.submitted', 'project', project.id, 'Applications are only allowed for open projects.');
  if (state.applications.some((item) => item.projectId === project.id && item.studentId === actor.id)) {
    deny(actor, 'application.submitted', 'project', project.id, 'Duplicate applications are blocked to preserve evaluation integrity.');
  }
  assertText(input.coverLetter, 'coverLetter', actor, 'application');

  const entity: Application = {
    id: id('app'),
    projectId: project.id,
    projectTitle: project.title,
    companyName: project.companyName,
    studentId: actor.id,
    studentName: student.fullName,
    studentAvatar: student.avatarUrl,
    status: ApplicationStatus.SUBMITTED,
    appliedAt: nowIso(),
    portfolioUrl: input.portfolioUrl,
    coverLetter: input.coverLetter.trim()
  };

  const events = [event('application.submitted', actor, entity.id, { projectId: project.id, studentId: actor.id })];
  const auditLogs = [audit(actor, 'application.submitted', 'application', entity.id, 'ALLOW', 'Verified student submitted project-first hiring evidence.')];
  const trustScores = [calculateStudentTrustScore(actor.id, state.evaluations, state.warnings, state.submissions)];
  return { entity, events, auditLogs, trustScores };
}

export function createProject(
  actor: Actor,
  company: CompanyProfile,
  input: Omit<Project, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'createdAt'>
): MutationResult<Project> {
  requireActiveVerified(actor, 'project.created', 'company', actor.id);
  requireRole(actor, [UserRole.COMPANY], 'project.created', 'company', actor.id);
  if (company.verificationStatus !== 'VERIFIED') deny(actor, 'project.created', 'company', actor.id, 'Only verified companies can publish projects.');
  assertText(input.title, 'title', actor, 'project');
  assertText(input.description, 'description', actor, 'project');
  assertText(input.expectedOutcome, 'expectedOutcome', actor, 'project');
  if (input.durationWeeks < 1 || input.durationWeeks > 12) deny(actor, 'validation.failed', 'project', 'durationWeeks', 'Projects must run between 1 and 12 weeks.');
  if (input.weeklyHours < 1 || input.weeklyHours > 30) deny(actor, 'validation.failed', 'project', 'weeklyHours', 'Weekly commitment must remain feasible for international students.');
  if (input.requiredSkills.length === 0) deny(actor, 'validation.failed', 'project', 'requiredSkills', 'Projects require evidence-based skill criteria.');

  const entity: Project = {
    ...input,
    id: id('proj'),
    companyId: actor.id,
    companyName: company.companyName,
    companyLogo: company.logoUrl,
    status: input.status === ProjectStatus.DRAFT ? ProjectStatus.PENDING_APPROVAL : input.status,
    createdAt: nowIso()
  };

  return {
    entity,
    events: [event('project.created', actor, entity.id, { companyId: actor.id, status: entity.status })],
    auditLogs: [audit(actor, 'project.created', 'project', entity.id, 'ALLOW', 'Company created a project with transparent deliverables.')],
    trustScores: []
  };
}

export function updateApplicationStatus(
  actor: Actor,
  application: Application,
  status: ApplicationStatus
): MutationResult<Application> {
  requireActiveVerified(actor, 'application.status_changed', 'application', application.id);
  requireRole(actor, [UserRole.COMPANY, UserRole.ADMIN, UserRole.SUPER_ADMIN], 'application.status_changed', 'application', application.id);
  if (application.status === ApplicationStatus.WITHDRAWN) deny(actor, 'application.status_changed', 'application', application.id, 'Withdrawn applications are immutable.');
  if (application.status === ApplicationStatus.ACCEPTED && status !== ApplicationStatus.ACCEPTED) {
    deny(actor, 'application.status_changed', 'application', application.id, 'Accepted project commitments cannot be silently downgraded.');
  }

  const entity = { ...application, status };
  return {
    entity,
    events: [event('application.status_changed', actor, entity.id, { previousStatus: application.status, status })],
    auditLogs: [audit(actor, 'application.status_changed', 'application', entity.id, 'ALLOW', 'Application decision recorded with traceable company accountability.')],
    trustScores: []
  };
}

export function approveUserVerification(
  actor: Actor,
  target: User,
  companyProfile?: CompanyProfile
): MutationResult<{ user: User; companyProfile?: CompanyProfile }> {
  requireActiveVerified(actor, 'verification.approved', 'user', target.id);
  requireRole(actor, [UserRole.ADMIN, UserRole.SUPER_ADMIN], 'verification.approved', 'user', target.id);
  if (![UserRole.STUDENT, UserRole.COMPANY].includes(target.role)) {
    deny(actor, 'verification.approved', 'user', target.id, 'Only student and company accounts can be approved through verification workflows.');
  }

  const user = { ...target, isVerified: true, status: 'ACTIVE' as const };
  const approvedCompanyProfile = target.role === UserRole.COMPANY && companyProfile
    ? { ...companyProfile, verificationStatus: 'VERIFIED' as const }
    : companyProfile;

  return {
    entity: { user, companyProfile: approvedCompanyProfile },
    events: [event('verification.approved', actor, target.id, { role: target.role })],
    auditLogs: [audit(actor, 'verification.approved', 'user', target.id, 'ALLOW', 'Verified identity approved for project-first hiring participation.')],
    trustScores: []
  };
}

export function issueStudentWarning(
  actor: Actor,
  state: PlatformState,
  input: { studentId: string; reason: string }
): MutationResult<StudentWarning> {
  requireActiveVerified(actor, 'warning.issued', 'student', input.studentId);
  requireRole(actor, [UserRole.ADMIN, UserRole.SUPER_ADMIN], 'warning.issued', 'student', input.studentId);
  const student = state.users.find((item) => item.id === input.studentId && item.role === UserRole.STUDENT);
  if (!student) deny(actor, 'validation.failed', 'student', input.studentId, 'Student account must exist before a warning can be issued.');
  assertText(input.reason, 'reason', actor, 'student_warning');

  const entity: StudentWarning = {
    id: id('warn'),
    studentId: input.studentId,
    reason: input.reason.trim(),
    createdAt: nowIso()
  };

  return {
    entity,
    events: [event('warning.issued', actor, entity.id, { studentId: input.studentId })],
    auditLogs: [audit(actor, 'warning.issued', 'student_warning', entity.id, 'ALLOW', 'Administrative warning issued with transparent reason.')],
    trustScores: [calculateStudentTrustScore(input.studentId, state.evaluations, [...state.warnings, entity], state.submissions)]
  };
}

export function submitWeeklyEvaluation(
  actor: Actor,
  state: PlatformState,
  input: Omit<WeeklyEvaluation, 'id' | 'evaluatedAt'>
): MutationResult<WeeklyEvaluation> {
  requireActiveVerified(actor, 'evaluation.weekly_created', 'submission', input.submissionId);
  requireRole(actor, [UserRole.COMPANY], 'evaluation.weekly_created', 'submission', input.submissionId);
  const submission = state.submissions.find((item) => item.id === input.submissionId);
  const project = state.projects.find((item) => item.id === input.projectId);
  if (!submission || !project) deny(actor, 'validation.failed', 'weekly_evaluation', input.submissionId, 'Submission and project must exist.');
  if (project.companyId !== actor.id) deny(actor, 'evaluation.weekly_created', 'project', project.id, 'Only the project owner can evaluate deliverables.');
  if (submission.isEvaluated) deny(actor, 'evaluation.weekly_created', 'submission', submission.id, 'Each weekly submission can receive one official evaluation.');
  ['communication', 'responsibility', 'quality', 'deadline', 'problemSolving', 'professionalism'].forEach((field) => {
    assertRating(input[field as keyof typeof input] as number, field, actor);
  });
  assertText(input.comment, 'comment', actor, 'weekly_evaluation');

  const entity: WeeklyEvaluation = { ...input, id: id('eval'), evaluatedAt: nowIso() };
  return {
    entity,
    events: [event('evaluation.weekly_created', actor, entity.id, { projectId: input.projectId, studentId: input.studentId, weekNumber: input.weekNumber })],
    auditLogs: [audit(actor, 'evaluation.weekly_created', 'weekly_evaluation', entity.id, 'ALLOW', 'Evidence-based weekly evaluation recorded.')],
    trustScores: [calculateStudentTrustScore(input.studentId, [...state.evaluations, entity], state.warnings, state.submissions)]
  };
}

export function submitFinalEvaluation(
  actor: Actor,
  state: PlatformState,
  input: { projectId: string; studentId: string; hiringDecision: HiringDecision; feedback: string }
) {
  requireActiveVerified(actor, 'evaluation.final_created', 'project', input.projectId);
  requireRole(actor, [UserRole.COMPANY], 'evaluation.final_created', 'project', input.projectId);
  const project = state.projects.find((item) => item.id === input.projectId);
  if (!project || project.companyId !== actor.id) deny(actor, 'evaluation.final_created', 'project', input.projectId, 'Only the project owner can finalize hiring decisions.');
  assertText(input.feedback, 'feedback', actor, 'final_evaluation');

  const related = state.evaluations.filter((item) => item.projectId === input.projectId && item.studentId === input.studentId);
  if (related.length === 0) deny(actor, 'evaluation.final_created', 'project', input.projectId, 'Final hiring decisions require weekly evidence.');

  const avg = (field: keyof Pick<WeeklyEvaluation, 'communication' | 'responsibility' | 'quality' | 'deadline' | 'problemSolving' | 'professionalism'>) =>
    Number((related.reduce((sum, item) => sum + item[field], 0) / related.length).toFixed(2));

  const entity = {
    projectId: input.projectId,
    studentId: input.studentId,
    avgCommunication: avg('communication'),
    avgResponsibility: avg('responsibility'),
    avgQuality: avg('quality'),
    avgDeadline: avg('deadline'),
    avgProblemSolving: avg('problemSolving'),
    avgProfessionalism: avg('professionalism'),
    overallSatisfaction: Number(((avg('communication') + avg('responsibility') + avg('quality') + avg('deadline') + avg('problemSolving') + avg('professionalism')) / 6).toFixed(2)),
    hiringDecision: input.hiringDecision,
    feedback: input.feedback.trim(),
    completedAt: nowIso()
  };

  return {
    entity,
    events: [event('evaluation.final_created', actor, input.projectId, { studentId: input.studentId, hiringDecision: input.hiringDecision })],
    auditLogs: [audit(actor, 'evaluation.final_created', 'project', input.projectId, 'ALLOW', 'Final hiring decision derived from weekly evidence.')],
    trustScores: [calculateStudentTrustScore(input.studentId, state.evaluations, state.warnings, state.submissions)]
  };
}
