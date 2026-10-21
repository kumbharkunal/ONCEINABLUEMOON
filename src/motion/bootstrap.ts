// Scroll choreography (loaded on idle by MotionBootstrap, only when prefers-reduced-motion: no-preference).
// The server already rendered the final, visible page. This module only hides elements that are still
// below the fold, then reveals them as they arrive, so nothing can stay hidden if anything fails.
//
// Cost on a phone matters as much as the look (a mid-range Android is about 4× slower than a laptop):
// - Every once-only reveal shares one IntersectionObserver. The browser reports positions after its own
//   layout, and hiding is a plain style write, so the setup never forces a layout of its own.
// - ScrollTrigger is kept for what follows the scroll continuously: the hero, the manifesto, the marquee,
//   the stories pin, the films moon and the About swash. Those are created section by section in page
//   order, so the pin refreshes correctly.
// - The setup runs in short slices that hand the main thread back between sections.
// - No SplitText: it builds an Intl.Segmenter as it loads (50–140 ms on such a phone). The manifesto's
//   words are split on the server, and headings are split into lines here, only as they arrive.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { moonLitPath } from '@/lib/moon-path';

gsap.registerPlugin(ScrollTrigger);

const EXPO = 'expo.out';
const qa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const byPageOrder = (a: Element, b: Element) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
const firstImages = (els: HTMLElement[]) => els.map((el) => el.querySelector('img')).filter((img): img is HTMLImageElement => img !== null);

/* ───────────── Headings, line by line ───────────── */

/**
 * Splits a plain-text heading into lines that can rise through masks: one layout read to find where
 * the browser broke the lines, then each line goes in its own clip (sections.css .split-mask).
 * Returns the lines and a function that puts the original text back.
 */
function splitLines(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.textContent = '';
  const words = text
    .trim()
    .split(/\s+/)
    .map((word) => {
      const span = document.createElement('span');
      span.textContent = word;
      el.append(span, ' ');
      return span;
    });
  const rows: string[][] = [];
  let top = Number.NaN;
  for (const span of words) {
    const t = span.offsetTop;
    if (t !== top) rows.push([]);
    top = t;
    rows[rows.length - 1].push(span.textContent ?? '');
  }
  el.textContent = '';
  const lines = rows.map((row) => {
    const mask = document.createElement('span');
    const line = document.createElement('span');
    mask.className = 'split-mask';
    line.className = 'split-line';
    line.textContent = row.join(' ');
    mask.append(line);
    el.append(mask);
    return line;
  });
  return { lines, restore: () => void (el.textContent = text) };
}

/* ───────────── Once-only reveals: one observer for the whole page ───────────── */

/** Writes an inline style and remembers the original, so leaving motion (or a breakpoint change) restores it exactly. */
type SetStyle = (el: HTMLElement | SVGElement, prop: string, value: string) => void;

/**
 * How a kind of element waits below the fold, and how it arrives. Waiting is a plain style write (no
 * reads); everything the arrival needs (offsets, scale, scatter) starts while the element is still
 * invisible. Elements that cross in the same frame arrive together, in page order.
 */
type Kind = {
  hide: (els: HTMLElement[], set: SetStyle) => void;
  show: (els: HTMLElement[]) => (() => void) | void;
};

const batch = (from: gsap.TweenVars, to: gsap.TweenVars, stagger = 0.07): Kind => ({
  hide: (els, set) => els.forEach((el) => set(el, 'opacity', '0')),
  show: (els) => void gsap.fromTo(els, { opacity: 0, ...from }, { opacity: 1, ...to, stagger, overwrite: true }),
});

