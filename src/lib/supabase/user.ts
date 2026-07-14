import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

/**
 * Transform Supabase User to UserProfile
 */
export function transformUser(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email || "",
    name:
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User",
    avatarUrl: user.user_metadata?.avatar_url,
  };
}