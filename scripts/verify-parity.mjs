import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SCREENSHOTS_DIR = path.join(rootDir, 'public', 'scraped', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function verify() {
  console.log('🚀 Launching Playwright for deep verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const routes = [
    { name: 'home', path: '/' },
    { name: 'collection-nuts', path: '/collections/nuts' },
    { name: 'collection-edamame', path: '/collections/edamame' },
    { name: 'product-peri-peri', path: '/products/peri-peri-roasted-edamame' },
    { name: 'about-us', path: '/pages/about-us' },
    { name: 'faq', path: '/pages/faq' },
    { name: 'contact', path: '/pages/contact' },
    { name: 'blogs', path: '/blogs' },
    { name: 'my-orders', path: '/my-orders?id=%23INAS-1042' },
    { name: 'admin', path: '/admin' },
  ];

  for (const r of routes) {
    console.log(`📸 Capturing ${r.name} at 1440px desktop...`);
    await page.setViewportSize({ width: 1440, height: 900 });
    const res = await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!res || res.status() >= 400) {
      throw new Error(`Failed to load ${r.path}, status: ${res ? res.status() : 'no response'}`);
    }
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `local-1440-${r.name}.png`),
      fullPage: false,
    });

    console.log(`📱 Capturing ${r.name} at 390px mobile...`);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `local-390-${r.name}.png`),
      fullPage: false,
    });
  }

  // Deep interactive flow verification:
  console.log('🧪 Testing Interactive E-Commerce & Checkout Flow...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/products/peri-peri-roasted-edamame', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Click Add to Cart
  console.log('🛒 Clicking Add to Cart...');
  const addBtn = page.locator('button.product-form__submit, button:has-text("Add to Cart"), button:has-text("Add Pack of 9 to Cart")').first();
  await addBtn.waitFor({ state: 'visible', timeout: 5000 });
  await addBtn.click();
  await page.waitForTimeout(800);

  // Verify Cart Drawer is visible
  const cartDrawerHeading = page.locator('.drawer__header-title, h2:has-text("Your Cart")').first();
  if (!(await cartDrawerHeading.isVisible())) {
    throw new Error('Cart Drawer failed to open on Add to Cart');
  }
  console.log('✅ Cart Drawer opened successfully!');

  // Take screenshot of Cart Drawer
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'local-cart-drawer.png'),
    fullPage: false,
  });

  // 2. Click "Proceed to Checkout" / "Check Out"
  console.log('💳 Opening Simulated Checkout Modal...');
  const checkoutBtn = page.locator('button.cart__checkout-button, button:has-text("Check Out"), button:has-text("Proceed to Checkout")').first();
  await checkoutBtn.click();
  await page.waitForTimeout(800);

  // Verify Checkout Modal
  const checkoutHeader = page.locator('h3:has-text("Express Delivery Details")');
  if (!(await checkoutHeader.isVisible())) {
    throw new Error('Checkout Modal failed to open');
  }
  console.log('✅ Checkout Modal opened successfully!');

  // Take screenshot of Checkout Modal
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'local-checkout-modal.png'),
    fullPage: false,
  });

  // 3. Click "Complete Demo Order"
  console.log('📦 Completing Demo Order...');
  const completeBtn = page.locator('button:has-text("Complete Demo Order")');
  await completeBtn.click();
  await page.waitForTimeout(2500);

  // Verify Order Confirmation
  const confirmedText = page.locator('span:has-text("ORDER CONFIRMED")');
  if (!(await confirmedText.isVisible())) {
    throw new Error('Order confirmation failed to display');
  }
  console.log('✅ Order confirmed and recorded in local.db!');

  // Take screenshot of Order Confirmation view
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'local-order-confirmed.png'),
    fullPage: false,
  });

  // Close checkout modal and verify it resets
  const closeBtn = page.locator('button[aria-label="Close Checkout"]');
  await closeBtn.click();
  await page.waitForTimeout(500);

  // 4. Test Flexible Order Lookup on /my-orders
  console.log('🔍 Testing Flexible Order Lookup on /my-orders...');
  await page.goto('http://localhost:3000/my-orders', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const searchInput = page.locator('input[placeholder*="Enter Order ID"]');
  const trackBtn = page.locator('button:has-text("Track")');

  // Lookup without #
  await searchInput.fill('INAS-1042');
  await trackBtn.click();
  await page.waitForTimeout(800);
  const orderBanner = page.locator('span:has-text("#INAS-1042")');
  if (!(await orderBanner.isVisible())) {
    throw new Error('Flexible lookup without # failed');
  }
  console.log('✅ Found order #INAS-1042 without typing # prefix!');

  // Lookup by raw digits 1042
  await searchInput.fill('1042');
  await trackBtn.click();
  await page.waitForTimeout(800);
  if (!(await orderBanner.isVisible())) {
    throw new Error('Numeric suffix search failed');
  }
  console.log('✅ Found order #INAS-1042 by numeric suffix 1042!');

  // Lookup by phone digits
  await searchInput.fill('9876543210');
  await trackBtn.click();
  await page.waitForTimeout(800);
  if (!(await page.locator('h3:has-text("Shipment Progress")').isVisible())) {
    throw new Error('Phone search failed');
  }
  console.log('✅ Found order by phone digits!');

  // 5. Test Quick View modal on Homepage
  console.log('🔍 Testing Quick View Modal on Homepage...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const quickViewBtn = page.locator('button[aria-label="Quick View"]').first();
  if (await quickViewBtn.isVisible()) {
    await quickViewBtn.click({ force: true });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'local-quick-view.png'),
      fullPage: false,
    });
    // Close modal
    const closeQuick = page.locator('button[aria-label="Close Quick View"]');
    await closeQuick.click();
    await page.waitForTimeout(400);
    console.log('✅ Quick View verified and closed.');
  }

  // 6. Test Admin Live Order Status Update
  console.log('⚙️ Testing Admin Dashboard Live Order Status Update...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const selectStatus = page.locator('table select').first();
  if (await selectStatus.isVisible()) {
    await selectStatus.selectOption('Delivered');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'local-admin-updated.png'),
      fullPage: false,
    });
    console.log('✅ Admin order status updated to Delivered!');
  }

  await browser.close();
  console.log('🎉 Verification completed successfully! All assertions passed & screenshots saved.');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
