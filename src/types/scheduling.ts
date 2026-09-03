/**
 * Scheduling types: work hours, availability and appointments.
 * Shared between the panel (settings/editor), the public contact page
 * and the server actions.
 */

// ─── Weekdays & Work Hours ─────────────────────────────────

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** A bookable time window, e.g. "09:00" → "10:30" (24h, HH:mm). */
export interface TimeRange {
  start: string;
  end: string;
}

/** One weekday's schedule — may contain several ranges (sessions). */
export interface WorkDaySchedule {
  day: Weekday;
  ranges: TimeRange[];
}

/** Per-user scheduling settings persisted in `public.settings`. */
export interface PanelSettings {
  workHours: WorkDaySchedule[];
  timezone: string;
  sessionDuration: number;
}

export const DEFAULT_SESSION_DURATION = 60;


// ─── Availability (public contact page) ────────────────────

export interface GeneratedSlot extends TimeRange {
  /** Whether this slot is already booked (status !== cancelled). */
  booked: boolean;
}

export interface GeneratedDay {
  /** Date as YYYY-MM-DD in the owner timezone. */
  date: string;
  weekday: Weekday;
  slots: GeneratedSlot[];
}

export interface PublicAvailability {
  timezone: string;
  days: GeneratedDay[];
}

export interface SelectedSlot {
  date: string;
  start: string;
  end: string;
}


// ─── Appointments ──────────────────────────────────────────

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  /** Booking date YYYY-MM-DD (owner timezone). */
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: AppointmentStatus;
  google_event_id: string | null;
  created_at: string;
}

export interface NewAppointmentInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
}

// ─── Google Calendar tokens ────────────────────────────────

export interface GoogleTokens {
  access_token: string;
  refresh_token: string | null;
  scope: string;
  token_type: string;
  /** Epoch ms when the access token expires. */
  expires_at: number;
  email?: string | null;
}

export const DEFAULT_TIMEZONE = "America/Denver";