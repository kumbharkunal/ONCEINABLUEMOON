# DESIGN.md — Once in a Blue Moon

> One shape from the bride's forehead runs the whole page: the **chandrakor** waxes, frame by frame, into a full blue moon at the moment a couple asks "Is your date still free?"

This file is the single source of truth for the homepage. Precedence when anything disagrees:
**the brief › verified client facts › this file › the skills › references.**

---

## 0. Subject, idea, argument

**Inventory (things only this client has):**
1. The name *Once in a Blue Moon*. A blue moon is the second full moon in a calendar month; the next one rises on **31 Dec 2028** (Meeus, IST).
2. The *chandrakor*, the crescent bindi a Maharashtrian bride wears.
3. Nashik: Ganpati Nagar, Anandvalli, Gangapur Road; the Godavari ghats; vineyards; the Sahyadri skyline.
4. Paithani silk from Yeola (Nashik district): the zari peacock border.
5. The rituals: haldi, mehendi, sangeet, lagna (antarpat, mangalashtak, akshata), reception. *शुभमंगल सावधान* is sung as the antarpat falls.
6. Dhiraj Pawar shoots **and edits** the films himself, and teaches the craft (workshops in Malvan 2025 and Himachal 2026).
7. Real films from Landour, Varanasi, Thailand, Gogunda Palace (Udaipur), Goa, Ziro, the Kokan coast, Bhandardara and Bhimashankar.
8. Every kind of "I do": Marathi, Hindu, Buddhist, Nikah, court marriage.
9. Numbers: since 2019 · about 4 weeks to delivery · 50% advance · 40-page albums · 4-hour short functions.
10. Booking is WhatsApp-first ("text / whatsp +91 82086 31559").
11. Their own words: "fun, classy, and natural"; "every glance, every emotion, every laugh".

**Idea:** *On this page, the chandrakor a Nashik bride wears becomes the one shape that frames every picture, counts every chapter and fills into a blue moon at "Is your date still free?"* It fails the competitor test for any other studio, so it's ours.

**Live thing: "The moon on your wedding night."** Pick a date and see that night's real moon phase: name, % lit, and whether it is a full or a blue moon. The date flows into the WhatsApp enquiry. It works with a thumb, and without JS the form still offers a plain WhatsApp link.

**Argument (one claim per section, each with its proof):**

| Section | Claim | Proof on the page |
|---|---|---|
| Hero | We keep your day the way it felt | The name line, a real-feeling frame in the moon, WhatsApp in one tap |
| Manifesto | Rare moments are small and fast | The specific Marathi moments, named |
| Trust | We are established and easy to work with | Since 2019, Nashik, photo + film, travel, ~4 weeks |
| Stories | We stay for every chapter | Six ritual chapters, morning to night |
| Films | Our films are real; watch them | 7 real films, couple names, places, durations |
| Services | One team for everything | Six services; packages on WhatsApp |
| Process / FAQ | Booking is simple and clear | 4 steps; 50% advance; travel; albums |
| Director | A filmmaker who teaches the craft makes your film | Shoots and edits himself; workshops |
| Kind words | (no real reviews yet) | Clearly marked samples, to be replaced |
| Instagram | See today's work | Link to @onceinabluemoon.co.in |
| Contact | Check your date now | The coupon form + the live moon |

---

## 1. Visual Theme & Atmosphere

**Style:** Editorial luxury, one-motif system (taste direction `one-motif`, seed 484166439).
**Keywords:** porcelain paper, onyx, zari gold, Paithani, unhurried, candid, warm film grain, quiet confidence, one shape.
**Tone:** fun, classy, natural; NOT glossy, not "royal" bling, not template-luxury.
**Feel:** a wedding invitation printed on fine paper, black and gold like the studio's own logo, held up to moonlight.
**Brand mark:** the studio's own logo (antique-gold condensed caps in a gold frame on black, "Emotions through storys."), redrawn as SVG in `src/components/brand/BrandLogo.tsx`. It appears as a black label in the nav, in full in the footer and in the first-visit intro. The chandrakor moons remain the page's motif.
**Interaction tier:** **L3** (immersive): a scroll-driven hero, one pinned horizontal story, a cursor.
**Dependencies:** GSAP 3.15 (ScrollTrigger only) + Lenis 1.3 (desktop wheel only) + Motion 14 (UI state). All of them load after first paint.

The motif at four scales:
- **Giant:** the hero aperture, about 118svh, rising from the lower right; the footer "O".
- **Large:** the Services preview frame, the About portrait circle, the Films band's moon-limb top edge.
- **Medium:** photo bullets, Instagram tiles, the coupon notches, paper-slip scallops.
- **Small:** the nav progress moon, section label phases, crescent separators, the cursor, the play button.

