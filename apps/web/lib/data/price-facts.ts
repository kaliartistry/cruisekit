export type PriceFactStatus = "official" | "corroborated" | "estimate";
export type PriceFactContext =
  | "pre-purchase"
  | "onboard"
  | "included"
  | "booking-cohort"
  | "region-specific";

export type PriceFact = {
  id: string;
  cruiseLineId: string;
  category:
    | "gratuity"
    | "drink-package"
    | "wifi"
    | "bundle"
    | "service-charge";
  label: string;
  amount: number;
  currency: "USD" | "EUR";
  unit: "person-day" | "adult-day" | "package-day" | "percent";
  priceContext?: PriceFactContext;
  status: PriceFactStatus;
  sourceTitle: string;
  sourceUrl: string;
  effectiveOn?: string;
  retrievedAt: string;
  recheckBy: string;
  conditions: string;
  calculation?: string;
};

/**
 * Canonical, auditable source for calculator prices that materially affect a
 * result. UI copy and calculator configuration must reference these records,
 * rather than duplicating numbers in prose.
 */
export const PRICE_FACTS = {
  royalCaribbeanStandardGratuity: {
    id: "royal-caribbean.gratuity.standard.current",
    cruiseLineId: "royal-caribbean",
    category: "gratuity",
    label: "Standard stateroom daily gratuity",
    amount: 18.5,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Royal Caribbean gratuity FAQ",
    sourceUrl:
      "https://www.royalcaribbean.com/bra/pt/faq/questions/onboard-service-gratuity-expense",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Standard stateroom; automatically applied daily.",
  },
  royalCaribbeanSuiteGratuity: {
    id: "royal-caribbean.gratuity.suite.current",
    cruiseLineId: "royal-caribbean",
    category: "gratuity",
    label: "Suite daily gratuity",
    amount: 21,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Royal Caribbean gratuity FAQ",
    sourceUrl:
      "https://www.royalcaribbean.com/bra/pt/faq/questions/onboard-service-gratuity-expense",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Grand Suite and above; automatically applied daily.",
  },
  carnivalStandardGratuity: {
    id: "carnival.gratuity.standard.2026-04-02",
    cruiseLineId: "carnival",
    category: "gratuity",
    label: "Standard stateroom daily gratuity",
    amount: 17,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Carnival service gratuities",
    sourceUrl: "https://help.carnival.com/app/answers/detail/a_id/1123",
    effectiveOn: "2026-04-02",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-12-03",
    conditions: "Standard accommodations; guests age 2 and older.",
  },
  carnivalSuiteGratuity: {
    id: "carnival.gratuity.suite.2026-04-02",
    cruiseLineId: "carnival",
    category: "gratuity",
    label: "Suite daily gratuity",
    amount: 19,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Carnival service gratuities",
    sourceUrl: "https://help.carnival.com/app/answers/detail/a_id/1123",
    effectiveOn: "2026-04-02",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-12-03",
    conditions: "Suite accommodations; guests age 2 and older.",
  },
  carnivalCheersAdvanceAllIn: {
    id: "carnival.cheers.advance.all-in.current",
    cruiseLineId: "carnival",
    category: "drink-package",
    label: "CHEERS advance-purchase price including service charge",
    amount: 83.94,
    currency: "USD",
    unit: "adult-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Carnival CHEERS beverage program",
    sourceUrl: "https://www.carnival.com/onboard/cheers",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-10-04",
    conditions:
      "Purchase by 11:59 PM ET two days before embarkation; all eligible adults in the stateroom must participate.",
    calculation: "$69.95 base price x 1.20 service charge = $83.94.",
  },
  carnivalCheersOnboardAllIn: {
    id: "carnival.cheers.onboard.all-in.current",
    cruiseLineId: "carnival",
    category: "drink-package",
    label: "CHEERS onboard price including service charge",
    amount: 89.94,
    currency: "USD",
    unit: "adult-day",
    priceContext: "onboard",
    status: "official",
    sourceTitle: "Carnival CHEERS beverage program Q&A",
    sourceUrl: "https://help.carnival.com/app/answers/detail/a_id/3525",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-10-04",
    conditions:
      "Purchased after boarding; all eligible adults in the stateroom must participate.",
  },
  carnivalWifiSocialAdvance: {
    id: "carnival.wifi.social.advance.current",
    cruiseLineId: "carnival",
    category: "wifi",
    label: "Social Wi-Fi pre-cruise price",
    amount: 20.4,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Carnival internet plans",
    sourceUrl: "https://www.carnival.com/internet-plans",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions:
      "Cruise-long plan, one connected device at a time; purchase by 11:59 PM ET the day before embarkation.",
  },
  carnivalWifiSocialOnboard: {
    id: "carnival.wifi.social.onboard.current",
    cruiseLineId: "carnival",
    category: "wifi",
    label: "Social Wi-Fi onboard price",
    amount: 22,
    currency: "USD",
    unit: "person-day",
    priceContext: "onboard",
    status: "official",
    sourceTitle: "Carnival internet plans",
    sourceUrl: "https://www.carnival.com/internet-plans",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions: "Cruise-long plan, one connected device at a time.",
  },
  carnivalWifiValueAdvance: {
    id: "carnival.wifi.value.advance.current",
    cruiseLineId: "carnival",
    category: "wifi",
    label: "Value Wi-Fi pre-cruise price",
    amount: 23.8,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Carnival internet plans",
    sourceUrl: "https://www.carnival.com/internet-plans",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions:
      "Cruise-long plan, one connected device at a time; purchase by 11:59 PM ET the day before embarkation.",
  },
  carnivalWifiValueOnboard: {
    id: "carnival.wifi.value.onboard.current",
    cruiseLineId: "carnival",
    category: "wifi",
    label: "Value Wi-Fi onboard price",
    amount: 26,
    currency: "USD",
    unit: "person-day",
    priceContext: "onboard",
    status: "official",
    sourceTitle: "Carnival internet plans",
    sourceUrl: "https://www.carnival.com/internet-plans",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions: "Cruise-long plan, one connected device at a time.",
  },
  carnivalWifiPremiumAdvance: {
    id: "carnival.wifi.premium.advance.current",
    cruiseLineId: "carnival",
    category: "wifi",
    label: "Premium Wi-Fi pre-cruise price",
    amount: 25.5,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Carnival internet plans",
    sourceUrl: "https://www.carnival.com/internet-plans",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions:
      "Cruise-long plan, one connected device at a time; purchase by 11:59 PM ET the day before embarkation.",
  },
  carnivalWifiPremiumOnboard: {
    id: "carnival.wifi.premium.onboard.current",
    cruiseLineId: "carnival",
    category: "wifi",
    label: "Premium Wi-Fi onboard price",
    amount: 28,
    currency: "USD",
    unit: "person-day",
    priceContext: "onboard",
    status: "official",
    sourceTitle: "Carnival internet plans",
    sourceUrl: "https://www.carnival.com/internet-plans",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions: "Cruise-long plan, one connected device at a time.",
  },
  nclFreeAtSeaAdult: {
    id: "norwegian.free-at-sea.gratuity.current.adult",
    cruiseLineId: "norwegian",
    category: "drink-package",
    label: "Free at Sea beverage-package gratuity (age 21+)",
    amount: 28.5,
    currency: "USD",
    unit: "adult-day",
    status: "official",
    sourceTitle: "Norwegian Free at Sea program guide",
    sourceUrl:
      "https://www.ncl.com/sites/default/files/3189550_PRM_Free_at_Sea_Plus_Trade_Launch_Assets_FASvsFASPlus_Rebrand_GSC.pdf",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-10-04",
    conditions:
      "Current Free at Sea cohort; pre-cruise beverage-package gratuity for guests age 21 and older. Onboard pricing varies.",
  },
  nclMoreAtSeaLegacy: {
    id: "norwegian.more-at-sea.gratuity.legacy",
    cruiseLineId: "norwegian",
    category: "drink-package",
    label: "Legacy More at Sea beverage-package gratuity",
    amount: 21.8,
    currency: "USD",
    unit: "adult-day",
    status: "official",
    sourceTitle: "Norwegian More at Sea terms",
    sourceUrl: "https://www.ncl.com/about/terms-and-conditions/promotions",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions:
      "Only for applicable bookings made from October 1, 2024 through November 4, 2025; verify the booking confirmation.",
  },
  nclStandardGratuity: {
    id: "norwegian.gratuity.standard.current",
    cruiseLineId: "norwegian",
    category: "gratuity",
    label: "Club Balcony Suite and below daily service charge",
    amount: 20,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Norwegian onboard service charge FAQ",
    sourceUrl: "https://www.ncl.com/faq/what-is-ncl-onboard-service-charge",
    effectiveOn: "2023-01-01",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Guests age 3 and older; Club Balcony Suite and below.",
  },
  nclSuiteGratuity: {
    id: "norwegian.gratuity.suite.current",
    cruiseLineId: "norwegian",
    category: "gratuity",
    label: "The Haven and Suites daily service charge",
    amount: 25,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Norwegian onboard service charge FAQ",
    sourceUrl: "https://www.ncl.com/faq/what-is-ncl-onboard-service-charge",
    effectiveOn: "2023-01-01",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Guests age 3 and older; The Haven and Suites.",
  },
  celebrityStandardGratuity: {
    id: "celebrity.gratuity.standard.current",
    cruiseLineId: "celebrity",
    category: "gratuity",
    label: "Inside, ocean-view, and veranda daily gratuity",
    amount: 19.5,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Celebrity gratuity program FAQ",
    sourceUrl: "https://www.celebritycruises.com/faqs/gratuity-program",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Inside, ocean-view, and veranda staterooms.",
  },
  celebritySuiteGratuity: {
    id: "celebrity.gratuity.retreat.current",
    cruiseLineId: "celebrity",
    category: "gratuity",
    label: "Retreat daily gratuity",
    amount: 24.5,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Celebrity gratuity program FAQ",
    sourceUrl: "https://www.celebritycruises.com/faqs/gratuity-program",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "The Retreat accommodations; Concierge and AquaClass are $20.50.",
  },
  princessPlusAdvance: {
    id: "princess.plus.bundle.advance.current",
    cruiseLineId: "princess",
    category: "bundle",
    label: "Princess Plus advance-purchase bundle",
    amount: 65,
    currency: "USD",
    unit: "package-day",
    status: "official",
    sourceTitle: "Princess package comparison",
    sourceUrl:
      "https://www.princess.com/en-int/cruise-deals-promotions/compare-cruise-packages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-10-04",
    conditions:
      "Most ships; purchase at least 96 hours before sailing. Includes crew appreciation and one-device Wi-Fi.",
  },
  princessPremierAdvance: {
    id: "princess.premier.bundle.advance.current",
    cruiseLineId: "princess",
    category: "bundle",
    label: "Princess Premier advance-purchase bundle",
    amount: 100,
    currency: "USD",
    unit: "package-day",
    status: "official",
    sourceTitle: "Princess package comparison",
    sourceUrl:
      "https://www.princess.com/en-int/cruise-deals-promotions/compare-cruise-packages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-10-04",
    conditions:
      "Most ships; purchase at least 96 hours before sailing. Includes crew appreciation and four-device Wi-Fi. Sun and Star Princess are $105/day.",
  },
  princessStandardGratuity: {
    id: "princess.gratuity.standard.current",
    cruiseLineId: "princess",
    category: "gratuity",
    label: "Interior, oceanview, and balcony crew appreciation",
    amount: 18,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Princess onboard experience FAQ",
    sourceUrl: "https://www.princess.com/en-int/faq/onboard-experience",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Interior, oceanview, and balcony staterooms; regional exceptions apply.",
  },
  princessMiniSuiteGratuity: {
    id: "princess.gratuity.mini-suite.current",
    cruiseLineId: "princess",
    category: "gratuity",
    label: "Mini-suite, cabana, and Reserve Collection crew appreciation",
    amount: 19,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Princess onboard experience FAQ",
    sourceUrl: "https://www.princess.com/en-int/faq/onboard-experience",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Mini-suite, cabana, and Reserve Collection staterooms; regional exceptions apply.",
  },
  princessSuiteGratuity: {
    id: "princess.gratuity.suite.current",
    cruiseLineId: "princess",
    category: "gratuity",
    label: "Suite crew appreciation",
    amount: 20,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Princess onboard experience FAQ",
    sourceUrl: "https://www.princess.com/en-int/faq/onboard-experience",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Suites; regional exceptions apply.",
  },
  hollandAmericaStandardGratuity: {
    id: "holland-america.gratuity.standard.current",
    cruiseLineId: "holland-america",
    category: "gratuity",
    label: "Standard stateroom crew appreciation",
    amount: 18,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Holland America crew appreciation FAQ",
    sourceUrl:
      "https://www.hollandamerica.com/en/us/faq/onboard-cruise-experience/onboard-information/is-there-a-crew-appreciation-charge-gratuity-tip",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Non-suite accommodations.",
  },
  hollandAmericaSuiteGratuity: {
    id: "holland-america.gratuity.suite.current",
    cruiseLineId: "holland-america",
    category: "gratuity",
    label: "Suite crew appreciation",
    amount: 20,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Holland America crew appreciation FAQ",
    sourceUrl:
      "https://www.hollandamerica.com/en/us/faq/onboard-cruise-experience/onboard-information/is-there-a-crew-appreciation-charge-gratuity-tip",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Suite accommodations.",
  },
  mscStandardCaribbean: {
    id: "msc.gratuity.caribbean-standard.corroborated",
    cruiseLineId: "msc",
    category: "gratuity",
    label: "Caribbean and Alaska standard daily hotel service charge",
    amount: 17,
    currency: "USD",
    unit: "person-day",
    status: "corroborated",
    sourceTitle: "MSC service-charge schedule (third-party corroboration)",
    sourceUrl:
      "https://www.cruisecritic.com/articles/what-to-know-about-cruise-line-gratuities",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions:
      "Caribbean/Alaska planning assumption only. MSC official pages blocked automated retrieval; verify the booking terms because other regions use different currencies and rates.",
  },
  mscSuiteCaribbean: {
    id: "msc.gratuity.caribbean-yacht-club.corroborated",
    cruiseLineId: "msc",
    category: "gratuity",
    label: "Caribbean and Alaska Yacht Club daily hotel service charge",
    amount: 23,
    currency: "USD",
    unit: "person-day",
    status: "corroborated",
    sourceTitle: "MSC service-charge schedule (third-party corroboration)",
    sourceUrl: "https://www.cruisecritic.com/articles/what-to-know-about-cruise-line-gratuities",
    retrievedAt: "2026-09-04",
    recheckBy: "2026-10-04",
    conditions: "Caribbean/Alaska Yacht Club planning assumption only; verify regional booking terms.",
  },
  disneyStandardGratuity: {
    id: "disney.gratuity.standard.current",
    cruiseLineId: "disney",
    category: "gratuity",
    label: "Standard stateroom recommended gratuity",
    amount: 16,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Disney Cruise Line gratuities FAQ",
    sourceUrl: "https://disneycruise.disney.go.com/en/faq/onboard-services/gratuities/",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per night for every stateroom guest, including infants and children.",
  },
  disneyConciergeGratuity: {
    id: "disney.gratuity.concierge.current",
    cruiseLineId: "disney",
    category: "gratuity",
    label: "Concierge stateroom and suite recommended gratuity",
    amount: 27.25,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Disney Cruise Line gratuities FAQ",
    sourceUrl: "https://disneycruise.disney.go.com/en/faq/onboard-services/gratuities/",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per night for every guest in Concierge staterooms and suites.",
  },
  carnivalBottomlessBubblesAdult: {
    id: "carnival.drink-package.bottomless-bubbles.adult",
    cruiseLineId: "carnival",
    category: "drink-package",
    label: "Bottomless Bubbles soda package (adult)",
    amount: 9.5,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Carnival CHEERS! and Bottomless Bubbles page",
    sourceUrl: "https://www.carnival.com/drink-packages/cheers-package/",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Adult rate; children $6.95; a 20% service charge is added.",
  },
  nclFreeAtSeaMinor: {
    id: "norwegian.gratuity.free-at-sea-beverage.minor",
    cruiseLineId: "norwegian",
    category: "gratuity",
    label: "Free at Sea soda and juice package for guests aged 3-20",
    amount: 12.5,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "NCL Free at Sea vs Free at Sea Plus comparison flyer (12/25)",
    sourceUrl: "https://www.ncl.com/sites/default/files/Free-at-Sea-Plus-Comparison-Flyer_0.pdf",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Charged per guest aged 3-20 in a Free at Sea stateroom instead of the adult open-bar gratuity; guests under 3 are free.",
  },
  celebrityConciergeGratuity: {
    id: "celebrity.gratuity.concierge.current",
    cruiseLineId: "celebrity",
    category: "gratuity",
    label: "Concierge and AquaClass daily gratuity",
    amount: 20.5,
    currency: "USD",
    unit: "person-day",
    status: "official",
    sourceTitle: "Celebrity Cruises gratuity program FAQ",
    sourceUrl: "https://www.celebritycruises.com/faqs/gratuity-program",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Concierge Class and AquaClass staterooms; automatically applied daily.",
  },
  princessPlusBeverage: {
    id: "princess.drink-package.plus-beverage.advance",
    cruiseLineId: "princess",
    category: "drink-package",
    label: "Plus Beverage Package (beverage only)",
    amount: 64.99,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Princess Cruises beverage packages",
    sourceUrl: "https://www.princess.com/en-us/cruise-dining/beverages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per person per day; 20% service charge applied on all itineraries except Australia.",
  },
  princessPremierBeverage: {
    id: "princess.drink-package.premier-beverage.advance",
    cruiseLineId: "princess",
    category: "drink-package",
    label: "Premier Beverage Package (beverage only)",
    amount: 84.99,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Princess Cruises beverage packages",
    sourceUrl: "https://www.princess.com/en-us/cruise-dining/beverages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per person per day; 20% service charge applied on all itineraries except Australia.",
  },
  princessZeroAlcoholBeverage: {
    id: "princess.drink-package.zero-alcohol.advance",
    cruiseLineId: "princess",
    category: "drink-package",
    label: "Zero-Alcohol Package",
    amount: 29.99,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Princess Cruises beverage packages",
    sourceUrl: "https://www.princess.com/en-us/cruise-dining/beverages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per person per day; 20% service charge applied on all itineraries except Australia.",
  },
  princessClassicSoda: {
    id: "princess.drink-package.classic-soda.advance",
    cruiseLineId: "princess",
    category: "drink-package",
    label: "Classic Soda Package",
    amount: 14.99,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Princess Cruises beverage packages",
    sourceUrl: "https://www.princess.com/en-us/cruise-dining/beverages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per person per day; 20% service charge applied on all itineraries except Australia.",
  },
  hollandAmericaQuenchBeverage: {
    id: "holland-america.drink-package.quench.advance",
    cruiseLineId: "holland-america",
    category: "drink-package",
    label: "Quench non-alcoholic beverage package",
    amount: 17.95,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Holland America Line beverage packages",
    sourceUrl: "https://www.hollandamerica.com/en/us/onboard-packages/beverage-packages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Starts-at price per person per day; 20% service charge is applied to beverage purchases.",
  },
  hollandAmericaSignatureBeverage: {
    id: "holland-america.drink-package.signature.advance",
    cruiseLineId: "holland-america",
    category: "drink-package",
    label: "Signature Beverage Package",
    amount: 55.95,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Holland America Line beverage packages",
    sourceUrl: "https://www.hollandamerica.com/en/us/onboard-packages/beverage-packages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Drinks up to $11; per person per day; 20% service charge applied.",
  },
  hollandAmericaEliteBeverage: {
    id: "holland-america.drink-package.elite.advance",
    cruiseLineId: "holland-america",
    category: "drink-package",
    label: "Elite Beverage Package",
    amount: 60.95,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Holland America Line beverage packages",
    sourceUrl: "https://www.hollandamerica.com/en/us/onboard-packages/beverage-packages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Drinks up to $15; per person per day; 20% service charge applied.",
  },
  hollandAmericaHaveItAll: {
    id: "holland-america.bundle.have-it-all.advance",
    cruiseLineId: "holland-america",
    category: "bundle",
    label: "Have It All package",
    amount: 65,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Holland America Line beverage packages",
    sourceUrl: "https://www.hollandamerica.com/en/us/onboard-packages/beverage-packages",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Per person per day; includes Signature Beverage Package, Surf Wi-Fi, specialty dining, and shore excursion credit.",
  },
  hollandAmericaBeverageServiceCharge: {
    id: "holland-america.service-charge.beverage",
    cruiseLineId: "holland-america",
    category: "service-charge",
    label: "Beverage service charge",
    amount: 20,
    currency: "USD",
    unit: "percent",
    status: "official",
    sourceTitle: "Holland America Line crew appreciation FAQ",
    sourceUrl: "https://www.hollandamerica.com/en/us/faq/onboard-cruise-experience/onboard-information/is-there-a-crew-appreciation-charge-gratuity-tip",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions: "Applied to beverage purchases, bar retail, specialty cover charges, and a la carte items; spa and salon carry 18%.",
  },
  virginCurrentPrepaid: {
    id: "virgin-voyages.gratuity.current.prepaid",
    cruiseLineId: "virgin-voyages",
    category: "gratuity",
    label: "Current VoyageFair prepaid gratuity",
    amount: 20,
    currency: "USD",
    unit: "person-day",
    priceContext: "pre-purchase",
    status: "official",
    sourceTitle: "Virgin Voyages VoyageFair Choices FAQ",
    sourceUrl:
      "https://www.virginvoyages.com/faq/before-you-sail/voyagefair-choices",
    effectiveOn: "2025-10-07",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions:
      "Bookings made on or after October 7, 2025 when prepaid before sailing; rate is flat across cabin types.",
  },
  virginCurrentOnboard: {
    id: "virgin-voyages.gratuity.current.onboard",
    cruiseLineId: "virgin-voyages",
    category: "gratuity",
    label: "Current VoyageFair onboard gratuity",
    amount: 22,
    currency: "USD",
    unit: "person-day",
    priceContext: "onboard",
    status: "official",
    sourceTitle: "Virgin Voyages VoyageFair Choices FAQ",
    sourceUrl:
      "https://www.virginvoyages.com/faq/before-you-sail/voyagefair-choices",
    effectiveOn: "2025-10-07",
    retrievedAt: "2026-09-10",
    recheckBy: "2026-12-09",
    conditions:
      "Bookings made on or after October 7, 2025 when charged onboard; rate is flat across cabin types.",
  },
  virginLegacyIncluded: {
    id: "virgin-voyages.gratuity.legacy.included",
    cruiseLineId: "virgin-voyages",
    category: "gratuity",
    label: "Legacy booking gratuity included in fare",
    amount: 0,
    currency: "USD",
    unit: "person-day",
    priceContext: "included",
    status: "official",
    sourceTitle: "Virgin Voyages VoyageFair Choices announcement",
    sourceUrl:
      "https://www.virginvoyages.com/press/latest-releases/voyagefairchoices",
    retrievedAt: "2026-09-04",
    recheckBy: "2027-01-01",
    conditions:
      "Bookings made before October 7, 2025 under the prior fare structure; confirm the original booking confirmation.",
  },
} as const satisfies Record<string, PriceFact>;

