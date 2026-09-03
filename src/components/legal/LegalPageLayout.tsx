import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, Phone, MapPin, Sparkles, Clock } from "lucide-react";
import HeadlineUnderline from "@/components/common/Headline";
import { Button } from "@/components/ui/button";
import type { LegalDocumentContent } from "@/config/legal/privacy-policy";

interface LegalPageLayoutProps {
  data: LegalDocumentContent;
  locale: "en" | "es";
  studioInfo: {
    brandName: string;
    email?: string;
    phone?: string;
    location?: string;
  };
}

export default function LegalPageLayout({
  data,
  locale,
  studioInfo,
}: Readonly<LegalPageLayoutProps>) {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50/60 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Back link */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{locale === "es" ? "Volver al inicio" : "Back to home"}</span>
          </Link>

          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              {data.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-3">
            {data.title}
          </h1>

          {/* Headline Underline */}
          <HeadlineUnderline width={48} height={3} className="my-4" />

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-6">
            {data.subtitle}
          </p>

          {/* Last updated indicator */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-medium">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              {locale === "es" ? "Última actualización:" : "Last updated:"}{" "}
              <strong className="text-gray-600 font-semibold">{data.lastUpdated}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="container mx-auto px-6 max-w-5xl py-16">
        {/* Key Takeaways / At a Glance Card */}
        <div className="mb-16 rounded-3xl bg-linear-to-br from-primary/10 via-white to-primary/5 border border-primary/25 p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs">
              ★
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {data.summary.title}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-8 max-w-2xl">
            {data.summary.subtitle}
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {data.summary.points.map((point, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-primary/15 shadow-2xs flex flex-col justify-start"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {point.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Layout: Quick Navigation + Sections */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Quick Navigation Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-gray-50/70 rounded-2xl p-6 border border-gray-200/80">
            <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-gray-400 mb-4">
              {data.tableOfContentsTitle}
            </h3>
            <nav className="space-y-2 text-sm">
              {data.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-gray-600 hover:text-primary transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-primary text-xs leading-snug line-clamp-1"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Detailed Legal Sections */}
          <main className="lg:col-span-8 space-y-14">
            {data.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-b border-primary/10 pb-12 last:border-b-0"
              >
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>

                <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                  {section.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="mt-8 space-y-6 pt-4 border-t border-gray-100">
                    {section.subsections.map((sub, idx) => (
                      <div key={idx} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {sub.title}
                        </h3>
                        {sub.paragraphs.map((subP, subIdx) => (
                          <p key={subIdx} className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            {subP}
                          </p>
                        ))}
                        {sub.bullets && (
                          <ul className="space-y-2">
                            {sub.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Studio Contact Card */}
            <div className="mt-12 rounded-3xl bg-gray-50 border border-gray-200 p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-3 max-w-lg">
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  {data.contactBox.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.contactBox.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-600 pt-2">
                  {studioInfo.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{studioInfo.email}</span>
                    </div>
                  )}
                  {studioInfo.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{studioInfo.phone}</span>
                    </div>
                  )}
                  {studioInfo.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{studioInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl py-6 px-8 text-base shadow-xs shrink-0"
              >
                <Link href={`/${locale}/contact`}>{data.contactBox.buttonText}</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
