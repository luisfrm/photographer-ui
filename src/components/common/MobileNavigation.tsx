'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

interface MobileNavigationProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  navItems: Array<{ name: string; href: string }>
}

export default function MobileNavigation({
  isOpen,
  onOpenChange,
  navItems,
}: MobileNavigationProps) {
  const handleItemClick = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-semibold text-foreground">
            Menú
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
            <Button asChild className="w-full py-3 text-base font-medium">
              <Link href="/contacto" onClick={handleItemClick}>
                Reserva Ahora
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-auto pt-8 border-t border-border/50">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>¿Necesitas ayuda?</p>
              <p className="font-medium text-foreground">
                contacto@rivasdigital.com
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 