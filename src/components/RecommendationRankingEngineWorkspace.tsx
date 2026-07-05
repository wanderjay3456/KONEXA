import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Award,
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
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  ListOrdered,
  Eye,
  Shuffle
} from 'lucide-react';

// Definitions for the Recommendation Ranking Engine Configuration
interface RankingFactorConfig {
  id: string;
  name: string;
  weight: number; // percentage (sums to 100)
  description: string;
}

interface PenaltyConfig {
  id: string;
  name: string;
  value: number; // percentage penalty
  enabled: boolean;
  description: string;
}

interface BonusConfig {
  id: string;
  name: string;
  value: number; // percentage bonus
  enabled: boolean;
  description: string;
}

interface RankingCandidate {
  id: string;
  name: string;
  avatar: string;
  matchingScore: number; // 0-100
  confidenceScore: number; // 0-100
  experienceYears: number;
  completedProjectsCount: number;
  applicationTimestamp: string; // ISO format

  // Eligibility check criteria
  isSuspended: boolean;
  isProfileComplete: boolean;
  isIdentityVerified: boolean;
  isAvailable: boolean;
  hasCapacityExceeded: boolean;
  country: string;
  hasVisaRestriction: boolean;
  englishLevel: number; // 0-100

  // Hard filter criteria
  hasRequiredSkill: boolean;
  hasRequiredLanguage: boolean;
  performanceScore: number; // 0-100
  trustScore: number; // 0-100
  hasMandatoryCertification: boolean;
  hasMandatoryPortfolio: boolean;

  // Performance/Trust Trends
  performanceTrend: 'Improving' | 'Stable' | 'Declining';
  trustTrend: 'Improving' | 'Stable' | 'Declining';
  growthTrendScore: number; // 0-100
  daysSinceLastActivity: number;

  // Preferences
  preferredIndustry: string;
  expectedSalary: number;
  remotePreference: 'Remote' | 'Hybrid' | 'Onsite';

  // Individual bonus & penalty flags
  hasPerfectPerformance: boolean;
  hasPerfectTrust: boolean;
  hasRecentPromotion: boolean;
  hasOutstandingPortfolio: boolean;
  hasRelevantInternship: boolean;
  hasResearchPublication: boolean;
  hasOSContribution: boolean;
  hasRecentHackathonWinner: boolean;
  hasVerifiedCertification: boolean;

  hasRecentWarning: boolean;
  hasExpiredResume: boolean;
  hasOldPortfolio: boolean;
  hasRepeatedDeadlineFailure: boolean;
  isUnderFraudInvestigation: boolean;
  hasRepeatedWithdrawal: boolean;
}

interface RankingOutput {
  candidateId: string;
  name: string;
  baseRank: number;
  finalRank: number;
  rankChange: number; // positive = moved up, negative = moved down
  matchingScore: number;
  confidenceScore: number;
  compositeRankingScore: number;
  status: 'Eligible' | 'Rejected';
  rejectionReason?: string;
  appliedBonuses: { name: string; value: number }[];
  appliedPenalties: { name: string; value: number }[];
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  missingRequirements: string[];
  suggestions: string[];
}

interface RankingResultLog {
  id: string;
  timestamp: string;
  projectId: string;
  candidatesCount: number;
  rejectedCount: number;
  durationMs: number;
  rankings: RankingOutput[];
  factorsApplied: Record<string, number>;
  pipelineSteps: string[];
  version: string;
}

