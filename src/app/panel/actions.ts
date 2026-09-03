"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { transformUser, type UserProfile } from "@/lib/supabase/user";
import { deleteR2Objects } from "@/lib/r2/upload";
import type {
  CmsHeroContent,
  CmsHeroLocale,
  CmsCarouselContent,
  CmsImage,
  CmsAboutContent,
  CmsAboutLocale,
  CmsGalleryContent,
  CmsServicesMetaContent,
  CmsServicesMetaLocale,
  CmsServicesPackagesContent,
  CmsServicesPackagesLocale,
  CmsServicesIncludedContent,
  CmsServicesIncludedLocale,
  CmsServicesProcessContent,
  CmsServicesProcessLocale,
  CmsServicesFaqContent,
  CmsServicesFaqLocale,
  CmsContactInfoContent,
  CmsContactInfoLocale,
  CmsContactSchedulingContent,
  CmsContactSchedulingLocale,
  CmsGeneralContent,
  CmsGeneralLocale,
  CmsSectionData,
  CmsSectionKey,
  Locale,
} from "@/types/cms";
import type {
  Appointment,
  AppointmentStatus,
  GoogleTokens,
  NewAppointmentInput,
  PanelSettings,
  PublicAvailability,
  WorkDaySchedule,
} from "@/types/scheduling";
import { DEFAULT_TIMEZONE, DEFAULT_SESSION_DURATION } from "@/types/scheduling";
import { isRangeValid, normalizeTime } from "@/lib/scheduling/time";
import { validateTimesSeparation } from "@/lib/scheduling/validation";
import { buildAvailability } from "@/lib/scheduling/slots";
import { isValidTimezone } from "@/lib/scheduling/constants";
import {
  buildEventPayload,
  createCalendarEvent,
  isTokenExpired,
  refreshAccessToken,
} from "@/lib/scheduling/google";
import { createServiceClient } from "@/lib/supabase/service";

// ─── Auth Types ─────────────────────────────────────────────

export type AuthFormState = {
  error: string | null;
  success: string | null;
};

// ─── Auth Actions ───────────────────────────────────────────

export async function getCurrentUserAction(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return transformUser(user);
}

export async function loginAction(
  _prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required", success: null };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  redirect("/panel/dashboard");
}

export async function signUpAction(
  _prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return { error: "All fields are required", success: null };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match", success: null };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters", success: null };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone_number: phone,
      },
    },
  });

  if (error) {
    return { error: error.message, success: null };
  }

  return {
    error: null,
    success: "Account created successfully! Please check your email to verify your account.",
  };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  redirect("/panel/login");
}

// ─── Content Types ──────────────────────────────────────────

// Re-export CMS types for convenience
export type {
  CmsHeroContent,
  CmsHeroLocale,
  CmsCarouselContent,
  CmsImage,
  CmsAboutContent,
  CmsAboutLocale,
  CmsGalleryContent,
  CmsServicesMetaContent,
  CmsServicesMetaLocale,
  CmsServicesPackagesContent,
  CmsServicesPackagesLocale,
  CmsServicePackage,
  CmsServicesIncludedContent,
  CmsServicesIncludedLocale,
  CmsServicesProcessContent,
  CmsServicesProcessLocale,
  CmsServicesFaqContent,
  CmsServicesFaqLocale,
  CmsFaqItem,
  CmsSectionData,
  CmsSectionKey,
  Locale,
} from "@/types/cms";

type ContentResult<T> = {
  data: T | null;
  error: string | null;
};

// ─── Content Actions ────────────────────────────────────────

/**
 * Load content for a given section from Supabase.
 * Single row per section — no locale parameter needed.
 */
export async function getContentAction<
  K extends CmsSectionKey = CmsSectionKey,
  T extends CmsSectionData[K] = CmsSectionData[K],
>(section: K): Promise<ContentResult<T>>;
export async function getContentAction<T = Record<string, unknown>>(
  section: string
): Promise<ContentResult<T>>;
export async function getContentAction<
  K extends CmsSectionKey = CmsSectionKey,
  T extends CmsSectionData[K] = CmsSectionData[K],
>(section: K | string): Promise<ContentResult<T>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("section", section)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { data: null, error: null };
      }
      return { data: null, error: error.message };
    }

    return { data: (data?.data as T) ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load content";
    return { data: null, error: message };
  }
}

