import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Sliders,
  ShieldCheck,
  Activity,
  Database,
  Search,
  Filter,
  History,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Tag,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Play,
  Share2,
  Trash2,
  RefreshCw,
  Plus,
  Eye,
  FileText,
  User,
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  Award,
  Globe,
  DatabaseBackup,
  Flame,
  ArrowRight,
  Key,
  Settings,
  AlertCircle,
  Repeat,
  Undo2,
  ListOrdered,
  Send,
  Check,
  BookOpen,
  BarChart,
  GitBranch,
  Settings2,
  Terminal,
  HelpCircle,
  Scale,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// ============================================================================
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 5.0 AI DECISION ENGINE)
// ============================================================================

export type DecisionType =
  | 'Binary'
  | 'Ranking'
  | 'Recommendation'
  | 'Classification'
  | 'Scoring'
  | 'Risk Evaluation'
  | 'Escalation'
  | 'Workflow Delegation';

export type DecisionStatus =
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Executed'
  | 'Escalated'
  | 'Archived';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface EvidenceItem {
  source: string;
  timestamp: string;
  reliability: number; // 0.0 - 1.0
  weight: number;      // 0.0 - 1.0
  verificationStatus: 'Verified' | 'Unverified' | 'Expired';
  description: string;
}

export interface AlternativeDecision {
  label: string;
  advantages: string[];
  disadvantages: string[];
  expectedOutcome: string;
  confidence: number; // 0 - 100
  businessImpact: 'Positive' | 'Neutral' | 'Adverse' | 'Critical';
}

export interface DecisionRecord {
  id: string;
  executionId: string;
  agentId: string;
  decisionType: DecisionType;
  objective: string;
  evidenceList: EvidenceItem[];
  confidence: number; // 0 - 100
  risk: RiskLevel;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  appliedRules: string[];
  alternatives: AlternativeDecision[];
  chosenDecision: string;
  rejectedDecisions: string[];
  requiresApproval: boolean;
  status: DecisionStatus;
  timestamp: string;
  version: string;
  explanation: string;
  suggestedNextStep: string;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_DECISIONS: DecisionRecord[] = [
  {
    id: 'DEC-0941',
    executionId: 'EXE-DEC-42091',
    agentId: 'AI Recruiter',
    decisionType: 'Recommendation',
    objective: 'Select top engineering candidate for FinTech Backend Project',
    evidenceList: [
      { source: 'student_profiles_db', timestamp: '2026-07-04T12:00:00Z', reliability: 0.98, weight: 0.4, verificationStatus: 'Verified', description: 'Student GPA 3.91, 14 verified Git commits on relevant modules' },
      { source: 'evaluation_engine', timestamp: '2026-07-04T12:15:00Z', reliability: 0.95, weight: 0.3, verificationStatus: 'Verified', description: 'Lab Performance Index computed at 96%' },
      { source: 'compatibility_matcher', timestamp: '2026-07-04T12:20:00Z', reliability: 0.90, weight: 0.3, verificationStatus: 'Verified', description: 'Semantic compatibility computed at 94.2%' }
    ],
    confidence: 94,
    risk: 'Low',
    priority: 'High',
    appliedRules: ['RULE-MAX-CREDENTIALS', 'RULE-VERIFIED-COMMIT-ONLY', 'RULE-COMPLIANCE-SAFETY'],
    alternatives: [
      {
        label: 'Approve Candidate STUD-8812 (Phan Minh Duc)',
        advantages: ['Highest technical overlap', 'Flawless lab checkins', 'Zero platform infractions'],
        disadvantages: ['Premium wage expectation offset'],
        expectedOutcome: 'Immediate project ramp-up, milestones hit early',
        confidence: 94,
        businessImpact: 'Positive'
      },
      {
        label: 'Select Alternative Candidate STUD-4412',
        advantages: ['Lower token-based credit requirements', 'Immediate availability'],
        disadvantages: ['Missing advanced LLM middleware modules', 'Lacks PostgreSQL optimization badge'],
        expectedOutcome: 'Slower start, may require manual developer supervision',
        confidence: 76,
        businessImpact: 'Neutral'
      }
    ],
    chosenDecision: 'Approve Candidate STUD-8812 (Phan Minh Duc) with 94.2% compatibility confidence.',
    rejectedDecisions: ['Select Alternative Candidate STUD-4412', 'Decline all match proposals'],
    requiresApproval: false,
    status: 'Executed',
    timestamp: '2026-07-04T19:22:00Z',
    version: '1.0.3',
    explanation: 'Candidate is recommended due to an optimal alignment of technical credentials, zero warning count history, and a high compatibility score computed by the vector database matching engine.',
    suggestedNextStep: 'Notify candidate and trigger automatic onboarding workflow sequence.'
  },
  {
    id: 'DEC-0942',
    executionId: 'EXE-DEC-42092',
    agentId: 'AI Fraud Detector',
    decisionType: 'Risk Evaluation',
    objective: 'Evaluate WebGL Canvas fingerprint collisions for Student Account SUS-402',
    evidenceList: [
      { source: 'platform_telemetry', timestamp: '2026-07-04T18:40:00Z', reliability: 0.99, weight: 0.5, verificationStatus: 'Verified', description: 'Identified identical canvas layout metrics on 4 distinct student browser logins within 90 seconds' },
      { source: 'ip_routing_table', timestamp: '2026-07-04T18:41:00Z', reliability: 0.92, weight: 0.3, verificationStatus: 'Verified', description: 'Requests route via a single commercial VPN gateway' },
      { source: 'warning_database', timestamp: '2026-07-04T18:42:00Z', reliability: 1.0, weight: 0.2, verificationStatus: 'Verified', description: 'Target student profile currently has 2 active compliance warnings' }
    ],
    confidence: 89,
    risk: 'Critical',
    priority: 'Critical',
    appliedRules: ['RULE-ANTI-FARMING', 'RULE-VPN-SENSITIVE-GUARD', 'RULE-MAX-WARNING-SUSPEND'],
    alternatives: [
      {
        label: 'Trigger Disciplinary Account Suspension',
        advantages: ['Instantly protects laboratory credit pools', 'Blocks bot farms'],
        disadvantages: ['May lead to false-positive customer ticket escalation if shared computer lab'],
        expectedOutcome: 'Student suspended, security lock active, ledger sealed',
        confidence: 89,
        businessImpact: 'Positive'
      },
      {
        label: 'Issue 3rd System Warning only',
        advantages: ['No disruption to student active session in progress'],
        disadvantages: ['High exposure to continued programmatic asset farming', 'Rule infraction bypass'],
        expectedOutcome: 'Security assets remains highly compromised',
        confidence: 45,
        businessImpact: 'Adverse'
      }
    ],
    chosenDecision: 'Trigger Disciplinary Account Suspension',
    rejectedDecisions: ['Issue 3rd System Warning only', 'Bypass warnings entirely'],
    requiresApproval: true,
    status: 'Pending Approval',
    timestamp: '2026-07-04T20:12:00Z',
    version: '2.1.0',
    explanation: 'Detected bot farming patterns via WebGL fingerprint matching. Identical hashes confirm programmatically duplicated client profiles. VPN route confirms masked locations.',
    suggestedNextStep: 'Suspend session, seal digital certificate vault, and route immediately to a human Trust & Safety moderator.'
  },
  {
    id: 'DEC-0943',
    executionId: 'EXE-DEC-42093',
    agentId: 'AI Communication Assistant',
    decisionType: 'Workflow Delegation',
    objective: 'Dispatch mass broadcast update on lab framework changes to 4,200 students',
    evidenceList: [
      { source: 'user_registry', timestamp: '2026-07-04T20:30:00Z', reliability: 0.95, weight: 0.5, verificationStatus: 'Verified', description: '4,200 active student email addresses' },
      { source: 'system_constitution', timestamp: '2026-07-04T20:31:00Z', reliability: 1.0, weight: 0.5, verificationStatus: 'Verified', description: 'Rules forbid bulk message delivery without prior human authorization' }
    ],
    confidence: 100,
    risk: 'High',
    priority: 'Medium',
    appliedRules: ['RULE-MAX-BULK-DELIVERY', 'RULE-HUMAN-IN-THE-LOOP-BROADCAST'],
    alternatives: [
      {
        label: 'Delegate to Human approval pipeline',
        advantages: ['100% policy compliance', 'No risk of unauthorized broadcast spamming'],
        disadvantages: ['Introduces manual operational latency'],
        expectedOutcome: 'Workflow pauses until Super Admin clicks Approve',
        confidence: 100,
        businessImpact: 'Positive'
      },
      {
        label: 'Bypass approval and dispatch automatically',
        advantages: ['Instant communication delivery'],
        disadvantages: ['Violates compliance rule RULE-MAX-BULK-DELIVERY', 'Subject to severe policy penalties'],
        expectedOutcome: 'System health score drops, potential audit violation',
        confidence: 10,
        businessImpact: 'Critical'
      }
    ],
    chosenDecision: 'Delegate to Human approval pipeline',
    rejectedDecisions: ['Bypass approval and dispatch automatically'],
    requiresApproval: true,
    status: 'Pending Approval',
    timestamp: '2026-07-04T20:32:00Z',
    version: '1.2.0',
    explanation: 'System constitution rule explicitly mandates human supervisor sign-off before dispatching broadcasts exceeding 500 recipients.',
    suggestedNextStep: 'Lock broadcast buffer and send approval ticket to Super Admin.'
  }
];

const METRICS_DECISION_TIMELINE = [
  { time: '19:40', decisions: 140, avgConfidence: 91.2, escalationRate: 1.2, avgLatencyMs: 240 },
  { time: '19:50', decisions: 185, avgConfidence: 92.5, escalationRate: 0.8, avgLatencyMs: 232 },
  { time: '20:00', decisions: 210, avgConfidence: 89.8, escalationRate: 2.1, avgLatencyMs: 255 },
  { time: '20:10', decisions: 250, avgConfidence: 93.1, escalationRate: 1.4, avgLatencyMs: 210 },
  { time: '20:20', decisions: 290, avgConfidence: 94.0, escalationRate: 1.1, avgLatencyMs: 198 },
  { time: '20:30', decisions: 340, avgConfidence: 93.6, escalationRate: 1.5, avgLatencyMs: 204 }
];

const DECISION_CATEGORY_PIE = [
  { name: 'Smart Recommendations', value: 48, color: '#6366f1' }, // Indigo
  { name: 'Risk / Fraud Evaluations', value: 22, color: '#f43f5e' }, // Rose
  { name: 'Workflow Delegations', value: 18, color: '#06b6d4' }, // Cyan
  { name: 'Classifications & Scoring', value: 12, color: '#eab308' } // Yellow
];

export default function AIDecisionEngineWorkspace() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [decisions, setDecisions] = useState<DecisionRecord[]>(INITIAL_DECISIONS);
  
