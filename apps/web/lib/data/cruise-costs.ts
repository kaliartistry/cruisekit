import type { CruiseLineCosts } from "@cruise/shared/types";

/**
 * Cruise line cost pricing database.
 *
 * All prices are in USD. Per-day prices are per person unless noted.
 * Data sourced from official cruise line websites and verified against
 * published fare sheets as of 2026-03-28.
 */
export const CRUISE_LINE_COSTS: Record<string, CruiseLineCosts> = {
  // ---------------------------------------------------------------------------
  // Royal Caribbean International
  // ---------------------------------------------------------------------------
  "royal-caribbean": {
    cruiseLineId: "royal-caribbean",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 18.5,
    suiteGratuityPerPersonPerDay: 21.0,
    serviceChargePercent: 18,
    drinkPackages: {
      tiers: [
        {
          name: "Deluxe Beverage Package",
          pricePerDay: 78.0,
          description:
            "Unlimited alcoholic and non-alcoholic drinks (avg pre-cruise price, ranges $56-$120 dynamic pricing + 18% gratuity)",
        },
        {
          name: "Refreshment Package",
          pricePerDay: 31.0,
          description: "Non-alcoholic beverages including specialty coffee, fresh juices, and sodas (+ 18% gratuity)",
        },
        {
          name: "Classic Soda Package",
          pricePerDay: 13.5,
          description: "Unlimited fountain sodas (+ 18% gratuity)",
        },
      ],
      includedFree: false,
      notes:
        "All stateroom adults must purchase drink package if one does. Coca-Cola Freestyle cup removed from packages as of March 15, 2026. 18% gratuity added to package price.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "VOOM Surf & Stream",
          pricePerDay: 22.0,
          description: "High-speed internet for streaming and browsing (dynamic pricing, ranges $17-$31/day)",
        },
      ],
      includedFree: false,
    },
    specialtyDining: {
      restaurants: [
        { name: "Chops Grille", pricePerPerson: 70, cuisine: "Steakhouse" },
        { name: "150 Central Park", pricePerPerson: 70, cuisine: "Contemporary American" },
        { name: "Izumi", pricePerPerson: 40, cuisine: "Japanese" },
        { name: "Giovanni's Table", pricePerPerson: 50, cuisine: "Italian" },
        { name: "Wonderland", pricePerPerson: 50, cuisine: "Imaginative Cuisine" },
      ],
      averagePerMeal: 55,
    },
    averageExcursionCostPerPort: 100,
    photographyPackages: [
      { name: "10-Photo Package", pricePerDay: 130 / 7, description: "10 professional prints ($130 total)" },
      { name: "20-Photo Package", pricePerDay: 200 / 7, description: "20 professional prints ($200 total)" },
      { name: "50-Photo Package", pricePerDay: 240 / 7, description: "50 professional prints ($240 total)" },
      { name: "100-Photo Package", pricePerDay: 400 / 7, description: "100 professional prints ($400 total)" },
    ],
    spaAverageTreatment: 127,
    travelInsurancePercent: 7,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: true,
    kidsClubCost: 12,
    includedFree: [
      "Main dining room",
      "Windjammer buffet",
      "Entertainment and shows",
      "Pools and water slides",
      "Adventure Ocean kids club (ages 3+)",
      "Room service breakfast",
      "Water, tea, and drip coffee",
    ],
    notes:
      "Nursery available for infants at $9-$12/hr. Kids specialty dining averages $15/meal. Service charge is 18% on beverages and 20% on spa treatments.",
  },

  // ---------------------------------------------------------------------------
  // Carnival Cruise Line
  // ---------------------------------------------------------------------------
  carnival: {
    cruiseLineId: "carnival",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 17.0,
    suiteGratuityPerPersonPerDay: 19.0,
    serviceChargePercent: 20,
    drinkPackages: {
      tiers: [
        {
          name: "CHEERS! Beverage Program",
          pricePerDay: 82.54,
          description:
            "Unlimited alcoholic and non-alcoholic drinks (pre-cruise price; $90.60/day onboard + 20% gratuity)",
        },
        {
          name: "CHEERS! Zero Proof",
          pricePerDay: 43.95,
          description: "Unlimited non-alcoholic beverages including specialty coffee and smoothies",
        },
        {
          name: "Bottomless Bubbles",
          pricePerDay: 11.99,
          description: "Unlimited fountain sodas (adult pricing)",
        },
      ],
      includedFree: false,
      notes: "20% service charge applies to all drink package purchases (raised from 18%).",
    },
    wifiPackages: {
      tiers: [
        { name: "Social WiFi", pricePerDay: 20.4, description: "Access to social media platforms" },
        { name: "Value WiFi", pricePerDay: 23.8, description: "Email and basic web browsing" },
        { name: "Premium WiFi", pricePerDay: 25.5, description: "Full streaming and browsing" },
      ],
      includedFree: false,
    },
    specialtyDining: {
      restaurants: [
        { name: "Fahrenheit 555", pricePerPerson: 48, cuisine: "Steakhouse" },
        { name: "Bonsai Teppanyaki", pricePerPerson: 48, cuisine: "Japanese Teppanyaki" },
        { name: "Cucina del Capitano", pricePerPerson: 24, cuisine: "Italian" },
        { name: "Ji Ji Asian Kitchen", pricePerPerson: 24, cuisine: "Asian" },
        { name: "Il Viaggio", pricePerPerson: 42, cuisine: "Italian Fine Dining" },
      ],
      averagePerMeal: 38,
    },
    averageExcursionCostPerPort: 90,
    photographyPackages: [
      { name: "5-Photo Package", pricePerDay: 100 / 7, description: "5 professional prints ($100 total)" },
      { name: "10-Photo Package", pricePerDay: 200 / 7, description: "10 professional prints ($200 total)" },
      { name: "15-Photo Package", pricePerDay: 300 / 7, description: "15 professional prints ($300 total)" },
    ],
    spaAverageTreatment: 125,
    travelInsurancePercent: 8,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: true,
    kidsClubCost: 9,
    includedFree: [
      "Main dining room",
      "Lido buffet",
      "Guy's Burgers",
      "BlueIguana Cantina",
      "Comedy shows and entertainment",
      "Pools and waterslides",
      "Camp Ocean kids club",
    ],
    notes:
      "Gratuity rate of $17.00/day effective April 2, 2026. Night Owls babysitting at $9/hr/child. Carnival Rewards loyalty program launching September 2026.",
  },

  // ---------------------------------------------------------------------------
  // Norwegian Cruise Line
  // ---------------------------------------------------------------------------
  norwegian: {
    cruiseLineId: "norwegian",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 20.0,
    suiteGratuityPerPersonPerDay: 25.0,
    serviceChargePercent: 20,
    drinkPackages: {
      tiers: [
        {
          name: "Free at Sea Open Bar",
          pricePerDay: 0,
          description:
            "Included with Free at Sea promo (mandatory $21.80/day gratuity applies separately)",
        },
        {
          name: "Free at Sea Plus Upgrade",
          pricePerDay: 49.99,
          description:
            "Upgrade adds unlimited streaming WiFi, Starbucks specialty drinks, and premium spirits",
        },
        {
          name: "Unlimited Open Bar (Standalone)",
          pricePerDay: 109,
          description: "Standalone unlimited alcoholic and non-alcoholic beverages",
        },
        {
          name: "Premium Plus Beverage (Standalone)",
          pricePerDay: 150,
          description: "Standalone premium unlimited beverages including top-shelf spirits",
        },
        {
          name: "Unlimited Soft Drink Package",
          pricePerDay: 12.5,
          description: "Unlimited fountain sodas and non-alcoholic beverages",
        },
      ],
      includedFree: true,
      notes:
        "Free at Sea promo includes open bar with mandatory $21.80/day gratuity. Free at Sea drink packages no longer work at Great Stirrup Cay as of March 1, 2026. 20% service charge on all purchases.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "Free at Sea WiFi",
          pricePerDay: 0,
          description: "150 minutes included with Free at Sea promo",
        },
        {
          name: "Voyage WiFi",
          pricePerDay: 29.99,
          description: "Unlimited browsing and email",
        },
        {
          name: "Streaming WiFi",
          pricePerDay: 39.99,
          description: "Unlimited high-speed streaming",
        },
      ],
      includedFree: true,
      notes: "Free at Sea includes 150 WiFi minutes. Free at Sea Plus upgrade adds unlimited streaming WiFi.",
    },
    specialtyDining: {
      restaurants: [
        { name: "Cagney's Steakhouse", pricePerPerson: 60, cuisine: "Steakhouse" },
        { name: "Le Bistro", pricePerPerson: 60, cuisine: "French" },
        { name: "Teppanyaki", pricePerPerson: 60, cuisine: "Japanese Teppanyaki" },
        { name: "Food Republic", pricePerPerson: 50, cuisine: "Fusion" },
        { name: "Onda by Scarpetta", pricePerPerson: 50, cuisine: "Italian" },
        { name: "Los Lobos", pricePerPerson: 40, cuisine: "Mexican" },
      ],
      averagePerMeal: 50,
    },
    averageExcursionCostPerPort: 100,
    photographyPackages: [
      { name: "Welcome 2-Print", pricePerDay: 49 / 7, description: "2 professional prints ($49 total)" },
      { name: "8-Photo Bundle", pricePerDay: 199 / 7, description: "8 professional prints ($199 total)" },
      { name: "48-Photo Voyager", pricePerDay: 449 / 7, description: "48 professional prints ($449 total)" },
    ],
    spaAverageTreatment: 165,
    travelInsurancePercent: 8,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: true,
    includedFree: [
      "Main dining room (note: $5 extra-entree charge)",
      "Garden Cafe buffet",
      "Entertainment and shows",
      "Open bar (with Free at Sea + gratuity)",
      "3 specialty dining meals (with Free at Sea)",
      "150 WiFi minutes (with Free at Sea)",
      "$50 excursion credit for guest 1 (with Free at Sea)",
    ],
    bundlePackages: [
      {
        name: "Free at Sea",
        pricePerDay: 0,
        includes: [
          "Open bar (mandatory $21.80/day gratuity)",
          "3 specialty dining meals",
          "150 WiFi minutes",
          "$50 shore excursion credit (guest 1)",
        ],
        description:
          "Promotional bundle included with most bookings. Gratuity on drinks is mandatory at $21.80/day per person.",
      },
      {
        name: "Free at Sea Plus",
        pricePerDay: 49.99,
        includes: [
          "Everything in Free at Sea",
          "Unlimited streaming WiFi",
          "Starbucks specialty drinks",
          "Premium spirits upgrade",
        ],
        description:
          "Premium upgrade over Free at Sea adding unlimited streaming WiFi, Starbucks, and top-shelf spirits.",
      },
    ],
    notes:
      "Free at Sea is the standard promotional package included with most NCL bookings. $5 extra-entree charge applies in main dining. Splash Academy (ages 3-12) and Entourage (ages 13-17) are free.",
  },

  // ---------------------------------------------------------------------------
  // MSC Cruises
  // ---------------------------------------------------------------------------
  msc: {
    cruiseLineId: "msc",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 16.0,
    suiteGratuityPerPersonPerDay: 16.0,
    serviceChargePercent: 0,
    drinkPackages: {
      tiers: [
        {
          name: "Premium Extra",
          pricePerDay: 85.0,
          description: "Up to 15 alcoholic drinks per day plus unlimited non-alcoholic beverages",
        },
        {
          name: "Alcohol-Free Package",
          pricePerDay: 30.0,
          description: "Unlimited non-alcoholic beverages (estimated pricing)",
        },
      ],
      includedFree: false,
      notes:
        "Budget drink packages eliminated April 2025. New packages expected summer 2026. Yacht Club fare includes all beverages and WiFi. Service charge included in package pricing.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "Browse",
          pricePerDay: 16.0,
          description: "Basic web browsing ($112 per 7-night voyage)",
        },
        {
          name: "Browse & Stream",
          pricePerDay: 20.0,
          description: "Streaming-capable internet ($140 per 7-night voyage)",
        },
      ],
      includedFree: false,
      notes: "Yacht Club guests receive complimentary WiFi.",
    },
    specialtyDining: {
      restaurants: [
        { name: "Butcher's Cut", pricePerPerson: 45, cuisine: "Steakhouse" },
        { name: "Kaito Sushi Bar", pricePerPerson: 30, cuisine: "Japanese Sushi" },
        { name: "Kaito Teppanyaki", pricePerPerson: 45, cuisine: "Japanese Teppanyaki" },
        { name: "Hola! Tacos & Cantina", pricePerPerson: 25, cuisine: "Mexican" },
      ],
      averagePerMeal: 40,
    },
    averageExcursionCostPerPort: 85,
    photographyPackages: [
      { name: "5-Photo Package", pricePerDay: 80 / 7, description: "5 professional prints ($80 total)" },
    ],
    spaAverageTreatment: 135,
    travelInsurancePercent: 7,
    portFeesPerPersonPerDay: 20,
    kidsClubFree: true,
    includedFree: [
      "Main dining room",
      "Marketplace buffet",
      "Entertainment and shows",
      "Pools and waterslides",
      "Kids clubs (5 age-segmented groups, LEGO partnership)",
      "Some basic beverages with certain fare types",
    ],
    notes:
      "Gratuity rate of $16.00/day applies to Caribbean itineraries and varies by region. Service charges are included in package pricing. Yacht Club includes all beverages and WiFi.",
  },

  // ---------------------------------------------------------------------------
  // Celebrity Cruises
  // ---------------------------------------------------------------------------
  celebrity: {
    cruiseLineId: "celebrity",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 18.0,
    suiteGratuityPerPersonPerDay: 23.0,
    serviceChargePercent: 20,
    drinkPackages: {
      tiers: [
        {
          name: "Classic Beverage Package",
          pricePerDay: 89.99,
          description: "Drinks valued at $12 or less (+ 20% gratuity)",
        },
        {
          name: "Premium Beverage Package",
          pricePerDay: 104.99,
          description: "Drinks valued at $19 or less (+ 20% gratuity)",
        },
        {
          name: "Zero Proof Package",
          pricePerDay: 45.0,
          description: "Unlimited non-alcoholic specialty beverages (+ 20% gratuity)",
        },
        {
          name: "Classic to Premium Upgrade",
          pricePerDay: 20.0,
          description: "Upgrade from Classic to Premium tier (+ 20% gratuity)",
        },
      ],
      includedFree: false,
      notes:
        "20% gratuity added to all package prices. Concierge/AquaClass gratuity is $19.00/day. The Retreat suites are $23.00/day.",
    },
    wifiPackages: {
      tiers: [
        { name: "Basic WiFi", pricePerDay: 20.0, description: "Email and basic web browsing" },
        { name: "Premium WiFi", pricePerDay: 35.0, description: "High-speed streaming and browsing" },
      ],
      includedFree: false,
    },
    specialtyDining: {
      restaurants: [
        { name: "Fine Cut Steakhouse", pricePerPerson: 65, cuisine: "Steakhouse" },
        { name: "Murano", pricePerPerson: 60, cuisine: "French" },
        { name: "Le Petit Chef", pricePerPerson: 80, cuisine: "Immersive Dining Experience" },
        { name: "Raw on Five", pricePerPerson: 45, cuisine: "Seafood/Sushi" },
        { name: "Sushi on Five", pricePerPerson: 45, cuisine: "Japanese Sushi" },
      ],
      averagePerMeal: 55,
    },
    averageExcursionCostPerPort: 100,
    photographyPackages: [
      { name: "10-Photo Package", pricePerDay: 350 / 7, description: "10 professional prints ($350 total)" },
      { name: "20-Photo Package", pricePerDay: 600 / 7, description: "20 professional prints ($600 total)" },
      { name: "35-Photo Package", pricePerDay: 850 / 7, description: "35 professional prints ($850 total)" },
    ],
    spaAverageTreatment: 229,
    travelInsurancePercent: 8,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: true,
    kidsClubCost: 6,
    includedFree: [
      "Main dining room",
      "Oceanview Cafe buffet",
      "Entertainment and shows",
      "Basic water, coffee, and tea",
    ],
    bundlePackages: [
      {
        name: "All Included",
        pricePerDay: 78,
        includes: [
          "Classic Beverage Package (drinks up to $12)",
          "Basic WiFi (1 device)",
          "Gratuities included",
        ],
        description:
          "Fare add-on that bundles Classic Drinks and Basic WiFi for approximately $70-$85/day above the base fare.",
      },
    ],
    notes:
      "Points Choice launched for sailings departing January 30, 2026 and later. Solo guests earn double loyalty points. After-hours kids club at $6/hr/child. Private babysitting available at $19/hr.",
  },

  // ---------------------------------------------------------------------------
  // Princess Cruises
  // ---------------------------------------------------------------------------
  princess: {
    cruiseLineId: "princess",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 18.0,
    suiteGratuityPerPersonPerDay: 20.0,
    serviceChargePercent: 20,
    drinkPackages: {
      tiers: [
        {
          name: "Plus Beverage Package",
          pricePerDay: 65.0,
          description:
            "Drinks valued at $15 or less (included in Princess Plus bundle at $65/day total)",
        },
        {
          name: "Premier Beverage Package",
          pricePerDay: 100.0,
          description:
            "Drinks valued at $20 or less (included in Princess Premier bundle at $100/day total)",
        },
        {
          name: "Classic Soda Package",
          pricePerDay: 14.99,
          description: "Unlimited fountain sodas (+ 18% gratuity)",
        },
      ],
      includedFree: false,
      notes:
        "Drink packages are only available as part of Princess Plus or Premier bundles. Standalone soda package available separately. 20% service charge raised from 18%.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "Princess Plus WiFi",
          pricePerDay: 0,
          description: "1 device, included in Princess Plus ($65/day bundle)",
        },
        {
          name: "Princess Premier WiFi",
          pricePerDay: 0,
          description: "4 devices, included in Princess Premier ($100/day bundle)",
        },
        {
          name: "Standalone WiFi",
          pricePerDay: 18.0,
          description: "Basic internet access (estimated, not bundled)",
        },
      ],
      includedFree: false,
      notes: "WiFi is included in both Princess Plus (1 device) and Princess Premier (4 devices) bundles.",
    },
    specialtyDining: {
      restaurants: [
        { name: "Crown Grill", pricePerPerson: 55, cuisine: "Steakhouse" },
        { name: "Sabatini's", pricePerPerson: 55, cuisine: "Italian" },
        { name: "The Catch by Rudi", pricePerPerson: 55, cuisine: "Seafood" },
        { name: "Love by Britto", pricePerPerson: 40, cuisine: "Contemporary" },
      ],
      averagePerMeal: 45,
    },
    averageExcursionCostPerPort: 95,
    photographyPackages: [
      {
        name: "Unlimited Photo Package (Premier)",
        pricePerDay: 0,
        description: "Unlimited prints included with Princess Premier package",
      },
      {
        name: "Individual Photo",
        pricePerDay: 25.0,
        description: "Standalone purchase at approximately $25/photo",
      },
    ],
    spaAverageTreatment: 149,
    travelInsurancePercent: 8,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: true,
    includedFree: [
      "Main dining room",
      "Horizon Court buffet",
      "Entertainment and shows",
      "Pools",
      "Movies Under the Stars",
    ],
    bundlePackages: [
      {
        name: "Princess Plus",
        pricePerDay: 65,
        includes: [
          "Plus Beverage Package (drinks up to $15)",
          "WiFi (1 device)",
          "Gratuities included",
          "4 casual specialty dining meals",
        ],
        description:
          "Mid-tier bundle including drinks up to $15, single-device WiFi, crew gratuities, and 4 casual dining meals.",
      },
      {
        name: "Princess Premier",
        pricePerDay: 100,
        includes: [
          "Premier Beverage Package (drinks up to $20)",
          "WiFi (4 devices)",
          "Gratuities included",
          "Unlimited specialty dining",
          "Unlimited professional photos",
          "$100 excursion credit (7-night+ sailings)",
          "Reserved theater seating",
        ],
        description:
          "Premium all-inclusive bundle. Price is $105/day on Sphere-class ships (Sun/Star Princess).",
      },
    ],
    notes:
      "Princess Plus and Premier are the primary ways to add extras. Mini-suite/Reserve gratuity is $19.00/day. Premier price is $105/day on Sphere-class ships. Travel insurance platinum plan available at 12% of fare.",
  },

  // ---------------------------------------------------------------------------
  // Holland America Line
  // ---------------------------------------------------------------------------
  "holland-america": {
    cruiseLineId: "holland-america",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 17.0,
    suiteGratuityPerPersonPerDay: 19.0,
    serviceChargePercent: 18,
    drinkPackages: {
      tiers: [
        {
          name: "Quench Non-Alcoholic Package",
          pricePerDay: 17.95,
          description: "Unlimited non-alcoholic specialty beverages (+ 18% gratuity)",
        },
        {
          name: "Signature Beverage Package",
          pricePerDay: 60.95,
          description: "Drinks valued at $11 or less (+ 18% gratuity)",
        },
        {
          name: "Elite Beverage Package",
          pricePerDay: 65.95,
          description: "Drinks valued at $15 or less (+ 18% gratuity)",
        },
      ],
      includedFree: false,
      notes:
        "All legal-drinking-age adults in the same stateroom must purchase a drink package if one does. 18% gratuity added to package price.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "Surf WiFi (Have It All)",
          pricePerDay: 0,
          description: "Basic browsing included with Have It All package",
        },
        {
          name: "Premium WiFi (Standalone)",
          pricePerDay: 20.0,
          description: "High-speed internet access (estimated standalone price)",
        },
      ],
      includedFree: false,
      notes: "Surf WiFi included with Have It All package.",
    },
    specialtyDining: {
      restaurants: [
        { name: "Pinnacle Grill", pricePerPerson: 46, cuisine: "Steakhouse/Seafood" },
        { name: "Canaletto", pricePerPerson: 29, cuisine: "Italian" },
        { name: "Rudi's Sel de Mer", pricePerPerson: 55, cuisine: "French Seafood" },
        { name: "Tamarind", pricePerPerson: 35, cuisine: "Asian" },
      ],
      averagePerMeal: 42,
    },
    averageExcursionCostPerPort: 90,
    photographyPackages: [
      { name: "5-Photo Set", pricePerDay: 80 / 7, description: "5 professional prints (~$80 total)" },
      {
        name: "Mid Photography Package",
        pricePerDay: 150 / 7,
        description: "Photography package (~$150 total)",
      },
      {
        name: "Full Photography Package",
        pricePerDay: 300 / 7,
        description: "Comprehensive photography package (~$300 total)",
      },
    ],
    spaAverageTreatment: 149,
    travelInsurancePercent: 0,
    portFeesPerPersonPerDay: 20,
    kidsClubFree: true,
    includedFree: [
      "Main dining room",
      "Lido Market buffet",
      "Dive-In burgers",
      "Entertainment and shows",
      "Pools",
      "Club HAL kids club",
    ],
    bundlePackages: [
      {
        name: "Have It All",
        pricePerDay: 60,
        includes: [
          "Signature Beverage Package (drinks up to $11)",
          "Surf WiFi",
          "1 specialty dinner",
          "$100 shore excursion credit",
        ],
        description:
          "Value bundle including Signature beverages, basic WiFi, one specialty dinner, and $100 excursion credit.",
      },
    ],
    notes:
      "Travel insurance is a flat fee starting at $79 (Cancellation Protection) rather than percentage-based. travelInsurancePercent is set to 0; use flat fee of $79 in calculations.",
  },

  // ---------------------------------------------------------------------------
  // Disney Cruise Line
  // ---------------------------------------------------------------------------
  disney: {
    cruiseLineId: "disney",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 16.0,
    suiteGratuityPerPersonPerDay: 27.25,
    serviceChargePercent: 18,
    drinkPackages: {
      tiers: [],
      includedFree: false,
      notes:
        "No unlimited drink packages offered. Disney intentionally does not offer unlimited alcohol packages to maintain a family atmosphere. All beverages are pay-as-you-go.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "Stay Connected (Social)",
          pricePerDay: 16.0,
          description: "Social media and messaging access",
        },
        {
          name: "Basic Surf",
          pricePerDay: 24.0,
          description: "Email and basic web browsing",
        },
        {
          name: "Premium Surf & Stream",
          pricePerDay: 42.0,
          description: "Full streaming and browsing ($34-$49/day per device, avg $42)",
        },
      ],
      includedFree: false,
      notes:
        "WiFi prices raised 15-17% in January 2026. Concierge guests receive complimentary Basic Surf WiFi.",
    },
    specialtyDining: {
      restaurants: [
        { name: "Palo Steakhouse (Dinner)", pricePerPerson: 50, cuisine: "Italian Steakhouse" },
        { name: "Palo Steakhouse (Brunch)", pricePerPerson: 50, cuisine: "Italian Brunch" },
        { name: "Remy (Dinner)", pricePerPerson: 135, cuisine: "French Fine Dining" },
        { name: "Remy (Brunch)", pricePerPerson: 80, cuisine: "French Brunch" },
        { name: "Enchante (Dinner)", pricePerPerson: 135, cuisine: "French Fine Dining" },
        { name: "Enchante (Brunch)", pricePerPerson: 80, cuisine: "French Brunch" },
      ],
      averagePerMeal: 55,
    },
    averageExcursionCostPerPort: 100,
    photographyPackages: [
      {
        name: "Unlimited Photo Package",
        pricePerDay: 250 / 7,
        description: "Unlimited digital and print photos ($200-$300 total, avg $250)",
      },
    ],
    spaAverageTreatment: 149,
    travelInsurancePercent: 8,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: true,
    kidsClubCost: 9,
    includedFree: [
      "All rotational dining restaurants",
      "Soft drinks at meals",
      "Character meet-and-greets",
      "Fireworks at Sea",
      "Castaway Cay / Lookout Cay private island (food and beach included)",
      "Oceaneer Club (ages 3-10)",
      "Edge (ages 11-14)",
      "Vibe (ages 14-17)",
      "Room service",
    ],
    notes:
      "Nursery available for infants at $9/hr. Gratuities raised 10-16% in January 2025. No unlimited alcohol packages are offered. Castaway Cay and Lookout Cay excursions include free beach access and food.",
  },

  // ---------------------------------------------------------------------------
  // Virgin Voyages
  // ---------------------------------------------------------------------------
  "virgin-voyages": {
    cruiseLineId: "virgin-voyages",
    lastUpdated: "2026-03-28",
    gratuityPerPersonPerDay: 20.0,
    suiteGratuityPerPersonPerDay: 22.0,
    serviceChargePercent: 0,
    drinkPackages: {
      tiers: [
        {
          name: "Bar Tab $200",
          pricePerDay: 200 / 7,
          description: "$200 pre-paid credit with $225 spending power ($25 bonus)",
        },
        {
          name: "Bar Tab $300",
          pricePerDay: 300 / 7,
          description: "$300 pre-paid credit with $350 spending power ($50 bonus)",
        },
        {
          name: "Bar Tab $500",
          pricePerDay: 500 / 7,
          description: "$500 pre-paid credit with $600 spending power ($100 bonus)",
        },
        {
          name: "Bar Tab $750",
          pricePerDay: 750 / 7,
          description: "$750 pre-paid credit with $925 spending power ($175 bonus)",
        },
        {
          name: "Bar Tab $1000",
          pricePerDay: 1000 / 7,
          description: "$1000 pre-paid credit with $1250 spending power ($250 bonus)",
        },
      ],
      includedFree: false,
      notes:
        "Virgin Voyages does not offer unlimited drink packages. Instead, a Bar Tab system provides pre-paid credit with bonus spending power. No additional gratuity or service charge on drinks. Prices shown as per-day are the total Bar Tab amount divided by 7 days.",
    },
    wifiPackages: {
      tiers: [
        {
          name: "Basic WiFi",
          pricePerDay: 0,
          description: "Basic internet access included for all sailors",
        },
        {
          name: "Premium WiFi Upgrade",
          pricePerDay: 10.0,
          description: "Enhanced speed for streaming (estimated upgrade cost)",
        },
      ],
      includedFree: true,
      notes: "Basic WiFi is included complimentary for all guests.",
    },
    specialtyDining: {
      restaurants: [
        { name: "The Wake", pricePerPerson: 0, cuisine: "Steakhouse/Seafood" },
        { name: "Extra Virgin", pricePerPerson: 0, cuisine: "Italian" },
        { name: "Pink Agave", pricePerPerson: 0, cuisine: "Mexican" },
        { name: "Gunbae", pricePerPerson: 0, cuisine: "Korean BBQ" },
        { name: "Test Kitchen", pricePerPerson: 0, cuisine: "Experimental" },
        { name: "Razzle Dazzle", pricePerPerson: 0, cuisine: "Vegetarian-Forward" },
        { name: "The Galley", pricePerPerson: 0, cuisine: "Food Hall" },
      ],
      averagePerMeal: 0,
    },
    averageExcursionCostPerPort: 100,
    photographyPackages: [],
    spaAverageTreatment: 155,
    travelInsurancePercent: 0,
    portFeesPerPersonPerDay: 22,
    kidsClubFree: false,
    includedFree: [
      "All 20+ restaurants and eateries",
      "Basic WiFi",
      "Sodas, water, coffee, and tea",
      "Group fitness classes",
      "Entertainment and shows",
      "Tips on food and drink (pre-2026 bookings)",
    ],
    bundlePackages: [
      {
        name: "VoyageFair Essential",
        pricePerDay: 0,
        includes: [
          "All restaurants (45-day reservation window)",
          "Basic WiFi",
          "Sodas, water, coffee, tea",
        ],
        description:
          "Mid-tier 2026 fare. Adds WiFi and 45-day dining reservation window over Base tier.",
      },
      {
        name: "VoyageFair Premium",
        pricePerDay: 0,
        includes: [
          "All restaurants (60-day reservation window)",
          "Basic WiFi",
          "$15/day Bar Tab credit",
          "Flexible cancellation",
        ],
        description:
          "Top-tier 2026 fare. Adds $15/day Bar Tab credit, 60-day dining window, and flexible cancellation.",
      },
    ],
    notes:
      "Adults only (18+) — no children permitted aboard. No service charge or gratuity on drinks/spa/dining. VoyageFair Choices (2026): Base tier restricts dining reservations to 15 days before sailing. Gratuity is $20/day pre-paid or $22/day if paid onboard. Travel insurance not offered directly; third-party recommended. No structured photography program. Deep Tissue massage is $189. Thermal Suite $59-$79/day or $378 for 7-day pass.",
  },
};
