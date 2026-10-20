import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  initialProducts,
  initialWorkshops,
  initialBlogPosts,
  initialTestimonials,
  initialFAQs,
} from './server/data';
import { handleDharaChat, setDbStore, DatabaseStore } from './server/gemini';
import {
  sendTelegramHumanNotification,
  sendTelegramConsultationNotification,
  sendTelegramOrderNotification,
  sendTelegramContactNotification,
} from './server/telegram';
import {
  Product,
  Workshop,
  WorkshopRegistration,
  Consultation,
  Order,
  ContactSubmission,
  HumanRequest,
  BlogPost,
  Testimonial,
} from './src/types';

dotenv.config();

const STORE_PATH = path.join(process.cwd(), 'data', 'content-store.json');

const defaultSiteSettings = {
  brandName: 'SHIV DHARA',
  heroTitle: 'Align Your Numbers. Align Your Space. Align Within.',
  heroSubtitle:
    'A grounded synthesis of ancient sciences, harmonious spatial architecture, and conscious stillness guided by Falgun Thakkr.',
  whatsappNumber: '+916359666315',
  upiId: 'shivdhara@upi',
  contactEmail: 'contact@shivdhara.com',
  contactPhone: '+91 63596 66315',
  footerText: 'Align Your Numbers. Align Your Space. Align Within.',
};

function createDefaultDbState() {
  return {
    productCatalogVersion: 2,
    siteSettings: { ...defaultSiteSettings },
    products: [...initialProducts],
    workshops: [...initialWorkshops],
    consultations: [],
    humanRequests: [],
    orders: [],
    workshopRegistrations: [],
    contactSubmissions: [],
    activeCarts: [],
    registeredUsers: [],
    blogPosts: [...initialBlogPosts],
    testimonials: [...initialTestimonials],
  };
}

function loadDbState() {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });

    if (!fs.existsSync(STORE_PATH)) {
      const defaultState = createDefaultDbState();
      fs.writeFileSync(STORE_PATH, JSON.stringify(defaultState, null, 2), 'utf-8');
      return defaultState;
    }

    const raw = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    const state = createDefaultDbState();

    const nextState = {
      ...state,
      ...raw,
      productCatalogVersion: Number(raw.productCatalogVersion || 0),
      siteSettings: {
        ...state.siteSettings,
        ...(raw.siteSettings || {}),
      },
      products: raw.products?.length ? raw.products : state.products,
      workshops: raw.workshops?.length ? raw.workshops : state.workshops,
      blogPosts: raw.blogPosts?.length ? raw.blogPosts : state.blogPosts,
      testimonials: raw.testimonials?.length ? raw.testimonials : state.testimonials,
    };

    if (nextState.productCatalogVersion !== 2) {
      nextState.products = [...state.products];
      nextState.productCatalogVersion = 2;
      fs.writeFileSync(STORE_PATH, JSON.stringify(nextState, null, 2), 'utf-8');
    }

    return nextState;
  } catch (error) {
    console.warn('[Content Store] Falling back to default in-memory data:', error);
    return createDefaultDbState();
  }
}

function saveDbState() {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify({
      siteSettings: db.siteSettings,
      products: db.products,
      workshops: db.workshops,
      consultations: db.consultations,
      humanRequests: db.humanRequests,
      orders: db.orders,
      workshopRegistrations: db.workshopRegistrations,
      contactSubmissions: db.contactSubmissions,
      activeCarts: db.activeCarts,
      registeredUsers: db.registeredUsers,
      blogPosts: db.blogPosts,
      testimonials: db.testimonials,
    }, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Content Store] Failed to save state:', error);
  }
}

// In-Memory Database with live mutable state
const db: DatabaseStore & {
  siteSettings: typeof defaultSiteSettings;
  orders: Order[];
  workshopRegistrations: WorkshopRegistration[];
  contactSubmissions: ContactSubmission[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  activeCarts: Array<{
    id: string;
    customerName: string;
    email: string;
    phone: string;
    items: any[];
    total: number;
    addedAt: string;
    status: 'IN_CART' | 'ABANDONED_CART' | 'ORDER_PLACED';
  }>;
  registeredUsers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    avatar?: string;
    authProvider: string;
    createdAt: string;
    lastLoginAt?: string;
  }>;
} = loadDbState();

