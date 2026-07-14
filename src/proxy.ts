import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Panel routes that are accessible without authentication
const PUBLIC_PANEL_ROUTES = [
  "/panel/login",
  "/panel/sign-up",
];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // Check if the route is public — if so, allow access without authentication
  const isPublicRoute = PUBLIC_PANEL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isPublicRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/panel/login";
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and visits login or sign-up, redirect to dashboard
  if (isPublicRoute && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/panel/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  // Only run on /panel routes — session refresh is only needed for the admin panel.
  matcher: ["/panel/:path*"],
};
