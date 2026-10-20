import Image from 'next/image';
import { imageManifest, type ImageId } from '@/generated/images';
import { MoonMark } from '@/components/brand/MoonMark';
import { cn } from '@/lib/cn';

type Props = {
  id: ImageId;
  alt: string;
  /** Required: how wide the image renders at each breakpoint. */
  sizes: string;
  /** Classes for the frame (set its aspect ratio / mask here). */
  className?: string;
  imgClassName?: string;
  quality?: 60 | 75;
  /** LCP image only. */
  priority?: boolean;
  /** Use 'span' inside phrasing content (paragraphs, summaries). */
  as?: 'div' | 'span';
  /** Hide the "coming soon" caption on small frames. */
  quietPlaceholder?: boolean;
  style?: React.CSSProperties;
};

/**
 * Renders a processed image from the manifest, or an elegant tonal placeholder while the
 * real file has not been generated yet (so nothing ever breaks).
 */
export function SmartImage({
  id,
  alt,
  sizes,
  className,
  imgClassName,
  quality = 60,
  priority = false,
  as = 'div',
  quietPlaceholder = false,
  style,
}: Props) {
  const entry = imageManifest[id];
  const Tag = as;
  if (!entry) return <Placeholder alt={alt} className={className} as={as} quiet={quietPlaceholder} style={style} />;
  return (
    <Tag className={cn('relative block overflow-hidden', className)} style={{ backgroundColor: entry.color, ...style }}>
      <Image
        src={entry.src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        placeholder="blur"
        blurDataURL={entry.blurDataURL}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        className={cn('object-cover', imgClassName)}
      />
    </Tag>
  );
}

export function Placeholder({
  alt,
  className,
  as = 'div',
  quiet = false,
  style,
}: {
  alt: string;
  className?: string;
  as?: 'div' | 'span';
  quiet?: boolean;
  style?: React.CSSProperties;
}) {
  const Tag = as;
  return (
    <Tag
      role="img"
      aria-label={`${alt} (photograph coming soon)`}
      className={cn('placeholder relative isolate block overflow-hidden bg-sand', className)}
      style={style}
    >
      <MoonMark className="absolute left-1/2 top-1/2 size-[clamp(18px,14%,64px)] -translate-x-1/2 -translate-y-1/2 text-ink/15" />
      {quiet ? null : (
        <span className="absolute inset-x-0 bottom-0 block p-3 text-center text-small text-ink-soft" aria-hidden="true">
          Photograph coming soon
        </span>
      )}
    </Tag>
  );
}
