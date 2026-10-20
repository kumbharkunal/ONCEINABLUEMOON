// Answers use verified facts only (WedMeGood listing + the studio's published films).
export type Faq = { q: string; a: string; topic: string };

export const faqs: Faq[] = [
  {
    topic: 'Travel',
    q: 'Do you travel for weddings?',
    a: 'Yes. Travel is included in our packages; for outstation weddings, the couple covers our stay. We’ve filmed in Mumbai, Udaipur, Goa, Varanasi, Landour and Ziro, and as far as Thailand.',
  },
  {
    topic: 'Booking',
    q: 'How do we book our date?',
    a: 'A 50% advance confirms your date. Message us on WhatsApp with your date and city and we’ll tell you if we’re free.',
  },
  {
    topic: 'Delivery',
    q: 'When will we get our photographs and film?',
    a: 'In about four weeks.',
  },
  {
    topic: 'Albums',
    q: 'Do you make albums?',
    a: 'Yes, 40-page albums, designed by us.',
  },
  {
    topic: 'Small days',
    q: 'Can you cover a smaller function?',
    a: 'Yes. We cover short functions of up to four hours.',
  },
  {
    topic: 'Coverage',
    q: 'Photographs, a film, or both?',
    a: 'Either or both: candid and traditional photography, traditional videography, cinematic wedding films and pre-wedding shoots.',
  },
];
