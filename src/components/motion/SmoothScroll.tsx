'use client';

import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Drives Lenis from GSAP's ticker so ScrollTrigger and smooth scrolling share one clock. */
function TickerBridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
    window.__oiabmLenis = lenis;
    if (document.documentElement.classList.contains('is-locked')) lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      if (window.__oiabmLenis === lenis) delete window.__oiabmLenis;
    };
  }, [lenis]);
  return null;
}

/** Wheel smoothing for fine pointers only. Touch scrolling stays native (syncTouch: false). */
export default function SmoothScroll() {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1, syncTouch: false, anchors: false }}>
      <TickerBridge />
    </ReactLenis>
  );
}
