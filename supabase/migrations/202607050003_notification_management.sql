alter table notifications
  add column if not exists priority text not null default 'NORMAL' check (priority in ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),
  add column if not exists category text not null default 'SYSTEM' check (category in ('PROJECT', 'APPLICATION', 'MATCHING', 'FEEDBACK', 'REMINDER', 'SYSTEM', 'AI', 'TRUST', 'PERFORMANCE')),
  add column if not exists channels text[] not null default '{IN_APP}',
  add column if not exists read_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists dismissed_at timestamptz,
  add column if not exists scheduled_for timestamptz;

create index if not exists idx_notifications_user_lifecycle
  on notifications(user_id, is_read, archived_at, dismissed_at, created_at desc);

create index if not exists idx_notifications_category_priority
  on notifications(category, priority, created_at desc);

create policy "users can update own notification lifecycle" on notifications
  for update using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);
