import { expect, test } from '@playwright/test';
import { prepare } from './helpers';

test('contact coupon validates, shows the wedding-night moon and hands off to WhatsApp', async ({ page }) => {
  const problems = await prepare(page);
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return {} as Window;
    }) as typeof window.open;
  });
  await page.goto('/#contact', { waitUntil: 'networkidle' });
  const form = page.locator('form.coupon-form');
  await form.scrollIntoViewIfNeeded();

  // Empty submit: error summary is announced and focused
  await form.getByRole('button', { name: /send on whatsapp/i }).click();
  const summary = page.locator('.coupon-errors');
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(form.getByLabel(/your name/i)).toHaveAttribute('aria-invalid', 'true');

  // Fill and pick a blue-moon date: the caption says so
  await form.getByLabel(/your name/i).fill('Asha');
  await form.getByLabel(/partner/i).fill('Rohan');
  await form.getByLabel(/wedding date/i).fill('2028-12-31');
  await expect(page.locator('.coupon-caption')).toContainText('Truly once in a blue moon');
  await form.getByLabel(/city or venue/i).fill('Nashik');
  await form.getByRole('button', { name: 'Haldi' }).click();
  await expect(form.getByRole('button', { name: 'Haldi' })).toHaveAttribute('aria-pressed', 'true');

  // The form submits even though window.open is stubbed (it falls back to location; block that navigation)
  await page.route('https://wa.me/**', (route) => route.abort());
  await form.getByRole('button', { name: /send on whatsapp/i }).click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened.length).toBe(1);
  const url = new URL(opened[0]);
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/918208631559');
  const text = url.searchParams.get('text') ?? '';
  expect(text).toContain('*Names:* Asha & Rohan');
  expect(text).toContain('*Date:* ');
  expect(text).toContain('31 December 2028');
  expect(text).toContain('*Events:* Wedding, Haldi');
  expect(problems.filter((p) => !/wa\.me|ERR_FAILED|net::/i.test(p))).toEqual([]);
});
