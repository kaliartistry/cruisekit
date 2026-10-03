import rawDrinkPackageData from "./drink-package-data.json";

export type DrinkPackageType =
  | "standard_drink_package"
  | "dynamic_price_drink_package"
  | "bundle_package"
  | "prepaid_credit";

export interface DrinkPriceAssumption {
  suggested_default: number;
  range: string;
  notes: string;
  confidence: string;
}

export interface DrinkPackage {
  cruise_line: string;
  package_name: string;
  package_type: DrinkPackageType;
  default_price: number | null;
  price_type: string;
  pricing_confidence_flag: string;
  package_service_charge_rate: number | null;
  a_la_carte_service_charge_rate: number | null;
  required_adult_buyers_rule: string;
  alcoholic_daily_limit: number | null;
  non_alcoholic_daily_limit: number | null;
  per_drink_price_cap: number | null;
  included_categories: string[];
  major_exclusions: string[];
  private_destination_rules: string;
  ux_priority: string;
  user_price_override: "Yes" | "No" | "Recommended";
  calculator_warning: string;
  source_urls: string[];
  last_verified: string;
  confidence: string;
}

export interface DrinkPackageData {
  metadata: {
    name: string;
    version: string;
    generated_from: string;
    last_verified: string;
    note: string;
  };
  packages: DrinkPackage[];
  default_drink_prices: Record<string, DrinkPriceAssumption>;
}

export const drinkPackageData = rawDrinkPackageData as DrinkPackageData;

export const DRINK_CATEGORIES = [
  {
    key: "cocktail",
    label: "Cocktails / mixed drinks",
    shortLabel: "Cocktails",
    type: "alcoholic",
  },
  {
    key: "beer",
    label: "Beer",
    shortLabel: "Beer",
    type: "alcoholic",
  },
  {
    key: "wine_by_glass",
    label: "Wine by the glass",
    shortLabel: "Wine",
    type: "alcoholic",
  },
  {
    key: "specialty_coffee",
    label: "Specialty coffee",
    shortLabel: "Coffee",
    type: "nonalcoholic",
  },
  {
    key: "soda",
    label: "Soda",
    shortLabel: "Soda",
    type: "nonalcoholic",
  },
  {
    key: "bottled_water",
    label: "Bottled water",
    shortLabel: "Water",
    type: "nonalcoholic",
  },
  {
    key: "mocktail_smoothie_juice",
    label: "Mocktails / smoothies / juice",
    shortLabel: "Mocktails / juice",
    type: "nonalcoholic",
  },
] as const;

export type DrinkCategoryKey = (typeof DRINK_CATEGORIES)[number]["key"];

export const DRINK_PRESETS: Record<
  string,
  {
    label: string;
    quantities: Record<DrinkCategoryKey, number>;
  }
> = {
  light: {
    label: "Light plan",
    quantities: {
      cocktail: 1,
      beer: 0,
      wine_by_glass: 1,
      specialty_coffee: 1,
      soda: 0,
      bottled_water: 1,
      mocktail_smoothie_juice: 0,
    },
  },
  dinner: {
    label: "Dinner + coffee",
    quantities: {
      cocktail: 1,
      beer: 0,
      wine_by_glass: 2,
      specialty_coffee: 1,
      soda: 0,
      bottled_water: 1,
      mocktail_smoothie_juice: 0,
    },
  },
  pool: {
    label: "Pool day",
    quantities: {
      cocktail: 3,
      beer: 2,
      wine_by_glass: 0,
      specialty_coffee: 1,
      soda: 1,
      bottled_water: 3,
      mocktail_smoothie_juice: 1,
    },
  },
  na: {
    label: "Mostly non-alcoholic",
    quantities: {
      cocktail: 0,
      beer: 0,
      wine_by_glass: 0,
      specialty_coffee: 2,
      soda: 2,
      bottled_water: 3,
      mocktail_smoothie_juice: 2,
    },
  },
  reset: {
    label: "Reset",
    quantities: {
      cocktail: 0,
      beer: 0,
      wine_by_glass: 0,
      specialty_coffee: 0,
      soda: 0,
      bottled_water: 0,
      mocktail_smoothie_juice: 0,
    },
  },
};

export const BAR_TAB_TIERS = [
  { purchase: 200, credit: 225, label: "$200 prepaid -> $225 available credit" },
  { purchase: 300, credit: 350, label: "$300 prepaid -> $350 available credit" },
  { purchase: 500, credit: 600, label: "$500 prepaid -> $600 available credit" },
  { purchase: 750, credit: 925, label: "$750 prepaid -> $925 available credit" },
  {
    purchase: 1000,
    credit: 1250,
    label: "$1,000 prepaid -> $1,250 available credit",
  },
];

export function getPackageKey(pkg: DrinkPackage) {
  return `${pkg.cruise_line}::${pkg.package_name}`;
}

export function getDrinkPackageLines() {
  return Array.from(
    new Set(drinkPackageData.packages.map((pkg) => pkg.cruise_line))
  ).sort((a, b) => a.localeCompare(b));
}

export function getPackagesForLine(cruiseLine: string) {
  return drinkPackageData.packages.filter(
    (pkg) => pkg.cruise_line === cruiseLine
  );
}

export function packageTypeLabel(type: DrinkPackageType) {
  const labels: Record<DrinkPackageType, string> = {
    standard_drink_package: "Standard package",
    dynamic_price_drink_package: "Dynamic price",
    bundle_package: "Bundle",
    prepaid_credit: "Prepaid credit",
  };

  return labels[type];
}

export function getDefaultDrinkPrices() {
  return Object.fromEntries(
    DRINK_CATEGORIES.map((drink) => {
      const assumption = drinkPackageData.default_drink_prices[drink.key];
      return [drink.key, assumption?.suggested_default ?? 0];
    })
  ) as Record<DrinkCategoryKey, number>;
}
