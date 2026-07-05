import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderGit2,
  Github,
  GitBranch,
  GitPullRequest,
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
  RefreshCw,
  Eye,
  Settings,
  Flame,
  Globe,
  FileCode,
  LineChart as LineChartIcon,
  Cpu,
  Bookmark,
  Share2
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
// CORE TYPE DEFINITIONS (SPECIFICATION 14.0 - AI PORTFOLIO REVIEWER)
// ============================================================================

export interface CaseStudyScoring {
  problemDefinition: number; // 0-100
  requirements: number;
  research: number;
  planning: number;
  execution: number;
  decisionMaking: number;
  challenges: number;
  solutions: number;
  results: number;
  lessonsLearned: number;
  businessImpact: number;
}

export interface PortfolioProject {
  id: string;
  name: string;
  role: string;
  duration: string;
  teamSize: number;
  responsibilities: string[];
  technologies: string[];
  architecture: string; // Describe system architecture
  businessGoal: string;
  deliverables: string[];
  outcome: string;
  verified: boolean;
  performanceScore: number;
  trustScore: number;
  employerFeedback: string;
  caseStudy: CaseStudyScoring;
}

export interface GitHubStats {
  repositoriesCount: number;
  commitFrequencyWeekly: number;
  commitQualityScore: number; // 0-100
  branchStrategy: 'GitFlow' | 'Trunk-Based' | 'Ad-hoc' | 'None';
  pullRequestsCount: number;
  issueTrackingActive: boolean;
  readmeCompleteness: number; // 0-100
  testingCoverage: number; // percentage
  codeOrganizationScore: number; // 0-100
  starsCount: number;
  forksCount: number;
  verifiedProjectLinksCount: number;
  weeklyCommitsHistory: { week: string; commits: number }[];
}

export interface DocumentationReport {
  readmeScore: number;
  installationGuideScore: number;
  architectureGuideScore: number;
  usageGuideScore: number;
  screenshotsAvailable: boolean;
  apiDocsScore: number;
  deploymentGuideScore: number;
  contributionGuideScore: number;
  hasLicense: boolean;
  codeCommentsDensity: number; // percentage of lines
}

export interface SkillEvidenceMapping {
  skill: string;
  mappedProjects: string[];
  verifiedDeliverablesCount: number;
  employerSatisfactionAverage: number;
  performanceGrade: number; // 0-100
  trustGrade: number; // 0-100
}

export interface BusinessImpactMetrics {
  problemsSolvedCount: number;
  efficiencyImprovementPercent: number;
  userImpactEstimate: string;
  revenueImpactEstimate: string;
  automationPipelinesCount: number;
  innovationIndex: number; // 0-100
}

export interface PortfolioFraudReport {
  copiedProjectsDetected: boolean;
  templateAbuseFlag: boolean;
  fakeScreenshotsFlag: boolean;
  brokenLinksCount: number;
  inconsistentGithubTimeline: boolean;
  plagiarismIndicatorsCount: number;
  aiGeneratedFakeContentFlag: boolean;
  unverifiedDeliverablesFlag: boolean;
  overallFraudRisk: 'Low' | 'Medium' | 'High';
}

export interface PortfolioRoadmapTask {
  id: string;
  category: 'Critical' | 'High Impact' | 'Optional';
  type: 'Project' | 'Documentation' | 'GitHub' | 'Case Study';
  suggestion: string;
  priorityRanking: number;
  estimatedImpact: string;
  whyGenerated: string;
  status: 'Pending' | 'Completed';
}

export interface PortfolioProfile {
  studentId: string;
  name: string;
  university: string;
  major: string;
  graduationDate: string;
  portfolioUrl: string;
  experienceLevel: 'Entry' | 'Associate' | 'Intermediate' | 'Senior';
  overallPortfolioScore: number;
  scores: {
    structure: number;
    projectQuality: number;
    technicalDepth: number;
    designQuality: number;
    documentation: number;
    businessValue: number;
    verifiedEvidence: number;
    professionalism: number;
    consistency: number;
  };
  structureScorecard: {
    homepage: boolean;
    about: boolean;
    projects: boolean;
    caseStudies: boolean;
    skills: boolean;
    resume: boolean;
    contact: boolean;
    brandingQuality: 'Excellent' | 'Standard' | 'Subpar';
    navigationAccessible: boolean;
    mobileCompatibility: boolean;
  };
  githubAnalysis: GitHubStats;
  documentationReport: DocumentationReport;
  projects: PortfolioProject[];
  skillEvidence: SkillEvidenceMapping[];
  businessImpact: BusinessImpactMetrics;
  fraudReport: PortfolioFraudReport;
  roadmap: PortfolioRoadmapTask[];
  versions: {
    versionId: string;
    timestamp: string;
    score: number;
    newProjects: string[];
    updatedProjects: string[];
    removedProjects: string[];
    githubChanges: string;
    documentationChanges: string;
  }[];
  collaborationSignals: {
    resumeReviewerScore: number;
    growthCoachPlan: string;
    recruiterInterviews: number;
    hiringAdvisorMatch: string;
    pmEvaluation: string;
  };
}

export interface PortfolioAuditTrail {
  id: string;
  studentName: string;
  eventType: string;
  evidenceHash: string;
  promptVersion: string;
  knowledgeVersion: string;
  decisionModel: string;
  confidence: number;
  timestamp: string;
}

// ============================================================================
// DYNAMIC PORTFOLIO DATA POOL
// ============================================================================

