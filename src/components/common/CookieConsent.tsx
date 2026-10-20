import React, { useState, useEffect } from 'react';
import { Shield, Settings, Check, X, ChevronRight, Lock, Cookie } from 'lucide-react';
import { updateClarityConsent } from '../../lib/analytics';

export interface CookiePreferences {
  version: string;
  consentedAt: string;
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'shivdhara_cookie_consent_v1';

export const getSavedCookieConsent = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
  return null;
};

export const saveCookieConsent = (prefs: Omit<CookiePreferences, 'version' | 'consentedAt'>): CookiePreferences => {
  const fullPrefs: CookiePreferences = {
    version: '1.0',
    consentedAt: new Date().toISOString(),
    essential: true, // Always required
    analytics: Boolean(prefs.analytics),
    functional: Boolean(prefs.functional),
    marketing: Boolean(prefs.marketing),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPrefs));
    updateClarityConsent(fullPrefs.analytics);
  } catch (err) {
    console.error('Failed to save cookie consent', err);
  }

  return fullPrefs;
};

export const CookieConsent: React.FC<{ onNavigateToLegal?: (tab: string) => void }> = ({ onNavigateToLegal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const existing = getSavedCookieConsent();
    if (!existing) {
      // Small timeout for smooth cinematic entrance after initial paint
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setAnalytics(existing.analytics);
      setFunctional(existing.functional);
      setMarketing(existing.marketing);
      updateClarityConsent(existing.analytics);
    }
  }, []);

  // Listen for custom trigger to reopen preferences from footer or anywhere
  useEffect(() => {
    const handleOpenPrefs = () => {
      const existing = getSavedCookieConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setFunctional(existing.functional);
        setMarketing(existing.marketing);
      }
      setIsPreferencesOpen(true);
      setIsVisible(true);
    };

    window.addEventListener('shivdhara:open-cookie-preferences', handleOpenPrefs);
    return () => window.removeEventListener('shivdhara:open-cookie-preferences', handleOpenPrefs);
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent({ essential: true, analytics: true, functional: true, marketing: true });
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleDeclineNonEssential = () => {
    saveCookieConsent({ essential: true, analytics: false, functional: false, marketing: false });
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleSaveCustom = () => {
    saveCookieConsent({ essential: true, analytics, functional, marketing });
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="bg-[#163A36]/95 backdrop-blur-xl border border-[#A85C3B]/40 text-[#FAF4EA] rounded-2xl shadow-2xl p-5 sm:p-6 relative overflow-hidden transition-all">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D49A52]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal: Granular Preferences view */}
        {isPreferencesOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#A85C3B]/30 border border-[#A85C3B]/40 text-[#FAF4EA]">
                  <Settings className="w-4 h-4 text-[#E6D5B8]" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#FAF4EA]">
                  Cookie & Privacy Preferences
                </h3>
              </div>
              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close preferences"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#FAF4EA]/80 font-sans leading-relaxed">
              We honor your privacy and spatial sovereignty. Choose which cookies and digital telemetry you permit while exploring SHIV DHARA.
            </p>

            {/* Granular Toggles */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {/* Essential */}
              <div className="bg-black/25 border border-white/10 rounded-xl p-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Strictly Essential</span>
                    <span className="text-[10px] bg-white/10 text-white/90 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <Lock className="w-2.5 h-2.5" /> Always Required
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-normal">
                    Ensures core functionality, encrypted authentication, shopping cart memory, and checkout security tokens. Cannot be turned off.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-black/25 border border-white/10 rounded-xl p-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Analytics & Insights</span>
                    <span className="text-[10px] text-[#D49A52] font-medium">Clarity Telemetry</span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-normal">
                    Helps us understand how seekers navigate our sacred sanctuary so we can refine performance, resolve glitches, and improve user flows.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A85C3B]"></div>
                </label>
              </div>

              {/* Functional */}
              <div className="bg-black/25 border border-white/10 rounded-xl p-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Experience & Ambiance</span>
                  <p className="text-[11px] text-white/70 leading-normal">
                    Stores interactive preferences like Dhara conversational context, audio states, and custom numerology tool sessions.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A85C3B]"></div>
                </label>
              </div>

              {/* Marketing */}
              <div className="bg-black/25 border border-white/10 rounded-xl p-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Communications & Alerts</span>
                  <p className="text-[11px] text-white/70 leading-normal">
                    Enables direct WhatsApp concierge updates and notification reminders for booked masterclasses.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A85C3B]"></div>
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={handleSaveCustom}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#A85C3B] hover:bg-[#8F4829] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Choices</span>
              </button>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-[#FAF4EA] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* Default Minimal Banner View */
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#A85C3B]/25 border border-[#A85C3B]/30 text-[#D49A52] shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-[#FAF4EA]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold text-[#FAF4EA] tracking-wide flex items-center gap-2">
                  <span>Privacy & Cookie Sovereignty</span>
                  <Shield className="w-3.5 h-3.5 text-[#D49A52]" />
                </h3>
                <p className="text-xs text-[#FAF4EA]/85 font-sans leading-relaxed">
                  We treat your digital footprint like a sacred sanctuary. We use necessary cookies for your cart and sessions, plus optional analytics to refine our platform. You retain complete sovereignty.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div className="flex items-center gap-3 text-[11px] text-[#D49A52]">
                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="hover:underline flex items-center gap-1 text-[#E6D5B8] hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Customize</span>
                </button>
                <span className="text-white/20">•</span>
                <button
                  onClick={() => {
                    if (onNavigateToLegal) {
                      onNavigateToLegal('cookies');
                    } else {
                      window.location.hash = '/legal?tab=cookies';
                    }
                  }}
                  className="hover:underline text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cookies Policy
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDeclineNonEssential}
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl border border-white/20 hover:border-white/50 text-white/90 hover:text-white text-xs font-semibold tracking-wider transition-all cursor-pointer"
                >
                  Decline Non-Essential
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-[#A85C3B] hover:bg-[#8F4829] text-white text-xs font-bold tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Accept All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
