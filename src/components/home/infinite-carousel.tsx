'use client'

import Image from "next/image"

export default function InfiniteCarousel() {
  const images = [
    { src: "/photo_1.webp", alt: "Wedding Photography" },
    { src: "/photo_2.webp", alt: "Portrait Photography" },
    { src: "/photo_3.webp", alt: "Nature Photography" },
    { src: "/photo_4.webp", alt: "Fashion Photography" },
    { src: "/photo_5.webp", alt: "Event Photography" },
    { src: "/photo_6.webp", alt: "Artistic Photography" },
  ]

  const duplicatedImages = [...images, ...images]

  return (
    <div className="relative w-full h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>

      <div className="relative overflow-hidden bg-transparent flex h-full w-full items-center">
        <div className="flex items-center will-change-transform animate-scroll" style={{ gap: "24px" }}>
          {duplicatedImages.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-80 h-64">
              <div className="relative w-full h-full overflow-hidden rounded-lg hover:scale-105 transition-all duration-500">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}