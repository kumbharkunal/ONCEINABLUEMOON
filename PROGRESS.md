# PROGRESS — Once in a Blue Moon demo homepage

Resume file. If a session stops, read this, then the approved plan
(`C:\Users\kumbh\.claude\plans\pasted-content-id-d3bf-ultrathink-cheeky-firefly.md`), then continue at **Next step**.

## Phases

- [x] 0. Setup: scaffold (create-next-app 16.4.2), dependencies, git + origin
- [ ] 1. Image prompts: docs/IMAGE_PROMPTS.md, image-prompts.html (opened), `npm run images`, manifest, placeholders
- [ ] 2. DESIGN.md + tokens (taste draw, contrast script, fonts, brand components)
- [ ] 3. Layout, navbar (desktop + mobile), hero, loader, floating WhatsApp
- [ ] 4. Sections (manifesto → footer), 404, film dialog, contact form + moon widget
- [ ] 5. Motion polish (GSAP bootstrap, Lenis, reveals, pins, cursor, ripple)
- [ ] 6. SEO / meta (metadata, OG, JSON-LD, sitemap, robots, icons, README)
- [ ] 7. QA (build, lint, types, unit, Playwright 8 widths × 2 engines, menu e2e, reduced motion, console, Lighthouse, taste inspect, audits)
- [ ] 8. Deploy (GitHub push, Vercel project onceinabluemoon-co-in, env, prod, git connect, live checks, final report)

## Decisions log

- 2026-10-20 · Chrome extension not connected (checked twice). Instagram, Facebook, Google and Justdial reads skipped; gaps recorded in the plan §1. IG follower count is not shown.
- 2026-10-20 · Scaffold landed in a subfolder (the scratchpad didn't exist) and was moved to the repo root. Package name `onceinabluemoon`.
- 2026-10-20 · Kept the 16.4 template defaults `cacheComponents: true` + `partialPrefetching: true` (the framework's recommended default, both on by default in the next major). Consequences:
  - no `new Date()`, `Date.now()` or `Math.random()` during render, in server or client components; "today" is computed after mount
  - the homepage exports `ensureStatic = 'navigation'` as a static guard
  - media detection runs in a `prebuild` script, never `fs` in components
- 2026-10-20 · Tailwind via `@tailwindcss/turbopack` (template), not PostCSS.
- 2026-10-20 · Pinned: next 16.4.2, react/react-dom 19.3.1, gsap 3.15.0, @gsap/react 2.1.2, motion 14.4.0, lenis 1.3.27, @phosphor-icons/react 2.1.10, clsx 2.1.1; dev sharp 0.35.5, @playwright/test 1.64.1, schema-dts 2.1.0, @types/node 22, typescript 5.9.3 (template `^5`). Lighthouse runs via `npx lighthouse@13.5.0` (not installed).

## Next step

Phase 1: write docs/IMAGE_PROMPTS.md and image-prompts.html from plan §8 and open the HTML for Kunal, then build scripts/process-images.mjs.
