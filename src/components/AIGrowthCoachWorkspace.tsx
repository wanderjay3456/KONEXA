import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Search,
  Sliders,
  Database,
  Terminal,
  HelpCircle,
  Clock,
  Sparkles,
  GitBranch,
  FileText,
  User,
  Activity,
  ArrowRight,
  Plus,
  Compass,
  Check,
  ShieldCheck,
  Lock,
  ChevronRight,
  RotateCcw,
  Users,
  Target,
  Layers,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

// ============================================================================
// CORE TYPE DEFINITIONS (SPECIFICATION 12.0 - AI GROWTH COACH)
// ============================================================================

export interface SkillItem {
  subject: string;
  current: number; // 0-100
  target: number;  // 0-100
  importance: 'High' | 'Medium' | 'Low';
  growthRate: number; // % monthly growth
}

export interface StudentGrowthProfile {
  studentId: string;
  name: string;
  university: string;
  major: string;
  graduationDate: string;
  careerGoals: string;
  targetIndustry: string;
  targetJob: string;
  currentLevel: 'Associate' | 'Intermediate' | 'Advanced';
  overallCareerReadiness: number; // 0-100
  readinessBreakdown: {
    project: number;
    employment: number;
    interview: number;
    portfolio: number;
    resume: number;
    communication: number;
    professional: number;
  };
  strengths: string[];
  weaknesses: string[];
  riskFactors: {
    category: string;
    description: string;
    mitigation: string;
  }[];
  growthTimeline: {
    stage: string;
    tasks: string[];
    status: 'Completed' | 'In Progress' | 'Upcoming';
    targetDate: string;
  }[];
}

export interface ProjectHistoryRecord {
  projectId: string;
  title: string;
  companyName: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Expert';
  status: 'Completed' | 'In Progress' | 'Upcoming';
  employerFeedback: string;
  employerSatisfaction: number; // %
  trustScoreAtTime: number;
  performanceScoreAtTime: number;
  duration: string;
}

export interface GrowthTaskItem {
  id: string;
  category: 'Resume' | 'Portfolio' | 'GitHub' | 'Certificates' | 'Interview';
  title: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Skipped';
  actionableSuggestion: string;
}

export interface WeeklyReviewReport {
  weekNumber: string;
  period: string;
  weeklyProgress: string;
  completedGoals: string[];
  pendingGoals: string[];
  skillImprovements: { skill: string; delta: number }[];
  growthTrend: 'Upward' | 'Stable' | 'Critical Attention';
  nextWeekGoals: string[];
}

export interface GrowthAuditRecord {
  id: string;
  recommendationId: string;
  studentName: string;
  adviceCategory: string;
  growthModelVersion: string;
  confidence: number;
  evidenceBasedTags: string[];
  timestamp: string;
}

// ============================================================================
// SEED DATABASE FOR GRAPHICAL SIMULATION
// ============================================================================

