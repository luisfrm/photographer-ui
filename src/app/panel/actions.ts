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
  CmsGeneralContent,
  CmsGeneralLocale,
  CmsSectionData,
  CmsSectionKey,
  Locale,
} from "@/types/cms";

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
      location: "",
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
