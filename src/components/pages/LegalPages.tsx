import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Truck, RotateCcw, Cookie, Settings } from 'lucide-react';

interface LegalPagesProps {
  initialTab?: 'privacy' | 'terms' | 'shipping' | 'refund' | 'cookies';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'shipping' | 'refund' | 'cookies'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleOpenCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent('shivdhara:open-cookie-preferences'));
  };

  return (
    <div id="page-legal" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-14 px-4 sm:px-6 text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#F7F3EA] font-light">
          Trust, Transparency & Policies
        </h1>
        <p className="text-xs sm:text-sm text-[#D9D2C3]/80 max-w-xl mx-auto font-sans">
          Clear, ethical terms governing SHIV DHARA consultations, workshops, privacy sovereignty, and handcrafted sacred accessories.
        </p>
      </section>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 border-b border-[#D9D2C3] pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#101827] text-[#F7F3EA] shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-black/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-[#101827] text-[#F7F3EA] shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-black/5'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Cookies Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#101827] text-[#F7F3EA] shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-black/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-[#101827] text-[#F7F3EA] shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-black/5'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-[#101827] text-[#F7F3EA] shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-black/5'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refund & Rescheduling</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-[#D9D2C3] p-8 sm:p-12 shadow-sm mt-8 space-y-6 text-sm text-[#101827]/85 font-sans leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#101827]">
                Privacy & Confidentiality Policy
              </h2>
              <p>
                At <strong>SHIV DHARA</strong>, founded by Falgun Thakkr, we respect the sacred privacy of every individual. Personal birth details, residential blueprints, consultation recordings, and personal background stories shared during sessions are treated with strict professional confidentiality under the Indian Digital Personal Data Protection Act (DPDP Act 2023) and global best practices.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                1. Information We Collect
              </h3>
              <p>
                We collect your name, email address, phone number, date of birth (for numerology computations), and delivery address (for boutique orders). We do not sell, rent, or monetize personal data under any circumstances.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                2. AI Assistant (Dhara) & Telegram Privacy
              </h3>
              <p>
                Conversations with Dhara are processed securely server-side. If you request direct human support, your contact details and message summary are dispatched via encrypted webhook to our private administrative desk.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                3. Your Data Rights
              </h3>
              <p>
                You have the absolute right to request access to, correction of, or permanent deletion of your stored consultation requests or account data. Contact us directly at <a href="mailto:contact@shivdhara.com" className="text-[#A85C3B] font-semibold underline">contact@shivdhara.com</a>.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9D2C3] pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#101827]">
                    Cookie & Digital Storage Policy
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: October 2026 • DPDP Act (India) & Global ePrivacy Compliance
                  </p>
                </div>
                <button
                  onClick={handleOpenCookiePreferences}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101827] text-white hover:bg-[#A85C3B] transition-all text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-sm"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Adjust Preferences</span>
                </button>
              </div>

              <p>
                SHIV DHARA uses cookies and browser local storage to provide a seamless, secure, and personalized spiritual experience. Below is a transparent breakdown of every storage mechanism we use:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#E6D5B8] rounded-xl overflow-hidden">
                  <thead className="bg-[#FAF4EA] text-[#2B211E] font-serif border-b border-[#E6D5B8]">
                    <tr>
                      <th className="p-3 font-bold">Storage Key / Cookie</th>
                      <th className="p-3 font-bold">Category</th>
                      <th className="p-3 font-bold">Purpose</th>
                      <th className="p-3 font-bold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6D5B8]/60">
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#101827]">shiv_dhara_cart</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Strictly Essential</span></td>
                      <td className="p-3">Maintains sacred items added to your boutique bag between visits.</td>
                      <td className="p-3">Persistent (Local)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#101827]">shiv_dhara_user</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Strictly Essential</span></td>
                      <td className="p-3">Stores authenticated seeker profile and login state.</td>
                      <td className="p-3">Persistent (Local)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#101827]">shivdhara_cookie_consent_v1</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Strictly Essential</span></td>
                      <td className="p-3">Records your explicit cookie consent and category choices.</td>
                      <td className="p-3">1 Year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#101827]">_clck, _clsk (Clarity)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">Analytics (Optional)</span></td>
                      <td className="p-3">Microsoft Clarity anonymous heatmaps, session diagnostics, and scroll telemetry.</td>
                      <td className="p-3">1 Year / Session</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#101827]">shiv_dhara_live_analytics</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">Functional (Optional)</span></td>
                      <td className="p-3">Aggregated visit counts and tool interactions stored locally in your browser.</td>
                      <td className="p-3">Persistent (Local)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                How Can You Control Cookies?
              </h3>
              <p>
                You can change your consent preferences at any moment by clicking the <strong>"Cookie Preferences"</strong> button in the footer of any page or using the button above. You can also clear cookies and site storage directly from your browser settings.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#101827]">
                Terms of Service
              </h2>
              <p>
                By scheduling a consultation, enrolling in a wisdom cohort, or acquiring energized accessories from SHIV DHARA, you agree to our terms.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                1. Nature of Sacred Sciences
              </h3>
              <p>
                Numerology, Vastu Shastra, and meditation are reflective and harmonizing traditions. They are intended for self-discovery, spiritual balance, and energetic well-being. They do not replace licensed medical, psychiatric, financial, or legal counsel.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                2. Respectful Community
              </h3>
              <p>
                All participants in our live cohorts and circles agree to uphold an atmosphere of mutual reverence, psychological safety, and supportive dialogue.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                3. Intellectual Property
              </h3>
              <p>
                All course content, meditation audio guides, and research writings published on SHIV DHARA are the intellectual property of Falgun Thakkr. Unauthorized recording, re-distribution, or commercial replication is strictly prohibited.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#101827]">
                Shipping & Delivery Policy
              </h2>
              <p>
                Every gemstone bracelet and sacred mala is handcrafted and energized prior to shipment.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                1. Processing & Energization Timelines
              </h3>
              <p>
                Orders are energized and packaged within 2 business days. Express domestic delivery takes 3-5 business days across India. All packages are insured against transit damage.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                2. Free Shipping
              </h3>
              <p>
                All domestic orders above ₹1,999 enjoy complimentary express insured shipping.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#101827]">
                Refund & Rescheduling Policy
              </h2>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                1. 1-on-1 Consultations
              </h3>
              <p>
                You may reschedule your private appointment with Falgun Thakkr at no extra cost up to 24 hours before the scheduled time. Cancellations made 24+ hours in advance receive a 100% full refund.
              </p>
              <h3 className="text-base font-serif font-bold text-[#101827] pt-2">
                2. Sacred Boutique Items
              </h3>
              <p>
                If an energized item arrives damaged in transit, we will replace it immediately or issue a 100% refund upon receiving photographic proof within 7 days of delivery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
