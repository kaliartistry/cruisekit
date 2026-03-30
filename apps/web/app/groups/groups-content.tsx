"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Calculator,
  ArrowRight,
  Check,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  MessageSquare,
  BarChart3,
  Share2,
  Vote,
  ChevronDown,
} from "lucide-react";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const CRUISE_LINES = [
  { id: "royal-caribbean", name: "Royal Caribbean" },
  { id: "carnival", name: "Carnival" },
  { id: "norwegian", name: "Norwegian" },
  { id: "msc", name: "MSC Cruises" },
  { id: "celebrity", name: "Celebrity" },
  { id: "princess", name: "Princess" },
  { id: "holland-america", name: "Holland America" },
  { id: "disney", name: "Disney" },
  { id: "virgin-voyages", name: "Virgin Voyages" },
] as const;

type CabinType = "inside" | "ocean-view" | "balcony" | "suite";

const CABIN_MULTIPLIERS: Record<CabinType, number> = {
  inside: 1.0,
  "ocean-view": 1.25,
  balcony: 1.6,
  suite: 2.5,
};

const CABIN_LABELS: Record<CabinType, string> = {
  inside: "Inside",
  "ocean-view": "Ocean View",
  balcony: "Balcony",
  suite: "Suite",
};

/* ------------------------------------------------------------------ */
/*  Animations                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Group Cost Splitter                                                 */
/* ------------------------------------------------------------------ */

