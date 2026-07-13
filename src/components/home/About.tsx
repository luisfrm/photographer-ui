"use client";

import { usePathname } from "next/navigation";
import PageSection from "../common/PageSection";
import { H3 } from "../common/Titles";
import { Button } from "../ui/button";
import Image from "next/image";
import { getContent, getLocaleFromPathname } from "@/config";

export default function About() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = getContent(locale);

  return (
    <PageSection className="bg-gray-50">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <H3>{t.about.title}</H3>
          {t.about.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-600 text-lg leading-relaxed mb-6"
            >
              {paragraph}
            </p>
          ))}
          <Button variant="outline" size="md">
            {t.about.cta}
          </Button>
        </div>
        <div className="relative h-96 md:h-[500px] order-1 md:order-2">
          <Image
            src="/photo_6.webp"
            alt="About Dari"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </PageSection>
  );
}
