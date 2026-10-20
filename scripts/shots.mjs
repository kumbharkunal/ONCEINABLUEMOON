// QA screenshots + checks: node scripts/shots.mjs [url]
// Env: WIDTHS=320,375,... ENGINES=chromium,webkit MOTION=reduce|no-preference FULL=1 (full page) OUT=qa/shots
// Records console errors, page errors, horizontal overflow offenders and small tap targets per run.
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium, webkit } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:3100/';
const widths = (process.env.WIDTHS || '320,375,390,768,1024,1280,1440,1920').split(',').map(Number);
const engines = (process.env.ENGINES || 'chromium,webkit').split(',');
const motion = process.env.MOTION || 'reduce';
const full = process.env.FULL !== '0';
const outDir = process.env.OUT || 'qa/shots';
mkdirSync(outDir, { recursive: true });

const launchers = { chromium, webkit };
const report = [];

for (const engine of engines) {
  const browser = await launchers[engine].launch();
  for (const width of widths) {
    const mobile = width < 768;
    const context = await browser.newContext({
      viewport: { width, height: mobile ? 844 : width >= 1440 ? 900 : 800 },
      deviceScaleFactor: 1,
      reducedMotion: motion,
      hasTouch: mobile,
      isMobile: mobile,
    });
    await context.addInitScript(() => {
      try {
        localStorage.setItem('oiabm-intro', '1');
      } catch {}
    });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`);
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    await page.goto(url, { waitUntil: 'networkidle' });
    // Scroll through the page so lazy images load and reveals fire.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 600));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    await page.waitForLoadState('networkidle');
    const checks = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth > vw + 1;
      const offenders = [];
      if (overflow) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed') {
            offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
            if (offenders.length > 8) break;
          }
        }
      }
      const small = [];
      for (const el of document.querySelectorAll('a[href], button, summary, input, [role="button"]')) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || el.closest('[inert]') || el.closest('[aria-hidden="true"]')) continue;
        if (el.matches('.sr-only, .skip-link')) continue;
        if (r.height < 24 || r.width < 24) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { overflow, offenders, small: small.slice(0, 12), height: document.documentElement.scrollHeight };
    });
    const file = `${outDir}/${engine}-${width}${motion === 'reduce' ? '-rm' : ''}.png`;
    await page.screenshot({ path: file, fullPage: full });
    report.push({ engine, width, motion, file, ...checks, errors });
    console.log(
      `${engine} ${width}: height=${checks.height} overflow=${checks.overflow}${checks.offenders.length ? ' ' + checks.offenders.join(' | ') : ''} small=${checks.small.length} errors=${errors.length}`,
    );
    for (const e of errors.slice(0, 5)) console.log('   ' + e.slice(0, 220));
    await context.close();
  }
  await browser.close();
}
writeFileSync(`${outDir}/report-${motion}.json`, JSON.stringify(report, null, 2));
