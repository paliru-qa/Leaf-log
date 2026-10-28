import { test, expect, makePlant, captureDialogs } from './fixtures';

// Усі AI-ендпоінти замоканi: реальний Groq не чіпаємо (ліміти, нестабільні відповіді).

test.describe('AI (mock)', () => {
  test('A1: генерація інструкцій заповнює instructions / water / fert', async ({ openApp, app, page }) => {
    captureDialogs(page, true);
    await page.route('**/api/generate-instructions', (route) =>
      route.fulfill({ json: { instructions: 'Поливати помірно, не ставити на сонце', waterDays: 5, fertDays: 21 } }),
    );
    await openApp();
    await app.addPlantButton().click();
    await app.nameInput().fill('Монстера');

    await page.locator('#aiGenerateBtn').click();

    await expect(page.locator('#instructionsInput')).toHaveValue('Поливати помірно, не ставити на сонце');
    await expect(page.locator('#waterFreqInput')).toHaveValue('5');
    await expect(page.locator('#fertFreqInput')).toHaveValue('21');
    await expect(page.locator('#aiGenerateBtn')).toBeEnabled();
  });

  test('A2: «Запитати ШІ» з порожнім питанням — alert, запит не йде', async ({ openApp, app, backend, page }) => {
    const dialogs = captureDialogs(page, true);
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await app.openCard('Монстера');

    await page.locator('#askAiBtn').click();

    await expect.poll(() => dialogs.length).toBe(1);
    expect(dialogs[0].message).toBe(
      'Опиши проблему з рослиною — наприклад, що саме сталося з листям чи стеблом.',
    );
    expect(backend.aiRequests).toHaveLength(0);
    await expect(page.locator('#questionInput')).toBeFocused();
  });

  test('A3: відповідь ШІ показується, у запиті є назва та питання', async ({ openApp, app, page }) => {
    let body: Record<string, string> | undefined;
    await page.route('**/api/diagnose', (route) => {
      body = route.request().postDataJSON();
      return route.fulfill({ json: { answer: 'Схоже на перелив. Дай ґрунту підсохнути.' } });
    });
    await openApp({ plants: [makePlant({ name: 'Монстера', room: 'Вітальня' })] });
    await app.openCard('Монстера');

    await page.locator('#questionInput').fill('Жовтіє листя');
    await page.locator('#askAiBtn').click();

    await expect(page.locator('#aiAnswerBox')).toBeVisible();
    await expect(page.locator('#aiAnswerBox')).toHaveText('Схоже на перелив. Дай ґрунту підсохнути.');
    expect(body).toMatchObject({ name: 'Монстера', room: 'Вітальня', question: 'Жовтіє листя' });
  });

  test('A4: помилка API (500) — alert з текстом помилки', async ({ openApp, app, page }) => {
    const dialogs = captureDialogs(page, true);
    await page.route('**/api/diagnose', (route) =>
      route.fulfill({ status: 500, json: { error: 'Ліміт вичерпано' } }),
    );
    await openApp({ plants: [makePlant({ name: 'Монстера' })] });
    await app.openCard('Монстера');

    await page.locator('#questionInput').fill('Жовтіє листя');
    await page.locator('#askAiBtn').click();

    await expect.poll(() => dialogs.length).toBe(1);
    expect(dialogs[0].message).toBe('Не вдалося отримати відповідь: Ліміт вичерпано');
    await expect(page.locator('#aiAnswerBox')).toBeHidden();
    await expect(page.locator('#askAiBtn')).toBeEnabled();
    await expect(page.locator('#askAiBtn')).toContainText('Запитати ШІ');
  });
});
