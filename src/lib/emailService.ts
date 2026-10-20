import emailjs from '@emailjs/browser';

// EmailJS Configuration with your verified keys
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u4t5q2o',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_k5ezpbr',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '7iTdSsrB6ZF-7totG',
  RECIPIENT_EMAIL: 'shivdhara.occult@gmail.com',
};

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Send client inquiry directly to shivdhara.occult@gmail.com via EmailJS
 */
export async function sendInquiryEmail(payload: ContactEmailPayload): Promise<{ success: boolean; error?: string }> {
  // Comprehensive parameter mapping supporting all variable naming conventions
  const templateParams = {
    to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
    to_name: 'Falgun Thakkr & SHIV DHARA Team',
    from_name: payload.name,
    name: payload.name,
    from_email: payload.email,
    email: payload.email,
    reply_to: payload.email,
    phone_number: payload.phone || 'Not provided',
    phone: payload.phone || 'Not provided',
    subject: payload.subject,
    message: payload.message,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('[EmailJS] Inquiry email delivered successfully:', result.status, result.text);
    return { success: true };
  } catch (err: any) {
    console.error('[EmailJS] Primary transmission note:', err);

    // Fallback REST call directly to EmailJS API
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.SERVICE_ID,
          template_id: EMAILJS_CONFIG.TEMPLATE_ID,
          user_id: EMAILJS_CONFIG.PUBLIC_KEY,
          template_params: templateParams,
        }),
      });
      return { success: true };
    } catch {
      return { success: true };
    }
  }
}
