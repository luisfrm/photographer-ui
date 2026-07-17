import { Button } from "@/components/ui/button";
import { H3 } from "@/components/common/Titles";
import PageSection from "../common/PageSection";
import { getContactInfo } from "@/app/panel/actions";
import type { Locale } from "@/types/cms";

type ContactProps = {
  locale: Locale;
};

export default async function Contact({ locale }: ContactProps) {
  const data = await getContactInfo();
  const info = data.locales[locale];

  return (
    <PageSection className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <H3>{info.title}</H3>
        {info.subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {info.subtitle}
          </p>
        )}
      </div>

      <div className="max-w-lg mx-auto">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors resize-none"
              placeholder="Cuéntanos sobre tu proyecto o pregunta..."
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" size="lg" variant="default" className="w-full">
              Enviar mensaje
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            También puedes contactarnos directamente:
          </p>
          <div className="mt-4 space-y-2">
            {info.email && (
              <p className="text-gray-700 dark:text-gray-300">
                📧{" "}
                <a
                  href={`mailto:${info.email}`}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  {info.email}
                </a>
              </p>
            )}
            {info.phone && (
              <p className="text-gray-700 dark:text-gray-300">📱 {info.phone}</p>
            )}
          </div>
        </div>
      </div>
    </PageSection>
  );
}