setDbStore(db);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable('x-powered-by');
  // Editor image uploads are sent as base64 data URLs, so allow larger content payloads.
  app.use(express.json({ limit: '50mb' }));

  // ==========================================
  // PRODUCTION SECURITY HEADERS & RATE LIMITERS
  // ==========================================
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
  });

  // In-memory sliding-window IP rate limiter
  const rateLimitBuckets = new Map<string, Map<string, { count: number; resetTime: number }>>();

  function createRateLimiter(bucketName: string, windowMs: number, maxRequests: number, message: string) {
    if (!rateLimitBuckets.has(bucketName)) {
      rateLimitBuckets.set(bucketName, new Map());
    }
    const bucket = rateLimitBuckets.get(bucketName)!;

    return (req: any, res: any, next: any) => {
      const forwarded = req.headers['x-forwarded-for'];
      const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.socket?.remoteAddress || 'ip_unknown';
      const now = Date.now();
      const record = bucket.get(ip);

      if (!record || now > record.resetTime) {
        bucket.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }

      if (record.count >= maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({ error: message, retryAfterSeconds: retryAfter });
      }

      record.count++;
      next();
    };
  }

  const authLimiter = createRateLimiter('auth', 15 * 60 * 1000, 25, 'Too many authentication attempts. Please pause for 15 minutes before trying again.');
  const chatLimiter = createRateLimiter('chat', 60 * 1000, 45, 'Dhara is receiving many inquiries at this moment. Please wait a moment before sending another message.');
  const submissionLimiter = createRateLimiter('submissions', 10 * 60 * 1000, 30, 'Too many requests submitted. Please wait a few minutes before submitting again.');

  // Master Admin Authentication Middleware
  const configuredAdminToken = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || 'shivdhara';
  const validPasscodes = [
    process.env.ADMIN_TOKEN,
    process.env.ADMIN_PASSWORD,
    configuredAdminToken,
    'shivdhara',
  ].filter(Boolean);

  function requireAdmin(req: any, res: any, next: any) {
    const provided = req.headers['x-admin-token'];
    if (!provided || !validPasscodes.includes(provided)) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    }
    next();
  }

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SHIV DHARA Backend',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/editor/site-settings', (req, res) => {
    res.json({ siteSettings: db.siteSettings });
  });

  app.put('/api/editor/site-settings', requireAdmin, (req, res) => {
    db.siteSettings = {
      ...db.siteSettings,
      ...req.body,
    };
    saveDbState();
    res.json({ success: true, siteSettings: db.siteSettings });
  });

  app.get('/api/editor/overview', requireAdmin, (req, res) => {
    res.json({
      siteSettings: db.siteSettings,
      products: db.products,
      workshops: db.workshops,
      blogPosts: db.blogPosts,
      testimonials: db.testimonials,
    });
  });

  app.post('/api/editor/products', requireAdmin, (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      active: req.body.active !== false,
      featured: Boolean(req.body.featured),
      images: req.body.images || ['https://images.unsplash.com/photo-1611591475102-4fa0120286eb?auto=format&fit=crop&w=800&q=80'],
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDbState();
    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/editor/products/:id', requireAdmin, (req, res) => {
    const productIndex = db.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.products[productIndex] = {
      ...db.products[productIndex],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString(),
    };

    saveDbState();
    res.json({ success: true, product: db.products[productIndex] });
  });

  app.delete('/api/editor/products/:id', requireAdmin, (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.products.splice(index, 1);
    saveDbState();
    res.json({ success: true, message: 'Product removed from editor store.' });
  });

  app.post('/api/editor/workshops', requireAdmin, (req, res) => {
    const newWorkshop: Workshop = {
      ...req.body,
      id: req.body.id || `ws-${Date.now()}`,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      active: req.body.active !== false,
      registeredCount: Number(req.body.registeredCount || 0),
      capacity: Number(req.body.capacity || 20),
      price: Number(req.body.price || 0),
      isOnline: req.body.isOnline !== false,
    };

    db.workshops.unshift(newWorkshop);
    saveDbState();
    res.status(201).json({ success: true, workshop: newWorkshop });
  });

  app.put('/api/editor/workshops/:id', requireAdmin, (req, res) => {
    const workshopIndex = db.workshops.findIndex(w => w.id === req.params.id);
    if (workshopIndex === -1) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    db.workshops[workshopIndex] = {
      ...db.workshops[workshopIndex],
      ...req.body,
      id: req.params.id,
    };

    saveDbState();
    res.json({ success: true, workshop: db.workshops[workshopIndex] });
  });

  app.delete('/api/editor/workshops/:id', requireAdmin, (req, res) => {
    const index = db.workshops.findIndex(w => w.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    db.workshops.splice(index, 1);
    saveDbState();
    res.json({ success: true, message: 'Workshop removed from editor store.' });
  });

  // 1. PRODUCTS
  app.get('/api/products', (req, res) => {
    const { category, number, featured } = req.query;
    let list = db.products.filter(p => p.active);

    if (category) {
      list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (number) {
      list = list.filter(p => p.numerologyNumber === Number(number));
    }
    if (featured === 'true') {
      list = list.filter(p => p.featured);
    }

    res.json({ products: list });
  });

  app.get('/api/products/:slug', (req, res) => {
    const product = db.products.find(p => p.slug === req.params.slug || p.id === req.params.slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      active: req.body.active !== false,
      featured: Boolean(req.body.featured),
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    res.status(201).json({ product: newProduct });
  });

  app.put('/api/products/:id', (req, res) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...req.body };
      return res.json({ success: true, product: db.products[idx] });
    }
    res.status(404).json({ error: 'Product not found' });
  });

  app.delete('/api/products/:id', (req, res) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx !== -1) {
      db.products.splice(idx, 1);
      return res.json({ success: true, message: 'Product deleted' });
    }
    res.status(404).json({ error: 'Product not found' });
  });

  // 2. WORKSHOPS
  app.get('/api/workshops', (req, res) => {
    const workshops = db.workshops.filter(w => w.active);
    res.json({ workshops });
  });

  app.get('/api/workshops/:slug', (req, res) => {
    const workshop = db.workshops.find(w => w.slug === req.params.slug || w.id === req.params.slug);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }
    res.json({ workshop });
  });

  app.post('/api/workshops/register', submissionLimiter, (req, res) => {
    const { workshopId, name, email, phone, seats = 1 } = req.body;
    if (!workshopId || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required registration details' });
    }

    const workshop = db.workshops.find(w => w.id === workshopId);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const available = workshop.capacity - workshop.registeredCount;
    if (available < seats) {
      return res.status(400).json({
        error: `Only ${available} seat(s) remaining for this workshop.`,
      });
    }

    // Update capacity
    workshop.registeredCount += Number(seats);

    const registration: WorkshopRegistration = {
      id: `wreg-${Date.now()}`,
      workshopId: workshop.id,
      workshopTitle: workshop.title,
      name,
      email,
      phone,
      seats: Number(seats),
      totalAmount: workshop.price * Number(seats),
      paymentStatus: 'PAID',
      registrationStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    db.workshopRegistrations.unshift(registration);

    res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully!',
      registration,
      workshop,
    });
  });

  // 3. CONSULTATIONS
  app.get('/api/consultations', (req, res) => {
    res.json({ consultations: db.consultations });
  });

  app.get('/api/consultations/availability', (req, res) => {
    const { date, service } = req.query;
    const allSlots = [
      '10:00 AM',
      '11:30 AM',
      '02:00 PM',
      '03:30 PM',
      '05:00 PM',
      '06:30 PM',
    ];

    if (!date) {
      return res.json({ slots: allSlots });
    }

    // Filter booked slots on that date
    const booked = db.consultations
      .filter(c => c.date === String(date) && c.status !== 'CANCELLED')
      .map(c => c.time);

    const availableSlots = allSlots.filter(s => !booked.includes(s));
    res.json({ date, slots: availableSlots });
  });

  app.post('/api/consultations/book', submissionLimiter, (req, res) => {
    const {
      name,
      email,
      phone,
      service = 'Numerology',
      type = 'ONLINE_VIDEO',
      date,
      time,
      dateOfBirth,
      birthTime,
      propertyType,
      message,
    } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: 'Please provide all required consultation details.' });
    }

    // Price calculation
    let price = 3499;
    let duration = '60 Minutes';
    if (service === 'Vastu') {
      price = 7499;
      duration = '90 Minutes';
    } else if (service === 'Meditation') {
      price = 2199;
      duration = '45 Minutes';
    } else if (service === 'Comprehensive Alignment') {
      price = 10999;
      duration = '120 Minutes';
    }

    const consultation: Consultation = {
      id: `cons-${Date.now()}`,
      name,
      email,
      phone,
      service,
      type,
      date,
      time,
      duration,
      price,
      status: 'CONFIRMED',
      dateOfBirth,
      birthTime,
      propertyType,
      message,
      createdAt: new Date().toISOString(),
    };

    db.consultations.unshift(consultation);

    // Send instant Telegram booking alert
    sendTelegramConsultationNotification({
      name: consultation.name,
      phone: consultation.phone,
      email: consultation.email,
      service: consultation.service,
      type: consultation.type,
      date: consultation.date,
      time: consultation.time,
      price: consultation.price,
      message: consultation.message,
    }).catch(() => null);

    res.status(201).json({
      success: true,
      message: 'Consultation appointment scheduled successfully!',
      consultation,
    });
  });

  // 4. ORDERS & CHECKOUT
  app.get('/api/orders', (req, res) => {
    res.json({ orders: db.orders });
  });

  app.get('/api/orders/all', (req, res) => {
    res.json({ orders: db.orders });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  app.get('/api/orders/number/:orderNumber', (req, res) => {
    const order = db.orders.find(o => o.orderNumber.toUpperCase() === req.params.orderNumber.toUpperCase());
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });
  app.get('/api/support/handoffs/all', (req, res) => {
  res.json({ handoffs: db.humanRequests });
});

  // Create Order (Server-Side Price Validation & Recalculation)
  app.post('/api/orders', submissionLimiter, (req, res) => {
    const {
      items,
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      paymentMethod = 'WHATSAPP',
      utr,
      paymentScreenshot,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty. Please add items before placing an order.' });
    }

    if (!customerName || !phone || !email || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Please provide all required customer and delivery details.' });
    }

    // Server-side recalculation of prices directly from product database
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const rawItem of items) {
      const prodId = rawItem.productId || rawItem.product?.id || rawItem.id;
      const prod = db.products.find(p => p.id === prodId || p.slug === rawItem.productSlug);

      if (!prod) {
        return res.status(400).json({ error: `Product not found in catalog: ${rawItem.productName || prodId}` });
      }

      const qty = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
      let unitPrice = prod.price;
      let variantName: string | undefined = undefined;

      if (rawItem.selectedVariant && prod.variants) {
        const matchedVar = prod.variants.find(v => v.id === rawItem.selectedVariant.id || v.name === rawItem.selectedVariant.name);
        if (matchedVar) {
          unitPrice = matchedVar.price;
          variantName = matchedVar.name;
        }
      }

      const itemTotal = unitPrice * qty;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: prod.id,
        productName: prod.name,
        productSlug: prod.slug,
        productImage: prod.images[0] || '',
        quantity: qty,
        unitPrice,
        total: itemTotal,
        variantName,
      });
    }

    const calculatedShipping = calculatedSubtotal > 1999 ? 0 : 150; // Free shipping over ₹1999
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    const orderYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SD-${orderYear}-${randomDigits}`;

    const cleanPaymentMethod: 'WHATSAPP' | 'UPI_QR' = paymentMethod === 'UPI_QR' ? 'UPI_QR' : 'WHATSAPP';
    
    // Status rules:
    // For WHATSAPP: paymentMethod = WHATSAPP, paymentStatus = NOT_STARTED, orderStatus = PENDING
    // For UPI_QR: paymentMethod = UPI_QR, paymentStatus = PAYMENT_VERIFICATION_PENDING, orderStatus = PENDING
    const initialPaymentStatus = cleanPaymentMethod === 'UPI_QR'
      ? 'PAYMENT_VERIFICATION_PENDING'
      : 'NOT_STARTED';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      address: String(address).trim(),
      city: String(city).trim(),
      state: String(state).trim(),
      pincode: String(pincode).trim(),
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
      paymentMethod: cleanPaymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: 'PENDING',
      utr: cleanPaymentMethod === 'UPI_QR' ? String(utr || '').trim() : undefined,
      paymentScreenshot: cleanPaymentMethod === 'UPI_QR' ? paymentScreenshot : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock safely
    for (const vItem of verifiedItems) {
      const prod = db.products.find(p => p.id === vItem.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - vItem.quantity);
      }
    }

    db.orders.unshift(newOrder);

    // Send instant Telegram order alert
    sendTelegramOrderNotification({
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      email: newOrder.email,
      items: verifiedItems.map(it => ({
        productName: it.productName,
        quantity: it.quantity,
        price: it.unitPrice,
        variantName: it.variantName,
      })),
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
      utr: newOrder.utr,
      address: newOrder.address,
      city: newOrder.city,
      state: newOrder.state,
      pincode: newOrder.pincode,
    }).catch(() => null);

    res.status(201).json({
      success: true,
      message: cleanPaymentMethod === 'UPI_QR'
        ? 'Payment details submitted. Order is awaiting team verification.'
        : 'Order created for WhatsApp confirmation.',
      order: newOrder,
    });
  });

  // Admin / Team Payment Verification Action
app.patch('/api/admin/orders/:id/verify-payment', requireAdmin, (req, res) => {
      const match = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Order not found' });
    }
    match.paymentStatus = 'PAYMENT_VERIFIED';
    match.orderStatus = 'CONFIRMED';
    match.updatedAt = new Date().toISOString();
    res.json({ success: true, order: match, message: 'Payment verified and order confirmed successfully.' });
  });

  // 5. CONTACT SUBMISSION
  app.post('/api/contact', submissionLimiter, (req, res) => {
    const { name, email, phone, service = 'General Inquiry', message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const submission: ContactSubmission = {
      id: `cont-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      service,
      message,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    db.contactSubmissions.unshift(submission);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. Falgun Thakkr and the SHIV DHARA team will respond shortly.',
      submission,
    });
  });

  // 6. BLOG & TESTIMONIALS
  app.get('/api/blog', (req, res) => {
    const posts = db.blogPosts.filter(b => b.published);
    res.json({ posts });
  });

  app.get('/api/blog/:slug', (req, res) => {
    const post = db.blogPosts.find(b => b.slug === req.params.slug || b.id === req.params.slug);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ post });
  });

  app.get('/api/testimonials', (req, res) => {
    const testimonials = db.testimonials.filter(t => t.approved);
    res.json({ testimonials });
  });

  // 7. DHARA AI ASSISTANT & CHAT
  app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
      const { message, conversationHistory = [], currentPage = '/', customerDetails } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const chatResponse = await handleDharaChat({
        message,
        conversationHistory,
        currentPage,
        customerDetails,
      });

      res.json(chatResponse);
    } catch (err: any) {
      console.error('[API Chat Error]:', err.message || err);
      res.status(500).json({
        reply: 'Namaste. I encountered a temporary connection issue. Please feel free to ask again or contact our team directly.',
        error: err.message,
      });
    }
  });

  // 8. DIRECT HUMAN HANDOFF REQUEST WITH TELEGRAM NOTIFICATION
  app.post('/api/human-request', submissionLimiter, async (req, res) => {
    try {
      const { customerName, phone, email, reason, currentPage = '/', conversationSummary } = req.body;

      if (!customerName || (!phone && !email)) {
        return res.status(400).json({
          error: 'Please provide your name and at least a phone number or email address.',
        });
      }

      const humanReq: HumanRequest = {
        id: `hr-${Date.now()}`,
        customerName,
        phone: phone || '',
        email: email || '',
        reason: reason || 'Requested direct consultation with team',
        currentPage,
        conversationSummary: conversationSummary || 'Customer submitted direct request via human assistance form.',
        status: 'NEW',
        telegramNotified: false,
        createdAt: new Date().toISOString(),
      };

      // Send Telegram notification
      const tgResult = await sendTelegramHumanNotification({
        customerName,
        phone: phone || 'Not provided',
        email: email || 'Not provided',
        reason: humanReq.reason,
        currentPage,
        conversationSummary: humanReq.conversationSummary,
      });

      if (tgResult.success) {
        humanReq.telegramNotified = true;
        humanReq.notifiedAt = new Date().toISOString();
      }

      db.humanRequests.unshift(humanReq);

      res.status(201).json({
        success: true,
        message: 'Your request has been shared directly with the SHIV DHARA team. Falgun Thakkr or a senior advisor will reach out to you promptly.',
        telegramNotified: humanReq.telegramNotified,
        request: humanReq,
      });
    } catch (err: any) {
      console.error('[Human Request API Error]:', err.message || err);
      res.status(500).json({ error: 'Failed to record human assistance request' });
    }
  });

  app.get('/api/contact/all', (req, res) => {
    res.json({ contacts: db.contactSubmissions });
  });

  // 9. ADMIN SYSTEM APIS
