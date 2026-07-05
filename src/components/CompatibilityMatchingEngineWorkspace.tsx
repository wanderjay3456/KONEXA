import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Award,
  Briefcase,
  Users,
  Settings,
  ShieldAlert,
  ShieldCheck,
  History,
  BookOpen,
  Cpu,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle2,
  XCircle,
  Sliders,
  Scale,
  Code,
  Activity,
  ArrowRight,
  RefreshCw,
  Search,
  Check,
  Zap,
  Terminal,
  Database,
  Layers,
  Flame,
  FileText,
  Clock,
  UserCheck,
  Languages,
  FolderKanban,
  GitBranch,
  Smile,
  ZapOff,
  ClipboardList
} from 'lucide-react';

// Definitions for the Compatibility & Matching Score Engine
interface WeightConfig {
  id: string;
  name: string;
  weight: number; // percentage
  description: string;
}

interface StudentRecord {
  id: string;
  name: string;
  major: 'Computer Science' | 'Software Engineering' | 'Information Systems' | 'Business' | 'Mathematics';
  gpa: number;
  skills: string[];
  skillsExpertise: Record<string, 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>;
  skillsFreshnessDays: Record<string, number>; // days since last activity
  experienceYears: Record<string, number>;
  englishLevel: number; // 0-100
  completedProjects: number;
  projectSuccessRate: number; // 0-100
  historicalPerformanceAvg: number; // 0-100
  recentPerformanceAvg: number; // 0-100
  trustScore: number; // 0-100
  warningCount: number;
  missedDeadlines: number;
  withdrawals: number;
  weeklyHours: number;
  isOverloaded: boolean;
  remotePreference: 'Remote' | 'Hybrid' | 'Onsite';
  independentWorkScore: number; // 0-100
  teamCollaborationScore: number; // 0-100
  leadershipScore: number; // 0-100
  documentationScore: number; // 0-100
  timezoneOffset: number; // hours from UTC
  country: string;
  isProfileComplete: boolean;
  hasExpiredCertificate: boolean;
  hasVerifiedCertifications: boolean;
  hasOSContribution: boolean;
  hasResearchPublication: boolean;
  hasHackathonWinner: boolean;
}

interface CompanyRecord {
  id: string;
  name: string;
  industry: string;
  preferredSkills: string[];
  reputationScore: number; // 0-100
  hiringHistoryRate: number; // conversion percentage 0-100
  communicationStyle: 'Asynchronous' | 'Synchronous' | 'Hybrid';
  timezoneOffset: number;
  country: string;
}

interface ProjectRecord {
  id: string;
  title: string;
  companyId: string;
  requiredSkills: string[];
  preferredSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  leadershipRequired: boolean;
  remoteRequired: boolean;
  industryContext: string;
  englishRequiredLevel: number; // 0-100
  timezoneOffset: number;
}

interface MatchingResult {
  id: string;
  timestamp: string;
  studentId: string;
  projectId: string;
  companyId: string;
  matchingScore: number;
  baseScore: number;
  matchLevel: string;
  confidenceScore: number;
  riskScore: number;
  categoryScores: Record<string, number>;
  penaltiesApplied: { id: string; name: string; value: number }[];
  bonusesApplied: { id: string; name: string; value: number }[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  explanation: string;
  layersExecuted: string[];
  durationMs: number;
  version: string;
}

export default function CompatibilityMatchingEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'weights' | 'penalties' | 'logs' | 'docs'>('matrix');
  const [engineVersion, setEngineVersion] = useState<'v1' | 'v2' | 'v3'>('v1');

  // Selected Entities for interactive sandbox matching
  const [selectedStudentId, setSelectedStudentId] = useState('STU_01');
  const [selectedProjectId, setSelectedProjectId] = useState('PROJ_01');
  const [selectedCompanyId, setSelectedCompanyId] = useState('COMP_01');

  // --- 1. DYNAMIC SYSTEM CONFIGURATION ---
  // Store all 16 dimension weights (Must sum to 100%)
  const [dimensionWeights, setDimensionWeights] = useState<WeightConfig[]>([
    { id: 'academic', name: 'Academic Compatibility', weight: 8, description: 'Measures university type, major alignments, research experience, and coursework.' },
    { id: 'technical', name: 'Technical Compatibility', weight: 18, description: 'Calculates specific language alignment, framework expertise, and skill freshness.' },
    { id: 'project', name: 'Project Compatibility', weight: 12, description: 'Weights past completed similarity, duration suitability, and technology overlaps.' },
    { id: 'industry', name: 'Industry Compatibility', weight: 6, description: 'Compares developer preferences to corporate industry domains.' },
    { id: 'language', name: 'Language Compatibility', weight: 8, description: 'Compares student English levels to company specific language requisites.' },
    { id: 'experience', name: 'Experience Compatibility', weight: 8, description: 'Audits open-source work, internships, leadership, and remote experience.' },
    { id: 'performance', name: 'Performance Compatibility', weight: 10, description: 'A composite of historical averages, growth rate, and completion metrics.' },
    { id: 'trust', name: 'Trust Compatibility', weight: 8, description: 'Evaluates official warnings, verification checkmarks, and trust indicators.' },
    { id: 'availability', name: 'Availability Compatibility', weight: 5, description: 'Calculates calendar capacity, start timelines, and work overload risk.' },
    { id: 'workStyle', name: 'Work Style Compatibility', weight: 5, description: 'Aligns remote preferences, documentation diligence, and autonomy levels.' },
    { id: 'communication', name: 'Communication Compatibility', weight: 5, description: 'Compares typical response latency, team attendance, and style overlaps.' },
    { id: 'career', name: 'Career Compatibility', weight: 4, description: 'Checks company size matches, preferred country goals, and salary tiers.' },
    { id: 'location', name: 'Location Compatibility', weight: 2, description: 'Computes physical proximity, hybrid options, and visa readiness.' },
    { id: 'timezone', name: 'Timezone Compatibility', weight: 2, description: 'Direct overlap calculation of local working hours and meeting windows.' },
    { id: 'growth', name: 'Growth Potential', weight: 5, description: 'Measures learning velocity, adaptability indexes, and developmental progress.' },
    { id: 'longTerm', name: 'Long-term Hiring Potential', weight: 4, description: 'Predicts conversion probability from temporary contractor to full employee.' }
  ]);

