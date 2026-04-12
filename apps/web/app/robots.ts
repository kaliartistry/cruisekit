import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/my-trips/'],
    },
    sitemap: 'https://cruisekit.app/sitemap.xml',
  };
}
