import { test, expect, makePlant, captureDialogs, PNG_1X1, PNG_DATA_URL, TODAY } from './fixtures';

test.describe('CRUD і фото', () => {
  test('C1: додати рослину лише з назвою', { tag: '@smoke' }, async ({ openApp, app, backend, listId }) => {
    await openApp();
    await expect(app.emptyState()).toBeVisible();

    await app.addPlantButton().click();
    await expect(app.formTitle()).toHaveText('Додати рослину');
    await app.fillAndSavePlant('Монстера');

    await expect(app.cardNames()).toHaveText(['Монстера']);
    await expect(app.emptyState()).toBeHidden();
    await expect(app.card('Монстера')).toContainText('Полив кожні 7 дн.');
    await expect.poll(() => backend.plants(listId).map((p) => p.name)).toEqual(['Монстера']);
    expect(backend.plants(listId)[0]).toMatchObject({ waterFreq: 7, fertEnabled: true, lastWatered: TODAY });
  });

  test('C2: порожня назва — форма не зберігається', { tag: '@smoke' }, async ({ openApp, app, backend }) => {
    await openApp();
    await app.addPlantButton().click();

    await test.step('зовсім порожнє поле (блокує браузер, required)', async () => {
      await app.saveButton().click();
      await expect(app.form()).toBeVisible();
    });

    await test.step('самі пробіли (блокує JS-перевірка)', async () => {
      await app.nameInput().fill('   ');
      await app.saveButton().click();
      await expect(app.form()).toBeVisible();
      await expect(app.nameInput()).toBeFocused();
    });

    expect(backend.plantWrites).toHaveLength(0);
    await expect(app.emptyState()).toBeVisible();
  });

  test('C3: редагування — форма заповнена, зміни зберігаються', async ({ openApp, app, backend, listId, page }) => {
    const plant = makePlant({ name: 'Фікус', latin: 'Ficus', room: 'Кухня', waterFreq: 5 });
    await openApp({ plants: [plant] });

    await app.openCard('Фікус');
    await page.locator('#editBtn').click();

    await expect(app.formTitle()).toHaveText('Редагувати рослину');
    await expect(app.nameInput()).toHaveValue('Фікус');
    await expect(page.locator('#latinInput')).toHaveValue('Ficus');
    await expect(page.locator('#roomInput')).toHaveValue('Кухня');
    await expect(page.locator('#waterFreqInput')).toHaveValue('5');
    await expect(page.locator('#deleteBtn')).toBeVisible();

    await app.nameInput().fill('Фікус Бенджаміна');
    await page.locator('#roomInput').fill('Вітальня');
    await page.locator('#waterFreqInput').fill('10');
    await app.saveButton().click();
    await expect(app.form()).toBeHidden();

    await expect(app.cardNames()).toHaveText(['Фікус Бенджаміна']);
    await expect.poll(() => backend.plants(listId)[0]?.room).toBe('Вітальня');
    expect(backend.plants(listId)[0]).toMatchObject({
      id: plant.id,
      name: 'Фікус Бенджаміна',
      waterFreq: 10,
    });
    expect(backend.plants(listId)).toHaveLength(1);
  });

  test('C4: видалення — confirm OK видаляє', async ({ openApp, app, backend, listId, page }) => {
    const plant = makePlant({ name: 'Фікус' });
    const dialogs = captureDialogs(page, true);
    await openApp({ plants: [plant] });

    await app.openCard('Фікус');
    await page.locator('#editBtn').click();
    await page.locator('#deleteBtn').click();

    await expect(app.form()).toBeHidden();
    await expect(app.emptyState()).toBeVisible();
    expect(dialogs[0]).toMatchObject({ type: 'confirm', message: 'Видалити цю рослину зі списку?' });
    await expect.poll(() => backend.plants(listId)).toHaveLength(0);
    await expect.poll(() => backend.photoDeletes).toContain(plant.id);
  });

  test('C4b: видалення — Cancel залишає рослину', async ({ openApp, app, backend, listId, page }) => {
    const plant = makePlant({ name: 'Фікус' });
    captureDialogs(page, false);
    await openApp({ plants: [plant] });

    await app.openCard('Фікус');
    await page.locator('#editBtn').click();
    await page.locator('#deleteBtn').click();

    await expect(app.form()).toBeVisible();
    expect(backend.plants(listId)).toHaveLength(1);
    expect(backend.plantWrites).toHaveLength(0);

    await app.form().locator('.close-btn[data-close-form]').click();
    await expect(app.cardNames()).toHaveText(['Фікус']);
  });

  const closers = {
    'кнопку ×': (app: import('./fixtures').LeafLog) => app.form().locator('.close-btn[data-close-form]').click(),
    '«Скасувати»': (app: import('./fixtures').LeafLog) =>
      app.form().getByRole('button', { name: 'Скасувати' }).click(),
    'клік на фон': (app: import('./fixtures').LeafLog) => app.form().click({ position: { x: 5, y: 5 } }),
  };

  for (const [label, close] of Object.entries(closers)) {
    test(`C5: закриття форми через ${label} не зберігає зміни`, async ({ openApp, app, backend, page }) => {
      await openApp({ plants: [makePlant({ name: 'Оригінал' })] });
      await app.openCard('Оригінал');
      await page.locator('#editBtn').click();
      await app.nameInput().fill('Змінено');

      await close(app);

      await expect(app.form()).toBeHidden();
      await expect(app.cardNames()).toHaveText(['Оригінал']);
      expect(backend.plantWrites).toHaveLength(0);

      await app.card('Оригінал').click();
      await page.locator('#editBtn').click();
      await expect(app.nameInput()).toHaveValue('Оригінал');
    });
  }

  test('C6: завантаження фото — thumbnail у формі, фото на картці', async ({ openApp, app, backend, listId, page }) => {
    await openApp();
    await app.addPlantButton().click();
    await app.nameInput().fill('Фіалка');

    await page.locator('#photoInput').setInputFiles({ name: 'leaf.png', mimeType: 'image/png', buffer: PNG_1X1 });
    await expect(page.locator('#photoThumbs .photo-thumb img')).toHaveCount(1);

    await app.saveButton().click();
    await expect(app.form()).toBeHidden();

    await expect(app.card('Фіалка').locator('.card-photo-wrap img')).toHaveAttribute('src', /^data:image\//);
    await expect.poll(() => backend.photosOf(listId, backend.plant(listId, 'Фіалка')!.id).length).toBe(1);
  });

  test('C7: 2+ фото — бейдж на картці, «Порівняти» лише при ≥2', async ({ openApp, app, backend, listId, page }) => {
    const one = makePlant({ name: 'Одне фото' });
    const two = makePlant({ name: 'Два фото' });
    backend.seedPhotos(listId, one.id, [{ id: 'a', url: PNG_DATA_URL, date: TODAY }]);
    backend.seedPhotos(listId, two.id, [
      { id: 'b', url: PNG_DATA_URL, date: TODAY },
      { id: 'c', url: PNG_DATA_URL, date: TODAY },
    ]);
    await openApp({ plants: [one, two] });

    // фото підвантажуються окремими запитами вже після першого рендеру
    await expect(app.card('Два фото').locator('.photo-count')).toHaveText('2 📷');
    await expect(app.card('Одне фото').locator('.card-photo-wrap img')).toHaveAttribute('src', /^data:image\//);
    await expect(app.card('Одне фото').locator('.photo-count')).toHaveCount(0);

    await app.openCard('Два фото');
    await expect(page.locator('#compareLink')).toBeVisible();
    await app.detailClose().click();

    await app.openCard('Одне фото');
    await expect(page.locator('#compareLink')).toBeHidden();
  });

  test('P1: після reload рослини на місці', { tag: '@smoke' }, async ({ openApp, app, page }) => {
    await openApp();
    await app.addPlantButton().click();
    await app.fillAndSavePlant('Монстера');
    await expect(app.cardNames()).toHaveText(['Монстера']);

    await page.reload();

    await expect(app.cardNames()).toHaveText(['Монстера']);
    await expect(app.emptyState()).toBeHidden();
  });
});
