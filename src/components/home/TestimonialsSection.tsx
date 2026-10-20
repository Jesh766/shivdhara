import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 'test-1',
    name: 'Ananya Sharma',
    location: 'Mumbai',
    service: 'Numerology & Career Blueprint',
    quote:
      'Falgun Thakkr’s numerology consultation provided immense clarity without any fatalism. His diagnosis of my Life Path 3 and practical cyclical adjustments helped me navigate a major leadership transition with grounded composure.',
  },
  {
    id: 'test-2',
    name: 'Rajesh & Meera Patel',
    location: 'Ahmedabad',
    service: 'Residential Vastu Shastra Audit',
    quote:
      'We were afraid we would need to break walls in our newly bought residence. Falgun balanced the Northeast and Southeast zones through non-destructive elemental compensation and copper resonance. The sanctuary atmosphere feels immediately serene.',
  },
  {
    id: 'test-3',
    name: 'Dr. Siddharth Menon',
    location: 'Bengaluru',
    service: 'Meditation Cohort & 4-4-6 Breathwork',
    quote:
      'As a surgeon with high daily stress, the Shiv Dhara 4-4-6 diaphragmatic breathing method has been transformative. Falgun’s teaching style is profound yet completely accessible and grounded.',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section
      id="testimonials-section"
      className="py-32 bg-[#F7F1E6] text-[#241E1A] relative border-t border-[#E6D5B8] transition-colors-editorial"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        <span className="type-label-subtle text-[#C56A45] block">
          VOICES OF TRANSFORMATION
        </span>

        {/* Dynamic Editorial Quote */}
        <div className="min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex justify-center gap-1 text-[#D49A52]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#163A36] leading-relaxed italic font-normal max-w-3xl mx-auto">
                "{current.quote}"
              </p>

              <div className="space-y-1">
                <span className="text-base font-serif font-normal text-[#163A36] block">
                  {current.name}
                </span>
                <span className="type-label text-[10px] text-[#4A423C] block">
                  {current.service} • {current.location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-[#FAF6EF] border border-[#E6D5B8] text-[#163A36] hover:border-[#315C52] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#C56A45]' : 'w-2 bg-[#E6D5B8]'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-[#FAF6EF] border border-[#E6D5B8] text-[#163A36] hover:border-[#315C52] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
