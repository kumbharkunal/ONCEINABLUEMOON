import { Hero } from '@/components/hero/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { TrustLine } from '@/components/sections/TrustLine';
import { Marquee } from '@/components/sections/Marquee';
import { Stories } from '@/components/sections/Stories';
import { Films } from '@/components/sections/Films';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Faq } from '@/components/sections/Faq';
import { About } from '@/components/sections/About';
import { KindWords } from '@/components/sections/KindWords';
import { Instagram } from '@/components/sections/Instagram';
import { Contact } from '@/components/sections/Contact';

// The homepage must stay fully static (prerendered, no request-time rendering).
export const ensureStatic = 'navigation';

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <TrustLine />
      <Marquee />
      <Stories />
      <Films />
      <Services />
      <Process />
      <Faq />
      <About />
      <KindWords />
      <Instagram />
      <Contact />
    </>
  );
}
