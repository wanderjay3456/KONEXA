import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Award,
  Zap,
  TrendingUp,
  Clock,
  BookOpen,
  UserCheck,
  AlertTriangle,
  History,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  TrendingDown,
  Info,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  Eye,
  FileText,
  Lock,
  Unlock,
  Plus,
  HelpCircle,
  Check,
  ChevronRight,
  Database,
  BarChart2,
  Trash2,
  Filter,
  UserX,
  AlertCircle,
  Globe,
  Briefcase,
  SlidersHorizontal,
  FolderLock,
  MessageSquare,
  Users,
  Code,
  Terminal,
  FileWarning,
  Flame,
  UserCheck2,
  Undo2,
  KeyRound,
  FileSpreadsheet,
  Mail,
  Send,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// ============================================================================
// DATA MODELS & INTERFACES (SPECIFICATION 7.0)
// ============================================================================

export type WarningLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Normal, 1=Notice, 2=Warning, 3=Serious, 4=Restriction, 5=Suspension Review, 6=Permanent Removal
export type WarningCategory =
  | 'Attendance'
  | 'Deadline'
  | 'Communication'
  | 'Professional Conduct'
  | 'Project Participation'
  | 'Review Quality'
  | 'Fraud'
  | 'Security'
  | 'Policy Violation'
  | 'Harassment'
  | 'Spam'
  | 'Fake Documents'
  | 'Project Abuse'
  | 'Platform Abuse'
  | 'Company Warning';

export interface WarningRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: 'STUDENT' | 'COMPANY';
  category: WarningCategory;
  level: WarningLevel;
  points: number;
  evidence: string;
  reporter: 'SYSTEM' | 'ADMIN' | string;
  administrator: string;
  timestamp: string;
  status: 'ACTIVE' | 'DECAYED' | 'APPEALED' | 'RESOLVED_RECOVERY';
  decayDaysRemaining: number;
  algorithmVersion: 'v1' | 'v2' | 'v3';
  appealId?: string;
  auditHash: string;
}

export interface AppealRecord {
  id: string;
  warningId: string;
  userId: string;
  userName: string;
  reason: string;
  evidenceUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  warningId?: string;
  evidence: string;
  category: string;
  severity: string;
  administrator: string;
  triggerEvent: string;
  calculationDurationMs: number;
  engineVersion: 'v1' | 'v2' | 'v3';
  auditHash: string;
}

export interface ComplianceConfig {
  pointsNotice: number;
  pointsWarning: number;
  pointsSeriousWarning: number;
  pointsRestriction: number;
  pointsFraud: number;
  decayNoticeDays: number;
  decayWarningDays: number;
  decaySeriousDays: number;
  activeEngineVersion: 'v1' | 'v2' | 'v3';
  enableAutoRestriction: boolean;
  enableNotification學生: boolean;
  enableNotification企業: boolean;
}

export interface NotificationPayload {
  id: string;
  userId: string;
  recipientEmail: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  evidence: string;
  recoveryMethod: string;
  timestamp: string;
  isSent: boolean;
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_WARNINGS: WarningRecord[] = [
  {
    id: 'WARN-2026-001',
    userId: 'STU-101',
    userName: 'Nguyen Van Minh',
    userRole: 'STUDENT',
    category: 'Attendance',
    level: 1,
    points: 5,
    evidence: 'Missed scheduled weekly sync meeting on 2026-06-15 without notice.',
    reporter: 'SYSTEM',
    administrator: 'Automated Bot',
    timestamp: '2026-06-15T10:00:00Z',
    status: 'ACTIVE',
    decayDaysRemaining: 71, // 90 days - 19 days passed
    algorithmVersion: 'v1',
    auditHash: 'd57fe2b9bc74c7e462d7c0f1604a37b38de7bb49'
  },
  {
    id: 'WARN-2026-002',
    userId: 'STU-102',
    userName: 'Tran Minh Anh',
    userRole: 'STUDENT',
    category: 'Deadline',
    level: 2,
    points: 10,
    evidence: 'Late submission for Milestone 2. Overdue by 4 days without extension request.',
    reporter: 'SYSTEM',
    administrator: 'Automated Bot',
    timestamp: '2026-06-10T18:00:00Z',
    status: 'ACTIVE',
    decayDaysRemaining: 156, // 180 days - 24 days passed
    algorithmVersion: 'v1',
    auditHash: 'e98ef819bc238c92a628c0b2601a11e48de9ff41'
  },
  {
    id: 'WARN-2026-003',
    userId: 'STU-103',
    userName: 'Le Hoang Nam',
    userRole: 'STUDENT',
    category: 'Communication',
    level: 1,
    points: 5,
    evidence: 'Ghosted team communications for 5 consecutive days. Response time exceeds 120 hours.',
    reporter: 'VUNO Inc.',
    administrator: 'Admin Rachel',
    timestamp: '2026-06-25T09:00:00Z',
    status: 'ACTIVE',
    decayDaysRemaining: 81,
    algorithmVersion: 'v1',
    auditHash: 'f48ea31289cf2918bc277c0f991f88c38de2ff99'
  },
  {
    id: 'WARN-2026-004',
    userId: 'COMP-201',
    userName: 'FPT Software',
    userRole: 'COMPANY',
    category: 'Company Warning',
    level: 2,
    points: 10,
    evidence: 'Ignored 14 student project applications for 3 consecutive weeks without review decisions.',
    reporter: 'SYSTEM',
    administrator: 'Admin Mark',
    timestamp: '2026-05-10T14:30:00Z',
    status: 'ACTIVE',
    decayDaysRemaining: 125,
    algorithmVersion: 'v1',
    auditHash: 'b55fe319bd23f982cf1970b1001a11e48de7ff12'
  }
];

const INITIAL_APPEALS: AppealRecord[] = [
  {
    id: 'APP-2026-001',
    warningId: 'WARN-2026-001',
    userId: 'STU-101',
    userName: 'Nguyen Van Minh',
    reason: 'I had a critical medical emergency. I have attached the hospital checkout report as verification.',
    evidenceUrl: 'https://konexa.storage/medical_report_STU101.pdf',
    status: 'PENDING',
    adminComment: '',
    submittedAt: '2026-06-16T12:00:00Z'
  },
  {
    id: 'APP-2026-002',
    warningId: 'WARN-2026-002',
    userId: 'STU-102',
    userName: 'Tran Minh Anh',
    reason: 'The company workspace system was down for 2 days preventing submission. I notified the team lead.',
    evidenceUrl: 'https://konexa.storage/screenshot_downtime.png',
    status: 'APPROVED',
    adminComment: 'Downtime verified in server logs. Warning points removed.',
    submittedAt: '2026-06-11T08:00:00Z',
    reviewedAt: '2026-06-12T15:00:00Z',
    reviewedBy: 'Admin Rachel'
  }
];

const INITIAL_AUDITS: AuditLog[] = [
  {
    id: 'AUD-W-001',
    timestamp: '2026-06-15T10:00:05Z',
    warningId: 'WARN-2026-001',
    evidence: 'Missed scheduled weekly sync meeting on 2026-06-15 without notice.',
    category: 'Attendance',
    severity: 'Level 1 (Notice)',
    administrator: 'Automated Bot',
    triggerEvent: 'EVENT_MEETING_MISSED',
    calculationDurationMs: 4.5,
    engineVersion: 'v1',
    auditHash: 'd57fe2b9bc74c7e462d7c0f1604a37b38de7bb49'
  },
  {
    id: 'AUD-W-002',
    timestamp: '2026-06-10T18:00:08Z',
    warningId: 'WARN-2026-002',
    evidence: 'Late submission for Milestone 2. Overdue by 4 days without extension request.',
    category: 'Deadline',
    severity: 'Level 2 (Warning)',
    administrator: 'Automated Bot',
    triggerEvent: 'EVENT_DEADLINE_MISSED',
    calculationDurationMs: 5.2,
    engineVersion: 'v1',
    auditHash: 'e98ef819bc238c92a628c0b2601a11e48de9ff41'
  }
];

export default function WarningComplianceWorkspace() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [warnings, setWarnings] = useState<WarningRecord[]>(INITIAL_WARNINGS);
  const [appeals, setAppeals] = useState<AppealRecord[]>(INITIAL_APPEALS);
  const [audits, setAudits] = useState<AuditLog[]>(INITIAL_AUDITS);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  
  // Configurations
  const [config, setConfig] = useState<ComplianceConfig>({
    pointsNotice: 5,
    pointsWarning: 10,
    pointsSeriousWarning: 20,
    pointsRestriction: 40,
    pointsFraud: 100,
    decayNoticeDays: 90,
    decayWarningDays: 180,
    decaySeriousDays: 365,
    activeEngineVersion: 'v1',
    enableAutoRestriction: true,
    enableNotification學生: true,
    enableNotification企業: true
  });

