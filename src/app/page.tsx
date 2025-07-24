import Contact from "@/components/Contact";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";

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
