"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Loader2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  createAppointmentAction,
  getAvailableSlotsAction,
} from "@/app/panel/actions";
import { formatTimeLabel } from "@/lib/scheduling/time";
import WeekStripScheduler from "@/components/scheduling/WeekStripScheduler";
import MonthCalendarScheduler from "@/components/scheduling/MonthCalendarScheduler";
import type {
  PublicAvailability,
  SelectedSlot,
} from "@/types/scheduling";

export default function ContactFormWithScheduling() {
  const [showScheduling, setShowScheduling] = useState(false);
  const [viewMode, setViewMode] = useState<"strip" | "calendar">("strip");
  const [availability, setAvailability] = useState<PublicAvailability | null>(
    null
  );
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<SelectedSlot | null>(null);

  useEffect(() => {
    getAvailableSlotsAction().then((result) => {
      if (result.error) {
        console.error("Failed to load availability:", result.error);
      }
      setAvailability(result.data);
      setAvailabilityError(result.error);
    });
  }, []);

  const daysWithSlots = (availability?.days ?? []).filter((day) =>
    day.slots.some((slot) => !slot.booked)
  );

  // Only offer scheduling when the owner has configured any hours at all
  // (regardless of whether the slots are already booked).
  const hasConfiguredHours = Boolean(
    availability && availability.days.some((day) => day.slots.length > 0)
  );

  // Derived open state — if hours were removed while the panel was open,
  // the scheduler simply stays collapsed.
  const schedulerOpen = showScheduling && hasConfiguredHours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    if (schedulerOpen && !selectedSlot) {
      toast.error("Pick a time slot to book your session.");
      return;
    }

    if (schedulerOpen && selectedSlot && availability) {
      setIsSubmitting(true);
      const result = await createAppointmentAction({
        name,
        email,
        phone,
        message,
        date: selectedSlot.date,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        timezone: availability.timezone,
      });
      setIsSubmitting(false);

      if (result.error) {
        toast.error(result.error);
        // Slot may have been taken — refresh availability.
        const fresh = await getAvailableSlotsAction();
        if (fresh.data) setAvailability(fresh.data);
        return;
      }

      setBookedSlot(selectedSlot);
      toast.success("Session booked! We'll be in touch shortly.");
      return;
    }

    toast.success("Message sent! We'll get back to you soon.");
  };

  const handleReset = () => {
    setBookedSlot(null);
    setSelectedSlot(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setShowScheduling(false);
  };

  if (bookedSlot) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg">
        <div className="text-center py-10">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Session booked!
          </h3>
          <p className="text-gray-600 mb-1">
            {format(
              new Date(`${bookedSlot.date}T00:00:00`),
              "EEEE, MMMM d, yyyy"
            )}{" "}
            at {formatTimeLabel(bookedSlot.start)}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We received your request and will confirm shortly.
          </p>
          <Button type="button" variant="outline" onClick={handleReset}>
            Book another session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" className="text-black">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-black">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-black">
            Phone <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          {hasConfiguredHours && (
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="schedule"
                checked={schedulerOpen}
                onCheckedChange={(checked) => {
                  setShowScheduling(
                    checked === "indeterminate" ? false : checked
                  );
                  if (checked) setSelectedSlot(null);
                }}
              />
              <Label
                htmlFor="schedule"
                className="text-black cursor-pointer"
              >
                Wanna schedule a session?
              </Label>
            </div>
          )}

          {/* Animated Scheduling Section */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              schedulerOpen
                ? "max-h-[1600px] opacity-100 mb-6"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="border border-zinc-200 rounded-xl p-5 sm:p-6 bg-white shadow-sm">
              {/* Top bar with View Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h4 className="text-base font-semibold text-zinc-900">
                    Available Sessions
                  </h4>
                </div>

                {/* View switcher for client comparison */}
                <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-medium self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode("strip")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all",
                      viewMode === "strip"
                        ? "bg-white text-zinc-900 shadow-sm font-semibold"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    Tira semanal
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all",
                      viewMode === "calendar"
                        ? "bg-white text-zinc-900 shadow-sm font-semibold"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    Calendario mensual
                  </button>
                </div>
              </div>

              {availabilityError ? (
                <p className="text-sm text-red-600 py-4">
                  Couldn't load available sessions. Please try again later.
                </p>
              ) : !availability ? (
                <div className="flex items-center justify-center py-8 text-zinc-400">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading availability…
                </div>
              ) : daysWithSlots.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6 text-center">
                  No sessions available at the moment. Please send us a message
                  and we'll find a time for you.
                </p>
              ) : viewMode === "strip" ? (
                <WeekStripScheduler
                  availability={availability}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              ) : (
                <MonthCalendarScheduler
                  availability={availability}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              )}

              {selectedSlot && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-emerald-900">
                      Selected:{" "}
                      <span className="font-semibold">
                        {format(
                          new Date(`${selectedSlot.date}T00:00:00`),
                          "EEEE, MMMM d, yyyy"
                        )}{" "}
                        at {formatTimeLabel(selectedSlot.start)}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium underline ml-2"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="text-black">
            Message
          </Label>
          <Textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2"
          />
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {schedulerOpen ? "Book Session" : "Send Message"}
        </Button>
      </form>
    </div>
  );
}