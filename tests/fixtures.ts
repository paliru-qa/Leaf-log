import { test as base, expect, type Page, type Locator, type Route } from '@playwright/test';

/**
 * «Сьогодні» для всіх тестів. Годинник браузера ставиться на цю дату,
 * тому статуси поливу/добрива не залежать від дня запуску.
 * 12:00 UTC, щоб локальна дата була однаковою в будь-якому часовому поясі.
 */
export const NOW = '2026-06-15T12:00:00Z';
export const TODAY = '2026-06-15';

/** Дата за N днів до «сьогодні» у форматі YYYY-MM-DD. */
export function daysAgo(n: number): string {
  const d = new Date(`${TODAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Мінімальний валідний PNG 1×1, щоб завантажувати «фото» без файлів у репозиторії. */
export const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);
export const PNG_DATA_URL = `data:image/png;base64,${PNG_1X1.toString('base64')}`;

export type Plant = {
  id: string;
  name: string;
  latin: string;
  room: string;
  waterFreq: number;
  lastWatered: string;
  fertEnabled: boolean;
  fertFreq: number;
  lastFertilized: string;
  instructions: string;
};

let plantCounter = 0;

/**
 * Фабрика рослини. За замовчуванням усе «свіже» (полито й удобрено сьогодні).
 * Перевизначай лише те, що важливо для тесту.
 */
export function makePlant(overrides: Partial<Plant> = {}): Plant {
  plantCounter += 1;
  return {
    id: `p_test${plantCounter}`,
    name: `Рослина ${plantCounter}`,
    latin: '',
    room: '',
    waterFreq: 7,
    lastWatered: TODAY,
    fertEnabled: true,
    fertFreq: 30,
    lastFertilized: TODAY,
    instructions: '',
    ...overrides,
  };
}

type Photo = { id: string; url: string; date: string | null };

/**
 * Підміна бекенду (/api/plants, /api/photo) у пам'яті.
 * Тести не чіпають справжній Upstash Redis і не залежать одне від одного.
 */
export class FakeBackend {
  private lists = new Map<string, Plant[]>();
  private photos = new Map<string, Photo[]>();
  /** Усі записи в /api/plants (POST), у порядку надходження. */
  plantWrites: { id: string; plants: Plant[] }[] = [];
  /** Запити до /api/diagnose та /api/generate-instructions. */
  aiRequests: string[] = [];
  photoDeletes: string[] = [];

  seed(listId: string, plants: Plant[]) {
    this.lists.set(listId, structuredClone(plants));
  }
  seedPhotos(listId: string, plantId: string, photos: Photo[]) {
    this.photos.set(`${listId}:${plantId}`, photos);
  }
  plants(listId: string): Plant[] {
    return this.lists.get(listId) ?? [];
  }
  plant(listId: string, name: string): Plant | undefined {
    return this.plants(listId).find((p) => p.name === name);
  }
  photosOf(listId: string, plantId: string): Photo[] {
    return this.photos.get(`${listId}:${plantId}`) ?? [];
  }

  async install(page: Page) {
    await page.route('**/api/plants**', async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        const id = new URL(req.url()).searchParams.get('id') ?? '';
        return route.fulfill({ json: { plants: this.plants(id) } });
      }
      const body = req.postDataJSON() as { id: string; plants: Plant[] };
      this.lists.set(body.id, body.plants);
      this.plantWrites.push(structuredClone(body));
      return route.fulfill({ json: { ok: true } });
    });

    await page.route('**/api/photo**', async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      if (req.method() === 'GET') {
        const key = `${url.searchParams.get('id')}:${url.searchParams.get('plantId')}`;
        return route.fulfill({ json: { photo: this.photos.get(key) ?? null } });
      }
      if (req.method() === 'DELETE') {
        const key = `${url.searchParams.get('id')}:${url.searchParams.get('plantId')}`;
        this.photos.delete(key);
        this.photoDeletes.push(url.searchParams.get('plantId') ?? '');
        return route.fulfill({ json: { ok: true } });
      }
      const body = req.postDataJSON() as { id: string; plantId: string; photo: Photo[] | null };
      const key = `${body.id}:${body.plantId}`;
      if (body.photo) this.photos.set(key, body.photo);
      else this.photos.delete(key);
      return route.fulfill({ json: { ok: true } });
    });

    // AI за замовчуванням «недоступний»: тихий автопідбір при blur поля назви
    // тоді нічого не міняє у формі. Тести на AI перевизначають ці роути.
    const aiOff = async (route: Route) => {
      this.aiRequests.push(route.request().url());
      await route.fulfill({ status: 500, json: { error: 'AI mocked off' } });
    };
    await page.route('**/api/generate-instructions', aiOff);
    await page.route('**/api/diagnose', aiOff);
  }
}

/** Обгортка над сторінкою: локатори за id (їх задано в index.html) і часті дії. */
export class LeafLog {
  constructor(
    readonly page: Page,
    readonly backend: FakeBackend,
    readonly listId: string,
  ) {}

  // --- шапка і режими
  readonly langButton = () => this.page.locator('#langSwitcherBtn');
  readonly caretakerToggle = () => this.page.locator('#caretakerToggle');
  readonly bulkToggle = () => this.page.locator('#bulkToggle');
  readonly reorderToggle = () => this.page.locator('#reorderToggle');
  readonly addPlantButton = () => this.page.locator('#addPlantBtn');
  readonly logo = () => this.page.locator('#homeLogoBtn');

  // --- список
  readonly cards = () => this.page.locator('#plantGrid .plant-card');
  /** Назви карток у порядку на екрані. */
  readonly cardNames = () => this.page.locator('#plantGrid .plant-card .card-name');
  waterBadge(name: string): Locator {
    return this.card(name).locator('.badge').nth(0);
  }
  fertBadge(name: string): Locator {
    return this.card(name).locator('.badge').nth(1);
  }
  card(name: string): Locator {
    return this.page.locator('#plantGrid .plant-card', { hasText: name });
  }
  readonly emptyState = () => this.page.locator('#emptyState');
  readonly filterEmptyState = () => this.page.locator('#filterEmptyState');
  chip(key: string): Locator {
    return this.page.locator(`#legend .legend-chip[data-key="${key}"]`);
  }

  // --- деталі
  readonly detail = () => this.page.locator('#detailOverlay');
  readonly detailName = () => this.page.locator('#detailName');
  readonly detailClose = () => this.page.locator('#detailOverlay [data-close-detail]');

  // --- форма
  readonly form = () => this.page.locator('#formOverlay');
  readonly formTitle = () => this.page.locator('#formTitle');
  readonly nameInput = () => this.page.locator('#nameInput');
  readonly saveButton = () => this.form().locator('button[type="submit"]');

  // --- date popover
  readonly popover = () => this.page.locator('#datePopover');
  readonly popoverInput = () => this.page.locator('#datePopoverInput');
  readonly popoverOk = () => this.page.locator('#datePopoverConfirm');

  // --- bulk
  readonly bulkBar = () => this.page.locator('#bulkBar');
  readonly bulkCount = () => this.page.locator('#bulkCount');
  readonly undoToast = () => this.page.locator('#undoToast');

  async openCard(name: string) {
    await this.card(name).click();
    await expect(this.detail()).toBeVisible();
    await expect(this.detailName()).toHaveText(name);
  }

  async fillAndSavePlant(name: string) {
    await this.nameInput().fill(name);
    await this.saveButton().click();
    await expect(this.form()).toBeHidden();
  }

  /** Підтверджує date popover (дата за замовчуванням — «сьогодні»). */
  async confirmPopover() {
    await expect(this.popover()).toBeVisible();
    await this.popoverOk().click();
    await expect(this.popover()).toBeHidden();
  }
}

