import { Sparkles } from 'lucide-react';

export function BrandedLoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#17191B] text-[#F5F1E8] px-4"
    >
      {/* Subtle Background Radial Aura */}
      <div className="absolute inset-0 bg-radial from-[#252A2E]/50 via-transparent to-[#121415] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Stone Masonry Monogram Logo */}
        <div className="relative w-16 h-16 rounded-full border border-[#B79A68]/40 bg-[#1D2023] flex items-center justify-center shadow-xl shadow-black/40">
          <div className="w-10 h-10 border border-[#B79A68]/70 rotate-45 flex items-center justify-center">
            <span className="font-serif font-bold text-lg text-[#B79A68] -rotate-45">V</span>
          </div>
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full border border-[#B79A68]/20 animate-ping" />
        </div>

        {/* Brand Hierarchy */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] font-semibold text-[#B79A68]">
            <Sparkles className="w-3 h-3 text-[#B79A68]" />
            <span>Zimbabwe Granite Masonry</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#F5F1E8]">
            VELQUARATH STONEWORKS
          </h1>
          <p className="text-xs text-[#8E8B82] tracking-wide">
            Crafted in Stone. Remembered Forever.
          </p>
        </div>

        {/* Minimalist Gold Progress Bar */}
        <div className="w-48 h-0.5 bg-[#252A2E] rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 bottom-0 bg-[#B79A68] w-1/3 animate-pulse rounded-full" />
        </div>

        <p className="text-xs text-[#B9B5AC] font-light">
          Loading Artisanal Stonework Portfolio &amp; Materials...
        </p>
      </div>
    </div>
  );
}
