import { test, expect, makePlant, captureDialogs } from './fixtures';

test.describe('Спільний список', () => {
  test('S1: відкриття без id додає ?id=… в URL', { tag: '@smoke' }, async ({ openApp, page }) => {
    await openApp({ path: '/' });

    await expect(page).toHaveURL(/[?&]id=[a-z0-9]+/);

    const idInUrl = new URL(page.url()).searchParams.get('id');
    const idInStorage = await page.evaluate(() => localStorage.getItem('leaflog_household_id'));
    expect(idInStorage).toBe(idInUrl);
  });

  test('S2: відкриття з id показує саме цей список, URL не змінюється', async ({ openApp, backend, app, page }) => {
    backend.seed('list-a', [makePlant({ name: 'Монстера з А' })]);
    backend.seed('list-b', [makePlant({ name: 'Фікус з Б' })]);

    await openApp({ id: 'list-a' });
    await expect(app.cardNames()).toHaveText(['Монстера з А']);
    expect(new URL(page.url()).searchParams.get('id')).toBe('list-a');

    // Чуже посилання відкриває чужий список, але не підміняє «свій» id у localStorage.
    await page.goto('/?id=list-b');
    await expect(app.cardNames()).toHaveText(['Фікус з Б']);
    expect(new URL(page.url()).searchParams.get('id')).toBe('list-b');
    expect(await page.evaluate(() => localStorage.getItem('leaflog_household_id'))).toBe('list-a');
  });

  test('S3: «Створити свій список» дає новий id, старий список не змінюється', async ({
    openApp, backend, listId, app, page,
  }) => {
    const dialogs = captureDialogs(page, true);
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await expect(app.card('Монстера')).toBeVisible();

    await page.locator('#newListBtn').click();

    await page.waitForURL((url) => url.searchParams.get('id') !== listId);
    const newId = new URL(page.url()).searchParams.get('id');
    expect(newId).toBeTruthy();
    expect(newId).not.toBe(listId);
    expect(dialogs[0].type).toBe('confirm');
    expect(dialogs[0].message).toContain('ВЛАСНИЙ');

    await expect(app.emptyState()).toBeVisible();
    expect(backend.plants(listId).map((p) => p.name)).toEqual(['Монстера']);
    expect(backend.plants(newId!)).toEqual([]);
  });

  test('S3b: Cancel у confirm залишає поточний список', async ({ openApp, listId, app, page }) => {
    captureDialogs(page, false);
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });

    await page.locator('#newListBtn').click();

    await expect(app.card('Монстера')).toBeVisible();
    expect(new URL(page.url()).searchParams.get('id')).toBe(listId);
  });

  test.describe('буфер обміну', () => {
    test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

    test('S4: «Скопіювати посилання» кладе поточний URL у clipboard', async ({ openApp, page }) => {
      const dialogs = captureDialogs(page, true);
      await openApp({ plants: [makePlant({ name: 'Монстера' })] });

      await page.locator('#shareLinkBtn').click();

      await expect.poll(() => dialogs.length).toBe(1);
      expect(dialogs[0].message).toContain('Посилання скопійовано');
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toBe(page.url());
    });
  });
});
