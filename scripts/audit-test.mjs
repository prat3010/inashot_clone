import { chromium } from 'playwright';

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE AUDIT ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({ url: page.url(), text: msg.text() });
    }
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push({ url: resp.url(), status: resp.status(), page: page.url() });
    }
  });

  const routes = [
    '/',
    '/collections/all',
    '/collections/combos',
    '/collections/roasted-edamame',
    '/collections/crunchy-edamame',
    '/collections/seed-mix',
    '/collections/nuts',
    '/collections/edamame',
    '/products/peri-peri-roasted-edamame',
    '/products/assorted-seed-mix-combo-nimbu-pudina-magic-masala-plain-roasted-salt-peri-peri',
    '/products/chilly-cheese-roasted-edamame',
    '/products/wasabi-crunchy-edamame',
    '/pages/about-us',
    '/pages/faq',
    '/pages/contact',
    '/blogs',
    '/policies/shipping-policy',
    '/policies/refund-policy',
    '/policies/privacy-policy',
    '/policies/terms-of-service',
    '/my-orders',
    '/admin'
  ];

  const viewports = [
    { name: 'Mobile 375px', width: 375, height: 667 },
    { name: 'Mobile 390px', width: 390, height: 844 },
    { name: 'Tablet 768px', width: 768, height: 1024 },
    { name: 'Desktop 1440px', width: 1440, height: 900 },
    { name: 'Ultra-wide 2560px', width: 2560, height: 1440 },
  ];

  const overflowIssues = [];
  const brokenImages = [];

  for (const route of routes) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const res = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(e => {
        console.error(`Failed to load ${route} at ${vp.name}: ${e.message}`);
        return null;
      });

      if (!res) continue;

      // Check overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        return {
          docWidth,
          winWidth,
          bodyWidth,
          hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
        };
      });

      if (overflow.hasOverflow) {
        overflowIssues.push({
          route,
          viewport: vp.name,
          docWidth: overflow.docWidth,
          winWidth: overflow.winWidth,
          bodyWidth: overflow.bodyWidth,
        });
      }

      // Check broken images on desktop and mobile
      if (vp.name === 'Desktop 1440px') {
        const imgs = await page.evaluate(() => {
          const allImgs = Array.from(document.querySelectorAll('img'));
          return allImgs.map(img => ({
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            displayedWidth: img.clientWidth,
            displayedHeight: img.clientHeight,
          })).filter(img => img.naturalWidth === 0 && !img.src.startsWith('data:'));
        });
        if (imgs.length > 0) {
          brokenImages.push({ route, broken: imgs });
        }
      }
    }
  }

  console.log('\n--- OVERFLOW ISSUES ---');
  console.log(JSON.stringify(overflowIssues, null, 2));

  console.log('\n--- BROKEN IMAGES ---');
  console.log(JSON.stringify(brokenImages, null, 2));

  console.log('\n--- CONSOLE ERRORS ---');
  console.log(JSON.stringify(consoleErrors, null, 2));

  console.log('\n--- NETWORK ERRORS ---');
  console.log(JSON.stringify(networkErrors, null, 2));

  await browser.close();
}

runAudit().catch(console.error);
