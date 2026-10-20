import { Fragment } from 'react';
import { Crescent } from '@/components/brand/MoonMark';

const words = ['Haldi', 'Mehendi', 'Sangeet', 'Lagna', 'Reception', 'Pre-wedding'];

/** Ceremony names drifting with the scroll (never on their own, so nothing moves unless you do). */
export function Marquee() {
  const run = (key: string) => (
    <span key={key} className="marquee-run">
      {words.map((w) => (
        <Fragment key={w}>
          <span>{w}</span>
          <Crescent className="marquee-moon" />
        </Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" data-marquee>
        {run('a')}
        {run('b')}
        {run('c')}
      </div>
    </div>
  );
}
