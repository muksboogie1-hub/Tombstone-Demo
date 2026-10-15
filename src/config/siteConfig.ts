/**
 * Centralized Site and Business Configuration
 * 
 * Governs all contact points, business credentials,
 * and communication channels for Velquarath Stoneworks.
 */

export interface SiteConfig {
  brandName: string;
  tagline: string;
  taglineNotice: string;
  isDemoMode: boolean;
  announcementText: string;

  // Contact Channels
  contact: {
    // WhatsApp configuration
    whatsAppNumberDigits: string;
    whatsAppDisplayNumber: string;
    whatsAppDefaultGreeting: string;

    // Direct Voice & Email
    telephoneDisplay: string;
    telephoneRaw: string;
    email: string;

    // Physical & Operating Presence
    physicalAddress: string;
    city: string;
    country: string;
    operatingHours: string;
    serviceArea: string;

    // Social Media Links
    socials: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  };

  // Email submission endpoint configuration
  emailService: {
    endpoint: string;
    web3formsAccessKey: string;
    isConfigured: boolean;
    providerName: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  brandName: "VELQUARATH STONEWORKS",
  tagline: "Crafted in Stone. Remembered Forever.",
  taglineNotice: "",
  isDemoMode: false,
  announcementText:
    "Natural Zimbabwean Black Granite · Memorial Consultations & Nationwide Installation Across Zimbabwe · Direct WhatsApp: +263 78 696 7793",

  contact: {
    // Verified testing WhatsApp Number
    whatsAppNumberDigits: "263786967793",
    whatsAppDisplayNumber: "+263 78 696 7793",
    whatsAppDefaultGreeting:
      "Hello, I would like to enquire about your stonework and memorial services in Zimbabwe.",

    telephoneDisplay: "+263 78 696 7793",
    telephoneRaw: "+263786967793",
    email: "muksboogie1@gmail.com",

    physicalAddress: "Enterprise Road / Samora Machel Corridor",
    city: "Harare",
    country: "Zimbabwe",
    operatingHours: "Monday – Friday: 08:00 – 17:00 | Saturday: 08:30 – 13:00",
    serviceArea: "Harare, Bulawayo, Mutare, Gweru, Masvingo & Nationwide Zimbabwe",

    socials: {
      facebook: "https://facebook.com/velquarathstoneworks",
      instagram: "https://instagram.com/velquarathstoneworks",
      linkedin: "https://linkedin.com/company/velquarath-stoneworks",
    },
  },

  emailService: {
    endpoint: "/api/inquiries",
    web3formsAccessKey: "38e4a51c-1dd7-46f8-a10a-75a4f23875fd",
    isConfigured: true,
    providerName: "Direct Inquiry Dispatch (muksboogie1@gmail.com)",
  },
};

/**
 * Helper to generate official WhatsApp click-to-chat URL
 * strictly adhering to https://wa.me/INTERNATIONALNUMBER?text=ENCODED_TEXT
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const digits = SITE_CONFIG.contact.whatsAppNumberDigits.replace(/[^0-9]/g, "");
  const text = customMessage || SITE_CONFIG.contact.whatsAppDefaultGreeting;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Helper to generate WhatsApp URL for a specific product
 * Uses the requested format:
 * "Hello, I'm interested in the [Product Name]. Could you please provide more details and a quotation?"
 */
export function getProductWhatsAppUrl(productName: string, _category?: string): string {
  const message = `Hello, I'm interested in the ${productName}. Could you please provide more details and a quotation?`;
  return getWhatsAppUrl(message);
}
