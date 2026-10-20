import { reviews } from '@/content/reviews';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * Three slips, fanned like notes tucked into a wedding card. These are SAMPLE texts (no real reviews were
 * found), and each slip says so on the page.
 */
export function KindWords() {
  return (
    <section id="kind-words" aria-labelledby="kind-title" className="kind">
      <div className="page kind-inner">
        <div className="max-w-[40rem]">
          <SectionLabel n={8}>Kind words</SectionLabel>
          <h2 id="kind-title" className="mt-5 text-h2" data-reveal="lines">
            In their words.
          </h2>
        </div>
        <ul className="kind-slips" data-kind-slips>
          {reviews.map((r, i) => (
            <li key={i} className={`kind-slip kind-slip-${i + 1}`} data-reveal="slip">
              <blockquote className="kind-quote">
                <p className="text-body text-ink">“{r.quote}”</p>
              </blockquote>
              <p className="tag-sample mt-5">Sample review · replace before launch</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
