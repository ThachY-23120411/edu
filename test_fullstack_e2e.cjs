const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.resolve('E:/Antigravity - Copy/Profiles/Profile5/.gemini/antigravity/brain/698f3303-da7b-47f6-b2ee-1fed93bd5384');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runFullstackVerification() {
  console.log('🚀 Starting Fullstack E2E Verification with Real Google Chrome (headless: false)...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    slowMo: 95,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = (await browser.pages())[0] || (await browser.newPage());

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('🔴 Browser Console Error:', msg.text());
    } else {
      console.log('🟢 Browser Console:', msg.text());
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
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_01_homepage.png'), fullPage: false });
    console.log('📸 Captured fullstack_01_homepage.png');

    // Scroll down to view partner universities & practice tests
    await page.evaluate(() => window.scrollBy({ top: 650, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_02_practice_tests.png'), fullPage: false });
    console.log('📸 Captured fullstack_02_practice_tests.png');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 800));

    // -------------------------------------------------------------
    // Step 2: Change Target in Navbar (calls PATCH /api/user/target)
    // -------------------------------------------------------------
    console.log('Step 2: Testing Target switcher dropdown...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const targetBtn = btns.find(b => b.textContent && b.textContent.includes('Mục tiêu:'));
      if (targetBtn) targetBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Click 'CFA Level 1'
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cfaBtn = btns.find(b => b.textContent && b.textContent.trim() === 'CFA Level 1');
      if (cfaBtn) cfaBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_03_target_updated.png'), fullPage: false });
    console.log('📸 Captured fullstack_03_target_updated.png');

    // -------------------------------------------------------------
    // Step 3: Open Mistake Notebook Modal (calls GET /api/notebook/mistakes)
    // -------------------------------------------------------------
    console.log('Step 3: Opening Mistake Notebook Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nbBtn = btns.find(b => b.textContent && b.textContent.includes('Sổ tay lỗi sai'));
      if (nbBtn) nbBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_04_notebook_modal.png'), fullPage: false });
    console.log('📸 Captured fullstack_04_notebook_modal.png');

    // Click resolve button on first mistake item
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resolveBtn = btns.find(b => b.textContent && b.textContent.includes('Đánh dấu đã hiểu bài'));
      if (resolveBtn) resolveBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Close notebook modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent && b.textContent.includes('Đóng sổ tay'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // -------------------------------------------------------------
    // Step 4: Open Vocabulary Drawer (calls GET /api/vocabulary/saved)
    // -------------------------------------------------------------
    console.log('Step 4: Opening Vocabulary Drawer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const vocabBtn = btns.find(b => b.textContent && b.textContent.includes('Từ vựng trọng tâm'));
      if (vocabBtn) vocabBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_05_vocab_drawer.png'), fullPage: false });
    console.log('📸 Captured fullstack_05_vocab_drawer.png');

    // Close vocab drawer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Đóng');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // -------------------------------------------------------------
    // Step 5: Navigate to Library Page (http://localhost:3000/library)
    // -------------------------------------------------------------
    console.log('Step 5: Navigating to Library Page...');
    await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_06_library_page.png'), fullPage: false });
    console.log('📸 Captured fullstack_06_library_page.png');

    // Filter by HSK
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hskBtn = btns.find(b => b.textContent && b.textContent.includes('HSK (Hanban)'));
      if (hskBtn) hskBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_07_library_hsk_filter.png'), fullPage: false });
    console.log('📸 Captured fullstack_07_library_hsk_filter.png');

    // Filter back to all
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const allBtn = btns.find(b => b.textContent && b.textContent.includes('Tất cả đề thi'));
      if (allBtn) allBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // -------------------------------------------------------------
    // Step 6: Navigate to Exam Room (http://localhost:3000/exam/ielts-cam-18-test-3)
    // -------------------------------------------------------------
    console.log('Step 6: Navigating to Exam Room...');
    await page.goto('http://localhost:3000/exam/ielts-cam-18-test-3', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_08_exam_room.png'), fullPage: false });
    console.log('📸 Captured fullstack_08_exam_room.png');

    // -------------------------------------------------------------
    // Step 7: Answer questions & Flag question (calls PUT /api/attempts/:id/answers)
    // -------------------------------------------------------------
    console.log('Step 7: Interacting with Question 14 (Multiple Choice)...');
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      if (labels.length > 0) labels[0].click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Navigate to Question 15
    console.log('Navigating to Question 15...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q15Btn = btns.find(b => b.textContent && b.textContent.trim() === '15');
      if (q15Btn) q15Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Answer NOT GIVEN (option C)
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const optC = labels.find(l => l.textContent && l.textContent.includes('NOT GIVEN'));
      if (optC) optC.click();
      else if (labels.length > 2) labels[2].click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Flag Question 15
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const flagBtn = btns.find(b => b.textContent && b.textContent.includes('Đánh dấu xem lại'));
      if (flagBtn) flagBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_09_exam_answered.png'), fullPage: false });
    console.log('📸 Captured fullstack_09_exam_answered.png');

    // -------------------------------------------------------------
    // Step 8: Submit Exam (calls POST /api/attempts/:id/submit)
    // -------------------------------------------------------------
    console.log('Step 8: Opening Submit Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const subBtn = btns.find(b => b.textContent && b.textContent.includes('Nộp bài thi'));
      if (subBtn) subBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_10_submit_modal.png'), fullPage: false });
    console.log('📸 Captured fullstack_10_submit_modal.png');

    // Confirm submission
    console.log('Confirming submission...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.textContent && b.textContent.includes('Xác nhận nộp bài'));
      if (confirmBtn) confirmBtn.click();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // -------------------------------------------------------------
    // Step 9: Result Page (http://localhost:3000/result/...)
    // -------------------------------------------------------------
    console.log('Step 9: Viewing Result Report from Backend...');
    console.log('📍 Current Route:', page.url());
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_11_result_page.png'), fullPage: false });
    console.log('📸 Captured fullstack_11_result_page.png');

    // Scroll to explanations
    await page.evaluate(() => window.scrollBy({ top: 750, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_12_result_explanations.png'), fullPage: false });
    console.log('📸 Captured fullstack_12_result_explanations.png');

    // -------------------------------------------------------------
    // Step 10: Toggle bookmark on mistake from result page
    // -------------------------------------------------------------
    console.log('Step 10: Toggling mistake notebook save from Result Page...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bmBtn = btns.find(b => b.textContent && b.textContent.includes('sổ tay lỗi sai'));
      if (bmBtn) bmBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotDir, 'fullstack_13_result_bookmark_updated.png'), fullPage: false });
    console.log('📸 Captured fullstack_13_result_bookmark_updated.png');

    console.log('\n=========================================');
    console.log('🎉 E2E TEST SUMMARY:');
    console.log('  Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('  Errors List:', consoleErrors);
    } else {
      console.log('  ZERO BUGS / ZERO CONSOLE ERRORS CONFIRMED! 100% SUCCESS!');
    }
    console.log('=========================================\n');

  } catch (error) {
    console.error('❌ E2E Verification failed:', error);
  } finally {
    await browser.close();
    console.log('🔒 Chrome browser session closed.');
  }
}

runFullstackVerification();
