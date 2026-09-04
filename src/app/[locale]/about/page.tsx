import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageSection from "@/components/common/PageSection";
import { H2, H4 } from "@/components/common/Titles";
import type { Metadata } from "next";
import { constructMetadata, SEO_COPY, getBaseUrl } from "@/lib/seo";
import { JsonLd, buildBreadcrumbSchema } from "@/components/seo/JsonLd";
import { PageProps } from "@/types/pages";
import type { Locale } from "@/types/cms";

// ─── Metadata ──────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "es" ? "es" : "en") as Locale;
  const defaultCopy = SEO_COPY.about[currentLocale];

  return constructMetadata({
    title: defaultCopy.title,
    description: defaultCopy.description,
    path: "/about",
    locale: currentLocale,
    keywords: [...defaultCopy.keywords],
  });
}

// ─── Localized Copy ────────────────────────────────────────

const ABOUT_COPY = {
  en: {
    badge: "ABOUT ME",
    firstName: "Darianny",
    lastName: "Salas",
    tagline: "Photography is the art of pausing time and celebrating life.",
    cta: "Get In Touch",
    storyTitle: "My Story",
    storyParagraph1:
      "Hi, I'm Darianny Salas, lead photographer and founder of DnovaGallery in Utah. With over a decade of dedication to portrait, lifestyle, and event photography, my passion is telling honest, compelling stories through the lens. I specialize in capturing the real emotion and spontaneous beauty that makes your journey unique.",
    storyParagraph2:
      "My creative journey has deepened my eye for natural light, composition, and emotional resonance. I believe that an exceptional photoshoot is not about stiff posing, but about creating an environment where you feel completely comfortable, seen, and celebrated.",
    storyParagraph3:
      "When I am not shooting sessions, you will find me scouting scenic landscapes across Utah, curating moodboards for upcoming projects, and enjoying quality time with family. I believe in the lasting power of photography to preserve your most meaningful memories forever.",
    approachTitle: "My Approach",
    steps: [
      {
        number: "01",
        title: "Vision & Consultation",
        description:
          "We connect to discuss your ideas, preferred aesthetic, and desired outcome. We select the ideal location, moodboard, and wardrobe styling to bring your vision to life.",
      },
      {
        number: "02",
        title: "Preparation & Detail",
        description:
          "Every detail is aligned before shoot day. I coordinate shot lists, lighting plans, and timing to ensure a seamless, relaxed experience for you.",
      },
      {
        number: "03",
        title: "The Shoot Experience",
        description:
          "On shoot day, I provide gentle, natural direction so you never have to guess how to pose. We capture genuine laughter, candid interactions, and stunning portraits.",
      },
      {
        number: "04",
        title: "Artistic Delivery",
        description:
          "Each selected photograph receives magazine-quality editing and color grading. You receive a private, high-resolution online gallery ready for downloading and printing.",
      },
    ],
    testimonial:
      "Working with Darianny was such an effortless, uplifting experience! She made us feel so confident and comfortable, and our gallery exceeded every expectation.",
    readyTitle: "Ready to Work Together?",
    readySubtitle:
      "Let's create something beautiful together. I'd love to hear about your vision and bring it to life.",
  },
  es: {
    badge: "SOBRE MÍ",
    firstName: "Darianny",
    lastName: "Salas",
    tagline: "La fotografía es el arte de pausar el tiempo y celebrar la vida.",
    cta: "Contáctanos",
    storyTitle: "Mi Historia",
    storyParagraph1:
      "Hola, soy Darianny Salas, fotógrafa y fundadora de DnovaGallery en Utah. Con más de una década dedicada a la fotografía de retratos, eventos y estilo de vida, mi pasión es contar historias genuinas y emotivas a través del lente. Me especializo en capturar la emoción real y la belleza espontánea que te hace único.",
    storyParagraph2:
      "Mi trayectoria creativa ha enriquecido mi visión de la luz natural, la composición y la conexión humana. Creo firmemente que una gran sesión no se trata de poses rígidas, sino de crear un espacio donde te sientas seguro, relajado y feliz de ser tú mismo.",
    storyParagraph3:
      "Cuando no estoy detrás de la cámara, disfruto explorar locaciones naturales en Utah, diseñar conceptos creativos y compartir momentos con mi familia. Creo en el poder transformador de la fotografía para inmortalizar tus recuerdos más preciados.",
    approachTitle: "Mi Enfoque",
    steps: [
      {
        number: "01",
        title: "Visión y Consulta",
        description:
          "Conversamos para entender tu idea, el estilo visual que buscas y lo que deseas transmitir. Elegimos juntos la locación, paleta de colores y vestuario ideal.",
      },
      {
        number: "02",
        title: "Preparación y Detalle",
        description:
          "Coordinamos cada detalle antes del día de fotos: horarios de mejor iluminación, lista de tomas y cronograma para que tu experiencia sea fluida y libre de estrés.",
      },
      {
        number: "03",
        title: "El Día de la Sesión",
        description:
          "Durante la sesión te guiaré con naturalidad para que nunca te sientas incómodo ante el lente. Capturamos risas auténticas, gestos espontáneos y retratos memorables.",
      },
      {
        number: "04",
        title: "Edición y Entrega",
        description:
          "Cada imagen seleccionada pasa por un cuidadoso proceso de revelado digital y colorimetría editorial. Recibirás una galería privada en alta resolución lista para compartir e imprimir.",
      },
    ],
    testimonial:
      "¡Trabajar con Darianny fue una experiencia increíble y súper natural! Nos hizo sentir en total confianza y las fotos superaron todas nuestras expectativas.",
    readyTitle: "¿Listos para crear juntos?",
    readySubtitle:
      "Hagamos realidad tu sesión soñada. Me encantaría conocer tus ideas y transformar tus mejores instantes en recuerdos eternos.",
  },
} as const;

