import { mobileNav, site } from '@/config/site';
import { FacebookLogo, InstagramLogo, WhatsAppLogo, YouTubeLogo } from '@/components/brand/logos';
import { MoonPhase } from '@/components/brand/MoonPhase';
import { NextBlueMoon } from '@/components/sections/NextBlueMoon';
import { chatMessage, waLink } from '@/lib/whatsapp';
import { moonLitPath } from '@/lib/moon-path';

const phases = [0.03, 0.1, 0.17, 0.25, 0.32, 0.39, 0.45, 0.5];

/** The close: a row of phases, the name built large with its "O" as the full blue moon, and every way in. */
export function Footer() {
  return (
    <footer id="footer" className="footer" aria-labelledby="footer-title">
      <div className="page">
        <ul className="footer-phases" aria-hidden="true">
          {phases.map((p) => (
            <li key={p}>
              <MoonPhase phase={p} className="size-full" lit="var(--color-moon)" shadow="var(--color-sand)" />
            </li>
          ))}
        </ul>

        <p id="footer-title" className="footer-mark font-display" data-footer-mark>
          <span className="sr-only">{site.name}</span>
          <span className="footer-mark-line" aria-hidden="true">
            <span className="footer-o" data-footer-o>
              <svg viewBox="0 0 24 24" className="size-full" focusable="false">
                <circle cx="12" cy="12" r="10.2" className="footer-o-shadow" />
                <path d={moonLitPath(0.5, 10.2, 12, 12)} className="footer-o-lit" data-footer-o-lit />
              </svg>
            </span>
            <span>nce in a</span>
          </span>
          <span className="footer-mark-line" aria-hidden="true">
            Blue Moon
          </span>
        </p>

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
                  <WhatsAppLogo className="size-[18px]" />
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

        <div className="footer-base">
          <p>© 2026 {site.name}. {site.tagline}</p>
          <p>
            Our mark is the chandrakor (<span lang="mr" className="font-marathi">चंद्रकोर</span>), the crescent a Maharashtrian bride
            wears. <NextBlueMoon />
          </p>
        </div>
      </div>
    </footer>
  );
}
