import { ShieldCheck, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { PageHeader } from '../../components/common/PageHeader';
import { PRODUCTS } from '../../data/products';

export function ImageLicensesPage() {
  const heroImageRecord = {
    title: 'Homepage Cinematic Hero Image (Memorial Monolith in Tranquil Setting)',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    source: 'Unsplash (Photo ID 1544717305)',
    photographer: 'Annie Spratt',
    license: 'Unsplash Free Commercial License',
    attributionRequired: 'No (voluntarily attributed for transparency)',
    modificationsAllowed: 'Yes (aspect crop and contrast grading)',
    altText: 'Dignified stone memorial structure standing serenely under soft ambient sky',
  };

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Copyright & Image License Registry — Verified Visual Assets"
        description="Comprehensive licensing registry verifying commercial permissions, creator credits, and usage rights for every photograph on Velquarath Stoneworks."
      />

      <PageHeader
        title="Copyright & Image License Registry"
        subtitle="A complete audit of every visual asset deployed on this website, recording creator credits, verifiable licensing permissions, attribution rules, and modification disclosures."
        category="Intellectual Property Audit"
        breadcrumbs={[{ label: 'Image Licenses' }]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Verification Summary Banner */}
        <div className="bg-[#1D2023] border border-emerald-500/40 p-5 rounded-lg flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-[#B9B5AC] space-y-1">
            <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px] block">
              100% Commercial Usage Verification
            </span>
            <p className="leading-relaxed">
              No images were downloaded from Google Images, Pinterest, competitor websites, or unverified social media accounts. Every photograph was sourced under verified free commercial licenses permitting commercial website use, digital cropping, and tone grading without copyright infringement.
            </p>
          </div>
        </div>

        {/* Hero Asset Record */}
        <div className="bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
            <ImageIcon className="w-4 h-4" />
            <span>Key Hero Asset Record</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-48 aspect-4/3 rounded overflow-hidden bg-[#121415] shrink-0">
              <img
                src={heroImageRecord.imageUrl}
                alt={heroImageRecord.altText}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-xs text-[#DFD9CB] flex-1">
              <h3 className="font-serif text-lg text-[#F5F1E8] font-bold">
                {heroImageRecord.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#B9B5AC]">
                <div><strong className="text-[#DFD9CB]">Creator:</strong> {heroImageRecord.photographer}</div>
                <div><strong className="text-[#DFD9CB]">Source:</strong> {heroImageRecord.source}</div>
                <div><strong className="text-[#DFD9CB]">License:</strong> {heroImageRecord.license}</div>
                <div><strong className="text-[#DFD9CB]">Modifications:</strong> {heroImageRecord.modificationsAllowed}</div>
              </div>
              <p className="text-[11px] text-[#8E8B82] pt-1">
                Alt Text: &ldquo;{heroImageRecord.altText}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Product Catalog Image Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D3237] pb-3">
            <h2 className="font-serif text-2xl text-[#F5F1E8] font-bold">
              Product & Design Catalog Image Registry ({PRODUCTS.length} Assets)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#2D3237] rounded bg-[#1D2023]">
              <thead className="bg-[#17191B] text-[#B79A68] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 border-b border-[#2D3237]">Preview</th>
                  <th className="p-3 border-b border-[#2D3237]">Product / Design Name</th>
                  <th className="p-3 border-b border-[#2D3237]">Category</th>
                  <th className="p-3 border-b border-[#2D3237]">Creator</th>
                  <th className="p-3 border-b border-[#2D3237]">License & Terms</th>
                  <th className="p-3 border-b border-[#2D3237]">Modifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A2E] text-[#B9B5AC]">
                {PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-[#222629]/50 transition-colors">
                    <td className="p-3">
                      <div className="w-14 h-11 rounded overflow-hidden bg-[#121415]">
                        <img
                          src={product.imageUrl}
                          alt={product.imageAlt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="p-3 font-medium text-[#F5F1E8]">
                      {product.name}
                    </td>
                    <td className="p-3 text-[11px] text-[#B79A68]">
                      {product.category}
                    </td>
                    <td className="p-3">
                      {product.imageAttribution.photographer}
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-400 font-medium">{product.imageAttribution.license}</span>
                    </td>
                    <td className="p-3 text-[11px] text-[#8E8B82]">
                      {product.imageAttribution.modifications}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