const KINDS = {
  label: batch({ y: 12 }, { y: 0, duration: 0.6, ease: 'power3.out' }),
  fade: batch({ y: 16 }, { y: 0, duration: 0.7, ease: 'power3.out' }, 0.06),
  rise: batch({ y: 32 }, { y: 0, duration: 0.9, ease: EXPO }, 0.08),
  pop: batch({ scale: 0.9 }, { scale: 1, duration: 0.9, ease: EXPO }, 0.07),
  slip: batch({ y: 80 }, { y: 0, duration: 1.1, ease: EXPO }, 0.12),
  phase: batch({ scale: 0.6 }, { scale: 1, duration: 0.6, ease: EXPO }, 0.06),

  // Headings rise line by line through masks. They are split only when they arrive (in their final font
  // and width), and the plain text comes back once the lines have settled.
  lines: {
    hide: (els, set) => els.forEach((el) => set(el, 'opacity', '0')),
    show: (els) => {
      const restores = els.map((el) => {
        const { lines, restore } = splitLines(el);
        el.style.opacity = '';
        gsap.fromTo(lines, { yPercent: 140 }, { yPercent: 0, duration: 0.9, ease: EXPO, stagger: 0.08, onComplete: restore });
        return restore;
      });
      return () => restores.forEach((restore) => restore());
    },
  },

  // Photographs open from the bottom edge while the picture settles.
  media: {
    hide: (els, set) => els.forEach((el) => set(el, 'clip-path', 'inset(100% 0% 0% 0%)')),
    show: (els) => {
      gsap.fromTo(els, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EXPO, stagger: 0.08 });
      gsap.fromTo(firstImages(els), { scale: 1.15 }, { scale: 1, duration: 1.4, ease: EXPO, stagger: 0.08 });
    },
  },

  // Story arches on phones: a CSS transition (sections.css .will-reveal) does the opening.
  arch: {
    hide: (els) => els.forEach((f) => f.classList.add('will-reveal')),
    show: (els) => els.forEach((f) => f.classList.add('is-in')),
  },

  // Six Instagram moons converge into the grid.
  converge: {
    hide: (grids, set) => grids.flatMap((g) => qa('.ig-tile', g)).forEach((t) => set(t, 'opacity', '0')),
    show: (grids) =>
      void gsap.fromTo(
        grids.flatMap((g) => qa('.ig-tile', g)),
        {
          opacity: 0,
          x: () => gsap.utils.random(-48, 48),
          y: () => gsap.utils.random(-40, 56),
          rotation: () => gsap.utils.random(-7, 7),
          scale: 0.86,
        },
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.2, ease: EXPO, stagger: 0.06 },
      ),
  },

  // The studio's logo settles in and its gold frame draws (the frame's pathLength is 1).
  logo: {
    hide: (els, set) =>
      els.forEach((el) => {
        set(el, 'opacity', '0');
        qa<SVGPathElement>('[data-logo-frame]', el).forEach((f) => set(f, 'stroke-dashoffset', '1'));
      }),
    show: (els) => {
      gsap.fromTo(els, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 1, ease: EXPO });
      const frames = els.flatMap((el) => qa<SVGPathElement>('[data-logo-frame]', el));
      gsap.fromTo(frames, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.15 });
    },
  },
} satisfies Record<string, Kind>;

type Watch = { kind: Kind; target: HTMLElement };

const add = (into: Map<Kind, HTMLElement[]>, { kind, target }: Watch) => into.set(kind, [...(into.get(kind) ?? []), target]);

/**
 * One IntersectionObserver for every once-only reveal. Its first report on an element says where it is:
 * wholly below the screen, it is hidden and waits; anywhere else (on screen, above, or not rendered) it
 * is left exactly as the server drew it, so nothing the visitor can already see ever blinks. A later
 * report that it crossed into view (8% above the bottom edge) reveals it, once.
 */
