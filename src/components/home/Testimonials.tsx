'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Descubre por qué nuestros clientes confían en nosotros para capturar sus momentos más especiales.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/testimonios">
                Ver testimonios
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
