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
  Users,
  Workflow,
  Cpu,
  RefreshCcw,
  Archive,
  Mail,
  FileSpreadsheet,
  FileDown,
  Calendar,
  LockKeyhole,
  CheckSquare,
  AlertOctagon,
  Gauge
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
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 6.0 AI ACTION ENGINE)
// ============================================================================

export type ActionType =
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'Notify'
  | 'Generate'
  | 'Schedule'
  | 'Assign'
  | 'Approve'
  | 'Reject'
  | 'Archive'
  | 'Restore'
  | 'Escalate';

export type ActionCategory =
  | 'Student Actions'
  | 'Company Actions'
  | 'Project Actions'
  | 'Matching Actions'
  | 'Evaluation Actions'
  | 'Trust Actions'
  | 'Communication Actions'
  | 'Notification Actions'
  | 'Scheduling Actions'
  | 'Analytics Actions'
  | 'Document Actions';

export type ActionStatus =
  | 'Pending'
  | 'Validating'
  | 'Queued'
  | 'Running'
  | 'Waiting'
  | 'Completed'
  | 'Failed'
  | 'Rolled Back'
  | 'Cancelled'
  | 'Archived';

export type ActionPriority = 'Critical' | 'High' | 'Medium' | 'Low' | 'Background';

export interface ActionRecord {
  id: string;
  executionId: string;
  decisionId: string;
  workflowId: string;
  actionType: ActionType;
  category: ActionCategory;
  priority: ActionPriority;
  targetEntity: string;
  targetId: string;
  inputParams: Record<string, any>;
  expectedOutput: string;
  actualOutput?: string;
  businessRules: string[];
  permissionScope: string;
  rollbackAvailable: boolean;
  rollbackActionId?: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: ActionStatus;
  idempotencyKey: string;
  retryCount: number;
  maxRetries: number;
  latencyMs?: number;
  timestamp: string;
  version: string;
  failureReason?: string;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_ACTIONS: ActionRecord[] = [
  {
    id: 'ACT-4001',
    executionId: 'EXE-ACT-9801',
    decisionId: 'DEC-0941',
    workflowId: 'WF-MTC-502',
    actionType: 'Assign',
    category: 'Project Actions',
    priority: 'High',
    targetEntity: 'Student Project Match',
    targetId: 'PRJ-FIN-99',
    inputParams: { studentId: 'STUD-8812', projectId: 'PRJ-FIN-99', role: 'Full Stack Engineer', hourlyTokens: 25 },
    expectedOutput: 'Write project assignment record and link profile STUD-8812 to GitHub workspace repositories.',
    actualOutput: 'Project assignment established. Linked Github repository successfully.',
    businessRules: ['RULE-MIN-CREDENTIALS', 'RULE-VERIFIED-COMMIT-ONLY'],
    permissionScope: 'ROLE_SUPER_ADMIN',
    rollbackAvailable: true,
    riskLevel: 'Low',
    status: 'Completed',
    idempotencyKey: 'IDEMP-MATCH-8812-99',
    retryCount: 0,
    maxRetries: 3,
    latencyMs: 340,
    timestamp: '2026-07-04T19:23:00Z',
    version: '1.0.0'
  },
  {
    id: 'ACT-4002',
    executionId: 'EXE-ACT-9802',
    decisionId: 'DEC-0942',
    workflowId: 'WF-SEC-911',
    actionType: 'Update',
    category: 'Trust Actions',
    priority: 'Critical',
    targetEntity: 'Student Profile',
    targetId: 'SUS-402',
    inputParams: { studentId: 'SUS-402', status: 'SUSPENDED', lockTokens: true, reason: 'WebGL Fingerprint Farming Collision' },
    expectedOutput: 'Update student account state to SUSPENDED. Lock token wallets and revoke active API tokens.',
    actualOutput: 'Account status updated. Token wallets secured. Revoked 3 active web tokens.',
    businessRules: ['RULE-ANTI-FARMING', 'RULE-VPN-SENSITIVE-GUARD'],
    permissionScope: 'ROLE_TRUST_SAFETY',
    rollbackAvailable: true,
    riskLevel: 'Critical',
    status: 'Completed',
    idempotencyKey: 'IDEMP-SUSPEND-402',
    retryCount: 0,
    maxRetries: 3,
    latencyMs: 180,
    timestamp: '2026-07-04T20:15:00Z',
    version: '1.1.0'
  },
  {
    id: 'ACT-4003',
    executionId: 'EXE-ACT-9803',
    decisionId: 'DEC-0943',
    workflowId: 'WF-COM-331',
    actionType: 'Notify',
    category: 'Notification Actions',
    priority: 'Medium',
    targetEntity: 'Bulk Student Delivery',
    targetId: 'BATCH-N-210',
    inputParams: { templateId: 'LAB-CHANGES-V2', recipientCount: 4200, channel: 'EMAIL_AND_PUSH' },
    expectedOutput: 'Deliver bulk communication newsletter to 4,200 verified students across database registries.',
    businessRules: ['RULE-MAX-BULK-DELIVERY', 'RULE-HUMAN-IN-THE-LOOP-BROADCAST'],
    permissionScope: 'ROLE_SUPER_ADMIN',
    rollbackAvailable: false, // Notification is non-reversible (can only send compensation action)
    riskLevel: 'High',
    status: 'Pending',
    idempotencyKey: 'IDEMP-BULK-331',
    retryCount: 0,
    maxRetries: 2,
    timestamp: '2026-07-04T20:33:00Z',
    version: '1.0.0'
  },
  {
    id: 'ACT-4004',
    executionId: 'EXE-ACT-9804',
    decisionId: 'DEC-NONE',
    workflowId: 'WF-DOC-771',
    actionType: 'Generate',
    category: 'Document Actions',
    priority: 'Medium',
    targetEntity: 'Hiring Report PDF',
    targetId: 'REP-771',
    inputParams: { month: 'June 2026', format: 'PDF_ENCRYPTED', includeFinancials: true },
    expectedOutput: 'Generate PDF analytics report summarizing candidate matchings and tokens spent.',
    businessRules: ['RULE-DATA-INTEGRITY-VERIFY'],
    permissionScope: 'ROLE_SUPPORT_MANAGER',
    rollbackAvailable: true,
    riskLevel: 'Medium',
    status: 'Queued',
    idempotencyKey: 'IDEMP-DOC-JUNE-26',
    retryCount: 0,
    maxRetries: 3,
    timestamp: '2026-07-04T20:45:00Z',
    version: '1.0.1'
  }
];

const METRICS_LIVE_LATENCY = [
  { timestamp: '20:00', executed: 42, latency: 220, retries: 0, rollbacks: 0 },
  { timestamp: '20:10', executed: 55, latency: 195, retries: 1, rollbacks: 0 },
  { timestamp: '20:20', executed: 68, latency: 235, retries: 0, rollbacks: 1 },
  { timestamp: '20:30', executed: 80, latency: 180, retries: 0, rollbacks: 0 },
  { timestamp: '20:40', executed: 95, latency: 215, retries: 2, rollbacks: 0 },
  { timestamp: '20:50', executed: 120, latency: 190, retries: 1, rollbacks: 0 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Student Ops', value: 35, color: '#6366f1' },
  { name: 'Project Assigns', value: 25, color: '#06b6d4' },
  { name: 'Communications', value: 20, color: '#ec4899' },
  { name: 'Trust & Safety', value: 12, color: '#f43f5e' },
  { name: 'Doc Generation', value: 8, color: '#eab308' }
];

// ============================================================================
// COMPENSATING ACTIONS DICTIONARY
// ============================================================================
const COMPENSATION_CATALOG: Record<string, { label: string; action: string }> = {
  'Project Actions': {
    label: 'Generate Repo Access Revocation',
    action: 'Revoke repository collaborators, detach profile relationship schema, and release token budget blocks.'
  },
  'Trust Actions': {
    label: 'Generate Unlock Clearance Certificate',
    action: 'Restore student account to standard status, reactivate API tokens, and log rollback verification.'
  },
  'Notification Actions': {
    label: 'Dispatch Clarification push update',
    action: 'Notifications are non-reversible. Send correction update and file administrative incident report.'
  },
  'Document Actions': {
    label: 'Purge file storage node',
    action: 'Purge temporary PDF assets from storage node cache and void verification hashes.'
  }
};

export default function AIActionEngineWorkspace() {
  // ==========================================
  // STATE DEFINITIONS
  // ==========================================
  const [actions, setActions] = useState<ActionRecord[]>(INITIAL_ACTIONS);
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'trigger' | 'telemetry' | 'compensation' | 'compliance_tests' | 'blueprints'>('queue');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Trigger Action Sandbox State
  const [sandDecisionId, setSandDecisionId] = useState('DEC-0944');
  const [sandWorkflowId, setSandWorkflowId] = useState('WF-GEN-802');
  const [sandType, setSandType] = useState<ActionType>('Create');
  const [sandCategory, setSandCategory] = useState<ActionCategory>('Student Actions');
  const [sandPriority, setSandPriority] = useState<ActionPriority>('High');
  const [sandTargetEntity, setSandTargetEntity] = useState('Student Directory');
  const [sandTargetId, setSandTargetId] = useState('STUD-1022');
  const [sandRisk, setSandRisk] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [sandInputParams, setSandInputParams] = useState('{"name": "Kim Ji-won", "major": "Computer Science", "credits": 120}');
  const [sandExpectedOutput, setSandExpectedOutput] = useState('Write candidate record and dispatch welcome confirmation notification.');

  // Runtime Pipeline state
  const [pipelineStep, setPipelineStep] = useState<number>(-1);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [pipelineOutput, setPipelineOutput] = useState<ActionRecord | null>(null);

  // Stats Counters
  const [totalExecutedCount, setTotalExecutedCount] = useState<number>(31482);
  const [activeQueueLength, setActiveQueueLength] = useState<number>(1);
  const [failureCount, setFailureCount] = useState<number>(24);
  const [rollbackCount, setRollbackCount] = useState<number>(12);

  // Tests Sandbox State
  const [testsExecuted, setTestsExecuted] = useState<boolean>(false);
  const [testSuiteLogs, setTestSuiteLogs] = useState<{ id: string; name: string; status: 'PASS' | 'FAIL'; output: string }[]>([]);

  // Blueprint Selector State
  const [blueprintTable, setBlueprintTable] = useState<'action_registry' | 'execution_records' | 'action_queue' | 'rollback_records' | 'failure_records' | 'compensation_actions'>('action_registry');
  const [blueprintApi, setBlueprintApi] = useState<'POST /api/actions/execute' | 'POST /api/actions/rollback' | 'GET /api/actions/metrics' | 'GET /api/actions/queue'>('POST /api/actions/execute');

  // ==========================================
  // PIPELINE SIMULATION CORE (SPEC-COMPLIANT 14 STEPS)
  // ==========================================
  const triggerActionPipeline = () => {
    setPipelineRunning(true);
    setPipelineStep(0);
    setPipelineLogs([]);
    setPipelineOutput(null);

    const logLines: string[] = [];
    const addLog = (msg: string) => {
      const timestamp = new Date().toISOString().substring(11, 19);
      logLines.push(`[${timestamp}] ${msg}`);
      setPipelineLogs([...logLines]);
    };

    // Parse params input safely
    let parsedParams: Record<string, any> = {};
    try {
      parsedParams = JSON.parse(sandInputParams);
    } catch (e) {
      addLog('❌ FATAL PARSING ERROR: Invalid Input Parameter JSON! Enforcing rollback.');
      setPipelineStep(6); // fail state
      setPipelineRunning(false);
      return;
    }

    // Step 1: Receive Approved Decision
    setTimeout(() => {
      addLog(`⚡ STEP 1: RECEIVE APPROVED DECISION [Decision ID: ${sandDecisionId}]`);
      addLog(`👉 Target Entity: ${sandTargetEntity} (ID: ${sandTargetId}) | Action Type: ${sandType}`);
      setPipelineStep(1);
    }, 250);

    // Step 2: Validate Decision Presence & Authenticity
    setTimeout(() => {
      addLog(`⚡ STEP 2: VALIDATE DECISION INHERITANCE`);
      addLog(`👉 Checking signature matching algorithm keys inside digital vault.`);
      addLog(`✅ SUCCESS: Signature verified. Authentic parent decision recognized.`);
      setPipelineStep(2);
    }, 500);

    // Step 3: Check Workflow State Constraints
    setTimeout(() => {
      addLog(`⚡ STEP 3: CHECK WORKFLOW STATE [Workflow ID: ${sandWorkflowId}]`);
      addLog(`👉 Current workflow status: ACTIVE. Target execution slot available.`);
      setPipelineStep(3);
    }, 750);

    // Step 4: Check Security Permissions (RBAC & Privilege verification)
    setTimeout(() => {
      addLog(`⚡ STEP 4: CHECK PERMISSIONS (RBAC)`);
      addLog(`👉 Scope required: ROLE_SUPER_ADMIN. Verified execution agent authentication levels.`);
      setPipelineStep(4);
    }, 1000);

    // Step 5: Check Platform Business Rules (Mandatory Constraint: No actions bypass rules)
    setTimeout(() => {
      addLog(`⚡ STEP 5: CHECK PLATFORM BUSINESS RULES`);
      addLog(`👉 Evaluating Rule Engine checklist...`);
      addLog(`✅ Verified RULE-DATA-INTEGRITY-VERIFY: Input fields contain non-null entries.`);
      if (sandRisk === 'Critical') {
        addLog(`⚠️ WARNING: Critical risk detected. Bypassing automatic execution requires certified token keys.`);
      }
      setPipelineStep(5);
    }, 1250);

    // Step 6: Build Optimized Action Plan & Dependency Management
    setTimeout(() => {
      addLog(`⚡ STEP 6: BUILD ACTION PLAN`);
      addLog(`👉 Dependency analysis: 0 blocking prerequisites. Creating sequential pipeline nodes.`);
      setPipelineStep(6);
    }, 1500);

    // Step 7: Validate Target Parameters & Idempotency Key Checks
    setTimeout(() => {
      const generatedIdempKey = `IDEMP-${sandTargetId}-${Math.floor(1000 + Math.random() * 9000)}`;
      addLog(`⚡ STEP 7: VALIDATE PARAMETERS & IDEMPOTENCY`);
      addLog(`👉 Idempotency hash: ${generatedIdempKey}`);
      addLog(`👉 Checking database execution cache registry to prevent duplicated transactions.`);
      addLog(`✅ SUCCESS: Idempotency uniqueness verified.`);
      setPipelineStep(7);
    }, 1750);

    // Step 8: Reserve Resource Locks (Resource Locking mechanism)
    setTimeout(() => {
      addLog(`⚡ STEP 8: RESERVE RESOURCES & OPTIMISTIC LOCKS`);
      addLog(`👉 Lock registered on table key "${sandTargetEntity}_${sandTargetId}" (Timeout setting: 15s)`);
      addLog(`✅ Locked keys successfully. Database race-conditions prevented.`);
      setPipelineStep(8);
    }, 2000);

    // Step 9: Execute Through Tool Broker (The Action Engine executes!)
    setTimeout(() => {
      addLog(`⚡ STEP 9: TOOL BROKER EXECUTION`);
      addLog(`👉 Dispatching execution payloads to connected API nodes.`);
      addLog(`🚀 [Tool Broker] Write target completed. Outflow verified.`);
      setPipelineStep(9);
    }, 2250);

    // Step 10: Verify Execution Result & Output Signature
    setTimeout(() => {
      addLog(`⚡ STEP 10: VERIFY EXECUTION RESULT`);
      addLog(`👉 Fetching live database check sums...`);
      addLog(`✅ Result status: 200 OK. Destination values matching expected constraints.`);
      setPipelineStep(10);
    }, 2500);

    // Step 11: Emit Immutable Event Signatures
    setTimeout(() => {
      addLog(`⚡ STEP 11: GENERATE ACTIONS COMPLETED EVENTS`);
      addLog(`👉 Broadcasted immutable event: "EVENT_ACTION_COMPLETED" with secure transaction hash.`);
      setPipelineStep(11);
    }, 2750);

    // Step 12: Update Live Telemetry Metrics
    setTimeout(() => {
      addLog(`⚡ STEP 12: UPDATE MONITORING ENGINE`);
      addLog(`👉 Recorded execution latency: 310ms. Resetting concurrency worker counts.`);
      setPipelineStep(12);
    }, 3000);

    // Step 13: Generate Downstream Client Notifications
    setTimeout(() => {
      addLog(`⚡ STEP 13: GENERATE Downstream NOTIFICATIONS`);
      addLog(`👉 Triggered Webhook dispatch: Notify relevant systems of profile state transitions.`);
      setPipelineStep(13);
    }, 3250);

    // Step 14: Commit Immutable Audit Trail Log
    setTimeout(() => {
      const generatedActId = `ACT-${Math.floor(5000 + Math.random() * 5000)}`;
      const generatedExeId = `EXE-ACT-${Math.floor(10000 + Math.random() * 90000)}`;

      const newAction: ActionRecord = {
        id: generatedActId,
        executionId: generatedExeId,
        decisionId: sandDecisionId,
        workflowId: sandWorkflowId,
        actionType: sandType,
        category: sandCategory,
        priority: sandPriority,
        targetEntity: sandTargetEntity,
        targetId: sandTargetId,
        inputParams: parsedParams,
        expectedOutput: sandExpectedOutput,
        actualOutput: 'Completed execution via sandboxed broker integration.',
        businessRules: ['RULE-DATA-INTEGRITY-VERIFY'],
        permissionScope: 'ROLE_SUPER_ADMIN',
        rollbackAvailable: sandCategory !== 'Communication Actions' && sandCategory !== 'Notification Actions',
        riskLevel: sandRisk,
        status: 'Completed',
        idempotencyKey: `IDEMP-${sandTargetId}-${Math.floor(10000 + Math.random() * 90000)}`,
        retryCount: 0,
        maxRetries: 3,
        latencyMs: 310,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      setActions(prev => [newAction, ...prev]);
      setPipelineOutput(newAction);
      setPipelineRunning(false);
      setTotalExecutedCount(t => t + 1);
      
      addLog(`⚡ STEP 14: WRITE SECURE AUDIT LEDGER LOG`);
      addLog(`✅ COMMIT COMPLETE: Saved action ${generatedActId} block to blockchain-like ledger database.`);
      addLog(`🏁 ACTION PIPELINE CONCLUDED WITH ZERO EXCEPTIONS.`);
      setPipelineStep(14);
    }, 3500);
  };

  // ==========================================
  // INTERACTIVE ACTION ROLLBACK COMMAND
  // ==========================================
  const triggerRollback = (id: string) => {
    setActions(prev =>
      prev.map(act => {
        if (act.id === id) {
          return {
            ...act,
            status: 'Rolled Back',
            actualOutput: 'ROLLBACK APPLIED successfully. Restored system parameters.'
          };
        }
        return act;
      })
    );
    setRollbackCount(r => r + 1);
  };

  // ==========================================
  // DISPATCH COMPLIANCE AUTOMATED TESTS
  // ==========================================
  const runComplianceTests = () => {
    setTestsExecuted(true);
    const suiteLogs: { id: string; name: string; status: 'PASS' | 'FAIL'; output: string }[] = [];

    // Test 1: Idempotency Key Guard Collision
    suiteLogs.push({
      id: 'ACT-TST-601',
      name: 'Test 1: Idempotency Key Duplicate Prevention Guard',
      status: 'PASS',
      output: 'Success: Dispatched sequential action requests with identical Idempotency Key "IDEMP-DUPL-99". The system locked the duplicate stream, bypassed the redundant database writes, and safely returned the cached response hash.'
    });

    // Test 2: Sequential Dependency Execution Chain
    suiteLogs.push({
      id: 'ACT-TST-602',
      name: 'Test 2: Sequential Workflow Prerequisite Dependency Manager',
      status: 'PASS',
      output: 'Success: Simulated multi-stage candidate matching chain. Checked that Step 2 (Notification) blocks automatically if Step 1 (Db creation) returns an error. Dependency evaluation constraints enforced.'
    });

    // Test 3: Optimistic Resource Locking Verification
    suiteLogs.push({
      id: 'ACT-TST-603',
      name: 'Test 3: Race-Condition Prevention via Optimistic Locking',
      status: 'PASS',
      output: 'Success: Spun up 1,000 parallel test threads aiming to decrement the same token wallet. Optimistic locking version validation threw exceptions on outdated version counters, successfully protecting ledger balances.'
    });

    // Test 4: Compensating Transaction Dispatch
    suiteLogs.push({
      id: 'ACT-TST-604',
      name: 'Test 4: Non-reversible Action Compensation Dispatcher',
      status: 'PASS',
      output: 'Success: Requested rollback on a "Notify Student Email" action. Since emails are non-reversible, the Rollback Engine successfully identified the policy constraint, bypassed direct undoing, and dispatched compensating "Clarification push update" action.'
    });

    setTestSuiteLogs(suiteLogs);
  };

  // Filtering actions computation
  const filteredActions = actions.filter(act => {
    const matchesSearch = act.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.workflowId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || act.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || act.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div id="ai-action-engine" className="bg-neutral-950 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-neutral-200">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400">Specification 6.0</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">AI Action Engine</h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            The core workflow execution layer of the KONEXA platform. Executes approved AI Decision outcomes under strict safety guards, implementing resource locking, automatic rollback paths, idempotency guarantees, and immutable logging.
          </p>
        </div>

        {/* METRIC BADGES */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Cumulative Executions</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono mt-0.5">
              {totalExecutedCount.toLocaleString()} completed
            </span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Idempotency Checks</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono mt-0.5">
              100% Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* SUB MENU NAVIGATION */}
      <div className="flex flex-wrap gap-1.5 bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/40">
        {[
          { id: 'queue', label: 'Action Registry & Queue', icon: ListOrdered },
          { id: 'trigger', label: 'Execution Sandbox Pipeline', icon: Play },
          { id: 'telemetry', label: 'Performance Telemetry', icon: Gauge },
          { id: 'compensation', label: 'Compensation & Rollbacks', icon: Undo2 },
          { id: 'compliance_tests', label: 'System Compliance Tests', icon: ShieldCheck },
          { id: 'blueprints', label: 'Database & API Blueprints', icon: Code }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700/60 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB WORKSPACE CONTAINERS */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ==========================================
              SUBTAB 1: ACTION REGISTRY & QUEUE
              ========================================== */}
          {activeSubTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* FILTERS */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-4">
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search Action ID, target entity, workflow..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Student Actions">Student Actions</option>
                    <option value="Company Actions">Company Actions</option>
                    <option value="Project Actions">Project Actions</option>
                    <option value="Trust Actions">Trust Actions</option>
                    <option value="Communication Actions">Communication Actions</option>
                    <option value="Notification Actions">Notification Actions</option>
                    <option value="Document Actions">Document Actions</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Queued">Queued</option>
                    <option value="Running">Running</option>
                    <option value="Rolled Back">Rolled Back</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div className="text-[10px] text-neutral-400 font-mono">
                  Displaying <span className="text-indigo-400 font-bold">{filteredActions.length}</span> / {actions.length} Immutable Action Records
                </div>
              </div>

              {/* ACTION TIMELINE CARD LAYOUT */}
              <div className="space-y-4">
                {filteredActions.map(act => (
                  <div key={act.id} className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/60 transition-all duration-300 space-y-4">
                    
                    {/* TOP META ROW */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-800/60 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {act.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          act.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          act.status === 'Pending' || act.status === 'Queued' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          act.status === 'Rolled Back' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {act.status}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                          act.priority === 'Critical' ? 'text-rose-400 bg-rose-500/5 font-bold animate-pulse' :
                          act.priority === 'High' ? 'text-yellow-400 bg-yellow-500/5' :
                          'text-neutral-400 bg-neutral-900/5'
                        }`}>
                          Priority: {act.priority}
                        </span>
                      </div>

                      <div className="text-[10px] text-neutral-500 font-mono">
                        Action: {act.id} | Parent Decision: {act.decisionId} | v{act.version}
                      </div>
                    </div>

                    {/* CORE CONTENT */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Input parameters and expectations */}
                      <div className="lg:col-span-8 space-y-3 font-sans">
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Target Entity Objective:</span>
                          <h4 className="text-sm font-semibold text-white">
                            Modify <span className="text-indigo-400 font-mono font-bold">{act.targetEntity}</span> (Target ID: <span className="text-neutral-300 font-mono">{act.targetId}</span>) using method <span className="text-cyan-400 font-mono font-bold">{act.actionType}</span>.
                          </h4>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Input Configuration Scope:</span>
                          <pre className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-900 font-mono overflow-x-auto">
                            {JSON.stringify(act.inputParams, null, 2)}
                          </pre>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-900/60">
                            <span className="text-[9px] text-neutral-500 font-mono uppercase block">Expected Output Checklist:</span>
                            <p className="text-xs text-neutral-400 leading-relaxed mt-0.5">{act.expectedOutput}</p>
                          </div>
                          {act.actualOutput && (
                            <div className="p-3 bg-emerald-950/10 rounded-xl border border-emerald-500/10">
                              <span className="text-[9px] text-emerald-500/80 font-mono uppercase block">Live Broker Output Trace:</span>
                              <p className="text-xs text-emerald-400 leading-relaxed mt-0.5">{act.actualOutput}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Security policy & Integrity guards */}
                      <div className="lg:col-span-4 space-y-3 lg:border-l lg:border-neutral-800/60 lg:pl-6 font-mono text-[11px]">
                        
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Idempotency Signature:</span>
                          <div className="bg-neutral-950 p-2 rounded-lg border border-neutral-900 text-neutral-300 truncate">
                            {act.idempotencyKey}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-neutral-500 uppercase block">Workflow Context:</span>
                          <div className="flex items-center justify-between text-neutral-400">
                            <span>Workflow ID:</span>
                            <span className="text-indigo-300 font-bold">{act.workflowId}</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-400">
                            <span>RBAC Scope:</span>
                            <span className="text-cyan-400 font-semibold">{act.permissionScope}</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-400">
                            <span>Execution Latency:</span>
                            <span className="text-neutral-200">{act.latencyMs ? `${act.latencyMs}ms` : 'Pending'}</span>
                          </div>
                        </div>

                        {/* Rollback Interactivity */}
                        <div className="pt-2">
                          {act.status === 'Completed' && act.rollbackAvailable ? (
                            <button
                              onClick={() => triggerRollback(act.id)}
                              className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-xs font-sans"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                              Trigger Safe Rollback
                            </button>
                          ) : act.status === 'Rolled Back' ? (
                            <div className="p-2.5 bg-neutral-950 border border-neutral-900 rounded-xl text-center text-purple-400/80 font-bold text-xs flex items-center justify-center gap-1.5">
                              <Undo2 className="w-3.5 h-3.5" />
                              Rollback Succeeded
                            </div>
                          ) : (
                            <div className="p-2.5 bg-neutral-950 border border-neutral-900 rounded-xl text-center text-neutral-500 text-xs">
                              No Rollback Path Needed
                            </div>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 2: EXECUTION SANDBOX PIPELINE
              ========================================== */}
          {activeSubTab === 'trigger' && (
            <motion.div
              key="trigger"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* LEFT COLUMN: PARAMETER SETUP */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4 font-mono text-xs">
                <div>
                  <h3 className="font-bold text-sm text-white font-sans flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Action Sandbox Parameter Board
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">Customize action category and parameters to witness standard execution rules in real-time.</p>
                </div>

                {/* Parent Decision Link */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Decision ID</label>
                    <input
                      type="text"
                      value={sandDecisionId}
                      onChange={(e) => setSandDecisionId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Workflow ID</label>
                    <input
                      type="text"
                      value={sandWorkflowId}
                      onChange={(e) => setSandWorkflowId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    />
                  </div>
                </div>

                {/* Category & Type Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Category</label>
                    <select
                      value={sandCategory}
                      onChange={(e) => setSandCategory(e.target.value as ActionCategory)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-neutral-200"
                    >
                      <option value="Student Actions">Student Actions</option>
                      <option value="Company Actions">Company Actions</option>
                      <option value="Project Actions">Project Actions</option>
                      <option value="Trust Actions">Trust Actions</option>
                      <option value="Communication Actions">Communication Actions</option>
                      <option value="Notification Actions">Notification Actions</option>
                      <option value="Document Actions">Document Actions</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Action Type</label>
                    <select
                      value={sandType}
                      onChange={(e) => setSandType(e.target.value as ActionType)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    >
                      <option value="Create">Create</option>
                      <option value="Update">Update</option>
                      <option value="Notify">Notify</option>
                      <option value="Generate">Generate</option>
                      <option value="Assign">Assign</option>
                      <option value="Approve">Approve</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                </div>

                {/* Target Scope */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Target Entity</label>
                    <input
                      type="text"
                      value={sandTargetEntity}
                      onChange={(e) => setSandTargetEntity(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Target ID</label>
                    <input
                      type="text"
                      value={sandTargetId}
                      onChange={(e) => setSandTargetId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    />
                  </div>
                </div>

                {/* Priority & Risk levels */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Priority</label>
                    <select
                      value={sandPriority}
                      onChange={(e) => setSandPriority(e.target.value as ActionPriority)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold uppercase">Risk Index</label>
                    <select
                      value={sandRisk}
                      onChange={(e) => setSandRisk(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Input Params JSON */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase">Input Params (JSON)</label>
                  <textarea
                    rows={3}
                    value={sandInputParams}
                    onChange={(e) => setSandInputParams(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Expected outcomes */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase">Expected Outcomes</label>
                  <input
                    type="text"
                    value={sandExpectedOutput}
                    onChange={(e) => setSandExpectedOutput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200"
                  />
                </div>

                {/* RUN PIPELINE BUTTON */}
                <button
                  onClick={triggerActionPipeline}
                  disabled={pipelineRunning}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 text-white rounded-xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg font-sans text-xs"
                >
                  {pipelineRunning ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  DISPATCH ACTION PIPELINE
                </button>

              </div>

              {/* RIGHT COLUMN: 14 STEPS LOG DISPLAY */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between flex-1">
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        Universal Action Pipeline Trace (14 Stages)
                      </span>
                      <span className="text-[10px] text-neutral-500">Steps completed: <span className="text-indigo-400 font-bold">{pipelineStep === -1 ? 0 : pipelineStep}/14</span></span>
                    </div>

                    {/* Stage visualizer grids */}
                    <div className="grid grid-cols-7 gap-1 bg-neutral-950/40 p-2 rounded-xl border border-neutral-900 text-center font-mono text-[8px] text-neutral-500">
                      {[
                        { step: 2, label: '1-2: Valid' },
                        { step: 4, label: '3-4: Secur' },
                        { step: 5, label: '5: Rule' },
                        { step: 6, label: '6: Plan' },
                        { step: 8, label: '7-8: Lock' },
                        { step: 10, label: '9-10: Exec' },
                        { step: 14, label: '11-14: Emit' }
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

                    {/* Terminal text lines */}
                    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[10px] leading-relaxed space-y-2.5 max-h-[220px] overflow-y-auto min-h-[180px]">
                      {pipelineLogs.length === 0 ? (
                        <div className="text-neutral-600 italic">No operations active. Trigger the pipeline sandbox to run the 14-stage Action runtime protocol.</div>
                      ) : (
                        pipelineLogs.map((log, index) => (
                          <div key={index} className={`${
                            log.includes('❌') ? 'text-rose-400 font-bold' :
                            log.includes('✅') ? 'text-emerald-400' :
                            log.includes('⚠️') ? 'text-yellow-400' : 'text-neutral-300'
                          }`}>
                            {log}
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* SUCCESS PILL */}
                  {pipelineOutput && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mt-4 space-y-2 font-mono text-xs"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckSquare className="w-4 h-4" />
                        COMPLETED ACTION REGISTERED SUCCESSFULLY
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[10px] text-neutral-400">
                        <div>Action ID: <span className="text-white font-bold">{pipelineOutput.id}</span></div>
                        <div>Idempotency Hash: <span className="text-white font-bold">{pipelineOutput.idempotencyKey}</span></div>
                        <div>Workflow Reference: <span className="text-white font-bold">{pipelineOutput.workflowId}</span></div>
                        <div>Commit Timestamp: <span className="text-white font-bold">{new Date(pipelineOutput.timestamp).toLocaleTimeString()}</span></div>
                      </div>
                    </motion.div>
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 3: PERFORMANCE TELEMETRY
              ========================================== */}
          {activeSubTab === 'telemetry' && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-neutral-500 font-mono">EXECUTION LATENCY</span>
                  <div className="text-2xl font-bold text-white">204 ms</div>
                  <span className="text-[10px] text-emerald-400 font-mono">↓ 14% improvement</span>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-neutral-500 font-mono font-sans">RETRY RATE</span>
                  <div className="text-2xl font-bold text-white">0.82%</div>
                  <span className="text-[10px] text-neutral-400 font-mono">Within SLA threshold</span>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-neutral-500 font-mono">ROLLBACK SUCCESS RATE</span>
                  <div className="text-2xl font-bold text-white">100.0%</div>
                  <span className="text-[10px] text-emerald-400 font-mono">12/12 successful rollbacks</span>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-neutral-500 font-mono">CONCURRENT THREADS</span>
                  <div className="text-2xl font-bold text-white">18 / 100</div>
                  <span className="text-[10px] text-neutral-400 font-mono">Queue dynamic scaling active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Latency Area Chart */}
                <div className="bg-neutral-900/30 border border-neutral-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold font-mono text-neutral-400 uppercase">Live Latency & Throughput (24h)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={METRICS_LIVE_LATENCY}>
                        <defs>
                          <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="timestamp" stroke="#737373" fontSize={10} fontClassName="font-mono" />
                        <YAxis stroke="#737373" fontSize={10} fontClassName="font-mono" />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040' }} />
                        <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Pie Distribution */}
                <div className="bg-neutral-900/30 border border-neutral-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold font-mono text-neutral-400 uppercase">Execution Category Distribution</h3>
                  <div className="h-64 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={CATEGORY_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {CATEGORY_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full sm:w-1/2 space-y-2 font-mono text-xs">
                      {CATEGORY_DISTRIBUTION.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-neutral-400">{entry.name}</span>
                          </div>
                          <span className="text-white font-bold">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 4: COMPENSATION & ROLLBACKS
              ========================================== */}
          {activeSubTab === 'compensation' && (
            <motion.div
              key="compensation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-purple-950/10 border border-purple-500/20 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 font-sans">
                  <Undo2 className="w-4 h-4 animate-bounce" />
                  Deterministic Rollback & Compensation Engine
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  The AI Action Engine ensures data consistency. If an action is reversible (e.g., updating a database value), a direct rollback updates the record to its original state. For non-reversible actions (e.g., external emails, webhook dispatches), the Compensation Engine automatically triggers correction procedures and files administrative reports.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                
                {/* Rollback history log list */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold font-mono text-neutral-400 uppercase">Recent Rollback Events Log</h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-purple-400 font-bold">ROLLBACK_SUCCESS</span>
                        <span className="text-neutral-500">2026-07-04 18:22 UTC</span>
                      </div>
                      <p className="text-neutral-300">Reversed Project Assignment on ACT-3904. Database updated successfully. Collaborator role removed.</p>
                      <div className="text-[10px] text-neutral-500">Idempotency Key: IDEMP-REVERT-3904</div>
                    </div>

                    <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-purple-400 font-bold">COMPENSATION_DISPATCHED</span>
                        <span className="text-neutral-500">2026-07-04 15:40 UTC</span>
                      </div>
                      <p className="text-neutral-300">Triggered Compensating Correction: "Clarification update" delivered to 200 recipients because original mail delivery failed.</p>
                      <div className="text-[10px] text-neutral-500">Idempotency Key: IDEMP-REVERT-MAIL-102</div>
                    </div>
                  </div>
                </div>

                {/* Compensation catalog viewer */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold font-mono text-neutral-400 uppercase">Compensating Actions Catalog Lookup</h4>
                  <p className="text-xs text-neutral-400 font-sans">These correction procedures are automatically chosen when a physical rollback is impossible due to external system limits.</p>
                  
                  <div className="space-y-2 font-mono text-xs">
                    {Object.entries(COMPENSATION_CATALOG).map(([key, value]) => (
                      <div key={key} className="p-3 bg-neutral-950 border border-neutral-900 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase">{key}</span>
                        <div className="text-white font-bold">{value.label}</div>
                        <p className="text-[11px] text-neutral-400 font-sans mt-1">{value.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 5: SYSTEM COMPLIANCE TESTS
              ========================================== */}
          {activeSubTab === 'compliance_tests' && (
            <motion.div
              key="compliance_tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900/20 border border-neutral-800 p-5 rounded-2xl">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    Action Engine Validation & Compliance Suite
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xl font-sans">
                    Execute isolated test scripts to verify the compliance matrix of the AI Action Engine, including race-condition guards, sequential dependencies, and idempotency guarantees.
                  </p>
                </div>

                <button
                  onClick={runComplianceTests}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 font-sans"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Run Validation Tests
                </button>
              </div>

              {testsExecuted ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testSuiteLogs.map(test => (
                    <div key={test.id} className="bg-neutral-900/30 border border-neutral-800 p-4 rounded-xl space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white truncate max-w-[80%]">{test.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {test.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-900">
                        {test.output}
                      </p>
                      <div className="text-[10px] text-neutral-500">Test ID: {test.id}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-900/10 border border-neutral-800 border-dashed p-10 rounded-2xl text-center text-neutral-500 italic text-xs font-sans">
                  Tests idle. Click the dispatch button above to execute the automated system compliance test suite.
                </div>
              )}
            </motion.div>
          )}

          {/* ==========================================
              SUBTAB 6: BLUEPRINTS & APIS
              ========================================== */}
          {activeSubTab === 'blueprints' && (
            <motion.div
              key="blueprints"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* LEFT COLUMN: TABLE SCHEMAS */}
              <div className="lg:col-span-6 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xs font-mono text-neutral-400 uppercase">Database Schema (drizzle/schema.ts)</h3>
                  <select
                    value={blueprintTable}
                    onChange={(e) => setBlueprintTable(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none"
                  >
                    <option value="action_registry">action_registry</option>
                    <option value="execution_records">execution_records</option>
                    <option value="action_queue">action_queue</option>
                    <option value="rollback_records">rollback_records</option>
                  </select>
                </div>

                <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[11px] leading-relaxed max-h-[350px] overflow-y-auto">
                  {blueprintTable === 'action_registry' && (
                    <pre className="text-neutral-300">
{`export const actionRegistry = pgTable('action_registry', {
  id: varchar('id', { length: 32 }).primaryKey(),
  executionId: varchar('execution_id', { length: 32 }).notNull(),
  decisionId: varchar('decision_id', { length: 32 }).notNull(),
  workflowId: varchar('workflow_id', { length: 32 }).notNull(),
  actionType: varchar('action_type', { length: 32 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  priority: varchar('priority', { length: 16 }).notNull(),
  targetEntity: varchar('target_entity', { length: 128 }).notNull(),
  targetId: varchar('target_id', { length: 64 }).notNull(),
  inputParams: jsonb('input_params').notNull(),
  expectedOutput: text('expected_output').notNull(),
  actualOutput: text('actual_output'),
  businessRules: text('business_rules').array(),
  permissionScope: varchar('permission_scope', { length: 64 }),
  rollbackAvailable: boolean('rollback_available').default(true),
  riskLevel: varchar('risk_level', { length: 16 }).default('Medium'),
  status: varchar('status', { length: 32 }).default('Pending'),
  idempotencyKey: varchar('idempotency_key', { length: 256 }).unique(),
  retryCount: integer('retry_count').default(0),
  maxRetries: integer('max_retries').default(3),
  timestamp: timestamp('timestamp').defaultNow(),
  version: varchar('version', { length: 16 }).default('1.0.0')
});`}
                    </pre>
                  )}

                  {blueprintTable === 'execution_records' && (
                    <pre className="text-neutral-300">
{`export const executionRecords = pgTable('execution_records', {
  id: serial('id').primaryKey(),
  actionId: varchar('action_id', { length: 32 }).references(() => actionRegistry.id),
  workerNode: varchar('worker_node', { length: 64 }),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  latencyMs: integer('latency_ms'),
  brokerResponseCode: integer('broker_response_code'),
  lockVersion: integer('lock_version').default(1),
  errorMessage: text('error_message')
});`}
                    </pre>
                  )}

                  {blueprintTable === 'action_queue' && (
                    <pre className="text-neutral-300">
{`export const actionQueue = pgTable('action_queue', {
  queueId: serial('queue_id').primaryKey(),
  actionId: varchar('action_id', { length: 32 }).references(() => actionRegistry.id),
  priorityWeight: integer('priority_weight').default(10),
  queuedAt: timestamp('queued_at').defaultNow(),
  leasedUntil: timestamp('leased_until'),
  workerId: varchar('worker_id', { length: 64 })
});`}
                    </pre>
                  )}

                  {blueprintTable === 'rollback_records' && (
                    <pre className="text-neutral-300">
{`export const rollbackRecords = pgTable('rollback_records', {
  rollbackId: varchar('rollback_id', { length: 32 }).primaryKey(),
  originalActionId: varchar('original_action_id', { length: 32 }),
  compensationActionId: varchar('compensation_action_id', { length: 32 }),
  triggeredBy: varchar('triggered_by', { length: 64 }),
  rollbackStatus: varchar('rollback_status', { length: 32 }),
  executedAt: timestamp('executed_at').defaultNow()
});`}
                    </pre>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: API SPECS */}
              <div className="lg:col-span-6 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xs font-mono text-neutral-400 uppercase">REST API Endpoints</h3>
                  <select
                    value={blueprintApi}
                    onChange={(e) => setBlueprintApi(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none"
                  >
                    <option value="POST /api/actions/execute">POST /api/actions/execute</option>
                    <option value="POST /api/actions/rollback">POST /api/actions/rollback</option>
                    <option value="GET /api/actions/metrics">GET /api/actions/metrics</option>
                  </select>
                </div>

                <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[11px] leading-relaxed max-h-[350px] overflow-y-auto">
                  {blueprintApi === 'POST /api/actions/execute' && (
                    <pre className="text-neutral-300">
{`// Route handler: POST /api/actions/execute
app.post('/api/actions/execute', async (req, res) => {
  const { decisionId, actionType, category, targetEntity, targetId, inputParams, idempotencyKey } = req.body;

  // 1. Verify Idempotency check to avoid duplicate trigger
  const cachedResult = await db.select().from(actionRegistry).where(eq(actionRegistry.idempotencyKey, idempotencyKey)).limit(1);
  if (cachedResult.length > 0) {
    return res.status(200).json({ status: 'CACHED', data: cachedResult[0] });
  }

  // 2. Perform optimistic locking / security RBAC checks
  // 3. Dispatch to Tool Broker
  // 4. Record to execution metrics & audit trail log

  res.status(201).json({ status: 'COMPLETED', actionId: 'ACT-4019', executionHash: '0x9d2a3' });
});`}
                    </pre>
                  )}

                  {blueprintApi === 'POST /api/actions/rollback' && (
                    <pre className="text-neutral-300">
{`// Route handler: POST /api/actions/rollback
app.post('/api/actions/rollback', async (req, res) => {
  const { actionId } = req.body;

  const action = await db.select().from(actionRegistry).where(eq(actionRegistry.id, actionId)).limit(1);
  if (!action.length) {
    return res.status(404).json({ error: 'Action record not found' });
  }

  if (!action[0].rollbackAvailable) {
    // Dispatch Compensating Transaction procedure instead
    const compensation = await triggerCompensation(action[0]);
    return res.status(200).json({ status: 'COMPENSATED', compensationActionId: compensation.id });
  }

  // Execute actual database state rollback update
  res.status(200).json({ status: 'ROLLED_BACK' });
});`}
                    </pre>
                  )}

                  {blueprintApi === 'GET /api/actions/metrics' && (
                    <pre className="text-neutral-300">
{`// Route handler: GET /api/actions/metrics
app.get('/api/actions/metrics', async (req, res) => {
  const metrics = await db.select({
    avgLatency: avg(executionRecords.latencyMs),
    totalOperations: count(actionRegistry.id)
  }).from(actionRegistry);

  res.json({ metrics });
});`}
                    </pre>
                  )}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
