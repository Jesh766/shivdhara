/**
 * SHIV DHARA Payment & Order Configuration
 * 
 * Configurable constants for WhatsApp Direct Order and UPI QR Payment.
 */

export const PAYMENT_CONFIG = {
  // Business WhatsApp number for customer orders (+91 6359666315)
  WHATSAPP_ORDER_NUMBER: import.meta.env.VITE_WHATSAPP_ORDER_NUMBER || '+91 6359666315',
  
  // Clean international digits for wa.me link
  WHATSAPP_LINK_NUMBER: (import.meta.env.VITE_WHATSAPP_ORDER_NUMBER || '916359666315').replace(/[^0-9]/g, '') || '916359666315',
  
  // Brand name displayed across payments
  BUSINESS_NAME: 'SHIV DHARA by Falgun Thakkr',
  
  // Configured UPI ID (e.g. shivdhara@upi or configured via env)
  UPI_ID: import.meta.env.VITE_UPI_ID || 'shivdhara@upi',
  
  // Optional custom QR image URL (if provided, replaces procedural QR generator)
  UPI_QR_IMAGE_URL: import.meta.env.VITE_UPI_QR_IMAGE_URL || '',
  
  // Free shipping threshold in INR
  FREE_SHIPPING_THRESHOLD: 1999,
  
  // Standard shipping fee in INR
  STANDARD_SHIPPING_FEE: 150,
};
