import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Brain,
  Users, 
  Building2, 
  CheckCircle, 
  X, 
  FileText, 
  AlertTriangle, 
  FileBadge, 
  Info,
  Clock,
  ArrowRight,
  Star,
  Sparkles,
  Plus,
  Search,
  Filter,
  Trash2,
  Download,
  RefreshCw,
  Send,
  MessageSquare,
  Activity,
  UserCheck,
  Server,
  Eye,
  BarChart3,
  Database,
  MapPin,
  UserX,
  Megaphone,
  Lock,
  ExternalLink,
  Sliders,
  Check,
  Mail,
  Terminal,
  Layers,
  Cpu,
  Award,
  Scale,
  ListOrdered,
  GitBranch,
  Briefcase,
  Target,
  FolderGit2
} from 'lucide-react';
import { 
  User, 
  StudentProfile, 
  CompanyProfile, 
  CompanyEvaluation, 
  StudentWarning, 
  Project, 
  Application, 
  WeeklySubmission, 
  WeeklyEvaluation,
  ProjectStatus,
  ApplicationStatus,
  HiringDecision
} from '../types';

const UXDesignSystem = React.lazy(() => import('./UXDesignSystem'));
const DatabaseArchitectureWorkspace = React.lazy(() => import('./DatabaseArchitectureWorkspace'));
const APIArchitectureWorkspace = React.lazy(() => import('./APIArchitectureWorkspace'));
const FrontendArchitectureWorkspace = React.lazy(() => import('./FrontendArchitectureWorkspace'));
const BackendArchitectureWorkspace = React.lazy(() => import('./BackendArchitectureWorkspace'));
const EvaluationEngineWorkspace = React.lazy(() => import('./EvaluationEngineWorkspace'));
const AIMatchingEngineWorkspace = React.lazy(() => import('./AIMatchingEngineWorkspace'));
const StudentAnalysisEngineWorkspace = React.lazy(() => import('./StudentAnalysisEngineWorkspace'));
const CompatibilityMatchingEngineWorkspace = React.lazy(() => import('./CompatibilityMatchingEngineWorkspace'));
const RecommendationConfidenceEngineWorkspace = React.lazy(() => import('./RecommendationConfidenceEngineWorkspace'));
const RecommendationRankingEngineWorkspace = React.lazy(() => import('./RecommendationRankingEngineWorkspace'));
const LearningEngineWorkspace = React.lazy(() => import('./LearningEngineWorkspace'));
const SystemOrchestrationWorkspace = React.lazy(() => import('./SystemOrchestrationWorkspace'));
const TrustScoreEngineWorkspace = React.lazy(() => import('./TrustScoreEngineWorkspace'));
const ProjectProgressEngineWorkspace = React.lazy(() => import('./ProjectProgressEngineWorkspace'));
const BadgeEngineWorkspace = React.lazy(() => import('./BadgeEngineWorkspace'));
const WarningComplianceWorkspace = React.lazy(() => import('./WarningComplianceWorkspace'));
const ApprovalVerificationWorkspace = React.lazy(() => import('./ApprovalVerificationWorkspace'));
const SystemRuleEngineWorkspace = React.lazy(() => import('./SystemRuleEngineWorkspace'));
const AIAgentCoreWorkspace = React.lazy(() => import('./AIAgentCoreWorkspace'));
const AIMemoryEngineWorkspace = React.lazy(() => import('./AIMemoryEngineWorkspace'));
const AIToolCallingEngineWorkspace = React.lazy(() => import('./AIToolCallingEngineWorkspace'));
const AIPromptEngineWorkspace = React.lazy(() => import('./AIPromptEngineWorkspace'));
const AIDecisionEngineWorkspace = React.lazy(() => import('./AIDecisionEngineWorkspace'));
const AIActionEngineWorkspace = React.lazy(() => import('./AIActionEngineWorkspace'));
const AIPermissionEngineWorkspace = React.lazy(() => import('./AIPermissionEngineWorkspace'));
const AIConversationEngineWorkspace = React.lazy(() => import('./AIConversationEngineWorkspace'));
const AILoggingObservabilityEngineWorkspace = React.lazy(() => import('./AILoggingObservabilityEngineWorkspace'));
const AISupervisorOrchestratorWorkspace = React.lazy(() => import('./AISupervisorOrchestratorWorkspace'));
const AIRecruiterWorkspace = React.lazy(() => import('./AIRecruiterWorkspace'));
const AIGrowthCoachWorkspace = React.lazy(() => import('./AIGrowthCoachWorkspace'));
const AIResumeReviewerWorkspace = React.lazy(() => import('./AIResumeReviewerWorkspace'));
const AIPortfolioReviewerWorkspace = React.lazy(() => import('./AIPortfolioReviewerWorkspace'));

const WorkspaceLoader = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={<div className="p-8 text-sm text-neutral-400">Loading workspace...</div>}>
    {children}
  </React.Suspense>
);

// Admin Role definition for simulation
type AdminRole = 'SUPER_ADMIN' | 'TRUST_SAFETY' | 'STUDENT_MANAGER' | 'SUPPORT_MANAGER';

interface AdminDashboardProps {
  allUsers: User[];
  allStudents: StudentProfile[];
  allCompanies: CompanyProfile[];
  allCompanyEvaluations: CompanyEvaluation[];
  warnings: StudentWarning[];
  allProjects: Project[];
  allApplications: Application[];
  allSubmissions: WeeklySubmission[];
  allEvaluations: WeeklyEvaluation[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setStudentProfiles: React.Dispatch<React.SetStateAction<StudentProfile[]>>;
  setCompanyProfiles: React.Dispatch<React.SetStateAction<CompanyProfile[]>>;
  setWarnings: React.Dispatch<React.SetStateAction<StudentWarning[]>>;
  onIssueWarning: (studentId: string, reason: string) => void;
  onApproveStudent: (studentId: string) => void;
  onApproveCompany: (companyId: string) => void;
  onUpdateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  onLogout: () => void;
}

// Simulated active dispute ticket type (Phase 4-8)
interface DisputeTicket {
  id: string;
  reporter: string;
  reporterRole: 'STUDENT' | 'COMPANY';
  reportedParty: string;
  reason: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  evidence: string;
  createdAt: string;
}

// Simulated administrative broadcast announcement type (Phase 4-9)
interface BroadcastAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'STUDENT' | 'COMPANY';
  priority: 'CRITICAL' | 'HIGH' | 'INFORMATIONAL';
  sentBy: string;
  sentAt: string;
  readsCount: number;
  deliveryRate: number;
}

// Simulated operational audit log record (Phase 4-8)
interface AuditRecord {
  id: string;
  adminEmail: string;
  role: AdminRole;
  action: string;
  affectedResource: string;
  previousValue: string;
  newValue: string;
  timestamp: string;
  ipAddress: string;
  device: string;
}

