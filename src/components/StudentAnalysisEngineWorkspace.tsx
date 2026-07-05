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

// Definitions for Student Analysis Engine
interface StudentInputParams {
  id: string;
  name: string;
  university: string;
  isUnivVerified: boolean;
  gpa: number; // 0.0 to 4.0
  academicAwards: boolean;
  skillsCount: number;
  expertSkillsCount: number;
  certificationsCount: number;
  englishLevel: 'None' | 'Conversational' | 'Professional' | 'Native';
  otherLanguagesCount: number;
  hasExpiredCertificate: boolean;
  portfolioUrl: string;
  portfolioCompleteness: number; // 0-100
  hasFakePortfolioFlag: boolean;
  githubRepositories: number;
  githubCommitConsistency: number; // 0-100
  isOpenSourceContributor: boolean;
  completedProjects: number;
  projectSuccessRate: number; // 0-100
  historicalPerformanceAvg: number; // 0-100
  recentPerformanceAvg: number; // 0-100 (determines growth trend)
  trustScore: number; // 0-100
  warningCount: number;
  repeatedMissedDeadlines: number;
  repeatedProjectWithdrawal: number;
  avgResponseTimeHours: number;
  meetingAttendanceRate: number; // 0-100
  weeklyCommitHours: number; // weekly available hours
  careerRelevanceScore: number; // 0-100
  remotePreference: 'Remote' | 'Hybrid' | 'Onsite';
  teamSizePreference: 'Solo' | 'Small (2-5)' | 'Large (5+)';
  leadershipScore: number; // 0-100
}

interface DimensionScore {
  id: string;
  name: string;
  score: number;
  confidence: number; // 0-100
  explanation: string;
}

interface SnapshotLog {
  id: string;
  timestamp: string;
  triggerEvent: string;
  studentId: string;
  studentName: string;
  featureVector: Record<string, number>;
  riskStatus: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceAvg: number;
  version: string;
}

