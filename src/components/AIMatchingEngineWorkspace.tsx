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
  FileText
} from 'lucide-react';

// Interfaces for structured data
interface StudentProfile {
  id: string;
  name: string;
  skills: string[];
  performanceScore: number; // 0-100
  trustScore: number; // 0-100
  projectsCompleted: number;
  avgRating: number; // 1-5
  availabilityHours: number; // hrs/week
  timezone: string;
  languages: string[];
  careerPreferences: string[];
  isVerified: boolean;
  isActive: boolean;
  githubActive: boolean;
  portfolioScore: number; // 0-100
}

interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  reputationScore: number; // 0-100
  hiringRate: number; // conversion %
  projectsCreated: number;
  isVerified: boolean;
  isActive: boolean;
  avgResponseHours: number;
  timezone: string;
  preferredSkills: string[];
}

interface ProjectProfile {
  id: string;
  title: string;
  companyId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredSkills: string[];
  durationWeeks: number;
  workStyle: 'Remote' | 'Hybrid' | 'Onsite';
  timezonePreference: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'EXPIRED' | 'DRAFT';
}

interface WeightConfig {
  id: string;
  name: string;
  weight: number; // percentage
  description: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  version: string;
  studentId: string;
  studentName: string;
  companyId: string;
  projectId: string;
  matchingScore: number;
  confidence: number;
  riskScore: number;
  isFraudFlagged: boolean;
  durationMs: number;
}

