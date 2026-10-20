import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface NumerologyScrollJourneyProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

const numerologyPillars = [
  {
    step: '01',
    number: 1,
    title: 'Birth Number (Moolank)',
    subtitle: 'CORE VIBRATIONAL FREQUENCY',
    desc: 'Determined directly by your calendar day of birth (1–31). It reveals your instinctive reaction to challenges, innate vitality, and primary temperament.',
    archetype: 'The Sun (Surya) — Vitality, Independence, Inner Will',
    accent: '#C56A45',
  },
  {
    step: '02',
    number: 3,
    title: 'Life Path (Bhagyank)',
    subtitle: 'COSMIC TRAJECTORY & PURPOSE',
    desc: 'The aggregate sum of your complete Day, Month, and Year. It illuminates the major cycles, recurring lessons, and spiritual trajectory you are meant to navigate.',
    archetype: 'Jupiter (Brihaspati) — Expansion, Wisdom, Higher Dharma',
    accent: '#315C52',
  },
  {
    step: '03',
    number: 5,
    title: 'Name Vibration (Namank)',
    subtitle: 'SOCIAL & BUSINESS RESONANCE',
    desc: 'Every consonant and vowel carries an elemental frequency. Aligning your name vibration creates effortless resonance between your public identity and birth numbers.',
    archetype: 'Mercury (Budha) — Intellect, Articulation, Adaptability',
    accent: '#D49A52',
  },
  {
    step: '04',
    number: 7,
    title: 'Enterprise & Cyclical Timing',
    subtitle: 'ORGANIZATIONAL HARMONY',
    desc: 'Harmonize company titles, partnership agreements, and launch dates with favorable cyclical numbers to foster growth without unnecessary friction.',
    archetype: 'Ketu — Strategic Intuition, Mastery, Deep Vision',
    accent: '#163A36',
  },
  {
    step: '05',
    number: 9,
    title: 'Private Consultation',
    subtitle: 'DIAGNOSIS & NON-FATALISTIC REMEDIES',
    desc: 'Engage in a 1-on-1 diagnostic consultation with Falgun Thakkr. Receive precise gemstone recommendations, daily practices, and actionable numerical adjustments.',
    archetype: 'Mars (Mangala) — Direct Realization, Transformation',
    accent: '#C56A45',
  },
];

export const NumerologyScrollJourney: React.FC<NumerologyScrollJourneyProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current || !triggerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=1600',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const index = Math.min(
            numerologyPillars.length - 1,
            Math.floor(self.progress * numerologyPillars.length)
          );
          setActiveStep(index);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const currentItem = numerologyPillars[activeStep] || numerologyPillars[0];

  return (
    <section
      ref={containerRef}
      id="numerology-journey-section"
      className="bg-[#F7F1E6] text-[#241E1A] relative border-t border-[#E6D5B8] overflow-hidden transition-colors-editorial"
    >
      <div ref={triggerRef} className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-[#E6D5B8]">
            <div className="space-y-2">
              <span className="type-label-subtle text-[#C56A45] block">
                ANCIENT ANK VIDYA
              </span>
              <h2 className="type-display-xl text-[#163A36]">
                The Architectural Language of <span className="type-italic-accent text-[#C56A45]">Numbers.</span>
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/numerology')}
              className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.18em] text-[#163A36] hover:text-[#C56A45] transition-colors pb-1 border-b border-[#163A36] hover:border-[#C56A45] self-start md:self-auto cursor-pointer"
            >
              <span>Explore Interactive Numerology Vidya</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C56A45]" />
            </button>
          </div>

          {/* Architectural Split Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Huge Architectural Numeral */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-[#EFE4CF]/60 border border-[#E6D5B8] relative min-h-[380px] overflow-hidden">
              {/* Concentric Architectural Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-72 h-72 rounded-full border border-[#163A36]" />
                <div className="absolute w-48 h-48 rounded-full border border-[#C56A45] border-dashed" />
                <div className="absolute w-28 h-28 rounded-full border border-[#315C52]" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.step}
                  initial={{ opacity: 0, scale: 0.75, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.15, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center relative z-10"
                >
                  <span className="type-numeral-huge text-[#163A36] block">
                    {currentItem.number}
                  </span>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F7F1E6] border border-[#E6D5B8]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentItem.accent }} />
                    <span className="type-label text-[10px] text-[#241E1A]">Phase {currentItem.step} of 05</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Dynamic Narrative & Clarity */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.step}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <span className="type-label-subtle text-[#C56A45] block">
                    {currentItem.subtitle}
                  </span>

                  <h3 className="type-heading-xl text-[#163A36]">
                    {currentItem.title}
                  </h3>

                  <p className="type-body-editorial text-[#4A423C]">
                    {currentItem.desc}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#EFE4CF]/50 border border-[#E6D5B8] text-xs font-sans text-[#241E1A] flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#C56A45] shrink-0" />
                    <span><strong>Planetary Archetype:</strong> {currentItem.archetype}</span>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={onOpenConsultation}
                      className="btn-primary-terracotta"
                    >
                      <span>Book Reading</span>
                      <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
                    </button>

                    <button
                      onClick={() => onNavigate('/numerology')}
                      className="btn-secondary-teal"
                    >
                      Calculate Your Numbers
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2.5 pt-6 border-t border-[#E6D5B8]">
                {numerologyPillars.map((p, idx) => (
                  <button
                    key={p.step}
                    onClick={() => setActiveStep(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeStep === idx
                        ? 'w-10 bg-[#C56A45]'
                        : 'w-2 bg-[#E6D5B8] hover:bg-[#C56A45]/40'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
