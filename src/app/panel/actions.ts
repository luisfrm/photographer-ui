"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export type AuthFormState = {
  error: string | null;
  success: string | null;
};

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

  redirect("/panel/(protected)/dashboard");
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
