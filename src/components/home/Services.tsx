'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import PageSection from '../common/PageSection';
import { H2 } from '../common/Titles';

export default function Services() {
	return (
		<PageSection className="bg-gray-100">
			<H2>Services</H2>

			<div className="grid md:grid-cols-3 gap-8 border-t border-gray-300">
				{/* Wedding Photography */}
				<div className="md:border-r md:pr-8 pt-8 border-gray-300">
					<h3 className="text-2xl font-serif mb-6 text-black">Wedding Photography</h3>
					<ul className="space-y-3 mb-8 text-gray-600">
						<li>• Pre-Wedding Consultation</li>
						<li>• Full-Day Coverage</li>
						<li>• Customized Wedding Albums</li>
						<li>• Online Gallery and Digital Downloads</li>
						<li>• Highlight Video and Slideshow</li>
					</ul>
					<div className="mb-8">
						<div className="relative h-64 mb-6">
							<Image src="/photo_7.webp" alt="Wedding Photography" fill className="object-cover rounded-lg" />
						</div>
					</div>
					<Button variant="outline" asChild>
						<Link href="/encontact">Get In Touch</Link>
					</Button>
				</div>

				{/* Portrait Photography */}
				<div className="md:border-r border-gray-300 md:pr-8 md:pt-8">
					<h3 className="text-2xl font-serif mb-6 text-black">Portrait Photography</h3>
					<ul className="space-y-3 mb-8 text-gray-600">
						<li>• Personalized Consultation</li>
						<li>• On-Location and Studio Options</li>
						<li>• Professional Hair & Makeup Services</li>
						<li>• Retouching and Editing</li>
						<li>• Custom Print Packages</li>
					</ul>
					<div className="mb-8">
						<div className="relative h-64 mb-6">
							<Image src="/photo_4.webp" alt="Portrait Photography" fill className="object-cover rounded-lg" />
						</div>
					</div>
					<Button variant="outline" asChild>
						<Link href="/encontact">Get In Touch</Link>
					</Button>
				</div>

				{/* Nature Photography */}
				<div className="md:pt-8">
					<h3 className="text-2xl font-serif mb-6 text-black">Nature Photography</h3>
					<ul className="space-y-3 mb-8 text-gray-600">
						<li>• Guided Photo Tours</li>
						<li>• Seasonal & Special Event Shoots</li>
						<li>• Prints and Custom Framing</li>
						<li>• Limited Edition Collections</li>
						<li>• Custom Books & Calendars</li>
					</ul>
					<div className="mb-8">
						<div className="relative h-64 mb-6">
							<Image src="/photo_9.webp" alt="Nature Photography" fill className="object-cover rounded-lg" />
						</div>
					</div>
					<Button variant="outline" asChild>
						<Link href="/encontact">Get In Touch</Link>
					</Button>
				</div>
			</div>
		</PageSection>
	);
}
