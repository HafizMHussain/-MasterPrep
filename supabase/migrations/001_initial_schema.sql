-- =====================================================
-- USMLE Prep Platform — Complete Database Schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor)
-- =====================================================

-- ─── 1. PROFILES ─────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  phone text,
  location text,
  medical_school text,
  current_step text,
  bio text,
  target_exam_date date,
  daily_goal integer default 80,
  plan text default 'free' check (plan in ('free', 'pro', 'premium')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

-- Trigger: run after every new auth signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── 2. QUESTIONS ────────────────────────────────────
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  explanation text,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  system text,         -- organ system: Cardiovascular, Endocrine, etc.
  topic text,          -- subject: Pathology, Pharmacology, etc.
  image_url text,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─── 3. QUESTION OPTIONS ─────────────────────────────
create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade not null,
  option_text text not null,
  is_correct boolean default false,
  sort_order integer default 0
);

-- ─── 4. ATTEMPTS ─────────────────────────────────────
-- Tracks every question attempt by a user
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  selected_option uuid references public.question_options(id),
  correct boolean,
  time_taken integer,  -- seconds
  mode text default 'tutor' check (mode in ('tutor', 'exam', 'timed')),
  created_at timestamp with time zone default now()
);

-- ─── 5. BOOKMARKS ────────────────────────────────────
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique (user_id, question_id)
);

-- ─── 6. MOCK EXAMS ───────────────────────────────────
create table if not exists public.mock_exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration integer not null,      -- minutes
  total_questions integer not null,
  difficulty text default 'Mixed' check (difficulty in ('Easy', 'Medium', 'Hard', 'Mixed')),
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

-- ─── 7. MOCK EXAM QUESTIONS ──────────────────────────
-- Links questions to exams (many-to-many)
create table if not exists public.mock_exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references public.mock_exams(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  sort_order integer default 0,
  unique (exam_id, question_id)
);

-- ─── 8. MOCK EXAM ATTEMPTS ──────────────────────────
-- Tracks a user's attempt at a full mock exam
create table if not exists public.mock_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  exam_id uuid references public.mock_exams(id) on delete cascade not null,
  score integer,
  total_correct integer,
  total_attempted integer,
  time_spent integer,  -- seconds
  completed boolean default false,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- ─── 9. STUDY PLANS ─────────────────────────────────
create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  daily_goal integer default 80,
  exam_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─── 10. STUDY TASKS ────────────────────────────────
create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.study_plans(id) on delete cascade not null,
  title text not null,
  type text default 'study' check (type in ('study', 'review', 'exam', 'break')),
  subject text,
  duration text,
  scheduled_date date,
  completed boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- ─── 11. BLOGS ──────────────────────────────────────
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category text,
  cover_image text,
  author_name text,
  read_time text,
  published boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─── 12. CONSULTATIONS ──────────────────────────────
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  full_name text not null,
  email text not null,
  phone text,
  consultation_type text,
  current_step text,
  target_exam_date date,
  preferred_datetime timestamp with time zone,
  notes text,
  status text default 'pending' check (status in ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─── 13. ANNOUNCEMENTS ──────────────────────────────
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  type text default 'update' check (type in ('update', 'maintenance', 'feature', 'promo')),
  published boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);


-- =====================================================
-- INDEXES — Optimize common queries
-- =====================================================

create index if not exists idx_attempts_user_id on public.attempts(user_id);
create index if not exists idx_attempts_question_id on public.attempts(question_id);
create index if not exists idx_attempts_created_at on public.attempts(created_at);
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_questions_system on public.questions(system);
create index if not exists idx_questions_topic on public.questions(topic);
create index if not exists idx_questions_difficulty on public.questions(difficulty);
create index if not exists idx_mock_exam_attempts_user on public.mock_exam_attempts(user_id);
create index if not exists idx_blogs_slug on public.blogs(slug);
create index if not exists idx_blogs_published on public.blogs(published);
create index if not exists idx_consultations_status on public.consultations(status);
create index if not exists idx_study_tasks_plan on public.study_tasks(plan_id);


