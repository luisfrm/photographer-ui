"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  CalendarCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  FileText,
  Settings,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import {
  getAppointmentsAction,
  getGoogleConnectionAction,
} from "@/app/panel/actions";
import AppointmentDetailSheet, {
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/components/panel/appointments/AppointmentDetailSheet";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type { Appointment } from "@/types/scheduling";

// ─── Helpers ───────────────────────────────────────────────

/** Format a booking date into a friendly tag (Today, Tomorrow, or EEE, MMM d). */
function getSessionDateBadge(dateStr: string) {
  try {
    const today = new Date();
    const todayKey = format(today, "yyyy-MM-dd");
    const tomorrowKey = format(addDays(today, 1), "yyyy-MM-dd");

    if (dateStr === todayKey) {
      return { label: "Today", isUrgent: true };
    }
    if (dateStr === tomorrowKey) {
      return { label: "Tomorrow", isUrgent: false };
    }

    const dateObj = new Date(`${dateStr}T00:00:00`);
    return {
      label: format(dateObj, "EEE, MMM d"),
      isUrgent: false,
    };
  } catch {
    return { label: dateStr, isUrgent: false };
  }
}

/** Format creation timestamp into relative time string. */
function formatRelativeTime(isoStr: string) {
  try {
    const date = new Date(isoStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return format(date, "MMM d");
  } catch {
    return "";
  }
}

// ─── Dashboard Component ───────────────────────────────────

export default function DashboardPage() {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [googleStatus, setGoogleStatus] = useState<{
    connected: boolean;
    email: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    let ignore = false;

    Promise.all([
      getAppointmentsAction(),
      getGoogleConnectionAction(),
    ])
      .then(([appointmentsResult, googleResult]) => {
        if (ignore) return;
        if (appointmentsResult.error) {
          setError(appointmentsResult.error);
        } else {
          setAppointments(appointmentsResult.data ?? []);
          setError(null);
        }
        setGoogleStatus(googleResult);
      })
      .catch((err) => {
        if (ignore) return;
        const msg =
          err instanceof Error ? err.message : "Failed to load dashboard";
        setError(msg);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [appointmentsResult, googleResult] = await Promise.all([
        getAppointmentsAction(),
        getGoogleConnectionAction(),
      ]);

      if (appointmentsResult.error) {
        setError(appointmentsResult.error);
      } else {
        setAppointments(appointmentsResult.data ?? []);
        setError(null);
      }

      setGoogleStatus(googleResult);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load dashboard";
      setError(msg);
    } finally {
      setIsRefreshing(false);
    }
  };

  // State handlers for AppointmentDetailSheet
  const handleUpdated = (updated: Appointment) => {
    setAppointments((prev) =>
      (prev ?? []).map((a) => (a.id === updated.id ? updated : a))
    );
    setSelectedAppointment(updated);
  };

  const handleDeleted = (id: string) => {
    setAppointments((prev) => (prev ?? []).filter((a) => a.id !== id));
    setSelectedAppointment(null);
  };

  // Compute metrics
  const now = new Date();
  const todayKey = format(now, "yyyy-MM-dd");
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const validAppointments = appointments ?? [];

  // Sessions this week (Monday to Sunday, not cancelled)
  const thisWeekAppointments = validAppointments.filter((a) => {
    if (a.status === "cancelled") return false;
    const aptDate = new Date(`${a.date}T00:00:00`);
    return aptDate >= weekStart && aptDate <= weekEnd;
  });

  const thisWeekPendingCount = thisWeekAppointments.filter(
    (a) => a.status === "pending"
  ).length;

  // Upcoming sessions (today onwards, not cancelled, sorted chronologically)
  const upcomingAppointments = validAppointments
    .filter((a) => a.status !== "cancelled" && a.date >= todayKey)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start_time.localeCompare(b.start_time);
    });

  // Pending confirmation appointments
  const pendingAppointments = validAppointments.filter(
    (a) => a.status === "pending"
  );

  // Recently booked appointments (sorted by created_at desc)
  const recentAppointments = [...validAppointments]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const isLoading = appointments === null;

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            {user?.name
              ? `Welcome back, ${user.name}. Here is an overview of your schedule.`
              : "Overview of your bookings, schedule, and website activity."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Link href="/panel/appointments">
            <Button size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Failed to load dashboard data: {error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-xs text-red-700 hover:bg-red-100"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Google Calendar Connection Banner (if not connected) */}
      {!isLoading && googleStatus && !googleStatus.connected && (
        <div className="p-4 sm:p-5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900">
                Google Calendar is not synced
              </h4>
              <p className="text-sm text-amber-700 mt-0.5">
                Connect your Google account in Settings to automatically sync new
                bookings with your phone and personal calendar.
              </p>
            </div>
          </div>
          <Link href="/panel/settings" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-amber-300 text-amber-900 bg-white hover:bg-amber-100"
            >
              Connect Calendar
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 border border-gray-200 rounded-lg bg-white space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Sessions this week */}
          <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                This Week
              </span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {thisWeekAppointments.length}
              </span>
              <span className="text-xs text-gray-400">sessions</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {thisWeekPendingCount > 0 ? (
                <span className="text-amber-600 font-medium">
                  {thisWeekPendingCount} pending confirmation
                </span>
              ) : thisWeekAppointments.length > 0 ? (
                <span className="text-emerald-600 font-medium">
                  All confirmed
                </span>
              ) : (
                "No sessions scheduled"
              )}
            </p>
          </div>

          {/* 2. Upcoming Sessions */}
          <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Upcoming
              </span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {upcomingAppointments.length}
              </span>
              <span className="text-xs text-gray-400">total</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 truncate">
              {upcomingAppointments.length > 0
                ? `Next: ${getSessionDateBadge(upcomingAppointments[0].date).label}`
                : "No future bookings"}
            </p>
          </div>

          {/* 3. Pending Requests */}
          <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Pending Review
              </span>
              <div
                className={cn(
                  "p-2 rounded-lg",
                  pendingAppointments.length > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {pendingAppointments.length}
              </span>
              <span className="text-xs text-gray-400">requests</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {pendingAppointments.length > 0 ? (
                <span className="text-amber-600 font-medium">
                  Awaiting response
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">
                  All clear
                </span>
              )}
            </p>
          </div>

          {/* 4. Google Calendar / Sync Status */}
          <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Calendar Sync
              </span>
              <div
                className={cn(
                  "p-2 rounded-lg",
                  googleStatus?.connected
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {googleStatus?.connected ? "Active" : "Offline"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 truncate">
              {googleStatus?.connected
                ? googleStatus.email ?? "Google Calendar synced"
                : "Not connected"}
            </p>
          </div>
        </div>
      )}

      {/* Main Two-Column Section: Upcoming & Recent */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Upcoming Sessions */}
          <div className="border border-gray-200 rounded-lg bg-white flex flex-col shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Sessions
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Chronological schedule starting today
                </p>
              </div>
              <Link
                href="/panel/appointments"
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                Calendar
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-6 flex-1">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="p-3 bg-gray-50 rounded-full w-fit mx-auto mb-3 text-gray-400">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No upcoming sessions
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mb-4">
                    New bookings from the contact page will automatically appear
                    here.
                  </p>
                  <Link href="/panel/appointments">
                    <Button variant="outline" size="sm" className="text-xs">
                      Check Calendar
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingAppointments.slice(0, 5).map((appointment) => {
                    const badge = getSessionDateBadge(appointment.date);
                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/70 transition-all duration-150 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Date Pill */}
                          <div
                            className={cn(
                              "px-2.5 py-1.5 rounded-md text-xs font-medium text-center shrink-0 min-w-[72px]",
                              badge.isUrgent
                                ? "bg-primary/10 text-primary font-semibold"
                                : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {badge.label}
                          </div>

                          {/* Details */}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                              {appointment.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                {formatTimeLabel(appointment.start_time)}
                              </span>
                              <span>•</span>
                              <span className="truncate">{appointment.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Action */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              "text-xs font-medium rounded-md px-2 py-0.5 border",
                              STATUS_STYLES[appointment.status]
                            )}
                          >
                            {STATUS_LABELS[appointment.status]}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {upcomingAppointments.length > 5 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                  href="/panel/appointments"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  +{upcomingAppointments.length - 5} more upcoming sessions in calendar →
                </Link>
              </div>
            )}
          </div>

          {/* Card 2: Recently Booked Sessions */}
          <div className="border border-gray-200 rounded-lg bg-white flex flex-col shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Requests
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Latest bookings submitted by clients
                </p>
              </div>
              <Link
                href="/panel/appointments"
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                All Bookings
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-6 flex-1">
              {recentAppointments.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="p-3 bg-gray-50 rounded-full w-fit mx-auto mb-3 text-gray-400">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No requests recorded
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    When visitors submit the booking form on your contact page,
                    their requests will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentAppointments.map((appointment) => {
                    const relativeTime = formatRelativeTime(
                      appointment.created_at
                    );
                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/70 transition-all duration-150 flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                              {appointment.name}
                            </p>
                            {relativeTime && (
                              <span className="text-[11px] text-gray-400 shrink-0">
                                {relativeTime}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Requested for{" "}
                            <span className="font-medium text-gray-700">
                              {getSessionDateBadge(appointment.date).label}
                            </span>{" "}
                            at {formatTimeLabel(appointment.start_time)}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              "text-xs font-medium rounded-md px-2 py-0.5 border",
                              STATUS_STYLES[appointment.status]
                            )}
                          >
                            {STATUS_LABELS[appointment.status]}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {validAppointments.length > 5 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                  href="/panel/appointments"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Manage all {validAppointments.length} bookings →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Navigation Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/panel/appointments"
            className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                Appointments
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                View month calendar, check scheduled slots, and manage client bookings.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-primary gap-1">
              <span>Open calendar</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/panel/content"
            className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-3 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                Website Content
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Update hero text, pricing packages, services, gallery images, and FAQ.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-primary gap-1">
              <span>Edit content</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/panel/settings"
            className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-3 group-hover:scale-105 transition-transform">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                Settings & Hours
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Configure weekly work hours, session duration, timezone, and Google Calendar.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-primary gap-1">
              <span>Manage settings</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Appointment Detail Sheet modal */}
      <AppointmentDetailSheet
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onChanged={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
