import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { VASTU_DIRECTIONS } from '../../lib/vastu';
import { VastuCompass } from '../vastu/VastuCompass';

interface VastuPageProps {
  onOpenConsultation: () => void;
}

export const VastuPage: React.FC<VastuPageProps> = ({ onOpenConsultation }) => {
  const [selectedDirection, setSelectedDirection] = useState(VASTU_DIRECTIONS[0]); // Default Ishan (Northeast)

  return (
    <div id="page-vastu" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Sacred Architecture & Spatial Energy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Vastu Shastra Geometry & Harmonization
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            Aligning built environments with Earth's magnetic grid and solar directions. Falgun Thakkr specializes in non-destructive Vastu remedies without structural demolition.
          </p>
        </div>
      </section>

      {/* Live Vastu Compass Tool Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <VastuCompass 
          selectedZoneCode={selectedDirection.code}
          onSelectZone={(zone) => setSelectedDirection(zone)}
        />
      </section>

      {/* Interactive 8-Direction Mandala Explorer */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
            Interactive Directional Compass
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#101827]">
            Select a Direction to Inspect Spatial Vibration
          </h2>
          <p className="text-xs sm:text-sm text-[#101827]/70 font-sans">
            Click on any cardinal or intercardinal zone of the traditional Vastu Purusha Mandala below.
          </p>
        </div>

        {/* Direction Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-5xl mx-auto">
          {VASTU_DIRECTIONS.map(dir => {
            const isSelected = selectedDirection.code === dir.code;
            return (
              <button
                key={dir.code}
                onClick={() => setSelectedDirection(dir)}
                className={`p-3.5 rounded-2xl text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#101827] text-[#F7F3EA] border-[#C8A45D] shadow-lg scale-105 ring-2 ring-[#C8A45D]'
                    : 'bg-white border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D] hover:bg-[#FAF7F0]'
                }`}
              >
                <span className="text-xs font-serif font-bold block">{dir.name}</span>
                <span className="text-[10px] font-mono tracking-wider opacity-75 uppercase block mt-0.5">
                  {dir.code}
                </span>
                <span className="text-[9px] text-[#A6833D] font-medium block mt-1">
                  {dir.element}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Direction Detail Display */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#D9D2C3] shadow-xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDirection.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9D2C3] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#101827] text-[#DFC38A]">
                      {selectedDirection.code} Zone
                    </span>
                    <span className="text-xs text-gray-500 font-serif">
                      Element: <strong>{selectedDirection.element}</strong> • Deity: <strong>{selectedDirection.deity}</strong>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#101827] mt-1">
                    {selectedDirection.name} ({selectedDirection.nameHindi})
                  </h3>
                  <p className="text-xs text-[#101827]/75 font-sans mt-1 max-w-xl">
                    {selectedDirection.description}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6833D] block">
                    Governing Planet
                  </span>
                  <span className="text-lg font-serif font-bold text-[#101827]">
                    {selectedDirection.rulingPlanet}
                  </span>
                </div>
              </div>

              {/* Ideal vs Avoid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ideal Activities & Spaces</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#101827]/80">
                    {selectedDirection.idealFor.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-rose-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Incompatible Placements</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#101827]/80">
                    {selectedDirection.avoidInThisZone.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Remedies & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-2 p-4 rounded-xl bg-white border border-[#D9D2C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6833D] block">
                    Non-Destructive Energy Rectification
                  </span>
                  <p className="text-xs text-[#101827]/80 leading-relaxed">
                    {selectedDirection.remedies}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#D9D2C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6833D] block">
                    Harmonizing Color Palette
                  </span>
                  <p className="text-xs font-semibold text-[#101827]">
                    {selectedDirection.colors.join(', ')}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Vastu Spatial Diagnostic Analyzer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
        <VastuDiagnosticAnalyzer onOpenConsultation={onOpenConsultation} />
      </section>

      {/* Non-Destructive Vastu Philosophy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
            Ethical Alignment
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#101827] font-light">
            The Truth About Vastu: No Need to Break Walls
          </h2>
          <p className="text-xs sm:text-sm text-[#101827]/75 font-sans leading-relaxed">
            In modern urban apartments and commercial towers, demolishing walls is rarely practical. Falgun Thakkr specializes in non-destructive Vastu harmonization.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Superstitious Myths vs. Reality</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-[#101827]/80">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>"Your South entrance will curse your family." (False — South is ruled by Mars/Yama; aligned with courage and proper elemental balancing).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>"You must break your kitchen or move." (False — subtle remedies, elemental reflectors, and copper pyramids balance conflicting elements).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>"Expensive miracle gemstones placed in foundations." (False — genuine Vastu works with light, prana circulation, and uncluttered geometry).</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>The SHIV DHARA Method</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-[#101827]/80">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Elemental Equilibrium:</strong> Neutralizing elemental clashes (Fire in North, Water in South) using color therapy and metals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Pranic Circulation:</strong> Unblocking dense stagnations in Northeast Ishan and anchoring Southwest Nairutya.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Grounded Living:</strong> Orienting your work desk and sleep direction to align with Earth's electromagnetic field.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Card */}
        <div className="rounded-2xl bg-[#101827] text-[#F7F3EA] p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-[#C8A45D]/40">
          <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#F7F3EA]">
            Ready for a Professional Spatial Audit?
          </h3>
          <p className="text-xs sm:text-sm text-[#D9D2C3]/80 max-w-xl mx-auto leading-relaxed">
            Falgun Thakkr conducts detailed residential and commercial Vastu floor plan audits worldwide via high-definition Zoom and on-site visits.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A45D] via-[#DFC38A] to-[#C8A45D] text-[#101827] text-xs font-bold tracking-[0.2em] uppercase hover:scale-105 transition-all shadow-xl active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Book Vastu Spatial Audit</span>
            <ArrowRight className="w-4 h-4 text-[#101827]" />
          </button>
        </div>
      </section>
    </div>
  );
};

// Interactive Vastu Diagnostic Analyzer Subcomponent
const VastuDiagnosticAnalyzer: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  const [entrance, setEntrance] = useState('NE');
  const [bedroom, setBedroom] = useState('SW');
  const [kitchen, setKitchen] = useState('SE');
  const [pooja, setPooja] = useState('NE');
  const [desk, setDesk] = useState('EAST_NORTH');

  const calculateResults = () => {
    let score = 0;
    const items: { room: string; status: 'OPTIMAL' | 'COMPATIBLE' | 'REMEDY_RECOMMENDED'; remedy: string }[] = [];

    // Entrance
    if (['NE', 'E', 'N'].includes(entrance)) {
      score += 20;
      items.push({
        room: 'Main Entrance',
        status: 'OPTIMAL',
        remedy: 'Highly auspicious prana entry. Keep the entrance well-lit with warm yellow light and uncluttered.',
      });
    } else if (['W', 'NW'].includes(entrance)) {
      score += 15;
      items.push({
        room: 'Main Entrance',
        status: 'COMPATIBLE',
        remedy: 'Favorable air/space vibration. Place a natural green plant or crystal orb near the doorway.',
      });
    } else {
      score += 8;
      items.push({
        room: 'Main Entrance',
        status: 'REMEDY_RECOMMENDED',
        remedy: 'Elemental friction zone. Place a brass threshold strip and hang a copper Om or Swastika emblem on the exterior doorframe.',
      });
    }

    // Master Bedroom
    if (bedroom === 'SW') {
      score += 20;
      items.push({
        room: 'Master Bedroom',
        status: 'OPTIMAL',
        remedy: 'Perfect Nairutya Earth stability. Ensures deep restorative sleep and solid authority.',
      });
    } else if (['S', 'W'].includes(bedroom)) {
      score += 16;
      items.push({
        room: 'Master Bedroom',
        status: 'COMPATIBLE',
        remedy: 'Grounded placement. Ensure bed headboard is aligned to South or West while sleeping.',
      });
    } else {
      score += 7;
      items.push({
        room: 'Master Bedroom',
        status: 'REMEDY_RECOMMENDED',
        remedy: 'Potential restless sleep. Use heavy earthen pottery in Southwest corner of the bedroom and sleep with head facing South.',
      });
    }

    // Kitchen
    if (kitchen === 'SE') {
      score += 20;
      items.push({
        room: 'Kitchen (Cooking Zone)',
        status: 'OPTIMAL',
        remedy: 'Ideal Agni Fire zone. Ensures healthy digestion and positive domestic energy.',
      });
    } else if (kitchen === 'NW') {
      score += 16;
      items.push({
        room: 'Kitchen (Cooking Zone)',
        status: 'COMPATIBLE',
        remedy: 'Secondary air-fire harmony. Keep cooking counter spotless and cook facing East.',
      });
    } else {
      score += 6;
      items.push({
        room: 'Kitchen (Cooking Zone)',
        status: 'REMEDY_RECOMMENDED',
        remedy: 'Fire-Water elemental clash. Place a yellow Citrine crystal or small green tile under the cooktop without wall demolition.',
      });
    }

    // Pooja / Meditation
    if (['NE', 'E'].includes(pooja)) {
      score += 20;
      items.push({
        room: 'Pooja / Meditation Corner',
        status: 'OPTIMAL',
        remedy: 'Luminous Ishan Water/Spirit vibration. Perfect for morning breathwork and contemplative prayer.',
      });
    } else if (['N', 'W'].includes(pooja)) {
      score += 15;
      items.push({
        room: 'Pooja / Meditation Corner',
        status: 'COMPATIBLE',
        remedy: 'Serene vibration. Keep prayer altar elevated off the floor.',
      });
    } else {
      score += 8;
      items.push({
        room: 'Pooja / Meditation Corner',
        status: 'REMEDY_RECOMMENDED',
        remedy: 'Dense energy zone. Light a natural ghee lamp or copper camphor burner in the Northeast corner of the room.',
      });
    }

    // Work Desk
    if (desk === 'EAST_NORTH' || desk === 'NE') {
      score += 20;
      items.push({
        room: 'Work Desk Facing',
        status: 'OPTIMAL',
        remedy: 'Facing solar magnetic currents. Enhances executive focus, memory retention, and financial clarity.',
      });
    } else {
      score += 12;
      items.push({
        room: 'Work Desk Facing',
        status: 'COMPATIBLE',
        remedy: 'Re-orient desk so you face East or North while seated. Keep a small desk globe or pyrite crystal in North zone.',
      });
    }

    return { score, items };
  };

  const { score, items } = calculateResults();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9D2C3] shadow-xl space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#A6833D] block">
          Self-Diagnostic Diagnostic Tool
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif text-[#101827]">
          Interactive Vastu Spatial Harmony Calculator
        </h3>
        <p className="text-xs sm:text-sm text-[#101827]/75 font-sans">
          Select your current room placements to receive your non-destructive Vastu score and tailored elemental remedies.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#FAF7F0] p-6 rounded-2xl border border-[#D9D2C3]">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1.5">
            Main Entrance Direction
          </label>
          <select
            value={entrance}
            onChange={e => setEntrance(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2C3] text-xs font-semibold text-[#101827]"
          >
            <option value="NE">Northeast (Ishan) — Preferred</option>
            <option value="E">East (Surya) — Good</option>
            <option value="N">North (Kuber) — Good</option>
            <option value="SE">Southeast (Agni)</option>
            <option value="S">South (Yama)</option>
            <option value="SW">Southwest (Nairutya)</option>
            <option value="W">West (Varuna)</option>
            <option value="NW">Northwest (Vayu)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1.5">
            Master Bedroom Zone
          </label>
          <select
            value={bedroom}
            onChange={e => setBedroom(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2C3] text-xs font-semibold text-[#101827]"
          >
            <option value="SW">Southwest (Nairutya) — Ideal</option>
            <option value="S">South (Yama) — Good</option>
            <option value="W">West (Varuna) — Good</option>
            <option value="NW">Northwest (Vayu)</option>
            <option value="NE">Northeast (Ishan)</option>
            <option value="SE">Southeast (Agni)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1.5">
            Kitchen / Cooking Stove
          </label>
          <select
            value={kitchen}
            onChange={e => setKitchen(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2C3] text-xs font-semibold text-[#101827]"
          >
            <option value="SE">Southeast (Agni) — Ideal</option>
            <option value="NW">Northwest (Vayu) — Good</option>
            <option value="W">West (Varuna)</option>
            <option value="NE">Northeast (Ishan)</option>
            <option value="SW">Southwest (Nairutya)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1.5">
            Pooja / Meditation Space
          </label>
          <select
            value={pooja}
            onChange={e => setPooja(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2C3] text-xs font-semibold text-[#101827]"
          >
            <option value="NE">Northeast (Ishan) — Ideal</option>
            <option value="E">East (Surya) — Good</option>
            <option value="N">North (Kuber) — Good</option>
            <option value="W">West (Varuna)</option>
            <option value="SE">Southeast (Agni)</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#101827] mb-1.5">
            Work Desk Seating Facing Direction
          </label>
          <select
            value={desk}
            onChange={e => setDesk(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2C3] text-xs font-semibold text-[#101827]"
          >
            <option value="EAST_NORTH">Facing East or North — Recommended</option>
            <option value="NE">Facing Northeast</option>
            <option value="WEST">Facing West</option>
            <option value="SOUTH">Facing South</option>
          </select>
        </div>
      </div>

      {/* Score Header */}
      <div className="p-6 rounded-2xl bg-[#101827] text-[#F7F3EA] flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C8A45D]/40">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#DFC38A]">
            Spatial Harmony Index
          </span>
          <h4 className="text-2xl font-serif font-light text-[#F7F3EA]">
            {score >= 80 ? '✦ High Pranic Resonance' : score >= 60 ? '✦ Moderate Alignment' : '✦ Pranic Friction Detected'}
          </h4>
          <p className="text-xs text-[#D9D2C3]/70 font-sans">
            Calculated across the 5 primary living zones. Non-destructive remedies applied below.
          </p>
        </div>

        <div className="text-center shrink-0">
          <div className="text-4xl font-serif font-bold text-[#DFC38A]">
            {score}%
          </div>
          <div className="w-36 h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C8A45D] to-[#DFC38A] transition-all duration-500 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A6833D]">
          Zone-by-Zone Non-Destructive Remedy Plan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D9D2C3] space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold text-[#101827]">{item.room}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    item.status === 'OPTIMAL'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'COMPATIBLE'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[#101827]/80 leading-relaxed font-sans">
                {item.remedy}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 text-center">
        <button
          onClick={onOpenConsultation}
          className="px-8 py-3.5 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-[0.18em] uppercase hover:bg-[#182236] inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <span>Get Custom Floor Plan Audit by Falgun Thakkr</span>
          <ArrowRight className="w-4 h-4 text-[#C8A45D]" />
        </button>
      </div>
    </div>
  );
};
