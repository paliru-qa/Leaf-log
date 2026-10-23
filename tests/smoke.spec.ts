import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('S0: заголовок сторінки містить LeafLOG', async ({ page }) => {
    await page.goto('/?id=rycu0sei');

    await expect(page).toHaveTitle(/LeafLOG/);
  });
});
