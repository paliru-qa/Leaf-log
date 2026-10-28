import { test, expect, makePlant } from './fixtures';

const three = () => [
  makePlant({ name: 'Алоє' }),
  makePlant({ name: 'Бегонія' }),
  makePlant({ name: 'Каланхое' }),
];

test.describe('Reorder', () => {
  test('R1: у reorder-режимі клік на картку не відкриває деталі', async ({ openApp, app }) => {
    await openApp({ plants: three() });

    await app.reorderToggle().click();
    await expect(app.page.locator('.card-drag-handle')).toHaveCount(3);
    await app.card('Алоє').click();

    await expect(app.detail()).toBeHidden();
  });

  test('R2: drag за ручку змінює порядок, після reload він збережений', async ({ openApp, app, backend, listId, page }) => {
    await openApp({ plants: three() });
    await app.reorderToggle().click();

    const handle = await app.card('Алоє').locator('.card-drag-handle').boundingBox();
    const target = await app.card('Каланхое').boundingBox();
    expect(handle && target).toBeTruthy();
    const hx = handle!.x + handle!.width / 2;
    const hy = handle!.y + handle!.height / 2;

    // Логіка drag на pointer events з порогом 6 px: рухаємо кількома кроками.
    await page.mouse.move(hx, hy);
    await page.mouse.down();
    await page.mouse.move(hx + 20, hy + 8, { steps: 5 });
    await page.mouse.move(target!.x + target!.width * 0.9, target!.y + target!.height / 2, { steps: 15 });
    // placeholder переїхав в кінець — тоді відпускаємо
    await expect(page.locator('#plantGrid > *').last()).toHaveClass(/reorder-placeholder/);
    await page.mouse.up();

    await expect(app.cardNames()).toHaveText(['Бегонія', 'Каланхое', 'Алоє']);
    await expect.poll(() => backend.plants(listId).map((p) => p.name)).toEqual(['Бегонія', 'Каланхое', 'Алоє']);

    await page.reload();
    await expect(app.cardNames()).toHaveText(['Бегонія', 'Каланхое', 'Алоє']);
  });
});

test.describe('Деталі рослини', () => {
  test('D1: стрілки prev/next, перехід по колу', async ({ openApp, app, page }) => {
    await openApp({ plants: three() });
    await app.openCard('Алоє');
    await expect(page.locator('#swipeCounter')).toHaveText('1 / 3');

    await page.locator('#nextPlantBtn').click();
    await expect(app.detailName()).toHaveText('Бегонія');
    await page.locator('#nextPlantBtn').click();
    await expect(app.detailName()).toHaveText('Каланхое');
    await expect(page.locator('#swipeCounter')).toHaveText('3 / 3');

    await page.locator('#nextPlantBtn').click(); // з останньої — на першу
    await expect(app.detailName()).toHaveText('Алоє');

    await page.locator('#prevPlantBtn').click(); // з першої — на останню
    await expect(app.detailName()).toHaveText('Каланхое');
  });

  test('D2: відкриття іншої деталі скидає поле питання до ШІ', async ({ openApp, app, page }) => {
    await page.route('**/api/diagnose', (route) => route.fulfill({ json: { answer: 'Поливай рідше' } }));
    await openApp({ plants: three() });
    await app.openCard('Алоє');

    await page.locator('#questionInput').fill('Жовтіє листя');
    await page.locator('#askAiBtn').click();
    await expect(page.locator('#aiAnswerBox')).toHaveText('Поливай рідше');

    await page.locator('#nextPlantBtn').click();
    await expect(app.detailName()).toHaveText('Бегонія');

    await expect(page.locator('#questionInput')).toHaveValue('');
    await expect(page.locator('#aiAnswerBox')).toBeHidden();
  });
});
