import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Eye, Keyboard, Sparkles, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';
import { SITE_CONFIG } from '../../config/siteConfig';

export function AccessibilityStatementPage() {
  const testingChecklist = [
    { item: 'Semantic HTML markup (header, nav, main, section, article, footer, aside)', status: 'Implemented' },
    { item: 'Logical heading hierarchy without skipped levels (h1 to h4)', status: 'Implemented' },
    { item: 'Keyboard navigable menus, product modals, and gallery tabs with focus rings', status: 'Tested' },
    { item: 'Escape key listener to close dialogs and trap focus when open', status: 'Implemented' },
    { item: 'High-contrast text & borders meeting WCAG 2.2 AA ratio (>4.5:1 for body text)', status: 'Verified' },
    { item: 'All form controls have explicitly associated <label> elements (no placeholder-only labels)', status: 'Implemented' },
    { item: 'Descriptive alternative text on all meaningful stone and memorial photographs', status: 'Implemented' },
    { item: 'Respects prefers-reduced-motion media query for users sensitive to motion', status: 'Implemented in CSS' },
    { item: 'Touch targets >= 44x44px on mobile devices for tap usability', status: 'Implemented' },
    { item: 'Screen-reader friendly live status alerts (role="status" and role="alert")', status: 'Implemented' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Accessibility Statement — WCAG 2.2 AA Commitment"
        description="Accessibility statement and manual verification checklist for Velquarath Stoneworks, targeting WCAG 2.2 AA conformance."
      />

      <PageHeader
        title="Accessibility Statement"
        subtitle="Our commitment to ensuring that digital memorial exploration and stonework inquiries are accessible to all visitors, including people with visual, motor, and cognitive disabilities."
        category="Inclusion & Usability"
        breadcrumbs={[{ label: 'Accessibility Statement' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Conformance Status Notice */}
        <div className="bg-[#1D2023] border border-[#B79A68]/40 p-5 rounded-lg flex items-start gap-3.5">
          <Eye className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[11px] block">
              Conformance Target: WCAG 2.2 Level AA
            </span>
            <p>
              We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. Rather than treating accessibility as an afterthought or claiming unconditional perfection, we maintain active testing and welcome user feedback to continually resolve barriers.
            </p>
          </div>
        </div>

        {/* Technical Measures */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg text-xs sm:text-sm text-[#DFD9CB] space-y-8 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              Key Accessibility Features Implemented
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1.5">
                <span className="font-semibold text-[#B79A68] flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4" />
                  <span>Full Keyboard Operability</span>
                </span>
                <p className="text-[11px] text-[#8E8B82]">
                  Every link, gallery tab, dialog modal, and form control can be reached and activated using Tab, Enter, Space, and Esc without getting trapped.
                </p>
              </div>

              <div className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1.5">
                <span className="font-semibold text-[#B79A68] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>High Contrast & Typography</span>
                </span>
                <p className="text-[11px] text-[#8E8B82]">
                  Warm ivory (#F5F1E8) and muted stone (#B9B5AC) on deep charcoal (#17191B) provide high contrast ratios exceeding the 4.5:1 minimum threshold.
                </p>
              </div>
            </div>
          </section>

          {/* Verification Table */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              Manual Accessibility Verification Checklist
            </h2>
            <p className="text-[#B9B5AC]">
              The following criteria have been tested across desktop and mobile screen viewports:
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border border-[#2D3237] rounded">
                <thead className="bg-[#17191B] text-[#B79A68] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3 border-b border-[#2D3237]">Checkpoint & Guideline</th>
                    <th className="p-3 border-b border-[#2D3237] w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A2E] text-[#B9B5AC]">
                  {testingChecklist.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3">{item.item}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Feedback & Contact */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              Feedback & Assistance
            </h2>
            <p className="text-[#B9B5AC]">
              If you experience any accessibility barrier while browsing our memorial gallery or submitting a quotation request, please reach out to our team:
            </p>
            <div className="bg-[#17191B] p-4 rounded border border-[#2D3237] space-y-1 text-xs">
              <div><strong className="text-[#DFD9CB]">Email:</strong> {SITE_CONFIG.contact.email}</div>
              <div><strong className="text-[#DFD9CB]">WhatsApp Assistance:</strong> {SITE_CONFIG.contact.whatsAppDisplayNumber}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
