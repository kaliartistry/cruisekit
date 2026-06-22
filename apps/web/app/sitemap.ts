import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

import { getAllPortSlugs } from '@/lib/data/ports';
import { getAllGuideSlugs } from '@/lib/data/guides';
import { getIndexableBlogSlugs } from '@/lib/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cruisekit.app';

  /* ---- Static pages ------------------------------------------------ */
  const staticPages = [
    '',
    '/app',
    '/calculator',
    '/cruise-costs',
    '/cruises',
    '/compare',
    '/features/cruise-route-map',
    '/features/cruise-port-guides',
    '/features/explore-map',
    '/features/cruise-itinerary-planner',
    '/groups',
    '/ports',
    '/guides',
    '/blog',
    '/ai/cruisekit-summary',
    '/about',
    '/contact',
    '/affiliate-disclosure',
    '/faq',
    '/help',
    '/how-we-make-money',
    '/privacy',
    '/terms',
    '/loyalty',
    '/myday',
    '/methodology',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  /* ---- Existing line calculator pages with mapped demand ------------ */
  const lineCalculatorPages = [
    'royal-caribbean',
    'carnival',
    'norwegian',
    'msc',
    'disney',
    'celebrity',
    'princess',
    'holland-america',
  ].map((slug) => ({
    url: `${baseUrl}/calculator/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  /* ---- Dynamic port pages ------------------------------------------ */
  const portPages = getAllPortSlugs().map((slug) => ({
    url: `${baseUrl}/ports/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  /* ---- Dynamic guide pages ----------------------------------------- */
  const guidePages = getAllGuideSlugs().map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  /* ---- Dynamic blog pages ------------------------------------------ */
  const blogPages = getIndexableBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...lineCalculatorPages,
    ...portPages,
    ...guidePages,
    ...blogPages,
  ];
}
