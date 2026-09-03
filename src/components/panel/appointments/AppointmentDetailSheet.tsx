"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Trash2, CheckCircle2, CalendarDays, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  deleteAppointmentAction,
  syncAppointmentAction,
  updateAppointmentStatusAction,
} from "@/app/panel/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type { Appointment, AppointmentStatus } from "@/types/scheduling";

export interface StatusOption {
  value: AppointmentStatus;
  label: string;
  dotClass: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { value: "pending", label: "Pending", dotClass: "bg-amber-500" },
  { value: "confirmed", label: "Confirmed", dotClass: "bg-emerald-500" },
  { value: "completed", label: "Completed", dotClass: "bg-blue-500" },
  { value: "cancelled", label: "Cancelled", dotClass: "bg-zinc-400" },
];

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function AppointmentDetailSheet({
  appointment,
  onClose,
  onChanged,
  onDeleted,
}: {
  appointment: Appointment | null;
  onClose: () => void;
  onChanged: (updated: Appointment) => void;
  onDeleted: (id: string) => void;
}) {
  const [status, setStatus] = useState<AppointmentStatus>(
    appointment?.status ?? "pending"
  );
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);

  const handleSyncGoogle = async () => {
    if (!appointment) return;
    setIsSyncingGoogle(true);
    const result = await syncAppointmentAction(appointment.id);
    if (result.error) {
      toast.error(`Sync failed: ${result.error}`);
    } else {
      toast.success("Appointment synced to Google Calendar!");
      if (result.googleEventId) {
        onChanged({ ...appointment, google_event_id: result.googleEventId });
      }
    }
    setIsSyncingGoogle(false);
  };

  const handleSaveStatus = async () => {
    if (!appointment || status === appointment.status) return;
    setIsSavingStatus(true);
    const result = await updateAppointmentStatusAction(appointment.id, status);
    if (result.error) {
      toast.error(`Failed to update status: ${result.error}`);
    } else {
      onChanged({ ...appointment, status });
      toast.success(`Status updated to ${STATUS_LABELS[status]}.`);
    }
    setIsSavingStatus(false);
  };

  const handleDelete = async () => {
    if (!appointment) return;
    if (
      !window.confirm(
        `Delete the appointment for ${appointment.name} on ${format(
          new Date(`${appointment.date}T00:00:00`),
          "MMMM d, yyyy"
        )}? This cannot be undone.`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    const result = await deleteAppointmentAction(appointment.id);
    if (result.error) {
      toast.error(`Failed to delete: ${result.error}`);
      setIsDeleting(false);
    } else {
      onDeleted(appointment.id);
      toast.success("Appointment deleted.");
    }
  };

  const formattedDate = appointment
    ? format(new Date(`${appointment.date}T00:00:00`), "EEEE, MMMM d, yyyy")
    : "";

  return (
    <Sheet
      open={Boolean(appointment)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        {appointment && (
          <>
            <SheetHeader>
              <SheetTitle className="text-xl">{appointment.name}</SheetTitle>
              <SheetDescription>
                Session booking — created{" "}
                {format(new Date(appointment.created_at), "MMM d, yyyy 'at' h:mm a")}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 space-y-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-2.5 py-1 border ${STATUS_STYLES[appointment.status]}`}
                >
                  {STATUS_LABELS[appointment.status]}
                </span>
                {appointment.google_event_id ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-2.5 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Synced to Google Calendar
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSyncingGoogle}
                    onClick={handleSyncGoogle}
                    className="h-7 text-xs px-2.5"
                  >
                    {isSyncingGoogle ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Sync to Google Calendar
                  </Button>
                )}
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  {formattedDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatTimeLabel(appointment.start_time)} –{" "}
                  {formatTimeLabel(appointment.end_time)}
                  <span className="text-xs text-gray-400">
                    ({appointment.timezone})
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href={`mailto:${appointment.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {appointment.email}
                  </a>
                </div>
                {appointment.phone && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900">{appointment.phone}</p>
                  </div>
                )}
                {appointment.message && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Message
                    </p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {appointment.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Status editor */}
              <div className="space-y-2">
                <label
                  htmlFor="appointment-status"
                  className="text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <Select
                    value={status}
                    onValueChange={(val) => setStatus(val as AppointmentStatus)}
                  >
                    <SelectTrigger
                      id="appointment-status"
                      className="h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus-visible:ring-primary/40 focus-visible:border-primary"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                opt.dotClass
                              )}
                            />
                            <span>{opt.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handleSaveStatus}
                    disabled={
                      isSavingStatus || status === appointment.status
                    }
                    className="h-10 px-4"
                  >
                    {isSavingStatus && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete appointment
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}