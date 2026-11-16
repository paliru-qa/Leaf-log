import { test, expect, makePlant } from './fixtures';

// Швидкі базові перевірки: застосунок завантажується і основні елементи на місці.
// Глибші сценарії — в окремих спеках (crud, filters, bulk …).
test.describe('Smoke', () => {
  test('S0: заголовок сторінки містить LeafLOG', { tag: '@smoke' }, async ({ openApp, page }) => {
    await openApp();

    await expect(page).toHaveTitle(/LeafLOG/);
  });

  test('S2: під час завантаження немає помилок у консолі', { tag: '@smoke' }, async ({ openApp, page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await expect(page.locator('#plantGrid .plant-card')).toHaveCount(1);

    expect(errors).toEqual([]);
  });

  test('S3: порожній список — показується порожній стан без карток', { tag: '@smoke' }, async ({ openApp, app }) => {
    await openApp();

    await expect(app.emptyState()).toBeVisible();
    await expect(app.cards()).toHaveCount(0);
    await expect(app.addPlantButton()).toBeVisible();
  });

  test('S4: рослини зі списку відображаються картками', { tag: '@smoke' }, async ({ openApp, app }) => {
    await openApp({
      plants: [makePlant({ name: 'Монстера' }), makePlant({ name: 'Фікус' }), makePlant({ name: 'Алое' })],
    });

    await expect(app.emptyState()).toBeHidden();
    await expect(app.cardNames()).toHaveText(['Монстера', 'Фікус', 'Алое']);
  });

  test('S5: кнопки шапки на місці', { tag: '@smoke' }, async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });

    await expect(app.logo()).toBeVisible();
    await expect(app.langButton()).toBeVisible();
    await expect(app.addPlantButton()).toBeVisible();
    await expect(app.caretakerToggle()).toBeVisible();
    await expect(app.bulkToggle()).toBeVisible();
  });

  test('S6: «Додати рослину» відкриває форму, закриття ховає її', { tag: '@smoke' }, async ({ openApp, app }) => {
    await openApp();

    await app.addPlantButton().click();
    await expect(app.form()).toBeVisible();
    await expect(app.nameInput()).toBeVisible();

    await app.form().locator('[data-close-form]').first().click();
    await expect(app.form()).toBeHidden();
  });

  test('S7: клік по картці відкриває деталі, закриття повертає до списку', { tag: '@smoke' }, async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });

    await app.openCard('Монстера');
    await app.detailClose().first().click();

    await expect(app.detail()).toBeHidden();
    await expect(app.cards()).toHaveCount(1);
  });

  test('S8: футер показує підпис і кнопку нового списку', { tag: '@smoke' }, async ({ openApp, page }) => {
    await openApp();

    await expect(page.locator('.footer-tagline')).toBeVisible();
    await expect(page.locator('#newListBtn')).toBeVisible();
  });
});
