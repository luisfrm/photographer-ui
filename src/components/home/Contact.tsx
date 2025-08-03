'use client';

import { Button } from '@/components/ui/button';
import { H3 } from '@/components/common/Titles';
import { useState } from 'react';
import PageSection from '../common/PageSection';

export default function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('loading');

		// Simulate form submission
		try {
			await new Promise(resolve => setTimeout(resolve, 2000));
			setStatus('success');
			setFormData({ name: '', email: '', message: '' });

			// Reset status after 3 seconds
			setTimeout(() => setStatus('idle'), 3000);
		} catch (error) {
			setStatus('error');
			setTimeout(() => setStatus('idle'), 3000);
		}
	};

	const getButtonText = () => {
		switch (status) {
			case 'loading':
				return 'Enviando...';
			case 'success':
				return '¡Mensaje enviado!';
			case 'error':
				return 'Error al enviar';
			default:
				return 'Enviar mensaje';
		}
	};

	return (
		<PageSection className="bg-gray-50 dark:bg-gray-900">
			<div className="max-w-2xl mx-auto text-center mb-12">
				<H3>Contáctanos</H3>
				<p className="text-lg text-gray-600 dark:text-gray-300">
					¿Tienes alguna pregunta o quieres reservar una sesión? ¡Nos encantaría escucharte!
				</p>
			</div>

			<div className="max-w-lg mx-auto">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Nombre completo
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
							placeholder="Tu nombre completo"
							disabled={status === 'loading'}
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Correo electrónico
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							required
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
							placeholder="tu@email.com"
							disabled={status === 'loading'}
						/>
					</div>

					<div>
						<label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Mensaje
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleInputChange}
							required
							rows={5}
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors resize-none"
							placeholder="Cuéntanos sobre tu proyecto o pregunta..."
							disabled={status === 'loading'}
						/>
					</div>

					<div className="flex justify-center">
						<Button
							type="submit"
							size="lg"
							status={status}
							variant="default"
							disabled={status === 'loading'}
							className="w-full"
						>
							{getButtonText()}
						</Button>
					</div>
				</form>

				<div className="mt-8 text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">También puedes contactarnos directamente:</p>
					<div className="mt-4 space-y-2">
						<p className="text-gray-700 dark:text-gray-300">📧 info@dnovagallery.com</p>
						<p className="text-gray-700 dark:text-gray-300">📱 +1 (555) 123-4567</p>
					</div>
				</div>
			</div>
		</PageSection>
	);
}
