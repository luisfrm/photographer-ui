"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MobileNavigation from "./MobileNavigation";
import Logo from "./Logo";
import { getContent, getLocaleFromPathname } from "@/config";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = getContent(locale);

  return (
    <header className="bg-background border-b border-border fixed w-full top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="w-full mx-auto py-4 max-w-[90vw] md:max-w-6xl lg:max-w-8xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 text-foreground hover:scale-105 transition-all"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {t.nav.map((item) => (
              <NavItem key={item.name} name={item.name} href={item.href} />
            ))}
            <Button variant="default" size="md" asChild>
              <Link href={`/${locale}/contact`}>{t.mobileNav.cta}</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <MobileNavigation
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        navItems={t.nav}
        locale={locale}
      />
    </header>
  );
}

const NavItem = ({ name, href }: { name: string; href: string }) => {
  return (
    <Link
      key={name}
      href={href}
      className="text-foreground/80 hover:text-foreground font-medium text-sm py-2 border-b-2 border-b-transparent hover:border-b-primary"
    >
      {name}
    </Link>
  );
};