"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  GUIDES,
  GUIDE_CATEGORIES,
  type GuideCategory,
} from "@/lib/data/guides";

/* ------------------------------------------------------------------ */
/*  Category badge color mapping                                       */
/* ------------------------------------------------------------------ */

const CATEGORY_COLORS: Record<GuideCategory, string> = {
  "first-timer": "bg-teal/10 text-teal-dark",
  packing: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
  budget: "bg-coral/10 text-coral-dark",
  onboard: "bg-success-light text-success",
  "port-days": "bg-warning-light text-warning",
};

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  "first-timer": "First-Timer",
  packing: "Packing",
  budget: "Budget",
  onboard: "Onboard",
  "port-days": "Port Days",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState<
    GuideCategory | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? GUIDES
      : GUIDES.filter((g) => g.category === activeCategory);

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
                  <span className="font-medium text-gray-700">Guides</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Cruise Guides
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              Expert guides covering everything from first-time tips to drink
              package math. Written by cruisers, backed by data.
            </p>
          </div>
        </section>

        {/* Category Filters + Cards */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Filter buttons */}
          <div className="mb-8 flex flex-wrap gap-2">
            {GUIDE_CATEGORIES.map((cat) => (
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

          {/* Guide cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className={cn(
                  "group flex flex-col rounded-xl border border-gray-200 bg-white p-6",
                  "shadow-[var(--shadow-sm)] transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                )}
              >
                {/* Icon + Category */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl" role="img" aria-label={guide.category}>
                    {guide.icon}
                  </span>
                  <Badge
                    className={cn(
                      "text-[11px]",
                      CATEGORY_COLORS[guide.category]
                    )}
                  >
                    {CATEGORY_LABELS[guide.category]}
                  </Badge>
                </div>

                {/* Title */}
                <h2 className="mb-2 text-lg font-bold leading-snug text-navy group-hover:text-teal transition-colors">
                  {guide.title}
                </h2>

                {/* Description */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">
                  {guide.description}
                </p>

                {/* Footer: read time + CTA */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-medium text-gray-400">
                    {guide.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal transition-colors group-hover:text-teal-dark">
                    Read Guide
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
              <p className="text-lg font-medium text-gray-500">
                No guides in this category yet — check back soon.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
