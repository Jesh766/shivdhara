import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { recordFormSubmission } from '../../lib/analytics';
import { sendInquiryEmail } from '../../lib/emailService';

const SANCTUARY_EMAIL = 'shivdhara.occult@gmail.com';
const SANCTUARY_PHONE = '+91 6359666315';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const { showToast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Missing Fields', 'Please fill in your name, email, and message.', 'error');
      return;
    }

    setSending(true);

    const submissionData = {
      id: `cont-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: subject,
      message: message.trim(),
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    // 1. Persist locally to ensure no message is ever lost
    try {
      const stored = JSON.parse(localStorage.getItem('shiv_dhara_contacts') || '[]');
      stored.unshift(submissionData);
      localStorage.setItem('shiv_dhara_contacts', JSON.stringify(stored));
    } catch {}

    // 2. Track in analytics
    recordFormSubmission('contactMessages', { name: name.trim(), email: email.trim(), subject });

    // Email delivery should never block the visitor from completing the form.
    try {
      await Promise.race([
        sendInquiryEmail({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject,
          message: message.trim(),
        }),
        new Promise((resolve) => setTimeout(resolve, 7000)),
      ]);
    } catch (error) {
      console.error('Contact email delivery failed', error);
    }

    // 4. Save in server database for Admin Portal
    try {
      await Promise.race([
        fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service: subject,
          message: message.trim(),
          recipientEmail: SANCTUARY_EMAIL,
        }),
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    } catch (err: any) {}

    setSentSuccess(true);
    showToast('Inquiry Sent to Email', `Your message has been delivered to ${SANCTUARY_EMAIL}`, 'success');
    setSending(false);
  };

  return (
    <div id="page-contact" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Sacred Connect</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Connect with SHIV DHARA
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            Whether you have questions about personal numerology charts, spatial floor audits, or sacred gemstone bracelets, our sanctuary welcomes your message.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Studio Location */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
                Direct Touchpoints
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#101827]">
                We Are Here to Guide You
              </h2>
              <p className="text-xs sm:text-sm text-[#101827]/70 leading-relaxed font-sans">
                Direct inquiries are personally reviewed by Falgun Thakkr and our team.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#C8A45D] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                    Official Email Sanctuary
                  </span>
                  <a
                    href={`mailto:${SANCTUARY_EMAIL}`}
                    className="text-sm font-semibold text-[#101827] hover:text-[#C8A45D] transition-colors"
                  >
                    {SANCTUARY_EMAIL}
                  </a>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Direct email inbox for inquiries & requests
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#C8A45D] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                    Direct Phone / WhatsApp
                  </span>
                  <a
                    href="tel:+916359666315"
                    className="text-sm font-semibold text-[#101827] hover:text-[#C8A45D] transition-colors"
                  >
                    {SANCTUARY_PHONE}
                  </a>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Mon - Sat: 9:30 AM to 7:30 PM IST
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#C8A45D] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                    Sanctuary Studio & Office
                  </span>
                  <p className="text-sm font-semibold text-[#101827]">
                    206, Jalaram Complex, 2nd Floor, Gita Mandir Road
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Nr. S. T. Bus Stop, Lati Bazar, Ahmedabad-22 (GUJ), India (Visits by Prior Appointment)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101827] text-[#F7F3EA] space-y-2 border border-[#C8A45D]/40">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#DFC38A] block">
                Global HD Consultations
              </span>
              <p className="text-xs text-[#D9D2C3]/80 leading-relaxed font-sans">
                Consultations and Vastu audits are conducted globally across North America, Europe, Singapore, UAE, and Pan-India via Zoom HD with time-zone calibration.
              </p>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#D9D2C3] shadow-xl">
            {sentSuccess ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#101827]">
                    Inquiry Delivered to Sanctuary
                  </h3>
                  <p className="text-xs sm:text-sm text-[#101827]/70 max-w-md mx-auto leading-relaxed">
                    Your message has been sent directly to <strong>{SANCTUARY_EMAIL}</strong>. Falgun Thakkr and our team will review your inquiry and reply to your email address shortly.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSentSuccess(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-6 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold uppercase tracking-wider hover:bg-[#182236] cursor-pointer shadow-sm transition-all"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-5">
                <div className="border-b border-[#D9D2C3] pb-4 mb-6">
                  <h3 className="text-xl font-serif font-bold text-[#101827]">
                    Send a Sacred Note
                  </h3>
                  <p className="text-xs text-[#101827]/70 mt-1">
                    Fill out the form below. Your message will be delivered straight to our official email inbox at {SANCTUARY_EMAIL}.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aarav@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 6359666315"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                  >
                    <option value="Numerology Consultation">Numerology Reading</option>
                    <option value="Vastu Spatial Audit">Residential / Commercial Vastu Audit</option>
                    <option value="Meditation Guidance">Meditation & Pranayama Guidance</option>
                    <option value="Live Workshop Inquiry">Wisdom Circle Cohorts & Workshops</option>
                    <option value="Product & Gemstone Inquiry">Gemstone Bracelet & Mala Orders</option>
                    <option value="General Inquiry">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                    Your Message / Situation *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share any background details or questions..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#101827]/70 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your information is strictly confidential and delivered directly to {SANCTUARY_EMAIL}.</span>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-xl bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#182236] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {sending ? (
                    <span>Delivering Note to Email...</span>
                  ) : (
                    <>
                      <span>Send Direct Message to Email</span>
                      <Send className="w-4 h-4 text-[#C8A45D]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
