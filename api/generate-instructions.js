export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Не знайдено GROQ_API_KEY у змінних середовища Vercel. Додай його в Project Settings → Environment Variables.'
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

  const systemPrompt = 'Ти — досвідчений консультант з догляду за кімнатними й балконними рослинами. Відповідай виключно українською мовою, стисло, без вступних фраз, привітань, списків і зірочок.';
  const userPrompt =
    `Дай короткі практичні інструкції з догляду для рослини "${name}"` +
    (latin ? ` (${latin})` : '') +
    (room ? `, яка росте тут: ${room}` : '') +
    '. Формат відповіді: 2-4 короткі речення суцільним текстом — лише суть: полив, світло, на що звертати увагу. Пиши як нотатку для себе.';

  function sleep(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms); }); }

  async function callGroq(model){
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 220
      })
    });
    const data = await r.json();
    return { ok: r.ok, status: r.status, data: data };
  }

  function isOverloaded(result){
    var msg = (result.data && result.data.error && result.data.error.message) || '';
    return result.status === 503 || result.status === 429 || /overload|high demand|unavailable|rate limit/i.test(msg);
  }

  // Список моделей у порядку пріоритету — якщо перша перевантажена/недоступна, пробуємо наступну
  const modelsToTry = process.env.GROQ_MODEL
    ? [process.env.GROQ_MODEL]
    : ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  try {
    var lastResult = null;
    for (var m = 0; m < modelsToTry.length; m++) {
      var model = modelsToTry[m];
      for (var attempt = 0; attempt < 2; attempt++) {
        lastResult = await callGroq(model);
        if (lastResult.ok) break;
        if (!isOverloaded(lastResult)) break;
        await sleep(700);
      }
      if (lastResult.ok) break;
      if (!isOverloaded(lastResult)) break;
    }

    if (!lastResult.ok) {
      var errMsg = (lastResult.data && lastResult.data.error && lastResult.data.error.message) || 'Помилка Groq API';
      if (isOverloaded(lastResult)) {
        errMsg = 'Сервери Groq зараз перевантажені. Це тимчасово — спробуй ще раз за хвилину-дві.';
      }
      return res.status(500).json({ error: errMsg });
    }

    var text = '';
    try {
      text = lastResult.data.choices[0].message.content.trim();
    } catch (e) {
      text = '';
    }
    if (!text) {
      return res.status(500).json({ error: 'Groq повернув порожню відповідь' });
    }

    return res.status(200).json({ instructions: text });
  } catch (err) {
    console.error('Groq call failed', err);
    return res.status(500).json({ error: String(err) });
  }
}
