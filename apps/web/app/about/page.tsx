import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About — The Cruise Planning Toolkit",
  description:
    "CruiseKit is an independent cruise planning toolkit built by a solo developer, with true-cost estimates, MyDay planning, spend tracking, port guides, and MyCrew check-ins.",
  alternates: { canonical: "/about/" },
  keywords: [
    "about cruisekit",
    "cruise planning tool",
    "cruise cost calculator",
    "independent cruise toolkit",
    "cruise toolkit technology",
  ],
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
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
                  <span className="font-medium text-gray-700">About</span>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              About CruiseKit
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              An independent cruise planning toolkit. Not a travel agency.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8 text-base leading-relaxed text-gray-700">
            <p>
              CruiseKit is an independent cruise planning toolkit built for
              cruisers who want to know what a trip actually costs before they
              book. We are not a travel agency, we don&rsquo;t sell cruises,
              and we don&rsquo;t take bookings. Instead, we give you the
              data and tools to make smarter decisions on your own.
            </p>

            <p>
              The platform is built and maintained by a solo developer who got
              tired of the same problem every cruiser faces: the advertised
              fare is never the real price. Between mandatory gratuities,
              drink packages, Wi-Fi, excursions, and specialty dining, the
              true cost of a cruise can be 40-60% higher than the sticker
              price. CruiseKit exists to make that gap visible.
            </p>

            <h2 className="text-2xl font-bold text-navy pt-4">
              Before and During Your Cruise
            </h2>
            <p>
              The website helps you estimate the trip before you go. The mobile
              app keeps the onboard experience simple with three tabs:
              MyDay, Spend, and More.
            </p>
            <ul className="space-y-3 pl-1">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  1
                </span>
                <span>
                  <strong className="text-navy">True Cost Calculator</strong>{" "}
                  &mdash; Estimate the advertised fare plus common add-ons such
                  as gratuities, drinks, Wi-Fi, excursions, and dining.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  2
                </span>
                <span>
                  <strong className="text-navy">MyDay</strong> &mdash; Keep
                  your saved itinerary, route context, cruise-day schedule,
                  clocks, and all-aboard reference together.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  3
                </span>
                <span>
                  <strong className="text-navy">Spend</strong> &mdash; Log
                  onboard purchases and compare the running total with the
                  budget attached to your saved cruise.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  4
                </span>
                <span>
                  <strong className="text-navy">Ports</strong> &mdash; Open
                  More, then Ports, to see the stops on your saved itinerary
                  and open their map snapshots and guides.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  5
                </span>
                <span>
                  <strong className="text-navy">MyCrew</strong> &mdash; Open
                  Crew check-in under More to share manual status updates
                  without constant location tracking.
                </span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-navy pt-4">
              Why We Built This
            </h2>
            <p>
              Cruise lines are great at selling a dream but not always
              transparent about the total cost. A $499 Caribbean cruise can
              easily become $900+ per person once you factor in gratuities,
              beverage packages, Wi-Fi, and port excursions. Most comparison
              sites only show the base fare because they earn commissions on
              bookings &mdash; they have no incentive to highlight the extras.
            </p>
            <p>
              CruiseKit flips that model. We show you the full picture first,
              then let you decide. Some of our links are affiliate links and
              we may earn a small commission if you make a purchase through
              them, but our recommendations and data are never influenced by those
              partnerships.
            </p>

            <h2 className="text-2xl font-bold text-navy pt-4">
              Our Technology
            </h2>
            <p>
              CruiseKit is built on a curated cruise data model and
              safety-focused planning technology. Every tool on the platform
              is designed around transparent sources, practical estimates, and
              real-world cruising conditions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
