import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Settings,
  Scale,
  Calculator,
  History,
  ShieldAlert,
  AlertCircle,
  TrendingUp,
  FileText,
  User,
  Activity,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Info,
  Sliders,
  Play,
  RotateCcw,
  Plus,
  ShieldCheck,
  Check,
  X,
  FileSpreadsheet,
  Briefcase,
  Users,
  Percent,
  Clock,
  Heart,
  UserCheck,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';

interface CompanyWeight {
  id: string;
  name: string;
  weight: number; // e.g., 15 for 15%
  description: string;
}

interface CompanyAuditLog {
  id: string;
  timestamp: string;
  version: string;
  companyId: string;
  companyName: string;
  triggerEvent: string;
  previousScore: number;
  newScore: number;
  scoreLevel: string;
  weights: Record<string, number>;
  categoryScores: Record<string, number>;
  fraudAlerts: string[];
}

export default function CompanyScoreEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'calc' | 'weights' | 'penalties' | 'fraud' | 'audits' | 'spec'>('calc');

  // 1. Company Weights Configuration (Sum to exactly 100%)
  const [weights, setWeights] = useState<CompanyWeight[]>([
    { id: 'comm', name: 'Communication', weight: 15, description: 'Evaluates first-response times, unread messages, ignored student questions, and meetings conduct.' },
    { id: 'feedback', name: 'Feedback Quality', weight: 20, description: 'Measures completeness, detail level, actionability, and timeliness of review submissions.' },
    { id: 'project_mgnt', name: 'Project Management', weight: 20, description: 'Tracks goal publishing punctuality, scope stability, milestone completions, and cancellations.' },
    { id: 'hiring', name: 'Hiring Reliability', weight: 15, description: 'Reflects ghosting instances, offer acceptance/withdrawal rates, and interview punctuality.' },
    { id: 'response_speed', name: 'Response Speed', weight: 10, description: 'Measures review latency for applications, weekly deliverables, and query replies.' },
    { id: 'satisfaction', name: 'Student Satisfaction', weight: 15, description: 'Aggregated, outlier-filtered anonymous evaluation scores from student cohorts.' },
    { id: 'professionalism', name: 'Professionalism', weight: 5, description: 'Tracks business ethics, integrity, inclusivity, and respectful conduct evaluation averages.' }
  ]);

  const [weightEditState, setWeightEditState] = useState<Record<string, number>>({
    comm: 15,
    feedback: 20,
    project_mgnt: 20,
    hiring: 15,
    response_speed: 10,
    satisfaction: 15,
    professionalism: 5
  });

  const [weightError, setWeightError] = useState<string | null>(null);

  // Sync edits state
  useEffect(() => {
    const editObj: Record<string, number> = {};
    weights.forEach(w => { editObj[w.id] = w.weight; });
    setWeightEditState(editObj);
  }, [weights]);

  const handleWeightChange = (id: string, val: number) => {
    setWeightEditState(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(100, val))
    }));
  };

  const saveWeights = () => {
    const total = Object.values(weightEditState).reduce((a: number, b: number) => a + b, 0);
    if (total !== 100) {
      setWeightError(`Weights sum must be exactly 100%. Current sum: ${total}%`);
      return;
    }
    setWeightError(null);
    setWeights(prev => prev.map(w => ({ ...w, weight: weightEditState[w.id] })));
    alert('Company Score Category weights configuration updated. Future calculations will automatically apply this version.');
  };

  // 2. Calculator Input Parameters
  const [companyId, setCompanyId] = useState('COMP_NEXUS_CORE');
  const [companyName, setCompanyName] = useState('Nexus Core Corp');
  const [triggerEvent, setTriggerEvent] = useState('COMPANY_REVIEW_SUBMITTED');
  const [algorithmVersion, setAlgorithmVersion] = useState('v1.0.0 (Traceable)');

  // Category 1: Communication
  const [empCommRating, setEmpCommRating] = useState(4.5); // 1 to 5 scale
  const [avgResponseHours, setAvgResponseHours] = useState(1.8); // Converted to score
  const [missedMeetings, setMissedMeetings] = useState(0);
  const [ignoredQuestions, setIgnoredQuestions] = useState(0);

  // Category 2: Feedback Quality
  const [hasDetailedFeedback, setHasDetailedFeedback] = useState(true); // +20
  const [hasConstructiveSuggestions, setHasConstructiveSuggestions] = useState(true); // +20
  const [allCategoriesCompleted, setAllCategoriesCompleted] = useState(true); // +20
  const [submittedBeforeDeadline, setSubmittedBeforeDeadline] = useState(true); // +20
  const [studentRatedHelpful, setStudentRatedHelpful] = useState(true); // +20
  const [lateReviewCount, setLateReviewCount] = useState(0); // -10 per count
  const [emptyFeedbackCount, setEmptyFeedbackCount] = useState(0); // -30 per count
  const [belowMinLengthCount, setBelowMinLengthCount] = useState(0); // -20 per count

  // Category 3: Project Management
  const [projectsFinishedSuccess, setProjectsFinishedSuccess] = useState(3); // +40 each (capped)
  const [goalsPublishedOnTime, setGoalsPublishedOnTime] = useState(true); // +20
  const [milestonesCompleted, setMilestonesCompleted] = useState(true); // +20
  const [studentsRatedClear, setStudentsRatedClear] = useState(true); // +20
  const [projectCancelledCount, setProjectCancelledCount] = useState(0); // -40 per count
  const [scopeChangeOverkill, setScopeChangeOverkill] = useState(false); // -20 if true
  const [missedGoalCreationCount, setMissedGoalCreationCount] = useState(0); // -10 per count

  // Category 4: Hiring Reliability
  const [decisionDelayDays, setDecisionDelayDays] = useState(6); // 1-7 days: 100, 8-14: 90, 15-30: 70, >30: 50, No dec: 20
  const [ghostingStudentCount, setGhostingStudentCount] = useState(0); // -40 per count
  const [withdrawOfferCount, setWithdrawOfferCount] = useState(0); // -30 per count

  // Category 5: Response Speed
  const [appReviewTimeHours, setAppReviewTimeHours] = useState(18); // within 24h = 100, 48h = 90, 72h = 80, 5d = 60, >7d = 30, none = 0

  // Category 6: Student Satisfaction (Anonymous 1~5 ratings, average scaled)
  const [satComm, setSatComm] = useState(5);
  const [satMentorship, setSatMentorship] = useState(4);
  const [satProf, setSatProf] = useState(5);
  const [satRespect, setSatRespect] = useState(5);
  const [satLearning, setSatLearning] = useState(4);
  const [satOrg, setSatOrg] = useState(4);
  const [satMatch, setSatMatch] = useState(4);
  const [satCareer, setSatCareer] = useState(5);
  const [satFairness, setSatFairness] = useState(5);
  const [simulateOutlierReview, setSimulateOutlierReview] = useState(false); // filters review if excessive bias

  // Category 7: Professionalism Student Evaluation (1~5 rating scale)
  const [profRespectRating, setProfRespectRating] = useState(4.8);
  const [profEthicsRating, setProfEthicsRating] = useState(5.0);
  const [profConductRating, setProfConductRating] = useState(4.6);
  const [profInclusivityRating, setProfInclusivityRating] = useState(4.8);
  const [profReliabilityRating, setProfReliabilityRating] = useState(4.7);
  const [profIntegrityRating, setProfIntegrityRating] = useState(4.9);

  // Penalty System Variables
  const [penaltyAbusiveReports, setPenaltyAbusiveReports] = useState(0); // -15 points each (Direct company score penalty)
  const [penaltyFakeJobPosts, setPenaltyFakeJobPosts] = useState(0); // -25 points each
  const [penaltyPolicyViolations, setPenaltyPolicyViolations] = useState(0); // -50 points each (Immediate manual trigger check)

  // Edge Case Simulators
  const [edgeCase, setEdgeCase] = useState<'NONE' | 'INSUFFICIENT' | 'CANCELLED' | 'SUSPENDED'>('NONE');

  // Outputs State
  const [outputs, setOutputs] = useState({
    commScore: 0,
    feedbackScore: 0,
    pmScore: 0,
    hiringScore: 0,
    speedScore: 0,
    satScore: 0,
    profScore: 0,
    finalScore: 0,
    scoreLevel: 'Standard',
    confidence: 100,
    traceFormula: '',
    fraudAlerts: [] as string[],
    isUnderReview: false
  });

  // Simulated Immutable Ledger
  const [auditLogs, setAuditLogs] = useState<CompanyAuditLog[]>([
    {
      id: 'AUD_COMP_9901',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      version: 'v1.0.0 (Traceable)',
      companyId: 'COMP_NEXUS_CORE',
      companyName: 'Nexus Core Corp',
      triggerEvent: 'COMPANY_REVIEW_SUBMITTED',
      previousScore: 92.1,
      newScore: 94.65,
      scoreLevel: 'Excellent',
      weights: { comm: 15, feedback: 20, project_mgnt: 20, hiring: 15, response_speed: 10, satisfaction: 15, professionalism: 5 },
      categoryScores: { comm: 95, feedback: 100, project_mgnt: 90, hiring: 100, response_speed: 100, satisfaction: 91, professionalism: 96 },
      fraudAlerts: []
    },
    {
      id: 'AUD_COMP_9784',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      version: 'v1.0.0 (Traceable)',
      companyId: 'COMP_NEXUS_CORE',
      companyName: 'Nexus Core Corp',
      triggerEvent: 'PROJECT_COMPLETED',
      previousScore: 89.4,
      newScore: 92.1,
      scoreLevel: 'Excellent',
      weights: { comm: 15, feedback: 20, project_mgnt: 20, hiring: 15, response_speed: 10, satisfaction: 15, professionalism: 5 },
      categoryScores: { comm: 90, feedback: 95, project_mgnt: 88, hiring: 100, response_speed: 90, satisfaction: 89, professionalism: 94 },
      fraudAlerts: []
    }
  ]);

  // Execute Core Calculation
  const runCalculation = () => {
    // Edge Case: SUSPENDED
    if (edgeCase === 'SUSPENDED') {
      setOutputs({
        commScore: 0, feedbackScore: 0, pmScore: 0, hiringScore: 0, speedScore: 0, satScore: 0, profScore: 0,
        finalScore: 0,
        scoreLevel: 'Restricted (Suspended)',
        confidence: 0,
        traceFormula: 'Company account is currently suspended due to high policy violation threshold. Scores are forced to 0.',
        fraudAlerts: ['CRITICAL WARNING: Company is in SUSPENDED state.'],
        isUnderReview: true
      });
      return;
    }

    // Edge Case: INSUFFICIENT
    if (edgeCase === 'INSUFFICIENT' || projectsFinishedSuccess === 0) {
      setOutputs({
        commScore: 0, feedbackScore: 0, pmScore: 0, hiringScore: 0, speedScore: 0, satScore: 0, profScore: 0,
        finalScore: 0,
        scoreLevel: 'Insufficient Data',
        confidence: 20,
        traceFormula: 'Confidence score below 30% threshold. Requires at least 1 completed project collaboration.',
        fraudAlerts: [],
        isUnderReview: false
      });
      return;
    }

    // 1. Communication Score (15%)
    // Base: Employer Communication Rating (Average 1~5 Rating) * 20
    const rawCommBase = empCommRating * 20;

    // System speed conversion: <2h: 100, 2-6: 95, 6-12: 90, 12-24: 80, 24-48: 60, 48-72: 40, >72: 10
    let sysCommSpeedScore = 10;
    if (avgResponseHours < 2) sysCommSpeedScore = 100;
    else if (avgResponseHours <= 6) sysCommSpeedScore = 95;
    else if (avgResponseHours <= 12) sysCommSpeedScore = 90;
    else if (avgResponseHours <= 24) sysCommSpeedScore = 80;
    else if (avgResponseHours <= 48) sysCommSpeedScore = 60;
    else if (avgResponseHours <= 72) sysCommSpeedScore = 40;

    // Penalties: Missed Meeting: -10 each, Ignored Student Question: -5 each
    const meetingPenalty = missedMeetings * 10;
    const questionPenalty = ignoredQuestions * 5;
    const finalSysComm = Math.max(0, Math.min(100, sysCommSpeedScore - meetingPenalty - questionPenalty));

    // Combine: Rating * 70% + System Metrics * 30%
    const commScore = Math.max(0, Math.min(100, (rawCommBase * 0.70) + (finalSysComm * 0.30)));

    // 2. Feedback Quality Score (20%)
    // Positive factors: detailed (+20), constructive (+20), all categories (+20), before deadline (+20), helpful rating (+20)
    let feedbackScoreBase = 0;
    if (hasDetailedFeedback) feedbackScoreBase += 20;
    if (hasConstructiveSuggestions) feedbackScoreBase += 20;
    if (allCategoriesCompleted) feedbackScoreBase += 20;
    if (submittedBeforeDeadline) feedbackScoreBase += 20;
    if (studentRatedHelpful) feedbackScoreBase += 20;

    // Negatives: late review (-10 each), empty (-30 each), below min length (-20 each)
    const feedbackPenalties = (lateReviewCount * 10) + (emptyFeedbackCount * 30) + (belowMinLengthCount * 20);
    const feedbackScore = Math.max(0, Math.min(100, feedbackScoreBase - feedbackPenalties));

    // 3. Project Management Score (20%)
    // Positives: finished success (+40), goals on time (+20), milestone completed (+20), clear rating (+20)
    let pmScoreBase = 0;
    if (projectsFinishedSuccess > 0) {
      pmScoreBase += Math.min(40, projectsFinishedSuccess * 20); // cap max success contribution to 40
    }
    if (goalsPublishedOnTime) pmScoreBase += 20;
    if (milestonesCompleted) pmScoreBase += 20;
    if (studentsRatedClear) pmScoreBase += 20;

    // Negatives: cancelled without reason (-40), scope overkill (-20), missed goals (-10)
    const pmPenalties = (projectCancelledCount * 40) + (scopeChangeOverkill ? 20 : 0) + (missedGoalCreationCount * 10);
    const pmScore = Math.max(0, Math.min(100, pmScoreBase - pmPenalties));

    // 4. Hiring Reliability Score (15%)
    // Delay Conversion: <=7 days: 100, <=14 days: 90, <=30: 70, >30: 50, No decision: 20
    let hiringBase = 20;
    if (decisionDelayDays <= 7) hiringBase = 100;
    else if (decisionDelayDays <= 14) hiringBase = 90;
    else if (decisionDelayDays <= 30) hiringBase = 70;
    else if (decisionDelayDays > 30) hiringBase = 50;

    // Penalties: Ghosting Student (-40 each), Withdraw Offer (-30 each)
    const hiringPenalties = (ghostingStudentCount * 40) + (withdrawOfferCount * 30);
    const hiringScore = Math.max(0, Math.min(100, hiringBase - hiringPenalties));

    // 5. Response Speed (10%)
    // Application reviewed: <=24h: 100, <=48h: 90, <=72h: 80, <=5 days: 60, >7 days: 30, no review: 0
    let speedScore = 0;
    if (appReviewTimeHours <= 24) speedScore = 100;
    else if (appReviewTimeHours <= 48) speedScore = 90;
    else if (appReviewTimeHours <= 72) speedScore = 80;
    else if (appReviewTimeHours <= 120) speedScore = 60;
    else if (appReviewTimeHours > 120) speedScore = 30;

    // 6. Student Satisfaction (15%)
    // Average 9 sub categories (1~5 scale, converted to 100-point scale)
    const satisfactionRatings = [satComm, satMentorship, satProf, satRespect, satLearning, satOrg, satMatch, satCareer, satFairness];
    let avgSatRating = satisfactionRatings.reduce((a, b) => a + b, 0) / satisfactionRatings.length;
    
    // Simulating Outlier Filtering Filter Check
    if (simulateOutlierReview) {
      // Remove lowest score to filter student retaliatory bias (Outlier Filter Constraint)
      const filtered = [...satisfactionRatings].sort((a, b) => a - b).slice(1);
      avgSatRating = filtered.reduce((a, b) => a + b, 0) / filtered.length;
    }
    const satScore = Math.max(0, Math.min(100, avgSatRating * 20));

    // 7. Professionalism Student Evaluation (5%)
    const profRatings = [profRespectRating, profEthicsRating, profConductRating, profInclusivityRating, profReliabilityRating, profIntegrityRating];
    const avgProfRating = profRatings.reduce((a, b) => a + b, 0) / profRatings.length;
    const profScore = Math.max(0, Math.min(100, avgProfRating * 20));

    // --- FRAUD DETECTION CHECKS ---
    const fraudAlerts: string[] = [];
    
    // Check 1: Mass Maximum Ratings
    const satIsAllFive = satisfactionRatings.every(r => r === 5);
    if (satIsAllFive) {
      fraudAlerts.push('Mass Perfect Ratings Flagged: Suspicious network alignment. All 9 student experience parameters are exactly 5.0/5.');
    }

    // Check 2: Mass Minimum Ratings
    const satIsAllOne = satisfactionRatings.every(r => r === 1);
    if (satIsAllOne) {
      fraudAlerts.push('Review Bombing Warning: Students returned 1.0/5 across all parameters. Flagged for verification check.');
    }

    // Check 3: Suspicious Hiring Pattern
    if (ghostingStudentCount >= 2) {
      fraudAlerts.push('Repeated Ghosting Alert: Immediate warning triggers manual reputational risk review.');
    }

    // Check 4: Suspicious Cancellation
    if (projectCancelledCount >= 2) {
      fraudAlerts.push('Abrupt Multi-Project Termination Flag: Score penalized for unstable internship cycles.');
    }

    // --- FINAL SCORE CALCULATION WITH CONFIGURABLE WEIGHTS ---
    const getWeight = (id: string) => (weights.find(w => w.id === id)?.weight || 0) / 100;

    let baseFinalScore =
      (commScore * getWeight('comm')) +
      (feedbackScore * getWeight('feedback')) +
      (pmScore * getWeight('project_mgnt')) +
      (hiringScore * getWeight('hiring')) +
      (speedScore * getWeight('response_speed')) +
      (satScore * getWeight('satisfaction')) +
      (profScore * getWeight('professionalism'));

    // Apply Global Direct Platform Penalty Deductions:
    const directPenalties = (penaltyAbusiveReports * 15) + (penaltyFakeJobPosts * 25) + (penaltyPolicyViolations * 50);
    baseFinalScore = Math.max(0, Math.min(100, baseFinalScore - directPenalties));

    const finalScore = Number(baseFinalScore.toFixed(2));

    // Convert to Company Rank Levels
    // 97~100: Elite Partner, 93~96.99: Excellent, 90~92.99: Highly Recommended, 85~89.99: Recommended, 80~84.99: Trusted, 75~79.99: Standard, 70~74.99: Needs Improvement, 60~69.99: High Risk, <60: Restricted
    let level = 'Standard';
    if (finalScore >= 97) level = 'Elite Partner';
    else if (finalScore >= 93) level = 'Excellent';
    else if (finalScore >= 90) level = 'Highly Recommended';
    else if (finalScore >= 85) level = 'Recommended';
    else if (finalScore >= 80) level = 'Trusted';
    else if (finalScore >= 75) level = 'Standard';
    else if (finalScore >= 70) level = 'Needs Improvement';
    else if (finalScore >= 60) level = 'High Risk';
    else level = 'Restricted';

    // Trace Formula Generation
    const formulaStr = `(${commScore.toFixed(1)} * ${getWeight('comm')}) + (${feedbackScore.toFixed(1)} * ${getWeight('feedback')}) + (${pmScore.toFixed(1)} * ${getWeight('project_mgnt')}) + (${hiringScore.toFixed(1)} * ${getWeight('hiring')}) + (${speedScore.toFixed(1)} * ${getWeight('response_speed')}) + (${satScore.toFixed(1)} * ${getWeight('satisfaction')}) + (${profScore.toFixed(1)} * ${getWeight('professionalism')}) - [Direct Penalties: ${directPenalties}] = ${finalScore}`;

    const isUnderReview = fraudAlerts.length > 0 || penaltyPolicyViolations > 0;

    setOutputs({
      commScore: Number(commScore.toFixed(2)),
      feedbackScore: Number(feedbackScore.toFixed(2)),
      pmScore: Number(pmScore.toFixed(2)),
      hiringScore: Number(hiringScore.toFixed(2)),
      speedScore: Number(speedScore.toFixed(2)),
      satScore: Number(satScore.toFixed(2)),
      profScore: Number(profScore.toFixed(2)),
      finalScore,
      scoreLevel: level,
      confidence: edgeCase === 'CANCELLED' ? 70 : 100,
      traceFormula: formulaStr,
      fraudAlerts,
      isUnderReview
    });

    // Write audit log automatically
    const newLog: CompanyAuditLog = {
      id: `AUD_COMP_${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      version: algorithmVersion,
      companyId,
      companyName,
      triggerEvent,
      previousScore: outputs.finalScore || 88.0,
      newScore: finalScore,
      scoreLevel: level,
      weights: weights.reduce((acc, w) => ({ ...acc, [w.id]: w.weight }), {}),
      categoryScores: {
        comm: Number(commScore.toFixed(2)),
        feedback: Number(feedbackScore.toFixed(2)),
        project_mgnt: Number(pmScore.toFixed(2)),
        hiring: Number(hiringScore.toFixed(2)),
        response_speed: Number(speedScore.toFixed(2)),
        satisfaction: Number(satScore.toFixed(2)),
        professionalism: Number(profScore.toFixed(2))
      },
      fraudAlerts
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Run calculation whenever values change
  useEffect(() => {
    runCalculation();
  }, [
    weights, empCommRating, avgResponseHours, missedMeetings, ignoredQuestions,
    hasDetailedFeedback, hasConstructiveSuggestions, allCategoriesCompleted, submittedBeforeDeadline, studentRatedHelpful, lateReviewCount, emptyFeedbackCount, belowMinLengthCount,
    projectsFinishedSuccess, goalsPublishedOnTime, milestonesCompleted, studentsRatedClear, projectCancelledCount, scopeChangeOverkill, missedGoalCreationCount,
    decisionDelayDays, ghostingStudentCount, withdrawOfferCount, appReviewTimeHours,
    satComm, satMentorship, satProf, satRespect, satLearning, satOrg, satMatch, satCareer, satFairness, simulateOutlierReview,
    profRespectRating, profEthicsRating, profConductRating, profInclusivityRating, profReliabilityRating, profIntegrityRating,
    penaltyAbusiveReports, penaltyFakeJobPosts, penaltyPolicyViolations, edgeCase, triggerEvent
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Engine Identity */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-purple-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Briefcase className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">KONEXA Company Reputation Engine 1.0</h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-2xl">
            SaaS enterprise-grade reputation system evaluating employer engagement, feedback quality, hiring conversion, and student reviews. Includes outlier-filtered satisfaction calculations and customizable penalties.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="text-xs font-mono text-neutral-300">ENGINE: COMPILE RUNNING</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-mono text-neutral-300">WEIGHTS: 100% SUM</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl">
        {[
          { id: 'calc', label: 'Company Score Playground', icon: Calculator },
          { id: 'weights', label: 'Weights Matrix Config', icon: Sliders },
          { id: 'penalties', label: 'Penalties & Policy Violations', icon: ShieldAlert },
          { id: 'fraud', label: 'Fraud Detection Checks', icon: ShieldCheck },
          { id: 'audits', label: 'Immutable Audit Ledger', icon: History },
          { id: 'spec', label: 'Engine Specifications', icon: FileSpreadsheet }
        ].map(subTab => {
          const Icon = subTab.icon;
          const isSelected = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all ${isSelected ? 'bg-neutral-900 text-white border border-neutral-800 shadow-md' : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub Tab Content Panels */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'calc' && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input parameters - Left 7 columns */}
            <div className="lg:col-span-7 space-y-6">
              {/* Event trigger simulator configuration */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Calculation Event Metadata</h3>
                  <span className="text-[10px] text-neutral-500 font-mono">DETERMINISTIC PIPELINE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">Company Entity ID</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">Triggering Event</label>
                    <select
                      value={triggerEvent}
                      onChange={e => setTriggerEvent(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="COMPANY_REVIEW_SUBMITTED">Company Review Submitted</option>
                      <option value="PROJECT_COMPLETED">Project Completed</option>
                      <option value="HIRING_DECISION_RECORDED">Hiring Decision Recorded</option>
                      <option value="OFFER_ACCEPTED">Offer Accepted</option>
                      <option value="ADMIN_ACTION">Administrator Action</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">Edge Case Filter</label>
                    <select
                      value={edgeCase}
                      onChange={e => setEdgeCase(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="NONE">None (Normal Flow)</option>
                      <option value="INSUFFICIENT">Insufficient Data Exception</option>
                      <option value="CANCELLED">Project Force-Closed/Cancelled</option>
                      <option value="SUSPENDED">Company Terminated/Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Categories 1 & 2: Communication & Feedback */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category 1 & 2: Communication & Feedback Quality</h3>
                </div>

                {/* Communication parameters */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-rose-400">Communication Engagement Metrics</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">SME Comm Rating</label>
                      <select
                        value={empCommRating}
                        onChange={e => setEmpCommRating(parseFloat(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white"
                      >
                        {[1, 2, 3, 4, 5].map(v => (
                          <option key={v} value={v}>{v} ★</option>
                        ))}
                        <option value={4.5}>4.5 ★</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Avg Response Hours</label>
                      <input
                        type="number"
                        step="0.5"
                        value={avgResponseHours}
                        onChange={e => setAvgResponseHours(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Missed Meetings</label>
                      <input
                        type="number"
                        value={missedMeetings}
                        onChange={e => setMissedMeetings(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-rose-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Ignored Questions</label>
                      <input
                        type="number"
                        value={ignoredQuestions}
                        onChange={e => setIgnoredQuestions(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-rose-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Feedback Quality checklist */}
                <div className="space-y-3 pt-3 border-t border-neutral-900">
                  <span className="text-xs font-bold text-rose-400 block">Feedback Evaluation Timeliness & Detail Checklist</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { label: 'Detailed Text Provided (+20)', val: hasDetailedFeedback, set: setHasDetailedFeedback },
                      { label: 'Actionable suggestions (+20)', val: hasConstructiveSuggestions, set: setHasConstructiveSuggestions },
                      { label: 'All review areas filled (+20)', val: allCategoriesCompleted, set: setAllCategoriesCompleted },
                      { label: 'Submitted before deadline (+20)', val: submittedBeforeDeadline, set: setSubmittedBeforeDeadline },
                      { label: 'Student rated review helpful (+20)', val: studentRatedHelpful, set: setStudentRatedHelpful }
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center gap-2 p-2 bg-neutral-900/60 rounded-xl border border-neutral-900 text-[10px] text-neutral-300">
                        <input
                          type="checkbox"
                          checked={item.val}
                          onChange={e => item.set(e.target.checked)}
                          className="rounded text-rose-500 bg-neutral-950 border-neutral-800 focus:ring-0"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Late Review count</label>
                      <input
                        type="number"
                        value={lateReviewCount}
                        onChange={e => setLateReviewCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Empty Reviews</label>
                      <input
                        type="number"
                        value={emptyFeedbackCount}
                        onChange={e => setEmptyFeedbackCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Below Min Length</label>
                      <input
                        type="number"
                        value={belowMinLengthCount}
                        onChange={e => setBelowMinLengthCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories 3 & 4: PM & Hiring Reliability */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category 3 & 4: Project Management & Hiring reliability</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-rose-400 block">Project Management Metrics</span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] font-mono text-neutral-500 block mb-1">Successfully Finished Projects</label>
                        <input
                          type="number"
                          value={projectsFinishedSuccess}
                          onChange={e => setProjectsFinishedSuccess(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Weekly Goals On Time', val: goalsPublishedOnTime, set: setGoalsPublishedOnTime },
                          { label: 'Milestones Done', val: milestonesCompleted, set: setMilestonesCompleted },
                          { label: 'Requirements Clear', val: studentsRatedClear, set: setStudentsRatedClear },
                          { label: 'Scope Volatility Overkill', val: scopeChangeOverkill, set: setScopeChangeOverkill }
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-1.5 p-1.5 bg-neutral-900/60 rounded-xl border border-neutral-900 text-[9px] text-neutral-300">
                            <input
                              type="checkbox"
                              checked={item.val}
                              onChange={e => item.set(e.target.checked)}
                              className="rounded text-rose-500 bg-neutral-950 border-neutral-800 focus:ring-0"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono text-neutral-500 block mb-1">Cancellations</label>
                          <input
                            type="number"
                            value={projectCancelledCount}
                            onChange={e => setProjectCancelledCount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-1 text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono text-neutral-500 block mb-1">Missed Goal creation</label>
                          <input
                            type="number"
                            value={missedGoalCreationCount}
                            onChange={e => setMissedGoalCreationCount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-1 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-rose-400 block">Hiring Reliability & Decisiveness</span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] font-mono text-neutral-500 block mb-1">Hiring Decision Delay (Days)</label>
                        <input
                          type="number"
                          value={decisionDelayDays}
                          onChange={e => setDecisionDelayDays(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-neutral-500 block mb-1">Ghosting incidents count</label>
                        <input
                          type="number"
                          value={ghostingStudentCount}
                          onChange={e => setGhostingStudentCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-rose-400"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-neutral-500 block mb-1">Withdrawn Offer count</label>
                        <input
                          type="number"
                          value={withdrawOfferCount}
                          onChange={e => setWithdrawOfferCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-rose-400"
                        />
                      </div>
                      <div className="p-2.5 bg-neutral-900/60 rounded-xl border border-neutral-900 text-[10px] text-neutral-400 leading-tight">
                        *Repeated student ghosting triggers automatic compliance audit warning and manual review flag.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 5, 6 & 7: Speed, Satisfaction & Professionalism */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category 5, 6 & 7: Response Speed, Student Satisfaction & Conduct</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-rose-400 block">Response Speed & Review latency</span>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Application Review Time (Hours)</label>
                      <input
                        type="number"
                        value={appReviewTimeHours}
                        onChange={e => setAppReviewTimeHours(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                      <span className="text-[9px] text-neutral-500 font-mono mt-1 block">
                        &lt;=24h: 100 | &lt;=48h: 90 | &lt;=72h: 80 | &lt;=5d: 60 | &gt;7d: 30
                      </span>
                    </div>

                    {/* Satisfactions 1-5 ratings */}
                    <div className="space-y-2 pt-2 border-t border-neutral-900">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-rose-400 block">Cohort Student satisfaction</span>
                        <label className="flex items-center gap-1 text-[9px] text-neutral-500">
                          <input
                            type="checkbox"
                            checked={simulateOutlierReview}
                            onChange={e => setSimulateOutlierReview(e.target.checked)}
                            className="rounded border-neutral-800 bg-neutral-900 text-rose-500 focus:ring-0"
                          />
                          Filter outlier retaliatory reviews
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Comm', val: satComm, set: setSatComm },
                          { label: 'Mentorship', val: satMentorship, set: setSatMentorship },
                          { label: 'Ethics', val: satProf, set: setSatProf },
                          { label: 'Respect', val: satRespect, set: setSatRespect },
                          { label: 'Learning', val: satLearning, set: setSatLearning },
                          { label: 'Organization', val: satOrg, set: setSatOrg },
                          { label: 'Matches Expects', val: satMatch, set: setSatMatch },
                          { label: 'Career Value', val: satCareer, set: setSatCareer },
                          { label: 'Fairness', val: satFairness, set: setSatFairness }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <label className="text-[8px] font-mono text-neutral-500 block">{item.label}</label>
                            <select
                              value={item.val}
                              onChange={e => item.set(parseInt(e.target.value))}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-1.5 py-0.5 text-[11px] font-mono text-white focus:ring-0"
                            >
                              {[1, 2, 3, 4, 5].map(v => (
                                <option key={v} value={v}>{v}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Professionalism Evaluation */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-rose-400 block">SME Professional Conduct (Student Cohort Rating)</span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Business Ethics Rating', val: profEthicsRating, set: setProfEthicsRating },
                        { label: 'Mutual Respect', val: profRespectRating, set: setProfRespectRating },
                        { label: 'Conduct Integrity', val: profConductRating, set: setProfConductRating },
                        { label: 'Inclusive Culture', val: profInclusivityRating, set: setProfInclusivityRating },
                        { label: 'Service Reliability', val: profReliabilityRating, set: setProfReliabilityRating },
                        { label: 'Business Integrity', val: profIntegrityRating, set: setProfIntegrityRating }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <label className="text-[9px] font-mono text-neutral-500 block mb-1">{item.label}</label>
                          <select
                            value={item.val}
                            onChange={e => item.set(parseFloat(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1 text-xs font-mono text-white"
                          >
                            {[5.0, 4.8, 4.5, 4.0, 3.5, 3.0, 2.0, 1.0].map(v => (
                              <option key={v} value={v}>{v} ★</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations and breakdowns panel - Right 5 columns */}
            <div className="lg:col-span-5 space-y-6">
              {/* Score card displaying rank level */}
              <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none" />
                
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Calculated Reputation Score</span>
                
                <div className="my-6 relative">
                  <div className="text-6xl font-extrabold text-white tracking-tight font-mono">
                    {outputs.finalScore}
                  </div>
                  <div className={`absolute -top-4 -right-16 px-3 py-1 text-neutral-950 font-mono text-[10px] font-black rounded-full shadow-lg ${outputs.finalScore >= 90 ? 'bg-rose-400' : 'bg-neutral-500 text-white'}`}>
                    {outputs.scoreLevel}
                  </div>
                </div>

                <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mb-4 border border-neutral-800">
                  <div
                    className="bg-rose-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${outputs.finalScore}%` }}
                  />
                </div>

                {outputs.isUnderReview && (
                  <div className="w-full mb-4 py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2 justify-center">
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
                    <span>UNDER REVIEW FOR FRAUD PATTERNS</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-neutral-900 text-left">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 font-bold block uppercase">Engine Version</span>
                    <span className="text-xs font-semibold text-neutral-300 font-mono">{algorithmVersion}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 font-bold block uppercase">Engine Confidence</span>
                    <span className="text-xs font-semibold text-rose-400 font-mono">{outputs.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Complete calculation breakdowns */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold block">Traceable Math Formula Breakdown</span>
                <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-900 font-mono text-[10px] text-neutral-300 break-all leading-relaxed whitespace-pre-wrap">
                  {outputs.traceFormula}
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-400 block">Category scores contributing to total:</span>
                  {[
                    { label: 'Communication (15%)', val: outputs.commScore },
                    { label: 'Feedback Quality (20%)', val: outputs.feedbackScore },
                    { label: 'Project Management (20%)', val: outputs.pmScore },
                    { label: 'Hiring Reliability (15%)', val: outputs.hiringScore },
                    { label: 'Response Speed (10%)', val: outputs.speedScore },
                    { label: 'Student Satisfaction (15%)', val: outputs.satScore },
                    { label: 'Professionalism (5%)', val: outputs.profScore }
                  ].map((cat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400 font-medium">{cat.label}</span>
                      <span className="font-mono text-neutral-200">{cat.val}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 2: WEIGHT CONFIGURATION */}
        {activeSubTab === 'weights' && (
          <motion.div
            key="weights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Configurable Category Weight Configuration</h3>
                <p className="text-xs text-neutral-400 mt-1">Configure weights representing importance ratios. Total weights must sum to exactly 100%.</p>
              </div>
              <button
                onClick={saveWeights}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" /> Save Configuration
              </button>
            </div>

            {weightError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{weightError}</span>
              </div>
            )}

            <div className="space-y-4">
              {weights.map((w) => (
                <div key={w.id} className="p-4 bg-neutral-900/40 rounded-2xl border border-neutral-900 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4">
                    <span className="text-xs font-bold text-white block">{w.name}</span>
                    <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{w.description}</p>
                  </div>
                  <div className="md:col-span-6 flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weightEditState[w.id] || 0}
                      onChange={e => handleWeightChange(w.id, parseInt(e.target.value) || 0)}
                      className="w-full accent-rose-500"
                    />
                  </div>
                  <div className="md:col-span-2 text-right">
                    <input
                      type="number"
                      value={weightEditState[w.id] || 0}
                      onChange={e => handleWeightChange(w.id, parseInt(e.target.value) || 0)}
                      className="w-20 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1 text-xs text-center font-mono text-white inline-block focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-neutral-400 ml-1.5">%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUB TAB 3: PENALTIES */}
        {activeSubTab === 'penalties' && (
          <motion.div
            key="penalties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-white">Configurable Policy Violations & Direct Score Penalties</h3>
              <p className="text-xs text-neutral-400 mt-1">Direct point deductions applied to final scores upon admin/verified reports validation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Abusive Behavior Reports (-15 pts each)', state: penaltyAbusiveReports, set: setPenaltyAbusiveReports, desc: 'Verified complaints submitted via Dispute Console.' },
                { label: 'Fake Job Posts / Phishing (-25 pts each)', state: penaltyFakeJobPosts, set: setPenaltyFakeJobPosts, desc: 'Employer posting fraudulent positions without intents to hire.' },
                { label: 'Verified Policy Violation (-50 pts each)', state: penaltyPolicyViolations, set: setPenaltyPolicyViolations, desc: 'Severe violation triggering manual compliance review.' }
              ].map((penalty, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-900 space-y-3">
                  <span className="text-xs font-bold text-rose-400 block">{penalty.label}</span>
                  <p className="text-[10px] text-neutral-500">{penalty.desc}</p>
                  <input
                    type="number"
                    value={penalty.state}
                    onChange={e => penalty.set(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUB TAB 4: FRAUD DETECTION SCANNER */}
        {activeSubTab === 'fraud' && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Enterprise Fraud Detection Scanner Console</h3>
                <p className="text-xs text-neutral-400 mt-1">Scans raw submission patterns for mutual collusion, extreme ratings bias, empty feedback bypass, and ghosting.</p>
              </div>
              <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full font-mono text-[10px] font-bold">AUTOMATED RULES: ACTIVE</span>
            </div>

            {outputs.fraudAlerts.length > 0 ? (
              <div className="space-y-3">
                {outputs.fraudAlerts.map((alert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold block uppercase text-[10px] text-rose-400">FLAGGED PATTERN #{idx + 1}</span>
                      <p className="mt-1 text-neutral-300">{alert}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-neutral-900/30 border border-neutral-900 text-neutral-500 flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
                <span className="text-sm text-neutral-300 font-bold">No Suspicious Patterns Detected</span>
                <p className="text-xs text-neutral-500 max-w-sm">Raw metrics look compliant. Deterministic integrity check passed without triggers.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* SUB TAB 5: AUDIT HISTORY */}
        {activeSubTab === 'audits' && (
          <motion.div
            key="audits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Immutable Company Scores Ledger</h3>
                <p className="text-xs text-neutral-400 mt-1">Audit log detailing timestamp, previous/new scores, triggering event, and category values.</p>
              </div>
              <span className="text-xs font-mono text-neutral-500">HISTORICAL RECORDS: IMMUTABLE</span>
            </div>

            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 bg-neutral-900/60 rounded-2xl border border-neutral-900 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-rose-400 font-bold">{log.id}</span>
                      <span className="text-neutral-500">|</span>
                      <span className="text-neutral-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono">
                      EVENT: {log.triggerEvent}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-neutral-900/60">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">Previous Score</span>
                      <span className="text-xs text-neutral-300 font-mono font-bold">{log.previousScore}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">New Score</span>
                      <span className="text-xs text-rose-400 font-mono font-bold">{log.newScore} ({log.scoreLevel})</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">Algorithm Version</span>
                      <span className="text-xs text-neutral-400 font-mono">{log.version}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">Fraud Triggers</span>
                      <span className="text-xs font-mono font-bold text-neutral-300">{log.fraudAlerts.length > 0 ? `${log.fraudAlerts.length} Flagged` : 'Clean'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUB TAB 6: ENGINE SPECIFICATIONS */}
        {activeSubTab === 'spec' && (
          <motion.div
            key="spec"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-white">Reputation Engine Database & Calculation Specifications</h3>
              <p className="text-xs text-neutral-400 mt-1">Enterprise specs for normalized PostgreSQL storage schemas, triggers, and reproducible mathematics rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
              <div className="space-y-4 p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900">
                <span className="font-bold text-rose-400 block text-xs">PostgreSQL Schema Specifications</span>
                <p className="text-neutral-400 leading-relaxed">
                  Every calculation preserves immutability via normalized entities. Calculated scores are stored alongside raw event numbers.
                </p>
                <div className="space-y-2 font-mono text-[10px] text-neutral-400">
                  <div className="p-2 bg-neutral-950 rounded border border-neutral-900">
                    <span className="text-white block font-bold">1. company_scores</span>
                    - id (uuid PRIMARY KEY), company_id (uuid), score (numeric(5,2)), grade (varchar), version (varchar), created_at (timestamp)
                  </div>
                  <div className="p-2 bg-neutral-950 rounded border border-neutral-900">
                    <span className="text-white block font-bold">2. company_category_scores</span>
                    - score_id (uuid REFERENCES), comm_score (numeric), feedback_score (numeric), pm_score (numeric), satisfaction_score (numeric)
                  </div>
                  <div className="p-2 bg-neutral-950 rounded border border-neutral-900">
                    <span className="text-white block font-bold">3. company_calculation_logs</span>
                    - id (uuid), trigger_event (varchar), raw_metrics (jsonb), weights_used (jsonb), duration_ms (integer)
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-neutral-950 border border-neutral-900">
                <span className="font-bold text-rose-400 block text-xs">Platform Core Trigger Events</span>
                <p className="text-neutral-400 leading-relaxed">
                  Calculations automatically trigger asynchronously upon verified platform events to update student and employer dashboards instantly.
                </p>
                <ul className="space-y-1.5 font-mono text-[10px] text-neutral-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                    <span><strong>PROJECT_CREATED / COMPLETED</strong>: Re-evaluates baseline scopes and PM indices.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                    <span><strong>COMPANY_REVIEW_SUBMITTED</strong>: Recomputes Feedback completeness & actionable parameters.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                    <span><strong>STUDENT_FINAL_REVIEW</strong>: Updates cohort anonymous feedback and satisfaction averages.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                    <span><strong>HIRING_DECISION_RECORDED</strong>: Re-computes delays and offer Ghosting penalty matrices.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
