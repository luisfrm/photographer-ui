"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Loader2,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getAppointmentsAction } from "@/app/panel/actions";
import AppointmentDetailSheet, {
  STATUS_LABELS,
  STATUS_STYLES,
} from "./AppointmentDetailSheet";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type { Appointment } from "@/types/scheduling";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_CHIPS_PER_CELL = 3;

const dateKeyOf = (date: Date) => format(date, "yyyy-MM-dd");

export default function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detail, setDetail] = useState<Appointment | null>(null);

  useEffect(() => {
    getAppointmentsAction().then((result) => {
      setAppointments(result.data ?? []);
      setError(result.error);
    });
  }, []);

  const byDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const appointment of appointments ?? []) {
      (map[appointment.date] ??= []).push(appointment);
    }
    return map;
  }, [appointments]);

  const gridStart = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 0,
  });
  const gridEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
  const cells = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const selectedDayAppointments = selectedDate
    ? (byDate[selectedDate] ?? [])
    : [];

  const handleMonthChange = (direction: 1 | -1) => {
    setCurrentMonth((prev) => addMonths(prev, direction));
  };

  const handleUpdated = (updated: Appointment) => {
    setAppointments((prev) =>
      (prev ?? []).map((a) => (a.id === updated.id ? updated : a))
    );
    setDetail(updated);
  };

  const handleDeleted = (id: string) => {
    setAppointments((prev) => (prev ?? []).filter((a) => a.id !== id));
    setDetail(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-gray-500 mt-2">
            View your bookings. Click a day to see its sessions, then click a
            session for details.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">Failed to load appointments: {error}</p>
        </div>
      )}

      {appointments === null ? (
        <AppointmentsSkeleton />
      ) : (
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMonthChange(-1)}
                aria-label="Previous month"
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentMonth(startOfMonth(new Date()));
                  setSelectedDate(dateKeyOf(new Date()));
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleMonthChange(1)}
                aria-label="Next month"
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px mb-px">
            {WEEKDAY_HEADERS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
            {cells.map((cell) => {
              const key = dateKeyOf(cell);
              const dayAppointments = byDate[key] ?? [];
              const inMonth = isSameMonth(cell, currentMonth);
              const isToday = key === dateKeyOf(new Date());
              const isSelected = selectedDate === key;
              const visible = dayAppointments.slice(0, MAX_CHIPS_PER_CELL);
              const overflow = dayAppointments.length - visible.length;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(key)}
                  className={cn(
                    "min-h-24 bg-white p-1.5 text-left align-top transition-colors",
                    inMonth ? "hover:bg-gray-50" : "bg-gray-50/60",
                    isSelected && "ring-2 ring-primary ring-inset bg-primary/5"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : inMonth
                          ? "text-gray-700"
                          : "text-gray-300"
                    )}
                  >
                    {format(cell, "d")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {visible.map((a) => (
                      <span
                        key={a.id}
                        className={cn(
                          "block truncate rounded px-1.5 py-0.5 text-[11px] leading-4 border",
                          STATUS_STYLES[a.status]
                        )}
                      >
                        {formatTimeLabel(a.start_time)} · {a.name}
                      </span>
                    ))}
                    {overflow > 0 && (
                      <span className="block text-[11px] text-gray-400 pl-1">
                        +{overflow} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected day details */}
      {appointments !== null && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          {selectedDate ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900">
                  {format(
                    new Date(`${selectedDate}T00:00:00`),
                    "EEEE, MMMM d, yyyy"
                  )}
                </h3>
              </div>
              {selectedDayAppointments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No appointments on this day.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                  {selectedDayAppointments.map((appointment) => (
                    <li key={appointment.id}>
                      <button
                        type="button"
                        onClick={() => setDetail(appointment)}
                        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                            {formatTimeLabel(appointment.start_time)} –{" "}
                            {formatTimeLabel(appointment.end_time)}
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            {appointment.name}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 inline-flex items-center text-xs font-medium rounded-md px-2.5 py-1 border",
                            STATUS_STYLES[appointment.status]
                          )}
                        >
                          {STATUS_LABELS[appointment.status]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Click a day on the calendar to see its appointments.
              </p>
            </div>
          )}
        </div>
      )}

      <AppointmentDetailSheet
        appointment={detail}
        onClose={() => setDetail(null)}
        onChanged={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-none" />
        ))}
      </div>
    </div>
  );
}