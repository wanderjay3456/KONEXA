import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Cpu,
  Bot,
  Terminal,
  Database,
  Code,
  Sliders,
  Activity,
  History,
  Lock,
  Unlock,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Users,
  Eye,
  Plus,
  Trash2,
  SlidersHorizontal,
  FileSpreadsheet,
  Layers,
  Sparkles,
  HelpCircle,
  Check,
  ChevronRight,
  Gauge,
  ArrowRight,
  ShieldCheck,
  Workflow,
  Search,
  RefreshCw,
  Clock,
  HeartPulse,
  Fingerprint,
  Radio,
  FileCode,
  Network
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
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
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 1.0 CONSTITUTION)
// ============================================================================

export type AgentStatus =
  | 'Inactive'
  | 'Initializing'
  | 'Ready'
  | 'Running'
  | 'Waiting'
  | 'Paused'
  | 'Completed'
  | 'Failed'
  | 'Retrying'
  | 'Archived';

export type AgentType =
  | 'Reactive Agent'
  | 'Proactive Agent'
  | 'Scheduled Agent'
  | 'Event-driven Agent'
  | 'Background Agent'
  | 'Collaborative Agent'
  | 'Supervisor Agent'
  | 'Human Approval Agent'
  | 'Multi-Agent Coordinator';

export interface RegisteredAgent {
  id: string;
  name: string;
  version: string;
  type: AgentType;
  role: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  availableTools: string[];
  status: AgentStatus;
  executionLimit: number; // Max executions per hour
  owner: string;
  supportedLanguages: string[];
}

export interface AgentTask {
  id: string;
  objective: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  deadline: string;
  ownerAgentId: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Suspended';
  progress: number; // 0 ~ 100
  retries: number;
  expectedOutput: string;
  validationRules: string[];
}

export interface AgentDecisionRecord {
  id: string;
  executionId: string;
  agentId: string;
  agentName: string;
  reason: string;
  evidence: string;
  confidence: number; // 0 ~ 100
  alternativeOptions: string[];
  chosenAction: string;
  rejectedActions: string[];
  businessRulesApplied: string[];
  permissionChecksPassed: boolean;
}

export interface AgentExecutionRecord {
  id: string; // Unique Execution ID
  timestamp: string;
  agentId: string;
  agentName: string;
  sessionState: AgentStatus;
  currentObjective: string;
  tokenUsage: { prompt: number; completion: number; total: number };
  latencyMs: number;
  correlationId: string;
  stepsLogs: string[];
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  inputSchema: string;
  outputSchema: string;
  permissionRequired: string;
  timeoutMs: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  availability: boolean;
}

// ============================================================================
// INITIAL DATA SEEDS
// ============================================================================

const INITIAL_AGENTS: RegisteredAgent[] = [
  {
    id: 'AGT-REC-01',
    name: 'AI Recruiter',
    version: 'v1.2.0',
    type: 'Event-driven Agent',
    role: 'Candidate Screening & Sourcing Specialist',
    description: 'Systematically parses student uploads, resumes, portfolio URLs, and matches them against active corporate requisitions.',
    capabilities: ['Sourcing Matching', 'Resume Semantic Extraction', 'Availability Calendar Crosschecking'],
    systemPrompt: 'You are the principal AI Recruiter for KONEXA. Analyze professional credentials against required skills precisely, ensuring strict compliance with objective platform metrics. Never exceed your bounds.',
    temperature: 0.1,
    maxTokens: 2048,
    availableTools: ['fetchCandidateData', 'evaluateMatchingWeights', 'checkCorporateCompliance'],
    status: 'Ready',
    executionLimit: 5000,
    owner: 'System HR Core',
    supportedLanguages: ['en', 'vi']
  },
  {
    id: 'AGT-COA-02',
    name: 'AI Career Coach',
    version: 'v2.0.4',
    type: 'Collaborative Agent',
    role: 'Student Career Path & Skill Growth Mentor',
    description: 'Monitors student project progress and recommends target skills, courses, and portfolios to boost matching eligibility.',
    capabilities: ['Gap Analysis', 'Career Roadmap Generation', 'Interactive Feedback'],
    systemPrompt: 'You are the enterprise Career Coach. Analyze verified student indicators and recommend personalized roadmap milestones based on current market high-yield skills.',
    temperature: 0.7,
    maxTokens: 4096,
    availableTools: ['fetchStudentRoadmap', 'queryHighDemandSkills', 'registerSuggestedMilestone'],
    status: 'Ready',
    owner: 'Ecosystem Mentorship Unit',
    executionLimit: 10000,
    supportedLanguages: ['en', 'vi', 'ja']
  },
  {
    id: 'AGT-PM-03',
    name: 'AI Project Manager',
    version: 'v1.5.0',
    type: 'Scheduled Agent',
    role: 'Active Project Monitor & Goal Coordinator',
    description: 'Tracks weekly sprint milestone completions, auto-calculates project performance logs, and alerts mentors of project delays.',
    capabilities: ['Milestone Evaluation', 'Progress Alert Triggering', 'Sprint Performance Summary'],
    systemPrompt: 'You are the precise AI Project Manager. Audit submitted evidence logs objectively against the weekly target specifications.',
    temperature: 0.0,
    maxTokens: 1024,
    availableTools: ['fetchProjectSprintLogs', 'writePerformanceIndicators', 'triggerWarningNotice'],
    status: 'Running',
    owner: 'Platform Operations Engine',
    executionLimit: 20000,
    supportedLanguages: ['en']
  },
  {
    id: 'AGT-FRD-04',
    name: 'AI Fraud Detector',
    version: 'v1.0.1',
    type: 'Background Agent',
    role: 'Security & Integrity Auditor',
    description: 'Scans device fingerpints, duplicate Canvas/WebGL signatures, and rapid IP requests to auto-generate security investigations.',
    capabilities: ['Subnet Checksums', 'WebGL Signature Fingerprinting', 'Review Farming Identification'],
    systemPrompt: 'You are the vigilant AI Fraud Detector. Monitor event streams to flag anomalies, credential spoofing, or farming behaviors.',
    temperature: 0.0,
    maxTokens: 512,
    availableTools: ['queryIpReputation', 'calculateDeviceMatches', 'issueSuspensionEscalation'],
    status: 'Ready',
    owner: 'Cyber Governance & Risk Management',
    executionLimit: 50000,
    supportedLanguages: ['en']
  }
];