  // Penalty Adjustments Configuration
  const [penaltyConfigs, setPenaltyConfigs] = useState([
    { id: 'profileIncomplete', name: 'Profile Incomplete Penalty', value: 15, enabled: true },
    { id: 'repeatedWithdrawal', name: 'Repeated Withdrawal Penalty', value: 20, enabled: true },
    { id: 'expiredLanguageCert', name: 'Expired Language Certificate Penalty', value: 10, enabled: true },
    { id: 'lowAvailability', name: 'Low Availability Penalty', value: 25, enabled: true },
    { id: 'repeatedMissedDeadlines', name: 'Repeated Missed Deadlines Penalty', value: 30, enabled: true },
    { id: 'highFraudRisk', name: 'High Fraud Risk Penalty', value: 40, enabled: true },
    { id: 'repeatedWarnings', name: 'Repeated Warnings Penalty', value: 20, enabled: true },
    { id: 'multipleActiveProjects', name: 'Multiple Active Projects Penalty', value: 15, enabled: true }
  ]);

  // Bonus Adjustments Configuration
  const [bonusConfigs, setBonusConfigs] = useState([
    { id: 'verifiedCerts', name: 'Verified Certifications Bonus', value: 5, enabled: true },
    { id: 'relevantInternship', name: 'Relevant Internship Bonus', value: 8, enabled: true },
    { id: 'osContributor', name: 'Open Source Contributor Bonus', value: 5, enabled: true },
    { id: 'researchPublication', name: 'Research Publication Bonus', value: 5, enabled: true },
    { id: 'hackathonWinner', name: 'Hackathon Winner Bonus', value: 5, enabled: true },
    { id: 'leadershipExp', name: 'Leadership Experience Bonus', value: 5, enabled: true },
    { id: 'perfectPerformance', name: 'Perfect Performance Score Bonus', value: 10, enabled: true },
    { id: 'perfectTrust', name: 'Perfect Trust Score Bonus', value: 10, enabled: true },
    { id: 'longTermSuccess', name: 'Long-term Project Success Bonus', value: 8, enabled: true }
  ]);

