import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';
import { SITE_CONFIG } from '../../config/siteConfig';

export function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Privacy Policy — Data Protection Notice | Zimbabwe"
        description="Privacy policy and data handling practices for Velquarath Stoneworks under Zimbabwe Cyber and Data Protection Act [Chapter 12:07]."
      />

      <PageHeader
        title="Privacy Policy"
        subtitle="Transparent disclosure of how personal information is collected, processed, and safeguarded when interacting with this website."
        category="Legal & Data Governance"
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Privacy Framework Header */}
        <div className="bg-[#1D2023] border border-[#B79A68]/40 p-5 rounded-lg flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[11px] block">
              Data Protection & Privacy Notice
            </span>
            <p>
              This document provides transparent disclosure of how personal information is handled by <strong>{SITE_CONFIG.brandName}</strong> in accordance with the <strong>Cyber and Data Protection Act [Chapter 12:07]</strong>, statutory instruments, and applicable data protection guidelines in Zimbabwe.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg text-xs sm:text-sm text-[#DFD9CB] space-y-8 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              1. Identity of the Data Controller
            </h2>
            <p className="text-[#B9B5AC]">
              This website is operated by <strong>{SITE_CONFIG.brandName}</strong>. Data controller responsibilities for inquiries submitted via this website are managed by our designated administration team.
            </p>
            <div className="text-[11px] text-[#8E8B82] bg-[#17191B] p-3 rounded">
              Designated Privacy Contact: <span className="text-[#DFD9CB]">{SITE_CONFIG.contact.email}</span> · WhatsApp: <span className="text-[#DFD9CB]">{SITE_CONFIG.contact.whatsAppDisplayNumber}</span>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              2. Categories of Information Collected
            </h2>
            <p className="text-[#B9B5AC]">
              We practice strict <strong>data minimization</strong>. We collect only information that you voluntarily choose to submit when requesting stone quotations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li><strong className="text-[#DFD9CB]">Contact Information:</strong> Your name, phone number, and/or email address.</li>
              <li><strong className="text-[#DFD9CB]">Inquiry Details:</strong> Selected product name (e.g., &ldquo;Three-Step Memorial with Cross Head&rdquo;), product category, and project notes (such as cemetery plot or kitchen dimensions).</li>
              <li><strong className="text-[#DFD9CB]">Consent Records:</strong> Confirmation that you agreed to the handling of your inquiry.</li>
            </ul>
            <div className="bg-[#17191B] p-3 rounded border border-rose-900/30 text-rose-300 text-xs">
              <strong>What we NEVER collect:</strong> We do not collect Zimbabwean National ID numbers, passport copies, credit/debit card numbers, bank credentials, biometric records, or sensitive health data. Please do not submit such details in free-text inquiry fields.
            </div>
          </section>

          {/* Section 3 & 4 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              3. Purpose & Legal Basis for Processing
            </h2>
            <p className="text-[#B9B5AC]">
              Your personal information is processed exclusively for legitimate commercial communication:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li>To evaluate your project requirements and prepare an accurate stonework price quotation.</li>
              <li>To contact you via phone, email, or WhatsApp to discuss stone availability, dimensions, and delivery.</li>
              <li>To prevent fraudulent submissions and automated bot spam via honeypot filtering.</li>
            </ul>
            <p className="text-[#B9B5AC]">
              Under Zimbabwean law, the primary basis for processing inquiry information is taking pre-contractual steps at the request of the prospective customer, supplemented by express consent where applicable.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              4. External WhatsApp Inquiries (+263786967793)
            </h2>
            <p className="text-[#B9B5AC]">
              When you click &ldquo;Chat on WhatsApp&rdquo; or &ldquo;Enquire on WhatsApp,&rdquo; the website opens an external link utilizing the official WhatsApp click-to-chat API (format: <code className="text-[#B79A68]">https://wa.me/263786967793</code>).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li>No personal information is transferred to WhatsApp until you deliberately click send inside your WhatsApp application.</li>
              <li>The interaction takes place over WhatsApp/Meta Platforms infrastructure and is subject to WhatsApp's separate privacy policy and terms.</li>
              <li>We never automatically transmit messages on your behalf; you review every draft before sending.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              5. Inquiry Forms & Email Delivery Destination (muksboogie1@gmail.com)
            </h2>
            <p className="text-[#B9B5AC]">
              When you submit a quotation form on our website:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li>Data is transmitted securely over HTTPS (TLS encryption) directly to our server endpoint (<code className="text-[#B79A68]">/api/inquiries</code>).</li>
              <li>Inquiries are addressed to the designated testing recipient (<strong className="text-[#DFD9CB]">muksboogie1@gmail.com</strong>) via server-side email dispatch (Web3Forms API, Resend, or SMTP).</li>
              <li>Spam honeypots silently filter automated bots without tracking user activity or installing third-party tracking scripts.</li>
              <li>Inquiries are not sold, leased, or broadcast to third-party marketing companies.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              6. Data Retention Periods
            </h2>
            <p className="text-[#B9B5AC]">
              We do not retain inquiry submissions indefinitely:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li><strong className="text-[#DFD9CB]">General Unfulfilled Inquiries:</strong> Retained for a maximum of 90 days to permit follow-up discussions, after which messages are purged.</li>
              <li><strong className="text-[#DFD9CB]">Confirmed Quotations & Orders:</strong> Invoices, stone specifications, and receipts are retained for standard statutory accounting and tax compliance periods under Zimbabwean tax laws.</li>
              <li><strong className="text-[#DFD9CB]">Transmission Logs:</strong> Transient server records are maintained strictly to prevent duplicate inquiry delivery and ensure system security.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              7. Security Safeguards & Limitations
            </h2>
            <p className="text-[#B9B5AC]">
              We implement industry-standard safeguards including HTTPS encryption, server-side payload validation, input sanitization, and hidden honeypot spam traps. However, no internet transmission or electronic communication can be guaranteed 100% immune from compromise. Users are cautioned never to transmit confidential banking numbers or sensitive credentials across standard contact forms.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              8. User Rights Under Zimbabwean Law
            </h2>
            <p className="text-[#B9B5AC]">
              Under the Cyber and Data Protection Act [Chapter 12:07] and recognized international privacy principles, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#B9B5AC]">
              <li>Request confirmation of whether we hold personal records concerning you.</li>
              <li>Request access to or a copy of your submitted inquiry records.</li>
              <li>Request rectification of incorrect or outdated contact details.</li>
              <li>Request deletion of your inquiry details where no ongoing contractual or statutory tax retention obligation exists.</li>
              <li>Withdraw optional marketing consent at any time without affecting your quotation.</li>
            </ul>
            <p className="text-[#B9B5AC]">
              To exercise any of these rights, email our privacy desk at <span className="text-[#DFD9CB] font-medium">{SITE_CONFIG.contact.email}</span>.
            </p>
          </section>

          {/* Section 11 & 12 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              9. Cross-Border Data Transfers
            </h2>
            <p className="text-[#B9B5AC]">
              When interacting with WhatsApp or cloud-hosted servers, technical data packets may cross Zimbabwean international borders to regional and global cloud server centers. Such transfers occur in accordance with standard cryptographic security and data processor clauses.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-[#B9B5AC]">
              We may update this policy periodically to reflect evolving Zimbabwean regulations or operational adjustments. Any updates will be published on this page with a revised date stamp.
            </p>
            <p className="text-[11px] text-[#8E8B82]">
              Policy Version: 1.0 · Last Reviewed: October 2026
            </p>
          </section>
        </div>

        {/* Footer Link to Zimbabwe Legal Checklist */}
        <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#DFD9CB]">
            <Shield className="w-4 h-4 text-[#B79A68]" />
            <span>Inspect the legal regulatory review roadmap prepared for this website.</span>
          </div>
          <Link
            to="/compliance/zimbabwe-legal-review"
            className="text-xs text-[#B79A68] hover:text-[#F5F1E8] font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <span>Legal Review Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
