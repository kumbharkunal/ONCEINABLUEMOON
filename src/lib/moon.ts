// Moon phases after Jean Meeus, "Astronomical Algorithms" (2nd ed.), chapter 49: true new/full moon
// times accurate to a few minutes. Dates are judged in India Standard Time (UTC+5:30).
// Self-contained (no imports) so `node --test` can load it directly.

const DELTA_T_DAYS = 69.5 / 86400; // ΔT (TT − UT), ~69 s in the 2020s
const IST_MS = 5.5 * 3600 * 1000;
const DAY_MS = 86400000;

const rad = (deg: number) => ((((deg % 360) + 360) % 360) * Math.PI) / 180;

/** JDE (Terrestrial Time) of a true new moon (integer k) or full moon (k + 0.5). */
export function phaseJde(k: number, full: boolean): number {
  const T = k / 1236.85;
  const jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T ** 2 - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
  const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T ** 2 - 0.00000011 * T ** 3);
  const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T ** 2 + 0.00001238 * T ** 3 - 0.000000058 * T ** 4);
  const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T ** 2 - 0.00000227 * T ** 3 + 0.000000011 * T ** 4);
  const Om = rad(124.7746 - 1.56375588 * k + 0.0020672 * T ** 2 + 0.00000215 * T ** 3);
  const s = Math.sin;
  let c = full
    ? -0.40614 * s(Mp) + 0.17302 * E * s(M) + 0.01614 * s(2 * Mp) + 0.01043 * s(2 * F) + 0.00734 * E * s(Mp - M) -
      0.00515 * E * s(Mp + M) + 0.00209 * E * E * s(2 * M) - 0.00111 * s(Mp - 2 * F) - 0.00057 * s(Mp + 2 * F) +
      0.00056 * E * s(2 * Mp + M) - 0.00042 * s(3 * Mp) + 0.00042 * E * s(M + 2 * F) + 0.00038 * E * s(M - 2 * F) -
      0.00024 * E * s(2 * Mp - M) - 0.00017 * s(Om) - 0.00007 * s(Mp + 2 * M)
    : -0.4072 * s(Mp) + 0.17241 * E * s(M) + 0.01608 * s(2 * Mp) + 0.01039 * s(2 * F) + 0.00739 * E * s(Mp - M) -
      0.00514 * E * s(Mp + M) + 0.00208 * E * E * s(2 * M) - 0.00111 * s(Mp - 2 * F) - 0.00057 * s(Mp + 2 * F) +
      0.00056 * E * s(2 * Mp + M) - 0.00042 * s(3 * Mp) + 0.00042 * E * s(M + 2 * F) + 0.00038 * E * s(M - 2 * F) -
      0.00024 * E * s(2 * Mp - M) - 0.00017 * s(Om) - 0.00007 * s(Mp + 2 * M);
  c +=
    0.00004 * s(2 * Mp - 2 * F) + 0.00004 * s(3 * M) + 0.00003 * s(Mp + M - 2 * F) + 0.00003 * s(2 * Mp + 2 * F) -
    0.00003 * s(Mp + M + 2 * F) + 0.00003 * s(Mp - M + 2 * F) - 0.00002 * s(Mp - M - 2 * F) - 0.00002 * s(3 * Mp + M) +
    0.00002 * s(4 * Mp);
  const A = [
    299.77 + 0.107408 * k - 0.009173 * T ** 2,
    251.88 + 0.016321 * k,
    251.83 + 26.651886 * k,
    349.42 + 36.412478 * k,
    84.66 + 18.206239 * k,
    141.74 + 53.303771 * k,
    207.14 + 2.453732 * k,
    154.84 + 7.30686 * k,
    34.52 + 27.261239 * k,
    207.19 + 0.121824 * k,
    291.34 + 1.844379 * k,
    161.72 + 24.198154 * k,
    239.56 + 25.513099 * k,
    331.55 + 3.592518 * k,
  ];
  const W = [0.000325, 0.000165, 0.000164, 0.000126, 0.00011, 0.000062, 0.00006, 0.000056, 0.000047, 0.000042, 0.00004, 0.000037, 0.000035, 0.000023];
  for (let i = 0; i < A.length; i++) c += W[i] * Math.sin(rad(A[i]));
  return jde + c;
}

