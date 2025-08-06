import Link from "next/link"
import { ArrowLeft, Check, Camera, Users, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-serif mb-6 text-black">Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional photography services tailored to capture your unique story. 
              Choose from our carefully crafted packages designed to meet every need and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Services Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Premium Package */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-black relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif text-black mb-2">Premium Package</h3>
                <div className="text-5xl font-bold text-black mb-2">$100</div>
                <p className="text-gray-600">10 Fotos editadas profesionalmente</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Duración: 1 hora completa</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">2 cambios de outfit incluidos</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">1 Fondo profesional de estudio</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Edición profesional completa</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Galería online privada</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Entrega en 5-7 días hábiles</span>
                </div>
              </div>

              <Button variant="default" size="lg" asChild>
                <Link href="/contact">Choose Premium</Link>
              </Button>
            </div>

            {/* Standard Package */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif text-black mb-2">Standard Package</h3>
                <div className="text-5xl font-bold text-black mb-2">$75</div>
                <p className="text-gray-600">8 Fotos editadas profesionalmente</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Duración: 1 hora</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">1 cambio de outfit</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Edición básica profesional</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Entrega digital</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Galería online</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Entrega en 7-10 días hábiles</span>
                </div>
              </div>

              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Choose Standard</Link>
              </Button>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif text-black mb-2">Add-ons</h3>
                <div className="text-5xl font-bold text-black mb-2">$8</div>
                <p className="text-gray-600">Por foto adicional editada</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Foto adicional editada</span>
                  <span className="font-semibold">$8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Cambio de outfit extra</span>
                  <span className="font-semibold">+$25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Fondo adicional</span>
                  <span className="font-semibold">+$20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Edición premium</span>
                  <span className="font-semibold">+$15/foto</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Impresiones físicas</span>
                  <span className="font-semibold">Disponible</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sesión extendida (+30min)</span>
                  <span className="font-semibold">+$40</span>
                </div>
              </div>

              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Customize Package</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-serif text-black text-center mb-16">What's Included</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-serif text-black mb-4">Professional Equipment</h3>
              <p className="text-gray-600 leading-relaxed">
                High-end cameras, professional lighting, and studio-grade equipment to ensure 
                the highest quality results for every session.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-serif text-black mb-4">Personal Direction</h3>
              <p className="text-gray-600 leading-relaxed">
                Expert guidance throughout your session to help you feel comfortable and 
                capture your best angles and expressions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-serif text-black mb-4">Professional Editing</h3>
              <p className="text-gray-600 leading-relaxed">
                Careful post-processing to enhance colors, lighting, and overall image quality 
                while maintaining a natural, authentic look.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-serif text-black text-center mb-16">Our Process</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Consultation</h3>
              <p className="text-gray-600">
                We discuss your vision, style preferences, and session details to ensure 
                everything is perfectly planned.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Preparation</h3>
              <p className="text-gray-600">
                Location scouting, equipment setup, and final coordination to ensure 
                a smooth and successful session.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Photo Session</h3>
              <p className="text-gray-600">
                Professional photography session with expert direction and multiple 
                setups to capture your perfect shots.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Delivery</h3>
              <p className="text-gray-600">
                Professional editing and delivery of your final images through a 
                private online gallery within 5-10 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-serif text-black text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-black mb-3">How far in advance should I book?</h3>
              <p className="text-gray-600">
                We recommend booking at least 2-3 weeks in advance, especially during peak seasons. 
                However, we can sometimes accommodate last-minute requests depending on availability.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-black mb-3">What should I wear for my session?</h3>
              <p className="text-gray-600">
                We'll provide a detailed style guide after booking, but generally recommend solid colors, 
                avoiding busy patterns, and bringing multiple outfit options that reflect your personal style.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-black mb-3">Can I bring props or specific items?</h3>
              <p className="text-gray-600">
                We encourage bringing meaningful props, accessories, or items that represent 
                your personality or the story you want to tell through your photos.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-black mb-3">What happens if weather affects our outdoor session?</h3>
              <p className="text-gray-600">
                We monitor weather closely and will reschedule if conditions aren't suitable. 
                We also have backup indoor locations and can work with light rain for dramatic effects if desired.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-black mb-3">Do you offer payment plans?</h3>
              <p className="text-gray-600">
                Yes! We offer flexible payment options including a 50% deposit to secure your date 
                and the remaining balance due on the day of your session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-6">Ready to Book Your Session?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's create something beautiful together. Contact us to discuss your vision and 
            schedule your professional photography session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-black" variant="outline" asChild>
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/gallery">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif italic mb-4">Dari</h3>
              <p className="text-gray-400">Premium photography services in London and beyond.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <p>Premium Package - $100</p>
                <p>Standard Package - $75</p>
                <p>Custom Add-ons</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">hello@dariphotography.com</p>
              <p className="text-gray-400 mb-2">+44 20 1234 5678</p>
              <p className="text-gray-400">Utah, US</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="/privacy-policy" className="block hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="block hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dari Photography. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
