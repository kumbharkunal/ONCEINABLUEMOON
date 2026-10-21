import { mobileNav, site } from '@/config/site';
import { FacebookLogo, InstagramLogo, WhatsAppLogo, YouTubeLogo } from '@/components/brand/logos';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { MoonPhase } from '@/components/brand/MoonPhase';
import { NextBlueMoon } from '@/components/sections/NextBlueMoon';
import { chatMessage, waLink } from '@/lib/whatsapp';

const phases = [0.03, 0.1, 0.17, 0.25, 0.32, 0.39, 0.45, 0.5];

/** The close: a row of waxing moons, the studio's own logo, and every way in. */
export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="page">
        <ul className="footer-phases" aria-hidden="true" data-footer-phases>
          {phases.map((p) => (
            <li key={p}>
              <MoonPhase phase={p} className="size-full" lit="var(--color-gold-deep)" shadow="var(--color-sand)" />
            </li>
          ))}
        </ul>

        <div className="footer-main">
          <div className="footer-brand" data-footer-brand>
            <BrandLogo id="footer-logo" title={site.name} worn className="footer-logo" />
          </div>

          <div className="footer-grid">
            <div>
              <h2 className="footer-h">Studio</h2>
              <address className="not-italic text-body">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region}
              </address>
            </div>
            <div>
              <h2 className="footer-h">Say hello</h2>
              <ul className="space-y-1 text-body">
                <li>
                  <a href={waLink(chatMessage)} target="_blank" rel="noopener noreferrer" className="link-reverse inline-flex min-h-11 items-center gap-2">
                    <WhatsAppLogo className="size-4.5" />
                    WhatsApp {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="link-reverse inline-flex min-h-11 items-center break-all">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer-h">Follow</h2>
              <ul className="flex items-center gap-1">
                <li>
                  <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
                    <InstagramLogo className="size-6" />
                  </a>
                </li>
                <li>
                  <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Facebook">
                    <FacebookLogo className="size-6" />
                  </a>
                </li>
                <li>
                  <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube">
                    <YouTubeLogo className="size-7" />
                  </a>
                </li>
                <li>
                  <a href={waLink(chatMessage)} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="WhatsApp">
                    <WhatsAppLogo className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
            <nav aria-label="Footer">
              <h2 className="footer-h">On this page</h2>
              <ul className="grid grid-cols-2 gap-x-6 text-body">
                {mobileNav.map((item) => (
                  <li key={item.id}>
                    <a href={`/#${item.id}`} className="link-reverse inline-flex min-h-11 items-center">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="footer-base">
          <p>© 2026 {site.name}. {site.tagline}</p>
          <p>
            The moons on this page are the chandrakor (<span lang="mr" className="font-marathi">चंद्रकोर</span>), the crescent a
            Maharashtrian bride wears. <NextBlueMoon />
          </p>
        </div>
      </div>
    </footer>
  );
}
