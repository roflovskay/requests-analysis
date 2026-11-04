// Full deck, style B ("плакатный тёмный"). Content: сценарий.md
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const [BG, SCEN, OUT, PART] = process.argv.slice(2);

// ---------- speaker notes from the scenario ----------
const md = fs.readFileSync(SCEN, 'utf8');
const NOTES = {};
md.split(/\n## Слайд /).slice(1).forEach(chunk => {
  const n = parseInt(chunk, 10);
  const m = chunk.match(/\*\*Заметки докладчика:\*\* «([\s\S]*?)»\s*$/m);
  if (m) NOTES[n] = m[1].replace(/\s+$/, '');
});
for (let i = (PART === '1' ? 1 : 16); i <= (PART === '1' ? 15 : 30); i++) if (!NOTES[i]) throw new Error('no notes for slide ' + i);

// ---------- system ----------
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.title = PART === '1' ? 'Дизайн-мышление в организации: внедрение и культура' : 'Команда, фасилитация и креативное пространство';
pres.author = 'Almaty Management University, курс «Дизайн-мышление»';
pres.theme = { headFontFace: 'Unbounded', bodyFontFace: 'Onest' };

const PAL = {
  '1': { ink: '0D1F2D', paper: 'F3F6F9', ice: 'C6D8E6', coral: 'F97279', blue: '2A72A3', dim: '9FB6C8', deep: '163650', sage: 'C6D8E6', crimson: 'F97279' },
  '2': { ink: '1B1422', paper: 'F4F1F6', ice: 'E6DDEC', coral: 'F2547A', blue: '8B729C', dim: 'B5A6C2', deep: '3A2C47', sage: 'A6B8A0', crimson: 'E20942' } };
const C = PAL[PART];
const BGMAP = process.env.LEAF ? { 16: 'vtitle', 17: 'vedge_r', 18: 'vconv18', 19: 'vconvC', 20: 'vedge_b', 21: 'vedge_bl', 22: 'vedge_b', 23: 'vedge_bl', 24: 'vedge_b', 25: 'vedge_bl', 26: 'vedge_b', 27: 'vedge_bl', 28: 'vconv28', 29: 'vconvC', 30: 'vedge_b', refs: 'vedge_bl' } : null;
const SANS = 'Onest', SANS_B = 'Onest SemiBold', POSTER = 'Unbounded';
const NB = ' ';
const W = 13.333, L = 0.8, R = W - 0.8, CW = R - L;

const piRuns = t => t.split(/(π)/).filter(Boolean).map(x => x === 'π' ? { text: x, options: { fontFace: 'Arial' } } : { text: x });
const T = (s, text, o) => s.addText(typeof text === 'string' && text.includes('π') ? piRuns(text) : text, Object.assign({ isTextBox: true, margin: 0, valign: 'top', fontFace: SANS, color: C.ice, fontSize: 16 }, o));
const title = (s, text, o = {}) => T(s, text.toUpperCase().replace(/Π/g, 'π'), Object.assign({ x: L, y: 0.55, w: CW, h: 1.15, fontFace: POSTER, bold: true, fontSize: 24, color: C.paper, lineSpacingMultiple: 0.98 }, o));
const src = (s, text, o = {}) => T(s, text, Object.assign({ x: L, y: 6.86, w: CW, h: 0.34, fontSize: 10.5, color: C.dim, valign: 'bottom' }, o));
function seg(s, x1, y1, x2, y2, o = {}) {
  const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  let flipH = false, flipV = false;
  if (x1 <= x2 && y1 <= y2) {} else if (x1 > x2 && y1 <= y2) flipH = true; else if (x1 <= x2 && y1 > y2) flipV = true; else { flipH = true; flipV = true; }
  const line = { color: o.color || C.dim, width: o.width || 1 };
  if (o.dash) line.dashType = o.dash;
  if (o.arrow) line.endArrowType = 'triangle';
  s.addShape(pres.shapes.LINE, { x, y, w, h, flipH, flipV, line });
}
function frame(s, x, y, w, h, label) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.ink, transparency: 70 }, line: { color: C.dim, width: 0.75 } });
  T(s, 'Фото: ' + label, { x: x + 0.25, y: y + h - 0.65, w: w - 0.5, h: 0.4, fontSize: 10.5, color: C.dim, valign: 'bottom' });
}
const dot = (s, x, y, d, color) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: 'none' } });
const ring = (s, x, y, d, color, width = 1) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { type: 'none' }, line: { color, width } });
function slide(bg, n, section) {
  const s = pres.addSlide({ sectionTitle: section });
  s.background = { path: `${BG}/${(BGMAP && BGMAP[n]) || bg}.png` };
  s.addNotes(NOTES[n]);
  return s;
}
// ---------- references ----------
const srcBlock = md.split('\n# Источники')[1].split('\n# Что нельзя менять')[0];
const REF = {};
srcBlock.split('\n').forEach(l => { const m = l.match(/^(\d+)\. (.*)$/); if (m) REF[+m[1]] = m[2].replace(/\*/g, '').replace(/\s*\[[^\]]*\]/g, '').replace(/\.\./g, '.').trim(); });
function refSlide(ids, section) {
  const s = pres.addSlide({ sectionTitle: section });
  s.background = { path: `${BG}/${(BGMAP && BGMAP.refs) || 'top'}.png` };
  s.addNotes('Список источников, на которые есть ссылки в слайдах этой части. При показе не озвучивается.');
  title(s, 'Источники');
  const items = ids.map(i => REF[i]); const half = Math.ceil(items.length / 2);
  [items.slice(0, half), items.slice(half)].forEach((col, k) => T(s, col.map((t, i, a) => ({ text: t, options: { breakLine: i < a.length - 1 } })), { x: L + k * 6.0, y: 1.6, w: 5.7, h: 5.5, fontSize: 10, color: C.ice, paraSpaceAfter: 5, lineSpacingMultiple: 1.0 }));
}


