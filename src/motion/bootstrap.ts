// Scroll choreography (loaded on idle by MotionBootstrap, only when prefers-reduced-motion: no-preference).
// The server already rendered the final, visible page. This module only hides elements that are still
// below the fold, then reveals them as they arrive, so nothing can stay hidden if anything fails.
// ScrollTriggers are created section by section in page order (pins refresh correctly).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { moonLitPath } from '@/lib/moon-path';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const EXPO = 'expo.out';
const qa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const isBelowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;

/* ───────────── Generic reveals (one choreography for every section) ───────────── */

function revealLines(el: HTMLElement) {
  if (!isBelowFold(el)) return;
  gsap.set(el, { opacity: 0 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        tag: 'span',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { opacity: 1 });
          return gsap.from(self.lines, { yPercent: 110, duration: 0.9, ease: EXPO, stagger: 0.08 });
        },
      });
    },
  });
}

function revealBatch(els: HTMLElement[], from: gsap.TweenVars, to: gsap.TweenVars, stagger = 0.07) {
  const hidden = els.filter(isBelowFold);
  if (!hidden.length) return;
  gsap.set(hidden, from);
  ScrollTrigger.batch(hidden, {
    start: 'top 90%',
    once: true,
    interval: 0.12,
    onEnter: (batch) => gsap.to(batch, { ...to, stagger, overwrite: true }),
  });
}

function revealMedia(frames: HTMLElement[]) {
  for (const frame of frames) {
    if (!isBelowFold(frame)) continue;
    const img = frame.querySelector('img');
    gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
    if (img) gsap.set(img, { scale: 1.15 });
    ScrollTrigger.create({
      trigger: frame,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EXPO });
        if (img) gsap.to(img, { scale: 1, duration: 1.4, ease: EXPO });
      },
    });
  }
}

function reveals(scope: ParentNode) {
  qa('[data-reveal="lines"]', scope).forEach(revealLines);
  revealBatch(qa('[data-reveal="label"]', scope), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  revealBatch(qa('[data-reveal="fade"]', scope), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.06);
  revealBatch(qa('[data-reveal="rise"]', scope), { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: EXPO }, 0.08);
  revealBatch(qa('[data-reveal="pop"]', scope), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, ease: EXPO }, 0.07);
  revealBatch(qa('[data-reveal="slip"]', scope), { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.1, ease: EXPO }, 0.12);
  revealMedia(qa('[data-reveal="media"], [data-reveal-media]', scope));
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

/* ───────────── Manifesto: lit word by word over a waxing moon ───────────── */

function manifesto(section: HTMLElement) {
  const text = section.querySelector<HTMLElement>('[data-manifesto-text]');
  const lit = section.querySelector<SVGPathElement>('[data-manifesto-moon-lit]');
  if (text) {
    const split = SplitText.create(text, { type: 'words', tag: 'span', aria: 'none', ignore: '.manifesto-dot', wordsClass: 'mw' });
    const units = [...split.words, ...qa('.manifesto-dot', text)].sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    gsap.set(units, { opacity: 0.16 });
    gsap.to(units, {
      opacity: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 48%', scrub: 0.5 },
    });
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

function storiesMobile(section: HTMLElement) {
  const viewport = section.querySelector<HTMLElement>('[data-stories-viewport]');
  if (!viewport) return;
  const frames = qa('[data-story-frame]', section);
  frames.forEach((f) => f.classList.add('will-reveal'));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { root: viewport, threshold: 0.25 },
  );
  frames.forEach((f) => io.observe(f));
  return () => io.disconnect();
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
  const swash = section.querySelector<SVGPathElement>('[data-about-swash]');
  if (swash) {
    gsap.fromTo(
      swash,
      { drawSVG: '0%' },
      { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: swash, start: 'top 88%', end: 'top 50%', scrub: 0.6 } },
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

/* ───────────── Instagram: six moons converge into the grid ───────────── */

function instagram(section: HTMLElement) {
  const grid = section.querySelector<HTMLElement>('[data-ig-grid]');
  if (!grid || !isBelowFold(grid)) return;
  const tiles = qa('.ig-tile', grid);
  gsap.set(tiles, {
    opacity: 0,
    x: () => gsap.utils.random(-48, 48),
    y: () => gsap.utils.random(-40, 56),
    rotation: () => gsap.utils.random(-7, 7),
    scale: 0.86,
  });
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 85%',
    once: true,
    onEnter: () => gsap.to(tiles, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.2, ease: EXPO, stagger: 0.06 }),
  });
}

/* ───────────── Footer: the name rises; its "O" waxes into the blue moon ───────────── */

function footer() {
  const mark = document.querySelector<HTMLElement>('[data-footer-mark]');
  const lit = document.querySelector<SVGPathElement>('[data-footer-o-lit]');
  if (!mark) return;
  const lines = qa('.footer-mark-line', mark);
  if (isBelowFold(mark)) {
    lines.forEach((l) => l.classList.add('is-masked'));
    const inner = lines.map((l) => {
      const span = document.createElement('span');
      span.className = 'footer-mark-inner';
      while (l.firstChild) span.appendChild(l.firstChild);
      l.appendChild(span);
      return span;
    });
    gsap.set(inner, { yPercent: 105 });
    ScrollTrigger.create({
      trigger: mark,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(inner, { yPercent: 0, duration: 1.1, ease: EXPO, stagger: 0.1 }),
    });
  }
  if (lit) {
    const moon = { p: 0.06 };
    lit.setAttribute('d', moonLitPath(moon.p, 10.2, 12, 12));
    gsap.to(moon, {
      p: 0.5,
      ease: 'none',
      scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      onUpdate: () => lit.setAttribute('d', moonLitPath(moon.p, 10.2, 12, 12)),
    });
  }
}

/* ───────────── Init ───────────── */

export function init(): () => void {
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 64rem)', reduce: '(prefers-reduced-motion: reduce)' },
    (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) return;
      document.documentElement.classList.add('motion-ready');
      const cleanups: Array<(() => void) | undefined> = [];
      let alive = true;

      // Page order: hero → sections → footer.
      const sections = qa<HTMLElement>('main > section, main > .marquee');
      for (const section of sections) {
        if (section.id === 'top') {
          if (desktop) void hero(section, ctx, () => alive);
          continue;
        }
        if (section.classList.contains('marquee')) {
          marquee(section);
          continue;
        }
        if (section.id === 'idea') manifesto(section);
        if (section.id === 'stories') cleanups.push(desktop ? storiesDesktop(section) : storiesMobile(section));
        if (section.id === 'films') films(section);
        if (section.id === 'about') about(section);
        if (section.id === 'instagram') instagram(section);
        reveals(section);
      }
      footer();

      return () => {
        alive = false;
        cleanups.forEach((c) => c?.());
        document.documentElement.classList.remove('motion-ready');
      };
    },
  );

  // Keyboard users may tab ahead of the scroll: anything focused is revealed at once.
  const onFocus = (e: FocusEvent) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-reveal], [data-reveal-media], .ig-tile');
    if (el && Number(getComputedStyle(el).opacity) < 1) gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, overwrite: true });
  };
  document.addEventListener('focusin', onFocus);

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh).catch(() => undefined);
  if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });

  return () => {
    document.removeEventListener('focusin', onFocus);
    window.removeEventListener('load', refresh);
    mm.revert();
  };
}
