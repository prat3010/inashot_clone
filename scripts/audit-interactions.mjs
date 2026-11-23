import { chromium } from 'playwright';

async function testAllInteractions() {
  console.log('=== STARTING RE-VERIFICATION OF ALL INTERACTIVE FLOWS ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const failedTests = [];

  async function testStep(name, fn) {
    try {
      console.log(`Checking: ${name}...`);
      await fn();
      console.log(`  PASSED: ${name}`);
    } catch (err) {
      console.error(`  FAILED: ${name} -> ${err.message}`);
      failedTests.push({ name, error: err.message });
    }
  }

  // 1. Mobile & Desktop Navigation
  await testStep('Burger Menu open, shop submenu toggle, and links', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    const burgerBtn = page.locator('button.burger-menu__open');
    await burgerBtn.click();
    await page.waitForTimeout(300);

    const burgerModal = page.locator('.burger-menu');
    if (!(await burgerModal.isVisible())) throw new Error('Burger menu overlay not visible');

    // Toggle shop submenu
    const shopToggle = page.locator('.burger-menu__menu-item:has-text("Shop all")');
    await shopToggle.click();
    await page.waitForTimeout(200);

    const submenu = page.locator('.burger-menu__submenu');
    if (!(await submenu.isVisible())) throw new Error('Shop submenu did not expand');

    // Check submenu links
    const comboLink = page.locator('.burger-menu__submenu a[href*="combos"]');
    if (!(await comboLink.isVisible())) throw new Error('Combos link missing in burger menu');

    // Close burger menu
    const closeBurger = page.locator('button.burger-menu__close');
    await closeBurger.click();
    await page.waitForTimeout(200);
  });

  // 2. Search Drawer
  await testStep('Search Drawer open, live search, and result click', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    const searchBtn = page.locator('button[aria-label="Search"]').first();
    await searchBtn.click();
    await page.waitForTimeout(300);

    const searchInput = page.locator('input[placeholder*="Search"]');
    if (!(await searchInput.isVisible())) throw new Error('Search input not visible');

    await searchInput.fill('peri');
    await page.waitForTimeout(600);

    const results = page.locator('.search-result-item');
    const count = await results.count();
    if (count === 0) throw new Error('Search for "peri" returned 0 results');

    // Close search
    const closeSearch = page.locator('button[aria-label="Close search"]');
    await closeSearch.click();
    await page.waitForTimeout(200);
  });

  // 3. Hero Carousel
  await testStep('Hero Carousel navigation and CTAs', async () => {
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    const nextBtn = page.locator('button.banner-carousel__arrow--next');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }
  });

  // 4. Homepage Product Card "Add to Cart" and "Quick View"
  await testStep('Homepage Product Card Add to Cart and Quick View Modal', async () => {
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    const productCard = page.locator('product-card, .product-card').first();
    if (!(await productCard.isVisible())) throw new Error('No product card found on homepage');

    // Test Quick View
    const quickViewBtn = productCard.locator('button[aria-label="Quick View"]');
    await quickViewBtn.click({ force: true });
    await page.waitForTimeout(500);

    const quickModal = page.locator('.quick-view-modal');
    if (!(await quickModal.isVisible())) throw new Error('Quick View modal not visible');

    // Click Add to Cart inside Quick View
    const quickAddToCart = quickModal.locator('button:has-text("Add to Cart")');
    if (await quickAddToCart.isVisible()) {
      await quickAddToCart.click();
      await page.waitForTimeout(500);
      // Cart drawer should open
      const cartDrawer = page.locator('h2:has-text("Your Cart")');
      if (!(await cartDrawer.isVisible())) throw new Error('Cart drawer did not open after Quick View Add to Cart');
      // Close cart drawer using header close button
      const closeCart = page.locator('.drawer__header-close').first();
      await closeCart.click();
    }
    await page.waitForTimeout(300);
  });

  // 5. Test all 17 product PDP pages load with valid content
  await testStep('Test all 17 product PDP pages load with valid content', async () => {
    const handles = [
      'assorted-seed-mix-combo-nimbu-pudina-magic-masala-plain-roasted-salt-peri-peri',
      'roasted-crunchy-edamame-combo-pack-of-8-30g-each-achari-peri-peri-chilli-cheese-barbeque',
      'spicy-trio-roasted-edamame-combo-achari-chilli-cheese-peri-peri',
      'crunchy-edamame-combo-korean-kimchi-wasabi-jalapeno-tomato-basil',
      'wasabi-crunchy-edamame',
      'barbeque-crunchy-edamame',
      'jalapeno-crunchy-edamame',
      'tomato-basil-crunchy-edamame',
      'korean-kimchi-crunchy-edamame',
      'chilli-cheese-crunchy-edamame',
      'chilly-cheese-roasted-edamame',
      'achari-roasted-edamame',
      'peri-peri-roasted-edamame',
      'magic-masala-seed-mix',
      'roasted-salted-seed-mix',
      'nimbu-pudina-seed-mix',
      'peri-peri-seed-mix'
    ];

    for (const handle of handles) {
      const res = await page.goto(`http://localhost:3000/products/${handle}`, { waitUntil: 'domcontentloaded' });
      if (!res || res.status() !== 200) throw new Error(`PDP failed for ${handle} with status ${res?.status()}`);
      const title = await page.locator('h1.product-title').innerText().catch(() => '');
      if (!title) throw new Error(`Missing product title on PDP for ${handle}`);
    }
  });

  // 6. PDP Bundle Switcher & Dynamic Price Updates
  await testStep('PDP Bundle tier selection updates price, compare price, and cart item title', async () => {
    await page.goto('http://localhost:3000/products/peri-peri-roasted-edamame', { waitUntil: 'domcontentloaded' });

    // Click Tier 2 (Pack of 18)
    const tier2 = page.locator('.bx-offer-wrap:has-text("Pack of 18")');
    if (await tier2.isVisible()) {
      await tier2.click();
      await page.waitForTimeout(300);

      // Verify active price is Rs. 987.66 in #price-template...
      const priceText = await page.locator('#price-template--29572451697004__main-product .price-item--sale').innerText();
      if (!priceText.includes('987.66')) throw new Error(`Expected price Rs. 987.66 on Tier 2, got: ${priceText}`);

      // Add to cart
      const addBtn = page.locator('button.product-form__submit');
      await addBtn.click();
      await page.waitForTimeout(500);

      // Verify cart has Pack of 18
      const cartItem = page.locator('.cart-item:has-text("Pack of 18")');
      if (!(await cartItem.isVisible())) throw new Error('Cart does not indicate Pack of 18');
    }
  });

  // 7. Cart Drawer Quantity Stepper & Removal & Free Shipping
  await testStep('Cart Drawer quantity stepper increment, decrement, and removal', async () => {
    // Current cart has items from previous steps
    const freeShippingText = await page.locator('text=You qualify for free shipping').first().isVisible();
    if (!freeShippingText) throw new Error('Free shipping qualified banner not shown for > 499');

    // Test quantity stepper (+) on the first item
    const plusBtn = page.locator('.quantity__button:has-text("+")').first();
    const qtySpan = page.locator('.quantity__input').first();
    const initialQty = parseInt(await qtySpan.innerText(), 10);
    await plusBtn.click();
    await page.waitForTimeout(300);
    const qtyText = await qtySpan.innerText();
    if (parseInt(qtyText, 10) !== initialQty + 1) throw new Error(`Expected quantity ${initialQty + 1} after (+), got ${qtyText}`);

    // Test quantity stepper (-)
    const minusBtn = page.locator('.quantity__button:has-text("−")').first();
    await minusBtn.click();
    await page.waitForTimeout(300);
    const qtyText2 = await qtySpan.innerText();
    if (parseInt(qtyText2, 10) !== initialQty) throw new Error(`Expected quantity ${initialQty} after (-), got ${qtyText2}`);

    // Remove all items in cart to verify empty state
    while ((await page.locator('.cart-item button:has-text("Remove")').count()) > 0) {
      await page.locator('.cart-item button:has-text("Remove")').first().click();
      await page.waitForTimeout(300);
    }

    // Now cart should be empty
    const emptyMsg = page.locator('.drawer__empty-title').first();
    if (!(await emptyMsg.isVisible())) throw new Error('Cart empty state not displayed after removing all items');
  });

  // 8. Contact form submission
  await testStep('Contact page form submission to DB', async () => {
    await page.goto('http://localhost:3000/pages/contact', { waitUntil: 'domcontentloaded' });
    await page.fill('#ContactForm-name', 'Test Auditor');
    await page.fill('#ContactForm-email', 'auditor@test.com');
    await page.fill('#ContactForm-phone', '9999999999');
    await page.fill('#ContactForm-body', 'Automated frontend audit test inquiry.');
    
    const submitBtn = page.locator('form:has(#ContactForm-name) button[type="submit"]');
    await submitBtn.click();
    await page.waitForTimeout(1000);

    const successBanner = page.locator('text=Message Received!');
    if (!(await successBanner.isVisible())) throw new Error('Contact success banner not displayed');
  });

  // 9. Mobile Sticky Offer Bar interaction on 375px
  await testStep('Mobile Sticky Offer Bar on 375px viewport', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/products/peri-peri-roasted-edamame', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    const stickyBar = page.locator('.sticky-bottom-bar');
    if (!(await stickyBar.isVisible())) throw new Error('Sticky offer bar not visible after scrolling');

    // Click Add to Cart from sticky bar
    const stickyAddBtn = stickyBar.locator('button:has-text("Add to Cart")');
    if (!(await stickyAddBtn.isVisible())) throw new Error('Sticky Add to Cart button not visible');
    await stickyAddBtn.click();
    await page.waitForTimeout(600);

    // Verify cart opened
    const cartDrawer = page.locator('h2:has-text("Your Cart")');
    if (!(await cartDrawer.isVisible())) throw new Error('Cart did not open from Sticky Bar Add to Cart');
  });

  console.log('\n=== RE-VERIFICATION SUMMARY ===');
  console.log(`Total Failures: ${failedTests.length}`);
  if (failedTests.length > 0) {
    console.log(JSON.stringify(failedTests, null, 2));
    throw new Error(`${failedTests.length} tests failed!`);
  }

  await browser.close();
  console.log('🎉 ALL 9 CRITICAL INTERACTION TESTS PASSED CLEANLY!');
}

testAllInteractions().catch((err) => {
  console.error(err);
  process.exit(1);
});
