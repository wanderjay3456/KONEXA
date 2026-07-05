import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  FileText, 
  Users, 
  CheckCircle, 
  X, 
  ChevronRight, 
  Star, 
  Settings, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Calendar,
  Sparkles,
  Award,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { 
  CompanyProfile, 
  Project, 
  ProjectStatus, 
  Application, 
  ApplicationStatus, 
  WeeklySubmission, 
  WeeklyEvaluation, 
  HiringDecision,
  CompanyEvaluation,
  StudentProfile,
  StudentWarning,
  User
} from '../types';
import { calculateMatch } from '../utils/aiMatching';

interface CompanyDashboardProps {
  companyProfile: CompanyProfile;
  allProjects: Project[];
  allApplications: Application[];
  allSubmissions: WeeklySubmission[];
  allEvaluations: WeeklyEvaluation[];
  allCompanyEvaluations: CompanyEvaluation[];
  allStudents: StudentProfile[];
  allWarnings: StudentWarning[];
  allUsers: User[];
  onCreateProject: (projectData: Omit<Project, 'id' | 'companyId' | 'companyName' | 'companyLogo' | 'createdAt'>) => void;
  onUpdateCompanyProfile: (updatedProfile: CompanyProfile) => void;
  onUpdateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  onSubmitWeeklyEvaluation: (submissionId: string, projectId: string, studentId: string, weekNumber: number, evaluation: {
    communication: number;
    responsibility: number;
    quality: number;
    deadline: number;
    problemSolving: number;
    professionalism: number;
    comment: string;
  }) => void;
  onSubmitFinalHiring: (projectId: string, studentId: string, decision: HiringDecision, feedback: string) => void;
  onLogout: () => void;
}

