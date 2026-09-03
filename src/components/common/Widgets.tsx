"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { getContent, getLocaleFromPathname } from "@/config";

interface WidgetsProps {
  whatsappNumber?: string;
  instagramUrl?: string;
  instagramUsername?: string;
}

/** Official WhatsApp SVG Icon with tight viewBox for optimal scaling */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="68 82 364 364"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18m-79 94c-41 0-72-22-72-22l-49 13 12-48s-20-31-20-70c0-72 59-132 132-132 68 0 126 53 126 127 0 72-58 131-129 132m-159 29l83-23a158 158 0 0 0 230-140c0-86-68-155-154-155a158 158 0 0 0-137 236" />
    </svg>
  );
}

/** Official Instagram SVG Icon */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Widgets({
  whatsappNumber,
  instagramUrl,
  instagramUsername,
}: WidgetsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = getContent(locale);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cleanWhatsApp = whatsappNumber?.replace(/\D/g, "") ?? "";
  const hasWhatsApp = cleanWhatsApp.length > 0;

  const instagramTarget =
    instagramUrl?.trim() ||
    (instagramUsername ? `https://instagram.com/${instagramUsername.replace(/^@/, "")}` : "");
  const hasInstagram = Boolean(instagramTarget && instagramTarget.length > 0);

  const openWhatsApp = () => {
    if (!cleanWhatsApp) return;
    const message = encodeURIComponent(t.widgets.whatsappMessage);
    const url = `https://wa.me/${cleanWhatsApp}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openInstagram = () => {
    if (!instagramTarget) return;
    const url = instagramTarget.startsWith("http")
      ? instagramTarget
      : `https://instagram.com/${instagramTarget.replace(/^@/, "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Dynamically calculate slot position:
  // Slot 0 = bottom-6 (24px)
  // Slot 1 = bottom-24 (96px, 72px step = 16px gap)
  // Slot 2 = bottom-42 (168px, 72px step = 16px gap)
  let nextSlot = showScrollTop ? 1 : 0;
  const whatsappSlot = hasWhatsApp ? nextSlot++ : -1;
  const instagramSlot = hasInstagram ? nextSlot++ : -1;

  const getBottomClass = (slot: number) => {
    if (slot === 0) return "bottom-6";
    if (slot === 1) return "bottom-24";
    if (slot === 2) return "bottom-42";
    return "bottom-6";
  };

  return (
    <>
      {/* WhatsApp Widget */}
      {hasWhatsApp && (
        <button
          onClick={openWhatsApp}
          className={cn(
            "group fixed right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
            getBottomClass(whatsappSlot)
          )}
          aria-label={t.widgets.whatsappLabel}
          title={t.widgets.whatsappTooltip}
        >
          <WhatsAppIcon className="w-6 h-6 shrink-0" />
          <span className="absolute pointer-events-none right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
            {t.widgets.whatsappTooltip}
          </span>
        </button>
      )}

      {/* Instagram Widget */}
      {hasInstagram && (
        <button
          onClick={openInstagram}
          className={cn(
            "group fixed right-6 z-50 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
            getBottomClass(instagramSlot)
          )}
          aria-label={t.widgets.instagramLabel}
          title={t.widgets.instagramTooltip}
        >
          <InstagramIcon className="w-6 h-6 shrink-0" />
          <span className="absolute pointer-events-none right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
            {t.widgets.instagramTooltip}
          </span>
        </button>
      )}

      {/* Scroll to Top Widget */}
      <button
        onClick={scrollToTop}
        className={cn(
          "bottom-6 group fixed right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-in slide-in-from-bottom-2",
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label={t.widgets.scrollTopLabel}
        title={t.widgets.scrollTopTooltip}
      >
        <ChevronUp className="w-6 h-6" />
        <span className="absolute pointer-events-none right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
          {t.widgets.scrollTopTooltip}
        </span>
      </button>
    </>
  );
}