## 2. Color Palette & Roles

**Palette "Onyx & Zari Gold" (2026-10-21, replacing the first navy-and-moon-blue palette, which the client didn't like).**

Why these colours:
- **The client's own identity:** their logo is antique gold condensed caps in a gold frame on black. A palette taken from it makes the site look like *their* brand, not a template.
- **The ui-ux-pro-max palette database:**
  - Its "Luxury / Premium Brand" profile is warm black `#1C1917` + antique gold on warm white: "Premium black + gold accent".
  - Its "Photography Studio" profile is black-and-white contrast.
  - The "Wedding / Event" profile (romantic pink) was rejected as a cliché.
- **frontend-design:** ground colour in the subject. Gold is the *zari* of a Paithani border and the gold of the logo. The page avoids the generated-page defaults (cream with a terracotta accent, navy with one bright accent).
- **Brief:** a light page with at most one dark band. The ground is a porcelain white, cleaner than the earlier yellow cream; onyx is the one action colour; gold is the ornament; the Films band is the one dark field.

```css
:root {
  /* Grounds: porcelain, not yellow cream */
  --paper: #FAF9F6;  --paper-rgb: 250 249 246;  /* page ground */
  --cream: #F3F0EA;                             /* one tone step: tiles, panels */
  --sand:  #E7E1D6;                             /* second step: placeholders, chips at rest, moon shadows */
  --parchment: #F1EADB;                         /* the contact coupon (an invitation card) */
  --night: #0F0E0C;  --night-rgb: 15 14 12;     /* the Films band and the logo's black */
  --night-raised: #1C1A17;                      /* surfaces inside the night band */

  /* Ink */
  --ink: #151311;    --ink-rgb: 21 19 17;       /* all running text */
  --ink-soft: #5A544B;                          /* secondary text (≥ 5.75:1 on every light ground) */

  /* Onyx: THE action colour */
  --onyx: #1A1714;   --onyx-rgb: 26 23 20;      /* buttons, the nav CTA, selected chips, links, focus rings */
  --onyx-hover: #322D27;

  /* Zari gold, from the studio's logo */
  --gold: #C2A878;   --gold-rgb: 194 168 120;   /* logo gold: ornament on light grounds, text on night */
  --gold-light: #E5D7B6;                        /* moons and secondary text on night, selection */
  --gold-deep: #8B6C38;                         /* moons and graphics on light grounds, hover text */
  --gold-ink: #7A6337;                          /* small gold text on light grounds (the Marathi line) */

  /* Process tints (onyx → umber → gold → parchment) */
  --step-1: #1A1714; --step-2: #3A342D; --step-3: #CDB88E; --step-4: #ECE5D6;

  /* Semantic */
  --error: #8A2419;
  --success: #2F6B47;
  --hairline: rgb(var(--ink-rgb) / 0.12);
}
```

**Measured contrast** (`node scripts/contrast.mjs`, all pass):
- **Body text on light grounds:** ink/paper 17.6 · ink/parchment 15.5 · ink-soft/paper 7.1 · ink-soft/sand 5.75.
- **The action colour:** paper/onyx 17.0 · paper/onyx-hover 13.0.
- **Gold on light grounds:** gold-ink/paper 5.4 · gold-deep/paper 4.6 (graphics) · gold/paper 2.2 (ornament only).
- **The night band:** paper/night 18.3 · gold-light/night 13.5 · gold/night 8.4.
- **States and tints:** error/parchment 7.5 · paper/step-2 11.7 · ink/step-3 9.6.

**Color rules:**
- Components never hard-code hex; they use the variables (or Tailwind tokens mapped to them).
- One accent: **onyx** marks the action (primary buttons, the nav CTA, links, focus rings, the coupon's submit). Gold is ornament and the logo; deep gold draws the moons on light grounds.
- The bright logo gold is never text on a light ground (2.2:1). Small gold text uses gold-ink.
- Light page. The **Films band is the only dark field**. Process step 1 and the hero scrim are components inside light sections.
- Surfaces separate by a step in tone (paper → cream → sand), never by a box outline. Hairlines appear only where they carry structure: service rows, FAQ, form fields, footer.
- Running text is always full ink. Grey is never used for body copy.
- Brand logos keep their official colours (Instagram gradient `#FEDA75→#FA7E1E→#D62976→#962FBF→#4F5BD5`, Facebook `#0866FF`, WhatsApp `#25D366`, YouTube `#FF0000`) and are never recoloured.

## 3. Typography Rules

**Font stack** (self-hosted with `next/font/google`; size-adjusted fallbacks give zero CLS):
```css
/* Reference equivalent of the next/font setup */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=Instrument+Serif:ital@0;1&family=Tiro+Devanagari+Marathi&display=swap');
--font-display: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
--font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
--font-marathi: 'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif;
```

Five text steps (plus the footer mark, which is a brand graphic):

| Role | Font | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display (hero H1) | Instrument Serif | `clamp(2.6rem, 1rem + 6vw, 8rem)` | 400 (line 2 italic) | 0.94 | −0.015em |
| H2 | Instrument Serif | `clamp(2.25rem, 1.4rem + 3.8vw, 5.5rem)` | 400 | 0.98 | −0.01em |
| H3 / statement | Instrument Serif | `clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)` | 400 | 1.12 | −0.005em |
| Body | Instrument Sans | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` | 400 | 1.6 | 0 |
| Small / label / meta | Instrument Sans | `0.875rem` | 500 | 1.5 | 0.005em |
| Footer mark | Instrument Serif | `clamp(3.5rem, 15vw, 16rem)` | 400 | 0.9 | −0.02em |

**Typography rules:**
- Headlines are two lines or fewer at every width. The measure is ≤ 68ch for body text.
- Italic is reserved for whole voiced phrases: the brand name line in the hero, quotations and the signature. It is never a single accent word.
- Labels are sentence case at 14px. There is no tiny tracked uppercase anywhere.
- Marathi (Tiro Devanagari Marathi) appears in exactly two places: the Contact eyebrow *शुभमंगल सावधान* and the footer note *चंद्रकोर*. Devanagari is never split per character (conjuncts break), so it is revealed per line.
- `text-wrap: balance` on headings, `pretty` on paragraphs.
- **NEVER use** Playfair Display, Great Vibes, Cormorant, Poppins, Inter, Roboto, Arial, Open Sans, Helvetica, or any monospace face (outside `<code>`).

**Text decoration** (text-decoration-rules decision table, warm/editorial): no gradient text, no glows, no text-shadow anywhere. The only text-on-photo case (the mobile hero) sits on a neutral ink scrim.

## 4. Component Stylings

### Buttons (one shape: the full pill, which is two half-moons)
```css
.btn { display:inline-flex; align-items:center; gap:.75rem; min-height:52px; padding:0 .375rem 0 1.375rem;
  border-radius:999px; font:500 0.9375rem/1 var(--font-sans); letter-spacing:.005em;
  transition: background-color .2s var(--ease-out), color .2s var(--ease-out), transform .2s var(--ease-out); }
.btn-primary { background:var(--onyx); color:var(--paper); }
.btn-primary .btn-moon { width:40px; height:40px; border-radius:50%; display:grid; place-items:center;
  background:rgb(var(--paper-rgb) / .14); transition: transform .3s var(--ease-out), background-color .3s; }
.btn-primary:hover { background:var(--onyx-hover); }
.btn-primary:hover .btn-moon { transform: translate(2px,-2px) scale(1.06); background:rgb(var(--paper-rgb) / .22); }
.btn-primary:active { transform: scale(.98); }
.btn:focus-visible { outline:2px solid var(--onyx); outline-offset:3px; }
.on-night .btn:focus-visible { outline-color: var(--gold); }
.btn[disabled], .btn[aria-disabled="true"] { opacity:.45; cursor:not-allowed; transform:none; }
/* Secondary: a text link whose underline draws on hover */
.link { color:var(--ink); background: linear-gradient(currentColor,currentColor) 0 100% / 100% 1px no-repeat;
  padding-bottom:2px; transition: background-size .35s var(--ease-out); }
.link:hover { background-size: 0 1px; background-position: 100% 100%; }
.link:focus-visible { outline:2px solid var(--onyx); outline-offset:4px; border-radius:2px; }
```
(The underline is a 1px rule, not a gradient effect; it is the only `linear-gradient` in the code.)

### Film tile (Films band)
```css
.film { display:block; color:var(--paper); }
.film-frame { position:relative; aspect-ratio:16/9; overflow:hidden; background:var(--night-raised); }
.film-frame img { transition: transform .9s var(--ease-out); }
.film:hover .film-frame img { transform: scale(1.04); }
.film-play { position:absolute; left:1rem; bottom:1rem; width:56px; height:56px; border-radius:50%;
  background:var(--gold-light); color:var(--night); display:grid; place-items:center; transition: transform .3s var(--ease-out); }
.film:hover .film-play { transform: scale(1.08); }
.film:focus-visible { outline:2px solid var(--gold); outline-offset:4px; }
.film-meta { display:flex; justify-content:space-between; gap:1rem; margin-top:.75rem; font-size:.875rem; color:var(--gold-light); }
```

### Navigation (floating glass pill; the brief overrides taste's "no glass")
```css
.nav { position:fixed; top:max(16px, calc(env(safe-area-inset-top) + 8px)); left:50%; translate:-50% 0; z-index:var(--z-nav);
  display:flex; align-items:center; gap:.5rem; height:60px; padding:6px 6px 6px 18px; border-radius:999px;
  background:rgb(var(--paper-rgb) / .66); -webkit-backdrop-filter: blur(14px) saturate(160%); backdrop-filter: blur(14px) saturate(160%);
  border:1px solid rgb(var(--ink-rgb) / .08);
  box-shadow: 0 10px 30px -12px rgb(var(--ink-rgb) / .18), inset 0 1px 0 rgb(255 255 255 / .65); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .nav { background:rgb(var(--paper-rgb) / .94); } }
.nav[data-compact="true"] { height:52px; }
.nav a { min-height:44px; display:inline-flex; align-items:center; padding:0 .875rem; border-radius:999px; color:var(--ink-soft); }
.nav a:hover, .nav a[aria-current="true"] { color:var(--ink); }
.nav-active { position:absolute; inset:0; border-radius:999px; background:var(--sand); z-index:-1; } /* Motion layoutId */
.nav a:focus-visible { outline:2px solid var(--onyx); outline-offset:2px; }
```

### Tags / badges
```css
.tag-sample { display:inline-block; font:500 .8125rem/1.4 var(--font-sans); color:var(--gold-ink);
  background:var(--cream); padding:.25rem .625rem; border-radius:999px; } /* "Sample review · replace before launch" */
```

### Chips (event selection, toggle buttons with `aria-pressed`)
```css
.chip { min-height:44px; padding:0 1rem; border-radius:999px; background:rgb(var(--paper-rgb) / .7); color:var(--ink);
  font:500 .9375rem/1 var(--font-sans); transition: background-color .2s var(--ease-out), color .2s, transform .2s; }
.chip:hover { background:var(--paper); }
.chip[aria-pressed="true"] { background:var(--onyx); color:var(--paper); }
.chip:active { transform:scale(.97); }
.chip:focus-visible { outline:2px solid var(--onyx); outline-offset:2px; }
.chip:disabled { opacity:.45; cursor:not-allowed; }
```

### Form fields (on the parchment coupon)
```css
.field label { display:block; font:500 .875rem/1.4 var(--font-sans); color:var(--ink); margin-bottom:.375rem; }
.input { width:100%; min-height:52px; padding:0 1rem; border-radius:0; border:0; border-bottom:1px solid rgb(var(--ink-rgb) / .35);
  background:rgb(var(--paper-rgb) / .72); color:var(--ink); font:400 1rem/1.4 var(--font-sans); /* 16px: no iOS zoom */
  transition: background-color .2s var(--ease-out), border-color .2s; }
.input:hover { background:rgb(var(--paper-rgb) / .9); }
.input:focus-visible { outline:2px solid var(--onyx); outline-offset:2px; background:var(--paper); }
.input[aria-invalid="true"] { border-bottom:2px solid var(--error); }
.field-error { color:var(--error); font-size:.875rem; margin-top:.375rem; }
.input:disabled { opacity:.5; cursor:not-allowed; }
```

### Accordion (FAQ: native `<details name="faq">`; Services on touch)
```css
.faq summary { list-style:none; min-height:56px; display:flex; justify-content:space-between; align-items:center; gap:1rem; cursor:pointer; }
.faq summary::-webkit-details-marker { display:none; }
.faq summary:hover { color:var(--gold-deep); }
.faq summary:focus-visible { outline:2px solid var(--onyx); outline-offset:4px; }
.faq details { interpolate-size: allow-keywords; }
.faq details::details-content { block-size:0; overflow:clip; transition: block-size .45s var(--ease-out), content-visibility .45s allow-discrete; }
.faq details[open]::details-content { block-size:auto; }
```

### Dialog (film player)
`<dialog>` opened with `showModal()`: night backdrop at 92%, a 16:9 iframe (youtube-nocookie) at `min(92vw, 160svh)`, a close button (44px, top-right, `aria-label="Close film"`), Esc to close, and focus returns to the opening tile.

## 5. Layout Principles

**Container:** max content width 1440px; page margins `--margin: clamp(16px, 4vw, 56px)` (16px gutter at phone width); reading column ≤ 68ch.
**Spacing scale (8pt):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 200. Section padding is `--section-y: clamp(96px, 12vw, 200px)`, always larger than any gap inside a section. Component gap 24–48. Panel padding 32–56.
**Grid:**
```css
.grid { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); column-gap: clamp(16px, 2.5vw, 32px);
  padding-inline: var(--margin); max-width: 1440px; margin-inline: auto; }
@media (min-width: 64rem) { .grid { grid-template-columns: repeat(12, minmax(0,1fr)); } }
```
- Left-aligned by default. The manifesto statement is the page's one centred moment (on desktop only).
- Neighbouring sections never share a composition: hero split → centred statement → tile line → marquee band → pinned horizontal → staggered grid on night → index with preview → tinted accordion + filed cards → inset panel → paper slips → circle grid → coupon → mark.
- One corner rule: media are square, or masked to the motif (circle, arch); buttons, chips and the nav are full pills; panels are square. Nothing uses a 9–16px "soft" radius.
- z-index layers: media 10 · nav 40 · floating WhatsApp 45 · menu/dialog 60 · cursor 70 · loader 80.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | none | Everything at rest: tiles, panels, images, cards |
| Tone step | paper → cream → sand | Separating surfaces |
| Floating | `0 10px 30px -12px rgb(31 27 22 / .18)` + inset highlight | The nav pill (it truly floats) |
| Lifted | `0 12px 32px -10px rgb(31 27 22 / .28)` | The floating WhatsApp button, the open mobile sheet |
| Modal | night backdrop 92% | The film dialog |

There are no shadows at rest and no glows.

## 7. Animation & Interaction

**Motion philosophy:** one consistent system, so every move says "something rare is arriving". Content arrives from below through masks; the moon waxes as you go. Only `transform`, `opacity` and `clip-path` are animated.
**Tier:** L3.

### Dependencies
`gsap@3.15.0` (+ `@gsap/react`), `lenis@1.3.27`, `motion@14.4.0`. GSAP and Lenis are **dynamic-imported on idle** by `MotionBootstrap`, and only when `prefers-reduced-motion: no-preference`. Lenis loads only for `(hover:hover) and (pointer:fine)`.

### Tokens
```css
--ease-out: cubic-bezier(.16,1,.3,1);   /* GSAP "expo.out" */
--ease-in-out: cubic-bezier(.65,0,.35,1);
--ease-in: cubic-bezier(.7,0,.84,0);
--dur-micro: 200ms; --dur-ui: 500ms; --dur-reveal: 900ms; --dur-image: 1200ms;
/* Motion spring (UI): { type:'spring', stiffness:380, damping:34 } */
```

### Base setup
```ts
// motion/bootstrap.ts (loaded on idle)
gsap.registerPlugin(ScrollTrigger); // no SplitText: it builds an Intl.Segmenter on load (50–140 ms on a mid-range phone)
// Lenis via <ReactLenis root options={{ autoRaf:false, syncTouch:false, lerp:0.1 }} /> (desktop only)
gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);
document.fonts.ready.then(() => ScrollTrigger.refresh());
```

### Entrance (CSS; no JS needed for the first screen)
```css
@keyframes rise { from { transform: translateY(105%); } to { transform: none; } }
@keyframes fade-up { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }
.line-mask { display:block; overflow:clip; } .line-mask > span { display:block; animation: rise .9s var(--ease-out) both; }
```
Hero order: the aperture scales 0.9→1 and the ring draws (0–0.9s), then H1 lines (0.15s, +0.1s each), sub (0.55s), CTAs (0.7s), scroll cue (0.9s). Everything ends by 1.6s. On a first visit the loader (0.9s) runs first, and the hero animations are delayed with `html[data-intro=play]`.

### Scroll behaviour (one choreography for every section; each element once, as it crosses 92% of the screen)
- Section label: fade + y 12px (0.6s).
- H2: split into masked lines as it arrives (one layout read finds the browser's own line breaks), `yPercent:140→0`, 0.9s expo.out, 0.08s stagger. The plain text comes back once the lines settle.
- Body: fade + y 16px, 0.7s, 0.06s stagger.
- Media: `clip-path: inset(0 0 100% 0) → inset(0)` 1.2s expo.out, with the inner image scaling 1.15→1; then a gentle scrubbed parallax (yPercent ±6).
- One IntersectionObserver times every once-only reveal. Only elements wholly below the screen at its first report are hidden and animated, so nothing can stay invisible, and nothing already in view ever blinks. They are hidden with `opacity` alone (never `visibility`), so they stay in the tab order and the accessibility tree, and anything that receives focus is revealed at once.
- Specials:
  - **Hero:** CSS sticky track (210svh); scrub drives the aperture circle to full-bleed, the media scales 1.15→1, and the headline drifts −12vh and fades.
  - **Manifesto:** words scrub opacity .16→1 while a faint background moon waxes.
  - **Marquee:** scroll-linked x.
  - **Stories:** pinned horizontal track (desktop), a moon riding a Bézier arc; on phones each arch opens as it is scrolled or swiped into view.
  - **Films:** the band's moon rises.
  - **Process:** the line draws and the phases wax.
  - **About:** the swash draws with `stroke-dashoffset` (its `pathLength` is 1); the photo disc wipes up.
  - **Instagram:** tiles converge.
  - **Footer:** the phase moons wax in turn; the studio's logo settles in and its gold frame draws.

### Hover and focus states
Every interactive element has hover, active, focus-visible and disabled states (§4). Hovers are 200ms colour or transform changes; focus rings are 2px onyx (gold on night) with a 2–4px offset.

### Special effects
- **Signature, "Index with preview" (Services):** hovering a row brings its image into one fixed moon frame (240ms crossfade + `circle()` reveal) and dims the other rows to ink-soft (never below 4.5:1). On touch, each row expands inline.
- **Moon cursor:** fine pointers only; a dot plus a lerped ring that becomes "Play" over films and "View" over Instagram tiles; the native cursor in fields.
- **Godavari ripple:** dropped (see §11). The hero reel is the moving picture.
- **Akshata:** 14 rice grains burst from "Send on WhatsApp".
- **Nav moon:** waxes with scroll and turns full deep gold, with a soft glow, at Contact.

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; scroll-behavior: auto !important; }
  .intro { display: none !important; }
  .hero-track { height: auto !important; }
}
```
With reduced motion there is no Lenis, loader, scrub, pin, parallax, marquee motion or cursor. The manifesto is fully lit and all content is visible. Colour feedback remains.

