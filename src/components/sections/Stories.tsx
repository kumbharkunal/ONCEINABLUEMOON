import { stories } from '@/content/stories';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { cn } from '@/lib/cn';

/**
 * A wedding day in chapters, morning to night. Desktop: pinned horizontal track while a small moon rises
 * along an arc. Phones (and reduced motion): a native swipe carousel with snap points.
 */
export function Stories() {
  return (
    <section id="stories" aria-labelledby="stories-title" className="stories">
      <div className="stories-pin" data-stories-pin>
        <div className="page stories-head">
          <SectionLabel n={2}>Stories</SectionLabel>
          <h2 id="stories-title" className="mt-5 text-h2" data-reveal="lines">
            From haldi to the last dance.
          </h2>
          <p className="stories-intro mt-5 max-w-[34ch] text-body" data-reveal="fade">
            A Maharashtrian wedding is a day of chapters. We stay for all of them.
          </p>
        </div>

        <div className="stories-viewport" data-stories-viewport tabIndex={0} aria-label="Wedding chapters, scroll sideways">
          <ol className="stories-track" data-stories-track>
            {stories.map((s, i) => (
              <li key={s.id} className={cn('story', `story-${s.shape}`, i % 2 === 1 && 'story-low')}>
                <figure>
                  <div className="story-frame arch" data-story-frame>
                    <SmartImage
                      id={s.image}
                      alt={s.alt}
                      sizes="(min-width: 64rem) 40vw, 82vw"
                      className="story-img absolute inset-0"
                      imgClassName="story-img-inner"
                    />
                  </div>
                  <figcaption className="story-cap">
                    <span className="text-small text-ink-soft">{s.when}</span>
                    <h3 className="font-display text-h3">{s.title}</h3>
                    <p className="max-w-[30ch] text-body text-ink">{s.line}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
            <li className="story-end">
              <p className="font-display text-h3 italic">Every chapter, kept.</p>
              <a href="#films" className="link mt-4 inline-flex min-h-11 items-center text-body">
                Now watch a few of them
              </a>
            </li>
          </ol>
        </div>

        <div className="stories-sky" aria-hidden="true">
          <svg className="stories-arc" viewBox="0 0 1000 120" preserveAspectRatio="none" focusable="false">
            <path d="M 0 112 Q 500 -40 1000 112" vectorEffect="non-scaling-stroke" data-stories-arc />
          </svg>
          <span className="stories-arc-moon" data-stories-moon />
        </div>
      </div>
    </section>
  );
}
