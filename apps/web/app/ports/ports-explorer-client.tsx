"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Ship, Footprints, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  PORTS,
  REGION_LABELS,
  type PortData,
  type PortRegion,
} from "@/lib/data/ports";

type FilterKey = "all" | PortRegion;

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Ports" },
  ...Object.entries(REGION_LABELS).map(([key, label]) => ({
    key: key as FilterKey,
    label,
  })),
];

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

function PortCard({ port, index }: { port: PortData; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link
        href={`/ports/${port.slug}`}
        className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-lg"
      >
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={port.imageUrl}
            alt={`${port.name}, ${port.country}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-navy backdrop-blur-sm">
            {REGION_LABELS[port.region]}
          </span>
          {port.isTenderPort ? (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-50/90 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 backdrop-blur-sm">
              <Anchor className="h-3 w-3" />
              Tender
            </span>
          ) : (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-teal/20 bg-teal/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal backdrop-blur-sm">
              <Ship className="h-3 w-3" />
              Docked
            </span>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-navy transition-colors group-hover:text-ocean">
            {port.name}
          </h2>
          <p className="text-sm text-gray-500">{port.country}</p>
          <div className="mt-2">
            <WalkabilityBar rating={port.walkabilityRating} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
            {port.overview}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
              {port.currency}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
              {port.wifiAvailability} Wi-Fi
            </span>
          </div>
          <div className="mt-4 flex items-center text-sm font-bold text-teal transition-colors group-hover:text-teal-dark">
            View Cruise Port Guide
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PortsExplorerClient() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const filtered =
    activeFilter === "all"
      ? PORTS
      : PORTS.filter((port) => port.region === activeFilter);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.key}
            onClick={() => setActiveFilter(option.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all",
              activeFilter === option.key
                ? "bg-navy text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-navy",
            )}
          >
            {option.label}
            {option.key !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({PORTS.filter((port) => port.region === option.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((port, index) => (
            <PortCard key={port.slug} port={port} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-gray-400">
        Showing {filtered.length} of {PORTS.length} cruise ports
      </p>
    </section>
  );
}