/**
 * Save content for a given section (upsert).
 * Single row per section — replaces the entire data object.
 */
export async function saveContentAction<
  K extends CmsSectionKey = CmsSectionKey,
  T extends CmsSectionData[K] = CmsSectionData[K],
>(section: K, data: T): Promise<ContentResult<T>>;
export async function saveContentAction<T = object>(
  section: string,
  data: T
): Promise<ContentResult<T>>;
export async function saveContentAction<
  K extends CmsSectionKey = CmsSectionKey,
  T extends CmsSectionData[K] = CmsSectionData[K],
>(section: K | string, data: T | object): Promise<ContentResult<T>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const result = await supabase
      .from("content")
      .upsert(
        { section, data, updated_at: new Date().toISOString() },
        { onConflict: "section" }
      )
      .select("data")
      .single();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    return { data: (result.data?.data as T) ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save content";
    return { data: null, error: message };
  }
}

// ─── Hero-Specific Actions ──────────────────────────────────

/** Default hero content with fallback values */
const HERO_DEFAULTS: CmsHeroContent = {
  backgroundImage1: "",
  backgroundImage2: "",
  locales: {
    en: {
      title: "DnovaGallery",
      subtitle:
        "It's not the <strong>camera</strong> who makes the photographer, it's the <strong>photographer</strong> who makes the camera.",
      cta: "Book a session",
      ctaUrl: "/contact",
      ctaNewTab: false,
    },
    es: {
      title: "DnovaGallery",
      subtitle:
        "No es la <strong>cámara</strong> quien hace al fotógrafo, es el <strong>fotógrafo</strong> quien hace la cámara.",
      cta: "Reserva una sesión",
      ctaUrl: "/contact",
      ctaNewTab: false,
    },
  },
};

/**
 * Load hero content with defaults.
 */
export async function getHeroContent(): Promise<CmsHeroContent> {
  const { data, error } = await getContentAction("home.hero");

  if (error || !data) {
    return HERO_DEFAULTS;
  }

  return {
    ...HERO_DEFAULTS,
    ...data,
    locales: {
      en: { ...HERO_DEFAULTS.locales.en, ...(data as CmsHeroContent).locales?.en },
      es: { ...HERO_DEFAULTS.locales.es, ...(data as CmsHeroContent).locales?.es },
    },
  };
}

/**
 * Save the entire hero content (shared images + all locales).
 */
