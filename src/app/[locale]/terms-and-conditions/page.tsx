import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Content */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-serif mb-8 text-black">Terms & Conditions</h1>
            <p className="text-gray-600 text-lg mb-8">Last updated: January 2024</p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Agreement to Terms</h2>
                <p>
                  By booking photography services with Dari Photography (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you (&ldquo;client&rdquo; or &ldquo;you&rdquo;) 
                  agree to be bound by these Terms and Conditions. Please read these terms carefully before booking our services.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Booking and Payment</h2>
                
                <h3 className="text-xl font-semibold text-black mb-3">Booking Process</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>All bookings must be confirmed in writing via email or signed contract</li>
                  <li>A 50% deposit is required to secure your session date</li>
                  <li>The remaining balance is due on the day of the photography session</li>
                  <li>Dates are not reserved until deposit is received</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We accept cash, bank transfers, and major credit cards</li>
                  <li>All prices are in USD and include applicable taxes</li>
                  <li>Payment plans may be available for premium packages upon request</li>
                  <li>Late payment fees may apply for overdue balances</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Cancellation and Rescheduling</h2>
                
                <h3 className="text-xl font-semibold text-black mb-3">Client Cancellation</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Cancellations more than 14 days before the session: Full refund minus 10% processing fee</li>
                  <li>Cancellations 7-14 days before: 50% refund of deposit</li>
                  <li>Cancellations less than 7 days before: No refund</li>
                  <li>Emergency cancellations will be considered on a case-by-case basis</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Rescheduling</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>One free reschedule is allowed with 48+ hours notice</li>
                  <li>Additional rescheduling may incur a $50 administrative fee</li>
                  <li>Weather-related rescheduling is free of charge</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Photography Session</h2>
                
                <h3 className="text-xl font-semibold text-black mb-3">Session Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Sessions begin promptly at the scheduled time</li>
                  <li>Late arrivals may result in shortened session time</li>
                  <li>Clients are responsible for bringing desired outfits and props</li>
                  <li>We reserve the right to end sessions early due to inappropriate behavior</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Location and Weather</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Outdoor sessions are subject to weather conditions</li>
                  <li>Alternative indoor locations will be provided if needed</li>
                  <li>Travel fees may apply for locations outside our standard service area</li>
                  <li>Clients are responsible for obtaining necessary location permits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Image Delivery and Usage</h2>
                
                <h3 className="text-xl font-semibold text-black mb-3">Delivery Timeline</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Premium Package: 5-7 business days</li>
                  <li>Standard Package: 7-10 business days</li>
                  <li>Rush delivery available for additional fee</li>
                  <li>Images delivered via secure online gallery</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Usage Rights</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Clients receive personal usage rights for purchased images</li>
                  <li>Commercial usage requires separate licensing agreement</li>
                  <li>Images may not be altered without written permission</li>
                  <li>Credit to Dari Photography appreciated when sharing</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Copyright and Portfolio Usage</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dari Photography retains copyright to all images</li>
                  <li>We reserve the right to use images for portfolio and marketing</li>
                  <li>Clients may opt-out of portfolio usage upon request</li>
                  <li>Model releases required for commercial portfolio usage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Liability and Insurance</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dari Photography carries professional liability insurance</li>
                  <li>We are not responsible for personal injury during sessions</li>
                  <li>Equipment backup ensures session continuity</li>
                  <li>Force majeure events may require rescheduling without penalty</li>
                  <li>Maximum liability limited to the total contract value</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Client Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Arrive on time and prepared for your session</li>
                  <li>Provide accurate contact information and session details</li>
                  <li>Communicate any special requirements or concerns in advance</li>
                  <li>Respect photographer and any assistants during the session</li>
                  <li>Follow location rules and regulations</li>
                  <li>Make final payment as agreed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Additional Services and Add-ons</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Additional services must be requested before or during the session</li>
                  <li>Add-on pricing as listed in current service menu</li>
                  <li>Rush editing and delivery available for additional fee</li>
                  <li>Print services available through preferred vendors</li>
                  <li>Extended session time subject to availability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Privacy and Confidentiality</h2>
                <p>
                  We respect your privacy and maintain confidentiality of all personal information. 
                  Please refer to our Privacy Policy for detailed information about data handling and protection.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Dispute Resolution</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We strive to resolve all concerns through direct communication</li>
                  <li>Formal complaints should be submitted in writing within 30 days</li>
                  <li>Mediation preferred before legal action</li>
                  <li>UK law governs all agreements and disputes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Modifications to Terms</h2>
                <p>
                  These terms may be updated periodically to reflect changes in our services or legal requirements. 
                  Clients will be notified of significant changes, and continued use of our services constitutes 
                  acceptance of updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Contact Information</h2>
                <p className="mb-4">
                  For questions about these Terms and Conditions or our services, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p><strong>Dari Photography</strong></p>
                  <p>Email: hello@dariphotography.com</p>
                  <p>Phone: +44 20 1234 5678</p>
                  <p>Address: Utah, US</p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Acceptance</h2>
                <p>
                  By booking our services, you acknowledge that you have read, understood, and agree to be bound by 
                  these Terms and Conditions. These terms constitute the entire agreement between you and Dari Photography.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-serif italic mb-4">Dari</h3>
              <p className="text-gray-400">Premium photography services in London and beyond.</p>
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
