import { Instrument_Sans, Instrument_Serif, Tiro_Devanagari_Marathi } from 'next/font/google';

export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const sans = Instrument_Sans({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

// Two Marathi touches only; never preloaded (the browser fetches it when that text renders).
export const marathi = Tiro_Devanagari_Marathi({
  subsets: ['devanagari'],
  weight: '400',
  variable: '--font-tiro-marathi',
  display: 'swap',
  preload: false,
});
