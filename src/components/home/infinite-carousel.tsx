import Image from "next/image";
import { getCarouselContent } from "@/app/panel/actions";
import { getR2KeyUrl } from "@/lib/r2/url";

const FALLBACK_IMAGES = [
  { src: "/photo_1.webp", alt: "Wedding Photography" },
  { src: "/photo_2.webp", alt: "Portrait Photography" },
  { src: "/photo_3.webp", alt: "Nature Photography" },
  { src: "/photo_4.webp", alt: "Fashion Photography" },
  { src: "/photo_5.webp", alt: "Event Photography" },
  { src: "/photo_6.webp", alt: "Artistic Photography" },
];

export default async function InfiniteCarousel() {
  const carousel = await getCarouselContent();

  // Use CMS images if available, otherwise fallback to static placeholders
  const rawImages =
    carousel.images.length > 0
      ? carousel.images.map((img: { src: string; alt: string }) => ({
          src: getR2KeyUrl(img.src) || "/photo_1.webp",
          alt: img.alt,
        }))
      : FALLBACK_IMAGES;

  // Duplicate for seamless infinite scroll
  const images = [...rawImages, ...rawImages];

  return (
    <div className="relative w-full h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />

      <div className="relative overflow-hidden bg-transparent flex h-full w-full items-center">
        <div
          className="flex items-center will-change-transform animate-scroll"
          style={{ gap: "24px" }}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-80 h-64">
              <div className="relative w-full h-full overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}