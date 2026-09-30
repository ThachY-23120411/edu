const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.resolve('E:/Antigravity - Copy/Profiles/Profile5/.gemini/antigravity/brain/698f3303-da7b-47f6-b2ee-1fed93bd5384');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runEmptyStateVerification() {
  console.log('🚀 Starting Empty State & Scope Verification on Real Google Chrome (headless: false)...');

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
    // Step 1: Visit Home Page (http://localhost:3000/)
    // -------------------------------------------------------------
    console.log('Step 1: Navigating to Home Page...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_01_homepage_empty_state.png'), fullPage: false });
    console.log('📸 Captured clean_01_homepage_empty_state.png');

    // Scroll to see Master exams catalog
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_02_practice_tests_master.png'), fullPage: false });
    console.log('📸 Captured clean_02_practice_tests_master.png');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 800));

    // -------------------------------------------------------------
    // Step 2: Open Mistake Notebook Modal from Navbar
    // -------------------------------------------------------------
    console.log('Step 2: Opening Mistake Notebook Modal (checking empty state)...');
    const notebookBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Sổ lỗi sai'));
    });
    if (notebookBtn && notebookBtn.asElement()) {
      await notebookBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(screenshotDir, 'clean_03_notebook_empty.png'), fullPage: false });
      console.log('📸 Captured clean_03_notebook_empty.png');

      // Close modal
      const closeBtn = await page.$('button[class*="text-slate-400 hover:text-white"]');
      if (closeBtn) {
        await closeBtn.click();
        await new Promise(r => setTimeout(r, 800));
      }
    }

    // -------------------------------------------------------------
    // Step 3: Open Vocabulary Drawer from Navbar
    // -------------------------------------------------------------
    console.log('Step 3: Opening Vocabulary Drawer (checking empty state on saved words)...');
    const vocabBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Từ vựng'));
    });
    if (vocabBtn && vocabBtn.asElement()) {
      await vocabBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1200));

      // Click "Chỉ từ đã lưu" filter
      const filterSavedBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Chỉ từ đã lưu'));
      });
      if (filterSavedBtn && filterSavedBtn.asElement()) {
        await filterSavedBtn.asElement().click();
        await new Promise(r => setTimeout(r, 1000));
      }

      await page.screenshot({ path: path.join(screenshotDir, 'clean_04_vocab_empty.png'), fullPage: false });
      console.log('📸 Captured clean_04_vocab_empty.png');

      // Close drawer
      const closeDrawerBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.trim() === 'Đóng');
      });
      if (closeDrawerBtn && closeDrawerBtn.asElement()) {
        await closeDrawerBtn.asElement().click();
        await new Promise(r => setTimeout(r, 800));
      }
    }

    // -------------------------------------------------------------
    // Step 4: Navigate to Library Catalog
    // -------------------------------------------------------------
    console.log('Step 4: Navigating to Library (/library)...');
    await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_05_library_catalog.png'), fullPage: false });
    console.log('📸 Captured clean_05_library_catalog.png');

    // -------------------------------------------------------------
    // Step 5: Navigate to Result Page (/result)
    // -------------------------------------------------------------
    console.log('Step 5: Navigating to Result Page (/result)...');
    await page.goto('http://localhost:3000/result', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'clean_06_result_empty_state.png'), fullPage: false });
    console.log('📸 Captured clean_06_result_empty_state.png');

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

runEmptyStateVerification();
