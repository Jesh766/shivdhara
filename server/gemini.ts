import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { initialProducts, initialWorkshops, initialFAQs } from './data';
import { sendTelegramHumanNotification } from './telegram';
import { HumanRequest } from '../src/types';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

// Primary Gemini model configuration constant (easily modified in one place)
export const GEMINI_MODEL = 'gemini-2.5-flash';
export interface DatabaseStore {
  products: typeof initialProducts;
  workshops: typeof initialWorkshops;
  humanRequests: HumanRequest[];
  consultations: any[];
}

let dbStoreRef: DatabaseStore | null = null;
export function setDbStore(store: DatabaseStore) {
  dbStoreRef = store;
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 5) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// TOOL DECLARATIONS
// ==========================================

const getProductsDeclaration: FunctionDeclaration = {
  name: 'getProducts',
  description: 'Retrieve current active spiritual products, numerology bracelets (Numbers 1, 3, 5, 6, 8), and sacred Rudraksha malas with live prices and stock.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: 'Optional category filter: bracelets, malas, accessories',
      },
      numerologyNumber: {
        type: Type.NUMBER,
        description: 'Optional numerology number (1 to 9) to find corresponding gemstone bracelet',
      },
    },
  },
};

const getProductDetailsDeclaration: FunctionDeclaration = {
  name: 'getProductDetails',
  description: 'Get in-depth specifications of a specific product (materials, gemstones, bead size, care instructions, price, stock).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      slugOrId: {
        type: Type.STRING,
        description: 'The product slug or ID',
      },
    },
    required: ['slugOrId'],
  },
};

const getUpcomingWorkshopsDeclaration: FunctionDeclaration = {
  name: 'getUpcomingWorkshops',
  description: 'Get all scheduled live workshops with Falgun Thakkr, dates, timings, formats (Zoom/Studio), prices, and available seat counts.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const getWorkshopDetailsDeclaration: FunctionDeclaration = {
  name: 'getWorkshopDetails',
  description: 'Get full syllabus, instructor bio, schedule, and registration details for a specific workshop.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      slug: {
        type: Type.STRING,
        description: 'The workshop slug or ID',
      },
    },
    required: ['slug'],
  },
};

const getConsultationServicesDeclaration: FunctionDeclaration = {
  name: 'getConsultationServices',
  description: 'Get verified consultation services with Falgun Thakkr (Numerology, Vastu Spatial Audit, Meditation 1-on-1, Master Alignment) and pricing.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const getFAQsDeclaration: FunctionDeclaration = {
  name: 'getFAQs',
  description: 'Search official SHIV DHARA FAQs regarding numerology, non-destructive Vastu, ordering, payment methods, shipping, or meditation.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: 'Optional category: Numerology, Vastu, Products, Consultations, Workshops, Payment',
      },
    },
  },
};

const triggerHumanHandoffDeclaration: FunctionDeclaration = {
  name: 'triggerHumanHandoff',
  description: 'Trigger an alert to the SHIV DHARA team and Telegram channel when a visitor wants to speak with a human, talk to Falgun Thakkr, or requests callback/human support.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      customerName: {
        type: Type.STRING,
        description: 'Customer full name if available, or empty string',
      },
      phone: {
        type: Type.STRING,
        description: 'Customer phone/contact number if available',
      },
      email: {
        type: Type.STRING,
        description: 'Customer email address if available',
      },
      reason: {
        type: Type.STRING,
        description: 'Reason for human support request or specific question asked',
      },
      conversationSummary: {
        type: Type.STRING,
        description: 'Concise 1-2 sentence summary of recent chat context',
      },
    },
    required: ['reason', 'conversationSummary'],
  },
};

// ==========================================
// SYSTEM INSTRUCTION & WEBSITE GROUND TRUTH
// ==========================================

