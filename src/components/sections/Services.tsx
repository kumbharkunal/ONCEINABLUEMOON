import { services } from '@/content/services';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { WhatsAppLogo } from '@/components/brand/logos';
import { packagesMessage, waLink } from '@/lib/whatsapp';

/**
 * Index with preview: rows of services; pointing at one brings its picture into a single moon frame.
 * On touch screens each row opens in place and shows its picture inline.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="services section-y">
      <div className="page grid-page gap-y-12">
        <div className="col-span-4 lg:col-span-7">
          <SectionLabel n={4}>Services</SectionLabel>
          <h2 id="services-title" className="mt-5 text-h2" data-reveal="lines">
            Everything, from one team.
          </h2>
          <ul className="svc-list mt-12 lg:mt-16" data-svc-list>
            {services.map((s) => (
              <li key={s.id} className="svc-item" data-reveal="fade">
                <details className="svc" name="services" data-svc={s.id}>
                  <summary className="svc-summary">
                    <SmartImage
                      as="span"
                      id={s.image}
                      alt=""
                      sizes="64px"
                      quietPlaceholder
                      className="svc-bullet"
                    />
                    <span className="svc-text">
                      <span className="svc-name font-display">{s.name}</span>
                      <span className="svc-line text-body text-ink-soft">{s.line}</span>
                    </span>
                    <span className="svc-plus" aria-hidden="true" />
                  </summary>
                  <div className="svc-body">
                    <SmartImage
                      id={s.image}
                      alt={s.alt}
                      sizes="(min-width: 64rem) 1px, 70vw"
                      className="svc-inline-img"
                    />
                    <p className="max-w-[44ch] text-body text-ink">{s.detail}</p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <a
            href={waLink(packagesMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-12"
            data-reveal="fade"
          >
            Get our packages on WhatsApp
            <span className="btn-moon btn-moon-paper">
              <WhatsAppLogo className="size-5" />
            </span>
          </a>
        </div>
        <div className="col-span-5 col-start-8 hidden lg:block">
          <ServicesPreview
            items={services.map((s) => ({
              id: s.id,
              detail: s.detail,
              image: <SmartImage id={s.image} alt="" sizes="(min-width: 64rem) 34vw, 1px" quietPlaceholder className="absolute inset-0" />,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
