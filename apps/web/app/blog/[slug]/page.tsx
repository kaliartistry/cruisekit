import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  BLOG_POSTS,
  getBlogPostBySlug,
  getAllBlogSlugs,
  getRelatedPosts,
  type BlogCategory,
  type BlogPost,
} from "@/lib/data/blog-posts";
import RelatedContent from "@/components/shared/related-content";

/* ------------------------------------------------------------------ */
/*  Cruise-line detection from post metadata                           */
/* ------------------------------------------------------------------ */

const CRUISE_LINE_TAG_MAP: Record<string, string> = {
  "royal caribbean": "royal-caribbean",
  rci: "royal-caribbean",
  carnival: "carnival",
  norwegian: "norwegian",
  ncl: "norwegian",
  msc: "msc",
  celebrity: "celebrity",
  princess: "princess",
  "holland america": "holland-america",
  disney: "disney",
  "virgin voyages": "virgin-voyages",
};

function detectCruiseLineId(post: BlogPost): string | undefined {
  // Check slug first for line-specific cost posts
  for (const [, id] of Object.entries(CRUISE_LINE_TAG_MAP)) {
    if (post.slug.startsWith(id + "-cruise-cost") || post.slug.includes(id)) {
      return id;
    }
  }
  // Then check tags
  for (const tag of post.tags) {
    const lower = tag.toLowerCase();
    for (const [keyword, id] of Object.entries(CRUISE_LINE_TAG_MAP)) {
      if (lower.includes(keyword)) return id;
    }
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Category styling                                                   */
/* ------------------------------------------------------------------ */

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  deals: "bg-coral/10 text-coral-dark",
  tips: "bg-teal/10 text-teal-dark",
  comparison: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
  news: "bg-success-light text-success",
  "port-guides": "bg-warning-light text-warning",
};

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  deals: "Deals",
  tips: "Tips",
  comparison: "Comparison",
  news: "News",
  "port-guides": "Port Guides",
};

/* ------------------------------------------------------------------ */
/*  Static Generation                                                  */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | CruiseKit Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.imageUrl, width: 1200, height: 630 }],
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.publishedDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  JSON-LD Article Schema                                             */
/* ------------------------------------------------------------------ */

function ArticleJsonLd({ post }: { post: BlogPost }) {
  const wordCount = post.content.reduce(
    (count, section) =>
      count +
      section.paragraphs.reduce(
        (pCount, p) => pCount + p.split(/\s+/).length,
        0
      ),
    0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://cruisekit.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CruiseKit",
      url: "https://cruisekit.com",
      logo: {
        "@type": "ImageObject",
        url: "https://cruisekit.com/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cruisekit.com/blog/${post.slug}`,
    },
    wordCount,
    keywords: post.tags.join(", "),
    articleSection: CATEGORY_LABELS[post.category],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Social Share Buttons                                               */
/* ------------------------------------------------------------------ */

function SocialShareButtons({ post }: { post: BlogPost }) {
  const url = `https://cruisekit.com/blog/${post.slug}`;
  const text = encodeURIComponent(post.title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5",
          "text-xs font-medium text-gray-600 transition-colors",
          "hover:border-gray-300 hover:text-navy"
        )}
        aria-label="Share on X (Twitter)"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X / Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5",
          "text-xs font-medium text-gray-600 transition-colors",
          "hover:border-gray-300 hover:text-navy"
        )}
        aria-label="Share on Facebook"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tags Section                                                       */
/* ------------------------------------------------------------------ */