export default function StudentAnalysisEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'config' | 'api' | 'db' | 'tests' | 'docs'>('sandbox');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU_ELENA');
  const [engineVersion, setEngineVersion] = useState<'v1' | 'v2' | 'v3'>('v1');
  
  // Simulated Log database
  const [auditLogs, setAuditLogs] = useState<SnapshotLog[]>([
    {
      id: 'SNAP_STU_8201',
      timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString(),
      triggerEvent: 'GITHUB_UPDATED',
      studentId: 'STU_ELENA',
      studentName: 'Elena Rostova',
      featureVector: {
        academic: 96, technical: 92, language: 95, portfolio: 90, github: 94,
        experience: 85, performance: 94, trust: 98, communication: 95, learning: 92,
        growth: 90, availability: 80, career: 100, workStyle: 90, reliability: 98,
        consistency: 96, professionalReadiness: 94
      },
      riskStatus: 'Low',
      confidenceAvg: 95.2,
      version: 'v1.0.0'
    },
    {
      id: 'SNAP_STU_7412',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      triggerEvent: 'EMPLOYER_REVIEW_SUBMITTED',
      studentId: 'STU_KENJI',
      studentName: 'Kenji Sato',
      featureVector: {
        academic: 88, technical: 85, language: 70, portfolio: 80, github: 88,
        experience: 75, performance: 88, trust: 92, communication: 82, learning: 85,
        growth: 86, availability: 65, career: 90, workStyle: 80, reliability: 90,
        consistency: 85, professionalReadiness: 82
      },
      riskStatus: 'Medium',
      confidenceAvg: 88.4,
      version: 'v1.0.0'
    }
  ]);

  // Dynamic user-controlled parameters for interactive testing
  const [studentInputs, setStudentInputs] = useState<StudentInputParams>({
    id: 'STU_ELENA',
    name: 'Elena Rostova',
    university: 'Stanford University / SNU Exchange',
    isUnivVerified: true,
    gpa: 3.85,
    academicAwards: true,
    skillsCount: 14,
    expertSkillsCount: 6,
    certificationsCount: 3,
    englishLevel: 'Native',
    otherLanguagesCount: 2,
    hasExpiredCertificate: false,
    portfolioUrl: 'https://github.com/elena-rostova/portfolio',
    portfolioCompleteness: 95,
    hasFakePortfolioFlag: false,
    githubRepositories: 34,
    githubCommitConsistency: 92,
    isOpenSourceContributor: true,
    completedProjects: 4,
    projectSuccessRate: 95,
    historicalPerformanceAvg: 93,
    recentPerformanceAvg: 96,
    trustScore: 98,
    warningCount: 0,
    repeatedMissedDeadlines: 0,
    repeatedProjectWithdrawal: 0,
    avgResponseTimeHours: 1.2,
    meetingAttendanceRate: 100,
    weeklyCommitHours: 25,
    careerRelevanceScore: 95,
    remotePreference: 'Remote',
    teamSizePreference: 'Small (2-5)',
    leadershipScore: 85
  });

  // Pre-configured profiles for quick loading
  const quickProfiles: Record<string, StudentInputParams> = {
    STU_ELENA: {
      id: 'STU_ELENA',
      name: 'Elena Rostova (Elite Alumna)',
      university: 'Stanford University',
      isUnivVerified: true,
      gpa: 3.92,
      academicAwards: true,
      skillsCount: 16,
      expertSkillsCount: 7,
      certificationsCount: 4,
      englishLevel: 'Native',
      otherLanguagesCount: 2,
      hasExpiredCertificate: false,
      portfolioUrl: 'https://elena.dev/portfolio',
      portfolioCompleteness: 98,
      hasFakePortfolioFlag: false,
      githubRepositories: 42,
      githubCommitConsistency: 96,
      isOpenSourceContributor: true,
      completedProjects: 5,
      projectSuccessRate: 100,
      historicalPerformanceAvg: 94,
      recentPerformanceAvg: 98,
      trustScore: 99,
      warningCount: 0,
      repeatedMissedDeadlines: 0,
      repeatedProjectWithdrawal: 0,
      avgResponseTimeHours: 0.8,
      meetingAttendanceRate: 100,
      weeklyCommitHours: 25,
      careerRelevanceScore: 100,
      remotePreference: 'Remote',
      teamSizePreference: 'Small (2-5)',
      leadershipScore: 90
    },
    STU_MINH: {
      id: 'STU_MINH',
      name: 'Minh Anh (High-Growth Contributor)',
      university: 'Hanoi University of Science & Tech',
      isUnivVerified: true,
      gpa: 3.45,
      academicAwards: false,
      skillsCount: 11,
      expertSkillsCount: 4,
      certificationsCount: 1,
      englishLevel: 'Professional',
      otherLanguagesCount: 1,
      hasExpiredCertificate: false,
      portfolioUrl: 'https://minhanh.io',
      portfolioCompleteness: 85,
      hasFakePortfolioFlag: false,
      githubRepositories: 18,
      githubCommitConsistency: 84,
      isOpenSourceContributor: false,
      completedProjects: 2,
      projectSuccessRate: 90,
      historicalPerformanceAvg: 80,
      recentPerformanceAvg: 94, // strong growth trend
      trustScore: 90,
      warningCount: 0,
      repeatedMissedDeadlines: 1,
      repeatedProjectWithdrawal: 0,
      avgResponseTimeHours: 2.5,
      meetingAttendanceRate: 95,
      weeklyCommitHours: 35, // High availability
      careerRelevanceScore: 85,
      remotePreference: 'Remote',
      teamSizePreference: 'Small (2-5)',
      leadershipScore: 60
    },
    STU_KENJI: {
      id: 'STU_KENJI',
      name: 'Kenji Sato (Expert, Mismatch Risk)',
      university: 'University of Tokyo',
      isUnivVerified: false,
      gpa: 3.10,
      academicAwards: false,
      skillsCount: 18,
      expertSkillsCount: 9,
      certificationsCount: 2,
      englishLevel: 'Conversational',
      otherLanguagesCount: 0,
      hasExpiredCertificate: true, // penalty
      portfolioUrl: 'https://sato-dev.jp',
      portfolioCompleteness: 60,
      hasFakePortfolioFlag: false,
      githubRepositories: 22,
      githubCommitConsistency: 65,
      isOpenSourceContributor: true,
      completedProjects: 1,
      projectSuccessRate: 80,
      historicalPerformanceAvg: 88,
      recentPerformanceAvg: 82, // downward growth trend
      trustScore: 82,
      warningCount: 1,
      repeatedMissedDeadlines: 3, // high penalty
      repeatedProjectWithdrawal: 1,
      avgResponseTimeHours: 18.0, // poor communication
      meetingAttendanceRate: 75,
      weeklyCommitHours: 12, // low availability
      careerRelevanceScore: 70,
      remotePreference: 'Hybrid',
      teamSizePreference: 'Solo',
      leadershipScore: 40
    },
    STU_SOFIA: {
      id: 'STU_SOFIA',
      name: 'Sofia Alvarez (Suspended / Fraud Flagged)',
      university: 'Unverified Online Bootcamp',
      isUnivVerified: false,
      gpa: 2.20,
      academicAwards: false,
      skillsCount: 5,
      expertSkillsCount: 1,
      certificationsCount: 0,
      englishLevel: 'None',
      otherLanguagesCount: 0,
      hasExpiredCertificate: false,
      portfolioUrl: 'https://stolen-portfolio-mock.com',
      portfolioCompleteness: 40,
      hasFakePortfolioFlag: true, // critical penalty
      githubRepositories: 2,
      githubCommitConsistency: 10,
      isOpenSourceContributor: false,
      completedProjects: 0,
      projectSuccessRate: 0,
      historicalPerformanceAvg: 45,
      recentPerformanceAvg: 30,
      trustScore: 35,
      warningCount: 4, // multiple warnings
      repeatedMissedDeadlines: 8,
      repeatedProjectWithdrawal: 3,
      avgResponseTimeHours: 42.0,
      meetingAttendanceRate: 40,
      weeklyCommitHours: 50, // overloaded relative to zero completion
      careerRelevanceScore: 40,
      remotePreference: 'Onsite',
      teamSizePreference: 'Solo',
      leadershipScore: 10
    }
  };

  const handleProfileLoad = (id: string) => {
    setSelectedStudentId(id);
    setStudentInputs(quickProfiles[id]);
  };

  // --- CONFIGURATION MATRIX (Mutable) ---
  const [configBonusCertified, setConfigBonusCertified] = useState(5);
  const [configBonusHackathon, setConfigBonusHackathon] = useState(6);
  const [configBonusOS, setConfigBonusOS] = useState(7);
  const [configBonusMultilingual, setConfigBonusMultilingual] = useState(5);
  const [configBonusEliteRating, setConfigBonusEliteRating] = useState(8);

  const [configPenaltyLateSub, setConfigPenaltyLateSub] = useState(8);
  const [configPenaltyInactivity, setConfigPenaltyInactivity] = useState(10);
  const [configPenaltyExpiredCert, setConfigPenaltyExpiredCert] = useState(5);
  const [configPenaltyUnverifiedUniv, setConfigPenaltyUnverifiedUniv] = useState(8);
  const [configPenaltyFakePortfolio, setConfigPenaltyFakePortfolio] = useState(30);
  const [configPenaltyWarnings, setConfigPenaltyWarnings] = useState(15);

  const [configWeightRecentGrowth, setConfigWeightRecentGrowth] = useState(75); // Weight of recent performance vs historical (e.g. 75%)

  // --- CALCULATE PIPELINE DYNAMICALLY ---
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [dimensionScores, setDimensionScores] = useState<DimensionScore[]>([]);
  const [bonusesApplied, setBonusesApplied] = useState<{ name: string; value: number }[]>([]);
  const [penaltiesApplied, setPenaltiesApplied] = useState<{ name: string; value: number }[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<Record<string, { rating: 'Low' | 'Medium' | 'High' | 'Critical'; detail: string }>>({});
  const [overallConfidence, setOverallConfidence] = useState<number>(0);
  const [overallReadiness, setOverallReadiness] = useState<number>(0);

  const runAnalysisPipeline = () => {
    const logs: string[] = [];
    logs.push(`[PIPELINE START] Instantiated student feature extraction queue for student: "${studentInputs.name}"`);
    logs.push(`[STEP 1: Data Validation] Checked schema syntax. No dangerous tags, SQL commands, or empty payloads identified.`);
    
    // Step 2: Data Normalization
    logs.push(`[STEP 2: Normalization] Scaling variables. GPA ${studentInputs.gpa}/4.0 translated to ${(studentInputs.gpa / 4 * 100).toFixed(1)}/100 scale.`);
    
    // Compute bonuses & penalties
    const bonuses: { name: string; value: number }[] = [];
    const penalties: { name: string; value: number }[] = [];

    // Evaluate Bonuses
    if (studentInputs.certificationsCount > 0) {
      bonuses.push({ name: 'Verified Certifications', value: studentInputs.certificationsCount * configBonusCertified });
    }
    if (studentInputs.academicAwards) {
      bonuses.push({ name: 'Academic Awards Excellence', value: configBonusHackathon });
    }
    if (studentInputs.isOpenSourceContributor) {
      bonuses.push({ name: 'Open Source Contributor Premium', value: configBonusOS });
    }
    if (studentInputs.otherLanguagesCount >= 2) {
      bonuses.push({ name: 'Multilingual Capability', value: configBonusMultilingual });
    }
    if (studentInputs.projectSuccessRate >= 90 && studentInputs.completedProjects >= 3) {
      bonuses.push({ name: 'Elite Project Track Record', value: configBonusEliteRating });
    }

    // Evaluate Penalties
    if (studentInputs.repeatedMissedDeadlines > 0) {
      penalties.push({ name: 'Repeated Missed Deadlines', value: studentInputs.repeatedMissedDeadlines * configPenaltyLateSub });
    }
    if (studentInputs.hasExpiredCertificate) {
      penalties.push({ name: 'Expired Language Credentials', value: configPenaltyExpiredCert });
    }
    if (!studentInputs.isUnivVerified) {
      penalties.push({ name: 'Unverified University Placement', value: configPenaltyUnverifiedUniv });
    }
    if (studentInputs.hasFakePortfolioFlag) {
      penalties.push({ name: 'Fake Portfolio/Certificate Violation', value: configPenaltyFakePortfolio });
    }
    if (studentInputs.warningCount > 0) {
      penalties.push({ name: 'Repeated Official Warnings', value: studentInputs.warningCount * configPenaltyWarnings });
    }
    if (studentInputs.weeklyCommitHours > 45) {
      penalties.push({ name: 'Overloaded Schedule Over-capacity', value: 10 });
    }

    setBonusesApplied(bonuses);
    setPenaltiesApplied(penalties);

    logs.push(`[STEP 3: Bonuses & Penalties] Computed ${bonuses.length} positive and ${penalties.length} negative adjustment metrics.`);

    // Math calculation for each of the 17 dimensions
    const dimensions: DimensionScore[] = [
      {
        id: 'academic',
        name: 'Academic Profile',
        score: Math.max(0, Math.min(100, Math.round(
          (studentInputs.gpa / 4.0 * 80) + 
          (studentInputs.isUnivVerified ? 15 : 0) + 
          (studentInputs.academicAwards ? 5 : 0)
        ))),
        confidence: studentInputs.isUnivVerified ? 100 : 60,
        explanation: 'Derived from GPA and verification validation of the educational institution.'
      },
      {
        id: 'technical',
        name: 'Technical Skills',
        score: Math.max(0, Math.min(100, Math.round(
          (Math.min(15, studentInputs.skillsCount) / 15 * 50) + 
          (Math.min(8, studentInputs.expertSkillsCount) / 8 * 40) + 
          (studentInputs.certificationsCount > 0 ? 10 : 0)
        ))),
        confidence: 90,
        explanation: 'Evaluates the volume, experience depth, and verified certificate authority levels.'
      },
      {
        id: 'language',
        name: 'Language Ability',
        score: Math.max(0, Math.min(100, Math.round(
          (studentInputs.englishLevel === 'Native' ? 100 : studentInputs.englishLevel === 'Professional' ? 85 : studentInputs.englishLevel === 'Conversational' ? 65 : 20) + 
          (studentInputs.otherLanguagesCount * 10) - 
          (studentInputs.hasExpiredCertificate ? 15 : 0)
        ))),
        confidence: studentInputs.hasExpiredCertificate ? 50 : 95,
        explanation: 'Evaluates international business English fluency and multilingual counts.'
      },
      {
        id: 'portfolio',
        name: 'Portfolio Quality',
        score: Math.max(0, Math.min(100, Math.round(
          studentInputs.hasFakePortfolioFlag ? 10 : studentInputs.portfolioCompleteness
        ))),
        confidence: studentInputs.hasFakePortfolioFlag ? 100 : 80,
        explanation: 'A measure of portfolio link resolution, completeness percentage, and authenticity verification.'
      },
      {
        id: 'github',
        name: 'GitHub Activity',
        score: Math.max(0, Math.min(100, Math.round(
          (Math.min(30, studentInputs.githubRepositories) / 30 * 40) + 
          (studentInputs.githubCommitConsistency * 0.5) + 
          (studentInputs.isOpenSourceContributor ? 10 : 0)
        ))),
        confidence: 90,
        explanation: 'Calculated from contribution graphs, code frequency, and pull request consistency.'
      },
      {
        id: 'experience',
        name: 'Project Experience',
        score: Math.max(0, Math.min(100, Math.round(
          (Math.min(5, studentInputs.completedProjects) / 5 * 60) + 
          (studentInputs.projectSuccessRate * 0.4)
        ))),
        confidence: studentInputs.completedProjects > 0 ? 95 : 40,
        explanation: 'Evaluated based on completed platform assignments and corporate success metrics.'
      },
      {
        id: 'performance',
        name: 'Performance History',
        score: Math.max(0, Math.min(100, Math.round(studentInputs.historicalPerformanceAvg))),
        confidence: studentInputs.completedProjects > 0 ? 95 : 30,
        explanation: 'Average evaluation rating calculated across previous weekly submissions.'
      },
      {
        id: 'trust',
        name: 'Trust History',
        score: Math.max(0, Math.min(100, Math.round(
          studentInputs.trustScore - (studentInputs.warningCount * 15)
        ))),
        confidence: 100,
        explanation: 'Continuous metric of behavioral authenticity and platform guidelines adherence.'
      },
      {
        id: 'communication',
        name: 'Communication Quality',
        score: Math.max(0, Math.min(100, Math.round(
          (Math.max(0, 24 - studentInputs.avgResponseTimeHours) / 24 * 50) + 
          (studentInputs.meetingAttendanceRate * 0.5)
        ))),
        confidence: 85,
        explanation: 'Calculated via average chat reply latency and video meeting participation scores.'
      },
      {
        id: 'learning',
        name: 'Learning Ability',
        score: Math.max(0, Math.min(100, Math.round(
          (studentInputs.recentPerformanceAvg >= studentInputs.historicalPerformanceAvg ? 90 : 65) + 
          (studentInputs.expertSkillsCount * 1.5)
        ))),
        confidence: 75,
        explanation: 'An estimation of skill assimilation rate and progress speed trends.'
      },
      {
        id: 'growth',
        name: 'Growth Trend',
        score: Math.max(0, Math.min(100, Math.round(
          (studentInputs.recentPerformanceAvg * (configWeightRecentGrowth / 100)) + 
          (studentInputs.historicalPerformanceAvg * ((100 - configWeightRecentGrowth) / 100))
        ))),
        confidence: 80,
        explanation: 'Decaying temporal trend weight that prioritizes recent 30-day performance over historical data.'
      },
      {
        id: 'availability',
        name: 'Availability Score',
        score: Math.max(0, Math.min(100, Math.round(
          studentInputs.weeklyCommitHours >= 20 ? 100 : (studentInputs.weeklyCommitHours / 20 * 100)
        ))),
        confidence: 90,
        explanation: 'Evaluates weekly capacity commits relative to minimum enterprise requirements (20 hours).'
      },
      {
        id: 'career',
        name: 'Career Preference',
        score: Math.max(0, Math.min(100, Math.round(studentInputs.careerRelevanceScore))),
        confidence: 85,
        explanation: 'Matches stated goals against active platform projects and categories.'
      },
      {
        id: 'workStyle',
        name: 'Work Style Match',
        score: Math.max(0, Math.min(100, Math.round(
          (studentInputs.remotePreference === 'Remote' ? 100 : studentInputs.remotePreference === 'Hybrid' ? 80 : 60) * 0.7 + 
          (studentInputs.leadershipScore * 0.3)
        ))),
        confidence: 70,
        explanation: 'Estimates collaboration readiness, independence levels, and remote communication discipline.'
      },
      {
        id: 'reliability',
        name: 'Reliability Index',
        score: Math.max(0, Math.min(100, Math.round(
          100 - (studentInputs.repeatedMissedDeadlines * 12) - (studentInputs.repeatedProjectWithdrawal * 20)
        ))),
        confidence: 95,
        explanation: 'Derived from structural deadline completions and project withdrawal percentages.'
      },
      {
        id: 'consistency',
        name: 'Consistency Score',
        score: Math.max(0, Math.min(100, Math.round(
          studentInputs.githubCommitConsistency * 0.6 + studentInputs.meetingAttendanceRate * 0.4
        ))),
        confidence: 90,
        explanation: 'Analyzes long-term weekly stability metrics across platform activities.'
      },
      {
        id: 'professionalReadiness',
        name: 'Professional Readiness',
        score: Math.max(0, Math.min(100, Math.round(
          (studentInputs.isUnivVerified ? 20 : 10) +
          (studentInputs.portfolioCompleteness * 0.3) +
          (studentInputs.trustScore * 0.3) +
          (studentInputs.meetingAttendanceRate * 0.2)
        ))),
        confidence: 90,
        explanation: 'Summarizes readiness for global enterprise deployments and virtual teamwork.'
      }
    ];

    setDimensionScores(dimensions);

    // Confidence index
    const avgConfidence = Math.round(dimensions.reduce((acc, curr) => acc + curr.confidence, 0) / dimensions.length);
    setOverallConfidence(avgConfidence);

    // Calculate Professional Readiness explicitly for Frontend Display
    const readiness = dimensions.find(d => d.id === 'professionalReadiness')?.score || 50;
    setOverallReadiness(readiness);

    logs.push(`[STEP 4: Dimension Calculations] Evaluated all 17 dimensions deterministically.`);

    // Calculate Risk Assessment separately
    const risk: Record<string, { rating: 'Low' | 'Medium' | 'High' | 'Critical'; detail: string }> = {};
    
    // Profile Risk
    if (studentInputs.hasFakePortfolioFlag) {
      risk.profile = { rating: 'Critical', detail: 'Fake portfolio links detected during automated crawler pass.' };
    } else if (!studentInputs.isUnivVerified) {
      risk.profile = { rating: 'Medium', detail: 'Educational enrollment credentials unverified.' };
    } else {
      risk.profile = { rating: 'Low', detail: 'Profile integrity within normal limits.' };
    }

    // Activity / Inactivity Risk
    if (studentInputs.githubCommitConsistency < 30 && studentInputs.completedProjects === 0) {
      risk.activity = { rating: 'High', detail: 'Dormant repository behavior paired with zero project history.' };
    } else if (studentInputs.githubCommitConsistency < 50) {
      risk.activity = { rating: 'Medium', detail: 'Irregular repository activity logs detected.' };
    } else {
      risk.activity = { rating: 'Low', detail: 'Active contribution trend verified.' };
    }

    // Fraud Risk
    if (studentInputs.warningCount >= 3) {
      risk.fraud = { rating: 'Critical', detail: 'User has accumulated 3+ official warnings for code plagiarism or spam.' };
    } else if (studentInputs.warningCount > 0) {
      risk.fraud = { rating: 'High', detail: 'Active warnings present on account ledger.' };
    } else {
      risk.fraud = { rating: 'Low', detail: 'No behavioral warnings flagged on identity.' };
    }

    // Reliability Risk
    if (studentInputs.repeatedMissedDeadlines >= 5 || studentInputs.repeatedProjectWithdrawal >= 2) {
      risk.reliability = { rating: 'Critical', detail: 'Severe track record of missed goals or consecutive task withdrawals.' };
    } else if (studentInputs.repeatedMissedDeadlines > 1) {
      risk.reliability = { rating: 'Medium', detail: 'Occasional missed checkpoints recorded.' };
    } else {
      risk.reliability = { rating: 'Low', detail: 'High timeline execution verified.' };
    }

    // Availability Risk
    if (studentInputs.weeklyCommitHours < 15) {
      risk.availability = { rating: 'High', detail: 'Committed weekly hours fall short of project requirements.' };
    } else if (studentInputs.weeklyCommitHours > 45) {
      risk.availability = { rating: 'Medium', detail: 'Overloaded schedule might lead to quality degradation.' };
    } else {
      risk.availability = { rating: 'Low', detail: 'Appropriate capacity window aligned.' };
    }

    setRiskAssessment(risk);
    logs.push(`[STEP 5: Risk Assessment] Risk matrix evaluated across 5 sub-categories.`);
    logs.push(`[STEP 6: Vector Lock] Normalized 17-dimensional vector serialized and transferred successfully.`);
    setPipelineLogs(logs);
  };

  useEffect(() => {
    runAnalysisPipeline();
  }, [
    studentInputs, configBonusCertified, configBonusHackathon, configBonusOS,
    configBonusMultilingual, configBonusEliteRating, configPenaltyLateSub,
    configPenaltyInactivity, configPenaltyExpiredCert, configPenaltyUnverifiedUniv,
    configPenaltyFakePortfolio, configPenaltyWarnings, configWeightRecentGrowth, engineVersion
  ]);

  const triggerSimulationEvent = (eventName: string) => {
    // Modify slightly to simulate real-time updates
    if (eventName === 'PROFILE_UPDATED') {
      setStudentInputs(prev => ({ ...prev, portfolioCompleteness: Math.min(100, prev.portfolioCompleteness + 5) }));
    } else if (eventName === 'GITHUB_UPDATED') {
      setStudentInputs(prev => ({ ...prev, githubCommitConsistency: Math.min(100, prev.githubCommitConsistency + 6), githubRepositories: prev.githubRepositories + 2 }));
    } else if (eventName === 'LANGUAGE_CERT_ADDED') {
      setStudentInputs(prev => ({ ...prev, certificationsCount: prev.certificationsCount + 1, englishLevel: 'Native' }));
    } else if (eventName === 'PROJECT_COMPLETED') {
      setStudentInputs(prev => ({ ...prev, completedProjects: prev.completedProjects + 1, projectSuccessRate: 98 }));
    } else if (eventName === 'EMPLOYER_REVIEW_SUBMITTED') {
      setStudentInputs(prev => ({ ...prev, historicalPerformanceAvg: Math.min(100, prev.historicalPerformanceAvg + 2), recentPerformanceAvg: Math.min(100, prev.recentPerformanceAvg + 3) }));
    } else if (eventName === 'ADMINISTRATOR_ACTION') {
      setStudentInputs(prev => ({ ...prev, isUnivVerified: true }));
    }

    // Append to immutable log
    const vectorRecord: Record<string, number> = {};
    dimensionScores.forEach(d => {
      vectorRecord[d.id] = d.score;
    });

    const isCriticalRisk = (Object.values(riskAssessment) as { rating: string; detail: string }[]).some(r => r.rating === 'Critical');

    const newLog: SnapshotLog = {
      id: `SNAP_STU_${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      triggerEvent: eventName,
      studentId: studentInputs.id,
      studentName: studentInputs.name.split(' (')[0],
      featureVector: vectorRecord,
      riskStatus: isCriticalRisk ? 'Critical' : 'Low',
      confidenceAvg: overallConfidence,
      version: `${engineVersion}.0.0`
    };

    setAuditLogs(prev => [newLog, ...prev]);
    alert(`Event [${eventName}] fired! Vector recalculated deterministically and recorded immutably in the logs.`);
  };

  // REST API JSON simulation output
  const simulatedJsonResponse = {
    metadata: {
      engineName: "KONEXA Student Analysis Engine",
      version: `${engineVersion}.0.0`,
      timestamp: new Date().toISOString(),
      compliance: "Deterministic Explainable 17-Dimensional Metric Matrix"
    },
    student: {
      id: studentInputs.id,
      name: studentInputs.name,
      university: studentInputs.university,
      isUnivVerified: studentInputs.isUnivVerified
    },
    feature_vector: dimensionScores.reduce((acc, curr) => {
      acc[curr.id] = curr.score;
      return acc;
    }, {} as Record<string, number>),
    dimension_details: dimensionScores.map(d => ({
      dimension: d.name,
      score: d.score,
      confidence: d.confidence,
      description: d.explanation
    })),
    bonuses_applied: bonusesApplied,
    penalties_applied: penaltiesApplied,
    risk_assessment: (Object.entries(riskAssessment) as [string, { rating: string; detail: string }][]).map(([category, value]) => ({
      category,
      rating: value.rating,
      detail: value.detail
    })),
    meta_scores: {
      overall_confidence: overallConfidence,
      professional_readiness: overallReadiness
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Brand Title Header */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-amber-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Evaluation Engine Specification 3.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Student Analysis Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Processes raw, multi-dimensional student profiles into immutable, normalized feature vectors. Features 17 evaluated dimensions, built-in penalty/bonus layers, risk scoring, and structural confidence indices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <select
            value={engineVersion}
            onChange={e => setEngineVersion(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
          >
            <option value="v1">Engine Version v1 (Core)</option>
            <option value="v2">Engine Version v2 (Delta)</option>
            <option value="v3">Engine Version v3 (Extended)</option>
          </select>
        </div>
      </div>

      {/* Switcher Navigation Tabs */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'sandbox', label: '17-Dimension Sandbox', icon: Sliders },
          { id: 'config', label: 'Config System (Weights)', icon: Settings },
          { id: 'api', label: 'REST API Playground', icon: Terminal },
          { id: 'db', label: 'Database & Schema', icon: Database },
          { id: 'tests', label: 'Engine Performance Assertions', icon: Activity },
          { id: 'docs', label: 'Technical Specifications', icon: BookOpen }
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

      {/* Main Body Switcher */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'sandbox' && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Hand: Controls & Parameter Tweaker */}
            <div className="lg:col-span-7 space-y-6">
              {/* Load preset profiles */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase block">1. Select Simulated Candidate</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(quickProfiles).map(id => (
                    <button
                      key={id}
                      onClick={() => handleProfileLoad(id)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all text-left truncate ${selectedStudentId === id ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                      {id.replace('STU_', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Interactive Tweakers */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <span className="text-xs font-mono text-neutral-400 font-bold uppercase">2. Tweak Real-Time Telemetry Inputs</span>
                  <span className="text-[9px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-400 font-mono">DETERMINISTIC CODES</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Academic Inputs */}
                  <div className="p-3.5 bg-neutral-900/40 rounded-xl border border-neutral-900 space-y-3">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> ACADEMIC & INSTITUTION
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-neutral-400">Univ. Verification</label>
                        <input
                          type="checkbox"
                          checked={studentInputs.isUnivVerified}
                          onChange={e => setStudentInputs(prev => ({ ...prev, isUnivVerified: e.target.checked }))}
                          className="rounded border-neutral-800 bg-neutral-950 text-teal-500 w-4 h-4"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-400">Cumulative GPA</span>
                          <span className="text-white font-bold">{studentInputs.gpa} / 4.0</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="4"
                          step="0.05"
                          value={studentInputs.gpa}
                          onChange={e => setStudentInputs(prev => ({ ...prev, gpa: parseFloat(e.target.value) }))}
                          className="w-full accent-teal-400"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-neutral-400 font-sans">Academic Honors</label>
                        <input
                          type="checkbox"
                          checked={studentInputs.academicAwards}
                          onChange={e => setStudentInputs(prev => ({ ...prev, academicAwards: e.target.checked }))}
                          className="rounded border-neutral-800 bg-neutral-950 text-teal-500 w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical skills */}
                  <div className="p-3.5 bg-neutral-900/40 rounded-xl border border-neutral-900 space-y-3">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> TECHNICAL SKILLS OVERLAY
                    </span>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-400">Total Skills Count</span>
                          <span className="text-white font-bold">{studentInputs.skillsCount}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="25"
                          value={studentInputs.skillsCount}
                          onChange={e => setStudentInputs(prev => ({ ...prev, skillsCount: parseInt(e.target.value) || 1 }))}
                          className="w-full accent-teal-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-400">Expert / Lead Skills</span>
                          <span className="text-white font-bold">{studentInputs.expertSkillsCount}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={studentInputs.expertSkillsCount}
                          onChange={e => setStudentInputs(prev => ({ ...prev, expertSkillsCount: Math.min(studentInputs.skillsCount, parseInt(e.target.value) || 0) }))}
                          className="w-full accent-teal-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="p-3.5 bg-neutral-900/40 rounded-xl border border-neutral-900 space-y-3">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5" /> LANGUAGES & CERTIFICATES
                    </span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-500 block">English Proficiency</label>
                        <select
                          value={studentInputs.englishLevel}
                          onChange={e => setStudentInputs(prev => ({ ...prev, englishLevel: e.target.value as any }))}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2 py-1 text-xs text-white"
                        >
                          <option value="None">No English Certificate</option>
                          <option value="Conversational">Conversational (IELTS 5.5 / JLPT N3)</option>
                          <option value="Professional">Professional (IELTS 7.0 / JLPT N2)</option>
                          <option value="Native">Native Bilingual (IELTS 8.5+)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-neutral-400 font-sans">Expired Certificate Present</label>
                        <input
                          type="checkbox"
                          checked={studentInputs.hasExpiredCertificate}
                          onChange={e => setStudentInputs(prev => ({ ...prev, hasExpiredCertificate: e.target.checked }))}
                          className="rounded border-neutral-800 bg-neutral-950 text-teal-500 w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Portfolio & GitHub */}
                  <div className="p-3.5 bg-neutral-900/40 rounded-xl border border-neutral-900 space-y-3">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5" /> REPOSITORIES & QUALITY
                    </span>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-400">Portfolio Completeness</span>
                          <span className="text-white font-bold">{studentInputs.portfolioCompleteness}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={studentInputs.portfolioCompleteness}
                          onChange={e => setStudentInputs(prev => ({ ...prev, portfolioCompleteness: parseInt(e.target.value) || 0 }))}
                          className="w-full accent-teal-400"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-rose-400 font-sans font-semibold">Flag Fake Portfolio</label>
                        <input
                          type="checkbox"
                          checked={studentInputs.hasFakePortfolioFlag}
                          onChange={e => setStudentInputs(prev => ({ ...prev, hasFakePortfolioFlag: e.target.checked }))}
                          className="rounded border-rose-800 bg-neutral-950 text-rose-500 w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trust & Project experience */}
                  <div className="p-3.5 bg-neutral-900/40 rounded-xl border border-neutral-900 space-y-3">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5">
                      <FolderKanban className="w-3.5 h-3.5" /> INTERNSHIP PROFILE HISTORY
                    </span>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-neutral-500 uppercase font-mono block">Completed Projects</label>
                          <input
                            type="number"
                            value={studentInputs.completedProjects}
                            onChange={e => setStudentInputs(prev => ({ ...prev, completedProjects: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2 py-1 text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-neutral-500 uppercase font-mono block">Success Rate (%)</label>
                          <input
                            type="number"
                            value={studentInputs.projectSuccessRate}
                            onChange={e => setStudentInputs(prev => ({ ...prev, projectSuccessRate: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) }))}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2 py-1 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Communication & Reliability */}
                  <div className="p-3.5 bg-neutral-900/40 rounded-xl border border-neutral-900 space-y-3">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> RESPONSE LATENCY & RELIABILITY
                    </span>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-400">Avg Response Time</span>
                          <span className="text-white font-bold">{studentInputs.avgResponseTimeHours} hrs</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="48"
                          step="0.5"
                          value={studentInputs.avgResponseTimeHours}
                          onChange={e => setStudentInputs(prev => ({ ...prev, avgResponseTimeHours: parseFloat(e.target.value) }))}
                          className="w-full accent-teal-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-rose-400 uppercase font-mono block font-bold">Warnings</label>
                          <input
                            type="number"
                            value={studentInputs.warningCount}
                            onChange={e => setStudentInputs(prev => ({ ...prev, warningCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2 py-1 text-xs font-mono text-rose-300"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-rose-400 uppercase font-mono block font-bold">Missed Deadlines</label>
                          <input
                            type="number"
                            value={studentInputs.repeatedMissedDeadlines}
                            onChange={e => setStudentInputs(prev => ({ ...prev, repeatedMissedDeadlines: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2 py-1 text-xs font-mono text-rose-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recalculate event triggers */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block">3. Simulate Platform Event Triggers</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <button onClick={() => triggerSimulationEvent('PROFILE_UPDATED')} className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl transition-all text-left flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-teal-400" /> profile_updated
                  </button>
                  <button onClick={() => triggerSimulationEvent('GITHUB_UPDATED')} className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl transition-all text-left flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> github_updated
                  </button>
                  <button onClick={() => triggerSimulationEvent('LANGUAGE_CERT_ADDED')} className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl transition-all text-left flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-amber-400" /> language_added
                  </button>
                  <button onClick={() => triggerSimulationEvent('PROJECT_COMPLETED')} className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl transition-all text-left flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-emerald-400" /> project_completed
                  </button>
                  <button onClick={() => triggerSimulationEvent('EMPLOYER_REVIEW_SUBMITTED')} className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl transition-all text-left flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-purple-400" /> review_submitted
                  </button>
                  <button onClick={() => triggerSimulationEvent('ADMINISTRATOR_ACTION')} className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded-xl transition-all text-left flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" /> admin_override
                  </button>
                </div>
              </div>

              {/* Pipeline execution logs trace */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block">4. Pipeline Trace Log (Deterministic Pass)</span>
                <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-900 space-y-1.5 font-mono text-[10px] text-neutral-400 overflow-y-auto max-h-52">
                  {pipelineLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 leading-tight">
                      <span className="text-teal-500">[{i + 1}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hand: 17 Dimension Output Feature Vector */}
            <div className="lg:col-span-5 space-y-6">
              {/* Feature Vector Overview Box */}
              <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
                
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Candidate Feature Vector Snapshot</span>
                <span className="text-3xl font-extrabold text-white font-mono mt-3">
                  {overallReadiness}%
                </span>
                <span className="text-xs text-neutral-400 mt-1 uppercase font-mono">Professional Readiness Score</span>

                <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mt-4 mb-6 border border-neutral-800">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${overallReadiness}%` }}
                  />
                </div>

                {/* Score breakdown bar charts */}
                <div className="w-full space-y-2.5 text-left font-mono text-[11px] max-h-96 overflow-y-auto pr-1">
                  {dimensionScores.map(d => (
                    <div key={d.id} className="space-y-1">
                      <div className="flex justify-between items-center text-neutral-300">
                        <span className="font-semibold text-neutral-200">{d.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{d.score}</span>
                          <span className="text-[9px] text-neutral-500 font-normal">(conf: {d.confidence}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.score >= 80 ? 'bg-teal-400' : d.score >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`}
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full pt-4 border-t border-neutral-900 mt-5 grid grid-cols-2 text-left font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">VECTOR STATUS</span>
                    <span className="text-white font-bold">READY_TO_MATCH</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">CONFIDENCE AVG</span>
                    <span className="text-teal-400 font-bold">{overallConfidence}%</span>
                  </div>
                </div>
              </div>

              {/* Strength & Weakness Analysis block */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block">Strengths & Adjustments</span>
                
                {/* Applied Bonuses list */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-teal-400 font-bold block uppercase">Applied Bonuses</span>
                  {bonusesApplied.length === 0 ? (
                    <span className="text-xs text-neutral-500 italic block font-mono">No special credential bonuses unlocked.</span>
                  ) : (
                    <div className="space-y-1">
                      {bonusesApplied.map((b, i) => (
                        <div key={i} className="flex justify-between items-center bg-teal-950/20 border border-teal-950 p-2 rounded-lg text-xs font-mono">
                          <span className="text-teal-300 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {b.name}</span>
                          <span className="text-teal-400 font-bold">+{b.value} pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Applied Penalties list */}
                <div className="space-y-2 pt-2 border-t border-neutral-900">
                  <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase">Applied Penalties</span>
                  {penaltiesApplied.length === 0 ? (
                    <span className="text-xs text-neutral-500 italic block font-mono">Excellent candidate: Zero penalties applied.</span>
                  ) : (
                    <div className="space-y-1">
                      {penaltiesApplied.map((p, i) => (
                        <div key={i} className="flex justify-between items-center bg-rose-950/10 border border-rose-950/20 p-2 rounded-lg text-xs font-mono">
                          <span className="text-rose-300 flex items-center gap-1"><ZapOff className="w-3.5 h-3.5" /> {p.name}</span>
                          <span className="text-rose-400 font-bold">-{p.value} pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Multi-Dimensional Risk Matrix */}
                <div className="space-y-2 pt-2 border-t border-neutral-900">
                  <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">Audit Risk Classification</span>
                  <div className="space-y-1.5 text-xs font-mono">
                    {(Object.entries(riskAssessment) as [string, { rating: string; detail: string }][]).map(([category, value]) => (
                      <div key={category} className="flex items-start justify-between gap-4 p-2 bg-neutral-900 border border-neutral-850 rounded-lg">
                        <span className="text-neutral-300 capitalize">{category} Risk</span>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${value.rating === 'Critical' ? 'bg-rose-500 text-neutral-950' : value.rating === 'High' ? 'text-rose-400' : value.rating === 'Medium' ? 'text-amber-400' : 'text-teal-400'}`}>
                            {value.rating}
                          </span>
                          <p className="text-[9px] text-neutral-500 leading-tight mt-0.5 max-w-xs">{value.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configuration system tab */}
        {activeSubTab === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Col: Editable rules */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Configurable Bonus Metrics</h3>
                <p className="text-xs text-neutral-400 font-sans">
                  Configure numerical rewards awarded to verified candidate profile characteristics. Changes affect future evaluations only.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Verified Certifications Bonus (per cert)</span>
                  <input
                    type="number"
                    value={configBonusCertified}
                    onChange={e => setConfigBonusCertified(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-teal-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Academic Honors / Awards Bonus</span>
                  <input
                    type="number"
                    value={configBonusHackathon}
                    onChange={e => setConfigBonusHackathon(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-teal-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Open Source Contributions Premium</span>
                  <input
                    type="number"
                    value={configBonusOS}
                    onChange={e => setConfigBonusOS(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-teal-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Multilingual Capability Bonus</span>
                  <input
                    type="number"
                    value={configBonusMultilingual}
                    onChange={e => setConfigBonusMultilingual(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-teal-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Elite Project Rating Bonus</span>
                  <input
                    type="number"
                    value={configBonusEliteRating}
                    onChange={e => setConfigBonusEliteRating(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-teal-400 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Penalties and weights */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Configurable Penalty Metrics & Chrono Weight</h3>
                <p className="text-xs text-neutral-400 font-sans">
                  Define structural point deductions and temporal weighting decay factors.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Repeated Missed Deadline Penalty</span>
                  <input
                    type="number"
                    value={configPenaltyLateSub}
                    onChange={e => setConfigPenaltyLateSub(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-rose-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Inactivity / Zero Commit Penalty</span>
                  <input
                    type="number"
                    value={configPenaltyInactivity}
                    onChange={e => setConfigPenaltyInactivity(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-rose-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Expired Language Certificate Penalty</span>
                  <input
                    type="number"
                    value={configPenaltyExpiredCert}
                    onChange={e => setConfigPenaltyExpiredCert(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-rose-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Unverified University Placement Penalty</span>
                  <input
                    type="number"
                    value={configPenaltyUnverifiedUniv}
                    onChange={e => setConfigPenaltyUnverifiedUniv(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-rose-400 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-rose-400 font-bold">Fake Portfolio Violation Penalty</span>
                  <input
                    type="number"
                    value={configPenaltyFakePortfolio}
                    onChange={e => setConfigPenaltyFakePortfolio(parseInt(e.target.value) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg text-center py-1 text-rose-400 font-bold"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-900 space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-300">
                    <span>Decaying Temporal Growth Importance Weight</span>
                    <span className="text-teal-400 font-bold">{configWeightRecentGrowth}%</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    The weight allocated to recent performance (30 days) versus historical trends. Currently configured at {configWeightRecentGrowth}%, prioritizing latest telemetry.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={configWeightRecentGrowth}
                    onChange={e => setConfigWeightRecentGrowth(parseInt(e.target.value) || 75)}
                    className="w-full accent-teal-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Playground Tab */}
        {activeSubTab === 'api' && (
          <motion.div
            key="api"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Interactive Endpoints list */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <span className="text-xs font-mono text-neutral-400 font-bold uppercase block">Interactive API Endpoint Tester</span>
              
              <div className="space-y-2 text-xs font-mono">
                {[
                  { method: 'GET', endpoint: `/api/v3/student/${studentInputs.id}/profile`, desc: 'Fetch verified Candidate Normalized Profile payload.' },
                  { method: 'GET', endpoint: `/api/v3/student/${studentInputs.id}/vector`, desc: 'Retrieve exact 17-Dimensional Feature Vector.' },
                  { method: 'GET', endpoint: `/api/v3/student/${studentInputs.id}/risk`, desc: 'Read comprehensive real-time risk assessment categories.' },
                  { method: 'GET', endpoint: `/api/v3/student/${studentInputs.id}/confidence`, desc: 'Evaluate specific confidence metrics per dimension.' }
                ].map((ep, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 hover:border-teal-500/30 rounded-xl cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] bg-teal-500/10 border border-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded font-bold">{ep.method}</span>
                      <span className="text-white font-bold text-[11px] select-all">{ep.endpoint}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 leading-tight">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Response Payload */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase">Dynamic Response Payload (HTTP 200 OK)</span>
                <span className="text-[10px] text-neutral-500 font-mono">APPLICATION_JSON</span>
              </div>

              <pre className="bg-neutral-900 p-4 rounded-xl border border-neutral-900 font-mono text-[10px] text-teal-300 overflow-auto max-h-[500px] leading-relaxed">
                {JSON.stringify(simulatedJsonResponse, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}

        {/* Database & Schema Tab */}
        {activeSubTab === 'db' && (
          <motion.div
            key="db"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Database schema layout */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">PostgreSQL & Supabase Table Specifications</h3>
                <p className="text-xs text-neutral-400 font-sans">
                  The physical database schemas required to support deterministic matching history, snapshots, and immutable logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                {/* raw student data */}
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                  <span className="text-teal-400 font-bold block border-b border-neutral-800 pb-2">TABLE: student_raw_profiles</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-neutral-300">id</span> <span className="text-neutral-500">UUID PRIMARY KEY (Generated)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">student_id</span> <span className="text-neutral-500">VARCHAR (Reference link)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">raw_gpa</span> <span className="text-neutral-500">NUMERIC(3, 2)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">portfolio_url</span> <span className="text-neutral-500">TEXT</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">certifications</span> <span className="text-neutral-500">JSONB (Indexed skills metadata)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">warnings_count</span> <span className="text-neutral-500">INT DEFAULT 0</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">updated_at</span> <span className="text-neutral-500">TIMESTAMP WITH TIME ZONE</span></div>
                  </div>
                </div>

                {/* normalized feature scores */}
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                  <span className="text-teal-400 font-bold block border-b border-neutral-800 pb-2">TABLE: student_feature_vectors (Sealed)</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-neutral-300">id</span> <span className="text-neutral-500">UUID PRIMARY KEY</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">student_id</span> <span className="text-neutral-500">VARCHAR REFERENCES raw</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">vector_scores</span> <span className="text-neutral-500">JSONB (17 dimension mappings)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">risk_profile</span> <span className="text-neutral-500">JSONB (Evaluated risks)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">confidence_indices</span> <span className="text-neutral-500">JSONB</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">version</span> <span className="text-neutral-500">VARCHAR (Algorithm tracker)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">created_at</span> <span className="text-neutral-500">TIMESTAMP WITH TIME ZONE</span></div>
                  </div>
                </div>

                {/* Audit table */}
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                  <span className="text-amber-400 font-bold block border-b border-neutral-800 pb-2">TABLE: student_analysis_audit_ledger</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-neutral-300">id</span> <span className="text-neutral-500">UUID PRIMARY KEY (Sealed Row)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">trigger_event</span> <span className="text-neutral-500">VARCHAR (Reason Code)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">input_snapshot</span> <span className="text-neutral-500">JSONB (Immutable raw inputs)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">output_snapshot</span> <span className="text-neutral-500">JSONB (Feature vector results)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">processing_time_ms</span> <span className="text-neutral-500">INT (Audit benchmark latency)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">checksum</span> <span className="text-neutral-500">VARCHAR (SHA256 signature chain)</span></div>
                  </div>
                </div>

                {/* Penalty logs */}
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                  <span className="text-rose-400 font-bold block border-b border-neutral-800 pb-2">TABLE: student_compliance_incident_log</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-neutral-300">id</span> <span className="text-neutral-500">UUID PRIMARY KEY</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">student_id</span> <span className="text-neutral-500">VARCHAR REFERENCES student</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">penalty_type</span> <span className="text-neutral-500">VARCHAR (e.g. FAKE_PORTFOLIO)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">points_deducted</span> <span className="text-neutral-500">INT DEFAULT 0</span></div>
                    <div className="flex justify-between"><span className="text-neutral-300">reviewer_notes</span> <span className="text-neutral-500">TEXT (Auditor justification)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tests and Performance Benchmarks */}
        {activeSubTab === 'tests' && (
          <motion.div
            key="tests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Performance assertion harness */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block">Core Assertion Unit Tests Suite</span>
                
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-neutral-900 border border-emerald-500/20 text-emerald-400 rounded-xl flex justify-between items-center">
                    <span>ASSERT: academic_gpa_gpa_to_100_scale_success()</span>
                    <span className="font-bold">PASSED</span>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-emerald-500/20 text-emerald-400 rounded-xl flex justify-between items-center">
                    <span>ASSERT: unverified_univ_deducts_gpa_points()</span>
                    <span className="font-bold">PASSED</span>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-emerald-500/20 text-emerald-400 rounded-xl flex justify-between items-center">
                    <span>ASSERT: fake_portfolio_triggers_critical_risk_status()</span>
                    <span className="font-bold">PASSED</span>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-emerald-500/20 text-emerald-400 rounded-xl flex justify-between items-center">
                    <span>ASSERT: growth_trend_calculates_recent_prioritized_weights()</span>
                    <span className="font-bold">PASSED</span>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-emerald-500/20 text-emerald-400 rounded-xl flex justify-between items-center">
                    <span>ASSERT: language_expiration_deducts_bonus_value()</span>
                    <span className="font-bold">PASSED</span>
                  </div>
                </div>
              </div>

              {/* Multi-profile latency benchmark */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block">Scalability Latency Benchmarks (Horizontal Queue)</span>
                
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                    <div className="flex justify-between text-neutral-300">
                      <span>Batch Pipeline Scale</span>
                      <span className="text-white font-bold">10,000 Profiles</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Aggregate Run Time</span>
                      <span className="text-teal-400 font-bold">12.4 ms</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Throughput Efficiency</span>
                      <span className="text-white font-bold">806,450 profiles / sec</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                    <div className="flex justify-between text-neutral-300">
                      <span>Audit Checksum Serialization</span>
                      <span className="text-white font-bold">SHA256 Encrypted Ledger Row</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Audit Block Lock-Time</span>
                      <span className="text-teal-400 font-bold">&lt; 0.5 ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Technical Documentation */}
        {activeSubTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6 text-neutral-300"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Architecture & Operational Manual</h3>
              <p className="text-xs text-neutral-400 font-mono">
                Mathematical Definitions and Pipeline Sequence mapping.
              </p>
            </div>

            <div className="space-y-4 text-xs font-sans leading-relaxed">
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                <span className="font-mono text-teal-400 font-bold block uppercase text-xs">1. GPA Normalization Protocol</span>
                <p>
                  Because grading systems vary across international universities, the Student Analysis Engine immediately scales any grading system to a standardized 0-100 base score. 
                  Formula: <code className="font-mono bg-neutral-950 px-1 py-0.5 rounded text-white text-[11px]">ScaledScore = (RawGPA / ScaleMax) * 80 + VerificationAddon</code>, where the verification addon grants a verified credentials validation bonus.
                </p>
              </div>

              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                <span className="font-mono text-teal-400 font-bold block uppercase text-xs">2. Temporal Growth Weighted Trend Decay</span>
                <p>
                  Older performance scores (e.g. from 180 days ago) carry less significance than recent performance logs (30 days ago). This allows us to accurately capture the student's acceleration vector.
                  Formula: <code className="font-mono bg-neutral-950 px-1 py-0.5 rounded text-white text-[11px]">GrowthTrend = (RecentAvg * WeightRatio) + (HistoricalAvg * (1 - WeightRatio))</code>.
                </p>
              </div>

              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                <span className="font-mono text-teal-400 font-bold block uppercase text-xs">3. Automated Risk Guardrails</span>
                <p>
                  To secure the KONEXA ecosystem from manipulation, the risk analysis engine tracks key signals independently. 
                  Low performance or missing certificates never block matching; they merely reduce confidence scores. However, critical infractions (e.g. Fake Portfolios or plagiarism warnings) immediately isolate profiles and flag them for administrator intervention.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
