import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  Link2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  type LucideIcon,
} from "lucide-react";
import { getGeneral, getContactInfo } from "@/app/panel/actions";
import { getR2KeyUrl } from "@/lib/r2/url";
import type { Locale } from "@/types/cms";

type FooterProps = {
  locale: Locale;
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

function getSocialIcon(platform: string | undefined): LucideIcon {
  if (!platform) return Link2;
  return SOCIAL_ICON_MAP[platform] ?? Link2;
}

export default async function Footer({ locale }: FooterProps) {
  const [general, contact] = await Promise.all([
    getGeneral(),
    getContactInfo(),
  ]);

  const brand = general.locales[locale];
  const info = contact.locales[locale];
  const logoUrl = getR2KeyUrl(general.logoKey) || "/logo.webp";
  const year = new Date().getFullYear();
  const rightsText =
    locale === "es" ? "Todos los derechos reservados." : "All rights reserved.";

  return (
    <footer className="bg-zinc-900 text-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logoUrl}
                alt={brand.title}
                width={48}
                height={48}
                className="rounded-xl object-cover"
              />
              <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                {brand.title}
              </span>
            </div>
            {brand.slogan && (
              <p className="text-sm italic text-zinc-400 leading-relaxed max-w-xs">
                {brand.slogan}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium mb-5">
              {locale === "es" ? "Contacto" : "Contact"}
            </h3>
            <div className="space-y-3">
              {info.email && (
                <Link
                  href={`mailto:${info.email}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
                >
                  <Mail className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-sm">{info.email}</span>
                </Link>
              )}
              {info.phone && (
                <Link
                  href={`tel:${info.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
                >
                  <Phone className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-sm">{info.phone}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Follow */}
          {info.socialLinks && info.socialLinks.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium mb-5">
                {locale === "es" ? "Sígueme" : "Follow"}
              </h3>
              <div className="flex items-center gap-4">
                {info.socialLinks.map((link, index) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <Link
                      key={index}
                      href={link.url || "#"}
                      target={link.url ? "_blank" : undefined}
                      rel={link.url ? "noopener noreferrer" : undefined}
                      className="text-zinc-400 hover:text-white hover:scale-110 transition-all"
                      aria-label={link.platform || "Social link"}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 text-center sm:text-left">
            © {year} {brand.title}. {rightsText}
          </p>
          <p className="text-sm text-zinc-500 text-center sm:text-right">
            {locale === "es" ? "Desarrollado por" : "Developed by"}{" "}
            <Link
              href="https://luisrivas.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white font-medium transition-colors"
            >
              Luis Rivas
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
