import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, Clock, Sparkles, ArrowRight, User, X } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogPageProps {
  onOpenConsultation: () => void;
}

export const sampleArticles: BlogPost[] = [
  {
    id: 'art-1',
    title: 'Why Numerology is Mathematical Frequency, Not Superstition',
    slug: 'numerology-frequency-vs-superstition',
    excerpt: 'How numerology acts as a reflective mirror for psychological and archetypal tendencies rather than a deterministic doom prediction.',
    content: `For generations, the ancient discipline of numerology has been misunderstood. When sensationalized in popular culture, numbers are often reduced to "lucky lottery numbers" or frightening declarations about cursed days.

In classical scholarship, however, numbers (Ank Shastra) are recognized as symbolic expressions of cosmic vibrations and planetary archetypes. Just as music is built upon mathematical ratios of sound frequencies, human consciousness and earthly seasons reflect periodic mathematical rhythms.

When Falgun Thakkr computes your Birth Number (Moolank) and Life Path Number (Bhagyank), the intention is never to prescribe a fatalistic future. Instead, it offers a diagnostic mirror:
1. Understanding your inherent behavioral tendencies.
2. Identifying recurring cycles of acceleration and introspection.
3. Choosing mindful routines and grounding practices that harmonize your personal frequency.

True wisdom lies in understanding your natural rhythm so you may navigate life with deliberate grace.`,
    author: 'Falgun Thakkr',
    authorRole: 'Founder & Scholar',
    publishedAt: 'August 12, 2026',
    readTime: '5 min read',
    category: 'Numerology',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    published: true,
  },
  {
    id: 'art-2',
    title: 'The Power of Non-Destructive Vastu in Urban Homes',
    slug: 'power-of-non-destructive-vastu',
    excerpt: 'Practical spatial adjustments for modern apartments: How light, elemental balance, and intentional furniture orientation restore home serenity.',
    content: `One of the greatest misconceptions in modern Vastu consultations is the belief that living in harmony requires knocking down concrete pillars or reconstructing bathrooms.

In high-rise metropolitan residences in Mumbai, Bengaluru, and Delhi, structural demolition is both impossible and unnecessary.

Classical Vastu Purusha Mandala operates on the science of the Five Great Elements (Pancha Bhoota):
- Ether / Space (Akasha)
- Air (Vayu)
- Fire (Agni)
- Water (Jala)
- Earth (Prithvi)

When an architectural zone experiences an elemental conflict (such as a water feature in a fire zone), the solution lies in elemental compensation:
1. Adjusting lighting temperature and lux levels.
2. Introducing grounding copper or brass metals to disperse erratic frequencies.
3. Placing live botanical resonators to revitalize stagnant Northeast (Ishan) energy.
4. Aligning the primary headboard orientation towards the South or East to support restorative delta sleep.

Spatial peace is created through subtle attunement, not sledgehammers.`,
    author: 'Falgun Thakkr',
    authorRole: 'Vastu & Energy Architect',
    publishedAt: 'July 28, 2026',
    readTime: '6 min read',
    category: 'Vastu',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    published: true,
  },
  {
    id: 'art-3',
    title: 'Cultivating the Still Point: The 4-4-6 Pranayama Rhythm',
    slug: 'cultivating-still-point-446-pranayama',
    excerpt: 'A neuro-somatic exploration of diaphragmatic breathing and how conscious breath cycles calm the sympathetic nervous system.',
    content: `In an era characterized by continuous digital stimulation and chronic cognitive overdrive, our breath is frequently shallow, erratic, and chest-bound.

The Shiv Dhara 4-4-6 breath rhythm is designed to restore natural parasympathetic tone:
- 4 Seconds Inhale: Drawing pure prana through both nostrils, allowing the lower belly to softly expand.
- 4 Seconds Kumbhaka (Retention): Resting in the sacred pause between in-breath and out-breath where the thinking mind naturally stills.
- 6 Seconds Rechaka (Exhale): Slowly releasing breath with relaxed lips and shoulders, signaling deep safety to the autonomic nervous system.

Practicing just 10 cycles morning and evening creates an unshakeable internal sanctuary that no external storm can disturb.`,
    author: 'Falgun Thakkr',
    authorRole: 'Meditation Master',
    publishedAt: 'July 14, 2026',
    readTime: '4 min read',
    category: 'Meditation',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    published: true,
  }
];

export const BlogPage: React.FC<BlogPageProps> = ({ onOpenConsultation }) => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  return (
    <div id="page-blog" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {/* Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Wisdom Journal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Reflections on Numbers, Space & Stillness
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            Essays and contemplative insights by Falgun Thakkr on navigating modern life with ancient clarity.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleArticles.map(article => (
            <div
              key={article.id}
              className="rounded-2xl bg-white border border-[#D9D2C3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div
                  className="h-56 relative overflow-hidden bg-[#182236] cursor-pointer"
                  onClick={() => setActiveArticle(article)}
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#101827]/90 text-[#DFC38A] border border-[#C8A45D]/40">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#101827]/60 font-sans">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3
                    onClick={() => setActiveArticle(article)}
                    className="text-xl font-serif font-bold text-[#101827] group-hover:text-[#A6833D] transition-colors leading-snug cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#101827]/70 font-sans leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#101827] hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <span>Read Reflection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8A45D]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div id="blog-reader-modal" className="fixed inset-0 z-50 bg-[#101827]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F3EA] text-[#101827] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#D9D2C3] overflow-hidden my-8"
            >
              <div className="relative h-64 sm:h-80 bg-[#182236]">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/40 to-transparent" />

                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#C8A45D] text-[#101827]">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA] leading-snug">
                    {activeArticle.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-[#D9D2C3]/80 font-sans">
                    <span>By {activeArticle.author} ({activeArticle.authorRole})</span>
                    <span>•</span>
                    <span>{activeArticle.publishedAt}</span>
                    <span>•</span>
                    <span>{activeArticle.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="prose max-w-none text-sm text-[#101827]/85 font-sans leading-relaxed whitespace-pre-line">
                  {activeArticle.content}
                </div>

                <div className="pt-6 border-t border-[#D9D2C3] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-gray-500">
                    Category: {activeArticle.category}
                  </span>

                  <button
                    onClick={() => {
                      setActiveArticle(null);
                      onOpenConsultation();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold uppercase tracking-wider hover:bg-[#182236]"
                  >
                    Consult on this Topic
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
