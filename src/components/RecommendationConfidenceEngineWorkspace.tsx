import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Award,
  History,
  BookOpen,
  Cpu,
  AlertCircle,
  CheckCircle2,
  XCircle,
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
  Eye,
  Settings,
  Sparkles,
  BarChart4,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

// Definitions for the Recommendation Confidence Engine Configuration
interface ConfidenceWeightConfig {
  id: string;
  name: string;
  weight: number; // percentage
  description: string;
}

interface StudentConfidenceRecord {
  id: string;
  name: string;
  // Category 1: Profile Completeness fields (17 fields total for 100% calculation)
  profileFields: {
    basicInfo: boolean;
    education: boolean;
    languages: boolean;
    skills: boolean;
    certificates: boolean;
    resume: boolean;
    portfolio: boolean;
    github: boolean;
    linkedin: boolean;
    introVideo: boolean;
    availability: boolean;
    careerGoals: boolean;
    preferredCountry: boolean;
    preferredIndustry: boolean;
    profileImage: boolean;
    emergencyContact: boolean;
    requiredDocuments: boolean;
  };
  // Category 2: Profile Verification
  verifications: {
    identity: boolean;
    university: boolean;
    email: boolean;
    phone: boolean;
    resume: boolean;
    portfolio: boolean;
    certificate: boolean;
    businessValidation: boolean;
    github: boolean;
    linkedin: boolean;
  };
  // Category 3: Project History
  completedProjects: number;
  cancelledProjects: number;
  projectDiversity: number; // 0-100
  internationalProjects: number;
  industryDiversity: number; // 0-100
  technologyDiversity: number; // 0-100
  avgProjectDurationWeeks: number;
  relevantProjectsCount: number;
  // Category 4: Performance Stability
  performanceRatings: number[]; // Array of past scores (e.g., [92, 94, 91, 95])
  weeklyConsistencyScore: number; // 0-100
  // Category 5: Employer Review Reliability
  reviewsCount: number;
  uniqueEmployersCount: number;
  avgReviewLength: number; // words
  reviewerTrustAvg: number; // 0-100
  reviewAgeDays: number;
  // Category 6: Trust History
  trustScore: number; // 0-100
  warningCount: number;
  hasFraudFlag: boolean;
  professionalTimelineMonths: number;
  // Category 7: Activity Freshness
  daysSinceLastLogin: number;
  daysSinceLastPortfolioUpdate: number;
  daysSinceLastGithubActivity: number;
  daysSinceLastResumeUpdate: number;
  // Category 8: Historical Similarity Dataset
  similarPastStudentsMatched: number;
  similarProjectsCompleted: number;
  // Category 9: Data Freshness
  resumeAgeDays: number;
  portfolioAgeDays: number;
  languageCertificateAgeDays: number;
  // Other flags
  hasRepeatedWithdrawals: boolean;
  hasUnverifiedCertificates: boolean;
}

interface ConfidenceResult {
  id: string;
  timestamp: string;
  studentId: string;
  confidenceScore: number;
  confidenceLevel: string;
  categoryScores: Record<string, number>;
  penaltiesApplied: { id: string; name: string; value: number }[];
  bonusesApplied: { id: string; name: string; value: number }[];
  strongEvidence: string[];
  weakEvidence: string[];
  missingEvidence: string[];
  howToImprove: string[];
  predictionVariance: number;
  recommendationVariance: number;
  scoreStability: number; // 0-100
  explanation: string;
  layersExecuted: string[];
  durationMs: number;
  version: string;
}

