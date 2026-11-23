import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/lib/db/schema';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'local.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

// Ensure tables exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    handle TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    vendor TEXT DEFAULT 'IN''A SHOT',
    category TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    images TEXT NOT NULL,
    tags TEXT NOT NULL,
    badge TEXT,
    price REAL NOT NULL,
    compare_at_price REAL,
    in_stock INTEGER NOT NULL DEFAULT 1,
    grams INTEGER DEFAULT 270,
    macros TEXT,
    faqs TEXT,
    ingredients TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    title TEXT NOT NULL,
    sku TEXT,
    price REAL NOT NULL,
    compare_at_price REAL,
    grams INTEGER,
    available INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS bundle_tiers (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    category TEXT NOT NULL,
    pack_count INTEGER NOT NULL,
    weight_grams INTEGER NOT NULL,
    price REAL NOT NULL,
    compare_at_price REAL,
    discount_percent INTEGER DEFAULT 0,
    badge TEXT,
    is_default INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    handle TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id),
    author_handle TEXT NOT NULL,
    author_name TEXT,
    rating INTEGER NOT NULL DEFAULT 5,
    quote TEXT NOT NULL,
    is_ugc INTEGER DEFAULT 1,
    shoppable_product_id TEXT REFERENCES products(id),
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PAID',
    order_status TEXT NOT NULL DEFAULT 'Order Placed',
    subtotal REAL NOT NULL,
    shipping_fee REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    product_title TEXT NOT NULL,
    variant_title TEXT NOT NULL,
    pack_count INTEGER NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const db = drizzle(sqlite, { schema });

// Clean existing data for fresh deterministic seed
sqlite.exec(`
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM bundle_tiers;
  DELETE FROM product_variants;
  DELETE FROM reviews;
  DELETE FROM faqs;
  DELETE FROM collections;
  DELETE FROM products;
`);

console.log('🌱 Seeding database...');

// Load scraped manifests
const productsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'scraped_manifest', 'products.json'), 'utf8'));
const collectionsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'scraped_manifest', 'collections.json'), 'utf8'));
const assetsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'scraped_manifest', 'assets.json'), 'utf8'));

// Helper to resolve local image
function resolveLocalImage(url: string) {
  if (!url) return '/scraped/images/placeholder.jpg';
  if (assetsJson[url]) return assetsJson[url];
  // Strip params
  const clean = url.replace(/_(\d+x\d*|\d*x\d+|master|grande|compact|medium|small|thumb|pico)(?=\.[a-zA-Z]+(\?|$))/g, '');
  if (assetsJson[clean]) return assetsJson[clean];
  // Find any partial match
  for (const [remote, local] of Object.entries(assetsJson)) {
    if (url.includes(path.basename(remote).split('?')[0])) {
      return local;
    }
  }
  // Default to first downloaded image
  const firstLocal = Object.values(assetsJson)[0] as string;
  return firstLocal || '/scraped/images/default.jpg';
}

// 1. Seed Collections
for (const col of collectionsJson.collections) {
  const localImg = col.image?.src ? resolveLocalImage(col.image.src) : '';
  db.insert(schema.collections).values({
    id: String(col.id),
    handle: col.handle,
    title: col.title,
    description: col.description || '',
    image: localImg,
  }).run();
}
console.log(`✅ Seeded ${collectionsJson.collections.length} collections`);

