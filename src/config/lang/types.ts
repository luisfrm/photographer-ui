export interface NavItem {
  name: string;
  href: string;
}

export interface StaticHeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
  cta: string;
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
  hero: StaticHeroContent;
  about: AboutContent;
  pricing: PricingContent;
  contact: ContactContent;
  widgets: WidgetsContent;
  mobileNav: MobileNavContent;
}
