import { test, expect, makePlant, captureDialogs, daysAgo, TODAY, type LeafLog } from './fixtures';
import type { Page } from '@playwright/test';

// Feature: англійська версія назви й інструкцій, етап «форма» (LC-020 … LC-043, AC-LC-05 … 12, 14).

const monstera = () =>
  makePlant({
    name: 'Монстера',
    instructions: 'Поливати після підсихання ґрунту',
    nameEn: 'Monstera',
    instructionsEn: 'Water when the soil is dry',
  });

async function openEditForm(app: LeafLog, page: Page, shownName: string) {
  await app.openCard(shownName);
  await page.locator('#editBtn').click();
  await expect(app.form()).toBeVisible();
}

async function saveForm(app: LeafLog, backend: { plantWrites: unknown[] }) {
  const before = backend.plantWrites.length;
  await app.saveButton().click();
  await expect(app.form()).toBeHidden();
  await expect.poll(() => backend.plantWrites.length).toBeGreaterThan(before);
}

test.describe('EN-версія: форма редагування', () => {
  test('LC-023: EN-форма підставляє nameEn / instructionsEn', async ({ openApp, app, page }) => {
    await openApp({ lang: 'en', plants: [monstera()] });

    await openEditForm(app, page, 'Monstera');

    await expect(app.nameInput()).toHaveValue('Monstera');
    await expect(page.locator('#instructionsInput')).toHaveValue('Water when the soil is dry');
  });

  test('LC-023: без англійської версії EN-форма підставляє оригінал', async ({ openApp, app, page }) => {
    await openApp({
      lang: 'en',
      plants: [makePlant({ name: 'Фікус', instructions: 'Не переливати' })],
    });

    await openEditForm(app, page, 'Фікус');

    await expect(app.nameInput()).toHaveValue('Фікус');
    await expect(page.locator('#instructionsInput')).toHaveValue('Не переливати');
  });

  test('LC-022: UA-форма підставляє оригінал навіть якщо англійська версія є', async ({ openApp, app, page }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });

    await openEditForm(app, page, 'Монстера');

    await expect(app.nameInput()).toHaveValue('Монстера');
    await expect(page.locator('#instructionsInput')).toHaveValue('Поливати після підсихання ґрунту');
  });

  test('AC-LC-06: нова назва в EN-формі пишеться в nameEn, оригінал не змінюється', async ({
    openApp, backend, listId, app, page,
  }) => {
    const plant = makePlant({ name: 'Фікус' });
    await openApp({ lang: 'en', plants: [plant] });
    await openEditForm(app, page, 'Фікус');

    await app.nameInput().fill('Ficus');
    await page.locator('#instructionsInput').fill('Do not overwater');
    await saveForm(app, backend);

    const saved = backend.plants(listId)[0];
    expect(saved).toMatchObject({
      id: plant.id,
      name: 'Фікус',
      instructions: '',
      nameEn: 'Ficus',
      instructionsEn: 'Do not overwater',
    });
    await expect(app.cardNames()).toHaveText(['Ficus']);
    await app.langButton().click();
    await expect(app.cardNames()).toHaveText(['Фікус']);
  });

  test('AC-LC-07: в EN-формі назву можна очистити, тоді знову показується оригінал', async ({
    openApp, backend, listId, app, page,
  }) => {
    await openApp({ lang: 'en', plants: [monstera()] });
    await openEditForm(app, page, 'Monstera');
    await expect(app.nameInput()).not.toHaveAttribute('required', /.*/);

    await app.nameInput().fill('');
    await page.locator('#instructionsInput').fill('');
    await saveForm(app, backend);

    const saved = backend.plants(listId)[0];
    expect(saved.name).toBe('Монстера');
    expect(saved).not.toHaveProperty('nameEn');
    expect(saved).not.toHaveProperty('instructionsEn');
    await expect(app.cardNames()).toHaveText(['Монстера']);
  });

  test('AC-LC-08: збереження EN-форми без змін не створює англійських полів', async ({
    openApp, backend, listId, app, page,
  }) => {
    await openApp({
      lang: 'en',
      plants: [makePlant({ name: 'Фікус', instructions: 'Не переливати' })],
    });
    await openEditForm(app, page, 'Фікус');

    await saveForm(app, backend);

    const saved = backend.plants(listId)[0];
    expect(saved).toMatchObject({ name: 'Фікус', instructions: 'Не переливати' });
    expect(saved).not.toHaveProperty('nameEn');
    expect(saved).not.toHaveProperty('instructionsEn');
  });

  test('LC-024: значення, що збігається з оригіналом, не зберігається як англійська версія', async ({
    openApp, backend, listId, app, page,
  }) => {
    await openApp({ lang: 'en', plants: [monstera()] });
    await openEditForm(app, page, 'Monstera');

    await app.nameInput().fill('  Монстера  ');
    await saveForm(app, backend);

    expect(backend.plants(listId)[0]).not.toHaveProperty('nameEn');
    expect(backend.plants(listId)[0].instructionsEn).toBe('Water when the soil is dry');
  });
});

