'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Contact() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Listo para capturar tus momentos?
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Contáctanos hoy para discutir tu próxima sesión fotográfica.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/contacto">
                Contactar ahora
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
