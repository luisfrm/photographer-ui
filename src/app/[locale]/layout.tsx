import { notFound } from "next/navigation";

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

  return <>{children}</>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}