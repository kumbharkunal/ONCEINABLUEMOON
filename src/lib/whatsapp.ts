import { site } from '@/config/site';

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const heroMessage =
  'Hi Once in a Blue Moon! We’d love to check if you’re free for our wedding.\n\n*Date:* \n*City / venue:* ';

export const packagesMessage =
  'Hi Once in a Blue Moon! Could you share your wedding packages?\n\n*Date:* \n*City / venue:* \n*Photos, film or both:* ';

export const chatMessage = 'Hi Once in a Blue Moon! I have a question about our wedding.';

export type Enquiry = {
  name: string;
  partner: string;
  date: string; // yyyy-mm-dd
  place: string;
  events: string[];
  coverage: string;
  message: string;
  moonLine?: string;
};

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

/** A neatly formatted WhatsApp enquiry (WhatsApp renders *text* as bold). */
export function buildEnquiry(e: Enquiry) {
  const lines = [
    'Hi Once in a Blue Moon! We’d love to check if you’re free for our wedding.',
    '',
    `*Names:* ${[e.name, e.partner].filter(Boolean).join(' & ')}`,
    `*Date:* ${formatDate(e.date)}`,
    `*City / venue:* ${e.place || 'Not decided yet'}`,
    `*Events:* ${e.events.length ? e.events.join(', ') : 'To be decided'}`,
    `*Coverage:* ${e.coverage}`,
  ];
  if (e.message.trim()) lines.push(`*Message:* ${e.message.trim()}`);
  if (e.moonLine) lines.push('', `_${e.moonLine}_`);
  return lines.join('\n');
}
