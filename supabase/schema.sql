-- ====================================================================
-- APEXTRACK STUDY OPERATING SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text not null,
  target_exam text not null default 'JEE Advanced',
  target_year integer not null default 2026,
  exam_date date,
  avatar_url text,
  peer_code text unique not null,
  live_status text default 'idle', -- 'focusing', 'idle', 'offline'
  current_subject text,
  streak_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER SETTINGS
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

-- 3. TASKS
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  subject text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null check (status in ('todo', 'in_progress', 'done')),
  date date not null default current_date,
  estimated_duration integer default 30, -- in minutes
  linked_chapter_id text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TARGETS
create table if not exists public.targets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null check (category in ('weekly', 'long_term')),
  subject text,
  start_date date not null default current_date,
  target_date date not null,
  current_progress integer default 0,
  max_progress integer default 100,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. FOCUS SESSIONS
create table if not exists public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  duration_seconds integer not null,
  mode text not null check (mode in ('flow', 'pomodoro', 'custom')),
  date date not null default current_date,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  notes text,
  linked_task_id uuid references public.tasks(id) on delete set null,
  quality_rating integer check (quality_rating between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SYLLABUS SUBJECTS, UNITS & CHAPTERS
create table if not exists public.syllabus_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id text not null,
  unit_id text not null,
  chapter_id text not null,
  status text not null default 'not_started' check (status in ('not_started', 'learning', 'revision', 'completed')),
  notes text,
  last_revised_at timestamp with time zone,
  unique (user_id, chapter_id)
);

create table if not exists public.chapter_resources (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  chapter_id text not null,
  title text not null,
  resource_type text not null check (resource_type in ('book', 'notes', 'video', 'website', 'other')),
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. MOCK TESTS
create table if not exists public.mock_tests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_name text not null,
  category text not null, -- 'Full Length', 'Sectional', 'Chapterwise'
  date date not null default current_date,
  max_marks numeric not null,
  obtained_marks numeric not null,
  target_score numeric,
  attempted_questions integer,
  correct_questions integer,
  subject_scores jsonb, -- e.g. [{"subject": "Physics", "marks": 85, "maxMarks": 100}]
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. ERROR LOGS
create table if not exists public.error_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  chapter text not null,
  topic text,
  mistake_type text not null check (mistake_type in ('conceptual', 'calculation', 'silly_mistake', 'formula', 'time_management')),
  description text not null,
  corrective_action text,
  linked_mock_id uuid references public.mock_tests(id) on delete set null,
  date date not null default current_date,
  is_mastered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. DAILY QUESTION LOGS
create table if not exists public.daily_question_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  target_count integer not null default 50,
  solved_count integer not null default 0,
  subject_breakdown jsonb, -- e.g. {"Physics": 20, "Maths": 30}
  unique (user_id, date)
);

-- 10. PEER CONNECTIONS
create table if not exists public.peer_connections (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (requester_id, receiver_id)
);

-- 11. STUDY GROUPS
create table if not exists public.study_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  target_exam text not null,
  invite_code text unique not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.group_members (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.study_groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (group_id, user_id)
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.tasks enable row level security;
alter table public.targets enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.syllabus_progress enable row level security;
alter table public.chapter_resources enable row level security;
alter table public.mock_tests enable row level security;
alter table public.error_logs enable row level security;
alter table public.daily_question_logs enable row level security;
alter table public.peer_connections enable row level security;
alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;

-- Profiles: Anyone authenticated can read basic profiles (for peers/groups/leaderboards); users can update their own
create policy "Public profiles are readable by authenticated users"
  on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Personal tables (Settings, Tasks, Targets, Sessions, Syllabus, Mocks, Errors, Questions)
create policy "Users can CRUD own settings"
  on public.user_settings for all using (auth.uid() = user_id);

create policy "Users can CRUD own tasks"
  on public.tasks for all using (auth.uid() = user_id);

create policy "Users can CRUD own targets"
  on public.targets for all using (auth.uid() = user_id);

create policy "Users can CRUD own focus sessions"
  on public.focus_sessions for all using (auth.uid() = user_id);

create policy "Users can CRUD own syllabus progress"
  on public.syllabus_progress for all using (auth.uid() = user_id);

create policy "Users can CRUD own chapter resources"
  on public.chapter_resources for all using (auth.uid() = user_id);

create policy "Users can CRUD own mock tests"
  on public.mock_tests for all using (auth.uid() = user_id);

create policy "Users can CRUD own error logs"
  on public.error_logs for all using (auth.uid() = user_id);

create policy "Users can CRUD own daily question logs"
  on public.daily_question_logs for all using (auth.uid() = user_id);

-- Peer connections: Viewable and manageable by either party
create policy "Peers can view connections"
  on public.peer_connections for select using (auth.uid() = requester_id or auth.uid() = receiver_id);
create policy "Users can send peer requests"
  on public.peer_connections for insert with check (auth.uid() = requester_id);
create policy "Users can update received or sent requests"
  on public.peer_connections for update using (auth.uid() = requester_id or auth.uid() = receiver_id);
create policy "Users can delete peer connections"
  on public.peer_connections for delete using (auth.uid() = requester_id or auth.uid() = receiver_id);

-- Study groups: Members can view groups; Admins/Owners can manage
create policy "Group members can view group"
  on public.study_groups for select using (
    exists (select 1 from public.group_members where group_members.group_id = study_groups.id and group_members.user_id = auth.uid())
    or owner_id = auth.uid()
  );
create policy "Authenticated users can create study groups"
  on public.study_groups for insert with check (auth.uid() = owner_id);

create policy "Group members list readable by group members"
  on public.group_members for select using (
    exists (select 1 from public.group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid())
  );
create policy "Users can join groups"
  on public.group_members for insert with check (auth.uid() = user_id);
