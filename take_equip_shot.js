
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({width: 1440, height: 900});
  await page.goto('http://localhost:3000/dashboardsale.html', {waitUntil: 'networkidle0'});
  const equip = await page.;
  if (equip) {
    await equip.screenshot({path: 'screen_equip_showcase_clean.png'});
    console.log('Saved equip screenshot');
  }
  await browser.close();
})();
