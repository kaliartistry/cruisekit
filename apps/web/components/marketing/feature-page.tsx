import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Map,
  MapPinned,
  Route,
  XCircle,
} from "lucide-react";
import { StoreButtonRow } from "@/components/shared/store-buttons";
import { cn } from "@/lib/utils/cn";

export type FeatureFaq = {
  question: string;
  answer: string;
};

export type FeatureLink = {
  label: string;
  href: string;
};

export type FeatureVisual = "route" | "port-card" | "explore-map" | "planner";

export type FeaturePageProps = {
  title: string;
  description: string;
  shortAnswer: string;
  canonicalPath: string;
  visual: FeatureVisual;
  featureBullets: string[];
  does: string[];
  doesNot: string[];
  faqs: FeatureFaq[];
  relatedLinks?: FeatureLink[];
};

export function FeaturePage({
  title,
  description,
  shortAnswer,
  canonicalPath,
  visual,
  featureBullets,
  does,
  doesNot,
  faqs,
  relatedLinks = [],
}: FeaturePageProps) {
  const canonicalUrl = `https://cruisekit.app${canonicalPath}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: {
          "@type": "WebSite",
          name: "CruiseKit",
          url: "https://cruisekit.app",
        },
        about: {
          "@type": "SoftwareApplication",
          name: "CruiseKit",
          applicationCategory: "TravelApplication",
          operatingSystem: "iOS, Android",
          url: "https://cruisekit.app",
        },
        breadcrumb: {
          "@id": `${canonicalUrl}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://cruisekit.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
              <Link href="/" className="hover:text-navy">
                Home
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <span>Features</span>
            </nav>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              {description}
            </p>
            <div className="mt-7 rounded-2xl border border-teal/25 bg-seafoam/55 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-dark">
                Short answer
              </p>
              <p className="mt-2 text-base font-semibold leading-7 text-navy">
                {shortAnswer}
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal"
              >
                Download CruiseKit
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <Link
                href="/ports"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal"
              >
                Explore cruise ports
              </Link>
            </div>
          </div>
          <FeatureVisualCard visual={visual} />
        </div>
      </section>

      <section className="bg-gray-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Map-style planning without turning CruiseKit into a directions app
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                CruiseKit maps are built for planning and destination discovery.
                The app helps travelers understand where they are sailing,
                compare ports, and preview cruise days before they go.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureBullets.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--shadow-sm)]"
                >
                  <CheckCircle2 className="mb-3 h-5 w-5 text-teal" />
                  <p className="text-sm font-semibold leading-6 text-navy">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <FeatureBoundaryList
            title="What CruiseKit does"
            items={does}
            positive
          />
          <FeatureBoundaryList
            title="What CruiseKit does not do"
            items={doesNot}
          />
        </div>
      </section>

      <FeatureFaqSection faqs={faqs} />

      <section className="bg-navy py-14 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Plan cruise days visually.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/70">
              CruiseKit is free during launch and includes core cruise planning,
              destination discovery, and itinerary visualization tools.
            </p>
            {relatedLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/82 transition-colors hover:border-teal hover:text-white"
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <StoreButtonRow sourceSurface="other" variant="dark" />
        </div>
      </section>
    </>
  );
}

function FeatureVisualCard({ visual }: { visual: FeatureVisual }) {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-[var(--shadow-lg)]">
      {visual === "route" && <RouteVisual />}
      {visual === "port-card" && <PortCardVisual />}
      {visual === "explore-map" && <ExploreMapVisual />}
      {visual === "planner" && <PlannerVisual />}
    </div>
  );
}

function RouteVisual() {
  const stops = ["Miami", "Nassau", "At Sea", "Cozumel", "Miami"];
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-8 flex items-center gap-2 text-sm font-bold text-navy">
        <Route className="h-5 w-5 text-teal" />
        Visual route map
      </div>
      <div className="relative">
        <div className="absolute left-10 right-10 top-7 h-1 rounded-full bg-teal/20" />
        <div className="relative grid grid-cols-5 gap-2">
          {stops.map((stop, index) => (
            <div key={`${stop}-${index}`} className="text-center">
              <div
                className={cn(
                  "mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white shadow-sm",
                  stop === "At Sea"
                    ? "border-ocean text-ocean"
                    : "border-teal text-teal",
                )}
              >
                {stop === "At Sea" ? (
                  <Compass className="h-6 w-6" />
                ) : (
                  <MapPinned className="h-6 w-6" />
                )}
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Day {index + 1}
              </p>
              <p className="mt-1 text-sm font-bold text-navy">{stop}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortCardVisual() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)]">
        <div className="mb-5 h-36 rounded-xl bg-[linear-gradient(135deg,rgba(0,180,216,.18),rgba(244,232,209,.92))] p-4">
          <div className="flex h-full items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-dark">
                Destination Snapshot
              </p>
              <p className="mt-1 text-2xl font-extrabold text-navy">Cozumel</p>
              <p className="text-sm font-semibold text-ocean">Mexico</p>
            </div>
            <Map className="h-12 w-12 text-teal" strokeWidth={1.8} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Walkability 3/10", "Docked", "MXN currency", "Good cell coverage"].map(
            (item) => (
              <div
                key={item}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-navy"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function ExploreMapVisual() {
  const pins = [
    ["Nassau", "left-[18%] top-[18%]"],
    ["Cozumel", "left-[54%] top-[44%]"],
    ["St. Thomas", "left-[68%] top-[23%]"],
    ["Aruba", "left-[42%] top-[70%]"],
  ] as const;
  return (
    <div className="relative h-full min-h-[320px] rounded-xl bg-seafoam">
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_28%_32%,rgba(244,232,209,.96)_0_18%,transparent_19%),radial-gradient(circle_at_72%_48%,rgba(244,232,209,.9)_0_24%,transparent_25%)]" />
      {pins.map(([label, position]) => (
        <div
          key={label}
          className={cn(
            "absolute rounded-full border border-teal/30 bg-white px-3 py-1.5 text-xs font-bold text-navy shadow-md",
            position,
          )}
        >
          {label}
        </div>
      ))}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--shadow-md)]">
        <p className="text-sm font-extrabold text-navy">Tap a port pin</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          Preview country, region, walkability, tender status, and guide
          availability before opening the full port guide.
        </p>
      </div>
    </div>
  );
}

function PlannerVisual() {
  return (
    <div className="flex h-full flex-col gap-3">
      {[
        ["Day 1", "Miami", "Departure"],
        ["Day 2", "Nassau", "Port guide"],
        ["Day 3", "At Sea", "Sea day"],
        ["Day 4", "Cozumel", "Destination snapshot"],
      ].map(([day, title, detail]) => (
        <div
          key={day}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--shadow-sm)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-sm font-extrabold text-teal">
            {day.replace("Day ", "D")}
          </div>
          <div>
            <p className="text-base font-extrabold text-navy">{title}</p>
            <p className="text-sm text-gray-500">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureBoundaryList({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-sm)]">
      <h2 className="text-xl font-bold text-navy">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-gray-600">
            {positive ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureFaqSection({ faqs }: { faqs: FeatureFaq[] }) {
  return (
    <section className="bg-gray-50 py-14 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-navy">
          Cruise map planning FAQ
        </h2>
        <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {faqs.map((faq) => (
            <div key={faq.question} className="p-6">
              <h3 className="text-lg font-bold text-navy">{faq.question}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
