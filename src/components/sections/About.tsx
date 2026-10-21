import { site } from '@/config/site';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { InstagramLogo } from '@/components/brand/logos';
import { MoonMark } from '@/components/brand/MoonMark';

/** The director. His portrait is a placeholder until he shares one (never AI-generated). */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="about pb-[var(--section-y)]">
      <div className="about-panel">
        <div className="about-left">
          <SectionLabel n={7}>The director</SectionLabel>
          <h2 id="about-title" className="about-name font-display" data-reveal="lines">
            Dhiraj Pawar
          </h2>
          <svg className="about-swash" viewBox="0 0 320 40" aria-hidden="true" focusable="false">
            <path d="M6 30 C 70 6, 150 4, 214 18 S 300 34, 314 12" data-about-swash pathLength={1} />
          </svg>
          <div className="about-portrait" role="img" aria-label="Portrait of Dhiraj Pawar, coming soon">
            <MoonMark className="size-7 text-ink/20" />
            <span className="text-small text-ink-soft">Portrait coming soon</span>
          </div>
          <div className="about-circle">
            <div className="about-circle-disc" data-reveal="media">
              <SmartImage
                id="about-hands"
                alt="A filmmaker’s hands on a cinema camera at a wedding"
                sizes="(min-width: 64rem) 36vw, 86vw"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
        <div className="about-right">
          <div data-reveal="fade">
            <h3 className="font-display text-h3">Behind every frame</h3>
            <p className="mt-3 text-body">
              Dhiraj started Once in a Blue Moon in Nashik in {site.foundingYear}. He still shoots and edits the films himself,
              and with his team covers the photographs too: candid and traditional, at home and wherever you say yes.
            </p>
          </div>
          <div data-reveal="fade">
            <h3 className="font-display text-h3">A filmmaker who teaches</h3>
            <p className="mt-3 text-body">
              When he isn’t at a wedding, he teaches other filmmakers how to tell love stories: in Malvan on the Kokan coast in
              2025, and in the valleys of Himachal Pradesh this year. The style stays the same: fun, classy and natural, real
              feeling first.
            </p>
          </div>
          <a
            href={site.socials.founderInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            data-reveal="fade"
          >
            Follow @{site.socials.founderInstagramHandle}
            <span className="btn-moon btn-moon-paper">
              <InstagramLogo className="size-5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
