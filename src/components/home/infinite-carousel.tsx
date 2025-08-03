'use client'

import Image from "next/image"

export default function InfiniteCarousel() {
  const images = [
    { src: "/about.PNG", alt: "Wedding Photography" },
    { src: "/photo1.jpg", alt: "Portrait Photography" },
    { src: "/photo2.jpg", alt: "Nature Photography" },
    { src: "/hero_photo.PNG", alt: "Fashion Photography" },
    { src: "/photo3.png", alt: "Event Photography" },
    { src: "/IMG_4389.PNG", alt: "Artistic Photography" },
  ]

  // Duplicate images for infinite effect
  const duplicatedImages = [...images, ...images]

  return (
    <div className="relative w-full h-80">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>

      {/* Carousel container */}
      <div className="relative overflow-hidden bg-transparent flex h-full w-full items-center">
        <div className="flex items-center will-change-transform animate-scroll" style={{ gap: "24px" }}>
          {duplicatedImages.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-80 h-64">
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}