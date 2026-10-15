import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';
import { SITE_CONFIG } from '../../config/siteConfig';

export function ProductionHandoverPage() {
  const unfinishedIntegrations = [
    {
      item: 'Production SMTP / Transactional Email Provider',
      status: 'Ready for Key',
      location: '.env / Server Environment Variables',
      actionNeeded:
        'Currently, the inquiry handler validates inputs, logs records, and provides transparent simulated delivery. To send actual outbound emails to enquiries@velquarath.co.zw, set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS in server environment variables.',
    },
    {
      item: 'Custom Domain SSL Binding (.co.zw or .com)',
      status: 'Pending Client Registrar',
      location: 'DNS Zone File',
      actionNeeded:
        'Point domain DNS records from Zimbabwe registrar (e.g. Webdev Zimbabwe) to host IP; configure automated Let’s Encrypt / Cloudflare SSL certificate.',
    },
    {
      item: 'Google Search Console Verification Token',
      status: 'Pending Domain Connection',
      location: 'DNS TXT Record / index.html',
      actionNeeded:
        'Insert client-specific Google Site Verification meta tag or DNS TXT token once live domain is connected.',
    },
  ];

  const placeholdersToReplace = [
    {
      field: 'WhatsApp Business Number',
      currentValue: `${SITE_CONFIG.contact.whatsAppNumberDigits} (${SITE_CONFIG.contact.whatsAppDisplayNumber})`,
      fileLocation: 'src/config/siteConfig.ts -> contact.whatsAppNumberDigits',
      instructions:
        'Replace with client’s active Zimbabwe WhatsApp business line. Numbers must include country code 263 without + or spaces.',
    },
    {
      field: 'Showroom & Yard Physical Address',
      currentValue: `${SITE_CONFIG.contact.physicalAddress}, ${SITE_CONFIG.contact.city}`,
      fileLocation: 'src/config/siteConfig.ts -> contact.physicalAddress',
      instructions:
        'Replace placeholder with client’s verified physical workshop, showroom, or sales yard address in Harare/Bulawayo.',
    },
    {
      field: 'Business Voice Landline & Mobile',
      currentValue: SITE_CONFIG.contact.telephoneDisplay,
      fileLocation: 'src/config/siteConfig.ts -> contact.telephoneDisplay',
      instructions:
        'Replace with verified business telephone numbers (e.g. Econet, NetOne, or TelOne landlines).',
    },
    {
      field: 'Official Business Email Inbox',
      currentValue: SITE_CONFIG.contact.email,
      fileLocation: 'src/config/siteConfig.ts -> contact.email',
      instructions:
        'Replace with client’s official domain-hosted email address (e.g. sales@yourclientdomain.co.zw).',
    },
    {
      field: 'Demonstration Banner Mode Flag',
      currentValue: 'isDemoMode: true',
      fileLocation: 'src/config/siteConfig.ts -> isDemoMode',
      instructions:
        'Toggle to `false` once all client credentials, inventory pricing, and legal registrations are verified.',
    },
  ];

  const testReport = [
    {
      category: 'Navigation & Routing',
      test: 'All 15 individual routes load with working URLs and no broken links',
      result: 'TESTED & VERIFIED',
      verified: true,
      notes: 'Browser history sync tested across Home, Products, Tombstones, Countertops, Sills, Gallery, About, Quote, Contact, and all Legal pages.',
    },
    {
      category: 'Gallery Filtering',
      test: 'Category filters (Tombstones, Countertops, Sills, All Designs) dynamically filter catalog',
      result: 'TESTED & VERIFIED',
      verified: true,
      notes: 'Filter buttons properly change state, update URL query parameters, and restore full list on All Designs.',
    },
    {
      category: 'Product Inspection Dialog',
      test: 'Dialog opens on design select, traps focus, responds to Escape key, and shows high-res details',
      result: 'TESTED & VERIFIED',
      verified: true,
      notes: 'Keyboard focus management and Esc dismiss verified; background scroll locked while open.',
    },
    {
      category: 'Mobile Navigation Scroll Lock',
      test: 'Background page completely locked from scrolling when menu opens, restored upon close',
      result: 'TESTED & VERIFIED',
      verified: true,
      notes: 'Applied body fixed position with negative top offset for iOS Safari compatibility, overscroll-contain, and automatic cleanup on route change and Escape key.',
    },
    {
      category: 'WhatsApp Integration',
      test: 'WhatsApp buttons construct correct https://wa.me/263786967793 link with encoded product name',
      result: 'TESTED & VERIFIED',
      verified: true,
      notes: 'Connected to testing number +263786967793. Generates prefilled format: "Hello, I\'m interested in the [Product Name]. Could you please provide more details and a quotation?"',
    },
    {
      category: 'Inquiry Server API & Validation',
      test: 'POST /api/inquiries validates name, category, message, email format, and rejects honeypot bots',
      result: 'TESTED & VERIFIED',
      verified: true,
      notes: 'Server validates payload, rejects invalid emails, drops bot submissions, and routes inquiries to muksboogie1@gmail.com.',
    },
    {
      category: 'Outbound Email Delivery to muksboogie1@gmail.com',
      test: 'Direct external transmission via Web3Forms, Resend, or SMTP to muksboogie1@gmail.com',
      result: 'AWAITING KEY IN .ENV (Unverified until test email sent)',
      verified: false,
      notes: 'Server adapters implemented. To receive real test emails at muksboogie1@gmail.com, add WEB3FORMS_ACCESS_KEY or RESEND_API_KEY to .env (see instructions in .env.example).',
    },
    {
      category: 'Payment / Transaction System',
      test: 'Online credit card payment gateway',
      result: 'EXCLUDED BY DESIGN',
      verified: true,
      notes: 'Intentionally excluded in compliance with specification (no payment card collection needed; custom stone is invoiced directly).',
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Production Handover, Unfinished Integrations & QA Report"
        description="Comprehensive technical handover report distinguishing tested features, unfinished integrations, and placeholder items for Velquarath Stoneworks."
      />

      <PageHeader
        title="Production Handover & QA Report"
        subtitle="An honest, engineering-grade audit detailing tested functionality, configuration requirements, and the complete checklist needed before presenting the website as a commercial entity."
        category="Deployment Audit & Handover"
        breadcrumbs={[{ label: 'Handover & QA Report' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Deliverable 18: Unfinished Integrations */}
        <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <Wrench className="w-4 h-4" />
            <span>Deliverable 18</span>
          </div>
          <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            List of Unfinished Integrations
          </h2>
          <p className="text-xs text-[#B9B5AC] leading-relaxed">
            In compliance with our commitment to transparency, the following external services require real credentials before they can function in production:
          </p>

          <div className="space-y-3 pt-2">
            {unfinishedIntegrations.map((item, idx) => (
              <div key={idx} className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-[#F5F1E8] text-sm">{item.item}</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold">
                    {item.status}
                  </span>
                </div>
                <div className="text-[#8E8B82] text-[11px]">
                  Configuration Location: <code className="text-[#B79A68]">{item.location}</code>
                </div>
                <p className="text-[#B9B5AC] leading-relaxed">{item.actionNeeded}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverable 19: Placeholders to Replace */}
        <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <FileText className="w-4 h-4" />
            <span>Deliverable 19</span>
          </div>
          <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            List of Placeholders to Be Replaced Before Commercial Launch
          </h2>
          <p className="text-xs text-[#B9B5AC] leading-relaxed">
            All business details are centralized in <code className="text-[#B79A68]">src/config/siteConfig.ts</code>. Replace each placeholder item below with real verified client information:
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border border-[#2D3237] rounded bg-[#17191B]">
              <thead className="bg-[#121415] text-[#B79A68] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 border-b border-[#2D3237]">Field</th>
                  <th className="p-3 border-b border-[#2D3237]">Current Demo Value</th>
                  <th className="p-3 border-b border-[#2D3237]">Client Handover Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A2E] text-[#B9B5AC]">
                {placeholdersToReplace.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-[#F5F1E8]">{item.field}</td>
                    <td className="p-3 text-[11px] text-[#DFD9CB]">
                      <code>{item.currentValue}</code>
                    </td>
                    <td className="p-3 text-[11px] text-[#8E8B82]">{item.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deliverable 20: Test Report */}
        <section className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Deliverable 20</span>
          </div>
          <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            Quality Assurance Test Report
          </h2>
          <p className="text-xs text-[#B9B5AC] leading-relaxed">
            A rigorous distinction between functionality that has been tested and verified versus features pending client credentials:
          </p>

          <div className="space-y-3 pt-2">
            {testReport.map((t, idx) => (
              <div key={idx} className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#B79A68] font-semibold">{t.category}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1 ${
                    t.verified ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {t.verified && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{t.result}</span>
                  </span>
                </div>
                <h3 className="font-serif text-base text-[#F5F1E8] font-bold">{t.test}</h3>
                <p className="text-xs text-[#B9B5AC] leading-relaxed">{t.notes}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
