import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Terminal,
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
  BarChart
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
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 3.0 AI TOOL CALLING ENGINE)
// ============================================================================

export type ToolCategory =
  | 'Database'
  | 'Matching'
  | 'Performance'
  | 'Trust'
  | 'Project'
  | 'Communication'
  | 'Document'
  | 'Analytics'
  | 'Search'
  | 'External Integration'
  | 'Administration';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ToolExecutionStatus =
  | 'Queued'
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Pending Approval'
  | 'Rolled Back';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  owner: string;
  inputSchema: string;
  outputSchema: string;
  requiredRole: string;
  riskLevel: RiskLevel;
  timeoutMs: number;
  retryCount: number;
  rollbackSupport: boolean;
  version: string;
  usageCount: number;
  avgDurationMs: number;
  tokenCost: number; // simulated cost parameter
  requiresHumanApproval: boolean;
}

export interface ToolExecutionRecord {
  id: string;
  toolId: string;
  toolName: string;
  agent: string;
  parameters: string; // JSON String
  status: ToolExecutionStatus;
  riskLevel: RiskLevel;
  durationMs: number;
  errorMessage?: string;
  timestamp: string;
  version: string;
  needsApprovalBy?: string;
  approvedBy?: string;
  rollbackExecuted: boolean;
}

export interface ToolQueueItem {
  id: string;
  toolId: string;
  toolName: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  agent: string;
  timestamp: string;
  status: 'Pending' | 'Processing' | 'Retrying' | 'Dead Letter';
  retryAttempt: number;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: 'TOOL-GET-STUDENT',
    name: 'Get Student Profile',
    category: 'Database',
    description: 'Retrieves standard academic, project progress, and certificate information for a validated student ID.',
    owner: 'System / Automated Core',
    inputSchema: '{\n  "studentId": "string" \n}',
    outputSchema: '{\n  "id": "string",\n  "fullName": "string",\n  "skills": "string[]",\n  "gpa": "number"\n}',
    requiredRole: 'AI Career Coach',
    riskLevel: 'Low',
    timeoutMs: 1500,
    retryCount: 3,
    rollbackSupport: false,
    version: '1.0.2',
    usageCount: 42109,
    avgDurationMs: 42,
    tokenCost: 15,
    requiresHumanApproval: false
  },
  {
    id: 'TOOL-UPDATE-STUDENT-STATUS',
    name: 'Update Student Account Status',
    category: 'Database',
    description: 'Updates student enrollment status, security lock status, or platform suspension indicators.',
    owner: 'System / Automated Core',
    inputSchema: '{\n  "studentId": "string",\n  "status": "ACTIVE | SUSPENDED | INACTIVE",\n  "reason": "string"\n}',
    outputSchema: '{\n  "success": "boolean",\n  "updatedAt": "string"\n}',
    requiredRole: 'AI Fraud Detector',
    riskLevel: 'High',
    timeoutMs: 3000,
    retryCount: 2,
    rollbackSupport: true,
    version: '2.1.0',
    usageCount: 148,
    avgDurationMs: 185,
    tokenCost: 80,
    requiresHumanApproval: true
  },
  {
    id: 'TOOL-GENERATE-MATCHING',
    name: 'Compute Candidates Match',
    category: 'Matching',
    description: 'Computes matching similarity parameters between a project specification and available student profiles.',
    owner: 'AI Recruiter',
    inputSchema: '{\n  "projectId": "string",\n  "topK": "number"\n}',
    outputSchema: '{\n  "matches": [\n    { "studentId": "string", "score": "number" }\n  ]\n}',
    requiredRole: 'AI Recruiter',
    riskLevel: 'Medium',
    timeoutMs: 10000,
    retryCount: 2,
    rollbackSupport: false,
    version: '3.0.1',
    usageCount: 12502,
    avgDurationMs: 980,
    tokenCost: 240,
    requiresHumanApproval: false
  },
  {
    id: 'TOOL-SUSPEND-ACCOUNT',
    name: 'Account Disciplinary Suspension',
    category: 'Administration',
    description: 'Triggers platform suspension for a student or company violating platform guidelines.',
    owner: 'System / Automated Core',
    inputSchema: '{\n  "targetId": "string",\n  "disciplinaryReason": "string"\n}',
    outputSchema: '{\n  "disciplinaryId": "string",\n  "suspensionActive": "boolean"\n}',
    requiredRole: 'Super Administrator',
    riskLevel: 'Critical',
    timeoutMs: 5000,
    retryCount: 1,
    rollbackSupport: true,
    version: '1.4.0',
    usageCount: 14,
    avgDurationMs: 450,
    tokenCost: 500,
    requiresHumanApproval: true
  },
  {
    id: 'TOOL-SEND-MASS-EMAIL',
    name: 'Send Mass Notification Broadcast',
    category: 'Communication',
    description: 'Issues an automated system email or notification broadcast to multiple users matching specified criteria.',
    owner: 'AI Communication Assistant',
    inputSchema: '{\n  "targetFilter": "string",\n  "emailBody": "string",\n  "subject": "string"\n}',
    outputSchema: '{\n  "deliveredCount": "number"\n}',
    requiredRole: 'AI Communication Assistant',
    riskLevel: 'High',
    timeoutMs: 15000,
    retryCount: 3,
    rollbackSupport: false,
    version: '2.0.0',
    usageCount: 88,
    avgDurationMs: 2500,
    tokenCost: 150,
    requiresHumanApproval: true
  },
  {
    id: 'TOOL-RECALCULATE-TRUST',
    name: 'Recalculate Trust Score',
    category: 'Trust',
    description: 'Triggers analytical re-evaluation of trust parameters based on historic and latest interaction records.',
    owner: 'AI Fraud Detector',
    inputSchema: '{\n  "userId": "string"\n}',
    outputSchema: '{\n  "previousScore": "number",\n  "newScore": "number",\n  "delta": "number"\n}',
    requiredRole: 'AI Fraud Detector',
    riskLevel: 'High',
    timeoutMs: 6000,
    retryCount: 1,
    rollbackSupport: true,
    version: '1.2.0',
    usageCount: 924,
    avgDurationMs: 550,
    tokenCost: 120,
    requiresHumanApproval: false
  },
  {
    id: 'TOOL-SYNC-GITHUB',
    name: 'Sync Repository Commits',
    category: 'External Integration',
    description: 'Synchronizes external VCS repository records to compute lab performance and milestone checkin metrics.',
    owner: 'AI Project Manager',
    inputSchema: '{\n  "repoUrl": "string",\n  "studentId": "string"\n}',
    outputSchema: '{\n  "commitsSynced": "number",\n  "latestSha": "string"\n}',
    requiredRole: 'AI Project Manager',
    riskLevel: 'Medium',
    timeoutMs: 8000,
    retryCount: 2,
    rollbackSupport: false,
    version: '1.0.5',
    usageCount: 4410,
    avgDurationMs: 1200,
    tokenCost: 65,
    requiresHumanApproval: false
  }
];

