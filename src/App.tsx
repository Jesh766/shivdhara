import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ScrollProgress } from './components/common/ScrollProgress';
import { AmbientGlowCursor } from './components/common/AmbientGlowCursor';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ConsultationModal } from './components/booking/ConsultationModal';
import { DharaChatbot } from './components/ai/DharaChatbot';
import { useLenis } from './lib/lenis';
import { initClarity, trackPageView, trackEvent } from './lib/analytics';
import { EasterEgg } from './components/common/EasterEgg';
import { CookieConsent } from './components/common/CookieConsent';

// Pages
import { HomePage } from './components/pages/HomePage';
import { NumerologyPage } from './components/pages/NumerologyPage';
import { VastuPage } from './components/pages/VastuPage';
import { MeditationPage } from './components/pages/MeditationPage';
import { WorkshopsPage } from './components/pages/WorkshopsPage';
import { ProductsPage } from './components/pages/ProductsPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { BlogPage } from './components/pages/BlogPage';
import { ContactPage } from './components/pages/ContactPage';
import { FaqPage } from './components/pages/FaqPage';
import { LegalPages } from './components/pages/LegalPages';
import { AdminPortal } from './components/pages/AdminPortal';

import { Workshop, Product, SiteSettings } from './types';

const defaultSiteSettings: SiteSettings = {
  brandName: 'SHIV DHARA',
  heroTitle: 'Align Your Numbers. Align Your Space. Align Within.',
  heroSubtitle: 'A grounded synthesis of ancient sciences, harmonious spatial architecture, and conscious stillness guided by Falgun Thakkr.',
  whatsappNumber: '+916359666315',
  upiId: 'shivdhara@upi',
  contactEmail: 'contact@shivdhara.com',
  contactPhone: '+91 63596 66315',
  footerText: 'Align Your Numbers. Align Your Space. Align Within.',
};

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash.replace('#', '') || '/';
    }
    return '/';
  });
  const legalTabMap: Record<string, 'privacy' | 'terms' | 'shipping' | 'refund' | 'cookies'> = {
  privacy: 'privacy',
  cookies: 'cookies',
  terms: 'terms',
  shipping: 'shipping',
  refund: 'refund',
};

