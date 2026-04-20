import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AffiliateLink from "@/components/shared/affiliate-link";
import AffiliateDisclosure from "@/components/shared/affiliate-disclosure";
import { Badge } from "@/components/ui/badge";
import { getHotelLink, getMedEvacLink } from "@/lib/affiliate-config";
import { cn } from "@/lib/utils/cn";
import {
  GUIDES,
  getGuideBySlug,
  getAllGuideSlugs,
  type GuideCategory,
  type GuideSection,
  type GuideQA,
} from "@/lib/data/guides";

/* ------------------------------------------------------------------ */
/*  Category styling                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Static Generation                                                  */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ "guide-slug": slug }));
}

export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ "guide-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "guide-slug": slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | CruiseKit`,
    description: guide.description,
    keywords: [
      guide.title,
      "cruise guide",
      "cruise tips",
      `${guide.category} cruise`,
      "cruise advice 2026",
    ],
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.updatedDate,
      modifiedTime: guide.updatedDate,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  JSON-LD Article Schema                                             */
/* ------------------------------------------------------------------ */

function ArticleJsonLd({
  guide,
}: {
  guide: {
    title: string;
    description: string;
    updatedDate: string;
    slug: string;
    sections: GuideSection[];
  };
}) {
  const faqs = guide.sections.flatMap((s) =>
    s.content.map((qa) => ({
      "@type": "Question" as const,
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: qa.answer,
      },
    }))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.updatedDate,
        dateModified: guide.updatedDate,
        author: {
          "@type": "Organization",
          name: "CruiseKit",
          url: "https://cruisekit.com",
        },
        publisher: {
          "@type": "Organization",
          name: "CruiseKit",
          url: "https://cruisekit.com",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://cruisekit.com/guides/${guide.slug}`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs,
      },
    ],
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
/*  Table of Contents (Client wrapper)                                 */
/* ------------------------------------------------------------------ */

