const { chromium } = require('playwright');
const path = require('path');
const dir = __dirname;
(async () => {
  const times = process.argv.slice(2).map(Number);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.join(dir, 'video.html'));
  await pg.evaluate(() => document.fonts.ready);
  let i = 0;
  for (const t of times) {
    await pg.evaluate(t => window.render(t), t);
    await pg.screenshot({ path: path.join(dir, 'stills', `s${String(i++).padStart(2, '0')}.png`) });
  }
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
