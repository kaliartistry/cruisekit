import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, DollarSign, Users, Shield } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "How We Make Money | CruiseKit",
  description:
    "CruiseKit is affiliate-funded. Here's exactly how we earn, what that means for the recommendations you see, and why it never changes the price you pay.",
};

export default function HowWeMakeMoneyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="How we make money"
          subtitle="Plain-English honesty about the business behind CruiseKit."
          pillar="plan"
        />

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-3">
              The short version
            </h2>
            <p className="text-gray-700 leading-relaxed">
              When you click a &ldquo;Book&rdquo; button on CruiseKit and
              complete a purchase on a partner&rsquo;s site (Viator,
              GetYourGuide, Booking.com, CruiseDirect, and a handful of others),
              that partner pays us a small commission. The price you pay is
              identical to what you&rsquo;d pay going direct &mdash; we never
              mark it up and we don&rsquo;t get a special &ldquo;kickback
              rate&rdquo; that changes what you see.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              What this buys you
            </h2>
            <ul className="space-y-3">
              {[
                "No ads. The site is not monetized through display advertising, email sponsorships, or brand placements.",
                "No booking agency. We never hold your reservation, your payment details, or your cruise documents.",
                "No paid placements. A Viator tour doesn't outrank a GetYourGuide tour because Viator pays more.",
                "No algorithmic tilt. Our calculator, comparison tool, and port guides are not weighted toward partners.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-teal" />
                  <span className="text-gray-700">{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              What we don&rsquo;t do
            </h2>
            <ul className="space-y-3">
              {[
                "Sell your data. Affiliate click tracking is partner-side; CruiseKit doesn't sell personal information to anyone.",
                "Re-rank by commission. Independent price ranges come first; partner booking links come second.",
                "Hide the disclosure. Every booking CTA on CruiseKit carries a one-line disclosure.",
                "Take kickbacks from cruise lines. We have no financial relationship with Royal Caribbean, Carnival, Norwegian, or any cruise line.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <X className="h-5 w-5 flex-shrink-0 mt-0.5 text-coral" />
                  <span className="text-gray-700">{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              Our active partners
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: "Viator", role: "Shore excursions and tours" },
                { name: "GetYourGuide", role: "Shore excursions and tours" },
                { name: "Booking.com", role: "Pre- and post-cruise hotels" },
                { name: "CruiseDirect", role: "Cruise fare bookings" },
                { name: "Medjet", role: "Medical evacuation insurance" },
                { name: "SamBoat", role: "Private boat and yacht charters" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="text-sm font-semibold text-navy">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.role}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              Why this model
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-5">
                <DollarSign className="h-6 w-6 text-teal mb-2" />
                <div className="text-sm font-semibold text-navy mb-1">
                  Free for you
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The calculator, port guides, and planning tools are free
                  because partners cover the cost.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <Users className="h-6 w-6 text-teal mb-2" />
                <div className="text-sm font-semibold text-navy mb-1">
                  Aligned with you
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We only earn if you actually book something useful. Bad
                  recommendations = no revenue.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <Shield className="h-6 w-6 text-teal mb-2" />
                <div className="text-sm font-semibold text-navy mb-1">
                  Independent
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  No cruise line owns us, sponsors us, or pays us for
                  placement. The advice is ours.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-teal/20 bg-teal/5 p-6">
            <h3 className="text-lg font-semibold text-navy mb-2">
              Questions?
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              If anything here feels unclear or you spot a place where a
              disclosure is missing, tell us.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-dark"
            >
              Get in touch
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
