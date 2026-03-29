"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import type { CostBreakdown as CostBreakdownType, CalculatorInputs } from "@cruise/shared/types";
import { CRUISE_LINES } from "@cruise/shared/constants";
import AnimatedCounter from "@/components/shared/animated-counter";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { Button } from "@/components/ui/button";
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
/*  Single mode (unchanged original layout)                            */
/* ------------------------------------------------------------------ */

function SingleBreakdown({
  breakdown,
  cruiseLineId,
  inputs,
  onCompare,
}: {
  breakdown: CostBreakdownType;
  cruiseLineId: string;
  inputs: CalculatorInputs;
  onCompare?: () => void;
}) {
  const totalGuests = inputs.adults + inputs.children;
  const visibleItems = COST_ITEMS.filter((item) => breakdown[item.key] > 0);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Big Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-4 flex items-center justify-center gap-3">
          <CruiseLineLogo cruiseLineId={cruiseLineId} size="lg" />
        </div>
        <p className="mb-2 text-lg font-medium text-gray-500">
          Your cruise REALLY costs
        </p>
        <div className="font-price text-5xl font-bold text-coral sm:text-6xl lg:text-7xl">
          <AnimatedCounter
            value={breakdown.grandTotal}
            duration={2}
            className="text-coral"
          />
        </div>
        <p className="mt-3 text-base text-gray-500">
          That&apos;s{" "}
          <span className="font-semibold text-coral">
            {Math.round(breakdown.percentAboveAdvertised)}%
          </span>{" "}
          more than the{" "}
          <span className="font-price font-semibold text-navy">
            ${inputs.baseFare.toLocaleString()}
          </span>{" "}
          advertised price
        </p>
      </motion.div>

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

        {/* Additional Cost Highlight */}
        <motion.div
          variants={itemVariants}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-coral/20 bg-coral/5 p-4"
        >
          <ArrowUp className="h-5 w-5 text-coral" />
          <p className="text-sm font-medium text-navy">
            Hidden costs add{" "}
            <span className="font-price font-bold text-coral">
              ${breakdown.totalAdditional.toLocaleString()}
            </span>{" "}
            to the advertised price
          </p>
        </motion.div>
      </motion.div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
    />
  );
}
