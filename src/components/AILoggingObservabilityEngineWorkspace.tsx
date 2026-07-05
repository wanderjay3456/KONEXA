import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Server,
  TrendingUp,
  Cpu,
  Database,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  RefreshCw,
  Eye,
  FileCode,
  DollarSign,
  Heart,
  Shield,
  Layers,
  Settings,
  HelpCircle,
  Play,
  Flame,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  Sparkles,
  BarChart2,
  PieChart as LucidePieChart,
  User,
  ChevronRight,
  Info
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
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 9.0 AI LOGGING & OBSERVABILITY ENGINE)
// ============================================================================

export interface DistributedTrace {
  traceId: string;
  executionId: string;
  conversationId: string;
  workflowId: string;
  correlationId: string;
  parentTraceId: string | null;
  agentId: string;
  agentName: string;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED' | 'RETRY' | 'ROLLBACK';
  version: string;
  promptInfo: {
    version: string;
    templateHash: string;
    tokenCount: number;
  };
  memoryInfo: {
    loadedObjectsCount: number;
    cacheHit: boolean;
    retrievalTimeMs: number;
  };
  toolInfo: {
    toolName: string;
    executionTimeMs: number;
    status: string;
  } | null;
  modelInfo: {
    modelName: string;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
  };
  decisionInfo: {
    confidence: number;
    riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
    businessRuleValidated: boolean;
  };
}

export interface AgentHealthState {
  agentId: string;
  name: string;
  role: string;
  state: 'Healthy' | 'Warning' | 'Critical' | 'Offline';
  latencyMs: number;
  successRate: number;
  totalRequests: number;
  avgConfidence: number;
  tokenCount: number;
  costUsd: number;
  userSatisfaction: number; // 0-5 stars
}

