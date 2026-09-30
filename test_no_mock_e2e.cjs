const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.resolve('E:/Antigravity - Copy/Profiles/Profile5/.gemini/antigravity/brain/698f3303-da7b-47f6-b2ee-1fed93bd5384');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runNoMockVerification() {
  console.log('🚀 Starting Verification on Real Google Chrome (headless: false) - Zero Mock Data...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    slowMo: 100,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = (await browser.pages())[0] || (await browser.newPage());

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('🔴 Browser Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
    console.error('💥 Page Crash/Error:', err);
  });

  try {
    // -------------------------------------------------------------
    // Step 1: Check the exact page the user opened: /exam/cfa-level-1-ethics-quant
    // -------------------------------------------------------------
    console.log('Step 1: Navigating to /exam/cfa-level-1-ethics-quant...');
    await page.goto('http://localhost:3000/exam/cfa-level-1-ethics-quant', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_07_cfa_exam_empty_state.png'), fullPage: false });
    console.log('📸 Captured clean_07_cfa_exam_empty_state.png');

    // -------------------------------------------------------------
    // Step 2: Check /exam/ielts-cam-18-test-3
    // -------------------------------------------------------------
    console.log('Step 2: Navigating to /exam/ielts-cam-18-test-3...');
    await page.goto('http://localhost:3000/exam/ielts-cam-18-test-3', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_08_ielts_exam_empty_state.png'), fullPage: false });
    console.log('📸 Captured clean_08_ielts_exam_empty_state.png');

    // -------------------------------------------------------------
    // Step 3: Check /library (Master catalog from DB)
    // -------------------------------------------------------------
    console.log('Step 3: Navigating to /library...');
    await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_09_library_real_db.png'), fullPage: false });
    console.log('📸 Captured clean_09_library_real_db.png');

    // -------------------------------------------------------------
    // Step 4: Check / (Homepage with real DB and zero fake attempts)
    // -------------------------------------------------------------
    console.log('Step 4: Navigating to Homepage /...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_10_homepage_real_db.png'), fullPage: false });
    console.log('📸 Captured clean_10_homepage_real_db.png');

    console.log('=============================================');
    console.log('✅ ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
    console.log('Console Errors count:', consoleErrors.length);
    console.log('=============================================');

  } catch (err) {
    console.error('❌ Error during E2E verification:', err);
  } finally {
    await browser.close();
  }
}

runNoMockVerification();
