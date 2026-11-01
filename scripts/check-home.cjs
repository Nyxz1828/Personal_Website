// Browser smoke check. External CDNs are stubbed to test local behavior offline.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');

(async () => {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((request, response) => {
    const file = path.resolve(root, '.' + decodeURIComponent(request.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    try {
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
      response.setHeader('Content-Type', (types[path.extname(file)] || 'text/plain') + '; charset=utf-8');
      response.end(fs.readFileSync(file));
    } catch { response.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, timeout: 15000 });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().startsWith('http://127.0.0.1')) return request.continue();
      return request.respond({ status: 200, contentType: 'text/javascript', body:
        request.url().includes('tailwind') ? 'window.tailwind = {};' :
        request.url().includes('feather') ? 'window.feather = {replace(){}};' : '' });
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    await page.goto(origin + '/home.html');
    await page.waitForFunction(() => document.querySelectorAll('[data-rendered]').length === 8);
    assert.equal(await page.$$eval('#projects-track > div', cards => cards.length), 6);
    for (const [lang, htmlLang, about, title] of [
      ['zh', 'zh-Hant', '關於我', '自動化客服系統'],
      ['jp', 'ja', '自己紹介', '自動カスタマーサービスシステム'],
      ['en', 'en', 'About Me', 'Automated Customer Service System'],
    ]) {
      await page.select('#languageSelect', lang);
      await page.waitForFunction(expected => document.querySelector('#AbouT_Me').textContent === expected, {}, about);
      assert.equal(await page.$eval('html', element => element.lang), htmlLang);
      assert((await page.$eval('#projects-track', element => element.textContent)).includes(title));
      assert.equal(await page.$$eval('#addi_info_contact i', icons => icons.length), 1);
      assert.equal(await page.$$eval('[data-i18n]', elements => elements.filter(element => element.textContent.includes('???')).length), 0);
    }
    await page.click('#nextBtn');
    assert((await page.$eval('#projects-track', element => element.style.transform)).includes('100%'));
    await page.setViewport({ width: 400, height: 800 });
    await page.click('#prevBtn');
    assert.equal(await page.$eval('#projects-track', element => element.style.transform), 'translateX(-200%)');
    await page.click('#prevBtn');
    await page.click('#prevBtn');
    assert.equal(await page.$eval('#projects-track', element => element.style.transform), 'translateX(0%)');
    const dark = await page.$eval('html', element => element.classList.contains('dark'));
    await page.click('#themeToggle');
    assert.equal(await page.$eval('html', element => element.classList.contains('dark')), !dark);
    await page.select('#languageSelect', 'zh');
    await page.reload();
    await page.waitForFunction(() => document.querySelectorAll('[data-rendered]').length === 8);
    assert.equal(await page.$eval('#languageSelect', element => element.value), 'zh');
    await page.evaluate(async () => {
      const { renderComponents } = await import('./shared/render.js');
      document.body.innerHTML = '<div data-component="header"></div><div data-component="education"></div>';
      await renderComponents();
      await renderComponents();
    });
    assert.equal(await page.$eval('#Education', element => element.textContent), '學歷');
    assert((await page.$eval('[data-home-anchor="projects"]', element => element.href)).endsWith('/home.html#projects'));
    assert.deepEqual(errors, []);
    console.log('PASS: sections, three languages, projects, carousel, mobile resize, theme, saved preferences, and partial-page reuse.');
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
