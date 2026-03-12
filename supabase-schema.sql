-- ═══════════════════════════════════════════════════════════════════════
--  UOG PAST PAPERS — SUPABASE DATABASE SCHEMA
--  Run this entire file in: Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. Papers table ──────────────────────────────────────────────────────
create table if not exists papers (
  id           uuid primary key default gen_random_uuid(),
  course_name  text not null,
  course_code  text,
  faculty      text not null,
  department   text not null,
  degree       text not null,
  semester     int  not null check (semester between 1 and 8),
  shift        text not null check (shift in ('Morning', 'Evening')),
  exam_type    text not null check (exam_type in ('Mid Term', 'Final Term', 'Quiz', 'Assignment')),
  year         int  not null,
  file_url     text not null,
  file_name    text not null,
  teacher_name text,
  uploaded_by  text not null,
  is_approved  boolean default false,
  created_at   timestamptz default now()
);

-- ── 2. Indexes for fast filtering ────────────────────────────────────────
create index if not exists idx_papers_faculty     on papers(faculty);
create index if not exists idx_papers_department  on papers(department);
create index if not exists idx_papers_semester    on papers(semester);
create index if not exists idx_papers_exam_type   on papers(exam_type);
create index if not exists idx_papers_year        on papers(year);
create index if not exists idx_papers_is_approved on papers(is_approved);
create index if not exists idx_papers_course_name on papers using gin(to_tsvector('english', course_name));

-- ── 3. Row Level Security (RLS) ───────────────────────────────────────────
alter table papers enable row level security;

-- Anyone can read approved papers (no login required to browse)
create policy "Public can read approved papers"
  on papers for select
  using (is_approved = true);

-- Logged-in users can insert papers
create policy "Authenticated users can upload"
  on papers for insert
  to authenticated
  with check (auth.email() = uploaded_by);

-- Only the uploader or admin can update/delete their own papers
-- (For admin approval, you'll do this via Supabase Dashboard or service role)
create policy "Uploader can manage own papers"
  on papers for update
  to authenticated
  using (auth.email() = uploaded_by);

-- ── 4. Storage bucket ─────────────────────────────────────────────────────
-- Run this to create the storage bucket for PDFs:
insert into storage.buckets (id, name, public)
values ('papers', 'papers', true)
on conflict do nothing;

-- Allow anyone to read files (public bucket)
create policy "Public can read papers"
  on storage.objects for select
  using (bucket_id = 'papers');

-- Allow authenticated users to upload
create policy "Authenticated users can upload papers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'papers');

-- ── 5. Admin helper: approve a paper ─────────────────────────────────────
-- Run this manually to approve a specific paper by its ID:
-- update papers set is_approved = true where id = 'PAPER_UUID_HERE';

-- ── 6. View: approved papers count per department ────────────────────────
create or replace view department_stats as
  select
    department,
    faculty,
    count(*) as total_papers,
    max(year) as latest_year
  from papers
  where is_approved = true
  group by department, faculty
  order by total_papers desc;
