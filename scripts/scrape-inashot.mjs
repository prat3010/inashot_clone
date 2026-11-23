import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MANIFEST_DIR = path.join(rootDir, 'scraped_manifest');
const SECTIONS_DIR = path.join(MANIFEST_DIR, 'sections');
const IMAGES_DIR = path.join(rootDir, 'public', 'scraped', 'images');
const FONTS_DIR = path.join(rootDir, 'public', 'scraped', 'fonts');
const ICONS_DIR = path.join(rootDir, 'public', 'scraped', 'icons');
const SCREENSHOTS_DIR = path.join(rootDir, 'public', 'scraped', 'screenshots');

[MANIFEST_DIR, SECTIONS_DIR, IMAGES_DIR, FONTS_DIR, ICONS_DIR, SCREENSHOTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const BASE_URL = 'https://www.inashot.life';

// Clean image URL to get full-res
function cleanImageUrl(url) {
  if (!url) return null;
  let clean = url.trim();
  if (clean.startsWith('//')) clean = 'https:' + clean;
  // Remove Shopify resizing patterns like _300x, _400x, _720x, _1080x, _small, _medium, _large, etc.
  clean = clean.replace(/_(\d+x\d*|\d*x\d+|master|grande|compact|medium|small|thumb|pico)(?=\.[a-zA-Z]+(\?|$))/g, '');
  return clean;
}

// Download asset helper with timeout
async function downloadAsset(url, destPath) {
  try {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return true;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    return false;
  }
}

async function scrape() {
  console.log('🚀 Launching Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // Intercept fonts & media
  const interceptedFonts = new Set();
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.woff2') || url.includes('.woff')) {
      const fontName = path.basename(url.split('?')[0]);
      const fontPath = path.join(FONTS_DIR, fontName);
      if (!interceptedFonts.has(fontName)) {
        interceptedFonts.add(fontName);
        try {
          const buffer = await response.body();
          fs.writeFileSync(fontPath, buffer);
          console.log(`Saved font: ${fontName}`);
        } catch (e) {
          // Ignore
        }
      }
    }
  });

  console.log('📡 Navigating to https://www.inashot.life...');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Fetch products.json & collections.json via browser context
  console.log('📦 Ingesting products.json & collections.json via browser context...');
  let productsData = null;
  let collectionsData = null;

  try {
    productsData = await page.evaluate(async () => {
      const res = await fetch('/products.json?limit=250');
      if (res.ok) return await res.json();
      return null;
    });
  } catch (e) {
    console.warn('Failed to fetch /products.json directly from page:', e.message);
  }

  if (productsData && productsData.products) {
    console.log(`✅ Fetched ${productsData.products.length} products from /products.json`);
    fs.writeFileSync(path.join(MANIFEST_DIR, 'products.json'), JSON.stringify(productsData, null, 2));
  } else {
    console.warn('⚠️ Could not fetch products.json directly, fallback scraping will run');
  }

  try {
    collectionsData = await page.evaluate(async () => {
      const res = await fetch('/collections.json');
      if (res.ok) return await res.json();
      return null;
    });
  } catch (e) {
    console.warn('Failed to fetch /collections.json directly from page:', e.message);
  }

  if (collectionsData && collectionsData.collections) {
    console.log(`✅ Fetched ${collectionsData.collections.length} collections from /collections.json`);
    fs.writeFileSync(path.join(MANIFEST_DIR, 'collections.json'), JSON.stringify(collectionsData, null, 2));
  }

  // 2. Extract Design Tokens
  console.log('🎨 Extracting design tokens...');
  const designTokens = await page.evaluate(() => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);

    const cssVars = {};
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j];
          if (rule.selectorText === ':root') {
            for (let k = 0; k < rule.style.length; k++) {
              const name = rule.style[k];
              if (name.startsWith('--')) {
                cssVars[name] = rule.style.getPropertyValue(name).trim();
              }
            }
          }
        }
      } catch (e) {
        // CORS stylesheets ignored
      }
    }

    const keyframes = {};
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j];
          if (rule.type === CSSRule.KEYFRAMES_RULE) {
            keyframes[rule.name] = rule.cssText;
          }
        }
      } catch (e) {}
    }

    const getElementComputed = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
        backgroundColor: s.backgroundColor,
        borderRadius: s.borderRadius,
        padding: s.padding,
        margin: s.margin
      };
    };

    return {
      cssVariables: cssVars,
      keyframes,
      body: {
        fontFamily: bodyStyles.fontFamily,
        fontSize: bodyStyles.fontSize,
        backgroundColor: bodyStyles.backgroundColor,
        color: bodyStyles.color
      },
      headings: {
        h1: getElementComputed('h1'),
        h2: getElementComputed('h2'),
        h3: getElementComputed('h3'),
        h4: getElementComputed('h4')
      },
      button: getElementComputed('button, .button, .btn'),
      announcementBar: getElementComputed('.announcement-bar, [class*="announcement"]')
    };
  });

  fs.writeFileSync(path.join(MANIFEST_DIR, 'design-tokens.json'), JSON.stringify(designTokens, null, 2));
  console.log('✅ Saved design-tokens.json');

  // Core pages to crawl
  const routes = [
    { name: 'index', path: '/' },
    { name: 'collection-all', path: '/collections/all' },
    { name: 'collection-nuts', path: '/collections/nuts' },
    { name: 'collection-edamame', path: '/collections/edamame' },
    { name: 'product-peri-peri', path: '/products/peri-peri-roasted-edamame' },
    { name: 'about-us', path: '/pages/about-us' },
    { name: 'faq', path: '/pages/faq' },
    { name: 'contact', path: '/pages/contact' }
  ];

  const assetMap = {};
  const allImageUrls = new Set();
  const allSvgIcons = new Map();

  for (const route of routes) {
    console.log(`🔍 Crawling ${route.name} (${route.path})...`);
    await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    // Save full-page screenshot of live site for visual comparison
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `live-1440-${route.name}.png`),
      fullPage: false
    });

    // Mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `live-390-${route.name}.png`),
      fullPage: false
    });
    await page.setViewportSize({ width: 1440, height: 900 });

    // Segment DOM by <section id="shopify-section-...">
    const sections = await page.evaluate(() => {
      const result = [];
      const sectionElements = document.querySelectorAll('[id^="shopify-section-"], section, header, footer');
      sectionElements.forEach((el, index) => {
        const id = el.id || `section-${index}`;
        const className = el.className;
        const tagName = el.tagName.toLowerCase();
        const textContent = el.innerText ? el.innerText.trim().slice(0, 500) : '';

        // Extract img tags inside this section
        const imgs = Array.from(el.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt || '',
          datasetSrc: img.dataset.src || '',
          srcset: img.srcset || ''
        }));

        // Extract svg inside this section
        const svgs = Array.from(el.querySelectorAll('svg')).map(svg => ({
          html: svg.outerHTML,
          className: svg.getAttribute('class') || '',
          ariaLabel: svg.getAttribute('aria-label') || ''
        }));

        // Extract headings & copy
        const headings = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button')).map(t => ({
          tag: t.tagName.toLowerCase(),
          text: t.innerText ? t.innerText.trim() : '',
          href: t.getAttribute('href') || null
        })).filter(item => item.text.length > 0);

        result.push({
          id,
          tagName,
          className,
          previewText: textContent,
          images: imgs,
          svgsCount: svgs.length,
          headings,
          innerHtmlPreview: el.innerHTML.slice(0, 2000)
        });
      });
      return result;
    });

    fs.writeFileSync(path.join(SECTIONS_DIR, `${route.name}.json`), JSON.stringify(sections, null, 2));

    // Extract all images on this page
    const pageImages = await page.evaluate(() => {
      const urls = [];
      document.querySelectorAll('img, [style*="background-image"]').forEach(el => {
        if (el.tagName === 'IMG' && el.src) urls.push(el.src);
        if (el.dataset.src) urls.push(el.dataset.src);
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg.startsWith('url(')) {
          const cleanBg = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
          if (cleanBg.startsWith('http') || cleanBg.startsWith('//')) urls.push(cleanBg);
        }
      });
      return urls;
    });

    pageImages.forEach(u => {
      const clean = cleanImageUrl(u);
      if (clean && clean.startsWith('http')) allImageUrls.add(clean);
    });

    // Extract all SVGs
    const pageSvgs = await page.evaluate(() => {
      const svgs = [];
      document.querySelectorAll('svg').forEach((svg, idx) => {
        svgs.push({
          name: svg.getAttribute('class') || `icon-${idx}`,
          html: svg.outerHTML
        });
      });
      return svgs;
    });

    pageSvgs.forEach((svg, idx) => {
      const safeName = `icon-${route.name}-${idx}.svg`;
      if (!allSvgIcons.has(safeName)) {
        allSvgIcons.set(safeName, svg.html);
      }
    });
  }

  // Also extract product images from productsData
  if (productsData && productsData.products) {
    for (const prod of productsData.products) {
      if (prod.images) {
        for (const img of prod.images) {
          const clean = cleanImageUrl(img.src);
          if (clean && clean.startsWith('http')) allImageUrls.add(clean);
        }
      }
    }
  }

  // Save all SVGs to ICONS_DIR
  console.log(`💾 Saving ${allSvgIcons.size} extracted SVGs...`);
  for (const [iconName, iconHtml] of allSvgIcons.entries()) {
    fs.writeFileSync(path.join(ICONS_DIR, iconName), iconHtml);
  }

  // Download all images locally in concurrent batches
  console.log(`📥 Downloading ${allImageUrls.size} images locally in batches...`);
  const imageUrlArray = Array.from(allImageUrls);
  const BATCH_SIZE = 15;
  for (let i = 0; i < imageUrlArray.length; i += BATCH_SIZE) {
    const chunk = imageUrlArray.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map(async (imgUrl, batchIdx) => {
        try {
          const urlObj = new URL(imgUrl);
          const ext = path.extname(urlObj.pathname) || '.jpg';
          const baseRaw = path.basename(urlObj.pathname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
          const globalIdx = i + batchIdx;
          const filename = `${baseRaw.slice(0, 40)}_${globalIdx}${ext}`;
          const destPath = path.join(IMAGES_DIR, filename);

          const success = await downloadAsset(imgUrl, destPath);
          if (success) {
            assetMap[imgUrl] = `/scraped/images/${filename}`;
          }
        } catch (e) {
          // ignore error
        }
      })
    );
    process.stdout.write(`Downloaded batch ${Math.min(i + BATCH_SIZE, imageUrlArray.length)}/${imageUrlArray.length}\r`);
  }
  console.log('\n✅ All image downloads finished!');

  fs.writeFileSync(path.join(MANIFEST_DIR, 'assets.json'), JSON.stringify(assetMap, null, 2));
  console.log(`✅ Asset map written to assets.json with ${Object.keys(assetMap).length} mapped assets`);

  await browser.close();
  console.log('🎉 Scraping complete!');
}

scrape().catch(err => {
  console.error('Fatal scraping error:', err);
  process.exit(1);
});
