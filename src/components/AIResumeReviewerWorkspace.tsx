import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
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
  User,
  Activity,
  ArrowRight,
  Plus,
  Check,
  ShieldCheck,
  Lock,
  ChevronRight,
  RotateCcw,
  Users,
  Target,
  Layers,
  Upload,
  AlertCircle,
  FileDown,
  RefreshCw,
  Eye,
  Settings,
  HelpCircle as QuestionIcon
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ============================================================================
// CORE TYPE DEFINITIONS (SPECIFICATION 13.0 - AI RESUME REVIEWER)
// ============================================================================

export interface ResumeProject {
  name: string;
  role: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  originalAchievements?: string[]; // for undoing optimizations
  verified: boolean;
  inconsistencies: string[];
  fraudFlags: string[];
  employerSatisfaction: number;
}

export interface SkillGapItem {
  subject: string;
  current: number; // 0-100
  target: number;  // 0-100
  status: 'Match' | 'Gap' | 'Overstated' | 'Emerging';
  verifiedInProjects: boolean;
}

export interface ResumeKeyword {
  word: string;
  type: 'Technical' | 'Industry' | 'Role-Specific' | 'ATS-Priority';
  status: 'Present' | 'Missing';
  density: number; // percentage in document
}

export interface LanguageAnalysisItem {
  language: string;
  grammarScore: number; // 0-100
  clarity: 'High' | 'Medium' | 'Low';
  tone: 'Professional' | 'Academic' | 'Too Passive' | 'Generic';
  localization: 'Native' | 'Excellent' | 'Needs Localization';
}

export interface ResumeRoadmapTask {
  id: string;
  category: 'Critical' | 'Recommended' | 'Optional';
  task: string;
  impact: 'High' | 'Medium' | 'Low';
  expectedImprovement: string;
  timeline: string;
  status: 'Pending' | 'Completed';
}

export interface ResumeVersion {
  id: string;
  date: string;
  score: number;
  description: string;
  addedSkills: string[];
  addedProjects: string[];
  removedContent: string[];
}

export interface FraudReportItem {
  id: string;
  type: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Flagged' | 'Resolved' | 'Cleared';
}

export interface ResumeProfile {
  studentId: string;
  name: string;
  university: string;
  major: string;
  graduationDate: string;
  experienceLevel: 'Entry' | 'Associate' | 'Intermediate' | 'Senior';
  overallScore: number;
  scores: {
    structure: number;
    professionalism: number;
    completeness: number;
    atsReadiness: number;
    keywordCoverage: number;
    projectQuality: number;
    verifiedEvidence: number;
    consistency: number;
  };
  summary: {
    text: string;
    clarity: 'Excellent' | 'Good' | 'Needs Work';
    professionalism: 'High' | 'Medium' | 'Low';
    keywordCoveragePercent: number;
    lengthWords: number;
    recommendations: string[];
  };
  contactInfo: {
    email: string;
    phone: string;
    github: string;
    portfolio: string;
    linkedin: string;
    completionStatus: 'Complete' | 'Incomplete';
    missingItems: string[];
  };
  projects: ResumeProject[];
  skills: SkillGapItem[];
  keywords: ResumeKeyword[];
  atsDetails: {
    formatting: 'Excellent' | 'Good' | 'Needs Review';
    readabilityScore: number;
    headingConsistency: boolean;
    bulletPointsCount: number;
    fileStructure: 'Clean' | 'Complex Tables' | 'Images Used';
  };
  languages: LanguageAnalysisItem[];
  roadmap: ResumeRoadmapTask[];
  versions: ResumeVersion[];
  fraudReports: FraudReportItem[];
  collaborationSignals: {
    growthCoach: string;
    recruiter: string;
    pm: string;
    portfolioReviewer: string;
  };
}

// ============================================================================
// SYSTEM AUDIT RECORD FOR REVISION TRACING
// ============================================================================
export interface ResumeAuditTrail {
  id: string;
  studentName: string;
  eventType: string;
  evidenceRef: string;
  promptVersion: string;
  confidence: number;
  timestamp: string;
}

// ============================================================================
// DATABASE SEED - NOMINAL PRODUCTION SIMULATION POOL
// ============================================================================

