/**
 * SVG path for the lit part of the moon at a given phase.
 * phase: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter, 1 = new.
 * The lit limb is on the right while waxing, on the left while waning.
 */
export function moonLitPath(phase: number, r: number, cx: number, cy: number): string {
  const p = ((phase % 1) + 1) % 1;
  const waxing = p < 0.5;
  const k = Math.cos(2 * Math.PI * p);
  const rx = Math.abs(k) * r;
  const crescent = k > 0;
  const limbSweep = waxing ? 1 : 0;
  const termSweep = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0;
  const f = (n: number) => Math.round(n * 1000) / 1000;
  return `M ${f(cx)} ${f(cy - r)} A ${f(r)} ${f(r)} 0 0 ${limbSweep} ${f(cx)} ${f(cy + r)} A ${f(rx)} ${f(r)} 0 0 ${termSweep} ${f(cx)} ${f(cy - r)} Z`;
}

/** Phase for section label n of total (01 = thin crescent … last = full moon). */
export function labelPhase(n: number, total: number): number {
  const start = 0.05;
  return start + ((n - 1) / Math.max(total - 1, 1)) * (0.5 - start);
}
