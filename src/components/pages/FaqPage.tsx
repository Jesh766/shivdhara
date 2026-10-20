import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface FaqPageProps {
  onOpenConsultation: () => void;
}

interface FaqItem {
  question: string;
  answer: string;
  category: 'Numerology' | 'Vastu' | 'Meditation' | 'Products & Orders';
}

const faqs: FaqItem[] = [
  {
    category: 'Numerology',
    question: 'How is Numerology different from Western or pop-astrology numerology?',
    answer: 'Numerology (Ank Shastra) is deeply interconnected with the 9 planetary vibrations (Navagraha). Rather than predicting generic future events, it examines your Birth Number (Moolank), Life Path Number (Bhagyank), and Name Vibration (Namank) as a psychological diagnostic tool to illuminate inherent behavioral patterns and timing cycles.'
  },
  {
    category: 'Numerology',
    question: 'Do I need my exact time of birth for a Numerology reading?',
    answer: 'No. Unlike traditional astrological natal charts (Kundali), Numerology relies on your exact calendar Date, Month, and Year of birth alongside your full given name. Exact hour and minute are helpful for supplementary context, but not strictly mandatory.'
  },
  {
    category: 'Vastu',
    question: 'Will I need to break walls or renovate my house for a Vastu audit?',
    answer: 'Absolutely not. Falgun Thakkr practices non-destructive Vastu harmonization. Modern apartments and commercial offices can be balanced through elemental compensation, color realignment, metallic reflectors (copper/brass), lighting temperature calibration, and strategic furniture re-orientation.'
  },
  {
    category: 'Vastu',
    question: 'How are remote online Vastu consultations conducted?',
    answer: 'For remote audits, you provide your architectural floor plan, compass orientation, and short video walkthroughs of each room. Falgun Thakkr superimposes the 16-zone Vastu Purusha Mandala over your blueprint and conducts an in-depth 60-minute Zoom video conference explaining precise adjustments.'
  },
  {
    category: 'Meditation',
    question: 'I have trouble sitting still with a racing mind. Can I still practice?',
    answer: 'Yes! The purpose of meditation is not to violently suppress thoughts, but to anchor attention to the breath (Prana Dharana) and sound vibration. Falgun Thakkr begins with physiological diaphragmatic breathing (the 4-4-6 rhythm) which naturally calms the nervous system without force.'
  },
  {
    category: 'Products & Orders',
    question: 'How are the gemstone bracelets energized?',
    answer: 'Every bracelet and mala in the SHIV DHARA sanctuary is made from 100% natural, unheated, certified gemstones. Prior to dispatch, each piece undergoes a traditional purification (Shuddhi) and planetary mantra chanting ceremony calibrated to the specific gemstone resonance.'
  },
  {
    category: 'Products & Orders',
    question: 'What is the standard delivery timeframe for orders?',
    answer: 'Orders are prepared, energized, and dispatched within 2 business days. Express courier delivery takes 3-5 business days across India. International orders typically arrive in 7-10 business days with end-to-end tracking.'
  }
];

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenConsultation }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Numerology', 'Vastu', 'Meditation', 'Products & Orders'];

  const filteredFaqs = activeCategory === 'ALL'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div id="page-faq" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Seeker Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            Transparent, grounded answers regarding our consultations, workshops, methodology, and sacred accessories.
          </p>
        </div>
      </section>

      {/* Main FAQ Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#101827] text-[#F7F3EA] shadow-md ring-2 ring-[#C8A45D]'
                  : 'bg-white border border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D]'
              }`}
            >
              {cat === 'ALL' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#D9D2C3] overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                >
                  <span className="text-base font-serif font-bold text-[#101827]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FAF7F0] border border-[#D9D2C3] flex items-center justify-center text-[#101827] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#101827] text-[#DFC38A] border-[#101827]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-6 pt-0 border-t border-[#D9D2C3]/60 text-xs sm:text-sm text-[#101827]/80 font-sans leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Need More Assistance */}
        <div className="p-8 rounded-3xl bg-[#101827] text-[#F7F3EA] text-center space-y-4 border border-[#C8A45D]/40 shadow-xl">
          <h3 className="text-xl font-serif text-[#F7F3EA]">
            Have a Specific Question for Falgun Thakkr?
          </h3>
          <p className="text-xs text-[#D9D2C3]/80 max-w-md mx-auto leading-relaxed">
            Our AI assistant <strong>Dhara</strong> is available 24/7 at the bottom right, or you can book a direct consultation.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 rounded-full bg-[#C8A45D] text-[#101827] text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Book Private Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
