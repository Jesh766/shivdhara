import React from 'react';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { SHIV_DHARA_LOGO } from '../../lib/assets';
import { SiteSettings } from '../../types';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation, siteSettings }) => {
  const whatsappNumber = siteSettings?.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '+916359666315';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer
      id="main-footer"
      className="bg-[#FAF4EA] text-[#2B211E] pt-24 pb-14 border-t border-[#E6D5B8] relative overflow-hidden transition-colors-editorial"
    >
      {/* Background Subtle Geometry Watermark */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full border border-[#A85C3B]/10 pointer-events-none animate-spin-slow" />
      <div className="absolute -left-32 -top-32 w-80 h-80 rounded-full border border-[#D49A52]/15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#E6D5B8]">
          {/* Col 1 & 2: Brand and Vision */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white border border-[#A85C3B]/25 p-2 shadow-sm flex items-center justify-center relative shrink-0">
                <img
                  src={SHIV_DHARA_LOGO}
                  alt="SHIV DHARA Logo"
                  className="h-full w-full object-contain drop-shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-2xl font-serif tracking-[0.22em] font-bold uppercase block text-[#2B211E]">
                  {siteSettings?.brandName || 'SHIV DHARA'}
                </span>
                <span className="type-label text-[10px] text-[#A85C3B] block mt-0.5 font-semibold">
                  By Falgun Thakkr
                </span>
              </div>
            </div>

            <p className="type-body-sm text-[#2B211E]/75 max-w-md text-sm leading-relaxed">
              {siteSettings?.footerText || 'Align Your Numbers. Align Your Space. Align Within.'}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#E6D5B8] hover:border-[#A85C3B] shadow-sm flex items-center justify-center text-[#2B211E] hover:text-[#A85C3B] transition-all hover:scale-105"
                aria-label="Follow SHIV DHARA on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#E6D5B8] hover:border-[#A85C3B] shadow-sm flex items-center justify-center text-[#2B211E] hover:text-[#A85C3B] transition-all hover:scale-105"
                aria-label="Subscribe to Falgun Thakkr on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#E6D5B8] hover:border-[#25D366] shadow-sm flex items-center justify-center text-[#2B211E] hover:text-[#25D366] transition-all hover:scale-105"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Disciplines */}
          <div className="space-y-4">
            <h4 className="type-label-subtle text-[#A85C3B] block font-bold text-xs">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-sm text-[#2B211E]/80 font-sans">
              <li>
                <button
                  onClick={() => onNavigate('/numerology')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Numerology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/vastu')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Spatial Vastu Vidya
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/meditation')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Shiv Dhara Meditation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/workshops')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Upcoming Workshops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/products')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Numerology Bracelets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Navigation */}
          <div className="space-y-4">
            <h4 className="type-label-subtle text-[#A85C3B] block font-bold text-xs">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#2B211E]/80 font-sans">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Meet Falgun Thakkr
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Wisdom Journal (Blog)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/faq')}
                  className="hover:text-[#A85C3B] transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-[#A85C3B] transition-colors font-semibold text-[#A85C3B] cursor-pointer"
                >
                  Book Consultation ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Sanctuary Office & Address */}
          <div className="space-y-4">
            <h4 className="type-label-subtle text-[#A85C3B] block font-bold text-xs">
              Sanctuary Office
            </h4>
            <div className="type-body-sm text-xs text-[#2B211E]/75 leading-relaxed font-sans space-y-1">
              <p className="font-semibold text-[#2B211E]">206, Jalaram Complex, 2nd Floor,</p>
              <p>Gita Mandir Road, Nr. S. T. Bus Stop,</p>
              <p>Lati Bazar, Ahmedabad-22 (GUJ)</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2B211E]/60">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <span>{new Date().getFullYear()} SHIV DHARA by Falgun Thakkr. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <button onClick={() => onNavigate('/legal?tab=privacy')} className="hover:text-[#A85C3B] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('/legal?tab=cookies')} className="hover:text-[#A85C3B] transition-colors cursor-pointer">
              Cookies Policy
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('shivdhara:open-cookie-preferences'))}
              className="hover:text-[#A85C3B] transition-colors cursor-pointer font-medium underline underline-offset-2"
            >
              Cookie Preferences
            </button>
            <button onClick={() => onNavigate('/legal?tab=terms')} className="hover:text-[#A85C3B] transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('/legal?tab=shipping')} className="hover:text-[#A85C3B] transition-colors cursor-pointer">
              Shipping & Delivery
            </button>
            <button onClick={() => onNavigate('/legal?tab=refund')} className="hover:text-[#A85C3B] transition-colors cursor-pointer">
              Refund Policy
            </button>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-[#2B211E]/60">
          <a
            href="https://wa.me/919173389217"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#A85C3B] transition-colors hover:text-[#2B211E]"
          >
            Developed By JESH
          </a>
        </div>
      </div>
    </footer>
  );
};
