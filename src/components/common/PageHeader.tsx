import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

export function PageHeader({ title, subtitle, category, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="relative py-14 sm:py-20 border-b border-[#2D3237] bg-radial from-[#222629]/60 via-[#17191B] to-[#121415] overflow-hidden">
      {/* Decorative architectural grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#252A2E15_1px,transparent_1px),linear-gradient(to_bottom,#252A2E15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-[#8E8B82]">
              <li>
                <Link to="/" className="hover:text-[#B79A68] transition-colors">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#3D434A]" />
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-[#B79A68] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#B9B5AC] font-medium" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {category && (
          <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B79A68] mb-2">
            {category}
          </div>
        )}

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F1E8] tracking-tight max-w-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-sm sm:text-base text-[#B9B5AC] max-w-2xl font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
