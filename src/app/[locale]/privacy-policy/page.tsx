import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Content */}
      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-serif mb-8 text-black">Privacy Policy</h1>
            <p className="text-gray-600 text-lg mb-8">Last updated: January 2024</p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Introduction</h2>
                <p>
                  At Dari Photography (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), we are committed to protecting your privacy and 
                  ensuring the security of your personal information. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website or use our photography services.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-black mb-3">Personal Information</h3>
                <p className="mb-4">We may collect the following personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Session preferences and requirements</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Communication records and correspondence</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3 mt-6">Photography and Images</h3>
                <p className="mb-4">During photography sessions, we collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Photographs and images taken during sessions</li>
                  <li>Model releases and usage permissions</li>
                  <li>Location and session details</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3 mt-6">Website Usage Information</h3>
                <p className="mb-4">We automatically collect certain information when you visit our website:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and browser information</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referring website information</li>
                  <li>Device and operating system information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing photography services and managing bookings</li>
                  <li>Processing payments and managing client accounts</li>
                  <li>Communicating about sessions, deliverables, and updates</li>
                  <li>Improving our services and website functionality</li>
                  <li>Marketing and promotional activities (with your consent)</li>
                  <li>Legal compliance and business operations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Image Usage and Rights</h2>
                <p className="mb-4">
                  We respect your rights regarding the images we create during your session:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Client images are stored securely and shared only with explicit permission</li>
                  <li>Portfolio usage requires separate consent through model releases</li>
                  <li>Images are not sold or shared with third parties without permission</li>
                  <li>Clients retain personal usage rights to their purchased images</li>
                  <li>We maintain copyright for professional and artistic purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Information Sharing and Disclosure</h2>
                <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist in our operations</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. This includes secure storage 
                  systems, encrypted data transmission, and regular security assessments.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for image usage</li>
                  <li>Request a copy of your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Cookies and Tracking</h2>
                <p>
                  Our website uses cookies and similar technologies to enhance your browsing experience, 
                  analyze website traffic, and understand user preferences. You can control cookie settings 
                  through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Third-Party Services</h2>
                <p>
                  We may use third-party services for payment processing, website analytics, and communication tools. 
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to provide our services, 
                  comply with legal obligations, and resolve disputes. Client images are typically retained 
                  for a minimum of 2 years for backup and reorder purposes.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                  We will notify you of significant changes through our website or direct communication.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-black mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p><strong>Dari Photography</strong></p>
                  <p>Email: hello@dariphotography.com</p>
                  <p>Phone: +44 20 1234 5678</p>
                  <p>Address: Utah, US</p>
                </div>
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