  // --- 2. RAW SIMULATED RECORDS ---
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 'STU_01',
      name: 'Elena Rostova',
      major: 'Computer Science',
      gpa: 3.92,
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL', 'Docker'],
      skillsExpertise: { React: 'Expert', TypeScript: 'Advanced', TailwindCSS: 'Expert', 'Node.js': 'Advanced', PostgreSQL: 'Advanced', Docker: 'Intermediate' },
      skillsFreshnessDays: { React: 2, TypeScript: 4, TailwindCSS: 2, 'Node.js': 8, PostgreSQL: 12, Docker: 20 },
      experienceYears: { React: 2, TypeScript: 2, 'Node.js': 1.5 },
      englishLevel: 95,
      completedProjects: 4,
      projectSuccessRate: 98,
      historicalPerformanceAvg: 94,
      recentPerformanceAvg: 97,
      trustScore: 98,
      warningCount: 0,
      missedDeadlines: 0,
      withdrawals: 0,
      weeklyHours: 30,
      isOverloaded: false,
      remotePreference: 'Remote',
      independentWorkScore: 92,
      teamCollaborationScore: 95,
      leadershipScore: 85,
      documentationScore: 90,
      timezoneOffset: 2, // UTC+2
      country: 'Vietnam',
      isProfileComplete: true,
      hasExpiredCertificate: false,
      hasVerifiedCertifications: true,
      hasOSContribution: true,
      hasResearchPublication: false,
      hasHackathonWinner: true
    },
    {
      id: 'STU_02',
      name: 'Kenji Sato',
      major: 'Software Engineering',
      gpa: 3.45,
      skills: ['Python', 'PyTorch', 'Docker', 'FastAPI', 'SQL', 'Kubernetes'],
      skillsExpertise: { Python: 'Expert', PyTorch: 'Advanced', Docker: 'Advanced', FastAPI: 'Intermediate', SQL: 'Advanced', Kubernetes: 'Beginner' },
      skillsFreshnessDays: { Python: 1, PyTorch: 5, Docker: 14, FastAPI: 20, SQL: 3, Kubernetes: 60 },
      experienceYears: { Python: 3, PyTorch: 2, Docker: 1 },
      englishLevel: 75,
      completedProjects: 2,
      projectSuccessRate: 85,
      historicalPerformanceAvg: 88,
      recentPerformanceAvg: 82, // downward learning velocity
      trustScore: 88,
      warningCount: 0,
      missedDeadlines: 1,
      withdrawals: 0,
      weeklyHours: 20,
      isOverloaded: false,
      remotePreference: 'Hybrid',
      independentWorkScore: 85,
      teamCollaborationScore: 78,
      leadershipScore: 60,
      documentationScore: 75,
      timezoneOffset: 9, // UTC+9
      country: 'Japan',
      isProfileComplete: true,
      hasExpiredCertificate: false,
      hasVerifiedCertifications: false,
      hasOSContribution: true,
      hasResearchPublication: true,
      hasHackathonWinner: false
    },
    {
      id: 'STU_03',
      name: 'Marcus Vance (High Risk)',
      major: 'Information Systems',
      gpa: 2.80,
      skills: ['React', 'HTML/CSS', 'SQL'],
      skillsExpertise: { React: 'Intermediate', 'HTML/CSS': 'Advanced', SQL: 'Intermediate' },
      skillsFreshnessDays: { React: 45, 'HTML/CSS': 15, SQL: 30 },
      experienceYears: { React: 1 },
      englishLevel: 85,
      completedProjects: 1,
      projectSuccessRate: 50,
      historicalPerformanceAvg: 70,
      recentPerformanceAvg: 60,
      trustScore: 65,
      warningCount: 2,
      missedDeadlines: 4,
      withdrawals: 1,
      weeklyHours: 45,
      isOverloaded: true, // Overloaded penalty
      remotePreference: 'Onsite',
      independentWorkScore: 50,
      teamCollaborationScore: 65,
      leadershipScore: 40,
      documentationScore: 55,
      timezoneOffset: -5, // UTC-5
      country: 'United States',
      isProfileComplete: false, // Incomplete penalty
      hasExpiredCertificate: true, // Expired cert penalty
      hasVerifiedCertifications: false,
      hasOSContribution: false,
      hasResearchPublication: false,
      hasHackathonWinner: false
    }
  ]);

  const [companies, setCompanies] = useState<CompanyRecord[]>([
    {
      id: 'COMP_01',
      name: 'Nexus Tech Systems',
      industry: 'Software Engineering',
      preferredSkills: ['React', 'TypeScript', 'Node.js'],
      reputationScore: 96,
      hiringHistoryRate: 85,
      communicationStyle: 'Asynchronous',
      timezoneOffset: 2,
      country: 'Vietnam'
    },
    {
      id: 'COMP_02',
      name: 'Aether AI Labs',
      industry: 'Artificial Intelligence',
      preferredSkills: ['Python', 'PyTorch', 'Docker'],
      reputationScore: 92,
      hiringHistoryRate: 70,
      communicationStyle: 'Hybrid',
      timezoneOffset: 9,
      country: 'Japan'
    },
    {
      id: 'COMP_03',
      name: 'Global Corp Inc',
      industry: 'Information Technology',
      preferredSkills: ['Java', 'SQL'],
      reputationScore: 75,
      hiringHistoryRate: 40,
      communicationStyle: 'Synchronous',
      timezoneOffset: -5,
      country: 'United States'
    }
  ]);

  const [projects, setProjects] = useState<ProjectRecord[]>([
    {
      id: 'PROJ_01',
      title: 'Enterprise Dashboard Modernization',
      companyId: 'COMP_01',
      requiredSkills: ['React', 'TypeScript', 'TailwindCSS'],
      preferredSkills: ['Node.js', 'PostgreSQL'],
      difficulty: 'Intermediate',
      durationWeeks: 6,
      leadershipRequired: false,
      remoteRequired: true,
      industryContext: 'Software Engineering',
      englishRequiredLevel: 80,
      timezoneOffset: 2
    },
    {
      id: 'PROJ_02',
      title: 'Neural Fine-Tuning Pipeline',
      companyId: 'COMP_02',
      requiredSkills: ['Python', 'PyTorch', 'Docker'],
      preferredSkills: ['FastAPI', 'Kubernetes'],
      difficulty: 'Advanced',
      durationWeeks: 12,
      leadershipRequired: true,
      remoteRequired: false,
      industryContext: 'Artificial Intelligence',
      englishRequiredLevel: 70,
      timezoneOffset: 9
    },
    {
      id: 'PROJ_03',
      title: 'Legacy SQL Migration',
      companyId: 'COMP_03',
      requiredSkills: ['SQL'],
      preferredSkills: ['PostgreSQL', 'Java'],
      difficulty: 'Advanced',
      durationWeeks: 4,
      leadershipRequired: false,
      remoteRequired: true,
      industryContext: 'Information Technology',
      englishRequiredLevel: 90,
      timezoneOffset: -5
    }
  ]);

  // Simulated immutable database historical ledger
  const [matchHistory, setMatchHistory] = useState<MatchingResult[]>([
    {
      id: 'MAT_HIST_4901',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      studentId: 'STU_01',
      projectId: 'PROJ_01',
      companyId: 'COMP_01',
      matchingScore: 95.82,
      baseScore: 93.32,
      matchLevel: 'Exceptional Match',
      confidenceScore: 98,
      riskScore: 5,
      categoryScores: { academic: 95, technical: 92, project: 90, industry: 100 },
      penaltiesApplied: [],
      bonusesApplied: [{ id: 'perfectTrust', name: 'Perfect Trust Score Bonus', value: 10 }],
      strengths: ['Elite communication alignment', 'Near perfect technical overlay'],
      weaknesses: ['None'],
      improvementSuggestions: ['Proceed immediately with recruitment invitation.'],
      explanation: 'Excellent candidate with complete skill set match and perfect trust scores.',
      layersExecuted: ['Data Norm', 'Penalties Audited', 'Confidence Calibrated'],
      durationMs: 44,
      version: 'v1.0.0'
    }
  ]);

  // Dynamic state computed for current selection
  const [currentMatch, setCurrentMatch] = useState<MatchingResult | null>(null);

  // Synchronize dynamic matching score calculation
  const calculateCompatibility = () => {
    const startTime = performance.now();

    const student = students.find(s => s.id === selectedStudentId);
    const project = projects.find(p => p.id === selectedProjectId);
    const company = companies.find(c => c.id === selectedCompanyId) || (project ? companies.find(c => c.id === project.companyId) : null);

    if (!student || !project || !company) return;

    const pipelineSteps: string[] = [];
    pipelineSteps.push('[Pipeline Initiated] Loading student feature vectors & project directives.');

    // Dictionary of category scores
    const categoryScores: Record<string, number> = {};

    // --- 1. ACADEMIC COMPATIBILITY (8%) ---
    let academicScore = 40;
    if (student.major === 'Computer Science' || student.major === 'Software Engineering') {
      academicScore = project.industryContext === 'Software Engineering' || project.industryContext === 'Artificial Intelligence' ? 100 : 85;
    } else if (student.major === 'Information Systems') {
      academicScore = 70;
    } else if (student.major === 'Business') {
      academicScore = project.industryContext === 'Information Technology' ? 60 : 40;
    }
    // Adjust slightly for GPA: GPA 3.5+ increases score by 10 points
    if (student.gpa >= 3.5) academicScore = Math.min(100, academicScore + 10);
    categoryScores.academic = academicScore;
    pipelineSteps.push(`[Layer 1: Academic Compatibility] Computed score: ${academicScore}/100 based on major ${student.major} alignment.`);

    // --- 2. TECHNICAL COMPATIBILITY (18%) ---
    // Skills matching logic
    const reqMatchCount = project.requiredSkills.filter(s => student.skills.includes(s)).length;
    const reqMatchRate = project.requiredSkills.length > 0 ? (reqMatchCount / project.requiredSkills.length) * 100 : 100;

    const prefMatchCount = project.preferredSkills.filter(s => student.skills.includes(s)).length;
    const prefMatchRate = project.preferredSkills.length > 0 ? (prefMatchCount / project.preferredSkills.length) * 100 : 100;

    // Skill level matches: percentage of matching skills that are advanced/expert
    const matchingSkills = project.requiredSkills.filter(s => student.skills.includes(s));
    let expertCount = 0;
    matchingSkills.forEach(s => {
      const level = student.skillsExpertise[s];
      if (level === 'Advanced' || level === 'Expert') expertCount++;
    });
    const levelMatchRate = matchingSkills.length > 0 ? (expertCount / matchingSkills.length) * 100 : 80;

    // Experience years match: avg years of relevant experience
    const matchingExperience = matchingSkills.map(s => student.experienceYears[s] || 0.5);
    const avgExperience = matchingExperience.length > 0 ? matchingExperience.reduce((a, b) => a + b, 0) / matchingExperience.length : 1;
    const experienceMatchRate = Math.min(100, avgExperience * 30); // 3+ years = 100%

    // Skill freshness match: percent of skills used in the last 15 days
    let freshCount = 0;
    matchingSkills.forEach(s => {
      const days = student.skillsFreshnessDays[s] || 30;
      if (days <= 15) freshCount++;
    });
    const freshnessRate = matchingSkills.length > 0 ? (freshCount / matchingSkills.length) * 100 : 80;

    // Technical weights: Req 40%, Pref 25%, Level 15%, Exp 10%, Freshness 10%
    const technicalScore = Math.round(
      (reqMatchRate * 0.4) +
      (prefMatchRate * 0.25) +
      (levelMatchRate * 0.15) +
      (experienceMatchRate * 0.1) +
      (freshnessRate * 0.1)
    );
    categoryScores.technical = technicalScore;
    pipelineSteps.push(`[Layer 2: Technical Compatibility] Computed score: ${technicalScore}/100. Matching skills count: ${reqMatchCount}/${project.requiredSkills.length}.`);

    // --- 3. PROJECT COMPATIBILITY (12%) ---
    // Past completed similarity, technology match, role match, difficulty match
    const difficultyMatch = (project.difficulty === 'Advanced' && student.completedProjects >= 3) ? 100 :
                            (project.difficulty === 'Intermediate' && student.completedProjects >= 1) ? 90 : 70;
    const historicalSimilarRate = Math.min(100, student.completedProjects * 25);
    const projectScore = Math.round(
      (historicalSimilarRate * 0.4) +
      (reqMatchRate * 0.3) +
      (student.teamCollaborationScore * 0.2) +
      (difficultyMatch * 0.1)
    );
    categoryScores.project = projectScore;
    pipelineSteps.push(`[Layer 3: Project Compatibility] Computed score: ${projectScore}/100. Checked structural work scopes.`);

    // --- 4. INDUSTRY COMPATIBILITY (6%) ---
    const industryInterestRate = student.major === 'Computer Science' ? 100 : 80;
    const prevSuccessRate = student.projectSuccessRate;
    const industryScore = Math.round(
      (prevSuccessRate * 0.4) +
      (industryInterestRate * 0.35) +
      (Math.min(100, student.completedProjects * 20) * 0.25)
    );
    categoryScores.industry = industryScore;
    pipelineSteps.push(`[Layer 4: Industry Compatibility] Computed score: ${industryScore}/100 for industry segment: ${project.industryContext}.`);

    // --- 5. LANGUAGE COMPATIBILITY (8%) ---
    const studentLang = student.englishLevel;
    const companyReq = project.englishRequiredLevel;
    let languageScore = studentLang >= companyReq ? 100 : Math.max(0, 100 - (companyReq - studentLang) * 3);
    categoryScores.language = Math.round(languageScore);
    pipelineSteps.push(`[Layer 5: Language Compatibility] Computed score: ${categoryScores.language}/100. Student English: ${studentLang}%, Req: ${companyReq}%.`);

    // --- 6. EXPERIENCE COMPATIBILITY (8%) ---
    const expScore = Math.round(
      (student.completedProjects * 15 * 0.5) +
      (student.projectSuccessRate * 0.25) +
      (student.independentWorkScore * 0.25)
    );
    categoryScores.experience = Math.min(100, expScore);
    pipelineSteps.push(`[Layer 6: Experience Compatibility] Computed score: ${categoryScores.experience}/100.`);

    // --- 7. PERFORMANCE COMPATIBILITY (10%) ---
    const perfTrendDiff = student.recentPerformanceAvg - student.historicalPerformanceAvg;
    const growthTrendComponent = perfTrendDiff >= 0 ? 100 : Math.max(0, 100 + perfTrendDiff * 5);
    const performanceScore = Math.round(
      (student.recentPerformanceAvg * 0.4) +
      (student.historicalPerformanceAvg * 0.3) +
      (growthTrendComponent * 0.2) +
      (student.projectSuccessRate * 0.1)
    );
    categoryScores.performance = performanceScore;
    pipelineSteps.push(`[Layer 7: Performance Compatibility] Computed score: ${performanceScore}/100. Growth delta: ${perfTrendDiff.toFixed(1)}%.`);

    // --- 8. TRUST COMPATIBILITY (8%) ---
    const trustScoreComponent = student.trustScore * 0.6;
    const timelineComponent = Math.min(100, student.completedProjects * 25) * 0.2;
    const warningPenaltyComponent = -(student.warningCount * 20);
    const verifiedComponent = student.isUnivVerified ? 20 : 0;
    const trustScoreFinal = Math.max(0, Math.min(100, Math.round(trustScoreComponent + timelineComponent + warningPenaltyComponent + verifiedComponent)));
    categoryScores.trust = trustScoreFinal;
    pipelineSteps.push(`[Layer 8: Trust Compatibility] Computed score: ${trustScoreFinal}/100. Student Trust Index: ${student.trustScore}%, Warnings: ${student.warningCount}.`);

    // --- 9. AVAILABILITY COMPATIBILITY (5%) ---
    const hoursRate = student.weeklyHours >= 20 ? 100 : (student.weeklyHours / 20) * 100;
    const overloadFactor = student.isOverloaded ? 50 : 100;
    const availabilityScore = Math.round((hoursRate * 0.7) + (overloadFactor * 0.3));
    categoryScores.availability = availabilityScore;
    pipelineSteps.push(`[Layer 9: Availability Compatibility] Computed score: ${availabilityScore}/100. Weekly commitment: ${student.weeklyHours} hours.`);

    // --- 10. WORK STYLE COMPATIBILITY (5%) ---
    const remoteStyleMatch = (project.remoteRequired && student.remotePreference === 'Remote') ? 100 :
                            (!project.remoteRequired && student.remotePreference === 'Onsite') ? 100 : 70;
    const workStyleScore = Math.round(
      (remoteStyleMatch * 0.5) +
      (student.independentWorkScore * 0.3) +
      (student.documentationScore * 0.2)
    );
    categoryScores.workStyle = workStyleScore;
    pipelineSteps.push(`[Layer 10: Work Style Compatibility] Computed score: ${workStyleScore}/100. Remote overlap matched.`);

    // --- 11. COMMUNICATION COMPATIBILITY (5%) ---
    let commStyleMatch = 80;
    if (student.remotePreference === 'Remote' && company.communicationStyle === 'Asynchronous') {
      commStyleMatch = 100;
    } else if (company.communicationStyle === 'Hybrid') {
      commStyleMatch = 90;
    }
    const commScore = Math.round(
      (commStyleMatch * 0.6) +
      (student.teamCollaborationScore * 0.4)
    );
    categoryScores.communication = commScore;
    pipelineSteps.push(`[Layer 11: Communication Compatibility] Computed score: ${commScore}/100.`);

    // --- 12. CAREER COMPATIBILITY (4%) ---
    const careerScore = Math.round(
      (student.leadershipScore * 0.5) +
      (student.independentWorkScore * 0.5)
    );
    categoryScores.career = careerScore;
    pipelineSteps.push(`[Layer 12: Career Compatibility] Computed score: ${careerScore}/100.`);

    // --- 13. LOCATION COMPATIBILITY (2%) ---
    const locationScore = student.country === company.country ? 100 : 70;
    categoryScores.location = locationScore;
    pipelineSteps.push(`[Layer 13: Location Compatibility] Computed score: ${locationScore}/100 (${student.country} to ${company.country}).`);

    // --- 14. TIMEZONE COMPATIBILITY (2%) ---
    const tzDiff = Math.abs(student.timezoneOffset - project.timezoneOffset);
    const overlapHours = 24 - tzDiff;
    let tzScore = 20;
    if (tzDiff <= 2) {
      tzScore = 100; // >=6 Hours or near perfect
    } else if (tzDiff <= 4) {
      tzScore = 85;
    } else if (tzDiff <= 6) {
      tzScore = 70;
    } else if (tzDiff <= 8) {
      tzScore = 50;
    }
    categoryScores.timezone = tzScore;
    pipelineSteps.push(`[Layer 14: Timezone Compatibility] Computed score: ${tzScore}/100 based on temporal shift of ${tzDiff} hours.`);

    // --- 15. GROWTH POTENTIAL (5%) ---
    const growthScore = Math.round(
      (growthTrendComponent * 0.35) +
      (student.gpa / 4 * 100 * 0.35) +
      (student.teamCollaborationScore * 0.3)
    );
    categoryScores.growth = growthScore;
    pipelineSteps.push(`[Layer 15: Growth Potential] Computed score: ${growthScore}/100.`);

    // --- 16. LONG-TERM HIRING POTENTIAL (4%) ---
    const longTermScore = Math.round(
      (student.projectSuccessRate * 0.3) +
      (company.hiringHistoryRate * 0.3) +
      (student.trustScore * 0.2) +
      (student.teamCollaborationScore * 0.2)
    );
    categoryScores.longTerm = longTermScore;
    pipelineSteps.push(`[Layer 16: Long-term Hiring Potential] Computed score: ${longTermScore}/100. Employer retention rate: ${company.hiringHistoryRate}%.`);

    // --- BASE MATCHING SCORE (Σ(CategoryScore * Weight)) ---
    let totalWeightValue = 0;
    let baseScoreSum = 0;
    dimensionWeights.forEach(dim => {
      const w = dim.weight / 100;
      const score = categoryScores[dim.id] || 50;
      baseScoreSum += score * w;
      totalWeightValue += dim.weight;
    });

    const initialBaseScore = baseScoreSum;
    pipelineSteps.push(`[Base Aggregator] Summed weights of ${totalWeightValue}%. Preliminary Base Score: ${initialBaseScore.toFixed(2)}/100.`);

    // --- PENALTY ENGINE ---
    let penalties = 0;
    const penaltiesAppliedList: { id: string; name: string; value: number }[] = [];

    const getPenaltyVal = (id: string) => penaltyConfigs.find(p => p.id === id && p.enabled)?.value || 0;

    if (!student.isProfileComplete) {
      const val = getPenaltyVal('profileIncomplete');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'profileIncomplete', name: 'Profile Incomplete', value: val });
      }
    }
    if (student.withdrawals >= 1) {
      const val = getPenaltyVal('repeatedWithdrawal');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'repeatedWithdrawal', name: 'Repeated Withdrawal', value: val });
      }
    }
    if (student.hasExpiredCertificate) {
      const val = getPenaltyVal('expiredLanguageCert');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'expiredLanguageCert', name: 'Expired Language Certificate', value: val });
      }
    }
    if (student.weeklyHours < 15) {
      const val = getPenaltyVal('lowAvailability');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'lowAvailability', name: 'Low Availability', value: val });
      }
    }
    if (student.missedDeadlines >= 3) {
      const val = getPenaltyVal('repeatedMissedDeadlines');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'repeatedMissedDeadlines', name: 'Repeated Missed Deadlines', value: val });
      }
    }
    if (student.trustScore < 70) {
      const val = getPenaltyVal('highFraudRisk');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'highFraudRisk', name: 'High Security Risk Triggered', value: val });
      }
    }
    if (student.warningCount > 1) {
      const val = getPenaltyVal('repeatedWarnings');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'repeatedWarnings', name: 'Repeated Warnings Applied', value: val });
      }
    }
    if (student.isOverloaded) {
      const val = getPenaltyVal('multipleActiveProjects');
      if (val > 0) {
        penalties += val;
        penaltiesAppliedList.push({ id: 'multipleActiveProjects', name: 'Multiple Active Projects (Capacity Overload)', value: val });
      }
    }

    // --- BONUS ENGINE ---
    let bonuses = 0;
    const bonusesAppliedList: { id: string; name: string; value: number }[] = [];

    const getBonusVal = (id: string) => bonusConfigs.find(b => b.id === id && b.enabled)?.value || 0;

    if (student.hasVerifiedCertifications) {
      const val = getBonusVal('verifiedCerts');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'verifiedCerts', name: 'Verified Certifications', value: val });
      }
    }
    if (student.completedProjects >= 2 && student.projectSuccessRate >= 90) {
      const val = getBonusVal('relevantInternship');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'relevantInternship', name: 'Relevant Internships History', value: val });
      }
    }
    if (student.hasOSContribution) {
      const val = getBonusVal('osContributor');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'osContributor', name: 'Open Source Contributor', value: val });
      }
    }
    if (student.hasResearchPublication) {
      const val = getBonusVal('researchPublication');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'researchPublication', name: 'Research Publication', value: val });
      }
    }
    if (student.hasHackathonWinner) {
      const val = getBonusVal('hackathonWinner');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'hackathonWinner', name: 'Hackathon Winner', value: val });
      }
    }
    if (student.leadershipScore >= 80) {
      const val = getBonusVal('leadershipExp');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'leadershipExp', name: 'Elite Leadership Experience', value: val });
      }
    }
    if (student.recentPerformanceAvg >= 95) {
      const val = getBonusVal('perfectPerformance');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'perfectPerformance', name: 'Outstanding 30-Day Performance', value: val });
      }
    }
    if (student.trustScore >= 98) {
      const val = getBonusVal('perfectTrust');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'perfectTrust', name: 'Pristine Trust Records', value: val });
      }
    }
    if (student.completedProjects >= 4) {
      const val = getBonusVal('longTermSuccess');
      if (val > 0) {
        bonuses += val;
        bonusesAppliedList.push({ id: 'longTermSuccess', name: 'Long-term Program Veteran', value: val });
      }
    }

    // Clamp bonus at maximum of +25
    const clampedBonus = Math.min(25, bonuses);
    pipelineSteps.push(`[Adjustments] Raw Penalties: -${penalties} pts. Raw Bonuses: +${bonuses} (Clamped to +${clampedBonus}).`);

    // FINAL CALCULATED COMPATIBILITY SCORE
    const finalMatchingScore = Math.max(0, Math.min(100, Number((initialBaseScore - penalties + clampedBonus).toFixed(2))));
    pipelineSteps.push(`[Calculation Complete] Final score calculated deterministically: ${finalMatchingScore}%.`);

    // Determine Match Level Display Value
    let matchLevel = 'Not Recommended';
    if (finalMatchingScore >= 98) matchLevel = 'Perfect Match';
    else if (finalMatchingScore >= 95) matchLevel = 'Exceptional Match';
    else if (finalMatchingScore >= 90) matchLevel = 'Excellent Match';
    else if (finalMatchingScore >= 85) matchLevel = 'Strong Match';
    else if (finalMatchingScore >= 80) matchLevel = 'Recommended';
    else if (finalMatchingScore >= 75) matchLevel = 'Potential Match';
    else if (finalMatchingScore >= 70) matchLevel = 'Conditional Match';
    else if (finalMatchingScore >= 60) matchLevel = 'Weak Match';

    // Confidence index Calculation
    let confidenceScore = 100;
    if (student.completedProjects === 0) confidenceScore -= 20;
    if (!student.isProfileComplete) confidenceScore -= 10;
    if (!student.isUnivVerified) confidenceScore -= 10;
    confidenceScore = Math.max(30, confidenceScore);

    // Risk Index Calculation
    let riskScore = 5;
    if (student.warningCount > 0) riskScore += student.warningCount * 15;
    if (student.missedDeadlines > 0) riskScore += student.missedDeadlines * 10;
    if (student.withdrawals > 0) riskScore += student.withdrawals * 20;
    if (student.trustScore < 80) riskScore += 25;
    riskScore = Math.min(100, riskScore);

    // Dynamic Strengths & Weaknesses generator
    const strengths: string[] = [];
    if (reqMatchRate >= 100) strengths.push('Perfect match of required technical programming languages.');
    if (student.trustScore >= 95) strengths.push('Pristine institutional trust credentials.');
    if (student.recentPerformanceAvg >= 92) strengths.push('Elite recent 30-day performance averages.');
    if (studentLang >= companyReq) strengths.push('Business English level exceeds requirements.');
    if (student.completedProjects >= 3) strengths.push('Extensive platform internship history.');
    if (strengths.length === 0) strengths.push('Adequate baseline academic background.');

    const weaknesses: string[] = [];
    if (reqMatchRate < 100) weaknesses.push(`Missing ${project.requiredSkills.filter(s => !student.skills.includes(s)).join(', ')} programming languages.`);
    if (student.weeklyHours < 20) weaknesses.push('Available weekly timeline commits fall short of target workload.');
    if (student.warningCount > 0) weaknesses.push('Active behavioral warning counts flagged on ledger.');
    if (tzDiff > 4) weaknesses.push(`Large local timeline variance (${tzDiff} hours offset).`);
    if (weaknesses.length === 0) weaknesses.push('None detected.');

    // Dynamic suggestions roadmap
    const suggestions: string[] = [];
    if (reqMatchRate < 100) {
      const missing = project.requiredSkills.filter(s => !student.skills.includes(s));
      suggestions.push(`Complete fast-track learning modules on: ${missing.join(', ')}.`);
    }
    if (student.weeklyHours < 20) {
      suggestions.push('Request schedule optimization or coordinate part-time milestones.');
    }
    if (!student.isProfileComplete) {
      suggestions.push('Upload high-contrast portfolio artifacts to remove incomplete profile penalty.');
    }
    if (student.hasExpiredCertificate) {
      suggestions.push('Schedule fresh English test module to restore expired language status.');
    }
    if (suggestions.length === 0) {
      suggestions.push('No critical changes required. Proceed with interview invitation invitation.');
    }

    // Dynamic explainability narrative
    let explanation = `Candidate "${student.name}" achieved an overall matching rating of ${finalMatchingScore}% ("${matchLevel}") for "${project.title}". `;
    if (finalMatchingScore >= 90) {
      explanation += `This recommendation is driven by outstanding technical match rates (${technicalScore}%) and strong historical trust standards (${trustScoreFinal}%). This candidate presents the highest statistical likelihood of project completion.`;
    } else if (finalMatchingScore >= 75) {
      explanation += `The match is recommended, although minor operational adjustments (e.g. timezone shift of ${tzDiff}h or lower available hours) are present. Baseline suitability remains strong.`;
    } else {
      explanation += `Matching score is low due to prominent penalties (Total Penalties applied: -${penalties} pts). We advise administrators to verify credentials before proceeding.`;
    }

    setCurrentMatch({
      id: `MAT_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      studentId: selectedStudentId,
      projectId: selectedProjectId,
      companyId: company.id,
      matchingScore: finalMatchingScore,
      baseScore: Number(initialBaseScore.toFixed(2)),
      matchLevel,
      confidenceScore,
      riskScore,
      categoryScores,
      penaltiesApplied: penaltiesAppliedList,
      bonusesApplied: bonusesAppliedList,
      strengths,
      weaknesses,
      improvementSuggestions: suggestions,
      explanation,
      layersExecuted: pipelineSteps,
      durationMs: Math.round(performance.now() - startTime),
      version: engineVersion === 'v1' ? 'v1.2.0' : engineVersion === 'v2' ? 'v2.0.1' : 'v3.0.0'
    });
  };

  useEffect(() => {
    calculateCompatibility();
  }, [
    selectedStudentId, selectedProjectId, selectedCompanyId, dimensionWeights,
    penaltyConfigs, bonusConfigs, engineVersion
  ]);

  const handleSaveToLedger = () => {
    if (!currentMatch) return;
    setMatchHistory(prev => [currentMatch, ...prev]);
    alert('Deterministically computed recommendation has been recorded in the KONEXA immutable Audit Ledger.');
  };

  const handleWeightChange = (id: string, val: number) => {
    setDimensionWeights(prev => prev.map(dim => {
      if (dim.id === id) {
        return { ...dim, weight: Math.max(0, Math.min(100, val)) };
      }
      return dim;
    }));
  };

  const togglePenalty = (id: string) => {
    setPenaltyConfigs(prev => prev.map(p => {
      if (p.id === id) return { ...p, enabled: !p.enabled };
      return p;
    }));
  };

  const toggleBonus = (id: string) => {
    setBonusConfigs(prev => prev.map(b => {
      if (b.id === id) return { ...b, enabled: !b.enabled };
      return b;
    }));
  };

  const totalWeightsSum = dimensionWeights.reduce((a, b) => a + b.weight, 0);

  // Simulated REST API JSON response payload
  const simulatedJsonResponse = currentMatch ? {
    metadata: {
      engine_name: "KONEXA Compatibility & Matching Score Engine",
      version: currentMatch.version,
      timestamp: currentMatch.timestamp,
      computational_duration_ms: currentMatch.durationMs
    },
    targets: {
      student_id: currentMatch.studentId,
      project_id: currentMatch.projectId,
      company_id: currentMatch.companyId
    },
    scores: {
      matching_probability: currentMatch.matchingScore,
      base_composite_score: currentMatch.baseScore,
      recommendation_tier: currentMatch.matchLevel,
      engine_confidence: currentMatch.confidenceScore,
      calculated_risk: currentMatch.riskScore
    },
    category_weights_applied: dimensionWeights.reduce((acc, curr) => {
      acc[curr.id] = curr.weight;
      return acc;
    }, {} as Record<string, number>),
    raw_dimension_scores: currentMatch.categoryScores,
    adjustments: {
      penalties: currentMatch.penaltiesApplied,
      bonuses: currentMatch.bonusesApplied
    },
    explainability: {
      strengths: currentMatch.strengths,
      weaknesses: currentMatch.weaknesses,
      actionable_roadmap: currentMatch.improvementSuggestions,
      composite_explanation: currentMatch.explanation
    }
  } : null;

  return (
    <div className="space-y-6">
      {/* Brand Title Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Scale className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Compatibility Specification 3.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Compatibility & Matching Score Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Unifies the Student, Company, and Project profiles into a single explainable Matching Score. Resolves 16 category-level compatibility algorithms, stacks customizable penalties, and awards credential premium bonuses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${totalWeightsSum === 100 ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
            <span className="text-xs font-mono text-neutral-300">WEIGHT TOTAL: {totalWeightsSum}%</span>
          </div>
        </div>
      </div>

      {/* Workspace Subtabs */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'matrix', label: '16-Category Sandbox', icon: Sliders },
          { id: 'weights', label: 'Weight Customizer', icon: Settings },
          { id: 'penalties', label: 'Penalties & Bonuses', icon: ShieldAlert },
          { id: 'logs', label: 'Immutable Audit ledger', icon: History },
          { id: 'docs', label: 'Specifications & Database schema', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${isSelected ? 'bg-neutral-900 text-white border border-neutral-800 shadow-md' : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container switch */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Sandbox Control pane */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selectors card */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">1. Configure Matching Candidates</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Student */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Student Profile</label>
                    <select
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    {/* Tiny specs */}
                    {students.find(s => s.id === selectedStudentId) && (
                      <div className="mt-2 text-[10px] text-neutral-400 font-mono bg-neutral-900/50 p-2 rounded-lg space-y-0.5">
                        <div>Major: {students.find(s => s.id === selectedStudentId)?.major}</div>
                        <div>Skills: {students.find(s => s.id === selectedStudentId)?.skills.slice(0, 3).join(', ')}...</div>
                      </div>
                    )}
                  </div>

                  {/* Project */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Project Directive</label>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                    {/* Tiny specs */}
                    {projects.find(p => p.id === selectedProjectId) && (
                      <div className="mt-2 text-[10px] text-neutral-400 font-mono bg-neutral-900/50 p-2 rounded-lg space-y-0.5">
                        <div>Required: {projects.find(p => p.id === selectedProjectId)?.requiredSkills.join(', ')}</div>
                        <div>Level Req: {projects.find(p => p.id === selectedProjectId)?.englishRequiredLevel}% Eng</div>
                      </div>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Enterprise Company</label>
                    <select
                      value={selectedCompanyId}
                      onChange={e => setSelectedCompanyId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {/* Tiny specs */}
                    {companies.find(c => c.id === selectedCompanyId) && (
                      <div className="mt-2 text-[10px] text-neutral-400 font-mono bg-neutral-900/50 p-2 rounded-lg space-y-0.5">
                        <div>Industry: {companies.find(c => c.id === selectedCompanyId)?.industry}</div>
                        <div>Comm style: {companies.find(c => c.id === selectedCompanyId)?.communicationStyle}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category-level breakdown chart */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">2. 16-Dimensional Compatibility Breakdown Matrix</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMatch && dimensionWeights.map(dim => {
                    const score = currentMatch.categoryScores[dim.id] || 0;
                    return (
                      <div key={dim.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-neutral-300">{dim.name}</span>
                          <span className="font-mono text-teal-400 font-bold">{score}% <span className="text-[9px] text-neutral-500">({dim.weight}%)</span></span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-400 h-full rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic calculations audit logs step trail */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">3. Internal Deterministic Computation Log</span>
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 max-h-60 overflow-y-auto space-y-2 font-mono text-[11px] text-neutral-400">
                  {currentMatch?.layersExecuted.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 border-b border-neutral-850/50 pb-1">
                      <span className="text-teal-400">✓</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Ultimate Scoring output */}
            <div className="lg:col-span-5 space-y-6">
              {/* Massive Score Gauge card */}
              <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />

                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">KONEXA MATCH PROBABILITY</span>

                <div className="my-8 relative">
                  <span className="text-8xl font-extrabold text-white tracking-tight font-mono">
                    {currentMatch?.matchingScore}%
                  </span>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-500 text-neutral-950 font-mono font-bold rounded-full text-xs whitespace-nowrap shadow-md">
                    {currentMatch?.matchLevel}
                  </div>
                </div>

                <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mb-6 mt-4 border border-neutral-850">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentMatch?.matchingScore}%` }}
                  />
                </div>

                {/* Meta indexes */}
                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-neutral-900 text-left font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">Engine Confidence</span>
                    <span className="text-neutral-200">{currentMatch?.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">Safety & Risk Score</span>
                    <span className="text-rose-400">{currentMatch?.riskScore}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900/50 w-full flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>Base Score: {currentMatch?.baseScore}%</span>
                  <span>Latency: {currentMatch?.durationMs}ms</span>
                </div>
              </div>

              {/* Explainability Strengths & suggestions */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Aesthetic & Measurable Rationale</span>
                
                <div className="p-3.5 bg-neutral-900/50 border border-neutral-850 rounded-xl text-xs text-neutral-300 leading-relaxed font-sans">
                  {currentMatch?.explanation}
                </div>

                {/* Lists */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block mb-1">PROVEN STRENGTHS</span>
                    <div className="space-y-1">
                      {currentMatch?.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block mb-1">SYSTEM CONSTRAINTS</span>
                    <div className="space-y-1">
                      {currentMatch?.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-neutral-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-900">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block mb-1">IMPROVEMENT BLUEPRINT</span>
                    <div className="space-y-1">
                      {currentMatch?.improvementSuggestions.map((s, i) => (
                        <div key={i} className="p-2 bg-neutral-900 border border-neutral-850 rounded-lg text-xs text-neutral-400 font-mono">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Record button */}
                <button
                  onClick={handleSaveToLedger}
                  className="w-full mt-2 py-2.5 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4" /> LOCK COMPATIBILITY DECISION SNAPSHOT
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weights customization panel */}
        {activeSubTab === 'weights' && (
          <motion.div
            key="weights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Category Weight Allocation Console</h3>
              <p className="text-xs text-neutral-400">
                Configure percentage allocations dynamically across the 16 compatibility layers. Per security guidelines, no single dimension may exceed 25%.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dimensionWeights.map(dim => (
                <div key={dim.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{dim.name}</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <input
                        type="number"
                        value={dim.weight}
                        onChange={e => handleWeightChange(dim.id, parseInt(e.target.value) || 0)}
                        className="w-14 bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-center text-teal-400"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-tight">{dim.description}</p>
                </div>
              ))}
            </div>

            {totalWeightsSum !== 100 && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Aggregated Sum Error: Total weight equals {totalWeightsSum}%. Match pipeline will recalculate using relative fraction offsets until corrected to exactly 100%.</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Penalties & Bonuses adjustments panel */}
        {activeSubTab === 'penalties' && (
          <motion.div
            key="penalties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Penalties */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-rose-400 mb-1">Stackable Penalty Constraints</h3>
                <p className="text-xs text-neutral-400">
                  Turn penalties on or off or customize deductions to enforce reliability checkpoints.
                </p>
              </div>

              <div className="space-y-3">
                {penaltyConfigs.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-neutral-200">{p.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono block">Deduction: -{p.value} points</span>
                    </div>
                    <button
                      onClick={() => togglePenalty(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${p.enabled ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-neutral-950 border-neutral-850 text-neutral-500'}`}
                    >
                      {p.enabled ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonuses */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 mb-1">Incremental Premium Bonuses</h3>
                <p className="text-xs text-neutral-400">
                  Configure extra bonuses for outstanding candidate credentials. Maximum bonus sum is capped at +25.
                </p>
              </div>

              <div className="space-y-3">
                {bonusConfigs.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-neutral-200">{b.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono block">Addition: +{b.value} points</span>
                    </div>
                    <button
                      onClick={() => toggleBonus(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${b.enabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-neutral-950 border-neutral-850 text-neutral-500'}`}
                    >
                      {b.enabled ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Ledger logs */}
        {activeSubTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Immutable Platform Match Ledger</h3>
                <p className="text-xs text-neutral-400">
                  Every calculation snapshot is historically preserved with exact weights and algorithm version tags. This log is cryptographically sealed and cannot be purged.
                </p>
              </div>
              <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 px-3 py-1 text-neutral-300 rounded-lg">
                Total: {matchHistory.length} SNAPSHOTS
              </span>
            </div>

            <div className="space-y-3">
              {matchHistory.map(log => (
                <div key={log.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-neutral-950 text-teal-400 text-[10px] rounded border border-neutral-850">{log.id}</span>
                      <span className="text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-500">VERSION: {log.version}</span>
                      <span className="px-2 py-0.5 bg-teal-500 text-neutral-950 text-[10px] font-bold rounded-full">{log.matchingScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-300">
                    <div>Student: <span className="text-neutral-100">{students.find(s => s.id === log.studentId)?.name || log.studentId}</span></div>
                    <div>Project: <span className="text-neutral-100">{projects.find(p => p.id === log.projectId)?.title || log.projectId}</span></div>
                    <div>Confidence Index: <span className="text-neutral-100">{log.confidenceScore}%</span></div>
                  </div>

                  {log.penaltiesApplied.length > 0 && (
                    <div className="text-[10px] text-rose-400">
                      Penalties Applied: {log.penaltiesApplied.map(p => `${p.name} (-${p.value})`).join(', ')}
                    </div>
                  )}

                  {log.bonusesApplied.length > 0 && (
                    <div className="text-[10px] text-emerald-400">
                      Bonuses Applied: {log.bonusesApplied.map(b => `${b.name} (+${b.value})`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specs and database schema tab */}
        {activeSubTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Database schema and APIs */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" /> Database Schema Requirements
                </h3>
                <p className="text-xs text-neutral-400">
                  Supabase / PostgreSQL database tables required to run Part 4 Compatibility and Matching Score Engine.
                </p>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 font-mono text-[11px] text-neutral-300 overflow-x-auto">
                <pre>{`-- Cryptographically sealed matching ledger
CREATE TABLE match_score_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    student_id UUID REFERENCES student_analysis_snapshots(id),
    project_id UUID REFERENCES projects(id),
    company_id UUID REFERENCES companies(id),
    matching_score NUMERIC(5,2) NOT NULL,
    base_composite_score NUMERIC(5,2) NOT NULL,
    confidence_score INT NOT NULL,
    risk_score INT NOT NULL,
    match_level VARCHAR(40) NOT NULL,
    
    -- Category breakdown stored as JSONB for auditability
    category_scores JSONB NOT NULL,
    penalties_applied JSONB NOT NULL,
    bonuses_applied JSONB NOT NULL,
    
    explanation TEXT NOT NULL,
    algorithm_version VARCHAR(20) NOT NULL
);

-- Index for instant horizontal scaling queries
CREATE INDEX idx_match_score_student_project 
ON match_score_ledger(student_id, project_id);`}</pre>
              </div>

              {/* API specification */}
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400" /> API Schema Payload JSON
                </h3>
                <p className="text-xs text-neutral-400">
                  Simulated JSON output from `/api/v1/compatibility/calculate` endpoint.
                </p>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-60 overflow-y-auto">
                <pre>{JSON.stringify(simulatedJsonResponse, null, 2)}</pre>
              </div>
            </div>

            {/* Technical specifications */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" /> Architectural Principles
                </h3>
                <p className="text-xs text-neutral-400">
                  Compliance standards of KONEXA 3.0 Compatibility Engine.
                </p>
              </div>

              <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
                <div className="p-3.5 bg-neutral-900 border border-neutral-850 rounded-xl space-y-2">
                  <span className="font-bold text-neutral-200 block uppercase font-mono text-[10px]">1. COMPLETE DETERMINISM</span>
                  <p>
                    Every score calculated must return identical results given identical student, company, and project snapshotted attributes. Black-box weights or unversioned heuristic modifications are strictly prohibited.
                  </p>
                </div>

                <div className="p-3.5 bg-neutral-900 border border-neutral-850 rounded-xl space-y-2">
                  <span className="font-bold text-neutral-200 block uppercase font-mono text-[10px]">2. NO GENDER OR ETHNIC BIASES</span>
                  <p>
                    The engine consumes verified, objective, and professional operational parameters only. Any direct or indirect bias utilizing candidate age, ethnicity, politics, or appearance is blocked during validation parsing.
                  </p>
                </div>

                <div className="p-3.5 bg-neutral-900 border border-neutral-850 rounded-xl space-y-2">
                  <span className="font-bold text-neutral-200 block uppercase font-mono text-[10px]">3. SCALE PRE-CACHING</span>
                  <p>
                    For millions of active users, category matching is calculated inside asynchronous queue workers. Cached scores are stored inside high-speed Redis indexes and recalculated only during critical profile update trigger events.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
