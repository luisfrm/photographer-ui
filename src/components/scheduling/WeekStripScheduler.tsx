"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type {
  GeneratedDay,
  GeneratedSlot,
  PublicAvailability,
  SelectedSlot,
} from "@/types/scheduling";

interface WeekStripSchedulerProps {
  availability: PublicAvailability;
  selectedSlot: SelectedSlot | null;
  onSelectSlot: (slot: SelectedSlot) => void;
  className?: string;
}

const PAGE_SIZE = 5;

/**
 * Week/Day strip scheduling component.
 * Displays a paginated horizontal row of days (5 at a time) and a clean
 * grid of start-time pills for the active date.
 */
export default function WeekStripScheduler({
  availability,
  selectedSlot,
  onSelectSlot,
  className,
}: WeekStripSchedulerProps) {
  const days = useMemo(() => availability.days ?? [], [availability.days]);

  // Default to the first day with available (unbooked) slots, or the first day in list
  const initialActiveDate = useMemo(() => {
    if (selectedSlot?.date) return selectedSlot.date;
    const firstWithSlots = days.find((d) => d.slots.some((s) => !s.booked));
    return firstWithSlots?.date ?? days[0]?.date ?? "";
  }, [days, selectedSlot]);

  const [activeDate, setActiveDate] = useState<string>(initialActiveDate);
  const [pageIndex, setPageIndex] = useState<number>(() => {
    const idx = days.findIndex((d) => d.date === initialActiveDate);
    return idx >= 0 ? Math.floor(idx / PAGE_SIZE) : 0;
  });

  const totalPages = Math.max(1, Math.ceil(days.length / PAGE_SIZE));
  const visibleDays = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return days.slice(start, start + PAGE_SIZE);
  }, [days, pageIndex]);

  const activeDay = useMemo(() => {
    return days.find((d) => d.date === activeDate) ?? visibleDays[0];
  }, [days, activeDate, visibleDays]);

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      const prevPage = pageIndex - 1;
      setPageIndex(prevPage);
      const firstDayOfPrevPage = days[prevPage * PAGE_SIZE];
      if (firstDayOfPrevPage) setActiveDate(firstDayOfPrevPage.date);
    }
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      const nextPage = pageIndex + 1;
      setPageIndex(nextPage);
      const firstDayOfNextPage = days[nextPage * PAGE_SIZE];
      if (firstDayOfNextPage) setActiveDate(firstDayOfNextPage.date);
    }
  };

  // Determine current month/year range for header
  const headerLabel = useMemo(() => {
    if (!visibleDays.length) return "";
    const first = new Date(`${visibleDays[0].date}T00:00:00`);
    const last = new Date(
      `${visibleDays[visibleDays.length - 1].date}T00:00:00`
    );
    const firstMonth = format(first, "MMM yyyy");
    const lastMonth = format(last, "MMM yyyy");
    return firstMonth === lastMonth
      ? firstMonth
      : `${format(first, "MMM")} – ${lastMonth}`;
  }, [visibleDays]);

  const activeDayDateObj = activeDay
    ? new Date(`${activeDay.date}T00:00:00`)
    : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all",
        className
      )}
    >
      {/* Header bar: month label + navigation buttons */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Select a Date
          </span>
          <h4 className="text-base font-medium text-zinc-900">{headerLabel}</h4>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
            aria-label="Previous days"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors",
              pageIndex === 0
                ? "cursor-not-allowed opacity-30"
                : "hover:bg-zinc-100 hover:text-zinc-900 active:scale-95"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={pageIndex >= totalPages - 1}
            aria-label="Next days"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors",
              pageIndex >= totalPages - 1
                ? "cursor-not-allowed opacity-30"
                : "hover:bg-zinc-100 hover:text-zinc-900 active:scale-95"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day Tabs Strip */}
      <div className="grid grid-cols-5 gap-2">
        {visibleDays.map((day) => {
          const dateObj = new Date(`${day.date}T00:00:00`);
          const isSelected = activeDay?.date === day.date;
          const availableSlots = day.slots.filter((s) => !s.booked);
          const hasAvailability = availableSlots.length > 0;
          const isToday =
            format(new Date(), "yyyy-MM-dd") === day.date;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setActiveDate(day.date)}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-xl py-3 px-1 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "bg-primary text-white shadow-md ring-1 ring-primary"
                  : hasAvailability
                  ? "bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200/80 active:scale-95"
                  : "bg-zinc-50/60 text-zinc-400 border border-zinc-100 opacity-60"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-medium uppercase tracking-tight",
                  isSelected
                    ? "text-white/90"
                    : isToday
                    ? "text-primary font-bold"
                    : "text-zinc-500"
                )}
              >
                {isToday ? "Today" : format(dateObj, "EEE")}
              </span>
              <span
                className={cn(
                  "text-lg font-bold mt-0.5",
                  isSelected ? "text-white" : "text-zinc-900"
                )}
              >
                {format(dateObj, "d")}
              </span>

              {/* Status indicator dot */}
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 rounded-full",
                  isSelected
                    ? "bg-white"
                    : hasAvailability
                    ? "bg-emerald-500"
                    : "bg-zinc-300"
                )}
                title={
                  hasAvailability
                    ? `${availableSlots.length} available`
                    : "Fully booked / unavailable"
                }
              />
            </button>
          );
        })}
      </div>

      {/* Available Hours for the selected day */}
      <div className="mt-6 pt-5 border-t border-zinc-100">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            <h5 className="text-sm font-semibold text-zinc-900">
              {activeDayDateObj
                ? format(activeDayDateObj, "EEEE, MMMM d")
                : "Select a day"}
            </h5>
          </div>
          {availability.timezone && (
            <span className="text-[11px] text-zinc-400">
              {availability.timezone}
            </span>
          )}
        </div>

        {activeDay && activeDay.slots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {activeDay.slots.map((slot) => {
              const isSelected =
                selectedSlot?.date === activeDay.date &&
                selectedSlot.start === slot.start;

              if (slot.booked) {
                return (
                  <button
                    key={`${activeDay.date}-${slot.start}`}
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Already booked"
                    className="flex flex-col items-center justify-center rounded-lg border border-transparent bg-zinc-100 py-2.5 px-2 text-xs font-medium text-zinc-400 cursor-not-allowed line-through opacity-50"
                  >
                    <span>{formatTimeLabel(slot.start).toLowerCase()}</span>
                  </button>
                );
              }

              return (
                <button
                  key={`${activeDay.date}-${slot.start}`}
                  type="button"
                  onClick={() =>
                    onSelectSlot({
                      date: activeDay.date,
                      start: slot.start,
                      end: slot.end,
                    })
                  }
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg py-2.5 px-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                    isSelected
                      ? "bg-primary text-white shadow-md ring-2 ring-primary/40"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-transparent"
                  )}
                >
                  <span>{formatTimeLabel(slot.start).toLowerCase()}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center space-x-2 py-6 text-sm text-zinc-500 justify-center">
            <AlertCircle className="h-4 w-4 text-zinc-400" />
            <span>No available slots on this day.</span>
          </div>
        )}
      </div>
    </div>
  );
}
