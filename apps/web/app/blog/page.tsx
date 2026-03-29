"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  type BlogCategory,
} from "@/lib/data/blog-posts";

/* ------------------------------------------------------------------ */
/*  Category badge color mapping                                       */
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
/*  Featured Hero Card                                                 */
/* ------------------------------------------------------------------ */

function FeaturedCard({
  post,
}: {
  post: (typeof BLOG_POSTS)[number];
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white",
        "shadow-[var(--shadow-sm)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
        "md:flex-row"
      )}
    >
      {/* Featured image */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-gradient-to-br from-navy/10 to-teal/10 md:h-auto md:w-[45%]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 45vw"
          priority
        />
        <div className="absolute left-4 top-4">
          <Badge
            className={cn(
              "text-[11px] shadow-sm",
              CATEGORY_COLORS[post.category]
            )}
          >
            {CATEGORY_LABELS[post.category]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal">
          Featured Post
        </p>
        <h2 className="mb-3 text-xl font-bold leading-snug text-navy group-hover:text-teal transition-colors sm:text-2xl lg:text-3xl">
          {post.title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 sm:text-base">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span>{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span>
            {new Date(post.publishedDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Blog Card                                                          */
/* ------------------------------------------------------------------ */

function BlogCard({
  post,
}: {
  post: (typeof BLOG_POSTS)[number];
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white",
        "shadow-[var(--shadow-sm)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
      )}
    >
      {/* Featured image */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-navy/10 to-teal/10">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3">
          <Badge
            className={cn(
              "text-[11px]",
              CATEGORY_COLORS[post.category]
            )}
          >
            {CATEGORY_LABELS[post.category]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 text-lg font-bold leading-snug text-navy group-hover:text-teal transition-colors">
          {post.title}
        </h2>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<
    BlogCategory | "all"
  >("all");

  const sorted = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() -
      new Date(a.publishedDate).getTime()
  );

  const featured = sorted[0];
  const filtered =
    activeCategory === "all"
      ? sorted
      : sorted.filter((p) => p.category === activeCategory);

  // For the grid, exclude the featured post when showing "all"
  const gridPosts =
    activeCategory === "all"
      ? filtered.filter((p) => p.slug !== featured?.slug)
      : filtered;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
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
                  <span className="font-medium text-gray-700">Blog</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              CruiseKit Blog
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              Cruise tips, cost breakdowns, port guides, and expert
              comparisons. Real data, no fluff.
            </p>
          </div>
        </section>

        {/* Category Filters + Cards */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Filter buttons */}
          <div className="mb-8 flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === cat.key
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-navy"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured post — only show when viewing all posts */}
          {activeCategory === "all" && featured && (
            <div className="mb-10">
              <FeaturedCard post={featured} />
            </div>
          )}

          {/* Blog cards grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
              <p className="text-lg font-medium text-gray-500">
                No posts in this category yet — check back soon.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
