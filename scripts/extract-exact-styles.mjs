import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EXACT_SECTIONS_DIR = path.join(rootDir, 'scraped_manifest', 'exact_sections');
const STYLES_DIR = path.join(rootDir, 'src', 'styles');
const FONTS_DIR = path.join(rootDir, 'public', 'scraped', 'fonts');
const IMAGES_DIR = path.join(rootDir, 'public', 'scraped', 'images');
const ICONS_DIR = path.join(rootDir, 'public', 'scraped', 'icons');

[EXACT_SECTIONS_DIR, STYLES_DIR, FONTS_DIR, IMAGES_DIR, ICONS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const TARGET_PAGES = [
  { url: 'https://www.inashot.life', name: 'home' },
  { url: 'https://www.inashot.life/collections/nuts', name: 'collection-nuts' },
  { url: 'https://www.inashot.life/products/peri-peri-roasted-edamame', name: 'product-peri-peri' },
  { url: 'https://www.inashot.life/pages/about-us', name: 'about-us' },
  { url: 'https://www.inashot.life/pages/faq', name: 'faq' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

// Helper to download remote asset
async function downloadAsset(url, destPath) {
  try {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return true;
    }
    const fullUrl = url.startsWith('//') ? 'https:' + url : url;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.warn(`Failed to download ${url}: ${err.message}`);
    return false;
  }
}

// Rewrite external cdn.shopify.com font/image URLs to local /scraped/...
async function rewriteAndDownloadUrls(cssText) {
  const urlRegex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  const matches = [...cssText.matchAll(urlRegex)];
  let rewritten = cssText;

  for (const match of matches) {
    const rawUrl = match[1].trim();
    if (rawUrl.startsWith('data:')) continue;
    if (rawUrl.startsWith('/scraped/')) continue;

    let absoluteUrl = rawUrl;
    if (absoluteUrl.startsWith('//')) {
      absoluteUrl = 'https:' + absoluteUrl;
    } else if (absoluteUrl.startsWith('/')) {
      absoluteUrl = 'https://www.inashot.life' + absoluteUrl;
    }

    if (absoluteUrl.includes('cdn.shopify.com') || absoluteUrl.includes('inashot.life') || absoluteUrl.includes('typekit.net')) {
      try {
        const parsedUrl = new URL(absoluteUrl);
        const cleanName = path.basename(parsedUrl.pathname).replace(/[?#].*$/, '');
        const ext = path.extname(cleanName).toLowerCase();

        let localPath = '';
        let localDest = '';

        if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
          localPath = `/scraped/fonts/${cleanName}`;
          localDest = path.join(FONTS_DIR, cleanName);
        } else if (['.svg'].includes(ext)) {
          localPath = `/scraped/icons/${cleanName}`;
          localDest = path.join(ICONS_DIR, cleanName);
        } else if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'].includes(ext)) {
          localPath = `/scraped/images/${cleanName}`;
          localDest = path.join(IMAGES_DIR, cleanName);
        }

        if (localPath && localDest) {
          await downloadAsset(absoluteUrl, localDest);
          // Replace rawUrl in CSS
          rewritten = rewritten.replaceAll(rawUrl, localPath);
        }
      } catch (e) {
        // Ignore invalid URL
      }
    }
  }

  return rewritten;
}

// Extract keyframes, font-face, root variables from raw CSS
function extractAtRulesAndRoots(css) {
  const extracted = [];

  // Match @font-face blocks
  const fontFaceRegex = /@font-face\s*\{[^}]*\}/gis;
  for (const m of css.match(fontFaceRegex) || []) {
    extracted.push(m);
  }

  // Match @keyframes blocks (handles nested braces)
  const keyframeRegex = /@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*\s*\}/gis;
  for (const m of css.match(keyframeRegex) || []) {
    extracted.push(m);
  }

  // Match :root blocks
  const rootRegex = /:root\s*\{[^}]*\}/gis;
  for (const m of css.match(rootRegex) || []) {
    extracted.push(m);
  }

  return extracted;
}

