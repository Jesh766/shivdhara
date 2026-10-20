import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, LayoutTemplate, Wand2, Package, CalendarRange, ShieldCheck } from 'lucide-react';
import { SiteSettings, Product, Workshop } from '../../types';

interface ContentEditorPageProps {
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

const emptySiteSettings: SiteSettings = {
  brandName: 'SHIV DHARA',
  heroTitle: 'Align Your Numbers. Align Your Space. Align Within.',
  heroSubtitle: 'A grounded synthesis of ancient sciences, harmonious spatial architecture, and conscious stillness guided by Falgun Thakkr.',
  whatsappNumber: '+916359666315',
  upiId: 'shivdhara@upi',
  contactEmail: 'contact@shivdhara.com',
  contactPhone: '+91 63596 66315',
  footerText: 'Align Your Numbers. Align Your Space. Align Within.',
};

export const ContentEditorPage: React.FC<ContentEditorPageProps> = ({ onNavigateHome, onNavigateAdmin }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(emptySiteSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const token = useMemo(() => localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara', []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/editor/overview', {
          headers: { 'x-admin-token': token },
        });

        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();

        setSiteSettings({ ...emptySiteSettings, ...(data.siteSettings || {}) });
        setProducts(data.products || []);
        setWorkshops(data.workshops || []);
      } catch (error) {
        setStatus('Unable to load editor data. Please verify admin access.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  const saveSiteSettings = async () => {
    setSaving(true);
    setStatus('Saving latest content...');
    try {
      const res = await fetch('/api/editor/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(siteSettings),
      });

      if (!res.ok) throw new Error('Save failed');
      setStatus('Updated successfully. Public content has been refreshed.');
    } catch (error) {
      setStatus('Save failed. Please check the admin token and try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const res = await fetch(`/api/editor/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus(`Saved ${product.name}.`);
    } catch (error) {
      setStatus(`Could not save ${product.name}.`);
    }
  };

  const updateWorkshop = async (workshop: Workshop) => {
    try {
      const res = await fetch(`/api/editor/workshops/${workshop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(workshop),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus(`Saved ${workshop.title}.`);
    } catch (error) {
      setStatus(`Could not save ${workshop.title}.`);
    }
  };

  const handleProductChange = (id: string, field: keyof Product, value: string | number | boolean | string[]) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, [field]: value } : product)));
  };

  const handleWorkshopChange = (id: string, field: keyof Workshop, value: string | number | boolean | string[]) => {
    setWorkshops((prev) => prev.map((workshop) => (workshop.id === id ? { ...workshop, [field]: value } : workshop)));
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#163A36] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#A85C3B] font-semibold">Editor Mode</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#163A36] mt-2">Content Studio</h1>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="px-4 py-2 rounded-xl border border-[#163A36]/20 text-[#163A36] text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl border border-[#163A36]/20 text-[#163A36] text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all cursor-pointer"
            >
              Public View
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-6 rounded-2xl border border-[#163A36]/10 bg-[#fffaf2] px-4 py-3 text-sm text-[#163A36] shadow-sm">
            {status}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-[#163A36]/10 bg-white p-8 text-[#163A36]">Loading editor data...</div>
        ) : (
          <div className="space-y-8">
            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#163A36]/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-[#163A36] text-[#F7F1E6]"><LayoutTemplate size={18} /></div>
                <h2 className="text-xl font-serif text-[#163A36]">Global Site Content</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <label className="space-y-2 text-sm">
                  <span className="text-[#163A36]/70">Brand Name</span>
                  <input value={siteSettings.brandName} onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-[#163A36]/70">WhatsApp Number</span>
                  <input value={siteSettings.whatsappNumber} onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="text-[#163A36]/70">Hero Title</span>
                  <input value={siteSettings.heroTitle} onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="text-[#163A36]/70">Hero Subtitle</span>
                  <textarea value={siteSettings.heroSubtitle} onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })} rows={3} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-[#163A36]/70">UPI ID</span>
                  <input value={siteSettings.upiId} onChange={(e) => setSiteSettings({ ...siteSettings, upiId: e.target.value })} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-[#163A36]/70">Contact Email</span>
                  <input value={siteSettings.contactEmail} onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-[#163A36]/70">Contact Phone</span>
                  <input value={siteSettings.contactPhone} onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>

                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="text-[#163A36]/70">Footer Text</span>
                  <textarea value={siteSettings.footerText} onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })} rows={2} className="w-full rounded-xl border border-[#163A36]/10 bg-[#F9F5EE] p-3 outline-none" />
                </label>
              </div>

              <div className="mt-5 flex justify-end">
                <button type="button" onClick={saveSiteSettings} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#163A36] text-[#F7F1E6] px-4 py-3 text-[10px] uppercase tracking-[0.2em] hover:opacity-95 disabled:opacity-60 cursor-pointer">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Site Settings'}
                </button>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#163A36]/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-[#A85C3B] text-[#fffaf2]"><Package size={18} /></div>
                <h2 className="text-xl font-serif text-[#163A36]">Products</h2>
              </div>

              <div className="space-y-5">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-[#163A36]/10 bg-[#F9F5EE] p-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="space-y-2 text-sm">
                        <span className="text-[#163A36]/70">Name</span>
                        <input value={product.name} onChange={(e) => handleProductChange(product.id, 'name', e.target.value)} className="w-full rounded-xl border border-[#163A36]/10 bg-white p-3 outline-none" />
                      </label>

                      <label className="space-y-2 text-sm">
                        <span className="text-[#163A36]/70">Price</span>
                        <input type="number" value={product.price} onChange={(e) => handleProductChange(product.id, 'price', Number(e.target.value))} className="w-full rounded-xl border border-[#163A36]/10 bg-white p-3 outline-none" />
                      </label>

                      <label className="space-y-2 text-sm md:col-span-2">
                        <span className="text-[#163A36]/70">Short Description</span>
                        <textarea value={product.shortDescription} onChange={(e) => handleProductChange(product.id, 'shortDescription', e.target.value)} rows={2} className="w-full rounded-xl border border-[#163A36]/10 bg-white p-3 outline-none" />
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button type="button" onClick={() => updateProduct(product)} className="rounded-xl bg-[#163A36] text-[#F7F1E6] px-4 py-2 text-[10px] uppercase tracking-[0.2em] cursor-pointer">Save Product</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#163A36]/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-[#C56A45] text-[#fffaf2]"><CalendarRange size={18} /></div>
                <h2 className="text-xl font-serif text-[#163A36]">Workshops</h2>
              </div>

              <div className="space-y-5">
                {workshops.map((workshop) => (
                  <div key={workshop.id} className="rounded-2xl border border-[#163A36]/10 bg-[#F9F5EE] p-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="space-y-2 text-sm">
                        <span className="text-[#163A36]/70">Title</span>
                        <input value={workshop.title} onChange={(e) => handleWorkshopChange(workshop.id, 'title', e.target.value)} className="w-full rounded-xl border border-[#163A36]/10 bg-white p-3 outline-none" />
                      </label>

                      <label className="space-y-2 text-sm">
                        <span className="text-[#163A36]/70">Price</span>
                        <input type="number" value={workshop.price} onChange={(e) => handleWorkshopChange(workshop.id, 'price', Number(e.target.value))} className="w-full rounded-xl border border-[#163A36]/10 bg-white p-3 outline-none" />
                      </label>

                      <label className="space-y-2 text-sm md:col-span-2">
                        <span className="text-[#163A36]/70">Tagline</span>
                        <input value={workshop.tagline} onChange={(e) => handleWorkshopChange(workshop.id, 'tagline', e.target.value)} className="w-full rounded-xl border border-[#163A36]/10 bg-white p-3 outline-none" />
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button type="button" onClick={() => updateWorkshop(workshop)} className="rounded-xl bg-[#163A36] text-[#F7F1E6] px-4 py-2 text-[10px] uppercase tracking-[0.2em] cursor-pointer">Save Workshop</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#163A36]/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-[#56427F] text-[#fffaf2]"><Wand2 size={18} /></div>
                <h2 className="text-xl font-serif text-[#163A36]">Content Policy</h2>
              </div>
              <div className="text-sm text-[#163A36]/75 leading-relaxed">
                Use this editor for updates like hero text, marketing copy, contact details, product pricing, workshop details, and key public-facing information. App logic, backend routes, payment flows, and structural design should remain protected and managed by the developer.
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
};
