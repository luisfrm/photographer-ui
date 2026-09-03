import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Widgets from "@/components/common/Widgets";
import { getGeneral, getGlobalContact } from "@/app/panel/actions";

const LOCALES = ["en", "es"] as const;

export const revalidate = 60;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound();
  }

  const [general, globalContact] = await Promise.all([
    getGeneral(),
    getGlobalContact(),
  ]);

  const instagramLink = globalContact.socialLinks.find(
    (s) => s.platform.toLowerCase() === "instagram"
  );

  return (
    <>
      <Header logoKey={general.logoKey} />
      {children}
      <Footer
        locale={locale as "en" | "es"}
        general={general}
        globalContact={globalContact}
      />
      <Widgets
        whatsappNumber={globalContact.phone}
        instagramUrl={instagramLink?.url}
      />
    </>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