const SEED_RESUME_PROFILES: ResumeProfile[] = [
  {
    studentId: 'STU-9401',
    name: 'Nguyen Minh Anh',
    university: 'FPT University Ho Chi Minh',
    major: 'Cloud & Network Security',
    graduationDate: 'May 2026',
    experienceLevel: 'Intermediate',
    overallScore: 74,
    scores: {
      structure: 88,
      professionalism: 80,
      completeness: 75,
      atsReadiness: 65,
      keywordCoverage: 60,
      projectQuality: 82,
      verifiedEvidence: 85,
      consistency: 55, // Inconsistency flagged: date overlaps with internship
    },
    summary: {
      text: 'Highly motivated cybersecurity student looking for an entry-level cloud security engineer position where I can utilize my network setup skills and experience with Linux servers. Passionate about cyber defense and willing to work hard.',
      clarity: 'Good',
      professionalism: 'Medium',
      keywordCoveragePercent: 45,
      lengthWords: 34,
      recommendations: [
        'Summary is too objective-focused and passive. Reframe to display core competencies, cloud tools (e.g., AWS, Terraform), and measurable achievements.',
        'Increase keywords relating to infrastructure-as-code and cloud threat assessment.'
      ]
    },
    contactInfo: {
      email: 'minhanh.nguyen@fpt.edu.vn',
      phone: '+84 908 123 456',
      github: 'github.com/minhanh-netsec',
      portfolio: 'minhanh.sec.io',
      linkedin: 'linkedin.com/in/minhanh-netsec',
      completionStatus: 'Complete',
      missingItems: []
    },
    projects: [
      {
        name: 'Enterprise Cloud Firewall Deployment',
        role: 'Lead DevSecOps Specialist',
        duration: 'Jun 2025 - Sep 2025',
        responsibilities: [
          'Set up security rules on AWS VPC.',
          'Assisted team members in configuring open-source firewalls.',
          'Wrote bash scripts for telemetry logs.'
        ],
        technologies: ['AWS', 'Terraform', 'pfSense', 'Bash', 'Splunk'],
        originalAchievements: [
          'Configured firewall rules safely.',
          'Monitored logs.'
        ],
        achievements: [
          'Configured firewall rules safely.',
          'Monitored logs.'
        ],
        verified: true,
        inconsistencies: [],
        fraudFlags: [],
        employerSatisfaction: 94
      },
      {
        name: 'Local VPC Intrusion System Simulation',
        role: 'Security Analyst intern',
        duration: 'Sep 2025 - Dec 2025',
        responsibilities: [
          'Maintained Snort IDS configuration on local servers.',
          'Investigated false positive alarm occurrences.'
        ],
        technologies: ['Snort IDS', 'Linux', 'Python', 'Wireshark'],
        originalAchievements: [
          'Identified bad intrusion attempts.',
          'Generated simulation logs.'
        ],
        achievements: [
          'Identified bad intrusion attempts.',
          'Generated simulation logs.'
        ],
        verified: true,
        inconsistencies: [
          'Work duration overlap: Student claims full-time role during regular semester weeks at FPT. Trust Engine flags potential double-employment or simulation overload.'
        ],
        fraudFlags: [
          'Overlap detected with regular full-time internship enrollment hours.'
        ],
        employerSatisfaction: 88
      }
    ],
    skills: [
      { subject: 'Cloud Infrastructure', current: 75, target: 90, status: 'Gap', verifiedInProjects: true },
      { subject: 'Threat Modeling', current: 50, target: 85, status: 'Gap', verifiedInProjects: false },
      { subject: 'Automation/IaC', current: 80, target: 80, status: 'Match', verifiedInProjects: true },
      { subject: 'Linux Systems', current: 90, target: 85, status: 'Match', verifiedInProjects: true },
      { subject: 'Penetration Testing', current: 95, target: 70, status: 'Overstated', verifiedInProjects: false }, // Overstated based on verified projects
      { subject: 'Kubernetes Sec', current: 30, target: 75, status: 'Emerging', verifiedInProjects: false }
    ],
    keywords: [
      { word: 'Terraform', type: 'Technical', status: 'Present', density: 1.8 },
      { word: 'AWS Security', type: 'Technical', status: 'Present', density: 2.1 },
      { word: 'Threat Modeling', type: 'Technical', status: 'Missing', density: 0.0 },
      { word: 'CI/CD Pipelines', type: 'Technical', status: 'Missing', density: 0.0 },
      { word: 'Zero Trust Architecture', type: 'ATS-Priority', status: 'Missing', density: 0.0 },
      { word: 'Security Compliance', type: 'Industry', status: 'Present', density: 1.2 },
      { word: 'Vulnerability Assessment', type: 'Role-Specific', status: 'Missing', density: 0.0 }
    ],
    atsDetails: {
      formatting: 'Good',
      readabilityScore: 72,
      headingConsistency: true,
      bulletPointsCount: 14,
      fileStructure: 'Complex Tables' // Bad for ATS parser compatibility
    },
    languages: [
      { language: 'English', grammarScore: 82, clarity: 'Medium', tone: 'Too Passive', localization: 'Needs Localization' },
      { language: 'Vietnamese', grammarScore: 98, clarity: 'High', tone: 'Professional', localization: 'Native' }
    ],
    roadmap: [
      { id: 'RM-01', category: 'Critical', task: 'Remove nested tables in resume structure to comply with strict ATS scanners.', impact: 'High', expectedImprovement: '+15 ATS Readiness', timeline: '1 Day', status: 'Pending' },
      { id: 'RM-02', category: 'Critical', task: 'Resolve internship date collision: adjust resume timeline to correspond with verified academic records.', impact: 'High', expectedImprovement: 'Eliminate Fraud Warning Flag', timeline: '1 Day', status: 'Pending' },
      { id: 'RM-03', category: 'Recommended', task: 'Add AWS security metrics and quantifiable telemetry details from the Enterprise Cloud Firewall project.', impact: 'Medium', expectedImprovement: '+10 Project Quality Score', timeline: '3 Days', status: 'Pending' },
      { id: 'RM-04', category: 'Optional', task: 'Translate/Localize resume professional tone to active corporate English standards.', impact: 'Medium', expectedImprovement: '+8 Professionalism', timeline: '1 Week', status: 'Pending' }
    ],
    versions: [
      { id: 'V1', date: '2026-06-15', score: 62, description: 'Initial import from student-typed markdown editor.', addedSkills: [], addedProjects: [], removedContent: [] },
      { id: 'V2', date: '2026-07-02', score: 74, description: 'Added verified Enterprise Cloud Firewall project record.', addedSkills: ['AWS', 'pfSense'], addedProjects: ['Enterprise Cloud Firewall Deployment'], removedContent: ['Self-claimed hackathon placeholder'] }
    ],
    fraudReports: [
      { id: 'FRD-101', type: 'Timeline Chronological Collision', description: 'Student claimed full-time internship hours overlapping standard academic lecture slots without official workspace exemptions.', severity: 'Medium', status: 'Flagged' }
    ],
    collaborationSignals: {
      growthCoach: 'Assigned Action Item: Complete Cloud Defense Path (KCN-202).',
      recruiter: 'Flagged: Viable candidate for FPT Cloud DevOps trainee role (Awaiting fix on overlap anomaly).',
      pm: 'Verified 100% submission score on AWS Cloud Firewall labs.',
      portfolioReviewer: 'No connected repository link found. Request portfolio link update.'
    }
  },
  {
    studentId: 'STU-1855',
    name: 'Park Ji-Won',
    university: 'Seoul National University',
    major: 'Artificial Intelligence & ML',
    graduationDate: 'Feb 2026',
    experienceLevel: 'Entry',
    overallScore: 86,
    scores: {
      structure: 95,
      professionalism: 92,
      completeness: 88,
      atsReadiness: 90,
      keywordCoverage: 78,
      projectQuality: 70, // Missing measurable metrics
      verifiedEvidence: 92,
      consistency: 95,
    },
    summary: {
      text: 'Deep learning researcher experienced in PyTorch neural model tuning, NLP attention weights, and academic thesis writing. Actively looking for AI Engineer internships.',
      clarity: 'Excellent',
      professionalism: 'High',
      keywordCoveragePercent: 70,
      lengthWords: 24,
      recommendations: [
        'Extremely academic. Transform bullet points from "worked on" to corporate high-impact delivery indicators.',
        'Incorporate model acceleration and optimization metrics if available.'
      ]
    },
    contactInfo: {
      email: 'jiwon.park@snu.ac.kr',
      phone: '+82 10 2345 6789',
      github: 'github.com/jiwon-park-snu',
      portfolio: 'jiwon-ai.github.io',
      linkedin: 'linkedin.com/in/jiwon-ai',
      completionStatus: 'Complete',
      missingItems: []
    },
    projects: [
      {
        name: 'LLM Quantization & Distillation Pipeline',
        role: 'Research Assistant',
        duration: 'Mar 2025 - Jun 2025',
        responsibilities: [
          'Aided in writing PyTorch training scripts.',
          'Tuned attention-head learning rates under guidance.',
          'Ran inference benchmark comparisons.'
        ],
        technologies: ['PyTorch', 'HuggingFace', 'Docker', 'CUDA'],
        originalAchievements: [
          'Optimized neural model performance.',
          'Wrote clean code.'
        ],
        achievements: [
          'Optimized neural model performance.',
          'Wrote clean code.'
        ],
        verified: true,
        inconsistencies: [],
        fraudFlags: [],
        employerSatisfaction: 96
      }
    ],
    skills: [
      { subject: 'Deep Learning', current: 95, target: 95, status: 'Match', verifiedInProjects: true },
      { subject: 'Model Optimization', current: 65, target: 85, status: 'Gap', verifiedInProjects: true },
      { subject: 'PyTorch/CUDA', current: 90, target: 90, status: 'Match', verifiedInProjects: true },
      { subject: 'Software Architecture', current: 40, target: 80, status: 'Gap', verifiedInProjects: false },
      { subject: 'Distributed Training', current: 50, target: 75, status: 'Emerging', verifiedInProjects: false }
    ],
    keywords: [
      { word: 'Deep Learning', type: 'Technical', status: 'Present', density: 2.4 },
      { word: 'PyTorch', type: 'Technical', status: 'Present', density: 3.0 },
      { word: 'Model Quantization', type: 'Technical', status: 'Present', density: 1.1 },
      { word: 'CUDA Optimization', type: 'Technical', status: 'Missing', density: 0.0 },
      { word: 'Kubernetes Orchestration', type: 'Technical', status: 'Missing', density: 0.0 },
      { word: 'Inference Latency', type: 'ATS-Priority', status: 'Missing', density: 0.0 }
    ],
    atsDetails: {
      formatting: 'Excellent',
      readabilityScore: 88,
      headingConsistency: true,
      bulletPointsCount: 9,
      fileStructure: 'Clean'
    },
    languages: [
      { language: 'Korean', grammarScore: 100, clarity: 'High', tone: 'Professional', localization: 'Native' },
      { language: 'English', grammarScore: 92, clarity: 'High', tone: 'Academic', localization: 'Excellent' }
    ],
    roadmap: [
      { id: 'RM-11', category: 'Recommended', task: 'Replace "Optimized neural model" with quantitative stats: e.g. "Reduced memory usage by 32% via FP16 quantization."', impact: 'High', expectedImprovement: '+15 Project Quality Score', timeline: '2 Days', status: 'Pending' },
      { id: 'RM-12', category: 'Recommended', task: 'Inject high-priority ATS keyword: "Inference Latency" or "Distributed Training" into model pipelines description.', impact: 'Medium', expectedImprovement: '+10 Keyword Coverage', timeline: '1 Day', status: 'Pending' }
    ],
    versions: [
      { id: 'V11', date: '2026-05-10', score: 80, description: 'Initial Academic CV format import.', addedSkills: [], addedProjects: [], removedContent: [] },
      { id: 'V12', date: '2026-06-20', score: 86, description: 'Reformatted layout for ATS compatibility standards.', addedSkills: ['Docker'], addedProjects: [], removedContent: ['Complex graphic side columns'] }
    ],
    fraudReports: [],
    collaborationSignals: {
      growthCoach: 'Recommended Path: Advanced MLops Deployment on AWS.',
      recruiter: 'Matched: Samsung AI Research Lab - Trainee Engineer.',
      pm: 'A+ Grade verified on SNU Deep Learning Lab Capstone.',
      portfolioReviewer: 'GitHub repository validated. Clean code compliance verified.'
    }
  }
];

