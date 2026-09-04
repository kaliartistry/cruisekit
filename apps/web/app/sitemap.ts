import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

import { getAllPortSlugs } from '@/lib/data/ports';
import { getAllGuideSlugs } from '@/lib/data/guides';
import { getIndexableBlogSlugs } from '@/lib/data/blog-posts';

const BASE_URL = 'https://cruisekit.app';

export function toCanonicalSitemapUrl(path = ''): string {
  const normalizedPath = path === '' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  return `${BASE_URL}${normalizedPath}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  /* ---- Static pages ------------------------------------------------ */
  const staticPages = [
    '',
    '/app',
    '/cruisekit-public-information',
    '/what-is-cruisekit',
    '/cruisekit-facts',
    '/ship-time-vs-port-time',
    '/cruise-group-check-in-app',
    '/calculator',
    '/cruise-drink-package-calculator',
    '/cruise-gratuity-calculator',
    '/cruise-payment-deadline-calculator',
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
    '/account-deletion',
    '/terms',
    '/loyalty',
    '/myday',
    '/methodology',
  ].map((path) => ({
    url: toCanonicalSitemapUrl(path),
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
    'virgin-voyages',
  ].map((slug) => ({
    url: toCanonicalSitemapUrl(`/calculator/${slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  /* ---- Dynamic port pages ------------------------------------------ */
  const portPages = getAllPortSlugs().map((slug) => ({
    url: toCanonicalSitemapUrl(`/ports/${slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  /* ---- Dynamic guide pages ----------------------------------------- */
  const guidePages = getAllGuideSlugs()
    .filter((slug) => slug !== 'cruise-tipping-guide')
    .map((slug) => ({
    url: toCanonicalSitemapUrl(`/guides/${slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    }));

  /* ---- Dynamic blog pages ------------------------------------------ */
  const blogPages = getIndexableBlogSlugs().map((slug) => ({
    url: toCanonicalSitemapUrl(`/blog/${slug}`),
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
