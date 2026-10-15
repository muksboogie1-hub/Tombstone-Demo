import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageCircle } from 'lucide-react';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config/siteConfig';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Robust background scroll lock for iOS Safari, Android, and Desktop
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Record current vertical scroll position so page doesn't jump
    const scrollY = window.scrollY;
    const originalStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };

    // Lock background: fixed position with negative top works reliably on iOS Safari
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    // Keyboard Escape key to dismiss
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup: always restore original scroll position and styles
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.position = originalStyles.position;
      document.body.style.top = originalStyles.top;
      document.body.style.width = originalStyles.width;
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.overscrollBehavior = originalStyles.overscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [mobileMenuOpen]);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-xs uppercase tracking-widest font-medium transition-colors py-1 ${
      isActive
        ? 'text-[#B79A68] border-b border-[#B79A68]'
        : 'text-[#DFD9CB] hover:text-[#B79A68]'
    }`;

  return (
    <>
      <header className="bg-[#17191B]/95 backdrop-blur-md border-b border-[#2D3237] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <Link to="/" className="flex flex-col group py-1" aria-label="Velquarath Stoneworks Home">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#F5F1E8] group-hover:text-[#B79A68] transition-colors">
              VELQUARATH
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#B9B5AC] -mt-1 font-sans">
              Stoneworks & Memorials
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            <NavLink to="/" end className={navLinkClasses}>
              Home
            </NavLink>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 text-xs uppercase tracking-widest font-medium transition-colors py-1 ${
                    isActive
                      ? 'text-[#B79A68] border-b border-[#B79A68]'
                      : 'text-[#DFD9CB] hover:text-[#B79A68]'
                  }`
                }
              >
                <span>Products</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#B9B5AC]" />
              </NavLink>

              {productsDropdownOpen && (
                <div
                  className="absolute top-full left-0 w-64 bg-[#1D2023] border border-[#2D3237] shadow-2xl py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <Link
                    to="/products"
                    className="block px-4 py-2.5 text-xs text-[#F5F1E8] hover:bg-[#252A2E] hover:text-[#B79A68] transition-colors"
                    role="menuitem"
                  >
                    All Products Overview
                  </Link>
                  <div className="h-px bg-[#2D3237] my-1 mx-2"></div>
                  <Link
                    to="/tombstones"
                    className="block px-4 py-2.5 text-xs text-[#DFD9CB] hover:bg-[#252A2E] hover:text-[#B79A68] transition-colors"
                    role="menuitem"
                  >
                    Tombstones & Memorials
                  </Link>
                  <Link
                    to="/countertops-tables"
                    className="block px-4 py-2.5 text-xs text-[#DFD9CB] hover:bg-[#252A2E] hover:text-[#B79A68] transition-colors"
                    role="menuitem"
                  >
                    Countertops & Tables
                  </Link>
                  <Link
                    to="/window-sills"
                    className="block px-4 py-2.5 text-xs text-[#DFD9CB] hover:bg-[#252A2E] hover:text-[#B79A68] transition-colors"
                    role="menuitem"
                  >
                    Stone Window Sills
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/gallery" className={navLinkClasses}>
              Gallery
            </NavLink>

            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>

            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* WhatsApp Direct */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F5F1E8] hover:text-[#25D366] transition-colors px-3 py-2 rounded border border-[#2D3237] hover:border-[#25D366]/40 cursor-pointer"
              title="Open WhatsApp chat with Velquarath Stoneworks"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Request a Quote CTA */}
            <Link
              to="/request-a-quote"
              className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] px-5 py-2.5 rounded transition-colors shadow-xs cursor-pointer"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp (+263786967793)"
              className="p-2 text-[#25D366] hover:bg-[#252A2E] rounded border border-[#2D3237]"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#F5F1E8] hover:text-[#B79A68] focus:outline-hidden rounded cursor-pointer"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Full-Screen Mobile Navigation Overlay (Portaled to document.body to bypass header backdrop-blur containing block) */}
    {mobileMenuOpen && typeof document !== 'undefined' &&
      createPortal(
        <div
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-0 z-[100] w-full h-[100vh] h-[100dvh] bg-[#17191B] text-[#F5F1E8] flex flex-col overflow-hidden animate-in fade-in duration-200"
          style={{
            overscrollBehavior: 'contain',
          }}
        >
          {/* Pinned Top Bar inside Menu: Keeps Brand & Close Button Permanently Accessible on all devices */}
          <div className="shrink-0 h-20 px-4 sm:px-6 flex items-center justify-between border-b border-[#2D3237] bg-[#17191B]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col group py-1"
              aria-label="Velquarath Stoneworks Home"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#F5F1E8] group-hover:text-[#B79A68] transition-colors">
                VELQUARATH
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B9B5AC] -mt-1 font-sans">
                Stoneworks & Memorials
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp (+263786967793)"
                className="p-2 text-[#25D366] hover:bg-[#252A2E] rounded border border-[#2D3237]"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-[#F5F1E8] hover:text-[#B79A68] hover:bg-[#252A2E] focus:outline-hidden rounded border border-[#2D3237] cursor-pointer transition-colors"
                aria-label="Close Navigation Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Independently Scrollable Navigation Panel */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-12 flex flex-col justify-between"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
            }}
          >
            <div className="space-y-4">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68] border-b border-[#252A2E]"
              >
                Home
              </NavLink>

              <div className="py-2">
                <span className="block text-[11px] uppercase tracking-wider text-[#B79A68] mb-2 font-semibold">
                  Stone Collections
                </span>
                <div className="pl-3 space-y-3 border-l border-[#2D3237]">
                  <NavLink
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68]"
                  >
                    All Products Overview
                  </NavLink>
                  <NavLink
                    to="/tombstones"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68]"
                  >
                    Tombstones & Memorials
                  </NavLink>
                  <NavLink
                    to="/countertops-tables"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68]"
                  >
                    Countertops & Tables
                  </NavLink>
                  <NavLink
                    to="/window-sills"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68]"
                  >
                    Stone Window Sills
                  </NavLink>
                </div>
              </div>

              <NavLink
                to="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68] border-b border-[#252A2E]"
              >
                Curated Gallery
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68] border-b border-[#252A2E]"
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm uppercase tracking-wider text-[#DFD9CB] hover:text-[#B79A68] border-b border-[#252A2E]"
              >
                Contact
              </NavLink>
            </div>

            {/* Quick Consultation Actions in Drawer */}
            <div className="pt-6 mt-6 border-t border-[#252A2E] flex flex-col gap-3">
              <Link
                to="/request-a-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-3.5 rounded transition-colors shadow-sm cursor-pointer"
              >
                Request a Quote
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 py-3 rounded transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+263 78 696 7793)</span>
              </a>
              <div className="text-[10px] text-center text-[#8E8B82] pt-1">
                Direct email: {SITE_CONFIG.contact.email}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
  </>
  );
}