function GroupCostSplitter() {
  const [groupSize, setGroupSize] = useState(6);
  const [cruiseLine, setCruiseLine] = useState("royal-caribbean");
  const [duration, setDuration] = useState(7);
  const [cabinType, setCabinType] = useState<CabinType>("balcony");
  const [baseFarePerPerson, setBaseFarePerPerson] = useState(800);

  const breakdown = useMemo(() => {
    const costs = CRUISE_LINE_COSTS[cruiseLine];
    if (!costs) return null;

    const cabins = Math.ceil(groupSize / 2);
    const fare = baseFarePerPerson * CABIN_MULTIPLIERS[cabinType];
    const gratuity = costs.gratuityPerPersonPerDay * duration;
    const portFees = costs.portFeesPerPersonPerDay * duration;

    // Estimate drink package (first tier if available)
    const drinkTier = costs.drinkPackages.tiers[0];
    const drinkPerPerson = drinkTier
      ? costs.drinkPackages.includedFree
        ? 0
        : drinkTier.pricePerDay * duration
      : 0;

    const perPerson = fare + gratuity + portFees;
    const perPersonWithDrinks = perPerson + drinkPerPerson;
    const groupTotal = perPerson * groupSize;
    const groupTotalWithDrinks = perPersonWithDrinks * groupSize;

    return {
      cabins,
      fare: Math.round(fare),
      gratuity: Math.round(gratuity),
      portFees: Math.round(portFees),
      drinkPerPerson: Math.round(drinkPerPerson),
      perPerson: Math.round(perPerson),
      perPersonWithDrinks: Math.round(perPersonWithDrinks),
      groupTotal: Math.round(groupTotal),
      groupTotalWithDrinks: Math.round(groupTotalWithDrinks),
      drinksIncluded: costs.drinkPackages.includedFree,
    };
  }, [groupSize, cruiseLine, duration, cabinType, baseFarePerPerson]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10">
          <Calculator className="h-5 w-5 text-coral" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-navy">
            Group Cost Splitter
          </h3>
          <p className="text-sm text-gray-500">
            Estimate per-person costs for your group cruise.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Group size */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Group Size
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <button
              onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-10 text-center text-lg font-bold text-navy">
              {groupSize}
            </span>
            <button
              onClick={() => setGroupSize(Math.min(30, groupSize + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
            <span className="text-xs text-gray-400 ml-1">people</span>
          </div>
        </div>

        {/* Cruise Line */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cruise Line
          </label>
          <select
            value={cruiseLine}
            onChange={(e) => setCruiseLine(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-navy focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          >
            {CRUISE_LINES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-navy focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          >
            {[3, 4, 5, 7, 8, 10, 12, 14].map((d) => (
              <option key={d} value={d}>
                {d} nights
              </option>
            ))}
          </select>
        </div>

        {/* Cabin Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cabin Type
          </label>
          <select
            value={cabinType}
            onChange={(e) => setCabinType(e.target.value as CabinType)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-navy focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          >
            {(
              Object.entries(CABIN_LABELS) as [CabinType, string][]
            ).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Base Fare */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
            Base Fare (per person, Inside)
          </label>
          <div className="mt-1.5 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              $
            </span>
            <input
              type="number"
              min={200}
              max={10000}
              value={baseFarePerPerson}
              onChange={(e) =>
                setBaseFarePerPerson(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm font-medium text-navy focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {breakdown && (
        <div className="mt-8 rounded-xl bg-gray-50 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Per person */}
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Per Person
              </p>
              <p className="mt-1 text-3xl font-extrabold text-navy">
                ${breakdown.perPerson.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                before drinks
              </p>
            </div>

            {/* Per person with drinks */}
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                With Drink Package
              </p>
              <p className="mt-1 text-3xl font-extrabold text-coral">
                ${breakdown.perPersonWithDrinks.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                {breakdown.drinksIncluded
                  ? "drinks included"
                  : "per person total"}
              </p>
            </div>

            {/* Group total */}
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Group Total
              </p>
              <p className="mt-1 text-3xl font-extrabold text-teal">
                ${breakdown.groupTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                {groupSize} people &middot; {breakdown.cabins} cabins
              </p>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="mt-5 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Fare</span>
                <span className="font-medium text-navy">
                  ${breakdown.fare.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gratuities</span>
                <span className="font-medium text-navy">
                  ${breakdown.gratuity.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Port Fees</span>
                <span className="font-medium text-navy">
                  ${breakdown.portFees.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Drinks</span>
                <span className="font-medium text-navy">
                  {breakdown.drinksIncluded
                    ? "Included"
                    : `$${breakdown.drinkPerPerson.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/calculator?line=${cruiseLine}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-coral/10 py-2.5 text-sm font-semibold text-coral transition-colors hover:bg-coral/20"
          >
            Detailed Breakdown in Calculator
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Group Planning Checklist                                            */
/* ------------------------------------------------------------------ */

const CHECKLIST_SECTIONS = [
  {
    title: "12-18 Months Before",
    icon: Calendar,
    color: "text-teal",
    bg: "bg-teal/10",
    items: [
      "Choose a destination and cruise line as a group",
      "Decide on dates that work for everyone",
      "Book your group reservation (8+ cabins often qualifies for group rates)",
      "Lock in the group rate with a deposit ($100-$250/person typically)",
      "Designate a group coordinator to manage communication",
    ],
  },
  {
    title: "6-9 Months Before",
    icon: FileText,
    color: "text-ocean",
    bg: "bg-ocean/10",
    items: [
      "Ensure everyone has a valid passport (6+ months beyond travel date)",
      "Set up a group chat or shared document for planning",
      "Book shore excursions as a group for discounts",
      "Research and book pre/post-cruise hotels if needed",
      "Discuss drink package and WiFi decisions as a group",
    ],
  },
  {
    title: "2-3 Months Before",
    icon: DollarSign,
    color: "text-coral",
    bg: "bg-coral/10",
    items: [
      "Make final payment (typically due 90 days before sailing)",
      "Book specialty dining reservations for the group",
      "Coordinate room assignments and cabin proximity",
      "Research port activities and create a shared itinerary",
      "Purchase travel insurance for each party",
    ],
  },
  {
    title: "1-2 Weeks Before",
    icon: Clock,
    color: "text-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10",
    items: [
      "Complete online check-in for all group members",
      "Upload passport photos and emergency contacts",
      "Download the cruise line's mobile app",
      "Coordinate transportation to the cruise port",
      "Create a packing list and share with the group",
    ],
  },
];

function GroupChecklist() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <h3 className="text-xl font-bold text-navy">
        Group Cruise Planning Timeline
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        A step-by-step checklist to keep your group cruise organized.
      </p>

      <div className="mt-6 space-y-6">
        {CHECKLIST_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${section.bg}`}
                >
                  <Icon className={`h-4 w-4 ${section.color}`} />
                </div>
                <h4 className="font-bold text-navy">
                  {section.title}
                </h4>
              </div>
              <ul className="mt-3 ml-10 space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <div className="mt-1 h-4 w-4 shrink-0 rounded border border-gray-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Coming Soon Features                                                */
/* ------------------------------------------------------------------ */

const COMING_FEATURES = [
  {
    icon: Share2,
    title: "Shared Itineraries",
    description:
      "Build a day-by-day itinerary and share it with your group. Everyone sees the plan in real-time.",
  },
  {
    icon: Vote,
    title: "Group Polls",
    description:
      "Can't decide on an excursion? Create a poll and let the group vote.",
  },
  {
    icon: BarChart3,
    title: "Expense Splitting",
    description:
      "Track shared expenses, split costs, and settle up before the trip ends.",
  },
  {
    icon: MessageSquare,
    title: "Group Chat",
    description:
      "In-app messaging for your group — no separate WhatsApp thread needed.",
  },
];

function ComingFeatures() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-coral/5 via-transparent to-coral/5 border border-coral/20 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10">
          <Users className="h-5 w-5 text-coral" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-navy">
            Coming Soon
          </h3>
          <p className="text-sm text-gray-500">
            Full group coordination tools are on the way.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {COMING_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <Icon className="h-5 w-5 text-coral" />
              <h4 className="mt-3 font-bold text-navy">
                {feature.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <a
          href="mailto:kali@shipsafesdk.com?subject=CruiseKit%20Groups%20Waitlist&body=I%27d%20like%20to%20be%20notified%20when%20Group%20Hub%20launches!"
          className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-coral/90 hover:shadow-md active:scale-[0.98]"
        >
          Get Notified When Groups Launches
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "How many people do you need for a group cruise rate?",
    a: "Most cruise lines require 8 or more staterooms to qualify for group rates. Some lines offer group benefits starting at 5 cabins. Group rates typically include perks like onboard credit, free cabins for organizers, or reduced deposits.",
  },
  {
    q: "Who should be the group coordinator?",
    a: "Pick someone organized who's comfortable managing deadlines and communication. The coordinator handles the group booking, tracks payments, and coordinates logistics. Many cruise lines assign a dedicated group coordinator on their end as well.",
  },
  {
    q: "Can everyone in the group book different cabin types?",
    a: "Yes! Group members can choose different cabin categories (inside, balcony, suite) while still being part of the same group booking. The group rate applies to the base category, with upgrades priced accordingly.",
  },
  {
    q: "What happens if someone in the group cancels?",
    a: "This depends on the cruise line's cancellation policy and how close to sailing the cancellation occurs. Most lines allow individual cancellations within the group as long as the minimum cabin count is maintained. Travel insurance is highly recommended for group bookings.",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Content                                                        */
/* ------------------------------------------------------------------ */

export default function GroupsContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Group Cost Splitter */}
      <motion.section
        className="py-10 sm:py-14"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <GroupCostSplitter />
      </motion.section>

      {/* Planning Checklist */}
      <motion.section
        className="pb-10 sm:pb-14"
        initial="hidden"
        animate="visible"
        variants={{
          ...fadeUp,
          visible: {
            ...fadeUp.visible,
            transition: { duration: 0.5, delay: 0.1 },
          },
        }}
      >
        <GroupChecklist />
      </motion.section>

      {/* Coming Features */}
      <motion.section
        className="pb-10 sm:pb-14"
        initial="hidden"
        animate="visible"
        variants={{
          ...fadeUp,
          visible: {
            ...fadeUp.visible,
            transition: { duration: 0.5, delay: 0.2 },
          },
        }}
      >
        <ComingFeatures />
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
