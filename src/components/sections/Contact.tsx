import { site } from '@/config/site';
import { imageManifest } from '@/generated/images';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { InstagramLogo } from '@/components/brand/logos';
import { ContactCoupon } from '@/components/sections/ContactCoupon';

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M6.6 3.5h2.6l1.4 4-2 1.4a12 12 0 0 0 6.5 6.5l1.4-2 4 1.4v2.6a1.7 1.7 0 0 1-1.8 1.7C11.4 18.8 5.2 12.6 4.9 5.3a1.7 1.7 0 0 1 1.7-1.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 6.5l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

const emailHref = `mailto:${site.email}?subject=${encodeURIComponent('Is our wedding date free?')}&body=${encodeURIComponent(
  'Hi Once in a Blue Moon,\n\nOur names:\nWedding date:\nCity / venue:\nEvents:\nPhotos, film or both:\n\nThank you!',
)}`;

/** "Is your date still free?": the coupon form with the live moon, and every other way to reach the studio. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="contact section-y">
      <div className="page">
        <div className="max-w-[46rem]">
          <SectionLabel n={10}>Contact</SectionLabel>
          <p className="mt-6 font-marathi text-h3 text-champagne-ink" lang="mr" data-reveal="fade">
            शुभमंगल सावधान
          </p>
          <h2 id="contact-title" className="mt-2 text-h2" data-reveal="lines">
            Is your date still free?
          </h2>
          <p className="mt-5 max-w-[42ch] text-body" data-reveal="fade">
            Tell us your date and a little about your wedding. We reply on WhatsApp with availability and packages.
          </p>
        </div>

        <ContactCoupon
          photo={
            imageManifest['contact-twilight'] ? (
              <SmartImage
                id="contact-twilight"
                alt="Twilight over the Sahyadri hills and the Godavari river near Nashik"
                sizes="(min-width: 64rem) 34vw, 92vw"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-night" role="img" aria-label="A twilight sky (photograph coming soon)" />
            )
          }
        />

        <ul className="contact-alt mt-10 flex flex-wrap gap-3" aria-label="Other ways to reach us">
          <li>
            <a href={`tel:${site.phone}`} className="btn btn-quiet gap-2.5">
              <PhoneGlyph className="size-5" />
              Call {site.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={site.socials.instagramDm} target="_blank" rel="noopener noreferrer" className="btn btn-quiet gap-2.5">
              <InstagramLogo className="size-5" />
              Instagram DM
            </a>
          </li>
          <li>
            <a href={emailHref} className="btn btn-quiet gap-2.5">
              <MailGlyph className="size-5" />
              Email us
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
