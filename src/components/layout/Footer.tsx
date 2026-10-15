import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, FileText, ChevronRight, Lock } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config/siteConfig';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { content } = useContent();

  const brandStatement = content?.footer?.brandStatement || "Bespoke granite memorials, architectural countertops, and custom stone masonry tailored for discerning families and developers across Zimbabwe.";
  const assuranceHeading = content?.footer?.assuranceHeading || "Client Assurance & Standards";
  const assuranceIntro = content?.footer?.assuranceIntro || "Committed to ethical masonry standards, transparent contracts, and regulatory alignment across Zimbabwe:";

  const address = content?.contact
    ? `${content.contact.physicalAddress}, ${content.contact.city}, ${content.contact.country}`
    : `${SITE_CONFIG.contact.physicalAddress}, ${SITE_CONFIG.contact.city}, ${SITE_CONFIG.contact.country}`;
  const phone = content?.contact?.telephoneDisplay || SITE_CONFIG.contact.telephoneDisplay;
  const email = content?.contact?.email || SITE_CONFIG.contact.email;
  const hours = content?.contact?.operatingHours || SITE_CONFIG.contact.operatingHours;

  const customWhatsAppUrl = content?.contact?.whatsappDigits
    ? `https://wa.me/${content.contact.whatsappDigits.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.contact.whatsappGreeting || SITE_CONFIG.contact.whatsAppDefaultGreeting)}`
    : getWhatsAppUrl();

  return (
    <footer className="bg-[#121415] border-t border-[#2D3237] text-[#DFD9CB] pt-16 pb-12 mt-20" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#222629]">
          {/* Column 1: Brand & Craftsmanship */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#F5F1E8]">
                VELQUARATH
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#B79A68] font-sans -mt-1">
                Stoneworks & Memorials
              </span>
            </Link>
            <p className="text-xs text-[#B9B5AC] leading-relaxed">
              &ldquo;{SITE_CONFIG.tagline}&rdquo;
            </p>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              {brandStatement}
            </p>
            <div className="pt-2">
              <a
                href={customWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:text-white transition-colors bg-[#25D366]/10 hover:bg-[#25D366]/20 px-3 py-2 rounded border border-[#25D366]/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Column 2: Products & Stonework */}
          <div>
            <h3 className="font-serif text-base text-[#F5F1E8] mb-4 tracking-wide">
              Stone Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-[#B9B5AC]">
              <li>
                <Link to="/products" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B79A68]" />
                  <span>Comprehensive Portfolio</span>
                </Link>
              </li>
              <li>
                <Link to="/tombstones" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B79A68]" />
                  <span>Tombstones & Memorials</span>
                </Link>
              </li>
              <li>
                <Link to="/countertops-tables" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B79A68]" />
                  <span>Granite Countertops & Tables</span>
                </Link>
              </li>
              <li>
                <Link to="/window-sills" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B79A68]" />
                  <span>Architectural Window Sills</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B79A68]" />
                  <span>Gallery Archive</span>
                </Link>
              </li>
              <li>
                <Link to="/request-a-quote" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#B79A68]" />
                  <span>Request Custom Quotation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="font-serif text-base text-[#F5F1E8] mb-4 tracking-wide">
              Consultation & Inquiries
            </h3>
            <div className="space-y-3 text-xs text-[#B9B5AC]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B79A68] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B79A68] shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B79A68] shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B79A68] shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Client Guidance & Assurance (Preserved Exactly) */}
          <div>
            <h3 className="font-serif text-base text-[#F5F1E8] mb-4 tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B79A68]" />
              <span>{assuranceHeading}</span>
            </h3>
            <p className="text-[11px] text-[#8E8B82] mb-3 leading-relaxed">
              {assuranceIntro}
            </p>
            <ul className="space-y-2 text-xs text-[#B9B5AC]">
              <li>
                <Link to="/compliance/zimbabwe-legal-review" className="hover:text-[#B79A68] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#B79A68]" />
                  <span>Zimbabwe Cemetery Guidelines & Bylaws</span>
                </Link>
              </li>
              <li>
                <Link to="/compliance/image-licenses" className="hover:text-[#B79A68] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#B79A68]" />
                  <span>Material Standards & Image Rights</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#B79A68] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#B79A68]" />
                  <span>Craftsmanship & Stone Origin</span>
                </Link>
              </li>
              <li>
                <Link to="/request-a-quote" className="hover:text-[#B79A68] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#B79A68]" />
                  <span>Formal Quotations & Site Visits</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Policy Links Row */}
        <div className="py-6 border-b border-[#222629] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8E8B82]">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Legal & Policies">
            <Link to="/privacy-policy" className="hover:text-[#F5F1E8] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="hover:text-[#F5F1E8] transition-colors">
              Cookie Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-[#F5F1E8] transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/refund-policy" className="hover:text-[#F5F1E8] transition-colors">
              Refund & Cancellation Policy
            </Link>
            <Link to="/accessibility-statement" className="hover:text-[#F5F1E8] transition-colors">
              Accessibility Statement
            </Link>
            <Link to="/admin" className="hover:text-[#B79A68] transition-colors inline-flex items-center gap-1 text-[11px]">
              <Lock className="w-3 h-3 text-[#B79A68]" />
              <span>Admin Portal</span>
            </Link>
          </nav>
          <div>
            <span>Serving Harare, Bulawayo & Nationwide Zimbabwe</span>
          </div>
        </div>

        {/* Quality & Craftsmanship Notice & Copyright */}
        <div className="pt-6 space-y-3 text-[11px] text-[#8E8B82]">
          <div className="bg-[#17191B] border border-[#2D3237] p-3 rounded">
            <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[10px] block mb-1">
              Craftsmanship & Natural Stone Notice
            </span>
            <p className="leading-relaxed">
              Velquarath Stoneworks specializes in bespoke granite memorials, headstones, and architectural stonework across Zimbabwe. Product specifications and photographs showcase our masonry standards; all final monument dimensions, personalized inscriptions, and stone selections are tailored to client and cemetery requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p>
              &copy; {currentYear} {SITE_CONFIG.brandName}. All rights reserved.
            </p>
            <p className="text-[10px]">
              Built with responsive accessibility (WCAG 2.2 AA target) & zero non-essential trackers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
