import { expect, test } from '@playwright/test';
import { prepare } from './helpers';

test.describe('desktop', () => {
  test('nav scrolls to sections and marks the active one; no console problems', async ({ page }) => {
    const problems = await prepare(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), null, { timeout: 15000 });
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Services' }).click();
    await page.waitForTimeout(1800);
    const top = await page.evaluate(() => document.getElementById('services')!.getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(140);
    await expect(nav.getByRole('link', { name: 'Services' })).toHaveAttribute('aria-current', 'true');

    await nav.getByRole('link', { name: 'Check your date' }).click();
    await page.waitForTimeout(1800);
    const contactTop = await page.evaluate(() => document.getElementById('contact')!.getBoundingClientRect().top);
    expect(Math.abs(contactTop)).toBeLessThan(140);
    expect(problems).toEqual([]);
  });

  test('film opens in an accessible dialog with a nocookie embed and closes with Esc', async ({ page }) => {
    const problems = await prepare(page);
    await page.goto('/#films', { waitUntil: 'networkidle' });
    const card = page.locator('a[data-film]').first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    const dialog = page.locator('dialog.film-dialog');
    await expect(dialog).toHaveAttribute('open', '');
    await expect(dialog.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '');
    await expect(dialog.locator('iframe')).toHaveCount(0);
    expect(problems.filter((p) => !/youtube|doubleclick|googlevideo|ytimg/i.test(p))).toEqual([]);
  });

  test('hero still is the LCP candidate and preloaded with high priority', async ({ page }) => {
    await prepare(page);
    await page.goto('/');
    const img = page.locator('#top picture img');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(img).toHaveAttribute('loading', 'eager');
  });
});
