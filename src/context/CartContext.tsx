import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ProductVariant } from '../types';
import { useToast } from './ToastContext';
import { trackEvent } from '../lib/analytics';
import { useAuth } from './AuthContext';

export interface ActiveCartRecord {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    variantName?: string;
  }>;
  total: number;
  addedAt: string;
  status: 'IN_CART' | 'ABANDONED_CART' | 'ORDER_PLACED';
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ACTIVE_CARTS_KEY = 'shiv_dhara_active_carts';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Load user-bound cart if user is authenticated, else empty cart
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const activeUser = localStorage.getItem('shiv_dhara_customer_auth_v1');
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        if (parsed && parsed.email) {
          const userCartKey = `shiv_dhara_user_cart_${parsed.email.toLowerCase()}`;
          const saved = localStorage.getItem(userCartKey);
          return saved ? JSON.parse(saved) : [];
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  // Whenever auth status changes (login / logout / switch account):
  useEffect(() => {
    if (user && user.email) {
      // User is logged in: restore their saved cart!
      try {
        const userCartKey = `shiv_dhara_user_cart_${user.email.toLowerCase()}`;
        const saved = localStorage.getItem(userCartKey);
        if (saved) {
          setItems(JSON.parse(saved));
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    } else {
      // User is logged out: clear cart immediately so guest sees empty cart
      setItems([]);
    }
  }, [user]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.selectedVariant?.price || item.product.price) * item.quantity,
    0
  );
  const shippingCost = items.length === 0 ? 0 : subtotal >= 1999 ? 0 : 150;
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Persist cart to user-bound storage and Admin active cart tracking
  useEffect(() => {
    if (user && user.email) {
      const userCartKey = `shiv_dhara_user_cart_${user.email.toLowerCase()}`;
      try {
        localStorage.setItem(userCartKey, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save user cart to localStorage', e);
      }

      if (items.length > 0) {
        const cartRecord: ActiveCartRecord = {
          id: `cart-${user.id || Date.now()}`,
          customerName: user.name || 'Sacred Seeker',
          email: user.email,
          phone: user.phone || '',
          items: items.map((it) => ({
            productId: it.product.id,
            productName: it.product.name,
            productImage: it.product.images[0] || '',
            quantity: it.quantity,
            price: it.selectedVariant?.price || it.product.price,
            variantName: it.selectedVariant?.name,
          })),
          total,
          addedAt: new Date().toISOString(),
          status: 'IN_CART',
        };

        try {
          const rawAll = JSON.parse(localStorage.getItem(ACTIVE_CARTS_KEY) || '[]');
          const filtered = rawAll.filter((c: ActiveCartRecord) => c.email.toLowerCase() !== user.email.toLowerCase());
          filtered.unshift(cartRecord);
          localStorage.setItem(ACTIVE_CARTS_KEY, JSON.stringify(filtered.slice(0, 50)));
        } catch {}

        fetch('/api/carts/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartRecord),
        }).catch(() => null);
      }
    }
  }, [items, total, user]);

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
    // If not logged in, prompt user to sign in so their cart persists permanently
    if (!isAuthenticated) {
      openAuthModal(() => {
        // Will continue add to cart after login
        addItem(product, quantity, variant);
      });
      showToast('Sign In Required', 'Please sign in or create an account to save items in your Sacred Cart.', 'info');
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedVariant: variant }];
    });

    trackEvent('Add to Sacred Bag', { product: product.name, price: product.price, quantity });

    showToast(
      'Added to Sacred Cart',
      `${product.name} (x${quantity}) saved to your account cart.`,
      'gold'
    );
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item Removed', 'Product removed from your cart.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    if (user && user.email) {
      const userCartKey = `shiv_dhara_user_cart_${user.email.toLowerCase()}`;
      try {
        localStorage.removeItem(userCartKey);
      } catch {}
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        shippingCost,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
