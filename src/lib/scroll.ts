import type Lenis from 'lenis';

declare global {
  interface Window {
    __oiabmLenis?: Lenis;
  }
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Locks page scroll (used by the mobile menu and the film dialog). */
export function lockScroll() {
  document.documentElement.classList.add('is-locked');
  window.__oiabmLenis?.stop();
}

export function unlockScroll() {
  document.documentElement.classList.remove('is-locked');
  window.__oiabmLenis?.start();
}

/** Smooth-scrolls to a section (Lenis on desktop, native elsewhere), updates the hash and moves focus. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = prefersReducedMotion();
  const lenis = window.__oiabmLenis;
  if (lenis && !reduce) {
    // Lenis honours the section's scroll-margin-top (96px), like native scrolling does.
    lenis.scrollTo(el, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  history.replaceState(history.state, '', `#${id}`);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
