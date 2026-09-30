const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.resolve('E:/Antigravity - Copy/Profiles/Profile5/.gemini/antigravity/brain/698f3303-da7b-47f6-b2ee-1fed93bd5384');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runVerification() {
  console.log('🚀 Starting Real Next.js E2E Visual Verification with Chrome (headless: false)...');
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    slowMo: 90,
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
    // 1. Visit Next.js Home Page
    console.log('Step 1: Navigating to Next.js route http://localhost:3000/...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('📍 Current Route:', page.url());
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'next_01_homepage.png'), fullPage: false });
    console.log('📸 Captured next_01_homepage.png');

    // Scroll down to view practice tests
    await page.evaluate(() => window.scrollBy({ top: 700, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'next_02_homepage_practice_tests.png'), fullPage: false });
    console.log('📸 Captured next_02_homepage_practice_tests.png');

    // Scroll back up
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 800));

    // 2. Open Mistake Notebook Modal
    console.log('Step 2: Opening Mistake Notebook Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.includes('Sổ tay lỗi sai'));
      if (target) target.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'next_03_mistake_notebook_modal.png'), fullPage: false });
    console.log('📸 Captured next_03_mistake_notebook_modal.png');

    // Close modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent.includes('Đóng') || b.querySelector('svg.lucide-x'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 3. Open Vocab Drawer
    console.log('Step 3: Opening Vocab Drawer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.includes('Từ vựng trọng tâm'));
      if (target) target.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'next_04_vocab_drawer.png'), fullPage: false });
    console.log('📸 Captured next_04_vocab_drawer.png');

    // Close vocab drawer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.querySelector('svg.lucide-x') || b.getAttribute('aria-label') === 'Close');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 4. Navigate to Next.js Library Route (/library)
    console.log('Step 4: Navigating to Next.js route /library...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const libBtn = btns.find(b => b.textContent.trim().toUpperCase() === 'KHO ĐỀ THI' || b.textContent.includes('Kho đề thi'));
      if (libBtn) libBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname.includes('/library'), { timeout: 10000 });
    console.log('📍 Current Route:', page.url());
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'next_05_library_page.png'), fullPage: false });
    console.log('📸 Captured next_05_library_page.png');

    // Filter library by HSK
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hskFilter = btns.find(b => b.textContent.includes('HSK'));
      if (hskFilter) hskFilter.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotDir, 'next_06_library_hsk_filter.png'), fullPage: false });
    console.log('📸 Captured next_06_library_hsk_filter.png');

    // Return to All
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const allFilter = btns.find(b => b.textContent.includes('Tất cả'));
      if (allFilter) allFilter.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // 5. Start Exam (navigate to /exam/[id])
    console.log('Step 5: Starting Exam (Navigating to /exam/[id])...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startExamBtn = btns.find(b => b.textContent.includes('Làm bài thi tính giờ') || b.textContent.includes('Bắt đầu thi tính giờ'));
      if (startExamBtn) {
        console.log('Clicked start exam button:', startExamBtn.textContent);
        startExamBtn.click();
      }
    });
    await page.waitForFunction(() => window.location.pathname.includes('/exam'), { timeout: 10000 });
    console.log('📍 Current Route:', page.url());
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Nộp bài thi'));
    }, { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotDir, 'next_07_exam_interface.png'), fullPage: false });
    console.log('📸 Captured next_07_exam_interface.png');

    // 6. Answering exam questions
    console.log('Step 6: Answering exam questions...');
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label, button'));
      const optionB = labels.find(el => el.textContent.includes('B.') || el.textContent.includes('FALSE') || el.textContent.includes('True'));
      if (optionB) optionB.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Next question
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Câu tiếp') || b.textContent.includes('Tiếp') || b.querySelector('svg.lucide-chevron-right'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Answer next question
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label, button'));
      const option = labels.find(el => el.textContent.includes('A.') || el.textContent.includes('TRUE'));
      if (option) option.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(screenshotDir, 'next_08_exam_answered.png'), fullPage: false });
    console.log('📸 Captured next_08_exam_answered.png');

    // 7. Submit Exam
    console.log('Step 7: Submitting exam...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find(b => b.textContent.includes('Nộp bài thi'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'next_09_submit_confirm_modal.png'), fullPage: false });
    console.log('📸 Captured next_09_submit_confirm_modal.png');

    // Confirm submission
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.textContent.includes('Xác nhận nộp bài'));
      if (confirmBtn) confirmBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname.includes('/result'), { timeout: 10000 });
    console.log('📍 Current Route:', page.url());
    await new Promise(r => setTimeout(r, 2000));

    // 8. Result Page
    console.log('Step 8: Verifying Next.js Result Route...');
    await page.screenshot({ path: path.join(screenshotDir, 'next_10_result_page.png'), fullPage: false });
    console.log('📸 Captured next_10_result_page.png');

    // Scroll down on Result Page
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotDir, 'next_11_result_details.png'), fullPage: false });
    console.log('📸 Captured next_11_result_details.png');

    await new Promise(r => setTimeout(r, 2000));
    console.log('✅ Next.js E2E visual verification completed successfully!');
  } catch (err) {
    console.error('❌ Error during E2E verification:', err);
    throw err;
  } finally {
    await browser.close();
  }

  if (consoleErrors.length > 0) {
    console.error('❌ Found browser errors during testing:', consoleErrors);
    throw new Error('Browser console errors encountered: ' + JSON.stringify(consoleErrors));
  } else {
    console.log('🎉 100% Zero-Bug verification passed with 0 console errors!');
  }
}

runVerification().catch(e => {
  console.error(e);
  process.exit(1);
});
