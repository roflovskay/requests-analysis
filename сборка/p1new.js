// 1 — title
{ const s = slide('title', 1, S1);
  T(s, 'ДИЗАЙН-МЫШЛЕНИЕ\nВ' + NB + 'ОРГАНИЗАЦИИ', { x: L, y: 1.35, w: CW, h: 2.4, fontFace: POSTER, bold: true, fontSize: 54, color: C.paper, lineSpacingMultiple: 0.95 });
  T(s, 'внедрение и культура', { x: L, y: 4.0, w: 9, h: 0.8, fontSize: 32, color: C.sage });
  T(s, 'Курс «Дизайн-мышление» · неделя 11', { x: L, y: 6.55, w: 7, h: 0.4, fontSize: 14, color: C.dim });
  T(s, 'Almaty Management University', { x: 7.0, y: 6.55, w: R - 7.0, h: 0.4, fontFace: SANS_B, fontSize: 14, color: C.coral, align: 'right' }); }

//__KEEP_2__

// 3 — departments
{ const s = slide('center', 3, S1);
  title(s, 'Отделы работают каждый на себя');
  ['производство', 'маркетинг', 'группа продуктов'].forEach((d, i) => { const x = L + i * 2.75;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.05, w: 2.35, h: 1.5, fill: { color: C.blue, transparency: 55 }, line: { color: C.ice, width: 0.75 } });
    T(s, d, { x: x + 0.15, y: 2.05, w: 2.05, h: 1.5, fontFace: SANS_B, fontSize: 17, color: C.paper, align: 'center', valign: 'middle' });
    T(s, 'свои цели', { x, y: 3.65, w: 2.35, h: 0.35, fontSize: 13, color: C.dim, align: 'center' }); });
  [[L + 2.35, L + 2.75], [L + 5.1, L + 5.5], [L + 7.85, 9.0]].forEach(g => seg(s, g[0], 2.8, g[1], 2.8, { color: C.coral, width: 1.5, dash: 'dash' }));
  ring(s, 9.6, 2.05, 1.5, C.coral, 1.75);
  T(s, 'клиент', { x: 9.6, y: 2.05, w: 1.5, h: 1.5, fontFace: SANS_B, fontSize: 16, color: C.coral, align: 'center', valign: 'middle' });
  T(s, 'общие цели — только финансовые; за опыт клиента целиком не отвечает никто', { x: 9.0, y: 3.75, w: 3.5, h: 1.0, fontSize: 13, color: C.dim });
  T(s, '«Эффективность дизайн-мышления прямо пропорциональна умению организации всесторонне и равномерно внедрять результат»', { x: L, y: 5.0, w: CW, h: 1.1, fontFace: SANS_B, fontSize: 21, color: C.paper });
  src(s, 'Леврик и др., 2020, с. 190–191'); }

// 4 — three stages
{ const s = slide('right', 4, S1);
  title(s, 'Три стадии компании');
  [['СЕМЬЯ', 'всё держится на лидере'], ['МАШИНА', 'отделы и правила'], ['ОРГАНИЗМ', 'части работают как целое']].forEach((p, i) => { const x = L + i * 4.05, hot = i === 2;
    T(s, p[0], { x, y: 2.3, w: 3.9, h: 0.9, fontFace: POSTER, bold: true, fontSize: hot ? 36 : 30, color: hot ? C.paper : C.dim });
    T(s, p[1], { x, y: 3.35, w: 3.4, h: 0.8, fontSize: 19, color: hot ? C.paper : C.ice });
    if (i < 2) seg(s, x + 3.05, 2.8, x + 3.85, 2.8, { color: C.dim, width: 1.25, arrow: true }); });
  seg(s, L, 4.75, R, 4.75, { color: C.deep });
  T(s, 'Дизайн-мышление лучше всего работает на третьей стадии', { x: L, y: 4.95, w: CW, h: 0.6, fontFace: SANS_B, fontSize: 20, color: C.coral });
  src(s, 'Леврик и др., 2020, с. 192'); }