const S1 = 'Неделя 11. Внедрение и культура', S2 = 'Неделя 12. Команда, фасилитация, пространство';

if (PART === '1') {
pres.addSection({ title: S1 });
// 1 — title
{ const s = slide('title', 1, S1);
  T(s, 'ДИЗАЙН-МЫШЛЕНИЕ\nВ' + NB + 'ОРГАНИЗАЦИИ', { x: L, y: 1.35, w: CW, h: 2.4, fontFace: POSTER, bold: true, fontSize: 54, color: C.paper, lineSpacingMultiple: 0.95 });
  T(s, 'внедрение и культура', { x: L, y: 4.0, w: 9, h: 0.8, fontSize: 32, color: C.sage });
  T(s, 'Курс «Дизайн-мышление» · неделя 11', { x: L, y: 6.55, w: 7, h: 0.4, fontSize: 14, color: C.dim });
  T(s, 'Almaty Management University', { x: 7.0, y: 6.55, w: R - 7.0, h: 0.4, fontFace: SANS_B, fontSize: 14, color: C.coral, align: 'right' }); }

// 2 — quote + photo
{ const s = slide('left', 2, S1);
  frame(s, 6.9, 0, W - 6.9, 7.5, 'гоночный велосипед на горной дороге');
  title(s, 'Инструмент есть —\nподготовки нет', { w: 5.8, h: 1.3, fontSize: 28 });
  T(s, '«Дизайн-мышление напоминает фантастический гоночный велосипед <…> Но его наличие не означает, что мы сможем пересечь Альпы. Нужна еще и соответствующая физическая подготовка!»', { x: L, y: 2.35, w: 5.7, h: 3.5, fontSize: 21, lineSpacingMultiple: 1.2 });
  T(s, 'Леврик и др., 2020, с. 190', { x: L, y: 6.4, w: 5.5, h: 0.4, fontFace: SANS_B, fontSize: 13, color: C.coral }); }



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

// 9 — P&G
{ const s = slide('right', 9, S1);
  title(s, 'P&G: дизайн в ДНК компании');
  T(s, 'Решения руководителя (A. G. Lafley)', { x: L, y: 1.9, w: 6, h: 0.4, fontSize: 14, color: C.dim });
  ['назначил вице-президента по дизайну (К. Коцка)', 'встроил дизайнеров в бизнес-подразделения', 'создал Innovation Gym', 'поднял инновации и дизайн до уровня базовой стратегии'].forEach((t, i) => { const y = 2.4 + i * 0.78; seg(s, L, y, L + 5.6, y, { color: C.deep }); T(s, t, { x: L, y: y + 0.13, w: 5.6, h: 0.6, fontSize: 17, color: C.paper }); });
  seg(s, 6.85, 3.7, 7.55, 3.7, { color: C.coral, width: 1.25, arrow: true });
  T(s, '≈100', { x: 7.85, y: 2.3, w: 4.7, h: 1.6, fontFace: POSTER, bold: true, fontSize: 88, color: C.paper });
  T(s, 'внутренних фасилитаторов дизайн-мышления (2008)', { x: 7.9, y: 3.95, w: 4.6, h: 0.7, fontSize: 17, color: C.ice });
  T(s, 'более 40 воркшопов в подразделениях за год', { x: 7.9, y: 4.7, w: 4.6, h: 0.7, fontFace: SANS_B, fontSize: 15, color: C.coral });
  T(s, '«Все семинары в мире не привели бы к переменам в P&G»', { x: L, y: 5.75, w: CW, h: 0.5, fontSize: 16, color: C.dim, italic: true });
  src(s, 'Браун, 2012, гл. 7; IMD, б. г.; Newsweek, б. г.; Rae, 2008'); }

// 10 — Steelcase
{ const s = slide('left', 10, S1);
  frame(s, 8.9, 0, W - 8.9, 7.5, 'больничная зона ожидания');
  title(s, 'Steelcase: от мебели к среде', { w: 7.6 });
  T(s, 'Workplace Futures: внутренний аналитический центр\nNurture: подразделение для медицинских учреждений', { x: L, y: 1.75, w: 7.6, h: 0.75, fontSize: 15, color: C.dim, paraSpaceAfter: 2 });
  T(s, 'Было', { x: L, y: 2.85, w: 2, h: 0.4, fontFace: SANS_B, fontSize: 14, color: C.dim });
  T(s, '«разработка комфортных кресел для приемного покоя»', { x: L, y: 3.25, w: 7.6, h: 0.8, fontSize: 20, color: C.dim, strike: 'sngStrike' });
  T(s, 'Стало', { x: L, y: 4.35, w: 2, h: 0.4, fontFace: SANS_B, fontSize: 14, color: C.coral });
  T(s, '«Как можно создать зоны приватности на общественных площадях?»', { x: L, y: 4.75, w: 7.6, h: 1.4, fontFace: POSTER, bold: true, fontSize: 22, color: C.paper });
  src(s, 'Браун, 2012, гл. 7', { w: 7.6 }); }



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

// 12 — numbers
{ const s = slide('two', 12, S1);
  title(s, 'Цифры и их ограничения');
  T(s, '301%', { x: L, y: 1.8, w: 5.8, h: 1.7, fontFace: POSTER, bold: true, fontSize: 80, color: C.paper });
  T(s, 'ROI практики дизайн-мышления IBM за 3 года', { x: L, y: 3.65, w: 5.4, h: 0.7, fontSize: 17 });
  T(s, 'заказано IBM', { x: L, y: 4.55, w: 5.4, h: 0.5, fontFace: SANS_B, fontSize: 20, color: C.coral });
  T(s, '+32' + NB + 'п.' + NB + 'п.', { x: 7.0, y: 1.8, w: 5.8, h: 1.7, fontFace: POSTER, bold: true, fontSize: 80, color: C.paper });
  T(s, 'рост выручки у верхнего квартиля McKinsey Design Index; TRS: +56' + NB + 'п.' + NB + 'п.', { x: 7.0, y: 3.65, w: 5.5, h: 0.7, fontSize: 17 });
  T(s, 'корреляция, а не причинность', { x: 7.0, y: 4.55, w: 5.5, h: 0.5, fontFace: SANS_B, fontSize: 20, color: C.coral });
  src(s, 'Forrester Consulting, 2018 (исследование заказано IBM); McKinsey & Company, 2018'); }

// 13 — why it fails
{ const s = slide('left', 13, S1);
  title(s, 'Почему не получается');
  const r = [['Идеи с воркшопов редко доходят до реализации', 'Ackermann, 2023'], ['Внешние консультанты не знают контекста проблемы', 'Ackermann, 2023'], ['Отдельные семинары без организационных изменений имеют ограниченное влияние', 'Браун, 2012, гл. 7']];
  r.forEach((p, i) => { const y = 2.0 + i * 1.35; seg(s, L, y, R, y, { color: C.deep });
    T(s, p[0], { x: L, y: y + 0.18, w: 8.6, h: 1.0, fontFace: POSTER, bold: true, fontSize: 19, color: C.paper });
    T(s, p[1], { x: 9.9, y: y + 0.22, w: 2.6, h: 0.4, fontFace: SANS_B, fontSize: 13, color: C.coral, align: 'right' }); });
  T(s, 'Критик метода и его сторонник указывают на одну проблему: разрыв возникает на этапе внедрения.', { x: L, y: 6.1, w: CW, h: 0.5, fontSize: 15, color: C.dim });
  src(s, 'Ackermann, 2023; Stanford Social Innovation Review, б. г.; Браун, 2012, гл. 7'); }



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

refSlide([1,2,3,4,5,6,7,8,9,10,11,19,20,21,22,23], S1);
} else {
pres.addSection({ title: S2 });
// 16 — title
{ const s = slide('title', 16, S2);
  T(s, 'КОМАНДА,\nФАСИЛИТАЦИЯ', { x: L, y: 1.35, w: CW, h: 2.4, fontFace: POSTER, bold: true, fontSize: 54, color: C.paper, lineSpacingMultiple: 0.95 });
  T(s, 'и креативное пространство', { x: L, y: 4.0, w: 9, h: 0.8, fontSize: 32, color: C.sage });
  T(s, 'Курс «Дизайн-мышление» · неделя 12', { x: L, y: 6.55, w: 7, h: 0.4, fontSize: 14, color: C.dim });
  T(s, 'Almaty Management University', { x: 7.0, y: 6.55, w: R - 7.0, h: 0.4, fontFace: SANS_B, fontSize: 14, color: C.coral, align: 'right' }); }

// 17 — why a team
{ const s = slide('left', 17, S2);
  frame(s, 7.4, 0, W - 7.4, 7.5, 'люди работают у стены со стикерами');
  title(s, 'Почему команда', { w: 6.2 });
  T(s, 'Взгляд с другой стороны помогает выйти из тупика', { x: L, y: 1.9, w: 6.1, h: 1.9, fontFace: POSTER, bold: true, fontSize: 26, color: C.paper });
  T(s, 'Два фактора успеха команды', { x: L, y: 4.15, w: 6, h: 0.4, fontSize: 14, color: C.dim });
  ['глубокие технические знания', 'широкие общие знания'].forEach((t, i) => { const y = 4.65 + i * 0.7; seg(s, L, y, L + 5.6, y, { color: C.blue, width: 1.5 }); T(s, t, { x: L, y: y + 0.12, w: 5.6, h: 0.5, fontSize: 18, color: C.ice }); });
  src(s, 'Леврик и др., 2020, с. 144', { w: 6.2 }); }

// 18 — multi vs inter
{ const s = slide('two', 18, S2);
  title(s, 'Много- и междисциплинарная команда');
  // left diagram: experts -> compromise
  const lx = 1.6, ly = 2.1;
  [0, 1, 2, 3].forEach(i => { const x = lx + i * 1.0; ring(s, x, ly, 0.5, C.ice, 1); seg(s, x + 0.25, ly + 0.55, lx + 1.75, ly + 1.75, { color: C.dim, arrow: true }); });
  s.addShape(pres.shapes.RECTANGLE, { x: lx + 1.45, y: ly + 1.8, w: 0.6, h: 0.45, fill: { type: 'none' }, line: { color: C.dim, width: 1 } });
  T(s, 'компромисс', { x: lx + 0.75, y: ly + 2.35, w: 2.0, h: 0.35, fontSize: 12, color: C.dim, align: 'center' });
  T(s, 'Многодисциплинарная', { x: L, y: 5.05, w: 5.3, h: 0.45, fontFace: SANS_B, fontSize: 18, color: C.ice });
  T(s, 'каждый эксперт отстаивает свою точку зрения → решение-компромисс', { x: L, y: 5.5, w: 5.3, h: 0.8, fontSize: 15, color: C.ice });
  // right diagram: around shared solution
  const cx = 9.45, cy = 3.25;
  ring(s, cx - 0.65, cy - 0.65, 1.3, C.coral, 1.5);
  T(s, 'общее решение', { x: cx - 0.6, y: cy - 0.3, w: 1.2, h: 0.6, fontSize: 11, color: C.paper, align: 'center', valign: 'middle' });
  [0, 1, 2, 3, 4, 5].forEach(i => { const a = i * Math.PI / 3 - Math.PI / 2; ring(s, cx + 1.45 * Math.cos(a) - 0.25, cy + 1.2 * Math.sin(a) - 0.25, 0.5, C.paper, 1); });
  T(s, 'Междисциплинарная', { x: 7.0, y: 5.05, w: 5.5, h: 0.45, fontFace: SANS_B, fontSize: 18, color: C.paper });
  T(s, 'идеи создаются коллективно, каждый отвечает за общее решение', { x: 7.0, y: 5.5, w: 5.5, h: 0.8, fontSize: 15, color: C.paper });
  src(s, 'Леврик и др., 2020, с. 145'); }

// 19 — T and π
{ const s = slide('center', 19, S2);
  title(s, 'Т-образный и π-образный профиль');
  const bar = (x, y, w, h, col) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: col }, line: { type: 'none' } });
  // T
  bar(1.2, 2.1, 3.6, 0.32, C.sage); bar(2.84, 2.42, 0.32, 2.6, C.blue);
  T(s, 'эмпатия и сотрудничество', { x: 1.2, y: 1.72, w: 3.6, h: 0.32, fontSize: 12, color: C.ice, align: 'center' });
  T(s, 'глубина экспертизы', { x: 3.3, y: 3.4, w: 2.0, h: 0.6, fontSize: 12, color: C.ice });
  T(s, 'Т', { x: 1.2, y: 5.25, w: 0.8, h: 0.6, fontFace: POSTER, bold: true, fontSize: 24, color: C.paper });
  T(s, 'концепция Д. Леонард-Бартон', { x: 1.9, y: 5.35, w: 3.3, h: 0.4, fontSize: 13, color: C.dim });
  // π
  bar(6.0, 2.1, 3.6, 0.32, C.sage); bar(6.85, 2.42, 0.32, 2.6, C.blue); bar(8.45, 2.42, 0.32, 2.2, C.blue);
  T(s, 'глубина в нескольких областях, несколько ролей в одном проекте', { x: 6.0, y: 5.25, w: 3.7, h: 0.9, fontSize: 13, color: C.ice });
  T(s, 'π', { x: 6.0, y: 1.55, w: 0.6, h: 0.5, fontFace: POSTER, bold: true, fontSize: 22, color: C.paper });
  // practice
  seg(s, 9.95, 2.0, 9.95, 6.1, { color: C.deep });
  T(s, 'Практика', { x: 10.2, y: 2.0, w: 2.1, h: 0.4, fontFace: SANS_B, fontSize: 14, color: C.coral });
  T(s, 'попросите участников нарисовать свой\nТ-профиль', { x: 10.2, y: 2.45, w: 2.35, h: 1.6, fontSize: 16, color: C.paper });
  src(s, 'Леврик и др., 2020, с. 145–149'); }

