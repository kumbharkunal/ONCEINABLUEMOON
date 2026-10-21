import { cn } from '@/lib/cn';

/*
 * The studio's own logo (as on their Instagram, @onceinabluemoon.co.in): "ONCE / IN A / BLUE MOON" in
 * condensed antique-gold capitals inside a thin gold frame on black, with ® and the line
 * "Emotions through storys." (spelled as printed on the logo).
 *
 * Redrawn as SVG so it stays crisp at every size. Bebas Neue stands in for their typeface, and every line is
 * fitted to the width it has in the original (textLength), so the lockup keeps its proportions even before
 * the font arrives. Replace with the studio's master artwork (SVG) when they send it.
 */

type LogoProps = {
  /** Unique per page: prefixes the filter id. */
  id: string;
  className?: string;
  /** Accessible name; omit when the logo sits inside a labelled link. */
  title?: string;
  /** The worn, printed texture of the original (use on large renders). */
  worn?: boolean;
};

const FRAME = 'M49 41H191V201H49Z';

/** The full, stacked logo with its tagline (footer, intro). */
export function BrandLogo({ id, className, title, worn = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={cn('brand-logo', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {worn ? (
        <defs>
          <filter id={`${id}-worn`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            {/* Coarse, sparse wear (like the scuffed print of the original), not a fine glitter. */}
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="11" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.8 3.15" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" />
          </filter>
        </defs>
      ) : null}
      <rect width="240" height="240" className="brand-logo-ground" />
      <g className="brand-logo-gold" filter={worn ? `url(#${id}-worn)` : undefined}>
        <path d={FRAME} pathLength={1} className="brand-logo-frame" data-logo-frame />
        <text x="120" y="96" textAnchor="middle" textLength="120" fontSize="63" className="brand-logo-type">
          ONCE
        </text>
        <text x="120" y="154" textAnchor="middle" textLength="122" fontSize="63" className="brand-logo-type">
          IN A
        </text>
        <text x="120" y="189" textAnchor="middle" textLength="116" fontSize="27" className="brand-logo-type">
          BLUE MOON
        </text>
        <text x="194" y="45" fontSize="9" className="brand-logo-reg">
          ®
        </text>
      </g>
      <text x="120" y="223" textAnchor="middle" fontSize="12" className="brand-logo-tagline">
        “Emotions through storys.”
      </text>
    </svg>
  );
}

/** The same lockup on one line, as a small black label (navigation). */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 36" className={cn('brand-wordmark', className)} aria-hidden="true" focusable="false">
      <rect width="200" height="36" className="brand-logo-ground" />
      <path d="M3.5 3.5H196.5V32.5H3.5Z" className="brand-wordmark-frame" />
      <text x="100" y="24.6" textAnchor="middle" textLength="170" fontSize="18" className="brand-logo-type brand-logo-gold">
        ONCE IN A BLUE MOON
      </text>
    </svg>
  );
}
