// node scripts/contrast.mjs — WCAG 2.x contrast for every text/background pair the design uses.
// Fails (exit 1) if a pair marked as text is below 4.5:1, or a large/graphic pair is below 3:1.
const T = {
  paper: '#FBF8F2',
  cream: '#F4EEE3',
  sand: '#E7DCCB',
  ink: '#1F1B16',
  inkSoft: '#5B5348',
  moonGlow: '#B9C8D9',
  moon: '#6E86A4',
  deepMoon: '#2E3C50',
  deepMoonHover: '#243041',
  night: '#18202C',
  nightRaised: '#222C3B',
  champagne: '#B89B6A',
  champagneInk: '#7A6337',
  error: '#8A2419',
  success: '#2F6B47',
  step1: '#2E3C50',
  step2: '#46566F',
  step3: '#9FB0C5',
  step4: '#D7E0EA',
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
  ['ink', 'paper', 'text'], ['ink', 'cream', 'text'], ['ink', 'sand', 'text'],
  ['inkSoft', 'paper', 'text'], ['inkSoft', 'cream', 'text'], ['inkSoft', 'sand', 'text'],
  ['deepMoon', 'paper', 'text'], ['deepMoon', 'cream', 'text'], ['paper', 'deepMoon', 'text'], ['paper', 'deepMoonHover', 'text'],
  ['champagneInk', 'paper', 'text'], ['champagneInk', 'cream', 'text'],
  ['moon', 'paper', 'large'], ['moon', 'cream', 'large'],
  ['paper', 'night', 'text'], ['moonGlow', 'night', 'text'], ['moonGlow', 'nightRaised', 'text'], ['paper', 'nightRaised', 'text'],
  ['ink', 'moonGlow', 'text'], ['deepMoon', 'moonGlow', 'graphic'], ['error', 'moonGlow', 'text'], ['error', 'paper', 'text'], ['success', 'paper', 'text'],
  ['paper', 'step1', 'text'], ['paper', 'step2', 'text'], ['ink', 'step3', 'text'], ['ink', 'step4', 'text'],
  ['deepMoon', 'paper', 'graphic'], ['moonGlow', 'night', 'graphic'],
  ['champagne', 'paper', 'decorative'], ['moon', 'night', 'graphic'],
];

let failed = 0;
const min = { text: 4.5, large: 3, graphic: 3, decorative: 0 };
console.log('fg'.padEnd(14), 'bg'.padEnd(14), 'kind'.padEnd(10), 'ratio');
for (const [fg, bg, kind] of pairs) {
  const r = ratio(T[fg], T[bg]);
  const ok = r >= min[kind];
  if (!ok) failed++;
  console.log(fg.padEnd(14), bg.padEnd(14), kind.padEnd(10), r.toFixed(2).padStart(5), ok ? '' : `  FAIL (< ${min[kind]})`);
}
if (failed) {
  console.error(`\n${failed} pair(s) below the WCAG minimum.`);
  process.exit(1);
}
console.log('\nAll pairs pass.');