const INITIAL_EXECUTIONS: ToolExecutionRecord[] = [
  {
    id: 'EXE-TOOL-09101',
    toolId: 'TOOL-GET-STUDENT',
    toolName: 'Get Student Profile',
    agent: 'AI Career Coach',
    parameters: '{\n  "studentId": "STUD-8812"\n}',
    status: 'Completed',
    riskLevel: 'Low',
    durationMs: 38,
    timestamp: '2026-07-04T19:42:00Z',
    version: '1.0.2',
    rollbackExecuted: false
  },
  {
    id: 'EXE-TOOL-09102',
    toolId: 'TOOL-UPDATE-STUDENT-STATUS',
    toolName: 'Update Student Account Status',
    agent: 'AI Fraud Detector',
    parameters: '{\n  "studentId": "STUD-4412",\n  "status": "SUSPENDED",\n  "reason": "Repeated multi-device WebGL canvas fingerprint collisions."\n}',
    status: 'Pending Approval',
    riskLevel: 'High',
    durationMs: 0,
    timestamp: '2026-07-04T20:10:00Z',
    version: '2.1.0',
    needsApprovalBy: 'TRUST_SAFETY',
    rollbackExecuted: false
  },
  {
    id: 'EXE-TOOL-09103',
    toolId: 'TOOL-GENERATE-MATCHING',
    toolName: 'Compute Candidates Match',
    agent: 'AI Recruiter',
    parameters: '{\n  "projectId": "PROJ-2026-X8",\n  "topK": 5\n}',
    status: 'Completed',
    riskLevel: 'Medium',
    durationMs: 1042,
    timestamp: '2026-07-04T20:15:00Z',
    version: '3.0.1',
    rollbackExecuted: false
  },
  {
    id: 'EXE-TOOL-09104',
    toolId: 'TOOL-RECALCULATE-TRUST',
    toolName: 'Recalculate Trust Score',
    agent: 'AI Fraud Detector',
    parameters: '{\n  "userId": "STUD-2309"\n}',
    status: 'Failed',
    riskLevel: 'High',
    durationMs: 5990,
    errorMessage: 'ETIMEOUT: Upstream PostgreSQL replication delay exceeded 5000ms SLA configuration.',
    timestamp: '2026-07-04T20:25:00Z',
    version: '1.2.0',
    rollbackExecuted: true
  }
];

const INITIAL_QUEUE: ToolQueueItem[] = [
  {
    id: 'QUE-00121',
    toolId: 'TOOL-GET-STUDENT',
    toolName: 'Get Student Profile',
    priority: 'Low',
    agent: 'AI Career Coach',
    timestamp: '2026-07-04T20:34:00Z',
    status: 'Pending',
    retryAttempt: 0
  },
  {
    id: 'QUE-00122',
    toolId: 'TOOL-SYNC-GITHUB',
    toolName: 'Sync Repository Commits',
    priority: 'Medium',
    agent: 'AI Project Manager',
    timestamp: '2026-07-04T20:33:00Z',
    status: 'Retrying',
    retryAttempt: 1
  }
];

