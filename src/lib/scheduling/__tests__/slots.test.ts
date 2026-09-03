import { describe, expect, it } from "vitest";
import {
  buildAvailability,
  countFreeSlots,
  generateSlots,
  getRangesForWeekday,
  markBookedSlots,
  weekdayOfDateKey,
  zonedDateKey,
} from "@/lib/scheduling/slots";
import type { WorkDaySchedule } from "@/types/scheduling";

// September 2, 2026 is a Wednesday.
const workHours: WorkDaySchedule[] = [
  {
    day: "wednesday",
    ranges: [
      { start: "10:30", end: "12:00" },
      { start: "14:00", end: "15:30" },
    ],
  },
  { day: "friday", ranges: [{ start: "09:00", end: "10:30" }] },
];

describe("weekdayOfDateKey", () => {
  it("maps date keys to weekdays", () => {
    expect(weekdayOfDateKey("2026-09-02")).toBe("wednesday");
    expect(weekdayOfDateKey("2026-09-06")).toBe("sunday");
    expect(weekdayOfDateKey("2026-09-07")).toBe("monday");
    expect(weekdayOfDateKey("2026-09-05")).toBe("saturday");
  });
});

describe("zonedDateKey", () => {
  it("formats a date in the given timezone", () => {
    // 2026-09-02 20:00 UTC = 14:00 MDT (UTC-6) → same local date.
    expect(zonedDateKey(new Date("2026-09-02T20:00:00Z"), "America/Denver")).toBe(
      "2026-09-02"
    );
    // 2026-09-03 02:00 UTC = 2026-09-02 20:00 MDT → previous day.
    expect(zonedDateKey(new Date("2026-09-03T02:00:00Z"), "America/Denver")).toBe(
      "2026-09-02"
    );
    expect(zonedDateKey(new Date("2026-09-03T02:00:00Z"), "UTC")).toBe(
      "2026-09-03"
    );
  });
});

describe("getRangesForWeekday", () => {
  it("returns the configured ranges for a day", () => {
    expect(getRangesForWeekday(workHours, "wednesday")).toEqual([
      { start: "10:30", end: "12:00" },
      { start: "14:00", end: "15:30" },
    ]);
  });

  it("returns an empty array for days without hours", () => {
    expect(getRangesForWeekday(workHours, "monday")).toEqual([]);
  });
});

describe("generateSlots", () => {
  it("generates one day per day with slots for configured weekdays", () => {
    const days = generateSlots(
      workHours,
      "America/Denver",
      new Date("2026-09-02T20:00:00Z"),
      5
    );

    expect(days).toHaveLength(5);
    expect(days.map((d) => d.date)).toEqual([
      "2026-09-02",
      "2026-09-03",
      "2026-09-04",
      "2026-09-05",
      "2026-09-06",
    ]);

    // Wednesday → 2 sessions
    expect(days[0]?.weekday).toBe("wednesday");
    expect(days[0]?.slots).toHaveLength(2);
    expect(days[0]?.slots[0]).toEqual({
      start: "10:30",
      end: "12:00",
      booked: false,
    });

    // Thursday → no sessions
    expect(days[1]?.weekday).toBe("thursday");
    expect(days[1]?.slots).toHaveLength(0);

    // Friday → 1 session
    expect(days[2]?.weekday).toBe("friday");
    expect(days[2]?.slots).toHaveLength(1);

    // Weekend → no sessions
    expect(days[3]?.weekday).toBe("saturday");
    expect(days[3]?.slots).toHaveLength(0);
    expect(days[4]?.weekday).toBe("sunday");
    expect(days[4]?.slots).toHaveLength(0);
  });
});

describe("markBookedSlots", () => {
  it("marks slots booked by non-cancelled appointments", () => {
    const days = generateSlots(
      workHours,
      "America/Denver",
      new Date("2026-09-02T20:00:00Z"),
      3
    );
    const marked = markBookedSlots(days, [
      { date: "2026-09-02", start_time: "10:30", status: "confirmed" },
    ]);

    expect(marked[0]?.slots[0]?.booked).toBe(true);
    expect(marked[0]?.slots[1]?.booked).toBe(false);
  });

  it("does not mark slots booked by cancelled appointments", () => {
    const days = generateSlots(
      workHours,
      "America/Denver",
      new Date("2026-09-02T20:00:00Z"),
      1
    );
    const marked = markBookedSlots(days, [
      { date: "2026-09-02", start_time: "10:30", status: "cancelled" },
    ]);

    expect(marked[0]?.slots[0]?.booked).toBe(false);
  });
});

describe("buildAvailability + countFreeSlots", () => {
  it("combines generation and booking and counts free slots", () => {
    const days = buildAvailability(
      workHours,
      "America/Denver",
      new Date("2026-09-02T20:00:00Z"),
      3,
      [{ date: "2026-09-02", start_time: "10:30", status: "pending" }]
    );

    expect(days[0]?.slots[0]?.booked).toBe(true);
    expect(countFreeSlots(days[0]!)).toBe(1);
    expect(countFreeSlots(days[1]!)).toBe(0);
  });
});