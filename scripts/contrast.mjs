// node scripts/contrast.mjs — WCAG 2.x contrast for every text/background pair the design uses.
// Fails (exit 1) if a pair marked as text is below 4.5:1, or a large/graphic pair is below 3:1.
// Palette "Onyx & Zari Gold", taken from the studio's own logo (antique gold on black) — DESIGN.md §2.
const T = {
  paper: '#FAF9F6',
  cream: '#F3F0EA',
  sand: '#E7E1D6',
  parchment: '#F1EADB',
  ink: '#151311',
  inkSoft: '#5A544B',
  onyx: '#1A1714',
  onyxHover: '#322D27',
  night: '#0F0E0C',
  nightRaised: '#1C1A17',
  gold: '#C2A878',
  goldLight: '#E5D7B6',
  goldDeep: '#8B6C38',
  goldInk: '#7A6337',
  error: '#8A2419',
  success: '#2F6B47',
  step1: '#1A1714',
  step2: '#3A342D',
  step3: '#CDB88E',
  step4: '#ECE5D6',
  whatsapp: '#25D366',
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground, background, kind] — kind: text (4.5), large (3, ≥24px or ≥18.66px bold), graphic (3), decorative (no minimum)
const pairs = [
  // body text on the light grounds
  ['ink', 'paper', 'text'], ['ink', 'cream', 'text'], ['ink', 'sand', 'text'], ['ink', 'parchment', 'text'], ['ink', 'goldLight', 'text'],
  ['inkSoft', 'paper', 'text'], ['inkSoft', 'cream', 'text'], ['inkSoft', 'sand', 'text'],
  // the action colour: onyx buttons with paper text, onyx links and focus rings on light grounds
  ['paper', 'onyx', 'text'], ['paper', 'onyxHover', 'text'], ['onyx', 'paper', 'text'], ['onyx', 'cream', 'text'], ['onyx', 'parchment', 'graphic'],
  // gold on light: small gold text uses gold-ink; gold-deep for moons/graphics; logo gold is ornament only
  ['goldInk', 'paper', 'text'], ['goldInk', 'cream', 'text'], ['goldDeep', 'paper', 'graphic'], ['goldDeep', 'cream', 'graphic'], ['gold', 'paper', 'decorative'],
  // the night band (films) and the film dialog
  ['paper', 'night', 'text'], ['goldLight', 'night', 'text'], ['goldLight', 'nightRaised', 'text'], ['paper', 'nightRaised', 'text'],
  ['gold', 'night', 'text'], ['gold', 'night', 'graphic'], ['night', 'goldLight', 'text'],
  // forms and states on the coupon
  ['error', 'parchment', 'text'], ['error', 'paper', 'text'], ['success', 'paper', 'text'],
  // process tints
  ['paper', 'step1', 'text'], ['paper', 'step2', 'text'], ['ink', 'step3', 'text'], ['ink', 'step4', 'text'],
  // scrollbar thumb against the paper gutter (graphic)
  ['goldDeep', 'paper', 'graphic'],
];

const min = { text: 4.5, large: 3, graphic: 3, decorative: 0 };
let failed = 0;
for (const [fg, bg, kind] of pairs) {
  const r = ratio(T[fg], T[bg]);
  const ok = r >= min[kind];
  if (!ok) failed++;
  console.log(`${fg.padEnd(14)} ${bg.padEnd(14)} ${kind.padEnd(10)} ${r.toFixed(2).padStart(5)} ${ok ? '' : ' FAIL'}`);
}
console.log(failed ? `\n${failed} pair(s) below the minimum.` : '\nAll pairs pass.');
process.exit(failed ? 1 : 0);
