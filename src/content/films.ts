// Real films from the studio's YouTube channel (https://www.youtube.com/@onceinabluemoon.co.in.00),
// read 2026-10-20. Names and places are exactly as the studio published them.
// TODO(client): confirm spellings (e.g. "Akshta & Makrant", "Maithailee/Maithilee").

export type Film = {
  id: string; // YouTube video id
  couple: string;
  place: string;
  kind: string;
  /** As shown on YouTube. */
  duration: string;
  seconds: number;
  /** ISO 8601 publish time from YouTube. */
  published: string;
  description: string;
  featured?: boolean;
};

export const films: Film[] = [
  {
    id: 'vUTO-vyrXoE',
    couple: 'Chirag & Anuradha',
    place: 'Bhimashankar',
    kind: 'Marathi wedding, full film',
    duration: '10:58',
    seconds: 657,
    published: '2026-05-04T04:43:52-07:00',
    description:
      'The full film of an intimate Marathi wedding at Bhimashankar: the preparations, the vows, the celebrations and everyone who came.',
    featured: true,
  },
  {
    id: '1LXmHcs8q9M',
    couple: 'Sandhya & Ninad',
    place: 'Landour',
    kind: 'Pre-wedding film',
    duration: '1:09',
    seconds: 69,
    published: '2026-08-30T02:50:02-07:00',
    description: 'Quiet hills, winding roads and old-world cafés: a pre-wedding film in the lanes of Landour.',
  },
  {
    id: 'EplsQaUeAew',
    couple: 'Abhishek & Anuja',
    place: 'Umbrella Falls, Bhandardara',
    kind: 'Monsoon pre-wedding',
    duration: '1:49',
    seconds: 109,
    published: '2026-08-30T02:00:15-07:00',
    description: 'In the swing of the monsoon: a pre-wedding shoot at Umbrella Falls, Bhandardara.',
  },
  {
    id: 'zay61g1wWc4',
    couple: 'Agata & Justin',
    place: 'Thailand',
    kind: 'Pre-wedding film',
    duration: '1:27',
    seconds: 87,
    published: '2026-08-30T03:06:03-07:00',
    description: 'Golden sunsets over the ocean and quiet sea-breeze mornings: an intimate pre-wedding shoot in Thailand.',
  },
  {
    id: '3z8mikWXr9c',
    couple: 'Vipra & Watson',
    place: 'Gogunda Palace, Udaipur',
    kind: 'Wedding film',
    duration: '1:02',
    seconds: 61,
    published: '2026-08-30T07:29:31-07:00',
    description: 'Royal palaces, golden sunsets and the timeless beauty of Udaipur.',
  },
  {
    id: 'hkFBaoPrBBg',
    couple: 'Kaamya & Siddhesh',
    place: 'Goa',
    kind: 'Beach wedding',
    duration: '1:08',
    seconds: 68,
    published: '2026-03-27T00:53:00-07:00',
    description: 'Golden sands, endless ocean views and the sound of the waves: an intimate beach wedding in Goa.',
  },
  {
    id: '-HtOc3UJZEg',
    couple: 'Zamiya & Aftab',
    place: 'Nikah ceremony',
    kind: 'Wedding film',
    duration: '3:11',
    seconds: 190,
    published: '2026-03-26T23:59:08-07:00',
    description: 'A heartfelt Nikah: two people, their faith and the blessings of their loved ones.',
  },
];

export const featuredFilm = films.find((f) => f.featured)!;
export const otherFilms = films.filter((f) => !f.featured);

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const youtubeWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

/** ISO 8601 duration for JSON-LD, e.g. 657 → PT10M57S. */
export const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${s % 60}S`;
