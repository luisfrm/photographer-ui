import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'

const Pricing = () => {
  return (
    <section className="py-20 bg-white">
        <div className="w-full md:max-w-6xl lg:max-w-7xl mx-auto px-6 sm:px-6 lg:px-0">
          <h2 className="text-6xl font-serif text-black mb-12">Services</h2>

          <div className="grid md:grid-cols-3 gap-8 border-t border-gray-300">
            {/* Premium Package */}
            <div className="md:border-r md:pr-8 pt-8 border-gray-300">
              <h3 className="text-2xl font-serif mb-4 text-black">Premium Package</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-black mb-2">$100</div>
                <div className="text-lg text-gray-600 mb-4">10 Fotos editadas</div>
              </div>

              <ul className="space-y-3 mb-8 text-gray-600">
                <li>• Duración: 1 hora</li>
                <li>• 2 cambios de outfit</li>
                <li>• 1 Fondo profesional</li>
                <li>• Edición profesional completa</li>
                <li>• Galería online privada</li>
              </ul>

              <div className="mb-8">
                <div className="relative h-64 mb-6">
                  <Image
                    src="/placeholder.svg?height=256&width=400&text=Premium+Photography"
                    alt="Premium Photography Package"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                asChild
              >
                <Link href="/encontact">Get In Touch</Link>
              </Button>
            </div>

            {/* Standard Package */}
            <div className="md:border-r border-gray-300 md:pr-8 md:pt-8">
              <h3 className="text-2xl font-serif mb-4 text-black">Standard Package</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-black mb-2">$75</div>
                <div className="text-lg text-gray-600 mb-4">8 Fotos editadas</div>
              </div>

              <ul className="space-y-3 mb-8 text-gray-600">
                <li>• Duración: 1 hora</li>
                <li>• 1 cambio de outfit</li>
                <li>• Edición básica</li>
                <li>• Entrega digital</li>
                <li>• Galería online</li>
              </ul>

              <div className="mb-8">
                <div className="relative h-64 mb-6">
                  <Image
                    src="/placeholder.svg?height=256&width=400&text=Standard+Photography"
                    alt="Standard Photography Package"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                asChild
              >
                <Link href="/encontact">Get In Touch</Link>
              </Button>
            </div>

            {/* Add-ons */}
            <div className="md:pt-8">
              <h3 className="text-2xl font-serif mb-4 text-black">Add-ons</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-black mb-2">$8</div>
                <div className="text-lg text-gray-600 mb-4">Por foto adicional</div>
              </div>

              <ul className="space-y-3 mb-8 text-gray-600">
                <li>• Fotos adicionales editadas</li>
                <li>• Cambio de outfit extra: +$25</li>
                <li>• Fondo adicional: +$20</li>
                <li>• Edición premium: +$15/foto</li>
                <li>• Impresiones físicas disponibles</li>
              </ul>

              <div className="mb-8">
                <div className="relative h-64 mb-6">
                  <Image
                    src="/placeholder.svg?height=256&width=400&text=Additional+Services"
                    alt="Additional Photography Services"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                asChild
              >
                <Link href="/encontact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Pricing