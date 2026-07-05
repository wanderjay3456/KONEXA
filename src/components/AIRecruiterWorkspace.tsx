import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  TrendingUp,
  ArrowRight,
  Terminal,
  Database,
  Briefcase,
  Building,
  GraduationCap,
  Sparkles,
  Send,
  Check,
  Clock,
  Play,
  RotateCcw,
  BookOpen,
  HelpCircle,
  MessageSquare,
  FileText,
  Percent,
  Calendar,
  Share2,
  Lock,
  Compass,
  CheckSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ============================================================================
// TYPE DEFINITIONS (SPECIFICATION 11.0 - AI RECRUITER)
// ============================================================================

export interface RecruiterStudent {
  id: string;
  name: string;
  university: string;
  major: string;
  graduationDate: string;
  country: string;
  avatar: string;
  skills: string[];
  githubUrl: string;
  portfolioUrl: string;
  matchingScore: number;
  trustScore: number;
  performanceScore: number;
  riskScore: number;
  confidence: number;
  languageLevel: string;
  strengths: string[];
  weaknesses: string[];
  growthPotential: number;
  successProbability: number;
  hiringProbability: number;
  hasWarning: boolean;
  hasBadges: string[];
  availability: 'Immediate' | 'Part-time' | 'Unavailable';
}

export interface RecruiterProject {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  requiredSkills: string[];
  preferredMajor: string;
  duration: string;
  compensation: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Expert';
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedLearning: string;
  deliverables: string[];
}

export interface RecruiterCompany {
  id: string;
  name: string;
  size: string;
  industry: string;
  hiringHistoryCount: number;
  previousProjectsCount: number;
  preferredSkills: string[];
  communicationStyle: string;
  trustScore: number;
  mentorshipQuality: 'Excellent' | 'Good' | 'Fair';
  employerSatisfaction: number; // %
  profileSummary: string;
}

export interface PipelineStage {
  stageId: 'recommended' | 'contacted' | 'interested' | 'applied' | 'interview' | 'assigned' | 'hired';
  label: string;
  color: string;
}

export interface PipelineCandidate {
  id: string;
  studentId: string;
  studentName: string;
  stage: 'recommended' | 'contacted' | 'interested' | 'applied' | 'interview' | 'assigned' | 'hired';
  lastActivity: string;
  projectTitle: string;
  matchingScore: number;
}

export interface AuditRecord {
  id: string;
  recommendationId: string;
  candidateName: string;
  projectTitle: string;
  matchingVersion: string;
  confidence: number;
  riskScore: number;
  toolCalls: string[];
  timestamp: string;
}

// ============================================================================
// SEED DATA
// ============================================================================

