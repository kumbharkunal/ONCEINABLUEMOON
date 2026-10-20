'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { formatDayMonthYear, formatYmd, moonOn, nextBlueMoon, todayIst, type MoonInfo } from '@/lib/moon';
import { moonLitPath } from '@/lib/moon-path';
import { buildEnquiry, waLink } from '@/lib/whatsapp';
import { WhatsAppLogo } from '@/components/brand/logos';
import { cn } from '@/lib/cn';

const EVENTS = ['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception', 'Pre-wedding'];
const COVERAGE = ['Photos', 'Film', 'Photos + film'];

function moonSentence(ymd: string, info: MoonInfo, isToday: boolean) {
  const pct = Math.round(info.illumination * 100);
  const what = info.isNew || info.isFull ? info.name.toLowerCase() : `${info.name.toLowerCase()}, ${pct}% lit`;
  if (isToday) return `Tonight the moon over Nashik is a ${what}.`;
  return `On ${formatYmd(ymd)}, the moon will be a ${what}.`;
}

function moonNote(info: MoonInfo) {
  if (info.isBlue) return 'A blue moon. Truly once in a blue moon.';
  if (info.isFull) return 'A full-moon wedding. Rare and lovely.';
  if (info.isNew) return 'Amavasya: a dark sky, made for fairy lights.';
  if (info.waxing && info.phase < 0.22) return 'A chandrakor, like the one on a bride’s forehead.';
  return null;
}

/** Draws the moon for the chosen date and eases between phases when the date changes. */
function LiveMoon({ phase }: { phase: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const current = useRef(phase);
  useEffect(() => {
    const from = current.current;
    const to = phase;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || Math.abs(to - from) < 0.001) {
      current.current = to;
      pathRef.current?.setAttribute('d', moonLitPath(to, 10, 12, 12));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - start) / 700, 1);
      const e = 1 - Math.pow(1 - k, 4);
      const p = from + (to - from) * e;
      current.current = p;
      pathRef.current?.setAttribute('d', moonLitPath(p, 10, 12, 12));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);
  return (
    <svg viewBox="0 0 24 24" className="live-moon" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" className="live-moon-shadow" />
      <path ref={pathRef} d={moonLitPath(phase, 10, 12, 12)} className="live-moon-lit" />
    </svg>
  );
}

function burstAkshata(from: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = from.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.className = 'akshata-layer';
  document.body.appendChild(layer);
  const grains = 14;
  for (let i = 0; i < grains; i++) {
    const g = document.createElement('span');
    g.className = 'akshata-grain';
    g.style.left = `${rect.left + rect.width * (0.3 + Math.random() * 0.4)}px`;
    g.style.top = `${rect.top + rect.height * 0.3}px`;
    layer.appendChild(g);
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
    const dist = 60 + Math.random() * 90;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const rot = Math.random() * 360;
    g.animate(
      [
        { transform: `translate(0,0) rotate(${rot}deg)`, opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot + 120}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx * 1.15}px, ${dy + 120}px) rotate(${rot + 200}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' },
    );
  }
  window.setTimeout(() => layer.remove(), 1400);
}

type Errors = { name?: string; date?: string };

