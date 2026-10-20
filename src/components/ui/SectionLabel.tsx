import { MoonPhase } from '@/components/brand/MoonPhase';
import { labelPhase } from '@/lib/moon-path';
import { cn } from '@/lib/cn';

export const LABEL_TOTAL = 10;

type Props = {
  n: number;
  children: React.ReactNode;
  /** 'night' for the Films band. */
  tone?: 'day' | 'night';
  className?: string;
};

/**
 * Numbered section label. The page is a lunar sequence: label 01 is a thin crescent and
 * label 10 (Contact) is the full blue moon.
 */
export function SectionLabel({ n, children, tone = 'day', className }: Props) {
  const night = tone === 'night';
  return (
    <p
      data-reveal="label"
      className={cn('flex items-center gap-2.5 text-small', night ? 'text-moon-glow' : 'text-ink-soft', className)}
    >
      <MoonPhase
        phase={labelPhase(n, LABEL_TOTAL)}
        className="size-[1.125rem]"
        lit={night ? 'var(--color-moon-glow)' : 'var(--color-moon)'}
        shadow={night ? 'var(--color-night-raised)' : 'var(--color-sand)'}
      />
      <span className={cn('font-display text-body italic leading-none', night ? 'text-paper' : 'text-ink')}>
        {String(n).padStart(2, '0')}
      </span>
      <span>{children}</span>
    </p>
  );
}
