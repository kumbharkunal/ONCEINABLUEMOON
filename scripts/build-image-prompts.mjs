// Generates docs/IMAGE_PROMPTS.md and image-prompts.html (repo root, not deployed) from scripts/image-specs.mjs.
// Run: npm run prompts
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { images, video } from './image-specs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const escapeHtml = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// ---------- Markdown ----------
const md = [
  '# Image prompts: Once in a Blue Moon',
  '',
  'One **new ChatGPT chat per image**. Paste the prompt, download the PNG, save it with the exact filename into `image-inbox/`, then run `npm run images` (it crops to size around each focal point, optimises, and updates the manifest the site reads).',
  '',
  'All generated images are **placeholders** until the studio provides real photographs. Never generate images of real people.',
  '',
  '| ID | Used in | Save as | Ratio | Target size | Format |',
  '|---|---|---|---|---|---|',
  ...images.map(
    (i) =>
      `| ${i.code} | ${i.usedIn} | \`image-inbox/${i.id}.png\` | ${i.ratio[0]}:${i.ratio[1]} | ${i.size[0]} × ${i.size[1]} | PNG |`,
  ),
  '',
  ...images.flatMap((i) => [
    `## ${i.code} · ${i.title}`,
    '',
    `- **Used in:** ${i.usedIn}`,
    `- **Save as:** \`image-inbox/${i.id}.png\``,
    `- **Aspect ratio:** ${i.ratio[0]}:${i.ratio[1]} · **Target size:** ${i.size[0]} × ${i.size[1]} px · **Format:** PNG`,
    '',
    '```text',
    i.prompt,
    '```',
    '',
  ]),
  `## ${video.code} · ${video.title}`,
  '',
  `- **Used in:** ${video.usedIn}`,
  '- **Video spec:** H.264 MP4, no audio, 10–15 s seamless loop (double a 6–8 s clip), 1920 × 1080 ≤ 4 MB desktop, 1080 × 1920 ≤ 2.5 MB mobile. See README for the ffmpeg command.',
  '',
  '```text',
  video.prompt,
  '```',
  '',
].join('\n');

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'IMAGE_PROMPTS.md'), md);

// ---------- HTML ----------
const card = (i, n) => `
    <article class="card" id="${i.id}">
      <header class="card-head">
        <label class="done"><input type="checkbox" data-id="${i.id}" aria-label="Mark ${escapeHtml(i.code)} as generated" /> <span>Done</span></label>
        <p class="code">${escapeHtml(i.code)}</p>
        <h2>${escapeHtml(i.title)}</h2>
      </header>
      <dl class="meta">
        <div><dt>Used in</dt><dd>${escapeHtml(i.usedIn)}</dd></div>
        <div><dt>Save as</dt><dd><code>image-inbox/${i.id}.png</code> <button class="ghost" data-copy="image-inbox/${i.id}.png" type="button">Copy filename</button></dd></div>
        <div><dt>Ratio</dt><dd>${i.ratio[0]}:${i.ratio[1]}</dd></div>
        <div><dt>Target size</dt><dd>${i.size[0]} × ${i.size[1]} px</dd></div>
        <div><dt>Format</dt><dd>PNG</dd></div>
      </dl>
      <pre id="p-${n}">${escapeHtml(i.prompt)}</pre>
      <button class="copy" type="button" data-target="p-${n}">Copy prompt</button>
    </article>`;

