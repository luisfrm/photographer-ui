/**
 * CMS Content Types
 *
 * Centralized type definitions for all editable website sections.
 * Each interface represents the `data` JSONB column in the `content` table.
 *
 * The content table uses a single row per section:
 *   section: "home.hero", "home.carousel", "services.packages", etc.
 *   data: JSONB with shared fields + nested locales map
 */

// ─── Shared Primitives ──────────────────────────────────────

/** Base interface for all CMS content sections (the `data` JSONB payload) */
export interface CmsContentBase {
  /** Optional metadata — not stored in the JSONB data, but can be included by editors */
  _meta?: {
    lastEditedBy?: string;
    version?: number;
  };
}

/** Image reference used across multiple sections */
export interface CmsImage {
  src: string;
  alt: string;
  caption?: string;
}

/** FAQ item used in services and other sections */
export interface CmsFaqItem {
  question: string;
  answer: string;
}

/** Testimonial item */
export interface CmsTestimonial {
  name: string;
  role?: string;
  text: string;
  avatar?: string;
  rating?: number;
}

// ─── Locale Types ───────────────────────────────────────────

/** Available locales in the system */
export type Locale = "en" | "es";

/** All supported locales array for iteration */
export const LOCALES: Locale[] = ["en", "es"];

/** Locale display names */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

// ─── Global Sections ────────────────────────────────────────

/** Global brand identity: per-locale brand name + slogan. */
export interface CmsGeneralLocale {
  title: string;
  slogan: string;
}

/** Global brand section: shared R2 logo key + per-locale title and slogan.
 *  Used by the header (logo) and the footer (logo + title + slogan). */
export interface CmsGeneralContent extends CmsContentBase {
  /** R2 object key for the brand logo (e.g. "general/1234-logo.webp"). */
  logoKey: string;
  locales: {
    [K in Locale]: CmsGeneralLocale;
  };
}

// ─── Home Sections ──────────────────────────────────────────

/** Hero locale-specific content (text, CTA) */
export interface CmsHeroLocale {
  title: string;
  subtitle: string;
  cta: string;
  ctaUrl: string;
  ctaNewTab: boolean;
}

/** Home Hero section: shared images + per-locale content */
export interface CmsHeroContent extends CmsContentBase {
  /** Shared background images — R2 object keys (e.g. "hero/1784183664742-hr90kp-photo_1.webp") */
  backgroundImage1: string;
  backgroundImage2: string;
  /** Per-locale text content */
  locales: {
    [K in Locale]: CmsHeroLocale;
  };
}

/** Home Carousel section: infinite image carousel */
export interface CmsCarouselContent extends CmsContentBase {
  images: CmsImage[];
}

/** About locale-specific content */
export interface CmsAboutLocale {
  title: string;
  description: string;
  cta: string;
  ctaUrl: string;
  ctaNewTab: boolean;
}

/** Home About section: shared image + per-locale text content */
export interface CmsAboutContent extends CmsContentBase {
  image: string;
  locales: {
    [K in Locale]: CmsAboutLocale;
  };
}

/** Home Gallery section: photo gallery grid
 * `images` order is fixed and maps to the 4 slots in the public layout:
 *   [0] = A (top-left,    col-span-2 row-span-1, ~3:2)
 *   [1] = B (top-middle,  col-span-2 row-span-1, ~3:2)
 *   [2] = C (right, tall, col-span-2 row-span-2, ~3:4)
 *   [3] = D (bottom-left, col-span-4 row-span-1, ~16:5)
 * All 4 must be present for the section to render.
 */
export interface CmsGalleryContent extends CmsContentBase {
  title: string;
  images: CmsImage[];
  columns?: number;
}

// ─── Services Sections ──────────────────────────────────────

