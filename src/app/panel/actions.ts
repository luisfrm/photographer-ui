"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { transformUser, type UserProfile } from "@/lib/supabase/user";

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

export type HeroContent = {
  title: string;
  subtitle: string;
  cta: string;
  ctaUrl: string;
  ctaNewTab: boolean;
  backgroundImage1: string;
  backgroundImage2: string;
};

type ContentResult<T> = {
  data: T | null;
  error: string | null;
};

// ─── Content Actions ────────────────────────────────────────

/**
 * Load content for a given section and locale from Supabase
 */
export async function getContentAction<T = Record<string, unknown>>(
  section: string,
  locale: string = "en"
): Promise<ContentResult<T>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("section", section)
      .eq("locale", locale)
      .single();

    if (error) {
      // PGRST116 = no rows found, return null data without error
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
 * Save content for a given section and locale (upsert)
 */
export async function saveContentAction<T = object>(
  section: string,
  data: T,
  locale: string = "en"
): Promise<ContentResult<T>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Atomic upsert — avoids race condition of check-then-insert/update
    const result = await supabase
      .from("content")
      .upsert(
        { section, locale, data, updated_at: new Date().toISOString() },
        { onConflict: "section,locale" }
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

/**
 * Load hero content with defaults
 */
export async function getHeroContent(locale: string = "en"): Promise<HeroContent> {
  const defaults: HeroContent = {
    title: "DnovaGallery",
    subtitle:
      "It's not the <strong>camera</strong> who makes the photographer, it's the <strong>photographer</strong> who makes the camera.",
    cta: "Book a session",
    ctaUrl: "/contact",
    ctaNewTab: false,
    backgroundImage1: "",
    backgroundImage2: "",
  };

  const { data, error } = await getContentAction<HeroContent>("home.hero", locale);

  if (error || !data) {
    return defaults;
  }

  return { ...defaults, ...data };
}

/**
 * Save hero content
 */
export async function saveHeroContent(
  data: HeroContent,
  locale: string = "en"
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await saveContentAction("home.hero", data, locale);

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}