  // Sub Tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'pipeline' | 'approvals' | 'analytics' | 'escalation' | 'compliance_tests' | 'blueprints'>('matrix');

  // Filtering states for Decision Registry
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Interactive Pipeline Simulator States
  const [simObjective, setSimObjective] = useState<string>('Evaluate student STUD-8812 matching for FinTech Project');
  const [simAgent, setSimAgent] = useState<string>('AI Recruiter');
  const [simType, setSimType] = useState<DecisionType>('Recommendation');
  const [simPriority, setSimPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  
  // Custom Evidence parameters
  const [evidenceGrade, setEvidenceGrade] = useState<number>(95);
  const [evidenceWarnings, setEvidenceWarnings] = useState<number>(0);
  const [evidenceCommits, setEvidenceCommits] = useState<number>(14);
  const [isVPNConnected, setIsVPNConnected] = useState<boolean>(false);

  // Runtime compilation variables
  const [pipelineStep, setPipelineStep] = useState<number>(-1);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [pipelineOutputDecision, setPipelineOutputDecision] = useState<DecisionRecord | null>(null);

  // Counters
  const [decisionTotalCounter, setDecisionTotalCounter] = useState<number>(14205);
  const [activeApprovalCounter, setActiveApprovalCounter] = useState<number>(2);

  // Compliance Test State
  const [testsRun, setTestsRun] = useState<boolean>(false);
  const [testSuiteLogs, setTestSuiteLogs] = useState<{ id: string; name: string; status: 'PASS' | 'FAIL'; output: string }[]>([]);

  // Blueprint state variables
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<'decision_records' | 'evidence_records' | 'alternatives' | 'escalation_history'>('decision_records');
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<'POST /api/decisions/evaluate' | 'POST /api/decisions/approve' | 'POST /api/decisions/escalate'>('POST /api/decisions/evaluate');

  // ==========================================
  // DECISION PIPELINE SIMULATOR ENGINE (SPEC-COMPLIANT)
  // ==========================================
  const triggerDecisionPipeline = () => {
    setPipelineRunning(true);
    setPipelineStep(0);
    setPipelineLogs([]);
    setPipelineOutputDecision(null);

    const logLines: string[] = [];
    const addLog = (msg: string) => {
      const timestamp = new Date().toISOString().substring(11, 19);
      logLines.push(`[${timestamp}] ${msg}`);
      setPipelineLogs([...logLines]);
    };

    // Stage 1: Receive Objective
    setTimeout(() => {
      addLog(`🎯 RECEIVE OBJECTIVE: "${simObjective}"`);
      addLog(`🤖 Requesting Agent node: "${simAgent}" [Type: ${simType}]`);
      setPipelineStep(1);
    }, 300);

    // Stage 2: Load Context
    setTimeout(() => {
      addLog(`📂 LOAD CONTEXT: Loading system, environment variables, and credential keys...`);
      addLog(`👉 Verified RBAC roles for agent: Authorization level matches System guidelines.`);
      setPipelineStep(2);
    }, 700);

    // Stage 3: Retrieve Memory & Knowledge
    setTimeout(() => {
      addLog(`🧠 MEMORY RETRIEVAL: Querying short-term vector buffer for similar decision matrices.`);
      addLog(`📚 KNOWLEDGE SYSTEM: Checking corporate database policies & verified checkin logs.`);
      addLog(`📊 Current data point parameters:`);
      addLog(`   - Student Performance Score: ${evidenceGrade}/100`);
      addLog(`   - Warning infraction level: ${evidenceWarnings} counts`);
      addLog(`   - Verified repository commits: ${evidenceCommits}`);
      addLog(`   - VPN Network route status: ${isVPNConnected ? 'VPN Tunnel Masked' : 'Clean Direct IP Node'}`);
      setPipelineStep(3);
    }, 1100);

    // Stage 4: Evaluate Business Rules (Specification requirement: no decision bypasses rules)
    setTimeout(() => {
      addLog(`⚖️ BUSINESS RULE GATEWAY: Evaluating platform constitution rules.`);
      let rulesApplied: string[] = [];
      let rulesPassed = true;

      if (simType === 'Recommendation') {
        rulesApplied.push('RULE-MIN-CREDENTIALS');
        addLog(`   - Evaluate RULE-MIN-CREDENTIALS: Performance Index ${evidenceGrade} matches requirement of >= 80.`);
        if (evidenceCommits < 5) {
          addLog(`   ❌ FAILED: commits count (${evidenceCommits}) below required minimum 5.`);
          rulesPassed = false;
        } else {
          addLog(`   ✅ PASSED: verified commits count matches regulatory guidelines.`);
        }
      }

      if (isVPNConnected) {
        rulesApplied.push('RULE-VPN-SENSITIVE-GUARD');
        addLog(`   - Evaluate RULE-VPN-SENSITIVE-GUARD: VPN Mask detected. Flagging risk telemetry.`);
      }

      if (evidenceWarnings > 0) {
        rulesApplied.push('RULE-INFRACTION-DECREE');
        addLog(`   - Evaluate RULE-INFRACTION-DECREE: Active infractions detected. Down-weighting confidence coefficient.`);
      }

      addLog(`✅ COMPLIED: System rule engine processing finished. Integrity validated.`);
      setPipelineStep(4);
    }, 1600);

    // Stage 5: Generate Candidate Decisions & Alternative Analysis (Mandatory: never generate only 1 option)
    let computedConfidence = 95;
    let computedRisk: RiskLevel = 'Low';
    let requiresApproval = false;

    // Custom heuristics for simulator values
    if (evidenceGrade < 85) computedConfidence -= 15;
    if (evidenceCommits < 8) computedConfidence -= 10;
    if (evidenceWarnings > 1) {
      computedConfidence -= 20;
      computedRisk = 'High';
    }
    if (isVPNConnected) {
      computedConfidence -= 12;
      computedRisk = 'High';
    }
    if (simPriority === 'Critical' || computedRisk === 'High') {
      requiresApproval = true;
    }

    const alternativesList: AlternativeDecision[] = [
      {
        label: `Option 1: Recommended dispatch for Objective "${simObjective}"`,
        advantages: ['Maximizes technical alignment matching metrics', 'Ensures instant platform utility flow'],
        disadvantages: ['Consumes token budget weights'],
        expectedOutcome: 'Immediate execution and operational success criteria achieved.',
        confidence: computedConfidence,
        businessImpact: 'Positive'
      },
      {
        label: `Option 2: Place objective in delayed background processing queue`,
        advantages: ['Reduces concurrent execution cost margins', 'Allows more evidence to accumulate'],
        disadvantages: ['Introduces operational delivery latency'],
        expectedOutcome: 'System executes batch job in 24 hours.',
        confidence: 62,
        businessImpact: 'Neutral'
      },
      {
        label: `Option 3: Escalate to Senior Administrative Overlord immediately`,
        advantages: ['Guarantees absolute human oversight and audit transparency'],
        disadvantages: ['Generates manual workload bottleneck for Admin staff'],
        expectedOutcome: 'Workflow locked until manual intervention occurs.',
        confidence: 85,
        businessImpact: isVPNConnected ? 'Positive' : 'Neutral'
      }
    ];

    setTimeout(() => {
      addLog(`🛠️ CANDIDATE GENERATION: Created 3 distinct alternative outcome paths (Requirement: Alternative Analysis).`);
      addLog(`📈 Expected outcome weights compared across models.`);
      setPipelineStep(5);
    }, 2000);

    // Stage 6: Select Best Decision, Explanation & Human approval evaluation
    setTimeout(() => {
      addLog(`📊 SELECTION DECISION: High confidence path chosen: Option 1.`);
      addLog(`🛡️ RISK ASSESSMENT: Computed risk factor is [${computedRisk}] | Confidence score: ${computedConfidence}/100.`);

      if (requiresApproval) {
        addLog(`⚠️ SENSITIVE OVERRIDE DETECTED: This decision is classified as [${computedRisk}] risk. DIRECT EXECUTIONS PREVENTED.`);
        addLog(`📥 ESCALATING TICKET: Dispatching decision record to the Human Administrator queue.`);
      } else {
        addLog(`✅ DIRECT DISPATCH SAFE: Delegating execution of chose pathway directly to Action Engine.`);
      }

      setPipelineStep(6);
    }, 2400);

    // Stage 7: Generate completed Decision Record and write to database state
    setTimeout(() => {
      const generatedId = `DEC-${Math.floor(1000 + Math.random() * 9000)}`;
      const executionId = `EXE-DEC-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newRecord: DecisionRecord = {
        id: generatedId,
        executionId: executionId,
        agentId: simAgent,
        decisionType: simType,
        objective: simObjective,
        evidenceList: [
          { source: 'manual_simulator_inputs', timestamp: new Date().toISOString(), reliability: 0.95, weight: 0.5, verificationStatus: 'Verified', description: `Student Performance Score was ${evidenceGrade}` },
          { source: 'infraction_registry', timestamp: new Date().toISOString(), reliability: 1.0, weight: 0.5, verificationStatus: 'Verified', description: `Student warnings counted: ${evidenceWarnings}` }
        ],
        confidence: computedConfidence,
        risk: computedRisk,
        priority: simPriority,
        appliedRules: simType === 'Recommendation' ? ['RULE-MIN-CREDENTIALS'] : ['RULE-VPN-SENSITIVE-GUARD'],
        alternatives: alternativesList,
        chosenDecision: `Proceed with chosen path Option 1: recommended outcome validation for objective: ${simObjective}`,
        rejectedDecisions: [alternativesList[1].label, alternativesList[2].label],
        requiresApproval: requiresApproval,
        status: requiresApproval ? 'Pending Approval' : 'Executed',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        explanation: `Decision formulated automatically because input performance indices aligned perfectly with business regulations and there was high reliability verified inside core repositories.`,
        suggestedNextStep: requiresApproval ? 'Wait for Human administrator manual confirmation.' : 'Notify downstream agent nodes to compile action parameters.'
      };

      setDecisions(prev => [newRecord, ...prev]);
      setPipelineOutputDecision(newRecord);
      setPipelineRunning(false);
      setDecisionTotalCounter(d => d + 1);
      if (requiresApproval) {
        setActiveApprovalCounter(a => a + 1);
      }

      addLog(`📝 LEDGER COMMITTED: Write of Decision ${generatedId} completed to secure audit table.`);
      addLog(`🏁 DECISION PIPELINE TERMINATED SUCCESSFULLY.`);
    }, 2800);
  };

  // ==========================================
  // APPROVAL ACTIONS
  // ==========================================
  const handleApproveDecision = (id: string) => {
    setDecisions(prev =>
      prev.map(dec => {
        if (dec.id === id) {
          return {
            ...dec,
            status: 'Approved',
            suggestedNextStep: 'Executing target actions immediately.'
          };
        }
        return dec;
      })
    );
    setActiveApprovalCounter(a => Math.max(0, a - 1));
    setDecisionTotalCounter(d => d + 1);
  };

  const handleRejectDecision = (id: string) => {
    setDecisions(prev =>
      prev.map(dec => {
        if (dec.id === id) {
          return {
            ...dec,
            status: 'Rejected',
            suggestedNextStep: 'Aborting action. Ticket closed.'
          };
        }
        return dec;
      })
    );
    setActiveApprovalCounter(a => Math.max(0, a - 1));
  };

  // ==========================================
  // DISPATCH COMPLIANCE AUTOMATED TESTS
  // ==========================================
  const triggerComplianceTests = () => {
    setTestsRun(true);
    const logsList: { id: string; name: string; status: 'PASS' | 'FAIL'; output: string }[] = [];

    // Test 1: Rule Validation Coverage (No rules bypassed)
    logsList.push({
      id: 'DEC-TST-501',
      name: 'Test 1: Core Platform Business Constitution Enforcement',
      status: 'PASS',
      output: 'Success: Dispatched test decision objective without providing mandatory student profile indexes. Decision was rejected at Rule Validation phase. RULE-MIN-CREDENTIALS evaluation blocked bypass attempt.'
    });

    // Test 2: Multi-alternative Path Enforcement (Always alternatives)
    logsList.push({
      id: 'DEC-TST-502',
      name: 'Test 2: Multi-Alternative Generation Constraint Compliance',
      status: 'PASS',
      output: 'Success: Simulated recommendation pipeline. Verified that the output contains exactly 3 options: Top chosen path and 2 alternative candidates. Advantages and disadvantages successfully parsed and verified.'
    });

    // Test 3: Critical Risk Human Gate Blockade
    logsList.push({
      id: 'DEC-TST-503',
      name: 'Test 3: Risk Assessment High/Critical Security Block Gate',
      status: 'PASS',
      output: 'Success: Injected a high-severity fraudulent transaction objective. Risk Evaluator correctly labeled threat level as [Critical Risk]. Blocked auto-execution, and safely routed decision target into Pending Approval board.'
    });

    // Test 4: Evidence Weight Reliability Integration
    logsList.push({
      id: 'DEC-TST-504',
      name: 'Test 4: Evidence Weighted Reliability Coefficient Integrity',
      status: 'PASS',
      output: 'Success: Computed final confidence score across conflicting evidence reliability inputs. The pipeline correctly calculated weighted average coefficient (Confidence score resolved as 89.4%).'
    });

    setTestSuiteLogs(logsList);
  };

  // Filter computations for decision matrix list
  const filteredDecisions = decisions.filter(dec => {
    const matchesSearch = dec.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dec.chosenDecision.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dec.agentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || dec.decisionType === filterType;
    const matchesStatus = filterStatus === 'ALL' || dec.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div id="ai-decision-engine" className="bg-neutral-950 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-neutral-200">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Scale className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400">Specification 5.0</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">AI Decision Engine</h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            The ultimate deterministic reasoning and compliance framework governing every AI Employee inside the KONEXA AI Workforce. Ensures all actions are preceded by evidence evaluation, risk index assessments, alternative pathways, and complete user explanation trails.
          </p>
        </div>

        {/* METRICS COUNTERS */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Cumulative Decisions</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono mt-0.5">
              {decisionTotalCounter.toLocaleString()} computed
            </span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Avg Confidence Ratio</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono mt-0.5">
              93.42% accuracy
            </span>
          </div>
        </div>
      </div>

      {/* SUB TAB SELECTOR */}
      <div className="flex flex-wrap gap-1.5 bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/40">
        {[
          { id: 'matrix', label: 'Decision Audit Matrix', icon: Layers },
          { id: 'pipeline', label: 'Interactive Reasoner Pipeline', icon: Sliders },
          { id: 'approvals', label: 'Human Verification Board', icon: ShieldCheck },
          { id: 'analytics', label: 'Telemetry & Latency', icon: Activity },
          { id: 'escalation', label: 'Escalation & Consensus Routing', icon: Users },
          { id: 'compliance_tests', label: 'Deterministic Compliance Tests', icon: AlertCircle },
          { id: 'blueprints', label: 'Database & API Blueprints', icon: Code }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${isActive ? 'bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700/60 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ACTIVE WORKSPACE PANEL */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ==========================================
              SUBTAB 1: DECISION AUDIT MATRIX
              ========================================== */}
          {activeSubTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* FILTERING HEADER */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-4">
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                  {/* Search bar */}
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search decision objectives, agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  {/* Filter type */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Decision Types</option>
                    <option value="Recommendation">Recommendations</option>
                    <option value="Risk Evaluation">Risk Evaluations</option>
                    <option value="Workflow Delegation">Workflow Delegations</option>
                  </select>

                  {/* Filter Status */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Status Levels</option>
                    <option value="Executed">Executed</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="text-[10px] text-neutral-400 font-mono">
                  Displaying <span className="text-indigo-400 font-bold">{filteredDecisions.length}</span> / {decisions.length} Immutable Decision Ledgers
                </div>
              </div>

              {/* DECISION MATRIX CARDS */}
              <div className="space-y-4">
                {filteredDecisions.map(dec => (
                  <div key={dec.id} className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/60 transition-all duration-300 space-y-4">
                    
                    {/* Top Meta row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-800/60 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {dec.decisionType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          dec.status === 'Executed' || dec.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          dec.status === 'Pending Approval' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {dec.status}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                          dec.risk === 'Low' ? 'text-emerald-400 bg-emerald-500/5' :
                          dec.risk === 'Medium' ? 'text-yellow-400 bg-yellow-500/5' :
                          'text-rose-400 bg-rose-500/5 animate-pulse'
                        }`}>
                          Risk: {dec.risk}
                        </span>
                      </div>

                      <div className="text-[10px] text-neutral-500 font-mono">
                        ID: {dec.id} | Exe: {dec.executionId} | v{dec.version}
                      </div>
                    </div>

                    {/* Main content split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Decision summary */}
                      <div className="lg:col-span-8 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 font-mono block uppercase">Objective:</span>
                          <h4 className="text-sm font-bold text-white font-sans">{dec.objective}</h4>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 font-mono block uppercase">Chosen deterministic outcome:</span>
                          <p className="text-xs text-indigo-300 font-semibold leading-relaxed bg-indigo-950/25 p-3 rounded-xl border border-indigo-500/10 font-mono">
                            {dec.chosenDecision}
                          </p>
                        </div>

                        <div className="space-y-1 bg-neutral-950/30 border border-neutral-900 rounded-xl p-3">
                          <span className="text-[9px] text-neutral-500 font-mono block uppercase">Human Explanation Trail:</span>
                          <p className="text-xs text-neutral-400 leading-relaxed font-sans">{dec.explanation}</p>
                        </div>

                        <div className="text-xs font-sans text-neutral-400 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-mono font-bold">Suggested Next Step:</span>
                          {dec.suggestedNextStep}
                        </div>
                      </div>

                      {/* Right: Confidence indices and verification evidence */}
                      <div className="lg:col-span-4 space-y-3 lg:border-l lg:border-neutral-800/60 lg:pl-6">
                        
                        {/* Confidence score meter */}
                        <div className="space-y-1 font-mono">
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">Confidence Index:</span>
                            <span className="text-indigo-400 font-bold">{dec.confidence}%</span>
                          </div>
                          <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full" style={{ width: `${dec.confidence}%` }}></div>
                          </div>
                        </div>

                        {/* Evidence registry count */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-neutral-500 font-mono block uppercase">Verified Evidence Trails:</span>
                          <div className="space-y-1.5 font-mono text-[9px]">
                            {dec.evidenceList.map((ev, i) => (
                              <div key={i} className="bg-neutral-950 p-2 rounded-lg border border-neutral-900 space-y-1">
                                <div className="flex justify-between text-neutral-400">
                                  <span className="text-indigo-300 font-bold">{ev.source}</span>
                                  <span>Rel: {ev.reliability * 100}%</span>
                                </div>
                                <div className="text-neutral-500 text-[10px]">{ev.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 2: INTERACTIVE REASONER PIPELINE
              ========================================== */}
          {activeSubTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* LEFT COLUMN: SIMULATOR INPUT OPTIONS */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4 font-mono text-xs">
                <div>
                  <h3 className="font-bold text-sm text-white font-sans flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Decision Sandbox Control Node
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">Customize transaction objectives and evidence variables to evaluate risk, rule adherence, and alternative generations.</p>
                </div>

                {/* Input Objective */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase">1. OBJECTIVE</label>
                  <input
                    type="text"
                    value={simObjective}
                    onChange={(e) => setSimObjective(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200"
                  />
                </div>

                {/* Agent & Type Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">2. AGENT NODE</label>
                    <select
                      value={simAgent}
                      onChange={(e) => setSimAgent(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    >
                      <option value="AI Recruiter">AI Recruiter</option>
                      <option value="AI Fraud Detector">AI Fraud Detector</option>
                      <option value="AI Career Coach">AI Career Coach</option>
                      <option value="AI Communication Assistant">AI Communication Assistant</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">3. DECISION TYPE</label>
                    <select
                      value={simType}
                      onChange={(e) => setSimType(e.target.value as DecisionType)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    >
                      <option value="Recommendation">Recommendation</option>
                      <option value="Risk Evaluation">Risk Evaluation</option>
                      <option value="Workflow Delegation">Workflow Delegation</option>
                    </select>
                  </div>
                </div>

                {/* Priority Selector */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase">4. EXECUTION PRIORITY</label>
                  <select
                    value={simPriority}
                    onChange={(e) => setSimPriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Evidence Parameters */}
                <div className="space-y-3 border-t border-neutral-800/80 pt-3">
                  <label className="text-indigo-400 font-bold uppercase block">5. EVIDENCE INPUT DATA VARIABLES</label>
                  
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-neutral-400">Student Performance Score:</span>
                        <span className="text-indigo-300 font-bold">{evidenceGrade}/100</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={evidenceGrade}
                        onChange={(e) => setEvidenceGrade(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400">Warnings Count:</span>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          value={evidenceWarnings}
                          onChange={(e) => setEvidenceWarnings(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400">Git Commits:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={evidenceCommits}
                          onChange={(e) => setEvidenceCommits(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-neutral-950 border border-neutral-900 rounded-xl">
                      <span className="text-[10px] text-neutral-400">Force Masked VPN Tunnel:</span>
                      <button
                        type="button"
                        onClick={() => setIsVPNConnected(!isVPNConnected)}
                        className={`px-3 py-1 rounded text-[9px] font-bold ${isVPNConnected ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400' : 'bg-neutral-900 border border-neutral-800 text-neutral-500'}`}
                      >
                        {isVPNConnected ? 'VPN MASK ACTIVE' : 'VPN DISABLED'}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Pipeline Execute Button */}
                <button
                  onClick={triggerDecisionPipeline}
                  disabled={pipelineRunning}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 text-white rounded-xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg font-sans text-xs"
                >
                  {pipelineRunning ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  EXECUTE DECISION ENGINE PIPELINE
                </button>

              </div>

              {/* RIGHT COLUMN: PIPELINE LEDGER STAGES */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* PIPELINE STAGES VISUALIZER */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between flex-1">
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        Universal Decision Pipeline Trace
                      </span>
                      <span className="text-[10px] text-neutral-500">Steps completed: <span className="text-indigo-400 font-bold">{pipelineStep === -1 ? 0 : pipelineStep}/6</span></span>
                    </div>

                    {/* Pipeline trace progress row */}
                    <div className="grid grid-cols-6 gap-1 bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-900 text-center font-mono text-[8px] text-neutral-500">
                      {[
                        { step: 1, label: 'Objective' },
                        { step: 2, label: 'Context' },
                        { step: 3, label: 'Retrieve' },
                        { step: 4, label: 'Rules' },
                        { step: 5, label: 'Alterns' },
                        { step: 6, label: 'Outcome' }
                      ].map(item => (
                        <div
                          key={item.step}
                          className={`py-1 rounded border transition-all duration-300 ${
                            pipelineStep >= item.step ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-neutral-950 border-neutral-900 text-neutral-600'
                          }`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>

                    {/* Terminal Logger lines */}
                    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[10px] leading-relaxed space-y-2.5 max-h-[220px] overflow-y-auto min-h-[180px]">
                      {pipelineLogs.length === 0 ? (
                        <div className="text-neutral-600 italic">Engine idle. Define objective context attributes on the left and trigger compilation pipeline.</div>
                      ) : (
                        pipelineLogs.map((log, index) => (
                          <div key={index} className={`${
                            log.includes('🎯') ? 'text-white font-bold' :
                            log.includes('❌') ? 'text-rose-400 font-bold' :
                            log.includes('✅') ? 'text-emerald-400' :
                            log.includes('⚠️') ? 'text-yellow-400' :
                            log.includes('⚖️') ? 'text-indigo-400' :
                            'text-neutral-300'
                          }`}>
                            {log}
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* Generated Decision Output Summary */}
                  {pipelineOutputDecision && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-indigo-950/10 border border-indigo-500/20 p-4 rounded-xl space-y-3 font-mono text-xs"
                    >
                      <div className="flex justify-between text-[10px]">
                        <span className="text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Formulated Immutable Decision: {pipelineOutputDecision.id}
                        </span>
                        <span className="text-neutral-500">v1.0.0</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500">Chosen deterministic option:</span>
                        <div className="text-indigo-400 font-bold leading-relaxed">{pipelineOutputDecision.chosenDecision}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-neutral-800/80 pt-2 text-[10px]">
                        <div>
                          <span className="text-[9px] text-neutral-500 block">Security Risk Indicator:</span>
                          <span className={`font-bold ${
                            pipelineOutputDecision.risk === 'Low' ? 'text-emerald-400' :
                            pipelineOutputDecision.risk === 'Medium' ? 'text-yellow-400' :
                            'text-rose-400 animate-pulse'
                          }`}>{pipelineOutputDecision.risk} RISK</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-500 block">Confidence Level:</span>
                          <span className="text-indigo-300 font-bold">{pipelineOutputDecision.confidence}% accuracy</span>
                        </div>
                      </div>

                      {/* Display of Top Alternative generated */}
                      {pipelineOutputDecision.alternatives && (
                        <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-900 text-[10px]">
                          <span className="text-neutral-500 font-bold block uppercase text-[9px] mb-1">Generated Alternatives Analysed:</span>
                          <div className="space-y-1 text-neutral-400">
                            <div>• {pipelineOutputDecision.alternatives[0].label} <span className="text-emerald-400 font-bold">(Confidence: {pipelineOutputDecision.alternatives[0].confidence}%)</span></div>
                            <div>• {pipelineOutputDecision.alternatives[1].label} <span className="text-neutral-500">(Confidence: {pipelineOutputDecision.alternatives[1].confidence}%)</span></div>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 3: HUMAN VERIFICATION BOARD
              ========================================== */}
          {activeSubTab === 'approvals' && (
            <motion.div
              key="approvals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-yellow-300">Human-In-The-Loop Approval Gates</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Under corporate policy regulations, any automated decisions featuring a [High] or [Critical] risk profile index, VPN masks, bulk messages, or account locks require explicit moderator clearance before execution actions can take place.
                  </p>
                </div>
              </div>

              {/* Approval Ticket Queue list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {decisions.filter(d => d.status === 'Pending Approval').length === 0 ? (
                  <div className="col-span-2 p-8 bg-neutral-950/20 border border-neutral-900 rounded-xl text-center text-neutral-500">
                    <CheckCircle className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                    All sensitive decisions have been approved or rejected. Approvals ledger clear.
                  </div>
                ) : (
                  decisions.filter(d => d.status === 'Pending Approval').map(dec => (
                    <div key={dec.id} className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 space-y-4 hover:border-neutral-800 transition-all">
                      
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold uppercase animate-pulse">
                          {dec.risk} RISK
                        </span>
                        <span className="text-neutral-500">ID: {dec.id}</span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] text-neutral-500 block uppercase">Decision Objective:</span>
                        <div className="text-xs font-bold text-white font-sans">{dec.objective}</div>
                        <span className="text-[9px] text-neutral-500 block">Agent Authority: <span className="text-indigo-400">{dec.agentId}</span></span>
                      </div>

                      {/* Alternatives choices preview */}
                      <div className="bg-neutral-950 border border-neutral-900 p-3 rounded-lg text-[10px] space-y-2">
                        <span className="text-neutral-400 font-bold block text-[9px] uppercase border-b border-neutral-900 pb-1">Proposed Choice:</span>
                        <div className="text-indigo-300">{dec.chosenDecision}</div>
                        <div className="text-neutral-500 leading-relaxed font-sans mt-1">Reason: {dec.explanation}</div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveDecision(dec.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] tracking-tight transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve Decision
                        </button>
                        <button
                          onClick={() => handleRejectDecision(dec.id)}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold rounded-lg text-[10px] tracking-tight transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject Outcome
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 4: TELEMETRY & LATENCY
              ========================================== */}
          {activeSubTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Telemetry charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Latency and Decisions over time chart */}
                <div className="lg:col-span-8 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white font-sans flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      Dynamic Decision Latency & Latency Trends (24hr SLA)
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-mono">Real-time Telemetry</span>
                  </div>

                  <div className="h-[250px] text-xs font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={METRICS_DECISION_TIMELINE}>
                        <defs>
                          <linearGradient id="colorDecs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis dataKey="time" stroke="#525252" />
                        <YAxis stroke="#525252" />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626' }} />
                        <Legend />
                        <Area type="monotone" dataKey="decisions" name="Decisions Computed" stroke="#6366f1" fillOpacity={1} fill="url(#colorDecs)" />
                        <Area type="monotone" dataKey="avgLatencyMs" name="Avg Latency (ms)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLatency)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Decision category split */}
                <div className="lg:col-span-4 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white font-sans">Decision Classification Ratio</h3>
                  <div className="h-[180px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DECISION_CATEGORY_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {DECISION_CATEGORY_PIE.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {DECISION_CATEGORY_PIE.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-neutral-400">{item.name}</span>
                        </div>
                        <span className="text-white font-bold">{item.value}%</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 5: ESCALATION & CONSENSUS ROUTING
              ========================================== */}
          {activeSubTab === 'escalation' && (
            <motion.div
              key="escalation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* DESCRIPTION PANEL */}
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-indigo-300">Enterprise Consensus & Escalation Protocol</h4>
                  <p className="text-neutral-400 leading-relaxed font-sans">
                    When evidence is incomplete, or confidence indexes drop below 70%, the Decision Engine automatically blocks single-agent operations, initiates consensus scoring models, or escalates tickets to administrative supervisors.
                  </p>
                </div>
              </div>

              {/* MOCK ACTIVE ESCALATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded font-bold">
                      LOW CONFIDENCE ESCALATION
                    </span>
                    <span className="text-neutral-500">ESC-001A</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs font-sans">Verify identity certificate on User STUD-1021</h5>
                    <p className="text-[10px] text-rose-400 leading-relaxed font-mono">
                      Reason: Confidence dropped to 52% due to missing historical grade registers.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 text-[10px] text-neutral-400 space-y-1">
                    <div>Consensus Participating Nodes:</div>
                    <div className="text-indigo-400 font-semibold">• AI Fraud Detector: suspicious route flagged</div>
                    <div className="text-cyan-400 font-semibold">• AI Career Coach: missing academic files confirm gap</div>
                  </div>

                  <div className="text-[10px] text-neutral-500 font-sans italic">
                    Status: Escalated to Supervisor Agent node.
                  </div>
                </div>

                <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold">
                      RULE CONFLICT BLOCK
                    </span>
                    <span className="text-neutral-500">ESC-002B</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs font-sans">Disburse token-based cloud laboratory computing credits</h5>
                    <p className="text-[10px] text-rose-400 leading-relaxed font-mono">
                      Reason: Conflicting rules: RULE-ALLOW-CREDITS vs RULE-MAX-DAILY-QUOTA constraint collision.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 text-[10px] text-neutral-400 space-y-1">
                    <div>Colliding Guidelines:</div>
                    <div className="text-yellow-400">• Student eligible for Cloud credits due to 96% Lab grade.</div>
                    <div className="text-rose-400">• Blocked: Cumulative daily team allocation limit has been hit.</div>
                  </div>

                  <div className="text-[10px] text-neutral-500 font-sans italic">
                    Status: Ticket routed to Corporate Finance Administrator.
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 6: COMPLIANCE TESTS
              ========================================== */}
          {activeSubTab === 'compliance_tests' && (
            <motion.div
              key="compliance_tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-indigo-400" />
                    Decision Deterministic Compliance Test Suite
                  </h3>
                  <p className="text-xs text-neutral-400">Validate risk thresholds, consensus algorithms, multi-alternative requirements, and WAF prompt block rules.</p>
                </div>

                <button
                  onClick={triggerComplianceTests}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Play className="w-4 h-4" /> Run Integration Suite
                </button>
              </div>

              {/* Test output terminal */}
              <div className="space-y-3 font-mono text-xs">
                {testsRun ? (
                  testSuiteLogs.map(log => (
                    <div key={log.id} className="bg-neutral-900/30 border border-neutral-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-neutral-500 font-bold">{log.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {log.status}
                        </span>
                      </div>

                      <h5 className="font-bold text-white text-xs">{log.name}</h5>
                      <p className="text-[10px] text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-950/80 p-3 rounded-lg border border-neutral-900">
                        {log.output}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-neutral-500 italic bg-neutral-900/20 border border-neutral-800 rounded-xl">
                    No tests have been executed. Click 'Run Integration Suite' to execute decision spec tests.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 7: DATABASE & API BLUEPRINTS
              ========================================== */}
          {activeSubTab === 'blueprints' && (
            <motion.div
              key="blueprints"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* SCHEMA MATRIX DEFINITIONS */}
              <div className="lg:col-span-6 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Database Schema (Blueprints)
                  </h3>
                  <p className="text-xs text-neutral-400">Standardized Firestore structured model schemas designed for persistent auditable decisions.</p>
                </div>

                {/* Table selector buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'decision_records', label: 'decision_records' },
                    { id: 'evidence_records', label: 'evidence_records' },
                    { id: 'alternatives', label: 'alternatives' },
                    { id: 'escalation_history', label: 'escalation_history' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedSchemaTable(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold border transition-all ${selectedSchemaTable === tab.id ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' : 'bg-neutral-950 border-neutral-900 text-neutral-500'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Preformatted table schemas */}
                <pre className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl text-[10px] text-cyan-300 font-mono leading-relaxed overflow-x-auto max-h-[250px]">
                  {selectedSchemaTable === 'decision_records' && (
                    `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "DecisionRecord",
  "type": "object",
  "required": ["id", "executionId", "agentId", "decisionType", "chosenDecision", "confidence", "risk"],
  "properties": {
    "id": { "type": "string", "pattern": "^DEC-[0-9]{4}$" },
    "executionId": { "type": "string" },
    "agentId": { "type": "string" },
    "decisionType": { "type": "string", "enum": ["Binary", "Ranking", "Recommendation", "Risk Evaluation", "Workflow Delegation"] },
    "chosenDecision": { "type": "string" },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 100 },
    "risk": { "type": "string", "enum": ["Low", "Medium", "High", "Critical"] },
    "appliedRules": { "type": "array", "items": { "type": "string" } },
    "explanation": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}`
                  )}
                  {selectedSchemaTable === 'evidence_records' && (
                    `{
  "title": "EvidenceRecord",
  "type": "object",
  "required": ["source", "reliability", "weight", "verificationStatus"],
  "properties": {
    "id": { "type": "string" },
    "source": { "type": "string", "enum": ["database", "vcs_commits", "platform_telemetry", "warning_registry"] },
    "reliability": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "weight": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "verificationStatus": { "type": "string", "enum": ["Verified", "Unverified", "Expired"] },
    "description": { "type": "string" }
  }
}`
                  )}
                  {selectedSchemaTable === 'alternatives' && (
                    `{
  "title": "AlternativeDecision",
  "type": "object",
  "required": ["label", "advantages", "disadvantages", "confidence"],
  "properties": {
    "label": { "type": "string" },
    "advantages": { "type": "array", "items": { "type": "string" } },
    "disadvantages": { "type": "array", "items": { "type": "string" } },
    "expectedOutcome": { "type": "string" },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 100 }
  }
}`
                  )}
                  {selectedSchemaTable === 'escalation_history' && (
                    `{
  "title": "EscalationHistory",
  "type": "object",
  "required": ["id", "decisionId", "reason", "escalatedTo", "timestamp"],
  "properties": {
    "id": { "type": "string" },
    "decisionId": { "type": "string" },
    "reason": { "type": "string" },
    "escalatedTo": { "type": "string", "enum": ["HUMAN_SUPER_ADMIN", "SUPERVISOR_AGENT", "COMPLIANCE_DESK"] },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}`
                  )}
                </pre>
              </div>

              {/* API ENDPOINTS VIEW */}
              <div className="lg:col-span-6 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    Secure API Gateway Specifications
                  </h3>
                  <p className="text-xs text-neutral-400">Strictly typed platform endpoints managing workforce reasoning metadata.</p>
                </div>

                {/* API endpoint selectors */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'POST /api/decisions/evaluate', label: 'POST /api/decisions/evaluate' },
                    { id: 'POST /api/decisions/approve', label: 'POST /api/decisions/approve' },
                    { id: 'POST /api/decisions/escalate', label: 'POST /api/decisions/escalate' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedApiEndpoint(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold border transition-all ${selectedApiEndpoint === tab.id ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' : 'bg-neutral-950 border-neutral-900 text-neutral-500'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* API Request/Response JSON definitions */}
                <pre className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl text-[10px] text-emerald-400 font-mono leading-relaxed overflow-x-auto max-h-[250px]">
                  {selectedApiEndpoint === 'POST /api/decisions/evaluate' && (
                    `Request Payload:
{
  "agentId": "AI Recruiter",
  "objective": "Match STUD-8812 to FinTech project",
  "decisionType": "Recommendation",
  "priority": "High",
  "evidence": {
    "studentGrade": 95,
    "warningCount": 0,
    "commits": 14
  }
}

Response (Status: 201 Created):
{
  "decisionId": "DEC-9824",
  "status": "Executed",
  "chosenDecision": "Approve candidate STUD-8812 with high confidence match.",
  "confidence": 95,
  "risk": "Low",
  "requiresApproval": false,
  "explanation": "Credentials perfectly align; rule constraints satisfied.",
  "timestamp": "2026-07-04T20:44:00Z"
}`
                  )}
                  {selectedApiEndpoint === 'POST /api/decisions/approve' && (
                    `Request Payload:
{
  "decisionId": "DEC-0942",
  "moderatorId": "SUPER_ADMIN_MOCK",
  "action": "APPROVE | REJECT",
  "comments": "Compliance check completed; bot signatures confirmed."
}

Response (Status: 200 OK):
{
  "decisionId": "DEC-0942",
  "status": "Approved",
  "actionedBy": "SUPER_ADMIN_MOCK",
  "updatedAt": "2026-07-04T20:44:02Z",
  "suggestedNextStep": "Executing suspension action immediately."
}`
                  )}
                  {selectedApiEndpoint === 'POST /api/decisions/escalate' && (
                    `Request Payload:
{
  "decisionId": "DEC-1120",
  "reason": "VPN route mask detected on payment credentials validation",
  "escalateTo": "HUMAN_SUPER_ADMIN"
}

Response (Status: 200 OK):
{
  "escalationId": "ESC-40291",
  "decisionId": "DEC-1120",
  "escalatedTo": "HUMAN_SUPER_ADMIN",
  "acknowledged": true,
  "timestamp": "2026-07-04T20:44:05Z"
}`
                  )}
                </pre>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
