import { test, expect, makePlant, daysAgo, TODAY } from './fixtures';

test.describe('Логіка поливу й добрива', () => {
  test('W1: «Полито» через date popover — статус і дата оновилися', { tag: '@smoke' }, async ({
    openApp, app, backend, listId, page,
  }) => {
    await openApp({ plants: [makePlant({ name: 'Спрагла', lastWatered: daysAgo(10) })] });
    await expect(app.waterBadge('Спрагла')).toHaveText('Полити');

    await app.openCard('Спрагла');
    await page.locator('#waterBtn').click();
    await expect(app.popoverInput()).toHaveValue(TODAY);
    await app.confirmPopover();

    await expect(app.waterBadge('Спрагла')).toHaveText('Полито');
    await expect(page.locator('#detailWaterInfo')).toContainText('15');
    await expect.poll(() => backend.plants(listId)[0].lastWatered).toBe(TODAY);
  });

  test('W1b: «Полито» зі швидкої кнопки на картці в caretaker-режимі', async ({ openApp, app, backend, listId }) => {
    await openApp({ plants: [makePlant({ name: 'Спрагла', lastWatered: daysAgo(10) })] });
    await app.caretakerToggle().click();

    await app.card('Спрагла').locator('.qa-btn.water').click();
    await app.confirmPopover();

    await expect(app.waterBadge('Спрагла')).toHaveText('Полито');
    await expect.poll(() => backend.plants(listId)[0].lastWatered).toBe(TODAY);
  });

  test('W2: статус поливу залежить від інтервалу (межа: рівно N днів = «Полити»)', async ({ openApp, app }) => {
    await openApp({
      plants: [
        makePlant({ name: 'Сьогодні', waterFreq: 7, lastWatered: daysAgo(0) }),
        makePlant({ name: 'Шість днів', waterFreq: 7, lastWatered: daysAgo(6) }),
        makePlant({ name: 'Сім днів', waterFreq: 7, lastWatered: daysAgo(7) }),
        makePlant({ name: 'Місяць', waterFreq: 7, lastWatered: daysAgo(30) }),
        makePlant({ name: 'Інтервал 3, два дні', waterFreq: 3, lastWatered: daysAgo(2) }),
        makePlant({ name: 'Інтервал 3, три дні', waterFreq: 3, lastWatered: daysAgo(3) }),
      ],
    });

    await expect(app.waterBadge('Сьогодні')).toHaveText('Полито');
    await expect(app.waterBadge('Шість днів')).toHaveText('Полито');
    await expect(app.waterBadge('Сім днів')).toHaveText('Полити');
    await expect(app.waterBadge('Місяць')).toHaveText('Полити');
    await expect(app.waterBadge('Інтервал 3, два дні')).toHaveText('Полито');
    await expect(app.waterBadge('Інтервал 3, три дні')).toHaveText('Полити');
  });

  test('W3: без lastWatered — статус «Полити»', async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Без дати', lastWatered: '', lastFertilized: '' })] });

    await expect(app.waterBadge('Без дати')).toHaveText('Полити');
    await expect(app.fertBadge('Без дати')).toHaveText('Удобрити');
  });

  test('W4: добриво вимкнене — «Не удобрювати»', async ({ openApp, app }) => {
    await openApp({ plants: [makePlant({ name: 'Кактус', fertEnabled: false })] });

    await expect(app.fertBadge('Кактус')).toHaveText('Не удобрювати');
    await expect(app.card('Кактус')).toContainText('Добриво не потрібне');

    await app.openCard('Кактус');
    await expect(app.page.locator('#detailFertInfo')).toHaveText('Зараз не потрібне');
  });

  test('W5: добриво увімкнене — «Удобрено» / «Удобрити» за інтервалом', async ({ openApp, app }) => {
    await openApp({
      plants: [
        makePlant({ name: 'Двадцять дев’ять', fertFreq: 30, lastFertilized: daysAgo(29) }),
        makePlant({ name: 'Тридцять', fertFreq: 30, lastFertilized: daysAgo(30) }),
      ],
    });

    await expect(app.fertBadge('Двадцять дев’ять')).toHaveText('Удобрено');
    await expect(app.fertBadge('Тридцять')).toHaveText('Удобрити');
  });

  test('W6: «Удобрено» ставить і lastFertilized, і lastWatered', async ({ openApp, app, backend, listId, page }) => {
    await openApp({
      plants: [makePlant({ name: 'Голодна', lastWatered: daysAgo(10), lastFertilized: daysAgo(40) })],
    });
    await expect(app.waterBadge('Голодна')).toHaveText('Полити');
    await expect(app.fertBadge('Голодна')).toHaveText('Удобрити');

    await app.openCard('Голодна');
    await page.locator('#fertBtn').click();
    await app.confirmPopover();

    await expect(app.waterBadge('Голодна')).toHaveText('Полито');
    await expect(app.fertBadge('Голодна')).toHaveText('Удобрено');
    await expect.poll(() => backend.plants(listId)[0].lastFertilized).toBe(TODAY);
    expect(backend.plants(listId)[0].lastWatered).toBe(TODAY);
  });

  test('W7: date popover — max = сьогодні', async ({ openApp, app, page }) => {
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });

    await app.openCard('Монстера');
    await page.locator('#waterBtn').click();
    await expect(app.popoverInput()).toHaveAttribute('max', TODAY);
    await expect(app.popoverInput()).toHaveValue(TODAY);

    // Клік повз popover закриває його (він перекриває кнопку «Удобрено»).
    await app.detailName().click();
    await expect(app.popover()).toBeHidden();

    // другий popover (добриво) має те саме обмеження
    await page.locator('#fertBtn').click();
    await expect(app.popoverInput()).toHaveAttribute('max', TODAY);
  });
});