// 20 — six rules
{ const s = slide('top', 20, S2);
  title(s, 'Шесть правил команды');
  ['Общее видение: ответ на вопрос «Как мы можем…»', 'Каждый этап ведёт соответствующий эксперт', 'Общие ценности, доступные всем', 'Атмосфера доверия и уважения к чужому опыту', 'Обратная связь', 'Ясные процессы и стандарты качества'].forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2), x = L + col * 6.0, y = 1.95 + row * 1.45;
    seg(s, x, y, x + 5.6, y, { color: C.deep });
    T(s, String(i + 1), { x, y: y + 0.15, w: 0.7, h: 0.8, fontFace: POSTER, bold: true, fontSize: 30, color: C.blue });
    T(s, t, { x: x + 0.85, y: y + 0.22, w: 4.75, h: 0.95, fontSize: 18, color: C.paper }); });
  src(s, 'Леврик и др., 2020, с. 147–149; пример общих ценностей: правила мозгового штурма (с. 148)'); }

// 21 — safety as foundation
{ const s = slide('right', 21, S2);
  title(s, 'Безопасность как основа');
  T(s, 'U-образная команда', { x: L, y: 1.95, w: 4.2, h: 0.45, fontFace: SANS_B, fontSize: 18, color: C.paper });
  T(s, 'можно ошибиться, не боясь потерять работу', { x: L, y: 2.45, w: 4.0, h: 0.9, fontSize: 17, color: C.ice });
  T(s, 'Леврик и др., 2020, с. 150–151', { x: L, y: 3.4, w: 4, h: 0.35, fontSize: 12, color: C.dim });
  T(s, 'Google Project Aristotle: пять динамик эффективных команд', { x: L, y: 4.3, w: 4.2, h: 0.9, fontSize: 15, color: C.ice });
  // pillars on a slab
  const bx = 5.6, bw = 6.9;
  ['Надёжность', 'Структура и ясность', 'Смысл', 'Значимость работы'].forEach((p, i) => { const x = bx + 0.15 + i * 1.72;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 1.45, h: 3.0, fill: { color: C.blue, transparency: 60 }, line: { color: C.ice, width: 0.75 } });
    T(s, String(i + 2) + '. ' + p, { x: x + 0.1, y: 2.15, w: 1.25, h: 1.2, fontSize: 13, color: C.paper }); });
  s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 5.1, w: bw, h: 0.85, fill: { color: C.crimson }, line: { type: 'none' } });
  T(s, '1. Психологическая безопасность', { x: bx + 0.3, y: 5.1, w: bw - 0.6, h: 0.85, fontFace: SANS_B, fontSize: 19, color: C.ink, valign: 'middle' });
  src(s, 'Rozovsky, 2015; термин популяризировала Э. Эдмондсон (Edmondson, 1999)'); }