const METRICS_TIMELINE = [
  { time: '19:40', calls: 820, successRate: 99.8, avgLatency: 112 },
  { time: '19:50', calls: 940, successRate: 99.6, avgLatency: 115 },
  { time: '20:00', calls: 1250, successRate: 99.7, avgLatency: 108 },
  { time: '20:10', calls: 1580, successRate: 99.2, avgLatency: 132 },
  { time: '20:20', calls: 1890, successRate: 98.9, avgLatency: 145 },
  { time: '20:30', calls: 2450, successRate: 99.5, avgLatency: 122 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Database API', value: 45, color: '#06b6d4' }, // Cyan
  { name: 'Smart Matching', value: 25, color: '#8b5cf6' }, // Violet
  { name: 'Trust & Safety', value: 12, color: '#f43f5e' }, // Rose
  { name: 'Communication', value: 10, color: '#3b82f6' }, // Blue
  { name: 'External Integrations', value: 8, color: '#eab308' } // Yellow
];

export default function AIToolCallingEngineWorkspace() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [tools, setTools] = useState<ToolDefinition[]>(INITIAL_TOOLS);
  const [executions, setExecutions] = useState<ToolExecutionRecord[]>(INITIAL_EXECUTIONS);
  const [queue, setQueue] = useState<ToolQueueItem[]>(INITIAL_QUEUE);

  // Sub Tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<'registry' | 'broker' | 'queues' | 'observability' | 'security' | 'tests' | 'blueprints'>('registry');

  // Filtering states
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryCategory, setRegistryCategory] = useState<string>('ALL');
  const [registryRisk, setRegistryRisk] = useState<string>('ALL');

  // Interactive Broker Sandbox State
  const [selectedAgent, setSelectedAgent] = useState<string>('AI Recruiter');
  const [selectedToolId, setSelectedToolId] = useState<string>('TOOL-GENERATE-MATCHING');
  const [sandboxParams, setSandboxParams] = useState<string>('{\n  "projectId": "PROJ-2026-X8",\n  "topK": 5\n}');
  const [sandboxRunning, setSandboxRunning] = useState<boolean>(false);
  const [sandboxLog, setSandboxLog] = useState<string[]>([]);
  const [sandboxResultJson, setSandboxResultJson] = useState<string>('');
  const [sandboxStatus, setSandboxStatus] = useState<'idle' | 'running' | 'success' | 'failed' | 'needs_approval'>('idle');

  // Security Configuration states
  const [rateLimitPerMin, setRateLimitPerMin] = useState<number>(3000);
  const [promptInjectionDetectorEnabled, setPromptInjectionDetectorEnabled] = useState<boolean>(true);
  const [outputPIIStrippingEnabled, setOutputPIIStrippingEnabled] = useState<boolean>(true);

  // Dynamic Metrics Counters
  const [throughputMeter, setThroughputMeter] = useState<number>(94102);
  const [pendingApprovalCounter, setPendingApprovalCounter] = useState<number>(1);

  // Automated Integration Tests Suite
  const [testsRun, setTestsRun] = useState<boolean>(false);
  const [testSuiteLogs, setTestSuiteLogs] = useState<{ id: string; name: string; status: 'PASS' | 'FAIL'; output: string }[]>([]);

  // Blueprint view state selectors
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<'tool_registry' | 'tool_executions' | 'execution_queue' | 'rollback_history'>('tool_registry');
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<'POST /api/tools/execute' | 'POST /api/tools/approve' | 'POST /api/tools/rollback'>('POST /api/tools/execute');

  // Synchronize parameter input area when selected tool in sandbox changes
  useEffect(() => {
    const matchedTool = tools.find(t => t.id === selectedToolId);
    if (matchedTool) {
      setSandboxParams(matchedTool.inputSchema);
    }
  }, [selectedToolId, tools]);

  // ==========================================
  // SIMULATOR: TOOL BROKERsandbox EXECUTION PIPELINE
  // ==========================================
  const triggerSandboxExecution = () => {
    setSandboxRunning(true);
    setSandboxStatus('running');
    setSandboxLog([]);
    setSandboxResultJson('');

    const matchedTool = tools.find(t => t.id === selectedToolId);
    if (!matchedTool) return;

    let logLines: string[] = [];
    const addLog = (line: string) => {
      logLines = [...logLines, `[${new Date().toISOString().substring(11, 19)}] ${line}`];
      setSandboxLog(logLines);
    };

    // Phase 1: Tool Broker interception & routing
    setTimeout(() => {
      addLog(`⚡ INTERCEPTED BY TOOL BROKER: Routing execution target '${matchedTool.name}' (${matchedTool.id})`);
      addLog(`ℹ️ Requesting agent origin: '${selectedAgent}'`);
    }, 150);

    // Phase 2: Permission verification
    setTimeout(() => {
      addLog(`🔑 PERMISSION GATEWAY: Checking role access criteria for '${selectedAgent}'`);
      // Simulating a mismatch warning if user plays with invalid roles, but here we keep it simple or valid
      if (matchedTool.requiredRole !== selectedAgent && matchedTool.requiredRole !== 'System / Automated Core') {
        addLog(`⚠️ WARNING: Requesting agent '${selectedAgent}' does not match standard owner role '${matchedTool.requiredRole}'`);
        addLog(`⚖️ RBAC check: Bypassed by Administrator override clearance.`);
      } else {
        addLog(`✅ RBAC ACCESS APPROVED: Clearance verification succeeded.`);
      }
    }, 400);

    // Phase 3: Prompt injection and malicious payload detection
    setTimeout(() => {
      addLog(`🛡️ SECURITY SCRUBBER: Analyzing input payload JSON string for prompt injection patterns...`);
      if (promptInjectionDetectorEnabled) {
        const containsExploit = sandboxParams.toLowerCase().includes('ignore previous instructions') ||
                              sandboxParams.toLowerCase().includes('system command') ||
                              sandboxParams.toLowerCase().includes('drop table');
        if (containsExploit) {
          addLog(`❌ SECURITY BREAK: Malicious prompt injection pattern identified! Blocked execution immediately.`);
          setSandboxStatus('failed');
          setSandboxRunning(false);
          setSandboxResultJson(JSON.stringify({ error: "BLOCKED_BY_WAF", details: "Security rules detected forbidden input vectors." }, null, 2));
          return;
        } else {
          addLog(`✅ payload analysis clean: No system prompt bypass or injection signatures found.`);
        }
      } else {
        addLog(`⚠️ SECURITY BYPASS: Prompt injection detection is currently disabled.`);
      }
    }, 700);

    // Phase 4: JSON Input Schema Validation
    setTimeout(() => {
      addLog(`⚙️ SCHEMA ENGINE: Parsing parameters & validating against declared tool schema.`);
      try {
        const parsed = JSON.parse(sandboxParams);
        addLog(`✅ PARAMETERS VALID: Schema parsed correctly. Required keys exist.`);
      } catch (err: any) {
        addLog(`❌ SCHEMA ERROR: Parameter string is not valid JSON! Execution aborted.`);
        setSandboxStatus('failed');
        setSandboxRunning(false);
        setSandboxResultJson(JSON.stringify({ error: "MALFORMED_JSON", details: err.message }, null, 2));
        return;
      }
    }, 1000);

    // Phase 5: Risk Assessment & Approval Check
    setTimeout(() => {
      addLog(`⚖️ RISK ENGINE: Risk level computed as [${matchedTool.riskLevel}]`);
      if (matchedTool.requiresHumanApproval) {
        addLog(`🔏 APPROVAL REQUIRED: Action requires direct confirmation from a Human Super Administrator.`);
        addLog(`📥 QUEUE DISPATCH: Routed task target into 'Pending Approval' pipeline.`);
        setSandboxStatus('needs_approval');
        setSandboxRunning(false);

        // Add to executions list
        const newExe: ToolExecutionRecord = {
          id: `EXE-TOOL-${Math.floor(10000 + Math.random() * 90000)}`,
          toolId: matchedTool.id,
          toolName: matchedTool.name,
          agent: selectedAgent,
          parameters: sandboxParams,
          status: 'Pending Approval',
          riskLevel: matchedTool.riskLevel,
          durationMs: 0,
          timestamp: new Date().toISOString(),
          version: matchedTool.version,
          needsApprovalBy: 'TRUST_SAFETY',
          rollbackExecuted: false
        };
        setExecutions(prev => [newExe, ...prev]);
        setPendingApprovalCounter(p => p + 1);
        return;
      } else {
        addLog(`✅ DIRECT DISPATCH: No external approvals required for Low/Medium risk tiers.`);
      }
    }, 1300);

    // Phase 6: Core Mock Execution & Outbound Sanitization
    setTimeout(() => {
      if (sandboxStatus === 'failed' || sandboxStatus === 'needs_approval') return;
      addLog(`🚀 DISPATCH WORKER: Booting execution worker node. SLA Timeout constraint set to ${matchedTool.timeoutMs}ms.`);
      
      const latency = Math.floor(matchedTool.avgDurationMs * (0.8 + Math.random() * 0.4));
      addLog(`⚙️ EXECUTING CALL: Remote service acknowledged. Execution resolved in ${latency}ms.`);

      // Generate a mock response matching output schema
      let mockResponse: any = {};
      if (matchedTool.id === 'TOOL-GET-STUDENT') {
        mockResponse = { id: "STUD-8812", fullName: "Phan Minh Duc", skills: ["React", "TypeScript", "Python"], gpa: 3.82 };
      } else if (matchedTool.id === 'TOOL-GENERATE-MATCHING') {
        mockResponse = {
          matches: [
            { studentId: "STUD-8812", score: 0.96 },
            { studentId: "STUD-3310", score: 0.89 },
            { studentId: "STUD-2041", score: 0.84 }
          ],
          engineModel: "Gemini-3.5-Flash-Vector-Match"
        };
      } else if (matchedTool.id === 'TOOL-RECALCULATE-TRUST') {
        mockResponse = { previousScore: 92, newScore: 95, delta: 3 };
      } else if (matchedTool.id === 'TOOL-SYNC-GITHUB') {
        mockResponse = { commitsSynced: 14, latestSha: "a9b8c7d6e5f4a9b8c7d6e5f4" };
      } else {
        mockResponse = { success: true, timestamp: new Date().toISOString(), processedBy: "KONEXA-TOOL-BROKER-V3" };
      }

      // Check Output Sanitization
      if (outputPIIStrippingEnabled) {
        addLog(`🛡️ SANITIZER FILTER: Masking potential customer names, PII, and credential tokens.`);
        // Simple mock mask
        if (mockResponse.fullName) {
          mockResponse.fullName = "[REDACTED_CANDIDATE_A]";
        }
      }

      addLog(`📝 AUDIT LOG: Committing execution metadata to immutable system ledger.`);
      addLog(`✅ PIPELINE FINISHED: Tool result returned to agent successfully.`);

      setSandboxStatus('success');
      setSandboxRunning(false);
      setSandboxResultJson(JSON.stringify(mockResponse, null, 2));

      // Append to executions list
      const finalExe: ToolExecutionRecord = {
        id: `EXE-TOOL-${Math.floor(10000 + Math.random() * 90000)}`,
        toolId: matchedTool.id,
        toolName: matchedTool.name,
        agent: selectedAgent,
        parameters: sandboxParams,
        status: 'Completed',
        riskLevel: matchedTool.riskLevel,
        durationMs: latency,
        timestamp: new Date().toISOString(),
        version: matchedTool.version,
        rollbackExecuted: false
      };
      setExecutions(prev => [finalExe, ...prev]);
      setThroughputMeter(p => p + 1);

    }, 1800);
  };

  // ==========================================
  // DISPATCH DYNAMIC QUEUE ACTIONS
  // ==========================================
  const handleApproveTask = (id: string) => {
    setExecutions(prev =>
      prev.map(exe => {
        if (exe.id === id) {
          return {
            ...exe,
            status: 'Completed',
            approvedBy: 'SUPER_ADMIN_MOCK',
            durationMs: 350
          };
        }
        return exe;
      })
    );
    setPendingApprovalCounter(p => Math.max(0, p - 1));
    setThroughputMeter(p => p + 1);
  };

  const handleRollbackTask = (id: string) => {
    setExecutions(prev =>
      prev.map(exe => {
        if (exe.id === id) {
          return {
            ...exe,
            status: 'Rolled Back',
            rollbackExecuted: true
          };
        }
        return exe;
      })
    );
  };

  // ==========================================
  // EXECUTE SPECIFICATION COMPLIANCE TESTS
  // ==========================================
  const triggerTestSuite = () => {
    setTestsRun(true);
    const logs: { id: string; name: string; status: 'PASS' | 'FAIL'; output: string }[] = [];

    // Test 1: Broker Direct Blockade Verification (Bypassing direct DB queries)
    logs.push({
      id: 'TEST-301',
      name: 'Test 1: Core Platform Anti-Bypass Database Guard',
      status: 'PASS',
      output: 'Success: Simulated direct access attempt with query "SELECT * FROM student_profiles" was immediately captured by Security interceptor. Direct driver sockets blocked; routed correctly to TOOL-GET-STUDENT instead.'
    });

    // Test 2: Multi-Agent Concurrency Thread SLA Timeout Check
    logs.push({
      id: 'TEST-302',
      name: 'Test 2: High Concurrency Rate Limiter SLA Lockout',
      status: 'PASS',
      output: 'Success: Dispatched 500 parallel token generation inquiries. Detected thread concurrency exceeding 3000 calls per minute threshold, triggering adaptive HTTP 429 backoff gracefully in 14ms.'
    });

    // Test 3: Automated Fail-Safe Rollback of Transitive State Operations
    logs.push({
      id: 'TEST-303',
      name: 'Test 3: Fault-Tolerant Rollback Pipeline Engine',
      status: 'PASS',
      output: 'Success: Executed TOOL-UPDATE-STUDENT-STATUS with a database connection failure trigger. Handled error, dispatched ROLLBACK SQL script sequence, and successfully reverted Student Account indicators to prior status values.'
    });

    // Test 4: WAF Detection of Prompts Bypassing Schema Rules
    logs.push({
      id: 'TEST-304',
      name: 'Test 4: Input Injection Scrubber Block test',
      status: 'PASS',
      output: 'Success: Injected payload with value "{ ignore_rules: true, allow_unauthorized: true }". The prompt injection filter captured the hijack pattern and terminated execution before dispatching call to database layers.'
    });

    setTestSuiteLogs(logs);
  };

  // Filter computation for tool registry view
  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(registrySearch.toLowerCase()) ||
                          t.id.toLowerCase().includes(registrySearch.toLowerCase()) ||
                          t.description.toLowerCase().includes(registrySearch.toLowerCase());
    const matchesCat = registryCategory === 'ALL' || t.category === registryCategory;
    const matchesRisk = registryRisk === 'ALL' || t.riskLevel === registryRisk;
    return matchesSearch && matchesCat && matchesRisk;
  });

  return (
    <div id="ai-tool-calling-engine" className="bg-neutral-950 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-neutral-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400">Specification 3.0</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">AI Tool Calling Engine</h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            The exclusive deterministic execution and validation layer for the entire KONEXA AI Workforce. AI Agents are strictly restricted to routing platform interactions through this secure, auditable, permission-aware Tool Broker.
          </p>
        </div>

        {/* METRIC BADGES */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Avg Execution Latency</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              118.2ms
            </span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">System Throughput</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono mt-0.5">
              {throughputMeter.toLocaleString()} calls / hr
            </span>
          </div>
        </div>
      </div>

      {/* SUB TAB SELECTOR */}
      <div className="flex flex-wrap gap-1.5 bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/40">
        {[
          { id: 'registry', label: 'Tool Registry Matrix', icon: Layers },
          { id: 'broker', label: 'Interactive Broker Sandbox', icon: Terminal },
          { id: 'queues', label: 'Queues & Approvals', icon: ListOrdered },
          { id: 'observability', label: 'Telemetry & Metrics', icon: Activity },
          { id: 'security', label: 'WAF & Security Filters', icon: ShieldCheck },
          { id: 'tests', label: 'Compliance Test Suites', icon: ShieldAlert },
          { id: 'blueprints', label: 'Database & API Schemas', icon: Code }
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

      {/* RENDER CURRENT WORKSPACE VIEW */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ==========================================
              TAB 1: TOOL REGISTRY MATRIX
              ========================================== */}
          {activeSubTab === 'registry' && (
            <motion.div
              key="registry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* FILTERS PANEL */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-4">
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                  {/* Search Input */}
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search registered tools..."
                      value={registrySearch}
                      onChange={(e) => setRegistrySearch(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  {/* Category dropdown */}
                  <select
                    value={registryCategory}
                    onChange={(e) => setRegistryCategory(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Database">Database API</option>
                    <option value="Matching">Matching Engines</option>
                    <option value="Performance">Performance Evaluation</option>
                    <option value="Trust">Trust & Safety</option>
                    <option value="Communication">Communication</option>
                    <option value="External Integration">External Integrations</option>
                    <option value="Administration">System Administration</option>
                  </select>

                  {/* Risk Level dropdown */}
                  <select
                    value={registryRisk}
                    onChange={(e) => setRegistryRisk(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Critical">Critical Risk</option>
                  </select>
                </div>

                <div className="text-[10px] text-neutral-400 font-mono">
                  Displaying <span className="text-cyan-400 font-bold">{filteredTools.length}</span> / {tools.length} Registered API Tools
                </div>
              </div>

              {/* TOOL LIST GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTools.map(tool => (
                  <div key={tool.id} className="bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-neutral-700/60 transition-all duration-300">
                    <div className="space-y-3">
                      
                      {/* Badge / Metadata row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {tool.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                            tool.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            tool.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            tool.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                          }`}>
                            {tool.riskLevel} Risk
                          </span>
                        </div>

                        <span className="text-[9px] text-neutral-500 font-mono">ID: {tool.id}</span>
                      </div>

                      {/* Tool description & Name */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold font-sans text-white">{tool.name}</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">{tool.description}</p>
                      </div>

                      {/* Technical constraints */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-neutral-950/40 border border-neutral-900 rounded-xl p-3">
                        <div className="space-y-1">
                          <div className="text-neutral-500">Owner Role:</div>
                          <div className="text-neutral-300 font-semibold flex items-center gap-1.5">
                            <User className="w-3 h-3 text-cyan-400" />
                            {tool.requiredRole}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-neutral-500">Rollback Status:</div>
                          <div className="text-neutral-300 font-semibold flex items-center gap-1.5">
                            {tool.rollbackSupport ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <Undo2 className="w-3 h-3" /> Enabled
                              </span>
                            ) : (
                              <span className="text-neutral-500">Not Supported</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Accordion representation of Schema Inputs / Outputs */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Input Parameter Scheme:</div>
                        <pre className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-900 text-[10px] text-cyan-300 font-mono overflow-x-auto">
                          {tool.inputSchema}
                        </pre>
                      </div>

                    </div>

                    {/* Footer metrics / cost estimation */}
                    <div className="border-t border-neutral-800/60 pt-3 mt-3 grid grid-cols-4 gap-2 font-mono text-[9px] text-neutral-500 text-center">
                      <div className="text-left">
                        <div>Avg Delay</div>
                        <span className="text-neutral-300 font-bold">{tool.avgDurationMs}ms</span>
                      </div>
                      <div>
                        <div>Timeout SLA</div>
                        <span className="text-neutral-300 font-bold">{tool.timeoutMs}ms</span>
                      </div>
                      <div>
                        <div>Token Weight</div>
                        <span className="text-indigo-400 font-bold">{tool.tokenCost} units</span>
                      </div>
                      <div className="text-right">
                        <div>SLA Retries</div>
                        <span className="text-neutral-300 font-bold">{tool.retryCount} Max</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 2: INTERACTIVE BROKER SANDBOX
              ========================================== */}
          {activeSubTab === 'broker' && (
            <motion.div
              key="broker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* LEFT CONTROL PANEL */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Tool Broker Sandbox
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Select an Agent and simulate parameter routing, validation pipelines, and secure executions.</p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {/* Select Agent */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">1. REQUESTING AGENT ORIGIN</label>
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none"
                    >
                      <option value="AI Recruiter">AI Recruiter</option>
                      <option value="AI Career Coach">AI Career Coach</option>
                      <option value="AI Project Manager">AI Project Manager</option>
                      <option value="AI Fraud Detector">AI Fraud Detector</option>
                      <option value="AI Communication Assistant">AI Communication Assistant</option>
                    </select>
                  </div>

                  {/* Select Tool Target */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">2. REGISTERED TARGET TOOL</label>
                    <select
                      value={selectedToolId}
                      onChange={(e) => setSelectedToolId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none"
                    >
                      {tools.map(tool => (
                        <option key={tool.id} value={tool.id}>
                          {tool.name} [{tool.riskLevel} Risk]
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Param JSON Input */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-bold">3. PARAMETER PAYLOAD (JSON)</label>
                    <textarea
                      value={sandboxParams}
                      onChange={(e) => setSandboxParams(e.target.value)}
                      rows={5}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                      placeholder="e.g. { ... }"
                    />
                  </div>

                  {/* Trigger Call Button */}
                  <button
                    onClick={triggerSandboxExecution}
                    disabled={sandboxRunning}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-40 text-white rounded-xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {sandboxRunning ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    EXECUTE TOOL PIPELINE
                  </button>
                </div>
              </div>

              {/* RIGHT LIVE CONSOLE LOGS & OUTPUT */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* PIPELINE PROGRESS BAR */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between flex-1">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-neutral-300 font-mono">Live Execution Pipeline Ledger</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Status: <span className={`font-bold ${
                        sandboxStatus === 'success' ? 'text-emerald-400' :
                        sandboxStatus === 'failed' ? 'text-rose-400' :
                        sandboxStatus === 'needs_approval' ? 'text-amber-400' :
                        sandboxStatus === 'running' ? 'text-cyan-400 animate-pulse' :
                        'text-neutral-500'
                      }`}>{sandboxStatus.toUpperCase()}</span></span>
                    </div>

                    {/* CLI-Like Output terminal */}
                    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[10px] leading-relaxed space-y-2.5 max-h-[220px] overflow-y-auto min-h-[160px]">
                      {sandboxLog.length === 0 ? (
                        <div className="text-neutral-600 italic">Broker idle. Configure parameters on the left and click 'EXECUTE' to start telemetry routing.</div>
                      ) : (
                        sandboxLog.map((line, idx) => (
                          <div key={idx} className={`${
                            line.includes('❌') ? 'text-rose-400' :
                            line.includes('✅') ? 'text-emerald-400' :
                            line.includes('⚠️') ? 'text-yellow-400' :
                            line.includes('🔑') ? 'text-indigo-400' :
                            'text-neutral-300'
                          }`}>
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sandbox Result Output JSON */}
                  {sandboxResultJson && (
                    <div className="mt-4 space-y-2">
                      <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Sanitized Return Payload:</div>
                      <pre className="p-3 bg-neutral-950/80 border border-neutral-900 rounded-xl text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-[140px]">
                        {sandboxResultJson}
                      </pre>
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 3: QUEUES & APPROVALS
              ========================================== */}
          {activeSubTab === 'queues' && (
            <motion.div
              key="queues"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* HUMAN APPROVAL BOARD (Spec requirement) */}
                <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Pending Human Approvals Gateway
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Sensitive, mass communication, or high-risk administrative operations require direct moderator verification.</p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {executions.filter(e => e.status === 'Pending Approval').length === 0 ? (
                      <div className="p-8 bg-neutral-950/30 border border-neutral-900 rounded-xl text-center text-neutral-500">
                        <CheckCircle className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        No actions currently held in the approval gate. All pipelines clear.
                      </div>
                    ) : (
                      executions.filter(e => e.status === 'Pending Approval').map(exe => (
                        <div key={exe.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold">
                                RISK: {exe.riskLevel}
                              </span>
                              <span className="text-neutral-500">{exe.id}</span>
                            </div>
                            <span className="text-neutral-400">{exe.timestamp.substring(11, 19)}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs font-bold text-white font-sans">{exe.toolName}</div>
                            <div className="text-[10px] text-neutral-400 font-sans">Dispatched by: <span className="text-cyan-400">{exe.agent}</span></div>
                          </div>

                          <div className="bg-neutral-900 p-2.5 rounded-lg text-[9px] text-cyan-300 overflow-x-auto max-h-[80px]">
                            {exe.parameters}
                          </div>

                          {/* Approval buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveTask(exe.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold tracking-tight transition-all flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve Action
                            </button>
                            <button
                              onClick={() => {
                                setExecutions(prev => prev.filter(p => p.id !== exe.id));
                                setPendingApprovalCounter(p => Math.max(0, p - 1));
                              }}
                              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg text-[10px] font-bold tracking-tight transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Deny / Discard
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* DYNAMIC PRIORITY TASK QUEUES */}
                <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-cyan-400" />
                      Priority Async Tasks Queue
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Live background execution queue for asynchronous distributed tool processing workers.</p>
                  </div>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    {queue.map(item => (
                      <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-900 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              item.priority === 'Critical' ? 'bg-rose-500 animate-ping' :
                              item.priority === 'High' ? 'bg-orange-400' :
                              'bg-cyan-500'
                            }`} />
                            <span className="font-bold text-white text-xs font-sans">{item.toolName}</span>
                          </div>
                          <div className="text-neutral-500">Disp: {item.agent} | Queue ID: {item.id}</div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            item.status === 'Retrying' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-neutral-900 text-neutral-400'
                          }`}>
                            {item.status} {item.retryAttempt > 0 ? `(Attempt ${item.retryAttempt})` : ''}
                          </span>
                          <div className="text-neutral-600">{item.timestamp.substring(11, 19)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RECENT EXECUTIONS HISTORY LOG TABLE */}
              <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">Platform Tool Calling Ledger</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Immutable global trace logs audit record for every tool invocation on the system.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800/60 text-neutral-500 text-[10px] pb-2">
                        <th className="py-2">Execution ID</th>
                        <th>Target Tool</th>
                        <th>Invoked By</th>
                        <th>Duration</th>
                        <th>SLA Status</th>
                        <th>Rollback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {executions.map(exe => (
                        <tr key={exe.id} className="text-[11px] hover:bg-neutral-900/20">
                          <td className="py-3 font-semibold text-neutral-400">{exe.id}</td>
                          <td className="font-sans font-bold text-white">{exe.toolName}</td>
                          <td className="text-cyan-400">{exe.agent}</td>
                          <td>{exe.durationMs > 0 ? `${exe.durationMs}ms` : 'SLA Hold'}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                              exe.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                              exe.status === 'Failed' ? 'bg-rose-500/10 text-rose-400' :
                              exe.status === 'Rolled Back' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              'bg-amber-500/10 text-amber-400 animate-pulse'
                            }`}>
                              {exe.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {exe.rollbackExecuted ? (
                              <span className="text-indigo-400 flex items-center gap-1">
                                <Undo2 className="w-3.5 h-3.5" /> REVERTED
                              </span>
                            ) : (
                              <button
                                onClick={() => handleRollbackTask(exe.id)}
                                className="text-neutral-500 hover:text-white underline"
                              >
                                Trigger Rollback
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* ==========================================
              TAB 4: TELEMETRY & OBSERVABILITY METRICS
              ========================================== */}
          {activeSubTab === 'observability' && (
            <motion.div
              key="observability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CALL LATENCY TREND CHART */}
                <div className="lg:col-span-8 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white font-sans">Global Tool Calls Throughput & Latency Trend</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={METRICS_TIMELINE}>
                        <defs>
                          <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#737373" fontSize={10} tickLine={false} />
                        <YAxis stroke="#737373" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                        <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="calls" stroke="#06b6d4" fillOpacity={1} fill="url(#callsGrad)" name="Call Volume" />
                        <Line type="monotone" dataKey="avgLatency" stroke="#8b5cf6" name="Latency (ms)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CATEGORY VOLUME PIE CHART */}
                <div className="lg:col-span-4 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white font-sans">API Category Distribution</h3>
                  <div className="h-[210px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CATEGORY_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {CATEGORY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                    {CATEGORY_DISTRIBUTION.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-neutral-400 truncate">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 5: WAF & SECURITY FILTERS
              ========================================== */}
          {activeSubTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ACTIVE SECURITY GUARDIAN POLICIES */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-5">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Active Security Filters Configuration
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Configure live threat boundaries, input parameter hygiene controls, and safety metrics.</p>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    
                    {/* Rate limit Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Throughput Rate Limiting Constraint:</span>
                        <span className="text-cyan-400 font-bold">{rateLimitPerMin}/min</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={rateLimitPerMin}
                        onChange={(e) => setRateLimitPerMin(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Prompt injection toggle */}
                    <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                      <div className="space-y-1 pr-6">
                        <div className="text-neutral-200 font-bold font-sans">Prompt Injection Detector (WAF)</div>
                        <div className="text-[10px] text-neutral-500">Intercepts instructions attempting to escape declarative JSON formats or bypass business policies.</div>
                      </div>
                      <button
                        onClick={() => setPromptInjectionDetectorEnabled(!promptInjectionDetectorEnabled)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-all duration-300 flex items-center ${promptInjectionDetectorEnabled ? 'bg-cyan-600 justify-end' : 'bg-neutral-800 justify-start'}`}
                      >
                        <span className="w-5.5 h-5.5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* PII Masking toggle */}
                    <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                      <div className="space-y-1 pr-6">
                        <div className="text-neutral-200 font-bold font-sans">Dynamic Output PII Stripping Filter</div>
                        <div className="text-[10px] text-neutral-500">Secures outbound logs and results by automatically scrubbing student contact metrics, emails, and credentials.</div>
                      </div>
                      <button
                        onClick={() => setOutputPIIStrippingEnabled(!outputPIIStrippingEnabled)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-all duration-300 flex items-center ${outputPIIStrippingEnabled ? 'bg-cyan-600 justify-end' : 'bg-neutral-800 justify-start'}`}
                      >
                        <span className="w-5.5 h-5.5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>

                  </div>
                </div>

                {/* CONTEXT-DEPENDENT SECURITY RULES */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white font-sans">Security Shield & Compliance Benchmarks</h3>
                  <p className="text-xs text-neutral-400">Under Spec 3.0, the Tool Calling Engine guarantees high security via these rules:</p>
                  
                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-3 bg-neutral-950/60 border border-neutral-900 rounded-xl flex items-start gap-3">
                      <Lock className="w-4 h-4 text-cyan-400 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-neutral-200 font-mono">Zero Database Direct Sockets</div>
                        <p className="text-neutral-400 text-[11px]">Database engines are completely blocked off from accepting raw SQL requests from agent layers to prevent dangerous structural manipulation.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-950/60 border border-neutral-900 rounded-xl flex items-start gap-3">
                      <ShieldAlert className="w-4 h-4 text-orange-400 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-neutral-200 font-mono">Risk Level Isolation (RBAC & Approval)</div>
                        <p className="text-neutral-400 text-[11px]">Critical and High risk level tools remain locked within an authorization container until an authorized super moderator validates and releases the payload manually.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-950/60 border border-neutral-900 rounded-xl flex items-start gap-3">
                      <History className="w-4 h-4 text-indigo-400 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-neutral-200 font-mono">Blockchain-Style Auditing</div>
                        <p className="text-neutral-400 text-[11px]">Once written, execution ledger records are immutable and can never be updated, deleted, or cleared by any platform user or rogue agent processes.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 6: COMPLIANCE TEST SUITES
              ========================================== */}
          {activeSubTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">Spec 3.0 Platform Verification Testing Suite</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Run automated sanity checks confirming transaction security, rollbacks, and prompt injection defenses.</p>
                  </div>

                  <button
                    onClick={triggerTestSuite}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> Run Automated Tests
                  </button>
                </div>

                <div className="space-y-3.5 font-mono text-xs">
                  {!testsRun ? (
                    <div className="p-8 text-center text-neutral-500 bg-neutral-950/20 border border-neutral-900 rounded-2xl">
                      <Cpu className="w-10 h-10 text-neutral-700 mx-auto mb-2.5 animate-bounce" />
                      Click "Run Automated Tests" above to verify integration code blocks.
                    </div>
                  ) : (
                    testSuiteLogs.map(log => (
                      <div key={log.id} className="p-4 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-neutral-400">{log.id}: {log.name}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {log.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 font-sans leading-relaxed">{log.output}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 7: DATABASE & API SCHEMAS (BLUEPRINTS)
              ========================================== */}
          {activeSubTab === 'blueprints' && (
            <motion.div
              key="blueprints"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* SCHEMA CODE SELECTION */}
              <div className="lg:col-span-6 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Relational PostgreSQL Schema Blueprints
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Database definitions for registering tools, active task execution queues, and SLA retry telemetry metrics.</p>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
                  {[
                    { id: 'tool_registry', label: 'tool_registry (DDL)' },
                    { id: 'tool_executions', label: 'tool_executions' },
                    { id: 'execution_queue', label: 'execution_queue' },
                    { id: 'rollback_history', label: 'rollback_history' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedSchemaTable(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${selectedSchemaTable === tab.id ? 'bg-neutral-800 text-cyan-300 border border-neutral-700/50' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <pre className="p-4 bg-neutral-950 text-[10px] font-mono text-cyan-400 leading-relaxed rounded-xl border border-neutral-900 overflow-x-auto h-[300px]">
                  {selectedSchemaTable === 'tool_registry' && `CREATE TABLE tool_registry (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    owner_role VARCHAR(128) NOT NULL,
    input_schema JSONB NOT NULL,
    output_schema JSONB NOT NULL,
    risk_level VARCHAR(32) DEFAULT 'Low',
    timeout_ms INTEGER DEFAULT 3000,
    retry_count INT DEFAULT 3,
    rollback_supported BOOLEAN DEFAULT TRUE,
    version VARCHAR(32) DEFAULT '1.0.0',
    requires_human_approval BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}

                  {selectedSchemaTable === 'tool_executions' && `CREATE TABLE tool_executions (
    execution_id VARCHAR(64) PRIMARY KEY,
    tool_id VARCHAR(64) REFERENCES tool_registry(id),
    invoking_agent VARCHAR(128) NOT NULL,
    parameters JSONB NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'Completed', 'Failed', 'Pending Approval'
    duration_ms INT DEFAULT 0,
    error_message TEXT,
    approved_by VARCHAR(128),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(256) NOT NULL
);`}

                  {selectedSchemaTable === 'execution_queue' && `CREATE TABLE execution_queue (
    queue_id VARCHAR(64) PRIMARY KEY,
    tool_id VARCHAR(64) REFERENCES tool_registry(id),
    priority VARCHAR(32) DEFAULT 'Medium',
    payload JSONB NOT NULL,
    retry_attempt INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'Pending',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);`}

                  {selectedSchemaTable === 'rollback_history' && `CREATE TABLE rollback_history (
    rollback_id VARCHAR(64) PRIMARY KEY,
    execution_id VARCHAR(64) REFERENCES tool_executions(execution_id),
    rollback_action TEXT NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'Success', 'Failed'
    initiated_by VARCHAR(128) NOT NULL,
    reverted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>

              {/* API ENDPOINTS SELECTION */}
              <div className="lg:col-span-6 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    REST API Request & Response Blueprints
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Secure endpoint routes implemented inside the backend Tool Calling Gateway controller.</p>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
                  {[
                    { id: 'POST /api/tools/execute', label: 'POST /api/tools/execute' },
                    { id: 'POST /api/tools/approve', label: 'POST /api/tools/approve' },
                    { id: 'POST /api/tools/rollback', label: 'POST /api/tools/rollback' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedApiEndpoint(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${selectedApiEndpoint === tab.id ? 'bg-neutral-800 text-cyan-300 border border-neutral-700/50' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <pre className="p-4 bg-neutral-950 text-[10px] font-mono text-cyan-400 leading-relaxed rounded-xl border border-neutral-900 overflow-x-auto h-[300px]">
                  {selectedApiEndpoint === 'POST /api/tools/execute' && `// ROUTE: POST /api/tools/execute
// Access: Bearer Token JWT check, RBAC permissions check
REQUEST:
{
  "toolId": "TOOL-GENERATE-MATCHING",
  "agentOrigin": "AI Recruiter",
  "params": {
    "projectId": "PROJ-2026-X8",
    "topK": 5
  }
}

RESPONSE (Completed Directly):
{
  "status": "Success",
  "executionId": "EXE-TOOL-09103",
  "durationMs": 980,
  "payload": {
    "matches": [
      { "studentId": "STUD-8812", "score": 0.96 }
    ]
  }
}

RESPONSE (Approval Required):
{
  "status": "Pending Approval",
  "executionId": "EXE-TOOL-09102",
  "message": "Action on high-risk tool is held in queue until Super Administrator approval."
}`}

                  {selectedApiEndpoint === 'POST /api/tools/approve' && `// ROUTE: POST /api/tools/approve
// Access: Super Administrator Role Credentials only
REQUEST:
{
  "executionId": "EXE-TOOL-09102",
  "action": "APPROVE | DENY"
}

RESPONSE:
{
  "success": true,
  "executionId": "EXE-TOOL-09102",
  "status": "Completed",
  "durationMs": 142,
  "committedAt": "2026-07-04T20:36:12Z"
}`}

                  {selectedApiEndpoint === 'POST /api/tools/rollback' && `// ROUTE: POST /api/tools/rollback
// Access: Admin or System Core Fail-Safe handler
REQUEST:
{
  "executionId": "EXE-TOOL-09104",
  "reason": "Outbound PostgreSQL transaction failed downstream."
}

RESPONSE:
{
  "success": true,
  "rollbackId": "ROL-77112",
  "revertedStateKeys": ["student_profiles.status"],
  "revertTimestamp": "2026-07-04T20:36:15Z"
}`}
                </pre>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
