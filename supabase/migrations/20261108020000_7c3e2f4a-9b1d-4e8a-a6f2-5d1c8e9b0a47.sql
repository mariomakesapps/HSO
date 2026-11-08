-- HSO internship application: resume upload and more about the applicant.

-- New answers on the application.
alter table public.volunteer_signups
  add column if not exists age int,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists time_zone text,
  add column if not exists contribution text,
  add column if not exists about text,
  add column if not exists experience text,
  add column if not exists referral_source text,
  add column if not exists resume_path text;

-- Same insert rule as before, plus limits on the new fields.
drop policy if exists "Anyone can sign up to volunteer" on public.volunteer_signups;

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
  and (age is null or age between 10 and 25)
  and (city is null or length(city) <= 120)
  and (country is null or length(country) <= 120)
  and (time_zone is null or length(time_zone) <= 80)
  and (contribution is null or length(contribution) <= 2000)
  and (about is null or length(about) <= 2000)
  and (experience is null or length(experience) <= 2000)
  and (referral_source is null or length(referral_source) <= 200)
  and (resume_path is null or resume_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9_.-]{1,90}\.(pdf|docx?)$')
);

-- Private bucket for resumes: 5 MB, PDF or Word only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'internship-resumes',
  'internship-resumes',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Applicants can upload a new resume but never list, read, replace or delete one.
-- HR gets a time-limited link made with the service role by send-form-notification.
drop policy if exists "Applicants can upload a resume" on storage.objects;

create policy "Applicants can upload a resume"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'internship-resumes'
  and name ~ '^[0-9a-f-]{36}/[A-Za-z0-9_.-]{1,90}\.(pdf|docx?)$'
);
