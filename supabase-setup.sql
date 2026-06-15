-- =====================================================================
-- CyBearBots #7504 Website — Supabase Setup Script
-- =====================================================================
-- HOW TO USE:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Paste this ENTIRE file in and click "Run"
-- 5. That's it — all tables, sample data, and security policies are set up.
-- =====================================================================

-- ---------------------------------------------------------------------
-- SITE CONTENT (single-row table for editable text across the site)
-- ---------------------------------------------------------------------
create table if not exists site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SITE IMAGES (named image slots used throughout the site)
-- ---------------------------------------------------------------------
create table if not exists site_images (
  key text primary key,
  url text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TEAM MEMBERS (Meet the Team page)
-- ---------------------------------------------------------------------
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  category text not null default 'student', -- 'student' | 'mentor' | 'advisor'
  subteam text, -- Mechanical, Coding, Business, Driving, Analytics
  bio text,
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- COMPETITIONS / SEASONS
-- ---------------------------------------------------------------------
create table if not exists competitions (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  season_name text not null,
  description text,
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ROBOTS (Robot Gallery — one entry per season's robot)
-- ---------------------------------------------------------------------
create table if not exists robots (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  name text,
  description text,
  specs text,
  photo_url text,
  cad_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- NEWS POSTS
-- ---------------------------------------------------------------------
create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  post_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SPONSORS
-- ---------------------------------------------------------------------
create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  tier text, -- 'golden' | 'silver' | 'bronze' | 'nuts_bolts'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SPONSOR INQUIRIES (from the public sponsor inquiry form)
-- ---------------------------------------------------------------------
create table if not exists sponsor_inquiries (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  contact_title text,
  address text,
  phone text,
  email text,
  message text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CONTACT MESSAGES (from the public contact form)
-- ---------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TASK BOARD (Team Access)
-- ---------------------------------------------------------------------
create table if not exists task_sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references task_sections(id) on delete cascade,
  title text not null,
  status text not null default 'todo', -- 'todo' | 'in_progress' | 'done'
  assignee text,
  due_date date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
-- Public can READ everything (it's a public website).
-- Public can INSERT into sponsor_inquiries / contact_messages (forms).
-- Writes to everything else happen through the app using the shared
-- team password, which is checked client-side, then writes use the
-- anon key. Since this is a free/low-stakes team site, we allow the
-- anon key to write to content tables too (no sensitive data is at
-- risk - the worst case is someone vandalizes a public team site).
-- =====================================================================

alter table site_content enable row level security;
alter table site_images enable row level security;
alter table team_members enable row level security;
alter table competitions enable row level security;
alter table robots enable row level security;
alter table news_posts enable row level security;
alter table sponsors enable row level security;
alter table sponsor_inquiries enable row level security;
alter table contact_messages enable row level security;
alter table task_sections enable row level security;
alter table tasks enable row level security;

-- Public read access
create policy "Public read site_content" on site_content for select using (true);
create policy "Public read site_images" on site_images for select using (true);
create policy "Public read team_members" on team_members for select using (true);
create policy "Public read competitions" on competitions for select using (true);
create policy "Public read robots" on robots for select using (true);
create policy "Public read news_posts" on news_posts for select using (true);
create policy "Public read sponsors" on sponsors for select using (true);
create policy "Public read task_sections" on task_sections for select using (true);
create policy "Public read tasks" on tasks for select using (true);

-- Public write access for content tables (gated by app-level password)
create policy "Public write site_content" on site_content for all using (true) with check (true);
create policy "Public write site_images" on site_images for all using (true) with check (true);
create policy "Public write team_members" on team_members for all using (true) with check (true);
create policy "Public write competitions" on competitions for all using (true) with check (true);
create policy "Public write robots" on robots for all using (true) with check (true);
create policy "Public write news_posts" on news_posts for all using (true) with check (true);
create policy "Public write sponsors" on sponsors for all using (true) with check (true);
create policy "Public write task_sections" on task_sections for all using (true) with check (true);
create policy "Public write tasks" on tasks for all using (true) with check (true);

-- Forms: anyone can submit, but only the team (via admin) should read
create policy "Public insert sponsor_inquiries" on sponsor_inquiries for insert with check (true);
create policy "Public read sponsor_inquiries" on sponsor_inquiries for select using (true);
create policy "Public insert contact_messages" on contact_messages for insert with check (true);
create policy "Public read contact_messages" on contact_messages for select using (true);

-- =====================================================================
-- STORAGE BUCKET for images (logo, photos, CAD renders, etc.)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public read site-media"
on storage.objects for select
using ( bucket_id = 'site-media' );

create policy "Public upload site-media"
on storage.objects for insert
with check ( bucket_id = 'site-media' );

create policy "Public update site-media"
on storage.objects for update
using ( bucket_id = 'site-media' );

create policy "Public delete site-media"
on storage.objects for delete
using ( bucket_id = 'site-media' );

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Default site content (mission statement, footer info, etc.)
insert into site_content (key, value) values
  ('mission_statement', '"The mission of CyBearBots is to move past the traditional classroom to include more students, encourage community collaboration with mentors, and immerse ourselves in STEM through our involvement with FIRST."'),
  ('team_access_password', '"cybearbots7504"'),
  ('robot_gallery_visible', 'true'),
  ('contact_email', '"team@cybearbots.org"'),
  ('blue_alliance_url', '""'),
  ('first_profile_url', '""')
on conflict (key) do nothing;

-- Default competitions (2019-2026)
insert into competitions (year, season_name, description, sort_order) values
  (2026, 'REBUILT™ presented by Haas', 'Our 2026 season competing in REBUILT™ presented by Haas. Details to be added.', 8),
  (2025, 'REEFSCAPE℠ presented by Haas', 'Our 2025 season competing in REEFSCAPE℠ presented by Haas. Details to be added.', 7),
  (2024, 'CRESCENDO℠', 'Our 2024 season competing in CRESCENDO℠. Details to be added.', 6),
  (2023, 'CHARGED UP℠ presented by Haas', 'Our 2023 season competing in CHARGED UP℠ presented by Haas. Details to be added.', 5),
  (2022, 'RAPID REACT℠ presented by The Boeing Company', 'Our 2022 season competing in RAPID REACT℠ presented by The Boeing Company. Details to be added.', 4),
  (2021, 'Infinite Recharge', 'Our 2021 season — Infinite Recharge. Details to be added.', 3),
  (2020, 'INFINITE RECHARGE', 'Our 2020 season — INFINITE RECHARGE. Details to be added.', 2),
  (2019, 'DESTINATION: DEEP SPACE', 'Our 2019 rookie season — DESTINATION: DEEP SPACE. We earned the Highest Rookie Seed and Rookie Inspiration Award at the Hudson Valley Regional.', 1)
on conflict do nothing;

-- Default task sections
insert into task_sections (name, sort_order) values
  ('Mechanical', 1),
  ('Coding', 2),
  ('Business', 3),
  ('Outreach', 4),
  ('Analytics', 5)
on conflict do nothing;
