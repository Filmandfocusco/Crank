const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        // Set viewport to 13-inch iPad Pro logical dimensions
        // 1024x1366 with 2x scale = 2048x2732 Physical Output
        await page.setViewport({ width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        
        console.log('Navigating to index.html...');
        await page.goto(`file://${path.join(__dirname, 'index.html')}`, { waitUntil: 'networkidle0' });

        console.log('Taking screenshot 1 (Project)...');
        const path1 = path.join(__dirname, 'ipad_screenshot_1_project.png');
        await page.screenshot({ path: path1 });

        console.log('Navigating to Exposure tab...');
        await page.click('#nav-exposure');
        await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition
        console.log('Taking screenshot 2 (Exposure)...');
        const path2 = path.join(__dirname, 'ipad_screenshot_2_exposure.png');
        await page.screenshot({ path: path2 });

        console.log('Navigating to Off Speed tab...');
        await page.click('#nav-fps');
        await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition
        console.log('Taking screenshot 3 (Off Speed)...');
        const path3 = path.join(__dirname, 'ipad_screenshot_3_offspeed.png');
        await page.screenshot({ path: path3 });

        console.log('Closing browser...');
        await browser.close();
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
