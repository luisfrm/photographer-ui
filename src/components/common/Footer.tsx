"use client";

import Link from "next/link";
import { Camera, Mail, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { getContent, getLocaleFromPathname } from "@/config";

export default function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = getContent(locale);

  return (
    <footer className="bg-primary text-accent-foreground">
      <div className="w-full mx-auto px-6 sm:px-6 lg:px-0 py-12 md:max-w-6xl lg:max-w-8xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-2 text-accent-foreground"
            >
              <Camera className="h-8 w-8 text-primary" />
              <span className="font-serif text-xl font-semibold tracking-tight">
                Darianny Salas
              </span>
            </Link>
            <p className="text-accent-foreground/80 text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t.footer.contactTitle}</h3>
            <div className="space-y-3">
              <Link
                href="mailto:dchsr7@gmail.com"
                className="flex items-center space-x-3 text-accent-foreground/80 hover:text-accent-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">dchsr7@gmail.com</span>
              </Link>
              <Link
                href="tel:+13854365603"
                className="flex items-center space-x-3 text-accent-foreground/80 hover:text-accent-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+1 385 436 5603</span>
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t.footer.socialTitle}</h3>
            <Link
              href="https://www.instagram.com/dnovagallery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-accent-foreground/80 hover:text-accent-foreground transition-colors group"
            >
              <Camera className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm">Instagram</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-secondary-foreground/60 text-sm text-center sm:text-left">
            {t.footer.copyright}
          </p>
          <p className="text-secondary-foreground/60 text-sm text-center sm:text-right">
            {t.footer.developedBy}{" "}
            <Link
              href="https://rivasdigital.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-foreground hover:text-accent-foreground/80 transition-colors font-medium"
            >
              Rivas Digital
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
