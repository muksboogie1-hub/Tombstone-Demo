import { Link } from 'react-router-dom';
import { ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';

export function CookiePolicyPage() {
  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Cookie Policy & Tracking Technologies Disclosure"
        description="Comprehensive technical disclosure of cookies, local storage, and tracking technologies used on Velquarath Stoneworks."
      />

      <PageHeader
        title="Cookie Policy"
        subtitle="Transparent technical disclosure of cookies, client-side storage, and tracker-free architecture deployed across this website."
        category="Privacy & Storage Disclosure"
        breadcrumbs={[{ label: 'Cookie Policy' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Verification Summary Banner */}
        <div className="bg-[#1D2023] border border-emerald-500/40 p-5 rounded-lg flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px] block">
              Audited: Zero Non-Essential Tracking Technologies Deployed
            </span>
            <p className="leading-relaxed">
              This website is intentionally engineered with a <strong>privacy-first, tracker-free architecture</strong>. We do not deploy Google Analytics, Meta tracking pixels, session replay software, profiling trackers, or commercial advertising cookies.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-8 sm:p-12 rounded-lg text-xs sm:text-sm text-[#DFD9CB] space-y-8 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              1. What Are Cookies & Local Storage?
            </h2>
            <p className="text-[#B9B5AC]">
              Cookies are small alphanumeric files placed on your browser or device by web servers. Similar mechanisms include HTML5 Local Storage, Session Storage, and IndexedDB, which store localized state directly inside your browser without communicating back to external tracking servers.
            </p>
          </section>

          {/* Section 2: Technical Audit */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              2. Technical Audit of This Website
            </h2>
            <p className="text-[#B9B5AC]">
              A line-by-line inspection of this website codebase confirms the following technology usage:
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border border-[#2D3237] rounded">
                <thead className="bg-[#17191B] text-[#B79A68] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3 border-b border-[#2D3237]">Category</th>
                    <th className="p-3 border-b border-[#2D3237]">Deployed on Site?</th>
                    <th className="p-3 border-b border-[#2D3237]">Purpose & Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A2E] text-[#B9B5AC]">
                  <tr>
                    <td className="p-3 font-medium text-[#F5F1E8]">Essential Functionality</td>
                    <td className="p-3 text-emerald-400 font-semibold">Yes (Local State)</td>
                    <td className="p-3">Client-side React router navigation and interface session preferences (e.g., announcement bar dismissal). Stored locally in browser session; zero personal data.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#F5F1E8]">Performance / Analytics</td>
                    <td className="p-3 text-rose-400 font-semibold">None Deployed</td>
                    <td className="p-3">No Google Analytics, Hotjar, or telemetry scripts are embedded.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#F5F1E8]">Advertising & Retargeting</td>
                    <td className="p-3 text-rose-400 font-semibold">None Deployed</td>
                    <td className="p-3">No Meta pixels, LinkedIn Insight tags, or advertising network beacons are loaded.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#F5F1E8]">Third-Party Embedded Frames</td>
                    <td className="p-3 text-rose-400 font-semibold">None Deployed</td>
                    <td className="p-3">We avoid external iframe embeds (such as Google Maps or YouTube widgets) that inject third-party cookie payloads.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              3. Why There Is No Invasive Cookie Banner
            </h2>
            <p className="text-[#B9B5AC]">
              Many websites display intrusive pop-up banners solely for visual appearance, even when no tracking cookies exist. Because Velquarath Stoneworks deploys <strong>zero non-essential tracking cookies or profiling technologies</strong>, a disruptive consent blocker is neither legally required nor respectful of user experience.
            </p>
            <div className="bg-[#17191B] p-4 rounded border border-[#2D3237] text-xs text-[#8E8B82] space-y-1.5">
              <span className="font-semibold text-[#DFD9CB] block flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#B79A68]" />
                <span>Pre-Launch Legal Note for Zimbabwe:</span>
              </span>
              <p>
                Zimbabwean data protection law (Cyber and Data Protection Act [Chapter 12:07]) regulates the processing of personal data and electronic communication. While strictly essential functional scripts do not mandate consent, if the client business chooses to integrate Google Analytics, Facebook Pixel, or dynamic Google Maps in the future, a compliant, granular cookie consent manager must be deployed <em>before</em> those third-party scripts execute.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#252A2E] pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
              4. Controlling Storage in Your Browser
            </h2>
            <p className="text-[#B9B5AC]">
              You can configure your browser at any time to block all cookies or notify you when storage is requested:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#B9B5AC]">
              <li>Chrome: Settings &rarr; Privacy and security &rarr; Third-party cookies</li>
              <li>Firefox: Settings &rarr; Privacy & Security &rarr; Enhanced Tracking Protection</li>
              <li>Safari: Settings &rarr; Privacy &rarr; Prevent cross-site tracking</li>
            </ul>
          </section>
        </div>

        {/* Backlink */}
        <div className="text-right">
          <Link
            to="/privacy-policy"
            className="text-xs text-[#B79A68] hover:underline font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <span>Read our Full Privacy Policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