export default function CompanyDashboard({
  companyProfile,
  allProjects,
  allApplications,
  allSubmissions,
  allEvaluations,
  allCompanyEvaluations,
  allStudents,
  allWarnings,
  allUsers,
  onCreateProject,
  onUpdateCompanyProfile,
  onUpdateApplicationStatus,
  onSubmitWeeklyEvaluation,
  onSubmitFinalHiring,
  onLogout
}: CompanyDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'applicants' | 'collaboration' | 'create' | 'settings' | 'ai_talent_match'>('overview');

  // New Project Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newDuration, setNewDuration] = useState(4);
  const [newCompensation, setNewCompensation] = useState('$800 USD');
  const [newSkills, setNewSkills] = useState('');
  const [newHours, setNewHours] = useState(15);
  const [formSuccess, setFormSuccess] = useState('');
  const [matchingSelectedProjectId, setMatchingSelectedProjectId] = useState<string>('');
  const [editCompanyProfile, setEditCompanyProfile] = useState<CompanyProfile>({ ...companyProfile });
  const [companyProfileSuccess, setCompanyProfileSuccess] = useState('');

  // Weekly review state
  const [evaluatingSubmission, setEvaluatingSubmission] = useState<WeeklySubmission | null>(null);
  const [ratingComm, setRatingComm] = useState(5);
  const [ratingResp, setRatingResp] = useState(5);
  const [ratingQual, setRatingQual] = useState(5);
  const [ratingDead, setRatingDead] = useState(5);
  const [ratingProb, setRatingProb] = useState(5);
  const [ratingProf, setRatingProf] = useState(5);
  const [evalComment, setEvalComment] = useState('');

  // Hiring Decision state
  const [hiringStudent, setHiringStudent] = useState<{ projectId: string; studentId: string; studentName: string } | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<HiringDecision>(HiringDecision.HIRE);
  const [finalFeedback, setFinalFeedback] = useState('');

  // Filter local SME entities
  const companyProjects = allProjects.filter(p => p.companyId === companyProfile.userId);
  const companyProjectIds = companyProjects.map(p => p.id);
  const companyApplications = allApplications.filter(a => companyProjectIds.includes(a.projectId));
  const runningCompanyProjects = companyProjects.filter(p => p.status === ProjectStatus.RUNNING);

  // Submissions sent to this company's projects
  const companySubmissions = allSubmissions.filter(s => companyProjectIds.includes(s.projectId));

  useEffect(() => {
    setEditCompanyProfile({ ...companyProfile });
  }, [companyProfile]);

  // Handle Project Creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newOutcome) return;

    onCreateProject({
      title: newTitle,
      description: newDesc,
      expectedOutcome: newOutcome,
      durationWeeks: newDuration,
      compensation: newCompensation,
      requiredSkills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      weeklyHours: newHours,
      status: ProjectStatus.OPEN,
      milestones: [
        { week: 1, goal: 'Setup Environment & Draft Design Architecture', deliverableDescription: 'Github repository initialized with basic modules mapped.' },
        { week: 2, goal: 'Connect REST API layers & Core Layout panels', deliverableDescription: 'Completed responsive front-end pages connected to mock schemas.' },
        { week: 3, goal: 'Feedback Refinement & High-Contrast optimization', deliverableDescription: 'Audited user interfaces optimized for speed and accessibility.' },
        { week: 4, goal: 'Verification testing & Walkthrough recordings', deliverableDescription: 'Final deployment links and documented test suites submitted.' }
      ]
    });

    setNewTitle('');
    setNewDesc('');
    setNewOutcome('');
    setNewSkills('');
    setFormSuccess('Project posted successfully! Approved immediately by AI agent.');
    setTimeout(() => {
      setFormSuccess('');
      setActiveSubTab('overview');
    }, 2000);
  };

  // Submit Weekly Grade
  const handleWeeklyEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingSubmission) return;

    onSubmitWeeklyEvaluation(evaluatingSubmission.id, evaluatingSubmission.projectId, evaluatingSubmission.studentId, evaluatingSubmission.weekNumber, {
      communication: ratingComm,
      responsibility: ratingResp,
      quality: ratingQual,
      deadline: ratingDead,
      problemSolving: ratingProb,
      professionalism: ratingProf,
      comment: evalComment
    });

    setEvaluatingSubmission(null);
    setEvalComment('');
  };

  // Submit Final Hiring Choice
  const handleHiringConfirm = () => {
    if (!hiringStudent) return;
    onSubmitFinalHiring(hiringStudent.projectId, hiringStudent.studentId, selectedDecision, finalFeedback);
    setHiringStudent(null);
    setFinalFeedback('');
  };

  const handleCompanyProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyProfile(editCompanyProfile);
    setCompanyProfileSuccess('Company profile synchronized across projects, matching and AI recruiter context.');
    setTimeout(() => setCompanyProfileSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-neutral-900 bg-neutral-950 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-400 flex items-center justify-center">
              <Building2 className="w-5.5 h-5.5 text-black" />
            </div>
            <div>
              <span className="font-bold text-neutral-200 text-lg">KONEXA</span>
              <span className="text-[10px] text-sky-400 font-mono tracking-wider ml-2 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-900/60">Verified Employer</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img 
                src={companyProfile.logoUrl} 
                alt={companyProfile.companyName} 
                className="w-8 h-8 rounded-lg border border-neutral-800 object-cover"
              />
              <span className="text-xs font-semibold text-neutral-300 hidden sm:inline">{companyProfile.companyName}</span>
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

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-900">
            <div className="text-center mb-6">
              <img 
                src={companyProfile.logoUrl} 
                alt={companyProfile.companyName} 
                className="w-16 h-16 rounded-2xl mx-auto border border-neutral-800 object-cover"
              />
              <h3 className="text-base font-bold text-neutral-100 mt-3">{companyProfile.companyName}</h3>
              <p className="text-[10px] text-sky-400 font-mono mt-0.5">{companyProfile.industry}</p>
              <p className="text-xs text-neutral-400 mt-2">{companyProfile.location}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'overview' ? 'bg-sky-400 text-black shadow-md' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <TrendingUp className="w-4 h-4" /> Company Overview
              </button>
              <button
                onClick={() => setActiveSubTab('applicants')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'applicants' ? 'bg-sky-400 text-black shadow-md' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Users className="w-4 h-4" /> Applicants ({companyApplications.filter(a => a.status === ApplicationStatus.SUBMITTED).length})
              </button>
              <button
                onClick={() => setActiveSubTab('ai_talent_match')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition-all ${activeSubTab === 'ai_talent_match' ? 'bg-gradient-to-r from-sky-400 to-indigo-450 text-black shadow-md' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${activeSubTab === 'ai_talent_match' ? 'text-black' : 'text-sky-400'}`} /> AI Talent Match
                </span>
                <span className="text-[9px] font-bold bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-900/60 font-mono scale-90">AI</span>
              </button>
              <button
                onClick={() => setActiveSubTab('collaboration')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'collaboration' ? 'bg-sky-400 text-black shadow-md' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Clock className="w-4 h-4" /> Collaboration Hub
              </button>
              <button
                onClick={() => setActiveSubTab('create')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'create' ? 'bg-sky-400 text-black shadow-md' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Plus className="w-4 h-4" /> Post Validation Project
              </button>
              <button
                onClick={() => setActiveSubTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeSubTab === 'settings' ? 'bg-sky-400 text-black shadow-md' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <Settings className="w-4 h-4" /> Company Profile
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-900 space-y-3.5">
            <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider font-bold">Verification parameters</h4>
            <div className="space-y-2 text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">✓ Gyeongbuk SME Active</div>
              <div className="text-neutral-400">Website: <span className="text-neutral-300">{companyProfile.website}</span></div>
              <div className="text-neutral-400">Scale: <span className="text-neutral-300">{companyProfile.companySize}</span></div>
            </div>
          </div>
        </div>

        {/* Workspace content */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* SME Overview tab */}
            {activeSubTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-3xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-850">
                  <h2 className="text-xl md:text-2xl font-bold">Validate Candidates, Mitigate Global Hiring Risk</h2>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                    Review weekly commits, score outputs, and gather empirical data before signing contracts. Trust is built through performance, not resumes.
                  </p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Verification Projects</div>
                    <div className="text-2xl font-extrabold tracking-tight font-mono mt-1 text-sky-400">
                      {companyProjects.length} Created
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Active Collaborators</div>
                    <div className="text-2xl font-extrabold tracking-tight font-mono mt-1 text-sky-400">
                      {runningCompanyProjects.length} Running
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-900">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Open Applicants</div>
                    <div className="text-2xl font-extrabold tracking-tight font-mono mt-1 text-sky-400">
                      {companyApplications.filter(a => a.status === ApplicationStatus.SUBMITTED).length} Pending
                    </div>
                  </div>
                </div>

                {/* Projects listings */}
                <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-200">Your Posted Validation Projects</h3>
                  {companyProjects.length === 0 ? (
                    <div className="text-center py-6 text-xs text-neutral-500">You have not created any projects yet. Use "Post Validation Project" to get started.</div>
                  ) : (
                    <div className="space-y-3">
                      {companyProjects.map(p => (
                        <div key={p.id} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-850 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-neutral-200">{p.title}</h4>
                            <p className="text-[9px] font-mono text-neutral-500 mt-0.5">Budget: {p.compensation} • Status: {p.status}</p>
                          </div>
                          <span className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md ${p.status === ProjectStatus.RUNNING ? 'text-emerald-400 bg-emerald-950/40' : 'text-neutral-400 bg-neutral-800'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Applicants tab */}
            {activeSubTab === 'applicants' && (
              <motion.div
                key="applicants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-base font-bold text-neutral-200">RMIT Vietnam Applicants</h3>
                
                {companyApplications.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                    No student proposals submitted yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyApplications.map(app => (
                      <div key={app.id} className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <img src={app.studentAvatar} alt={app.studentName} className="w-11 h-11 rounded-full object-cover border border-neutral-800" />
                            <div>
                              <h4 className="text-sm font-bold text-neutral-200">{app.studentName}</h4>
                              <p className="text-[10px] text-neutral-500 mt-0.5">Applied to: <span className="text-neutral-300 font-semibold">{app.projectTitle}</span></p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {app.status === ApplicationStatus.SUBMITTED ? (
                              <>
                                <button 
                                  onClick={() => onUpdateApplicationStatus(app.id, ApplicationStatus.ACCEPTED)}
                                  className="px-3.5 py-1.5 bg-sky-400 hover:bg-sky-300 text-black font-semibold text-[10px] rounded-lg transition-colors cursor-pointer"
                                >
                                  Accept Candidate
                                </button>
                                <button 
                                  onClick={() => onUpdateApplicationStatus(app.id, ApplicationStatus.REJECTED)}
                                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[10px] rounded-lg transition-colors cursor-pointer"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-mono uppercase bg-neutral-950 border border-neutral-850 px-2.5 py-1 rounded-full text-neutral-400">
                                {app.status}
                              </span>
                            )}
                          </div>
                        </div>

                        {app.coverLetter && (
                          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 text-xs text-neutral-400 leading-relaxed">
                            <div className="font-semibold text-neutral-300 mb-1">Applicant cover letter:</div>
                            "{app.coverLetter}"
                          </div>
                        )}

                        {app.portfolioUrl && (
                          <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:underline">
                            View Candidate Customized Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Collaboration & Review Hub */}
            {activeSubTab === 'collaboration' && (
              <motion.div
                key="collaboration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-neutral-200">Active Collaborations & Progress Review</h3>
                </div>

                {companySubmissions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-neutral-900/20 border border-neutral-900 text-xs text-neutral-500">
                    Active student deliverables will appear here once projects begin.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companySubmissions.map(sub => {
                      const isEvaluated = allEvaluations.some(e => e.submissionId === sub.id);
                      return (
                        <div key={sub.id} className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest bg-sky-950 px-2 py-0.5 rounded-md border border-sky-900/50">
                                Week {sub.weekNumber} Deliverable
                              </span>
                              <h4 className="text-sm font-bold text-neutral-200 mt-2">Submitted by student Minh Anh</h4>
                              <p className="text-[10px] text-neutral-500 mt-0.5">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                            </div>

                            {!isEvaluated ? (
                              <button 
                                onClick={() => setEvaluatingSubmission(sub)}
                                className="px-3.5 py-2 bg-sky-400 hover:bg-sky-300 text-black font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                              >
                                Grade Submission
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-900/40">
                                <CheckCircle className="w-4 h-4" /> Grade Published
                              </div>
                            )}
                          </div>

                          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 text-xs text-neutral-400 space-y-2">
                            <div><strong className="text-neutral-300">Deliverable URL:</strong> <a href={sub.deliverableFile} className="text-sky-400 hover:underline break-all" target="_blank" rel="noreferrer">{sub.deliverableFile}</a></div>
                            <div><strong className="text-neutral-300">Progress Report:</strong> "{sub.progressReport}"</div>
                            {sub.reflection && <div><strong className="text-neutral-300">Reflection:</strong> "{sub.reflection}"</div>}
                          </div>

                          {/* Final decision prompt (represented after Week 3/4 evaluation completes) */}
                          {sub.weekNumber === 3 && isEvaluated && (
                            <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-900/40 text-xs text-sky-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                              <div className="space-y-1">
                                <div className="font-bold flex items-center gap-1"><Award className="w-4 h-4 text-sky-400" /> Milestone Complete: Evidence Gathered</div>
                                <p className="text-[11px] text-neutral-400">Student score averages are exceptional. Proceed with the final hiring decision pipeline.</p>
                              </div>
                              <button 
                                onClick={() => setHiringStudent({ projectId: sub.projectId, studentId: sub.studentId, studentName: 'Nguyen Minh Anh' })}
                                className="px-4 py-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:brightness-110 text-black font-bold text-xs rounded-lg shadow-lg shadow-sky-500/15"
                              >
                                Confirm Hiring Choice
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Create Project Tab */}
            {activeSubTab === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900">
                  <h3 className="text-sm font-bold text-neutral-200 mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-sky-400" /> Define 4-Week Validation Project
                  </h3>

                  {formSuccess && (
                    <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-900 text-xs text-sky-400 mb-6">
                      {formSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g., Southeast Asia Localization & Medical Dashboard Prototype" 
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Detailed Description & Required Scope</label>
                      <textarea 
                        required
                        rows={4}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="State the core parameters of the project. Explain what technical problems need to be solved..." 
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Expected Deliverables & Outcomes</label>
                      <textarea 
                        required
                        rows={3}
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                        placeholder="e.g., High-fidelity interactive React prototype with dual-language locale bundles..." 
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Compensation/Budget</label>
                        <input 
                          type="text" 
                          required
                          value={newCompensation}
                          onChange={(e) => setNewCompensation(e.target.value)}
                          placeholder="e.g., $800 USD" 
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Required Skills (Comma separated)</label>
                        <input 
                          type="text" 
                          required
                          value={newSkills}
                          onChange={(e) => setNewSkills(e.target.value)}
                          placeholder="React, TypeScript, REST APIs" 
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Weekly Commitment (Hours)</label>
                        <input 
                          type="number" 
                          required
                          value={newHours}
                          onChange={(e) => setNewHours(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="px-6 py-3 bg-sky-400 hover:bg-sky-300 text-black font-semibold text-xs rounded-xl transition-colors mt-2 cursor-pointer"
                    >
                      Publish Project Validation Spec
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* AI Talent Match Tab (Phase 4-7) */}
            {activeSubTab === 'ai_talent_match' && (
              <motion.div
                key="ai_talent_match"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-neutral-900 to-neutral-950 border border-sky-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Sparkles className="w-4 h-4 animate-pulse text-sky-400" /> Empirical Talent Sourcing Active
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">AI Talent Recommendation Engine</h2>
                      <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                        Skip resumes. Match with RMIT students who have objectively proven their skills, punctuality, and professionalism through live micro-projects and verified transcripts.
                      </p>
                    </div>

                    <div className="bg-sky-950/50 border border-sky-900/50 p-4 rounded-2xl flex items-center gap-3.5 font-mono">
                      <div className="text-center">
                        <div className="text-[9px] text-neutral-500 uppercase font-bold">Accuracy rate</div>
                        <div className="text-lg font-black text-sky-400">96.4%</div>
                      </div>
                      <div className="w-px h-8 bg-sky-900/50" />
                      <div className="text-center">
                        <div className="text-[9px] text-neutral-500 uppercase font-bold">Matched Techs</div>
                        <div className="text-lg font-black text-sky-400 font-mono">12 Active</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Selector */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-3">
                  <label className="text-xs font-bold text-neutral-300 block">Select Validation Project to Match Candidates For:</label>
                  {companyProjects.length === 0 ? (
                    <div className="text-xs text-neutral-500">
                      You haven't posted any validation projects yet. Please <button onClick={() => setActiveSubTab('create')} className="text-sky-400 underline cursor-pointer">post a project</button> first.
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select 
                        value={matchingSelectedProjectId || (companyProjects[0] ? companyProjects[0].id : '')}
                        onChange={(e) => setMatchingSelectedProjectId(e.target.value)}
                        className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400 font-medium cursor-pointer"
                      >
                        {!matchingSelectedProjectId && companyProjects[0] && (
                          <option value="" disabled>-- Select a project --</option>
                        )}
                        {companyProjects.map(proj => (
                          <option key={proj.id} value={proj.id}>
                            {proj.title} ({proj.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* AI Matching Candidates List */}
                {companyProjects.length > 0 && (
                  (() => {
                    const selectedProjId = matchingSelectedProjectId || (companyProjects[0] ? companyProjects[0].id : '');
                    const currentProj = companyProjects.find(p => p.id === selectedProjId);
                    
                    if (!currentProj) return null;

                    // Filter students: verified, non-suspended, complete profile (Rule-based validation filtering)
                    const validStudents = allStudents.filter(student => {
                      const userAccount = allUsers.find(u => u.id === student.userId);
                      const isSuspended = userAccount ? userAccount.status === 'SUSPENDED' : false;
                      const isComplete = student.fullName && student.skills.length > 0 && student.university;
                      return isComplete && !isSuspended;
                    });

                    // Compute matches
                    const matchedTalents = validStudents.map(student => {
                      return {
                        student,
                        match: calculateMatch(student, currentProj, companyProfile, allEvaluations, allWarnings, allApplications)
                      };
                    }).sort((a, b) => b.match.score - a.match.score);

                    return (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-neutral-200">
                            Recommended RMIT Vietnam Candidates for: <span className="text-sky-400">"{currentProj.title}"</span>
                          </h3>
                          <span className="text-xs font-mono text-neutral-500">{matchedTalents.length} Verified Candidates Scored</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {matchedTalents.map(({ student, match }) => {
                            const studentWarns = allWarnings.filter(w => w.studentId === student.userId);
                            const hasApplied = allApplications.some(a => a.studentId === student.userId && a.projectId === selectedProjId);

                            return (
                              <div 
                                key={student.userId}
                                className="p-6 rounded-3xl bg-neutral-900/20 hover:bg-neutral-900/40 border border-neutral-900 hover:border-sky-900/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 relative"
                              >
                                {/* Left Section - Compatibility gauge */}
                                <div className="lg:col-span-3 flex flex-col justify-center items-center p-6 rounded-2xl bg-neutral-950 border border-neutral-900 text-center space-y-2">
                                  <div className="relative flex items-center justify-center">
                                    {match.score >= 82 && (
                                      <div className="absolute inset-0 rounded-full bg-sky-400/5 animate-ping" />
                                    )}
                                    <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-mono border-4 ${match.score >= 82 ? 'border-sky-400 text-sky-400 bg-sky-950/20' : match.score >= 60 ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20' : 'border-neutral-700 text-neutral-400'}`}>
                                      <span className="text-2xl font-black">{match.score}%</span>
                                      <span className="text-[8px] font-bold uppercase tracking-wider">Score</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${match.category === 'Top Recommended' ? 'bg-sky-950/40 text-sky-400 border-sky-900' : match.category === 'Hidden Gem' ? 'bg-amber-950/40 text-amber-400 border-amber-900' : match.category === 'Alternative Match' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
                                      {match.category}
                                    </span>
                                  </div>
                                </div>

                                {/* Mid Section - Student Credentials & Explanations */}
                                <div className="lg:col-span-6 space-y-4">
                                  <div className="flex items-center gap-3">
                                    <img src={student.avatarUrl} alt={student.fullName} className="w-11 h-11 rounded-full object-cover border border-neutral-800" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-black text-neutral-200">{student.fullName}</h4>
                                        {studentWarns.length > 0 && (
                                          <span className="text-[8px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900 font-mono font-bold">
                                            {studentWarns.length} Warnings
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-sky-400 font-mono">{student.university} • {student.major}</p>
                                    </div>
                                  </div>

                                  {/* Explanation narrative */}
                                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-1">
                                    <div className="text-[9px] font-mono text-sky-400 uppercase font-bold flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Justification
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed font-sans italic">
                                      "{match.explanation}"
                                    </p>
                                  </div>

                                  {/* Skills Match Breakdown */}
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Technical Skills Compatibility</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {match.matchedSkills.map(skill => (
                                        <span key={skill} className="text-[10px] font-mono bg-sky-950/30 border border-sky-900/60 text-sky-400 px-2 py-0.5 rounded-md">
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

                                {/* Right Section - Breakdown & Invitation Action */}
                                <div className="lg:col-span-3 flex flex-col justify-between space-y-4 lg:border-l lg:border-neutral-900 lg:pl-6">
                                  {/* Parameters */}
                                  <div className="space-y-2 text-xs">
                                    {[
                                      { name: 'Technical Stack Fit', score: match.breakdown.technical, color: 'bg-sky-400' },
                                      { name: 'Academic & English Fit', score: match.breakdown.academic, color: 'bg-emerald-400' },
                                      { name: 'Performance & Trust Rating', score: match.breakdown.performance, color: 'bg-teal-400' },
                                      { name: 'Preference & Hours Alignment', score: match.breakdown.preference, color: 'bg-indigo-400' }
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

                                  {/* Invitations Action / Applied Indicator */}
                                  <div className="space-y-2 pt-2">
                                    {hasApplied ? (
                                      <div className="text-center p-2.5 rounded-xl bg-sky-950/10 border border-sky-900/40 text-sky-400 font-bold text-xs">
                                        Applied & Under Review
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          alert(`Match invitation sent successfully! ${student.fullName} has been notified via email and platform notification to apply for your "${currentProj.title}" project.`);
                                        }}
                                        className="w-full py-2.5 bg-sky-400 hover:bg-sky-300 text-black font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                      >
                                        <Sparkles className="w-3.5 h-3.5" /> Invite to Project
                                      </button>
                                    )}
                                    <a 
                                      href={student.githubUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 font-mono"
                                    >
                                      Inspect Dev GitHub <ExternalLink className="w-3 h-3" />
                                    </a>
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
              </motion.div>
            )}

            {activeSubTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-neutral-100">Company Profile</h3>
                      <p className="text-xs text-neutral-500 mt-1">Version {editCompanyProfile.profileVersion ?? 1} · synchronized with matching and AI recruiter context</p>
                    </div>
                    {companyProfileSuccess && (
                      <div className="px-4 py-2 rounded-xl bg-emerald-950/30 border border-emerald-900 text-xs text-emerald-300">
                        {companyProfileSuccess}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleCompanyProfileSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        ['Company name', 'companyName'],
                        ['Logo URL', 'logoUrl'],
                        ['Industry', 'industry'],
                        ['Website', 'website'],
                        ['Location', 'location'],
                        ['Company size', 'companySize'],
                        ['Contact email', 'contactEmail'],
                        ['Contact phone', 'contactPhone']
                      ].map(([label, key]) => (
                        <div key={key} className="space-y-1">
                          <label className="text-xs text-neutral-400">{label}</label>
                          <input
                            type={key === 'website' || key === 'logoUrl' ? 'url' : 'text'}
                            value={String(editCompanyProfile[key as keyof CompanyProfile] ?? '')}
                            onChange={(e) => setEditCompanyProfile({ ...editCompanyProfile, [key]: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Recruitment status</label>
                        <select
                          value={editCompanyProfile.recruitmentStatus ?? 'OPEN'}
                          onChange={(e) => setEditCompanyProfile({ ...editCompanyProfile, recruitmentStatus: e.target.value as CompanyProfile['recruitmentStatus'] })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        >
                          <option value="OPEN">Open</option>
                          <option value="PAUSED">Paused</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Languages</label>
                        <input
                          value={(editCompanyProfile.languages ?? []).join(', ')}
                          onChange={(e) => setEditCompanyProfile({ ...editCompanyProfile, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        ['Preferred skills', 'preferredSkills'],
                        ['Preferred majors', 'preferredMajors'],
                        ['Hiring preferences', 'hiringPreferences']
                      ].map(([label, key]) => (
                        <div key={key} className="space-y-1">
                          <label className="text-xs text-neutral-400">{label}</label>
                          <textarea
                            rows={3}
                            value={((editCompanyProfile[key as keyof CompanyProfile] as string[] | undefined) ?? []).join(', ')}
                            onChange={(e) => setEditCompanyProfile({ ...editCompanyProfile, [key]: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Company description</label>
                        <textarea
                          rows={5}
                          value={editCompanyProfile.description ?? ''}
                          onChange={(e) => setEditCompanyProfile({ ...editCompanyProfile, description: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Employer branding</label>
                        <textarea
                          rows={5}
                          value={editCompanyProfile.employerBranding ?? ''}
                          onChange={(e) => setEditCompanyProfile({ ...editCompanyProfile, employerBranding: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <button type="submit" className="px-6 py-3 bg-sky-400 hover:bg-sky-300 text-black font-black text-xs rounded-xl transition-colors">
                      Save Company Profile
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Weekly Grading Modal */}
      <AnimatePresence>
        {evaluatingSubmission && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full relative space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setEvaluatingSubmission(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-neutral-200">Rate Week {evaluatingSubmission.weekNumber} Performance</h3>
              <p className="text-xs text-neutral-400">Empirical ratings generate objective talent analytics.</p>

              <form onSubmit={handleWeeklyEvaluationSubmit} className="space-y-4 pt-2">
                {[
                  { label: 'Communication & Responsiveness', val: ratingComm, setVal: setRatingComm },
                  { label: 'Responsibility & Dev Ethic', val: ratingResp, setVal: setRatingResp },
                  { label: 'Technical Output Quality', val: ratingQual, setVal: setRatingQual },
                  { label: 'Deadline & Milestone Punctuality', val: ratingDead, setVal: setRatingDead },
                  { label: 'Autonomous Problem Solving', val: ratingProb, setVal: setRatingProb },
                  { label: 'Professional Attitude', val: ratingProf, setVal: setRatingProf }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">{metric.label}</span>
                      <span className="font-bold text-sky-400 font-mono">{metric.val}/5 Stars</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => metric.setVal(star)}
                          className={`flex-1 py-1 rounded text-xs transition-colors ${metric.val >= star ? 'bg-sky-450/20 text-sky-400 border border-sky-400/30 font-bold' : 'bg-neutral-950 text-neutral-600 border border-neutral-850'}`}
                        >
                          {star}★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Written Feedback / Evaluation Comments</label>
                  <textarea 
                    required
                    rows={3}
                    value={evalComment}
                    onChange={(e) => setEvalComment(e.target.value)}
                    placeholder="Provide professional notes on developer output..." 
                    className="w-full bg-neutral-950 border border-neutral-805 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-sky-400 hover:bg-sky-300 text-black font-semibold text-xs rounded-xl transition-colors"
                >
                  Confirm Weekly Grade Submission
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hiring Decision Pipeline Modal */}
      <AnimatePresence>
        {hiringStudent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full relative space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setHiringStudent(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-neutral-200">Confirm Global Hiring pipeline Decision</h3>
              <p className="text-xs text-neutral-400">Select candidate action after successful project validation.</p>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: HiringDecision.HIRE, label: 'Hire Full-Time', color: 'border-emerald-500/30 hover:border-emerald-500 text-emerald-400' },
                    { val: HiringDecision.TALENT_POOL, label: 'Add to Talent Pool', color: 'border-sky-500/30 hover:border-sky-500 text-sky-400' },
                    { val: HiringDecision.FUTURE_CONTACT, label: 'Future Contact', color: 'border-purple-500/30 hover:border-purple-500 text-purple-400' },
                    { val: HiringDecision.REJECT, label: 'Decline Offer', color: 'border-neutral-700 text-neutral-400' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSelectedDecision(opt.val)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold text-center transition-all ${selectedDecision === opt.val ? 'bg-neutral-950 border-white text-white' : opt.color}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Final Endorsement & Feedback</label>
                  <textarea 
                    rows={3}
                    value={finalFeedback}
                    onChange={(e) => setFinalFeedback(e.target.value)}
                    placeholder="Offer professional notes or transition setup steps..." 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button 
                  onClick={handleHiringConfirm}
                  className="w-full py-3.5 bg-white text-black hover:bg-neutral-100 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  Submit Hiring Choice & Archive Project <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
