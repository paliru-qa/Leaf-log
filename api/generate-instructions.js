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

  function sleep(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms); }); }

  async function callGemini(model){
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
    return { ok: r.ok, status: r.status, data: data };
  }

  function isOverloaded(result){
    var msg = (result.data && result.data.error && result.data.error.message) || '';
    return result.status === 503 || result.status === 429 || /overload|high demand|unavailable/i.test(msg);
  }

  // Список моделей у порядку пріоритету — якщо перша перевантажена, пробуємо наступну
  const modelsToTry = process.env.GEMINI_MODEL
    ? [process.env.GEMINI_MODEL]
    : ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'];

  try {
    var lastResult = null;
    for (var m = 0; m < modelsToTry.length; m++) {
      var model = modelsToTry[m];
      // Для кожної моделі — до 2 спроб з невеликою паузою (на випадок тимчасового перевантаження)
      for (var attempt = 0; attempt < 2; attempt++) {
        lastResult = await callGemini(model);
        if (lastResult.ok) break;
        if (!isOverloaded(lastResult)) break; // помилка не про перевантаження — немає сенсу повторювати
        await sleep(700);
      }
      if (lastResult.ok) break;
      if (!isOverloaded(lastResult)) break; // ця помилка не вирішиться зміною моделі
    }

    if (!lastResult.ok) {
      var errMsg = (lastResult.data && lastResult.data.error && lastResult.data.error.message) || 'Помилка Gemini API';
      if (isOverloaded(lastResult)) {
        errMsg = 'Сервери Gemini зараз перевантажені. Це тимчасово — спробуй ще раз за хвилину-дві.';
      }
      return res.status(500).json({ error: errMsg });
    }

    var text = '';
    try {
      text = lastResult.data.candidates[0].content.parts[0].text.trim();
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
