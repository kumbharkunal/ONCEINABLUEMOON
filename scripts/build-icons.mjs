// npm run icons → writes the favicon (src/app/icon.svg) and the Apple touch icon (src/app/apple-icon.png)
// from the moon mark (the chandrakor + bindi in src/components/brand/MoonMark.tsx).
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const CRESCENT = 'M6.436 14.166A10.5 10.5 0 1 0 25.564 14.166A9.6 9.6 0 1 1 6.436 14.166Z';
const DOT = '<circle cx="16" cy="7.4" r="2.3"/>';
const ONYX = '#1A1714';
const GOLD = '#C2A878';
const NIGHT = '#0F0E0C';

// Favicon: onyx on light tabs, the logo's gold on dark tabs. The viewBox hugs the mark so it reads at 16px.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 4 26 26"><style>*{fill:${ONYX}}@media (prefers-color-scheme:dark){*{fill:${GOLD}}}</style><path d="${CRESCENT}"/>${DOT}</svg>\n`;
writeFileSync('src/app/icon.svg', icon);

// Apple touch icon: opaque (iOS rounds the corners itself), the logo's gold on its black, generous clear space.
const apple = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32"><rect width="32" height="32" fill="${NIGHT}"/><g transform="translate(16 17) scale(0.8) translate(-16 -17)" fill="${GOLD}"><path d="${CRESCENT}"/>${DOT}</g></svg>`;
await sharp(Buffer.from(apple)).png({ compressionLevel: 9 }).toFile('src/app/apple-icon.png');

console.log('icons → src/app/icon.svg, src/app/apple-icon.png');