// 5 — social technology
{ const s = slide('center', 5, S1);
  title(s, 'Социальная технология');
  T(s, 'ИНСТРУМЕНТЫ + ПОНИМАНИЕ ЛЮДЕЙ', { x: L, y: 1.85, w: CW, h: 0.8, fontFace: POSTER, bold: true, fontSize: 30, color: C.paper });
  [['TQM', 'производство', C.dim], ['дизайн-мышление', 'инновации', C.paper]].forEach((r, i) => { const y = 2.95 + i * 0.6;
    T(s, r[0], { x: L, y, w: 3.4, h: 0.5, fontFace: SANS_B, fontSize: 19, color: r[2] });
    seg(s, L + 3.5, y + 0.25, L + 4.4, y + 0.25, { color: i ? C.coral : C.dim, width: 1.25, arrow: true });
    T(s, r[1], { x: L + 4.6, y, w: 4, h: 0.5, fontSize: 19, color: r[2] }); });
  T(s, 'Что даёт хороший процесс', { x: L, y: 4.45, w: 6, h: 0.4, fontSize: 14, color: C.dim });
  ['лучшие решения', 'меньше риска при изменениях', 'поддержку сотрудников'].forEach((t, i) => { const x = L + i * 3.95;
    seg(s, x, 4.95, x + 3.6, 4.95, { color: C.blue, width: 1.5 }); T(s, t, { x, y: 5.08, w: 3.6, h: 0.75, fontSize: 18, color: C.ice }); });
  src(s, 'Liedtka, 2018: 50 проектов за семь лет'); }

// 6 — maxims
{ const s = slide('two', 6, S1);
  title(s, 'Как думают менеджеры роста');
  T(s, 'Было', { x: L, y: 1.85, w: 5, h: 0.35, fontFace: SANS_B, fontSize: 14, color: C.dim });
  T(s, 'Стало', { x: 7.2, y: 1.85, w: 5, h: 0.35, fontFace: SANS_B, fontSize: 14, color: C.coral });
  [['«Не задавай вопрос, ответа на который не знаешь»', '«Начинай с неизвестного»'], ['«Мысли масштабно»', '«Фокусируйся на реальных потребностях людей»'], ['«Если идея хороша, деньги найдутся»', '«Давай стартовое финансирование нужным людям и задачам»'], ['«Семь раз отмерь — один раз отрежь»', '«Делай маленькие ставки быстро»']].forEach((r, i) => { const y = 2.3 + i * 1.0;
    seg(s, L, y, R, y, { color: C.deep });
    T(s, r[0], { x: L, y: y + 0.18, w: 5.6, h: 0.7, fontSize: 16, color: C.dim });
    seg(s, 6.5, y + 0.45, 6.95, y + 0.45, { color: C.coral, width: 1.25, arrow: true });
    T(s, r[1], { x: 7.2, y: y + 0.18, w: 5.3, h: 0.7, fontFace: SANS_B, fontSize: 17, color: C.paper }); });
  src(s, 'Liedtka & Ogilvie, 2011, гл. 1: 50 менеджеров'); }

