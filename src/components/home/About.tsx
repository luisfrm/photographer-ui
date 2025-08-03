import { Button } from "../ui/button";
import Image from "next/image";

export default function About() {
  return <section className="py-20 bg-gray-50">
  <div className="container mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-5xl font-serif mb-6 text-black">About me</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          I&apos;m a passionate photographer based in London, specializing in premium portrait and wedding photography.
          With over 8 years of experience, I capture the essence of every moment with an artistic eye and
          professional approach.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          My work focuses on creating timeless, elegant images that tell your unique story. Every session is
          tailored to reflect your personality and style, ensuring memories that last a lifetime.
        </p>
        <Button
          variant="outline"
          size="lg"
        >
          View My Work
        </Button>
      </div>
      <div className="relative h-96 md:h-[500px]">
        <Image
          src="/about.PNG"
          alt="About Giulia"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</section>;
}
