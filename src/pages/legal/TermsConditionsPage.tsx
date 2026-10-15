import { Link } from 'react-router-dom';
import { FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';
import { SITE_CONFIG } from '../../config/siteConfig';

export function TermsConditionsPage() {
  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Terms & Conditions — Quotation & Commissioning Terms"
        description="Terms and conditions governing product inquiries, stone quotations, and commissioning agreements with Velquarath Stoneworks in Zimbabwe."
      />

      <PageHeader
        title="Terms & Conditions"
        subtitle="Operational terms governing website browsing, stone catalog specifications, quotations, and custom masonry commissions."
        category="Contractual Framework"
        breadcrumbs={[{ label: 'Terms & Conditions' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Commercial Framework Header */}
        <div className="bg-[#1D2023] border border-[#B79A68]/40 p-5 rounded-lg flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[11px] block">
              Commercial Terms & Consumer Rights Notice
            </span>
            <p>
              These terms govern customer inquiries, specifications, and bespoke commissions with <strong>{SITE_CONFIG.brandName}</strong>. Final commercial terms, payment schedules, stone specifications, and warranties are established via formal written quotations and agreements in accordance with the <strong>Consumer Protection Act [Chapter 14:44]</strong> and the law of Zimbabwe.
            </p>
          </div>
        </div>

        {/* Terms Body */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg text-xs sm:text-sm text-[#DFD9CB] space-y-8 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              1. Website Purpose & Scope
            </h2>
            <p className="text-[#B9B5AC]">
              The primary purpose of this website is to showcase stonework craftsmanship concepts, memorial headstones, countertops, and window sill designs. Browsing this website or submitting an inquiry does not constitute a binding purchase contract.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              2. Illustrative Product Photographs & Natural Stone Variation
            </h2>
            <p className="text-[#B9B5AC]">
              Product imagery displayed across this website illustrates style, shape, and architectural potential:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li><strong className="text-[#DFD9CB]">Natural Variation:</strong> Natural granite and marble are geological materials formed over millions of years. Inherent variations in grain density, subtle quartz veining, crystal clustering, and color tone are natural characteristics rather than structural defects.</li>
              <li><strong className="text-[#DFD9CB]">Finishes:</strong> Surface finishes (e.g., polished, honed, flamed) may appear slightly different across computer screens compared to physical natural sunlight.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              3. Quotations, Pricing & Validity
            </h2>
            <p className="text-[#B9B5AC]">
              Because memorial headstones and architectural countertops are fabricated to bespoke measurements and cemetery plot guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li>Display prices (where provided) or preliminary estimates are subject to formal written quotation.</li>
              <li>Official written quotations specify validity periods (typically 14 to 30 calendar days, subject to fuel, currency, and raw slab price volatility).</li>
              <li>Quotations become binding only upon written acceptance and agreement on deposit terms.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              4. Customization & Inscription Approvals
            </h2>
            <p className="text-[#B9B5AC]">
              For custom tombstones, memorials, and engraved stone slabs:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li>Prior to physical sandblasting or hand carving, the customer will receive a digital or printed inscription proof detailing names, birth/passing dates, and lettering layouts.</li>
              <li>The customer is responsible for carefully verifying all spelling, dates, and Shona/Ndebele tribute wording before signing off on carving approval.</li>
              <li>Any changes requested after stone cutting has commenced may incur additional material or re-machining costs.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              5. Cemetery Regulations & Local Permits
            </h2>
            <p className="text-[#B9B5AC]">
              Cemeteries and municipal authorities in Zimbabwe (such as City of Harare cemetery services, Bulawayo City Council, or private memorial parks like Glen Forest and Zororo) enforce strict dimensional limits, foundation requirements, and council permit fees. The customer and stonemason will establish prior to installation who is responsible for obtaining required burial authority permits.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              6. Intellectual Property & Acceptable Use
            </h2>
            <p className="text-[#B9B5AC]">
              All text, graphic layouts, design interfaces, and branding elements appearing on this site are protected by copyright and intellectual property principles. Visitors are granted a limited license to browse and download materials for personal memorial evaluation. Systematic scraping, unauthorized automated extraction, or reproducing proprietary catalog layouts for competing commercial websites is strictly prohibited.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              7. Limitation of Liability & Consumer Rights
            </h2>
            <p className="text-[#B9B5AC]">
              While reasonable efforts are made to ensure the website is accessible and error-free, the site is provided on an &ldquo;as is&rdquo; basis without warranties of uninterrupted service. Nothing in these terms limits or excludes statutory consumer guarantees or rights provided under the <strong>Consumer Protection Act [Chapter 14:44]</strong> or mandatory laws of Zimbabwe that cannot lawfully be disclaimed.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              8. Governing Law & Jurisdiction
            </h2>
            <p className="text-[#B9B5AC]">
              These terms and any non-contractual disputes arising from the use of this website shall be governed by and construed in accordance with the laws of the Republic of Zimbabwe. The courts of Zimbabwe shall have jurisdiction subject to prior amicable commercial dispute resolution.
            </p>
          </section>
        </div>

        {/* Link to Refund Policy */}
        <div className="flex items-center justify-between text-xs text-[#8E8B82]">
          <span>Review our cancellation and deposit terms:</span>
          <Link
            to="/refund-policy"
            className="text-[#B79A68] hover:underline font-semibold uppercase tracking-wider inline-flex items-center gap-1"
          >
            <span>Refund & Cancellation Policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