// ─── Component ─────────────────────────────────────────────

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale === "es" ? "es" : "en") as Locale;
  const copy = ABOUT_COPY[currentLocale];
  const baseUrl = getBaseUrl();

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: currentLocale === "es" ? "Inicio" : "Home", url: `${baseUrl}/${currentLocale}` },
    { name: currentLocale === "es" ? "Sobre Mí" : "About", url: `${baseUrl}/${currentLocale}/about` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbsSchema} />
      <PageSection className="lg:pb-0">
        {/* Hero Section */}
        <section className="bg-white">
          <div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div>
                <p className="text-gray-600 text-sm uppercase tracking-wider mb-4">
                  {copy.badge}
                </p>
                <h1 className="text-6xl md:text-7xl font-serif text-black mb-4">
                  {copy.firstName}
                </h1>
                <h1 className="text-6xl md:text-7xl font-serif text-black mb-8">
                  {copy.lastName}
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {copy.tagline}
                </p>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/${currentLocale}/contact`}>{copy.cta}</Link>
                </Button>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="relative h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden border-8 border-white shadow-lg">
                  <Image
                    src="/photo_1.webp"
                    alt="Darianny Salas - Lead Photographer at DnovaGallery"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Story Section */}
        <section className="py-20 bg-gray-50">
          <div>
            <H2>{copy.storyTitle}</H2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {/* Story Part 1 */}
              <div className="md:col-span-2">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {copy.storyParagraph1}
                </p>
              </div>

              {/* Image 1 */}
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src="/photo_2.webp"
                  alt="Portrait Photography by Darianny Salas"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Image 2 */}
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src="/photo_3.webp"
                  alt="Lifestyle Photography in Utah"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Image 3 */}
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src="/photo_4.webp"
                  alt="Editorial Portrait Photography"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Story Part 2 */}
              <div className="md:col-span-2">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {copy.storyParagraph2}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {copy.storyParagraph3}
                </p>
              </div>

              {/* Image 4 */}
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src="/photo_5.webp"
                  alt="Natural Moments Captured"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* My Approach Section */}
        <section className="py-20 bg-white">
          <div>
            <H2>{copy.approachTitle}</H2>

            <div className="grid md:grid-cols-3 gap-16">
              {/* Process Steps */}
              <div className="md:col-span-2">
                <div className="space-y-12">
                  {copy.steps.map((step, index) => (
                    <div key={index}>
                      <H4>{step.number}</H4>
                      <h3 className="text-xl font-semibold text-black mt-1 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approach Image */}
              <div className="relative">
                <div className="relative h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden border-8 border-white shadow-lg">
                  <Image
                    src="/photo_6.webp"
                    alt="Photography Process and Artistry"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageSection>

      <footer>
        {/* Testimonial Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="border border-gray-300 rounded-lg p-12 bg-white relative">
              <div className="absolute top-8 left-8">
                <Quote className="w-8 h-8 text-gray-400 transform scale-x-[-1]" />
              </div>
              <div className="absolute bottom-8 right-8">
                <Quote className="w-8 h-8 text-gray-400" />
              </div>

              <div className="text-center">
                <p className="text-2xl text-black font-light leading-relaxed">
                  {copy.testimonial}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-serif mb-6">{copy.readyTitle}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {copy.readySubtitle}
            </p>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
              <Link href={`/${currentLocale}/contact`}>{copy.cta}</Link>
            </Button>
          </div>
        </section>
      </footer>
    </>
  );
}
