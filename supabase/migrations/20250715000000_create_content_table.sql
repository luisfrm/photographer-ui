-- Create content table for CMS data
-- Stores editable website content by section + locale

create table public.content (
  id bigint generated always as identity primary key,
  section text not null,        -- e.g. 'home.hero', 'about.hero', 'services.packages'
  locale text not null default 'en',
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section, locale)
);

comment on table public.content is 'CMS content storage for editable website sections';

-- Index for common lookups
create index idx_content_section_locale on public.content (section, locale);

-- Enable RLS
alter table public.content enable row level security;

-- Allow public read access (content is public)
create policy "Allow public read access to content"
  on public.content
  for select
  using (true);

-- Allow authenticated users to manage content (uses TO clause, not deprecated auth.role())
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

-- Seed default hero content for 'en'
insert into public.content (section, locale, data) values
  ('home.hero', 'en', '{
    "title": "DnovaGallery",
    "subtitle": "It'\''s not the <strong>camera</strong> who makes the photographer, it'\''s the <strong>photographer</strong> who makes the camera.",
    "cta": "Book a session",
    "ctaUrl": "/contact",
    "ctaNewTab": false,
    "backgroundImage1": "",
    "backgroundImage2": ""
  }'::jsonb)
on conflict (section, locale) do nothing;

-- Seed default hero content for 'es'
insert into public.content (section, locale, data) values
  ('home.hero', 'es', '{
    "title": "DnovaGallery",
    "subtitle": "No es la <strong>cámara</strong> quien hace al fotógrafo, es el <strong>fotógrafo</strong> quien hace la cámara.",
    "cta": "Reserva una sesión",
    "ctaUrl": "/contact",
    "ctaNewTab": false,
    "backgroundImage1": "",
    "backgroundImage2": ""
  }'::jsonb)
on conflict (section, locale) do nothing;
