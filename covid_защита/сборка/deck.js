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

const C = { parch: 'EDEDE8', panel: 'F7F6F2', icy: 'C5F9FC', ultra: '5320C0', crim: '4F032E', coffee: '1D0C13', muted: '5C4A55', mutedD: 'B3A6AD', ruleD: '3B2A33', ruleL: 'D6D3CF' };
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
{ const s = slide('d_title', 1);
  T(s, txt(1, 0), { x: L, y: 0.55, w: CW, h: 0.35, fontFace: MONO, fontSize: 12, color: C.icy, charSpacing: 1 });
  T(s, txt(1, 1), { x: L, y: 1.3, w: CW, h: 1.9, fontFace: SANS, bold: true, fontSize: 52, color: C.parch, lineSpacingMultiple: 0.95 });
  T(s, txt(1, 2), { x: L, y: 3.3, w: CW, h: 0.5, fontSize: 20, color: C.parch });
  [[3, 4], [5, 6], [7, 8]].forEach(([a, b], i) => { const x = L + i * 3.98;
    T(s, txt(1, a), { x, y: 4.45, w: 3.7, h: 0.36, fontFace: MONO, fontSize: 14, color: C.icy });
    T(s, txt(1, b), { x, y: 4.9, w: 3.65, h: 1.1, fontSize: 18, color: C.parch, lineSpacingMultiple: 1.1 }); });
  T(s, txt(1, 9), { x: L, y: 6.93, w: 7, h: 0.32, fontFace: MONO_R, fontSize: 12, color: C.mutedD, valign: 'bottom' });
  pageNo(s, 1, true); }

// 2 — data and cleaning: three steps left, chart right (the notes say "на графике справа")
{ const s = slide('l_left', 2);
  header(s, txt(2, 0), txt(2, 1));
  const steps = [[txt(2, 2), txt(2, 3), 1.35], [txt(2, 4), txt(2, 5), 0.85], [txt(2, 6), txt(2, 7), 1.6]];
  let y = 2.05;
  steps.forEach(([num, body, h], i) => {
    if (i) rule(s, L, y - 0.12, 3.8, C.ruleL);
    T(s, num, { x: L, y, w: 0.5, h: 0.5, fontFace: MONO, fontSize: 24, color: C.ultra });
    T(s, body, { x: L + 0.6, y: y + 0.04, w: 3.2, h, fontSize: 15, lineSpacingMultiple: 1.08 });
    y += h + 0.25; });
  figure(s, 2, 4.95, 2.05, 3.05);
  source(s, txt(2, 9)); pageNo(s, 2); }

// 3 — peaks: chart left, key values as a readout column right (same words and numbers as the original caption line)
{ const s = slide('l_right', 3);
  header(s, txt(3, 0), txt(3, 1));
  const f = figure(s, 3, L, 2.0, 4.05);
  const x = L + f.w + 0.35, w = R - x;
  const rows = [['Южная Корея', '749'], ['Италия', '307'], ['Германия', '272'], ['США', '239'], ['Казахстан', '71.6'], ['Индия', '27.6']];
  T(s, 'случаев на 100 тыс. в день', { x, y: 2.0, w, h: 0.5, fontFace: MONO_R, fontSize: 12, color: C.muted });
  rows.forEach(([c, v], i) => { const y = 2.6 + i * 0.6;
    rule(s, x, y, w, C.ruleL);
    T(s, c, { x, y: y + 0.12, w: w - 1.0, h: 0.4, fontSize: 15, color: C.coffee });
    T(s, v, { x: x + w - 1.1, y: y + 0.06, w: 1.1, h: 0.45, fontFace: MONO, fontSize: i === 0 ? 22 : 18, color: i === 0 ? C.ultra : C.coffee, align: 'right' }); });
  source(s, 'Источник: Our World in Data'); pageNo(s, 3); }

// 4 — heatmap
{ const s = slide('l_left', 4);
  header(s, txt(4, 0), txt(4, 1));
  figure(s, 4, L, 2.0, 4.1);
  T(s, txt(4, 3), { x: L, y: 6.5, w: CW, h: 0.36, fontSize: 15, color: C.coffee });
  source(s, 'Источник: Our World in Data'); pageNo(s, 4); }

// 5 — plateau timeline
{ const s = slide('l_right', 5);
  header(s, txt(5, 0), txt(5, 1));
  figure(s, 5, L, 2.0, 4.1);
  T(s, txt(5, 3), { x: L, y: 6.5, w: CW, h: 0.36, fontSize: 15, color: C.coffee });
  source(s, 'Источник: Our World in Data'); pageNo(s, 5); }

// 6 — normalisation
{ const s = slide('l_left', 6);
  header(s, txt(6, 0), txt(6, 1));
  figure(s, 6, L, 2.0, 4.1);
  T(s, txt(6, 3), { x: L, y: 6.5, w: CW, h: 0.36, fontSize: 15, color: C.coffee });
  source(s, 'Источник: Our World in Data'); pageNo(s, 6); }

// 7 — conclusions (dark)
{ const s = slide('d_end', 7);
  T(s, txt(7, 0), { x: L, y: 0.55, w: 4, h: 0.35, fontFace: MONO, fontSize: 12, color: C.icy, charSpacing: 1 });
  T(s, txt(7, 1), { x: L, y: 0.85, w: CW, h: 0.75, fontFace: SANS, bold: true, fontSize: 34, color: C.parch });
  const rows = [[2, 3], [4, 5], [6, 7], [8, 9]];
  rows.forEach(([a, b], i) => { const y = 1.95 + i * 1.18;
    rule(s, L, y, CW, C.ruleD);
    T(s, txt(7, a), { x: L, y: y + 0.2, w: 2.5, h: 0.4, fontFace: MONO, fontSize: 15, color: i === 3 ? C.mutedD : C.icy });
    T(s, txt(7, b), { x: 3.55, y: y + 0.17, w: R - 3.55, h: 0.95, fontSize: 17, color: i === 3 ? C.mutedD : C.parch, lineSpacingMultiple: 1.1 }); });
  source(s, txt(7, 10), true); pageNo(s, 7, true); }

pres.writeFile({ fileName: OUT }).then(() => console.log('wrote', OUT));
