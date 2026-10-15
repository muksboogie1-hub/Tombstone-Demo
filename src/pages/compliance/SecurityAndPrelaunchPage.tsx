import { Shield, CheckCircle2, Lock, Key, Server, Globe } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';

export function SecurityAndPrelaunchPage() {
  const securityItems = [
    {
      category: 'Network & Transport',
      title: 'HTTPS & TLS 1.3 Transport Encryption',
      status: 'Enforced',
      description: 'All assets, API routes, and pages served over encrypted HTTPS connections; HTTP strictly redirected.',
    },
    {
      category: 'Credential Hygiene',
      title: 'Zero Secrets in Client JavaScript Bundle',
      status: 'Audited',
      description: 'No private API keys, SMTP credentials, or database passwords embedded in Vite client source files.',
    },
    {
      category: 'Inquiry Defense',
      title: 'Honeypot Spam Trap & Server Validation',
      status: 'Active',
      description: 'Hidden form honeypot catches bot submissions without CAPTCHA friction; server enforces strict string lengths and email formats.',
    },
    {
      category: 'Data Minimization',
      title: 'Zero Payment & Financial Data Exposure',
      status: 'Architected',
      description: 'No credit card inputs, banking credentials, or personal identification records are collected or held.',
    },
    {
      category: 'Dependency Risk',
      title: 'Minimal External Package Footprint',
      status: 'Optimized',
      description: 'Lean dependency tree avoiding untrusted third-party trackers, unvetted analytics libraries, or external ad scripts.',
    },
    {
      category: 'Resilience',
      title: 'Graceful Error Boundaries & Custom 404',
      status: 'Tested',
      description: 'Unknown routes handled by customized, branded 404 handler with direct contact failover options.',
    },
  ];

  const launchChecklist = [
    { task: 'Acquire Zimbabwean domain (e.g. .co.zw or .com) and configure DNS records', ready: false },
    { task: 'Enable automatic SSL/TLS certificate provisioning (Let’s Encrypt / Cloudflare)', ready: true },
    { task: 'Configure production SMTP or email service API key in server environment variables', ready: false },
    { task: 'Replace placeholder WhatsApp number in siteConfig.ts with real verified business SIM', ready: false },
    { task: 'Confirm showroom address and landline telephone numbers in siteConfig.ts', ready: false },
    { task: 'Verify Google Search Console domain ownership and submit sitemap.xml', ready: true },
    { task: 'Remove Demo Notice banner by setting isDemoMode: false in siteConfig.ts', ready: false },
    { task: 'Conduct final review with Zimbabwean legal practitioner for quotation terms', ready: false },
  ];

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Security & Pre-Launch Audit Checklist"
        description="Comprehensive technical security audit, input validation practices, and pre-launch deployment checklist for Velquarath Stoneworks."
      />

      <PageHeader
        title="Security & Pre-Launch Audit"
        subtitle="Evaluating architectural safeguards, credential isolation, input validation, and production deployment readiness before public domain connection."
        category="Technical Integrity Audit"
        breadcrumbs={[{ label: 'Security & Pre-Launch' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Architecture Principles */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <Lock className="w-4 h-4" />
            <span>Architecture Rationale</span>
          </div>
          <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            Simplicity as a Security Advantage
          </h2>
          <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            By avoiding user account databases, password authenticators, and online card payments, this website eliminates the most frequent web application attack vectors. Direct WhatsApp links and server-side inquiry routing deliver immediate commercial value without building an unnecessary high-risk target.
          </p>
        </div>

        {/* Security Audit Table */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
            Technical Safeguards Audited
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityItems.map((item, idx) => (
              <div key={idx} className="bg-[#1D2023] border border-[#2D3237] p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-[#B79A68] font-semibold">{item.category}</span>
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </span>
                </div>
                <h4 className="font-serif text-base text-[#F5F1E8] font-bold">{item.title}</h4>
                <p className="text-xs text-[#B9B5AC] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Readiness Checklist */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <Globe className="w-4 h-4" />
            <span>Pre-Launch Handover Checklist</span>
          </div>
          <h3 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            Action Items Prior to Going Live
          </h3>
          <p className="text-xs text-[#B9B5AC]">
            Review these 8 items before transitioning the website from demonstration mode to public trading:
          </p>

          <div className="space-y-2.5 pt-2">
            {launchChecklist.map((task, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-[#17191B] border border-[#252A2E] rounded text-xs text-[#DFD9CB]">
                <span className="w-5 h-5 rounded-full bg-[#252A2E] text-[#B79A68] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <span>{task.task}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${task.ready ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                  {task.ready ? 'Ready in Code' : 'Pending Client Data'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
