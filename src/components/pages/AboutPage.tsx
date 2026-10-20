import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Heart, Compass, CheckCircle2, ArrowRight, UserCheck, Award } from 'lucide-react';
import { FOUNDER_IMAGE } from '../../lib/assets';

interface AboutPageProps {
  onOpenConsultation: () => void;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  return (
    <div id="page-about" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>The Origin & Vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            About SHIV DHARA & Falgun Thakkr
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            A conscious sanctuary built on the authentic confluence of timeless sciences, spatial harmony, and inner stillness.
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden bg-[#182236] border border-[#C8A45D]/60 shadow-2xl relative">
              <div className="aspect-square sm:aspect-[4/5] w-full bg-[#101827]">
                <img
                  src={FOUNDER_IMAGE}
                  alt="Falgun Thakkr — Founder of SHIV DHARA"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-[#101827] border-t border-[#C8A45D]/30 text-center">
                <span className="text-[11px] font-sans font-medium tracking-widest text-[#C8A45D] uppercase">
                  Falgun Thakkr • Founder
                </span>
              </div>
            </div>
          </div>

          {/* Bio Story */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
              Meet Falgun Thakkr
            </span>
            <h2 className="text-3xl font-serif text-[#101827] font-light leading-snug">
              Demystifying Sacred Wisdom for Modern Seekers
            </h2>

            <p className="text-sm text-[#101827]/80 font-sans leading-relaxed">
              Founded by <strong>Falgun Thakkr</strong>, SHIV DHARA emerged from a profound recognition: ancient sciences such as Numerology and Vastu Shastra are deeply practical methodologies for energetic balance, yet modern commercialization has often reduced them to superstitious fear and superficial promises.
            </p>

            <p className="text-sm text-[#101827]/80 font-sans leading-relaxed">
              Falgun's approach is scholarly, grounded, and empathetic. Whether analyzing personal birth numbers, conducting spatial energy audits of residential and commercial spaces, or leading guided breath cohorts, the focus is always on actionable clarity, emotional peace, and sustainable personal alignment.
            </p>

            <div className="p-4 rounded-xl bg-white border border-[#D9D2C3] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C8A45D] shrink-0" />
              <p className="text-xs text-[#101827]/80 font-sans">
                <strong>Our Sacred Promise:</strong> Zero fear-based marketing, zero pressure to purchase arbitrary remedies, and 100% confidential consultation integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Guiding Principles */}
        <div className="space-y-8 pt-8 border-t border-[#D9D2C3]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
              Ethical Code
            </span>
            <h3 className="text-2xl font-serif text-[#101827]">
              The Core Values of SHIV DHARA
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#C8A45D]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-[#101827]">
                Scholarly Authenticity
              </h4>
              <p className="text-xs text-[#101827]/70 leading-relaxed font-sans">
                Rooted in classical texts and time-tested numerological principles without diluted pop-horoscope cliches.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#C8A45D]">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-[#101827]">
                Non-Destructive Harmony
              </h4>
              <p className="text-xs text-[#101827]/70 leading-relaxed font-sans">
                Respecting physical structures through subtle elemental balancing, lighting, and placement rather than structural demolition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#C8A45D]">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-[#101827]">
                Empathetic Guidance
              </h4>
              <p className="text-xs text-[#101827]/70 leading-relaxed font-sans">
                Every seeker is treated with deep respect, genuine listening, and supportive mentorship throughout their life transitions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#182236] transition-all shadow-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Consult with Falgun Thakkr</span>
            <ArrowRight className="w-4 h-4 text-[#C8A45D]" />
          </button>
        </div>
      </section>
    </div>
  );
};
