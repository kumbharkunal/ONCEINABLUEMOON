'use client';

import { useEffect, useRef } from 'react';

/**
 * Desktop-only moon cursor (fine pointers, motion allowed; loaded lazily). A small moon and a lagging
 * ring; over films the ring becomes a full moon that says "Play", over Instagram tiles "View".
 * Form fields keep the native cursor.
 */
export default function MoonCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;
    const html = document.documentElement;
    html.classList.add('has-moon-cursor');

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let mode = '';

    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    const setMode = (next: string) => {
      if (next === mode) return;
      mode = next;
      root.dataset.mode = next;
      label.textContent = next === 'play' ? 'Play' : next === 'view' ? 'View' : '';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (root.dataset.visible !== 'true') {
        rx = x;
        ry = y;
        root.dataset.visible = 'true';
      }
      const target = e.target as Element | null;
      const field = target?.closest('input, textarea, select, [contenteditable="true"]');
      const special = target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor;
      const interactive = target?.closest('a, button, summary, label, [role="button"]');
      setMode(field ? 'field' : special ? special : interactive ? 'link' : '');
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      root.dataset.visible = 'false';
    };
    const onDown = () => root.classList.add('is-down');
    const onUp = () => root.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    return () => {
      html.classList.remove('has-moon-cursor');
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div ref={rootRef} className="moon-cursor" aria-hidden="true" data-mode="" data-visible="false">
      <div ref={ringRef} className="moon-cursor-ring">
        <span ref={labelRef} className="moon-cursor-label" />
      </div>
      <div ref={dotRef} className="moon-cursor-dot" />
    </div>
  );
}