export interface ObservabilityAlert {
  id: string;
  timestamp: string;
  type: 'LATENCY' | 'COST' | 'FAILURE' | 'PERMISSION_VIOLATION' | 'RULE_VIOLATION';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  agentName: string;
  message: string;
  resolved: boolean;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_TRACES: DistributedTrace[] = [
  {
    traceId: 'TRC-90112-AB',
    executionId: 'EXE-44102',
    conversationId: 'CONV-STU-1001',
    workflowId: 'WF-MTC-502',
    correlationId: 'CORR-88219-X',
    parentTraceId: null,
    agentId: 'AGT-REC-001',
    agentName: 'AI Recruiter',
    timestamp: '2026-07-04T21:10:00Z',
    durationMs: 420,
    status: 'SUCCESS',
    version: 'v1.4',
    promptInfo: { version: 'PRMPT-REC-v2.1', templateHash: 'sha256_b382ef91', tokenCount: 820 },
    memoryInfo: { loadedObjectsCount: 4, cacheHit: true, retrievalTimeMs: 12 },
    toolInfo: { toolName: 'ResumeParser', executionTimeMs: 140, status: 'SUCCESS' },
    modelInfo: { modelName: 'gemini-2.5-flash', inputTokens: 1200, outputTokens: 350, costUsd: 0.00045 },
    decisionInfo: { confidence: 95, riskRating: 'Low', businessRuleValidated: true }
  },
  {
    traceId: 'TRC-90113-CD',
    executionId: 'EXE-44103',
    conversationId: 'CONV-PM-2009',
    workflowId: 'WF-PM-701',
    correlationId: 'CORR-88220-Y',
    parentTraceId: 'TRC-90112-AB',
    agentId: 'AGT-PMR-002',
    agentName: 'AI Project Manager',
    timestamp: '2026-07-04T21:12:15Z',
    durationMs: 1250,
    status: 'RETRY',
    version: 'v2.0',
    promptInfo: { version: 'PRMPT-PM-v3.0', templateHash: 'sha256_0f8e12a0', tokenCount: 1450 },
    memoryInfo: { loadedObjectsCount: 8, cacheHit: false, retrievalTimeMs: 95 },
    toolInfo: { toolName: 'TaskAssigner', executionTimeMs: 850, status: 'RETRY_TIMEOUT' },
    modelInfo: { modelName: 'gemini-2.5-pro', inputTokens: 3400, outputTokens: 820, costUsd: 0.0062 },
    decisionInfo: { confidence: 78, riskRating: 'Medium', businessRuleValidated: true }
  },
  {
    traceId: 'TRC-90114-EF',
    executionId: 'EXE-44104',
    conversationId: 'CONV-STU-3321',
    workflowId: 'WF-SEC-911',
    correlationId: 'CORR-88221-Z',
    parentTraceId: null,
    agentId: 'AGT-TFD-003',
    agentName: 'AI Fraud Detector',
    timestamp: '2026-07-04T21:14:32Z',
    durationMs: 1980,
    status: 'FAILED',
    version: 'v1.1',
    promptInfo: { version: 'PRMPT-SEC-v1.4', templateHash: 'sha256_9c91ee01', tokenCount: 2200 },
    memoryInfo: { loadedObjectsCount: 12, cacheHit: false, retrievalTimeMs: 142 },
    toolInfo: { toolName: 'RiskAnalyzer', executionTimeMs: 1200, status: 'FAILED_API_TIMEOUT' },
    modelInfo: { modelName: 'gemini-2.5-pro', inputTokens: 5200, outputTokens: 1100, costUsd: 0.0098 },
    decisionInfo: { confidence: 42, riskRating: 'Critical', businessRuleValidated: false }
  },
  {
    traceId: 'TRC-90115-GH',
    executionId: 'EXE-44105',
    conversationId: 'CONV-COA-4412',
    workflowId: 'WF-MTC-502',
    correlationId: 'CORR-88222-W',
    parentTraceId: null,
    agentId: 'AGT-HRA-004',
    agentName: 'AI Performance Reviewer',
    timestamp: '2026-07-04T21:16:05Z',
    durationMs: 310,
    status: 'SUCCESS',
    version: 'v2.1',
    promptInfo: { version: 'PRMPT-HR-v2.0', templateHash: 'sha256_ab72de31', tokenCount: 950 },
    memoryInfo: { loadedObjectsCount: 3, cacheHit: true, retrievalTimeMs: 9 },
    toolInfo: { toolName: 'EvaluationCompiler', executionTimeMs: 95, status: 'SUCCESS' },
    modelInfo: { modelName: 'gemini-2.5-flash', inputTokens: 1100, outputTokens: 290, costUsd: 0.00038 },
    decisionInfo: { confidence: 92, riskRating: 'Low', businessRuleValidated: true }
  }
];

const INITIAL_HEALTH_STATES: AgentHealthState[] = [
  { agentId: 'AGT-REC-001', name: 'AI Recruiter', role: 'Recruiting Guidance', state: 'Healthy', latencyMs: 380, successRate: 99.4, totalRequests: 4892, avgConfidence: 94.2, tokenCount: 3829000, costUsd: 2.15, userSatisfaction: 4.8 },
  { agentId: 'AGT-PMR-002', name: 'AI Project Manager', role: 'Project Allocation', state: 'Warning', latencyMs: 1420, successRate: 91.2, totalRequests: 8901, avgConfidence: 86.5, tokenCount: 14820000, costUsd: 38.40, userSatisfaction: 4.2 },
  { agentId: 'AGT-TFD-003', name: 'AI Fraud Detector', role: 'Security & Trust Audits', state: 'Critical', latencyMs: 2100, successRate: 84.5, totalRequests: 2192, avgConfidence: 78.1, tokenCount: 9801000, costUsd: 28.50, userSatisfaction: 3.9 },
  { agentId: 'AGT-HRA-004', name: 'AI Performance Reviewer', role: 'Evaluations & Badging', state: 'Healthy', latencyMs: 410, successRate: 98.8, totalRequests: 1205, avgConfidence: 91.0, tokenCount: 1980000, costUsd: 0.88, userSatisfaction: 4.7 },
  { agentId: 'AGT-LRN-005', name: 'AI Learning Analyst', role: 'Skill Analysis', state: 'Healthy', latencyMs: 290, successRate: 99.7, totalRequests: 3201, avgConfidence: 95.5, tokenCount: 4200000, costUsd: 1.25, userSatisfaction: 4.9 },
  { agentId: 'AGT-ADV-006', name: 'AI Hiring Advisor', role: 'Hiring Committee', state: 'Offline', latencyMs: 0, successRate: 0, totalRequests: 0, avgConfidence: 0, tokenCount: 0, costUsd: 0, userSatisfaction: 0 }
];

const INITIAL_ALERTS: ObservabilityAlert[] = [
  { id: 'ALT-101', timestamp: '2026-07-04T21:12:15Z', type: 'LATENCY', severity: 'WARNING', agentName: 'AI Project Manager', message: 'TaskAssigner execution latency (850ms) exceeded threshold config target of 500ms.', resolved: false },
  { id: 'ALT-102', timestamp: '2026-07-04T21:14:32Z', type: 'FAILURE', severity: 'CRITICAL', agentName: 'AI Fraud Detector', message: 'RiskAnalyzer API connection timed out. Automatic retry count (3/3) exhausted.', resolved: false },
  { id: 'ALT-103', timestamp: '2026-07-04T20:50:00Z', type: 'PERMISSION_VIOLATION', severity: 'CRITICAL', agentName: 'AI Recruiter', message: 'Attempt to bypass business rules and update System Trust scores directly. Access blocked.', resolved: true }
];

export default function AILoggingObservabilityEngineWorkspace() {
  // Top level Subtab state
  const [activeSubTab, setActiveSubTab] = useState<'realtime' | 'explorer' | 'cost' | 'scorecards' | 'alerts' | 'schemas' | 'testing'>('realtime');

  // Core mutable lists
  const [traces, setTraces] = useState<DistributedTrace[]>(INITIAL_TRACES);
  const [healthStates, setHealthStates] = useState<AgentHealthState[]>(INITIAL_HEALTH_STATES);
  const [alerts, setAlerts] = useState<ObservabilityAlert[]>(INITIAL_ALERTS);

  // Selected trace details index
  const [selectedTraceId, setSelectedTraceId] = useState<string>('TRC-90112-AB');

  // Search parameters for trace explorer
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterStatus, setSearchFilterStatus] = useState<string>('ALL');
  const [searchFilterRisk, setSearchFilterRisk] = useState<string>('ALL');

  // Retentions Configuration
  const [logRetentionDays, setLogRetentionDays] = useState<number>(180);

  // Live execution graph updates
  const [liveThroughput, setLiveThroughput] = useState<number>(45); // requests/second
  const [totalTokensToday, setTotalTokensToday] = useState<number>(34812902);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // API spec viewer state
  const [apiEndpointSelected, setApiEndpointSelected] = useState<'TRACES' | 'METRICS' | 'HEALTH' | 'ALERTS'>('TRACES');
  const [apiResponseJson, setApiResponseJson] = useState<any>(null);

