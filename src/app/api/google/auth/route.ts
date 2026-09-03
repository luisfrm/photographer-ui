import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  buildAuthUrl,
  generateOAuthState,
  getRedirectUri,
  hasGoogleCredentials,
} from "@/lib/scheduling/google";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const settingsUrl = `${origin}/panel/dashboard/settings`;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/panel/login", origin));
  }

  if (!hasGoogleCredentials()) {
    return NextResponse.redirect(
      new URL(`${settingsUrl}?google=missing_config`, origin)
    );
  }

  const state = generateOAuthState();

  // Store state in an httpOnly cookie so the callback can verify it.
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  const authUrl = buildAuthUrl({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    redirectUri: getRedirectUri(),
    state,
  });

  return NextResponse.redirect(authUrl);
}