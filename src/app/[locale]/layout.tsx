import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Widgets from "@/components/common/Widgets";

const LOCALES = ["en", "es"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <Widgets />
    </>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}