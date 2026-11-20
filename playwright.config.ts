import { defineConfig, devices } from '@playwright/test';

const LIVE_URL = 'https://leaf-log-six.vercel.app';
const baseURL = process.env.BASE_URL ?? LIVE_URL;
const isLocal = /localhost|127\.0\.0\.1/.test(baseURL);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  // Якщо BASE_URL вказує на localhost — піднімаємо статичний сервер з index.html з репозиторію.
  // Так тести перевіряють код ДО деплою. API у тестах і так замокано (див. tests/fixtures.ts).
  webServer: isLocal
    ? {
        command: 'npx http-server . -p 4173 -c-1 --silent',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
