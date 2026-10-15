import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Home as HomeIcon, Maximize2 } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { ProductCard } from '../components/common/ProductCard';
import { ProductDetailModal } from '../components/common/ProductDetailModal';
import { useContent } from '../context/ContentContext';
import { Product } from '../types/content';

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useContent();

  const active = products.filter((p) => p.isPublished !== false);
  const tombstones = active.filter((p) => p.category === 'Tombstones');
  const countertops = active.filter((p) => p.category === 'Countertops & Tables');
  const windowSills = active.filter((p) => p.category === 'Window Sills');

  return (
    <div className="space-y-20 pb-20">
      <SEOHead
        title="Our Stonework Products & Memorial Collections"
        description="Explore our specialized stonework categories: granite tombstones and memorials, kitchen countertops and stone tables, and durable granite window sills in Zimbabwe."
      />

      <PageHeader
        title="Our Stonework Collections"
        subtitle="Explore our portfolio of handcrafted stonework, organized across three core disciplines: solemn commemorative memorials, luxury interior countertops, and architectural window sills."
        category="Comprehensive Catalog"
        breadcrumbs={[{ label: 'Products' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Category Section 1: Tombstones */}
        <section className="space-y-8" aria-labelledby="tombstones-collection">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2D3237] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B79A68] font-semibold mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Memorial Masonry</span>
              </div>
              <h2 id="tombstones-collection" className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
                Tombstones & Memorials
              </h2>
            </div>
            <Link
              to="/tombstones"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B79A68] hover:text-[#F5F1E8] transition-colors"
            >
              <span>Dedicated Tombstones Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tombstones.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </section>

        {/* Category Section 2: Countertops & Tables */}
        <section className="space-y-8" aria-labelledby="countertops-collection">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2D3237] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B79A68] font-semibold mb-1">
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Interior Surfaces</span>
              </div>
              <h2 id="countertops-collection" className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
                Countertops & Tables
              </h2>
            </div>
            <Link
              to="/countertops-tables"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B79A68] hover:text-[#F5F1E8] transition-colors"
            >
              <span>Dedicated Countertops Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countertops.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </section>

        {/* Category Section 3: Window Sills */}
        <section className="space-y-8" aria-labelledby="sills-collection">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2D3237] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B79A68] font-semibold mb-1">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Architectural Trims</span>
              </div>
              <h2 id="sills-collection" className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
                Granite Window Sills
              </h2>
            </div>
            <Link
              to="/window-sills"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B79A68] hover:text-[#F5F1E8] transition-colors"
            >
              <span>Dedicated Window Sills Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {windowSills.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </section>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
