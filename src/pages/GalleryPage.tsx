import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, MessageCircle, ExternalLink, SlidersHorizontal, Check } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { ProductDetailModal } from '../components/common/ProductDetailModal';
import { PRODUCTS, Product } from '../data/products';
import { getProductWhatsAppUrl } from '../config/siteConfig';

type CategoryFilter = 'All Designs' | 'Tombstones' | 'Countertops & Tables' | 'Window Sills';

export function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as CategoryFilter) || 'All Designs';
  
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>(
    ['All Designs', 'Tombstones', 'Countertops & Tables', 'Window Sills'].includes(initialCategory)
      ? initialCategory
      : 'All Designs'
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filters: CategoryFilter[] = [
    'All Designs',
    'Tombstones',
    'Countertops & Tables',
    'Window Sills',
  ];

  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    if (filter === 'All Designs') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: filter });
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All Designs') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Curated Stonework Gallery & Memorial Catalog"
        description="Explore our high-resolution gallery of polished granite tombstones, memorial headstones, bespoke kitchen countertops, and stone window sills in Zimbabwe."
      />

      <PageHeader
        title="Curated Stonework Gallery"
        subtitle="Explore our comprehensive collection of memorial headstones, natural stone countertops, and architectural window sills. Select any design to inspect detailed specifications or initiate a direct inquiry."
        category="Design Archive"
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Interactive Segmented Filter Bar (functional buttons, not static pills) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1D2023] border border-[#2D3237] p-2.5 sm:p-3 rounded-lg">
          <div className="flex items-center gap-2 px-2 text-xs text-[#B9B5AC] font-semibold uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B79A68]" />
            <span>Category Filter:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Product category filters">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              const count =
                filter === 'All Designs'
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.category === filter).length;

              return (
                <button
                  key={filter}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-3.5 py-2 text-xs font-medium rounded transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#B79A68] text-[#17191B] font-semibold shadow-xs'
                      : 'text-[#DFD9CB] hover:bg-[#252A2E] hover:text-[#F5F1E8]'
                  }`}
                >
                  {isActive && <Check className="w-3 h-3 text-[#17191B]" />}
                  <span>{filter}</span>
                  <span
                    className={`text-[10px] ml-1 px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#17191B]/20 text-[#17191B]' : 'bg-[#17191B] text-[#8E8B82]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Results Count Note */}
        <div className="flex items-center justify-between text-xs text-[#8E8B82] px-1">
          <div>
            Showing <span className="text-[#DFD9CB] font-semibold">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'design' : 'designs'} in{' '}
            <span className="text-[#B79A68] font-medium">{activeFilter}</span>
          </div>
          <div className="text-[11px]">
            High-Resolution Stone Catalog · Zimbabwe
          </div>
        </div>

        {/* Editorial Responsive Masonry / Varied Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => {
            // Give varied subtle styling for editorial rhythm
            const isWide = idx % 5 === 0;

            return (
              <article
                key={product.id}
                className={`bg-[#1D2023] border border-[#2D3237] hover:border-[#B79A68]/60 transition-all duration-300 rounded overflow-hidden flex flex-col group ${
                  isWide ? 'lg:col-span-1' : ''
                }`}
              >
                {/* Image Container with Editorial Aspect Ratio */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#121415]">
                  <img
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1D2023] via-transparent to-transparent opacity-60"></div>

                  {/* Photo Attribution Corner */}
                  <span className="absolute top-2 left-2 bg-[#17191B]/80 text-[10px] text-[#B9B5AC] px-2 py-0.5 rounded backdrop-blur-xs">
                    {product.imageAttribution.license}
                  </span>

                  {/* Hover Inspect Action */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
                    aria-label={`View design specifications for ${product.name}`}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-[#17191B]/95 text-[#F5F1E8] text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded border border-[#B79A68]/50 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-[#B79A68]" />
                      <span>Inspect Design</span>
                    </span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed clean text metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-[#B79A68] tracking-widest uppercase font-semibold mb-1">
                      <span>{product.category}</span>
                      <span aria-hidden="true" className="text-[#3D434A]">·</span>
                      <span className="text-[#8E8B82]">Bespoke Craft</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#F5F1E8] font-bold group-hover:text-[#B79A68] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#B9B5AC] mt-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Specifications teaser */}
                    <div className="mt-3 pt-3 border-t border-[#252A2E] text-[11px] text-[#8E8B82] space-y-1">
                      <div>
                        <span className="text-[#DFD9CB]">Material:</span>{' '}
                        {product.specifications.materialOptions.split(',')[0]}
                      </div>
                      <div>
                        <span className="text-[#DFD9CB]">Finish:</span>{' '}
                        {product.specifications.finish}
                      </div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-3 border-t border-[#252A2E] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#DFD9CB] hover:text-white bg-[#252A2E] hover:bg-[#2F353A] py-2.5 px-3 rounded transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B79A68]" />
                      <span>View Design</span>
                    </button>

                    <a
                      href={getProductWhatsAppUrl(product.name, product.category)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#121415] border border-[#25D366]/30 hover:border-[#25D366] py-2.5 px-3.5 rounded transition-colors cursor-pointer"
                      title={`Enquire about ${product.name} on WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Gallery Guidance Footer Note */}
        <div className="bg-[#17191B] border border-[#2D3237] p-6 rounded-lg text-center max-w-3xl mx-auto space-y-2">
          <h4 className="font-serif text-lg text-[#F5F1E8] font-semibold">
            Custom Stonework Fabrication
          </h4>
          <p className="text-xs text-[#B9B5AC] leading-relaxed">
            Need a design that combines elements from multiple memorials or custom architectural measurements? Our stonemasons build to bespoke architectural drawings and family requests across Zimbabwe.
          </p>
        </div>
      </div>

      {/* Product Detail Dialog */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
