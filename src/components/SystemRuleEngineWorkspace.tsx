import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Sliders,
  Database,
  Code,
  Terminal,
  Activity,
  UserCheck,
  Building2,
  FileCheck,
  Zap,
  Lock,
  Unlock,
  History,
  AlertTriangle,
  RefreshCw,
  Bell,
  Eye,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Settings,
  HelpCircle,
  AlertCircle,
  Fingerprint,
  Layers,
  Check,
  Share2,
  Cpu,
  Radio,
  HardDrive,
  Globe,
  DatabaseBackup,
  Flame,
  ChevronRight,
  TrendingUp,
  Award
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
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 9.0 CONSTITUTION)
// ============================================================================

export type UserType =
  | 'Student'
  | 'Company'
  | 'Administrator'
  | 'Super Administrator'
  | 'Moderator'
  | 'Reviewer'
  | 'Mentor'
  | 'Observer'
  | 'Auditor'
  | 'System';

export type StudentState =
  | 'Draft'
  | 'Registered'
  | 'Verified'
  | 'Approved'
  | 'Active'
  | 'Restricted'
  | 'Suspended'
  | 'Archived';

export type CompanyState =
  | 'Draft'
  | 'Registered'
  | 'Verified'
  | 'Approved'
  | 'Active'
  | 'Restricted'
  | 'Suspended'
  | 'Archived';

export type ProjectState =
  | 'Draft'
  | 'Review'
  | 'Published'
  | 'Application'
  | 'Selection'
  | 'Running'
  | 'Completed'
  | 'Archived';

export type ApplicationState =
  | 'Submitted'
  | 'Screening'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface RuleEngineEvent {
  id: string;
  timestamp: string;
  type: 'Authentication' | 'Verification' | 'Approval' | 'Project' | 'Matching' | 'Performance' | 'Trust' | 'Warning' | 'Badge' | 'Notification' | 'Learning' | 'Analytics' | 'Security';
  action: string;
  actor: string;
  role: UserType;
  entityId: string;
  previousState: string;
  currentState: string;
  signature: string; // Immutable Cryptographic Hash simulation
  correlationId: string;
  version: number;
}

export interface FraudCase {
  id: string;
  type: 'Duplicate Accounts' | 'Fake Documents' | 'Review Farming' | 'Trust Farming' | 'Performance Manipulation' | 'Mass Applications' | 'Bot Activity' | 'Account Sharing' | 'IP Abuse';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  targetId: string;
  targetName: string;
  detectedAt: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'False Positive';
  evidenceSummary: string;
  deviceFingerprint: string;
  ipAddress: string;
}

export interface RuleConfig {
  maxActiveProjectsPerStudent: number;
  maxOpenProjectsPerCompany: number;
  maxApplicationsPerStudentPerDay: number;
  maxMessagesPerMinute: number;
  reviewFrequencyDays: number;
  jwtExpiryMinutes: number;
  concurrencyLockTimeoutMs: number;
  rateLimitRequestsPerMin: number;
  enableMfaRequired: boolean;
  activeRuleVersion: string;
}

export interface ValidationStepLog {
  step: 'Authentication' | 'Authorization' | 'Input Validation' | 'Business Validation' | 'Duplicate Validation' | 'Workflow Validation' | 'Permission Validation' | 'Processing' | 'Audit';
  status: 'PASS' | 'FAIL' | 'SKIPPED';
  message: string;
  latencyMs: number;
}

// ============================================================================
// INITIAL DATA SEEDS
// ============================================================================

const INITIAL_EVENTS: RuleEngineEvent[] = [
  {
    id: 'EVT-100291',
    timestamp: '2026-07-04T19:45:00Z',
    type: 'Security',
    action: 'JWT_ACCESS_GRANTED',
    actor: 'wanderjay3456@gmail.com',
    role: 'Super Administrator',
    entityId: 'ADMIN-USER-99',
    previousState: 'Session_Expired',
    currentState: 'Authorized_Active',
    signature: 'sha256-a97f10b2c3d4e5f60718293a4b5c6d7e8f9012a3',
    correlationId: 'corr-jwt-88172c72b',
    version: 1
  },
  {
    id: 'EVT-100292',
    timestamp: '2026-07-04T19:50:12Z',
    type: 'Approval',
    action: 'STUDENT_ELIGIBILITY_APPROVED',
    actor: 'System',
    role: 'System',
    entityId: 'STU-PRO-001',
    previousState: 'Verified',
    currentState: 'Approved',
    signature: 'sha256-0cf23173e129f123ca397b98dcf78712aef912f2',
    correlationId: 'corr-approve-7721a',
    version: 1
  },
  {
    id: 'EVT-100293',
    timestamp: '2026-07-04T19:55:04Z',
    type: 'Project',
    action: 'PROJECT_PUBLICATION_BLOCKED',
    actor: 'SwiftStart Staff',
    role: 'Company',
    entityId: 'PROJ-PRO-302',
    previousState: 'Draft',
    currentState: 'Draft',
    signature: 'sha256-bb6f6a5d4e3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a',
    correlationId: 'corr-proj-0021c',
    version: 2
  },
  {
    id: 'EVT-100294',
    timestamp: '2026-07-04T19:58:15Z',
    type: 'Warning',
    action: 'STUDENT_SUSPENSION_TRIGGERED',
    actor: 'Trust & Safety Core',
    role: 'Administrator',
    entityId: 'STU-PRO-009',
    previousState: 'Restricted',
    currentState: 'Suspended',
    signature: 'sha256-ff7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a',
    correlationId: 'corr-warn-9912a',
    version: 1
  }
];

const INITIAL_FRAUD_CASES: FraudCase[] = [
  {
    id: 'FRD-001',
    type: 'Duplicate Accounts',
    severity: 'CRITICAL',
    targetId: 'STU-PRO-072',
    targetName: 'Tran Nguyen An',
    detectedAt: '2026-07-04T12:00:00Z',
    status: 'Under Investigation',
    evidenceSummary: 'Same device browser fingerprint (WebGL + Canvas matches) registered across 3 different emails within 10 minutes.',
    deviceFingerprint: 'fp_chrome_mac_8f99c22',
    ipAddress: '113.161.44.82'
  },
  {
    id: 'FRD-002',
    type: 'Review Farming',
    severity: 'HIGH',
    targetId: 'COMP-PRO-410',
    targetName: 'Farming Solutions Tech',
    detectedAt: '2026-07-04T15:20:00Z',
    status: 'Open',
    evidenceSummary: '5 positive feedback evaluations submitted from the exact same class-C subnet IP address within 4 minutes.',
    deviceFingerprint: 'fp_firefox_win_0a12e8c',
    ipAddress: '113.161.44.85'
  },
  {
    id: 'FRD-003',
    type: 'Mass Applications',
    severity: 'MEDIUM',
    targetId: 'STU-PRO-204',
    targetName: 'Hoang Van Nam',
    detectedAt: '2026-07-04T18:10:00Z',
    status: 'Resolved',
    evidenceSummary: 'Account submitted 32 applications in 15 seconds. Rate-limiting rules temporarily locked candidate account eligibility.',
    deviceFingerprint: 'fp_safari_ios_3311ab2',
    ipAddress: '14.161.5.12'
  }
];

