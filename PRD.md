# Product Requirements Document (PRD) — IN'A Shot Storefront Clone

## 1. Executive Summary & Objective
Build a 100% pixel-accurate, self-hosted e-commerce clone of [https://www.inashot.life](https://www.inashot.life) (IN'A Shot — Functional Snacking & Seed Cycling brand) for a live client showcase.
The application showcases visual, typographic, and animation parity with the live Shopify site, backed by an embedded SQLite database (`local.db`) with Drizzle ORM, client-side state management (Zustand), interactive mock checkout and order tracking, and a client-facing lightweight `/admin` dashboard.

---

## 2. Technical Stack
- **Framework**: Next.js 15+ (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS, CSS Custom Properties (`--color-*`, `--font-*`), native `@keyframes` & Framer Motion
- **State Management**: Zustand (AJAX Cart drawer, category-aware bundle switcher, quick-view modal, 15-minute countdown timer)
- **Database & ORM**: SQLite (`better-sqlite3`) + Drizzle ORM stored locally in `./local.db`
- **Scraping & Verification**: Node.js + Playwright for deterministic asset/DOM extraction and headless visual diffing

---

## 3. Database Schema (Drizzle ORM + SQLite)
Target file: `src/lib/db/schema.ts`

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  vendor: text('vendor').default("IN'A SHOT"),
  category: text('category').notNull(), // 'roasted-edamame' | 'crunchy-edamame' | 'seed-mix' | 'combo'
  featuredImage: text('featured_image').notNull(),
  images: text('images').notNull(), // JSON string array of local media paths
  tags: text('tags').notNull(), // JSON string array
  badge: text('badge'), // '2% Off!' | 'Sold Out' | 'New' | null
  price: real('price').notNull(), // e.g. 531.00
  compareAtPrice: real('compare_at_price'), // e.g. 540.00
  inStock: integer('in_stock', { mode: 'boolean' }).notNull().default(true),
  grams: integer('grams').default(270),
  macros: text('macros'), // JSON: { protein: '13G', fiber: 'HIGH', sugar: '0%' }
  faqs: text('faqs'), // JSON array of { question, answer }
  ingredients: text('ingredients'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  title: text('title').notNull(), // e.g., 'Pack of 9', 'Default Title'
  sku: text('sku'),
  price: real('price').notNull(),
  compareAtPrice: real('compare_at_price'),
  grams: integer('grams'),
  available: integer('available', { mode: 'boolean' }).notNull().default(true),
});

export const bundleTiers = sqliteTable('bundle_tiers', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  category: text('category').notNull(), // 'roasted-edamame' (9/18/27) or 'seed-mix' / 'crunchy-edamame' (8/16/24)
  packCount: integer('pack_count').notNull(), // 8, 9, 16, 18, 24, 27
  weightGrams: integer('weight_grams').notNull(), // 240, 270, 480, 540, 720, 810
  price: real('price').notNull(),
  compareAtPrice: real('compare_at_price'),
  discountPercent: integer('discount_percent').default(0), // 0, 7, 10
  badge: text('badge'), // 'Best value'
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
});

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(), // 'all', 'edamame' (Seed Mix), 'nuts' (Crunchy Edamame), 'combos', 'roasted-edamame'
  title: text('title').notNull(),
  description: text('description'),
  image: text('image'),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => products.id),
  authorHandle: text('author_handle').notNull(), // e.g. '@aashay.mishra01'
  authorName: text('author_name'),
  rating: integer('rating').notNull().default(5),
  quote: text('quote').notNull(),
  isUgc: integer('is_ugc', { mode: 'boolean' }).default(true),
  shoppableProductId: text('shoppable_product_id').references(() => products.id),
  avatar: text('avatar'),
});

export const faqs = sqliteTable('faqs', {
  id: text('id').primaryKey(),
  category: text('category').notNull(), // 'General', 'Hormonal & Seed Cycling', 'Diabetic Suitability', 'Orders & Shipping'
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').default(0),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // e.g. '#INAS-1042'
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'UPI' | 'Card' | 'COD'
  paymentStatus: text('payment_status').notNull().default('PAID'), // 'PAID' | 'PENDING'
  orderStatus: text('order_status').notNull().default('Order Placed'), // 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered'
  subtotal: real('subtotal').notNull(),
  shippingFee: real('shipping_fee').notNull().default(0),
  total: real('total').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  productTitle: text('product_title').notNull(),
  variantTitle: text('variant_title').notNull(),
  packCount: integer('pack_count').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  image: text('image').notNull(),
});
```

---

## 4. Scraped Manifest Structure
Extracted files are housed in `./scraped_manifest/` and media in `./public/scraped/`:
```
scraped_manifest/
├── products.json           # Raw Shopify products payload
├── collections.json        # Raw Shopify collections payload
├── assets.json             # Remote URL to local filesystem path mappings
├── design-tokens.json      # CSS variables, fonts, keyframes, computed styles
└── sections/               # Per-route DOM sections
    ├── index.json          # Homepage sections (Hero, Marquee, Products, UGC, Trio)
    ├── collection-nuts.json
    ├── collection-edamame.json
    ├── product-pdp.json
    ├── page-about-us.json
    ├── page-faq.json
    └── page-contact.json
```

---

## 5. Service Adapter Interfaces (Architecture Pattern)
Target path: `src/services/adapters/types.ts`

```typescript
export interface MockPaymentResult {
  success: boolean;
  transactionId: string;
  paymentMethod: string;
}

export interface IPaymentService {
  processPayment(orderId: string, amount: number, method: 'UPI' | 'Card' | 'COD'): Promise<MockPaymentResult>;
  verifyPayment(transactionId: string): Promise<boolean>;
}

export interface TrackingStep {
  status: 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface IShippingService {
  getTracking(orderId: string): Promise<TrackingStep[]>;
  updateOrderStatus(orderId: string, status: string): Promise<boolean>;
}

export interface IAuthService {
  requestOtp(phoneNumber: string): Promise<{ success: boolean; mockCode: string }>;
  verifyOtp(phoneNumber: string, code: string): Promise<{ success: boolean; token?: string }>;
}
```

These interfaces decouple the frontend from the simulated local SQLite backends, allowing Phase 4 production gateways (Razorpay, Shiprocket, Twilio) to be swapped in without modifying UI components.
