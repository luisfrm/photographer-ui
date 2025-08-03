import Contact from "@/components/home/Contact";
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import { createSupabaseServerClient, createSupabaseStaticClient } from "@/lib/supabase/server";
import { PageProps } from "@/types/pages";
import InfiniteCarousel from "@/components/home/infinite-carousel";

async function getTranslations(slug: string, locale: string): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('pages')
    .select(`
      slug,
      page_translations (
        content,
        languages (code)
      )
    `)
    .eq('slug', slug)
    .eq('page_translations.languages.code', locale)
    .single();

  return data?.page_translations?.[0]?.content || (await getTranslations(slug, 'en'));
}

export const revalidate = 60;

const pageName = 'home';

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const content = await getTranslations(pageName, locale);
  // console.log(content)

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <section className="py-16">
        <div className="w-full">
          <InfiniteCarousel />
        </div>
      </section>
      <About />
      <Services />
      <Testimonials />
      <Contact />
    </main>
  );
}

export async function generateStaticParams() {
  const supabase = await createSupabaseStaticClient();
  const { data } = await supabase.from('languages').select('code');
  return data?.map((language) => ({ locale: language.code }));
}