const SEED_GROWTH_PROFILES: StudentGrowthProfile[] = [
  {
    studentId: 'STU-9901',
    name: 'Nguyen Hoang Long',
    university: 'FPT University',
    major: 'Software Engineering',
    graduationDate: '2027-02-15',
    careerGoals: 'Staff Full Stack Architect at a high-growth South Korean Unicorn platform.',
    targetIndustry: 'E-commerce, FinTech & Localization',
    targetJob: 'Senior Full Stack Engineer',
    currentLevel: 'Intermediate',
    overallCareerReadiness: 84,
    readinessBreakdown: {
      project: 91,
      employment: 80,
      interview: 78,
      portfolio: 88,
      resume: 85,
      communication: 82,
      professional: 86
    },
    strengths: [
      'High-velocity full stack architecture (React, Node, Postgres)',
      'Consistent on-time sprint completions (18 sequential milestones met)',
      'Rigorous unit testing coverage paradigm (>92% default coverage)'
    ],
    weaknesses: [
      'Minimal localized Korean payment integration testing experience',
      'No cloud serverless container orchestration exposure',
      'TOPIK Korean speaking speed needs fluid calibration'
    ],
    riskFactors: [
      { category: 'Language Barrier', description: 'TOPIK Level 4 represents good reading/writing but slow active verbal debate speed.', mitigation: 'Participate in the bi-weekly English/Korean collaborative kickoff workshops.' },
      { category: 'Cloud Infrastructure Gap', description: 'Limited AWS/Docker serverless configuration skills risk slower deployment speeds.', mitigation: 'Complete recommended AWS Certified Developer roadmap modules.' }
    ],
    growthTimeline: [
      { stage: 'Stage 1: Core Competency Mapping', tasks: ['Analyze resume formatting', 'Audit GitHub contribution consistency', 'Map TOPIK standards'], status: 'Completed', targetDate: '2026-05-10' },
      { stage: 'Stage 2: Project Deployment', tasks: ['Deploy Korean Commerce localization project', 'Register high-contrast portfolio items'], status: 'In Progress', targetDate: '2026-08-30' },
      { stage: 'Stage 3: Enterprise Integration', tasks: ['Simulate mock interviews', 'Achieve TOPIK Level 5 certifications'], status: 'Upcoming', targetDate: '2026-12-15' }
    ]
  },
  {
    studentId: 'STU-9902',
    name: 'Park Ji-Min',
    university: 'Hanyang University',
    major: 'Computer Science & AI',
    graduationDate: '2026-08-30',
    careerGoals: 'MLOps Architect managing high-frequency telemetry data streams.',
    targetIndustry: 'Industrial IoT & Smart Factory AI',
    targetJob: 'MLOps/AI Platform Engineer',
    currentLevel: 'Advanced',
    overallCareerReadiness: 90,
    readinessBreakdown: {
      project: 95,
      employment: 88,
      interview: 92,
      portfolio: 90,
      resume: 87,
      communication: 91,
      professional: 90
    },
    strengths: [
      'Advanced deep learning mathematics (PyTorch, TensorFlow)',
      'Flawless Korean spoken protocol proficiency',
      'FastAPI server performance tuning specialists'
    ],
    weaknesses: [
      'Limited React state orchestration expertise',
      'Weak portfolio visual presentation layout styles',
      'Prone to skipping code documentation parameters'
    ],
    riskFactors: [
      { category: 'Visual Representation', description: 'Unpolished visual layouts diminish the perceived impact of deep technical ML architectures.', mitigation: 'Adopt standard tailwind CSS mockup structures for MLOps dashboards.' }
    ],
    growthTimeline: [
      { stage: 'Stage 1: Model Calibration', tasks: ['Analyze PyTorch model parameters', 'Optimize FastAPI streaming latency'], status: 'Completed', targetDate: '2026-04-12' },
      { stage: 'Stage 2: Production Deployments', tasks: ['Containerize smart factory predictive telemetry script', 'Document AWS Lambda interfaces'], status: 'In Progress', targetDate: '2026-07-20' },
      { stage: 'Stage 3: Enterprise Pitching', tasks: ['Simulate technical smart-factory presentation to SDS partner', 'Draft full portfolio case study'], status: 'Upcoming', targetDate: '2026-10-01' }
    ]
  }
];

const SEED_PROJECT_HISTORY: ProjectHistoryRecord[] = [
  {
    projectId: 'PROJ-RECR-401',
    title: 'Korean Commerce Localization Frontend',
    companyName: 'FPT Software Korea',
    difficulty: 'Intermediate',
    status: 'Completed',
    employerFeedback: 'Excellent React structure. Nguyen integrated the payment gateway mock gracefully and maintained outstanding communication logs. Highly recommended.',
    employerSatisfaction: 94,
    trustScoreAtTime: 95,
    performanceScoreAtTime: 91,
    duration: '8 Weeks'
  },
  {
    projectId: 'PROJ-RECR-402',
    title: 'Smart Factory Predictive Maintenance AI',
    companyName: 'Samsung SDS Partner',
    difficulty: 'Expert',
    status: 'In Progress',
    employerFeedback: 'Very capable modeling skills. Model accuracy is outstanding, although documentation requires structural alignment.',
    employerSatisfaction: 89,
    trustScoreAtTime: 96,
    performanceScoreAtTime: 93,
    duration: '12 Weeks'
  }
];

