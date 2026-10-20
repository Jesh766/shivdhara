import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, ArrowRight, Sparkles } from 'lucide-react';
import { Workshop } from '../../types';

interface FeaturedWorkshopsProps {
  onNavigate: (path: string) => void;
  onSelectWorkshop: (workshop: Workshop) => void;
}

export const FeaturedWorkshops: React.FC<FeaturedWorkshopsProps> = ({
  onNavigate,
  onSelectWorkshop,
}) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/workshops')
      .then((res) => res.json())
      .then((data) => {
        if (data.workshops) {
          setWorkshops(data.workshops);
        }
      })
      .catch((err) => console.error('Failed to load workshops', err))
      .finally(() => setLoading(false));
  }, []);

  const featured = workshops[0];
  const secondaryWorkshops = workshops.slice(1, 3);

  return (
    <section
      id="featured-workshops-section"
      className="py-32 bg-[#F7F1E6] text-[#241E1A] relative border-t border-[#E6D5B8] transition-colors-editorial"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-[#E6D5B8]">
          <div className="space-y-3 max-w-2xl">
            <span className="type-label-subtle text-[#C56A45] block">
              IMMERSIVE COHORTS
            </span>
            <h2 className="type-display-xl text-[#163A36]">
              Wisdom Circles & <span className="type-italic-accent text-[#C56A45]">Masterclasses.</span>
            </h2>
            <p className="type-body-editorial text-[#4A423C]">
              Intimate live masterclasses led directly by Falgun Thakkr. Master the sacred sciences of numbers, spatial diagnostic auditing, and daily breath balance.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/workshops')}
            className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.18em] text-[#163A36] hover:text-[#C56A45] transition-colors pb-1 border-b border-[#163A36] hover:border-[#C56A45] self-start md:self-auto cursor-pointer"
          >
            <span>View All Cohorts</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C56A45]" />
          </button>
        </div>

        {/* Editorial Layout */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-[460px] rounded-3xl bg-[#EFE4CF] animate-pulse" />
            <div className="lg:col-span-5 h-[460px] rounded-3xl bg-[#EFE4CF] animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Featured Workshop Experience */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 rounded-3xl bg-[#FAF6EF] border border-[#E6D5B8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#163A36]">
                  <img
                    src={featured.image || featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2623] via-[#0E2623]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full type-label text-[10px] bg-[#163A36]/90 text-[#F7F1E6] border border-[#315C52] backdrop-blur-sm">
                      Featured Cohort
                    </span>
                    <span className="px-3 py-1 rounded-full type-label text-[10px] bg-[#F7F1E6] text-[#163A36]">
                      {featured.isOnline ? 'Live Online' : 'In-Person'}
                    </span>
                  </div>

                  {/* Prominent Architectural Date & Price */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                    <div className="flex items-center gap-3 bg-[#0E2623]/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
                      <span className="text-2xl sm:text-3xl font-serif text-[#E6D5B8] leading-none">
                        {featured.displayDate?.split(' ')[0] || '18'}
                      </span>
                      <span className="type-label text-[10px] text-[#F7F1E6]/80 block leading-tight">
                        {featured.displayDate?.split(' ').slice(1).join(' ') || 'OCTOBER'}
                      </span>
                    </div>

                    <span className="text-xl sm:text-2xl font-serif font-normal text-[#F7F1E6]">
                      ₹{featured.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <h3 className="type-heading-xl text-[#163A36] group-hover:text-[#C56A45] transition-colors">
                    {featured.title}
                  </h3>
                  <p className="type-body-sm text-[#4A423C]">
                    {featured.description}
                  </p>

                  <div className="pt-4 border-t border-[#E6D5B8] flex items-center justify-between">
                    <span className="type-label text-[11px] text-[#315C52] flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>
                        {featured.capacity - featured.registeredCount} Seats Remaining
                      </span>
                    </span>

                    <button
                      onClick={() => onSelectWorkshop(featured)}
                      className="btn-primary-terracotta text-xs"
                    >
                      <span>Reserve Seat</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F7F1E6]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Secondary Cohort Experiences */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {secondaryWorkshops.map((w, idx) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  className="rounded-3xl bg-[#FAF6EF] border border-[#E6D5B8] p-7 shadow-xs hover:shadow-md transition-all duration-300 flex-1 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#4A423C]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EFE4CF] text-[#C56A45] type-label text-[9px]">
                        {w.category || 'Sacred Science'}
                      </span>
                      <span className="font-sans font-semibold text-[#163A36]">₹{w.price.toLocaleString('en-IN')}</span>
                    </div>

                    <h4 className="type-heading-md text-[#163A36] group-hover:text-[#C56A45] transition-colors">
                      {w.title}
                    </h4>

                    <p className="type-body-sm text-xs text-[#4A423C] line-clamp-2">
                      {w.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6D5B8] flex items-center justify-between mt-4">
                    <span className="type-label text-[10px] text-[#4A423C]">
                      {w.displayDate || w.date}
                    </span>

                    <button
                      onClick={() => onSelectWorkshop(w)}
                      className="inline-flex items-center gap-1.5 type-label text-xs text-[#163A36] hover:text-[#C56A45] transition-colors cursor-pointer font-semibold"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-3 h-3 text-[#C56A45]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