// 2. Seed Products & Bundle Tiers
for (const prod of productsJson.products) {
  const handle = prod.handle;
  let category = 'roasted-edamame';
  if (handle.includes('combo')) {
    category = 'combo';
  } else if (handle.includes('crunchy')) {
    category = 'crunchy-edamame';
  } else if (handle.includes('seed-mix') || handle.includes('seed')) {
    category = 'seed-mix';
  }

  // Local images
  const images = (prod.images || []).map((img: any) => resolveLocalImage(img.src));
  const featuredImage = images[0] || resolveLocalImage(prod.image?.src);

  // Price & compare price
  const primaryVariant = prod.variants?.[0] || {};
  const price = parseFloat(primaryVariant.price) || 531.0;
  const compareAtPrice = primaryVariant.compare_at_price ? parseFloat(primaryVariant.compare_at_price) : 540.0;

  // Determine badge
  let badge: string | null = null;
  if (compareAtPrice > price) {
    const diff = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    badge = `${diff}% Off!`;
  }
  if (handle.includes('peri-peri-roasted-edamame') || handle.includes('assorted')) {
    badge = '2% Off!';
  }

  // Determine macros
  const macros = category === 'seed-mix'
    ? { protein: '10G PLANT PROTEIN', fiber: '5G HIGH FIBRE', sugar: '0% ADDED SUGAR' }
    : { protein: '13G PLANT PROTEIN', fiber: 'HIGH IN FIBRE', sugar: '0% SUGAR' };

  // Ingredients verbatim
  let ingredients = 'Edamame, Iodised Salt, Edible Vegetable Oil, Natural Flavouring Substances and Spices.';
  if (handle.includes('peri-peri')) {
    ingredients = 'Edamame, Peri Peri Seasoning Spices & Condiments, Iodised Salt, Sugar, Acidity Regulator (INS 330), Anticaking Agent (INS 551), Natural Flavouring Substances and Nature Identical Flavouring Substances, Rice Bran Oil.';
  } else if (handle.includes('chilli') || handle.includes('chilly')) {
    ingredients = 'Edamame, Chilli Cheese Seasoning, Cheese Powder, Red Chilli Powder, Iodised Salt, Maltodextrin, Natural Flavouring Substances, Rice Bran Oil.';
  } else if (handle.includes('achari')) {
    ingredients = 'Edamame, Achari Spices Blend (Mustard, Fenugreek, Fennel, Nigella), Dry Mango Powder, Red Chilli, Iodised Salt, Cold Pressed Mustard Oil.';
  } else if (handle.includes('nimbu-pudina')) {
    ingredients = 'Soyabean, Pumpkin Seeds, Watermelon Seeds, Sunflower Seeds, Flax Seeds, Chia Seeds, Lemon Powder, Dried Mint Leaves, Black Salt, Iodised Salt, Edible Oil.';
  } else if (handle.includes('magic-masala')) {
    ingredients = 'Roasted Soy Nuts, Pumpkin Seeds, Sunflower Seeds, Flax Seeds, Handcrafted Indian Spice Blend, Garam Masala, Amchur, Iodised Salt, Edible Vegetable Oil.';
  } else if (handle.includes('salted')) {
    ingredients = 'Slow Roasted Soy Nuts, Pumpkin Seeds, Watermelon Seeds, Sunflower Seeds, Himalayan Rock Salt, Pure Edible Oil.';
  }

  const inStock = !handle.includes('wasabi'); // mark wasabi as sold out for variety

  db.insert(schema.products).values({
    id: String(prod.id),
    handle: prod.handle,
    title: prod.title,
    description: prod.body_html || `${prod.title} - High protein, clean label functional snacking.`,
    vendor: prod.vendor || "IN'A SHOT",
    category,
    featuredImage,
    images: JSON.stringify(images),
    tags: JSON.stringify(prod.tags ? (typeof prod.tags === 'string' ? prod.tags.split(',').map((t: string) => t.trim()) : prod.tags) : []),
    badge,
    price,
    compareAtPrice,
    inStock,
    grams: category === 'roasted-edamame' ? 270 : 240,
    macros: JSON.stringify(macros),
    faqs: JSON.stringify([
      {
        question: 'What are the ingredients?',
        answer: ingredients
      },
      {
        question: 'What is the shelf life?',
        answer: '6 months from the date of manufacture. Store in a cool, dry place away from direct sunlight.'
      },
      {
        question: 'Is this suitable for seed cycling?',
        answer: 'Yes! Our seed mixes are specifically formulated to align with the Follicular and Luteal phases.'
      }
    ]),
    ingredients,
    createdAt: prod.created_at || new Date().toISOString(),
    updatedAt: prod.updated_at || new Date().toISOString(),
  }).run();

  // Insert variants
  for (const v of (prod.variants || [])) {
    db.insert(schema.productVariants).values({
      id: String(v.id),
      productId: String(prod.id),
      title: v.title,
      sku: v.sku || `INAS-${v.id}`,
      price: parseFloat(v.price) || price,
      compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : compareAtPrice,
      grams: v.grams || 270,
      available: inStock,
    }).run();
  }

  // Insert category-specific bundle tiers
  // Roasted Edamame line: 9 / 18 / 27
  // Seed Mix & Crunchy line: 8 / 16 / 24
  if (category === 'roasted-edamame') {
    // Pack of 9 (270gm, Rs. 531.00)
    db.insert(schema.bundleTiers).values({
      id: `${prod.id}-tier-9`,
      productId: String(prod.id),
      category: 'roasted-edamame',
      packCount: 9,
      weightGrams: 270,
      price: 531.00,
      compareAtPrice: 540.00,
      discountPercent: 0,
      badge: null,
      isDefault: true,
    }).run();

    // Pack of 18 (Save 7%, 540gm, strikethrough Rs. 1,062.00 -> Rs. 987.66 with "Best value" badge)
    db.insert(schema.bundleTiers).values({
      id: `${prod.id}-tier-18`,
      productId: String(prod.id),
      category: 'roasted-edamame',
      packCount: 18,
      weightGrams: 540,
      price: 987.66,
      compareAtPrice: 1062.00,
      discountPercent: 7,
      badge: 'Best value',
      isDefault: false,
    }).run();

    // Pack of 27 (Save 10%, 810gm, strikethrough Rs. 1,593.00 -> Rs. 1,433.70)
    db.insert(schema.bundleTiers).values({
      id: `${prod.id}-tier-27`,
      productId: String(prod.id),
      category: 'roasted-edamame',
      packCount: 27,
      weightGrams: 810,
      price: 1433.70,
      compareAtPrice: 1593.00,
      discountPercent: 10,
      badge: null,
      isDefault: false,
    }).run();
  } else {
    // Pack of 8 (240gm, Rs. 480.00)
    db.insert(schema.bundleTiers).values({
      id: `${prod.id}-tier-8`,
      productId: String(prod.id),
      category: category,
      packCount: 8,
      weightGrams: 240,
      price: category === 'combo' ? 472.00 : 480.00,
      compareAtPrice: 480.00,
      discountPercent: 0,
      badge: null,
      isDefault: true,
    }).run();

    // Pack of 16 (Save 7%, 480gm, Rs. 892.80 with "Best value" badge)
    db.insert(schema.bundleTiers).values({
      id: `${prod.id}-tier-16`,
      productId: String(prod.id),
      category: category,
      packCount: 16,
      weightGrams: 480,
      price: 892.80,
      compareAtPrice: 960.00,
      discountPercent: 7,
      badge: 'Best value',
      isDefault: false,
    }).run();

    // Pack of 24 (Save 10%, 720gm, Rs. 1,296.00)
    db.insert(schema.bundleTiers).values({
      id: `${prod.id}-tier-24`,
      productId: String(prod.id),
      category: category,
      packCount: 24,
      weightGrams: 720,
      price: 1296.00,
      compareAtPrice: 1440.00,
      discountPercent: 10,
      badge: null,
      isDefault: false,
    }).run();
  }
}
console.log(`✅ Seeded ${productsJson.products.length} products with variants and bundle tiers`);

