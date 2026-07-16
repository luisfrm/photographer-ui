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
  CmsAboutPreviewContent,
  CmsAboutPreviewLocale,
  CmsGalleryContent,
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
  CmsAboutPreviewContent,
  CmsAboutPreviewLocale,
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

// --- About Preview-Specific Actions ---

const ABOUT_PREVIEW_DEFAULTS: CmsAboutPreviewContent = {
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
 * Load about preview content with defaults.
 */
export async function getAboutPreviewContent(): Promise<CmsAboutPreviewContent> {
  const { data, error } = await getContentAction("home.about-preview");

  if (error || !data) {
    return ABOUT_PREVIEW_DEFAULTS;
  }

  return {
    ...ABOUT_PREVIEW_DEFAULTS,
    ...data,
    locales: {
      en: { ...ABOUT_PREVIEW_DEFAULTS.locales.en, ...(data as CmsAboutPreviewContent).locales?.en },
      es: { ...ABOUT_PREVIEW_DEFAULTS.locales.es, ...(data as CmsAboutPreviewContent).locales?.es },
    },
  };
}

/**
 * Save about preview content for a single locale.
 * Preserves the other locale's data and shared image.
 */
export async function saveAboutPreviewLocaleContent(
  locale: Locale,
  localeData: CmsAboutPreviewLocale
): Promise<{ success: boolean; error: string | null }> {
  const current = await getAboutPreviewContent();

  const updated: CmsAboutPreviewContent = {
    ...current,
    locales: {
      ...current.locales,
      [locale]: localeData,
    },
  };

  const { error } = await saveContentAction("home.about-preview", updated);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * Save the shared about preview image (R2 key).
 * Flow: update DB -> then delete old image from R2.
 */
export async function saveAboutPreviewImage(
  newImageKey: string,
  oldKey?: string
): Promise<{ success: boolean; error: string | null }> {
  const current = await getAboutPreviewContent();

  const updated: CmsAboutPreviewContent = {
    ...current,
    image: newImageKey,
  };

  const { error } = await saveContentAction("home.about-preview", updated);

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
