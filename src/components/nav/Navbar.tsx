'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import { MoonMark } from '@/components/brand/MoonMark';
import { FacebookLogo, InstagramLogo, WhatsAppLogo, YouTubeLogo } from '@/components/brand/logos';
import { MoonProgress } from '@/components/nav/MoonProgress';
import { mobileNav, nav, site } from '@/config/site';
import { chatMessage, waLink } from '@/lib/whatsapp';
import { lockScroll, scrollToId, unlockScroll } from '@/lib/scroll';
import { cn } from '@/lib/cn';

const loadFeatures = () => import('@/components/motion/features').then((r) => r.default);
const spring = { type: 'spring', stiffness: 380, damping: 34 } as const;
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
const OPEN_CLIP = 'inset(0px 0px 0px 0px round 28px)';

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [clipFrom, setClipFrom] = useState('inset(12px 12px 90% 12px round 26px)');

  const pillRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pushedRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const openRef = useRef(false);

  // Active section (desktop indicator)
  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const top = document.getElementById('top');
    const topIo = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setActive(null);
    });
    if (top) topIo.observe(top);
    return () => {
      io.disconnect();
      topIo.disconnect();
    };
  }, []);

  // Compact on scroll down, full on scroll up (rAF-throttled, passive)
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < 80) setCompact(false);
      else if (y > last + 4 && y > 120) setCompact(true);
      else if (y < last - 6) setCompact(false);
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const finishClose = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
    const target = pendingRef.current;
    if (target) {
      pendingRef.current = null;
      window.setTimeout(() => scrollToId(target), 460);
    }
  }, []);

  const requestClose = useCallback(() => {
    if (!openRef.current) return;
    if (pushedRef.current && window.history.state?.oiabmMenu) {
      pushedRef.current = false;
      window.history.back(); // popstate closes the menu
    } else {
      pushedRef.current = false;
      finishClose();
    }
  }, [finishClose]);

  const openMenu = useCallback(() => {
    const pill = pillRef.current?.getBoundingClientRect();
    if (pill) {
      const inset = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const t = Math.max(pill.top - inset, 0);
      const l = Math.max(pill.left - inset, 0);
      const r = Math.max(vw - inset - pill.right, 0);
      const b = Math.max(vh - inset - pill.bottom, 0);
      setClipFrom(`inset(${t}px ${r}px ${b}px ${l}px round ${pill.height / 2}px)`);
    }
    window.history.pushState({ ...(window.history.state ?? {}), oiabmMenu: true }, '');
    pushedRef.current = true;
    openRef.current = true;
    setSheetVisible(true);
    setOpen(true);
  }, []);

  // Android back gesture / browser back closes the menu
  useEffect(() => {
    const onPop = () => {
      if (openRef.current) {
        pushedRef.current = false;
        finishClose();
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [finishClose]);

  // Scroll lock, inert page, menu event for the floating WhatsApp button
  useEffect(() => {
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');
    if (open) {
      lockScroll();
      main?.setAttribute('inert', '');
      footer?.setAttribute('inert', '');
    } else {
      unlockScroll();
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
    }
    window.dispatchEvent(new CustomEvent('oiabm:menu', { detail: open }));
  }, [open]);

  // Focus trap + Esc
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const button = buttonRef.current;
    const raf = requestAnimationFrame(() => sheet?.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !sheet || !button) return;
      const list = [button, ...Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))];
      const i = list.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        list[list.length - 1].focus();
      } else if (!e.shiftKey && i === list.length - 1) {
        e.preventDefault();
        list[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, requestClose]);

  // Close if the viewport grows into the desktop layout
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (mq.matches) requestClose();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [requestClose]);

  const onDesktopLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToId(id);
  };

  const onMobileLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    pendingRef.current = id;
    requestClose();
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        {/* Desktop: floating glass pill */}
        <m.nav
          aria-label="Primary"
          layout
          transition={spring}
          className="nav-pill fixed left-1/2 z-[40] hidden -translate-x-1/2 items-center gap-1 lg:flex"
          data-compact={compact}
        >
          <m.a
            layout="position"
            href="#top"
            onClick={(e) => onDesktopLink(e, 'top')}
            className="flex min-h-11 items-center gap-2.5 pr-3 pl-1 text-ink"
            aria-label={`${site.name}, back to top`}
          >
            <MoonMark className="size-[26px] text-deep-moon" />
            <span className={cn('nav-wordmark font-display text-[1.25rem] leading-none whitespace-nowrap', compact && 'is-hidden')}>
              {site.name}
            </span>
          </m.a>
          <m.ul layout="position" className="flex items-center">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => onDesktopLink(e, item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative flex min-h-11 items-center rounded-full px-3.5 text-[0.9375rem] transition-colors duration-200',
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                    )}
                  >
                    {isActive ? (
                      <m.span layoutId="nav-active" transition={spring} className="absolute inset-0 -z-0 rounded-full bg-sand" />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </m.ul>
          <m.div layout="position" className="flex items-center gap-2 pl-1">
            <MoonProgress className="size-5" />
            <a href="#contact" onClick={(e) => onDesktopLink(e, 'contact')} className="btn btn-primary min-h-11 pl-4 text-[0.875rem]">
              Check your date
              <span className="btn-moon size-8">
                <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          </m.div>
        </m.nav>

        {/* Mobile: compact pill → full-height glass sheet */}
        <div className="lg:hidden">
          <div
            ref={pillRef}
            className="nav-pill nav-pill-mobile fixed left-1/2 z-[62] flex -translate-x-1/2 items-center gap-1"
            data-open={open}
          >
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                if (open) {
                  pendingRef.current = 'top';
                  requestClose();
                } else scrollToId('top');
              }}
              className="flex min-h-11 items-center gap-2 pr-2 pl-1 text-ink"
              aria-label={`${site.name}, back to top`}
            >
              <MoonMark className="size-6 text-deep-moon" />
              <span className="font-display text-[1.0625rem] leading-none whitespace-nowrap">{site.name}</span>
            </a>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => (open ? requestClose() : openMenu())}
              className="menu-button flex min-h-11 min-w-11 items-center gap-2.5 rounded-full bg-ink px-4 text-[0.875rem] font-medium text-paper"
            >
              <span className="menu-icon relative block h-3 w-4" aria-hidden="true">
                <m.span
                  className="absolute left-0 top-0 block h-[1.5px] w-4 rounded-full bg-paper"
                  animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: EXPO }}
                />
                <m.span
                  className="absolute bottom-0 left-0 block h-[1.5px] w-4 rounded-full bg-paper"
                  animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: EXPO }}
                />
              </span>
              <span className="relative block h-[1.2em] overflow-hidden" aria-hidden="true">
                <m.span
                  className="block"
                  animate={{ y: open ? '-50%' : '0%' }}
                  transition={{ duration: 0.4, ease: EXPO }}
                >
                  <span className="block leading-[1.2em]">Menu</span>
                  <span className="block leading-[1.2em]">Close</span>
                </m.span>
              </span>
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>

          <m.div
            className="fixed inset-0 z-[60] bg-ink/20"
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: open ? 0.4 : 0.3 }}
            style={{ pointerEvents: open ? 'auto' : 'none' }}
            onClick={requestClose}
            aria-hidden="true"
          />

          <m.div
            ref={sheetRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            inert={!open}
            className="menu-sheet fixed inset-2 z-[61] flex flex-col"
            initial={false}
            animate={{ clipPath: open ? [clipFrom, OPEN_CLIP] : [OPEN_CLIP, clipFrom] }}
            transition={open ? { duration: 0.6, ease: EXPO } : { duration: 0.45, ease: IN_OUT }}
            onAnimationComplete={() => {
              if (!openRef.current) setSheetVisible(false);
            }}
            style={{ visibility: sheetVisible ? 'visible' : 'hidden' }}
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6 pt-24 pb-6">
              <ul className="flex flex-col gap-1">
                {mobileNav.map((item, i) => (
                  <li key={item.id} className="line-mask">
                    <m.a
                      href={`#${item.id}`}
                      onClick={(e) => onMobileLink(e, item.id)}
                      className="block py-1 font-display text-[clamp(2.5rem,11vw,3.5rem)] leading-[1.05] text-ink"
                      initial={false}
                      animate={{ y: open ? '0%' : '110%' }}
                      transition={open ? { duration: 0.7, delay: 0.18 + i * 0.06, ease: EXPO } : { duration: 0.22, ease: IN_OUT }}
                    >
                      {item.label}
                    </m.a>
                  </li>
                ))}
              </ul>
            </nav>
            <m.div
              className="menu-foot px-6 pb-[max(20px,env(safe-area-inset-bottom))]"
              initial={false}
              animate={{ opacity: open ? 1 : 0, y: open ? 0 : 12 }}
              transition={open ? { duration: 0.5, delay: 0.35, ease: EXPO } : { duration: 0.15 }}
            >
              <a
                href={waLink(chatMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full justify-between"
              >
                Chat on WhatsApp
                <span className="btn-moon bg-paper">
                  <WhatsAppLogo className="size-5" />
                </span>
              </a>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center" aria-label="Instagram">
                    <InstagramLogo className="size-6" />
                  </a>
                  <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center" aria-label="Facebook">
                    <FacebookLogo className="size-6" />
                  </a>
                  <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center" aria-label="YouTube">
                    <YouTubeLogo className="size-7" />
                  </a>
                </div>
                <a href={`tel:${site.phone}`} className="link-reverse inline-flex min-h-11 items-center text-small text-ink">
                  {site.phoneDisplay}
                </a>
              </div>
            </m.div>
          </m.div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
