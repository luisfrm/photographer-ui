import Contact from "@/components/home/Contact";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Gallery />
      <Services />
      <Testimonials />
      <Contact />
      
    </main>
  );
}