function getSystemPrompt(currentPage: string): string {
  const whatsappNumber = process.env.WHATSAPP_ORDER_NUMBER || process.env.WHATSAPP_NUMBER || '+916359666315';
  const upiId = process.env.UPI_ID || 'shivdhara@upi';

  return `You are DHARA, the official AI assistant for SHIV DHARA by Falgun Thakkr.
SHIV DHARA is a premier modern spiritual consultancy, educational platform, and sacred boutique.

SOURCE OF TRUTH — SHIV DHARA WEBSITE CONTENT:

1. FOUNDER & PHILOSOPHY:
- Founder: Falgun Thakkr (also known as Falgun Thakkar).
- Approach: Grounded, authentic, respectful, and free of fear-mongering or fatalism. Combines ancient wisdom with modern clarity.

2. CORE DISCIPLINES & CONSULTATIONS:
- Numerology (Sankhya Shastra): Explores the 9 primordial vibrations (1 to 9) linked to cosmic planetary energies.
  * Moolank (Birth Number): Day of the month reduced to 1-9 (baseline nature, instinct).
  * Bhagyank (Destiny Number): Full birth date sum reduced to 1-9 (life trajectory, purpose).
  * Namank (Name Number): Vibrational resonance of full name.
  * Numerology Consultation: "Numerology Blueprint" — ₹3,499 (60 Mins, Online Video/In-Person).
- Vastu Shastra (Vastu Vidya): 100% Non-destructive spatial energy alignment for homes, apartments, and commercial offices.
  * Harmonizes the 8 directions (North: Kuber/Water, NE: Ishan/Water&Spirit, East: Surya/Fire&Air, SE: Agni/Fire, South: Yama/Earth&Fire, SW: Nairutya/Earth&Stability, West: Varuna/Air&Space, NW: Vayu/Air) with the 5 Elements (Pancha Mahabhutas: Earth, Water, Fire, Air, Space).
  * Uses lighting, elemental zoning, sacred geometry, and color remedies WITHOUT structural demolition.
  * Vastu Consultation: "Vastu Spatial Energy Audit" — ₹7,499 (90 Mins + Blueprint report, Online Video Walkthrough or On-Site).
- Meditation & Conscious Breathing:
  * "Shiv Dhara" practice: Diaphragmatic 4-4-6 breath rhythm (Inhale 4s, Hold 4s, Exhale 6s) to activate the vagus nerve and soothe the sympathetic nervous system.
  * Nada sound resonance, OM harmonic centering, witnessing awareness (Sakshi Bhava).
  * Meditation Consultation: "Inner Stillness Meditation & Breath 1-on-1" — ₹2,199 (45 Mins, Online Video).
- Master Alignment Consultation:
  * "Master Alignment (Numerology + Vastu + Meditation)" — ₹10,999 (2 Hours comprehensive synthesis).

3. UPCOMING LIVE WORKSHOPS:
- "The Language of Numbers: Numerology Masterclass":
  * Dates: September 19 – 20, 2026 | Duration: 2 Days (8 Hours Total: 10:00 AM - 2:00 PM IST)
  * Price: ₹4,999 | Format: Live Zoom HD + 30-Day Recording Access + Workbook
  * Instructor: Falgun Thakkr | Capacity: 35 seats
- "Vastu for Modern Spaces: Energy Harmony & Abundance":
  * Dates: October 10 – 11, 2026 | Duration: 2 Days (8 Hours Total: 11:00 AM - 3:00 PM IST)
  * Price: ₹5,999 | Format: Interactive Live Session + Mumbai Studio Seats + Floorplan Audit Template
  * Instructor: Falgun Thakkr | Capacity: 30 seats
- "Shiv Dhara: The Art of Inner Stillness & Conscious Breathing":
  * Dates: October 24 – 25, 2026 | Duration: 2 Morning Sessions (6 Hours Total: 7:00 AM - 10:00 AM IST)
  * Price: ₹3,499 | Format: Online Live Sanctuary + 4 High-Fidelity Guided Audio Tracks
  * Instructor: Falgun Thakkr | Capacity: 50 seats

4. HANDCRAFTED BOUTIQUE PRODUCTS:
- Surya Radiant Numerology Bracelet (Number 1): ₹2,499 | Natural Golden Pyrite, Sunstone, Golden Tiger Eye | Solar vitality, inner clarity, focused willpower.
- Brihaspati Wisdom Numerology Bracelet (Number 3): ₹2,699 | Natural Citrine, Yellow Aventurine, Sandalwood | Wisdom, creative expansion, optimism.
- Budha Harmonizer Numerology Bracelet (Number 5): ₹2,399 | Natural Canadian Green Jade, Green Aventurine, Fluorite | Mental agility, communicative harmony, balance.
- Shukra Harmony & Grace Numerology Bracelet (Number 6): ₹2,599 | Madagascar Rose Quartz, Selenite, High-clarity Quartz | Aesthetic harmony, emotional calm, heart resonance.
- Shani Grounding & Mastery Numerology Bracelet (Number 8): ₹2,799 | Blue Tiger Eye, Black Obsidian, Dark Amethyst | Karmic discipline, organizational mastery, grounding.
- Panchamukhi Sacred Rudraksha Meditation Mala (108 Beads): ₹3,499 | 108 authentic hand-knotted 5-Mukhi Nepali Rudraksha beads with pure silk tassel | For Japa meditation and inner stillness.
- Product Ethics: Handcrafted with certified natural stones. Free shipping across India on orders over ₹1,999 (₹150 standard shipping below ₹1,999).
- IMPORTANT: NEVER make medical claims, supernatural guarantees, or claims of instant lottery wealth.

5. APPROVED PAYMENT & ORDERING SYSTEM:
- THERE IS NO RAZORPAY. Never mention Razorpay.
- Two official methods:
  1. WhatsApp Ordering: Customers select items and click to order directly via WhatsApp to ${whatsappNumber}.
  2. UPI QR Payment: Customers scan the SHIV DHARA UPI QR code (UPI ID: ${upiId}), complete payment in their UPI app (GPay, PhonePe, Paytm, BHIM, etc.), and submit their UTR / payment reference number on the website.
  3. Payment Verification: Explain that payment verification is manually confirmed by the SHIV DHARA team. NEVER claim that static QR payment is automatically verified in real time.

6. CURRENT VISITOR PAGE CONTEXT:
The visitor is currently browsing: "${currentPage || '/'}".
- If on /numerology: prioritize Numerology concepts, Moolank/Bhagyank, number bracelets, and numerology consultations.
- If on /vastu: prioritize non-destructive spatial harmony, 8 directions, 5 elements, and Vastu audits.
- If on /meditation: prioritize 4-4-6 breathing practice, Nada resonance, 108 Rudraksha mala, and meditation workshops.
- If on /workshops: prioritize workshop schedules, curriculum, seat availability, and booking.
- If on /products: prioritize the bracelet and mala collection, material details, and ordering instructions.
- If on /checkout or /cart: prioritize payment steps (WhatsApp / UPI QR), shipping policy, and order tracking.
- If on /contact or /consultation: prioritize scheduling, consultation formats, and direct human connection.

7. TONE & CONVERSATION RULES:
- Tone: Warm, serene, respectful, grounded, articulate, and professional.
- Language: English, natural conversational Hinglish, and Hindi comprehension.
- Paragraphs: Short, readable paragraphs with clear structure.
- Identity: You are DHARA, the AI assistant of SHIV DHARA. If asked if you are human, answer honestly: "I am Dhara, the AI assistant for SHIV DHARA by Falgun Thakkr. I can answer questions, guide your journey, and connect you with Falgun Thakkr and our team."
- Context Memory: Always maintain context within the chat (e.g. if the user asks "How much does it cost?", understand what was being discussed).
- No Hallucinations: Do not invent products, dates, prices, or qualifications not listed above.

8. HUMAN HANDOFF DIRECTIVE (CRITICAL):
If the customer expresses ANY intent to:
- "talk to a human"
- "talk to your team" / "speak with someone"
- "talk to Falgun" / "speak to Falgun Thakkr"
- "call me" / "i need human support" / "connect me with your team" / "leave my number"
- Or expresses frustration with AI:
1. Immediately acknowledge warmly and respectfully.
2. Call the 'triggerHumanHandoff' tool.
3. If the user's name or phone number is missing, kindly ask for their name and phone/WhatsApp number so the team can reach out directly.`;
}