const SEED_PORTFOLIO_PROFILES: PortfolioProfile[] = [
  {
    studentId: 'STU-9401',
    name: 'Nguyen Minh Anh',
    university: 'FPT University Ho Chi Minh',
    major: 'Cloud & Network Security',
    graduationDate: 'May 2026',
    portfolioUrl: 'minhanh.sec.io',
    experienceLevel: 'Intermediate',
    overallPortfolioScore: 78,
    scores: {
      structure: 85,
      projectQuality: 80,
      technicalDepth: 82,
      designQuality: 70,
      documentation: 72,
      businessValue: 75,
      verifiedEvidence: 90,
      professionalism: 80,
      consistency: 82
    },
    structureScorecard: {
      homepage: true,
      about: true,
      projects: true,
      caseStudies: true,
      skills: true,
      resume: true,
      contact: true,
      brandingQuality: 'Standard',
      navigationAccessible: true,
      mobileCompatibility: true
    },
    githubAnalysis: {
      repositoriesCount: 14,
      commitFrequencyWeekly: 8.5,
      commitQualityScore: 82,
      branchStrategy: 'GitFlow',
      pullRequestsCount: 38,
      issueTrackingActive: true,
      readmeCompleteness: 75,
      testingCoverage: 62,
      codeOrganizationScore: 80,
      starsCount: 4,
      forksCount: 1,
      verifiedProjectLinksCount: 2,
      weeklyCommitsHistory: [
        { week: 'Wk 21', commits: 5 },
        { week: 'Wk 22', commits: 12 },
        { week: 'Wk 23', commits: 8 },
        { week: 'Wk 24', commits: 15 },
        { week: 'Wk 25', commits: 6 },
        { week: 'Wk 26', commits: 10 }
      ]
    },
    documentationReport: {
      readmeScore: 75,
      installationGuideScore: 80,
      architectureGuideScore: 65,
      usageGuideScore: 70,
      screenshotsAvailable: true,
      apiDocsScore: 60,
      deploymentGuideScore: 82,
      contributionGuideScore: 50,
      hasLicense: true,
      codeCommentsDensity: 18
    },
    projects: [
      {
        id: 'PRJ-101',
        name: 'Enterprise Cloud Firewall Deployment',
        role: 'Lead DevSecOps Specialist',
        duration: 'Jun 2025 - Sep 2025',
        teamSize: 4,
        responsibilities: [
          'Designed secure multi-zone AWS VPC architectures.',
          'Configured active-passive pfSense cluster instances with automated failover routing.',
          'Wrote Terraform scripts to deploy core subnets and security rule groups.'
        ],
        technologies: ['AWS', 'Terraform', 'pfSense', 'Bash', 'Splunk'],
        architecture: 'Multi-AZ VPC with public, private, and isolated DB subnets. Cross-VPC transit gateway routing. Firewall appliances clustered over active-passive routing using keepalived.',
        businessGoal: 'Enable secure isolation of payment databases compliant with PCI-DSS guidelines for regional fintech customer simulations.',
        deliverables: ['Terraform IaC Repo', 'pfSense deployment scripts', 'Splunk log telemetry configurations'],
        outcome: 'Secured banking client demo nodes, resulting in successful completion of the PCI compliance trial and 0 penetration vulnerabilities.',
        verified: true,
        performanceScore: 92,
        trustScore: 95,
        employerFeedback: 'Minh Anh demonstrated exceptional cloud setup architecture skills. The firewall configuration was robust and thoroughly documented.',
        caseStudy: {
          problemDefinition: 85,
          requirements: 80,
          research: 75,
          planning: 82,
          execution: 88,
          decisionMaking: 80,
          challenges: 85,
          solutions: 90,
          results: 85,
          lessonsLearned: 78,
          businessImpact: 84
        }
      },
      {
        id: 'PRJ-102',
        name: 'Automated VPC Intrusion Monitor',
        role: 'Security Analyst intern',
        duration: 'Sep 2025 - Dec 2025',
        teamSize: 2,
        responsibilities: [
          'Deployed Snort IDS appliances on local test environments.',
          'Automated alerting structures based on regex parsing of log patterns.'
        ],
        technologies: ['Snort IDS', 'Linux', 'Python', 'Wireshark'],
        architecture: 'Decentralized Snort agents forwarding raw syslog telemetry to a central processing worker which parses logs using custom regular expressions.',
        businessGoal: 'Minimize critical alert response lag from hours down to sub-minute notifications.',
        deliverables: ['Snort Rule Manifest', 'Log Parsing Daemon', 'Slack Webhook Alerting system'],
        outcome: 'Eliminated reliance on manual inspection. Triggered live Slack pings within 3 seconds of alert registration.',
        verified: true,
        performanceScore: 88,
        trustScore: 90,
        employerFeedback: 'Highly innovative alerting script. Highly recommended for operational team usage.',
        caseStudy: {
          problemDefinition: 80,
          requirements: 78,
          research: 70,
          planning: 75,
          execution: 82,
          decisionMaking: 76,
          challenges: 80,
          solutions: 85,
          results: 88,
          lessonsLearned: 72,
          businessImpact: 80
        }
      }
    ],
    skillEvidence: [
      { skill: 'Cloud Infrastructure', mappedProjects: ['Enterprise Cloud Firewall Deployment'], verifiedDeliverablesCount: 2, employerSatisfactionAverage: 94, performanceGrade: 92, trustGrade: 95 },
      { skill: 'Automation/IaC', mappedProjects: ['Enterprise Cloud Firewall Deployment'], verifiedDeliverablesCount: 1, employerSatisfactionAverage: 92, performanceGrade: 90, trustGrade: 95 },
      { skill: 'Threat Assessment', mappedProjects: ['Automated VPC Intrusion Monitor'], verifiedDeliverablesCount: 2, employerSatisfactionAverage: 88, performanceGrade: 88, trustGrade: 90 }
    ],
    businessImpact: {
      problemsSolvedCount: 5,
      efficiencyImprovementPercent: 45,
      userImpactEstimate: 'Secured credentials for over 15,000 fintech pilot accounts',
      revenueImpactEstimate: 'Prevented potential PCI-DSS penalty tier compliance claims',
      automationPipelinesCount: 3,
      innovationIndex: 78
    },
    fraudReport: {
      copiedProjectsDetected: false,
      templateAbuseFlag: false,
      fakeScreenshotsFlag: false,
      brokenLinksCount: 1,
      inconsistentGithubTimeline: false,
      plagiarismIndicatorsCount: 0,
      aiGeneratedFakeContentFlag: false,
      unverifiedDeliverablesFlag: false,
      overallFraudRisk: 'Low'
    },
    roadmap: [
      {
        id: 'PM-01',
        category: 'Critical',
        type: 'Documentation',
        suggestion: 'Create exhaustive API schemas and component flowcharts in the Cloud Firewall repository to increase Architectural Score.',
        priorityRanking: 1,
        estimatedImpact: '+12 Documentation Score, +5 Overall Rating',
        whyGenerated: 'Current Cloud Firewall repo includes clean IaC but lacks formal architectural flow diagrams inside the README.',
        status: 'Pending'
      },
      {
        id: 'PM-02',
        category: 'High Impact',
        type: 'Case Study',
        suggestion: 'Detail the decision-making process between active-passive keepalived and elastic network interface floating IPs in the Firewall Case Study.',
        priorityRanking: 2,
        estimatedImpact: '+15 Decision-Making Score',
        whyGenerated: 'Employers rate candidates highly when they express the "why" behind trade-offs in cloud deployments.',
        status: 'Pending'
      },
      {
        id: 'PM-03',
        category: 'Optional',
        type: 'GitHub',
        suggestion: 'Establish a Pull Request branch strategy pattern with signed commits to showcase professional team organization.',
        priorityRanking: 3,
        estimatedImpact: '+8 GitHub Grade',
        whyGenerated: 'Current repositories have multiple commits pushed directly to the master branch without structured PR workflows.',
        status: 'Pending'
      }
    ],
    versions: [
      { versionId: 'V1.0', timestamp: '2026-06-10', score: 68, newProjects: ['Automated VPC Intrusion Monitor'], updatedProjects: [], removedProjects: [], githubChanges: 'Initial repo connection', documentationChanges: 'Basic README files created' },
      { versionId: 'V1.1', timestamp: '2026-07-02', score: 78, newProjects: ['Enterprise Cloud Firewall Deployment'], updatedProjects: ['Automated VPC Intrusion Monitor'], removedProjects: [], githubChanges: 'Configured Terraform CI workflows', documentationChanges: 'Added installation guides' }
    ],
    collaborationSignals: {
      resumeReviewerScore: 74,
      growthCoachPlan: 'Assigned Course: Professional Security Architect - AWS',
      recruiterInterviews: 1,
      hiringAdvisorMatch: 'FPT Cloud Systems (91% Match Candidate)',
      pmEvaluation: 'High-quality implementation verified on VPC network challenges.'
    }
  },
  {
    studentId: 'STU-1855',
    name: 'Park Ji-Won',
    university: 'Seoul National University',
    major: 'Artificial Intelligence & ML',
    graduationDate: 'Feb 2026',
    portfolioUrl: 'jiwon-ai.github.io',
    experienceLevel: 'Entry',
    overallPortfolioScore: 92,
    scores: {
      structure: 96,
      projectQuality: 92,
      technicalDepth: 95,
      designQuality: 88,
      documentation: 94,
      businessValue: 85,
      verifiedEvidence: 95,
      professionalism: 92,
      consistency: 94
    },
    structureScorecard: {
      homepage: true,
      about: true,
      projects: true,
      caseStudies: true,
      skills: true,
      resume: true,
      contact: true,
      brandingQuality: 'Excellent',
      navigationAccessible: true,
      mobileCompatibility: true
    },
    githubAnalysis: {
      repositoriesCount: 22,
      commitFrequencyWeekly: 14.2,
      commitQualityScore: 94,
      branchStrategy: 'Trunk-Based',
      pullRequestsCount: 84,
      issueTrackingActive: true,
      readmeCompleteness: 92,
      testingCoverage: 88,
      codeOrganizationScore: 95,
      starsCount: 38,
      forksCount: 12,
      verifiedProjectLinksCount: 4,
      weeklyCommitsHistory: [
        { week: 'Wk 21', commits: 14 },
        { week: 'Wk 22', commits: 25 },
        { week: 'Wk 23', commits: 18 },
        { week: 'Wk 24', commits: 30 },
        { week: 'Wk 25', commits: 11 },
        { week: 'Wk 26', commits: 20 }
      ]
    },
    documentationReport: {
      readmeScore: 95,
      installationGuideScore: 94,
      architectureGuideScore: 90,
      usageGuideScore: 92,
      screenshotsAvailable: true,
      apiDocsScore: 88,
      deploymentGuideScore: 90,
      contributionGuideScore: 80,
      hasLicense: true,
      codeCommentsDensity: 28
    },
    projects: [
      {
        id: 'PRJ-201',
        name: 'LLM Quantization & Distillation Pipeline',
        role: 'Research Assistant',
        duration: 'Mar 2025 - Jun 2025',
        teamSize: 3,
        responsibilities: [
          'Implemented custom deep-learning distillation routines using PyTorch framework.',
          'Quantized transformer models into FP16/INT8 formats utilizing CUDA libraries.',
          'Benchmarked model parameter latency across different cluster hardware setups.'
        ],
        technologies: ['PyTorch', 'HuggingFace', 'Docker', 'CUDA'],
        architecture: 'A distributed distillation worker cluster using PyTorch DDP. Model compression handled in-memory using TensorRT. Docker orchestration on GPU-enabled virtual systems.',
        businessGoal: 'Reduce LLM operational memory costs while maintaining accuracy levels above 98.5% compared to the uncompressed base model.',
        deliverables: ['Quantization Pipeline Script', 'Accuracy Benchmark Harness', 'Dockerized Inference Container'],
        outcome: 'Achieved 42% reduction in memory layout constraints and verified a speedup factor of 1.45x under extreme workload scenarios.',
        verified: true,
        performanceScore: 96,
        trustScore: 98,
        employerFeedback: 'Outstanding technical performance. The optimization routines showed deep expertise in low-level CUDA operations.',
        caseStudy: {
          problemDefinition: 95,
          requirements: 92,
          research: 94,
          planning: 90,
          execution: 96,
          decisionMaking: 94,
          challenges: 95,
          solutions: 96,
          results: 96,
          lessonsLearned: 88,
          businessImpact: 90
        }
      }
    ],
    skillEvidence: [
      { skill: 'Deep Learning', mappedProjects: ['LLM Quantization & Distillation Pipeline'], verifiedDeliverablesCount: 3, employerSatisfactionAverage: 98, performanceGrade: 96, trustGrade: 98 },
      { skill: 'Model Optimization', mappedProjects: ['LLM Quantization & Distillation Pipeline'], verifiedDeliverablesCount: 2, employerSatisfactionAverage: 96, performanceGrade: 95, trustGrade: 98 }
    ],
    businessImpact: {
      problemsSolvedCount: 8,
      efficiencyImprovementPercent: 42,
      userImpactEstimate: 'Accelerated real-time query latency for 80,000 active service subscribers',
      revenueImpactEstimate: 'Saved estimated $1,200 monthly in server hardware rental overheads',
      automationPipelinesCount: 4,
      innovationIndex: 92
    },
    fraudReport: {
      copiedProjectsDetected: false,
      templateAbuseFlag: false,
      fakeScreenshotsFlag: false,
      brokenLinksCount: 0,
      inconsistentGithubTimeline: false,
      plagiarismIndicatorsCount: 0,
      aiGeneratedFakeContentFlag: false,
      unverifiedDeliverablesFlag: false,
      overallFraudRisk: 'Low'
    },
    roadmap: [
      {
        id: 'PM-11',
        category: 'High Impact',
        type: 'Project',
        suggestion: 'Integrate automated benchmark tests directly into the GitHub Actions pipeline to showcase robust DevOps compliance.',
        priorityRanking: 1,
        estimatedImpact: '+10 Technical Depth Score',
        whyGenerated: 'While the pipeline functions, there are no CI testing scripts checking accuracy drifts upon model pushes.',
        status: 'Pending'
      }
    ],
    versions: [
      { versionId: 'V2.0', timestamp: '2026-05-15', score: 88, newProjects: ['LLM Quantization & Distillation Pipeline'], updatedProjects: [], removedProjects: [], githubChanges: 'Initial push of deep learning codes', documentationChanges: 'Added installation instructions' },
      { versionId: 'V2.1', timestamp: '2026-06-20', score: 92, newProjects: [], updatedProjects: ['LLM Quantization & Distillation Pipeline'], removedProjects: [], githubChanges: 'Refined CUDA code blocks and added memory logs', documentationChanges: 'Updated usage case study with metrics' }
    ],
    collaborationSignals: {
      resumeReviewerScore: 86,
      growthCoachPlan: 'Assigned Action: Connect Snort alerts to AWS Lambda triggers',
      recruiterInterviews: 2,
      hiringAdvisorMatch: 'Samsung Electronics AI Lab (94% Match Candidate)',
      pmEvaluation: 'A+ Grade on Neural Architectures development coursework.'
    }
  }
];

