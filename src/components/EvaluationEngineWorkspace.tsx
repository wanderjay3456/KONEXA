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
  Layers,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import CompanyScoreEngineWorkspace from './CompanyScoreEngineWorkspace';

// Definitions
interface CategoryWeight {
  id: string;
  name: string;
  weight: number; // e.g. 20 for 20%
  description: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  version: string;
  studentId: string;
  studentName: string;
  projectId: string;
  triggerEvent: string;
  previousScore: number;
  newScore: number;
  grade: string;
  weights: Record<string, number>;
  categoryScores: Record<string, number>;
  fraudAlerts: string[];
}

export default function EvaluationEngineWorkspace() {
  const [activeEngine, setActiveEngine] = useState<'student' | 'company'>('student');
  const [activeSubTab, setActiveSubTab] = useState<'calc' | 'weights' | 'fraud' | 'audits' | 'spec'>('calc');

  // 1. Weight Configuration State
  const [weights, setWeights] = useState<CategoryWeight[]>([
    { id: 'deadline', name: 'Deadline Management', weight: 20, description: 'Evaluate punctuality and submission delay/early metrics.' },
    { id: 'quality', name: 'Work Quality', weight: 25, description: 'Employer reviews regarding accuracy, completeness, and documentation.' },
    { id: 'comm', name: 'Communication', weight: 15, description: 'Pertains to clarity, unread message metrics, and response times.' },
    { id: 'resp', name: 'Responsibility', weight: 15, description: 'Completion rate of weekly goals, document updates, and mandatory check-ins.' },
    { id: 'problem', name: 'Problem Solving', weight: 10, description: 'Evaluation on independent thinking and issue resolution.' },
    { id: 'consistency', name: 'Consistency', weight: 10, description: 'Evaluates variance and standard deviation across weekly scores.' },
    { id: 'professionalism', name: 'Professionalism', weight: 5, description: 'Ethics, teamwork, business etiquette, and general compliance.' }
  ]);

  const [weightEditState, setWeightEditState] = useState<Record<string, number>>({
    deadline: 20,
    quality: 25,
    comm: 15,
    resp: 15,
    problem: 10,
    consistency: 10,
    professionalism: 5
  });

  const [weightError, setWeightError] = useState<string | null>(null);

  // Initialize weights edit state
  useEffect(() => {
    const editObj: Record<string, number> = {};
    weights.forEach(w => {
      editObj[w.id] = w.weight;
    });
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
    alert('Category weights configuration updated globally. Validated successfully.');
  };

  // 2. Calculator Input Parameters
  const [studentId, setStudentId] = useState('RM_ST_2901');
  const [studentName, setStudentName] = useState('Minh Anh');
  const [projectId, setProjectId] = useState('PRJ_HEALTH_AI');
  const [triggerEvent, setTriggerEvent] = useState('EMPLOYER_REVIEW_SUBMITTED');
  const [version, setVersion] = useState('v1.0.0 (Deterministic)');

  // Deadline Management Params
  const [assignmentCount, setAssignmentCount] = useState(10);
  const [completedCount, setCompletedCount] = useState(10);
  const [onTimeCount, setOnTimeCount] = useState(8);
  const [earlyCount, setEarlyCount] = useState(2); // early bonus
  const [earlyHoursType, setEarlyHoursType] = useState<24 | 48 | 72>(48); // early bonus tier
  const [lateCount, setLateCount] = useState(0);
  const [lateHours, setLateHours] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  // Work Quality Rating Params (1 to 5)
  const [qualityAccuracy, setQualityAccuracy] = useState(5);
  const [qualityCompleteness, setQualityCompleteness] = useState(4);
  const [qualityTech, setQualityTech] = useState(5);
  const [qualityDoc, setQualityDoc] = useState(4);
  const [qualityCreative, setQualityCreative] = useState(4);
  const [qualityCode, setQualityCode] = useState(5);
  const [qualityDetail, setQualityDetail] = useState(4);
  const [additionalProjectCount, setAdditionalProjectCount] = useState(0); // For multiple projects integration demo

  // Communication Params (1 to 5 ratings & system metrics)
  const [commClarity, setCommClarity] = useState(4);
  const [commResponse, setCommResponse] = useState(5);
  const [commQuestion, setCommQuestion] = useState(4);
  const [commMeeting, setCommMeeting] = useState(5);
  const [commTone, setCommTone] = useState(4);
  // System metrics
  const [avgReplyTimeHours, setAvgReplyTimeHours] = useState(1.5); // < 2 hours
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [ignoredMentions, setIgnoredMentions] = useState(0);
  const [meetingAttendancePercent, setMeetingAttendancePercent] = useState(100);

  // Responsibility Params
  const [weeklyGoalsCompleted, setWeeklyGoalsCompleted] = useState(8);
  const [weeklyGoalsMissed, setWeeklyGoalsMissed] = useState(0);
  const [checkinsCompleted, setCheckinsCompleted] = useState(8);
  const [mandatoryFilesUploaded, setMandatoryFilesUploaded] = useState(4);
  const [missedMandatoryEvents, setMissedMandatoryEvents] = useState(0);

  // Problem Solving Params (1 to 5)
  const [psThinking, setPsThinking] = useState(4);
  const [psAdaptability, setPsAdaptability] = useState(5);
  const [psDecision, setPsDecision] = useState(4);
  const [psResolution, setPsResolution] = useState(4);
  const [psLearning, setPsLearning] = useState(5);

  // Consistency Params
  const [weeklyScoresCsv, setWeeklyScoresCsv] = useState('88, 92, 85, 94, 91, 89, 93, 90');

  // Professionalism Params (1 to 5)
  const [profRespect, setProfRespect] = useState(5);
  const [profEthics, setProfEthics] = useState(5);
  const [profReliability, setProfReliability] = useState(4);
  const [profTeamwork, setProfTeamwork] = useState(5);
  const [profAttitude, setProfAttitude] = useState(5);
  const [profEtiquette, setProfEtiquette] = useState(5);

  // Edge Case Simulation
  const [edgeCase, setEdgeCase] = useState<'NONE' | 'INSUFFICIENT' | 'NO_EMPLOYER_REVIEW' | 'CANCELLED'>('NONE');

  // Calculated Outputs State
  const [scoreOutputs, setScoreOutputs] = useState({
    deadlineScore: 0,
    qualityScore: 0,
    commScore: 0,
    respScore: 0,
    psScore: 0,
    consistencyScore: 0,
    professionalismScore: 0,
    finalScore: 0,
    grade: 'F',
    confidence: 100,
    reproducibleFormula: '',
    sdValue: 0,
    fraudAlerts: [] as string[]
  });

  // Simulated Audits List
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'AUD_CALC_9021',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      version: 'v1.0.0 (Deterministic)',
      studentId: 'RM_ST_2901',
      studentName: 'Minh Anh',
      projectId: 'PRJ_HEALTH_AI',
      triggerEvent: 'WEEKLY_REVIEW_COMPLETED',
      previousScore: 88.5,
      newScore: 91.24,
      grade: 'A+',
      weights: { deadline: 20, quality: 25, comm: 15, resp: 15, problem: 10, consistency: 10, professionalism: 5 },
      categoryScores: { deadline: 96, quality: 88.5, comm: 92, resp: 95, problem: 90, consistency: 100, professionalism: 95 },
      fraudAlerts: []
    },
    {
      id: 'AUD_CALC_8942',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      version: 'v1.0.0 (Deterministic)',
      studentId: 'RM_ST_2901',
      studentName: 'Minh Anh',
      projectId: 'PRJ_HEALTH_AI',
      triggerEvent: 'ASSIGNMENT_SUBMITTED',
      previousScore: 84.12,
      newScore: 88.5,
      grade: 'A',
      weights: { deadline: 20, quality: 25, comm: 15, resp: 15, problem: 10, consistency: 10, professionalism: 5 },
      categoryScores: { deadline: 88, quality: 85.0, comm: 89, resp: 90, problem: 88, consistency: 90, professionalism: 90 },
      fraudAlerts: []
    }
  ]);

  // Perform Score Calculation
  const runEngineCalculation = () => {
    // Check Edge Case for Insufficient Data
    if (edgeCase === 'INSUFFICIENT' || assignmentCount === 0) {
      setScoreOutputs({
        deadlineScore: 0,
        qualityScore: 0,
        commScore: 0,
        respScore: 0,
        psScore: 0,
        consistencyScore: 0,
        professionalismScore: 0,
        finalScore: 0,
        grade: 'Insufficient Data',
        confidence: 10,
        reproducibleFormula: 'Confidence below minimum threshold (30%). Not enough events to evaluate.',
        sdValue: 0,
        fraudAlerts: []
      });
      return;
    }

    // 1. Deadline Score
    // OnTimeRate = OnTimeSubmission / AssignmentCount
    const onTimeRate = onTimeCount / assignmentCount;
    const baseDeadline = onTimeRate * 100;

    // Early Bonus:
    // 24~47 hours early: +2, 48~71 hours: +4, 72 hours+: +6. Maximum accumulated bonus = 10.
    let earlyBonus = 0;
    if (earlyCount > 0) {
      const perEarlyBonus = earlyHoursType === 24 ? 2 : earlyHoursType === 48 ? 4 : 6;
      earlyBonus = Math.min(10, earlyCount * perEarlyBonus);
    }

    // Late Penalty:
    // 1-24 hours: -5, 24-48: -10, 48-72: -15, 72+: -25.
    let latePenalty = 0;
    if (lateCount > 0) {
      if (lateHours <= 24) latePenalty = lateCount * 5;
      else if (lateHours <= 48) latePenalty = lateCount * 10;
      else if (lateHours <= 72) latePenalty = lateCount * 15;
      else latePenalty = lateCount * 25;
    }

    // Missed Penalty: -30 per missed. If missed > 2, clamp final category score to maximum 40.
    const missedPenalty = missedCount * 30;

    let deadlineScore = baseDeadline + earlyBonus - latePenalty - missedPenalty;
    if (missedCount > 2) {
      deadlineScore = Math.min(40, deadlineScore);
    }
    deadlineScore = Math.max(0, Math.min(100, deadlineScore));

    // 2. Work Quality Score
    // Convert 1-5 ratings to 20-100 scale: Rating * 20
    const ratings = [qualityAccuracy, qualityCompleteness, qualityTech, qualityDoc, qualityCreative, qualityCode, qualityDetail];
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    let qualityScore = avgRating * 20;

    // Incase of multiple projects, contribution clamps to 15% max per project
    if (additionalProjectCount > 0) {
      // Simulate multi-project weighted scaling:
      qualityScore = (qualityScore * 0.85) + (85 * 0.15); // blends other project weighted score of 85
    }
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    // 3. Communication Score
    // Employer Evaluation: Clarity, Response, Question, Meeting, Tone (Average, 1-5)
    const empCommRatings = [commClarity, commResponse, commQuestion, commMeeting, commTone];
    const avgEmpComm = empCommRatings.reduce((a, b) => a + b, 0) / empCommRatings.length;
    const empCommScoreScaled = avgEmpComm * 20;

    // System Metrics response time conversion:
    let systemResponseScore = 20;
    if (avgReplyTimeHours < 2) systemResponseScore = 100;
    else if (avgReplyTimeHours <= 6) systemResponseScore = 90;
    else if (avgReplyTimeHours <= 12) systemResponseScore = 80;
    else if (avgReplyTimeHours <= 24) systemResponseScore = 70;
    else if (avgReplyTimeHours <= 48) systemResponseScore = 50;

    // Reductions for bad metrics:
    const unreadPenalty = unreadMessages * 5;
    const ignoredPenalty = ignoredMentions * 10;
    const attendanceFactor = meetingAttendancePercent / 100;

    const systemCommScore = Math.max(0, Math.min(100, (systemResponseScore - unreadPenalty - ignoredPenalty) * attendanceFactor));

    // Final Communication = EmployerScore * 0.70 + SystemScore * 0.30
    const commScore = (empCommScoreScaled * 0.70) + (systemCommScore * 0.30);

    // 4. Responsibility Score
    // Completed events add, missed mandatory events deduct. Max 100
    const totalRespEvents = weeklyGoalsCompleted + checkinsCompleted + mandatoryFilesUploaded;
    let respScore = totalRespEvents * 5; // e.g. 20 events * 5 = 100
    respScore = respScore - (weeklyGoalsMissed * 10) - (missedMandatoryEvents * 15);
    respScore = Math.max(0, Math.min(100, respScore));

    // 5. Problem Solving Score
    const psRatings = [psThinking, psAdaptability, psDecision, psResolution, psLearning];
    const avgPsRating = psRatings.reduce((a, b) => a + b, 0) / psRatings.length;
    const psScore = avgPsRating * 20;

    // 6. Consistency Score
    // Collect CSV scores, compute Standard Deviation
    const scoreArr = weeklyScoresCsv.split(',').map(s => parseFloat(s.trim())).filter(s => !isNaN(s));
    let sd = 0;
    let consistencyScore = 100;
    if (scoreArr.length > 1) {
      const mean = scoreArr.reduce((a, b) => a + b, 0) / scoreArr.length;
      const variance = scoreArr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / scoreArr.length;
      sd = Math.sqrt(variance);

      // Map Standard Deviation:
      // 0-3 SD = 100
      // 3-6 SD = 90
      // 6-10 SD = 80
      // 10-15 SD = 65
      // Above 15 = 50
      if (sd <= 3) consistencyScore = 100;
      else if (sd <= 6) consistencyScore = 90;
      else if (sd <= 10) consistencyScore = 80;
      else if (sd <= 15) consistencyScore = 65;
      else consistencyScore = 50;
    }

    // 7. Professionalism Score
    const profRatings = [profRespect, profEthics, profReliability, profTeamwork, profAttitude, profEtiquette];
    const avgProfRating = profRatings.reduce((a, b) => a + b, 0) / profRatings.length;
    const professionalismScore = avgProfRating * 20;

    // --- FRAUD DETECTION ENGINE ---
    const fraudAlerts: string[] = [];
    
    // Check 1: Repeated identical employer ratings (Maximums or Minimums)
    const allEmployerScores = [
      qualityAccuracy, qualityCompleteness, qualityTech, qualityDoc, qualityCreative, qualityCode, qualityDetail,
      commClarity, commResponse, commQuestion, commMeeting, commTone,
      psThinking, psAdaptability, psDecision, psResolution, psLearning,
      profRespect, profEthics, profReliability, profTeamwork, profAttitude, profEtiquette
    ];
    
    const isAllSame = allEmployerScores.every(v => v === allEmployerScores[0]);
    if (isAllSame && allEmployerScores.length > 0) {
      fraudAlerts.push(`Identical rating pattern detected (all categories scored exactly ${allEmployerScores[0]}/5). Flagged for collusion check.`);
    }

    // Check 2: Maximum scores for every category
    const isPerfectRating = allEmployerScores.every(v => v === 5);
    if (isPerfectRating) {
      fraudAlerts.push('Perfect 5/5 score across all 23 qualitative evaluation criteria. Flagged for review authenticity.');
    }

    // Check 3: Minimum scores for every category
    const isTerribleRating = allEmployerScores.every(v => v === 1);
    if (isTerribleRating) {
      fraudAlerts.push('Extremely low 1/5 score across all criteria. Suspicious of review bombing/retaliatory behavior.');
    }

    // Check 4: Abnormal score increases (simulated by looking at csv jump)
    if (scoreArr.length > 1) {
      const minScore = Math.min(...scoreArr);
      const maxScore = Math.max(...scoreArr);
      if (maxScore - minScore > 35) {
        fraudAlerts.push(`Unusual performance volatility: ${minScore} to ${maxScore} (Score delta > 35 pts within the same period).`);
      }
    }

    // Check 5: No employer review bypass flag
    if (edgeCase === 'NO_EMPLOYER_REVIEW') {
      fraudAlerts.push('Recalculation executed using fallback metrics. Missing official employer evaluation parameters.');
    }

    // --- FINAL WEIGHTED PERFORMANCE SCORE ---
    // Extract configured weights
    const getWeight = (id: string) => (weights.find(w => w.id === id)?.weight || 0) / 100;

    const finalScore = 
      (deadlineScore * getWeight('deadline')) +
      (qualityScore * getWeight('quality')) +
      (commScore * getWeight('comm')) +
      (respScore * getWeight('resp')) +
      (psScore * getWeight('problem')) +
      (consistencyScore * getWeight('consistency')) +
      (professionalismScore * getWeight('professionalism'));

    // Round to 2 Decimal Places
    const roundedScore = Number(finalScore.toFixed(2));

    // Convert to Grade
    // 97~100: S+, 93~96.99: S, 90~92.99: A+, 85~89.99: A, 80~84.99: B+, 75~79.99: B, 70~74.99: C, 60~69.99: D, Below 60: F
    let grade = 'F';
    if (roundedScore >= 97) grade = 'S+';
    else if (roundedScore >= 93) grade = 'S';
    else if (roundedScore >= 90) grade = 'A+';
    else if (roundedScore >= 85) grade = 'A';
    else if (roundedScore >= 80) grade = 'B+';
    else if (roundedScore >= 75) grade = 'B';
    else if (roundedScore >= 70) grade = 'C';
    else if (roundedScore >= 60) grade = 'D';

    // Generate Traceable Mathematical Explanation Formula
    const traceableFormula = `(${deadlineScore.toFixed(1)} * ${getWeight('deadline')}) + (${qualityScore.toFixed(1)} * ${getWeight('quality')}) + (${commScore.toFixed(1)} * ${getWeight('comm')}) + (${respScore.toFixed(1)} * ${getWeight('resp')}) + (${psScore.toFixed(1)} * ${getWeight('problem')}) + (${consistencyScore.toFixed(1)} * ${getWeight('consistency')}) + (${professionalismScore.toFixed(1)} * ${getWeight('professionalism')}) = ${roundedScore}`;

    setScoreOutputs({
      deadlineScore: Number(deadlineScore.toFixed(2)),
      qualityScore: Number(qualityScore.toFixed(2)),
      commScore: Number(commScore.toFixed(2)),
      respScore: Number(respScore.toFixed(2)),
      psScore: Number(psScore.toFixed(2)),
      consistencyScore: Number(consistencyScore.toFixed(2)),
      professionalismScore: Number(professionalismScore.toFixed(2)),
      finalScore: roundedScore,
      grade,
      confidence: edgeCase === 'NO_EMPLOYER_REVIEW' ? 60 : 100,
      reproducibleFormula: traceableFormula,
      sdValue: Number(sd.toFixed(3)),
      fraudAlerts
    });

    // Write audit log entry
    const newLog: AuditLogEntry = {
      id: `AUD_CALC_${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      version,
      studentId,
      studentName,
      projectId,
      triggerEvent,
      previousScore: scoreOutputs.finalScore || 85.0,
      newScore: roundedScore,
      grade,
      weights: weights.reduce((acc, w) => ({ ...acc, [w.id]: w.weight }), {}),
      categoryScores: {
        deadline: Number(deadlineScore.toFixed(2)),
        quality: Number(qualityScore.toFixed(2)),
        comm: Number(commScore.toFixed(2)),
        resp: Number(respScore.toFixed(2)),
        problem: Number(psScore.toFixed(2)),
        consistency: Number(consistencyScore.toFixed(2)),
        professionalism: Number(professionalismScore.toFixed(2))
      },
      fraudAlerts
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Run initial calculation
  useEffect(() => {
    runEngineCalculation();
  }, [
    weights, assignmentCount, completedCount, onTimeCount, earlyCount, earlyHoursType, lateCount, lateHours, missedCount,
    qualityAccuracy, qualityCompleteness, qualityTech, qualityDoc, qualityCreative, qualityCode, qualityDetail, additionalProjectCount,
    commClarity, commResponse, commQuestion, commMeeting, commTone, avgReplyTimeHours, unreadMessages, ignoredMentions, meetingAttendancePercent,
    weeklyGoalsCompleted, weeklyGoalsMissed, checkinsCompleted, mandatoryFilesUploaded, missedMandatoryEvents,
    psThinking, psAdaptability, psDecision, psResolution, psLearning, weeklyScoresCsv,
    profRespect, profEthics, profReliability, profTeamwork, profAttitude, profEtiquette, edgeCase, triggerEvent
  ]);

  return (
    <div className="space-y-6">
      {/* Engine Switcher Segmented Control */}
      <div className="flex border border-neutral-900 p-1 bg-neutral-950 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveEngine('student')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-2 ${activeEngine === 'student' ? 'bg-teal-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'}`}
        >
          <Award className="w-4 h-4" /> STUDENT ENGINE
        </button>
        <button
          onClick={() => setActiveEngine('company')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-2 ${activeEngine === 'company' ? 'bg-rose-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'}`}
        >
          <Briefcase className="w-4 h-4" /> COMPANY SCORE ENGINE
        </button>
      </div>

      {activeEngine === 'company' ? (
        <CompanyScoreEngineWorkspace />
      ) : (
        <>
          {/* 1. Header with Engine Identity */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Award className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">KONEXA Deterministic Evaluation Engine 1.0</h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-2xl">
            A production-grade, traceable performance score engine computing weights, deadline early bonuses/late penalties, standard deviations, and audit logs. No random AI ratings, fully auditable and compliant.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-neutral-300">CALCULATOR: ACTIVE</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-mono text-neutral-300">WEIGHTS: SUM 100%</span>
          </div>
        </div>
      </div>

      {/* 2. Sub Tabs Navigation */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl">
        {[
          { id: 'calc', label: 'Evaluation Playground & Outputs', icon: Calculator },
          { id: 'weights', label: 'Category Weights Config', icon: Sliders },
          { id: 'fraud', label: 'Fraud Detection Scanner', icon: ShieldAlert },
          { id: 'audits', label: 'Immutable Audit Logs Ledger', icon: History },
          { id: 'spec', label: 'Durable Data Model & Rules Spec', icon: FileSpreadsheet }
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
        {/* SUB TAB 1: CALCULATOR & LIVE OUTPUTS */}
        {activeSubTab === 'calc' && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input Parameters - Left 7 Columns */}
            <div className="lg:col-span-7 space-y-6">
              {/* Event trigger simulator configuration */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Calculation Event Metadata</h3>
                  <span className="text-[10px] text-neutral-500 font-mono">DETERMINISTIC PIPELINE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">Target Student</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">Triggering Event</label>
                    <select
                      value={triggerEvent}
                      onChange={e => setTriggerEvent(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="EMPLOYER_REVIEW_SUBMITTED">Employer Review Submitted</option>
                      <option value="ASSIGNMENT_SUBMITTED">Assignment Submitted</option>
                      <option value="WEEKLY_REVIEW_COMPLETED">Weekly Review Completed</option>
                      <option value="PROJECT_COMPLETED">Project Completed</option>
                      <option value="ADMIN_CORRECTION">Administrator Correction</option>
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
                      <option value="NO_EMPLOYER_REVIEW">No Employer Review (Fallback)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Deadline & Work Quality Parameters */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category 1 & 2: Deadline & Work Quality Metrics</h3>
                </div>
                
                {/* Deadline metrics */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-teal-400">Deadline Management Metrics</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Total Assignments</label>
                      <input
                        type="number"
                        value={assignmentCount}
                        onChange={e => setAssignmentCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">On-Time Submissions</label>
                      <input
                        type="number"
                        value={onTimeCount}
                        onChange={e => setOnTimeCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Early Submissions</label>
                      <input
                        type="number"
                        value={earlyCount}
                        onChange={e => setEarlyCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Early Tier Bonus</label>
                      <select
                        value={earlyHoursType}
                        onChange={e => setEarlyHoursType(parseInt(e.target.value) as any)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      >
                        <option value={24}>24-47h (+2 pts)</option>
                        <option value={48}>48-71h (+4 pts)</option>
                        <option value={72}>72h+ (+6 pts)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Late Submissions</label>
                      <input
                        type="number"
                        value={lateCount}
                        onChange={e => setLateCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Late Delay Hours</label>
                      <input
                        type="number"
                        value={lateHours}
                        onChange={e => setLateHours(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Missed Submissions</label>
                      <input
                        type="number"
                        value={missedCount}
                        onChange={e => setMissedCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono text-rose-400"
                      />
                    </div>
                    <div className="flex items-end text-[10px] text-neutral-500 pb-1 italic leading-tight">
                      *Missed &gt; 2 limits category score max to 40.
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="space-y-3 pt-3 border-t border-neutral-900">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-teal-400">Work Quality Criteria (Employer 1-5 Rating)</span>
                    <label className="flex items-center gap-1 text-[10px] text-neutral-500">
                      <input
                        type="checkbox"
                        checked={additionalProjectCount > 0}
                        onChange={e => setAdditionalProjectCount(e.target.checked ? 1 : 0)}
                        className="rounded border-neutral-800 bg-neutral-900 text-teal-500 focus:ring-0"
                      />
                      Combine multiple project history weights
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Accuracy', state: qualityAccuracy, set: setQualityAccuracy },
                      { label: 'Completeness', state: qualityCompleteness, set: setQualityCompleteness },
                      { label: 'Technical Quality', state: qualityTech, set: setQualityTech },
                      { label: 'Documentation', state: qualityDoc, set: setQualityDoc },
                      { label: 'Creativity', state: qualityCreative, set: setQualityCreative },
                      { label: 'Code Quality', state: qualityCode, set: setQualityCode },
                      { label: 'Attention to Detail', state: qualityDetail, set: setQualityDetail }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <label className="text-[9px] font-mono text-neutral-500 block mb-1">{item.label}</label>
                        <select
                          value={item.state}
                          onChange={e => item.set(parseInt(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1 text-xs font-mono text-white focus:ring-0"
                        >
                          {[1, 2, 3, 4, 5].map(v => (
                            <option key={v} value={v}>{v} ★</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communication & Responsibility */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category 3 & 4: Communication & Responsibility</h3>
                </div>

                {/* Communication Metrics */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-teal-400">Communication & System Response Parameters</span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    {[
                      { label: 'Clarity Rating', val: commClarity, set: setCommClarity },
                      { label: 'Response Rating', val: commResponse, set: setCommResponse },
                      { label: 'Question Quality', val: commQuestion, set: setCommQuestion },
                      { label: 'Meetings Attend', val: commMeeting, set: setCommMeeting },
                      { label: 'Tone Rating', val: commTone, set: setCommTone }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <label className="text-[9px] font-mono text-neutral-500 block mb-1">{item.label}</label>
                        <select
                          value={item.val}
                          onChange={e => item.set(parseInt(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1 text-xs font-mono text-white focus:ring-0"
                        >
                          {[1, 2, 3, 4, 5].map(v => (
                            <option key={v} value={v}>{v} ★</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Avg Response Hours</label>
                      <input
                        type="number"
                        step="0.5"
                        value={avgReplyTimeHours}
                        onChange={e => setAvgReplyTimeHours(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Unread Messages</label>
                      <input
                        type="number"
                        value={unreadMessages}
                        onChange={e => setUnreadMessages(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Ignored Mentions</label>
                      <input
                        type="number"
                        value={ignoredMentions}
                        onChange={e => setIgnoredMentions(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Meeting Attendance %</label>
                      <input
                        type="number"
                        max="100"
                        value={meetingAttendancePercent}
                        onChange={e => setMeetingAttendancePercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Responsibility events */}
                <div className="space-y-3 pt-3 border-t border-neutral-900">
                  <span className="text-xs font-bold text-teal-400">Responsibility Events Activity (Completed vs Missed)</span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Goals Completed</label>
                      <input
                        type="number"
                        value={weeklyGoalsCompleted}
                        onChange={e => setWeeklyGoalsCompleted(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Goals Missed</label>
                      <input
                        type="number"
                        value={weeklyGoalsMissed}
                        onChange={e => setWeeklyGoalsMissed(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Check-ins Comp</label>
                      <input
                        type="number"
                        value={checkinsCompleted}
                        onChange={e => setCheckinsCompleted(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-neutral-500 block mb-1">Files Submitted</label>
                      <input
                        type="number"
                        value={mandatoryFilesUploaded}
                        onChange={e => setMandatoryFilesUploaded(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-rose-400 block mb-1">Missed Check-ins</label>
                      <input
                        type="number"
                        value={missedMandatoryEvents}
                        onChange={e => setMissedMandatoryEvents(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-mono text-rose-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Solving, Consistency, Professionalism */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category 5, 6 & 7: Qualitative & Standard Deviation Consistency</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Problem solving */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-teal-400">Problem Solving Rating Criteria</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Independent Thinking', val: psThinking, set: setPsThinking },
                        { label: 'Adaptability', val: psAdaptability, set: setPsAdaptability },
                        { label: 'Decision Making', val: psDecision, set: setPsDecision },
                        { label: 'Issue Resolution', val: psResolution, set: setPsResolution },
                        { label: 'Learning Speed', val: psLearning, set: setPsLearning }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <label className="text-[9px] font-mono text-neutral-500 block mb-1">{item.label}</label>
                          <select
                            value={item.val}
                            onChange={e => item.set(parseInt(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1 text-xs font-mono text-white"
                          >
                            {[1, 2, 3, 4, 5].map(v => (
                              <option key={v} value={v}>{v} ★</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Professionalism */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-teal-400">Professionalism & Ethics Criteria</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Respect Rating', val: profRespect, set: setProfRespect },
                        { label: 'Ethics Compliance', val: profEthics, set: setProfEthics },
                        { label: 'Reliability', val: profReliability, set: setProfReliability },
                        { label: 'Teamwork Skills', val: profTeamwork, set: setProfTeamwork },
                        { label: 'Attitude Check', val: profAttitude, set: setProfAttitude },
                        { label: 'Etiquette Rating', val: profEtiquette, set: setProfEtiquette }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <label className="text-[9px] font-mono text-neutral-500 block mb-1">{item.label}</label>
                          <select
                            value={item.val}
                            onChange={e => item.set(parseInt(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1 text-xs font-mono text-white"
                          >
                            {[1, 2, 3, 4, 5].map(v => (
                              <option key={v} value={v}>{v} ★</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consistency inputs */}
                <div className="pt-3 border-t border-neutral-900 space-y-2">
                  <span className="text-xs font-bold text-teal-400 block">Weekly Score Consistency Variance CSV</span>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={weeklyScoresCsv}
                        onChange={e => setWeeklyScoresCsv(e.target.value)}
                        placeholder="88, 92, 85, 94..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="text-[10px] text-neutral-500 leading-tight shrink-0 max-w-xs">
                      The engine calculates standard deviation dynamically: sd &lt; 3 = 100, 3-6 = 90, 6-10 = 80, 10-15 = 65, Above 15 = 50.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Scores & Visual Breakdowns - Right 5 Columns */}
            <div className="lg:col-span-5 space-y-6">
              {/* Score Display Card */}
              <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
                
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Calculated Performance Rating</span>
                
                {/* Big Score and Grade */}
                <div className="my-6 relative">
                  <div className="text-6xl font-extrabold text-white tracking-tight font-mono">
                    {scoreOutputs.finalScore}
                  </div>
                  <div className="absolute -top-4 -right-10 px-3 py-1 bg-teal-500 text-neutral-950 font-mono text-sm font-black rounded-full shadow-lg">
                    {scoreOutputs.grade}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mb-4 border border-neutral-800">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${scoreOutputs.finalScore}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-neutral-900 text-left">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 font-bold block uppercase">Engine Version</span>
                    <span className="text-xs font-semibold text-neutral-300 font-mono">{version}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 font-bold block uppercase">Algorithm Confidence</span>
                    <span className="text-xs font-semibold text-teal-400 font-mono">{scoreOutputs.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Mathematical Equation Traceability Box */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">Traceable Math Equation (Deterministic)</span>
                <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-900 font-mono text-[10px] text-neutral-300 leading-relaxed break-all">
                  {scoreOutputs.reproducibleFormula}
                </div>
                <p className="text-[10px] text-neutral-500 italic leading-tight">
                  Calculated from: (Deadline × {weights.find(w=>w.id==='deadline')?.weight}%) + (Quality × {weights.find(w=>w.id==='quality')?.weight}%) + (Comm × {weights.find(w=>w.id==='comm')?.weight}%) + (Resp × {weights.find(w=>w.id==='resp')?.weight}%) + (Problem × {weights.find(w=>w.id==='problem')?.weight}%) + (Consistency × {weights.find(w=>w.id==='consistency')?.weight}%) + (Professionalism × {weights.find(w=>w.id==='professionalism')?.weight}%).
                </p>
              </div>

              {/* Category-by-Category Scores Breakdown */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-bold text-neutral-300 block">Calculated Category Score Breakdown</span>
                <div className="space-y-3">
                  {[
                    { label: 'Deadline Management', value: scoreOutputs.deadlineScore, weight: weights.find(w=>w.id==='deadline')?.weight },
                    { label: 'Work Quality Score', value: scoreOutputs.qualityScore, weight: weights.find(w=>w.id==='quality')?.weight },
                    { label: 'Communication Score', value: scoreOutputs.commScore, weight: weights.find(w=>w.id==='comm')?.weight },
                    { label: 'Responsibility Score', value: scoreOutputs.respScore, weight: weights.find(w=>w.id==='resp')?.weight },
                    { label: 'Problem Solving Score', value: scoreOutputs.psScore, weight: weights.find(w=>w.id==='problem')?.weight },
                    { label: 'Consistency Rating', value: scoreOutputs.consistencyScore, weight: weights.find(w=>w.id==='consistency')?.weight, details: `SD: ${scoreOutputs.sdValue}` },
                    { label: 'Professionalism Score', value: scoreOutputs.professionalismScore, weight: weights.find(w=>w.id==='professionalism')?.weight }
                  ].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-neutral-400">{cat.label} {cat.details && <span className="text-[9px] font-mono text-neutral-500">({cat.details})</span>}</span>
                        <span className="text-white font-semibold font-mono">{cat.value} <span className="text-neutral-500 text-[9px]">({cat.weight}%)</span></span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-neutral-600 h-full rounded-full"
                          style={{ width: `${cat.value}%`, backgroundColor: cat.value > 85 ? '#2dd4bf' : cat.value > 70 ? '#38bdf8' : '#fb7185' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fraud Alerts Sidebar preview */}
              {scoreOutputs.fraudAlerts.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold">Fraud Protection Watchdog Alert</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-[10px] text-rose-300/90 leading-relaxed">
                    {scoreOutputs.fraudAlerts.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                  <span className="text-[9px] text-neutral-500 block">Scores remain unaffected. Administrator verification flag marked.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SUB TAB 2: WEIGHTS CONFIGURATOR */}
        {activeSubTab === 'weights' && (
          <motion.div
            key="weights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Administrative Weights Allocation Controller</h3>
                  <p className="text-xs text-neutral-400 mt-1">Determine the global category impact factor. All weights must sum exactly to 100%.</p>
                </div>
                <Scale className="w-5 h-5 text-teal-400" />
              </div>

              <div className="space-y-4">
                {weights.map(w => (
                  <div key={w.id} className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-md">
                      <span className="text-xs font-bold text-neutral-200">{w.name}</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">{w.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={weightEditState[w.id] || 0}
                        onChange={e => handleWeightChange(w.id, parseInt(e.target.value) || 0)}
                        className="w-32 accent-teal-400"
                      />
                      <div className="w-16">
                        <input
                          type="number"
                          value={weightEditState[w.id] || 0}
                          onChange={e => handleWeightChange(w.id, parseInt(e.target.value) || 0)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-center font-mono text-white"
                        />
                      </div>
                      <span className="text-xs font-mono text-neutral-500">%</span>
                    </div>
                  </div>
                ))}
              </div>

              {weightError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400 font-mono">
                  <AlertCircle className="w-4 h-4" />
                  <span>{weightError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
                <button
                  onClick={() => {
                    const resetObj: Record<string, number> = {
                      deadline: 20,
                      quality: 25,
                      comm: 15,
                      resp: 15,
                      problem: 10,
                      consistency: 10,
                      professionalism: 5
                    };
                    setWeightEditState(resetObj);
                    setWeightError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:bg-neutral-900 transition-all"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={saveWeights}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-neutral-950 text-xs font-bold transition-all shadow-md"
                >
                  Apply & Commit Weights
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 3: FRAUD PROTECTION WATCHDOG */}
        {activeSubTab === 'fraud' && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* General Description */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-widest">Fraud Defense</span>
                </div>
                <h3 className="text-sm font-bold text-white">Anomalous Scoring Engine</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Real-time pattern analysis monitoring for potential rating collusion, extreme review anomalies, or identical bulk telemetry patterns.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900 space-y-1">
                <span className="text-[10px] font-mono text-teal-400 font-bold block uppercase">No Auto score adjustment</span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  To prevent false positives, suspicious reviews do not alter scores immediately. Instead, they flag an administrator audit requirement.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase">IP & Device Signature Vetting</span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Calculates cross-matching headers to block duplicate review feedback from identical sources within brief windows.
                </p>
              </div>
            </div>

            {/* Simulated Case list */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-bold">Live Suspicious Queue (Simulated)</h4>
              <div className="space-y-3">
                {[
                  { student: 'Jin-Woo Park', reviewer: 'Kim Shippers Inc.', type: 'Collusive Rating (Perfect Scores)', score: 100.00, reasons: ['All 23 qualitative metrics rated exactly 5 ★', 'Submitted within 3 seconds of project start.'], severity: 'HIGH' },
                  { student: 'Aria Henderson', reviewer: 'Aria Henderson (Self-Post)', type: 'Reciprocal Review Violation', score: 98.40, reasons: ['Submitter IP matches Student primary login subnet', 'Cross-correlation coefficient: 0.98.'], severity: 'CRITICAL' },
                  { student: 'Minh Anh', reviewer: 'VUNO Tech', type: 'Normal Flow Vetted', score: scoreOutputs.finalScore, reasons: scoreOutputs.fraudAlerts.length > 0 ? scoreOutputs.fraudAlerts : ['Fully verified RMIT academic domain', 'Multi-week consistent telemetry.'], severity: scoreOutputs.fraudAlerts.length > 0 ? 'WARNING' : 'SAFE' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${item.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : item.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : item.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          {item.severity}
                        </span>
                        <span className="text-xs font-bold text-neutral-200">{item.type}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-neutral-400">
                        <div>Student: <span className="text-white">{item.student}</span></div>
                        <div>Reviewer: <span className="text-white">{item.reviewer}</span></div>
                      </div>

                      <div className="space-y-1 pl-4 list-disc text-[10px] text-neutral-500">
                        {item.reasons.map((r, i) => (
                          <div key={i}>• {r}</div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 block">CALC SCORE</span>
                        <span className="text-sm font-mono font-bold text-white">{item.score}</span>
                      </div>
                      <button className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-[10px] font-mono text-neutral-300 rounded-lg">
                        Verify Auditing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 4: IMMUTABLE AUDIT LEDGER */}
        {activeSubTab === 'audits' && (
          <motion.div
            key="audits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Immutable Ledger & Recalculation Audits</h3>
                  <p className="text-xs text-neutral-400 mt-1">Every dynamic update is recorded as an immutable snapshot. Records can never be deleted or modified.</p>
                </div>
                <button
                  onClick={() => {
                    setAuditLogs([
                      {
                        id: `AUD_CALC_9021`,
                        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                        version: 'v1.0.0 (Deterministic)',
                        studentId: 'RM_ST_2901',
                        studentName: 'Minh Anh',
                        projectId: 'PRJ_HEALTH_AI',
                        triggerEvent: 'WEEKLY_REVIEW_COMPLETED',
                        previousScore: 88.5,
                        newScore: 91.24,
                        grade: 'A+',
                        weights: { deadline: 20, quality: 25, comm: 15, resp: 15, problem: 10, consistency: 10, professionalism: 5 },
                        categoryScores: { deadline: 96, quality: 88.5, comm: 92, resp: 95, problem: 90, consistency: 100, professionalism: 95 },
                        fraudAlerts: []
                      }
                    ]);
                  }}
                  className="px-3 py-1 border border-neutral-800 hover:border-rose-950 hover:text-rose-400 bg-neutral-900/30 rounded-xl text-[10px] font-mono transition-colors"
                >
                  Clear Simulated Log History
                </button>
              </div>

              <div className="space-y-3.5">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-xl bg-neutral-900/20 border border-neutral-900 flex flex-col md:flex-row md:items-start justify-between gap-4 font-mono text-[11px] text-neutral-400 leading-relaxed">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-teal-400 font-bold">{log.id}</span>
                        <span className="text-neutral-600">|</span>
                        <span className="text-xs font-semibold text-neutral-300">{log.studentName} ({log.studentId})</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-neutral-500">
                        <div>Project: <span className="text-neutral-300">{log.projectId}</span></div>
                        <div>Trigger: <span className="text-neutral-300">{log.triggerEvent}</span></div>
                        <div>Time: <span className="text-neutral-300">{new Date(log.timestamp).toLocaleTimeString()}</span></div>
                        <div>Alg Version: <span className="text-teal-500">{log.version}</span></div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] font-mono text-neutral-600 font-bold block mb-1">CATEGORY SNAPSHOTS:</span>
                        <div className="flex flex-wrap gap-2 text-[9px]">
                          {Object.entries(log.categoryScores).map(([k, v]) => (
                            <span key={k} className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
                              {k}: <span className="text-white font-bold">{v}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {log.fraudAlerts.length > 0 && (
                        <div className="mt-1.5 text-rose-400 text-[10px]">
                          ⚠️ Flagged: {log.fraudAlerts.join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 bg-neutral-950 p-3 rounded-lg border border-neutral-900 flex flex-col justify-between h-20">
                      <span className="text-[9px] text-neutral-600 uppercase font-bold block">SCORE TRANSITION</span>
                      <div className="text-xs font-bold text-white mt-1">
                        {log.previousScore} → <span className="text-teal-400 text-sm font-extrabold">{log.newScore}</span>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-400 mt-0.5">GRADE: {log.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 5: DATA MODEL SPECIFICATIONS */}
        {activeSubTab === 'spec' && (
          <motion.div
            key="spec"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Spec blueprint document */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <div className="pb-3 border-b border-neutral-900">
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">TECHNICAL ARCHITECTURE</span>
                <h3 className="text-sm font-bold text-white">Firestore Schema Blueprint for PerformanceScore</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                  Enforces normalized structures, preventing calculated duplication. Maintains full backward compatibility using algorithm version pins.
                </p>
              </div>

              {/* Code Panel */}
              <div className="bg-neutral-900/30 rounded-xl border border-neutral-900 p-4 font-mono text-[10px] text-neutral-300 space-y-3">
                <div>
                  <span className="text-teal-400 font-bold">// Collection Path: /users/{"{userId}"}/performance_history/{"{snapshotId}"}</span>
                  <pre className="text-neutral-400 mt-1">
{`{
  "snapshotId": "snap_9021_2026",
  "calculatedAt": "2026-07-04T12:09:00Z",
  "engineVersion": "v1.0.0",
  "projectId": "PRJ_HEALTH_AI",
  "triggeringEvent": "EMPLOYER_REVIEW_SUBMITTED",
  "finalScore": 91.24,
  "grade": "A+",
  "activeWeights": {
    "deadline": 20,
    "quality": 25,
    "comm": 15,
    "resp": 15,
    "problem": 10,
    "consistency": 10,
    "professionalism": 5
  },
  "categoryScores": {
    "deadline": 96.00,
    "quality": 88.50,
    "comm": 92.00,
    "resp": 95.00,
    "problem": 90.00,
    "consistency": 100.00,
    "professionalism": 95.00
  },
  "rawTelemetryInputs": {
    "assignmentCount": 10,
    "onTimeCount": 8,
    "earlyCount": 2,
    "missedCount": 0,
    "averageDelayHours": 0,
    "qualityRatingsAvg": 4.4,
    "responseRateHours": 1.5,
    "varianceStandardDeviation": 2.15
  },
  "fraudMetadata": {
    "isFlagged": false,
    "flags": [],
    "auditPassed": true
  }
}`}
                  </pre>
                </div>
              </div>

              {/* Rules and guidelines description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-400 leading-relaxed">
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-900 space-y-2">
                  <span className="text-xs font-bold text-teal-400 block">Automatic Trigger Recalculators</span>
                  <p>
                    Recalculations must be processed server-side in Cloud Functions. Listening triggers must bind atomic database transactions to write the audit snapshot and simultaneously update the student's unified, cached performance score profile.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-900 space-y-2">
                  <span className="text-xs font-bold text-teal-400 block">Durable History Isolation</span>
                  <p>
                    All historical recalculations are strictly immutable. Once logged, writing rules are set to false (allow write: if false) to block any potential administrative tampering. Perfect for HR tech audits and grading verification checks.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
}

// Simple Rating Star Helper
function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.174-.367.728-.367.901 0l2.222 4.492 4.962.72c.404.059.565.558.273.847l-3.593 3.5.847 4.938c.069.402-.353.71-.71.52L12 16.623l-4.428 2.348c-.357.19-.779-.118-.71-.52l.847-4.938-3.593-3.5a.273.273 0 01.273-.847l4.962-.72 2.222-4.493z" />
    </svg>
  );
}
