import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, Sparkles, Shield, Clock } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { ProductCard } from '../components/common/ProductCard';
import { ProductDetailModal } from '../components/common/ProductDetailModal';
import { PRODUCTS, Product } from '../data/products';
import { getWhatsAppUrl } from '../config/siteConfig';

export function TombstonesPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const tombstones = PRODUCTS.filter((p) => p.category === 'Tombstones');

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Tombstones & Memorials — Black Granite Headstones | Zimbabwe"
        description="Dignified, enduring tombstones and memorials in Zimbabwe. Handcrafted upright headstones, cross-head monuments, and full kerb sets in Zimbabwe Black Granite."
      />

      <PageHeader
        title="Tombstones & Memorials"
        subtitle="Honoring enduring memory with dignified stonemasonry. Each memorial is shaped in resilient natural granite, designed to withstand weathering across generations in Zimbabwean cemeteries."
        category="Memorial Masonry"
        breadcrumbs={[{ label: 'Products', to: '/products' }, { label: 'Tombstones' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Context Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Sparkles className="w-4 h-4 text-[#B79A68]" />
              <span>Zimbabwe Black Granite</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Renowned worldwide for its fine grain structure, deep mineral luster, and superior resistance to environmental discoloration under intense subtropical sun.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Shield className="w-4 h-4 text-[#B79A68]" />
              <span>Cemetery Regulation Compliance</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Our designs adapt to specific municipality and private cemetery guidelines across Harare, Bulawayo, Mutare, and regional memorial parks.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Clock className="w-4 h-4 text-[#B79A68]" />
              <span>Unveiling Ceremony Schedules</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              We understand the sacred significance of family memorial unveiling ceremonies. Consult directly to plan fabrication and installation timeframes.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#2D3237] pb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
              Memorial Styles & Headstone Designs
            </h2>
            <span className="text-xs text-[#8E8B82]">{tombstones.length} Designs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tombstones.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </div>

        {/* Customization & Inscription Information */}
        <div className="bg-[#17191B] border border-[#2D3237] p-8 rounded-lg space-y-6">
          <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
            Personalization & Inscription Services
          </h3>
          <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            Every memorial can be customized to reflect family heritage, faith, and cherished memories. Inscriptions can be rendered in English, Shona, or Ndebele:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#DFD9CB]">
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Lettering Finishes</h4>
              <p className="text-[#8E8B82]">Deep sandblasted v-cut letters, hand-gilded 23kt gold leaf, or bright silver enamel paint.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Ceramic Photo Cameos</h4>
              <p className="text-[#8E8B82]">High-fired porcelain photo portraits embedded flush into the granite face for lasting clarity.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Flower Vases & Urns</h4>
              <p className="text-[#8E8B82]">Turned granite flower vases integrated into the base slab or sub-pedestals.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Custom Emblems</h4>
              <p className="text-[#8E8B82]">Crosses, floral bouquets, family crests, praying hands, or custom religious motifs.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={getWhatsAppUrl("Hello, I would like to consult about tombstone designs, inscription options, and delivery in Zimbabwe.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] px-6 py-3 rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss Memorial on WhatsApp</span>
            </a>
            <Link
              to="/request-a-quote?category=Tombstones"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-6 py-3 rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Request Formal Memorial Quote</span>
            </Link>
          </div>
        </div>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
