import PageSection from "../common/PageSection";
import { H3 } from "../common/Titles";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { getAboutPreviewContent } from "@/app/panel/actions";
import { getR2KeyUrl } from "@/lib/r2/url";
import type { Locale } from "@/types/cms";

type AboutProps = {
  locale: Locale;
};

export default async function About({ locale }: AboutProps) {
  const about = await getAboutPreviewContent();
  const localeData = about.locales[locale];

  // Required fields — hide section if any is missing
  if (!localeData.title || !localeData.description || !about.image) {
    return null;
  }

  const hasCta = localeData.cta && localeData.ctaUrl;

  return (
    <PageSection className="bg-gray-50">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <H3>{localeData.title}</H3>
          <div
            className="text-gray-600 text-lg leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: localeData.description }}
          />
          {hasCta && (
            <Button variant="outline" size="md" asChild>
              <Link
                href={localeData.ctaUrl}
                {...(localeData.ctaNewTab
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {localeData.cta}
              </Link>
            </Button>
          )}
        </div>
        <div className="relative h-96 md:h-[500px] order-1 md:order-2">
          <Image
            src={getR2KeyUrl(about.image)}
            alt={localeData.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </PageSection>
  );
}
