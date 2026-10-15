import { Search, CheckCircle2, Globe, FileCode, ExternalLink } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';

export function GoogleIndexingPage() {
  const seoChecklist = [
    { feature: 'Individual Page Titles & Meta Descriptions', status: 'Implemented via SEOHead component on all 15 routes' },
    { feature: 'Search-Engine Friendly Semantic URLs', status: 'Implemented with clean React Router endpoints (/tombstones, etc.)' },
    { feature: 'Public Sitemap (sitemap.xml)', status: 'Generated at /sitemap.xml referencing all canonical URLs' },
    { feature: 'Robots Instruction File (robots.txt)', status: 'Generated at /robots.txt with sitemap reference' },
    { feature: 'Open Graph & Twitter Social Cards', status: 'Configured in index.html for high-fidelity social sharing' },
    { feature: 'Descriptive Alt Text for Search Discoverability', status: 'Embedded on all meaningful stone and memorial images' },
    { feature: 'Branded 404 Error Handling', status: 'Implemented to prevent broken crawling loops' },
    { feature: 'Mobile Network Performance Optimization', status: 'Compressed assets and responsive layout for Zimbabwean mobile speeds' },
  ];

  const searchConsoleSteps = [
    {
      step: '1. Connect Custom Domain',
      details: 'Point DNS A/CNAME records from your registrar (e.g., Webdev Zimbabwe, Namecheap, GoDaddy) to your live host.',
    },
    {
      step: '2. Add Property to Google Search Console',
      details: 'Log into search.google.com/search-console. Select "Domain" property type and enter your domain name.',
    },
    {
      step: '3. Verify Ownership via DNS TXT Record',
      details: 'Copy the google-site-verification token provided by Google and paste it as a TXT record into your DNS provider zone.',
    },
    {
      step: '4. Submit sitemap.xml',
      details: 'Navigate to "Sitemaps" in the left sidebar of Search Console. Enter https://yourdomain.co.zw/sitemap.xml and submit.',
    },
    {
      step: '5. URL Inspection Tool for Priority Pages',
      details: 'Use the URL Inspection bar to inspect https://yourdomain.co.zw/ and request priority crawling for homepage and tombstone gallery.',
    },
    {
      step: '6. Monitor Indexing Status & Coverage',
      details: 'Review the "Pages" report within 48–72 hours to ensure all pages are crawled without canonical or redirect errors.',
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Google Indexing & Search Console Guide — SEO Setup"
        description="Step-by-step instructions for connecting custom domains, submitting sitemaps, and indexing Velquarath Stoneworks in Google Search."
      />

      <PageHeader
        title="Google Indexing & SEO Setup"
        subtitle="A practical engineering roadmap for search engine discovery, sitemap submission, Search Console verification, and Zimbabwean search keyword targeting."
        category="Search Engine Optimization"
        breadcrumbs={[{ label: 'Google Indexing' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* SEO Themes Overview */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <Search className="w-4 h-4" />
            <span>Target Search Themes in Zimbabwe</span>
          </div>
          <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            Organic Search Keywords & Intent
          </h2>
          <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
            The site architecture has been constructed to target key search queries without spammy keyword stuffing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs text-[#DFD9CB]">
            <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">&bull; Tombstones in Zimbabwe</div>
            <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">&bull; Black Granite Memorials Harare</div>
            <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">&bull; Cemetery Headstone Designs</div>
            <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">&bull; Kitchen Granite Countertops</div>
            <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">&bull; Stone Window Sills Bulawayo</div>
            <div className="bg-[#17191B] p-3 rounded border border-[#252A2E]">&bull; Unveiling Ceremony Tombstones</div>
          </div>
        </div>

        {/* Implemented Features Table */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold">
            Technical SEO Assets Ready in Code
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#2D3237] rounded bg-[#1D2023]">
              <thead className="bg-[#17191B] text-[#B79A68] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 border-b border-[#2D3237]">SEO Element</th>
                  <th className="p-3 border-b border-[#2D3237]">Implementation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A2E] text-[#B9B5AC]">
                {seoChecklist.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-[#F5F1E8]">{item.feature}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step-by-Step Search Console Walkthrough */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <Globe className="w-4 h-4" />
            <span>Search Console Submission Guide</span>
          </div>
          <h3 className="font-serif text-2xl text-[#F5F1E8] font-bold">
            How to Submit to Google Search Console
          </h3>

          <div className="space-y-4">
            {searchConsoleSteps.map((s, idx) => (
              <div key={idx} className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-1">
                <span className="font-semibold text-[#B79A68] text-xs block">{s.step}</span>
                <p className="text-xs text-[#B9B5AC] leading-relaxed">{s.details}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#17191B] border border-[#2D3237] rounded text-xs text-[#8E8B82]">
            <strong>Note on Google Guarantees:</strong> In alignment with truth-in-marketing standards, no web developer can guarantee immediate top-rank positioning on Google. Quality content, local backlinks, consistent business citations, and genuine customer engagement over time govern organic rank.
          </div>
        </div>
      </div>
    </div>
  );
}
