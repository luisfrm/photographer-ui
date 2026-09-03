-- Add session_duration column to public.settings (in minutes, default 60)
alter table public.settings
  add column if not exists session_duration int not null default 60;

comment on column public.settings.session_duration is 'Default session duration in minutes, used to compute end times and validate minimum time separation';
