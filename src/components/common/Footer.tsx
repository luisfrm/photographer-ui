import Link from "next/link";
import Image from "next/image";
import {
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
import { getGeneral, getGlobalContact } from "@/app/panel/actions";
import { getR2KeyUrl } from "@/lib/r2/url";
import type {
  Locale,
  CmsGeneralContent,
  CmsGlobalContactContent,
} from "@/types/cms";

type FooterProps = {
  locale: Locale;
  general?: CmsGeneralContent;
  globalContact?: CmsGlobalContactContent;
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

export default async function Footer({
  locale,
  general: propGeneral,
  globalContact: propContact,
}: FooterProps) {
  const [general, contact] = await Promise.all([
    propGeneral ? Promise.resolve(propGeneral) : getGeneral(),
    propContact ? Promise.resolve(propContact) : getGlobalContact(),
  ]);

  const brand = general.locales[locale];
  const logoUrl = getR2KeyUrl(general.logoKey) || "/logo.webp";
  const year = new Date().getFullYear();
  const rightsText =
    locale === "es" ? "Todos los derechos reservados." : "All rights reserved.";

  return (
    <footer className="bg-zinc-900 text-zinc-100 border-t border-primary/15">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white rounded-full p-1 shrink-0">
                  <Image
                    src={logoUrl}
                    alt={brand.title}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>
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

            {contact.socialLinks && contact.socialLinks.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-3">
                  {locale === "es" ? "Sígueme" : "Follow"}
                </h4>
                <div className="flex items-center gap-3">
                  {contact.socialLinks.map((link, index) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <Link
                        key={index}
                        href={link.url || "#"}
                        target={link.url ? "_blank" : undefined}
                        rel={link.url ? "noopener noreferrer" : undefined}
                        className="p-2.5 rounded-xl bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all shadow-2xs"
                        aria-label={link.platform || "Social link"}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Explore / Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-5">
              {locale === "es" ? "Explorar" : "Explore"}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  {locale === "es" ? "Inicio" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  {locale === "es" ? "Servicios" : "Services"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  {locale === "es" ? "Contacto & Citas" : "Contact & Bookings"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-5">
              {locale === "es" ? "Legal" : "Legal"}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  {locale === "es" ? "Política de Privacidad" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms-and-conditions`}
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  {locale === "es" ? "Términos y Condiciones" : "Terms & Conditions"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-5">
              {locale === "es" ? "Contacto" : "Contact"}
            </h3>
            <div className="space-y-3">
              {contact.email && (
                <Link
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-primary transition-colors group"
                >
                  <Mail className="h-4 w-4 text-primary transition-colors shrink-0" />
                  <span className="text-sm truncate">{contact.email}</span>
                </Link>
              )}
              {contact.phone && (
                <Link
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-primary transition-colors group"
                >
                  <Phone className="h-4 w-4 text-primary transition-colors shrink-0" />
                  <span className="text-sm">{contact.phone}</span>
                </Link>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 text-zinc-400">
                  <MapPin className="h-4 w-4 text-primary transition-colors shrink-0" />
                  <span className="text-sm">{contact.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider & Bottom Bar */}
        <div className="border-t border-primary/15 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-zinc-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <p>
              © {year} <span className="text-primary font-medium">{brand.title}</span>. {rightsText}
            </p>
            <span className="hidden sm:inline text-zinc-600">·</span>
            <Link
              href={`/${locale}/privacy-policy`}
              className="hover:text-primary transition-colors"
            >
              {locale === "es" ? "Privacidad" : "Privacy"}
            </Link>
            <span className="hidden sm:inline text-zinc-600">·</span>
            <Link
              href={`/${locale}/terms-and-conditions`}
              className="hover:text-primary transition-colors"
            >
              {locale === "es" ? "Términos" : "Terms"}
            </Link>
          </div>

          <p className="text-center md:text-right">
            {locale === "es" ? "Desarrollado por" : "Developed by"}{" "}
            <Link
              href="https://luisrivas.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-colors"
            >
              Luis Rivas
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