export type PurchasePricePair = Readonly<{
  prePurchase: PriceFact;
  onboard: PriceFact;
}>;

export const PURCHASE_PRICE_PAIRS = {
  carnivalCheers: {
    prePurchase: PRICE_FACTS.carnivalCheersAdvanceAllIn,
    onboard: PRICE_FACTS.carnivalCheersOnboardAllIn,
  },
  carnivalWifiSocial: {
    prePurchase: PRICE_FACTS.carnivalWifiSocialAdvance,
    onboard: PRICE_FACTS.carnivalWifiSocialOnboard,
  },
  carnivalWifiValue: {
    prePurchase: PRICE_FACTS.carnivalWifiValueAdvance,
    onboard: PRICE_FACTS.carnivalWifiValueOnboard,
  },
  carnivalWifiPremium: {
    prePurchase: PRICE_FACTS.carnivalWifiPremiumAdvance,
    onboard: PRICE_FACTS.carnivalWifiPremiumOnboard,
  },
  virginGratuity: {
    prePurchase: PRICE_FACTS.virginCurrentPrepaid,
    onboard: PRICE_FACTS.virginCurrentOnboard,
  },
} as const satisfies Record<string, PurchasePricePair>;

export function purchasePricePairSavings(
  pair: PurchasePricePair,
  quantity: number,
  nights: number,
) {
  return (
    (pair.onboard.amount - pair.prePurchase.amount) *
    Math.max(0, quantity) *
    Math.max(0, nights)
  );
}

