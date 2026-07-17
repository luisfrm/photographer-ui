import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getServicesMeta,
  getServicesPackages,
  getServicesIncluded,
  getServicesProcess,
  getServicesFaq,
} from "@/app/panel/actions";
import { getServicesIcon } from "@/lib/cms-icons";
import type { CmsServicePackage } from "@/types/cms";
import { PageProps } from "@/types/pages";
import type { Metadata } from "next";

// ─── Page metadata from CMS ───────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getServicesMeta();
  const localeData = meta.locales[locale as "en" | "es"];

  return {
    title: localeData?.metaTitle || localeData?.title || "Services",
    description:
      localeData?.metaDescription || localeData?.description || undefined,
  };
}

// ─── Page ──────────────────────────────────────────────────

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const [meta, packages, included, process, faq] = await Promise.all([
    getServicesMeta(),
    getServicesPackages(),
    getServicesIncluded(),
    getServicesProcess(),
    getServicesFaq(),
  ]);

  const localeKey = locale as "en" | "es";

  const metaLocale = meta.locales[localeKey];
  const packagesLocale = packages.locales[localeKey];
  const includedLocale = included.locales[localeKey];
  const processLocale = process.locales[localeKey];
  const faqLocale = faq.locales[localeKey];

  // Filter valid packages (must have at least name + price + description)
  const validPackages = packagesLocale.packages.filter(
    (p) => p.name?.trim() && p.price?.trim() && p.description?.trim()
  );

  const hasPackages = validPackages.length > 0;
  const hasIncluded = includedLocale.items.length > 0;
  const hasProcess = processLocale.steps.length > 0;
  const hasFaq = faqLocale.items.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {metaLocale && (
        <section className="pt-28 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-7xl font-serif mb-6 text-black">
                {metaLocale.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {metaLocale.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services Packages */}
      {hasPackages && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-serif text-black text-center mb-16">
              {packagesLocale.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {validPackages.map((pkg, index) => (
                <PackageCard
                  key={index}
                  pkg={pkg}
                  locale={localeKey}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's Included */}
      {hasIncluded && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-serif text-black text-center mb-4">
              {includedLocale.title}
            </h2>
            {includedLocale.subtitle && (
              <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                {includedLocale.subtitle}
              </p>
            )}

            <div className="grid md:grid-cols-3 gap-12">
              {includedLocale.items.map((item, index) => {
                const Icon = getServicesIcon(item.icon);
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {Icon ? (
                        <Icon className="w-8 h-8 text-black" />
                      ) : (
                        <CheckCircle2 className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <h3 className="text-2xl font-serif text-black mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {hasProcess && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-serif text-black text-center mb-4">
              {processLocale.title}
            </h2>
            {processLocale.subtitle && (
              <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                {processLocale.subtitle}
              </p>
            )}

            <div className="grid md:grid-cols-4 gap-8">
              {processLocale.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {hasFaq && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-serif text-black text-center mb-4">
              {faqLocale.title}
            </h2>
            {faqLocale.subtitle && (
              <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                {faqLocale.subtitle}
              </p>
            )}

            <div className="max-w-4xl mx-auto space-y-8">
              {faqLocale.items.map((item, index) => {
                const isLast = index === faqLocale.items.length - 1;
                return (
                  <div
                    key={index}
                    className={
                      isLast
                        ? "pb-6"
                        : "border-b border-gray-200 pb-6"
                    }
                  >
                    <h3 className="text-xl font-semibold text-black mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-6">
            {locale === "es"
              ? "¿Listo para reservar tu sesión?"
              : "Ready to Book Your Session?"}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {locale === "es"
              ? "Creemos algo hermoso juntos. Contáctanos para hablar de tu visión y agendar tu sesión."
              : "Let's create something beautiful together. Contact us to discuss your vision and schedule your professional photography session."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/contact`}>
                {locale === "es" ? "Contáctanos" : "Get In Touch"}
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href={`/${locale}/gallery`}>
                {locale === "es" ? "Ver Portafolio" : "View Portfolio"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Package Card ──────────────────────────────────────────

function PackageCard({
  pkg,
  locale,
}: {
  pkg: CmsServicePackage;
  locale: "en" | "es";
}) {
  return (
    <div
      className={
        pkg.popular
          ? "bg-white rounded-lg p-8 shadow-lg border-2 border-black relative"
          : "bg-white rounded-lg p-8 shadow-lg"
      }
    >
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
            {locale === "es" ? "Más Popular" : "Most Popular"}
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-serif text-black mb-2">{pkg.name}</h3>
        <div className="text-5xl font-bold text-black mb-2">{pkg.price}</div>
        <p className="text-gray-600">{pkg.description}</p>
      </div>

      {pkg.features.length > 0 && (
        <div className="space-y-4 mb-8">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
