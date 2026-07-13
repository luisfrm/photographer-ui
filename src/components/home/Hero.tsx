"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getContent, getLocaleFromPathname } from "@/config";

export default function Hero() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = getContent(locale);

  return (
    <section className="relative h-[700px] lg:h-screen">
      <section className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full flex">
          <div className="w-1/2 h-full relative">
            <Image
              src="/photo_1.webp"
              alt="Hero background 1"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="w-1/2 h-full relative">
            <Image
              src="/photo_2.webp"
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
            {t.hero.title}
          </h1>
          <p
            className="mt-6 text-lg leading-8 text-foreground/80"
            dangerouslySetInnerHTML={{ __html: t.hero.subtitle }}
          />
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-2">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{t.hero.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}