test.describe('EN-версія: збереження не губить англійські поля', () => {
  test('AC-LC-05: редагування в UA-формі лишає англійську версію (і після reload)', async ({
    openApp, backend, listId, app, page,
  }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });
    await openEditForm(app, page, 'Монстера');

    await app.nameInput().fill('Монстера велика');
    await page.locator('#roomInput').fill('Вітальня');
    await saveForm(app, backend);

    expect(backend.plants(listId)[0]).toMatchObject({
      name: 'Монстера велика',
      room: 'Вітальня',
      nameEn: 'Monstera',
      instructionsEn: 'Water when the soil is dry',
    });

    // Після reload мова знову українська (її виставляє openApp), перемикаємо вручну.
    await page.reload();
    await expect(app.cardNames()).toHaveText(['Монстера велика']);
    await app.langButton().click();
    await expect(app.cardNames()).toHaveText(['Monstera']);
  });

  test('LC-027: «Полито» з деталей не губить англійські поля', async ({ openApp, backend, listId, app, page }) => {
    await openApp({ lang: 'en', plants: [{ ...monstera(), lastWatered: daysAgo(10) }] });

    await app.openCard('Monstera');
    await page.locator('#waterBtn').click();
    await app.confirmPopover();

    await expect.poll(() => backend.plants(listId)[0].lastWatered).toBe(TODAY);
    expect(backend.plants(listId)[0]).toMatchObject({ nameEn: 'Monstera', instructionsEn: 'Water when the soil is dry' });
  });

  test('LC-027: швидка дія Caretaker не губить англійські поля', async ({ openApp, backend, listId, app }) => {
    await openApp({ lang: 'en', plants: [{ ...monstera(), lastWatered: daysAgo(10) }] });
    await app.caretakerToggle().click();

    await app.card('Monstera').locator('.qa-btn.water').click();
    await app.confirmPopover();

    await expect.poll(() => backend.plants(listId)[0].lastWatered).toBe(TODAY);
    expect(backend.plants(listId)[0]).toMatchObject({ nameEn: 'Monstera', instructionsEn: 'Water when the soil is dry' });
  });

  test('LC-027: bulk-дія не губить англійські поля', async ({ openApp, backend, listId, app, page }) => {
    await openApp({ lang: 'en', plants: [{ ...monstera(), lastWatered: daysAgo(10) }] });

    await app.bulkToggle().click();
    await app.card('Monstera').click();
    await page.locator('#bulkWaterToggle').click();
    await page.locator('#bulkApplyBtn').click();
    await app.confirmPopover();

    await expect.poll(() => backend.plants(listId)[0].lastWatered).toBe(TODAY);
    expect(backend.plants(listId)[0]).toMatchObject({ nameEn: 'Monstera', instructionsEn: 'Water when the soil is dry' });
  });

  test('LC-028: видалення рослини прибирає її разом з англійськими полями', async ({
    openApp, backend, listId, app, page,
  }) => {
    captureDialogs(page, true);
    await openApp({ lang: 'en', plants: [monstera()] });
    await openEditForm(app, page, 'Monstera');

    await page.locator('#deleteBtn').click();

    await expect(app.emptyState()).toBeVisible();
    await expect.poll(() => backend.plants(listId)).toHaveLength(0);
  });
});

