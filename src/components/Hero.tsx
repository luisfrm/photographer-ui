'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Capturando momentos especiales
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Fotografía profesional para tus momentos más importantes. Bodas, eventos, retratos y más.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/contacto">
                Reserva una sesión
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/servicios">
                Ver servicios
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
