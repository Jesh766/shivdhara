# SHIV DHARA — Production Hosting & Security Deployment Guide

This document provides complete instructions for deploying and hosting **SHIV DHARA by Falgun Thakkr** with full security, cookie consent compliance, and verified workflows.

---

## 1. Hosting Architecture Overview

SHIV DHARA features a modern full-stack architecture:
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS + Lenis Smooth Scroll + Lucide Icons.
- **Backend API**: Express server with in-memory JSON state store (`data/content-store.json`), Telegram real-time dispatch, Gemini 2.5 Flash Dhara AI concierge, and admin management.
- **Build Pipeline**: `npm run build` compiles the Vite SPA to `dist/` and bundles `server.ts` to `dist/server.cjs`.
- **Runtime**: `node dist/server.cjs` or `npm run start` (serves both API routes and static SPA).

---

## 2. Recommended Hosting Options

### Option A: Render / Railway / DigitalOcean / VPS (Fullstack Node.js — Recommended)
Because the application runs a lightweight Express server for Dhara AI, Telegram webhook dispatch, and content persistence, hosting as a Node web service gives you 100% out-of-the-box functionality with zero external dependencies.

1. **Repository**: Push this project to GitHub / GitLab.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm run start` (or `node dist/server.cjs`)
4. **Environment Variables**: Set the variables listed in [Section 3](#3-production-environment-variables).
5. **Port**: Leave default or set `PORT=3000` (Render/Railway automatically binds `PORT`).

### Option B: Vercel / Netlify (Frontend Static + Serverless)
- `vercel.json` and `netlify.toml` are pre-configured in the repository root with SPA rewrites (`/*` -> `/index.html`) and security headers.
- Build command: `npm run build`
- Output directory: `dist`

---

## 3. Production Environment Variables

Configure these in your hosting dashboard under **Environment Variables**:

| Variable | Description | Example / Default | Required |
|---|---|---|---|
| `NODE_ENV` | Runtime environment | `production` | Recommended |
| `PORT` | Web server listening port | `3000` | Optional |
| `ADMIN_TOKEN` | Passcode for Admin Portal and Editor API | *Secure random string* | **Yes** |
| `ADMIN_PASSWORD` | Alternate admin portal login passcode | *Secure random string* | **Yes** |
| `GEMINI_API_KEY` | Google Gemini API key for Dhara AI assistant | `AIzaSy...` | Optional (for AI) |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot token for instant staff alerts | `7845...:...` | Optional (for alerts) |
| `TELEGRAM_CHAT_ID` | Telegram channel or group chat ID | `-100...` | Optional (for alerts) |
| `WHATSAPP_NUMBER` | Contact phone displayed on site | `+916359666315` | Yes |
| `WHATSAPP_ORDER_NUMBER` | Number for WhatsApp checkout confirmations | `+916359666315` | Yes |
| `UPI_ID` | Payment handle for boutique checkout QR | `shivdhara@upi` | Yes |
| `UPI_QR_IMAGE_URL` | Optional custom UPI static QR code image | `https://...` | Optional |
| `VITE_CLARITY_PROJECT_ID`| Microsoft Clarity tracking project ID | `y8huil1hon` | Optional |

---

## 4. Privacy, Cookies & Legal Compliance

SHIV DHARA complies with the **Indian Digital Personal Data Protection Act (DPDP Act 2023)**, **GDPR**, and **ePrivacy**:

1. **Cookie Consent Banner (`CookieConsent.tsx`)**:
   - Appears for new visitors with a serene, luxury aesthetic.
   - **Accept All**: Enables all categories and signals `window.clarity('consent', true)`.
   - **Decline Non-Essential**: Restricts cookies strictly to essential session/cart memory, suppresses Clarity telemetry (`window.clarity('consent', false)`).
   - **Customize Preferences**: Granular control over **Essential**, **Analytics**, **Experience/Functional**, and **Marketing**.
2. **Persistent Management**:
   - Visitors can reopen preferences at any time by clicking **"Cookie Preferences"** in the footer.
3. **Comprehensive Policy**:
   - Access at `/#/legal?tab=cookies` or through the footer link.
   - Features an exact audit table of every cookie and storage key used (`shiv_dhara_cart`, `shiv_dhara_user`, `shivdhara_cookie_consent_v1`, Microsoft Clarity `_clck`/`_clsk`).

---

## 5. Security Hardening Measures Implemented

1. **HTTP Security Headers**:
   - `X-Content-Type-Options: nosniff` (prevents MIME type sniffing).
   - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking attacks).
   - `X-XSS-Protection: 1; mode=block` (browser legacy XSS filter).
   - `Referrer-Policy: strict-origin-when-cross-origin` (protects referrer privacy).
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (restricts unused sensitive device hardware).
   - `Strict-Transport-Security` (HSTS enabled in production HTTPS).
   - `app.disable('x-powered-by')` (hides server tech stack).
2. **API Abuse Protection & Sliding-Window Rate Limiting**:
   - `authLimiter`: 25 attempts / 15 minutes on `/api/auth/*` (prevents credential brute forcing).
   - `chatLimiter`: 45 queries / minute on `/api/chat` (protects Gemini API quota).
   - `submissionLimiter`: 30 submissions / 10 minutes on `/api/orders`, `/api/contact`, `/api/human-request`, `/api/consultations/book`, `/api/workshops/register` (prevents spam flooding).
3. **Price Forgery Defense**:
   - Cart prices submitted from the client are completely recalculated server-side from catalog source data before orders or totals are generated.
4. **Credential Safety**:
   - Passwords are automatically stripped from all user serialization responses (`userSafe`).
5. **Search Engine Guidance**:
   - `public/robots.txt` disallows indexation of `/admin` and internal `/api/` routes while allowing public sanctuary pages.

---

## 6. End-to-End Workflow Verification Checklist

| Workflow | Path | Status | Verification Detail |
|---|---|---|---|
| **Home & Philosophy** | `/#/` | Verified | Cinematic arrival, founder introduction, discipline triad, interactive particle and cursor field |
| **Numerology Consultation** | `/#/numerology` | Verified | Interactive driver/conductor calculator, booking modal integration |
| **Vastu Spatial Alignment** | `/#/vastu` | Verified | 16-zone directional compass, architectural audit inquiry |
| **Meditation Sanctuary** | `/#/meditation` | Verified | Guided pranic breath timer, cohort enrollments |
| **Wisdom Workshops** | `/#/workshops` | Verified | Capacity validation, seat reservation, order confirmation |
| **Sacred Boutique** | `/#/products` | Verified | Category filters, product quick view modal, variant selector, stock validation, "Add to Sacred Bag" |
| **Sacred Bag (Cart)** | Slide-over drawer | Verified | Quantity adjustment, persistent storage, subtotal, free shipping threshold over ₹1,999 |
| **Secure Checkout** | `/#/checkout` | Verified | Form validation, dynamic UPI QR code generator, UTR payment verification flow, WhatsApp direct order option |
| **Dhara AI Assistant** | Floating widget | Verified | Context-aware responses, direct Telegram human handoff form with staff notifications |
| **Contact Sanctuary** | `/#/contact` | Verified | Direct messaging form with backend recording |
| **Cookie & Consent** | Sitewide / Footer | Verified | Accept/Decline/Custom choices saved to `localStorage`, live Clarity telemetry consent toggle |
| **Legal & Ethics Hub** | `/#/legal` | Verified | Privacy, Cookies, Terms of Service, Shipping, and Refund policies |
| **Master Admin Portal** | `/#/admin` | Verified | Passcode-protected overview, order management, user directory, content editor |