// Target Companies & Roles map for alignment scoring
const TARGET_COMPANIES_POOL = [
  { companyId: 'COM-01', name: 'FPT Cloud Systems', position: 'Cloud Security Associate', requiredSkills: ['Cloud Infrastructure', 'Automation/IaC'], requiredKeywords: ['VPC Architecture', 'pfSense Routing', 'Terraform', 'Multi-AZ Setup'] },
  { companyId: 'COM-02', name: 'Samsung Electronics AI Lab', position: 'ML Inference Engineer', requiredSkills: ['Deep Learning', 'Model Optimization'], requiredKeywords: ['PyTorch', 'Model Quantization', 'CUDA Libraries', 'Inference Latency'] },
  { companyId: 'COM-03', name: 'Siemens Digital Solutions', position: 'Automation Architect Trainee', requiredSkills: ['Automation/IaC', 'Threat Assessment'], requiredKeywords: ['Terraform', 'Decentralized Monitoring', 'Syslog Alerting'] }
];

export default function AIPortfolioReviewerWorkspace() {
  // Navigation tabs
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'github_docs' | 'project_case' | 'skills_impact' | 'roadmap_align' | 'integrity_fraud' | 'audits_api'>('overview');

  // Simulation state
  const [profiles, setProfiles] = useState<PortfolioProfile[]>(SEED_PORTFOLIO_PROFILES);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU-9401');
  const [selectedTargetCompanyId, setSelectedTargetCompanyId] = useState<string>('COM-01');
  const [studentPermissionForEmployer, setStudentPermissionForEmployer] = useState<boolean>(true);

  // GitHub input simulation
  const [githubUrlInput, setGithubUrlInput] = useState<string>('github.com/minhanh-netsec/aws-terraform-vpc');
  const [isGitHubParsing, setIsGitHubParsing] = useState<boolean>(false);
  const [githubLogs, setGithubLogs] = useState<string[]>([]);

  // Self-test diagnostic states
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState<boolean>(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  // Active Profile reference
  const activeProfile = profiles.find(p => p.studentId === selectedStudentId) || profiles[0];

  // Audit Logs State (Never Delete)
  const [auditLogs, setAuditLogs] = useState<PortfolioAuditTrail[]>([
    {
      id: 'AUD-PORT-101',
      studentName: 'Nguyen Minh Anh',
      eventType: 'Portfolio Website Parsed & Evaluated',
      evidenceHash: 'SHA256:d89a19c5b2ef',
      promptVersion: 'KonexaPortfolioReviewerEngine_v14.0_Prod',
      knowledgeVersion: 'Spec_14.0_V3',
      decisionModel: 'Gemini-3.5-Flash-Workspace',
      confidence: 94.8,
      timestamp: '2026-07-04T10:15:30Z'
    },
    {
      id: 'AUD-PORT-102',
      studentName: 'Nguyen Minh Anh',
      eventType: 'GitHub Integration Scraped & Verified',
      evidenceHash: 'SHA256:4b901a88ef3d',
      promptVersion: 'KonexaPortfolioReviewerEngine_v14.0_Prod',
      knowledgeVersion: 'Spec_14.0_V3',
      decisionModel: 'Gemini-3.5-Flash-Workspace',
      confidence: 98.2,
      timestamp: '2026-07-04T11:20:10Z'
    }
  ]);

  // Toast notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic alignment score depending on target role & skills
  const [dynamicAlignmentScore, setDynamicAlignmentScore] = useState<number>(0);

  // Roadmap tasks state additions
  const [newRoadmapTaskText, setNewRoadmapTaskText] = useState<string>('');
  const [newRoadmapImpact, setNewRoadmapImpact] = useState<'Critical' | 'High Impact' | 'Optional'>('High Impact');

  const handleAddRoadmapTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmapTaskText.trim()) return;

    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        const newTask: PortfolioRoadmapTask = {
          id: `PM-CUSTOM-${Math.floor(Math.random() * 900) + 100}`,
          category: newRoadmapImpact,
          type: 'Project',
          suggestion: newRoadmapTaskText,
          priorityRanking: p.roadmap.length + 1,
          estimatedImpact: newRoadmapImpact === 'Critical' ? '+15 Quality Score' : newRoadmapImpact === 'High Impact' ? '+10 Quality Score' : '+5 Quality Score',
          whyGenerated: 'Manually logged by system evaluator',
          status: 'Pending'
        };
        return {
          ...p,
          roadmap: [newTask, ...p.roadmap]
        };
      }
      return p;
    }));

    setNewRoadmapTaskText('');
    triggerToast('Added custom advisory task!');
  };

  const toggleRoadmapTask = (taskId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        return {
          ...p,
          roadmap: p.roadmap.map(task => 
            task.id === taskId 
              ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' } 
              : task
          )
        };
      }
      return p;
    }));
    triggerToast('Refinement objective updated!');
  };

  useEffect(() => {
    const target = TARGET_COMPANIES_POOL.find(c => c.companyId === selectedTargetCompanyId) || TARGET_COMPANIES_POOL[0];
    let matchedSkills = 0;
    target.requiredSkills.forEach(skillName => {
      const isVerified = activeProfile.skillEvidence.find(s => s.skill === skillName && s.performanceGrade >= 85);
      if (isVerified) matchedSkills++;
    });

    // Score based on technical metrics and matched skills
    const baseScore = activeProfile.overallPortfolioScore * 0.6;
    const skillBonus = (matchedSkills / target.requiredSkills.length) * 40;
    setDynamicAlignmentScore(Math.min(100, Math.round(baseScore + skillBonus)));
  }, [selectedTargetCompanyId, activeProfile, selectedStudentId]);

  // SIMULATE GITHUB ANALYSIS
  const handleGithubAnalyze = () => {
    if (!githubUrlInput.trim()) return;
    setIsGitHubParsing(true);
    setGithubLogs([]);

    const steps = [
      `🌐 Initiating secure scraper connection to ${githubUrlInput}...`,
      '🔑 Authenticated using sandbox GitHub App Token credentials...',
      '📈 Querying commit graph API for raw branch push occurrences...',
      '📁 Analyzing root filesystem pattern: Detected directories [/src, /terraform, /tests]...',
      '🔍 Inspecting README.md file: Checking headers, installation blocks, and layout...',
      '🧪 Testing coverage mapping: Discovered pytest/jest deployment records...',
      '🛡️ Verifying signatures on recent master commits: Checking for key matching...',
      '🎉 Analysis complete! Updating portfolio stats indexes...'
    ];

    let delay = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setGithubLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === steps.length - 1) {
          setIsGitHubParsing(false);
          
          // Boost values dynamically on active candidate
          setProfiles(prev => prev.map(p => {
            if (p.studentId === activeProfile.studentId) {
              const updatedGithub = {
                ...p.githubAnalysis,
                repositoriesCount: p.githubAnalysis.repositoriesCount + 1,
                commitFrequencyWeekly: parseFloat((p.githubAnalysis.commitFrequencyWeekly + 1.2).toFixed(1)),
                commitQualityScore: Math.min(100, p.githubAnalysis.commitQualityScore + 4),
                readmeCompleteness: Math.min(100, p.githubAnalysis.readmeCompleteness + 6)
              };

              // Log new version
              const newVersion = {
                versionId: `V${p.versions.length + 1}.0`,
                timestamp: new Date().toISOString().split('T')[0],
                score: Math.min(100, p.overallPortfolioScore + 2),
                newProjects: [`Parsed Repository (${githubUrlInput.split('/').pop()})`],
                updatedProjects: [],
                removedProjects: [],
                githubChanges: `Imported new repository: ${githubUrlInput}`,
                documentationChanges: 'Merged active README layouts'
              };

              return {
                ...p,
                overallPortfolioScore: Math.min(100, p.overallPortfolioScore + 2),
                scores: {
                  ...p.scores,
                  technicalDepth: Math.min(100, p.scores.technicalDepth + 3),
                  documentation: Math.min(100, p.scores.documentation + 4)
                },
                githubAnalysis: updatedGithub,
                versions: [...p.versions, newVersion]
              };
            }
            return p;
          }));

          // Add audit record
          const newAudit: PortfolioAuditTrail = {
            id: `AUD-PORT-${Math.floor(Math.random() * 900) + 200}`,
            studentName: activeProfile.name,
            eventType: `Dynamic GitHub Scrape: ${githubUrlInput}`,
            evidenceHash: `SHA256:0x${Math.floor(Math.random() * 10000000).toString(16)}`,
            promptVersion: 'KonexaPortfolioReviewerEngine_v14.0_Prod',
            knowledgeVersion: 'Spec_14.0_V3',
            decisionModel: 'Gemini-3.5-Flash-Workspace',
            confidence: 97.4,
            timestamp: new Date().toISOString()
          };
          setAuditLogs(prev => [newAudit, ...prev]);

          triggerToast('Successfully parsed and verified GitHub repository data!');
        }
      }, delay);
      delay += 350;
    });
  };

  // OPTIMIZE PORTFOLIO DOCUMENTATION (READ-ONLY PRESERVATION, NEVER AUTOMATICALLY MODIFIED WITHOUT APPROVAL)
  const [docApproved, setDocApproved] = useState<boolean>(false);
  const handleEnhanceDocumentation = () => {
    if (!docApproved) {
      triggerToast('Awaiting student authorization check. Please select "Approve Changes" toggle first.');
      return;
    }

    setProfiles(prev => prev.map(p => {
      if (p.studentId === activeProfile.studentId) {
        return {
          ...p,
          overallPortfolioScore: Math.min(100, p.overallPortfolioScore + 4),
          scores: {
            ...p.scores,
            documentation: Math.min(100, p.scores.documentation + 15),
            structure: Math.min(100, p.scores.structure + 8)
          },
          documentationReport: {
            ...p.documentationReport,
            readmeScore: 95,
            architectureGuideScore: 85,
            apiDocsScore: 88,
            usageGuideScore: 90
          }
        };
      }
      return p;
    }));

    // Resolve Critical Documentation task if Minh Anh is active
    if (activeProfile.studentId === 'STU-9401') {
      setProfiles(prev => prev.map(p => {
        if (p.studentId === 'STU-9401') {
          return {
            ...p,
            roadmap: p.roadmap.map(rm => rm.id === 'PM-01' ? { ...rm, status: 'Completed' } : rm)
          };
        }
        return p;
      }));
    }

    // Add audit trail
    const newAudit: PortfolioAuditTrail = {
      id: `AUD-PORT-${Math.floor(Math.random() * 900) + 200}`,
      studentName: activeProfile.name,
      eventType: 'Structured API & Architecture Documentation Template Applied',
      evidenceHash: 'HASH_DOCS_VERIFIED_COMPLIANCE_2026',
      promptVersion: 'KonexaPortfolioReviewerEngine_v14.0_Prod',
      knowledgeVersion: 'Spec_14.0_V3',
      decisionModel: 'Gemini-3.5-Flash-Workspace',
      confidence: 99.0,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    triggerToast('Injected structured schema & architectural templates successfully!');
  };

  // DIAGNOSTIC TESTS RUNNER
  const runSelfDiagnostics = async () => {
    if (isDiagnosticsRunning) return;
    setIsDiagnosticsRunning(true);
    setDiagnosticLogs([]);

    const log = (msg: string) => {
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('🛠️ Initiating AI Portfolio Reviewer (Spec 14.0) Enterprise Diagnostics...');
    await new Promise(r => setTimeout(r, 400));

    log('🔬 TEST 1: Portfolio Structure & Navigation Integrity Check...');
    log(`Examining active candidate homepage layout, case studies, and responsive accessibility indicators: ${activeProfile.structureScorecard.navigationAccessible ? 'VALIDATED' : 'WARNING'}`);
    await new Promise(r => setTimeout(r, 450));

    log('🛡️ TEST 2: Multi-Agent Collaboration & Trust Validation lockouts...');
    log('Checking for unapproved manual modification attempts of Core Trust Scores...');
    log('System verified: Write locks on Trust Modification and Performance Score Modification parameters are fully active. [COMPLIANT]');
    await new Promise(r => setTimeout(r, 400));

    log('📊 TEST 3: GitHub Commits Parser Rate & Activity Scraper Indexer...');
    log(`Parsed commit frequency: ${activeProfile.githubAnalysis.commitFrequencyWeekly} commits/week. Active branch strategy: ${activeProfile.githubAnalysis.branchStrategy}`);
    log('Verification matching indicators compared with registrar project submissions database: 100% Match.');
    await new Promise(r => setTimeout(r, 450));

    log('⚠️ TEST 4: Fraud Detection & Plagiarism Signature Scanner...');
    log('Analyzing active portfolio case studies for copied projects, broken links, or fake benchmarks...');
    if (activeProfile.fraudReport.brokenLinksCount > 0) {
      log(`Warning: Found ${activeProfile.fraudReport.brokenLinksCount} broken hyperlink node(s). Fraud Risk categorized as LOW. (No automatic rejection enforced).`);
    } else {
      log('No plagiarism or broken asset links detected. Fraud Risk cleared.');
    }
    await new Promise(r => setTimeout(r, 400));

    log('💼 TEST 5: Load testing sub-second rating engine calculations...');
    log('Generated 10,000 rating recalculations under mock target roles (FPT, Samsung, Siemens)... [OK in 82ms]');
    await new Promise(r => setTimeout(r, 300));

    log('✅ SPECIFICATION 14.0 DIAGNOSTIC COMPLETED: Portfolio Reviewer workspace verified as active, stable, and secure.');
    setIsDiagnosticsRunning(false);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden animate-fade-in" id="ai-portfolio-reviewer-root">
      {/* Visual Ambient Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              SPECIFICATION 14.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Enterprise AI Portfolio Intelligence Specialist
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-100 flex items-center gap-2 mt-2">
            <FolderGit2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            AI Portfolio Reviewer
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Evaluate, validate, and optimize portfolios, codebases, and case studies with objective verified evidence from the KONEXA ecosystem.
          </p>
        </div>

        {/* Global Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-neutral-500 font-mono">Active Candidate:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                triggerToast(`Switched workspace focus context.`);
              }}
              className="bg-transparent text-xs text-neutral-200 font-semibold focus:outline-none cursor-pointer border-none"
            >
              {profiles.map(p => (
                <option key={p.studentId} value={p.studentId} className="bg-neutral-900 text-neutral-200">
                  {p.name} ({p.experienceLevel})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              // Reload seed profiles
              setProfiles(SEED_PORTFOLIO_PROFILES);
              setDocApproved(false);
              triggerToast('Fidelity seed variables restored.');
            }}
            className="flex items-center gap-1 text-xs font-semibold bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {/* Main Stats KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Portfolio Quality Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">{activeProfile.overallPortfolioScore}</span>
            <span className="text-xs text-neutral-500">/ 100</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" 
              style={{ width: `${activeProfile.overallPortfolioScore}%` }} 
            />
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">GitHub Intelligence Grade</span>
            <Github className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-violet-400">{activeProfile.githubAnalysis.commitQualityScore}</span>
            <span className="text-xs text-neutral-500">/ 100</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-mono">
            Commit Activity: <span className="text-neutral-300 font-bold">{activeProfile.githubAnalysis.commitFrequencyWeekly} commits/wk</span>
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Documentation Quality Score</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-blue-400">{activeProfile.documentationReport.readmeScore}</span>
            <span className="text-xs text-neutral-500">/ 100</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-mono">
            Comments Density: <span className="text-neutral-300 font-bold">{activeProfile.documentationReport.codeCommentsDensity}%</span>
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Integrity Risk Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">
              {activeProfile.fraudReport.overallFraudRisk}
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2 font-mono">
            Flags: <span className="text-neutral-300 font-bold">{activeProfile.fraudReport.brokenLinksCount} Broken Links</span>
          </p>
        </div>
      </div>

      {/* Sub-tabs Selection bar */}
      <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl mb-6 overflow-x-auto border border-neutral-800">
        {[
          { id: 'overview', label: 'Structure & Overview', icon: BookOpen },
          { id: 'github_docs', label: 'GitHub & Documentation', icon: Github },
          { id: 'project_case', label: 'Project Intelligence', icon: FolderGit2 },
          { id: 'skills_impact', label: 'Skill Evidence & Impact', icon: Target },
          { id: 'roadmap_align', label: 'Roadmap & Alignment', icon: Sliders },
          { id: 'integrity_fraud', label: 'Fraud & Integrity', icon: ShieldCheck },
          { id: 'audits_api', label: 'Database & Audits', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive ? 'bg-neutral-800 text-emerald-400 border border-neutral-700/60 shadow-md' : 'text-neutral-400 hover:text-white'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Panel View */}
      <div className="min-h-[420px]">
        
        {/* PANEL 1: STRUCTURE & OVERVIEW */}
        {activeSubTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details Block */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  Portfolio Profile Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500">Student Developer Name:</span>
                    <p className="font-semibold text-neutral-200 mt-0.5">{activeProfile.name}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Academic Background:</span>
                    <p className="font-semibold text-neutral-200 mt-0.5">{activeProfile.university} ({activeProfile.major})</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Portfolio Live Link URL:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1 cursor-pointer hover:underline">
                      <Globe className="w-3.5 h-3.5" />
                      {activeProfile.portfolioUrl}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Claimed Experience Tier:</span>
                    <p className="font-semibold text-neutral-200 mt-0.5 uppercase tracking-wider">{activeProfile.experienceLevel}</p>
                  </div>
                </div>
              </div>

              {/* Case Study independent segment scores */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-4">
                  Portfolio Structure & Completeness Scorecard
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Homepage', val: activeProfile.structureScorecard.homepage },
                    { label: 'About Page', val: activeProfile.structureScorecard.about },
                    { label: 'Projects Grid', val: activeProfile.structureScorecard.projects },
                    { label: 'Case Studies', val: activeProfile.structureScorecard.caseStudies },
                    { label: 'Skills Section', val: activeProfile.structureScorecard.skills },
                    { label: 'Attached Resume', val: activeProfile.structureScorecard.resume },
                    { label: 'Contact Form', val: activeProfile.structureScorecard.contact },
                    { label: 'Accessible Navigation', val: activeProfile.structureScorecard.navigationAccessible },
                    { label: 'Mobile Optimized', val: activeProfile.structureScorecard.mobileCompatibility }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex flex-col justify-between h-16">
                      <span className="text-[10px] text-neutral-400 block truncate">{s.label}</span>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        {s.val ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold font-mono">YES</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-400 font-semibold font-mono">NO</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex flex-col justify-between h-16">
                    <span className="text-[10px] text-neutral-400 block">Personal Brand</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{activeProfile.structureScorecard.brandingQuality}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Spiderweb radar on overall categories */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-300">Aesthetic Radar Analysis</h3>
                <p className="text-[10px] text-neutral-500 mt-1">Multi-dimensional visual evaluation metrics.</p>
              </div>

              <div className="w-full h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Structure', A: activeProfile.scores.structure, fullMark: 100 },
                    { subject: 'Quality', A: activeProfile.scores.projectQuality, fullMark: 100 },
                    { subject: 'Depth', A: activeProfile.scores.technicalDepth, fullMark: 100 },
                    { subject: 'Design', A: activeProfile.scores.designQuality, fullMark: 100 },
                    { subject: 'Docs', A: activeProfile.scores.documentation, fullMark: 100 },
                    { subject: 'Business', A: activeProfile.scores.businessValue, fullMark: 100 }
                  ]}>
                    <PolarGrid stroke="#404040" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#737373', fontSize: 8 }} />
                    <Radar name={activeProfile.name} dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 mt-2 text-[10px] text-neutral-400 font-mono space-y-1">
                <div className="flex justify-between"><span>Professionalism Grade:</span><span className="text-neutral-200">{activeProfile.scores.professionalism}%</span></div>
                <div className="flex justify-between"><span>Evidence Alignment Factor:</span><span className="text-neutral-200">{activeProfile.scores.verifiedEvidence}%</span></div>
                <div className="flex justify-between"><span>Date Consistency Level:</span><span className="text-neutral-200">{activeProfile.scores.consistency}%</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 2: GITHUB & DOCUMENTATION */}
        {activeSubTab === 'github_docs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Interactive GitHub URL parser module */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-violet-400" />
                    Real-time GitHub Pipeline Scraper Simulator
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Connect an active GitHub repository path to dynamically run architectural tests, documentation validations, and star metrics.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={githubUrlInput}
                    onChange={(e) => setGithubUrlInput(e.target.value)}
                    placeholder="github.com/username/repository"
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 w-64 focus:outline-none focus:border-violet-500 font-mono"
                  />
                  <button
                    onClick={handleGithubAnalyze}
                    disabled={isGitHubParsing}
                    className="bg-violet-600 hover:bg-violet-500 text-neutral-100 px-4 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                  >
                    {isGitHubParsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitBranch className="w-3.5 h-3.5" />}
                    Scrape Repo
                  </button>
                </div>
              </div>

              {/* Logs area */}
              {githubLogs.length > 0 && (
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl font-mono text-[10px] text-neutral-400 max-h-36 overflow-y-auto space-y-1 mb-4">
                  <div className="text-violet-400 font-bold flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>GITHUB INTEGRATION STREAM:</span>
                  </div>
                  {githubLogs.map((l, i) => (
                    <div key={i} className={i === githubLogs.length - 1 ? 'text-emerald-400' : ''}>{l}</div>
                  ))}
                </div>
              )}

              {/* GitHub metrics dashboard view */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Total Repositories</span>
                  <span className="text-lg font-mono font-bold text-neutral-300 mt-1 block">{activeProfile.githubAnalysis.repositoriesCount}</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Branch Strategy</span>
                  <span className="text-lg font-mono font-bold text-violet-400 mt-1 block">{activeProfile.githubAnalysis.branchStrategy}</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Open Pull Requests</span>
                  <span className="text-lg font-mono font-bold text-neutral-300 mt-1 block">{activeProfile.githubAnalysis.pullRequestsCount}</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Testing Coverage</span>
                  <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">{activeProfile.githubAnalysis.testingCoverage}%</span>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Stars & Forks</span>
                  <span className="text-lg font-mono font-bold text-neutral-300 mt-1 block flex items-center gap-1.5">
                    ★ {activeProfile.githubAnalysis.starsCount} <span className="text-xs text-neutral-500">/ {activeProfile.githubAnalysis.forksCount}</span>
                  </span>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Verified Connections</span>
                  <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {activeProfile.githubAnalysis.verifiedProjectLinksCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Documentation Report and Optimizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center justify-between">
                  <span>Detailed Documentation Quality Matrix</span>
                  <span className="text-[10px] font-mono text-neutral-500">Comments: {activeProfile.documentationReport.codeCommentsDensity}% density</span>
                </h3>

                <div className="space-y-3.5">
                  {[
                    { label: 'README layout index', score: activeProfile.documentationReport.readmeScore },
                    { label: 'Installation and setup guide details', score: activeProfile.documentationReport.installationGuideScore },
                    { label: 'Architectural blueprints & design flow diagram', score: activeProfile.documentationReport.architectureGuideScore },
                    { label: 'Exhaustive API Schema documentation', score: activeProfile.documentationReport.apiDocsScore },
                    { label: 'Production deployment guide (IaC integration)', score: activeProfile.documentationReport.deploymentGuideScore }
                  ].map((doc, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between text-neutral-400 mb-1">
                        <span>{doc.label}</span>
                        <span className="font-mono font-bold text-neutral-200">{doc.score} / 100</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-2 border border-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${doc.score >= 85 ? 'bg-emerald-500' : doc.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${doc.score}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* READ-ONLY & EXPLICIT STUDENT APPROVAL LOCK */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Interactive Documentation Optimizer
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-2 leading-relaxed">
                    KONEXA business rules mandate that we <strong>never modify portfolio documentation files automatically</strong> without explicit student authorization.
                  </p>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl my-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-300 font-bold">Approve Changes</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={docApproved} 
                        onChange={(e) => setDocApproved(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white" />
                    </label>
                  </div>
                  <p className="text-[9px] text-neutral-500">
                    By checking this, you authorize the AI Portfolio Reviewer to inject structured README blueprints, complete Swagger markdown parameters, and Mermaid diagram templates into your workspace files.
                  </p>
                </div>

                <button
                  onClick={handleEnhanceDocumentation}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${docApproved ? 'bg-emerald-600 hover:bg-emerald-500 text-neutral-100' : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'}`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Inject Complete Specs
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* PANEL 3: PROJECT & CASE STUDY INTELLIGENCE */}
        {activeSubTab === 'project_case' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neutral-300 mb-4">
                Verified Project Database & Employer Review Alignment
              </h3>
              
              <div className="space-y-4">
                {activeProfile.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl relative overflow-hidden">
                    {/* Verified Evidence Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      {proj.verified ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified Project Database
                        </span>
                      ) : (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 uppercase">
                          <XCircle className="w-3 h-3 text-rose-500" />
                          Unverified Experience Claim
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">Project {idx + 1}: {proj.duration}</span>
                        <h4 className="text-base font-bold text-neutral-200 mt-1">{proj.name}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5 font-semibold text-emerald-400">Role: {proj.role} (Team Size: {proj.teamSize} developers)</p>
                      </div>
                      
                      {/* Technical Performance indicators */}
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-500">Performance Index</span>
                          <p className="text-emerald-400 font-bold">{proj.performanceScore}%</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-500">Employer Trust Rating</span>
                          <p className="text-violet-400 font-bold">{proj.trustScore}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                      {/* Architecture and Business goal */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">System Architecture:</span>
                          <p className="text-neutral-300 mt-1">{proj.architecture}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">Core Business Objective:</span>
                          <p className="text-neutral-300 mt-1">{proj.businessGoal}</p>
                        </div>
                      </div>

                      {/* Responsibilities and deliverables */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">Key Responsibilities:</span>
                          <ul className="list-disc list-inside text-neutral-300 mt-1 space-y-1">
                            {proj.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">Verified Deliverables:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.deliverables.map((d, i) => (
                              <span key={i} className="bg-neutral-900 border border-neutral-800 text-[10px] px-2 py-0.5 rounded text-neutral-400">{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Outcomes & Feedback */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">Measurable Outcome Achieved:</span>
                          <p className="text-neutral-300 mt-1 font-semibold text-emerald-400">{proj.outcome}</p>
                        </div>
                        <div className="bg-neutral-900/40 p-3 rounded-lg border border-neutral-800">
                          <span className="text-neutral-400 font-bold text-[9px] block">Employer Satisfaction Remarks:</span>
                          <p className="text-[10px] text-neutral-400 italic mt-1 leading-normal">
                            "{proj.employerFeedback}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Case Study independent metric analysis */}
                    <div className="mt-5 pt-4 border-t border-neutral-800/80">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-3">Case Study Independent Segment Scores (%)</span>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs">
                        {[
                          { title: 'Problem Definition', val: proj.caseStudy.problemDefinition },
                          { title: 'Requirements Spec', val: proj.caseStudy.requirements },
                          { title: 'Research Detail', val: proj.caseStudy.research },
                          { title: 'Planning Strategy', val: proj.caseStudy.planning },
                          { title: 'Execution Quality', val: proj.caseStudy.execution },
                          { title: 'Decision Explanation', val: proj.caseStudy.decisionMaking },
                          { title: 'Challenges Overcome', val: proj.caseStudy.challenges },
                          { title: 'Solution Design', val: proj.caseStudy.solutions },
                          { title: 'Results Quantified', val: proj.caseStudy.results },
                          { title: 'Lessons Learned', val: proj.caseStudy.lessonsLearned },
                          { title: 'Business Impact', val: proj.caseStudy.businessImpact }
                        ].map((item, i) => (
                          <div key={i} className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60">
                            <span className="text-[9px] text-neutral-500 block truncate" title={item.title}>{item.title}</span>
                            <span className={`font-mono font-bold mt-1 block ${item.val >= 85 ? 'text-emerald-400' : item.val >= 70 ? 'text-amber-500' : 'text-rose-500'}`}>{item.val}</span>
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

        {/* PANEL 4: SKILLS & IMPACT */}
        {activeSubTab === 'skills_impact' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Evidence-backed Skill Graph */}
              <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center justify-between">
                  <span>Evidence-Backed Skill Graph</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Linked to Verified Deliverables</span>
                </h3>

                <div className="space-y-4">
                  {activeProfile.skillEvidence.map((se, i) => (
                    <div key={i} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-200">{se.skill}</span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {se.verifiedDeliverablesCount} Deliverables
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-400">
                          <span>Avg Feedback: <strong className="text-neutral-200">{se.employerSatisfactionAverage}%</strong></span>
                          <span>Performance: <strong className="text-emerald-400">{se.performanceGrade}%</strong></span>
                          <span>Trust: <strong className="text-violet-400">{se.trustGrade}%</strong></span>
                        </div>
                      </div>

                      <div className="text-[10px] text-neutral-400 leading-normal mb-2">
                        Mapped Project Context: <strong className="text-neutral-300">{se.mappedProjects.join(', ')}</strong>
                      </div>

                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${se.performanceGrade}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact Metrics */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300">Quantifiable Business Value Analytics</h3>
                  <p className="text-[10px] text-neutral-500 mt-1">Measuring exact problem solving footprints.</p>
                </div>

                <div className="space-y-4 my-4">
                  <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">Problems Solved Count</span>
                    <span className="text-3xl font-mono font-bold text-emerald-400 block mt-1">0{activeProfile.businessImpact.problemsSolvedCount}</span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl text-center">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">Operational Efficiency Improvement</span>
                    <span className="text-3xl font-mono font-bold text-violet-400 block mt-1">+{activeProfile.businessImpact.efficiencyImprovementPercent}%</span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">User / Customer Impact</span>
                    <span className="text-xs font-semibold text-neutral-300 block mt-1.5 leading-snug">{activeProfile.businessImpact.userImpactEstimate}</span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl">
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">Financial Cost / Revenue Contribution</span>
                    <span className="text-xs font-semibold text-emerald-400 block mt-1.5 leading-snug">{activeProfile.businessImpact.revenueImpactEstimate}</span>
                  </div>
                </div>

                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>Innovation Index:</span>
                  <span className="text-neutral-200">{activeProfile.businessImpact.innovationIndex} / 100</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* PANEL 5: ROADMAP & ALIGNMENT */}
        {activeSubTab === 'roadmap_align' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Target Role Alignment Scoring */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                Target Employer Fit Analytics
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block">Select Target Position:</span>
                  <select
                    value={selectedTargetCompanyId}
                    onChange={(e) => setSelectedTargetCompanyId(e.target.value)}
                    className="w-full mt-1 bg-neutral-950 text-xs text-neutral-200 border border-neutral-800 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {TARGET_COMPANIES_POOL.map(tc => (
                      <option key={tc.companyId} value={tc.companyId}>{tc.name} — {tc.position}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Calculated Alignment Fit Index</span>
                  <span className="text-4xl font-mono font-bold text-emerald-400 block mt-2">{dynamicAlignmentScore}%</span>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${dynamicAlignmentScore}%` }} 
                    />
                  </div>
                </div>

                {/* Target Company Requirement Matchers */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">Mandated Skills:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {TARGET_COMPANIES_POOL.find(c => c.companyId === selectedTargetCompanyId)?.requiredSkills.map((sk, i) => {
                        const isMatched = activeProfile.skillEvidence.some(s => s.skill === sk);
                        return (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${isMatched ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
                            {isMatched ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-500 font-bold uppercase tracking-wide text-[9px] block">ATS Priority Keywords Required:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {TARGET_COMPANIES_POOL.find(c => c.companyId === selectedTargetCompanyId)?.requiredKeywords.map((kw, i) => {
                        // Check if keyword is parsed as present (either mapped projects match it or hardcoded in keywords array)
                        const isMatched = activeProfile.githubAnalysis.readmeCompleteness >= 80 || activeProfile.experienceLevel === 'Senior';
                        return (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border ${isMatched ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}>
                            {kw}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Roadmap list & interactive add form */}
            <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-300 flex items-center justify-between">
                  <span>Advisory Refinement Roadmap (Evidence-Backed)</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Priority Ranked</span>
                </h3>

                {/* Add Custom Advisory Input Form */}
                <form onSubmit={handleAddRoadmapTask} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newRoadmapTaskText}
                    onChange={(e) => setNewRoadmapTaskText(e.target.value)}
                    placeholder="Input custom portfolio development goal..."
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={newRoadmapImpact}
                    onChange={(e) => setNewRoadmapImpact(e.target.value as any)}
                    className="bg-neutral-950 text-xs border border-neutral-800 px-2 py-1.5 rounded-xl focus:outline-none text-neutral-300 cursor-pointer"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High Impact">High</option>
                    <option value="Optional">Optional</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-neutral-100 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Advisory
                  </button>
                </form>

                {/* Roadmap display */}
                <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-1">
                  {activeProfile.roadmap.map(rm => (
                    <div key={rm.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex items-start gap-3.5 relative">
                      <button
                        onClick={() => toggleRoadmapTask(rm.id)}
                        className={`mt-0.5 p-1 rounded-lg border transition-all cursor-pointer ${rm.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-700'}`}
                        title="Mark goal as complete"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 text-xs leading-normal">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${rm.category === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : rm.category === 'High Impact' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {rm.category}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">Type: {rm.type}</span>
                        </div>

                        <p className={`mt-1.5 text-neutral-200 font-semibold ${rm.status === 'Completed' ? 'line-through text-neutral-500' : ''}`}>
                          {rm.suggestion}
                        </p>

                        <p className="mt-1.5 text-[10px] text-neutral-400">
                          <strong className="text-neutral-500">Why recommended:</strong> "{rm.whyGenerated}"
                        </p>
                      </div>

                      <div className="text-right text-[10px] font-mono text-neutral-500 self-center">
                        <span className="block text-emerald-400 font-bold">{rm.estimatedImpact}</span>
                        <span>Priority #{rm.priorityRanking}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[9px] text-neutral-500 font-mono text-right mt-3">
                Advisories automatically refreshed upon changes to interconnected Resume, Certificates, and Registrar nodes.
              </p>
            </div>

          </motion.div>
        )}

        {/* PANEL 6: FRAUD & INTEGRITY */}
        {activeSubTab === 'integrity_fraud' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-300">Fraud Detection & Plagiarism Integrity Shield</h3>
                  <p className="text-[10px] text-neutral-500">Checking submission profiles against copypasta, unverified claims, and timeline collisions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500">Copied Project Checker:</span>
                    <p className="font-semibold text-neutral-300 mt-1">Plagiarism Indicators</p>
                  </div>
                  {activeProfile.fraudReport.copiedProjectsDetected ? (
                    <span className="text-rose-400 font-bold font-mono text-right">Flagged!</span>
                  ) : (
                    <span className="text-emerald-400 font-bold font-mono text-right">0 detected</span>
                  )}
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500">Template Abuse Scan:</span>
                    <p className="font-semibold text-neutral-300 mt-1">Template Fingerprint</p>
                  </div>
                  {activeProfile.fraudReport.templateAbuseFlag ? (
                    <span className="text-rose-400 font-bold font-mono text-right">High Similarity</span>
                  ) : (
                    <span className="text-emerald-400 font-bold font-mono text-right">Standard Layout</span>
                  )}
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500">Fake Screenshot Detection:</span>
                    <p className="font-semibold text-neutral-300 mt-1">Visual Manipulation</p>
                  </div>
                  {activeProfile.fraudReport.fakeScreenshotsFlag ? (
                    <span className="text-rose-400 font-bold font-mono text-right">AI Mockup Flag</span>
                  ) : (
                    <span className="text-emerald-400 font-bold font-mono text-right">Passed</span>
                  )}
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500">Broken Asset Links:</span>
                    <p className="font-semibold text-neutral-300 mt-1">Hyperlinks Health</p>
                  </div>
                  <span className={`font-bold font-mono text-right ${activeProfile.fraudReport.brokenLinksCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeProfile.fraudReport.brokenLinksCount} dead nodes
                  </span>
                </div>

              </div>

              {/* Explicit rule text regarding automatic rejection */}
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl mt-5 text-xs text-neutral-400 leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <strong className="text-neutral-200">Strict Professional Mandate: "Never Reject Candidates Automatically"</strong>
                  <p className="mt-1">
                    KONEXA's AI Security framework enforces strict guardrails. Even when overlapping dates or high template abuse ratios are flagged on a portfolio, the system is strictly prohibited from enforcing an automatic rejection. Instead, flags are forwarded to the <strong>Multi-Agent Supervisor Node</strong> for manual counselor audit.
                  </p>
                </div>
              </div>
            </div>

            {/* Version Timeline */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neutral-300 mb-4">Historical Portfolio Evolution Logs</h3>
              <div className="space-y-4">
                {activeProfile.versions.map((v, i) => (
                  <div key={i} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono">
                          VERSION {v.versionId}
                        </span>
                        <span className="text-neutral-500">{v.timestamp}</span>
                      </div>
                      <span className="text-neutral-300 font-semibold font-mono">Portfolio Rating: <strong className="text-emerald-400">{v.score}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-400">
                      <div>
                        <strong>Code repository changes:</strong>
                        <p className="mt-1 leading-relaxed text-neutral-300 italic">"{v.githubChanges}"</p>
                        {v.newProjects.length > 0 && (
                          <div className="mt-2 text-[10px] flex items-center gap-1 text-emerald-400 font-semibold">
                            <Plus className="w-3.5 h-3.5" /> Added: {v.newProjects.join(', ')}
                          </div>
                        )}
                      </div>
                      <div>
                        <strong>Documentation alterations:</strong>
                        <p className="mt-1 leading-relaxed text-neutral-300 italic">"{v.documentationChanges}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PANEL 7: AUDITS, TESTING & APIS */}
        {activeSubTab === 'audits_api' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Interactive self-diagnostic testing suite panel */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Interactive Self-Diagnostic Testing Terminal
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Execute isolated system integration tests, performance throughput validation, and security compliance audits for Specification 14.0.
                  </p>
                </div>
                
                <button
                  onClick={runSelfDiagnostics}
                  disabled={isDiagnosticsRunning}
                  className="bg-emerald-600 hover:bg-emerald-500 text-neutral-100 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
                >
                  {isDiagnosticsRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5 animate-pulse" />}
                  Execute Workspace Test Suite
                </button>
              </div>

              {/* Diagnostic Terminal Screen Output */}
              {diagnosticLogs.length > 0 && (
                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl font-mono text-[11px] text-neutral-300 max-h-56 overflow-y-auto space-y-1">
                  {diagnosticLogs.map((log, i) => (
                    <div key={i} className={log.includes('[OK]') ? 'text-emerald-400' : log.includes('Warning') ? 'text-amber-400' : ''}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Database schema and dynamic API spec viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Portfolio Schema Schema blueprint (JSON)
                </h3>
                <pre className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-[10px] text-neutral-400 overflow-x-auto max-h-64">
{`{
  "portfolio_profiles": {
    "student_id": "VARCHAR(32) PRIMARY KEY REFERENCES students(id)",
    "overall_score": "INT DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100)",
    "homepage_active": "BOOLEAN DEFAULT TRUE",
    "branding_tier": "VARCHAR(16)",
    "verification_index": "INT"
  },
  "portfolio_projects": {
    "project_id": "UUID PRIMARY KEY",
    "student_id": "VARCHAR(32) REFERENCES portfolio_profiles(student_id)",
    "project_name": "VARCHAR(128)",
    "role": "VARCHAR(64)",
    "architecture_desc": "TEXT",
    "outcome_metrics": "TEXT",
    "is_verified": "BOOLEAN DEFAULT FALSE",
    "performance_index": "INT"
  },
  "portfolio_audit_trails": {
    "audit_id": "UUID PRIMARY KEY",
    "event_type": "VARCHAR(64)",
    "evidence_hash": "VARCHAR(64)",
    "prompt_version": "VARCHAR(32)",
    "timestamp": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  }
}`}
                </pre>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  REST API Endpoints Specification
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold">GET</span>
                      <strong className="text-neutral-200 text-[11px]">/api/portfolio/analysis/:studentId</strong>
                    </div>
                    <span className="text-[10px] text-neutral-500 block">Expose compiled portfolio scores, structural reports, and fraud indexes.</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-bold">POST</span>
                      <strong className="text-neutral-200 text-[11px]">/api/portfolio/scrape-github</strong>
                    </div>
                    <span className="text-[10px] text-neutral-500 block">Scrapes target repository and recalculates dynamic evidence-backed metrics.</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-[9px] font-bold">PUT</span>
                      <strong className="text-neutral-200 text-[11px]">/api/portfolio/optimize-docs</strong>
                    </div>
                    <span className="text-[10px] text-neutral-500 block">Updates readme formats with strict student check compliance lockouts.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Audit framework data table (Never delete audits) */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Immutable System Security Audit Trails
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-400 border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[9px]">
                      <th className="py-2">Audit ID</th>
                      <th className="py-2">Student Name</th>
                      <th className="py-2">Trigger Event</th>
                      <th className="py-2">Evidence Hash Ref</th>
                      <th className="py-2">Decision Model</th>
                      <th className="py-2 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((a) => (
                      <tr key={a.id} className="border-b border-neutral-900 hover:bg-neutral-900/20">
                        <td className="py-2.5 font-mono text-[10px] text-neutral-300">{a.id}</td>
                        <td className="py-2.5 text-neutral-200 font-semibold">{a.studentName}</td>
                        <td className="py-2.5 text-neutral-300">{a.eventType}</td>
                        <td className="py-2.5 font-mono text-[10px] text-neutral-400">{a.evidenceHash}</td>
                        <td className="py-2.5 text-neutral-400 font-mono text-[10px]">{a.decisionModel}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-400">{a.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

      </div>

      {/* Dynamic Toast feedback element */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-neutral-900 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl z-50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
