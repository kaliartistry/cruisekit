import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About CruiseKit — The Cruise Planning Toolkit",
  description:
    "CruiseKit is an independent cruise planning toolkit built by a solo developer. Plan smarter with real cost data, port guides, group coordination, and more.",
  keywords: [
    "about cruisekit",
    "cruise planning tool",
    "cruise cost calculator",
    "independent cruise toolkit",
    "shipsafe sdk",
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
              The Five Pillars
            </h2>
            <p>
              Everything on CruiseKit is organized around five core pillars,
              each tackling a different part of the cruise planning journey:
            </p>
            <ul className="space-y-3 pl-1">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  1
                </span>
                <span>
                  <strong className="text-navy">Plan</strong> &mdash; The True
                  Cost Calculator breaks down every hidden fee across 9 major
                  cruise lines so you see the real price before you book.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  2
                </span>
                <span>
                  <strong className="text-navy">Explore</strong> &mdash; Port
                  guides with real traveler intel, walking distances, and
                  curated recommendations for every major cruise port.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  3
                </span>
                <span>
                  <strong className="text-navy">Coordinate</strong> &mdash;
                  Group Hub lets you plan with friends and family, split costs,
                  and keep everyone on the same page.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  4
                </span>
                <span>
                  <strong className="text-navy">MyDay</strong> &mdash;
                  Your daily cruise command center with schedule management,
                  onboard spend tracking, and real-time MyCrew coordination
                  so everyone stays connected.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                  5
                </span>
                <span>
                  <strong className="text-navy">Optimize</strong> &mdash; The
                  Loyalty Hub compares reward programs across cruise lines and
                  helps you find status-match opportunities.
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
              we earn a small commission if you book through them, but our
              recommendations and data are never influenced by those
              partnerships.
            </p>

            <h2 className="text-2xl font-bold text-navy pt-4">
              ShipSafe SDK
            </h2>
            <p>
              CruiseKit is powered by{" "}
              <a
                href="https://shipsafesdk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
              >
                ShipSafe SDK
              </a>
              , our B2B platform that provides cruise data infrastructure to
              travel apps and agencies. If you&rsquo;re building something in
              the cruise space, check it out.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
