# TASKS: Granular Implementation Checklist

## Step 0: Documentation & Architecture Setup
- [x] Create PRD.md with Drizzle SQLite schema, scraped manifest structure, and Service Adapter interfaces
- [x] Create FUTURE_SCOPE.md documenting deferred post-approval production features
- [x] Create TASKS.md checklist

---

## Phase 1: Deterministic Scraping, Asset Mirroring & Database Seeding
- [ ] Write and run Playwright crawler `scripts/scrape-inashot.mjs`
  - [ ] Scrape `products.json` & `collections.json` from `inashot.life`
  - [ ] Capture all products (Chilli Cheese, Peri Peri, Achari, Nimbu Pudina, Magic Masala, Korean Kimchi, Combos)
  - [ ] Mirror high-resolution images to `./public/scraped/images/` and record in `assets.json`
  - [ ] Intercept & download custom fonts (`.woff2`/`.woff`) and inline SVGs to `./public/scraped/`
  - [ ] Extract design tokens (CSS variables, typography, computed styles, keyframes) into `design-tokens.json`
  - [ ] Extract segmented DOM sections into `./scraped_manifest/sections/`
- [ ] Configure Drizzle ORM + `better-sqlite3` and create `src/lib/db/schema.ts`
- [ ] Create seed script `scripts/seed.ts` and initialize `local.db` with products, bundle tiers, collections, reviews, faqs

---

## Phase 2: Storefront & Animation Implementation
- [ ] Apply extracted CSS custom properties and fonts into `globals.css` and Tailwind config
- [ ] Header, Announcement Bar & Sticky Navigation
  - [ ] Top ticker announcement bar
  - [ ] Sticky header with navigation links, "Shop all" dropdown, search drawer, cart counter badge
- [ ] Footer
  - [ ] Newsletter signup, category links, legal/policy links, verbatim contact & address details
- [ ] Homepage (`/`)
  - [ ] Hero Carousel with desktop/mobile art direction, slide transitions, and CTAs
  - [ ] Clean-Label Marquee / Trust Strip with continuous infinite scroll and exact SVGs
  - [ ] "Our Range of Products" Grid with hover image swap, discount badges, strikethrough pricing, "Quick View", and "Add to Cart"
  - [ ] Brand Feature Trio (`High Plant Protein`, `High Fiber`, `Light & Crunchy`)
  - [ ] "What People Thinks" UGC Review Carousel with 5/5 stars, quotes, handles, and shoppable mini cards
- [ ] Collection Pages (`/collections/[handle]`)
  - [ ] Category navigation tabs (`All Products`, `Combos`, `Roasted Edamame`, `Crunchy Edamame`, `Seed Mix`)
  - [ ] Availability filter bar (`In stock` vs `Out of stock` live count, Reset/Clear All)
  - [ ] "Quick View" modal trigger and drawer
- [ ] Product Detail Page (`/products/[handle]`)
  - [ ] Media gallery with thumbnail selector, badge overlays, and lightbox zoom
  - [ ] Macro callout pills (`13G PLANT PROTEIN`, `HIGH IN FIBRE`, `0% SUGAR`)
  - [ ] Category-aware tiered bundle switcher (9/18/27 for Roasted Edamame; 8/16/24 for Seed Mix & Crunchy) with dynamic price calculation
  - [ ] Accordion tabs: Ingredients, Product FAQs, Nutritional breakdown
  - [ ] Sticky Bottom Offer Bar with live 15-minute countdown timer, bundle selector summary, and Add to Cart
- [ ] Content Pages
  - [ ] Brand Story (`/pages/about-us`): "WE'RE THE SEED PEOPLE" & "THE SEED CYCLING RHYTHM" breakdown
  - [ ] FAQ (`/pages/faq`): Category accordions (Hormonal, Diabetic, Seed Cycling, Orders)
  - [ ] Contact (`/pages/contact`): Contact details & working SQLite inquiry submission form
- [ ] Slide-Out AJAX Cart Drawer (Zustand)
  - [ ] Slide-in animation with backdrop blur
  - [ ] Dynamic Free Shipping progress threshold bar
  - [ ] Quantity steppers, removal, subtotal calculation
  - [ ] 1-Click Checkout initiation
- [ ] Visual Regression & Parity Verification
  - [ ] Headless Playwright screenshot comparisons across Desktop (1440px) and Mobile (390px)
  - [ ] Fix any visual, spacing, or typographic differences

---

## Phase 3: Interactive Client-Showcase Flows & Lightweight Admin
- [ ] Service Adapters (`src/services/adapters/`)
  - [ ] `PaymentAdapter.createMockOrder()`
  - [ ] `ShippingAdapter.getTracking()` & `updateOrderStatus()`
- [ ] Simulated 1-Click D2C Checkout Modal
  - [ ] Checkout form (Name, Phone, Email, Address, UPI/Card/COD)
  - [ ] Order generation (`#INAS-1042`), cart clearing, and animated confirmation view
- [ ] Interactive `/my-orders` Order Tracking Page
  - [ ] Order lookup by ID or Phone with 1-click quick-demo pills
  - [ ] 4-step progress timeline linked to `local.db`
- [ ] Client-Showcase `/admin` Dashboard
  - [ ] KPI Summary Cards (Total Revenue, Total Orders, Active Products, Out of Stock)
  - [ ] Live Order Table with instant status updater dropdown
  - [ ] Catalog Quick-Editor to toggle stock status and edit pricing in `local.db`
- [ ] Final Build & Validation
  - [ ] `npm run build` with zero TypeScript errors
  - [ ] Verify complete demo journey
