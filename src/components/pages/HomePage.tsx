import React, { useEffect, useMemo, useState } from 'react';
import { HeroSection } from '../home/HeroSection';
import { IntroSection } from '../home/IntroSection';
import { FounderSection } from '../home/FounderSection';
import { FeaturedWorkshops } from '../home/FeaturedWorkshops';
import { FeaturedProducts } from '../home/FeaturedProducts';
import { TestimonialsSection } from '../home/TestimonialsSection';
import { FinalCta } from '../home/FinalCta';
import { Workshop, Product, SiteSettings } from '../../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
  onSelectWorkshop: (workshop: Workshop) => void;
  onSelectProduct: (product: Product) => void;
  siteSettings?: SiteSettings;
  editorMode?: boolean;
  onUpdateSiteSettings?: (settings: SiteSettings) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenConsultation,
  onSelectWorkshop,
  onSelectProduct,
  siteSettings,
  editorMode = false,
  onUpdateSiteSettings,
}) => {
  const defaultSettings = useMemo<SiteSettings>(() => ({
    brandName: 'SHIV DHARA',
    heroTitle: 'Align Your Numbers. Align Your Space. Align Within.',
    heroSubtitle: 'A grounded synthesis of ancient sciences, harmonious spatial architecture, and conscious stillness guided by Falgun Thakkr.',
    whatsappNumber: '+916359666315',
    upiId: 'shivdhara@upi',
    contactEmail: 'contact@shivdhara.com',
    contactPhone: '+91 63596 66315',
    footerText: 'Align Your Numbers. Align Your Space. Align Within.',
  }), []);

  const [draftSettings, setDraftSettings] = useState<SiteSettings>(siteSettings || defaultSettings);

  useEffect(() => {
    setDraftSettings(siteSettings || defaultSettings);
  }, [siteSettings, defaultSettings]);

  const handleSaveSiteSettings = async () => {
    const token = localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara';

    try {
      const response = await fetch('/api/editor/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(draftSettings),
      });

      if (!response.ok) {
        throw new Error('Unable to save home page settings');
      }

      const data = await response.json();
      onUpdateSiteSettings?.(data.siteSettings || draftSettings);
    } catch (error) {
      console.error('Failed to save site settings', error);
    }
  };

  return (
    <div id="page-home" className="min-h-screen">
      {editorMode && (
        <div className="fixed left-2 right-2 top-20 z-50 w-auto rounded-2xl border border-[#D9D2C3] bg-[#FFFDF9]/95 p-4 shadow-2xl backdrop-blur-sm sm:left-auto sm:right-4 sm:top-24 sm:w-[320px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A6833D]">Home editor</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-700">Live</span>
          </div>

          <div className="space-y-3 text-xs text-[#101827]">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Brand</span>
              <input
                value={draftSettings.brandName}
                onChange={(e) => setDraftSettings((prev) => ({ ...prev, brandName: e.target.value }))}
                className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Hero title</span>
              <textarea
                rows={3}
                value={draftSettings.heroTitle}
                onChange={(e) => setDraftSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
                className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Hero subtitle</span>
              <textarea
                rows={3}
                value={draftSettings.heroSubtitle}
                onChange={(e) => setDraftSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Footer text</span>
              <input
                value={draftSettings.footerText}
                onChange={(e) => setDraftSettings((prev) => ({ ...prev, footerText: e.target.value }))}
                className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSaveSiteSettings}
            className="mt-4 w-full rounded-xl bg-[#101827] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F7F3EA] transition hover:bg-[#182236]"
          >
            Save home settings
          </button>
        </div>
      )}

      {/* 1. Hero: Deep Warm Brown, GSAP Scroll Parallax & Brand Message */}
      <HeroSection
        onOpenConsultation={onOpenConsultation}
        siteSettings={siteSettings}
        onExplore={() => {
          document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Intro: Numbers -> Space -> Stillness Triad Overview with direct navigation links */}
      <IntroSection onNavigate={onNavigate} />

      {/* 3. Founder: Falgun Thakkr Editorial Preview & Vision */}
      <FounderSection
        onNavigate={onNavigate}
        onOpenConsultation={onOpenConsultation}
      />

      {/* 4. Featured Workshops: Editorial Spotlight + Cohort Previews */}
      <FeaturedWorkshops
        onNavigate={onNavigate}
        onSelectWorkshop={onSelectWorkshop}
      />

      {/* 5. Products: Handcrafted Energized Gemstone Boutique Preview */}
      <FeaturedProducts
        onNavigate={onNavigate}
        onSelectProduct={onSelectProduct}
      />

      {/* 6. Testimonials: Seeker Reflections */}
      <TestimonialsSection />

      {/* 7. Final CTA: Consultation & Alignment */}
      <FinalCta
        onOpenConsultation={onOpenConsultation}
        onNavigate={onNavigate}
      />
    </div>
  );
};