// 3. Seed UGC Reviews with Shoppable Mini Products
const achariProd = productsJson.products.find((p: any) => p.handle.includes('achari'));
const nimbuProd = productsJson.products.find((p: any) => p.handle.includes('nimbu'));
const magicProd = productsJson.products.find((p: any) => p.handle.includes('magic'));
const saltedProd = productsJson.products.find((p: any) => p.handle.includes('salted'));

const ugcReviews = [
  {
    id: 'rev-1',
    authorHandle: '@aashay.mishra01',
    authorName: 'Aashay Mishra',
    rating: 5,
    quote: '"3 YEARS OF GYM & I COULD NEVER FIND A PROTEIN SNACK THAT ACTUALLY TASTED GOOD. 13G PROTEIN, ZERO SUGAR, & THE FLAVOUR HITS SO HARD YOU FORGET YOU\'RE EATING SOMETHING HEALTHY"',
    shoppableProductId: achariProd ? String(achariProd.id) : null,
  },
  {
    id: 'rev-2',
    authorHandle: '@seasonsinyelllow',
    authorName: 'Ana Sultan',
    rating: 5,
    quote: '"I READ ABOUT SEED CYCLING, IN A SHOT MADE IT EFFORTLESS — RIGHT SEEDS, RIGHT PHASE. SIX WEEKS IN, MY MENSTRUAL CYCLE WAS NOTICEABLY SMOOTHER. LESS DISCOMFORT, MORE ENERGY, BETTER MOOD"',
    shoppableProductId: nimbuProd ? String(nimbuProd.id) : null,
  },
  {
    id: 'rev-3',
    authorHandle: '@manish63163',
    authorName: 'Manish Agarwal',
    rating: 5,
    quote: '"FINALLY A HIGH FIBER CRUNCH THAT DOESN\'T TASTE LIKE CARDBOARD. MAGIC MASALA BRINGS BACK STREET-FOOD NOSTALGIA WITH PURE CLEAN-LABEL SATISFACTION."',
    shoppableProductId: magicProd ? String(magicProd.id) : null,
  },
  {
    id: 'rev-4',
    authorHandle: '@rj_r.i.y.a',
    authorName: 'Riya Jain',
    rating: 5,
    quote: '"PORTIONED EXACTLY RIGHT FOR MID-DAY CRAVINGS. I KEEP A PACK IN EVERY BAG. 10G PROTEIN ON THE GO WITHOUT THE ARTIFICIAL AFTERTASTE."',
    shoppableProductId: saltedProd ? String(saltedProd.id) : null,
  },
];

