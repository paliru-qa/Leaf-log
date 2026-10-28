import { test, expect, makePlant, daysAgo } from './fixtures';

const plants = () => [
  makePlant({ name: 'Свіжа' }),
  makePlant({ name: 'Спрагла', lastWatered: daysAgo(10) }),
  makePlant({ name: 'Без добрива', fertEnabled: false }),
];

test.describe('Фільтри за статусом', () => {
  test('F1: клік на чіп показує лише рослини з цим статусом', async ({ openApp, app }) => {
    await openApp({ plants: plants() });
    await expect(app.cards()).toHaveCount(3);

    await app.chip('water-today').click();
    await expect(app.cardNames()).toHaveText(['Спрагла']);
    await expect(app.chip('water-today')).toHaveClass(/active/);

    // працює і для статусів добрива
    await app.chip('fert-off').click();
    await expect(app.cardNames()).toHaveText(['Без добрива']);
  });

  test('F2: другий клік скидає; одночасно активний лише один', async ({ openApp, app, page }) => {
    await openApp({ plants: plants() });

    await app.chip('water-today').click();
    await app.chip('fert-off').click();
    await expect(page.locator('#legend .legend-chip.active')).toHaveCount(1);
    await expect(app.chip('fert-off')).toHaveClass(/active/);
    await expect(app.chip('water-today')).not.toHaveClass(/active/);

    await app.chip('fert-off').click();
    await expect(page.locator('#legend .legend-chip.active')).toHaveCount(0);
    await expect(app.cards()).toHaveCount(3);
  });

  test('F3: порожній результат показує empty state, «Скинути фільтр» працює', async ({ openApp, app, page }) => {
    await openApp({ plants: plants() });

    await app.chip('fert-due').click(); // жодна рослина не чекає на добриво
    await expect(app.filterEmptyState()).toBeVisible();
    await expect(app.filterEmptyState()).toContainText('Немає рослин із таким статусом.');
    await expect(page.locator('#plantGrid')).toBeHidden();

    await page.locator('#filterResetBtn').click();

    await expect(app.filterEmptyState()).toBeHidden();
    await expect(app.cards()).toHaveCount(3);
    await expect(page.locator('#legend .legend-chip.active')).toHaveCount(0);
  });

  test('F4: клік на лого скидає фільтр', async ({ openApp, app, page }) => {
    await openApp({ plants: plants() });
    await app.chip('water-today').click();
    await expect(app.cards()).toHaveCount(1);

    await app.logo().click();

    await expect(app.cards()).toHaveCount(3);
    await expect(page.locator('#legend .legend-chip.active')).toHaveCount(0);
  });
});
