// Studio facts used across the site. Every value has a source; unknowns are marked TODO(client).
// Sources (checked 2026-10-20):
// - YouTube descriptions, e.g. https://www.youtube.com/watch?v=EplsQaUeAew :
//   "Booking now dhirajpawarfilms@gmail.com or - text/ whatsp +91 8208631559"
// - WedMeGood https://www.wedmegood.com/profile/Once-In-a-Blue-Moon-25411693 :
//   Ganpati Nagar, Anandvalli (Gangapur Road), Nashik; since 2019; 50% advance; travel included, stay by client; ~4 weeks delivery

export const site = {
  name: 'Once in a Blue Moon',
  shortName: 'Blue Moon',
  tagline: 'Rare moments, beautifully kept.',
  description:
    'Wedding photography and cinematic wedding films from Nashik by Dhiraj Pawar and team. Candid and traditional photography, wedding films, pre-wedding shoots and albums, at home and wherever you say yes.',
  founder: 'Dhiraj Pawar',
  foundingYear: 2019,

  // TODO(client): confirm this is the number couples should use for bookings (it is the booking line in the YouTube descriptions).
  phone: '+918208631559',
  phoneDisplay: '+91 82086 31559',
  whatsapp: '918208631559',
  // TODO(client): confirm, or replace with a studio address if one exists.
  email: 'dhirajpawarfilms@gmail.com',

  address: {
    street: 'Ganpati Nagar, Anandvalli, Gangapur Road',
    locality: 'Nashik',
    region: 'Maharashtra',
    country: 'IN',
    postalCode: null as string | null, // TODO(client): PIN code not verified
  },

  socials: {
    instagram: 'https://www.instagram.com/onceinabluemoon.co.in/',
    instagramHandle: 'onceinabluemoon.co.in',
    instagramDm: 'https://ig.me/m/onceinabluemoon.co.in',
    facebook: 'https://www.facebook.com/profile.php?id=61556376170618',
    youtube: 'https://www.youtube.com/@onceinabluemoon.co.in.00',
    youtubeChannelId: 'UC6qH3b57L-YrW9-WYxBsPBQ',
    founderInstagram: 'https://www.instagram.com/dhirajpawarfilms/',
    founderInstagramHandle: 'dhirajpawarfilms',
  },

  // Future domain. TODO(client): onceinabluemoon.co.in was unregistered on 2026-10-20 (NIXI RDAP 404).
  futureDomain: 'onceinabluemoon.co.in',

  features: {
    /** First-visit intro loader (CSS only). */
    loader: true,
    /** Desktop-only WebGL "Godavari ripple" on the hero aperture. */
    heroRipple: true,
  },
} as const;

export const nav = [
  { id: 'stories', label: 'Stories' },
  { id: 'films', label: 'Films' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
] as const;

export const mobileNav = [
  { id: 'stories', label: 'Stories' },
  { id: 'films', label: 'Films' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'How it works' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;
