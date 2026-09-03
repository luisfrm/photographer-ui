import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only Supabase client using the service role key.
 * Bypasses RLS — NEVER import this from a client component or use it with
 * user-supplied data without extra checks. Used for the Google Calendar
 * sync on booking (reads the owner's private OAuth tokens).
 */
export const createServiceClient = () =>
  createSupabaseClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });