import PageSection from "@/components/common/PageSection";
import { getContactInfo, getGlobalContact } from "@/app/panel/actions";
import { LOCALES, type Locale } from "@/types/cms";
import ContactInfoBlock from "@/components/contact/ContactInfoBlock";
import ContactFormWithScheduling from "@/components/contact/ContactFormWithScheduling";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { constructMetadata, SEO_COPY, getBaseUrl } from "@/lib/seo";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import { PageProps } from "@/types/pages";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "es" ? "es" : "en") as Locale;
  const defaultCopy = SEO_COPY.contact[currentLocale];

  return constructMetadata({
    title: defaultCopy.title,
    description: defaultCopy.description,
    path: "/contact",
    locale: currentLocale,
    keywords: [...defaultCopy.keywords],
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const [data, globalContact] = await Promise.all([
    getContactInfo(),
    getGlobalContact(),
  ]);
  const info = data.locales[currentLocale];
  const baseUrl = getBaseUrl();

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: currentLocale === "es" ? "Inicio" : "Home", url: `${baseUrl}/${currentLocale}` },
    { name: currentLocale === "es" ? "Contacto" : "Contact", url: `${baseUrl}/${currentLocale}/contact` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbsSchema} />
      <PageSection>
      <section className="pt-24 pb-16">
        <div>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <ContactInfoBlock
              info={info}
              globalContact={globalContact}
              asHeading="h1"
            />
            <ContactFormWithScheduling locale={currentLocale} />
          </div>
        </div>
      </section>
      </PageSection>
    </>
  );
}