// 22 — HBDI
{ const s = slide('left', 22, S2);
  title(s, 'Модель HBDI: четыре стиля мышления');
  const qx = L, qy = 1.95, qw = 7.0, qh = 4.3;
  seg(s, qx + qw / 2, qy, qx + qw / 2, qy + qh, { color: C.ice });
  seg(s, qx, qy + qh / 2, qx + qw, qy + qh / 2, { color: C.ice });
  const qs = ['аналитический, технический, решающий проблемы, финансовый', 'интегрирующий, творческий, оригинальный (новатор)', 'организующий, планирующий, внедряющий', 'коммуницирующий, обучающий, общающийся'];
  qs.forEach((t, i) => { const x = qx + (i % 2) * qw / 2 + 0.25, y = qy + Math.floor(i / 2) * qh / 2 + 0.3; T(s, t, { x, y, w: qw / 2 - 0.5, h: 1.6, fontSize: 16, color: C.paper }); });
  T(s, 'В команде нужны высокие баллы в разных квадрантах', { x: 8.45, y: 1.95, w: 4.1, h: 1.3, fontFace: POSTER, bold: true, fontSize: 17, color: C.paper });
  T(s, 'На воркшопе, когда времени мало: «аналитический/методичный» и «интуитивный/предпочитающий много подходов».', { x: 8.45, y: 3.5, w: 4.1, h: 1.3, fontSize: 14, color: C.ice });
  T(s, 'Деление на «аналитическое левое» и «целостное правое» полушарие авторы называют мифом.', { x: 8.45, y: 5.0, w: 4.1, h: 1.0, fontSize: 14, color: C.dim });
  src(s, 'Леврик и др., 2020, с. 152–153'); }