## 8. Do's and Don'ts

### Do
- Use the moon (circle, arch, crescent) as the only shape with character: masks, bullets, notches, buttons.
- Keep the page light. The Films band is the single dark field, because films are watched in the dark.
- Put real content everywhere: real film titles, real places, real facts. Mark anything unverified (sample reviews) on the page.
- Make the big thing big: the hero moon is cropped by the viewport; photographs run large.
- Let the phone layout be its own composition: thumb-reach CTAs, native scroll, snap carousels.
- Test every pair against WCAG with `scripts/contrast.mjs` before using it.

### Don't
- ❌ Never caption an AI image with a real couple's name, and never AI-generate Dhiraj or any real person.
- ❌ No invented awards, press, wedding counts, ratings, prices or reviews presented as real.
- ❌ No gradients, glows or drop shadows at rest (exceptions: the nav pill and its moon's gold glow at Contact, the menu sheet, the floating WhatsApp button, the dialog, the neutral scrim over the phone hero photo, and brand logos).
- ❌ No card grids, icon-topped feature cards, pill badges or eyebrow chips (except the Marathi line and the moon-phase section labels).
- ❌ No monospace, no tiny tracked uppercase labels, no single italic accent word in a headline.
- ❌ No `filter: blur()` on moving elements; `backdrop-filter` ≤ 14px and only on the nav.
- ❌ Never animate one element with two libraries; never animate width, height, top or left.
- ❌ No hard-coded hex in components; no 9–16px "soft" radius.
- ❌ No autoplaying sound, no carousels that move on their own, no pop-up enquiry modals.
- ❌ Never hide content behind a script: SSR renders the final state.

## 9. Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| Phone S | 320–374 | 16px margins; hero H1 two lines sized from its room, `(100vw − 60px) / 7.3`; nav pill with mark + name + Menu; under 358px the hero CTA reads "Check your date" + the WhatsApp disc |
| Phone | 375–767 | Portrait hero (auto-open aperture, text on scrim, CTAs in thumb zone); snap carousels for Stories and Films |
| Tablet | 768–1023 | Mobile nav; 4-column grid; Stories snap; Services accordion |
| Desktop | 1024–1439 | Glass pill nav; 12 columns; sticky hero scrub; pinned Stories; Services index preview; cursor |
| Wide | ≥ 1440 | Content max 1440px; media may bleed; type steps cap |

**Touch targets:** at least 44×44px with an 8px gap; inputs at 16px text.
**Collapsing strategy:** splits stack (text first, then media); the staggered Films grid becomes a snap row; the process accordion goes vertical; slips lose overlap but keep a 2–3° rotation; safe areas apply to the nav, sheet and floating button.
```css
@media (max-width: 63.99rem) { .nav-desktop { display:none; } }
@media (min-width: 64rem) { .nav-mobile { display:none; } }
html { overflow-x: clip; } /* keeps position: sticky working */
```

---

## 10. Imagery

- **Grade:** a warm Portra 400 look: creamy highlights, warm open shadows, true Indian skin tones, olive greens, a faint moonlight-blue in the deepest shadows, fine grain. The paper grain overlay (SVG `feTurbulence`, 7%, fixed, no blend mode) sits over everything.
- **Aspect families:** 16:9 (films, hero desktop), 9:16 (hero mobile), 4:5 (portrait chapters, services), 3:2 (landscape chapters), 1:1 (Instagram).
- **Masks:** the hero is a circle; Stories frames are arches (`border-radius: 999px 999px 0 0`), the moon rising; the Services preview and the About portrait are circles; Instagram tiles are circles; films stay 16:9 rectangles (screens).
- **Sources:** 14 AI images (placeholders until real work arrives; see `docs/IMAGE_PROMPTS.md`), plus the studio's own YouTube thumbnails for films. A missing image renders a tonal sand placeholder (grain + crescent + "Image coming soon").
- **Alt text** describes the scene, never a person's identity.

## 11. Decisions & skill reconciliation

**Taste sheet adoption:** sheet `.taste-skill/direction.json`, direction `one-motif`, seed 484166439.

| Slot | Sheet | Used | Why |
|---|---|---|---|
| Hero | Tabbed folder stack | Direction §2: giant cropped circle from the lower right, headline left | The brief specifies the aperture hero; the sheet's own direction text describes exactly this |
| intro | Statement with inline thumbnails | ✓ manifesto, inline frames are circles | Brief: large serif paragraph lit word by word; capped at 36px, so it reads as a paragraph |
| proof | Large marks on tiles | ✓ as a line of five flat cream discs + a heading tile | Brief: trust line |
| gallery | One frame, contents change | Pinned horizontal arches | Brief specifies a pinned horizontal scroll |
| work | Staggered tiles, empty cells | ✓ Films on the night band | — |
| list | Two-column menu, photo bullets | ✓ one column of large rows with circular photo bullets + the signature preview | Six items; the brief asks for a hover reveal |
| how-it-works | Accordion of tinted panels | ✓ new moon → full moon tints | — |
| faq | Tabbed index cards | ✓ with half-moon tabs (`<details>`) | Motif instead of trapezoids |
| about | Inset panel, shaped portrait | ✓ on cream (not deep) | The brief allows one dark band only |
| testimonial | Portrait and offset quotation | **Redraw → paper slips** with scalloped edges | No speaker portraits exist; reviews are samples |
| showcase | Object on a disc | Six circular Instagram tiles | Brief: 6-tile grid |
| contact | Clip-out coupon | ✓ parchment coupon with circular notches; stub = twilight photo with the live moon | An RSVP card, so the page-is-the-object direction |
| footer | The mark, built large | Giant serif wordmark with the "O" as a full moon + a row of phases | Brief: giant wordmark |
| motion | Index with preview | ✓ Services | — |

**Brief vs skills:**
- **Glass pill nav:** the brief wins over taste ("no glass"). Blur 14px; opaque fallback.
- **Numbered labels:** the brief wins. The page is a lunar sequence: each label shows a numeral plus the phase for that point in the cycle, 01 (thin crescent) to 10 (full blue moon).
- **Hairlines:** only where they carry structure.
- **Italic emotion:** whole voiced phrases only.
- **ui-ux-pro-max generator** (pink, Great Vibes, Cormorant): rejected as cliché. Kept its "social proof before CTA" and checklist.
- **High-end:** double-bezel cards and blur reveals rejected; button-in-button kept for the primary CTA (the trailing circle is a moon).
- **Hero headline:** pre-split on the server into CSS masks, not SplitText, so the first screen never waits for JS.
- **Open-collection images:** a public-domain LACMA Paithani bridal sari and a CC BY-SA photo of Nashik's Godavari ghat were found; not downloaded yet (needs Kunal's OK). Offered in the report.

