import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, ArrowRight, X, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { Workshop } from '../../types';
import { useToast } from '../../context/ToastContext';

interface WorkshopsPageProps {
  onOpenConsultation: () => void;
  selectedWorkshopInitial?: Workshop | null;
  editorMode?: boolean;
  onUpdateSiteSettings?: (settings: any) => void;
}

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({
  onOpenConsultation,
  selectedWorkshopInitial = null,
  editorMode = false,
  onUpdateSiteSettings,
}) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Numerology' | 'Vastu' | 'Meditation'>('ALL');
  const [activeModalWorkshop, setActiveModalWorkshop] = useState<Workshop | null>(selectedWorkshopInitial);

  // Registration Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSeats, setRegSeats] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<any | null>(null);
  const [draftWorkshop, setDraftWorkshop] = useState<Workshop | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const { showToast } = useToast();

  const fetchWorkshops = () => {
    fetch('/api/workshops')
      .then(res => res.json())
      .then(data => {
        if (data.workshops) {
          setWorkshops(data.workshops);
        }
      })
      .catch(err => console.error('Failed to load workshops', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    if (selectedWorkshopInitial) {
      setActiveModalWorkshop(selectedWorkshopInitial);
    }
  }, [selectedWorkshopInitial]);

  const saveWorkshop = async () => {
    if (!draftWorkshop) return;

    setSaveState('saving');
    setSaveMessage('Saving...');
    const token = localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara';
    const isNew = !workshops.some(item => item.id === draftWorkshop.id);

    try {
      const url = isNew ? '/api/editor/workshops' : `/api/editor/workshops/${draftWorkshop.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(draftWorkshop),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Save failed (${response.status})`);
      }

      fetchWorkshops();
      setDraftWorkshop(null);
      setSaveState('saved');
      setSaveMessage('Saved successfully');
    } catch (error) {
      console.error('Workshop save failed', error);
      setSaveState('error');
      setSaveMessage(error instanceof Error ? error.message : 'Save failed. Restart the server and try again.');
    }
  };

  const deleteWorkshop = async (workshopId: string) => {
    const token = localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara';
    try {
      const response = await fetch(`/api/editor/workshops/${workshopId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
        },
      });

      if (response.ok) {
        setDraftWorkshop(null);
        fetchWorkshops();
      }
    } catch (error) {
      console.error('Workshop delete failed', error);
    }
  };

  const handleWorkshopImageUpload = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Please choose an image file');
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.65);
      setDraftWorkshop((previous) => previous ? { ...previous, image: imageData } : previous);
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => URL.revokeObjectURL(objectUrl);
    image.src = objectUrl;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalWorkshop || !regName || !regEmail || !regPhone) {
      showToast('Missing Details', 'Please provide name, email, and phone.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/workshops/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopId: activeModalWorkshop.id,
          name: regName,
          email: regEmail,
          phone: regPhone,
          seats: regSeats,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      setRegisteredSuccess(data.registration);
      showToast(
        'Seat Reserved',
        `You are confirmed for ${activeModalWorkshop.title}. Welcome to the cohort!`,
        'success'
      );
      fetchWorkshops();
    } catch (err: any) {
      showToast('Registration Error', err.message || 'Could not register for workshop', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setActiveModalWorkshop(null);
    setRegisteredSuccess(null);
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegSeats(1);
  };

  const filtered = categoryFilter === 'ALL'
    ? workshops
    : workshops.filter(w =>
        w.title.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        w.tagline.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        w.description.toLowerCase().includes(categoryFilter.toLowerCase())
      );

  return (
    <div id="page-workshops" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {editorMode && (
        <div className="editor-panel-scroll fixed left-2 right-2 top-20 z-50 flex max-h-[calc(100vh-5.5rem)] w-auto flex-col overflow-y-scroll overscroll-contain rounded-2xl border border-[#D9D2C3] bg-[#FFFDF9]/95 p-4 shadow-2xl backdrop-blur-sm pointer-events-auto sm:left-auto sm:right-4 sm:top-24 sm:max-h-[calc(100vh-7rem)] sm:w-[340px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A6833D]">Workshops editor</span>
            <button
              type="button"
              onClick={() => setDraftWorkshop({
                id: `ws-${Date.now()}`,
                title: 'New Sacred Workshop',
                slug: 'new-sacred-workshop',
                tagline: 'A guided transformational experience.',
                description: 'Describe the learning journey and outcomes.',
                detailedOverview: ['Module 1', 'Module 2'],
                image: 'https://images.unsplash.com/photo-1517841905240-472988c2477c?auto=format&fit=crop&w=800&q=80',
                date: '2026-11-15',
                displayDate: '15 Nov 2026',
                startTime: '18:30',
                endTime: '20:30',
                duration: '2 hours',
                location: 'Online Zoom',
                isOnline: true,
                capacity: 25,
                registeredCount: 0,
                price: 4999,
                instructor: 'Falgun Thakkr',
                instructorBio: 'Guided by ritual wisdom and practical insight.',
                highlights: ['Personal guidance', 'Practical tools'],
                curriculum: [{ phase: '1', title: 'Foundation', desc: 'Learn the core system.' }],
                active: true,
              })}
              className="rounded-full bg-[#101827] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F7F3EA]"
            >
              + Add
            </button>
          </div>

          {draftWorkshop ? (
            <div className="space-y-3 text-xs text-[#101827]">
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Title</span>
                  <input
                    value={draftWorkshop.title}
                    onChange={(e) => setDraftWorkshop((prev) => prev ? { ...prev, title: e.target.value } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Price</span>
                  <input
                    type="number"
                    value={draftWorkshop.price}
                    onChange={(e) => setDraftWorkshop((prev) => prev ? { ...prev, price: Number(e.target.value) } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Date</span>
                  <input
                    type="date"
                    value={draftWorkshop.date}
                    onChange={(e) => setDraftWorkshop((prev) => prev ? { ...prev, date: e.target.value } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Image URL</span>
                  <input
                    value={draftWorkshop.image}
                    onChange={(e) => setDraftWorkshop((prev) => prev ? { ...prev, image: e.target.value } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Or choose from computer</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleWorkshopImageUpload(e.target.files?.[0])}
                    className="block w-full rounded-lg border border-[#D9D2C3] bg-white px-2 py-2 text-[10px] text-[#101827] file:mr-2 file:rounded-md file:border-0 file:bg-[#101827] file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-[#F7F3EA]"
                  />
                  {draftWorkshop.image && (
                    <img
                      src={draftWorkshop.image}
                      alt="Workshop preview"
                      className="mt-2 h-20 w-full rounded-lg border border-[#D9D2C3] bg-[#EDE8DE] object-contain"
                    />
                  )}
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Description</span>
                  <textarea
                    rows={4}
                    value={draftWorkshop.description}
                    onChange={(e) => setDraftWorkshop((prev) => prev ? { ...prev, description: e.target.value } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveWorkshop}
                  disabled={saveState === 'saving'}
                  className="flex-1 rounded-xl bg-[#101827] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F7F3EA] disabled:cursor-wait disabled:opacity-60"
                >
                  {saveState === 'saving' ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setDraftWorkshop(null)}
                  className="rounded-xl border border-[#D9D2C3] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#101827]"
                >
                  Cancel
                </button>
              </div>

              {saveMessage && (
                <p className={`max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-[10px] leading-relaxed ${saveState === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {saveMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => deleteWorkshop(draftWorkshop.id)}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-700"
              >
                Delete workshop
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {workshops.slice(0, 5).map((workshop) => (
                <button
                  key={workshop.id}
                  type="button"
                  onClick={() => setDraftWorkshop(workshop)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#D9D2C3] bg-white px-3 py-2 text-left text-xs"
                >
                  <span className="font-medium text-[#101827]">{workshop.title}</span>
                  <span className="text-[#A6833D]">₹{workshop.price.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Interactive Sacred Cohorts</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Live Wisdom Circles & Masterclasses
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            Intimate group masterclasses led by Falgun Thakkr. Learn directly through practical diagnostic case studies, guided pranayama, and real spatial blueprints.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {(['ALL', 'Numerology', 'Vastu', 'Meditation'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#101827] text-[#F7F3EA] shadow-md ring-2 ring-[#C8A45D]'
                  : 'bg-white border border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D]'
              }`}
            >
              {cat === 'ALL' ? 'All Wisdom Circles' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-[#EDE8DE] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D9D2C3] p-8 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#C8A45D] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-serif font-bold text-[#101827]">
              No cohorts currently scheduled in this category
            </h3>
            <p className="text-xs text-[#101827]/70 mt-1 mb-6">
              New dates are announced on the 1st of every month. You can also request a private 1-on-1 consultation.
            </p>
            <button
              onClick={() => setCategoryFilter('ALL')}
              className="px-6 py-2.5 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold uppercase tracking-wider"
            >
              View All Circles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map(workshop => {
              const seatsLeft = workshop.capacity - workshop.registeredCount;
              return (
                <div
                  key={workshop.id}
                  className="rounded-2xl bg-white border border-[#D9D2C3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner */}
                    <div
                      className="relative min-h-56 max-h-[28rem] overflow-hidden bg-[#182236] flex items-center justify-center cursor-pointer"
                      onClick={() => setActiveModalWorkshop(workshop)}
                    >
                      <img
                        src={workshop.image}
                        alt={workshop.title}
                        className="block h-auto max-h-[28rem] w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/80 via-transparent to-transparent" />

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#101827]/90 text-[#DFC38A] border border-[#C8A45D]/40 backdrop-blur-sm">
                          {workshop.title.includes('Numerology') ? 'Numerology' : workshop.title.includes('Vastu') ? 'Vastu' : 'Meditation'}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#101827] shadow-sm">
                          {workshop.isOnline ? 'Live Zoom HD' : 'In-Person Studio'}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                          <Users className="w-3.5 h-3.5" />
                          <span>{seatsLeft > 0 ? `${seatsLeft} seats remaining` : 'Sold Out'}</span>
                        </span>
                        <span className="text-sm font-serif font-bold text-[#DFC38A]">
                          ₹{workshop.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-xs text-[#101827]/65">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                          <span>{workshop.displayDate || workshop.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                          <span>{workshop.startTime || workshop.duration}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-[#101827] leading-snug group-hover:text-[#A6833D] transition-colors">
                        {workshop.title}
                      </h3>

                      <p className="text-xs text-[#101827]/70 font-sans leading-relaxed">
                        {workshop.description}
                      </p>

                      {/* Syllabus Bullets */}
                      {workshop.curriculum && (
                        <div className="pt-2 border-t border-[#D9D2C3]/60 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6833D] block">
                            Key Masterclass Modules
                          </span>
                          {workshop.curriculum.slice(0, 3).map((mod: any, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#101827]/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45D] shrink-0" />
                              <span className="truncate">
                                {typeof mod === 'string' ? mod : (mod.title || mod.phase || mod.desc || '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setActiveModalWorkshop(workshop)}
                      disabled={seatsLeft <= 0}
                      className="w-full py-3.5 rounded-xl bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.16em] uppercase hover:bg-[#182236] flex items-center justify-center gap-2 transition-colors disabled:opacity-40 cursor-pointer shadow-md group-hover:bg-[#182236]"
                    >
                      <span>{seatsLeft > 0 ? 'Reserve Sacred Seat' : 'Join Waitlist'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C8A45D]" />
                    </button>
                    {editorMode && (
                      <button
                        type="button"
                        onClick={() => setDraftWorkshop(workshop)}
                        className="mt-2 w-full rounded-xl border border-[#D9D2C3] bg-[#FAF7F0] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#101827]"
                      >
                        Edit workshop
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {activeModalWorkshop && (
          <div id="workshop-registration-modal" className="fixed inset-0 z-50 bg-[#101827]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F3EA] text-[#101827] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#D9D2C3] overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-[#101827] text-[#F7F3EA] p-6 flex items-center justify-between border-b border-[#C8A45D]/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#F7F3EA]">
                      Workshop Registration
                    </h3>
                    <p className="text-xs text-[#D9D2C3]/70 font-sans">
                      {activeModalWorkshop.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="p-1.5 text-[#D9D2C3]/70 hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {registeredSuccess ? (
                  <div className="text-center py-4 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-emerald-700 shadow-sm">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase text-[#A6833D]">
                        Registration Confirmed
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-[#101827] mt-1">
                        Welcome to the Circle, {registeredSuccess.name}
                      </h3>
                      <p className="text-xs text-[#101827]/70 max-w-md mx-auto mt-2 leading-relaxed">
                        Your seat in <strong>{activeModalWorkshop.title}</strong> is reserved. Joining instructions and masterclass preparation materials have been sent to your email.
                      </p>
                    </div>

                    {/* Voucher */}
                    <div className="p-4 rounded-xl bg-white border border-[#D9D2C3] shadow-sm text-left space-y-2 text-xs">
                      <div className="flex justify-between pb-2 border-b border-[#D9D2C3]">
                        <span className="text-gray-500">Booking Ref:</span>
                        <span className="font-mono font-bold text-[#101827]">
                          {registeredSuccess.id.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date & Time:</span>
                        <span className="font-semibold text-[#101827]">
                          {activeModalWorkshop.displayDate || activeModalWorkshop.date} at {activeModalWorkshop.startTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Format:</span>
                        <span className="font-semibold text-[#101827]">
                          {activeModalWorkshop.isOnline ? 'Zoom HD Interactive' : 'In-Person Studio'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Investment:</span>
                        <span className="font-bold text-[#101827]">
                          ₹{(activeModalWorkshop.price * registeredSuccess.seats).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={closeModal}
                      className="px-8 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-widest uppercase hover:bg-[#182236]"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
                    <div className="space-y-5">
                      <div className="flex min-h-[280px] max-h-[520px] items-center justify-center overflow-hidden rounded-2xl border border-[#D9D2C3] bg-[#182236] p-2">
                        <img
                          src={activeModalWorkshop.image}
                          alt={activeModalWorkshop.title}
                          className="block h-auto max-h-[500px] w-auto max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A6833D]">
                          {activeModalWorkshop.isOnline ? 'Live online workshop' : 'In-person workshop'}
                        </span>
                        <h2 className="mt-1 text-2xl font-serif font-bold text-[#101827]">
                          {activeModalWorkshop.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#101827]/75">
                          {activeModalWorkshop.description}
                        </p>
                      </div>

                      {activeModalWorkshop.curriculum?.length > 0 && (
                        <div className="rounded-xl border border-[#D9D2C3] bg-white p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6833D]">What you will explore</span>
                          <div className="mt-2 space-y-2 text-xs text-[#101827]/75">
                            {activeModalWorkshop.curriculum.map((module, index) => (
                              <p key={`${module.title}-${index}`}>
                                <span className="font-bold text-[#101827]">{module.title || module.phase}:</span> {module.desc}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Summary Info */}
                    <div className="p-4 rounded-xl bg-[#EDE8DE] border border-[#D9D2C3] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-500 block">Schedule</span>
                        <span className="font-bold text-[#101827]">
                          {activeModalWorkshop.displayDate || activeModalWorkshop.date} • {activeModalWorkshop.startTime}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 block">Tuition per Seat</span>
                        <span className="font-bold font-serif text-[#101827] text-sm">
                          ₹{activeModalWorkshop.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={regEmail}
                            onChange={e => setRegEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                          Phone / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                        Number of Seats
                      </label>
                      <select
                        value={regSeats}
                        onChange={e => setRegSeats(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                      >
                        <option value={1}>1 Seat (₹{activeModalWorkshop.price.toLocaleString('en-IN')})</option>
                        <option value={2}>2 Seats (₹{(activeModalWorkshop.price * 2).toLocaleString('en-IN')})</option>
                        <option value={3}>3 Seats (₹{(activeModalWorkshop.price * 3).toLocaleString('en-IN')})</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#101827]/70 pt-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant confirmation & Zoom meeting invitation link sent upon registration.</span>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-[#D9D2C3]">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-7 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-widest uppercase hover:bg-[#182236] transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting ? (
                          <span>Reserving Seat...</span>
                        ) : (
                          <>
                            <span>Confirm Registration</span>
                            <ArrowRight className="w-4 h-4 text-[#C8A45D]" />
                          </>
                        )}
                      </button>
                    </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
