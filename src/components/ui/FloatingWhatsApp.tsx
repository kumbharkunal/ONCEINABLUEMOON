'use client';

import { useEffect, useState } from 'react';
import { WhatsAppGlyphWhite } from '@/components/brand/logos';
import { chatMessage, waLink } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

/** Appears once the hero has scrolled away; hides while the menu is open or Contact is on screen. */
export function FloatingWhatsApp() {
  const [pastHero, setPastHero] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');
    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: '-60% 0px 0px 0px' });
    const contactIo = new IntersectionObserver(([e]) => setContactInView(e.isIntersecting), { threshold: 0.05 });
    if (hero) heroIo.observe(hero);
    if (contact) contactIo.observe(contact);
    const onMenu = (e: Event) => setMenuOpen(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener('oiabm:menu', onMenu);
    return () => {
      heroIo.disconnect();
      contactIo.disconnect();
      window.removeEventListener('oiabm:menu', onMenu);
    };
  }, []);

  const visible = pastHero && !contactInView && !menuOpen;

  return (
    <a
      href={waLink(chatMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true}
      className={cn('fab', visible && 'is-visible')}
    >
      <WhatsAppGlyphWhite className="size-7" />
    </a>
  );
}
