import type { ImageId } from '@/generated/images';

// Ritual chapters of a Maharashtrian wedding day. The images are AI placeholders of anonymous people,
// so they are never captioned with a real couple's name (real names appear only with real film frames).

export type Story = {
  id: string;
  title: string;
  when: string;
  line: string;
  image: ImageId;
  alt: string;
  shape: 'portrait' | 'landscape';
};

export const stories: Story[] = [
  {
    id: 'haldi',
    title: 'Haldi',
    when: 'Morning',
    line: 'Turmeric, marigolds and a cousin who always goes too far.',
    image: 'story-haldi',
    alt: 'A laughing bride in a yellow saree as relatives smear turmeric paste on her cheeks in an old courtyard',
    shape: 'portrait',
  },
  {
    id: 'mehendi',
    title: 'Mehendi',
    when: 'Afternoon',
    line: 'Patient hands, a hidden name, an afternoon of songs.',
    image: 'story-mehendi',
    alt: 'Close-up of a bride’s hands being decorated with fresh henna, green glass bangles at her wrist',
    shape: 'landscape',
  },
  {
    id: 'sangeet',
    title: 'Sangeet',
    when: 'Evening',
    line: 'Two families learn the same steps, eventually.',
    image: 'story-sangeet',
    alt: 'A couple dancing under fairy lights while family clap around them',
    shape: 'portrait',
  },
  {
    id: 'lagna',
    title: 'Lagna',
    when: 'Muhurat',
    line: 'The antarpat falls, the mangalashtak ends, the akshata rains down.',
    image: 'story-lagna',
    alt: 'A bride’s smiling eyes above a maroon silk antarpat cloth as grains of rice fall',
    shape: 'landscape',
  },
  {
    id: 'reception',
    title: 'Reception',
    when: 'Night',
    line: 'Everyone in their best, finally in one frame.',
    image: 'story-reception',
    alt: 'A newly married couple walking hand in hand along a path of candle lanterns at night',
    shape: 'portrait',
  },
  {
    id: 'prewedding',
    title: 'Pre-wedding',
    when: 'Anywhere',
    line: 'Landour, Varanasi, the Kokan coast, Bhandardara: wherever your story lives.',
    image: 'story-prewedding',
    alt: 'A couple walking between vineyard rows at golden hour, she in a pale blue chiffon saree',
    shape: 'landscape',
  },
];
