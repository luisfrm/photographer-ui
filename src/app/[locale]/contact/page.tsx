"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import PageSection from "@/components/common/PageSection"

export default function ContactPage() {
  const [showScheduling, setShowScheduling] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')

  const getSlotDetails = (slot: string) => {
    const slotMap: { [key: string]: string } = {
      'aug12-620': 'Tuesday, August 12, 2025 at 6:20 PM (Pink Backdrop)',
      'aug12-640': 'Tuesday, August 12, 2025 at 6:40 PM (Pink Backdrop)',
      'aug19-620': 'Tuesday, August 19, 2025 at 6:20 PM (Nude backdrop)',
      'aug26-620': 'Tuesday, August 26, 2025 at 6:20 PM (Brown Backdrop)',
    }
    return slotMap[slot] || slot
  }

  return (
    <PageSection>
      {/* Contact Content */}
      <section className="pt-24 pb-16">
        <div>
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-6xl font-serif mb-8 text-black">Get In Touch</h1>
              <p className="text-gray-600 text-lg mb-8">
                I'd love to hear about your vision and discuss how we can bring it to life. Whether it's a wedding,
                portrait session, or commercial project, let's create something beautiful together.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-4 text-black" />
                  <span className="text-gray-600">hello@dariphotography.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-4 text-black" />
                  <span className="text-gray-600">+44 20 1234 5678</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-4 text-black" />
                  <span className="text-gray-600">Utah, US</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-black">Follow Me</h3>
                <div className="flex space-x-4">
                  <Link href="#" className="text-primary hover:scale-110 transition-all">
                    <Instagram className="w-6 h-6 " />
                  </Link>
                  <Link href="#" className="text-primary hover:scale-110 transition-all">
                    <Facebook className="w-6 h-6" />
                  </Link>
                  <Link href="#" className="text-primary hover:scale-110 transition-all">
                    <Twitter className="w-6 h-6 " />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-black">
                    Name
                  </Label>
                  <Input id="name" type="text" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-black">
                    Email
                  </Label>
                  <Input id="email" type="email" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-black">
                    Subject
                  </Label>
                  <Input id="subject" type="text" className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="schedule"
                      checked={showScheduling}
                      onCheckedChange={(checked) => setShowScheduling(checked === 'indeterminate' ? false : checked)}
                    />
                    <Label htmlFor="schedule" className="text-black cursor-pointer">
                      Wanna schedule a session?
                    </Label>
                  </div>

                  {/* Animated Scheduling Section */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showScheduling ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="border border-gray-200 rounded-lg p-6 bg-white">
                      <h4 className="text-lg font-semibold text-black mb-4">Available Sessions</h4>

                      {/* Date Options */}
                      <div className="space-y-6">
                        {/* Tuesday, August 12, 2025 */}
                        <div>
                          <h5 className="text-base font-medium text-black mb-1">Tuesday, August 12, 2025</h5>
                          <p className="text-sm text-gray-600 mb-2">Pink Backdrop</p>
                          <p className="text-sm text-gray-500 mb-3">Choose from 2 available spots</p>
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              6:00 PM
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedSlot('aug12-620')}
                              className={`px-3 py-2 text-sm border rounded transition-colors ${selectedSlot === 'aug12-620' ? 'border-black bg-primary font-semibold text-white' : 'border-gray-800 text-black hover:bg-gray-100'
                                }`}
                            >
                              6:20 PM
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedSlot('aug12-640')}
                              className={`px-3 py-2 text-sm border rounded transition-colors ${selectedSlot === 'aug12-640' ? 'border-black bg-primary text-black font-semibold' : 'border-gray-800 text-black hover:bg-gray-100'
                                }`}
                            >
                              6:40 PM
                            </button>
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              7:00 PM
                            </button>
                          </div>
                        </div>

                        {/* Tuesday, August 19, 2025 */}
                        <div>
                          <h5 className="text-base font-medium text-black mb-1">Tuesday, August 19, 2025</h5>
                          <p className="text-sm text-gray-600 mb-2">Nude backdrop</p>
                          <p className="text-sm text-gray-500 mb-3">Choose from 1 available spot</p>
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              6:00 PM
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedSlot('aug19-620')}
                              className={`px-3 py-2 text-sm border rounded transition-colors ${selectedSlot === 'aug19-620' ? 'border-black bg-black text-white' : 'border-gray-800 text-black hover:bg-gray-100'
                                }`}
                            >
                              6:20 PM
                            </button>
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              6:40 PM
                            </button>
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              7:00 PM
                            </button>
                          </div>
                        </div>

                        {/* Tuesday, August 26, 2025 */}
                        <div>
                          <h5 className="text-base font-medium text-black mb-1">Tuesday, August 26, 2025</h5>
                          <p className="text-sm text-gray-600 mb-2">Brown Backdrop</p>
                          <p className="text-sm text-gray-500 mb-3">Choose from 1 available spot</p>
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              6:00 PM
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedSlot('aug26-620')}
                              className={`px-3 py-2 text-sm border rounded transition-colors ${selectedSlot === 'aug26-620' ? 'border-black bg-black text-white' : 'border-gray-800 text-black hover:bg-gray-100'
                                }`}
                            >
                              6:20 PM
                            </button>
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              6:40 PM
                            </button>
                            <button
                              type="button"
                              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              7:00 PM
                            </button>
                          </div>
                        </div>
                      </div>

                      {selectedSlot && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            ✓ Selected: {getSlotDetails(selectedSlot)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-black">
                    Message
                  </Label>
                  <Textarea id="message" rows={6} className="mt-2" />
                </div>
                <Button type="submit" size="lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageSection>
  )
}