export type Dialogs = { type: string; message: string }[];

/**
 * Лог системних діалогів (alert/confirm/prompt). accept=true — «OK», false — «Cancel».
 * Без цього Playwright мовчки відхиляє діалоги, і тест нічого про них не дізнається.
 */
export function captureDialogs(page: Page, accept = true): Dialogs {
  const log: Dialogs = [];
  page.on('dialog', async (d) => {
    log.push({ type: d.type(), message: d.message() });
    if (accept) await d.accept();
    else await d.dismiss();
  });
  return log;
}

type OpenOptions = {
  plants?: Plant[];
  lang?: 'uk' | 'en';
  /** id списку; за замовчуванням унікальний для тесту. */
  id?: string;
  /** Не відкривати застосунок автоматично, лише підготувати. */
  path?: string;
};

type Fixtures = {
  backend: FakeBackend;
  listId: string;
  app: LeafLog;
  /** Відкриває застосунок зі свіжим списком. Повертає той самий app. */
  openApp: (opts?: OpenOptions) => Promise<LeafLog>;
};

export const test = base.extend<Fixtures>({
  // auto: підміна бекенду й годинника вмикається в КОЖНОМУ тесті, навіть якщо
  // тест її не згадує. Так жоден тест випадково не торкнеться справжньої бази.
  backend: [
    async ({ page }, use) => {
      const backend = new FakeBackend();
      // Годинник: фіксована «сьогоднішня» дата, таймери йдуть природно,
      // а clock.fastForward дозволяє «перемотати» 15 с тосту без очікування.
      await page.clock.install({ time: new Date(NOW) });
      await backend.install(page);
      await use(backend);
    },
    { auto: true },
  ],

  listId: async ({}, use, testInfo) => {
    await use(`pw-${testInfo.workerIndex}-${Math.random().toString(36).slice(2, 8)}`);
  },

  app: async ({ page, backend, listId }, use) => {
    await use(new LeafLog(page, backend, listId));
  },

  openApp: async ({ page, backend, listId, app }, use) => {
    await use(async (opts: OpenOptions = {}) => {
      const id = opts.id ?? listId;
      if (opts.plants) backend.seed(id, opts.plants);
      if (opts.lang) {
        await page.addInitScript((lang) => localStorage.setItem('leaflog_lang', lang), opts.lang);
      }
      await page.goto(opts.path ?? `/?id=${id}`);
      return app;
    });
  },
});

export { expect };
