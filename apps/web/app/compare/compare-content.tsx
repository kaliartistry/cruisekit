"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const LINES = [
  { id: "royal-caribbean", name: "Royal Caribbean", short: "RCI" },
  { id: "carnival", name: "Carnival", short: "CCL" },
  { id: "norwegian", name: "Norwegian", short: "NCL" },
  { id: "msc", name: "MSC Cruises", short: "MSC" },
  { id: "celebrity", name: "Celebrity", short: "CEL" },
  { id: "princess", name: "Princess", short: "PCL" },
  { id: "holland-america", name: "Holland America", short: "HAL" },
  { id: "disney", name: "Disney", short: "DCL" },
  { id: "virgin-voyages", name: "Virgin Voyages", short: "VV" },
] as const;

type LineId = (typeof LINES)[number]["id"];

interface MetricRow {
  key: string;
  label: string;
  unit: string;
  getValue: (id: string) => number | string;
  format?: (v: number | string) => string;
  lowerIsBetter?: boolean;
  note?: string;
}

function getDrinkPrice(id: string): number {
  const costs = CRUISE_LINE_COSTS[id];
  if (!costs) return 0;
  const tiers = costs.drinkPackages.tiers;
  if (costs.drinkPackages.includedFree) return 0;
  if (tiers.length === 0) return -1; // N/A (Disney)
  // Get the primary/cheapest alcoholic package
  return tiers[0].pricePerDay;
}

function getWifiPrice(id: string): number {
  const costs = CRUISE_LINE_COSTS[id];
  if (!costs) return 0;
  if (costs.wifiPackages.includedFree) return 0;
  const tiers = costs.wifiPackages.tiers.filter(
    (t) => t.pricePerDay > 0
  );
  return tiers.length > 0 ? tiers[0].pricePerDay : 0;
}

