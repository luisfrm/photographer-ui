import Contact from "@/components/home/Contact";
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import { PageProps } from "@/types/pages";
import InfiniteCarousel from "@/components/home/infinite-carousel";
import Gallery from "@/components/home/Gallery";
import Pricing from "@/components/home/Pricing";

import type { Metadata } from "next";
import { constructMetadata, SEO_COPY } from "@/lib/seo";
import { getHeroContent } from "@/app/panel/actions";
import type { Locale } from "@/types/cms";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "es" ? "es" : "en") as Locale;
  const hero = await getHeroContent();
  const heroLocale = hero.locales[currentLocale];
  const defaultCopy = SEO_COPY.home[currentLocale];

  const title = defaultCopy.title;
  // Use subtitle stripped of HTML if concise, or the copywriting description
  const cleanSubtitle = heroLocale?.subtitle?.replace(/<[^>]*>/g, "").trim();
  const description =
    cleanSubtitle && cleanSubtitle.length >= 70 && cleanSubtitle.length <= 165
      ? cleanSubtitle
      : defaultCopy.description;

  return constructMetadata({
    title,
    description,
    path: "",
    locale: currentLocale,
    keywords: [...defaultCopy.keywords],
  });
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-col min-h-screen">
      <Hero locale={locale as "en" | "es"} />
      <InfiniteCarousel />
      <About locale={locale as "en" | "es"} />
      <Gallery />
      <Pricing locale={locale as "en" | "es"} />
      <Contact locale={locale as "en" | "es"} />
    </main>
  );
}
