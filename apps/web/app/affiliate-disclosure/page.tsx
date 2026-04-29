import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — CruiseKit",
  description:
    "FTC-required disclosure of CruiseKit's affiliate relationships, what they mean for our recommendations, and what they don't change.",
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Affiliate Disclosure
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: April 28, 2026
          </p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-gray-700">
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                The short version
              </h2>
              <p>
                CruiseKit (cruisekit.app) participates in affiliate programs.
                When you click a link on this site and complete a purchase on a
                partner&rsquo;s site, that partner may pay us a commission.
                You pay the same price you would pay going direct.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                Where you&rsquo;ll see affiliate links
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  &ldquo;Check current price&rdquo; buttons on cruise listings
                  &mdash; these go to a cruise line&rsquo;s booking page
                  (sometimes routed through an affiliate network like Awin or
                  CJ).
                </li>
                <li>
                  Shore excursion suggestions on port pages &mdash; routed
                  through Viator (direct partner) or GetYourGuide (via Awin).
                </li>
                <li>
                  Pre- and post-cruise hotel suggestions &mdash; routed
                  through Booking.com via Awin.
                </li>
                <li>
                  Travel insurance and medical evacuation suggestions &mdash;
                  routed through Medjet (Awin) and other approved partners.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                What this changes for you
              </h2>
              <p className="mb-3">
                <strong>Nothing about the price.</strong> Every affiliate link
                takes you to the partner&rsquo;s normal checkout. You will pay
                the partner&rsquo;s posted rate. We never mark up, and our
                commission comes out of the partner&rsquo;s margin, not yours.
              </p>
              <p>
                <strong>What it changes about us:</strong> commission revenue
                is the only way the calculator, port guides, and planning tools
                stay free. There are no display ads on this site and we do not
                sell user data. See{" "}
                <Link
                  href="/how-we-make-money"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
                >
                  How we make money
                </Link>{" "}
                for the full picture.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                What does NOT influence our recommendations
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Higher commission rates do not bump partners up
                  the page.</strong> Cruise lines, excursion providers, and
                  hotels are listed in price-, rating-, or relevance-sorted
                  order; the affiliate program a brand uses does not change
                  its ranking.
                </li>
                <li>
                  <strong>Cruise lines do not pay us directly.</strong> We
                  have no financial relationship with Royal Caribbean,
                  Carnival, Norwegian, MSC, Celebrity, Princess, Holland
                  America, Disney, or Virgin Voyages. Reviews and comparisons
                  are written from public information and our own research.
                </li>
                <li>
                  <strong>The True Cost Calculator does not weight partner
                  pricing favorably.</strong> The breakdown is built from
                  industry averages and per-line policies; partner status has
                  no input.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                FTC compliance
              </h2>
              <p>
                In line with the U.S. Federal Trade Commission&rsquo;s
                Endorsement Guides (16 CFR Part 255), every page that contains
                an affiliate CTA carries a visible disclosure. If you ever see
                a recommendation that earns us a commission and isn&rsquo;t
                disclosed, please email{" "}
                <a
                  href="mailto:hello@cruisekit.app"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
                >
                  hello@cruisekit.app
                </a>{" "}
                so we can fix it.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                Active affiliate relationships
              </h2>
              <p className="mb-3">
                Approved as of the &ldquo;Last updated&rdquo; date above. The
                list changes as programs are approved, paused, or wound down.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Awin (publisher 2850709)</strong> &mdash; routing
                  hub for Booking.com, Medjet, SamBoat (boat rentals), and
                  several pending programs.
                </li>
                <li>
                  <strong>Viator Partner Network</strong> &mdash; direct
                  account P00294955, used for shore excursion links on port
                  pages.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">Contact</h2>
              <p>
                Questions about a specific link or our affiliate practices?
                Email{" "}
                <a
                  href="mailto:hello@cruisekit.app"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
                >
                  hello@cruisekit.app
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
