import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  RefreshCw,
  Search,
  Database,
  Cpu,
  TrendingUp,
  Settings,
  Users,
  GitCommit,
  GitMerge,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Eye,
  Activity,
  Award,
  Zap,
  RotateCcw,
  FileText,
  UserCheck,
  Code
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
  Cell
} from 'recharts';

// ============================================================================
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 10.0 - AI SUPERVISOR & ORCHESTRATOR)
// ============================================================================

export interface AgentRegistryItem {
  agentId: string;
  name: string;
  capabilities: string[];
  currentLoad: number; // 0 - 100%
  availability: 'Online' | 'Busy' | 'Paused' | 'Failed' | 'Offline';
  avgLatencyMs: number;
  successRate: number; // percentage
  currentQueueCount: number;
  model: string;
  version: string;
}

export interface TaskAssignment {
  taskId: string;
  name: string;
  assignedAgentId: string;
  assignedAgentName: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Retrying';
  durationMs: number;
  output: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface WorkflowInstance {
  id: string;
  name: string;
  type: 'Student Registration' | 'Resume Review' | 'Portfolio Review' | 'Fraud Investigation' | 'Hiring Recommendation';
  status: 'Created' | 'Active' | 'Completed' | 'Failed' | 'Escalated' | 'Paused';
  priority: 'Medium' | 'High' | 'Critical';
  startedAt: string;
  updatedAt: string;
  currentStepIndex: number;
  steps: TaskAssignment[];
  deadline: string;
  ownerId: string;
  version: string;
  isParallel: boolean;
}

export interface ConflictRecord {
  id: string;
  workflowId: string;
  conflictType: 'Conflicting Scores' | 'Conflicting Recommendations' | 'Risk Variance';
  agentsInvolved: string[];
  description: string;
  resolutionMethod: 'Business Rules' | 'Confidence Threshold' | 'Consensus' | 'Human Override';
  outcome: string;
  resolvedAt: string;
  status: 'RESOLVED' | 'UNRESOLVED';
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const SEED_AGENTS: AgentRegistryItem[] = [
  { agentId: 'AGT-REC-101', name: 'AI Recruiter', capabilities: ['Resume Filtering', 'Candidate Matching', 'Interview Prep'], currentLoad: 45, availability: 'Online', avgLatencyMs: 410, successRate: 98.9, currentQueueCount: 2, model: 'gemini-2.5-flash', version: 'v8.2.1' },
  { agentId: 'AGT-PMR-102', name: 'AI Project Manager', capabilities: ['Milestone Evaluation', 'Task Delegation', 'Progress Auditing'], currentLoad: 80, availability: 'Busy', avgLatencyMs: 1250, successRate: 94.1, currentQueueCount: 7, model: 'gemini-2.5-pro', version: 'v5.1.0' },
  { agentId: 'AGT-TFD-103', name: 'AI Fraud Detector', capabilities: ['Security Check', 'Repository Plagiarism Match', 'Identity Audits'], currentLoad: 12, availability: 'Online', avgLatencyMs: 1980, successRate: 99.4, currentQueueCount: 1, model: 'gemini-2.5-pro', version: 'v3.2.0' },
  { agentId: 'AGT-COA-104', name: 'AI Career Coach', capabilities: ['Behavioral Simulations', 'Resume Parsing', 'Skill Gap Mapping'], currentLoad: 25, availability: 'Online', avgLatencyMs: 380, successRate: 97.5, currentQueueCount: 0, model: 'gemini-2.5-flash', version: 'v4.0.2' },
  { agentId: 'AGT-ADV-105', name: 'AI Hiring Advisor', capabilities: ['Final Recommendation', 'Decision Summary', 'Score Calibration'], currentLoad: 0, availability: 'Offline', avgLatencyMs: 0, successRate: 100, currentQueueCount: 0, model: 'gemini-2.5-pro', version: 'v2.1.1' }
];

const SEED_WORKFLOWS: WorkflowInstance[] = [
  {
    id: 'WF-STU-8812',
    name: ' Nguyen Hoang Long Comprehensive Onboarding',
    type: 'Student Registration',
    status: 'Active',
    priority: 'High',
    startedAt: '2026-07-04T21:10:00Z',
    updatedAt: '2026-07-04T21:28:00Z',
    currentStepIndex: 1,
    isParallel: false,
    version: 'WF-V9.0.2',
    deadline: '2026-07-05T21:10:00Z',
    ownerId: 'ADM-SUPER-01',
    steps: [
      { taskId: 'TSK-101', name: 'Verify Student Identity Check', assignedAgentId: 'AGT-TFD-103', assignedAgentName: 'AI Fraud Detector', status: 'Completed', durationMs: 1450, output: 'Pass. Identity match confidence 99%.', priority: 'High' },
      { taskId: 'TSK-102', name: 'Analyze Candidate Resume Layout', assignedAgentId: 'AGT-REC-101', assignedAgentName: 'AI Recruiter', status: 'Running', durationMs: 250, output: 'Parsing sections...', priority: 'Medium' },
      { taskId: 'TSK-103', name: 'Map Skills Gap Analysis', assignedAgentId: 'AGT-COA-104', assignedAgentName: 'AI Career Coach', status: 'Pending', durationMs: 0, output: '', priority: 'Low' }
    ]
  },
  {
    id: 'WF-CO-9921',
    name: 'FPT Software Placement Assessment',
    type: 'Hiring Recommendation',
    status: 'Completed',
    priority: 'Critical',
    startedAt: '2026-07-04T20:00:00Z',
    updatedAt: '2026-07-04T21:15:00Z',
    currentStepIndex: 2,
    isParallel: true,
    version: 'WF-V9.1.0',
    deadline: '2026-07-04T23:00:00Z',
    ownerId: 'ADM-PM-03',
    steps: [
      { taskId: 'TSK-201', name: 'Retrieve Milestone Progress Score', assignedAgentId: 'AGT-PMR-102', assignedAgentName: 'AI Project Manager', status: 'Completed', durationMs: 1100, output: 'Milestone completions: 95/100.', priority: 'High' },
      { taskId: 'TSK-202', name: 'Check Repository Anti-Plagiarism', assignedAgentId: 'AGT-TFD-103', assignedAgentName: 'AI Fraud Detector', status: 'Completed', durationMs: 2100, output: 'Unique score 91.2%. No plagiarism found.', priority: 'High' },
      { taskId: 'TSK-203', name: 'Synthesize Recommendations Summary', assignedAgentId: 'AGT-ADV-105', assignedAgentName: 'AI Hiring Advisor', status: 'Completed', durationMs: 820, output: 'Hiring assessment calibrated: Highly Recommended.', priority: 'Medium' }
    ]
  },
  {
    id: 'WF-SEC-3301',
    name: 'Suspicious Repository Activity Audit',
    type: 'Fraud Investigation',
    status: 'Escalated',
    priority: 'Critical',
    startedAt: '2026-07-04T21:15:00Z',
    updatedAt: '2026-07-04T21:29:00Z',
    currentStepIndex: 1,
    isParallel: false,
    version: 'WF-V8.4.4',
    deadline: '2026-07-05T09:00:00Z',
    ownerId: 'ADM-SEC-09',
    steps: [
      { taskId: 'TSK-301', name: 'Scan Code Repositories', assignedAgentId: 'AGT-TFD-103', assignedAgentName: 'AI Fraud Detector', status: 'Completed', durationMs: 1850, output: 'High volume clone detected from external github repo.', priority: 'High' },
      { taskId: 'TSK-302', name: 'Trigger Score Calibrations', assignedAgentId: 'AGT-PMR-102', assignedAgentName: 'AI Project Manager', status: 'Failed', durationMs: 1400, output: 'Action halted. Conflict detected on student scores.', priority: 'High' },
      { taskId: 'TSK-303', name: 'Draft Fraud Escalation Report', assignedAgentId: 'AGT-ADV-105', assignedAgentName: 'AI Hiring Advisor', status: 'Pending', durationMs: 0, output: '', priority: 'High' }
    ]
  }
];

const SEED_CONFLICTS: ConflictRecord[] = [
  {
    id: 'CONF-001',
    workflowId: 'WF-SEC-3301',
    conflictType: 'Conflicting Scores',
    agentsInvolved: ['AI Project Manager', 'AI Fraud Detector'],
    description: 'AI Project Manager recorded positive milestone completions (94%), but AI Fraud Detector flagged codebase duplicate matches exceeding 60%.',
    resolutionMethod: 'Confidence Threshold',
    outcome: 'Decision overridden to Suspended pending manual review based on AI Fraud Detector confidence (99.4% vs 94.1%).',
    resolvedAt: '2026-07-04T21:29:10Z',
    status: 'RESOLVED'
  },
  {
    id: 'CONF-002',
    workflowId: 'WF-STU-8812',
    conflictType: 'Risk Variance',
    agentsInvolved: ['AI Recruiter', 'AI Career Coach'],
    description: 'AI Recruiter flags candidate resume as high potential placement, but AI Career Coach notes lack of secure database implementation experience.',
    resolutionMethod: 'Business Rules',
    outcome: 'Supervisor injected prerequisite task "Prerequisite OAuth Sandbox Completion" automatically to satisfy rules.',
    resolvedAt: '2026-07-04T21:28:15Z',
    status: 'RESOLVED'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AISupervisorOrchestratorWorkspace() {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'workflows' | 'agent-registry' | 'conflicts' | 'metrics' | 'testing' | 'schemas'>('workflows');

  // Core Mutable States
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>(SEED_WORKFLOWS);
  const [agents, setAgents] = useState<AgentRegistryItem[]>(SEED_AGENTS);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>(SEED_CONFLICTS);

  // Active Selected item
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('WF-STU-8812');

  // Multi-agent orchestration visual variables
  const [isQueueRunning, setIsQueueRunning] = useState(true);
  const [workflowThroughput, setWorkflowThroughput] = useState(38); // workloads per min
  const [totalWorkflowsCount, setTotalWorkflowsCount] = useState(14801);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Creator forms
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowType, setNewWorkflowType] = useState<WorkflowInstance['type']>('Student Registration');
  const [newWorkflowPriority, setNewWorkflowPriority] = useState<WorkflowInstance['priority']>('Medium');
  const [newWorkflowIsParallel, setNewWorkflowIsParallel] = useState(false);

  // Conflict Manual Override simulator
  const [manualOverrideConflictId, setManualOverrideConflictId] = useState<string | null>(null);
  const [overrideText, setOverrideText] = useState('');

  // Diagnostic Test suite states
  const [isTestSuiteRunning, setIsTestSuiteRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    'Supervisor diagnostics engine offline.',
    'Press "Trigger Autonomous Failover & Load Scan" to launch self-test routines.'
  ]);

  // REST API simulation playground
  const [apiMethodSelected, setApiMethodSelected] = useState<'TRIGGER' | 'GET_GRAPH' | 'CALIBRATE' | 'RESOLVE_CONFLICT'>('TRIGGER');
  const [apiPlaygroundResponse, setApiPlaygroundResponse] = useState<any>(null);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live dynamic runner (simulates active progress ticks on workflows)
  useEffect(() => {
    if (!isQueueRunning) return;

    const interval = setInterval(() => {
      setWorkflows(prev => prev.map(wf => {
        if (wf.status === 'Active') {
          const currentStep = wf.steps[wf.currentStepIndex];
          if (currentStep) {
            // progress current running task, complete it, and move to next step
            if (currentStep.status === 'Running') {
              const updatedSteps = [...wf.steps];
              updatedSteps[wf.currentStepIndex] = {
                ...currentStep,
                status: 'Completed',
                durationMs: currentStep.durationMs + Math.floor(Math.random() * 300) + 100,
                output: 'Evaluation process logged. Integrity signature calibrated.'
              };

              const nextIndex = wf.currentStepIndex + 1;
              const hasNext = nextIndex < wf.steps.length;

              if (hasNext) {
                // start next step
                updatedSteps[nextIndex] = {
                  ...updatedSteps[nextIndex],
                  status: 'Running',
                  durationMs: 50
                };
              }

              return {
                ...wf,
                steps: updatedSteps,
                currentStepIndex: hasNext ? nextIndex : wf.currentStepIndex,
                status: hasNext ? 'Active' : 'Completed',
                updatedAt: new Date().toISOString()
              };
            } else if (currentStep.status === 'Pending') {
              const updatedSteps = [...wf.steps];
              updatedSteps[wf.currentStepIndex] = {
                ...currentStep,
                status: 'Running',
                durationMs: 50
              };
              return {
                ...wf,
                steps: updatedSteps,
                updatedAt: new Date().toISOString()
              };
            }
          }
        }
        return wf;
      }));

      // Random load updates for agents
      setAgents(prev => prev.map(ag => {
        if (ag.availability === 'Online' || ag.availability === 'Busy') {
          const delta = Math.floor(Math.random() * 15) - 7;
          const newLoad = Math.max(10, Math.min(95, ag.currentLoad + delta));
          return {
            ...ag,
            currentLoad: newLoad,
            currentQueueCount: Math.max(0, Math.floor(newLoad / 12)),
            availability: newLoad > 75 ? 'Busy' : 'Online'
          };
        }
        return ag;
      }));

      // Increment overall metrics count slightly
      setTotalWorkflowsCount(prev => prev + 1);
      setWorkflowThroughput(Math.floor(Math.random() * 10) + 32);

    }, 7000);

    return () => clearInterval(interval);
  }, [isQueueRunning]);

  // REST API Synchronizer effect
  useEffect(() => {
    let response: any = {};
    if (apiMethodSelected === 'TRIGGER') {
      response = {
        endpoint: 'POST /api/v1/orchestrator/workflow/trigger',
        payload: {
          templateName: 'Standard Apprentice Onboarding',
          workflowType: 'Student Registration',
          priority: 'High',
          studentId: 'STU-9201',
          parallelMode: false
        },
        response: {
          statusCode: 201,
          workflowId: 'WF-STU-GEN-99',
          owner: 'ADM-SYSTEM',
          estimatedDurationMs: 4400,
          stepsCreatedCount: 3,
          traceCorrelationId: 'TRC-STU-990-AB',
          timestamp: new Date().toISOString()
        }
      };
    } else if (apiMethodSelected === 'GET_GRAPH') {
      response = {
        endpoint: 'GET /api/v1/orchestrator/workflow/graph?workflowId=WF-STU-8812',
        response: {
          statusCode: 200,
          workflowId: 'WF-STU-8812',
          graphName: ' Nguyen Hoang Long Comprehensive Onboarding',
          stepsChain: [
            { id: 'TSK-101', name: 'Verify Student Identity Check', type: 'Sequential', dependsOn: null, outputState: 'Completed' },
            { id: 'TSK-102', name: 'Analyze Candidate Resume Layout', type: 'Sequential', dependsOn: 'TSK-101', outputState: 'Running' },
            { id: 'TSK-103', name: 'Map Skills Gap Analysis', type: 'Sequential', dependsOn: 'TSK-102', outputState: 'Pending' }
          ],
          version: 'WF-V9.0.2'
        }
      };
    } else if (apiMethodSelected === 'CALIBRATE') {
      response = {
        endpoint: 'POST /api/v1/orchestrator/agents/balance',
        response: {
          statusCode: 200,
          redistributedQueueCount: 4,
          agentsBalanced: ['AI Recruiter', 'AI Project Manager'],
          systemLoadMetric: { averageLoadPercentage: '44.8%', status: 'CALIBRATED_STABLE' },
          timestamp: new Date().toISOString()
        }
      };
    } else {
      response = {
        endpoint: 'POST /api/v1/orchestrator/conflicts/resolve',
        payload: {
          conflictId: 'CONF-001',
          overrideResolutionMethod: 'Human Override',
          overrideDetails: 'Manual SRE intervention approved milestone credentials.'
        },
        response: {
          statusCode: 200,
          conflictId: 'CONF-001',
          resolutionStatus: 'RESOLVED_BY_HUMAN',
          calibrationAuditLocked: true,
          timestamp: new Date().toISOString()
        }
      };
    }
    setApiPlaygroundResponse(response);
  }, [apiMethodSelected]);

  // Handle Workflow creation
  const handleCreateWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    const newWf: WorkflowInstance = {
      id: `WF-GEN-${Math.floor(Math.random() * 9000) + 1000}`,
      name: newWorkflowName,
      type: newWorkflowType,
      status: 'Active',
      priority: newWorkflowPriority,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStepIndex: 0,
      isParallel: newWorkflowIsParallel,
      version: 'WF-V10.0',
      deadline: new Date(Date.now() + 86400000).toISOString(), // + 1 day
      ownerId: 'ADM-SUPER-01',
      steps: [
        { taskId: 'TSK-GEN-01', name: 'Identity Credential Integrity Check', assignedAgentId: 'AGT-TFD-103', assignedAgentName: 'AI Fraud Detector', status: 'Pending', durationMs: 0, output: '', priority: 'High' },
        { taskId: 'TSK-GEN-02', name: 'Document Alignment Optimization Check', assignedAgentId: 'AGT-REC-101', assignedAgentName: 'AI Recruiter', status: 'Pending', durationMs: 0, output: '', priority: 'Medium' }
      ]
    };

    setWorkflows(prev => [newWf, ...prev]);
    setSelectedWorkflowId(newWf.id);
    setNewWorkflowName('');
    setIsCreatingWorkflow(false);
    triggerToast(`Workflow ${newWf.id} successfully generated!`);
  };

