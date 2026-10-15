import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, MessageCircle, FileText, Info, ExternalLink } from 'lucide-react';
import { Product } from '../../data/products';
import { getProductWhatsAppUrl } from '../../config/siteConfig';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-desc"
        className="bg-[#1D2023] border border-[#2D3237] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#F5F1E8] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close product details dialog"
          className="absolute top-4 right-4 z-10 p-2 bg-[#17191B]/80 hover:bg-[#252A2E] text-[#B9B5AC] hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 relative bg-[#121415] min-h-[280px] md:min-h-full">
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            loading="eager"
            className="w-full h-full object-cover object-center max-h-[460px] md:max-h-none"
          />
          <div className="absolute bottom-2 left-2 bg-[#17191B]/90 backdrop-blur-xs text-[10px] text-[#B9B5AC] px-2.5 py-1 rounded border border-[#2D3237]">
            Photo: {product.imageAttribution.photographer} ({product.imageAttribution.license})
          </div>
        </div>

        {/* Content Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#B79A68] uppercase tracking-widest font-medium">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#8E8B82]">Bespoke Masonry</span>
            </div>

            <h2 id="product-modal-title" className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
              {product.name}
            </h2>

            <p id="product-modal-desc" className="text-sm text-[#DFD9CB] leading-relaxed">
              {product.longDescription}
            </p>

            {/* Specifications Card */}
            <div className="bg-[#17191B] border border-[#2D3237] p-4 rounded space-y-2.5 text-xs">
              <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#B79A68] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Craftsmanship & Specifications</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-2 pt-1 text-[#B9B5AC]">
                <div>
                  <span className="text-[#DFD9CB] font-medium">Stone Options:</span>{' '}
                  {product.specifications.materialOptions}
                </div>
                <div>
                  <span className="text-[#DFD9CB] font-medium">Surface Finish:</span>{' '}
                  {product.specifications.finish}
                </div>
                {product.specifications.edgeProfile && (
                  <div>
                    <span className="text-[#DFD9CB] font-medium">Edge Profile:</span>{' '}
                    {product.specifications.edgeProfile}
                  </div>
                )}
                <div className="text-[11px] text-[#8E8B82] pt-1 border-t border-[#252A2E]">
                  <span className="text-[#DFD9CB] font-medium">Dimensions & Sizing:</span>{' '}
                  {product.specifications.sizingNote}
                </div>
              </div>
            </div>

            {/* Copyright & License Note */}
            <div className="text-[11px] text-[#8E8B82] bg-[#17191B]/50 p-2.5 rounded border border-[#252A2E]">
              <span className="font-medium text-[#B9B5AC]">Image Rights Verified:</span> Sourced from {product.imageAttribution.source} under {product.imageAttribution.license}. {product.imageAttribution.modifications}.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={getProductWhatsAppUrl(product.name, product.category)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] py-3 px-4 rounded transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <div className="flex items-center gap-3">
              <Link
                to={`/request-a-quote?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-2.5 px-4 rounded transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Request Email Quote</span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-[#B9B5AC] hover:text-white border border-[#2D3237] rounded hover:bg-[#252A2E] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <p className="text-[10px] text-center text-[#8E8B82]">
              Inquiry opens external WhatsApp or secure quote form. No personal data transmitted without your action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
