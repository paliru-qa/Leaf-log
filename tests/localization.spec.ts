import { test, expect } from '@playwright/test';

test.describe('Локалізація', () => {
  test('L1: перемикання UA → EN', async ({ page }) => {
    await page.goto('/?id=rycu0sei');

    await page.getByRole('button', { name: 'Змінити мову' }).click();

    const langButton = page.getByRole('button', { name: 'Change language' });
    await expect(langButton).toBeVisible();
    await expect(langButton).toHaveText('EN');
    await expect(page.getByRole('button', { name: 'Select multiple' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('L2: перемикання EN → UA', async ({ page }) => {
    // Стартуємо одразу з англійської, не залежачи від L1
    await page.addInitScript(() => {
      localStorage.setItem('leaflog_lang', 'en');
    });
    await page.goto('/?id=rycu0sei');

    // Передумова: сторінка справді відкрилась англійською
    await expect(page.getByRole('button', { name: 'Change language' })).toBeVisible();

    await page.getByRole('button', { name: 'Change language' }).click();

    const langButton = page.getByRole('button', { name: 'Змінити мову' });
    await expect(langButton).toBeVisible();
    await expect(langButton).toHaveText('UA');
    await expect(page.getByRole('button', { name: 'Відмітити кілька' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  });
});
