import type { FAQPage, LocalBusiness, VideoObject, WithContext } from 'schema-dts';
import { site } from '@/config/site';
import { faqs } from '@/content/faqs';
import { films, isoDuration, youtubeThumb, youtubeWatch } from '@/content/films';

export function localBusinessJsonLd(siteUrl: string): WithContext<LocalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#studio`,
    name: site.name,
    description: site.description,
    slogan: site.tagline,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.jpg`,
    logo: `${siteUrl}/icon.svg`,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    founder: {
      '@type': 'Person',
      name: site.founder,
      sameAs: [site.socials.founderInstagram],
    },
    foundingDate: String(site.foundingYear),
    areaServed: [
      { '@type': 'City', name: 'Nashik' },
      { '@type': 'State', name: 'Maharashtra' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: ['Wedding photography', 'Candid photography', 'Wedding films', 'Pre-wedding shoots', 'Wedding albums'],
    sameAs: [site.socials.instagram, site.socials.facebook, site.socials.youtube],
  };
}

export function faqJsonLd(): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function filmsJsonLd(): { '@context': 'https://schema.org'; '@graph': VideoObject[] } {
  return {
    '@context': 'https://schema.org',
    '@graph': films.map((f) => ({
      '@type': 'VideoObject',
      name: `${f.couple}: ${f.kind}, ${f.place}`,
      description: f.description,
      thumbnailUrl: [youtubeThumb(f.id)],
      uploadDate: f.published,
      duration: isoDuration(f.seconds),
      embedUrl: `https://www.youtube-nocookie.com/embed/${f.id}`,
      contentUrl: youtubeWatch(f.id),
      publisher: { '@type': 'Organization', name: site.name },
    })),
  };
}
