import Image from "next/image";
import PageSection from "../common/PageSection";
import { getGalleryContent } from "@/app/panel/actions";
import { getR2KeyUrl } from "@/lib/r2/url";

export default async function Gallery() {
  const gallery = await getGalleryContent();

  // All 4 slots must be present and have a valid src to render
  if (
    !gallery.title ||
    gallery.images.length < 4 ||
    !gallery.images.slice(0, 4).every((img) => img && img.src)
  ) {
    return null;
  }

  const [a, b, c, d] = gallery.images;

  return (
    <PageSection className="bg-gray-100">
      <h2 className="text-6xl font-serif text-black mb-12">{gallery.title}</h2>

      <div className="grid grid-cols-6 grid-rows-2 gap-4 h-[600px]">
        {/* A — top-left */}
        <div className="col-span-2 row-span-1 relative overflow-hidden rounded-lg group">
          <Image
            src={getR2KeyUrl(a.src)}
            alt={a.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* B — top-middle */}
        <div className="col-span-2 row-span-1 relative overflow-hidden rounded-lg group">
          <Image
            src={getR2KeyUrl(b.src)}
            alt={b.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* C — right, tall */}
        <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg group">
          <Image
            src={getR2KeyUrl(c.src)}
            alt={c.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* D — bottom-left, wide */}
        <div className="col-span-4 row-span-1 relative overflow-hidden rounded-lg group">
          <Image
            src={getR2KeyUrl(d.src)}
            alt={d.alt}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover object-center hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Empty bottom-middle cell — preserved from original layout */}
        <div className="col-span-2 row-span-1" />
      </div>
    </PageSection>
  );
}
