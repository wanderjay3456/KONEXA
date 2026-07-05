import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Award,
  TrendingUp,
  Settings,
  ShieldCheck,
  ShieldAlert,
  History,
  BookOpen,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sliders,
  Scale,
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
  FolderKanban,
  GitBranch,
  Smile,
  ZapOff,
  ClipboardList,
  Eye,
  Percent,
  Play,
  HelpCircle,
  BarChart4,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers2
} from 'lucide-react';

// Interfaces for our Learning Engine Data Model
interface WeightSuggestion {
  id: string;
  name: string;
  currentWeight: number; // percentage
  suggestedWeight: number; // percentage
  confidence: number; // 0-100
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface OutcomeRecord {
  id: string;
  studentName: string;
  companyName: string;
  projectName: string;
  matchingScore: number;
  confidenceScore: number;
  performanceScore: number;
  trustScore: number;
  employerSatisfaction: number;
  studentSatisfaction: number;
  hiringResult: boolean;
  classification: 'Perfect Success' | 'Excellent Success' | 'Successful' | 'Partial Success' | 'Project Failure' | 'Recommendation Failure';
  timestamp: string;
}

interface IndustryStat {
  industry: string;
  totalMatches: number;
  successRate: number;
  failureRate: number;
  confidence: number;
  trend: 'up' | 'stable' | 'down';
}

interface SkillStat {
  skillName: string;
  category: string;
  totalMatches: number;
  successRate: number;
  completionRate: number;
  satisfactionRate: number;
  confidence: number;
}

interface OutlierRecord {
  id: string;
  type: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
  status: 'EXCLUDED' | 'UNDER_REVIEW';
}

interface DriftReport {
  id: string;
  metric: string;
  previousValue: string;
  currentValue: string;
  deviation: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestion: string;
  detectedAt: string;
}

export default function LearningEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'suggestions' | 'simulation' | 'outliers' | 'docs'>('overview');
  const [engineVersion, setEngineVersion] = useState<'v1' | 'v2' | 'v3'>('v1');
  const [isProcessing, setIsProcessing] = useState(false);

  // Data Decay settings
  const [decay90, setDecay90] = useState(100);
  const [decay180, setDecay180] = useState(90);
  const [decay365, setDecay365] = useState(75);
  const [decay720, setDecay720] = useState(50);

  // "What-if" Simulation variables
  const [simAcademicMatch, setSimAcademicMatch] = useState(15);
  const [simSkillMatch, setSimSkillMatch] = useState(25);
  const [simTrustMatch, setSimTrustMatch] = useState(15);
  const [simPerformanceMatch, setSimPerformanceMatch] = useState(20);
  const [simIndustryMatch, setSimIndustryMatch] = useState(15);
  const [simAvailabilityMatch, setSimAvailabilityMatch] = useState(10);
  
  const [simulationResult, setSimulationResult] = useState<{
    projectedAccuracy: number;
    expectedImprovement: number;
    confidenceScore: number;
    isBalanced: boolean;
  } | null>(null);

  // Configurable Initial Weight Suggestions
  const [weightSuggestions, setWeightSuggestions] = useState<WeightSuggestion[]>([
    {
      id: 'SUG_01',
      name: 'Technical Skill Match Score',
      currentWeight: 18,
      suggestedWeight: 22,
      confidence: 96,
      reason: 'Dense post-project evaluations indicate developers exceeding the 90% technical match threshold have a 94.2% completion rate without ledger warnings.',
      status: 'Pending'
    },
    {
      id: 'SUG_02',
      name: 'Academic Curriculum Alignment',
      currentWeight: 15,
      suggestedWeight: 12,
      confidence: 89,
      reason: 'Course syllabus alignment has a fading correlation with final work performance compared to active GitHub commit volume and verified micro-credentials.',
      status: 'Pending'
    },
    {
      id: 'SUG_03',
      name: 'Trust Stability Index',
      currentWeight: 12,
      suggestedWeight: 15,
      confidence: 94,
      reason: 'History of warnings and early project cancellations highly predict final matching dropouts. Increasing trust weight prevents unstable recommendations.',
      status: 'Pending'
    },
    {
      id: 'SUG_04',
      name: 'Availability Match Overlap',
      currentWeight: 10,
      suggestedWeight: 11,
      confidence: 82,
      reason: 'Marginal performance variance found when timezone match overlaps are greater than 4 hours.',
      status: 'Pending'
    }
  ]);

