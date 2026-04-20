import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

import { getAllPortSlugs } from '@/lib/data/ports';
import { getAllGuideSlugs } from '@/lib/data/guides';
import { getAllBlogSlugs } from '@/lib/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cruisekit.app';

  /* ---- Static pages ------------------------------------------------ */
  const staticPages = [
    '',
    '/calculator',
    '/cruises',
    '/compare',
    '/ports',
    '/guides',
    '/blog',
    '/about',
    '/contact',
    '/faq',
    '/help',
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
  const blogPages = getAllBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...portPages, ...guidePages, ...blogPages];
}
