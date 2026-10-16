import { useEffect, useRef } from 'react';
import { CheckCircle2, MessageCircle, RotateCcw, Clock, ShieldCheck } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SITE_CONFIG } from '../../config/siteConfig';

export interface InquirySuccessConfirmationProps {
  submissionId?: string;
  category?: string;
  product?: string;
  onReset?: () => void;
  resetButtonText?: string;
  className?: string;
}

export function InquirySuccessConfirmation({
  submissionId,
  category,
  product,
  onReset,
  resetButtonText = 'Send Another Message',
  className = '',
}: InquirySuccessConfirmationProps) {
  const { content } = useContent();
  const whatsappButtonRef = useRef<HTMLAnchorElement>(null);

  // Focus the WhatsApp action button when confirmation renders for keyboard & screen reader accessibility
  useEffect(() => {
    whatsappButtonRef.current?.focus();
  }, []);

  // Retrieve configured WhatsApp business line (international clean digits format: 263786967793)
  const configuredDigits = (
    content?.contact?.whatsappDigits ||
    SITE_CONFIG.contact.whatsAppNumberDigits ||
    '263786967793'
  ).replace(/[^0-9]/g, '');

  const displayNumber =
    content?.contact?.whatsappDisplay ||
    SITE_CONFIG.contact.whatsAppDisplayNumber ||
    '+263 78 696 7793';

  // Construct contextual prefilled message without exposing sensitive customer information
  let prefillTopic = '';
  if (product && product.trim().length > 0) {
    prefillTopic = ` regarding "${product.trim()}"`;
  } else if (category && category.trim().length > 0 && category !== 'General Stonework') {
    prefillTopic = ` regarding ${category.trim()}`;
  }

  const refSnippet = submissionId ? ` [Ref: ${submissionId}]` : '';
  const prefilledMessage = `Hello Velquarath Stoneworks, I have just submitted an inquiry through your website${prefillTopic}${refSnippet} and would like to follow up.`;

  const whatsappUrl = `https://wa.me/${configuredDigits}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-[#1D2023] border border-[#2D3237] rounded-lg p-6 sm:p-8 space-y-6 text-[#F5F1E8] shadow-2xl relative animate-in fade-in duration-300 ${className}`}
    >
      {/* Top Banner Accent with Champagne Gold & Emerald */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-bold tracking-tight">
            Message sent successfully!
          </h3>
          <p className="text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            Inquiry Accepted & Dispatched
          </p>
        </div>
      </div>

      {/* Primary Confirmation Body */}
      <div className="space-y-4 text-sm sm:text-base text-[#DFD9CB] leading-relaxed border-t border-[#2D3237] pt-5">
        <p>
          Thank you for contacting Velquarath Stoneworks. We've received your inquiry and will get back to you as soon as possible.
        </p>

        <div className="p-4 rounded-lg bg-[#17191B] border border-[#252A2E] space-y-2">
          <p className="font-semibold text-[#F5F1E8] text-sm sm:text-base">
            Would you like a faster response? Follow up with us on WhatsApp.
          </p>
          <p className="text-xs text-[#B9B5AC] leading-relaxed">
            Our stonemasons are active on WhatsApp during workshop hours for instant design guidance, material selections, and cemetery permit advice.
          </p>
        </div>
      </div>

      {/* Prominent WhatsApp Follow-Up Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <a
          ref={whatsappButtonRef}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow up on WhatsApp with Velquarath Stoneworks at ${displayNumber}`}
          className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851] text-[#121415] font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2023] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 shrink-0 fill-current" />
          <span>Follow Up on WhatsApp</span>
        </a>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 bg-[#17191B] hover:bg-[#252A2E] border border-[#2D3237] text-[#DFD9CB] hover:text-[#F5F1E8] text-xs font-semibold uppercase tracking-wider py-4 px-5 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetButtonText}</span>
          </button>
        )}
      </div>

      {/* Audit & Reference Metadata Footer */}
      <div className="pt-4 border-t border-[#252A2E] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8E8B82]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B79A68]" />
          <span>
            Reference ID:{' '}
            <strong className="text-[#DFD9CB] font-mono">
              {submissionId || 'Pending'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#8E8B82]" />
          <span>Official WhatsApp Desk: <span className="text-[#DFD9CB] font-medium">{displayNumber}</span></span>
        </div>
      </div>
    </div>
  );
}
