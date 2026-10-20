import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ShieldCheck, ArrowRight } from 'lucide-react';

interface VastuScrollSectionProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

const vastuZones = [
  {
    id: 'northeast',
    index: '01',
    name: 'Northeast (Ishan)',
    direction: 'NORTH EAST',
    element: 'Water & Ether (Jala & Akasha)',
    ruler: 'Lord Shiva & Jupiter',
    essence: 'The zone of meditative clarity, intuitive reception, and sanctuary. Keep elevated, pristine, and light.',
    remedy: 'Non-destructive: Place pure copper water vessels, crystal resonators, or minimalist botanical accents.',
  },
  {
    id: 'southeast',
    index: '02',
    name: 'Southeast (Agni)',
    direction: 'SOUTH EAST',
    element: 'Fire & Vitality (Agni)',
    ruler: 'Venus (Shukra)',
    essence: 'The powerhouse of metabolic energy, financial liquidity, and transformation. Optimal for thermal and cooking systems.',
    remedy: 'Non-destructive: Warm spectrum 2700K lighting, brass reflectors, and balancing terracotta earthen accents.',
  },
  {
    id: 'southwest',
    index: '03',
    name: 'Southwest (Nairutya)',
    direction: 'SOUTH WEST',
    element: 'Earth & Stability (Prithvi)',
    ruler: 'Earth & Grounding Stability',
    essence: 'The anchor zone for decision-making stability, leadership grounding, and deep restorative sleep.',
    remedy: 'Non-destructive: Grounding heavy stone elements, solid wood architectural items, and deep earthen palettes.',
  },
  {
    id: 'north',
    index: '04',
    name: 'North (Kubera)',
    direction: 'NORTH',
    element: 'Water & Fluidity (Jala)',
    ruler: 'Mercury & Lord Kubera',
    essence: 'The corridor of continuous abundance, new opportunities, fluid career momentum, and open sightlines.',
    remedy: 'Non-destructive: Open entryways, emerald botanical accents, and clear, unobstructed energy flow.',
  },
];

export const VastuScrollSection: React.FC<VastuScrollSectionProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [selectedZone, setSelectedZone] = useState(0);

  return (
    <section
      id="vastu-scroll-section"
      className="py-32 bg-[#E6D5B8] text-[#241E1A] relative overflow-hidden transition-colors-editorial border-t border-[#D4BE98]"
    >
      {/* Architectural Grid & Compass Blueprint Lines */}
      <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[850px] h-[850px] border border-[#163A36] rounded-full" />
        <div className="absolute w-[620px] h-[620px] border border-[#315C52] rounded-full border-dashed animate-spin-slow" />
        <div className="absolute w-full h-[1px] bg-[#163A36]/40" />
        <div className="absolute h-full w-[1px] bg-[#163A36]/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-[#D4BE98]">
          <div className="max-w-2xl space-y-3">
            <span className="type-label-subtle text-[#315C52] block">
              ARCHITECTURAL VASTU VIDYA
            </span>
            <h2 className="type-display-xl text-[#163A36]">
              Non-Destructive <span className="type-italic-accent text-[#315C52]">Spatial</span> Harmony.
            </h2>
            <p className="type-body-editorial text-[#4A423C]">
              Living in harmony does not require demolition. Falgun Thakkr applies subtle elemental balancing, metallic resonance, and directional light calibration.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/vastu')}
            className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.18em] text-[#163A36] hover:text-[#C56A45] transition-colors pb-1 border-b border-[#163A36] hover:border-[#C56A45] self-start md:self-auto cursor-pointer"
          >
            <span>Explore 8-Directional Mandala</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C56A45]" />
          </button>
        </div>

        {/* Directional Zone Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Zone Selector Strip */}
          <div className="lg:col-span-5 space-y-3">
            {vastuZones.map((zone, idx) => {
              const isActive = selectedZone === idx;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(idx)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#F7F1E6] border-[#315C52] shadow-md -translate-y-0.5'
                      : 'bg-[#F0E4D0]/60 border-[#D4BE98]/70 hover:bg-[#F7F1E6]/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="type-label text-[10px] text-[#315C52] block mb-1">
                        {zone.direction} {zone.index}
                      </span>
                      <span className="text-lg font-serif font-normal text-[#163A36]">
                        {zone.name}
                      </span>
                    </div>
                    <span
                      className={`type-label text-[10px] px-3 py-1 rounded-full ${
                        isActive ? 'bg-[#315C52] text-[#F7F1E6]' : 'text-[#315C52] bg-black/5'
                      }`}
                    >
                      {zone.element.split('&')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Zone Diagnostic Area */}
          <div className="lg:col-span-7 bg-[#F7F1E6] rounded-3xl border border-[#D4BE98] p-8 sm:p-12 shadow-sm flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={vastuZones[selectedZone].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <span className="type-label text-[10px] text-[#315C52] block">
                    RULING PRINCIPLE: {vastuZones[selectedZone].ruler}
                  </span>
                  <h3 className="type-heading-xl text-[#163A36] mt-1">
                    {vastuZones[selectedZone].name}
                  </h3>
                </div>

                <div className="space-y-2">
                  <span className="type-label-subtle text-[#C56A45] block">
                    Spatial Principle
                  </span>
                  <p className="type-body-editorial text-[#4A423C]">
                    {vastuZones[selectedZone].essence}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#EFE4CF] border border-[#D4BE98] space-y-1 text-xs sm:text-sm font-sans text-[#241E1A]">
                  <span className="type-label text-[10px] text-[#315C52] block">
                    Non-Destructive Harmonization
                  </span>
                  <p className="type-body-sm text-[#241E1A]">
                    {vastuZones[selectedZone].remedy}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-8 border-t border-[#E6D5B8] flex flex-wrap gap-4 items-center justify-between mt-8">
              <span className="text-xs text-[#4A423C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#315C52]" />
                Residential & Commercial Spatial Audits
              </span>

              <button
                onClick={onOpenConsultation}
                className="btn-primary-terracotta"
              >
                <span>Book Vastu Audit</span>
                <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
