import { cn } from '@/lib/cn';

/**
 * The studio mark: a chandrakor (horns-up crescent) with its bindi dot.
 * Crescent = outer circle (16, 18.5, r 10.5) minus inner circle (16, 15, r 9.6).
 */
export const CRESCENT_PATH = 'M6.436 14.166A10.5 10.5 0 1 0 25.564 14.166A9.6 9.6 0 1 1 6.436 14.166Z';

type Props = {
  className?: string;
  /** Accessible name; omit for a decorative mark. */
  title?: string;
  /** Draw the bindi dot above the crescent. */
  dot?: boolean;
};

export function MoonMark({ className, title, dot = true }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={CRESCENT_PATH} fill="currentColor" />
      {dot ? <circle cx="16" cy="7.4" r="2.3" fill="currentColor" /> : null}
    </svg>
  );
}

/** Small crescent used as a separator glyph (instead of a middle dot). */
export function Crescent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('inline-block shrink-0', className)} aria-hidden="true" focusable="false">
      <path d={CRESCENT_PATH} fill="currentColor" />
    </svg>
  );
}
