import { Link } from 'react-router-dom';
import { Shield, Sparkles, HeartHandshake, MapPin, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { useContent } from '../context/ContentContext';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/siteConfig';

export function AboutPage() {
  const { content } = useContent();
  const about = content.about;

  const customWhatsAppUrl = content?.contact?.whatsappDigits
    ? `https://wa.me/${content.contact.whatsappDigits.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello, I would like to learn more about your stone sourcing and custom memorial fabrication.')}`
    : getWhatsAppUrl("Hello, I would like to learn more about your stone sourcing and custom memorial fabrication.");

  return (
    <div className="space-y-20 pb-20">
      <SEOHead
        title="About Velquarath Stoneworks — Craftsmanship in Stone"
        description="Learn about Velquarath Stoneworks, our design philosophy for enduring Zimbabwean black granite memorials, and our commitment to transparent digital presentation."
      />

      <PageHeader
        title={about?.title || "Crafted in Stone. Remembered Forever."}
        subtitle={about?.subtitle || "A design-led approach to memorial masonry and architectural stonework in Zimbabwe. Blending natural geology, patient stonemasonry, and dignified digital presentation."}
        category="Our Philosophy & Concept"
        breadcrumbs={[{ label: 'About' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Core Narrative */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B79A68] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{about?.philosophyBadge || "The Stonework Philosophy"}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-bold leading-tight">
              {about?.philosophyTitle || "Honoring Memory Through Enduring Geology"}
            </h2>

            <p className="text-sm sm:text-base text-[#DFD9CB] leading-relaxed font-light">
              {about?.philosophyP1 || "Stonemasonry is not merely the cutting of rock; it is the physical anchoring of memory. When a family chooses a memorial for a loved one, they are making a commitment that will stand under African sun and seasonal rains for decades."}
            </p>

            <p className="text-sm text-[#B9B5AC] leading-relaxed">
              {about?.philosophyP2 || "Zimbabwe Black Granite is revered across the globe as one of the densest, most uniform, and deeply lustrous natural stones on Earth. Its high quartz and feldspar composition provides extraordinary weather resistance, ensuring that carved inscriptions remain legible across generations."}
            </p>

            <div className="pt-2">
              <a
                href={customWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-6 py-3 rounded transition-colors cursor-pointer"
              >
                <span>Consult Our Specialists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#2D3237] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200"
                alt="Sculpted natural stone monument illustrating generational masonry"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#1D2023] border border-[#B79A68]/40 p-4 rounded-lg shadow-xl max-w-xs text-xs text-[#DFD9CB]">
              <span className="font-serif font-bold text-[#B79A68] block text-sm mb-1">
                Natural Stone Heritage
              </span>
              Sourced from geological formations across Zimbabwe, precision cut to honor lifetime legacies.
            </div>
          </div>
        </section>

        {/* Authentic Craftsmanship & Masonry Standards */}
        <section className="bg-[#1D2023] border border-[#B79A68]/40 p-8 sm:p-12 rounded-lg space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B79A68] font-semibold">
            <Shield className="w-4 h-4" />
            <span>{about?.standardsBadge || "Masonry Standards & Material Integrity"}</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
            {about?.standardsTitle || "Our Commitment to Enduring Craft"}
          </h3>

          <div className="space-y-4 text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            <p>
              {about?.standardsIntro || (
                <>At <strong className="text-[#F5F1E8]">Velquarath Stoneworks</strong>, we believe every memorial and architectural slab should stand as a permanent testament to craftsmanship, dignity, and family heritage.</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#DFD9CB]">
              <li><strong className="text-[#F5F1E8]">Solid Geological Stone:</strong> {about?.standardsPoint1 || "We work exclusively with solid Zimbabwean Black Granite and premium natural stone. We never utilize resin imitations, hollow veneers, or composite fillers."}</li>
              <li><strong className="text-[#F5F1E8]">Custom Inscription Artistry:</strong> {about?.standardsPoint2 || "Traditional hand-lettering, sandblasting, and 24-carat gold leaf gilding in English, Shona, and Ndebele, crafted to family and cemetery standards."}</li>
              <li><strong className="text-[#F5F1E8]">Cemetery Bylaw Alignment:</strong> {about?.standardsPoint3 || "Dimensions, base plinths, and headstone elevations are verified against municipal and private cemetery regulations across Zimbabwe prior to cutting."}</li>
              <li><strong className="text-[#F5F1E8]">Nationwide Delivery & Installation:</strong> {about?.standardsPoint4 || "Experienced stonemasons oversee foundation preparation and level ground erection across Harare, Bulawayo, Mutare, and regional rural family lands."}</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              to="/request-a-quote"
              className="text-xs text-[#B79A68] hover:underline font-medium inline-flex items-center gap-1.5"
            >
              <span>Request a formal stone consultation or price quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
              Our Core Masonry Values
            </h3>
            <p className="text-xs sm:text-sm text-[#B9B5AC]">
              Three enduring standards that govern every memorial and architectural slab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#17191B] border border-[#2D3237] p-6 rounded-lg space-y-3">
              <Shield className="w-5 h-5 text-[#B79A68]" />
              <h4 className="font-serif text-lg text-[#F5F1E8] font-semibold">
                Dignity & Reverence
              </h4>
              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                We treat memorial inquiries with the solemnity and care they deserve, ensuring family consultations are unhurried, patient, and considerate.
              </p>
            </div>

            <div className="bg-[#17191B] border border-[#2D3237] p-6 rounded-lg space-y-3">
              <Sparkles className="w-5 h-5 text-[#B79A68]" />
              <h4 className="font-serif text-lg text-[#F5F1E8] font-semibold">
                Geological Authenticity
              </h4>
              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                We work strictly with solid, premium-grade natural stone. No synthetic resin imitations, hollow veneers, or easily weathered composite fillers.
              </p>
            </div>

            <div className="bg-[#17191B] border border-[#2D3237] p-6 rounded-lg space-y-3">
              <HeartHandshake className="w-5 h-5 text-[#B79A68]" />
              <h4 className="font-serif text-lg text-[#F5F1E8] font-semibold">
                Transparent Specifications
              </h4>
              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                Clear documentation of stone origin, slab thickness (20mm, 30mm, 50mm+), edge treatments, lettering methods, and expected completion dates.
              </p>
            </div>
          </div>
        </section>

        {/* Geographic Presence */}
        <section className="bg-[#1D2023] border border-[#2D3237] p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#B79A68] uppercase tracking-wider font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Target Service Region</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              {content?.contact?.serviceArea || "Harare, Bulawayo & Nationwide Zimbabwe"}
            </h3>
            <p className="text-xs text-[#B9B5AC] max-w-xl leading-relaxed">
              Serving family burial parks across Harare (Warren Hills, Granville, Glen Forest, Greendale) and Bulawayo (Luveve, West Park, Athlone), with specialized crated delivery for regional provinces.
            </p>
          </div>

          <Link
            to="/contact"
            className="shrink-0 text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-6 py-3 rounded transition-colors"
          >
            Contact Showroom
          </Link>
        </section>
      </div>
    </div>
  );
}
