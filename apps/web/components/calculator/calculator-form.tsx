"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Ship,
  Sparkles,
  BarChart3,
} from "lucide-react";
import InfoTip from "@/components/shared/info-tip";
import type {
  CabinType,
  CalculatorInputs,
  CostBreakdown as CostBreakdownType,
} from "@cruise/shared/types";
import { calculateCosts } from "@cruise/shared/utils";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { getFareEstimate } from "@/lib/data/fare-estimates";
import { MONTH_LABELS, getSeasonalMultiplier } from "@/lib/data/seasonal-pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedCounter from "@/components/shared/animated-counter";
import CruiseLineSelector from "./cruise-line-selector";
import CostBreakdown from "./cost-breakdown";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DURATION_RANGES = [
  { label: "3-4", default: 4 },
  { label: "5-6", default: 5 },
  { label: "7", default: 7 },
  { label: "8-9", default: 9 },
  { label: "10-13", default: 10 },
  { label: "14+", default: 14 },
];

const CABIN_TYPES: { value: CabinType; label: string }[] = [
  { value: "inside", label: "Inside" },
  { value: "ocean-view", label: "Ocean View" },
  { value: "balcony", label: "Balcony" },
  { value: "suite", label: "Suite" },
];

const STEP_LABELS = [
  { num: 1, label: "Trip Basics", icon: Ship },
  { num: 2, label: "Add-Ons", icon: Sparkles },
  { num: 3, label: "Results", icon: BarChart3 },
];

/* ------------------------------------------------------------------ */
/*  NumberStepper                                                      */
/* ------------------------------------------------------------------ */