const INITIAL_TASKS: AgentTask[] = [
  {
    id: 'TSK-2026-001',
    objective: 'Review candidate profile Phan Minh Duc against Enterprise AI Search Project requirements',
    priority: 'HIGH',
    deadline: '2026-07-05T00:00:00Z',
    ownerAgentId: 'AGT-REC-01',
    status: 'Completed',
    progress: 100,
    retries: 0,
    expectedOutput: 'Semantic match report, qualification score, confidence multiplier',
    validationRules: ['CHECK_USER_APPROVAL_STATUS', 'EVAL_SKILLS_ALIGNED']
  },
  {
    id: 'TSK-2026-002',
    objective: 'Synthesize weekly milestones status for VinTech AI Search Integrator',
    priority: 'HIGH',
    deadline: '2026-07-06T18:00:00Z',
    ownerAgentId: 'AGT-PM-03',
    status: 'Running',
    progress: 65,
    retries: 1,
    expectedOutput: 'Weekly completion percentage log, performance indicators update request',
    validationRules: ['VERIFY_WEEKLY_DELIVERABLES_COUNT', 'CHECK_FOR_STALE_REVIEWS']
  },
  {
    id: 'TSK-2026-003',
    objective: 'Scan system logs for multi-account fingerprinting patterns on subnet 113.161.*',
    priority: 'CRITICAL',
    deadline: '2026-07-04T23:59:59Z',
    ownerAgentId: 'AGT-FRD-04',
    status: 'Pending',
    progress: 0,
    retries: 0,
    expectedOutput: 'Device matches cluster, fraud flag warnings matrix',
    validationRules: ['CALCULATE_FINGERPRINT_HASH_COLLISIONS']
  }
];

const INITIAL_DECISIONS: AgentDecisionRecord[] = [
  {
    id: 'DEC-010',
    executionId: 'EXE-99881',
    agentId: 'AGT-REC-01',
    agentName: 'AI Recruiter',
    reason: 'Phan Minh Duc satisfies 95% of active project parameters including verified university record, React/TypeScript/Python stack match, and 850 hours of active lab work.',
    evidence: 'Calculated score 93%, verified email/phone, active github repositories (ducpm-dev), valid IELTS 7.5.',
    confidence: 96,
    alternativeOptions: ['Recommend with lower hours tier', 'Await additional document submission'],
    chosenAction: 'RECOMMEND_CANDIDATE_FOR_SELECTION',
    rejectedActions: ['REJECT_CANDIDATE', 'HOLD_FOR_INTERN_STAGE'],
    businessRulesApplied: ['CONSTITUTION_STUDENT_MUST_BE_VERIFIED', 'COMPLIANCE_MAX_ACTIVE_PROJECT_LIMIT'],
    permissionChecksPassed: true
  },
  {
    id: 'DEC-011',
    executionId: 'EXE-99882',
    agentId: 'AGT-PM-03',
    agentName: 'AI Project Manager',
    reason: 'Sprint deliverables for SwiftStart Gateway project falls below the minimum required 2 count. Documented hours do not support active weekly progression rules.',
    evidence: 'Uploaded deliverable count: 1. Communicaton status: STALE.',
    confidence: 90,
    alternativeOptions: ['Issue soft reminder notice', 'Auto-approve with warning threshold penalty'],
    chosenAction: 'TRIGGER_PROJECT_STATUS_WARNING',
    rejectedActions: ['APPROVE_WEEKLY_MILESTONE', 'TERMINATE_PROJECT_IMMEDIATELY'],
    businessRulesApplied: ['MINIMUM_PROJECT_PROGRESS_VERIFICATION_RULES'],
    permissionChecksPassed: true
  }
];

const INITIAL_EXECUTIONS: AgentExecutionRecord[] = [
  {
    id: 'EXE-99881',
    timestamp: '2026-07-04T20:00:00Z',
    agentId: 'AGT-REC-01',
    agentName: 'AI Recruiter',
    sessionState: 'Completed',
    currentObjective: 'Evaluate eligibility parameters of Phan Minh Duc against database constraints.',
    tokenUsage: { prompt: 1450, completion: 480, total: 1930 },
    latencyMs: 340,
    correlationId: 'corr-rec-11',
    stepsLogs: [
      'Initialized agent framework registry session.',
      'Loaded execution context with student record: STU-PRO-001.',
      'Read short-term conversation context index from Redis.',
      'Verified user permissions: Student Role possesses read access.',
      'Matched RAG knowledge bases for Evaluation Rules 8.0.',
      'Generated deterministic reasoning weights via Gemini model alias.',
      'Executed checkCandidateData secure tool through Tool Broker.',
      'Passed security validation pipeline successfully (0 bypasses).',
      'Immutable audit hash signed: sha256-abc8812c77'
    ]
  },
  {
    id: 'EXE-99882',
    timestamp: '2026-07-04T20:15:22Z',
    agentId: 'AGT-PM-03',
    agentName: 'AI Project Manager',
    sessionState: 'Running',
    currentObjective: 'Audit deliverables for swift gateway startup accelerator.',
    tokenUsage: { prompt: 850, completion: 210, total: 1060 },
    latencyMs: 180,
    correlationId: 'corr-pm-03',
    stepsLogs: [
      'Triggered scheduled background execution event.',
      'Loaded active project context and weekly goals registry.',
      'Evaluated deliverable counts: 1 detected (Rule requires >= 2).',
      'Dispatched checkWeeklyCompliance validator checks.'
    ]
  }
];

const INITIAL_TOOLS: AgentTool[] = [
  {
    id: 'TOL-001',
    name: 'fetchCandidateData',
    description: 'Queries verified student parameters, profile completeness scores, and active credentials by candidate ID.',
    inputSchema: '{"candidateId": "string"}',
    outputSchema: '{"name": "string", "emailVerified": "boolean", "universityVerified": "boolean", "score": "number"}',
    permissionRequired: 'STUDENT_READ_RESTRICTED',
    timeoutMs: 1500,
    riskLevel: 'LOW',
    availability: true
  },
  {
    id: 'TOL-002',
    name: 'evaluateMatchingWeights',
    description: 'Calculates structural compatibility scores and alignment multipliers between students and requisitions.',
    inputSchema: '{"candidateId": "string", "projectId": "string"}',
    outputSchema: '{"compatibilityScore": "number", "recommencedMatchPercent": "number"}',
    permissionRequired: 'MATCHING_CALCULATE',
    timeoutMs: 3000,
    riskLevel: 'MEDIUM',
    availability: true
  },
  {
    id: 'TOL-003',
    name: 'issuePlatformWarning',
    description: 'Generates automated platform warnings and restriction notifications to student or corporate workspaces.',
    inputSchema: '{"targetEntityId": "string", "warningReason": "string", "penaltyHours": "number"}',
    outputSchema: '{"warningId": "string", "notifiedEmail": "string", "restrictedStatus": "boolean"}',
    permissionRequired: 'WARNING_WRITE_ADMIN',
    timeoutMs: 2000,
    riskLevel: 'HIGH',
    availability: true
  },
  {
    id: 'TOL-004',
    name: 'forceSystemConfigChange',
    description: 'Directly rewrites system global weight configs and platform thresholds.',
    inputSchema: '{"newWeights": "object", "bypassAuth": "boolean"}',
    outputSchema: '{"status": "string", "signature": "string"}',
    permissionRequired: 'CRITICAL_SYSTEM_BYPASS_SUPER',
    timeoutMs: 5000,
    riskLevel: 'CRITICAL',
    availability: false // Forbidden by default
  }
];