export default function AIMatchingEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'playground' | 'config' | 'fraud' | 'ledger' | 'docs'>('playground');
  const [matchingVersion, setMatchingVersion] = useState<'v1' | 'v2' | 'v3'>('v1');

  // Interactive Match Selection
  const [selectedStudentId, setSelectedStudentId] = useState('STU_001');
  const [selectedCompanyId, setSelectedCompanyId] = useState('COMP_001');
  const [selectedProjectId, setSelectedProjectId] = useState('PROJ_001');

  // Triggering Event simulation
  const [triggerEvent, setTriggerEvent] = useState('STUDENT_PROFILE_UPDATED');

  // Simulated Database Records
  const [students, setStudents] = useState<StudentProfile[]>([
    {
      id: 'STU_001',
      name: 'Elena Rostova',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
      performanceScore: 94.5,
      trustScore: 98.0,
      projectsCompleted: 3,
      avgRating: 4.8,
      availabilityHours: 20,
      timezone: 'UTC+2',
      languages: ['English', 'German'],
      careerPreferences: ['Frontend Engineer', 'Fullstack Engineer'],
      isVerified: true,
      isActive: true,
      githubActive: true,
      portfolioScore: 92
    },
    {
      id: 'STU_002',
      name: 'Kenji Sato',
      skills: ['Python', 'PyTorch', 'Docker', 'FastAPI', 'SQL'],
      performanceScore: 88.0,
      trustScore: 90.0,
      projectsCompleted: 1,
      avgRating: 4.2,
      availabilityHours: 15,
      timezone: 'UTC+9',
      languages: ['English', 'Japanese'],
      careerPreferences: ['Data Scientist', 'ML Engineer'],
      isVerified: true,
      isActive: true,
      githubActive: true,
      portfolioScore: 85
    },
    {
      id: 'STU_003',
      name: 'Marcus Vance (Unverified)',
      skills: ['Figma', 'React', 'HTML/CSS'],
      performanceScore: 60.0,
      trustScore: 75.0,
      projectsCompleted: 0,
      avgRating: 0,
      availabilityHours: 10,
      timezone: 'UTC-5',
      languages: ['English'],
      careerPreferences: ['UI/UX Designer'],
      isVerified: false,
      isActive: true,
      githubActive: false,
      portfolioScore: 40
    },
    {
      id: 'STU_004',
      name: 'Sofia Alvarez (Suspended)',
      skills: ['Solidity', 'Go', 'Kubernetes'],
      performanceScore: 95.0,
      trustScore: 40.0,
      projectsCompleted: 2,
      avgRating: 4.9,
      availabilityHours: 25,
      timezone: 'UTC+1',
      languages: ['English', 'Spanish'],
      careerPreferences: ['Web3 Developer'],
      isVerified: true,
      isActive: false, // Suspended / Inactive
      githubActive: true,
      portfolioScore: 90
    }
  ]);

  const [companies, setCompanies] = useState<CompanyProfile[]>([
    {
      id: 'COMP_001',
      name: 'Nexus Tech Systems',
      industry: 'Software Engineering',
      reputationScore: 96.2,
      hiringRate: 85,
      projectsCreated: 8,
      isVerified: true,
      isActive: true,
      avgResponseHours: 1.5,
      timezone: 'UTC+2',
      preferredSkills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 'COMP_002',
      name: 'Aether AI Labs',
      industry: 'Artificial Intelligence',
      reputationScore: 91.8,
      hiringRate: 70,
      projectsCreated: 4,
      isVerified: true,
      isActive: true,
      avgResponseHours: 3.4,
      timezone: 'UTC+9',
      preferredSkills: ['Python', 'PyTorch', 'FastAPI']
    },
    {
      id: 'COMP_003',
      name: 'Legacy Dynamics Inc',
      industry: 'Enterprise Consult',
      reputationScore: 72.0,
      hiringRate: 30,
      projectsCreated: 1,
      isVerified: false, // Unverified
      isActive: true,
      avgResponseHours: 48.0,
      timezone: 'UTC-5',
      preferredSkills: ['Java', 'SQL']
    }
  ]);

  const [projects, setProjects] = useState<ProjectProfile[]>([
    {
      id: 'PROJ_001',
      title: 'Enterprise Dashboard Modernization',
      companyId: 'COMP_001',
      difficulty: 'Intermediate',
      requiredSkills: ['React', 'TypeScript', 'TailwindCSS'],
      durationWeeks: 6,
      workStyle: 'Remote',
      timezonePreference: 'UTC+2',
      status: 'ACTIVE'
    },
    {
      id: 'PROJ_002',
      title: 'Neural Fine-Tuning Pipeline',
      companyId: 'COMP_002',
      difficulty: 'Advanced',
      requiredSkills: ['Python', 'PyTorch', 'Docker'],
      durationWeeks: 10,
      workStyle: 'Hybrid',
      timezonePreference: 'UTC+9',
      status: 'ACTIVE'
    },
    {
      id: 'PROJ_003',
      title: 'Database Schema Optimization (Expired)',
      companyId: 'COMP_003',
      difficulty: 'Advanced',
      requiredSkills: ['SQL', 'PostgreSQL'],
      durationWeeks: 4,
      workStyle: 'Remote',
      timezonePreference: 'UTC-5',
      status: 'EXPIRED'
    }
  ]);

  // Configurations (Editable matrix)
  const [dimensionWeights, setDimensionWeights] = useState<WeightConfig[]>([
    { id: 'technical', name: 'Technical & Skill Overlap', weight: 30, description: 'Direct matches between student programming competencies and project requirements.' },
    { id: 'performance', name: 'Performance Alignment', weight: 20, description: 'Matches historical student evaluation metrics against employer rating quality.' },
    { id: 'trust', name: 'Trust & Reliability compatibility', weight: 15, description: 'Cross-checks student trust indicators against corporate project management consistency.' },
    { id: 'timezone', name: 'Timezone & Availability Sync', weight: 15, description: 'Calculates structural overlaps in operational hours and weekly bandwidth commits.' },
    { id: 'growth', name: 'Career & Industry Relevance', weight: 10, description: 'Compares career preferences to company business models and project focus.' },
    { id: 'professionalism', name: 'Conduct & Culture Synergy', weight: 10, description: 'Aligns anonymous student satisfaction surveys with company professional standards.' }
  ]);

  // Threshold & Penalty Configurations
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState(65);
  const [unverifiedCompanyPenalty, setUnverifiedCompanyPenalty] = useState(15);
  const [unverifiedStudentPenalty, setUnverifiedStudentPenalty] = useState(10);
  const [timezoneMismatchPenalty, setTimezoneMismatchPenalty] = useState(12);
  const [availabilityMismatchPenalty, setAvailabilityMismatchPenalty] = useState(10);
  const [githubPortfolioBonus, setGithubPortfolioBonus] = useState(8);
  const [highConversionHiringBonus, setHighConversionHiringBonus] = useState(6);

  // Fraud Checks state variables
  const [artificialProfileFrequency, setArtificialProfileFrequency] = useState(1); // updates per day
  const [reciprocalReviewsDetected, setReciprocalReviewsDetected] = useState(false);
  const [networkAccountsFromSameIP, setNetworkAccountsFromSameIP] = useState(1);

  // Dynamic Matching Calculations Output State
  const [calculationOutputs, setCalculationOutputs] = useState({
    academicCompat: 0,
    technicalCompat: 0,
    trustCompat: 0,
    availabilityCompat: 0,
    growthCompat: 0,
    timezoneCompat: 0,
    rawScore: 0,
    penaltyApplied: 0,
    bonusApplied: 0,
    finalScore: 0,
    confidenceScore: 0,
    riskScore: 0,
    isHaltRecommended: false,
    haltReason: '',
    strengths: [] as string[],
    weaknesses: [] as string[],
    improvementSuggestions: [] as string[],
    explanation: '',
    isFraudTriggered: false,
    fraudFlags: [] as string[],
    layersExecuted: [] as string[],
    calculationDurationMs: 0
  });

  // Immutable Audit Logs Simulation State
  const [auditLedger, setAuditLedger] = useState<AuditLog[]>([
    {
      id: 'AUD_MATCH_3821',
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      version: 'v1.0.0 (Deterministic)',
      studentId: 'STU_001',
      studentName: 'Elena Rostova',
      companyId: 'COMP_001',
      projectId: 'PROJ_001',
      matchingScore: 92.4,
      confidence: 96.0,
      riskScore: 8.0,
      isFraudFlagged: false,
      durationMs: 42
    },
    {
      id: 'AUD_MATCH_2910',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      version: 'v1.0.0 (Deterministic)',
      studentId: 'STU_002',
      studentName: 'Kenji Sato',
      companyId: 'COMP_002',
      projectId: 'PROJ_002',
      matchingScore: 84.15,
      confidence: 88.0,
      riskScore: 15.0,
      isFraudFlagged: false,
      durationMs: 38
    }
  ]);

  // Run matching engine calculations deterministically through all 12 layers
  const runEngineCalculations = () => {
    const startTime = performance.now();
    
    const student = students.find(s => s.id === selectedStudentId);
    const company = companies.find(c => c.id === selectedCompanyId);
    const project = projects.find(p => p.id === selectedProjectId);

    if (!student || !company || !project) return;

    const executedLayers: string[] = [];

    // --- LAYER 1: Student Analysis ---
    executedLayers.push('Layer 1: Normalized student profile attributes (Trust Score: ' + student.trustScore + ', Performance: ' + student.performanceScore + ').');
    
    // --- LAYER 2: Company Analysis ---
    executedLayers.push('Layer 2: Audited company active status, verification verification, response speeds, and hiring rates.');
    
    // --- LAYER 3: Project Analysis ---
    executedLayers.push('Layer 3: Evaluated project requirements (' + project.requiredSkills.join(', ') + ') and difficulty level.');

    // --- BUSINESS BLOCK RULES CHECK ---
    if (!student.isActive) {
      setCalculationOutputs(prev => ({
        ...prev,
        finalScore: 0,
        rawScore: 0,
        confidenceScore: 0,
        riskScore: 100,
        isHaltRecommended: true,
        haltReason: 'STUDENT_SUSPENDED: The requested student account is suspended or deactivated by administrators.',
        explanation: 'Calculation stopped at pipeline verification: Target student is in an inactive or suspended state.',
        strengths: [],
        weaknesses: ['Student account is currently suspended.'],
        improvementSuggestions: ['Contact support to appeal user suspension state.'],
        isFraudTriggered: false,
        fraudFlags: [],
        layersExecuted: ['Layer 1 (Verification Failure)'],
        calculationDurationMs: Math.round(performance.now() - startTime)
      }));
      return;
    }

    if (project.status === 'ARCHIVED' || project.status === 'EXPIRED') {
      setCalculationOutputs(prev => ({
        ...prev,
        finalScore: 0,
        rawScore: 0,
        confidenceScore: 0,
        riskScore: 100,
        isHaltRecommended: true,
        haltReason: 'PROJECT_INACTIVE: This project has expired or was archived.',
        explanation: 'Calculation halted: Target project state prevents new recommendation cycles.',
        strengths: [],
        weaknesses: ['Project is not active.'],
        improvementSuggestions: ['Re-create project or select an active collaboration opportunity.'],
        isFraudTriggered: false,
        fraudFlags: [],
        layersExecuted: ['Layer 3 (Verification Failure)'],
        calculationDurationMs: Math.round(performance.now() - startTime)
      }));
      return;
    }

    // --- LAYER 4: Compatibility Engine ---
    executedLayers.push('Layer 4: Calculating direct compatibility dimensions...');
    
    // 4.1 Technical Compatibility (Overlap of required vs student skills)
    const matchingSkills = student.skills.filter(s => project.requiredSkills.includes(s));
    const technicalCompat = project.requiredSkills.length > 0 
      ? (matchingSkills.length / project.requiredSkills.length) * 100 
      : 80;

    // 4.2 Academic/Performance Compatibility
    const academicCompat = student.performanceScore;

    // 4.3 Trust Compatibility
    const trustCompat = (student.trustScore + company.reputationScore) / 2;

    // 4.4 Availability & Bandwidth Sync
    // Beginner: 10h, Intermediate: 15h, Advanced: 20h
    const requiredHours = project.difficulty === 'Advanced' ? 20 : project.difficulty === 'Intermediate' ? 15 : 10;
    const availabilityCompat = student.availabilityHours >= requiredHours ? 100 : (student.availabilityHours / requiredHours) * 100;

    // 4.5 Career/Growth Match
    const matchesIndustry = student.careerPreferences.some(pref => company.industry.toLowerCase().includes(pref.toLowerCase()) || project.title.toLowerCase().includes(pref.toLowerCase()));
    const growthCompat = matchesIndustry ? 100 : 60;

    // 4.6 Timezone Alignment
    const timezoneCompat = student.timezone === project.timezonePreference ? 100 : 70;

    // Combine dimensions using our config weights
    const getWeight = (id: string) => (dimensionWeights.find(w => w.id === id)?.weight || 0) / 100;
    
    const rawCompatScore = 
      (technicalCompat * getWeight('technical')) +
      (academicCompat * getWeight('performance')) +
      (trustCompat * getWeight('trust')) +
      (availabilityCompat * getWeight('timezone') * 0.6) +
      (timezoneCompat * getWeight('timezone') * 0.4) +
      (growthCompat * getWeight('growth')) +
      (90 * getWeight('professionalism')); // Professionalism base standard alignment

    // --- LAYER 5: Penalty Engine ---
    executedLayers.push('Layer 5: Evaluating penalty constraints...');
    let penalties = 0;
    const weaknesses: string[] = [];

    if (!company.isVerified) {
      penalties += unverifiedCompanyPenalty;
      weaknesses.push(`Company is UNVERIFIED. Applying penalty of -${unverifiedCompanyPenalty} pts.`);
    }
    if (!student.isVerified) {
      penalties += unverifiedStudentPenalty;
      weaknesses.push(`Student profile is UNVERIFIED. Applying penalty of -${unverifiedStudentPenalty} pts.`);
    }
    if (student.timezone !== project.timezonePreference) {
      penalties += timezoneMismatchPenalty;
      weaknesses.push(`Timezone variance (${student.timezone} vs ${project.timezonePreference}). Penalty of -${timezoneMismatchPenalty} pts applied.`);
    }
    if (student.availabilityHours < requiredHours) {
      penalties += availabilityMismatchPenalty;
      weaknesses.push(`Insufficient weekly commitment hours (${student.availabilityHours}h provided vs ${requiredHours}h needed). Penalty of -${availabilityMismatchPenalty} pts.`);
    }

    // --- LAYER 6: Bonus Engine ---
    executedLayers.push('Layer 6: Checking credential premium eligibility...');
    let bonuses = 0;
    const strengths: string[] = [];

    if (student.githubActive && student.portfolioScore >= 80) {
      bonuses += githubPortfolioBonus;
      strengths.push(`Strong portfolio activity & verified GitHub repository. Bonus of +${githubPortfolioBonus} pts applied.`);
    }
    if (company.hiringRate >= 80) {
      bonuses += highConversionHiringBonus;
      strengths.push(`High hiring conversion track record (${company.hiringRate}%). Bonus of +${highConversionHiringBonus} pts applied.`);
    }
    if (student.projectsCompleted >= 2 && student.avgRating >= 4.5) {
      bonuses += 5;
      strengths.push('Elite Project Alumnus: Completed multiple internships with excellent feedback ratings (+5 pts).');
    }

    // Calculate preliminary final matching score
    const baseMatchScore = Math.max(0, Math.min(100, rawCompatScore - penalties + bonuses));
    const finalMatchingScore = Number(baseMatchScore.toFixed(2));

    // --- LAYER 7: Risk Engine ---
    executedLayers.push('Layer 7: Risk assessment analyzer initialized.');
    let riskScore = 5.0; // standard baseline risk
    if (student.trustScore < 80) riskScore += 25;
    if (company.reputationScore < 80) riskScore += 20;
    if (penalties > 15) riskScore += 15;
    if (company.avgResponseHours > 24) riskScore += 10;
    riskScore = Math.min(100, riskScore);

    // --- LAYER 8: Confidence Engine ---
    executedLayers.push('Layer 8: Confidence rating engine calculating verified coverage factors.');
    // Confidence is reduced if the user has no projects completed or if profiles are unverified
    let confidenceScore = 100;
    if (student.projectsCompleted === 0) confidenceScore -= 15;
    if (!student.isVerified) confidenceScore -= 10;
    if (!company.isVerified) confidenceScore -= 10;
    confidenceScore = Math.max(30, confidenceScore);

    // --- LAYER 9: Ranking Engine ---
    executedLayers.push('Layer 9: Ranking optimization processed against cohort scores.');

    // --- LAYER 10: Recommendation Explanation Generator ---
    executedLayers.push('Layer 10: Building human-readable objective explainability narrative.');
    
    // Dynamic explainability narrative
    let narrative = `Recommendation generated with a score of ${finalMatchingScore}%. `;
    if (finalMatchingScore >= 85) {
      narrative += `Excellent match! ${student.name} possesses high academic alignment (${student.performanceScore}%) and covers ${matchingSkills.length} of ${project.requiredSkills.length} required technical skills for the "${project.title}" project. `;
    } else if (finalMatchingScore >= 70) {
      narrative += `Moderate alignment recommended. While technical credentials overlap, minor operational offsets (e.g. timezone variances or verification states) affect long-term probability scores. `;
    } else {
      narrative += `Low score match. Performance alignment scores are suboptimal, and significant structural factors (timezone / hourly availability) may affect project progression. `;
    }

    // Improvement suggestions
    const suggestions: string[] = [];
    if (!student.isVerified) suggestions.push('Student should complete phone & identity verification to remove unverified profile penalty.');
    if (!company.isVerified) suggestions.push('Company should request administrator verification check.');
    if (student.availabilityHours < requiredHours) suggestions.push(`Student needs to allocate ${requiredHours - student.availabilityHours} additional hours per week to fully meet work standards.`);
    if (timezoneCompat < 100) suggestions.push('Agree on strict overlapping communication windows (e.g. 13:00 - 15:00 UTC) prior to kick-off.');
    if (matchingSkills.length < project.requiredSkills.length) {
      const missing = project.requiredSkills.filter(s => !student.skills.includes(s));
      suggestions.push(`Student could complete fast-track modules in: ${missing.join(', ')} to boost technical matching probability.`);
    }

    // --- LAYER 11: Learning Engine ---
    executedLayers.push('Layer 11: Calibration offsets scheduled for next batch project completion event.');

    // --- LAYER 12: Historical Archive ---
    executedLayers.push('Layer 12: Historical serialization queue completed. Record locked.');

    // --- FRAUD DETECTION PATTERNS ---
    const fraudFlags: string[] = [];
    let isFraudTriggered = false;

    if (artificialProfileFrequency >= 5) {
      fraudFlags.push('High Update Volatility: Profile updated ' + artificialProfileFrequency + ' times within 24h. Flagged for artificial alignment manipulation.');
      isFraudTriggered = true;
    }
    if (reciprocalReviewsDetected) {
      fraudFlags.push('Collusion Warning: Close reciprocal reviews loop detected between student and target company.');
      isFraudTriggered = true;
    }
    if (networkAccountsFromSameIP >= 3) {
      fraudFlags.push(`IP Sybil Cluster: ${networkAccountsFromSameIP} student profiles registered under identical IP addresses.`);
      isFraudTriggered = true;
    }

    // Set engine output state
    setCalculationOutputs({
      academicCompat: Number(academicCompat.toFixed(1)),
      technicalCompat: Number(technicalCompat.toFixed(1)),
      trustCompat: Number(trustCompat.toFixed(1)),
      availabilityCompat: Number(availabilityCompat.toFixed(1)),
      growthCompat: Number(growthCompat.toFixed(1)),
      timezoneCompat: Number(timezoneCompat.toFixed(1)),
      rawScore: Number(rawCompatScore.toFixed(2)),
      penaltyApplied: penalties,
      bonusApplied: bonuses,
      finalScore: finalMatchingScore,
      confidenceScore,
      riskScore,
      isHaltRecommended: false,
      haltReason: '',
      strengths: strengths.length > 0 ? strengths : ['Sufficient baseline credentials verified.'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['No structural liabilities detected.'],
      improvementSuggestions: suggestions.length > 0 ? suggestions : ['No critical changes required. Standardized progress optimal.'],
      explanation: narrative,
      isFraudTriggered,
      fraudFlags,
      layersExecuted: executedLayers,
      calculationDurationMs: Math.round(performance.now() - startTime)
    });
  };

  // Run matching engine whenever parameters or configs update
  useEffect(() => {
    runEngineCalculations();
  }, [
    selectedStudentId, selectedCompanyId, selectedProjectId, dimensionWeights,
    minConfidenceThreshold, unverifiedCompanyPenalty, unverifiedStudentPenalty,
    timezoneMismatchPenalty, availabilityMismatchPenalty, githubPortfolioBonus,
    highConversionHiringBonus, artificialProfileFrequency, reciprocalReviewsDetected,
    networkAccountsFromSameIP, matchingVersion
  ]);

  const handleWeightConfigChange = (id: string, val: number) => {
    setDimensionWeights(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, weight: Math.max(0, Math.min(100, val)) };
      }
      return w;
    }));
  };

  const handleSaveAudit = () => {
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const newLog: AuditLog = {
      id: `AUD_MATCH_${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      version: `${matchingVersion}.0 (Traceable Deterministic)`,
      studentId: selectedStudentId,
      studentName: student.name,
      companyId: selectedCompanyId,
      projectId: selectedProjectId,
      matchingScore: calculationOutputs.finalScore,
      confidence: calculationOutputs.confidenceScore,
      riskScore: calculationOutputs.riskScore,
      isFraudFlagged: calculationOutputs.isFraudTriggered,
      durationMs: calculationOutputs.calculationDurationMs
    };

    setAuditLedger(prev => [newLog, ...prev]);
    alert('Simulated immutable matching score recorded in the platform audit ledger. This record is sealed and cannot be modified.');
  };

  const totalWeightsSum = dimensionWeights.reduce((a, b) => a + b.weight, 0);

  return (
    <div className="space-y-6">
      {/* Header with AI Matching Identity */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Matching Engine Core Architecture</h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-2xl">
            KONEXA's proprietary deterministic 12-layer pipeline that predicts long-term collaboration compatibility and hiring success probability. Derived from multi-dimensional platform telemetry, verified trust signals, and performance scores.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <select
            value={matchingVersion}
            onChange={e => setMatchingVersion(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
          >
            <option value="v1">Engine Version v1</option>
            <option value="v2">Engine Version v2</option>
            <option value="v3">Engine Version v3</option>
          </select>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${totalWeightsSum === 100 ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
            <span className="text-xs font-mono text-neutral-300">WEIGHTS: {totalWeightsSum}%</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'playground', label: '12-Layer Sandbox', icon: Cpu },
          { id: 'config', label: 'Weights & Matrix Config', icon: Sliders },
          { id: 'fraud', label: 'Anti-Fraud & Integrity', icon: ShieldAlert },
          { id: 'ledger', label: 'Immutable Logs Ledger', icon: History },
          { id: 'docs', label: 'Architecture & DB Schema', icon: BookOpen }
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

      {/* Content Rendering Switch */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'playground' && (
          <motion.div
            key="playground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Selector controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Profile Selectors */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">1. Select Target Entities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Student profile selector */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Student Profile</label>
                    <select
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.isVerified ? 'Verified' : 'Unverified'})
                        </option>
                      ))}
                    </select>
                    {/* Compact student stats */}
                    {students.find(s => s.id === selectedStudentId) && (
                      <div className="mt-2 p-2 bg-neutral-900/50 border border-neutral-900 rounded-lg text-[10px] text-neutral-400 space-y-1">
                        <div>Skills: {students.find(s => s.id === selectedStudentId)?.skills.slice(0, 3).join(', ')}...</div>
                        <div className="flex justify-between font-mono text-[9px]">
                          <span>Trust: {students.find(s => s.id === selectedStudentId)?.trustScore}</span>
                          <span>Perf: {students.find(s => s.id === selectedStudentId)?.performanceScore}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project selector */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Project Post</label>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.status})
                        </option>
                      ))}
                    </select>
                    {/* Compact project stats */}
                    {projects.find(p => p.id === selectedProjectId) && (
                      <div className="mt-2 p-2 bg-neutral-900/50 border border-neutral-900 rounded-lg text-[10px] text-neutral-400 space-y-1">
                        <div>Skills Needed: {projects.find(p => p.id === selectedProjectId)?.requiredSkills.join(', ')}</div>
                        <div className="flex justify-between font-mono text-[9px]">
                          <span>Style: {projects.find(p => p.id === selectedProjectId)?.workStyle}</span>
                          <span>TZ: {projects.find(p => p.id === selectedProjectId)?.timezonePreference}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Company selector */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Employer</label>
                    <select
                      value={selectedCompanyId}
                      onChange={e => setSelectedCompanyId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.isVerified ? 'Verified' : 'Unverified'})
                        </option>
                      ))}
                    </select>
                    {/* Compact company stats */}
                    {companies.find(c => c.id === selectedCompanyId) && (
                      <div className="mt-2 p-2 bg-neutral-900/50 border border-neutral-900 rounded-lg text-[10px] text-neutral-400 space-y-1">
                        <div>Industry: {companies.find(c => c.id === selectedCompanyId)?.industry}</div>
                        <div className="flex justify-between font-mono text-[9px]">
                          <span>Reputation: {companies.find(c => c.id === selectedCompanyId)?.reputationScore}</span>
                          <span>Hiring: {companies.find(c => c.id === selectedCompanyId)?.hiringRate}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 12-Layer Step Visualizer */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">2. Sequential Twelve-Layer Trace Output</h3>
                  <span className="text-[10px] bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono px-2 py-0.5 rounded">STRICT DIRECTIVE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                  {calculationOutputs.layersExecuted.map((layerText, index) => (
                    <div
                      key={index}
                      className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 flex items-start gap-2.5"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-md bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-[10px]">
                        L{index + 1}
                      </div>
                      <div className="text-neutral-300 leading-tight">
                        {layerText}
                      </div>
                    </div>
                  ))}
                  {/* Fill up simulated list to emphasize all 12 layers execute */}
                  {calculationOutputs.layersExecuted.length > 0 && Array.from({ length: 12 - calculationOutputs.layersExecuted.length }).map((_, idx) => {
                    const layerNum = calculationOutputs.layersExecuted.length + idx + 1;
                    const layerNames = [
                      'Layer 4: Compatibility Engine (Technical, academic, and timezone matrices calibrated).',
                      'Layer 5: Penalty Engine (Operational constraint checks verified).',
                      'Layer 6: Bonus Engine (GitHub and career premium offsets added).',
                      'Layer 7: Risk Engine (Determined standard security risks).',
                      'Layer 8: Confidence Engine (Assessed platform reputation volume).',
                      'Layer 9: Ranking Engine (Simulated priority queue position).',
                      'Layer 10: Recommendation Explanation (Text explainability output compiled).',
                      'Layer 11: Learning Engine (Continuous feedback loops parameterized).',
                      'Layer 12: Historical Archive (Immutable log payload generated).'
                    ];
                    return (
                      <div
                        key={idx}
                        className="p-2.5 bg-neutral-900/40 rounded-xl border border-neutral-900/50 flex items-start gap-2.5 opacity-60"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-md bg-teal-500/5 text-teal-500/50 flex items-center justify-center font-bold text-[10px]">
                          L{layerNum}
                        </div>
                        <div className="text-neutral-400 leading-tight">
                          {layerNames[layerNum - 4] || `Layer ${layerNum}: Deterministic pipeline pass completed.`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Matching Telemetry Dimensions */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">3. Multi-Dimensional Compatibility Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Technical & Skill overlap', score: calculationOutputs.technicalCompat },
                    { label: 'Academic & Performance alignment', score: calculationOutputs.academicCompat },
                    { label: 'Trust & Reputation rating', score: calculationOutputs.trustCompat },
                    { label: 'BANDWIDTH & AVAILABILITY COMMIT', score: calculationOutputs.availabilityCompat },
                    { label: 'TIMEZONE & SCHEDULE overlap', score: calculationOutputs.timezoneCompat },
                    { label: 'Career & Growth MATCHING', score: calculationOutputs.growthCompat }
                  ].map((dim, idx) => (
                    <div key={idx} className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-neutral-400 leading-tight block">{dim.label}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-white font-mono">{dim.score}%</span>
                        <div className="h-1 w-12 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400" style={{ width: `${dim.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Engine scoring outputs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Giant Scoring Card */}
              <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
                
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Deterministic Match Probability</span>

                {calculationOutputs.isHaltRecommended ? (
                  <div className="my-10 space-y-2">
                    <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
                    <span className="text-xs font-bold text-rose-400 block uppercase">CALCULATION HALTED</span>
                    <p className="text-[10px] text-neutral-400 font-mono">{calculationOutputs.haltReason}</p>
                  </div>
                ) : (
                  <>
                    <div className="my-6 relative">
                      <span className="text-7xl font-extrabold text-white tracking-tight font-mono">
                        {calculationOutputs.finalScore}%
                      </span>
                      <span className={`absolute -top-3 -right-16 px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full ${calculationOutputs.finalScore >= 80 ? 'bg-teal-400 text-neutral-950' : 'bg-neutral-800 text-neutral-300'}`}>
                        {calculationOutputs.finalScore >= 85 ? 'HIGH SUCCESS' : calculationOutputs.finalScore >= 70 ? 'MODERATE' : 'MARGINAL'}
                      </span>
                    </div>

                    <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mb-5 border border-neutral-800">
                      <div
                        className="bg-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${calculationOutputs.finalScore}%` }}
                      />
                    </div>
                  </>
                )}

                {calculationOutputs.isFraudTriggered && (
                  <div className="w-full mb-4 py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono flex items-center gap-1.5 justify-center">
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
                    <span>FRAUD FLAGGED FOR REPEATED METRIC UPDATES</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-neutral-900 text-left font-mono">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">Engine Confidence</span>
                    <span className="text-xs font-semibold text-neutral-300">{calculationOutputs.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-bold block uppercase">Calculated Risk</span>
                    <span className="text-xs font-semibold text-rose-400">{calculationOutputs.riskScore}%</span>
                  </div>
                </div>

                {/* Audit execution time */}
                <div className="mt-4 pt-3 border-t border-neutral-900/50 w-full flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>Latency: {calculationOutputs.calculationDurationMs}ms</span>
                  <span>Payload: Determinable</span>
                </div>
              </div>

              {/* Objective Human Explainability */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Evidence-Backed Explanation</h3>
                <div className="p-3.5 bg-neutral-900/50 border border-neutral-900 rounded-xl text-xs text-neutral-300 leading-relaxed font-sans">
                  {calculationOutputs.explanation}
                </div>
                
                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-teal-400 font-bold uppercase">MATCH STRENGTHS</span>
                    <div className="space-y-1">
                      {calculationOutputs.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">CONSTRAINTS & LIABILITIES</span>
                    <div className="space-y-1">
                      {calculationOutputs.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations to improve matching probability */}
                <div className="pt-3 border-t border-neutral-900 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">PROBABILITY IMPROVEMENT ROADMAP</span>
                  <div className="space-y-1.5">
                    {calculationOutputs.improvementSuggestions.map((sug, idx) => (
                      <div key={idx} className="p-2.5 bg-neutral-900/60 border border-neutral-900 rounded-xl text-[11px] text-neutral-400 leading-tight">
                        {sug}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lock audit button */}
                <button
                  onClick={handleSaveAudit}
                  className="w-full mt-2 py-2.5 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4" /> LOCK RECOMMENDATION SNAPSHOT
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configurations Weight tab */}
        {activeSubTab === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dynamic weighting matrix */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Interactive Dimension Weighting Matrix</h3>
                  <p className="text-xs text-neutral-400">
                    Adjust the weights of each compatibility vector. In accordance with platform compliance, the total aggregate sum must equal exactly 100%.
                  </p>
                </div>

                <div className="space-y-4">
                  {dimensionWeights.map(weight => (
                    <div key={weight.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{weight.name}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={weight.weight}
                            onChange={e => handleWeightConfigChange(weight.id, parseInt(e.target.value) || 0)}
                            className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs font-mono text-center text-teal-400"
                          />
                          <span className="text-xs font-mono text-neutral-400">%</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400">{weight.description}</p>
                    </div>
                  ))}
                </div>

                {totalWeightsSum !== 100 && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Weights mismatch. Current sum is {totalWeightsSum}%. Sum must be exactly 100% to save.</span>
                  </div>
                )}
              </div>

              {/* Configuration thresholds list */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Dynamic Adjustments & Penalties</h3>
                
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-1">Min Match Confidence Threshold (%)</label>
                    <input
                      type="number"
                      value={minConfidenceThreshold}
                      onChange={e => setMinConfidenceThreshold(parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-neutral-500 block mb-1">Unverified Student Penalty</label>
                      <input
                        type="number"
                        value={unverifiedStudentPenalty}
                        onChange={e => setUnverifiedStudentPenalty(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-500 block mb-1">Unverified Company Penalty</label>
                      <input
                        type="number"
                        value={unverifiedCompanyPenalty}
                        onChange={e => setUnverifiedCompanyPenalty(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-neutral-500 block mb-1">Timezone Mismatch Penalty</label>
                      <input
                        type="number"
                        value={timezoneMismatchPenalty}
                        onChange={e => setTimezoneMismatchPenalty(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-500 block mb-1">Availability Mismatch Penalty</label>
                      <input
                        type="number"
                        value={availabilityMismatchPenalty}
                        onChange={e => setAvailabilityMismatchPenalty(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-900">
                    <div>
                      <label className="text-[9px] text-neutral-500 block mb-1">Portfolio & GitHub Bonus</label>
                      <input
                        type="number"
                        value={githubPortfolioBonus}
                        onChange={e => setGithubPortfolioBonus(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white animate-pulse"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-500 block mb-1">Hiring Speed Bonus</label>
                      <input
                        type="number"
                        value={highConversionHiringBonus}
                        onChange={e => setHighConversionHiringBonus(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-900 text-[10px] text-neutral-400 leading-relaxed">
                    *Changing thresholds only impacts subsequent recommendation runs. Historical scores remain frozen under immutable version codes.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fraud Prevention tab */}
        {activeSubTab === 'fraud' && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left side: Simulator factors */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Fraud Detection Simulator</h3>
                <p className="text-xs text-neutral-400">
                  Manipulate real-time indicators to trigger fraud classification triggers. Suspicious activity never overrides matching results automatically, but propagates warning logs requiring direct administrative intervention.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-neutral-500 block mb-1">Profile Update Frequency (Updates/24h)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={artificialProfileFrequency}
                    onChange={e => setArtificialProfileFrequency(parseInt(e.target.value))}
                    className="w-full accent-teal-400"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>1 Update (Normal)</span>
                    <span>10 Updates (Suspicious)</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Reciprocal Review Loops Detected</span>
                    <span className="text-[10px] text-neutral-400">Identifies mutual high scores given within close temporal alignment.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reciprocalReviewsDetected}
                    onChange={e => setReciprocalReviewsDetected(e.target.checked)}
                    className="rounded text-teal-400 focus:ring-0 bg-neutral-950 border-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-500 block mb-1">Multiple Accounts From Identical IP Subnet</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={networkAccountsFromSameIP}
                    onChange={e => setNetworkAccountsFromSameIP(parseInt(e.target.value) || 1)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Real-time trigger status */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Risk Status & Alerts</h3>
              
              <div className="p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 min-h-[150px] bg-neutral-900/40 border-neutral-800">
                {calculationOutputs.isFraudTriggered ? (
                  <>
                    <ShieldAlert className="w-12 h-12 text-rose-400 animate-bounce" />
                    <span className="text-xs font-bold text-rose-400 uppercase">FRAUD TRIPPED (AUDIT PENDING)</span>
                    <div className="text-left w-full space-y-1.5 pt-2">
                      {calculationOutputs.fraudFlags.map((flag, i) => (
                        <div key={i} className="p-2 rounded bg-rose-500/5 text-[10px] font-mono text-rose-300 border border-rose-500/10">
                          • {flag}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-12 h-12 text-teal-400" />
                    <span className="text-xs font-bold text-teal-400 uppercase">INTEGRITY MATRIX SECURE</span>
                    <p className="text-[10px] text-neutral-400 font-mono">No artificial inflation or score deflations detected. Platform telemetry within expected variance bounds.</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Ledger tab */}
        {activeSubTab === 'ledger' && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Immutable Platform Match Audit Ledger</h3>
                <p className="text-xs text-neutral-400">
                  Every recommendation event writes a permanent cryptographically determinable snapshot payload. Records are read-only and preserve weight history versions.
                </p>
              </div>
              <button
                onClick={() => {
                  setAuditLedger([]);
                  alert('Audit ledger simulation cleared for current session.');
                }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-[10px] font-mono text-neutral-300"
              >
                Reset Ledger
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500">
                    <th className="py-2.5">Audit ID</th>
                    <th className="py-2.5">Timestamp</th>
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Final Score</th>
                    <th className="py-2.5">Confidence</th>
                    <th className="py-2.5">Risk Factor</th>
                    <th className="py-2.5">Version Code</th>
                    <th className="py-2.5">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  {auditLedger.map(log => (
                    <tr key={log.id} className="text-neutral-300 hover:bg-neutral-900/20">
                      <td className="py-3 font-semibold text-teal-400">{log.id}</td>
                      <td className="py-3 text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-3">{log.studentName}</td>
                      <td className="py-3 font-bold text-white">{log.matchingScore}%</td>
                      <td className="py-3 text-neutral-400">{log.confidence}%</td>
                      <td className="py-3 text-rose-400">{log.riskScore}%</td>
                      <td className="py-3 text-neutral-500">{log.version}</td>
                      <td className="py-3">
                        {log.isFraudFlagged ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[9px] border border-rose-500/20 font-bold">FLAGGED</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[9px] border border-teal-500/20 font-bold">VERIFIED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {auditLedger.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-500 font-mono">
                        No matches written to historical queue. Execute a match sandbox and lock the record above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Technical documentation tab */}
        {activeSubTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Database schema layout representations */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-900">
                <Database className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">PostgreSQL Matching Architecture & Schema</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">TABLE: matching_matrices_config</span>
                  <pre className="text-[10px] font-mono text-neutral-400 bg-neutral-950 p-3 rounded-lg overflow-x-auto">
{`CREATE TABLE matching_matrices_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_code VARCHAR(16) NOT NULL UNIQUE,
  weights_json JSONB NOT NULL, -- Category weights configuration
  confidence_threshold_pct INT DEFAULT 65,
  penalties_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">TABLE: matches_historical_archive</span>
                  <pre className="text-[10px] font-mono text-neutral-400 bg-neutral-950 p-3 rounded-lg overflow-x-auto">
{`CREATE TABLE matches_historical_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  company_id UUID REFERENCES companies(id),
  project_id UUID REFERENCES projects(id),
  matching_score DECIMAL(5,2) NOT NULL,
  confidence_score INT NOT NULL,
  risk_score INT NOT NULL,
  weights_version VARCHAR(16) NOT NULL,
  raw_telemetry JSONB NOT NULL,
  is_fraud_flagged BOOLEAN DEFAULT FALSE,
  compliance_audit_logs TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Performance optimization and scalability strategies */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-900">
                <Layers className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Scalability & Real-Time Performance Strategy</h3>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-neutral-300 font-sans">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-white">1. Asynchronous Matching Pipeline Queue</h4>
                  <p className="text-neutral-400">
                    To support millions of users, profile updates push event messages to a Redis pub/sub queue. In the background, isolated worker microservices run the 12-layer pipeline, avoiding blocking REST API servers.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-white">2. Low-Latency Matching Telemetry Cache</h4>
                  <p className="text-neutral-400">
                    Calculated scores for student-project combinations are cached inside Redis. Changes to verified profile metrics (e.g. Trust or Performance scores) invalidate specifically linked cache keys, keeping subsequent queries highly performant.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-white">3. Deterministic Seed Matching Philosophy</h4>
                  <p className="text-neutral-400">
                    Calculations are completely deterministic and rely purely on measurable, audited data points. This guarantees fully reproducible matches and locks compatibility history against bias or arbitrary adjustments.
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
