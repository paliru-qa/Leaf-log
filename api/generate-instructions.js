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

  // Список добрив, які реально є в наявності — онови тут, якщо асортимент зміниться
  const AVAILABLE_FERTILIZERS = [
    'для троянд',
    'для томатів і розсади',
    'для середземноморських (цитрусові, розмарин тощо)',
    'для пальм і зелених рослин',
    'для гортензій'
  ];

  const systemPrompt =
    'Ти пишеш гранично стислі, але ЗМІСТОВНІ нотатки з догляду за рослинами для себе, українською. ' +
    'НЕ пояснюй чому і навіщо. НЕ пиши повних речень з підметом і присудком типу "рослина любить...", "полив повинен бути...". ' +
    'НЕ використовуй розпливчасті загальні фрази на кшталт "помірне світло", "багато сонця", "не заливати" САМІ ПО СОБІ — ' +
    'завжди додавай конкретну видову особливість цієї рослини: чи можна оприскувати, чи потрібен тісний/просторий горщик, ' +
    'чутливість до холоду/протягів/застою води, чи любить високу вологість повітря, чи є проблема з конкретними шкідниками, ' +
    'особливості формування (прищипування, опора) — обери 1-2 найважливіші саме для цього виду деталі, а не типові для всіх рослин.\n' +
    'Пиши командами/фразами через кому, як телеграма.\n' +
    'Приклади бажаного стилю (наслідуй саме такий тон, довжину і рівень конкретики):\n' +
    '"Дуже багато сонця, тісний горщик, полив після сильного просихання, не оприскувати."\n' +
    '"Поливати тільки після підсихання верхніх 3-4 см, не тримати в холоді, без протягів."\n' +
    '"Любить м\'яку воду, рівномірний полив без болота, не пересушувати повністю."\n' +
    '"Не лити воду в центр розетки, яскраве світло, полив після підсихання 2-3 см."\n' +
    'Жодних вступів, привітань, пояснень причин, списків, зірочок, назви рослини в тексті не повторюй.';

  const userPrompt =
    `Рослина: "${name}"` +
    (latin ? ` (${latin})` : '') +
    (room ? `, розташування: ${room}` : '') +
    '.\n\n' +
    'Дай інструкцію з догляду в описаному стилі: ОДНЕ речення (максимум 30 слів), що включає полив, світло/сонце і 1-2 конкретні видові особливості (оприскування, тіснота горщика, вологість, холод/протяги, шкідники, формування) — не загальні слова, а специфіку саме цього виду.\n\n' +
    'Потім додай ще одне окреме коротке речення (максимум 12 слів, без пояснень) з рекомендацією добрива. Обирай лише з наявних варіантів: ' + AVAILABLE_FERTILIZERS.join(', ') + '. ' +
    'Якщо жодне не годиться (сукуленти, кактуси, ослаблені рослини) — напиши коротко, чим замінити (слабша концентрація) або "не удобрювати". Без пояснення причини.\n\n' +
    'Формат відповіді — рівно два коротких речення, розділені крапкою з комою або новим рядком, нічого більше.';

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
        temperature: 0.3,
        max_tokens: 180
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