test.describe('EN-версія: нова рослина', () => {
  test('AC-LC-09: у EN-інтерфейсі введене стає і оригіналом, і англійською версією', async ({
    openApp, backend, listId, app,
  }) => {
    await openApp({ lang: 'en' });
    await app.addPlantButton().click();
    await expect(app.nameInput()).toHaveAttribute('required', '');

    await app.nameInput().fill('Monstera');
    await saveForm(app, backend);

    expect(backend.plants(listId)[0]).toMatchObject({ name: 'Monstera', nameEn: 'Monstera' });
    await expect(app.cardNames()).toHaveText(['Monstera']);
    await app.langButton().click();
    await expect(app.cardNames()).toHaveText(['Monstera']);
  });

  test('LC-025: у UA-інтерфейсі нова рослина не отримує англійських полів', async ({ openApp, backend, listId, app }) => {
    await openApp({ lang: 'uk' });
    await app.addPlantButton().click();

    await app.nameInput().fill('Монстера');
    await saveForm(app, backend);

    const saved = backend.plants(listId)[0];
    expect(saved.name).toBe('Монстера');
    expect(saved).not.toHaveProperty('nameEn');
    expect(saved).not.toHaveProperty('instructionsEn');
  });

  test('LC-026: у EN-формі додавання назва лишається обов\'язковою', async ({ openApp, backend, app }) => {
    await openApp({ lang: 'en' });
    await app.addPlantButton().click();

    await app.saveButton().click();
    await expect(app.form()).toBeVisible();
    await app.nameInput().fill('   ');
    await app.saveButton().click();
    await expect(app.form()).toBeVisible();

    expect(backend.plantWrites).toHaveLength(0);
  });
});

test.describe('EN-версія: підказка при зміні назви (LC-030 … LC-032)', () => {
  test('AC-LC-10: UA-форма — підказка з\'являється при зміні й зникає при поверненні значення', async ({
    openApp, app, page,
  }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });
    await openEditForm(app, page, 'Монстера');
    const hint = page.locator('#nameLangHint');
    await expect(hint).toBeHidden();

    await app.nameInput().fill('Монстера велика');
    await expect(hint).toBeVisible();
    await expect(hint).toHaveText('Зміна застосується лише до української версії');

    await app.nameInput().fill('Монстера');
    await expect(hint).toBeHidden();
  });

  test('AC-LC-10: EN-форма — підказка англійською', async ({ openApp, app, page }) => {
    await openApp({ lang: 'en', plants: [monstera()] });
    await openEditForm(app, page, 'Monstera');

    await app.nameInput().fill('Giant monstera');

    await expect(page.locator('#nameLangHint')).toHaveText('This change applies to the English version only');
  });

  test('AC-LC-10: у формі додавання підказки немає', async ({ openApp, app, page }) => {
    await openApp({ lang: 'uk' });
    await app.addPlantButton().click();

    await app.nameInput().fill('Нова рослина');

    await expect(page.locator('#nameLangHint')).toBeHidden();
  });

  test('підказка не лишається після повторного відкриття форми', async ({ openApp, app, page }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });
    await openEditForm(app, page, 'Монстера');
    await app.nameInput().fill('Інша назва');
    await expect(page.locator('#nameLangHint')).toBeVisible();

    await app.form().locator('.close-btn[data-close-form]').click();
    await app.card('Монстера').click();
    await page.locator('#editBtn').click();

    await expect(page.locator('#nameLangHint')).toBeHidden();
  });

  test('AC-LC-11: зміна мови при відкритій формі не міняє поля і ціль збереження', async ({
    openApp, backend, listId, app, page,
  }) => {
    await openApp({ lang: 'uk', plants: [monstera()] });
    await openEditForm(app, page, 'Монстера');

    // Форма перекриває шапку, тому подія надсилається напряму.
    await app.langButton().dispatchEvent('click');
    await expect(app.langButton()).toHaveText('EN');
    await expect(app.nameInput()).toHaveValue('Монстера');

    await app.nameInput().fill('Монстера 2');
    await expect(page.locator('#nameLangHint')).toHaveText('Зміна застосується лише до української версії');
    await saveForm(app, backend);

    expect(backend.plants(listId)[0]).toMatchObject({ name: 'Монстера 2', nameEn: 'Monstera' });
    await expect(app.cardNames()).toHaveText(['Monstera']);
  });
});

