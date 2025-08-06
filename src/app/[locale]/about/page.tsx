import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/common/PageSection';
import { H2, H3, H4 } from '@/components/common/Titles';

export default function AboutPage() {
	return (
		<>
			<PageSection className="lg:pb-0">
				{/* Hero Section */}
				<section className="bg-white">
					<div>
						<Link href="/en" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Home
						</Link>

						<div className="grid md:grid-cols-2 gap-16 items-center">
							{/* Text Content */}
							<div>
								<p className="text-gray-600 text-sm uppercase tracking-wider mb-4">ABOUT ME</p>
								<h1 className="text-6xl md:text-7xl font-serif text-black mb-4">Dari</h1>
								<h1 className="text-6xl md:text-7xl font-serif text-black mb-8">Anderson</h1>
								<p className="text-xl text-gray-600 mb-8 leading-relaxed">
									Photography is the beauty of life, captured.
								</p>
								<Button
									variant="outline"
									size="lg"
									className="border-black text-black hover:bg-black hover:text-white bg-transparent"
									asChild
								>
									<Link href="/encontact">Get In Touch</Link>
								</Button>
							</div>

							{/* Hero Image */}
							<div className="relative">
								<div className="relative h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden border-8 border-white shadow-lg">
									<Image
										src="/placeholder.svg?height=600&width=500&text=Dari+Anderson"
										alt="Dari Anderson - Photographer"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* My Story Section */}
				<section className="py-20 bg-gray-50">
					<div>
						<H2>My Story</H2>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
							{/* Story Part 1 */}
							<div className="md:col-span-2">
								<p className="text-gray-600 text-lg leading-relaxed">
									Hi, I'm Dari Anderson, a photographer based in London. With over a decade of experience in portrait,
									landscape, and street photography, I aim to tell compelling stories through my images. I hold a Fine
									Arts degree from UC Berkeley and have traveled the globe to capture diverse cultures and nature.
								</p>
							</div>

							{/* Image 1 */}
							<div className="relative h-80 rounded-lg overflow-hidden">
								<Image
									src="/placeholder.svg?height=320&width=300&text=Portrait+Work"
									alt="Portrait Photography Work"
									fill
									className="object-cover"
								/>
							</div>

							{/* Image 2 - Horizontal */}
							<div className="relative h-80 rounded-lg overflow-hidden">
								<Image
									src="/placeholder.svg?height=320&width=300&text=Landscape+Work"
									alt="Landscape Photography Work"
									fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							{/* Image 3 - Horizontal */}
							<div className="relative h-80 rounded-lg overflow-hidden">
								<Image
									src="/placeholder.svg?height=320&width=300&text=Street+Photography"
									alt="Street Photography Work"
									fill
									className="object-cover"
								/>
							</div>

							{/* Story Part 2 */}
							<div className="md:col-span-2">
								<p className="text-gray-600 text-lg leading-relaxed mb-6">
									I hold a Fine Arts degree from UC Berkeley, and my professional journey has taken me around the globe,
									enriching my portfolio and deepening my appreciation for diverse cultures and nature.
								</p>
								<p className="text-gray-600 text-lg leading-relaxed">
									When I'm not shooting, I love exploring new hiking trails, reading about visual arts, and volunteering
									at animal shelters. I believe in the power of images to connect people and inspire new perspectives.
								</p>
							</div>

							{/* Image 4 */}
							<div className="relative h-80 rounded-lg overflow-hidden">
								<Image
									src="/placeholder.svg?height=320&width=300&text=Nature+Photography"
									alt="Nature Photography Work"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* My Approach Section */}
				<section className="py-20 bg-white">
					<div>
						<H2>My Approach</H2>

						<div className="grid md:grid-cols-3 gap-16">
							{/* Process Steps */}
							<div className="md:col-span-2">
								<div className="space-y-12">
									{/* Step 01 */}
									<div>
										<H4>01</H4>
										<p className="text-gray-600 text-lg leading-relaxed">
											I meet with the client to understand their vision and preferences. If on location, I scout the
											site. I then create a mood board, detailed shot list, and schedule the shoot.
										</p>
									</div>

									{/* Step 02 */}
									<div>
										<H4>02</H4>
										<p className="text-gray-600 text-lg leading-relaxed">
											I check my everything and coordinate with any stylists or makeup artists. I confirm details with
											the client and may do a brief rehearsal for some shoots.
										</p>
									</div>

									{/* Step 03 */}
									<div>
										<H4>03</H4>
										<p className="text-gray-600 text-lg leading-relaxed">
											On the day, I arrive early to set up. I guide the subjects and capture a variety of shots, making
											real-time adjustments and regularly backing up the photos.
										</p>
									</div>

									{/* Step 04 */}
									<div>
										<H4>04</H4>
										<p className="text-gray-600 text-lg leading-relaxed">
											I edit the photos and provide proofs to the client for selection. After making final adjustments,
											I deliver the images and follow up to ensure satisfaction.
										</p>
									</div>
								</div>
							</div>

							{/* Approach Image */}
							<div className="relative">
								<div className="relative h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden border-8 border-white shadow-lg">
									<Image
										src="/placeholder.svg?height=600&width=400&text=Photography+Process"
										alt="Photography Process"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</PageSection>
			<footer>
				{/* CTA Section */}
        			{/* Testimonial Section */}
				<section className="py-20 bg-gray-50">
					<div className="">
						<div className="max-w-4xl mx-auto">
							<div className="border border-gray-300 rounded-lg p-12 bg-white relative">
								{/* Quote Icons */}
								<div className="absolute top-8 left-8">
									<Quote className="w-8 h-8 text-gray-400 transform scale-x-[-1]" />
								</div>
								<div className="absolute bottom-8 right-8">
									<Quote className="w-8 h-8 text-gray-400" />
								</div>

								{/* Testimonial Text */}
								<div className="text-center">
									<p className="text-2xl text-black font-light leading-relaxed">
										Working with Dari was such a pleasure! I can't recommend her enough.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="py-20 bg-black text-white">
					<div className="text-center">
						<h2 className="text-4xl font-serif mb-6">Ready to Work Together?</h2>
						<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
							Let's create something beautiful together. I'd love to hear about your vision and bring it to life.
						</p>
						<Button
							size="lg"
							variant="outline"
							asChild
              className='text-black'
						>
							<Link href="/es/contact">Get In Touch</Link>
						</Button>
					</div>
				</section>
			</footer>
		</>
	);
}