for (const rev of ugcReviews) {
  db.insert(schema.reviews).values(rev).run();
}
console.log(`✅ Seeded ${ugcReviews.length} UGC reviews`);

// 4. Seed FAQs
const faqList = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'WHAT ARE THE INGREDIENTS IN THE SEED MIX?',
    answer: 'Our Seed Mix contains soyabean as the base, seasoned with natural flavour ingredients depending on the variant — for example, lemon powder and mint powder in Nimbu Pudina. All variants use iodised salt and edible oil. No artificial preservatives, no artificial sweeteners, no artificial flavours.',
    sortOrder: 1,
  },
  {
    id: 'faq-2',
    category: 'Nutritional',
    question: 'WHAT ARE THE KEY NUTRIENTS IN THE EDAMAME?',
    answer: 'Per 30g serving, the Edamame gives you: 13g complete plant-based protein (all 9 essential amino acids), high dietary fibre, folate / Vitamin B9 (critical for cell repair, DNA synthesis, especially important for women of reproductive age and during pregnancy), Vitamin K (supports bone health and blood clotting), Vitamin C (boosts immunity and collagen production), iron (supports red blood cell production and energy levels), potassium (regulates blood pressure and supports heart function), isoflavones (plant compounds that support hormonal balance, bone density, and cardiovascular health), omega-6 fatty acids (supports immunity and skin health), and zero added sugar.',
    sortOrder: 2,
  },
  {
    id: 'faq-3',
    category: 'Hormonal & Seed Cycling',
    question: 'WHEN WILL I SEE RESULTS?',
    answer: 'Small shifts in 4–6 weeks. Real changes in 3 months. Hormones take time.',
    sortOrder: 3,
  },
  {
    id: 'faq-4',
    category: 'Hormonal & Seed Cycling',
    question: 'WHAT IF MY PERIODS ARE IRREGULAR (PCOD/ THYROID)?',
    answer: 'Follow the calendar instead of your cycle. Day 1–14 of the month = flax + pumpkin. Day 15–end = sesame + sunflower.',
    sortOrder: 4,
  },
  {
    id: 'faq-5',
    category: 'Diabetic Suitability',
    question: 'IS IN A SHOT SUITABLE FOR DIABETICS?',
    answer: 'Both the seed mix and edamame have a naturally low glycaemic index, meaning they release energy slowly without spiking blood sugar. The high fibre content further slows glucose absorption. The protein improves insulin sensitivity over time. In A Shot can be a genuinely beneficial snack for people managing blood sugar — but please consult your doctor or nutritionist before making dietary changes if you are diabetic.',
    sortOrder: 5,
  },
  {
    id: 'faq-6',
    category: 'Medical',
    question: 'CAN I TAKE THIS WITH MY MEDICATION?',
    answer: 'Generally yes — but if you\'re on thyroid medication, take it at least 1 hour before your seeds, and check with your doctor.',
    sortOrder: 6,
  },
];

