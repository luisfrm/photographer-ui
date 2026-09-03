import { describe, expect, it } from "vitest";
import {
  calculateSlotEndTime,
  validateTimesSeparation,
} from "@/lib/scheduling/validation";

describe("calculateSlotEndTime", () => {
  it("computes end time correctly based on start and duration", () => {
    expect(calculateSlotEndTime("09:00", 90)).toBe("10:30");
    expect(calculateSlotEndTime("15:00", 60)).toBe("16:00");
    expect(calculateSlotEndTime("11:45", 30)).toBe("12:15");
  });
});

describe("validateTimesSeparation", () => {
  it("allows valid casual hours with sufficient separation", () => {
    // 90-minute duration: 09:00, 15:00, 19:00 (plenty of separation)
    const result = validateTimesSeparation(
      "monday",
      "Monday",
      ["09:00", "15:00", "19:00"],
      90
    );
    expect(result).toBeNull();
  });

  it("allows exact boundary separation", () => {
    // 90-minute duration: 09:00 to 10:30, next starts exactly at 10:30
    const result = validateTimesSeparation(
      "monday",
      "Monday",
      ["09:00", "10:30"],
      90
    );
    expect(result).toBeNull();
  });

  it("detects conflict when separation is smaller than session duration", () => {
    // 90-minute duration: 09:00 and 10:00 (only 60 mins apart, needs 90 mins)
    const result = validateTimesSeparation(
      "monday",
      "Monday",
      ["09:00", "10:00"],
      90
    );

    expect(result).not.toBeNull();
    expect(result?.conflictingTime).toBe("10:00");
    expect(result?.previousTime).toBe("09:00");
    expect(result?.minAllowedTime).toBe("10:30");
    expect(result?.differenceMinutes).toBe(60);
    expect(result?.requiredMinutes).toBe(90);
    expect(result?.message).toContain("Conflict on Monday");
    expect(result?.message).toContain("must start at or after");
  });

  it("detects conflict even when times are entered out of order", () => {
    // 60-minute duration: entered ["14:30", "14:00"] -> 30 min difference
    const result = validateTimesSeparation(
      "tuesday",
      "Tuesday",
      ["14:30", "14:00"],
      60
    );

    expect(result).not.toBeNull();
    expect(result?.conflictingTime).toBe("14:30");
    expect(result?.previousTime).toBe("14:00");
    expect(result?.minAllowedTime).toBe("15:00");
  });
});