const METRICS: MetricRow[] = [
  {
    key: "gratuity",
    label: "Daily Gratuity",
    unit: "/person/day",
    getValue: (id) => CRUISE_LINE_COSTS[id]?.gratuityPerPersonPerDay ?? 0,
    format: (v) => (typeof v === "number" ? `$${v.toFixed(2)}` : String(v)),
    lowerIsBetter: true,
  },
  {
    key: "drinks",
    label: "Drink Package",
    unit: "/person/day",
    getValue: (id) => getDrinkPrice(id),
    format: (v) => {
      if (v === 0) return "Included";
      if (v === -1) return "N/A";
      return typeof v === "number" ? `$${v.toFixed(0)}` : String(v);
    },
    lowerIsBetter: true,
    note: "Lowest alcoholic package price",
  },
  {
    key: "wifi",
    label: "WiFi",
    unit: "/day",
    getValue: (id) => getWifiPrice(id),
    format: (v) => {
      if (v === 0) return "Included";
      return typeof v === "number" ? `$${v.toFixed(0)}` : String(v);
    },
    lowerIsBetter: true,
  },
  {
    key: "dining",
    label: "Specialty Dining",
    unit: "avg/meal",
    getValue: (id) =>
      CRUISE_LINE_COSTS[id]?.specialtyDining.averagePerMeal ?? 0,
    format: (v) => {
      if (v === 0) return "Included";
      return typeof v === "number" ? `$${v}` : String(v);
    },
    lowerIsBetter: true,
    note: "Average per-person specialty restaurant price",
  },
  {
    key: "portFees",
    label: "Port Fees",
    unit: "/person/day",
    getValue: (id) =>
      CRUISE_LINE_COSTS[id]?.portFeesPerPersonPerDay ?? 0,
    format: (v) => (typeof v === "number" ? `$${v}` : String(v)),
    lowerIsBetter: true,
  },
  {
    key: "excursions",
    label: "Avg Excursion",
    unit: "/port",
    getValue: (id) =>
      CRUISE_LINE_COSTS[id]?.averageExcursionCostPerPort ?? 0,
    format: (v) => (typeof v === "number" ? `$${v}` : String(v)),
    lowerIsBetter: true,
  },
  {
    key: "spa",
    label: "Spa Treatment",
    unit: "avg",
    getValue: (id) => CRUISE_LINE_COSTS[id]?.spaAverageTreatment ?? 0,
    format: (v) => (typeof v === "number" ? `$${v}` : String(v)),
    lowerIsBetter: true,
  },
  {
    key: "kidsClub",
    label: "Kids Club Free",
    unit: "",
    getValue: (id) => {
      const costs = CRUISE_LINE_COSTS[id];
      if (!costs) return "N/A";
      if (id === "virgin-voyages") return "Adults Only";
      return costs.kidsClubFree ? "Yes" : "No";
    },
    format: (v) => String(v),
  },
  {
    key: "included",
    label: "Free Inclusions",
    unit: "count",
    getValue: (id) =>
      CRUISE_LINE_COSTS[id]?.includedFree?.length ?? 0,
    format: (v) => (typeof v === "number" ? `${v} items` : String(v)),
    lowerIsBetter: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Animations                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Comparison Table                                                    */
/* ------------------------------------------------------------------ */

type SortConfig = { key: string; direction: "asc" | "desc" } | null;

function ComparisonTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sortedLines = useMemo(() => {
    if (!sortConfig) return [...LINES];
    const metric = METRICS.find((m) => m.key === sortConfig.key);
    if (!metric) return [...LINES];
    return [...LINES].sort((a, b) => {
      const va = metric.getValue(a.id);
      const vb = metric.getValue(b.id);
      const na = typeof va === "number" ? va : 999;
      const nb = typeof vb === "number" ? vb : 999;
      return sortConfig.direction === "asc" ? na - nb : nb - na;
    });
  }, [sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  // Find min/max for each metric to highlight
  const getMinMax = (metric: MetricRow) => {
    const values = LINES.map((l) => metric.getValue(l.id)).filter(
      (v): v is number => typeof v === "number" && v > 0
    );
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)]">
      <table className="w-full min-w-[800px] text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th className="sticky left-0 z-10 bg-gray-50/80 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Metric
            </th>
            {sortedLines.map((line) => (
              <th key={line.id} className="px-3 py-3 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <CruiseLineLogo cruiseLineId={line.id} size="sm" />
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    {line.short}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {METRICS.map((metric, mi) => {
            const { min, max } = getMinMax(metric);
            return (
              <tr
                key={metric.key}
                className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${mi % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
              >
                <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
                  <button
                    onClick={() => handleSort(metric.key)}
                    className="group flex items-center gap-1.5 text-left"
                  >
                    <span className="font-medium text-navy">
                      {metric.label}
                    </span>
                    <ArrowUpDown className="h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                  {metric.note && (
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {metric.note}
                    </p>
                  )}
                </td>
                {sortedLines.map((line) => {
                  const raw = metric.getValue(line.id);
                  const formatted = metric.format
                    ? metric.format(raw)
                    : String(raw);
                  const isNum = typeof raw === "number" && raw > 0;
                  const isBest =
                    isNum &&
                    metric.lowerIsBetter !== undefined &&
                    raw === (metric.lowerIsBetter ? min : max);
                  const isWorst =
                    isNum &&
                    metric.lowerIsBetter !== undefined &&
                    raw === (metric.lowerIsBetter ? max : min);
                  const isIncluded = formatted === "Included";

                  return (
                    <td
                      key={line.id}
                      className="px-3 py-3 text-center font-medium"
                    >
                      <span
                        className={
                          isIncluded
                            ? "text-success font-semibold"
                            : isBest
                              ? "text-success font-semibold"
                              : isWorst
                                ? "text-coral"
                                : "text-gray-700"
                        }
                      >
                        {formatted === "Yes" ? (
                          <Check className="mx-auto h-4 w-4 text-success" />
                        ) : formatted === "No" ? (
                          <X className="mx-auto h-4 w-4 text-coral" />
                        ) : (
                          formatted
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Card View                                                    */
/* ------------------------------------------------------------------ */

function MobileComparisonCards() {
  const [expandedLine, setExpandedLine] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {LINES.map((line) => {
        const isExpanded = expandedLine === line.id;
        return (
          <div
            key={line.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)]"
          >
            <button
              onClick={() =>
                setExpandedLine(isExpanded ? null : line.id)
              }
              className="flex w-full items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <CruiseLineLogo cruiseLineId={line.id} size="sm" />
                <span className="font-semibold text-navy">
                  {line.name}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 pb-4">
                <div className="divide-y divide-gray-100">
                  {METRICS.map((metric) => {
                    const raw = metric.getValue(line.id);
                    const formatted = metric.format
                      ? metric.format(raw)
                      : String(raw);
                    return (
                      <div
                        key={metric.key}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <span className="text-gray-600">
                          {metric.label}
                        </span>
                        <span
                          className={
                            formatted === "Included"
                              ? "font-semibold text-success"
                              : "font-medium text-navy"
                          }
                        >
                          {formatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href={`/calculator?line=${line.id}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-teal/10 py-2.5 text-sm font-semibold text-teal transition-colors hover:bg-teal/20"
                >
                  Calculate Full Cost
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Head-to-Head Picker                                                 */
/* ------------------------------------------------------------------ */

function HeadToHead() {
  const [lineA, setLineA] = useState<LineId | "">("");
  const [lineB, setLineB] = useState<LineId | "">("");

  const diff = useMemo(() => {
    if (!lineA || !lineB) return null;
    const costsA = CRUISE_LINE_COSTS[lineA];
    const costsB = CRUISE_LINE_COSTS[lineB];
    if (!costsA || !costsB) return null;

    const items: {
      label: string;
      a: string;
      b: string;
      winner: "a" | "b" | "tie";
    }[] = [];

    // Gratuity
    const gratA = costsA.gratuityPerPersonPerDay;
    const gratB = costsB.gratuityPerPersonPerDay;
    items.push({
      label: "Daily Gratuity",
      a: `$${gratA.toFixed(2)}`,
      b: `$${gratB.toFixed(2)}`,
      winner: gratA < gratB ? "a" : gratA > gratB ? "b" : "tie",
    });

    // Drinks
    const drinkA = getDrinkPrice(lineA);
    const drinkB = getDrinkPrice(lineB);
    items.push({
      label: "Drink Package",
      a: drinkA === 0 ? "Included" : drinkA === -1 ? "N/A" : `$${drinkA}/day`,
      b: drinkB === 0 ? "Included" : drinkB === -1 ? "N/A" : `$${drinkB}/day`,
      winner:
        drinkA < 0 || drinkB < 0
          ? "tie"
          : drinkA < drinkB
            ? "a"
            : drinkA > drinkB
              ? "b"
              : "tie",
    });

    // WiFi
    const wifiA = getWifiPrice(lineA);
    const wifiB = getWifiPrice(lineB);
    items.push({
      label: "WiFi",
      a: wifiA === 0 ? "Included" : `$${wifiA}/day`,
      b: wifiB === 0 ? "Included" : `$${wifiB}/day`,
      winner: wifiA < wifiB ? "a" : wifiA > wifiB ? "b" : "tie",
    });

    // Dining
    const dineA = costsA.specialtyDining.averagePerMeal;
    const dineB = costsB.specialtyDining.averagePerMeal;
    items.push({
      label: "Specialty Dining",
      a: dineA === 0 ? "Included" : `$${dineA}/meal`,
      b: dineB === 0 ? "Included" : `$${dineB}/meal`,
      winner: dineA < dineB ? "a" : dineA > dineB ? "b" : "tie",
    });

    // Spa
    items.push({
      label: "Spa Treatment",
      a: `$${costsA.spaAverageTreatment}`,
      b: `$${costsB.spaAverageTreatment}`,
      winner:
        costsA.spaAverageTreatment < costsB.spaAverageTreatment
          ? "a"
          : costsA.spaAverageTreatment > costsB.spaAverageTreatment
            ? "b"
            : "tie",
    });

    return items;
  }, [lineA, lineB]);

  const nameA = LINES.find((l) => l.id === lineA)?.name ?? "";
  const nameB = LINES.find((l) => l.id === lineB)?.name ?? "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <h3 className="text-xl font-bold text-navy">Head-to-Head Comparison</h3>
      <p className="mt-1 text-sm text-gray-500">
        Pick two cruise lines to see how they stack up.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cruise Line A
          </label>
          <select
            value={lineA}
            onChange={(e) => setLineA(e.target.value as LineId | "")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          >
            <option value="">Select...</option>
            {LINES.filter((l) => l.id !== lineB).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cruise Line B
          </label>
          <select
            value={lineB}
            onChange={(e) => setLineB(e.target.value as LineId | "")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          >
            <option value="">Select...</option>
            {LINES.filter((l) => l.id !== lineA).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {diff && (
        <div className="mt-6">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CruiseLineLogo cruiseLineId={lineA} size="sm" />
              <span className="font-semibold text-navy text-sm">{nameA}</span>
            </div>
            <span className="text-xs font-bold text-gray-400 self-center">VS</span>
            <div className="flex items-center gap-2 justify-end">
              <span className="font-semibold text-navy text-sm">{nameB}</span>
              <CruiseLineLogo cruiseLineId={lineB} size="sm" />
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {diff.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[1fr_auto_1fr] gap-2 py-3"
              >
                <span
                  className={`text-sm font-medium ${item.winner === "a" ? "text-success" : "text-gray-700"}`}
                >
                  {item.a}
                </span>
                <span className="text-xs text-gray-400 self-center text-center min-w-[100px]">
                  {item.label}
                </span>
                <span
                  className={`text-sm font-medium text-right ${item.winner === "b" ? "text-success" : "text-gray-700"}`}
                >
                  {item.b}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/calculator?line=${lineA},${lineB}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-dark hover:shadow-md active:scale-[0.98]"
          >
            Full Cost Comparison in Calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Popular Comparisons                                                 */
/* ------------------------------------------------------------------ */

const POPULAR_COMPARISONS = [
  { lineA: "royal-caribbean", lineB: "carnival", label: "Royal Caribbean vs Carnival" },
  { lineA: "norwegian", lineB: "royal-caribbean", label: "Norwegian vs Royal Caribbean" },
  { lineA: "celebrity", lineB: "princess", label: "Celebrity vs Princess" },
  { lineA: "msc", lineB: "norwegian", label: "MSC vs Norwegian" },
  { lineA: "disney", lineB: "royal-caribbean", label: "Disney vs Royal Caribbean" },
  { lineA: "virgin-voyages", lineB: "celebrity", label: "Virgin Voyages vs Celebrity" },
];

function PopularComparisons() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {POPULAR_COMPARISONS.map((cmp) => (
        <Link
          key={cmp.label}
          href={`/calculator?line=${cmp.lineA},${cmp.lineB}`}
          className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
        >
          <CruiseLineLogo cruiseLineId={cmp.lineA} size="md" />
          <span className="text-xs font-bold text-gray-400">VS</span>
          <CruiseLineLogo cruiseLineId={cmp.lineB} size="md" />
          <span className="ml-auto text-xs font-semibold text-teal opacity-0 transition-opacity group-hover:opacity-100">
            Compare <ArrowRight className="inline h-3 w-3" />
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "Which cruise line has the lowest daily gratuity?",
    a: "Disney Cruise Line has the lowest standard gratuity at $16.00 per person per day. MSC is close behind at $16.00 as well. Carnival is $17.00, while Norwegian and Virgin Voyages charge the highest at $20.00/day.",
  },
  {
    q: "Which cruise lines include drinks for free?",
    a: "Norwegian Cruise Line includes an open bar with their Free at Sea promotion (mandatory $21.80/day gratuity applies). Virgin Voyages includes basic beverages. All other major cruise lines charge separately for drink packages.",
  },
  {
    q: "Which cruise line is cheapest overall?",
    a: "Carnival and MSC typically have the lowest base fares. However, the true cost depends on add-ons. Norwegian's Free at Sea bundle includes drinks and WiFi, which can make it cheaper overall. Use our True Cost Calculator to compare actual totals for your specific trip.",
  },
  {
    q: "Can I compare two cruise lines in detail?",
    a: "Yes! Use the Head-to-Head comparison tool above, or select any two cruise lines and click 'Full Cost Comparison in Calculator' to see a detailed side-by-side breakdown including all hidden costs.",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Content                                                        */
/* ------------------------------------------------------------------ */

export default function CompareContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Quick-Glance Matrix */}
      <motion.section
        className="py-10 sm:py-14"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Cost Comparison Matrix
        </h2>
        <p className="mt-2 text-gray-500">
          Click any column header to sort. Green = best value, coral = highest cost.
          {" · "}
          <Link
            href="/methodology"
            className="text-xs text-gray-400 hover:text-teal underline underline-offset-2 transition-colors"
          >
            Sources &amp; methodology &rarr;
          </Link>
        </p>

        {/* Desktop table */}
        <div className="mt-6 hidden md:block">
          <ComparisonTable />
        </div>

        {/* Mobile cards */}
        <div className="mt-6 md:hidden">
          <MobileComparisonCards />
        </div>
      </motion.section>

      {/* Head-to-Head */}
      <motion.section
        className="pb-10 sm:pb-14"
        initial="hidden"
        animate="visible"
        variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }}
      >
        <HeadToHead />
      </motion.section>

      {/* Popular Comparisons */}
      <motion.section
        className="pb-10 sm:pb-14"
        initial="hidden"
        animate="visible"
        variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }}
      >
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Popular Comparisons
        </h2>
        <p className="mt-2 mb-6 text-gray-500">
          Jump straight into a side-by-side cost breakdown.
        </p>
        <PopularComparisons />
      </motion.section>

      {/* FAQ */}
      <section className="border-t border-gray-200 py-10 sm:py-14">
        <h2 className="text-2xl font-bold text-navy">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 divide-y divide-gray-200">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-navy">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
