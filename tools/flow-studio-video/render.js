const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, out = path.join(dir, 'frames');
const FPS = 25, DUR = 30, TOTAL = FPS * DUR;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await pg.goto('file://' + path.join(dir, 'video.html'));
  await pg.evaluate(() => document.fonts.ready);
  for (let i = 0; i < TOTAL; i++) {
    await pg.evaluate(t => window.render(t), i / FPS);
    await pg.screenshot({ path: path.join(out, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 90 });
    if (i % 50 === 0) fs.writeFileSync(path.join(dir, 'progress.txt'), String(i));
  }
  fs.writeFileSync(path.join(dir, 'progress.txt'), 'done');
  await b.close();
})();
