import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onNavigateToCheckout?: () => void;
  onProceedToCheckout?: () => void;
  onNavigateToProducts?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onProceedToCheckout,
  onNavigateToProducts,
}) => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, shippingCost, total } =
    useCart();

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    } else if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      window.location.hash = '/checkout';
    }
  };

  const handleGoToProducts = () => {
    setIsCartOpen(false);
    if (onNavigateToProducts) {
      onNavigateToProducts();
    } else {
      window.location.hash = '/products';
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#101827]/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#F7F3EA] text-[#101827] flex flex-col shadow-2xl border-l border-[#D9D2C3]"
            >
              {/* Header */}
              <div className="p-6 bg-[#101827] text-[#F7F3EA] flex items-center justify-between border-b border-[#C8A45D]/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D]/60 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif tracking-wider uppercase text-[#F7F3EA]">
                      Sacred Bag
                    </h2>
                    <p className="text-xs text-[#D9D2C3]/70 font-sans">
                      {items.length} {items.length === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>

                <button
                  id="close-cart-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-[#D9D2C3]/70 hover:text-[#F7F3EA] hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Meter */}
              <div className="px-6 py-3.5 bg-[#FAF7F0] border-b border-[#D9D2C3]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#101827]/70 font-medium">
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>You have unlocked Free Pan-India Shipping!</span>
                      </span>
                    ) : (
                      <>Add ₹{remainingForFreeShipping.toLocaleString('en-IN')} for Free Shipping</>
                    )}
                  </span>
                  <span className="font-semibold text-[#101827]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EDE8DE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A6833D] to-[#C8A45D] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#EDE8DE] border border-[#D9D2C3] flex items-center justify-center mb-4 text-[#C8A45D]">
                      <Sparkles className="w-8 h-8 opacity-70" />
                    </div>
                    <h3 className="text-xl font-serif text-[#101827] mb-2">
                      Your sacred bag is empty
                    </h3>
                    <p className="text-xs text-[#101827]/60 max-w-xs mb-6 leading-relaxed">
                      Explore our handcrafted numerology gemstone bracelets, Nepali rudraksha malas, and sacred energized accessories.
                    </p>
                    <button
                      id="explore-products-empty-cart-btn"
                      onClick={handleGoToProducts}
                      className="px-6 py-2.5 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-semibold tracking-widest uppercase hover:bg-[#182236] transition-colors cursor-pointer"
                    >
                      Explore Boutique
                    </button>
                  </div>
                ) : (
                  items.map(item => {
                    const price = item.selectedVariant?.price || item.product.price;
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.id || 'standard'}`}
                        className="flex gap-4 p-4 rounded-xl bg-white border border-[#D9D2C3] shadow-sm relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#EDE8DE] shrink-0 border border-[#D9D2C3]/60">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-serif font-bold text-[#101827] leading-snug line-clamp-1">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() =>
                                  removeItem(item.product.id, item.selectedVariant?.id)
                                }
                                className="text-gray-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {item.selectedVariant && (
                              <p className="text-[11px] text-[#A6833D] font-medium mt-0.5">
                                Variant: {item.selectedVariant.name}
                              </p>
                            )}

                            {item.product.numerologyNumber && (
                              <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#D9D2C3] text-[#101827]">
                                Number {item.product.numerologyNumber}
                              </span>
                            )}
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#FAF7F0]">
                            <div className="flex items-center border border-[#D9D2C3] rounded-lg bg-[#FAF7F0]">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.selectedVariant?.id
                                  )
                                }
                                className="p-1 text-[#101827]/70 hover:text-[#101827] transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold font-mono text-[#101827]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.selectedVariant?.id
                                  )
                                }
                                className="p-1 text-[#101827]/70 hover:text-[#101827] transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-[#101827]">
                              ₹{(price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 bg-white border-t border-[#D9D2C3] space-y-4">
                  <div className="space-y-2 text-sm text-[#101827]/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#101827]">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pan-India Shipping</span>
                      <span className="font-medium text-[#101827]">
                        {shippingCost === 0 ? (
                          <span className="text-emerald-700 font-semibold">FREE</span>
                        ) : (
                          `₹${shippingCost}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-[#101827] pt-2 border-t border-[#D9D2C3]">
                      <span>Total Amount</span>
                      <span className="text-lg font-serif font-bold text-[#101827]">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#101827]/60 justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Energized & Certified Natural Gemstones • Secure Checkout</span>
                  </div>

                  <button
                    id="checkout-btn-from-cart"
                    onClick={handleGoToCheckout}
                    className="w-full py-3.5 px-6 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#182236] flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#C8A45D] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
