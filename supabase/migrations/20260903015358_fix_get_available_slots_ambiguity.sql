-- Fix ambiguous column reference "r" in get_available_slots RPC
-- Removes unused local variable `r` and clarifies loop subquery aliases.

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

    select coalesce(day_elem->'ranges', '[]'::jsonb)
      into v_ranges
      from jsonb_array_elements(v_work_hours) day_elem
     where day_elem->>'day' = v_weekday;

    select coalesce(jsonb_agg(
      jsonb_build_object(
        'start', slot_elem->>'start',
        'end', slot_elem->>'end',
        'booked', v_booked @> to_jsonb(v_date::text || '|' || slot_elem->>'start')
      )
    ), '[]'::jsonb)
      into v_slots
      from jsonb_array_elements(v_ranges) slot_elem;

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
