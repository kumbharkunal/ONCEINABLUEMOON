'use client';

import { useEffect, useRef } from 'react';
import { moonLitPath } from '@/lib/moon-path';
import { cn } from '@/lib/cn';

const START = 0.02;

/**
 * A tiny moon that waxes with page progress: new at the top, full at the bottom.
 * It turns blue when "Is your date still free?" comes into view. Decorative.
 */
export function MoonProgress({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const litRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let raf = 0;
    const contact = document.getElementById('contact');
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      litRef.current?.setAttribute('d', moonLitPath(START + p * (0.5 - START), 10, 12, 12));
      const blue = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      if (svgRef.current) svgRef.current.dataset.blue = String(blue);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 24 24" className={cn('moon-progress shrink-0', className)} aria-hidden="true" focusable="false" data-blue="false">
      <circle cx="12" cy="12" r="10" className="moon-progress-shadow" />
      <path ref={litRef} d={moonLitPath(START, 10, 12, 12)} className="moon-progress-lit" />
    </svg>
  );
}
