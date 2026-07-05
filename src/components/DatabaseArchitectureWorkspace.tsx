import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Key, 
  ShieldAlert, 
  Cpu, 
  TrendingUp, 
  HardDrive, 
  Layers, 
  Eye, 
  Terminal, 
  FileLock2, 
  Search, 
  Check, 
  ArrowRight, 
  Network, 
  Server, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Sliders, 
  Activity, 
  Zap,
  Lock,
  Globe,
  PlusCircle,
  Clock,
  History,
  GitCompare,
  DollarSign,
  AlertCircle
} from 'lucide-react';

// Tables Blueprint Definition matching Phase 7 precisely
interface ColumnDefinition {
  name: string;
  type: string;
  key?: 'PK' | 'FK' | 'UK';
  references?: string;
  nullable: boolean;
  desc: string;
}

interface TableDefinition {
  id: string;
  name: string;
  category: 'auth_user' | 'profiles' | 'projects_workflow' | 'trust_reviews' | 'system_audit' | 'future';
  description: string;
  columns: ColumnDefinition[];
  rlsPolicies: string[];
  indexes: string[];
}

const tableBlueprints: TableDefinition[] = [
  {
    id: 'users',
    name: 'users',
    category: 'auth_user',
    description: 'Unified authentication identity core. Decoupled from active profiles.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Primary identifier. Bound directly with Supabase Auth.' },
      { name: 'email', type: 'varchar(255)', key: 'UK', nullable: false, desc: 'Corporate or verified academic email address.' },
      { name: 'password_hash', type: 'varchar(255)', nullable: false, desc: 'Blowfish or bcrypt securely hashed credentials.' },
      { name: 'role', type: 'enum_user_role', nullable: false, desc: 'Permissions routing: STUDENT, COMPANY, ADMIN, SUPER_ADMIN.' },
      { name: 'status', type: 'enum_user_status', nullable: false, desc: 'Core activity states: PENDING, ACTIVE, SUSPENDED, DELETED.' },
      { name: 'created_at', type: 'timestamp_tz', nullable: false, desc: 'Immutable registration ledger record.' },
      { name: 'updated_at', type: 'timestamp_tz', nullable: false, desc: 'Dynamic modification timestamp tracker.' },
      { name: 'deleted_at', type: 'timestamp_tz', nullable: true, desc: 'Enables GDPR and soft deletion strategies.' }
    ],
    rlsPolicies: [
      "Users can select their own identity: auth.uid() = id",
      "Only SUPER_ADMIN can execute delete updates.",
      "Internal triggers automatically update profiles upon row instantiation."
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_users_email ON users (email) WHERE deleted_at IS NULL;"
    ]
  },
  {
    id: 'student_profiles',
    name: 'student_profiles',
    category: 'profiles',
    description: 'RMIT/Global student academic, certificate, and capabilities ledger.',
    columns: [
      { name: 'user_id', type: 'uuid', key: 'PK', references: 'users.id', nullable: false, desc: 'Foreign key establishing 1:1 bound with credentials.' },
      { name: 'university', type: 'varchar(150)', nullable: false, desc: 'Academic institution origin (e.g. RMIT University).' },
      { name: 'major', type: 'varchar(150)', nullable: false, desc: 'Enrolled primary academic major (e.g. Software Engineering).' },
      { name: 'graduation_date', type: 'date', nullable: false, desc: 'Projected or actual university completion timeline.' },
      { name: 'languages', type: 'jsonb', nullable: false, desc: 'Linguistic proficiencies array: {"en": "Fluent", "ko": "Conversational"}.' },
      { name: 'skills', type: 'varchar[]', nullable: false, desc: 'Array of validated developer competencies (e.g. React, Docker).' },
      { name: 'certificates', type: 'jsonb', nullable: true, desc: 'Dynamic certificate schema storing validated issuer authorities.' },
      { name: 'portfolio_links', type: 'jsonb', nullable: true, desc: 'Developer presence links: GitHub, LinkedIn, Figma, etc.' },
      { name: 'verification_status', type: 'enum_verify_status', nullable: false, desc: 'Manual academic auditing result: PENDING, VERIFIED, REJECTED.' },
      { name: 'trust_summary', type: 'numeric(5,2)', nullable: false, desc: 'Cached real-time ledger trust rating score (0.00 to 100.00).' }
    ],
    rlsPolicies: [
      "Public profiles are readable by authenticated company matches.",
      "Students can modify their own portfolio and skills fields: auth.uid() = user_id",
      "Only ADMIN and SUPER_ADMIN roles can alter academic verification_status."
    ],
    indexes: [
      "CREATE INDEX idx_student_search_gist ON student_profiles USING gist (skills);",
      "CREATE INDEX idx_student_major_univ ON student_profiles (university, major);"
    ]
  },
  {
    id: 'company_profiles',
    name: 'company_profiles',
    category: 'profiles',
    description: 'Corporate SME profile tracking registration codes, scale, and English proficiency.',
    columns: [
      { name: 'user_id', type: 'uuid', key: 'PK', references: 'users.id', nullable: false, desc: 'Corporate account linkage.' },
      { name: 'company_name', type: 'varchar(200)', nullable: false, desc: 'Legal business entity title.' },
      { name: 'business_registration', type: 'varchar(100)', key: 'UK', nullable: false, desc: 'Verified government-issued business license ID.' },
      { name: 'industry', type: 'varchar(150)', nullable: false, desc: 'Domain categorizations for AI clustering.' },
      { name: 'company_size', type: 'varchar(50)', nullable: false, desc: 'Scale indicators: 1-10 (Micro), 11-50, 50+.' },
      { name: 'country', type: 'varchar(100)', nullable: false, desc: 'SME local jurisdiction (e.g. South Korea).' },
      { name: 'website', type: 'varchar(255)', nullable: true, desc: 'Primary corporate home presence.' },
      { name: 'english_availability', type: 'boolean', nullable: false, desc: 'Indicates capacity to manage international English communications.' },
      { name: 'verification_status', type: 'enum_verify_status', nullable: false, desc: 'Gyeongbuk administrator validation status.' },
      { name: 'trust_score', type: 'numeric(5,2)', nullable: false, desc: 'Computed trust ratings derived from milestone payouts.' }
    ],
    rlsPolicies: [
      "Verified corporate identities are readable by active students.",
      "Corporate coordinators can manage their own entities: auth.uid() = user_id",
      "Admin validation is restricted strictly to security staff."
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_company_reg ON company_profiles (business_registration);"
    ]
  },
  {
    id: 'projects',
    name: 'projects',
    category: 'projects_workflow',
    description: 'Micro-assignment briefs posted by verified SMEs detailing weekly deliverables.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Unique project record tracker.' },
      { name: 'creator_id', type: 'uuid', key: 'FK', references: 'company_profiles.user_id', nullable: false, desc: 'Linkage to posting corporate entity.' },
      { name: 'title', type: 'varchar(200)', nullable: false, desc: 'Task header (e.g. Core System API Development).' },
      { name: 'requirements', type: 'text', nullable: false, desc: 'Prerequisite parameters and capabilities expectations.' },
      { name: 'skills_required', type: 'varchar[]', nullable: false, desc: 'Competency keywords mapped to candidates.' },
      { name: 'duration_weeks', type: 'integer', nullable: false, desc: 'Project lifespan (default 4 weeks micro-burst).' },
      { name: 'compensation_usd', type: 'numeric(10,2)', nullable: false, desc: 'Task completion payout value.' },
      { name: 'timezone', type: 'varchar(50)', nullable: false, desc: 'Operating hours standard (e.g. KST).' },
      { name: 'status', type: 'enum_project_status', nullable: false, desc: 'States: DRAFT, PENDING_APPROVAL, ACTIVE, COMPLETED, ARCHIVED.' },
      { name: 'created_at', type: 'timestamp_tz', nullable: false, desc: 'Instantiation ledger timestamp.' }
    ],
    rlsPolicies: [
      "DRAFT and PENDING_APPROVAL projects are visible only to the creator and admin auditing units.",
      "ACTIVE projects are readable universally to invite competitive matching.",
      "Only the corporate owner can modify requirements fields."
    ],
    indexes: [
      "CREATE INDEX idx_projects_status ON projects (status);",
      "CREATE INDEX idx_projects_skills ON projects USING gin (skills_required);"
    ]
  },
  {
    id: 'applications',
    name: 'applications',
    category: 'projects_workflow',
    description: 'Student-to-project candidate submissions, including immutable snapshot ledgers.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Unique assignment link.' },
      { name: 'student_id', type: 'uuid', key: 'FK', references: 'student_profiles.user_id', nullable: false, desc: 'Applicant identity match.' },
      { name: 'project_id', type: 'uuid', key: 'FK', references: 'projects.id', nullable: false, desc: 'Target assignment match.' },
      { name: 'status', type: 'enum_app_status', nullable: false, desc: 'Application pipeline state: SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED, WITHDRAWN.' },
      { name: 'resume_snapshot_id', type: 'uuid', key: 'FK', references: 'attachments.id', nullable: false, desc: 'Immutable snapshot of resume PDF at matching point.' },
      { name: 'portfolio_snapshot', type: 'jsonb', nullable: false, desc: 'Immutable ledger record tracking Github repo states at submission.' },
      { name: 'created_at', type: 'timestamp_tz', nullable: false, desc: 'Submission time marker.' }
    ],
    rlsPolicies: [
      "Students can view their own application progress.",
      "The hosting corporate owner can view all applicant records tied to their projects.",
      "Decision triggers enforce automatic ledger record logging on transition to ACCEPTED."
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_one_app_per_project ON applications (student_id, project_id) WHERE status != 'WITHDRAWN';"
    ]
  },
  {
    id: 'weekly_goals',
    name: 'weekly_goals',
    category: 'projects_workflow',
    description: 'Weekly task deliverables structured to verify objective progress.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Goal assignment identifier.' },
      { name: 'project_id', type: 'uuid', key: 'FK', references: 'projects.id', nullable: false, desc: 'Target project container.' },
      { name: 'week_number', type: 'integer', nullable: false, desc: 'Lifespan week: 1, 2, 3, or 4.' },
      { name: 'title', type: 'varchar(150)', nullable: false, desc: 'Short milestone header.' },
      { name: 'description', type: 'text', nullable: false, desc: 'Concrete expectations and technical bounds.' },
      { name: 'deadline', type: 'timestamp_tz', nullable: false, desc: 'Strict milestone cutoff timestamp.' }
    ],
    rlsPolicies: [
      "All active participants and administrative units can access goals.",
      "Creation is exclusive to the company coordinating the project."
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_weekly_sequence ON weekly_goals (project_id, week_number);"
    ]
  },
  {
    id: 'weekly_submissions',
    name: 'weekly_submissions',
    category: 'projects_workflow',
    description: 'Objective milestone code submissions or presentation reports.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Submission identifier.' },
      { name: 'goal_id', type: 'uuid', key: 'FK', references: 'weekly_goals.id', nullable: false, desc: 'Linked goal.' },
      { name: 'student_id', type: 'uuid', key: 'FK', references: 'student_profiles.user_id', nullable: false, desc: 'Submitting developer.' },
      { name: 'deliverables_url', type: 'varchar(255)', nullable: false, desc: 'Pointer to verified delivery (e.g. GitHub Pull Request link).' },
      { name: 'comments', type: 'text', nullable: true, desc: 'Developer notes explaining integration approaches.' },
      { name: 'submitted_at', type: 'timestamp_tz', nullable: false, desc: 'Automated timestamp verifying deadline adherence.' },
      { name: 'evaluation_status', type: 'enum_eval_status', nullable: false, desc: 'Evaluations: PENDING, APPROVED, REJECTED, DISPUTED.' }
    ],
    rlsPolicies: [
      "Students can modify submissions prior to deadline expiration.",
      "Companies read submissions instantly to execute assessments.",
      "All transaction events trigger automated logging routines."
    ],
    indexes: [
      "CREATE INDEX idx_sub_audit_time ON weekly_submissions (submitted_at);"
    ]
  },
  {
    id: 'reviews',
    name: 'reviews',
    category: 'trust_reviews',
    description: 'Immutable post-project score evaluations. Completely unalterable once recorded.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Review key.' },
      { name: 'reviewer_id', type: 'uuid', key: 'FK', references: 'users.id', nullable: false, desc: 'Origin coordinator.' },
      { name: 'reviewee_id', type: 'uuid', key: 'FK', references: 'users.id', nullable: false, desc: 'Subject identity.' },
      { name: 'project_id', type: 'uuid', key: 'FK', references: 'projects.id', nullable: false, desc: 'Source project bounds.' },
      { name: 'rating_score', type: 'integer', nullable: false, desc: 'Value integer between 1 and 5.' },
      { name: 'categories_scores', type: 'jsonb', nullable: false, desc: 'Dimensions: {"communication": 5, "reliability": 4}.' },
      { name: 'written_feedback', type: 'text', nullable: false, desc: 'Constructive narrative record.' },
      { name: 'is_immutable', type: 'boolean', nullable: false, desc: 'Hard constraint preventing post-submit edits.' },
      { name: 'submitted_at', type: 'timestamp_tz', nullable: false, desc: 'Ledger instantiation point.' }
    ],
    rlsPolicies: [
      "Reviews are universally readable once finalized to build objective talent ledgers.",
      "Updates or deletions are strictly prevented on the engine layer."
    ],
    indexes: [
      "CREATE INDEX idx_reviews_subject ON reviews (reviewee_id);"
    ]
  },
  {
    id: 'performance_ledger',
    name: 'performance_ledger',
    category: 'trust_reviews',
    description: 'Immutable, event-based time-series recording academic/professional milestones.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Time series key.' },
      { name: 'student_id', type: 'uuid', key: 'FK', references: 'student_profiles.user_id', nullable: false, desc: 'Student profile.' },
      { name: 'metric_type', type: 'varchar(100)', nullable: false, desc: 'Metrics: DEADLINE_COMPLIANCE, COMPANY_SATISFACTION, REPEAT_HIRE.' },
      { name: 'value', type: 'numeric(5,2)', nullable: false, desc: 'Quantitative indicator.' },
      { name: 'event_context', type: 'jsonb', nullable: false, desc: 'Event context metadata, tracking previous states.' },
      { name: 'recorded_at', type: 'timestamp_tz', nullable: false, desc: 'Time series log point.' }
    ],
    rlsPolicies: [
      "Time-series ledger rows are strictly write-once, read-many.",
      "Auditors and companies verify performance curves in analytical panels."
    ],
    indexes: [
      "CREATE INDEX idx_perf_student_time ON performance_ledger (student_id, recorded_at DESC);"
    ]
  },
  {
    id: 'trust_ledger',
    name: 'trust_ledger',
    category: 'trust_reviews',
    description: 'Traceable chronological timeline records. Base ledger calculating dynamic platform Trust Scores.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Ledger record key.' },
      { name: 'user_id', type: 'uuid', key: 'FK', references: 'users.id', nullable: false, desc: 'Target company or student identity.' },
      { name: 'event_type', type: 'varchar(100)', nullable: false, desc: 'Events: PASSPORT_VERIFIED, MILESTONE_MISSED, DISPUTE_OPENED, EXCELLENT_RATING.' },
      { name: 'score_delta', type: 'numeric(5,2)', nullable: false, desc: 'Score change variable (e.g. +5.00, -10.00).' },
      { name: 'event_explanation', type: 'text', nullable: false, desc: 'Audit record detailing reasons.' },
      { name: 'audit_operator_id', type: 'uuid', key: 'FK', references: 'users.id', nullable: true, desc: 'Admin ID overseeing manual verifications.' },
      { name: 'recorded_at', type: 'timestamp_tz', nullable: false, desc: 'Ledger log event timestamp.' }
    ],
    rlsPolicies: [
      "Read operations are permitted to matches to maintain low risk.",
      "Insertions are exclusively dispatched by core platform triggers."
    ],
    indexes: [
      "CREATE INDEX idx_trust_user_history ON trust_ledger (user_id, recorded_at DESC);"
    ]
  },
  {
    id: 'ai_matches',
    name: 'ai_matches',
    category: 'system_audit',
    description: 'Matching recommendations with dynamic explainability vectors.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Match index.' },
      { name: 'student_id', type: 'uuid', key: 'FK', references: 'student_profiles.user_id', nullable: false, desc: 'Candidate reference.' },
      { name: 'project_id', type: 'uuid', key: 'FK', references: 'projects.id', nullable: false, desc: 'Target assignment reference.' },
      { name: 'confidence_score', type: 'numeric(4,3)', nullable: false, desc: 'Algorithmic alignment probability (0.000 to 1.000).' },
      { name: 'matching_factors', type: 'jsonb', nullable: false, desc: 'Details: {"major_match": true, "skills_overlap": ["React", "TypeScript"]}.' },
      { name: 'explanation_text', type: 'text', nullable: false, desc: 'Tone-compliant translation detailing recommendations.' },
      { name: 'acceptance_status', type: 'varchar(50)', nullable: false, desc: 'Status: RECOMMENDED, DISMISSED, MATCHED.' }
    ],
    rlsPolicies: [
      "Accessible only to the hiring managers linked with the specific project.",
      "Enforces absolute confidentiality of background parameters."
    ],
    indexes: [
      "CREATE INDEX idx_ai_confidence ON ai_matches (project_id, confidence_score DESC);"
    ]
  },
  {
    id: 'attachments',
    name: 'attachments',
    category: 'system_audit',
    description: 'Dynamic file attachment metadata registry. Zero files are stored directly in database.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Unique storage descriptor.' },
      { name: 'uploader_id', type: 'uuid', key: 'FK', references: 'users.id', nullable: false, desc: 'Author entity.' },
      { name: 'file_name', type: 'varchar(255)', nullable: false, desc: 'Original payload title.' },
      { name: 'mime_type', type: 'varchar(100)', nullable: false, desc: 'Standard content descriptor (e.g. application/pdf).' },
      { name: 'file_size_bytes', type: 'bigint', nullable: false, desc: 'File payload magnitude.' },
      { name: 'storage_bucket_path', type: 'varchar(512)', nullable: false, desc: 'Secure cloud bucket reference string.' },
      { name: 'virus_scan_status', type: 'varchar(50)', nullable: false, desc: 'Security marker: CLEAN, INFECTED, PROCESSING.' }
    ],
    rlsPolicies: [
      "Files inherit access rights of parent entities (e.g. portfolio matches application access).",
      "Only the verified uploader or legal compliance administrators can delete pointers."
    ],
    indexes: [
      "CREATE INDEX idx_attachments_uploader ON attachments (uploader_id);"
    ]
  },
  {
    id: 'audit_logs',
    name: 'audit_logs',
    category: 'system_audit',
    description: 'Write-once immutable telemetry ledger recording all administrative updates.',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK', nullable: false, desc: 'Immutable index.' },
      { name: 'actor_id', type: 'uuid', key: 'FK', references: 'users.id', nullable: false, desc: 'Operator taking action.' },
      { name: 'action', type: 'varchar(150)', nullable: false, desc: 'Activity tag: STUDENT_VERIFIED, DISPUTE_OVERRULED, API_KEY_ROTATED.' },
      { name: 'entity_name', type: 'varchar(100)', nullable: false, desc: 'Table category updated.' },
      { name: 'previous_value', type: 'jsonb', nullable: true, desc: 'Data snapshot prior to modification.' },
      { name: 'new_value', type: 'jsonb', nullable: true, desc: 'Dynamic state after update execution.' },
      { name: 'ip_address', type: 'inet', nullable: false, desc: 'Operational network location descriptor.' },
      { name: 'recorded_at', type: 'timestamp_tz', nullable: false, desc: 'Epoch timestamp of transaction.' }
    ],
    rlsPolicies: [
      "Audit tables are write-once and universally unalterable, even to SUPER_ADMIN.",
      "Access is locked strictly to compliance auditors and administrators."
    ],
    indexes: [
      "CREATE INDEX idx_audit_time_series ON audit_logs (recorded_at DESC);"
    ]
  }
];

