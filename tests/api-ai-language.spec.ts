import { test, expect } from '@playwright/test';
// Хендлери Vercel-функцій імпортуємо напряму і викликаємо з підробленими req/res.
// Groq замоканий через глобальний fetch: реальний API не чіпаємо.
import diagnose from '../api/diagnose.js';
import generateInstructions from '../api/generate-instructions.js';

type GroqCall = { system: string; user: string };

async function callHandler(
  handler: (req: any, res: any) => Promise<unknown>,
  body: Record<string, unknown>,
  groqContent: string,
) {
  const groqCalls: GroqCall[] = [];
  const realFetch = globalThis.fetch;
  const realKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-key';
  globalThis.fetch = (async (_url: unknown, init: any) => {
    const payload = JSON.parse(init.body);
    groqCalls.push({
      system: payload.messages.find((m: any) => m.role === 'system').content,
      user: payload.messages.find((m: any) => m.role === 'user').content,
    });
    return new Response(JSON.stringify({ choices: [{ message: { content: groqContent } }] }), { status: 200 });
  }) as typeof fetch;

  const out: { status: number; json: any } = { status: 0, json: null };
  const res = {
    setHeader() {},
    status(code: number) {
      out.status = code;
      return res;
    },
    json(data: unknown) {
      out.json = data;
      return res;
    },
  };
  try {
    await handler({ method: 'POST', body }, res);
  } finally {
    globalThis.fetch = realFetch;
    if (realKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = realKey;
  }
  return { ...out, groqCalls };
}

const plantBody = { name: 'Монстера', latin: 'Monstera deliciosa', room: 'Вітальня' };

test.describe('AI: мова відповіді (BR-003)', () => {
  test('diagnose: lang=en — просить відповідати англійською', async () => {
    const r = await callHandler(diagnose, { ...plantBody, question: 'Leaves are turning yellow', lang: 'en' }, 'Overwatering.');

    expect(r.status).toBe(200);
    expect(r.json).toEqual({ answer: 'Overwatering.' });
    expect(r.groqCalls).toHaveLength(1);
    expect(r.groqCalls[0].system).toContain('Відповідай англійською');
    expect(r.groqCalls[0].system).not.toContain('Відповідай українською');
    expect(r.groqCalls[0].user).toContain('write the whole answer in English');
  });

  for (const lang of ['uk', undefined, 'fr', 'EN']) {
    test(`diagnose: lang=${String(lang)} — лишається українською`, async () => {
      const r = await callHandler(diagnose, { ...plantBody, question: 'Жовтіє листя', lang }, 'Перелив.');

      expect(r.status).toBe(200);
      expect(r.groqCalls[0].system).toContain('Відповідай українською');
      expect(r.groqCalls[0].user).not.toContain('English');
    });
  }

  test('generate-instructions: lang=en — англійський результат і переклад назв добрив', async () => {
    const r = await callHandler(
      generateInstructions,
      { ...plantBody, lang: 'en' },
      JSON.stringify({ instructions: 'Water when top 3 cm dry. Suitable: for palms and green foliage plants.', water_days: 7, fert_days: 30 }),
    );

    expect(r.status).toBe(200);
    expect(r.json).toEqual({
      instructions: 'Water when top 3 cm dry. Suitable: for palms and green foliage plants.',
      waterDays: 7,
      fertDays: 30,
    });
    const { system, user } = r.groqCalls[0];
    expect(system).toContain('англійською');
    expect(system).not.toContain('для себе, українською');
    expect(system).toContain('OUTPUT LANGUAGE — ENGLISH');
    expect(system).toContain('"для пальм і зелених рослин" = "for palms and green foliage plants"');
    expect(user).toContain('write the "instructions" value in English');
  });

  for (const lang of ['uk', undefined]) {
    test(`generate-instructions: lang=${String(lang)} — промпт без змін, українською`, async () => {
      const r = await callHandler(
        generateInstructions,
        { ...plantBody, lang },
        JSON.stringify({ instructions: 'Поливати після підсихання.', water_days: 7, fert_days: 30 }),
      );

      expect(r.status).toBe(200);
      expect(r.groqCalls[0].system).toContain('для себе, українською');
      expect(r.groqCalls[0].system).not.toContain('ENGLISH');
      expect(r.groqCalls[0].user).not.toContain('English');
    });
  }
});
