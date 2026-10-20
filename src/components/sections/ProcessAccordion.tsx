'use client';

import { useId, useState } from 'react';
import type { Step } from '@/content/process';
import { MoonPhase } from '@/components/brand/MoonPhase';
import { cn } from '@/lib/cn';

const phases = [0.015, 0.16, 0.27, 0.5];

/**
 * Horizontal accordion on wide screens (one stage open, the rest are slivers), vertical on phones.
 * Order is carried by tint: the night lightening to a full moon.
 */
export function ProcessAccordion({ steps }: { steps: Step[] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  return (
    <ol className="process-row mt-14 lg:mt-20" data-open={open} data-reveal="rise">
      {steps.map((step, i) => {
        const isOpen = open === i;
        const dark = i < 2;
        return (
          <li key={step.title} className={cn('process-step', `process-step-${i + 1}`, isOpen && 'is-open', dark ? 'text-paper' : 'text-ink')}>
            <h3 className="m-0">
              <button
                type="button"
                id={`${uid}-tab-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-panel-${i}`}
                onClick={() => setOpen(i)}
                className="process-trigger"
              >
                <MoonPhase
                  phase={phases[i]}
                  className="size-6 shrink-0"
                  lit={dark ? 'var(--color-paper)' : 'var(--color-deep-moon)'}
                  shadow={dark ? 'rgb(251 248 242 / 0.18)' : 'rgb(46 60 80 / 0.16)'}
                />
                <span className="process-name font-display">{step.title}</span>
              </button>
            </h3>
            <div
              id={`${uid}-panel-${i}`}
              role="region"
              aria-labelledby={`${uid}-tab-${i}`}
              className="process-panel"
              inert={!isOpen}
            >
              <div className="process-panel-inner">
                <p className="process-body text-body">{step.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
