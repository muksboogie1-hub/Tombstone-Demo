import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, CheckCircle2, Flame, Droplets } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { ProductCard } from '../components/common/ProductCard';
import { ProductDetailModal } from '../components/common/ProductDetailModal';
import { useContent } from '../context/ContentContext';
import { Product } from '../types/content';
import { getWhatsAppUrl } from '../config/siteConfig';

export function CountertopsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useContent();
  const countertops = products.filter((p) => p.category === 'Countertops & Tables' && p.isPublished !== false);

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Granite Countertops & Stone Tables | Zimbabwe"
        description="Luxury kitchen granite countertops, waterfall islands, vanity slabs, and solid stone patio tables in Zimbabwe. Precision stone cutting and edge profiling."
      />

      <PageHeader
        title="Countertops & Tables"
        subtitle="Transforming living spaces with solid natural granite surfaces. Hand-finished kitchen worktops, sculptural waterfall islands, and durable patio dining tables built for decades of daily life."
        category="Interior & Architectural Surfaces"
        breadcrumbs={[{ label: 'Products', to: '/products' }, { label: 'Countertops & Tables' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Stone Performance Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Flame className="w-4 h-4 text-[#B79A68]" />
              <span>Thermal & Scratch Resilience</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Granite naturally withstands hot pots and kitchen utensils without scorch marks, peeling laminate films, or surface warping.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Droplets className="w-4 h-4 text-[#B79A68]" />
              <span>Stain-Resistant Surface Sealing</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Every countertop slab receives a deep penetrating fluorochemical sealer to guard against oil, cooking juices, coffee, and daily spills.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <CheckCircle2 className="w-4 h-4 text-[#B79A68]" />
              <span>Precision CNC & Hand-Finished Edges</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              From clean pencil eased edges to 45-degree mitred waterfalls and classical bullnose profiles, our edges are polished to perfection.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#2D3237] pb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
              Kitchen Countertops, Vanities & Custom Tables
            </h2>
            <span className="text-xs text-[#8E8B82]">{countertops.length} Designs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countertops.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </div>

        {/* Fabrication Guidance */}
        <div className="bg-[#17191B] border border-[#2D3237] p-8 rounded-lg space-y-6">
          <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
            Kitchen & Bathroom Templating Process
          </h3>
          <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            For fitted cabinetry in Harare, Bulawayo, and regional residential projects, precision templating guarantees exact fit around walls, plumbing, and appliances:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#DFD9CB]">
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <span className="text-xs font-bold text-[#B79A68] block mb-1">01. Preliminary Quotation</span>
              <p className="text-[#8E8B82]">Submit your kitchen floorplan or linear meter measurements for an estimated material and cutting estimate.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <span className="text-xs font-bold text-[#B79A68] block mb-1">02. On-Site Templating</span>
              <p className="text-[#8E8B82]">Once base cabinets are secured, precise laser or physical templates capture out-of-square walls and sink cutouts.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <span className="text-xs font-bold text-[#B79A68] block mb-1">03. Fabrication & Delivery</span>
              <p className="text-[#8E8B82]">Granite slabs are sawn, sink cutouts polished, edge profiles shaped, and delivered for installation.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={getWhatsAppUrl("Hello, I would like to enquire about kitchen granite countertops and linear meter pricing.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] px-6 py-3 rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
            <Link
              to="/request-a-quote?category=Countertops+%26+Tables"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-6 py-3 rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Request Countertop Quotation</span>
            </Link>
          </div>
        </div>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