  // Simulated Historical Learning Datasets
  const [outcomeDataset, setOutcomeDataset] = useState<OutcomeRecord[]>([
    {
      id: 'OUT_01',
      studentName: 'Nora Lindqvist',
      companyName: 'Equinor ASA',
      projectName: 'Offshore Energy Analytics',
      matchingScore: 94.5,
      confidenceScore: 97.4,
      performanceScore: 98,
      trustScore: 99,
      employerSatisfaction: 96,
      studentSatisfaction: 98,
      hiringResult: true,
      classification: 'Perfect Success',
      timestamp: '2026-07-02T14:30:00Z'
    },
    {
      id: 'OUT_02',
      studentName: 'Devon Miller',
      companyName: 'Vingroup JSC',
      projectName: 'EV Dashboard Core',
      matchingScore: 92.0,
      confidenceScore: 88.5,
      performanceScore: 91,
      trustScore: 94,
      employerSatisfaction: 92,
      studentSatisfaction: 90,
      hiringResult: true,
      classification: 'Excellent Success',
      timestamp: '2026-06-28T09:15:00Z'
    },
    {
      id: 'OUT_03',
      studentName: 'Aris Thorne',
      companyName: 'Nippon Steel',
      projectName: 'Yield Control Model',
      matchingScore: 81.2,
      confidenceScore: 52.0,
      performanceScore: 45,
      trustScore: 40,
      employerSatisfaction: 30,
      studentSatisfaction: 50,
      hiringResult: false,
      classification: 'Project Failure',
      timestamp: '2026-06-25T16:45:00Z'
    },
    {
      id: 'OUT_04',
      studentName: 'Yuki Takahashi',
      companyName: 'Line Corp',
      projectName: 'WebRTC Protocol Handler',
      matchingScore: 88.5,
      confidenceScore: 91.0,
      performanceScore: 87,
      trustScore: 98,
      employerSatisfaction: 85,
      studentSatisfaction: 88,
      hiringResult: false,
      classification: 'Successful',
      timestamp: '2026-06-20T11:00:00Z'
    },
    {
      id: 'OUT_05',
      studentName: 'Amara Diallo',
      companyName: 'Aker Solutions',
      projectName: 'Telemetry Visualizer',
      matchingScore: 78.4,
      confidenceScore: 72.0,
      performanceScore: 72,
      trustScore: 85,
      employerSatisfaction: 75,
      studentSatisfaction: 80,
      hiringResult: false,
      classification: 'Partial Success',
      timestamp: '2026-06-15T10:20:00Z'
    }
  ]);

  // Industry Learning Statistics
  const [industryStats] = useState<IndustryStat[]>([
    { industry: 'Software Engineering', totalMatches: 145, successRate: 91.2, failureRate: 4.5, confidence: 95, trend: 'up' },
    { industry: 'Artificial Intelligence', totalMatches: 98, successRate: 88.5, failureRate: 6.2, confidence: 91, trend: 'up' },
    { industry: 'Design / Creative', totalMatches: 64, successRate: 82.4, failureRate: 11.0, confidence: 85, trend: 'stable' },
    { industry: 'Academic Research', totalMatches: 35, successRate: 78.0, failureRate: 14.5, confidence: 79, trend: 'down' },
    { industry: 'Healthcare & Biotech', totalMatches: 42, successRate: 89.0, failureRate: 5.0, confidence: 88, trend: 'stable' }
  ]);

  // Skill Success Index Tracking
  const [skillStats] = useState<SkillStat[]>([
    { skillName: 'React / NextJS', category: 'Frontend', totalMatches: 120, successRate: 92.5, completionRate: 95.0, satisfactionRate: 94, confidence: 96 },
    { skillName: 'Python / PyTorch', category: 'AI / Data Science', totalMatches: 85, successRate: 89.2, completionRate: 91.4, satisfactionRate: 90, confidence: 93 },
    { skillName: 'TypeScript / Node', category: 'Backend', totalMatches: 95, successRate: 90.0, completionRate: 93.5, satisfactionRate: 92, confidence: 95 },
    { skillName: 'Rust / Systems', category: 'Core Dev', totalMatches: 24, successRate: 83.3, completionRate: 87.5, satisfactionRate: 81, confidence: 78 },
    { skillName: 'Docker / Kubernetes', category: 'DevOps', totalMatches: 45, successRate: 86.6, completionRate: 90.0, satisfactionRate: 88, confidence: 87 }
  ]);

