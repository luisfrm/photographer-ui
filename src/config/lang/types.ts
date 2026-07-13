export interface NavItem {
  name: string;
  href: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
  cta: string;
}

export interface ServicesContent {
  title: string;
  items: {
    title: string;
    features: string[];
    cta: string;
  }[];
}

export interface PricingContent {
  title: string;
  packages: {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
  }[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  form: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    loading: string;
    success: string;
    error: string;
  };
  directContact: string;
  email: string;
  phone: string;
}

export interface FooterContent {
  tagline: string;
  contactTitle: string;
  socialTitle: string;
  copyright: string;
  developedBy: string;
}

export interface WidgetsContent {
  whatsappMessage: string;
  whatsappLabel: string;
  whatsappTooltip: string;
  instagramLabel: string;
  instagramTooltip: string;
  scrollTopLabel: string;
  scrollTopTooltip: string;
}

export interface MobileNavContent {
  menuTitle: string;
  cta: string;
  helpText: string;
  helpEmail: string;
}

export interface SiteContent {
  nav: NavItem[];
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  pricing: PricingContent;
  contact: ContactContent;
  footer: FooterContent;
  widgets: WidgetsContent;
  mobileNav: MobileNavContent;
}
