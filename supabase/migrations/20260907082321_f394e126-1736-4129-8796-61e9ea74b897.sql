create table public.volunteer_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  grade int,
  school text,
  interests text[] not null default '{}',
  hours_per_week text,
  portfolio_url text,
  motivation text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

grant insert on public.volunteer_signups to anon, authenticated;
grant all on public.volunteer_signups to service_role;

alter table public.volunteer_signups enable row level security;

create policy "Anyone can sign up to volunteer"
on public.volunteer_signups
for insert
to anon, authenticated
with check (
  length(full_name) between 1 and 120
  and length(email) between 3 and 255
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and (grade is null or grade between 9 and 12)
  and (school is null or length(school) <= 160)
  and (portfolio_url is null or length(portfolio_url) <= 500)
  and length(motivation) between 1 and 2000
  and array_length(interests, 1) is distinct from 0
  and status = 'pending'
);

create index volunteer_signups_created_at_idx
  on public.volunteer_signups (created_at desc);