export default function DatabaseArchitectureWorkspace() {
  const [activeSchemaTab, setActiveSchemaTab] = useState<'erd_view' | 'schema_explorer' | 'rls_security' | 'perf_indexes' | 'scaling_strategy'>('erd_view');
  const [selectedTable, setSelectedTable] = useState<string>('users');
  
  // Interactive RLS Simulator States
  const [simulationRole, setSimulationRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN' | 'ANONYMOUS'>('STUDENT');
  const [simulationTable, setSimulationTable] = useState<string>('student_profiles');
  const [simulationAction, setSimulationAction] = useState<'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'>('SELECT');

  // Compute simulation outcomes based on RLS rules
  const evaluateSimulation = () => {
    if (simulationRole === 'ANONYMOUS') {
      if (simulationTable === 'projects' && simulationAction === 'SELECT') {
        return { granted: true, policy: "ACTIVE projects are universally readable.", details: "Public matching encourages international applications." };
      }
      return { granted: false, policy: "Deny by default.", details: "Anonymous users lack secure access tokens." };
    }

    if (simulationRole === 'STUDENT') {
      if (simulationTable === 'student_profiles') {
        if (simulationAction === 'SELECT' || simulationAction === 'UPDATE') {
          return { granted: true, policy: "auth.uid() = user_id", details: "Students retain sovereign ownership over skills and portfolio descriptors." };
        }
        return { granted: false, policy: "Strict structural locks.", details: "Students cannot alter academic verification statuses directly." };
      }
      if (simulationTable === 'projects' && simulationAction === 'SELECT') {
        return { granted: true, policy: "ACTIVE projects readable universally.", details: "Enables interactive project exploration and application." };
      }
      if (simulationTable === 'weekly_submissions') {
        if (simulationAction === 'SELECT' || simulationAction === 'INSERT' || simulationAction === 'UPDATE') {
          return { granted: true, policy: "Developer constraints.", details: "Enables posting and refining milestone deliverables before deadlines." };
        }
      }
      if (simulationTable === 'audit_logs') {
        return { granted: false, policy: "Admin locks.", details: "Audits are reserved solely for enterprise auditing units." };
      }
    }

    if (simulationRole === 'COMPANY') {
      if (simulationTable === 'company_profiles') {
        if (simulationAction === 'SELECT' || simulationAction === 'UPDATE') {
          return { granted: true, policy: "auth.uid() = user_id", details: "Corporate operators govern their legal and profile assets." };
        }
      }
      if (simulationTable === 'student_profiles' && simulationAction === 'SELECT') {
        return { granted: true, policy: "Verified match rules.", details: "Companies inspect candidates linked directly to micro-assignments." };
      }
      if (simulationTable === 'projects') {
        if (simulationAction !== 'DELETE') {
          return { granted: true, policy: "auth.uid() = creator_id", details: "Companies write, approve, and finalize task milestone briefs." };
        }
      }
    }

    if (simulationRole === 'ADMIN') {
      if (simulationTable === 'audit_logs' && simulationAction === 'SELECT') {
        return { granted: true, policy: "Compliance access.", details: "Administrators audit system state records." };
      }
      if (simulationAction === 'SELECT' || simulationAction === 'INSERT' || simulationAction === 'UPDATE') {
        return { granted: true, policy: "Platform administration privileges.", details: "Audit review controls let admins verify company registration codes." };
      }
      if (simulationAction === 'DELETE') {
        return { granted: false, policy: "Immutable history parameters.", details: "Admins are prevented from deleting completed reviews, trust history, or audit logs." };
      }
    }

    return { granted: false, policy: "Default policy constraints.", details: "Role parameters deny this action to protect data integrity." };
  };

  const simResult = evaluateSimulation();

  return (
    <div className="space-y-6" id="db-architecture-workspace">
      
      {/* DB Design Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/20 via-neutral-900 to-neutral-950 border border-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Database className="w-4 h-4 text-blue-400" /> Phase 7 Authoritative Schema
          </div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">PostgreSQL & Supabase Architecture</h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            A production-ready database blueprint designed to scale across millions of transactions. Features decoupled authentication, immutable trust and performance ledgers, row-level security (RLS) constraints, optimized B-Tree index structures, and future payments architecture.
          </p>
        </div>
      </div>

      {/* Database Schema Navigation tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-neutral-900/60 border border-neutral-850 rounded-2xl">
        {[
          { tabId: 'erd_view', label: 'Interactive ERD Map', icon: Network },
          { tabId: 'schema_explorer', label: 'Schema Column Explorer', icon: Layers },
          { tabId: 'rls_security', label: 'RLS Security Simulator', icon: FileLock2 },
          { tabId: 'perf_indexes', label: 'Indexes & Query Performance', icon: Cpu },
          { tabId: 'scaling_strategy', label: 'Future Ready Scalability', icon: TrendingUp }
        ].map(tab => {
          const IconComp = tab.icon;
          const isSelected = activeSchemaTab === tab.tabId;
          return (
            <button
              key={tab.tabId}
              id={`db-tab-btn-${tab.tabId}`}
              onClick={() => setActiveSchemaTab(tab.tabId as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-neutral-950 text-blue-400 border border-neutral-800 shadow-lg font-black' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SCHEMA WORKSPACE CONTENT */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: INTERACTIVE ERD MAP */}
        {activeSchemaTab === 'erd_view' && (
          <motion.div
            key="erd_view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Interactive Cardinality Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ERD Left Side: Entity Selector */}
              <div className="lg:col-span-1 p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Database Table Nodes</h3>
                  <p className="text-[10px] text-neutral-500">Select a structural database table node to trace relationship curves and cascading integrity constraints</p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {tableBlueprints.map(tb => (
                    <button
                      key={tb.id}
                      onClick={() => setSelectedTable(tb.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                        selectedTable === tb.id 
                          ? 'bg-neutral-950 border-blue-500/20 text-neutral-100 shadow-xl' 
                          : 'bg-neutral-950/20 border-neutral-950/40 text-neutral-400 hover:text-white hover:bg-neutral-900/10'
                      }`}
                    >
                      <div className={`w-5.5 h-5.5 rounded-xl flex items-center justify-center font-mono text-[10px] font-bold ${
                        selectedTable === tb.id ? 'bg-blue-500 text-black' : 'bg-neutral-900 text-neutral-500'
                      }`}>
                        T
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black">{tb.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono uppercase ${
                            tb.category === 'auth_user' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/20' :
                            tb.category === 'profiles' ? 'bg-purple-950 text-purple-400 border border-purple-900/20' :
                            tb.category === 'projects_workflow' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/20' :
                            tb.category === 'trust_reviews' ? 'bg-rose-950 text-rose-400 border border-rose-900/20' :
                            'bg-neutral-900 text-neutral-400'
                          }`}>
                            {tb.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 truncate max-w-[200px]">{tb.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ERD Center/Right: Interactive Schema Map Visualizer */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Dynamic Relationship Map</h3>
                      <p className="text-[10px] text-neutral-500">Visual mapping for the chosen table node</p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full font-bold">
                      Normalization: 3NF (Strict Third Normal Form)
                    </span>
                  </div>

                  {/* Schema Card Mock */}
                  {(() => {
                    const activeTb = tableBlueprints.find(t => t.id === selectedTable)!;
                    return (
                      <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-900 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start border-b border-neutral-900 pb-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">PostgreSQL Table Node</span>
                            <h4 className="text-base font-black text-neutral-100 flex items-center gap-1.5">
                              <Database className="w-4 h-4 text-blue-400" /> {activeTb.name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-neutral-400 block">{activeTb.columns.length} Columns</span>
                            <span className="text-[9px] font-mono text-neutral-500 block">Row Security: Enabled</span>
                          </div>
                        </div>

                        {/* Columns list */}
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {activeTb.columns.map((col, idx) => (
                            <div key={idx} className="p-2.5 bg-neutral-900/40 rounded-xl border border-neutral-850 flex items-start justify-between gap-4">
                              <div className="flex items-start gap-2">
                                {col.key === 'PK' && <Key className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />}
                                {col.key === 'FK' && <GitCompare className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />}
                                {!col.key && <div className="w-3.5" />}
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-mono font-bold text-neutral-200">{col.name}</span>
                                    {col.nullable && <span className="text-[8px] text-neutral-500 uppercase font-mono">NULL</span>}
                                  </div>
                                  <p className="text-[10px] text-neutral-400 leading-snug">{col.desc}</p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 font-mono text-[10px] text-blue-400/80 bg-blue-950/20 px-2 py-0.5 rounded border border-blue-900/10 font-bold">
                                {col.type}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Foreign Keys and Cascading Constraints */}
                        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-850 space-y-2.5">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Relational Cardinality & Integrity Triggers</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-neutral-500 block">CASCADE POLICIES</span>
                              <p className="text-[10px] text-neutral-300 font-mono">ON DELETE CASCADE (users profiles), ON DELETE RESTRICT (audit ledger rows)</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-neutral-500 block">CARDINALITY CURVE</span>
                              <p className="text-[10px] text-neutral-300 font-mono">
                                {activeTb.id === 'users' ? '1 : 1 (Profiles), 1 : N (Weekly Submissions, Audits)' :
                                 activeTb.id === 'projects' ? '1 : N (Weekly Goals, Matches, Applications)' :
                                 'N : M (Intermediate application joins)'}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2 p-3 bg-neutral-950 border border-neutral-900 rounded-xl mt-4">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">
                    Cascade triggers enforce absolute relational isolation. Users profiles are soft-deleted (`deleted_at` flag) for seamless historical data validation.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: SCHEMA COLUMN EXPLORER */}
        {activeSchemaTab === 'schema_explorer' && (
          <motion.div
            key="schema_explorer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Enterprise Level Database Normalized Schema Tables */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Enterprise Normalized Schema Directory</h3>
                <p className="text-[10px] text-neutral-500">Meticulously tracing structural definitions for verified SaaS profiles and performance timelines</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tableBlueprints.map((tb, idx) => (
                  <div key={idx} className="p-5 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-neutral-500">TABLE NODE 0{idx + 1}</span>
                        <span className="text-[9px] font-mono text-blue-400 bg-blue-950/40 border border-blue-900/30 px-2 py-0.5 rounded-full font-bold">
                          {tb.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-neutral-100 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-blue-400" /> {tb.name}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">{tb.description}</p>
                    </div>

                    <div className="border-t border-neutral-900/60 pt-3 space-y-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Primary Column Signatures</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tb.columns.slice(0, 4).map((c, cidx) => (
                          <span key={cidx} className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-850 font-mono text-[9px] text-neutral-300 flex items-center gap-1">
                            {c.key === 'PK' && <span className="text-amber-400 text-[8px] font-bold">PK</span>}
                            {c.key === 'FK' && <span className="text-blue-400 text-[8px] font-bold">FK</span>}
                            {c.name}
                          </span>
                        ))}
                        {tb.columns.length > 4 && (
                          <span className="text-[9px] text-neutral-500 font-mono px-1">+{tb.columns.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: RLS SECURITY SIMULATOR */}
        {activeSchemaTab === 'rls_security' && (
          <motion.div
            key="rls_security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Supabase Row Level Security RLS Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Simulator Inputs */}
              <div className="lg:col-span-1 p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">RLS Policy Context</h3>
                  <p className="text-[10px] text-neutral-500">Configure simulated execution headers to evaluate PostgreSQL Row-Level Security parameters</p>
                </div>

                <div className="space-y-3.5">
                  {/* Select Role */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase">Executing User Role</label>
                    <select 
                      value={simulationRole}
                      onChange={(e) => setSimulationRole(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none transition-all cursor-pointer"
                    >
                      <option value="STUDENT">Student Candidate (Verified)</option>
                      <option value="COMPANY">Company SME Coordinator</option>
                      <option value="ADMIN">Platform Compliance Administrator</option>
                      <option value="ANONYMOUS">Anonymous / Unauthenticated Public</option>
                    </select>
                  </div>

                  {/* Select Table */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase">Target SQL Table</label>
                    <select 
                      value={simulationTable}
                      onChange={(e) => setSimulationTable(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none transition-all cursor-pointer"
                    >
                      <option value="student_profiles">student_profiles (Academic resumes)</option>
                      <option value="company_profiles">company_profiles (SME details)</option>
                      <option value="projects">projects (Micro-assignment briefs)</option>
                      <option value="weekly_submissions">weekly_submissions (Milestone code)</option>
                      <option value="audit_logs">audit_logs (Administrative ledger)</option>
                    </select>
                  </div>

                  {/* Select Action */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase">Database Action (CRUD)</label>
                    <div className="grid grid-cols-4 gap-1 p-0.5 bg-neutral-950 border border-neutral-850 rounded-xl">
                      {(['SELECT', 'INSERT', 'UPDATE', 'DELETE'] as const).map(act => (
                        <button
                          key={act}
                          onClick={() => setSimulationAction(act)}
                          className={`py-1.5 text-[9px] font-bold rounded-lg cursor-pointer ${
                            simulationAction === act ? 'bg-neutral-900 text-blue-400' : 'text-neutral-500'
                          }`}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">RLS Compiler Diagnostics</h3>
                      <p className="text-[10px] text-neutral-500">Security response based on Supabase PostgreSQL policies</p>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded-full font-bold">
                      Protocol: AES-256 System Encryption
                    </span>
                  </div>

                  {/* Visual Grant/Deny Header */}
                  <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                    simResult.granted 
                      ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                      : 'bg-red-950/20 border-red-900/30 text-red-400'
                  }`}>
                    {simResult.granted ? (
                      <ShieldCheck className="w-10 h-10 animate-pulse flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-10 h-10 animate-bounce flex-shrink-0" />
                    )}
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-black uppercase tracking-wider">
                        {simResult.granted ? 'TRANSACTION GRANTED (SUCCESS)' : 'TRANSACTION DENIED (SECURITY LOCK)'}
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        {simResult.details}
                      </p>
                    </div>
                  </div>

                  {/* Policy Statement rendering */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">PostgreSQL RLS Declarative Statement</span>
                    <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 font-mono text-xs text-neutral-300 overflow-x-auto">
                      <p className="text-blue-400">
                        ALTER TABLE <span className="text-neutral-100 font-bold">{simulationTable}</span> ENABLE ROW LEVEL SECURITY;
                      </p>
                      <p className="mt-1 text-purple-400">
                        CREATE POLICY <span className="text-neutral-100 font-bold">"policy_{simulationRole.toLowerCase()}_{simulationTable}_{simulationAction.toLowerCase()}"</span> ON {simulationTable}
                      </p>
                      <p className="mt-0.5 pl-4 text-emerald-400">
                        FOR {simulationAction} TO authenticated
                      </p>
                      <p className="mt-0.5 pl-4 text-amber-400">
                        USING ({simulationRole === 'ADMIN' ? 'role = \'ADMIN\'' : `auth.uid() = ${simulationTable === 'student_profiles' ? 'user_id' : 'creator_id'}`});
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-3.5 mt-4">
                  Supabase RLS is verified directly on the database engine. Even if client-side API layers are compromised, RLS locks remain completely unhackable.
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 4: INDEXES & QUERY PERFORMANCE */}
        {activeSchemaTab === 'perf_indexes' && (
          <motion.div
            key="perf_indexes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Database Index Strategies */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Strategic Performance Indexes</h3>
                <p className="text-[10px] text-neutral-500">B-tree, GIN, and GiST indexes configured to maintain fast search queries under high traffic</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'idx_users_email',
                    target: 'users (email)',
                    type: 'B-tree Unique Partial Index',
                    purpose: 'Optimizes authentication speeds and enforces soft delete uniqueness constraints.',
                    sql: 'CREATE UNIQUE INDEX idx_users_email ON users (email) WHERE deleted_at IS NULL;'
                  },
                  {
                    name: 'idx_student_skills_gin',
                    target: 'student_profiles (skills)',
                    type: 'GIN Array Index',
                    purpose: 'Powers fast matching of student developer competencies array filters (e.g. matching Node.js + TypeScript).',
                    sql: 'CREATE INDEX idx_student_skills_gin ON student_profiles USING gin (skills);'
                  },
                  {
                    name: 'idx_projects_search',
                    target: 'projects (status, skills_required)',
                    type: 'Composite B-Tree GIN Index',
                    purpose: 'Maintains responsive dashboards for active micro-assignment search queries.',
                    sql: 'CREATE INDEX idx_projects_skills ON projects USING gin (skills_required) WHERE status = \'ACTIVE\';'
                  },
                  {
                    name: 'idx_audit_logs_timeline',
                    target: 'audit_logs (recorded_at DESC)',
                    type: 'Desc B-Tree Index',
                    purpose: 'Speeds up time-series audit queries on admin interfaces.',
                    sql: 'CREATE INDEX idx_audit_logs_timeline ON audit_logs (recorded_at DESC);'
                  }
                ].map((idx, indexIdx) => (
                  <div key={indexIdx} className="p-5 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-neutral-500">{idx.type}</span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                      </div>
                      <h4 className="text-xs font-black text-neutral-100 flex items-center gap-1.5 font-mono">
                        <Cpu className="w-3.5 h-3.5 text-blue-400" /> {idx.name}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">{idx.purpose}</p>
                    </div>

                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-850 font-mono text-[10px] text-neutral-300">
                      {idx.sql}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: FUTURE READY SCALABILITY */}
        {activeSchemaTab === 'scaling_strategy' && (
          <motion.div
            key="scaling_strategy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Future Scaling Roadmaps and Payout System blueprints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-950/40 border border-blue-900/40 flex items-center justify-center text-blue-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-neutral-100">Global Payout Integration</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Pre-designed ledger tables ready to wire Stripe and Toss payment triggers. Incorporates transaction validation signatures to prevent duplicate double-spending on project completion.
                </p>
                <div className="text-[10px] font-mono text-neutral-500 uppercase font-black">Ready for Stripe API</div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-neutral-100">Visa Services Ledger</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Ready to store verified visa application files and legal sponsor metrics, ensuring immediate international employment compliance.
                </p>
                <div className="text-[10px] font-mono text-neutral-500 uppercase font-black">Pre-planned Compliance</div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-950/40 border border-purple-900/40 flex items-center justify-center text-purple-400">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-neutral-100">Sharding & Read Replicas</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  The architecture isolates time-series logs (audit and metrics) into partitioned, read-only tables to maintain 100% active operational speeds on core profiles.
                </p>
                <div className="text-[10px] font-mono text-neutral-500 uppercase font-black">Optimized for Millions</div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
