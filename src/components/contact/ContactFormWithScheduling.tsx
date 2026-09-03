"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es as esLocale, enUS as enLocale } from "date-fns/locale";
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
import CountryCodeSelect from "@/components/common/CountryCodeSelect";
import type { Locale } from "@/types/cms";
import type {
  PublicAvailability,
  SelectedSlot,
} from "@/types/scheduling";

const TRANSLATIONS = {
  en: {
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    scheduleQuestion: "Wanna schedule a session?",
    availableSessions: "Available Sessions",
    viewStrip: "Weekly strip",
    viewCalendar: "Monthly calendar",
    noSlots:
      "No sessions available at the moment. Please send us a message and we'll find a time for you.",
    loadingSlots: "Loading availability…",
    slotsError: "Couldn't load available sessions. Please try again later.",
    messageLabel: "Message",
    bookBtn: "Book Session",
    sendBtn: "Send Message",
    bookedTitle: "Session booked!",
    bookedSubtitle: "We received your request and will confirm shortly.",
    bookAnother: "Book another session",
    errNameEmail: "Please enter your name and email.",
    errPhone: "Please enter your phone number.",
    errPickSlot: "Pick a time slot to book your session.",
    successMessage: "Message sent! We'll get back to you soon.",
    successBooking: "Session booked! We'll be in touch shortly.",
    selectedLabel: "Selected:",
    changeSlot: "Change",
    phonePlaceholder: "(555) 000-0000",
    termsPrefix: "I have read and agree to the ",
    termsLink: "Terms & Conditions",
    errTerms: "Please accept the Terms and Conditions before proceeding.",
  },
  es: {
    nameLabel: "Nombre completo",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
    scheduleQuestion: "¿Deseas agendar una sesión?",
    availableSessions: "Sesiones disponibles",
    viewStrip: "Tira semanal",
    viewCalendar: "Calendario mensual",
    noSlots:
      "No hay sesiones disponibles en este momento. Envíanos un mensaje y encontraremos un horario para ti.",
    loadingSlots: "Cargando disponibilidad…",
    slotsError:
      "No se pudieron cargar las sesiones disponibles. Por favor intenta de nuevo más tarde.",
    messageLabel: "Mensaje",
    bookBtn: "Reservar sesión",
    sendBtn: "Enviar mensaje",
    bookedTitle: "¡Sesión reservada!",
    bookedSubtitle: "Hemos recibido tu solicitud y te confirmaremos en breve.",
    bookAnother: "Reservar otra sesión",
    errNameEmail: "Por favor ingresa tu nombre y correo.",
    errPhone: "Por favor ingresa tu número de teléfono.",
    errPickSlot: "Selecciona un horario para reservar tu sesión.",
    successMessage: "¡Mensaje enviado! Nos pondremos en contacto contigo pronto.",
    successBooking: "¡Sesión reservada! Estaremos en contacto en breve.",
    selectedLabel: "Seleccionado:",
    changeSlot: "Cambiar",
    phonePlaceholder: "(555) 000-0000",
    termsPrefix: "He leído y acepto los ",
    termsLink: "Términos y Condiciones",
    errTerms: "Por favor acepta los Términos y Condiciones para continuar.",
  },
};

interface BookingSuccessCardProps {
  bookedSlot: SelectedSlot;
  locale: Locale;
  onReset: () => void;
}

/**
 * Confirmation card rendered after an appointment has been booked.
 */
function BookingSuccessCard({
  bookedSlot,
  locale,
  onReset,
}: Readonly<BookingSuccessCardProps>) {
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.en;
  const dateFnsLocale = locale === "es" ? esLocale : enLocale;

  return (
    <div className="bg-gray-100 p-8 rounded-lg">
      <div className="text-center py-10">
        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t.bookedTitle}
        </h3>
        <p className="text-gray-600 mb-1">
          {format(new Date(`${bookedSlot.date}T00:00:00`), "EEEE, MMMM d, yyyy", {
            locale: dateFnsLocale,
          })}{" "}
          at {formatTimeLabel(bookedSlot.start)}
        </p>
        <p className="text-sm text-gray-500 mb-6">{t.bookedSubtitle}</p>
        <Button type="button" variant="outline" onClick={onReset}>
          {t.bookAnother}
        </Button>
      </div>
    </div>
  );
}

interface SchedulerViewerProps {
  availability: PublicAvailability | null;
  availabilityError: string | null;
  daysWithSlots: PublicAvailability["days"];
  viewMode: "strip" | "calendar";
  selectedSlot: SelectedSlot | null;
  locale: Locale;
  onSelectSlot: (slot: SelectedSlot | null) => void;
}

/**
 * Handles scheduling availability states (error, loading, empty, and view modes).
 */
function SchedulerViewer({
  availability,
  availabilityError,
  daysWithSlots,
  viewMode,
  selectedSlot,
  locale,
  onSelectSlot,
}: Readonly<SchedulerViewerProps>) {
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.en;

  if (availabilityError) {
    return <p className="text-sm text-red-600 py-4">{t.slotsError}</p>;
  }

  if (!availability) {
    return (
      <div className="flex items-center justify-center py-8 text-zinc-400">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        {t.loadingSlots}
      </div>
    );
  }

  if (daysWithSlots.length === 0) {
    return (
      <p className="text-sm text-zinc-500 py-6 text-center">{t.noSlots}</p>
    );
  }

  if (viewMode === "strip") {
    return (
      <WeekStripScheduler
        availability={availability}
        selectedSlot={selectedSlot}
        onSelectSlot={onSelectSlot}
      />
    );
  }

  return (
    <MonthCalendarScheduler
      availability={availability}
      selectedSlot={selectedSlot}
      onSelectSlot={onSelectSlot}
    />
  );
}