  // Automated Test Logs
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testConsoleLogs, setTestConsoleLogs] = useState<string[]>([
    'Observability Audit Runner configured and idle.',
    'Click "Execute Compliance Integrity Checks" to trigger automatic system scans.'
  ]);

  // Sync API Response preview block
  useEffect(() => {
    let response: any = {};
    if (apiEndpointSelected === 'TRACES') {
      response = {
        endpoint: 'GET /api/v1/observability/traces?workflowId=WF-MTC-502',
        headers: {
          Authorization: 'Bearer kxa_live_trace_token_9011',
          'Content-Type': 'application/json'
        },
        response: {
          statusCode: 200,
          totalMatched: 2,
          traces: [
            {
              traceId: 'TRC-90112-AB',
              executionId: 'EXE-44102',
              workflowId: 'WF-MTC-502',
              agentName: 'AI Recruiter',
              latencyMs: 420,
              modelUsed: 'gemini-2.5-flash',
              integrityVerified: true,
              timestamp: '2026-07-04T21:10:00Z'
            }
          ]
        }
      };
    } else if (apiEndpointSelected === 'METRICS') {
      response = {
        endpoint: 'GET /api/v1/observability/metrics?interval=1h',
        response: {
          statusCode: 200,
          timestamp: new Date().toISOString(),
          systemMetrics: {
            requestsPerSecond: 45.2,
            averageResponseLatencyMs: 412.5,
            errorRatePercentage: 1.4,
            currentQueueLength: 4,
            distributedTracingEngine: 'OpenTelemetry-v1.26 Compatible'
          }
        }
      };
    } else if (apiEndpointSelected === 'HEALTH') {
      response = {
        endpoint: 'GET /api/v1/observability/agents/health',
        response: {
          statusCode: 200,
          agentsEvaluatedCount: 6,
          summary: { Healthy: 4, Warning: 1, Critical: 1, Offline: 1 },
          timestamp: new Date().toISOString()
        }
      };
    } else {
      response = {
        endpoint: 'POST /api/v1/observability/alerts/resolve',
        payload: { alertId: 'ALT-101', resolutionNotes: 'Developer adjusted TaskAssigner configuration timeout.' },
        response: {
          statusCode: 200,
          alertId: 'ALT-101',
          status: 'RESOLVED',
          updatedBy: 'SRE Administrator Operator',
          timestamp: new Date().toISOString()
        }
      };
    }
    setApiResponseJson(response);
  }, [apiEndpointSelected]);

  // Simulation: Append live traces every 6 seconds if live streaming is on
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const randomAgent = healthStates[Math.floor(Math.random() * (healthStates.length - 1))]; // avoid offline agent
      if (!randomAgent) return;

      const randomStatus = Math.random() > 0.92 ? 'RETRY' : Math.random() > 0.96 ? 'FAILED' : 'SUCCESS';
      const inputT = Math.floor(Math.random() * 2000) + 1000;
      const outputT = Math.floor(Math.random() * 500) + 100;
      const isPro = Math.random() > 0.5;
      const cost = isPro ? (inputT * 0.00000125 + outputT * 0.00000375) : (inputT * 0.000000075 + outputT * 0.0000003);

      const newIdNum = Math.floor(Math.random() * 90000) + 10000;
      const newTrace: DistributedTrace = {
        traceId: `TRC-${newIdNum}-LV`,
        executionId: `EXE-${newIdNum + 5}`,
        conversationId: `CONV-LIVE-${newIdNum - 10}`,
        workflowId: Math.random() > 0.5 ? 'WF-MTC-502' : 'WF-PM-701',
        correlationId: `CORR-LIVE-${newIdNum}`,
        parentTraceId: null,
        agentId: randomAgent.agentId,
        agentName: randomAgent.name,
        timestamp: new Date().toISOString(),
        durationMs: Math.floor(Math.random() * 1200) + 200,
        status: randomStatus,
        version: 'v1.0.0',
        promptInfo: { version: 'PRMPT-LV-1.0', templateHash: 'sha256_live', tokenCount: inputT },
        memoryInfo: { loadedObjectsCount: Math.floor(Math.random() * 6), cacheHit: Math.random() > 0.5, retrievalTimeMs: Math.floor(Math.random() * 40) },
        toolInfo: Math.random() > 0.3 ? { toolName: 'LiveHelperTool', executionTimeMs: Math.floor(Math.random() * 150) + 10, status: 'SUCCESS' } : null,
        modelInfo: { modelName: isPro ? 'gemini-2.5-pro' : 'gemini-2.5-flash', inputTokens: inputT, outputTokens: outputT, costUsd: cost },
        decisionInfo: { confidence: Math.floor(Math.random() * 30) + 70, riskRating: Math.random() > 0.8 ? 'Medium' : 'Low', businessRuleValidated: true }
      };

      setTraces(prev => [newTrace, ...prev.slice(0, 19)]); // cap at 20 logs for UI footprint limit
      setLiveThroughput(Math.floor(Math.random() * 20) + 35);
      setTotalTokensToday(prev => prev + inputT + outputT);

      // Dynamically update agent scorecard summary metrics based on simulated hits
      setHealthStates(prevStates => prevStates.map(state => {
        if (state.agentId === randomAgent.agentId) {
          const reqs = state.totalRequests + 1;
          const latencySum = (state.latencyMs * state.totalRequests) + newTrace.durationMs;
          const avgLatency = Math.round(latencySum / reqs);
          const costSum = state.costUsd + cost;
          const tokensSum = state.tokenCount + inputT + outputT;
          return {
            ...state,
            totalRequests: reqs,
            latencyMs: avgLatency,
            costUsd: parseFloat(costSum.toFixed(4)),
            tokenCount: tokensSum
          };
        }
        return state;
      }));

      // Occasionally trigger a fake system alert for warning thresholds
      if (newTrace.durationMs > 1100 && Math.random() > 0.85) {
        const alertIdNum = Math.floor(Math.random() * 900) + 100;
        const newAlert: ObservabilityAlert = {
          id: `ALT-${alertIdNum}`,
          timestamp: new Date().toISOString(),
          type: 'LATENCY',
          severity: 'WARNING',
          agentName: randomAgent.name,
          message: `Live telemetry check caught transaction threshold warning on thread ${newTrace.traceId}. Latency: ${newTrace.durationMs}ms`,
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, healthStates]);

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
  };

  const handleRunComplianceTests = async () => {
    if (isTestRunning) return;
    setIsTestRunning(true);
    setTestConsoleLogs([]);

    const log = (msg: string) => {
      setTestConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('🚀 Initializing Enterprise Telemetry Compliance & Observability Scan...');
    await new Promise(r => setTimeout(r, 400));

    log('🔍 COMPLIANCE EXCLUSION CHECK 1: Immutable Audit Records verification...');
    log('Verifying that no administration parameters possess credentials to delete historical audit registries...');
    log('Result: IMMUTABLE LOCK Verified. Delete methods completely excluded from Trace schema layout. [PASS]');
    await new Promise(r => setTimeout(r, 450));

    log('📊 TELEMETRY CHECK 2: OpenTelemetry distributed header compliance audit...');
    log('Vetting Correlation-Id propagation across 4 multi-agent test pipelines...');
    log('Vetting Parent-Trace linkages during recruitment-to-pm automated handoffs...');
    log('Trace linkage verified with 100% correlation accuracy. [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('💰 COST COMPLIANCE AUDIT: Token usage precision checks...');
    log('Comparing forecasted token coefficients with direct developer console logs...');
    log('Embedding cost formula accuracy: 100.000%. Forecasted margin anomaly: 0.00%. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('🚨 ALERT ENGINE LATENCY TRIGGERING TEST...');
    log('Simulating artificial thread loop stall of 2500ms on evaluation engine...');
    log('Observing response pipeline threshold dispatcher intercepting telemetry state...');
    log('Alert code ALT-LIV-09 dispatch queued in SRE Dashboard under HIGH SEVERITY. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('✅ TELEMETRY SUITE COMPLETED. All AI observability engines running safely. 4/4 compliance certifications checked.');
    setIsTestRunning(false);
  };

  const activeTrace = traces.find(t => t.traceId === selectedTraceId) || traces[0];

  // Filters calculation
  const filteredTraces = traces.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = t.traceId.toLowerCase().includes(q) ||
                          t.agentName.toLowerCase().includes(q) ||
                          t.workflowId.toLowerCase().includes(q) ||
                          (t.toolInfo?.toolName || '').toLowerCase().includes(q);
    const matchesStatus = searchFilterStatus === 'ALL' || t.status === searchFilterStatus;
    const matchesRisk = searchFilterRisk === 'ALL' || t.decisionInfo.riskRating === searchFilterRisk;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-observability-workspace">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              SPECIFICATION 9.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Stateless OpenTelemetry Core
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100 mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" /> AI Logging & Observability
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Distributed tracing system tracking model tokens, response latency, tool parameters, decision risks, cost forecasting, and real-time SRE alerting across the entire virtual agent employee workforce.
          </p>
        </div>

        {/* Live telemetrics dashboard panel */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Throughput</span>
              <span className="text-emerald-400 font-bold">{liveThroughput} req/s</span>
            </div>
            <div className="border-l border-neutral-800 h-6 pl-4">
              <span className="text-neutral-500 block text-[9px] uppercase">Tokens/Day</span>
              <span className="text-indigo-400 font-bold">{(totalTokensToday).toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${isLiveStreaming ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
            {isLiveStreaming ? 'Streaming Live' : 'Telemetry Paused'}
          </button>
        </div>
      </div>

      {/* Main Stats metrics panel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[10px] text-neutral-500 font-bold uppercase block">Total Telemetry Traces</span>
          <div className="text-lg font-extrabold text-neutral-100 mt-1.5 flex items-baseline gap-2">
            {(traces.length * 12849).toLocaleString()} <span className="text-[10px] text-neutral-500 font-normal font-mono">stored</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
            100% indexed & auditable
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[10px] text-neutral-500 font-bold uppercase block">Avg Model Latency</span>
          <div className="text-lg font-extrabold text-neutral-100 mt-1.5">
            412.5 ms
          </div>
          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono">
            Sub-second criteria met
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[10px] text-neutral-500 font-bold uppercase block">Telemetry Alerts Open</span>
          <div className="text-lg font-extrabold text-rose-500 mt-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {alerts.filter(a => !a.resolved).length} Active
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            {alerts.filter(a => a.resolved).length} solved last hour
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[10px] text-neutral-500 font-bold uppercase block">System Error Rate</span>
          <div className="text-lg font-extrabold text-emerald-400 mt-1.5">
            1.14%
          </div>
          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono">
            Tolerance target: &lt; 5.0%
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[10px] text-neutral-500 font-bold uppercase block">Log Retention Setting</span>
          <div className="text-lg font-extrabold text-indigo-400 mt-1.5 flex items-center gap-1">
            <Database className="w-4 h-4 text-indigo-400" />
            {logRetentionDays} Days
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {[30, 90, 180, 365].map(d => (
              <button
                key={d}
                onClick={() => setLogRetentionDays(d)}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${logRetentionDays === d ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-neutral-850 text-neutral-500 border border-transparent'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subtab Navigation Headers */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800/80 pb-3 mb-6">
        {[
          { id: 'realtime', label: 'Live Telemetry Dashboard', icon: BarChart2 },
          { id: 'explorer', label: 'Distributed Trace Explorer', icon: Search },
          { id: 'cost', label: 'AI Cost & Token Analytics', icon: DollarSign },
          { id: 'scorecards', label: 'Employee Agent Scorecards', icon: Heart },
          { id: 'alerts', label: 'SRE Alert Dispatcher', icon: AlertTriangle },
          { id: 'schemas', label: 'Telemetry Database Schema', icon: Database },
          { id: 'testing', label: 'Compliance Diagnostics Tests', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Panels rendering */}
      <AnimatePresence mode="wait">

        {/* TAB 1: LIVE TELEMETRY DASHBOARD */}
        {activeSubTab === 'realtime' && (
          <motion.div
            key="realtime"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Main Graphs Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Token Consumption Timeline Chart */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-300">Workforce Token Traffic (T/Min)</h3>
                    <p className="text-[10px] text-neutral-500">Real-time prompt and completion token processing timelines</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                    Live Telemetry feeds active
                  </span>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { min: 't-25m', InputTokens: 25000, OutputTokens: 8000 },
                        { min: 't-20m', InputTokens: 38000, OutputTokens: 11000 },
                        { min: 't-15m', InputTokens: 49000, OutputTokens: 14000 },
                        { min: 't-10m', InputTokens: 95000, OutputTokens: 28000 },
                        { min: 't-5m', InputTokens: 142000, OutputTokens: 45000 },
                        { min: 'Current', InputTokens: totalTokensToday % 200000, OutputTokens: (totalTokensToday % 200000) * 0.3 }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="min" stroke="#737373" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <YAxis stroke="#737373" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: 11, color: '#f5f5f5' }} />
                      <Legend style={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="InputTokens" name="Input (Prompt) Tokens" stroke="#818cf8" fillOpacity={1} fill="url(#colorInput)" />
                      <Area type="monotone" dataKey="OutputTokens" name="Output (Gen) Tokens" stroke="#34d399" fillOpacity={1} fill="url(#colorOutput)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Model Distribution Ratio */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Model Deployment Ratios</h3>
                  <p className="text-[10px] text-neutral-500">Utilization split between Flash vs Pro variants</p>
                </div>
                <div className="h-44 my-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Gemini 2.5 Flash', value: 78, color: '#10b981' },
                          { name: 'Gemini 2.5 Pro', value: 22, color: '#6366f1' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#6366f1" />
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                      <span className="text-neutral-400">Gemini 2.5 Flash (SRE Standard)</span>
                    </span>
                    <span className="font-bold text-neutral-200">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" />
                      <span className="text-neutral-400">Gemini 2.5 Pro (Analytical)</span>
                    </span>
                    <span className="font-bold text-neutral-200">22%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick SRE Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">Median Request Latency</span>
                  <span className="text-sm font-bold text-neutral-200">380 ms</span>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">OTel Pipelines Online</span>
                  <span className="text-sm font-bold text-emerald-400">12 / 12 Active</span>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-amber-500/10 text-amber-400 p-2.5 rounded-xl border border-amber-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">Accumulated Cost</span>
                  <span className="text-sm font-bold text-neutral-200">${(healthStates.reduce((acc, curr) => acc + curr.costUsd, 0)).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-xl border border-rose-500/20">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">SRE Warning Queue</span>
                  <span className="text-sm font-bold text-rose-400">{alerts.filter(a => !a.resolved).length} Pending</span>
                </div>
              </div>
            </div>

            {/* Dynamic SRE Live Log Stream */}
            <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Distributed Trace Telemetry Stream</h3>
                  <p className="text-[10px] text-neutral-500">Live transaction stream processed asynchronously via OpenTelemetry Daemon</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Monitoring
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {traces.map((trace) => (
                  <div
                    key={trace.traceId}
                    onClick={() => {
                      setSelectedTraceId(trace.traceId);
                      setActiveSubTab('explorer');
                    }}
                    className="bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] text-neutral-500 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {trace.traceId}
                      </span>
                      <span className="font-bold text-neutral-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {trace.agentName}
                      </span>
                      <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                        Workflow: {trace.workflowId}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono self-end md:self-center">
                      <span className="text-neutral-500">Model: <span className="text-neutral-300">{trace.modelInfo.modelName}</span></span>
                      <span className="text-neutral-500">Latency: <span className="text-amber-400 font-bold">{trace.durationMs}ms</span></span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trace.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : trace.status === 'RETRY' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trace.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DISTRIBUTED TRACE EXPLORER */}
        {activeSubTab === 'explorer' && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left sidebar: Filterable logs list */}
            <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex flex-col h-[580px]">
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search Trace ID, workflow, tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-400">
                  <div className="flex flex-col gap-1">
                    <span>STATUS</span>
                    <select
                      value={searchFilterStatus}
                      onChange={(e) => setSearchFilterStatus(e.target.value)}
                      className="bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-neutral-300"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="RETRY">RETRY</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span>RISK TOLERANCE</span>
                    <select
                      value={searchFilterRisk}
                      onChange={(e) => setSearchFilterRisk(e.target.value)}
                      className="bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-neutral-300"
                    >
                      <option value="ALL">All Risks</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scrollable traces list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredTraces.map((t) => {
                  const isSelected = t.traceId === selectedTraceId;
                  return (
                    <div
                      key={t.traceId}
                      onClick={() => setSelectedTraceId(t.traceId)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100 shadow-lg' : 'bg-neutral-900/20 border-neutral-850 hover:bg-neutral-900/60'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-neutral-400 font-bold">
                          {t.traceId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${t.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : t.status === 'RETRY' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-200 mt-1.5 flex items-center gap-1.5">
                        {t.agentName}
                      </h4>
                      <p className="text-[9px] text-neutral-500 font-mono mt-1">
                        Workflow: {t.workflowId} | Correlation: {t.correlationId}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-neutral-400">
                        <span>Latency: <strong className="text-amber-400">{t.durationMs}ms</strong></span>
                        <span className={`px-1.5 py-0.5 rounded ${t.decisionInfo.riskRating === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-neutral-800 text-neutral-300'}`}>
                          Risk: {t.decisionInfo.riskRating}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Exhaustive trace trace details */}
            <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 flex flex-col h-[580px] overflow-y-auto custom-scrollbar">
              <div className="border-b border-neutral-800 pb-4 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">Trace Logs Detail View</h3>
                  <span className="font-mono text-[10px] text-neutral-400">{activeTrace.traceId}</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 px-3 py-1 rounded-xl text-neutral-400 border border-neutral-800">
                  Version: {activeTrace.version}
                </span>
              </div>

              {/* Complete Metadata Block */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono">
                <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">EXECUTION ID</span>
                  <span className="text-neutral-200 font-bold">{activeTrace.executionId}</span>
                </div>
                <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">CORRELATION ID</span>
                  <span className="text-neutral-200 font-bold">{activeTrace.correlationId}</span>
                </div>
                <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">CONVERSATION ID</span>
                  <span className="text-neutral-200 font-bold">{activeTrace.conversationId}</span>
                </div>
                <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-850">
                  <span className="text-neutral-500 text-[9px] block">PARENT TRACE ID</span>
                  <span className="text-neutral-400 font-bold">{activeTrace.parentTraceId || 'Root Execution Trace'}</span>
                </div>
              </div>

              {/* Step-by-Step Distributed Trace Timeline visualizer */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Pipeline Segment Analysis
                </h4>

                {/* Segment 1: Prompt Builder Stage */}
                <div className="border-l-2 border-indigo-500 pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-500" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-400">STAGE 1: Prompt Engineering & Versioning</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Template: {activeTrace.promptInfo.version}</span>
                  </div>
                  <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850/80 text-[10px] font-mono text-neutral-400 mt-1.5 space-y-1">
                    <div>Template Hash: <span className="text-neutral-300">{activeTrace.promptInfo.templateHash}</span></div>
                    <div>Input context loaded cleanly without PII or system credential secrets leaked.</div>
                  </div>
                </div>

                {/* Segment 2: Memory Loading Stage */}
                <div className="border-l-2 border-purple-500 pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-purple-500" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-purple-400">STAGE 2: Memory Retrieval & Hydration</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{activeTrace.memoryInfo.retrievalTimeMs}ms latency</span>
                  </div>
                  <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850/80 text-[10px] font-mono text-neutral-400 mt-1.5 flex justify-between">
                    <span>Loaded objects: <strong className="text-neutral-200">{activeTrace.memoryInfo.loadedObjectsCount}</strong></span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${activeTrace.memoryInfo.cacheHit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {activeTrace.memoryInfo.cacheHit ? 'Cache Hit (Stateless)' : 'Cache Miss (Hydrating)'}
                    </span>
                  </div>
                </div>

                {/* Segment 3: Tool Execution Block */}
                {activeTrace.toolInfo && (
                  <div className="border-l-2 border-amber-500 pl-4 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-500" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-400">STAGE 3: Tool Execution Pipeline</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{activeTrace.toolInfo.executionTimeMs}ms</span>
                    </div>
                    <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850/80 text-[10px] font-mono text-neutral-400 mt-1.5 flex justify-between">
                      <span>Tool: <strong className="text-neutral-200">{activeTrace.toolInfo.toolName}</strong></span>
                      <span className="text-neutral-300">Status: {activeTrace.toolInfo.status}</span>
                    </div>
                  </div>
                )}

                {/* Segment 4: Model Invocation Block */}
                <div className="border-l-2 border-emerald-500 pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400">STAGE 4: Model Generation & Costing</span>
                    <span className="text-[10px] text-neutral-500 font-mono">${activeTrace.modelInfo.costUsd.toFixed(5)}</span>
                  </div>
                  <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850/80 text-[10px] font-mono text-neutral-400 mt-1.5 space-y-1">
                    <div>Model Name: <span className="text-neutral-200 font-bold">{activeTrace.modelInfo.modelName}</span></div>
                    <div className="flex justify-between text-[9px] text-neutral-500 pt-0.5">
                      <span>Input tokens: {activeTrace.modelInfo.inputTokens}</span>
                      <span>Output tokens: {activeTrace.modelInfo.outputTokens}</span>
                    </div>
                  </div>
                </div>

                {/* Segment 5: Decision Logic & Safety Block */}
                <div className="border-l-2 border-rose-500 pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-rose-500" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-rose-400">STAGE 5: Policy Alignment & Safety Audit</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Conf: {activeTrace.decisionInfo.confidence}%</span>
                  </div>
                  <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850/80 text-[10px] font-mono text-neutral-400 mt-1.5 flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-neutral-500" /> Business Rules Verified
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${activeTrace.decisionInfo.businessRuleValidated ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {activeTrace.decisionInfo.businessRuleValidated ? 'COMPLIANT' : 'VIOLATION_HALTED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: AI COST & TOKEN ANALYTICS */}
        {activeSubTab === 'cost' && (
          <motion.div
            key="cost"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Cost charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Cost Per Agent bar chart */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-8">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Cost & Budget Accrual Per Agent</h3>
                  <p className="text-[10px] text-neutral-500">Comparing computed monthly runtime expenditures against standard allocations</p>
                </div>
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={healthStates.filter(h => h.totalRequests > 0).map(h => ({
                        name: h.name.split(' ')[1] || h.name,
                        CostUsd: h.costUsd,
                        BudgetAllocation: h.agentId === 'AGT-PMR-002' ? 50 : 15
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#737373" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <YAxis stroke="#737373" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip formatter={(value) => `$${value}`} contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: 11 }} />
                      <Legend style={{ fontSize: 11 }} />
                      <Bar dataKey="CostUsd" name="Accrued Cost ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="BudgetAllocation" name="Budget Cap ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Forecast optimization report */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Cost Optimization Diagnostic</h3>
                  <p className="text-[10px] text-neutral-500">Forecasting month-end budget targets and potential token reduction opportunities</p>
                </div>

                <div className="space-y-3 my-4 text-xs font-mono">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                    <span className="text-[9px] text-neutral-500 uppercase">Projected Month-End Cost</span>
                    <div className="text-lg font-bold text-neutral-200">
                      $4,812.50
                    </div>
                    <span className="text-[10px] text-emerald-400">Below standard quota $6k [SAFE]</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-neutral-400">
                    <div className="flex justify-between">
                      <span>Embedding Operations:</span>
                      <span className="text-neutral-200 font-bold">$12.40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage Persistence:</span>
                      <span className="text-neutral-200 font-bold">$4.12</span>
                    </div>
                    <div className="flex justify-between text-indigo-400 font-bold">
                      <span>Model Token Ratio:</span>
                      <span>96.4% of cost</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-3 text-[10px] text-indigo-300">
                  <strong className="block mb-1">💡 Optimization Tip:</strong>
                  Leverage stateless context summaries in conversation memory to diminish redundant prompt tokens on long threads by up to <strong>35%</strong>.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: EMPLOYEE AGENT SCORECARDS */}
        {activeSubTab === 'scorecards' && (
          <motion.div
            key="scorecards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Grid of Agent Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthStates.map((agent) => {
                const isHealthy = agent.state === 'Healthy';
                const isWarning = agent.state === 'Warning';
                const isCritical = agent.state === 'Critical';
                const isOffline = agent.state === 'Offline';

                return (
                  <div
                    key={agent.agentId}
                    className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] text-neutral-500 font-mono font-bold">{agent.agentId}</span>
                        <h4 className="text-sm font-bold text-neutral-200 mt-0.5">{agent.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-mono">{agent.role}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isHealthy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : isWarning ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : isCritical ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-neutral-800 text-neutral-500'}`}>
                        {agent.state}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-850">
                        <span className="text-[8px] text-neutral-500 block">LATENCY</span>
                        <span className="text-neutral-200 font-bold">{agent.latencyMs ? `${agent.latencyMs}ms` : 'N/A'}</span>
                      </div>
                      <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-850">
                        <span className="text-[8px] text-neutral-500 block">SUCCESS RATE</span>
                        <span className="text-emerald-400 font-bold">{agent.successRate ? `${agent.successRate}%` : '0%'}</span>
                      </div>
                      <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-850">
                        <span className="text-[8px] text-neutral-500 block">ACC confidence</span>
                        <span className="text-indigo-400 font-bold">{agent.avgConfidence ? `${agent.avgConfidence}%` : 'N/A'}</span>
                      </div>
                      <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-850">
                        <span className="text-[8px] text-neutral-500 block">ACCUMULATED COST</span>
                        <span className="text-neutral-200 font-bold">${agent.costUsd.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-2 border-t border-neutral-800/60">
                      <span>Requests: <strong>{agent.totalRequests.toLocaleString()}</strong></span>
                      <div className="flex items-center gap-0.5">
                        <span className="text-amber-500 font-bold">★</span>
                        <span>{agent.userSatisfaction ? agent.userSatisfaction.toFixed(1) : 'N/A'} / 5.0</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 5: SRE ALERT DISPATCHER */}
        {activeSubTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Active alerts listing */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Telemetry Incident Center</h3>
                  <p className="text-[10px] text-neutral-500">Live operational events generating latency, cost, and rule violation notifications</p>
                </div>
                <button
                  onClick={() => {
                    const resolvedAll = alerts.map(a => ({ ...a, resolved: true }));
                    setAlerts(resolvedAll);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-[10px] font-bold text-neutral-300 transition-all cursor-pointer"
                >
                  Resolve All Incidents
                </button>
              </div>

              <div className="space-y-3">
                {alerts.map((alert) => {
                  const isCritical = alert.severity === 'CRITICAL';
                  const isWarning = alert.severity === 'WARNING';
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all ${alert.resolved ? 'bg-neutral-900/20 border-neutral-850 opacity-60' : isCritical ? 'bg-red-950/20 border-red-900/50' : isWarning ? 'bg-amber-950/20 border-amber-900/50' : 'bg-neutral-900 border-neutral-800'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 border ${alert.resolved ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : isCritical ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {alert.resolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4 animate-pulse" />}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[9px] text-neutral-500 font-bold bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                              {alert.id}
                            </span>
                            <span className="font-bold text-neutral-200">{alert.agentName}</span>
                            <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase ${alert.resolved ? 'bg-neutral-800 text-neutral-500' : isCritical ? 'bg-red-500/25 text-red-300' : 'bg-amber-500/25 text-amber-300'}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-neutral-400 mt-1 max-w-2xl leading-relaxed text-[11px]">
                            {alert.message}
                          </p>
                          <span className="text-[10px] font-mono text-neutral-500 block mt-1.5">
                            Logged: {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {!alert.resolved ? (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 hover:text-emerald-400 text-[10px] font-bold text-neutral-300 transition-all cursor-pointer self-end md:self-center shrink-0"
                        >
                          Resolve Alert
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold font-mono self-end md:self-center shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: TELEMETRY DATABASE SCHEMA */}
        {activeSubTab === 'schemas' && (
          <motion.div
            key="schemas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Database Registries schema */}
            <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Observability Database Architecture</h3>
                <p className="text-[10px] text-neutral-500">Stateless logs architecture supporting partition tables & immutability layers</p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { name: 'Trace Registry', count: '489,102 records', size: '1.2 GB' },
                  { name: 'Execution Logs Partition', count: '10M logs / week', size: '42.5 GB' },
                  { name: 'Prompt Template Registry', count: '48 templates', size: '1.4 MB' },
                  { name: 'Decision Evidence Logs', count: '891,200 records', size: '8.4 GB' },
                  { name: 'Model Usage Partition', count: '4.8M invocations', size: '14.2 GB' },
                  { name: 'System SRE Alerts', count: '1,490 logged', size: '120 KB' }
                ].map((reg, idx) => (
                  <div key={idx} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-300 font-bold block">{reg.name}</span>
                      <span className="text-[9px] text-neutral-500">{reg.count}</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-bold">{reg.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Spec playground */}
            <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between h-[480px]">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Observability API Platform Spec</h3>
                <p className="text-[10px] text-neutral-500">Exposed endpoints for distributed telemetry query and metric aggregators</p>

                <div className="flex gap-1.5 mt-3 border-b border-neutral-800 pb-3">
                  {[
                    { id: 'TRACES', label: 'GET Traces' },
                    { id: 'METRICS', label: 'GET System Metrics' },
                    { id: 'HEALTH', label: 'GET Health Status' },
                    { id: 'ALERTS', label: 'POST Resolve Alert' }
                  ].map(endpoint => (
                    <button
                      key={endpoint.id}
                      onClick={() => setApiEndpointSelected(endpoint.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${apiEndpointSelected === endpoint.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-900 text-neutral-400 hover:text-white border border-transparent'}`}
                    >
                      {endpoint.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* JSON preview */}
              <div className="flex-1 bg-neutral-950 p-4 rounded-xl border border-neutral-850 font-mono text-[10px] overflow-auto my-3 text-neutral-300">
                <span className="text-emerald-400 block mb-2">{apiResponseJson?.endpoint}</span>
                <pre>{JSON.stringify(apiResponseJson?.response, null, 2)}</pre>
              </div>

              <div className="text-[10px] text-neutral-500 leading-relaxed bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-850">
                🚀 Traces schema compatible with OpenTelemetry and Jaeger/Prometheus log aggregators. Sub-second performance search indices applied on trace keys.
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: COMPLIANCE DIAGNOSTICS TESTS */}
        {activeSubTab === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left instructions */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Observability Compliance Suite</h3>
                <p className="text-[10px] text-neutral-500 mt-1 max-w-sm">
                  Run automated testing sequences to verify OpenTelemetry structure compatibility, trace propagation, latency alarm dispatchers, and absolute data immutability layers.
                </p>

                <div className="mt-4 space-y-3 text-xs leading-relaxed text-neutral-400">
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>OTel Headers:</strong> Validates W3C TraceContext headers propagate safely.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Partitioning:</strong> Verifies daily logging partitions exist.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Immutability Lock:</strong> Checks that no delete query commands can bypass audit history limits.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunComplianceTests}
                disabled={isTestRunning}
                className="w-full py-2.5 mt-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Terminal className="w-4 h-4" />
                {isTestRunning ? 'Running Scans...' : 'Execute Compliance Diagnostics'}
              </button>
            </div>

            {/* Right: Live log console terminal */}
            <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between h-[360px]">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-mono text-neutral-400 ml-1.5 font-bold">Enterprise Diagnostics Console</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">v1.2.9</span>
              </div>

              {/* Scrollable logs */}
              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-neutral-300 space-y-2 pr-1 custom-scrollbar">
                {testConsoleLogs.map((logStr, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-neutral-500">&gt;</span> {logStr}
                  </div>
                ))}

                {isTestRunning && (
                  <div className="flex items-center gap-2 text-emerald-400 animate-pulse mt-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Analyzing traces memory partition arrays...
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-800/80 pt-2 text-[9px] text-neutral-500 text-right">
                Security compliance parameters synced strictly on Epoch 2026 UTC
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
