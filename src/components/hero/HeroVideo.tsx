'use client';

import { useEffect, useRef, useState } from 'react';

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * Optional hero reel. Starts only after load + idle, never on Save-Data, slow connections or reduced
 * motion. The still poster underneath stays the LCP element.
 */
export function HeroVideo({ desktop, mobile }: { desktop: string | null; mobile: string | null }) {
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

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
      if (e.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

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
      onPlaying={() => setPlaying(true)}
      className="absolute inset-0 size-full object-cover transition-opacity duration-700"
      style={{ opacity: playing ? 1 : 0 }}
    />
  );
}