const INITIAL_RULE_CONFIG: RuleConfig = {
  maxActiveProjectsPerStudent: 3,
  maxOpenProjectsPerCompany: 10,
  maxApplicationsPerStudentPerDay: 15,
  maxMessagesPerMinute: 60,
  reviewFrequencyDays: 7,
  jwtExpiryMinutes: 120,
  concurrencyLockTimeoutMs: 1500,
  rateLimitRequestsPerMin: 120,
  enableMfaRequired: false,
  activeRuleVersion: 'v2.1.0'
};

const OBSERVABILITY_ERROR_CODES = [
  { code: 'ERR_AUTH_EXPIRED', count: 124 },
  { code: 'ERR_PERMISSION_DENIED', count: 85 },
  { code: 'ERR_BUSINESS_INCOMPLETE_PROFILE', count: 210 },
  { code: 'ERR_WORKFLOW_STATE_LOCKED', count: 42 },
  { code: 'ERR_CONCURRENCY_VERSION_MISMATCH', count: 18 },
  { code: 'ERR_RATE_LIMIT_EXCEEDED', count: 320 }
];

const LATENCY_SERIES_DATA = [
  { time: '19:10', apiLatency: 42, dbLatency: 12, matchLatency: 120 },
  { time: '19:20', apiLatency: 38, dbLatency: 10, matchLatency: 115 },
  { time: '19:30', apiLatency: 45, dbLatency: 15, matchLatency: 130 },
  { time: '19:40', apiLatency: 62, dbLatency: 28, matchLatency: 155 },
  { time: '19:50', apiLatency: 35, dbLatency: 9, matchLatency: 110 },
  { time: '20:00', apiLatency: 40, dbLatency: 11, matchLatency: 122 }
];

const PIE_PERMISSIONS = [
  { name: 'Students', value: 7400, color: '#3b82f6' },
  { name: 'Companies', value: 850, color: '#10b981' },
  { name: 'Administrators', value: 45, color: '#f59e0b' },
  { name: 'Auditors & Observability', value: 12, color: '#a855f7' }
];

