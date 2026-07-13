"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getContent, type Locale } from "@/config";

interface MobileNavigationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: Array<{ name: string; href: string }>;
  locale: Locale;
}

export default function MobileNavigation({
  isOpen,
  onOpenChange,
  navItems,
  locale,
}: MobileNavigationProps) {
  const t = getContent(locale);

  const handleItemClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-semibold text-foreground">
            {t.mobileNav.menuTitle}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-6 mt-8 px-4">
          {/* Navigation Items */}
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 py-2 border-b border-border/50 hover:border-primary/50"
                onClick={handleItemClick}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Call to Action Button */}
          <div className="pt-4">
            <Button asChild size="lg" className="w-full">
              <Link href={`/${locale}/contact`} onClick={handleItemClick}>
                {t.mobileNav.cta}
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-auto pt-8 border-t border-border/50">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>{t.mobileNav.helpText}</p>
              <p className="font-medium text-foreground">
                {t.mobileNav.helpEmail}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}