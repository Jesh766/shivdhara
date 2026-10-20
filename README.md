# SHIV DHARA — By Falgun Thakkr

> **Align Your Numbers. Align Your Space. Align Within.**
> Modern Indian Spirituality, Quiet Luxury, Sacred Geometry & Human Wisdom.

SHIV DHARA is an editorial web application combining classical Vedic sciences with contemporary design. Guided by founder **Falgun Thakkr**, the platform offers 1-on-1 numerology consultations, non-destructive spatial Vastu Vidya energy audits, mindful meditation cohorts, and handcrafted energized gemstone bracelets.

---

## 🌟 Key Features

- **Interactive Numerology Calculator**: Instant Driver (Moolank), Conductor (Bhagyank), and Name Frequency analysis.
- **16-Zone Spatial Vastu Compass**: Interactive architectural direction alignment and remedial analysis.
- **Conscious Meditation Sanctuary**: Guided pranic breath timer, cohort enrollments, and audio wisdom.
- **Sacred Boutique & Cart**: Handcrafted gemstone bracelets with stock checking, variant selection, and dynamic free shipping.
- **Dual Payment & Checkout**: Instant UPI QR code generator with UTR transaction verification + WhatsApp direct order routing.
- **AI Concierge (Dhara)**: Context-aware spiritual inquiry assistant with Telegram webhook human handoff.
- **Full Privacy & Consent**: GDPR & Indian DPDP Act (2023) compliant cookie consent banner with granular telemetry preferences.
- **Master Admin Portal & Live Editor**: Passcode-secured management dashboard for catalog, workshops, orders, and content updates.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm or bun

### 1. Installation
```bash
git clone https://github.com/Jesh766/shivdhara.git
cd shivdhara
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your environment variables:
- `GEMINI_API_KEY`: Google Gemini API key for Dhara AI assistant
- `ADMIN_TOKEN` / `ADMIN_PASSWORD`: Passcode for the admin dashboard
- `WHATSAPP_NUMBER`: Your WhatsApp contact number (e.g. `+916359666315`)
- `UPI_ID`: Your UPI ID for QR code generation (e.g. `shivdhara@upi`)
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: For instant order and consultation staff alerts

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🛡️ Security & Privacy
- **HTTP Security Headers**: Strict CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Anti-Abuse Rate Limiting**: Built-in sliding-window rate limiters for auth, chat queries, and form submissions.
- **Zero Secrets**: All credentials, tokens, and private keys are strictly managed via environment variables and excluded from version control.

---

## 📄 License & Ownership
Copyright © 2026 SHIV DHARA by Falgun Thakkr. Developed by JESH. All rights reserved.
