import { expect, test } from '@playwright/test';
import { prepare } from './helpers';

// Phones get the scroll choreography too (a GSAP matchMedia keyed on "desktop" once skipped every screen
// under 1024px, and the story arches never revealed). Guards both.
test('phones run the scroll motion: the marquee drifts and the story arches reveal', async ({ page }) => {
  const problems = await prepare(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/motion-ready/, { timeout: 15_000 });

  const marquee = page.locator('[data-marquee]');
  const x = () => marquee.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  const before = await x();
  await page.evaluate(() => {
    const el = document.querySelector('.marquee');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2);
  });
  await expect.poll(x, { timeout: 5_000 }).not.toBe(before);

  await page.evaluate(() => {
    const el = document.querySelector('#stories [data-story-frame]');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3);
  });
  const firstArch = page.locator('#stories [data-story-frame]').first();
  await expect.poll(async () => firstArch.evaluate((el) => !el.classList.contains('will-reveal') || el.classList.contains('is-in')), { timeout: 5_000 }).toBe(true);

  expect(problems).toEqual([]);
});
