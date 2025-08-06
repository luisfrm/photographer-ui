import PageSection from '../common/PageSection';
import { H3 } from '../common/Titles';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function About() {
	return (
		<PageSection className="bg-gray-50">
			<div className="grid md:grid-cols-2 gap-12 items-center">
				<div className="order-2 md:order-1">
					<H3>About me</H3>
					<p className="text-gray-600 text-lg leading-relaxed mb-6">
						I&apos;m a passionate photographer based in London, specializing in premium portrait and wedding
						photography. With over 8 years of experience, I capture the essence of every moment with an artistic eye and
						professional approach.
					</p>
					<p className="text-gray-600 text-lg leading-relaxed mb-8">
						My work focuses on creating timeless, elegant images that tell your unique story. Every session is tailored
						to reflect your personality and style, ensuring memories that last a lifetime.
					</p>
					<Button variant="outline" size="md">
						View My Work
					</Button>
				</div>
				<div className="relative h-96 md:h-[500px] order-1 md:order-2">
					<Image src="/photo_6.webp" alt="About Dari" fill className="object-cover rounded-lg" />
				</div>
			</div>
		</PageSection>
	);
}
