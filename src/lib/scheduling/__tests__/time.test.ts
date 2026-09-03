import { describe, expect, it } from "vitest";
import {
  areRangesValid,
  formatTimeLabel,
  isRangeValid,
  minutesToTime,
  normalizeTime,
  timeToMinutes,
} from "@/lib/scheduling/time";

describe("timeToMinutes", () => {
  it("parses zero-padded 24h times", () => {
    expect(timeToMinutes("09:00")).toBe(540);
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("23:59")).toBe(1439);
  });

  it("parses single-digit hours", () => {
    expect(timeToMinutes("9:00")).toBe(540);
    expect(timeToMinutes("8:30")).toBe(510);
  });

  it("rejects invalid input", () => {
    expect(timeToMinutes("24:00")).toBeNull();
    expect(timeToMinutes("09:60")).toBeNull();
    expect(timeToMinutes("9:5")).toBeNull();
    expect(timeToMinutes("abc")).toBeNull();
    expect(timeToMinutes("")).toBeNull();
    expect(timeToMinutes("9:00 pm")).toBeNull();
  });
});

describe("minutesToTime", () => {
  it("formats as zero-padded 24h", () => {
    expect(minutesToTime(540)).toBe("09:00");
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(1439)).toBe("23:59");
    expect(minutesToTime(8 * 60 + 5)).toBe("08:05");
  });

  it("clamps out-of-range values", () => {
    expect(minutesToTime(-30)).toBe("00:00");
    expect(minutesToTime(2000)).toBe("23:59");
  });
});

describe("formatTimeLabel", () => {
  it("formats 12h labels with AM/PM", () => {
    expect(formatTimeLabel("09:00")).toBe("9:00 AM");
    expect(formatTimeLabel("10:30")).toBe("10:30 AM");
    expect(formatTimeLabel("12:00")).toBe("12:00 PM");
    expect(formatTimeLabel("13:05")).toBe("1:05 PM");
    expect(formatTimeLabel("00:15")).toBe("12:15 AM");
    expect(formatTimeLabel("23:59")).toBe("11:59 PM");
  });

  it("returns the input untouched when invalid", () => {
    expect(formatTimeLabel("oops")).toBe("oops");
  });
});

describe("normalizeTime", () => {
  it("strips seconds from Postgres time values", () => {
    expect(normalizeTime("09:00:00")).toBe("09:00");
    expect(normalizeTime("14:30:00")).toBe("14:30");
  });

  it("leaves already-normalized values untouched", () => {
    expect(normalizeTime("09:00")).toBe("09:00");
    expect(normalizeTime("")).toBe("");
  });
});

describe("isRangeValid / areRangesValid", () => {
  it("accepts ranges where end is after start", () => {
    expect(isRangeValid({ start: "09:00", end: "10:30" })).toBe(true);
    expect(isRangeValid({ start: "14:00", end: "15:30" })).toBe(true);
  });

  it("rejects equal, reversed or malformed ranges", () => {
    expect(isRangeValid({ start: "09:00", end: "09:00" })).toBe(false);
    expect(isRangeValid({ start: "10:30", end: "09:00" })).toBe(false);
    expect(isRangeValid({ start: "9:00 am", end: "10:30" })).toBe(false);
  });

  it("requires at least one valid range", () => {
    expect(areRangesValid([{ start: "09:00", end: "10:30" }])).toBe(true);
    expect(areRangesValid([])).toBe(false);
    expect(
      areRangesValid([
        { start: "09:00", end: "10:30" },
        { start: "11:00", end: "10:00" },
      ])
    ).toBe(false);
  });
});