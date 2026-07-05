create extension if not exists pgcrypto;

do $$ begin
  create type user_role as enum ('STUDENT', 'COMPANY', 'ADMIN', 'SUPER_ADMIN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_status as enum ('PENDING', 'VERIFIED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('DRAFT', 'PENDING_APPROVAL', 'OPEN', 'MATCHED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CLOSED', 'CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type hiring_decision as enum ('HIRE', 'TALENT_POOL', 'REJECT', 'FUTURE_CONTACT', 'PENDING');
exception when duplicate_object then null; end $$;

create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  role user_role not null,
  is_verified boolean not null default false,
  status user_status not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists student_profiles (
  user_id text primary key references users(id) on delete cascade,
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
  user_id text primary key references users(id) on delete cascade,
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
  is_read boolean not null default false,
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

create index if not exists idx_projects_company_status on projects(company_id, status);
create index if not exists idx_applications_project_status on applications(project_id, status);
create index if not exists idx_applications_student_status on applications(student_id, status);
create index if not exists idx_weekly_submissions_project_student on weekly_submissions(project_id, student_id);
create index if not exists idx_weekly_evaluations_student on weekly_evaluations(student_id);
create index if not exists idx_notifications_user_read on notifications(user_id, is_read);
create index if not exists idx_audit_logs_actor_created on audit_logs(actor_id, created_at desc);
create index if not exists idx_domain_events_type_created on domain_events(type, occurred_at desc);

alter table users enable row level security;
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

create policy "users can read their own account" on users for select using (auth.uid()::text = id);
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