export default function AdminDashboard({
  allUsers,
  allStudents,
  allCompanies,
  allCompanyEvaluations,
  warnings,
  allProjects,
  allApplications,
  allSubmissions,
  allEvaluations,
  setUsers,
  setStudentProfiles,
  setCompanyProfiles,
  setWarnings,
  onIssueWarning,
  onApproveStudent,
  onApproveCompany,
  onUpdateProjectStatus,
  onLogout
}: AdminDashboardProps) {
  // Navigation & Simulation State
  const [activeTab, setActiveTab] = useState<'students' | 'companies' | 'projects' | 'disputes' | 'broadcasts' | 'analytics' | 'system_health' | 'ux_spec' | 'db_schema' | 'api_spec' | 'frontend_spec' | 'backend_spec' | 'evaluation_engine' | 'student_analysis_engine' | 'ai_matching_engine' | 'compatibility_matching_engine' | 'recommendation_confidence_engine' | 'recommendation_ranking_engine' | 'learning_engine' | 'system_orchestration' | 'trust_score_engine' | 'project_progress_engine' | 'badge_engine' | 'warning_compliance' | 'approval_verification' | 'system_rule_engine' | 'ai_agent_core' | 'ai_memory_engine' | 'ai_tool_calling' | 'ai_prompt_engine' | 'ai_decision_engine' | 'ai_action_engine' | 'ai_permission_engine' | 'ai_conversation_engine' | 'ai_logging_observability_engine' | 'ai_supervisor_orchestrator_engine' | 'ai_recruiter_engine' | 'ai_growth_coach_engine' | 'ai_resume_reviewer_engine' | 'ai_portfolio_reviewer_engine'>('analytics');
  const [adminRole, setAdminRole] = useState<AdminRole>('SUPER_ADMIN');
  const [warningStudentId, setWarningStudentId] = useState<string | null>(null);
  const [warningReason, setWarningReason] = useState('');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'SUSPENDED'>('ALL');
  const [majorFilter, setMajorFilter] = useState('ALL');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [bulkChecked, setBulkChecked] = useState<string[]>([]);

  // Simulation parameters for Disputes (Phase 4-8)
  const [disputes, setDisputes] = useState<DisputeTicket[]>([
    {
      id: 'DISP-2026-001',
      reporter: 'Nguyen Van Minh',
      reporterRole: 'STUDENT',
      reportedParty: 'VUNO Inc.',
      reason: 'Late feedback on Week 2 UI deliverable and delayed check-in meetings.',
      priority: 'HIGH',
      status: 'INVESTIGATING',
      evidence: 'Student reports 4 days with no reply on designated feedback channels.',
      createdAt: '2026-07-01T10:20:00Z'
    },
    {
      id: 'DISP-2026-002',
      reporter: 'Healme Healthcare',
      reporterRole: 'COMPANY',
      reportedParty: 'Tran Minh Anh',
      reason: 'Milestone submission contained generic templates instead of custom medical analysis.',
      priority: 'CRITICAL',
      status: 'PENDING',
      evidence: 'Vetted PDF deliverable shows content duplicated from general marketing wikis.',
      createdAt: '2026-07-03T15:45:00Z'
    },
    {
      id: 'DISP-2026-003',
      reporter: 'Le Quoc Tu',
      reporterRole: 'STUDENT',
      reportedParty: 'CureAI Co.',
      reason: 'Unclear deliverable criteria changes in week 3 requirements without notice.',
      priority: 'MEDIUM',
      status: 'PENDING',
      evidence: 'Project brief updated post-agreement with additional database setup.',
      createdAt: '2026-07-04T01:10:00Z'
    }
  ]);

  // Simulation parameters for Broadcast Announcements (Phase 4-9)
  const [broadcasts, setBroadcasts] = useState<BroadcastAnnouncement[]>([
    {
      id: 'BRDC-001',
      title: 'Phase 4 RMIT Industry Integration Kickoff',
      content: 'Welcome all students and Korean SME mentors! The program is officially active. Weekly submissions open each Sunday.',
      targetAudience: 'ALL',
      priority: 'INFORMATIONAL',
      sentBy: 'admin@konexa.org',
      sentAt: '2026-06-15T09:00:00Z',
      readsCount: 142,
      deliveryRate: 100
    },
    {
      id: 'BRDC-002',
      title: 'Critical Portal Security Upgrades scheduled this Saturday',
      content: 'MFA configurations will become mandatory for all company account structures to preserve client privacy.',
      targetAudience: 'COMPANY',
      priority: 'CRITICAL',
      sentBy: 'super.admin@konexa.org',
      sentAt: '2026-06-28T14:30:00Z',
      readsCount: 45,
      deliveryRate: 98.7
    }
  ]);

  // Simulation parameters for Immutable Audit Logs (Phase 4-8)
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([
    {
      id: 'AUD-01',
      adminEmail: 'super.admin@konexa.org',
      role: 'SUPER_ADMIN',
      action: 'APPROVE_STUDENT_PROFILE',
      affectedResource: 'Nguyen Van Minh (STUDENT)',
      previousValue: 'Status: PENDING',
      newValue: 'Status: ACTIVE (VERIFIED)',
      timestamp: '2026-07-01T11:05:00Z',
      ipAddress: '14.162.245.10',
      device: 'Chrome on MacOS (M3 Max)'
    },
    {
      id: 'AUD-02',
      adminEmail: 'trust.safety@konexa.org',
      role: 'TRUST_SAFETY',
      action: 'ISSUE_STUDENT_WARNING',
      affectedResource: 'Tran Minh Anh (STUDENT)',
      previousValue: 'Warnings: 0',
      newValue: 'Warnings: 1 (Reason: Delay in milestone 2 deliverable)',
      timestamp: '2026-07-02T16:20:00Z',
      ipAddress: '27.72.102.84',
      device: 'Edge on Windows 11 Pro'
    }
  ]);

  // Input state for new broadcast announcement
  const [newBcastTitle, setNewBcastTitle] = useState('');
  const [newBcastContent, setNewBcastContent] = useState('');
  const [newBcastTarget, setNewBcastTarget] = useState<'ALL' | 'STUDENT' | 'COMPANY'>('ALL');
  const [newBcastPriority, setNewBcastPriority] = useState<'CRITICAL' | 'HIGH' | 'INFORMATIONAL'>('INFORMATIONAL');

  // Predictive Analytics Simulation variables (Phase 4-10)
  const [predictiveHoursSlider, setPredictiveHoursSlider] = useState<number>(15);
  const [predictiveTalentDemand, setPredictiveTalentDemand] = useState<string>('Artificial Intelligence & ML');

  // Trigger automated alerts & logs when actions occur
  const addAuditLog = (action: string, resource: string, prev: string, next: string) => {
    const newLog: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      adminEmail: `${adminRole.toLowerCase()}@konexa.org`,
      role: adminRole,
      action,
      affectedResource: resource,
      previousValue: prev,
      newValue: next,
      timestamp: new Date().toISOString(),
      ipAddress: '113.161.42.19',
      device: 'Chrome on Linux (Cloud Container Terminal)'
    };
    setAuditLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // Student Actions
  const handleApproveStudentLocal = (studentId: string) => {
    const student = allStudents.find(s => s.userId === studentId);
    if (!student) return;
    onApproveStudent(studentId);
    addAuditLog('APPROVE_STUDENT_PROFILE', `${student.fullName} (STUDENT)`, 'Status: PENDING', 'Status: ACTIVE');
  };

  const handleSuspendUser = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    
    const userObj = allUsers.find(u => u.id === userId);
    const affectedName = allStudents.find(s => s.userId === userId)?.fullName || allCompanies.find(c => c.userId === userId)?.companyName || userId;
    addAuditLog('TOGGLE_USER_SUSPENSION', `${affectedName} (${userObj?.role || 'USER'})`, `Status: ${currentStatus}`, `Status: ${nextStatus}`);
  };

  const handleApproveCompanyLocal = (companyId: string) => {
    const company = allCompanies.find(c => c.userId === companyId);
    if (!company) return;
    onApproveCompany(companyId);
    addAuditLog('APPROVE_COMPANY_REGISTER', `${company.companyName} (COMPANY)`, 'Status: PENDING', 'Status: VERIFIED');
  };

  const handleProjectStatusChange = (projectId: string, currentStatus: ProjectStatus, nextStatus: ProjectStatus) => {
    onUpdateProjectStatus(projectId, nextStatus);
    const proj = allProjects.find(p => p.id === projectId);
    addAuditLog('MODERATE_PROJECT_STATUS', `${proj?.title || projectId} (PROJECT)`, `Status: ${currentStatus}`, `Status: ${nextStatus}`);
  };

  const handleDisputeStatusChange = (disputeId: string, nextStatus: DisputeTicket['status']) => {
    setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: nextStatus } : d));
    const dispObj = disputes.find(d => d.id === disputeId);
    addAuditLog('DISPUTE_RESOLUTION_UPDATE', `Dispute ${disputeId}`, `Status: ${dispObj?.status}`, `Status: ${nextStatus}`);
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBcastTitle.trim() || !newBcastContent.trim()) return;

    const newBroadcast: BroadcastAnnouncement = {
      id: `BRDC-${Date.now().toString().slice(-3)}`,
      title: newBcastTitle,
      content: newBcastContent,
      targetAudience: newBcastTarget,
      priority: newBcastPriority,
      sentBy: `${adminRole.toLowerCase()}@konexa.org`,
      sentAt: new Date().toISOString(),
      readsCount: 0,
      deliveryRate: 100.0
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);
    addAuditLog('CREATE_ADMIN_BROADCAST', `Target: ${newBcastTarget}`, 'N/A', `Title: ${newBcastTitle}`);
    
    setNewBcastTitle('');
    setNewBcastContent('');
    alert(`Platform broadcast sent successfully targeting ${newBcastTarget === 'ALL' ? 'both Students & Companies' : newBcastTarget + 's'}!`);
  };

  const handleWarningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (warningStudentId && warningReason.trim()) {
      const student = allStudents.find(s => s.userId === warningStudentId);
      onIssueWarning(warningStudentId, warningReason.trim());
      addAuditLog('ISSUE_ACADEMIC_WARNING', `${student?.fullName || warningStudentId} (STUDENT)`, 'N/A', `Warning Issued: "${warningReason}"`);
      setWarningReason('');
      setWarningStudentId(null);
    }
  };

  // Bulk operations (Phase 4-8)
  const handleBulkApprove = () => {
    if (bulkChecked.length === 0) return;
    if (window.confirm(`Are you sure you want to bulk approve ${bulkChecked.length} student profile(s)?`)) {
      bulkChecked.forEach(id => {
        const student = allStudents.find(s => s.userId === id);
        if (student) {
          onApproveStudent(id);
          addAuditLog('BULK_APPROVE_STUDENTS', `${student.fullName} (STUDENT)`, 'Status: PENDING', 'Status: ACTIVE');
        }
      });
      setBulkChecked([]);
      alert('Bulk verification complete!');
    }
  };

  const toggleBulkChecked = (id: string) => {
    if (bulkChecked.includes(id)) {
      setBulkChecked(prev => prev.filter(x => x !== id));
    } else {
      setBulkChecked(prev => [...prev, id]);
    }
  };

  // Filter pending approvals
  const pendingStudents = allStudents.filter(s => {
    const user = allUsers.find(u => u.id === s.userId);
    return user && user.status === 'PENDING';
  });

  const pendingCompanies = allCompanies.filter(c => c.verificationStatus === 'PENDING');

  // Executive Core BI Math Calculations (Phase 4-10)
  const totalRmitStudents = allStudents.length;
  const verifiedStudentsCount = allUsers.filter(u => u.role === 'STUDENT' && u.status === 'ACTIVE').length;
  const suspendedStudentsCount = allUsers.filter(u => u.role === 'STUDENT' && u.status === 'SUSPENDED').length;
  const totalRegisteredCompanies = allCompanies.length;
  const verifiedCompaniesCount = allCompanies.filter(c => c.verificationStatus === 'VERIFIED').length;
  
  const totalProjectsPosted = allProjects.length;
  const runningProjectsCount = allProjects.filter(p => p.status === ProjectStatus.RUNNING).length;
  const completedProjectsCount = allProjects.filter(p => p.status === ProjectStatus.COMPLETED).length;

  const totalApplications = allApplications.length;
  const acceptedApplications = allApplications.filter(a => a.status === ApplicationStatus.ACCEPTED).length;
  // Hiring conversion rate: Accepted / total applied
  const hiringConversionRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 48;

  // AI Matching Recommendation Accuracy (simulated tracking indices)
  const mockAIRecommendationAccuracy = 94.6; 
  const falsePositivesRate = 2.4;
  const falseNegativesRate = 3.0;

  // Platform Trust Index (Ratings average)
  const totalCompanyReviewsCount = allCompanyEvaluations.length;
  const avgCompanyReviewScore = totalCompanyReviewsCount > 0
    ? (allCompanyEvaluations.reduce((acc, e) => acc + (
        e.communication + e.feedbackQuality + e.mentorship + e.taskClarity + e.responseSpeed + e.respect + e.learningOpportunity + e.workEnvironment + e.professionalism
      ) / 9, 0) / totalCompanyReviewsCount)
    : 4.8;

  // Gather unique majors for filtering
  const studentMajors = Array.from(new Set(allStudents.map(s => s.major)));
  const companyIndustries = Array.from(new Set(allCompanies.map(c => c.industry)));

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Navbar with Simulated RBAC Roles (Phase 4-8) */}
      <nav className="border-b border-neutral-900 bg-neutral-950 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-100 text-lg tracking-tight">KONEXA</span>
                <span className="text-[9px] text-purple-400 font-mono tracking-wider bg-purple-950/50 border border-purple-900/60 px-2 py-0.5 rounded-full font-bold uppercase">ADMIN CORE</span>
              </div>
              <p className="text-[10px] text-neutral-500">Manual Verification & Strategic BI Workspace</p>
            </div>
          </div>

          {/* Simulated Active RBAC Role selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-850 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Simulated Role:</span>
              <select 
                value={adminRole} 
                onChange={(e) => setAdminRole(e.target.value as AdminRole)}
                className="bg-transparent text-xs text-purple-400 focus:outline-none font-bold cursor-pointer"
              >
                <option value="SUPER_ADMIN">👑 Super Administrator (Full Access)</option>
                <option value="TRUST_SAFETY">🛡️ Trust & Safety Manager</option>
                <option value="STUDENT_MANAGER">🎓 Student program Manager</option>
                <option value="SUPPORT_MANAGER">💬 Support dispute Coordinator</option>
              </select>
            </div>

            <button 
              onClick={onLogout}
              className="text-xs font-bold text-neutral-500 hover:text-rose-400 border border-neutral-900 hover:border-rose-950 bg-neutral-900/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </div>
      </nav>

      {/* Main Console Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-5">
            <div>
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-bold">Workspace Navigation</h3>
              <p className="text-[10px] text-neutral-600">Unified operator command controls</p>
            </div>

            <div className="space-y-1">
              {[
                { tabID: 'analytics', label: 'Executive Analytics & BI', icon: BarChart3, badge: null, color: 'text-sky-400' },
                { tabID: 'students', label: 'Student Directory', icon: Users, badge: pendingStudents.length, color: 'text-purple-400' },
                { tabID: 'companies', label: 'Company Directories', icon: Building2, badge: pendingCompanies.length, color: 'text-amber-400' },
                { tabID: 'projects', label: 'Project Moderation', icon: FileBadge, badge: allProjects.filter(p => p.status === ProjectStatus.PENDING_APPROVAL).length, color: 'text-emerald-400' },
                { tabID: 'disputes', label: 'Platform Disputes', icon: AlertTriangle, badge: disputes.filter(d => d.status === 'PENDING').length, color: 'text-rose-400' },
                { tabID: 'broadcasts', label: 'Announcement Broadcaster', icon: Megaphone, badge: null, color: 'text-pink-400' },
                { tabID: 'system_health', label: 'Security & Audit Logs', icon: Server, badge: null, color: 'text-indigo-400' },
                { tabID: 'ux_spec', label: 'UX & Design System', icon: Sparkles, badge: null, color: 'text-emerald-400' },
                { tabID: 'db_schema', label: 'Database & Data Model', icon: Database, badge: null, color: 'text-blue-400' },
                { tabID: 'api_spec', label: 'REST API & Engines', icon: Terminal, badge: null, color: 'text-orange-400' },
                { tabID: 'frontend_spec', label: 'Client App Architecture', icon: Layers, badge: null, color: 'text-teal-400' },
                { tabID: 'backend_spec', label: 'Backend Engine & Server Spec', icon: Cpu, badge: null, color: 'text-rose-400' },
                { tabID: 'evaluation_engine', label: 'Performance Score Engine', icon: Award, badge: null, color: 'text-teal-400' },
                { tabID: 'student_analysis_engine', label: 'Student Analysis Engine', icon: Users, badge: null, color: 'text-teal-400' },
                { tabID: 'ai_matching_engine', label: 'AI Matching Engine Core', icon: Sparkles, badge: null, color: 'text-teal-300' },
                { tabID: 'compatibility_matching_engine', label: 'Matching Score Engine', icon: Scale, badge: null, color: 'text-teal-400' },
                { tabID: 'recommendation_confidence_engine', label: 'Confidence Engine', icon: ShieldCheck, badge: null, color: 'text-emerald-400' },
                { tabID: 'recommendation_ranking_engine', label: 'Ranking Engine', icon: ListOrdered, badge: null, color: 'text-teal-400' },
                { tabID: 'learning_engine', label: 'Learning Engine', icon: Brain, badge: null, color: 'text-teal-400' },
                { tabID: 'system_orchestration', label: 'Orchestrator Core', icon: Activity, badge: null, color: 'text-teal-400' },
                { tabID: 'trust_score_engine', label: 'Trust Score Engine', icon: ShieldCheck, badge: null, color: 'text-teal-400' },
                { tabID: 'project_progress_engine', label: 'Project Progress Engine', icon: Clock, badge: null, color: 'text-teal-400' },
                { tabID: 'badge_engine', label: 'Reputation Badge Engine', icon: Award, badge: null, color: 'text-purple-400' },
                { tabID: 'warning_compliance', label: 'Warning & Compliance Engine', icon: ShieldAlert, badge: null, color: 'text-rose-400' },
                { tabID: 'approval_verification', label: 'Approval & Verification Engine', icon: ShieldCheck, badge: null, color: 'text-emerald-400' },
                { tabID: 'system_rule_engine', label: 'System Rule Engine (Constitution)', icon: ShieldCheck, badge: null, color: 'text-indigo-400' },
                { tabID: 'ai_agent_core', label: 'AI Agent Core Framework', icon: Brain, badge: null, color: 'text-violet-400' },
                { tabID: 'ai_memory_engine', label: 'AI Memory Engine Matrix', icon: Brain, badge: null, color: 'text-indigo-400' },
                { tabID: 'ai_tool_calling', label: 'AI Tool Calling Engine', icon: Terminal, badge: null, color: 'text-cyan-400' },
                { tabID: 'ai_prompt_engine', label: 'AI Prompt Engine Matrix', icon: Sparkles, badge: null, color: 'text-purple-400' },
                { tabID: 'ai_decision_engine', label: 'AI Decision Engine', icon: Scale, badge: null, color: 'text-indigo-400' },
                { tabID: 'ai_action_engine', label: 'AI Action Engine', icon: Cpu, badge: null, color: 'text-emerald-400' },
                { tabID: 'ai_permission_engine', label: 'AI Permission Engine', icon: ShieldCheck, badge: null, color: 'text-amber-400' },
                { tabID: 'ai_conversation_engine', label: 'AI Conversation Engine', icon: MessageSquare, badge: null, color: 'text-indigo-400' },
                { tabID: 'ai_logging_observability_engine', label: 'AI Logging & Observability', icon: Activity, badge: null, color: 'text-rose-400' },
                { tabID: 'ai_supervisor_orchestrator_engine', label: 'AI Multi-Agent Supervisor', icon: GitBranch, badge: null, color: 'text-indigo-400' },
                { tabID: 'ai_recruiter_engine', label: 'AI Recruiter', icon: Briefcase, badge: null, color: 'text-purple-400' },
                { tabID: 'ai_growth_coach_engine', label: 'AI Growth Coach', icon: Target, badge: null, color: 'text-emerald-400' },
                { tabID: 'ai_resume_reviewer_engine', label: 'AI Resume Reviewer', icon: FileText, badge: null, color: 'text-violet-400' },
                { tabID: 'ai_portfolio_reviewer_engine', label: 'AI Portfolio Reviewer', icon: FolderGit2, badge: null, color: 'text-emerald-400' }
              ].map(item => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.tabID;

                // Simple RBAC role locks
                let isLocked = false;
                if (adminRole === 'TRUST_SAFETY' && ['broadcasts'].includes(item.tabID)) isLocked = true;
                if (adminRole === 'STUDENT_MANAGER' && ['companies', 'disputes'].includes(item.tabID)) isLocked = true;
                if (adminRole === 'SUPPORT_MANAGER' && ['broadcasts', 'projects'].includes(item.tabID)) isLocked = true;

                return (
                  <button
                    key={item.tabID}
                    disabled={isLocked}
                    onClick={() => setActiveTab(item.tabID as any)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2.5 transition-all relative ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'bg-gradient-to-r from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-xl' : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-white'}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isSelected ? item.color : 'text-neutral-500'}`} />
                      <span>{item.label}</span>
                      {isLocked && <Lock className="w-3 h-3 text-neutral-600" />}
                    </span>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="bg-rose-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/10 border border-neutral-900/60 text-xs text-neutral-500 space-y-2.5">
            <div className="font-bold text-neutral-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-purple-400 animate-pulse" /> Operational Notice
            </div>
            <p className="leading-relaxed text-[11px] text-neutral-500">
              This sandbox allows you to mock the full database lifecycle. Warnings and approvals persist in memory. Direct DB edits are blocked by security design.
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          <WorkspaceLoader>
          <AnimatePresence mode="wait">
            
            {/* 1. EXECUTIVE ANALYTICS TAB (Phase 4-10) */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Visual Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-950/30 via-neutral-900 to-neutral-950 border border-sky-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono">
                      <Sparkles className="w-4 h-4" /> Strategic Business Intelligence Engine Active
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">Executive Performance & KPI Summary</h2>
                    <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                      Aggregated metrics analyzing RMIT student performance trends, Korean corporate satisfaction, matching ratios, and operational bottlenecks.
                    </p>
                  </div>
                </div>

                {/* Core KPI Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'RMIT Registrants', count: totalRmitStudents, sub: `${verifiedStudentsCount} Active Program Members`, color: 'border-purple-900/30 text-purple-400' },
                    { label: 'Korean SME Partners', count: totalRegisteredCompanies, sub: `${verifiedCompaniesCount} Fully Vetted`, color: 'border-amber-900/30 text-amber-400' },
                    { label: 'Micro Projects', count: totalProjectsPosted, sub: `${runningProjectsCount} Live • ${completedProjectsCount} Completed`, color: 'border-emerald-900/30 text-emerald-400' },
                    { label: 'Hiring Conversion', count: `${hiringConversionRate}%`, sub: 'Applied students hired after project', color: 'border-rose-900/30 text-rose-400' }
                  ].map((kpi, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-900 flex flex-col justify-between space-y-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 tracking-wider">{kpi.label}</span>
                      <span className={`text-2xl font-black ${kpi.color}`}>{kpi.count}</span>
                      <span className="text-[10px] text-neutral-400">{kpi.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Analytics Graphs (Line/Funnel/Accuracy) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matching Accuracy & False Negatives (AI Model performance diagnostics) */}
                  <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-neutral-200">AI Matching Confidence & Stability</h3>
                        <p className="text-[10px] text-neutral-500 font-mono">Dynamic recommendation safety rate</p>
                      </div>
                      <span className="text-[11px] font-mono text-sky-400 font-bold bg-sky-950/50 border border-sky-900/50 px-2 py-0.5 rounded-lg">Accuracy: {mockAIRecommendationAccuracy}%</span>
                    </div>

                    <div className="space-y-4">
                      {/* Speed Dial/Bar Representation */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                          <span>Successful Recommendation Match Rate</span>
                          <span className="text-emerald-400 font-bold">94.6%</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: '94.6%' }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                          <span>False Positive Recommendation Rate</span>
                          <span className="text-amber-400 font-bold">{falsePositivesRate}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: '2.4%' }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                          <span>False Negative Rate (Hidden Talents undetected)</span>
                          <span className="text-red-400 font-bold">{falseNegativesRate}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: '3%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-900 text-[10px] text-neutral-500 leading-relaxed font-sans">
                      💡 <strong>Model Optimizer Insight:</strong> Matching algorithm shows zero bias on demographics. Previous project deadline completion holds a 35% weight parameter, improving matching accuracy by 12% last month.
                    </div>
                  </div>

                  {/* Funnel Conversions */}
                  <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-200">Global Recruitment Success Funnel</h3>
                      <p className="text-[10px] text-neutral-500 font-mono">Stage conversion percentages</p>
                    </div>

                    <div className="space-y-3.5 pt-1.5">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                          <span>1. Initial Applications ({totalApplications} submissions)</span>
                          <span className="font-bold">100%</span>
                        </div>
                        <div className="w-full h-4 bg-sky-950/20 border border-sky-900/30 rounded-md relative overflow-hidden">
                          <div className="h-full bg-sky-400/80" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                          <span>2. Accepted into Projects</span>
                          <span className="font-bold">78%</span>
                        </div>
                        <div className="w-full h-4 bg-teal-950/20 border border-teal-900/30 rounded-md relative overflow-hidden">
                          <div className="h-full bg-teal-400/80" style={{ width: '78%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                          <span>3. Hired / Placed into Talent Pools</span>
                          <span className="font-bold text-purple-400">{hiringConversionRate}%</span>
                        </div>
                        <div className="w-full h-4 bg-purple-950/20 border border-purple-900/30 rounded-md relative overflow-hidden">
                          <div className="h-full bg-purple-400/80" style={{ width: `${hiringConversionRate}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RMIT Programs & Regional Distributions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student major registrations */}
                  <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                    <h3 className="text-xs font-bold text-neutral-200">Verified RMIT Vietnam Program Enrolments</h3>
                    <div className="space-y-3 font-mono">
                      {[
                        { majorName: 'Bachelor of Software Engineering', pct: 45, count: 9 },
                        { majorName: 'Bachelor of Business (Digital Business)', pct: 25, count: 5 },
                        { majorName: 'Bachelor of Design (Digital Media)', pct: 20, count: 4 },
                        { majorName: 'Professional Communication', pct: 10, count: 2 }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[10px] text-neutral-400">
                            <span>{item.majorName}</span>
                            <span>{item.count} ({item.pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400" style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Corporate Industry Demands */}
                  <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                    <h3 className="text-xs font-bold text-neutral-200">SME Verification Industry Distribution</h3>
                    <div className="space-y-3 font-mono">
                      {[
                        { industry: 'AI & Healthcare diagnostics', pct: 40 },
                        { industry: 'IT & Cloud SaaS Platforms', pct: 30 },
                        { industry: 'Global Logistics & Supply Chain', pct: 20 },
                        { industry: 'FinTech Platforms', pct: 10 }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[10px] text-neutral-400">
                            <span>{item.industry}</span>
                            <span>{item.pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4-10 Future-Ready Predictive Simulator Module */}
                <div className="p-6 rounded-3xl bg-neutral-900/40 border border-sky-900/30 relative overflow-hidden space-y-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 uppercase">
                        <Sliders className="w-4 h-4 animate-spin" /> Predictive Intelligence Sandbox
                      </div>
                      <p className="text-[10px] text-neutral-500">Simulate upcoming talent demand and project risk factors (AI Modeling sandbox)</p>
                    </div>
                    <span className="text-[9px] font-bold bg-purple-950/60 text-purple-400 border border-purple-900/50 px-2 py-0.5 rounded uppercase font-mono">Predictive AI ready</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Simulator Input 1 */}
                    <div className="space-y-2 bg-neutral-950/50 p-4 rounded-2xl border border-neutral-900">
                      <label className="text-[11px] font-bold text-neutral-300 block">Forecast Demand sector:</label>
                      <select 
                        value={predictiveTalentDemand}
                        onChange={(e) => setPredictiveTalentDemand(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2 text-xs text-neutral-200 focus:outline-none"
                      >
                        <option value="Artificial Intelligence & ML">Artificial Intelligence & ML (VUNO Co, CureAI)</option>
                        <option value="Full Stack React/Node Development">Full Stack React/Node Development (IT Services)</option>
                        <option value="Medical Device Compliance">Medical Device Compliance (Healthcare)</option>
                        <option value="Global Logistics & Supply chain">Global Logistics & Supply chain (Export Co)</option>
                      </select>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-sans pt-1">
                        Analyzing 12 regional corporate filings, forecasted hiring demand for <strong className="text-purple-400">{predictiveTalentDemand}</strong> is estimated to grow by <strong className="text-emerald-400">34.2%</strong> in Q3 2026.
                      </p>
                    </div>

                    {/* Simulator Input 2 */}
                    <div className="space-y-2.5 bg-neutral-950/50 p-4 rounded-2xl border border-neutral-900">
                      <div className="flex justify-between items-center text-[11px] font-bold text-neutral-300">
                        <span>Project Hours Constraint:</span>
                        <span className="font-mono text-purple-400">{predictiveHoursSlider} hrs/week</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="30"
                        value={predictiveHoursSlider}
                        onChange={(e) => setPredictiveHoursSlider(parseInt(e.target.value))}
                        className="w-full accent-purple-400 cursor-pointer h-1.5 rounded-full bg-neutral-900"
                      />
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-sans">
                        Setting project commitment to <strong className="text-purple-400">{predictiveHoursSlider} hours</strong> predicts a <strong className="text-emerald-400">92.4%</strong> project completion rate for RMIT students. If hours exceed 25, prediction drops to 68% due to academic constraints.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. STUDENT DIRECTORY TAB (Phase 4-8) */}
            {activeTab === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Advanced Search & Controls */}
                <div className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 relative">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student names or skills..." 
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <select 
                      value={majorFilter}
                      onChange={(e) => setMajorFilter(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-400 focus:outline-none"
                    >
                      <option value="ALL">All RMIT Programs</option>
                      {studentMajors.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-400 focus:outline-none"
                    >
                      <option value="ALL">All Account States</option>
                      <option value="ACTIVE">Verified & Active</option>
                      <option value="PENDING">Awaiting Verification</option>
                      <option value="SUSPENDED">Suspended accounts</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end">
                    <button 
                      onClick={() => { setSearchQuery(''); setMajorFilter('ALL'); setStatusFilter('ALL'); }}
                      className="text-xs text-neutral-500 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
                    </button>
                  </div>
                </div>

                {/* Bulk Action Panel (Phase 4-8) */}
                {bulkChecked.length > 0 && (
                  <div className="p-4 bg-purple-950/20 border border-purple-900/40 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-purple-400 font-mono font-bold">{bulkChecked.length} Student Profiles Selected</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleBulkApprove}
                        className="px-3.5 py-1.5 bg-purple-400 text-black font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Bulk Verify Profiles
                      </button>
                      <button 
                        onClick={() => setBulkChecked([])}
                        className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 text-xs font-semibold rounded-xl border border-neutral-850 cursor-pointer"
                      >
                        Cancel Selection
                      </button>
                    </div>
                  </div>
                )}

                {/* 1. Pending Approvals queue */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Students Awaiting Manual Verification</h3>
                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-850">Needs Review: {pendingStudents.length}</span>
                  </div>

                  {pendingStudents.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" /> All registered students verified!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingStudents.map(student => {
                        const isChecked = bulkChecked.includes(student.userId);
                        return (
                          <div key={student.userId} className={`p-6 rounded-3xl bg-neutral-900/30 border transition-all space-y-4 ${isChecked ? 'border-purple-500' : 'border-neutral-900'}`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex items-center gap-3.5">
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => toggleBulkChecked(student.userId)}
                                  className="accent-purple-400 w-4 h-4 rounded border-neutral-800 bg-neutral-950 cursor-pointer"
                                />
                                <img src={student.avatarUrl} alt={student.fullName} className="w-11 h-11 rounded-full object-cover border border-neutral-800" />
                                <div>
                                  <h4 className="text-sm font-bold text-neutral-200">{student.fullName}</h4>
                                  <p className="text-[10px] text-purple-400 font-mono">{student.university} • {student.major}</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleApproveStudentLocal(student.userId)}
                                  className="px-4 py-2 bg-purple-400 hover:bg-purple-300 text-black font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  Approve Credentials <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if(window.confirm(`Reject student verification request for ${student.fullName}?`)) {
                                      setUsers(prev => prev.filter(u => u.id !== student.userId));
                                      setStudentProfiles(prev => prev.filter(s => s.userId !== student.userId));
                                      addAuditLog('REJECT_STUDENT_PROFILE', student.fullName, 'Status: PENDING', 'Status: DELETED');
                                    }
                                  }}
                                  className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-900 text-rose-500 border border-neutral-850 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
                              <div><strong className="text-neutral-500 font-mono">Portfolio:</strong> <a href={student.portfolioUrl} className="text-purple-400 hover:underline inline-flex items-center gap-0.5" target="_blank" rel="noreferrer">Open portfolio <ExternalLink className="w-3 h-3" /></a></div>
                              <div><strong className="text-neutral-500 font-mono">GitHub:</strong> <a href={student.githubUrl} className="text-purple-400 hover:underline inline-flex items-center gap-0.5" target="_blank" rel="noreferrer">GitHub repo <ExternalLink className="w-3 h-3" /></a></div>
                              <div><strong className="text-neutral-500 font-mono">English:</strong> <span className="text-neutral-300">{student.englishProficiency}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Active student directory list */}
                <div className="space-y-4 pt-6 border-t border-neutral-900">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Active Member Directory</h3>
                  
                  {(() => {
                    // Apply filtering logic
                    const filteredList = allStudents.filter(student => {
                      const userObj = allUsers.find(u => u.id === student.userId);
                      const isMatchName = student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || student.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
                      const isMatchMajor = majorFilter === 'ALL' || student.major === majorFilter;
                      
                      let isMatchStatus = false;
                      if (statusFilter === 'ALL') {
                        isMatchStatus = userObj ? userObj.status === 'ACTIVE' || userObj.status === 'SUSPENDED' : true;
                      } else {
                        isMatchStatus = userObj ? userObj.status === statusFilter : false;
                      }

                      return isMatchName && isMatchMajor && isMatchStatus;
                    });

                    if (filteredList.length === 0) {
                      return (
                        <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                          No students matching selected filters.
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {filteredList.map(student => {
                          const studentWarns = warnings.filter(w => w.studentId === student.userId);
                          const userObj = allUsers.find(u => u.id === student.userId);
                          const isSuspended = userObj ? userObj.status === 'SUSPENDED' : false;

                          return (
                            <div key={student.userId} className={`p-6 rounded-3xl bg-neutral-900/10 border transition-all space-y-4 ${isSuspended ? 'border-red-950 bg-red-950/5' : 'border-neutral-900'}`}>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <img src={student.avatarUrl} alt={student.fullName} className="w-11 h-11 rounded-full object-cover border border-neutral-800" />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-bold text-neutral-200">{student.fullName}</h4>
                                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${isSuspended ? 'bg-red-950 text-red-400 border-red-900' : 'bg-emerald-950 text-emerald-400 border-emerald-900'}`}>
                                        {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 font-mono">{student.university} • RMIT Active Program Member</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <button 
                                    onClick={() => handleSuspendUser(student.userId, userObj?.status || 'ACTIVE')}
                                    className={`px-3.5 py-2 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 ${isSuspended ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-900' : 'bg-neutral-950 hover:bg-neutral-900 text-red-400 border border-neutral-850'}`}
                                  >
                                    {isSuspended ? <Check className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />} {isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                                  </button>
                                  <button 
                                    onClick={() => setWarningStudentId(student.userId)}
                                    className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-900/50 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" /> Issue Warning
                                  </button>
                                </div>
                              </div>

                              {/* Student Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
                                <div><strong className="text-neutral-500 font-mono">Major:</strong> {student.major}</div>
                                <div><strong className="text-neutral-500 font-mono">Skills:</strong> {student.skills.join(', ')}</div>
                                <div><strong className="text-neutral-500 font-mono">Preferred Role:</strong> {student.preferredRole} ({student.preferredCountry})</div>
                                <div><strong className="text-neutral-500 font-mono">Availability:</strong> {student.availability}</div>

                                {studentWarns.length > 0 && (
                                  <div className="md:col-span-2 text-[10px] text-neutral-500 space-y-1 pt-2.5 border-t border-neutral-900/80 mt-1">
                                    <span className="font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1">
                                      <AlertTriangle className="w-3.5 h-3.5" /> Formal Warning History log ({studentWarns.length}/3 Threshold)
                                    </span>
                                    {studentWarns.map(w => (
                                      <div key={w.id} className="text-neutral-400">• {new Date(w.createdAt).toLocaleDateString()}: "{w.reason}"</div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* 3. COMPANY DIRECTORY TAB (Phase 4-8) */}
            {activeTab === 'companies' && (
              <motion.div
                key="companies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Pending Corporate accounts */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Korean Corporates Awaiting Manual Audit</h3>
                  
                  {pendingCompanies.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" /> All Corporate registrants audited & active!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingCompanies.map(company => (
                        <div key={company.userId} className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4 animate-pulse">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <img src={company.logoUrl} alt={company.companyName} className="w-11 h-11 rounded-xl object-cover border border-neutral-800" />
                              <div>
                                <h4 className="text-sm font-bold text-neutral-200">{company.companyName}</h4>
                                <p className="text-[10px] text-purple-400 font-mono">{company.industry}</p>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleApproveCompanyLocal(company.userId)}
                              className="px-4 py-2 bg-purple-400 hover:bg-purple-300 text-black font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              Approve Registrant & Verify <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
                            <div><strong className="text-neutral-500 font-mono">Location:</strong> {company.location}</div>
                            <div><strong className="text-neutral-500 font-mono">Scale size:</strong> {company.companySize} Employees</div>
                            <div><strong className="text-neutral-500 font-mono">Website:</strong> <a href={company.website} className="text-purple-400 hover:underline" target="_blank" rel="noreferrer">{company.website}</a></div>
                            <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-purple-400" /> <span className="font-semibold text-neutral-300">{company.businessRegistrationFile || 'Corporate_Registration.pdf'}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verified corporates & anonymous reviews (Phase 4-8) */}
                <div className="space-y-4 pt-6 border-t border-neutral-900">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Verified Corporate partner registry</h3>
                  
                  <div className="space-y-4">
                    {allCompanies.filter(c => c.verificationStatus === 'VERIFIED').map(company => {
                      const companyEvals = allCompanyEvaluations.filter(e => e.companyId === company.userId);
                      const avgScore = companyEvals.length > 0
                        ? (companyEvals.reduce((acc, e) => acc + (
                            e.communication + e.feedbackQuality + e.mentorship + e.taskClarity + e.responseSpeed + e.respect + e.learningOpportunity + e.workEnvironment + e.professionalism
                          ) / 9, 0) / companyEvals.length).toFixed(1)
                        : null;

                      const userObj = allUsers.find(u => u.id === company.userId);
                      const isSuspended = userObj ? userObj.status === 'SUSPENDED' : false;

                      return (
                        <div key={company.userId} className={`p-6 rounded-3xl bg-neutral-900/10 border transition-all space-y-4 ${isSuspended ? 'border-red-950' : 'border-neutral-900'}`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <img src={company.logoUrl} alt={company.companyName} className="w-11 h-11 rounded-xl object-cover border border-neutral-800" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-neutral-200">{company.companyName}</h4>
                                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${isSuspended ? 'bg-red-950 text-red-400 border-red-900' : 'bg-emerald-950 text-emerald-400 border-emerald-900'}`}>
                                    {isSuspended ? 'SUSPENDED' : 'VERIFIED'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-neutral-500 font-mono">{company.industry} • Active Partner</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleSuspendUser(company.userId, userObj?.status || 'ACTIVE')}
                                className={`px-3.5 py-2 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 ${isSuspended ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-900' : 'bg-neutral-950 hover:bg-neutral-900 text-red-400 border border-neutral-850'}`}
                              >
                                {isSuspended ? 'Reactivate corporate' : 'Suspend Corporate'}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
                            <div><strong className="text-neutral-500 font-mono">Location:</strong> {company.location}</div>
                            <div><strong className="text-neutral-500 font-mono">Website:</strong> <a href={company.website} className="text-purple-400 hover:underline inline-flex items-center gap-0.5" target="_blank" rel="noreferrer">SME Webpage <ExternalLink className="w-3 h-3" /></a></div>
                            
                            {companyEvals.length > 0 && (
                              <div className="md:col-span-2 text-[10px] text-neutral-500 space-y-3 pt-3 border-t border-neutral-900 mt-2">
                                <span className="font-bold text-purple-400 uppercase tracking-wider font-mono">Verified Anonymous student mentorship reviews:</span>
                                {companyEvals.map(e => (
                                  <div key={e.id} className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 space-y-1.5">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-bold text-neutral-300">RMIT Anonymous Reviewer</span>
                                      <span className="text-amber-400 font-mono font-bold">★ {((e.communication + e.feedbackQuality + e.mentorship + e.taskClarity + e.responseSpeed + e.respect + e.learningOpportunity + e.workEnvironment + e.professionalism)/9).toFixed(1)}/5.0</span>
                                    </div>
                                    <p className="text-neutral-400 italic">" {e.comment} "</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. PROJECT MODERATION TAB (Phase 4-8) */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Posted Validation projects Moderation</h3>
                  <span className="text-[10px] font-mono text-neutral-500">Total Projects: {allProjects.length}</span>
                </div>

                {allProjects.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                    No validation projects exist.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allProjects.map(proj => {
                      const projSubmissions = allSubmissions.filter(s => s.projectId === proj.id);
                      return (
                        <div key={proj.id} className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <img src={proj.companyLogo} alt={proj.companyName} className="w-10 h-10 rounded-xl object-cover border border-neutral-800" />
                              <div>
                                <h4 className="text-sm font-bold text-neutral-200">{proj.title}</h4>
                                <p className="text-[10px] text-neutral-500 font-mono">By {proj.companyName} • {proj.durationWeeks} Weeks</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${proj.status === ProjectStatus.RUNNING ? 'bg-sky-950 text-sky-400 border-sky-900' : proj.status === ProjectStatus.COMPLETED ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : proj.status === ProjectStatus.PENDING_APPROVAL ? 'bg-purple-950 text-purple-400 border-purple-900 animate-pulse' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}>
                                {proj.status}
                              </span>

                              {/* Moderation Controls */}
                              {proj.status === ProjectStatus.PENDING_APPROVAL && (
                                <button 
                                  onClick={() => handleProjectStatusChange(proj.id, ProjectStatus.PENDING_APPROVAL, ProjectStatus.OPEN)}
                                  className="px-3 py-1 bg-purple-400 text-black font-black text-[11px] rounded-lg cursor-pointer"
                                >
                                  Approve Project brief
                                </button>
                              )}
                              {proj.status === ProjectStatus.RUNNING && (
                                <button 
                                  onClick={() => handleProjectStatusChange(proj.id, ProjectStatus.RUNNING, ProjectStatus.COMPLETED)}
                                  className="px-3 py-1 bg-emerald-400 text-black font-black text-[11px] rounded-lg cursor-pointer"
                                >
                                  Mark Completed
                                </button>
                              )}
                              {proj.status !== ProjectStatus.CANCELLED && proj.status !== ProjectStatus.COMPLETED && (
                                <button 
                                  onClick={() => handleProjectStatusChange(proj.id, proj.status, ProjectStatus.CANCELLED)}
                                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-900/50 font-bold text-[11px] rounded-lg cursor-pointer"
                                >
                                  Cancel / Suspend
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
                            <div><strong className="text-neutral-500 font-mono">Weekly commitment:</strong> {proj.weeklyHours} hours/week</div>
                            <div><strong className="text-neutral-500 font-mono">Compensation:</strong> {proj.compensation}</div>
                            <div><strong className="text-neutral-500 font-mono">Activity:</strong> {projSubmissions.length} submission(s) lodged</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. PLATFORM DISPUTES TICKETING TAB (Phase 4-8) */}
            {activeTab === 'disputes' && (
              <motion.div
                key="disputes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Ecosystem Dispute Resolution Board</h3>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-850">Unresolved Tickets: {disputes.filter(d => d.status !== 'RESOLVED').length}</span>
                </div>

                <div className="space-y-4">
                  {disputes.map(disp => (
                    <div key={disp.id} className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-neutral-400">{disp.id}</span>
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${disp.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-900 animate-pulse' : 'bg-amber-950 text-amber-400 border-amber-900'}`}>
                            {disp.priority} PRIORITY
                          </span>
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${disp.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : disp.status === 'INVESTIGATING' ? 'bg-sky-950 text-sky-400 border-sky-900' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
                            {disp.status}
                          </span>
                        </div>

                        {/* Status changers */}
                        {disp.status !== 'RESOLVED' && (
                          <div className="flex gap-1.5">
                            {disp.status === 'PENDING' && (
                              <button 
                                onClick={() => handleDisputeStatusChange(disp.id, 'INVESTIGATING')}
                                className="px-2.5 py-1 bg-sky-400 text-black font-black text-[10px] rounded-lg cursor-pointer"
                              >
                                Launch Investigation
                              </button>
                            )}
                            <button 
                              onClick={() => handleDisputeStatusChange(disp.id, 'RESOLVED')}
                              className="px-2.5 py-1 bg-emerald-400 text-black font-black text-[10px] rounded-lg cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                            <button 
                              onClick={() => handleDisputeStatusChange(disp.id, 'DISMISSED')}
                              className="px-2 py-1 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 border border-neutral-850 text-[10px] rounded-lg cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-neutral-400"><strong className="text-neutral-300 font-mono">Reporter:</strong> {disp.reporter} ({disp.reporterRole}) vs <strong className="text-neutral-300 font-mono">Reported:</strong> {disp.reportedParty}</div>
                        <p className="text-xs font-bold text-neutral-200">" {disp.reason} "</p>
                      </div>

                      <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-900 text-[11px] space-y-1">
                        <span className="text-[9px] font-mono uppercase font-bold text-purple-400">Audited Evidence:</span>
                        <p className="text-neutral-400 italic">"{disp.evidence}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 6. PLATFORM BROADCASTS ANNOUNCEMENT TAB (Phase 4-9) */}
            {activeTab === 'broadcasts' && (
              <motion.div
                key="broadcasts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Announcement Creation block */}
                <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-200">Draft targeted Platform Broadcast</h3>
                    <p className="text-xs text-neutral-500">Send simulated platform notification alerts with scheduled deliveries.</p>
                  </div>

                  <form onSubmit={handleCreateBroadcast} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Target Audience Selection:</label>
                        <select 
                          value={newBcastTarget}
                          onChange={(e) => setNewBcastTarget(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none"
                        >
                          <option value="ALL">All registrants (Students & Companies)</option>
                          <option value="STUDENT">RMIT Vietnam Students Only</option>
                          <option value="COMPANY">Korean Partner SMEs Only</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Priority/Urgency level:</label>
                        <select 
                          value={newBcastPriority}
                          onChange={(e) => setNewBcastPriority(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none"
                        >
                          <option value="INFORMATIONAL">💡 Informational Notice</option>
                          <option value="HIGH">⚠️ Warning Notice</option>
                          <option value="CRITICAL">🚨 Critical System Broadcast (MFA/Emergency)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Announcement Title:</label>
                      <input 
                        type="text"
                        required
                        value={newBcastTitle}
                        onChange={(e) => setNewBcastTitle(e.target.value)}
                        placeholder="e.g. Critical platform updates regarding Week 3 milestones..."
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Broadcast message content:</label>
                      <textarea 
                        required
                        rows={3}
                        value={newBcastContent}
                        onChange={(e) => setNewBcastContent(e.target.value)}
                        placeholder="Type standard notification body..."
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button 
                        type="submit"
                        className="px-5 py-2.5 bg-purple-400 hover:bg-purple-300 text-black font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/10"
                      >
                        Launch Broadcast <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sent Broadcast history with deliverability indicators */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Broadcast History Log</h4>
                  <div className="space-y-4">
                    {broadcasts.map(b => (
                      <div key={b.id} className="p-5 rounded-3xl bg-neutral-900/10 border border-neutral-900 space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-neutral-500">{b.id}</span>
                            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${b.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-900' : b.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-900' : 'bg-sky-950 text-sky-400 border-sky-900'}`}>
                              {b.priority}
                            </span>
                            <span className="text-[8px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                              To: {b.targetAudience}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
                            <span>Sent: {new Date(b.sentAt).toLocaleDateString()}</span>
                            <span>Open Rate: {b.deliveryRate}%</span>
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-neutral-400" /> {b.readsCount}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-neutral-200">{b.title}</h5>
                          <p className="text-xs text-neutral-400 leading-relaxed italic">" {b.content} "</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. SECURITY, SYSTEM HEALTH & AUDIT TRAIL TAB (Phase 4-8) */}
            {activeTab === 'system_health' && (
              <motion.div
                key="system_health"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* System Health Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Firestore API Latency', pct: '12ms', sub: 'Status: ONLINE', desc: 'No transaction congestion', color: 'text-emerald-400' },
                    { title: 'Google Mail Queue', pct: '0 Pending', sub: 'Status: OPTIMIZED', desc: 'Email broadcasts queued: 0', color: 'text-sky-400' },
                    { title: 'Database Replication', pct: '100% Sync', sub: 'Uptime: 99.98%', desc: 'Immutable operational backup', color: 'text-teal-400' }
                  ].map((health, idx) => (
                    <div key={idx} className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-2xl space-y-1">
                      <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase">{health.title}</div>
                      <div className={`text-xl font-black ${health.color}`}>{health.pct}</div>
                      <div className="text-[10px] text-neutral-400 font-bold">{health.sub}</div>
                      <p className="text-[9px] text-neutral-600 font-sans">{health.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Immutable Operational Audit logs */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">Immutable Operational Audit Ledger</h4>
                      <p className="text-[10px] text-neutral-600">Secure record of all administrative session operations</p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded">🔒 CRYPTOGRAPHICALLY SECURED</span>
                  </div>

                  <div className="space-y-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-900 max-h-[480px] overflow-y-auto">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-900 text-xs font-mono space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-900 pb-2 text-[10px] text-neutral-500">
                          <div className="flex items-center gap-1.5">
                            <span className="text-purple-400 font-bold">[{log.id}]</span>
                            <span className="font-bold text-neutral-300">{log.adminEmail}</span>
                            <span>({log.role})</span>
                          </div>
                          <div className="flex gap-2.5">
                            <span>IP: {log.ipAddress}</span>
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-neutral-300 font-bold uppercase text-[10px] tracking-wide text-indigo-400">Action: {log.action}</div>
                          <div className="text-neutral-400">Resource: {log.affectedResource}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[10px] text-neutral-500">
                            <div>Previous: <span className="text-red-400/90">{log.previousValue}</span></div>
                            <div>New Value: <span className="text-emerald-400/90">{log.newValue}</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 8. INTERACTIVE UX SPECIFICATION & DESIGN SYSTEM TAB (Phase 5) */}
            {activeTab === 'ux_spec' && (
              <motion.div
                key="ux_spec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <UXDesignSystem />
              </motion.div>
            )}

            {/* 9. INTERACTIVE DATABASE ARCHITECTURE & DATA MODEL TAB (Phase 7) */}
            {activeTab === 'db_schema' && (
              <motion.div
                key="db_schema"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <DatabaseArchitectureWorkspace />
              </motion.div>
            )}

            {/* 10. INTERACTIVE REST API & ENGINE ARCHITECTURE TAB (Phase 8) */}
            {activeTab === 'api_spec' && (
              <motion.div
                key="api_spec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <APIArchitectureWorkspace />
              </motion.div>
            )}

            {/* 11. INTERACTIVE FRONTEND ARCHITECTURE & SPECIFICATION TAB (Phase 9) */}
            {activeTab === 'frontend_spec' && (
              <motion.div
                key="frontend_spec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <FrontendArchitectureWorkspace />
              </motion.div>
            )}

            {/* 12. INTERACTIVE BACKEND ARCHITECTURE & SERVER ENGINE SPECIFICATION TAB (Phase 10) */}
            {activeTab === 'backend_spec' && (
              <motion.div
                key="backend_spec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <BackendArchitectureWorkspace />
              </motion.div>
            )}

            {/* 13. INTERACTIVE EVALUATION & PERFORMANCE ENGINE WORKSPACE */}
            {activeTab === 'evaluation_engine' && (
              <motion.div
                key="evaluation_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <EvaluationEngineWorkspace />
              </motion.div>
            )}

            {/* 14. INTERACTIVE AI MATCHING ENGINE WORKSPACE */}
            {activeTab === 'ai_matching_engine' && (
              <motion.div
                key="ai_matching_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIMatchingEngineWorkspace />
              </motion.div>
            )}

            {/* 15. INTERACTIVE STUDENT ANALYSIS ENGINE WORKSPACE */}
            {activeTab === 'student_analysis_engine' && (
              <motion.div
                key="student_analysis_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <StudentAnalysisEngineWorkspace />
              </motion.div>
            )}

            {/* 16. INTERACTIVE COMPATIBILITY MATCHING ENGINE WORKSPACE */}
            {activeTab === 'compatibility_matching_engine' && (
              <motion.div
                key="compatibility_matching_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <CompatibilityMatchingEngineWorkspace />
              </motion.div>
            )}

            {/* 17. INTERACTIVE RECOMMENDATION CONFIDENCE ENGINE WORKSPACE */}
            {activeTab === 'recommendation_confidence_engine' && (
              <motion.div
                key="recommendation_confidence_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <RecommendationConfidenceEngineWorkspace />
              </motion.div>
            )}

            {/* 18. INTERACTIVE RECOMMENDATION RANKING ENGINE WORKSPACE */}
            {activeTab === 'recommendation_ranking_engine' && (
              <motion.div
                key="recommendation_ranking_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <RecommendationRankingEngineWorkspace />
              </motion.div>
            )}

            {/* 19. INTERACTIVE LEARNING ENGINE WORKSPACE */}
            {activeTab === 'learning_engine' && (
              <motion.div
                key="learning_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <LearningEngineWorkspace />
              </motion.div>
            )}

            {/* 20. ENTERPRISE ORCHESTRATION ENGINE WORKSPACE */}
            {activeTab === 'system_orchestration' && (
              <motion.div
                key="system_orchestration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SystemOrchestrationWorkspace />
              </motion.div>
            )}

            {/* 21. TRUST SCORE ENGINE WORKSPACE */}
            {activeTab === 'trust_score_engine' && (
              <motion.div
                key="trust_score_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <TrustScoreEngineWorkspace />
              </motion.div>
            )}

            {/* 22. PROJECT PROGRESS ENGINE WORKSPACE */}
            {activeTab === 'project_progress_engine' && (
              <motion.div
                key="project_progress_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ProjectProgressEngineWorkspace />
              </motion.div>
            )}

            {/* 23. REPUTATION BADGE ENGINE WORKSPACE */}
            {activeTab === 'badge_engine' && (
              <motion.div
                key="badge_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <BadgeEngineWorkspace />
              </motion.div>
            )}

            {/* 24. WARNING & COMPLIANCE ENGINE WORKSPACE */}
            {activeTab === 'warning_compliance' && (
              <motion.div
                key="warning_compliance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <WarningComplianceWorkspace />
              </motion.div>
            )}

            {/* 25. APPROVAL & VERIFICATION ENGINE WORKSPACE */}
            {activeTab === 'approval_verification' && (
              <motion.div
                key="approval_verification"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ApprovalVerificationWorkspace />
              </motion.div>
            )}

            {/* 26. SYSTEM RULE ENGINE (CONSTITUTION) WORKSPACE */}
            {activeTab === 'system_rule_engine' && (
              <motion.div
                key="system_rule_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SystemRuleEngineWorkspace />
              </motion.div>
            )}

            {/* 27. AI AGENT CORE FRAMEWORK WORKSPACE */}
            {activeTab === 'ai_agent_core' && (
              <motion.div
                key="ai_agent_core"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIAgentCoreWorkspace />
              </motion.div>
            )}

            {/* 28. AI MEMORY ENGINE WORKSPACE */}
            {activeTab === 'ai_memory_engine' && (
              <motion.div
                key="ai_memory_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIMemoryEngineWorkspace />
              </motion.div>
            )}

            {/* 29. AI TOOL CALLING ENGINE WORKSPACE */}
            {activeTab === 'ai_tool_calling' && (
              <motion.div
                key="ai_tool_calling"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIToolCallingEngineWorkspace />
              </motion.div>
            )}

            {/* 30. AI PROMPT ENGINE WORKSPACE */}
            {activeTab === 'ai_prompt_engine' && (
              <motion.div
                key="ai_prompt_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIPromptEngineWorkspace />
              </motion.div>
            )}

            {/* 31. AI DECISION ENGINE WORKSPACE */}
            {activeTab === 'ai_decision_engine' && (
              <motion.div
                key="ai_decision_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIDecisionEngineWorkspace />
              </motion.div>
            )}

            {/* 32. AI ACTION ENGINE WORKSPACE */}
            {activeTab === 'ai_action_engine' && (
              <motion.div
                key="ai_action_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIActionEngineWorkspace />
              </motion.div>
            )}

            {/* 33. AI PERMISSION ENGINE WORKSPACE */}
            {activeTab === 'ai_permission_engine' && (
              <motion.div
                key="ai_permission_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIPermissionEngineWorkspace />
              </motion.div>
            )}

            {/* 34. AI CONVERSATION ENGINE WORKSPACE */}
            {activeTab === 'ai_conversation_engine' && (
              <motion.div
                key="ai_conversation_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIConversationEngineWorkspace />
              </motion.div>
            )}

            {/* 35. AI LOGGING & OBSERVABILITY ENGINE WORKSPACE */}
            {activeTab === 'ai_logging_observability_engine' && (
              <motion.div
                key="ai_logging_observability_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AILoggingObservabilityEngineWorkspace />
              </motion.div>
            )}

            {/* 36. AI SUPERVISOR & ORCHESTRATOR ENGINE WORKSPACE */}
            {activeTab === 'ai_supervisor_orchestrator_engine' && (
              <motion.div
                key="ai_supervisor_orchestrator_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AISupervisorOrchestratorWorkspace />
              </motion.div>
            )}

            {/* 37. AI RECRUITER WORKSPACE */}
            {activeTab === 'ai_recruiter_engine' && (
              <motion.div
                key="ai_recruiter_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIRecruiterWorkspace />
              </motion.div>
            )}

            {/* 38. AI GROWTH COACH WORKSPACE */}
            {activeTab === 'ai_growth_coach_engine' && (
              <motion.div
                key="ai_growth_coach_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIGrowthCoachWorkspace />
              </motion.div>
            )}

            {/* 39. AI RESUME REVIEWER WORKSPACE */}
            {activeTab === 'ai_resume_reviewer_engine' && (
              <motion.div
                key="ai_resume_reviewer_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIResumeReviewerWorkspace />
              </motion.div>
            )}

            {/* 40. AI PORTFOLIO REVIEWER WORKSPACE */}
            {activeTab === 'ai_portfolio_reviewer_engine' && (
              <motion.div
                key="ai_portfolio_reviewer_engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AIPortfolioReviewerWorkspace />
              </motion.div>
            )}

          </AnimatePresence>
          </WorkspaceLoader>
        </div>
      </div>

      {/* Warning Issue Modal (Phase 4-5 warning logistics) */}
      <AnimatePresence>
        {warningStudentId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full relative space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setWarningStudentId(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-bold text-neutral-200">Issue Academic Status Warning</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This student profile will receive an administrative warning visible on their main overview. Accumulating 3 warnings automatically flags the profile for manual review.
              </p>

              <form onSubmit={handleWarningSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-bold">Reason for Warning</label>
                  <textarea 
                    required
                    rows={3}
                    value={warningReason}
                    onChange={(e) => setWarningReason(e.target.value)}
                    placeholder="e.g., Unexcused absence in milestone meeting / repeated late weekly submissions..." 
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button 
                    type="button"
                    onClick={() => setWarningStudentId(null)}
                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Issue Warning
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
