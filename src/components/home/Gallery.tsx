import Link from 'next/link';
import Image from 'next/image';
import PageSection from '../common/PageSection';

const Gallery = () => {
	return (
		<PageSection className=" bg-gray-100">
			<h2 className="text-6xl font-serif text-black mb-12">Some Shots</h2>

			<div className="grid grid-cols-6 grid-rows-2 gap-4 h-[600px]">
				<Link href="/engallery" className="col-span-2 row-span-1 relative overflow-hidden rounded-lg group">
					<Image
						src="/photo_4.webp"
						alt="Mountain landscape photography"
						fill
						className="object-cover hover:scale-105 transition-all duration-300"
					/>
				</Link>

				<Link href="/engallery" className="col-span-2 row-span-1 relative overflow-hidden rounded-lg group">
					<Image
						src="/photo_3.webp"
						alt="Portrait photography"
						fill
						className="object-cover hover:scale-105 transition-all duration-300"
					/>
				</Link>

				<Link href="/engallery" className="col-span-2 row-span-2 relative overflow-hidden rounded-lg group">
					<Image
						src="/photo_5.webp"
						alt="Wedding photography"
						fill
						className="object-cover hover:scale-105 transition-all duration-300"
					/>
				</Link>

				<Link href="/engallery" className="col-span-4 row-span-1 relative overflow-hidden rounded-lg group">
					<Image
						src="/photo_9.webp"
						alt="Nature photography"
						fill
						className="object-cover object-center hover:scale-105 transition-all duration-300"
					/>
				</Link>

				<div className="col-span-2 row-span-1"></div>
			</div>
		</PageSection>
	);
};

export default Gallery;
