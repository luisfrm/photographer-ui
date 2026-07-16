-- Create content table for CMS data
-- Single row per section, JSONB contains shared fields + nested locales.
-- Content is managed dynamically via the CMS editor, no seed data here.

create table public.content (
  id bigint generated always as identity primary key,
  section text not null unique,  -- e.g. 'home.hero', 'services.packages' (one row per section)
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.content is 'CMS content storage — one row per section, data contains shared fields + nested locales';

-- Index for lookups
create index idx_content_section on public.content (section);

-- Enable RLS
alter table public.content enable row level security;

-- Allow public read access (content is public)
create policy "Allow public read access to content"
  on public.content
  for select
  using (true);

-- Allow authenticated users to manage content
create policy "Allow authenticated insert to content"
  on public.content
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update to content"
  on public.content
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete to content"
  on public.content
  for delete
  to authenticated
  using (true);

-- Grant access
grant select on public.content to anon;
grant insert, update, delete on public.content to authenticated;
