'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SmoothScroll = dynamic(() => import('./SmoothScroll'), { ssr: false });
const MoonCursor = dynamic(() => import('@/components/ui/MoonCursor'), { ssr: false });

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/**
 * Progressive motion: the server renders the final, visible page. After the browser is idle, and only
 * when motion is allowed, this loads GSAP + the scroll choreography (and Lenis + the cursor for fine
 * pointers). Nothing ever depends on this script to be readable.
 */
export function MotionBootstrap() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const start = () => {
      if (cancelled) return;
      setDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
      import('@/motion/bootstrap').then((mod) => {
        if (!cancelled) cleanup = mod.init();
      });
    };
    const ric = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback;
    let handle: number;
    if (ric) handle = ric(start, { timeout: 1600 });
    else handle = window.setTimeout(start, 700);
    return () => {
      cancelled = true;
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(handle);
      else window.clearTimeout(handle);
      cleanup?.();
    };
  }, []);

  return desktop ? (
    <>
      <SmoothScroll />
      <MoonCursor />
    </>
  ) : null;
}
