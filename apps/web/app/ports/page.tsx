"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Ship, Footprints, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils/cn";
import {
  PORTS,
  REGION_LABELS,
  type PortData,
  type PortRegion,
} from "@/lib/data/ports";

/* ------------------------------------------------------------------ */
/*  Filter types                                                       */
/* ------------------------------------------------------------------ */

type FilterKey = "all" | PortRegion;

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Ports" },
  ...Object.entries(REGION_LABELS).map(([key, label]) => ({
    key: key as FilterKey,
    label,
  })),
];

/* ------------------------------------------------------------------ */
/*  Walkability indicator                                              */
/*                                                                     */
/*  Reuses the existing 0-10 `safetyRating` value from port data and   */
/*  presents it as walkability — how easy it is to get around the port */
/*  area on foot. The underlying number reflects port walkability and  */
/*  is not an authoritative safety score; treat it as a planning hint  */
/*  only. For travel-safety guidance, point cruisers to official       */
/*  advisories (e.g. travel.state.gov).                                */
/* ------------------------------------------------------------------ */

function WalkabilityBar({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(10, rating)) * 10;
  return (
    <div className="flex items-center gap-2" title={`Walkability: ${rating}/10`}>
      <Footprints className="h-3.5 w-3.5 text-teal" />
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500">{rating}/10</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Port Card                                                          */
/* ------------------------------------------------------------------ */

function PortCard({ port, index }: { port: PortData; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/ports/${port.slug}`}
        className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={port.imageUrl}
            alt={`${port.name}, ${port.country}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Region badge */}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-navy backdrop-blur-sm">
            {REGION_LABELS[port.region]}
          </span>
          {/* Tender badge */}
          {port.isTenderPort && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-50/90 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 backdrop-blur-sm">
              <Anchor className="h-3 w-3" />
              Tender
            </span>
          )}
          {!port.isTenderPort && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal backdrop-blur-sm border border-teal/20">
              <Ship className="h-3 w-3" />
              Direct Dock
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-navy group-hover:text-ocean transition-colors">
            {port.name}
          </h3>
          <p className="text-sm text-gray-500">{port.country}</p>
          <div className="mt-2">
            <WalkabilityBar rating={port.safetyRating} />
          </div>
          <div className="mt-3 flex items-center text-sm font-medium text-teal group-hover:text-teal-dark transition-colors">
            View Guide
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function PortsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filtered =
    activeFilter === "all"
      ? PORTS
      : PORTS.filter((p) => p.region === activeFilter);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Page Header */}
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
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-700 font-medium">
                    Port Day Planner
                  </span>
                </li>
              </ol>
            </nav>

            {/* Pillar badge */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-success/10 border border-success/30 text-green-600">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Explore
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Caribbean Port Day Planner
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              Walkability hints, excursion guides, time zone alerts, and local
              tips for {PORTS.length} popular Caribbean cruise ports. Plan your
              perfect port day.
            </p>
            <p className="mt-2 max-w-2xl text-xs text-gray-500">
              Safety information should be confirmed against official travel
              advisories (e.g.{" "}
              <a
                href="https://travel.state.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-navy"
              >
                travel.state.gov
              </a>
              ) before your trip.
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Region filter buttons */}
          <div className="mb-8 flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeFilter === opt.key
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-navy"
                )}
              >
                {opt.label}
                {opt.key !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({PORTS.filter((p) =>
                      p.region === opt.key
                    ).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Port cards grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((port, i) => (
                <PortCard key={port.slug} port={port} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Result count */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Showing {filtered.length} of {PORTS.length} ports
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
