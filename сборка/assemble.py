import re,sys
d='/tmp/claude-0/-home-user-requests-analysis/21f7ecc9-0c8f-54c7-979a-9f1a6929e8ec/scratchpad/build/'
src=open(d+'deck.js',encoding='utf8').read()
def block(a,b): return src[src.index(a):src.index(b)]
head=src[:src.index('// ================= PRESENTATION 1')]
head=head.replace("const [BG, SCEN, OUT] = process.argv.slice(2);","const [BG, SCEN, OUT, PART] = process.argv.slice(2);")
head=head.replace("const C = { ink: '0D1F2D', paper: 'F3F6F9', ice: 'C6D8E6', coral: 'F97279', blue: '2A72A3', dim: '9FB6C8', deep: '163650' };",
"""const PAL = {
  '1': { ink: '0D1F2D', paper: 'F3F6F9', ice: 'C6D8E6', coral: 'F97279', blue: '2A72A3', dim: '9FB6C8', deep: '163650', sage: 'C6D8E6', crimson: 'F97279' },
  '2': { ink: '1B1422', paper: 'F4F1F6', ice: 'E6DDEC', coral: 'F2547A', blue: '8B729C', dim: 'B5A6C2', deep: '3A2C47', sage: 'A6B8A0', crimson: 'E20942' } };
const C = PAL[PART];""")
head=head.replace("for (let i = 1; i <= 30; i++) if (!NOTES[i])","for (let i = (PART === '1' ? 1 : 16); i <= (PART === '1' ? 15 : 30); i++) if (!NOTES[i])")
head=head.replace("pres.title = 'Дизайн-мышление: недели 11–12';","pres.title = PART === '1' ? 'Дизайн-мышление в организации: внедрение и культура' : 'Команда, фасилитация и креативное пространство';")
head=head.replace("  s.background = { path: `${BG}/${bg}.png` };", "  s.background = { path: `${BG}/${(BGMAP && BGMAP[n]) || bg}.png` };")
head=head.replace("  s.background = { path: `${BG}/top.png` };", "  s.background = { path: `${BG}/${(BGMAP && BGMAP.refs) || 'top'}.png` };")
head=head.replace("const C = PAL[PART];", "const C = PAL[PART];\nconst BGMAP = process.env.LEAF ? { 16: 'vtitle', 17: 'vedge_l', 18: 'vconv18', 19: 'vconvC', 20: 'vedge_b', 21: 'vedge_bl', 22: 'vedge_b', 23: 'vedge_bl', 24: 'vedge_b', 25: 'vedge_bl', 26: 'vedge_b', 27: 'vedge_bl', 28: 'vconv28', 29: 'vconvC', 30: 'vedge_b', refs: 'vedge_bl' } : process.env.TOPO ? { 1: 'ttitle', 2: 'tedge_bl', 3: 'tpeak_r', 4: 'tpeak_r', 5: 'tpeak_c', 6: 'tedge_b', 7: 'tedge_b', 8: 'tedge_bl', 9: 'tpeak_r', 10: 'tedge_bl', 11: 'tpeak_c', 12: 'tedge_b', 13: 'tedge_bl', 14: 'tpeak_c', 15: 'tedge_b', refs: 'tedge_bl' } : null;")
p1=open(d+'p1new.js',encoding='utf8').read()
p1=p1.replace('//__KEEP_2__', block('// 2 — quote + photo','// 3 — silos'))
p1=p1.replace('//__KEEP_9_10__', block('// 9 — P&G','// 11 — Nokia timeline'))
p1=p1.replace('//__KEEP_12_13__', block('// 12 — numbers','// 14 — eight elements'))
p1=p1.replace("src(s, 'Браун, 2012, гл. 7; IMD, б. г.; Newsweek, б. г.; Rae, 2008'); }","src(s, 'Браун, 2012, гл. 7; IMD, б. г.; Newsweek, б. г.; Rae, 2008'); }")
p2=src[src.index('// 16 — title'):src.index('refSlide([1,2,12')]
# P2 edits: no syllabus, palette accents
p2=p2.replace("T(s, 'Almaty Management University · РО4',","T(s, 'Almaty Management University',")
p2=p2.replace("T(s, 'и креативное пространство', { x: L, y: 4.0, w: 9, h: 0.8, fontSize: 32, color: C.ice });","T(s, 'и креативное пространство', { x: L, y: 4.0, w: 9, h: 0.8, fontSize: 32, color: C.sage });")
p2=p2.replace("bar(1.2, 2.1, 3.6, 0.32, C.ice);","bar(1.2, 2.1, 3.6, 0.32, C.sage);").replace("bar(6.0, 2.1, 3.6, 0.32, C.ice);","bar(6.0, 2.1, 3.6, 0.32, C.sage);")
p2=p2.replace("fill: { color: C.coral }, line: { type: 'none' } });\n  T(s, '1. Психологическая безопасность'","fill: { color: C.crimson }, line: { type: 'none' } });\n  T(s, '1. Психологическая безопасность'")
p2=p2.replace("fontFace: POSTER, bold: true, fontSize: 16, color: C.ice, align: 'center', valign: 'middle' }); });\n  src(s, 'Леврик и др., 2020, с. 137","fontFace: POSTER, bold: true, fontSize: 16, color: C.sage, align: 'center', valign: 'middle' }); });\n  src(s, 'Леврик и др., 2020, с. 137")
p2=p2.replace("T(s, r[1], { x: L + 0.95, y: y + 0.08, w: 2.1, h: 0.4, fontFace: SANS_B, fontSize: 16, color: C.ice });","T(s, r[1], { x: L + 0.95, y: y + 0.08, w: 2.1, h: 0.4, fontFace: SANS_B, fontSize: 16, color: C.sage });")
p2=p2.replace("T(s, c[0], { x, y: 2.1, w: 3.6, h: 0.6, fontFace: POSTER, bold: true, fontSize: 21, color: i === 1 ? C.coral : C.paper });","T(s, c[0], { x, y: 2.1, w: 3.6, h: 0.6, fontFace: POSTER, bold: true, fontSize: 21, color: [C.sage, C.coral, C.paper][i] });")
# slide 30: replace syllabus column by success criteria
a=p2.index("  T(s, 'Пространство: комната"); b=p2.index("pres.writeFile") if "pres.writeFile" in p2 else len(p2)
new30="""  T(s, 'Пространство: подготовьте комнату по принципам слайда «Креативное пространство»', { x: L, y: 5.45, w: 7.4, h: 0.6, fontSize: 14, color: C.dim });
  seg(s, 8.55, 1.8, 8.55, 6.5, { color: C.deep });
  T(s, 'Критерии успешной сессии', { x: 8.85, y: 1.8, w: 3.7, h: 0.45, fontFace: SANS_B, fontSize: 15, color: C.sage });
  T(s, ['высокая степень взаимообмена', 'установление и углубление отношений', 'каждый чему-то учится и вносит вклад', 'все участвуют', 'каждый услышан', 'приветствуются разные точки зрения', 'общие выводы представлены кратко', 'каждому ясно, что будет после воркшопа'].map((t, i, a) => ({ text: t, options: { breakLine: i < a.length - 1 } })), { x: 8.85, y: 2.4, w: 3.7, h: 4.1, fontSize: 13.5, color: C.ice, paraSpaceAfter: 6 });
  src(s, 'Леврик и др., 2020, с. 187–188. Длительность сессии и размер групп уточнить у преподавателя'); }
"""
p2=p2[:a]+new30
body = "if (PART === '1') {\npres.addSection({ title: S1 });\n"+p1+"\nrefSlide([1,2,3,4,5,6,7,8,9,10,11,19,20,21,22,23], S1);\n} else {\npres.addSection({ title: S2 });\n"+p2+"\nrefSlide([2,12,13,14,15,16,17,18], S2);\n}\n\npres.writeFile({ fileName: OUT }).then(() => console.log('wrote', OUT));\n"
open(d+'deck2.js','w',encoding='utf8').write(head+body)
print('ok')