/** Unix ms (UT) of a phase. */
export const phaseMs = (k: number, full: boolean) => (phaseJde(k, full) - DELTA_T_DAYS - 2440587.5) * DAY_MS;

/** Calendar date in IST for a UT instant. */
export function istDate(ms: number) {
  const d = new Date(ms + IST_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

const sameDay = (a: { y: number; m: number; d: number }, b: { y: number; m: number; d: number }) =>
  a.y === b.y && a.m === b.m && a.d === b.d;

/** Lunation index k of the last new moon at or before `ms`. */
function newMoonIndexBefore(ms: number): number {
  const years = (ms / DAY_MS + 2440587.5 - 2451545.0) / 365.25;
  let k = Math.floor(years * 12.3685);
  while (phaseMs(k, false) > ms) k -= 1;
  while (phaseMs(k + 1, false) <= ms) k += 1;
  return k;
}

export type MoonInfo = {
  /** 0 = new … 0.5 = full … 1 = new. */
  phase: number;
  /** Lit fraction of the disc, 0–1. */
  illumination: number;
  waxing: boolean;
  name: string;
  isNew: boolean;
  isFull: boolean;
  isBlue: boolean;
};

/** The moon on a given IST date (yyyy-mm-dd), evaluated at 8 pm IST. */
export function moonOn(ymd: string): MoonInfo | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const day = { y, m: mo, d };
  const at = Date.UTC(y, mo - 1, d, 14, 30); // 20:00 IST
  const k = newMoonIndexBefore(at);
  const prevNew = phaseMs(k, false);
  const nextNew = phaseMs(k + 1, false);
  const full = phaseMs(k + 0.5, true);
  const phase = (at - prevNew) / (nextNew - prevNew);
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  const isFull = sameDay(istDate(full), day);
  const isNew = sameDay(istDate(prevNew), day) || sameDay(istDate(nextNew), day);
  let isBlue = false;
  if (isFull) {
    const prevFull = istDate(phaseMs(k - 0.5, true));
    isBlue = prevFull.y === y && prevFull.m === mo;
  }

  let name: string;
  if (isNew) name = 'New moon';
  else if (isFull) name = 'Full moon';
  else if (phase < 0.22) name = 'Waxing crescent';
  else if (phase < 0.28) name = 'First quarter';
  else if (phase < 0.5) name = 'Waxing gibbous';
  else if (phase < 0.72) name = 'Waning gibbous';
  else if (phase < 0.78) name = 'Last quarter';
  else name = 'Waning crescent';

  return { phase, illumination, waxing: phase < 0.5, name, isNew, isFull, isBlue };
}

/** The next blue moon (second full moon in an IST calendar month) after `ms`. */
export function nextBlueMoon(ms: number): { ms: number; y: number; m: number; d: number } | null {
  let k = newMoonIndexBefore(ms) - 1;
  let prev = istDate(phaseMs(k + 0.5, true));
  for (let i = 0; i < 120; i++) {
    k += 1;
    const t = phaseMs(k + 0.5, true);
    const cur = istDate(t);
    if (t > ms && cur.y === prev.y && cur.m === prev.m) return { ms: t, ...cur };
    prev = cur;
  }
  return null;
}

/** Today's date in IST as yyyy-mm-dd. */
export function todayIst(nowMs: number): string {
  const { y, m, d } = istDate(nowMs);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** e.g. "Sun, 14 February 2027" (deterministic, no locale data needed). */
export function formatYmd(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return ymd;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const wd = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  return `${WEEKDAYS[wd]}, ${d} ${MONTHS[mo - 1]} ${y}`;
}

export const formatDayMonthYear = (p: { y: number; m: number; d: number }) => `${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
