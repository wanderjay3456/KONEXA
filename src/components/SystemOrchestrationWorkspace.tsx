import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  History,
  TrendingUp,
  Layers,
  AlertCircle,
  GitBranch,
  Zap,
  AlertTriangle,
  Search,
  FileText,
  RotateCcw,
  Sliders,
  Settings,
  Server,
  Play,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  XCircle,
  Info,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Flame,
  Shield,
  Clock,
  Briefcase,
  UserCheck,
  Check,
  Award,
  BookOpen
} from 'lucide-react';

// Interfaces for our Orchestration Models
interface PlatformEvent {
  id: string;
  correlationId: string;
  timestamp: string;
  eventType: string;
  actor: string;
  source: string;
  entityType: string;
  entityId: string;
  previousState: string;
  currentState: string;
  trigger: string;
  version: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  retryCount: number;
  status: 'PROCESSED' | 'FAILED' | 'QUEUED' | 'RETRYING' | 'DLQ';
  errorDetails?: string;
  tracePath?: string[];
}

interface DeadLetterEvent extends PlatformEvent {
  failedEngine: string;
  retryHistory: string[];
  stackTrace: string;
}

interface AlertLog {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  rootCause: string;
  impact: string;
  recommendedAction: string;
  status: 'ACTIVE' | 'RESOLVED';
}

interface SystemMetric {
  name: string;
  value: string;
  trend: 'up' | 'stable' | 'down';
  trendValue: string;
  color: string;
}

