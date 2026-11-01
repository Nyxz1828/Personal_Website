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
    const packRequests = [];
    let testFallback = false;
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => {
      const match = request.url().match(/\/languages\/(english|chinese|japanese)\/(\w+)\.json$/);
      const folder = match?.[1];
      const component = match?.[2];
      if (match) packRequests.push(`${folder}/${component}`);
      if (testFallback && folder === 'japanese') return request.respond({ status: 503, body: 'Unavailable' });
      if (testFallback && folder === 'chinese') {
        const pack = JSON.parse(fs.readFileSync(path.join(root, 'languages', folder, component + '.json'), 'utf8'));
        delete pack.About_Me;
        if (pack.projects) delete pack.projects['customer-service'].description;
        return request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(pack) });
      }
      if (request.url().startsWith('http://127.0.0.1')) return request.continue();
      return request.respond({ status: 200, contentType: 'text/javascript', body:
        request.url().includes('tailwind') ? 'window.tailwind = {};' :
        request.url().includes('feather') ? 'window.feather = {replace(){}};' : '' });
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    await page.goto(origin + '/index.html');
    await page.waitForFunction(() => document.querySelectorAll('[data-rendered]').length === 8);
    assert.equal(await page.$$eval('#projects-track > div', cards => cards.length), 6);
    assert.equal(packRequests.length, 9);
    assert(packRequests.every(key => key.startsWith('english/')));
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
    await page.waitForFunction(() => document.documentElement.lang === 'zh-Hant');
    assert.equal(packRequests.length, 27);
    assert.equal(new Set(packRequests).size, 27);
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
    assert((await page.$eval('[data-home-anchor="projects"]', element => element.href)).endsWith('/index.html#projects'));
    // The moved FYP page reuses shared sections and has its own translated content.
    await page.goto(origin + '/projects/FYP.html');
    await page.waitForFunction(() => document.querySelectorAll('[data-rendered]').length === 5);
    assert.equal(await page.$eval('#languageSelect', element => element.value), 'zh');
    for (const lang of ['en', 'zh', 'jp']) {
      await page.evaluate(async code => (await import('/shared/render.js')).setLanguage(code), lang);
      const translated = JSON.parse(fs.readFileSync(path.join(root, 'languages', {en:'english',zh:'chinese',jp:'japanese'}[lang], 'fyp.json'), 'utf8'));
      assert.equal(await page.$eval('[data-i18n="fyp_description"]', element => element.textContent), translated.fyp_description);
      assert.equal(await page.$eval('#fyp-demo iframe', element => element.title), translated.fyp_demo_title);
      assert((await page.$eval('[data-home-anchor="projects"]', element => element.href)).endsWith('/index.html#projects'));
      assert((await page.$eval('#fyp-demo iframe', element => element.src)).includes('ZImIZ4S9U5k'));
    }
    await page.goto(origin + '/FYP.html');
    await page.waitForFunction(() => location.pathname === '/projects/FYP.html' && document.querySelectorAll('[data-rendered]').length === 5);
    await page.goto(origin + '/index.html');
    await page.waitForFunction(() => document.querySelectorAll('[data-rendered]').length === 8);
    assert((await page.$eval('#projects-track a', element => element.href)).endsWith('/projects/FYP.html'));
    // Fresh page: exercise per-field fallback and unavailable packs.
    testFallback = true;
    await page.evaluate(() => localStorage.setItem('portfolio-language', 'en'));
    await page.reload();
    await page.waitForFunction(() => document.querySelectorAll('[data-rendered]').length === 8);
    await page.evaluate(async () => { await (await import('./shared/render.js')).setLanguage('zh'); });
    assert.equal(await page.$eval('#AbouT_Me', element => element.textContent), 'About Me');
    assert((await page.$eval('#projects-track', element => element.textContent)).includes('This project is a voice chat prototype'));
    const failedSwitch = await page.evaluate(async () => (await import('./shared/render.js')).setLanguage('jp'));
    assert.equal(failedSwitch, false);
    assert.equal(await page.$eval('#languageSelect', element => element.value), 'zh');
    await page.evaluate(async () => {
      const { setLanguage } = await import('./shared/render.js');
      await Promise.all([setLanguage('en'), setLanguage('zh')]);
    });
    assert.equal(await page.$eval('html', element => element.lang), 'zh-Hant');
    assert.deepEqual(errors, []);
    console.log('PASS: sections, three languages, lazy loading, caching, missing-key fallback, failed loads, rapid switching, projects, carousel, theme, saved preferences, and reuse.');
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
