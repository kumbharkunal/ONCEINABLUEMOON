import type { Metadata } from 'next';
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
      <a href="/" className="btn btn-primary notfound-home mt-8">
        Back to the homepage
        <span className="btn-moon">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M11.5 8h-8M7 4.5L3.5 8 7 11.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </section>
  );
}
