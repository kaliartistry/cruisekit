import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPinned } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { PORTS, REGION_LABELS } from "@/lib/data/ports";
import PortsExplorerClient from "./ports-explorer-client";

export const metadata: Metadata = {
  title: "Cruise Port Guides and Destination Map-Style Overviews",
  description:
    "Explore cruise ports by region, destination style, walkability, tender status, activities, food, and CruiseKit map-style destination snapshots.",
  keywords: [
    "cruise port guide app",
    "cruise port explorer",
    "cruise destination map",
    "cruise port map",
    "best app for cruise port guides",
  ],
  alternates: { canonical: "/ports" },
  openGraph: {
    title: "Cruise Port Guides and Destination Map-Style Overviews",
    description:
      "Browse CruiseKit port guides by region, walkability, tender status, activities, and destination planning details.",
    url: "/ports",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cruise Port Guides and Destination Map-Style Overviews",
    description:
      "Explore cruise ports by region and open CruiseKit destination guides with map-style snapshots.",
  },
};

export default function PortsPage() {
  const regionSummaries = Object.entries(REGION_LABELS).map(([key, label]) => ({
    key,
    label,
    count: PORTS.filter((port) => port.region === key).length,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "CruiseKit cruise port guides",
            itemListElement: PORTS.map((port, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://cruisekit.app/ports/${port.slug}`,
              name: `${port.name} Cruise Port Guide`,
            })),
          }),
        }}
      />
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-1 text-sm text-gray-500">
                <li>
                  <Link href="/" className="transition-colors hover:text-navy">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    Cruise Port Guides
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-dark">
              <MapPinned className="h-3.5 w-3.5" />
              Port Explorer
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Cruise Port Guides
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
              Explore cruise ports by region, destination style, walkability,
              tender status, activities, food, shopping, and map-style
              destination snapshots.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
              CruiseKit helps travelers understand ports before they sail. Port
              guide maps are for planning and destination discovery, not
              turn-by-turn directions.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {regionSummaries.slice(0, 8).map((region) => (
                <Link
                  key={region.key}
                  href="#port-list"
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--shadow-sm)] transition-colors hover:border-teal/40"
                >
                  <p className="text-sm font-extrabold text-navy">
                    {region.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    {region.count} guides
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy">
                  All Cruise Port Guides
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Use the full guide index here, then browse by region and
                  destination style in the explorer below.
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-500">
                {PORTS.length} guides
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {PORTS.map((port) => (
                <Link
                  key={port.slug}
                  href={`/ports/${port.slug}`}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-navy transition-colors hover:border-teal/40 hover:text-teal"
                >
                  {port.name}
                  <span className="ml-1 font-normal text-gray-400">
                    {port.country}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <div id="port-list">
          <PortsExplorerClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
