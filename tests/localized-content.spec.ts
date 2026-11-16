import { test, expect, makePlant, TODAY, PNG_DATA_URL } from './fixtures';

// Feature: англійська версія назви й інструкцій (LC-010 … LC-016, AC-LC-01 … 04, 13).
// Етап «показ»: рослини з полями nameEn / instructionsEn подаються через мок API,
// форма для їх введення додається окремим етапом.

const monstera = () =>
  makePlant({
    name: 'Монстера',
    instructions: 'Поливати після підсихання ґрунту',
    nameEn: 'Monstera',
    instructionsEn: 'Water when the soil is dry',
  });

test.describe('Локалізований контент: показ', () => {
  test('AC-LC-01: без англійських полів в EN-інтерфейсі показується оригінал', async ({ openApp, app }) => {
    await openApp({
      lang: 'en',
      plants: [makePlant({ name: 'Фікус', instructions: 'Не переливати' })],
    });

    await expect(app.cardNames()).toHaveText(['Фікус']);
    await app.caretakerToggle().click();
    await expect(app.card('Фікус').locator('.card-instructions')).toHaveText('Не переливати');
    await app.openCard('Фікус');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Не переливати');
  });

  test('LC-010: в українському інтерфейсі завжди оригінал, навіть якщо англійська версія є', async ({ openApp, app }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });

    await expect(app.cardNames()).toHaveText(['Монстера']);
    await app.openCard('Монстера');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Поливати після підсихання ґрунту');
  });

  test('AC-LC-02: картка в EN показує nameEn; в Caretaker — instructionsEn', async ({ openApp, app }) => {
    await openApp({ lang: 'en', plants: [monstera()] });

    await expect(app.cardNames()).toHaveText(['Monstera']);
    await expect(app.card('Monstera')).not.toContainText('Монстера');
    await app.caretakerToggle().click();
    await expect(app.card('Monstera').locator('.card-instructions')).toHaveText('Water when the soil is dry');
  });

  test('AC-LC-02: деталі в EN показують nameEn та instructionsEn', async ({ openApp, app }) => {
    await openApp({ lang: 'en', plants: [monstera()] });

    await app.openCard('Monstera');

    await expect(app.detailName()).toHaveText('Monstera');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Water when the soil is dry');
  });

  test('AC-LC-02: порівняння фото в EN показує nameEn у заголовку', async ({ openApp, backend, listId, app, page }) => {
    const plant = monstera();
    backend.seedPhotos(listId, plant.id, [
      { id: 'a', url: PNG_DATA_URL, date: TODAY },
      { id: 'b', url: PNG_DATA_URL, date: TODAY },
    ]);
    await openApp({ lang: 'en', plants: [plant] });

    await app.openCard('Monstera');
    await page.locator('#compareLink').click();

    await expect(page.locator('#compareplantName')).toHaveText('Monstera');
  });

  test('AC-LC-02: календар підживлення в EN показує nameEn', async ({ openApp, app, page }) => {
    await openApp({ lang: 'en', plants: [monstera()] });

    await page.locator('#fertCalTriggerBtn').click();
    await page.locator('#fertCalGrid .fertcal-today').click();

    await expect(page.locator('#fertCalSelectedList .fertcal-plant-name')).toHaveText(['Monstera']);
  });

  test('LC-013: alt фото на картці й у деталях — відображувана назва', async ({ openApp, backend, listId, app }) => {
    const plant = monstera();
    backend.seedPhotos(listId, plant.id, [{ id: 'a', url: PNG_DATA_URL, date: TODAY }]);
    await openApp({ lang: 'en', plants: [plant] });

    await expect(app.card('Monstera').locator('.card-photo-wrap img')).toHaveAttribute('alt', 'Monstera');
    await app.openCard('Monstera');
    await expect(app.page.locator('#detailPhotoWrap img')).toHaveAttribute('alt', 'Monstera');
  });

  test('AC-LC-03: поля падають на оригінал незалежно одне від одного', async ({ openApp, app }) => {
    await openApp({
      lang: 'en',
      plants: [
        makePlant({ name: 'Фікус', instructions: 'Не переливати', instructionsEn: 'Do not overwater' }),
        makePlant({ name: 'Алоє', instructions: 'Рідко поливати', nameEn: 'Aloe' }),
      ],
    });

    // Фікус: назва — оригінал, інструкції — англійські
    await app.openCard('Фікус');
    await expect(app.detailName()).toHaveText('Фікус');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Do not overwater');
    await app.detailClose().click();

    // Алоє: назва — англійська, інструкції — оригінал
    await app.openCard('Aloe');
    await expect(app.detailName()).toHaveText('Aloe');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Рідко поливати');
  });

  test('LC-011: англійська версія з самих пробілів вважається порожньою', async ({ openApp, app }) => {
    await openApp({
      lang: 'en',
      plants: [makePlant({ name: 'Фікус', instructions: 'Не переливати', nameEn: '   ', instructionsEn: '  ' })],
    });

    await expect(app.cardNames()).toHaveText(['Фікус']);
    await app.openCard('Фікус');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Не переливати');
  });

  test('LC-014: без жодних інструкцій у деталях стандартний текст на мові інтерфейсу', async ({ openApp, app }) => {
    await openApp({ lang: 'en', plants: [makePlant({ name: 'Фікус', nameEn: 'Ficus', instructions: '' })] });

    await app.openCard('Ficus');

    await expect(app.page.locator('#detailInstructions')).toHaveText('No instructions yet — add them while editing.');
  });

  test('LC-016: порядок рослин не залежить від мови і від англійських назв', async ({ openApp, app }) => {
    await openApp({
      lang: 'en',
      plants: [
        makePlant({ name: 'Алоє', nameEn: 'Zebra plant' }),
        makePlant({ name: 'Бегонія', nameEn: 'Apple' }),
      ],
    });

    await expect(app.cardNames()).toHaveText(['Zebra plant', 'Apple']);

    await app.langButton().click();
    await expect(app.cardNames()).toHaveText(['Алоє', 'Бегонія']);
  });

  test('LC-043: Ask AI надсилає відображувану назву та мову інтерфейсу', async ({ openApp, app, page }) => {
    const bodies: Record<string, string>[] = [];
    await page.route('**/api/diagnose', (route) => {
      bodies.push(route.request().postDataJSON());
      return route.fulfill({ json: { answer: 'ok' } });
    });
    await openApp({ lang: 'en', plants: [monstera()] });
    await app.openCard('Monstera');
    await page.locator('#questionInput').fill('Yellow leaves');
    await page.locator('#askAiBtn').click();
    await expect(page.locator('#aiAnswerBox')).toHaveText('ok');

    expect(bodies[0]).toMatchObject({ name: 'Monstera', lang: 'en' });
  });
});

