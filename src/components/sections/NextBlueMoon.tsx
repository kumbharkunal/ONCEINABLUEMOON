'use client';

import { useEffect, useState } from 'react';
import { formatDayMonthYear, nextBlueMoon } from '@/lib/moon';

/** "The next blue moon: …", computed in the browser so it never goes stale (the page is prerendered). */
export function NextBlueMoon() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const next = nextBlueMoon(Date.now());
    if (next) setLabel(formatDayMonthYear(next));
  }, []);
  if (!label) return null;
  return <span>The next blue moon rises on {label}.</span>;
}