// 23 — facilitator + decision models
{ const s = slide('right', 23, S2);
  title(s, 'Фасилитатор: процесс, а не содержание');
  ['Нейтрален к содержанию', 'Создаёт культуру диалога', 'Помогает пройти «зону споров»'].forEach((t, i) => { const y = 2.0 + i * 1.0; seg(s, L, y, L + 4.3, y, { color: C.deep }); T(s, t, { x: L, y: y + 0.17, w: 4.3, h: 0.6, fontSize: 18, color: C.paper }); });
  T(s, 'Четыре модели принятия решений', { x: 5.75, y: 1.9, w: 6.7, h: 0.4, fontSize: 14, color: C.dim });
  const panels = [['«концепция»', 'linear'], ['«надежда»', 'hope'], ['«неподходящее время»', 'cut'], ['«реалистичная модель»', 'real']];
  panels.forEach((p, i) => { const px = 5.75 + (i % 2) * 3.45, py = 2.45 + Math.floor(i / 2) * 2.05, w = 3.0, h = 1.2, col = p[1] === 'real' ? C.coral : C.ice;
    if (p[1] === 'linear') seg(s, px, py + h, px + w, py, { color: col, width: 1.5 });
    if (p[1] === 'hope') { seg(s, px, py, px + w, py + h / 2, { color: col, width: 1.25 }); seg(s, px, py + h, px + w, py + h / 2, { color: col, width: 1.25 }); seg(s, px, py + h / 2, px + w, py + h / 2, { color: col, width: 1.25 }); }
    if (p[1] === 'cut') { seg(s, px, py + h, px + w * 0.45, py + h * 0.45, { color: col, width: 1.5 }); s.addShape(pres.shapes.LINE, { x: px + w * 0.45, y: py + h * 0.2, w: 0, h: h * 0.5, line: { color: col, width: 2 } }); }
    if (p[1] === 'real') { seg(s, px, py + h / 2, px + w * 0.5, py, { color: col, width: 1.5 }); seg(s, px, py + h / 2, px + w * 0.5, py + h, { color: col, width: 1.5 }); seg(s, px + w * 0.5, py, px + w, py + h / 2, { color: col, width: 1.5 }); seg(s, px + w * 0.5, py + h, px + w, py + h / 2, { color: col, width: 1.5 }); }
    T(s, p[0], { x: px, y: py + h + 0.12, w: w, h: 0.35, fontSize: 13, color: col }); });
  src(s, 'Леврик и др., 2020, с. 180–184'); }

