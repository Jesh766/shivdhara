import { OrderItem } from '../types';
import { PAYMENT_CONFIG } from './paymentConfig';

export interface CustomerOrderDetails {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    name: string;
    variantName?: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
}

/**
 * Generate a clean, professional, dynamic WhatsApp order message
 * matching the exact SHIV DHARA format specifications.
 */
export function generateWhatsAppOrderMessage(order: CustomerOrderDetails): string {
  const productListText = order.items
    .map((item, idx) => {
      const itemTitle = item.variantName ? `${item.name} (${item.variantName})` : item.name;
      const unitOrTotal = item.price.toLocaleString('en-IN');
      return `${idx + 1}. ${itemTitle}\n   Quantity: ${item.quantity}\n   Price: ₹${unitOrTotal}`;
    })
    .join('\n\n');

  const shippingText = order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`;

  const message = `Namaste SHIV DHARA,

I would like to place an order.

ORDER DETAILS
----------------------------

Order ID:
${order.orderNumber}

Products:

${productListText}

----------------------------

Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}

Shipping: ${shippingText}

TOTAL: ₹${order.total.toLocaleString('en-IN')}

Customer Details:

Name: ${order.customerName}

Phone: ${order.phone}

Email: ${order.email}

Address:
${order.address}

City:
${order.city}

State:
${order.state}

Pincode:
${order.pincode}

I would like to confirm this order through WhatsApp.

Thank you,
SHIV DHARA`;

  return message;
}

/**
 * Build the direct wa.me URL with properly URL-encoded message text.
 */
export function buildWhatsAppOrderUrl(order: CustomerOrderDetails): string {
  const message = generateWhatsAppOrderMessage(order);
  const cleanNumber = PAYMENT_CONFIG.WHATSAPP_LINK_NUMBER;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
