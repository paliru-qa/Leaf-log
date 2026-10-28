import { test, expect } from './fixtures';

test.describe('Smoke', () => {
  test('S0: заголовок сторінки містить LeafLOG', { tag: '@smoke' }, async ({ openApp, page }) => {
    await openApp();

    await expect(page).toHaveTitle(/LeafLOG/);
  });
});
