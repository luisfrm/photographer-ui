import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Link2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  type LucideIcon,
} from "lucide-react";
import type { CmsContactInfoLocale } from "@/types/cms";

type ContactInfoBlockProps = {
  info: CmsContactInfoLocale;
};

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Twitter,
  X: Twitter,
  Youtube,
  YouTube: Youtube,
  Linkedin,
  LinkedIn: Linkedin,
  GitHub: Github,
  Github,
};

/**
 * Map a platform string (stored in the CMS as free-form text) to a lucide icon.
 * Returns `Link2` as a generic fallback so unknown platforms still render.
 */
function getSocialIcon(platform: string | undefined): LucideIcon {
  if (!platform) return Link2;
  return SOCIAL_ICON_MAP[platform] ?? Link2;
}

export default function ContactInfoBlock({ info }: ContactInfoBlockProps) {
  return (
    <div>
      <h1 className="text-6xl font-serif mb-8 text-black">{info.title}</h1>

      {info.subtitle && (
        <p className="text-gray-600 text-lg mb-8">{info.subtitle}</p>
      )}

      <div className="space-y-6">
        {info.email && (
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-4 text-black" />
            <a
              href={`mailto:${info.email}`}
              className="text-gray-600 hover:text-black transition-colors"
            >
              {info.email}
            </a>
          </div>
        )}
        {info.phone && (
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-4 text-black" />
            <a
              href={`tel:${info.phone.replace(/\s/g, "")}`}
              className="text-gray-600 hover:text-black transition-colors"
            >
              {info.phone}
            </a>
          </div>
        )}
        {info.location && (
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-4 text-black" />
            <span className="text-gray-600">{info.location}</span>
          </div>
        )}
      </div>

      {info.socialLinks && info.socialLinks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-black">Follow Me</h3>
          <div className="flex space-x-4">
            {info.socialLinks.map((link, index) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <Link
                  key={index}
                  href={link.url || "#"}
                  target={link.url ? "_blank" : undefined}
                  rel={link.url ? "noopener noreferrer" : undefined}
                  className="text-primary hover:scale-110 transition-all"
                  aria-label={link.platform || "Social link"}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
