export interface LegalSummaryPoint {
  title: string;
  description: string;
}

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  subsections?: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export interface LegalDocumentContent {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  meta: {
    title: string;
    description: string;
  };
  summary: {
    title: string;
    subtitle: string;
    points: LegalSummaryPoint[];
  };
  tableOfContentsTitle: string;
  sections: LegalSection[];
  contactBox: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export const PRIVACY_POLICY_DATA: Record<"en" | "es", LegalDocumentContent> = {
  en: {
    badge: "Privacy & Data Protection",
    title: "Privacy Policy",
    subtitle:
      "Your trust is the foundation of our craft. Learn how we handle your personal information, session details, and photographs with total transparency and security.",
    lastUpdated: "March 2026",
    meta: {
      title: "Privacy Policy | DnovaGallery",
      description:
        "Learn how DnovaGallery protects your personal information, image rights, and private photo galleries.",
    },
    summary: {
      title: "Your Privacy at a Glance",
      subtitle: "The key commitments that guide how we protect your personal moments:",
      points: [
        {
          title: "Your Photos Stay Private",
          description:
            "We never publish client photographs to our portfolio or social media without your explicit permission or a signed model release.",
        },
        {
          title: "No Data Selling",
          description:
            "We never sell, rent, or monetize your contact information, session notes, or personal data to advertisers or third parties.",
        },
        {
          title: "Secure Cloud Galleries",
          description:
            "Your digital deliverables and archived image files are safely preserved on enterprise-grade encrypted storage infrastructure.",
        },
        {
          title: "You Are in Control",
          description:
            "You can request a copy of your stored records, ask for corrections, or request image deletion at any time.",
        },
      ],
    },
    tableOfContentsTitle: "Quick Navigation",
    sections: [
      {
        id: "introduction",
        title: "1. Introduction & Our Commitment",
        paragraphs: [
          "At DnovaGallery, we believe exceptional photography goes hand-in-hand with unwavering respect for personal privacy. When you book a portrait, event, or studio session with us, you invite us to capture meaningful moments in your life.",
          "This Privacy Policy explains what information we gather, why we need it, how your digital imagery is protected, and the choices you retain regarding your data. By using our website or booking our photography services, you acknowledge the practices outlined in this policy.",
        ],
      },
      {
        id: "information-collected",
        title: "2. Information We Collect",
        paragraphs: [
          "We collect only the information necessary to provide tailored photography services, confirm session schedules, and deliver your final images.",
        ],
        subsections: [
          {
            title: "Information You Provide Directly",
            paragraphs: [
              "When you reach out, schedule an appointment, or book a service package, you may provide:",
            ],
            bullets: [
              "Contact details: Full name, email address, phone number, and mailing address (for physical prints).",
              "Session specifications: Event dates, shoot locations, aesthetic preferences, participant names, and special requests.",
              "Payment verification: Transaction references processed securely through accredited third-party payment gateways (we never store your raw credit card numbers).",
              "Direct correspondence: Consultation notes, questionnaire responses, and feedback.",
            ],
          },
          {
            title: "Photographic Imagery",
            paragraphs: [
              "During our photography sessions, we capture raw and edited digital photographs, video clips, and creative compositions involving you and your session participants.",
            ],
          },
          {
            title: "Automated Website Metrics",
            paragraphs: [
              "When you browse our website, minimal non-identifiable technical data is recorded to maintain site performance and security, such as your browser type, device category, referring URL, and visited pages.",
            ],
          },
        ],
      },
      {
        id: "image-rights-portfolio",
        title: "3. Image Rights & Public Portfolio Display",
        paragraphs: [
          "Photographs are uniquely sensitive personal media. We handle image publicity with distinct care and ethical discretion.",
        ],
        bullets: [
          "Private by Default: Every photography session is treated as private. High-resolution galleries delivered to clients are password-protected or restricted to private access links.",
          "Portfolio & Social Media Showcase: We take deep pride in our artistic work, but we only share photographs on our website, portfolio, print exhibitions, or social channels when you have granted opt-in consent or executed a standard model release.",
          "Opt-Out Guarantee: If you prefer complete discretion for personal, religious, or security reasons, we fully honor strict private sessions without promotional usage.",
          "Revocation: If you previously authorized portfolio display and later wish for a specific image to be taken down from our digital channels, contact us and we will promptly remove it.",
        ],
      },
      {
        id: "how-we-use-information",
        title: "4. How We Use Your Information",
        paragraphs: [
          "We use collected information solely for genuine studio operations and client service:",
        ],
        bullets: [
          "Scheduling and coordinating photography sessions, calendar events, and location logistics.",
          "Curating, retouching, and delivering proofing galleries and final high-resolution photo packages.",
          "Invoicing, processing deposits or retainers, and accounting compliance.",
          "Sending essential updates concerning your appointment, weather contingency plans, or deliverable readiness.",
          "Responding promptly to questions, consultation requests, and customer support inquiries.",
        ],
      },
      {
        id: "storage-security",
        title: "5. Digital Storage & Security Measures",
        paragraphs: [
          "We implement technical, physical, and administrative safeguards to protect your personal details and high-resolution master files against unauthorized access, alteration, or accidental loss.",
          "Your digital files are stored across encrypted cloud infrastructure (Cloudflare R2 and secure database backups) with strict credential controls. While no digital platform is 100% impenetrable, we adhere to industry-standard encryption protocols and continuous system updates.",
        ],
      },
      {
        id: "data-retention",
        title: "6. Data Retention & Image Archiving",
        paragraphs: [
          "We retain client contact records and booking documentation for as long as necessary to fulfill contractual obligations, tax accounting, and legal requirements.",
          "Final delivered images are typically preserved in our digital archive for a minimum of 12 months following your session. This provides peace of mind should you need replacement download links. However, we encourage all clients to download and maintain their own redundant backups upon delivery.",
        ],
      },
      {
        id: "cookies-analytics",
        title: "7. Cookies & Privacy-First Analytics",
        paragraphs: [
          "Our website uses essential cookies required for session persistence, interface preferences (such as language selection), and admin authentication.",
          "We utilize lightweight, privacy-focused analytics tools (such as OneDollarStats) that evaluate aggregate website performance without building cross-site behavioral profiles, serving third-party advertising cookies, or selling tracker data.",
        ],
      },
      {
        id: "your-rights",
        title: "8. Your Legal Rights",
        paragraphs: [
          "Depending on your jurisdiction, you possess specific rights regarding your personal information, including:",
        ],
        bullets: [
          "Access: The right to request copies of the personal information and image files we hold about you.",
          "Rectification: The right to request updates or corrections to any inaccurate contact information.",
          "Erasure: The right to request the deletion of your personal data from our active systems, subject to legal and tax retention mandates.",
          "Withdrawal of Consent: The right to revoke promotional image permissions at any time without penalty.",
        ],
      },
      {
        id: "updates-contact",
        title: "9. Policy Updates & Contact Information",
        paragraphs: [
          "We may periodically revise this Privacy Policy to reflect advancements in our technology, studio practices, or applicable laws. Any modifications will be posted here with an updated revision date.",
          "If you have questions regarding this policy, image rights, or wish to exercise any privacy rights, our studio team is always available to assist you directly.",
        ],
      },
    ],
    contactBox: {
      title: "Have questions about your privacy?",
      description:
        "We are here to answer any questions about our image handling, storage, or privacy practices.",
      buttonText: "Contact the Studio",
    },
  },
  es: {
    badge: "Privacidad y Protección de Datos",
    title: "Política de Privacidad",
    subtitle:
      "Tu confianza es el pilar de nuestro trabajo. Conoce cómo gestionamos tu información personal, los detalles de tu sesión y tus fotografías con absoluta transparencia y seguridad.",
    lastUpdated: "Marzo 2026",
    meta: {
      title: "Política de Privacidad | DnovaGallery",
      description:
        "Descubre cómo DnovaGallery protege tu información personal, derechos de imagen y galerías fotográficas privadas.",
    },
    summary: {
      title: "Tu Privacidad en Resumen",
      subtitle: "Los compromisos fundamentales que guían el cuidado de tus momentos personales:",
      points: [
        {
          title: "Tus Fotos Permanecen Privadas",
          description:
            "Nunca publicamos fotografías en nuestro portafolio o redes sociales sin tu autorización expresa o un acuerdo de cesión de imagen firmado.",
        },
        {
          title: "Cero Venta de Datos",
          description:
            "No vendemos, alquilamos ni comercializamos tu información de contacto ni notas de sesión con terceros o redes publicitarias.",
        },
        {
          title: "Galerías Seguras en la Nube",
          description:
            "Tus archivos entregados y respaldos maestros se conservan en infraestructura de almacenamiento en la nube cifrada y de alta disponibilidad.",
        },
        {
          title: "Tú Tienes el Control",
          description:
            "Puedes solicitar copias de tus datos registrados, pedir correcciones o solicitar el retiro de imágenes en cualquier momento.",
        },
      ],
    },
    tableOfContentsTitle: "Navegación Rápida",
    sections: [
      {
        id: "introduction",
        title: "1. Introducción y Compromiso del Estudio",
        paragraphs: [
          "En DnovaGallery consideramos que la fotografía excepcional va unida a un respeto inquebrantable por la privacidad personal. Al reservar una sesión de retratos, estudio o eventos con nosotros, nos confías momentos profundamente significativos de tu vida.",
          "Esta Política de Privacidad describe con claridad qué datos recopilamos, con qué propósito los tratamos, cómo protegemos tu material fotográfico y los derechos que conservas. Al navegar por nuestro sitio web o contratar nuestros servicios, aceptas las prácticas descritas en este documento.",
        ],
      },
      {
        id: "information-collected",
        title: "2. Información que Recopilamos",
        paragraphs: [
          "Recopilamos únicamente los datos indispensables para planificar tu sesión, coordinar horarios y hacer entrega de tu galería final.",
        ],
        subsections: [
          {
            title: "Información Proporcionada Directamente",
            paragraphs: [
              "Al comunicarte, agendar una cita o contratar un paquete de servicios, puedes facilitarnos:",
            ],
            bullets: [
              "Datos de contacto: Nombre completo, correo electrónico, número telefónico y dirección postal (en caso de envíos de impresiones físicas).",
              "Detalles de la sesión: Fechas solicitadas, locaciones, preferencias estéticas, nombres de participantes y requerimientos particulares.",
              "Verificación de pago: Comprobantes de transacciones gestionados a través de pasarelas de pago certificadas (nunca almacenamos los datos completos de tus tarjetas en nuestros servidores).",
              "Comunicaciones directas: Cuestionarios previos a la sesión, notas de estilo y consultas de soporte.",
            ],
          },
          {
            title: "Material Fotográfico",
            paragraphs: [
              "Durante las sesiones fotográficas producimos archivos digitales RAW y editados, videos y composiciones artísticas donde participas tú y tus acompañantes.",
            ],
          },
          {
            title: "Datos de Navegación Técnica",
            paragraphs: [
              "Al visitar nuestra plataforma web, se registran datos técnicos anónimos orientados al correcto funcionamiento del sitio (tipo de navegador, dispositivo, páginas visitadas y tiempos de carga).",
            ],
          },
        ],
      },
      {
        id: "image-rights-portfolio",
        title: "3. Derechos de Imagen y Publicación en Portafolio",
        paragraphs: [
          "Las fotografías son documentos personales sensibles. Tratamos la visibilidad pública de cada imagen con el máximo rigor ético y profesionalismo:",
        ],
        bullets: [
          "Privacidad por Defecto: Cada sesión se considera privada de manera predeterminada. Las galerías digitales de entrega disponen de accesos protegidos.",
          "Publicación en Portafolio y Redes: Aunque nos enorgullece exhibir nuestro arte, únicamente publicamos imágenes en nuestra web o redes sociales si contamos con tu consentimiento explícito o autorización de imagen.",
          "Garantía de Confidencialidad: Si por razones personales, religiosas o profesionales prefieres una sesión totalmente confidencial, lo respetamos de manera estricta y sin costos ocultos.",
          "Revocación: Si en algún momento decides retirar el consentimiento para la exhibición pública de una fotografía previamente autorizada, nos lo comunicas y la retiraremos de nuestros medios digitales.",
        ],
      },
      {
        id: "how-we-use-information",
        title: "4. Finalidad del Uso de la Información",
        paragraphs: [
          "Utilizamos los datos recopilados exclusivamente para la operación legítima de nuestro estudio fotográfico:",
        ],
        bullets: [
          "Programar, confirmar y gestionar citas, disponibilidad de estudio y logística en locación.",
          "Procesar, editar con tratamiento de color profesional y entregar las galerías digitales contratadas.",
          "Facturación, gestión de depósitos o anticipos y cumplimiento contable.",
          "Enviar avisos esenciales sobre el estado de tu sesión, contingencias climáticas o disponibilidad de descarga.",
          "Atender consultas de asesoría artística o dudas de servicio al cliente.",
        ],
      },
      {
        id: "storage-security",
        title: "5. Almacenamiento y Seguridad Digital",
        paragraphs: [
          "Adoptamos medidas técnicas y organizativas rigurosas para salvaguardar tu información y los archivos fotográficos originales ante accesos no autorizados, pérdidas o manipulaciones.",
          "Tus fotografías se conservan en infraestructura de almacenamiento en la nube con cifrado y controles de acceso restringidos (Cloudflare R2 y bases de datos seguras). Implementamos protocolos actualizados para mantener la integridad de cada archivo.",
        ],
      },
      {
        id: "data-retention",
        title: "6. Retención de Datos y Respaldo de Galerías",
        paragraphs: [
          "Conservamos tus registros de contacto y facturación durante el tiempo necesario para cumplir con obligaciones legales y fiscales.",
          "Las fotografías finales entregadas se mantienen archivadas en nuestro sistema durante un período mínimo de 12 meses tras la sesión. Esto te permite solicitar enlaces de descarga adicionales ante cualquier eventualidad. Recomendamos a todos los clientes realizar copias de seguridad propias al recibir su material.",
        ],
      },
      {
        id: "cookies-analytics",
        title: "7. Cookies y Métricas Respetuosas",
        paragraphs: [
          "Nuestro sitio web utiliza cookies técnicas indispensables para la sesión, la selección de idioma y el acceso administrativo al panel.",
          "Empleamos herramientas de analítica web ligeras (como OneDollarStats) que miden el tráfico de forma agregada sin crear perfiles de usuario invasivos, sin rastreadores publicitarios cruzados y sin venta de datos a plataformas de anuncios.",
        ],
      },
      {
        id: "your-rights",
        title: "8. Tus Derechos como Usuario",
        paragraphs: [
          "De conformidad con las leyes de protección de datos vigentes, cuentas con derechos claros sobre tu información:",
        ],
        bullets: [
          "Acceso: Solicitar confirmación de los datos e imágenes que conservamos sobre ti.",
          "Rectificación: Pedir la corrección inmediata de datos inexactos o incompletos.",
          "Supresión: Solicitar el borrado de tus datos personales e imágenes cuando ya no sean requeridos para los fines contratados.",
          "Revocación de Consentimiento: Retirar en cualquier momento la autorización de uso promocional de imágenes.",
        ],
      },
      {
        id: "updates-contact",
        title: "9. Actualizaciones y Vías de Contacto",
        paragraphs: [
          "Podemos actualizar periódicamente esta Política de Privacidad para adaptarla a mejoras técnicas, nuevos servicios o cambios legislativos. Cualquier modificación se reflejará en esta página indicando la fecha de revisión.",
          "Si deseas ejercer tus derechos, formular preguntas o resolver cualquier inquietud sobre el manejo de tus imágenes, nuestro equipo está a tu entera disposición.",
        ],
      },
    ],
    contactBox: {
      title: "¿Tienes dudas sobre tu privacidad o tus fotos?",
      description:
        "Estamos disponibles para resolver cualquier consulta sobre el resguardo de tus imágenes o tus derechos de privacidad.",
      buttonText: "Contactar al Estudio",
    },
  },
};
