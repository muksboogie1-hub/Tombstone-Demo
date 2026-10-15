-- ============================================================================
-- VELQUARATH STONEWORKS: DETERMINISTIC SEED SCRIPT
-- Contains all 12 verified products and default website content.
-- Idempotent: Uses ON CONFLICT DO NOTHING to never destroy existing data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED ALL 12 VERIFIED PRODUCTS FROM src/data/products.ts
-- ----------------------------------------------------------------------------

-- Product 1: Three-Step Memorial with Cross Head
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ts-01',
  'three-step-memorial-cross-head',
  'Three-Step Memorial with Cross Head',
  'Tombstones',
  'A layered memorial design featuring a cross-shaped headstone set upon tiered stone bases.',
  'A dignified and respectful memorial concept featuring a three-tiered base platform supporting an upright cross-shaped headstone. Designed to accommodate respectful inscription lettering and optional side vases. Illustrative concept for family memorial planning.',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
  'Tiered upright stone memorial in a tranquil cemetery setting',
  '{"photographer": "Annie Spratt", "source": "Unsplash (Photo ID 1544717305)", "license": "Unsplash Free Commercial License", "modifications": "Aspect crop and color balance for editorial tone"}'::jsonb,
  '{"finish": "Polished face with honed kerb borders", "materialOptions": "Zimbabwe Black Granite, Impala Grey, Rustenburg Granite", "sizingNote": "Standard single plot dimensions or bespoke family plot sizes available upon consultation."}'::jsonb,
  true,
  'quotation_only',
  null,
  'USD',
  'Quotation upon cemetery dimension verification',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 2: Polished Black Granite Memorial
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ts-02',
  'polished-granite-monument',
  'Polished Black Granite Memorial',
  'Tombstones',
  'A contemporary memorial concept with a deep reflective polished stone finish.',
  'Engineered with clean architectural lines, this polished black granite memorial honors enduring memory with understated dignity. Features a spacious inscription area suitable for gold leaf or sandblasted lettering.',
  'https://images.unsplash.com/photo-1596280459345-42cf6ee2a106?auto=format&fit=crop&q=80&w=1200',
  'Polished black granite gravestone monolith with clean reflective edges',
  '{"photographer": "David Billings", "source": "Unsplash (Photo ID 1596280459345)", "license": "Unsplash Free Commercial License", "modifications": "Digital contrast adjustment and crop"}'::jsonb,
  '{"finish": "Mirror-polished headstone with textured contrast base", "materialOptions": "High-density Black Granite, Charcoal Pearl", "sizingNote": "Single headstone with matching sub-base. Contact us to discuss available options."}'::jsonb,
  true,
  'quotation_only',
  null,
  'USD',
  'Quotation upon cemetery dimension verification',
  2,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 3: Arch-Top Classical Headstone
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ts-03',
  'arch-top-classic-headstone',
  'Arch-Top Classical Headstone',
  'Tombstones',
  'A timeless arched silhouette honoring traditional commemorative craftsmanship.',
  'A graceful arched crown headstone evoking classic stonemasonry heritage. The soft curve softens the stone mass while providing optimal surface area for commemorative poetry, family dates, and motifs.',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
  'Classic arched headstone standing respectfully in green memorial grounds',
  '{"photographer": "Tingey Injury Law Firm", "source": "Unsplash (Photo ID 1589829545856)", "license": "Unsplash Free Commercial License", "modifications": "Editorial grade and crop"}'::jsonb,
  '{"finish": "Fine honed matte or full high-gloss polish", "materialOptions": "Grey Granite, Zimbabwe Black, Light Granite", "sizingNote": "Available in standard cemetery regulatory heights. Contact us to discuss available options."}'::jsonb,
  false,
  'quotation_only',
  null,
  'USD',
  'Quotation upon cemetery dimension verification',
  3,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 4: Full Kerb-Set Ledger Memorial
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ts-04',
  'full-kerb-set-memorial',
  'Full Kerb-Set Ledger Memorial',
  'Tombstones',
  'A comprehensive memorial enclosure with perimeter kerb stones and central cover slab.',
  'A full kerb memorial encompassing the entire grave plot. Includes heavy perimeter granite kerbs, an integrated headstone pedestal, and an optional solid granite cover slab or marble-chip bed.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
  'Historical and dignified stone monument enclosure set in natural daylight',
  '{"photographer": "Matteo Vistosi", "source": "Unsplash (Photo ID 1518709268805)", "license": "Unsplash Free Commercial License", "modifications": "Standard crop and tone curves"}'::jsonb,
  '{"finish": "Honed or polished granite kerbs with matching ledger slab", "materialOptions": "Zimbabwe Black Granite, African Red, Rustenburg", "sizingNote": "Configured strictly according to local cemetery plot regulations."}'::jsonb,
  true,
  'quotation_only',
  null,
  'USD',
  'Quotation upon cemetery dimension verification',
  4,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 5: Open Book Scroll Memorial
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ts-05',
  'serpentine-book-memorial',
  'Open Book Scroll Memorial',
  'Tombstones',
  'A sculpted open-book memorial concept for dual inscriptions and family tributes.',
  'A sculpted stone book headstone symbolizing the completed chapters of a life well-lived. The dual pages provide natural symmetry for partner memorials or extended family memorial tributes.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
  'Crafted stone monument detail with sculpted contours and timeless texture',
  '{"photographer": "Patrick Federi", "source": "Unsplash (Photo ID 1509198397868)", "license": "Unsplash Free Commercial License", "modifications": "Crop and luminance adjustment"}'::jsonb,
  '{"finish": "Hand-shaped contoured face with polished book edges", "materialOptions": "Zimbabwe Black Granite, White Marble, Grey Granite", "sizingNote": "Contact us to discuss available options and resting base sizes."}'::jsonb,
  false,
  'quotation_only',
  null,
  'USD',
  'Quotation upon stone selection',
  5,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 6: Granite Kitchen Countertop
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ct-01',
  'granite-kitchen-countertop-slab',
  'Granite Kitchen Countertop',
  'Countertops & Tables',
  'A stone countertop concept suitable for kitchen design inspiration.',
  'A solid natural stone kitchen worktop with exceptional thermal tolerance and scratch resilience. Precision-cut for undermount sinks, cooktop apertures, and custom backsplash risers.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  'Modern kitchen island featuring elegant polished dark granite countertop',
  '{"photographer": "RArchitecture", "source": "Unsplash (Photo ID 1600585154340)", "license": "Unsplash Free Commercial License", "modifications": "Cropped for architectural showcase"}'::jsonb,
  '{"finish": "Mirror gloss polish or subtle leathered satin", "materialOptions": "Zimbabwe Black Granite, Calacatta-pattern Stone, Pearl Blue", "edgeProfile": "Pencil edge, bevel edge, or laminated full bullnose", "sizingNote": "Templated and fabricated to bespoke kitchen cabinet drawings."}'::jsonb,
  true,
  'starting_from',
  160.00,
  'USD',
  'per linear metre fabricated',
  6,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 7: Waterfall Edge Island Countertop
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ct-02',
  'waterfall-island-countertop',
  'Waterfall Edge Island Countertop',
  'Countertops & Tables',
  'A striking stone island with continuous stone cascading to the floor.',
  'An architectural centerpiece featuring continuous mitred stone joints where the horizontal surface cascades vertically to the floor. Creates a sculptural monolithic presence in modern dining and living spaces.',
  'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=1200',
  'Contemporary open kitchen with waterfall edge natural stone island',
  '{"photographer": "RArchitecture", "source": "Unsplash (Photo ID 1600565193348)", "license": "Unsplash Free Commercial License", "modifications": "Refined contrast and architectural framing"}'::jsonb,
  '{"finish": "High-polish or honed matte", "materialOptions": "Black Granite, Veined Quartzite, Composite Marble", "edgeProfile": "45-degree mitred waterfall drop", "sizingNote": "Custom fabricated per site measurements and structural support checks."}'::jsonb,
  true,
  'starting_from',
  240.00,
  'USD',
  'per linear metre mitred',
  7,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 8: Solid Stone Dining Table & Bench Set
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ct-03',
  'outdoor-granite-patio-table',
  'Solid Stone Dining Table & Bench Set',
  'Countertops & Tables',
  'A weather-resistant stone table concept engineered for verandahs and patios.',
  'Heavyweight outdoor stone dining furniture crafted to withstand Zimbabwe sun and seasonal rain without warping, fading, or peeling. Built with solid stone pedestal bases and rounded safety corners.',
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
  'Solid stone table surface with natural organic texture and clean finish',
  '{"photographer": "Nathan Fertig", "source": "Unsplash (Photo ID 1533090161767)", "license": "Unsplash Free Commercial License", "modifications": "Color grading and crop"}'::jsonb,
  '{"finish": "Thermal flamed or honed satin finish for slip resistance", "materialOptions": "Grey Granite, Rustenburg Stone, Zimbabwe Black", "edgeProfile": "Eased edge with rounded corners", "sizingNote": "6-seater, 8-seater, or custom banquet proportions."}'::jsonb,
  false,
  'starting_from',
  850.00,
  'USD',
  'complete 6-seater suite',
  8,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 9: Bathroom Vanity Stone Top
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ct-04',
  'vanity-top-undermount',
  'Bathroom Vanity Stone Top',
  'Countertops & Tables',
  'Refined natural stone vanity slab with precision undermount sink basin cutout.',
  'A moisture-sealed stone top for master ensuites and guest powder rooms. Water-repellent sealants preserve stone luster while resisting everyday soap stains and cosmetic blemishes.',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
  'Luxury bathroom vanity with polished stone surface and modern basin',
  '{"photographer": "Christian Mackie", "source": "Unsplash (Photo ID 1584622650111)", "license": "Unsplash Free Commercial License", "modifications": "Cropped and balanced"}'::jsonb,
  '{"finish": "Polished face with sealed water-resistant coat", "materialOptions": "White Granite, Zimbabwe Black, Light Travertine Look", "edgeProfile": "Half bullnose or polished flat edge with bevel", "sizingNote": "Cut to fit single or double basin vanity cabinetry."}'::jsonb,
  false,
  'starting_from',
  120.00,
  'USD',
  'single basin template',
  9,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 10: Window Sill in Polished Stone
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ws-01',
  'polished-granite-window-sill',
  'Window Sill in Polished Stone',
  'Window Sills',
  'A clean-lined window sill concept featuring a refined stone finish.',
  'Engineered to protect building facades and interior reveals against rainwater ingress and sun degradation. Delivers an enduring, maintenance-free architectural finish that outlasts painted timber or concrete.',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1200',
  'Architectural window detail showcasing smooth polished dark stone sill',
  '{"photographer": "RArchitecture", "source": "Unsplash (Photo ID 1600585152220)", "license": "Unsplash Free Commercial License", "modifications": "Architectural framing and tone balance"}'::jsonb,
  '{"finish": "High-polish face and front edge, sawn underside", "materialOptions": "Zimbabwe Black Granite, Charcoal Grey, Impala", "edgeProfile": "Chamfered front drip groove / eased edge", "sizingNote": "Standard 20mm and 30mm thicknesses; length cut to precise window reveals."}'::jsonb,
  true,
  'fixed_price',
  45.00,
  'USD',
  'per linear metre 20mm',
  10,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 11: Exterior Bullnose Sill with Drip Groove
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ws-02',
  'bullnose-exterior-granite-sill',
  'Exterior Bullnose Sill with Drip Groove',
  'Window Sills',
  'An exterior stone sill designed with a rounded bullnose edge and water drip recess.',
  'Constructed specifically for exterior weatherproofing on residential homes and commercial developments. An integrated under-edge drip groove redirects rainwater away from brickwork, preventing wall staining.',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
  'Detail of modern stone window trim and architectural sill masonry',
  '{"photographer": "Federico Respini", "source": "Unsplash (Photo ID 1513694203232)", "license": "Unsplash Free Commercial License", "modifications": "Selective tone adjustment and crop"}'::jsonb,
  '{"finish": "Weather-sealed honed or polished exterior face", "materialOptions": "Dark Granite, Zimbabwe Black", "edgeProfile": "Full Bullnose or Half Bullnose with under-edge water channel", "sizingNote": "Lengths up to 2.4m single spans or multi-piece matched runs."}'::jsonb,
  false,
  'fixed_price',
  55.00,
  'USD',
  'per linear metre bullnose',
  11,
  true
) ON CONFLICT (id) DO NOTHING;

