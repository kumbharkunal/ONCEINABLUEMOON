import Image from 'next/image';
import { PlayIcon } from '@phosphor-icons/react/dist/ssr/Play';
import { featuredFilm, otherFilms, youtubeThumb, youtubeWatch, type Film } from '@/content/films';
import { site } from '@/config/site';
import { YouTubeLogo } from '@/components/brand/logos';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { JsonLd } from '@/components/seo/JsonLd';
import { FilmDialog } from '@/components/sections/FilmDialog';
import { filmsJsonLd } from '@/lib/seo';
import { cn } from '@/lib/cn';

function PlayMoon({ className }: { className?: string }) {
  return (
    <span className={cn('film-play', className)} aria-hidden="true">
      <PlayIcon weight="fill" className="size-[38%]" />
    </span>
  );
}

function FilmCard({ film, featured = false, className }: { film: Film; featured?: boolean; className?: string }) {
  return (
    <a
      href={youtubeWatch(film.id)}
      target="_blank"
      rel="noopener noreferrer"
      data-film={film.id}
      data-film-title={`${film.couple}, ${film.kind}`}
      data-cursor="play"
      className={cn('film group block', featured && 'film-featured', className)}
      data-reveal="rise"
    >
      <span className="film-frame" data-reveal-media>
        <Image
          src={youtubeThumb(film.id)}
          alt=""
          fill
          sizes={featured ? '(min-width: 64rem) 62vw, 92vw' : '(min-width: 64rem) 30vw, 80vw'}
          quality={60}
          className="film-thumb object-cover"
        />
        <PlayMoon />
      </span>
      <span className="film-meta">
        <span className={cn('film-name font-display text-paper', featured ? 'text-h3' : 'text-[1.375rem] leading-tight')}>
          {film.couple}
        </span>
        <span className="film-duration text-small tabular-nums text-gold-light">{film.duration}</span>
        <span className="film-kind text-small text-gold-light">
          {film.kind}, {film.place}
        </span>
      </span>
      <span className="sr-only">Play the film (opens a player)</span>
    </a>
  );
}

/** The one dark band: films are watched in the dark, and this is where the moon rises. */
export function Films() {
  return (
    <section id="films" aria-labelledby="films-title" className="films on-night">
      <div className="films-band">
        <div className="films-moon" aria-hidden="true" data-films-moon />
        <div className="page relative">
          <div className="grid-page items-end gap-y-6">
            <div className="col-span-4 lg:col-span-7">
              <SectionLabel n={3} tone="night">
                Films
              </SectionLabel>
              <h2 id="films-title" className="mt-5 text-h2 text-paper" data-reveal="lines">
                Watch it the way it felt.
              </h2>
            </div>
            <p className="col-span-4 max-w-[36ch] text-body text-gold-light lg:col-span-4 lg:col-start-9" data-reveal="fade">
              Real couples, real places, from Bhimashankar to Thailand. Press play.
            </p>
          </div>

          <div className="films-featured mt-14 lg:mt-20">
            <FilmCard film={featuredFilm} featured />
            <p className="films-featured-note text-body text-gold-light" data-reveal="fade">
              {featuredFilm.description} Shot and edited by Dhiraj.
            </p>
          </div>

          <ul className="films-grid mt-16 lg:mt-24" data-swipe-row>
            {otherFilms.map((film, i) => (
              <li key={film.id} className={`films-cell films-cell-${i + 1}`}>
                <FilmCard film={film} />
              </li>
            ))}
          </ul>

          <a
            href={site.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-16 inline-flex min-h-11 items-center gap-3 text-body text-paper lg:mt-24"
          >
            <YouTubeLogo className="h-6 w-auto" />
            <span className="link">More films on YouTube</span>
          </a>
        </div>
      </div>
      <FilmDialog />
      <JsonLd data={filmsJsonLd()} />
    </section>
  );
}