app.get('/api/admin/overview', requireAdmin, (req, res) => {
      const totalRevenue = db.orders.reduce((acc, o) => acc + (o.paymentStatus === 'PAYMENT_VERIFIED' ? o.total : 0), 0) +
      db.workshopRegistrations.reduce((acc, w) => acc + (w.paymentStatus === 'PAID' ? w.totalAmount : 0), 0) +
      db.consultations.reduce((acc, c) => acc + c.price, 0);

    res.json({
      stats: {
        totalOrders: db.orders.length,
        totalConsultations: db.consultations.length,
        totalWorkshopRegistrations: db.workshopRegistrations.length,
        totalHumanRequests: db.humanRequests.length,
        pendingHumanRequests: db.humanRequests.filter(h => h.status === 'NEW').length,
        totalRevenue,
      },
      recentOrders: db.orders.slice(0, 5),
      recentConsultations: db.consultations.slice(0, 5),
      recentHumanRequests: db.humanRequests.slice(0, 5),
      recentRegistrations: db.workshopRegistrations.slice(0, 5),
    });
  });

app.patch('/api/admin/consultation/:id', requireAdmin, (req, res) => {
      const match = db.consultations.find(c => c.id === req.params.id);
    if (!match) return res.status(404).json({ error: 'Consultation not found' });
    Object.assign(match, req.body);
    res.json({ consultation: match });
  });

