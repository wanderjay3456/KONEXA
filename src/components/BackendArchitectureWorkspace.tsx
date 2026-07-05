import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Server,
  Database,
  Lock,
  Workflow,
  Shield,
  Activity,
  Code,
  Zap,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  User,
  Layers,
  ChevronRight,
  TrendingUp,
  Settings,
  HelpCircle,
  Globe,
  Terminal,
  BookOpen
} from 'lucide-react';

// Interfaces for Modules & Services
interface BackendModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  responsibilities: string[];
  businessRules: string[];
  firebaseIntegration: string;
  dependencies: string[];
}

interface WorkflowStep {
  id: string;
  title: string;
  service: string;
  action: string;
  status: 'pending' | 'success' | 'active';
  description: string;
  technicalSpec: string;
}

export default function BackendArchitectureWorkspace() {
  const [activeTab, setActiveTab] = useState<'modules' | 'workflows' | 'security' | 'caching' | 'observability'>('modules');
  const [selectedModule, setSelectedModule] = useState<string>('auth');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('signup');
  const [workflowAnimationState, setWorkflowAnimationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    cpuUsage: 12,
    memoryUsage: 34,
    requestRate: 145,
    cacheHitRate: 88.5,
    queueLatency: 14,
    activeWorkers: 8,
    errorRate: 0.02
  });

  // Background Metrics Simulation update
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedMetrics(prev => {
        const delta = (Math.random() - 0.5) * 2;
        return {
          cpuUsage: Math.min(100, Math.max(5, Math.round(prev.cpuUsage + delta * 1.5))),
          memoryUsage: Math.min(100, Math.max(20, Math.round(prev.memoryUsage + delta * 0.5))),
          requestRate: Math.max(80, Math.round(prev.requestRate + (Math.random() - 0.5) * 10)),
          cacheHitRate: Math.min(100, Math.max(70, Number((prev.cacheHitRate + (Math.random() - 0.5) * 0.4).toFixed(1)))),
          queueLatency: Math.max(5, Math.round(prev.queueLatency + (Math.random() - 0.5) * 2)),
          activeWorkers: Math.max(4, Math.min(16, prev.activeWorkers + (Math.random() > 0.8 ? 1 : Math.random() < 0.2 ? -1 : 0))),
          errorRate: Math.max(0.001, Number((prev.errorRate + (Math.random() - 0.5) * 0.005).toFixed(3)))
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Complete List of Modules
  const backendModules: BackendModule[] = [
    {
      id: 'auth',
      name: 'Authentication Service',
      icon: Shield,
      description: 'Zero-trust enterprise authentication engine with JWT multi-device validation, Google OAuth federated login, and role-based access tokens.',
      responsibilities: [
        'Issue secure, signed RS256 JWT access tokens with short TTL (15 minutes).',
        'Issue cryptographically random, high-entropy refresh tokens stored securely.',
        'Validate role scopes and user-specific claims on every API request.',
        'Manage Google OAuth credential validation and automated federated registration.',
        'Coordinate email verification status checks (enforces verification check on state writes).'
      ],
      businessRules: [
        'Access is blocked on non-verified accounts for critical state modifications.',
        'A user can invalidate all of their active sessions globally in one click.',
        'Admin credentials are restricted to known authorized security groups with explicit verification.'
      ],
      firebaseIntegration: 'Integrates natively with Firebase Authentication for identity and credentials. Decodes Firebase JWT tokens server-side using secure verification to check uid, email, and email_verified constraints.',
      dependencies: ['Users']
    },
    {
      id: 'users',
      name: 'User & Profile Service',
      icon: User,
      description: 'Handles onboarding, profile states, company vetting, student verified statuses, and PII storage compliance.',
      responsibilities: [
        'Store and retrieve user-specific profiles (Student profiles, Company metadata, Admin data).',
        'Handle background soft deletion with a strict 30-day purge cycle.',
        'Synchronize verification statuses dynamically from Administration reviews.'
      ],
      businessRules: [
        'Personally Identifiable Information (PII) must be stored in private subcollections, accessible only to the owner and authenticated admins.',
        'Soft-deleted profiles are excluded from active search indices instantly.',
        'Roles cannot be modified by the user themselves (no self-promotion).'
      ],
      firebaseIntegration: 'Firestore collections: /users/{userId} and /users/{userId}/private/info. Write transactions are strictly audited.',
      dependencies: ['Authentication']
    },
    {
      id: 'projects',
      name: 'Project Lifecycle System',
      icon: Code,
      description: 'The core engine of KONEXA. Handles creation, publishing, weekly goals, deliverables tracking, and terminal state resolution.',
      responsibilities: [
        'Validate project creation and manage approval workflows before listing projects publicly.',
        'Generate structured weekly milestones with clear deliverable checklists.',
        'Store submission links, comments, and project timeline logs.'
      ],
      businessRules: [
        'A company cannot modify a project once it is marked as in-progress or closed.',
        'Milestone goals must be set by the company and agreed by the student before the weekly interval begins.',
        'All status transitions are saved as immutable history records.'
      ],
      firebaseIntegration: 'Firestore collections: /projects/{projectId} and subcollection /projects/{projectId}/milestones/{milestoneId}. Supported by Master Gate relational sync rules.',
      dependencies: ['Users', 'Applications']
    },
    {
      id: 'applications',
      name: 'Application Service',
      icon: FileText,
      description: 'Tracks application submissions, vetting state changes, candidate interviews, and official matches.',
      responsibilities: [
        'Log application creation, candidate withdraws, company shortlisting, and hiring decisions.',
        'Enforce application concurrency limits for students to protect project quality.'
      ],
      businessRules: [
        'A student cannot apply to more than 3 active projects concurrently.',
        'Once a project has reached matching status, all other applications to that project are locked and flagged as archived.'
      ],
      firebaseIntegration: 'Firestore collection: /applications/{applicationId} linked with compound indexes on studentId and projectId.',
      dependencies: ['Users', 'Projects']
    },
    {
      id: 'trust',
      name: 'Trust Engine (Event-Based)',
      icon: Shield,
      description: 'Quantifies platform reputation based on completed milestones, dead-line compliance, employer evaluations, and clean history logs.',
      responsibilities: [
        'Generate and compile real-time reputation trust indicators for students and companies.',
        'Maintain a detailed timeline of events (e.g. Completed Milestone On Time, Delayed Deliverable, System Violation).'
      ],
      businessRules: [
        'Trust index must be recalculated using absolute historical records; trust data can never be directly overwritten or manually manipulated.',
        'Negative trust events (system warnings, severe delays) apply a decaying deduction over 90 days.'
      ],
      firebaseIntegration: 'Calculated via Firestore cloud functions. Stores an event log at /users/{userId}/trustEvents/{eventId}.',
      dependencies: ['Projects', 'Reviews']
    },
    {
      id: 'ai_matching',
      name: 'AI Matching Service',
      icon: Zap,
      description: 'Bridges talent with active requirements. Employs semantic resume analysis, skill mapping, and historical completion probability calculations.',
      responsibilities: [
        'Recommend highly matched student candidates to companies based on project descriptors.',
        'Recommend projects to students based on dynamic skill gaps.',
        'Expose confidence scores and clear matching factor explanations.'
      ],
      businessRules: [
        'AI agents must consume dedicated, scoped backend services with strictly restricted database access (no direct raw read/writes to primary collections).',
        'Matching feedback is captured to iteratively tune weights.'
      ],
      firebaseIntegration: 'Consumes Firestore read-only replicas or analytical indices. Saves recommendation cache under /recommendations/{recommendationId}.',
      dependencies: ['Users', 'Projects', 'Analytics']
    },
    {
      id: 'notifications',
      name: 'Notification & Email Dispatcher',
      icon: Bell,
      description: 'Asynchronous notifier dispatching email alerts, in-app badges, push notifications, and urgent platform announcements.',
      responsibilities: [
        'Queue notification payloads for reliable dispatch.',
        'Store in-app system notifications and handle read/unread state updates.'
      ],
      businessRules: [
        'All emails must go through a background job queue with automated retry backoffs.',
        'Users can opt-out of secondary email types, but mandatory transactional emails (trust warning, dispute alert) cannot be disabled.'
      ],
      firebaseIntegration: 'Firestore writes to /notifications/{notificationId} trigger cloud triggers or background queue listeners.',
      dependencies: ['Authentication']
    },
    {
      id: 'reviews',
      name: 'Immutable Review Service',
      icon: StarIcon,
      description: 'Facilitates 360-degree feedback loops including weekly performance checkpoints and final project reviews.',
      responsibilities: [
        'Log review records from companies on students, and student feedback on companies.',
        'Compile aggregate statistics on platform performance metrics.'
      ],
      businessRules: [
        'Reviews are strictly immutable once submitted; they cannot be updated, edited, or deleted.',
        'Double-blind review lock: A review is not revealed until both parties have submitted their feedback, or the 14-day limit has expired.'
      ],
      firebaseIntegration: 'Firestore collection: /reviews/{reviewId} protected with strict rules blocking updates or deletions.',
      dependencies: ['Projects']
    }
  ];

  // Workflows Simulation Definition
  const workflowScenarios = {
    signup: {
      title: 'Student Signup & Zero-Trust Verification',
      trigger: 'Client hits auth API / requests verification email',
      steps: [
        {
          id: 'step1',
          title: 'Federated Registration',
          service: 'Authentication Service',
          action: 'Firebase Auth',
          status: 'pending',
          description: 'User registers with Google OAuth. Firebase issues temporary JWT.',
          technicalSpec: 'Token contains email_verified: false, role: "PENDING_STUDENT".'
        },
        {
          id: 'step2',
          title: 'Verification Challenge',
          service: 'Notification Service',
          action: 'Email Dispatcher',
          status: 'pending',
          description: 'A signed verification link with strict TTL is dispatched to the user’s academic email.',
          technicalSpec: 'Sends transactional email through Firebase Action Code Settings.'
        },
        {
          id: 'step3',
          title: 'Profile Initialization',
          service: 'User & Profile Service',
          action: 'Firestore Transaction',
          status: 'pending',
          description: 'Creates default, sandboxed student profile under /users/{uid}.',
          technicalSpec: 'Write requires auth.uid == targetId. Firestore rules block modification of rbac properties.'
        },
        {
          id: 'step4',
          title: 'Audit Log Generation',
          service: 'Audit Service',
          action: 'Immutable Logger',
          status: 'pending',
          description: 'Logs account creation event with client metadata and authorization checks.',
          technicalSpec: 'Creates record at /audit_logs/{id} using serverTimestamp().'
        }
      ]
    },
    milestone: {
      title: 'Weekly Milestones & Submission Flow',
      trigger: 'Student uploads work before Sunday 23:59 UTC',
      steps: [
        {
          id: 'm1',
          title: 'Auth & Role Verification',
          service: 'Authentication Service',
          action: 'Token Validator',
          status: 'pending',
          description: 'Validates that the active session JWT has email_verified == true and contains the matched student role.',
          technicalSpec: 'Checks active project context via Firestore rules.'
        },
        {
          id: 'm2',
          title: 'File Secure Upload',
          service: 'File Service',
          action: 'Cloud Storage Bucket',
          status: 'pending',
          description: 'Saves files in structured directory projects/{projectId}/milestones/{milestoneId}/studentId_v1.zip.',
          technicalSpec: 'Requires metadata signature validation. Triggers virus scan hook.'
        },
        {
          id: 'm3',
          title: 'Atomic Progress Write',
          service: 'Project Service',
          action: 'Firestore Atomic Batch',
          status: 'pending',
          description: 'Updates Milestone status to SUBMITTED and binds the file reference to the document.',
          technicalSpec: 'Fails if status is already COMPLETED. Prevents terminal state override.'
        },
        {
          id: 'm4',
          title: 'Asynchronous Triggers',
          service: 'Event Broker',
          action: 'Cloud Pub/Sub Queue',
          status: 'pending',
          description: 'Emits event StudentMilestoneSubmitted. Triggers trust engine update and sends push alert to the company manager.',
          technicalSpec: 'Dispatches message via Redis/Cloud PubSub to company notification pipeline.'
        }
      ]
    },
    matching: {
      title: 'AI Matching & Skills Scoring Pipeline',
      trigger: 'New Project goes live / Skill index refresh requested',
      steps: [
        {
          id: 'a1',
          title: 'Workspace Read Extraction',
          service: 'AI Matching Service',
          action: 'Replication Pipeline',
          status: 'pending',
          description: 'Reads recently updated student profiles and project parameters via non-blocking read-replicas.',
          technicalSpec: 'Direct database bypass: Service uses cached read indexes to avoid O(n) primary DB locks.'
        },
        {
          id: 'a2',
          title: 'Vector Score Calculation',
          service: 'AI Engine (Gemini / Vector)',
          action: 'Cosine Similarity',
          status: 'pending',
          description: 'Maps the project skill tags against student history vector embeddings to compute cosine similarity scores.',
          technicalSpec: 'Leverages modern vector search with strict limits to filter certified skills.'
        },
        {
          id: 'a3',
          title: 'Trust & Reputation Weighted Vetting',
          service: 'Trust Engine',
          action: 'Score Multiplier',
          status: 'pending',
          description: 'Applies weighting factors based on candidate Trust Score (deadline adherence) and rating histories.',
          technicalSpec: 'Reduces raw similarity score if candidate has decaying active Trust warnings.'
        },
        {
          id: 'a4',
          title: 'Structured Recommendation Cache',
          service: 'AI Matching Service',
          action: 'Firestore Cache Write',
          status: 'pending',
          description: 'Saves matched results and comprehensive confidence explanations into recommendations collection.',
          technicalSpec: 'Writes to /recommendations/{recommendationId}. Client queries via read-only access.'
        }
      ]
    }
  };

  const runWorkflowSimulation = () => {
    setWorkflowAnimationState('running');
    setActiveWorkflowStep(0);
    const workflow = workflowScenarios[selectedWorkflow as keyof typeof workflowScenarios];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < workflow.steps.length) {
        setActiveWorkflowStep(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        setWorkflowAnimationState('completed');
      }
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Spec Summary */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Backend & Server Architecture Specification</h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-2xl">
            A secure, asynchronous, event-driven architecture designed to manage the critical operations of KONEXA.
            Engineered with a Zero-Trust approach utilizing secure Firebase configurations, immutable audit ledgers, and isolated service modules.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">ENGINES: ONLINE</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-mono text-neutral-300">SECURE TOKENS (RS256)</span>
          </div>
        </div>
      </div>

      {/* 2. Live System Architecture KPI Monitors */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'CPU LOAD', value: `${simulatedMetrics.cpuUsage}%`, color: simulatedMetrics.cpuUsage > 75 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'MEM ALLOC', value: `${simulatedMetrics.memoryUsage}%`, color: 'text-sky-400' },
          { label: 'API INGRESS', value: `${simulatedMetrics.requestRate} r/s`, color: 'text-indigo-400' },
          { label: 'CACHE HIT', value: `${simulatedMetrics.cacheHitRate}%`, color: 'text-teal-400' },
          { label: 'QUEUE LATENCY', value: `${simulatedMetrics.queueLatency}ms`, color: 'text-pink-400' },
          { label: 'JOB WORKERS', value: `${simulatedMetrics.activeWorkers} active`, color: 'text-purple-400' },
          { label: 'ERR RATE', value: `${simulatedMetrics.errorRate}%`, color: 'text-emerald-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase font-bold">{kpi.label}</span>
            <span className={`text-sm font-semibold font-mono mt-1 ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1.5 rounded-2xl">
        {[
          { id: 'modules', label: 'Service Modules Directory', icon: Layers },
          { id: 'workflows', label: 'Asynchronous Event Workflows', icon: Workflow },
          { id: 'security', label: 'Zero-Trust Firebase Rules', icon: Lock },
          { id: 'caching', label: 'Caching & Background Queues', icon: RefreshCw },
          { id: 'observability', label: 'Observability & Scaling', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setWorkflowAnimationState('idle');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all ${isSelected ? 'bg-neutral-900 text-white border border-neutral-800 shadow-lg' : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}
      <AnimatePresence mode="wait">
        {/* TAB 1: MODULES & SERVICES */}
        {activeTab === 'modules' && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Modules List */}
            <div className="lg:col-span-1 space-y-2">
              <div className="p-4 rounded-t-2xl bg-neutral-950 border-t border-x border-neutral-900">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-bold">Independent App Modules</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">Isolated, non-coupled operational blocks</p>
              </div>
              <div className="bg-neutral-950/50 border border-neutral-900 rounded-b-2xl p-2 max-h-[480px] overflow-y-auto space-y-1">
                {backendModules.map(mod => {
                  const Icon = mod.icon;
                  const isSelected = selectedModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModule(mod.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all ${isSelected ? 'bg-neutral-900 text-white border border-neutral-800 shadow-md' : 'text-neutral-400 hover:bg-neutral-900/20 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25' : 'bg-neutral-900 text-neutral-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{mod.name}</p>
                          <p className="text-[10px] text-neutral-500 truncate max-w-[180px] mt-0.5">{mod.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Detailed Specifications */}
            <div className="lg:col-span-2">
              {(() => {
                const mod = backendModules.find(m => m.id === selectedModule) || backendModules[0];
                const Icon = mod.icon;
                return (
                  <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 space-y-6 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Service Definition Ledger</span>
                            <h3 className="text-base font-bold text-white">{mod.name}</h3>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-neutral-900 text-neutral-500 border border-neutral-800 text-[10px] font-mono uppercase">
                          No Client Validation Trust
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-2">
                            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                            Primary Core Responsibilities
                          </h4>
                          <ul className="space-y-1.5 pl-5 list-disc text-xs text-neutral-400">
                            {mod.responsibilities.map((r, i) => (
                              <li key={i} className="leading-relaxed">{r}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-2">
                            <Shield className="w-3.5 h-3.5 text-rose-400" />
                            Enforced Business Rules (Backend Guard)
                          </h4>
                          <ul className="space-y-1.5 pl-5 list-disc text-xs text-neutral-400">
                            {mod.businessRules.map((br, i) => (
                              <li key={i} className="leading-relaxed font-mono text-neutral-300">
                                <span className="text-rose-400/80">IF:</span> {br}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-neutral-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-900">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">Service Connections</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {mod.dependencies.map(dep => (
                              <span key={dep} className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-900">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">Database & Storage Spec</span>
                          <div className="text-[10px] font-mono text-teal-400/90 mt-1 truncate">
                            {mod.id === 'auth' ? 'Firebase Auth / JWT Tokens' : `/users/{userId}/${mod.id === 'users' ? '' : mod.id}`}
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-teal-500/5 border border-teal-500/10">
                        <span className="text-[10px] font-mono text-teal-400 font-bold block mb-1">Firebase Integration Blueprint</span>
                        <p className="text-xs text-neutral-400 leading-relaxed">{mod.firebaseIntegration}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* TAB 2: WORKFLOWS */}
        {activeTab === 'workflows' && (
          <motion.div
            key="workflows"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Selection panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Event-Driven Simulator</h3>
                  <p className="text-xs text-neutral-400 mt-1">Select an event flow to trace real-time execution across independent service boundaries.</p>
                </div>

                <div className="space-y-2">
                  {Object.entries(workflowScenarios).map(([key, value]) => {
                    const isSelected = selectedWorkflow === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedWorkflow(key);
                          setWorkflowAnimationState('idle');
                          setActiveWorkflowStep(0);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl transition-all border ${isSelected ? 'bg-neutral-900 text-white border-neutral-800' : 'bg-neutral-950/20 text-neutral-400 border-transparent hover:bg-neutral-900/30'}`}
                      >
                        <p className="text-xs font-bold">{value.title}</p>
                        <p className="text-[10px] text-neutral-500 mt-1 truncate">{value.trigger}</p>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={runWorkflowSimulation}
                  disabled={workflowAnimationState === 'running'}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${workflowAnimationState === 'running' ? 'bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 text-neutral-950 cursor-pointer shadow-lg shadow-teal-500/10'}`}
                >
                  <RefreshCw className={`w-4 h-4 ${workflowAnimationState === 'running' ? 'animate-spin' : ''}`} />
                  <span>{workflowAnimationState === 'running' ? 'Simulating Event Pipeline...' : 'Run Simulation'}</span>
                </button>
              </div>

              {/* Status Alert panel */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 flex items-start gap-3">
                <Shield className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">Chief Architect Vow</span>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                    "Every state transition triggers a strictly atomic, verifiable, and immutable write. We never rely on client validation scripts."
                  </p>
                </div>
              </div>
            </div>

            {/* Right Execution Flow */}
            <div className="lg:col-span-2">
              {(() => {
                const scenario = workflowScenarios[selectedWorkflow as keyof typeof workflowScenarios];
                return (
                  <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Active Simulation Stream</span>
                        <h3 className="text-base font-bold text-white mt-0.5">{scenario.title}</h3>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
                        TRIGGER: {scenario.trigger}
                      </div>
                    </div>

                    {/* Step Waterfall list */}
                    <div className="relative pl-6 space-y-6">
                      <div className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-neutral-900" />

                      {scenario.steps.map((step, idx) => {
                        const isPending = workflowAnimationState === 'idle';
                        const isActive = workflowAnimationState === 'running' && activeWorkflowStep === idx;
                        const isCompleted = workflowAnimationState === 'completed' || (workflowAnimationState === 'running' && activeWorkflowStep > idx);

                        return (
                          <div key={step.id} className="relative flex gap-4 transition-all duration-300">
                            {/* Visual State Bubble */}
                            <div className="absolute -left-6 transform -translate-x-[1px] mt-1 z-10">
                              {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-teal-400 text-xs">
                                  ✓
                                </div>
                              ) : isActive ? (
                                <div className="w-6 h-6 rounded-full bg-teal-500 border-2 border-teal-500 animate-pulse flex items-center justify-center text-neutral-950 text-[10px] font-bold">
                                  ⚡
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-neutral-900 flex items-center justify-center text-neutral-600 text-xs font-mono">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            {/* Step Description */}
                            <div className={`flex-1 p-4 rounded-xl border transition-all ${isCompleted ? 'bg-neutral-900/30 border-neutral-900/60 opacity-80' : isActive ? 'bg-neutral-900 border-teal-500/30 shadow-md shadow-teal-500/5' : 'bg-neutral-950/20 border-transparent opacity-40'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{step.service}</span>
                                  <span className="text-[10px] bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono text-neutral-400">{step.action}</span>
                                </div>
                                {isActive && <span className="text-[10px] font-mono text-teal-400 animate-pulse">PROCESSING</span>}
                              </div>

                              <h4 className="text-xs font-bold text-neutral-200 mt-2">{step.title}</h4>
                              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{step.description}</p>

                              <div className="mt-3 pt-2.5 border-t border-neutral-900/50 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-neutral-500 font-bold">UNDER-THE-HOOD SPEC:</span>
                                <span className="text-[10px] font-mono text-teal-400/80">{step.technicalSpec}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Output Log block */}
                    {workflowAnimationState === 'completed' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-neutral-200">Simulation Complete</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">Audit log committed. Multi-channel notifications dispatched successfully.</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">TTL: SUCCESS</span>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* TAB 3: SECURITY & FIREBASE RULES */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Security Architecture Header */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-widest">Security Model</span>
                </div>
                <h3 className="text-sm font-bold text-white">Zero-Trust Security & Firebase Rules</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enforces mathematical invariants inside Firestore security rules to block bypass vectors. Uses ABAC policies (Attribute-Based Access Control).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase">Email Verification Constraint</span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every user writing to active projects, student registries, or company lists must have their identity fully verified. Verified using:
                </p>
                <div className="text-[10px] font-mono text-neutral-300 mt-1 bg-neutral-950 p-1.5 rounded border border-neutral-800">
                  request.auth.token.email_verified == true
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900 space-y-1">
                <span className="text-[10px] font-mono text-teal-400 font-bold block uppercase">Bootstrapped Admins</span>
                <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                  Superuser permission rules are enforced dynamically by checking existance in the:
                </p>
                <div className="text-[10px] font-mono text-neutral-300 mt-1 bg-neutral-950 p-1.5 rounded border border-neutral-800">
                  /databases/$(database)/documents/admins/$(uid)
                </div>
              </div>
            </div>

            {/* Rules Code view */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Pillars checklist */}
              <div className="lg:col-span-1 space-y-3">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900">
                  <h4 className="text-xs font-bold text-neutral-300 mb-3">The 8 Pillars of Fortified Rules</h4>
                  <div className="space-y-2.5">
                    {[
                      { num: 1, title: 'Master Gate (Relational Sync)', desc: 'Validates subcollection access by looking up the parent document.' },
                      { num: 2, title: 'Anti-Update-Gap Validation', desc: 'Validates field count, type checks, and sizes on create & update.' },
                      { num: 3, title: 'ID Poisoning Guard', desc: 'RegEx validation for IDs and key dimensions with strict limits.' },
                      { num: 4, title: 'Tiered Identity Logic', desc: 'Partitioning user updates based on exact permissions (affectedKeys).' },
                      { num: 5, title: 'Total Array Guarding', desc: 'Validates maximum size limits and types of items in lists.' },
                      { num: 6, title: 'PII Isolation Strategy', desc: 'Moves emails, phones, and private data to private subcollections.' },
                      { num: 7, title: 'Atomicity Guarantee', desc: 'Enforces atomic operations on related documents with existsAfter.' },
                      { num: 8, title: 'Query Enforcer Guard', desc: 'Locks read permissions with client query constraints.' }
                    ].map(p => (
                      <div key={p.num} className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-900 flex gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                          {p.num}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-300">{p.title}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Panel */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-mono text-neutral-400">firestore.rules (Enterprise Blueprint)</span>
                    </div>
                    <span className="text-[10px] font-mono text-teal-400/80 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">PRODUCTION READY</span>
                  </div>

                  <div className="p-4 bg-neutral-900/40 rounded-xl overflow-x-auto border border-neutral-900 font-mono text-[10px] text-neutral-300 space-y-1.5 max-h-[500px]">
                    <p className="text-neutral-500">rules_version = '2';</p>
                    <p className="text-neutral-500">service cloud.firestore {"{"}</p>
                    <p className="text-neutral-500 pl-4">match /databases/{"{database}"}/documents {"{"}</p>
                    <br />
                    <p className="text-teal-500 pl-8">// Global default deny catch-all</p>
                    <p className="text-neutral-300 pl-8">match /{"{document=**}"} {"{"}</p>
                    <p className="text-neutral-300 pl-12">allow read, write: if false;</p>
                    <p className="text-neutral-300 pl-8">{"}"}</p>
                    <br />
                    <p className="text-teal-500 pl-8">// Global Helper Definitions</p>
                    <p className="text-neutral-300 pl-8">function isSignedIn() {"{"} return request.auth != null; {"}"}</p>
                    <p className="text-neutral-300 pl-8">function isVerified() {"{"} return isSignedIn() && request.auth.token.email_verified == true; {"}"}</p>
                    <p className="text-neutral-300 pl-8">function isValidId(id) {"{"} return id is string && id.size() &lt;= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); {"}"}</p>
                    <p className="text-neutral-300 pl-8">function isAdmin() {"{"} return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid)); {"}"}</p>
                    <p className="text-neutral-300 pl-8">function incoming() {"{"} return request.resource.data; {"}"}</p>
                    <p className="text-neutral-300 pl-8">function existing() {"{"} return resource.data; {"}"}</p>
                    <br />
                    <p className="text-teal-500 pl-8">// 1. Match Users Collection & Private PII Subcollection</p>
                    <p className="text-neutral-300 pl-8">match /users/{"{userId}"} {"{"}</p>
                    <p className="text-neutral-300 pl-12">allow read: if isVerified();</p>
                    <p className="text-neutral-300 pl-12">allow create: if isVerified() && request.auth.uid == userId &&</p>
                    <p className="text-neutral-300 pl-16">incoming().keys().hasAll(['name', 'email', 'role']) &&</p>
                    <p className="text-neutral-300 pl-16">incoming().role == 'STUDENT_PENDING' && incoming().email == request.auth.token.email;</p>
                    <p className="text-neutral-300 pl-12">allow update: if isVerified() && request.auth.uid == userId &&</p>
                    <p className="text-neutral-300 pl-16">!(incoming().diff(existing()).affectedKeys().hasAny(['role', 'email']));</p>
                    <br />
                    <p className="text-teal-500 pl-12">// Private isolation pattern</p>
                    <p className="text-neutral-300 pl-12">match /private/info {"{"}</p>
                    <p className="text-neutral-300 pl-16">allow read, write: if isVerified() && request.auth.uid == userId;</p>
                    <p className="text-neutral-300 pl-12">{"}"}</p>
                    <p className="text-neutral-300 pl-8">{"}"}</p>
                    <br />
                    <p className="text-teal-500 pl-8">// 2. Match Projects Collection with Terminal State Locking</p>
                    <p className="text-neutral-300 pl-8">match /projects/{"{projectId}"} {"{"}</p>
                    <p className="text-neutral-300 pl-12">allow read: if isVerified();</p>
                    <p className="text-neutral-300 pl-12">allow create: if isVerified() && isValidId(projectId) && incoming().ownerId == request.auth.uid;</p>
                    <p className="text-neutral-300 pl-12">allow update: if isVerified() && (</p>
                    <p className="text-neutral-300 pl-16">isAdmin() || (</p>
                    <p className="text-neutral-300 pl-20">existing().ownerId == request.auth.uid &&</p>
                    <p className="text-neutral-300 pl-20">existing().status != 'COMPLETED' &&</p>
                    <p className="text-neutral-300 pl-20">incoming().diff(existing()).affectedKeys().hasOnly(['title', 'description', 'status'])</p>
                    <p className="text-neutral-300 pl-16">)</p>
                    <p className="text-neutral-300 pl-12">);</p>
                    <p className="text-neutral-300 pl-8">{"}"}</p>
                    <p className="text-neutral-500 pl-4">{"}"}</p>
                    <p className="text-neutral-500">{"}"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: CACHING & BACKGROUND JOBS */}
        {activeTab === 'caching' && (
          <motion.div
            key="caching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Caching panel */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div className="pb-4 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-widest">Performance Engine</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">Multi-Tier Caching Strategy</h3>
                <p className="text-xs text-neutral-400 mt-1">Implements fast caching policies for high-frequently queried data to reduce backend load.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Executive BI Dashboard Cache', ttl: '5 Minutes', policy: 'Invalidates on new Project Start / Verification', status: 'ACTIVE', hitRate: '94%' },
                  { title: 'Global Directory Search Cache', ttl: '15 Minutes', policy: 'Soft invalidates on Profile Verification triggers', status: 'ACTIVE', hitRate: '87%' },
                  { title: 'AI Match Vector Embeddings Cache', ttl: '1 Hour', policy: 'Recomputes on profile update / skill edit', status: 'ACTIVE', hitRate: '91%' },
                  { title: 'Localization translation files', ttl: '24 Hours', policy: 'Invalidates only on system version upgrade', status: 'ACTIVE', hitRate: '99.9%' }
                ].map((c, i) => (
                  <div key={i} className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-neutral-200">{c.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[9px] font-mono text-teal-400">{c.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-900/60 text-[10px] font-mono">
                      <div>
                        <span className="text-neutral-500 block">TTL LIMIT:</span>
                        <span className="text-neutral-300">{c.ttl}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">HIT RATE:</span>
                        <span className="text-teal-400 font-bold">{c.hitRate}</span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-neutral-500 block">INVALIDATION:</span>
                        <span className="text-neutral-300 truncate block max-w-[150px]" title={c.policy}>{c.policy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Workers Panel */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div className="pb-4 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-widest">Asynchronous Jobs</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">Background Job Queues & Cron</h3>
                <p className="text-xs text-neutral-400 mt-1">Decoupled queue worker system handling long-running transactions asynchronously.</p>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Transactional Email Dispatch Queue', trigger: 'Event-driven', workers: 4, retries: '3x with Exponential Backoff', active: '0 tasks pending' },
                  { name: 'Weekly Student Milestone Auto-Vetter', trigger: 'Every Sunday 23:59 UTC', workers: 6, retries: '5x with DLQ fallbacks', active: 'Cron Idle' },
                  { name: 'AI Recommendation Scoring Pipeline', trigger: 'Incremental updates', workers: 2, retries: '2x with timeout abort', active: 'Running (Low Priority)' },
                  { name: 'Point-In-Time Backup & Disaster Purge', trigger: 'Daily 02:00 UTC', workers: 1, retries: 'Verify checksum on finish', active: 'Scheduled' }
                ].map((job, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-neutral-200">{job.name}</h4>
                      <span className="text-[9px] font-mono text-neutral-400">{job.trigger}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-900/60 text-[10px] font-mono">
                      <div>
                        <span className="text-neutral-500 block">WORKER THREADS:</span>
                        <span className="text-neutral-300">{job.workers} thread(s)</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">RETRY POLICY:</span>
                        <span className="text-neutral-300">{job.retries}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[9px] font-mono text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>STATUS: {job.active}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: OBSERVABILITY & SCALING */}
        {activeTab === 'observability' && (
          <motion.div
            key="observability"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Observability Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logging Console Simulation */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">Structured JSON Logs</span>
                    <h3 className="text-xs font-bold text-white mt-0.5">Enterprise Audit Stream</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-400">STREAMING ACTIVE</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3 font-mono text-[10px] text-neutral-300 max-h-[300px] overflow-y-auto">
                  <p className="text-neutral-500">[2026-07-04T11:05:41Z] INFO [AuthService] Issued access token for student_uid=usr_849201</p>
                  <p className="text-neutral-500">[2026-07-04T11:05:42Z] INFO [ProjectService] Atomic state transition for projectId=prj_729402: status=PENDING_REVIEW -&gt; ACTIVE</p>
                  <p className="text-neutral-500">[2026-07-04T11:05:44Z] INFO [TrustEngine] Updated trust index for student_uid=usr_849201. Score adjusted: +4.2. Reason: Completed Weekly Milestone.</p>
                  <p className="text-neutral-400 font-semibold text-teal-400">[2026-07-04T11:05:45Z] INFO [AuditService] Secure immutable commit of StudentMilestoneSubmitted event. Hash=a8c42b9d0e</p>
                  <p className="text-neutral-500">[2026-07-04T11:05:48Z] INFO [NotificationService] Notification dispatched via queue item=not_39201. Target channels: [InApp, Email]</p>
                  <p className="text-neutral-500">[2026-07-04T11:05:50Z] INFO [AI_MatchingService] AI Scoring query completed. Cosine embedding computed in 14ms.</p>
                </div>
              </div>

              {/* Scaling Details */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Scalability Specifications</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">Global Infrastructure Scaling</h3>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-teal-400 block font-bold">1. HORIZONTAL SCALING</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Stateless API containers scale horizontally based on request queue sizes, ensuring peak capacity during milestone deadlines.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-teal-400 block font-bold">2. POINT-IN-TIME BACKUPS</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Auto backup system with full disaster recovery checksum validations, supporting restoration in minutes.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-teal-400 block font-bold">3. GLOBAL EXPANSION PIPELINE</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Edge caching and database multi-region replication ready, configured to dynamically serve users in Korea, Japan, Germany, and beyond.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testing & Integrations specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-900 space-y-3">
                <h4 className="text-xs font-bold text-neutral-200">Production Testing Strategy</h4>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span>Unit & Integration Tests</span>
                    <span className="text-[10px] font-mono text-teal-400 font-bold">96% Coverage Mandate</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span>API Performance Vetting</span>
                    <span className="text-[10px] font-mono text-teal-400 font-bold">&lt;100ms Ingress Targets</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                    <span>Security Red Team Auditing</span>
                    <span className="text-[10px] font-mono text-teal-400 font-bold">Automated Rules Check</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-900 space-y-3">
                <h4 className="text-xs font-bold text-neutral-200">Scalable Integration Architecture</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Engineered with unified gateway interfaces ready to bind external tools seamlessly. Supports:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['GitHub API', 'LinkedIn Auth', 'Google Workspace', 'Zoom API', 'Slack Webhooks', 'Stripe Payments', 'University APIs'].map(i => (
                    <span key={i} className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple helper Star icon matching lucide styling
function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