function TagsSection({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Related Posts                                                       */
/* ------------------------------------------------------------------ */

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedPosts(currentSlug, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={cn(
              "group flex flex-col rounded-xl border border-gray-200 bg-white p-5",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            )}
          >
            <div className="mb-3 flex items-center gap-2">
              <Badge
                className={cn(
                  "text-[10px]",
                  CATEGORY_COLORS[post.category]
                )}
              >
                {CATEGORY_LABELS[post.category]}
              </Badge>
            </div>
            <h3 className="mb-2 text-sm font-bold text-navy group-hover:text-teal transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="mt-auto text-xs text-gray-500">{post.readTime}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Banners                                                        */
/* ------------------------------------------------------------------ */

function CtaBanners({ post }: { post: BlogPost }) {
  const showCalculator =
    post.category === "tips" || post.category === "comparison";
  const showDeals = post.category === "deals";
  const showPorts = post.category === "port-guides";

  return (
    <div className="mt-12 space-y-4">
      {showCalculator && (
        <Link
          href="/calculator"
          className={cn(
            "flex items-center justify-between rounded-xl border-2 border-teal/30 bg-teal/5 p-6",
            "transition-all hover:border-teal/50 hover:bg-teal/10"
          )}
        >
          <div>
            <p className="text-lg font-bold text-navy">
              Use Our True Cost Calculator
            </p>
            <p className="mt-1 text-sm text-gray-600">
              See your real cruise cost including drink packages, gratuities,
              WiFi, and excursions — no surprises.
            </p>
          </div>
          <svg
            className="h-6 w-6 shrink-0 text-teal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}

      {showDeals && (
        <Link
          href="/cruises"
          className={cn(
            "flex items-center justify-between rounded-xl border-2 border-coral/30 bg-coral/5 p-6",
            "transition-all hover:border-coral/50 hover:bg-coral/10"
          )}
        >
          <div>
            <p className="text-lg font-bold text-navy">Browse Cruise Deals</p>
            <p className="mt-1 text-sm text-gray-600">
              Compare real-time pricing from every major cruise line. Updated
              daily with the latest fares.
            </p>
          </div>
          <svg
            className="h-6 w-6 shrink-0 text-coral"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}

      {showPorts && (
        <Link
          href="/ports"
          className={cn(
            "flex items-center justify-between rounded-xl border-2 border-success/30 bg-success/5 p-6",
            "transition-all hover:border-success/50 hover:bg-success/10"
          )}
        >
          <div>
            <p className="text-lg font-bold text-navy">
              Explore Our Port Day Planner
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Detailed guides, safety scores, and excursion options for every
              Caribbean cruise port.
            </p>
          </div>
          <svg
            className="h-6 w-6 shrink-0 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd post={post} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-1 text-sm text-gray-500">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-navy"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-navy"
                  >
                    Blog
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="font-medium text-gray-700 line-clamp-1">
                    {post.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Category badge */}
            <div className="mb-3">
              <Badge
                className={cn("text-xs", CATEGORY_COLORS[post.category])}
              >
                {CATEGORY_LABELS[post.category]}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(post.publishedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Featured image */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <figure className="-mt-6 mb-10">
            <div className="relative h-56 overflow-hidden rounded-xl sm:h-72 lg:h-80">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
            <figcaption className="mt-2 text-center text-xs text-gray-400">
              {post.title}
            </figcaption>
          </figure>
        </div>

        {/* Article content */}
        <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
          <article className="prose prose-gray max-w-none">
            {post.content.map((section) => (
              <div
                key={section.heading}
                className="mb-10"
                id={section.heading
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")}
              >
                <h2 className="mb-4 text-xl font-bold tracking-tight text-navy sm:text-2xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="mb-4 text-[15px] leading-relaxed text-gray-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </article>

          {/* Divider */}
          <div className="my-10 border-t border-gray-200" />

          {/* Tags + Share row */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <TagsSection tags={post.tags} />
            <SocialShareButtons post={post} />
          </div>

          {/* CTAs */}
          <CtaBanners post={post} />

          {/* Related Content — internal linking */}
          <RelatedContent
            type="blog"
            cruiseLineId={detectCruiseLineId(post)}
            tags={post.tags}
          />

          {/* Related Posts */}
          <RelatedPosts currentSlug={post.slug} />
        </section>
      </main>
      <Footer />
    </>
  );
}