// 24 — nine principles
{ const s = slide('top', 24, S2);
  title(s, 'Девять принципов фасилитатора');
  ['Проверяйте допущения и выводы', 'Делитесь всей значимой информацией', 'Приводите конкретные примеры', 'Объясняйте намерения и выводы', 'Фокусируйтесь на интересах, а не на позициях', 'Совмещайте отстаивание своей точки зрения с вовлечением других', 'Вместе выбирайте следующие шаги и способы проверить разногласия', 'Обсуждайте темы, которые команда избегает', 'Выбирайте способ принятия решения под нужный уровень приверженности'].forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3), x = L + col * 3.95, y = 1.85 + row * 1.6;
    seg(s, x, y, x + 3.65, y, { color: C.deep });
    T(s, String(i + 1), { x, y: y + 0.15, w: 0.5, h: 0.5, fontFace: POSTER, bold: true, fontSize: 18, color: C.blue });
    T(s, t, { x: x + 0.55, y: y + 0.17, w: 3.1, h: 1.3, fontSize: 15, color: C.paper }); });
  src(s, 'Леврик и др., 2020, с. 183; первоисточник: Schwarz, 2002 (Ground Rules for Effective Groups)'); }

// 25 — ARE IN
{ const s = slide('left', 25, S2);
  title(s, 'Состав и навыки');
  [['A', 'Authority', 'полномочия инициировать изменения'], ['R', 'Resources', 'нужные ресурсы'], ['E', 'Expertise', 'опыт и знания'], ['I', 'Information', 'информация, в том числе неформальная'], ['N', 'Need', 'знание потребностей клиентов']].forEach((r, i) => { const y = 1.85 + i * 0.83;
    T(s, r[0], { x: L, y, w: 0.7, h: 0.75, fontFace: POSTER, bold: true, fontSize: 34, color: i === 3 ? C.coral : C.paper });
    if (i === 2) T(s, ' ', { x: L, y, w: 0.1, h: 0.1 });
    T(s, r[1], { x: L + 0.95, y: y + 0.08, w: 2.1, h: 0.4, fontFace: SANS_B, fontSize: 16, color: C.sage });
    T(s, r[2], { x: L + 3.1, y: y + 0.08, w: 3.6, h: 0.65, fontSize: 15, color: C.ice }); });
  seg(s, 7.9, 1.9, 7.9, 6.2, { color: C.deep });
  T(s, 'Шесть навыков фасилитатора', { x: 8.2, y: 1.85, w: 4.3, h: 0.4, fontFace: SANS_B, fontSize: 15, color: C.coral });
  T(s, ['налаживание связей', 'подходящие процессы и методы', 'среда участия', 'значимые результаты', 'широта знаний', 'позитивный настрой'].map((t, i, a) => ({ text: t, options: { breakLine: i < a.length - 1 } })), { x: 8.2, y: 2.4, w: 4.3, h: 3.5, fontSize: 17, color: C.paper, paraSpaceAfter: 9 });
  src(s, 'Леврик и др., 2020, с. 184–185; первоисточник ARE IN: метод Future Search (Weisbord, Janoff; Participedia, б. г.)'); }

