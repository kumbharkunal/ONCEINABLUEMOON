'use client';

import { useEffect, useState } from 'react';
import { PauseIcon } from '@phosphor-icons/react/dist/ssr/Pause';
import { PlayIcon } from '@phosphor-icons/react/dist/ssr/Play';
import { REEL_STATE, REEL_TOGGLE, type ReelState } from '@/components/hero/HeroVideo';

/**
 * Pause / play for the hero reel (moving content longer than 5 s must be pausable: WCAG 2.2.2).
 * It sits in the hero stage, outside the clipped aperture, and appears only once the reel is playing.
 */
export function HeroReelToggle() {
  const [state, setState] = useState<ReelState | null>(null);

  useEffect(() => {
    const onState = (e: Event) => setState((e as CustomEvent<ReelState>).detail);
    window.addEventListener(REEL_STATE, onState);
    return () => window.removeEventListener(REEL_STATE, onState);
  }, []);

  if (!state) return null;
  const playing = state === 'playing';
  return (
    <button
      type="button"
      className="hero-reel-toggle"
      aria-label={playing ? 'Pause the film' : 'Play the film'}
      onClick={() => window.dispatchEvent(new Event(REEL_TOGGLE))}
    >
      {playing ? <PauseIcon weight="fill" className="size-4" aria-hidden="true" /> : <PlayIcon weight="fill" className="size-4" aria-hidden="true" />}
    </button>
  );
}