-- Product 12: Honed Interior Sill & Low Reveal Slab
INSERT INTO public.products (
  id, slug, name, category, short_description, long_description,
  image_url, image_alt, image_attribution, specifications,
  featured, price_display_mode, price_amount, price_currency, price_note, sort_order, is_published
) VALUES (
  'ws-03',
  'honed-interior-threshold-sill',
  'Honed Interior Sill & Low Reveal Slab',
  'Window Sills',
  'A smooth, low-sheen stone sill ideal for deep interior window benches and reveals.',
  'Provides a tactile, glare-free finish suitable for deep interior window embrasures, plant shelves, and living room picture windows. Resistant to indoor UV fading and pot-plant moisture rings.',
  'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab32f?auto=format&fit=crop&q=80&w=1200',
  'Sunlit interior window sill ledge highlighting fine stone masonry craftsmanship',
  '{"photographer": "Spacejoy", "source": "Unsplash (Photo ID 1502005229762)", "license": "Unsplash Free Commercial License", "modifications": "Cropped and luminance adjusted"}'::jsonb,
  '{"finish": "Silky smooth matte honed finish", "materialOptions": "Zimbabwe Black Granite, Light Grey Granite", "edgeProfile": "Micro-bevel pencil edge", "sizingNote": "Bespoke depth and length fabricated to architectural schedule."}'::jsonb,
  false,
  'fixed_price',
  50.00,
  'USD',
  'per linear metre honed',
  12,
  true
) ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2. SEED WEBSITE CONTENT SECTIONS (website_content)
-- ----------------------------------------------------------------------------

