import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, AlertCircle, MessageCircle, Info, ShieldCheck, Loader2, HelpCircle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { PRODUCTS } from '../data/products';
import { SITE_CONFIG, getWhatsAppUrl, getProductWhatsAppUrl } from '../config/siteConfig';
import { InquirySuccessConfirmation } from '../components/common/InquirySuccessConfirmation';
import { sendInquiry } from '../services/inquiryService';

export function RequestQuotePage() {
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [category, setCategory] = useState('Tombstones');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [message, setMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Hidden spam trap

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    submissionId: string;
    category?: string;
    product?: string;
  } | null>(null);
  const [uncertainMsg, setUncertainMsg] = useState('');

  // Pre-populate from URL query params
  useEffect(() => {
    const paramCategory = searchParams.get('category');
    const paramProduct = searchParams.get('product');

    if (paramCategory && ['Tombstones', 'Countertops & Tables', 'Window Sills'].includes(paramCategory)) {
      setCategory(paramCategory);
    }
    if (paramProduct) {
      setSelectedProduct(paramProduct);
      setMessage(`Hello, I'm interested in the ${paramProduct}. Could you please provide more details and a quotation?`);
    }
  }, [searchParams]);

  // Client-side pre-validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!name.trim() || name.trim().length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    }

    if (!category) {
      errors.push('Please select a product category.');
    }

    if (!message.trim() || message.trim().length < 10) {
      errors.push('Inquiry message is required (minimum 10 characters).');
    }

    if (email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('Please enter a valid email address (e.g., name@example.com) or leave the field blank.');
      }
    }

    if (telephone.trim().length > 0) {
      const phoneRegex = /^[\d\s+\-()]{6,25}$/;
      if (!phoneRegex.test(telephone.trim())) {
        errors.push('Please enter a valid telephone number containing standard digits.');
      }
    }

    if (!email.trim() && !telephone.trim()) {
      errors.push('Please provide at least one contact channel (email address or phone number) so we can respond to your inquiry.');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setUncertainMsg('');
    setSubmissionSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendInquiry({
        name: name.trim(),
        email: email.trim() || undefined,
        telephone: telephone.trim() || undefined,
        category,
        selectedProduct: selectedProduct || undefined,
        message: message.trim(),
        consentGiven,
        marketingConsent,
        honeypot,
      });

      if (result.status === 'success') {
        setSubmissionSuccess({
          submissionId: result.submissionId,
          category,
          product: selectedProduct,
        });
        setMessage('');
      } else if (result.status === 'uncertain') {
        setUncertainMsg(result.message);
      } else {
        const errorList = [
          result.message ||
            'The server encountered an issue processing your quotation request. Please try again or use WhatsApp.',
        ];
        setFormErrors(errorList);
      }
    } catch {
      setFormErrors([
        'Unable to connect to the inquiry submission service. Please verify your connection or contact us directly on WhatsApp (+263 78 696 7793).',
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Request a Quote — Bespoke Memorials & Granite Works"
        description="Request a formal price quotation for custom tombstones, granite memorials, kitchen countertops, and window sills in Zimbabwe."
      />

      <PageHeader
        title="Request a Quotation"
        subtitle="Submit your project details to receive specifications, stone options, and pricing directly from our stonemasons. For urgent inquiries, WhatsApp provides immediate assistance."
        category="Direct Inquiry"
        breadcrumbs={[{ label: 'Request a Quote' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#1D2023] border border-[#2D3237] p-6 sm:p-10 rounded-lg shadow-xl space-y-6">
            {submissionSuccess ? (
              <InquirySuccessConfirmation
                submissionId={submissionSuccess.submissionId}
                category={submissionSuccess.category}
                product={submissionSuccess.product}
                onReset={() => setSubmissionSuccess(null)}
                resetButtonText="Submit Another Quote Request"
              />
            ) : (
              <>
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
                    Project & Memorial Inquiry
                  </h2>
                  <p className="text-xs text-[#B9B5AC] mt-1">
                    Fields marked with an asterisk (<span className="text-[#B79A68]">*</span>) are required.
                  </p>
                </div>

                {/* Uncertain Delivery Notice */}
                {uncertainMsg && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-lg space-y-3 text-xs text-amber-200 animate-in fade-in"
                  >
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-semibold block text-amber-300">Delivery Status Unconfirmed</span>
                        <p>{uncertainMsg}</p>
                      </div>
                    </div>
                    <div className="pt-1">
                      <a
                        href={getWhatsAppUrl(`Hello Velquarath Stoneworks, I attempted to submit a quotation request for ${category} on your website and would like to follow up directly.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] text-xs font-semibold uppercase tracking-wider py-2 px-3 rounded transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Connect on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Error Message List */}
                {formErrors.length > 0 && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="bg-rose-950/40 border border-rose-600/40 p-4 rounded-lg space-y-1.5 text-xs text-rose-200 animate-in fade-in"
                  >
                    <div className="flex items-center gap-2 text-rose-400 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Please resolve the following issues:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-rose-300 text-[11px]">
                      {formErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Spam Honeypot (Hidden from real users, caught by bots) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Leave this empty</label>
                <input
                  id="website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="inquiry-name" className="block text-xs uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1.5">
                  Your Full Name <span className="text-[#B79A68]">*</span>
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farai Moyo"
                  className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:outline-hidden transition-colors"
                />
              </div>

              {/* Contact Channels (Email + Telephone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-email" className="block text-xs uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1.5">
                    Email Address <span className="text-[10px] text-[#8E8B82] normal-case">(optional)</span>
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farai@example.com"
                    className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-phone" className="block text-xs uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1.5">
                    Telephone / WhatsApp <span className="text-[10px] text-[#8E8B82] normal-case">(optional)</span>
                  </label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+263 77..."
                    className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Product Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-category" className="block text-xs uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1.5">
                    Product Category <span className="text-[#B79A68]">*</span>
                  </label>
                  <select
                    id="inquiry-category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:outline-hidden transition-colors"
                  >
                    <option value="Tombstones">Tombstones & Memorials</option>
                    <option value="Countertops & Tables">Countertops & Tables</option>
                    <option value="Window Sills">Granite Window Sills</option>
                    <option value="General Stonework">Other Architectural Stonework</option>
                  </select>
                </div>

                {/* Specific Design (Optional) */}
                <div>
                  <label htmlFor="inquiry-product" className="block text-xs uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1.5">
                    Specific Design <span className="text-[10px] text-[#8E8B82] normal-case">(optional)</span>
                  </label>
                  <select
                    id="inquiry-product"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:outline-hidden transition-colors"
                  >
                    <option value="">Select a design or custom inquiry...</option>
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="inquiry-message" className="block text-xs uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1.5">
                  Inquiry Message & Specifications <span className="text-[#B79A68]">*</span>
                </label>
                <textarea
                  id="inquiry-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please specify estimated dimensions, desired cemetery location (e.g., Warren Hills), inscription details, or kitchen plan measurements..."
                  className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:outline-hidden transition-colors resize-y"
                ></textarea>
              </div>

              {/* Privacy Notice (as strictly instructed in Section 13) */}
              <div className="bg-[#17191B] border border-[#2D3237] p-3 rounded text-[11px] text-[#B9B5AC] leading-relaxed">
                Your information will be used to respond to your inquiry. Please avoid including sensitive personal information (such as National ID numbers or financial details). See our{' '}
                <Link to="/privacy-policy" className="text-[#B79A68] underline hover:text-[#F5F1E8]">
                  Privacy Policy
                </Link>{' '}
                for more information.
              </div>

              {/* Separate, optional, unchecked marketing consent */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="marketing-consent"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#2D3237] text-[#B79A68] focus:ring-[#B79A68] bg-[#17191B] cursor-pointer"
                />
                <label htmlFor="marketing-consent" className="text-[11px] text-[#8E8B82] leading-tight cursor-pointer">
                  Optional: You may occasionally notify me regarding new stone catalog additions or seasonal promotional announcements.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-3.5 px-6 rounded transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            </>
          )}
          </div>

          {/* Right Column: Direct WhatsApp & Consultation Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct WhatsApp Callout */}
            <div className="bg-[#1D2023] border border-[#25D366]/40 p-6 sm:p-8 rounded-lg space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#25D366] font-semibold">
                <MessageCircle className="w-4 h-4" />
                <span>Instant Consultation</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
                Prefer to Chat on WhatsApp?
              </h3>

              <p className="text-xs text-[#B9B5AC] leading-relaxed">
                Connect directly with our stonemasonry team to discuss memorial designs, share cemetery plot guidelines, or send kitchen floor sketches:
              </p>

              <a
                href={
                  selectedProduct
                    ? getProductWhatsAppUrl(selectedProduct, category)
                    : getWhatsAppUrl()
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-[#121415] py-3.5 px-4 rounded transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({SITE_CONFIG.contact.whatsAppDisplayNumber})</span>
              </a>

              <p className="text-[10px] text-[#8E8B82] text-center">
                WhatsApp opens on your external device. You review the message before sending.
              </p>
            </div>

            {/* Business Contact Card */}
            <div className="bg-[#17191B] border border-[#2D3237] p-6 rounded-lg space-y-4 text-xs text-[#B9B5AC]">
              <h4 className="font-serif text-base text-[#F5F1E8] font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B79A68]" />
                <span>Direct Showroom Contact</span>
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-[#DFD9CB] font-medium block">Business Email:</span>
                  <span>{SITE_CONFIG.contact.email}</span>
                </div>
                <div>
                  <span className="text-[#DFD9CB] font-medium block">Showroom Telephone:</span>
                  <span>{SITE_CONFIG.contact.telephoneDisplay}</span>
                </div>
                <div>
                  <span className="text-[#DFD9CB] font-medium block">Operating Hours:</span>
                  <span>{SITE_CONFIG.contact.operatingHours}</span>
                </div>
                <div>
                  <span className="text-[#DFD9CB] font-medium block">Service Area:</span>
                  <span>{SITE_CONFIG.contact.serviceArea}</span>
                </div>
              </div>
            </div>

            {/* Data Minimization Guarantee */}
            <div className="bg-[#17191B]/60 border border-[#252A2E] p-4 rounded text-[11px] text-[#8E8B82] space-y-1.5">
              <span className="font-medium text-[#B9B5AC] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#B79A68]" />
                <span>Data Minimization Commitment</span>
              </span>
              <p className="leading-relaxed">
                We only request the details required to reply to your inquiry. We do not store credit card details, national IDs, or sensitive medical/biometric records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