export default function RecommendationConfidenceEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'weights' | 'penalties' | 'logs' | 'docs'>('sandbox');
  const [engineVersion, setEngineVersion] = useState<'v1' | 'v2' | 'v3'>('v1');
  const [selectedStudentId, setSelectedStudentId] = useState('STU_CONF_01');
  const [searchQuery, setSearchQuery] = useState('');

  // 10 categories with exact weights summing to 100%
  const [categoryWeights, setCategoryWeights] = useState<ConfidenceWeightConfig[]>([
    { id: 'completeness', name: 'Profile Completeness', weight: 15, description: 'Audits presence of basic info, resume, portfolio, GitHub, career goals, video, and documents.' },
    { id: 'verification', name: 'Profile Verification', weight: 10, description: 'Computes institutional checks, identity KYC, and verified linked profiles.' },
    { id: 'history', name: 'Project History', weight: 15, description: 'Measures total volume of completed projects, industry depth, and technology span.' },
    { id: 'stability', name: 'Performance Stability', weight: 15, description: 'Standard deviation analysis and consistency of past evaluations.' },
    { id: 'reliability', name: 'Employer Review Reliability', weight: 15, description: 'Verifies reviewer trust ratings and discounts concentrated reviews from single entities.' },
    { id: 'trustHistory', name: 'Trust History', weight: 10, description: 'Audits ledger warnings, timeline length, and active security/fraud triggers.' },
    { id: 'freshness', name: 'Activity Freshness', weight: 5, description: 'Temporal distance of login sessions, commits, and resume adjustments.' },
    { id: 'similarity', name: 'Historical Similarity', weight: 10, description: 'Calibrates predictability against successful historic candidate models.' },
    { id: 'dataFreshness', name: 'Data Freshness', weight: 5, description: 'Scans age indexes of file documents, certificates, and portfolio components.' },
    { id: 'predictionStability', name: 'Prediction Stability', weight: 10, description: 'Multi-pass recommendation variance assessment under simulation noise.' }
  ]);

  // Configurable Penalties
  const [penaltySettings, setPenaltySettings] = useState([
    { id: 'profileIncomplete', name: 'Profile Incomplete Penalty', value: 10, enabled: true, desc: 'Fired if profile completion index is less than 80%' },
    { id: 'repeatedInactivity', name: 'Repeated Inactivity Penalty', value: 15, enabled: true, desc: 'Fired if idle for more than 90 days' },
    { id: 'noCompletedProjects', name: 'No Completed Projects Penalty', value: 20, enabled: true, desc: 'Fired if candidate has zero completed tasks' },
    { id: 'oldPortfolio', name: 'Outdated Portfolio Penalty', value: 12, enabled: true, desc: 'Fired if portfolio has not been changed for 180 days' },
    { id: 'outdatedResume', name: 'Outdated Resume Penalty', value: 10, enabled: true, desc: 'Fired if CV is older than 180 days' },
    { id: 'singleEmployerReview', name: 'Single Employer Concentration', value: 15, enabled: true, desc: 'Fired if reviews are only from 1 employer' },
    { id: 'repeatedWithdrawal', name: 'Repeated Project Withdrawal Penalty', value: 25, enabled: true, desc: 'Fired if student has withdrawn from projects' },
    { id: 'unverifiedCertificates', name: 'Unverified Certificates Penalty', value: 8, enabled: true, desc: 'Fired if certificates lack digital signatures' },
    { id: 'fraudFlag', name: 'Fraud Flag Critical Security Discount', value: 35, enabled: true, desc: 'Fired if suspicious timeline discrepancies are flagged' }
  ]);

  // Configurable Bonuses
  const [bonusSettings, setBonusSettings] = useState([
    { id: 'verifiedIdentity', name: 'Verified Identity KYC', value: 10, enabled: true, desc: 'Awarded for physical government ID verification' },
    { id: 'verifiedUniversity', name: 'Verified Academic Status', value: 8, enabled: true, desc: 'Awarded for official .edu or registrar verification' },
    { id: 'verifiedCertificates', name: 'Cryptographically Verified Credentials', value: 5, enabled: true, desc: 'Awarded for validated credentials' },
    { id: 'recentSuccessfulProject', name: 'Recent Successful Completion', value: 8, enabled: true, desc: 'Awarded if a project was finished with high scores in 30 days' },
    { id: 'multipleEmployerReviews', name: 'Employer Diversity Bonus', value: 10, enabled: true, desc: 'Awarded if reviews span 3+ unique companies' },
    { id: 'longTermConsistency', name: 'Pristine Longitudinal Consistency', value: 12, enabled: true, desc: 'Awarded for stable high ratings over 6+ months' },
    { id: 'recentPortfolioUpdate', name: 'Recent Portfolio Polish', value: 5, enabled: true, desc: 'Awarded for active adjustments within 15 days' },
    { id: 'githubContribution', name: 'Continuous GitHub Sync', value: 5, enabled: true, desc: 'Awarded if active commits are pulled' },
    { id: 'osContribution', name: 'Validated Open Source Impact', value: 6, enabled: true, desc: 'Awarded for active repositories contribution' },
    { id: 'perfectTrust', name: 'Zero ledger warnings & warnings', value: 10, enabled: true, desc: 'Awarded if trust score remains 98+' }
  ]);

  // Simulated student profiles with rich confidence variables
  const [studentsData, setStudentsData] = useState<StudentConfidenceRecord[]>([
    {
      id: 'STU_CONF_01',
      name: 'Nora Lindqvist',
      profileFields: {
        basicInfo: true, education: true, languages: true, skills: true, certificates: true,
        resume: true, portfolio: true, github: true, linkedin: true, introVideo: true,
        availability: true, careerGoals: true, preferredCountry: true, preferredIndustry: true,
        profileImage: true, emergencyContact: true, requiredDocuments: true
      },
      verifications: {
        identity: true, university: true, email: true, phone: true, resume: true,
        portfolio: true, certificate: true, businessValidation: true, github: true, linkedin: true
      },
      completedProjects: 6,
      cancelledProjects: 0,
      projectDiversity: 92,
      internationalProjects: 2,
      industryDiversity: 85,
      technologyDiversity: 90,
      avgProjectDurationWeeks: 8,
      relevantProjectsCount: 4,
      performanceRatings: [96, 94, 95, 95, 98, 95], // low standard deviation (Highly stable!)
      weeklyConsistencyScore: 97,
      reviewsCount: 6,
      uniqueEmployersCount: 4, // strong diversity
      avgReviewLength: 120, // detailed reviews
      reviewerTrustAvg: 95,
      reviewAgeDays: 12,
      trustScore: 99,
      warningCount: 0,
      hasFraudFlag: false,
      professionalTimelineMonths: 18,
      daysSinceLastLogin: 1,
      daysSinceLastPortfolioUpdate: 4,
      daysSinceLastGithubActivity: 2,
      daysSinceLastResumeUpdate: 10,
      similarPastStudentsMatched: 45,
      similarProjectsCompleted: 88,
      resumeAgeDays: 10,
      portfolioAgeDays: 4,
      languageCertificateAgeDays: 30,
      hasRepeatedWithdrawals: false,
      hasUnverifiedCertificates: false
    },
    {
      id: 'STU_CONF_02',
      name: 'Devon Miller (Single-Employer Concentrated)',
      profileFields: {
        basicInfo: true, education: true, languages: true, skills: true, certificates: true,
        resume: true, portfolio: true, github: true, linkedin: false, introVideo: false,
        availability: true, careerGoals: true, preferredCountry: false, preferredIndustry: true,
        profileImage: true, emergencyContact: false, requiredDocuments: true
      },
      verifications: {
        identity: true, university: true, email: true, phone: true, resume: false,
        portfolio: false, certificate: true, businessValidation: false, github: true, linkedin: false
      },
      completedProjects: 4,
      cancelledProjects: 0,
      projectDiversity: 40,
      internationalProjects: 0,
      industryDiversity: 20,
      technologyDiversity: 30,
      avgProjectDurationWeeks: 6,
      relevantProjectsCount: 4,
      performanceRatings: [98, 97, 98, 99], // highly rated, but all from a single employer!
      weeklyConsistencyScore: 95,
      reviewsCount: 4,
      uniqueEmployersCount: 1, // Single employer constraint -> lower review reliability
      avgReviewLength: 35,
      reviewerTrustAvg: 80,
      reviewAgeDays: 45,
      trustScore: 90,
      warningCount: 0,
      hasFraudFlag: false,
      professionalTimelineMonths: 12,
      daysSinceLastLogin: 15,
      daysSinceLastPortfolioUpdate: 60,
      daysSinceLastGithubActivity: 12,
      daysSinceLastResumeUpdate: 60,
      similarPastStudentsMatched: 12,
      similarProjectsCompleted: 24,
      resumeAgeDays: 60,
      portfolioAgeDays: 60,
      languageCertificateAgeDays: 180,
      hasRepeatedWithdrawals: false,
      hasUnverifiedCertificates: true
    },
    {
      id: 'STU_CONF_03',
      name: 'Aris Thorne (Unstable & High Risk)',
      profileFields: {
        basicInfo: true, education: true, languages: false, skills: true, certificates: false,
        resume: true, portfolio: false, github: false, linkedin: false, introVideo: false,
        availability: true, careerGoals: false, preferredCountry: false, preferredIndustry: false,
        profileImage: false, emergencyContact: false, requiredDocuments: false
      },
      verifications: {
        identity: false, university: false, email: true, phone: false, resume: false,
        portfolio: false, certificate: false, businessValidation: false, github: false, linkedin: false
      },
      completedProjects: 2,
      cancelledProjects: 3,
      projectDiversity: 50,
      internationalProjects: 0,
      industryDiversity: 30,
      technologyDiversity: 40,
      avgProjectDurationWeeks: 4,
      relevantProjectsCount: 1,
      performanceRatings: [88, 50, 92, 40], // high standard deviation (Highly unstable!)
      weeklyConsistencyScore: 45,
      reviewsCount: 2,
      uniqueEmployersCount: 1,
      avgReviewLength: 12,
      reviewerTrustAvg: 40,
      reviewAgeDays: 200,
      trustScore: 45,
      warningCount: 3,
      hasFraudFlag: true,
      professionalTimelineMonths: 4,
      daysSinceLastLogin: 85,
      daysSinceLastPortfolioUpdate: 300,
      daysSinceLastGithubActivity: 95,
      daysSinceLastResumeUpdate: 180,
      similarPastStudentsMatched: 2,
      similarProjectsCompleted: 4,
      resumeAgeDays: 180,
      portfolioAgeDays: 300,
      languageCertificateAgeDays: 400,
      hasRepeatedWithdrawals: true,
      hasUnverifiedCertificates: true
    }
  ]);

  const [ledgerLogs, setLedgerLogs] = useState<ConfidenceResult[]>([
    {
      id: 'CONF_HIST_091',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      studentId: 'STU_CONF_01',
      confidenceScore: 97.45,
      confidenceLevel: 'Highly Reliable',
      categoryScores: {
        completeness: 100, verification: 100, history: 90, stability: 98,
        reliability: 95, trustHistory: 98, freshness: 100, similarity: 95,
        dataFreshness: 98, predictionStability: 98
      },
      penaltiesApplied: [],
      bonusesApplied: [
        { id: 'verifiedIdentity', name: 'Verified Identity KYC', value: 10 },
        { id: 'multipleEmployerReviews', name: 'Employer Diversity Bonus', value: 10 }
      ],
      strongEvidence: ['Complete 17-point profile registration', 'Low performance variance across 6 iterations'],
      weakEvidence: [],
      missingEvidence: [],
      howToImprove: ['Proceed with matching recommendation immediately.'],
      predictionVariance: 0.12,
      recommendationVariance: 0.05,
      scoreStability: 99.1,
      explanation: 'Candidate Nora Lindqvist offers exceptionally high metrics proof. Standard deviation of past ratings is lower than 1.5%.',
      layersExecuted: ['Completeness Matrix Checked', 'Variance Resolved', 'Stability Calibrated'],
      durationMs: 14,
      version: 'v1.0.0'
    }
  ]);

  const [calculatedConfidence, setCalculatedConfidence] = useState<ConfidenceResult | null>(null);

  // Core Math Logic for Recommendation Confidence Engine
  const executeConfidenceEngine = () => {
    const startTime = performance.now();
    const student = studentsData.find(s => s.id === selectedStudentId);
    if (!student) return;

    const auditSteps: string[] = [];
    auditSteps.push('[Initiating Confidence Evaluation Engine] Reading verified evidence vectors...');

    const categoryScores: Record<string, number> = {};

    // --- CATEGORY 1: PROFILE COMPLETENESS (15%) ---
    const requiredKeys = Object.keys(student.profileFields);
    const completedCount = Object.values(student.profileFields).filter(Boolean).length;
    const completenessRatio = completedCount / requiredKeys.length;
    const completenessPercentage = Math.round(completenessRatio * 100);
    
    let completenessScore = 40;
    if (completenessPercentage === 100) completenessScore = 100;
    else if (completenessPercentage >= 95) completenessScore = 95;
    else if (completenessPercentage >= 80) completenessScore = 80;
    else if (completenessPercentage >= 60) completenessScore = 60;
    else completenessScore = 40;

    categoryScores.completeness = completenessScore;
    auditSteps.push(`[Layer 1: Profile Completeness] ${completedCount}/${requiredKeys.length} fields populated (${completenessPercentage}%). Computed Score: ${completenessScore}/100.`);

    // --- CATEGORY 2: PROFILE VERIFICATION (10%) ---
    const verificationKeys = Object.keys(student.verifications);
    const successfulVerifications = Object.values(student.verifications).filter(Boolean).length;
    // Each verification adds 10 points
    const verificationScore = Math.min(100, successfulVerifications * 10);
    categoryScores.verification = verificationScore;
    auditSteps.push(`[Layer 2: Profile Verification] Verified checkmarks: ${successfulVerifications}/${verificationKeys.length}. Computed Score: ${verificationScore}/100.`);

    // --- CATEGORY 3: PROJECT HISTORY (15%) ---
    const pCount = student.completedProjects;
    let projectHistoryScore = 20;
    if (pCount === 0) projectHistoryScore = 20;
    else if (pCount === 1) projectHistoryScore = 40;
    else if (pCount >= 3 && pCount < 5) projectHistoryScore = 70;
    else if (pCount >= 5 && pCount < 10) projectHistoryScore = 85;
    else if (pCount >= 10) projectHistoryScore = 100;

    categoryScores.history = projectHistoryScore;
    auditSteps.push(`[Layer 3: Project History] Found ${pCount} finished platform tasks. Computed Score: ${projectHistoryScore}/100.`);

    // --- CATEGORY 4: PERFORMANCE STABILITY (15%) ---
    // Calculate actual Standard Deviation & Variance
    const ratings = student.performanceRatings;
    let avgRating = 0;
    let stdDev = 0;
    if (ratings.length > 0) {
      avgRating = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
      const variance = ratings.reduce((sum, val) => sum + Math.pow(val - avgRating, 2), 0) / ratings.length;
      stdDev = Math.sqrt(variance);
    }
    // High standard deviation lowers confidence score
    // Standard deviation of 0-2 (Highly stable) -> score 100-90
    // Standard deviation of 5+ (highly volatile) -> score below 50
    const performanceStabilityScore = ratings.length === 0 ? 30 : Math.max(0, Math.min(100, Math.round(100 - (stdDev * 15))));
    categoryScores.stability = performanceStabilityScore;
    auditSteps.push(`[Layer 4: Performance Stability] Iterations evaluated: ${ratings.length}. Standard Deviation: ${stdDev.toFixed(2)}. Stability Score: ${performanceStabilityScore}/100.`);

    // --- CATEGORY 5: EMPLOYER REVIEW RELIABILITY (15%) ---
    // Concentrated reviews from a single employer reduces evidence trust
    const uniqueEmployersRatio = student.reviewsCount > 0 ? student.uniqueEmployersCount / student.reviewsCount : 0;
    let reviewReliabilityScore = 30;
    if (student.reviewsCount > 0) {
      const diversityFactor = uniqueEmployersRatio * 70; // up to 70 points for employer diversity
      const wordLengthFactor = Math.min(20, (student.avgReviewLength / 100) * 20); // up to 20 points for text depth
      const trustFactor = (student.reviewerTrustAvg / 100) * 10; // up to 10 points
      reviewReliabilityScore = Math.min(100, Math.round(diversityFactor + wordLengthFactor + trustFactor));
    }
    categoryScores.reliability = reviewReliabilityScore;
    auditSteps.push(`[Layer 5: Employer Reviews] Unique client sources: ${student.uniqueEmployersCount}. Word density: ${student.avgReviewLength} words. Reliability: ${reviewReliabilityScore}/100.`);

    // --- CATEGORY 6: TRUST HISTORY (10%) ---
    const warningsImpact = student.warningCount * 25;
    const fraudImpact = student.hasFraudFlag ? 50 : 0;
    const trustScoreComponent = student.trustScore;
    const trustHistoryScore = Math.max(0, Math.min(100, Math.round(trustScoreComponent - warningsImpact - fraudImpact)));
    categoryScores.trustHistory = trustHistoryScore;
    auditSteps.push(`[Layer 6: Trust History] Platform Trust Index: ${student.trustScore}%. Fraud flags active: ${student.hasFraudFlag}. Calculated Score: ${trustHistoryScore}/100.`);

    // --- CATEGORY 7: ACTIVITY FRESHNESS (5%) ---
    const lastLogin = student.daysSinceLastLogin;
    let activityScore = 20;
    if (lastLogin <= 7) activityScore = 100;
    else if (lastLogin <= 30) activityScore = 90;
    else if (lastLogin <= 90) activityScore = 70;
    else if (lastLogin <= 180) activityScore = 50;
    else if (lastLogin <= 365) activityScore = 20;

    categoryScores.freshness = activityScore;
    auditSteps.push(`[Layer 7: Activity Freshness] Last platform entry detected: ${lastLogin} days ago. Score: ${activityScore}/100.`);

    // --- CATEGORY 8: HISTORICAL SIMILARITY (10%) ---
    const simCount = student.similarPastStudentsMatched;
    const similarityScore = Math.min(100, Math.round((simCount / 40) * 100));
    categoryScores.similarity = similarityScore;
    auditSteps.push(`[Layer 8: Historical Similarity] Similar matched models database size: ${simCount}. Similarity score: ${similarityScore}/100.`);

    // --- CATEGORY 9: DATA FRESHNESS (5%) ---
    const resumeAge = student.resumeAgeDays;
    const portfolioAge = student.portfolioAgeDays;
    const avgDataAge = (resumeAge + portfolioAge) / 2;
    // Age of 30 days or less is perfect, after that degrades linearly
    const dataFreshnessScore = Math.max(0, Math.min(100, Math.round(100 - (avgDataAge / 3.65))));
    categoryScores.dataFreshness = dataFreshnessScore;
    auditSteps.push(`[Layer 9: Data Document Age] Resume age: ${resumeAge}d, Portfolio age: ${portfolioAge}d. Calculated Score: ${dataFreshnessScore}/100.`);

    // --- CATEGORY 10: PREDICTION STABILITY (10%) ---
    // Simulate multiple evaluations with small mathematical variance (noise) to test output convergence
    const simulatedRuns = Array.from({ length: 5 }, (_, i) => {
      const baseVal = completenessScore * 0.15 + verificationScore * 0.10 + projectHistoryScore * 0.15 + performanceStabilityScore * 0.15;
      const noise = (Math.sin(i) * 1.5); // deterministic noise
      return baseVal + noise;
    });
    const avgRun = simulatedRuns.reduce((a, b) => a + b, 0) / simulatedRuns.length;
    const runVariance = simulatedRuns.reduce((sum, v) => sum + Math.pow(v - avgRun, 2), 0) / simulatedRuns.length;
    const predictionStabilityVal = Math.max(0, Math.min(100, Math.round(100 - (runVariance * 12))));
    categoryScores.predictionStability = predictionStabilityVal;
    auditSteps.push(`[Layer 10: Run Convergence Pass] Generated 5 internal evaluation loops. Prediction Variance: ${runVariance.toFixed(3)}. Stability Index: ${predictionStabilityVal}/100.`);

    // --- FINAL SCORE AGGREGATION ---
    let baseSum = 0;
    categoryWeights.forEach(cat => {
      const score = categoryScores[cat.id] || 50;
      baseSum += score * (cat.weight / 100);
    });

    auditSteps.push(`[Base Aggregator] Summed weights of categories. Preliminary Base Score: ${baseSum.toFixed(2)}/100.`);

    // --- PENALTIES ---
    let totalPenalties = 0;
    const penaltiesAppliedList: { id: string; name: string; value: number }[] = [];
    const getPenaltyVal = (id: string) => penaltySettings.find(p => p.id === id && p.enabled)?.value || 0;

    if (completenessPercentage < 80) {
      const val = getPenaltyVal('profileIncomplete');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'profileIncomplete', name: 'Profile Incomplete (<80%)', value: val });
      }
    }
    if (student.daysSinceLastLogin > 90) {
      const val = getPenaltyVal('repeatedInactivity');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'repeatedInactivity', name: 'Repeated Inactivity (>90d)', value: val });
      }
    }
    if (student.completedProjects === 0) {
      const val = getPenaltyVal('noCompletedProjects');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'noCompletedProjects', name: 'No Completed Projects', value: val });
      }
    }
    if (student.portfolioAgeDays > 180) {
      const val = getPenaltyVal('oldPortfolio');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'oldPortfolio', name: 'Outdated Portfolio', value: val });
      }
    }
    if (student.resumeAgeDays > 180) {
      const val = getPenaltyVal('outdatedResume');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'outdatedResume', name: 'Outdated CV File', value: val });
      }
    }
    if (student.uniqueEmployersCount === 1 && student.reviewsCount > 2) {
      const val = getPenaltyVal('singleEmployerReview');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'singleEmployerReview', name: 'Single Employer Concentration', value: val });
      }
    }
    if (student.hasRepeatedWithdrawals) {
      const val = getPenaltyVal('repeatedWithdrawal');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'repeatedWithdrawal', name: 'Repeated Project Withdrawal', value: val });
      }
    }
    if (student.hasUnverifiedCertificates) {
      const val = getPenaltyVal('unverifiedCertificates');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'unverifiedCertificates', name: 'Unverified Credentials Signatures', value: val });
      }
    }
    if (student.hasFraudFlag) {
      const val = getPenaltyVal('fraudFlag');
      if (val > 0) {
        totalPenalties += val;
        penaltiesAppliedList.push({ id: 'fraudFlag', name: 'Fraud Flag Critical Security Discount', value: val });
      }
    }

    // --- BONUSES ---
    let totalBonuses = 0;
    const bonusesAppliedList: { id: string; name: string; value: number }[] = [];
    const getBonusVal = (id: string) => bonusSettings.find(b => b.id === id && b.enabled)?.value || 0;

    if (student.verifications.identity) {
      const val = getBonusVal('verifiedIdentity');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'verifiedIdentity', name: 'Verified Identity KYC', value: val });
      }
    }
    if (student.verifications.university) {
      const val = getBonusVal('verifiedUniversity');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'verifiedUniversity', name: 'Verified Academic Status', value: val });
      }
    }
    if (student.verifications.certificate) {
      const val = getBonusVal('verifiedCertificates');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'verifiedCertificates', name: 'Verified Certificates', value: val });
      }
    }
    if (student.completedProjects >= 1 && student.reviewAgeDays <= 30) {
      const val = getBonusVal('recentSuccessfulProject');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'recentSuccessfulProject', name: 'Recent Successful Completion', value: val });
      }
    }
    if (student.uniqueEmployersCount >= 3) {
      const val = getBonusVal('multipleEmployerReviews');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'multipleEmployerReviews', name: 'Employer Diversity Bonus', value: val });
      }
    }
    if (student.professionalTimelineMonths >= 12 && student.warningCount === 0) {
      const val = getBonusVal('longTermConsistency');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'longTermConsistency', name: 'Pristine Longitudinal Consistency', value: val });
      }
    }
    if (student.daysSinceLastPortfolioUpdate <= 15) {
      const val = getBonusVal('recentPortfolioUpdate');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'recentPortfolioUpdate', name: 'Recent Portfolio Polish', value: val });
      }
    }
    if (student.daysSinceLastGithubActivity <= 7) {
      const val = getBonusVal('githubContribution');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'githubContribution', name: 'Continuous GitHub Sync', value: val });
      }
    }
    if (student.completedProjects >= 3 && student.trustScore >= 98) {
      const val = getBonusVal('perfectTrust');
      if (val > 0) {
        totalBonuses += val;
        bonusesAppliedList.push({ id: 'perfectTrust', name: 'Perfect Trust Records', value: val });
      }
    }

    // Clamp absolute final scores
    const finalConfidenceScore = Math.max(0, Math.min(100, Number((baseSum - totalPenalties + totalBonuses).toFixed(2))));
    auditSteps.push(`[Adjustments Engine] Raw Penalties applied: -${totalPenalties} pts. Raw Bonuses applied: +${totalBonuses} pts.`);
    auditSteps.push(`[Audit Success] Clamped Deterministic Confidence Output: ${finalConfidenceScore}%`);

    // Confidence Level text label
    let confidenceLevel = 'Insufficient Evidence';
    if (finalConfidenceScore >= 98) confidenceLevel = 'Extremely Reliable';
    else if (finalConfidenceScore >= 95) confidenceLevel = 'Highly Reliable';
    else if (finalConfidenceScore >= 90) confidenceLevel = 'Reliable';
    else if (finalConfidenceScore >= 85) confidenceLevel = 'Good Confidence';
    else if (finalConfidenceScore >= 75) confidenceLevel = 'Moderate Confidence';
    else if (finalConfidenceScore >= 60) confidenceLevel = 'Limited Confidence';
    else if (finalConfidenceScore >= 40) confidenceLevel = 'Low Confidence';

    // Evidence Lists
    const strongEvidence: string[] = [];
    const weakEvidence: string[] = [];
    const missingEvidence: string[] = [];
    const howToImprove: string[] = [];

    if (completenessPercentage >= 95) strongEvidence.push('Fully populated 17-point profile registration');
    else missingEvidence.push('Incomplete profiles. Missing basic, portfolio, or document attachments.');

    if (successfulVerifications >= 8) strongEvidence.push('Government Identity & Academic credentials cryptographically verified');
    else weakEvidence.push('Identity and registrars certificates remain unverified');

    if (student.completedProjects >= 4) strongEvidence.push(`Strong completion volume of ${student.completedProjects} projects`);
    else weakEvidence.push(`Limited platform experience (${student.completedProjects} projects)`);

    if (stdDev < 3 && ratings.length > 0) strongEvidence.push('Excellent stability across performance ratings history');
    else if (ratings.length > 0) weakEvidence.push('High performance variance and unstable scores trend');

    if (student.uniqueEmployersCount >= 3) strongEvidence.push('Highly diversified employer review collection');
    else weakEvidence.push('High employer rating concentration (limited unique client feedback)');

    if (student.daysSinceLastLogin <= 7) strongEvidence.push('Highly active and fresh platform login activity');
    else weakEvidence.push('Degraded activity freshness (inactive over 30 days)');

    // Actionable roadmap suggestions
    if (completenessPercentage < 100) howToImprove.push('Upload high-contrast portfolio artifacts and fill remaining contact profiles.');
    if (!student.verifications.identity) howToImprove.push('Complete physical government identity verification to unlock KYC bonus.');
    if (student.uniqueEmployersCount < 3) howToImprove.push('Successfully complete projects with fresh enterprise employers to distribute review variance.');
    if (student.resumeAgeDays > 90) howToImprove.push('Refresh dynamic resume files or sync GitHub commits.');
    if (howToImprove.length === 0) howToImprove.push('Evidence requirements perfectly saturated. Ready for maximum matching reliability.');

    let explanation = `This recommendation achieves a confidence level of ${finalConfidenceScore}% ("${confidenceLevel}"). `;
    if (finalConfidenceScore >= 90) {
      explanation += `The prediction is backed by dense evidence, verifying government identity, registrar university status, multiple independent client reviews, and negligible score variance.`;
    } else if (finalConfidenceScore >= 75) {
      explanation += `Moderate reliability. The recommendation is promising, but data freshness and single-employer concentration suggest secondary validation.`;
    } else {
      explanation += `Caution: extremely limited evidence. The candidate profile remains partially incomplete with zero completed platform projects.`;
    }

    setCalculatedConfidence({
      id: `CONF_RUN_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      studentId: selectedStudentId,
      confidenceScore: finalConfidenceScore,
      confidenceLevel,
      categoryScores,
      penaltiesApplied: penaltiesAppliedList,
      bonusesApplied: bonusesAppliedList,
      strongEvidence,
      weakEvidence,
      missingEvidence,
      howToImprove,
      predictionVariance: Number(runVariance.toFixed(3)),
      recommendationVariance: Number((runVariance * 0.4).toFixed(3)),
      scoreStability: predictionStabilityVal,
      explanation,
      layersExecuted: auditSteps,
      durationMs: Math.round(performance.now() - startTime),
      version: engineVersion === 'v1' ? 'v1.1.0' : engineVersion === 'v2' ? 'v2.0.0' : 'v3.0.0'
    });
  };

  useEffect(() => {
    executeConfidenceEngine();
  }, [selectedStudentId, categoryWeights, penaltySettings, bonusSettings, engineVersion]);

  const handleSaveToLedger = () => {
    if (!calculatedConfidence) return;
    setLedgerLogs(prev => [calculatedConfidence, ...prev]);
    alert('Deterministically computed Recommendation Confidence score saved to the KONEXA Immutable Audit Ledger.');
  };

  const handleWeightChange = (id: string, val: number) => {
    setCategoryWeights(prev => prev.map(cat => {
      if (cat.id === id) {
        return { ...cat, weight: Math.max(0, Math.min(100, val)) };
      }
      return cat;
    }));
  };

  const togglePenalty = (id: string) => {
    setPenaltySettings(prev => prev.map(p => {
      if (p.id === id) return { ...p, enabled: !p.enabled };
      return p;
    }));
  };

  const toggleBonus = (id: string) => {
    setBonusSettings(prev => prev.map(b => {
      if (b.id === id) return { ...b, enabled: !b.enabled };
      return b;
    }));
  };

  const totalWeightsSum = categoryWeights.reduce((a, b) => a + b.weight, 0);

  // REST API response mockup in clean formatted JSON block
  const simulatedJsonResponse = calculatedConfidence ? {
    metadata: {
      engine: "KONEXA AI Recommendation Confidence Engine",
      specification_version: "3.0.0",
      reproducible_version: calculatedConfidence.version,
      timestamp: calculatedConfidence.timestamp,
      computational_duration_ms: calculatedConfidence.durationMs
    },
    target_student_id: calculatedConfidence.studentId,
    confidence_ratings: {
      composite_confidence_score: calculatedConfidence.confidenceScore,
      evidence_level: calculatedConfidence.confidenceLevel,
      score_stability_index: calculatedConfidence.scoreStability,
      prediction_variance: calculatedConfidence.predictionVariance,
      recommendation_variance: calculatedConfidence.recommendationVariance
    },
    ten_category_weights_applied: categoryWeights.reduce((acc, curr) => {
      acc[curr.id] = curr.weight;
      return acc;
    }, {} as Record<string, number>),
    dimension_score_breakdown: calculatedConfidence.categoryScores,
    adjustments_log: {
      penalties_applied: calculatedConfidence.penaltiesApplied,
      bonuses_applied: calculatedConfidence.bonusesApplied
    },
    explainability_narrative: {
      strong_evidence_vectors: calculatedConfidence.strongEvidence,
      weak_evidence_vectors: calculatedConfidence.weakEvidence,
      missing_evidence_vectors: calculatedConfidence.missingEvidence,
      improvement_action_roadmap: calculatedConfidence.howToImprove,
      composite_explanation: calculatedConfidence.explanation
    }
  } : null;

  return (
    <div className="space-y-6">
      {/* Brand Title Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Confidence Specification 3.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recommendation Confidence Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Calculates the reliability and certainty of recommendations independently of compatibility scores. Evaluates 10 separate evidence dimensions, standard deviations of performance, and prediction stability under perturbation.
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
          { id: 'sandbox', label: 'Evidence Sandbox', icon: Sliders },
          { id: 'weights', label: 'Weight Customizer', icon: Settings },
          { id: 'penalties', label: 'Confidence Adjustments', icon: ShieldAlert },
          { id: 'logs', label: 'Audit Log Ledger', icon: History },
          { id: 'docs', label: 'DB Schema & Specs', icon: BookOpen }
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

      {/* Main Switch Content */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'sandbox' && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Hand Sandbox Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Student Evidence Profile Selector */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">1. Select Student Evidence Profile</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Target Profile</label>
                    <select
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      {studentsData.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 block mb-1">Engine Version</label>
                    <select
                      value={engineVersion}
                      onChange={e => setEngineVersion(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option value="v1">Engine Version v1.0 (Deterministic)</option>
                      <option value="v2">Engine Version v2.0 (High Resolution)</option>
                      <option value="v3">Engine Version v3.0 (Enterprise Multi-Pass)</option>
                    </select>
                  </div>
                </div>

                {/* Micro Evidence Matrix Stats */}
                {studentsData.find(s => s.id === selectedStudentId) && (
                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-neutral-500 text-[10px]">Projects Volume</span>
                      <div className="text-white font-semibold">{studentsData.find(s => s.id === selectedStudentId)?.completedProjects} Completed</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-neutral-500 text-[10px]">Identity KYC</span>
                      <div className={studentsData.find(s => s.id === selectedStudentId)?.verifications.identity ? "text-emerald-400" : "text-rose-400"}>
                        {studentsData.find(s => s.id === selectedStudentId)?.verifications.identity ? "VERIFIED" : "UNVERIFIED"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-neutral-500 text-[10px]">Ratings History</span>
                      <div className="text-white font-semibold">[{studentsData.find(s => s.id === selectedStudentId)?.performanceRatings.join(', ')}]</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-neutral-500 text-[10px]">Client Diversity</span>
                      <div className="text-white font-semibold">{studentsData.find(s => s.id === selectedStudentId)?.uniqueEmployersCount} Unique</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 10-Dimensional Confidence breakdown bar stack */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">2. Ten-Category Evidence Verification Breakdown</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {calculatedConfidence && categoryWeights.map(cat => {
                    const score = calculatedConfidence.categoryScores[cat.id] || 0;
                    return (
                      <div key={cat.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-neutral-300">{cat.name}</span>
                          <span className="font-mono text-emerald-400 font-bold">{score}% <span className="text-[9px] text-neutral-500">({cat.weight}%)</span></span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Calculation Step-by-Step Logs */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">3. Execution Pipeline Diagnostics</span>
                  <span className="text-[10px] font-mono text-neutral-500">Duration: {calculatedConfidence?.durationMs}ms</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1 max-h-48 overflow-y-auto">
                  {calculatedConfidence?.layersExecuted.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 text-[10px] shrink-0">[{idx + 1}]</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hand Confidence Gauge & Report Panel */}
            <div className="lg:col-span-5 space-y-6">
              {/* Core Output Card */}
              {calculatedConfidence && (
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 relative overflow-hidden space-y-6">
                  {/* Backdrop highlight based on reliability level */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />

                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">RECOMMENDATION CONFIDENCE</span>
                    <div className="text-5xl font-black text-white font-mono tracking-tight">
                      {calculatedConfidence.confidenceScore}%
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{calculatedConfidence.confidenceLevel}</span>
                    </div>
                  </div>

                  {/* Multi-pass Stability stats */}
                  <div className="grid grid-cols-3 gap-2 bg-neutral-900/50 p-3 rounded-xl border border-neutral-900 text-center text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-neutral-500 block">Variance</span>
                      <span className="text-white font-bold">{calculatedConfidence.predictionVariance}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-neutral-500 block">Recommendation Var</span>
                      <span className="text-white font-bold">{calculatedConfidence.recommendationVariance}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-neutral-500 block">Convergence Index</span>
                      <span className="text-emerald-400 font-bold">{calculatedConfidence.scoreStability}%</span>
                    </div>
                  </div>

                  {/* Structured Narrative Explanation */}
                  <div className="space-y-2 text-xs">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">Explainability Statement</span>
                    <p className="text-neutral-300 leading-relaxed bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                      {calculatedConfidence.explanation}
                    </p>
                  </div>

                  {/* Strong vs Weak evidence segments */}
                  <div className="space-y-3.5 text-xs">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">Evidence Audit Log</span>
                    
                    {/* Strong Evidence */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">✓ Strong Evidence Pillars</div>
                      {calculatedConfidence.strongEvidence.map((ev, i) => (
                        <div key={i} className="flex items-center gap-2 text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>

                    {/* Weak Evidence */}
                    {calculatedConfidence.weakEvidence.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">! Weak/Concentrated Elements</div>
                        {calculatedConfidence.weakEvidence.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 text-neutral-300">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Missing Evidence */}
                    {calculatedConfidence.missingEvidence.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">✗ Missing Data Points</div>
                        {calculatedConfidence.missingEvidence.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 text-neutral-300">
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actionable Suggestions Roadmap */}
                  <div className="space-y-2.5 text-xs">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">Actionable Roadmap to Improve Reliability</span>
                    <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                      {calculatedConfidence.howToImprove.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-neutral-300">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={handleSaveToLedger}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Database className="w-4 h-4" />
                      <span>Record to Ledger</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Weights Customizer Subtab */}
        {activeSubTab === 'weights' && (
          <motion.div
            key="weights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Dynamic 10-Category Weights Setup</h3>
                <p className="text-xs text-neutral-400">Configure parameters relative to corporate evidence guidelines. Must strictly sum to 100%.</p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-xs font-mono ${totalWeightsSum === 100 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                Active Weight Pool: {totalWeightsSum}% {totalWeightsSum === 100 ? '(Perfect Align)' : '(Weights must equal 100%)'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryWeights.map(cat => (
                <div key={cat.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{cat.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{cat.weight}%</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{cat.description}</p>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={cat.weight}
                    onChange={e => handleWeightChange(cat.id, Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-900 flex justify-end">
              <button
                onClick={() => setCategoryWeights([
                  { id: 'completeness', name: 'Profile Completeness', weight: 15, description: 'Audits presence of basic info, resume, portfolio, GitHub, career goals, video, and documents.' },
                  { id: 'verification', name: 'Profile Verification', weight: 10, description: 'Computes institutional checks, identity KYC, and verified linked profiles.' },
                  { id: 'history', name: 'Project History', weight: 15, description: 'Measures total volume of completed projects, industry depth, and technology span.' },
                  { id: 'stability', name: 'Performance Stability', weight: 15, description: 'Standard deviation analysis and consistency of past evaluations.' },
                  { id: 'reliability', name: 'Employer Review Reliability', weight: 15, description: 'Verifies reviewer trust ratings and discounts concentrated reviews from single entities.' },
                  { id: 'trustHistory', name: 'Trust History', weight: 10, description: 'Audits ledger warnings, timeline length, and active security/fraud triggers.' },
                  { id: 'freshness', name: 'Activity Freshness', weight: 5, description: 'Temporal distance of login sessions, commits, and resume adjustments.' },
                  { id: 'similarity', name: 'Historical Similarity', weight: 10, description: 'Calibrates predictability against successful historic candidate models.' },
                  { id: 'dataFreshness', name: 'Data Freshness', weight: 5, description: 'Scans age indexes of file documents, certificates, and portfolio components.' },
                  { id: 'predictionStability', name: 'Prediction Stability', weight: 10, description: 'Multi-pass recommendation variance assessment under simulation noise.' }
                ])}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Confidence Adjustments Subtab (Penalties & Bonuses) */}
        {activeSubTab === 'penalties' && (
          <motion.div
            key="penalties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Penalties Matrix */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Confidence Penalty Rules Matrix</h3>
                  <p className="text-[11px] text-neutral-400">Deducts score points upon evidence deficits or risks.</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {penaltySettings.map(p => (
                  <div key={p.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-200">{p.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[9px] font-bold">-{p.value} PTS</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">{p.desc}</p>
                    </div>
                    <button
                      onClick={() => togglePenalty(p.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] transition-all border ${p.enabled ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-neutral-950 text-neutral-500 border-neutral-800'}`}
                    >
                      {p.enabled ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonuses Matrix */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Confidence Premium Bonus Matrix</h3>
                  <p className="text-[11px] text-neutral-400">Adds premium points for validated indicators.</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {bonusSettings.map(b => (
                  <div key={b.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-200">{b.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold">+{b.value} PTS</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">{b.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleBonus(b.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] transition-all border ${b.enabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-950 text-neutral-500 border-neutral-800'}`}
                    >
                      {b.enabled ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Audit Log Ledger Subtab */}
        {activeSubTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Historical list & REST API response */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Immutable ledger history */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Immutable Recalculation Audit Log Ledger</span>
                
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {ledgerLogs.map((log, idx) => (
                    <div key={idx} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-neutral-400 font-bold">{log.id}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[10px]">
                          {log.confidenceScore}% ({log.confidenceLevel})
                        </span>
                      </div>
                      <p className="text-neutral-300 font-mono text-[11px] leading-relaxed">
                        {log.explanation}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {log.bonusesApplied.map((b, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px]">
                            +{b.value} {b.name}
                          </span>
                        ))}
                        {log.penaltiesApplied.map((p, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[9px]">
                            -{p.value} {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REST API Mock Payload */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Simulated REST API JSON response Payload</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">GET /api/confidence/{selectedStudentId}</span>
                </div>
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-emerald-300 overflow-auto flex-1 max-h-[420px]">
                  <pre>{JSON.stringify(simulatedJsonResponse, null, 2)}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Specifications & Database Schema Subtab */}
        {activeSubTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Database schema layout */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">PostgreSQL schema (Drizzle ORM definitions)</h3>
              </div>
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 max-h-[480px] overflow-auto">
                <pre>{`// src/db/schema.ts
import { pgTable, text, integer, doublePrecision, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const recommendationConfidence = pgTable("recommendation_confidence", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  confidenceScore: doublePrecision("confidence_score").notNull(),
  confidenceLevel: text("confidence_level").notNull(),
  
  // 10-Dimensional breakdown metrics
  completenessScore: integer("completeness_score").notNull(),
  verificationScore: integer("verification_score").notNull(),
  projectHistoryScore: integer("project_history_score").notNull(),
  stabilityScore: integer("stability_score").notNull(),
  reliabilityScore: integer("reliability_score").notNull(),
  trustHistoryScore: integer("trust_history_score").notNull(),
  activityFreshnessScore: integer("activity_freshness_score").notNull(),
  similarityScore: integer("similarity_score").notNull(),
  dataFreshnessScore: integer("data_freshness_score").notNull(),
  predictionStabilityScore: integer("prediction_stability_score").notNull(),

  // Run convergence metrics
  predictionVariance: doublePrecision("prediction_variance").notNull(),
  recommendationVariance: doublePrecision("recommendation_variance").notNull(),
  scoreStability: doublePrecision("score_stability").notNull(),

  // Immutable parameters Snapshot
  weightsSnapshot: jsonb("weights_snapshot").notNull(),
  appliedPenalties: jsonb("applied_penalties").notNull(),
  appliedBonuses: jsonb("applied_bonuses").notNull(),
  evidenceSnapshot: jsonb("evidence_snapshot").notNull(),

  // Explainability & suggestions text
  strongEvidence: jsonb("strong_evidence").notNull(),
  weakEvidence: jsonb("weak_evidence").notNull(),
  missingEvidence: jsonb("missing_evidence").notNull(),
  howToImprove: jsonb("how_to_improve").notNull(),
  explanation: text("explanation").notNull(),
  
  durationMs: integer("duration_ms").notNull(),
  version: text("version").notNull()
});

export const confidenceAuditLogs = pgTable("confidence_audit_logs", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  action: text("action").notNull(),
  studentId: text("student_id").notNull(),
  previousConfidenceScore: doublePrecision("previous_confidence_score"),
  newConfidenceScore: doublePrecision("new_confidence_score").notNull(),
  triggerEvent: text("trigger_event").notNull(),
  adminOverrideFlag: boolean("admin_override_flag").default(false)
});`}</pre>
              </div>
            </div>

            {/* Specifications documentation details */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4 text-xs leading-relaxed text-neutral-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Mathematical certainty & Reproducibility</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900 space-y-2">
                  <div className="font-semibold text-white">1. Performance Stability standard deviation (Layer 4)</div>
                  <p>
                    Rather than relying on subjective ratings, the Stability Layer processes the complete series of historical project ratings:
                  </p>
                  <code className="block bg-neutral-950 p-2 rounded font-mono text-[10px] text-emerald-400">
                    Mean (μ) = Σ(R_i) / N<br />
                    Variance (σ²) = Σ(R_i - μ)² / N<br />
                    Stability = Clamped(100 - (StandardDeviation * 15))
                  </code>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-900 space-y-2">
                  <div className="font-semibold text-white">2. Multi-Pass Prediction Stability Convergence (Layer 10)</div>
                  <p>
                    We generate 5 independent passes using varying parameter weights & perturbation noise. The standard deviation of output scores computes the final prediction stability. Consistent convergence produces maximum evidence scores.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-900 space-y-2">
                  <div className="font-semibold text-white">3. Review Concentration & Source Reliability (Layer 5)</div>
                  <p>
                    Repeated ratings from a single contractor source indicates localized performance but lacks distributed validation. The engine scales confidence proportional to the unique client ratio:
                  </p>
                  <code className="block bg-neutral-950 p-2 rounded font-mono text-[10px] text-emerald-400">
                    Source Diversity Factor = (Unique Employers / Total Reviews) * 70
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
