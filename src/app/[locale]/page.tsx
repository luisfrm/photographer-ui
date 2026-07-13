import Contact from "@/components/home/Contact";
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import { PageProps } from "@/types/pages";
import InfiniteCarousel from "@/components/home/infinite-carousel";
import Gallery from "@/components/home/Gallery";
import Pricing from "@/components/home/Pricing";

export const revalidate = 60;

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <InfiniteCarousel />
      <About />
      <Gallery />
      <Pricing />
      <Contact />
    </main>
  );
}
