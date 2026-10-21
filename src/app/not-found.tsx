import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { moonLitPath } from '@/lib/moon-path';

export const metadata: Metadata = {
  title: 'Amavasya',
  robots: { index: false, follow: false },
};

/** 404: a new-moon night. The crescent appears when you reach for the way home. */
export default function NotFound() {
  return (
    <section className="notfound page" aria-labelledby="nf-title">
      <svg className="notfound-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10" className="notfound-moon-disc" />
        <path d={moonLitPath(0.06, 10, 12, 12)} className="notfound-moon-lit" />
      </svg>
      <p className="text-small text-ink-soft">404, page not found</p>
      <h1 id="nf-title" className="mt-3 text-h2">
        Amavasya.
      </h1>
      <p className="mt-5 max-w-[34ch] text-body">
        No moon tonight, and no page here either. The story you’re after is back on the homepage.
      </p>
      <Link href="/" className="btn btn-primary notfound-home mt-8">
        Back to the homepage
        <span className="btn-moon">
          <ArrowLeftIcon weight="bold" className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </section>
  );
}
