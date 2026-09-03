import type { TimeRange } from "@/types/scheduling";

/**
 * Parse "HH:mm" (or "H:mm") into minutes since midnight.
 * Returns null for malformed input.
 */
export function timeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Format minutes since midnight as "HH:mm" (zero-padded 24h). */
export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.round(minutes)));
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/** Format "HH:mm" as a friendly 12h label, e.g. "09:00" → "9:00 AM". */
export function formatTimeLabel(time: string): string {
  const minutes = timeToMinutes(time);
  if (minutes === null) return time;
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

/**
 * Postgres `time` columns serialize with seconds ("09:00:00"). Normalize to
 * "HH:mm" for display and Google Calendar payloads.
 */
export function normalizeTime(time: string): string {
  const trimmed = time.trim();
  return /^\d{2}:\d{2}:\d{2}$/.test(trimmed) ? trimmed.slice(0, 5) : trimmed;
}

/** A range is valid when both ends parse and end is strictly after start. */
export function isRangeValid(range: TimeRange): boolean {
  const start = timeToMinutes(range.start);
  const end = timeToMinutes(range.end);
  if (start === null || end === null) return false;
  return end > start;
}

/** Whether a list of ranges is fully valid (all parse, all end > start). */
export function areRangesValid(ranges: TimeRange[]): boolean {
  return ranges.length > 0 && ranges.every(isRangeValid);
}