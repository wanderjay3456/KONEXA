export enum UserRole {
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  OPEN = 'OPEN',
  MATCHED = 'MATCHED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum HiringDecision {
  HIRE = 'HIRE',
  TALENT_POOL = 'TALENT_POOL',
  REJECT = 'REJECT',
  FUTURE_CONTACT = 'FUTURE_CONTACT',
  PENDING = 'PENDING'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  status: 'PENDING' | 'VERIFIED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  avatarUrl: string;
  university: string;
  major: string;
  graduationDate: string;
  englishProficiency: string;
  languages?: string[];
  skills: string[];
  certificates?: string[];
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeFileName?: string;
  introVideoUrl?: string;
  preferredCountry: string;
  preferredIndustry: string;
  preferredRole: string;
  availability: string; // e.g. "20 hours/week"
  biography?: string;
  careerGoals?: string;
  contactEmail?: string;
  contactPhone?: string;
  notificationPreferences?: NotificationPreferences;
  privacySettings?: PrivacySettings;
  profileVersion?: number;
  updatedAt?: string;
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  logoUrl: string;
  industry: string;
  description?: string;
  website: string;
  location: string;
  companySize: string;
  englishAvailability: string;
  hiringPreferences?: string[];
  preferredMajors?: string[];
  preferredSkills?: string[];
  languages?: string[];
  recruitmentStatus?: 'OPEN' | 'PAUSED' | 'CLOSED';
  contactEmail?: string;
  contactPhone?: string;
  notificationPreferences?: NotificationPreferences;
  teamMembers?: CompanyTeamMember[];
  employerBranding?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  businessRegistrationFile?: string;
  profileVersion?: number;
  updatedAt?: string;
}

export interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  projectUpdates: boolean;
  applicationUpdates: boolean;
  aiRecommendations: boolean;
  trustUpdates: boolean;
  weeklyReminders: boolean;
}

export interface PrivacySettings {
  showPortfolio: boolean;
  showGithub: boolean;
  showLinkedIn: boolean;
  allowCompanyDiscovery: boolean;
}

export interface CompanyTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface ProfileVersion {
  id: string;
  profileType: 'STUDENT' | 'COMPANY';
  profileId: string;
  version: number;
  changedBy: string;
  changedFields: string[];
  snapshot: StudentProfile | CompanyProfile;
  createdAt: string;
}

export interface ProjectMilestone {
  week: number;
  goal: string;
  deliverableDescription: string;
}

export interface Project {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  expectedOutcome: string;
  durationWeeks: number;
  compensation: string;
  requiredSkills: string[];
  weeklyHours: number;
  status: ProjectStatus;
  milestones: ProjectMilestone[];
  createdAt: string;
}

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  status: ApplicationStatus;
  appliedAt: string;
  portfolioUrl?: string;
  coverLetter?: string;
}

export interface WeeklySubmission {
  id: string;
  projectId: string;
  studentId: string;
  weekNumber: number;
  submittedAt: string;
  deliverableFile: string;
  progressReport: string;
  reflection: string;
  isEvaluated: boolean;
}

export interface WeeklyEvaluation {
  id: string;
  submissionId: string;
  projectId: string;
  studentId: string;
  weekNumber: number;
  communication: number; // 1-5 star
  responsibility: number; // 1-5 star
  quality: number; // 1-5 star
  deadline: number; // 1-5 star
  problemSolving: number; // 1-5 star
  professionalism: number; // 1-5 star
  comment: string;
  evaluatedAt: string;
}

export interface FinalProjectEvaluation {
  projectId: string;
  studentId: string;
  avgCommunication: number;
  avgResponsibility: number;
  avgQuality: number;
  avgDeadline: number;
  avgProblemSolving: number;
  avgProfessionalism: number;
  overallSatisfaction: number;
  hiringDecision: HiringDecision;
  feedback: string;
  completedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  category?: 'PROJECT' | 'APPLICATION' | 'MATCHING' | 'FEEDBACK' | 'REMINDER' | 'SYSTEM' | 'AI' | 'TRUST' | 'PERFORMANCE';
  channels?: ('IN_APP' | 'EMAIL')[];
  isRead: boolean;
  readAt?: string;
  archivedAt?: string;
  dismissedAt?: string;
  scheduledFor?: string;
  createdAt: string;
}

export interface CompanyEvaluation {
  id: string;
  projectId: string;
  studentId: string;
  companyId: string;
  communication: number;
  feedbackQuality: number;
  mentorship: number;
  taskClarity: number;
  responseSpeed: number;
  respect: number;
  learningOpportunity: number;
  workEnvironment: number;
  professionalism: number;
  comment: string;
  submittedAt: string;
}

export interface StudentWarning {
  id: string;
  studentId: string;
  reason: string;
  createdAt: string;
}
