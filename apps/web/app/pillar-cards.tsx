"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Wine,
  Wifi,
  HandCoins,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const COMPARISONS = [
  {
    lineA: "royal-caribbean",
    lineB: "carnival",
    label: "Royal Caribbean vs Carnival",
  },
  {
    lineA: "norwegian",
    lineB: "royal-caribbean",
    label: "Norwegian vs Royal Caribbean",
  },
  {
    lineA: "celebrity",
    lineB: "princess",
    label: "Celebrity vs Princess",
  },
  {
    lineA: "msc",
    lineB: "norwegian",
    label: "MSC vs Norwegian",
  },
  {
    lineA: "disney",
    lineB: "royal-caribbean",
    label: "Disney vs Royal Caribbean",
  },
  {
    lineA: "virgin-voyages",
    lineB: "celebrity",
    label: "Virgin Voyages vs Celebrity",
  },
];

const HIDDEN_COSTS = [
  {
    icon: Wine,
    title: "Drink Packages",
    price: "$70-$110",
    note: "per person / day",
  },
  {
    icon: Wifi,
    title: "WiFi Packages",
    price: "$15-$25",
    note: "per device / day",
  },
  {
    icon: HandCoins,
    title: "Gratuities",
    price: "$16-$26",
    note: "per person / day",
  },
  {
    icon: UtensilsCrossed,
    title: "Specialty Dining",
    price: "$35-$75",
    note: "per person / meal",
  },
  {
    icon: ShieldCheck,
    title: "Travel Insurance",
    price: "$100-$300",
    note: "per person / trip",
  },
  {
    icon: Sparkles,
    title: "Shore Excursions",
    price: "$50-$200",
    note: "per person / port",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContentSections() {
  return (
    <>
      {/* ---- Section A: Compare cruise line costs ---- */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Compare cruise line costs
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              See how the true cost stacks up between the most popular cruise
              lines.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {COMPARISONS.map((cmp) => (
              <motion.div key={cmp.label} variants={cardVariants}>
                <Link
                  href={`/calculator/${cmp.lineA}?compare=${cmp.lineB}`}
                  className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
                >
                  <CruiseLineLogo cruiseLineId={cmp.lineA} size="md" />
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    vs
                  </span>
                  <CruiseLineLogo cruiseLineId={cmp.lineB} size="md" />
                  <div className="ml-auto flex items-center gap-1 text-sm font-semibold text-navy transition-colors group-hover:text-teal">
                    Compare
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Section B: Hidden costs ---- */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              The costs cruise lines don&apos;t show you
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              These extras add up fast. Our calculator includes them all so
              there are no surprises.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {HIDDEN_COSTS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={cardVariants}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-coral/10">
                    <Icon className="h-5 w-5 text-coral" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy">
                      {item.title}
                    </h3>
                    <p className="font-price text-lg font-bold text-coral mt-0.5">
                      {item.price}
                    </p>
                    <p className="text-xs text-gray-400">{item.note}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---- Section C: Cruise lines we cover ---- */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Cruise lines we cover
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Detailed cost data for all major cruise lines, updated regularly.
            </p>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {CRUISE_LINES.map((line) => (
              <Link
                key={line.id}
                href={`/calculator/${line.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 snap-start shrink-0 w-[140px]"
              >
                <CruiseLineLogo cruiseLineId={line.id} size="lg" />
                <span className="text-xs font-semibold text-navy text-center leading-tight group-hover:text-teal transition-colors">
                  {line.shortName}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Section D: CTA banner ---- */}
      <section className="bg-gradient-to-r from-navy to-ocean py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
            Ready to see the real price of your cruise?
          </h2>
          <p className="mt-3 text-base text-white/70 sm:text-lg max-w-2xl mx-auto">
            Stop guessing. Get a transparent breakdown of every cost before you
            book.
          </p>
          <Link
            href="/calculator"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-teal-dark hover:shadow-xl active:scale-[0.97]"
          >
            Calculate Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
