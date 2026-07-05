import { Suspense, lazy, useState, useEffect } from 'react';
import { getStoredState, saveStoredState } from './mockData';
import { 
  User, 
  UserRole, 
  StudentProfile, 
  CompanyProfile, 
  Project, 
  ProjectStatus, 
  Application, 
  ApplicationStatus, 
  WeeklySubmission, 
  WeeklyEvaluation, 
  FinalProjectEvaluation, 
  Notification,
  HiringDecision,
  CompanyEvaluation,
  StudentWarning
} from './types';
import LandingPage from './components/LandingPage';
import AuthModule from './components/AuthModule';
import { Archive, Bell, CheckCheck, Info, Sparkles, RefreshCw, Layers, X } from 'lucide-react';
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
  updateApplicationStatus,
  updateProjectStatus,
  type PlatformState
} from './platform/domain/enterpriseCore';
import { appendOperationalRecords, recordDeniedAction } from './platform/services/operationalStore';
import {
  createRemoteProject,
  approveRemoteVerification,
  getRemotePlatformState,
  getRemoteNotifications,
  issueRemoteStudentWarning,
  isKonexaApiEnabled,
  loginRemoteAccount,
  markAllRemoteNotificationsRead,
  registerRemoteAccount,
  submitRemoteApplication,
  submitRemoteFinalEvaluation,
  submitRemoteWeeklyDeliverable,
  submitRemoteWeeklyEvaluation,
  updateRemoteNotificationLifecycle,
  updateRemoteCompanyProfile,
  updateRemoteProjectStatus,
  updateRemoteStudentProfile,
  updateRemoteApplicationStatus,
  type RemotePlatformState
} from './platform/services/apiClient';

