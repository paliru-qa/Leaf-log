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

  // Список добрив, які реально є в наявності — онови тут, якщо асортимент зміниться.
  const AVAILABLE_FERTILIZERS_LIST =
    '"для троянд" (справжні троянди Rosa), ' +
    '"для томатів і розсади" (їстівні овочі: томати, перці, базилік, салат, розсада), ' +
    '"для середземноморських" (цитрусові, розмарин, гранат, інжир, олива), ' +
    '"для пальм і зелених рослин" (більшість звичайних декоративних кімнатних/балконних рослин із зеленим листям), ' +
    '"для гортензій" (лише Hydrangea)';

  const systemPrompt =
    'Ти пишеш стислі, але ЗМІСТОВНІ нотатки з догляду за рослинами для себе, українською. ' +
    'НЕ пояснюй чому і навіщо. НЕ пиши повних речень з підметом і присудком типу "рослина любить...", "полив повинен бути...". ' +
    'НАЙВАЖЛИВІШЕ ПРАВИЛО — ТОЧНІСТЬ: НІКОЛИ не вигадуй факти. Якщо не впевнений на 100% щодо конкретної властивості виду ' +
    '(особливо про оприскування — це часто плутають), просто НЕ згадуй її, а візьми іншу деталь, у якій ти впевнений. ' +
    'Краще менш конкретна, але правдива порада, ніж вигадана конкретика. Нормально навести лише ОДНУ конкретну деталь, якщо це все, у чому ти впевнений — не треба штучно добавляти другу, аби заповнити місце.\n' +
    'Уникай порожніх загальних фраз на кшталт "помірне світло", "багато сонця", "не заливати" САМІ ПО СОБІ без жодної конкретики — ' +
    'де можеш, додавай видову особливість: тісний/просторий горщик, чутливість до холоду/протягів/застою води, потреба у високій вологості повітря, ' +
    'оприскування (лише якщо точно знаєш чи можна), типові шкідники цього виду, чи потрібне прищипування/формування пагонів ' +
    '(актуально для трав, овочів, кущистих і ампельних рослин — базилік, томати, перці, петунія, гранат, авокадо), опора для ліан.\n' +
    'Пиши командами/фразами через кому, як телеграма — але даю тобі трохи більше простору, не стискай штучно, якщо є 2-3 дійсно важливі й достовірні деталі.\n' +
    'Приклади бажаного стилю для поля "instructions" (наслідуй саме такий тон і рівень конкретики):\n' +
    '"Дуже багато сонця, тісний горщик, полив після сильного просихання, не оприскувати, прищипувати витягнуті пагони."\n' +
    '"Поливати тільки після підсихання верхніх 3-4 см, не тримати в холоді, без протягів."\n' +
    '"Не пересушувати повністю, але й не тримати мокрим постійно; більше світла для яскравого забарвлення листя."\n' +
    '"Полив після підсихання 2-3 см, багато світла, прищипувати для кущіння."\n' +
    'Жодних вступів, привітань, пояснень причин, списків, зірочок, назви рослини в тексті не повторюй.\n\n' +
    'ВИБІР ДОБРИВА — двокроковий підхід:\n' +
    '1) Спочатку подумай, яке добриво СПРАВДІ ІДЕАЛЬНО підходить для цього конкретного виду за ботанічними ознаками — ' +
    'не обмежуй себе наявним асортиментом; це може бути будь-який точний тип, наприклад "добриво для кактусів і сукулентів", ' +
    '"добриво для орхідей", "добриво для цитрусових", "добриво для азалій/рослин з кислим ґрунтом" тощо — назви його правильно й конкретно.\n' +
    '2) У власника є в наявності лише ці добрива: ' + AVAILABLE_FERTILIZERS_LIST + '. ' +
    'Порадь, яке з НИХ є найближчим замінником ідеального варіанту (за призначенням, вмістом NPK, чи це добриво для листя/квітів/плодів). ' +
    'Якщо ідеальне добриво збігається з одним із наявних — просто скажи, що воно й підходить, без згадки "замінник".\n' +
    'У полі "instructions" сформулюй це одним коротким реченням у форматі: "Ідеально — <справжній ідеальний тип>, з наявного — <найближчий варіант зі списку>." ' +
    'Якщо ідеальний тип і наявний варіант — по суті одне й те саме, пиши просто: "Підходить <варіант зі списку>."';

  const userPrompt =
    `Рослина: "${name}"` +
    (latin ? ` (${latin})` : '') +
    (room ? `, розташування: ${room}` : '') +
    '.\n\n' +
    'Заповни поле "instructions" так: одне-два речення (орієнтовно до 40 слів), що включає полив, світло/сонце і ті видові особливості, у яких ти справді впевнений (оприскування, тіснота горщика, вологість, холод/протяги, шкідники, формування) — не загальні слова, а специфіка саме цього виду. Не обрізай важливу деталь заради стислості — краще трохи довше речення, ніж втрачена інформація.\n\n' +
    'Потім у тому ж полі додай ще одне окреме речення про добриво за описаним вище двокроковим підходом (ідеальний тип + найближчий наявний варіант). ' +
    'Речення в "instructions" розділяй крапкою з комою або новим рядком.\n\n' +
    'Заповни "water_days" і "fert_days" реалістичними числами для цього виду.\n\n' +
    'Поверни рівно один JSON-об\'єкт з трьома ключами: instructions, water_days, fert_days. Нічого більше.';

  function extractJson(text){
    var trimmed = text.trim();
    // Прибираємо можливі markdown-огорожі ```json ... ```
    trimmed = trimmed.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var start = trimmed.indexOf('{');
    var end = trimmed.lastIndexOf('}');
    if(start === -1 || end === -1 || end < start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch (e) {
      return null;
    }
  }

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
        temperature: 0.15,
        max_tokens: 360
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

    var parsed = extractJson(text);
    if (!parsed || !parsed.instructions) {
      // Резервний варіант: якщо модель не дотрималась формату JSON, повертаємо хоч текст як є
      return res.status(200).json({ instructions: text, waterDays: null, fertDays: null });
    }

    var waterDays = parseInt(parsed.water_days, 10);
    var fertDays = parseInt(parsed.fert_days, 10);

    return res.status(200).json({
      instructions: String(parsed.instructions).trim(),
      waterDays: isNaN(waterDays) ? null : Math.max(1, Math.min(60, waterDays)),
      fertDays: isNaN(fertDays) ? null : Math.max(1, Math.min(90, fertDays))
    });
  } catch (err) {
    console.error('Groq call failed', err);
    return res.status(500).json({ error: String(err) });
  }
}
