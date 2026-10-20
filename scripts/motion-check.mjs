// Motion QA: node scripts/motion-check.mjs [url]
// Captures viewport frames along the scroll path with motion enabled (desktop), plus the intro.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:3100/';
const out = process.env.OUT || 'qa/motion';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const errors = [];

// 1) First visit: the intro loader plays (screenshot mid-way and after).
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`intro pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: 'commit' });
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${out}/intro-0450.png` });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/intro-after.png` });
  await ctx.close();
}

// 2) Returning visit, motion on: scroll path.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('oiabm-intro', '1');
  } catch {}
});
const page = await ctx.newPage();
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), null, { timeout: 15000 });
await page.waitForTimeout(2200);
const hasLenis = await page.evaluate(() => Boolean(window.__oiabmLenis));

const jump = async (y, name, wait = 1300) => {
  await page.evaluate((target) => {
    const lenis = window.__oiabmLenis;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, y);
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/${name}.png` });
};

const geo = await page.evaluate(() => {
  const r = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: b.top + window.scrollY, height: b.height };
  };
  return { track: r('[data-hero-track]'), stories: r('#stories'), films: r('#films'), services: r('#services'), contact: r('#contact'), idea: r('#idea') };
});

await jump(0, '01-hero-rest');
await jump(Math.round(geo.track.height * 0.25), '02-hero-25');
await jump(Math.round(geo.track.height * 0.48), '03-hero-full');
await jump(geo.idea.top - 200, '04-manifesto');
await jump(geo.stories.top + 40, '05-stories-start');
const pinLen = await page.evaluate(() => {
  const spacer = document.querySelector('#stories .pin-spacer');
  return spacer ? spacer.getBoundingClientRect().height : 0;
});
await jump(geo.stories.top + Math.round(pinLen * 0.45), '06-stories-mid');
await jump(geo.films.top + 60, '07-films');
await jump(geo.services.top + 300, '08-services');
// Hover a service row to check the preview swap.
const row = page.locator('[data-svc="albums"] summary');
await row.hover();
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/09-services-hover-albums.png` });
await jump(geo.contact.top + 200, '10-contact');

console.log(JSON.stringify({ hasLenis, pinLen: Math.round(pinLen), geo, errors }, null, 2));
await browser.close();