  // Simulated Fraud and Outlier Detections
  const [outliers, setOutliers] = useState<OutlierRecord[]>([
    {
      id: 'OUT_DET_201',
      type: 'Reciprocal Collusive Reviews',
      description: 'Identified abnormal matching profiles where Student STU_94 and Company COM_33 submitted perfect feedback within 1 minute of contract close without repository commits.',
      severity: 'HIGH',
      detectedAt: '2026-07-03T11:42:00Z',
      status: 'EXCLUDED'
    },
    {
      id: 'OUT_DET_202',
      type: 'Duplicate Sandbox Projects',
      description: 'Identified identical template deliverable hashes evaluated across 3 independent student submissions from identical institutional IPs.',
      severity: 'MEDIUM',
      detectedAt: '2026-06-30T15:20:00Z',
      status: 'EXCLUDED'
    },
    {
      id: 'OUT_DET_203',
      type: 'Artificial Rating Inflation',
      description: 'Satisfaction rating standard deviation of zero across 8 consecutive micro-projects under identical single-employer proxy accounts.',
      severity: 'HIGH',
      detectedAt: '2026-06-28T08:10:00Z',
      status: 'UNDER_REVIEW'
    }
  ]);

  // Drift Reports (Trend Shifts)
  const [driftReports] = useState<DriftReport[]>([
    {
      id: 'DRIFT_01',
      metric: 'AI / LLM Framework Demand',
      previousValue: '12% of projects',
      currentValue: '38% of projects',
      deviation: '+216% growth',
      impact: 'HIGH',
      suggestion: 'Suggest increasing matching priority of @google/genai and LLM engineering micro-credentials by 4% to capture market demand drift.',
      detectedAt: '2026-07-04T01:00:00Z'
    },
    {
      id: 'DRIFT_02',
      metric: 'Remote vs Hybrid Preference',
      previousValue: '52% remote preference',
      currentValue: '74% remote preference',
      deviation: '+42% change',
      impact: 'MEDIUM',
      suggestion: 'Calibrate candidate availability scores to penalize fixed onsite constraints by 2% for global cross-border enterprise contracts.',
      detectedAt: '2026-07-02T12:00:00Z'
    }
  ]);