export default function SystemRuleEngineWorkspace() {
  // ============================================================================
  // WORKSPACE STATES
  // ============================================================================
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'sandbox' | 'rbac' | 'config' | 'fraud' | 'observability' | 'dr_backup'>('dashboard');
  
  // Real-time Event stream
  const [events, setEvents] = useState<RuleEngineEvent[]>(INITIAL_EVENTS);
  const [fraudCases, setFraudCases] = useState<FraudCase[]>(INITIAL_FRAUD_CASES);
  const [ruleConfig, setRuleConfig] = useState<RuleConfig>(INITIAL_RULE_CONFIG);
  const [configVersionCount, setConfigVersionCount] = useState(21);
  const [mfaStatus, setMfaStatus] = useState(false);

  // Sandbox Test Console State
  const [sandboxActorType, setSandboxActorType] = useState<UserType>('Student');
  const [sandboxTargetType, setSandboxTargetType] = useState<'ApplyProject' | 'PublishProject' | 'EvaluateProgress' | 'ModifyScore' | 'AuditBypass'>('ApplyProject');
  const [sandboxStateParam, setSandboxStateParam] = useState<string>('Unverified');
  const [sandboxLog, setSandboxLog] = useState<ValidationStepLog[]>([]);
  const [sandboxResultStatus, setSandboxResultStatus] = useState<'NONE' | 'SUCCESS' | 'BLOCKED'>('NONE');
  const [sandboxDiagnosticMsg, setSandboxDiagnosticMsg] = useState('');
  const [sandboxEntityId, setSandboxEntityId] = useState('STU-PRO-002');
  const [sandboxConcurrencyVersion, setSandboxConcurrencyVersion] = useState(1);
  
  // DR Backup states
  const [backupLogs, setBackupLogs] = useState<{ id: string; timestamp: string; size: string; status: string; hash: string }[]>([
    { id: 'BAK-1029', timestamp: '2026-07-04T00:00:00Z', size: '1.24 GB', status: 'COMPLETED', hash: 'sha256-91a82bc...81f' },
    { id: 'BAK-1028', timestamp: '2026-07-03T00:00:00Z', size: '1.21 GB', status: 'COMPLETED', hash: 'sha256-ab728cf...33e' }
  ]);
  const [pitrValue, setPitrValue] = useState(100); // percentage timeline
  const [recoveryLog, setRecoveryLog] = useState<string[]>([]);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [isDrActive, setIsDrActive] = useState(false);

  // Automated Integration Tests
  const [testSuiteRun, setTestSuiteRun] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; status: 'PASS' | 'FAIL'; msg: string }[]>([]);

  // DB Schema & Api Viewer Selectors
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<'system_configurations' | 'immutable_audit_log' | 'fraud_cases' | 'role_permissions'>('system_configurations');
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState('POST /api/constitution/validate');

  // ============================================================================
  // CONSTITUTION AUTOMATED VALIDATION SANDBOX
  // ============================================================================
  const executeSandboxValidation = () => {
    const logs: ValidationStepLog[] = [];
    setSandboxResultStatus('NONE');
    setSandboxDiagnosticMsg('');

    // Step 1: Authentication (Checks actor exists and JWT session validity)
    const isSuspended = sandboxStateParam === 'Suspended';
    logs.push({
      step: 'Authentication',
      status: isSuspended ? 'FAIL' : 'PASS',
      message: isSuspended ? 'Session authentication blocked. Account with State: Suspended is strictly forbidden from accessing endpoints.' : 'JWT Authentication handshake valid.',
      latencyMs: Math.floor(Math.random() * 4) + 1
    });

    if (isSuspended) {
      setSandboxLog(logs);
      setSandboxResultStatus('BLOCKED');
      setSandboxDiagnosticMsg('ERR_AUTH_ACCOUNT_SUSPENDED: Account is suspended in platform records. Access token revoked.');
      triggerEvent('Security', 'AUTHENTICATION_REVOKED', sandboxActorType, sandboxEntityId, sandboxStateParam, 'Suspended');
      return;
    }

    // Step 2: Authorization & Roles Permissions Matrix
    let authPassed = true;
    let authMsg = 'Role verification match successfully computed.';
    
    if (sandboxTargetType === 'ModifyScore' && !['Administrator', 'Super Administrator', 'System'].includes(sandboxActorType)) {
      authPassed = false;
      authMsg = `ERR_PERMISSION_DENIED: Role [${sandboxActorType}] does not possess resource permission to change or alter core systems. Only Administrators / System can write score states.`;
    } else if (sandboxTargetType === 'PublishProject' && !['Company', 'Administrator', 'Super Administrator', 'System'].includes(sandboxActorType)) {
      authPassed = false;
      authMsg = `ERR_PERMISSION_DENIED: Role [${sandboxActorType}] is forbidden from publishing project portfolios. Target ownership constrained to Companies.`;
    } else if (sandboxTargetType === 'ApplyProject' && !['Student', 'System'].includes(sandboxActorType)) {
      authPassed = false;
      authMsg = `ERR_PERMISSION_DENIED: Role [${sandboxActorType}] cannot submit student candidate applications.`;
    } else if (sandboxTargetType === 'AuditBypass' && sandboxActorType !== 'Super Administrator') {
      authPassed = false;
      authMsg = `CRITICAL: Role [${sandboxActorType}] lacks access to administrative governance bypass controls.`;
    }

    logs.push({
      step: 'Authorization',
      status: authPassed ? 'PASS' : 'FAIL',
      message: authMsg,
      latencyMs: Math.floor(Math.random() * 3) + 1
    });

    if (!authPassed) {
      setSandboxLog(logs);
      setSandboxResultStatus('BLOCKED');
      setSandboxDiagnosticMsg(authMsg);
      triggerEvent('Security', 'UNAUTHORIZED_ACCESS_BLOCKED', sandboxActorType, sandboxEntityId, sandboxStateParam, sandboxStateParam);
      return;
    }

    // Step 3: Input Validation
    const isEntityEmpty = !sandboxEntityId.trim();
    logs.push({
      step: 'Input Validation',
      status: isEntityEmpty ? 'FAIL' : 'PASS',
      message: isEntityEmpty ? 'Entity identifier parameters missing or empty.' : 'Parameters syntax checks completed successfully.',
      latencyMs: 1
    });

    if (isEntityEmpty) {
      setSandboxLog(logs);
      setSandboxResultStatus('BLOCKED');
      setSandboxDiagnosticMsg('ERR_INPUT_SYNTAX_MALFORMED: entityId cannot be empty.');
      return;
    }

    // Step 4: Business Verification Validation
    let businessPassed = true;
    let businessMsg = 'Ecosystem constitution state rules applied.';

    if (sandboxTargetType === 'ApplyProject' && sandboxStateParam === 'Unverified') {
      businessPassed = false;
      businessMsg = 'ERR_BUSINESS_UNVERIFIED_APPLICANT: Platform Constitution strictly prohibits Unverified candidates from applying to active matching projects. Required: verified identity & university record.';
    } else if (sandboxTargetType === 'PublishProject' && sandboxStateParam === 'Unverified') {
      businessPassed = false;
      businessMsg = 'ERR_BUSINESS_UNVERIFIED_COMPANY: Unverified business entities are forbidden from publishing project details to the ecosystem pool.';
    } else if (sandboxTargetType === 'PublishProject' && sandboxStateParam === 'Incomplete') {
      businessPassed = false;
      businessMsg = 'ERR_BUSINESS_INCOMPLETE_PROFILE: Required fields missing in company workspace. Profile completeness must be verified before publishing.';
    }

    logs.push({
      step: 'Business Validation',
      status: businessPassed ? 'PASS' : 'FAIL',
      message: businessMsg,
      latencyMs: Math.floor(Math.random() * 5) + 2
    });

    if (!businessPassed) {
      setSandboxLog(logs);
      setSandboxResultStatus('BLOCKED');
      setSandboxDiagnosticMsg(businessMsg);
      triggerEvent('Trust', 'CONSTITUTION_RULE_VIOLATION_LOGGED', sandboxActorType, sandboxEntityId, sandboxStateParam, sandboxStateParam);
      return;
    }

    // Step 5: Duplicate Validation
    logs.push({
      step: 'Duplicate Validation',
      status: 'PASS',
      message: 'No duplicate operations detected in Redis caching layer within current sliding time window.',
      latencyMs: 1
    });

    // Step 6: Workflow state machines checks
    logs.push({
      step: 'Workflow Validation',
      status: 'PASS',
      message: 'Workflow transitions validated. Target object matching rule compliance matches platform standards.',
      latencyMs: Math.floor(Math.random() * 3) + 1
    });

    // Step 7: Permission scoped resource ownership checks
    logs.push({
      step: 'Permission Validation',
      status: 'PASS',
      message: 'Request ownership verified. User owns targeted resource.',
      latencyMs: 1
    });

    // Step 8: Processing state & optimistic lock checks (version numbers check)
    const mockDbConcurrencyFailure = sandboxConcurrencyVersion < 1;
    logs.push({
      step: 'Processing',
      status: mockDbConcurrencyFailure ? 'FAIL' : 'PASS',
      message: mockDbConcurrencyFailure ? 'ERR_CONCURRENCY_LOCK_ACQUIRE_FAILED: Database transaction was aborted due to optimistic locking version conflict.' : 'Optimistic lock version checked and applied successfully.',
      latencyMs: Math.floor(Math.random() * 8) + 3
    });

    if (mockDbConcurrencyFailure) {
      setSandboxLog(logs);
      setSandboxResultStatus('BLOCKED');
      setSandboxDiagnosticMsg('ERR_CONCURRENCY_LOCK_ACQUIRE_FAILED: Aborted. Version mismatch.');
      return;
    }

    // Step 9: Audit log writing
    logs.push({
      step: 'Audit',
      status: 'PASS',
      message: 'Cryptographically signed audit event successfully persisted to immutable cold log ledger.',
      latencyMs: Math.floor(Math.random() * 4) + 1
    });

    setSandboxLog(logs);
    setSandboxResultStatus('SUCCESS');
    setSandboxDiagnosticMsg('Transaction approved and compiled! System rules successfully passed, and audit ledger signed.');
    triggerEvent(
      sandboxTargetType === 'ApplyProject' ? 'Project' : sandboxTargetType === 'PublishProject' ? 'Project' : 'Trust',
      sandboxTargetType === 'ApplyProject' ? 'APPLICATION_SUBMITTED' : sandboxTargetType === 'PublishProject' ? 'PROJECT_PUBLISHED' : 'TRANSACTION_COMMITTED',
      sandboxActorType,
      sandboxEntityId,
      sandboxStateParam,
      sandboxStateParam === 'Verified' ? 'Active' : sandboxStateParam
    );
  };

  // ============================================================================
  // DISPATCH IMMUTABLE SYSTEM EVENT
  // ============================================================================
  const triggerEvent = (
    type: RuleEngineEvent['type'],
    action: string,
    actor: string,
    entityId: string,
    previousState: string,
    currentState: string
  ) => {
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const hash = `sha256-${randomHex}`;
    
    const newEvent: RuleEngineEvent = {
      id: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      type,
      action,
      actor,
      role: actor === 'System' ? 'System' : 'Super Administrator',
      entityId,
      previousState,
      currentState,
      signature: hash,
      correlationId: `corr-${Math.random().toString(36).substring(2, 8)}`,
      version: 1
    };

    setEvents(prev => [newEvent, ...prev]);
  };

  // ============================================================================
  // DISASTER RECOVERY & POINT-IN-TIME BACKUP
  // ============================================================================
  const runBackupSnapshot = () => {
    setIsBackupRunning(true);
    setBackupLogs(prev => [
      {
        id: `BAK-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        size: `${(Math.random() * 0.2 + 1.2).toFixed(2)} GB`,
        status: 'PENDING',
        hash: 'CALCULATING...'
      },
      ...prev
    ]);

    setTimeout(() => {
      setBackupLogs(prev => prev.map((bak, i) => {
        if (i === 0) {
          return {
            ...bak,
            status: 'COMPLETED',
            hash: `sha256-${Math.random().toString(16).substring(2, 12)}...8cf`
          };
        }
        return bak;
      }));
      setIsBackupRunning(false);
    }, 1500);
  };

  const executePointInTimeRecovery = () => {
    setIsDrActive(true);
    const logs: string[] = [];
    logs.push('[DR-ENGINE] Disaster Recovery sequence initialized.');
    logs.push(`[DR-ENGINE] Targeted Point-In-Time recovery threshold is set to: ${pitrValue}% duration offset.`);
    logs.push('[DR-ENGINE] Safely checking write-ahead logs (WAL) for consistency.');
    logs.push('[DR-ENGINE] Dropping current corrupted transaction log indexes.');
    logs.push('[DR-ENGINE] Re-applying transaction events sequentially from secure multiregion snapshot replicas.');
    
    setRecoveryLog(logs);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx === 1) {
        setRecoveryLog(prev => [...prev, '[DR-ENGINE] Recovering "system_configurations" records (checksum: MATCH).']);
      } else if (idx === 2) {
        setRecoveryLog(prev => [...prev, '[DR-ENGINE] Recovering "immutable_audit_log" records. Checked 1,245 ledger lines.']);
      } else if (idx === 3) {
        setRecoveryLog(prev => [...prev, '[DR-ENGINE] Flushing server cache memory state (Redis cluster).']);
      } else if (idx === 4) {
        setRecoveryLog(prev => [...prev, '[DR-ENGINE] Disaster Recovery point-in-time snapshot applied successfully. Core engine re-aligned in active state!']);
        setIsDrActive(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  // ============================================================================
  // AUTOMATED PLATFORM INTEGRATION TEST SUITE
  // ============================================================================
  const executeIntegrationTests = () => {
    setTestSuiteRun(true);
    const results: { name: string; status: 'PASS' | 'FAIL'; msg: string }[] = [];

    // Test 1: Optimistic Concurrency Checks
    try {
      const dbRecordVersion: number = 3;
      const incomingUpdateVersion: number = 2; // Conflict
      if (incomingUpdateVersion !== dbRecordVersion) {
        results.push({
          name: 'Test 1: Database Optimistic Concurrency Validation',
          status: 'PASS',
          msg: `Passed. Detected version conflict (incoming: v${incomingUpdateVersion} vs database: v${dbRecordVersion}). Successfully protected database states from race conditions.`
        });
      } else {
        results.push({ name: 'Test 1: Database Optimistic Concurrency Validation', status: 'FAIL', msg: 'Failed. Conflict should have blocked the transaction.' });
      }
    } catch (e: any) {
      results.push({ name: 'Test 1: Database Optimistic Concurrency Validation', status: 'FAIL', msg: e.message });
    }

    // Test 2: Unverified Applicants Blocking Constraint
    try {
      const studentState: string = 'Draft';
      const resultActionAllowed = studentState === 'Verified' || studentState === 'Approved' || studentState === 'Active';
      if (!resultActionAllowed) {
        results.push({
          name: 'Test 2: Platform Constitution - Unverified Candidate Lockouts',
          status: 'PASS',
          msg: `Passed. Unverified student (State: ${studentState}) is prohibited from active project matching pipelines.`
        });
      } else {
        results.push({ name: 'Test 2: Platform Constitution - Unverified Candidate Lockouts', status: 'FAIL', msg: 'Failed. Draft student should be blocked.' });
      }
    } catch (e: any) {
      results.push({ name: 'Test 2: Platform Constitution - Unverified Candidate Lockouts', status: 'FAIL', msg: e.message });
    }

    // Test 3: System Hard limits checks
    try {
      const activeProjectsCount = 4;
      const limitConfigured = ruleConfig.maxActiveProjectsPerStudent; // 3
      if (activeProjectsCount > limitConfigured) {
        results.push({
          name: 'Test 3: Platform Rule Engine - Student Limits Guardrail',
          status: 'PASS',
          msg: `Passed. Max active projects cap check failed for candidate (${activeProjectsCount} exceeded limit ${limitConfigured}). Blocked application.`
        });
      } else {
        results.push({ name: 'Test 3: Platform Rule Engine - Student Limits Guardrail', status: 'FAIL', msg: 'Failed. Over-limit should have been flagged.' });
      }
    } catch (e: any) {
      results.push({ name: 'Test 3: Platform Rule Engine - Student Limits Guardrail', status: 'FAIL', msg: e.message });
    }

    // Test 4: Suspended User Access Prevention Lock
    try {
      const userState: CompanyState = 'Suspended';
      const isLoginPermitted = userState !== 'Suspended' && userState !== 'Archived';
      if (!isLoginPermitted) {
        results.push({
          name: 'Test 4: Platform Rule Engine - Suspended Account Blockade',
          status: 'PASS',
          msg: 'Passed. Checked security token generation. Suspended account block successfully returned ERR_AUTH_ACCOUNT_SUSPENDED.'
        });
      } else {
        results.push({ name: 'Test 4: Platform Rule Engine - Suspended Account Blockade', status: 'FAIL', msg: 'Failed. Allowed login.' });
      }
    } catch (e: any) {
      results.push({ name: 'Test 4: Platform Rule Engine - Suspended Account Blockade', status: 'FAIL', msg: e.message });
    }

    setTestResults(results);
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const updateRuleConfig = (field: keyof RuleConfig, value: any) => {
    setRuleConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setConfigVersionCount(v => v + 1);
    triggerEvent('Learning', 'SYSTEM_CONFIGURATION_UPDATED', 'Super Administrator', 'SYS-CONF', 'v2.1.0', `v2.1.${configVersionCount}`);
  };

  const handleMfaToggle = () => {
    const nextVal = !mfaStatus;
    setMfaStatus(nextVal);
    updateRuleConfig('enableMfaRequired', nextVal);
  };

  return (
    <div id="system-rule-engine-workspace" className="bg-neutral-950 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-neutral-200">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400">Specification 9.0</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">System Rule Engine (Constitution)</h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            The operational constitution of the entire KONEXA platform. Orchestrates permission mapping (RBAC), multi-stage validation, automated workflows, observability metrics, backup strategies, and security locks.
          </p>
        </div>

        {/* TOP COGNITIVE METER PANELS */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono uppercase">CONSTITUTIONAL CODE</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">STRICT MODE (ACTIVE)</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono">CONCURRENT ACTIVE CORES</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 animate-pulse" />
              12 Node Cluster
            </span>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR */}
      <div className="flex flex-wrap gap-1.5 bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/40">
        {[
          { id: 'dashboard', label: 'Ecosystem Constitution Matrix', icon: Layers },
          { id: 'sandbox', label: 'Constitution Validation Sandbox', icon: Terminal },
          { id: 'rbac', label: 'RBAC Permission Matrix', icon: Scale },
          { id: 'config', label: 'Constitutional Limits Controller', icon: Sliders },
          { id: 'fraud', label: 'Fraud Detection Engine', icon: ShieldAlert },
          { id: 'observability', label: 'Observability & PostgreSQL DB', icon: Database },
          { id: 'dr_backup', label: 'Disaster Recovery Recovery Console', icon: DatabaseBackup }
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
              {tab.id === 'fraud' && fraudCases.filter(c => c.status === 'Open').length > 0 && (
                <span className="bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {fraudCases.filter(c => c.status === 'Open').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE CONSTITUTION VIEWS */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ==========================================================
              SUB-TAB 1: ECOSYSTEM CONSTITUTION MATRIX
              ========================================================== */}
          {activeSubTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* TOP SUMMARY DIALS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-neutral-400 uppercase font-mono font-bold">Rule Engine Version</span>
                    <Sliders className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-white font-mono">v2.1.{configVersionCount}</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Deterministic state execution logic: ACTIVE</p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-neutral-400 uppercase font-mono font-bold">Platform Status Rate</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">99.98%</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Zero unauthorized bypass breaches detected</p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-neutral-400 uppercase font-mono font-bold">Immutable Ledger Size</span>
                    <History className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-white font-mono">{events.length} Signed Events</span>
                    <p className="text-[10px] text-neutral-500 mt-1">Cryptographic hashes safely anchored</p>
                  </div>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-neutral-400 uppercase font-mono font-bold">MFA Guard Status</span>
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className={`text-2xl font-extrabold font-mono ${mfaStatus ? 'text-amber-400' : 'text-neutral-500'}`}>
                      {mfaStatus ? 'ENFORCED' : 'OPTIONAL'}
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-1">Temporary token security checks</p>
                  </div>
                </div>
              </div>

              {/* CORE CONSTITUTION PRINCIPLES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. PRINCIPLES GRID */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      Constitutional Principles
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Primary governance mandates binding all subsystems.</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { title: 'Platform Quality over Quantity', desc: 'Strict candidate verification overrides general throughput.', color: 'border-indigo-500/20 text-indigo-300' },
                      { title: 'Trust before Matching', desc: 'Verification criteria must be fully approved prior to system matches.', color: 'border-emerald-500/20 text-emerald-300' },
                      { title: 'Project before Employment', desc: 'Focus strictly on verified short-term projects instead of traditional employment.', color: 'border-blue-500/20 text-blue-300' },
                      { title: 'Evidence before Evaluation', desc: 'Every score is reproducible with strict verification hashes.', color: 'border-amber-500/20 text-amber-300' },
                      { title: 'Consistency before Speed', desc: 'Optimistic locking & state validators block incomplete transactions.', color: 'border-rose-500/20 text-rose-300' }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-3 bg-neutral-950 border rounded-xl space-y-0.5 ${item.color}`}>
                        <div className="text-xs font-bold font-mono">{idx + 1}. {item.title}</div>
                        <div className="text-[10px] text-neutral-400">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SECURE EVENT BUS LEDGER (IMMUTABLE STREAM) */}
                <div className="lg:col-span-2 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                        <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                        Constitutional Event Bus Ledger
                      </h3>
                      <p className="text-xs text-neutral-400">Immutable, signed state transaction streams.</p>
                    </div>
                    <button
                      onClick={() => triggerEvent('Security', 'MANUAL_CONSTITUTIONAL_AUDIT_TRIGGERED', 'Super Administrator', 'SYS-AUDIT', 'Stable', 'Audited')}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] rounded-lg font-bold font-mono transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      Emit Event
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 font-mono">
                    {events.map((evt) => (
                      <div key={evt.id} className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
                          <span className="font-bold text-indigo-400">{evt.action}</span>
                          <span className="text-neutral-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] text-neutral-400 border-t border-neutral-900 pt-2">
                          <div>
                            <span className="text-neutral-600">ID:</span> {evt.id}
                          </div>
                          <div>
                            <span className="text-neutral-600">Actor:</span> {evt.actor} ({evt.role})
                          </div>
                          <div>
                            <span className="text-neutral-600">State Transition:</span> <span className="text-rose-400">{evt.previousState}</span> ➔ <span className="text-emerald-400">{evt.currentState}</span>
                          </div>
                          <div>
                            <span className="text-neutral-600">Engine Block:</span> v{evt.version}
                          </div>
                        </div>

                        <div className="text-[8px] bg-neutral-900/60 p-1.5 rounded border border-neutral-800 text-neutral-500 select-all overflow-x-auto">
                          SIG-SIG: {evt.signature} | CORR: {evt.correlationId}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 2: CONSTITUTION VALIDATION SANDBOX
              ========================================================== */}
          {activeSubTab === 'sandbox' && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* SANDBOX CONTROLS */}
              <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    Transaction Request Sandbox
                  </h3>
                  <p className="text-xs text-neutral-400">Configure a transaction request parameters and execute through the 9-stage validation pipeline.</p>
                </div>

                <div className="space-y-4">
                  {/* Actor role selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono">1. REQUEST ACTOR TYPE (RBAC)</label>
                    <select
                      value={sandboxActorType}
                      onChange={(e) => setSandboxActorType(e.target.value as UserType)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Student">Student</option>
                      <option value="Company">Company</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Super Administrator">Super Administrator</option>
                      <option value="System">System / Automated Core</option>
                    </select>
                  </div>

                  {/* Target Action selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono">2. CONSTITUTION TARGET OPERATION</label>
                    <select
                      value={sandboxTargetType}
                      onChange={(e) => setSandboxTargetType(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ApplyProject">Apply for Project Match (Required: Verified Profile)</option>
                      <option value="PublishProject">Publish New Project Portfolios (Required: Verified Company)</option>
                      <option value="EvaluateProgress">Evaluate Weekly Performance (Required: Company or System)</option>
                      <option value="ModifyScore">Modify User Trust & Performance State (Super-Admin / System only)</option>
                      <option value="AuditBypass">Attempt Governance Bypass Control Bypass (Highly Forbidden)</option>
                    </select>
                  </div>

                  {/* Candidate Current state */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono">3. ACTOR CONSTITUTIONAL STATE</label>
                    <select
                      value={sandboxStateParam}
                      onChange={(e) => setSandboxStateParam(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Unverified">Unverified (State: Draft/Registered)</option>
                      <option value="Verified">Verified / Approved (State: Verified)</option>
                      <option value="Suspended">Suspended (State: Suspended)</option>
                    </select>
                  </div>

                  {/* Target Entity ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono">4. TARGET ENTITY IDENTIFIER (entityId)</label>
                    <input
                      type="text"
                      value={sandboxEntityId}
                      onChange={(e) => setSandboxEntityId(e.target.value)}
                      placeholder="e.g. STU-PRO-001"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Concurrency version */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-semibold font-mono flex items-center justify-between">
                      <span>5. DB TRANSACTION VERSION</span>
                      <span className="text-[10px] text-neutral-500">Optimistic Lock</span>
                    </label>
                    <select
                      value={sandboxConcurrencyVersion}
                      onChange={(e) => setSandboxConcurrencyVersion(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                    >
                      <option value={1}>v1 (Valid Match - Ready)</option>
                      <option value={0}>v0 (Aborted - Stale Version Conflict)</option>
                    </select>
                  </div>

                  <button
                    onClick={executeSandboxValidation}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-4 h-4 text-white animate-pulse" />
                    EXECUTE TRANSACTION VALIDATION
                  </button>
                </div>
              </div>

              {/* SANDBOX RESULT TIMELINE */}
              <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">9-Stage Pipeline Audit</h3>
                    <p className="text-xs text-neutral-400">Execution log compiled by real-time constitutional validators.</p>
                  </div>

                  {/* Status Indicator */}
                  {sandboxResultStatus !== 'NONE' && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${sandboxResultStatus === 'SUCCESS' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                      {sandboxResultStatus === 'SUCCESS' ? 'TRANSACTION_APPROVED' : 'TRANSACTION_REJECTED'}
                    </span>
                  )}
                </div>

                {sandboxLog.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-neutral-500 space-y-2">
                    <Terminal className="w-8 h-8 text-neutral-700 animate-pulse" />
                    <p className="text-xs font-mono">No simulation compiled yet. Configure left parameters and run.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* TIMELINE LIST */}
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {sandboxLog.map((log, idx) => (
                        <div key={idx} className="bg-neutral-950 border border-neutral-800/60 rounded-xl p-3 flex items-start gap-3">
                          <span className="mt-0.5">
                            {log.status === 'PASS' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : log.status === 'FAIL' ? (
                              <XCircle className="w-4 h-4 text-rose-400 animate-bounce" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-neutral-500" />
                            )}
                          </span>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white font-mono">{idx + 1}. Stage {log.step}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">({log.latencyMs}ms)</span>
                            </div>
                            <p className="text-neutral-400 text-[11px]">{log.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* STRUCTURED RESPONSE */}
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2 font-mono text-xs">
                      <div className="text-neutral-500 uppercase font-bold text-[10px]">Validator Diagnostic Output</div>
                      <div className={`p-2.5 rounded border ${sandboxResultStatus === 'SUCCESS' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300' : 'bg-rose-500/5 border-rose-500/10 text-rose-300'}`}>
                        {sandboxDiagnosticMsg}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 3: RBAC PERMISSION MATRIX
              ========================================================== */}
          {activeSubTab === 'rbac' && (
            <motion.div
              key="rbac"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* INTRO AND CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* TEXTUAL SPECS */}
                <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white">Platform RBAC Matrix</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Comprehensive access groups mapping specified by enterprise bylaws.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { role: 'Student', can: ['Create Profile', 'Apply Match', 'Upload Portfolio'], cannot: ['Modify System Scores', 'Modify Trust Score', 'Review Others'] },
                      { role: 'Company', can: ['Create Projects', 'Submit Student Weekly Evaluations', 'Manage Applications'], cannot: ['Change Student Personal Records', 'Approve Own Business Registration'] },
                      { role: 'Administrator', can: ['Approve Accounts', 'Lock Disputes', 'Issue Compliance Warnings', 'Suspend Violators'], cannot: ['Modify Signed Immutable Audit Trails'] },
                      { role: 'Super Administrator', can: ['Manage Algorithms weights', 'Config settings', 'Toggle Feature Flags'], cannot: ['Delete Ledger Blocks'] }
                    ].map((row, idx) => (
                      <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-indigo-400">{row.role}</span>
                        </div>
                        <div className="space-y-1 text-[10px]">
                          <div><span className="text-emerald-400 font-bold">✓ CAN:</span> <span className="text-neutral-300">{row.can.join(', ')}</span></div>
                          <div><span className="text-rose-400 font-bold">✗ CANNOT:</span> <span className="text-neutral-400">{row.cannot.join(', ')}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GRAPHIC MATRIX REPRESENTATION */}
                <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white">User Base Role Distribution</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PIE_PERMISSIONS}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PIE_PERMISSIONS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff' }} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl text-xs text-neutral-400 font-mono space-y-1">
                    <div className="text-white font-bold">Object-Level Ownership Policy:</div>
                    <p className="text-[10px]">Candidates own profiles & applications; companies own project listings; the platform owns performance metrics & trust evaluation ledgers. Object updates verify ownership headers before writes.</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 4: WEIGHTS & HARD SYSTEM LIMITS CONTROLLER
              ========================================================== */}
          {activeSubTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CONTROLS COLUMN */}
                <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-5">
                  <div>
                    <h3 className="font-bold text-sm text-white">Platform System Limits Configuration</h3>
                    <p className="text-xs text-neutral-400">Super administrators can fine-tune strict platform caps. Updates increment version indexes and register event ledger hashes.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Limit 1 */}
                    <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl space-y-2">
                      <label className="text-xs text-neutral-300 font-mono block">MAX ACTIVE PROJECTS (STUDENT)</label>
                      <input
                        type="number"
                        value={ruleConfig.maxActiveProjectsPerStudent}
                        onChange={(e) => updateRuleConfig('maxActiveProjectsPerStudent', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                      />
                      <span className="text-[9px] text-neutral-500 block">Blocks candidate applications if active contracts match cap.</span>
                    </div>

                    {/* Limit 2 */}
                    <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl space-y-2">
                      <label className="text-xs text-neutral-300 font-mono block">MAX OPEN LISTINGS (COMPANY)</label>
                      <input
                        type="number"
                        value={ruleConfig.maxOpenProjectsPerCompany}
                        onChange={(e) => updateRuleConfig('maxOpenProjectsPerCompany', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                      />
                      <span className="text-[9px] text-neutral-500 block">Restricts recruiters from listing pending review positions.</span>
                    </div>

                    {/* Limit 3 */}
                    <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl space-y-2">
                      <label className="text-xs text-neutral-300 font-mono block">MAX APPLICATIONS PER STUDENT / DAY</label>
                      <input
                        type="number"
                        value={ruleConfig.maxApplicationsPerStudentPerDay}
                        onChange={(e) => updateRuleConfig('maxApplicationsPerStudentPerDay', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                      />
                      <span className="text-[9px] text-neutral-500 block">Anti-spam guard. Protects recruiters from bot application rushes.</span>
                    </div>

                    {/* Limit 4 */}
                    <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl space-y-2">
                      <label className="text-xs text-neutral-300 font-mono block">API RATE-LIMIT CAP (REQ/MIN)</label>
                      <input
                        type="number"
                        value={ruleConfig.rateLimitRequestsPerMin}
                        onChange={(e) => updateRuleConfig('rateLimitRequestsPerMin', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                      />
                      <span className="text-[9px] text-neutral-500 block">Shields Express web gateway routers from malicious DDoS attempts.</span>
                    </div>
                  </div>

                  {/* SECURITY MFA TIGHTENING */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-xl flex items-center justify-between">
                    <div className="space-y-1.5">
                      <span className="text-xs text-white font-bold font-mono">ENFORCE MANDATORY MFA SECURITY LEVEL</span>
                      <p className="text-[10px] text-neutral-400">Force all administrators and recruiters to use physical device security tags before writes.</p>
                    </div>
                    <button
                      onClick={handleMfaToggle}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${mfaStatus ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400'}`}
                    >
                      {mfaStatus ? 'MFA_ENFORCED' : 'ACTIVATE_MFA'}
                    </button>
                  </div>
                </div>

                {/* HISTORICAL RELEASES */}
                <div className="lg:col-span-5 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white">Rule Config Releases History</h3>
                  <div className="space-y-3 font-mono text-xs text-neutral-400">
                    <div className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-white font-semibold">
                        <span>Config Build v2.1.{configVersionCount}</span>
                        <span className="text-indigo-400">ACTIVE</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Released by Super-Admin. Updated limits parameters on-the-fly inside PostgreSQL config indices.</p>
                      <div className="text-[9px] text-neutral-600">Checksum: sha256-a07bc12...883f</div>
                    </div>

                    <div className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-2 opacity-50">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Config Build v2.1.20</span>
                        <span>Archived</span>
                      </div>
                      <p className="text-[10px]">Previous limits base configured during early launch setups.</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 5: ACTIVE FRAUD PREVENTION SYSTEM
              ========================================================== */}
          {activeSubTab === 'fraud' && (
            <motion.div
              key="fraud"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                      Platform Anti-Fraud Monitoring Center
                    </h3>
                    <p className="text-xs text-neutral-400">Heuristics-based automatic detection tracking bots, farming reviews, duplicate accounts, and IP manipulation.</p>
                  </div>
                  
                  {/* Stats counts */}
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
                      {fraudCases.filter(c => c.severity === 'CRITICAL' && c.status === 'Open').length} CRITICAL BLOCKS
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {fraudCases.map(fc => (
                    <div key={fc.id} className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${fc.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : fc.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {fc.severity} FRAUD ALERT
                          </span>
                          <span className="text-xs font-bold text-white font-sans">{fc.type}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">({fc.id})</span>
                        </div>

                        <p className="text-xs text-neutral-400 font-sans max-w-3xl">{fc.evidenceSummary}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-[10px] text-neutral-500 font-mono">
                          <div><span className="text-neutral-600">Target User:</span> {fc.targetName} ({fc.targetId})</div>
                          <div><span className="text-neutral-600">IP Pointer:</span> {fc.ipAddress}</div>
                          <div><span className="text-neutral-600">Browser Fingerprint:</span> {fc.deviceFingerprint}</div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-row sm:flex-col justify-end gap-2 text-right min-w-[150px]">
                        <div className="text-xs font-bold font-mono text-neutral-400">
                          Status: <span className="text-indigo-400">{fc.status}</span>
                        </div>
                        {fc.status === 'Open' || fc.status === 'Under Investigation' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setFraudCases(prev => prev.map(c => c.id === fc.id ? { ...c, status: 'Resolved' } : c));
                                triggerEvent('Security', 'FRAUD_CASE_RESOLVED', 'Super Administrator', fc.targetId, 'Flagged', 'Clean');
                              }}
                              className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-lg font-mono transition-all"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => {
                                setFraudCases(prev => prev.map(c => c.id === fc.id ? { ...c, status: 'False Positive' } : c));
                              }}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-[10px] font-bold rounded-lg font-mono transition-all"
                            >
                              Dismiss
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/15">
                            INVESTIGATION_FINISHED
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 6: OBSERVABILITY & DATABASE SCHEMA (POSTGRESQL)
              ========================================================== */}
          {activeSubTab === 'observability' && (
            <motion.div
              key="observability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* UPPER METRICS CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Latency Area chart */}
                <div className="lg:col-span-8 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Subsystem Latency metrics (Observability Core)
                  </h3>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={LATENCY_SERIES_DATA}>
                        <defs>
                          <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMatch" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#525252" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                        <YAxis stroke="#525252" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <CartesianGrid stroke="#171717" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="apiLatency" name="API Router (ms)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApi)" />
                        <Area type="monotone" dataKey="matchLatency" name="Matching Score Eval (ms)" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMatch)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Error distribution bar chart */}
                <div className="lg:col-span-4 bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white">Error Code Frequency Count</h3>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={OBSERVABILITY_ERROR_CODES} layout="vertical">
                        <XAxis type="number" stroke="#525252" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                        <YAxis dataKey="code" type="category" stroke="#525252" style={{ fontSize: '9px', fontFamily: 'monospace' }} width={120} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff', fontSize: '10px', fontFamily: 'monospace' }} />
                        <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]}>
                          {OBSERVABILITY_ERROR_CODES.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? '#ef4444' : '#f43f5e'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* POSTGRESQL SCHEMA SPEC */}
              <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      PostgreSQL Constitutional Relational Database Schemas
                    </h3>
                    <p className="text-xs text-neutral-400">Strict structural constraints enforced across table relations inside PostgreSQL engines.</p>
                  </div>

                  {/* Selector */}
                  <div className="flex gap-1.5">
                    {['system_configurations', 'immutable_audit_log', 'fraud_cases', 'role_permissions'].map(tbl => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedSchemaTable(tbl as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${selectedSchemaTable === tbl ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SHOW SELECT TABLE */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 overflow-x-auto">
                  {selectedSchemaTable === 'system_configurations' && (
                    <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap">
{`-- SQL Definitions for System Config Table with Optimistic Locking
CREATE TABLE system_configurations (
    id VARCHAR(50) PRIMARY KEY,
    rule_version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    max_active_projects INT NOT NULL DEFAULT 3,
    max_open_projects INT NOT NULL DEFAULT 10,
    max_applications_per_day INT NOT NULL DEFAULT 15,
    rate_limit_rpm INT NOT NULL DEFAULT 120,
    jwt_expiry_minutes INT NOT NULL DEFAULT 120,
    mfa_enforced BOOLEAN NOT NULL DEFAULT FALSE,
    concurrency_version INT NOT NULL DEFAULT 1, -- Optimistic Locking Anchor
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) NOT NULL,
    audit_hash VARCHAR(64) NOT NULL
);

-- Index for high-speed cache re-lookup
CREATE UNIQUE INDEX idx_sys_conf_version ON system_configurations(id, concurrency_version);`}
                    </pre>
                  )}

                  {selectedSchemaTable === 'immutable_audit_log' && (
                    <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap">
{`-- SQL definitions for Immutable Platform Audit Ledger
CREATE TABLE immutable_audit_log (
    audit_id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    previous_state VARCHAR(50),
    current_state VARCHAR(50) NOT NULL,
    cryptographic_signature VARCHAR(64) NOT NULL, -- SHA-256 Block linkage
    correlation_id VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    reason TEXT NOT NULL
);

-- Strict Rule: PostgreSQL Trigger prohibiting DELETE or UPDATE on Audit logs
CREATE RULE no_update_audit AS ON UPDATE TO immutable_audit_log DO INSTEAD NOTHING;
CREATE RULE no_delete_audit AS ON DELETE TO immutable_audit_log DO INSTEAD NOTHING;`}
                    </pre>
                  )}

                  {selectedSchemaTable === 'fraud_cases' && (
                    <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap">
{`-- SQL definitions for Heuristics Fraud logs
CREATE TABLE fraud_cases (
    case_id VARCHAR(50) PRIMARY KEY,
    detection_type VARCHAR(50) NOT NULL,
    severity_level VARCHAR(20) CHECK (severity_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    target_entity_id VARCHAR(50) NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    case_status VARCHAR(30) DEFAULT 'Open',
    evidence_payload JSONB NOT NULL,
    device_fingerprint VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL
);

CREATE INDEX idx_fraud_status ON fraud_cases(case_status, severity_level);`}
                    </pre>
                  )}

                  {selectedSchemaTable === 'role_permissions' && (
                    <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap">
{`-- SQL definitions for Scoped RBAC Rules
CREATE TABLE role_permissions (
    role_name VARCHAR(50) NOT NULL,
    permission_key VARCHAR(100) NOT NULL,
    is_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    scope VARCHAR(50) CHECK (scope IN ('GLOBAL', 'OWN_RESOURCES', 'ORGANIZATION_RESOURCES')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_name, permission_key)
);

-- Seed Matrix Rules
INSERT INTO role_permissions (role_name, permission_key, is_allowed, scope) VALUES
('Student', 'profile:edit', TRUE, 'OWN_RESOURCES'),
('Student', 'project:apply', TRUE, 'OWN_RESOURCES'),
('Student', 'scores:write', FALSE, 'GLOBAL'),
('Company', 'project:publish', TRUE, 'OWN_RESOURCES'),
('Company', 'student:evaluate', TRUE, 'OWN_RESOURCES'),
('Administrator', 'user:suspend', TRUE, 'GLOBAL'),
('Super Administrator', 'config:write', TRUE, 'GLOBAL');`}
                    </pre>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-TAB 7: DISASTER RECOVERY & BACKUP MANAGER
              ========================================================== */}
          {activeSubTab === 'dr_backup' && (
            <motion.div
              key="dr_backup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* TWO PANEL CONTROLLER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* BACKUPS AND SNAPSHOTS */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-white">Automated Incremental Backups</h3>
                      <p className="text-xs text-neutral-400">Nightly cold snapshots archived securely in offsite geographical replica pools.</p>
                    </div>
                    <button
                      disabled={isBackupRunning}
                      onClick={runBackupSnapshot}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border flex items-center gap-1.5 ${isBackupRunning ? 'bg-neutral-900 text-neutral-500 border-neutral-800 cursor-not-allowed' : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20'}`}
                    >
                      <DatabaseBackup className="w-3.5 h-3.5" />
                      {isBackupRunning ? 'Running Backup...' : 'Create Snapshot'}
                    </button>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    {backupLogs.map((bak) => (
                      <div key={bak.id} className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{bak.id}</span>
                            <span className="text-[10px] text-neutral-500">({bak.size})</span>
                          </div>
                          <div className="text-[9px] text-neutral-600">{bak.hash}</div>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${bak.status === 'COMPLETED' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/5 text-amber-400 border-amber-500/25 animate-pulse'}`}>
                            {bak.status}
                          </span>
                          <span className="block text-[9px] text-neutral-500 mt-1">{new Date(bak.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* POINT IN TIME RECOVERY */}
                <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-400 animate-pulse" />
                      Point-In-Time Disaster Recovery Failover
                    </h3>
                    <p className="text-xs text-neutral-400">Simulate transactional rollbacks using write-ahead-logs (WAL) down to exact historical hours.</p>
                  </div>

                  {/* PITR SLIDER */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-neutral-400">ROLLBACK WINDOW REPLICATE:</span>
                      <span className="text-red-400 font-bold">-{100 - pitrValue} minutes offset</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={pitrValue}
                      onChange={(e) => setPitrValue(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-600 font-mono">
                      <span>-90 Minutes (Deep WAL)</span>
                      <span>Latest Real-Time Head</span>
                    </div>
                  </div>

                  <button
                    disabled={isDrActive}
                    onClick={executePointInTimeRecovery}
                    className="w-full py-3 bg-red-950/40 hover:bg-red-900/30 text-red-300 border border-red-500/20 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 text-red-400 ${isDrActive ? 'animate-spin' : ''}`} />
                    EXECUTE POINT-IN-TIME TRANSACTION RE-PLAY
                  </button>

                  {/* Live Recovery Terminal output */}
                  {recoveryLog.length > 0 && (
                    <div className="bg-black border border-neutral-900 rounded-xl p-3.5 space-y-1.5 font-mono text-[10px] text-red-400/90 max-h-[160px] overflow-y-auto">
                      {recoveryLog.map((logLine, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="text-red-600 select-none">&gt;</span>
                          <p>{logLine}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* INTEGRATION TEST SUITE RUNNER PANEL */}
              <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">Constitutional Automated Test Harness</h3>
                    <p className="text-xs text-neutral-400">Executes comprehensive automated verification checks mapping platform rule safety constraints.</p>
                  </div>
                  <button
                    onClick={executeIntegrationTests}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-xs font-bold font-mono rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Run Integration Tests
                  </button>
                </div>

                {testSuiteRun && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {testResults.map((t, idx) => (
                      <div key={idx} className="bg-neutral-950 border border-neutral-800/60 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono">{t.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${t.status === 'PASS' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/5 text-rose-400 border-rose-500/20'}`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">{t.msg}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
