'use client';

import { useSyncExternalStore } from 'react';
import { formatDayMonthYear, nextBlueMoon, todayIst } from '@/lib/moon';

// The date is only known in the browser (the page is prerendered), so it is read like an external value:
// null on the server and during hydration, the real label right after. Cached per day.
const noSubscribe = () => () => {};
let cache: { day: string; label: string | null } | null = null;
function readLabel() {
  const now = Date.now();
  const day = todayIst(now);
  if (cache?.day !== day) {
    const next = nextBlueMoon(now);
    cache = { day, label: next ? formatDayMonthYear(next) : null };
  }
  return cache.label;
}
const serverLabel = () => null;

/** "The next blue moon rises on …", computed in the browser so it never goes stale. */
export function NextBlueMoon() {
  const label = useSyncExternalStore(noSubscribe, readLabel, serverLabel);
  if (!label) return null;
  return <span>The next blue moon rises on {label}.</span>;
}
