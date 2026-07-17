import PageSection from "@/components/common/PageSection";
import { getContactInfo } from "@/app/panel/actions";
import { LOCALES } from "@/types/cms";
import ContactInfoBlock from "./ContactInfoBlock";
import ContactFormWithScheduling from "./ContactFormWithScheduling";
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

  const data = await getContactInfo();
  const info = data.locales[locale as keyof typeof data.locales];

  return (
    <PageSection>
      <section className="pt-24 pb-16">
        <div>
          <div className="grid md:grid-cols-2 gap-16">
            <ContactInfoBlock info={info} />
            <ContactFormWithScheduling />
          </div>
        </div>
      </section>
    </PageSection>
  );
}