export function getDrinkPackagePurchasePricePair(
  cruiseLineId: string,
  tierName: string,
): PurchasePricePair | undefined {
  if (
    cruiseLineId === "carnival" &&
    tierName === "CHEERS! Beverage Program"
  ) {
    return PURCHASE_PRICE_PAIRS.carnivalCheers;
  }
  return undefined;
}

export function getWifiPurchasePricePair(
  cruiseLineId: string,
  tierName: string,
): PurchasePricePair | undefined {
  if (cruiseLineId !== "carnival") return undefined;
  if (tierName === "Social WiFi") {
    return PURCHASE_PRICE_PAIRS.carnivalWifiSocial;
  }
  if (tierName === "Value WiFi") {
    return PURCHASE_PRICE_PAIRS.carnivalWifiValue;
  }
  if (tierName === "Premium WiFi") {
    return PURCHASE_PRICE_PAIRS.carnivalWifiPremium;
  }
  return undefined;
}

export const MATERIAL_PRICE_FACTS: PriceFact[] = Object.values(PRICE_FACTS);

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * A fact is stale once its recheck date has passed. The default is the real
 * current date so the governance test fails when a re-verification is due,
 * rather than silently passing against a frozen date.
 */
export function priceFactIsStale(fact: PriceFact, today = todayIsoDate()) {
  return fact.recheckBy < today;
}

/** Formats a derived total for prose as whole dollars with thousands separators. */
export function usdRounded(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

/** Formats a fact amount for prose: whole dollars without cents, else 2dp. */
export function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}
