// COVID-19 defence deck, redesigned. Text, charts and notes are taken verbatim from the original.
const fs = require('fs');
const path = require('path');
const [CONTENT, BG, IMG, MOD, OUT] = process.argv.slice(2);
const pptxgen = require(path.join(MOD, 'pptxgenjs'));
const content = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));
const S = n => content.find(x => x.n === n);
const txt = (n, i) => S(n).shapes[i];

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Сравнение динамики заражений COVID-19';
pres.author = 'Туякбаева Амина';
pres.theme = { headFontFace: 'IBM Plex Sans', bodyFontFace: 'IBM Plex Sans' };

const C = { parch: 'EDEDE8', panel: 'F7F6F2', icy: 'C5F9FC', ultra: '5320C0', crim: '4F032E', coffee: '1D0C13', muted: '5C4A55', mutedD: 'CFC8CB', ruleD: '3B2A33', ruleL: 'D6D3CF' };
const SANS = 'IBM Plex Sans', SANS_SB = 'IBM Plex Sans SemiBold', MONO = 'IBM Plex Mono Medium', MONO_R = 'IBM Plex Mono';
const W = 13.333, L = 0.8, R = W - 0.8, CW = R - L, TOTAL = 7;
const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: 'top', fontFace: SANS, fontSize: 16, color: C.coffee }, o));
const rule = (s, x, y, w, color) => s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 0.75 } });
const pageNo = (s, n, dark) => T(s, String(n).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0'), { x: R - 1.6, y: 6.93, w: 1.6, h: 0.32, fontFace: MONO, fontSize: 12, color: dark ? C.icy : C.ultra, align: 'right', valign: 'bottom' });
const source = (s, text, dark, w) => T(s, text, { x: L, y: 6.93, w: w || CW - 1.8, h: 0.32, fontFace: MONO_R, fontSize: 12, color: dark ? C.mutedD : C.muted, valign: 'bottom' });
function slide(bg, n) { const s = pres.addSlide(); s.background = { path: `${BG}/${bg}.png` }; s.addNotes(S(n).notes); return s; }
function header(s, title, finding) {
  T(s, title, { x: L, y: 0.42, w: CW, h: 0.62, fontFace: SANS, bold: true, fontSize: 30 });
  s.addShape(pres.shapes.RECTANGLE, { x: L, y: 1.2, w: 0.14, h: 0.14, fill: { color: C.ultra }, line: { type: 'none' } });
  T(s, finding, { x: L + 0.32, y: 1.08, w: CW - 0.32, h: 0.8, fontFace: SANS_SB, fontSize: 19, color: C.crim, lineSpacingMultiple: 1.05 });
}
// chart on a panel whose colour equals the PNG's own margin colour (F7F6F2), so the picture has no visible frame
function figure(s, n, x, y, innerH, pad = 0.15) {
  const file = `${IMG}/s${n}.png`; const [pw, ph] = { 2: [1912, 802], 3: [1912, 892], 4: [1930, 742], 5: [1912, 772], 6: [1987, 772] }[n];
  const iw = innerH * pw / ph;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: iw + 2 * pad, h: innerH + 2 * pad, fill: { color: C.panel }, line: { color: C.ruleL, width: 0.5 },
    shadow: { type: 'outer', blur: 14, offset: 4, angle: 90, color: '1D0C13', opacity: 0.12 } });
  s.addImage({ path: file, x: x + pad, y: y + pad, w: iw, h: innerH, altText: S(n).alt });
  return { w: iw + 2 * pad, h: innerH + 2 * pad };
}

// 1 — title (dark)
{ const s = slide('w_title', 1);
  T(s, txt(1, 0), { x: L, y: 0.55, w: CW, h: 0.35, fontFace: MONO, fontSize: 12, color: C.icy, charSpacing: 1 });
  T(s, txt(1, 1), { x: L, y: 1.3, w: CW, h: 1.9, fontFace: SANS, bold: true, fontSize: 52, color: C.parch, lineSpacingMultiple: 0.95 });
  T(s, txt(1, 2), { x: L, y: 3.3, w: CW, h: 0.5, fontSize: 20, color: C.parch });
  [[3, 4], [5, 6], [7, 8]].forEach(([a, b], i) => { const x = L + i * 3.98;
    T(s, txt(1, a), { x, y: 4.45, w: 3.7, h: 0.36, fontFace: MONO, fontSize: 14, color: C.icy });
    T(s, txt(1, b), { x, y: 4.9, w: 3.65, h: 1.1, fontSize: 18, color: C.parch, lineSpacingMultiple: 1.1 }); });
  T(s, txt(1, 9), { x: L, y: 6.93, w: 7, h: 0.32, fontFace: MONO_R, fontSize: 12, color: C.mutedD, valign: 'bottom' });
  pageNo(s, 1, true); }


