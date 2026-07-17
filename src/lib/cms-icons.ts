import {
  Camera,
  Users,
  Star,
  Heart,
  Award,
  Zap,
  Sun,
  Aperture,
  Image,
  Eye,
  Sparkles,
  Clock,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated allowlist of lucide-react icons available for CMS-driven sections
 * (currently used by the "What's Included" items on the services page).
 *
 * Icons are stored in the DB as their key name (e.g. "Camera") and looked up
 * via `getServicesIcon(name)`. Keep this list stable — renaming a key will
 * break any saved content that referenced the old name.
 */
export const SERVICES_ICONS = {
  Camera,
  Users,
  Star,
  Heart,
  Award,
  Zap,
  Sun,
  Aperture,
  Image,
  Eye,
  Sparkles,
  Clock,
} as const;

export type ServicesIconName = keyof typeof SERVICES_ICONS;

export const SERVICES_ICON_NAMES = Object.keys(SERVICES_ICONS) as ServicesIconName[];

/**
 * Resolve a stored icon name to its lucide component. Returns null if the
 * name is not in the allowlist (so a stale DB value renders as nothing
 * instead of throwing).
 */
export function getServicesIcon(name: string | undefined | null): LucideIcon | null {
  if (!name) return null;
  return (SERVICES_ICONS as Record<string, LucideIcon>)[name] ?? null;
}
