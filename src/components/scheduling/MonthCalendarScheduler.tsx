"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  getDay,
  getDate,
  isSameMonth,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type {
  PublicAvailability,
  SelectedSlot,
  GeneratedDay,
} from "@/types/scheduling";

interface MonthCalendarSchedulerProps {
  availability: PublicAvailability;
  selectedSlot: SelectedSlot | null;
  onSelectSlot: (slot: SelectedSlot) => void;
  className?: string;
}

const WEEKDAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Month Calendar scheduling component.
 * Displays a full monthly calendar grid with disabled/available day states
 * and an interactive time-picker panel for the chosen date.
 */
export default function MonthCalendarScheduler({
  availability,
  selectedSlot,
  onSelectSlot,
  className,
}: MonthCalendarSchedulerProps) {
  const daysMap = useMemo(() => {
    const map = new Map<string, GeneratedDay>();
    for (const day of availability.days ?? []) {
      map.set(day.date, day);
    }
    return map;
  }, [availability.days]);

  // Initial view month based on selected slot or first available day
  const initialMonth = useMemo(() => {
    if (selectedSlot?.date) {
      return startOfMonth(new Date(`${selectedSlot.date}T00:00:00`));
    }
    const firstWithSlots = availability.days?.find((d) =>
      d.slots.some((s) => !s.booked)
    );
    if (firstWithSlots) {
      return startOfMonth(new Date(`${firstWithSlots.date}T00:00:00`));
    }
    return startOfMonth(new Date());
  }, [availability.days, selectedSlot]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    selectedSlot?.date ?? null
  );

  // Calendar cells generation for currentMonth
  const calendarCells = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const totalDays = getDate(end);
    const startDayOfWeek = getDay(start); // 0 = Sunday

    const cells: Array<{ dateKey: string; dayNumber: number } | null> = [];

    // Empty offset cells before day 1
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(null);
    }

    // Month days
    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dateKey = format(cellDate, "yyyy-MM-dd");
      cells.push({ dateKey, dayNumber: day });
    }

    return cells;
  }, [currentMonth]);

  const activeDay = selectedDate ? daysMap.get(selectedDate) : null;
  const activeDayDateObj = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition-all",
        className
      )}
    >
      {/* Top Banner (Header displaying active selected date) */}
      <div className="bg-primary px-6 py-5 text-white">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
          Select Date
        </span>
        <h3 className="text-2xl font-serif font-bold mt-1 tracking-tight">
          {activeDayDateObj
            ? format(activeDayDateObj, "EEE, MMM d")
            : "Choose a day"}
        </h3>
      </div>

      <div className="p-5">
        {/* Month Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <h4 className="text-sm font-semibold text-zinc-900">
            {format(currentMonth, "MMMM yyyy")}
          </h4>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday Columns Header */}
        <div className="grid grid-cols-7 text-center pt-4 pb-2 text-xs font-semibold text-zinc-400">
          {WEEKDAY_NAMES.map((name, i) => (
            <span key={i} className="py-1">
              {name}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {calendarCells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="h-9 w-9" />;
            }

            const dayData = daysMap.get(cell.dateKey);
            const availableSlots = dayData?.slots.filter((s) => !s.booked) ?? [];
            const isAvailable = availableSlots.length > 0;
            const isSelected = selectedDate === cell.dateKey;
            const isCurrentDay = isToday(
              new Date(`${cell.dateKey}T00:00:00`)
            );

            return (
              <button
                key={cell.dateKey}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedDate(cell.dateKey)}
                aria-pressed={isSelected}
                className={cn(
                  "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "bg-primary text-white font-bold shadow-md scale-105"
                    : isAvailable
                    ? "text-zinc-900 hover:bg-zinc-100 cursor-pointer font-semibold"
                    : "text-zinc-300 cursor-not-allowed opacity-40",
                  isCurrentDay && !isSelected && "ring-1 ring-zinc-400 font-bold"
                )}
              >
                <span>{cell.dayNumber}</span>
                {/* Dot for available sessions */}
                {isAvailable && !isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Available Hours Section */}
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <h5 className="text-sm font-semibold text-zinc-900">
                {activeDayDateObj
                  ? `Times for ${format(activeDayDateObj, "EEE, MMM d")}`
                  : "Select a date above"}
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
          ) : selectedDate ? (
            <div className="flex items-center space-x-2 py-4 text-xs text-zinc-500 justify-center">
              <AlertCircle className="h-4 w-4 text-zinc-400" />
              <span>No available slots on this date.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 py-6 text-xs text-zinc-400 justify-center">
              <CalendarIcon className="h-4 w-4 text-zinc-300" />
              <span>Click on any highlighted day to view available hours.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
