-- Settings + Appointments for session scheduling
--
-- settings:
--   One row per authenticated user. Stores dynamic work hours (JSONB array of
--   { day: 'monday'..'sunday', ranges: [{ start: '09:00', end: '10:30' }] }),
--   the owner timezone (default America/Denver — client is in Utah) and the
--   Google Calendar OAuth tokens (kept private, RLS owner-only).
--
-- appointments:
--   Bookings created by public visitors from /[locale]/contact. Public can
--   insert (book), only authenticated can read/update/delete.

-- ─── Settings ──────────────────────────────────────────────

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  work_hours jsonb not null default '[]'::jsonb,
  timezone text not null default 'America/Denver',
  google_tokens jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.settings is 'Per-user scheduling settings: work hours, timezone, Google Calendar tokens';
comment on column public.settings.work_hours is 'JSONB array of { day, ranges: [{ start, end }] }';
comment on column public.settings.google_tokens is 'Google OAuth tokens (access/refresh) — never exposed publicly';

alter table public.settings enable row level security;

create policy "Users can read own settings"
  on public.settings
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.settings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.settings
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.settings to authenticated;

-- ─── Appointments ──────────────────────────────────────────

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  date date not null,
  start_time time not null,
  end_time time not null,
  timezone text not null default 'America/Denver',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  google_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.appointments is 'Session bookings made by visitors from the contact page';

create index idx_appointments_date on public.appointments (date);

-- Hard double-booking guard: only one active (non-cancelled) appointment
-- per date + start time. Cancelled slots free up for re-booking.
create unique index idx_appointments_unique_active_slot
  on public.appointments (date, start_time)
  where status <> 'cancelled';

alter table public.appointments enable row level security;

-- Anyone (visitor on the contact page) can book a session
create policy "Anyone can create appointments"
  on public.appointments
  for insert
  to anon, authenticated
  with check (true);

-- Only panel users can read/manage bookings
create policy "Authenticated can read appointments"
  on public.appointments
  for select
  to authenticated
  using (true);

create policy "Authenticated can update appointments"
  on public.appointments
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete appointments"
  on public.appointments
  for delete
  to authenticated
  using (true);

grant select, insert, update, delete on public.appointments to anon, authenticated;

-- ─── Public availability RPC ───────────────────────────────
-- Security definer: lets anon visitors compute available slots without
-- exposing settings.google_tokens or other owners' appointment data.
-- Returns { timezone, days: [{ date, weekday, slots: [{ start, end, booked }] }] }
-- for the next p_days days starting today in the owner timezone.

create or replace function public.get_available_slots(p_days int default 14)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_timezone text;
  v_work_hours jsonb;
  v_today date;
  v_booked jsonb;
  v_days jsonb := '[]'::jsonb;
  v_weekdays text[] := array['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  v_date date;
  v_weekday text;
  v_ranges jsonb;
  v_slots jsonb;
  r record;
begin
  select s.timezone, s.work_hours
    into v_timezone, v_work_hours
    from public.settings s
   order by s.created_at
   limit 1;

  v_timezone := coalesce(v_timezone, 'America/Denver');
  v_work_hours := coalesce(v_work_hours, '[]'::jsonb);

  v_today := (now() at time zone v_timezone)::date;

  select coalesce(jsonb_agg(to_jsonb(a.date::text || '|' || to_char(a.start_time, 'HH24:MI'))), '[]'::jsonb)
    into v_booked
    from public.appointments a
   where a.date between v_today and v_today + p_days - 1
     and a.status <> 'cancelled';

  for i in 0..(p_days - 1) loop
    v_date := v_today + i;
    v_weekday := v_weekdays[extract(dow from v_date)::int + 1];

    select coalesce(r->'ranges', '[]'::jsonb)
      into v_ranges
      from jsonb_array_elements(v_work_hours) r
     where r->>'day' = v_weekday;

    select coalesce(jsonb_agg(
      jsonb_build_object(
        'start', rr->>'start',
        'end', rr->>'end',
        'booked', v_booked @> to_jsonb(v_date::text || '|' || rr->>'start')
      )
    ), '[]'::jsonb)
      into v_slots
      from jsonb_array_elements(v_ranges) rr;

    v_days := v_days || jsonb_build_object(
      'date', v_date::text,
      'weekday', v_weekday,
      'slots', v_slots
    );
  end loop;

  return jsonb_build_object('timezone', v_timezone, 'days', v_days);
end;
$$;

grant execute on function public.get_available_slots(int) to anon, authenticated;