const StudentDashboard = lazy(() => import('./components/StudentDashboard'));
const CompanyDashboard = lazy(() => import('./components/CompanyDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

export default function App() {
  // Navigation state
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'PLATFORM'>('LANDING');
  const [authInitialRole, setAuthInitialRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>('STUDENT');

  // Core synchronized application state
  const [users, setUsers] = useState<User[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<WeeklySubmission[]>([]);
  const [evaluations, setEvaluations] = useState<WeeklyEvaluation[]>([]);
  const [finalEvaluations, setFinalEvaluations] = useState<FinalProjectEvaluation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [companyEvaluations, setCompanyEvaluations] = useState<CompanyEvaluation[]>([]);
  const [warnings, setWarnings] = useState<StudentWarning[]>([]);
  const [isRemoteState, setIsRemoteState] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Authenticated User Session state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>(''); // Matches user ID

  const applyPlatformState = (state: RemotePlatformState) => {
    setUsers(state.users);
    setStudentProfiles(state.studentProfiles);
    setCompanyProfiles(state.companyProfiles);
    setProjects(state.projects);
    setApplications(state.applications);
    setSubmissions(state.submissions);
    setEvaluations(state.evaluations);
    setFinalEvaluations(state.finalEvaluations);
    setNotifications(state.notifications);
    setCompanyEvaluations(state.companyEvaluations || []);
    setWarnings(state.warnings || []);
  };

  const refreshRemoteState = async () => {
    const state = await getRemotePlatformState();
    applyPlatformState(state);
    setIsRemoteState(true);
  };

  const shouldUseRemoteApi = () => isKonexaApiEnabled() && isRemoteState;

  const reportApiError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'KONEXA API request failed.';
    if (currentUser) {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'KONEXA API Action Failed',
        message,
        type: 'error',
        priority: 'HIGH',
        category: 'SYSTEM',
        channels: ['IN_APP'],
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Load state from API when configured, otherwise localStorage.
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      if (isKonexaApiEnabled()) {
        try {
          const remoteState = await getRemotePlatformState();
          if (!isCancelled) {
            applyPlatformState(remoteState);
            setIsRemoteState(true);
          }
          return;
        } catch {
          if (!isCancelled) setIsRemoteState(false);
        }
      }

      if (!isCancelled) {
        const state = getStoredState();
        applyPlatformState(state);
        setIsRemoteState(false);
      }
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Save state to localStorage when changes occur
  useEffect(() => {
    if (isRemoteState) return;
    if (users.length === 0) return; // Prevent overwriting during initial blank render
    saveStoredState({
      users,
      studentProfiles,
      companyProfiles,
      projects,
      applications,
      submissions,
      evaluations,
      finalEvaluations,
      notifications,
      companyEvaluations,
      warnings
    });
  }, [isRemoteState, users, studentProfiles, companyProfiles, projects, applications, submissions, evaluations, finalEvaluations, notifications, companyEvaluations, warnings]);

  // Reset demo state helper
  const handleResetDemoState = () => {
    if (window.confirm('Reset local KONEXA operating data? This clears browser-stored audit, trust, and workflow state.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const platformState = (): PlatformState => ({
    users,
    studentProfiles,
    companyProfiles,
    projects,
    applications,
    submissions,
    evaluations,
    companyEvaluations,
    warnings
  });

  const reportDomainError = (error: unknown) => {
    if (error instanceof DomainRuleError && currentUser) {
      recordDeniedAction(error.auditLogs);
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Action Blocked by KONEXA Rules',
        message: error.message,
        type: 'warning',
        priority: 'HIGH',
        category: 'SYSTEM',
        channels: ['IN_APP'],
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
      return;
    }
    throw error;
  };

  // Auth Handler
  const handleAuthSuccess = (role: UserRole, email: string, isVerified: boolean, profileId: string) => {
    // Locate or create user
    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        id: profileId,
        email,
        role,
        isVerified,
        status: isVerified ? 'ACTIVE' : 'PENDING',
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, user!]);
    }

    setCurrentUser(user);
    setActiveProfileId(profileId);
    setView('PLATFORM');
  };

  const openUserWorkspace = (user: User) => {
    setCurrentUser(user);
    setActiveProfileId(user.id);
    setView('PLATFORM');
  };

  const handleEmailLogin = async (input: { role: 'STUDENT' | 'COMPANY' | 'ADMIN'; email: string; password: string }) => {
    if (shouldUseRemoteApi()) {
      const result = await loginRemoteAccount(input);
      await refreshRemoteState();
      openUserWorkspace(result.user);
      return;
    }

    const user = users.find(item => item.email.toLowerCase() === input.email.toLowerCase() && item.role === input.role);
    if (!user) {
      throw new Error('No KONEXA account was found for that email and role.');
    }
    openUserWorkspace(user);
  };

  const handleEmailRegister = async (input:
    | { role: 'STUDENT'; email: string; password: string; fullName: string; university?: string; major: string }
    | { role: 'COMPANY'; email: string; password: string; companyName: string; businessRegistrationFile: string }
  ) => {
    if (shouldUseRemoteApi()) {
      const result = await registerRemoteAccount(input);
      await refreshRemoteState();
      openUserWorkspace(result.user);
      return;
    }

    if (users.some(item => item.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error('This email is already registered.');
    }

    const result = input.role === 'STUDENT'
      ? registerStudentAccount(input)
      : registerCompanyAccount(input);
    setUsers(prev => [...prev, result.entity.user]);
    if (input.role === 'STUDENT') {
      const studentResult = result as ReturnType<typeof registerStudentAccount>;
      setStudentProfiles(prev => [...prev, studentResult.entity.studentProfile]);
    }
    if (input.role === 'COMPANY') {
      const companyResult = result as ReturnType<typeof registerCompanyAccount>;
      setCompanyProfiles(prev => [...prev, companyResult.entity.companyProfile]);
    }
    appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });
    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      userId: result.entity.user.id,
      title: 'Account Created',
      message: 'Your KONEXA profile is ready. Complete your profile while verification is reviewed.',
      type: 'success',
      priority: 'HIGH',
      category: 'SYSTEM',
      channels: ['IN_APP', 'EMAIL'],
      isRead: false,
      createdAt: new Date().toISOString()
    }, ...prev]);
    openUserWorkspace(result.entity.user);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveProfileId('');
    setView('LANDING');
  };

  // Student Actions
  const handleApplyProject = async (projectId: string, coverLetter: string, portfolioUrl?: string) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await submitRemoteApplication(currentUser.id, projectId, coverLetter, portfolioUrl);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    try {
      const result = submitApplication(currentUser, platformState(), { projectId, coverLetter, portfolioUrl });
      setApplications(prev => [...prev, result.entity]);
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: projects.find(p => p.id === projectId)?.companyId || '',
        title: 'New Project Applicant',
        message: `${result.entity.studentName} has applied for your project: "${result.entity.projectTitle}".`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleSubmitWeeklyDeliverable = (
    projectId: string,
    weekNumber: number,
    deliverableFile: string,
    progressReport: string,
    reflection: string
  ) => {
    if (currentUser && shouldUseRemoteApi()) {
      submitRemoteWeeklyDeliverable(currentUser.id, projectId, { weekNumber, deliverableFile, progressReport, reflection })
        .then(refreshRemoteState)
        .catch(reportApiError);
      return;
    }

    const newSubmission: WeeklySubmission = {
      id: `sub_${projectId}_w${weekNumber}_${Date.now()}`,
      projectId,
      studentId: activeProfileId,
      weekNumber,
      submittedAt: new Date().toISOString(),
      deliverableFile,
      progressReport,
      reflection,
      isEvaluated: false
    };

    setSubmissions(prev => [...prev, newSubmission]);

    // Send Notification to SME company
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: proj.companyId,
        title: 'New Weekly Submission',
        message: `Student Minh Anh has submitted Week ${weekNumber} deliverables.`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleUpdateStudentProfile = async (updatedProfile: StudentProfile) => {
    if (currentUser && shouldUseRemoteApi()) {
      try {
        await updateRemoteStudentProfile(currentUser.id, updatedProfile.userId, updatedProfile);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    setStudentProfiles(prev => prev.map(s => s.userId === updatedProfile.userId ? updatedProfile : s));
  };

  const handleUpdateCompanyProfile = async (updatedProfile: CompanyProfile) => {
    if (currentUser && shouldUseRemoteApi()) {
      try {
        await updateRemoteCompanyProfile(currentUser.id, updatedProfile.userId, updatedProfile);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    setCompanyProfiles(prev => prev.map(c => c.userId === updatedProfile.userId ? updatedProfile : c));
    setProjects(prev => prev.map(p => p.companyId === updatedProfile.userId ? { ...p, companyName: updatedProfile.companyName, companyLogo: updatedProfile.logoUrl } : p));
  };

  // Company Actions
  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'createdAt'>) => {
    const comp = companyProfiles.find(c => c.userId === activeProfileId);
    if (!comp || !currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await createRemoteProject(currentUser.id, projectData);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    try {
      const result = createProject(currentUser, comp, projectData);
      setProjects(prev => [...prev, result.entity]);
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await updateRemoteApplicationStatus(currentUser.id, applicationId, status);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    const target = applications.find(app => app.id === applicationId);
    if (!target) return;
    try {
      const result = updateApplicationStatus(currentUser, target, status);
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });
      setApplications(prev => prev.map(app => app.id === applicationId ? result.entity : app));
      if (status === ApplicationStatus.ACCEPTED) {
        setProjects(prevProj => prevProj.map(p => p.id === target.projectId ? { ...p, status: ProjectStatus.RUNNING } : p));
      }

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: target.studentId,
        title: `Application Status Update`,
        message: `Your application to "${target.projectTitle}" has been ${status.toLowerCase()}.`,
        type: status === ApplicationStatus.ACCEPTED ? 'success' : 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prevN => [newNotif, ...prevN]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await updateRemoteProjectStatus(currentUser.id, projectId, status);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    const project = projects.find(item => item.id === projectId);
    if (!project) return;
    try {
      const result = updateProjectStatus(currentUser, project, status);
      setProjects(prev => prev.map(item => item.id === projectId ? result.entity : item));
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: project.companyId,
        title: 'Project Status Updated',
        message: `"${project.title}" is now ${status}.`,
        type: status === ProjectStatus.OPEN ? 'success' : 'info',
        priority: status === ProjectStatus.OPEN ? 'HIGH' : 'NORMAL',
        category: 'PROJECT',
        channels: ['IN_APP'],
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleSubmitWeeklyEvaluation = (
    submissionId: string,
    projectId: string,
    studentId: string,
    weekNumber: number,
    evalData: {
      communication: number;
      responsibility: number;
      quality: number;
      deadline: number;
      problemSolving: number;
      professionalism: number;
      comment: string;
    }
  ) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      submitRemoteWeeklyEvaluation(currentUser.id, submissionId, evalData)
        .then(refreshRemoteState)
        .catch(reportApiError);
      return;
    }

    try {
      const result = submitWeeklyEvaluation(currentUser, platformState(), {
        submissionId,
        projectId,
        studentId,
        weekNumber,
        ...evalData
      });
      setEvaluations(prev => [...prev, result.entity]);
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, isEvaluated: true } : s));
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: studentId,
        title: `Week ${weekNumber} Grades Published`,
        message: `Your technical evaluation score has been posted. Avg rating: ${((evalData.communication + evalData.quality + evalData.responsibility) / 3).toFixed(1)}/5 Stars.`,
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleSubmitFinalHiring = async (projectId: string, studentId: string, decision: HiringDecision, feedback: string) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await submitRemoteFinalEvaluation(currentUser.id, projectId, { studentId, hiringDecision: decision, feedback });
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    try {
      const result = submitFinalEvaluation(currentUser, platformState(), { projectId, studentId, hiringDecision: decision, feedback });
      setFinalEvaluations(prev => [...prev, result.entity]);
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });

      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: ProjectStatus.COMPLETED } : p));

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: studentId,
        title: `Hiring Pipeline Choice Finalized`,
        message: `A verified company has selected action: [${decision.replace('_', ' ')}] for your profile. Endorsement posted.`,
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  // Admin Actions
  const handleApproveStudent = async (studentId: string) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await approveRemoteVerification(currentUser.id, studentId);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    const target = users.find(u => u.id === studentId);
    if (!target) return;
    try {
      const result = approveUserVerification(currentUser, target);
      setUsers(prev => prev.map(u => u.id === studentId ? result.entity.user : u));
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: studentId,
        title: 'RMIT Account Verified',
        message: 'Your university credentials have been verified by KONEXA Admins. You are now authorized to apply for global projects.',
        type: 'success',
        priority: 'HIGH',
        category: 'TRUST',
        channels: ['IN_APP', 'EMAIL'],
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleApproveCompany = async (companyId: string) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await approveRemoteVerification(currentUser.id, companyId);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    const target = users.find(u => u.id === companyId);
    const companyProfile = companyProfiles.find(c => c.userId === companyId);
    if (!target) return;
    try {
      const result = approveUserVerification(currentUser, target, companyProfile);
      setUsers(prev => prev.map(u => u.id === companyId ? result.entity.user : u));
      if (result.entity.companyProfile) {
        setCompanyProfiles(prev => prev.map(c => c.userId === companyId ? result.entity.companyProfile! : c));
      }
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });
    } catch (error) {
      reportDomainError(error);
    }
  };

  const handleSubmitCompanyEvaluation = (evalData: Omit<CompanyEvaluation, 'id' | 'submittedAt'>) => {
    const newEval: CompanyEvaluation = {
      ...evalData,
      id: `comp_eval_${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setCompanyEvaluations(prev => [...prev, newEval]);

    // Send notification to company
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: evalData.companyId,
      title: 'New Student Review Received',
      message: 'A student has submitted feedback regarding their collaboration with you. Average rating details have been updated.',
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleIssueWarning = async (studentId: string, reason: string) => {
    if (!currentUser) return;
    if (shouldUseRemoteApi()) {
      try {
        await issueRemoteStudentWarning(currentUser.id, studentId, reason);
        await refreshRemoteState();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    try {
      const result = issueStudentWarning(currentUser, platformState(), { studentId, reason });
      setWarnings(prev => [result.entity, ...prev]);
      appendOperationalRecords({ auditLogs: result.auditLogs, domainEvents: result.events, trustScores: result.trustScores });

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: studentId,
        title: 'Administrator Action Warning',
        message: `You have received a formal warning: "${reason}". Three warnings trigger program review.`,
        type: 'warning',
        priority: 'CRITICAL',
        category: 'TRUST',
        channels: ['IN_APP', 'EMAIL'],
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      reportDomainError(error);
    }
  };

  const visibleNotifications = currentUser
    ? notifications
        .filter(item => item.userId === currentUser.id && !item.archivedAt && !item.dismissedAt)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    : [];
  const unreadCount = visibleNotifications.filter(item => !item.isRead).length;

  const syncNotificationsOnly = async () => {
    if (!currentUser || !shouldUseRemoteApi()) return;
    const response = await getRemoteNotifications(currentUser.id, { limit: 100 });
    setNotifications(prev => [
      ...response.items,
      ...prev.filter(item => item.userId !== currentUser.id)
    ]);
  };

  const patchNotificationLocal = (notificationId: string, patch: Partial<Notification>) => {
    setNotifications(prev => prev.map(item => item.id === notificationId ? { ...item, ...patch } : item));
  };

  const handleNotificationAction = async (notificationId: string, action: 'read' | 'archive' | 'dismiss') => {
    const now = new Date().toISOString();
    const localPatch: Partial<Notification> = action === 'read'
      ? { isRead: true, readAt: now }
      : action === 'archive'
        ? { isRead: true, readAt: now, archivedAt: now }
        : { isRead: true, readAt: now, dismissedAt: now };

    if (currentUser && shouldUseRemoteApi()) {
      try {
        const updated = await updateRemoteNotificationLifecycle(currentUser.id, notificationId, action);
        patchNotificationLocal(notificationId, updated);
        await syncNotificationsOnly();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    patchNotificationLocal(notificationId, localPatch);
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    if (shouldUseRemoteApi()) {
      try {
        await markAllRemoteNotificationsRead(currentUser.id);
        await syncNotificationsOnly();
      } catch (error) {
        reportApiError(error);
      }
      return;
    }

    setNotifications(prev => prev.map(item => item.userId === currentUser.id && !item.archivedAt && !item.dismissedAt ? { ...item, isRead: true, readAt: now } : item));
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      
      {/* Local operator toolbar */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-2.5 flex flex-wrap justify-between items-center gap-3 relative z-50 text-[11px] font-mono font-medium text-neutral-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>KONEXA Enterprise Operating Console</span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationCenterOpen(prev => !prev)}
                className="relative inline-flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-950/80 p-2 text-neutral-300 shadow-sm transition-colors hover:border-neutral-700 hover:text-white"
                aria-label="Open notification center"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-emerald-400 px-1 text-[9px] font-bold leading-4 text-neutral-950">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationCenterOpen && (
                <div className="absolute right-0 top-10 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/40">
                  <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-white">Notifications</p>
                      <p className="text-[10px] text-neutral-500">{unreadCount} unread updates</p>
                    </div>
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="inline-flex items-center gap-1 rounded-md border border-neutral-800 px-2 py-1 text-[10px] text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
                    >
                      <CheckCheck className="h-3 w-3" /> Read all
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {visibleNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-neutral-500">No active notifications.</div>
                    ) : visibleNotifications.slice(0, 8).map(item => (
                      <div key={item.id} className="border-b border-neutral-900 px-4 py-3 last:border-b-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {!item.isRead && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                              <p className="truncate text-xs font-semibold text-white">{item.title}</p>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-neutral-400">{item.message}</p>
                            <div className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-wide text-neutral-600">
                              <span>{item.category ?? 'SYSTEM'}</span>
                              <span>{item.priority ?? 'NORMAL'}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            {!item.isRead && (
                              <button onClick={() => handleNotificationAction(item.id, 'read')} className="rounded p-1 text-neutral-500 hover:bg-neutral-900 hover:text-white" aria-label="Mark notification read">
                                <CheckCheck className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button onClick={() => handleNotificationAction(item.id, 'archive')} className="rounded p-1 text-neutral-500 hover:bg-neutral-900 hover:text-white" aria-label="Archive notification">
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleNotificationAction(item.id, 'dismiss')} className="rounded p-1 text-neutral-500 hover:bg-neutral-900 hover:text-white" aria-label="Dismiss notification">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => { setView('LANDING'); setCurrentUser(null); }} 
            className="hover:text-white transition-colors"
          >
            [ Landing Page ]
          </button>
          <button 
            onClick={() => { setView('AUTH'); setIsLoginMode(true); }} 
            className="hover:text-white transition-colors text-emerald-400"
          >
            [ Auth Gateway ]
          </button>
          
          <span className="text-neutral-700">|</span>
          
          <button 
            onClick={handleResetDemoState}
            className="hover:text-rose-400 flex items-center gap-1 transition-colors text-rose-500 font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> [ Reset States ]
          </button>
        </div>
      </div>

      {/* Main Routing Views */}
      {view === 'LANDING' && (
        <LandingPage 
          onEnterPlatform={(role) => {
            if (role) {
              setAuthInitialRole(role);
            }
            setView('AUTH');
          }} 
        />
      )}

      {view === 'AUTH' && (
        <AuthModule 
          initialRole={authInitialRole}
          onSuccess={handleAuthSuccess}
          onLogin={handleEmailLogin}
          onRegister={handleEmailRegister}
          onBackToLanding={() => setView('LANDING')}
        />
      )}

      {view === 'PLATFORM' && currentUser && (
        <Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-sm text-neutral-400">Loading KONEXA workspace...</div>}>
        <div>
          {currentUser.role === UserRole.STUDENT && (
            <StudentDashboard 
              studentProfile={studentProfiles.find(s => s.userId === activeProfileId) || studentProfiles[0]}
              allProjects={projects}
              allApplications={applications}
              allSubmissions={submissions}
              allEvaluations={evaluations}
              allCompanyEvaluations={companyEvaluations}
              warnings={warnings.filter(w => w.studentId === activeProfileId)}
              onSubmitCompanyEvaluation={handleSubmitCompanyEvaluation}
              onApplyProject={handleApplyProject}
              onSubmitWeeklyDeliverable={handleSubmitWeeklyDeliverable}
              onUpdateProfile={handleUpdateStudentProfile}
              onLogout={handleLogout}
            />
          )}

          {currentUser.role === UserRole.COMPANY && (
            <CompanyDashboard 
              companyProfile={companyProfiles.find(c => c.userId === activeProfileId) || companyProfiles[0]}
              allProjects={projects}
              allApplications={applications}
              allSubmissions={submissions}
              allEvaluations={evaluations}
              allCompanyEvaluations={companyEvaluations}
              allStudents={studentProfiles}
              allWarnings={warnings}
              allUsers={users}
              onCreateProject={handleCreateProject}
              onUpdateCompanyProfile={handleUpdateCompanyProfile}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onSubmitWeeklyEvaluation={handleSubmitWeeklyEvaluation}
              onSubmitFinalHiring={handleSubmitFinalHiring}
              onLogout={handleLogout}
            />
          )}

          {currentUser.role === UserRole.ADMIN && (
            <AdminDashboard 
              allUsers={users}
              allStudents={studentProfiles}
              allCompanies={companyProfiles}
              allCompanyEvaluations={companyEvaluations}
              warnings={warnings}
              allProjects={projects}
              allApplications={applications}
              allSubmissions={submissions}
              allEvaluations={evaluations}
              setUsers={setUsers}
              setStudentProfiles={setStudentProfiles}
              setCompanyProfiles={setCompanyProfiles}
              setWarnings={setWarnings}
              onIssueWarning={handleIssueWarning}
              onApproveStudent={handleApproveStudent}
              onApproveCompany={handleApproveCompany}
              onUpdateProjectStatus={handleUpdateProjectStatus}
              onLogout={handleLogout}
            />
          )}
        </div>
        </Suspense>
      )}
    </div>
  );
}

// Helper to toggle modal logins
function setIsLoginMode(isLogin: boolean) {
  // Mock action trigger
}