// 7 — growth matrix (plain axes)
{ const s = slide('left', 7, S1);
  title(s, 'Матрица путей роста');
  const mx = 1.6, my = 1.9, mw = 6.5, mh = 4.2, hw = mw / 2, hh = mh / 2;
  seg(s, mx, my + mh, mx + mw + 0.25, my + mh, { color: C.ice, width: 1.25, arrow: true });
  seg(s, mx, my + mh, mx, my - 0.2, { color: C.ice, width: 1.25, arrow: true });
  seg(s, mx + hw, my, mx + hw, my + mh, { color: C.deep });
  seg(s, mx, my + hh, mx + mw, my + hh, { color: C.deep });
  T(s, 'КЛИЕНТЫ:  прежние  →  новые', { x: mx, y: my + mh + 0.12, w: mw, h: 0.32, fontSize: 12, color: C.ice, align: 'center' });
  T(s, 'ПРОДУКТ:  прежний  →  новый', { x: mx - 2.45, y: my + hh - 0.16, w: mh, h: 0.32, fontSize: 12, color: C.ice, align: 'center', rotate: 270 });
  const q = (x, y, head, body, col, size) => { T(s, head, { x: x + 0.25, y: y + 0.3, w: hw - 0.45, h: 0.55, fontFace: POSTER, bold: true, fontSize: size || 15, color: col }); T(s, body, { x: x + 0.25, y: y + 0.95, w: hw - 0.45, h: 0.9, fontSize: 15, color: C.ice }); };
  q(mx, my + hh, 'ПОСТЕПЕННЫЕ', 'обновление продукта', C.dim);
  q(mx, my, 'ЭВОЛЮЦИОННЫЕ', 'Toyota Prius', C.ice);
  q(mx + hw, my + hh, 'ЭВОЛЮЦИОННЫЕ', 'Tata Nano', C.ice);
  q(mx + hw, my, 'РЕВОЛЮЦИОННЫЕ', 'Sony Walkman, Apple iPod', C.paper);
  T(s, 'Провал: Segway', { x: 9.0, y: 2.1, w: 3.5, h: 0.45, fontFace: SANS_B, fontSize: 17, color: C.coral });
  T(s, '«изобретение — это еще не инновация»', { x: 9.0, y: 2.7, w: 3.5, h: 1.4, fontFace: POSTER, bold: true, fontSize: 19, color: C.paper });
  T(s, 'Совет Брауна: держать проекты во всех зонах матрицы', { x: 9.0, y: 4.5, w: 3.5, h: 0.9, fontSize: 15, color: C.ice });
  src(s, 'Браун, 2012, гл. 7 (матрица IDEO)'); }

// 8 — Kaiser before/after
{ const s = slide('right', 8, S1);
  title(s, 'Kaiser Permanente: обучили своих');
  frame(s, L, 1.85, 3.3, 4.6, 'медсестра разговаривает с пациентом у кровати');
  const bx = 4.55;
  T(s, 'Было', { x: bx, y: 1.85, w: 3.6, h: 0.4, fontFace: SANS_B, fontSize: 15, color: C.dim });
  T(s, '≈45' + NB + 'мин', { x: bx, y: 2.25, w: 3.7, h: 1.1, fontFace: POSTER, bold: true, fontSize: 44, color: C.dim });
  T(s, 'около 45 минут — совещание в сестринской перед сменой; информация терялась', { x: bx, y: 3.4, w: 3.5, h: 1.1, fontSize: 15, color: C.ice });
  seg(s, 8.25, 2.85, 8.75, 2.85, { color: C.coral, width: 1.5, arrow: true });
  T(s, 'Стало', { x: 8.95, y: 1.85, w: 3.6, h: 0.4, fontFace: SANS_B, fontSize: 15, color: C.coral });
  T(s, 'БОЛЕЕ ЧЕМ ВДВОЕ', { x: 8.95, y: 2.25, w: 3.6, h: 1.1, fontFace: POSTER, bold: true, fontSize: 26, color: C.paper, valign: 'middle' });
  T(s, 'сократилось время до первого контакта с пациентом', { x: 8.95, y: 3.4, w: 3.5, h: 1.1, fontSize: 15, color: C.paper });
  seg(s, bx, 4.75, R, 4.75, { color: C.deep });
  T(s, 'Решение: передача смены у постели пациента; прототип за неделю', { x: bx, y: 4.9, w: R - bx, h: 0.5, fontFace: SANS_B, fontSize: 16, color: C.paper });
  T(s, 'Позже, с 2011 г.: модель NKEplus в 125 отделениях 14 больниц', { x: bx, y: 5.45, w: R - bx, h: 0.5, fontSize: 15, color: C.ice });
  src(s, 'Браун, 2012, гл. 7; Brown, 2008; PMID 26108123'); }

//__KEEP_9_10__

