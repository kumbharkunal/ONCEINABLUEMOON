import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/ssr/EnvelopeSimple';
import { PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import { site } from '@/config/site';
import { imageManifest } from '@/generated/images';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { InstagramLogo } from '@/components/brand/logos';
import { ContactCoupon } from '@/components/sections/ContactCoupon';

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
          {/* The space stays outside the Marathi spans: a space would also pull in the font's 20 KB Latin file. */}
          <p className="mt-6 text-h3 text-gold-ink" lang="mr" data-reveal="fade">
            <span className="font-marathi">शुभमंगल</span> <span className="font-marathi">सावधान</span>
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
              <PhoneIcon weight="light" className="size-5" aria-hidden="true" />
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
              <EnvelopeSimpleIcon weight="light" className="size-5" aria-hidden="true" />
              Email us
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
