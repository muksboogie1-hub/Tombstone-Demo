import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, FileText, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { ProductCard } from '../components/common/ProductCard';
import { ProductDetailModal } from '../components/common/ProductDetailModal';
import { PRODUCTS, Product } from '../data/products';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/siteConfig';

export function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Curated featured designs
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="space-y-24 sm:space-y-32">
      <SEOHead
        title="Bespoke Memorials & Granite Works"
        description="Crafted in Stone. Remembered Forever. Explore premium tombstones, granite memorials, countertops, and window sills in Zimbabwe."
      />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
        {/* Background Cinematic Stone Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=2000"
            alt="Dignified stone memorial structure standing serenely under soft ambient sky"
            className="w-full h-full object-cover object-center filter brightness-45 contrast-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-radial from-transparent via-[#17191B]/80 to-[#17191B]"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#17191B] via-transparent to-[#17191B]/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Subtle Badge */}
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B79A68] border border-[#B79A68]/30 px-3.5 py-1.5 rounded-full bg-[#17191B]/80 backdrop-blur-xs">
            <span>Artisanal Stonemasonry</span>
            <span aria-hidden="true">·</span>
            <span>Zimbabwe</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#F5F1E8] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Stone That Speaks Beyond Time.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#DFD9CB] max-w-2xl mx-auto font-light leading-relaxed">
            Bespoke Zimbabwean black granite memorials, custom tombstone craft, and precision-cut architectural stonework.
          </p>

          <p className="text-xs text-[#B9B5AC] max-w-lg mx-auto">
            Every memorial, countertop, and window sill is custom-crafted to your family or architectural specifications with nationwide delivery and cemetery installation.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-8 py-3.5 rounded transition-all shadow-lg hover:shadow-[#B79A68]/20 cursor-pointer"
            >
              <span>Explore Our Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/request-a-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F5F1E8] hover:text-[#B79A68] bg-[#1D2023]/90 hover:bg-[#252A2E] border border-[#3D434A] hover:border-[#B79A68]/50 px-8 py-3.5 rounded transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#B79A68]" />
              <span>Request a Quote</span>
            </Link>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#25D366] hover:text-white bg-[#25D366]/15 hover:bg-[#25D366] border border-[#25D366]/40 px-6 py-3.5 rounded transition-colors cursor-pointer"
              title="Open WhatsApp chat"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* --- SECTION A: FEATURED CATEGORIES --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" aria-labelledby="featured-categories-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D3237] pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B79A68] mb-1">
              Stone Masonry Disciplines
            </div>
            <h2 id="featured-categories-heading" className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-bold">
              Featured Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#B9B5AC] max-w-md">
            Precision stonework tailored for solemn family remembrance and refined architectural installations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1: Tombstones */}
          <div className="group relative bg-[#1D2023] border border-[#2D3237] hover:border-[#B79A68]/60 rounded overflow-hidden transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-16/10 overflow-hidden bg-[#121415]">
              <img
                src="https://images.unsplash.com/photo-1596280459345-42cf6ee2a106?auto=format&fit=crop&q=80&w=800"
                alt="Polished black granite tombstone monument"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1D2023] via-transparent to-transparent"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold block mb-1">
                  Memorial Work
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold group-hover:text-[#B79A68] transition-colors">
                  Tombstones & Memorials
                </h3>
                <p className="text-xs text-[#B9B5AC] mt-2 leading-relaxed">
                  Headstones, full kerb enclosures, tiered ledger stones, and cross memorials carved in deep Zimbabwean granite to honor family legacies.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/tombstones"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B79A68] group-hover:text-[#F5F1E8] transition-colors"
                >
                  <span>Explore Tombstones</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Category 2: Countertops & Tables */}
          <div className="group relative bg-[#1D2023] border border-[#2D3237] hover:border-[#B79A68]/60 rounded overflow-hidden transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-16/10 overflow-hidden bg-[#121415]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                alt="Bespoke granite kitchen island countertop"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1D2023] via-transparent to-transparent"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold block mb-1">
                  Interior & Living
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold group-hover:text-[#B79A68] transition-colors">
                  Countertops & Tables
                </h3>
                <p className="text-xs text-[#B9B5AC] mt-2 leading-relaxed">
                  Heat-resistant granite kitchen worktops, waterfall edge islands, bathroom vanity slabs, and solid stone outdoor dining tables.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/countertops-tables"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B79A68] group-hover:text-[#F5F1E8] transition-colors"
                >
                  <span>Explore Countertops</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Category 3: Window Sills */}
          <div className="group relative bg-[#1D2023] border border-[#2D3237] hover:border-[#B79A68]/60 rounded overflow-hidden transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-16/10 overflow-hidden bg-[#121415]">
              <img
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=800"
                alt="Polished stone window sill architectural trim"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1D2023] via-transparent to-transparent"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold block mb-1">
                  Architectural Masonry
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold group-hover:text-[#B79A68] transition-colors">
                  Window Sills
                </h3>
                <p className="text-xs text-[#B9B5AC] mt-2 leading-relaxed">
                  Durable granite exterior sills with water-drip grooves, honed interior threshold reveals, and bullnose architectural trim.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/window-sills"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B79A68] group-hover:text-[#F5F1E8] transition-colors"
                >
                  <span>Explore Window Sills</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION B: FEATURED DESIGNS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" aria-labelledby="featured-designs-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2D3237] pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B79A68] mb-1">
              Curated Selection
            </div>
            <h2 id="featured-designs-heading" className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-bold">
              Featured Designs
            </h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B79A68] hover:text-[#F5F1E8] transition-colors"
          >
            <span>View Complete Gallery ({PRODUCTS.length} Designs)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
          ))}
        </div>
      </section>

      {/* --- SECTION C: WHY EXPLORE OUR DESIGNS? --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg space-y-8">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B79A68] mb-2">
              Craftsmanship Principles
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
              Why Explore Our Stonework Designs?
            </h2>
            <p className="text-xs sm:text-sm text-[#B9B5AC] mt-2 leading-relaxed">
              Every design showcased in our catalog represents deliberate stone engineering, balancing aesthetic proportion, structural longevity, and respectful commemorative tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#252A2E]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
                <Sparkles className="w-4 h-4 text-[#B79A68]" />
                <span>Enduring Granite Materials</span>
              </div>
              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                Expertly crafted using Zimbabwe Black Granite, Impala Grey, and African stone celebrated worldwide for weather tolerance, density, and enduring luster.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
                <Compass className="w-4 h-4 text-[#B79A68]" />
                <span>Bespoke Proportions & Plots</span>
              </div>
              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                Designs adaptable to standard Zimbabwean cemetery plot regulations (Warren Hills, Granville, Glen Forest, etc.) or custom home architectural specifications.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
                <CheckCircle2 className="w-4 h-4 text-[#B79A68]" />
                <span>Direct Stonemason Consultation</span>
              </div>
              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                Connect directly with stonemasons without intermediaries to verify inscription typography, bevel edges, slab thickness, and scheduled site delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION D: HOW TO ENQUIRE --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" aria-labelledby="how-to-enquire-heading">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B79A68]">
            Three-Step Process
          </div>
          <h2 id="how-to-enquire-heading" className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-bold">
            How to Enquire
          </h2>
          <p className="text-xs sm:text-sm text-[#B9B5AC]">
            We keep memorial and stonework consultations straightforward, transparent, and respectful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-8 rounded space-y-4 relative">
            <span className="font-serif text-3xl font-bold text-[#B79A68]/40 block">01</span>
            <h3 className="font-serif text-xl text-[#F5F1E8] font-bold">
              Explore the Designs
            </h3>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Browse our categorized gallery of headstones, kitchen slabs, tables, and sills to select a style that aligns with your family vision or project plans.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-8 rounded space-y-4 relative">
            <span className="font-serif text-3xl font-bold text-[#B79A68]/40 block">02</span>
            <h3 className="font-serif text-xl text-[#F5F1E8] font-bold">
              Send Your Inquiry
            </h3>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Click &ldquo;Enquire About This Design&rdquo; to launch WhatsApp with the design pre-selected, or submit our detailed online quotation form.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-8 rounded space-y-4 relative">
            <span className="font-serif text-3xl font-bold text-[#B79A68]/40 block">03</span>
            <h3 className="font-serif text-xl text-[#F5F1E8] font-bold">
              Confirm Specifications
            </h3>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Discuss stone finishes, lettering, cemetery permits, custom dimensions, pricing, and delivery timelines directly with our stonework specialists.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION E: CONTACT & DIRECT INQUIRY --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#B79A68]/40 bg-radial from-[#222629] via-[#1D2023] to-[#17191B] rounded-lg p-8 sm:p-14 text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B79A68]">
            Begin Your Consultation
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F5F1E8] font-bold max-w-2xl mx-auto leading-tight">
            Discuss Your Custom Stonework Project
          </h2>

          <p className="text-xs sm:text-sm text-[#DFD9CB] max-w-xl mx-auto leading-relaxed font-light">
            Whether preparing a commemorative headstone for an upcoming unveiling ceremony or specifying granite slabs for architectural building work, we are here to assist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] px-7 py-3.5 rounded transition-colors shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat via WhatsApp ({SITE_CONFIG.contact.whatsAppDisplayNumber})</span>
            </a>

            <Link
              to="/request-a-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-7 py-3.5 rounded transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Email Quotation Form</span>
            </Link>
          </div>

          <div className="pt-4 text-[11px] text-[#8E8B82]">
            <span>Business Hours: {SITE_CONFIG.contact.operatingHours}</span>
            <span className="mx-2">·</span>
            <span>Direct Email: {SITE_CONFIG.contact.email}</span>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