  // Audit Logs Ledger
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '[Learning Initialized] Pulling last 90 days of completed micro-project outcomes...',
    '[Processing Complete] Loaded 408 verified historical datasets.',
    '[Outlier Audit] Scanned for collusive review rings. Excluded 3 suspect nodes.',
    '[Dimension Scan] Calculated dimension success index for academic, skill, and trust vectors.',
    '[Feature Contribution Calc] Feature Importance weights resolved. Calibration complete.'
  ]);

  // Execute What-if Simulation Predictor
  const runWhatIfSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const sum = simAcademicMatch + simSkillMatch + simTrustMatch + simPerformanceMatch + simIndustryMatch + simAvailabilityMatch;
      const isBalanced = sum === 100;
      
      // Predict projected accuracy based on the sum and alignment
      // Slower academic weight combined with high skill and high trust is scientifically more accurate!
      const alignmentFactor = (simSkillMatch * 0.4) + (simTrustMatch * 0.3) + (simPerformanceMatch * 0.2) - (simAcademicMatch * 0.1);
      const baseAccuracy = 84.5;
      const projectedAccuracy = Number((baseAccuracy + (alignmentFactor / 10)).toFixed(2));
      const expectedImprovement = Number((projectedAccuracy - 86.2).toFixed(2));
      
      setSimulationResult({
        projectedAccuracy,
        expectedImprovement,
        confidenceScore: isBalanced ? 94 : 45,
        isBalanced
      });
      setIsProcessing(false);

      // Record in logs
      setAuditLogs(prev => [
        `[What-If Simulation Executed] Weights Matrix: Academic (${simAcademicMatch}%), Skill (${simSkillMatch}%), Trust (${simTrustMatch}%), Performance (${simPerformanceMatch}%), Industry (${simIndustryMatch}%), Availability (${simAvailabilityMatch}%). Predicted Match Accuracy: ${projectedAccuracy}%`,
        ...prev
      ]);
    }, 450);
  };

  useEffect(() => {
    runWhatIfSimulation();
  }, [simAcademicMatch, simSkillMatch, simTrustMatch, simPerformanceMatch, simIndustryMatch, simAvailabilityMatch]);

  const handleApproveSuggestion = (id: string) => {
    setWeightSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        setAuditLogs(logs => [
          `[Admin Approved] Weight change proposal for "${s.name}" (from ${s.currentWeight}% to ${s.suggestedWeight}%) authorized. Configuration updated.`,
          ...logs
        ]);
        return { ...s, status: 'Approved' };
      }
      return s;
    }));
    alert('Weight change proposal successfully processed. Recommended settings pushed to the production matching database config.');
  };

  const handleRejectSuggestion = (id: string) => {
    setWeightSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        setAuditLogs(logs => [
          `[Admin Rejected] Weight change proposal for "${s.name}" archived as Rejected.`,
          ...logs
        ]);
        return { ...s, status: 'Rejected' };
      }
      return s;
    }));
  };

  const handleForceUpdate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newLogs = [
        `[Scheduled Learning Sweep] Executed temporal decay calibration. Applied values: 90d (${decay90}%), 180d (${decay180}%), 365d (${decay365}%), 720d (${decay720}%).`,
        `[Audit complete] Re-computed Success indices across 5 target industries.`,
        ...auditLogs
      ];
      setAuditLogs(newLogs);
      setIsProcessing(false);
      alert('Learning Engine dataset synchronization and decay model successfully refreshed.');
    }, 500);
  };

  // Convert stats to a scannable REST API payload for docs representation
  const docsApiPayload = {
    specification_version: "3.0.0",
    engine: "KONEXA AI Recommendation Learning Engine",
    architecture_framework: "Deterministic Rule-Based / AI-Model Pre-Integration Layer",
    accuracy_metrics: {
      recommendation_acceptance_rate: "88.4%",
      micro_project_completion_rate: "94.2%",
      employer_retention_hiring_rate: "42.8%",
      average_satisfaction_rating_index: "91.5"
    },
    temporal_decay_multipliers: {
      under_90_days: `${decay90}%`,
      under_180_days: `${decay180}%`,
      under_365_days: `${decay365}%`,
      under_720_days: `${decay720}%`
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand Title Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Learning Specification 3.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recommendation Learning Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Continuously improves future matching quality by analyzing historical project outcomes, employer reviews, and final hiring metrics. Suggests weight modifications with full traceability and deterministic explainability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">ONLINE • ACTIVE SWEEPS</span>
          </div>
        </div>
      </div>

      {/* Main Navigation tabs */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'overview', label: 'Performance Summary', icon: BarChart4 },
          { id: 'suggestions', label: 'Weight Adjustments', icon: Sliders },
          { id: 'simulation', label: 'What-If Simulation', icon: Play },
          { id: 'outliers', label: 'Outliers & Drift', icon: ShieldAlert },
          { id: 'docs', label: 'Database Schema & Specs', icon: BookOpen }
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

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top-line Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Recommendation Accuracy</span>
                <div className="text-2xl font-bold text-white font-mono flex items-center justify-between">
                  <span>88.4%</span>
                  <span className="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +1.8%
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Matches resulting in successful project completion.</p>
              </div>

              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Hiring Conversion Rate</span>
                <div className="text-2xl font-bold text-white font-mono flex items-center justify-between">
                  <span>42.8%</span>
                  <span className="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Students hired after finishing micro-projects.</p>
              </div>

              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Active Sample Size</span>
                <div className="text-2xl font-bold text-white font-mono">
                  <span>408 Cases</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Total verified outcome dossiers inside active memory.</p>
              </div>

              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-2 text-right relative overflow-hidden">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold text-left">Sweeper Status</span>
                <div className="text-xl font-bold text-white font-mono text-left">Decay Compensated</div>
                <button
                  onClick={handleForceUpdate}
                  className="w-full mt-2.5 py-1.5 px-3 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Sync Decay & Data</span>
                </button>
              </div>
            </div>

            {/* Funnel & Outcome Dataset Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Recommendation Funnel & Feature Importance */}
              <div className="lg:col-span-4 space-y-6">
                {/* Visual Matching Conversion Funnel */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Recommendation Funnel</span>
                  <div className="space-y-3.5 text-xs font-mono">
                    {[
                      { step: 'Recommended', count: 1240, rate: '100%', bg: 'bg-teal-500/20' },
                      { step: 'Applied / Match', count: 980, rate: '79.0%', bg: 'bg-teal-500/30' },
                      { step: 'Accepted', count: 812, rate: '65.4%', bg: 'bg-teal-500/40' },
                      { step: 'Project Started', count: 520, rate: '41.9%', bg: 'bg-teal-500/50' },
                      { step: 'Completed', count: 408, rate: '32.9%', bg: 'bg-teal-500/60' },
                      { step: 'Hired / Retained', count: 175, rate: '14.1%', bg: 'bg-teal-500/80 text-black font-semibold' }
                    ].map((f, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-neutral-300">
                          <span>{idx + 1}. {f.step}</span>
                          <span className="text-neutral-500">{f.count} ({f.rate})</span>
                        </div>
                        <div className="w-full bg-neutral-900 h-6.5 rounded-lg overflow-hidden flex items-center px-2 relative border border-neutral-850">
                          <div className={`absolute left-0 top-0 bottom-0 ${f.bg}`} style={{ width: f.rate }} />
                          <span className="relative z-10 text-[10px] text-white font-semibold">{f.rate} Conversion</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Importance weights breakdown */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold block">Engine Feature Importance</span>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">Calculated contribution of matching dimensions based on final outcome success correlations.</p>
                  <div className="space-y-3.5 text-xs">
                    {[
                      { name: 'Technical Skills Match', value: '24%', bar: 'w-[24%]' },
                      { name: 'Trust Standard Ledger', value: '18%', bar: 'w-[18%]' },
                      { name: 'Historical Performance Variance', value: '16%', bar: 'w-[16%]' },
                      { name: 'Academic Curriculum Alignment', value: '12%', bar: 'w-[12%]' },
                      { name: 'Availability Match Overlap', value: '10%', bar: 'w-[10%]' },
                      { name: 'Work Style Match Preference', value: '8%', bar: 'w-[8%]' },
                      { name: 'Language & English proficiency', value: '6%', bar: 'w-[6%]' },
                      { name: 'Career / Growth Potential', value: '6%', bar: 'w-[6%]' }
                    ].map((f, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-300">{f.name}</span>
                          <span className="text-teal-400 font-bold">{f.value}</span>
                        </div>
                        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full bg-teal-400 rounded-full ${f.bar}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Outcomes Dataset Log Table */}
              <div className="lg:col-span-8 space-y-6">
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Outcome Classification Dataset</span>
                    <span className="text-[10px] font-mono text-neutral-500">Immutable Records</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-900 text-neutral-400 font-mono text-[10px] uppercase">
                          <th className="pb-3 font-semibold">Target Recommendation</th>
                          <th className="pb-3 font-semibold">Match / Conf</th>
                          <th className="pb-3 font-semibold">Scores (Perf/Trust)</th>
                          <th className="pb-3 font-semibold">Classification</th>
                          <th className="pb-3 font-semibold text-right">Hired</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {outcomeDataset.map(out => {
                          const isSuccess = out.classification.includes('Success') || out.classification === 'Successful';
                          const isFailure = out.classification.includes('Failure');
                          
                          return (
                            <tr key={out.id} className="hover:bg-neutral-900/20 transition">
                              <td className="py-3.5 pr-2">
                                <div className="font-semibold text-white">{out.studentName}</div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">{out.companyName} • {out.projectName}</div>
                              </td>
                              <td className="py-3.5 font-mono text-[11px] text-neutral-300">
                                <div>M: {out.matchingScore}%</div>
                                <div className="text-[10px] text-neutral-500 mt-0.5">C: {out.confidenceScore}%</div>
                              </td>
                              <td className="py-3.5 font-mono text-[11px] text-neutral-300">
                                <div>P: {out.performanceScore}</div>
                                <div className="text-[10px] text-neutral-500 mt-0.5">T: {out.trustScore}</div>
                              </td>
                              <td className="py-3.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                                  out.classification === 'Perfect Success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                  out.classification === 'Excellent Success' ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' :
                                  out.classification === 'Successful' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' :
                                  out.classification === 'Partial Success' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                  'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {out.classification === 'Perfect Success' && <CheckCircle2 className="w-3 h-3" />}
                                  {out.classification === 'Project Failure' && <XCircle className="w-3 h-3" />}
                                  <span>{out.classification}</span>
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${out.hiringResult ? 'bg-emerald-400' : 'bg-neutral-800'}`} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Industry Matching Learning statistics */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Independent Industry Statistics</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {industryStats.map(stat => (
                      <div key={stat.industry} className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-white">{stat.industry}</h4>
                            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{stat.totalMatches} cases mapped</p>
                          </div>
                          <span className={`text-[10px] font-mono font-bold uppercase ${stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-rose-400' : 'text-neutral-500'}`}>
                            {stat.trend === 'up' && '▲ POSITIVE'}
                            {stat.trend === 'down' && '▼ DECLINE'}
                            {stat.trend === 'stable' && '● STABLE'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                          <div className="p-1.5 rounded bg-neutral-950 border border-neutral-850">
                            <span className="text-[9px] text-neutral-500 block">Success Rate</span>
                            <span className="text-emerald-400 font-bold">{stat.successRate}%</span>
                          </div>
                          <div className="p-1.5 rounded bg-neutral-950 border border-neutral-850">
                            <span className="text-[9px] text-neutral-500 block">Failure</span>
                            <span className="text-rose-400 font-bold">{stat.failureRate}%</span>
                          </div>
                          <div className="p-1.5 rounded bg-neutral-950 border border-neutral-850">
                            <span className="text-[9px] text-neutral-500 block">Certainty</span>
                            <span className="text-white font-bold">{stat.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Weight Adjustment suggestions */}
        {activeSubTab === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Suggestions Table Left */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Dynamic Weight Optimization Matrix</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Administrator Approval Required</span>
                  </span>
                </div>

                <div className="space-y-4">
                  {weightSuggestions.map(sg => {
                    const diff = sg.suggestedWeight - sg.currentWeight;
                    const isApproved = sg.status === 'Approved';
                    const isRejected = sg.status === 'Rejected';
                    
                    return (
                      <div
                        key={sg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isApproved ? 'bg-emerald-950/20 border-emerald-900/50' :
                          isRejected ? 'bg-neutral-950 border-neutral-900/50 opacity-60' :
                          'bg-neutral-900/60 border-neutral-800'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1 md:max-w-[70%]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-neutral-500">[{sg.id}]</span>
                              <h4 className="text-sm font-bold text-white">{sg.name}</h4>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed mt-1">{sg.reason}</p>
                          </div>

                          {/* Metric comparison block */}
                          <div className="flex items-center gap-3 font-mono text-center shrink-0">
                            <div className="p-2 bg-neutral-950 border border-neutral-850 rounded-lg min-w-16">
                              <span className="text-[9px] text-neutral-500 block">Current</span>
                              <span className="text-white font-bold">{sg.currentWeight}%</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-600" />
                            <div className="p-2 bg-neutral-950 border border-neutral-850 rounded-lg min-w-16">
                              <span className="text-[9px] text-neutral-500 block">Suggested</span>
                              <span className="text-teal-400 font-bold">{sg.suggestedWeight}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive action toolbar */}
                        <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center justify-between gap-4 flex-wrap text-xs">
                          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
                            <span>Certainty Index: <span className="text-teal-400 font-bold">{sg.confidence}%</span></span>
                          </div>

                          <div className="flex items-center gap-2">
                            {sg.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleRejectSuggestion(sg.id)}
                                  className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-neutral-400 font-medium transition"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleApproveSuggestion(sg.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-black font-semibold flex items-center gap-1.5 transition"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Authorize Change</span>
                                </button>
                              </>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-[10px] font-mono uppercase ${isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                                {isApproved ? 'Approved & Deployed' : 'Declined / Archived'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Config Decay factors panel Right */}
            <div className="lg:col-span-4 space-y-6">
              {/* Configurable Temporal Data Decay */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Temporal Data Decay</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Configures matching multiplier decay values. Prevents outdated performance trends from saturating current recommendations.</p>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Last 90 Days Weight</span>
                      <span className="text-teal-400 font-bold">{decay90}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={decay90}
                      onChange={e => setDecay90(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Last 180 Days Weight</span>
                      <span className="text-teal-400 font-bold">{decay180}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={decay180}
                      onChange={e => setDecay180(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Last 365 Days Weight</span>
                      <span className="text-teal-400 font-bold">{decay365}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={decay365}
                      onChange={e => setDecay365(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Last 720 Days Weight</span>
                      <span className="text-teal-400 font-bold">{decay720}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={decay720}
                      onChange={e => setDecay720(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center gap-2.5 text-[11px] leading-relaxed text-neutral-300">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Decayed parameters degrade linearly over time but historical calculations remain immutable inside audit storage.</span>
                </div>
              </div>

              {/* Skill success indexing directory */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Skill Success Index</span>
                <div className="space-y-3 font-mono text-[11px]">
                  {skillStats.map(sk => (
                    <div key={sk.skillName} className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1">
                      <div className="flex justify-between font-semibold text-white text-xs">
                        <span>{sk.skillName}</span>
                        <span className="text-teal-400">{sk.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                        <span>Compl: {sk.completionRate}%</span>
                        <span>Sat: {sk.satisfactionRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: What-If Simulation Engine */}
        {activeSubTab === 'simulation' && (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Slider Panel Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Matching Weights Simulation (Sum to 100%)</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Adjust individual matching weight balances to observe projected accuracy adjustments. Does not modify the live production database.</p>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Technical Skill Match Weight</span>
                      <span className="text-teal-400 font-bold">{simSkillMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={simSkillMatch}
                      onChange={e => setSimSkillMatch(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Trust Standard Match Weight</span>
                      <span className="text-teal-400 font-bold">{simTrustMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={simTrustMatch}
                      onChange={e => setSimTrustMatch(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Historical Performance Match Weight</span>
                      <span className="text-teal-400 font-bold">{simPerformanceMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={simPerformanceMatch}
                      onChange={e => setSimPerformanceMatch(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Academic Curriculum Weight</span>
                      <span className="text-teal-400 font-bold">{simAcademicMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={simAcademicMatch}
                      onChange={e => setSimAcademicMatch(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Industry Matching Profile Weight</span>
                      <span className="text-teal-400 font-bold">{simIndustryMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={simIndustryMatch}
                      onChange={e => setSimIndustryMatch(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="text-neutral-300">Availability Overlap Match Weight</span>
                      <span className="text-teal-400 font-bold">{simAvailabilityMatch}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={simAvailabilityMatch}
                      onChange={e => setSimAvailabilityMatch(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>
                </div>

                {/* Weights totals visual bar */}
                <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
                  <span className="text-neutral-400 text-xs">SUM OF SIMULATION WEIGHTS:</span>
                  <span className={`font-mono text-sm font-bold ${simAcademicMatch + simSkillMatch + simTrustMatch + simPerformanceMatch + simIndustryMatch + simAvailabilityMatch === 100 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                    {simAcademicMatch + simSkillMatch + simTrustMatch + simPerformanceMatch + simIndustryMatch + simAvailabilityMatch}% / 100%
                  </span>
                </div>
              </div>
            </div>

            {/* Projection Card Panel Right */}
            <div className="lg:col-span-5 space-y-6">
              {simulationResult && (
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 relative overflow-hidden space-y-6">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-3xl pointer-events-none" />

                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">PROJECTED ACCURACY PROJECTION</span>
                    <div className="text-5xl font-black text-white font-mono tracking-tight">
                      {simulationResult.projectedAccuracy}%
                    </div>
                    
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      simulationResult.isBalanced 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                      {simulationResult.isBalanced ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{simulationResult.isBalanced ? 'Balanced Configuration' : 'Imbalanced Sum Target'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-neutral-900/50 p-3 rounded-xl border border-neutral-900 text-center text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-neutral-500 block">Baseline Variance</span>
                      <span className="text-white font-bold">{simulationResult.expectedImprovement > 0 ? `+${simulationResult.expectedImprovement}%` : `${simulationResult.expectedImprovement}%`}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-neutral-500 block">Projection Certainty</span>
                      <span className="text-teal-400 font-bold">{simulationResult.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">Explainability Statement</span>
                    <p className="text-neutral-300 bg-neutral-900 p-3.5 rounded-xl border border-neutral-850">
                      {simulationResult.isBalanced 
                        ? `The simulated weight changes suggest a ${simulationResult.expectedImprovement > 0 ? 'positive improvement' : 'regression'} delta. Saturated technical skill match paired with stringent trust verification is statistically robust.` 
                        : 'Warning: Match weights do not sum up to 100%. Adjust sliders until total sums represent exactly 100% boundary criteria.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Dynamic Log view */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Diagnostics Loop Logs</span>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1 max-h-40 overflow-y-auto">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-teal-400 shrink-0">●</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Outliers & Drift reports */}
        {activeSubTab === 'outliers' && (
          <motion.div
            key="outliers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Outliers Section */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold block">Outlier & Collusion Detection Radar</span>
              <p className="text-xs text-neutral-400 max-w-2xl">Detects artificial feedback rings, reciprocal ratings, duplicate task deliverables, and fraudulent project templates. Excluded records are securely decoupled from the learning loop.</p>

              <div className="space-y-3">
                {outliers.map(out => (
                  <div key={out.id} className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-rose-400">[{out.severity}]</span>
                        <h4 className="text-xs font-bold text-white">{out.type}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{out.detectedAt}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{out.description}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-950">
                      <span>Ref ID: {out.id}</span>
                      <span className="text-rose-400 font-bold">{out.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drift Detection Alerts */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold block">Market Trend Drift Reports</span>
              <p className="text-xs text-neutral-400 max-w-2xl">Monitors shift deviations in skill demands, regional hiring variances, and remote style adjustments. Sends administrator alerts upon crossing significance thresholds.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {driftReports.map(dr => (
                  <div key={dr.id} className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">{dr.metric}</h4>
                        <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1 rounded inline-block mt-1">Impact: {dr.impact}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-emerald-400 font-bold block text-xs">{dr.deviation}</span>
                        <span className="text-[9px] text-neutral-500">vs Previous Baseline</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-900">{dr.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: Tech specs & Schema */}
        {activeSubTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Database schema layout */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">SQL Database Requirements (PostgreSQL DDL)</span>
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-850 font-mono text-[10px] text-emerald-400 space-y-1 overflow-x-auto max-h-96">
                  <p className="text-neutral-500">-- Learning Engine DB Schema v3.0</p>
                  <p>CREATE TABLE learning_datasets (</p>
                  <p className="pl-4">recommendation_id UUID PRIMARY KEY,</p>
                  <p className="pl-4">student_id UUID NOT NULL,</p>
                  <p className="pl-4">company_id UUID NOT NULL,</p>
                  <p className="pl-4">project_id UUID NOT NULL,</p>
                  <p className="pl-4">matching_score DECIMAL(5,2),</p>
                  <p className="pl-4">recommendation_confidence DECIMAL(5,2),</p>
                  <p className="pl-4">recommendation_rank INT,</p>
                  <p className="pl-4">project_completed BOOLEAN DEFAULT TRUE,</p>
                  <p className="pl-4">performance_score DECIMAL(5,2),</p>
                  <p className="pl-4">trust_score DECIMAL(5,2),</p>
                  <p className="pl-4">employer_satisfaction DECIMAL(5,2),</p>
                  <p className="pl-4">student_satisfaction DECIMAL(5,2),</p>
                  <p className="pl-4">hiring_result BOOLEAN,</p>
                  <p className="pl-4">classification VARCHAR(50) NOT NULL,</p>
                  <p className="pl-4">timestamp TIMESTAMPTZ DEFAULT NOW()</p>
                  <p>);</p>
                  <br />
                  <p>CREATE TABLE weight_adjustment_proposals (</p>
                  <p className="pl-4">proposal_id UUID PRIMARY KEY,</p>
                  <p className="pl-4">factor_name VARCHAR(100),</p>
                  <p className="pl-4">current_weight DECIMAL(4,2),</p>
                  <p className="pl-4">suggested_weight DECIMAL(4,2),</p>
                  <p className="pl-4">confidence DECIMAL(5,2),</p>
                  <p className="pl-4">status VARCHAR(20) DEFAULT &apos;PENDING&apos;,</p>
                  <p className="pl-4">audit_narrative TEXT</p>
                  <p>);</p>
                </div>
              </div>
            </div>

            {/* API specs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">API Endpoints Representation (JSON Payload)</span>
                <p className="text-xs text-neutral-400">Exposes matching conversion ratios, temporal configurations, and verified outcome classification distributions to external analytic clients.</p>
                
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-850 font-mono text-[10px] text-teal-400 overflow-x-auto max-h-96">
                  <pre>{JSON.stringify(docsApiPayload, null, 2)}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
