'use client';

import { useEffect, useRef, useState } from 'react';
import { youtubeEmbed } from '@/content/films';
import { lockScroll, unlockScroll } from '@/lib/scroll';

/**
 * Click-to-load player. Film cards are real links to YouTube (they work without JS); with JS this
 * intercepts them and plays the film in an accessible modal dialog (youtube-nocookie, loaded on click).
 */
export function FilmDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [film, setFilm] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[data-film]');
      if (!link) return;
      e.preventDefault();
      openerRef.current = link;
      setFilm({ id: link.dataset.film ?? '', title: link.dataset.filmTitle ?? 'Film' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (film && !dialog.open) {
      dialog.showModal();
      lockScroll();
    }
  }, [film]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="film-dialog"
      aria-label={film ? `Playing: ${film.title}` : 'Film player'}
      onClose={() => {
        setFilm(null);
        unlockScroll();
        openerRef.current?.focus({ preventScroll: true });
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="film-dialog-inner">
        <button type="button" onClick={close} className="film-dialog-close" aria-label="Close film">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="film-dialog-frame">
          {film ? (
            <iframe
              src={youtubeEmbed(film.id)}
              title={film.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full"
            />
          ) : null}
        </div>
        {film ? <p className="mt-4 text-body text-moon-glow">{film.title}</p> : null}
      </div>
    </dialog>
  );
}
