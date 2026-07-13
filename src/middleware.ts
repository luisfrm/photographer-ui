import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only run on /panel routes — session refresh is only needed for the admin panel.
  matcher: ["/panel/:path*"],
};
