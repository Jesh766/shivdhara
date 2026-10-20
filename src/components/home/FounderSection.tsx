import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, Compass, Heart, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FOUNDER_IMAGE } from '../../lib/assets';

interface FounderSectionProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const [valuesVisible, setValuesVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (quoteRef.current) {
        gsap.to(quoteRef.current, {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Reveal values grid on scroll-into-view
      if (valuesRef.current) {
        ScrollTrigger.create({
          trigger: valuesRef.current,
          start: 'top 82%',
          onEnter: () => setValuesVisible(true),
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToValues = () => {
    valuesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const values = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Scholarly Authenticity',
      body: 'Rooted in classical texts and time-tested numerological principles — without diluted pop-horoscope clichés.',
    },
    {
      icon: <Compass className="w-5 h-5" />,
      title: 'Non-Destructive Harmony',
      body: 'Respecting physical structures through subtle elemental balancing, lighting, and placement rather than structural demolition.',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Empathetic Guidance',
      body: 'Every seeker is treated with deep respect, genuine listening, and supportive mentorship throughout their life transitions.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="founder-section"
      className="py-36 bg-[#163A36] text-[#F7F1E6] relative overflow-hidden transition-colors-editorial border-t border-[#315C52]/50"
    >
      {/* Atmospheric glows */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[radial-gradient(circle,_rgba(49,92,82,0.35)_0%,_transparent_70%)] blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(197,106,69,0.12)_0%,_transparent_65%)] blur-[95px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[3px] bg-gradient-to-r from-transparent via-[#C56A45]/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Portrait + Primary Bio ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div ref={portraitRef} className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 rounded-3xl border border-[#C56A45]/30 transform -rotate-1 pointer-events-none" />
              <div className="rounded-3xl overflow-hidden bg-[#0E2623] border border-[#315C52] shadow-2xl relative">
                <div className="relative aspect-square sm:aspect-[4/5] w-full bg-[#121B1A]">
                  <img
                    src={FOUNDER_IMAGE}
                    alt="Falgun Thakkr — Founder of SHIV DHARA"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0E2623] via-[#0E2623]/80 to-transparent" />
                </div>
                <div className="p-6 bg-[#0E2623] border-t border-[#315C52]/60">
                  <span className="type-label-subtle text-[#C56A45] block mb-1">
                    FOUNDER & PRINCIPAL PRACTITIONER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F1E6] font-normal">
                    Falgun Thakkr
                  </h3>
                  <p className="text-xs text-[#E6D5B8]/80 font-sans mt-1">
                    Numerologist • Vastu Shastra Consultant • Meditation Guide
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div ref={quoteRef} className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="type-label-subtle text-[#C56A45] block">FOUNDER'S VISION</span>
              <h2 className="type-display-lg text-[#F7F1E6]">
                "Every space carries a{' '}
                <span className="type-italic-accent text-[#E6D5B8]">story.</span> Every number carries a{' '}
                <span className="text-[#C56A45]">pattern.</span>"
              </h2>
            </div>

            {/* Full bio (migrated from AboutPage) */}
            <p className="type-body-editorial text-[#E6D5B8]/90">
              Founded by <strong className="text-[#F7F1E6] font-medium">Falgun Thakkr</strong>, SHIV DHARA emerged from a profound recognition: ancient sciences such as Numerology and Vastu Shastra are deeply practical methodologies for energetic balance, yet modern commercialization has often reduced them to superstitious fear and superficial promises.
            </p>

            <p className="type-body-editorial text-[#E6D5B8]/80">
              Falgun's approach is scholarly, grounded, and empathetic. Whether analyzing personal birth numbers, conducting spatial energy audits, or leading guided breath cohorts — the focus is always on actionable clarity, emotional peace, and sustainable personal alignment.
            </p>

            {/* Sacred Promise badge */}
            <div className="p-4 rounded-2xl bg-[#0E2623]/70 border border-[#315C52]/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C56A45] shrink-0 mt-0.5" />
              <p className="text-xs text-[#E6D5B8]/85 font-sans leading-relaxed">
                <strong className="text-[#F7F1E6]">Our Sacred Promise:</strong> Zero fear-based marketing, zero pressure to purchase arbitrary remedies, and 100% confidential consultation integrity.
              </p>
            </div>

            {/* Principle cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0E2623]/60 border border-[#315C52]/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C56A45] shrink-0 mt-0.5" />
                <div>
                  <h4 className="type-label text-[11px] text-[#F7F1E6] mb-1">Zero Fear-Mongering</h4>
                  <p className="type-body-sm text-xs text-[#E6D5B8]/70">
                    Respectful consultations without intimidating predictions or artificial curses.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E2623]/60 border border-[#315C52]/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#E6D5B8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="type-label text-[11px] text-[#F7F1E6] mb-1">Non-Destructive Vastu</h4>
                  <p className="type-body-sm text-xs text-[#E6D5B8]/70">
                    Harmonizing spatial flow using elemental balancing and orientation — no demolition.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button onClick={onOpenConsultation} className="btn-primary-terracotta">
                <span>Schedule Private Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
              </button>
              <button onClick={scrollToValues} className="btn-secondary-ivory">
                <span>Our Core Values</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Core Values (migrated from AboutPage) ── */}
        <div
          ref={valuesRef}
          className="mt-28 pt-16 border-t border-[#315C52]/50 space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="type-label-subtle text-[#C56A45] block">ETHICAL CODE</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F1E6]">
              The Core Values of SHIV DHARA
            </h3>
            <p className="text-sm text-[#E6D5B8]/70 font-sans leading-relaxed">
              A conscious sanctuary built on the authentic confluence of timeless sciences, spatial harmony, and inner stillness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-[#0E2623]/70 border border-[#315C52]/60 space-y-4 transition-all duration-700 ${
                  valuesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#163A36] border border-[#315C52] flex items-center justify-center text-[#C56A45]">
                  {v.icon}
                </div>
                <h4 className="text-base font-serif font-normal text-[#F7F1E6]">{v.title}</h4>
                <p className="text-xs text-[#E6D5B8]/70 leading-relaxed font-sans">{v.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onOpenConsultation}
              className="btn-primary-terracotta mx-auto"
            >
              <span>Consult with Falgun Thakkr</span>
              <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};