-- Announcement
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'announcement',
  'announcement',
  '{
    "text": "Natural Zimbabwean Black Granite · Memorial Consultations & Nationwide Installation Across Zimbabwe · Direct WhatsApp: +263 78 696 7793",
    "linkText": "Request Quote →",
    "linkUrl": "/request-a-quote",
    "enabled": true
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- Hero
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'hero',
  'hero',
  '{
    "badge": "Artisanal Stonemasonry · Zimbabwe",
    "title": "Stone That Speaks Beyond Time.",
    "subtitle": "Bespoke Zimbabwean black granite memorials, custom tombstone craft, and precision-cut architectural stonework.",
    "description": "Every memorial, countertop, and window sill is custom-crafted to your family or architectural specifications with nationwide delivery and cemetery installation.",
    "primaryButtonText": "Explore Our Gallery",
    "secondaryButtonText": "Request a Quote",
    "whatsappButtonText": "Chat on WhatsApp"
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- About
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'about',
  'about',
  '{
    "title": "Crafted in Stone. Remembered Forever.",
    "subtitle": "A design-led approach to memorial masonry and architectural stonework in Zimbabwe. Blending natural geology, patient stonemasonry, and dignified digital presentation.",
    "philosophyBadge": "The Stonework Philosophy",
    "philosophyTitle": "Honoring Memory Through Enduring Geology",
    "philosophyP1": "Stonemasonry is not merely the cutting of rock; it is the physical anchoring of memory. When a family chooses a memorial for a loved one, they are making a commitment that will stand under African sun and seasonal rains for decades.",
    "philosophyP2": "Zimbabwe Black Granite is revered across the globe as one of the densest, most uniform, and deeply lustrous natural stones on Earth. Its high quartz and feldspar composition provides extraordinary weather resistance, ensuring that carved inscriptions remain legible across generations.",
    "standardsBadge": "Masonry Standards & Material Integrity",
    "standardsTitle": "Our Commitment to Enduring Craft",
    "standardsIntro": "At Velquarath Stoneworks, we believe every memorial and architectural slab should stand as a permanent testament to craftsmanship, dignity, and family heritage.",
    "standardsPoint1": "Solid Geological Stone: We work exclusively with solid Zimbabwean Black Granite and premium natural stone. We never utilize resin imitations, hollow veneers, or composite fillers.",
    "standardsPoint2": "Custom Inscription Artistry: Traditional hand-lettering, sandblasting, and 24-carat gold leaf gilding in English, Shona, and Ndebele, crafted to family and cemetery standards.",
    "standardsPoint3": "Cemetery Bylaw Alignment: Dimensions, base plinths, and headstone elevations are verified against municipal and private cemetery regulations across Zimbabwe prior to cutting.",
    "standardsPoint4": "Nationwide Delivery & Installation: Experienced stonemasons oversee foundation preparation and level ground erection across Harare, Bulawayo, Mutare, and regional rural family lands."
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- Categories
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'categories',
  'categories',
  '{
    "badge": "Stone Masonry Disciplines",
    "title": "Featured Categories",
    "tombstonesHeading": "Tombstones & Memorials",
    "tombstonesDescription": "Solemn, enduring commemorative designs crafted from high-density Zimbabwean black granite. Sized to cemetery bylaws.",
    "countertopsHeading": "Countertops & Tables",
    "countertopsDescription": "Precision-machined kitchen slabs, mitred waterfall islands, and weather-hardy outdoor stone dining tables.",
    "windowSillsHeading": "Window Sills",
    "windowSillsDescription": "Architectural granite sills with integrated water-drip grooves to protect exterior brickwork from rain ingress."
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- Craftsmanship
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'craftsmanship',
  'craftsmanship',
  '{
    "badge": "Material Sourcing & Standards",
    "title": "Authentic Zimbabwean Granite",
    "subtitle": "Dense, fine-grained gabbro renowned globally for deep obsidian lustre and exceptional weather resistance.",
    "p1": "Natural granite quarried from Zimbabwe ancient geological formations delivers unmatched resistance to sun fading, frost heave, and acid rainfall. Unlike composite stones or resin-bonded aggregates, solid granite maintains structural integrity across generations.",
    "p2": "Every piece undergoes diamond cutting, progressive grit calibration, and manual hand-edging by experienced Zimbabwean stonemasons prior to installation.",
    "highlightNotice": "All memorials comply with local Zimbabwean cemetery dimensional regulations and municipal plinth requirements."
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- Gallery
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'gallery',
  'gallery',
  '{
    "title": "Artisanal Stonework Portfolio",
    "subtitle": "Explore our archive of recent Zimbabwean black granite memorials, custom countertops, and architectural window sill installations.",
    "allFilterLabel": "All Disciplines",
    "tombstonesFilterLabel": "Tombstones",
    "countertopsFilterLabel": "Countertops & Tables",
    "windowSillsFilterLabel": "Window Sills"
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- Contact
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'contact',
  'contact',
  '{
    "telephoneDisplay": "+263 78 696 7793",
    "telephoneRaw": "+263786967793",
    "whatsappDisplay": "+263 78 696 7793",
    "whatsappDigits": "263786967793",
    "whatsappGreeting": "Hello, I would like to enquire about your stonework and memorial services in Zimbabwe.",
    "email": "muksboogie1@gmail.com",
    "physicalAddress": "Enterprise Road / Samora Machel Corridor",
    "city": "Harare",
    "country": "Zimbabwe",
    "operatingHours": "Monday – Friday: 08:00 – 17:00 | Saturday: 08:30 – 13:00",
    "serviceArea": "Harare, Bulawayo, Mutare, Gweru, Masvingo & Nationwide Zimbabwe"
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- Footer
INSERT INTO public.website_content (key, section, value, is_published)
VALUES (
  'footer',
  'footer',
  '{
    "brandStatement": "Crafted in stone. Remembered forever. Providing bespoke granite memorials, luxury countertops, and architectural stonework across Zimbabwe.",
    "copyrightNotice": "Velquarath Stoneworks. All rights reserved. Zimbabwe Granite Stonemasonry.",
    "assuranceHeading": "Client Assurance & Standards",
    "assuranceIntro": "Committed to ethical masonry standards, transparent contracts, and regulatory alignment across Zimbabwe:"
  }'::jsonb,
  true
) ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. INSTRUCTIONAL BOOTSTRAP: FIRST ADMINISTRATOR SETUP
-- ----------------------------------------------------------------------------
-- To create the first administrator safely without self-registration risks:
--
-- Step A: In your Supabase Dashboard, go to Authentication -> Users -> Add User -> Create User.
--         Enter an email (e.g. admin@velquarath.co.zw) and a strong password.
--         Check "Auto Confirm User".
--
-- Step B: Copy the newly created User UUID from the Supabase Auth table.
--
-- Step C: Run this command in the Supabase SQL Editor:
--
--   INSERT INTO public.admin_users (id, email, role, is_active)
--   VALUES (
--     'PASTE-USER-UUID-HERE',
--     'admin@velquarath.co.zw',
--     'super_admin',
--     true
--   )
--   ON CONFLICT (id) DO UPDATE SET role = 'super_admin', is_active = true;
--
-- This guarantees self-registration can never grant administrator privileges.
