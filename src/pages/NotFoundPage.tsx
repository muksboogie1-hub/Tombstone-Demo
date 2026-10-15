import { Link } from 'react-router-dom';
import { Home, ArrowRight, Compass, MessageCircle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { getWhatsAppUrl } from '../config/siteConfig';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Page Not Found — 404"
        description="The requested page could not be located on Velquarath Stoneworks. Explore our tombstones, countertops, and memorial gallery."
      />

      <div className="max-w-xl w-full text-center space-y-8 bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg shadow-2xl relative">
        <span className="font-serif text-6xl sm:text-7xl font-bold text-[#B79A68]/40 block">
          404
        </span>

        <div className="space-y-3">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold">
            The Stone You Seek Has Not Been Carved
          </h1>
          <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            The link you followed may have expired, or the page address may have moved. Please explore our stone collections below or return to the main showroom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left pt-2">
          <Link
            to="/tombstones"
            className="p-3 bg-[#17191B] border border-[#252A2E] hover:border-[#B79A68]/50 rounded text-[#DFD9CB] hover:text-[#B79A68] transition-colors flex items-center justify-between"
          >
            <span>Tombstones & Memorials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/countertops-tables"
            className="p-3 bg-[#17191B] border border-[#252A2E] hover:border-[#B79A68]/50 rounded text-[#DFD9CB] hover:text-[#B79A68] transition-colors flex items-center justify-between"
          >
            <span>Countertops & Tables</span>
          <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/window-sills"
            className="p-3 bg-[#17191B] border border-[#252A2E] hover:border-[#B79A68]/50 rounded text-[#DFD9CB] hover:text-[#B79A68] transition-colors flex items-center justify-between"
          >
            <span>Granite Window Sills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/gallery"
            className="p-3 bg-[#17191B] border border-[#252A2E] hover:border-[#B79A68]/50 rounded text-[#DFD9CB] hover:text-[#B79A68] transition-colors flex items-center justify-between"
          >
            <span>Curated Visual Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-6 py-3 rounded transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 px-5 py-3 rounded transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Direct WhatsApp Help</span>
          </a>
        </div>
      </div>
    </div>
  );
}
