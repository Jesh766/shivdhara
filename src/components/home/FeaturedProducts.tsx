import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface FeaturedProductsProps {
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products.slice(0, 4));
        }
      })
      .catch((err) => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  }, []);

  const heroProduct = products[0];
  const secondaryProducts = products.slice(1, 4);

  return (
    <section
      id="featured-products-section"
      className="py-32 bg-[#E6D5B8] text-[#241E1A] relative border-t border-[#D4BE98] transition-colors-editorial"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-[#D4BE98]">
          <div className="space-y-3 max-w-2xl">
            <span className="type-label-subtle text-[#C56A45] block">
              SACRED ENERGIZED OBJECTS
            </span>
            <h2 className="type-display-xl text-[#163A36]">
              Energized Gemstones & <span className="type-italic-accent text-[#C56A45]">Sacred Malas.</span>
            </h2>
            <p className="type-body-editorial text-[#4A423C]">
              Hand-strung certified natural gemstones energized with sacred mantras prior to dispatch, aligned with your Birth Number (Moolank).
            </p>
          </div>

          <button
            onClick={() => onNavigate('/products')}
            className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.18em] text-[#163A36] hover:text-[#C56A45] transition-colors pb-1 border-b border-[#163A36] hover:border-[#C56A45] self-start md:self-auto cursor-pointer"
          >
            <span>Explore Numbers 1–9 Boutique</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C56A45]" />
          </button>
        </div>

        {/* Featured Gallery Showcase */}
        {loading ? (
          <div className="h-96 rounded-3xl bg-[#F0E4D0] animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Primary Large Product Object */}
            {heroProduct && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 rounded-3xl bg-[#F7F1E6] border border-[#D4BE98] p-8 sm:p-12 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                  <div
                    className="h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#FAF6EF] border border-[#E6D5B8] cursor-pointer relative"
                    onClick={() => onSelectProduct(heroProduct)}
                  >
                    <img
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {heroProduct.numerologyNumber && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full type-label text-[10px] bg-[#163A36]/90 text-[#F7F1E6] border border-[#315C52]">
                          Number {heroProduct.numerologyNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <span className="type-label-subtle text-[#C56A45] block">
                      {heroProduct.rulingPlanet || 'Planetary Resonance'}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(heroProduct)}
                      className="type-heading-xl text-[#163A36] group-hover:text-[#C56A45] transition-colors leading-snug cursor-pointer"
                    >
                      {heroProduct.name}
                    </h3>
                    <p className="type-body-sm text-[#4A423C]">
                      {heroProduct.description}
                    </p>

                    <div className="pt-1">
                      <span className="text-2xl font-serif text-[#163A36] block">
                        ₹{heroProduct.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => addItem(heroProduct, 1)}
                        className="btn-primary-terracotta text-xs"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#F7F1E6]" />
                        <span>Add to Sacred Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Secondary Products Gallery */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {secondaryProducts.map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="rounded-2xl bg-[#F7F1E6] border border-[#D4BE98] p-4 flex items-center justify-between gap-4 shadow-xs hover:shadow-md transition-all group"
                >
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF6EF] shrink-0 border border-[#E6D5B8] cursor-pointer"
                    onClick={() => onSelectProduct(prod)}
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="type-label-subtle text-[#C56A45] block">
                      Number {prod.numerologyNumber || 'Sacred'}
                    </span>
                    <h4
                      onClick={() => onSelectProduct(prod)}
                      className="text-base font-serif text-[#163A36] group-hover:text-[#C56A45] transition-colors truncate cursor-pointer"
                    >
                      {prod.name}
                    </h4>
                    <span className="text-sm font-sans font-semibold text-[#163A36] block mt-0.5">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => addItem(prod, 1)}
                    className="p-3 rounded-xl bg-[#FAF6EF] border border-[#E6D5B8] text-[#163A36] hover:bg-[#C56A45] hover:text-[#F7F1E6] hover:border-[#C56A45] transition-all cursor-pointer shrink-0"
                    title="Add to Sacred Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
