import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { getServicesPackages } from "@/app/panel/actions";
import type { CmsServicePackage, Locale } from "@/types/cms";

type PricingProps = {
  locale: Locale;
};

export default async function Pricing({ locale }: PricingProps) {
  const data = await getServicesPackages();
  const localeData = data.locales[locale];

  // Only render if at least one valid package exists in this locale
  const packages = localeData.packages.filter(
    (p) => p.name?.trim() && p.price?.trim() && p.description?.trim()
  );
  if (packages.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="w-full md:max-w-6xl lg:max-w-7xl mx-auto px-6 sm:px-6 lg:px-0">
        <h2 className="text-6xl font-serif text-black mb-12">{localeData.title}</h2>

        <div className="grid md:grid-cols-3 gap-8 border-t border-gray-300">
          {packages.map((pkg, index) => (
            <PackageColumn
              key={index}
              pkg={pkg}
              isLast={index === packages.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Package Column ────────────────────────────────────────

function PackageColumn({
  pkg,
  isLast,
}: {
  pkg: CmsServicePackage;
  isLast: boolean;
}) {
  const placeholderText = encodeURIComponent(
    `${pkg.name} Photography`
  );

  return (
    <div
      className={
        isLast
          ? "md:pt-8"
          : "md:border-r md:pr-8 pt-8 border-gray-300"
      }
    >
      <h3 className="text-2xl font-serif mb-4 text-black">{pkg.name}</h3>

      {pkg.popular && (
        <span className="inline-block mb-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <div className="text-3xl font-bold text-black mb-2">{pkg.price}</div>
        <div className="text-lg text-gray-600 mb-4">{pkg.description}</div>
      </div>

      {pkg.features.length > 0 && (
        <ul className="space-y-3 mb-8 text-gray-600">
          {pkg.features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      )}

      <div className="mb-8">
        <div className="relative h-64 mb-6">
          <Image
            src={`/placeholder.svg?height=256&width=400&text=${placeholderText}`}
            alt={`${pkg.name} Photography Package`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <Button variant="outline" asChild>
        <Link href="#contact">Get In Touch</Link>
      </Button>
    </div>
  );
}
