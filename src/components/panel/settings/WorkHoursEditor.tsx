"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Loader2, Trash2, Clock, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveSettingsAction } from "@/app/panel/actions";
import {
  COMMON_TIMEZONES,
  WEEKDAY_LABELS,
  formatTimezoneLabel,
} from "@/lib/scheduling/constants";
import { formatTimeLabel, timeToMinutes } from "@/lib/scheduling/time";
import {
  calculateSlotEndTime,
  validateTimesSeparation,
  type TimeSeparationConflict,
} from "@/lib/scheduling/validation";
import {
  WEEKDAYS,
  DEFAULT_SESSION_DURATION,
  type PanelSettings,
  type Weekday,
  type WorkDaySchedule,
} from "@/types/scheduling";

type DaysTimesState = Partial<Record<Weekday, string[]>>;

const DURATION_PRESETS = [30, 45, 60, 90, 120];

export default function WorkHoursEditor({
  initialData,
}: {
  initialData: PanelSettings;
}) {
  // Extract start times from existing ranges for each day
  const [days, setDays] = useState<DaysTimesState>(() => {
    const init: DaysTimesState = {};
    for (const day of initialData.workHours) {
      if (day.ranges && day.ranges.length > 0) {
        init[day.day] = day.ranges
          .map((r) => r.start)
          .filter(Boolean)
          .sort((a, b) => (timeToMinutes(a) ?? 0) - (timeToMinutes(b) ?? 0));
      }
    }
    return init;
  });

  const [sessionDuration, setSessionDuration] = useState<number>(
    initialData.sessionDuration || DEFAULT_SESSION_DURATION
  );
  const [timezone, setTimezone] = useState(initialData.timezone);
  const [newTimeInputs, setNewTimeInputs] = useState<Partial<Record<Weekday, string>>>({});
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify({ days, timezone, sessionDuration })
  );
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    JSON.stringify({ days, timezone, sessionDuration }) !== savedSnapshot;

  // Real-time conflict validation for all active days
  const conflictsByDay = useMemo(() => {
    const map = new Map<Weekday, TimeSeparationConflict>();
    for (const day of WEEKDAYS) {
      const times = days[day];
      if (!times || times.length < 2) continue;
      const conflict = validateTimesSeparation(
        day,
        WEEKDAY_LABELS[day],
        times,
        sessionDuration
      );
      if (conflict) {
        map.set(day, conflict);
      }
    }
    return map;
  }, [days, sessionDuration]);

  const hasConflicts = conflictsByDay.size > 0;
  const enabledCount = WEEKDAYS.filter((d) => (days[d]?.length ?? 0) > 0).length;

  // ─── Handlers ─────────────────────────────────────────────

  const toggleDay = (day: Weekday, enabled: boolean) => {
    setDays((prev) => {
      if (enabled) {
        return {
          ...prev,
          [day]: prev[day] && prev[day]!.length > 0 ? prev[day] : ["09:00"],
        };
      }
      const next = { ...prev };
      delete next[day];
      return next;
    });
  };

  const handleAddTime = (day: Weekday) => {
    const inputTime = newTimeInputs[day]?.trim();
    if (!inputTime) return;

    if (timeToMinutes(inputTime) === null) {
      toast.error("Please enter a valid time (e.g. 09:00).");
      return;
    }

    const currentTimes = days[day] ?? [];
    if (currentTimes.includes(inputTime)) {
      toast.error("This time is already registered for this day.");
      return;
    }

    const updated = [...currentTimes, inputTime].sort(
      (a, b) => (timeToMinutes(a) ?? 0) - (timeToMinutes(b) ?? 0)
    );

    setDays((prev) => ({
      ...prev,
      [day]: updated,
    }));

    // Reset input for this day
    setNewTimeInputs((prev) => ({
      ...prev,
      [day]: "",
    }));
  };

  const handleRemoveTime = (day: Weekday, timeToRemove: string) => {
    setDays((prev) => {
      const updated = (prev[day] ?? []).filter((t) => t !== timeToRemove);
      const next = { ...prev };
      if (updated.length === 0) {
        delete next[day];
      } else {
        next[day] = updated;
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (hasConflicts) {
      const firstConflict = Array.from(conflictsByDay.values())[0];
      toast.error(firstConflict?.message || "Please fix schedule conflicts before saving.");
      return;
    }

    setIsSaving(true);

    // Compute range objects with { start, end: start + duration }
    const workHours: WorkDaySchedule[] = WEEKDAYS.filter(
      (d) => (days[d]?.length ?? 0) > 0
    ).map((d) => ({
      day: d,
      ranges: (days[d] ?? []).map((start) => ({
        start,
        end: calculateSlotEndTime(start, sessionDuration),
      })),
    }));

    const result = await saveSettingsAction({
      workHours,
      timezone,
      sessionDuration,
    });

    if (result.error) {
      toast.error(`Failed to save settings: ${result.error}`);
    } else {
      setSavedSnapshot(JSON.stringify({ days, timezone, sessionDuration }));
      toast.success("Schedule settings saved successfully!");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-900">
            Scheduling & Availability
          </h2>
          <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
            Configure your session duration and add the specific times you want
            to work on each day. End times and spacing are automatically
            managed to prevent overlaps.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving || hasConflicts}
          className="self-start sm:self-auto"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>

      {/* Card 1: Session Duration Configuration */}
      <div className="p-6 border border-zinc-200 rounded-xl bg-white shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-zinc-900">
            Session Duration
          </h3>
        </div>
        <p className="text-xs text-zinc-500">
          How long does each photo shoot last? Every appointment time you add
          will automatically have this length and require this minimum separation.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSessionDuration(preset)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                sessionDuration === preset
                  ? "bg-primary text-white shadow-sm"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              )}
            >
              {preset} min
            </button>
          ))}

          <div className="flex items-center space-x-1.5 ml-2">
            <span className="text-xs text-zinc-400">or</span>
            <input
              type="number"
              min={15}
              max={360}
              step={5}
              value={sessionDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0) setSessionDuration(val);
              }}
              className="h-8 w-20 rounded-lg border border-zinc-200 px-2 text-xs font-semibold text-zinc-800 text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-zinc-500">minutes</span>
          </div>
        </div>
      </div>

      {/* Card 2: Timezone */}
      <div className="p-6 border border-zinc-200 rounded-xl bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-zinc-500" />
          <Label className="text-sm font-semibold text-zinc-900">
            Timezone
          </Label>
        </div>
        <p className="text-xs text-zinc-500 mb-3">
          Appointments are displayed and booked in this timezone.
        </p>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="h-9 w-full max-w-sm rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {COMMON_TIMEZONES.includes(timezone) ? null : (
            <option value={timezone}>{formatTimezoneLabel(timezone)}</option>
          )}
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {formatTimezoneLabel(tz)}
            </option>
          ))}
        </select>
      </div>

      {/* Card 3: Days and Times */}
      <div className="p-6 border border-zinc-200 rounded-xl bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Work Days & Hours
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {enabledCount === 0
                ? "No days enabled yet — visitors won't see available appointments."
                : `Available on ${enabledCount} day${
                    enabledCount === 1 ? "" : "s"
                  }. Add your specific session times below.`}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {WEEKDAYS.map((day) => {
            const times = days[day] ?? [];
            const isEnabled = Boolean(days[day]);
            const conflict = conflictsByDay.get(day);

            return (
              <div
                key={day}
                className={cn(
                  "rounded-xl border transition-all overflow-hidden",
                  conflict
                    ? "border-red-300 bg-red-50/20"
                    : isEnabled
                    ? "border-zinc-200 bg-white"
                    : "border-zinc-200/60 bg-zinc-50/40 opacity-75"
                )}
              >
                {/* Day Header Row */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-50/70 border-b border-zinc-100">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`day-${day}`}
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        toggleDay(day, checked === true)
                      }
                    />
                    <label
                      htmlFor={`day-${day}`}
                      className="text-sm font-semibold text-zinc-900 cursor-pointer select-none"
                    >
                      {WEEKDAY_LABELS[day]}
                    </label>
                  </div>

                  {isEnabled && (
                    <span className="text-xs text-zinc-500 font-medium">
                      {times.length} {times.length === 1 ? "session" : "sessions"}
                    </span>
                  )}
                </div>

                {/* Day Content */}
                {isEnabled && (
                  <div className="p-4 space-y-3">
                    {/* Conflict Alert for this day */}
                    {conflict && (
                      <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs animate-in fade-in duration-200">
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Schedule Conflict</p>
                          <p className="mt-0.5">{conflict.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Active Times Pills */}
                    {times.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {times.map((time) => {
                          const endTime = calculateSlotEndTime(
                            time,
                            sessionDuration
                          );
                          const isConflictTime =
                            conflict?.conflictingTime === time;

                          return (
                            <div
                              key={time}
                              className={cn(
                                "inline-flex items-center space-x-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold shadow-sm transition-all",
                                isConflictTime
                                  ? "bg-red-100 text-red-900 border border-red-300 ring-1 ring-red-400"
                                  : "bg-zinc-100 text-zinc-900 border border-zinc-200"
                              )}
                            >
                              <span>{formatTimeLabel(time)}</span>
                              <span className="text-[11px] opacity-60 font-normal">
                                → {formatTimeLabel(endTime)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTime(day, time)}
                                aria-label={`Remove ${time} on ${WEEKDAY_LABELS[day]}`}
                                className="ml-1 text-zinc-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        No appointment times added yet for this day.
                      </p>
                    )}

                    {/* Add Time Form */}
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="time"
                        value={newTimeInputs[day] ?? ""}
                        onChange={(e) =>
                          setNewTimeInputs((prev) => ({
                            ...prev,
                            [day]: e.target.value,
                          }))
                        }
                        className="h-8 rounded-lg border border-zinc-300 bg-white px-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`New appointment time for ${WEEKDAY_LABELS[day]}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTime(day)}
                        disabled={!newTimeInputs[day]}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Time
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}