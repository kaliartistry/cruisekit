import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { BLOG_POSTS, type BlogPost } from "@/lib/data/blog-posts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RelatedLink {
  href: string;
  title: string;
  description: string;
  icon: "calculator" | "deals" | "blog" | "port";
}

interface RelatedContentProps {
  type: "blog" | "port" | "calculator" | "deals";
  cruiseLineId?: string;
  portSlug?: string;
  tags?: string[];
}

/* ------------------------------------------------------------------ */
/*  Cruise-line display names                                          */
/* ------------------------------------------------------------------ */

const CRUISE_LINE_NAMES: Record<string, string> = {
  "royal-caribbean": "Royal Caribbean",
  carnival: "Carnival",
  norwegian: "Norwegian",
  msc: "MSC",
  celebrity: "Celebrity",
  princess: "Princess",
  "holland-america": "Holland America",
  disney: "Disney",
  "virgin-voyages": "Virgin Voyages",
};

/* ------------------------------------------------------------------ */
/*  Icon components                                                    */
/* ------------------------------------------------------------------ */

function LinkIcon({ type }: { type: RelatedLink["icon"] }) {
  const base = "h-5 w-5 shrink-0";

  switch (type) {
    case "calculator":
      return (
        <svg
          className={cn(base, "text-teal")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    case "deals":
      return (
        <svg
          className={cn(base, "text-coral")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      );
    case "blog":
      return (
        <svg
          className={cn(base, "text-[#8B5CF6]")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      );
    case "port":
      return (
        <svg
          className={cn(base, "text-success")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Link building logic                                                */
/* ------------------------------------------------------------------ */

function buildLinks({
  type,
  cruiseLineId,
  portSlug,
  tags,
}: RelatedContentProps): RelatedLink[] {
  const links: RelatedLink[] = [];

  /* ---- Blog context ---- */
  if (type === "blog") {
    // If we know the cruise line, link to its calculator & deals
    if (cruiseLineId) {
      const name = CRUISE_LINE_NAMES[cruiseLineId] ?? cruiseLineId;
      links.push({
        href: `/calculator/${cruiseLineId}`,
        title: `${name} Cost Calculator`,
        description: `See the real all-in cost of a ${name} cruise with our True Cost Calculator.`,
        icon: "calculator",
      });
      links.push({
        href: `/cruises?line=${cruiseLineId}`,
        title: `${name} Deals`,
        description: `Browse the latest ${name} fares updated daily.`,
        icon: "deals",
      });
    }

    // Related blog posts by tag overlap
    const relatedPosts = findRelatedByTags(tags, 3);
    for (const post of relatedPosts) {
      links.push({
        href: `/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt.slice(0, 90) + "...",
        icon: "blog",
      });
    }

    // Always offer the calculator if we haven't already
    if (!cruiseLineId) {
      links.push({
        href: "/calculator",
        title: "True Cost Calculator",
        description:
          "Compare the real all-in cost of any cruise across every major line.",
        icon: "calculator",
      });
    }
  }

  /* ---- Port context ---- */
  if (type === "port") {
    links.push({
      href: "/cruises" + (portSlug ? `?port=${portSlug}` : ""),
      title: "Deals Stopping Here",
      description: "Find cruises with this port on the itinerary.",
      icon: "deals",
    });
    links.push({
      href: "/calculator",
      title: "True Cost Calculator",
      description:
        "See the real all-in price before you book, including excursion costs.",
      icon: "calculator",
    });
    const portPosts = BLOG_POSTS.filter(
      (p) =>
        p.category === "port-guides" ||
        p.tags.some((t) => t.toLowerCase().includes("port"))
    ).slice(0, 2);
    for (const post of portPosts) {
      links.push({
        href: `/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt.slice(0, 90) + "...",
        icon: "blog",
      });
    }
  }

  /* ---- Calculator context ---- */
  if (type === "calculator") {
    if (cruiseLineId) {
      const name = CRUISE_LINE_NAMES[cruiseLineId] ?? cruiseLineId;
      links.push({
        href: `/cruises?line=${cruiseLineId}`,
        title: `${name} Deals`,
        description: `See live ${name} fares to pair with your cost estimate.`,
        icon: "deals",
      });
      // Find blog posts mentioning this cruise line
      const linePosts = BLOG_POSTS.filter((p) =>
        p.tags.some(
          (t) =>
            t.toLowerCase().includes(name.toLowerCase()) ||
            t.toLowerCase().includes(cruiseLineId)
        )
      ).slice(0, 2);
      for (const post of linePosts) {
        links.push({
          href: `/blog/${post.slug}`,
          title: post.title,
          description: post.excerpt.slice(0, 90) + "...",
          icon: "blog",
        });
      }
    }
    links.push({
      href: "/ports",
      title: "Port Day Planner",
      description:
        "Plan your shore days with safety scores and excursion guides.",
      icon: "port",
    });
    links.push({
      href: "/cruises",
      title: "Browse All Deals",
      description: "Compare real-time pricing from every major cruise line.",
      icon: "deals",
    });
  }

  /* ---- Deals context ---- */
  if (type === "deals") {
    links.push({
      href: "/calculator",
      title: "True Cost Calculator",
      description:
        "See the total cost including drink packages, gratuities, and WiFi.",
      icon: "calculator",
    });
    if (cruiseLineId) {
      const name = CRUISE_LINE_NAMES[cruiseLineId] ?? cruiseLineId;
      const linePosts = BLOG_POSTS.filter((p) =>
        p.tags.some(
          (t) =>
            t.toLowerCase().includes(name.toLowerCase()) ||
            t.toLowerCase().includes(cruiseLineId)
        )
      ).slice(0, 2);
      for (const post of linePosts) {
        links.push({
          href: `/blog/${post.slug}`,
          title: post.title,
          description: post.excerpt.slice(0, 90) + "...",
          icon: "blog",
        });
      }
    }
    links.push({
      href: "/ports",
      title: "Port Day Planner",
      description:
        "Explore every port on your itinerary before you book.",
      icon: "port",
    });
  }

  // De-duplicate by href and limit to 6
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  }).slice(0, 6);
}

/* ------------------------------------------------------------------ */
/*  Tag-matching helper                                                */
/* ------------------------------------------------------------------ */

function findRelatedByTags(
  tags: string[] | undefined,
  limit: number
): BlogPost[] {
  if (!tags || tags.length === 0) return BLOG_POSTS.slice(0, limit);

  const lower = tags.map((t) => t.toLowerCase());
  const scored = BLOG_POSTS.map((post) => {
    const overlap = post.tags.filter((t) =>
      lower.some((lt) => t.toLowerCase().includes(lt) || lt.includes(t.toLowerCase()))
    ).length;
    return { post, overlap };
  })
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);

  return scored.slice(0, limit).map((s) => s.post);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RelatedContent(props: RelatedContentProps) {
  const links = buildLinks(props);

  if (links.length === 0) return null;

  return (
    <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50/60 p-6 sm:p-8">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-navy">
        Related on CruiseKit
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            )}
          >
            <div className="mt-0.5">
              <LinkIcon type={link.icon} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy group-hover:text-teal transition-colors leading-snug line-clamp-2">
                {link.title}
              </p>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {link.description}
              </p>
            </div>
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-teal"
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
        ))}
      </div>
    </div>
  );
}