// Target Companies & Roles map for dynamic alignment scoring
const TARGET_COMPANIES_POOL = [
  { companyId: 'COM-01', name: 'FPT Cloud Systems', position: 'Cloud Security Associate', requiredSkills: ['Cloud Infrastructure', 'Automation/IaC', 'Linux Systems'], requiredKeywords: ['AWS Security', 'Terraform', 'CI/CD Pipelines'] },
  { companyId: 'COM-02', name: 'Samsung Electronics AI Lab', position: 'ML Inference Engineer', requiredSkills: ['Deep Learning', 'Model Optimization', 'PyTorch/CUDA'], requiredKeywords: ['PyTorch', 'Model Quantization', 'CUDA Optimization', 'Inference Latency'] },
  { companyId: 'COM-03', name: 'Siemens Digital Solutions', position: 'Fullstack Platform Trainee', requiredSkills: ['Software Architecture', 'Automation/IaC', 'Distributed Training'], requiredKeywords: ['CI/CD Pipelines', 'Zero Trust Architecture'] }
];

export default function AIResumeReviewerWorkspace() {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'parser_audit' | 'validation' | 'skills_keywords' | 'employer_roadmap' | 'version_fraud' | 'dashboards' | 'api_specs'>('parser_audit');
  
  // Simulation States
  const [profiles, setProfiles] = useState<ResumeProfile[]>(SEED_RESUME_PROFILES);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU-9401');
  const [selectedTargetCompanyId, setSelectedTargetCompanyId] = useState<string>('COM-01');
  const [studentPermissionForEmployer, setStudentPermissionForEmployer] = useState<boolean>(true);
  
  // Custom File Upload Simulator State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingInProgress, setIsParsingInProgress] = useState<boolean>(false);
  const [parseConsoleLogs, setParseConsoleLogs] = useState<string[]>([]);
  
  // Diagnostic self-tests state
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState<boolean>(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  
  // Active Resume State
  const activeProfile = profiles.find(p => p.studentId === selectedStudentId) || profiles[0];
  
  // Audit Trail State
  const [auditLogs, setAuditLogs] = useState<ResumeAuditTrail[]>([
    {
      id: 'AUD-RES-501',
      studentName: 'Nguyen Minh Anh',
      eventType: 'Resume Processed & Parsed',
      evidenceRef: 'SHA256:7f90e3a41b2',
      promptVersion: 'KonexaResumeReviewerEngine_v13.0_Production',
      confidence: 96.5,
      timestamp: '2026-07-04T12:00:00Z'
    },
    {
      id: 'AUD-RES-502',
      studentName: 'Park Ji-Won',
      eventType: 'Academic Experience Verified vs Core Registrar',
      evidenceRef: 'DurableSmartContract_SNU_0x8ab99',
      promptVersion: 'KonexaResumeReviewerEngine_v13.0_Production',
      confidence: 100.0,
      timestamp: '2026-07-04T14:30:00Z'
    }
  ]);

  // Handle dynamic overall score adjustment depending on selected target company alignment
  const [dynamicAlignmentScore, setDynamicAlignmentScore] = useState<number>(0);

  useEffect(() => {
    // Calculate dynamic employer alignment score
    const target = TARGET_COMPANIES_POOL.find(c => c.companyId === selectedTargetCompanyId) || TARGET_COMPANIES_POOL[0];
    
    // Check match of required skills
    let matchedSkills = 0;
    target.requiredSkills.forEach(req => {
      const studentSkill = activeProfile.skills.find(s => s.subject === req);
      if (studentSkill && studentSkill.current >= 75) {
        matchedSkills++;
      }
    });

    // Check match of keywords
    let matchedKeywords = 0;
    target.requiredKeywords.forEach(req => {
      const keywordObj = activeProfile.keywords.find(k => k.word === req);
      if (keywordObj && keywordObj.status === 'Present') {
        matchedKeywords++;
      }
    });

    const skillScore = (matchedSkills / target.requiredSkills.length) * 50;
    const keywordScore = (matchedKeywords / target.requiredKeywords.length) * 50;
    const calculatedAlignment = Math.min(100, Math.round(skillScore + keywordScore));
    setDynamicAlignmentScore(calculatedAlignment);
  }, [selectedTargetCompanyId, activeProfile, selectedStudentId]);

  // Utility toast function
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. SIMULATE FILE UPLOAD & ATS PARSING
  const simulateFileUpload = (fileType: 'PDF' | 'DOCX' | 'Markdown') => {
    setIsParsingInProgress(true);
    setParseConsoleLogs([]);
    const simulatedName = `resume_draft_submission_${activeProfile.name.toLowerCase().replace(/ /g, '_')}.${fileType.toLowerCase()}`;
    setUploadedFileName(simulatedName);

    const logSteps = [
      '📡 Receiving document payload stream (nominal buffer 45.2 KB)...',
      '🔓 Verifying document integrity checksums (MD5: 8f9b9a11)...',
      '🤖 Instantiating KONEXA AI OCR Pipeline & Layout Segmenter...',
      '🔍 Segmenting headers, professional summary, experience nodes, and certificate maps...',
      '⚙️ Running multi-language NLP grammar engines & cross-checks...',
      '🔎 Initiating Experience Validation Protocol vs Project Database...',
      '⚡ Flagging anomalies: Cross-checking academic calendars & dual contract periods...',
      '📈 Compiling final structure, alignment, and compatibility reports...',
      '✅ Parse completed successfully! Dynamic indices refreshed.'
    ];

    let delay = 0;
    logSteps.forEach((step, index) => {
      setTimeout(() => {
        setParseConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === logSteps.length - 1) {
          setIsParsingInProgress(false);
          // Boost scores as if parsed
          setProfiles(prev => prev.map(p => {
            if (p.studentId === activeProfile.studentId) {
              return {
                ...p,
                overallScore: Math.min(100, p.overallScore + 2),
                scores: {
                  ...p.scores,
                  structure: Math.min(100, p.scores.structure + 5),
                  atsReadiness: Math.min(100, p.scores.atsReadiness + 3)
                }
              };
            }
            return p;
          }));
          // Add Audit Log
          const newAudit: ResumeAuditTrail = {
            id: `AUD-RES-${Math.floor(Math.random() * 900) + 600}`,
            studentName: activeProfile.name,
            eventType: `Dynamic File Upload & Parse (${fileType})`,
            evidenceRef: `BLOB_REF_0x${Math.floor(Math.random() * 10000000).toString(16)}`,
            promptVersion: 'KonexaResumeReviewerEngine_v13.0_Production',
            confidence: 98.2,
            timestamp: new Date().toISOString()
          };
          setAuditLogs(prev => [newAudit, ...prev]);
          triggerToast(`Resume updated via ${fileType} parsing engine!`);
        }
      }, delay);
      delay += 400;
    });
  };

  // 2. OPTIMIZE ACHIVEMENT VERB WITH EVIDENCE-BASED METRIC
  const optimizeAchievement = (projectIndex: number, achievementIndex: number) => {
    // Define some realistic metric enhancements based on student profile
    let enhancement = '';
    let successMsg = '';
    
    if (activeProfile.studentId === 'STU-9401') {
      if (achievementIndex === 0) {
        enhancement = 'Deployed AWS security rules securing VPC, blocking over 12k suspicious scans daily while reducing network routing overhead by 15% (Employer Verified).';
        successMsg = 'Enhanced AWS VPC rules with verified employer firewall metrics!';
      } else {
        enhancement = 'Monitored firewall logging streams via Bash and Splunk, building an automated Slack alert pipeline that cut incident response SLA from 12 hours down to 18 minutes.';
        successMsg = 'Injected verifiable automated Slack and Splunk logs alert SLA metric!';
      }
    } else {
      if (achievementIndex === 0) {
        enhancement = 'Engineered FP16 neural model quantization pipelines in PyTorch, reducing memory footprint by 42% and increasing transformer inference speed by 35% under peak loads.';
        successMsg = 'Optimized with verified FP16 PyTorch distillation metric!';
      } else {
        enhancement = 'Wrote production-grade ML optimization code following strict linting pipelines, resulting in a zero-defect deployment verified during capstone registrar review.';
        successMsg = 'Aligned model code quality with SNU registrar validation trail!';
      }
    }

    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        const updatedProjects = [...p.projects];
        const proj = { ...updatedProjects[projectIndex] };
        const updatedAchievements = [...proj.achievements];
        updatedAchievements[achievementIndex] = enhancement;
        proj.achievements = updatedAchievements;
        updatedProjects[projectIndex] = proj;

        // Increase quality and overall score
        const newProjectScore = Math.min(100, p.scores.projectQuality + 10);
        const newOverall = Math.min(100, Math.round((p.overallScore + 4)));
        
        return {
          ...p,
          overallScore: newOverall,
          scores: {
            ...p.scores,
            projectQuality: newProjectScore
          },
          projects: updatedProjects
        };
      }
      return p;
    }));

    // Add Audit Log
    const newAudit: ResumeAuditTrail = {
      id: `AUD-RES-${Math.floor(Math.random() * 900) + 600}`,
      studentName: activeProfile.name,
      eventType: 'Quantifiable Achievement Metric Injected',
      evidenceRef: `DB_VERIFIED_PROJECT_METRIC_${projectIndex}`,
      promptVersion: 'KonexaResumeReviewerEngine_v13.0_Production',
      confidence: 99.1,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    triggerToast(successMsg);
  };

  // Revert / Reset optimization to original
  const resetOptimizations = () => {
    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        const resetProjects = p.projects.map(proj => ({
          ...proj,
          achievements: [...(proj.originalAchievements || proj.achievements)]
        }));
        
        // Reset scores to nominal seed values
        const seedProfile = SEED_RESUME_PROFILES.find(sp => sp.studentId === p.studentId);
        return {
          ...p,
          overallScore: seedProfile ? seedProfile.overallScore : p.overallScore,
          scores: seedProfile ? { ...seedProfile.scores } : p.scores,
          projects: resetProjects
        };
      }
      return p;
    }));
    triggerToast('Resume achievements reset to unoptimized self-claimed states.');
  };

  // Complete roadmap step
  const toggleRoadmapTask = (taskId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        const updatedRoadmap = p.roadmap.map(item => {
          if (item.id === taskId) {
            const nextStatus: 'Pending' | 'Completed' = item.status === 'Completed' ? 'Pending' : 'Completed';
            return { ...item, status: nextStatus };
          }
          return item;
        });
        
        // Calculate newly completed tasks and boost ATS or structure score dynamically
        const completedCount = updatedRoadmap.filter(r => r.status === 'Completed').length;
        const previousCompletedCount = p.roadmap.filter(r => r.status === 'Completed').length;
        const delta = (completedCount - previousCompletedCount) * 4;

        return {
          ...p,
          overallScore: Math.min(100, p.overallScore + delta),
          scores: {
            ...p.scores,
            atsReadiness: Math.min(100, p.scores.atsReadiness + delta),
            consistency: completedCount > 0 ? 85 : p.scores.consistency // resolve collision if rm-02 is ticked
          },
          roadmap: updatedRoadmap
        };
      }
      return p;
    }));
    triggerToast('Roadmap task status synchronized.');
  };

  // Add customized roadmap advice
  const [newRoadmapTaskText, setNewRoadmapTaskText] = useState('');
  const [newRoadmapImpact, setNewRoadmapImpact] = useState<'High' | 'Medium' | 'Low'>('Medium');
  
  const handleAddRoadmapTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmapTaskText.trim()) return;

    const newTask: ResumeRoadmapTask = {
      id: `RM-GEN-${Math.floor(Math.random() * 900) + 100}`,
      category: 'Recommended',
      task: newRoadmapTaskText,
      impact: newRoadmapImpact,
      expectedImprovement: '+5 Quality Points',
      timeline: '3 Days',
      status: 'Pending'
    };

    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        return {
          ...p,
          roadmap: [newTask, ...p.roadmap]
        };
      }
      return p;
    }));

    // Add Audit Log
    const newAudit: ResumeAuditTrail = {
      id: `AUD-RES-${Math.floor(Math.random() * 900) + 600}`,
      studentName: activeProfile.name,
      eventType: 'Manual Advisory Item Added to Roadmap',
      evidenceRef: 'USER_MAPPED_ADVICE',
      promptVersion: 'KonexaResumeReviewerEngine_v13.0_Production',
      confidence: 94.0,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setNewRoadmapTaskText('');
    triggerToast('Added custom review target to dynamic roadmap.');
  };

  // Execute AI Resume Reviewer self-diagnostic test cases
  const runSelfTestDiagnostics = async () => {
    if (isDiagnosticsRunning) return;
    setIsDiagnosticsRunning(true);
    setDiagnosticLogs([]);

    const log = (msg: string) => {
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('⚡ Starting AI Resume Reviewer Specification 13.0 Enterprise Diagnostics...');
    await new Promise(r => setTimeout(r, 400));

    log('📁 UNIT TEST 1: Multi-format Parser Node Verification (PDF, DOCX, TXT, MD)...');
    log('Checking schema parsing delimiters against LinkedIn exports... [OK]');
    log('Testing OCR boundary segments under complex table grids... [OK]');
    await new Promise(r => setTimeout(r, 450));

    log('🛡️ SECURITY TEST 2: Write-Lock Validation & Blocked Operations...');
    log('Attempting illegal instruction: Trust Score Force Override token authorization...');
    log('Access denied: code 403 (Direct modification of core trust scores strictly locked)... [OK]');
    await new Promise(r => setTimeout(r, 400));

    log('🧠 INTEGRATION TEST 3: Dynamic Skill Graph vs Verified Projects Checker...');
    log('Loading current active student skill list to check overstated vs verified claims...');
    log('Discovered gap: Student Minh Anh claims "Penetration Testing (95%)" but verified project database evidence supports basic configuration. Flagging candidate status... [OK]');
    await new Promise(r => setTimeout(r, 450));

    log('📊 PERFORMANCE TEST 4: Sub-second Scoring Engine Load Profiling...');
    log('Simulating 1,000 parallel resume scorecard revisions (Target: 1 Million/day, sub-second latency)...');
    log('Completed 1,000 reviews in 118ms. Thread throughput nominal. [OK]');
    await new Promise(r => setTimeout(r, 400));

    log('⚠️ COMPLIANCE INTEGRITY: Fraud Timeline Overlap Scrutiny Engine...');
    log('Checking academic calendar against claimed work hours of snort IDS simulations...');
    log('Asserted 1 active date-collision anomaly logged on profile. Never automatically rejecting student. [OK]');
    await new Promise(r => setTimeout(r, 400));

    log('✅ SPECIFICATION 13.0 WORKFORCE REVISION VERIFIED: Dynamic resume intelligence active and fully compliant.');
    setIsDiagnosticsRunning(false);
  };

  // Radar chart preparation for skills comparison
  const skillsChartData = activeProfile.skills.map(s => ({
    subject: s.subject,
    StudentValue: s.current,
    TargetValue: s.target,
    fullMark: 100
  }));

  // Scores chart data for bar visualization
  const scoresBarData = [
    { name: 'Structure', Score: activeProfile.scores.structure },
    { name: 'Professionalism', Score: activeProfile.scores.professionalism },
    { name: 'Completeness', Score: activeProfile.scores.completeness },
    { name: 'ATS Readiness', Score: activeProfile.scores.atsReadiness },
    { name: 'Keywords', Score: activeProfile.scores.keywordCoverage },
    { name: 'Projects', Score: activeProfile.scores.projectQuality },
    { name: 'Evidence', Score: activeProfile.scores.verifiedEvidence },
    { name: 'Consistency', Score: activeProfile.scores.consistency }
  ];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-resume-reviewer-root">
      {/* Absolute top glow decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase">
              SPECIFICATION 13.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Enterprise AI Resume Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-100 flex items-center gap-2 mt-2">
            <FileText className="w-5 h-5 text-violet-400 animate-pulse" />
            AI Resume Intelligence Engine
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Analyze, validate, and optimize candidates' resumes using verified project experience, ATS parsing checks, and employer expectancy metrics.
          </p>
        </div>

        {/* Global Student Selectors & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-neutral-500 font-mono">Active Candidate:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                triggerToast(`Candidate profile shifted successfully.`);
              }}
              className="bg-transparent text-xs text-neutral-200 font-semibold focus:outline-none cursor-pointer border-none"
            >
              {profiles.map(p => (
                <option key={p.studentId} value={p.studentId} className="bg-neutral-900 text-neutral-200">
                  {p.name} ({p.major})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetOptimizations}
            className="flex items-center gap-1 text-xs font-semibold bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-xl transition cursor-pointer"
            title="Reset active optimizations back to unverified draft values."
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {/* Main Stats Banner Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Overall Resume Score</span>
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-violet-400">{activeProfile.overallScore}</span>
            <span className="text-xs text-neutral-500">/ 100</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-500" 
              style={{ width: `${activeProfile.overallScore}%` }} 
            />
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">ATS Compatibility Index</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">{activeProfile.scores.atsReadiness}</span>
            <span className="text-xs text-neutral-500">/ 100</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-mono">
            ATS Structure: <span className="text-neutral-300 font-bold">{activeProfile.atsDetails.formatting}</span> ({activeProfile.atsDetails.bulletPointsCount} bullets)
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Project Quality Coverage</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-blue-400">{activeProfile.scores.projectQuality}</span>
            <span className="text-xs text-neutral-500">/ 100</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-mono">
            Evidence: <span className="text-neutral-300 font-bold">{activeProfile.scores.verifiedEvidence}% verified</span> against db
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Timeline / Fraud Flag Risk</span>
            <AlertTriangle className={`w-4 h-4 ${activeProfile.fraudReports.length > 0 ? 'text-amber-500 animate-bounce' : 'text-emerald-500'}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-mono font-bold ${activeProfile.fraudReports.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {activeProfile.fraudReports.length > 0 ? 'MODERATE' : 'CLEARED'}
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-mono">
            Inconsistencies Flagged: <span className="text-neutral-300 font-bold">{activeProfile.fraudReports.length} Active</span>
          </p>
        </div>
      </div>

      {/* Interactive Drag & Drop / Upload Simulation Tool */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200">Simulate Document Parsing Interface</h4>
              <p className="text-[10px] text-neutral-500">Upload new draft payload of candidate to test real-time intelligence algorithms.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={isParsingInProgress}
              onClick={() => simulateFileUpload('PDF')}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 cursor-pointer"
            >
              Parse PDF
            </button>
            <button
              disabled={isParsingInProgress}
              onClick={() => simulateFileUpload('DOCX')}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 cursor-pointer"
            >
              Parse DOCX
            </button>
            <button
              disabled={isParsingInProgress}
              onClick={() => simulateFileUpload('Markdown')}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 cursor-pointer"
            >
              Parse Markdown
            </button>
          </div>
        </div>

        {/* Console outputs during simulation */}
        <AnimatePresence>
          {uploadedFileName && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-400 bg-neutral-950 p-3 rounded-xl overflow-y-auto max-h-36 space-y-1"
            >
              <div className="text-violet-400 font-bold flex items-center gap-1.5 mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>PARSE ENGINE CONSOLE: {uploadedFileName}</span>
                {isParsingInProgress && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              </div>
              {parseConsoleLogs.map((log, i) => (
                <div key={i} className={i === parseConsoleLogs.length - 1 ? 'text-emerald-400 font-semibold' : ''}>
                  {log}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab bar for sub-components */}
      <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl mb-6 overflow-x-auto border border-neutral-800">
        {[
          { id: 'parser_audit', label: 'Structure & Summary', icon: FileText },
          { id: 'validation', label: 'Project Verification', icon: ShieldCheck },
          { id: 'skills_keywords', label: 'Skills & Keywords', icon: Target },
          { id: 'employer_roadmap', label: 'Alignment & Roadmap', icon: Sliders },
          { id: 'version_fraud', label: 'Versions & Risks', icon: Clock },
          { id: 'dashboards', label: 'Ecosystem Dashboards', icon: Users },
          { id: 'api_specs', label: 'Database & API Specs', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive ? 'bg-neutral-800 text-violet-400 border border-neutral-700/60 shadow-lg' : 'text-neutral-400 hover:text-white'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[450px]">
        {/* TAB 1: PARSER & STRUCTURAL AUDIT */}
        {activeSubTab === 'parser_audit' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Header / Meta Segment */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Header & Structured Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500">Contact Email:</span>
                    <p className="font-semibold text-neutral-300 mt-0.5">{activeProfile.contactInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Phone Number:</span>
                    <p className="font-semibold text-neutral-300 mt-0.5">{activeProfile.contactInfo.phone}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">University Affiliation:</span>
                    <p className="font-semibold text-neutral-300 mt-0.5">{activeProfile.university}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Graduate Target & Major:</span>
                    <p className="font-semibold text-neutral-300 mt-0.5">{activeProfile.major} ({activeProfile.graduationDate})</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Connected Repositories:</span>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 border border-neutral-700">{activeProfile.contactInfo.github}</span>
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 border border-neutral-700">{activeProfile.contactInfo.portfolio}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-500">Parsing Completeness Indicator:</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400 font-bold">{activeProfile.contactInfo.completionStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Optimizer Panel */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 relative">
                <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    AI Professional Summary Evaluator
                  </span>
                  <span className="text-[10px] text-violet-400 font-mono bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase">
                    Refinement Active
                  </span>
                </h3>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-4">
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block mb-1">Current Resume Summary:</span>
                  <p className="text-xs text-neutral-300 leading-relaxed italic">
                    "{activeProfile.summary.text}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Length Metric</span>
                    <span className="text-xs font-mono font-bold text-neutral-300">{activeProfile.summary.lengthWords} words</span>
                  </div>
                  <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Clarity Rating</span>
                    <span className="text-xs font-mono font-bold text-violet-400">{activeProfile.summary.clarity}</span>
                  </div>
                  <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Professional Tone</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{activeProfile.summary.professionalism}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-neutral-400 block">Summary Intelligence Audit Suggestions:</span>
                  {activeProfile.summary.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-2 text-xs bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-neutral-300 leading-relaxed">
                      <div className="p-1 text-violet-400 shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Structure Check */}
            <div className="space-y-6">
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-4">Resume Structure Audit Report</h3>
                <div className="space-y-3">
                  {[
                    { section: 'Header & Contact Information', status: 'Complete', score: 98 },
                    { section: 'Professional Summary Alignment', status: 'Needs Improvement', score: 65 },
                    { section: 'Education & Registrar Sync', status: 'Verified', score: 100 },
                    { section: 'Project Experience Node Check', status: 'Partially Verified', score: 82 },
                    { section: 'Skills Inventory Allocation', status: 'Verified', score: 90 },
                    { section: 'Certificates & External Validation', status: 'Missing Records', score: 40 }
                  ].map((sec, index) => (
                    <div key={index} className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-neutral-300">{sec.section}</span>
                        <span className={`text-[10px] font-mono font-bold uppercase ${sec.status === 'Verified' || sec.status === 'Complete' ? 'text-emerald-400' : 'text-amber-500'}`}>
                          {sec.status}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${sec.score >= 90 ? 'bg-emerald-500' : sec.score >= 60 ? 'bg-violet-500' : 'bg-rose-500'}`} style={{ width: `${sec.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SRE Compliance Prompt Note */}
              <div className="bg-violet-500/5 border border-violet-500/10 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-violet-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Business Rules Compliance</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  "Never modify resumes without explicit user approval." Every refinement suggestion is stored in a draft state and requires verification logs to be generated on acceptance.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PROJECT EXPERIENCE VERIFICATION */}
        {activeSubTab === 'validation' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6 animate-fade-in"
          >
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                    Verified Experience & Fraud Detection Module
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Comparing self-claimed resume statements against our centralized database logs, GitHub metadata, and official performance review indexes.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  State: Active Validation
                </span>
              </div>

              {/* Dynamic Inconsistencies Banner */}
              {activeProfile.fraudReports.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-6 flex gap-3 text-xs">
                  <div className="p-1 bg-amber-500/10 rounded-xl border border-amber-500/25 text-amber-500 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-400">Chronological Overlap Detected! (Validation Engine Alert)</h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed mt-0.5">
                      The candidate claims standard working hours overlap with regular academic curriculum sessions. 
                      KONEXA policy limits: Never automatically reject users based on raw automated heuristics. Recommend adjusting dates manually.
                    </p>
                  </div>
                </div>
              )}

              {/* Projects List with action to Optimize */}
              <div className="space-y-6">
                {activeProfile.projects.map((proj, projIdx) => (
                  <div key={projIdx} className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800 relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-200">{proj.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border uppercase ${proj.verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                            {proj.verified ? 'Verified Evidence' : 'Self-Claimed Draft'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                          Role: <span className="text-neutral-200 font-bold">{proj.role}</span> | Period: {proj.duration}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-500">Employer Satisfaction: <span className="text-neutral-300 font-bold">{proj.employerSatisfaction}%</span></span>
                        <div className="w-16 bg-neutral-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${proj.employerSatisfaction}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block">Claimed Experience Accomplishments & Achievements:</span>
                          <div className="space-y-2">
                            {proj.achievements.map((ach, achIdx) => {
                              // Detect if achievement is optimized already by looking for metrics (numbers like 12k, 15%, 42%, 35%, 18 minutes, etc)
                              const isOptimized = /[0-9]+%|[0-9]+k|[0-9]+\s*(?:minutes|min)/.test(ach);
                              return (
                                <div key={achIdx} className="flex justify-between items-start gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                                  <div className="text-xs text-neutral-300 leading-relaxed flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                                    <span>{ach}</span>
                                  </div>
                                  {!isOptimized && (
                                    <button
                                      onClick={() => optimizeAchievement(projIdx, achIdx)}
                                      className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 px-2.5 py-1 rounded-md shrink-0 cursor-pointer flex items-center gap-1"
                                      title="Click to automatically inject verified workplace metrics from our matching database"
                                    >
                                      <Sparkles className="w-3 h-3 animate-pulse" />
                                      Optimize Bullet
                                    </button>
                                  )}
                                  {isOptimized && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0 select-none">
                                      <Check className="w-3 h-3" />
                                      Metric Injected
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Validation Cross-Check List */}
                        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3">
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block">Cross-Check Registry validation</span>
                          <div className="space-y-2 font-mono text-[10px]">
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Registrar Status:</span>
                              <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> MATCH</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Employer Feedback Sync:</span>
                              <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> SIGNED</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Trust Index Score Check:</span>
                              <span className="text-emerald-400 font-bold">LOCK 100%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-400">Duplicate Timeline Check:</span>
                              {proj.inconsistencies.length > 0 ? (
                                <span className="text-amber-500 font-bold">ANOMALY DETECTED</span>
                              ) : (
                                <span className="text-emerald-400 font-bold">CLEARED</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Inconsistencies logs */}
                        {proj.inconsistencies.map((inc, i) => (
                          <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/15 text-rose-400 rounded-xl text-[11px] leading-relaxed flex gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SKILLS GAP & KEYWORD OPTIMIZATION */}
        {activeSubTab === 'skills_keywords' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in"
          >
            {/* Skills Radar Representation */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300">Skills Consistency & Gap Matrix</h3>
              <p className="text-xs text-neutral-500">
                Visualizing student self-claimed skills vs verified project scores and target job benchmarks.
              </p>

              <div className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsChartData}>
                    <PolarGrid stroke="#262626" />
                    <PolarAngleAxis dataKey="subject" stroke="#737373" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#404040" fontSize={8} />
                    <Radar name="Active Candidate" dataKey="StudentValue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    <Radar name="Industry Standard" dataKey="TargetValue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', fontSize: '11px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Interactive Skills Grid */}
              <div className="grid grid-cols-2 gap-2">
                {activeProfile.skills.map((s, i) => (
                  <div key={i} className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-neutral-300 block">{s.subject}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Verified: {s.verifiedInProjects ? 'YES' : 'NO'}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${s.status === 'Match' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : s.status === 'Gap' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : s.status === 'Overstated' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Optimization & Keyword-Stuffing Alerts */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300 flex items-center justify-between">
                <span>Resume ATS Keyword Mapping</span>
                <span className="text-xs font-mono text-neutral-500">Preventing Keyword-Stuffing</span>
              </h3>
              <p className="text-xs text-neutral-500">
                To bypass legacy recruiters, candidates must align core technical vocabulary naturally rather than copy-pasting raw skill blobs.
              </p>

              {/* Keyword Score Slider Banner */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-400 font-semibold">Technical Keyword Density</span>
                  <span className="font-mono text-violet-400 font-bold">Safe (Optimal Range: 1.5% - 3.5%)</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full w-[68%]" />
                </div>
                <p className="text-[10px] text-neutral-500 font-mono mt-1.5">
                  Currently parsed: 12 high-priority phrases | 0% duplicate stuffing detected.
                </p>
              </div>

              {/* Keywords Tag Grid */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-neutral-400 block">Keyword Index Checklist:</span>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.keywords.map((kw, i) => (
                    <div 
                      key={i} 
                      className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${kw.status === 'Present' ? 'bg-neutral-950 border-emerald-500/20 text-emerald-400' : 'bg-neutral-950 border-rose-500/20 text-rose-400'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${kw.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{kw.word}</span>
                      <span className="text-[9px] text-neutral-500 font-mono bg-neutral-900 px-1 py-0.2 rounded border border-neutral-800">
                        {kw.status === 'Present' ? `${kw.density}%` : 'MISSING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language localized feedback */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
                <span className="text-xs font-semibold text-neutral-300 block">Localized Linguistic Clarity Metrics</span>
                {activeProfile.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono border-b border-neutral-900 pb-2 last:border-none">
                    <div>
                      <span className="font-bold text-neutral-200">{lang.language}</span>
                      <span className="text-[10px] text-neutral-500 block">Tone: {lang.tone}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-violet-400 font-bold">{lang.grammarScore}% Grammar</span>
                      <span className="text-[10px] text-neutral-400 block">{lang.localization}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: EMPLOYER ALIGNMENT & DYNAMIC ROADMAP */}
        {activeSubTab === 'employer_roadmap' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in"
          >
            {/* Company Selector */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300">Employer Alignment Tuner</h3>
              <p className="text-xs text-neutral-500">
                Pick a target company from the active employer ecosystem to dynamically measure how competitive this resume is.
              </p>

              <div className="space-y-2">
                {TARGET_COMPANIES_POOL.map((comp) => {
                  const isSelected = selectedTargetCompanyId === comp.companyId;
                  return (
                    <button
                      key={comp.companyId}
                      onClick={() => {
                        setSelectedTargetCompanyId(comp.companyId);
                        triggerToast(`Recalibrating alignment metrics for ${comp.name}...`);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex flex-col gap-1 cursor-pointer ${isSelected ? 'bg-violet-500/10 border-violet-500/30 text-neutral-200' : 'bg-neutral-950 border-neutral-800 hover:bg-neutral-900 text-neutral-400'}`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold">{comp.name}</span>
                        {isSelected && <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-mono uppercase">ACTIVE</span>}
                      </div>
                      <span className="text-[11px] text-neutral-400">{comp.position}</span>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {comp.requiredSkills.slice(0, 2).map((sk, j) => (
                          <span key={j} className="bg-neutral-900 text-neutral-500 text-[8px] font-mono px-1 rounded">{sk}</span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected alignment KPI gauge */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-500 font-mono uppercase">DYNAMIC MATCHING ALIGNMENT</span>
                <h4 className="text-4xl font-mono font-bold text-emerald-400 mt-1">{dynamicAlignmentScore}%</h4>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Required Skills Coverage: <span className="text-neutral-300 font-bold">{Math.round(dynamicAlignmentScore / 10) * 10}%</span>
                </p>
              </div>
            </div>

            {/* Dynamic Interactive Roadmap */}
            <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300">Actionable Improvement Roadmap</h3>
                  <p className="text-xs text-neutral-500">Prioritized checklist for candidate to reach 95%+ resume score before export.</p>
                </div>
                
                {/* Add Custom Advisor Task trigger */}
                <form onSubmit={handleAddRoadmapTask} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    required
                    placeholder="Type custom advisor tip..."
                    value={newRoadmapTaskText}
                    onChange={(e) => setNewRoadmapTaskText(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg text-xs px-2.5 py-1 text-neutral-300 focus:outline-none focus:border-violet-500 placeholder:text-neutral-600"
                  />
                  <select
                    value={newRoadmapImpact}
                    onChange={(e) => setNewRoadmapImpact(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg text-xs px-2 py-1 text-neutral-300"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-violet-700 transition cursor-pointer"
                  >
                    Add Advice
                  </button>
                </form>
              </div>

              {/* Roadmap list */}
              <div className="space-y-3">
                {activeProfile.roadmap.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  return (
                    <div 
                      key={task.id} 
                      onClick={() => toggleRoadmapTask(task.id)}
                      className={`p-3.5 rounded-xl border text-xs flex justify-between items-center gap-4 transition-all cursor-pointer ${isCompleted ? 'bg-neutral-950 border-neutral-800/40 opacity-50 text-neutral-500' : 'bg-neutral-950 border-neutral-800 hover:border-violet-500/40'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-neutral-700 hover:border-violet-400'}`}>
                          {isCompleted && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className={`font-semibold ${isCompleted ? 'line-through' : 'text-neutral-200'}`}>{task.task}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-neutral-500">
                            <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${task.category === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' : 'bg-violet-500/10 text-violet-400 border border-violet-500/10'}`}>{task.category} Fix</span>
                            <span>Timeline: {task.timeline}</span>
                            <span>Impact: <span className="text-neutral-400 font-bold">{task.impact}</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                          {task.expectedImprovement}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: VERSION HISTORY & FRAUD CHECK */}
        {activeSubTab === 'version_fraud' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in"
          >
            {/* Version Comparison Logs */}
            <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300">Durable Version Trace Index</h3>
              <p className="text-xs text-neutral-500">
                Audited version timeline of active candidate draft iterations. Resume scores are tracked historical snapshots.
              </p>

              <div className="space-y-4 relative border-l border-neutral-800 pl-4 ml-2">
                {activeProfile.versions.map((ver, idx) => (
                  <div key={ver.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-violet-500" />
                    <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-200">Revision Version #{ver.id}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{ver.date}</span>
                        </div>
                        <span className="font-mono font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                          {ver.score} Score
                        </span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed text-[11px] italic">"{ver.description}"</p>
                      
                      {ver.addedSkills.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-neutral-500">Skills Added:</span>
                          {ver.addedSkills.map((sk, i) => (
                            <span key={i} className="bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[9px] px-1.5 py-0.2 rounded">{sk}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud Risk Assessment Engine */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300">Inconsistencies & Fraud Alert Monitor</h3>
              <p className="text-xs text-neutral-500">
                AI validation modules search for date contradictions, impossible timelines, and overstated claims compared to direct registrar logs.
              </p>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center space-y-1">
                <span className="text-[10px] text-neutral-500 font-mono">INTEGRITY ALARM THRESHOLD</span>
                <h4 className={`text-xl font-mono font-bold ${activeProfile.fraudReports.length > 0 ? 'text-amber-500' : 'text-emerald-400'}`}>
                  {activeProfile.fraudReports.length > 0 ? 'Verification Warnings Active' : 'Optimal Compliance Verified'}
                </h4>
              </div>

              <div className="space-y-3">
                {activeProfile.fraudReports.length === 0 ? (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center text-xs text-emerald-400">
                    No timeline overlaps, certificate mismatches, or impossible achievements found on this profile. Excellent consistency score!
                  </div>
                ) : (
                  activeProfile.fraudReports.map((item) => (
                    <div key={item.id} className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-500 font-mono text-[10px]">{item.type}</span>
                        <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono text-[8px] uppercase">{item.severity} severity</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed text-[11px]">{item.description}</p>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-900">
                        <span>Incident: {item.id}</span>
                        <span className="text-amber-500">{item.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: STUDENT VS EMPLOYER ECOSYSTEM DASHBOARDS */}
        {activeSubTab === 'dashboards' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6 animate-fade-in"
          >
            {/* Split dashboard workspace selector */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300">KONEXA Dynamic Client-Facing Portals</h3>
                  <p className="text-xs text-neutral-500">Toggle between the Student's Self-Evaluation Dashboard and the Employer's Recruiter Verification profile.</p>
                </div>

                <div className="flex items-center gap-2 bg-neutral-950 px-4 py-2 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-neutral-400">Student Permission Granted for Employer view:</span>
                  <input
                    type="checkbox"
                    checked={studentPermissionForEmployer}
                    onChange={(e) => {
                      setStudentPermissionForEmployer(e.target.checked);
                      triggerToast(e.target.checked ? 'Employer access authorized!' : 'Employer view locked by candidate.');
                    }}
                    className="w-4 h-4 text-violet-600 focus:ring-violet-500 border-neutral-700 bg-neutral-900 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Panel A: Student-Facing Core Dashboard */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-3">
                    <User className="w-4 h-4 text-violet-400" />
                    <h4 className="text-xs font-bold uppercase text-neutral-200">Candidate Student Dashboard View</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Visual bar chart of candidate indices */}
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoresBarData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                          <XAxis dataKey="name" stroke="#525252" fontSize={8} />
                          <YAxis stroke="#525252" fontSize={8} domain={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', fontSize: '10px' }} />
                          <Bar dataKey="Score" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                            {scoresBarData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#6366f1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                      <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-center">
                        <span className="text-neutral-500 block mb-1">ATS READINESS</span>
                        <span className="font-bold text-emerald-400">{activeProfile.scores.atsReadiness}%</span>
                      </div>
                      <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-center">
                        <span className="text-neutral-500 block mb-1">KEYWORD INDEX</span>
                        <span className="font-bold text-violet-400">{activeProfile.scores.keywordCoverage}%</span>
                      </div>
                      <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-center">
                        <span className="text-neutral-500 block mb-1">ALIGNMENT RATING</span>
                        <span className="font-bold text-indigo-400">{dynamicAlignmentScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel B: Employer-Facing Recruiter Profile */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4 relative">
                  <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-3">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase text-neutral-200">Employer Verified Recruitment View</h4>
                  </div>

                  {!studentPermissionForEmployer ? (
                    <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm rounded-2xl flex flex-col justify-center items-center p-6 text-center space-y-2 z-10">
                      <Lock className="w-8 h-8 text-rose-500 animate-bounce" />
                      <h5 className="text-xs font-bold text-neutral-200">RECRUITER LOCK IN PLACE</h5>
                      <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xs">
                        This verified student profile requires active candidate approval permission to display experience indices on public recruiter dashboards.
                      </p>
                    </div>
                  ) : null}

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-neutral-500 font-mono text-[9px] uppercase">VERIFIED TALENT STRENGTHS</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-semibold">Verified Capstone Leader</span>
                        <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-1 rounded font-semibold">Double Project Validation Sync</span>
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-1 rounded font-semibold">100% Code Quality Compliant</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-neutral-500 font-mono text-[9px] uppercase block">VERIFIED ACCOMPLISHMENTS TRACE</span>
                      {activeProfile.projects.map((proj, idx) => (
                        <div key={idx} className="bg-neutral-900 p-3 rounded-xl border border-neutral-800/80 font-mono text-[10px] space-y-1">
                          <div className="flex justify-between items-center font-bold text-neutral-300">
                            <span>{proj.name}</span>
                            <span className="text-emerald-400">SATISFACTION: {proj.employerSatisfaction}%</span>
                          </div>
                          <p className="text-neutral-400 font-sans text-xs pt-1">
                            "{proj.achievements[0]}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-neutral-500 font-mono text-[9px] uppercase block">CONCURRENT CROSS-AGENT COLLABORATION HIGHLIGHTS</span>
                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        <strong className="text-violet-400">AI Recruiter Signal:</strong> "{activeProfile.collaborationSignals.recruiter}"
                      </p>
                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        <strong className="text-emerald-400">AI Growth Coach Advice:</strong> "{activeProfile.collaborationSignals.growthCoach}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: BLUEPRINT, Live API, AND SRE DIAGNOSTICS */}
        {activeSubTab === 'api_specs' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6 animate-fade-in"
          >
            {/* Spec 13.0 Database blueprints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-violet-400" />
                  Specification 13.0 Database Schemas Blueprints
                </h3>
                <p className="text-xs text-neutral-500">
                  Durable relations utilized to preserve audited revisions, ATS metrics, chronological overlaps, and roadmaps.
                </p>

                <div className="space-y-3 font-mono text-[10px] bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 overflow-y-auto max-h-80">
                  <div>
                    <span className="text-violet-400 font-bold block">// ResumeProfiles Table</span>
                    <span className="text-neutral-400">studentId VARCHAR PK, major VARCHAR, level VARCHAR, overallScore INT, completionStatus VARCHAR;</span>
                  </div>
                  <div>
                    <span className="text-violet-400 font-bold block">// ResumeVersions Table</span>
                    <span className="text-neutral-400">versionId VARCHAR PK, studentId FK, score INT, description TEXT, changedSkills TEXT[], timestamp TIMESTAMP;</span>
                  </div>
                  <div>
                    <span className="text-violet-400 font-bold block">// ResumeScores Matrix</span>
                    <span className="text-neutral-400">recordId SERIAL PK, studentId FK, structure INT, professionalism INT, keywordCoverage INT, projectQuality INT;</span>
                  </div>
                  <div>
                    <span className="text-violet-400 font-bold block">// ATSAnalysis Engine Checklist</span>
                    <span className="text-neutral-400">checklistId SERIAL PK, studentId FK, formatting VARCHAR, readabilityScore INT, hasComplexTables BOOLEAN, bulletPoints INT;</span>
                  </div>
                  <div>
                    <span className="text-violet-400 font-bold block">// InconsistencyAndFraudAlerts Table</span>
                    <span className="text-neutral-400">alertId SERIAL PK, studentId FK, alertType VARCHAR, contradictionDetails TEXT, severity VARCHAR, status VARCHAR;</span>
                  </div>
                  <div>
                    <span className="text-violet-400 font-bold block">// ResumeImprovementPlans Table</span>
                    <span className="text-neutral-400">taskId SERIAL PK, studentId FK, taskContent TEXT, impactMetric VARCHAR, expectedBoost INT, status VARCHAR;</span>
                  </div>
                  <div>
                    <span className="text-violet-400 font-bold block">// DurableAudits (Trace Logs) - Never Delete!</span>
                    <span className="text-neutral-400">auditId UUID PK, studentName VARCHAR, type VARCHAR, referenceHash VARCHAR, prompt_v VARCHAR, model_v VARCHAR, confidence REAL, time TIMESTAMP;</span>
                  </div>
                </div>
              </div>

              {/* API Specifications */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-1.5">
                  <Terminal className="w-4.5 h-4.5 text-cyan-400" />
                  Specification 13.0 RESTful API Specifications
                </h3>
                <p className="text-xs text-neutral-500">
                  Microservices endpoint endpoints supporting asynchronous processing, real-time metrics generation, and alignment.
                </p>

                <div className="space-y-3 font-mono text-[10px] bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-emerald-400 font-bold">GET /api/v1/resume/analysis?studentId=STU-9401</span>
                    <p className="text-neutral-400 text-[9px] mt-1">Retrieves active formatted metadata structure, summary clarity reviews, and parsing completion benchmarks.</p>
                  </div>
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-violet-400 font-bold">POST /api/v1/resume/verify-project</span>
                    <p className="text-neutral-400 text-[9px] mt-1">Payload: {'{ studentId, projectIndex, bulletIndex }'}. Performs semantic comparisons vs registrar, injecting verified outcomes.</p>
                  </div>
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-amber-500 font-bold">GET /api/v1/resume/roadmap?studentId=STU-9401</span>
                    <p className="text-neutral-400 text-[9px] mt-1">Returns critical, recommended, and optional task priorities along with anticipated scoreboard impacts.</p>
                  </div>
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-rose-400 font-bold">GET /api/v1/resume/integrity-fraud?studentId=STU-9401</span>
                    <p className="text-neutral-400 text-[9px] mt-1">Audits overlapping timeline nodes and impossible achievements. Discovers anomalies without auto-rejections.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostics Playground Self-Tests Panel */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300">Spec 13.0 Automated Diagnostic Integration Runner</h3>
                  <p className="text-xs text-neutral-500">Run Unit, Integration, Performance, and Security write-lock test assertions in real-time.</p>
                </div>
                <button
                  onClick={runSelfTestDiagnostics}
                  disabled={isDiagnosticsRunning}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Activity className={`w-4 h-4 ${isDiagnosticsRunning ? 'animate-spin' : ''}`} />
                  Run Self-Test Suite
                </button>
              </div>

              {/* Streaming diagnostic logs container */}
              {diagnosticLogs.length > 0 && (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-[11px] text-neutral-300 space-y-1.5 max-h-56 overflow-y-auto">
                  {diagnosticLogs.map((log, index) => (
                    <div key={index} className={log.includes('[OK]') ? 'text-emerald-400' : log.includes('⚡') || log.includes('✅') ? 'text-violet-400 font-bold' : 'text-neutral-400'}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audited Revision Trail (Durable Logging) */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300 flex items-center justify-between">
                <span>Durable Audit & System Revision Tracing Trail</span>
                <span className="text-[10px] text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">NEVER DELETE</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Preserves record versions, analytical evidence links, prompt config metrics, and machine learning model details for continuous compliance tracking.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 font-mono text-[10px] uppercase">
                      <th className="py-2.5">Audit ID</th>
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Action Event</th>
                      <th className="py-2.5">Hash Reference</th>
                      <th className="py-2.5 text-center">Confidence</th>
                      <th className="py-2.5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono text-[11px] text-neutral-300">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-900/20">
                        <td className="py-2.5 text-violet-400">{log.id}</td>
                        <td className="py-2.5 text-neutral-200">{log.studentName}</td>
                        <td className="py-2.5 text-neutral-400">{log.eventType}</td>
                        <td className="py-2.5 text-neutral-500">{log.evidenceRef}</td>
                        <td className="py-2.5 text-center text-emerald-400">{log.confidence}%</td>
                        <td className="py-2.5 text-right text-neutral-500">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Embedded Actionable Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-violet-600 border border-violet-500 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
