import {
  ApplicationStatus,
  CompanyEvaluation,
  CompanyProfile,
  FinalProjectEvaluation,
  Notification,
  ProfileVersion,
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
  profileVersions?: ProfileVersion[];
}

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const apiBaseUrl = (env?.VITE_KONEXA_API_URL || '').replace(/\/$/, '');
const apiKey = env?.VITE_KONEXA_API_KEY || '';

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
      ...(apiKey ? { 'x-konexa-api-key': apiKey } : {}),
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

export function updateRemoteStudentProfile(actorId: string, studentId: string, patch: Partial<StudentProfile>) {
  return request<StudentProfile>(`/api/students/${studentId}/profile`, {
    method: 'PATCH',
    headers: actorHeaders(actorId),
    body: JSON.stringify(patch)
  });
}

export function updateRemoteCompanyProfile(actorId: string, companyId: string, patch: Partial<CompanyProfile>) {
  return request<CompanyProfile>(`/api/companies/${companyId}/profile`, {
    method: 'PATCH',
    headers: actorHeaders(actorId),
    body: JSON.stringify(patch)
  });
}

export function getRemoteNotifications(
  actorId: string,
  filters: { unread?: boolean; includeArchived?: boolean; includeDismissed?: boolean; category?: Notification['category']; limit?: number; offset?: number } = {}
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const query = params.toString();
  return request<{ items: Notification[]; total: number; limit: number; offset: number; unreadCount: number }>(`/api/notifications${query ? `?${query}` : ''}`, {
    headers: actorHeaders(actorId)
  });
}

export function updateRemoteNotificationLifecycle(actorId: string, notificationId: string, action: 'read' | 'archive' | 'dismiss') {
  return request<Notification>(`/api/notifications/${notificationId}/${action}`, {
    method: 'PATCH',
    headers: actorHeaders(actorId)
  });
}

export function markAllRemoteNotificationsRead(actorId: string) {
  return request<{ updated: number }>('/api/notifications/read-all', {
    method: 'PATCH',
    headers: actorHeaders(actorId)
  });
}

export function approveRemoteVerification(actorId: string, userId: string) {
  return request<{ user: User; companyProfile?: CompanyProfile }>(`/api/admin/verifications/${userId}/approve`, {
    method: 'POST',
    headers: actorHeaders(actorId)
  });
}

export function issueRemoteStudentWarning(actorId: string, studentId: string, reason: string) {
  return request<StudentWarning>(`/api/admin/students/${studentId}/warnings`, {
    method: 'POST',
    headers: actorHeaders(actorId),
    body: JSON.stringify({ reason })
  });
}
