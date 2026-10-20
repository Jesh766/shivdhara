import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, User, ArrowRight, CheckCircle2, ShieldCheck, Sun, Moon, Compass, ShoppingBag } from 'lucide-react';
import { analyzeNumerology, numerologyArchetypes } from '../../lib/numerology';
import { NumerologyAnalysis } from '../../types';
import { useCart } from '../../context/CartContext';

interface NumerologyPageProps {
  onOpenConsultation: () => void;
  onNavigate: (path: string) => void;
}

export const NumerologyPage: React.FC<NumerologyPageProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(1992);
  const [name, setName] = useState('');
  const [analysis, setAnalysis] = useState<NumerologyAnalysis | null>(() =>
    analyzeNumerology(15, 8, 1992, 'Aarav Sharma')
  );
  const [activeTabNumber, setActiveTabNumber] = useState<number>(1);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = analyzeNumerology(Number(day), Number(month), Number(year), name || undefined);
    setAnalysis(result);
    document.getElementById('analysis-result-box')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="page-numerology" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Numerology Vidya</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Numerology & Planetary Frequency
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed">
            Understand the mathematical rhythm of your birth date. In the classical tradition, numbers are symbolic manifestations of planetary vibrations—illuminating your natural gifts, growth edges, and life path.
          </p>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#D9D2C3] p-6 sm:p-8">
          <div className="border-b border-[#D9D2C3] pb-4 mb-6">
            <h2 className="text-xl font-serif font-bold text-[#101827] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C8A45D]" />
              <span>Interactive Numerology Calculator</span>
            </h2>
            <p className="text-xs text-[#101827]/70 mt-1">
              Enter your date of birth and name to calculate your Birth Number (Moolank), Life Path (Bhagyank), and Name Frequency (Namank).
            </p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                  Birth Day (1-31)
                </label>
                <select
                  value={day}
                  onChange={e => setDay(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                  Birth Month
                </label>
                <select
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m, idx) => (
                    <option key={m} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                  Birth Year
                </label>
                <select
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                >
                  {Array.from({ length: 80 }, (_, i) => 2026 - i).map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-sm text-[#101827] focus:outline-none focus:border-[#C8A45D]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.18em] uppercase hover:bg-[#182236] flex items-center gap-2 transition-all shadow-md cursor-pointer group"
              >
                <span>Calculate My Alignment</span>
                <ArrowRight className="w-4 h-4 text-[#C8A45D] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Analysis Result Display */}
      {analysis && (
        <section id="analysis-result-box" className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white border border-[#C8A45D]/60 p-6 sm:p-10 shadow-2xl space-y-8"
          >
            {/* Top Vibration Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#D9D2C3]">
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6833D] block">
                  Birth Number (Moolank)
                </span>
                <span className="text-4xl font-serif font-bold text-[#101827] block my-1">
                  {analysis.birthNumber}
                </span>
                <span className="text-xs text-[#101827]/70 font-medium">
                  {analysis.rulingPlanet}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6833D] block">
                  Life Path (Bhagyank)
                </span>
                <span className="text-4xl font-serif font-bold text-[#101827] block my-1">
                  {analysis.lifePathNumber}
                </span>
                <span className="text-xs text-[#101827]/70 font-medium">
                  Destiny Frequency
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6833D] block">
                  Name Number (Namank)
                </span>
                <span className="text-4xl font-serif font-bold text-[#101827] block my-1">
                  {analysis.nameNumber || '—'}
                </span>
                <span className="text-xs text-[#101827]/70 font-medium">
                  {analysis.nameNumber ? 'Chaldean Sound Resonance' : 'Provide Name Above'}
                </span>
              </div>
            </div>

            {/* Core Vibration & Archetype */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A6833D]">
                Primary Archetype
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#101827]">
                Number {analysis.birthNumber} • {analysis.rulingPlanet}
              </h3>
              <p className="text-sm sm:text-base text-[#101827]/80 leading-relaxed font-sans">
                {analysis.coreVibration}
              </p>
            </div>

            {/* Strengths & Growth Areas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Inherent Strengths</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#101827]/80">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                  <span>Growth & Balance Areas</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#101827]/80">
                  {analysis.growthAreas.map((g, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alignments (Colors, Days, Directions, Bracelets) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6833D] block mb-1">
                  Harmonizing Colors
                </span>
                <p className="text-xs font-semibold text-[#101827]">
                  {analysis.auspiciousColors.join(', ')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6833D] block mb-1">
                  Auspicious Days
                </span>
                <p className="text-xs font-semibold text-[#101827]">
                  {analysis.auspiciousDays.join(', ')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6833D] block mb-1">
                  Harmonizing Vastu Directions
                </span>
                <p className="text-xs font-semibold text-[#101827]">
                  {analysis.harmonizingDirections.join(', ')}
                </p>
              </div>
            </div>

            {/* Reflective Guidance */}
            <div className="p-6 rounded-xl bg-[#101827] text-[#F7F3EA] space-y-2 border border-[#C8A45D]/40">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#DFC38A] block">
                Reflective Wisdom by Falgun Thakkr
              </span>
              <p className="text-sm font-serif italic text-[#D9D2C3] leading-relaxed">
                "{analysis.reflectiveGuidance}"
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D9D2C3]">
              <button
                onClick={() => onNavigate('/products')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F0] border border-[#D9D2C3] text-xs font-bold tracking-wider uppercase text-[#101827] hover:border-[#C8A45D] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C8A45D]" />
                <span>View Number {analysis.birthNumber} Bracelets</span>
              </button>

              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.18em] uppercase hover:bg-[#182236] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Book Detailed Numerology Session</span>
                <ArrowRight className="w-4 h-4 text-[#C8A45D]" />
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {/* Complete Guide to Numbers 1-9 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
            Planetary Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#101827] font-light">
            The Nine Numbers & Planetary Rulers
          </h2>
          <p className="text-xs sm:text-sm text-[#101827]/70 font-sans">
            Click on any number from 1 to 9 to examine its planetary signature, archetype, and key frequencies.
          </p>
        </div>

        {/* Number Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => setActiveTabNumber(num)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-sm sm:text-base font-serif font-bold transition-all ${
                activeTabNumber === num
                  ? 'bg-[#101827] text-[#F7F3EA] shadow-lg ring-2 ring-[#C8A45D] scale-105'
                  : 'bg-white border border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D]'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Active Number Details Card */}
        {(() => {
          const item = numerologyArchetypes[activeTabNumber];
          return (
            <motion.div
              key={activeTabNumber}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-white border border-[#D9D2C3] shadow-md space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9D2C3] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#A6833D] block">
                    {item.planet}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#101827] mt-0.5">
                    Number {activeTabNumber}: {item.archetype}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#101827]/60 block">Birth Dates</span>
                  <span className="text-xs font-mono font-bold text-[#101827]">
                    {activeTabNumber === 1 ? '1st, 10th, 19th, 28th' :
                     activeTabNumber === 2 ? '2nd, 11th, 20th, 29th' :
                     activeTabNumber === 3 ? '3rd, 12th, 21st, 30th' :
                     activeTabNumber === 4 ? '4th, 13th, 22nd, 31st' :
                     activeTabNumber === 5 ? '5th, 14th, 23rd' :
                     activeTabNumber === 6 ? '6th, 15th, 24th' :
                     activeTabNumber === 7 ? '7th, 16th, 25th' :
                     activeTabNumber === 8 ? '8th, 17th, 26th' : '9th, 18th, 27th'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#101827]/80 leading-relaxed font-sans">
                {item.coreVibration}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    Key Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#101827]/80">
                    {item.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                    Growth Considerations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#101827]/80">
                    {item.growthAreas.map((g, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] text-xs text-[#101827]/80">
                <strong className="text-[#101827]">Reflective Focus:</strong> {item.reflectiveGuidance}
              </div>
            </motion.div>
          );
        })()}
        {/* Guiding Numerology Dimensions */}
        <div className="pt-20 border-t border-[#D9D2C3] mt-20 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
              Core Methodologies
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#101827]">
              The Five Pillars of Numerology
            </h3>
            <p className="text-xs sm:text-sm text-[#101827]/70 font-sans">
              A comprehensive system integrating daily birth frequency, lifetime destiny, name phonetics, and cyclical timing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Birth Number (Moolank)',
                subtitle: 'CORE VIBRATIONAL FREQUENCY',
                desc: 'Determined directly by your calendar day of birth (1–31). It reveals your instinctive reaction to challenges, innate vitality, and primary temperament.',
                archetype: 'The Sun (Surya) — Vitality & Will',
              },
              {
                step: '02',
                title: 'Life Path (Bhagyank)',
                subtitle: 'COSMIC TRAJECTORY & PURPOSE',
                desc: 'The aggregate sum of your complete Day, Month, and Year. It illuminates the major cycles, recurring lessons, and spiritual trajectory you are meant to navigate.',
                archetype: 'Jupiter (Brihaspati) — Higher Dharma',
              },
              {
                step: '03',
                title: 'Name Vibration (Namank)',
                subtitle: 'SOCIAL & BUSINESS RESONANCE',
                desc: 'Every consonant and vowel carries an elemental frequency. Aligning your name vibration creates effortless resonance between your public identity and birth numbers.',
                archetype: 'Mercury (Budha) — Articulation & Harmony',
              },
              {
                step: '04',
                title: 'Enterprise & Cyclical Timing',
                subtitle: 'ORGANIZATIONAL HARMONY',
                desc: 'Harmonize company titles, partnership agreements, and launch dates with favorable cyclical numbers to foster growth without unnecessary friction.',
                archetype: 'Ketu — Strategic Intuition & Deep Vision',
              },
              {
                step: '05',
                title: 'Private Consultation',
                subtitle: 'DIAGNOSIS & NON-FATALISTIC REMEDIES',
                desc: 'Engage in a 1-on-1 diagnostic consultation with Falgun Thakkr. Receive precise gemstone recommendations, daily practices, and actionable numerical adjustments.',
                archetype: 'Mars (Mangala) — Transformation & Action',
              },
              {
                step: '06',
                title: 'Harmonized Gemstones',
                subtitle: 'CRYSTAL & MINERAL RESONANCE',
                desc: 'Certified natural gemstones hand-strung and charged with sacred mantras corresponding to your planetary vibrations to amplify auspicious frequencies.',
                archetype: 'Planetary Resonators & Malas',
              },
            ].map((pillar) => (
              <div key={pillar.step} className="p-6 rounded-2xl bg-white border border-[#D9D2C3] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A6833D] px-2.5 py-0.5 rounded bg-[#FAF7F0] border border-[#D9D2C3]">
                    {pillar.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#101827]/60">
                    {pillar.subtitle}
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-[#101827]">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#101827]/70 leading-relaxed font-sans">
                  {pillar.desc}
                </p>
                <div className="pt-2 border-t border-[#D9D2C3]/60 text-[11px] font-medium text-[#A6833D]">
                  ✦ {pillar.archetype}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#182236] transition-all shadow-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Private Numerology Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#C8A45D]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