for (const f of faqList) {
  db.insert(schema.faqs).values(f).run();
}
console.log(`✅ Seeded ${faqList.length} FAQs`);

// 5. Seed Pre-existing Orders for the Client Pitch Showcase
const periProd = productsJson.products.find((p: any) => p.handle.includes('peri-peri-roasted'));
const firstImg = periProd?.images?.[0]?.src ? resolveLocalImage(periProd.images[0].src) : '/scraped/images/default.jpg';

const demoOrders = [
  {
    id: '#INAS-1042',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'Shipped',
    subtotal: 987.66,
    shippingFee: 0,
    total: 987.66,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    items: [
      {
        id: 'item-1042-1',
        productId: periProd ? String(periProd.id) : 'prod-1',
        productTitle: 'Peri Peri Roasted Edamame',
        variantTitle: 'Pack of 18 (Save 7%)',
        packCount: 18,
        price: 987.66,
        quantity: 1,
        image: firstImg,
      }
    ]
  },
  {
    id: '#INAS-1028',
    customerName: 'Pooja Verma',
    customerEmail: 'pooja.verma@example.com',
    customerPhone: '+91 91234 56789',
    address: 'B-1403, Oberoi Exquisite, Goregaon East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400063',
    paymentMethod: 'Card',
    paymentStatus: 'PAID',
    orderStatus: 'Packed',
    subtotal: 531.00,
    shippingFee: 0,
    total: 531.00,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    items: [
      {
        id: 'item-1028-1',
        productId: achariProd ? String(achariProd.id) : 'prod-2',
        productTitle: 'Achari Roasted Edamame',
        variantTitle: 'Pack of 9',
        packCount: 9,
        price: 531.00,
        quantity: 1,
        image: achariProd?.images?.[0]?.src ? resolveLocalImage(achariProd.images[0].src) : firstImg,
      }
    ]
  },
  {
    id: '#INAS-1015',
    customerName: 'Vikram Malhotra',
    customerEmail: 'vikram.m@example.com',
    customerPhone: '+91 99887 76655',
    address: 'Plot 45, Sector 15, Golf Links',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'Order Placed',
    subtotal: 480.00,
    shippingFee: 0,
    total: 480.00,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    items: [
      {
        id: 'item-1015-1',
        productId: nimbuProd ? String(nimbuProd.id) : 'prod-3',
        productTitle: 'Nimbu Pudina Seed Mix',
        variantTitle: 'Pack of 8',
        packCount: 8,
        price: 480.00,
        quantity: 1,
        image: nimbuProd?.images?.[0]?.src ? resolveLocalImage(nimbuProd.images[0].src) : firstImg,
      }
    ]
  }
];

for (const ord of demoOrders) {
  const { items, ...orderData } = ord;
  db.insert(schema.orders).values(orderData).run();
  for (const item of items) {
    db.insert(schema.orderItems).values({
      ...item,
      orderId: ord.id,
    }).run();
  }
}
console.log(`✅ Seeded ${demoOrders.length} showcase demo orders`);

console.log('🎉 Database seeding complete! local.db is ready.');
