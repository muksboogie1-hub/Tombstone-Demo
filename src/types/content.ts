import { Product as BaseProduct } from '../data/products';

export interface Product extends BaseProduct {
  priceDisplayMode?: 'quotation_only' | 'fixed_price' | 'starting_from';
  priceAmount?: number | null;
  priceCurrency?: 'USD' | 'ZiG' | string;
  priceNote?: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface AnnouncementContent {
  text: string;
  linkText: string;
  linkUrl: string;
  enabled: boolean;
}

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  whatsappButtonText: string;
  backgroundImageUrl?: string;
  heroImageUrl?: string;
  imageAlt?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  philosophyBadge: string;
  philosophyTitle: string;
  philosophyP1: string;
  philosophyP2: string;
  standardsBadge: string;
  standardsTitle: string;
  standardsIntro: string;
  standardsPoint1: string;
  standardsPoint2: string;
  standardsPoint3: string;
  standardsPoint4: string;
}

export interface CategoriesContent {
  badge: string;
  title: string;
  tombstonesHeading: string;
  tombstonesDescription: string;
  countertopsHeading: string;
  countertopsDescription: string;
  windowSillsHeading: string;
  windowSillsDescription: string;
}

export interface CraftsmanshipContent {
  badge: string;
  title: string;
  subtitle: string;
  p1: string;
  p2: string;
  highlightNotice: string;
}

export interface GalleryContent {
  title: string;
  subtitle: string;
  allFilterLabel: string;
  tombstonesFilterLabel: string;
  countertopsFilterLabel: string;
  windowSillsFilterLabel: string;
}

export interface ContactContent {
  telephoneDisplay: string;
  telephoneRaw: string;
  whatsappDisplay: string;
  whatsappDigits: string;
  whatsappGreeting: string;
  email: string;
  physicalAddress: string;
  city: string;
  country: string;
  operatingHours: string;
  serviceArea: string;
}

export interface FooterContent {
  brandStatement: string;
  copyrightNotice: string;
  assuranceHeading: string;
  assuranceIntro: string;
}

export interface WebsiteContent {
  announcement: AnnouncementContent;
  hero: HeroContent;
  about: AboutContent;
  categories: CategoriesContent;
  craftsmanship: CraftsmanshipContent;
  gallery: GalleryContent;
  contact: ContactContent;
  footer: FooterContent;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'administrator' | 'editor';
  isActive: boolean;
  createdAt?: string;
}

export interface ContentRecord {
  key: string;
  section: string;
  value: any;
  is_published?: boolean;
  updated_at?: string;
  updated_by?: string;
}
