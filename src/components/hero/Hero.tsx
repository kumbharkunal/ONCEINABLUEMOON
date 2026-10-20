import { getImageProps } from 'next/image';
import { imageManifest } from '@/generated/images';
import { heroReel } from '@/generated/media';
import { Crescent } from '@/components/brand/MoonMark';
import { WhatsAppLogo } from '@/components/brand/logos';
import { HeroVideo } from '@/components/hero/HeroVideo';
import { heroMessage, waLink } from '@/lib/whatsapp';

const ALT =
  'A Maharashtrian bride in a green Paithani saree and pearl mundavalya laughing with her groom at dusk above vineyards near Nashik';

/**
 * Where the subject (the couple's faces) sits in the desktop hero photo, as fractions of its width/height.
 * At rest the moon aperture frames this point; scrolling pulls back to the full photograph.
 * Update it if the hero photograph changes.
 */
const HERO_SUBJECT = { x: 0.53, y: 0.31 };

function HeroPicture() {
  const desktop = imageManifest['hero-desktop'] ?? imageManifest['hero-mobile'];
  const mobile = imageManifest['hero-mobile'] ?? imageManifest['hero-desktop'];
  if (!desktop || !mobile) {
    // No photograph yet: the aperture shows a literal blue moon, which reads as intentional.
    return <div role="img" aria-label="A blue moon (the hero photograph is coming soon)" className="hero-moon-fill absolute inset-0" />;
  }
  const common = { alt: ALT, sizes: '100vw', quality: 75 as const };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height });
  return (
    <picture>
      <source media="(min-width: 64rem)" srcSet={desktopSrcSet} sizes="100vw" />
      <source media="(max-width: 63.99rem)" srcSet={mobileSrcSet} sizes="100vw" />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in the spread props */}
      <img
        {...img}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={{ backgroundColor: desktop.color }}
      />
    </picture>
  );
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />
    </svg>
  );
}

export function Hero() {
  const hasVideo = Boolean(heroReel.desktop || heroReel.mobile);
  return (
    <section id="top" aria-labelledby="hero-title" className="hero relative">
      <div className="hero-track" data-hero-track>
        <div className="hero-stage">
          <div className="hero-media" data-hero-media>
            <div className="hero-zoom" style={{ '--fx': HERO_SUBJECT.x, '--fy': HERO_SUBJECT.y } as React.CSSProperties}>
              <div className="hero-scroll" data-hero-scroll>
                <div
                  className="hero-still hero-drift"
                  data-reel-desktop={heroReel.desktop ? 'true' : undefined}
                  data-reel-mobile={heroReel.mobile ? 'true' : undefined}
                >
                  <HeroPicture />
                </div>
                {hasVideo ? <HeroVideo desktop={heroReel.desktop} mobile={heroReel.mobile} /> : null}
                <div className="hero-ripple-slot" data-hero-ripple />
              </div>
            </div>
          </div>

          <div className="hero-ring" data-hero-ring aria-hidden="true">
            <svg viewBox="0 0 100 100" className="size-full overflow-visible">
              <circle cx="50" cy="50" r="49.6" pathLength={1} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="hero-scrim" aria-hidden="true" />

          <div className="hero-copy" data-hero-copy>
            <h1 id="hero-title" className="hero-title font-display">
              <span className="line-mask">
                <span className="hero-line" style={{ '--i': 0 } as React.CSSProperties}>
                  For love that comes
                </span>
              </span>
              <span className="line-mask">
                <span className="hero-line italic" style={{ '--i': 1 } as React.CSSProperties}>
                  once in a blue moon.
                </span>
              </span>
            </h1>
            <p className="hero-sub">
              Wedding photography and cinematic films from Nashik, for couples who want to remember exactly how it felt.
            </p>
            <div className="hero-ctas">
              <a href={waLink(heroMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-primary hero-cta-primary">
                Check your date on WhatsApp
                <span className="btn-moon btn-moon-paper">
                  <WhatsAppLogo className="size-5" />
                </span>
              </a>
              <a href="#films" className="hero-cta-films link-reverse inline-flex min-h-11 items-center gap-2">
                <PlayGlyph className="size-3.5" />
                Watch our films
              </a>
            </div>
          </div>

          <div className="hero-cue" aria-hidden="true">
            <Crescent className="hero-cue-moon size-4" />
            <span>Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
