import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface FinalCtaProps {
  onOpenConsultation: () => void;
  onNavigate: (path: string) => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  return (
    <section
      id="final-cta-section"
      className="py-36 bg-[#163A36] text-[#F7F1E6] relative overflow-hidden text-center transition-colors-editorial border-t border-[#315C52]/50"
    >
      {/* Expanding Soft Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[550px] bg-[radial-gradient(circle,_rgba(49,92,82,0.4)_0%,_rgba(197,106,69,0.12)_50%,_transparent_70%)] blur-[110px] pointer-events-none" />

      {/* Architectural Geometry Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <div className="w-[600px] h-[600px] rounded-full border border-[#E6D5B8]/30 border-dashed" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#C56A45]/40" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2623] border border-[#315C52] text-[#C56A45]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="type-label-subtle">BEGIN YOUR ALIGNMENT</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="type-display-xl text-[#F7F1E6]"
        >
          Begin Your Journey with <span className="type-italic-accent text-[#E6D5B8]">Shiv Dhara.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="type-body-editorial text-[#E6D5B8]/85 max-w-xl mx-auto"
        >
          Align your personal numbers, balance your spatial sanctuary, and cultivate stillness with Falgun Thakkr.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto btn-primary-terracotta"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
          </button>

          <button
            onClick={() => onNavigate('/workshops')}
            className="w-full sm:w-auto btn-secondary-ivory"
          >
            <Compass className="w-4 h-4 text-[#C56A45]" />
            <span>Explore Live Workshops</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
