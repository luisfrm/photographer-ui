export type CmsField = { id: string; label: string; type: 'text' | 'textarea' | 'image' | 'richtext' | 'gallery' | 'list' }
export type CmsSection = { id: string; title: string; fields: CmsField[] }
export type CmsPage = { id: string; title: string; sections: CmsSection[] }

export const CMS_PAGES: CmsPage[] = [
  {
    id: 'home',
    title: 'Home',
    sections: [
      { id: 'hero', title: 'Hero', fields: [
        { id: 'title', label: 'Title', type: 'text' },
        { id: 'subtitle', label: 'Subtitle', type: 'text' },
        { id: 'ctaLabel', label: 'CTA Label', type: 'text' },
        { id: 'heroImage', label: 'Hero Image', type: 'image' },
      ]},
      { id: 'about', title: 'About', fields: [
        { id: 'heading', label: 'Heading', type: 'text' },
        { id: 'body', label: 'Body', type: 'textarea' },
      ]},
      { id: 'services', title: 'Services', fields: [
        { id: 'intro', label: 'Intro', type: 'text' },
        { id: 'items', label: 'Items', type: 'list' },
      ]},
      { id: 'gallery', title: 'Gallery', fields: [
        { id: 'images', label: 'Images', type: 'gallery' },
      ]},
      { id: 'pricing', title: 'Pricing', fields: [
        { id: 'plans', label: 'Plans', type: 'list' },
      ]},
      { id: 'testimonials', title: 'Testimonials', fields: [
        { id: 'entries', label: 'Entries', type: 'list' },
      ]},
      { id: 'contact', title: 'Contact', fields: [
        { id: 'headline', label: 'Headline', type: 'text' },
        { id: 'address', label: 'Address', type: 'textarea' },
        { id: 'email', label: 'Email', type: 'text' },
        { id: 'phone', label: 'Phone', type: 'text' },
      ]},
    ],
  },
  { id: 'about', title: 'About', sections: [
    { id: 'main', title: 'Main', fields: [
      { id: 'heading', label: 'Heading', type: 'text' },
      { id: 'body', label: 'Body', type: 'richtext' },
    ]},
  ]},
  { id: 'services', title: 'Services', sections: [
    { id: 'main', title: 'Main', fields: [
      { id: 'intro', label: 'Intro', type: 'text' },
      { id: 'items', label: 'Items', type: 'list' },
    ]},
  ]},
  { id: 'gallery', title: 'Gallery', sections: [
    { id: 'main', title: 'Main', fields: [
      { id: 'images', label: 'Images', type: 'gallery' },
    ]},
  ]},
  { id: 'pricing', title: 'Pricing', sections: [
    { id: 'plans', title: 'Plans', fields: [
      { id: 'plans', label: 'Plans', type: 'list' },
    ]},
  ]},
  { id: 'testimonials', title: 'Testimonials', sections: [
    { id: 'main', title: 'Main', fields: [
      { id: 'entries', label: 'Entries', type: 'list' },
    ]},
  ]},
  { id: 'contact', title: 'Contact', sections: [
    { id: 'main', title: 'Main', fields: [
      { id: 'headline', label: 'Headline', type: 'text' },
      { id: 'address', label: 'Address', type: 'textarea' },
      { id: 'email', label: 'Email', type: 'text' },
      { id: 'phone', label: 'Phone', type: 'text' },
    ]},
  ]},
  { id: 'privacy-policy', title: 'Privacy Policy', sections: [
    { id: 'content', title: 'Content', fields: [
      { id: 'body', label: 'Body', type: 'richtext' },
    ]},
  ]},
  { id: 'terms-and-conditions', title: 'Terms and Conditions', sections: [
    { id: 'content', title: 'Content', fields: [
      { id: 'body', label: 'Body', type: 'richtext' },
    ]},
  ]},
]


