import type { Metadata, Viewport } from 'next';
import './globals.css';
import { marathi, sans, serif } from './fonts';
import { site } from '@/config/site';
import { BrandDefs } from '@/components/brand/logos';
import { Intro } from '@/components/Intro';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { MotionBootstrap } from '@/components/motion/MotionBootstrap';
import { JsonLd } from '@/components/seo/JsonLd';
import { localBusinessJsonLd } from '@/lib/seo';
import { cn } from '@/lib/cn';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');
const indexable = process.env.NEXT_PUBLIC_INDEXABLE === 'true';

const title = 'Once in a Blue Moon · Wedding Photography & Films, Nashik';
const description =
  'Rare moments, beautifully kept. Candid wedding photography and cinematic wedding films from Nashik by Dhiraj Pawar and team, for couples who want to remember exactly how it felt.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    'wedding photographer Nashik',
    'wedding films Nashik',
    'candid wedding photography',
    'Marathi wedding photography',
    'pre-wedding shoot Nashik',
    'cinematic wedding film Maharashtra',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  formatDetection: { telephone: false, email: false, address: false },
  category: 'photography',
};

export const viewport: Viewport = {
  themeColor: '#FBF8F2',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Runs before first paint: marks JS as available and arms the first-visit intro (never under reduced motion).
// After parsing it watches the two Marathi touches and switches their webfont on (html.marathi-ready) once
// one comes within 1500px, so that font never loads with the first screen.
const prePaint = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&!localStorage.getItem('oiabm-intro')){d.setAttribute('data-intro','play');localStorage.setItem('oiabm-intro','1')}}catch(e){}document.addEventListener('DOMContentLoaded',function(){var t=document.querySelectorAll('[lang="mr"]'),go=function(){d.classList.add('marathi-ready')};if(!t.length)return;if(!('IntersectionObserver' in window))return go();var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){if(es[i].isIntersecting){go();io.disconnect();return}}},{rootMargin:'1500px 0px'});for(var i=0;i<t.length;i++)io.observe(t[i])})})();`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={cn(serif.variable, sans.variable, marathi.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
      </head>
      <body>
        <BrandDefs />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {site.features.loader ? <Intro /> : null}
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <MotionBootstrap />
        <JsonLd data={localBusinessJsonLd(siteUrl)} />
      </body>
    </html>
  );
}
