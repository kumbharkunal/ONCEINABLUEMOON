import { defineConfig, devices } from '@playwright/test';

// QA against the production build: `npm run build && npx next start -p 3100`, then `npx playwright test`.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 2,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3100',
    trace: 'off',
  },
  projects: [
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] }, testMatch: /mobile|form|reduced/ },
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'] }, testMatch: /mobile|form|reduced/ },
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, testMatch: /desktop/ },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } }, testMatch: /desktop/ },
  ],
});
