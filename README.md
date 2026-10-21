# Once in a Blue Moon: homepage

A one-page website for **Once in a Blue Moon**, the Nashik wedding photography and cinematic film studio of
Dhiraj Pawar. It's built on one idea: the *chandrakor* (the crescent a Maharashtrian bride wears) waxes into a
full blue moon. The crescent is the logo mark, the hero aperture, the nav progress moon, the section numbers and
the dividers. The page ends in a coupon that shows the real moon on your wedding night.

**Live demo:** https://onceinabluemoon-co-in.vercel.app (`noindex` until launch)

> **All photographs on this site are AI-generated placeholders** until the studio sends real work. They show no
> real people. No real person, Dhiraj included, has ever been AI-generated, and no AI picture is captioned with a
> real couple's name. The film frames are the studio's own YouTube thumbnails, and the three reviews are clearly
> tagged **Sample review** on the page. Replace them all before launch (see [Before launch](#before-launch)).

## Stack

- **Framework:** Next.js 16.4 (App Router, Turbopack, Cache Components), React 19.3, TypeScript (strict).
- **Styles and type:** Tailwind CSS 4 with tokens in `src/app/globals.css`. Fonts: Instrument Serif + Instrument Sans, and Tiro Devanagari Marathi for the two Marathi touches, all via `next/font`.
- **Motion:**
  - GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG) and Lenis 1.3 (smooth wheel scroll on desktop only). Both load after the first paint, and only when the visitor allows motion.
  - Motion 14 (`LazyMotion` + `m`) for the nav.
- **Icons:** Phosphor icons. Brand logos are the official marks (Simple Icons, CC0) in their official colours.
- **Image pipeline:** sharp. It produces hashed outputs, a typed manifest, and tonal placeholders while an image is missing.
- **Tests:** Node's test runner (moon maths) and Playwright (Chromium + WebKit).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build / server (the build first checks the hero video budgets) |
| `npm run lint` · `npm run typecheck` · `npm test` | ESLint, `tsc --noEmit`, unit tests for the moon calculations |
| `npm run images` | Processes `image-inbox/*` into `public/images` + `src/generated/images.ts` and the OG image |
| `npm run icons` | Rebuilds the favicon (`src/app/icon.svg`) and the Apple touch icon from the moon mark |
| `npm run prompts` | Rebuilds `docs/IMAGE_PROMPTS.md` and `image-prompts.html` from `scripts/image-specs.mjs` |
| `npx playwright test` | End-to-end tests: mobile menu, desktop nav, film dialog, the contact form, and reduced motion. Run them against `npm start -- -p 3100`. |
| `node scripts/shots.mjs` | Screenshots at 8 widths × 2 engines, with overflow, tap-target and console checks |
| `node scripts/lighthouse.mjs <url>` | Lighthouse 13.5 for mobile and desktop. Reports go to `qa/`. |

## Environment variables

| Name | Value | Effect |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://onceinabluemoon-co-in.vercel.app` (later `https://onceinabluemoon.co.in`) | Canonical URL, Open Graph image URLs, sitemap, JSON-LD |
| `NEXT_PUBLIC_INDEXABLE` | `false` until launch | When it isn't `true`, the site sends `noindex` (meta tag and `X-Robots-Tag`) and `robots.txt` disallows everything |

Both are set in Vercel for Production and Preview. Locally, the site falls back to `http://localhost:3000`.

## Where to change things

| What | Where | Status |
|---|---|---|
| Phone / WhatsApp, email, address, socials | `src/config/site.ts` | Taken from the studio's YouTube descriptions; marked `TODO(client)` to confirm. PIN code unknown. |
| Films (7 real films, IDs, places, durations) | `src/content/films.ts` | Real, from the studio's channel |
| Story chapters, services, process, FAQ | `src/content/*.ts` | Written from verified facts (travel, 50% advance, ~4 weeks, 40-page album) |
| Reviews | `src/content/reviews.ts` | **Samples**, tagged on the page. Replace with real words (with permission) or remove the section. |
| Photographs | `image-inbox/` → `npm run images` | **AI placeholders** (see below) |
| Hero video | `public/videos/` | Optional (see below) |
| Logo | `src/components/brand/MoonMark.tsx` | A new chandrakor mark designed for this pitch. The studio's own logo is not used. |
| Instagram follower count | — | Not shown, because it couldn't be verified |

## Swapping in real photographs

1. Put each photo in `image-inbox/` under its id (any of `.png`, `.jpg`, `.webp`):
   `hero-desktop`, `hero-mobile`, `story-haldi`, `story-mehendi`, `story-sangeet`, `story-lagna`, `story-reception`,
   `story-prewedding`, `svc-films`, `svc-album`, `svc-destination`, `about-hands`, `contact-twilight`, `detail-paithani`.
   The sizes and what each one is for are in `docs/IMAGE_PROMPTS.md` (or open `image-prompts.html`).
2. Run `npm run images`. It crops each photo around its focal point (set in `scripts/image-specs.mjs`), writes
   hashed files, the Instagram, service and manifesto crops, and a new 1200×630 social preview (under 300 KB, so
   WhatsApp shows it).
3. If the new desktop hero puts the couple somewhere else, update `HERO_SUBJECT` in `src/components/hero/Hero.tsx`.
4. Commit and push (or run `vercel deploy --prod`).

A missing image never breaks the page: it renders a tonal sand placeholder with the crescent.

## Hero video (optional)

- **Spec:** H.264 MP4, **no audio**, a 10–15 s seamless loop.
  - Desktop: 1920×1080, ≤ 4 MB, saved as `public/videos/hero-reel.mp4`.
  - Phone: 1080×1920, ≤ 2.5 MB, saved as `public/videos/hero-reel-mobile.mp4`.
- **How the build treats it:** files over the hard limits (6 MB desktop, 2.6 MB phone) are skipped. Phones never download the desktop reel. The video fades in over the still only after the page has loaded, and never under Save-Data, on slow connections or with reduced motion.
- **Pause control:** visitors can pause it with the small disc in the hero's corner (WCAG 2.2.2).

```bash
# desktop
ffmpeg -i source.mp4 -an -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -vf "scale=1920:-2" public/videos/hero-reel.mp4
# phone (portrait source)
ffmpeg -i source-portrait.mp4 -an -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart -vf "scale=1080:-2" public/videos/hero-reel-mobile.mp4
# a 6–8 s clip played twice: add  -stream_loop 1  before -i
```

**Current state of the reels:**
- **Desktop reel:** live. It still has an audio track and a generator mark in its bottom-right corner, so the still and the reel share a crop (`REEL_CROP` in `Hero.tsx`) that keeps the mark out of frame. Re-encode it without audio, and delete `REEL_CROP` once a clean reel arrives.
- **Phone reel:** 5.2 MB, so it is over budget and not used (it isn't committed). Re-encode it with the phone command above.

## Before launch

1. **Domain:** `onceinabluemoon.co.in` was unregistered on 2026-10-20. Register it (any .in registrar).
2. **Vercel:**
   - Add the domain under Project → Settings → Domains.
   - Set DNS as Vercel shows: usually `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`.
3. **Environment:**
   - Set `NEXT_PUBLIC_SITE_URL=https://onceinabluemoon.co.in` and `NEXT_PUBLIC_INDEXABLE=true` (Production).
   - Redeploy.
4. **Plan:** a client's commercial site needs Vercel **Pro**, because Hobby is for non-commercial use.
5. **Git deploys:** connect the GitHub repo in the Vercel dashboard, so every push to `main` deploys.
   - Project `onceinabluemoon-co-in` → Settings → Git → Connect Git Repository → GitHub → `kumbharkunal/ONCEINABLUEMOON`.
   - If the repo isn't listed: Adjust GitHub App Permissions → give the Vercel app access to this repo.
6. **Content:**
   - Real photographs and real reviews.
   - Confirm phone, email and address, and add the PIN code.
   - Check the spelling of couple names on the films.
7. **After launch:** run PageSpeed Insights (mobile + desktop), and submit the sitemap in Google Search Console.

## Quality bar (checked before each deploy)

- **Build and code checks:** `npm run build` with no errors or warnings; ESLint and TypeScript clean; 7 unit tests and 14 e2e tests passing.
- **Layout:** no horizontal overflow, no tap target under 44 px and no console errors, at 320–1920 px in Chromium and WebKit.
- **Lighthouse (live):** mobile performance 96–98 in clean runs, desktop 100. Accessibility 100 and best practices 100 on both; CLS 0.
- **Text and data:** WCAG AA contrast is checked by `scripts/contrast.mjs`. The moon phases follow Meeus's algorithm, are checked against published dates, and are evaluated at 8 pm IST.
