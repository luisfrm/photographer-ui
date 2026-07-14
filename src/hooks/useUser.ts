"use client";

import { useState, useEffect } from "react";
import { getCurrentUserAction, type UserProfile } from "@/app/panel/actions";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUserAction();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}