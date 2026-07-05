import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Bookmark, 
  FileText, 
  Star, 
  Calendar, 
  AlertCircle, 
  ChevronRight, 
  Send, 
  Settings, 
  ShieldCheck, 
  FileBadge, 
  Github, 
  Linkedin, 
  Globe, 
  Video,
  Upload,
  Layers,
  Sparkles,
  Info,
  X,
  Award,
  MessageSquare
} from 'lucide-react';
import { 
  StudentProfile, 
  Project, 
  ProjectStatus, 
  Application, 
  ApplicationStatus, 
  WeeklySubmission, 
  WeeklyEvaluation,
  CompanyEvaluation,
  StudentWarning
} from '../types';
import { calculateMatch } from '../utils/aiMatching';

interface StudentDashboardProps {
  studentProfile: StudentProfile;
  allProjects: Project[];
  allApplications: Application[];
  allSubmissions: WeeklySubmission[];
  allEvaluations: WeeklyEvaluation[];
  allCompanyEvaluations: CompanyEvaluation[];
  warnings: StudentWarning[];
  onSubmitCompanyEvaluation: (evalData: Omit<CompanyEvaluation, 'id' | 'submittedAt'>) => void;
  onApplyProject: (projectId: string, coverLetter: string, portfolioUrl?: string) => void;
  onSubmitWeeklyDeliverable: (projectId: string, weekNumber: number, deliverableFile: string, progressReport: string, reflection: string) => void;
  onUpdateProfile: (updatedProfile: StudentProfile) => void;
  onLogout: () => void;
}

