import { expect, test } from '@playwright/test';
import { prepare } from './helpers';

test.describe('mobile menu', () => {
  test('opens, traps focus, closes with Esc, outside tap and back gesture, and navigates', async ({ page }) => {
    const problems = await prepare(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    const button = page.getByRole('button', { name: /open menu/i });
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    // Open
    await button.click();
    const sheet = page.locator('#mobile-menu');
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(sheet).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/is-locked/);
    await page.waitForTimeout(500);
    await expect(sheet.getByRole('link', { name: 'Stories' })).toBeFocused();

    // Focus trap: Tab through more elements than exist and stay inside menu + toggle
    for (let i = 0; i < 14; i++) await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const a = document.activeElement;
      return !!a && (a.closest('#mobile-menu') !== null || a.getAttribute('aria-controls') === 'mobile-menu');
    });
    expect(inside).toBe(true);

    // Scroll is locked while open (overflow hidden on the root; the page behind is inert)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');
    await expect(page.locator('#main')).toHaveAttribute('inert', '');

    // Esc closes and returns focus to the toggle
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();

    // Back gesture closes without leaving the page
    const url = page.url();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.goBack();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(page.url()).toBe(url);

    // Outside tap (the scrim in the sheet's margin) closes
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(650);
    await page.mouse.click(3, 420);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // A link closes the menu and scrolls to its section
    await toggle.click();
    await page.waitForTimeout(650);
    await sheet.getByRole('link', { name: 'Films' }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await page.waitForTimeout(1600);
    const filmsTop = await page.evaluate(() => document.getElementById('films')!.getBoundingClientRect().top);
    expect(Math.abs(filmsTop)).toBeLessThan(140);
    await expect(page).toHaveURL(/#films$/);

    expect(problems).toEqual([]);
  });

  test('tap targets are at least 44px in the pill and sheet', async ({ page }) => {
    await prepare(page);
    await page.goto('/');
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    const box = await toggle.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await toggle.click();
    await page.waitForTimeout(700);
    for (const link of await page.locator('#mobile-menu a').all()) {
      const b = await link.boundingBox();
      expect(b!.height).toBeGreaterThanOrEqual(44);
    }
  });
});
