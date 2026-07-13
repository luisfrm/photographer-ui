-- Create languages table
-- Used by generateStaticParams and locale validation

create table public.languages (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add comment
comment on table public.languages is 'Supported locales/languages for the application';

-- Create index for active languages (most common query)
create index idx_languages_active on public.languages (code) where is_active = true;

-- Enable RLS (required for Supabase Data API exposure)
alter table public.languages enable row level security;

-- Allow public read access (languages are public data)
create policy "Allow public read access to languages"
  on public.languages
  for select
  using (is_active = true);

-- Grant access to anon and authenticated roles
grant select on public.languages to anon;
grant select on public.languages to authenticated;

-- Insert default locales
insert into public.languages (code, name, is_active) values
  ('en', 'English', true),
  ('es', 'Español', true)
on conflict (code) do nothing;
