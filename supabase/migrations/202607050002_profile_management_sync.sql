alter table student_profiles add column if not exists languages text[] not null default '{}';
alter table student_profiles add column if not exists certificates text[] not null default '{}';
alter table student_profiles add column if not exists biography text;
alter table student_profiles add column if not exists career_goals text;
alter table student_profiles add column if not exists contact_email text;
alter table student_profiles add column if not exists contact_phone text;
alter table student_profiles add column if not exists notification_preferences jsonb not null default '{}'::jsonb;
alter table student_profiles add column if not exists privacy_settings jsonb not null default '{}'::jsonb;
alter table student_profiles add column if not exists profile_version integer not null default 1;
alter table student_profiles add column if not exists updated_at timestamptz;

alter table company_profiles add column if not exists description text;
alter table company_profiles add column if not exists hiring_preferences text[] not null default '{}';
alter table company_profiles add column if not exists preferred_majors text[] not null default '{}';
alter table company_profiles add column if not exists preferred_skills text[] not null default '{}';
alter table company_profiles add column if not exists languages text[] not null default '{}';
alter table company_profiles add column if not exists recruitment_status text check (recruitment_status in ('OPEN', 'PAUSED', 'CLOSED'));
alter table company_profiles add column if not exists contact_email text;
alter table company_profiles add column if not exists contact_phone text;
alter table company_profiles add column if not exists notification_preferences jsonb not null default '{}'::jsonb;
alter table company_profiles add column if not exists team_members jsonb not null default '[]'::jsonb;
alter table company_profiles add column if not exists employer_branding text;
alter table company_profiles add column if not exists profile_version integer not null default 1;
alter table company_profiles add column if not exists updated_at timestamptz;

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

create index if not exists idx_profile_versions_profile on profile_versions(profile_type, profile_id, version desc);
create index if not exists idx_student_profiles_updated_at on student_profiles(updated_at desc);
create index if not exists idx_company_profiles_updated_at on company_profiles(updated_at desc);

alter table profile_versions enable row level security;

create policy "users can read own profile versions" on profile_versions for select using (
  auth.uid()::text = profile_id or auth.uid()::text = changed_by
);