// 26 — workshop stages
{ const s = slide('top', 26, S2);
  title(s, 'Воркшоп: четыре этапа');
  [['Контекст', 'почему? чего достичь?'], ['План', 'процесс, информация, участники, среда'], ['Проведение', 'подготовка пространства, приветствие и разогрев, методы, заключение'], ['Анализ', 'цель достигнута? что дальше? что улучшить?']].forEach((st, i) => { const x = L + i * 2.98;
    T(s, String(i + 1), { x, y: 1.85, w: 0.6, h: 0.6, fontFace: POSTER, bold: true, fontSize: 26, color: C.coral });
    if (i < 3) seg(s, x + 0.7, 2.15, x + 2.75, 2.15, { color: C.dim, arrow: true });
    T(s, st[0], { x, y: 2.6, w: 2.75, h: 0.45, fontFace: SANS_B, fontSize: 18, color: C.paper });
    T(s, st[1], { x, y: 3.08, w: 2.7, h: 1.2, fontSize: 14, color: C.ice }); });
  seg(s, L, 4.45, R, 4.45, { color: C.deep });
  T(s, 'Методы: графическая фиксация · мировое кафе · открытое пространство', { x: L, y: 4.6, w: 7.6, h: 0.45, fontFace: SANS_B, fontSize: 15, color: C.ice });
  T(s, '«Если после воркшопа все остается таким же, как и до его проведения, значит, фасилитатор не справился со своей задачей»', { x: L, y: 5.2, w: 7.6, h: 1.0, fontSize: 15, color: C.dim, italic: true });
  frame(s, 8.9, 4.65, 3.63, 2.1, 'мировое кафе: участники за столами');
  src(s, 'Леврик и др., 2020, с. 186–188', { w: 7.6 }); }

// 27 — creative space: room plan
{ const s = slide('center', 27, S2);
  title(s, 'Креативное пространство: с чего начать');
  ['Около 5' + NB + 'м² на участника, естественный свет', 'Меньше значит лучше: сначала вынести всё', 'Штабелируемые стулья, мебель на колёсиках', 'Стены и мобильные доски: рабочая поверхность', 'Материалы для прототипов под рукой с начала воркшопа'].forEach((t, i) => { const y = 1.9 + i * 0.85; seg(s, L, y, L + 4.3, y, { color: C.deep }); T(s, t, { x: L, y: y + 0.12, w: 4.3, h: 0.7, fontSize: 15, color: C.paper }); });
  // plan
  const px = 5.5, py = 1.95, pw = 3.9, ph = 3.9;
  s.addShape(pres.shapes.RECTANGLE, { x: px, y: py, w: pw, h: ph, fill: { type: 'none' }, line: { color: C.dim, width: 0.75 } });
  [[px, py, pw, 0.09], [px, py, 0.09, ph], [px + pw - 0.09, py + 0.6, 0.09, 2.2]].forEach(b => s.addShape(pres.shapes.RECTANGLE, { x: b[0], y: b[1], w: b[2], h: b[3], fill: { color: C.ice }, line: { type: 'none' } }));
  [[px + 0.5, py + ph - 0.6], [px + 0.85, py + ph - 0.6], [px + 1.2, py + ph - 0.6]].forEach(c => ring(s, c[0], c[1], 0.25, C.ice, 1));
  s.addShape(pres.shapes.RECTANGLE, { x: px + pw - 1.3, y: py + ph - 0.75, w: 0.9, h: 0.4, fill: { type: 'none' }, line: { color: C.coral, width: 1 } });
  ring(s, px + 1.2, py + 1.2, 1.5, C.blue, 0.75);
  T(s, 'свободный центр', { x: px + 1.0, y: py + 1.75, w: 1.9, h: 0.35, fontSize: 11, color: C.ice, align: 'center' });
  T(s, 'стены-доски', { x: px + 0.2, y: py + 0.18, w: 1.6, h: 0.3, fontSize: 10.5, color: C.ice });
  T(s, 'стулья', { x: px + 0.45, y: py + ph - 0.32, w: 1.2, h: 0.28, fontSize: 10.5, color: C.ice });
  T(s, 'материалы', { x: px + pw - 1.35, y: py + ph - 0.32, w: 1.1, h: 0.28, fontSize: 10.5, color: C.coral });
  T(s, 'Группы: 4–12 человек на недели или месяцы;\n8–25 участников на 1–2 дня', { x: px, y: py + ph + 0.15, w: pw, h: 0.6, fontSize: 12, color: C.dim });
  frame(s, 9.85, 1.95, 2.68, 4.6, 'светлое помещение с мобильными досками');
  src(s, 'Леврик и др., 2020, с. 132–135'); }

