
-- Helper: updated_at trigger function
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Opportunity submissions (public form, write-only for anon/auth)
create table public.opportunity_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  org text not null,
  category text not null,
  url text not null,
  deadline date,
  cost text,
  format text,
  grades int[] default '{}',
  description text not null,
  submitter_email text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.opportunity_submissions enable row level security;
create policy "Anyone can submit opportunities"
  on public.opportunity_submissions for insert
  to anon, authenticated
  with check (true);

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  reason text not null,
  email text not null,
  message text not null,
  related_url text,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "Anyone can send contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Reminder preferences (per user / opportunity)
create table public.reminder_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null,
  intervals int[] not null default '{7,3,1}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
alter table public.reminder_preferences enable row level security;
create policy "Users read their reminders"
  on public.reminder_preferences for select to authenticated
  using (auth.uid() = user_id);
create policy "Users insert their reminders"
  on public.reminder_preferences for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Users update their reminders"
  on public.reminder_preferences for update to authenticated
  using (auth.uid() = user_id);
create policy "Users delete their reminders"
  on public.reminder_preferences for delete to authenticated
  using (auth.uid() = user_id);
create trigger reminder_prefs_updated_at before update on public.reminder_preferences
  for each row execute function public.set_updated_at();

-- Shared (public) collections
create table public.shared_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null default '✨',
  opportunity_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shared_collections enable row level security;
create policy "Public can read shared collections"
  on public.shared_collections for select to anon, authenticated
  using (true);
create policy "Owner can insert shared collection"
  on public.shared_collections for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Owner can update shared collection"
  on public.shared_collections for update to authenticated
  using (auth.uid() = user_id);
create policy "Owner can delete shared collection"
  on public.shared_collections for delete to authenticated
  using (auth.uid() = user_id);
create trigger shared_collections_updated_at before update on public.shared_collections
  for each row execute function public.set_updated_at();
