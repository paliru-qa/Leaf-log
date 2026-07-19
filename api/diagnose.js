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
  const { name, latin, room, question } = body || {};
  if (!name || !question) {
    return res.status(400).json({ error: 'Не вказано назву рослини або питання' });
  }

  const systemPrompt =
    'Ти — досвідчений консультант-фітопатолог з догляду за кімнатними й балконними рослинами. ' +
    'Відповідай українською, стисло і по суті, без вступів, привітань і зайвих пояснень. ' +
    'НІКОЛИ не вигадуй факти — якщо симптом неоднозначний, чесно перерахуй 2-3 найімовірніші причини, а не стверджуй одну як точну.';

  const userPrompt =
    `Рослина: "${name}"` +
    (latin ? ` (${latin})` : '') +
    (room ? `, розташування: ${room}` : '') +
    `.\n\nВласник описує проблему: "${question}"\n\n` +
    'Дай коротку відповідь у два кроки:\n' +
    '1) Що це, ймовірно, таке — 1-2 найвірогідніші причини (коротко, без розлогих пояснень).\n' +
    '2) Що конкретно робити — 2-3 чіткі дії.\n' +
    'Максимум 5-6 коротких речень загалом. Без списків із зірочками, просто короткі речення чи речення з номерами. Без вступних фраз типу "Дякую за питання".';

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
        max_tokens: 400
      })
    });
    const data = await r.json();
    return { ok: r.ok, status: r.status, data: data };
  }

  function isOverloaded(result){
    var msg = (result.data && result.data.error && result.data.error.message) || '';
    return result.status === 503 || result.status === 429 || /overload|high demand|unavailable|rate limit/i.test(msg);
  }

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
        errMsg = 'Сервери Groq зараз перевантажені. Спробуй ще раз за хвилину-дві.';
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

    return res.status(200).json({ answer: text });
  } catch (err) {
    console.error('Groq diagnose call failed', err);
    return res.status(500).json({ error: String(err) });
  }
}
