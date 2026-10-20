import { steps } from '@/content/process';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProcessAccordion } from '@/components/sections/ProcessAccordion';

/** Four steps, tinted from new moon to full moon. */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="process section-y">
      <div className="page">
        <div className="grid-page gap-y-6">
          <div className="col-span-4 lg:col-span-5">
            <SectionLabel n={5}>How it works</SectionLabel>
            <h2 id="process-title" className="mt-5 text-h2" data-reveal="lines">
              From hello to your album.
            </h2>
          </div>
          <p className="col-span-4 max-w-[40ch] self-end text-body lg:col-span-5 lg:col-start-8" data-reveal="fade">
            It starts with a message and ends with your story, delivered in about four weeks. Here is everything in between.
          </p>
        </div>
        <ProcessAccordion steps={steps} />
      </div>
    </section>
  );
}