// 11 — Nokia, four points
{ const s = slide('center', 11, S1);
  title(s, 'Nokia Ovi: оценка в книге и что было дальше');
  const ev = [['29.08.2007', 'объявлен Ovi'], ['2009', 'Браун приводит Ovi как успешное подразделение'], ['16.05.2011', 'Nokia объявляет об отказе от бренда Ovi'], ['2014', 'Microsoft покупает подразделение устройств и сервисов Nokia']];
  const ty = 3.1, x0 = 1.0, step = 3.05;
  seg(s, x0, ty, x0 + step * 3 + 0.4, ty, { color: C.ice, width: 1.5 });
  ev.forEach((e, i) => { const x = x0 + i * step, hot = i === 1;
    if (hot) ring(s, x - 0.21, ty - 0.21, 0.42, C.coral, 1.75);
    dot(s, x - 0.09, ty - 0.09, 0.18, hot ? C.coral : C.ice);
    T(s, e[0], { x: x - 0.1, y: ty - 0.95, w: 2.8, h: 0.55, fontFace: POSTER, bold: true, fontSize: hot ? 22 : 18, color: hot ? C.coral : C.paper });
    T(s, e[1], { x: x - 0.1, y: ty + 0.4, w: 2.6, h: 1.3, fontSize: 16, color: hot ? C.paper : C.ice }); });
  seg(s, L, 5.15, R, 5.15, { color: C.deep });
  T(s, 'Успех на момент описания ещё не означает успешного внедрения', { x: L, y: 5.35, w: CW, h: 0.55, fontFace: SANS_B, fontSize: 20, color: C.paper });
  T(s, 'Причины отказа от Ovi в материалах не изучались', { x: L, y: 5.95, w: CW, h: 0.4, fontSize: 14, color: C.dim });
  src(s, 'Браун, 2012, гл. 7; Ovi (Nokia), б. г.; Zeman, 2011'); }

//__KEEP_12_13__

// 14 — three columns
{ const s = slide('center', 14, S1);
  title(s, 'Что нужно для внедрения');
  const cols = [['ЛЮДИ', [['лидеры', 'P&G, Steelcase'], ['междисциплинарные команды', 'Kaiser, Steelcase'], ['сеть сторонников во всех отделах', '']]],
                ['ПРОЦЕСС', [['семинары', ''], ['пилотные проекты', 'Kaiser'], ['измерение эффекта', 'Kaiser']]],
                ['УСЛОВИЯ', [['выделенное пространство', 'Innovation Gym, P&G'], ['стимулы для сотрудничества подразделений', '']]]];
  cols.forEach((c, i) => { const x = L + i * 3.95;
    if (i > 0) seg(s, x - 0.3, 1.95, x - 0.3, 6.2, { color: C.deep });
    T(s, c[0], { x, y: 1.9, w: 3.6, h: 0.55, fontFace: POSTER, bold: true, fontSize: 20, color: i === 0 ? C.coral : C.paper });
    c[1].forEach((e, j) => { const y = 2.7 + j * 1.25;
      T(s, [{ text: e[0], options: { fontFace: SANS_B, fontSize: 16, color: C.paper, breakLine: !!e[1] } }].concat(e[1] ? [{ text: e[1], options: { fontSize: 13, color: C.dim } }] : []), { x, y, w: 3.5, h: 1.05, paraSpaceAfter: 3 }); }); });
  src(s, 'Браун, 2012, гл. 7; Леврик и др., 2020, с. 193. Группировка и примеры — по кейсам этой презентации'); }

// 15 — assignment
{ const s = slide('top', 15, S1);
  title(s, 'Задание: разберите кейс внедрения');
  T(s, 'Выберите компанию, успешно или неуспешно внедрившую дизайн-мышление', { x: L, y: 1.75, w: CW, h: 0.5, fontFace: SANS_B, fontSize: 18, color: C.paper });
  [['Кто начал внедрение? Какую роль играло руководство?', 'как в P&G'], ['Как устроены команды? Есть ли сеть сторонников?', 'как в Kaiser'], ['Какой эффект измерен и кем? Есть ли независимые данные?', 'как с цифрами IBM и McKinsey'], ['Что стало с инициативой через несколько лет?', 'как с Nokia']].forEach((q, i) => { const y = 2.55 + i * 1.02;
    seg(s, L, y, R, y, { color: C.deep });
    T(s, String(i + 1), { x: L, y: y + 0.15, w: 0.6, h: 0.7, fontFace: POSTER, bold: true, fontSize: 28, color: C.coral });
    T(s, q[0], { x: L + 0.8, y: y + 0.22, w: 7.6, h: 0.7, fontSize: 19, color: C.paper });
    T(s, q[1], { x: 9.4, y: y + 0.26, w: 3.1, h: 0.5, fontSize: 14, color: C.dim, align: 'right' }); }); }
