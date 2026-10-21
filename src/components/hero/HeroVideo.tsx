'use client';

import { useEffect, useRef, useState } from 'react';

type Conn = { saveData?: boolean; effectiveType?: string };

/** Window events shared with HeroReelToggle (the pause control lives outside the clipped aperture). */
export const REEL_STATE = 'oiabm:reel';
export const REEL_TOGGLE = 'oiabm:reel-toggle';
export type ReelState = 'playing' | 'paused';

/**
 * Optional hero reel. Starts only after load + idle, never on Save-Data, slow connections or reduced
 * motion. The still poster underneath stays the LCP element. A visitor can pause it (WCAG 2.2.2); once
 * paused by hand it stays paused, even when it scrolls out of view and back.
 */
export function HeroVideo({ desktop, mobile }: { desktop: string | null; mobile: string | null }) {
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const heldRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const conn = (navigator as unknown as { connection?: Conn }).connection;
    if (conn?.saveData || (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType))) return;
    // No cross-fallback: phones only ever load a dedicated (lighter, portrait) mobile reel.
    const pick = window.matchMedia('(min-width: 64rem)').matches ? desktop : mobile;
    if (!pick) return;
    let timer = 0;
    const go = () => {
      timer = window.setTimeout(() => setSrc(pick), 400);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      window.clearTimeout(timer);
    };
  }, [desktop, mobile]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !heldRef.current) v.play().catch(() => undefined);
      else if (!e.isIntersecting) v.pause();
    });
    io.observe(v);
    const onToggle = () => {
      if (v.paused) {
        heldRef.current = false;
        v.play().catch(() => undefined);
      } else {
        heldRef.current = true;
        v.pause();
      }
    };
    window.addEventListener(REEL_TOGGLE, onToggle);
    return () => {
      io.disconnect();
      window.removeEventListener(REEL_TOGGLE, onToggle);
    };
  }, [src]);

  const announce = (state: ReelState) => window.dispatchEvent(new CustomEvent<ReelState>(REEL_STATE, { detail: state }));

  if (!src) return null;
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden="true"
      onPlaying={() => {
        setPlaying(true);
        announce('playing');
      }}
      onPause={() => announce('paused')}
      className="absolute inset-0 size-full object-cover transition-opacity duration-700"
      style={{ opacity: playing ? 1 : 0 }}
    />
  );
}
