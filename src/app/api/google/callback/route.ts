import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeCodeForTokens,
  getRedirectUri,
} from "@/lib/scheduling/google";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const settingsUrl = `${origin}/panel/settings`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`${settingsUrl}?google=${reason}`, origin));

  if (errorParam === "access_denied") {
    return fail("error");
  }
  if (!code || !state || !savedState || state !== savedState) {
    return fail("error");
  }

  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/panel/login", origin));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, getRedirectUri());

    const { error } = await supabase.from("settings").upsert(
      {
        user_id: user.id,
        google_tokens: tokens,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Failed to persist Google tokens:", error.message);
      return fail("error");
    }

    return NextResponse.redirect(
      new URL(`${settingsUrl}?google=connected`, origin)
    );
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return fail("error");
  }
}