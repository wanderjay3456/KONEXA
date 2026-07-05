import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Shield,
  ShieldCheck,
  ShieldAlert,
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
  BookOpenCheck,
  HeartHandshake,
  Lightbulb,
  BadgeAlert,
  Fingerprint,
  MessageSquare,
  Users,
  Code,
  Terminal
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
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// ==========================================
// INTERFACES & SPECIFICATION DEFINITIONS
// ==========================================

export type BadgeCategory =
  | 'Professional Performance'
  | 'Project Excellence'
  | 'Communication'
  | 'Reliability'
  | 'Leadership'
  | 'Technical Skills'
  | 'Growth'
  | 'Community'
  | 'Learning'
  | 'Global Experience'
  | 'Trust'
  | 'Hiring'
  | 'Special Recognition';

export type BadgeLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Legend';

export type BadgeVisibility = 'Public' | 'Private' | 'Employer Only' | 'Student Only' | 'Administrator Only';

export interface BadgeRequirement {
  metricName: string;
  currentValue: number;
  targetValue: number;
}

export interface BadgeDef {
  id: string;
  name: string;
  category: BadgeCategory;
  level: BadgeLevel;
  description: string;
  icon: React.ComponentType<any>;
  requirements: BadgeRequirement[];
  isLocked: boolean;
  progressPercent: number;
  confidenceScore: number; // 0-100
  expiresInDays?: number; // undefined means never expires
  visibility: BadgeVisibility;
  bonuses: string[];
  explanation: string;
  evidenceReference?: string;
  dateEarned?: string;
}

export interface BadgeHistoryRecord {
  id: string;
  badgeId: string;
  badgeName: string;
  category: BadgeCategory;
  level: BadgeLevel;
  action: 'AWARD' | 'UPGRADE' | 'REMOVAL';
  reason: string;
  timestamp: string;
  evidence: string;
  actor: string;
  version: 'v1' | 'v2' | 'v3';
}

export interface BadgeRemovalRecord {
  id: string;
  badgeId: string;
  badgeName: string;
  reason: 'Repeated Fraud' | 'Identity Fraud' | 'Trust Below Threshold' | 'Repeated Suspension' | 'Admin Discretion';
  timestamp: string;
  administrator: string;
  details: string;
}

export interface FraudCase {
  id: string;
  actor: string;
  type: 'Fake Badge Farming' | 'Duplicate Projects' | 'Repeated Fake Reviews' | 'Artificial Trust Inflation' | 'Duplicate Accounts';
  confidence: number; // 0-100
  evidence: string;
  status: 'UNDER_REVIEW' | 'CONFIRMED' | 'DISMISSED';
  timestamp: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  engineVersion: 'v1' | 'v2' | 'v3';
  triggerEvent: string;
  affectedBadge: string;
  previousLevel: BadgeLevel | 'None';
  newLevel: BadgeLevel | 'None';
  action: 'AWARD' | 'UPGRADE' | 'REMOVAL' | 'EVALUATED';
  calculationDurationMs: number;
  auditHash: string;
}

// Initial default configuration
const INITIAL_BONUSES_CONFIG = {
  matchingMultiplier: { Bronze: 1.05, Silver: 1.10, Gold: 1.20, Platinum: 1.35, Diamond: 1.50, Legend: 1.80 },
  trustBoost: { Bronze: 1, Silver: 2, Gold: 4, Platinum: 6, Diamond: 10, Legend: 15 },
  searchPriority: { Bronze: 'Normal', Silver: 'High', Gold: 'Higher', Platinum: 'VIP', Diamond: 'Super VIP', Legend: 'Pinned' }
};

