"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  DollarSign,
  Heart,
  Wine,
  Wifi,
  UtensilsCrossed,
  MapPin,
  Shield,
  Anchor,
  Car,
  RotateCcw,
  ArrowUp,
  Share2,
  Check,
} from "lucide-react";
import type { CostBreakdown as CostBreakdownType, CalculatorInputs } from "@cruise/shared/types";
import { CRUISE_LINES } from "@cruise/shared/constants";
import Link from "next/link";
import AnimatedCounter from "@/components/shared/animated-counter";
import AffiliateLink from "@/components/shared/affiliate-link";
import AffiliateDisclosure from "@/components/shared/affiliate-disclosure";
import AppHandoff from "@/components/shared/app-handoff";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { Button } from "@/components/ui/button";
import { getHotelLink, getMedEvacLink } from "@/lib/affiliate-config";
import { getDeckPlanLink } from "@/lib/data/deck-plan-urls";
import { cn } from "@/lib/utils/cn";

interface CostBreakdownProps {
  breakdown: CostBreakdownType;
  cruiseLineId: string;
  inputs: CalculatorInputs;
  /** When provided, enables comparison mode */
  comparisonBreakdown?: CostBreakdownType;
  comparisonCruiseLineId?: string;
  /** Callback to go back to Step 1 for adding a comparison line */
  onCompare?: () => void;
  /** Inline-adjust callbacks — when present, the user can drop add-ons
   *  directly from the result view and watch the delta shrink live. */
  onRemoveDrinkPackage?: () => void;
  onRemoveWifi?: () => void;
  onRemoveSpecialtyDining?: () => void;
  onRemoveExcursions?: () => void;
}