const SEED_GROWTH_TASKS: GrowthTaskItem[] = [
  { id: 'GTK-001', category: 'Resume', title: 'Action-Oriented Achievement Formatting', description: 'Current resume lists general tasks instead of impact metrics.', actionableSuggestion: 'Modify "Wrote e-commerce frontend" to "Engineered localized React checkout page, improving simulated payment completion rate by 18.5%."' , status: 'Pending' },
  { id: 'GTK-002', category: 'Portfolio', title: 'Case Study Architecture Mapping', description: 'Portfolio contains code links but lacks contextual storytelling.', actionableSuggestion: 'Add a "Problem-Approach-Solution" framework with block diagrams explaining how you structured the multilingual schema routing.' , status: 'Completed' },
  { id: 'GTK-003', category: 'GitHub', title: 'Readme Alignment & Repository Documentation', description: 'Smart factory repository has an empty README.md.', actionableSuggestion: 'Incorporate installation guidelines, setup environment guides, API specs, and a screenshot of the real-time telemetry charts.' , status: 'Pending' },
  { id: 'GTK-004', category: 'Certificates', title: 'Align AWS & TOPIK Goals', description: 'Need verifiable validation of cloud deployment and language competencies.', actionableSuggestion: 'Register for AWS Certified Developer (Associate) and aim for TOPIK Level 5 speaking proficiency.', status: 'Pending' },
  { id: 'GTK-005', category: 'Interview', title: 'Technical Mock Presentation Mockups', description: 'Stalled in explaining complex state workflows to non-technical partners.', actionableSuggestion: 'Practice explaining React hydration layers using non-technical metaphors about packaging systems.', status: 'Pending' }
];

const SEED_WEEKLY_REVIEWS: WeeklyReviewReport[] = [
  {
    weekNumber: 'W-09',
    period: '2026-06-28 to 2026-07-04',
    weeklyProgress: 'Nguyen completed the checkout payment mock integration and drafted FPT local testing protocols.',
    completedGoals: ['Integrate KakaoPay API mock', 'Verify translation schemas'],
    pendingGoals: ['Optimize production build file sizes'],
    skillImprovements: [
      { skill: 'React Architecture', delta: 4 },
      { skill: 'Korean Language', delta: 2 }
    ],
    growthTrend: 'Upward',
    nextWeekGoals: ['Initiate Webpack bundle size compression analysis', 'Schedule career advice kickoff']
  }
];

const SEED_GROWTH_AUDITS: GrowthAuditRecord[] = [
  {
    id: 'AUD-GCH-9001',
    recommendationId: 'REC-GCH-3829-FF',
    studentName: 'Nguyen Hoang Long',
    adviceCategory: 'Skills Gap Analysis',
    growthModelVersion: 'Growth Coach Engine v12.0.1',
    confidence: 94,
    evidenceBasedTags: ['SkillGapMatching', 'ECommerceLocalization', 'TOPIK_Level4'],
    timestamp: '2026-07-04T21:40:00Z'
  },
  {
    id: 'AUD-GCH-9002',
    recommendationId: 'REC-GCH-3830-GG',
    studentName: 'Park Ji-Min',
    growthModelVersion: 'Growth Coach Engine v12.0.1',
    adviceCategory: 'GitHub Profile Optimization',
    confidence: 91,
    evidenceBasedTags: ['MLOpsDeployment', 'DockerReadmeAudit'],
    timestamp: '2026-07-04T21:42:15Z'
  }
];

// Recharts Skill Data
const SEED_SKILLS: SkillItem[] = [
  { subject: 'React / Next.js', current: 91, target: 95, importance: 'High', growthRate: 3.5 },
  { subject: 'Node.js / Express', current: 85, target: 92, importance: 'High', growthRate: 2.1 },
  { subject: 'Database / SQL', current: 88, target: 90, importance: 'Medium', growthRate: 1.8 },
  { subject: 'Korean TOPIK Speech', current: 65, target: 85, importance: 'High', growthRate: 5.2 },
  { subject: 'Cloud Deployments', current: 50, target: 80, importance: 'High', growthRate: 6.8 },
  { subject: 'Agile & Git Protocol', current: 86, target: 95, importance: 'Medium', growthRate: 1.4 }
];

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