-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.attempts enable row level security;
alter table public.bookmarks enable row level security;
alter table public.mock_exams enable row level security;
alter table public.mock_exam_questions enable row level security;
alter table public.mock_exam_attempts enable row level security;
alter table public.study_plans enable row level security;
alter table public.study_tasks enable row level security;
alter table public.blogs enable row level security;
alter table public.consultations enable row level security;
alter table public.announcements enable row level security;

-- ── Helper: Check if user is admin ──
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── PROFILES ──
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update using (public.is_admin());

-- ── QUESTIONS ──
create policy "Anyone authenticated can read questions"
  on public.questions for select using (auth.role() = 'authenticated');

create policy "Admins can insert questions"
  on public.questions for insert with check (public.is_admin());

create policy "Admins can update questions"
  on public.questions for update using (public.is_admin());

create policy "Admins can delete questions"
  on public.questions for delete using (public.is_admin());

-- ── QUESTION OPTIONS ──
create policy "Anyone authenticated can read options"
  on public.question_options for select using (auth.role() = 'authenticated');

create policy "Admins can manage options"
  on public.question_options for all using (public.is_admin());

-- ── ATTEMPTS ──
create policy "Users can read own attempts"
  on public.attempts for select using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.attempts for insert with check (auth.uid() = user_id);

create policy "Admins can read all attempts"
  on public.attempts for select using (public.is_admin());

-- ── BOOKMARKS ──
create policy "Users can manage own bookmarks"
  on public.bookmarks for all using (auth.uid() = user_id);

-- ── MOCK EXAMS ──
create policy "Anyone authenticated can read exams"
  on public.mock_exams for select using (auth.role() = 'authenticated');

create policy "Admins can manage exams"
  on public.mock_exams for all using (public.is_admin());

-- ── MOCK EXAM QUESTIONS ──
create policy "Anyone authenticated can read exam questions"
  on public.mock_exam_questions for select using (auth.role() = 'authenticated');

create policy "Admins can manage exam questions"
  on public.mock_exam_questions for all using (public.is_admin());

-- ── MOCK EXAM ATTEMPTS ──
create policy "Users can manage own exam attempts"
  on public.mock_exam_attempts for all using (auth.uid() = user_id);

create policy "Admins can read all exam attempts"
  on public.mock_exam_attempts for select using (public.is_admin());

-- ── STUDY PLANS ──
create policy "Users can manage own study plans"
  on public.study_plans for all using (auth.uid() = user_id);

-- ── STUDY TASKS ──
create policy "Users can manage own study tasks"
  on public.study_tasks for all using (
    exists (
      select 1 from public.study_plans
      where study_plans.id = study_tasks.plan_id
      and study_plans.user_id = auth.uid()
    )
  );

-- ── BLOGS ──
create policy "Anyone can read published blogs"
  on public.blogs for select using (published = true);

create policy "Admins can read all blogs"
  on public.blogs for select using (public.is_admin());

create policy "Admins can manage blogs"
  on public.blogs for all using (public.is_admin());

-- ── CONSULTATIONS ──
create policy "Users can read own consultations"
  on public.consultations for select using (auth.uid() = user_id);

create policy "Anyone can insert consultations"
  on public.consultations for insert with check (true);

create policy "Admins can manage all consultations"
  on public.consultations for all using (public.is_admin());

-- ── ANNOUNCEMENTS ──
create policy "Anyone authenticated can read published announcements"
  on public.announcements for select using (published = true);

create policy "Admins can manage announcements"
  on public.announcements for all using (public.is_admin());


-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets (run these separately if needed)
-- insert into storage.buckets (id, name, public) values ('question-images', 'question-images', true);
-- insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true);
-- insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
