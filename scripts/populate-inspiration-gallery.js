#!/usr/bin/env node

/**
 * Populate Design Inspiration Gallery
 *
 * Uses chrome-devtools MCP to browse curated design sites,
 * take viewport screenshots, and save to global inspiration gallery.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GALLERY_PATH = path.join(process.env.HOME, '.claude', 'design-inspiration');

// Sites to screenshot by category
const SITES = {
  landing: [
    { url: 'https://www.vaayu.tech/', name: 'vaayu' },
    { url: 'https://moheim.com/', name: 'moheim' },
    { url: 'https://www.deepjudge.ai/', name: 'deepjudge' },
    { url: 'https://fey.com/features/finder', name: 'fey' },
    { url: 'https://endex.ai/', name: 'endex' },
    { url: 'https://www.apple.com/', name: 'apple' },
    { url: 'https://www.openweb.com/', name: 'openweb' },
    { url: 'https://area17.com/', name: 'area17' },
  ],
  protocols: [
    { url: 'https://docs.stripe.com/api', name: 'stripe-api' },
    { url: 'https://tailwindcss.com/docs/installation', name: 'tailwind-docs' },
    { url: 'https://vercel.com/docs', name: 'vercel-docs' },
  ],
  components: [
    { url: 'https://www.figma.com/pricing', name: 'figma-pricing' },
    { url: 'https://chakra-ui.com/', name: 'chakra-ui' },
  ],
  typography: [
    { url: 'https://www.fontshare.com/', name: 'fontshare' },
  ]
};

async function screenshotSite(url, outputPath) {
  console.log(`\n📸 Screenshotting: ${url}`);
  console.log(`   Saving to: ${outputPath}`);

  try {
    // Use puppeteer or chrome-devtools to take screenshot
    // For now, using basic approach - in production would use MCP tools
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport for consistency
    await page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    });

    // Navigate and wait for load
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a bit for animations
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false // viewport only to avoid timeouts
    });

    await browser.close();

    console.log(`   ✅ Screenshot saved`);
    return true;

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function populateGallery() {
  console.log('🎨 POPULATING DESIGN INSPIRATION GALLERY\n');

  let successCount = 0;
  let totalCount = 0;

  for (const [category, sites] of Object.entries(SITES)) {
    console.log(`\n📁 Category: ${category}/`);

    const categoryPath = path.join(GALLERY_PATH, category);

    // Ensure category directory exists
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }

    for (const site of sites) {
      totalCount++;
      const outputPath = path.join(categoryPath, `${site.name}.png`);

      // Skip if already exists
      if (fs.existsSync(outputPath)) {
        console.log(`\n⏭️  Skipping ${site.name} (already exists)`);
        successCount++;
        continue;
      }

      const success = await screenshotSite(site.url, outputPath);
      if (success) successCount++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n\n📊 SUMMARY');
  console.log(`   Total sites: ${totalCount}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${totalCount - successCount}`);
  console.log(`\n✅ Gallery population complete!`);
  console.log(`   Location: ${GALLERY_PATH}`);
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer');
  populateGallery().catch(console.error);
} catch (e) {
  console.log('Installing puppeteer...');
  execSync('npm install -g puppeteer', { stdio: 'inherit' });
  populateGallery().catch(console.error);
}