const legalTab = (() => {
  if (!currentPath.startsWith('/legal')) return 'privacy';

  const query = currentPath.split('?')[1];
  const params = new URLSearchParams(query);
  const tab = params.get('tab') || 'privacy';

  return legalTabMap[tab] || 'privacy';
})();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedWorkshopForModal, setSelectedWorkshopForModal] = useState<Workshop | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [editorMode, setEditorMode] = useState(false);

  // Initialize Lenis smooth scroll and GSAP integration
  useLenis();

  useEffect(() => {
    const token = localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara';
    fetch('/api/editor/site-settings', {
      headers: {
        'x-admin-token': token,
      },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.siteSettings) {
          setSiteSettings(data.siteSettings);
        }
      })
      .catch(() => undefined);
  }, []);

  // Initialize Microsoft Clarity Analytics on mount
  useEffect(() => {
    initClarity();
  }, []);

  // Scroll to top, update document title, and track pageview on path change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(currentPath);

    const pageTitles: Record<string, string> = {
      '/': 'SHIV DHARA — Numerology, Vastu Shastra & Meditation | By Falgun Thakkr',
      '/numerology': 'Numerology & Planetary Frequency | SHIV DHARA',
      '/vastu': 'Spatial Vastu Vidya & Architecture | SHIV DHARA',
      '/meditation': 'Conscious Meditation & Pranic Breath Sanctuary | SHIV DHARA',
      '/workshops': 'Upcoming Immersive Masterclasses & Cohorts | SHIV DHARA',
      '/products': 'Energized Gemstone Bracelets & Timeless Boutique | SHIV DHARA',
      '/checkout': 'Secure Checkout | SHIV DHARA',
      '/blog': 'Wisdom Journal & Essays | SHIV DHARA',
      '/contact': 'Contact & Private Consultation | SHIV DHARA',
      '/faq': 'Frequently Asked Questions | SHIV DHARA',
      '/legal': 'Legal & Ethics Policies | SHIV DHARA',
      '/admin': 'Master Administration Portal | SHIV DHARA',
    };

    document.title = pageTitles[currentPath] || 'SHIV DHARA — By Falgun Thakkr';
  }, [currentPath]);

  // Handle browser popstate / back button
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    // Redirect legacy /about links to the consolidated home page
    const resolvedPath = path === '/about' ? '/' : path;
    window.location.hash = resolvedPath;
    setCurrentPath(resolvedPath);
  };

  const handleSelectWorkshop = (workshop: Workshop) => {
    setSelectedWorkshopForModal(workshop);
    navigate('/workshops');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForModal(product);
    navigate('/products');
  };

  const handleOpenEditorMode = () => {
    setEditorMode(true);
    navigate('/');
  };

  const handleExitEditorMode = () => {
    setEditorMode(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAF4EA] text-[#2B211E] flex flex-col font-sans selection:bg-[#A85C3B]/25 selection:text-[#2B211E]">
      {/* Editorial Scroll Progress Line */}
      <ScrollProgress />

      {/* Ambient Mouse Glow for Desktop — also feeds the shared pointer tracker
          that the hero particle field reads for cursor repulsion */}
      <AmbientGlowCursor />

      {/* Global Navbar (hidden on admin portal for clean focus) */}
      {currentPath !== '/admin' && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />
      )}

      {/* Page Routing */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onNavigate={navigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
            onSelectWorkshop={handleSelectWorkshop}
            onSelectProduct={handleSelectProduct}
            siteSettings={siteSettings}
            editorMode={editorMode}
            onUpdateSiteSettings={setSiteSettings}
          />
        )}

        {currentPath === '/numerology' && (
          <NumerologyPage
            onNavigate={navigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {currentPath === '/vastu' && (
          <VastuPage
            onNavigate={navigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {currentPath === '/meditation' && (
          <MeditationPage
            onNavigate={navigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {currentPath === '/workshops' && (
          <WorkshopsPage
            onOpenConsultation={() => setIsConsultationOpen(true)}
            selectedWorkshopInitial={selectedWorkshopForModal}
            editorMode={editorMode}
            onUpdateSiteSettings={setSiteSettings}
          />
        )}

        {currentPath === '/products' && (
          <ProductsPage
            onNavigateToCheckout={() => navigate('/checkout')}
            selectedProductInitial={selectedProductForModal}
            editorMode={editorMode}
            onUpdateSiteSettings={setSiteSettings}
          />
        )}

        {currentPath === '/checkout' && (
          <CheckoutPage
            onNavigateToProducts={() => navigate('/products')}
            onNavigateToHome={() => navigate('/')}
          />
        )}

        {currentPath === '/blog' && (
          <BlogPage
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {currentPath === '/contact' && (
          <ContactPage />
        )}

        {currentPath === '/faq' && (
          <FaqPage
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {currentPath.startsWith('/legal') && (
  <LegalPages initialTab={legalTab} />
)}

        {currentPath === '/admin' && (
          <AdminPortal
            onNavigateHome={() => navigate('/')}
            onOpenEditor={handleOpenEditorMode}
            onExitEditorMode={handleExitEditorMode}
            isEditorMode={editorMode}
          />
        )}
      </main>

      {/* Global Footer (hidden on admin portal) */}
      {currentPath !== '/admin' && (
        <Footer
          onNavigate={navigate}
          onOpenConsultation={() => setIsConsultationOpen(true)}
          siteSettings={siteSettings}
        />
      )}

      {/* Global Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Global Slide-over Cart Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => navigate('/checkout')}
        onNavigateToProducts={() => navigate('/products')}
      />

      {/* Global Floating AI Assistant Dhara */}
      <DharaChatbot
        currentPage={currentPath}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onNavigate={navigate}
      />

      {/* Global Floating WhatsApp Direct CTA */}
      <WhatsAppButton />

      {/* Global Toast Notification Container */}
      <ToastContainer />

      {/* Global Customer Auth Modal */}
      <AuthModal />

      {/* Sitewide easter egg — type "shiv" anywhere */}
      <EasterEgg />

      {/* Global Privacy & Cookie Consent Banner */}
      <CookieConsent onNavigateToLegal={(tab) => navigate(`/legal?tab=${tab}`)} />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;