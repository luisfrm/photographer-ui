import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/lib/seo";

const LOCALES = ["en", "es"] as const;

interface RouteConfig {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

const PUBLIC_ROUTES: RouteConfig[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  return PUBLIC_ROUTES.flatMap((route) => {
    return LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: `${baseUrl}/en${route.path}`,
          es: `${baseUrl}/es${route.path}`,
          "x-default": `${baseUrl}/en${route.path}`,
        },
      },
    }));
  });
}
