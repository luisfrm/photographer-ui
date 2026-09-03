import type { Metadata } from "next";
import { getGeneral, getContactInfo } from "@/app/panel/actions";
import { TERMS_AND_CONDITIONS_DATA } from "@/config/legal/terms-and-conditions";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { PageProps } from "@/types/pages";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "es" ? "es" : "en") as "en" | "es";
  const data = TERMS_AND_CONDITIONS_DATA[validLocale];

  return {
    title: data.meta.title,
    description: data.meta.description,
  };
}

export default async function TermsAndConditionsPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = (locale === "es" ? "es" : "en") as "en" | "es";

  const [general, contactInfo] = await Promise.all([
    getGeneral(),
    getContactInfo(),
  ]);

  const brand = general.locales[validLocale] || general.locales.en;
  const info = contactInfo.locales[validLocale] || contactInfo.locales.en;
  const data = TERMS_AND_CONDITIONS_DATA[validLocale];

  return (
    <LegalPageLayout
      data={data}
      locale={validLocale}
      studioInfo={{
        brandName: brand.title || "DnovaGallery",
        email: info.email,
        phone: info.phone,
        location: info.location,
      }}
    />
  );
}
