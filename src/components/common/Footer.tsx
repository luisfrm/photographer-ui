import Link from 'next/link'
import { Camera, Mail, Phone, Instagram, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <>
      <footer className="bg-secondary text-secondary-foreground border-t border-border">
        <div className=" w-full mx-auto px-6 sm:px-6 lg:px-0 py-12 md:max-w-6xl lg:max-w-8xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Tagline */}
            <div className="space-y-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-secondary-foreground"
              >
                <Camera className="h-8 w-8 text-primary" />
                <span className="font-serif text-xl font-semibold tracking-tight">
                  Darianny Salas
                </span>
              </Link>
              <p className="text-secondary-foreground/80 text-sm leading-relaxed">
                Capturando momentos, creando recuerdos.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contacto</h3>
              <div className="space-y-3">
                <Link 
                  href="mailto:dchsr7@gmail.com"
                  className="flex items-center space-x-3 text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">dchsr7@gmail.com</span>
                </Link>
                <Link 
                  href="tel:+13854365603"
                  className="flex items-center space-x-3 text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+1 385 436 5603</span>
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Síguenos</h3>
              <Link 
                href="https://www.instagram.com/dnovagallery"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-secondary-foreground/80 hover:text-secondary-foreground transition-colors group"
              >
                <Instagram className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-secondary-foreground/60 text-sm text-center sm:text-left">
              © 2025 Darianny Salas. Todos los derechos reservados.
            </p>
            <p className="text-secondary-foreground/60 text-sm text-center sm:text-right">
              Desarrollado por{' '}
              <Link 
                href="https://rivasdigital.pro" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Rivas Digital
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