test.describe('Локалізований контент: перемикання мови (LC-015, AC-LC-04)', () => {
  test('відкриті деталі перемальовуються без перезавантаження', async ({ openApp, app }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });
    await app.openCard('Монстера');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Поливати після підсихання ґрунту');

    // Деталі перекривають шапку, тому подія надсилається напряму (як у L5).
    await app.langButton().dispatchEvent('click');

    await expect(app.detailName()).toHaveText('Monstera');
    await expect(app.page.locator('#detailInstructions')).toHaveText('Water when the soil is dry');

    await app.langButton().dispatchEvent('click');
    await expect(app.detailName()).toHaveText('Монстера');
  });

  test('відкрите порівняння фото перемальовується', async ({ openApp, backend, listId, app, page }) => {
    const plant = monstera();
    backend.seedPhotos(listId, plant.id, [
      { id: 'a', url: PNG_DATA_URL, date: TODAY },
      { id: 'b', url: PNG_DATA_URL, date: TODAY },
    ]);
    await openApp({ lang: 'uk', plants: [plant] });
    await app.openCard('Монстера');
    await page.locator('#compareLink').click();
    await expect(page.locator('#compareplantName')).toHaveText('Монстера');

    await app.langButton().dispatchEvent('click');

    await expect(page.locator('#compareplantName')).toHaveText('Monstera');
  });

  test('відкритий календар підживлення перемальовується', async ({ openApp, app, page }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });
    await page.locator('#fertCalTriggerBtn').click();
    await page.locator('#fertCalGrid .fertcal-today').click();
    await expect(page.locator('#fertCalSelectedList .fertcal-plant-name')).toHaveText(['Монстера']);

    await app.langButton().dispatchEvent('click');

    await expect(page.locator('#fertCalSelectedList .fertcal-plant-name')).toHaveText(['Monstera']);
  });
});
