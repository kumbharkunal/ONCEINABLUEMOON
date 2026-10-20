import type { ImageId } from '@/generated/images';

// Services from the studio's WedMeGood listing and YouTube credits. No prices on the homepage.
export type Service = {
  id: string;
  name: string;
  line: string;
  detail: string;
  image: ImageId;
  alt: string;
};

export const services: Service[] = [
  {
    id: 'candid',
    name: 'Candid photography',
    line: 'Unposed, unhurried, honest.',
    detail: 'The glances, the giggles and the moments you didn’t know anyone saw.',
    image: 'svc-candid',
    alt: 'A bride laughing during her haldi ceremony',
  },
  {
    id: 'films',
    name: 'Cinematic wedding films',
    line: 'A highlight film and the full story.',
    detail: 'Shot and edited by Dhiraj himself, cut to music and paced like a film.',
    image: 'svc-films',
    alt: 'A cinematographer with a gimbal filming a couple at a wedding fire',
  },
  {
    id: 'prewedding',
    name: 'Pre-wedding shoots',
    line: 'Hills, ghats, beaches or the street where you met.',
    detail: 'Recent ones: Landour, Varanasi, the Kokan coast, Naneghat and Bhandardara in the rain.',
    image: 'svc-prewedding',
    alt: 'A couple walking through a vineyard at golden hour',
  },
  {
    id: 'traditional',
    name: 'Traditional photo and video',
    line: 'Every ritual and every relative.',
    detail: 'The complete record your family will ask for, covered properly and calmly.',
    image: 'svc-traditional',
    alt: 'A bride behind the antarpat cloth during the wedding ceremony',
  },
  {
    id: 'albums',
    name: 'Albums',
    line: 'A 40-page album, designed to be held.',
    detail: 'Laid out by us, printed to keep, made to be handed down.',
    image: 'svc-album',
    alt: 'A linen-bound wedding album resting on a Paithani silk saree',
  },
  {
    id: 'destination',
    name: 'Destination weddings',
    line: 'We travel; travel is in the package.',
    detail: 'For weddings outside Nashik, you only cover our stay. We’ve filmed from Udaipur and Goa to Thailand.',
    image: 'svc-destination',
    alt: 'A flower mandap on a palace terrace by a lake at dusk',
  },
];