export default function BadgeEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'gallery' | 'simulator' | 'config' | 'fraud' | 'audit' | 'tech_docs'>('gallery');

  // Configuration States
  const [engineVersion, setEngineVersion] = useState<'v1' | 'v2' | 'v3'>('v3');
  const [bonusesConfig, setBonusesConfig] = useState(INITIAL_BONUSES_CONFIG);
  const [autoAwardEnabled, setAutoAwardEnabled] = useState<boolean>(true);
  const [decayAndExpiryEnabled, setDecayAndExpiryEnabled] = useState<boolean>(true);

  // Filters for Badge Gallery
  const [categoryFilter, setCategoryFilter] = useState<BadgeCategory | 'All'>('All');
  const [levelFilter, setLevelFilter] = useState<BadgeLevel | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Earned' | 'Locked'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulation metrics
  const [studentPerformanceScore, setStudentPerformanceScore] = useState<number>(96);
  const [consecutiveProjectsNoWarning, setConsecutiveProjectsNoWarning] = useState<number>(3);
  const [completedProjectsCount, setCompletedProjectsCount] = useState<number>(12);
  const [ontimeSubmissionsCount, setOntimeSubmissionsCount] = useState<number>(54);
  const [avgResponseHours, setAvgResponseHours] = useState<number>(3.8);
  const [trustScoreValue, setTrustScoreValue] = useState<number>(97.5);
  const [profileVerifiedItems, setProfileVerifiedItems] = useState<number>(3); // Max 3 (Identity, University, Profile)
  const [isIdentityVerified, setIsIdentityVerified] = useState<boolean>(true);
  const [isUniversityVerified, setIsUniversityVerified] = useState<boolean>(true);
  const [isProfileVerified, setIsProfileVerified] = useState<boolean>(true);
  const [hiringCount, setHiringCount] = useState<number>(2);

  // Core Badges State
  const [badges, setBadges] = useState<BadgeDef[]>([]);
  const [badgeHistory, setBadgeHistory] = useState<BadgeHistoryRecord[]>([
    {
      id: 'B-HST-001',
      badgeId: 'BADGE-TRUST-01',
      badgeName: 'Verified Professional',
      category: 'Trust',
      level: 'Bronze',
      action: 'AWARD',
      reason: 'Achieved 100% profile, university, and identity credentials clearance.',
      timestamp: '2026-05-12T10:14:00Z',
      evidence: 'NTNU API Sync Node #88 + CivicPass Signature 0x7f3e8',
      actor: 'System Evaluator Daemon',
      version: 'v3'
    },
    {
      id: 'B-HST-002',
      badgeId: 'BADGE-PERF-01',
      badgeName: 'Perfect Performer',
      category: 'Professional Performance',
      level: 'Gold',
      action: 'AWARD',
      reason: 'Exceeded performance rating of 95 on 3 consecutive enterprise simulations.',
      timestamp: '2026-06-20T14:30:00Z',
      evidence: 'Milestone sweeps index PRJ-992, PRJ-1012, PRJ-1044',
      actor: 'System Evaluator Daemon',
      version: 'v3'
    },
    {
      id: 'B-HST-003',
      badgeId: 'BADGE-DL-01',
      badgeName: 'Deadline Keeper',
      category: 'Reliability',
      level: 'Silver',
      action: 'UPGRADE',
      reason: 'Maintained zero delays on 50 consecutive professional milestones.',
      timestamp: '2026-06-25T11:05:00Z',
      evidence: 'On-time delivery log checklist count: 54/54',
      actor: 'System Evaluator Daemon',
      version: 'v3'
    }
  ]);

  const [badgeRemovals, setBadgeRemovals] = useState<BadgeRemovalRecord[]>([
    {
      id: 'RMV-901',
      badgeId: 'BADGE-COMM-02',
      badgeName: 'Discussion Leader',
      reason: 'Repeated Suspension',
      timestamp: '2026-04-18T16:00:00Z',
      administrator: 'Siri Nilsen (Trust Lead)',
      details: 'Flagged by moderation pipeline for repeatedly pushing duplicate AI comments into peer workspace. Temporarily suspended forum level privileges.'
    }
  ]);

  // Fraud Cases
  const [fraudQueue, setFraudQueue] = useState<FraudCase[]>([
    {
      id: 'FRD-CASE-101',
      actor: 'Marcus Solberg',
      type: 'Fake Badge Farming',
      confidence: 94.5,
      evidence: 'Rapid completion of 5 short-duration mock tasks using simulated non-browser API triggers.',
      status: 'UNDER_REVIEW',
      timestamp: '2026-07-03T18:22:00Z'
    },
    {
      id: 'FRD-CASE-102',
      actor: 'Elin Amundsen',
      type: 'Repeated Fake Reviews',
      confidence: 87.2,
      evidence: 'IP collision matches identical user account profiling for both employer rating input and candidate submissions.',
      status: 'CONFIRMED',
      timestamp: '2026-06-28T09:15:00Z'
    }
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([
    {
      id: 'AUD-B-891',
      timestamp: '2026-07-04T19:00:00Z',
      engineVersion: 'v3',
      triggerEvent: 'Profile verification synchronized',
      affectedBadge: 'Verified Professional',
      previousLevel: 'None',
      newLevel: 'Bronze',
      action: 'AWARD',
      calculationDurationMs: 4.8,
      auditHash: 'SHA256:8f2ea55b11a9cf0'
    },
    {
      id: 'AUD-B-890',
      timestamp: '2026-06-25T11:05:00Z',
      engineVersion: 'v3',
      triggerEvent: 'On-time submission registered',
      affectedBadge: 'Deadline Keeper',
      previousLevel: 'Bronze',
      newLevel: 'Silver',
      action: 'UPGRADE',
      calculationDurationMs: 6.2,
      auditHash: 'SHA256:721a9fe84b901cd'
    }
  ]);

  // Simulation & Sequential Trace states
  const [sequentialLogs, setSequentialLogs] = useState<string[]>([]);
  const [isTracerRunning, setIsTracerRunning] = useState<boolean>(false);
  const [currentTracerLayer, setCurrentTracerLayer] = useState<number>(-1);

  // New manual action trigger form
  const [selectedActionTrigger, setSelectedActionTrigger] = useState<string>('Project Completed');
  const [selectedSpecialBadgeId, setSelectedSpecialBadgeId] = useState<string>('BADGE-SPEC-01');

  // ==========================================
  // BADGE COMPUTATION LOGIC
  // ==========================================

  const compileBadgesList = () => {
    // We build 15 distinct, highly compliant professional badges across categories
    const rawDef: BadgeDef[] = [
      // 1. Professional Performance
      {
        id: 'BADGE-PERF-01',
        name: 'Perfect Performer',
        category: 'Professional Performance',
        level: studentPerformanceScore >= 97 ? 'Legend' : studentPerformanceScore >= 95 ? 'Gold' : 'Bronze',
        description: 'Exceed high-fidelity simulation rating requirements over multiple active workspace modules with zero active disputes.',
        icon: Award,
        requirements: [
          { metricName: 'Performance Score', currentValue: studentPerformanceScore, targetValue: 95 },
          { metricName: 'Consecutive Warning-free projects', currentValue: consecutiveProjectsNoWarning, targetValue: 3 }
        ],
        isLocked: studentPerformanceScore < 95 || consecutiveProjectsNoWarning < 3,
        progressPercent: Math.min(100, Math.round(((studentPerformanceScore / 95) * 50) + ((consecutiveProjectsNoWarning / 3) * 50))),
        confidenceScore: 94,
        visibility: 'Public',
        bonuses: ['+20% Matching Priority Score', '+4 Trust Rating Points'],
        explanation: 'Earned automatically by maintaining high metrics across three consecutive project workspaces without receiving formal warnings.'
      },
      {
        id: 'BADGE-PERF-02',
        name: 'Elite Performer',
        category: 'Professional Performance',
        level: 'Diamond',
        description: 'Demonstrate elite professional standards by completing multiple projects with exceptional review scores.',
        icon: ShieldCheck,
        requirements: [
          { metricName: 'Performance Score', currentValue: studentPerformanceScore, targetValue: 90 },
          { metricName: 'Completed Projects', currentValue: completedProjectsCount, targetValue: 5 }
        ],
        isLocked: studentPerformanceScore < 90 || completedProjectsCount < 5,
        progressPercent: Math.min(100, Math.round(((studentPerformanceScore / 90) * 50) + ((completedProjectsCount / 5) * 50))),
        confidenceScore: 96,
        visibility: 'Public',
        bonuses: ['+15% Direct Talent Matching Boost', 'VIP Employer Direct Message Privileges'],
        explanation: 'Awarded when verified projects count matches 5 or more and performance rating maintains stability above 90%.'
      },
      // 2. Project Excellence
      {
        id: 'BADGE-PROJ-01',
        name: 'Project Finisher',
        category: 'Project Excellence',
        level: completedProjectsCount >= 100 ? 'Legend' : completedProjectsCount >= 25 ? 'Platinum' : completedProjectsCount >= 10 ? 'Gold' : completedProjectsCount >= 1 ? 'Bronze' : 'Bronze',
        description: 'Demonstrate continuous platform execution and complete structured offshore wind or maritime engineering contracts.',
        icon: Briefcase,
        requirements: [
          { metricName: 'Completed Projects', currentValue: completedProjectsCount, targetValue: 1 }
        ],
        isLocked: completedProjectsCount < 1,
        progressPercent: Math.min(100, Math.round((completedProjectsCount / 1) * 100)),
        confidenceScore: 100,
        visibility: 'Public',
        bonuses: ['Unlocks intermediate and advanced project briefs', '+2 Trust Rating Points'],
        explanation: 'Objective milestone tracking. Awarded immediately upon first verified project closure.'
      },
      // 3. Deadline / Reliability Badges
      {
        id: 'BADGE-DL-01',
        name: 'Deadline Keeper',
        category: 'Reliability',
        level: ontimeSubmissionsCount >= 100 ? 'Platinum' : ontimeSubmissionsCount >= 50 ? 'Silver' : 'Bronze',
        description: 'Execute deliverables with impeccable timeline compliance. Late submissions automatically reset or delay progression.',
        icon: Clock,
        requirements: [
          { metricName: 'On-time Submissions', currentValue: ontimeSubmissionsCount, targetValue: 10 }
        ],
        isLocked: ontimeSubmissionsCount < 10,
        progressPercent: Math.min(100, Math.round((ontimeSubmissionsCount / 10) * 100)),
        confidenceScore: 98,
        visibility: 'Public',
        bonuses: ['Highlighted timeline in employer dashboard search lists'],
        explanation: 'Calculated using exact millisecond submission timestamps mapped against scheduled milestones.'
      },
      // 4. Communication Badges
      {
        id: 'BADGE-COMM-01',
        name: 'Responsive Professional',
        category: 'Communication',
        level: avgResponseHours <= 2 ? 'Diamond' : avgResponseHours <= 6 ? 'Gold' : 'Bronze',
        description: 'Maintain rapid response times on active project coordination boards to reassure employer counterparts.',
        icon: MessageSquare,
        requirements: [
          { metricName: 'Average Response Time (Hours)', currentValue: avgResponseHours, targetValue: 6 } // lower is better
        ],
        isLocked: avgResponseHours > 6,
        progressPercent: avgResponseHours <= 6 ? 100 : Math.round((6 / avgResponseHours) * 100),
        confidenceScore: 91,
        visibility: 'Employer Only',
        bonuses: ['+10% Search visibility boost inside hiring channels'],
        explanation: 'Analyzed through active communication channel response latency averages over active sprint schedules.'
      },
      {
        id: 'BADGE-COMM-02',
        name: 'Discussion Leader',
        category: 'Communication',
        level: 'Bronze',
        description: 'Provide exceptional peer review mentorship and support candidate onboarding discussion forums.',
        icon: Users,
        requirements: [
          { metricName: 'Measurable Forum Rep', currentValue: 25, targetValue: 50 }
        ],
        isLocked: true, // Simulated as locked due to previous suspension record
        progressPercent: 50,
        confidenceScore: 89,
        visibility: 'Public',
        bonuses: ['Forum moderator nomination privileges'],
        explanation: 'Subject to continuous moderation checks. Restored after warning cooling-off period completes.'
      },
      // 5. Leadership
      {
        id: 'BADGE-LEAD-01',
        name: 'Community Mentor',
        category: 'Leadership',
        level: 'Gold',
        description: 'Host certified offshore wind simulation tutorial workshops to support onboarding candidates.',
        icon: Lightbulb,
        requirements: [
          { metricName: 'Tutorial Sessions Hosted', currentValue: 4, targetValue: 5 }
        ],
        isLocked: true,
        progressPercent: 80,
        confidenceScore: 92,
        visibility: 'Public',
        bonuses: ['Direct recommendation list inclusion in regional student network panels'],
        explanation: 'Automatically tracked when at least 5 junior candidates log certified attendance validation tokens.'
      },
      // 6. Technical Skills
      {
        id: 'BADGE-TECH-01',
        name: 'AI & Data Specialist',
        category: 'Technical Skills',
        level: 'Diamond',
        description: 'Complete high-complexity data science and hydrodynamic simulation projects with verified output mesh packages.',
        icon: Code,
        requirements: [
          { metricName: 'Verified Skills Models', currentValue: 4, targetValue: 3 }
        ],
        isLocked: false,
        progressPercent: 100,
        confidenceScore: 97,
        visibility: 'Public',
        bonuses: ['Highlighted AI-Badge overlay displayed on public portfolio profile card'],
        explanation: 'Verified automatically via skill test scoring arrays and matching employer endorsements.'
      },
      // 7. Growth
      {
        id: 'BADGE-GROWTH-01',
        name: 'Fast Learner',
        category: 'Growth',
        level: 'Silver',
        description: 'Show consistent metric improvements over subsequent project intervals.',
        icon: TrendingUp,
        requirements: [
          { metricName: 'Performance Growth Delta', currentValue: 12, targetValue: 10 }
        ],
        isLocked: false,
        progressPercent: 100,
        confidenceScore: 90,
        visibility: 'Public',
        bonuses: ['Growth rate indicator badges shown in search overlays'],
        explanation: 'Compares first project baseline against most recent performance scoring loops.'
      },
      // 8. Global Experience
      {
        id: 'BADGE-GLOBAL-01',
        name: 'International Collaborator',
        category: 'Global Experience',
        level: 'Bronze',
        description: 'Collaborate successfully across multiple time zones with overseas partners.',
        icon: Globe,
        requirements: [
          { metricName: 'Collaborating Timezones', currentValue: 1, targetValue: 2 }
        ],
        isLocked: true,
        progressPercent: 50,
        confidenceScore: 95,
        visibility: 'Public',
        bonuses: ['Direct routing preferences inside global contract briefs'],
        explanation: 'Measures geographic distance parameters of active companies cooperating on shared contracts.'
      },
      // 9. Trust
      {
        id: 'BADGE-TRUST-01',
        name: 'Verified Professional',
        category: 'Trust',
        level: 'Bronze',
        description: 'Achieve total validation of identity documents, current university registry data, and verified email.',
        icon: Fingerprint,
        requirements: [
          { metricName: 'Verified Credentials', currentValue: profileVerifiedItems, targetValue: 3 }
        ],
        isLocked: profileVerifiedItems < 3,
        progressPercent: Math.round((profileVerifiedItems / 3) * 100),
        confidenceScore: 100,
        visibility: 'Public',
        bonuses: ['Elite Trust status checkmark overlay', '+10 Trust Score points'],
        explanation: 'Tied to cryptographic validation checks over NTNU and CivicPass registries.'
      },
      {
        id: 'BADGE-TRUST-02',
        name: 'Trusted Professional',
        category: 'Trust',
        level: trustScoreValue >= 95 ? 'Gold' : 'Bronze',
        description: 'Maintain exceptional platform compliance and reputation scoring without active warnings.',
        icon: ShieldCheck,
        requirements: [
          { metricName: 'Trust Score Rating', currentValue: trustScoreValue, targetValue: 90 }
        ],
        isLocked: trustScoreValue < 90,
        progressPercent: Math.min(100, Math.round((trustScoreValue / 90) * 100)),
        confidenceScore: 99,
        visibility: 'Public',
        bonuses: ['+15 Trust Score base bonus multiplier', 'Bypass default moderation review screens'],
        explanation: 'Deterministic evaluation based directly on trust engine outputs.'
      },
      // 10. Hiring
      {
        id: 'BADGE-HIRE-01',
        name: 'Outstanding Hire',
        category: 'Hiring',
        level: 'Bronze',
        description: 'Receive repeat contracts or immediate placement offers following platform simulation closure.',
        icon: UserCheck,
        requirements: [
          { metricName: 'Hiring Offers Registered', currentValue: hiringCount, targetValue: 1 }
        ],
        isLocked: hiringCount < 1,
        progressPercent: Math.min(100, Math.round((hiringCount / 1) * 100)),
        confidenceScore: 100,
        visibility: 'Public',
        bonuses: ['Direct feature option in regional career-connect dashboards'],
        explanation: 'Monitored automatically through verified hiring offer logs signed by employer entities.'
      },
      // 11. Special Recognition (Requires manual action/trigger)
      {
        id: 'BADGE-SPEC-01',
        name: 'Beta Pioneer',
        category: 'Special Recognition',
        level: 'Legend',
        description: 'Exclusive early adopter recognition awarded during platform launch testing phases.',
        icon: Sparkles,
        requirements: [
          { metricName: 'Beta Sign-up Block', currentValue: 1, targetValue: 1 }
        ],
        isLocked: false,
        progressPercent: 100,
        confidenceScore: 100,
        expiresInDays: undefined, // Never expires
        visibility: 'Public',
        bonuses: ['Early-Access system dashboard feature preview access'],
        explanation: 'Manually validated badge representing foundational platform deployment participation.'
      }
    ];

    setBadges(rawDef);
  };

  useEffect(() => {
    compileBadgesList();
  }, [
    studentPerformanceScore,
    consecutiveProjectsNoWarning,
    completedProjectsCount,
    ontimeSubmissionsCount,
    avgResponseHours,
    trustScoreValue,
    profileVerifiedItems,
    hiringCount
  ]);

  // ==========================================
  // SEQUENTIAL TRACE CONTROLLER (8 Layers)
  // ==========================================

  const handleSimulateSequentialCalculation = () => {
    if (isTracerRunning) return;
    setIsTracerRunning(true);
    setSequentialLogs([]);
    setCurrentTracerLayer(1);

    const layers = [
      {
        layer: 1,
        title: 'Layer 1: Identity & Profile Verification Intake',
        desc: 'Validating cryptographic credentials and checking CivicPass + NTNU registrar databases.',
        execute: () => {
          setSequentialLogs(prev => [...prev, `[LAYER 1] Verifying profile linkages: Identity=${isIdentityVerified ? 'CONFIRMED' : 'MISSING'}, University=${isUniversityVerified ? 'CONFIRMED' : 'MISSING'}. Trust factor validated.`]);
        }
      },
      {
        layer: 2,
        title: 'Layer 2: Performance Evaluation Audit',
        desc: 'Retrieving completed milestone metrics. Verification score must exceed 90 without unresolved disputes.',
        execute: () => {
          setSequentialLogs(prev => [...prev, `[LAYER 2] Checking active performance averages: score=${studentPerformanceScore}%, consecutive clear projects=${consecutiveProjectsNoWarning}. Perfect Performer evaluation running.`]);
        }
      },
      {
        layer: 3,
        title: 'Layer 3: Reliable Milestones Chronology Audit',
        desc: 'Analyzing delivery schedules. Late or missed submissions trigger automatic resets to timeline streaks.',
        execute: () => {
          setSequentialLogs(prev => [...prev, `[LAYER 3] Tracking deadline keeping: on-time count=${ontimeSubmissionsCount}. Silver-level upgrade threshold (50) is matched.`]);
        }
      },
      {
        layer: 4,
        title: 'Layer 4: Latency & Communication Sweep',
        desc: 'Sweeping response latency parameters. Average response hours calculated at micro-intervals.',
        execute: () => {
          setSequentialLogs(prev => [...prev, `[LAYER 4] Message logs queried. Average response time = ${avgResponseHours} hours. Gold tier communications badge matched.`]);
        }
      },
      {
        layer: 5,
        title: 'Layer 5: Fraud & Reciprocal Review Protection',
        desc: 'Scanning active fraud review queues. Block progression if the actor has pending reviews.',
        execute: () => {
          const activeFrauds = fraudQueue.filter(f => f.status === 'CONFIRMED').length;
          setSequentialLogs(prev => [...prev, `[LAYER 5] Fraud shielding: Confirmed frauds count=${activeFrauds}. No duplicate reviewers found on eligible projects.`]);
        }
      },
      {
        layer: 6,
        title: 'Layer 6: Badge Upgrades & Progress Delta Calculations',
        desc: 'Mapping current metrics against level milestones (Bronze → Silver → Gold → Platinum → Diamond → Legend).',
        execute: () => {
          setSequentialLogs(prev => [...prev, `[LAYER 6] Dynamic thresholds analyzed. Calculating upgrade pathways for ${badges.length} standard definitions.`]);
        }
      },
      {
        layer: 7,
        title: 'Layer 7: Auto-Award & Multiplier Configuration Binding',
        desc: 'Locking recalculated progression vectors and matching with current engine version configuration.',
        execute: () => {
          compileBadgesList();
          setSequentialLogs(prev => [...prev, `[LAYER 7] State successfully updated under engine SPEC version ${engineVersion}. Matching modifiers compiled successfully.`]);
        }
      },
      {
        layer: 8,
        title: 'Layer 8: Immutable Transaction Journal Commitment',
        desc: 'Writing final transaction block containing SHA256 hashes to secure system audit log ledger.',
        execute: () => {
          const newAudit: AuditRecord = {
            id: `AUD-B-${Math.floor(900 + Math.random() * 99)}`,
            timestamp: new Date().toISOString(),
            engineVersion: engineVersion,
            triggerEvent: selectedActionTrigger,
            affectedBadge: 'All Recalculated Badges',
            previousLevel: 'Bronze',
            newLevel: 'Silver',
            action: 'EVALUATED',
            calculationDurationMs: 5.4,
            auditHash: `SHA256:${Math.random().toString(16).substring(2, 10)}b8901`
          };
          setAuditLogs(prev => [newAudit, ...prev]);
          setSequentialLogs(prev => [...prev, `[LAYER 8] Audit Ledger Block successfully committed. Total recalculation time: 5.4ms.`]);
        }
      }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < layers.length) {
        setCurrentTracerLayer(layers[step].layer);
        layers[step].execute();
        step++;
      } else {
        clearInterval(interval);
        setIsTracerRunning(false);
        setCurrentTracerLayer(-1);
      }
    }, 1000);
  };

  // Trigger event simulation action
  const handleTriggerSimulatedAction = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedActionTrigger === 'Project Completed') {
      setCompletedProjectsCount(prev => prev + 1);
    } else if (selectedActionTrigger === 'Performance Updated') {
      setStudentPerformanceScore(98);
      setConsecutiveProjectsNoWarning(prev => prev + 1);
    } else if (selectedActionTrigger === 'Trust Updated') {
      setTrustScoreValue(99.2);
    } else if (selectedActionTrigger === 'Profile Verified') {
      setProfileVerifiedItems(3);
      setIsIdentityVerified(true);
      setIsUniversityVerified(true);
      setIsProfileVerified(true);
    } else if (selectedActionTrigger === 'Review Submitted') {
      setOntimeSubmissionsCount(prev => prev + 1);
    } else if (selectedActionTrigger === 'Hiring Completed') {
      setHiringCount(prev => prev + 1);
    } else if (selectedActionTrigger === 'Administrator Approval') {
      // Award manual special Beta Pioneer
      const manualRecord: BadgeHistoryRecord = {
        id: `B-HST-${Math.floor(100 + Math.random() * 900)}`,
        badgeId: selectedSpecialBadgeId,
        badgeName: 'Beta Pioneer',
        category: 'Special Recognition',
        level: 'Legend',
        action: 'AWARD',
        reason: 'Manually approved early pilot testing credential clearance.',
        timestamp: new Date().toISOString(),
        evidence: 'CTO cryptographic signature 0x99a22f',
        actor: 'Admin: wanderjay3456@gmail.com',
        version: engineVersion
      };
      setBadgeHistory(prev => [manualRecord, ...prev]);
    }

    handleSimulateSequentialCalculation();
  };

  // Fraud Management Action
  const handleReviewFraudStatus = (id: string, action: 'CONFIRMED' | 'DISMISSED') => {
    setFraudQueue(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status: action };
      }
      return f;
    }));

    if (action === 'CONFIRMED') {
      // Trigger Badge Loss automatically due to fraud compliance rules
      const fraudCase = fraudQueue.find(f => f.id === id);
      const affectedBadge = badges.find(b => b.category === 'Trust') || badges[0];
      
      const newRemoval: BadgeRemovalRecord = {
        id: `RMV-${Math.floor(100 + Math.random() * 900)}`,
        badgeId: affectedBadge.id,
        badgeName: affectedBadge.name,
        reason: 'Repeated Fraud',
        timestamp: new Date().toISOString(),
        administrator: 'Platform Safety Automator',
        details: `Auto-removed badge progression following confirmed flag: ${fraudCase?.type}. Evidence: ${fraudCase?.evidence}`
      };
      setBadgeRemovals(prev => [newRemoval, ...prev]);

      // Add audit log
      const newAudit: AuditRecord = {
        id: `AUD-B-${Math.floor(900 + Math.random() * 99)}`,
        timestamp: new Date().toISOString(),
        engineVersion: engineVersion,
        triggerEvent: 'CONFIRMED_FRAUD_COMPLIANCE',
        affectedBadge: affectedBadge.name,
        previousLevel: affectedBadge.level,
        newLevel: 'None',
        action: 'REMOVAL',
        calculationDurationMs: 3.2,
        auditHash: `SHA256:fraud_removal_${id}`
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      // Penalty effect
      setTrustScoreValue(prev => Math.max(30, prev - 25));
    }
  };

  // Reset Engine States to defaults
  const handleResetSystemState = () => {
    setStudentPerformanceScore(96);
    setConsecutiveProjectsNoWarning(3);
    setCompletedProjectsCount(12);
    setOntimeSubmissionsCount(54);
    setAvgResponseHours(3.8);
    setTrustScoreValue(97.5);
    setProfileVerifiedItems(3);
    setIsIdentityVerified(true);
    setIsUniversityVerified(true);
    setIsProfileVerified(true);
    setHiringCount(2);
    setEngineVersion('v3');
    setAutoAwardEnabled(true);
    setDecayAndExpiryEnabled(true);
    setFraudQueue([
      {
        id: 'FRD-CASE-101',
        actor: 'Marcus Solberg',
        type: 'Fake Badge Farming',
        confidence: 94.5,
        evidence: 'Rapid completion of 5 short-duration mock tasks using simulated non-browser API triggers.',
        status: 'UNDER_REVIEW',
        timestamp: '2026-07-03T18:22:00Z'
      },
      {
        id: 'FRD-CASE-102',
        actor: 'Elin Amundsen',
        type: 'Repeated Fake Reviews',
        confidence: 87.2,
        evidence: 'IP collision matches identical user account profiling for both employer rating input and candidate submissions.',
        status: 'CONFIRMED',
        timestamp: '2026-06-28T09:15:00Z'
      }
    ]);
    setBadgeHistory([
      {
        id: 'B-HST-001',
        badgeId: 'BADGE-TRUST-01',
        badgeName: 'Verified Professional',
        category: 'Trust',
        level: 'Bronze',
        action: 'AWARD',
        reason: 'Achieved 100% profile, university, and identity credentials clearance.',
        timestamp: '2026-05-12T10:14:00Z',
        evidence: 'NTNU API Sync Node #88 + CivicPass Signature 0x7f3e8',
        actor: 'System Evaluator Daemon',
        version: 'v3'
      },
      {
        id: 'B-HST-002',
        badgeId: 'BADGE-PERF-01',
        badgeName: 'Perfect Performer',
        category: 'Professional Performance',
        level: 'Gold',
        action: 'AWARD',
        reason: 'Exceeded performance rating of 95 on 3 consecutive enterprise simulations.',
        timestamp: '2026-06-20T14:30:00Z',
        evidence: 'Milestone sweeps index PRJ-992, PRJ-1012, PRJ-1044',
        actor: 'System Evaluator Daemon',
        version: 'v3'
      },
      {
        id: 'B-HST-003',
        badgeId: 'BADGE-DL-01',
        badgeName: 'Deadline Keeper',
        category: 'Reliability',
        level: 'Silver',
        action: 'UPGRADE',
        reason: 'Maintained zero delays on 50 consecutive professional milestones.',
        timestamp: '2026-06-25T11:05:00Z',
        evidence: 'On-time delivery log checklist count: 54/54',
        actor: 'System Evaluator Daemon',
        version: 'v3'
      }
    ]);
    setBadgeRemovals([
      {
        id: 'RMV-901',
        badgeId: 'BADGE-COMM-02',
        badgeName: 'Discussion Leader',
        reason: 'Repeated Suspension',
        timestamp: '2026-04-18T16:00:00Z',
        administrator: 'Siri Nilsen (Trust Lead)',
        details: 'Flagged by moderation pipeline for repeatedly pushing duplicate AI comments into peer workspace. Temporarily suspended forum level privileges.'
      }
    ]);
    setAuditLogs([
      {
        id: 'AUD-B-891',
        timestamp: '2026-07-04T19:00:00Z',
        engineVersion: 'v3',
        triggerEvent: 'Profile verification synchronized',
        affectedBadge: 'Verified Professional',
        previousLevel: 'None',
        newLevel: 'Bronze',
        action: 'AWARD',
        calculationDurationMs: 4.8,
        auditHash: 'SHA256:8f2ea55b11a9cf0'
      },
      {
        id: 'AUD-B-890',
        timestamp: '2026-06-25T11:05:00Z',
        engineVersion: 'v3',
        triggerEvent: 'On-time submission registered',
        affectedBadge: 'Deadline Keeper',
        previousLevel: 'Bronze',
        newLevel: 'Silver',
        action: 'UPGRADE',
        calculationDurationMs: 6.2,
        auditHash: 'SHA256:721a9fe84b901cd'
      }
    ]);
    compileBadgesList();
  };

  // Level Styling helpers
  const getLevelColorClasses = (level: BadgeLevel) => {
    switch (level) {
      case 'Bronze':
        return 'from-amber-700/20 to-amber-900/10 text-amber-500 border-amber-600/30';
      case 'Silver':
        return 'from-slate-400/10 to-slate-500/5 text-slate-300 border-slate-400/20';
      case 'Gold':
        return 'from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30';
      case 'Platinum':
        return 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30';
      case 'Diamond':
        return 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30';
      case 'Legend':
        return 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30 animate-pulse';
      default:
        return 'from-neutral-800 to-neutral-900 text-neutral-400 border-neutral-700';
    }
  };

  // Filtered badges computations
  const filteredBadges = badges.filter(badge => {
    const matchesCategory = categoryFilter === 'All' || badge.category === categoryFilter;
    const matchesLevel = levelFilter === 'All' || badge.level === levelFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Earned' && !badge.isLocked) ||
      (statusFilter === 'Locked' && badge.isLocked);
    const matchesQuery =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesStatus && matchesQuery;
  });

  const earnedBadgesCount = badges.filter(b => !b.isLocked).length;

  // Radar chart data based on earned count per category
  const categoriesList: BadgeCategory[] = [
    'Professional Performance',
    'Project Excellence',
    'Communication',
    'Reliability',
    'Leadership',
    'Technical Skills',
    'Growth',
    'Community',
    'Global Experience',
    'Trust',
    'Hiring',
    'Special Recognition'
  ];

  const radarChartData = categoriesList.map(cat => {
    const totalInCategory = badges.filter(b => b.category === cat).length;
    const earnedInCategory = badges.filter(b => b.category === cat && !b.isLocked).length;
    return {
      name: cat.replace('Professional ', '').replace('Excellence', 'Exc'),
      value: totalInCategory > 0 ? Math.round((earnedInCategory / totalInCategory) * 100) : 0
    };
  });

  // Recent earning history for visual trends
  const trendHistoryData = [
    { month: 'Jan 2026', Badges: 1 },
    { month: 'Feb 2026', Badges: 2 },
    { month: 'Mar 2026', Badges: 4 },
    { month: 'Apr 2026', Badges: 5 },
    { month: 'May 2026', Badges: 7 },
    { month: 'Jun 2026', Badges: earnedBadgesCount }
  ];

  return (
    <div id="badge-engine-container" className="space-y-6">
      {/* Brand Header */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-rose-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Award className="w-5 h-5 animate-bounce" />
            </div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Gamification Engine SPEC 6.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gamified Badge & Professional Recognition Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Automatically calculates, grades, and upgrades credential badges representing objective platform behavior. Avoids manual administrator manipulation to preserve high portfolio integrity.
          </p>
        </div>
        
        <div className="flex gap-2.5 shrink-0 relative z-10 font-mono text-xs">
          <button
            onClick={handleResetSystemState}
            className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 hover:text-white transition flex items-center gap-2 text-neutral-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Badge Database</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Earned Badges */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Verified Earned Badges</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white font-mono">{earnedBadgesCount}</h3>
              <span className="text-neutral-500 font-mono text-xs">/ {badges.length} Unlocked</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
              REPUTATION HIGH
            </span>
            <span className="text-[10px] font-mono text-neutral-500">v{engineVersion.toUpperCase()} active</span>
          </div>
        </div>

        {/* Highest Active Badge level */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Highest Level Attained</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-rose-400 font-mono">Legend</h3>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 leading-tight pt-2 font-mono">
            Early Adopter Beta Pioneer badge locked at Legend tier. Expiry: Never.
          </p>
        </div>

        {/* Pending Security Reviews */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Farming Protection Shield</span>
            <div className="flex items-center gap-3">
              <h3 className={`text-3xl font-bold font-mono ${fraudQueue.some(f => f.status === 'UNDER_REVIEW') ? 'text-amber-400' : 'text-neutral-400'}`}>
                {fraudQueue.filter(f => f.status === 'UNDER_REVIEW').length}
              </h3>
              <span className="text-neutral-600 font-mono">/</span>
              <h3 className={`text-3xl font-bold font-mono ${fraudQueue.some(f => f.status === 'CONFIRMED') ? 'text-rose-400' : 'text-neutral-400'}`}>
                {fraudQueue.filter(f => f.status === 'CONFIRMED').length}
              </h3>
            </div>
          </div>
          <div className="text-[9px] font-mono text-neutral-400 flex justify-between pt-2 border-t border-neutral-900">
            <span>Pending Audits</span>
            <span>Confirmed Abuses</span>
          </div>
        </div>

        {/* Next Tier target progress */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Upgrades Pipeline</span>
            <div className="flex items-baseline gap-2 pt-1.5">
              <h3 className="text-xl font-bold text-teal-400 font-mono">Perfect Performer</h3>
            </div>
          </div>
          <div className="text-[9px] font-mono text-neutral-500 flex justify-between pt-2 border-t border-neutral-900">
            <span>Next Level: Gold</span>
            <span className="text-teal-400">92% Progress</span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'gallery', label: 'Badge Card Gallery', icon: Award },
          { id: 'simulator', label: 'Event Flow Simulator', icon: Play },
          { id: 'config', label: 'Engine Weights Rules', icon: Sliders },
          { id: 'fraud', label: 'Abuse Protection Queue', icon: ShieldAlert },
          { id: 'audit', label: 'Immutable Audit Trail', icon: History },
          { id: 'tech_docs', label: 'Technical Docs Spec', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-neutral-900 text-white border border-neutral-850 shadow-md'
                  : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {/* TAB 1: GALLERY */}
        {activeSubTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radar coverage breakdown (Left) */}
              <div className="lg:col-span-5 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Badge Coverage Breakdown</span>
                
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                      <PolarGrid stroke="#262626" />
                      <PolarAngleAxis dataKey="name" stroke="#737373" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#404040" />
                      <Radar name="Coverage" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 bg-purple-950/10 border border-purple-900/20 rounded-2xl flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                  <p className="text-[11px] text-neutral-300 font-mono leading-relaxed">
                    Unverified accounts or profiles showing suspicious reviews are frozen. Professional verified indicators boost search priority by <span className="text-purple-400 font-bold">1.5x</span>.
                  </p>
                </div>
              </div>

              {/* Monthly earning timeline (Right) */}
              <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Credentials Earning Trend</span>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendHistoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="month" stroke="#737373" fontSize={10} />
                      <YAxis stroke="#737373" fontSize={10} domain={[0, 12]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff' }} />
                      <Line type="monotone" dataKey="Badges" stroke="#a855f7" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ stroke: '#a855f7', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Direct info note */}
                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-center justify-between font-mono text-xs text-neutral-400">
                  <span>Pending Upgrade: Perfect Performer Gold Tier</span>
                  <span className="text-teal-400 font-bold">Needs 1 warning-free project</span>
                </div>
              </div>
            </div>

            {/* Filters bar */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                {/* Search query */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search badges by name, criteria, or bonus..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                {/* Level selection */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-500">Tier:</span>
                  {(['All', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-xl border font-bold transition ${
                        levelFilter === lvl
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-md'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:bg-neutral-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories selection */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-900 font-mono text-[10px]">
                <span className="text-neutral-500 uppercase font-bold text-xs shrink-0 mr-1">Categories:</span>
                <button
                  onClick={() => setCategoryFilter('All')}
                  className={`px-2.5 py-1 rounded-xl border transition ${
                    categoryFilter === 'All'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:bg-neutral-850'
                  }`}
                >
                  ALL CATEGORIES
                </button>
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-xl border transition ${
                      categoryFilter === cat
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:bg-neutral-850'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBadges.map((badge, idx) => {
                const BadgeIcon = badge.icon;
                const badgeLevelClass = getLevelColorClasses(badge.level);
                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-3xl bg-neutral-950 border transition-all flex flex-col justify-between h-96 relative overflow-hidden group ${
                      badge.isLocked ? 'border-neutral-900/60 opacity-60' : 'border-neutral-900 hover:border-neutral-800 shadow-xl'
                    }`}
                  >
                    {/* Gradient background effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${badgeLevelClass} opacity-5 group-hover:opacity-10 pointer-events-none transition-all`} />

                    {/* Ribbon header */}
                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">
                          {badge.category}
                        </span>
                        <h4 className="text-base font-bold text-white tracking-tight">{badge.name}</h4>
                      </div>

                      {/* Level Tag icon */}
                      <div className={`p-2.5 rounded-2xl bg-gradient-to-br border font-bold text-xs uppercase font-mono ${badgeLevelClass}`}>
                        <BadgeIcon className="w-5 h-5 mb-0.5" />
                        <span className="text-[8px] block text-center leading-none mt-1">{badge.level}</span>
                      </div>
                    </div>

                    {/* Body/Description */}
                    <p className="text-xs text-neutral-400 leading-relaxed relative z-10 pt-4">
                      {badge.description}
                    </p>

                    {/* Requirements / Criteria */}
                    <div className="space-y-2 relative z-10 pt-4">
                      <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                        <span>Evaluation Progression</span>
                        <span>{badge.progressPercent}%</span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>

                      {/* Criteria specific lines */}
                      <div className="space-y-1">
                        {badge.requirements.map((req, rIdx) => {
                          const isMet = req.currentValue >= req.targetValue;
                          return (
                            <div key={rIdx} className="flex justify-between items-center text-[9px] font-mono">
                              <span className="text-neutral-500 truncate max-w-[180px]">{req.metricName}</span>
                              <span className={isMet ? 'text-emerald-400' : 'text-neutral-400'}>
                                {req.currentValue} / {req.targetValue} {isMet ? '✔' : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exp/Vis & Bonus Ribbon */}
                    <div className="pt-4 border-t border-neutral-900 flex items-center justify-between font-mono text-[9px] relative z-10">
                      <div className="text-neutral-500 space-y-0.5">
                        <span className="block">Visibility: <span className="text-neutral-300 font-bold">{badge.visibility}</span></span>
                        <span className="block">Expiry: <span className="text-neutral-300">{badge.expiresInDays ? `${badge.expiresInDays} Days` : 'Never'}</span></span>
                      </div>

                      {/* Bonuses summary preview */}
                      <div className="text-right">
                        <span className="text-teal-400 font-bold block">Active Perks</span>
                        <span className="text-[8px] text-neutral-500 truncate block max-w-[150px]">
                          {badge.bonuses[0]}
                        </span>
                      </div>
                    </div>

                    {/* Locker Layer overlay for locked items */}
                    {badge.isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center gap-2 z-20 font-mono text-xs">
                        <Lock className="w-5 h-5 text-neutral-500" />
                        <span className="text-neutral-400 uppercase font-bold tracking-widest text-[10px]">Locked Badge</span>
                        <span className="text-[9px] text-neutral-500 max-w-[200px] text-center leading-normal px-4">
                          Complete matching evaluation criteria to activate this professional credential.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 2: SIMULATOR */}
        {activeSubTab === 'simulator' && (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Simulation Controller Form (Left) */}
            <div className="lg:col-span-5 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Trigger Platform Behavior Event</span>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Trigger a micro-transactional behavior evaluation. This test mimics real-time background cron jobs scanning student metrics.
              </p>

              <form onSubmit={handleTriggerSimulatedAction} className="space-y-4 font-mono text-xs">
                {/* Event Select */}
                <div className="space-y-1.5">
                  <label className="text-neutral-400">Platform Event Selection</label>
                  <select
                    value={selectedActionTrigger}
                    onChange={e => setSelectedActionTrigger(e.target.value)}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Project Completed">Project Completed (+1 Completed Project)</option>
                    <option value="Performance Updated">Performance Rating Updated (Set to 98% + warning streak)</option>
                    <option value="Trust Updated">Identity / Trust Rating Increased (Trust score to 99.2)</option>
                    <option value="Profile Verified">Profile Clearance Approved (Set all 3 verified items)</option>
                    <option value="Review Submitted">On-time Milestone Submission (+1 Deliverable registered)</option>
                    <option value="Hiring Completed">Hiring Placement Closed (+1 Offers counted)</option>
                    <option value="Administrator Approval">Special Badge Awarded (Beta Pioneer manually)</option>
                  </select>
                </div>

                {/* Additional inputs based on selection */}
                {selectedActionTrigger === 'Administrator Approval' && (
                  <div className="space-y-1.5 p-3 bg-neutral-900 border border-neutral-850 rounded-2xl">
                    <label className="text-[10px] text-neutral-500 uppercase font-bold block">Special Badge Select</label>
                    <select
                      value={selectedSpecialBadgeId}
                      onChange={e => setSelectedSpecialBadgeId(e.target.value)}
                      className="w-full p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300"
                    >
                      <option value="BADGE-SPEC-01">Beta Pioneer (Requires Admin clearance)</option>
                    </select>
                  </div>
                )}

                {/* Live Metrics Monitoring Dashboard */}
                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-3">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block border-b border-neutral-800 pb-1.5">
                    Live Telemetry Parameters (Recalculation Inputs)
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <span className="text-neutral-500 block">Performance Score:</span>
                      <span className="text-white font-bold">{studentPerformanceScore}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Consecutive Warn-free:</span>
                      <span className="text-white font-bold">{consecutiveProjectsNoWarning} projects</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Completed Projects:</span>
                      <span className="text-white font-bold">{completedProjectsCount} projects</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">On-time Submissions:</span>
                      <span className="text-white font-bold">{ontimeSubmissionsCount} items</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Avg Response Time:</span>
                      <span className="text-white font-bold">{avgResponseHours} hrs</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Trust Score Value:</span>
                      <span className="text-white font-bold">{trustScoreValue} pts</span>
                    </div>
                  </div>
                </div>

                {/* Manual Trigger Button */}
                <button
                  type="submit"
                  disabled={isTracerRunning}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition flex items-center justify-center gap-2 disabled:bg-purple-600/40"
                >
                  {isTracerRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running Analysis...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Trigger Event recalculation</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sequential Trace Console Logs (Right - 8 Layers) */}
            <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between h-[450px]">
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">8-Layer Badge Trace Controller</span>
                    <span className="text-[10px] text-neutral-500">Deterministic loop-by-loop background audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isTracerRunning ? 'bg-purple-400 animate-pulse' : 'bg-neutral-800'}`} />
                    <span className="text-[10px] font-mono text-neutral-500">{isTracerRunning ? 'Sweeping Database' : 'Idle'}</span>
                  </div>
                </div>

                {/* Logs Screen */}
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-850 h-[300px] overflow-y-auto font-mono text-[11px] space-y-1.5 scrollbar-thin">
                  {sequentialLogs.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-neutral-500 text-xs">
                      <Terminal className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
                      <span>Console idle. Trigger an event to stream calculations.</span>
                    </div>
                  ) : (
                    sequentialLogs.map((log, idx) => (
                      <div key={idx} className="p-2 bg-black/30 border-l-2 border-purple-500 rounded text-neutral-300">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Step indicator visual dots */}
              <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(layerNum => (
                    <div
                      key={layerNum}
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                        currentTracerLayer === layerNum
                          ? 'bg-purple-500 text-white border-purple-400 animate-bounce'
                          : currentTracerLayer > layerNum
                          ? 'bg-neutral-800 text-purple-400 border-neutral-700'
                          : 'bg-neutral-900 text-neutral-600 border-neutral-850'
                      }`}
                    >
                      {layerNum}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-500">Execution Timeout Target: &lt;15ms</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CONFIG */}
        {activeSubTab === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Matching Engine & Reputation Modifiers Settings (Left) */}
            <div className="lg:col-span-6 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Reputation matching Multipliers</span>
              
              <div className="space-y-4 font-mono text-xs">
                {Object.entries(bonusesConfig.matchingMultiplier).map(([lvl, mult]) => (
                  <div key={lvl} className="p-3.5 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">{lvl} Tier Bonus</span>
                      <span className="text-[10px] text-neutral-500">Search ranking and algorithmic placement multiplier boost</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        value={mult}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setBonusesConfig(prev => ({
                            ...prev,
                            matchingMultiplier: { ...prev.matchingMultiplier, [lvl]: val }
                          }));
                        }}
                        className="w-16 p-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-bold text-center"
                      />
                      <span className="text-neutral-400">x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Expiry, Policy Decay settings (Right) */}
            <div className="lg:col-span-6 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Automator Orchestration Policies</span>

              <div className="space-y-5 font-mono text-xs">
                {/* Toggle 1: Auto award */}
                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="text-white font-bold block">Enable Continuous Cron-Sweeper Evaluation</span>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      Runs automatic cron-checks across active databases every 15 minutes to award or upgrade eligible badges.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoAwardEnabled(!autoAwardEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                      autoAwardEnabled ? 'bg-purple-600' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        autoAwardEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Decay & Expiry */}
                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="text-white font-bold block">Enforce Active Contributor Decay Rate</span>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      Expired activities reduce badge levels after specified thresholds. Perfect Performer and Responsive Professional decay over a 90-day cycle.
                    </p>
                  </div>
                  <button
                    onClick={() => setDecayAndExpiryEnabled(!decayAndExpiryEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                      decayAndExpiryEnabled ? 'bg-purple-600' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        decayAndExpiryEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Engine selection */}
                <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-3">
                  <span className="text-white font-bold block">Engine Evaluation Model Version</span>
                  
                  <div className="flex gap-2">
                    {(['v1', 'v2', 'v3'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setEngineVersion(v)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono border transition ${
                          engineVersion === v
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:bg-neutral-850'
                        }`}
                      >
                        SPEC {v.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                    {engineVersion === 'v3' && 'v3: Supports fraud protection shielding, automated decay cycles, dynamic upgrades, and detailed metadata records.'}
                    {engineVersion === 'v2' && 'v2: Linear progression scoring. Ignores forum or community contribution metrics.'}
                    {engineVersion === 'v1' && 'v1: Deprecated manual-only or basic profile verified badges (Basic logic).'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: FRAUD */}
        {activeSubTab === 'fraud' && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Warning bar */}
            <div className="p-5 bg-rose-950/15 border border-rose-900/40 rounded-3xl flex items-start gap-4">
              <BadgeAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1 font-mono text-xs">
                <span className="text-rose-400 font-bold block">Farming & Collusion Policy Shield Active</span>
                <p className="text-neutral-400 leading-relaxed">
                  The Badge Engine actively analyzes review IP hashes, submission velocities, and duplicate profile signatures. Progression on badges is suspended automatically for candidates undergoing active investigations.
                </p>
              </div>
            </div>

            {/* List of active queue items */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <div className="flex justify-between items-center font-mono text-xs border-b border-neutral-900 pb-3">
                <span className="text-neutral-400 uppercase font-bold">Pending Security investigations queue</span>
                <span className="text-neutral-500">{fraudQueue.filter(f => f.status === 'UNDER_REVIEW').length} cases pending</span>
              </div>

              <div className="space-y-3">
                {fraudQueue.map((item, idx) => (
                  <div key={idx} className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.status === 'CONFIRMED' ? 'bg-rose-500' : 'bg-yellow-500'}`} />
                        <span className="text-white font-bold">{item.actor}</span>
                        <span className="text-neutral-500 text-[10px]">({item.timestamp.slice(0, 10)})</span>
                      </div>

                      <div className="text-[10px] text-rose-400 font-bold">
                        Type: {item.type} | Risk confidence: {item.confidence}%
                      </div>

                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {item.evidence}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {item.status === 'UNDER_REVIEW' ? (
                        <>
                          <button
                            onClick={() => handleReviewFraudStatus(item.id, 'CONFIRMED')}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-[11px] font-bold transition flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Confirm Abuse</span>
                          </button>
                          <button
                            onClick={() => handleReviewFraudStatus(item.id, 'DISMISSED')}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700 text-[11px] font-bold transition flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Dismiss Case</span>
                          </button>
                        </>
                      ) : (
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          item.status === 'CONFIRMED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge removal logs */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Historical Badge Removal Archive</span>
              <p className="text-[11px] text-neutral-500 font-mono">
                Immutable record of manually or system-removed badges representing historical suspensions. Required for database audit compliance.
              </p>

              <div className="space-y-2">
                {badgeRemovals.map((item, idx) => (
                  <div key={idx} className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl font-mono text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-neutral-400 text-[10px]">
                      <span>Badge Name: <span className="text-white font-bold">{item.badgeName}</span></span>
                      <span>{item.timestamp.replace('T', ' ').slice(0, 19)}</span>
                    </div>

                    <div className="text-[10px] text-rose-400 font-bold">
                      Reason: {item.reason} | Administrator: {item.administrator}
                    </div>

                    <p className="text-[11px] text-neutral-500 leading-normal">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: AUDIT */}
        {activeSubTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 font-mono text-xs"
          >
            {/* Audit metrics */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold block">System Transaction Audit Ledger</span>
                  <span className="text-[10px] text-neutral-500">Includes secure SHA256 block hashes</span>
                </div>
                <span className="text-[10px] text-neutral-500">{auditLogs.length} logged events</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-neutral-400 text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-500 text-[10px] uppercase">
                      <th className="py-2.5">Audit ID</th>
                      <th>Timestamp</th>
                      <th>Trigger Event</th>
                      <th>Affected Badge</th>
                      <th>Progression Delta</th>
                      <th>Action</th>
                      <th>Engine Spec</th>
                      <th>Duration</th>
                      <th className="text-right">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="border-b border-neutral-900/60 hover:bg-neutral-900/20 transition-colors">
                        <td className="py-3 text-neutral-300 font-bold">{log.id}</td>
                        <td>{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                        <td className="max-w-[150px] truncate">{log.triggerEvent}</td>
                        <td>{log.affectedBadge}</td>
                        <td>{log.previousLevel} → {log.newLevel}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            log.action === 'AWARD' ? 'bg-emerald-500/10 text-emerald-400' :
                            log.action === 'UPGRADE' ? 'bg-purple-500/10 text-purple-400' :
                            log.action === 'REMOVAL' ? 'bg-rose-500/10 text-rose-400' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td>SPEC {log.engineVersion.toUpperCase()}</td>
                        <td>{log.calculationDurationMs}ms</td>
                        <td className="text-right text-teal-400 text-[10px]">{log.auditHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historical Upgrade Ledger */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold block">Immutable Badge History Records</span>
              <p className="text-[11px] text-neutral-500">
                Maintains a comprehensive profile log of all earned badges. Upgrade history is persistent and is never overwritten to assure portfolio audits.
              </p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {badgeHistory.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-bold">{rec.badgeName} ({rec.level})</span>
                        <span className="text-[10px] text-neutral-500">[{rec.category}]</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">{rec.reason}</p>
                      <div className="text-[10px] text-neutral-500">
                        Cryptographic Evidence: <span className="text-teal-400">{rec.evidence}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block">{rec.timestamp.slice(0, 10)}</span>
                      <span className="text-[9px] text-neutral-500 block">Actor: {rec.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: TECH DOCS */}
        {activeSubTab === 'tech_docs' && (
          <motion.div
            key="tech_docs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-neutral-950 border border-neutral-900 rounded-3xl font-mono text-xs space-y-6"
          >
            <div className="border-b border-neutral-900 pb-4 space-y-1">
              <span className="text-purple-400 font-bold block uppercase text-[10px] tracking-widest">Architecture Blueprint Spec 6.0</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Badge Engine Architecture Specs & Mathematical Rules</h3>
            </div>

            {/* Section 1: DB schema representation */}
            <div className="space-y-2">
              <span className="text-white font-bold uppercase text-[11px] block text-purple-400">1. Database Schema Specifications</span>
              <pre className="p-4 bg-neutral-900 rounded-2xl text-neutral-300 text-[10px] overflow-x-auto scrollbar-thin">
{`CREATE TABLE platform_badges (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    default_level VARCHAR(32) DEFAULT 'Bronze',
    description TEXT,
    expires_in_days INT,
    is_revocable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_earned_badges (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    badge_id VARCHAR(64) REFERENCES platform_badges(id),
    current_level VARCHAR(32) NOT NULL,
    progress_percent DECIMAL(5,2) DEFAULT 0.00,
    confidence_score INT DEFAULT 100,
    is_locked BOOLEAN DEFAULT TRUE,
    visibility VARCHAR(32) DEFAULT 'Public',
    expiration_date TIMESTAMP,
    evidence_reference TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE badge_recalculation_audit_log (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    trigger_event VARCHAR(255) NOT NULL,
    previous_level VARCHAR(32),
    new_level VARCHAR(32),
    duration_ms DECIMAL(8,2),
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </pre>
            </div>

            {/* Section 2: Mathematical rules */}
            <div className="space-y-2">
              <span className="text-white font-bold uppercase text-[11px] block text-purple-400">2. Business & Progression Evaluation Formulas</span>
              <div className="p-4 bg-neutral-900 rounded-2xl space-y-3 leading-relaxed text-neutral-400">
                <p>
                  <strong className="text-white">Rule 1: Progress Increment Formula (P)</strong><br />
                  Badge Progress percentage is calculated deterministically per category. For example, for Performance Badges:<br />
                  <code className="text-teal-400 bg-black/40 px-1.5 py-0.5 rounded text-[10px]">P = Min(100, ((PerformanceScore / TargetScore) * 50) + ((ConsecutiveClearProjects / TargetStreak) * 50))</code>
                </p>
                <p>
                  <strong className="text-white">Rule 2: Automated Level Upgrade Pathways (L)</strong><br />
                  Once <code className="text-teal-400 font-bold font-mono">P = 100%</code>, the engine issues a database trigger promoting the badge level:
                  <br />
                  <code className="text-purple-400 bg-black/40 px-1.5 py-0.5 rounded text-[10px]">Bronze (P &ge; 100) &rarr; Silver (P_req &ge; 50) &rarr; Gold (P_req &ge; 100)</code>
                </p>
                <p>
                  <strong className="text-white">Rule 3: Decoupled Fraud Protection & Warning Constraints</strong><br />
                  Badges representing reliability or trust (e.g. Perfect Performer, Reliable Partner) verify that <code className="text-rose-400 font-bold font-mono">UnresolvedWarnings = 0</code>. Any confirmed fraud flag locks the tier at <code className="text-neutral-500 bg-black/40 px-1.5 py-0.5 rounded text-[10px]">L = None</code> and clears progression values.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
