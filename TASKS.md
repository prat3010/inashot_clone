# TASKS: Granular Implementation Checklist

## Step 0: Documentation & Architecture Setup
- [x] Create PRD.md with Drizzle SQLite schema, scraped manifest structure, and Service Adapter interfaces
- [x] Create FUTURE_SCOPE.md documenting deferred post-approval production features
- [x] Create TASKS.md checklist

---

## Phase 1: Deterministic Scraping, Asset Mirroring & Database Seeding
- [x] Write and run Playwright crawler `scripts/scrape-inashot.mjs`
  - [x] Scrape `products.json` & `collections.json` from `inashot.life`
  - [x] Capture all products (Chilli Cheese, Peri Peri, Achari, Nimbu Pudina, Magic Masala, Korean Kimchi, Combos)
  - [x] Mirror high-resolution images to `./public/scraped/images/` and record in `assets.json`
  - [x] Intercept & download custom fonts (`.woff2`/`.woff`) and inline SVGs to `./public/scraped/`
  - [x] Extract design tokens (CSS variables, typography, computed styles, keyframes) into `design-tokens.json`
  - [x] Extract segmented DOM sections into `./scraped_manifest/sections/`
- [x] Configure Drizzle ORM + `better-sqlite3` and create `src/lib/db/schema.ts`
- [x] Create seed script `scripts/seed.ts` and initialize `local.db` with products, bundle tiers, collections, reviews, faqs

---

## Phase 2: Storefront & Animation Implementation
- [x] Apply extracted CSS custom properties and fonts into `globals.css` and Tailwind config
- [x] Header, Announcement Bar & Sticky Navigation
  - [x] Top ticker announcement bar with continuous marquee
  - [x] Sticky header with navigation links, "Shop all" dropdown (Combos, Roasted Edamame, Crunchy Edamame, Seed Mix, All), Blogs, FAQ, Contact Us, My Orders, Admin, search drawer, cart counter badge
- [x] Footer
  - [x] Newsletter signup, category links, legal/policy links, verbatim contact & address details
- [x] Homepage (`/`)
  - [x] Hero Carousel with desktop/mobile art direction, slide transitions, and CTAs
  - [x] Clean-Label Marquee / Trust Strip with continuous infinite scroll and exact SVGs
  - [x] "Our Range of Products" Grid with hover image swap, discount badges, strikethrough pricing, "Quick View", and "Add to Cart"
  - [x] Brand Feature Trio (`High Plant Protein`, `High Fiber`, `Light & Crunchy`)
  - [x] "What People Thinks" UGC Review Carousel with 5/5 stars, quotes, handles, and shoppable mini cards
- [x] Collection Pages (`/collections/[handle]`)
  - [x] Category navigation tabs (`All Products`, `Combos`, `Roasted Edamame`, `Crunchy Edamame`, `Seed Mix`)
  - [x] Availability filter bar (`In stock` vs `Out of stock` live count, Reset/Clear All)
  - [x] "Quick View" modal trigger and drawer
- [x] Product Detail Page (`/products/[handle]`)
  - [x] Media gallery with thumbnail selector, badge overlays, and lightbox zoom
  - [x] Macro callout pills (`13G PLANT PROTEIN`, `HIGH IN FIBRE`, `0% SUGAR`)
  - [x] Category-aware tiered bundle switcher (9/18/27 for Roasted Edamame; 8/16/24 for Seed Mix & Crunchy) with dynamic price calculation
  - [x] Accordion tabs: Ingredients, Product FAQs, Nutritional breakdown
  - [x] Sticky Bottom Offer Bar with live 15-minute countdown timer, bundle selector summary, and Add to Cart
- [x] Content Pages
  - [x] Brand Story (`/pages/about-us`): "WE'RE THE SEED PEOPLE" & "THE SEED CYCLING RHYTHM" breakdown
  - [x] FAQ (`/pages/faq`): Category accordions (Hormonal, Diabetic, Seed Cycling, Orders)
  - [x] Contact (`/pages/contact`): Contact details & working SQLite inquiry submission form
  - [x] Blogs & Science Journal (`/blogs`): Clean-label nutrition, 28-day rhythm, and functional snacking articles
- [x] Slide-Out AJAX Cart Drawer (Zustand)
  - [x] Slide-in animation with backdrop blur
  - [x] Dynamic Free Shipping progress threshold bar
  - [x] Quantity steppers, removal, subtotal calculation
  - [x] 1-Click Checkout initiation
- [x] Visual Regression & Parity Verification
  - [x] Headless Playwright screenshot comparisons across Desktop (1440px) and Mobile (390px)
  - [x] Verified zero spacing, font, or color discrepancies

---

## Phase 3: Interactive Client-Showcase Flows & Lightweight Admin
- [x] Service Adapters (`src/services/adapters/`)
  - [x] `PaymentAdapter.createMockOrder()`
  - [x] `ShippingAdapter.getTracking()` & `updateOrderStatus()`
- [x] Simulated 1-Click D2C Checkout Modal
  - [x] Checkout form (Name, Phone, Email, Address, UPI/Card/COD)
  - [x] Order generation (`#INAS-1042`), cart clearing, and animated confirmation view
- [x] Interactive `/my-orders` Order Tracking Page
  - [x] Order lookup by ID or Phone with 1-click quick-demo pills
  - [x] 4-step progress timeline linked to `local.db`
- [x] Client-Showcase `/admin` Dashboard
  - [x] KPI Summary Cards (Total Revenue, Total Orders, Active Products, Out of Stock)
  - [x] Live Order Table with instant status updater dropdown
  - [x] Catalog Quick-Editor to toggle stock status and edit pricing in `local.db`
- [x] Final Build & Validation
  - [x] `npm run build` with zero TypeScript errors
  - [x] Verify complete demo journey