export default function RecommendationRankingEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'weights' | 'penalties' | 'logs' | 'docs'>('sandbox');
  const [engineVersion, setEngineVersion] = useState<'v1' | 'v2' | 'v3'>('v1');
  const [selectedProjectId, setSelectedProjectId] = useState('PROJ_RANK_01');

  // Multi-pass personalization parameters
  const [companyPreferredMajor, setCompanyPreferredMajor] = useState('Computer Science');
  const [companyPreferredCountry, setCompanyPreferredCountry] = useState('Vietnam');
  const [projectMandatoryLanguage, setProjectMandatoryLanguage] = useState(80);
  const [projectMandatoryTrust, setProjectMandatoryTrust] = useState(70);

  // 10 Core Ranking Factors summing to 100%
  const [rankingFactors, setRankingFactors] = useState<RankingFactorConfig[]>([
    { id: 'confidence', name: 'Recommendation Confidence', weight: 20, description: 'Direct weight of recommendation certainty (Multiplier adjusted).' },
    { id: 'matchScore', name: 'Matching Score Baseline', weight: 35, description: 'Weight of computed structural compatibility percentage.' },
    { id: 'perfTrend', name: 'Performance Stability Trend', weight: 10, description: 'Longitudinal variance and trajectory of ratings.' },
    { id: 'trustTrend', name: 'Trust Vector Trend', weight: 10, description: 'History of warnings, KYC verifications, and compliance logs.' },
    { id: 'growth', name: 'Growth Potential Index', weight: 5, description: 'Assessment of learning speed and milestone progression.' },
    { id: 'availability', name: 'Availability Match', weight: 5, description: 'Workload overlap and schedule convenience.' },
    { id: 'activity', name: 'Recent Platform Activity', weight: 5, description: 'Dynamic login, portfolio modifications, and resume synchronization.' },
    { id: 'success', name: 'Historical Completion Success', weight: 5, description: 'Total volume of projects completed without warning triggers.' },
    { id: 'employerPref', name: 'Employer Affinity Preference', weight: 3, description: 'Custom alignment with employer secondary targets.' },
    { id: 'studentPref', name: 'Student Career Fit Preference', weight: 2, description: 'Individual career trajectory, salary, and style align.' }
  ]);

  // Configurable Penalties
  const [penalties, setPenalties] = useState<PenaltyConfig[]>([
    { id: 'profileIncomplete', name: 'Profile Incomplete Penalty', value: 5, enabled: true, description: 'Deducted if basic developer features are missing' },
    { id: 'repeatedWithdrawal', name: 'Repeated Project Withdrawal', value: 8, enabled: true, description: 'Deducted if candidate historically dropped active assignments' },
    { id: 'recentWarning', name: 'Recent Warning Penalty', value: 5, enabled: true, description: 'Deducted if ledger shows recent behavior warnings' },
    { id: 'lowActivity', name: 'Low Activity Status', value: 4, enabled: true, description: 'Deducted if inactive on the platform for over 30 days' },
    { id: 'expiredResume', name: 'Expired Resume File', value: 2, enabled: true, description: 'Deducted if resume is older than 180 days' },
    { id: 'oldPortfolio', name: 'Outdated Portfolio', value: 2, enabled: true, description: 'Deducted if portfolio lacks modification over 180 days' },
    { id: 'repeatedDeadlineFailure', name: 'Repeated Deadline Failure', value: 10, enabled: true, description: 'Deducted if user missed project deliverables repeatedly' },
    { id: 'fraudInvestigation', name: 'Fraud Investigation Lock', value: 100, enabled: true, description: 'Critical penalty - completely rejects candidate from pool' }
  ]);

  // Configurable Bonuses
  const [bonuses, setBonuses] = useState<BonusConfig[]>([
    { id: 'perfectPerformance', name: 'Perfect Performance Rating', value: 3, enabled: true, description: 'Awarded for recent 100% performance score' },
    { id: 'perfectTrust', name: 'Perfect Trust Standard', value: 3, enabled: true, description: 'Awarded if trust index remains 98+' },
    { id: 'recentPromotion', name: 'Recent Promotion Indicator', value: 2, enabled: true, description: 'Awarded if system promoted developer tiers' },
    { id: 'outstandingPortfolio', name: 'Outstanding Portfolio Benchmark', value: 2, enabled: true, description: 'Awarded if portfolio review score exceeds 95%' },
    { id: 'relevantInternship', name: 'Relevant Platform Internships', value: 2, enabled: true, description: 'Awarded if user completed 3+ platform internships' },
    { id: 'researchPublication', name: 'Academic Research Publication', value: 1, enabled: true, description: 'Awarded for verified research journal uploads' },
    { id: 'osContribution', name: 'Verified Open Source Impact', value: 2, enabled: true, description: 'Awarded for continuous GitHub commits pull' },
    { id: 'recentHackathonWinner', name: 'Recent Hackathon Winner', value: 2, enabled: true, description: 'Awarded for verified hackathon awards' },
    { id: 'verifiedCertification', name: 'Verified Professional Credentials', value: 1, enabled: true, description: 'Awarded for physical corporate certificates' }
  ]);

  // Comprehensive list of candidates for deterministic simulation
  const [candidates, setCandidates] = useState<RankingCandidate[]>([
    {
      id: 'CAND_01',
      name: 'Sofia Kovalevskaya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      matchingScore: 95.8,
      confidenceScore: 98.2,
      experienceYears: 3,
      completedProjectsCount: 5,
      applicationTimestamp: '2026-07-04T10:00:00Z',
      isSuspended: false,
      isProfileComplete: true,
      isIdentityVerified: true,
      isAvailable: true,
      hasCapacityExceeded: false,
      country: 'Vietnam',
      hasVisaRestriction: false,
      englishLevel: 95,
      hasRequiredSkill: true,
      hasRequiredLanguage: true,
      performanceScore: 96,
      trustScore: 99,
      hasMandatoryCertification: true,
      hasMandatoryPortfolio: true,
      performanceTrend: 'Improving',
      trustTrend: 'Improving',
      growthTrendScore: 95,
      daysSinceLastActivity: 2,
      preferredIndustry: 'Software Engineering',
      expectedSalary: 1200,
      remotePreference: 'Remote',
      hasPerfectPerformance: true,
      hasPerfectTrust: true,
      hasRecentPromotion: true,
      hasOutstandingPortfolio: true,
      hasRelevantInternship: true,
      hasResearchPublication: false,
      hasOSContribution: true,
      hasRecentHackathonWinner: true,
      hasVerifiedCertification: true,
      hasRecentWarning: false,
      hasExpiredResume: false,
      hasOldPortfolio: false,
      hasRepeatedDeadlineFailure: false,
      isUnderFraudInvestigation: false,
      hasRepeatedWithdrawal: false
    },
    {
      id: 'CAND_02',
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      matchingScore: 92.5,
      confidenceScore: 88.0,
      experienceYears: 2,
      completedProjectsCount: 3,
      applicationTimestamp: '2026-07-04T11:30:00Z',
      isSuspended: false,
      isProfileComplete: true,
      isIdentityVerified: true,
      isAvailable: true,
      hasCapacityExceeded: false,
      country: 'Japan',
      hasVisaRestriction: false,
      englishLevel: 75,
      hasRequiredSkill: true,
      hasRequiredLanguage: true,
      performanceScore: 88,
      trustScore: 90,
      hasMandatoryCertification: false,
      hasMandatoryPortfolio: true,
      performanceTrend: 'Stable',
      trustTrend: 'Stable',
      growthTrendScore: 82,
      daysSinceLastActivity: 8,
      preferredIndustry: 'Artificial Intelligence',
      expectedSalary: 1500,
      remotePreference: 'Hybrid',
      hasPerfectPerformance: false,
      hasPerfectTrust: false,
      hasRecentPromotion: false,
      hasOutstandingPortfolio: false,
      hasRelevantInternship: true,
      hasResearchPublication: true,
      hasOSContribution: true,
      hasRecentHackathonWinner: false,
      hasVerifiedCertification: false,
      hasRecentWarning: false,
      hasExpiredResume: false,
      hasOldPortfolio: false,
      hasRepeatedDeadlineFailure: false,
      isUnderFraudInvestigation: false,
      hasRepeatedWithdrawal: false
    },
    {
      id: 'CAND_03',
      name: 'Devon Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      matchingScore: 95.8, // Tied base matching score with Sofia!
      confidenceScore: 82.5, // Different confidence score for tie break testing
      experienceYears: 2.5,
      completedProjectsCount: 4,
      applicationTimestamp: '2026-07-04T09:15:00Z', // Applied earlier
      isSuspended: false,
      isProfileComplete: true,
      isIdentityVerified: true,
      isAvailable: true,
      hasCapacityExceeded: false,
      country: 'United States',
      hasVisaRestriction: false,
      englishLevel: 100,
      hasRequiredSkill: true,
      hasRequiredLanguage: true,
      performanceScore: 95,
      trustScore: 95,
      hasMandatoryCertification: true,
      hasMandatoryPortfolio: true,
      performanceTrend: 'Improving',
      trustTrend: 'Stable',
      growthTrendScore: 88,
      daysSinceLastActivity: 12,
      preferredIndustry: 'Software Engineering',
      expectedSalary: 1800,
      remotePreference: 'Remote',
      hasPerfectPerformance: false,
      hasPerfectTrust: false,
      hasRecentPromotion: false,
      hasOutstandingPortfolio: true,
      hasRelevantInternship: false,
      hasResearchPublication: false,
      hasOSContribution: false,
      hasRecentHackathonWinner: false,
      hasVerifiedCertification: true,
      hasRecentWarning: false,
      hasExpiredResume: false,
      hasOldPortfolio: false,
      hasRepeatedDeadlineFailure: false,
      isUnderFraudInvestigation: false,
      hasRepeatedWithdrawal: false
    },
    {
      id: 'CAND_04',
      name: 'Aris Thorne (Fraud Suspect)',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
      matchingScore: 82.0,
      confidenceScore: 54.0,
      experienceYears: 1,
      completedProjectsCount: 1,
      applicationTimestamp: '2026-07-04T14:00:00Z',
      isSuspended: false,
      isProfileComplete: false,
      isIdentityVerified: false,
      isAvailable: false,
      hasCapacityExceeded: true,
      country: 'Russia',
      hasVisaRestriction: true,
      englishLevel: 60,
      hasRequiredSkill: false,
      hasRequiredLanguage: false,
      performanceScore: 50,
      trustScore: 40,
      hasMandatoryCertification: false,
      hasMandatoryPortfolio: false,
      performanceTrend: 'Declining',
      trustTrend: 'Declining',
      growthTrendScore: 30,
      daysSinceLastActivity: 95,
      preferredIndustry: 'Software Engineering',
      expectedSalary: 1000,
      remotePreference: 'Onsite',
      hasPerfectPerformance: false,
      hasPerfectTrust: false,
      hasRecentPromotion: false,
      hasOutstandingPortfolio: false,
      hasRelevantInternship: false,
      hasResearchPublication: false,
      hasOSContribution: false,
      hasRecentHackathonWinner: false,
      hasVerifiedCertification: false,
      hasRecentWarning: true,
      hasExpiredResume: true,
      hasOldPortfolio: true,
      hasRepeatedDeadlineFailure: true,
      isUnderFraudInvestigation: true, // Disqualifying
      hasRepeatedWithdrawal: true
    },
    {
      id: 'CAND_05',
      name: 'Yuki Takahashi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      matchingScore: 85.0,
      confidenceScore: 91.0,
      experienceYears: 1.5,
      completedProjectsCount: 2,
      applicationTimestamp: '2026-07-04T12:00:00Z',
      isSuspended: false,
      isProfileComplete: true,
      isIdentityVerified: true,
      isAvailable: true,
      hasCapacityExceeded: false,
      country: 'Japan',
      hasVisaRestriction: false,
      englishLevel: 85,
      hasRequiredSkill: true,
      hasRequiredLanguage: true,
      performanceScore: 91,
      trustScore: 98,
      hasMandatoryCertification: false,
      hasMandatoryPortfolio: true,
      performanceTrend: 'Improving',
      trustTrend: 'Improving',
      growthTrendScore: 90,
      daysSinceLastActivity: 4,
      preferredIndustry: 'Information Technology',
      expectedSalary: 1100,
      remotePreference: 'Remote',
      hasPerfectPerformance: false,
      hasPerfectTrust: true,
      hasRecentPromotion: true,
      hasOutstandingPortfolio: false,
      hasRelevantInternship: false,
      hasResearchPublication: false,
      hasOSContribution: false,
      hasRecentHackathonWinner: true,
      hasVerifiedCertification: false,
      hasRecentWarning: false,
      hasExpiredResume: false,
      hasOldPortfolio: false,
      hasRepeatedDeadlineFailure: false,
      isUnderFraudInvestigation: false,
      hasRepeatedWithdrawal: false
    }
  ]);

  // Immutable ranking audit history ledger
  const [rankingHistory, setRankingHistory] = useState<RankingResultLog[]>([
    {
      id: 'RANK_HIST_9012',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      projectId: 'PROJ_RANK_01',
      candidatesCount: 5,
      rejectedCount: 1,
      durationMs: 38,
      rankings: [
        {
          candidateId: 'CAND_01',
          name: 'Sofia Kovalevskaya',
          baseRank: 1,
          finalRank: 1,
          rankChange: 0,
          matchingScore: 95.8,
          confidenceScore: 98.2,
          compositeRankingScore: 96.42,
          status: 'Eligible',
          appliedBonuses: [{ name: 'Perfect Performance Rating', value: 3 }],
          appliedPenalties: [],
          explanation: 'Ranked 1st due to flawless matching alignment combined with supreme multiplier-backed evidence confidence.',
          strengths: ['Expert English level', 'Low rating variance'],
          weaknesses: [],
          missingRequirements: [],
          suggestions: []
        }
      ],
      factorsApplied: { confidence: 20, matchScore: 35, perfTrend: 10, trustTrend: 10 },
      pipelineSteps: ['Eligible filter passed', 'Base sorting completed', 'Tie break resolved'],
      version: 'v1.0.0'
    }
  ]);

  // Dynamic state computed for current selection
  const [currentRankings, setCurrentRankings] = useState<RankingOutput[]>([]);
  const [currentAuditLogs, setCurrentAuditLogs] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic Rank Calculation Loop
  const executeRankingPipeline = () => {
    setIsRefreshing(true);
    const startTime = performance.now();
    const logs: string[] = [];
    logs.push('[Pipeline Triggered] Initiating Recommendation Ranking Engine run.');

    // Step 1: Candidate Pool Extraction
    logs.push(`[Step 1: Pool Extraction] Analyzing ${candidates.length} candidate profiles in directory...`);

    const processedCandidates: RankingOutput[] = candidates.map(cand => {
      // Step 2: Eligibility Filtering
      let isEligible = true;
      let rejectionReason = '';
      const missingRequirements: string[] = [];

      if (cand.isSuspended) {
        isEligible = false;
        rejectionReason = 'Candidate Account is Suspended by Trust & Safety.';
      } else if (!cand.isProfileComplete) {
        isEligible = false;
        rejectionReason = 'Profile Incomplete. Mandatory registration standards unfulfilled.';
      } else if (!cand.isIdentityVerified) {
        isEligible = false;
        rejectionReason = 'Identity Verification KYC incomplete.';
      } else if (!cand.isAvailable) {
        isEligible = false;
        rejectionReason = 'Candidate Availability state set to Unavailable.';
      } else if (cand.hasCapacityExceeded) {
        isEligible = false;
        rejectionReason = 'Student active capacity limit exceeded (>40h/week).';
      } else if (cand.englishLevel < projectMandatoryLanguage) {
        isEligible = false;
        rejectionReason = `English Level (${cand.englishLevel}%) is below project mandatory threshold (${projectMandatoryLanguage}%).`;
      }

      if (!isEligible) {
        logs.push(`[Step 2: Eligibility Filtering] Candidate "${cand.name}" [REJECTED]: ${rejectionReason}`);
        return {
          candidateId: cand.id,
          name: cand.name,
          baseRank: 99,
          finalRank: 99,
          rankChange: 0,
          matchingScore: cand.matchingScore,
          confidenceScore: cand.confidenceScore,
          compositeRankingScore: 0,
          status: 'Rejected' as const,
          rejectionReason,
          appliedBonuses: [],
          appliedPenalties: [],
          explanation: `Profile filtered. Reason: ${rejectionReason}`,
          strengths: [],
          weaknesses: [],
          missingRequirements: [rejectionReason],
          suggestions: ['Please upload identity KYC documentation or update timeline availability.']
        };
      }

      // Step 3: Hard Rule Filtering
      let failsHardFilters = false;
      if (!cand.hasRequiredSkill) {
        failsHardFilters = true;
        rejectionReason = 'Missing mandatory primary programming languages.';
      } else if (cand.trustScore < projectMandatoryTrust) {
        failsHardFilters = true;
        rejectionReason = `Trust Score (${cand.trustScore}%) is below mandatory requirement (${projectMandatoryTrust}%).`;
      } else if (!cand.hasMandatoryPortfolio) {
        failsHardFilters = true;
        rejectionReason = 'Fails hard rule: Mandatory portfolio verification files are missing.';
      }

      if (failsHardFilters) {
        logs.push(`[Step 3: Hard Rule Filtering] Candidate "${cand.name}" [REJECTED]: ${rejectionReason}`);
        return {
          candidateId: cand.id,
          name: cand.name,
          baseRank: 99,
          finalRank: 99,
          rankChange: 0,
          matchingScore: cand.matchingScore,
          confidenceScore: cand.confidenceScore,
          compositeRankingScore: 0,
          status: 'Rejected' as const,
          rejectionReason,
          appliedBonuses: [],
          appliedPenalties: [],
          explanation: `Rejected by hard filter constraints. Reason: ${rejectionReason}`,
          strengths: [],
          weaknesses: [rejectionReason],
          missingRequirements: [rejectionReason],
          suggestions: ['Acquire missing skills or verify platform credentials to qualify.']
        };
      }

      // Candidate is fully eligible! Calculate base components
      logs.push(`[Eligibility Passed] Candidate "${cand.name}" is eligible.`);

      // Step 4: Calculate Core Ranking Factor Scores (10 elements)
      // 1. Confidence Multiplier
      let confidenceMultiplier = 1.0;
      if (cand.confidenceScore >= 98) confidenceMultiplier = 1.05;
      else if (cand.confidenceScore >= 95) confidenceMultiplier = 1.03;
      else if (cand.confidenceScore >= 90) confidenceMultiplier = 1.02;
      else if (cand.confidenceScore >= 80) confidenceMultiplier = 1.00;
      else if (cand.confidenceScore >= 70) confidenceMultiplier = 0.97;
      else confidenceMultiplier = 0.93;

      const confidenceComp = cand.confidenceScore * confidenceMultiplier;

      // 2. Performance Trend
      let performanceTrendVal = 70;
      if (cand.performanceTrend === 'Improving') performanceTrendVal = 100;
      else if (cand.performanceTrend === 'Stable') performanceTrendVal = 85;
      else performanceTrendVal = 40;

      // 3. Trust Trend
      let trustTrendVal = 70;
      if (cand.trustTrend === 'Improving') trustTrendVal = 100;
      else if (cand.trustTrend === 'Stable') trustTrendVal = 85;
      else trustTrendVal = 40;

      // 4. Availability
      const availabilityVal = cand.isAvailable ? 100 : 30;

      // 5. Recent Activity
      let activityVal = 20;
      if (cand.daysSinceLastActivity <= 7) activityVal = 100;
      else if (cand.daysSinceLastActivity <= 30) activityVal = 90;
      else if (cand.daysSinceLastActivity <= 90) activityVal = 70;

      // 6. Historical Success
      const successVal = Math.min(100, cand.completedProjectsCount * 20);

      // 7. Employer Preference Check
      const employerPrefVal = cand.country === companyPreferredCountry ? 100 : 70;

      // 8. Student Preference Check
      const studentPrefVal = (cand.preferredIndustry === 'Software Engineering' && cand.remotePreference === 'Remote') ? 100 : 80;

      // Multiply each sub-value by its configuration weights
      let factorSum = 0;
      rankingFactors.forEach(factor => {
        const weightFrac = factor.weight / 100;
        let subScore = 50;
        if (factor.id === 'confidence') subScore = confidenceComp;
        else if (factor.id === 'matchScore') subScore = cand.matchingScore;
        else if (factor.id === 'perfTrend') subScore = performanceTrendVal;
        else if (factor.id === 'trustTrend') subScore = trustTrendVal;
        else if (factor.id === 'growth') subScore = cand.growthTrendScore;
        else if (factor.id === 'availability') subScore = availabilityVal;
        else if (factor.id === 'activity') subScore = activityVal;
        else if (factor.id === 'success') subScore = successVal;
        else if (factor.id === 'employerPref') subScore = employerPrefVal;
        else if (factor.id === 'studentPref') subScore = studentPrefVal;

        factorSum += subScore * weightFrac;
      });

      // Step 5: Apply Dynamic Bonuses (Maximum bonus = 10%)
      let totalBonusPercent = 0;
      const appliedBonusesList: { name: string; value: number }[] = [];
      bonuses.forEach(b => {
        if (b.enabled) {
          let matches = false;
          if (b.id === 'perfectPerformance' && cand.hasPerfectPerformance) matches = true;
          else if (b.id === 'perfectTrust' && cand.hasPerfectTrust) matches = true;
          else if (b.id === 'recentPromotion' && cand.hasRecentPromotion) matches = true;
          else if (b.id === 'outstandingPortfolio' && cand.hasOutstandingPortfolio) matches = true;
          else if (b.id === 'relevantInternship' && cand.hasRelevantInternship) matches = true;
          else if (b.id === 'researchPublication' && cand.hasResearchPublication) matches = true;
          else if (b.id === 'osContribution' && cand.hasOSContribution) matches = true;
          else if (b.id === 'recentHackathonWinner' && cand.hasRecentHackathonWinner) matches = true;
          else if (b.id === 'verifiedCertification' && cand.hasVerifiedCertification) matches = true;

          if (matches) {
            totalBonusPercent += b.value;
            appliedBonusesList.push({ name: b.name, value: b.value });
          }
        }
      });
      const clampedBonus = Math.min(10, totalBonusPercent);

      // Step 6: Apply Dynamic Penalties (Stackable, no lower limit than 0)
      let totalPenaltyPercent = 0;
      const appliedPenaltiesList: { name: string; value: number }[] = [];
      penalties.forEach(p => {
        if (p.enabled) {
          let matches = false;
          if (p.id === 'profileIncomplete' && !cand.isProfileComplete) matches = true;
          else if (p.id === 'repeatedWithdrawal' && cand.hasRepeatedWithdrawal) matches = true;
          else if (p.id === 'recentWarning' && cand.hasRecentWarning) matches = true;
          else if (p.id === 'lowActivity' && cand.daysSinceLastActivity > 30) matches = true;
          else if (p.id === 'expiredResume' && cand.hasExpiredResume) matches = true;
          else if (p.id === 'oldPortfolio' && cand.hasOldPortfolio) matches = true;
          else if (p.id === 'repeatedDeadlineFailure' && cand.hasRepeatedDeadlineFailure) matches = true;
          else if (p.id === 'fraudInvestigation' && cand.isUnderFraudInvestigation) matches = true;

          if (matches) {
            totalPenaltyPercent += p.value;
            appliedPenaltiesList.push({ name: p.name, value: p.value });
          }
        }
      });

      // Composite Rank score = baseFactors * (1 + bonus% - penalty%)
      const multiplier = 1 + (clampedBonus / 100) - (totalPenaltyPercent / 100);
      const compositeRankingScore = Number((factorSum * multiplier).toFixed(2));

      logs.push(`[Step 4-6 Adjustment] Candidate "${cand.name}" Base Component: ${factorSum.toFixed(1)}. Bonuses applied: +${clampedBonus}%. Penalties applied: -${totalPenaltyPercent}%. Composite Rank Score: ${compositeRankingScore}`);

      // Strengths & Weaknesses Narrative Generators
      const strengths: string[] = [];
      if (cand.matchingScore >= 94) strengths.push('Excellent core compatibility alignment.');
      if (cand.confidenceScore >= 95) strengths.push('Supreme recommendation model evidence rating.');
      if (cand.performanceTrend === 'Improving') strengths.push('Outstanding positive performance growth trend.');
      if (cand.hasOSContribution) strengths.push('Validated open-source contribution commits.');

      const weaknesses: string[] = [];
      if (cand.daysSinceLastActivity > 10) weaknesses.push(`Inactive on platform for ${cand.daysSinceLastActivity} days.`);
      if (cand.hasRecentWarning) weaknesses.push('ledger warnings recorded recently.');
      if (cand.englishLevel < 85) weaknesses.push('Average conversational English level.');

      const suggestions: string[] = [];
      if (cand.daysSinceLastActivity > 10) suggestions.push('Refresh dynamic portfolio links to reset temporal activity penalty.');
      if (cand.englishLevel < 90) suggestions.push('Enroll in fast-track technical presentation workshops.');
      if (suggestions.length === 0) suggestions.push('Maintain active commit cycle on current project deliverables.');

      return {
        candidateId: cand.id,
        name: cand.name,
        baseRank: 0,
        finalRank: 0,
        rankChange: 0,
        matchingScore: cand.matchingScore,
        confidenceScore: cand.confidenceScore,
        compositeRankingScore,
        status: 'Eligible' as const,
        appliedBonuses: appliedBonusesList,
        appliedPenalties: appliedPenaltiesList,
        explanation: `Deterministic composite index: ${compositeRankingScore} calculated using 10 parameters.`,
        strengths,
        weaknesses: weaknesses.length > 0 ? weaknesses : ['None detected.'],
        missingRequirements: [],
        suggestions
      };
    });

    // Step 7: Sorters, Tie Breaks & Final Rank Calculations
    logs.push('[Step 7: Sorters] Resolving baseline sorting on composite indices...');

    const eligibleCandidates = processedCandidates.filter(c => c.status === 'Eligible');
    const rejectedCandidates = processedCandidates.filter(c => c.status === 'Rejected');

    // Sort Base Rank (just sorting by raw matching score descending)
    const baseRankSorted = [...eligibleCandidates].sort((a, b) => b.matchingScore - a.matchingScore);
    baseRankSorted.forEach((cand, idx) => {
      const orig = eligibleCandidates.find(c => c.candidateId === cand.candidateId);
      if (orig) orig.baseRank = idx + 1;
    });

    // Final sorting with tie-breaker
    const finalSorted = [...eligibleCandidates].sort((a, b) => {
      if (b.compositeRankingScore !== a.compositeRankingScore) {
        return b.compositeRankingScore - a.compositeRankingScore;
      }
      // Trigger Tie Break Engine if scores are identical!
      logs.push(`[Tie Break Warning] "${a.name}" and "${b.name}" have identical composite ranking scores (${a.compositeRankingScore}). Triggering Tie Break Engine...`);

      // 1. Higher Matching Score
      if (b.matchingScore !== a.matchingScore) {
        logs.push(`[Tie Break Level 1] Resolved by matching score: "${b.matchingScore > a.matchingScore ? b.name : a.name}" ranks higher.`);
        return b.matchingScore - a.matchingScore;
      }
      // 2. Higher Confidence
      if (b.confidenceScore !== a.confidenceScore) {
        logs.push(`[Tie Break Level 2] Resolved by confidence rating: "${b.confidenceScore > a.confidenceScore ? b.name : a.name}" ranks higher.`);
        return b.confidenceScore - a.confidenceScore;
      }
      // 3. Earlier Application timestamp
      const aCandidate = candidates.find(c => c.id === a.candidateId);
      const bCandidate = candidates.find(c => c.id === b.candidateId);
      if (aCandidate && bCandidate) {
        const timeA = new Date(aCandidate.applicationTimestamp).getTime();
        const timeB = new Date(bCandidate.applicationTimestamp).getTime();
        if (timeA !== timeB) {
          logs.push(`[Tie Break Level 3] Resolved by earlier application timestamp: "${timeA < timeB ? a.name : b.name}" ranks higher.`);
          return timeA - timeB; // earlier ranks first
        }
      }

      // 4. Fallback: Deterministic Stable Ordering based on UUID string comparison
      logs.push('[Tie Break Level 4] Fallback to deterministic stable UUID comparison.');
      return a.candidateId.localeCompare(b.candidateId);
    });

    // Assign final ranks
    finalSorted.forEach((cand, idx) => {
      cand.finalRank = idx + 1;
      cand.rankChange = cand.baseRank - cand.finalRank; // positive = rank improved (base rank was higher number than final)
    });

    // Combine eligible & rejected candidates back
    const outputResults = [...finalSorted, ...rejectedCandidates];

    setTimeout(() => {
      setCurrentRankings(outputResults);
      setCurrentAuditLogs(logs);
      setIsRefreshing(false);
    }, 400); // short simulated process delay
  };

  useEffect(() => {
    executeRankingPipeline();
  }, [
    candidates, rankingFactors, penalties, bonuses, selectedProjectId,
    companyPreferredMajor, companyPreferredCountry, projectMandatoryLanguage, projectMandatoryTrust, engineVersion
  ]);

  const handleSaveToLedger = () => {
    if (currentRankings.length === 0) return;
    const newLog: RankingResultLog = {
      id: `RANK_RUN_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      projectId: selectedProjectId,
      candidatesCount: candidates.length,
      rejectedCount: currentRankings.filter(c => c.status === 'Rejected').length,
      durationMs: 32,
      rankings: currentRankings,
      factorsApplied: rankingFactors.reduce((acc, f) => {
        acc[f.id] = f.weight;
        return acc;
      }, {} as Record<string, number>),
      pipelineSteps: currentAuditLogs,
      version: engineVersion === 'v1' ? 'v1.1.0' : engineVersion === 'v2' ? 'v2.0.2' : 'v3.0.0'
    };

    setRankingHistory(prev => [newLog, ...prev]);
    alert('Deterministically calculated ranking hierarchy recorded in the KONEXA immutable ledger.');
  };

  const handleWeightChange = (id: string, val: number) => {
    setRankingFactors(prev => prev.map(f => {
      if (f.id === id) return { ...f, weight: Math.max(0, Math.min(100, val)) };
      return f;
    }));
  };

  const togglePenalty = (id: string) => {
    setPenalties(prev => prev.map(p => {
      if (p.id === id) return { ...p, enabled: !p.enabled };
      return p;
    }));
  };

  const toggleBonus = (id: string) => {
    setBonuses(prev => prev.map(b => {
      if (b.id === id) return { ...b, enabled: !b.enabled };
      return b;
    }));
  };

  const totalWeightsSum = rankingFactors.reduce((a, b) => a + b.weight, 0);

  // JSON REST API Payload mockup
  const simulatedJsonResponse = currentRankings.length > 0 ? {
    metadata: {
      engine: "KONEXA AI Recommendation Ranking Engine",
      specification_version: "3.0.0",
      reproducible_version: engineVersion === 'v1' ? 'v1.2.0' : 'v2.5.0',
      timestamp: new Date().toISOString(),
      project_id_audited: selectedProjectId,
      pipeline_status: "Complete"
    },
    constraints_applied: {
      mandatory_english_level_pct: projectMandatoryLanguage,
      mandatory_trust_level_pct: projectMandatoryTrust,
      company_preferred_country: companyPreferredCountry
    },
    ranking_factors_weight_matrix: rankingFactors.reduce((acc, f) => {
      acc[f.id] = f.weight;
      return acc;
    }, {} as Record<string, number>),
    results_pool_summary: {
      total_considered: candidates.length,
      total_eligible: currentRankings.filter(r => r.status === 'Eligible').length,
      total_rejected_filtered: currentRankings.filter(r => r.status === 'Rejected').length
    },
    ranked_eligible_output: currentRankings
      .filter(r => r.status === 'Eligible')
      .map(r => ({
        final_assigned_rank: r.finalRank,
        base_compatibility_rank: r.baseRank,
        rank_movement_delta: r.rankChange,
        candidate_id: r.candidateId,
        candidate_name: r.name,
        composite_ranking_score: r.compositeRankingScore,
        base_matching_score: r.matchingScore,
        confidence_certainty_score: r.confidenceScore,
        explainability: {
          narrative: r.explanation,
          candidate_strengths: r.strengths,
          candidate_weaknesses: r.weaknesses,
          suggestions_for_candidate: r.suggestions
        }
      })),
    rejected_output: currentRankings
      .filter(r => r.status === 'Rejected')
      .map(r => ({
        candidate_id: r.candidateId,
        candidate_name: r.name,
        rejection_reason: r.rejectionReason,
        missing_mandatory_thresholds: r.missingRequirements
      }))
  } : null;

  return (
    <div className="space-y-6">
      {/* Brand Title Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <ListOrdered className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Ranking Specification 3.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recommendation Ranking Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Decides which recommendations appear first using a deterministic, multi-layered pipeline. Combines structural matching, evidence confidence multipliers, tie-break priorities, and candidate freshness variables.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${totalWeightsSum === 100 ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
            <span className="text-xs font-mono text-neutral-300 font-semibold">WEIGHT TOTAL: {totalWeightsSum}%</span>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'sandbox', label: 'Ranking Pipeline Sandbox', icon: Sliders },
          { id: 'weights', label: 'Ranking Factors Matrix', icon: Settings },
          { id: 'penalties', label: 'Bonuses & Penalties', icon: ShieldAlert },
          { id: 'logs', label: 'Immutable Audit ledger', icon: History },
          { id: 'docs', label: 'DB Schema & API Spec', icon: BookOpen }
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

      {/* Main Switch Layout */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'sandbox' && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Hand: Config and Audit Logs */}
            <div className="lg:col-span-4 space-y-6">
              {/* Dynamic Project Scope constraints */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">1. Enterprise Target Parameters</span>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Project Profile</label>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      <option value="PROJ_RANK_01">Enterprise Dashboard Modernization</option>
                      <option value="PROJ_RANK_02">Neural Fine-Tuning Pipeline</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Mandatory English Level Requirement ({projectMandatoryLanguage}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={projectMandatoryLanguage}
                      onChange={e => setProjectMandatoryLanguage(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Mandatory Trust Score Requirement ({projectMandatoryTrust}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={projectMandatoryTrust}
                      onChange={e => setProjectMandatoryTrust(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Employer Country Affinity (Personalization Engine)</label>
                    <select
                      value={companyPreferredCountry}
                      onChange={e => setCompanyPreferredCountry(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    >
                      <option value="Vietnam">Vietnam</option>
                      <option value="Japan">Japan</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Execution Pipeline logs diagnostics */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">2. Ranking Pipeline Audit Logs</span>
                  {isRefreshing ? (
                    <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                  ) : (
                    <span className="text-[9px] font-mono text-neutral-500">Deterministic</span>
                  )}
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1 max-h-72 overflow-y-auto">
                  {currentAuditLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-teal-400 shrink-0">[{idx + 1}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hand: Final Rankings Display & Interactive Report Cards */}
            <div className="lg:col-span-8 space-y-6">
              {/* Dynamic Rankings Ladder Board */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Computed Recommendation Ladder</span>
                  <button
                    onClick={handleSaveToLedger}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Store Final Ranking</span>
                  </button>
                </div>

                {/* Grid of Results */}
                <div className="space-y-3">
                  {currentRankings
                    .sort((a, b) => {
                      if (a.status === 'Rejected' && b.status === 'Eligible') return 1;
                      if (a.status === 'Eligible' && b.status === 'Rejected') return -1;
                      return a.finalRank - b.finalRank;
                    })
                    .map(rank => {
                      const isRejected = rank.status === 'Rejected';
                      return (
                        <div
                          key={rank.candidateId}
                          className={`p-4 rounded-xl border transition-all ${isRejected ? 'bg-neutral-950/40 border-neutral-900/55 opacity-65' : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700/80'}`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Profile Left block */}
                            <div className="flex items-center gap-3">
                              {!isRejected ? (
                                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-mono font-bold text-sm">
                                  #{rank.finalRank}
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono font-bold text-sm">
                                  X
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                  <span>{rank.name}</span>
                                  {rank.rankChange > 0 && (
                                    <span className="inline-flex items-center text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1 rounded">
                                      <ArrowUpRight className="w-3 h-3" />
                                      <span>+{rank.rankChange}</span>
                                    </span>
                                  )}
                                  {rank.rankChange < 0 && (
                                    <span className="inline-flex items-center text-[10px] text-rose-400 font-mono bg-rose-500/10 px-1 rounded">
                                      <ArrowDownRight className="w-3 h-3" />
                                      <span>{rank.rankChange}</span>
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                                  Match: {rank.matchingScore}% | Confidence: {rank.confidenceScore}%
                                </p>
                              </div>
                            </div>

                            {/* Center Status, Rejection or Composite */}
                            <div className="flex items-center gap-3 text-right">
                              {isRejected ? (
                                <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono uppercase">
                                  Rejected Filter
                                </div>
                              ) : (
                                <div className="text-right">
                                  <span className="text-[10px] font-mono text-neutral-500 block">COMPOSITE INDEX</span>
                                  <span className="text-base font-black text-teal-400 font-mono">{rank.compositeRankingScore}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expandable explainability footer */}
                          <div className="mt-3.5 pt-3.5 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                            {isRejected ? (
                              <div className="md:col-span-2 text-rose-400 font-mono text-[11px]">
                                Rejection Cause: {rank.rejectionReason}
                              </div>
                            ) : (
                              <>
                                <div className="space-y-1">
                                  <span className="font-semibold text-neutral-300">Ranking Factors Strengths</span>
                                  <ul className="list-disc list-inside text-neutral-400 text-[11px] space-y-0.5">
                                    {rank.strengths.slice(0, 3).map((s, i) => (
                                      <li key={i}>{s}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-1">
                                  <span className="font-semibold text-neutral-300">Applied Adjustments</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {rank.appliedBonuses.map((b, i) => (
                                      <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                                        +{b.value}% {b.name}
                                      </span>
                                    ))}
                                    {rank.appliedPenalties.map((p, i) => (
                                      <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-mono">
                                        -{p.value}% {p.name}
                                      </span>
                                    ))}
                                    {rank.appliedBonuses.length === 0 && rank.appliedPenalties.length === 0 && (
                                      <span className="text-[10px] text-neutral-500 font-mono">No active multipliers.</span>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Live REST API Playground Output */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">3. Decoupled JSON REST API Payload View</span>
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto max-h-56 font-mono text-[11px] text-teal-300 leading-normal scrollbar-thin">
                  <pre>{JSON.stringify(simulatedJsonResponse, null, 2)}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weights Matrix Config Subtab */}
        {activeSubTab === 'weights' && (
          <motion.div
            key="weights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-md font-bold text-white">Dynamic 10-Factor Priority Matrix</h3>
                <p className="text-xs text-neutral-400">Sliders must sum to 100% total allocation weight.</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-white">
                Sum: {totalWeightsSum}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rankingFactors.map(factor => (
                <div key={factor.id} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-200">{factor.name}</span>
                    <span className="text-xs font-mono text-teal-400 font-bold">{factor.weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={factor.weight}
                    onChange={e => handleWeightChange(factor.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <p className="text-[10px] text-neutral-500 leading-normal">{factor.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Penalties & Bonuses subtab */}
        {activeSubTab === 'penalties' && (
          <motion.div
            key="penalties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Bonuses configuration block */}
            <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Promotion Bonuses (Max 10%)</span>
              </h3>
              <div className="space-y-3">
                {bonuses.map(b => (
                  <div key={b.id} className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-850 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-neutral-200">{b.name}</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">{b.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-emerald-400">+{b.value}%</span>
                      <button
                        onClick={() => toggleBonus(b.id)}
                        className={`w-8 h-4 rounded-full relative transition-colors ${b.enabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 transition-transform ${b.enabled ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Penalties configuration block */}
            <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Deterministic Demotion Penalties</span>
              </h3>
              <div className="space-y-3">
                {penalties.map(p => (
                  <div key={p.id} className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-850 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-neutral-200">{p.name}</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-rose-400">-{p.value}%</span>
                      <button
                        onClick={() => togglePenalty(p.id)}
                        className={`w-8 h-4 rounded-full relative transition-colors ${p.enabled ? 'bg-rose-500' : 'bg-neutral-800'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 transition-transform ${p.enabled ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Immutable Audit ledger tab */}
        {activeSubTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Cryptographically Verified Ranking Log</h3>
                <p className="text-xs text-neutral-400">Calculations stored securely in chronological ledger order.</p>
              </div>
              <Activity className="w-5 h-5 text-teal-400" />
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {rankingHistory.map(log => (
                <div key={log.id} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center text-xs text-neutral-400">
                    <span className="font-mono text-white font-bold">{log.id}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 block">Candidates Size</span>
                      <span className="text-white font-semibold">{log.candidatesCount} Considered</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Filtered Rejected</span>
                      <span className="text-rose-400 font-semibold">{log.rejectedCount} Profiles</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Processing latency</span>
                      <span className="text-white font-semibold">{log.durationMs} ms</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Ledger signature</span>
                      <span className="text-emerald-400 font-semibold">VERIFIED</span>
                    </div>
                  </div>

                  {/* Summary of ranked order output */}
                  <div className="p-3 bg-neutral-950 rounded-lg text-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Assigned Recommendation order</span>
                    {log.rankings.map((r, i) => (
                      <div key={i} className="flex justify-between items-center font-mono text-[11px]">
                        <span className="text-neutral-300">#{r.finalRank} - {r.name}</span>
                        <span className="text-teal-400">Score: {r.compositeRankingScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Database schema and technical docs subtab */}
        {activeSubTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Relational Table schema specification */}
            <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-teal-400" />
                <span>PostgreSQL Recommendation Ledger Schema</span>
              </h3>
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 leading-normal max-h-96 overflow-y-auto">
                <pre>{`-- PostgreSQL 15.x Relational Tables
CREATE TABLE konexa_ranking_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(50) NOT NULL,
    company_id VARCHAR(50) NOT NULL,
    ranking_algorithm_version VARCHAR(20) DEFAULT 'v3.0.0',
    total_candidates INT DEFAULT 0,
    rejected_count INT DEFAULT 0,
    calculation_duration_ms INT NOT NULL,
    weights_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE konexa_candidate_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ranking_log_id UUID REFERENCES konexa_ranking_logs(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    matching_score DECIMAL(5,2) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    composite_ranking_score DECIMAL(5,2) NOT NULL,
    assigned_final_rank INT NOT NULL,
    assigned_base_rank INT NOT NULL,
    rank_movement INT DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('Eligible', 'Rejected')),
    rejection_reason TEXT,
    applied_bonuses JSONB DEFAULT '[]'::jsonb,
    applied_penalties JSONB DEFAULT '[]'::jsonb,
    explainability_narrative TEXT NOT NULL
);

CREATE TABLE konexa_ranking_audit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ranking_log_id UUID REFERENCES konexa_ranking_logs(id),
    administrator_id VARCHAR(50),
    override_occurred BOOLEAN DEFAULT FALSE,
    integrity_checksum VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}</pre>
              </div>
            </div>

            {/* REST endpoints API specification documentation */}
            <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>REST API Operations Specifications</span>
              </h3>
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 leading-normal max-h-96 overflow-y-auto">
                <pre>{`## API ENDPOINTS DOCUMENTATION

### 1. Execute Recommendation Ranking
* **Endpoint**: \`POST /api/v3/projects/:projectId/rankings\`
* **Description**: Deterministically filters, scores, and sorts the available candidate pool.
* **Payload**:
{
  "mandatory_english_level": 80,
  "mandatory_trust_score": 70,
  "weights_override": {
    "confidence": 20,
    "matchScore": 35,
    "perfTrend": 10
  }
}
* **Response**: \`200 OK\` (Returns ranked output ladder)

### 2. Fetch Ranking History Log
* **Endpoint**: \`GET /api/v3/projects/:projectId/rankings/history\`
* **Description**: Retrieves immutable historical calculation results from the ledger.

### 3. Retrieve Candidate Explanation
* **Endpoint**: \`GET /api/v3/students/:studentId/rankings/explanation\`
* **Description**: Delivers detailed strengths, weaknesses, and improvement roadmaps for the student candidate.`}</pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
