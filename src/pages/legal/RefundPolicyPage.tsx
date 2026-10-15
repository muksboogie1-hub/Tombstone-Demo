import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';
import { SITE_CONFIG } from '../../config/siteConfig';

export function RefundPolicyPage() {
  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Refund & Cancellation Policy — Memorial Stonework | Zimbabwe"
        description="Comprehensive draft refund, cancellation, deposit, and defect policy for custom memorials and standard stonework in Zimbabwe."
      />

      <PageHeader
        title="Refund & Cancellation Policy"
        subtitle="Transparent policies distinguishing general inquiries, bespoke engraved memorials, standard stone components, and statutory defect remedies."
        category="Consumer Rights & Cancellations"
        breadcrumbs={[{ label: 'Refund Policy' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Draft Notice */}
        <div className="bg-[#1D2023] border border-[#B79A68]/40 p-5 rounded-lg flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[11px] block">
              Draft Policy Requiring Client & Legal Review
            </span>
            <p>
              This draft policy is structured to meet consumer fairness standards under Zimbabwe's <strong>Consumer Protection Act [Chapter 14:44]</strong>. Specific deposit percentages, cancellation notice windows, and return logistics must be confirmed with the client business's financial and legal advisors before public launch.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg text-xs sm:text-sm text-[#DFD9CB] space-y-8 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              1. Distinction Between Order Stages
            </h2>
            <p className="text-[#B9B5AC]">
              To protect both consumers and stonemasons, rights and obligations depend on the stage of the project:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E]">
                <h3 className="font-semibold text-[#B79A68] mb-1">A. Inquiries & Quotes</h3>
                <p className="text-[11px] text-[#8E8B82]">Browsing the catalog and requesting quotations carries zero financial obligation. No deposit is required to discuss options.</p>
              </div>
              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E]">
                <h3 className="font-semibold text-[#B79A68] mb-1">B. Pre-Cutting Phase</h3>
                <p className="text-[11px] text-[#8E8B82]">After deposit payment, but before raw granite slabs have been sawn or inscribed. Cancellation remains feasible with minimal administrative deduction.</p>
              </div>
              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E]">
                <h3 className="font-semibold text-[#B79A68] mb-1">C. Fabrication & Carving</h3>
                <p className="text-[11px] text-[#8E8B82]">Once bespoke engraving, sandblasting, or customized dimension cuts have commenced on the dedicated stone.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              2. Custom Memorials vs. Standard Stock Components
            </h2>
            <div className="space-y-3 text-[#B9B5AC]">
              <div>
                <strong className="text-[#DFD9CB]">Customized & Engraved Memorials:</strong>
                <p>
                  Products personalized with family names, birth/death dates, bespoke epitaphs, or custom dimensions cannot be resold to other clients once carved. If a customer cancels an order after inscription carving has been authorized, the deposit will be applied towards the costs of the unrecoverable stone slab and labor expended up to that date, with any unused portion refunded.
                </p>
              </div>
              <div>
                <strong className="text-[#DFD9CB]">Standard Uncut Stock Items:</strong>
                <p>
                  Standard stone items (such as standard un-inscribed vases, standard uncut window sills, or stock pavers) that remain in pristine, unaltered condition may be returned or cancelled prior to site delivery, subject to a reasonable handling fee for restocking.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              3. Defective Products & Material Discrepancies
            </h2>
            <p className="text-[#B9B5AC]">
              Nothing in this policy limits statutory remedies under Zimbabwean consumer law for defective goods:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li><strong className="text-[#DFD9CB]">Inscriptions Differing from Approved Proof:</strong> If an inscription deviates in spelling, date, or layout from the final proof signed off by the customer, the stonemason will rectify, re-face, or replace the headstone at no additional charge to the customer.</li>
              <li><strong className="text-[#DFD9CB]">Structural Stone Defects:</strong> If raw stone possesses hidden internal fissures or structural cracks not attributable to natural surface grain, the stone will be replaced.</li>
              <li><strong className="text-[#DFD9CB]">Transit & Installation Damage:</strong> Where installation or delivery is contracted with the business, any chipping or damage occurring in transit is the responsibility of the delivery team to make good.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              4. Configurable Terms (For Client Handover)
            </h2>
            <p className="text-[#B9B5AC]">
              The following operational terms must be configured for the operational business:
            </p>
            <div className="bg-[#17191B] p-4 rounded border border-[#2D3237] space-y-2 text-xs">
              <div><strong className="text-[#DFD9CB]">Standard Deposit:</strong> [Configurable: Typically 50% upon signing, balance upon pre-installation inspection]</div>
              <div><strong className="text-[#DFD9CB]">Pre-Carving Cancellation Window:</strong> [Configurable: e.g. Within 7 calendar days of order confirmation prior to stone sawing]</div>
              <div><strong className="text-[#DFD9CB]">Refund Processing Timeline:</strong> [Configurable: e.g. Processed via original payment channel within 14 business days]</div>
              <div><strong className="text-[#DFD9CB]">Dispute Contact:</strong> {SITE_CONFIG.contact.email}</div>
            </div>
          </section>
        </div>

        {/* Backlink */}
        <div className="text-right">
          <Link
            to="/compliance/zimbabwe-legal-review"
            className="text-xs text-[#B79A68] hover:underline font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <span>Examine Zimbabwean Consumer Law Considerations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
