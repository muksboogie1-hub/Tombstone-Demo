import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoBanner } from './components/layout/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

// Core 15 Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { TombstonesPage } from './pages/TombstonesPage';
import { CountertopsPage } from './pages/CountertopsPage';
import { WindowSillsPage } from './pages/WindowSillsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/legal/CookiePolicyPage';
import { TermsConditionsPage } from './pages/legal/TermsConditionsPage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { AccessibilityStatementPage } from './pages/legal/AccessibilityStatementPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Compliance & Production Handover Hub
import { ZimbabweLegalReviewPage } from './pages/compliance/ZimbabweLegalReviewPage';
import { ImageLicensesPage } from './pages/compliance/ImageLicensesPage';
import { SecurityAndPrelaunchPage } from './pages/compliance/SecurityAndPrelaunchPage';
import { GoogleIndexingPage } from './pages/compliance/GoogleIndexingPage';
import { ProductionHandoverPage } from './pages/compliance/ProductionHandoverPage';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#B79A68] text-[#17191B] font-bold px-4 py-2 rounded shadow-xl text-xs uppercase tracking-wider"
      >
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col bg-[#17191B] text-[#F5F1E8]">
        {/* Top Announcement Bar */}
        <DemoBanner />

        {/* Primary Navigation */}
        <Navbar />

        {/* Main Routed View */}
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/tombstones" element={<TombstonesPage />} />
            <Route path="/countertops-tables" element={<CountertopsPage />} />
            <Route path="/window-sills" element={<WindowSillsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/request-a-quote" element={<RequestQuotePage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Legal & Policy Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />

            {/* Compliance, SEO & Handover Hub */}
            <Route path="/compliance/zimbabwe-legal-review" element={<ZimbabweLegalReviewPage />} />
            <Route path="/compliance/image-licenses" element={<ImageLicensesPage />} />
            <Route path="/compliance/security-and-prelaunch" element={<SecurityAndPrelaunchPage />} />
            <Route path="/compliance/google-indexing" element={<GoogleIndexingPage />} />
            <Route path="/compliance/production-handover" element={<ProductionHandoverPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
