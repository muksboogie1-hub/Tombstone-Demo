import { ImageDisplaySettings } from '../utils/imageStyles';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'Tombstones' | 'Countertops & Tables' | 'Window Sills';
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  imageAlt: string;
  imageAttribution: {
    photographer: string;
    source: string;
    license: string;
    modifications: string;
  };
  specifications: {
    heading?: string;
    finish: string;
    materialOptions: string;
    edgeProfile?: string;
    sizingNote: string;
  };
  featured: boolean;
  imageSettings?: ImageDisplaySettings;
}

export const DEFAULT_SPECIFICATIONS = {
  heading: 'Craftsmanship & Specifications',
  materialOptions: 'Grey Granite, Zimbabwe Black, Light Granite',
  finish: 'Fine honed matte or full high-gloss polish',
  sizingNote: 'Available in standard cemetery regulatory heights. Contact us to discuss available options.',
};

export const PRODUCTS: Product[] = [
  // --- TOMBSTONES & MEMORIALS ---
  {
    id: 'ts-01',
    slug: 'three-step-memorial-cross-head',
    name: 'Three-Step Memorial with Cross Head',
    category: 'Tombstones',
    shortDescription: 'A layered memorial design featuring a cross-shaped headstone set upon tiered stone bases.',
    longDescription:
      'A dignified and respectful memorial concept featuring a three-tiered base platform supporting an upright cross-shaped headstone. Designed to accommodate respectful inscription lettering and optional side vases. Illustrative concept for family memorial planning.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Tiered upright stone memorial in a tranquil cemetery setting',
    imageAttribution: {
      photographer: 'Annie Spratt',
      source: 'Unsplash (Photo ID 1544717305)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Aspect crop and color balance for editorial tone',
    },
    specifications: {
      finish: 'Polished face with honed kerb borders',
      materialOptions: 'Zimbabwe Black Granite, Impala Grey, Rustenburg Granite',
      sizingNote: 'Standard single plot dimensions or bespoke family plot sizes available upon consultation.',
    },
    featured: true,
    imageSettings: {
      zoom: 100,
      posX: 50,
      posY: 50,
      fit: 'contain',
    },
  },
  {
    id: 'ts-02',
    slug: 'polished-granite-monument',
    name: 'Polished Black Granite Memorial',
    category: 'Tombstones',
    shortDescription: 'A contemporary memorial concept with a deep reflective polished stone finish.',
    longDescription:
      'Engineered with clean architectural lines, this polished black granite memorial honors enduring memory with understated dignity. Features a spacious inscription area suitable for gold leaf or sandblasted lettering.',
    imageUrl: 'https://images.unsplash.com/photo-1596280459345-42cf6ee2a106?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Polished black granite gravestone monolith with clean reflective edges',
    imageAttribution: {
      photographer: 'David Billings',
      source: 'Unsplash (Photo ID 1596280459345)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Digital contrast adjustment and crop',
    },
    specifications: {
      finish: 'Mirror-polished headstone with textured contrast base',
      materialOptions: 'High-density Black Granite, Charcoal Pearl',
      sizingNote: 'Single headstone with matching sub-base. Contact us to discuss available options.',
    },
    featured: true,
    imageSettings: {
      zoom: 135,
      posX: 50,
      posY: 22,
      fit: 'cover',
    },
  },
  {
    id: 'ts-03',
    slug: 'arch-top-classic-headstone',
    name: 'Arch-Top Classical Headstone',
    category: 'Tombstones',
    shortDescription: 'A timeless arched silhouette honoring traditional commemorative craftsmanship.',
    longDescription:
      'A graceful arched crown headstone evoking classic stonemasonry heritage. The soft curve softens the stone mass while providing optimal surface area for commemorative poetry, family dates, and motifs.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Classic arched headstone standing respectfully in green memorial grounds',
    imageAttribution: {
      photographer: 'Tingey Injury Law Firm',
      source: 'Unsplash (Photo ID 1589829545856)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Editorial grade and crop',
    },
    specifications: {
      finish: 'Fine honed matte or full high-gloss polish',
      materialOptions: 'Grey Granite, Zimbabwe Black, Light Granite',
      sizingNote: 'Available in standard cemetery regulatory heights. Contact us to discuss available options.',
    },
    featured: false,
  },
  {
    id: 'ts-04',
    slug: 'full-kerb-set-memorial',
    name: 'Full Kerb-Set Ledger Memorial',
    category: 'Tombstones',
    shortDescription: 'A comprehensive memorial enclosure with perimeter kerb stones and central cover slab.',
    longDescription:
      'A full kerb memorial encompassing the entire grave plot. Includes heavy perimeter granite kerbs, an integrated headstone pedestal, and an optional solid granite cover slab or marble-chip bed.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Historical and dignified stone monument enclosure set in natural daylight',
    imageAttribution: {
      photographer: 'Matteo Vistosi',
      source: 'Unsplash (Photo ID 1518709268805)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Standard crop and tone curves',
    },
    specifications: {
      finish: 'Honed or polished granite kerbs with matching ledger slab',
      materialOptions: 'Zimbabwe Black Granite, African Red, Rustenburg',
      sizingNote: 'Configured strictly according to local cemetery plot regulations.',
    },
    featured: true,
  },
  {
    id: 'ts-05',
    slug: 'serpentine-book-memorial',
    name: 'Open Book Scroll Memorial',
    category: 'Tombstones',
    shortDescription: 'A sculpted open-book memorial concept for dual inscriptions and family tributes.',
    longDescription:
      'A sculpted stone book headstone symbolizing the completed chapters of a life well-lived. The dual pages provide natural symmetry for partner memorials or extended family memorial tributes.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Crafted stone monument detail with sculpted contours and timeless texture',
    imageAttribution: {
      photographer: 'Patrick Federi',
      source: 'Unsplash (Photo ID 1509198397868)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Crop and luminance adjustment',
    },
    specifications: {
      finish: 'Hand-shaped contoured face with polished book edges',
      materialOptions: 'Zimbabwe Black Granite, White Marble, Grey Granite',
      sizingNote: 'Contact us to discuss available options and resting base sizes.',
    },
    featured: false,
  },

  // --- COUNTERTOPS & TABLES ---
  {
    id: 'ct-01',
    slug: 'granite-kitchen-countertop-slab',
    name: 'Granite Kitchen Countertop',
    category: 'Countertops & Tables',
    shortDescription: 'A stone countertop concept suitable for kitchen design inspiration.',
    longDescription:
      'A solid natural stone kitchen worktop with exceptional thermal tolerance and scratch resilience. Precision-cut for undermount sinks, cooktop apertures, and custom backsplash risers.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Modern kitchen island featuring elegant polished dark granite countertop',
    imageAttribution: {
      photographer: 'RArchitecture',
      source: 'Unsplash (Photo ID 1600585154340)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Cropped for architectural showcase',
    },
    specifications: {
      finish: 'Mirror gloss polish or subtle leathered satin',
      materialOptions: 'Zimbabwe Black Granite, Calacatta-pattern Stone, Pearl Blue',
      edgeProfile: 'Pencil edge, bevel edge, or laminated full bullnose',
      sizingNote: 'Templated and fabricated to bespoke kitchen cabinet drawings.',
    },
    featured: true,
  },
  {
    id: 'ct-02',
    slug: 'waterfall-island-countertop',
    name: 'Waterfall Edge Island Countertop',
    category: 'Countertops & Tables',
    shortDescription: 'A striking stone island with continuous stone cascading to the floor.',
    longDescription:
      'An architectural centerpiece featuring continuous mitred stone joints where the horizontal surface cascades vertically to the floor. Creates a sculptural monolithic presence in modern dining and living spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Contemporary open kitchen with waterfall edge natural stone island',
    imageAttribution: {
      photographer: 'RArchitecture',
      source: 'Unsplash (Photo ID 1600565193348)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Refined contrast and architectural framing',
    },
    specifications: {
      finish: 'High-polish or honed matte',
      materialOptions: 'Black Granite, Veined Quartzite, Composite Marble',
      edgeProfile: '45-degree mitred waterfall drop',
      sizingNote: 'Custom fabricated per site measurements and structural support checks.',
    },
    featured: true,
  },
  {
    id: 'ct-03',
    slug: 'outdoor-granite-patio-table',
    name: 'Solid Stone Dining Table & Bench Set',
    category: 'Countertops & Tables',
    shortDescription: 'A weather-resistant stone table concept engineered for verandahs and patios.',
    longDescription:
      'Heavyweight outdoor stone dining furniture crafted to withstand Zimbabwe sun and seasonal rain without warping, fading, or peeling. Built with solid stone pedestal bases and rounded safety corners.',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Solid stone table surface with natural organic texture and clean finish',
    imageAttribution: {
      photographer: 'Nathan Fertig',
      source: 'Unsplash (Photo ID 1533090161767)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Color grading and crop',
    },
    specifications: {
      finish: 'Thermal flamed or honed satin finish for slip resistance',
      materialOptions: 'Grey Granite, Rustenburg Stone, Zimbabwe Black',
      edgeProfile: 'Eased edge with rounded corners',
      sizingNote: '6-seater, 8-seater, or custom banquet proportions.',
    },
    featured: false,
  },
  {
    id: 'ct-04',
    slug: 'vanity-top-undermount',
    name: 'Bathroom Vanity Stone Top',
    category: 'Countertops & Tables',
    shortDescription: 'Refined natural stone vanity slab with precision undermount sink basin cutout.',
    longDescription:
      'A moisture-sealed stone top for master ensuites and guest powder rooms. Water-repellent sealants preserve stone luster while resisting everyday soap stains and cosmetic blemishes.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Luxury bathroom vanity with polished stone surface and modern basin',
    imageAttribution: {
      photographer: 'Christian Mackie',
      source: 'Unsplash (Photo ID 1584622650111)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Cropped and balanced',
    },
    specifications: {
      finish: 'Polished face with sealed water-resistant coat',
      materialOptions: 'White Granite, Zimbabwe Black, Light Travertine Look',
      edgeProfile: 'Half bullnose or polished flat edge with bevel',
      sizingNote: 'Cut to fit single or double basin vanity cabinetry.',
    },
    featured: false,
  },

  // --- WINDOW SILLS ---
  {
    id: 'ws-01',
    slug: 'polished-granite-window-sill',
    name: 'Window Sill in Polished Stone',
    category: 'Window Sills',
    shortDescription: 'A clean-lined window sill concept featuring a refined stone finish.',
    longDescription:
      'Engineered to protect building facades and interior reveals against rainwater ingress and sun degradation. Delivers an enduring, maintenance-free architectural finish that outlasts painted timber or concrete.',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Architectural window detail showcasing smooth polished dark stone sill',
    imageAttribution: {
      photographer: 'RArchitecture',
      source: 'Unsplash (Photo ID 1600585152220)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Architectural framing and tone balance',
    },
    specifications: {
      finish: 'High-polish face and front edge, sawn underside',
      materialOptions: 'Zimbabwe Black Granite, Charcoal Grey, Impala',
      edgeProfile: 'Chamfered front drip groove / eased edge',
      sizingNote: 'Standard 20mm and 30mm thicknesses; length cut to precise window reveals.',
    },
    featured: true,
  },
  {
    id: 'ws-02',
    slug: 'bullnose-exterior-granite-sill',
    name: 'Exterior Bullnose Sill with Drip Groove',
    category: 'Window Sills',
    shortDescription: 'An exterior stone sill designed with a rounded bullnose edge and water drip recess.',
    longDescription:
      'Constructed specifically for exterior weatherproofing on residential homes and commercial developments. An integrated under-edge drip groove redirects rainwater away from brickwork, preventing wall staining.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Detail of modern stone window trim and architectural sill masonry',
    imageAttribution: {
      photographer: 'Federico Respini',
      source: 'Unsplash (Photo ID 1513694203232)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Selective tone adjustment and crop',
    },
    specifications: {
      finish: 'Weather-sealed honed or polished exterior face',
      materialOptions: 'Dark Granite, Zimbabwe Black',
      edgeProfile: 'Full Bullnose or Half Bullnose with under-edge water channel',
      sizingNote: 'Lengths up to 2.4m single spans or multi-piece matched runs.',
    },
    featured: false,
  },
  {
    id: 'ws-03',
    slug: 'honed-interior-threshold-sill',
    name: 'Honed Interior Sill & Low Reveal Slab',
    category: 'Window Sills',
    shortDescription: 'A smooth, low-sheen stone sill ideal for deep interior window benches and reveals.',
    longDescription:
      'Provides a tactile, glare-free finish suitable for deep interior window embrasures, plant shelves, and living room picture windows. Resistant to indoor UV fading and pot-plant moisture rings.',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab32f?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Sunlit interior window sill ledge highlighting fine stone masonry craftsmanship',
    imageAttribution: {
      photographer: 'Spacejoy',
      source: 'Unsplash (Photo ID 1502005229762)',
      license: 'Unsplash Free Commercial License',
      modifications: 'Cropped and luminance adjusted',
    },
    specifications: {
      finish: 'Silky smooth matte honed finish',
      materialOptions: 'Zimbabwe Black Granite, Light Grey Granite',
      edgeProfile: 'Micro-bevel pencil edge',
      sizingNote: 'Bespoke depth and length fabricated to architectural schedule.',
    },
    featured: false,
  },
];
