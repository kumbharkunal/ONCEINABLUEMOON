import { Fragment } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { moonLitPath } from '@/lib/moon-path';

/** Static phase of the background moon (the scroll scrub waxes it from a thin crescent). */
export const MANIFESTO_MOON_PHASE = 0.2;

function Dot({ id, alt }: { id: 'dot-antarpat' | 'dot-haldi' | 'dot-paithani'; alt: string }) {
  return <SmartImage as="span" id={id} alt={alt} sizes="80px" quietPlaceholder className="manifesto-dot" />;
}

/** Each word in its own span, so the scroll can light them one at a time without splitting text in the browser. */
function Words({ text }: { text: string }) {
  const words = text.split(' ');
  return words.map((word, i) => (
    <Fragment key={i}>
      <span className="mw">{word}</span>
      {i < words.length - 1 && ' '}
    </Fragment>
  ));
}

/** One statement, lit word by word as it passes; three moments sit inside it as small moons. */
export function Manifesto() {
  return (
    <section id="idea" aria-labelledby="idea-title" className="manifesto section-y relative overflow-clip">
      <svg className="manifesto-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-manifesto-moon>
        <circle cx="12" cy="12" r="10" className="manifesto-moon-ring" vectorEffect="non-scaling-stroke" />
        <path d={moonLitPath(MANIFESTO_MOON_PHASE, 10, 12, 12)} className="manifesto-moon-lit" data-manifesto-moon-lit />
      </svg>
      <div className="page relative">
        <h2 id="idea-title" className="sr-only">
          Why we are called Once in a Blue Moon
        </h2>
        <SectionLabel n={1} className="manifesto-label">
          The idea
        </SectionLabel>
        <p className="manifesto-text" data-manifesto-text>
          <Words text="Some moments come only once in a blue moon: the hush before the" />{' '}
          <span className="whitespace-nowrap">
            <Words text="antarpat" /> <Dot id="dot-antarpat" alt="A bride’s eyes above the antarpat cloth" />
          </span>{' '}
          <Words text="falls, Aaji laughing through the" />{' '}
          <span className="whitespace-nowrap">
            <Words text="haldi" /> <Dot id="dot-haldi" alt="A bride laughing during her haldi" />
            <span className="mw">,</span>
          </span>{' '}
          <Words text="the last light caught in a" />{' '}
          <span className="whitespace-nowrap">
            <Words text="Paithani’s" /> <Dot id="dot-paithani" alt="The gold zari border of a Paithani saree" />
          </span>{' '}
          <Words text="gold. We stay close, keep it fun, classy and natural, and give them back to you, frame by frame." />
        </p>
      </div>
    </section>
  );
}
