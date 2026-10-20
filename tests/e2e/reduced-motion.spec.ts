import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('reduced motion: no intro, no smooth scroll, no scroll choreography, everything visible', async ({ page }) => {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(e.message));
  // First visit (no localStorage flag) must still skip the intro under reduced motion.
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'play');
  await expect(page.locator('.intro')).toBeHidden();
  await page.waitForTimeout(2500);
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
  expect(await page.evaluate(() => Boolean((window as unknown as { __oiabmLenis?: unknown }).__oiabmLenis))).toBe(false);
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => {
      const cs = getComputedStyle(el);
      return cs.opacity === '0' || cs.visibility === 'hidden';
    }).length,
  );
  expect(hidden).toBe(0);
  expect(problems).toEqual([]);
});
