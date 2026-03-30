"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Crown,
  Check,
  X,
} from "lucide-react";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import {
  LOYALTY_PROGRAMS,
  getMemberTier,
  type LoyaltyProgram,
  type LoyaltyTier,
} from "@/lib/data/loyalty-programs";

/* ------------------------------------------------------------------ */
/*  Animation                                                           */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Program Overview Grid                                               */
/* ------------------------------------------------------------------ */

function ProgramGrid({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {LOYALTY_PROGRAMS.map((program) => (
        <motion.button
          key={program.cruiseLineId}
          variants={staggerItem}
          onClick={() => onSelect(program.cruiseLineId)}
          className="group flex flex-col items-start rounded-xl border border-gray-200 bg-white p-5 text-left shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
        >
          <div className="flex w-full items-center gap-3">
            <CruiseLineLogo
              cruiseLineId={program.cruiseLineId}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-navy truncate">
                {program.programName}
              </h3>
              <p className="text-xs text-gray-500">
                {program.tiers.length} tiers &middot;{" "}
                {program.pointsUnit}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {program.tiers.map((tier) => (
              <span
                key={tier.name}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: `${tier.color}15`,
                  color: tier.color,
                }}
              >
                {tier.name}
              </span>
            ))}
          </div>

          <ul className="mt-3 space-y-1">
            {program.keyPerks.slice(0, 3).map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-1.5 text-xs text-gray-600"
              >
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-3 flex items-center gap-1 text-xs font-semibold text-teal opacity-0 transition-opacity group-hover:opacity-100">
            View Details <ArrowRight className="h-3 w-3" />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  "What Tier Am I?" Calculator                                        */
/* ------------------------------------------------------------------ */

function TierCalculator() {
  const [nights, setNights] = useState(30);

  const results = useMemo(() => {
    return LOYALTY_PROGRAMS.map((program) => {
      const tier = getMemberTier(program.cruiseLineId, nights);
      return {
        program,
        currentTier: tier,
        nextTier: tier
          ? program.tiers[program.tiers.indexOf(tier) + 1] ?? null
          : program.tiers[0] ?? null,
      };
    });
  }, [nights]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]/10">
          <Crown className="h-5 w-5 text-[#8B5CF6]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-navy">
            What Tier Am I?
          </h3>
          <p className="text-sm text-gray-500">
            Enter your sail nights to see your tier on every cruise line.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Total Sail Nights
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={200}
            value={nights}
            onChange={(e) => setNights(parseInt(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#8B5CF6]"
          />
          <input
            type="number"
            min={0}
            max={1000}
            value={nights}
            onChange={(e) =>
              setNights(Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-bold text-navy focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ program, currentTier, nextTier }) => (
          <div
            key={program.cruiseLineId}
            className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
          >
            <CruiseLineLogo
              cruiseLineId={program.cruiseLineId}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 truncate">
                {program.programName}
              </p>
              {currentTier ? (
                <p
                  className="text-sm font-bold"
                  style={{ color: currentTier.color }}
                >
                  {currentTier.name}
                </p>
              ) : (
                <p className="text-sm font-medium text-gray-400">
                  Not yet enrolled
                </p>
              )}
              {nextTier && (
                <p className="text-[10px] text-gray-400">
                  Next: {nextTier.name} at{" "}
                  {nextTier.qualifyingPoints}{" "}
                  {program.pointsUnit}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Program Detail Section                                              */
/* ------------------------------------------------------------------ */

function ProgramDetail({
  program,
  isExpanded,
  onToggle,
}: {
  program: LoyaltyProgram;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <CruiseLineLogo
            cruiseLineId={program.cruiseLineId}
            size="md"
          />
          <div className="text-left">
            <h3 className="text-lg font-bold text-navy">
              {program.programName}
            </h3>
            <p className="text-sm text-gray-500">
              {program.tiers.length} tiers &middot;{" "}
              {program.pointsUnit} &middot;{" "}
              {program.statusMatchAvailable ? (
                <span className="text-success">Status match available</span>
              ) : (
                <span className="text-gray-400">No status match</span>
              )}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 px-5 pb-6 sm:px-6">
          {/* Tier progression */}
          <div className="mt-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Tier Progression
            </h4>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left font-medium text-gray-500">
                      Tier
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      Required
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      Key Perks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {program.tiers.map((tier) => (
                    <tr
                      key={tier.name}
                      className="border-b border-gray-50"
                    >
                      <td className="py-3">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: `${tier.color}15`,
                            color: tier.color,
                          }}
                        >
                          {tier.name}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-700">
                        {tier.qualifyingPoints}{" "}
                        {program.pointsUnit}
                      </td>
                      <td className="py-3">
                        <ul className="space-y-0.5">
                          {tier.perks.slice(0, 4).map((perk) => (
                            <li
                              key={perk}
                              className="flex items-start gap-1 text-xs text-gray-600"
                            >
                              <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                              {perk}
                            </li>
                          ))}
                          {tier.perks.length > 4 && (
                            <li className="text-xs text-gray-400">
                              +{tier.perks.length - 4} more
                            </li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {program.notes && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <p className="text-xs leading-relaxed text-gray-600">
                <span className="font-semibold">Note:</span>{" "}
                {program.notes}
              </p>
            </div>
          )}

          {/* Enrollment link */}
          <a
            href={program.enrollmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-teal-dark"
          >
            Enroll at {program.programName}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Match Overview                                               */
/* ------------------------------------------------------------------ */

function StatusMatchOverview() {
  const matchPrograms = LOYALTY_PROGRAMS.filter(
    (p) => p.statusMatchAvailable
  );
  const noMatchPrograms = LOYALTY_PROGRAMS.filter(
    (p) => !p.statusMatchAvailable
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <h3 className="text-xl font-bold text-navy">Status Match Availability</h3>
      <p className="mt-1 text-sm text-gray-500">
        Some cruise lines will match your loyalty status from competing lines.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-success">
            <Check className="h-4 w-4" />
            Status Match Available
          </h4>
          <ul className="mt-3 space-y-2">
            {matchPrograms.map((p) => (
              <li
                key={p.cruiseLineId}
                className="flex items-center gap-2.5"
              >
                <CruiseLineLogo
                  cruiseLineId={p.cruiseLineId}
                  size="sm"
                />
                <span className="text-sm font-medium text-navy">
                  {p.programName}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <X className="h-4 w-4" />
            No Status Match
          </h4>
          <ul className="mt-3 space-y-2">
            {noMatchPrograms.map((p) => (
              <li
                key={p.cruiseLineId}
                className="flex items-center gap-2.5"
              >
                <CruiseLineLogo
                  cruiseLineId={p.cruiseLineId}
                  size="sm"
                />
                <span className="text-sm text-gray-500">
                  {p.programName}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "How do cruise loyalty programs work?",
    a: "Most cruise lines award points based on the number of nights you sail. Higher cabin categories (suites, balconies) often earn bonus points. As you accumulate points, you advance through tiers that unlock increasingly valuable perks like priority boarding, free drinks, cabin upgrades, and exclusive events.",
  },
  {
    q: "Can I match my loyalty status to another cruise line?",
    a: "Some cruise lines periodically offer status match promotions. Royal Caribbean, Carnival, MSC, and Princess have historically offered status matching. Check each line's website for current promotions, as these are typically limited-time offers.",
  },
  {
    q: "Which cruise line has the best loyalty program?",
    a: "It depends on your cruising frequency and preferences. Norwegian's Latitudes Rewards is easy to earn (1 point per night). Royal Caribbean's Crown & Anchor Society offers excellent Diamond-level perks. Virgin Voyages gives meaningful perks early. Disney's Castaway Club counts cruises, not nights, making shorter sailings more rewarding.",
  },
  {
    q: "Do loyalty points expire?",
    a: "Most cruise line loyalty points do not expire as long as your account remains active. However, some lines may require a sailing within a certain period to maintain active status. Check each program's terms for specific policies.",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Content                                                        */
/* ------------------------------------------------------------------ */

export default function LoyaltyContent() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(
    null
  );
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(
    new Set()
  );

  const toggleProgram = (id: string) => {
    setExpandedPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleProgramSelect = (id: string) => {
    setExpandedPrograms((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Scroll to detail section
    setTimeout(() => {
      document
        .getElementById(`program-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Program Overview Grid */}
      <motion.section
        className="py-10 sm:py-14"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          All Loyalty Programs
        </h2>
        <p className="mt-2 mb-6 text-gray-500">
          Compare 9 cruise line loyalty programs at a glance. Click any
          card to see full tier details.
        </p>
        <ProgramGrid onSelect={handleProgramSelect} />
      </motion.section>

      {/* Tier Calculator */}
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
        <TierCalculator />
      </motion.section>

      {/* Program Details */}
      <section className="pb-10 sm:pb-14">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Program Details
        </h2>
        <p className="mt-2 mb-6 text-gray-500">
          Expand each program to see tier progression, perks, and
          enrollment links.
        </p>
        <div className="space-y-3">
          {LOYALTY_PROGRAMS.map((program) => (
            <div key={program.cruiseLineId} id={`program-${program.cruiseLineId}`}>
              <ProgramDetail
                program={program}
                isExpanded={expandedPrograms.has(program.cruiseLineId)}
                onToggle={() => toggleProgram(program.cruiseLineId)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Status Match */}
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
        <StatusMatchOverview />
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
