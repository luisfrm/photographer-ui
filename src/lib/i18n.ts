import { LOCALES, type Locale } from "@/types/cms";

const LOCALE_PREFIXES = LOCALES.map((l) => `/${l}`);

/**
 * Ensure an internal URL carries the locale prefix (e.g. "/contact" → "/en/contact").
 * External URLs (http:, mailto:, tel:, #, etc.) are returned untouched.
 * URLs already prefixed with any supported locale are left as-is.
 */
export function withLocalePrefix(locale: Locale, url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("/")) return trimmed;
  if (trimmed === "/") return `/${locale}`;

  const hasLocalePrefix = LOCALE_PREFIXES.some(
    (prefix) => trimmed === prefix || trimmed.startsWith(`${prefix}/`)
  );
  if (hasLocalePrefix) return trimmed;

  return `/${locale}${trimmed}`;
}