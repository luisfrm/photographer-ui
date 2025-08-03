'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import MobileNavigation from './MobileNavigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Servicios', href: '/servicios' },
    { name: 'Paquetes', href: '/precios' },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <header className="bg-background/95 border-b border-border fixed w-full top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-foreground hover:scale-105 transition-all"
          >
            <Image
              src="/logo.webp"
              alt="Logo"
              width={70}
              height={70}
              className='rounded-2xl opacity-70'
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  text-foreground/80 hover:text-foreground font-medium text-sm
                  py-2 border-b-2 border-b-transparent hover:border-b-primary transition-all duration-300
                  hover:scale-105
                "
              >
                {item.name}
              </Link>
            ))}
            <Button variant="default" size="lg" asChild>
              <Link href="/contacto">
                Reserva Ahora
              </Link>
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
        navItems={navItems}
      />
    </header>
  )
}
