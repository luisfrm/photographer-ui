import { addDays } from "date-fns";
import { WEEKDAY_FROM_INDEX } from "@/lib/scheduling/constants";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type {
  Appointment,
  GeneratedDay,
  GeneratedSlot,
  TimeRange,
  Weekday,
  WorkDaySchedule,
} from "@/types/scheduling";

/** "2026-09-02" in the given timezone (en-CA yields YYYY-MM-DD). */
export function zonedDateKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Weekday of a YYYY-MM-DD date key (pure — independent of timezone). */
export function weekdayOfDateKey(dateKey: string): Weekday {
  const day = new Date(`${dateKey}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return WEEKDAY_FROM_INDEX[day] ?? "monday";
}

/** Ranges configured for a weekday (empty array if the day is off). */
export function getRangesForWeekday(
  workHours: WorkDaySchedule[],
  weekday: Weekday
): TimeRange[] {
  return workHours.find((d) => d.day === weekday)?.ranges ?? [];
}



/**
 * Generate `count` availability days starting from `from` (interpreted in the
 * owner timezone). Slots start unbooked — use `markBookedSlots` afterwards.
 */
export function generateSlots(
  workHours: WorkDaySchedule[],
  timeZone: string,
  from: Date,
  count: number
): GeneratedDay[] {
  const days: GeneratedDay[] = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(from, i);
    const dateKey = zonedDateKey(date, timeZone);
    const weekday = weekdayOfDateKey(dateKey);
    const ranges = getRangesForWeekday(workHours, weekday);
    days.push({
      date: dateKey,
      weekday,
      slots: ranges.map((r) => ({
        start: r.start,
        end: r.end,
        booked: false,
      })),
    });
  }
  return days;
}

/**
 * Mark slots as booked when a non-cancelled appointment exists for the same
 * date and start time.
 */
export function markBookedSlots(
  days: GeneratedDay[],
  appointments: Pick<Appointment, "date" | "start_time" | "status">[]
): GeneratedDay[] {
  return days.map((day) => ({
    ...day,
    slots: day.slots.map((slot) => ({
      ...slot,
      booked: appointments.some(
        (a) =>
          a.date === day.date &&
          a.start_time === slot.start &&
          a.status !== "cancelled"
      ),
    })),
  }));
}

/** Convenience: generate + mark booked in one call. */
export function buildAvailability(
  workHours: WorkDaySchedule[],
  timeZone: string,
  from: Date,
  count: number,
  appointments: Pick<Appointment, "date" | "start_time" | "status">[]
): GeneratedDay[] {
  return markBookedSlots(generateSlots(workHours, timeZone, from, count), appointments);
}

/** Count free (unbooked) slots in a day. */
export function countFreeSlots(day: GeneratedDay): number {
  return day.slots.filter((s) => !s.booked).length;
}

/** Format a slot as "9:00 AM – 10:30 AM". */
export function formatSlotLabel(slot: GeneratedSlot): string {
  return `${formatTimeLabel(slot.start)} – ${formatTimeLabel(slot.end)}`;
}