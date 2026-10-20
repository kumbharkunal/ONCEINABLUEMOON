import type { Page } from '@playwright/test';

/** Skip the first-visit intro and collect console problems. */
export async function prepare(page: Page) {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  await page.addInitScript(() => {
    try {
      localStorage.setItem('oiabm-intro', '1');
    } catch {}
  });
  return problems;
}