/** Services page-level metadata (hero + SEO) */
export interface CmsServicesMetaLocale {
  title: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CmsServicesMetaContent extends CmsContentBase {
  locales: {
    [K in Locale]: CmsServicesMetaLocale;
  };
}

/** Services Packages section: pricing packages
 * Max 3 packages, max 10 features per package (validated in the editor).
 * All text fields are per-locale.
 */
export interface CmsServicePackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface CmsServicesPackagesLocale {
  title: string;
  packages: CmsServicePackage[];
}

export interface CmsServicesPackagesContent extends CmsContentBase {
  locales: {
    [K in Locale]: CmsServicesPackagesLocale;
  };
}

/** Services "What's Included" section. Max 3 items (validated in the editor). */
export interface CmsServicesIncludedLocale {
  title: string;
  subtitle?: string;
  items: {
    icon?: string;
    title: string;
    description: string;
  }[];
}

export interface CmsServicesIncludedContent extends CmsContentBase {
  locales: {
    [K in Locale]: CmsServicesIncludedLocale;
  };
}

/** Services "Our Process" section. Step number is auto-derived from index in the editor. */
export interface CmsServicesProcessLocale {
  title: string;
  subtitle?: string;
  steps: {
    number: number;
    title: string;
    description: string;
    image?: string;
  }[];
}

export interface CmsServicesProcessContent extends CmsContentBase {
  locales: {
    [K in Locale]: CmsServicesProcessLocale;
  };
}

/** Services FAQ section */
export interface CmsServicesFaqLocale {
  title: string;
  subtitle?: string;
  items: CmsFaqItem[];
}

export interface CmsServicesFaqContent extends CmsContentBase {
  locales: {
    [K in Locale]: CmsServicesFaqLocale;
  };
}

// ─── About Sections ─────────────────────────────────────────

/** About Hero section */
export interface CmsAboutHeroContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  image?: string;
}

/** About Story section */
export interface CmsAboutStoryContent extends CmsContentBase {
  title: string;
  paragraphs: string[];
  image?: string;
}

/** About Approach section */
export interface CmsAboutApproachContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  items: {
    icon?: string;
    title: string;
    description: string;
  }[];
}

/** About Testimonials section */
export interface CmsAboutTestimonialsContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  testimonials: CmsTestimonial[];
}

// ─── Contact Sections ───────────────────────────────────────

/** Contact Info section: shared per-locale text + contact details + social links. */
export interface CmsContactInfoLocale {
  title: string;
  subtitle?: string;
  email: string;
  phone: string;
  /** Short location label (e.g. "Utah, US"). */
  location?: string;
  /** Full street address. Kept in the CMS schema but not consumed by the UI yet. */
  address?: string;
  mapUrl?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface CmsContactInfoContent extends CmsContentBase {
  locales: {
    [K in Locale]: CmsContactInfoLocale;
  };
}

/** Contact Scheduling section */
export interface CmsContactSchedulingContent extends CmsContentBase {
  title: string;
  description?: string;
  embedUrl?: string;
  ctaLabel?: string;
}

// ─── Section Registry ───────────────────────────────────────

/**
 * Maps section keys to their content types.
 * Use this for type-safe access to CMS content.
 *
 * @example
 * ```ts
 * const heroData = await getContentAction("home.hero");
 * // heroData.data is CmsHeroContent
 * ```
 */
export type CmsSectionData = {
  // Global
  "global.general": CmsGeneralContent;
  // Home
  "home.hero": CmsHeroContent;
  "home.carousel": CmsCarouselContent;
  "home.about": CmsAboutContent;
  "home.gallery": CmsGalleryContent;
  // Services
  "services.meta": CmsServicesMetaContent;
  "services.packages": CmsServicesPackagesContent;
  "services.included": CmsServicesIncludedContent;
  "services.process": CmsServicesProcessContent;
  "services.faq": CmsServicesFaqContent;
  // About
  "about.hero": CmsAboutHeroContent;
  "about.story": CmsAboutStoryContent;
  "about.approach": CmsAboutApproachContent;
  "about.testimonials": CmsAboutTestimonialsContent;
  // Contact
  "contact.info": CmsContactInfoContent;
  "contact.scheduling": CmsContactSchedulingContent;
};

/** All valid CMS section keys */
export type CmsSectionKey = keyof CmsSectionData;

/**
 * All valid CMS section strings (for runtime validation).
 */
export const CMS_SECTION_KEYS: CmsSectionKey[] = [
  "global.general",
  "home.hero",
  "home.carousel",
  "home.about",
  "home.gallery",
  "services.meta",
  "services.packages",
  "services.included",
  "services.process",
  "services.faq",
  "about.hero",
  "about.story",
  "about.approach",
  "about.testimonials",
  "contact.info",
  "contact.scheduling",
];

/**
 * Type guard to check if a string is a valid CMS section key.
 */
export function isCmsSectionKey(key: string): key is CmsSectionKey {
  return (CMS_SECTION_KEYS as string[]).includes(key);
}