**Build decisions (2026-10-20/21):**
- **No WebGL ripple.** The real hero reel already moves; the ripple would add JS and GPU cost for little gain.
- **Phone hero is an inset rounded frame** (8px inset, 28px radius, like the menu sheet), not full-bleed. Browsers treat a viewport-filling image as background, and this photograph is the page's real content (its LCP).
- **Hero headline sized from its room.** The italic line is 7.14em wide in Instrument Serif, so phones use `(100vw − 60px) / 7.3` with `nowrap`. The copy keeps its height when the webfont swaps in (CLS 0). The tablet subline uses `em`, not `ch`, for the same reason.
- **The hero photograph is preloaded from `<head>`**, ahead of the scripts, one preload per art-directed source (media queries). Phones get q60, capped at 1080w, with a 750w candidate for 412px screens.
- **The Marathi webfont is switched on near its two touches** (`html.marathi-ready`, set by an IntersectionObserver in the head script), so its 61 KB never loads with the first screen. Spaces stay outside the Marathi spans, or the font's Latin file would load too.
- **CSS is inlined** (`experimental.inlineCss`). Next also copies it into the RSC payload; Vercel's brotli dedupes that (about 1.4 KB). Blur placeholders are not inlined: the dominant colour is enough.
- **Hero reel budgets** (desktop ≤ 4 MB, phone ≤ 2.5 MB) are enforced at build time. Phones never fall back to the desktop reel. The supplied reel's generator mark is cropped out with `REEL_CROP`.
- **Coupon text in full ink** on the parchment card.
- **Trust line:** pills under 64rem, discs above.
- **Lenis anchor scrolling uses no offset**, because Lenis honours the root's `scroll-padding-top` (and any `scroll-margin-top`).
- **First-visit intro trimmed to 0.9s** (it held Speed Index back at 1.2s).
- **Footer logo is one image named "Once in a Blue Moon"** (`role="img"`); the nav wordmark and the intro logo are decorative (`aria-hidden`), because the link around the nav wordmark carries the name.
- **Icons are Phosphor** (per-icon imports from `@phosphor-icons/react/dist/ssr/*`): `light` at 20px (phone, envelope), `bold` at 14–16px (arrows, close) to match the site's ~1.3–1.5px strokes, `fill` for play/pause. Brand logos stay official; moons and the mark stay custom.
- **The hero reel can be paused** (WCAG 2.2.2): a paper disc at the stage's bottom-right appears once the reel plays; a reel paused by hand stays paused through scrolling.
- **`html { scroll-padding: 96px 0 88px }`** replaces per-element `scroll-margin`. Anchors land in the same place (Lenis reads it too), and keyboard focus is never hidden under the nav pill or the floating WhatsApp button (WCAG 2.4.11).
- **Short landscape screens:**
  - the hero track is never shorter than its 540px stage
  - the phone headline is capped at `14svh`
  - the menu sheet scrolls, so every link stays reachable
