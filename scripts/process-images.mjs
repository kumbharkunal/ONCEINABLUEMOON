// npm run images
// Reads image-inbox/<id>.(png|jpg|jpeg|webp), crops each to its exact aspect around its focal point,
// resizes to the target size (upscaling is capped at 1.3×), writes optimised content-hashed JPEGs to
// public/images, builds blur placeholders + dominant colours, writes derived crops (Instagram tiles,
// service crops, manifesto pills), the social preview image, and the typed manifest the site reads.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { derived, images, og } from './image-specs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const INBOX = join(root, 'image-inbox');
const OUT = join(root, 'public', 'images');
const MANIFEST = join(root, 'src', 'generated', 'images.ts');
const APP = join(root, 'src', 'app');
const MAX_UPSCALE = 1.3;

mkdirSync(INBOX, { recursive: true });
mkdirSync(OUT, { recursive: true });
mkdirSync(dirname(MANIFEST), { recursive: true });

const findSource = (id) => {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = join(INBOX, `${id}.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
};

/** Largest rect with the target aspect that fits the source, centred on the focal point, clamped to the edges. */
function cropRect(srcW, srcH, [rw, rh], [fx, fy]) {
  const target = rw / rh;
  let w = srcW;
  let h = Math.round(srcW / target);
  if (h > srcH) {
    h = srcH;
    w = Math.round(srcH * target);
  }
  const left = Math.min(Math.max(Math.round(fx * srcW - w / 2), 0), srcW - w);
  const top = Math.min(Math.max(Math.round(fy * srcH - h / 2), 0), srcH - h);
  return { left, top, width: w, height: h };
}

function outputSize(crop, [tw, th]) {
  const scale = tw / crop.width;
  if (scale <= MAX_UPSCALE) return { width: tw, height: th, capped: false };
  const width = Math.round(crop.width * MAX_UPSCALE);
  return { width, height: Math.round((width * th) / tw), capped: true };
}

const toHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

async function render(srcPath, ratio, size, focal) {
  const base = sharp(srcPath).rotate();
  const meta = await base.metadata();
  const w = meta.autoOrient?.width ?? meta.width;
  const h = meta.autoOrient?.height ?? meta.height;
  const crop = cropRect(w, h, ratio, focal);
  const out = outputSize(crop, size);
  const buffer = await sharp(srcPath)
    .rotate()
    .extract(crop)
    .resize(out.width, out.height, { kernel: 'lanczos3' })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer();
  return { buffer, out, source: { width: w, height: h } };
}

async function write(id, buffer, out) {
  const hash = createHash('sha1').update(buffer).digest('hex').slice(0, 8);
  const file = `${id}.${hash}.jpg`;
  for (const f of readdirSync(OUT)) {
    if (f.startsWith(`${id}.`) && f !== file) unlinkSync(join(OUT, f));
  }
  writeFileSync(join(OUT, file), buffer);
  const blur = await sharp(buffer).resize(24).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(buffer).stats();
  return {
    src: `/images/${file}`,
    width: out.width,
    height: out.height,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    color: toHex(dominant),
  };
}

const manifest = {};
const report = [];

for (const spec of images) {
  const src = findSource(spec.id);
  if (!src) {
    manifest[spec.id] = null;
    report.push(`  · ${spec.id.padEnd(18)} missing (placeholder shown)`);
    continue;
  }
  const { buffer, out, source } = await render(src, spec.ratio, spec.size, spec.focal);
  manifest[spec.id] = await write(spec.id, buffer, out);
  report.push(
    `  ✓ ${spec.id.padEnd(18)} ${source.width}×${source.height} → ${out.width}×${out.height}${out.capped ? '  (upscale capped; send a larger source for full size)' : ''}`,
  );
}

for (const d of derived) {
  const src = findSource(d.from);
  if (!src) {
    manifest[d.id] = null;
    continue;
  }
  const { buffer, out } = await render(src, d.ratio, d.size, d.focal);
  manifest[d.id] = await write(d.id, buffer, out);
  report.push(`  ↳ ${d.id.padEnd(18)} from ${d.from} → ${out.width}×${out.height}`);
}

// ---------- Social preview (WhatsApp / Open Graph / Twitter) ----------
const ogSrc = findSource(og.from);
let ogBuffer;
if (ogSrc) {
  const [w, h] = og.size;
  const meta = await sharp(ogSrc).rotate().metadata();
  const crop = cropRect(meta.autoOrient?.width ?? meta.width, meta.autoOrient?.height ?? meta.height, [w, h], og.focal);
  for (const quality of [84, 78, 72, 66, 60, 54]) {
    ogBuffer = await sharp(ogSrc)
      .rotate()
      .extract(crop)
      .resize(w, h, { kernel: 'lanczos3' })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();
    if (ogBuffer.length <= og.maxBytes) break;
  }
  report.push(`  ✓ social preview from ${og.from}: ${(ogBuffer.length / 1024).toFixed(0)} KB`);
} else {
  // Shape-only fallback (no text): paper ground, a blue moon with the chandrakor shadow sliding off.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#FBF8F2"/>
    <circle cx="600" cy="315" r="196" fill="none" stroke="#B89B6A" stroke-width="1.5" opacity="0.7"/>
    <defs><mask id="m"><rect width="1200" height="630" fill="#fff"/><circle cx="668" cy="268" r="168" fill="#000"/></mask></defs>
    <circle cx="600" cy="315" r="168" fill="#E7DCCB"/>
    <circle cx="600" cy="315" r="168" fill="#6E86A4" mask="url(#m)"/>
  </svg>`;
  ogBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  report.push('  · social preview: hero-desktop missing, wrote moon fallback');
}
const ogAlt = 'Once in a Blue Moon: wedding photography and cinematic films from Nashik';
for (const name of ['opengraph-image', 'twitter-image']) {
  writeFileSync(join(APP, `${name}.jpg`), ogBuffer);
  writeFileSync(join(APP, `${name}.alt.txt`), ogAlt);
}

// ---------- Typed manifest ----------
const ids = [...images.map((i) => i.id), ...derived.map((d) => d.id)];
const ts = `// AUTO-GENERATED by scripts/process-images.mjs. Do not edit by hand; run \`npm run images\`.
export type ImageEntry = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  color: string;
};

export const imageIds = ${JSON.stringify(ids, null, 2)} as const;

export type ImageId = (typeof imageIds)[number];

export const imageManifest: Record<ImageId, ImageEntry | null> = ${JSON.stringify(manifest, null, 2)};
`;
writeFileSync(MANIFEST, ts);

console.log('Images:\n' + report.join('\n'));
const have = images.filter((i) => manifest[i.id]).length;
console.log(`\n${have}/${images.length} source images processed. Manifest: src/generated/images.ts`);
