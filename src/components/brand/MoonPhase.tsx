import { moonLitPath } from '@/lib/moon-path';
import { cn } from '@/lib/cn';

type Props = {
  /** 0 = new, 0.5 = full, 1 = new. */
  phase: number;
  className?: string;
  lit?: string;
  shadow?: string;
  ring?: string;
};

/** A moon drawn with its true terminator (half-ellipse), for labels, steps and markers. Decorative. */
// taste-skill-ignore (next line): `shadow` is the colour of the moon's dark side, not a box shadow.
export function MoonPhase({ phase, className, lit = 'currentColor', shadow = 'transparent', ring }: Props) { // taste-skill-ignore
  const r = 10;
  return (
    <svg viewBox="0 0 24 24" className={cn('shrink-0', className)} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r={r} fill={shadow} stroke={ring ?? 'none'} strokeWidth={ring ? 1 : 0} />
      <path d={moonLitPath(phase, r, 12, 12)} fill={lit} />
    </svg>
  );
}
