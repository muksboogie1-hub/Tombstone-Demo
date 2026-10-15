import { Eye, MessageCircle, ExternalLink } from 'lucide-react';
import { Product } from '../../data/products';
import { getProductWhatsAppUrl } from '../../config/siteConfig';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <article className="bg-[#1D2023] border border-[#2D3237] hover:border-[#B79A68]/50 transition-all duration-300 rounded overflow-hidden flex flex-col group">
      {/* Product Image Frame */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#121415]">
        <img
          src={product.imageUrl}
          alt={product.imageAlt}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1D2023] via-transparent to-transparent opacity-60"></div>
        
        {/* Quick View Overlay Button */}
        <button
          onClick={() => onSelect(product)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
          aria-label={`View design specifications for ${product.name}`}
        >
          <span className="inline-flex items-center gap-1.5 bg-[#17191B]/95 text-[#F5F1E8] text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded border border-[#B79A68]/50 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#B79A68]" />
            <span>Inspect Design</span>
          </span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category Metadata (No static pill enclosure; clean unboxed typography) */}
          <div className="flex items-center gap-2 text-[11px] text-[#B79A68] tracking-widest uppercase font-semibold mb-1.5">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-[#3D434A]">·</span>
            <span className="text-[#8E8B82]">Zimbabwe Granite</span>
          </div>

          <h3 className="font-serif text-lg text-[#F5F1E8] font-bold group-hover:text-[#B79A68] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-[#B9B5AC] mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#252A2E] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(product)}
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
            <span className="hidden sm:inline">Enquire</span>
            <span className="sm:hidden">Enquire via WhatsApp</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </article>
  );
}
