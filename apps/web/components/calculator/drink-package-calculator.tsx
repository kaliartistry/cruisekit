"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Info,
  Minus,
  Plus,
  Save,
  Share2,
  WalletCards,
} from "lucide-react";
import {
  BAR_TAB_TIERS,
  DRINK_CATEGORIES,
  DRINK_PRESETS,
  drinkPackageData,
  getDefaultDrinkPrices,
  getDrinkPackageLines,
  getPackageKey,
  getPackagesForLine,
  packageTypeLabel,
  type DrinkCategoryKey,
  type DrinkPackage,
} from "@/lib/data/drink-package-calculator";
import { trackEvent } from "@/lib/analytics";
import {
  calculateDrinkPackage,
  calculatePrepaidCredit,
  safeDrinkCalculatorAnalytics,
} from "@/lib/drink-package-math";
import { cn } from "@/lib/utils/cn";

type BundleMode = "drinksOnly" | "includePerks";
type BuyerRuleType = "allAdults" | "guestsOneTwo" | "userSelected" | "optional";

type Warning = {
  title: string;
  text: string;
};

type StandardResult = {
  kind: "standard";
  resultType: "save" | "borderline" | "paygo";
  label: string;
  headline: string;
  detail: string;
  packageDailyPerPerson: number;
  cabinPackageDaily: number;
  breakEvenDaily: number;
  paygoDailyWithService: number;
  dailyDifference: number;
  tripDifference: number;
  buyers: number;
  adultBuyers: number;
  minorBuyers: number;
  minorPackageTripCost: number;
  nights: number;
  packageDays: number;
  bundleMode: BundleMode;
  bundleValue: number;
  warnings: Warning[];
};

type PrepaidResult = {
  kind: "prepaid";
  resultType: "covered" | "shortfall";
  label: string;
  headline: string;
  availableCredit: number;
  expectedSpend: number;
  paygoDailyWithService: number;
  surplus: number;
  nights: number;
  warnings: Warning[];
};

type BlockedResult = {
  kind: "blocked";
  resultType: "blocked";
  label: string;
  headline: string;
  detail: string;
  warnings: Warning[];
};

type CalculatorResult = StandardResult | PrepaidResult | BlockedResult;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const initialDrinkQuantities = Object.fromEntries(
  DRINK_CATEGORIES.map((drink) => [drink.key, 0])
) as Record<DrinkCategoryKey, number>;

function numberOr(value: string | number, fallback = 0) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function safeRate(rate: number | null | undefined) {
  return Number.isFinite(Number(rate)) ? Number(rate) : 0;
}

function rateToPercent(rate: number | null | undefined) {
  return Math.round(safeRate(rate) * 1000) / 10;
}

function buyerRuleType(pkg: DrinkPackage): BuyerRuleType {
  const rule = pkg.required_adult_buyers_rule.toLowerCase();

  if (pkg.package_type === "prepaid_credit") return "optional";
  if (
    rule.includes("guests 1 and 2") ||
    rule.includes("guest 1") ||
    rule.includes("eligible guests 1 and 2")
  ) {
    return "guestsOneTwo";
  }
  if (
    rule.includes("all adults") ||
    rule.includes("all legal") ||
    rule.includes("all guests in the same cabin") ||
    rule.includes("all guests in the same stateroom") ||
    rule.includes("applies to all guests")
  ) {
    return "allAdults";
  }

  return "userSelected";
}

function getRequiredBuyers(
  pkg: DrinkPackage,
  adultsInCabin: number,
  buyers: number,
  manualBuyers: string
) {
  const manual = numberOr(manualBuyers, Number.NaN);
  if (Number.isFinite(manual) && manual > 0) return manual;

  const rule = buyerRuleType(pkg);
  if (pkg.package_type === "prepaid_credit") return 1;
  if (rule === "allAdults") return adultsInCabin;
  if (rule === "guestsOneTwo") return Math.min(adultsInCabin, 2);
  return buyers;
}

function getResultLabel(diff: number) {
  if (diff > 10) return "Package may save money";
  if (diff < -10) return "Pay-as-you-go may be cheaper";
  return "Borderline value";
}

function getResultType(diff: number): StandardResult["resultType"] {
  if (diff > 10) return "save";
  if (diff < -10) return "paygo";
  return "borderline";
}

function headlineForDifference(diff: number) {
  if (diff > 10) return `${currency.format(Math.abs(diff))}/day estimated savings`;
  if (diff < -10) {
    return `${currency.format(Math.abs(diff))}/day cheaper pay-as-you-go`;
  }
  return "Close call";
}

function isOlderThan90Days(dateString?: string) {
  if (!dateString) return false;
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const diffDays =
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 90;
}

function buildDrinkTotals(
  quantities: Record<DrinkCategoryKey, number>,
  prices: Record<DrinkCategoryKey, number>
  ) {
  let subtotal = 0;
  let alcoholicQty = 0;
  let totalQty = 0;

  for (const drink of DRINK_CATEGORIES) {
    const qty = numberOr(quantities[drink.key], 0);
    const price = numberOr(prices[drink.key], 0);
    subtotal += qty * price;
    totalQty += qty;
    if (drink.type === "alcoholic") alcoholicQty += qty;
  }

  return { subtotal, alcoholicQty, totalQty };
}

function packagePriceLabel(pkg: DrinkPackage) {
  if (pkg.package_type === "prepaid_credit") {
    return "Prepaid Bar Tab credit";
  }

  if (pkg.default_price == null) {
    return "User-entered price required";
  }

  return `${currency.format(pkg.default_price)} / person / day`;
}

function getSourceLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Official source";
  }
}

function resultToneClass(result: CalculatorResult) {
  if (result.kind === "blocked") return "border-amber-200 bg-amber-50";
  if (result.kind === "prepaid") {
    return result.resultType === "covered"
      ? "border-success/25 bg-success-light/60"
      : "border-coral/25 bg-coral/10";
  }

  if (result.resultType === "save") return "border-success/25 bg-success-light/60";
  if (result.resultType === "paygo") return "border-coral/25 bg-coral/10";
  return "border-warning/30 bg-warning-light/70";
}

