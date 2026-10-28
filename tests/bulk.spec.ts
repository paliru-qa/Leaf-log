import { test, expect, makePlant, captureDialogs, daysAgo, TODAY } from './fixtures';

const OLD = daysAgo(10);
const plants = () => [
  makePlant({ name: 'Ліна', lastWatered: OLD }),
  makePlant({ name: 'Мона', lastWatered: OLD }),
  makePlant({ name: 'Нора', lastWatered: OLD }),
];

test.describe('Bulk', () => {
  test('B1: панель видима лише при ≥1 вибраній рослині', async ({ openApp, app }) => {
    await openApp({ plants: plants() });

    await app.bulkToggle().click();
    await expect(app.bulkBar()).toBeHidden();

    await app.card('Ліна').click();
    await expect(app.bulkBar()).toBeVisible();
    await expect(app.bulkCount()).toContainText('1 обрано');

    await app.card('Ліна').click();
    await expect(app.bulkBar()).toBeHidden();
  });

  test('B2: «Удобрено» автоматично вмикає «Полито»', async ({ openApp, app, page }) => {
    await openApp({ plants: plants() });
    await app.bulkToggle().click();
    await app.card('Ліна').click();

    await page.locator('#bulkFertToggle').click();

    await expect(page.locator('#bulkFertToggle')).toHaveClass(/active/);
    await expect(page.locator('#bulkWaterToggle')).toHaveClass(/active/);
    await expect(app.bulkCount()).toContainText('полив і добриво');
  });

  test('B3: «Застосувати» без вибору дії — alert, popover не відкривається', async ({ openApp, app, page }) => {
    const dialogs = captureDialogs(page, true);
    await openApp({ plants: plants() });
    await app.bulkToggle().click();
    await app.card('Ліна').click();

    await page.locator('#bulkApplyBtn').click();

    await expect.poll(() => dialogs.length).toBe(1);
    expect(dialogs[0]).toMatchObject({
      type: 'alert',
      message: 'Обери хоча б одне — «Полито» або «Удобрено» — перед застосуванням.',
    });
    await expect(app.popover()).toBeHidden();
  });

  async function applyWaterToTwo(app: import('./fixtures').LeafLog, page: import('@playwright/test').Page) {
    await app.bulkToggle().click();
    await app.card('Ліна').click();
    await app.card('Мона').click();
    await page.locator('#bulkWaterToggle').click();
    await page.locator('#bulkApplyBtn').click();
    await app.confirmPopover();
  }

  test('B4: «Застосувати» з датою — усі вибрані оновились, інші ні', async ({ openApp, app, backend, listId, page }) => {
    await openApp({ plants: plants() });

    await applyWaterToTwo(app, page);

    await expect(app.waterBadge('Ліна')).toHaveText('Полито');
    await expect(app.waterBadge('Мона')).toHaveText('Полито');
    await expect(app.waterBadge('Нора')).toHaveText('Полити');
    await expect(app.bulkBar()).toBeHidden();
    await expect(app.bulkToggle()).not.toHaveClass(/active/);
    await expect(app.undoToast()).toContainText('Оновлено полив для 2 рослин');
    await expect.poll(() => backend.plant(listId, 'Ліна')?.lastWatered).toBe(TODAY);
    expect(backend.plant(listId, 'Мона')?.lastWatered).toBe(TODAY);
    expect(backend.plant(listId, 'Нора')?.lastWatered).toBe(OLD);
  });

  test('B5: Undo повертає старі дати', async ({ openApp, app, backend, listId, page }) => {
    await openApp({ plants: plants() });
    await applyWaterToTwo(app, page);
    await expect(app.waterBadge('Ліна')).toHaveText('Полито');

    await page.locator('#undoToastBtn').click();

    await expect(app.waterBadge('Ліна')).toHaveText('Полити');
    await expect(app.waterBadge('Мона')).toHaveText('Полити');
    await expect(app.undoToast()).toBeHidden();
    await expect.poll(() => backend.plant(listId, 'Ліна')?.lastWatered).toBe(OLD);
    expect(backend.plant(listId, 'Мона')?.lastWatered).toBe(OLD);
  });

  test('B6: тост зникає через 15 с', async ({ openApp, app, page }) => {
    await openApp({ plants: plants() });
    await applyWaterToTwo(app, page);
    await expect(app.undoToast()).toBeVisible();

    await page.clock.fastForward(14_000);
    await expect(app.undoToast()).toBeVisible();

    await page.clock.fastForward(2_000);
    await expect(app.undoToast()).toBeHidden();
  });
});
