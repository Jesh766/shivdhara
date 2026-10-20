/**
 * Telegram Notification Service for SHIV DHARA
 * Dispatches instant real-time alerts to Falgun Thakkr & Team via Telegram Bot.
 */

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendTelegramMessage(htmlMessage: string): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    console.warn('[Telegram Notification] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.');
    return { success: false, error: 'Telegram credentials missing' };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = (await response.json()) as { ok: boolean; result?: { message_id: number }; description?: string };

    if (!response.ok || !data.ok) {
      console.error('[Telegram Error]:', data.description || response.statusText);
      return { success: false, error: data.description || 'Failed to send message' };
    }

    console.log('[Telegram Notification Delivered] Message ID:', data.result?.message_id);
    return { success: true, messageId: data.result?.message_id };
  } catch (err: any) {
    console.error('[Telegram Exception]:', err.message || err);
    return { success: false, error: err.message };
  }
}

// 1. HUMAN SUPPORT / AI HANDOFF ALERT
export interface HumanRequestNotificationPayload {
  customerName: string;
  phone: string;
  email?: string;
  reason: string;
  currentPage?: string;
  conversationSummary?: string;
  timestamp?: string;
}

export async function sendTelegramHumanNotification(payload: HumanRequestNotificationPayload) {
  const formattedTime = payload.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const msg = `🚨 <b>SHIV DHARA — HUMAN SUPPORT REQUEST</b>

<b>Customer:</b> ${escapeHtml(payload.customerName || 'Seeker')}
<b>Phone:</b> <code>${escapeHtml(payload.phone || 'N/A')}</code>
<b>Email:</b> ${escapeHtml(payload.email || 'N/A')}
<b>Page:</b> <code>${escapeHtml(payload.currentPage || '/')}</code>
<b>Reason:</b> ${escapeHtml(payload.reason || 'Requested human callback')}
<b>Time:</b> ${escapeHtml(formattedTime)}

<b>Context:</b>
${escapeHtml(payload.conversationSummary || 'Direct callback requested via Dhara AI')}`;

  return sendTelegramMessage(msg);
}

// 2. CONSULTATION BOOKING ALERT
export interface ConsultationNotificationPayload {
  name: string;
  phone: string;
  email: string;
  service: string;
  type?: string;
  date: string;
  time: string;
  price?: number;
  message?: string;
}

export async function sendTelegramConsultationNotification(payload: ConsultationNotificationPayload) {
  const msg = `📅 <b>SHIV DHARA — NEW CONSULTATION BOOKED</b>

<b>Client:</b> ${escapeHtml(payload.name)}
<b>Phone:</b> <code>${escapeHtml(payload.phone)}</code>
<b>Email:</b> ${escapeHtml(payload.email)}
<b>Service:</b> <b>${escapeHtml(payload.service)}</b>
<b>Mode:</b> ${escapeHtml(payload.type || 'ONLINE_VIDEO')}
<b>Slot:</b> ${escapeHtml(payload.date)} at ${escapeHtml(payload.time)}
<b>Amount:</b> ₹${payload.price?.toLocaleString('en-IN') || 0}
${payload.message ? `<b>Client Note:</b> ${escapeHtml(payload.message)}` : ''}`;

  return sendTelegramMessage(msg);
}

// 3. BOUTIQUE ORDER ALERT
export interface OrderNotificationPayload {
  orderNumber?: string;
  customerName: string;
  phone: string;
  email: string;
  items: Array<{ productName: string; quantity: number; price: number; variantName?: string }>;
  total: number;
  paymentMethod: string;
  utr?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export async function sendTelegramOrderNotification(payload: OrderNotificationPayload) {
  const itemsText = payload.items
    .map((it) => `• ${escapeHtml(it.productName)} (x${it.quantity})${it.variantName ? ` [${escapeHtml(it.variantName)}]` : ''} - ₹${(it.price * it.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  const msg = `🛍️ <b>SHIV DHARA — NEW BOUTIQUE ORDER</b>

<b>Order Ref:</b> <code>${escapeHtml(payload.orderNumber || 'Pending')}</code>
<b>Customer:</b> ${escapeHtml(payload.customerName)}
<b>Phone:</b> <code>${escapeHtml(payload.phone)}</code>
<b>Email:</b> ${escapeHtml(payload.email)}
<b>Total:</b> <b>₹${payload.total.toLocaleString('en-IN')}</b>
<b>Payment:</b> ${escapeHtml(payload.paymentMethod)}${payload.utr ? `\n<b>UTR:</b> <code>${escapeHtml(payload.utr)}</code>` : ''}

<b>Items:</b>
${itemsText}

<b>Shipping Address:</b>
${escapeHtml(payload.address || '')}, ${escapeHtml(payload.city || '')}, ${escapeHtml(payload.state || '')} - ${escapeHtml(payload.pincode || '')}`;

  return sendTelegramMessage(msg);
}

// 4. CONTACT MESSAGE ALERT
export interface ContactNotificationPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export async function sendTelegramContactNotification(payload: ContactNotificationPayload) {
  const msg = `✉️ <b>SHIV DHARA — NEW CONTACT INQUIRY</b>

<b>Name:</b> ${escapeHtml(payload.name)}
<b>Email:</b> ${escapeHtml(payload.email)}
<b>Phone:</b> <code>${escapeHtml(payload.phone || 'Not provided')}</code>
<b>Service:</b> ${escapeHtml(payload.service || 'General Inquiry')}

<b>Message:</b>
${escapeHtml(payload.message)}`;

  return sendTelegramMessage(msg);
}
