import { SiteContent } from "./types";

export const es: SiteContent = {
  nav: [
    { name: "Servicios", href: "/es/services" },
    { name: "Paquetes", href: "/es/services" },
    { name: "Sobre Nosotros", href: "/es/about" },
    { name: "Contacto", href: "/es/contact" },
  ],

  hero: {
    title: "DnovaGallery",
    subtitle:
      "No es la <strong>cámara</strong> quien hace al fotógrafo, es el <strong>fotógrafo</strong> quien hace a la cámara.",
    cta: "Reserva una sesión",
  },

  about: {
    title: "Sobre mí",
    paragraphs: [
      "Soy un fotógrafo apasionado con sede en Londres, especializado en fotografía de retratos y bodas de alta calidad. Con más de 8 años de experiencia, capturo la esencia de cada momento con un ojo artístico y un enfoque profesional.",
      "Mi trabajo se centra en crear imágenes atemporales y elegantes que cuentan tu historia única. Cada sesión está adaptada para reflejar tu personalidad y estilo, asegurando recuerdos que duran toda la vida.",
    ],
    cta: "Ver mi trabajo",
  },

  pricing: {
    title: "Servicios",
    packages: [
      {
        name: "Paquete Premium",
        price: "$100",
        description: "10 fotos editadas",
        features: [
          "Duración: 1 hora",
          "2 cambios de outfit",
          "1 fondo profesional",
          "Edición profesional completa",
          "Galería online privada",
        ],
        cta: "Contáctanos",
      },
      {
        name: "Paquete Estándar",
        price: "$75",
        description: "8 fotos editadas",
        features: [
          "Duración: 1 hora",
          "1 cambio de outfit",
          "Edición básica",
          "Entrega digital",
          "Galería online",
        ],
        cta: "Contáctanos",
      },
      {
        name: "Extras",
        price: "$8",
        description: "Por foto adicional",
        features: [
          "Fotos adicionales editadas",
          "Cambio de outfit extra: +$25",
          "Fondo adicional: +$20",
          "Edición premium: +$15/foto",
          "Impresiones físicas disponibles",
        ],
        cta: "Contáctanos",
      },
    ],
  },

  contact: {
    title: "Contáctanos",
    subtitle:
      "¿Tienes alguna pregunta o quieres reservar una sesión? ¡Nos encantaría escucharte!",
    form: {
      name: "Nombre completo",
      namePlaceholder: "Tu nombre completo",
      email: "Correo electrónico",
      emailPlaceholder: "tu@email.com",
      message: "Mensaje",
      messagePlaceholder: "Cuéntanos sobre tu proyecto o pregunta...",
      submit: "Enviar mensaje",
      loading: "Enviando...",
      success: "¡Mensaje enviado!",
      error: "Error al enviar",
    },
    directContact: "También puedes contactarnos directamente:",
    email: "info@dnovagallery.com",
    phone: "+1 (555) 123-4567",
  },

  footer: {
    tagline: "Capturando momentos, creando recuerdos.",
    contactTitle: "Contacto",
    socialTitle: "Síguenos",
    copyright: "© 2025 Darianny Salas. Todos los derechos reservados.",
    developedBy: "Desarrollado por",
  },

  widgets: {
    whatsappMessage:
      "¡Hola! Me gustaría obtener más información sobre tus servicios fotográficos.",
    whatsappLabel: "Contactar por WhatsApp",
    whatsappTooltip: "¡Chatea conmigo!",
    instagramLabel: "Sígueme en Instagram",
    instagramTooltip: "Sígueme en Instagram",
    scrollTopLabel: "Ir al inicio",
    scrollTopTooltip: "Ir al inicio",
  },

  mobileNav: {
    menuTitle: "Menú",
    cta: "Reserva Ahora",
    helpText: "¿Necesitas ayuda?",
    helpEmail: "contacto@rivasdigital.com",
  },
};