- **Scrollbar (client request): a pill of evening sky.**
  - The gradient runs sunset coral → rose → lilac → moon → deep moon (`--color-sky-*` tokens, each ≥ 3:1 on paper), in a paper rim on a paper track.
  - It renders in Chromium and WebKit; Firefox shows a solid deep-gold thumb, and phones keep their overlay scrollbars. (Since the re-theme, the thumb is zari gold deepening to onyx.)
  - `scrollbar-gutter: stable` stops the page jumping sideways when the dialog or menu locks scrolling.
  - A thumb that changed colour with scroll position was dropped: Chromium clipped the mask around it and won't repaint the thumb on class changes.
- **Re-theme to "Onyx & Zari Gold" and the client's own logo (2026-10-21):** see §1–§2. The navy action colour became onyx, moon-blue fills became gold, the coupon became parchment, and the Films band is black with a pale-gold moon.
- **Motion on phones and tablets (bug fixed 2026-10-21):**
  - GSAP's `matchMedia` ran its setup only while "desktop" or "reduce" matched, so screens under 1024px never got scroll motion at all. It now keys on `prefers-reduced-motion: no-preference`.
  - The phone story arches are observed through their unclipped wrapper: an element hidden by `clip-path: inset(100%)` has no visible area, so observing it never fired.
  - A light scroll scrub now leans the phone hero in as it leaves.