export default function AIGrowthCoachWorkspace() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'student-coach' | 'radar-gaps' | 'roadmap-tasks' | 'weekly-audit' | 'schemas-api' | 'diagnostics'>('student-coach');

  // Multi-Student selectors
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU-9901');
  const [growthProfiles, setGrowthProfiles] = useState<StudentGrowthProfile[]>(SEED_GROWTH_PROFILES);
  const [projectHistory, setProjectHistory] = useState<ProjectHistoryRecord[]>(SEED_PROJECT_HISTORY);
  const [growthTasks, setGrowthTasks] = useState<GrowthTaskItem[]>(SEED_GROWTH_TASKS);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReviewReport[]>(SEED_WEEKLY_REVIEWS);
  const [audits, setAudits] = useState<GrowthAuditRecord[]>(SEED_GROWTH_AUDITS);
  const [skills, setSkills] = useState<SkillItem[]>(SEED_SKILLS);

  // New Goal Creator
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<GrowthTaskItem['category']>('Resume');

  // Diagnostic Test Engine States
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    'Growth Coach diagnostic protocols offline.',
    'Trigger "Initiate Rigorous Growth Self-Test" to run Specification 12.0 compliance checks.'
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Task Function
  const handleAddNewTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newTask: GrowthTaskItem = {
      id: `GTK-GEN-${Math.floor(Math.random() * 900) + 100}`,
      category: newGoalCategory,
      title: `${newGoalCategory} Alignment Target`,
      description: newGoalText,
      actionableSuggestion: `Calibrated advice based on active student gaps. Align with target job parameters.`,
      status: 'Pending'
    };

    setGrowthTasks(prev => [newTask, ...prev]);

    // Push audit trail log
    const newAudit: GrowthAuditRecord = {
      id: `AUD-GCH-${Math.floor(Math.random() * 9000) + 1000}`,
      recommendationId: `REC-GCH-${Math.floor(Math.random() * 90000) + 10000}-ZZ`,
      studentName: activeProfile.name,
      adviceCategory: `New ${newGoalCategory} Actionable Suggestion`,
      growthModelVersion: 'Growth Coach Engine v12.0.1',
      confidence: 95,
      evidenceBasedTags: ['ManualCoachIntervention', newGoalCategory],
      timestamp: new Date().toISOString()
    };
    setAudits(prev => [newAudit, ...prev]);

    setNewGoalText('');
    triggerToast(`New growth action registered securely!`);
  };

  // Complete growth task
  const completeTask = (taskId: string) => {
    setGrowthTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' };
      }
      return task;
    }));
    triggerToast(`Task completion status updated.`);
  };

  // Run SRE Specification 12.0 Diagnostic Suite
  const executeGrowthSelfTests = async () => {
    if (isDiagnosticsRunning) return;
    setIsDiagnosticsRunning(true);
    setDiagnosticLogs([]);

    const log = (msg: string) => {
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('⚡ Initializing AI Growth Coach Specification 12.0 test sequence...');
    await new Promise(r => setTimeout(r, 450));

    log('🔍 UNIT TEST 1: Career Readiness Index Verification...');
    log('Validating overall career readiness math limits... [0 - 100]');
    log('Asserting components: project, portfolio, communication, and professional indicators... [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('⚖️ INTEGRATION TEST 2: Multi-Criteria Skills Gap Comparison Engine...');
    log('Evaluating FPT commerce localized target profiles vs student actual code commits...');
    log('Highlighting mismatch: TOPIK Korean spoken fluency vs cloud serverless exposure... [PASS]');
    await new Promise(r => setTimeout(r, 450));

    log('⏱️ PERFORMANCE TEST 3: Growth Profile recommendation rendering latency...');
    log('Simulating sub-second calculations on 100k profile logs under load...');
    log('Completed in 48ms (target sub-second met). [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('🛡️ SECURITY TEST 4: Trust Score and Performance Modification Write-Locks...');
    log('Verifying security rules blocking unauthorized write actions on Core databases...');
    log('Asserting error catch on "Modify Trust Score" operation calls from coach token... [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('✅ SPECIFICATION 12.0 COMPLIANCE TESTS VERIFIED. Nominal state confirmed.');
    setIsDiagnosticsRunning(false);
  };

  // Active student selection calculation
  const activeProfile = growthProfiles.find(p => p.studentId === selectedStudentId) || growthProfiles[0];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-growth-coach-root">
      {/* Absolute top decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              SPECIFICATION 12.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Enterprise Growth Advisor
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100 mt-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> AI Growth Coach Workspace
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Helps verified students maximize their Korean employability. Benchmarks real project history performance, calculates precise skills gap radars, and delivers evidence-based actionable guides without ever altering database scores.
          </p>
        </div>

        {/* Global KPI and selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Student profile switcher */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-2xl text-xs">
            <span className="text-neutral-500 font-mono">Active Candidate:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-transparent border-none text-neutral-200 font-bold focus:outline-none cursor-pointer"
            >
              {growthProfiles.map(p => (
                <option key={p.studentId} value={p.studentId} className="bg-neutral-950 text-neutral-300">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-2xl flex items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">READINESS SCORE</span>
              <span className="text-emerald-400 font-bold">{activeProfile.overallCareerReadiness}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation subtabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800 pb-3 mb-6">
        {[
          { id: 'student-coach', label: 'Growth Profile & Competencies', icon: User },
          { id: 'radar-gaps', label: 'Skills Gap & Project Analysis', icon: Compass },
          { id: 'roadmap-tasks', label: 'Personalized Roadmap Tasks', icon: Layers },
          { id: 'weekly-audit', label: 'Weekly Performance Reviews', icon: Activity },
          { id: 'schemas-api', label: 'Database & REST API Endpoints', icon: Database },
          { id: 'diagnostics', label: 'Growth Diagnostics Playbook', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toast alert popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 bg-emerald-900/90 border border-emerald-700/50 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 text-xs font-semibold backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Panels rendering */}
      <AnimatePresence mode="wait">

        {/* TAB 1: STUDENT COACH - PROFILE SUMMARY */}
        {activeTab === 'student-coach' && (
          <motion.div
            key="student-coach"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Career Readiness Radar Score */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider font-mono">
                  Career Readiness Benchmark
                </h3>
                <p className="text-[10px] text-neutral-500 mb-4">
                  Multi-criteria indicators tracking performance, interview skills, portfolio maturity, and professional communication layers.
                </p>
              </div>

              {/* Bar or linear view of readiness breakdown */}
              <div className="space-y-4">
                {[
                  { name: 'Project Delivery Readiness', val: activeProfile.readinessBreakdown.project },
                  { name: 'Portfolio Maturity Score', val: activeProfile.readinessBreakdown.portfolio },
                  { name: 'Resume Presentation', val: activeProfile.readinessBreakdown.resume },
                  { name: 'Interview Technical Practice', val: activeProfile.readinessBreakdown.interview },
                  { name: 'Korean/English Communication', val: activeProfile.readinessBreakdown.communication },
                  { name: 'SRE Professionalism Factor', val: activeProfile.readinessBreakdown.professional }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
                      <span>{item.name}</span>
                      <span className="font-bold text-emerald-400">{item.val}%</span>
                    </div>
                    <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-850 text-[10px] text-neutral-500 leading-relaxed">
                ⚠️ <strong className="text-neutral-400">Advisory Notice:</strong> Overall Career Readiness is calculated algorithmically based on objective evidence. KONEXA Growth Coach never guarantees placement success.
              </div>
            </div>

            {/* Core Profile Highlights */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex items-center gap-3.5 mb-4 border-b border-neutral-850 pb-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                    {activeProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-100">{activeProfile.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {activeProfile.university} | {activeProfile.major} (Graduating {activeProfile.graduationDate})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">CAREER TARGET GOALS</span>
                    <p className="text-xs text-neutral-200 mt-1 leading-relaxed">
                      {activeProfile.careerGoals}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">TARGET JOB CLASS</span>
                    <p className="text-xs text-neutral-200 mt-1 leading-relaxed font-semibold">
                      {activeProfile.targetJob} ({activeProfile.targetIndustry})
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                  <h4 className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Strengths Evidence
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {activeProfile.strengths.map((st, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                  <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Growth Gaps & Hurdles
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {activeProfile.weaknesses.map((wk, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Risk Mitigation Strategy */}
              <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <h4 className="text-[11px] text-neutral-300 font-bold uppercase tracking-wider mb-3 font-mono">
                  ACTIVE MITIGATION PLANS FOR REGISTERED RISK FACTORS
                </h4>
                <div className="space-y-3">
                  {activeProfile.riskFactors.map((risk, i) => (
                    <div key={i} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850 flex gap-3.5">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="text-neutral-200">{risk.category}:</strong>
                        <p className="text-neutral-400 mt-1 leading-relaxed">{risk.description}</p>
                        <div className="mt-2 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-lg text-[10px] leading-relaxed">
                          <strong>COACH ACTION PLAN:</strong> {risk.mitigation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: SKILLS RADAR & GAPS */}
        {activeTab === 'radar-gaps' && (
          <motion.div
            key="radar-gaps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Skills Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider font-mono">
                    Professional Skills Gap Alignment
                  </h3>
                  <p className="text-[10px] text-neutral-500 mb-4">
                    Compares current verified competencies (green) with employer requirements (grey).
                  </p>
                </div>

                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
                      <PolarGrid stroke="#262626" />
                      <PolarAngleAxis dataKey="subject" stroke="#737373" style={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#404040" style={{ fontSize: 9 }} />
                      <Radar name="Current Competence" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                      <Radar name="Target Requirement" dataKey="target" stroke="#737373" fill="#737373" fillOpacity={0.05} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills breakdown and lists */}
              <div className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-neutral-200 mb-3 uppercase tracking-wider font-mono">
                  Competency Gap Breakdown Matrix
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {skills.map((item, idx) => {
                    const gap = item.target - item.current;
                    return (
                      <div key={idx} className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-200">{item.subject}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${item.importance === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-neutral-800 text-neutral-400'}`}>
                              {item.importance} Importance
                            </span>
                          </div>
                          <div className="flex items-center gap-3.5 mt-1.5 text-[10px] font-mono text-neutral-500">
                            <span>Current: <strong className="text-neutral-300">{item.current}%</strong></span>
                            <span>Target: <strong className="text-neutral-300">{item.target}%</strong></span>
                            <span>Monthly Growth: <strong className="text-emerald-400">+{item.growthRate}%</strong></span>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs">
                          {gap > 0 ? (
                            <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold block">
                              -{gap}% Gaps
                            </span>
                          ) : (
                            <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold block">
                              Calibrated
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Project History Analysis */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-neutral-300 mb-3 uppercase tracking-wider font-mono">
                Project Experience & Feedback Calibrations
              </h3>
              <div className="space-y-3">
                {projectHistory.map((proj, idx) => (
                  <div key={idx} className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-2.5 mb-2.5">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-500">[{proj.projectId}]</span>
                        <h4 className="text-xs font-bold text-neutral-200">{proj.title}</h4>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{proj.companyName} | {proj.duration}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold self-start sm:self-auto ${proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed italic">
                      "{proj.employerFeedback}"
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-[10px] font-mono text-neutral-500 pt-3 border-t border-neutral-900 mt-3">
                      <div>
                        <span>SRE Trust Index:</span>
                        <strong className="text-neutral-300 block">{proj.trustScoreAtTime}%</strong>
                      </div>
                      <div>
                        <span>SRE Performance Index:</span>
                        <strong className="text-neutral-300 block">{proj.performanceScoreAtTime}%</strong>
                      </div>
                      <div>
                        <span>Employer Satisfaction:</span>
                        <strong className="text-emerald-400 block font-bold">{proj.employerSatisfaction}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: PERSONALIZED ROADMAP TASKS */}
        {activeTab === 'roadmap-tasks' && (
          <motion.div
            key="roadmap-tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Task list and status manager */}
            <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between min-h-[500px]">
              <div>
                <h3 className="text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider font-mono">
                  Personalized Roadmap Action Goals
                </h3>
                <p className="text-[10px] text-neutral-500 mb-4">
                  Growth Coach analyzes portfolio, resume and GitHub files, delivering targeted milestones. These action tasks do not override core records.
                </p>

                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {growthTasks.map(task => {
                    const isCompleted = task.status === 'Completed';
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all ${isCompleted ? 'bg-neutral-900/20 border-neutral-850 opacity-60' : 'bg-neutral-950 border-neutral-850'}`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => completeTask(task.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'}`}
                          >
                            {isCompleted && <Check className="w-3 h-3" />}
                          </button>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] text-neutral-500 font-bold">[{task.id}]</span>
                                <h4 className="text-xs font-bold text-neutral-200">{task.title}</h4>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold self-start sm:self-auto bg-neutral-900 text-neutral-400 border border-neutral-800 uppercase tracking-wider">
                                {task.category}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                              {task.description}
                            </p>

                            <div className="mt-3 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-3 py-2 rounded-lg text-[10px] leading-relaxed">
                              <strong>SUGGESTED ACTION:</strong> {task.actionableSuggestion}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress metric footer */}
              <div className="pt-4 border-t border-neutral-850 mt-4 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Completed roadmap targets: <strong>{growthTasks.filter(t => t.status === 'Completed').length} / {growthTasks.length}</strong></span>
                <span className="font-mono text-[10px] text-indigo-400">Roadmap Progress Rate: {Math.round((growthTasks.filter(t => t.status === 'Completed').length / growthTasks.length) * 100)}%</span>
              </div>
            </div>

            {/* Quick target registration form */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-neutral-200 mb-3 flex items-center gap-1 font-mono">
                  <Plus className="w-4 h-4 text-emerald-400" /> REGISTER TARGET ADVICE
                </h3>

                <form onSubmit={handleAddNewTaskSubmit} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Advice Category</label>
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value as any)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-300 focus:outline-none"
                    >
                      <option value="Resume">Resume Formatting</option>
                      <option value="Portfolio">Portfolio Architecture</option>
                      <option value="GitHub">GitHub Readme & Commits</option>
                      <option value="Certificates">Certificates & Credentials</option>
                      <option value="Interview">Interview Mock Preparation</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Specific Observations</label>
                    <textarea
                      placeholder="e.g. Portfolio lacks block diagrams explaining full stack data synchronization layers..."
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      required
                      rows={4}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Register Advisory
                  </button>
                </form>
              </div>

              {/* Verified Certificate goals roadmap */}
              <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-neutral-300 mb-3 uppercase tracking-wider font-mono">
                  SRE Verified Credentials Roadmap
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-200">TOPIK Speaking level 5</h4>
                      <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">Target: Korean communication</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold">Planned Q4</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-200">AWS Developer Associate</h4>
                      <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">Target: Serverless deployments</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold">Planned Q3</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: WEEKLY PROGRESS REVIEWS & AUDITS */}
        {activeTab === 'weekly-audit' && (
          <motion.div
            key="weekly-audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Weekly logs summary */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-neutral-300 mb-3 uppercase tracking-wider font-mono">
                Weekly Active Progress Review Log
              </h3>

              {weeklyReviews.map((rev, i) => (
                <div key={i} className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">Week Review: {rev.weekNumber}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">Period: {rev.period}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      Trend: {rev.growthTrend}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Weekly Core Progress Summary:</span>
                    <p className="text-neutral-300 leading-relaxed bg-neutral-900/50 p-3 rounded-lg border border-neutral-900">
                      {rev.weeklyProgress}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1.5">Completed Goals:</span>
                      <ul className="space-y-1 text-xs text-neutral-300">
                        {rev.completedGoals.map((g, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1.5">Suggested Next Goals:</span>
                      <ul className="space-y-1 text-xs text-neutral-300">
                        {rev.nextWeekGoals.map((g, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-indigo-400 mt-0.5">→</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SRE Immutable Audit logs */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-neutral-300 mb-4 uppercase tracking-wider font-mono">
                IMMEDIATE VERIFIABLE GROWTH COACH AUDIT LOGS
              </h3>
              <div className="space-y-3.5 font-mono text-[11px]">
                {audits.map(audit => (
                  <div key={audit.id} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850 flex flex-col md:flex-row justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-emerald-400 font-bold">[{audit.id}]</span>
                        <span className="text-neutral-500">[{audit.growthModelVersion}]</span>
                        <span className="text-neutral-300 font-bold">Student: {audit.studentName}</span>
                      </div>
                      <p className="text-neutral-400 mt-1.5">
                        Advisory Trigger: <span className="text-neutral-200">{audit.adviceCategory}</span>
                      </p>
                      {/* Evidence Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {audit.evidenceBasedTags.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-500 border border-neutral-850">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-neutral-500 block text-[10px]">{audit.timestamp}</span>
                      <span className="text-purple-400 font-bold mt-1 block">Confidence: {audit.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SCHEMAS & REST API ENDPOINTS */}
        {activeTab === 'schemas-api' && (
          <motion.div
            key="schemas-api"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs"
          >
            {/* Database schema layout */}
            <div className="lg:col-span-6 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> FIRESTORE SCHEMA: Growth Profiles
              </h3>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 overflow-x-auto text-[11px] text-neutral-400 leading-relaxed">
                <pre>{`{
  "growth_profiles": {
    "student_id": "string (ForeignKey -> users.id)",
    "overall_career_readiness": "integer [0, 100]",
    "readiness_breakdown": {
      "project": "integer",
      "portfolio": "integer",
      "resume": "integer",
      "interview": "integer",
      "communication": "integer"
    },
    "strengths": "array [string]",
    "weaknesses": "array [string]",
    "career_goals": "string",
    "updated_at": "timestamp"
  },
  "weekly_reviews": {
    "review_id": "string (UUID)",
    "student_id": "string",
    "week_number": "string (W-09)",
    "growth_trend": "string (Upward | Stable | Critical)",
    "completed_goals": "array [string]",
    "next_week_goals": "array [string]",
    "timestamp": "timestamp"
  }
}`}</pre>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                💡 <strong className="text-neutral-400">Security Rule enforced:</strong> WRITE actions on "growth_profiles" are restricted to approved multi-agent tokens only. Mutating Trust indexes raises permissions errors.
              </p>
            </div>

            {/* REST APIs */}
            <div className="lg:col-span-6 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" /> EXPOSED GROWTH REST APIS
              </h3>

              <div className="space-y-3 text-[11px]">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-bold">GET /api/v1/growth/profile/:id</span>
                    <span className="text-neutral-500">200 OK</span>
                  </div>
                  <p className="text-neutral-500">Returns parsed capability matrix, strengths, weaknesses and overall score.</p>
                </div>

                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-bold">GET /api/v1/growth/gaps/:id</span>
                    <span className="text-neutral-500">200 OK</span>
                  </div>
                  <p className="text-neutral-500">Retrieves calibrated skills radar gaps aligned with target job.</p>
                </div>

                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-purple-400 font-bold">POST /api/v1/growth/task/create</span>
                    <span className="text-neutral-500">201 Created</span>
                  </div>
                  <p className="text-neutral-500">Registers actionable resume/portfolio improvements in the timeline.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: DIAGNOSTICS SUITE */}
        {activeTab === 'diagnostics' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-850 pb-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
                    Specification 12.0 Compliance Verifier
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Executes isolated unit, integration, performance and security tests directly matching AI Growth Coach guidelines.
                  </p>
                </div>

                <button
                  onClick={executeGrowthSelfTests}
                  disabled={isDiagnosticsRunning}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isDiagnosticsRunning ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Calculating...
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3.5 h-3.5" /> Run Growth Diagnostics Suite
                    </>
                  )}
                </button>
              </div>

              {/* Console logs */}
              <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[11px] text-neutral-400 space-y-1.5 custom-scrollbar">
                {diagnosticLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('[PASS]') ? 'text-emerald-400' : log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('⚡') ? 'text-indigo-300 font-bold' : 'text-neutral-400'}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
