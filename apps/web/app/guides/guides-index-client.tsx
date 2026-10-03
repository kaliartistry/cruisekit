"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  GUIDES,
  GUIDE_CATEGORIES,
  type GuideCategory,
} from "@/lib/data/guides";

const CATEGORY_COLORS: Record<GuideCategory, string> = {
  "first-timer": "bg-teal/10 text-teal-dark",
  packing: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
  budget: "bg-coral/10 text-coral-dark",
  onboard: "bg-success-light text-success",
  "port-days": "bg-warning-light text-warning",
  insurance: "bg-amber-100 text-amber-700",
};

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  "first-timer": "First-Timer",
  packing: "Packing",
  budget: "Budget",
  onboard: "Onboard",
  "port-days": "Port Days",
  insurance: "Insurance",
};

const GUIDE_VISUALS: Record<string, { src: string; alt: string }> = {
  "first-time-cruise-guide": {
    src: "/assets/app-screenshots/myday-itinerary.png",
    alt: "CruiseKit itinerary screen for planning a first cruise",
  },
  "cruise-packing-list": {
    src: "/assets/ships/oasis-of-the-seas.jpg",
    alt: "Cruise ship at sea for cruise packing planning",
  },
  "drink-package-guide": {
    src: "/assets/ports/cozumel.jpg",
    alt: "Cozumel cruise port waterfront",
  },
  "cruise-tipping-guide": {
    src: "/assets/ships/carnival-celebration.jpg",
    alt: "Cruise ship used for onboard tipping planning",
  },
  "port-day-tips": {
    src: "/assets/ports/nassau.jpg",
    alt: "Nassau cruise port for port-day planning",
  },
  "cruise-insurance-explained": {
    src: "/assets/ports/san-juan.jpg",
    alt: "San Juan cruise port used for travel insurance context",
  },
};

export default function GuidesIndexClient() {
  const [activeCategory, setActiveCategory] = useState<
    GuideCategory | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? GUIDES
      : GUIDES.filter((guide) => guide.category === activeCategory);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide) => {
          const visual = GUIDE_VISUALS[guide.slug] ?? GUIDE_VISUALS["first-time-cruise-guide"];

          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className={cn(
                "group flex min-h-[430px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white",
                "shadow-[var(--shadow-sm)] transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
              )}
            >
              <div className="relative aspect-[16/10] bg-gray-100">
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
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

                <h2 className="mb-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-teal">
                  {guide.title}
                </h2>

                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">
                  {guide.description}
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-medium text-gray-400">
                    {guide.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal transition-colors group-hover:text-teal-dark">
                    Read Guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
          <p className="text-lg font-medium text-gray-500">
            No guides in this category yet. Check back soon.
          </p>
        </div>
      )}
    </section>
  );
}
