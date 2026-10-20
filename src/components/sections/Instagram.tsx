import type { ImageId } from '@/generated/images';
import { site } from '@/config/site';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { InstagramLogo } from '@/components/brand/logos';

const tiles: { id: ImageId; alt: string }[] = [
  { id: 'ig-haldi', alt: 'Haldi morning, turmeric and laughter' },
  { id: 'ig-mehendi', alt: 'Fresh mehendi and green bangles' },
  { id: 'ig-sangeet', alt: 'A couple dancing at their sangeet' },
  { id: 'ig-lagna', alt: 'The antarpat moment' },
  { id: 'ig-reception', alt: 'A couple walking among lanterns at night' },
  { id: 'ig-prewedding', alt: 'A pre-wedding walk through a vineyard' },
];

/** Six moons that link to the studio's Instagram. Tiles are placeholders until real posts are used. */
export function Instagram() {
  return (
    <section id="instagram" aria-labelledby="ig-title" className="instagram section-y">
      <div className="page grid-page gap-y-12">
        <div className="col-span-4 lg:col-span-4">
          <SectionLabel n={9}>Instagram</SectionLabel>
          <h2 id="ig-title" className="mt-5 flex flex-wrap items-center gap-x-3 font-display text-h3" data-reveal="lines">
            <InstagramLogo className="size-[0.9em]" />
            <span>@{site.socials.instagramHandle}</span>
          </h2>
          <p className="mt-4 max-w-[30ch] text-body" data-reveal="fade">
            Behind the scenes, new films, and the odd sunset over the vineyards.
          </p>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-8"
            data-reveal="fade"
          >
            Follow on Instagram
            <span className="btn-moon btn-moon-paper">
              <InstagramLogo className="size-5" />
            </span>
          </a>
        </div>
        <ul className="ig-grid col-span-4 lg:col-span-7 lg:col-start-6" data-ig-grid>
          {tiles.map((t) => (
            <li key={t.id} className="ig-cell">
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-tile"
                data-cursor="view"
                aria-label={`${t.alt}, on Instagram`}
              >
                <SmartImage id={t.id} alt="" sizes="(min-width: 64rem) 20vw, 42vw" quietPlaceholder className="absolute inset-0" />
                <span className="ig-tile-mark" aria-hidden="true">
                  <InstagramLogo className="size-7" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