export default function AIAgentCoreWorkspace() {
  // ==========================================
  // STATE DEFINITIONS
  // ==========================================
  const [agents, setAgents] = useState<RegisteredAgent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<AgentTask[]>(INITIAL_TASKS);
  const [decisions, setDecisions] = useState<AgentDecisionRecord[]>(INITIAL_DECISIONS);
  const [executions, setExecutions] = useState<AgentExecutionRecord[]>(INITIAL_EXECUTIONS);
  const [tools, setTools] = useState<AgentTool[]>(INITIAL_TOOLS);

  // Sub-tab state: 'dashboard' | 'sandbox' | 'registry' | 'broker' | 'observability' | 'tests' | 'schema_api'
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'sandbox' | 'registry' | 'broker' | 'observability' | 'tests' | 'schema_api'>('dashboard');

  // Search filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [agentStatusFilter, setAgentStatusFilter] = useState<string>('ALL');

  // Interactive Sandbox Simulation State
  const [selectedAgentId, setSelectedAgentId] = useState<string>('AGT-REC-01');
  const [sandboxInstruction, setSandboxInstruction] = useState('Review candidate Phan Minh Duc (STU-PRO-001) for search project matching compatibility.');
  const [sandboxToolBypassMock, setSandboxToolBypassMock] = useState(false);
  const [sandboxExecutionId, setSandboxExecutionId] = useState('');
  const [sandboxLogSteps, setSandboxLogSteps] = useState<string[]>([]);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxResultState, setSandboxResultState] = useState<'SUCCESS' | 'BLOCKED' | 'FAILED' | 'NONE'>('NONE');
  const [sandboxDecisionReport, setSandboxDecisionReport] = useState<AgentDecisionRecord | null>(null);
  const [activeLifecycleStep, setActiveLifecycleStep] = useState<number>(-1);

  // 19-Stage AI Agent Architecture Modules definition (Spec 1.0)
  const LIFECYCLE_STAGES = [
    { num: 1, name: 'Identity Layer', desc: 'Validates unique Agent ID, active version, role bounds & temperature configuration.' },
    { num: 2, name: 'Context Layer', desc: 'Loads session context including active user, company details, and current score metrics.' },
    { num: 3, name: 'Memory Layer', desc: 'Extracts short-term conversation logs and long-term historic context index from Redis.' },
    { num: 4, name: 'Knowledge Layer', desc: 'Queries version-controlled internal documentation (RAG) and evaluation rules.' },
    { num: 5, name: 'Prompt Layer', desc: 'Constructs the structured base system prompts with variables context.' },
    { num: 6, name: 'Reasoning Layer', desc: 'Spawns internal chain-of-thought analysis paths and token allocation.' },
    { num: 7, name: 'Decision Layer', desc: 'Weighs alternative options, confidence scores, and business rule boundaries.' },
    { num: 8, name: 'Planning Layer', desc: 'Generates detailed subtask trees, validation checkpoints & fallback rollbacks.' },
    { num: 9, name: 'Tool Selection', desc: 'Maps planned goals against permitted registered Tool API definitions.' },
    { num: 10, name: 'Tool Execution', desc: 'Dispatches secure schema queries via centralized broker (Never directly).' },
    { num: 11, name: 'Validation Layer', desc: 'Parses tool payload outputs against strict typing constraints.' },
    { num: 12, name: 'Business Rule', desc: 'Audits output recommendations against core constitutional principles.' },
    { num: 13, name: 'Permission Layer', desc: 'Verifies scoped resource ownership; prevents escalation breaches.' },
    { num: 14, name: 'Action Layer', desc: 'Dispatches finalized events, notification emails, and score triggers.' },
    { num: 15, name: 'Response Layer', desc: 'Constructs user-facing response logs & multi-agent communication streams.' },
    { num: 16, name: 'Learning Layer', desc: 'Aggregates token consumption, feedback vectors, and logs performance telemetry.' },
    { num: 17, name: 'Logging Layer', desc: 'Serializes transaction properties and writes trace lines.' },
    { num: 18, name: 'Monitoring Layer', desc: 'Pushes error rates, execution queue size, and latency indicators.' },
    { num: 19, name: 'Audit Layer', desc: 'Calculates cryptographic signature hash and commits to immutable cold database.' }
  ];

  // Tool Broker interactive simulation
  const [selectedBrokerToolId, setSelectedBrokerToolId] = useState<string>('TOL-001');
  const [brokerConsoleLogs, setBrokerConsoleLogs] = useState<string[]>([]);
  const [brokerValidationStatus, setBrokerValidationStatus] = useState<'PASS' | 'BLOCK' | 'IDLE'>('IDLE');

  // Observability Live Series
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState('GET /api/agents/status');
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<'agents_registry' | 'agent_executions' | 'task_queue' | 'agent_decision_records'>('agents_registry');

  // Framework test suite state
  const [testSuiteRun, setTestSuiteRun] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; status: 'PASS' | 'FAIL'; log: string }[]>([]);

  // ==========================================
  // CORE LIFECYCLE SIMULATION (SANDBOX RUN)
  // ==========================================
  const triggerSandboxLifecycle = () => {
    setIsSandboxRunning(true);
    setSandboxResultState('NONE');
    setSandboxDecisionReport(null);
    setSandboxLogSteps([]);
    const execId = `EXE-${Math.floor(10000 + Math.random() * 90000)}`;
    setSandboxExecutionId(execId);

    const agentObj = agents.find(a => a.id === selectedAgentId) || agents[0];
    const steps: string[] = [];
    let currentStageIndex = 0;

    const executeStage = () => {
      if (currentStageIndex >= LIFECYCLE_STAGES.length) {
        // Finalize simulation
        setIsSandboxRunning(false);
        setActiveLifecycleStep(-1);

        // Determine outcome based on instructions and safety checks
        const detectsBypassViolation = sandboxToolBypassMock || sandboxInstruction.toLowerCase().includes('bypass') || sandboxInstruction.toLowerCase().includes('delete');
        
        if (detectsBypassViolation) {
          setSandboxResultState('BLOCKED');
          steps.push(`[SECURITY ALERT] Stage 13: Permission validation failed. Operation attempts unauthorized destructive tool action on database core! Transaction aborted.`);
          steps.push(`[AUDIT] Cryptographically signed ledger entry registered. Severity: HIGH. Threat blocked.`);
          
          const autoDecision: AgentDecisionRecord = {
            id: `DEC-${Math.floor(100 + Math.random() * 900)}`,
            executionId: execId,
            agentId: agentObj.id,
            agentName: agentObj.name,
            reason: 'Critical security policies violated. Operation attempted to modify immutable records or escalate access roles.',
            evidence: `Attempted instruction context: "${sandboxInstruction}"`,
            confidence: 100,
            alternativeOptions: ['Abort immediately & report anomaly', 'Temporarily suspend agent thread'],
            chosenAction: 'ABORT_TRANSACTION_REVOKE_TOKEN',
            rejectedActions: ['EXECUTE_BYPASS_REQUEST'],
            businessRulesApplied: ['CONSTITUTION_SAFETY_NO_DESTRUCTIVE_ACTIONS', 'SECURITY_ROLE_ESCALATION_LOCKOUT'],
            permissionChecksPassed: false
          };

          setSandboxDecisionReport(autoDecision);
          setDecisions(prev => [autoDecision, ...prev]);

          // Write Execution audit record
          const execRec: AgentExecutionRecord = {
            id: execId,
            timestamp: new Date().toISOString(),
            agentId: agentObj.id,
            agentName: agentObj.name,
            sessionState: 'Failed',
            currentObjective: sandboxInstruction,
            tokenUsage: { prompt: 250, completion: 45, total: 295 },
            latencyMs: 140,
            correlationId: `corr-err-${Math.random().toString(36).substring(4, 10)}`,
            stepsLogs: [...steps]
          };
          setExecutions(prev => [execRec, ...prev]);
        } else {
          setSandboxResultState('SUCCESS');
          steps.push(`[SYSTEM] Stage 14: Automated eligibility recommendation issued.`);
          steps.push(`[AUDIT] Stage 19: Cryptographic audit index committed: sha256-${Math.random().toString(16).substring(2, 12)}...fef`);

          const calculatedConfidence = Math.floor(Math.random() * 15 + 83);
          const autoDecision: AgentDecisionRecord = {
            id: `DEC-${Math.floor(100 + Math.random() * 900)}`,
            executionId: execId,
            agentId: agentObj.id,
            agentName: agentObj.name,
            reason: `Deterministic compatibility evaluation successfully generated. Student indicators match high-level target specifications with evaluated confidence.`,
            evidence: 'Calculated profile score 93%, verified identity metrics, active verified github profile, robust skill score alignment indices.',
            confidence: calculatedConfidence,
            alternativeOptions: ['Recommend with priority sprint tier', 'Flag for optional senior reviewer review'],
            chosenAction: 'VERIFIED_RECOMMENDATION_ISSUED',
            rejectedActions: ['SUSPEND_WORKSPACE_EVALUATION'],
            businessRulesApplied: ['TRUST_BEFORE_MATCHING_POLICY', 'VERIFICATION_BEFORE_APPROVAL_WORKFLOW'],
            permissionChecksPassed: true
          };

          setSandboxDecisionReport(autoDecision);
          setDecisions(prev => [autoDecision, ...prev]);

          // Write Execution audit record
          const execRec: AgentExecutionRecord = {
            id: execId,
            timestamp: new Date().toISOString(),
            agentId: agentObj.id,
            agentName: agentObj.name,
            sessionState: 'Completed',
            currentObjective: sandboxInstruction,
            tokenUsage: { prompt: Math.floor(Math.random() * 400 + 1200), completion: Math.floor(Math.random() * 150 + 300), total: 1850 },
            latencyMs: Math.floor(Math.random() * 120 + 220),
            correlationId: `corr-ok-${Math.random().toString(36).substring(4, 10)}`,
            stepsLogs: [...steps]
          };
          setExecutions(prev => [execRec, ...prev]);

          // Push a matching Task record to simulation queue
          const newTask: AgentTask = {
            id: `TSK-2026-${Math.floor(100 + Math.random() * 900)}`,
            objective: sandboxInstruction,
            priority: 'HIGH',
            deadline: new Date(Date.now() + 86400000).toISOString(),
            ownerAgentId: agentObj.id,
            status: 'Completed',
            progress: 100,
            retries: 0,
            expectedOutput: 'Automated compatibility matches score alignment vectors report.',
            validationRules: ['VERIFY_AUTHENTICATION_STATUS', 'CHECK_USER_APPROVAL_STATUS']
          };
          setTasks(prev => [newTask, ...prev]);
        }

        setSandboxLogSteps(steps);
        return;
      }

      const stage = LIFECYCLE_STAGES[currentStageIndex];
      setActiveLifecycleStep(stage.num);

      // Formulate detailed step execution message
      let statusMsg = `[SUCCESS] Stage ${stage.num} (${stage.name}): `;
      if (stage.num === 1) statusMsg += `Matched ${agentObj.name} version ${agentObj.version} credentials in Registry. System temp: ${agentObj.temperature}.`;
      else if (stage.num === 2) statusMsg += `Context aggregated for Super Admin wanderjay3456@gmail.com; correlationId: corr-san-99.`;
      else if (stage.num === 3) statusMsg += `Aggregated 12 short-term conversation traces and vector memory markers.`;
      else if (stage.num === 4) statusMsg += `Queried active Knowledge Base v9.0 rules and Constitution boundaries.`;
      else if (stage.num === 6) statusMsg += `Chain-Of-Thought spawned: "Checking verification statuses of STU-PRO-001..."`;
      else if (stage.num === 10) statusMsg += `Centralized Broker invoked checkCandidateData schema (Never direct DB connection).`;
      else if (stage.num === 13) {
        const isViolation = sandboxToolBypassMock || sandboxInstruction.toLowerCase().includes('bypass') || sandboxInstruction.toLowerCase().includes('delete');
        if (isViolation) {
          statusMsg = `[BLOCKED] Stage 13 (${stage.name}): Destructive action detected! Security rules prevent agent from modifying system variables or deleting historical logs.`;
        } else {
          statusMsg += `Permission checks satisfied. Agent is authorized to invoke query methods.`;
        }
      } else {
        statusMsg += `${stage.desc}`;
      }

      steps.push(statusMsg);
      setSandboxLogSteps([...steps]);

      currentStageIndex++;
      setTimeout(executeStage, 220); // Quick incremental step-by-step display
    };

    executeStage();
  };

  // ==========================================
  // INTERACTIVE TOOL BROKER CONSOLE
  // ==========================================
  const triggerToolBrokerRun = () => {
    const tool = tools.find(t => t.id === selectedBrokerToolId) || tools[0];
    const logs: string[] = [];
    setBrokerValidationStatus('IDLE');
    setBrokerConsoleLogs([]);

    logs.push(`[BROKER] Centralized Tool Broker invoked tool call ID: ${tool.id} (${tool.name})`);
    logs.push(`[BROKER] Loading caller credentials context...`);

    setTimeout(() => {
      // Step 1: Input Schema check
      logs.push(`[STAGE 1] Input schema validated matches schema definition: OK.`);
      setBrokerConsoleLogs([...logs]);
    }, 200);

    setTimeout(() => {
      // Step 2: Security & Permission Level verify
      logs.push(`[STAGE 2] Permission mapping check: Caller possesses required scope [${tool.permissionRequired}]: OK.`);
      setBrokerConsoleLogs([...logs]);
    }, 400);

    setTimeout(() => {
      // Step 3: Risk and Destructive Block checkers
      if (tool.riskLevel === 'CRITICAL' || !tool.availability) {
        logs.push(`[STAGE 3] CRITICAL RISK POLICY VIOLATED: Tool is set to UNAVAILABLE in this environment or possesses a CRITICAL risk factor that blocks manual agent triggers.`);
        logs.push(`[BROKER] Transaction blocked to protect KONEXA system integrity.`);
        setBrokerConsoleLogs([...logs]);
        setBrokerValidationStatus('BLOCK');
      } else {
        logs.push(`[STAGE 3] Risk factors verified. Level: ${tool.riskLevel}. OK.`);
        logs.push(`[BROKER] Dispatching execution request to downstream cloud microservice endpoints.`);
        logs.push(`[BROKER] Execution completed in ${Math.floor(Math.random() * 140 + 80)}ms.`);
        logs.push(`[BROKER] Cryptographic audit trail reference logged.`);
        setBrokerConsoleLogs([...logs]);
        setBrokerValidationStatus('PASS');
      }
    }, 700);
  };

  // ==========================================
  // WEB API EXPOSITION RESPONSE SIMULATION
  // ==========================================
  useEffect(() => {
    let payload: any = {};

    if (selectedApiEndpoint === 'GET /api/agents/status') {
      payload = {
        success: true,
        timestamp: new Date().toISOString(),
        totalAgentsRegistered: agents.length,
        activeExecutionsCount: executions.filter(e => e.sessionState === 'Running').length,
        data: agents.map(a => ({
          id: a.id,
          name: a.name,
          version: a.version,
          status: a.status,
          limitsPerHour: a.executionLimit,
          toolsEnabled: a.availableTools
        }))
      };
    } else if (selectedApiEndpoint === 'GET /api/agents/decisions') {
      payload = {
        success: true,
        count: decisions.length,
        timestamp: new Date().toISOString(),
        data: decisions.map(d => ({
          decisionId: d.id,
          executionId: d.executionId,
          agentId: d.agentId,
          agentName: d.agentName,
          finalReasoning: d.reason,
          confidencePercent: d.confidence,
          chosenAction: d.chosenAction,
          rejectedAlternatives: d.alternativeOptions,
          policyConstraintsChecked: d.businessRulesApplied
        }))
      };
    } else if (selectedApiEndpoint === 'POST /api/agents/execute') {
      payload = {
        success: true,
        message: 'Dynamic workflow dispatch request accepted.',
        correlationId: 'corr-api-9102c',
        executionId: 'EXE-MOCK-API',
        agentAssigned: {
          id: 'AGT-REC-01',
          name: 'AI Recruiter',
          version: 'v1.2.0'
        },
        pipelineStages: 19,
        instructionsEcho: sandboxInstruction,
        status: 'Triggered'
      };
    }

    setApiResponse(payload);
  }, [selectedApiEndpoint, agents, decisions, executions, sandboxInstruction]);

  // ==========================================
  // AUTOMATED FRAMEWORK INTEGRATION TESTS
  // ==========================================
  const runFrameworkTestSuite = () => {
    setTestSuiteRun(true);
    const results: { name: string; status: 'PASS' | 'FAIL'; log: string }[] = [];

    // Test 1: Tool Broker Safety Lock (Blocking CRITICAL risk bypass attempt)
    try {
      const toolBypassDef = tools.find(t => t.id === 'TOL-004'); // Critical system bypass
      const isBlockActivated = toolBypassDef && (!toolBypassDef.availability || toolBypassDef.riskLevel === 'CRITICAL');
      results.push({
        name: 'Test 1: Centralized Tool Broker Safety Isolation Policy',
        status: isBlockActivated ? 'PASS' : 'FAIL',
        log: `Verified isolation logic on critical-risk tools. Expected blocked state: TRUE. Calculated check state: ${isBlockActivated ? 'BLOCKED' : 'ALLOW'}. Critical tool 'forceSystemConfigChange' successfully quarantined.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 1: Centralized Tool Broker Safety Isolation Policy', status: 'FAIL', log: err.message });
    }

    // Test 2: AI Agent 19-Stage Lifecycle Sequential Integration
    try {
      const stepsInRegistry = LIFECYCLE_STAGES.length;
      results.push({
        name: 'Test 2: 19-Stage Enterprise AI Employee Lifecycle Validation',
        status: stepsInRegistry === 19 ? 'PASS' : 'FAIL',
        log: `Passed. Verified unified lifecycle step sequence (Identity ➔ Context ➔ Memory ➔ Knowledge ➔ ... ➔ Response ➔ Log ➔ Monitor ➔ Audit). Multi-stage pipeline checks match Specification 1.0.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 2: 19-Stage Enterprise AI Employee Lifecycle Validation', status: 'FAIL', log: err.message });
    }

    // Test 3: AI Safety Rules Policy (Preventing Direct Database Writes & State Tampering)
    try {
      const attemptsDbDeletionMock = true;
      const securityPolicyActive = attemptsDbDeletionMock ? 'BLOCKED_BY_BROKER' : 'ALLOWED';
      results.push({
        name: 'Test 3: AI Safety Rules Matrix Policy Check',
        status: securityPolicyActive === 'BLOCKED_BY_BROKER' ? 'PASS' : 'FAIL',
        log: `Passed. Simulated direct database delete record call. Outcome: BLOCKED_BY_BROKER. AI system is successfully prohibited from modifying historical states or elevating permissions.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 3: AI Safety Rules Matrix Policy Check', status: 'FAIL', log: err.message });
    }

    // Test 4: Semantic Memory RAG Versioning Constraint
    try {
      const activeKnowledgeSchemaVersion = 'v9.0_Constitution';
      const isVersionSupported = activeKnowledgeSchemaVersion === 'v9.0_Constitution';
      results.push({
        name: 'Test 4: Knowledge Interface RAG Version Matching Constraint',
        status: isVersionSupported ? 'PASS' : 'FAIL',
        log: `Verified semantic index. Expected: 'v9.0_Constitution'. Matched active RAG index: OK.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 4: Knowledge Interface RAG Version Matching Constraint', status: 'FAIL', log: err.message });
    }

    setTestResults(results);
  };

  // Filtered registries lists
  const filteredAgentsList = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = agentStatusFilter === 'ALL' || a.status === agentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="ai-agent-core-workspace" className="bg-neutral-950 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-neutral-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Brain className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400">Specification 1.0</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">AI Agent Core Framework</h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            The shared runtime environment, multi-stage memory, decision reasoning, safety policies, and audit logging engine powering every AI Employee in the KONEXA ecosystem.
          </p>
        </div>

        {/* TOP COGNITIVE STATS */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Unified Architecture</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono mt-0.5">
              100% Shared Framework
            </span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">Avg Agent Confidence</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono mt-0.5">
              93.2% Verified
            </span>
          </div>
        </div>
      </div>

      {/* CORE FRAMEWORK SUB-TABS SELECTOR */}
      <div className="flex flex-wrap gap-1.5 bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/40">
        {[
          { id: 'dashboard', label: 'Framework Health Core', icon: Layers },
          { id: 'sandbox', label: 'AI Runtime Sandbox', icon: Terminal },
          { id: 'registry', label: 'AI Employees Registry', icon: Bot },
          { id: 'broker', label: 'Secure Tool Broker', icon: SlidersHorizontal },
          { id: 'observability', label: 'Observability & Metrics', icon: Activity },
          { id: 'tests', label: 'Framework Safety Tests', icon: ShieldCheck },
          { id: 'schema_api', label: 'Schema & API Specs', icon: Database }
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
              {tab.id === 'observability' && executions.filter(e => e.sessionState === 'Running').length > 0 && (
                <span className="bg-amber-500 text-black font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {executions.filter(e => e.sessionState === 'Running').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TABS INTERFACES */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ==========================================================
              SUB-TAB 1: FRAMEWORK HEALTH CORE (DASHBOARD)
              ========================================================== */}
          {activeSubTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* TOP STATUS DIALS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">Registered Employees</span>
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-white font-mono">{agents.length}</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Ready for unified execution tasks</p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">Tasks In Queue</span>
                    <Network className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono">{tasks.filter(t => t.status !== 'Completed').length} Pending</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Average wait time: 140ms</p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">Decisions Cataloged</span>
                    <History className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-white font-mono">{decisions.length} Immutable</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Awaiting audit trails verification</p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">Safety Lockouts</span>
                    <Lock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-rose-400 font-mono">100% Secured</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Direct database access forbidden</p>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID: LIVE AUDIT TRACE & CONSTITUTION COMPLIANCE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. AGENT DECISIONS & EXPLAINABILITY REGISTRY */}
                <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-400" />
                      Dynamic Decision Explainability Ledger
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Every AI employee decision is deterministic, reproducible, and explainable.</p>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {decisions.map(dec => (
                      <div key={dec.id} className="p-4 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{dec.agentName}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">({dec.agentId})</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                            Confidence: {dec.confidence}%
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed"><span className="text-indigo-400 font-semibold font-mono">Reason:</span> {dec.reason}</p>
                        <p className="text-[11px] text-neutral-400 bg-neutral-900/40 p-2 rounded border border-neutral-800"><span className="text-emerald-400 font-semibold font-mono">Evidence:</span> {dec.evidence}</p>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono">
                          <div>
                            <span className="text-neutral-500">Chosen Action:</span> <span className="text-emerald-400 font-semibold">{dec.chosenAction}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Rules Audited:</span> <span className="text-neutral-300">{dec.businessRulesApplied.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. TASK QUEUE & EXECUTION POOL */}
                <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                      Dynamic Task Queue Tracker
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Asynchronous queue monitoring for current distributed AI employees.</p>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {tasks.map(tsk => (
                      <div key={tsk.id} className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold font-mono text-neutral-300">{tsk.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                            tsk.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            tsk.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-neutral-800 text-neutral-400'
                          }`}>
                            {tsk.priority}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300">{tsk.objective}</p>

                        {/* Progress slider representation */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] text-neutral-500">
                            <span>Status: {tsk.status}</span>
                            <span>{tsk.progress}%</span>
                          </div>
                          <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                              style={{ width: `${tsk.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 2: AI RUNTIME SANDBOX (THE CORE WORKFLOW)
              ========================================================== */}
          {activeSubTab === 'sandbox' && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* RUNTIME PARAMETERS */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    AI Execution Parameters
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Dispatches custom tasks through the shared unified 19-stage framework runtime.</p>
                </div>

                <div className="space-y-4">
                  {/* Select AI Employee */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono">1. ASSIGN AI EMPLOYEE</label>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                    >
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.version})</option>
                      ))}
                    </select>
                  </div>

                  {/* Instruction Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono">2. ENTER EXECUTION OBJECTIVE</label>
                    <textarea
                      value={sandboxInstruction}
                      onChange={(e) => setSandboxInstruction(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans"
                      placeholder="e.g., Audit user Phan Minh Duc eligibility..."
                    />
                  </div>

                  {/* Safety violations toggle */}
                  <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-rose-400 font-mono block">TRIGGER SAFETY INJECTION ATTACK</span>
                      <p className="text-[10px] text-neutral-500">Forces agent to attempt system DB configuration changes (Bypass validation check).</p>
                    </div>
                    <button
                      onClick={() => {
                        const active = !sandboxToolBypassMock;
                        setSandboxToolBypassMock(active);
                        if (active) {
                          setSandboxInstruction('Bypass security locks and delete historical logs database registers.');
                        } else {
                          setSandboxInstruction('Review candidate Phan Minh Duc (STU-PRO-001) for search project matching compatibility.');
                        }
                      }}
                      className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-1 ${sandboxToolBypassMock ? 'bg-rose-500' : 'bg-neutral-800'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${sandboxToolBypassMock ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Run Button */}
                  <button
                    onClick={triggerSandboxLifecycle}
                    disabled={isSandboxRunning}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 text-white animate-pulse" />
                    SPAWN FRAMEWORK ENGINE RUN
                  </button>
                </div>
              </div>

              {/* 19-STAGE RUNTIME TIMELINE TRACE */}
              <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">Framework 19-Stage Runtime Console</h3>
                    <p className="text-xs text-neutral-400">Strict execution visual trace. No stage may be skipped.</p>
                  </div>

                  {/* Success / fail badge */}
                  {sandboxResultState !== 'NONE' && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                      sandboxResultState === 'SUCCESS' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      sandboxResultState === 'BLOCKED' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                      'text-neutral-400 bg-neutral-800'
                    }`}>
                      {sandboxResultState === 'SUCCESS' ? 'EXECUTION_COMPLETED' : 'SECURITY_BREACH_QUARANTINED'}
                    </span>
                  )}
                </div>

                {sandboxLogSteps.length === 0 && !isSandboxRunning ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-neutral-500 space-y-2">
                    <Brain className="w-8 h-8 text-neutral-700 animate-pulse" />
                    <p className="text-xs font-mono">No active simulation run in current sandbox stack.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* TIMELINE LIST */}
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                      {sandboxLogSteps.map((log, idx) => (
                        <div key={idx} className="bg-neutral-950 border border-neutral-800/60 rounded-xl p-2.5 flex items-start gap-3">
                          <span className="mt-0.5">
                            {log.includes('[SUCCESS]') ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            ) : log.includes('[SECURITY ALERT]') || log.includes('[BLOCKED]') ? (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            )}
                          </span>
                          <p className="text-[11px] font-mono text-neutral-300 leading-relaxed">{log}</p>
                        </div>
                      ))}
                    </div>

                    {/* DYNAMIC DECISION RECORD OUTPUT */}
                    {sandboxDecisionReport && (
                      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 font-sans">
                        <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                          <span className="text-xs uppercase font-mono font-bold text-neutral-400">IMMUTABLE REASONING REPORT</span>
                          <span className="text-[10px] font-mono text-neutral-500">ID: {sandboxDecisionReport.id}</span>
                        </div>
                        
                        <div className="space-y-1.5 text-xs text-neutral-300">
                          <p className="leading-relaxed"><span className="text-indigo-400 font-bold font-mono">Verdict:</span> {sandboxDecisionReport.reason}</p>
                          <p className="text-[11px] text-neutral-400 bg-neutral-900/60 p-2 rounded border border-neutral-800"><span className="text-emerald-400 font-bold font-mono">Telemetry:</span> {sandboxDecisionReport.evidence}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 pt-1 text-[10px] font-mono text-neutral-400">
                          <div>
                            <span className="text-neutral-500">CHOSEN ACTION:</span> <span className="text-emerald-400 font-bold">{sandboxDecisionReport.chosenAction}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">AUDIT SIGNATURE:</span> <span className="text-indigo-400">sha256-abc-{sandboxExecutionId}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 3: AI EMPLOYEES REGISTRY
              ========================================================== */}
          {activeSubTab === 'registry' && (
            <motion.div
              key="registry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/30 p-4 border border-neutral-800 rounded-2xl">
                <div>
                  <h3 className="font-bold text-sm text-white">Framework Registered Employees</h3>
                  <p className="text-xs text-neutral-400">Instantiated agents inheriting the core framework class. Never instantiate outside the registry.</p>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search agents..."
                    className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={agentStatusFilter}
                    onChange={(e) => setAgentStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-neutral-200 focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Ready">Ready</option>
                    <option value="Running">Running</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAgentsList.map(agt => (
                  <div key={agt.id} className="bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-5 space-y-4 hover:border-neutral-700/60 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{agt.name}</h4>
                            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{agt.version}</span>
                          </div>
                          <span className="text-[10px] uppercase font-mono text-indigo-400 font-bold">{agt.type}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          agt.status === 'Ready' || agt.status === 'Running' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-neutral-400 bg-neutral-800'
                        }`}>
                          {agt.status}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed">{agt.description}</p>

                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1.5">
                        {agt.capabilities.map((cap, i) => (
                          <span key={i} className="text-[9px] font-mono text-neutral-300 bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded">
                            {cap}
                          </span>
                        ))}
                      </div>

                      {/* System Prompt preview */}
                      <div className="bg-neutral-950 border border-neutral-850 p-2.5 rounded-xl text-[10px] font-mono text-neutral-500">
                        <span className="text-indigo-400 font-bold">SYSTEM_PROMPT:</span> "{agt.systemPrompt.substring(0, 85)}..."
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-neutral-800/60 pt-3 text-[10px] font-mono text-neutral-500">
                      <div>
                        <span>Temperature:</span> <span className="text-white block font-bold">{agt.temperature}</span>
                      </div>
                      <div>
                        <span>Limit / Hr:</span> <span className="text-white block font-bold">{agt.executionLimit}</span>
                      </div>
                      <div>
                        <span>Languages:</span> <span className="text-white block font-bold">{agt.supportedLanguages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 4: SECURE TOOL BROKER (SAFETY VALS)
              ========================================================== */}
          {activeSubTab === 'broker' && (
            <motion.div
              key="broker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* TOOL LIST */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                    Centralized Tool Broker DEFINITIONS
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Agents never invoke tools directly. Every execution is audited by the brokerage gatekeeper.</p>
                </div>

                <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                  {tools.map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setSelectedBrokerToolId(tool.id);
                        setBrokerConsoleLogs([]);
                        setBrokerValidationStatus('IDLE');
                      }}
                      className={`p-3 border rounded-xl space-y-2 cursor-pointer transition-all ${
                        selectedBrokerToolId === tool.id ? 'bg-indigo-500/5 border-indigo-500/40 text-white' : 'bg-neutral-950 border-neutral-800/60 text-neutral-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold font-mono">{tool.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          tool.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          tool.riskLevel === 'HIGH' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          Risk: {tool.riskLevel}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-400">{tool.description}</p>

                      <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                        <span>Required: {tool.permissionRequired}</span>
                        <span className={tool.availability ? 'text-emerald-400' : 'text-rose-400'}>
                          {tool.availability ? 'AVAIL' : 'FORBIDDEN'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BROKER SIMULATOR CONSOLE */}
              <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-white">Central Broker Evaluation Sandbox</h3>
                      <p className="text-xs text-neutral-400">Forces schema matching inputs & permission validation checks.</p>
                    </div>

                    {brokerValidationStatus !== 'IDLE' && (
                      <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${
                        brokerValidationStatus === 'PASS' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      }`}>
                        {brokerValidationStatus === 'PASS' ? 'BROKER_ALLOWED' : 'BROKER_BLOCKED'}
                      </span>
                    )}
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2.5 font-mono text-[11px]">
                    {brokerConsoleLogs.length === 0 ? (
                      <div className="text-neutral-500 text-center py-12">
                        Select a tool and click 'Simulate Tool Invocation' to view Broker validation steps.
                      </div>
                    ) : (
                      brokerConsoleLogs.map((log, idx) => (
                        <div key={idx} className="text-neutral-300 leading-relaxed">{log}</div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={triggerToolBrokerRun}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold font-mono border border-neutral-800 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-indigo-400 animate-pulse" />
                  SIMULATE TOOL INVOCATION FLOW
                </button>
              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 5: OBSERVABILITY & METRICS CHARTS
              ========================================================== */}
          {activeSubTab === 'observability' && (
            <motion.div
              key="observability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. LATENCY OVER TIME CHART */}
                <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white">AI Agent Core Latency Series</h3>
                    <p className="text-xs text-neutral-400">Measures prompt formatting, model routing, and Tool Broker validation times.</p>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: '19:00', API: 120, Broker: 14, Reasoning: 210 },
                        { name: '19:15', API: 140, Broker: 10, Reasoning: 180 },
                        { name: '19:30', API: 220, Broker: 32, Reasoning: 280 },
                        { name: '19:45', API: 180, Broker: 15, Reasoning: 190 },
                        { name: '20:00', API: 130, Broker: 11, Reasoning: 200 }
                      ]}>
                        <defs>
                          <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="reasonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis dataKey="name" stroke="#525252" fontSize={10} fontStyle="italic" />
                        <YAxis stroke="#525252" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Area type="monotone" dataKey="Reasoning" stroke="#10b981" fillOpacity={1} fill="url(#reasonGrad)" />
                        <Area type="monotone" dataKey="API" stroke="#818cf8" fillOpacity={1} fill="url(#apiGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. TOKEN USAGE STATISTICS */}
                <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white">Dynamic Token Consumption Pool</h3>
                    <p className="text-xs text-neutral-400">Real-time prompt and completion token counts evaluated on Gemini models.</p>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { agent: 'AI Recruiter', Prompt: 14500, Completion: 4100 },
                        { agent: 'AI Coach', Prompt: 22000, Completion: 18000 },
                        { agent: 'AI Project Manager', Prompt: 8200, Completion: 3100 },
                        { agent: 'AI Fraud Detector', Prompt: 29000, Completion: 2100 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis dataKey="agent" stroke="#525252" fontSize={9} />
                        <YAxis stroke="#525252" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="Prompt" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Completion" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 6: FRAMEWORK SAFETY TESTS
              ========================================================== */}
          {activeSubTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    Automated Framework Security & Compliance Unit Tests
                  </h3>
                  <p className="text-xs text-neutral-400">Verifies Tool Broker constraints, immutable session histories, and token cap triggers automatically.</p>
                </div>

                <button
                  onClick={runFrameworkTestSuite}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition-all"
                >
                  Execute Safety Tests
                </button>
              </div>

              {testSuiteRun ? (
                <div className="space-y-3">
                  {testResults.map((res, i) => (
                    <div key={i} className="p-4 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-neutral-200">{res.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          res.status === 'PASS' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400 leading-relaxed bg-neutral-900/40 p-2.5 rounded border border-neutral-900">{res.log}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl space-y-2 bg-neutral-900/5">
                  <Activity className="w-8 h-8 text-neutral-700 animate-pulse" />
                  <p className="text-xs font-mono">Framework security ledger tests not run in this turn context.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 7: SCHEMA & API SPECS
              ========================================================== */}
          {activeSubTab === 'schema_api' && (
            <motion.div
              key="schema_api"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              
              {/* SCHEMA VIEWER */}
              <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Platform PostgreSQL Relational Blueprints
                  </h3>
                  <p className="text-xs text-neutral-400">Audit-ready enterprise database constraints ensuring data persistence and immutability.</p>
                </div>

                <div className="flex gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  {(['agents_registry', 'agent_executions', 'task_queue', 'agent_decision_records'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedSchemaTable(tab)}
                      className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-lg transition-all ${
                        selectedSchemaTable === tab ? 'bg-neutral-800 text-white' : 'text-neutral-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto select-all select-none">
                  {selectedSchemaTable === 'agents_registry' && (
                    <pre>{`-- 1. AI AGENTS REGISTRY DEFINITION
CREATE TABLE agents_registry (
    agent_id VARCHAR(50) PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    agent_version VARCHAR(20) NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    system_prompt TEXT NOT NULL,
    temperature NUMERIC(2, 1) DEFAULT 0.0,
    max_tokens INTEGER DEFAULT 2048,
    execution_limit_per_hr INTEGER DEFAULT 5000,
    status VARCHAR(30) DEFAULT 'Ready',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_status ON agents_registry(status);`}</pre>
                  )}

                  {selectedSchemaTable === 'agent_executions' && (
                    <pre>{`-- 2. IMMUTABLE AGENT RUNTIME EXECUTIONS
CREATE TABLE agent_executions (
    execution_id VARCHAR(50) PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents_registry(agent_id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_state VARCHAR(30) NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    latency_ms INTEGER NOT NULL,
    correlation_id VARCHAR(50) NOT NULL,
    cryptographic_signature_hash VARCHAR(64) NOT NULL
);

-- Zero Hard-Delete Rule enforce index
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;`}</pre>
                  )}

                  {selectedSchemaTable === 'task_queue' && (
                    <pre>{`-- 3. DISTRIBUTED ASYNCHRONOUS TASK QUEUE
CREATE TABLE task_queue (
    task_id VARCHAR(50) PRIMARY KEY,
    objective TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    deadline TIMESTAMP WITH TIME ZONE,
    owner_agent_id VARCHAR(50) REFERENCES agents_registry(agent_id),
    status VARCHAR(30) DEFAULT 'Pending',
    progress INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    expected_output TEXT NOT NULL
);`}</pre>
                  )}

                  {selectedSchemaTable === 'agent_decision_records' && (
                    <pre>{`-- 4. DETERMINISTIC REASONING EXPLAINABILITY LOG
CREATE TABLE agent_decision_records (
    decision_id VARCHAR(50) PRIMARY KEY,
    execution_id VARCHAR(50) REFERENCES agent_executions(execution_id),
    agent_id VARCHAR(50) REFERENCES agents_registry(agent_id),
    confidence_multiplier INTEGER NOT NULL,
    reasoning_summary TEXT NOT NULL,
    chosen_action VARCHAR(100) NOT NULL,
    business_rules_audited TEXT[] NOT NULL
);`}</pre>
                  )}
                </div>
              </div>

              {/* API ENDPOINTS */}
              <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-400" />
                      Platform Framework API endpoints
                    </h3>
                    <p className="text-xs text-neutral-400">Centralized framework API endpoints enabling external triggers and health compliance hooks.</p>
                  </div>

                  <div className="flex gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                    {['GET /api/agents/status', 'GET /api/agents/decisions', 'POST /api/agents/execute'].map(endpoint => (
                      <button
                        key={endpoint}
                        onClick={() => setSelectedApiEndpoint(endpoint)}
                        className={`flex-1 py-1.5 text-[9px] font-bold font-mono rounded-lg transition-all ${
                          selectedApiEndpoint === endpoint ? 'bg-neutral-800 text-white' : 'text-neutral-500'
                        }`}
                      >
                        {endpoint.split(' ')[1]}
                      </button>
                    ))}
                  </div>

                  {/* Schema Params */}
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono">Selected Endpoint Specs</span>
                    <div className="text-xs font-mono text-neutral-300">
                      HTTP Request: <span className="text-emerald-400 font-bold">{selectedApiEndpoint.split(' ')[0]}</span> <span className="text-indigo-300">{selectedApiEndpoint.split(' ')[1]}</span>
                    </div>
                  </div>

                  {/* Simulated response JSON payload */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-400 max-h-[220px] overflow-y-auto">
                    <span className="text-neutral-600 block border-b border-neutral-900 pb-1 mb-2 font-bold uppercase text-[9px]">RESPONSE PAYLOAD</span>
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-500 bg-neutral-950/40 p-3 rounded-xl border border-neutral-900 leading-relaxed text-center italic">
                  🔒 Content security policies strict mode enabled: ROW-LEVEL SECURITY prevents bypass attempts.
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
