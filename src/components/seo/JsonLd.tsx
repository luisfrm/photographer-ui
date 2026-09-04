interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>;
}

/**
 * Safely renders JSON-LD structured data script for search engines.
 */
export function JsonLd({ schema }: Readonly<JsonLdProps>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Builds Photographer / LocalBusiness Schema.org structure.
 */
export function buildPhotographerSchema({
  name = "DnovaGallery",
  founder = "Darianny Salas",
  description = "Professional portrait and event photography studio based in Utah.",
  url,
  telephone,
  email,
  location = "Utah, US",
  socialLinks = [],
  imageUrl,
}: {
  name?: string;
  founder?: string;
  description?: string;
  url: string;
  telephone?: string;
  email?: string;
  location?: string;
  socialLinks?: string[];
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Photographer"],
    name,
    description,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    address: {
      "@type": "PostalAddress",
      addressRegion: "UT",
      addressCountry: "US",
      description: location,
    },
    founder: {
      "@type": "Person",
      name: founder,
      jobTitle: "Lead Photographer & Visual Artist",
    },
    priceRange: "$$",
    sameAs: socialLinks.filter(Boolean),
  };
}

/**
 * Builds FAQPage Schema.org structure for FAQ items.
 */
export function buildFaqSchema(
  items: { question: string; answer: string }[]
) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Builds BreadcrumbList Schema.org structure.
 */
export function buildBreadcrumbSchema(
  breadcrumbs: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
