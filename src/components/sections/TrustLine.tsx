import { MoonPhase } from '@/components/brand/MoonPhase';

// Verified facts only (WedMeGood listing): since 2019, Nashik, photo + film, travels, ~4 weeks delivery.
const facts = [
  { small: 'Since', big: '2019' },
  { small: 'Based in', big: 'Nashik' },
  { small: 'Photography', big: '+ films' },
  { small: 'Travels for', big: 'weddings' },
  { small: 'Delivered in about', big: '4 weeks' },
];

/** The trust line as a row of moon discs: a heading pill, then five facts. */
export function TrustLine() {
  return (
    <section aria-labelledby="glance-title" className="trust page pb-[var(--section-y)]">
      <ul className="trust-row" data-reveal-group="trust">
        <li className="trust-head" data-reveal="pop">
          <h2 id="glance-title" className="font-display text-h3 text-paper">
            At a glance
          </h2>
        </li>
        {facts.map((f, i) => (
          <li key={f.big} className="trust-disc" data-reveal="pop">
            <MoonPhase
              phase={0.08 + i * 0.105}
              className="size-4 shrink-0"
              lit="var(--color-moon)"
              shadow="var(--color-sand)"
            />
            <span className="text-small text-ink-soft">{f.small}</span>
            <span className="font-display text-h3 text-ink">{f.big}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