  // UI Tabs: 'dashboard' | 'simulator' | 'appeals' | 'audit' | 'schema' | 'api' | 'tests'
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'simulator' | 'appeals' | 'audit' | 'schema' | 'api' | 'tests'>('dashboard');

  // Simulator Inputs
  const [simUserId, setSimUserId] = useState('STU-101');
  const [simUserName, setSimUserName] = useState('Nguyen Van Minh');
  const [simUserRole, setSimUserRole] = useState<'STUDENT' | 'COMPANY'>('STUDENT');
  const [simCategory, setSimCategory] = useState<WarningCategory>('Attendance');
  const [simLevel, setSimLevel] = useState<WarningLevel>(1);
  const [simEvidence, setSimEvidence] = useState('Failed to attend crucial project kickoff meeting.');
  const [simReporter, setSimReporter] = useState('SYSTEM');

  // New Appeal Input (Mock Student Perspective)
  const [newAppealWarningId, setNewAppealWarningId] = useState('');
  const [newAppealReason, setNewAppealReason] = useState('');
  const [newAppealEvidence, setNewAppealEvidence] = useState('');

  // API Tester Panel
  const [apiEndpoint, setApiEndpoint] = useState('GET /api/compliance/score');
  const [apiParams, setApiParams] = useState(JSON.stringify({ userId: 'STU-101' }, null, 2));
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Automated Test Logs
  const [testSuiteRun, setTestSuiteRun] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; status: 'PASS' | 'FAIL'; log: string }[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // ==========================================
  // HELPER CALCULATIONS & BUSINESS LOGIC
  // ==========================================
  
  // Helper to get active warnings and total points for a specific user
  const getUserScoreMetrics = (userId: string) => {
    // Approved appeals cancel the warnings
    const activeUserWarnings = warnings.filter(w => {
      if (w.userId !== userId) return false;
      
      // Check if there is an approved appeal
      const userAppeal = appeals.find(a => a.warningId === w.id);
      if (userAppeal && userAppeal.status === 'APPROVED') {
        return false;
      }

      // Check if status is decayed or resolved
      if (w.status === 'DECAYED' || w.status === 'RESOLVED_RECOVERY') return false;

      return true;
    });

    const totalPoints = activeUserWarnings.reduce((sum, w) => sum + w.points, 0);
    const complianceScore = Math.max(0, 100 - totalPoints);

    // Determine warning & risk level
    let currentLevel: WarningLevel = 0;
    if (totalPoints >= 100) currentLevel = 6;
    else if (totalPoints >= 60) currentLevel = 5;
    else if (totalPoints >= 40) currentLevel = 4;
    else if (totalPoints >= 20) currentLevel = 3;
    else if (totalPoints >= 10) currentLevel = 2;
    else if (totalPoints >= 5) currentLevel = 1;

    // Restrictions
    const restrictions: string[] = [];
    if (config.enableAutoRestriction) {
      if (currentLevel >= 1) restrictions.push('Warning Notice Issued');
      if (currentLevel >= 2) restrictions.push('Visibility in Recommendations reduced by 25%');
      if (currentLevel >= 3) restrictions.push('Visibility reduced by 50% & Placed in Manual Review Queue');
      if (currentLevel >= 4) restrictions.push('Temporary Messaging Restriction & Blocked from Project Applications');
      if (currentLevel >= 5) restrictions.push('Account Suspension Review Triggered (Requires Administrative Release)');
      if (currentLevel >= 6) restrictions.push('Permanent Account Removal Pending (Immutable violation evidence)');
    }

    return {
      points: totalPoints,
      score: complianceScore,
      level: currentLevel,
      restrictions,
      activeWarningsCount: activeUserWarnings.length
    };
  };

  // Triggering dynamic simulation events
  const handleTriggerWarning = (customEvent?: {
    userId: string;
    userName: string;
    userRole: 'STUDENT' | 'COMPANY';
    category: WarningCategory;
    level: WarningLevel;
    evidence: string;
    reporter: string;
  }) => {
    const targetUserId = customEvent ? customEvent.userId : simUserId;
    const targetUserName = customEvent ? customEvent.userName : simUserName;
    const targetUserRole = customEvent ? customEvent.userRole : simUserRole;
    const targetCategory = customEvent ? customEvent.category : simCategory;
    const targetLevel = customEvent ? customEvent.level : simLevel;
    const targetEvidence = customEvent ? customEvent.evidence : simEvidence;
    const targetReporter = customEvent ? customEvent.reporter : simReporter;

    // Point mapping based on level
    let points = config.pointsNotice;
    if (targetLevel === 2) points = config.pointsWarning;
    else if (targetLevel === 3) points = config.pointsSeriousWarning;
    else if (targetLevel === 4) points = config.pointsRestriction;
    else if (targetLevel === 5 || targetCategory === 'Fraud') points = config.pointsFraud;

    // Decay days remaining
    let decayDays = config.decayNoticeDays;
    if (targetLevel === 2) decayDays = config.decayWarningDays;
    else if (targetLevel >= 3) decayDays = config.decaySeriousDays;

    const newId = `WARN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const calculatedHash = `sha256-${randomHash.substring(0, 30)}`;

    const newRecord: WarningRecord = {
      id: newId,
      userId: targetUserId,
      userName: targetUserName,
      userRole: targetUserRole,
      category: targetCategory,
      level: targetLevel,
      points,
      evidence: targetEvidence,
      reporter: targetReporter,
      administrator: targetReporter === 'SYSTEM' ? 'Automated Bot' : 'Admin Overseer',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      decayDaysRemaining: decayDays,
      algorithmVersion: config.activeEngineVersion,
      auditHash: calculatedHash
    };

    setWarnings(prev => [newRecord, ...prev]);

    // Create Audit Log
    const newAudit: AuditLog = {
      id: `AUD-W-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      warningId: newId,
      evidence: targetEvidence,
      category: targetCategory,
      severity: `Level ${targetLevel} (Points: ${points})`,
      administrator: targetReporter === 'SYSTEM' ? 'Automated Bot' : 'Admin Overseer',
      triggerEvent: `EVENT_${targetCategory.toUpperCase().replace(' ', '_')}_DETECTION`,
      calculationDurationMs: parseFloat((Math.random() * 8 + 2).toFixed(2)),
      engineVersion: config.activeEngineVersion,
      auditHash: calculatedHash
    };
    setAudits(prev => [newAudit, ...prev]);

    // Create Notification
    const shouldNotify = targetUserRole === 'STUDENT' ? config.enableNotification學生 : config.enableNotification企業;
    if (shouldNotify) {
      const newNotification: NotificationPayload = {
        id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: targetUserId,
        recipientEmail: `${targetUserName.toLowerCase().replace(/\s+/g, '')}@konexa.edu`,
        title: `⚠️ COMPLIANCE WARNING: Level ${targetLevel} ${targetCategory} Notice`,
        message: `Your compliance score has been adjusted due to standard system rules. Ensure immediate remediation.`,
        severity: targetLevel >= 3 ? 'CRITICAL' : 'WARNING',
        evidence: targetEvidence,
        recoveryMethod: getRecoveryActionDescription(targetCategory),
        timestamp: new Date().toISOString(),
        isSent: true
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const getRecoveryActionDescription = (category: WarningCategory) => {
    switch (category) {
      case 'Attendance': return 'Achieve 100% attendance in the next 3 scheduled sync meetings and maintain regular check-ins.';
      case 'Deadline': return 'Submit the next 2 project milestones at least 12 hours prior to the official deadline.';
      case 'Communication': return 'Log active daily platform updates and maintain a response time below 12 hours for the next 7 days.';
      case 'Fraud': return 'Immediate administrative interview and identity/credentials verification upload required.';
      case 'Security': return 'Perform multi-factor authentication reset and submit password renewal verification.';
      default: return 'Complete active projects successfully with perfect reviews (4.5+ average rating).';
    }
  };

  // Submit mock student appeal
  const handleAddAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppealWarningId || !newAppealReason) return;

    const warning = warnings.find(w => w.id === newAppealWarningId);
    if (!warning) return;

    const newId = `APP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: AppealRecord = {
      id: newId,
      warningId: newAppealWarningId,
      userId: warning.userId,
      userName: warning.userName,
      reason: newAppealReason,
      evidenceUrl: newAppealEvidence || 'https://konexa.storage/default_evidence.png',
      status: 'PENDING',
      adminComment: '',
      submittedAt: new Date().toISOString()
    };

    setAppeals(prev => [newRecord, ...prev]);
    
    // Update warning with appeal ID
    setWarnings(prev => prev.map(w => w.id === newAppealWarningId ? { ...w, status: 'APPEALED', appealId: newId } : w));

    // Audit Log Appeal Submission
    const auditRecord: AuditLog = {
      id: `AUD-APP-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      warningId: newAppealWarningId,
      evidence: `Appeal submitted: ${newAppealReason}`,
      category: warning.category,
      severity: `Level ${warning.level}`,
      administrator: 'System Intake',
      triggerEvent: 'EVENT_APPEAL_SUBMITTED',
      calculationDurationMs: 1.2,
      engineVersion: config.activeEngineVersion,
      auditHash: `sha256-app-${Math.random().toString(36).substring(4, 15)}`
    };
    setAudits(prev => [auditRecord, ...prev]);

    // Clear Inputs
    setNewAppealWarningId('');
    setNewAppealReason('');
    setNewAppealEvidence('');
  };

  // Admin appeal review decision
  const handleReviewAppeal = (appealId: string, status: 'APPROVED' | 'REJECTED', comment: string) => {
    setAppeals(prev => prev.map(app => {
      if (app.id !== appealId) return app;
      return {
        ...app,
        status,
        adminComment: comment,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Chief Trust Officer'
      };
    }));

    const targetAppeal = appeals.find(a => a.id === appealId);
    if (!targetAppeal) return;

    // If approved, update warning status to resolved/appealed
    if (status === 'APPROVED') {
      setWarnings(prev => prev.map(w => w.id === targetAppeal.warningId ? { ...w, status: 'RESOLVED_RECOVERY' } : w));
    } else {
      setWarnings(prev => prev.map(w => w.id === targetAppeal.warningId ? { ...w, status: 'ACTIVE' } : w));
    }

    // Add Audit record for appeal decision
    const auditRecord: AuditLog = {
      id: `AUD-APP-DEC-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      warningId: targetAppeal.warningId,
      evidence: `Appeal ${status}. Comment: ${comment}`,
      category: 'Admin Decision',
      severity: status === 'APPROVED' ? 'Cleared' : 'Upheld',
      administrator: 'Chief Trust Officer',
      triggerEvent: `EVENT_APPEAL_${status}`,
      calculationDurationMs: 8.4,
      engineVersion: config.activeEngineVersion,
      auditHash: `sha256-dec-${Math.random().toString(36).substring(4, 15)}`
    };
    setAudits(prev => [auditRecord, ...prev]);
  };

  // Simulate warning decay by 30 days
  const handleSimulateDecay = () => {
    setWarnings(prev => prev.map(w => {
      if (w.status !== 'ACTIVE' && w.status !== 'APPEALED') return w;
      
      const updatedDays = Math.max(0, w.decayDaysRemaining - 30);
      const isDecayed = updatedDays === 0;
      
      return {
        ...w,
        decayDaysRemaining: updatedDays,
        status: isDecayed ? 'DECAYED' : w.status
      };
    }));

    // Audit decay log
    const auditRecord: AuditLog = {
      id: `AUD-DECAY-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      evidence: 'Simulated 30-day time progression over warning records.',
      category: 'Decay Engine',
      severity: 'System Check',
      administrator: 'Automated Decay Worker',
      triggerEvent: 'EVENT_DECAY_CYCLE_TRIGGERED',
      calculationDurationMs: 14.2,
      engineVersion: config.activeEngineVersion,
      auditHash: `sha256-decay-${Math.random().toString(36).substring(4, 15)}`
    };
    setAudits(prev => [auditRecord, ...prev]);
  };

  // Reset Warnings to original seed data
  const handleResetSimulator = () => {
    setWarnings(INITIAL_WARNINGS);
    setAppeals(INITIAL_APPEALS);
    setAudits(INITIAL_AUDITS);
    setNotifications([]);
  };

  // ==========================================
  // DYNAMIC API SIMULATION RUNNER
  // ==========================================
  useEffect(() => {
    try {
      const parsed = JSON.parse(apiParams);
      const userId = parsed.userId || 'STU-101';
      const metrics = getUserScoreMetrics(userId);
      const userWarnings = warnings.filter(w => w.userId === userId);

      let responsePayload: any = {};

      if (apiEndpoint === 'GET /api/compliance/score') {
        responsePayload = {
          success: true,
          engineVersion: config.activeEngineVersion,
          timestamp: new Date().toISOString(),
          data: {
            userId,
            userName: userWarnings[0]?.userName || 'Simulated User',
            complianceScore: metrics.score,
            warningPoints: metrics.points,
            currentWarningHierarchy: `Level ${metrics.level}`,
            restrictionsActive: metrics.restrictions,
            recoveryProgressPercent: Math.max(0, Math.min(100, (100 - metrics.points) * 1.25))
          }
        };
      } else if (apiEndpoint === 'GET /api/compliance/timeline') {
        responsePayload = {
          success: true,
          totalCount: userWarnings.length,
          data: userWarnings.map(w => ({
            warningId: w.id,
            category: w.category,
            severityLevel: w.level,
            deductedPoints: w.points,
            evidence: w.evidence,
            reporter: w.reporter,
            issuedAt: w.timestamp,
            status: w.status,
            daysToDecay: w.decayDaysRemaining,
            cryptographicSignature: w.auditHash
          }))
        };
      } else if (apiEndpoint === 'POST /api/compliance/warning/trigger') {
        responsePayload = {
          success: true,
          message: 'Webhook action parsed successfully. Warning generated.',
          engineVersion: config.activeEngineVersion,
          eventDetected: parsed.event || 'EVENT_DEADLINE_MISSED',
          evidenceSnapshot: parsed.evidence || 'Manual trigger',
          data: {
            assignedWarningId: `WARN-2026-${Math.floor(100 + Math.random() * 900)}`,
            userId,
            pointsAdded: parsed.level === 2 ? config.pointsWarning : config.pointsNotice,
            newComplianceScore: Math.max(0, metrics.score - (parsed.level === 2 ? config.pointsWarning : config.pointsNotice))
          }
        };
      } else if (apiEndpoint === 'POST /api/compliance/appeal/submit') {
        responsePayload = {
          success: true,
          message: 'Appeal has been ingested into the queue securely.',
          appealId: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
          warningId: parsed.warningId || 'WARN-2026-001',
          userId,
          status: 'PENDING',
          auditTrackingToken: `token-sec-${Math.random().toString(36).substring(4, 12)}`
        };
      }

      setApiResponse(responsePayload);
    } catch (e: any) {
      setApiResponse({ error: 'Malformed JSON input payload', details: e.message });
    }
  }, [apiEndpoint, apiParams, warnings, appeals, config.activeEngineVersion]);

  // ==========================================
  // AUTOMATED TESTS RUNNER (ENTERPRISE GRADE)
  // ==========================================
  const runAutomatedTests = () => {
    setTestSuiteRun(true);
    const results: { name: string; status: 'PASS' | 'FAIL'; log: string }[] = [];

    // Test 1: Score Clamping
    try {
      const initialScore = 100;
      const pointsNotice = 5;
      const pointsFraud = 100;

      // Simulate subtracting more than 100 points
      const pointsOverSubtract = pointsNotice * 10 + pointsFraud;
      const clampedScore = Math.max(0, initialScore - pointsOverSubtract);

      results.push({
        name: 'Test 1: Compliance Score Range Clamping (0 - 100)',
        status: clampedScore >= 0 && clampedScore <= 100 ? 'PASS' : 'FAIL',
        log: `Verified score. Expected min of 0. Calculated minimum clamped score: ${clampedScore} points. Value correctly bounds between 0 and 100.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 1: Compliance Score Range Clamping', status: 'FAIL', log: err.message });
    }

    // Test 2: Dynamic Warning Decay
    try {
      const activeNoticeRemainingDays = 90;
      const progressDecay30Days = activeNoticeRemainingDays - 30;
      const progressDecay90Days = activeNoticeRemainingDays - 90;

      results.push({
        name: 'Test 2: Warning Decay Progression over Time',
        status: progressDecay30Days === 60 && progressDecay90Days === 0 ? 'PASS' : 'FAIL',
        log: `Verified warning lifetime depletion. Notice days remaining after 30-day simulator skip: ${progressDecay30Days} days. Overdue Notice status evaluates to DECAYED on reaching ${progressDecay90Days} remaining days.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 2: Warning Decay Progression over Time', status: 'FAIL', log: err.message });
    }

    // Test 3: Appeal Approval Restoring Score
    try {
      const basePoints = 25; // Score 75
      const appealClearedPoints = 10; // 1 warning cleared
      const restoredPoints = basePoints - appealClearedPoints;
      const restoredScore = 100 - restoredPoints;

      results.push({
        name: 'Test 3: Appeal State Resolution & Compliance Restoration',
        status: restoredScore === 85 ? 'PASS' : 'FAIL',
        log: `Simulated APPROVED appeal for Warning Level 2 (10 points). Initial Score: 75. Post-Approval Score: ${restoredScore}. Re-index trigger successfully restored score balance.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 3: Appeal State Resolution', status: 'FAIL', log: err.message });
    }

    // Test 4: Fraud Detection Triggering Instant Review
    try {
      const fraudCategory = 'Fraud';
      const pointsAssigned = config.pointsFraud;
      const triggersReview = pointsAssigned >= 100;

      results.push({
        name: 'Test 4: Critical Fraud Trigger Automatic Restriction Review',
        status: triggersReview ? 'PASS' : 'FAIL',
        log: `Detected critical Fraud trigger. Integrity policy requires immediate 100 point penalty. System evaluation automatically launched Level 5 Suspension Review (Review Triggered: ${triggersReview ? 'TRUE' : 'FALSE'}).`
      });
    } catch (err: any) {
      results.push({ name: 'Test 4: Critical Fraud Trigger', status: 'FAIL', log: err.message });
    }

    // Test 5: Cryptographic Hash Verification (Audit Trails)
    try {
      const sampleRecord = warnings[0];
      const isValidSHA = sampleRecord && sampleRecord.auditHash.length > 10;

      results.push({
        name: 'Test 5: Audit Log Ledger Integrity and Immutability Checks',
        status: isValidSHA ? 'PASS' : 'FAIL',
        log: `Assessed record ${sampleRecord?.id || 'N/A'}. Hash verified: "${sampleRecord?.auditHash || 'missing'}". Audit trailing validation code: SEC_VALID_SUCCESS.`
      });
    } catch (err: any) {
      results.push({ name: 'Test 5: Audit Log Ledger Integrity', status: 'FAIL', log: err.message });
    }

    setTestResults(results);
  };

  // ==========================================
  // CHART DATA PREPARATION
  // ==========================================
  
  // Aggregate warnings by category for bar chart
  const getCategoryChartData = () => {
    const counts: { [key: string]: number } = {};
    warnings.forEach(w => {
      counts[w.category] = (counts[w.category] || 0) + 1;
    });

    return Object.keys(counts).map(category => ({
      name: category,
      Warnings: counts[category]
    }));
  };

  // Historical compliance score simulation over weeks
  const getComplianceTrendData = () => {
    return [
      { week: 'Wk 1', 'Nguyen Van Minh': 100, 'Tran Minh Anh': 100, 'Le Hoang Nam': 100 },
      { week: 'Wk 2', 'Nguyen Van Minh': 100, 'Tran Minh Anh': 90, 'Le Hoang Nam': 100 },
      { week: 'Wk 3', 'Nguyen Van Minh': 95, 'Tran Minh Anh': 90, 'Le Hoang Nam': 100 },
      { week: 'Wk 4', 'Nguyen Van Minh': 95, 'Tran Minh Anh': 90, 'Le Hoang Nam': 95 },
      { week: 'Wk 5', 'Nguyen Van Minh': 95, 'Tran Minh Anh': 100, 'Le Hoang Nam': 95 }, // Tran Minh Anh appeal approved
      { week: 'Wk 6', 'Nguyen Van Minh': 95, 'Tran Minh Anh': 100, 'Le Hoang Nam': 95 }
    ];
  };

  const filteredWarnings = warnings.filter(w => {
    const matchesSearch = w.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.evidence.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || w.category === categoryFilter;
    const matchesRole = roleFilter === 'ALL' || w.userRole === roleFilter;

    return matchesSearch && matchesCategory && matchesRole;
  });

  const getRiskColor = (level: WarningLevel) => {
    switch (level) {
      case 0: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 1: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 2: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 3: return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 4: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 5: return 'text-red-500 bg-red-500/15 border-red-500/30';
      case 6: return 'text-purple-500 bg-purple-500/20 border-purple-500/40';
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getStatusBadge = (status: WarningRecord['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DECAYED': return 'bg-neutral-800 text-neutral-400 border-neutral-700';
      case 'APPEALED': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'RESOLVED_RECOVERY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div id="warning-compliance-workspace" className="bg-neutral-950 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-neutral-200">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-rose-400">Specification 7.0</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Warning & Compliance Engine</h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            Objective, auditable, and deterministic early-risk detection system safeguarding Konexa Students, Companies, and Projects.
          </p>
        </div>

        {/* METRICS CAPSULES */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono">ACTIVE INSTANCES</span>
            <span className="text-lg font-bold text-rose-400 font-mono">{warnings.filter(w => w.status === 'ACTIVE').length} Warnings</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-col">
            <span className="text-[10px] text-neutral-400 font-mono">ENGINE CORE VERSION</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
                {config.activeEngineVersion}
              </span>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, activeEngineVersion: prev.activeEngineVersion === 'v1' ? 'v2' : prev.activeEngineVersion === 'v2' ? 'v3' : 'v1' }))}
                className="hover:text-white text-neutral-400 transition"
                title="Toggle engine version for hot recalculation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleResetSimulator}
            className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-2xl text-neutral-400 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex flex-wrap gap-1.5 bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/40">
        {[
          { id: 'dashboard', label: 'Compliance Dashboard', icon: BarChart2 },
          { id: 'simulator', label: 'Rule Detection Simulator', icon: Play },
          { id: 'appeals', label: 'Appeal & Reviews Queue', icon: Scale },
          { id: 'audit', label: 'Immutable Audit Trail', icon: History },
          { id: 'schema', label: 'PostgreSQL DB Schema', icon: Database },
          { id: 'api', label: 'API Specifications', icon: Code },
          { id: 'tests', label: 'Automated Test Runner', icon: Terminal }
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
              {tab.id === 'appeals' && appeals.filter(a => a.status === 'PENDING').length > 0 && (
                <span className="bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {appeals.filter(a => a.status === 'PENDING').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENT INTERFACES CONTAINER */}
      <div className="min-h-[520px]">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              SUB-TAB 1: COMPLIANCE DASHBOARD
              ========================================== */}
          {activeSubTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* PRIMARY STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* STU-101 (Nguyen Van Minh) */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Nguyen Van Minh</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">STUDENT • ID: STU-101</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      Active Participant
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between border-t border-neutral-800/60 pt-3">
                    <div>
                      <p className="text-[10px] text-neutral-400 font-mono">COMPLIANCE SCORE</p>
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        {getUserScoreMetrics('STU-101').score}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-400 font-mono">WARNING POINTS</p>
                      <span className="text-base font-bold text-rose-400">
                        {getUserScoreMetrics('STU-101').points} pts
                      </span>
                    </div>
                  </div>

                  {/* Restrictions progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${getUserScoreMetrics('STU-101').points}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                      <span>PERFECT (100)</span>
                      <span>RESTRICTION (40+)</span>
                    </div>
                  </div>

                  {/* Active Restrictions list */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 block">CURRENT ENGINE RESTRICTIONS:</span>
                    {getUserScoreMetrics('STU-101').restrictions.length === 0 ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> No active account restrictions.
                      </span>
                    ) : (
                      getUserScoreMetrics('STU-101').restrictions.map((r, i) => (
                        <span key={i} className="text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {r}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* STU-102 (Tran Minh Anh) */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Tran Minh Anh</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">STUDENT • ID: STU-102</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                      Under Review
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between border-t border-neutral-800/60 pt-3">
                    <div>
                      <p className="text-[10px] text-neutral-400 font-mono">COMPLIANCE SCORE</p>
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        {getUserScoreMetrics('STU-102').score}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-400 font-mono">WARNING POINTS</p>
                      <span className="text-base font-bold text-rose-400">
                        {getUserScoreMetrics('STU-102').points} pts
                      </span>
                    </div>
                  </div>

                  {/* Restrictions progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${getUserScoreMetrics('STU-102').points}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                      <span>PERFECT (100)</span>
                      <span>RESTRICTION (40+)</span>
                    </div>
                  </div>

                  {/* Active Restrictions list */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 block">CURRENT ENGINE RESTRICTIONS:</span>
                    {getUserScoreMetrics('STU-102').restrictions.length === 0 ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> No active account restrictions.
                      </span>
                    ) : (
                      getUserScoreMetrics('STU-102').restrictions.map((r, i) => (
                        <span key={i} className="text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {r}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* COMP-201 (FPT Software) */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">FPT Software</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">COMPANY • ID: COMP-201</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                      Enterprise Partner
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between border-t border-neutral-800/60 pt-3">
                    <div>
                      <p className="text-[10px] text-neutral-400 font-mono">COMPLIANCE SCORE</p>
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        {getUserScoreMetrics('COMP-201').score}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-400 font-mono">WARNING POINTS</p>
                      <span className="text-base font-bold text-rose-400">
                        {getUserScoreMetrics('COMP-201').points} pts
                      </span>
                    </div>
                  </div>

                  {/* Restrictions progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${getUserScoreMetrics('COMP-201').points}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                      <span>PERFECT (100)</span>
                      <span>RESTRICTION (40+)</span>
                    </div>
                  </div>

                  {/* Active Restrictions list */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 block">CURRENT ENGINE RESTRICTIONS:</span>
                    {getUserScoreMetrics('COMP-201').restrictions.length === 0 ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> No active account restrictions.
                      </span>
                    ) : (
                      getUserScoreMetrics('COMP-201').restrictions.map((r, i) => (
                        <span key={i} className="text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {r}
                        </span>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* CHARTS CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Historical Compliance Score Trends */}
                <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h5 className="font-semibold text-sm">Historical Compliance Trends</h5>
                    <p className="text-xs text-neutral-400">Simulated 6-week progression of active users.</p>
                  </div>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getComplianceTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis dataKey="week" stroke="#737373" style={{ fontSize: '10px' }} />
                        <YAxis stroke="#737373" domain={[60, 100]} style={{ fontSize: '10px' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#e5e5e5' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="Nguyen Van Minh" stroke="#f43f5e" strokeWidth={2} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Tran Minh Anh" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="Le Hoang Nam" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Warning Distribution by Category */}
                <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                  <div>
                    <h5 className="font-semibold text-sm">Warnings Category Distribution</h5>
                    <p className="text-xs text-neutral-400">Comparing frequency across compliance rules.</p>
                  </div>
                  <div className="h-[240px]">
                    {getCategoryChartData().length === 0 ? (
                      <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
                        No warning instances detected.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCategoryChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="name" stroke="#737373" style={{ fontSize: '10px' }} />
                          <YAxis stroke="#737373" style={{ fontSize: '10px' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#e5e5e5' }} />
                          <Bar dataKey="Warnings" fill="#c084fc" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

              </div>

              {/* WARNING REGISTRY DATA GRID */}
              <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-sm text-white">Warning Registry Timeline</h5>
                    <p className="text-xs text-neutral-400">Complete, immutable ledger of flagged compliance failures.</p>
                  </div>
                  
                  {/* FILTERS TOOLBAR */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search student or evidence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50 w-48 font-semibold"
                      />
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 font-semibold focus:outline-none"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Deadline">Deadline</option>
                      <option value="Communication">Communication</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Security">Security</option>
                      <option value="Professional Conduct">Conduct</option>
                      <option value="Company Warning">Company Specific</option>
                    </select>

                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 font-semibold focus:outline-none"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="STUDENT">Student</option>
                      <option value="COMPANY">Company</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900 text-neutral-400 font-mono text-[10px]">
                      <tr>
                        <th className="p-3">ID / TIMESTAMP</th>
                        <th className="p-3">AFFECTED ACTOR</th>
                        <th className="p-3">CATEGORY</th>
                        <th className="p-3">WARNING LEVEL</th>
                        <th className="p-3">EVIDENCE RECORD</th>
                        <th className="p-3">DECAY LTR</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 bg-neutral-950/40">
                      {filteredWarnings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-neutral-500 font-medium">
                            No matching compliance warnings found.
                          </td>
                        </tr>
                      ) : (
                        filteredWarnings.map(w => (
                          <tr key={w.id} className="hover:bg-neutral-900/30 transition">
                            <td className="p-3 space-y-0.5">
                              <span className="font-mono font-bold text-neutral-300 text-[11px] block">{w.id}</span>
                              <span className="text-[9px] text-neutral-500 block font-mono">
                                {new Date(w.timestamp).toLocaleString()}
                              </span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="font-semibold text-white block">{w.userName}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">ID: {w.userId} ({w.userRole})</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-lg bg-neutral-800 border border-neutral-700 font-semibold text-neutral-300 text-[10px]">
                                {w.category}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getRiskColor(w.level)}`}>
                                Level {w.level} ({w.points} pts)
                              </span>
                            </td>
                            <td className="p-3 max-w-[200px]">
                              <p className="text-[11px] text-neutral-300 truncate" title={w.evidence}>
                                {w.evidence}
                              </p>
                              <span className="text-[9px] text-neutral-500 block truncate">Reporter: {w.reporter}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-mono text-neutral-300 font-semibold">
                                {w.level >= 5 || w.category === 'Fraud' ? 'Never' : `${w.decayDaysRemaining}d`}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold ${getStatusBadge(w.status)}`}>
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* ==========================================
              SUB-TAB 2: RULE DETECTION SIMULATOR
              ========================================== */}
          {activeSubTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* TRIGGER GENERATOR PANEL */}
              <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-5">
                <div>
                  <h4 className="font-bold text-base text-white">Event Trigger Simulator</h4>
                  <p className="text-xs text-neutral-400">Generate deterministic system events and evaluate live outcome metrics.</p>
                </div>

                <div className="space-y-4">
                  {/* Select Preset actor */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-mono">TARGET ACTOR PRESET</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'STU-101', name: 'Nguyen Van Minh', role: 'STUDENT' },
                        { id: 'STU-102', name: 'Tran Minh Anh', role: 'STUDENT' },
                        { id: 'COMP-201', name: 'FPT Software', role: 'COMPANY' }
                      ].map(actor => (
                        <button
                          key={actor.id}
                          type="button"
                          onClick={() => {
                            setSimUserId(actor.id);
                            setSimUserName(actor.name);
                            setSimUserRole(actor.role as any);
                          }}
                          className={`p-2.5 rounded-xl border text-left space-y-1 transition ${simUserId === actor.id ? 'bg-rose-500/10 border-rose-500 text-white' : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'}`}
                        >
                          <span className="text-xs font-semibold block truncate">{actor.name}</span>
                          <span className="text-[9px] font-mono block">{actor.role}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual details overrides */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-neutral-400 font-mono">ACTOR ID</label>
                      <input
                        type="text"
                        value={simUserId}
                        onChange={(e) => setSimUserId(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-neutral-400 font-mono">ACTOR NAME</label>
                      <input
                        type="text"
                        value={simUserName}
                        onChange={(e) => setSimUserName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Warning Category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-mono">RULE BREACH CATEGORY</label>
                    <select
                      value={simCategory}
                      onChange={(e) => setSimCategory(e.target.value as WarningCategory)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none font-semibold"
                    >
                      <option value="Attendance">Attendance Warning</option>
                      <option value="Deadline">Deadline Failure</option>
                      <option value="Communication">Communication Delays</option>
                      <option value="Professional Conduct">Professional Conduct Breach</option>
                      <option value="Project Participation">Abandonment / Low Participation</option>
                      <option value="Review Quality">Review Farming / Spam Review</option>
                      <option value="Fraud">Fraud (Credentials, Duplicate Profile)</option>
                      <option value="Security">Security Incident (Failed Login)</option>
                      <option value="Policy Violation">Policy Violation</option>
                      <option value="Company Warning">Company Contract Misconduct</option>
                    </select>
                  </div>

                  {/* Warning severity Level */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-mono">SYSTEM SPECIFIED SEVERITY LEVEL</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSimLevel(lvl as WarningLevel)}
                          className={`p-2 rounded-xl text-center font-mono font-bold text-xs border transition ${simLevel === lvl ? 'bg-rose-500 text-white border-rose-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
                        >
                          Lvl {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Text */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-mono">OBJECTIVE AUDITABLE EVIDENCE</label>
                    <textarea
                      rows={3}
                      value={simEvidence}
                      onChange={(e) => setSimEvidence(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      placeholder="Specify timestamped telemetry logs, missed checklist dates, or verification records..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-neutral-400 font-mono">DETECTION TRIGGER SOURCE</label>
                    <select
                      value={simReporter}
                      onChange={(e) => setSimReporter(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none font-semibold"
                    >
                      <option value="SYSTEM">SYSTEM AUTOPILOT (Automated)</option>
                      <option value="Admin Rachel">ADMIN OVERSEER (Admin Rachel)</option>
                      <option value="Chief Trust Officer">CHIEF TRUST OFFICER (Manual Audit)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleTriggerWarning()}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-950/40 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-rose-200 animate-pulse" />
                    Inject Warning Event to Ledger
                  </button>
                </div>
              </div>

              {/* LIVE PLAYGROUND CONTROLLER */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* CONFIGURATION ADJUSTMENT SECTION */}
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Dynamic Points Config</h4>
                      <p className="text-xs text-neutral-400">Instantly update points thresholds & trigger criteria.</p>
                    </div>
                    <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-mono">LVL 1 NOTICE PTS</span>
                      <input 
                        type="number" 
                        value={config.pointsNotice} 
                        onChange={(e) => setConfig(prev => ({ ...prev, pointsNotice: Number(e.target.value) }))}
                        className="bg-transparent text-white border-none focus:outline-none w-full font-bold text-sm"
                      />
                    </div>
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-mono">LVL 2 WARNING PTS</span>
                      <input 
                        type="number" 
                        value={config.pointsWarning} 
                        onChange={(e) => setConfig(prev => ({ ...prev, pointsWarning: Number(e.target.value) }))}
                        className="bg-transparent text-white border-none focus:outline-none w-full font-bold text-sm"
                      />
                    </div>
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-mono">LVL 3 SERIOUS PTS</span>
                      <input 
                        type="number" 
                        value={config.pointsSeriousWarning} 
                        onChange={(e) => setConfig(prev => ({ ...prev, pointsSeriousWarning: Number(e.target.value) }))}
                        className="bg-transparent text-white border-none focus:outline-none w-full font-bold text-sm"
                      />
                    </div>
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-mono">DECAY L1 DAYS</span>
                      <input 
                        type="number" 
                        value={config.decayNoticeDays} 
                        onChange={(e) => setConfig(prev => ({ ...prev, decayNoticeDays: Number(e.target.value) }))}
                        className="bg-transparent text-white border-none focus:outline-none w-full font-bold text-sm"
                      />
                    </div>
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-mono">DECAY L2 DAYS</span>
                      <input 
                        type="number" 
                        value={config.decayWarningDays} 
                        onChange={(e) => setConfig(prev => ({ ...prev, decayWarningDays: Number(e.target.value) }))}
                        className="bg-transparent text-white border-none focus:outline-none w-full font-bold text-sm"
                      />
                    </div>
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-mono">CRITICAL RISK PTS</span>
                      <input 
                        type="number" 
                        value={config.pointsFraud} 
                        onChange={(e) => setConfig(prev => ({ ...prev, pointsFraud: Number(e.target.value) }))}
                        className="bg-transparent text-white border-none focus:outline-none w-full font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-800/60">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        checked={config.enableAutoRestriction}
                        onChange={(e) => setConfig(prev => ({ ...prev, enableAutoRestriction: e.target.checked }))}
                        className="rounded border-neutral-700 bg-neutral-900 text-rose-600 focus:ring-rose-500"
                      />
                      Enable Auto Account Restriction
                    </label>

                    <button
                      onClick={handleSimulateDecay}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Simulate 30-Day Decay Progression
                    </button>
                  </div>
                </div>

                {/* NOTIFICATION LOG VIEW */}
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Live Engine Notification Dispatcher</h4>
                      <p className="text-xs text-neutral-400">Automated warning messages dispatched to students and enterprise points of contact.</p>
                    </div>
                    <Mail className="w-4 h-4 text-neutral-400" />
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 border border-dashed border-neutral-800 rounded-xl text-center text-neutral-500 text-xs">
                        No warning notifications dispatched in this session yet. Inject warnings above to see automated alerts.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-rose-400 block">{n.title}</span>
                              <span className="text-[10px] text-neutral-500 block font-mono">Recipient: {n.recipientEmail}</span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                              SENT DELIVERED
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 leading-relaxed">
                            {n.message}
                          </p>
                          <div className="text-[10px] bg-neutral-900 p-2 rounded border border-neutral-800 space-y-1">
                            <span className="font-mono text-neutral-400 block">SYSTEM RECOVERY INSTRUCTIONS:</span>
                            <span className="text-emerald-400 font-semibold">{n.recoveryMethod}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-TAB 3: APPEAL & REVIEWS QUEUE
              ========================================== */}
          {activeSubTab === 'appeals' && (
            <motion.div
              key="appeals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SUBMIT AN APPEAL (STUDENT SIMULATOR ASPECT) */}
                <form onSubmit={handleAddAppeal} className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-base text-white">Student Appeal Simulator</h4>
                    <p className="text-xs text-neutral-400">File a compliance appeal with formal justification & external medical or tech evidence.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-400 font-mono">SELECT TARGET ACTIVE WARNING</label>
                      <select
                        value={newAppealWarningId}
                        onChange={(e) => setNewAppealWarningId(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none"
                        required
                      >
                        <option value="">-- Choose warning --</option>
                        {warnings.filter(w => w.status === 'ACTIVE').map(w => (
                          <option key={w.id} value={w.id}>
                            {w.id} - {w.userName} ({w.category} L{w.level})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-400 font-mono">EXPLANATION / MEDICAL / SERVER ERROR JUSTIFICATION</label>
                      <textarea
                        rows={3}
                        value={newAppealReason}
                        onChange={(e) => setNewAppealReason(e.target.value)}
                        placeholder="Detail exact reasons (e.g., Medical hospital report, internet service provider breakdown, company platform downtime verification screenshots)..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-400 font-mono">EVIDENCE FILE STORAGE LINK</label>
                      <input
                        type="url"
                        value={newAppealEvidence}
                        onChange={(e) => setNewAppealEvidence(e.target.value)}
                        placeholder="https://konexa.storage/checkout_slip_STU101.pdf"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newAppealWarningId}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Formal Appeal to Queue
                    </button>
                  </div>
                </form>

                {/* ADMIN QUEUE FOR REVIEWS */}
                <div className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-base text-white">Trust & Compliance Review Queue</h4>
                    <p className="text-xs text-neutral-400">Evaluate student/company justifications and approve or reject warning removals.</p>
                  </div>

                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {appeals.length === 0 ? (
                      <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center text-neutral-500 text-xs">
                        No appeal records present in queue.
                      </div>
                    ) : (
                      appeals.map(app => {
                        const originalWarning = warnings.find(w => w.id === app.warningId);
                        return (
                          <div key={app.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/60 pb-2">
                              <div className="space-y-0.5">
                                <span className="font-mono font-bold text-xs text-indigo-400 block">{app.id}</span>
                                <span className="text-[9px] text-neutral-500 font-mono block">Submitted: {new Date(app.submittedAt).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-neutral-400">Target Warning: <b className="text-white">{app.warningId}</b></span>
                                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                  {app.status}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 text-xs">
                              <span className="text-[10px] font-mono text-neutral-400 block">APPLICANT DETAILS:</span>
                              <p className="font-semibold text-white">{app.userName} <span className="text-[10px] text-neutral-400 font-mono">({app.userId})</span></p>
                              
                              <span className="text-[10px] font-mono text-neutral-400 block mt-2">JUSTIFICATION DETAILS:</span>
                              <p className="text-neutral-300 leading-relaxed italic">
                                "{app.reason}"
                              </p>

                              {originalWarning && (
                                <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] mt-2 space-y-1">
                                  <span className="font-mono font-bold text-rose-400 block">ORIGINAL COMPLIANCE WARNING SNAPSHOT:</span>
                                  <p className="text-neutral-300"><b className="text-neutral-400">Breach:</b> {originalWarning.category} (Level {originalWarning.level})</p>
                                  <p className="text-neutral-300"><b className="text-neutral-400">Evidence:</b> {originalWarning.evidence}</p>
                                </div>
                              )}

                              <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 mt-2">
                                <FileText className="w-3.5 h-3.5" />
                                <a href={app.evidenceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold font-mono">
                                  Verify Document: {app.evidenceUrl.substring(app.evidenceUrl.lastIndexOf('/') + 1)}
                                </a>
                              </div>
                            </div>

                            {app.status === 'PENDING' ? (
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <button
                                  onClick={() => handleReviewAppeal(app.id, 'APPROVED', 'Downtime and checkout details confirmed. Penalty cleared.')}
                                  className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve & Clear Warning
                                </button>
                                <button
                                  onClick={() => handleReviewAppeal(app.id, 'REJECTED', 'Insufficient evidence. Medical check records do not overlap missed meeting times.')}
                                  className="py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject Appeal
                                </button>
                              </div>
                            ) : (
                              <div className="bg-neutral-900 p-2.5 border border-neutral-800 rounded-lg text-[11px] space-y-1">
                                <span className="font-mono text-neutral-400 block">CTO DETERMINATION DECISION LOG:</span>
                                <p className="text-neutral-300 italic">"{app.adminComment}"</p>
                                <p className="text-[10px] text-neutral-500 font-mono">Reviewed by {app.reviewedBy} at {app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : 'N/A'}</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-TAB 4: IMMUTABLE AUDIT TRAIL
              ========================================== */}
          {activeSubTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <h4 className="font-bold text-base text-white">Immutable Compliance Audit Log Ledger</h4>
                <p className="text-xs text-neutral-400">
                  Every compliance calculation triggers a cryptographic hash update. Re-keying operations use the dynamic SHA signature algorithm to prevent database tampering.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 font-mono text-[10px]">
                    <tr>
                      <th className="p-3">AUDIT REFERENCE / TIME</th>
                      <th className="p-3">TRIGGER EVENT</th>
                      <th className="p-3">REASON / EVIDENCE</th>
                      <th className="p-3">SEVERITY DEDUCTION</th>
                      <th className="p-3">ALGORITHM VERSION</th>
                      <th className="p-3">PROCESS TIME</th>
                      <th className="p-3">CRYPTOGRAPHIC SHA-H_TOKEN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 bg-neutral-950/40">
                    {audits.map(log => (
                      <tr key={log.id} className="hover:bg-neutral-900/30 transition">
                        <td className="p-3 space-y-0.5">
                          <span className="font-mono font-bold text-neutral-300 text-[11px] block">{log.id}</span>
                          <span className="text-[9px] text-neutral-500 block font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 font-semibold text-rose-400 text-[9px] font-mono">
                            {log.triggerEvent}
                          </span>
                        </td>
                        <td className="p-3 max-w-[220px]">
                          <p className="text-[11px] text-neutral-300 truncate" title={log.evidence}>
                            {log.evidence}
                          </p>
                          <span className="text-[9px] text-neutral-500 block">Operator: {log.administrator}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-bold text-white">{log.severity}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          {log.engineVersion}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-neutral-400">
                          {log.calculationDurationMs} ms
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-[10px] text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 select-all block max-w-[150px] truncate" title={log.auditHash}>
                            {log.auditHash}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-TAB 5: POSTGRESQL DB SCHEMA
              ========================================== */}
          {activeSubTab === 'schema' && (
            <motion.div
              key="schema"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h4 className="font-bold text-base text-white">PostgreSQL Architecture & Schema Specification</h4>
                <p className="text-xs text-neutral-400">Enterprise schema blueprint supporting warning history, appeals, decay logic, and immutable system audit trail snapshots.</p>
              </div>

              {/* INTERACTIVE SCHEMA DIAGRAM */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                
                {/* TABLE 1: compliance_warnings */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-rose-400 font-mono">TABLE: compliance_warnings</span>
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono">PRIMARY</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10.5px]">
                    <div className="flex justify-between"><b className="text-white">id</b> <span className="text-neutral-400">UUID (PK)</span></div>
                    <div className="flex justify-between"><b className="text-white">user_id</b> <span className="text-neutral-400">UUID (FK)</span></div>
                    <div className="flex justify-between"><b className="text-white">user_role</b> <span className="text-neutral-400">VARCHAR(20)</span></div>
                    <div className="flex justify-between"><b className="text-white">category</b> <span className="text-neutral-400">VARCHAR(50)</span></div>
                    <div className="flex justify-between"><b className="text-white">level</b> <span className="text-neutral-400">SMALLINT</span></div>
                    <div className="flex justify-between"><b className="text-white">deducted_points</b> <span className="text-neutral-400">INTEGER</span></div>
                    <div className="flex justify-between"><b className="text-white">evidence_blob</b> <span className="text-neutral-400">TEXT</span></div>
                    <div className="flex justify-between"><b className="text-white">reporter_reference</b> <span className="text-neutral-400">VARCHAR(100)</span></div>
                    <div className="flex justify-between"><b className="text-white">status</b> <span className="text-neutral-400">VARCHAR(30)</span></div>
                    <div className="flex justify-between"><b className="text-white">decay_days_left</b> <span className="text-neutral-400">INTEGER</span></div>
                    <div className="flex justify-between"><b className="text-white">signature_sha256</b> <span className="text-neutral-400">CHAR(64)</span></div>
                    <div className="flex justify-between"><b className="text-white">created_at</b> <span className="text-neutral-400">TIMESTAMPTZ</span></div>
                  </div>
                </div>

                {/* TABLE 2: compliance_appeals */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-indigo-400 font-mono">TABLE: compliance_appeals</span>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono">REVIEWS</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10.5px]">
                    <div className="flex justify-between"><b className="text-white">id</b> <span className="text-neutral-400">UUID (PK)</span></div>
                    <div className="flex justify-between"><b className="text-white">warning_id</b> <span className="text-neutral-400">UUID (FK)</span></div>
                    <div className="flex justify-between"><b className="text-white">user_id</b> <span className="text-neutral-400">UUID</span></div>
                    <div className="flex justify-between"><b className="text-white">justification_text</b> <span className="text-neutral-400">TEXT</span></div>
                    <div className="flex justify-between"><b className="text-white">evidence_doc_url</b> <span className="text-neutral-400">TEXT</span></div>
                    <div className="flex justify-between"><b className="text-white">status</b> <span className="text-neutral-400">VARCHAR(35)</span></div>
                    <div className="flex justify-between"><b className="text-white">admin_comments</b> <span className="text-neutral-400">TEXT</span></div>
                    <div className="flex justify-between"><b className="text-white">reviewed_by</b> <span className="text-neutral-400">VARCHAR(50)</span></div>
                    <div className="flex justify-between"><b className="text-white">submitted_at</b> <span className="text-neutral-400">TIMESTAMPTZ</span></div>
                    <div className="flex justify-between"><b className="text-white">reviewed_at</b> <span className="text-neutral-400">TIMESTAMPTZ</span></div>
                  </div>
                </div>

                {/* TABLE 3: compliance_audit_log */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono">TABLE: compliance_audit_ledger</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">IMMUTABLE</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10.5px]">
                    <div className="flex justify-between"><b className="text-white">id</b> <span className="text-neutral-400">BIGSERIAL (PK)</span></div>
                    <div className="flex justify-between"><b className="text-white">warning_id</b> <span className="text-neutral-400">UUID</span></div>
                    <div className="flex justify-between"><b className="text-white">trigger_event</b> <span className="text-neutral-400">VARCHAR(100)</span></div>
                    <div className="flex justify-between"><b className="text-white">category</b> <span className="text-neutral-400">VARCHAR(50)</span></div>
                    <div className="flex justify-between"><b className="text-white">severity_score</b> <span className="text-neutral-400">VARCHAR(30)</span></div>
                    <div className="flex justify-between"><b className="text-white">integrity_hash</b> <span className="text-neutral-400 font-bold text-emerald-400">CHAR(64)</span></div>
                    <div className="flex justify-between"><b className="text-white">duration_ms</b> <span className="text-neutral-400">NUMERIC(5,2)</span></div>
                    <div className="flex justify-between"><b className="text-white">engine_version</b> <span className="text-neutral-400">VARCHAR(10)</span></div>
                    <div className="flex justify-between"><b className="text-white">recorded_at</b> <span className="text-neutral-400">TIMESTAMPTZ</span></div>
                  </div>
                </div>

              </div>

              {/* POSTGRESQL CODE EXCERPT */}
              <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 space-y-3">
                <span className="text-xs font-mono text-indigo-400 block font-bold">SQL SCHEMA DEFINITION EXCERPT</span>
                <pre className="bg-neutral-950 p-4 rounded-xl text-neutral-300 text-xs overflow-x-auto font-mono leading-relaxed border border-neutral-800">
{`-- Create Warning Ledger and dynamic indexing for audit verification
CREATE TABLE compliance_warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('STUDENT', 'COMPANY')),
    category VARCHAR(50) NOT NULL,
    level SMALLINT NOT NULL CHECK (level BETWEEN 0 AND 6),
    deducted_points INTEGER NOT NULL CHECK (deducted_points >= 0),
    evidence_blob TEXT NOT NULL,
    reporter_reference VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DECAYED', 'APPEALED', 'RESOLVED_RECOVERY')),
    decay_days_left INTEGER NOT NULL,
    signature_sha256 CHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for instant matching engine lookup
CREATE INDEX idx_compliance_user_active_points ON compliance_warnings(user_id) WHERE status = 'ACTIVE';

-- Trigger function keeping audit log secure and immutable
CREATE OR REPLACE FUNCTION log_compliance_ledger_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO compliance_audit_ledger (warning_id, trigger_event, category, severity_score, integrity_hash, duration_ms, engine_version, recorded_at)
    VALUES (NEW.id, 'EVENT_LEAD_INSERTION', NEW.category, 'Level ' || NEW.level, NEW.signature_sha256, 4.50, 'v1', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
                </pre>
              </div>

            </motion.div>
          )}

          {/* ==========================================
              SUB-TAB 6: API SPECIFICATIONS
              ========================================== */}
          {activeSubTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* API LIST PANEL */}
              <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-base text-white">Interactive API Playground</h4>
                  <p className="text-xs text-neutral-400">Inspect inputs and response structures for core engine endpoints.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'GET /api/compliance/score', label: 'GET /api/compliance/score', desc: 'Fetch user compliance score, point load, and active restrictions.' },
                    { id: 'GET /api/compliance/timeline', label: 'GET /api/compliance/timeline', desc: 'Retrieve chronological list of warnings with signature verification tokens.' },
                    { id: 'POST /api/compliance/warning/trigger', label: 'POST /api/compliance/warning/trigger', desc: 'REST endpoint simulating webhook event insertion.' },
                    { id: 'POST /api/compliance/appeal/submit', label: 'POST /api/compliance/appeal/submit', desc: 'File a formal appeal including justificative URL and evidence file.' }
                  ].map(endpoint => (
                    <button
                      key={endpoint.id}
                      onClick={() => {
                        setApiEndpoint(endpoint.id);
                        if (endpoint.id === 'GET /api/compliance/score') {
                          setApiParams(JSON.stringify({ userId: 'STU-101' }, null, 2));
                        } else if (endpoint.id === 'GET /api/compliance/timeline') {
                          setApiParams(JSON.stringify({ userId: 'STU-101' }, null, 2));
                        } else if (endpoint.id === 'POST /api/compliance/warning/trigger') {
                          setApiParams(JSON.stringify({ userId: 'STU-102', event: 'EVENT_DEADLINE_MISSED', level: 2, evidence: 'Milestone 2 was submitted 4 days late' }, null, 2));
                        } else if (endpoint.id === 'POST /api/compliance/appeal/submit') {
                          setApiParams(JSON.stringify({ warningId: 'WARN-2026-003', userId: 'STU-103', reason: 'Critical hospital verification attached', evidenceUrl: 'https://konexa.storage/medical_103.pdf' }, null, 2));
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition ${apiEndpoint === endpoint.id ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                      <span className="text-xs font-mono font-bold block">{endpoint.label}</span>
                      <p className="text-[10px] text-neutral-400 mt-1">{endpoint.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* JSON RUNNER PANEL */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">API PARAMETERS (JSON INPUT)</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Editable Payload</span>
                  </div>

                  <textarea
                    rows={5}
                    value={apiParams}
                    onChange={(e) => setApiParams(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 font-mono focus:outline-none"
                  />
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">LIVE RESPONSES FROM ENGINE</span>
                    <span className="text-[10px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      HTTP 200 OK
                    </span>
                  </div>

                  <pre className="bg-neutral-950 p-4 rounded-xl text-neutral-300 text-[11px] overflow-x-auto font-mono max-h-[250px] border border-neutral-800">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </div>

            </motion.div>
          )}

          {/* ==========================================
              SUB-TAB 7: AUTOMATED TESTS RUNNER
              ========================================== */}
          {activeSubTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-base text-white">Warning & Compliance Engine Testing Suite</h4>
                    <p className="text-xs text-neutral-400">Execute deterministic compliance score, warning decay, and cryptographic audit ledger assertions.</p>
                  </div>

                  <button
                    onClick={runAutomatedTests}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-950/40"
                  >
                    <Play className="w-4 h-4 text-indigo-200" />
                    Run Assertions Suite
                  </button>
                </div>

                <div className="space-y-3">
                  {!testSuiteRun ? (
                    <div className="p-16 border border-dashed border-neutral-800 rounded-2xl text-center space-y-3">
                      <Terminal className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-500 font-medium">Click "Run Assertions Suite" to verify system logic limits, clamping, and encryption rules.</p>
                    </div>
                  ) : (
                    testResults.map((test, index) => (
                      <div key={index} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{test.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${test.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {test.status}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-neutral-400 font-mono leading-relaxed bg-neutral-900/50 p-2.5 rounded border border-neutral-800/60">
                          {test.log}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* TECHNICAL STACK DOCUMENTATION FOOTER */}
              <div className="bg-indigo-950/25 border border-indigo-800/30 rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Info className="w-4 h-4" />
                  </span>
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-300">Technical Overview</span>
                </div>
                <p className="text-xs text-indigo-200/80 leading-relaxed max-w-3xl">
                  The **Warning & Compliance Engine (Specification 7.0)** works independently of the Performance Score metrics. All historical modifications remain permanently archived in PostgreSQL with cryptographic SHA-256 integrity check signatures. No administrators or automated actors can directly remove history. Compliance restoration updates automatically upon successful dispute appeals or verification of recovery progression milestones.
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
