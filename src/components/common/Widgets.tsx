'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, MessageCircle, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WidgetsProps {
	whatsappNumber?: string;
	instagramUsername?: string;
}

export default function Widgets({ whatsappNumber = '+1234567890', instagramUsername = 'photographer' }: WidgetsProps) {
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 300);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const openWhatsApp = () => {
		const message = encodeURIComponent('Hola! Me gustaría obtener más información sobre tus servicios fotográficos.');
		const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`;
		window.open(url, '_blank');
	};

	const openInstagram = () => {
		const url = `https://instagram.com/${instagramUsername}`;
		window.open(url, '_blank');
	};

	return (
		<>
			{/* WhatsApp Widget */}
			<button
				onClick={openWhatsApp}
				className={cn(
					"group fixed right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
					showScrollTop ? 'bottom-24' : 'bottom-6'
				)}
				aria-label="Contactar por WhatsApp"
				title="Contactar por WhatsApp"
			>
				<MessageCircle className="w-6 h-6" />
				<span className="absolute pointer-events-none right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
					¡Chatea conmigo!
				</span>
			</button>

			{/* Instagram Widget */}
			<button
				onClick={openInstagram}
				className={cn(
					"group fixed right-6 z-50 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
					showScrollTop ? 'bottom-42' : 'bottom-24'
				)}
				aria-label="Sígueme en Instagram"
				title="Sígueme en Instagram"
			>
				<Instagram className="w-6 h-6" />
				<span className="absolute pointer-events-none right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
					Sígueme en Instagram
				</span>
			</button>

			{/* Scroll to Top Widget */}
			<button
				onClick={scrollToTop}
				className={cn(
					"bottom-6 group fixed right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-in slide-in-from-bottom-2",
					showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
				)}
				aria-label="Ir al inicio"
				title="Ir al inicio"
			>
				<ChevronUp className="w-6 h-6" />
				<span className="absolute pointer-events-none right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
					Ir al inicio
				</span>
			</button>
		</>
	);
}
