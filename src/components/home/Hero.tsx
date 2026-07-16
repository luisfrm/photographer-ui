import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getHeroContent } from "@/app/panel/actions";
import { getR2KeyUrl } from "@/lib/r2/url";
import type { Locale } from "@/types/cms";

type HeroProps = {
  locale: Locale;
};

export default async function Hero({ locale }: HeroProps) {
  const hero = await getHeroContent();
  const localeContent = hero.locales[locale];

  // Resolve image URLs from R2 keys (with fallback to static placeholders)
  const img1 = getR2KeyUrl(hero.backgroundImage1) || "/photo_1.webp";
  const img2 = getR2KeyUrl(hero.backgroundImage2) || "/photo_2.webp";

  return (
    <section className="relative h-[700px] lg:h-screen">
      <section className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full flex">
          <div className="w-1/2 h-full relative">
            <Image
              src={img1}
              alt="Hero background 1"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="w-1/2 h-full relative">
            <Image
              src={img2}
              alt="Hero background 2"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>
      <section className="sm:px-6 lg:px-8 relative flex items-center justify-center h-full">
        <div className="mx-auto w-full lg:w-auto max-w-2xl text-center bg-background/70 lg:bg-background/60 p-6 lg:p-10 rounded-md">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {localeContent.title}
          </h1>
          <p
            className="mt-6 text-lg leading-8 text-foreground/80"
            dangerouslySetInnerHTML={{ __html: localeContent.subtitle }}
          />
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-2">
            <Button asChild size="lg">
              <Link
                href={localeContent.ctaUrl || `/${locale}/contact`}
                {...(localeContent.ctaNewTab
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {localeContent.cta}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}