interface SelectedSlotBadgeProps {
  selectedSlot: SelectedSlot;
  locale: Locale;
  onChangeSlot: () => void;
}

/**
 * Feedback banner displaying the currently selected appointment slot.
 */
function SelectedSlotBadge({
  selectedSlot,
  locale,
  onChangeSlot,
}: Readonly<SelectedSlotBadgeProps>) {
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.en;
  const dateFnsLocale = locale === "es" ? esLocale : enLocale;

  return (
    <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
        <p className="text-xs sm:text-sm font-medium text-emerald-900">
          {t.selectedLabel}{" "}
          <span className="font-semibold">
            {format(new Date(`${selectedSlot.date}T00:00:00`), "EEEE, MMMM d, yyyy", {
              locale: dateFnsLocale,
            })}{" "}
            at {formatTimeLabel(selectedSlot.start)}
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={onChangeSlot}
        className="text-xs text-emerald-700 hover:text-emerald-900 font-medium underline ml-2"
      >
        {t.changeSlot}
      </button>
    </div>
  );
}

interface ContactFormWithSchedulingProps {
  locale?: Locale;
}

export default function ContactFormWithScheduling({
  locale = "en",
}: Readonly<ContactFormWithSchedulingProps>) {
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.en;

  const [showScheduling, setShowScheduling] = useState(true);
  const [viewMode, setViewMode] = useState<"strip" | "calendar">("strip");
  const [availability, setAvailability] = useState<PublicAvailability | null>(
    null
  );
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

  // Only offer scheduling when the owner has configured any hours at all.
  const hasConfiguredHours = Boolean(
    availability && availability.days.some((day) => day.slots.length > 0)
  );

  // Derived open state
  const schedulerOpen = showScheduling && hasConfiguredHours;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error(t.errNameEmail);
      return;
    }
    if (!phone.trim()) {
      toast.error(t.errPhone);
      return;
    }
    if (schedulerOpen && !selectedSlot) {
      toast.error(t.errPickSlot);
      return;
    }

    if (!agreedToTerms) {
      toast.error(t.errTerms);
      return;
    }

    const fullPhone = `${countryCode} ${phone.trim()}`;

    if (schedulerOpen && selectedSlot && availability) {
      setIsSubmitting(true);
      const result = await createAppointmentAction({
        name,
        email,
        phone: fullPhone,
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
      toast.success(t.successBooking);
      return;
    }

    toast.success(t.successMessage);
  };

  const handleReset = () => {
    setBookedSlot(null);
    setSelectedSlot(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setShowScheduling(false);
    setAgreedToTerms(false);
  };

  if (bookedSlot) {
    return (
      <BookingSuccessCard
        bookedSlot={bookedSlot}
        locale={locale}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="bg-gray-100 p-6 sm:p-8 rounded-xl shadow-xs">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" className="text-black">
            {t.nameLabel}
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 bg-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-black">
            {t.emailLabel}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 bg-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-black font-medium">
            {t.phoneLabel} <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center mt-2">
            <CountryCodeSelect
              value={countryCode}
              onValueChange={setCountryCode}
            />
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="rounded-l-none focus-visible:z-10 h-9 bg-white"
            />
          </div>
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
                className="text-black cursor-pointer select-none"
              >
                {t.scheduleQuestion}
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
            <div className="border border-primary/40 dark:border-primary/30 rounded-xl p-4 sm:p-6 bg-white shadow-xs">
              {/* Top bar with View Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-primary/10">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h4 className="text-base font-semibold text-zinc-900">
                    {t.availableSessions}
                  </h4>
                </div>

                {/* View switcher */}
                <div className="inline-flex rounded-lg bg-primary/10 border border-primary/20 p-1 text-xs font-medium self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode("strip")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all",
                      viewMode === "strip"
                        ? "bg-white text-zinc-900 shadow-xs font-semibold"
                        : "text-zinc-600 hover:text-primary"
                    )}
                  >
                    {t.viewStrip}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all",
                      viewMode === "calendar"
                        ? "bg-white text-zinc-900 shadow-xs font-semibold"
                        : "text-zinc-600 hover:text-primary"
                    )}
                  >
                    {t.viewCalendar}
                  </button>
                </div>
              </div>

              <SchedulerViewer
                availability={availability}
                availabilityError={availabilityError}
                daysWithSlots={daysWithSlots}
                viewMode={viewMode}
                selectedSlot={selectedSlot}
                locale={locale}
                onSelectSlot={setSelectedSlot}
              />

              {selectedSlot && (
                <SelectedSlotBadge
                  selectedSlot={selectedSlot}
                  locale={locale}
                  onChangeSlot={() => setSelectedSlot(null)}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="text-black">
            {t.messageLabel}
          </Label>
          <Textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 bg-white"
          />
        </div>
        {/* Terms and conditions agreement checkbox */}
        <div className="flex items-start space-x-3 pt-1">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="mt-0.5"
            required
          />
          <Label
            htmlFor="terms"
            className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none leading-relaxed"
          >
            {t.termsPrefix}
            <Link
              href={`/${locale}/terms-and-conditions`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium underline-offset-4"
              onClick={(e) => e.stopPropagation()}
            >
              {t.termsLink}
            </Link>
            .
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !agreedToTerms}
          className="w-full sm:w-auto"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {schedulerOpen ? t.bookBtn : t.sendBtn}
        </Button>
      </form>
    </div>
  );
}
