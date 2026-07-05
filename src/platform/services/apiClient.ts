import {
  ApplicationStatus,
  CompanyEvaluation,
  CompanyProfile,
  FinalProjectEvaluation,
  Notification,
  Project,
  StudentProfile,
  StudentWarning,
  User,
  WeeklyEvaluation,
  WeeklySubmission
} from '../../types';

export interface RemotePlatformState {
  users: User[];
  studentProfiles: StudentProfile[];
  companyProfiles: CompanyProfile[];
  projects: Project[];
  applications: import('../../types').Application[];
  submissions: WeeklySubmission[];
  evaluations: WeeklyEvaluation[];
  finalEvaluations: FinalProjectEvaluation[];
  notifications: Notification[];
  companyEvaluations: CompanyEvaluation[];
  warnings: StudentWarning[];
}

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const apiBaseUrl = (env?.VITE_KONEXA_API_URL || '').replace(/\/$/, '');

export function isKonexaApiEnabled() {
  return apiBaseUrl.length > 0;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('KONEXA API URL is not configured.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }
    throw new Error(body.error?.message || `KONEXA API request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function actorHeaders(actorId: string) {
  return { 'x-konexa-user-id': actorId };
}

export function getRemotePlatformState() {
  return request<RemotePlatformState>('/api/state');
}

export function createRemoteProject(actorId: string, project: Omit<Project, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'createdAt'>) {
  return request<Project>('/api/projects', {
    method: 'POST',
    headers: actorHeaders(actorId),
    body: JSON.stringify(project)
  });
}

export function submitRemoteApplication(actorId: string, projectId: string, coverLetter: string, portfolioUrl?: string) {
  return request<import('../../types').Application>(`/api/projects/${projectId}/applications`, {
    method: 'POST',
    headers: actorHeaders(actorId),
    body: JSON.stringify({ coverLetter, portfolioUrl })
  });
}

export function updateRemoteApplicationStatus(actorId: string, applicationId: string, status: ApplicationStatus) {
  return request<import('../../types').Application>(`/api/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: actorHeaders(actorId),
    body: JSON.stringify({ status })
  });
}

export function submitRemoteWeeklyDeliverable(
  actorId: string,
  projectId: string,
  input: { weekNumber: number; deliverableFile: string; progressReport: string; reflection: string }
) {
  return request<WeeklySubmission>(`/api/projects/${projectId}/submissions`, {
    method: 'POST',
    headers: actorHeaders(actorId),
    body: JSON.stringify(input)
  });
}

export function submitRemoteWeeklyEvaluation(
  actorId: string,
  submissionId: string,
  input: Omit<WeeklyEvaluation, 'id' | 'submissionId' | 'projectId' | 'studentId' | 'weekNumber' | 'evaluatedAt'>
) {
  return request<WeeklyEvaluation>(`/api/submissions/${submissionId}/evaluations`, {
    method: 'POST',
    headers: actorHeaders(actorId),
    body: JSON.stringify(input)
  });
}

export function submitRemoteFinalEvaluation(
  actorId: string,
  projectId: string,
  input: { studentId: string; hiringDecision: FinalProjectEvaluation['hiringDecision']; feedback: string }
) {
  return request<FinalProjectEvaluation>(`/api/projects/${projectId}/final-evaluations`, {
    method: 'POST',
    headers: actorHeaders(actorId),
    body: JSON.stringify(input)
  });
}
