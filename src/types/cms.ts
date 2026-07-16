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

/** About preview locale-specific content */
export interface CmsAboutPreviewLocale {
  title: string;
  description: string;
  cta: string;
  ctaUrl: string;
  ctaNewTab: boolean;
}

/** Home About Preview section: shared image + per-locale text content */
export interface CmsAboutPreviewContent extends CmsContentBase {
  image: string;
  locales: {
    [K in Locale]: CmsAboutPreviewLocale;
  };
}

/** Home Gallery section: photo gallery grid */
export interface CmsGalleryContent extends CmsContentBase {
  title: string;
  images: CmsImage[];
  columns?: number;
}

/** Home Contact Preview section: contact CTA on homepage */
export interface CmsContactPreviewContent extends CmsContentBase {
  title: string;
  subtitle: string;
  cta?: string;
  ctaUrl?: string;
}

// ─── Services Sections ──────────────────────────────────────

/** Services Packages section: pricing packages */
export interface CmsServicePackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface CmsServicesPackagesContent extends CmsContentBase {
  title: string;
  packages: CmsServicePackage[];
}

/** Services "What's Included" section */
export interface CmsServicesIncludedContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  items: {
    icon?: string;
    title: string;
    description: string;
  }[];
}

/** Services "Our Process" section */
export interface CmsServicesProcessContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  steps: {
    number: number;
    title: string;
    description: string;
    image?: string;
  }[];
}

/** Services FAQ section */
export interface CmsServicesFaqContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  items: CmsFaqItem[];
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

/** Contact Info section */
export interface CmsContactInfoContent extends CmsContentBase {
  title: string;
  subtitle?: string;
  email: string;
  phone: string;
  address?: string;
  mapUrl?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

/** Contact Form section: form field labels and config */
export interface CmsContactFormContent extends CmsContentBase {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  loadingLabel: string;
  successMessage: string;
  errorMessage: string;
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
  // Home
  "home.hero": CmsHeroContent;
  "home.carousel": CmsCarouselContent;
  "home.about-preview": CmsAboutPreviewContent;
  "home.gallery": CmsGalleryContent;
  "home.contact-preview": CmsContactPreviewContent;
  // Services
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
  "contact.form": CmsContactFormContent;
  "contact.scheduling": CmsContactSchedulingContent;
};

/** All valid CMS section keys */
export type CmsSectionKey = keyof CmsSectionData;

/**
 * All valid CMS section strings (for runtime validation).
 */
export const CMS_SECTION_KEYS: CmsSectionKey[] = [
  "home.hero",
  "home.carousel",
  "home.about-preview",
  "home.gallery",
  "home.contact-preview",
  "services.packages",
  "services.included",
  "services.process",
  "services.faq",
  "about.hero",
  "about.story",
  "about.approach",
  "about.testimonials",
  "contact.info",
  "contact.form",
  "contact.scheduling",
];

/**
 * Type guard to check if a string is a valid CMS section key.
 */
export function isCmsSectionKey(key: string): key is CmsSectionKey {
  return (CMS_SECTION_KEYS as string[]).includes(key);
}
