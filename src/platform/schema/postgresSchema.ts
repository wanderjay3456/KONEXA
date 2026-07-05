export const konexaPostgresSchema = `
create extension if not exists pgcrypto;

create type user_role as enum ('STUDENT', 'COMPANY', 'ADMIN', 'SUPER_ADMIN');
create type user_status as enum ('PENDING', 'VERIFIED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
create type project_status as enum ('DRAFT', 'PENDING_APPROVAL', 'OPEN', 'MATCHED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CLOSED', 'CANCELLED');
create type application_status as enum ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
create type hiring_decision as enum ('HIRE', 'TALENT_POOL', 'REJECT', 'FUTURE_CONTACT', 'PENDING');

create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  role user_role not null,
  is_verified boolean not null default false,
  status user_status not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists auth_credentials (
  user_id text primary key references users(id) on delete cascade,
  password_hash text not null,
  password_salt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists student_profiles (
  user_id text primary key references users(id) on delete cascade,
  full_name text not null,
  avatar_url text not null,
  university text not null,
  major text not null,
  graduation_date text not null,
  english_proficiency text not null,
  languages text[] not null default '{}',
  skills text[] not null default '{}',
  certificates text[] not null default '{}',
  portfolio_url text not null,
  github_url text not null,
  linkedin_url text not null,
  resume_file_name text,
  intro_video_url text,
  preferred_country text not null,
  preferred_industry text not null,
  preferred_role text not null,
  availability text not null,
  biography text,
  career_goals text,
  contact_email text,
  contact_phone text,
  notification_preferences jsonb not null default '{}'::jsonb,
  privacy_settings jsonb not null default '{}'::jsonb,
  profile_version integer not null default 1,
  updated_at timestamptz
);

create table if not exists company_profiles (
  user_id text primary key references users(id) on delete cascade,
  company_name text not null,
  logo_url text not null,
  industry text not null,
  description text,
  website text not null,
  location text not null,
  company_size text not null,
  english_availability text not null,
  hiring_preferences text[] not null default '{}',
  preferred_majors text[] not null default '{}',
  preferred_skills text[] not null default '{}',
  languages text[] not null default '{}',
  recruitment_status text check (recruitment_status in ('OPEN', 'PAUSED', 'CLOSED')),
  contact_email text,
  contact_phone text,
  notification_preferences jsonb not null default '{}'::jsonb,
  team_members jsonb not null default '[]'::jsonb,
  employer_branding text,
  verification_status text not null check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED')),
  business_registration_file text,
  profile_version integer not null default 1,
  updated_at timestamptz
);

create table if not exists projects (
  id text primary key default gen_random_uuid()::text,
  company_id text not null references users(id),
  title text not null,
  description text not null,
  expected_outcome text not null,
  duration_weeks integer not null check (duration_weeks between 1 and 12),
  compensation text not null,
  required_skills text[] not null,
  weekly_hours integer not null check (weekly_hours between 1 and 30),
  status project_status not null default 'PENDING_APPROVAL',
  milestones jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id text primary key default gen_random_uuid()::text,
  project_id text not null references projects(id),
  project_title text not null,
  company_name text not null,
  student_id text not null references users(id),
  student_name text not null,
  student_avatar text not null,
  status application_status not null default 'SUBMITTED',
  portfolio_url text,
  cover_letter text not null,
  applied_at timestamptz not null default now(),
  unique (project_id, student_id)
);

create table if not exists weekly_submissions (
  id text primary key default gen_random_uuid()::text,
  project_id text not null references projects(id),
  student_id text not null references users(id),
  week_number integer not null check (week_number > 0),
  deliverable_file text not null,
  progress_report text not null,
  reflection text not null,
  is_evaluated boolean not null default false,
  submitted_at timestamptz not null default now(),
  unique (project_id, student_id, week_number)
);

create table if not exists weekly_evaluations (
  id text primary key default gen_random_uuid()::text,
  submission_id text not null unique references weekly_submissions(id),
  project_id text not null references projects(id),
  student_id text not null references users(id),
  week_number integer not null,
  communication integer not null check (communication between 1 and 5),
  responsibility integer not null check (responsibility between 1 and 5),
  quality integer not null check (quality between 1 and 5),
  deadline integer not null check (deadline between 1 and 5),
  problem_solving integer not null check (problem_solving between 1 and 5),
  professionalism integer not null check (professionalism between 1 and 5),
  comment text not null,
  evaluated_at timestamptz not null default now()
);

create table if not exists final_project_evaluations (
  project_id text not null references projects(id),
  student_id text not null references users(id),
  avg_communication double precision not null,
  avg_responsibility double precision not null,
  avg_quality double precision not null,
  avg_deadline double precision not null,
  avg_problem_solving double precision not null,
  avg_professionalism double precision not null,
  overall_satisfaction double precision not null,
  hiring_decision hiring_decision not null,
  feedback text not null,
  completed_at timestamptz not null default now(),
  primary key (project_id, student_id)
);

create table if not exists company_evaluations (
  id text primary key default gen_random_uuid()::text,
  project_id text not null references projects(id),
  student_id text not null references users(id),
  company_id text not null references users(id),
  communication integer not null check (communication between 1 and 5),
  feedback_quality integer not null check (feedback_quality between 1 and 5),
  mentorship integer not null check (mentorship between 1 and 5),
  task_clarity integer not null check (task_clarity between 1 and 5),
  response_speed integer not null check (response_speed between 1 and 5),
  respect integer not null check (respect between 1 and 5),
  learning_opportunity integer not null check (learning_opportunity between 1 and 5),
  work_environment integer not null check (work_environment between 1 and 5),
  professionalism integer not null check (professionalism between 1 and 5),
  comment text not null,
  submitted_at timestamptz not null default now()
);

create table if not exists student_warnings (
  id text primary key default gen_random_uuid()::text,
  student_id text not null references users(id),
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references users(id),
  title text not null,
  message text not null,
  type text not null check (type in ('info', 'success', 'warning', 'error')),
  priority text not null default 'NORMAL' check (priority in ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),
  category text not null default 'SYSTEM' check (category in ('PROJECT', 'APPLICATION', 'MATCHING', 'FEEDBACK', 'REMINDER', 'SYSTEM', 'AI', 'TRUST', 'PERFORMANCE')),
  channels text[] not null default '{IN_APP}',
  is_read boolean not null default false,
  read_at timestamptz,
  archived_at timestamptz,
  dismissed_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key default gen_random_uuid()::text,
  actor_id text references users(id),
  actor_role user_role not null,
  action text not null,
  resource_type text not null,
  resource_id text not null,
  decision text not null check (decision in ('ALLOW', 'DENY')),
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists domain_events (
  id text primary key default gen_random_uuid()::text,
  type text not null,
  actor_id text references users(id),
  aggregate_id text not null,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists trust_scores (
  entity_id text not null,
  entity_type text not null check (entity_type in ('STUDENT', 'COMPANY', 'PROJECT')),
  score integer not null check (score between 0 and 100),
  evidence text[] not null default '{}',
  recalculated_at timestamptz not null default now(),
  primary key (entity_id, entity_type)
);

create table if not exists profile_versions (
  id text primary key default gen_random_uuid()::text,
  profile_type text not null check (profile_type in ('STUDENT', 'COMPANY')),
  profile_id text not null,
  version integer not null check (version > 0),
  changed_by text not null references users(id),
  changed_fields text[] not null default '{}',
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique (profile_type, profile_id, version)
);

create index if not exists idx_projects_company_status on projects(company_id, status);
create index if not exists idx_applications_project_status on applications(project_id, status);
create index if not exists idx_applications_student_status on applications(student_id, status);
create index if not exists idx_weekly_submissions_project_student on weekly_submissions(project_id, student_id);
create index if not exists idx_weekly_evaluations_student on weekly_evaluations(student_id);
create index if not exists idx_notifications_user_read on notifications(user_id, is_read);
create index if not exists idx_notifications_user_lifecycle on notifications(user_id, is_read, archived_at, dismissed_at, created_at desc);
create index if not exists idx_notifications_category_priority on notifications(category, priority, created_at desc);
create index if not exists idx_audit_logs_actor_created on audit_logs(actor_id, created_at desc);
create index if not exists idx_domain_events_type_created on domain_events(type, occurred_at desc);
create index if not exists idx_profile_versions_profile on profile_versions(profile_type, profile_id, version desc);
create index if not exists idx_auth_credentials_updated on auth_credentials(updated_at desc);

alter table users enable row level security;
alter table auth_credentials enable row level security;
alter table student_profiles enable row level security;
alter table company_profiles enable row level security;
alter table projects enable row level security;
alter table applications enable row level security;
alter table weekly_submissions enable row level security;
alter table weekly_evaluations enable row level security;
alter table final_project_evaluations enable row level security;
alter table company_evaluations enable row level security;
alter table student_warnings enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table domain_events enable row level security;
alter table trust_scores enable row level security;
alter table profile_versions enable row level security;

create policy "users can read their own account" on users for select using (auth.uid()::text = id);
create policy "users cannot read password hashes directly" on auth_credentials for select using (false);
create policy "students can read their own profile" on student_profiles for select using (auth.uid()::text = user_id);
create policy "companies can read their own profile" on company_profiles for select using (auth.uid()::text = user_id);
create policy "verified users can read open projects" on projects for select using (status in ('OPEN', 'RUNNING', 'COMPLETED'));
create policy "students can read own applications" on applications for select using (auth.uid()::text = student_id);
create policy "companies can read project applications" on applications for select using (
  exists (select 1 from projects where projects.id = applications.project_id and projects.company_id = auth.uid()::text)
);
create policy "students can read own submissions" on weekly_submissions for select using (auth.uid()::text = student_id);
create policy "students can read own evaluations" on weekly_evaluations for select using (auth.uid()::text = student_id);
create policy "users can read own notifications" on notifications for select using (auth.uid()::text = user_id);
create policy "users can read own trust scores" on trust_scores for select using (auth.uid()::text = entity_id);
create policy "users can read own profile versions" on profile_versions for select using (
  auth.uid()::text = profile_id or auth.uid()::text = changed_by
);
`;

export const restApiContract = [
  'POST /api/auth/register',
  'POST /api/auth/login',
  'POST /api/projects',
  'GET /api/projects',
  'PATCH /api/projects/:projectId/status',
  'POST /api/projects/:projectId/applications',
  'PATCH /api/applications/:applicationId/status',
  'POST /api/projects/:projectId/submissions',
  'POST /api/submissions/:submissionId/evaluations',
  'POST /api/projects/:projectId/final-evaluations',
  'POST /api/admin/verifications/:userId/approve',
  'POST /api/admin/students/:studentId/warnings',
  'GET /api/audit-logs',
  'GET /api/trust-scores/:entityType/:entityId',
  'PATCH /api/students/:studentId/profile',
  'PATCH /api/companies/:companyId/profile',
  'GET /api/notifications',
  'PATCH /api/notifications/:notificationId/:action',
  'PATCH /api/notifications/read-all'
] as const;
