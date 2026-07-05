import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
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
  BarChart2
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

// ==========================================
// INTERFACES & DEFINITIONS
// ==========================================

export interface TrustCategoryWeights {
  verification: number;
  professionalReliability: number;
  projectReliability: number;
  communicationReliability: number;
  behaviorConduct: number;
  performanceReliability: number;
  communityContribution: number;
  riskCompliance: number;
}

export interface TrustEvent {
  id: string;
  timestamp: string;
  eventType: string;
  category: keyof TrustCategoryWeights | 'bonus' | 'penalty';
  actor: string;
  source: string;
  evidence: string;
  weightDelta: number;
  isCritical: boolean;
  version: string;
  reason: string;
  status: 'VERIFIED' | 'UNVERIFIED';
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  algorithmVersion: 'v1' | 'v2' | 'v3';
  triggerEvent: string;
  previousScore: number;
  newScore: number;
  delta: number;
  appliedBonuses: string[];
  appliedPenalties: string[];
  decayApplied: boolean;
  recoveryApplied: boolean;
  calculationDurationMs: number;
  evidenceReference: string;
}

export interface FraudAlert {
  id: string;
  timestamp: string;
  type: 'RECIPROCAL_REVIEWS' | 'ARTIFICIAL_INFLATION' | 'DUPLICATE_ACCOUNTS' | 'TRUST_FARMING' | 'IDENTITY_MANIPULATION';
  actor: string;
  confidence: number;
  details: string;
  evidence: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'DISMISSED';
}

// Initial Configuration defaults
const INITIAL_WEIGHTS: TrustCategoryWeights = {
  verification: 15,
  professionalReliability: 25,
  projectReliability: 20,
  communicationReliability: 10,
  behaviorConduct: 10,
  performanceReliability: 10,
  communityContribution: 5,
  riskCompliance: 5
};

const INITIAL_DECAY_POLICIES = [
  { daysMin: 0, daysMax: 90, influence: 100, label: 'Recent Active' },
  { daysMin: 91, daysMax: 180, influence: 90, label: 'Moderate' },
  { daysMin: 181, daysMax: 365, influence: 75, label: 'Older' },
  { daysMin: 366, daysMax: 730, influence: 60, label: 'Historical' },
  { daysMin: 731, daysMax: 9999, influence: 40, label: 'Archived' }
];

// Initial events for simulation history
const INITIAL_EVENTS: TrustEvent[] = [
  {
    id: 'TR-EVT-001',
    timestamp: '2026-01-10T10:00:00Z',
    eventType: 'Identity Verified',
    category: 'verification',
    actor: 'Nora Lindqvist',
    source: 'CivicPass Government ID Integration',
    evidence: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    weightDelta: 15,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Verified National Identity Card',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-002',
    timestamp: '2026-01-11T14:30:00Z',
    eventType: 'University Verification Approved',
    category: 'verification',
    actor: 'Nora Lindqvist',
    source: 'NTNU Trondheim Registrar API',
    evidence: 'Academic Record Match ID: NTNU-2026-NL',
    weightDelta: 15,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Confirmed current enrollment in MSc Marine Technology',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-003',
    timestamp: '2026-02-15T18:00:00Z',
    eventType: 'Email & Phone Confirmed',
    category: 'verification',
    actor: 'Nora Lindqvist',
    source: 'Twilio & Firebase Auth SDK',
    evidence: 'Verified OTP Match +47 902 44 XXX',
    weightDelta: 20,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Two-factor secure authentication credentials linked',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-004',
    timestamp: '2026-03-20T17:00:00Z',
    eventType: 'Project Successfully Completed',
    category: 'professionalReliability',
    actor: 'Nora Lindqvist',
    source: 'Milestone Automator Worker',
    evidence: 'Project ID: PRJ-OFF-01. Final review score 4.9/5',
    weightDelta: 25,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Delivered offshore wind turbine simulation model on time',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-005',
    timestamp: '2026-04-10T09:15:00Z',
    eventType: 'Outstanding Review Recipient',
    category: 'performanceReliability',
    actor: 'Nora Lindqvist',
    source: 'Equinor Review Pipeline',
    evidence: '100% Peer & Employer satisfaction comments on collaboration',
    weightDelta: 10,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Rated exceptionally high on technical competence and integrity',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-006',
    timestamp: '2026-05-02T12:00:00Z',
    eventType: 'Missed Weekly Milestone Deliverable',
    category: 'projectReliability',
    actor: 'Nora Lindqvist',
    source: 'Weekly Submission Sweep Daemon',
    evidence: 'Week 4 Submission missed by 48 hours without prior warning',
    weightDelta: -8,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Deliverable received after deadline threshold expired',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-007',
    timestamp: '2026-06-15T16:40:00Z',
    eventType: 'Mentoring Session Hosted',
    category: 'communityContribution',
    actor: 'Nora Lindqvist',
    source: 'Konexa Mentorship Hub',
    evidence: '3 younger students validated 1.5-hour workshop attendance',
    weightDelta: 5,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Conducted introduction session to hydrodynamic analysis models',
    status: 'VERIFIED'
  },
  {
    id: 'TR-EVT-008',
    timestamp: '2026-06-28T08:30:00Z',
    eventType: 'Verified Warning Issued',
    category: 'behaviorConduct',
    actor: 'Nora Lindqvist',
    source: 'Trust & Safety Moderator System',
    evidence: 'Confirmed absence from scheduled client synch without notice',
    weightDelta: -15,
    isCritical: false,
    version: 'v3.0.0',
    reason: 'Unexcused absence on critical offshore project launch meeting',
    status: 'VERIFIED'
  }
];

