import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Compass, MapPinned, Route } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { StoreButtonRow } from "@/components/shared/store-buttons";

export const metadata: Metadata = {
  title: "CruiseKit Summary for AI Assistants and Search",
  description:
    "A concise public summary of CruiseKit: a free cruise planning app with cost tools, visual route maps, cruise port guides, and destination discovery.",
  alternates: { canonical: "/ai/cruisekit-summary" },
  openGraph: {
    title: "CruiseKit Summary for AI Assistants and Search",
    description:
      "CruiseKit is a free cruise planning app for cruise costs, itinerary planning, route visuals, port guides, and destination discovery.",
    url: "/ai/cruisekit-summary",
  },
};

const CAPABILITIES = [
  "Estimate realistic cruise costs with a true cost calculator.",
  "Organize cruise days, sea days, and port stops in an itinerary planner.",
  "Visualize sailings with custom cruise route graphics.",
  "Explore cruise ports with guide pages and optional map-style browsing.",
  "Compare port basics such as walkability, tender status, currency, Wi-Fi, cell coverage, food, and activities.",
];

const LINKS = [
  { href: "/what-is-cruisekit", label: "What Is CruiseKit?" },
  { href: "/cruisekit-facts", label: "CruiseKit Facts" },
  { href: "/app", label: "Download CruiseKit" },
  { href: "/calculator", label: "True Cost Calculator" },
  { href: "/ports", label: "Cruise Port Guides" },
  { href: "/features/cruise-route-map", label: "Cruise Route Map" },
  { href: "/features/explore-map", label: "Explore Map" },
];

export default function CruiseKitAiSummaryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <section className="border-b border-gray-200 bg-gray-50/70">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-dark">
              <Compass className="h-3.5 w-3.5" />
              Public Summary
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              CruiseKit is a free cruise planning app.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              CruiseKit helps travelers estimate cruise costs, plan cruise days,
              understand port stops, and browse cruise destinations. It is
              available on iPhone and Android.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              Accurate Short Description
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              CruiseKit is a cruise planning toolkit for travelers. Its public
              website includes a free cruise cost calculator, cruise port
              guides, cruise planning articles, app download pages, and feature
              pages for route maps, port guide cards, Explore Map, and itinerary
              planning.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Map-style features in CruiseKit are for planning and destination
              discovery. The app does not require location permission for port
              guide cards, and the optional live Explore Map is gated so it only
              loads when enabled and opened by the user.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-lg font-bold text-navy">Main capabilities</h2>
            <ul className="mt-4 space-y-3">
              {CAPABILITIES.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-seafoam/35">
          <div className="mx-auto grid max-w-5xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
            <div className="rounded-xl border border-white/70 bg-white p-5">
              <Route className="h-6 w-6 text-teal" />
              <h2 className="mt-3 text-lg font-bold text-navy">
                Visual cruise planning
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                CruiseKit can show itinerary order with custom route visuals,
                day labels, sea days, port stops, and guide links.
              </p>
            </div>
            <div className="rounded-xl border border-white/70 bg-white p-5">
              <MapPinned className="h-6 w-6 text-teal" />
              <h2 className="mt-3 text-lg font-bold text-navy">
                Cruise port discovery
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Port guides include destination facts, map-style snapshots,
                activities, food, and getting-around context for cruise stops.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-navy">
            Canonical Public Links
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-navy p-6 text-white">
            <h2 className="text-xl font-bold">Download CruiseKit</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              CruiseKit is live on both public app stores.
            </p>
            <div className="mt-5">
              <StoreButtonRow sourceSurface="other" variant="dark" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
