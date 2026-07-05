export const konexaPostgresSchema = `
create extension if not exists pgcrypto;

create type user_role as enum ('STUDENT', 'COMPANY', 'ADMIN', 'SUPER_ADMIN');
create type user_status as enum ('PENDING', 'VERIFIED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
create type project_status as enum ('DRAFT', 'PENDING_APPROVAL', 'OPEN', 'MATCHED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CLOSED', 'CANCELLED');
create type application_status as enum ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
create type hiring_decision as enum ('HIRE', 'TALENT_POOL', 'REJECT', 'FUTURE_CONTACT', 'PENDING');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role user_role not null,
  is_verified boolean not null default false,
  status user_status not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists student_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  full_name text not null,
  avatar_url text not null,
  university text not null,
  major text not null,
  graduation_date text not null,
  english_proficiency text not null,
  skills text[] not null default '{}',
  portfolio_url text not null,
  github_url text not null,
  linkedin_url text not null,
  resume_file_name text,
  intro_video_url text,
  preferred_country text not null,
  preferred_industry text not null,
  preferred_role text not null,
  availability text not null
);

create table if not exists company_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  company_name text not null,
  logo_url text not null,
  industry text not null,
  website text not null,
  location text not null,
  company_size text not null,
  english_availability text not null,
  verification_status text not null check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED')),
  business_registration_file text
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references users(id),
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
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id),
  student_id uuid not null references users(id),
  status application_status not null default 'SUBMITTED',
  portfolio_url text,
  cover_letter text not null,
  applied_at timestamptz not null default now(),
  unique (project_id, student_id)
);

create table if not exists weekly_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id),
  student_id uuid not null references users(id),
  week_number integer not null check (week_number > 0),
  deliverable_file text not null,
  progress_report text not null,
  reflection text not null,
  is_evaluated boolean not null default false,
  submitted_at timestamptz not null default now(),
  unique (project_id, student_id, week_number)
);

create table if not exists weekly_evaluations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references weekly_submissions(id),
  project_id uuid not null references projects(id),
  student_id uuid not null references users(id),
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

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
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
  id uuid primary key default gen_random_uuid(),
  type text not null,
  actor_id uuid references users(id),
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

alter table users enable row level security;
alter table student_profiles enable row level security;
alter table company_profiles enable row level security;
alter table projects enable row level security;
alter table applications enable row level security;
alter table weekly_submissions enable row level security;
alter table weekly_evaluations enable row level security;
alter table audit_logs enable row level security;
alter table domain_events enable row level security;
alter table trust_scores enable row level security;
`;

export const restApiContract = [
  'POST /api/projects',
  'GET /api/projects',
  'POST /api/projects/:projectId/applications',
  'PATCH /api/applications/:applicationId/status',
  'POST /api/projects/:projectId/submissions',
  'POST /api/submissions/:submissionId/evaluations',
  'POST /api/projects/:projectId/final-evaluations',
  'POST /api/admin/verifications/:userId/approve',
  'POST /api/admin/students/:studentId/warnings',
  'GET /api/audit-logs',
  'GET /api/trust-scores/:entityType/:entityId'
] as const;
