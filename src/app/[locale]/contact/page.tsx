import PageSection from "@/components/common/PageSection";
import { getContactInfo } from "@/app/panel/actions";
import { LOCALES, type Locale } from "@/types/cms";
import ContactInfoBlock from "@/components/contact/ContactInfoBlock";
import ContactFormWithScheduling from "@/components/contact/ContactFormWithScheduling";
import { notFound } from "next/navigation";

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
  const data = await getContactInfo();
  const info = data.locales[currentLocale];

  return (
    <PageSection>
      <section className="pt-24 pb-16">
        <div>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <ContactInfoBlock info={info} asHeading="h1" />
            <ContactFormWithScheduling locale={currentLocale} />
          </div>
        </div>
      </section>
    </PageSection>
  );
}
