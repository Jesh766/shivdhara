import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  QrCode,
  Clock,
  RefreshCw,
  ExternalLink,
  PhoneCall,
  Check,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { PAYMENT_CONFIG } from '../../lib/paymentConfig';
import { buildWhatsAppOrderUrl, generateWhatsAppOrderMessage } from '../../lib/whatsappOrder';
import { UpiQrSection } from '../checkout/UpiQrSection';

interface CheckoutPageProps {
  onNavigateToProducts: () => void;
  onNavigateToHome: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateToProducts,
  onNavigateToHome,
}) => {
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, openAuthModal } = useAuth();

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Selected Checkout Method: 'WHATSAPP' | 'UPI_QR'
  const [selectedMethod, setSelectedMethod] = useState<'WHATSAPP' | 'UPI_QR'>('WHATSAPP');

  // Submission & Order States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [whatsAppDispatched, setWhatsAppDispatched] = useState(false);

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!phone.trim()) errors.phone = 'Phone / WhatsApp number is required';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required';
    if (!addressLine1.trim()) errors.addressLine1 = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!stateName.trim()) errors.stateName = 'State is required';
    if (!postalCode.trim() || postalCode.length < 5) errors.postalCode = 'Valid PIN code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Option 1: WhatsApp Checkout
  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Bag is Empty', 'Please add items before checking out.', 'info');
      return;
    }

    if (!validateForm()) {
      showToast('Incomplete Details', 'Please fill in all required shipping fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = addressLine2
        ? `${addressLine1}, ${addressLine2}`
        : addressLine1;

      // 1. Create order record on server with server-side price validation
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          address: fullAddress,
          city,
          state: stateName,
          pincode: postalCode,
          items: items.map(it => ({
            productId: it.product.id,
            productSlug: it.product.slug,
            productName: it.product.name,
            quantity: it.quantity,
            selectedVariant: it.selectedVariant,
          })),
          paymentMethod: 'WHATSAPP',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      const createdOrder: Order = data.order;
      setPlacedOrder(createdOrder);

      // 2. Build dynamic WhatsApp URL using exact order details from server
      const waOrderPayload = {
        orderNumber: createdOrder.orderNumber,
        customerName: createdOrder.customerName,
        phone: createdOrder.phone,
        email: createdOrder.email,
        address: createdOrder.address,
        city: createdOrder.city,
        state: createdOrder.state,
        pincode: createdOrder.pincode,
        items: createdOrder.items.map(it => ({
          name: it.productName,
          variantName: it.variantName,
          quantity: it.quantity,
          price: it.unitPrice,
        })),
        subtotal: createdOrder.subtotal,
        shipping: createdOrder.shipping,
        total: createdOrder.total,
      };

      const waUrl = buildWhatsAppOrderUrl(waOrderPayload);

      // Clear cart
      clearCart();
      setWhatsAppDispatched(true);
      showToast('Order Created', 'Opening WhatsApp to confirm with SHIV DHARA team...', 'success');

      // 3. Open WhatsApp chat window
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      showToast('Order Error', err.message || 'Could not initiate WhatsApp order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Option 2: UPI QR Payment Submission
  const handleUpiQrPaymentSubmit = async (utr: string, screenshotUrl?: string) => {
    if (items.length === 0) {
      showToast('Bag is Empty', 'Please add items before checking out.', 'info');
      return;
    }

    if (!validateForm()) {
      showToast('Incomplete Details', 'Please complete your shipping address above before submitting payment.', 'error');
      // Scroll to top
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = addressLine2
        ? `${addressLine1}, ${addressLine2}`
        : addressLine1;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          address: fullAddress,
          city,
          state: stateName,
          pincode: postalCode,
          items: items.map(it => ({
            productId: it.product.id,
            productSlug: it.product.slug,
            productName: it.product.name,
            quantity: it.quantity,
            selectedVariant: it.selectedVariant,
          })),
          paymentMethod: 'UPI_QR',
          utr,
          paymentScreenshot: screenshotUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit payment details');
      }

      const createdOrder: Order = data.order;
      setPlacedOrder(createdOrder);
      clearCart();

      showToast(
        'Payment Details Received',
        'Your order has been recorded. Verification is pending with SHIV DHARA team.',
        'info'
      );
    } catch (err: any) {
      showToast('Submission Error', err.message || 'Failed to submit payment verification', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Poll live order verification status
  const handleCheckLiveStatus = async () => {
    if (!placedOrder) return;
    setIsPollingStatus(true);

    try {
      const res = await fetch(`/api/orders/${placedOrder.id}`);
      if (res.ok) {
        const d = await res.json();
        if (d.order) {
          setPlacedOrder(d.order);
          if (d.order.paymentStatus === 'PAYMENT_VERIFIED') {
            showToast('Payment Verified!', 'Your order has been confirmed by SHIV DHARA team.', 'success');
          } else {
            showToast('Verification Status', 'Payment is still being verified by the team.', 'info');
          }
        }
      }
    } catch (e) {
      console.error('Status check error', e);
    } finally {
      setIsPollingStatus(false);
    }
  };

  // =========================================================================
  // VIEW 1: FINAL ORDER PLACED (Payment Verified State)
  // =========================================================================
  if (placedOrder && placedOrder.paymentStatus === 'PAYMENT_VERIFIED') {
    return (
      <div id="order-confirmed-screen" className="min-h-screen bg-[#F7F1E6] text-[#163A36] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-[#FAF4EA] p-8 sm:p-12 rounded-3xl border border-[#E6D5B8] shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 mx-auto flex items-center justify-center shadow-md">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="type-label text-xs text-[#C56A45] tracking-[0.25em] block uppercase">
              ✓ ORDER PLACED
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#163A36]">
              Thank You, {placedOrder.customerName}
            </h1>
            <p className="type-body-sm text-xs sm:text-sm text-[#2B211E]/80 max-w-md mx-auto leading-relaxed">
              Your SHIV DHARA order has been received and verified. Your sacred energized artifacts will be prepared in our studio and dispatched with insured tracking.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="rounded-2xl bg-white border border-[#E6D5B8] p-6 text-left space-y-4 text-xs shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6D5B8]">
              <span className="text-gray-500 font-sans uppercase text-[10px] tracking-wider">
                Order Number
              </span>
              <span className="font-mono font-bold text-sm text-[#163A36]">
                {placedOrder.orderNumber}
              </span>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-[#163A36] block font-serif">
                Order Summary:
              </span>
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#2B211E]/85">
                  <span>
                    {item.productName} (x{item.quantity})
                    {item.variantName && <span className="text-gray-500"> • {item.variantName}</span>}
                  </span>
                  <span className="font-medium font-mono">
                    ₹{item.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E6D5B8] space-y-1.5 font-sans">
              <div className="flex justify-between text-gray-600">
                <span>Payment Method:</span>
                <span className="font-medium text-[#163A36]">
                  {placedOrder.paymentMethod === 'UPI_QR' ? 'UPI (QR Code)' : 'WhatsApp Direct'}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status:</span>
                <span className="font-semibold text-emerald-700">
                  Payment Verified
                </span>
              </div>
              {placedOrder.utr && (
                <div className="flex justify-between text-gray-600">
                  <span>Transaction UTR:</span>
                  <span className="font-mono text-xs text-[#163A36]">{placedOrder.utr}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#163A36] pt-2 border-t border-[#E6D5B8]">
                <span>Total:</span>
                <span className="text-lg font-serif">₹{placedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToProducts}
              className="w-full sm:w-auto btn-primary-terracotta text-xs px-8 py-3.5"
            >
              Continue Shopping
            </button>
            <a
              href={`https://wa.me/${PAYMENT_CONFIG.WHATSAPP_LINK_NUMBER}?text=${encodeURIComponent(
                `Namaste SHIV DHARA, inquiring regarding my verified order ${placedOrder.orderNumber}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#163A36] text-[#F7F1E6] text-xs font-semibold tracking-wider uppercase hover:bg-[#0E2623] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C56A45]" />
              <span>Contact SHIV DHARA</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PAYMENT VERIFICATION PENDING (Immediate state after UPI UTR submission)
  // =========================================================================
  if (placedOrder && placedOrder.paymentMethod === 'UPI_QR' && placedOrder.paymentStatus === 'PAYMENT_VERIFICATION_PENDING') {
    return (
      <div id="payment-verification-pending-screen" className="min-h-screen bg-[#F7F1E6] text-[#163A36] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-[#FAF4EA] p-8 sm:p-12 rounded-3xl border border-[#E6D5B8] shadow-xl">
          {/* Status Icon */}
          <div className="w-20 h-20 rounded-full bg-amber-100 border border-amber-300 text-amber-800 mx-auto flex items-center justify-center shadow-md animate-pulse">
            <Clock className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="type-label text-xs text-amber-800 bg-amber-200/60 px-3.5 py-1 rounded-full inline-block font-semibold tracking-[0.2em] uppercase">
              PAYMENT VERIFICATION PENDING
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#163A36]">
              We've Received Your Payment Details
            </h1>
            <p className="type-body-sm text-xs sm:text-sm text-[#2B211E]/80 max-w-md mx-auto leading-relaxed">
              Our team will verify the payment against our bank records and confirm your order promptly.
            </p>
          </div>

          {/* Details Card */}
          <div className="rounded-2xl bg-white border border-[#E6D5B8] p-6 text-left space-y-4 text-xs shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6D5B8]">
              <span className="text-gray-500 font-sans uppercase text-[10px] tracking-wider">
                Order Number
              </span>
              <span className="font-mono font-bold text-sm text-[#163A36]">
                {placedOrder.orderNumber}
              </span>
            </div>

            <div className="space-y-2 font-sans text-gray-700">
              {placedOrder.utr && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted UTR / Ref:</span>
                  <span className="font-mono font-bold text-[#163A36]">{placedOrder.utr}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-[#163A36]">₹{placedOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium text-[#163A36]">{placedOrder.customerName} ({placedOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verification Status:</span>
                <span className="font-semibold text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Manual Verification in Progress</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF4EA] rounded-xl border border-[#E6D5B8] text-[11px] text-[#2B211E]/80 leading-relaxed">
              💡 <em>Our administrative team reviews incoming bank settlements throughout the day. Once confirmed, your order status will be updated to <strong>CONFIRMED</strong>.</em>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCheckLiveStatus}
                disabled={isPollingStatus}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#163A36] text-[#F7F1E6] text-xs font-semibold tracking-wider uppercase hover:bg-[#0E2623] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPollingStatus ? 'animate-spin' : ''}`} />
                <span>Check Live Status</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToProducts}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-[#E6D5B8] text-[#163A36] text-xs font-semibold tracking-wider uppercase hover:bg-[#FAF4EA] cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            <div>
              <a
                href={`https://wa.me/${PAYMENT_CONFIG.WHATSAPP_LINK_NUMBER}?text=${encodeURIComponent(
                  `Namaste SHIV DHARA, I have placed order ${placedOrder.orderNumber} with UTR: ${placedOrder.utr}. Please assist with payment verification.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C56A45] hover:underline font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Need quick confirmation? Message us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: WHATSAPP ORDER DISPATCHED SCREEN
  // =========================================================================
  if (placedOrder && placedOrder.paymentMethod === 'WHATSAPP') {
    return (
      <div id="whatsapp-order-dispatched-screen" className="min-h-screen bg-[#F7F1E6] text-[#163A36] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-[#FAF4EA] p-8 sm:p-12 rounded-3xl border border-[#E6D5B8] shadow-xl">
          <div className="w-20 h-20 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] mx-auto flex items-center justify-center shadow-md">
            <MessageCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="type-label text-xs text-[#C56A45] tracking-[0.25em] block uppercase">
              WhatsApp Order Dispatched
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#163A36]">
              Order Created • #{placedOrder.orderNumber}
            </h1>
            <p className="type-body-sm text-xs sm:text-sm text-[#2B211E]/80 max-w-md mx-auto leading-relaxed">
              Your order details have been composed and sent to SHIV DHARA official business WhatsApp ({PAYMENT_CONFIG.WHATSAPP_ORDER_NUMBER}). Falgun Thakkr and the team will confirm payment and shipping directly in WhatsApp.
            </p>
          </div>

          {/* Breakdown summary */}
          <div className="rounded-2xl bg-white border border-[#E6D5B8] p-6 text-left space-y-3 text-xs shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#E6D5B8]">
              <span className="text-gray-500 font-sans uppercase text-[10px]">Order ID:</span>
              <span className="font-mono font-bold text-[#163A36]">{placedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Items:</span>
              <span>{placedOrder.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Total Amount:</span>
              <span className="font-bold text-[#163A36]">₹{placedOrder.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Order Status:</span>
              <span className="font-medium text-amber-700">Pending WhatsApp Confirmation</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={buildWhatsAppOrderUrl({
                orderNumber: placedOrder.orderNumber,
                customerName: placedOrder.customerName,
                phone: placedOrder.phone,
                email: placedOrder.email,
                address: placedOrder.address,
                city: placedOrder.city,
                state: placedOrder.state,
                pincode: placedOrder.pincode,
                items: placedOrder.items.map(it => ({
                  name: it.productName,
                  variantName: it.variantName,
                  quantity: it.quantity,
                  price: it.unitPrice,
                })),
                subtotal: placedOrder.subtotal,
                shipping: placedOrder.shipping,
                total: placedOrder.total,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-primary-terracotta text-xs px-8 py-3.5 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Re-Open WhatsApp Chat</span>
            </a>

            <button
              onClick={onNavigateToProducts}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#163A36] text-[#F7F1E6] text-xs font-semibold tracking-wider uppercase hover:bg-[#0E2623] cursor-pointer"
            >
              Explore More Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: MAIN CHECKOUT FORM (WHATSAPP + UPI QR ONLY)
  // =========================================================================
  return (
    <div id="page-checkout" className="min-h-screen bg-[#F7F1E6] text-[#163A36] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Bar */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onNavigateToProducts}
            className="p-2.5 rounded-full bg-white border border-[#E6D5B8] text-[#163A36] hover:bg-[#FAF4EA] transition-colors cursor-pointer"
            aria-label="Back to boutique"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="type-label text-[10px] text-[#C56A45] tracking-[0.2em] block uppercase">
              DIRECT CHECKOUT & SECURE ORDER
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#163A36]">
              Complete Your Sacred Order
            </h1>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF4EA] rounded-3xl border border-[#E6D5B8] p-8 max-w-md mx-auto shadow-sm">
            <ShoppingBag className="w-12 h-12 text-[#C56A45] mx-auto mb-3 opacity-60" />
            <h2 className="text-xl font-serif text-[#163A36]">
              Your cart is empty.
            </h2>
            <p className="type-body-sm text-xs text-[#2B211E]/70 mt-1 mb-6">
              Select handcrafted energized gemstone bracelets or rudraksha malas before checkout.
            </p>
            <button
              onClick={onNavigateToProducts}
              className="btn-primary-terracotta text-xs px-6 py-2.5"
            >
              Browse Boutique
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer Details & Payment Options */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer & Delivery Information */}
              <div className="bg-[#FAF4EA] p-6 sm:p-7 rounded-3xl border border-[#E6D5B8] shadow-sm space-y-5">
                <div className="border-b border-[#E6D5B8] pb-3 flex items-center justify-between">
                  <div>
                    <span className="type-label text-[10px] text-[#C56A45] block uppercase">
                      Step 1 of 2
                    </span>
                    <h3 className="text-lg font-serif text-[#163A36]">
                      Seeker & Delivery Details
                    </h3>
                  </div>
                  <span className="text-[11px] font-sans font-medium text-emerald-800 flex items-center gap-1 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Free Shipping &gt; ₹1,999</span>
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="type-label text-[10px] text-[#163A36] block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                          formErrors.name ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                        }`}
                      />
                      {formErrors.name && (
                        <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <label className="type-label text-[10px] text-[#163A36] block mb-1">
                        Phone Number / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                          formErrors.phone ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                        }`}
                      />
                      {formErrors.phone && (
                        <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="type-label text-[10px] text-[#163A36] block mb-1">
                      Email Address (for Order Updates & Gemstone Certificate) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                        formErrors.email ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                      }`}
                    />
                    {formErrors.email && (
                      <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="type-label text-[10px] text-[#163A36] block mb-1">
                      Street Address / House / Flat No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 402, Shivam Heights, Linking Road"
                      value={addressLine1}
                      onChange={e => setAddressLine1(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                        formErrors.addressLine1 ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                      }`}
                    />
                    {formErrors.addressLine1 && (
                      <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.addressLine1}</span>
                    )}
                  </div>

                  <div>
                    <label className="type-label text-[10px] text-[#163A36] block mb-1">
                      Apartment, Suite, Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Lotus Temple, Bandra West"
                      value={addressLine2}
                      onChange={e => setAddressLine2(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-sm text-[#163A36] focus:outline-none focus:border-[#C56A45]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="type-label text-[10px] text-[#163A36] block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                          formErrors.city ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                        }`}
                      />
                      {formErrors.city && (
                        <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.city}</span>
                      )}
                    </div>

                    <div>
                      <label className="type-label text-[10px] text-[#163A36] block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={stateName}
                        onChange={e => setStateName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                          formErrors.stateName ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                        }`}
                      />
                      {formErrors.stateName && (
                        <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.stateName}</span>
                      )}
                    </div>

                    <div>
                      <label className="type-label text-[10px] text-[#163A36] block mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="400050"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#163A36] focus:outline-none ${
                          formErrors.postalCode ? 'border-red-400' : 'border-[#E6D5B8] focus:border-[#C56A45]'
                        }`}
                      />
                      {formErrors.postalCode && (
                        <span className="text-[11px] text-red-600 block mt-0.5">{formErrors.postalCode}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: HOW WOULD YOU LIKE TO ORDER? (2 OPTIONS ONLY) */}
              <div className="bg-[#FAF4EA] p-6 sm:p-7 rounded-3xl border border-[#E6D5B8] shadow-sm space-y-5">
                <div className="border-b border-[#E6D5B8] pb-3">
                  <span className="type-label text-[10px] text-[#C56A45] block uppercase">
                    Step 2 of 2
                  </span>
                  <h3 className="text-xl font-serif text-[#163A36]">
                    HOW WOULD YOU LIKE TO ORDER?
                  </h3>
                  <p className="type-body-sm text-xs text-[#2B211E]/75 mt-0.5">
                    Choose between direct personal WhatsApp order with our team or instant UPI QR code payment.
                  </p>
                </div>

                {/* The Two Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* OPTION 1: WHATSAPP */}
                  <div
                    onClick={() => setSelectedMethod('WHATSAPP')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                      selectedMethod === 'WHATSAPP'
                        ? 'border-[#C56A45] bg-[#163A36] text-[#F7F1E6] ring-2 ring-[#C56A45]/40 shadow-lg'
                        : 'border-[#E6D5B8] bg-white text-[#163A36] hover:border-[#C56A45]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedMethod === 'WHATSAPP'
                            ? 'bg-[#25D366]/20 text-[#25D366]'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="w-5 h-5 rounded-full border border-[#C56A45] flex items-center justify-center">
                        {selectedMethod === 'WHATSAPP' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C56A45]" />
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-serif font-bold">
                      Order via WhatsApp
                    </h4>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        selectedMethod === 'WHATSAPP' ? 'text-[#E6D5B8]/80' : 'text-[#2B211E]/70'
                      }`}
                    >
                      Talk directly with SHIV DHARA ({PAYMENT_CONFIG.WHATSAPP_ORDER_NUMBER}) and confirm your items with personal guidance.
                    </p>
                  </div>

                  {/* OPTION 2: UPI QR */}
                  <div
                    onClick={() => setSelectedMethod('UPI_QR')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                      selectedMethod === 'UPI_QR'
                        ? 'border-[#C56A45] bg-[#163A36] text-[#F7F1E6] ring-2 ring-[#C56A45]/40 shadow-lg'
                        : 'border-[#E6D5B8] bg-white text-[#163A36] hover:border-[#C56A45]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedMethod === 'UPI_QR'
                            ? 'bg-[#C56A45]/20 text-[#C56A45]'
                            : 'bg-[#FAF4EA] text-[#C56A45]'
                        }`}
                      >
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="w-5 h-5 rounded-full border border-[#C56A45] flex items-center justify-center">
                        {selectedMethod === 'UPI_QR' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C56A45]" />
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-serif font-bold">
                      Pay via UPI
                    </h4>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        selectedMethod === 'UPI_QR' ? 'text-[#E6D5B8]/80' : 'text-[#2B211E]/70'
                      }`}
                    >
                      Scan the official SHIV DHARA QR code with any UPI app and submit your transaction UTR.
                    </p>
                  </div>

                </div>

                {/* Selected Method Action Container */}
                <div className="pt-2">
                  {selectedMethod === 'WHATSAPP' ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] space-y-4">
                      <div className="space-y-1">
                        <span className="type-label text-[10px] text-[#C56A45] block uppercase">
                          Option 1 Selected
                        </span>
                        <h4 className="text-lg font-serif text-[#163A36]">
                          Place Order Directly on WhatsApp
                        </h4>
                        <p className="type-body-sm text-xs text-[#2B211E]/75">
                          When you click below, we will generate your complete order breakdown with all items, address, and pricing, and open the official SHIV DHARA business WhatsApp chat ({PAYMENT_CONFIG.WHATSAPP_ORDER_NUMBER}).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleWhatsAppOrder}
                        disabled={isSubmitting}
                        className="w-full btn-primary-terracotta py-4 text-xs flex items-center justify-center gap-2.5 shadow-lg group cursor-pointer disabled:opacity-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? 'Preparing Order Details...'
                            : `ORDER VIA WHATSAPP (₹${total.toLocaleString('en-IN')})`}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ) : (
                    <UpiQrSection
                      total={total}
                      customerName={name}
                      phone={phone}
                      email={email}
                      isSubmitting={isSubmitting}
                      onSubmitPaymentDetails={handleUpiQrPaymentSubmit}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="lg:col-span-5 bg-[#FAF4EA] p-6 sm:p-7 rounded-3xl border border-[#E6D5B8] shadow-sm space-y-5 sticky top-28">
              <div className="border-b border-[#E6D5B8] pb-3 flex items-center justify-between">
                <h3 className="text-lg font-serif text-[#163A36]">
                  Order Summary
                </h3>
                <span className="type-label text-[10px] text-[#C56A45]">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items in Cart */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant?.id || 'std'}`}
                    className="flex items-center gap-3 pb-3 border-b border-[#E6D5B8]/60 bg-white p-3 rounded-xl border border-[#E6D5B8]/40"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-[#FAF4EA] shrink-0 border border-[#E6D5B8]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-bold text-[#163A36] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans">
                        Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                      </p>
                      {item.product.numerologyNumber && (
                        <span className="text-[9px] text-[#C56A45] font-semibold">
                          Number {item.product.numerologyNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold font-mono text-[#163A36]">
                      ₹{((item.selectedVariant?.price || item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-[#2B211E]/80 pt-2 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#163A36] font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Pan-India Shipping</span>
                  <span className="font-semibold text-[#163A36]">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#163A36] pt-2.5 border-t border-[#E6D5B8]">
                  <span>Total to Pay</span>
                  <span className="text-xl font-serif text-[#163A36]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Authenticity Badge */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E6D5B8] flex items-center gap-2.5 text-[11px] text-[#2B211E]/80">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Energized in Studio • 100% Authentic Natural Gemstones</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
