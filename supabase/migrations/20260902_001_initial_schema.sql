-- ====================================================================
-- APEXTRACK STUDY OPERATING SYSTEM - COMPLETE DATABASE MIGRATION
-- ====================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text not null default 'Aspirant',
  avatar_url text,
  target_exam text not null default 'JEE Advanced',
  target_year integer not null default 2026,
  exam_date date default '2026-05-24',
  peer_code text unique not null default substring(md5(random()::text) from 1 for 8),
  live_status text default 'idle',
  current_subject text,
  streak_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. USER SETTINGS TABLE
create table if not exists public.user_settings (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  theme_mode text default 'dark',
  accent_color text default 'emerald',
  font_family text default 'Outfit',
  background_image text default 'none',
  background_opacity numeric default 0.15,
  day_rollover_hour integer default 6,
  show_countdown boolean default true,
  enable_focus_sounds boolean default true,
  pomodoro_focus_mins integer default 25,
  pomodoro_break_mins integer default 5,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TASKS TABLE
create table if not exists public.tasks (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  subject text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  date date not null default current_date,
  estimated_duration integer default 30,
  linked_chapter_id text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TARGETS TABLE
create table if not exists public.targets (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null default 'weekly' check (category in ('weekly', 'long_term')),
  subject text,
  start_date date not null default current_date,
  target_date date not null,
  current_progress numeric default 0,
  max_progress numeric default 100,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. FOCUS SESSIONS TABLE
create table if not exists public.focus_sessions (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  duration_seconds integer not null,
  mode text not null default 'pomodoro' check (mode in ('flow', 'pomodoro', 'custom')),
  date date not null default current_date,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  notes text,
  linked_task_id text,
  quality_rating integer check (quality_rating between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SYLLABUS PROGRESS TABLE
create table if not exists public.syllabus_progress (
  user_id uuid references public.profiles(id) on delete cascade not null,
  chapter_id text not null,
  status text not null default 'not_started' check (status in ('not_started', 'learning', 'revision', 'completed')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, chapter_id)
);

-- 8. MOCK TESTS TABLE
create table if not exists public.mock_tests (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_name text not null,
  category text not null default 'Full Length',
  date date not null default current_date,
  max_marks numeric not null,
  obtained_marks numeric not null,
  target_score numeric,
  attempted_questions integer,
  correct_questions integer,
  subject_scores jsonb default '[]'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ERROR / MISTAKE LOGS TABLE
create table if not exists public.error_logs (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  chapter text not null,
  topic text,
  mistake_type text not null default 'conceptual' check (mistake_type in ('conceptual', 'calculation', 'silly_mistake', 'formula', 'time_management')),
  description text not null,
  corrective_action text,
  linked_mock_id text,
  date date not null default current_date,
  is_mastered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. DAILY QUESTION LOGS TABLE
create table if not exists public.daily_question_logs (
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  solved_count integer default 0,
  target_count integer default 50,
  subject_breakdown jsonb default '{"Physics": 0, "Chemistry": 0, "Mathematics": 0}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, date)
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
create index if not exists idx_tasks_user_date on public.tasks(user_id, date);
create index if not exists idx_focus_sessions_user_date on public.focus_sessions(user_id, date);
create index if not exists idx_targets_user_category on public.targets(user_id, category);
create index if not exists idx_mock_tests_user_date on public.mock_tests(user_id, date);
create index if not exists idx_error_logs_user_subject on public.error_logs(user_id, subject);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.tasks enable row level security;
alter table public.targets enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.syllabus_progress enable row level security;
alter table public.mock_tests enable row level security;
alter table public.error_logs enable row level security;
alter table public.daily_question_logs enable row level security;

-- Profiles Policies
create policy "Users can view all public profiles"
  on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Settings Policies
create policy "Users can manage own settings"
  on public.user_settings for all using (auth.uid() = user_id);

-- Tasks Policies
create policy "Users can manage own tasks"
  on public.tasks for all using (auth.uid() = user_id);

-- Targets Policies
create policy "Users can manage own targets"
  on public.targets for all using (auth.uid() = user_id);

-- Focus Sessions Policies
create policy "Users can manage own focus sessions"
  on public.focus_sessions for all using (auth.uid() = user_id);

-- Syllabus Policies
create policy "Users can manage own syllabus progress"
  on public.syllabus_progress for all using (auth.uid() = user_id);

-- Mock Tests Policies
create policy "Users can manage own mock tests"
  on public.mock_tests for all using (auth.uid() = user_id);

-- Error Logs Policies
create policy "Users can manage own error logs"
  on public.error_logs for all using (auth.uid() = user_id);

-- Daily Questions Policies
create policy "Users can manage own daily questions"
  on public.daily_question_logs for all using (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ====================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