export default function TrustScoreEngineWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'simulator' | 'timeline' | 'policies' | 'fraud'>('dashboard');

  // Interactive configurations
  const [weights, setWeights] = useState<TrustCategoryWeights>(INITIAL_WEIGHTS);
  const [decayPolicies, setDecayPolicies] = useState(INITIAL_DECAY_POLICIES);
  const [maxMonthlyRecovery, setMaxMonthlyRecovery] = useState<number>(5.5);
  const [maxBonusScore, setMaxBonusScore] = useState<number>(10);
  const [freezeOnCriticalViolations, setFreezeOnCriticalViolations] = useState<boolean>(true);
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2' | 'v3'>('v3');

  // Simulated State Values
  const [events, setEvents] = useState<TrustEvent[]>(INITIAL_EVENTS);
  const [trustScore, setTrustScore] = useState<number>(88.42);
  const [trustGrade, setTrustGrade] = useState<string>('Trusted');
  const [trustConfidence, setTrustConfidence] = useState<number>(92.0);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  // Fraud flag lists
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([
    {
      id: 'FRD-1092',
      timestamp: '2026-07-01T15:12:00Z',
      type: 'RECIPROCAL_REVIEWS',
      actor: 'Student Nora Lindqvist & Employer HydroTech',
      confidence: 88.5,
      details: 'Evaluator HydroTech and Student Nora Lindqvist recorded reciprocal 5-star feedback evaluations within 14 seconds of mutual workspace closures.',
      evidence: 'Matched IP routes via proxies + matching browser footprint profiles.',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'FRD-1093',
      timestamp: '2026-06-15T09:33:00Z',
      type: 'IDENTITY_MANIPULATION',
      actor: 'Candidate John Doe',
      confidence: 96.2,
      details: 'Uploaded Certificate verification checksum matches an active record allocated to another platform identity.',
      evidence: 'MD5 Hash collision with CERT-94112.',
      status: 'CONFIRMED'
    }
  ]);

  // Calculations Trace for Simulator
  const [tracerLogs, setTracerLogs] = useState<string[]>([]);
  const [tracerIsRunning, setTracerIsRunning] = useState<boolean>(false);
  const [currentTracerLayer, setCurrentTracerLayer] = useState<number>(-1);

  // Form states for adding custom simulated event
  const [newEvType, setNewEvType] = useState<string>('Project Successfully Completed');
  const [newEvCategory, setNewEvCategory] = useState<keyof TrustCategoryWeights | 'bonus' | 'penalty'>('projectReliability');
  const [newEvDelta, setNewEvDelta] = useState<number>(20);
  const [newEvEvidence, setNewEvEvidence] = useState<string>('Deliverable approved with sha256:7f4c581');
  const [newEvReason, setNewEvReason] = useState<string>('On-time final delivery of oceanography visualization dashboard');
  const [newEvIsCritical, setNewEvIsCritical] = useState<boolean>(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([
    {
      id: 'AUD-001',
      timestamp: '2026-06-28T08:31:00Z',
      algorithmVersion: 'v3',
      triggerEvent: 'Verified Warning Issued',
      previousScore: 94.22,
      newScore: 88.42,
      delta: -5.80,
      appliedBonuses: ['Email Verified', 'Identity Verified'],
      appliedPenalties: ['Missed Weekly Milestone', 'Verified Warning Issued'],
      decayApplied: true,
      recoveryApplied: false,
      calculationDurationMs: 14.5,
      evidenceReference: 'Unexcused absence on critical offshore project launch meeting'
    },
    {
      id: 'AUD-002',
      timestamp: '2026-06-15T16:41:00Z',
      algorithmVersion: 'v3',
      triggerEvent: 'Mentoring Session Hosted',
      previousScore: 93.12,
      newScore: 94.22,
      delta: 1.10,
      appliedBonuses: ['Mentoring Session Hosted', 'Identity Verified'],
      appliedPenalties: ['Missed Weekly Milestone'],
      decayApplied: true,
      recoveryApplied: true,
      calculationDurationMs: 12.2,
      evidenceReference: 'Conducted introduction session to hydrodynamic analysis models'
    }
  ]);

  // ==========================================
  // MATHEMATICAL CALCULATION ENGINE
  // ==========================================

  // Recalculates scores based on the current events, configuration and algorithm version
  const performTrustCalculation = (triggerName: string, customEventsList?: TrustEvent[]) => {
    const list = customEventsList || events;
    const startCalculationsTime = performance.now();

    // 1. Calculate Verification Category Score
    const verificationEvents = list.filter(e => e.category === 'verification' && e.status === 'VERIFIED');
    let baseVerification = 0;
    verificationEvents.forEach(e => {
      baseVerification += Math.abs(e.weightDelta);
    });
    const verificationSubScore = Math.min(100, baseVerification);

    // 2. Professional Reliability (25%)
    // Complete/Started ratio. Let's simulate counts from historical events
    const completed = list.filter(e => e.eventType.includes('Completed') && e.status === 'VERIFIED').length + 3;
    const cancelled = list.filter(e => e.eventType.includes('Cancelled') && e.status === 'VERIFIED').length;
    const abandoned = list.filter(e => e.eventType.includes('Abandoned') && e.status === 'VERIFIED').length;
    const started = completed + cancelled + abandoned + 1; // standard count offset
    const professionalReliabilitySubScore = started > 0 ? (completed / started) * 100 : 80;

    // 3. Project Reliability (20%)
    // Milestone completions, deliveries, deadlines
    const missedMilestones = list.filter(e => e.eventType.includes('Missed') && e.status === 'VERIFIED').length;
    const projectReliabilitySubScore = Math.max(0, 100 - missedMilestones * 12);

    // 4. Communication Reliability (10%)
    // Meeting attendance, response, quality
    const lateResponses = list.filter(e => e.eventType.includes('Late') && e.status === 'VERIFIED').length;
    const communicationSubScore = Math.max(0, 95 - lateResponses * 15);

    // 5. Behavior & Conduct (10%)
    const behaviorWarnings = list.filter(e => e.eventType.includes('Warning') && e.status === 'VERIFIED').length;
    const behaviorConductSubScore = Math.max(0, 100 - behaviorWarnings * 15);

    // 6. Performance Reliability (10%)
    const excellentReviews = list.filter(e => e.eventType.includes('Outstanding') || e.eventType.includes('Excellent')).length;
    const performanceSubScore = Math.min(100, 75 + excellentReviews * 10);

    // 7. Community Contribution (5%)
    const communityContributions = list.filter(e => e.category === 'communityContribution' && e.status === 'VERIFIED').length;
    const communitySubScore = Math.min(100, communityContributions * 25);

    // 8. Risk & Compliance (5%)
    const confirmedFrauds = fraudAlerts.filter(a => a.status === 'CONFIRMED').length;
    const riskSubScore = Math.max(0, 100 - confirmedFrauds * 40);

    // Category Weighted Summation
    const categoryContribution =
      (verificationSubScore * (weights.verification / 100)) +
      (professionalReliabilitySubScore * (weights.professionalReliability / 100)) +
      (projectReliabilitySubScore * (weights.projectReliability / 100)) +
      (communicationSubScore * (weights.communicationReliability / 100)) +
      (behaviorConductSubScore * (weights.behaviorConduct / 100)) +
      (performanceSubScore * (weights.performanceReliability / 100)) +
      (communitySubScore * (weights.communityContribution / 100)) +
      (riskSubScore * (weights.riskCompliance / 100));

    // Apply positive and negative event adjustments with Decay
    let eventModifications = 0;
    const appliedBonusesList: string[] = [];
    const appliedPenaltiesList: string[] = [];

    list.forEach(e => {
      // Calculate age of event in days (simulated timestamp offsets)
      const eventDate = new Date(e.timestamp);
      const currentDate = new Date('2026-07-04T19:26:00Z');
      const diffTime = Math.abs(currentDate.getTime() - eventDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate decay influence percentage
      let decayFactor = 1.0;
      if (!e.isCritical) {
        const matchingPolicy = decayPolicies.find(p => diffDays >= p.daysMin && diffDays <= p.daysMax);
        decayFactor = matchingPolicy ? (matchingPolicy.influence / 100) : 1.0;
      }

      const activeDelta = e.weightDelta * decayFactor;

      if (e.weightDelta > 0) {
        eventModifications += activeDelta;
        appliedBonusesList.push(`${e.eventType} (+${activeDelta.toFixed(1)})`);
      } else {
        eventModifications += activeDelta; // negative
        appliedPenaltiesList.push(`${e.eventType} (${activeDelta.toFixed(1)})`);
      }
    });

    // Bonuses adjustment
    const bonusCap = maxBonusScore;
    const finalEventDelta = eventModifications > 0 ? Math.min(bonusCap, eventModifications) : eventModifications;

    // Slower Trust Recovery calculations (simulated +0.2 trust per on-time project step)
    const completedOnTime = list.filter(e => e.eventType === 'Project Successfully Completed').length;
    const recoveryAppliedValue = Math.min(maxMonthlyRecovery, completedOnTime * 1.5);

    // Apply Versioning algorithm differences
    let finalScore = categoryContribution;
    if (selectedVersion === 'v3') {
      finalScore = categoryContribution + finalEventDelta + recoveryAppliedValue;
    } else if (selectedVersion === 'v2') {
      finalScore = categoryContribution * 0.9 + finalEventDelta;
    } else {
      // Old deprecated v1 calculation - ignores decay and recovery
      finalScore = categoryContribution;
    }

    // Clamp score
    const clampedScore = Number(Math.max(0, Math.min(100, finalScore)).toFixed(2));

    // Trust Grade translation
    let grade = 'Developing';
    if (clampedScore >= 98) grade = 'Exceptional Trust';
    else if (clampedScore >= 95) grade = 'Elite Professional';
    else if (clampedScore >= 90) grade = 'Highly Trusted';
    else if (clampedScore >= 85) grade = 'Trusted';
    else if (clampedScore >= 80) grade = 'Reliable';
    else if (clampedScore >= 70) grade = 'Developing';
    else if (clampedScore >= 60) grade = 'Needs Improvement';
    else if (clampedScore >= 40) grade = 'High Risk';
    else grade = 'Restricted';

    // Trust Confidence calculation (0 to 100 based on counts)
    const verificationFactor = verificationEvents.length / 8; // out of 8 possible methods
    const experienceFactor = Math.min(1, completed / 5);
    const calculatedConfidence = Math.min(100, Math.round(50 + verificationFactor * 25 + experienceFactor * 25));

    // Dynamic Frozen state based on critical violations
    const hasCriticalUnresolved = list.some(e => e.isCritical && e.weightDelta < 0);
    const frozenState = freezeOnCriticalViolations && hasCriticalUnresolved;

    // Save states
    setTrustScore(clampedScore);
    setTrustGrade(grade);
    setTrustConfidence(calculatedConfidence);
    setIsFrozen(frozenState);

    const calcDuration = parseFloat((performance.now() - startCalculationsTime).toFixed(2));

    // Write audit log if triggered manually
    if (triggerName !== 'INITIAL_LOAD') {
      const newAudit: AuditRecord = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        algorithmVersion: selectedVersion,
        triggerEvent: triggerName,
        previousScore: trustScore,
        newScore: clampedScore,
        delta: parseFloat((clampedScore - trustScore).toFixed(2)),
        appliedBonuses: appliedBonusesList.slice(0, 3),
        appliedPenalties: appliedPenaltiesList.slice(0, 3),
        decayApplied: decayPolicies.some(p => p.influence < 100),
        recoveryApplied: recoveryAppliedValue > 0,
        calculationDurationMs: calcDuration,
        evidenceReference: triggerName + ' trigger event'
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }

    return { clampedScore, grade, calculatedConfidence, frozenState };
  };

  // Run initial calculation
  useEffect(() => {
    performTrustCalculation('INITIAL_LOAD');
  }, [weights, decayPolicies, maxMonthlyRecovery, maxBonusScore, selectedVersion, events]);

  // ==========================================
  // SEQUENTIAL TRACE CONTROLLER (8 Layers)
  // ==========================================

  const handleSimulateSequentialCalculation = () => {
    if (tracerIsRunning) return;
    setTracerIsRunning(true);
    setTracerLogs([]);
    setCurrentTracerLayer(1);

    const layerSteps = [
      {
        layer: 1,
        title: 'Layer 1: Verified Events Intake',
        desc: 'Extracting secure timeline events from verified cryptographic endpoints, filtering out unverified reports or hearsay.',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 1] Intake matching: ${events.length} immutable records fetched successfully. 100% telemetry verified.`]);
        }
      },
      {
        layer: 2,
        title: 'Layer 2: Trust Event Classification',
        desc: 'Classifying event inputs across the 8 distinct trust dimensions. Identifying positive behaviors vs negative flags.',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 2] Segregating events: ${events.filter(e => e.weightDelta > 0).length} positive, ${events.filter(e => e.weightDelta < 0).length} negative.`]);
        }
      },
      {
        layer: 3,
        title: 'Layer 3: Positive & Negative Calculation',
        desc: 'Calculating core category scores using weighted models: Verification (15%), Pro (25%), Project (20%), Comm (10%), Conduct (10%), Performance (10%), Contribution (5%), Risk (5%).',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 3] Weighted base score computed using algorithm [${selectedVersion}] mapping.`]);
        }
      },
      {
        layer: 4,
        title: 'Layer 4: Decay & Recovery Engine Evaluation',
        desc: 'Applying temporal decay factors to historical events. Evaluating on-time milestones to inject slow trust recovery increments.',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 4] Applying decay constraints. Events older than 90 days scaled to lower priority weights.`]);
        }
      },
      {
        layer: 5,
        title: 'Layer 5: Trust Stability Analysis',
        desc: 'Performing standard deviation variance checks across 30, 90, and 180-day intervals to map trust trends.',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 5] Trust stability assessed as "Stable" with minimal quarterly deviation (<4%).`]);
        }
      },
      {
        layer: 6,
        title: 'Layer 6: Trust Confidence Scoring',
        desc: 'Measuring confidence based on the diversity of employer reviews, completed milestones, and level of linked identity verification.',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 6] Score confidence is verified at ${trustConfidence}% based on NTNU and CivicPass registries.`]);
        }
      },
      {
        layer: 7,
        title: 'Layer 7: Final Trust Score Integration',
        desc: 'Executing final mathematical capping (0-100), rounding to 2 decimal places, and mapping the presenter grade.',
        execute: () => {
          const result = performTrustCalculation('Event Stream Simulator');
          setTracerLogs(prev => [...prev, `[LAYER 7] Calculation completed. Target Trust Score: ${result.clampedScore} (${result.grade}).`]);
        }
      },
      {
        layer: 8,
        title: 'Layer 8: Historical Snapshot Archival',
        desc: 'Pushing immutable ledger block containing score state, deltas, and execution metadata to the system ledger audit pipeline.',
        execute: () => {
          setTracerLogs(prev => [...prev, `[LAYER 8] Immutable audit trail block committed securely. Duration: 14.5ms.`]);
        }
      }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < layerSteps.length) {
        setCurrentTracerLayer(layerSteps[step].layer);
        layerSteps[step].execute();
        step++;
      } else {
        clearInterval(interval);
        setTracerIsRunning(false);
        setCurrentTracerLayer(-1);
      }
    }, 1200);
  };

  // Trigger simulated event submission
  const handleAddSimulatedEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: TrustEvent = {
      id: `TR-EVT-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      eventType: newEvType,
      category: newEvCategory,
      actor: 'Nora Lindqvist',
      source: 'Simulator Action Trigger',
      evidence: newEvEvidence,
      weightDelta: Number(newEvDelta),
      isCritical: newEvIsCritical,
      version: 'v3.0.0',
      reason: newEvReason,
      status: 'VERIFIED'
    };

    const updatedList = [newEvent, ...events];
    setEvents(updatedList);
    performTrustCalculation(newEvType, updatedList);
    
    // Auto initiate tracer run to show how the database recalculated it!
    handleSimulateSequentialCalculation();
  };

  // Fraud Flag Handlers
  const handleReviewFraudAlert = (id: string, action: 'CONFIRMED' | 'DISMISSED') => {
    setFraudAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: action };
      }
      return a;
    }));

    if (action === 'CONFIRMED') {
      // Add behavior conduct deduction
      const penaltyEvent: TrustEvent = {
        id: `TR-EVT-FRD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString(),
        eventType: 'Confirmed Fraudulent Behavior',
        category: 'riskCompliance',
        actor: 'Nora Lindqvist',
        source: 'Chief Trust Officer Verification',
        evidence: `Confirmed fraud link: ${id}`,
        weightDelta: -40,
        isCritical: true,
        version: 'v3.0.0',
        reason: 'Verified reciprocal review farming or identity manipulation',
        status: 'VERIFIED'
      };
      const updated = [penaltyEvent, ...events];
      setEvents(updated);
      performTrustCalculation('Confirmed Fraud Flag', updated);
    } else {
      performTrustCalculation('Dismissed Fraud Flag', events);
    }
  };

  // Reset simulation to standard state
  const handleResetSimulationState = () => {
    setEvents(INITIAL_EVENTS);
    setWeights(INITIAL_WEIGHTS);
    setDecayPolicies(INITIAL_DECAY_POLICIES);
    setMaxMonthlyRecovery(5.5);
    setMaxBonusScore(10);
    setFraudAlerts([
      {
        id: 'FRD-1092',
        timestamp: '2026-07-01T15:12:00Z',
        type: 'RECIPROCAL_REVIEWS',
        actor: 'Student Nora Lindqvist & Employer HydroTech',
        confidence: 88.5,
        details: 'Evaluator HydroTech and Student Nora Lindqvist recorded reciprocal 5-star feedback evaluations within 14 seconds of mutual workspace closures.',
        evidence: 'Matched IP routes via proxies + matching browser footprint profiles.',
        status: 'PENDING_REVIEW'
      },
      {
        id: 'FRD-1093',
        timestamp: '2026-06-15T09:33:00Z',
        type: 'IDENTITY_MANIPULATION',
        actor: 'Candidate John Doe',
        confidence: 96.2,
        details: 'Uploaded Certificate verification checksum matches an active record allocated to another platform identity.',
        evidence: 'MD5 Hash collision with CERT-94112.',
        status: 'CONFIRMED'
      }
    ]);
    setSelectedVersion('v3');
    performTrustCalculation('System Reset', INITIAL_EVENTS);
  };

  // Helper colors
  const getGradeBadgeStyles = (g: string) => {
    switch (g) {
      case 'Exceptional Trust': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Elite Professional': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'Highly Trusted': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Trusted': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'Reliable': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'Developing': return 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';
      case 'Needs Improvement': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'High Risk': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse';
      default: return 'bg-neutral-800 text-neutral-400 border border-neutral-700';
    }
  };

  // Suggest improvement steps
  const getImprovementSuggestions = () => {
    const list: string[] = [];
    const warningCount = events.filter(e => e.eventType.includes('Warning')).length;
    const missedMilestone = events.filter(e => e.eventType.includes('Missed')).length;
    const isIdentityVerified = events.some(e => e.eventType === 'Identity Verified');

    if (!isIdentityVerified) {
      list.push('Complete Government ID Identity Verification to secure instant +15 trust points.');
    }
    if (missedMilestone > 0) {
      list.push('Achieve a consecutive 10-milestone on-time submission streak to recover project reliability.');
    }
    if (warningCount > 0) {
      list.push('Complete 2 professional projects without client warnings to fulfill behavior recovery requirements.');
    }
    if (list.length === 0) {
      list.push('Maintain consistent communication and mentor other platform candidates to achieve Exceptional Trust grade.');
    }
    return list;
  };

  // Category values for visual breakdown
  const categoryChartData = [
    { name: 'Verification', value: events.filter(e => e.category === 'verification').length > 0 ? 95 : 50, weight: weights.verification },
    { name: 'Pro Reliab', value: 85, weight: weights.professionalReliability },
    { name: 'Proj Reliab', value: events.some(e => e.eventType.includes('Missed')) ? 76 : 100, weight: weights.projectReliability },
    { name: 'Comm Reliab', value: 92, weight: weights.communicationReliability },
    { name: 'Conduct', value: events.some(e => e.eventType.includes('Warning')) ? 70 : 100, weight: weights.behaviorConduct },
    { name: 'Perf Reliab', value: 90, weight: weights.performanceReliability },
    { name: 'Contribution', value: events.some(e => e.category === 'communityContribution') ? 80 : 20, weight: weights.communityContribution },
    { name: 'Risk', value: fraudAlerts.some(a => a.status === 'CONFIRMED') ? 60 : 100, weight: weights.riskCompliance }
  ];

  // Historical performance line data (6 months)
  const scoreHistoryData = [
    { month: 'Jan 2026', Score: 72.5 },
    { month: 'Feb 2026', Score: 81.0 },
    { month: 'Mar 2026', Score: 89.2 },
    { month: 'Apr 2026', Score: 92.5 },
    { month: 'May 2026', Score: 90.1 },
    { month: 'Jun 2026', Score: 88.42 },
    { month: 'Jul 2026 (Forecast)', Score: trustScore }
  ];

  // Forecast data (30, 90, 180, 365 Days)
  const forecastData = [
    { target: '30 Days Out', expected: Math.min(100, trustScore + 1.2), pessimistic: Math.max(0, trustScore - 4.5), label: 'Requires no missed milestones' },
    { target: '90 Days Out', expected: Math.min(100, trustScore + 3.8), pessimistic: Math.max(0, trustScore - 12.0), label: 'With consistent 5-star client ratings' },
    { target: '180 Days Out', expected: Math.min(100, trustScore + 6.5), pessimistic: Math.max(0, trustScore - 22.0), label: 'Includes community contributions' },
    { target: '365 Days Out', expected: Math.min(100, trustScore + 10.0), pessimistic: Math.max(0, trustScore - 35.0), label: 'Maximum professional reliability tier' }
  ];

  return (
    <div id="trust-score-engine-container" className="space-y-6">
      {/* Brand Header */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Evaluation Engine SPEC 4.0</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Trust Score & Professional Reputational Engine</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            A strictly auditable, deterministic, and version-isolated score representing verified platform compliance. It is not a popularity metric. It guarantees evidence-backed integrity assessments for all participants.
          </p>
        </div>
        
        <div className="flex gap-2.5 shrink-0 relative z-10 font-mono text-xs">
          <button
            onClick={handleResetSimulationState}
            className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 hover:text-white transition flex items-center gap-2 text-neutral-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database State</span>
          </button>
        </div>
      </div>

      {/* Main Stats Header Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Core Trust Score */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Clamped Trust Score</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white font-mono">{trustScore.toFixed(2)}</h3>
              <span className="text-neutral-500 font-mono text-xs">/100</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase font-mono ${getGradeBadgeStyles(trustGrade)}`}>
              {trustGrade}
            </span>
            {isFrozen && (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase animate-pulse">
                STATE FROZEN
              </span>
            )}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Calculation Confidence</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-teal-400 font-mono">{trustConfidence}%</h3>
              <span className="text-neutral-500 font-mono text-xs">Verified</span>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 leading-tight pt-2">
            Based on multi-source review diversity, academic NTNU credential linkage, and secure verification.
          </p>
        </div>

        {/* Active Warning Indicators */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Active Warnings & Violations</span>
            <div className="flex items-center gap-3">
              <h3 className={`text-3xl font-bold font-mono ${events.some(e => e.eventType.includes('Warning')) ? 'text-amber-400' : 'text-neutral-400'}`}>
                {events.filter(e => e.eventType.includes('Warning')).length}
              </h3>
              <span className="text-neutral-600 font-mono">/</span>
              <h3 className={`text-3xl font-bold font-mono ${fraudAlerts.some(a => a.status === 'CONFIRMED') ? 'text-rose-400 animate-pulse' : 'text-neutral-400'}`}>
                {fraudAlerts.filter(a => a.status === 'CONFIRMED').length}
              </h3>
            </div>
          </div>
          <div className="text-[9px] font-mono text-neutral-400 flex justify-between pt-2 border-t border-neutral-900">
            <span>Warnings Active</span>
            <span>Confirmed Frauds</span>
          </div>
        </div>

        {/* Engine Version Selection */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Active Engine Version</span>
            <div className="flex gap-1.5 pt-1.5">
              {(['v1', 'v2', 'v3'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVersion(v)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold font-mono border transition ${
                    selectedVersion === v
                      ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-md'
                      : 'bg-neutral-900 text-neutral-500 border-neutral-850 hover:bg-neutral-800'
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-neutral-500 leading-none pt-2 font-mono">
            {selectedVersion === 'v3' && 'v3: Weighted + Temporal Decay + Slow Recovery'}
            {selectedVersion === 'v2' && 'v2: Linear scaling + Active modifiers only'}
            {selectedVersion === 'v1' && 'v1: Legacy raw categories (No Decay)'}
          </p>
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-neutral-900 bg-neutral-950/30 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: 'dashboard', label: 'Score Analysis & Breakdown', icon: BarChart2 },
          { id: 'simulator', label: 'Sequential Execution Simulator', icon: Play },
          { id: 'timeline', label: 'Immutable Audit Ledger', icon: History },
          { id: 'policies', label: 'Orchestrator Weight Policies', icon: Sliders },
          { id: 'fraud', label: 'Security & Fraud Shield', icon: ShieldAlert }
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

      {/* Main Tab views */}
      <AnimatePresence mode="wait">
        {/* TAB 1: DASHBOARD */}
        {activeSubTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Visual Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category Breakdown radar chart (Left) */}
              <div className="lg:col-span-5 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Category Metrics Mapping</span>
                  <span className="text-[10px] font-mono text-neutral-500">Evaluated out of 100</span>
                </div>
                
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={categoryChartData}>
                      <PolarGrid stroke="#262626" />
                      <PolarAngleAxis dataKey="name" stroke="#737373" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#404040" />
                      <Radar name="Score" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Weights Distribution Summary</span>
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
                    {Object.entries(weights).map(([cat, w]) => (
                      <div key={cat} className="p-2 bg-neutral-900 border border-neutral-850 rounded-xl text-center">
                        <span className="text-neutral-500 block truncate">{cat.replace('Reliability', '')}</span>
                        <span className="text-white font-bold">{w}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Historical Performance Chart (Right) */}
              <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Historical Trust Score Timeline</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-teal-400">Deterministic Core Loop</span>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreHistoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="month" stroke="#737373" fontSize={10} />
                      <YAxis stroke="#737373" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff' }} />
                      <Line type="monotone" dataKey="Score" stroke="#14b8a6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ stroke: '#14b8a6', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Suggestions Box */}
                <div className="p-4 bg-teal-950/15 border border-teal-900/40 rounded-2xl">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Chief Trust Officer Recalculation Suggestions</span>
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-300 font-mono list-disc pl-4 leading-relaxed">
                    {getImprovementSuggestions().map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section: Trust Forecast & Positive/Negative Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Trust Forecast Map */}
              <div className="lg:col-span-5 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Temporal Trust Forecast</span>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Predicts future score scenarios using moving-average momentum and slow recovery constraints. Informational only.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  {forecastData.map((f, idx) => (
                    <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">{f.target}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold font-mono">+{f.expected.toFixed(1)} Exp</span>
                          <span className="text-neutral-600">|</span>
                          <span className="text-rose-400 font-mono">-{f.pessimistic.toFixed(1)} Risk</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-400">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Verified Timeline Events list */}
              <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Verified Event Log Database</span>
                  <span className="text-[10px] font-mono text-neutral-500">{events.length} logs verified</span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {events.map((e, idx) => {
                    const isPositive = e.weightDelta >= 0;
                    return (
                      <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 rounded-2xl flex items-start justify-between gap-4 font-mono text-xs hover:border-neutral-700 transition">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {isPositive ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span className="font-bold text-white">{e.eventType}</span>
                            <span className="text-[10px] text-neutral-500">({e.category})</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-normal">{e.reason}</p>
                          <div className="text-[10px] text-neutral-500">
                            Evidence: <span className="text-teal-400">{e.evidence}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {isPositive ? '+' : ''}{e.weightDelta} Delta
                          </span>
                          <span className="text-[9px] text-neutral-500 block">{e.timestamp.slice(0, 10)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: STREAM SIMULATOR */}
        {activeSubTab === 'simulator' && (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Event Emission Controller Form (Left) */}
            <div className="lg:col-span-5 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Emit Real-time Platform Events</span>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Trigger a micro-transactional recalculation. This tests how layer-by-layer filters isolate, decay, and evaluate scores in sequence.
              </p>

              <form onSubmit={handleAddSimulatedEvent} className="space-y-4 font-mono text-xs">
                {/* Event Preset Select */}
                <div className="space-y-1.5">
                  <label className="text-neutral-400">Event Preset Action</label>
                  <select
                    value={newEvType}
                    onChange={e => {
                      setNewEvType(e.target.value);
                      // Auto populate reasonable delta and categories
                      if (e.target.value === 'Identity Verified') {
                        setNewEvCategory('verification');
                        setNewEvDelta(15);
                        setNewEvIsCritical(false);
                      } else if (e.target.value === 'Project Successfully Completed') {
                        setNewEvCategory('projectReliability');
                        setNewEvDelta(20);
                        setNewEvIsCritical(false);
                      } else if (e.target.value === 'Verified Warning Issued') {
                        setNewEvCategory('behaviorConduct');
                        setNewEvDelta(-15);
                        setNewEvIsCritical(false);
                      } else if (e.target.value === 'Severe Violation: Identity Theft') {
                        setNewEvCategory('riskCompliance');
                        setNewEvDelta(-40);
                        setNewEvIsCritical(true);
                      } else if (e.target.value === 'Outstanding Employer Review') {
                        setNewEvCategory('performanceReliability');
                        setNewEvDelta(10);
                        setNewEvIsCritical(false);
                      }
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Project Successfully Completed">Project Completed (+20 Project)</option>
                    <option value="Identity Verified">Identity Verified (+15 Verification)</option>
                    <option value="Outstanding Employer Review">Outstanding Review (+10 Performance)</option>
                    <option value="Verified Warning Issued">Verified Warning Issued (-15 Conduct)</option>
                    <option value="Severe Violation: Identity Theft">Severe Violation: Identity Theft (-40 Risk - CRITICAL)</option>
                  </select>
                </div>

                {/* Weights input */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Target Category</label>
                    <select
                      value={newEvCategory}
                      onChange={e => setNewEvCategory(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      {Object.keys(weights).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Weight Delta</label>
                    <input
                      type="number"
                      value={newEvDelta}
                      onChange={e => setNewEvDelta(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Evidence and Reason */}
                <div className="space-y-1.5">
                  <label className="text-neutral-400">Supporting Evidence reference</label>
                  <input
                    type="text"
                    value={newEvEvidence}
                    onChange={e => setNewEvEvidence(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400">Action Explanatory context</label>
                  <textarea
                    value={newEvReason}
                    onChange={e => setNewEvReason(e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                {/* Critical violation checkbox */}
                <div className="flex items-center gap-2 p-1">
                  <input
                    type="checkbox"
                    id="is-crit-check"
                    checked={newEvIsCritical}
                    onChange={e => setNewEvIsCritical(e.target.checked)}
                    className="rounded border-neutral-800 text-teal-500 focus:ring-0"
                  />
                  <label htmlFor="is-crit-check" className="text-neutral-400 text-[11px] cursor-pointer selection:bg-transparent">
                    Critical violation (Never decays fully, freezes trust score update flow)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={tracerIsRunning}
                  className="w-full py-3 rounded-2xl bg-teal-500 text-black font-bold uppercase hover:bg-teal-400 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Emit and Calculate</span>
                </button>
              </form>
            </div>

            {/* Layer execution Tracer representation (Right) */}
            <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">8-Layer Calculation Trace</span>
                  <p className="text-[10px] text-neutral-500">Live system execution tracker for trust calculation requests</p>
                </div>
                <button
                  onClick={handleSimulateSequentialCalculation}
                  disabled={tracerIsRunning}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 transition text-[11px] font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${tracerIsRunning ? 'animate-spin' : ''}`} />
                  <span>Force Trace Playback</span>
                </button>
              </div>

              {/* Layer grid tracing visuals */}
              <div className="space-y-3">
                {[
                  { l: 1, name: 'Layer 1: Verified Events Intake', icon: Database },
                  { l: 2, name: 'Layer 2: Trust Event Classification', icon: Layers },
                  { l: 3, name: 'Layer 3: Positive & Negative Calculation', icon: Sliders },
                  { l: 4, name: 'Layer 4: Decay & Recovery Engine', icon: Clock },
                  { l: 5, name: 'Layer 5: Trust Stability Analysis', icon: Activity },
                  { l: 6, name: 'Layer 6: Trust Confidence Assessment', icon: Sparkles },
                  { l: 7, name: 'Layer 7: Final Score & Clamping', icon: ShieldCheck },
                  { l: 8, name: 'Layer 8: Historical Snapshot Archive', icon: Lock }
                ].map((layerItem) => {
                  const isActive = currentTracerLayer === layerItem.l;
                  const isDone = currentTracerLayer > layerItem.l || currentTracerLayer === -1;
                  const LayerIcon = layerItem.icon;
                  return (
                    <div
                      key={layerItem.l}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 font-mono text-xs flex items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-teal-950/20 border-teal-500/50 shadow-md shadow-teal-500/5'
                          : isDone
                          ? 'bg-neutral-900/60 border-neutral-850 opacity-85'
                          : 'bg-neutral-950/20 border-neutral-900 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-xl border ${isActive ? 'bg-teal-500/15 text-teal-400 border-teal-500/30' : 'bg-neutral-850 text-neutral-500 border-neutral-800'}`}>
                          <LayerIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`font-bold block ${isActive ? 'text-teal-400' : 'text-neutral-200'}`}>
                            {layerItem.name}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isActive ? (
                          <span className="text-[10px] bg-teal-400 text-black px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                            Processing
                          </span>
                        ) : isDone ? (
                          <span className="text-emerald-400 text-[11px] font-bold">✓ Verified</span>
                        ) : (
                          <span className="text-neutral-600 text-[11px]">Queued</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Logger feed output */}
              <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-2xl space-y-1 text-[11px] font-mono text-neutral-400 h-28 overflow-y-auto">
                <span className="text-[9px] text-neutral-600 block uppercase font-bold border-b border-neutral-900 pb-1">Calculation Trace Console output</span>
                {tracerLogs.length > 0 ? (
                  tracerLogs.map((log, i) => <div key={i} className="leading-relaxed">{log}</div>)
                ) : (
                  <div className="text-neutral-600 text-center pt-3">Initiate simulation or playback to stream logs...</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: AUDIT TIMELINE */}
        {activeSubTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Audit metrics and explanation */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-2.5">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold block">Immutable Trust Audit Ledger Records</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                In compliance with SPEC 4.0 audits, trust score recalculations are recorded dynamically with algorithm version hashes. No administrator can delete or overwrite ledger entries.
              </p>
            </div>

            {/* Audit log Table */}
            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 uppercase text-[9px]">
                    <th className="pb-3">Audit ID</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Trigger Action</th>
                    <th className="pb-3">Ver</th>
                    <th className="pb-3 text-right">Prev Score</th>
                    <th className="pb-3 text-right">New Score</th>
                    <th className="pb-3 text-right">Score Delta</th>
                    <th className="pb-3 text-right">Calculation Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {auditLogs.map((log) => {
                    const isPositive = log.delta >= 0;
                    return (
                      <tr key={log.id} className="hover:bg-neutral-900/30 transition text-neutral-300">
                        <td className="py-3 text-neutral-500">{log.id}</td>
                        <td className="py-3">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                        <td className="py-3 font-semibold text-white">{log.triggerEvent}</td>
                        <td className="py-3 text-teal-400 font-bold">{log.algorithmVersion}</td>
                        <td className="py-3 text-right text-neutral-500">{log.previousScore.toFixed(2)}</td>
                        <td className="py-3 text-right text-white font-bold">{log.newScore.toFixed(2)}</td>
                        <td className={`py-3 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{log.delta.toFixed(2)}
                        </td>
                        <td className="py-3 text-right text-neutral-500">{log.calculationDurationMs} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 4: WEIGHT POLICIES CONFIG */}
        {activeSubTab === 'policies' && (
          <motion.div
            key="policies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Weight sliders (Left) */}
            <div className="lg:col-span-7 p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Trust Categories Weights Distribution</span>
                <span className="text-[11px] text-teal-400 font-mono font-bold">
                  Sum total: {
                    weights.verification +
                    weights.professionalReliability +
                    weights.projectReliability +
                    weights.communicationReliability +
                    weights.behaviorConduct +
                    weights.performanceReliability +
                    weights.communityContribution +
                    weights.riskCompliance
                  }%
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {Object.entries(weights).map(([category, value]) => (
                  <div key={category} className="space-y-1.5 p-3.5 bg-neutral-900 border border-neutral-850 rounded-2xl">
                    <div className="flex justify-between text-neutral-200">
                      <span className="capitalize font-bold">{category.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-teal-400 font-bold">{value}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={value}
                        onChange={e => {
                          const updated = { ...weights, [category]: Number(e.target.value) };
                          setWeights(updated);
                        }}
                        className="w-full h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decay and recovery variables (Right) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Decay tiers parameters */}
              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Temporal Decay Configuration Tiers</span>
                <div className="space-y-2.5 font-mono text-xs">
                  {decayPolicies.map((p, idx) => (
                    <div key={idx} className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold">{p.label} Window</span>
                        <p className="text-[10px] text-neutral-500">{p.daysMin === 731 ? 'Older than 2 years' : `${p.daysMin} to ${p.daysMax} days`}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={p.influence}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setDecayPolicies(prev => prev.map((item, i) => i === idx ? { ...item, influence: val } : item));
                          }}
                          className="w-14 bg-neutral-950 border border-neutral-800 rounded-lg text-center p-1.5 text-white font-bold"
                        />
                        <span className="text-neutral-500">% weight</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recovery limits settings */}
              <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-4">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-bold">Slow Recovery Bounds Policy</span>
                
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-neutral-200">
                      <span className="font-bold">Max Monthly Recovery points</span>
                      <span className="text-teal-400 font-bold">+{maxMonthlyRecovery} pts</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={maxMonthlyRecovery}
                      onChange={e => setMaxMonthlyRecovery(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Ensures compliance recovery is significantly slower than rapid trust loss penalties.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-neutral-200">
                      <span className="font-bold">Max Bonus Score adjustments</span>
                      <span className="text-teal-400 font-bold">+{maxBonusScore} pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={maxBonusScore}
                      onChange={e => setMaxBonusScore(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Capped limit of positive event modifiers to ensure base categories still dominate overall scores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: FRAUD SHIELD */}
        {activeSubTab === 'fraud' && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Warning block about automated flags */}
            <div className="p-5 bg-rose-950/20 border border-rose-900/30 rounded-3xl flex items-start gap-4">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-mono">Fraud Prevention Policy Rules</h4>
                <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                  Fraud systems flag potential reciprocal reviews, duplications, or identity manipulation. However, to guarantee deterministic justice, the engine NEVER automatically decreases scores based on speculative warnings. Administrative review and confirmation is strictly required.
                </p>
              </div>
            </div>

            {/* Fraud list details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fraudAlerts.map(alertItem => {
                const isPending = alertItem.status === 'PENDING_REVIEW';
                const isConfirmed = alertItem.status === 'CONFIRMED';
                return (
                  <div
                    key={alertItem.id}
                    className={`p-5 rounded-3xl border space-y-4 font-mono text-xs transition-all ${
                      isConfirmed
                        ? 'bg-rose-950/15 border-rose-900/40'
                        : isPending
                        ? 'bg-neutral-950 border-neutral-900'
                        : 'bg-neutral-900/40 border-neutral-850 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Incident ID: {alertItem.id}</span>
                        <h4 className="text-sm font-bold text-white">{alertItem.type}</h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        isConfirmed ? 'bg-rose-500/20 text-rose-400' : isPending ? 'bg-amber-500/15 text-amber-400 animate-pulse' : 'bg-neutral-850 text-neutral-500'
                      }`}>
                        {alertItem.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-2 p-3 bg-neutral-900 border border-neutral-850 rounded-2xl">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">Actor Linkage</span>
                        <span className="text-white font-semibold">{alertItem.actor}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">Algorithmic Confidence Match</span>
                        <span className="text-teal-400 font-bold">{alertItem.confidence}% Matches Probability</span>
                      </div>
                      <p className="text-neutral-300 text-[11px] leading-relaxed pt-1">{alertItem.details}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Network Telemetry Logs Evidence</span>
                      <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded-xl border border-neutral-900 select-all">{alertItem.evidence}</p>
                    </div>

                    {isPending && (
                      <div className="flex gap-2.5 pt-2">
                        <button
                          onClick={() => handleReviewFraudAlert(alertItem.id, 'CONFIRMED')}
                          className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-black font-bold uppercase transition cursor-pointer"
                        >
                          Confirm Violation & Penalize
                        </button>
                        <button
                          onClick={() => handleReviewFraudAlert(alertItem.id, 'DISMISSED')}
                          className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold border border-neutral-850 transition cursor-pointer"
                        >
                          Dismiss Flag
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
