import { describe, expect, it } from "vitest";
import { getBaseUrl, constructMetadata, SEO_COPY } from "@/lib/seo";

describe("getBaseUrl", () => {
  it("returns base URL without trailing slash", () => {
    const url = getBaseUrl();
    expect(url).toBeDefined();
    expect(url.endsWith("/")).toBe(false);
  });
});

describe("constructMetadata", () => {
  it("generates correct canonical and hreflang alternates for English", () => {
    const metadata = constructMetadata({
      title: "Test Title",
      description: "Test Description",
      path: "/services",
      locale: "en",
    });

    expect(metadata.title).toBe("Test Title");
    expect(metadata.description).toBe("Test Description");

    const alternates = metadata.alternates as {
      canonical: string;
      languages: Record<string, string>;
    };

    expect(alternates.canonical).toContain("/en/services");
    expect(alternates.languages.en).toContain("/en/services");
    expect(alternates.languages.es).toContain("/es/services");
    expect(alternates.languages["x-default"]).toContain("/en/services");
  });

  it("generates correct canonical and hreflang alternates for Spanish", () => {
    const metadata = constructMetadata({
      title: "Título de Prueba",
      description: "Descripción de Prueba",
      path: "/contact",
      locale: "es",
    });

    const alternates = metadata.alternates as {
      canonical: string;
      languages: Record<string, string>;
    };

    expect(alternates.canonical).toContain("/es/contact");
    expect(alternates.languages.en).toContain("/en/contact");
    expect(alternates.languages.es).toContain("/es/contact");
    expect(alternates.languages["x-default"]).toContain("/en/contact");
  });

  it("normalizes root path cleanly", () => {
    const metadata = constructMetadata({
      title: "Home",
      description: "Home Description",
      path: "",
      locale: "en",
    });

    const alternates = metadata.alternates as {
      canonical: string;
      languages: Record<string, string>;
    };

    expect(alternates.canonical).toMatch(/\/en$/);
    expect(alternates.languages.en).toMatch(/\/en$/);
    expect(alternates.languages.es).toMatch(/\/es$/);
    expect(alternates.languages["x-default"]).toMatch(/\/en$/);
  });

  it("configures OpenGraph and Twitter card metadata", () => {
    const metadata = constructMetadata({
      title: "Test Title",
      description: "Test Description",
      path: "/about",
      locale: "en",
    });

    expect(metadata.openGraph?.title).toBe("Test Title");
    expect(metadata.openGraph?.siteName).toBe("DnovaGallery");
    expect(metadata.openGraph?.type).toBe("website");
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("handles noIndex flag when requested", () => {
    const metadata = constructMetadata({
      title: "Private Page",
      description: "Private Description",
      path: "/private",
      locale: "en",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});

describe("SEO_COPY", () => {
  it("provides non-empty titles and descriptions for all supported pages and locales", () => {
    const pages = ["home", "services", "about", "contact"] as const;
    const locales = ["en", "es"] as const;

    for (const page of pages) {
      for (const locale of locales) {
        const copy = SEO_COPY[page][locale];
        expect(copy.title).toBeDefined();
        expect(copy.title.length).toBeGreaterThan(15);
        expect(copy.description).toBeDefined();
        expect(copy.description.length).toBeGreaterThan(50);
        expect(copy.keywords.length).toBeGreaterThan(0);
      }
    }
  });
});