export async function saveHeroContent(
  data: CmsHeroContent
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await saveContentAction("home.hero", data);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

export async function saveHeroLocaleContent(
  locale: Locale,
  localeData: CmsHeroLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getHeroContent();

  const updated: CmsHeroContent = {
    ...current,
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("home.hero", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * Save hero images (R2 keys).
 * Flow: update DB -> then delete old images from R2.
 * This ensures we never lose images if DB update fails.
 */
export async function saveHeroImages(
  backgroundImage1: string,
  backgroundImage2: string,
  oldKey1?: string,
  oldKey2?: string
): Promise<{ success: boolean; error: string | null }> {
  const current = await getHeroContent();

  const updated: CmsHeroContent = {
    ...current,
    backgroundImage1,
    backgroundImage2,
  };

  const { error } = await saveContentAction("home.hero", updated);

  if (error) {
    return { success: false, error };
  }

  const keysToDelete = [oldKey1, oldKey2].filter(
    (key) => key && key.length > 0 && key !== backgroundImage1 && key !== backgroundImage2
  ) as string[];

  if (keysToDelete.length > 0) {
    try {
      await deleteR2Objects(keysToDelete);
    } catch {
      console.error("Failed to delete old R2 images:", keysToDelete);
    }
  }

  return { success: true, error: null };
}

// --- Carousel-Specific Actions ---

const CAROUSEL_DEFAULTS: CmsCarouselContent = {
  images: [],
};

export async function getCarouselContent(): Promise<CmsCarouselContent> {
  const { data, error } = await getContentAction("home.carousel");

  if (error || !data) {
    return CAROUSEL_DEFAULTS;
  }

  return {
    ...CAROUSEL_DEFAULTS,
    ...data,
  };
}

export async function saveCarouselContent(
  images: CmsImage[],
  removedKeys?: string[]
): Promise<{ success: boolean; error: string | null }> {
  const updated: CmsCarouselContent = { images };

  const { error } = await saveContentAction("home.carousel", updated);

  if (error) {
    return { success: false, error };
  }

  if (removedKeys && removedKeys.length > 0) {
    const keysToDelete = removedKeys.filter((k) => k && k.length > 0);
    if (keysToDelete.length > 0) {
      try {
        await deleteR2Objects(keysToDelete);
      } catch {
        console.error("Failed to delete old carousel images:", keysToDelete);
      }
    }
  }

  return { success: true, error: null };
}

// --- About-Specific Actions ---

const ABOUT_DEFAULTS: CmsAboutContent = {
  image: "",
  locales: {
    en: {
      title: "",
      description: "",
      cta: "",
      ctaUrl: "/en/gallery",
      ctaNewTab: false,
    },
    es: {
      title: "",
      description: "",
      cta: "",
      ctaUrl: "/es/gallery",
      ctaNewTab: false,
    },
  },
};

/**
 * Load about content with defaults.
 */
export async function getAboutContent(): Promise<CmsAboutContent> {
  const { data, error } = await getContentAction("home.about");

  if (error || !data) {
    return ABOUT_DEFAULTS;
  }

  return {
    ...ABOUT_DEFAULTS,
    ...data,
    locales: {
      en: { ...ABOUT_DEFAULTS.locales.en, ...(data as CmsAboutContent).locales?.en },
      es: { ...ABOUT_DEFAULTS.locales.es, ...(data as CmsAboutContent).locales?.es },
    },
  };
}

/**
 * Save about content for a single locale.
 * Preserves the other locale's data and shared image.
 */
export async function saveAboutLocaleContent(
  locale: Locale,
  localeData: CmsAboutLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getAboutContent();

  const updated: CmsAboutContent = {
    ...current,
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("home.about", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * Save the shared about image (R2 key).
 * Flow: update DB -> then delete old image from R2.
 */
export async function saveAboutImage(
  newImageKey: string,
  oldKey?: string
): Promise<{ success: boolean; error: string | null }> {
  const current = await getAboutContent();

  const updated: CmsAboutContent = {
    ...current,
    image: newImageKey,
  };

  const { error } = await saveContentAction("home.about", updated);

  if (error) {
    return { success: false, error };
  }

  if (oldKey && oldKey.length > 0 && oldKey !== newImageKey) {
    try {
      await deleteR2Objects([oldKey]);
    } catch {
      console.error("Failed to delete old R2 image:", oldKey);
    }
  }

  return { success: true, error: null };
}

// --- Gallery-Specific Actions ---

const GALLERY_DEFAULTS: CmsGalleryContent = {
  title: "Some Shots",
  images: [],
};

export async function getGalleryContent(): Promise<CmsGalleryContent> {
  const { data, error } = await getContentAction("home.gallery");

  if (error || !data) {
    return GALLERY_DEFAULTS;
  }

  return {
    ...GALLERY_DEFAULTS,
    ...data,
  };
}

export async function saveGalleryContent(
  title: string,
  images: CmsImage[],
  removedKeys?: string[]
): Promise<{ success: boolean; error: string | null }> {
  const updated: CmsGalleryContent = {
    title,
    images,
  };

  const { error } = await saveContentAction("home.gallery", updated);

  if (error) {
    return { success: false, error };
  }

  if (removedKeys && removedKeys.length > 0) {
    const keysToDelete = removedKeys.filter((k) => k && k.length > 0);
    if (keysToDelete.length > 0) {
      try {
        await deleteR2Objects(keysToDelete);
      } catch {
        console.error("Failed to delete old gallery images:", keysToDelete);
      }
    }
  }

  return { success: true, error: null };
}

// --- Services Meta-Specific Actions ---

const SERVICES_META_DEFAULTS: CmsServicesMetaContent = {
  locales: {
    en: {
      title: "Services",
      description:
        "Professional photography services tailored to capture your unique story. Choose from our carefully crafted packages designed to meet every need and budget.",
    },
    es: {
      title: "Servicios",
      description:
        "Servicios de fotografía profesional diseñados para capturar tu historia única. Elige entre nuestros paquetes cuidadosamente elaborados para satisfacer cada necesidad y presupuesto.",
    },
  },
};

export async function getServicesMeta(): Promise<CmsServicesMetaContent> {
  const { data, error } = await getContentAction("services.meta");

  if (error || !data) {
    return SERVICES_META_DEFAULTS;
  }

  return {
    ...SERVICES_META_DEFAULTS,
    ...data,
    locales: {
      en: { ...SERVICES_META_DEFAULTS.locales.en, ...(data as CmsServicesMetaContent).locales?.en },
      es: { ...SERVICES_META_DEFAULTS.locales.es, ...(data as CmsServicesMetaContent).locales?.es },
    },
  };
}

export async function saveServicesMetaLocaleContent(
  locale: Locale,
  localeData: CmsServicesMetaLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getServicesMeta();

  const updated: CmsServicesMetaContent = {
    ...current,
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("services.meta", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// --- Services Packages-Specific Actions ---

const SERVICES_PACKAGES_DEFAULTS: CmsServicesPackagesContent = {
  locales: {
    en: { title: "Our Packages", packages: [] },
    es: { title: "Nuestros Paquetes", packages: [] },
  },
};

export async function getServicesPackages(): Promise<CmsServicesPackagesContent> {
  const { data, error } = await getContentAction("services.packages");

  if (error || !data) {
    return SERVICES_PACKAGES_DEFAULTS;
  }

  const d = data as CmsServicesPackagesContent;
  return {
    locales: {
      en: { ...SERVICES_PACKAGES_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...SERVICES_PACKAGES_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveServicesPackagesLocaleContent(
  locale: Locale,
  localeData: CmsServicesPackagesLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getServicesPackages();

  const updated: CmsServicesPackagesContent = {
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("services.packages", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// --- Services Included-Specific Actions ---

const SERVICES_INCLUDED_DEFAULTS: CmsServicesIncludedContent = {
  locales: {
    en: { title: "What's Included", items: [] },
    es: { title: "Qué Incluye", items: [] },
  },
};

export async function getServicesIncluded(): Promise<CmsServicesIncludedContent> {
  const { data, error } = await getContentAction("services.included");

  if (error || !data) {
    return SERVICES_INCLUDED_DEFAULTS;
  }

  const d = data as CmsServicesIncludedContent;
  return {
    locales: {
      en: { ...SERVICES_INCLUDED_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...SERVICES_INCLUDED_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveServicesIncludedLocaleContent(
  locale: Locale,
  localeData: CmsServicesIncludedLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getServicesIncluded();

  const updated: CmsServicesIncludedContent = {
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("services.included", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// --- Services Process-Specific Actions ---

const SERVICES_PROCESS_DEFAULTS: CmsServicesProcessContent = {
  locales: {
    en: { title: "Our Process", steps: [] },
    es: { title: "Nuestro Proceso", steps: [] },
  },
};

export async function getServicesProcess(): Promise<CmsServicesProcessContent> {
  const { data, error } = await getContentAction("services.process");

  if (error || !data) {
    return SERVICES_PROCESS_DEFAULTS;
  }

  const d = data as CmsServicesProcessContent;
  return {
    locales: {
      en: { ...SERVICES_PROCESS_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...SERVICES_PROCESS_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveServicesProcessLocaleContent(
  locale: Locale,
  localeData: CmsServicesProcessLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getServicesProcess();

  const updated: CmsServicesProcessContent = {
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("services.process", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// --- Services FAQ-Specific Actions ---

const SERVICES_FAQ_DEFAULTS: CmsServicesFaqContent = {
  locales: {
    en: { title: "Frequently Asked Questions", items: [] },
    es: { title: "Preguntas Frecuentes", items: [] },
  },
};

export async function getServicesFaq(): Promise<CmsServicesFaqContent> {
  const { data, error } = await getContentAction("services.faq");

  if (error || !data) {
    return SERVICES_FAQ_DEFAULTS;
  }

  const d = data as CmsServicesFaqContent;
  return {
    locales: {
      en: { ...SERVICES_FAQ_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...SERVICES_FAQ_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveServicesFaqLocaleContent(
  locale: Locale,
  localeData: CmsServicesFaqLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getServicesFaq();

  const updated: CmsServicesFaqContent = {
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("services.faq", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// ─── Contact Info-Specific Actions ─────────────────────────

const CONTACT_INFO_DEFAULTS: CmsContactInfoContent = {
  locales: {
    en: {
      title: "Get In Touch",
      subtitle:
        "I'd love to hear about your vision and discuss how we can bring it to life.",
      email: "hello@example.com",
      phone: "+1 555 000 0000",
      location: "",
      socialLinks: [],
    },
    es: {
      title: "Contáctanos",
      subtitle: "Me encantaría escuchar sobre tu visión y cómo hacerla realidad.",
      email: "hola@example.com",
      phone: "+1 555 000 0000",
      location: "Utah, EE. UU.",
      emailTitle: "Correo",
      emailSubtitle: "Escríbenos por correo y responderemos a la brevedad.",
      phoneTitle: "Teléfono",
      phoneSubtitle: "Llámanos entre semana después de las 6pm.",
      locationTitle: "Ubicación",
      locationSubtitle: "Visita nuestro estudio únicamente con cita previa.",
      socialLinks: [],
    },
  },
};

export async function getContactInfo(): Promise<CmsContactInfoContent> {
  const { data, error } = await getContentAction("contact.info");

  if (error || !data) {
    return CONTACT_INFO_DEFAULTS;
  }

  const d = data as CmsContactInfoContent;
  return {
    locales: {
      en: { ...CONTACT_INFO_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...CONTACT_INFO_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveContactInfoLocaleContent(
  locale: Locale,
  localeData: CmsContactInfoLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getContactInfo();

  const updated: CmsContactInfoContent = {
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("contact.info", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// ─── Contact Scheduling Actions ────────────────────────────

const CONTACT_SCHEDULING_DEFAULTS: CmsContactSchedulingContent = {
  locales: {
    en: {
      title: "Studio Hours",
      subtitle: "Available sessions for portraits, events, and commercial projects.",
      badgeText: "Open for bookings",
      ctaButtonText: "Book a Session",
      note: "Live calendar availability with direct confirmation.",
    },
    es: {
      title: "Horarios del Estudio",
      subtitle: "Sesiones disponibles para retratos, eventos y proyectos comerciales.",
      badgeText: "Disponible para reservas",
      ctaButtonText: "Reservar una Sesión",
      note: "Disponibilidad en tiempo real con confirmación directa.",
    },
  },
};

export async function getContactScheduling(): Promise<CmsContactSchedulingContent> {
  const { data, error } = await getContentAction("contact.scheduling");

  if (error || !data) {
    return CONTACT_SCHEDULING_DEFAULTS;
  }

  const d = data as CmsContactSchedulingContent;
  return {
    locales: {
      en: { ...CONTACT_SCHEDULING_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...CONTACT_SCHEDULING_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveContactSchedulingLocaleContent(
  locale: Locale,
  localeData: CmsContactSchedulingLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getContactScheduling();

  const updated: CmsContactSchedulingContent = {
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("contact.scheduling", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// ─── General (Global Brand)-Specific Actions ────────────────

const GENERAL_DEFAULTS: CmsGeneralContent = {
  logoKey: "",
  locales: {
    en: {
      title: "Darianny Salas",
      slogan: "Capturing moments, creating memories.",
    },
    es: {
      title: "Darianny Salas",
      slogan: "Capturando momentos, creando recuerdos.",
    },
  },
};

export async function getGeneral(): Promise<CmsGeneralContent> {
  const { data, error } = await getContentAction("global.general");

  if (error || !data) {
    return GENERAL_DEFAULTS;
  }

  const d = data as CmsGeneralContent;
  return {
    logoKey: d.logoKey ?? GENERAL_DEFAULTS.logoKey,
    locales: {
      en: { ...GENERAL_DEFAULTS.locales.en, ...d.locales?.en },
      es: { ...GENERAL_DEFAULTS.locales.es, ...d.locales?.es },
    },
  };
}

export async function saveGeneralLocaleContent(
  locale: Locale,
  localeData: CmsGeneralLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getGeneral();

  const updated: CmsGeneralContent = {
    logoKey: current.logoKey,
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("global.general", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

export async function saveGeneralLogo(
  logoKey: string
): Promise<{ success: boolean; error: string | null }> {
  const current = await getGeneral();

  const updated: CmsGeneralContent = {
    logoKey,
    locales: current.locales,
  };

  const { error } = await saveContentAction("global.general", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

// ─── Scheduling: Settings ───────────────────────────────────

const SETTINGS_DEFAULTS: PanelSettings = {
  workHours: [],
  timezone: DEFAULT_TIMEZONE,
  sessionDuration: DEFAULT_SESSION_DURATION,
};

async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return error || !user ? null : user;
}

/** Normalize + validate work hours submitted by the settings editor. */
function normalizeWorkHours(input: WorkDaySchedule[]): WorkDaySchedule[] {
  const seen = new Set<string>();
  const workHours: WorkDaySchedule[] = [];
  for (const day of input) {
    if (!day?.day || seen.has(day.day)) continue;
    const ranges = (day.ranges ?? []).filter((r) => isRangeValid(r));
    if (ranges.length === 0) continue; // day is off
    seen.add(day.day);
    workHours.push({ day: day.day, ranges });
  }
  return workHours;
}

/** Load the current user's scheduling settings (panel only). */
export async function getSettingsAction(): Promise<{
  data: PanelSettings;
  error: string | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { data: SETTINGS_DEFAULTS, error: "Unauthorized" };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("settings")
      .select("work_hours, timezone, session_duration")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return { data: SETTINGS_DEFAULTS, error: error.message };
    }

    if (!data) {
      return { data: SETTINGS_DEFAULTS, error: null };
    }

    const workHours = Array.isArray(data.work_hours)
      ? normalizeWorkHours(data.work_hours as WorkDaySchedule[])
      : [];
    const timezone =
      typeof data.timezone === "string" && data.timezone
        ? data.timezone
        : DEFAULT_TIMEZONE;
    const sessionDuration =
      typeof data.session_duration === "number" && data.session_duration > 0
        ? data.session_duration
        : DEFAULT_SESSION_DURATION;

    return { data: { workHours, timezone, sessionDuration }, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load settings";
    return { data: SETTINGS_DEFAULTS, error: message };
  }
}

/** Save work hours + timezone (upsert per user). */
export async function saveSettingsAction(input: {
  workHours: WorkDaySchedule[];
  timezone: string;
  sessionDuration?: number;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const timezone = input.timezone || DEFAULT_TIMEZONE;
    if (!isValidTimezone(timezone)) {
      return { success: false, error: `Invalid timezone: ${timezone}` };
    }

    const sessionDuration =
      typeof input.sessionDuration === "number" && input.sessionDuration > 0
        ? input.sessionDuration
        : DEFAULT_SESSION_DURATION;

    // Validate minimum time separation for each day's times
    for (const day of input.workHours ?? []) {
      const times = (day.ranges ?? []).map((r) => r.start);
      const conflict = validateTimesSeparation(
        day.day,
        day.day,
        times,
        sessionDuration
      );
      if (conflict) {
        return { success: false, error: conflict.message };
      }
    }

    const workHours = normalizeWorkHours(input.workHours ?? []);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.from("settings").upsert(
      {
        user_id: user.id,
        work_hours: workHours,
        timezone,
        session_duration: sessionDuration,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save settings";
    return { success: false, error: message };
  }
}

/** Whether the current user has Google Calendar connected (panel only). */
export async function getGoogleConnectionAction(): Promise<{
  connected: boolean;
  email: string | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) return { connected: false, email: null };

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase
      .from("settings")
      .select("google_tokens")
      .eq("user_id", user.id)
      .maybeSingle();

    const tokens = data?.google_tokens as GoogleTokens | null;
    return {
      connected: Boolean(tokens?.access_token),
      email: tokens?.email ?? null,
    };
  } catch {
    return { connected: false, email: null };
  }
}

/** Disconnect Google Calendar for the current user. */
export async function disconnectGoogleAction(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase
      .from("settings")
      .update({ google_tokens: null, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to disconnect Google";
    return { success: false, error: message };
  }
}

// ─── Scheduling: Public availability (contact page) ─────────

/**
 * Available slots for the next 14 days.
 *
 * Preferred path: computed in JS from `settings` + `appointments` with the
 * service-role client (no dependency on the DB RPC / PostgREST schema cache).
 * Falls back to the `get_available_slots` security-definer RPC when the
 * service key isn't configured.
 */
export async function getAvailableSlotsAction(): Promise<{
  data: PublicAvailability | null;
  error: string | null;
}> {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const result = await getAvailabilityWithServiceClient();
      if (!result.error && result.data) return result;
      console.error(
        "Service-client availability failed, falling back to RPC:",
        result.error
      );
    }

    // Fallback: security-definer RPC (public, anon-safe).
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.rpc("get_available_slots", {
      p_days: 14,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as PublicAvailability, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load availability";
    return { data: null, error: message };
  }
}

/**
 * Compute availability in JS (unit-tested logic in @/lib/scheduling) using
 * the service-role client so RLS on `settings`/`appointments` doesn't block
 * anonymous visitors.
 */
async function getAvailabilityWithServiceClient(): Promise<{
  data: PublicAvailability | null;
  error: string | null;
}> {
  const service = createServiceClient();

  const [
    { data: settings, error: settingsError },
    { data: appointments, error: appointmentsError },
  ] = await Promise.all([
    service
      .from("settings")
      .select("work_hours, timezone")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    service.from("appointments").select("date, start_time, status"),
  ]);

  if (settingsError) return { data: null, error: settingsError.message };
  if (appointmentsError) {
    return { data: null, error: appointmentsError.message };
  }

  const workHours: WorkDaySchedule[] = Array.isArray(settings?.work_hours)
    ? (settings.work_hours as WorkDaySchedule[])
    : [];
  const timezone =
    typeof settings?.timezone === "string" && settings.timezone
      ? settings.timezone
      : DEFAULT_TIMEZONE;

  const booked = ((appointments ?? []) as {
    date: string;
    start_time: string;
    status: AppointmentStatus;
  }[]).map((appointment) => ({
    date: appointment.date,
    start_time: normalizeTime(appointment.start_time),
    status: appointment.status,
  }));

  const days = buildAvailability(workHours, timezone, new Date(), 14, booked);
  return { data: { timezone, days }, error: null };
}

/** Public schedule info for landing page / contact section. */
export async function getPublicStudioHours(): Promise<{
  workHours: WorkDaySchedule[];
  timezone: string;
}> {
  try {
    const service = createServiceClient();
    const { data: settings } = await service
      .from("settings")
      .select("work_hours, timezone")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const workHours = Array.isArray(settings?.work_hours)
      ? normalizeWorkHours(settings.work_hours as WorkDaySchedule[])
      : [];
    const timezone =
      typeof settings?.timezone === "string" && settings.timezone
        ? settings.timezone
        : DEFAULT_TIMEZONE;

    return { workHours, timezone };
  } catch {
    return { workHours: [], timezone: DEFAULT_TIMEZONE };
  }
}

// ─── Scheduling: Appointments ───────────────────────────────

/** All appointments for the panel calendar (authenticated). */
export async function getAppointmentsAction(): Promise<{
  data: Appointment[] | null;
  error: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    const appointments = ((data as Appointment[]) ?? []).map((appointment) => ({
      ...appointment,
      start_time: normalizeTime(appointment.start_time),
      end_time: normalizeTime(appointment.end_time),
    }));

    return { data: appointments, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load appointments";
    return { data: null, error: message };
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Create a booking from the public contact page.
 * Re-checks availability, then (best-effort) syncs to Google Calendar
 * when the owner has it connected.
 */
export async function createAppointmentAction(
  input: NewAppointmentInput
): Promise<{ data: Appointment | null; error: string | null }> {
  try {
    const { name, email, phone, date, start_time, end_time, timezone } = input;

    if (!name?.trim() || !email?.trim()) {
      return { data: null, error: "Name and email are required" };
    }
    if (!phone?.trim()) {
      return { data: null, error: "Phone number is required" };
    }
    if (!isValidEmail(email.trim())) {
      return { data: null, error: "Please enter a valid email address" };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { data: null, error: "Invalid booking date" };
    }
    if (!isRangeValid({ start: start_time, end: end_time })) {
      return { data: null, error: "Invalid time range" };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: input.phone?.trim() || null,
        message: input.message?.trim() || null,
        date,
        start_time,
        end_time,
        timezone,
        status: "pending",
      })
      .select("*")
      .single();

    if (error || !data) {
      // 23505 = unique_violation — enforced by the partial unique index on
      // (date, start_time) for non-cancelled rows.
      if (error?.code === "23505") {
        return {
          data: null,
          error: "That time slot was just taken. Please pick another one.",
        };
      }
      return { data: null, error: error?.message ?? "Failed to book session" };
    }

    const appointment = {
      ...(data as Appointment),
      start_time: normalizeTime((data as Appointment).start_time),
      end_time: normalizeTime((data as Appointment).end_time),
    };

    // Best-effort Google Calendar sync — never fails the booking itself.
    try {
      const eventId = await syncAppointmentToGoogle(appointment);
      if (eventId) {
        // Must use service client to update appointments because anon user lacks UPDATE permission
        const service = createServiceClient();
        await service
          .from("appointments")
          .update({ google_event_id: eventId, updated_at: new Date().toISOString() })
          .eq("id", appointment.id);
        appointment.google_event_id = eventId;
      }
    } catch (err) {
      console.error("Google Calendar sync failed:", err);
    }

    return { data: appointment, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to book session";
    return { data: null, error: message };
  }
}

/**
 * Push an appointment to the owner's Google Calendar (service-role client
 * so the anon booking flow can read the private OAuth tokens).
 */
async function syncAppointmentToGoogle(
  appointment: Appointment
): Promise<string | null> {
  const service = createServiceClient();

  const { data } = await service
    .from("settings")
    .select("user_id, google_tokens")
    .not("google_tokens", "is", null)
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  const tokens = data.google_tokens as GoogleTokens | null;
  if (!tokens?.access_token) return null;

  let accessToken = tokens.access_token;
  if (isTokenExpired(tokens)) {
    if (!tokens.refresh_token) return null;
    const refreshed = await refreshAccessToken(tokens.refresh_token);
    accessToken = refreshed.access_token;
    // Persist refreshed tokens best-effort, keeping existing email
    if (tokens.email && !refreshed.email) {
      refreshed.email = tokens.email;
    }
    await service
      .from("settings")
      .update({ google_tokens: refreshed, updated_at: new Date().toISOString() })
      .eq("user_id", data.user_id);
  }

  const payload = buildEventPayload({
    summary: `Photo session — ${appointment.name}`,
    description: appointment.message ?? undefined,
    startDateTime: `${appointment.date}T${appointment.start_time}:00`,
    endDateTime: `${appointment.date}T${appointment.end_time}:00`,
    timeZone: appointment.timezone,
    attendeeEmail: appointment.email,
  });

  const { id } = await createCalendarEvent(accessToken, payload);
  return id;
}

/** Manually sync an existing appointment to Google Calendar (panel only). */
export async function syncAppointmentAction(
  appointmentId: string
): Promise<{ success: boolean; googleEventId: string | null; error: string | null }> {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, googleEventId: null, error: "Unauthorized" };

    const service = createServiceClient();
    const { data: rawAppointment, error: fetchErr } = await service
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchErr || !rawAppointment) {
      return {
        success: false,
        googleEventId: null,
        error: fetchErr?.message || "Appointment not found",
      };
    }

    const appointment: Appointment = {
      ...(rawAppointment as Appointment),
      start_time: normalizeTime((rawAppointment as Appointment).start_time),
      end_time: normalizeTime((rawAppointment as Appointment).end_time),
    };

    const eventId = await syncAppointmentToGoogle(appointment);
    if (!eventId) {
      return {
        success: false,
        googleEventId: null,
        error: "Google Calendar is not connected or could not create event.",
      };
    }

    await service
      .from("appointments")
      .update({ google_event_id: eventId, updated_at: new Date().toISOString() })
      .eq("id", appointment.id);

    return { success: true, googleEventId: eventId, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to sync to Google Calendar";
    return { success: false, googleEventId: null, error: message };
  }
}

/** Update an appointment's status from the panel. */
export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus
): Promise<{ success: boolean; error: string | null }> {
  try {
    const valid = ["pending", "confirmed", "completed", "cancelled"];
    if (!valid.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase
      .from("appointments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update appointment";
    return { success: false, error: message };
  }
}

/** Delete an appointment from the panel. */
export async function deleteAppointmentAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete appointment";
    return { success: false, error: message };
  }
}