function TableOfContentsDesktop({
  sections,
}: {
  sections: GuideSection[];
}) {
  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          In this guide
        </p>
        <ul className="space-y-1.5 border-l-2 border-gray-100 pl-4">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block text-sm text-gray-500 transition-colors hover:text-navy"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  QA Card component                                                  */
/* ------------------------------------------------------------------ */

function QACard({ qa }: { qa: GuideQA }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <h3 className="text-base font-bold leading-snug text-navy sm:text-lg">
        {qa.question}
      </h3>
      {qa.appliesTo && (
        <span className="mt-1.5 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
          {qa.appliesTo}
        </span>
      )}
      <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-[15px] sm:leading-relaxed">
        {qa.answer}
      </p>
      {qa.productRecommendation && (
        <div className="mt-4 rounded-lg border border-teal/20 bg-teal/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-dark">
            Recommended
          </p>
          <p className="mt-1 text-sm font-semibold text-navy">
            {qa.productRecommendation.name}
          </p>
          <p className="mt-0.5 text-xs text-gray-600">
            {qa.productRecommendation.description}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Related Guides                                                     */
/* ------------------------------------------------------------------ */

function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const related = GUIDES.filter((g) => g.slug !== currentSlug).slice(0, 3);

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
        More Cruise Guides
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {related.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={cn(
              "group flex flex-col rounded-xl border border-gray-200 bg-white p-5",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            )}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{guide.icon}</span>
              <Badge
                className={cn(
                  "text-[10px]",
                  CATEGORY_COLORS[guide.category]
                )}
              >
                {CATEGORY_LABELS[guide.category]}
              </Badge>
            </div>
            <h3 className="mb-1 text-sm font-bold text-navy group-hover:text-teal transition-colors">
              {guide.title}
            </h3>
            <p className="text-xs text-gray-500">{guide.readTime}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Banners                                                        */
/* ------------------------------------------------------------------ */

function CtaBanners({ slug }: { slug: string }) {
  return (
    <div className="mt-12 space-y-4">
      {/* Calculator CTA — show on drink-package and tipping guides */}
      {(slug === "drink-package-guide" || slug === "cruise-tipping-guide") && (
        <Link
          href="/calculator"
          className={cn(
            "flex items-center justify-between rounded-xl border-2 border-teal/30 bg-teal/5 p-6",
            "transition-all hover:border-teal/50 hover:bg-teal/10"
          )}
        >
          <div>
            <p className="text-lg font-bold text-navy">
              Use our True Cost Calculator
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

      {/* Port planner CTA — show on port-day guide */}
      {slug === "port-day-tips" && (
        <Link
          href="/ports"
          className={cn(
            "flex items-center justify-between rounded-xl border-2 border-success/30 bg-success/5 p-6",
            "transition-all hover:border-success/50 hover:bg-success/10"
          )}
        >
          <div>
            <p className="text-lg font-bold text-navy">
              Browse our Port Day Planner
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Explore ports of call, find excursions, and build day-by-day
              itineraries for every stop on your voyage.
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

      {/* Medjet CTA — show on first-timer, packing, port-day, and insurance guides */}
      {["first-time-cruise-guide", "cruise-packing-list", "port-day-tips", "cruise-insurance-explained"].includes(slug) && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-navy">
                Don&apos;t skip medical evacuation coverage
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Helicopter medical evacuations from a cruise ship can cost
                $50,000 or more. Trip insurance typically covers the nearest
                facility — Medjet covers transport to your home hospital.
              </p>
              <AffiliateLink
                href={getMedEvacLink("https://www.medjetassist.com/")}
                partner="medjet"
                source={`guide-${slug}`}
                className={cn(
                  "mt-3 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                  "bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                )}
              >
                Learn about Medjet
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </AffiliateLink>
              <AffiliateDisclosure className="mt-2" />
            </div>
          </div>
        </div>
      )}

      {/* Booking.com CTA — show on first-timer guide */}
      {slug === "first-time-cruise-guide" && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <svg
                className="h-6 w-6"
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
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-navy">
                Fly in the night before — always
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Missing embarkation because of a flight delay is the #1 cause
                of a ruined first cruise. Book a hotel near the port the night
                before sailing.
              </p>
              <AffiliateLink
                href={getHotelLink("https://www.booking.com/")}
                partner="booking.com"
                source={`guide-${slug}`}
                className={cn(
                  "mt-3 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                  "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                )}
              >
                Search pre-cruise hotels
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </AffiliateLink>
              <AffiliateDisclosure className="mt-2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Table of Contents                                           */
/* ------------------------------------------------------------------ */

function MobileTableOfContents({
  sections,
}: {
  sections: GuideSection[];
}) {
  return (
    <details className="mb-8 rounded-xl border border-gray-200 bg-white lg:hidden">
      <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          Table of Contents
        </span>
        <svg
          className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <ul className="border-t border-gray-100 p-4 pt-3 space-y-1.5">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-navy"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function GuideDetailPage({ params }: Props) {
  const { "guide-slug": slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  return (
    <>
      <ArticleJsonLd guide={guide} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
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
                    href="/guides"
                    className="transition-colors hover:text-navy"
                  >
                    Guides
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
                  <span className="font-medium text-gray-700">
                    {guide.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Category badge */}
            <div className="mb-3">
              <Badge
                className={cn(
                  "text-xs",
                  CATEGORY_COLORS[guide.category]
                )}
              >
                {CATEGORY_LABELS[guide.category]}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              {guide.title}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {guide.readTime}
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
                Updated{" "}
                {new Date(guide.updatedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 xl:grid-cols-[260px_1fr]">
            {/* Desktop sidebar TOC */}
            <TableOfContentsDesktop sections={guide.sections} />

            {/* Main content */}
            <div className="min-w-0">
              {/* Mobile TOC */}
              <MobileTableOfContents sections={guide.sections} />

              {/* Sections */}
              <div className="space-y-12">
                {guide.sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
                      {section.title}
                    </h2>
                    <div className="space-y-4">
                      {section.content.map((qa) => (
                        <QACard key={qa.question} qa={qa} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <CtaBanners slug={guide.slug} />

              {/* Related Guides */}
              <RelatedGuides currentSlug={guide.slug} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
