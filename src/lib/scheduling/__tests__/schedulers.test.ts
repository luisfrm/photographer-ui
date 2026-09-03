import { describe, expect, it } from "vitest";
import type { PublicAvailability, SelectedSlot } from "@/types/scheduling";

describe("Scheduling components data flow", () => {
  const mockAvailability: PublicAvailability = {
    timezone: "America/Denver",
    days: [
      {
        date: "2026-09-02",
        weekday: "wednesday",
        slots: [
          { start: "09:00", end: "10:30", booked: false },
          { start: "11:00", end: "12:30", booked: true },
        ],
      },
      {
        date: "2026-09-03",
        weekday: "thursday",
        slots: [
          { start: "14:00", end: "15:30", booked: false },
        ],
      },
    ],
  };

  it("filters available slots correctly and keeps booked slots marked", () => {
    const day = mockAvailability.days[0];
    expect(day).toBeDefined();

    const availableSlots = day.slots.filter((s) => !s.booked);
    expect(availableSlots).toHaveLength(1);
    expect(availableSlots[0]?.start).toBe("09:00");

    const bookedSlots = day.slots.filter((s) => s.booked);
    expect(bookedSlots).toHaveLength(1);
    expect(bookedSlots[0]?.start).toBe("11:00");
  });

  it("creates valid SelectedSlot representation", () => {
    const slotToSelect = mockAvailability.days[0].slots[0];
    const selected: SelectedSlot = {
      date: mockAvailability.days[0].date,
      start: slotToSelect.start,
      end: slotToSelect.end,
    };

    expect(selected.date).toBe("2026-09-02");
    expect(selected.start).toBe("09:00");
    expect(selected.end).toBe("10:30");
  });
});