const COST_ITEMS = [
  { key: "baseFare" as const, label: "Advertised Fare", icon: DollarSign },
  { key: "gratuities" as const, label: "Gratuities", icon: Heart },
  { key: "drinkPackage" as const, label: "Drink Package", icon: Wine },
  { key: "wifi" as const, label: "WiFi", icon: Wifi },
  { key: "specialtyDining" as const, label: "Specialty Dining", icon: UtensilsCrossed },
  { key: "excursions" as const, label: "Excursions", icon: MapPin },
  { key: "travelInsurance" as const, label: "Travel Insurance", icon: Shield },
  { key: "portFees" as const, label: "Port Fees & Taxes", icon: Anchor },
  { key: "parking" as const, label: "Parking", icon: Car },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

/** Get brand color from CRUISE_LINES constant */
function getBrandColor(cruiseLineId: string): string {
  const line = CRUISE_LINES.find((cl) => cl.id === cruiseLineId);
  return line?.color ?? "#6B7280";
}

/** Get display name from CRUISE_LINES constant */
function getLineName(cruiseLineId: string): string {
  const line = CRUISE_LINES.find((cl) => cl.id === cruiseLineId);
  return line?.name ?? cruiseLineId;
}

/* ------------------------------------------------------------------ */
/*  Delta Hero — lead with the gap, not the total                      */
/*  The thesis of CruiseKit is "advertised vs real". Showing the total */
/*  without the delta buries the insight. This component makes the     */
/*  percentage gap the headline and gives users a sharable one-liner.  */
/* ------------------------------------------------------------------ */

function DeltaHero({
  lineName,
  cruiseLineId,
  advertised,
  real,
  percentOver,
}: {
  lineName: string;
  cruiseLineId: string;
  advertised: number;
  real: number;
  percentOver: number;
}) {
  const [copied, setCopied] = useState(false);
  const hidden = Math.max(0, real - advertised);
  // Bar widths clamp at 0–100 so a negative or zero delta still renders cleanly.
  const advertisedPct = real > 0 ? Math.max(0, Math.min(100, (advertised / real) * 100)) : 0;
  const hiddenPct = 100 - advertisedPct;

  const shareText =
    `My ${lineName} cruise costs ${percentOver}% more than the sticker price. ` +
    `$${advertised.toLocaleString()} advertised → $${Math.round(real).toLocaleString()} real. ` +
    `Calculate yours at cruisekit.app/calculator`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // User cancelled or share unavailable — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard denied — no-op; UI gives no false feedback.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <CruiseLineLogo cruiseLineId={cruiseLineId} size="md" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Real cost
            </p>
            <p className="text-sm font-semibold text-navy">{lineName}</p>
          </div>
        </div>

        <h2 className="mb-5 text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
          Your {lineName} cruise will cost{" "}
          <span className="text-coral">~{percentOver}% more</span> than the
          sticker price.
        </h2>

        {/* Delta bar */}
        <div className="mb-4">
          <div className="flex h-10 w-full overflow-hidden rounded-lg border border-gray-200">
            <div
              className="flex items-center justify-center bg-navy text-[11px] font-bold text-white transition-all"
              style={{ width: `${advertisedPct}%` }}
            >
              {advertisedPct > 16 && "Advertised"}
            </div>
            <div
              className="flex items-center justify-center bg-coral text-[11px] font-bold text-white transition-all"
              style={{ width: `${hiddenPct}%` }}
            >
              {hiddenPct > 16 && "Hidden costs"}
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="font-price font-semibold text-navy">
              ${advertised.toLocaleString()} advertised
            </span>
            <span className="font-price font-bold text-coral">
              ${Math.round(real).toLocaleString()} real
            </span>
          </div>
        </div>

        {/* Hidden cost callout */}
        <p className="mb-5 text-sm text-gray-600">
          That&apos;s{" "}
          <span className="font-price font-bold text-coral">
            +${Math.round(hidden).toLocaleString()}
          </span>{" "}
          in fees, packages, and add-ons the advertised price doesn&apos;t
          show.
        </p>

        {/* Share link (growth loop) */}
        <button
          onClick={handleShare}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            copied
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-navy/20 bg-white text-navy hover:bg-navy/5"
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied — share with a friend
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share this gap
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Deck-plan link — official cruise-line page in a new tab            */
/* ------------------------------------------------------------------ */

function DeckPlanLink({ cruiseLineId }: { cruiseLineId: string }) {
  const link = getDeckPlanLink(cruiseLineId);
  if (!link) return null;
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-teal hover:shadow-md"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-navy">
            View deck plans
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{link.note}</p>
        </div>
        <span className="text-xs text-gray-400 group-hover:text-teal transition-colors">
          Opens {new URL(link.url).hostname.replace(/^www\./, "")} &rarr;
        </span>
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline adjust — drop-any-add-on chips                              */
/*  Designer's F-01 intent: turn results into a consideration loop.    */
/*  Clicking a chip fires the parent callback; CalculatorForm already  */
/*  memoizes `breakdown` off `calculatorInputs`, so the delta updates  */
/*  immediately when state flips.                                      */
/* ------------------------------------------------------------------ */

function InlineAdjustPanel({
  breakdown,
  onRemoveDrinkPackage,
  onRemoveWifi,
  onRemoveSpecialtyDining,
  onRemoveExcursions,
}: {
  breakdown: CostBreakdownType;
  onRemoveDrinkPackage?: () => void;
  onRemoveWifi?: () => void;
  onRemoveSpecialtyDining?: () => void;
  onRemoveExcursions?: () => void;
}) {
  type Row = {
    label: string;
    saving: number;
    onRemove?: () => void;
  };

  const rows: Row[] = [
    {
      label: "Drink package",
      saving: breakdown.drinkPackage,
      onRemove: onRemoveDrinkPackage,
    },
    { label: "WiFi", saving: breakdown.wifi, onRemove: onRemoveWifi },
    {
      label: "Specialty dining",
      saving: breakdown.specialtyDining,
      onRemove: onRemoveSpecialtyDining,
    },
    {
      label: "Excursions",
      saving: breakdown.excursions,
      onRemove: onRemoveExcursions,
    },
  ];

  const activeRows = rows.filter((r) => r.saving > 0 && r.onRemove);

  if (activeRows.length === 0) return null;

  return (
    <div className="mx-auto mb-10 max-w-3xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Drop what you don&rsquo;t need &mdash; watch the gap shrink
      </p>
      <div className="flex flex-wrap gap-2">
        {activeRows.map((row) => (
          <button
            key={row.label}
            type="button"
            onClick={row.onRemove}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              "border-gray-200 bg-white text-navy",
              "hover:border-coral hover:bg-coral/5 hover:text-coral"
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-coral group-hover:text-white transition-colors">
              &times;
            </span>
            {row.label}
            <span className="font-price text-xs font-bold text-coral">
              &minus;${Math.round(row.saving).toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single mode (unchanged original layout)                            */
/* ------------------------------------------------------------------ */

function SingleBreakdown({
  breakdown,
  cruiseLineId,
  inputs,
  onCompare,
  onRemoveDrinkPackage,
  onRemoveWifi,
  onRemoveSpecialtyDining,
  onRemoveExcursions,
}: {
  breakdown: CostBreakdownType;
  cruiseLineId: string;
  inputs: CalculatorInputs;
  onCompare?: () => void;
  onRemoveDrinkPackage?: () => void;
  onRemoveWifi?: () => void;
  onRemoveSpecialtyDining?: () => void;
  onRemoveExcursions?: () => void;
}) {
  const totalGuests = inputs.adults + inputs.children;
  const visibleItems = COST_ITEMS.filter((item) => breakdown[item.key] > 0);

  const lineName = getLineName(cruiseLineId);
  const percentOver = Math.round(breakdown.percentAboveAdvertised);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Delta-led hero: lead with the gap, not the total. */}
      <DeltaHero
        lineName={lineName}
        cruiseLineId={cruiseLineId}
        advertised={inputs.baseFare}
        real={breakdown.grandTotal}
        percentOver={percentOver}
      />

      {/* Inline-adjust: let users drop the biggest four removable line
          items directly from the result and watch the delta shrink.
          Parent owns the state; breakdown recomputes via useMemo. */}
      <InlineAdjustPanel
        breakdown={breakdown}
        onRemoveDrinkPackage={onRemoveDrinkPackage}
        onRemoveWifi={onRemoveWifi}
        onRemoveSpecialtyDining={onRemoveSpecialtyDining}
        onRemoveExcursions={onRemoveExcursions}
      />

      <p className="mx-auto mb-4 max-w-2xl text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
        How it breaks down
      </p>

      {/* Cost Items */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-2xl"
      >
        {visibleItems.map((item, index) => {
          const Icon = item.icon;
          const isBase = item.key === "baseFare";
          return (
            <motion.div
              key={item.key}
              variants={itemVariants}
              className={cn(
                "flex items-center justify-between py-3",
                index < visibleItems.length - 1 && "border-b border-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    isBase ? "bg-navy/10" : "bg-teal/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isBase ? "text-navy" : "text-teal"
                    )}
                  />
                </span>
                <span className="text-sm font-medium text-navy">
                  {!isBase && "+ "}
                  {item.label}
                </span>
              </div>
              <span className="font-price text-sm font-semibold text-navy">
                <AnimatedCounter
                  value={breakdown[item.key]}
                  duration={1.2}
                />
              </span>
            </motion.div>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t-2 border-navy/20" />

        {/* Grand Total */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between py-3"
        >
          <span className="text-lg font-bold text-navy">TOTAL</span>
          <span className="font-price text-xl font-bold text-coral">
            <AnimatedCounter
              value={breakdown.grandTotal}
              duration={1.5}
              className="text-coral"
            />
          </span>
        </motion.div>

        {/* Per Person Per Day */}
        <motion.div
          variants={itemVariants}
          className="mt-2 rounded-xl bg-navy/5 p-4 text-center"
        >
          <p className="text-sm text-gray-500">Per person, per day</p>
          <p className="font-price text-2xl font-bold text-navy">
            <AnimatedCounter
              value={breakdown.perPersonPerDay}
              duration={1.2}
              decimals={2}
            />
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Based on {totalGuests} {totalGuests === 1 ? "guest" : "guests"},{" "}
            {inputs.duration} nights
          </p>
        </motion.div>

        {/* Often Forgotten — Affiliate CTAs */}
        <motion.div variants={itemVariants} className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            Often forgotten
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-navy">
                  Pre-cruise hotel
                </h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Flying in the night before? Budget $120–250 for a hotel near
                the port.
              </p>
              <AffiliateLink
                href={getHotelLink("https://www.booking.com/")}
                partner="booking.com"
                source="calculator"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Search hotels →
              </AffiliateLink>
              <AffiliateDisclosure className="mt-1.5" />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-navy">
                  Medical evacuation
                </h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Helicopter evacs can cost $50k+. Medjet covers transport home —
                from ~$99/year.
              </p>
              <AffiliateLink
                href={getMedEvacLink("https://www.medjetassist.com/")}
                partner="medjet"
                source="calculator"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                Learn more →
              </AffiliateLink>
              <AffiliateDisclosure className="mt-1.5" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Deck-plan link-out — surface the official cruise-line deck plan
          page so users can scope out decks without leaving CruiseKit to
          find the URL themselves. No hosted copies (copyright + refit). */}
      <DeckPlanLink cruiseLineId={cruiseLineId} />

      {/* "So what?" — show users the two highest-impact moves for cutting
          the gap they just saw. Comparison is the competitive surface; the
          smaller-add-ons rerun puts the thesis in their hands directly. */}
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Can we cut the gap?
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              if (onCompare) {
                onCompare();
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-teal hover:shadow-md"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <ArrowUp className="h-5 w-5 rotate-45" />
            </div>
            <div>
              <div className="text-sm font-semibold text-navy group-hover:text-teal">
                Try a different cruise line
              </div>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {lineName} may not be the cheapest way to get here. Side-by-side
                the numbers against another line in the same week.
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-teal hover:shadow-md"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-navy group-hover:text-teal">
                Skip the add-ons you don&rsquo;t need
              </div>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Drinks, WiFi, and specialty dining add the most. Rerun the
                calculator with fewer toggles to see the real floor.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile handoff — post-calc signal moment */}
      <div className="mx-auto mt-10 max-w-3xl">
        <AppHandoff variant="calculator-result" />
      </div>

      {/* Source attribution — understated, links to methodology */}
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-gray-400">
        Prices{" "}
        <Link
          href="/methodology"
          className="underline decoration-gray-300 underline-offset-2 hover:text-navy hover:decoration-navy"
        >
          verified
        </Link>{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            if (onCompare) {
              onCompare();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <ArrowUp className="h-4 w-4" />
          Compare with another cruise line
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            window.location.reload();
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison Column                                                  */
/* ------------------------------------------------------------------ */

function ComparisonColumn({
  breakdown,
  otherBreakdown,
  cruiseLineId,
  inputs,
  brandColor,
}: {
  breakdown: CostBreakdownType;
  otherBreakdown: CostBreakdownType;
  cruiseLineId: string;
  inputs: CalculatorInputs;
  brandColor: string;
}) {
  const totalGuests = inputs.adults + inputs.children;
  const visibleItems = COST_ITEMS.filter(
    (item) => breakdown[item.key] > 0 || otherBreakdown[item.key] > 0
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      style={{ borderTopWidth: 4, borderTopColor: brandColor }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <CruiseLineLogo cruiseLineId={cruiseLineId} size="md" />
        <div>
          <p className="text-sm font-bold text-navy">
            {getLineName(cruiseLineId)}
          </p>
          <p className="font-price text-xs text-gray-400">
            {Math.round(breakdown.percentAboveAdvertised)}% above advertised
          </p>
        </div>
      </div>

      {/* Cost Items */}
      <div className="px-5 py-3">
        {visibleItems.map((item, index) => {
          const val = breakdown[item.key];
          const otherVal = otherBreakdown[item.key];
          const isLower = val > 0 && otherVal > 0 && val < otherVal;
          const Icon = item.icon;
          const isBase = item.key === "baseFare";

          return (
            <div
              key={item.key}
              className={cn(
                "flex items-center justify-between py-2.5",
                index < visibleItems.length - 1 && "border-b border-gray-50"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md",
                    isBase ? "bg-navy/10" : "bg-teal/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3 w-3",
                      isBase ? "text-navy" : "text-teal"
                    )}
                  />
                </span>
                <span className="text-xs font-medium text-navy">
                  {item.label}
                </span>
              </div>
              <span
                className={cn(
                  "font-price text-xs font-semibold",
                  isLower ? "text-green-600" : "text-navy"
                )}
              >
                ${Math.round(val).toLocaleString()}
              </span>
            </div>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t-2 border-navy/20" />

        {/* Grand Total */}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm font-bold text-navy">TOTAL</span>
          <span
            className={cn(
              "font-price text-lg font-bold",
              breakdown.grandTotal <= otherBreakdown.grandTotal
                ? "text-green-600"
                : "text-coral"
            )}
          >
            <AnimatedCounter
              value={breakdown.grandTotal}
              duration={1.5}
              className={
                breakdown.grandTotal <= otherBreakdown.grandTotal
                  ? "text-green-600"
                  : "text-coral"
              }
            />
          </span>
        </div>

        {/* Per Person Per Day */}
        <div className="mt-2 rounded-lg bg-navy/5 p-3 text-center">
          <p className="text-xs text-gray-500">Per person, per day</p>
          <p className="font-price text-lg font-bold text-navy">
            <AnimatedCounter
              value={breakdown.perPersonPerDay}
              duration={1.2}
              decimals={2}
            />
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {totalGuests} {totalGuests === 1 ? "guest" : "guests"},{" "}
            {inputs.duration} nights
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison mode layout                                             */
/* ------------------------------------------------------------------ */

function ComparisonBreakdown({
  breakdown,
  cruiseLineId,
  comparisonBreakdown,
  comparisonCruiseLineId,
  inputs,
}: {
  breakdown: CostBreakdownType;
  cruiseLineId: string;
  comparisonBreakdown: CostBreakdownType;
  comparisonCruiseLineId: string;
  inputs: CalculatorInputs;
}) {
  const diff = Math.abs(breakdown.grandTotal - comparisonBreakdown.grandTotal);
  const isSame = diff < 1;
  const primaryCheaper = breakdown.grandTotal < comparisonBreakdown.grandTotal;
  const cheaperName = primaryCheaper
    ? getLineName(cruiseLineId)
    : getLineName(comparisonCruiseLineId);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <p className="mb-2 text-lg font-medium text-gray-500">
          Side-by-side comparison
        </p>
        <p className="text-sm text-gray-400">
          Same trip details, different cruise lines
        </p>
      </motion.div>

      {/* Two-column grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <ComparisonColumn
            breakdown={breakdown}
            otherBreakdown={comparisonBreakdown}
            cruiseLineId={cruiseLineId}
            inputs={inputs}
            brandColor={getBrandColor(cruiseLineId)}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ComparisonColumn
            breakdown={comparisonBreakdown}
            otherBreakdown={breakdown}
            cruiseLineId={comparisonCruiseLineId}
            inputs={inputs}
            brandColor={getBrandColor(comparisonCruiseLineId)}
          />
        </motion.div>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className={cn(
          "mt-8 rounded-xl border p-5 text-center",
          isSame
            ? "border-navy/20 bg-navy/5"
            : "border-green-200 bg-green-50"
        )}
      >
        {isSame ? (
          <p className="text-sm font-semibold text-navy">
            Both lines cost the same for this trip
          </p>
        ) : (
          <p className="text-sm font-semibold text-navy">
            You save{" "}
            <span className="font-price font-bold text-green-600">
              ${Math.round(diff).toLocaleString()}
            </span>{" "}
            with {cheaperName}
          </p>
        )}
      </motion.div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <ArrowUp className="h-4 w-4" />
          Adjust selections
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            window.location.reload();
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export — delegates to single or comparison mode               */
/* ------------------------------------------------------------------ */

export default function CostBreakdown({
  breakdown,
  cruiseLineId,
  inputs,
  comparisonBreakdown,
  comparisonCruiseLineId,
  onCompare,
  onRemoveDrinkPackage,
  onRemoveWifi,
  onRemoveSpecialtyDining,
  onRemoveExcursions,
}: CostBreakdownProps) {
  // Comparison mode: both props provided
  if (comparisonBreakdown && comparisonCruiseLineId) {
    return (
      <ComparisonBreakdown
        breakdown={breakdown}
        cruiseLineId={cruiseLineId}
        comparisonBreakdown={comparisonBreakdown}
        comparisonCruiseLineId={comparisonCruiseLineId}
        inputs={inputs}
      />
    );
  }

  // Single mode: keep existing layout unchanged
  return (
    <SingleBreakdown
      breakdown={breakdown}
      cruiseLineId={cruiseLineId}
      inputs={inputs}
      onCompare={onCompare}
      onRemoveDrinkPackage={onRemoveDrinkPackage}
      onRemoveWifi={onRemoveWifi}
      onRemoveSpecialtyDining={onRemoveSpecialtyDining}
      onRemoveExcursions={onRemoveExcursions}
    />
  );
}
