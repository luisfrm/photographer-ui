import Contact from "@/components/home/Contact";
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import { createSupabaseStaticClient } from "@/lib/supabase/server";
import { PageProps } from "@/types/pages";
import InfiniteCarousel from "@/components/home/infinite-carousel";
import Gallery from "@/components/home/Gallery";

export const revalidate = 60;

// const pageName = 'home';

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  console.log(locale);

  // const photographerResponse = await getPhotographer();
  // const photographer = await photographerResponse.json();

  // console.log(photographer);

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <InfiniteCarousel />
      <About />
      <Gallery />
      <Services />
      <Contact />
    </main>
  );
}

export async function generateStaticParams() {
  const supabase = await createSupabaseStaticClient();
  const { data } = await supabase.from('languages').select('code');
  
  if (!data || data.length === 0) {
    return [
      { locale: 'en' },
      { locale: 'es' }
    ];
  }
  
  return data.map((language) => ({ locale: language.code }));
}
