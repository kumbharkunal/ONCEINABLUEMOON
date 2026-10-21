import { faqs } from '@/content/faqs';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { JsonLd } from '@/components/seo/JsonLd';
import { Crescent } from '@/components/brand/MoonMark';
import { faqJsonLd } from '@/lib/seo';

/** Questions filed like index cards, each with a half-moon tab. Native <details>: no JS needed. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="faq pb-[var(--section-y)]">
      <div className="page">
        <div className="faq-divider" aria-hidden="true">
          <Crescent className="size-4 text-gold" />
        </div>
        <div className="mx-auto max-w-[62rem]">
          <SectionLabel n={6}>Questions</SectionLabel>
          <h2 id="faq-title" className="mt-5 text-h2" data-reveal="lines">
            Good questions.
          </h2>
          <div className="faq-stack mt-14" data-reveal="rise">
            {faqs.map((f, i) => (
              <details key={f.q} name="faq" className="faq-item faq-card" open={i === 0} style={{ '--i': i } as React.CSSProperties}>
                <summary className="faq-summary">
                  <span className="faq-tab text-small">{f.topic}</span>
                  <span className="faq-q font-display">{f.q}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </summary>
                <p className="faq-a text-body">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <JsonLd data={faqJsonLd()} />
    </section>
  );
}