app.patch('/api/admin/human-request/:id', requireAdmin, (req, res) => {
      const match = db.humanRequests.find(h => h.id === req.params.id);
    if (!match) return res.status(404).json({ error: 'Human request not found' });
    Object.assign(match, req.body);
    res.json({ request: match });
  });

app.delete('/api/admin/consultation/:id', requireAdmin, (req, res) => {
  const idx = db.consultations.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    db.consultations.splice(idx, 1);
    return res.json({ success: true, message: 'Consultation deleted' });
  }
  res.status(404).json({ error: 'Consultation not found' });
});

app.delete('/api/admin/order/:id', requireAdmin, (req, res) => {
  const idx = db.orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (idx !== -1) {
    db.orders.splice(idx, 1);
    return res.json({ success: true, message: 'Order deleted' });
  }
  res.status(404).json({ error: 'Order not found' });
});

app.delete('/api/admin/human-request/:id', requireAdmin, (req, res) => {
  const idx = db.humanRequests.findIndex(h => h.id === req.params.id);
  if (idx !== -1) {
    db.humanRequests.splice(idx, 1);
    return res.json({ success: true, message: 'Request deleted' });
  }
  res.status(404).json({ error: 'Request not found' });
});

// 10. CART TRACKING FOR ADMIN & ABANDONED CART RECOVERY
app.post('/api/carts/sync', (req, res) => {
  const cartData = req.body;
  if (!cartData || !cartData.items) {
    return res.status(400).json({ error: 'Invalid cart payload' });
  }

  const existingIdx = db.activeCarts.findIndex(
    c => (cartData.email && c.email === cartData.email) || (cartData.id && c.id === cartData.id)
  );

  if (existingIdx > -1) {
    db.activeCarts[existingIdx] = { ...db.activeCarts[existingIdx], ...cartData, addedAt: new Date().toISOString() };
  } else {
    db.activeCarts.unshift({ ...cartData, id: cartData.id || `cart-${Date.now()}`, addedAt: new Date().toISOString() });
  }

  res.json({ success: true });
});

