const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const devices = [
        {
            name: 'iphone',
            viewport: { width: 428, height: 926, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
            screenshots: [
                { name: 'iphone_1_project.png', action: async (p) => { await p.click('#nav-project'); } },
                { name: 'iphone_2_offspeed.png', action: async (p) => { await p.click('#nav-fps'); } },
                { name: 'iphone_3_exposure.png', action: async (p) => { await p.click('#nav-exposure'); } },
                { name: 'iphone_4_cameras.png', action: async (p) => { await p.click('#nav-cameras'); } },
                { name: 'iphone_5_camera_detail.png', action: async (p) => { 
                    await p.click('#nav-cameras');
                    await new Promise(r => setTimeout(r, 500));
                    await p.click('.camdb-cam-card'); 
                } },
                { name: 'iphone_6_info.png', action: async (p) => { await p.click('button[onclick*="info"]'); } }
            ]
        },
        {
            name: 'ipad',
            viewport: { width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
            screenshots: [
                { name: 'ipad_1_project.png', action: async (p) => { await p.click('#nav-project'); } },
                { name: 'ipad_2_exposure.png', action: async (p) => { await p.click('#nav-exposure'); } },
                { name: 'ipad_3_offspeed.png', action: async (p) => { await p.click('#nav-fps'); } }
            ]
        }
    ];

    try {
        for (const device of devices) {
            console.log(`Generating screenshots for ${device.name}...`);
            await page.setViewport(device.viewport);
            
            for (const sc of device.screenshots) {
                console.log(`Capturing ${sc.name}...`);
                await page.goto(`file://${path.join(__dirname, 'index.html')}`, { waitUntil: 'networkidle0' });
                
                // Wait a bit for initialization
                await new Promise(r => setTimeout(r, 500));
                
                await sc.action(page);
                
                // Wait for transition/rendering
                await new Promise(r => setTimeout(r, 800));
                
                const filePath = path.join(__dirname, sc.name);
                await page.screenshot({ path: filePath });
            }
        }
    } catch (e) {
        console.error('Error during screenshot generation:', e);
    } finally {
        await browser.close();
        process.exit(0);
    }
})();