test.describe('EN-версія: AI (LC-040 … LC-042)', () => {
  const aiResult = { instructions: 'Water when dry', waterDays: 5, fertDays: 21 };

  test('AC-LC-12: «Generate with AI» в EN-формі редагування заповнює англійські інструкції', async ({
    openApp, backend, listId, app, page,
  }) => {
    const dialogs = captureDialogs(page, true);
    let body: Record<string, string> | undefined;
    await page.route('**/api/generate-instructions', (route) => {
      body = route.request().postDataJSON();
      return route.fulfill({ json: aiResult });
    });
    await openApp({ lang: 'en', plants: [monstera()] });
    await openEditForm(app, page, 'Monstera');

    await page.locator('#aiGenerateBtn').click();

    await expect(page.locator('#instructionsInput')).toHaveValue('Water when dry');
    expect(dialogs[0].type).toBe('confirm'); // LC-042: поле було непорожнім
    expect(body).toMatchObject({ name: 'Monstera', lang: 'en' });

    await saveForm(app, backend);
    expect(backend.plants(listId)[0]).toMatchObject({
      instructions: 'Поливати після підсихання ґрунту',
      instructionsEn: 'Water when dry',
    });
    await app.openCard('Monstera');
    await expect(page.locator('#detailInstructions')).toHaveText('Water when dry');
  });

  test('LC-042: Cancel у confirm лишає інструкції без змін', async ({ openApp, app, page }) => {
    captureDialogs(page, false);
    let called = false;
    await page.route('**/api/generate-instructions', (route) => {
      called = true;
      return route.fulfill({ json: aiResult });
    });
    await openApp({ lang: 'en', plants: [monstera()] });
    await openEditForm(app, page, 'Monstera');

    await page.locator('#aiGenerateBtn').click();

    await expect(page.locator('#instructionsInput')).toHaveValue('Water when the soil is dry');
    expect(called).toBe(false);
  });

  test('LC-041: автопідбір після виходу з поля назви в EN-формі додавання', async ({
    openApp, backend, listId, app, page,
  }) => {
    let body: Record<string, string> | undefined;
    await page.route('**/api/generate-instructions', (route) => {
      body = route.request().postDataJSON();
      return route.fulfill({ json: aiResult });
    });
    await openApp({ lang: 'en' });
    await app.addPlantButton().click();

    await app.nameInput().fill('Fern');
    await app.nameInput().blur();

    await expect(page.locator('#instructionsInput')).toHaveValue('Water when dry');
    expect(body).toMatchObject({ name: 'Fern', lang: 'en' });

    await saveForm(app, backend);
    expect(backend.plants(listId)[0]).toMatchObject({
      name: 'Fern',
      nameEn: 'Fern',
      instructions: 'Water when dry',
      instructionsEn: 'Water when dry',
    });
  });

  test('LC-040: у UA-формі запит іде з lang=uk і результат лишається оригіналом', async ({
    openApp, backend, listId, app, page,
  }) => {
    captureDialogs(page, true);
    let body: Record<string, string> | undefined;
    await page.route('**/api/generate-instructions', (route) => {
      body = route.request().postDataJSON();
      return route.fulfill({ json: { instructions: 'Поливати рідко', waterDays: 9, fertDays: 40 } });
    });
    await openApp({ lang: 'uk', plants: [monstera()] });
    await openEditForm(app, page, 'Монстера');

    await page.locator('#aiGenerateBtn').click();
    await expect(page.locator('#instructionsInput')).toHaveValue('Поливати рідко');
    expect(body).toMatchObject({ name: 'Монстера', lang: 'uk' });

    await saveForm(app, backend);
    expect(backend.plants(listId)[0]).toMatchObject({
      instructions: 'Поливати рідко',
      instructionsEn: 'Water when the soil is dry',
    });
  });
});

test.describe('EN-версія: спільний список (AC-LC-14)', () => {
  test('англійські поля бачить інший браузер, що відкрив той самий список', async ({
    openApp, backend, listId, app, page, context,
  }) => {
    await openApp({ lang: 'en' });
    await app.addPlantButton().click();
    await app.nameInput().fill('Monstera');
    await saveForm(app, backend);

    const other = await context.newPage();
    await other.addInitScript(() => localStorage.setItem('leaflog_lang', 'en'));
    await other.clock.install({ time: new Date('2026-06-15T12:00:00Z') });
    await backend.install(other);
    await other.goto(`/?id=${listId}`);

    await expect(other.locator('#plantGrid .plant-card .card-name')).toHaveText(['Monstera']);
  });
});
