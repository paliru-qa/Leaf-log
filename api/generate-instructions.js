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
  // Мова результату = мова інтерфейсу. Усе, що не 'en', трактуємо як українську (значення за замовчуванням).
  const lang = body && body.lang === 'en' ? 'en' : 'uk';
  if (!name) {
    return res.status(400).json({ error: lang === 'en' ? 'Plant name is missing' : 'Не вказано назву рослини' });
  }

  // Список добрив, які реально є в наявності — онови тут, якщо асортимент зміниться.
  const AVAILABLE_FERTILIZERS_LIST =
    '"для троянд" (справжні троянди Rosa), ' +
    '"для томатів і розсади" (їстівні овочі: томати, перці, базилік, салат, розсада), ' +
    '"для середземноморських" (цитрусові, розмарин, гранат, інжир, олива), ' +
    '"для пальм і зелених рослин" (більшість звичайних декоративних кімнатних/балконних рослин із зеленим листям), ' +
    '"для гортензій" (лише Hydrangea)';

  // Фіксований словник "ідеальних" типів (щоб ШІ не вигадував довільні варіанти щоразу по-новому)
  // і жорстка таблиця, яким наявним добривом кожен тип замінюється.
  const FERTILIZER_MAPPING =
    '- Кактуси, сукуленти → ідеальний тип "для кактусів і сукулентів" → з наявного: не удобрювати, або дуже слабко "для пальм і зелених рослин".\n' +
    '- Орхідеї → ідеальний тип "для орхідей" → з наявного: "для пальм і зелених рослин" (слабша концентрація).\n' +
    '- Квітучі кімнатні рослини й тропічні квітучі ліани/кущі, вирощені заради квітів, а НЕ заради їстівних плодів (напр. стефанотис, хойя, бугенвілія, бальзамін, петунія, азалія) → ідеальний тип "для квітучих кімнатних рослин" → з наявного: "для пальм і зелених рослин".\n' +
    '- Цитрусові, розмарин, гранат, інжир, олива (їстівні середземноморські) → ідеальний тип "для цитрусових/середземноморських" → з наявного: "для середземноморських" (точний збіг).\n' +
    '- ТІЛЬКИ справжні кущові/паркові/кімнатні троянди роду Rosa → ідеальний тип "для троянд" → з наявного: "для троянд" (точний збіг).\n' +
    '- Гортензії (Hydrangea) → ідеальний тип "для гортензій" → з наявного: "для гортензій" (точний збіг).\n' +
    '- Їстівні овочі, зелень, розсада (томати, перці, базилік, салат) → ідеальний тип "для овочів" → з наявного: "для томатів і розсади" (точний збіг).\n' +
    '- Звичайні декоративні кімнатні/балконні рослини із зеленим листям, які НЕ квітнуть як прикраса (сциндапсус, епіпремнум, аглаонема, драцена, замiокулькас, монстера, фікус, пальми, традесканція, кава, авокадо) → ідеальний тип "для зелені" → з наявного: "для пальм і зелених рослин" (точний збіг).\n' +
    '- Хвойні, азалії/рододендрони поза списком гортензій → ідеальний тип "для рослин з кислим ґрунтом" → з наявного: "для пальм і зелених рослин".\n\n' +
    'КРИТИЧНО ВАЖЛИВО: "для троянд" обирай ЛИШЕ для справжніх троянд (рід Rosa), "для середземноморських" — ЛИШЕ для цитрусових/розмарину/гранату/інжиру/оливи. ' +
    'НІКОЛИ не обирай ці дві категорії "за замовчуванням" чи "навмання" для рослин, які не є трояндами чи середземноморськими — це поширена помилка. ' +
    'Для будь-якої квітучої декоративної рослини, яка НЕ троянда і НЕ гортензія (ліани, тропічні квітучі кущі тощо) — ідеальний тип завжди "для квітучих кімнатних рослин", а з наявного це майже завжди "для пальм і зелених рослин".\n\n' +
    'ГОТОВІ ПРИКЛАДИ (повторюй саме такий патерн для схожих рослин):\n' +
    '- Стефанотис (тропічна квітуча ліана) → "Ідеально — для квітучих кімнатних рослин, з наявного — для пальм і зелених рослин."\n' +
    '- Троянда паркова (Rosa) → "Підходить для троянд."\n' +
    '- Лимон Меєра (цитрус) → "Підходить для середземноморських."\n' +
    '- Сциндапсус (звичайна зелена ліана без квітів) → "Підходить для пальм і зелених рослин."\n' +
    '- Гаворція (сукулент) → "Ідеально — для кактусів і сукулентів, з наявного — не удобрювати або дуже слабко для пальм і зелених рослин."\n' +
    '- Помідор у горщику (овоч) → "Підходить для томатів і розсади."\n\n' +
    'Якщо ідеальний тип і наявний варіант — ОДНЕ Й ТЕ САМЕ формулювання, пиши лише один раз ("Підходить X"), НІКОЛИ не повторюй ту саму назву двічі як "Ідеально — X, з наявного — X".';


  // Для англійського інтерфейсу: промпт лишається українським (він налаштований і стабільний),
  // але формат результату і назви добрив подаємо англійською.
  const EN_OUTPUT_RULES =
    '\n\nOUTPUT LANGUAGE — ENGLISH. The instructions above are written in Ukrainian, but the value of the "instructions" field MUST be written in natural English, in the same short telegraphic style (do not mix languages and do not output Ukrainian words). ' +
    'The style examples above are in Ukrainian: produce equivalent English phrasing. ' +
    'Translate the fertilizer names like this: ' +
    '"для троянд" = "for roses", ' +
    '"для томатів і розсади" = "for tomatoes and seedlings", ' +
    '"для середземноморських" = "for Mediterranean plants", ' +
    '"для пальм і зелених рослин" = "for palms and green foliage plants", ' +
    '"для гортензій" = "for hydrangeas"; ideal types: ' +
    '"для кактусів і сукулентів" = "for cacti and succulents", "для орхідей" = "for orchids", ' +
    '"для квітучих кімнатних рослин" = "for flowering houseplants", "для цитрусових/середземноморських" = "for citrus/Mediterranean plants", ' +
    '"для овочів" = "for vegetables", "для зелені" = "for foliage plants", "для рослин з кислим ґрунтом" = "for acid-loving plants". ' +
    'Fertilizer sentence patterns in English: exact match → "Suitable: <available option>."; substitution → "Ideal: <ideal type>; closest available: <available option>."; ' +
    '"не удобрювати" = "do not fertilize". Keys of the JSON object stay exactly: instructions, water_days, fert_days.';

  const systemPrompt =
    'Ти пишеш стислі, але ЗМІСТОВНІ нотатки з догляду за рослинами для себе, ' + (lang === 'en' ? 'англійською' : 'українською') + '. ' +
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
    'ВИБІР ДОБРИВА — дотримуйся СУВОРО цієї таблиці відповідності, щоб результат був однаковим щоразу для одного й того ж виду:\n' +
    FERTILIZER_MAPPING + '\n\n' +
    'У полі "instructions" сформулюй це одним коротким реченням: якщо ідеальний тип точно збігається з наявним — просто "Підходить <варіант зі списку>." ' +
    'Якщо це заміна — "Ідеально — <ідеальний тип>, з наявного — <варіант зі списку>."' +
    (lang === 'en' ? EN_OUTPUT_RULES : '');

  const userPrompt =
    `Рослина: "${name}"` +
    (latin ? ` (${latin})` : '') +
    (room ? `, розташування: ${room}` : '') +
    '.\n\n' +
    'Заповни поле "instructions" так: одне-два речення (орієнтовно до 40 слів), що включає полив, світло/сонце і ті видові особливості, у яких ти справді впевнений (оприскування, тіснота горщика, вологість, холод/протяги, шкідники, формування) — не загальні слова, а специфіка саме цього виду. Не обрізай важливу деталь заради стислості — краще трохи довше речення, ніж втрачена інформація.\n\n' +
    'Потім у тому ж полі додай ще одне окреме речення про добриво за описаним вище двокроковим підходом (ідеальний тип + найближчий наявний варіант). ' +
    'Речення в "instructions" розділяй крапкою з комою або новим рядком.\n\n' +
    'Заповни "water_days" і "fert_days" реалістичними числами для цього виду.\n\n' +
    'Поверни рівно один JSON-об\'єкт з трьома ключами: instructions, water_days, fert_days. Нічого більше.' +
    (lang === 'en' ? '\n\nIMPORTANT: write the "instructions" value in English.' : '');

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
        max_completion_tokens: 700,
        reasoning_effort: 'low'
      })
    });
    const data = await r.json();
    return { ok: r.ok, status: r.status, data: data };
  }

  function isOverloaded(result){
    var msg = (result.data && result.data.error && result.data.error.message) || '';
    return result.status === 503 || result.status === 429 || /overload|high demand|unavailable|rate limit/i.test(msg);
  }

  // Список моделей у порядку пріоритету — якщо перша перевантажена/недоступна, пробуємо наступну.
  // llama-3.3-70b-versatile / llama-3.1-8b-instant deprecated Groq'ом — замінено на актуальні
  // production-моделі (openai/gpt-oss-*). Якщо задано GROQ_MODEL у Vercel — використовується лише вона.
  const modelsToTry = process.env.GROQ_MODEL
    ? [process.env.GROQ_MODEL]
    : ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  function extractText(result){
    try {
      return (result.data.choices[0].message.content || '').trim();
    } catch (e) {
      return '';
    }
  }

  try {
    var lastResult = null;
    var text = '';
    for (var m = 0; m < modelsToTry.length; m++) {
      var model = modelsToTry[m];
      for (var attempt = 0; attempt < 2; attempt++) {
        lastResult = await callGroq(model);
        if (lastResult.ok) {
          text = extractText(lastResult);
          if (text) break; // маємо непорожню відповідь — готово
          // reasoning-модель (gpt-oss) інколи витрачає весь ліміт токенів на
          // приховані "роздуми" і не встигає видати фінальний текст — це не
          // помилка HTTP, тому пробуємо ще раз / іншу модель, а не здаємось одразу
        } else if (!isOverloaded(lastResult)) {
          break;
        }
        await sleep(700);
      }
      if (text) break;
    }

    if (!lastResult.ok) {
      var errMsg = (lastResult.data && lastResult.data.error && lastResult.data.error.message) || 'Помилка Groq API';
      if (isOverloaded(lastResult)) {
        errMsg = lang === 'en'
          ? 'Groq servers are overloaded right now. This is temporary — please try again in a minute or two.'
          : 'Сервери Groq зараз перевантажені. Це тимчасово — спробуй ще раз за хвилину-дві.';
      }
      return res.status(500).json({ error: errMsg });
    }

    if (!text) {
      return res.status(500).json({
        error: lang === 'en'
          ? 'Groq returned an empty response after several attempts. Please try again in a minute.'
          : 'Groq повернув порожню відповідь після кількох спроб. Спробуй ще раз за хвилину.'
      });
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
