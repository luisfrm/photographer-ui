import type { Metadata } from "next";
import type { Locale } from "@/types/cms";

/**
 * Retrieves the normalized base URL for the application.
 */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || "https://dnovagallery.com";
  return url.replace(/\/+$/, "");
}

/**
 * Default copywriting presets for each page by locale.
 * Designed with clarity, active voice, and character constraints for Google SERP.
 */
export const SEO_COPY = {
  home: {
    en: {
      title: "DnovaGallery | Portrait & Event Photography in Utah",
      description:
        "Capture timeless, natural portraits and intimate events in Utah with Darianny Salas. Guided posing, magazine-quality editing, and fast turnaround. Book today.",
      keywords: [
        "Utah photographer",
        "portrait photography Utah",
        "event photographer Utah",
        "Darianny Salas",
        "DnovaGallery",
        "professional headshots",
        "family photographer Utah",
      ],
    },
    es: {
      title: "DnovaGallery | Fotografía de Retratos y Eventos en Utah",
      description:
        "Captura momentos auténticos y elegantes en Utah con Darianny Salas. Dirección experta de poses, estilo editorial y entrega rápida. Agenda tu sesión hoy.",
      keywords: [
        "fotógrafo en Utah",
        "fotografía de retratos Utah",
        "fotógrafo de eventos Utah",
        "Darianny Salas",
        "DnovaGallery",
        "fotos profesionales Utah",
        "fotografía en español Utah",
      ],
    },
  },
  services: {
    en: {
      title: "Photography Packages & Pricing | DnovaGallery Utah",
      description:
        "Transparent photography packages for portraits, couples, and events in Utah. High-resolution galleries, styling guidance, and no hidden fees. View packages.",
      keywords: [
        "photography packages Utah",
        "photo shoot pricing",
        "portrait session cost",
        "event photography packages",
      ],
    },
    es: {
      title: "Paquetes y Precios de Fotografía | DnovaGallery Utah",
      description:
        "Paquetes de fotografía claros y transparentes para retratos y eventos en Utah. Fotos en alta resolución, asesoría de estilo y sin sorpresas. Elige tu paquete.",
      keywords: [
        "paquetes de fotografía Utah",
        "precios de fotos Utah",
        "sesión de retratos tarifas",
        "fotógrafo precios transparentes",
      ],
    },
  },
  about: {
    en: {
      title: "About Darianny Salas | Lead Photographer at DnovaGallery",
      description:
        "Get to know Darianny Salas, the visual artist behind DnovaGallery in Utah. Discover the passion, philosophy, and story behind every portrait. Read the story.",
      keywords: [
        "about Darianny Salas",
        "DnovaGallery story",
        "Utah portrait artist",
        "professional photographer background",
      ],
    },
    es: {
      title: "Sobre Darianny Salas | Fotógrafa en DnovaGallery",
      description:
        "Conoce a Darianny Salas, fundadora y fotógrafa de DnovaGallery en Utah. Pasión por la luz natural, historias reales y momentos irrepetibles. Conoce mi historia.",
      keywords: [
        "sobre Darianny Salas",
        "historia DnovaGallery",
        "fotógrafa profesional Utah",
        "fotógrafa de retratos",
      ],
    },
  },
  contact: {
    en: {
      title: "Book a Photography Session | Contact DnovaGallery Utah",
      description:
        "Ready to create your dream photoshoot? Check real-time date availability, share your creative ideas, and book your session in Utah with DnovaGallery today.",
      keywords: [
        "book photographer Utah",
        "schedule photo session",
        "contact DnovaGallery",
        "photography inquiry",
      ],
    },
    es: {
      title: "Reserva Tu Sesión de Fotos | Contacto DnovaGallery Utah",
      description:
        "¿Listo para tus próximas fotos? Consulta disponibilidad de fechas en tiempo real, cuéntanos tu proyecto y reserva tu sesión en Utah con DnovaGallery hoy.",
      keywords: [
        "reservar fotógrafo Utah",
        "agendar sesión fotográfica",
        "contacto DnovaGallery",
        "consulta de fotografía",
      ],
    },
  },
} as const;

export interface MetadataOptions {
  title: string;
  description: string;
  path: string; // e.g. "", "/services", "/about", "/contact"
  locale: Locale;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Builds a comprehensive, Search Console compliant Metadata object.
 * Handles canonical URLs, hreflang with x-default, OpenGraph, and Twitter cards.
 */
export function constructMetadata({
  title,
  description,
  path,
  locale,
  image,
  keywords,
  noIndex = false,
}: MetadataOptions): Metadata {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  const currentUrl = `${baseUrl}/${locale}${normalizedPath}`;
  const defaultOgImage = `${baseUrl}/opengraph-image`;
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`
    : defaultOgImage;

  return {
    title,
    description,
    keywords: keywords && keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en${normalizedPath}`,
        es: `${baseUrl}/es${normalizedPath}`,
        "x-default": `${baseUrl}/en${normalizedPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: "DnovaGallery",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_ES"],
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
