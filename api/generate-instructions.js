export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Не знайдено GEMINI_API_KEY у змінних середовища Vercel. Додай його в Project Settings → Environment Variables.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { name, latin, room } = body || {};
  if (!name) {
    return res.status(400).json({ error: 'Не вказано назву рослини' });
  }

  const prompt =
    'Ти — досвідчений консультант з догляду за кімнатними й балконними рослинами. ' +
    `Дай короткі практичні інструкції з догляду українською мовою для рослини "${name}"` +
    (latin ? ` (${latin})` : '') +
    (room ? `, яка росте тут: ${room}` : '') +
    '.\n\nФормат відповіді: 2-4 короткі речення суцільним текстом, без вступних фраз і привітань, без списків і зірочок — лише суть: полив, світло, на що звертати увагу. Пиши як нотатку для себе, стисло.';

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 220 }
        })
      }
    );
    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({ error: (data && data.error && data.error.message) || 'Помилка Gemini API' });
    }

    var text = '';
    try {
      text = data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
      text = '';
    }
    if (!text) {
      return res.status(500).json({ error: 'Gemini повернув порожню відповідь' });
    }

    return res.status(200).json({ instructions: text });
  } catch (err) {
    console.error('Gemini call failed', err);
    return res.status(500).json({ error: String(err) });
  }
}