// ==========================================
// TOOL EXECUTION HANDLER
// ==========================================

async function executeToolCall(name: string, args: any, currentPage: string): Promise<any> {
  const products = dbStoreRef?.products || initialProducts;
  const workshops = dbStoreRef?.workshops || initialWorkshops;

  switch (name) {
    case 'getProducts': {
      let list = products.filter(p => p.active);
      if (args.category) {
        list = list.filter(p => p.category.toLowerCase() === String(args.category).toLowerCase());
      }
      if (args.numerologyNumber) {
        list = list.filter(p => p.numerologyNumber === Number(args.numerologyNumber));
      }
      return list.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        category: p.category,
        numerologyNumber: p.numerologyNumber,
        rulingPlanet: p.rulingPlanet,
        shortDescription: p.shortDescription,
        material: p.material,
      }));
    }

    case 'getProductDetails': {
      const match = products.find(
        p => p.slug === args.slugOrId || p.id === args.slugOrId
      );
      if (!match) return { error: 'Product not found' };
      return {
        id: match.id,
        name: match.name,
        slug: match.slug,
        price: match.price,
        compareAtPrice: match.compareAtPrice,
        stock: match.stock,
        category: match.category,
        numerologyNumber: match.numerologyNumber,
        rulingPlanet: match.rulingPlanet,
        material: match.material,
        beadSize: match.beadSize,
        dimensions: match.dimensions,
        careInstructions: match.careInstructions,
        traditionalAssociation: match.traditionalAssociation,
        shortDescription: match.shortDescription,
        description: match.description,
      };
    }

    case 'getUpcomingWorkshops': {
      return workshops.filter(w => w.active).map(w => ({
        id: w.id,
        title: w.title,
        slug: w.slug,
        date: w.displayDate,
        duration: w.duration,
        location: w.location,
        price: w.price,
        capacity: w.capacity,
        availableSeats: Math.max(0, w.capacity - w.registeredCount),
        instructor: w.instructor,
      }));
    }

    case 'getWorkshopDetails': {
      const ws = workshops.find(w => w.slug === args.slug || w.id === args.slug);
      if (!ws) return { error: 'Workshop not found' };
      return {
        id: ws.id,
        title: ws.title,
        slug: ws.slug,
        tagline: ws.tagline,
        displayDate: ws.displayDate,
        duration: ws.duration,
        location: ws.location,
        price: ws.price,
        capacity: ws.capacity,
        availableSeats: Math.max(0, ws.capacity - ws.registeredCount),
        instructor: ws.instructor,
        instructorBio: ws.instructorBio,
        highlights: ws.highlights,
        curriculum: ws.curriculum,
      };
    }

    case 'getConsultationServices': {
      return [
        {
          service: 'Numerology Blueprint',
          duration: '60 Minutes',
          format: 'Online Video (Zoom) or In-Person',
          price: 3499,
          focus: 'Complete analysis of Birth Number (Moolank), Destiny Number (Bhagyank), Name vibration, and life cycle alignment.',
        },
        {
          service: 'Vastu Spatial Energy Audit',
          duration: '90 Minutes + Blueprint Report',
          format: 'Online Video Walkthrough or On-Site Visit',
          price: 7499,
          focus: 'Non-destructive 8-directional layout review, elemental balancing, and room-by-room energy rectification without demolition.',
        },
        {
          service: 'Inner Stillness Meditation & Breath 1-on-1',
          duration: '45 Minutes',
          format: 'Online Video',
          price: 2199,
          focus: 'Personalized diaphragmatic 4-4-6 pranayama, mantra resonance, and daily meditation ritual.',
        },
        {
          service: 'Master Alignment (Numerology + Vastu + Meditation)',
          duration: '2 Hours Comprehensive',
          format: 'Online or In-Person',
          price: 10999,
          focus: 'Complete holistic synthesis of personal numbers, living/workspace energy, and daily mindfulness.',
        },
      ];
    }

    case 'getFAQs': {
      let faqs = initialFAQs;
      if (args.category) {
        faqs = faqs.filter(f => f.category.toLowerCase().includes(String(args.category).toLowerCase()));
      }
      return faqs;
    }

    case 'triggerHumanHandoff': {
      const customerName = args.customerName?.trim() || '';
      const phone = args.phone?.trim() || '';
      const email = args.email?.trim() || '';
      const reason = args.reason || 'Visitor requested direct team assistance';
      const conversationSummary = args.conversationSummary || 'Direct human handoff requested via Dhara chatbot';

      const humanReq: HumanRequest = {
        id: `hr-${Date.now()}`,
        customerName: customerName || 'Valued Visitor',
        phone: phone || '',
        email: email || '',
        reason,
        currentPage: currentPage || '/',
        conversationSummary,
        status: 'NEW',
        telegramNotified: false,
        createdAt: new Date().toISOString(),
      };

      let telegramSuccess = false;
      if (phone || email || customerName) {
        const tgRes = await sendTelegramHumanNotification({
          customerName: customerName || 'Valued Visitor',
          phone: phone || 'Pending customer input',
          email: email || '',
          reason,
          currentPage: currentPage || '/',
          conversationSummary,
        });
        telegramSuccess = tgRes.success;
      }

      if (telegramSuccess) {
        humanReq.telegramNotified = true;
        humanReq.notifiedAt = new Date().toISOString();
      }

      if (dbStoreRef) {
        dbStoreRef.humanRequests.unshift(humanReq);
      }

      return {
        success: true,
        telegramNotified: humanReq.telegramNotified,
        message: 'The SHIV DHARA team has been alerted.',
        requestId: humanReq.id,
        needContactDetails: !phone && !email,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// Helper: Extract phone number from text if provided by user
function extractPhoneNumber(text: string): string | null {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/);
  return match ? match[0].trim() : null;
}

// ==========================================
// MAIN CHAT HANDLER
// ==========================================

export async function handleDharaChat(params: {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  currentPage?: string;
  customerDetails?: { name?: string; phone?: string; email?: string };
}) {
  const { message, conversationHistory = [], currentPage = '/', customerDetails } = params;

  // Input validation & safety limits
  const sanitizedMessage = typeof message === 'string' ? message.trim().slice(0, 2000) : '';
  if (!sanitizedMessage) {
    return {
      reply: 'Namaste. How may I assist you with SHIV DHARA today?',
    };
  }

  const ai = getAiClient();
  const lowerMsg = sanitizedMessage.toLowerCase();

  // Fast Human Handoff Intent Detection
  const humanHandoffPhrases = [
    'talk to a human',
    'talk to human',
    'speak to someone',
    'speak with someone',
    'talk to your team',
    'talk to the team',
    'speak with team',
    'talk to falgun',
    'speak to falgun',
    'can i talk to falgun',
    'connect me with falgun',
    'connect me with your team',
    'human support',
    'i need human support',
    'call me',
    'want someone to contact me',
    'can someone contact me',
    'contact me',
    'talk to a real person',
    'not a bot',
    'customer care',
    'phone call',
  ];

  const wantsHuman = humanHandoffPhrases.some(phrase => lowerMsg.includes(phrase));
  const detectedPhone = extractPhoneNumber(sanitizedMessage) || customerDetails?.phone || '';
  const customerName = customerDetails?.name || '';
  const customerEmail = customerDetails?.email || '';

  // If AI client is not available (missing GEMINI_API_KEY) or if human handoff is requested directly:
  if (!ai) {
    if (wantsHuman || detectedPhone) {
      const toolRes = await executeToolCall(
        'triggerHumanHandoff',
        {
          customerName,
          phone: detectedPhone,
          email: customerEmail,
          reason: `Customer request: "${sanitizedMessage}"`,
          conversationSummary: `Visitor on ${currentPage} requested human contact.`,
        },
        currentPage
      );

      return {
        reply: detectedPhone
          ? `Namaste${customerName ? ` ${customerName}` : ''}. I have shared your contact details (${detectedPhone}) directly with Falgun Thakkr and the SHIV DHARA team. Someone will reach out via WhatsApp or phone shortly.`
          : 'Namaste. I will gladly connect you with Falgun Thakkr and the SHIV DHARA team. Please share your phone or WhatsApp number so our team can reach out to you directly.',
        humanHandoffTriggered: true,
        needContactDetails: !detectedPhone,
        toolCalls: ['triggerHumanHandoff'],
      };
    }

    // Intelligent local fallback if API key is not yet set
    if (lowerMsg.includes('numerology') || lowerMsg.includes('number') || lowerMsg.includes('moolank') || lowerMsg.includes('bhagyank')) {
      return {
        reply: `Numerology (Sankhya Shastra) explores the 9 cosmic vibrations (1 to 9) linked with planetary archetypes.\n\n• Birth Number (Moolank): Day of your birth (core instinctive traits).\n• Destiny Number (Bhagyank): Full birth date sum (life direction and purpose).\n\nFalgun Thakkr offers the 60-minute "Numerology Blueprint" consultation (₹3,499) and handcrafted gemstone bracelets attuned to numbers 1, 3, 5, 6, and 8.`,
        suggestedActions: ['Calculate Numbers', 'Shop Bracelets', 'Book Numerology Consultation'],
      };
    }

    if (lowerMsg.includes('vastu') || lowerMsg.includes('direction') || lowerMsg.includes('home') || lowerMsg.includes('office')) {
      return {
        reply: `SHIV DHARA Vastu balances the 8 directions with the 5 universal elements (Pancha Mahabhutas) using 100% non-destructive methods.\n\nFalgun Thakkr resolves spatial imbalances through color therapy, lighting, sacred geometry, and functional zoning without breaking walls. You can book a 90-minute Vastu Spatial Energy Audit (₹7,499) or join the upcoming masterclass.`,
        suggestedActions: ['Explore Vastu', 'Vastu Audit', 'Upcoming Workshops'],
      };
    }

    if (lowerMsg.includes('meditation') || lowerMsg.includes('breath') || lowerMsg.includes('stillness')) {
      return {
        reply: `The "Shiv Dhara" meditation method guides you through conscious diaphragmatic breathing (Inhale 4s, Hold 4s, Exhale 6s) and Nada sound resonance to calm the nervous system.\n\nWe offer 1-on-1 breath sessions (₹2,199), authentic 108-bead Nepali Panchamukhi Rudraksha malas (₹3,499), and weekend immersion workshops.`,
        suggestedActions: ['Breathing Sanctuary', 'Rudraksha Mala', 'Meditation Workshop'],
      };
    }

    if (lowerMsg.includes('bracelet') || lowerMsg.includes('product') || lowerMsg.includes('buy') || lowerMsg.includes('mala')) {
      return {
        reply: `Our boutique features handcrafted natural gemstone bracelets aligned with planetary numbers:\n• Number 1 (Surya / Sun): Pyrite & Sunstone (₹2,499)\n• Number 3 (Brihaspati / Jupiter): Citrine & Yellow Aventurine (₹2,699)\n• Number 5 (Budha / Mercury): Green Jade & Fluorite (₹2,399)\n• Number 6 (Shukra / Venus): Rose Quartz & Selenite (₹2,599)\n• Number 8 (Shani / Saturn): Obsidian & Blue Tiger Eye (₹2,799)\n• Sacred 108 Nepali Rudraksha Mala (₹3,499)\n\nWe offer WhatsApp ordering and UPI QR payment. Free shipping over ₹1,999.`,
        suggestedActions: ['Shop Bracelets', 'Rudraksha Mala', 'WhatsApp Ordering'],
      };
    }

    if (lowerMsg.includes('workshop')) {
      return {
        reply: `Upcoming live workshops with Falgun Thakkr:\n1. Numerology Masterclass — Sep 19–20, 2026 (₹4,999)\n2. Vastu for Modern Spaces — Oct 10–11, 2026 (₹5,999)\n3. Shiv Dhara Inner Stillness Meditation — Oct 24–25, 2026 (₹3,499)\n\nAll workshops include live sessions, recordings, and practical guides.`,
        suggestedActions: ['View Workshops', 'Register for Workshop'],
      };
    }

    if (lowerMsg.includes('pay') || lowerMsg.includes('upi') || lowerMsg.includes('payment') || lowerMsg.includes('order')) {
      const whatsappNumber = process.env.WHATSAPP_ORDER_NUMBER || process.env.WHATSAPP_NUMBER || '+916359666315';
      const upiId = process.env.UPI_ID || 'shivdhara@upi';
      return {
        reply: `SHIV DHARA accepts payments via two secure methods:\n\n1. WhatsApp Ordering: Direct order via WhatsApp to ${whatsappNumber}.\n2. UPI QR Payment: Scan our UPI QR code (${upiId}) and submit your UTR/payment reference number on the website. Our team will verify and confirm your order.`,
        suggestedActions: ['WhatsApp Order', 'Pay via UPI', 'Track Order'],
      };
    }

    return {
      reply: 'Namaste! I am Dhara, the AI concierge for SHIV DHARA by Falgun Thakkr. I can assist you with Numerology, non-destructive Vastu spatial guidance, meditation practices, workshop seats, handcrafted gemstone bracelets, and consultation bookings. How may I serve your path today?',
      suggestedActions: ['Explore Numerology', 'Explore Vastu', 'Meditation Sanctuary', 'Shop Bracelets', 'Talk to Team'],
    };
  }

  // ==========================================
  // GEMINI SDK CALL WITH TOOL INTEGRATION
  // ==========================================
  try {
    const systemInstruction = getSystemPrompt(currentPage);

    // Format conversation history for Gemini SDK
    const contents: any[] = [];
    const recentHistory = (conversationHistory || []).slice(-10);

    for (const item of recentHistory) {
      if (item && item.content && typeof item.content === 'string') {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content.slice(0, 1500) }],
        });
      }
    }

    // Append current user message with context metadata
    const userPromptWithContext = `${sanitizedMessage}\n\n[Visitor Context: Page = ${currentPage}${
      customerName ? `, Customer Name = ${customerName}` : ''
    }${detectedPhone ? `, Customer Phone = ${detectedPhone}` : ''}${
      customerEmail ? `, Customer Email = ${customerEmail}` : ''
    }]`;

    contents.push({
      role: 'user',
      parts: [{ text: userPromptWithContext }],
    });

    const tools = [
      {
        functionDeclarations: [
          getProductsDeclaration,
          getProductDetailsDeclaration,
          getUpcomingWorkshopsDeclaration,
          getWorkshopDetailsDeclaration,
          getConsultationServicesDeclaration,
          getFAQsDeclaration,
          triggerHumanHandoffDeclaration,
        ],
      },
    ];

    // First generateContent call
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        tools,
      },
    });

    const toolCallsMade: string[] = [];
    let humanHandoffTriggered = false;
    let needContactDetails = false;

    // Check for explicit human handoff trigger from tools or keyword match
    if (wantsHuman) {
      humanHandoffTriggered = true;
      if (!detectedPhone) {
        needContactDetails = true;
      }
    }

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const toolResponses: any[] = [];

      for (const fc of functionCalls) {
        toolCallsMade.push(fc.name);
        if (fc.name === 'triggerHumanHandoff') {
          humanHandoffTriggered = true;
        }

        const toolArgs = fc.args || {};
        if (fc.name === 'triggerHumanHandoff') {
          if (!toolArgs.phone && detectedPhone) toolArgs.phone = detectedPhone;
          if (!toolArgs.customerName && customerName) toolArgs.customerName = customerName;
          if (!toolArgs.email && customerEmail) toolArgs.email = customerEmail;
        }

        const result = await executeToolCall(fc.name, toolArgs, currentPage);

        if (fc.name === 'triggerHumanHandoff' && result.needContactDetails) {
          needContactDetails = true;
        }

        toolResponses.push({
          name: fc.name,
          id: fc.id,
          content: result,
        });
      }

      // Re-invoke model with tool execution output
      const modelTurn = response.candidates?.[0]?.content;
      const followUpContents = [
        ...contents,
        modelTurn,
        {
          role: 'user',
          parts: toolResponses.map(tr => ({
            functionResponse: {
              name: tr.name,
              response: tr.content,
              id: tr.id,
            },
          })),
        },
      ];

      const secondResponse = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: followUpContents,
        config: {
          systemInstruction,
        },
      });

      const replyText = secondResponse.text?.trim() || 'Namaste. How else may I assist your spiritual and alignment journey today?';

      return {
        reply: replyText,
        toolCalls: toolCallsMade,
        humanHandoffTriggered,
        needContactDetails,
      };
    }

    // Direct response without tools
    let replyText = response.text?.trim() || 'Namaste. How may I assist you with SHIV DHARA today?';

    // If customer asked for human handoff but model didn't invoke tool, trigger handoff notification now
    if (wantsHuman && !toolCallsMade.includes('triggerHumanHandoff')) {
      const handoffRes = await executeToolCall(
        'triggerHumanHandoff',
        {
          customerName,
          phone: detectedPhone,
          email: customerEmail,
          reason: `Human support requested: "${sanitizedMessage}"`,
          conversationSummary: `Visitor on ${currentPage} requested to speak with team.`,
        },
        currentPage
      );
      toolCallsMade.push('triggerHumanHandoff');
      if (handoffRes.needContactDetails) {
        needContactDetails = true;
      }
    }

    return {
      reply: replyText,
      toolCalls: toolCallsMade,
      humanHandoffTriggered,
      needContactDetails,
    };
  } catch (err: any) {
    // Graceful error handling: NEVER show raw technical error 500 or expose secrets
    console.error('[Gemini API Connection Error]:', err.message || err);

    if (wantsHuman || detectedPhone) {
      await executeToolCall(
        'triggerHumanHandoff',
        {
          customerName,
          phone: detectedPhone,
          email: customerEmail,
          reason: `Human request fallback: "${sanitizedMessage}"`,
          conversationSummary: `Fallback human request captured while connecting to assistant.`,
        },
        currentPage
      );
    }

    return {
      reply: "I'm having trouble connecting right now. Please try again in a moment, or I can help connect you with the SHIV DHARA team.",
      humanHandoffTriggered: wantsHuman || Boolean(detectedPhone),
      needContactDetails: !detectedPhone,
    };
  }
}