const html = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Image prompts · Once in a Blue Moon</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
<style>
  :root { --paper:#FBF8F2; --cream:#F4EEE3; --sand:#E7DCCB; --ink:#1F1B16; --ink-soft:#5B5348; --deep:#2E3C50; --glow:#B9C8D9; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font:16px/1.6 "Instrument Sans", system-ui, sans-serif; }
  main { max-width: 920px; margin: 0 auto; padding: 56px 16px 96px; }
  h1 { font: 400 clamp(2.4rem, 6vw, 4.2rem)/0.95 "Instrument Serif", Georgia, serif; margin: 0 0 16px; letter-spacing: -0.01em; }
  h1 em { font-style: italic; }
  .lede { max-width: 62ch; color: var(--ink-soft); margin: 0 0 8px; }
  ol.steps { padding-left: 20px; margin: 16px 0 24px; } ol.steps li { margin: 4px 0; }
  .progress { position: sticky; top: 0; z-index: 2; background: rgba(251,248,242,.94); padding: 12px 0; margin-bottom: 8px; font-weight: 500; }
  .bar { height: 6px; background: var(--sand); border-radius: 99px; overflow: hidden; margin-top: 8px; }
  .bar span { display:block; height:100%; width:0; background: var(--deep); transition: width .4s cubic-bezier(.16,1,.3,1); }
  .card { background: var(--cream); padding: 24px; margin: 24px 0; border-radius: 4px; }
  .card.is-done { opacity: .62; }
  .card-head { display:grid; grid-template-columns: 1fr auto; align-items:end; gap: 4px 16px; }
  .code { margin:0; color: var(--ink-soft); font-size: .875rem; grid-column: 1; }
  .card h2 { margin: 0; font: 400 2rem/1.05 "Instrument Serif", Georgia, serif; grid-column: 1; }
  .done { grid-column: 2; grid-row: 1 / span 2; display:flex; gap:8px; align-items:center; font-size:.875rem; min-height:44px; cursor:pointer; }
  .done input { width:20px; height:20px; accent-color: var(--deep); }
  .meta { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px 24px; margin: 16px 0; }
  .meta div:first-child { grid-column: 1 / -1; }
  .meta dt { font-size: .8125rem; color: var(--ink-soft); }
  .meta dd { margin: 0; }
  code { font-size: .9em; background: var(--paper); padding: 2px 6px; border-radius: 3px; }
  pre { white-space: pre-wrap; word-wrap: break-word; background: var(--paper); padding: 16px; margin: 0 0 16px; font: 14px/1.6 "Instrument Sans", system-ui, sans-serif; max-height: 320px; overflow: auto; border-radius: 3px; }
  button { font: 500 15px/1 "Instrument Sans", system-ui, sans-serif; cursor: pointer; border: 0; border-radius: 999px; min-height: 44px; padding: 0 22px; }
  .copy { background: var(--deep); color: var(--paper); }
  .copy:hover { background: #253244; }
  .ghost { background: transparent; color: var(--deep); padding: 0 10px; text-decoration: underline; text-underline-offset: 3px; min-height: 32px; }
  button:focus-visible, input:focus-visible { outline: 2px solid var(--deep); outline-offset: 3px; }
  .copied { background: #2F6B47 !important; }
  .video { background: var(--ink); color: var(--paper); }
  .video .code, .video .meta dt { color: var(--glow); }
  .video pre, .video code { background: #2a251f; color: var(--paper); }
  footer { margin-top: 48px; color: var(--ink-soft); font-size: .9375rem; }
  @media (prefers-reduced-motion: reduce) { .bar span { transition: none; } }
</style>
</head>
<body>
<main>
  <h1>Image prompts, <em>once in a blue moon.</em></h1>
  <p class="lede">Fourteen photographs for the demo homepage. They are placeholders until the studio shares real work. Never generate images of real people.</p>
  <ol class="steps">
    <li>Open a <strong>new ChatGPT chat</strong> for each image.</li>
    <li>Press <strong>Copy prompt</strong>, paste it, and generate.</li>
    <li>Download the PNG and save it with the exact filename shown into <code>image-inbox/</code>.</li>
    <li>When a few are in, run <code>npm run images</code> (or tell Claude). The site picks them up automatically.</li>
  </ol>
  <div class="progress" aria-live="polite"><span id="count">0</span> of ${images.length} generated<div class="bar"><span id="bar"></span></div></div>
${images.map(card).join('\n')}
    <article class="card video">
      <header class="card-head"><p class="code">${escapeHtml(video.code)}</p><h2>${escapeHtml(video.title)}</h2></header>
      <dl class="meta">
        <div><dt>Used in</dt><dd>${escapeHtml(video.usedIn)}</dd></div>
        <div><dt>Spec</dt><dd>H.264 MP4, no audio, 10–15 s seamless loop; 1920 × 1080 ≤ 4 MB desktop; 1080 × 1920 ≤ 2.5 MB mobile</dd></div>
      </dl>
      <pre id="p-video">${escapeHtml(video.prompt)}</pre>
      <button class="copy" type="button" data-target="p-video">Copy prompt</button>
    </article>
  <footer>Generated from <code>scripts/image-specs.mjs</code>. This page is a local helper and is not deployed.</footer>
</main>
<script>
  async function copyText(text, btn) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } finally { ta.remove(); }
    }
    const label = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 1600);
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    if (btn.dataset.target) copyText(document.getElementById(btn.dataset.target).textContent, btn);
    if (btn.dataset.copy) copyText(btn.dataset.copy, btn);
  });
  const KEY = 'oiabm-prompts-done';
  let done = {}; try { done = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  const boxes = [...document.querySelectorAll('input[data-id]')];
  function sync() {
    let n = 0;
    boxes.forEach((b) => { b.checked = !!done[b.dataset.id]; b.closest('.card').classList.toggle('is-done', b.checked); if (b.checked) n++; });
    document.getElementById('count').textContent = n;
    document.getElementById('bar').style.width = (n / boxes.length * 100) + '%';
  }
  boxes.forEach((b) => b.addEventListener('change', () => { done[b.dataset.id] = b.checked; try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} sync(); }));
  sync();
</script>
</body>
</html>
`;

writeFileSync(join(root, 'image-prompts.html'), html);
console.log(`Wrote docs/IMAGE_PROMPTS.md and image-prompts.html (${images.length} images + 1 video prompt).`);