const STAGES: PipelineStage[] = [
  { stageId: 'recommended', label: 'Recommended', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { stageId: 'contacted', label: 'Contacted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { stageId: 'interested', label: 'Interested', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { stageId: 'applied', label: 'Applied', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { stageId: 'interview', label: 'Interview', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { stageId: 'assigned', label: 'Project Assigned', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  { stageId: 'hired', label: 'Officially Hired', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
];

const SEED_STUDENTS: RecruiterStudent[] = [
  {
    id: 'STU-9901',
    name: 'Nguyen Hoang Long',
    university: 'FPT University',
    major: 'Software Engineering',
    graduationDate: '2027-02-15',
    country: 'Vietnam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    githubUrl: 'https://github.com/hoanglongdev',
    portfolioUrl: 'https://hoanglong.dev',
    matchingScore: 94,
    trustScore: 98,
    performanceScore: 92,
    riskScore: 12,
    confidence: 96,
    languageLevel: 'Korean TOPIK 4, English IELTS 7.5',
    strengths: ['Robust full-stack architecture skills', 'High project delivery rate', 'Exceptional communication discipline'],
    weaknesses: ['Limited experience with cloud serverless architectures', 'Prone to over-engineering simple features'],
    growthPotential: 95,
    successProbability: 92,
    hiringProbability: 88,
    hasWarning: false,
    hasBadges: ['Top Contributor', 'Clean Coder', 'On-Time Hero'],
    availability: 'Immediate'
  },
  {
    id: 'STU-9902',
    name: 'Park Ji-Min',
    university: 'Hanyang University',
    major: 'Computer Science & AI',
    graduationDate: '2026-08-30',
    country: 'South Korea',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    skills: ['Python', 'PyTorch', 'FastAPI', 'MongoDB', 'Next.js', 'AWS'],
    githubUrl: 'https://github.com/jiminpark-ai',
    portfolioUrl: 'https://jiminai.me',
    matchingScore: 89,
    trustScore: 95,
    performanceScore: 94,
    riskScore: 15,
    confidence: 91,
    languageLevel: 'Korean Native, English IELTS 7.0',
    strengths: ['Excellent machine learning foundations', 'Strong algorithmic optimization skills'],
    weaknesses: ['UX/UI implementation feels secondary', 'Limited experience working with team repository standards'],
    growthPotential: 91,
    successProbability: 88,
    hiringProbability: 85,
    hasWarning: false,
    hasBadges: ['Algorithms Master', 'AI Specialist'],
    availability: 'Immediate'
  },
  {
    id: 'STU-9903',
    name: 'Yuki Tanaka',
    university: 'Keio University',
    major: 'Information Technology',
    graduationDate: '2027-03-20',
    country: 'Japan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    skills: ['Vue.js', 'Spring Boot', 'MySQL', 'Java', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yuki-t',
    portfolioUrl: 'https://yuki.tokyo',
    matchingScore: 85,
    trustScore: 91,
    performanceScore: 87,
    riskScore: 22,
    confidence: 86,
    languageLevel: 'Japanese Native, Korean TOPIK 3, English TOEIC 850',
    strengths: ['Highly detail-oriented code layouts', 'Pristine technical writing skills'],
    weaknesses: ['Lower spoken Korean speed', 'Requires explicit specs to start coding'],
    growthPotential: 88,
    successProbability: 85,
    hiringProbability: 80,
    hasWarning: false,
    hasBadges: ['Detail Detective', 'Team First'],
    availability: 'Part-time'
  },
  {
    id: 'STU-9904',
    name: 'Abishek Patel',
    university: 'IIT Bombay',
    major: 'Data Science',
    graduationDate: '2026-12-10',
    country: 'India',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    skills: ['Python', 'SQL', 'TensorFlow', 'Tableau', 'Docker', 'React'],
    githubUrl: 'https://github.com/abishekpatel',
    portfolioUrl: 'https://apatel.io',
    matchingScore: 78,
    trustScore: 88,
    performanceScore: 85,
    riskScore: 28,
    confidence: 82,
    languageLevel: 'English Fluent, Korean Beginner',
    strengths: ['Advanced numerical analytical methods', 'Rapid data extraction pipelines'],
    weaknesses: ['Limited Korean language comfort', 'Minimal frontend state flow expertise'],
    growthPotential: 90,
    successProbability: 79,
    hiringProbability: 75,
    hasWarning: true,
    hasBadges: ['Data Wizard'],
    availability: 'Part-time'
  }
];

const SEED_PROJECTS: RecruiterProject[] = [
  {
    id: 'PROJ-RECR-401',
    title: 'Korean Commerce Localization Frontend',
    companyName: 'FPT Software Korea',
    industry: 'E-commerce & Localization',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    preferredMajor: 'Software Engineering',
    duration: '8 Weeks',
    compensation: '₩2,500,000 / month',
    difficulty: 'Intermediate',
    riskLevel: 'Low',
    expectedLearning: 'Master enterprise-level Korean localization workflows, RTL rendering architectures, and local payment gateway APIs.',
    deliverables: [
      'Interactive responsive localized dashboard view',
      'Integration of Toss Payments & KakaoPay test sandbox APIs',
      'Unified localization schema mapping for multilingual switching'
    ]
  },
  {
    id: 'PROJ-RECR-402',
    title: 'Smart Factory Predictive Maintenance AI',
    companyName: 'Samsung SDS Partner',
    industry: 'Industrial IoT & Smart Factory',
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'AWS'],
    preferredMajor: 'Computer Science & AI',
    duration: '12 Weeks',
    compensation: '₩3,500,000 / month',
    difficulty: 'Expert',
    riskLevel: 'High',
    expectedLearning: 'Implement multivariate anomaly detection algorithms, handle high-frequency IoT sensors telemetry streaming, and build secure API interfaces.',
    deliverables: [
      'Model training script & calibrated anomaly boundaries report',
      'Stream-aligned FastAPI monitoring telemetry server endpoints',
      'Dockerized container orchestration blueprint'
    ]
  }
];

const SEED_COMPANIES: RecruiterCompany[] = [
  {
    id: 'COMP-7701',
    name: 'FPT Software Korea',
    size: '10,000+ employees (Global Group)',
    industry: 'Enterprise Software & IT Consulting',
    hiringHistoryCount: 42,
    previousProjectsCount: 18,
    preferredSkills: ['React', 'Node.js', 'TypeScript', 'Spring Boot'],
    communicationStyle: 'Collaborative with bi-weekly English/Korean syncs',
    trustScore: 98,
    mentorshipQuality: 'Excellent',
    employerSatisfaction: 94,
    profileSummary: 'FPT Software is a global technology powerhouse. The Korean branch specializes in bridging international developer talent with high-caliber Korean enterprise platforms, emphasizing robust mentoring and structural career growth.'
  },
  {
    id: 'COMP-7702',
    name: 'Samsung SDS Partner',
    size: '150 - 500 employees',
    industry: 'Industrial Automation & Enterprise AI',
    hiringHistoryCount: 15,
    previousProjectsCount: 8,
    preferredSkills: ['Python', 'TensorFlow', 'FastAPI', 'Kubernetes'],
    communicationStyle: 'Technical specifications first, strict Korean protocol',
    trustScore: 94,
    mentorshipQuality: 'Good',
    employerSatisfaction: 89,
    profileSummary: 'A high-tier Samsung SDS tier-1 integration partner specializing in smart manufacturing analytics and predictive AI frameworks. Ideal for deep technical researchers.'
  }
];

const SEED_PIPELINE: PipelineCandidate[] = [
  { id: 'PIP-001', studentId: 'STU-9901', studentName: 'Nguyen Hoang Long', stage: 'recommended', lastActivity: 'Recommended by Matching Score (94%)', projectTitle: 'Korean Commerce Localization Frontend', matchingScore: 94 },
  { id: 'PIP-002', studentId: 'STU-9902', studentName: 'Park Ji-Min', stage: 'contacted', lastActivity: 'Sent personal invitation message', projectTitle: 'Smart Factory Predictive Maintenance AI', matchingScore: 89 },
  { id: 'PIP-003', studentId: 'STU-9903', studentName: 'Yuki Tanaka', stage: 'applied', lastActivity: 'Candidate submitted official code portfolio', projectTitle: 'Korean Commerce Localization Frontend', matchingScore: 85 },
  { id: 'PIP-004', studentId: 'STU-9904', studentName: 'Abishek Patel', stage: 'interview', lastActivity: 'Technical interview suggested questions generated', projectTitle: 'Smart Factory Predictive Maintenance AI', matchingScore: 78 }
];

const SEED_AUDITS: AuditRecord[] = [
  {
    id: 'AUD-REC-8001',
    recommendationId: 'REC-9201-AA',
    candidateName: 'Nguyen Hoang Long',
    projectTitle: 'Korean Commerce Localization Frontend',
    matchingVersion: 'Matching Engine v11.0.4',
    confidence: 96,
    riskScore: 12,
    toolCalls: ['getStudentProfile', 'calculateSkillOverlap', 'verifyLanguageProficiency'],
    timestamp: '2026-07-04T21:30:15Z'
  },
  {
    id: 'AUD-REC-8002',
    recommendationId: 'REC-9202-BB',
    candidateName: 'Park Ji-Min',
    projectTitle: 'Smart Factory Predictive Maintenance AI',
    matchingVersion: 'Matching Engine v11.0.4',
    confidence: 91,
    riskScore: 15,
    toolCalls: ['getStudentProfile', 'evaluateModelCompetence', 'checkRepositoryIntegrity'],
    timestamp: '2026-07-04T21:32:44Z'
  }
];

// Recharts simulated analytics data
const OUTREACH_DATA = [
  { month: 'Jan', Sent: 40, Opened: 38, Applied: 22, Completed: 18, Hired: 4 },
  { month: 'Feb', Sent: 60, Opened: 58, Applied: 35, Completed: 28, Hired: 7 },
  { month: 'Mar', Sent: 85, Opened: 82, Applied: 50, Completed: 42, Hired: 12 },
  { month: 'Apr', Sent: 120, Opened: 115, Applied: 74, Completed: 60, Hired: 18 },
  { month: 'May', Sent: 145, Opened: 139, Applied: 92, Completed: 75, Hired: 24 },
  { month: 'Jun', Sent: 190, Opened: 182, Applied: 120, Completed: 95, Hired: 32 }
];

const SUCCESS_METRICS_DATA = [
  { name: 'Proj Success', value: 96.5, color: '#3b82f6' },
  { name: 'Hiring Conv', value: 81.2, color: '#10b981' },
  { name: 'Rec Acceptance', value: 88.4, color: '#8b5cf6' },
  { name: 'Emp Sat', value: 92.0, color: '#f59e0b' }
];

// ============================================================================
// MAIN WORKSPACE COMPONENT
// ============================================================================

export default function AIRecruiterWorkspace() {
  // Navigation State
  const [activePanel, setActivePanel] = useState<'dashboard' | 'discovery' | 'pipeline' | 'employer' | 'api-schemas' | 'diagnostics'>('dashboard');

  // Core Mutable States
  const [students, setStudents] = useState<RecruiterStudent[]>(SEED_STUDENTS);
  const [pipeline, setPipeline] = useState<PipelineCandidate[]>(SEED_PIPELINE);
  const [audits, setAudits] = useState<AuditRecord[]>(SEED_AUDITS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU-9901');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PROJ-RECR-401');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('COMP-7701');

  // Interactive filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [minTrust, setMinTrust] = useState(80);
  const [minPerf, setMinPerf] = useState(80);
  const [excludeWarnings, setExcludeWarnings] = useState(false);

  // Outreach simulator
  const [selectedOutreachMethod, setSelectedOutreachMethod] = useState<'Email' | 'Platform' | 'KakaoTalk'>('Platform');
  const [generatedMessageText, setGeneratedMessageText] = useState('');
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);

  // Diagnostics Playground states
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    'Recruiter diagnostics offline.',
    'Click "Trigger Complete Core Engine Test Suite" to verify functional capabilities.'
  ]);

  // Toast notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Synchronized message generator when method/student changes
  useEffect(() => {
    const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
    const activeProj = SEED_PROJECTS.find(p => p.id === selectedProjectId) || SEED_PROJECTS[0];

    let msg = '';
    if (selectedOutreachMethod === 'Platform') {
      msg = `[KONEXA AI RECRUITER] Hello ${activeStudent.name},\n\nOur candidate mapping algorithms analyzed your FPT portfolio and registered your 94% skills compatibility score with the "${activeProj.title}" project. We would love to sponsor your project kickoff. Please confirm your availability!`;
    } else if (selectedOutreachMethod === 'Email') {
      msg = `Subject: SRE Verified Recruitment Recommendation - ${activeProj.title}\n\nDear ${activeStudent.name},\n\nFPT Software Korea has flagged your unique development credentials. Your Trust Score of ${activeStudent.trustScore}% and overall performance metrics qualify you for our project sponsorship pipeline.\n\nBest Regards,\nKONEXA Enterprise Recruiter`;
    } else {
      msg = `[KONEXA KAKAOTALK ALIMTALK]\nDear ${activeStudent.name},\nYour skills match is verified for "${activeProj.title}" on the KONEXA system. Tap here to start your onboarding!`;
    }
    setGeneratedMessageText(msg);
  }, [selectedStudentId, selectedProjectId, selectedOutreachMethod]);

  // Handle Pipeline candidate state transition
  const transitionCandidateStage = (candId: string, nextStage: PipelineCandidate['stage']) => {
    setPipeline(prev => prev.map(item => {
      if (item.id === candId) {
        return {
          ...item,
          stage: nextStage,
          lastActivity: `Transitioned stage to "${STAGES.find(s => s.stageId === nextStage)?.label}" via AI Recruiter Workspace.`
        };
      }
      return item;
    }));
    showToast(`Candidate stage updated successfully.`);
  };

  // Handle manual outreach send
  const sendOutreachMessage = () => {
    setIsSendingOutreach(true);
    setTimeout(() => {
      setIsSendingOutreach(false);
      const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
      const activeProj = SEED_PROJECTS.find(p => p.id === selectedProjectId) || SEED_PROJECTS[0];

      // Update candidate pipeline entry to 'contacted' if it exists
      const existingInPipeline = pipeline.find(p => p.studentId === activeStudent.id);
      if (existingInPipeline) {
        setPipeline(prev => prev.map(p => {
          if (p.studentId === activeStudent.id && p.stage === 'recommended') {
            return { ...p, stage: 'contacted' as const, lastActivity: `Contacted via personalized ${selectedOutreachMethod}` };
          }
          return p;
        }));
      } else {
        // Add new candidate to pipeline
        const newCand: PipelineCandidate = {
          id: `PIP-GEN-${Math.floor(Math.random() * 900) + 100}`,
          studentId: activeStudent.id,
          studentName: activeStudent.name,
          stage: 'contacted',
          lastActivity: `Contacted via personalized ${selectedOutreachMethod}`,
          projectTitle: activeProj.title,
          matchingScore: activeStudent.matchingScore
        };
        setPipeline(prev => [...prev, newCand]);
      }

      // Add a fresh Audit log record
      const newAudit: AuditRecord = {
        id: `AUD-REC-${Math.floor(Math.random() * 9000) + 1000}`,
        recommendationId: `REC-${Math.floor(Math.random() * 90000) + 10000}-XX`,
        candidateName: activeStudent.name,
        projectTitle: activeProj.title,
        matchingVersion: 'Matching Engine v11.0.4',
        confidence: activeStudent.confidence,
        riskScore: activeStudent.riskScore,
        toolCalls: ['getPersonalizedTemplate', 'notifyChannel', 'syncPipelineAudit'],
        timestamp: new Date().toISOString()
      };
      setAudits(prev => [newAudit, ...prev]);

      showToast(`Outreach delivered successfully! Pipeline and Audits updated.`);
    }, 1200);
  };

  // Run comprehensive diagnostic tests suite for recruiter
  const runDiagnostics = async () => {
    if (isDiagnosticsRunning) return;
    setIsDiagnosticsRunning(true);
    setDiagnosticLogs([]);

    const log = (msg: string) => {
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('🧪 Starting AI Recruiter Specification 11.0 test suites...');
    await new Promise(r => setTimeout(r, 400));

    log('🔍 UNIT TEST 1: Project Profile Analysis & Metadata Parsing...');
    log('Analyzing industry, required skills, preferred majors and risk vectors...');
    log('Validating compensation format [₩2,500,000 / month]... [PASS]');
    await new Promise(r => setTimeout(r, 450));

    log('⚖️ INTEGRATION TEST 2: Multi-Criteria Filter Constraint Verifier...');
    log('Checking strict business rule: Candidates with active warnings must be hidden if excludeWarnings toggled...');
    log('Ensuring suspended or rejected candidates never bypassed... [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('📈 PERFORMANCE TEST 3: Candidate Search Latency under simulated 100k queries...');
    log('Vector similarity evaluation executed on database nodes...');
    log('Calculated average latency: 42ms (Sub-second target matched). [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('🛡️ SECURITY TEST 4: PII Masking and Audit Logging Validation...');
    log('Verifying student details write locks on database sessions...');
    log('Ensuring Trust modifications and score modifications are completely disallowed for Recruiter tools... [PASS]');
    await new Promise(r => setTimeout(r, 450));

    log('✅ COMPREHENSIVE RECRUITER VERIFICATION SUCCESSFUL. All engines calibrated.');
    setIsDiagnosticsRunning(false);
  };

  // Calculations for filtered candidates
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    const nameMatch = s.name.toLowerCase().includes(q) || s.university.toLowerCase().includes(q);
    const majorMatch = selectedMajor === 'ALL' || s.major === selectedMajor;
    const countryMatch = selectedCountry === 'ALL' || s.country === selectedCountry;
    const trustLimit = s.trustScore >= minTrust;
    const perfLimit = s.performanceScore >= minPerf;
    const warningLimit = !excludeWarnings || !s.hasWarning;

    return nameMatch && majorMatch && countryMatch && trustLimit && perfLimit && warningLimit;
  });

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const activeProject = SEED_PROJECTS.find(p => p.id === selectedProjectId) || SEED_PROJECTS[0];
  const activeCompany = SEED_COMPANIES.find(c => c.id === selectedCompanyId) || SEED_COMPANIES[0];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-recruiter-workspace-root">
      {/* Background highlight decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
              SPECIFICATION 11.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Enterprise Recruitment Partner
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100 mt-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" /> AI Recruiter Workspace
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Sponsors project-based recruitment for verified Korean companies. Discovers eligible international student portfolios, generates explainable matching candidates, and manages personalized outreach flows.
          </p>
        </div>

        {/* Global SRE KPI Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">PROJECT MATCH RATE</span>
              <span className="text-purple-400 font-bold">96.5%</span>
            </div>
            <div className="border-l border-neutral-800 h-6 pl-4">
              <span className="text-neutral-500 block text-[9px] uppercase">CONVERSION RATE</span>
              <span className="text-emerald-400 font-bold">81.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panels Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800 pb-3 mb-6">
        {[
          { id: 'dashboard', label: 'Recruitment Analytics & KPI', icon: TrendingUp },
          { id: 'discovery', label: 'Candidate Discovery & Explanation', icon: Search },
          { id: 'pipeline', label: 'Candidate Pipeline Manager', icon: Sliders },
          { id: 'employer', label: 'Employer Intelligence Profiles', icon: Building },
          { id: 'api-schemas', label: 'Database Schemas & APIs', icon: Database },
          { id: 'diagnostics', label: 'Diagnostic Playbook Suite', icon: Terminal }
        ].map(p => {
          const Icon = p.icon;
          const isActive = activePanel === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePanel(p.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 bg-purple-900/90 border border-purple-700/50 text-purple-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 text-xs font-semibold backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Panel View Render */}
      <AnimatePresence mode="wait">

        {/* PANEL 1: RECRUITMENT ANALYTICS */}
        {activePanel === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KPI grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Project Completion Success', value: '96.5%', desc: 'Overall student deliverables approval rate', color: 'text-purple-400' },
                { label: 'Hiring Conversion', value: '81.2%', desc: 'Contract extensions post project completion', color: 'text-emerald-400' },
                { label: 'Recommendation Acceptance', value: '88.4%', desc: 'Employer acceptance of shortlists', color: 'text-indigo-400' },
                { label: 'Avg Matching Score', value: '87.5%', desc: 'Platform skill mapping calibrated index', color: 'text-pink-400' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase font-bold tracking-wider">{kpi.label}</span>
                  <div className={`text-xl font-extrabold mt-1.5 ${kpi.color}`}>{kpi.value}</div>
                  <p className="text-[10px] text-neutral-400 mt-1">{kpi.desc}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Hiring Outreach Funnel */}
              <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-neutral-200 mb-4 uppercase tracking-wider font-mono">
                  Autonomous Outreach & Conversion Funnel
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={OUTREACH_DATA}>
                      <defs>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="month" stroke="#737373" style={{ fontSize: 10 }} />
                      <YAxis stroke="#737373" style={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040' }} />
                      <Legend style={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="Sent" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSent)" />
                      <Area type="monotone" dataKey="Applied" stroke="#3b82f6" fillOpacity={0} />
                      <Area type="monotone" dataKey="Hired" stroke="#10b981" fillOpacity={1} fill="url(#colorHired)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Success Metrics breakdown */}
              <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-200 mb-1.5 uppercase tracking-wider font-mono">
                    Success Rates Breakdown
                  </h3>
                  <p className="text-[10px] text-neutral-500 mb-4">
                    Audited parameters aligned with KONEXA criteria standards.
                  </p>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  {SUCCESS_METRICS_DATA.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
                        <span>{item.name}</span>
                        <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Triggers Timeline Feed */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-neutral-300 mb-4 font-mono">
                REAL-TIME RECRUITMENT TIMELINE & EVENT LOGGER
              </h3>
              <div className="space-y-3.5 font-mono text-xs">
                <div className="flex items-start gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 self-center shrink-0">21:35:10 UTC</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1" />
                  <p className="text-neutral-300 flex-1">
                    <span className="text-purple-400 font-bold">[EVENT_PROJECT_PUBLISHED]</span> Company Samsung SDS Partner published new project <strong className="text-neutral-100">"Smart Factory Predictive Maintenance AI"</strong>. Automated candidate mapping pool initialized.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 self-center shrink-0">21:30:15 UTC</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                  <p className="text-neutral-300 flex-1">
                    <span className="text-emerald-400 font-bold">[EVENT_APPLICATION_SUBMITTED]</span> Candidate <strong className="text-neutral-100">Nguyen Hoang Long</strong> submitted official application for Commerce Localization Project. Matching verified at 94%.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 self-center shrink-0">21:28:44 UTC</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                  <p className="text-neutral-300 flex-1">
                    <span className="text-amber-400 font-bold">[EVENT_MATCHING_UPDATED]</span> Auto-calibrated Trust score matching threshold for Keio University Tanaka Yuki. Recommendation accepted under advisor advisory.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 2: CANDIDATE DISCOVERY & EXPLANATION ENGINE */}
        {activePanel === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Filter sidebar layout */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl h-[620px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                  <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
                    Candidate Filter Engine
                  </h3>
                  <Filter className="w-3.5 h-3.5 text-neutral-500" />
                </div>

                {/* Text search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search name, university, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Select Major */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">University Major</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-3 text-neutral-300 focus:outline-none"
                  >
                    <option value="ALL">All Majors</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                {/* Select Country */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Country / Region</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-3 text-neutral-300 focus:outline-none"
                  >
                    <option value="ALL">All Countries</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Japan">Japan</option>
                    <option value="India">India</option>
                  </select>
                </div>

                {/* Minimum trust slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    <span>Min Trust Score</span>
                    <span className="text-purple-400 font-mono">{minTrust}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={minTrust}
                    onChange={(e) => setMinTrust(Number(e.target.value))}
                    className="w-full accent-purple-500 bg-neutral-950 rounded-lg h-1"
                  />
                </div>

                {/* Minimum performance slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    <span>Min Performance Score</span>
                    <span className="text-purple-400 font-mono">{minPerf}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={minPerf}
                    onChange={(e) => setMinPerf(Number(e.target.value))}
                    className="w-full accent-purple-500 bg-neutral-950 rounded-lg h-1"
                  />
                </div>

                {/* Exclude warnings */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="exclude-warnings"
                    checked={excludeWarnings}
                    onChange={(e) => setExcludeWarnings(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-800 text-purple-600 focus:ring-0"
                  />
                  <label htmlFor="exclude-warnings" className="text-[11px] text-neutral-400 font-medium cursor-pointer">
                    Exclude Candidates with Active Warnings
                  </label>
                </div>
              </div>

              {/* SRE Reset */}
              <div className="pt-4 border-t border-neutral-850">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMajor('ALL');
                    setSelectedCountry('ALL');
                    setMinTrust(80);
                    setMinPerf(80);
                    setExcludeWarnings(false);
                    showToast('Filters reset to default.');
                  }}
                  className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters Matrix
                </button>
              </div>
            </div>

            {/* Candidates list & detail mapping */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Main List panel */}
              <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-xs font-bold text-neutral-300 mb-3 uppercase tracking-wider font-mono">
                  DISCOVERED CANDIDATE MATCHES ({filteredStudents.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredStudents.map(student => {
                    const isSelected = student.id === selectedStudentId;
                    return (
                      <div
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 ${isSelected ? 'bg-purple-500/10 border-purple-500/40 shadow-xl' : 'bg-neutral-900/40 border-neutral-850 hover:bg-neutral-900/60'}`}
                      >
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-800 self-start"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-neutral-200 truncate">{student.name}</h4>
                            <span className="text-[10px] text-purple-400 font-mono font-bold bg-purple-500/5 px-1.5 rounded">
                              {student.matchingScore}% Match
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{student.university} | {student.major}</p>
                          
                          {/* Indicators row */}
                          <div className="flex items-center gap-3 mt-2 text-[9px] font-mono text-neutral-500">
                            <span>Trust: <strong className="text-neutral-300">{student.trustScore}</strong></span>
                            <span>Performance: <strong className="text-neutral-300">{student.performanceScore}</strong></span>
                            {student.hasWarning && (
                              <span className="text-rose-400 flex items-center gap-0.5 font-bold">
                                <AlertTriangle className="w-2.5 h-2.5" /> Warning
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <div className="col-span-2 py-8 text-center text-neutral-500 text-xs font-mono">
                      No matching student profiles located with current filter constraints.
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Candidate EXPLANATION ENGINE Output */}
              {activeStudent && (
                <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={activeStudent.avatar} alt={activeStudent.name} className="w-11 h-11 rounded-full object-cover border" />
                      <div>
                        <h3 className="text-sm font-extrabold text-neutral-100">{activeStudent.name}</h3>
                        <p className="text-[10px] text-neutral-400 font-mono">{activeStudent.university} — {activeStudent.major}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-500">Confidence:</span>
                      <span className="text-xs font-mono font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {activeStudent.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Explainable evidence sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths / Why Recommended */}
                    <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                      <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Primary Alignment Evidence
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-300">
                        {activeStudent.strengths.map((str, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk parameters */}
                    <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                      <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Potential SRE Risk Profile
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-300">
                        {activeStudent.weaknesses.map((weak, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                        <li className="text-[10px] font-mono text-neutral-500 pt-1.5 border-t border-neutral-900 mt-1">
                          Calculated Overall Risk Index: <span className={activeStudent.riskScore > 20 ? 'text-amber-400 font-bold' : 'text-neutral-400 font-bold'}>{activeStudent.riskScore}%</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Dynamic interview question generator */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                    <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-500" /> Suggested Technical & Behavioral Interview Questions
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="border-l-2 border-purple-500/40 pl-3">
                        <span className="text-[9px] font-mono uppercase text-purple-400 block font-bold">Technical / Deliverable Inquiry</span>
                        <p className="text-neutral-300 mt-0.5">
                          "You mapped high React compatibility. Can you explain how you would configure optimized multilingual hydration layers to support Toss Payments localization?"
                        </p>
                      </div>
                      <div className="border-l-2 border-amber-500/40 pl-3">
                        <span className="text-[9px] font-mono uppercase text-amber-400 block font-bold">Behavioral Risk Remediation</span>
                        <p className="text-neutral-300 mt-0.5">
                          "We noted your feedback parameters recommend structured spec files. How do you maintain velocity in rapid proto environments with ambiguous requirements?"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kickoff checklists */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-purple-950/20 border border-purple-800/20 p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-purple-400 uppercase font-mono block mb-1.5">Student Kickoff Milestones</span>
                      <ul className="space-y-1 text-neutral-300 text-[11px]">
                        <li className="flex items-center gap-1.5"><CheckSquare className="w-3 h-3 text-purple-400 shrink-0" /> Local repository workspace environment configured</li>
                        <li className="flex items-center gap-1.5"><CheckSquare className="w-3 h-3 text-purple-400 shrink-0" /> Complete OAuth setup & verified integration credentials</li>
                      </ul>
                    </div>
                    <div className="bg-purple-950/20 border border-purple-800/20 p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-purple-400 uppercase font-mono block mb-1.5">Company Onboarding Milestones</span>
                      <ul className="space-y-1 text-neutral-300 text-[11px]">
                        <li className="flex items-center gap-1.5"><CheckSquare className="w-3 h-3 text-purple-400 shrink-0" /> Assign technical lead mentor for weekly syncs</li>
                        <li className="flex items-center gap-1.5"><CheckSquare className="w-3 h-3 text-purple-400 shrink-0" /> Provision project sandbox APIs tossed client tokens</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PANEL 3: CANDIDATE PIPELINE & OUTREACH ENGINE */}
        {activePanel === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Outreach simulator section */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Message Composer */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-purple-400" /> Autonomous Outreach & Invitation Composer
                </h3>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-500 font-bold uppercase">Target Candidate</label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-300"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.matchingScore}% Match)</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-500 font-bold uppercase">Sponsoring Project</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-300"
                    >
                      {SEED_PROJECTS.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Channel selection */}
                <div className="flex gap-2">
                  {(['Platform', 'Email', 'KakaoTalk'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => setSelectedOutreachMethod(method)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${selectedOutreachMethod === method ? 'bg-purple-500/15 border-purple-500/35 text-purple-300' : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'}`}
                    >
                      {method === 'Platform' ? 'Platform Message' : method === 'Email' ? 'Personalized Email' : 'KakaoTalk App'}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase font-mono">Generated Personalized outreach Template</label>
                  <textarea
                    value={generatedMessageText}
                    onChange={(e) => setGeneratedMessageText(e.target.value)}
                    rows={5}
                    className="w-full bg-neutral-950 border border-neutral-850 p-3 rounded-xl text-xs text-neutral-300 font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    * AI personalized layout utilizing candidate skills data.
                  </span>
                  <button
                    onClick={sendOutreachMessage}
                    disabled={isSendingOutreach}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-900/10"
                  >
                    {isSendingOutreach ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Delivering...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Dispatch Outreach Flow
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recruitment Pipeline Stages list */}
              <div className="lg:col-span-4 bg-neutral-950/60 border border-neutral-850 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono mb-3">
                    Active Pipeline Funnel Stages
                  </h4>
                  <div className="space-y-2">
                    {STAGES.map(stg => {
                      const count = pipeline.filter(p => p.stage === stg.stageId).length;
                      return (
                        <div key={stg.stageId} className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/50 border border-neutral-850">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stg.color}`}>
                            {stg.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-300">{count} candidates</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-900 text-[10px] text-neutral-500 leading-relaxed">
                  Every stage transition triggers synchronized events in the Candidate and Company messaging dashboards.
                </div>
              </div>
            </div>

            {/* Pipeline candidates board list */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-neutral-300 mb-4 uppercase tracking-wider font-mono">
                Active Candidate Stage Transition board
              </h3>

              <div className="space-y-3">
                {pipeline.map(cand => (
                  <div
                    key={cand.id}
                    className="bg-neutral-950 border border-neutral-850 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-neutral-200">{cand.studentName}</h4>
                        <span className="text-[9px] font-mono text-neutral-500">[{cand.id}]</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Sponsoring Project: <strong className="text-neutral-300">{cand.projectTitle}</strong></p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-1">Last activity: {cand.lastActivity}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Active stage badge */}
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${STAGES.find(s => s.stageId === cand.stage)?.color}`}>
                        {STAGES.find(s => s.stageId === cand.stage)?.label}
                      </span>

                      {/* Transition button */}
                      {cand.stage !== 'hired' && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase font-mono mr-1">Move to:</span>
                          {STAGES.filter((_, idx) => {
                            const currentIdx = STAGES.findIndex(s => s.stageId === cand.stage);
                            return idx === currentIdx + 1;
                          }).map(nextStg => (
                            <button
                              key={nextStg.stageId}
                              onClick={() => transitionCandidateStage(cand.id, nextStg.stageId)}
                              className="px-2.5 py-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-400 text-[10px] font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              {nextStg.label} <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 4: EMPLOYER INTELLIGENCE */}
        {activePanel === 'employer' && (
          <motion.div
            key="employer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sponsoring Companies selection list */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl h-[420px] flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
                  Sponsoring Employer Partners
                </h3>
                <div className="space-y-2">
                  {SEED_COMPANIES.map(comp => {
                    const isSelected = comp.id === selectedCompanyId;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedCompanyId(comp.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-purple-500/10 border-purple-500/40' : 'bg-neutral-900/40 border-neutral-850 hover:bg-neutral-900/60'}`}
                      >
                        <h4 className="text-xs font-bold text-neutral-200">{comp.name}</h4>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">{comp.industry}</span>
                        <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-neutral-500">
                          <span>Satisfaction: <strong className="text-emerald-400">{comp.employerSatisfaction}%</strong></span>
                          <span>Projects: <strong>{comp.previousProjectsCount}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono leading-relaxed pt-3 border-t border-neutral-850">
                All employer records comply with Korean enterprise registration constraints.
              </div>
            </div>

            {/* Profile intelligence output details */}
            <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-100">{activeCompany.name}</h3>
                  <span className="text-[10px] text-neutral-500 font-mono">Company ID: {activeCompany.id} | Size: {activeCompany.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500">Satisfaction Score:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded">
                    {activeCompany.employerSatisfaction}%
                  </span>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                <span className="text-[9px] font-bold text-purple-400 uppercase font-mono block mb-1">Company Profile summary</span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeCompany.profileSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">COMMUNICATION STYLE</span>
                  <span className="text-neutral-200 mt-1 block font-semibold">{activeCompany.communicationStyle}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">MENTORSHIP CAPACITY</span>
                  <span className="text-purple-400 mt-1 block font-semibold">{activeCompany.mentorshipQuality} Level</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">PREFERRED SKILLS SET</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeCompany.preferredSkills.map((sk, idx) => (
                      <span key={idx} className="text-[9px] bg-neutral-900 px-1 rounded text-neutral-400">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects profile aligning */}
              <div className="border-t border-neutral-850 pt-4">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono mb-3">
                  Sponsoring Project Details
                </h4>

                <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-neutral-200">{activeProject.title}</h5>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      Difficulty: {activeProject.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <strong className="text-neutral-300">Expected Learning Outcome:</strong> {activeProject.expectedLearning}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 font-mono">
                    <span>Duration: <strong className="text-neutral-200">{activeProject.duration}</strong></span>
                    <span>Stipend: <strong className="text-neutral-200">{activeProject.compensation}</strong></span>
                  </div>

                  <div className="pt-2 border-t border-neutral-900">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Deliverable Requirements</span>
                    <ul className="space-y-1 text-[11px] text-neutral-300">
                      {activeProject.deliverables.map((d, idx) => (
                        <li key={idx} className="flex gap-1.5">
                          <span className="text-purple-400">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 5: SCHEMAS & APIS */}
        {activePanel === 'api-schemas' && (
          <motion.div
            key="api-schemas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Database schema layout specs */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" /> PostgreSQL Database Relations & Tables (Spec 11.0)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {[
                  {
                    table: 'recruitment_sessions',
                    desc: 'Tracks interactive sessions created by employer representatives to run candidate discover evaluations.',
                    cols: ['id (UUID)', 'company_id (UUID)', 'project_id (UUID)', 'matching_score_threshold (INT)', 'status (VARCHAR)', 'created_at (TIMESTAMP)']
                  },
                  {
                    table: 'recommendation_records',
                    desc: 'Stores unique candidate recommendation items with overall match scores, explainable evidence summaries and SRE risks.',
                    cols: ['id (UUID)', 'session_id (UUID)', 'student_id (UUID)', 'overall_score (INT)', 'confidence (INT)', 'evidence_matrix (JSONB)', 'risk_score (INT)']
                  },
                  {
                    table: 'candidate_rankings',
                    desc: 'Provides ordered list of top 10 recommended students evaluated by parallel capability engines.',
                    cols: ['id (UUID)', 'session_id (UUID)', 'rank_position (INT)', 'student_id (UUID)', 'match_accuracy (DECIMAL)', 'availability_verified (BOOLEAN)']
                  },
                  {
                    table: 'recruitment_analytics_logs',
                    desc: 'Stores immutable system performance indicators for KPI evaluation (latency, conversion status).',
                    cols: ['log_id (UUID)', 'action_type (VARCHAR)', 'pipeline_latency_ms (INT)', 'conversion_status (VARCHAR)', 'timestamp (TIMESTAMP)']
                  }
                ].map((schema, idx) => (
                  <div key={idx} className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                    <span className="text-purple-400 font-bold block mb-1">TABLE: {schema.table}</span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">{schema.desc}</p>
                    <div className="bg-neutral-900 p-2.5 rounded text-[10px] text-neutral-400 space-y-1">
                      <strong className="text-neutral-500 uppercase block text-[8px] tracking-wider mb-1">Columns Definitions:</strong>
                      {schema.cols.map((col, i) => (
                        <div key={i} className="flex justify-between border-b border-neutral-950 pb-0.5 last:border-0">
                          <span>{col.split(' ')[0]}</span>
                          <span className="text-neutral-500">{col.split(' ')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REST API Endpoints Playground */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" /> REST API Endpoint Specification & Playground
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Method selector */}
                <div className="lg:col-span-5 space-y-2">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1 font-mono">Available API Operations</span>
                  {[
                    { id: 'REC_GEN', method: 'POST', path: '/api/v1/recruiter/recommend', desc: 'Runs Ranking Engine & returns top candidate shortlists with AI explanations.' },
                    { id: 'CAND_GET', method: 'GET', path: '/api/v1/recruiter/candidates', desc: 'Performs semantic vector search across student databases with filter criteria.' },
                    { id: 'OUTREACH_SEND', method: 'POST', path: '/api/v1/recruiter/outreach', desc: 'Dispatches personalized invitations to KakaoTalk or Email channels.' },
                    { id: 'KPI_GET', method: 'GET', path: '/api/v1/recruiter/analytics', desc: 'Returns employer conversion tracking analytics and project timelines.' }
                  ].map(api => (
                    <div
                      key={api.id}
                      className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 flex items-start gap-3 hover:border-neutral-700 transition-all cursor-pointer"
                    >
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${api.method === 'GET' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {api.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono font-semibold text-neutral-300 block truncate">{api.path}</span>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{api.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Playground response viewer */}
                <div className="lg:col-span-7 bg-neutral-950 p-4 rounded-xl border border-neutral-850 font-mono text-[11px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-3 text-[10px]">
                      <span className="text-neutral-500">SIMULATED RESPONSE PLAYGROUND</span>
                      <span className="text-emerald-400 font-bold">HTTP 200 OK</span>
                    </div>

                    <pre className="text-neutral-400 overflow-x-auto p-1 leading-relaxed text-[10px]">
{`{
  "status": "success",
  "endpoint": "/api/v1/recruiter/recommend",
  "data": {
    "recommendationId": "REC-99012-LONG",
    "project": "Korean Commerce Localization Frontend",
    "rankedCandidates": [
      {
        "rank": 1,
        "studentId": "STU-9901",
        "name": "Nguyen Hoang Long",
        "matchingScore": 94,
        "confidence": 96,
        "riskScore": 12,
        "evidence": {
          "why": "Candidate possesses top-tier 98% React matching criteria. Previous completed milestone delivery history with Toss payments sandbox."
        }
      }
    ]
  },
  "auditTraceId": "AUD-RECR-8012-AF",
  "timestamp": "${new Date().toISOString()}"
}`}
                    </pre>
                  </div>

                  <p className="text-[10px] text-neutral-600 mt-4 leading-normal">
                    * Interactive sandbox proxies requests directly to candidate ranking and matching engines.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 6: DIAGNOSTICS & AUDIT LOGS */}
        {activePanel === 'diagnostics' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left side: test runner */}
            <div className="lg:col-span-6 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between h-[520px]">
              <div>
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono mb-1.5">
                  AI Recruiter Core Engine Diagnostics SRE Playground
                </h3>
                <p className="text-[10px] text-neutral-500 mb-4">
                  Run standard Unit, Integration, Performance, and Security simulations to verify Specification 11.0 compliance.
                </p>

                {/* Logs Terminal */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 font-mono text-[10px] text-neutral-400 h-72 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {diagnosticLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log.includes('[PASS]') ? (
                        <span className="text-emerald-400 font-bold">{log}</span>
                      ) : log.includes('Start') || log.includes('⚡') ? (
                        <span className="text-purple-400 font-semibold">{log}</span>
                      ) : (
                        <span>{log}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 font-mono">Status: <strong>Nominal</strong></span>
                <button
                  onClick={runDiagnostics}
                  disabled={isDiagnosticsRunning}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isDiagnosticsRunning ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Running Diagnostics...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Trigger Core Engine Test Suite
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right side: immutable audit logs */}
            <div className="lg:col-span-6 bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl flex flex-col h-[520px]">
              <div className="mb-3">
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono mb-1">
                  Immutable Recruitment Recommendation Audit Logs
                </h3>
                <p className="text-[10px] text-neutral-500">
                  Every candidate shortlist, matching confidence metric, and corresponding tool call trace are logged immutably.
                </p>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {audits.map(audit => (
                  <div
                    key={audit.id}
                    className="bg-neutral-950 border border-neutral-850 p-3 rounded-lg text-xs font-mono hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5 mb-2">
                      <span className="text-purple-400 font-bold">{audit.id}</span>
                      <span className="text-[10px] text-neutral-500">{new Date(audit.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-neutral-300">
                      <div>Rec ID: <span className="text-neutral-400">{audit.recommendationId}</span></div>
                      <div>Candidate: <strong className="text-neutral-200">{audit.candidateName}</strong></div>
                      <div>Project: <strong className="text-neutral-200">{audit.projectTitle}</strong></div>
                      <div>Matching Engine: <span className="text-neutral-500">{audit.matchingVersion}</span></div>
                    </div>

                    {/* Tool calls */}
                    <div className="mt-2 pt-2 border-t border-neutral-900">
                      <span className="text-[9px] text-neutral-500 uppercase block mb-1">Tool Calls Trace:</span>
                      <div className="flex flex-wrap gap-1">
                        {audit.toolCalls.map((tc, idx) => (
                          <span key={idx} className="text-[9px] bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
                            {tc}
                          </span>
                        ))}
                      </div>
                    </div>
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
