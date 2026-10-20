'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type Item = { id: string; detail: string; image: React.ReactNode };

/** The fixed moon frame for the Services index (desktop, fine pointers). Pure enhancement. */
export function ServicesPreview({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const list = document.querySelector<HTMLElement>('[data-svc-list]');
    if (!list) return;
    const pick = (target: EventTarget | null) => {
      const row = (target as Element | null)?.closest<HTMLElement>('[data-svc]');
      if (row?.dataset.svc) {
        setActive(row.dataset.svc);
        list.dataset.active = row.dataset.svc;
      }
    };
    const onOver = (e: Event) => pick(e.target);
    const onLeave = () => {
      delete list.dataset.active;
    };
    list.addEventListener('pointerover', onOver);
    list.addEventListener('focusin', onOver);
    list.addEventListener('pointerleave', onLeave);
    return () => {
      list.removeEventListener('pointerover', onOver);
      list.removeEventListener('focusin', onOver);
      list.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const current = items.find((i) => i.id === active);

  return (
    <div className="svc-preview" aria-hidden="true">
      <div className="svc-preview-moon">
        {items.map((item) => (
          <div key={item.id} className={cn('svc-preview-img', item.id === active && 'is-active')}>
            {item.image}
          </div>
        ))}
      </div>
      <p className="svc-preview-caption text-body text-ink">{current?.detail}</p>
    </div>
  );
}
