/**
 * First-visit intro (CSS only, 0.9 s): a chandrakor fills into a full blue moon, then grows and dissolves
 * into the hero, which is already painted underneath (so it never delays LCP). Shown only when the
 * inline head script sets html[data-intro="play"]; never under reduced motion.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="grid justify-items-center gap-5">
        <svg className="intro-moon size-[88px] overflow-visible" viewBox="0 0 100 100">
          <defs>
            <mask id="intro-mask" maskUnits="userSpaceOnUse" x="-60" y="-160" width="220" height="320">
              <rect x="-60" y="-160" width="220" height="320" fill="#fff" />
              <circle className="intro-shadow" cx="50" cy="35" r="41" fill="#000" />
            </mask>
          </defs>
          <circle className="intro-disc" cx="50" cy="54" r="40" mask="url(#intro-mask)" />
        </svg>
        <p className="intro-word font-display text-h3 italic text-ink">Once in a Blue Moon</p>
      </div>
    </div>
  );
}
