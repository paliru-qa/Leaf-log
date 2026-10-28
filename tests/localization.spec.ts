import { test, expect, makePlant } from './fixtures';

test.describe('Локалізація', () => {
  test('L1: перемикання UA → EN', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/?id=rycu0sei');

    await page.getByRole('button', { name: 'Змінити мову' }).click();

    const langButton = page.getByRole('button', { name: 'Change language' });
    await expect(langButton).toBeVisible();
    await expect(langButton).toHaveText('EN');
    await expect(page.getByRole('button', { name: 'Select multiple' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('L2: перемикання EN → UA', { tag: '@smoke' }, async ({ page }) => {
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

  test('L3: мова зберігається після reload', async ({ openApp, app, page }) => {
    await openApp();

    await app.langButton().click();
    await expect(app.langButton()).toHaveText('EN');
    expect(await page.evaluate(() => localStorage.getItem('leaflog_lang'))).toBe('en');

    await page.reload();

    await expect(app.langButton()).toHaveText('EN');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(app.bulkToggle()).toContainText('Select multiple');
  });

  test('L4: легенда, футер і підписи на картках змінюють мову', async ({ openApp, app, page }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера', waterFreq: 7, fertFreq: 30 })] });
    await expect(app.card('Монстера')).toContainText('Полив кожні 7 дн.');

    await app.langButton().click();

    await expect(app.chip('water-ok')).toHaveText('Watered');
    await expect(app.chip('water-today')).toHaveText('Water');
    await expect(app.chip('fert-ok')).toHaveText('Fertilized');
    await expect(app.chip('fert-due')).toHaveText('Needs fertilizer');
    await expect(app.chip('fert-off')).toHaveText("Don't fertilize");
    await expect(page.locator('.footer-tagline')).toHaveText('Care for your plants with ease');
    await expect(app.card('Монстера')).toContainText('Water every 7 days');
    await expect(app.card('Монстера')).toContainText('Fertilize every 30 days');
  });

  test('L5: відкрита деталь рослини перемальовується на новій мові', async ({ openApp, app, page }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await app.openCard('Монстера');
    await expect(page.locator('#waterBtn')).toHaveText('Полито');

    // Деталь — модальне вікно, воно перекриває шапку, тому звичайний click
    // на кнопці мови не пройде. Надсилаємо подію напряму: перевіряємо
    // саме логіку перемальовування, а не клікабельність.
    await app.langButton().dispatchEvent('click');

    await expect(page.locator('#waterBtn')).toHaveText('Watered');
    await expect(page.locator('#fertBtn')).toHaveText('Fertilized');
    await expect(page.locator('#editBtn')).toHaveText('Edit');
    await expect(page.locator('#detailInstructions')).toHaveText(
      'No instructions yet — add them while editing.',
    );
    await expect(app.detail()).toBeVisible();
  });

  test('L6: назва рослини, введена користувачем, не перекладається', async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Моя улюблена Монстера' })] });
    await expect(app.cardNames()).toHaveText(['Моя улюблена Монстера']);

    await app.langButton().click();

    await expect(app.langButton()).toHaveText('EN');
    await expect(app.cardNames()).toHaveText(['Моя улюблена Монстера']);
  });

  test('L7: лічильник у bulk-панелі змінює мову', async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Ліна' }), makePlant({ name: 'Мона' })] });

    await app.bulkToggle().click();
    await app.card('Ліна').click();
    await app.card('Мона').click();
    await expect(app.bulkCount()).toHaveText('2 обрано · застосується: нічого не вибрано');

    await app.langButton().click();

    await expect(app.bulkCount()).toHaveText('2 selected · will apply: nothing selected');
  });
});