export default function DrinkPackageCalculator() {
  const lines = useMemo(() => getDrinkPackageLines(), []);
  const initialLine =
    lines.find((line) => /Carnival/i.test(line)) ?? lines[0] ?? "";
  const [selectedLine, setSelectedLine] = useState(initialLine);
  const linePackages = useMemo(
    () => getPackagesForLine(selectedLine),
    [selectedLine]
  );
  const packageByKey = useMemo(
    () =>
      new Map(
        drinkPackageData.packages.map((pkg) => [getPackageKey(pkg), pkg])
      ),
    []
  );
  const initialPackage =
    linePackages.find((pkg) => pkg.package_name === "CHEERS!") ??
    linePackages[0] ??
    drinkPackageData.packages[0];
  const [selectedPackageKey, setSelectedPackageKey] = useState(
    getPackageKey(initialPackage)
  );
  const selectedPackage =
    packageByKey.get(selectedPackageKey) ??
    linePackages[0] ??
    drinkPackageData.packages[0];
  const selectedBuyerRule = buyerRuleType(selectedPackage);
  const selectedPackageRequiresPrice =
    selectedPackage.user_price_override === "Yes" ||
    selectedPackage.default_price == null;

  const [packagePrices, setPackagePrices] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        drinkPackageData.packages.map((pkg) => [
          getPackageKey(pkg),
          pkg.default_price == null ? "" : String(pkg.default_price),
        ])
      )
  );
  const [minorPackagePrices, setMinorPackagePrices] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      drinkPackageData.packages.map((pkg) => [
        getPackageKey(pkg),
        pkg.minor_package_default_price == null
          ? ""
          : String(pkg.minor_package_default_price),
      ])
    )
  );
  const [nights, setNights] = useState(7);
  const [packageDays, setPackageDays] = useState(7);
  const [adultsInCabin, setAdultsInCabin] = useState(2);
  const [buyers, setBuyers] = useState(1);
  const [minorPackageBuyers, setMinorPackageBuyers] = useState(0);
  const [manualBuyers, setManualBuyers] = useState("");
  const [drinkQuantities, setDrinkQuantities] = useState(initialDrinkQuantities);
  const [drinkPrices, setDrinkPrices] = useState(getDefaultDrinkPrices);
  const [bundleMode, setBundleMode] = useState<BundleMode>("drinksOnly");
  const [bundleValues, setBundleValues] = useState({
    wifi: 0,
    crew: 0,
    dining: 0,
    excursion: 0,
    other: 0,
  });
  const [packageChargePercent, setPackageChargePercent] = useState(
    rateToPercent(selectedPackage.package_service_charge_rate)
  );
  const [paygoChargePercent, setPaygoChargePercent] = useState(
    rateToPercent(selectedPackage.a_la_carte_service_charge_rate)
  );
  const [barTabTierIndex, setBarTabTierIndex] = useState(0);
  const [barTabCredit, setBarTabCredit] = useState(BAR_TAB_TIERS[0].credit);
  const [saveMessage, setSaveMessage] = useState("");
  const startedRef = useRef(false);
  const lastResultEventRef = useRef("");

  useEffect(() => {
    trackEvent("drink_calculator_view");
  }, []);

  const resetPackageAssumptions = (pkg: DrinkPackage) => {
    setPackageChargePercent(
      rateToPercent(pkg.package_service_charge_rate)
    );
    setPaygoChargePercent(
      rateToPercent(pkg.a_la_carte_service_charge_rate)
    );
    setManualBuyers("");
    setMinorPackageBuyers(0);
    setBundleMode("drinksOnly");
    setSaveMessage("");
  };

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("drink_calculator_start");
  };

  const baseRequiredBuyers = getRequiredBuyers(
    selectedPackage,
    adultsInCabin,
    buyers,
    manualBuyers
  );
  const requiredBuyers =
    selectedBuyerRule === "guestsOneTwo" && selectedPackage.minor_package_name
      ? Math.min(baseRequiredBuyers, Math.max(0, 2 - minorPackageBuyers))
      : baseRequiredBuyers;
  const drinkTotals = buildDrinkTotals(drinkQuantities, drinkPrices);
  const packagePrice = numberOr(packagePrices[selectedPackageKey], Number.NaN);
  const minorPackagePrice = numberOr(
    minorPackagePrices[selectedPackageKey],
    Number.NaN
  );
  const minorPackagePriceMissing =
    minorPackageBuyers > 0 &&
    selectedPackage.minor_package_user_price_override === "Yes" &&
    (!Number.isFinite(minorPackagePrice) || minorPackagePrice <= 0);
  const packageChargeRate = packageChargePercent / 100;
  const paygoChargeRate = paygoChargePercent / 100;
  const paygoDailyWithService = drinkTotals.subtotal * (1 + paygoChargeRate);
  const bundleValue =
    bundleMode === "includePerks"
      ? Object.values(bundleValues).reduce((sum, value) => sum + value, 0)
      : 0;

  const warnings = useMemo(() => {
    const nextWarnings: Warning[] = [];

    if (selectedPackage.calculator_warning) {
      nextWarnings.push({
        title: "Package note",
        text: selectedPackage.calculator_warning,
      });
    }

    if (packageDays < nights) {
      nextWarnings.push({
        title: "Partial sailing coverage",
        text: `The package cost is applied to ${packageDays} of ${nights} nights. Pay-as-you-go beverage value is still estimated across the full sailing.`,
      });
    }

    if (minorPackageBuyers > 0 && selectedPackage.minor_package_rule) {
      nextWarnings.push({
        title: selectedPackage.minor_package_name ?? "Younger guest package",
        text: selectedPackage.minor_package_rule,
      });
    }

    if (selectedPackage.alcoholic_daily_limit != null) {
      const allowed =
        Number(selectedPackage.alcoholic_daily_limit) *
        Math.max(1, requiredBuyers);
      if (drinkTotals.alcoholicQty > allowed) {
        nextWarnings.push({
          title: "Daily alcohol limit",
          text: `Your planned alcoholic items total ${drinkTotals.alcoholicQty} per day, which is above the package limit estimate of ${allowed} for ${requiredBuyers} buyer${requiredBuyers === 1 ? "" : "s"}.`,
        });
      }
    }

    if (
      selectedPackage.non_alcoholic_daily_limit != null &&
      selectedPackage.non_alcoholic_daily_limit ===
        selectedPackage.alcoholic_daily_limit
    ) {
      const allowed =
        Number(selectedPackage.non_alcoholic_daily_limit) *
        Math.max(1, requiredBuyers);
      if (drinkTotals.totalQty > allowed) {
        nextWarnings.push({
          title: "Total daily item limit",
          text: `This package may count alcoholic and non-alcoholic items toward the daily limit. Your planned total is ${drinkTotals.totalQty}; the estimated limit is ${allowed} for ${requiredBuyers} buyer${requiredBuyers === 1 ? "" : "s"}.`,
        });
      }
    }

    if (selectedPackage.per_drink_price_cap != null) {
      const overCap = DRINK_CATEGORIES.filter(
        (drink) =>
          numberOr(drinkPrices[drink.key], 0) >
          Number(selectedPackage.per_drink_price_cap)
      ).map((drink) => drink.shortLabel);

      if (overCap.length) {
        nextWarnings.push({
          title: "Per-drink price cap",
          text: `${overCap.join(", ")} uses an estimated price above this package's ${currency.format(selectedPackage.per_drink_price_cap)} cap. The calculator still counts the full value, but the actual package may not cover the full menu price.`,
        });
      }
    }

    if (
      selectedPackage.private_destination_rules &&
      !/No private-island rule stated/i.test(
        selectedPackage.private_destination_rules
      )
    ) {
      nextWarnings.push({
        title: "Destination rule",
        text: selectedPackage.private_destination_rules,
      });
    }

    if (
      selectedPackage.package_type === "bundle_package" &&
      bundleMode === "includePerks"
    ) {
      nextWarnings.push({
        title: "Bundle assumption",
        text: "This is a bundled fare, so non-drink perks can change the result. Leave perk values at $0 for a drinks-only comparison.",
      });
    }

    if (selectedPackage.package_type === "prepaid_credit") {
      nextWarnings.push({
        title: "Unused credit",
        text: "Virgin Bar Tab is prepaid drink credit, not an unlimited package. Unused credit may be forfeited.",
      });
    }

    if (
      isOlderThan90Days(
        selectedPackage.last_verified ?? drinkPackageData.metadata.last_verified
      )
    ) {
      nextWarnings.push({
        title: "Verify before booking",
        text: "This package was last verified more than 90 days ago. Check your cruise line or booking portal before relying on the price.",
      });
    }

    return nextWarnings;
  }, [
    bundleMode,
    drinkPrices,
    drinkTotals.alcoholicQty,
    drinkTotals.totalQty,
    minorPackageBuyers,
    nights,
    packageDays,
    requiredBuyers,
    selectedPackage,
  ]);

  const result: CalculatorResult = useMemo(() => {
    if (selectedPackage.package_type === "prepaid_credit") {
      const { expectedSpend, surplus } = calculatePrepaidCredit({
        availableCredit: barTabCredit,
        cruiseNights: nights,
        paygoDailySubtotal: drinkTotals.subtotal,
        paygoServiceChargeRate: paygoChargeRate,
      });
      return {
        kind: "prepaid",
        resultType: surplus >= 0 ? "covered" : "shortfall",
        label:
          surplus >= 0
            ? "Credit may cover planned purchases"
            : "Expected spend may exceed credit",
        headline:
          surplus >= 0
            ? `${currency.format(surplus)} estimated credit cushion`
            : `${currency.format(Math.abs(surplus))} estimated shortfall`,
        availableCredit: barTabCredit,
        expectedSpend,
        paygoDailyWithService,
        surplus,
        nights,
        warnings,
      };
    }

    if (
      (selectedPackageRequiresPrice &&
        (!Number.isFinite(packagePrice) || packagePrice <= 0)) ||
      minorPackagePriceMissing
    ) {
      return {
        kind: "blocked",
        resultType: "blocked",
        label: "Price needed",
        headline: minorPackagePriceMissing
          ? `Enter the ${selectedPackage.minor_package_name} price`
          : "Enter your actual package price",
        detail: minorPackagePriceMissing
          ? `${selectedPackage.cruise_line} does not publish a stable ${selectedPackage.minor_package_name} price. Add the daily price from your booking portal to include younger guests accurately.`
          : `${selectedPackage.cruise_line} pricing for ${selectedPackage.package_name} is not stable enough to hardcode. Add the price from your booking portal to calculate a useful estimate.`,
        warnings,
      };
    }

    const validPackagePrice = Number.isFinite(packagePrice)
      ? packagePrice
      : selectedPackage.default_price ?? 0;
    const calculation = calculateDrinkPackage({
      cruiseNights: nights,
      packageDays,
      packagePricePerPerson: validPackagePrice,
      packageServiceChargeRate: packageChargeRate,
      packageBuyers: requiredBuyers,
      minorPackagePricePerPerson: Number.isFinite(minorPackagePrice)
        ? minorPackagePrice
        : selectedPackage.minor_package_default_price ?? 0,
      minorPackageServiceChargeRate: safeRate(
        selectedPackage.minor_package_service_charge_rate,
      ),
      minorPackageBuyers,
      paygoDailySubtotal: drinkTotals.subtotal,
      paygoServiceChargeRate: paygoChargeRate,
      bundleValuePerCoveredDay:
        selectedPackage.package_type === "bundle_package" ? bundleValue : 0,
    });
    const packageDailyPerPerson = calculation.packageDailyPerAdult;
    const cabinPackageDaily = calculation.cabinPackageTripCost / packageDays;
    const breakEvenDaily = calculation.breakEvenDaily;
    const dailyDifference = calculation.dailyDifference;
    const tripDifference = calculation.tripDifference;
    const detail =
      dailyDifference > 10
        ? `This package may save about ${currency.format(Math.abs(dailyDifference))}/day based on your estimate.`
        : dailyDifference < -10
          ? `Pay-as-you-go may be cheaper by about ${currency.format(Math.abs(dailyDifference))}/day based on your plan.`
          : "This is close enough that pricing changes, itinerary, or actual menu choices could swing the result either way.";
    const totalPackageBuyers = requiredBuyers + minorPackageBuyers;
    const breakEvenCopy =
      totalPackageBuyers > 1
        ? `With ${totalPackageBuyers} package buyers, your cabin would need about ${currency.format(breakEvenDaily)}/day in included drink value to break even.`
        : `You would need about ${currency.format(breakEvenDaily)}/day in included drink value to break even.`;

    return {
      kind: "standard",
      resultType: getResultType(dailyDifference),
      label: getResultLabel(dailyDifference),
      headline: headlineForDifference(dailyDifference),
      detail: `${detail} ${breakEvenCopy}`,
      packageDailyPerPerson,
      cabinPackageDaily,
      breakEvenDaily,
      paygoDailyWithService,
      dailyDifference,
      tripDifference,
      buyers: requiredBuyers + minorPackageBuyers,
      adultBuyers: requiredBuyers,
      minorBuyers: minorPackageBuyers,
      minorPackageTripCost: calculation.minorPackageTripCost,
      nights,
      packageDays,
      bundleMode,
      bundleValue,
      warnings,
    };
  }, [
    barTabCredit,
    bundleMode,
    bundleValue,
    drinkTotals.subtotal,
    minorPackageBuyers,
    minorPackagePrice,
    minorPackagePriceMissing,
    nights,
    packageDays,
    packageChargeRate,
    packagePrice,
    paygoChargeRate,
    paygoDailyWithService,
    requiredBuyers,
    selectedPackage,
    selectedPackageRequiresPrice,
    warnings,
  ]);

  useEffect(() => {
    if (!startedRef.current) return;

    const resultKey = [
      selectedPackage.cruise_line,
      selectedPackage.package_name,
      result.resultType,
      result.kind === "standard"
        ? Math.round(result.dailyDifference)
        : result.kind === "prepaid"
          ? Math.round(result.surplus)
          : "blocked",
    ].join("|");

    if (lastResultEventRef.current === resultKey) return;
    lastResultEventRef.current = resultKey;

    trackEvent(
      "result_viewed",
      safeDrinkCalculatorAnalytics({
        cruiseLine: selectedPackage.cruise_line,
        partySize: adultsInCabin + minorPackageBuyers,
        nights,
        resultType: result.resultType,
        difference:
          result.kind === "standard"
            ? result.dailyDifference
            : result.kind === "prepaid"
              ? result.surplus / Math.max(1, nights)
              : undefined,
        completion: result.kind !== "blocked",
      }),
    );
  }, [
    adultsInCabin,
    minorPackageBuyers,
    nights,
    result,
    selectedPackage,
  ]);

  const updateLine = (line: string) => {
    markStarted();
    setSelectedLine(line);
    const nextPackage = getPackagesForLine(line)[0];
    if (nextPackage) {
      setSelectedPackageKey(getPackageKey(nextPackage));
      resetPackageAssumptions(nextPackage);
    }
    trackEvent(
      "cruise_line_selected",
      safeDrinkCalculatorAnalytics({
        cruiseLine: line,
        partySize: adultsInCabin + minorPackageBuyers,
        nights,
        completion: false,
      }),
    );
  };

  const updatePackage = (packageKey: string) => {
    markStarted();
    setSelectedPackageKey(packageKey);
    const pkg = packageByKey.get(packageKey);
    if (pkg) resetPackageAssumptions(pkg);
    if (pkg) {
      trackEvent(
        "package_selected",
        safeDrinkCalculatorAnalytics({
          cruiseLine: pkg.cruise_line,
          partySize: adultsInCabin,
          nights,
          completion: false,
        }),
      );
    }
  };

  const updatePackagePrice = (value: string) => {
    markStarted();
    setPackagePrices((current) => ({
      ...current,
      [selectedPackageKey]: value,
    }));

    if (selectedPackageRequiresPrice && Number.parseFloat(value) > 0) {
      trackEvent(
        "dynamic_price_entered",
        safeDrinkCalculatorAnalytics({
          cruiseLine: selectedPackage.cruise_line,
          partySize: adultsInCabin + minorPackageBuyers,
          nights,
          completion: false,
        }),
      );
    }
  };

  const applyPreset = (presetKey: string) => {
    markStarted();
    const preset = DRINK_PRESETS[presetKey] ?? DRINK_PRESETS.reset;
    setDrinkQuantities(preset.quantities);
    trackEvent(
      "preset_selected",
      safeDrinkCalculatorAnalytics({
        cruiseLine: selectedPackage.cruise_line,
        partySize: adultsInCabin + minorPackageBuyers,
        nights,
        completion: false,
      }),
    );
  };

  const updateQuantity = (key: DrinkCategoryKey, nextValue: number) => {
    markStarted();
    setDrinkQuantities((current) => ({
      ...current,
      [key]: clampNumber(Math.round(nextValue), 0, 99),
    }));
  };

  const updateDrinkPrice = (key: DrinkCategoryKey, nextValue: number) => {
    markStarted();
    setDrinkPrices((current) => ({
      ...current,
      [key]: Math.max(0, nextValue),
    }));
  };

  const updateBundleMode = (mode: BundleMode) => {
    markStarted();
    setBundleMode(mode);
    trackEvent(
      "package_selected",
      safeDrinkCalculatorAnalytics({
        cruiseLine: selectedPackage.cruise_line,
        partySize: adultsInCabin + minorPackageBuyers,
        nights,
        completion: false,
      }),
    );
  };

  const saveEstimate = async () => {
    markStarted();
    const savingsOrLoss =
      result.kind === "standard"
        ? result.dailyDifference
        : result.kind === "prepaid"
          ? result.surplus
          : undefined;
    const summary = [
      "CruiseKit Drink Package Calculator",
      `${selectedPackage.cruise_line} - ${selectedPackage.package_name}`,
      `${result.label}: ${result.headline}`,
    ].join("\n");

    try {
      window.localStorage.setItem(
        "cruisekit-drink-package-estimate",
        JSON.stringify({
          savedAt: new Date().toISOString(),
          cruiseLine: selectedPackage.cruise_line,
          packageName: selectedPackage.package_name,
          packageType: selectedPackage.package_type,
          resultType: result.resultType,
          savingsOrLoss,
          nights,
          packageDays,
          adultsInCabin,
          minorPackageBuyers,
          drinkQuantities,
          drinkPrices,
        })
      );
      setSaveMessage("Estimate saved locally.");

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(summary);
          setSaveMessage("Estimate saved locally and copied.");
        } catch {
          setSaveMessage("Estimate saved locally.");
        }
      }
    } catch {
      setSaveMessage("Estimate could not be saved in this browser.");
    }

    trackEvent(
      "save_estimate_clicked",
      safeDrinkCalculatorAnalytics({
        cruiseLine: selectedPackage.cruise_line,
        partySize: adultsInCabin + minorPackageBuyers,
        nights,
        resultType: result.resultType,
        difference: savingsOrLoss,
        completion: result.kind !== "blocked",
      }),
    );
  };

  const shareEstimate = async () => {
    markStarted();
    const savingsOrLoss =
      result.kind === "standard"
        ? result.dailyDifference
        : result.kind === "prepaid"
          ? result.surplus / Math.max(1, nights)
          : undefined;
    const summary = [
      "CruiseKit Drink Package Calculator",
      `${selectedPackage.cruise_line} - ${selectedPackage.package_name}`,
      `${result.label}: ${result.headline}`,
      window.location.href,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "CruiseKit Drink Package Calculator",
          text: summary,
        });
        setSaveMessage("Result shared.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        setSaveMessage("Share text copied.");
      } else {
        setSaveMessage("Sharing is not supported in this browser.");
        return;
      }

      trackEvent(
        "result_shared",
        safeDrinkCalculatorAnalytics({
          cruiseLine: selectedPackage.cruise_line,
          partySize: adultsInCabin + minorPackageBuyers,
          nights,
          resultType: result.resultType,
          difference: savingsOrLoss,
          completion: result.kind !== "blocked",
        }),
      );
    } catch (error) {
      setSaveMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "Share canceled."
          : "Result could not be shared in this browser.",
      );
    }
  };

  const buyerRuleCopy =
    selectedPackage.package_type === "prepaid_credit"
      ? "Bar Tab is optional prepaid credit. Cabin-wide package buyer rules do not apply."
      : selectedBuyerRule === "allAdults"
        ? `This package may require all adults in the cabin to buy. The calculator is using ${requiredBuyers} required buyer${requiredBuyers === 1 ? "" : "s"}.`
        : selectedBuyerRule === "guestsOneTwo"
          ? `This bundle usually applies to guests 1 and 2. The calculator is using ${requiredBuyers} buyer${requiredBuyers === 1 ? "" : "s"}.`
          : "The calculator uses the number of people you enter as buying the package.";

  return (
    <section
      id="drink-package-calculator"
      aria-labelledby="drink-package-calculator-title"
      className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6 lg:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-dark">
              Budgeting tool
            </p>
            <h2
              id="drink-package-calculator-title"
              className="mt-1 text-2xl font-bold tracking-tight text-navy"
            >
              Find the best drink package value for your cruise
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              Compare package cost, cabin rules, service charges, bundled fare
              value, or prepaid Bar Tab credit against what you would already
              plan to buy onboard.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-navy">Cruise line</span>
            <select
              value={selectedLine}
              onChange={(event) => updateLine(event.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-navy shadow-sm transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal"
            >
              {lines.map((line) => (
                <option key={line} value={line}>
                  {line}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-navy">
              Package or fare option
            </span>
            <select
              value={selectedPackageKey}
              onChange={(event) => updatePackage(event.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-navy shadow-sm transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal"
            >
              {linePackages.map((pkg) => (
                <option key={getPackageKey(pkg)} value={getPackageKey(pkg)}>
                  {pkg.package_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50/80 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy">
                {selectedPackage.package_name}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {selectedPackage.cruise_line} - Last verified{" "}
                {selectedPackage.last_verified}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold",
                selectedPackage.pricing_confidence_flag ===
                  "User Must Enter Actual Price"
                  ? "bg-warning-light text-warning"
                  : "bg-teal/10 text-teal-dark"
              )}
            >
              {selectedPackage.pricing_confidence_flag}
            </span>
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Type
              </dt>
              <dd className="mt-1 font-semibold text-navy">
                {packageTypeLabel(selectedPackage.package_type)}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Price display
              </dt>
              <dd className="mt-1 font-semibold text-navy">
                {packagePriceLabel(selectedPackage)}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Drink cap
              </dt>
              <dd className="mt-1 font-semibold text-navy">
                {selectedPackage.per_drink_price_cap == null
                  ? "No public cap"
                  : `${currency.format(selectedPackage.per_drink_price_cap)} cap`}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Daily limit
              </dt>
              <dd className="mt-1 font-semibold text-navy">
                {selectedPackage.alcoholic_daily_limit == null
                  ? "No public alcohol cap"
                  : `${selectedPackage.alcoholic_daily_limit} alcoholic/day`}
              </dd>
            </div>
          </dl>
        </div>

        {selectedPackage.package_type === "prepaid_credit" ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-navy">
                Virgin Bar Tab tier
              </span>
              <select
                value={barTabTierIndex}
                onChange={(event) => {
                  markStarted();
                  const nextIndex = Number.parseInt(event.target.value, 10);
                  const tier = BAR_TAB_TIERS[nextIndex] ?? BAR_TAB_TIERS[0];
                  setBarTabTierIndex(nextIndex);
                  setBarTabCredit(tier.credit);
                }}
                className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-navy shadow-sm transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal"
              >
                {BAR_TAB_TIERS.map((tier, index) => (
                  <option key={tier.purchase} value={index}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </label>
            <NumberField
              id="bar-tab-credit"
              label="Available drink credit"
              value={barTabCredit}
              min={0}
              step={1}
              suffix="credit"
              onChange={(value) => {
                markStarted();
                setBarTabCredit(value);
              }}
            />
            <p className="md:col-span-2 rounded-lg border border-teal/20 bg-teal/5 p-3 text-sm text-gray-700">
              Virgin Bar Tab is prepaid drink credit, not an unlimited package.
              This calculator compares available credit with expected total
              beverage spend.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <NumberField
              id="package-price"
              label={
                selectedPackageRequiresPrice
                  ? "Package price per person/day required"
                  : "Package price per person/day"
              }
              value={packagePrices[selectedPackageKey] ?? ""}
              min={0}
              step={0.01}
              prefix="$"
              placeholder="Enter price"
              required={selectedPackageRequiresPrice}
              onChangeString={updatePackagePrice}
            />
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
              <strong className="text-navy">
                {selectedPackageRequiresPrice
                  ? "Required for accuracy."
                  : selectedPackage.user_price_override === "Recommended"
                    ? "Recommended check."
                    : "Default loaded."}
              </strong>{" "}
              {selectedPackageRequiresPrice
                ? selectedPackage.cruise_line === "Royal Caribbean"
                  ? "Royal Caribbean drink package prices vary by sailing. Use the exact Cruise Planner price."
                  : "Use the actual price shown in your cruise planner, booking portal, or offer page."
                : selectedPackage.user_price_override === "Recommended"
                  ? "A public default is loaded, but your actual booking price may be different."
                  : "A public default is loaded. You can still override it if your booking shows a different amount."}
            </div>
          </div>
        )}

        {selectedPackage.package_type !== "prepaid_credit" &&
          selectedPackage.minor_package_name && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <h3 className="font-bold text-navy">
                {selectedPackage.minor_package_name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {selectedPackage.minor_package_rule}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="minor-package-buyers"
                  label={
                    selectedPackage.cruise_line === "Norwegian Cruise Line"
                      ? "Under-21 guests in positions 1-2"
                      : "Underage guests requiring package"
                  }
                  value={minorPackageBuyers}
                  min={0}
                  max={selectedPackage.cruise_line === "Norwegian Cruise Line" ? 2 : 8}
                  step={1}
                  onChange={(value) => {
                    markStarted();
                    setMinorPackageBuyers(
                      Math.round(
                        clampNumber(
                          value,
                          0,
                          selectedPackage.cruise_line === "Norwegian Cruise Line"
                            ? 2
                            : 8,
                        ),
                      ),
                    );
                  }}
                />
                <NumberField
                  id="minor-package-price"
                  label="Younger guest package price/day"
                  value={minorPackagePrices[selectedPackageKey] ?? ""}
                  min={0}
                  step={0.01}
                  prefix="$"
                  placeholder="Enter price"
                  required={
                    minorPackageBuyers > 0 &&
                    selectedPackage.minor_package_user_price_override === "Yes"
                  }
                  onChangeString={(value) => {
                    markStarted();
                    setMinorPackagePrices((current) => ({
                      ...current,
                      [selectedPackageKey]: value,
                    }));
                  }}
                />
              </div>
            </div>
          )}

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-xl font-bold text-navy">Set trip details</h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <NumberField
              id="cruise-length"
              label="Cruise length"
              value={nights}
              min={1}
              max={60}
              step={1}
              suffix="nights"
              onChange={(value) => {
                markStarted();
                const nextNights = Math.round(clampNumber(value, 1, 60));
                setNights(nextNights);
                setPackageDays((current) =>
                  current === nights ? nextNights : Math.min(current, nextNights),
                );
              }}
            />
            {selectedPackage.package_type !== "prepaid_credit" && (
              <NumberField
                id="package-covered-days"
                label="Package-covered days"
                value={packageDays}
                min={1}
                max={nights}
                step={1}
                suffix="days"
                onChange={(value) => {
                  markStarted();
                  setPackageDays(Math.round(clampNumber(value, 1, nights)));
                }}
              />
            )}
            <NumberField
              id="adults-in-cabin"
              label="Adults in cabin"
              value={adultsInCabin}
              min={1}
              max={8}
              step={1}
              onChange={(value) => {
                markStarted();
                setAdultsInCabin(Math.round(clampNumber(value, 1, 8)));
              }}
            />
            {selectedPackage.package_type !== "prepaid_credit" &&
              selectedBuyerRule === "userSelected" && (
                <NumberField
                  id="package-buyers"
                  label="People buying package"
                  value={buyers}
                  min={1}
                  max={8}
                  step={1}
                  onChange={(value) => {
                    markStarted();
                    setBuyers(Math.round(clampNumber(value, 1, 8)));
                  }}
                />
              )}
          </div>
          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            {buyerRuleCopy} Package-covered days defaults to the full sailing;
            reduce it only when your cruise documents show delayed activation
            or partial coverage.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-navy">
              Estimate planned daily onboard purchases
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Enter what your cabin would probably buy on an average day,
              combined. This is a budgeting estimate for purchases you already
              plan to make.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Quick presets">
            {Object.entries(DRINK_PRESETS).map(([presetKey, preset]) => (
              <button
                key={presetKey}
                type="button"
                onClick={() => applyPreset(presetKey)}
                className="min-h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-navy transition-colors hover:border-teal hover:bg-teal/5 focus:outline-none focus:ring-2 focus:ring-teal"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mt-5 divide-y divide-gray-100 rounded-xl border border-gray-200">
            {DRINK_CATEGORIES.map((drink) => {
              const assumption =
                drinkPackageData.default_drink_prices[drink.key];
              const range = assumption?.range
                ? `Typical range: $${assumption.range.replace("-", "-$")}`
                : "Editable estimate";

              return (
                <div
                  key={drink.key}
                  className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_180px_150px] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-navy">{drink.label}</p>
                    <p className="mt-1 text-xs text-gray-500">{range}</p>
                  </div>
                  <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(drink.key, drinkQuantities[drink.key] - 1)
                      }
                      className="flex h-full w-11 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 hover:text-navy"
                      aria-label={`Decrease ${drink.shortLabel}`}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      aria-label={`${drink.label} quantity`}
                      type="number"
                      min={0}
                      max={99}
                      step={1}
                      value={drinkQuantities[drink.key]}
                      onChange={(event) =>
                        updateQuantity(
                          drink.key,
                          numberOr(event.target.value, 0)
                        )
                      }
                      className="h-full min-w-0 flex-1 border-x border-gray-200 text-center text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(drink.key, drinkQuantities[drink.key] + 1)
                      }
                      className="flex h-full w-11 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 hover:text-navy"
                      aria-label={`Increase ${drink.shortLabel}`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <NumberField
                    id={`drink-price-${drink.key}`}
                    label={`${drink.shortLabel} estimated price`}
                    labelClassName="sr-only"
                    value={drinkPrices[drink.key]}
                    min={0}
                    step={0.01}
                    prefix="$"
                    onChange={(value) => updateDrinkPrice(drink.key, value)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {selectedPackage.package_type === "bundle_package" && (
          <div className="mt-8 rounded-xl border border-teal/20 bg-teal/5 p-5">
            <h3 className="text-lg font-bold text-navy">
              Bundle value options
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Choose drinks only for a clean beverage comparison, or include
              non-drink perks you would otherwise buy.
            </p>
            <div
              className="mt-4 grid gap-2 sm:grid-cols-2"
              role="radiogroup"
              aria-label="Bundle calculation mode"
            >
              <RadioCard
                checked={bundleMode === "drinksOnly"}
                label="Drinks only"
                description="Treat the full bundle price as the break-even threshold."
                onChange={() => updateBundleMode("drinksOnly")}
              />
              <RadioCard
                checked={bundleMode === "includePerks"}
                label="Drinks + bundled perks"
                description="Subtract Wi-Fi, crew appreciation, dining, and other value."
                onChange={() => updateBundleMode("includePerks")}
              />
            </div>

            {bundleMode === "includePerks" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="wifi-value"
                  label="Wi-Fi value/day"
                  value={bundleValues.wifi}
                  min={0}
                  step={1}
                  prefix="$"
                  onChange={(value) =>
                    setBundleValues((current) => ({
                      ...current,
                      wifi: Math.max(0, value),
                    }))
                  }
                />
                <NumberField
                  id="crew-value"
                  label="Crew appreciation value/day"
                  value={bundleValues.crew}
                  min={0}
                  step={1}
                  prefix="$"
                  onChange={(value) =>
                    setBundleValues((current) => ({
                      ...current,
                      crew: Math.max(0, value),
                    }))
                  }
                />
                <NumberField
                  id="dining-value"
                  label="Dining value/day"
                  value={bundleValues.dining}
                  min={0}
                  step={1}
                  prefix="$"
                  onChange={(value) =>
                    setBundleValues((current) => ({
                      ...current,
                      dining: Math.max(0, value),
                    }))
                  }
                />
                <NumberField
                  id="excursion-value"
                  label="Shore excursion credit value/day"
                  value={bundleValues.excursion}
                  min={0}
                  step={1}
                  prefix="$"
                  onChange={(value) =>
                    setBundleValues((current) => ({
                      ...current,
                      excursion: Math.max(0, value),
                    }))
                  }
                />
                <NumberField
                  id="other-value"
                  label="Other perk value/day"
                  value={bundleValues.other}
                  min={0}
                  step={1}
                  prefix="$"
                  onChange={(value) =>
                    setBundleValues((current) => ({
                      ...current,
                      other: Math.max(0, value),
                    }))
                  }
                />
              </div>
            )}
          </div>
        )}

        <details className="mt-8 rounded-xl border border-gray-200 bg-gray-50">
          <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-navy">
            Advanced assumptions
          </summary>
          <div className="border-t border-gray-200 p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                id="package-service-charge"
                label="Package service charge"
                value={packageChargePercent}
                min={0}
                max={50}
                step={0.1}
                suffix="%"
                onChange={(value) => {
                  markStarted();
                  setPackageChargePercent(clampNumber(value, 0, 50));
                }}
              />
              <NumberField
                id="paygo-service-charge"
                label="A la carte drink service charge"
                value={paygoChargePercent}
                min={0}
                max={50}
                step={0.1}
                suffix="%"
                onChange={(value) => {
                  markStarted();
                  setPaygoChargePercent(clampNumber(value, 0, 50));
                }}
              />
              <NumberField
                id="manual-buyer-count"
                label="Manual package buyer count"
                value={manualBuyers}
                min={0}
                max={10}
                step={1}
                placeholder="Optional"
                onChangeString={(value) => {
                  markStarted();
                  setManualBuyers(value);
                }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Use advanced fields only when your booking portal or cruise
              documents show a different assumption. Port taxes, embarkation
              restrictions, and private-destination rules can still vary.
            </p>
          </div>
        </details>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div
          aria-live="polite"
          className={cn(
            "rounded-2xl border p-5 shadow-[var(--shadow-sm)] sm:p-6",
            resultToneClass(result)
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-navy">
              <ResultStatusIcon result={result} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Your result
              </p>
              <h3 className="mt-1 text-2xl font-bold text-navy">
                {result.label}
              </h3>
              <p className="mt-1 text-lg font-bold text-navy">
                {result.headline}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            {result.kind === "blocked"
              ? result.detail
              : result.kind === "prepaid"
                ? "This works more like prepaid bar credit than an unlimited package. Compare the available credit against what you would already plan to buy onboard."
                : result.detail}
          </p>

          {result.kind === "standard" && (
            <dl className="mt-5 grid gap-3">
              <Metric
                label="Estimated daily onboard beverage value"
                value={currency.format(result.paygoDailyWithService)}
              />
              <Metric
                label="Package cost/person/day"
                value={currency.format(result.packageDailyPerPerson)}
              />
              <Metric
                label="Package buyers used"
                value={
                  result.minorBuyers > 0
                    ? `${result.adultBuyers} adult + ${result.minorBuyers} younger`
                    : String(result.buyers)
                }
              />
              <Metric
                label="Package coverage"
                value={`${result.packageDays} of ${result.nights} nights`}
              />
              {result.minorPackageTripCost > 0 && (
                <Metric
                  label="Younger guest package trip cost"
                  value={currency.format(result.minorPackageTripCost)}
                />
              )}
              <Metric
                label={
                  result.bundleMode === "includePerks"
                    ? "Adjusted break-even value/day"
                    : "Break-even value/day"
                }
                value={currency.format(result.breakEvenDaily)}
              />
              <Metric
                label={`${result.nights}-night trip estimate`}
                value={`${result.tripDifference >= 0 ? "+" : "-"}${currency.format(Math.abs(result.tripDifference))}`}
              />
            </dl>
          )}

          {result.kind === "prepaid" && (
            <dl className="mt-5 grid gap-3">
              <Metric
                label="Available Bar Tab credit"
                value={currency.format(result.availableCredit)}
              />
              <Metric
                label="Estimated daily onboard beverage value"
                value={currency.format(result.paygoDailyWithService)}
              />
              <Metric
                label={`${result.nights}-night expected spend`}
                value={currency.format(result.expectedSpend)}
              />
              <Metric
                label="Surplus / shortfall"
                value={`${result.surplus >= 0 ? "+" : "-"}${currency.format(Math.abs(result.surplus))}`}
              />
            </dl>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col">
            <button
              type="button"
              onClick={saveEstimate}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white transition-colors hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save estimate
            </button>
            <button
              type="button"
              onClick={shareEstimate}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white px-4 text-sm font-bold text-navy transition-colors hover:bg-navy/5 focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share result
            </button>
            <Link
              href="/calculator"
              onClick={() =>
                trackEvent(
                  "compare_fares_clicked",
                  safeDrinkCalculatorAnalytics({
                    cruiseLine: selectedPackage.cruise_line,
                    partySize: adultsInCabin + minorPackageBuyers,
                    nights,
                    resultType: result.resultType,
                    difference:
                      result.kind === "standard"
                        ? result.dailyDifference
                        : result.kind === "prepaid"
                          ? result.surplus / Math.max(1, nights)
                          : undefined,
                    completion: result.kind !== "blocked",
                  }),
                )
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white px-4 text-sm font-bold text-navy transition-colors hover:bg-navy/5 focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <WalletCards className="h-4 w-4" aria-hidden="true" />
              Compare full cruise cost
            </Link>
          </div>
          {saveMessage && (
            <p className="mt-2 text-xs font-semibold text-navy">
              {saveMessage}
            </p>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)]">
          <h3 className="text-base font-bold text-navy">
            Package notes and sources
          </h3>
          <div className="mt-3 space-y-3">
            {warnings.map((warning) => (
              <div
                key={`${warning.title}-${warning.text}`}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700"
              >
                <strong className="block text-navy">{warning.title}</strong>
                {warning.text}
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Sources and verification
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Last verified: {selectedPackage.last_verified}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Maintained by the CruiseKit web data owner. Official package
              pages are reviewed at least every 30 days and before any known
              price or policy change. Dynamic sailing prices must always be
              checked in your booking portal.
            </p>
            <ul className="mt-2 space-y-1.5">
              {selectedPackage.source_urls.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent(
                        "source_link_clicked",
                        safeDrinkCalculatorAnalytics({
                          cruiseLine: selectedPackage.cruise_line,
                          partySize: adultsInCabin + minorPackageBuyers,
                          nights,
                          completion: result.kind !== "blocked",
                        }),
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-teal-dark"
                  >
                    {getSourceLabel(url)}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </section>
  );
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  placeholder,
  required,
  labelClassName,
  onChange,
  onChangeString,
}: {
  id: string;
  label: string;
  value: string | number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  required?: boolean;
  labelClassName?: string;
  onChange?: (value: number) => void;
  onChangeString?: (value: string) => void;
}) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className={cn("text-sm font-semibold text-navy", labelClassName)}>
        {label}
      </span>
      <span className="flex h-11 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-teal">
        {prefix && (
          <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-500">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          placeholder={placeholder}
          required={required}
          inputMode="decimal"
          aria-label={label}
          onChange={(event) => {
            onChangeString?.(event.target.value);
            onChange?.(numberOr(event.target.value, 0));
          }}
          className="min-w-0 flex-1 px-3 text-sm font-semibold text-navy outline-none placeholder:text-gray-400"
        />
        {suffix && (
          <span className="flex items-center border-l border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-500">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

function RadioCard({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-3 rounded-lg border bg-white p-4 transition-colors",
        checked ? "border-teal ring-2 ring-teal/20" : "border-gray-200"
      )}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-teal"
      />
      <span>
        <span className="block text-sm font-bold text-navy">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-gray-600">
          {description}
        </span>
      </span>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-white/80 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd className="text-right font-price text-sm font-bold text-navy">
        {value}
      </dd>
    </div>
  );
}

function ResultStatusIcon({ result }: { result: CalculatorResult }) {
  const className = "h-5 w-5";

  if (result.kind === "blocked") {
    return <AlertTriangle className={className} aria-hidden="true" />;
  }

  if (result.kind === "prepaid") {
    return result.resultType === "covered" ? (
      <CheckCircle2 className={className} aria-hidden="true" />
    ) : (
      <AlertTriangle className={className} aria-hidden="true" />
    );
  }

  if (result.resultType === "paygo") {
    return <Info className={className} aria-hidden="true" />;
  }

  return <CheckCircle2 className={className} aria-hidden="true" />;
}
