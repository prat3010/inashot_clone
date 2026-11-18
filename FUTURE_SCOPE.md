# FUTURE SCOPE: Production Roadmap & Deferred Implementations

This document tracks deferred architectural features and integrations intended for Phase 4 rollout post frontend and client showcase approval.

---

## 1. Dynamic Custom Bundle-Builder Rules Engine (`/admin`)
- **Current State**: Hardcoded category tiers (`9 / 18 / 27` for Roasted Edamame; `8 / 16 / 24` for Seed Mix and Crunchy Edamame) seeded in `bundle_tiers`.
- **Phase 4 Implementation**:
  - Full WYSIWYG bundle rules builder in the Admin dashboard.
  - Multi-product "Build Your Own Box" (BYOB) feature allowing customers to mix & match flavors into 8, 16, or 24-packs with dynamic weight/cart calculation.
  - Granular tier discount triggers (e.g., Spend ₹1000 get 5% off, buy 3 packs get 10% off).
  - Admin controls for pack multiples, custom badges ("Best Value", "Bestseller"), and promo codes.

---

## 2. Production Payment Gateways (Razorpay & Cashfree)
- **Current State**: Simulated 1-click checkout with mock UPI/Card/COD in `PaymentAdapter`.
- **Phase 4 Implementation**:
  - Live Razorpay Standard & Custom Checkout integration.
  - Webhook verification endpoints (`/api/webhooks/razorpay`, `/api/webhooks/cashfree`) with HMAC-SHA256 signature validation.
  - Auto-refund handling on cancellation and instant UPI QR generation via Cashfree.
  - PCI-DSS compliant tokenized card storage.

---

## 3. Shiprocket Logistics & Courier Integration
- **Current State**: Embedded mock shipping status pipeline (`Order Placed` -> `Packed` -> `Shipped` -> `Out for Delivery` -> `Delivered`) backed by SQLite.
- **Phase 4 Implementation**:
  - Automatic Airway Bill (AWB) generation via Shiprocket REST APIs upon order status change to `Packed`.
  - Serviceability checking and pincode-level COD validation at checkout.
  - Real-time webhook listener for live courier location updates (Delhivery, BlueDart, DTDC).
  - Reverse logistics and return manifest creation.

---

## 4. WhatsApp & SMS OTP Authentication
- **Current State**: Lightweight customer order lookup via Order ID or Phone number without login wall.
- **Phase 4 Implementation**:
  - Headless WhatsApp OTP sign-in via Gupshup / Aisensy API.
  - Fast transactional SMS fallback via MSG91 / Twilio.
  - Automatic WhatsApp order confirmation message with interactive tracking link and dynamic PDF invoice.
  - Cart abandonment notifications triggered after 30 minutes of inactivity.
