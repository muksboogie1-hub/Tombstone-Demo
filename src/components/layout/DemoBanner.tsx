import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, X } from 'lucide-react';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config/siteConfig';

export function DemoBanner() {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('vq_announcement_dismissed') === 'true';
    }
    return false;
  });

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vq_announcement_dismissed', 'true');
    }
  };

  return (
    <aside
      aria-label="Client Announcement Bar"
      className="bg-[#121415] border-b border-[#B79A68]/30 text-[#DFD9CB] text-xs py-2 px-4 sticky top-0 z-50 transition-all shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 text-center md:text-left">
          <span className="inline-flex items-center gap-1 font-semibold text-[#B79A68] tracking-wider uppercase text-[10px] shrink-0">
            Zimbabwe Stoneworks
          </span>
          <p className="text-[#B9B5AC] text-[11px] leading-tight">
            {SITE_CONFIG.announcementText}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#42e881] text-[11px] transition-colors"
          >
            <MessageCircle className="w-3 h-3 text-[#25D366]" />
            <span>WhatsApp Consultation</span>
          </a>

          <Link
            to="/request-a-quote"
            className="inline-flex items-center gap-1 text-[#B79A68] hover:text-[#CBB17F] text-[11px] transition-colors font-medium"
          >
            <FileText className="w-3 h-3 text-[#B79A68]" />
            <span>Request Quote &rarr;</span>
          </Link>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss announcement bar"
            className="text-[#8E8B82] hover:text-[#F5F1E8] p-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