export default function SystemOrchestrationWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'explorer' | 'queues' | 'config' | 'simulator'>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');

  // Observability & System Metrics
  const [systemHealth, setSystemHealth] = useState({
    Database: 'Healthy',
    API: 'Healthy',
    Authentication: 'Healthy',
    Queue: 'Healthy',
    Storage: 'Healthy',
    Email: 'Healthy',
    Notification: 'Healthy',
    Analytics: 'Healthy',
    'Recommendation Engine': 'Healthy',
    'Learning Engine': 'Healthy'
  });

  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'Event Throughput', value: '14,280 eps', trend: 'up', trendValue: '+12%', color: 'text-emerald-400' },
    { name: 'Average Processing Latency', value: '14.5 ms', trend: 'down', trendValue: '-2.4ms', color: 'text-teal-400' },
    { name: 'Queue Utilization Rate', value: '8.2%', trend: 'stable', trendValue: '0.0%', color: 'text-blue-400' },
    { name: 'Calculation Time (Score Engine)', value: '8.4 ms', trend: 'down', trendValue: '-0.8ms', color: 'text-purple-400' }
  ]);

  // Alert Log State
  const [alerts, setAlerts] = useState<AlertLog[]>([
    {
      id: 'AL-2901',
      timestamp: '2026-07-04T19:15:20Z',
      type: 'Potential Collusive Reviews Flagged',
      severity: 'HIGH',
      rootCause: 'Duplicate satisfaction scores (100) registered within 12 seconds with matching IP addresses between company proxy COM-82 and student STU-491.',
      impact: 'Corrupted feature weights across matching algorithms if unmitigated.',
      recommendedAction: 'Quarantine associated matching outcome logs, exclude from learning dataset sweep, and issue Trust Ledger Warning.',
      status: 'ACTIVE'
    },
    {
      id: 'AL-2902',
      timestamp: '2026-07-04T18:42:05Z',
      type: 'Database Connection Latency Spike',
      severity: 'WARNING',
      rootCause: 'Read replica connection pool saturated (88/90 concurrent open descriptors).',
      impact: 'Marginal API Response delay (up to +180ms) on recommendation query feeds.',
      recommendedAction: 'Scale target read connection limit dynamically or invalidate stale cache arrays.',
      status: 'RESOLVED'
    },
    {
      id: 'AL-2903',
      timestamp: '2026-07-04T17:01:10Z',
      type: 'Badge Allocation Warning Engine Divergence',
      severity: 'CRITICAL',
      rootCause: 'Worker failed to propagate completed project badge awards to the Ledger array due to missing foreign key reference.',
      impact: 'Students completing Offshore Energy analytics did not receive Verified Badge on profile summary.',
      recommendedAction: 'Initiate Queue Replay for event EVT-48902-A; update foreign key mappings.',
      status: 'ACTIVE'
    }
  ]);

  // Events Log Data Store
  const [events, setEvents] = useState<PlatformEvent[]>([
    {
      id: 'EVT-48902-A',
      correlationId: 'CORR-9988-1',
      timestamp: '2026-07-04T19:10:00Z',
      eventType: 'Project Completed',
      actor: 'Nora Lindqvist',
      source: 'Student Workspace',
      entityType: 'Project',
      entityId: 'PRJ-OFF-01',
      previousState: 'IN_PROGRESS',
      currentState: 'COMPLETED',
      trigger: 'Deliverable Approved',
      version: 'v3.0.0',
      priority: 'HIGH',
      retryCount: 0,
      status: 'PROCESSED',
      tracePath: [
        'Validate Event',
        'Check Permissions',
        'Student Update Service',
        'Performance Score Engine',
        'Trust Score Engine',
        'Notification Handler',
        'Analytics Accumulator',
        'Learning Dataset Update',
        'Audit Logger'
      ]
    },
    {
      id: 'EVT-48903-B',
      correlationId: 'CORR-9988-2',
      timestamp: '2026-07-04T19:11:00Z',
      eventType: 'Employer Review Submitted',
      actor: 'Equinor Admin',
      source: 'Company Portal',
      entityType: 'Evaluation',
      entityId: 'EVAL-081',
      previousState: 'PENDING',
      currentState: 'SUBMITTED',
      trigger: 'Employer Form Closed',
      version: 'v3.0.0',
      priority: 'MEDIUM',
      retryCount: 0,
      status: 'PROCESSED',
      tracePath: ['Validate Event', 'Check Business Rules', 'Performance Engine', 'Trust Engine', 'Learning Engine Dataset', 'Audit Log']
    },
    {
      id: 'EVT-48904-C',
      correlationId: 'CORR-9988-3',
      timestamp: '2026-07-04T19:14:00Z',
      eventType: 'Hiring Decision',
      actor: 'Equinor HR Director',
      source: 'Company HR System',
      entityType: 'Contract',
      entityId: 'CON-994',
      previousState: 'PROPOSED',
      currentState: 'HIRED',
      trigger: 'Signing Verified',
      version: 'v3.0.0',
      priority: 'CRITICAL',
      retryCount: 0,
      status: 'PROCESSED',
      tracePath: ['Validate Event', 'Check Permissions', 'Student Database Update', 'Badge Awarded Engine', 'Analytics Trigger', 'Audit Ledger']
    },
    {
      id: 'EVT-48905-D',
      correlationId: 'CORR-9988-4',
      timestamp: '2026-07-04T19:15:30Z',
      eventType: 'Warning Issued',
      actor: 'System Integrity Worker',
      source: 'Trust Audit Sweep',
      entityType: 'Student Warning',
      entityId: 'WRN-019',
      previousState: 'NONE',
      currentState: 'WARNING_ISSUED',
      trigger: 'Repeated Milestone Absences',
      version: 'v3.0.0',
      priority: 'CRITICAL',
      retryCount: 0,
      status: 'PROCESSED',
      tracePath: ['Validate Event', 'Trust Score Down-adjustment', 'Warning Core Queue', 'Student Profile Lock', 'Audit Logs']
    },
    {
      id: 'EVT-48906-E',
      correlationId: 'CORR-9988-5',
      timestamp: '2026-07-04T19:16:10Z',
      eventType: 'Application Submitted',
      actor: 'Aris Thorne',
      source: 'Student Mobile Web',
      entityType: 'Application',
      entityId: 'APP-102',
      previousState: 'DRAFT',
      currentState: 'SUBMITTED',
      trigger: 'User Touch Submit',
      version: 'v3.0.0',
      priority: 'MEDIUM',
      retryCount: 2,
      status: 'RETRYING',
      errorDetails: 'Deadlock on Student Profile Read Replica. Retrying with Backoff.',
      tracePath: ['Validate Event', 'Check Rules', 'Matching Core Engine Queue']
    },
    {
      id: 'EVT-48907-F',
      correlationId: 'CORR-9988-6',
      timestamp: '2026-07-04T19:17:00Z',
      eventType: 'Algorithm Updated',
      actor: 'Chief AI Officer',
      source: 'Admin Override',
      entityType: 'Configuration',
      entityId: 'CFG-ALGO-V3',
      previousState: 'ALGO_V2',
      currentState: 'ALGO_V3',
      trigger: 'Manual Override Submit',
      version: 'v3.0.0',
      priority: 'CRITICAL',
      retryCount: 0,
      status: 'PROCESSED',
      tracePath: ['Auth validation Check', 'Snapshot Isolation Lock', 'Update Algorithm Engine Map', 'Flush Routing Cache', 'Audit System Ledger']
    }
  ]);

  // Dead Letter Queue State
  const [dlqEvents, setDlqEvents] = useState<DeadLetterEvent[]>([
    {
      id: 'EVT-FAILED-109',
      correlationId: 'CORR-FAIL-4021',
      timestamp: '2026-07-04T16:20:00Z',
      eventType: 'Badge Awarded',
      actor: 'Nora Lindqvist',
      source: 'Milestone Automator Worker',
      entityType: 'Badge',
      entityId: 'BDG-902',
      previousState: 'UNASSIGNED',
      currentState: 'GRANTED',
      trigger: 'Sweeper Completion Trigger',
      version: 'v3.0.0',
      priority: 'LOW',
      retryCount: 5,
      status: 'DLQ',
      failedEngine: 'Badge Engine Worker',
      errorDetails: 'foreign key constraint violation: badge_code "BDG-902" does not exist in master badge definitions table.',
      stackTrace: `Error: foreign key violation on insert
    at BadgeStore.saveBadgeAssignment (/src/db/badges.ts:182:11)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async OrchestrationBus.propagateBadgeAwards (/src/orchestrator/bus.ts:402:22)`,
      retryHistory: [
        'Attempt 1 (16:21:00Z): Error code 503 Service Unavailable',
        'Attempt 2 (16:25:00Z): Connection timeout on DB write replica',
        'Attempt 3 (16:40:00Z): foreign key constraint violation: badge_code BDG-902 not found',
        'Attempt 4 (17:10:00Z): foreign key constraint violation: badge_code BDG-902 not found',
        'Attempt 5 (18:10:00Z): foreign key constraint violation: badge_code BDG-902 not found'
      ]
    }
  ]);

  // Configuration Variables
  const [weightsConfig, setWeightsConfig] = useState({
    skillMatch: 24,
    trustMatch: 18,
    performanceMatch: 16,
    academicMatch: 12,
    availabilityMatch: 10,
    retryIntervalMin: 1,
    maxRetries: 5,
    queueSizeLimit: 100000,
    alertLatencyMs: 150
  });

  // Simulator Variable states
  const [simEventType, setSimEventType] = useState('Project Completed');
  const [simActor, setSimActor] = useState('Nora Lindqvist');
  const [simPriority, setSimPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simIsRunning, setSimIsRunning] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(-1);

  // Selected event for detail drawer
  const [selectedEvent, setSelectedEvent] = useState<PlatformEvent | null>(null);

  // Trigger real-time visual step-by-step trace simulation
  const startEventSimulation = () => {
    if (simIsRunning) return;
    setSimIsRunning(true);
    setSimLogs([]);
    setSimStepIndex(0);

    const steps = [
      { step: '1. Validate Event Schema & Integrity', desc: 'Validating payload syntax, checking structure and signatures.' },
      { step: '2. Check Authorization & Actor Permissions', desc: 'Asserting role permissions against access-control policy.' },
      { step: '3. Assert Engine Business Rules', desc: 'Evaluating invariants, checking for fraud attempts, duplicate transactions.' },
      { step: '4. Persist Immutable Event to Database Log', desc: 'Executing snapshot isolation transaction. Writing event log.' },
      { step: '5. Publish to Enterprise Event Bus Queue', desc: 'Routing the event to prioritized engine queues.' },
      { step: '6. Process prioritized Queue Elements', desc: 'Acquiring thread pools, matching CPU workers.' },
      { step: '7. Update Related Computation Engines', desc: `Executing Order: Student Update -> Performance Score -> Trust Score -> Matching.` },
      { step: '8. Propagate Micro-credentials & Badges', desc: 'Checking milestone completions, triggering Badge awards.' },
      { step: '9. Dispatch Notifications to Stakeholders', desc: 'Constructing push logs and operational alerts.' },
      { step: '10. Write Audit & Ledger Records', desc: 'Appending hash-verified state transitions to the historical ledger.' },
      { step: '11. Archive Event to Long-term Cold Storage', desc: 'Compressing event files, invalidating caching nodes, process complete!' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setSimStepIndex(current);
        const s = steps[current];
        setSimLogs(prev => [...prev, `[SUCCESS] ${s.step} - ${s.desc}`]);
        current++;
      } else {
        clearInterval(interval);
        setSimIsRunning(false);
        setSimStepIndex(-1);
        
        // Push the newly simulated event to the global event logs list
        const newEvent: PlatformEvent = {
          id: `EVT-${Math.floor(10000 + Math.random() * 90000)}-S`,
          correlationId: `CORR-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          eventType: simEventType,
          actor: simActor,
          source: 'Simulated Tester Workspace',
          entityType: 'Transaction',
          entityId: `ENT-${Math.floor(100 + Math.random() * 900)}`,
          previousState: 'DRAFT',
          currentState: 'RESOLVED',
          trigger: 'Simulation Trigger Action',
          version: 'v3.0.0',
          priority: simPriority,
          retryCount: 0,
          status: 'PROCESSED',
          tracePath: steps.map(s => s.step.split('. ')[1])
        };

        setEvents(prev => [newEvent, ...prev]);
        setSimLogs(prev => [...prev, `🎉 Simulated Event [${newEvent.id}] successfully orchestrated and integrated into the global matching dataset!`]);
      }
    }, 850);
  };

  // Replay failure event from DLQ
  const handleReplayDlq = (id: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      // Find the event
      const target = dlqEvents.find(e => e.id === id);
      if (target) {
        // Change status to processed, remove from DLQ and append to standard events
        setDlqEvents(prev => prev.filter(e => e.id !== id));
        const replayed: PlatformEvent = {
          ...target,
          status: 'PROCESSED',
          timestamp: new Date().toISOString(),
          retryCount: 0,
          errorDetails: undefined,
          tracePath: ['Revalidated from DLQ', 'Manual Administrator Override Override', 'Badge Engine Core', 'Database Sync', 'Audit Logged']
        };
        setEvents(prev => [replayed, ...prev]);
        alert(`Successfully replayed Event ${id}. The Engine completed synchronization and updated database states without conflicts.`);
      }
      setIsProcessing(false);
    }, 600);
  };

  // Toggle active health checks
  const handleToggleHealth = (name: string) => {
    setSystemHealth(prev => {
      const current = (prev as any)[name];
      const next = current === 'Healthy' ? 'Warning' : current === 'Warning' ? 'Critical' : 'Healthy';
      return { ...prev, [name]: next };
    });
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(al => {
      if (al.id === id) {
        return { ...al, status: 'RESOLVED' };
      }
      return al;
    }));
  };

  // Filter events list
  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventTypeFilter === 'ALL' || ev.eventType === eventTypeFilter;
    return matchesSearch && matchesType;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'MEDIUM': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PROCESSED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'FAILED': case 'DLQ': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'RETRYING': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand Header Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-indigo-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Enterprise Orchestration Core v3.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Orchestration & Event processing</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            The central nervous system of KONEXA. Ensures transactional consistency, event-driven integration, error resilience isolation, and full auditability across all evaluation engines.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">BUS: 14.2k eps</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Selection */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'dashboard', label: 'Telemetry & Dashboard', icon: Activity },
          { id: 'explorer', label: 'Event Log Explorer', icon: Terminal },
          { id: 'queues', label: 'Retry Queue & DLQ', icon: GitBranch },
          { id: 'config', label: 'Orchestrator Policies', icon: Sliders },
          { id: 'simulator', label: 'Event Stream Simulator', icon: Play }
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

      {/* Main Container Panels */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Real-time Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {metrics.map((m, idx) => {
                const isUp = m.trend === 'up';
                const isDown = m.trend === 'down';
                return (
                  <div key={idx} className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">{m.name}</span>
                    <div className="text-2xl font-bold text-white font-mono flex items-center justify-between">
                      <span>{m.value}</span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded flex items-center ${isUp ? 'bg-emerald-500/10 text-emerald-400' : isDown ? 'bg-teal-500/10 text-teal-400' : 'bg-neutral-800 text-neutral-500'}`}>
                        {isUp && '+'}
                        {m.trendValue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: System Health Checks Registry */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Continuous Health Checks</span>
                    <span className="text-[10px] font-mono text-neutral-500">Click to Simulate Error</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Continuously polls critical subsystems. Trigger an outage simulation by clicking any status badge.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                    {Object.entries(systemHealth).map(([service, status]) => (
                      <button
                        key={service}
                        onClick={() => handleToggleHealth(service)}
                        className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition text-left"
                      >
                        <span className="text-neutral-300 font-medium truncate pr-2">{service}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                          status === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          status === 'Warning' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        }`}>
                          {status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Queue status statistics & Load */}
                <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Priority Thread Allocation</span>
                  <div className="space-y-3 font-mono text-xs">
                    {[
                      { level: 'Critical Queue (Fraud/Permission)', load: 0, color: 'bg-rose-500' },
                      { level: 'High Queue (Project/Application)', load: 8, color: 'bg-amber-500' },
                      { level: 'Medium Queue (Score/Matching)', load: 24, color: 'bg-teal-500' },
                      { level: 'Low Queue (Analytics/Learning)', load: 45, color: 'bg-neutral-400' }
                    ].map((q, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-neutral-300">
                          <span>{q.level}</span>
                          <span className="text-neutral-500">{q.load}% allocated</span>
                        </div>
                        <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full ${q.color} rounded-full`} style={{ width: `${q.load}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Active Incident & Alert Logs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold block">Active Enterprise Alerts</span>
                    <span className="text-[10px] font-mono text-neutral-500">Audit-Linked Notifications</span>
                  </div>

                  <div className="space-y-3">
                    {alerts.map(al => (
                      <div
                        key={al.id}
                        className={`p-4 rounded-xl border transition-all ${
                          al.status === 'RESOLVED' ? 'bg-neutral-950 border-neutral-900 opacity-50' :
                          al.severity === 'CRITICAL' ? 'bg-rose-950/20 border-rose-900/40' :
                          al.severity === 'HIGH' ? 'bg-amber-950/20 border-amber-900/40' :
                          'bg-neutral-900/60 border-neutral-800'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                al.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                                al.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-teal-500/20 text-teal-400'
                              }`}>
                                {al.severity}
                              </span>
                              <h4 className="text-xs font-bold text-white">{al.type}</h4>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed pt-1 font-mono">{al.rootCause}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-neutral-900/40 text-[10px] font-mono">
                              <div>
                                <span className="text-neutral-500 block uppercase">Operational Impact</span>
                                <span className="text-neutral-300">{al.impact}</span>
                              </div>
                              <div>
                                <span className="text-neutral-500 block uppercase">Recommended Action</span>
                                <span className="text-teal-400">{al.recommendedAction}</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 font-mono text-[10px] text-right space-y-2">
                            <span className="text-neutral-500 block">{al.timestamp.slice(11, 19)}</span>
                            {al.status === 'ACTIVE' ? (
                              <button
                                onClick={() => handleResolveAlert(al.id)}
                                className="px-2 py-1 rounded bg-teal-500 text-black font-bold text-[9px] uppercase hover:bg-teal-400 transition"
                              >
                                Resolve
                              </button>
                            ) : (
                              <span className="text-neutral-500 uppercase font-bold">Resolved</span>
                            )}
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

        {/* Tab 2: Event Log Explorer */}
        {activeSubTab === 'explorer' && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter toolbar */}
            <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search events by Actor, ID, or Type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {['ALL', 'Project Completed', 'Employer Review Submitted', 'Hiring Decision', 'Warning Issued'].map(type => (
                  <button
                    key={type}
                    onClick={() => setEventTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap border transition ${
                      eventTypeFilter === type ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:bg-neutral-850'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs Table & Trace Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Immutable Event Bus Records</span>
                  <span className="text-[10px] font-mono text-neutral-500">{filteredEvents.length} transactions match</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-900 text-neutral-500 text-[10px] uppercase">
                        <th className="pb-3">Event ID</th>
                        <th className="pb-3">Event Type</th>
                        <th className="pb-3">Actor / Entity</th>
                        <th className="pb-3">Priority</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">View Trace</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {filteredEvents.map(ev => (
                        <tr
                          key={ev.id}
                          className={`hover:bg-neutral-900/30 transition cursor-pointer ${selectedEvent?.id === ev.id ? 'bg-neutral-900/40' : ''}`}
                          onClick={() => setSelectedEvent(ev)}
                        >
                          <td className="py-3 text-neutral-300 font-semibold">{ev.id}</td>
                          <td className="py-3 text-white">{ev.eventType}</td>
                          <td className="py-3">
                            <div className="text-neutral-300 text-[11px]">{ev.actor}</div>
                            <div className="text-[9px] text-neutral-500 mt-0.5">{ev.entityType} ID: {ev.entityId}</div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getPriorityColor(ev.priority)}`}>
                              {ev.priority}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(ev.status)}`}>
                              {ev.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(ev);
                              }}
                              className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 hover:text-white transition text-neutral-400 text-[10px]"
                            >
                              Trace Path
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Event Drawer detail sidebar right */}
              <div className="lg:col-span-4">
                {selectedEvent ? (
                  <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono">{selectedEvent.id}</h4>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Correlation ID: {selectedEvent.correlationId}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </div>

                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-900 p-3 rounded-xl border border-neutral-850">
                        <div>
                          <span className="text-neutral-500 block uppercase text-[9px]">Timestamp</span>
                          <span className="text-neutral-300">{selectedEvent.timestamp}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[9px]">Source Platform</span>
                          <span className="text-neutral-300">{selectedEvent.source}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-neutral-500 block uppercase text-[9px]">Entity Type / ID</span>
                          <span className="text-neutral-300">{selectedEvent.entityType} ({selectedEvent.entityId})</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-neutral-500 block uppercase text-[9px]">Trigger Action</span>
                          <span className="text-teal-400 font-bold">{selectedEvent.trigger}</span>
                        </div>
                      </div>

                      {selectedEvent.errorDetails && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-rose-400 block uppercase">Error Details:</span>
                          <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">{selectedEvent.errorDetails}</p>
                        </div>
                      )}

                      {/* Distributed tracing path representation */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">Orchestrator Trace Path</span>
                        <div className="space-y-2 relative pl-4 border-l border-neutral-800 ml-1.5 pt-1">
                          {selectedEvent.tracePath?.map((p, idx) => (
                            <div key={idx} className="relative flex items-center gap-2">
                              <div className="absolute -left-[20.5px] w-2.5 h-2.5 rounded-full bg-teal-400 border border-neutral-950" />
                              <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
                              <span className="text-neutral-300 text-[11px]">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-neutral-950 border border-neutral-900 rounded-2xl text-center text-neutral-500 font-mono text-xs space-y-2">
                    <Terminal className="w-8 h-8 text-neutral-700 mx-auto animate-pulse" />
                    <p>Select any event in the explorer log table to view distributed tracing path, state transitions, and raw metadata payloads.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Retry Queue & DLQ */}
        {activeSubTab === 'queues' && (
          <motion.div
            key="queues"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Queue processing details and DLQ list */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold block">Dead Letter Queue (DLQ)</span>
                    <p className="text-[11px] text-neutral-500">Unresolved worker processing failures quarantined for manual administrator override.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
                    {dlqEvents.length} quarantined
                  </span>
                </div>

                {dlqEvents.length > 0 ? (
                  <div className="space-y-4 font-mono text-xs">
                    {dlqEvents.map(dlq => (
                      <div key={dlq.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-rose-400 font-bold">[{dlq.id}]</span>
                              <h4 className="text-sm font-bold text-white">{dlq.eventType}</h4>
                            </div>
                            <p className="text-[11px] text-neutral-300">Quarantined after {dlq.retryCount} failed matching/badge sweep execution attempts.</p>
                          </div>
                          <button
                            onClick={() => handleReplayDlq(dlq.id)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-black font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                            <span>Replay Event Bus</span>
                          </button>
                        </div>

                        {/* Error stacktrace block */}
                        <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-rose-400">
                            <span>Engine: {dlq.failedEngine}</span>
                            <span>STACK TRACE ERROR</span>
                          </div>
                          <pre className="text-[10px] text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">{dlq.stackTrace}</pre>
                        </div>

                        {/* Retries history list */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase block">Retry History Log</span>
                          <div className="space-y-1 pl-3 border-l border-neutral-800 ml-1">
                            {dlq.retryHistory.map((h, i) => (
                              <div key={i} className="text-[10px] text-neutral-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-neutral-900 border border-neutral-850 rounded-2xl text-center text-neutral-500">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
                    <p>No transactions currently quarantined inside the Dead Letter Queue.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Backoff policy parameters sidebar right */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Transaction Retries Strategy</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Retry policies are deterministic and follow incremental exponential backoffs. If all standard retry windows expire, transactions are isolated to prevent lock contentions.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    { step: 'Attempt 1', interval: '1 Minute backoff' },
                    { step: 'Attempt 2', interval: '5 Minutes backoff' },
                    { step: 'Attempt 3', interval: '15 Minutes backoff' },
                    { step: 'Attempt 4', interval: '30 Minutes backoff' },
                    { step: 'Attempt 5', interval: '1 Hour backoff' },
                    { step: 'Final Out', interval: 'Move to Dead Letter Queue (DLQ)' }
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center justify-between">
                      <span className="text-neutral-400">{s.step}</span>
                      <span className="text-teal-400 font-bold">{s.interval}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Orchestrator Policies Configuration */}
        {activeSubTab === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Interactive configuration inputs left */}
            <div className="lg:col-span-8 p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Orchestrator Execution Policies</span>
                <span className="text-[10px] font-mono text-neutral-500">Live Configuration Panel</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tweak engine queue thresholds, penalty thresholds, and latency bounds dynamically. Updates propagate immediately across matching engine routing queues.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                  <span className="text-neutral-300 font-bold block">Engine Max Retries</span>
                  <input
                    type="number"
                    value={weightsConfig.maxRetries}
                    onChange={e => setWeightsConfig(prev => ({ ...prev, maxRetries: Number(e.target.value) }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[10px] text-neutral-500 leading-normal">Defines retry bounds before transactions are quarantined to prevent heap leaks.</p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                  <span className="text-neutral-300 font-bold block">Queue Buffer Limit</span>
                  <input
                    type="number"
                    value={weightsConfig.queueSizeLimit}
                    onChange={e => setWeightsConfig(prev => ({ ...prev, queueSizeLimit: Number(e.target.value) }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[10px] text-neutral-500 leading-normal">Sets buffer overflow constraints on memory queues before worker isolation blocks are initiated.</p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                  <span className="text-neutral-300 font-bold block">Latency Warning Bound (ms)</span>
                  <input
                    type="number"
                    value={weightsConfig.alertLatencyMs}
                    onChange={e => setWeightsConfig(prev => ({ ...prev, alertLatencyMs: Number(e.target.value) }))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[10px] text-neutral-500 leading-normal">Triggers administrative alert emails and telemetry markers if average execution exceeds bounds.</p>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                  <span className="text-neutral-300 font-bold block">Active Matching Algorithm Version</span>
                  <select
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                    defaultValue="v3.0.0"
                  >
                    <option value="v1.0.0">v1.0.0 (Simple Academic Rules)</option>
                    <option value="v2.0.0">v2.0.0 (Weighted Multi-dimension Model)</option>
                    <option value="v3.0.0">v3.0.0 (Enterprise Deterministic Core)</option>
                  </select>
                  <p className="text-[10px] text-neutral-500 leading-normal">Sets target runtime logic version. Rollbacks retain snapshot isolation indices completely.</p>
                </div>
              </div>

              <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  <strong>Zero-Downtime Deployment Guaranteed:</strong> Configuration adjustments execute dynamically across routing pools. Audit logs store previous configuration values permanently for complete traceability.
                </p>
              </div>
            </div>

            {/* Weights config history sidebar right */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Policy Audit Log Ledger</span>
                <div className="space-y-3 font-mono text-[10px]">
                  {[
                    { date: '19:15:20', admin: 'AI Officer', desc: 'Calibrated alert bounds to 150ms.' },
                    { date: '18:42:05', desc: 'Worker initiated read replica descriptor pool expansion.', admin: 'Sys Daemon' },
                    { date: '17:01:10', desc: 'Promoted Match Algorithm version map to v3.0.0.', admin: 'Platform Dev' }
                  ].map((log, idx) => (
                    <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1">
                      <div className="flex justify-between text-neutral-500">
                        <span>{log.date}</span>
                        <span>{log.admin}</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{log.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: Event Stream Simulator */}
        {activeSubTab === 'simulator' && (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input & Simulation controls Left */}
            <div className="lg:col-span-5 p-5 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-5">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Launch Event Simulator</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Manually construct and inject events into the orchestrator bus. Watch the 11-step pipeline process each transaction in real-time.
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-neutral-400 font-bold">Platform Event Type</label>
                  <select
                    value={simEventType}
                    onChange={e => setSimEventType(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Project Completed">Project Completed</option>
                    <option value="Employer Review Submitted">Employer Review Submitted</option>
                    <option value="Hiring Decision">Hiring Decision</option>
                    <option value="Warning Issued">Warning Issued</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Student Verified">Student Verified</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 font-bold">Target Actor / User</label>
                  <input
                    type="text"
                    value={simActor}
                    onChange={e => setSimActor(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 font-bold">Event Priority Queue</label>
                  <div className="flex gap-2">
                    {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                      <button
                        key={p}
                        onClick={() => setSimPriority(p as any)}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition ${
                          simPriority === p ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:bg-neutral-850'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startEventSimulation}
                  disabled={simIsRunning}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>{simIsRunning ? 'Orchestrating Process...' : 'Inject Event Stream'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Terminal output Right */}
            <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-2xl flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3 mb-4">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold">Orchestrator Terminal log</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${simIsRunning ? 'bg-amber-400 animate-ping' : 'bg-neutral-800'}`} />
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{simIsRunning ? 'RUNNING' : 'IDLE'}</span>
                </span>
              </div>

              {/* Steps Progress Visualizer during simulation */}
              {simIsRunning && (
                <div className="grid grid-cols-11 gap-1 mb-4">
                  {Array.from({ length: 11 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx < simStepIndex ? 'bg-emerald-400' : idx === simStepIndex ? 'bg-amber-400 animate-pulse' : 'bg-neutral-800'
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="flex-1 bg-neutral-900 rounded-xl border border-neutral-850 p-4 font-mono text-xs text-neutral-300 overflow-y-auto space-y-2 max-h-[300px]">
                {simLogs.length > 0 ? (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{log}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-600 italic">
                    Configure your event and click "Inject Event Stream" to trace execution steps.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
