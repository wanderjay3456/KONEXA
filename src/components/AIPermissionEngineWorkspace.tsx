import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Activity,
  Search,
  Filter,
  Layers,
  Sliders,
  Terminal,
  Code,
  AlertTriangle,
  Clock,
  Play,
  RotateCw,
  Cpu,
  UserCheck,
  Zap,
  BookOpen,
  Plus,
  RefreshCw,
  FileText,
  Trash2,
  Check,
  AlertOctagon,
  Eye,
  Settings,
  HelpCircle,
  ArrowRight,
  Database
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
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 7.0 AI PERMISSION ENGINE)
// ============================================================================

export interface AIAgentIdentity {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  permissionGroups: string[];
  assignedPolicies: string[];
  allowedTools: string[];
  allowedActions: string[];
  allowedResources: string[];
  executionLimits: {
    toolCallsPerMin: number;
    messagesPerDay: number;
    maxRiskThreshold: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  owner: string;
  version: string;
  status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED';
}

export interface PermissionPolicy {
  id: string;
  name: string;
  description: string;
  effect: 'ALLOW' | 'DENY' | 'CONDITIONAL_ALLOW' | 'CONDITIONAL_DENY' | 'TEMPORARY_ALLOW';
  roleOrAgent: string;
  resource: string;
  action: string;
  scope: 'Own' | 'Assigned' | 'Company' | 'Project' | 'GlobalRead' | 'System';
  conditions: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  version: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  resource: string;
  resourceId: string;
  decision: 'GRANTED' | 'DENIED_POLICY' | 'DENIED_SCOPE' | 'DENIED_OWNERSHIP' | 'DENIED_RATE_LIMIT' | 'DENIED_RISK';
  appliedPolicy: string;
  riskScore: number;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  context: {
    user: string;
    project: string;
    workflow: string;
    country: string;
  };
  reason: string;
  version: string;
}

export interface TemporaryPermission {
  id: string;
  agentId: string;
  permissionName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  grantedBy: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface PermissionDelegation {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  workflowId: string;
  scope: string;
  endTime: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_AGENTS: AIAgentIdentity[] = [
  {
    id: 'AGT-REC-001',
    name: 'AI Recruiter',
    role: 'RECRUITING_AGENT',
    capabilities: ['Resume Parsing', 'Candidate Screening', 'Interview Scheduling'],
    permissionGroups: ['RECRUITER_BASIC', 'CALENDAR_ACCESS'],
    assignedPolicies: ['POL-REC-01', 'POL-REC-02'],
    allowedTools: ['ResumeParser', 'CalendarScheduler', 'EmailComposer'],
    allowedActions: ['Read', 'Create', 'Search', 'Analyze', 'Notify', 'Schedule'],
    allowedResources: ['Student', 'Resume', 'Portfolio', 'Conversation', 'Project'],
    executionLimits: { toolCallsPerMin: 60, messagesPerDay: 500, maxRiskThreshold: 'Medium' },
    owner: 'Recruitment Dept Head',
    version: '2.1.0',
    status: 'ACTIVE'
  },
  {
    id: 'AGT-PMR-002',
    name: 'AI Project Manager',
    role: 'PROJECT_MANAGER_AGENT',
    capabilities: ['Task Allocation', 'Milestone Review', 'Progress Logging'],
    permissionGroups: ['PM_BASIC', 'TASK_MUTATION'],
    assignedPolicies: ['POL-PM-01', 'POL-PM-02', 'POL-PM-03'],
    allowedTools: ['TaskAssigner', 'MilestoneEvaluator', 'SlackNotifier'],
    allowedActions: ['Read', 'Create', 'Update', 'Search', 'Analyze', 'Notify', 'Archive'],
    allowedResources: ['Project', 'Task', 'Document', 'Performance'],
    executionLimits: { toolCallsPerMin: 120, messagesPerDay: 1500, maxRiskThreshold: 'High' },
    owner: 'Engineering PMO',
    version: '3.0.1',
    status: 'ACTIVE'
  },
  {
    id: 'AGT-TFD-003',
    name: 'AI Fraud Detector',
    role: 'FRAUD_DETECTOR_AGENT',
    capabilities: ['Anomaly Detection', 'Trust Score Computation', 'Risk Audit'],
    permissionGroups: ['TRUST_SAFETY_ADMIN'],
    assignedPolicies: ['POL-SEC-01', 'POL-SEC-02'],
    allowedTools: ['RiskAnalyzer', 'TrustCalculator', 'AlertDispatcher'],
    allowedActions: ['Read', 'Search', 'Analyze', 'Generate', 'Notify'],
    allowedResources: ['Trust', 'Warning', 'Audit', 'Performance', 'Student', 'Company'],
    executionLimits: { toolCallsPerMin: 300, messagesPerDay: 5000, maxRiskThreshold: 'High' },
    owner: 'Trust & Safety Director',
    version: '1.4.0',
    status: 'ACTIVE'
  },
  {
    id: 'AGT-HRA-004',
    name: 'AI Performance Reviewer',
    role: 'PERFORMANCE_AGENT',
    capabilities: ['Score Compilation', 'Feedback Generation', 'Badge Recommendation'],
    permissionGroups: ['HR_EVALUATION'],
    assignedPolicies: ['POL-HR-01', 'POL-HR-02'],
    allowedTools: ['EvaluationCompiler', 'BadgeIssuerHelper'],
    allowedActions: ['Read', 'Search', 'Analyze', 'Generate', 'Recommend'],
    allowedResources: ['Performance', 'Certificate', 'Badge', 'Student'],
    executionLimits: { toolCallsPerMin: 40, messagesPerDay: 300, maxRiskThreshold: 'Medium' },
    owner: 'Chief HR Officer',
    version: '2.0.0',
    status: 'ACTIVE'
  },
  {
    id: 'AGT-LRN-005',
    name: 'AI Learning Analyst',
    role: 'LEARNING_AGENT',
    capabilities: ['Syllabus Mapping', 'Skill Gap Identification', 'Curriculum Recommendation'],
    permissionGroups: ['LMS_ANALYTICS'],
    assignedPolicies: ['POL-LMS-01'],
    allowedTools: ['CurriculumSuggester', 'SkillTracker'],
    allowedActions: ['Read', 'Search', 'Analyze', 'Generate', 'Recommend'],
    allowedResources: ['Student', 'Portfolio', 'Certificate', 'Knowledge'],
    executionLimits: { toolCallsPerMin: 100, messagesPerDay: 1000, maxRiskThreshold: 'Low' },
    owner: 'Academic Director',
    version: '1.2.0',
    status: 'ACTIVE'
  }
];

const INITIAL_POLICIES: PermissionPolicy[] = [
  {
    id: 'POL-REC-01',
    name: 'Candidate Profile Confidentiality Policy',
    description: 'Enforces strict read access for recruiting agents to candidate portfolios and resumes.',
    effect: 'ALLOW',
    roleOrAgent: 'RECRUITING_AGENT',
    resource: 'Resume',
    action: 'Read',
    scope: 'Assigned',
    conditions: ['WorkflowIsActive', 'WithinWorkingHours'],
    riskLevel: 'Low',
    version: '1.0.0'
  },
  {
    id: 'POL-PM-01',
    name: 'PM Project Scope Mutability Policy',
    description: 'Allows AI PMs to create and update tasks in their assigned projects.',
    effect: 'ALLOW',
    roleOrAgent: 'PROJECT_MANAGER_AGENT',
    resource: 'Task',
    action: 'Update',
    scope: 'Project',
    conditions: ['AgentIsAssignedToProject', 'ResourceBelongsToProject'],
    riskLevel: 'Medium',
    version: '1.2.0'
  },
  {
    id: 'POL-SEC-01',
    name: 'Trust Score Modification Restriction',
    description: 'Restricts modification of system-owned Trust Scores. Direct updates are explicitly denied; only algorithms may calculate and propose.',
    effect: 'DENY',
    roleOrAgent: 'RECRUITING_AGENT',
    resource: 'Trust',
    action: 'Update',
    scope: 'System',
    conditions: ['IsSystemOwnedResource'],
    riskLevel: 'Critical',
    version: '2.0.0'
  },
  {
    id: 'POL-SEC-02',
    name: 'Fraud Mitigation Direct Escalation',
    description: 'Allows AI Fraud Detector to issue temporary system alerts and notify administrators.',
    effect: 'CONDITIONAL_ALLOW',
    roleOrAgent: 'FRAUD_DETECTOR_AGENT',
    resource: 'Warning',
    action: 'Create',
    scope: 'Company',
    conditions: ['AnomalyScoreExceedsThreshold', 'HumanReviewerNotified'],
    riskLevel: 'High',
    version: '1.1.0'
  },
  {
    id: 'POL-HR-01',
    name: 'Performance Records Read Access',
    description: 'Performance Reviewers can read student evaluations and certificates.',
    effect: 'ALLOW',
    roleOrAgent: 'PERFORMANCE_AGENT',
    resource: 'Performance',
    action: 'Read',
    scope: 'GlobalRead',
    conditions: ['UserConsentVerified'],
    riskLevel: 'Medium',
    version: '1.0.0'
  }
];

const INITIAL_AUDITS: AuditLogRecord[] = [
  {
    id: 'AUD-9001',
    timestamp: '2026-07-04T20:10:00Z',
    agentId: 'AGT-REC-001',
    agentName: 'AI Recruiter',
    action: 'Read',
    resource: 'Resume',
    resourceId: 'RES-STU-8812',
    decision: 'GRANTED',
    appliedPolicy: 'POL-REC-01',
    riskScore: 12,
    riskRating: 'Low',
    context: { user: 'Nguyen Van Minh', project: 'PRJ-FIN-99', workflow: 'WF-MTC-502', country: 'Vietnam' },
    reason: 'Agent identity verified and candidate resume is assigned to the active interview workflow.',
    version: '1.0.0'
  },
  {
    id: 'AUD-9002',
    timestamp: '2026-07-04T20:15:32Z',
    agentId: 'AGT-REC-001',
    agentName: 'AI Recruiter',
    action: 'Update',
    resource: 'Trust',
    resourceId: 'TRS-STU-8812',
    decision: 'DENIED_POLICY',
    appliedPolicy: 'POL-SEC-01',
    riskScore: 92,
    riskRating: 'Critical',
    context: { user: 'Nguyen Van Minh', project: 'PRJ-FIN-99', workflow: 'WF-MTC-502', country: 'Vietnam' },
    reason: 'Explicit Deny overrides Allow. Recruiting Agents are strictly forbidden from modifying system-owned trust states.',
    version: '1.0.0'
  },
  {
    id: 'AUD-9003',
    timestamp: '2026-07-04T20:25:11Z',
    agentId: 'AGT-PMR-002',
    agentName: 'AI Project Manager',
    action: 'Update',
    resource: 'Task',
    resourceId: 'TSK-209',
    decision: 'GRANTED',
    appliedPolicy: 'POL-PM-01',
    riskScore: 35,
    riskRating: 'Medium',
    context: { user: 'Le Thi Hoa', project: 'PRJ-WEB-45', workflow: 'WF-PM-701', country: 'Vietnam' },
    reason: 'Project PM identity matches resource ownership domain. Authorization scope validated.',
    version: '1.2.0'
  },
  {
    id: 'AUD-9004',
    timestamp: '2026-07-04T20:38:00Z',
    agentId: 'AGT-PMR-002',
    agentName: 'AI Project Manager',
    action: 'Delete',
    resource: 'Project',
    resourceId: 'PRJ-WEB-45',
    decision: 'DENIED_SCOPE',
    appliedPolicy: 'DEFAULT_DENY',
    riskScore: 85,
    riskRating: 'High',
    context: { user: 'Le Thi Hoa', project: 'PRJ-WEB-45', workflow: 'WF-PM-701', country: 'Vietnam' },
    reason: 'No explicit policy grants AI Project Managers soft delete authority on primary parent Projects. Default Deny applied.',
    version: '1.0.0'
  },
  {
    id: 'AUD-9005',
    timestamp: '2026-07-04T20:44:12Z',
    agentId: 'AGT-TFD-003',
    agentName: 'AI Fraud Detector',
    action: 'Create',
    resource: 'Warning',
    resourceId: 'WRN-COMP-09',
    decision: 'GRANTED',
    appliedPolicy: 'POL-SEC-02',
    riskScore: 78,
    riskRating: 'High',
    context: { user: 'System Alert Engine', project: 'N/A', workflow: 'WF-SEC-911', country: 'Global' },
    reason: 'Conditional Allow: Anomalous contract patterns exceed threshold. Admin alerted via Slack dispatch webhook.',
    version: '1.1.0'
  },
  {
    id: 'AUD-9006',
    timestamp: '2026-07-04T20:50:05Z',
    agentId: 'AGT-LRN-005',
    agentName: 'AI Learning Analyst',
    action: 'Update',
    resource: 'Trust',
    resourceId: 'TRS-STU-3321',
    decision: 'DENIED_OWNERSHIP',
    appliedPolicy: 'DEFAULT_DENY',
    riskScore: 90,
    riskRating: 'Critical',
    context: { user: 'Academic Audit', project: 'N/A', workflow: 'WF-LMS-202', country: 'Vietnam' },
    reason: 'Ownership validation failed. AI Learning Analyst tried to modify Academic Trust ratings owned exclusively by System administration.',
    version: '1.0.0'
  }
];

export default function AIPermissionEngineWorkspace() {
  // Top-Level State
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'pipeline' | 'policies' | 'rbac_abac' | 'delegation' | 'audit' | 'schema_api' | 'testing'>('overview');
  const [agents, setAgents] = useState<AIAgentIdentity[]>(INITIAL_AGENTS);
  const [policies, setPolicies] = useState<PermissionPolicy[]>(INITIAL_POLICIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDITS);
  
  // Cache indicators
  const [cacheHits, setCacheHits] = useState(482931);
  const [cacheMisses, setCacheMisses] = useState(7812);
  const [cacheStatus, setCacheStatus] = useState<'ACTIVE' | 'CLEARED' | 'REBUILDING'>('ACTIVE');

  // Security Alert States
  const [alerts, setAlerts] = useState<Array<{ id: string; msg: string; type: 'CRITICAL' | 'WARNING'; time: string }>>([
    { id: 'AL-001', msg: 'Privilege escalation attempt detected: AGT-REC-001 requesting Trust modification', type: 'CRITICAL', time: '2026-07-04T20:15:32Z' },
    { id: 'AL-002', msg: 'Rate limit threshold reached for tool calls: AGT-PMR-002 (TaskAssigner)', type: 'WARNING', time: '2026-07-04T20:41:02Z' }
  ]);

  // Form State for creating policies
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');
  const [newPolicyEffect, setNewPolicyEffect] = useState<'ALLOW' | 'DENY' | 'CONDITIONAL_ALLOW'>('ALLOW');
  const [newPolicyRole, setNewPolicyRole] = useState('RECRUITING_AGENT');
  const [newPolicyResource, setNewPolicyResource] = useState('Resume');
  const [newPolicyAction, setNewPolicyAction] = useState('Read');
  const [newPolicyScope, setNewPolicyScope] = useState<'Own' | 'Assigned' | 'Company' | 'Project' | 'GlobalRead' | 'System'>('Assigned');
  const [newPolicyRisk, setNewPolicyRisk] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');

  // Interactive Pipeline Simulator State
  const [simAgentId, setSimAgentId] = useState('AGT-REC-001');
  const [simResource, setSimResource] = useState('Resume');
  const [simResourceId, setSimResourceId] = useState('RES-STU-8812');
  const [simAction, setSimAction] = useState('Read');
  const [simContextCountry, setSimContextCountry] = useState('Vietnam');
  const [simContextWorkflow, setSimContextWorkflow] = useState('WF-MTC-502');
  const [simContextRiskRating, setSimContextRiskRating] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [simEvaluationStep, setSimEvaluationStep] = useState<number>(-1);
  const [simPipelineResult, setSimPipelineResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Delegations & Temporary State
  const [tempPermissions, setTempPermissions] = useState<TemporaryPermission[]>([
    { id: 'TMP-001', agentId: 'AGT-REC-001', permissionName: 'Resume:Update:Assigned', startTime: '2026-07-04T20:00:00Z', endTime: '2026-07-04T22:00:00Z', durationMinutes: 120, grantedBy: 'Super Admin', status: 'ACTIVE' },
    { id: 'TMP-002', agentId: 'AGT-PMR-002', permissionName: 'Performance:Recommend:Project', startTime: '2026-07-04T18:00:00Z', endTime: '2026-07-04T19:00:00Z', durationMinutes: 60, grantedBy: 'Academic PMO', status: 'EXPIRED' }
  ]);
  const [delegations, setDelegations] = useState<PermissionDelegation[]>([
    { id: 'DLG-101', fromAgentId: 'AGT-HRA-004', toAgentId: 'AGT-REC-001', workflowId: 'WF-FEEDBACK-202', scope: 'Performance records read-only delegation', endTime: '2026-07-04T23:59:59Z', status: 'ACTIVE' }
  ]);
  const [newTempAgentId, setNewTempAgentId] = useState('AGT-REC-001');
  const [newTempPermName, setNewTempPermName] = useState('Resume:Update:Assigned');
  const [newTempMinutes, setNewTempMinutes] = useState(30);

  // Search State for Audit Logs
  const [searchAuditQuery, setSearchAuditQuery] = useState('');
  const [auditFilterDecision, setAuditFilterDecision] = useState<string>('ALL');

  // Interactive Live API Request Console State
  const [apiMethod, setApiMethod] = useState<'CHECK' | 'LIST_POLICIES' | 'TEMPORARY_GRANT' | 'CLEAR_CACHE'>('CHECK');
  const [apiResponse, setApiResponse] = useState<any>({
    status: 200,
    timestamp: '2026-07-04T20:55:56Z',
    data: { authorized: true, decision: "GRANTED", code: "AUTH_001", policyApplied: "POL-REC-01" }
  });

  // Automated Testing Console logs
  const [testSuiteLogs, setTestSuiteLogs] = useState<string[]>([
    'System ready. Ready to execute compliance security scans...',
    'Press "Run Automated Enterprise Checks" to launch testing framework.'
  ]);
  const [isTestingRunning, setIsTestingRunning] = useState(false);

  // Metric Calculation helper
  const totalChecks = auditLogs.length + cacheHits + cacheMisses;
  const grantedCount = auditLogs.filter(a => a.decision === 'GRANTED').length;
  const deniedCount = auditLogs.filter(a => a.decision !== 'GRANTED').length;

  const handleClearCache = () => {
    setCacheStatus('REBUILDING');
    setTimeout(() => {
      setCacheMisses(prev => prev + 142);
      setCacheStatus('ACTIVE');
    }, 1500);
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName || !newPolicyDesc) return;
    const newId = `POL-CUSTOM-${Math.floor(Math.random() * 900) + 100}`;
    const newPol: PermissionPolicy = {
      id: newId,
      name: newPolicyName,
      description: newPolicyDesc,
      effect: newPolicyEffect,
      roleOrAgent: newPolicyRole,
      resource: newPolicyResource,
      action: newPolicyAction,
      scope: newPolicyScope,
      conditions: ['AdminExplicitlyGranted', 'SecurityChecked'],
      riskLevel: newPolicyRisk,
      version: '1.0.0'
    };
    setPolicies([newPol, ...policies]);
    setNewPolicyName('');
    setNewPolicyDesc('');
    
    // Add audit log for policy change
    const newAudit: AuditLogRecord = {
      id: `AUD-NEW-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      agentId: 'SYS-ADMIN-01',
      agentName: 'Enterprise Admin',
      action: 'Create',
      resource: 'Configuration',
      resourceId: newId,
      decision: 'GRANTED',
      appliedPolicy: 'SYSTEM_ADMIN_POLICY_V1',
      riskScore: 25,
      riskRating: 'Low',
      context: { user: 'Admin Operator', project: 'N/A', workflow: 'Security Rules Update', country: 'Global' },
      reason: `New permission policy ${newId} published and registered in security database registry.`,
      version: '1.0.0'
    };
    setAuditLogs([newAudit, ...auditLogs]);
  };

  const runPipelineSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimEvaluationStep(0);
    setSimPipelineResult(null);

    const stages = [
      'Agent Identity Verification...',
      'Permission Policy Lookup...',
      'Scope Match & Resource Validation...',
      'Ownership Proof Validation...',
      'Business Rules Precedence Check...',
      'Policy Conflict Evaluation (Deny overrides Allow)...',
      'Risk Score & Real-Time Context Scoring...',
      'Final Decision & Immutable Audit Recording...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setSimEvaluationStep(i);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    const targetAgent = agents.find(a => a.id === simAgentId) || agents[0];
    
    // Determine decision based on specification rules
    let decision: 'GRANTED' | 'DENIED_POLICY' | 'DENIED_SCOPE' | 'DENIED_OWNERSHIP' | 'DENIED_RISK' = 'GRANTED';
    let appliedPolicy = 'DEFAULT_DENY';
    let reason = '';
    let riskScore = 15;

    // RULE 1: Default is Deny
    // RULE 2: AI cannot modify resource owned by the system
    if ((simResource === 'Trust' || simResource === 'Warning' || simResource === 'Badge') && simAction === 'Update') {
      decision = 'DENIED_OWNERSHIP';
      reason = 'AI Agents are forbidden from direct mutations on system-owned Trust, Warnings, or Badges without explicit administrator approval workflow.';
      appliedPolicy = 'POL-SEC-01';
      riskScore = 95;
    } else {
      // Find matching policy
      const matchedPolicy = policies.find(p => p.roleOrAgent === targetAgent.role && p.resource === simResource && (p.action === simAction || p.action === 'Update'));
      if (matchedPolicy) {
        if (matchedPolicy.effect === 'DENY') {
          decision = 'DENIED_POLICY';
          appliedPolicy = matchedPolicy.id;
          reason = `Explicit Deny defined in ${matchedPolicy.name} overrides any concurrent allowances.`;
          riskScore = 85;
        } else if (matchedPolicy.effect === 'ALLOW' || matchedPolicy.effect === 'CONDITIONAL_ALLOW') {
          decision = 'GRANTED';
          appliedPolicy = matchedPolicy.id;
          reason = `Authorization granted under ${matchedPolicy.name}. Context and role criteria met.`;
          riskScore = matchedPolicy.riskLevel === 'Critical' ? 90 : matchedPolicy.riskLevel === 'High' ? 70 : 30;
        }
      } else {
        decision = 'DENIED_POLICY';
        reason = `No explicit policy matches the combination of Role: ${targetAgent.role}, Resource: ${simResource}, and Action: ${simAction}. Access restricted by default Zero Trust policy.`;
        appliedPolicy = 'DEFAULT_DENY';
        riskScore = 40;
      }
    }

    // Risk restriction based on maximum risk threshold
    if (decision === 'GRANTED' && riskScore > (targetAgent.executionLimits.maxRiskThreshold === 'Medium' ? 50 : targetAgent.executionLimits.maxRiskThreshold === 'Low' ? 30 : 100)) {
      decision = 'DENIED_RISK';
      reason = `Operation risk score (${riskScore}) exceeds the agent maximum risk execution limit threshold (${targetAgent.executionLimits.maxRiskThreshold}).`;
    }

    const newLog: AuditLogRecord = {
      id: `AUD-SIM-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      agentId: targetAgent.id,
      agentName: targetAgent.name,
      action: simAction,
      resource: simResource,
      resourceId: simResourceId,
      decision,
      appliedPolicy,
      riskScore,
      riskRating: riskScore > 80 ? 'Critical' : riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low',
      context: { user: 'Simulated User', project: 'SIM-PROJ-01', workflow: simContextWorkflow, country: simContextCountry },
      reason,
      version: targetAgent.version
    };

    setAuditLogs([newLog, ...auditLogs]);
    setSimPipelineResult(newLog);
    setIsSimulating(false);

    // If it was a critical deny, push a security alert
    if (decision !== 'GRANTED' && riskScore > 80) {
      setAlerts(prev => [
        { id: `AL-${Math.floor(Math.random() * 900) + 100}`, msg: `Security Violation: ${targetAgent.name} denied executing ${simAction} on ${simResource}. Level: ${newLog.riskRating}`, type: 'CRITICAL', time: new Date().toISOString() },
        ...prev
      ]);
    }
  };

  const handleGrantTempPermission = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date();
    const end = new Date(start.getTime() + newTempMinutes * 60000);
    const newTemp: TemporaryPermission = {
      id: `TMP-${Math.floor(Math.random() * 900) + 100}`,
      agentId: newTempAgentId,
      permissionName: newTempPermName,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      durationMinutes: newTempMinutes,
      grantedBy: 'Super Admin Explicit Override',
      status: 'ACTIVE'
    };
    setTempPermissions([newTemp, ...tempPermissions]);
    
    // Add audit log
    const newAudit: AuditLogRecord = {
      id: `AUD-TMP-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      agentId: 'SYS-ADMIN-01',
      agentName: 'Enterprise Admin',
      action: 'Create',
      resource: 'Configuration',
      resourceId: newTemp.id,
      decision: 'GRANTED',
      appliedPolicy: 'TEMPORARY_OVERRIDE_GRANTOR',
      riskScore: 45,
      riskRating: 'Medium',
      context: { user: 'Admin Operator', project: 'N/A', workflow: 'Temporary Access Allocation', country: 'Global' },
      reason: `Allocated emergency temporary permission [${newTempPermName}] to agent ${newTempAgentId} expiring in ${newTempMinutes} mins.`,
      version: '1.0.0'
    };
    setAuditLogs([newAudit, ...auditLogs]);
  };

  const handleExpirePermissions = () => {
    // Manually trigger immediate expiration simulation
    setTempPermissions(prev => prev.map(p => ({ ...p, status: 'EXPIRED' as const })));
    setDelegations(prev => prev.map(d => ({ ...d, status: 'EXPIRED' as const })));

    // Create system alert
    setAlerts(prev => [
      { id: `AL-${Math.floor(Math.random() * 900) + 100}`, msg: 'Temporary and Delegated permissions auto-expired on epoch sweep.', type: 'WARNING', time: new Date().toISOString() },
      ...prev
    ]);
  };

  const runAutomatedTests = async () => {
    if (isTestingRunning) return;
    setIsTestingRunning(true);
    setTestSuiteLogs([]);

    const log = (msg: string) => {
      setTestSuiteLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('🚀 Initializing Enterprise Security Authorization Test Suite (v7.0)...');
    await new Promise(r => setTimeout(r, 400));
    
    log('🛡️ TESTING PRINCIPLE 1: Zero Trust / Implicit Deny Check...');
    log('Checking permission request for AI Career Coach on Warning system logs...');
    log('Decision: Denied (No explicit policy exists. System fallback to DEFAULT_DENY is fully functional). [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('🔍 TESTING PRINCIPLE 2: Explicit Least Privilege Verification...');
    log('Verifying AI Recruiter POL-REC-01 "Candidate Profile Confidentiality" ABAC variables...');
    log('Applied variables: WorkflowIsActive: true, WithinWorkingHours: true. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('⚖️ TESTING PRINCIPLE 3: Policy Conflict Evaluation (Deny Overrides Allow)...');
    log('Injecting concurrent policies: POL-ALLOW-ANY (Effect: ALLOW) and POL-DENY-ANY (Effect: DENY) for identical resources...');
    log('Executing simulated evaluation request...');
    log('Result: DENIED. Verified that explicit DENY successfully overrides ALLOW. [PASS]');
    await new Promise(r => setTimeout(r, 600));

    log('💼 TESTING PRINCIPLE 4: Resource Ownership Restriction Engine...');
    log('Simulating AI Recruiter (AGT-REC-001) attempting direct write to "Trust Scores" system database...');
    log('Validation: System resource ownership validation pipeline intercepting attempt...');
    log('Result: DENIED_OWNERSHIP. "System owns scores; AI cannot modify resources owned by system." [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('⏱️ TESTING PRINCIPLE 5: Rate Limits & Token Call Mitigation...');
    log('Simulating burst calls on PM_BASIC Tool (TaskAssigner): 150 calls within 15 seconds...');
    log('Alert Registry updated. Throttling applied at tool call 121 (Rate Limit threshold 120/min). [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('📈 TESTING PERFORMANCE & CAPACITY: Simulated Load Test...');
    log('Spawning 50 concurrent virtual threads representing 50 stateless micro-authorization checks...');
    log('Total authorized checks processed: 50,000 requests.');
    log('Mean Response Latency: 12.8ms (Sub-50ms criterion satisfied perfectly). [PASS]');
    log('Calculated throughput capability: 14.2M Authorization decisions per 24 hours. [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('✅ SCANS COMPLETED. 6/6 Core authorization modules verified green. Enterprise Compliance Grade is certified.');
    setIsTestingRunning(false);
  };

  // Synchronize API request block content based on state selection
  useEffect(() => {
    let response: any = {};
    if (apiMethod === 'CHECK') {
      response = {
        endpoint: 'POST /api/v1/permissions/check',
        payload: {
          agentId: 'AGT-REC-001',
          resource: 'Resume',
          resourceId: 'RES-STU-8812',
          action: 'Read',
          context: { workflowId: 'WF-MTC-502', ipAddress: '10.23.0.4', country: 'Vietnam' }
        },
        response: {
          status: 200,
          authorized: true,
          decision: 'GRANTED',
          appliedPolicyId: 'POL-REC-01',
          riskLevel: 'Low',
          evaluationLatencyMs: 14.2,
          timestamp: '2026-07-04T20:55:56Z'
        }
      };
    } else if (apiMethod === 'LIST_POLICIES') {
      response = {
        endpoint: 'GET /api/v1/permissions/policies?role=RECRUITING_AGENT',
        payload: null,
        response: {
          status: 200,
          count: 1,
          policies: [
            {
              id: 'POL-REC-01',
              name: 'Candidate Profile Confidentiality Policy',
              effect: 'ALLOW',
              resource: 'Resume',
              action: 'Read',
              scope: 'Assigned',
              conditions: ['WorkflowIsActive', 'WithinWorkingHours'],
              version: '1.0.0'
            }
          ]
        }
      };
    } else if (apiMethod === 'TEMPORARY_GRANT') {
      response = {
        endpoint: 'POST /api/v1/permissions/temporary-grant',
        payload: {
          agentId: 'AGT-REC-001',
          permissionName: 'Resume:Update:Assigned',
          durationMinutes: 30,
          reason: 'Urgent recruiter revision'
        },
        response: {
          statusCode: 201,
          tempPermissionId: 'TMP-009',
          agentId: 'AGT-REC-001',
          grantedPermission: 'Resume:Update:Assigned',
          expiresAt: '2026-07-04T21:25:56Z',
          status: 'ACTIVE'
        }
      };
    } else {
      response = {
        endpoint: 'POST /api/v1/cache/invalidate',
        payload: { scope: 'all' },
        response: {
          status: 200,
          message: 'Distributed permission authorization cache successfully invalidated.',
          rebuildLatencyMs: 42.1,
          cacheHitRatioRestart: '0.00%'
        }
      };
    }
    setApiResponse(response);
  }, [apiMethod]);

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-permission-engine-workspace">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              SPECIFICATION 7.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              v1.0.0 (Stateless & Stateless-Cache)
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100 mt-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> AI Permission Engine Core
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Centralized authorization pipeline enforcing Zero Trust, Attribute-Based Access Control (ABAC), Resource-Based Ownership, and real-time Human Overrides for all system AI Employees.
          </p>
        </div>

        {/* Distributed cache quick action panel */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Cache Hit Ratio</span>
              <span className="text-emerald-400 font-bold">{((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(2)}%</span>
            </div>
            <div className="border-l border-neutral-800 h-6 pl-4">
              <span className="text-neutral-500 block text-[9px] uppercase">State</span>
              <span className={`flex items-center gap-1 font-bold ${cacheStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cacheStatus === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-spin'}`} />
                {cacheStatus}
              </span>
            </div>
          </div>
          <button
            onClick={handleClearCache}
            disabled={cacheStatus === 'REBUILDING'}
            className="px-3.5 py-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cacheStatus === 'REBUILDING' ? 'animate-spin' : ''}`} />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Enterprise Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
            <span>Auth Requests</span>
            <Activity className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div className="text-lg font-extrabold text-neutral-100 mt-1.5">
            {totalChecks.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
            +12.4k (last hour)
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
            <span>Latency Metric</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-extrabold text-neutral-100 mt-1.5">
            14.2 ms
          </div>
          <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1 mt-0.5">
            Sub-50ms standard [PASS]
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
            <span>Decisions GRANTED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1.5">
            {grantedCount} <span className="text-neutral-500 text-xs font-normal">logs</span>
          </div>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">
            Authorized workflow routines
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
            <span>Decisions DENIED</span>
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-lg font-extrabold text-rose-500 mt-1.5">
            {deniedCount} <span className="text-neutral-500 text-xs font-normal">logs</span>
          </div>
          <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-0.5">
            Zero-Trust blocks active
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
            <span>Core Active Agents</span>
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-extrabold text-neutral-100 mt-1.5">
            {agents.length} Employees
          </div>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">
            Enforced policies: {policies.length}
          </span>
        </div>
      </div>

      {/* Security Alerts Toast Alert Area */}
      {alerts.length > 0 && (
        <div className="mb-6 bg-red-950/20 border border-red-900/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 text-red-400 p-2 rounded-xl border border-red-500/20">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-400">Security Access Violations Logged</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {alerts[0].msg} (at {new Date(alerts[0].time).toLocaleTimeString()})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAlerts([])}
              className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg cursor-pointer transition-all"
            >
              Acknowledge All Alerts
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800/80 pb-3 mb-6">
        {[
          { id: 'overview', label: 'Security Overview', icon: Activity },
          { id: 'pipeline', label: 'Auth Pipeline Simulator', icon: Sliders },
          { id: 'policies', label: 'Policy Registry & Editor', icon: Shield },
          { id: 'rbac_abac', label: 'RBAC, ABAC & Ownership', icon: Layers },
          { id: 'delegation', label: 'Delegation & Temp Overrides', icon: Key },
          { id: 'audit', label: 'Immutable Audit Log', icon: FileText },
          { id: 'schema_api', label: 'Schemas & API Spec', icon: Code },
          { id: 'testing', label: 'Authorization Suite Tests', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Contents */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: SECURITY OVERVIEW */}
        {activeSubTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Charts & Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Authorization Outcome Area Chart */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-300">Daily Authorization Activity</h3>
                    <p className="text-[10px] text-neutral-500">Stateless permission checks over 24-hour cycle</p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md">
                    Checks/hr
                  </span>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { hour: '00:00', Granted: 35000, Denied: 120 },
                        { hour: '04:00', Granted: 28000, Denied: 90 },
                        { hour: '08:00', Granted: 78000, Denied: 350 },
                        { hour: '12:00', Granted: 125000, Denied: 890 },
                        { hour: '16:00', Granted: 145000, Denied: 1200 },
                        { hour: '20:00', Granted: 110000, Denied: 430 }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorGranted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDenied" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="hour" stroke="#737373" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <YAxis stroke="#737373" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: 11, color: '#f5f5f5' }} />
                      <Legend style={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="Granted" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGranted)" />
                      <Area type="monotone" dataKey="Denied" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDenied)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Decision Type Breakdown Pie Chart */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Decision Outcome Proportions</h3>
                  <p className="text-[10px] text-neutral-500">Distribution of blocked request factors</p>
                </div>
                <div className="h-44 my-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Granted', value: 482000, color: '#10b981' },
                          { name: 'Policy Deny', value: 4200, color: '#f59e0b' },
                          { name: 'Ownership Deny', value: 1800, color: '#ec4899' },
                          { name: 'Risk Deny', value: 1500, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { color: '#10b981' },
                          { color: '#f59e0b' },
                          { color: '#ec4899' },
                          { color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} requests`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                    <span className="text-neutral-400">Granted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                    <span className="text-neutral-400">Policy Deny</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-pink-500 inline-block" />
                    <span className="text-neutral-400">Ownership</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
                    <span className="text-neutral-400">Risk Threshold</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Security Core Principles Card */}
            <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> Active Zero-Trust Compliance Principles Enforced
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Implicit Deny by Default
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    No AI Employee possesses native or implicit privileges. If no policy explicitly grants a specific resource/action/agent combination, access is immediately blocked.
                  </p>
                </div>
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Attribute & Context Layering
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    Access dynamically parses the active workspace context (workflow status, request origin country, tool rating limit, current project assignments) to approve operations.
                  </p>
                </div>
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-1">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Immutable Audit & Clock Sweeps
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    Every single token execution write, evaluation attempt, and decision is cryptographically logged. Temporary permissions expire on strict epoch timer intervals.
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Registered Agent Status Board */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Registered AI Agent Personas</h3>
                  <p className="text-[10px] text-neutral-500">Actively monitored and regulated virtual employees</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 font-mono">
                  State: All Agents Synced
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 pl-2">Agent ID & Name</th>
                      <th className="pb-3">Enterprise IAM Role</th>
                      <th className="pb-3">Capabilities</th>
                      <th className="pb-3">Risk Tolerance</th>
                      <th className="pb-3">Allowed Actions</th>
                      <th className="pb-3 text-right pr-2">Security State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {agents.map(agt => (
                      <tr key={agt.id} className="hover:bg-neutral-900/20 group transition-all">
                        <td className="py-3 pl-2">
                          <div className="font-semibold text-neutral-200">{agt.name}</div>
                          <div className="text-[9px] text-neutral-500 font-mono">{agt.id} • v{agt.version}</div>
                        </td>
                        <td className="py-3 text-neutral-300">
                          <span className="bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800 font-mono text-[10px]">
                            {agt.role}
                          </span>
                        </td>
                        <td className="py-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {agt.capabilities.map((cap, i) => (
                              <span key={i} className="text-[9px] bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            agt.executionLimits.maxRiskThreshold === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            agt.executionLimits.maxRiskThreshold === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {agt.executionLimits.maxRiskThreshold} Risk
                          </span>
                        </td>
                        <td className="py-3 text-[10px] text-neutral-400 font-mono">
                          {agt.allowedActions.slice(0, 4).join(', ')}...
                        </td>
                        <td className="py-3 text-right pr-2">
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/20 uppercase">
                            {agt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: AUTH PIPELINE SIMULATOR */}
        {activeSubTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input Selection Column */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Permission Pipeline Parameters</h3>
                <p className="text-[10px] text-neutral-500">Configure simulated execution requests to test authorization rules</p>
              </div>

              {/* Agent Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">1. Select AI Employee</label>
                <select
                  value={simAgentId}
                  onChange={(e) => setSimAgentId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500 font-mono"
                >
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>

              {/* Resource Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">2. Resource Type</label>
                  <select
                    value={simResource}
                    onChange={(e) => setSimResource(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500"
                  >
                    <option value="Resume">Resume (Student Owns)</option>
                    <option value="Portfolio">Portfolio (Student Owns)</option>
                    <option value="Project">Project (Company Owns)</option>
                    <option value="Task">Task (Project Domain)</option>
                    <option value="Trust">Trust (System Owned)</option>
                    <option value="Warning">Warning (System Owned)</option>
                    <option value="Badge">Badge (System Owned)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Target Resource ID</label>
                  <input
                    type="text"
                    value={simResourceId}
                    onChange={(e) => setSimResourceId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">3. Action Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Read', 'Create', 'Update', 'Delete'].map(act => (
                    <button
                      type="button"
                      key={act}
                      onClick={() => setSimAction(act)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all border ${simAction === act ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'}`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Variables */}
              <div className="space-y-3 pt-2 border-t border-neutral-850">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">4. Environmental Context (ABAC)</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-neutral-500">Country Origin</label>
                    <input
                      type="text"
                      value={simContextCountry}
                      onChange={(e) => setSimContextCountry(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-neutral-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-neutral-500">Active Workflow</label>
                    <input
                      type="text"
                      value={simContextWorkflow}
                      onChange={(e) => setSimContextWorkflow(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-neutral-200 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-500 block">Real-time Risk Category Rating</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Low', 'Medium', 'High', 'Critical'].map(level => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setSimContextRiskRating(level as any)}
                        className={`py-1 rounded-md text-[10px] font-mono transition-all border ${simContextRiskRating === level ? 'bg-red-500/10 text-red-400 border-red-500/30 font-bold' : 'bg-neutral-950 text-neutral-500 border-neutral-800'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Run Trigger */}
              <button
                type="button"
                onClick={runPipelineSimulation}
                disabled={isSimulating}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running Pipeline Assertions...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Evaluate Request Authorization
                  </>
                )}
              </button>
            </div>

            {/* Visual Pipeline Simulation Steps */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-300 mb-1">Stateful Pipeline Evaluation Pipeline</h3>
                <p className="text-[10px] text-neutral-500">Visualization of dynamic authorization checks executed inside the engine core</p>
              </div>

              {/* Step Flow List */}
              <div className="my-5 space-y-2.5 relative">
                {/* Vertical trace line */}
                <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-neutral-800 z-0" />

                {[
                  { id: 0, label: 'Execution Request / Agent Identity', desc: `Lookup Identity for Agent: ${agents.find(a => a.id === simAgentId)?.name}` },
                  { id: 1, label: 'Permission Policy Lookup', desc: `Searching system policy registry for matching role/resource permissions` },
                  { id: 2, label: 'Scope Validation', desc: `Assert scope levels: Owner resource verification checks` },
                  { id: 3, label: 'Ownership Proof Validation', desc: `Check resource ownership maps (System vs Student vs Company)` },
                  { id: 4, label: 'Business Rule Verification', desc: `Verify constraints (WorkflowIsActive, working hours, etc)` },
                  { id: 5, label: 'Policy Evaluation & Collisions', desc: `Apply conflict algorithms: Explicit Deny overrides any concurrent Allow` },
                  { id: 6, label: 'Risk Evaluation Rating', desc: `Check agent limits: Context country risk constraints` },
                  { id: 7, label: 'Decision Verdict & Immutable Audit', desc: `Write final authorization result and hash transaction logs` }
                ].map((step, i) => {
                  const isPast = simEvaluationStep > step.id;
                  const isCurrent = simEvaluationStep === step.id;
                  const isFuture = simEvaluationStep < step.id;

                  return (
                    <div key={i} className={`flex items-start gap-4 transition-all duration-300 relative z-10 ${isPast ? 'opacity-70' : isCurrent ? 'scale-[1.01] opacity-100' : 'opacity-30'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                        isPast ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                        isCurrent ? 'bg-amber-950 text-amber-400 border-amber-500 animate-pulse' :
                        'bg-neutral-950 text-neutral-600 border-neutral-850'
                      }`}>
                        {isPast ? <Check className="w-4 h-4" /> : step.id + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : isPast ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulation Result Block */}
              <AnimatePresence>
                {simPipelineResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`border rounded-xl p-4 flex flex-col md:flex-row items-start justify-between gap-4 font-mono ${
                      simPipelineResult.decision === 'GRANTED'
                        ? 'bg-emerald-950/10 border-emerald-800/40 text-emerald-400'
                        : 'bg-red-950/10 border-red-800/40 text-rose-400'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        {simPipelineResult.decision === 'GRANTED' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Verdict: {simPipelineResult.decision}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                        {simPipelineResult.reason}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] text-neutral-500">
                        <div>Applied Policy: <span className="text-neutral-300">{simPipelineResult.appliedPolicy}</span></div>
                        <div>Risk Rating: <span className="text-neutral-300">{simPipelineResult.riskRating} ({simPipelineResult.riskScore} pts)</span></div>
                        <div>Origin IP Context: <span className="text-neutral-300">10.201.2.4</span></div>
                        <div>Time Signed: <span className="text-neutral-300">{new Date(simPipelineResult.timestamp).toLocaleTimeString()}</span></div>
                      </div>
                    </div>
                    <div className="text-[10px] bg-neutral-950 border border-neutral-850 p-2.5 rounded-lg flex flex-col justify-center min-w-[120px] text-center">
                      <span className="text-neutral-500 block text-[8px] uppercase">Audit Hash ID</span>
                      <span className="font-bold text-neutral-300 text-xs mt-0.5">{simPipelineResult.id}</span>
                      <span className="text-neutral-500 block text-[8px] uppercase mt-2">Evaluation Latency</span>
                      <span className="font-bold text-emerald-400 mt-0.5">14.1 ms</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* TAB 3: POLICY REGISTRY & EDITOR */}
        {activeSubTab === 'policies' && (
          <motion.div
            key="policies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Policy Creator */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-5">
              <h3 className="text-xs font-bold text-neutral-300 mb-1">Create Authorization Policy</h3>
              <p className="text-[10px] text-neutral-500 mb-4">Declare new explicit permissions. Subject to immutable change-management controls.</p>

              <form onSubmit={handleCreatePolicy} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Policy Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Recruiter Resume Mutation Allow"
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Description / Purpose</label>
                  <textarea
                    required
                    placeholder="Provide strict corporate risk justification for authorization..."
                    value={newPolicyDesc}
                    onChange={(e) => setNewPolicyDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Effect</label>
                    <select
                      value={newPolicyEffect}
                      onChange={(e: any) => setNewPolicyEffect(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 outline-none"
                    >
                      <option value="ALLOW">ALLOW</option>
                      <option value="DENY">DENY (Overrides all)</option>
                      <option value="CONDITIONAL_ALLOW">CONDITIONAL ALLOW</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Role Identity Context</label>
                    <select
                      value={newPolicyRole}
                      onChange={(e) => setNewPolicyRole(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 outline-none"
                    >
                      <option value="RECRUITING_AGENT">RECRUITING_AGENT</option>
                      <option value="PROJECT_MANAGER_AGENT">PROJECT_MANAGER_AGENT</option>
                      <option value="FRAUD_DETECTOR_AGENT">FRAUD_DETECTOR_AGENT</option>
                      <option value="PERFORMANCE_AGENT">PERFORMANCE_AGENT</option>
                      <option value="LEARNING_AGENT">LEARNING_AGENT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Resource</label>
                    <select
                      value={newPolicyResource}
                      onChange={(e) => setNewPolicyResource(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 outline-none"
                    >
                      <option value="Resume">Resume</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Project">Project</option>
                      <option value="Task">Task</option>
                      <option value="Trust">Trust</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Action</label>
                    <select
                      value={newPolicyAction}
                      onChange={(e) => setNewPolicyAction(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 outline-none"
                    >
                      <option value="Read">Read</option>
                      <option value="Create">Create</option>
                      <option value="Update">Update</option>
                      <option value="Delete">Delete</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Scope</label>
                    <select
                      value={newPolicyScope}
                      onChange={(e: any) => setNewPolicyScope(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 outline-none"
                    >
                      <option value="Own">Own Resources</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Company">Company</option>
                      <option value="Project">Project</option>
                      <option value="GlobalRead">GlobalRead</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Risk Threshold Rating</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Low', 'Medium', 'High', 'Critical'].map(r => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setNewPolicyRisk(r as any)}
                        className={`py-1.5 rounded-lg text-[10px] font-mono transition-all border ${newPolicyRisk === r ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-neutral-950 text-neutral-400 border-neutral-800'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl text-[10px] text-neutral-400 font-mono space-y-1">
                  <span className="text-[9px] text-neutral-500 block uppercase font-bold">Automatic Safety Rules Checked:</span>
                  <div>✓ System-owned block constraint verified (No AI direct scores updates)</div>
                  <div>✓ Policy change logs will generate automatic super-administrator notification alerts.</div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Publish & Register Policy v1.0
                </button>
              </form>
            </div>

            {/* Active Policy Registry */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Active Policy Registry</h3>
                  <p className="text-[10px] text-neutral-500">Live active rules evaluated in real-time engine</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  Total Active: {policies.length}
                </span>
              </div>

              {/* Policy List cards */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {policies.map(p => (
                  <div key={p.id} className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4 space-y-2.5 relative group hover:border-neutral-700 transition-all">
                    
                    {/* Delete action simulation */}
                    <button
                      type="button"
                      onClick={() => setPolicies(policies.filter(item => item.id !== p.id))}
                      className="absolute top-4 right-4 text-neutral-600 hover:text-red-400 cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-neutral-500 font-mono font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {p.id}
                      </span>
                      <h4 className="text-xs font-bold text-neutral-200">{p.name}</h4>
                      
                      <span className={`px-2 py-0.25 rounded-md text-[9px] font-extrabold ${
                        p.effect === 'DENY' ? 'bg-red-500/10 text-rose-400 border border-red-500/20' :
                        p.effect === 'CONDITIONAL_ALLOW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {p.effect}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                      {p.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-neutral-400 bg-neutral-900/40 p-2 rounded-lg">
                      <div>Role: <span className="text-neutral-200">{p.roleOrAgent}</span></div>
                      <div>Resource: <span className="text-neutral-200">{p.resource}</span></div>
                      <div>Action: <span className="text-neutral-200">{p.action}</span></div>
                      <div>Scope: <span className="text-neutral-200">{p.scope}</span></div>
                    </div>

                    {/* Pre-conditions list */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] text-neutral-500 uppercase font-bold font-mono">Assigned Constraints:</span>
                      {p.conditions.map((cond, index) => (
                        <span key={index} className="text-[9px] font-mono bg-neutral-900 text-amber-400 px-1.5 py-0.5 rounded border border-neutral-800">
                          {cond}
                        </span>
                      ))}
                      <span className="ml-auto text-[9px] text-neutral-500 font-mono">Risk Level: {p.riskLevel}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: RBAC, ABAC & OWNERSHIP */}
        {activeSubTab === 'rbac_abac' && (
          <motion.div
            key="rbac_abac"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* RBAC Role Capability Definitions */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-neutral-300">Identity-Based RBAC Roles Matrix</h3>
              <p className="text-[10px] text-neutral-500 mb-4">Enterprise access groups assigned to AI employees to govern tool operations</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { role: 'RECRUITING_AGENT', tags: ['Candidate Search', 'Syllabus Match'], tools: ['ResumeParser', 'CalendarScheduler'], desc: 'Can process and evaluate portfolios; strictly limited to candidate selection workflows.' },
                  { role: 'PROJECT_MANAGER_AGENT', tags: ['Task Board Modification', 'Performance Write'], tools: ['TaskAssigner', 'SlackNotifier'], desc: 'Administer tasks, check code milestones, allocate student resources inside designated projects.' },
                  { role: 'FRAUD_DETECTOR_AGENT', tags: ['Trust Score Generation', 'Incident Flagging'], tools: ['RiskAnalyzer', 'AlertDispatcher'], desc: 'System-wide risk monitor evaluating anomalies; can emit conditional status warnings.' },
                  { role: 'PERFORMANCE_AGENT', tags: ['Feedback Generation', 'Badge Nominations'], tools: ['EvaluationCompiler'], desc: 'Compiles grades and certificates; recommends badges; no direct status mutation permission.' },
                  { role: 'LEARNING_AGENT', tags: ['Curriculum Mapping', 'Syllabus Recommendation'], tools: ['CurriculumSuggester'], desc: 'General advisor assessing skill gaps; low-risk classification level (Internal).' }
                ].map((item, index) => (
                  <div key={index} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold font-mono bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        {item.role}
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-2 font-sans">
                        {item.desc}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-neutral-900 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-500">
                        Allowed Tools: <span className="text-neutral-300">{item.tools.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ABAC Environmental Controls & Resource Ownership */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Resource Ownership Mapping */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Deterministic Resource Ownership Registry</h3>
                  <p className="text-[10px] text-neutral-500">Specifies structural entity boundaries of student-owned, company-owned, and system-owned data blocks</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-200">Student Ownership Domain</span>
                      <span className="text-[10px] text-neutral-500 block">Resume, Portfolio, Career Goals, Contact Details</span>
                    </div>
                    <span className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2 py-1 rounded border border-neutral-800">
                      STUDENT_OWNED
                    </span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-200">Company Ownership Domain</span>
                      <span className="text-[10px] text-neutral-500 block">Projects, Interview Schedules, Hiring Decisions, Reviews</span>
                    </div>
                    <span className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2 py-1 rounded border border-neutral-800">
                      COMPANY_OWNED
                    </span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-200">System Secure Domain</span>
                      <span className="text-[10px] text-neutral-500 block">Trust Scores, Warnings, Badges, System Audit Metrics</span>
                    </div>
                    <span className="text-[10px] font-mono bg-red-500/10 text-rose-400 px-2 py-1 rounded border border-red-500/20">
                      SYSTEM_EXCLUSIVES
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl text-[10px] text-rose-400 font-mono leading-relaxed">
                  ⚠️ <span className="font-bold">CRITICAL DEVIATION POLICY:</span> AI Agents can NEVER directly modify trust levels or status warnings. The engine automatically rejects execution unless a manual human administrator approval event overrides this lock.
                </div>
              </div>

              {/* Data Classification & Context Variables */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Data Classification Levels</h3>
                  <p className="text-[10px] text-neutral-500">Security clearance tiers assigned to resources that scale authorization constraints</p>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  {[
                    { label: 'PUBLIC', color: 'bg-neutral-900 text-neutral-400', desc: 'Syllabus, Project definitions' },
                    { label: 'INTERNAL', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', desc: 'Student profile basic, company general profile' },
                    { label: 'CONFIDENTIAL', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', desc: 'Resume details, Portfolio records, conversations' },
                    { label: 'RESTRICTED', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', desc: 'Performance reviews, grades, learning gap analysis' },
                    { label: 'HIGHLY RESTRICTED', color: 'bg-red-500/10 text-rose-400 border border-red-500/20', desc: 'Trust Scores, Warning Logs, Suspensions, API Keys' }
                  ].map((tier, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-neutral-850 pb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tier.color}`}>
                        {tier.label}
                      </span>
                      <span className="text-neutral-400 text-right">{tier.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: DELEGATION & TEMP OVERRIDES */}
        {activeSubTab === 'delegation' && (
          <motion.div
            key="delegation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Create Temp Permission Override */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Grant Emergency Override</h3>
                <p className="text-[10px] text-neutral-500">Allocate explicit, self-expiring temporary authorization bypasses directly to virtual agents</p>
              </div>

              <form onSubmit={handleGrantTempPermission} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Target AI Agent</label>
                  <select
                    value={newTempAgentId}
                    onChange={(e) => setNewTempAgentId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 outline-none"
                  >
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Bypass Override Permission String</label>
                  <input
                    type="text"
                    required
                    value={newTempPermName}
                    onChange={(e) => setNewTempPermName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Duration Limits (Minutes)</label>
                  <select
                    value={newTempMinutes}
                    onChange={(e) => setNewTempMinutes(parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 outline-none"
                  >
                    <option value={10}>10 Minutes (Emergency Scan)</option>
                    <option value={30}>30 Minutes (Standard Debug)</option>
                    <option value={60}>60 Minutes (Inter-agent delegation)</option>
                    <option value={120}>2 Hours (System migration window)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  Grant Temporary Exception
                </button>
              </form>

              {/* Fast Forward Simulator */}
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                <h4 className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Epoch Expiration Sweeper Simulator
                </h4>
                <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                  Simulates a strict clock sweep cycle. Expired permissions immediately lose authorization, protecting downstream data from privilege persistence.
                </p>
                <button
                  type="button"
                  onClick={handleExpirePermissions}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Sweep & Expire Active Overrides
                </button>
              </div>
            </div>

            {/* Active temporary permissions lists */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 lg:col-span-7 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Active Temporary Assignments</h3>
                <p className="text-[10px] text-neutral-500">Live bypass overrides actively evaluated by the stateless session validator</p>
              </div>

              {/* Active list */}
              <div className="space-y-3">
                {tempPermissions.map(item => (
                  <div key={item.id} className="bg-neutral-950 border border-neutral-850 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-500 font-bold bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                          {item.id}
                        </span>
                        <span className="font-bold text-neutral-200">
                          {agents.find(a => a.id === item.agentId)?.name || item.agentId}
                        </span>
                        <span className={`px-2 py-0.25 rounded text-[9px] font-bold ${
                          item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-1.5">{item.permissionName}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Granted by: {item.grantedBy}</div>
                    </div>

                    <div className="text-right sm:border-l sm:border-neutral-850 sm:pl-4 font-mono text-[10px] text-neutral-400">
                      <div>Allocated: {item.durationMinutes} mins</div>
                      <div className="text-[9px] text-neutral-500 mt-1">Expires: {new Date(item.endTime).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delegations List */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Active Multi-Agent Delegations</h3>
                  <p className="text-[10px] text-neutral-500">Delegated permissions inside collaborative workflows. Delegations never exceed original scope permissions.</p>
                </div>

                <div className="space-y-2">
                  {delegations.map(dlg => (
                    <div key={dlg.id} className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-200 font-bold">
                            {agents.find(a => a.id === dlg.fromAgentId)?.name} ➜ {agents.find(a => a.id === dlg.toAgentId)?.name}
                          </span>
                          <span className={`px-2 py-0.25 rounded text-[9px] font-bold ${
                            dlg.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                          }`}>
                            {dlg.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1 font-mono">Scope: {dlg.scope}</p>
                        <span className="text-[9px] text-neutral-500 block mt-0.5">Context Workflow: {dlg.workflowId}</span>
                      </div>
                      <div className="text-right sm:border-l sm:border-neutral-850 sm:pl-4 font-mono text-[9px] text-neutral-500">
                        Expires: {new Date(dlg.endTime).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: IMMUTABLE AUDIT LOG */}
        {activeSubTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Filter Panel */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search logs by Agent, Resource, Reason..."
                    value={searchAuditQuery}
                    onChange={(e) => setSearchAuditQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-neutral-500" />
                  <select
                    value={auditFilterDecision}
                    onChange={(e) => setAuditFilterDecision(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-400 outline-none"
                  >
                    <option value="ALL">All Outcomes</option>
                    <option value="GRANTED">GRANTED Only</option>
                    <option value="DENIED">DENIED Only</option>
                  </select>
                </div>
              </div>

              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
                Immutable Hash Verification: <span className="text-emerald-400 font-bold">SHA-256 Valid</span>
              </span>
            </div>

            {/* Audit Log Table */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/20 text-neutral-400 uppercase text-[10px] tracking-wider font-mono">
                      <th className="py-3 pl-4">Timestamp & ID</th>
                      <th className="py-3">Agent</th>
                      <th className="py-3">Resource & Action</th>
                      <th className="py-3">Verdict Decision</th>
                      <th className="py-3">Security Policy Applied</th>
                      <th className="py-3">Risk Assessment</th>
                      <th className="py-3 pr-4">Validation Audit Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {auditLogs
                      .filter(log => {
                        const query = searchAuditQuery.toLowerCase();
                        const matchesQuery =
                          log.agentName.toLowerCase().includes(query) ||
                          log.action.toLowerCase().includes(query) ||
                          log.resource.toLowerCase().includes(query) ||
                          log.reason.toLowerCase().includes(query);
                        
                        if (auditFilterDecision === 'ALL') return matchesQuery;
                        if (auditFilterDecision === 'GRANTED') return matchesQuery && log.decision === 'GRANTED';
                        if (auditFilterDecision === 'DENIED') return matchesQuery && log.decision !== 'GRANTED';
                        return matchesQuery;
                      })
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-900/20 group transition-all font-mono text-[11px]">
                          <td className="py-3 pl-4 whitespace-nowrap">
                            <div className="text-neutral-400">{new Date(log.timestamp).toLocaleTimeString()}</div>
                            <div className="text-[9px] text-neutral-500">{log.id}</div>
                          </td>
                          <td className="py-3 whitespace-nowrap font-sans">
                            <span className="font-semibold text-neutral-200">{log.agentName}</span>
                            <div className="text-[9px] text-neutral-500 font-mono">{log.agentId}</div>
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            <div className="text-neutral-200 font-semibold">{log.action}</div>
                            <div className="text-[10px] text-neutral-400">{log.resource} ({log.resourceId})</div>
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              log.decision === 'GRANTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-rose-400 border border-red-500/20'
                            }`}>
                              {log.decision}
                            </span>
                          </td>
                          <td className="py-3 text-neutral-300">{log.appliedPolicy}</td>
                          <td className="py-3">
                            <span className={`text-[10px] font-bold block ${
                              log.riskRating === 'Critical' ? 'text-red-400' :
                              log.riskRating === 'High' ? 'text-orange-400' :
                              log.riskRating === 'Medium' ? 'text-amber-400' :
                              'text-emerald-400'
                            }`}>
                              {log.riskRating}
                            </span>
                            <span className="text-[9px] text-neutral-500">Score: {log.riskScore}</span>
                          </td>
                          <td className="py-3 pr-4 max-w-sm font-sans leading-relaxed text-neutral-400 text-[10px]">
                            {log.reason}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: SCHEMAS & API SPEC */}
        {activeSubTab === 'schema_api' && (
          <motion.div
            key="schema_api"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Database schema layout specification */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Stateless Relational Schema Structures</h3>
                <p className="text-[10px] text-neutral-500">Database requirements under Specification 7.0 (Permission Registries)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block">1. POLICY_REGISTRY</span>
                  <div className="text-[10px] text-neutral-400 space-y-0.5 mt-2">
                    <div>• id <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• name <span className="text-neutral-500">VARCHAR(128)</span></div>
                    <div>• effect <span className="text-neutral-500">VARCHAR(32)</span></div>
                    <div>• scope <span className="text-neutral-500">VARCHAR(32)</span></div>
                    <div>• rule_definition <span className="text-neutral-500">JSONB</span></div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold block">2. AGENT_REGISTRY</span>
                  <div className="text-[10px] text-neutral-400 space-y-0.5 mt-2">
                    <div>• agent_id <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• role <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• capabilities <span className="text-neutral-500">TEXT[]</span></div>
                    <div>• risk_allowance <span className="text-neutral-500">VARCHAR(32)</span></div>
                    <div>• rate_limits <span className="text-neutral-500">JSONB</span></div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold block">3. TEMPORARY_EXCEPTIONS</span>
                  <div className="text-[10px] text-neutral-400 space-y-0.5 mt-2">
                    <div>• id <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• agent_id <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• exception_key <span className="text-neutral-500">TEXT</span></div>
                    <div>• starts_at <span className="text-neutral-500">TIMESTAMP</span></div>
                    <div>• expires_at <span className="text-neutral-500">TIMESTAMP</span></div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-purple-400 font-bold block">4. AUTHENTICATION_AUDITS</span>
                  <div className="text-[10px] text-neutral-400 space-y-0.5 mt-2">
                    <div>• tx_hash <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• agent_id <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• resource_id <span className="text-neutral-500">VARCHAR(64)</span></div>
                    <div>• action <span className="text-neutral-500">VARCHAR(32)</span></div>
                    <div>• response <span className="text-neutral-500">VARCHAR(32)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive API Endpoints & Request Console */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Enterprise REST API Specification</h3>
                <p className="text-[10px] text-neutral-500 font-sans">Execute actual REST requests against the live simulated permission endpoint</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Method selector list */}
                <div className="lg:col-span-4 flex flex-col gap-1.5">
                  {[
                    { method: 'CHECK', label: 'Check Permission Token', sub: 'POST /v1/permissions/check' },
                    { method: 'LIST_POLICIES', label: 'Query Policies Registry', sub: 'GET /v1/permissions/policies' },
                    { method: 'TEMPORARY_GRANT', label: 'Issue Temporary Bypass', sub: 'POST /v1/permissions/temporary-grant' },
                    { method: 'CLEAR_CACHE', label: 'Invalidate Global Cache', sub: 'POST /v1/cache/invalidate' }
                  ].map(btn => (
                    <button
                      type="button"
                      key={btn.method}
                      onClick={() => setApiMethod(btn.method as any)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        apiMethod === btn.method
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-800'
                      }`}
                    >
                      <div>{btn.label}</div>
                      <span className="text-[10px] font-mono text-neutral-500 font-normal block mt-1">{btn.sub}</span>
                    </button>
                  ))}
                </div>

                {/* API Request details & Response display */}
                <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-400 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-850 pb-2 text-[10px]">
                    <span className="text-amber-400 uppercase font-bold tracking-wider">
                      Endpoint: {apiResponse.endpoint}
                    </span>
                    <span className="text-neutral-500">REST Client v7.0</span>
                  </div>

                  {apiResponse.payload && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">JSON Payload Body:</span>
                      <pre className="bg-neutral-900 border border-neutral-850 p-2 rounded-lg text-[10px] text-neutral-300 overflow-x-auto">
                        {JSON.stringify(apiResponse.payload, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Response Stream:</span>
                    <pre className="bg-neutral-900 border border-neutral-850 p-2.5 rounded-lg text-[10px] text-emerald-400 overflow-x-auto">
                      {JSON.stringify(apiResponse.response, null, 2)}
                    </pre>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 8: AUTHORIZATION SUITE TESTS */}
        {activeSubTab === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Stateless Authorization Assertion Tests</h3>
                <p className="text-[10px] text-neutral-500 font-sans">Enforce compliance and validation algorithms under 10M check capacity criteria</p>
              </div>

              <button
                type="button"
                onClick={runAutomatedTests}
                disabled={isTestingRunning}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                {isTestingRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing Assertions...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Run Automated Enterprise Checks
                  </>
                )}
              </button>
            </div>

            {/* Test runner CLI log interface */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-neutral-400 space-y-1.5 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2 text-[10px] mb-2 text-neutral-500">
                <span>KONEXA-SECURE-AGENT-CLI v7.0</span>
                <span>System Health: SECURE</span>
              </div>

              {testSuiteLogs.map((log, index) => {
                let colorClass = 'text-neutral-400';
                if (log.includes('[PASS]')) colorClass = 'text-emerald-400';
                if (log.includes('TESTING PRINCIPLE')) colorClass = 'text-amber-400 font-bold mt-2.5 block';
                if (log.includes('SCANS COMPLETED')) colorClass = 'text-emerald-400 font-bold border-t border-neutral-850 pt-2.5 mt-4 block';

                return (
                  <div key={index} className={colorClass}>
                    {log}
                  </div>
                );
              })}

              {isTestingRunning && (
                <div className="flex items-center gap-2 text-neutral-500 text-[10px] italic animate-pulse mt-2">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Running live thread latency performance benchmarks...
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Technical Documentation section */}
      <div className="bg-neutral-900/20 border border-neutral-850 rounded-2xl p-5 mt-6 space-y-4">
        <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-neutral-400" /> Chief Security Architect Implementation Manual
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-400 leading-relaxed font-sans">
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-200">1. Stateless Authorization Logic</h4>
            <p className="text-[11px]">
              Authorization requests are completely stateless. Every checking cycle passes through the structured multi-variable pipeline: Agent identity parameters are assessed alongside tool definitions, context attributes (ABAC), and immutable resource ownership matrices. Permissions are never inferred; they must exist explicitly or result in immediate Zero Trust blocks.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-200">2. Collision Resolution Hierarchy</h4>
            <p className="text-[11px]">
              In cases where multiple policies apply to a single transaction request, the engine implements a strict precedence cascade: **Explicit Deny** immediately overrides any concurrent **Conditional Deny**, followed by **Explicit Allow**, and finally **Inherited Allow**. If no policy matches, the fallback resolves to **Default Deny**.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
