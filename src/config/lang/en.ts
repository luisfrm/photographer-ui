import { SiteContent } from "./types";

export const en: SiteContent = {
  nav: [
    { name: "Packages", href: "/en/services" },
    { name: "About Us", href: "/en/about" },
    { name: "Contact", href: "/en/contact" },
  ],

  hero: {
    title: "DnovaGallery",
    subtitle:
      "It's not the <strong>camera</strong> who makes the photographer, it's the <strong>photographer</strong> who makes the camera.",
    cta: "Book a session",
  },

  about: {
    title: "About me",
    paragraphs: [
      "I'm a passionate photographer based in London, specializing in premium portrait and wedding photography. With over 8 years of experience, I capture the essence of every moment with an artistic eye and professional approach.",
      "My work focuses on creating timeless, elegant images that tell your unique story. Every session is tailored to reflect your personality and style, ensuring memories that last a lifetime.",
    ],
    cta: "View My Work",
  },

  pricing: {
    title: "Services",
    packages: [
      {
        name: "Premium Package",
        price: "$100",
        description: "10 edited photos",
        features: [
          "Duration: 1 hour",
          "2 outfit changes",
          "1 Professional backdrop",
          "Complete professional editing",
          "Private online gallery",
        ],
        cta: "Get In Touch",
      },
      {
        name: "Standard Package",
        price: "$75",
        description: "8 edited photos",
        features: [
          "Duration: 1 hour",
          "1 outfit change",
          "Basic editing",
          "Digital delivery",
          "Online gallery",
        ],
        cta: "Get In Touch",
      },
      {
        name: "Add-ons",
        price: "$8",
        description: "Per additional photo",
        features: [
          "Additional edited photos",
          "Extra outfit change: +$25",
          "Additional backdrop: +$20",
          "Premium editing: +$15/photo",
          "Physical prints available",
        ],
        cta: "Get In Touch",
      },
    ],
  },

  contact: {
    title: "Contact us",
    subtitle:
      "Do you have a question or want to book a session? We'd love to hear from you!",
    form: {
      name: "Full name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      message: "Message",
      messagePlaceholder: "Tell us about your project or question...",
      submit: "Send message",
      loading: "Sending...",
      success: "Message sent!",
      error: "Error sending",
    },
    directContact: "You can also contact us directly:",
    email: "info@dnovagallery.com",
    phone: "+1 (555) 123-4567",
  },

  footer: {
    tagline: "Capturing moments, creating memories.",
    contactTitle: "Contact",
    socialTitle: "Follow us",
    copyright: "© 2025 Darianny Salas. All rights reserved.",
    developedBy: "Developed by",
  },

  widgets: {
    whatsappMessage:
      "Hello! I would like to get more information about your photography services.",
    whatsappLabel: "Contact via WhatsApp",
    whatsappTooltip: "Chat with me!",
    instagramLabel: "Follow me on Instagram",
    instagramTooltip: "Follow me on Instagram",
    scrollTopLabel: "Back to top",
    scrollTopTooltip: "Back to top",
  },

  mobileNav: {
    menuTitle: "Menu",
    cta: "Book Now",
    helpText: "Need help?",
    helpEmail: "contact@rivasdigital.com",
  },
};
