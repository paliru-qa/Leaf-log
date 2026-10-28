import { test, expect, makePlant } from './fixtures';

test.describe('Режими', () => {
  test('M1: Caretaker — «Нова рослина» disabled, але не зникає', async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await expect(app.addPlantButton()).toBeEnabled();

    await app.caretakerToggle().click();

    await expect(app.addPlantButton()).toBeVisible();
    await expect(app.addPlantButton()).toBeDisabled();
    await expect(app.addPlantButton()).toHaveClass(/is-disabled/);
    await app.addPlantButton().click({ force: true });
    await expect(app.form()).toBeHidden();

    await app.caretakerToggle().click();
    await expect(app.addPlantButton()).toBeEnabled();
  });

  test('M2: Caretaker — на картках інструкції та кнопки, в деталях немає «Редагувати»', async ({
    openApp, app, page,
  }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера', instructions: 'Поливати, коли підсохне' })] });

    // звичайний режим
    await expect(app.card('Монстера').locator('.card-instructions')).toHaveCount(0);
    await expect(app.card('Монстера').locator('.qa-btn')).toHaveCount(0);

    await app.caretakerToggle().click();

    await expect(app.card('Монстера').locator('.card-instructions')).toHaveText('Поливати, коли підсохне');
    await expect(app.card('Монстера').locator('.qa-btn.water')).toBeVisible();
    await expect(app.card('Монстера').locator('.qa-btn.fert')).toBeVisible();

    await app.openCard('Монстера');
    await expect(page.locator('#editBtn')).toBeHidden();
    await expect(page.locator('#waterBtn')).toBeVisible();
  });

  test('M3: Caretaker не зберігається після reload', async ({ openApp, app, page }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await app.caretakerToggle().click();
    await expect(app.caretakerToggle()).toHaveClass(/active/);

    await page.reload();

    await expect(app.caretakerToggle()).not.toHaveClass(/active/);
    await expect(app.addPlantButton()).toBeEnabled();
    await expect(app.card('Монстера').locator('.qa-btn')).toHaveCount(0);
  });

  test('M4: клік на лого виходить із caretaker і розблоковує «Нова рослина»', async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await app.caretakerToggle().click();
    await expect(app.addPlantButton()).toBeDisabled();

    await app.logo().click();

    await expect(app.caretakerToggle()).not.toHaveClass(/active/);
    await expect(app.addPlantButton()).toBeEnabled();
  });

  test.describe('M5: взаємовиключність режимів', () => {
    test.beforeEach(async ({ openApp }) => {
      await openApp({ plants: [makePlant({ name: 'Ліна' }), makePlant({ name: 'Мона' })] });
    });

    test('reorder вимикає caretaker', async ({ app }) => {
      await app.caretakerToggle().click();
      await app.reorderToggle().click();

      await expect(app.reorderToggle()).toHaveClass(/active/);
      await expect(app.caretakerToggle()).not.toHaveClass(/active/);
      await expect(app.addPlantButton()).toBeEnabled();
    });

    test('caretaker вимикає reorder', async ({ app, page }) => {
      await app.reorderToggle().click();
      await expect(page.locator('.plant-card.reorder-active')).toHaveCount(2);

      await app.caretakerToggle().click();

      await expect(app.reorderToggle()).not.toHaveClass(/active/);
      await expect(page.locator('.plant-card.reorder-active')).toHaveCount(0);
    });

    test('reorder вимикає bulk', async ({ app }) => {
      await app.bulkToggle().click();
      await app.card('Ліна').click();
      await expect(app.bulkBar()).toBeVisible();

      await app.reorderToggle().click();

      await expect(app.bulkToggle()).not.toHaveClass(/active/);
      await expect(app.bulkBar()).toBeHidden();
    });

    test('bulk вимикає reorder', async ({ app, page }) => {
      await app.reorderToggle().click();
      await app.bulkToggle().click();

      await expect(app.reorderToggle()).not.toHaveClass(/active/);
      await expect(page.locator('.plant-card.reorder-active')).toHaveCount(0);
    });

    test('«Відмітити всі» вимикає caretaker', async ({ app, page }) => {
      await app.caretakerToggle().click();

      await page.locator('#selectAllBtn').click();

      await expect(app.caretakerToggle()).not.toHaveClass(/active/);
      await expect(app.bulkToggle()).toHaveClass(/active/);
    });

    // Поточна поведінка: кнопки caretaker і bulk НЕ вимикають одна одну
    // (вмикаються разом). Дока каже «взаємовиключні». Якщо це баг — прибери fixme.
    test.fixme('caretaker вимикає bulk (за докою; зараз працює інакше)', async ({ app }) => {
      await app.bulkToggle().click();
      await app.caretakerToggle().click();

      await expect(app.bulkToggle()).not.toHaveClass(/active/);
    });
  });
});
