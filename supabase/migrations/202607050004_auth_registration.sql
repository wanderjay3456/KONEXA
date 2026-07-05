create table if not exists auth_credentials (
  user_id text primary key references users(id) on delete cascade,
  password_hash text not null,
  password_salt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_auth_credentials_updated
  on auth_credentials(updated_at desc);

alter table auth_credentials enable row level security;

create policy "users cannot read password hashes directly" on auth_credentials
  for select using (false);
