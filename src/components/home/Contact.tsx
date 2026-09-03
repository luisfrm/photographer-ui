import Link from "next/link";
import {
  Clock,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Link2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageSection from "@/components/common/PageSection";
import {
  getContactInfo,
  getContactScheduling,
  getPublicStudioHours,
} from "@/app/panel/actions";
import { withLocalePrefix } from "@/lib/i18n";
import { formatTimeLabel } from "@/lib/scheduling/time";
import type { Locale, CmsContactInfoLocale } from "@/types/cms";
import type { WorkDaySchedule, Weekday } from "@/types/scheduling";
import { WEEKDAYS } from "@/types/scheduling";

interface ContactProps {
  locale: Locale;
}

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Twitter,
  X: Twitter,
  Youtube,
  YouTube: Youtube,
  Linkedin,
  LinkedIn: Linkedin,
  GitHub: Github,
  Github,
};

function getSocialIcon(platform: string | undefined): LucideIcon {
  if (!platform) return Link2;
  return SOCIAL_ICON_MAP[platform] ?? Link2;
}

const DAY_LABELS: Record<Locale, Record<Weekday, string>> = {
  en: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
  es: {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  },
};

/**
 * Format daily schedule into "[first hour available] – [last hour available]".
 */
function computeFirstLastHours(
  workHours: WorkDaySchedule[],
  locale: Locale
): { dayLabel: string; hours: string; isOpen: boolean }[] {
  const isEs = locale === "es";

  // Provide sensible defaults if work hours are not configured yet
  if (!workHours || workHours.length === 0) {
    return WEEKDAYS.map((day) => {
      const isWeekend = day === "saturday" || day === "sunday";
      return {
        dayLabel: DAY_LABELS[locale][day],
        hours: isWeekend
          ? isEs
            ? "Con cita previa"
            : "By appointment"
          : isEs
          ? "09:00 – 18:00"
          : "9:00 AM – 6:00 PM",
        isOpen: !isWeekend,
      };
    });
  }

  return WEEKDAYS.map((day) => {
    const config = workHours.find((wh) => wh.day === day);
    const dayLabel = DAY_LABELS[locale][day];

    if (!config || !config.ranges || config.ranges.length === 0) {
      return {
        dayLabel,
        hours: isEs ? "Cerrado" : "Closed",
        isOpen: false,
      };
    }

    const sortedStarts = [...config.ranges].map((r) => r.start).sort();
    const sortedEnds = [...config.ranges].map((r) => r.end).sort();
    const firstHour = formatTimeLabel(sortedStarts[0]);
    const lastHour = formatTimeLabel(sortedEnds[sortedEnds.length - 1]);

    return {
      dayLabel,
      hours: `${firstHour} – ${lastHour}`,
      isOpen: true,
    };
  });
}

export default async function Contact({ locale }: Readonly<ContactProps>) {
  const [contactData, schedulingData, studioHours] = await Promise.all([
    getContactInfo(),
    getContactScheduling(),
    getPublicStudioHours(),
  ]);

  const info: CmsContactInfoLocale = contactData.locales[locale];
  const sched = schedulingData.locales[locale];
  const isEs = locale === "es";
  const dailyHours = computeFirstLastHours(studioHours.workHours, locale);

  return (
    <PageSection
      id="contact"
      className="bg-gray-100 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800"
    >
      <div className="space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-black dark:text-white tracking-tight leading-tight">
            {info.title}
          </h2>

          {info.subtitle && (
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {info.subtitle}
            </p>
          )}
        </div>

        {/* 50/50 Layout: Schedule Card (Left) / 3 Informative Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* ─── LEFT COLUMN: Schedule Hours Card (w-1/2) ─────────── */}
          <div className="bg-white dark:bg-zinc-800/95 rounded-3xl p-7 sm:p-9 border border-gray-200 dark:border-zinc-700/80 shadow-xs flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-primary/10 dark:border-zinc-700/60">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-primary/15 text-primary ring-4 ring-primary/5">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                      {sched.title || (isEs ? "Horarios del Estudio" : "Studio Hours")}
                    </h3>
                    {sched.subtitle && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {sched.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/25">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>{sched.badgeText || (isEs ? "Disponible" : "Open for bookings")}</span>
                </div>
              </div>

              {/* Hours per day (Monday: [first] - [last]) */}
              <div className="divide-y divide-gray-100 dark:divide-zinc-700/50">
                {dailyHours.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.dayLabel}
                    </span>
                    <span
                      className={`font-mono text-xs sm:text-sm ${
                        item.isOpen
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-500 italic"
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrated CTA Action */}
            <div className="pt-6 mt-4 border-t border-primary/10 dark:border-zinc-700/60">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl py-6 text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center group"
              >
                <Link href={withLocalePrefix(locale, "/contact")}>
                  <span>{sched.ctaButtonText || (isEs ? "Reservar una Sesión" : "Book a Session")}</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              {sched.note && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2.5">
                  {sched.note}
                </p>
              )}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: 3 Informative Cards (w-1/2) ────────── */}
          <div className="flex flex-col justify-between gap-4 sm:gap-5">
            {/* Card 1: Email */}
            <div className="bg-white dark:bg-zinc-800/95 rounded-2xl p-6 border border-gray-200/80 dark:border-zinc-700/70 shadow-xs flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 ring-4 ring-primary/5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  {info.emailTitle || (isEs ? "Correo Electrónico" : "Email")}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {info.emailSubtitle ||
                    (isEs
                      ? "Contáctanos por correo y responderemos a la brevedad."
                      : "Contact us by email, and we will respond shortly.")}
                </p>
                {info.email && (
                  <a
                    href={`mailto:${info.email}`}
                    className="inline-block mt-2 text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline break-all"
                  >
                    {info.email}
                  </a>
                )}
              </div>
            </div>

            {/* Card 2: Phone */}
            <div className="bg-white dark:bg-zinc-800/95 rounded-2xl p-6 border border-gray-200/80 dark:border-zinc-700/70 shadow-xs flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 ring-4 ring-primary/5">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  {info.phoneTitle || (isEs ? "Teléfono" : "Phone")}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {info.phoneSubtitle ||
                    (isEs
                      ? "Llámanos entre semana después de las 6pm."
                      : "Call us on weekdays after 6pm.")}
                </p>
                {info.phone && (
                  <a
                    href={`tel:${info.phone.replace(/\s/g, "")}`}
                    className="inline-block mt-2 text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {info.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Card 3: Location */}
            <div className="bg-white dark:bg-zinc-800/95 rounded-2xl p-6 border border-gray-200/80 dark:border-zinc-700/70 shadow-xs flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 ring-4 ring-primary/5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  {info.locationTitle || (isEs ? "Ubicación" : "Location")}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {info.locationSubtitle ||
                    (isEs
                      ? "Visita nuestro estudio únicamente con cita previa."
                      : "Visit our studio by appointment.")}
                </p>
                {info.location && (
                  <span className="inline-block mt-2 text-sm sm:text-base font-semibold text-primary">
                    {info.location}
                  </span>
                )}
              </div>
            </div>

            {/* Social Links Row */}
            {info.socialLinks && info.socialLinks.length > 0 && (
              <div className="pt-2 px-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {isEs ? "Sígueme en redes" : "Follow along"}
                </span>
                <div className="flex items-center gap-2.5">
                  {info.socialLinks.map((link, index) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <Link
                        key={index}
                        href={link.url || "#"}
                        target={link.url ? "_blank" : undefined}
                        rel={link.url ? "noopener noreferrer" : undefined}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all shadow-2xs"
                        aria-label={link.platform || "Social link"}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageSection>
  );
}