export default function StudentDashboard({
  studentProfile,
  allProjects,
  allApplications,
  allSubmissions,
  allEvaluations,
  allCompanyEvaluations,
  warnings,
  onSubmitCompanyEvaluation,
  onApplyProject,
  onSubmitWeeklyDeliverable,
  onUpdateProfile,
  onLogout
}: StudentDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'browse' | 'timeline' | 'profile' | 'ai_matching'>('overview');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  
  // Proposal Modal state
  const [applyingProject, setApplyingProject] = useState<Project | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState(studentProfile.portfolioUrl || '');

  // Bookmarked projects state
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('konexa_student_bookmarks') || '[]');
    } catch (e) {
      return [];
    }
  });

  const handleToggleBookmark = (projId: string) => {
    const updated = bookmarks.includes(projId)
      ? bookmarks.filter(id => id !== projId)
      : [...bookmarks, projId];
    setBookmarks(updated);
    localStorage.setItem('konexa_student_bookmarks', JSON.stringify(updated));
  };

  // Comparing Projects State
  const [comparingProjectIds, setComparingProjectIds] = useState<string[]>([]);
  
  // Student to Company Review Modal state
  const [reviewingProject, setReviewingProject] = useState<Project | null>(null);
  const [rateCompComm, setRateCompComm] = useState(5);
  const [rateCompFeed, setRateCompFeed] = useState(5);
  const [rateCompMent, setRateCompMent] = useState(5);
  const [rateCompClar, setRateCompClar] = useState(5);
  const [rateCompSpeed, setRateCompSpeed] = useState(5);
  const [rateCompResp, setRateCompResp] = useState(5);
  const [rateCompOpp, setRateCompOpp] = useState(5);
  const [rateCompEnv, setRateCompEnv] = useState(5);
  const [rateCompProf, setRateCompProf] = useState(5);
  const [rateCompComment, setRateCompComment] = useState('');

  // Threaded Comments local-first state
  const [projectComments, setProjectComments] = useState<{
    id: string;
    projectId: string;
    author: string;
    role: string;
    text: string;
    timestamp: string;
    resolved?: boolean;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('konexa_project_comments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'c1',
        projectId: 'proj_1',
        author: 'Min-Seok (Mentor)',
        role: 'MENTOR',
        text: 'Welcome, @MinhAnh Nguyen Minh Anh! Excited to kick-off the DICOM medical viewer localized prototype project. Let\'s touch base on Week 1 setups.',
        timestamp: '2026-06-11T14:30:00Z',
        resolved: true
      },
      {
        id: 'c2',
        projectId: 'proj_1',
        author: 'Nguyen Minh Anh',
        role: 'STUDENT',
        text: '@mentor Perfect. I have prepared the initial React TS scaffold. Uploaded the repository link below. Let me know if the components match your design system.',
        timestamp: '2026-06-12T09:00:00Z',
        resolved: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('konexa_project_comments', JSON.stringify(projectComments));
  }, [projectComments]);

  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (projectId: string) => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `comm_${Date.now()}`,
      projectId,
      author: studentProfile.fullName,
      role: 'STUDENT',
      text: newCommentText,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    setProjectComments(prev => [...prev, newComment]);
    setNewCommentText('');
  };

  const handleToggleResolveComment = (commentId: string) => {
    setProjectComments(prev => prev.map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c));
  };

  // Deliverable Submission state
  const [submittingWeek, setSubmittingWeek] = useState<number | null>(null);
  const [deliverableFile, setDeliverableFile] = useState('');
  const [progressReport, setProgressReport] = useState('');
  const [reflection, setReflection] = useState('');

  // Profile Edit state
  const [editProfile, setEditProfile] = useState<StudentProfile>({ ...studentProfile });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Filter projects by open state
  const openProjects = allProjects.filter(p => p.status === ProjectStatus.OPEN || p.status === ProjectStatus.RUNNING);

  // Filter applications belonging to this student
  const studentApplications = allApplications.filter(a => a.studentId === studentProfile.userId);
  
  // Find running projects (where application is accepted)
  const acceptedApplications = studentApplications.filter(a => a.status === ApplicationStatus.ACCEPTED);
  const runningProjectIds = acceptedApplications.map(a => a.projectId);
  const runningProjects = allProjects.filter(p => runningProjectIds.includes(p.id));

  // Submissions and reviews for running projects
  const studentSubmissions = allSubmissions.filter(s => s.studentId === studentProfile.userId);

  // Calculate Cumulative Performance Stats (Phase 4-5)
  const completedSubmissions = studentSubmissions.filter(s => s.isEvaluated);
  const currentEvaluations = allEvaluations.filter(e => e.studentId === studentProfile.userId);
  
  const completedProjectsCount = allProjects.filter(p => runningProjectIds.includes(p.id) && p.status === ProjectStatus.COMPLETED).length;
  
  const completionRate = runningProjectIds.length > 0 ? Math.round((completedProjectsCount / runningProjectIds.length) * 100) : 0;
  
  const evaluatedWithDeadline = currentEvaluations.filter(e => e.deadline !== undefined);
  const deadlineRate = evaluatedWithDeadline.length > 0 
    ? Math.round((evaluatedWithDeadline.reduce((acc, curr) => acc + curr.deadline, 0) / (evaluatedWithDeadline.length * 5)) * 100) 
    : 100;
  
  const avgSatisfaction = currentEvaluations.length > 0 
    ? (currentEvaluations.reduce((acc, curr) => acc + (curr.communication + curr.quality + curr.responsibility + curr.deadline + curr.problemSolving + curr.professionalism) / 6, 0) / currentEvaluations.length).toFixed(1)
    : 'N/A';

  const weeklySubmissionRate = runningProjects.length > 0 
    ? Math.min(100, Math.round((studentSubmissions.length / (runningProjects.length * 4)) * 100)) 
    : 100;

  // Consistency Index calculation
  let consistencyIndex = 100;
  if (currentEvaluations.length > 0) {
    const scores = currentEvaluations.map(e => (e.communication + e.quality + e.responsibility + e.deadline + e.problemSolving + e.professionalism) / 6);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    consistencyIndex = Math.round(100 - (maxScore - minScore) * 10);
  }

  // Activity Index
  const activityIndex = Math.min(100, studentSubmissions.length * 20 + projectComments.filter(c => c.author === studentProfile.fullName).length * 10);

  // Growth Trend
  let growthTrend = 'Stable';
  if (currentEvaluations.length >= 2) {
    const sorted = [...currentEvaluations].sort((a,b) => a.weekNumber - b.weekNumber);
    const firstScore = (sorted[0].communication + sorted[0].quality + sorted[0].responsibility) / 3;
    const lastScore = (sorted[sorted.length - 1].communication + sorted[sorted.length - 1].quality + sorted[sorted.length - 1].responsibility) / 3;
    const diff = lastScore - firstScore;
    if (diff > 0.1) growthTrend = `+${diff.toFixed(1)} Growth`;
    else if (diff < -0.1) growthTrend = `${diff.toFixed(1)} Decrease`;
  }

  // Achievements Unlocks
  const achievements = [
    {
      id: 'first_apply',
      title: 'First Milestone',
      desc: 'Applied for your first SME validation project.',
      unlocked: studentApplications.length > 0,
      icon: '🚀'
    },
    {
      id: 'first_success',
      title: 'Successful Validation',
      desc: 'Completed your first 4-week project with an SME.',
      unlocked: completedProjectsCount > 0,
      icon: '🏆'
    },
    {
      id: 'perfect_deadlines',
      title: 'Flawless Deadlines',
      desc: 'Maintained 5-star punctuality rating in your weekly reviews.',
      unlocked: currentEvaluations.length > 0 && currentEvaluations.every(e => e.deadline === 5),
      icon: '⏱️'
    },
    {
      id: 'top_comm',
      title: 'Pristine Communicator',
      desc: 'Received a 5-star communication rating from a company lead.',
      unlocked: currentEvaluations.length > 0 && currentEvaluations.some(e => e.communication === 5),
      icon: '💬'
    },
    {
      id: 'high_achiever',
      title: 'Top Performer',
      desc: 'Earned 4.8+ overall satisfaction on a completed validation project.',
      unlocked: currentEvaluations.length > 0 && Number(avgSatisfaction) >= 4.8,
      icon: '🌟'
    }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyingProject) {
      onApplyProject(applyingProject.id, coverLetter, portfolioUrl);
      setApplyingProject(null);
      setCoverLetter('');
    }
  };

  const handleWeeklySubmit = (projectId: string, weekNumber: number) => {
    if (!deliverableFile || !progressReport) return;
    onSubmitWeeklyDeliverable(projectId, weekNumber, deliverableFile, progressReport, reflection);
    setSubmittingWeek(null);
    setDeliverableFile('');
    setProgressReport('');
    setReflection('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editProfile);
    setProfileSuccessMsg('Profile updated successfully! Technical credentials synched to verified passport.');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handleCompanyEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingProject) return;
    onSubmitCompanyEvaluation({
      projectId: reviewingProject.id,
      studentId: studentProfile.userId,
      companyId: reviewingProject.companyId,
      communication: rateCompComm,
      feedbackQuality: rateCompFeed,
      mentorship: rateCompMent,
      taskClarity: rateCompClar,
      responseSpeed: rateCompSpeed,
      respect: rateCompResp,
      learningOpportunity: rateCompOpp,
      workEnvironment: rateCompEnv,
      professionalism: rateCompProf,
      comment: rateCompComment
    });
    setReviewingProject(null);
    setRateCompComment('');
  };

  const filteredProjects = openProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill === 'All' || p.requiredSkills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const allAvailableSkills = Array.from(new Set(allProjects.flatMap(p => p.requiredSkills)));

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Dashboard Navbar */}
      <nav className="border-b border-neutral-900 bg-neutral-950 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-400 flex items-center justify-center">
              <FileBadge className="w-5.5 h-5.5 text-black" />
            </div>
            <div>
              <span className="font-bold text-neutral-200 text-lg">KONEXA</span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider ml-2 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-900/60">Verified Student</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img 
                src={studentProfile.avatarUrl} 
                alt={studentProfile.fullName} 
                className="w-8 h-8 rounded-full border border-emerald-500/20"
              />
              <span className="text-xs font-semibold text-neutral-300 hidden sm:inline">{studentProfile.fullName}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-xs font-semibold text-neutral-500 hover:text-white transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Navigation & Basic Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-900">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img 
                  src={studentProfile.avatarUrl} 
                  alt={studentProfile.fullName} 
                  className="w-16 h-16 rounded-full mx-auto border-2 border-emerald-400/40 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-neutral-950 rounded-full" />
              </div>
              <h3 className="text-base font-bold text-neutral-100 mt-3">{studentProfile.fullName}</h3>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{studentProfile.university}</p>
              <p className="text-xs text-neutral-400 mt-1">{studentProfile.major}</p>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'overview' ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/5' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Layers className="w-4 h-4" /> Workspace Overview
              </button>
              <button
                onClick={() => setActiveSubTab('browse')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'browse' ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/5' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Briefcase className="w-4 h-4" /> Browse Projects
              </button>
              <button
                onClick={() => setActiveSubTab('timeline')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'timeline' ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/5' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Clock className="w-4 h-4" /> Active Timeline
              </button>
              <button
                onClick={() => setActiveSubTab('ai_matching')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition-all ${activeSubTab === 'ai_matching' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-md shadow-emerald-500/10' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${activeSubTab === 'ai_matching' ? 'text-black' : 'text-emerald-400'}`} /> AI Matching Hub
                </span>
                <span className="text-[9px] font-bold bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/60 font-mono scale-90">AI</span>
              </button>
              <button
                onClick={() => setActiveSubTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'profile' ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/5' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Settings className="w-4 h-4" /> Verified Credentials
              </button>
            </div>
          </div>

          {/* Social credentials */}
          <div className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-900 space-y-3.5">
            <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider font-bold">Synchronized Links</h4>
            <div className="space-y-2.5 text-xs">
              <a href={studentProfile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" /> GitHub Verified
              </a>
              <a href={studentProfile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn Verified
              </a>
              <a href={studentProfile.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <Globe className="w-4 h-4" /> Digital Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Right Content Workspace Area */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {activeSubTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Hero greeting */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-850 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-100">Welcome back, {studentProfile.fullName}!</h2>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                    Every weekly deliverable you complete creates permanent, objective validation. Continue executing with precision to stand out directly to Gyeongbuk SMEs.
                  </p>
                </div>

                {/* Warning notification banner if warnings exist (Phase 4-5) */}
                {warnings.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 text-xs text-red-400 flex flex-col gap-2">
                    <div className="font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" /> Academic Status Warning ({warnings.length}/3)
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      You have received an administrative warning. Reaching 3 warnings triggers a manual program review.
                    </p>
                    <div className="space-y-1 pl-2 border-l border-red-900/60 text-[11px] text-neutral-400 mt-1">
                      {warnings.map((warn) => (
                        <div key={warn.id}>• {new Date(warn.createdAt).toLocaleDateString()}: "{warn.reason}"</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Analytics metrics */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Project Completion</div>
                      <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono mt-1">{completionRate}%</div>
                      <div className="text-[9px] text-neutral-500 mt-1">Based on weekly evaluations</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">On-Time Deadline</div>
                      <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono mt-1">{deadlineRate}%</div>
                      <div className="text-[9px] text-neutral-500 mt-1">No delayed milestones</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Employer rating</div>
                      <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 tracking-tight font-mono mt-1 flex items-center gap-1">
                        {avgSatisfaction} <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
                      </div>
                      <div className="text-[9px] text-neutral-500 mt-1">6-metric average scoring</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Average Response</div>
                      <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono mt-1">15 mins</div>
                      <div className="text-[9px] text-neutral-500 mt-1">SME Slack/Dashboard chat</div>
                    </div>
                  </div>

                  {/* Second Row of Trust Metrics (Phase 4-5) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Consistency Index</div>
                      <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono mt-1">{consistencyIndex}%</div>
                      <div className="text-[9px] text-neutral-500 mt-1">Rating variance deviation</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Submission compliance</div>
                      <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono mt-1">{weeklySubmissionRate}%</div>
                      <div className="text-[9px] text-neutral-500 mt-1">Weekly milestone uploads</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Activity score</div>
                      <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono mt-1">{activityIndex}%</div>
                      <div className="text-[9px] text-neutral-500 mt-1">Participation & comments index</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase">Growth Trend</div>
                      <div className="text-sm font-extrabold text-emerald-400 tracking-tight font-mono mt-3 uppercase">{growthTrend}</div>
                      <div className="text-[9px] text-neutral-500 mt-1">Comparison over weeks</div>
                    </div>
                  </div>
                </div>

                {/* Achievements Badge Room (Phase 4-5) */}
                <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900">
                  <h3 className="text-sm font-bold text-neutral-200 mb-4 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" /> Earned Achievements & Badges
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {achievements.map(ach => (
                      <div 
                        key={ach.id} 
                        className={`p-4 rounded-xl border text-center relative flex flex-col items-center justify-center transition-all ${
                          ach.unlocked 
                            ? 'bg-neutral-900/80 border-emerald-500/20 text-neutral-200' 
                            : 'bg-neutral-950/40 border-neutral-950 text-neutral-600 opacity-50'
                        }`}
                      >
                        <span className="text-2xl mb-2 filter drop-shadow">{ach.icon}</span>
                        <h4 className="text-[11px] font-bold truncate w-full">{ach.title}</h4>
                        <p className="text-[9px] text-neutral-500 mt-1 leading-snug h-8 overflow-hidden">{ach.desc}</p>
                        {ach.unlocked ? (
                          <span className="text-[8px] font-mono text-emerald-400 mt-2 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">UNLOCKED</span>
                        ) : (
                          <span className="text-[8px] font-mono text-neutral-600 mt-2 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-850">LOCKED</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Application Status Tracker */}
                <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900">
                  <h3 className="text-sm font-bold text-neutral-200 mb-4">Your Applied Projects Status</h3>
                  {studentApplications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-neutral-500">No active applications found. Use "Browse Projects" to get matched.</div>
                  ) : (
                    <div className="space-y-3">
                      {studentApplications.map(app => (
                        <div key={app.id} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-850 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-neutral-200">{app.projectTitle}</h4>
                            <p className="text-[10px] text-neutral-500 mt-0.5">{app.companyName} • Applied at {new Date(app.appliedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                              app.status === ApplicationStatus.ACCEPTED ? 'bg-emerald-950/60 border-emerald-900 text-emerald-400' :
                              app.status === ApplicationStatus.SUBMITTED ? 'bg-neutral-800 border-neutral-700 text-neutral-300' :
                              'bg-red-950/60 border-red-900 text-red-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Browse Projects Tab */}
            {activeSubTab === 'browse' && (
              <motion.div
                key="browse"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Filters */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search company, skills, tasks..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <Filter className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <button 
                      onClick={() => setSelectedSkill('All')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${selectedSkill === 'All' ? 'bg-emerald-400 text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
                    >
                      All Skills
                    </button>
                    {allAvailableSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => setSelectedSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap ${selectedSkill === skill ? 'bg-emerald-400 text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Listings */}
                <div className="space-y-4">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12 text-xs text-neutral-500">No active projects matching the search criteria.</div>
                  ) : (
                    filteredProjects.map(proj => {
                      const hasApplied = studentApplications.some(a => a.projectId === proj.id);
                      return (
                        <div key={proj.id} className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900 hover:border-emerald-500/20 transition-all space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img src={proj.companyLogo} alt={proj.companyName} className="w-11 h-11 rounded-xl object-cover border border-neutral-800" />
                              <div>
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{proj.companyName}</span>
                                <h3 className="text-base font-bold text-neutral-200 mt-0.5">{proj.title}</h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Toggle Bookmark Button (Phase 4-6) */}
                              <button 
                                onClick={() => handleToggleBookmark(proj.id)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  bookmarks.includes(proj.id) 
                                    ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' 
                                    : 'bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-white'
                                }`}
                                title={bookmarks.includes(proj.id) ? "Bookmarked" : "Bookmark Project"}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(proj.id) ? 'fill-emerald-400' : ''}`} />
                              </button>

                              {/* Toggle Compare Button (Phase 4-6) */}
                              <button 
                                onClick={() => {
                                  if (comparingProjectIds.includes(proj.id)) {
                                    setComparingProjectIds(prev => prev.filter(id => id !== proj.id));
                                  } else {
                                    if (comparingProjectIds.length >= 2) {
                                      alert("You can compare a maximum of 2 projects.");
                                      return;
                                    }
                                    setComparingProjectIds(prev => [...prev, proj.id]);
                                  }
                                }}
                                className={`px-3 py-2 rounded-xl border text-[10px] font-bold tracking-wider transition-all cursor-pointer uppercase ${
                                  comparingProjectIds.includes(proj.id)
                                    ? 'bg-sky-950/60 border-sky-500/30 text-sky-400'
                                    : 'bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-white'
                                }`}
                              >
                                {comparingProjectIds.includes(proj.id) ? "Comparing" : "Compare"}
                              </button>

                              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-900/40">
                                {proj.compensation}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed">{proj.description}</p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.requiredSkills.map(s => (
                              <span key={s} className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md uppercase">
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-neutral-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-400">
                            <div className="flex items-center gap-4 font-mono text-[10px]">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-neutral-500" /> {proj.durationWeeks} Weeks</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-500" /> {proj.weeklyHours} hrs/wk</span>
                            </div>

                            {hasApplied ? (
                              <button disabled className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-500 cursor-not-allowed">
                                Application Submitted
                              </button>
                            ) : (
                              <button 
                                onClick={() => setApplyingProject(proj)}
                                className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-[11px] transition-colors"
                              >
                                Apply for Project
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* Timeline & Submissions Tab */}
            {activeSubTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {runningProjects.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                    You have no active matching projects running. Once a Korean SME accepts your application, your weekly validation tracker will boot here.
                  </div>
                ) : (
                  runningProjects.map(proj => {
                    return (
                      <div key={proj.id} className="space-y-6">
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Active Collaboration Platform</span>
                          </div>
                          <h3 className="text-lg font-bold text-neutral-200 mt-2">{proj.title}</h3>
                          <p className="text-xs text-neutral-400 mt-1">{proj.companyName} • 4-Week Validation Cycle</p>
                        </div>

                        {/* Milestones timeline */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-bold">Weekly Iteration Tracker</h4>
                          
                          {proj.milestones.map(mile => {
                            // Check if submitted
                            const sub = studentSubmissions.find(s => s.weekNumber === mile.week);
                            // Check if evaluated
                            const evalForSub = currentEvaluations.find(e => e.weekNumber === mile.week);

                            return (
                              <div key={mile.week} className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-900 flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold bg-neutral-900 text-emerald-400 border border-neutral-800 px-2 py-0.5 rounded-md">
                                      WEEK {mile.week}
                                    </span>
                                    {sub ? (
                                      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" /> Submitted
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                                        ● Pending Submission
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-sm font-bold text-neutral-200">{mile.goal}</h4>
                                  <p className="text-xs text-neutral-400 leading-relaxed">{mile.deliverableDescription}</p>

                                  {sub && (
                                    <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-900 text-[11px] text-neutral-400 space-y-1 mt-3">
                                      <div className="font-semibold text-neutral-300">Your Submission:</div>
                                      <div className="truncate text-emerald-400 font-mono text-[10px]">{sub.deliverableFile}</div>
                                      <div>"{sub.progressReport}"</div>
                                    </div>
                                  )}

                                  {/* Review Feedback Loop */}
                                  {evalForSub && (
                                    <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-900/40 text-xs text-emerald-400 space-y-2.5 mt-3">
                                      <div className="font-bold flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> SME Technical Evaluation
                                      </div>
                                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono font-semibold">
                                        <div>Comm: {evalForSub.communication}/5 ★</div>
                                        <div>Quality: {evalForSub.quality}/5 ★</div>
                                        <div>Responsibility: {evalForSub.responsibility}/5 ★</div>
                                      </div>
                                      <div className="text-neutral-300 italic">" {evalForSub.comment} "</div>
                                    </div>
                                  )}
                                </div>

                                <div className="md:w-44 flex-shrink-0 self-center">
                                  {!sub ? (
                                    <button 
                                      onClick={() => setSubmittingWeek(mile.week)}
                                      className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                                    >
                                      Submit Deliverable <Upload className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <div className="text-center py-2 text-[10px] font-mono text-neutral-500 uppercase border border-neutral-850 rounded-lg">
                                      {evalForSub ? 'Grades Published' : 'Under SME Review'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Student to Company Evaluation Link (Phase 4-5) */}
                        {proj.status === ProjectStatus.COMPLETED && (
                          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-400 space-y-3 mt-6">
                            <div className="font-bold flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400" /> Share Your Mentorship Experience
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              This project has been completed! Your constructive evaluation regarding mentorship, feedback quality, and workspace environment assists both future RMIT developers and company leads.
                            </p>
                            <button 
                              onClick={() => setReviewingProject(proj)}
                              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Submit Mentorship & Workspace Review
                            </button>
                          </div>
                        )}

                        {/* Discussion & Collaborative Channel Thread (Phase 4-6) */}
                        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-4 mt-6">
                          <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-emerald-400" /> Collaborative Thread & Mentorship Feed
                          </h4>
                          <p className="text-[11px] text-neutral-500">Ask clarification questions, request technical reviews, or tag members using @mentor.</p>
                          
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {projectComments.filter(c => c.projectId === proj.id).map(comm => (
                              <div key={comm.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-900 text-xs text-neutral-300 space-y-1">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-neutral-200">{comm.author}</span>
                                    <span className={`text-[9px] font-mono px-1.5 py-0.25 rounded border ${
                                      comm.role === 'MENTOR' 
                                        ? 'bg-purple-950/40 border-purple-900 text-purple-400 font-bold' 
                                        : 'bg-emerald-950/40 border-emerald-900 text-emerald-400'
                                    }`}>
                                      {comm.role}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-neutral-500 font-mono">{new Date(comm.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-neutral-400 mt-1 whitespace-pre-wrap leading-relaxed">
                                  {comm.text.split(' ').map((word, i) => {
                                    if (word.startsWith('@')) {
                                      return <span key={i} className="text-sky-400 font-semibold">{word} </span>;
                                    }
                                    return word + ' ';
                                  })}
                                </p>
                                <div className="flex justify-between items-center pt-2 border-t border-neutral-900/40 mt-2">
                                  <span className={`text-[9px] font-mono flex items-center gap-1 ${comm.resolved ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {comm.resolved ? '✓ Resolved' : '● Action Required'}
                                  </span>
                                  <button 
                                    onClick={() => handleToggleResolveComment(comm.id)}
                                    className="text-[10px] text-neutral-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    Mark as {comm.resolved ? 'Active' : 'Resolved'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              placeholder="Type collaborative response... tag @mentor for support"
                              className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(proj.id); }}
                            />
                            <button 
                              onClick={() => handleAddComment(proj.id)}
                              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* AI Matching Hub Tab (Phase 4-7) */}
            {activeSubTab === 'ai_matching' && (
              <motion.div
                key="ai_matching"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Sparkles className="w-4 h-4 animate-pulse text-emerald-400" /> Empirical Matching Engine Active
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">Your AI Validation Recommendations</h2>
                      <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                        These matches are calculated using objective proof of your verified RMIT transcripts, technical skills, language fluency, and historical deadline reliability.
                      </p>
                    </div>

                    <div className="bg-emerald-950/50 border border-emerald-900/50 p-4 rounded-2xl flex items-center gap-3.5 font-mono">
                      <div className="text-center">
                        <div className="text-[9px] text-neutral-500 uppercase font-bold">Reliability Score</div>
                        <div className="text-lg font-black text-emerald-400">{deadlineRate}%</div>
                      </div>
                      <div className="w-px h-8 bg-emerald-900/50" />
                      <div className="text-center">
                        <div className="text-[9px] text-neutral-500 uppercase font-bold">Growth Trend</div>
                        <div className="text-lg font-black text-emerald-400">{growthTrend === 'Stable' ? 'Excellent' : growthTrend}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Matching Grid */}
                <div className="space-y-6">
                  {openProjects.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                      No active global validation projects available to match right now. Check back soon!
                    </div>
                  ) : (
                    (() => {
                      // Calculate all match results
                      const matchedList = openProjects.map(proj => {
                        const companyMock = {
                          userId: proj.companyId,
                          companyName: proj.companyName,
                          logoUrl: proj.companyLogo,
                          industry: proj.title.toLowerCase().includes('medical') || proj.title.toLowerCase().includes('vuno') ? 'Healthcare' : 'IT Services',
                          website: 'https://partner-sme.org',
                          location: 'Seoul, South Korea',
                          companySize: '50-100',
                          englishAvailability: 'Advanced',
                          verificationStatus: 'VERIFIED' as const
                        };
                        return {
                          project: proj,
                          match: calculateMatch(studentProfile, proj, companyMock, allEvaluations, warnings, studentApplications)
                        };
                      }).sort((a, b) => b.match.score - a.match.score);

                      return (
                        <div className="space-y-6">
                          {/* Recommended Highlights Header */}
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-neutral-200">Recommended Projects Sorted by Match Priority</h3>
                            <span className="text-xs font-mono text-neutral-500">{matchedList.length} Opportunities Analyzed</span>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            {matchedList.map(({ project: proj, match }) => {
                              const alreadyApplied = studentApplications.some(a => a.projectId === proj.id);

                              return (
                                <div 
                                  key={proj.id} 
                                  className="p-6 rounded-3xl bg-neutral-900/20 hover:bg-neutral-900/40 border border-neutral-900 hover:border-emerald-900/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 relative"
                                >
                                  {/* Score Circle Indicator */}
                                  <div className="lg:col-span-3 flex flex-col justify-center items-center p-6 rounded-2xl bg-neutral-950 border border-neutral-900 text-center space-y-2">
                                    <div className="relative flex items-center justify-center">
                                      {/* Animated Outer Ripple for Top Matches */}
                                      {match.score >= 82 && (
                                        <div className="absolute inset-0 rounded-full bg-emerald-400/5 animate-ping" />
                                      )}
                                      <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-mono border-4 ${match.score >= 82 ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20' : match.score >= 60 ? 'border-sky-400 text-sky-400 bg-sky-950/20' : 'border-neutral-700 text-neutral-400'}`}>
                                        <span className="text-2xl font-black">{match.score}%</span>
                                        <span className="text-[8px] font-bold uppercase tracking-wider">Match</span>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${match.category === 'Top Recommended' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900' : match.category === 'Hidden Gem' ? 'bg-amber-950/40 text-amber-400 border-amber-900' : match.category === 'Alternative Match' ? 'bg-sky-950/40 text-sky-400 border-sky-900' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
                                        {match.category}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Mid Section - Project Info & Explanations */}
                                  <div className="lg:col-span-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                      <img src={proj.companyLogo} alt={proj.companyName} className="w-10 h-10 rounded-xl object-cover border border-neutral-800" />
                                      <div>
                                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{proj.companyName}</span>
                                        <h4 className="text-sm font-black text-neutral-200">{proj.title}</h4>
                                      </div>
                                    </div>

                                    {/* Transparent Explanation Text */}
                                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1.5">
                                      <div className="text-[9px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" /> AI Explainability Match Reasoning
                                      </div>
                                      <p className="text-xs text-neutral-400 leading-relaxed font-sans italic">
                                        "{match.explanation}"
                                      </p>
                                    </div>

                                    {/* Stack Matches */}
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Skills Compatibility Analysis</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {match.matchedSkills.map(skill => (
                                          <span key={skill} className="text-[10px] font-mono bg-emerald-950/30 border border-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded-md">
                                            ✓ {skill}
                                          </span>
                                        ))}
                                        {match.missingSkills.map(skill => (
                                          <span key={skill} className="text-[10px] font-mono bg-neutral-950 text-neutral-500 border border-neutral-900 px-2 py-0.5 rounded-md line-through decoration-red-900">
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Section - Progress Breakdown & Direct Actions */}
                                  <div className="lg:col-span-3 flex flex-col justify-between space-y-4 lg:border-l lg:border-neutral-900 lg:pl-6">
                                    {/* Weighted Indicators */}
                                    <div className="space-y-2 text-xs">
                                      {[
                                        { name: 'Technical Stack Fit', score: match.breakdown.technical, color: 'bg-emerald-400' },
                                        { name: 'Academic & Language Align', score: match.breakdown.academic, color: 'bg-teal-400' },
                                        { name: 'Punctuality & Performance', score: match.breakdown.performance, color: 'bg-sky-400' },
                                        { name: 'Preferences & Availability', score: match.breakdown.preference, color: 'bg-indigo-400' }
                                      ].map((b, idx) => (
                                        <div key={idx} className="space-y-1">
                                          <div className="flex justify-between text-[10px] text-neutral-500 font-mono font-bold">
                                            <span>{b.name}</span>
                                            <span>{b.score}%</span>
                                          </div>
                                          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                                            <div className={`h-full ${b.color}`} style={{ width: `${b.score}%` }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-2">
                                      {alreadyApplied ? (
                                        <button 
                                          disabled
                                          className="w-full py-2.5 bg-neutral-900 text-neutral-500 font-bold text-xs rounded-xl border border-neutral-850 cursor-not-allowed flex items-center justify-center gap-1"
                                        >
                                          Application Submitted <CheckCircle className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <button 
                                          onClick={() => setApplyingProject(proj)}
                                          className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                                        >
                                          Apply Immediately <ChevronRight className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleToggleBookmark(proj.id)}
                                        className={`w-full py-2 text-xs font-bold rounded-xl transition-all border ${bookmarks.includes(proj.id) ? 'bg-neutral-900 border-emerald-900/50 text-emerald-400' : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'} flex items-center justify-center gap-1`}
                                      >
                                        <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(proj.id) ? 'fill-emerald-400' : ''}`} /> 
                                        {bookmarks.includes(proj.id) ? 'Bookmarked' : 'Add to Bookmarks'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeSubTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900">
                  <h3 className="text-sm font-bold text-neutral-200 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> Verified Credentials (RMIT Vietnam)
                  </h3>

                  {profileSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900 text-xs text-emerald-400 mb-6">
                      {profileSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Full Name</label>
                        <input 
                          type="text" 
                          value={editProfile.fullName}
                          onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">English Proficiency</label>
                        <input 
                          type="text" 
                          value={editProfile.englishProficiency}
                          onChange={(e) => setEditProfile({ ...editProfile, englishProficiency: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">RMIT University</label>
                        <input 
                          type="text" 
                          disabled
                          value={editProfile.university}
                          className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">RMIT Major</label>
                        <input 
                          type="text" 
                          value={editProfile.major}
                          onChange={(e) => setEditProfile({ ...editProfile, major: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Expected Graduation</label>
                        <input 
                          type="text" 
                          value={editProfile.graduationDate}
                          onChange={(e) => setEditProfile({ ...editProfile, graduationDate: e.target.value })}
                          placeholder="YYYY-MM"
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Availability Tracker</label>
                        <input 
                          type="text" 
                          value={editProfile.availability}
                          onChange={(e) => setEditProfile({ ...editProfile, availability: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-xl transition-colors mt-4 cursor-pointer"
                    >
                      Save Credentials
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Applying Project Proposal Modal */}
      <AnimatePresence>
        {applyingProject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full relative space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setApplyingProject(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-neutral-200">Submit Project Proposal</h3>
              <p className="text-xs text-neutral-400">
                You are applying to <strong>{applyingProject.title}</strong> by <strong>{applyingProject.companyName}</strong>.
              </p>

              <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Custom Target Portfolio Link</label>
                  <input 
                    type="url" 
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://portfolio.com/spec" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Proposal Cover Letter</label>
                  <textarea 
                    required
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state how you will approach this project and coordinate with Gyeongbuk mentors..." 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  Confirm Proposal Submission <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Weekly Submission Modal */}
      <AnimatePresence>
        {submittingWeek !== null && runningProjects[0] && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full relative space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setSubmittingWeek(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-neutral-200">Submit Week {submittingWeek} Deliverable</h3>
              <p className="text-xs text-neutral-400">
                Upload files, code pointers and progress reflections for VUNO review.
              </p>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Repository or Demo URL</label>
                  <input 
                    type="text" 
                    value={deliverableFile}
                    onChange={(e) => setDeliverableFile(e.target.value)}
                    placeholder="e.g., https://github.com/my-project/demo" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Progress Report (What did you deliver?)</label>
                  <textarea 
                    rows={3}
                    value={progressReport}
                    onChange={(e) => setProgressReport(e.target.value)}
                    placeholder="Provide details on features completed, components designed, and tests resolved..." 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Self-Reflection & Blockers</label>
                  <textarea 
                    rows={2}
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="What did you learn? Any blockers you overcame?" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button 
                  onClick={() => handleWeeklySubmit(runningProjects[0].id, submittingWeek)}
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-xl transition-colors"
                >
                  Submit Week {submittingWeek} Verification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Compare Launcher Bar (Phase 4-6) */}
      {comparingProjectIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 border border-neutral-800 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl z-40 backdrop-blur-md">
          <span className="text-xs font-semibold text-neutral-200">
            Comparing <span className="text-emerald-400 font-bold">{comparingProjectIds.length}</span> of 2 selected projects
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setComparingProjectIds([])}
              className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 text-xs rounded-lg transition-colors cursor-pointer font-bold"
            >
              Clear
            </button>
            <button 
              onClick={() => {
                if (comparingProjectIds.length < 2) {
                  alert("Please select 2 projects to compare side-by-side.");
                  return;
                }
              }}
              className="px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Compare Side-by-Side
            </button>
          </div>
        </div>
      )}

      {/* Side-by-side Project Comparison Modal (Phase 4-6) */}
      <AnimatePresence>
        {comparingProjectIds.length === 2 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-4xl w-full relative space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setComparingProjectIds([])}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-bold text-neutral-200">Side-by-Side Validation Project Comparison</h3>
              <p className="text-xs text-neutral-400 font-mono text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-900/40">Compare criteria of matching global SME verification projects to choose your optimal fit.</p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {comparingProjectIds.map(id => {
                  const p = allProjects.find(proj => proj.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-4">
                      <div className="flex items-center gap-3">
                        <img src={p.companyLogo} alt={p.companyName} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{p.companyName}</span>
                          <h4 className="text-xs font-bold text-neutral-200">{p.title}</h4>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs border-t border-neutral-900 pt-3 text-neutral-400 font-mono">
                        <div><strong className="text-neutral-300">Compensation:</strong> <span className="text-emerald-400 font-mono font-bold">{p.compensation}</span></div>
                        <div><strong className="text-neutral-300">Duration:</strong> {p.durationWeeks} Weeks</div>
                        <div><strong className="text-neutral-300">Commitment:</strong> {p.weeklyHours} hrs/week</div>
                        <div><strong className="text-neutral-300">English Required:</strong> Intermediate English (SME Mentoring Ready)</div>
                        <div><strong className="text-neutral-300">Core Scope:</strong> <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-sans">{p.description}</p></div>
                        <div>
                          <strong className="text-neutral-300">Required Stack:</strong>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.requiredSkills.map(s => (
                              <span key={s} className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded uppercase">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setComparingProjectIds([])}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-850 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student to Company Mentorship Review Modal (Phase 4-5) */}
      <AnimatePresence>
        {reviewingProject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full relative space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setReviewingProject(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-neutral-200">Review Company & Mentorship Experience</h3>
              <p className="text-xs text-neutral-400">Your objective evaluation of <strong>{reviewingProject.companyName}</strong> helps other student engineers find great mentors.</p>

              <form onSubmit={handleCompanyEvaluationSubmit} className="space-y-4 pt-2">
                {[
                  { label: 'Communication & Availability', val: rateCompComm, setVal: setRateCompComm },
                  { label: 'Constructive Feedback Quality', val: rateCompFeed, setVal: setRateCompFeed },
                  { label: 'Mentor Quality & Guidance', val: rateCompMent, setVal: setRateCompMent },
                  { label: 'Task & Requirements Clarity', val: rateCompClar, setVal: setRateCompClar },
                  { label: 'Response Speed & Interaction', val: rateCompSpeed, setVal: setRateCompSpeed },
                  { label: 'Respectful Workspace Treatment', val: rateCompResp, setVal: setRateCompResp },
                  { label: 'Learning & Skill Acquisition Opp', val: rateCompOpp, setVal: setRateCompOpp },
                  { label: 'Overall Work Environment', val: rateCompEnv, setVal: setRateCompEnv },
                  { label: 'Professionalism & Dev Ethic', val: rateCompProf, setVal: setRateCompProf }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">{metric.label}</span>
                      <span className="font-bold text-amber-400 font-mono">{metric.val}/5 Stars</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => metric.setVal(star)}
                          className={`flex-1 py-1 rounded text-xs transition-colors ${metric.val >= star ? 'bg-amber-450/20 text-amber-400 border border-amber-400/30 font-bold' : 'bg-neutral-950 text-neutral-600 border border-neutral-850'}`}
                        >
                          {star}★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Detailed Feedback (Mentorship Review Comments)</label>
                  <textarea 
                    required
                    rows={3}
                    value={rateCompComment}
                    onChange={(e) => setRateCompComment(e.target.value)}
                    placeholder="Describe how the company mentors supported your development..." 
                    className="w-full bg-neutral-950 border border-neutral-805 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Submit Company Evaluation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