const RUN_HEAD = 'Сравнение динамики заражений COVID-19';
function page(bg, n) { const s = slide(bg, n);
  T(s, String(n).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0'), { x: L, y: 0.42, w: 2.4, h: 0.3, fontFace: MONO, fontSize: 13, color: C.icy });
  T(s, RUN_HEAD, { x: R - 6, y: 0.42, w: 6, h: 0.3, fontFace: MONO_R, fontSize: 12, color: C.mutedD, align: 'right' });
  return s; }
function head3(s, title, finding, hl = []) {
  T(s, title, { x: L, y: 0.85, w: CW, h: 0.6, fontFace: SANS, bold: true, fontSize: 30, color: C.parch });
  let runs = [{ text: finding, options: {} }];
  hl.forEach(h => { runs = runs.flatMap(r => { if (r.options.bold || !r.text.includes(h)) return [r]; const [a, ...b] = r.text.split(h);
    return [{ text: a, options: {} }, { text: h, options: { bold: true, color: C.icy } }, { text: b.join(h), options: {} }].filter(x => x.text); }); });
  T(s, runs, { x: L, y: 1.47, w: CW, h: 0.75, fontFace: SANS_SB, fontSize: 19, color: C.parch, lineSpacingMultiple: 1.08 }); }
const DIMS = { 2: [1912, 802], 3: [1912, 892], 4: [1930, 742], 5: [1912, 772], 6: [1987, 772] };
// light card: the chart keeps its light background; card colour equals the PNG margin colour
function card(s, n, x, y, h, pad = 0.16) { const [pw, ph] = DIMS[n]; const w = h * pw / ph;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: w + 2 * pad, h: h + 2 * pad, rectRadius: 0.1, fill: { color: C.panel }, line: { type: 'none' },
    shadow: { type: 'outer', blur: 24, offset: 8, angle: 90, color: '000000', opacity: 0.45 } });
  s.addImage({ path: IMG + '/s' + n + '.png', x: x + pad, y: y + pad, w, h, altText: S(n).alt }); return w + 2 * pad; }
function foot(s, caption, src) {
  if (caption) T(s, caption, { x: L, y: 6.3, w: CW, h: 0.58, fontSize: 15, color: C.parch });
  T(s, src, { x: L, y: 6.93, w: CW - 1, h: 0.3, fontFace: MONO_R, fontSize: 12, color: C.mutedD, valign: 'bottom' }); }

// 2 — data and cleaning (chart on the right, as the notes say)
{ const s = page('w_c1', 2); head3(s, txt(2, 0), txt(2, 1));
  let y = 2.55; [[2, 3, 1.3], [4, 5, 0.7], [6, 7, 1.35]].forEach(([a, b, h], i) => {
    if (i) rule(s, L, y - 0.13, 3.75, C.ruleD);
    T(s, txt(2, a), { x: L, y: y - 0.06, w: 0.6, h: 0.6, fontFace: MONO, fontSize: 30, color: C.icy });
    T(s, txt(2, b), { x: L + 0.7, y: y + 0.02, w: 3.05, h, fontSize: 15, color: C.parch, lineSpacingMultiple: 1.08 });
    y += h + 0.22; });
  card(s, 2, 4.95, 2.5, (R - 4.95 - 0.32) * 802 / 1912);
  foot(s, null, txt(2, 9)); }

// 3 — peaks: card left, readout right
{ const s = page('w_c2', 3); head3(s, txt(3, 0), txt(3, 1), ['в 27 раз']);
  const w = card(s, 3, L, 2.4, 3.7); const x = L + w + 0.4, rw = R - x;
  T(s, 'случаев на 100 тыс. в день', { x, y: 2.45, w: rw, h: 0.3, fontFace: MONO_R, fontSize: 12, color: C.mutedD });
  [['Южная Корея', '749'], ['Италия', '307'], ['Германия', '272'], ['США', '239'], ['Казахстан', '71.6'], ['Индия', '27.6']].forEach(([c, v], i) => {
    const y = 2.85 + i * 0.54; rule(s, x, y, rw, i ? C.ruleD : C.icy);
    T(s, c, { x, y: y + 0.12, w: rw - 1.2, h: 0.36, fontSize: 15, color: C.parch });
    T(s, v, { x: x + rw - 1.3, y: y + 0.04, w: 1.3, h: 0.45, fontFace: MONO, fontSize: i ? 18 : 26, color: C.icy, align: 'right' }); });
  foot(s, null, 'Источник: Our World in Data'); }

{ const s = page('w_c3', 4); head3(s, txt(4, 0), txt(4, 1)); card(s, 4, L, 2.35, 3.55); foot(s, txt(4, 3), 'Источник: Our World in Data'); }
{ const s = page('w_c1', 5); head3(s, txt(5, 0), txt(5, 1)); card(s, 5, L, 2.35, 3.55); foot(s, txt(5, 3), 'Источник: Our World in Data'); }
{ const s = page('w_c2', 6); head3(s, txt(6, 0), txt(6, 1), ['0.167', 'p = 0.67']); card(s, 6, L, 2.45, 3.45); foot(s, txt(6, 3), 'Источник: Our World in Data'); }
// 7 — conclusions (dark)
{ const s = slide('w_end', 7);
  T(s, txt(7, 0), { x: L, y: 0.55, w: 4, h: 0.35, fontFace: MONO, fontSize: 12, color: C.icy, charSpacing: 1 });
  T(s, txt(7, 1), { x: L, y: 0.85, w: CW, h: 0.75, fontFace: SANS, bold: true, fontSize: 34, color: C.parch });
  const rows = [[2, 3], [4, 5], [6, 7], [8, 9]];
  rows.forEach(([a, b], i) => { const y = 1.95 + i * 1.18;
    rule(s, L, y, CW, C.ruleD);
    T(s, txt(7, a), { x: L, y: y + 0.2, w: 2.5, h: 0.4, fontFace: MONO, fontSize: 15, color: i === 3 ? C.mutedD : C.icy });
    T(s, txt(7, b), { x: 3.55, y: y + 0.17, w: R - 3.55, h: 0.95, fontSize: 17, color: i === 3 ? C.mutedD : C.parch, lineSpacingMultiple: 1.1 }); });
  source(s, txt(7, 10), true); pageNo(s, 7, true); }

pres.writeFile({ fileName: OUT }).then(() => console.log('wrote', OUT));
