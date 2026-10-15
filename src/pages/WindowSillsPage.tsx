import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, CloudRain, Sun, Ruler } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { ProductCard } from '../components/common/ProductCard';
import { ProductDetailModal } from '../components/common/ProductDetailModal';
import { useContent } from '../context/ContentContext';
import { Product } from '../types/content';
import { getWhatsAppUrl } from '../config/siteConfig';

export function WindowSillsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useContent();
  const windowSills = products.filter((p) => p.category === 'Window Sills' && p.isPublished !== false);

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Granite Window Sills — Architectural Stone Sills | Zimbabwe"
        description="Premium polished and honed granite window sills in Zimbabwe. Durable exterior sills with drip grooves and elegant interior stone reveals."
      />

      <PageHeader
        title="Granite Window Sills"
        subtitle="Enduring architectural stone sills crafted to protect building envelopes against rainwater damage while imparting permanent structural elegance to residential and commercial properties."
        category="Architectural Stonework"
        breadcrumbs={[{ label: 'Products', to: '/products' }, { label: 'Window Sills' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Architectural Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <CloudRain className="w-4 h-4 text-[#B79A68]" />
              <span>Integrated Water Drip Grooves</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Exterior sills feature an under-edge continuous capillary drip groove (throating) that forces stormwater to break and drop clear of exterior plaster, preventing damp streaking.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Sun className="w-4 h-4 text-[#B79A68]" />
              <span>Zero Sun Deterioration</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Unlike painted timber that rots or concrete that chips and discolors over time, solid natural stone retains its polish and density under decades of intense weather exposure.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <Ruler className="w-4 h-4 text-[#B79A68]" />
              <span>Precision Lengths & Thicknesses</span>
            </div>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              Available in 20mm and 30mm thickness profiles, diamond-sawn to exact structural reveal dimensions for rapid, clean installation by bricklayers and window contractors.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#2D3237] pb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
              Window Sill Profiles & Architectural Finishes
            </h2>
            <span className="text-xs text-[#8E8B82]">{windowSills.length} Designs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {windowSills.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </div>

        {/* Contractor & Architect Sourcing Notice */}
        <div className="bg-[#17191B] border border-[#2D3237] p-8 rounded-lg space-y-6">
          <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
            Developer & Construction Schedule Sourcing
          </h3>
          <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            Supplying private home builders, architectural studios, and commercial contractors across Harare, Bulawayo, Mutare, and surrounding development corridors:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#DFD9CB]">
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Standard Cut Runs</h4>
              <p className="text-[#8E8B82]">Matched runs for uniform window elevations across multi-story facades or residential suburban developments.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Exterior & Interior Finishes</h4>
              <p className="text-[#8E8B82]">Polished front faces with honed or flamed weather steps to prevent glare into upper rooms.</p>
            </div>
            <div className="bg-[#1D2023] p-4 rounded border border-[#252A2E]">
              <h4 className="font-semibold text-[#B79A68] mb-1">Crated Pallet Delivery</h4>
              <p className="text-[#8E8B82]">Carefully packed with protective separators to ensure crisp corner edges arrive undamaged on job sites.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={getWhatsAppUrl("Hello, I would like to enquire about stone window sill schedules, meterage, and trade pricing.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] px-6 py-3 rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire Window Sills on WhatsApp</span>
            </a>
            <Link
              to="/request-a-quote?category=Window+Sills"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-6 py-3 rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Request Window Sill Quotation</span>
            </Link>
          </div>
        </div>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