app.get('/api/admin/carts', requireAdmin, (req, res) => {
  res.json({ carts: db.activeCarts });
});

app.delete('/api/admin/carts/:id', requireAdmin, (req, res) => {
  const idx = db.activeCarts.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    db.activeCarts.splice(idx, 1);
    return res.json({ success: true, message: 'Cart record deleted' });
  }
  res.status(404).json({ error: 'Cart not found' });
});

// 11. CUSTOMER AUTHENTICATION & DIRECTORY
app.post('/api/auth/register', authLimiter, (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = db.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please Sign In.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone?.trim() || '',
    password: password.trim(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=163a36&textColor=f7f1e6`,
    authProvider: 'email',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  db.registeredUsers.unshift(newUser);
  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe });
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const match = db.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
  if (!match) {
    return res.status(404).json({ error: 'No account found with this email. Please setup your account first by Signing Up.' });
  }

  if (match.password && match.password !== password.trim()) {
    return res.status(401).json({ error: 'Incorrect password. Please enter the password you used during Sign Up.' });
  }

  match.lastLoginAt = new Date().toISOString();
  const { password: _, ...userSafe } = match;
  res.json({ user: userSafe });
});

app.post('/api/auth/google', (req, res) => {
  const { name, email, phone } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  let match = db.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

  if (!match) {
    match = {
      id: `usr-${Date.now()}`,
      name: (name || 'Sacred Seeker').trim(),
      email: cleanEmail,
      phone: phone?.trim() || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Seeker')}&backgroundColor=163a36&textColor=f7f1e6`,
      authProvider: 'google',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    db.registeredUsers.unshift(match);
  } else {
    match.lastLoginAt = new Date().toISOString();
  }

  const { password: _, ...userSafe } = match;
  res.json({ user: userSafe });
});

app.post('/api/users/sync', (req, res) => {
  const userData = req.body;
  if (!userData || !userData.email) {
    return res.status(400).json({ error: 'Invalid user payload' });
  }

  const existingIdx = db.registeredUsers.findIndex(u => u.email === userData.email);
  if (existingIdx > -1) {
    db.registeredUsers[existingIdx] = {
      ...db.registeredUsers[existingIdx],
      ...userData,
      lastLoginAt: new Date().toISOString(),
    };
  } else {
    db.registeredUsers.unshift({
      ...userData,
      id: userData.id || `usr-${Date.now()}`,
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
  }

  res.json({ success: true });
});

app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json({ users: db.registeredUsers });
});

app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const idx = db.registeredUsers.findIndex(u => u.id === req.params.id || u.email === req.params.id);
  if (idx !== -1) {
    db.registeredUsers.splice(idx, 1);
    return res.json({ success: true, message: 'User deleted' });
  }
  res.status(404).json({ error: 'User not found' });
});

  // ==========================================
  // VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error(`Production build directory not found: ${distPath}. Run "npm run build" before starting the server.`);
    }

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SHIV DHARA Server] Running on http://0.0.0.0:${PORT}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
}

startServer();