// 28 — working environment
{ const s = slide('right', 28, S2);
  title(s, 'Рабочая среда = место + люди + процесс + смысл');
  ['Начинайте с малого и наблюдайте за реакцией', 'Сопротивление принимайте всерьёз', 'Проектируйте пространство вместе с командой'].forEach((t, i) => { const y = 2.15 + i * 1.1; seg(s, L, y, L + 4.6, y, { color: C.deep }); T(s, t, { x: L, y: y + 0.17, w: 4.6, h: 0.8, fontSize: 18, color: C.paper }); });
  const cx = 9.35, cy = 4.0;
  ring(s, cx - 0.95, cy - 0.95, 1.9, C.coral, 1.5);
  T(s, 'рабочая среда', { x: cx - 0.9, y: cy - 0.25, w: 1.8, h: 0.5, fontFace: SANS_B, fontSize: 13, color: C.paper, align: 'center', valign: 'middle' });
  [['место', 0, -1.75], ['люди', 2.25, 0], ['процесс', 0, 1.75], ['смысл', -2.25, 0]].forEach(e => {
    seg(s, cx + e[1] * 0.45, cy + e[2] * 0.56, cx + e[1] * 0.72, cy + e[2] * 0.78, { color: C.dim });
    T(s, e[0], { x: cx + e[1] - 0.9, y: cy + e[2] - 0.2, w: 1.8, h: 0.4, fontFace: POSTER, bold: true, fontSize: 16, color: C.sage, align: 'center', valign: 'middle' }); });
  src(s, 'Леврик и др., 2020, с. 137–142; Doorley & Witthoft, 2012'); }

// 29 — conclusions
{ const s = slide('center', 29, S2);
  title(s, 'Три опоры сессии');
  [['КОМАНДА', 'междисциплинарная; Т- и π-профили; разные стили мышления; психологическая безопасность'], ['ФАСИЛИТАЦИЯ', 'процесс, а не содержание; девять принципов; ARE IN'], ['ПРОСТРАНСТВО', 'свобода движения и материалы; рабочая среда = место + люди + процесс + смысл']].forEach((c, i) => { const x = L + i * 3.95;
    if (i > 0) seg(s, x - 0.3, 2.0, x - 0.3, 6.0, { color: C.deep });
    T(s, c[0], { x, y: 2.1, w: 3.6, h: 0.6, fontFace: POSTER, bold: true, fontSize: 21, color: [C.sage, C.coral, C.paper][i] });
    T(s, c[1], { x, y: 2.95, w: 3.5, h: 2.6, fontSize: 18, color: C.ice, lineSpacingMultiple: 1.15 }); });
  src(s, 'Обобщение слайдов этой части: Леврик и др., 2020, с. 132–189; Rozovsky, 2015; Schwarz, 2002'); }

// 30 — assignment
{ const s = slide('top', 30, S2);
  title(s, 'Задание: проведите мини-сессию');
  [['Контекст', 'цель сессии и вопрос «Как мы можем…»'], ['План', 'участники по ARE IN, роли, методы, время'], ['Проведение', 'разогрев → основная часть → заключение'], ['Анализ', 'критерии успеха, что улучшить']].forEach((r, i) => { const y = 1.85 + i * 0.86;
    T(s, String(i + 1), { x: L, y, w: 0.55, h: 0.6, fontFace: POSTER, bold: true, fontSize: 24, color: C.coral });
    T(s, r[0], { x: L + 0.7, y: y + 0.05, w: 1.9, h: 0.45, fontFace: SANS_B, fontSize: 17, color: C.paper });
    T(s, r[1], { x: L + 2.6, y: y + 0.05, w: 4.6, h: 0.7, fontSize: 16, color: C.ice }); });
  T(s, 'Пространство: подготовьте комнату по принципам слайда «Креативное пространство»', { x: L, y: 5.45, w: 7.4, h: 0.6, fontSize: 14, color: C.dim });
  seg(s, 8.55, 1.8, 8.55, 6.5, { color: C.deep });
  T(s, 'Критерии успешной сессии', { x: 8.85, y: 1.8, w: 3.7, h: 0.45, fontFace: SANS_B, fontSize: 15, color: C.sage });
  T(s, ['высокая степень взаимообмена', 'установление и углубление отношений', 'каждый чему-то учится и вносит вклад', 'все участвуют', 'каждый услышан', 'приветствуются разные точки зрения', 'общие выводы представлены кратко', 'каждому ясно, что будет после воркшопа'].map((t, i, a) => ({ text: t, options: { breakLine: i < a.length - 1 } })), { x: 8.85, y: 2.4, w: 3.7, h: 4.1, fontSize: 13.5, color: C.ice, paraSpaceAfter: 6 });
  src(s, 'Леврик и др., 2020, с. 187–188. Длительность сессии и размер групп уточнить у преподавателя'); }

refSlide([2,12,13,14,15,16,17,18], S2);
}

pres.writeFile({ fileName: OUT }).then(() => console.log('wrote', OUT));
