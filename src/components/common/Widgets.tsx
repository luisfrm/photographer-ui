"use client";

import { useState, useEffect } from "react";
import { ChevronUp, MessageCircle, Camera as Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { getContent, getLocaleFromPathname } from "@/config";

interface WidgetsProps {
  whatsappNumber?: string;
  instagramUrl?: string;
  instagramUsername?: string;
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

  // Dynamically calculate slot position (0 = bottom-6, 1 = bottom-[5.5rem], 2 = bottom-38)
  let nextSlot = showScrollTop ? 1 : 0;
  const whatsappSlot = hasWhatsApp ? nextSlot++ : -1;
  const instagramSlot = hasInstagram ? nextSlot++ : -1;

  const getBottomClass = (slot: number) => {
    if (slot === 0) return "bottom-6";
    if (slot === 1) return "bottom-[5.5rem]";
    if (slot === 2) return "bottom-38";
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
          <MessageCircle className="w-6 h-6" />
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
          <Instagram className="w-6 h-6" />
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
