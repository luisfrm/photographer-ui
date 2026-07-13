import { en } from "./lang/en";
import { es } from "./lang/es";
import type { SiteContent } from "./lang/types";

const locales = { en, es } as const;

export type Locale = keyof typeof locales;

export const DEFAULT_LOCALE: Locale = "en";

export function isValidLocale(locale: string): locale is Locale {
  return locale in locales;
}

export function getContent(locale: string): SiteContent {
  return locales[locale as Locale] ?? locales[DEFAULT_LOCALE];
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isValidLocale(segment) ? segment : DEFAULT_LOCALE;
}

export type { SiteContent };