function createRevealer(ctx: gsap.Context, alive: () => boolean) {
  const watching = new Map<Element, Watch[]>();
  const placed = new WeakSet<Element>();
  const hidden = new WeakSet<Element>();
  const originals = new Map<HTMLElement | SVGElement, Map<string, string>>();

  const set: SetStyle = (el, prop, value) => {
    let props = originals.get(el);
    if (!props) originals.set(el, (props = new Map()));
    if (!props.has(prop)) props.set(prop, el.style.getPropertyValue(prop));
    el.style.setProperty(prop, value);
  };

  const play = (hide: Map<Kind, HTMLElement[]>, show: Map<Kind, HTMLElement[]>) => {
    if (!hide.size && !show.size) return;
    hide.forEach((els, kind) => kind.hide(els, set));
    if (!show.size) return;
    // Inside the GSAP context, so leaving motion reverts the tweens; a kind's own cleanup runs after.
    ctx.add(() => {
      const cleanups: Array<() => void> = [];
      show.forEach((els, kind) => {
        const cleanup = kind.show(els.sort(byPageOrder));
        if (cleanup) cleanups.push(cleanup);
      });
      return () => cleanups.forEach((c) => c());
    });
  };

  const forget = (observed: Element) => {
    watching.delete(observed);
    io.unobserve(observed);
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (!alive()) return;
      const screen = window.innerHeight;
      const hide = new Map<Kind, HTMLElement[]>();
      const show = new Map<Kind, HTMLElement[]>();
      for (const e of entries) {
        const list = watching.get(e.target);
        if (!list) continue;
        const first = !placed.has(e.target);
        placed.add(e.target);
        if (first && !e.isIntersecting && e.boundingClientRect.top >= screen) {
          for (const w of list) {
            hidden.add(w.target);
            add(hide, w);
          }
          continue;
        }
        if (!first && !e.isIntersecting) continue;
        forget(e.target);
        if (!first) list.forEach((w) => add(show, w));
      }
      play(hide, show);
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  return {
    /** Reveal `target` when `observed` arrives. Observe an unclipped wrapper for anything hidden by clip-path (a fully clipped box is never reported as visible). */
    watch(kind: Kind, target: HTMLElement, observed: Element = target) {
      const list = watching.get(observed);
      if (list) list.push({ kind, target });
      else {
        watching.set(observed, [{ kind, target }]);
        io.observe(observed);
      }
    },
    /** Keyboard focus got ahead of the scroll: reveal everything around the focused element now. */
    settle(node: Element) {
      const show = new Map<Kind, HTMLElement[]>();
      for (const [observed, list] of watching) {
        const rest = list.filter((w) => {
          if (!w.target.contains(node) && !node.contains(w.target)) return true;
          if (hidden.has(w.target)) add(show, w);
          return false;
        });
        if (rest.length === list.length) continue;
        if (rest.length) watching.set(observed, rest);
        else forget(observed);
      }
      play(new Map(), show);
    },
    /** Stops watching and puts back every style the waiting elements were given. */
    disconnect() {
      io.disconnect();
      originals.forEach((props, el) => props.forEach((value, prop) => (value ? el.style.setProperty(prop, value) : el.style.removeProperty(prop))));
      originals.clear();
    },
  };
}

type Revealer = ReturnType<typeof createRevealer>;

/**
 * Cards in a row that swipes sideways arrive with the row: the observer can't see a card waiting off to
 * the side, and a card rising as you swipe across would read wrong. (Where the row is a plain grid, as on
 * wider screens, each card keeps its own timing.)
 */
function swipeRow(el: Element) {
  const row = el.closest('[data-swipe-row]');
  return row && getComputedStyle(row).overflowX !== 'visible' ? row : null;
}

function reveals(scope: ParentNode, r: Revealer) {
  const kinds = ['label', 'fade', 'rise', 'pop', 'slip', 'lines'] as const;
  for (const name of kinds) qa(`[data-reveal="${name}"]`, scope).forEach((el) => r.watch(KINDS[name], el, swipeRow(el) ?? el));
  // A frame is clipped while it waits, so its parent is what the observer watches.
  for (const frame of qa('[data-reveal="media"], [data-reveal-media]', scope)) {
    r.watch(KINDS.media, frame, swipeRow(frame) ?? frame.parentElement ?? frame);
  }
}

/* ───────────── Hero: the moon aperture opens to full bleed (desktop) ───────────── */

async function hero(section: HTMLElement, ctx: gsap.Context, alive: () => boolean) {
  const track = section.querySelector<HTMLElement>('[data-hero-track]');
  const media = section.querySelector<HTMLElement>('[data-hero-media]');
  const zoom = section.querySelector<HTMLElement>('.hero-zoom');
  const scroller = section.querySelector<HTMLElement>('[data-hero-scroll]');
  const ring = section.querySelector<HTMLElement>('[data-hero-ring]');
  const copy = section.querySelector<HTMLElement>('[data-hero-copy]');
  const cue = section.querySelector<HTMLElement>('.hero-cue');
  if (!track || !media || !zoom || !scroller || !ring || !copy) return;

  // Let the CSS entrance finish so we read the resting geometry, not a mid-animation frame.
  await Promise.all([media, zoom].flatMap((el) => el.getAnimations().map((a) => a.finished.catch(() => undefined))));
  if (!alive()) return;
  ctx.add(() => heroTimeline({ track, media, zoom, scroller, ring, copy, cue }));
}

function heroTimeline(els: {
  track: HTMLElement;
  media: HTMLElement;
  zoom: HTMLElement;
  scroller: HTMLElement;
  ring: HTMLElement;
  copy: HTMLElement;
  cue: HTMLElement | null;
}) {
  const { track, media, zoom, scroller, ring, copy, cue } = els;
  const geo = { r0: 0, x0: 0, y0: 0, r1: 0, x1: 0, y1: 0, s: 1, tx: 0, ty: 0 };
  const measure = () => {
    const stage = media.getBoundingClientRect();
    const rr = ring.getBoundingClientRect();
    geo.r0 = rr.width / 2 - 14;
    geo.x0 = rr.left - stage.left + rr.width / 2;
    geo.y0 = rr.top - stage.top + rr.height / 2;
    geo.x1 = stage.width / 2;
    geo.y1 = stage.height / 2;
    geo.r1 = Math.hypot(stage.width, stage.height) / 2 + 24;
    const m = new DOMMatrixReadOnly(getComputedStyle(zoom).transform);
    geo.s = m.a || 1;
    geo.tx = m.e;
    geo.ty = m.f;
  };
  measure();

  const state = { p: 0 };
  const render = () => {
    const p = state.p;
    const c = gsap.parseEase('power2.inOut')(p);
    const r = geo.r0 + (geo.r1 - geo.r0) * c;
    const x = geo.x0 + (geo.x1 - geo.x0) * c;
    const y = geo.y0 + (geo.y1 - geo.y0) * c;
    media.style.clipPath = `circle(${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
    const k = 1 + (1 / geo.s - 1) * c;
    scroller.style.transform = `scale(${k.toFixed(4)}) translate(${(-geo.tx * c).toFixed(1)}px, ${(-geo.ty * c).toFixed(1)}px)`;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: () => {
        measure();
        render();
      },
    },
  });
  tl.to(state, { p: 1, ease: 'none', duration: 1, onUpdate: render }, 0)
    .to(copy, { y: () => -window.innerHeight * 0.1, opacity: 0, ease: 'power1.in', duration: 0.35 }, 0)
    .to([ring, cue].filter(Boolean), { opacity: 0, ease: 'none', duration: 0.3 }, 0);
  render();
}

/* ───────────── Hero on phones and tablets: the photo leans in as the first screen leaves ───────────── */

function heroCompact(section: HTMLElement) {
  // [data-hero-scroll] and the copy wrapper carry no CSS animation of their own (the entrance animates
  // their parents/children), so scrubbing them never fights the CSS.
  const scroller = section.querySelector<HTMLElement>('[data-hero-scroll]');
  const copy = section.querySelector<HTMLElement>('[data-hero-copy]');
  if (!scroller || !copy) return;
  gsap
    .timeline({ scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.5 } })
    .to(scroller, { scale: 1.1, yPercent: 5, ease: 'none' }, 0)
    .to(copy, { y: -48, opacity: 0, ease: 'power1.in' }, 0);
}

/* ───────────── Manifesto: lit word by word over a waxing moon ───────────── */

function manifesto(section: HTMLElement) {
  const text = section.querySelector<HTMLElement>('[data-manifesto-text]');
  const lit = section.querySelector<SVGPathElement>('[data-manifesto-moon-lit]');
  if (text) {
    // The words (.mw) were split on the server; the three photo moons light in their places.
    gsap.fromTo(
      qa('.mw, .manifesto-dot', text),
      { opacity: 0.16 },
      { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 48%', scrub: 0.5 } },
    );
  }
  if (lit) {
    const moon = { p: 0.04 };
    lit.setAttribute('d', moonLitPath(moon.p, 10, 12, 12));
    gsap.to(moon, {
      p: 0.38,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom 40%', scrub: 0.8 },
      onUpdate: () => lit.setAttribute('d', moonLitPath(moon.p, 10, 12, 12)),
    });
  }
}

/* ───────────── Marquee: moves only when you scroll ───────────── */

function marquee(el: HTMLElement) {
  const track = el.querySelector('[data-marquee]');
  if (!track) return;
  gsap.fromTo(
    track,
    { xPercent: 0 },
    { xPercent: -33.333, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 } },
  );
}

/* ───────────── Stories: pinned horizontal day, a moon rising over it ───────────── */

function storiesDesktop(section: HTMLElement) {
  const pin = section.querySelector<HTMLElement>('[data-stories-pin]');
  const viewport = section.querySelector<HTMLElement>('[data-stories-viewport]');
  const track = section.querySelector<HTMLElement>('[data-stories-track]');
  const moon = section.querySelector<HTMLElement>('[data-stories-moon]');
  const sky = section.querySelector<HTMLElement>('.stories-sky');
  if (!pin || !viewport || !track) return () => undefined;
  document.documentElement.classList.add('stories-pinned');
  const distance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      pin: true,
      start: 'top top',
      end: () => `+=${distance()}`,
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (!moon || !sky) return;
        const t = self.progress;
        // Quadratic Bézier from (0,112) via (500,-40) to (1000,112), in a 1000×120 box.
        const bx = 2 * (1 - t) * t * 500 + t * t * 1000;
        const by = (1 - t) * (1 - t) * 112 + 2 * (1 - t) * t * -40 + t * t * 112;
        const w = sky.clientWidth;
        const h = sky.clientHeight;
        moon.style.transform = `translate(${((bx / 1000) * w).toFixed(1)}px, ${((by / 120) * h).toFixed(1)}px)`;
        moon.style.setProperty('--lit', (0.08 + t * 0.42).toFixed(3));
      },
    },
  });

  for (const frame of qa('[data-story-frame]', track)) {
    const img = frame.querySelector('img');
    gsap.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: EXPO,
        scrollTrigger: { trigger: frame, containerAnimation: tween, start: 'left 96%', toggleActions: 'play none none none' },
      },
    );
    if (img) {
      gsap.fromTo(
        img,
        { xPercent: -5, scale: 1.12 },
        {
          xPercent: 5,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: frame, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        },
      );
    }
  }
  return () => document.documentElement.classList.remove('stories-pinned');
}

/** Phones: the chapters are a swipe row. Each arch opens when it is really in sight, scrolled down to or swiped across (the observer's screen is clipped by the row). */
function storiesMobile(section: HTMLElement, r: Revealer) {
  for (const frame of qa('[data-story-frame]', section)) r.watch(KINDS.arch, frame, frame.parentElement ?? frame);
}

/* ───────────── Films: the band's moon rises ───────────── */

function films(section: HTMLElement) {
  const moon = section.querySelector('[data-films-moon]');
  if (!moon) return;
  gsap.fromTo(
    moon,
    { yPercent: 60, scale: 0.8 },
    { yPercent: -10, scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 10%', scrub: 0.8 } },
  );
}

/* ───────────── About: the swash draws under his name; the circle drifts ───────────── */

function about(section: HTMLElement) {
  // The swash's pathLength is 1, so a dash of 1 is the whole stroke.
  const swash = section.querySelector<SVGPathElement>('[data-about-swash]');
  if (swash) {
    gsap.fromTo(
      swash,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: swash, start: 'top 88%', end: 'top 50%', scrub: 0.6 } },
    );
  }
  const circle = section.querySelector('.about-circle img');
  if (circle) {
    gsap.fromTo(
      circle,
      { yPercent: -6 },
      { yPercent: 6, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  }
}

/* ───────────── Footer: the moons wax in turn; the studio's logo settles in and its frame draws ───────────── */

function footer(r: Revealer) {
  qa('[data-footer-phases] li').forEach((li) => r.watch(KINDS.phase, li));
  const brand = document.querySelector<HTMLElement>('[data-footer-brand]');
  if (brand) r.watch(KINDS.logo, brand);
}

/* ───────────── Setup in slices ───────────── */

/** Runs the steps in page order, handing the main thread back whenever a slice has used ~8 ms. */
function runInSlices(steps: Array<() => void>, ctx: gsap.Context, alive: () => boolean) {
  let i = 0;
  const slice = () => {
    if (!alive()) return;
    const until = performance.now() + 8;
    while (i < steps.length) {
      ctx.add(steps[i++]);
      if (performance.now() > until) break;
    }
    if (i < steps.length) window.setTimeout(slice, 0);
  };
  window.setTimeout(slice, 0);
}

/* ───────────── Init ───────────── */

export function init(): () => void {
  const mm = gsap.matchMedia();
  let revealer: Revealer | undefined;
  // GSAP runs this only while at least one condition matches, so one of them must hold on every screen
  // where motion is allowed (keying on "desktop" alone silently skipped every phone and tablet).
  mm.add(
    { desktop: '(min-width: 64rem)', motion: '(prefers-reduced-motion: no-preference)' },
    (ctx) => {
      const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      document.documentElement.classList.add('motion-ready');
      let alive = true;
      const isAlive = () => alive;
      const r = createRevealer(ctx, isAlive);
      revealer = r;
      const cleanups: Array<() => void> = [];

      // One step per section, in page order: hero → sections → footer.
      const steps: Array<() => void> = [];
      for (const section of qa<HTMLElement>('main > section, main > .marquee')) {
        if (section.id === 'top') {
          steps.push(() => (desktop ? void hero(section, ctx, isAlive) : heroCompact(section)));
          continue;
        }
        if (section.classList.contains('marquee')) {
          steps.push(() => marquee(section));
          continue;
        }
        steps.push(() => {
          if (section.id === 'idea') manifesto(section);
          if (section.id === 'stories') {
            if (desktop) cleanups.push(storiesDesktop(section));
            else storiesMobile(section, r);
          }
          if (section.id === 'films') films(section);
          if (section.id === 'about') about(section);
          if (section.id === 'instagram') {
            const grid = section.querySelector<HTMLElement>('[data-ig-grid]');
            if (grid) r.watch(KINDS.converge, grid);
          }
          reveals(section, r);
        });
      }
      steps.push(() => footer(r));
      runInSlices(steps, ctx, isAlive);

      return () => {
        alive = false;
        r.disconnect();
        if (revealer === r) revealer = undefined;
        cleanups.forEach((c) => c());
        // The arches' classes are ours to remove (GSAP reverts only its own styles).
        qa('.will-reveal').forEach((f) => f.classList.remove('will-reveal', 'is-in'));
        document.documentElement.classList.remove('motion-ready');
      };
    },
  );

  // Keyboard users may tab ahead of the scroll: anything around the focused element is revealed at once.
  const onFocus = (e: FocusEvent) => {
    if (e.target instanceof Element) revealer?.settle(e.target);
  };
  document.addEventListener('focusin', onFocus);

  // Webfonts can change line lengths and so trigger positions. Refresh once they have all arrived
  // (usually they already have by now, and then there's nothing to do).
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(refresh).catch(() => undefined);
  if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });

  return () => {
    document.removeEventListener('focusin', onFocus);
    window.removeEventListener('load', refresh);
    mm.revert();
  };
}
