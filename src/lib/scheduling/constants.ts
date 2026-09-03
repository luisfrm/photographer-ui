import type { Weekday } from "@/types/scheduling";
import { DEFAULT_TIMEZONE } from "@/types/scheduling";

export { WEEKDAYS, DEFAULT_TIMEZONE } from "@/types/scheduling";

/** Human-readable day labels. */
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** JS Date#getDay() (0 = Sunday) → Weekday. */
export const WEEKDAY_FROM_INDEX: Record<number, Weekday> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

/** Common timezones shown in the settings picker (IANA names). */
export const COMMON_TIMEZONES: string[] = [
  "America/Denver", // Utah (default)
  "America/New_York",
  "America/Chicago",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Honolulu",
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Buenos_Aires",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Lisbon",
  "Europe/Amsterdam",
  "Africa/Casablanca",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];

/** Render "(GMT-6) America/Denver" style label for a timezone picker. */
export function formatTimezoneLabel(timeZone: string): string {
  return `${tzOffsetLabel(timeZone)} ${timeZone}`;
}

/** "(GMT-06:00)" style offset for a given IANA timezone (as of "now"). */
export function tzOffsetLabel(timeZone: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    });
    const parts = fmt.formatToParts(new Date());
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    // Intl gives e.g. "GMT-6" or "GMT-06:00" depending on runtime
    return offset.startsWith("GMT") ? offset : `GMT${offset}`;
  } catch {
    return "GMT";
  }
}

/** Validate an IANA timezone string. */
export function isValidTimezone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}