  // Handle Conflict manual override resolution
  const handleResolveConflict = (conflictId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideText.trim()) return;

    setConflicts(prev => prev.map(conf => {
      if (conf.id === conflictId) {
        return {
          ...conf,
          status: 'RESOLVED',
          resolutionMethod: 'Human Override',
          outcome: `MANUAL SRE OVERRIDE COMPLETED: "${overrideText}"`,
          resolvedAt: new Date().toISOString()
        };
      }
      return conf;
    }));

    setManualOverrideConflictId(null);
    setOverrideText('');
    triggerToast(`Conflict resolved via SRE manual override.`);
  };

  // Run autonomous failover diagnostics suite
  const executeDiagnosticsSuite = async () => {
    if (isTestSuiteRunning) return;
    setIsTestSuiteRunning(true);
    setDiagnosticLogs([]);

    const log = (msg: string) => {
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('⚡ Starting Orchestrator autonomous SRE failure self-tests...');
    await new Promise(r => setTimeout(r, 450));

    log('🔍 SCENARIO 1: Automated Agent Failover Vetting...');
    log('Simulating offline fault on active "AI Recruiter" channel...');
    setAgents(prev => prev.map(ag => ag.agentId === 'AGT-REC-101' ? { ...ag, availability: 'Failed' as const } : ag));
    await new Promise(r => setTimeout(r, 400));
    log('Orchestrator detected AGT-REC-101 failed state. Triggering alternative matching capabilities...');
    log('Selecting fallback agent: "AI Career Coach" (Matching capability: Resume Parsing).');
    log('Re-routing remaining task pipeline... [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('⚖️ SCENARIO 2: Conflict Resolution Calibration...');
    log('Injecting simulated rating variance between PM (94%) and Fraud (60%)...');
    log('Running Confidence Score calibration business rule matrix...');
    log('Decision Resolution matched. AI Fraud Detector (99.4%) prioritized over PM. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('⏱️ SCENARIO 3: Parallel aggregation & join barrier tests...');
    log('Executing parallel task cluster (Identity + Plagiarism + Milestone checks)...');
    log('Joining individual thread telemetry tokens under core supervisor session...');
    log('Aggregated payload verified securely without trace leakage or token bloat. [PASS]');
    await new Promise(r => setTimeout(r, 450));

    log('📈 SCENARIO 4: Load balancing rebalance trigger...');
    log('Injecting heavy virtual queue load (35 simultaneous workflows) on "AI Project Manager"...');
    log('Threshold alert generated. Triggering queue division & auto-scale workers...');
    log('Redistributed workload load successfully balanced. Performance criteria met. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    // Recovery
    setAgents(prev => prev.map(ag => ag.agentId === 'AGT-REC-101' ? { ...ag, availability: 'Online' as const } : ag));
    log('✅ DIAGNOSTICS SCAN SUCCESSFUL. Orchestrator state restored to nominal.');
    setIsTestSuiteRunning(false);
  };

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  // Filters calculation
  const filteredWorkflows = workflows.filter(w => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = w.id.toLowerCase().includes(q) ||
                          w.name.toLowerCase().includes(q) ||
                          w.type.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-orchestration-workspace">
      {/* Background visual highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              SPECIFICATION 10.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Workforce Orchestration & Supervisors
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100 mt-1 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" /> AI Supervisor & Multi-Agent Orchestrator
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Centrally manages job planners, parallel workflows, conflict resolution algorithms, automated load rebalancers, and critical SRE fallback pipelines for the virtual employee workforce.
          </p>
        </div>

        {/* Live system monitoring controls */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Active Workflows</span>
              <span className="text-indigo-400 font-bold">{workflows.filter(w => w.status === 'Active').length} Running</span>
            </div>
            <div className="border-l border-neutral-800 h-6 pl-4">
              <span className="text-neutral-500 block text-[9px] uppercase">Total Completed</span>
              <span className="text-purple-400 font-bold">{(totalWorkflowsCount).toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => setIsQueueRunning(!isQueueRunning)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${isQueueRunning ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
          >
            <span className={`w-2 h-2 rounded-full ${isQueueRunning ? 'bg-indigo-400 animate-pulse' : 'bg-neutral-500'}`} />
            {isQueueRunning ? 'Active Dispatcher' : 'Orchestration Idle'}
          </button>
        </div>
      </div>

      {/* Subtab Navigation Headers */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800/80 pb-3 mb-6">
        {[
          { id: 'workflows', label: 'Workflow Graphs & Live Traces', icon: GitBranch },
          { id: 'agent-registry', label: 'Agent Capability Registry', icon: Users },
          { id: 'conflicts', label: 'Conflict Resolution Engine', icon: ShieldAlert },
          { id: 'metrics', label: 'Execution Metrics', icon: Activity },
          { id: 'schemas', label: 'Database & Registry Schemas', icon: Database },
          { id: 'testing', label: 'Failover Self-Diagnostics', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 bg-indigo-900/90 border border-indigo-700/50 text-indigo-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 text-xs font-semibold backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-indigo-400 animate-bounce" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Panels */}
      <AnimatePresence mode="wait">

        {/* TAB 1: WORKFLOW GRAPHS & LIVE TRACES */}
        {activeSubTab === 'workflows' && (
          <motion.div
            key="workflows"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sidebar list of workflows */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex flex-col h-[580px]">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">WORKFLOW PIPELINES</span>
                  <button
                    onClick={() => setIsCreatingWorkflow(true)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    + Trigger New Pipeline
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search workflows, tasks, type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400">
                  <span>FILTER STATUS</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-850 rounded px-2 py-0.5 text-neutral-300"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredWorkflows.map(wf => {
                  const isSelected = wf.id === selectedWorkflowId;
                  return (
                    <div
                      key={wf.id}
                      onClick={() => setSelectedWorkflowId(wf.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100 shadow-lg' : 'bg-neutral-900/20 border-neutral-850 hover:bg-neutral-900/50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-neutral-500 font-bold bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                          {wf.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${wf.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : wf.status === 'Active' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' : 'bg-amber-500/10 text-amber-400'}`}>
                          {wf.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-200 mt-1.5 line-clamp-1">
                        {wf.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Type: {wf.type}
                      </p>
                      <div className="flex items-center justify-between mt-2.5 text-[9px] font-mono text-neutral-500">
                        <span>Tasks: <strong>{wf.steps.length} steps</strong></span>
                        <span className={`px-1 rounded text-neutral-400 ${wf.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 font-bold' : 'bg-neutral-800'}`}>
                          {wf.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Visualizer: Workflow Execution Graph & Progression details */}
            <div className="lg:col-span-8 bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 flex flex-col h-[580px] overflow-y-auto custom-scrollbar">
              
              {/* Creator Dialog Overlay inside panel */}
              {isCreatingWorkflow && (
                <div className="mb-6 bg-neutral-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
                  <h3 className="text-xs font-bold text-neutral-200 mb-3 flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 text-indigo-400" /> Trigger Custom Autonomous Pipeline
                  </h3>
                  <form onSubmit={handleCreateWorkflowSubmit} className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-400 font-semibold">Workflow Target Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Nguyen Hoang Long Skill Placement Audit"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        required
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-400 font-semibold">Workflow Template Type</label>
                      <select
                        value={newWorkflowType}
                        onChange={(e) => setNewWorkflowType(e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-1.5 text-neutral-300 focus:outline-none"
                      >
                        <option value="Student Registration">Student Registration</option>
                        <option value="Resume Review">Resume Review</option>
                        <option value="Portfolio Review">Portfolio Review</option>
                        <option value="Fraud Investigation">Fraud Investigation</option>
                        <option value="Hiring Recommendation">Hiring Recommendation</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-400 font-semibold">Priority Class</label>
                      <select
                        value={newWorkflowPriority}
                        onChange={(e) => setNewWorkflowPriority(e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-1.5 text-neutral-300 focus:outline-none"
                      >
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Critical">Critical SRE Priority</option>
                      </select>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={newWorkflowIsParallel}
                        onChange={(e) => setNewWorkflowIsParallel(e.target.checked)}
                        className="rounded bg-neutral-950 border-neutral-800 text-indigo-500 focus:ring-0"
                      />
                      <label className="text-[10px] text-neutral-400 font-semibold cursor-pointer">
                        Enable Parallel Aggregation (Resume + Plagiarism run simultaneously)
                      </label>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setIsCreatingWorkflow(false)}
                        className="px-3 py-1.5 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold cursor-pointer"
                      >
                        Launch
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Header details */}
              <div className="border-b border-neutral-800 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-neutral-100">{activeWorkflow.name}</h3>
                    <span className="text-[9px] font-mono text-neutral-500">[{activeWorkflow.version}]</span>
                  </div>
                  <p className="text-[10px] text-indigo-400 font-mono mt-0.5">
                    Orchestration Model: {activeWorkflow.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono">Owner: {activeWorkflow.ownerId}</span>
                </div>
              </div>

              {/* Dynamic Step-by-Step execution visualizer */}
              <div className="mb-6 bg-neutral-900/60 border border-neutral-850 rounded-2xl p-5">
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>ORCHESTRATOR EXECUTION GRAPH VIEW</span>
                  <span className="text-[10px] font-mono text-indigo-400">
                    {activeWorkflow.isParallel ? 'PARALLEL / MERGED' : 'SEQUENTIAL ENFORCED'}
                  </span>
                </h4>

                {/* Simulated Visual Graph Connections */}
                <div className="flex flex-col gap-6 relative">
                  {/* Join vertical bar line */}
                  {!activeWorkflow.isParallel && (
                    <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-neutral-800" />
                  )}

                  {activeWorkflow.steps.map((step, index) => {
                    const isCompleted = step.status === 'Completed';
                    const isRunning = step.status === 'Running';
                    const isFailed = step.status === 'Failed';
                    const isPending = step.status === 'Pending';

                    return (
                      <div key={step.taskId} className="flex gap-4 items-start relative z-10">
                        {/* Node status bullet icon */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : isRunning ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 animate-pulse' : isFailed ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-neutral-950 border-neutral-800 text-neutral-500'}`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : isFailed ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>

                        {/* Node metadata content */}
                        <div className="flex-1 bg-neutral-950/60 p-3 rounded-xl border border-neutral-850 hover:border-neutral-700 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-neutral-500 font-bold">{step.taskId}</span>
                              <h5 className="text-xs font-bold text-neutral-200">{step.name}</h5>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold self-start sm:self-auto ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : isRunning ? 'bg-indigo-500/10 text-indigo-400' : isFailed ? 'bg-rose-500/10 text-rose-400' : 'bg-neutral-900 text-neutral-500'}`}>
                              {step.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-900 text-[10px]">
                            <span className="text-neutral-500">
                              Assigned: <strong className="text-neutral-300">{step.assignedAgentName}</strong>
                            </span>
                            {step.durationMs > 0 && (
                              <span className="text-neutral-500 font-mono text-[9px]">
                                Latency: <strong className="text-amber-400">{step.durationMs}ms</strong>
                              </span>
                            )}
                          </div>

                          {step.output && (
                            <div className="mt-2 bg-neutral-900/50 p-2 rounded text-[9px] font-mono text-neutral-400 leading-relaxed border border-neutral-850">
                              <span className="text-neutral-500 font-bold">OUTPUT:</span> {step.output}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workflow Metrics Card details */}
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">TOTAL LATENCY</span>
                  <span className="text-neutral-100 font-bold mt-1 block">
                    {activeWorkflow.steps.reduce((acc, curr) => acc + curr.durationMs, 0)} ms
                  </span>
                </div>
                <div className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">DEADLINE STATUS</span>
                  <span className="text-emerald-400 font-bold mt-1 block">
                    Sufficient time (100%)
                  </span>
                </div>
                <div className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">PERMISSION CLASS</span>
                  <span className="text-indigo-400 font-bold mt-1 block">
                    Supervisor (Super)
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: AGENT CAPABILITY REGISTRY */}
        {activeSubTab === 'agent-registry' && (
          <motion.div
            key="agent-registry"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Capability Matching Visual tools */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-neutral-300 mb-1.5">Intelligent Capability Matcher</h3>
              <p className="text-[10px] text-neutral-500 mb-4">
                Supervisor evaluates capability parameters, load factor, and historical success factors before delegation.
              </p>

              {/* Grid of employees */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map(ag => (
                  <div
                    key={ag.agentId}
                    className="bg-neutral-900/60 border border-neutral-850 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[9px] font-bold text-neutral-500">{ag.agentId}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ag.availability === 'Online' ? 'bg-emerald-500/10 text-emerald-400' : ag.availability === 'Busy' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {ag.availability}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-200">{ag.name}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">{ag.model} ({ag.version})</span>

                      {/* Capabilities tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {ag.capabilities.map((cap, idx) => (
                          <span key={idx} className="text-[9px] font-bold bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded-lg text-neutral-300">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-neutral-850 pt-3 mt-4 space-y-2">
                      {/* Load progress bar */}
                      <div>
                        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mb-1">
                          <span>Current Workload Load</span>
                          <span className="font-bold">{ag.currentLoad}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ag.currentLoad > 75 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                            style={{ width: `${ag.currentLoad}%` }}
                          />
                        </div>
                      </div>

                      {/* Performance metrics micro data */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400 pt-1">
                        <div>
                          <span className="text-neutral-500 block text-[8px] uppercase">Avg Latency</span>
                          <span className="font-semibold text-neutral-300">{ag.avgLatencyMs > 0 ? `${ag.avgLatencyMs}ms` : 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[8px] uppercase">Success Rate</span>
                          <span className="font-semibold text-emerald-400">{ag.successRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CONFLICT RESOLUTION ENGINE */}
        {activeSubTab === 'conflicts' && (
          <motion.div
            key="conflicts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Conflict evaluation layout */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-neutral-300 mb-1.5">Algorithmic Conflict Resolution Board</h3>
              <p className="text-[10px] text-neutral-500 mb-6">
                Whenever multi-agent calibrations differ on critical student credentials, the Supervisor applies business criteria or confidence ratings to automatically lock outputs.
              </p>

              {/* Conflict records list */}
              <div className="space-y-4">
                {conflicts.map(conf => {
                  const isResolved = conf.status === 'RESOLVED';
                  return (
                    <div
                      key={conf.id}
                      className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {conf.conflictType}
                          </span>
                          <span className="text-xs font-mono text-neutral-500">[{conf.id}]</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${isResolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'}`}>
                          {conf.status}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl mb-4">
                        {conf.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900 pt-3 text-[11px] font-mono">
                        <div>
                          <span className="text-neutral-500 text-[9px] uppercase block">Agents Involved</span>
                          <span className="text-neutral-300 mt-0.5 block">
                            {conf.agentsInvolved.join(' ↔ ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[9px] uppercase block">Resolution Method</span>
                          <span className="text-indigo-400 mt-0.5 block font-bold">
                            {conf.resolutionMethod}
                          </span>
                        </div>

                        {conf.outcome && (
                          <div className="col-span-1 md:col-span-2 bg-neutral-900 p-2.5 rounded-lg border border-neutral-850 text-neutral-400 text-xs mt-2 leading-relaxed">
                            <span className="text-neutral-200 font-bold">OUTCOME:</span> {conf.outcome}
                          </div>
                        )}
                      </div>

                      {/* Force Manual override button */}
                      {!isResolved && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setManualOverrideConflictId(conf.id)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all"
                          >
                            Resolve via Manual Override
                          </button>
                        </div>
                      )}

                      {/* Manual Override mini form inline */}
                      {manualOverrideConflictId === conf.id && (
                        <form onSubmit={(e) => handleResolveConflict(conf.id, e)} className="mt-4 bg-neutral-900 p-3 rounded-xl border border-amber-500/30 space-y-3">
                          <div className="text-[10px] font-bold text-amber-400">
                            Enter SRE Overriding Justification:
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Overriding duplicate check. Candidate provided verifiable identity token."
                            value={overrideText}
                            onChange={(e) => setOverrideText(e.target.value)}
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                          />
                          <div className="flex justify-end gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => setManualOverrideConflictId(null)}
                              className="px-2 py-1 bg-neutral-800 text-neutral-400 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-indigo-600 text-white font-bold rounded"
                            >
                              Commit Override
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: METRICS */}
        {activeSubTab === 'metrics' && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Workflow Success vs failure rates */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-neutral-300 mb-4">Orchestration Outcomes History</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: 't-5d', Completed: 120, Failed: 2, Escalated: 1 },
                        { name: 't-4d', Completed: 180, Failed: 4, Escalated: 3 },
                        { name: 't-3d', Completed: 240, Failed: 1, Escalated: 2 },
                        { name: 't-2d', Completed: 310, Failed: 5, Escalated: 4 },
                        { name: 't-1d', Completed: 390, Failed: 3, Escalated: 1 },
                        { name: 'Current', Completed: 480, Failed: 6, Escalated: 3 }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#737373" style={{ fontSize: 10 }} />
                      <YAxis stroke="#737373" style={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: 11 }} />
                      <Legend style={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="Completed" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="Failed" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Agent Utilization distribution */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-neutral-300 mb-4">Agent Utilization Ratios</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Recruiter', Load: 45 },
                        { name: 'PM Agent', Load: 80 },
                        { name: 'Fraud Check', Load: 12 },
                        { name: 'Coach', Load: 25 },
                        { name: 'Hiring Advisor', Load: 15 }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#737373" style={{ fontSize: 9 }} />
                      <YAxis stroke="#737373" style={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: 11 }} />
                      <Bar dataKey="Load" name="Current Utilization (%)" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {agents.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 1 ? '#f59e0b' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: DATABASE & REGISTRY SCHEMAS */}
        {activeSubTab === 'schemas' && (
          <motion.div
            key="schemas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Database Registry specification visualizer */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" /> Relational Postgres Workflow Registries
              </h3>
              <p className="text-[10px] text-neutral-500 mb-6">
                Underlying relational schema blueprints matching Specification 10.0 requirements for full transaction immutability.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schema 1: Workflow Registry Table */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                  <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">table: kxa_workflows</span>
                    <span className="text-[9px] text-neutral-500 font-mono">PRIMARY KEY</span>
                  </div>
                  <div className="space-y-2 text-[11px] font-mono text-neutral-400">
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">id</span>
                      <span className="text-neutral-500">VARCHAR(64) [PK]</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">name</span>
                      <span className="text-neutral-500">VARCHAR(255)</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">workflow_type</span>
                      <span className="text-neutral-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">status</span>
                      <span className="text-neutral-500">VARCHAR(32)</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">priority_class</span>
                      <span className="text-neutral-500">VARCHAR(16)</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">started_at</span>
                      <span className="text-neutral-500">TIMESTAMP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-200">integrity_hash</span>
                      <span className="text-neutral-500">CHAR(64)</span>
                    </div>
                  </div>
                </div>

                {/* Schema 2: Task Assignment Table */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                  <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">table: kxa_tasks</span>
                    <span className="text-[9px] text-neutral-500 font-mono">FOREIGN KEYS</span>
                  </div>
                  <div className="space-y-2 text-[11px] font-mono text-neutral-400">
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">id</span>
                      <span className="text-neutral-500">VARCHAR(64) [PK]</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">workflow_id</span>
                      <span className="text-indigo-400">VARCHAR(64) [FK]</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">assigned_agent_id</span>
                      <span className="text-neutral-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">step_index</span>
                      <span className="text-neutral-500">INTEGER</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-200">duration_ms</span>
                      <span className="text-neutral-500">INTEGER</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-200">output_text</span>
                      <span className="text-neutral-500">TEXT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* REST API Playground Section */}
              <div className="mt-8 border-t border-neutral-800 pt-6">
                <h4 className="text-xs font-bold text-neutral-200 mb-4 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-indigo-400" /> Orchestrator API Playground
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Select Endpoint controls */}
                  <div className="lg:col-span-4 flex flex-col gap-2">
                    {[
                      { id: 'TRIGGER', label: 'POST /workflow/trigger', desc: 'Trigger workflow pipeline' },
                      { id: 'GET_GRAPH', label: 'GET /workflow/graph', desc: 'Retrieve step chain graphs' },
                      { id: 'CALIBRATE', label: 'POST /agents/balance', desc: 'Rebalance active loads' },
                      { id: 'RESOLVE_CONFLICT', label: 'POST /conflicts/resolve', desc: 'Resolve active disputes' }
                    ].map(endpoint => (
                      <button
                        key={endpoint.id}
                        onClick={() => setApiMethodSelected(endpoint.id as any)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${apiMethodSelected === endpoint.id ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100' : 'bg-neutral-900/50 border-neutral-850 text-neutral-400 hover:text-white'}`}
                      >
                        <div className="font-mono font-bold">{endpoint.label}</div>
                        <div className="text-[10px] text-neutral-500 mt-1">{endpoint.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* API response visual block */}
                  <div className="lg:col-span-8 bg-neutral-950 p-4 rounded-xl border border-neutral-850 font-mono text-[11px] h-64 overflow-y-auto custom-scrollbar">
                    <span className="text-neutral-500 block text-[9px] uppercase tracking-wider mb-2">API Response Blueprint:</span>
                    <pre className="text-indigo-300 leading-relaxed">
                      {JSON.stringify(apiPlaygroundResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: FAILOVER SELF-DIAGNOSTICS */}
        {activeSubTab === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Console Log terminal structure */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Autonomous SRE Self-Test Terminal</h3>
                  <p className="text-[10px] text-neutral-500">Initiates failover simulation, lock deadlock checkers, and workload balances.</p>
                </div>
                <button
                  onClick={executeDiagnosticsSuite}
                  disabled={isTestSuiteRunning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isTestSuiteRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Trigger Autonomous Failover & Load Scan
                </button>
              </div>

              {/* Black box terminal */}
              <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 font-mono text-[11px] text-neutral-300 h-80 overflow-y-auto space-y-2.5 custom-scrollbar">
                {diagnosticLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    {log.startsWith('✅') ? (
                      <span className="text-emerald-400 font-bold">{log}</span>
                    ) : log.startsWith('⚡') || log.includes('SCENARIO') ? (
                      <span className="text-indigo-400 font-extrabold">{log}</span>
                    ) : log.includes('Failed') || log.includes('offline') ? (
                      <span className="text-rose-400 font-bold">{log}</span>
                    ) : (
                      <span className="text-neutral-400">{log}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
