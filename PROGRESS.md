# PROGRESS — Once in a Blue Moon demo homepage

Resume file. If a session stops, read this, then the approved plan
(`C:\Users\kumbh\.claude\plans\pasted-content-id-d3bf-ultrathink-cheeky-firefly.md`), then continue at **Next step**.

**Live:** https://onceinabluemoon-co-in.vercel.app (Vercel project `onceinabluemoon-co-in`, team "Kunal's projects")

## Phases

- [x] 0. Setup: scaffold (create-next-app 16.4.2), dependencies, git + origin
- [x] 1. Image prompts: docs/IMAGE_PROMPTS.md, image-prompts.html (opened), `npm run images`, manifest, placeholders; all 14 AI images processed
- [x] 2. DESIGN.md + tokens (taste draw `one-motif`, contrast script, fonts, brand components)
- [x] 3. Layout, navbar (desktop pill + mobile sheet), hero (still + desktop reel), loader, floating WhatsApp
- [x] 4. Sections (manifesto → footer), 404, film dialog, contact coupon + live moon
- [x] 5. Motion (GSAP bootstrap on idle, Lenis on fine pointers, reveals, stories pin, cursor, akshata)
- [x] 6. SEO / meta (metadata, OG/Twitter image, LocalBusiness + VideoObject + FAQPage JSON-LD, sitemap, robots, noindex switch, icon.svg + apple-icon.png, README)
- [x] 7. QA
  - build clean; ESLint and TypeScript clean; 7 unit and 14 e2e tests pass
  - 8 widths × Chromium + WebKit with no overflow, small targets or console errors
  - reduced-motion pass; taste lint 0 FAIL and inspect 0 FAIL (brief allowances); contrast script
- [x] 8. Deploy: GitHub `main`; Vercel project, env (Production + Preview), production deploy, live curl checks. Lighthouse on the live URL: mobile 96–98 in clean runs, desktop 100, A11y/BP 100, CLS 0.

## Decisions log

- 2026-10-20 · Chrome extension not connected (checked twice). Instagram, Facebook, Google and Justdial reads skipped; gaps recorded in the plan §1. IG follower count is not shown.
- 2026-10-20 · Scaffold landed in a subfolder (the scratchpad didn't exist) and was moved to the repo root. Package name `onceinabluemoon`.
- 2026-10-20 · Kept the 16.4 template defaults `cacheComponents: true` + `partialPrefetching: true` (the framework's recommended default, both on by default in the next major). Consequences:
  - no `new Date()`, `Date.now()` or `Math.random()` during render, in server or client components; "today" is read with `useSyncExternalStore` (null on the server)
  - the homepage exports `ensureStatic = 'navigation'` as a static guard
  - media detection runs in a `prebuild` script, never `fs` in components
- 2026-10-20 · Tailwind via `@tailwindcss/turbopack` (template), not PostCSS.
- 2026-10-20 · Pinned: next 16.4.2, react/react-dom 19.3.1, gsap 3.15.0, @gsap/react 2.1.2, motion 14.4.0, lenis 1.3.27, @phosphor-icons/react 2.1.10, clsx 2.1.1; dev sharp 0.35.5, @playwright/test 1.64.1, schema-dts 2.1.0, @types/node 22, typescript 5.9.3 (template `^5`). Lighthouse runs via `npx lighthouse@13.5.0` (not installed).
- 2026-10-20 · WebGL ripple dropped; phone hero is an inset frame; reveals are opacity-only; blur placeholders not inlined; CSS inlined; reel budgets enforced. Details in DESIGN.md §11 "Build decisions".
- 2026-10-21 · Vercel project created with the CLI; its framework preset defaulted to "Other" (served only `public/`, so `/` was 404). Fixed by committing `vercel.json` with `"framework": "nextjs"`.
- 2026-10-21 · `vercel git connect` failed (the Vercel GitHub app can't see the repo). Deploys run with `vercel deploy --prod` until the repo is connected in the dashboard (steps in README "Before launch").
- 2026-10-21 · Local Lighthouse on this Windows machine is noisy: headless Chrome sometimes holds the first frame for 1–2 s with an idle main thread (scores 84–91 in those runs). Clean runs use Playwright's chrome-headless-shell (`CHROME_PATH`, see `scripts/lighthouse.mjs`). The PageSpeed Insights API quota was exhausted, so PSI is left for Kunal to run.
- 2026-10-21 · Perf fixes:
  - hero photo preloaded from `<head>`; phones get q60 ≤ 1080w
  - Marathi font switched on near its touches
  - hero headline sized from its room (no font-swap shift)
  - intro 0.9 s
  - favicon replaced (15 KB ico → 0.3 KB svg)

- 2026-10-21 · Final audits:
  - web-design checklist, ui-ux-pro-max pre-delivery, taste lint/inspect
  - fixes from them: Phosphor icons wired in, a hero reel pause control, focus-safe `scroll-padding`, a process-panel hover, the 404 button at content width, and landscape fixes (hero track min-height, scrollable menu sheet)

- 2026-10-21 · Client feedback:
  - The navy theme was disliked. The site was re-themed to "Onyx & Zari Gold", drawn from the studio's own logo, which Kunal shared from their Instagram.
  - The logo is redrawn as SVG and used in the nav, the footer and the intro.
  - Mobile animations didn't work: GSAP's `matchMedia` skipped every screen under 1024px. Fixed, along with the phone story-arch reveal, which never fired; the phone hero also gained a scroll scrub.
  - Instagram facts from the screenshot (2026-10-21): 8,319 followers, 110 posts, "Mumbai | Nashik", "Destination wedding storytellers creating documentary driven films across India and beyond". They are not on the page yet.
- 2026-10-21 · Motion cost on phones:
  - Turning motion on for phones raised TBT, so the setup was rebuilt: one IntersectionObserver for every once-only reveal, no SplitText or DrawSVG, and the setup in slices (details in DESIGN.md §11).
  - Measured with LoAF attribution (`qa/mobile-loaf.mjs`) and a CPU profile (`qa/mobile-profile.mjs`).
  - Local Lighthouse this afternoon is not comparable with the morning: the laptop is on battery and its benchmark index fell from about 3,800 to about 1,050. Runs use `--throttling.cpuSlowdownMultiplier=1.15` to compensate, which gives TBT 35–62 ms with motion and 53–66 ms with the motion code blocked.
  - Deployed `6659dd9`.
  - Live mobile Lighthouse (calibrated): perf 95–96, TBT 55–94 ms, CLS 0, LCP 2.5–2.7 s. The morning's live runs ranged 1.9–3.6 s, and LCP is unaffected by motion.
  - Live desktop: 99. A11y and BP 100 on both.
  - `qa/reveal-check.mjs` passes on the live site, phone and desktop, in Chromium and WebKit.

## Next step

Done for the pitch. Remaining items are Kunal's:
1. Connect the GitHub repo in the Vercel dashboard.
2. Run PageSpeed Insights once.
3. Decide on the two archival images (LACMA Paithani, Godavari ghat).

Remaining for the client: the go-live checklist in README.
