import { BrandLogo } from '@/components/brand/BrandLogo';

/**
 * First-visit intro (CSS only, 0.9 s): the studio's own logo settles in while its gold frame draws, then the
 * veil lifts into the hero, which is already painted underneath (so it never delays the LCP). Shown only
 * when the inline head script sets html[data-intro="play"]; never under reduced motion.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <BrandLogo id="intro-logo" worn className="intro-logo" />
    </div>
  );
}