- **Motion cost on phones (2026-10-21).** Turning motion on for phones first cost about 300 ms of main-thread time on a 4×-throttled phone. Now:
  - **One IntersectionObserver for every once-only reveal**, instead of a ScrollTrigger each (each one measured the page). Waiting elements are hidden with plain style writes (no reads), and offsets, scale and scatter start only when they arrive, while still invisible.
  - **No SplitText or DrawSVG.** SplitText builds an `Intl.Segmenter` the moment it loads (47–136 ms measured). The manifesto's words are split on the server; headings are split into lines on arrival and restored after, matching the browser's line breaks to 0 px (`qa/split-fidelity.mjs`); the swash uses `stroke-dashoffset`.
  - **Setup in slices** that yield between sections.
  - The GSAP chunk's evaluation dropped from about 310 ms to 140 ms, and the observer's hide pass from about 120 ms to 6 ms (4× CPU). With Lighthouse's CPU multiplier calibrated to this machine, TBT is the same with and without the motion code.
  - Cards in a sideways swipe row (`data-swipe-row`) arrive with their row, and the About photo is wrapped so the observer watches the unclipped circle.
- **Audits (2026-10-21).** The web-design checklist passes, with two noted deviations: the display serif is 400 (Instrument Serif's only weight), and there is no WebGL moment (three of the four scroll-story patterns are covered without it). The ui-ux-pro-max pre-delivery items that apply to the web pass; light-only by brief, so the dark-mode rows don't apply.
- **Taste inspector.** It runs with allowances for what the brief asks for: numbered lunar labels and label/value pairs, structural hairlines, the glass pill, the cream palette, the italic hero line, animated one-colour link underlines, the moon-phase process steps, the snap rows and the pinned stories. The manifesto and H3 are capped at 36px. Every kept pattern carries a `taste-skill-ignore` reason in the CSS.
