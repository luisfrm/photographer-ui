import { timeToMinutes, minutesToTime, formatTimeLabel } from "@/lib/scheduling/time";

export interface TimeSeparationConflict {
  dayKey: string;
  dayLabel: string;
  conflictingTime: string;
  previousTime: string;
  minAllowedTime: string;
  differenceMinutes: number;
  requiredMinutes: number;
  message: string;
}

/**
 * Calculates the session end time given a start time and duration in minutes.
 */
export function calculateSlotEndTime(
  startTime: string,
  durationMinutes: number
): string {
  const startMins = timeToMinutes(startTime);
  if (startMins === null) return startTime;
  return minutesToTime(startMins + durationMinutes);
}

/**
 * Validates that all start times for a given day respect the minimum separation
 * equal to the session duration.
 *
 * Example:
 * If duration is 90 mins and times are ["09:00", "10:00"], 10:00 conflicts
 * with 09:00 because it is only 60 minutes after 09:00 (needs at least 90 mins, so >= 10:30).
 */
export function validateTimesSeparation(
  dayKey: string,
  dayLabel: string,
  times: string[],
  durationMinutes: number
): TimeSeparationConflict | null {
  if (!times || times.length < 2) return null;

  // Filter out any invalid times and sort chronologically
  const validTimes = times
    .filter((t) => timeToMinutes(t) !== null)
    .slice()
    .sort((a, b) => timeToMinutes(a)! - timeToMinutes(b)!);

  for (let i = 1; i < validTimes.length; i++) {
    const prevTime = validTimes[i - 1];
    const currTime = validTimes[i];

    const prevMins = timeToMinutes(prevTime)!;
    const currMins = timeToMinutes(currTime)!;
    const diff = currMins - prevMins;

    if (diff < durationMinutes) {
      const minAllowedTime = minutesToTime(prevMins + durationMinutes);
      const prevEndFormatted = formatTimeLabel(
        calculateSlotEndTime(prevTime, durationMinutes)
      );
      const prevFormatted = formatTimeLabel(prevTime);
      const currFormatted = formatTimeLabel(currTime);
      const minAllowedFormatted = formatTimeLabel(minAllowedTime);

      return {
        dayKey,
        dayLabel,
        conflictingTime: currTime,
        previousTime: prevTime,
        minAllowedTime,
        differenceMinutes: diff,
        requiredMinutes: durationMinutes,
        message: `Conflict on ${dayLabel}: ${currFormatted} is only ${diff} min after ${prevFormatted} (ends at ${prevEndFormatted}). With a ${durationMinutes}-minute duration, the next slot must start at or after ${minAllowedFormatted}.`,
      };
    }
  }

  return null;
}
