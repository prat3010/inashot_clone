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

const COMPARISONS = [
  { name: 'home', livePath: '', localPath: '' },
  { name: 'nuts', livePath: '/collections/nuts', localPath: '/collections/nuts' },
  { name: 'product', livePath: '/products/peri-peri-roasted-edamame', localPath: '/products/peri-peri-roasted-edamame' },
  { name: 'about', livePath: '/pages/about-us', localPath: '/pages/about-us' },
  { name: 'faq', livePath: '/pages/faq', localPath: '/pages/faq' }
];

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
];

async function runDiff() {
  console.log('🚀 Launching visual diff loop with Playwright...');
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n📐 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const liveContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name === '390'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const localContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name === '390'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    const livePage = await liveContext.newPage();
    const localPage = await localContext.newPage();

    for (const item of COMPARISONS) {
      const liveUrl = `https://www.inashot.life${item.livePath}`;
      const localUrl = `http://localhost:3000${item.localPath}`;

      console.log(`\n  Comparing ${item.name}:`);
      console.log(`    Live:  ${liveUrl}`);
      console.log(`    Local: ${localUrl}`);

      try {
        await livePage.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await livePage.waitForTimeout(2000);
        await livePage.screenshot({
          path: path.join(SCREENSHOTS_DIR, `diff-live-${vp.name}-${item.name}.png`),
          fullPage: false
        });
      } catch (e) {
        console.warn(`    ⚠️ Failed to capture live screenshot for ${item.name}:`, e.message);
      }

      try {
        await localPage.goto(localUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await localPage.waitForTimeout(2000);
        await localPage.screenshot({
          path: path.join(SCREENSHOTS_DIR, `diff-local-${vp.name}-${item.name}.png`),
          fullPage: false
        });
      } catch (e) {
        console.warn(`    ⚠️ Failed to capture local screenshot for ${item.name}:`, e.message);
      }
    }

    // Section-by-section captures on Home Desktop
    if (vp.name === '1440') {
      console.log('\n  Capturing section-by-section comparison on Home Desktop...');
      await localPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await localPage.waitForTimeout(1000);

      const sections = [
        { name: 'banner-carousel', selector: '.banner-carousel' },
        { name: 'ticker-banner', selector: '.ticker-banner-section' },
        { name: 'popular-products', selector: '.popular-products-section' },
        { name: 'brand-trio', selector: '.image-with-text-section' },
        { name: 'parallax', selector: '.section-image-parallax-with-text' },
        { name: 'testimonials', selector: '.testimonials-section' },
        { name: 'lifestyle-carousel', selector: '.image-carousel-section' },
        { name: 'social-media', selector: '.social-media-section' },
        { name: 'footer', selector: '.footer' }
      ];

      for (const sec of sections) {
        try {
          const el = localPage.locator(sec.selector).first();
          if (await el.isVisible()) {
            await el.screenshot({
              path: path.join(SCREENSHOTS_DIR, `diff-section-${sec.name}.png`)
            });
            console.log(`    ✓ Captured section: ${sec.name}`);
          }
        } catch (e) {
          console.warn(`    ⚠️ Could not capture section ${sec.name}:`, e.message);
        }
      }
    }

    await liveContext.close();
    await localContext.close();
  }

  await browser.close();
  console.log('\n🎉 Visual diff screenshots saved in public/scraped/screenshots/');
}

runDiff().catch(err => {
  console.error('Visual diff failed:', err);
  process.exit(1);
});
