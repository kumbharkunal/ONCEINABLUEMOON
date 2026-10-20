import type { NextConfig } from 'next';

const indexable = process.env.NEXT_PUBLIC_INDEXABLE === 'true';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    // One page, Tailwind, first-time visitors from a WhatsApp link: inline the CSS (no render-blocking request).
    inlineCss: true,
    optimizePackageImports: ['motion', 'gsap'],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
    // Fewer candidate widths = shorter srcset strings (they appear in the HTML and the RSC payload).
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 256, 384],
    remotePatterns: [new URL('https://i.ytimg.com/vi/**')],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    return [
      {
        source: '/:path*',
        headers: indexable ? security : [...security, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/images/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
