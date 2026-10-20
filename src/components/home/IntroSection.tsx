import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Wind, ArrowRight } from 'lucide-react';

interface IntroSectionProps {
  onNavigate: (path: string) => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      id: 'numerology',
      keyword: 'NUMBERS',
      sanskrit: 'Ank Vidya',
      title: 'Numerology',
      description:
        'Vibrational frequencies encoded in your date of birth. Discover the archetypes of your Birth Number (Moolank) and Life Path (Bhagyank) without dogmatic fatalism.',
      icon: Sparkles,
      link: '/numerology',
      cta: 'Explore Numerology',
      num: '01',
      accentColor: '#C56A45',
    },
    {
      id: 'vastu',
      keyword: 'SPACE',
      sanskrit: 'Vastu Shastra',
      title: 'Spatial Architecture',
      description:
        'Harmonize your living sanctuary and workspaces with cardinal directions and the Five Elements through non-destructive energetic remedies and metallic resonance.',
      icon: Compass,
      link: '/vastu',
      cta: 'Explore Vastu Vidya',
      num: '02',
      accentColor: '#315C52',
    },
    {
      id: 'meditation',
      keyword: 'STILLNESS',
      sanskrit: 'Dhyana & Prana',
      title: 'Conscious Meditation',
      description:
        'Ground restless attention through neuro-somatic 4-4-6 breath regulation, sound resonance, and quiet inner equilibrium guided by Falgun Thakkr.',
      icon: Wind,
      link: '/meditation',
      cta: 'Explore Meditation',
      num: '03',
      accentColor: '#D49A52',
    },
  ];

  return (
    <section
      id="intro-section"
      className="py-32 bg-[#F7F1E6] text-[#241E1A] relative overflow-hidden transition-colors-editorial border-t border-[#E6D5B8]"
    >
      {/* Subtle Natural Paper Texture */}
      <div className="absolute inset-0 natural-grain-ivory opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-24 pb-12 border-b border-[#E6D5B8]">
          <div className="lg:col-span-8 space-y-4">
            <span className="type-label-subtle text-[#C56A45] block">
              THE TRIAD OF ALIGNMENT
            </span>
            <h2 className="type-display-xl text-[#163A36]">
              Where Numbers, Space & <span className="type-italic-accent text-[#C56A45]">Stillness</span> Converge.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="type-body-editorial text-[#4A423C] text-sm sm:text-base">
              True harmony is not mysterious. It is the conscious alignment of your birth rhythm, the physical sanctuary around you, and the breath within your chest.
            </p>
          </div>
        </div>

        {/* Full-Width Editorial Typographic Strips */}
        <div className="space-y-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group border-b border-[#E6D5B8] pb-16 relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Grand Keyword Display */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="type-label text-[#C56A45]">{pillar.num}</span>
                      <span className="w-8 h-[1px] bg-[#E6D5B8]" />
                      <span className="type-label-subtle text-[#315C52]">{pillar.sanskrit}</span>
                    </div>

                    <h3 className="type-display-lg text-[#163A36] group-hover:text-[#C56A45] transition-colors duration-500 tracking-tight">
                      {pillar.keyword}
                    </h3>
                  </div>

                  {/* Editorial Description & Icon */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#163A36]">
                      <Icon className="w-4 h-4" style={{ color: pillar.accentColor }} />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="type-body-sm text-[#4A423C]">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Direct Architectural Action */}
                  <div className="lg:col-span-3 flex lg:justify-end">
                    <button
                      onClick={() => onNavigate(pillar.link)}
                      className="group/btn inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#163A36]/30 text-[#163A36] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-[#163A36] hover:text-[#F7F1E6] hover:border-[#163A36] transition-all cursor-pointer"
                    >
                      <span>{pillar.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C56A45] group-hover/btn:text-[#F7F1E6] group-hover/btn:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