export function ContactCoupon({ photo }: { photo: React.ReactNode }) {
  const uid = useId();
  const [today, setToday] = useState<string | null>(null);
  const [maxDate, setMaxDate] = useState<string | undefined>(undefined);
  const [nextBlue, setNextBlue] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [events, setEvents] = useState<string[]>(['Wedding']);
  const [coverage, setCoverage] = useState('Photos + film');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // "Today" is only known in the browser (the page itself is prerendered).
  useEffect(() => {
    const now = Date.now();
    const t = todayIst(now);
    setToday(t);
    const [y, m, d] = t.split('-').map(Number);
    setMaxDate(`${y + 4}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    const blue = nextBlueMoon(now);
    if (blue) setNextBlue(formatDayMonthYear(blue));
  }, []);

  const shownDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today;
  const moon = useMemo(() => (shownDate ? moonOn(shownDate) : null), [shownDate]);
  const isToday = !date || date === today;

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Please add your name so we know who to reply to.';
    if (!date) next.date = 'Please pick your wedding date (an approximate one is fine).';
    else if (today && date < today) next.date = 'That date has passed. Please pick a date from today onwards.';
    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (next.name || next.date) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const moonLine = moon && date ? moonSentence(date, moon, false) : undefined;
    const url = waLink(buildEnquiry({ name, partner, date, place, events, coverage, message, moonLine }));
    if (submitRef.current) burstAkshata(submitRef.current);
    setSentUrl(url);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
  };

  const toggleEvent = (ev: string) => setEvents((list) => (list.includes(ev) ? list.filter((x) => x !== ev) : [...list, ev]));
  const errorCount = Number(Boolean(errors.name)) + Number(Boolean(errors.date));

  return (
    <div className="coupon mt-12 lg:mt-16" data-reveal="rise">
      <div className="coupon-stub">
        <div className="coupon-photo">
          {photo}
          <div className="coupon-moon">{moon ? <LiveMoon phase={moon.phase} /> : <LiveMoon phase={0.5} />}</div>
        </div>
        <div className="coupon-caption" aria-live="polite">
          <p className="text-small text-ink-soft">{isToday ? 'Tonight’s moon' : 'The moon on your wedding night'}</p>
          <p className="mt-1 font-display text-[1.375rem] leading-snug text-ink">
            {moon && shownDate ? moonSentence(shownDate, moon, isToday) : 'Pick your date to see your wedding-night moon.'}
          </p>
          {moon && !isToday && moonNote(moon) ? <p className="mt-2 text-body text-ink">{moonNote(moon)}</p> : null}
          {nextBlue ? <p className="mt-3 text-small text-ink-soft">The next blue moon rises on {nextBlue}.</p> : null}
        </div>
      </div>

      <div className="coupon-perf" aria-hidden="true" />

      <form className="coupon-form" onSubmit={onSubmit} noValidate aria-describedby={`${uid}-hint`}>
        <p id={`${uid}-hint`} className="sr-only">
          Sending opens WhatsApp with your message ready. Nothing is stored on this website.
        </p>
        {errorCount > 0 ? (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="coupon-errors">
            <p className="font-medium">
              {errorCount === 1 ? 'One quick thing' : 'Two quick things'} before we can check your date:
            </p>
            <ul className="mt-1 list-disc pl-5">
              {errors.name ? (
                <li>
                  <a href={`#${uid}-name`} className="link">
                    {errors.name}
                  </a>
                </li>
              ) : null}
              {errors.date ? (
                <li>
                  <a href={`#${uid}-date`} className="link">
                    {errors.date}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div className="coupon-grid">
          <div className="field">
            <label htmlFor={`${uid}-name`} className="field-label">
              Your name <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${uid}-name`}
              className="input"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => name.trim() && setErrors((x) => ({ ...x, name: undefined }))}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${uid}-name-err` : undefined}
              required
            />
            {errors.name ? (
              <p id={`${uid}-name-err`} className="field-error">
                {errors.name}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-partner`} className="field-label">
              Your partner’s name
            </label>
            <input id={`${uid}-partner`} className="input" value={partner} onChange={(e) => setPartner(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${uid}-date`} className="field-label">
              Wedding date <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${uid}-date`}
              type="date"
              className="input"
              min={today ?? undefined}
              max={maxDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (e.target.value) setErrors((x) => ({ ...x, date: undefined }));
              }}
              aria-invalid={errors.date ? true : undefined}
              aria-describedby={errors.date ? `${uid}-date-err` : `${uid}-date-help`}
              required
            />
            {errors.date ? (
              <p id={`${uid}-date-err`} className="field-error">
                {errors.date}
              </p>
            ) : (
              <p id={`${uid}-date-help`} className="mt-1.5 text-small text-ink-soft">
                The moon on the left changes with it.
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-place`} className="field-label">
              City or venue
            </label>
            <input
              id={`${uid}-place`}
              className="input"
              autoComplete="address-level2"
              placeholder="Nashik, or anywhere"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="field-label">Events</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {EVENTS.map((ev) => (
              <button
                key={ev}
                type="button"
                className="chip"
                aria-pressed={events.includes(ev)}
                onClick={() => toggleEvent(ev)}
              >
                {ev}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="field-label">We’d love</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {COVERAGE.map((c) => (
              <label key={c} className="chip inline-flex cursor-pointer items-center">
                <input
                  type="radio"
                  name={`${uid}-coverage`}
                  value={c}
                  checked={coverage === c}
                  onChange={() => setCoverage(c)}
                  className="sr-only"
                />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field mt-6">
          <label htmlFor={`${uid}-msg`} className="field-label">
            Anything else? <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id={`${uid}-msg`}
            className="input"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Guest count, the feel you want, a song you love…"
          />
        </div>

        <button ref={submitRef} type="submit" className={cn('btn btn-primary coupon-submit mt-8 w-full justify-between')}>
          Send on WhatsApp
          <span className="btn-moon btn-moon-paper">
            <WhatsAppLogo className="size-5" />
          </span>
        </button>
        <p className="mt-3 text-small text-ink-soft">Opens WhatsApp with your message ready to send. Nothing is stored here.</p>
        {sentUrl ? (
          <p className="mt-3 text-small text-ink" role="status">
            WhatsApp is opening with your message.{' '}
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="link">
              Didn’t open? Tap here.
            </a>
          </p>
        ) : null}
      </form>
    </div>
  );
}
