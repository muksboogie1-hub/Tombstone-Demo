import { Link } from 'react-router-dom';
import { Scale, CheckCircle2, HelpCircle, FileCheck, AlertTriangle } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';

export function ZimbabweLegalReviewPage() {
  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Zimbabwean Legal & Regulatory Review Checklist"
        description="Legal and regulatory compliance roadmap for stone and memorial businesses operating under Zimbabwean law."
      />

      <PageHeader
        title="Zimbabwean Legal & Regulatory Review"
        subtitle="A four-tier legal audit distinguishing verified statutory principles, potential compliance obligations, business-specific parameters, and issues requiring formal Zimbabwean legal counsel."
        category="Statutory Compliance Audit"
        breadcrumbs={[{ label: 'Legal Review' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Advisory Header */}
        <div className="bg-[#1D2023] border border-[#B79A68]/40 p-5 rounded-lg flex items-start gap-3.5">
          <Scale className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[11px] block">
              Professional Legal Disclaimer
            </span>
            <p>
              This analysis identifies statutory touchpoints under the laws of Zimbabwe for website operators and stonemasonry enterprises. It does not constitute formal legal advice. A practicing legal practitioner registered with the <strong>Law Society of Zimbabwe (LSZ)</strong> must review actual contracts, terms, and data flows before public commercial trading.
            </p>
          </div>
        </div>

        {/* 4-Tier Categorized Review */}
        <div className="space-y-8">
          {/* Tier 1: Verified Statutory Frameworks */}
          <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tier 1: Requirements Supported by Verified Zimbabwean Legal Sources</span>
            </div>
            
            <div className="space-y-4 text-xs text-[#DFD9CB]">
              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1.5">
                <span className="font-semibold text-[#B79A68] block">Cyber and Data Protection Act [Chapter 12:07]</span>
                <p className="text-[#B9B5AC] leading-relaxed">
                  Regulates the lawful processing of personal data. Requires data controllers to observe principles of lawfulness, data minimization, accuracy, purpose specification, and security safeguards. POTRAZ acts as the regulatory authority.
                </p>
                <div className="text-[11px] text-emerald-400 pt-1">
                  &bull; Implemented on site: Strict data minimization, no banking/ID collection, honest privacy policy, honeypot protection.
                </div>
              </div>

              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1.5">
                <span className="font-semibold text-[#B79A68] block">Consumer Protection Act [Chapter 14:44]</span>
                <p className="text-[#B9B5AC] leading-relaxed">
                  Prohibits unfair, deceptive, or misleading commercial representations; protects consumer rights to fair value, good quality, and truthful product disclosures; restricts unilateral price variations without consumer consent.
                </p>
                <div className="text-[11px] text-emerald-400 pt-1">
                  &bull; Implemented on site: Prohibition on fake reviews/awards, clear distinction between custom engraved stone and stock items, honest quotation validity periods.
                </div>
              </div>

              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1.5">
                <span className="font-semibold text-[#B79A68] block">Common Law of Contract (Roman-Dutch Law)</span>
                <p className="text-[#B9B5AC] leading-relaxed">
                  Governs offer, acceptance, consensus, and terms. Website display of illustrative products constitutes an <em>invitatio ad offerendum</em> (invitation to treat), rather than an open offer binding the stonemason before custom quotation.
                </p>
                <div className="text-[11px] text-emerald-400 pt-1">
                  &bull; Implemented on site: Terms explicitly clarify that website browsing and price requests do not create a binding contract without written agreement.
                </div>
              </div>
            </div>
          </section>

          {/* Tier 2: Potential Obligations */}
          <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Tier 2: Potential Obligations Requiring Operational Research</span>
            </div>

            <div className="space-y-3 text-xs text-[#B9B5AC]">
              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E]">
                <strong className="text-[#DFD9CB] block mb-1">Cemetery Authority Permits & Bylaws</strong>
                <p>Municipalities (City of Harare, Bulawayo City Council) and private memorial parks (Glen Forest, Zororo, Greendale) enforce specific permit procedures, headstone dimension limits, and foundation inspections before stones can be erected on grave sites.</p>
              </div>

              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E]">
                <strong className="text-[#DFD9CB] block mb-1">Electronic Transactions & Communications Framework</strong>
                <p>Applicability of electronic signature acceptance (e.g. signing inscription proofs via WhatsApp or PDF) under current electronic transactions statutory instruments.</p>
              </div>
            </div>
          </section>

          {/* Tier 3: Business-Specific Facts */}
          <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <FileCheck className="w-4 h-4 text-[#B79A68]" />
              <span>Tier 3: Business-Specific Facts to Be Confirmed by Client</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#DFD9CB]">
              <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">
                &bull; Registered corporate entity name & Company Registration Number (CR6/CR14)
              </div>
              <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">
                &bull; Zimbabwe Revenue Authority (ZIMRA) Business Partner (BP) Number & Tax Clearance
              </div>
              <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">
                &bull; Physical municipal operating licenses for stone cutting yard / showroom
              </div>
              <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">
                &bull; Bank details for local ZWG / USD invoicing
              </div>
            </div>
          </section>

          {/* Tier 4: Legal Practitioner Questions */}
          <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1E8]">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Tier 4: Questions Requiring Advice from a Qualified Zimbabwean Legal Practitioner</span>
            </div>

            <ol className="list-decimal pl-5 space-y-2 text-xs text-[#B9B5AC]">
              <li>Does the eventual client business intend to take non-refundable deposits exceeding 50% for customized tombstones, and how does this interact with the Consumer Protection Act?</li>
              <li>What specific statutory wording is required on quotation documents regarding currency settlement (USD vs ZWG) under current Reserve Bank of Zimbabwe exchange directives?</li>
              <li>If the business registers with POTRAZ as a data controller, what data protection officer (DPO) designation requirements apply to their physical records?</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
