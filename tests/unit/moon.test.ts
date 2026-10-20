import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moonOn, nextBlueMoon, phaseMs, istDate, formatYmd } from '../../src/lib/moon.ts';

const MIN = 60 * 1000;
const near = (actual: number, expected: number, tolMin: number, label: string) =>
  assert.ok(Math.abs(actual - expected) <= tolMin * MIN, `${label}: off by ${((actual - expected) / MIN).toFixed(1)} min`);

// k for a date: (year - 2000) * 12.3685, rounded to the lunation we want.
const kFor = (y: number, m: number) => Math.round((y + (m - 0.5) / 12 - 2000) * 12.3685);

test('full moon 31 May 2026 08:45 UTC (published)', () => {
  const k = kFor(2026, 5);
  const candidates = [k - 1.5, k - 0.5, k + 0.5, k + 1.5].map((x) => phaseMs(x, true));
  const target = Date.UTC(2026, 4, 31, 8, 45);
  const best = candidates.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));
  near(best, target, 10, 'May 2026 full moon');
});

test('full moon 31 Dec 2028 16:48 UTC (published)', () => {
  const k = kFor(2028, 12);
  const candidates = [k - 1.5, k - 0.5, k + 0.5, k + 1.5].map((x) => phaseMs(x, true));
  const target = Date.UTC(2028, 11, 31, 16, 48);
  const best = candidates.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));
  near(best, target, 10, 'Dec 2028 full moon');
});

test('new moon of the 12 Aug 2026 total solar eclipse (~17:37 UTC)', () => {
  const k = kFor(2026, 8);
  const candidates = [k - 1, k, k + 1].map((x) => phaseMs(x, false));
  const target = Date.UTC(2026, 7, 12, 17, 37);
  const best = candidates.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));
  near(best, target, 10, 'Aug 2026 new moon');
});

test('blue moons in IST: 31 May 2026 is blue, 1 May 2026 is full but not blue', () => {
  const blue = moonOn('2026-05-31');
  assert.ok(blue?.isFull && blue.isBlue);
  const first = moonOn('2026-05-01');
  assert.ok(first?.isFull && !first.isBlue);
});

test('next blue moon after 20 Oct 2026 is 31 Dec 2028 (IST)', () => {
  const next = nextBlueMoon(Date.UTC(2026, 9, 20));
  assert.deepEqual(next && { y: next.y, m: next.m, d: next.d }, { y: 2028, m: 12, d: 31 });
});

test('new moon day and phase direction', () => {
  assert.equal(moonOn('2026-08-12')?.isNew, true);
  const waxing = moonOn('2026-10-22');
  assert.ok(waxing && waxing.waxing && waxing.illumination > 0.5 && waxing.illumination < 1);
  const waning = moonOn('2026-11-02');
  assert.ok(waning && !waning.waxing);
});

test('IST date conversion and formatting', () => {
  assert.deepEqual(istDate(Date.UTC(2028, 11, 31, 16, 48)), { y: 2028, m: 12, d: 31 });
  assert.equal(formatYmd('2027-02-14'), 'Sun, 14 February 2027');
  assert.equal(moonOn('not-a-date'), null);
});
