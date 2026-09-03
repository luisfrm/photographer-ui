import type { LegalDocumentContent } from "./privacy-policy";

export const TERMS_AND_CONDITIONS_DATA: Record<"en" | "es", LegalDocumentContent> = {
  en: {
    badge: "Service Agreement & Terms",
    title: "Terms & Conditions",
    subtitle:
      "Transparent expectations for an extraordinary photography experience. Here are the simple, fair terms governing bookings, deliverables, and image rights.",
    lastUpdated: "March 2026",
    meta: {
      title: "Terms & Conditions | DnovaGallery",
      description:
        "Understand our booking policies, image licensing, turnaround times, and session guidelines at DnovaGallery.",
    },
    summary: {
      title: "Key Highlights at a Glance",
      subtitle: "The essential points every client should know before booking:",
      points: [
        {
          title: "Clear Reservation Policy",
          description:
            "A retainer deposit locks your calendar date. The remaining balance is payable prior to or on the day of your session.",
        },
        {
          title: "Weather & Health Flexibility",
          description:
            "Outdoor weather emergencies or illness qualify for free rescheduling with reasonable advance notice.",
        },
        {
          title: "Full Personal Print License",
          description:
            "You receive high-resolution, professionally retouched digital images with full rights for personal printing and social sharing.",
        },
        {
          title: "Reliable Turnaround",
          description:
            "Online private galleries are typically delivered within 2 to 3 weeks following your photo session.",
        },
      ],
    },
    tableOfContentsTitle: "Quick Navigation",
    sections: [
      {
        id: "agreement",
        title: "1. Agreement to Terms",
        paragraphs: [
          "These Terms and Conditions constitute a legally binding agreement between you (the &ldquo;Client&rdquo;) and DnovaGallery (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or the &ldquo;Studio&rdquo;).",
          "By scheduling an appointment, submitting a retainer deposit, or signing a photography contract, you confirm that you have read, understood, and agreed to be bound by all terms set forth herein.",
        ],
      },
      {
        id: "booking-retainer",
        title: "2. Booking, Retainers & Payment Schedule",
        paragraphs: [
          "Our calendar dates are strictly reserved on a first-confirmed basis to ensure dedicated preparation and creative focus for every client.",
        ],
        bullets: [
          "Retainer Requirement: A non-refundable retainer (typically 30% to 50% depending on the package) is required at the time of booking to secure your desired date and time slot.",
          "Calendar Reservation: Dates and studio slots are not officially held or confirmed until the retainer has cleared.",
          "Balance Payment: The remaining balance is due on or before the session date prior to the release of preview proofs or final high-resolution files.",
          "Payment Methods: We accept major credit/debit cards, bank transfers, and verified electronic payments. Applicable sales taxes are clearly indicated on invoices.",
        ],
      },
      {
        id: "rescheduling-cancellations",
        title: "3. Rescheduling, Weather Contingencies & Cancellations",
        paragraphs: [
          "We understand life is unpredictable. We strive to be compassionate, flexible, and fair whenever unforeseen circumstances arise.",
        ],
        subsections: [
          {
            title: "Client Rescheduling",
            paragraphs: [
              "If you need to change your session date, please provide at least 48 hours notice. Your retainer will transfer to a mutually agreed-upon future date within 90 days. Rescheduling requests with less than 24 hours notice may incur a modest re-booking fee to cover studio or assistant reservations.",
            ],
          },
          {
            title: "Inclement Weather for Outdoor Shoots",
            paragraphs: [
              "For outdoor sessions, light drizzle or overcast skies often yield breathtaking, soft lighting. However, in cases of severe rain, dangerous weather conditions, or extreme winds, we will reschedule the session at zero additional cost.",
            ],
          },
          {
            title: "Cancellations & Refunds",
            paragraphs: [
              "Because reserved calendar slots prevent us from taking other bookings, retainers are non-refundable upon cancellation. If the Studio must cancel due to illness, emergency, or force majeure and a reschedule cannot be accommodated, your deposit will be refunded in full immediately.",
            ],
          },
        ],
      },
      {
        id: "artistic-style-deliverables",
        title: "4. Creative Style, Editing & Deliverables",
        paragraphs: [
          "Photography is an art form driven by human vision, light, and aesthetic curation.",
        ],
        bullets: [
          "Artistic Discretion: You acknowledge that you have reviewed our portfolio and choose DnovaGallery for our distinct visual style, color grading, and composition. The final selection and artistic curation of photos rests with the photographer.",
          "Delivery Timelines: High-resolution private online galleries are typically delivered within 2 to 3 weeks (longer lead times may apply for full-day weddings or peak holiday seasons).",
          "Retouching Scope: Delivered images receive standard professional adjustments (color balance, exposure, contrast, tonal harmonization, and subtle blemish cleanup). Extensive digital manipulation, body reshaping, or complex composite requests require custom quotes.",
          "RAW Files Policy: Raw, unedited camera files are unfinished creative sketches and are never distributed under any circumstances. We deliver only completed, high-resolution JPEG files that represent our studio standards.",
        ],
      },
      {
        id: "copyright-licensing",
        title: "5. Copyright, Licensing & Personal Use",
        paragraphs: [
          "Understanding the difference between copyright and licensing ensures smooth and rewarding creative collaboration:",
        ],
        bullets: [
          "Copyright Ownership: The photographer retains exclusive copyright and authorship in all original photographs created during the session, as protected by applicable copyright law.",
          "Personal Usage License: Clients receive a perpetual, royalty-free, non-exclusive personal print and digital license. You are encouraged to print photos at any print lab, frame them, share them on personal social accounts, and distribute them to family and friends.",
          "Commercial Restrictions: Delivered images may not be sold, resold, submitted to commercial stock agencies, or used for commercial advertising by third-party vendors without prior written commercial licensing agreements.",
          "Social Media Sharing: When sharing online, tagging or crediting @DnovaGallery is appreciated, but never strictly demanded.",
        ],
      },
      {
        id: "model-release-portfolio",
        title: "6. Model Release & Portfolio Showcase",
        paragraphs: [
          "As an artistic studio, showcasing recent work inspires prospective clients and demonstrates our ongoing growth.",
          "We ask clients to execute a standard model release granting permission to feature selected photographs in our portfolio, website, and social channels. We deeply value your comfort: if you prefer strict privacy with no public display, simply let us know prior to your session and we will designate your project as confidential.",
        ],
      },
      {
        id: "client-responsibilities",
        title: "7. Client Cooperation & Punctuality",
        paragraphs: [
          "Punctuality ensures you receive the full creative coverage included in your chosen package:",
        ],
        bullets: [
          "Session Timing: Sessions begin at the agreed scheduled time. Arriving late shortens your shooting window, as subsequent bookings cannot be displaced.",
          "Location Permits: If your chosen venue requires photography permits or entry fees, the client is responsible for acquiring permissions and associated costs unless agreed otherwise in writing.",
          "Participant Cooperation: The photographer is not liable for family members, children, or pets who refuse to cooperate during scheduled shooting times, though we exercise great patience and technique to ensure an enjoyable experience.",
        ],
      },
      {
        id: "liability",
        title: "8. Limitation of Liability",
        paragraphs: [
          "We take rigorous precautions, including shooting on dual memory card slots and carrying backup camera bodies and lenses to every session.",
          "In the unlikely event that digital media is damaged, lost through technical equipment failure, or stolen through unforeseen circumstances beyond our control, the Studio's total liability is strictly limited to a full refund of all monies paid for the affected session or a complimentary re-shoot.",
        ],
      },
      {
        id: "contact-queries",
        title: "9. Questions & Clarifications",
        paragraphs: [
          "We are committed to making your photoshoot an effortless, joyful, and memorable experience. If you have any questions regarding these terms, package details, or custom arrangements, please reach out directly to our team.",
        ],
      },
    ],
    contactBox: {
      title: "Ready to plan your session?",
      description:
        "Contact us to discuss your vision, review available packages, or clarify any questions before booking.",
      buttonText: "Book Your Session",
    },
  },
  es: {
    badge: "Acuerdo de Servicios y Condiciones",
    title: "Términos y Condiciones",
    subtitle:
      "Claridad y transparencia para una experiencia fotográfica extraordinaria. Aquí encontrarás los términos justos y sencillos que rigen nuestras reservas, entregas y derechos de imagen.",
    lastUpdated: "Marzo 2026",
    meta: {
      title: "Términos y Condiciones | DnovaGallery",
      description:
        "Conoce nuestras políticas de reserva, licencias de uso, plazos de entrega y normas de sesión en DnovaGallery.",
    },
    summary: {
      title: "Puntos Clave en Resumen",
      subtitle: "Lo más importante que todo cliente debe saber antes de reservar:",
      points: [
        {
          title: "Reserva Transparente",
          description:
            "Un anticipo garantiza el bloqueo de tu fecha en nuestro calendario. El saldo restante se cancela antes o el día de la sesión.",
        },
        {
          title: "Flexibilidad por Clima y Salud",
          description:
            "Contingencias climáticas en exteriores o imprevistos de salud permiten reprogramar sin cargos adicionales con previo aviso.",
        },
        {
          title: "Licencia de Uso Personal Completa",
          description:
            "Recibes tus fotografías en alta resolución editadas profesionalmente con plena libertad para imprimirlas y compartirlas en redes sociales.",
        },
        {
          title: "Tiempos de Entrega Cumplidos",
          description:
            "Las galerías digitales privadas se entregan habitualmente en un plazo estimado de 2 a 3 semanas tras la sesión.",
        },
      ],
    },
    tableOfContentsTitle: "Navegación Rápida",
    sections: [
      {
        id: "agreement",
        title: "1. Aceptación de los Términos",
        paragraphs: [
          "Los presentes Términos y Condiciones constituyen un acuerdo vinculante entre tú (el &ldquo;Cliente&rdquo;) y DnovaGallery (el &ldquo;Estudio&rdquo; o &ldquo;nosotros&rdquo;).",
          "Al confirmar una cita, realizar el pago de un anticipo o firmar un acuerdo de servicios fotográficos, confirmas haber leído, comprendido y aceptado las condiciones descritas en este documento.",
        ],
      },
      {
        id: "booking-retainer",
        title: "2. Proceso de Reserva, Anticipos y Pagos",
        paragraphs: [
          "Gestionamos nuestras fechas con estricta exclusividad para garantizar la máxima dedicación artística a cada cliente.",
        ],
        bullets: [
          "Requisito de Anticipo (Retainer): Se requiere un anticipo (habitualmente entre el 30% y el 50% según el paquete) para asegurar formalmente el día y la franja horaria en nuestra agenda.",
          "Bloqueo de Calendario: Las fechas no se consideran reservadas hasta que el anticipo haya sido debidamente procesado.",
          "Liquidación del Saldo: El importe pendiente debe cancelarse antes o durante el día de la sesión, previo a la entrega de la galería final.",
          "Formas de Pago: Aceptamos transferencias bancarias, tarjetas de crédito/débito y pagos electrónicos autorizados. Los comprobantes reflejan de forma clara los conceptos facturados.",
        ],
      },
      {
        id: "rescheduling-cancellations",
        title: "3. Reprogramaciones, Clima y Cancelaciones",
        paragraphs: [
          "Comprendemos que surgen situaciones imprevistas. Abordamos cada caso con cercanía, empatía y sentido común.",
        ],
        subsections: [
          {
            title: "Reprogramación por Parte del Cliente",
            paragraphs: [
              "Si necesitas cambiar la fecha de tu sesión, solicitamos una notificación con al menos 48 horas de anticipación. Tu anticipo se transferirá a una nueva fecha acordada dentro de un período de 90 días. Modificaciones con menos de 24 horas de antelación pueden requerir una tarifa administrativa para cubrir compromisos de locación o asistentes.",
            ],
          },
          {
            title: "Clima Adverso en Sesiones al Aire Libre",
            paragraphs: [
              "En sesiones exteriores, los días nublados o con llovizna ligera suelen brindar una luz suave y hermosa. No obstante, ante tormentas, vientos severos o alertas climáticas que pongan en riesgo la integridad del equipo o de las personas, reprogramaremos la sesión sin costo alguno.",
            ],
          },
          {
            title: "Cancelaciones y Reembolsos",
            paragraphs: [
              "Debido a que una fecha reservada impide aceptar otras solicitudes, los anticipos no son reembolsables en caso de cancelación voluntaria del cliente. Si por fuerza mayor o enfermedad el Estudio se viera obligado a cancelar y no fuera posible reagendar, se reembolsará el 100% de los importes abonados de forma inmediata.",
            ],
          },
        ],
      },
      {
        id: "artistic-style-deliverables",
        title: "4. Estilo Creativo, Edición y Entregables",
        paragraphs: [
          "La fotografía profesional es una disciplina artística fundamentada en la composición, la luz y la curaduría estética.",
        ],
        bullets: [
          "Criterio Artístico: Al contratarnos, reconoces familiaridad con el portafolio de DnovaGallery y confías en nuestro estilo visual, tratamiento de color y sensibilidad compositiva. La selección final y edición de las fotografías es facultad del fotógrafo.",
          "Plazos de Entrega: Las galerías privadas de alta resolución se entregan entre 2 y 3 semanas posteriores a la sesión (fechas festivas o coberturas extensas de bodas pueden requerir plazos ligeramente mayores previamente informados).",
          "Alcance del Retoque: Las imágenes entregadas reciben ajustes profesionales completos (exposición, balance de blancos, contraste, colorimetría y retoques sutiles de piel). Manipulaciones digitales extremas o montajes complejos se cotizan por separado.",
          "Política sobre Archivos RAW: Los negativos digitales sin procesar (archivos RAW) son bocetos técnicos incompletos y no se entregan bajo ninguna circunstancia. Entregamos obras fotográficas acabadas en formato JPEG de máxima resolución.",
        ],
      },
      {
        id: "copyright-licensing",
        title: "5. Derechos de Autor y Licencia de Uso Personal",
        paragraphs: [
          "Distingamos de forma nítida la propiedad intelectual de la licencia de disfrute:",
        ],
        bullets: [
          "Titularidad de Autor: El fotógrafo conserva la titularidad y derechos de autor morales y patrimoniales sobre todas las obras creadas, de acuerdo con la legislación de propiedad intelectual.",
          "Licencia de Uso Personal Ilimitada: El cliente recibe una licencia de uso personal perpetua, no exclusiva y libre de regalías. Puedes imprimir copias en el laboratorio que prefieras, enmarcar cuadros, crear álbumes y compartir tus fotos libremente en tus redes personales.",
          "Uso Comercial Prohibido: Las imágenes no pueden ser vendidas, licenciadas a bancos de imágenes ni utilizadas para campañas publicitarias de marcas comerciales sin un acuerdo formal de cesión comercial.",
          "Menciones en Redes: Al compartir tus fotos en internet, etiquetar a @DnovaGallery siempre es bienvenido y apreciado.",
        ],
      },
      {
        id: "model-release-portfolio",
        title: "6. Autorización de Imagen y Portafolio",
        paragraphs: [
          "Como estudio creativo, compartir sesiones recientes nos permite dar a conocer nuestro trabajo a nuevas personas interesadas.",
          "Solicitamos a nuestros clientes una autorización de cesión de imagen no exclusiva para incluir selecciones en nuestro portafolio digital, página web o redes sociales. Si prefieres privacidad total y confidencialidad estricta, infórmanos con antelación y tu sesión permanecerá 100% privada.",
        ],
      },
      {
        id: "client-responsibilities",
        title: "7. Puntualidad y Cooperación del Cliente",
        paragraphs: [
          "El trabajo conjunto y la puntualidad aseguran el máximo aprovechamiento del tiempo contratado:",
        ],
        bullets: [
          "Puntualidad: La sesión comienza a la hora acordada. Llegadas tardías reducen el tiempo disponible de toma fotográfica para no afectar citas posteriores.",
          "Permisos de Locación: Si eliges una locación privada que exija permisos fotográficos o tarifas de acceso, la gestión y costos correspondientes son responsabilidad del cliente.",
          "Colaboración: Haremos todo lo posible con paciencia y empatía para guiar a todos los participantes; sin embargo, no nos hacemos responsables por la falta de cooperación de niños pequeños o mascotas durante el tiempo de sesión.",
        ],
      },
      {
        id: "liability",
        title: "8. Limitación de Responsabilidad",
        paragraphs: [
          "Trabajamos con equipos fotográficos profesionales de última generación, grabación simultánea en doble tarjeta de memoria y cuerpos de cámara de respaldo en cada cobertura.",
          "En el improbable caso de daño catastrófico de tarjetas, robo o fuerza mayor ajena al control razonable del Estudio, nuestra responsabilidad económica se limitará estrictamente al reembolso total del dinero pagado por la sesión o a la realización de una sesión de reemplazo sin costo.",
        ],
      },
      {
        id: "contact-queries",
        title: "9. Dudas y Preguntas Frecuentes",
        paragraphs: [
          "Deseamos que tu experiencia fotográfica sea inolvidable, relajada y enriquecedora. Si tienes dudas respecto a cualquiera de estas cláusulas o requieres condiciones personalizadas para tu proyecto, contáctanos con total confianza.",
        ],
      },
    ],
    contactBox: {
      title: "¿Listo para dar vida a tus recuerdos?",
      description:
        "Escríbenos para consultar fechas disponibles, detalles de paquetes o conversar sobre tu próxima sesión fotográfica.",
      buttonText: "Reservar una Sesión",
    },
  },
};
