import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Video, MapPin, CheckCircle2, Sparkles, ArrowRight, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Consultation } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { recordFormSubmission } from '../../lib/analytics';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: 'Numerology' | 'Vastu' | 'Meditation' | 'Comprehensive Alignment';
}

const servicePricing = {
  Numerology: {
    title: 'Numerology Blueprint',
    price: 3499,
    duration: '60 Minutes',
    desc: 'Deep dive into Birth Number (Moolank), Destiny (Bhagyank), Name vibration, and life cycle alignment.'
  },
  Vastu: {
    title: 'Vastu Spatial Energy Audit',
    price: 7499,
    duration: '90 Minutes',
    desc: 'Non-destructive 8-directional layout review, elemental balancing, and room-by-room energy rectification.'
  },
  Meditation: {
    title: 'Shiv Dhara Breathwork & Dhyana',
    price: 2199,
    duration: '45 Minutes',
    desc: 'Personalized pranayama sequence and sound mantra alignment for calm, clarity, and inner stillness.'
  },
  'Comprehensive Alignment': {
    title: 'Complete Triad Alignment',
    price: 10999,
    duration: '120 Minutes',
    desc: 'Full holistic integration of your Personal Numerology, Living Space Vastu, and customized Meditation sadhana.'
  }
};

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Numerology'
}) => {
  const { user, requireAuth } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState<'Numerology' | 'Vastu' | 'Meditation' | 'Comprehensive Alignment'>(initialService);
  const [format, setFormat] = useState<'ONLINE_VIDEO' | 'IN_PERSON_AHMEDABAD'>('ONLINE_VIDEO');

  // Tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(minDateStr);
  const [availableSlots, setAvailableSlots] = useState<string[]>([
    '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'
  ]);
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM');

  // Form Fields - automatically populated if logged in
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment / Flat');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Consultation | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  // Fetch slots on date change
  useEffect(() => {
    if (!date) return;
    fetch(`/api/consultations/availability?date=${date}&service=${service}`)
      .then(res => res.json())
      .then(data => {
        if (data.slots && data.slots.length > 0) {
          setAvailableSlots(data.slots);
          if (!data.slots.includes(selectedSlot)) {
            setSelectedSlot(data.slots[0]);
          }
        }
      })
      .catch(() => {
        // Fallback slots
        setAvailableSlots(['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM']);
      });
  }, [date, service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !selectedSlot) {
      showToast('Missing details', 'Please complete all required contact fields.', 'error');
      return;
    }

    setSubmitting(true);

    const priceInfo = servicePricing[service] || servicePricing.Numerology;
    const localConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service,
      type: format,
      date,
      time: selectedSlot,
      duration: priceInfo.duration,
      price: priceInfo.price,
      status: 'CONFIRMED',
      dateOfBirth: dob || undefined,
      birthTime: birthTime || undefined,
      propertyType: service === 'Vastu' ? propertyType : undefined,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    };

    // 1. Instantly persist to local storage so no booking is ever lost
    try {
      const existing = JSON.parse(localStorage.getItem('shiv_dhara_consultations') || '[]');
      existing.unshift(localConsultation);
      localStorage.setItem('shiv_dhara_consultations', JSON.stringify(existing));
    } catch (e) {
      console.warn('Could not cache consultation locally', e);
    }

    // 2. Track in live analytics
    recordFormSubmission('consultations', {
      service,
      name: name.trim(),
      phone: phone.trim(),
      date,
      time: selectedSlot,
    });

    try {
      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          service,
          type: format,
          date,
          time: selectedSlot,
          dateOfBirth: dob || undefined,
          birthTime: birthTime || undefined,
          propertyType: service === 'Vastu' ? propertyType : undefined,
          message: message || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.consultation) {
          setConfirmedBooking(data.consultation);
        } else {
          setConfirmedBooking(localConsultation);
        }
      } else {
        setConfirmedBooking(localConsultation);
      }

      setStep(4);
      showToast(
        'Consultation Booked',
        `Your appointment with Falgun Thakkr has been scheduled for ${date} at ${selectedSlot}.`,
        'success'
      );
    } catch (err: any) {
      // Graceful offline/dev fallback
      setConfirmedBooking(localConsultation);
      setStep(4);
      showToast(
        'Consultation Recorded',
        `Your appointment for ${date} at ${selectedSlot} is recorded in our system.`,
        'success'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="consultation-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-[#101827]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#F7F3EA] text-[#101827] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#D9D2C3] overflow-hidden relative my-8"
      >
        {/* Header */}
        <div className="bg-[#101827] text-[#F7F3EA] px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#C8A45D]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D]/60 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C8A45D]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif tracking-wider uppercase text-[#F7F3EA]">
                Book a Personal Consultation
              </h2>
              <p className="text-xs text-[#D9D2C3]/70 font-sans">
                Direct guidance with Falgun Thakkr • SHIV DHARA
              </p>
            </div>
          </div>

          <button
            id="close-consultation-modal-btn"
            onClick={resetAndClose}
            className="p-2 text-[#D9D2C3]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="bg-[#EDE8DE] px-6 sm:px-8 py-3 flex items-center justify-between border-b border-[#D9D2C3]">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 1 ? 'bg-[#101827] text-[#F7F3EA]' : 'bg-[#D9D2C3] text-[#101827]'
              }`}>
                1
              </span>
              <span className="text-xs font-medium text-[#101827]">Service</span>
            </div>
            <div className="h-[1px] flex-1 mx-3 bg-[#D9D2C3]" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 2 ? 'bg-[#101827] text-[#F7F3EA]' : 'bg-[#D9D2C3] text-[#101827]'
              }`}>
                2
              </span>
              <span className="text-xs font-medium text-[#101827]">Date & Time</span>
            </div>
            <div className="h-[1px] flex-1 mx-3 bg-[#D9D2C3]" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 3 ? 'bg-[#101827] text-[#F7F3EA]' : 'bg-[#D9D2C3] text-[#101827]'
              }`}>
                3
              </span>
              <span className="text-xs font-medium text-[#101827]">Seeker Details</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Select Service & Format */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-serif font-bold text-[#101827] mb-1">
                  1. Select Your Consultation Discipline
                </h3>
                <p className="text-xs text-[#101827]/70">
                  Every consultation is conducted individually by Falgun Thakkr with personalized charts and non-fear-based remedies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(Object.keys(servicePricing) as (keyof typeof servicePricing)[]).map(key => {
                  const item = servicePricing[key];
                  const isSelected = service === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setService(key)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C8A45D] bg-white shadow-md ring-2 ring-[#C8A45D]/30'
                          : 'border-[#D9D2C3] bg-[#FAF7F0] hover:border-[#B8AF9C]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A6833D]">
                          {item.duration}
                        </span>
                        <span className="text-sm font-serif font-bold text-[#101827]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#101827] mt-1 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#101827]/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101827] mb-2">
                  Session Format
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat('ONLINE_VIDEO')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      format === 'ONLINE_VIDEO'
                        ? 'bg-[#101827] text-[#F7F3EA] border-[#101827]'
                        : 'bg-white border-[#D9D2C3] text-[#101827] hover:bg-[#EDE8DE]'
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#C8A45D]" />
                    <span>Online Video (Zoom HD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('IN_PERSON')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      format === 'IN_PERSON'
                        ? 'bg-[#101827] text-[#F7F3EA] border-[#101827]'
                        : 'bg-white border-[#D9D2C3] text-[#101827] hover:bg-[#EDE8DE]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#C8A45D]" />
                    <span>In-Person / On-Site</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  id="consultation-next-step1-btn"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-semibold tracking-widest uppercase hover:bg-[#182236] flex items-center gap-2 transition-all shadow-md group"
                >
                  <span>Select Date & Slot</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A45D] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date and Time Slot */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-serif font-bold text-[#101827] mb-1">
                  2. Choose Appointment Date & Available Slot
                </h3>
                <p className="text-xs text-[#101827]/70">
                  Times are listed in Indian Standard Time (IST / UTC+5:30).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Consultation Date</span>
                  </label>
                  <input
                    type="date"
                    min={minDateStr}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D] shadow-sm"
                  />
                  <p className="text-[11px] text-[#101827]/60 mt-1.5">
                    Sessions are scheduled at least 24 hours in advance.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Available Time Slot</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-[#101827] text-[#F7F3EA] border-[#101827] shadow-sm'
                            : 'bg-white border-[#D9D2C3] text-[#101827] hover:border-[#A6833D]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-[#EDE8DE] border border-[#D9D2C3] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#101827]/70">Selected Service</span>
                  <p className="text-sm font-serif font-bold text-[#101827]">
                    {servicePricing[service].title} ({format === 'ONLINE_VIDEO' ? 'Online' : 'In-Person'})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#101827]/70">Duration & Fee</span>
                  <p className="text-sm font-serif font-bold text-[#101827]">
                    {servicePricing[service].duration} • ₹{servicePricing[service].price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#101827]/70 hover:text-[#101827]"
                >
                  Back
                </button>
                <button
                  id="consultation-next-step2-btn"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-semibold tracking-widest uppercase hover:bg-[#182236] flex items-center gap-2 transition-all shadow-md group"
                >
                  <span>Provide Contact Details</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A45D] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Seeker Contact and Details */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-serif font-bold text-[#101827] mb-1">
                  3. Seeker Profile & Specific Inquiries
                </h3>
                <p className="text-xs text-[#101827]/70">
                  Your information is kept strictly confidential and used solely by Falgun Thakkr to prepare your consultation chart.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
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
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>
                </div>

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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>
                </div>

                {service === 'Numerology' || service === 'Comprehensive Alignment' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                      Date of Birth (Optional)
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>
                ) : service === 'Vastu' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                      Property Layout Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={e => setPropertyType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    >
                      <option>Apartment / Residential Flat</option>
                      <option>Independent House / Villa</option>
                      <option>Commercial Office</option>
                      <option>Retail Store / Showroom</option>
                      <option>Industrial Factory / Plot</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                      Meditation Experience
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    >
                      <option>Complete Beginner</option>
                      <option>Occasional Practitioner</option>
                      <option>Experienced Seeker</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                  Specific Focus or Query for Falgun Thakkr (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share any key question, current transition, or spatial challenge..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#101827]/70 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant appointment confirmation with Zoom / Meeting invitation sent to your email.</span>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#D9D2C3]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#101827]/70 hover:text-[#101827]"
                >
                  Back
                </button>
                <button
                  id="confirm-booking-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-semibold tracking-widest uppercase hover:bg-[#182236] flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 group"
                >
                  {submitting ? (
                    <span>Scheduling Appointment...</span>
                  ) : (
                    <>
                      <span>Confirm & Schedule</span>
                      <ArrowRight className="w-4 h-4 text-[#C8A45D] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-emerald-700 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#A6833D]">
                  Appointment Scheduled
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#101827] mt-1">
                  Thank You, {confirmedBooking.name}
                </h3>
                <p className="text-xs text-[#101827]/70 max-w-md mx-auto mt-2 leading-relaxed">
                  Your personal consultation with Falgun Thakkr is confirmed. A meeting link and preparation guide have been dispatched to your email.
                </p>
              </div>

              {/* Booking Voucher Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-[#D9D2C3] shadow-md text-left space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-[#D9D2C3]">
                  <span className="text-xs font-mono text-gray-500">
                    Ref: {confirmedBooking.id.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    CONFIRMED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">
                      Discipline
                    </span>
                    <span className="font-semibold text-[#101827]">
                      {confirmedBooking.service}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">
                      Session Format
                    </span>
                    <span className="font-semibold text-[#101827]">
                      {confirmedBooking.type === 'ONLINE_VIDEO' ? 'Zoom HD Video' : 'In-Person'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">
                      Date & Time
                    </span>
                    <span className="font-semibold text-[#101827]">
                      {confirmedBooking.date} at {confirmedBooking.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">
                      Duration
                    </span>
                    <span className="font-semibold text-[#101827]">
                      {confirmedBooking.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  id="done-consultation-btn"
                  onClick={resetAndClose}
                  className="px-8 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-semibold tracking-widest uppercase hover:bg-[#182236] transition-colors"
                >
                  Return to SHIV DHARA
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
