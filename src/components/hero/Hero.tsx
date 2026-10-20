import { getImageProps } from 'next/image';
import { preload } from 'react-dom';
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

/**
 * While a desktop reel exists, the still and the reel share one crop (scale about an origin) so the
 * crossfade is seamless and the reel's bottom-right corner (it carries a visible generator mark) stays
 * out of frame. Remove when a clean reel is supplied.
 */
const REEL_CROP = { scale: 1.22, x: 0.25, y: 0.3 };

const DESKTOP = '(min-width: 64rem)';
const MOBILE = '(max-width: 63.99rem)';
const cropped = (v: number, o: number) => o + (v - o) * REEL_CROP.scale;

function HeroPicture() {
  const desktop = imageManifest['hero-desktop'] ?? imageManifest['hero-mobile'];
  const mobile = imageManifest['hero-mobile'] ?? imageManifest['hero-desktop'];
  if (!desktop || !mobile) {
    // No photograph yet: the aperture shows a literal blue moon, which reads as intentional.
    return <div role="img" aria-label="A blue moon (the hero photograph is coming soon)" className="hero-moon-fill absolute inset-0" />;
  }
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ alt: ALT, sizes: '100vw', quality: 75, src: desktop.src, width: desktop.width, height: desktop.height });
  // Phones: q60 (a third lighter, visually identical at phone size) and nothing wider than 1080w, so a 3×
  // screen doesn't pull a 1440w file for a 390px-wide window.
  const {
    props: { srcSet: mobileAll, ...img },
  } = getImageProps({ alt: ALT, sizes: '100vw', quality: 60, src: mobile.src, width: mobile.width, height: mobile.height });
  const mobileSrcSet = mobileAll
    ?.split(', ')
    .filter((c) => Number(c.slice(c.lastIndexOf(' ') + 1, -1)) <= 1080)
    .join(', ');
  // Preload each art-directed source from <head>, ahead of the scripts, so the photo (the LCP) is already
  // in hand when the first frame paints. Same srcset/sizes as the <source> elements, so the request is reused.
  preload(img.src, { as: 'image', imageSrcSet: mobileSrcSet, imageSizes: '100vw', fetchPriority: 'high', media: MOBILE });
  if (desktopSrcSet) preload(desktopSrcSet.split(' ')[0], { as: 'image', imageSrcSet: desktopSrcSet, imageSizes: '100vw', fetchPriority: 'high', media: DESKTOP });
  return (
    <picture>
      <source media={DESKTOP} srcSet={desktopSrcSet} sizes="100vw" />
      <source media={MOBILE} srcSet={mobileSrcSet} sizes="100vw" />
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
  const subject = heroReel.desktop
    ? { x: cropped(HERO_SUBJECT.x, REEL_CROP.x), y: cropped(HERO_SUBJECT.y, REEL_CROP.y) }
    : HERO_SUBJECT;
  const cropStyle = heroReel.desktop
    ? ({ '--crop-s': REEL_CROP.scale, '--crop-x': `${REEL_CROP.x * 100}%`, '--crop-y': `${REEL_CROP.y * 100}%` } as React.CSSProperties)
    : undefined;
  return (
    <section id="top" aria-labelledby="hero-title" className="hero relative">
      <div className="hero-track" data-hero-track>
        <div className="hero-stage">
          <div className="hero-media" data-hero-media>
            <div className="hero-zoom" style={{ '--fx': subject.x, '--fy': subject.y } as React.CSSProperties}>
              <div className="hero-scroll" data-hero-scroll>
                <div className="hero-crop" style={cropStyle}>
                  <div
                    className="hero-still hero-drift"
                    data-reel-desktop={heroReel.desktop ? 'true' : undefined}
                    data-reel-mobile={heroReel.mobile ? 'true' : undefined}
                  >
                    <HeroPicture />
                  </div>
                  {hasVideo ? <HeroVideo desktop={heroReel.desktop} mobile={heroReel.mobile} /> : null}
                </div>
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
                <span>
                  Check your date<span className="hero-cta-tail"> on WhatsApp</span>
                </span>
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