async function run() {
  console.log('🚀 Starting extraction of exact Shopify CSS and section HTML...');
  const browser = await chromium.launch({ headless: true });

  const collectedInlineStyles = new Set();
  const collectedStylesheets = new Map(); // url -> content
  const coverageSnippets = new Set();
  const savedSections = new Set();
  const sectionManifest = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 Setting up context for ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name === 'mobile'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Listen for all stylesheet responses
    page.on('response', async (response) => {
      const url = response.url();
      if (response.request().resourceType() === 'stylesheet' || url.includes('.css')) {
        try {
          if (!collectedStylesheets.has(url)) {
            const text = await response.text();
            collectedStylesheets.set(url, text);
            console.log(`  [CSS] Intercepted stylesheet: ${url.slice(0, 80)}...`);
          }
        } catch (e) {
          // ignore
        }
      }
    });

    for (const target of TARGET_PAGES) {
      console.log(`  🌐 Navigating to ${target.name}: ${target.url}...`);
      await page.coverage.startCSSCoverage({ resetOnNavigation: false });

      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);

      // Scroll slowly through the entire page to trigger lazy loading, Swiper, animations
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 80);
        });
      });

      await page.waitForTimeout(1500);

      // Extract inline <style> elements directly
      const inlineStyles = await page.evaluate(() => {
        const styles = Array.from(document.querySelectorAll('style'));
        return styles.map(s => s.innerHTML).filter(Boolean);
      });
      for (const s of inlineStyles) {
        collectedInlineStyles.add(s);
      }

      // Extract exact outerHTML of each shopify section
      const sections = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('[id^="shopify-section-"]'));
        return elements.map(el => ({
          id: el.id,
          tagName: el.tagName.toLowerCase(),
          className: el.className,
          outerHTML: el.outerHTML
        }));
      });

      for (const sec of sections) {
        const fileName = `${sec.id}.html`;
        const filePath = path.join(EXACT_SECTIONS_DIR, fileName);
        if (!savedSections.has(sec.id)) {
          savedSections.add(sec.id);
          fs.writeFileSync(filePath, sec.outerHTML, 'utf8');
          sectionManifest.push({
            id: sec.id,
            page: target.name,
            viewport: vp.name,
            fileName,
            className: sec.className,
            length: sec.outerHTML.length
          });
          console.log(`  📦 Saved exact section: ${sec.id} (${(sec.outerHTML.length / 1024).toFixed(1)} KB)`);
        }
      }

      // Stop coverage for this page
      const coverage = await page.coverage.stopCSSCoverage();
      for (const entry of coverage) {
        // Collect used rules
        for (const range of entry.ranges) {
          const usedSlice = entry.text.slice(range.start, range.end).trim();
          if (usedSlice) {
            coverageSnippets.add(usedSlice);
          }
        }
        // Also ensure full stylesheet text is retained
        if (!collectedStylesheets.has(entry.url) && entry.text) {
          collectedStylesheets.set(entry.url, entry.text);
        }
      }
    }

    await context.close();
  }

  await browser.close();

  // Save section manifest
  fs.writeFileSync(
    path.join(rootDir, 'scraped_manifest', 'exact_sections_manifest.json'),
    JSON.stringify(sectionManifest, null, 2),
    'utf8'
  );
  console.log(`\n✅ Saved ${savedSections.size} unique exact sections into ./scraped_manifest/exact_sections/`);

  // Assemble shopify-exact.css
  console.log('\n🎨 Compiling src/styles/shopify-exact.css...');
  const combinedCssParts = [];

  // Header comment
  combinedCssParts.push(`/* =========================================================================
 * SHOPIFY EXACT STYLES (DAWN / OS 2.0 VERBATIM EXTRACT)
 * Sourced from https://www.inashot.life
 * Includes root CSS variables, typography, component rules, keyframes & media queries
 * ========================================================================= */\n`);

  // 1. Critical Root Variables & Color Schemes from inline styles
  combinedCssParts.push('/* --- ROOT VARIABLES & COLOR SCHEMES --- */');
  for (const style of collectedInlineStyles) {
    if (style.includes(':root') || style.includes('--color-') || style.includes('color-scheme-') || style.includes('@font-face')) {
      combinedCssParts.push(style.trim());
    }
  }

  // 2. Full stylesheets captured (base.css, swiper, components)
  // These contain complete classes, hover states, transitions, flex/grid layouts
  combinedCssParts.push('\n/* --- COMPLETE SHOPIFY COMPONENT STYLESHEETS --- */');
  for (const [url, css] of collectedStylesheets.entries()) {
    if (!css || css.trim().length === 0) continue;
    const cleanUrl = url.split('?')[0];
    combinedCssParts.push(`\n/* Sourced from: ${cleanUrl} */\n${css.trim()}`);
  }

  // 3. Section inline style blocks
  combinedCssParts.push('\n/* --- SECTION INLINE STYLES --- */');
  for (const style of collectedInlineStyles) {
    if (!style.includes(':root') && !style.includes('--color-')) {
      combinedCssParts.push(style.trim());
    }
  }

  let rawCombinedCss = combinedCssParts.join('\n\n');

  // Hoist @import statements to the very top (required by CSS specification)
  const importRegex = /@import\s+(?:url\([^)]+\)|['\"][^'\"]+['\"])[^;]*;/gi;
  const hoistedImports = [];
  rawCombinedCss = rawCombinedCss.replace(importRegex, (match) => {
    hoistedImports.push(match);
    return '';
  });
  if (hoistedImports.length > 0) {
    rawCombinedCss = hoistedImports.join('\n') + '\n\n' + rawCombinedCss;
  }

  console.log(`Total raw combined CSS length: ${(rawCombinedCss.length / 1024).toFixed(1)} KB`);

  // Rewrite URLs and download missing assets
  console.log('🔄 Rewriting URLs and downloading any missing fonts/images...');
  const finalCss = await rewriteAndDownloadUrls(rawCombinedCss);

  const outputPath = path.join(STYLES_DIR, 'shopify-exact.css');
  fs.writeFileSync(outputPath, finalCss, 'utf8');
  console.log(`✨ Successfully generated ${outputPath} (${(finalCss.length / 1024).toFixed(1)} KB)!`);
}

run().catch(err => {
  console.error('Fatal error during extraction:', err);
  process.exit(1);
});
