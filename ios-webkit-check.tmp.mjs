import { webkit, devices } from 'playwright';

const browser = await webkit.launch();
const iphone = devices['iPhone 13'];
const context = await browser.newContext({ ...iphone, serviceWorkers: 'allow' });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
const failed = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => pageErrors.push(err.stack || err.message));
page.on('requestfailed', req => failed.push(`${req.url()} :: ${req.failure()?.errorText}`));
const response = await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForTimeout(1000);
const result = await page.evaluate(() => ({
  title: document.title,
  bodyText: document.body.innerText.slice(0, 500),
  appText: document.querySelector('#app')?.innerText.slice(0, 500),
  appHtmlLength: document.querySelector('#app')?.innerHTML.length,
  footerVisible: !!document.querySelector('.app-footer') && getComputedStyle(document.querySelector('.app-footer')).display !== 'none',
  githubVisible: !!document.querySelector('a[href="https://github.com/DennisYildizdev"]'),
  emailVisible: !!document.querySelector('a[href="mailto:enisyildiztech@outlook.com"]'),
  horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  userAgent: navigator.userAgent,
  sw: 'serviceWorker' in navigator,
}));
console.log(JSON.stringify({status: response?.status(), result, consoleErrors, pageErrors, failed}, null, 2));
await page.screenshot({path: 'C:/Users/PC/AppData/Local/hermes/cache/scratch/ios-webkit.png', fullPage: true});
await browser.close();