function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="min-w-[80px] text-sm font-medium text-navy">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy transition-colors hover:bg-gray-50 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-navy">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy transition-colors hover:bg-gray-50 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEP_LABELS.map((s, idx) => {
        const Icon = s.icon;
        const isActive = current === s.num;
        const isCompleted = current > s.num;
        return (
          <div key={s.num} className="flex items-center gap-2">
            {idx > 0 && (
              <div
                className={cn(
                  "hidden h-0.5 w-8 sm:block",
                  isCompleted ? "bg-teal" : "bg-gray-200"
                )}
              />
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-teal text-white"
                    : isCompleted
                      ? "bg-teal/20 text-teal"
                      : "bg-gray-100 text-gray-400"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive
                    ? "text-teal"
                    : isCompleted
                      ? "text-teal/70"
                      : "text-gray-400"
                )}
              >
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide variants                                                     */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  CalculatorForm                                                     */
/* ------------------------------------------------------------------ */

interface CalculatorFormProps {
  /** Pre-select a cruise line (e.g. from a per-line SEO landing page) — legacy single prop */
  defaultCruiseLineId?: string;
  /** Pre-select up to 2 cruise lines for comparison */
  defaultCruiseLineIds?: string[];
  /** Pre-select cruise duration */
  defaultDuration?: number;
  /** Pre-select number of adults */
  defaultAdults?: number;
  /** Pre-select travel month (0-indexed: 0=Jan, 11=Dec) */
  defaultMonth?: number;
  /** Pre-fill base fare (e.g., from a deal card click) */
  defaultFare?: string;
}

export default function CalculatorForm({
  defaultCruiseLineId,
  defaultCruiseLineIds,
  defaultDuration,
  defaultAdults,
  defaultMonth,
  defaultFare,
}: CalculatorFormProps = {}) {
  /* -- Resolve default cruise line IDs with backward compat ---------- */
  const resolvedDefaultIds = useMemo(() => {
    if (defaultCruiseLineIds && defaultCruiseLineIds.length > 0) {
      return defaultCruiseLineIds.slice(0, 2);
    }
    if (defaultCruiseLineId) {
      return [defaultCruiseLineId];
    }
    return [];
  }, [defaultCruiseLineIds, defaultCruiseLineId]);

  /* -- Step state -------------------------------------------------- */
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  /* -- Step 1 state ------------------------------------------------ */
  const [selectedLines, setSelectedLines] = useState<string[]>(resolvedDefaultIds);
  const [month, setMonth] = useState<number | undefined>(defaultMonth);
  const [duration, setDuration] = useState(defaultDuration ?? 7);
  const [adults, setAdults] = useState(defaultAdults ?? 2);
  const [children, setChildren] = useState(0);
  const [showChildren, setShowChildren] = useState(false);
  const [cabinType, setCabinType] = useState<CabinType>("balcony");
  const [baseFare, setBaseFare] = useState(defaultFare ?? "");

  const seasonalInfo = month !== undefined ? getSeasonalMultiplier(month) : null;

  /* -- Step 2 state ------------------------------------------------ */
  const [drinkPackageOn, setDrinkPackageOn] = useState(false);
  const [drinkTier, setDrinkTier] = useState<string>("");
  const [wifiOn, setWifiOn] = useState(false);
  const [wifiTier, setWifiTier] = useState<string>("");
  const [specialtyMeals, setSpecialtyMeals] = useState(0);
  const [excursionBudget, setExcursionBudget] = useState(0);
  const [numPorts, setNumPorts] = useState(Math.max(1, (defaultDuration ?? 7) - 2));
  const [insuranceOn, setInsuranceOn] = useState(false);
  const [parkingOn, setParkingOn] = useState(false);
  const [parkingDays, setParkingDays] = useState(defaultDuration ?? 7);
  const [parkingCost, setParkingCost] = useState("25");

  /* -- Derived data ------------------------------------------------ */
  const primaryLineId = selectedLines[0] ?? null;
  const secondaryLineId = selectedLines[1] ?? null;
  const costs = primaryLineId ? CRUISE_LINE_COSTS[primaryLineId] : null;
  const comparisonCosts = secondaryLineId ? CRUISE_LINE_COSTS[secondaryLineId] : null;

  /* -- Fare estimate for discovery mode ------------------------------- */
  const fareEstimate = useMemo(() => {
    if (!primaryLineId) return null;
    return getFareEstimate(primaryLineId, duration, cabinType, month);
  }, [primaryLineId, duration, cabinType, month]);

  /** The effective base fare: user-entered value, or the mid estimate */
  const effectiveBaseFare = useMemo(() => {
    const userFare = parseFloat(baseFare);
    if (!isNaN(userFare) && userFare > 0) return userFare;
    return fareEstimate?.mid ?? 0;
  }, [baseFare, fareEstimate]);

  const isUsingEstimate = useMemo(() => {
    const userFare = parseFloat(baseFare);
    return (isNaN(userFare) || userFare <= 0) && fareEstimate !== null;
  }, [baseFare, fareEstimate]);

  // When duration changes update default ports
  const handleDurationChange = useCallback(
    (d: number) => {
      setDuration(d);
      setNumPorts(Math.max(1, d - 2));
      setParkingDays(d);
    },
    []
  );

  // When cruise line selection changes, reset add-on selections
  const handleCruiseLineChange = useCallback(
    (ids: string[]) => {
      setSelectedLines(ids);
      setDrinkPackageOn(false);
      setDrinkTier("");
      setWifiOn(false);
      setWifiTier("");
    },
    []
  );

  // Auto-set first tier when toggling on
  const handleDrinkToggle = useCallback(
    (on: boolean) => {
      setDrinkPackageOn(on);
      if (on && costs && costs.drinkPackages.tiers.length > 0 && !drinkTier) {
        setDrinkTier(costs.drinkPackages.tiers[0].name);
      }
    },
    [costs, drinkTier]
  );

  const handleWifiToggle = useCallback(
    (on: boolean) => {
      setWifiOn(on);
      if (on && costs && costs.wifiPackages.tiers.length > 0 && !wifiTier) {
        setWifiTier(costs.wifiPackages.tiers[0].name);
      }
    },
    [costs, wifiTier]
  );

  /* -- Price impact helpers ---------------------------------------- */
  const drinkImpact = useMemo(() => {
    if (!drinkPackageOn || !drinkTier || !costs) return 0;
    const tier = costs.drinkPackages.tiers.find((t) => t.name === drinkTier);
    return tier ? tier.pricePerDay * adults * duration : 0;
  }, [drinkPackageOn, drinkTier, costs, adults, duration]);

  const wifiImpact = useMemo(() => {
    if (!wifiOn || !wifiTier || !costs) return 0;
    const tier = costs.wifiPackages.tiers.find((t) => t.name === wifiTier);
    return tier ? tier.pricePerDay * (adults + children) * duration : 0;
  }, [wifiOn, wifiTier, costs, adults, children, duration]);

  const diningImpact = useMemo(() => {
    if (!costs) return 0;
    return costs.specialtyDining.averagePerMeal * specialtyMeals * (adults + children);
  }, [costs, specialtyMeals, adults, children]);

  const excursionImpact = useMemo(() => {
    return excursionBudget * numPorts * (adults + children);
  }, [excursionBudget, numPorts, adults, children]);

  const insuranceImpact = useMemo(() => {
    if (!insuranceOn || !costs) return 0;
    const fare = effectiveBaseFare;
    return (fare * costs.travelInsurancePercent) / 100;
  }, [insuranceOn, costs, baseFare]);

  const parkingImpact = useMemo(() => {
    if (!parkingOn) return 0;
    return parkingDays * (parseFloat(parkingCost) || 0);
  }, [parkingOn, parkingDays, parkingCost]);

  const runningTotal = useMemo(() => {
    const fare = effectiveBaseFare;
    if (!costs) return fare;
    const gratuities =
      costs.gratuityPerPersonPerDay * (adults + children) * duration;
    const portFees =
      costs.portFeesPerPersonPerDay * (adults + children) * duration;
    return (
      fare +
      gratuities +
      portFees +
      drinkImpact +
      wifiImpact +
      diningImpact +
      excursionImpact +
      insuranceImpact +
      parkingImpact
    );
  }, [
    baseFare,
    costs,
    adults,
    children,
    duration,
    drinkImpact,
    wifiImpact,
    diningImpact,
    excursionImpact,
    insuranceImpact,
    parkingImpact,
  ]);

  /* -- Build CalculatorInputs -------------------------------------- */
  const calculatorInputs: CalculatorInputs | null = useMemo(() => {
    if (!primaryLineId) return null;
    return {
      cruiseLineId: primaryLineId as CalculatorInputs["cruiseLineId"],
      duration,
      adults,
      children,
      cabinType,
      region: "caribbean",
      baseFare: effectiveBaseFare,
      drinkPackage: drinkPackageOn ? drinkTier || null : null,
      wifiPackage: wifiOn ? wifiTier || null : null,
      specialtyDiningMeals: specialtyMeals,
      excursionBudgetPerPort: excursionBudget,
      numberOfPorts: numPorts,
      addTravelInsurance: insuranceOn,
      addParking: parkingOn,
      parkingDays,
      parkingCostPerDay: parseFloat(parkingCost) || 0,
    };
  }, [
    primaryLineId,
    duration,
    adults,
    children,
    cabinType,
    baseFare,
    drinkPackageOn,
    drinkTier,
    wifiOn,
    wifiTier,
    specialtyMeals,
    excursionBudget,
    numPorts,
    insuranceOn,
    parkingOn,
    parkingDays,
    parkingCost,
  ]);

  /* -- Calculate results ------------------------------------------- */
  const breakdown: CostBreakdownType | null = useMemo(() => {
    if (!calculatorInputs || !costs) return null;
    return calculateCosts(calculatorInputs, costs);
  }, [calculatorInputs, costs]);

  /* -- Calculate comparison breakdown for second line --------------- */
  const comparisonBreakdown: CostBreakdownType | null = useMemo(() => {
    if (!calculatorInputs || !secondaryLineId || !comparisonCosts) return null;

    // Try matching drink tier name; fallback to first available or null
    let compDrinkTier: string | null = null;
    if (drinkPackageOn && drinkTier) {
      const matchByName = comparisonCosts.drinkPackages.tiers.find(
        (t) => t.name === drinkTier
      );
      if (matchByName) {
        compDrinkTier = matchByName.name;
      } else if (comparisonCosts.drinkPackages.tiers.length > 0) {
        compDrinkTier = comparisonCosts.drinkPackages.tiers[0].name;
      }
    }

    // Try matching wifi tier name; fallback to first available or null
    let compWifiTier: string | null = null;
    if (wifiOn && wifiTier) {
      const matchByName = comparisonCosts.wifiPackages.tiers.find(
        (t) => t.name === wifiTier
      );
      if (matchByName) {
        compWifiTier = matchByName.name;
      } else if (comparisonCosts.wifiPackages.tiers.length > 0) {
        compWifiTier = comparisonCosts.wifiPackages.tiers[0].name;
      }
    }

    const compInputs: CalculatorInputs = {
      ...calculatorInputs,
      cruiseLineId: secondaryLineId as CalculatorInputs["cruiseLineId"],
      drinkPackage: compDrinkTier,
      wifiPackage: compWifiTier,
    };

    return calculateCosts(compInputs, comparisonCosts);
  }, [calculatorInputs, secondaryLineId, comparisonCosts, drinkPackageOn, drinkTier, wifiOn, wifiTier]);

  /* -- Navigation -------------------------------------------------- */
  /* Allow proceeding if at least 1 line is selected AND either:
     - User entered a base fare, OR
     - We have a fare estimate for their selection (discovery mode) */
  const canProceedStep1 =
    selectedLines.length >= 1 && (parseFloat(baseFare) > 0 || fareEstimate !== null);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="mx-auto max-w-4xl">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait" custom={direction}>
        {/* -------------------------------------------------------- */}
        {/*  STEP 1 — Trip Basics                                     */}
        {/* -------------------------------------------------------- */}
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Cruise Line */}
            <div className="mb-8">
              <h2 className="mb-1 text-lg font-bold text-navy">
                Select your cruise line
              </h2>
              <CruiseLineSelector
                selected={selectedLines}
                onSelect={handleCruiseLineChange}
              />
            </div>

            {/* Duration */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-navy">
                Cruise duration
              </h2>
              <div className="flex flex-wrap gap-2">
                {DURATION_RANGES.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => handleDurationChange(range.default)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                      duration === range.default
                        ? "bg-teal text-white"
                        : "border border-gray-200 bg-white text-navy hover:bg-gray-50"
                    )}
                  >
                    {range.label} nights
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Month */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-navy">
                Travel month
              </h2>
              <div className="flex flex-wrap gap-2">
                {MONTH_LABELS.map((label, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMonth(month === idx ? undefined : idx)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      month === idx
                        ? "bg-teal text-white"
                        : "border border-gray-200 bg-white text-navy hover:bg-gray-50"
                    )}
                  >
                    {label.slice(0, 3)}
                  </button>
                ))}
              </div>
              {seasonalInfo && (
                <div className="mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
                      seasonalInfo.multiplier > 1.15
                        ? "bg-coral/10 text-coral"
                        : seasonalInfo.multiplier < 0.95
                          ? "bg-teal/10 text-teal"
                          : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {seasonalInfo.label}
                    {seasonalInfo.multiplier !== 1.0 && (
                      <span>
                        {" — "}
                        {seasonalInfo.multiplier > 1
                          ? `prices typically ${Math.round((seasonalInfo.multiplier - 1) * 100)}% higher`
                          : `prices typically ${Math.round((1 - seasonalInfo.multiplier) * 100)}% lower`}
                      </span>
                    )}
                  </span>
                  {seasonalInfo.description && (
                    <p className="mt-1 text-xs text-gray-400">
                      {seasonalInfo.description}
                    </p>
                  )}
                </div>
              )}
              {month === undefined && (
                <p className="mt-1 text-xs text-gray-400">
                  Select a month to see seasonal price adjustments
                </p>
              )}
            </div>

            {/* Guests */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-3 text-lg font-bold text-navy">Guests</h2>
                <div className="flex flex-col gap-3">
                  <NumberStepper
                    label="Adults"
                    value={adults}
                    onChange={setAdults}
                    min={1}
                    max={8}
                  />
                  {!showChildren && (
                    <button
                      type="button"
                      onClick={() => setShowChildren(true)}
                      className="self-start text-sm font-medium text-teal hover:text-teal-dark transition-colors"
                    >
                      + Add children
                    </button>
                  )}
                  {showChildren && (
                    <div>
                      <p className="mb-1 text-xs text-gray-400">Children (under 18)</p>
                      <NumberStepper
                        label="Children"
                        value={children}
                        onChange={setChildren}
                        min={0}
                        max={6}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Cabin Type */}
              <div>
                <h2 className="mb-3 text-lg font-bold text-navy">
                  Cabin type
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {CABIN_TYPES.map((ct) => (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => setCabinType(ct.value)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                        cabinType === ct.value
                          ? "bg-teal text-white"
                          : "border border-gray-200 bg-white text-navy hover:bg-gray-50"
                      )}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Base Fare */}
            <div className="mb-8">
              <h2 className="mb-1 text-lg font-bold text-navy">
                Advertised cruise price
              </h2>
              <p className="mb-3 text-sm text-gray-500">
                Enter your price, or use our estimate based on current market rates
              </p>
              <div className="relative max-w-xs">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-price text-sm font-semibold text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={
                    fareEstimate
                      ? `Estimated: ${fareEstimate.mid.toLocaleString()}`
                      : "e.g. 2,499"
                  }
                  value={baseFare}
                  onChange={(e) => setBaseFare(e.target.value)}
                  className={cn(
                    "flex h-10 w-full rounded-lg border bg-white py-2 pl-7 pr-3",
                    "font-price text-sm text-navy placeholder:text-gray-400",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1",
                    "border-gray-200 hover:border-gray-300"
                  )}
                />
              </div>
              {fareEstimate && !baseFare && (
                <div className="mt-2 max-w-xs rounded-lg bg-teal/5 border border-teal/20 px-3 py-2">
                  <p className="text-xs text-teal font-medium">
                    Estimated per-person fare: <span className="font-price">${fareEstimate.low.toLocaleString()}</span> – <span className="font-price">${fareEstimate.high.toLocaleString()}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Using <span className="font-price font-semibold">${fareEstimate.mid.toLocaleString()}</span> as estimate. Enter your actual price for exact results.
                  </p>
                </div>
              )}
              {baseFare && fareEstimate && (
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Typical range: <span className="font-price">${fareEstimate.low.toLocaleString()}</span> – <span className="font-price">${fareEstimate.high.toLocaleString()}</span> per person
                </p>
              )}
            </div>

            {/* Next */}
            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!canProceedStep1}
                onClick={goNext}
              >
                Next: Add-Ons
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* -------------------------------------------------------- */}
        {/*  STEP 2 — Add-Ons                                         */}
        {/* -------------------------------------------------------- */}
        {step === 2 && costs && (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
              {/* Left: add-on cards */}
              <div className="space-y-4">
                {/* Drink Package */}
                {costs.drinkPackages.tiers.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-navy flex items-center gap-1">
                            Drink Package
                            <InfoTip text="Unlimited alcoholic and non-alcoholic beverages. Most lines require all adults in the cabin to purchase." />
                          </p>
                          {drinkPackageOn && drinkImpact > 0 && (
                            <p className="font-price text-xs font-medium text-teal">
                              +${Math.round(drinkImpact).toLocaleString()}
                            </p>
                          )}
                          {costs.drinkPackages.includedFree && (
                            <p className="text-xs text-gray-400">
                              Basic package may be included free
                            </p>
                          )}
                        </div>
                        <Switch
                          checked={drinkPackageOn}
                          onCheckedChange={handleDrinkToggle}
                        />
                      </div>
                      {drinkPackageOn && (
                        <div className="mt-3">
                          <Select
                            value={drinkTier}
                            onValueChange={setDrinkTier}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select drink package" />
                            </SelectTrigger>
                            <SelectContent>
                              {costs.drinkPackages.tiers.map((t) => (
                                <SelectItem key={t.name} value={t.name}>
                                  {t.name} &mdash;{" "}
                                  <span className="font-price">
                                    ${t.pricePerDay.toFixed(0)}/day
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* WiFi */}
                {costs.wifiPackages.tiers.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-navy flex items-center gap-1">
                            WiFi
                            <InfoTip text="Internet access at sea. Ranges from basic social media to full streaming." />
                          </p>
                          {wifiOn && wifiImpact > 0 && (
                            <p className="font-price text-xs font-medium text-teal">
                              +${Math.round(wifiImpact).toLocaleString()}
                            </p>
                          )}
                          {costs.wifiPackages.includedFree && (
                            <p className="text-xs text-gray-400">
                              Basic WiFi may be included free
                            </p>
                          )}
                        </div>
                        <Switch
                          checked={wifiOn}
                          onCheckedChange={handleWifiToggle}
                        />
                      </div>
                      {wifiOn && (
                        <div className="mt-3">
                          <Select value={wifiTier} onValueChange={setWifiTier}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select WiFi package" />
                            </SelectTrigger>
                            <SelectContent>
                              {costs.wifiPackages.tiers.map((t) => (
                                <SelectItem key={t.name} value={t.name}>
                                  {t.name} &mdash;{" "}
                                  <span className="font-price">
                                    ${t.pricePerDay.toFixed(0)}/day
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Specialty Dining */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy flex items-center gap-1">
                          Specialty Dining Meals
                          <InfoTip text="Upcharge restaurants beyond the free main dining room and buffet." />
                        </p>
                        {diningImpact > 0 && (
                          <p className="font-price text-xs font-medium text-teal">
                            +${Math.round(diningImpact).toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Avg ${costs.specialtyDining.averagePerMeal}/meal per
                          person
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-navy">
                        {specialtyMeals}
                      </span>
                    </div>
                    <div className="mt-3">
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                        value={[specialtyMeals]}
                        onValueChange={([v]) => setSpecialtyMeals(v)}
                        formatValue={(v) => `${v} meals`}
                      />
                      <div className="mt-1 flex justify-between text-xs text-gray-400">
                        <span>0</span>
                        <span>5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Excursion Budget */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy flex items-center gap-1">
                          Excursion Budget Per Port
                          <InfoTip text="Amount you plan to spend on activities at each port of call." />
                        </p>
                        {excursionImpact > 0 && (
                          <p className="font-price text-xs font-medium text-teal">
                            +${Math.round(excursionImpact).toLocaleString()}{" "}
                            total
                          </p>
                        )}
                      </div>
                      <span className="font-price text-sm font-semibold text-navy">
                        ${excursionBudget}/person
                      </span>
                    </div>
                    <div className="mt-3">
                      <Slider
                        min={0}
                        max={250}
                        step={25}
                        value={[excursionBudget]}
                        onValueChange={([v]) => setExcursionBudget(v)}
                        formatValue={(v) => `$${v}`}
                      />
                      <div className="mt-1 flex justify-between text-xs text-gray-400">
                        <span>$0</span>
                        <span>$250</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <NumberStepper
                        label="Ports"
                        value={numPorts}
                        onChange={setNumPorts}
                        min={0}
                        max={duration}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Insurance */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy flex items-center gap-1">
                          Travel Insurance
                          <InfoTip text="Cancellation and medical coverage. Typically 5-10% of cruise fare." />
                        </p>
                        {insuranceOn && insuranceImpact > 0 && (
                          <p className="font-price text-xs font-medium text-teal">
                            +${Math.round(insuranceImpact).toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          ~{costs.travelInsurancePercent}% of base fare
                        </p>
                      </div>
                      <Switch
                        checked={insuranceOn}
                        onCheckedChange={setInsuranceOn}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Parking */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy flex items-center gap-1">
                          Port Parking
                          <InfoTip text="Parking at the cruise port if you're driving to the terminal." />
                        </p>
                        {parkingOn && parkingImpact > 0 && (
                          <p className="font-price text-xs font-medium text-teal">
                            +${Math.round(parkingImpact).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Switch
                        checked={parkingOn}
                        onCheckedChange={setParkingOn}
                      />
                    </div>
                    {parkingOn && (
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                        <NumberStepper
                          label="Days"
                          value={parkingDays}
                          onChange={setParkingDays}
                          min={1}
                          max={30}
                        />
                        <div className="relative max-w-[140px]">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-price text-sm font-semibold text-gray-400">
                            $
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="$/day"
                            value={parkingCost}
                            onChange={(e) => setParkingCost(e.target.value)}
                            className={cn(
                              "flex h-10 w-full rounded-lg border bg-white py-2 pl-7 pr-3",
                              "font-price text-sm text-navy placeholder:text-gray-400",
                              "transition-colors duration-150",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1",
                              "border-gray-200 hover:border-gray-300"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: running total sidebar (desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <Card>
                    <CardContent className="p-6">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                        Estimated Total
                      </p>
                      <p className="font-price text-3xl font-bold text-navy">
                        <AnimatedCounter
                          value={runningTotal}
                          duration={0.6}
                        />
                      </p>
                      {(adults + children) > 1 && (
                        <p className="font-price text-sm text-gray-500 mt-1">
                          ${Math.round(runningTotal / (adults + children)).toLocaleString()} per person
                        </p>
                      )}
                      <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Base fare</span>
                          <span className="font-price font-medium">
                            ${(effectiveBaseFare).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Add-ons & fees</span>
                          <span className="font-price font-medium text-teal">
                            +$
                            {Math.round(
                              runningTotal - (effectiveBaseFare)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Mobile running total sticky bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-sm lg:hidden">
              <div className="mx-auto flex max-w-4xl items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Estimated total</p>
                  <p className="font-price text-lg font-bold text-navy">
                    ${Math.round(runningTotal).toLocaleString()}
                  </p>
                  {(adults + children) > 1 && (
                    <p className="font-price text-[11px] text-gray-400">
                      ${Math.round(runningTotal / (adults + children)).toLocaleString()}/person
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button size="sm" onClick={goNext}>
                    Results
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="mt-8 hidden items-center justify-between lg:flex">
              <Button variant="outline" size="lg" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button size="lg" onClick={goNext}>
                See Results
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="h-20 lg:hidden" />
          </motion.div>
        )}

        {/* -------------------------------------------------------- */}
        {/*  STEP 3 — Results                                         */}
        {/* -------------------------------------------------------- */}
        {step === 3 && breakdown && calculatorInputs && (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CostBreakdown
              breakdown={breakdown}
              cruiseLineId={primaryLineId!}
              inputs={calculatorInputs}
              comparisonBreakdown={comparisonBreakdown ?? undefined}
              comparisonCruiseLineId={secondaryLineId ?? undefined}
              onCompare={() => {
                setDirection(-1);
                setStep(1);
              }}
              onRemoveDrinkPackage={() => {
                setDrinkPackageOn(false);
                setDrinkTier("");
              }}
              onRemoveWifi={() => {
                setWifiOn(false);
                setWifiTier("");
              }}
              onRemoveSpecialtyDining={() => setSpecialtyMeals(0)}
              onRemoveExcursions={() => setExcursionBudget(0)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
