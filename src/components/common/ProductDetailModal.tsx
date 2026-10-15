import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types/content';
import { getImageDisplayStyles } from '../../utils/imageStyles';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;

    // Focus close button on open for accessibility
    closeButtonRef.current?.focus();

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [product, onClose]);

  if (!product) return null;

  // Retrieve editable specification values with sensible fallbacks
  const sectionHeading =
    product.specifications?.heading || 'Craftsmanship & Specifications';
  const stoneOptions =
    product.specifications?.materialOptions ||
    'Grey Granite, Zimbabwe Black, Light Granite';
  const surfaceFinish =
    product.specifications?.finish ||
    'Fine honed matte or full high-gloss polish';
  const dimensionsAndSizing =
    product.specifications?.sizingNote ||
    'Available in standard cemetery regulatory heights. Contact us to discuss available options.';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="bg-[#1D2023] border border-[#2D3237] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative text-[#F5F1E8] flex flex-col md:flex-row"
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

        {/* Product Image Column with preserved zoom, position, and fit mode */}
        <div className="md:w-1/2 relative bg-[#121415] min-h-[260px] sm:min-h-[300px] md:min-h-[360px] overflow-hidden flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            loading="eager"
            style={getImageDisplayStyles(product.imageSettings)}
            className="w-full h-full max-h-[420px] md:max-h-none select-none transition-transform duration-300"
          />
        </div>

        {/* Content Column: Product Name + Craftsmanship & Specifications only */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center space-y-6">
          {/* 1. Product/Design Name */}
          <h2
            id="product-modal-title"
            className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold leading-tight"
          >
            {product.name}
          </h2>

          {/* 2. Craftsmanship & Specifications Section */}
          <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded-lg space-y-4 text-xs">
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#B79A68] tracking-wide border-b border-[#252A2E] pb-2.5">
              {sectionHeading}
            </h3>

            {/* 3. The Three Required Specification Fields */}
            <div className="space-y-3 pt-0.5 text-[#DFD9CB]">
              <div>
                <span className="font-semibold text-[#F5F1E8]">Stone Options:</span>{' '}
                <span className="text-[#B9B5AC]">{stoneOptions}</span>
              </div>
              <div>
                <span className="font-semibold text-[#F5F1E8]">Surface Finish:</span>{' '}
                <span className="text-[#B9B5AC]">{surfaceFinish}</span>
              </div>
              <div>
                <span className="font-semibold text-[#F5F1E8]">Dimensions & Sizing:</span>{' '}
                <span className="text-[#B9B5AC]">{dimensionsAndSizing}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
