// node scripts/lighthouse.mjs [url]  → runs Lighthouse 13.5 (mobile + desktop) and prints scores + key metrics.
// Uses the locally installed Chrome. Reports land in qa/lighthouse-*.json.
// Env: FORMS=mobile,desktop · CHROME_PATH=<browser exe> · LH_CHROME_FLAGS="<flags>" · LH_EXTRA="--flag|--flag" · LH_TAG=<suffix>
// On Windows, installed Chrome's new-headless mode sometimes holds the first frame for 1-2 s, which skews the
// simulated metrics. For stable runs point CHROME_PATH at Playwright's chrome-headless-shell and set
// LH_CHROME_FLAGS="--no-first-run --no-default-browser-check".
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:3100/';
const chrome =
  process.env.CHROME_PATH ||
  ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find(existsSync);
mkdirSync('qa', { recursive: true });

const runs = (process.env.FORMS || 'mobile,desktop').split(',');
// LH_EXTRA: extra Lighthouse flags separated by "|" (e.g. --blocked-url-patterns=*.woff2); LH_TAG: report suffix.
const extra = (process.env.LH_EXTRA || '').split('|').filter(Boolean);
const tag = process.env.LH_TAG ? `-${process.env.LH_TAG}` : '';
for (const form of runs) {
  const out = `qa/lighthouse-${form}${tag}.json`;
  const args = [
    '--yes',
    'lighthouse@13.5.0',
    url,
    '--output=json',
    `--output-path=${out}`,
    '--quiet',
    `--chrome-flags=${process.env.LH_CHROME_FLAGS || '--headless=new --no-first-run --no-default-browser-check'}`,
    '--only-categories=performance,accessibility,best-practices,seo',
  ];
  if (form === 'desktop') args.push('--preset=desktop');
  args.push(...extra);
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
    stdio: 'inherit',
    env: { ...process.env, CHROME_PATH: chrome },
    shell: process.platform === 'win32',
  });
  const r = JSON.parse(readFileSync(out, 'utf8'));
  const c = r.categories;
  const a = r.audits;
  const ms = (k) => Math.round(a[k]?.numericValue ?? 0);
  console.log(
    `\n${form.toUpperCase()}  perf ${Math.round(c.performance.score * 100)} · a11y ${Math.round(c.accessibility.score * 100)} · bp ${Math.round(
      c['best-practices'].score * 100,
    )} · seo ${Math.round(c.seo.score * 100)}`,
  );
  console.log(
    `  FCP ${ms('first-contentful-paint')}ms · LCP ${ms('largest-contentful-paint')}ms · TBT ${ms('total-blocking-time')}ms · CLS ${(
      a['cumulative-layout-shift']?.numericValue ?? 0
    ).toFixed(3)} · SI ${ms('speed-index')}ms · bytes ${Math.round((a['total-byte-weight']?.numericValue ?? 0) / 1024)}KB`,
  );
  const failing = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && x.scoreDisplayMode !== 'manual');
  for (const f of failing.slice(0, 14)) console.log(`  ✗ ${f.id}: ${f.title}${f.displayValue ? ' (' + f.displayValue + ')' : ''}`);
}
