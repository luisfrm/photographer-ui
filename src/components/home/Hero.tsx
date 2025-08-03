'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background h-[70vh] min-h-[500px] lg:h-screen">
      <section className='absolute inset-0 w-full h-full'>
        <div className="relative w-full h-full flex">
          <div className="w-1/2 h-full relative">
            <Image
              src="/photo1.jpg"
              alt="Hero background 1"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="w-1/2 h-full relative">
            <Image
              src="/photo3.png"
              alt="Hero background 2"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 relative flex items-center justify-center h-full">
        <div className="mx-auto max-w-2xl text-center bg-background/60  p-10 rounded-md">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Capturando momentos
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
            <Button variant="secondary" size="lg" asChild>
              <Link href="/servicios">
                Ver servicios
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </section>
  )
}
