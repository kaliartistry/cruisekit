import type { CruiseLineId, CruiseRegion } from "@cruise/shared/types";

/**
 * Ship database for CruiseKit.
 *
 * All fares are per person, based on double occupancy, for a 7-night Caribbean
 * sailing. Suite fares represent starting prices. Ships with primarily shorter
 * itineraries have been scaled to a 7-night equivalent.
 *
 * Updated: 2026-03-28
 * Source: Manually collected from cruise line websites and OTA listings.
 */

export interface ShipData {
  id: string;
  name: string;
  cruiseLineId: CruiseLineId;
  shipClass: string;
  yearBuilt: number;
  grossTonnage: number;
  passengerCapacity: number;
  decks: number;
  homePorts: string[];
  regions: CruiseRegion[];
  /** Per-person fares for a 7-night Caribbean sailing (double occupancy) */
  fare7Night: {
    inside: number;
    balcony: number;
    suite: number;
  };
  notableFeatures: string[];
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Ship data — 45 ships across 9 cruise lines
// ---------------------------------------------------------------------------

export const SHIPS: ShipData[] = [
  // -------------------------------------------------------------------------
  // Royal Caribbean International
  // -------------------------------------------------------------------------
  {
    id: "icon-of-the-seas",
    name: "Icon of the Seas",
    cruiseLineId: "royal-caribbean",
    shipClass: "Icon",
    yearBuilt: 2024,
    grossTonnage: 250_800,
    passengerCapacity: 5_610,
    decks: 20,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_238, balcony: 1_800, suite: 3_500 },
    notableFeatures: [
      "Category 6 waterpark",
      "AquaDome",
      "Crown's Edge",
      "Surfside neighborhood",
    ],
  },
  {
    id: "star-of-the-seas",
    name: "Star of the Seas",
    cruiseLineId: "royal-caribbean",
    shipClass: "Icon",
    yearBuilt: 2025,
    grossTonnage: 250_800,
    passengerCapacity: 5_610,
    decks: 20,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_486, balcony: 2_196, suite: 3_690 },
    notableFeatures: [
      "Lincoln Park Supper Club",
      "Thrill Island",
      "6 water slides",
      "Absolute Zero ice arena",
    ],
  },
  {
    id: "utopia-of-the-seas",
    name: "Utopia of the Seas",
    cruiseLineId: "royal-caribbean",
    shipClass: "Oasis",
    yearBuilt: 2024,
    grossTonnage: 236_473,
    passengerCapacity: 5_668,
    decks: 18,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    // 4-night fares scaled to 7-night: $432 → ~$756, $650 → ~$1,138, $1,200 → ~$2,100
    fare7Night: { inside: 756, balcony: 1_138, suite: 2_100 },
    notableFeatures: [
      "Royal Railway immersive dining",
      "Ultimate Abyss slide",
      "Pesky Parrot bar",
    ],
  },
  {
    id: "wonder-of-the-seas",
    name: "Wonder of the Seas",
    cruiseLineId: "royal-caribbean",
    shipClass: "Oasis",
    yearBuilt: 2022,
    grossTonnage: 235_600,
    passengerCapacity: 5_734,
    decks: 18,
    homePorts: ["Port Canaveral, FL", "Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 850, balcony: 1_150, suite: 2_800 },
    notableFeatures: [
      "19 pools",
      "Suite Neighborhood",
      "Wonder Playscape",
      "Mason Jar bar",
    ],
  },
  {
    id: "allure-of-the-seas",
    name: "Allure of the Seas",
    cruiseLineId: "royal-caribbean",
    shipClass: "Oasis",
    yearBuilt: 2010,
    grossTonnage: 225_282,
    passengerCapacity: 5_484,
    decks: 18,
    homePorts: ["Miami, FL", "Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 746, balcony: 950, suite: 2_100 },
    notableFeatures: [
      "Amplified 2025 ($100M refit)",
      "Splashaway Bay",
      "Central Park",
      "Zip line",
    ],
  },

  // -------------------------------------------------------------------------
  // Carnival Cruise Line
  // -------------------------------------------------------------------------
  {
    id: "carnival-jubilee",
    name: "Carnival Jubilee",
    cruiseLineId: "carnival",
    shipClass: "Excel",
    yearBuilt: 2023,
    grossTonnage: 183_521,
    passengerCapacity: 5_374,
    decks: 20,
    homePorts: ["Galveston, TX"],
    regions: ["caribbean"],
    fare7Night: { inside: 448, balcony: 750, suite: 1_600 },
    notableFeatures: [
      "BOLT roller coaster",
      "Texas-themed Lone Star Tailgate",
      "WaterWorks",
    ],
  },
  {
    id: "carnival-celebration",
    name: "Carnival Celebration",
    cruiseLineId: "carnival",
    shipClass: "Excel",
    yearBuilt: 2022,
    grossTonnage: 180_800,
    passengerCapacity: 5_282,
    decks: 20,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 374, balcony: 650, suite: 1_400 },
    notableFeatures: [
      "BOLT roller coaster",
      "Golden Jubilee lounge",
      "Guy's Pig & Anchor",
    ],
  },
  {
    id: "mardi-gras",
    name: "Mardi Gras",
    cruiseLineId: "carnival",
    shipClass: "Excel",
    yearBuilt: 2021,
    grossTonnage: 180_800,
    passengerCapacity: 5_282,
    decks: 20,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 399, balcony: 680, suite: 1_500 },
    notableFeatures: [
      "BOLT roller coaster",
      "Emeril's Bistro 1396",
      "Family Harbor cabins",
    ],
  },
  {
    id: "carnival-horizon",
    name: "Carnival Horizon",
    cruiseLineId: "carnival",
    shipClass: "Vista",
    yearBuilt: 2018,
    grossTonnage: 133_500,
    passengerCapacity: 3_960,
    decks: 15,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 404, balcony: 620, suite: 1_300 },
    notableFeatures: [
      "Havana Cabana exclusive pool area",
      "SkyRide",
      "Dr. Seuss WaterWorks",
    ],
  },
  {
    id: "carnival-vista",
    name: "Carnival Vista",
    cruiseLineId: "carnival",
    shipClass: "Vista",
    yearBuilt: 2016,
    grossTonnage: 133_500,
    passengerCapacity: 3_954,
    decks: 15,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 404, balcony: 590, suite: 1_250 },
    notableFeatures: [
      "SkyRide aerial attraction",
      "IMAX Theater",
      "RedFrog Pub & Brewery",
    ],
  },

  // -------------------------------------------------------------------------
  // Norwegian Cruise Line
  // -------------------------------------------------------------------------
  {
    id: "norwegian-aqua",
    name: "Norwegian Aqua",
    cruiseLineId: "norwegian",
    shipClass: "Prima Plus",
    yearBuilt: 2025,
    grossTonnage: 156_300,
    passengerCapacity: 3_571,
    decks: 20,
    homePorts: ["Port Canaveral, FL", "Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 909, balcony: 1_350, suite: 3_200 },
    notableFeatures: [
      "Aqua Slidecoaster (world's 1st hybrid coaster)",
      "Glow Court",
      "Swirl Wine Bar",
    ],
  },
  {
    id: "norwegian-luna",
    name: "Norwegian Luna",
    cruiseLineId: "norwegian",
    shipClass: "Prima Plus",
    yearBuilt: 2026,
    grossTonnage: 156_300,
    passengerCapacity: 3_550,
    decks: 20,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 909, balcony: 1_300, suite: 3_200 },
    notableFeatures: [
      "Aqua Slidecoaster",
      "Indulge Food Hall",
      "Expansive Infinity Beach",
    ],
  },
  {
    id: "norwegian-prima",
    name: "Norwegian Prima",
    cruiseLineId: "norwegian",
    shipClass: "Prima",
    yearBuilt: 2022,
    grossTonnage: 142_500,
    passengerCapacity: 3_099,
    decks: 20,
    homePorts: ["Port Canaveral, FL", "San Juan, PR"],
    regions: ["caribbean"],
    fare7Night: { inside: 779, balcony: 1_150, suite: 2_800 },
    notableFeatures: [
      "Prima Speedway (go-karts)",
      "The Drop dry slide",
      "Ocean Boulevard",
    ],
  },
  {
    id: "norwegian-viva",
    name: "Norwegian Viva",
    cruiseLineId: "norwegian",
    shipClass: "Prima",
    yearBuilt: 2023,
    grossTonnage: 142_500,
    passengerCapacity: 3_219,
    decks: 20,
    homePorts: ["San Juan, PR", "Galveston, TX"],
    regions: ["caribbean"],
    fare7Night: { inside: 800, balcony: 1_200, suite: 2_900 },
    notableFeatures: [
      "3-story racetrack",
      "Beetlejuice musical",
      "Indulge Food Hall",
    ],
  },
  {
    id: "norwegian-encore",
    name: "Norwegian Encore",
    cruiseLineId: "norwegian",
    shipClass: "Breakaway Plus",
    yearBuilt: 2019,
    grossTonnage: 169_116,
    passengerCapacity: 3_958,
    decks: 20,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 789, balcony: 1_050, suite: 2_600 },
    notableFeatures: [
      "Encore Speedway",
      "Galaxy Pavilion (VR laser tag)",
      "The Haven enclave",
    ],
  },

  // -------------------------------------------------------------------------
  // MSC Cruises
  // -------------------------------------------------------------------------
  {
    id: "msc-world-america",
    name: "MSC World America",
    cruiseLineId: "msc",
    shipClass: "World",
    yearBuilt: 2025,
    grossTonnage: 215_863,
    passengerCapacity: 6_762,
    decks: 22,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 478, balcony: 642, suite: 1_115 },
    notableFeatures: [
      "Cliffhanger swing ride",
      "Family Aventura district",
      "The Harbour",
      "LNG power",
    ],
  },
  {
    id: "msc-seascape",
    name: "MSC Seascape",
    cruiseLineId: "msc",
    shipClass: "Seaside EVO",
    yearBuilt: 2022,
    grossTonnage: 170_412,
    passengerCapacity: 4_540,
    decks: 20,
    homePorts: ["Galveston, TX"],
    regions: ["caribbean"],
    fare7Night: { inside: 359, balcony: 550, suite: 1_200 },
    notableFeatures: [
      "Robotron amusement ride",
      "Marina Pool",
      "Glass-floored Bridge of Sighs",
    ],
  },
  {
    id: "msc-seashore",
    name: "MSC Seashore",
    cruiseLineId: "msc",
    shipClass: "Seaside EVO",
    yearBuilt: 2021,
    grossTonnage: 170_412,
    passengerCapacity: 4_540,
    decks: 20,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    // 3-night fares scaled to 7-night: $199 → ~$465, $350 → ~$817, $900 → ~$2,100
    fare7Night: { inside: 465, balcony: 817, suite: 2_100 },
    notableFeatures: [
      "Infinity aft pool",
      "Expansive waterfront boardwalk",
      "MSC Yacht Club",
    ],
  },
  {
    id: "msc-meraviglia",
    name: "MSC Meraviglia",
    cruiseLineId: "msc",
    shipClass: "Meraviglia",
    yearBuilt: 2017,
    grossTonnage: 171_598,
    passengerCapacity: 4_488,
    decks: 19,
    homePorts: ["New York (Brooklyn), NY"],
    regions: ["caribbean"],
    fare7Night: { inside: 484, balcony: 650, suite: 1_100 },
    notableFeatures: [
      "LED dome promenade",
      "Polar aqua park",
      "F1 simulators",
    ],
  },
  {
    id: "msc-seaside",
    name: "MSC Seaside",
    cruiseLineId: "msc",
    shipClass: "Seaside",
    yearBuilt: 2017,
    grossTonnage: 169_400,
    passengerCapacity: 4_132,
    decks: 20,
    homePorts: ["Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 471, balcony: 600, suite: 1_050 },
    notableFeatures: [
      "Miami beach condo design",
      "Multi-story waterpark",
      "Waterfront promenade",
    ],
  },

  // -------------------------------------------------------------------------
  // Celebrity Cruises
  // -------------------------------------------------------------------------
  {
    id: "celebrity-xcel",
    name: "Celebrity Xcel",
    cruiseLineId: "celebrity",
    shipClass: "Edge",
    yearBuilt: 2025,
    grossTonnage: 141_420,
    passengerCapacity: 3_260,
    decks: 17,
    homePorts: ["Ft. Lauderdale, FL", "Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_100, balcony: 1_600, suite: 3_387 },
    notableFeatures: [
      "Magic Carpet",
      "Daniel Boulud's Le Voyage",
      "The Retreat",
      "Updated Grand Plaza",
    ],
  },
  {
    id: "celebrity-ascent",
    name: "Celebrity Ascent",
    cruiseLineId: "celebrity",
    shipClass: "Edge",
    yearBuilt: 2023,
    grossTonnage: 140_600,
    passengerCapacity: 3_260,
    decks: 17,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_050, balcony: 1_500, suite: 3_200 },
    notableFeatures: [
      "The Annex private entertainment space",
      "Expanded Sunset Bar",
      "Infinite Verandas",
    ],
  },
  {
    id: "celebrity-beyond",
    name: "Celebrity Beyond",
    cruiseLineId: "celebrity",
    shipClass: "Edge",
    yearBuilt: 2022,
    grossTonnage: 141_420,
    passengerCapacity: 3_260,
    decks: 17,
    homePorts: ["Miami, FL", "Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 667, balcony: 1_028, suite: 3_106 },
    notableFeatures: [
      "Expanded length",
      "2-story Sunset Bar",
      "Le Voyage",
      "Magic Carpet",
    ],
  },
  {
    id: "celebrity-apex",
    name: "Celebrity Apex",
    cruiseLineId: "celebrity",
    shipClass: "Edge",
    yearBuilt: 2020,
    grossTonnage: 130_818,
    passengerCapacity: 2_910,
    decks: 16,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 850, balcony: 1_028, suite: 3_100 },
    notableFeatures: [
      "Eden immersive venue",
      "Infinite Verandas",
      "Rooftop Garden",
    ],
  },
  {
    id: "celebrity-reflection",
    name: "Celebrity Reflection",
    cruiseLineId: "celebrity",
    shipClass: "Solstice",
    yearBuilt: 2012,
    grossTonnage: 126_000,
    passengerCapacity: 3_046,
    decks: 15,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    // 3-night fares scaled to 7-night: $400 → ~$933, $750 → ~$1,750, $1,800 → ~$4,200
    fare7Night: { inside: 933, balcony: 1_750, suite: 4_200 },
    notableFeatures: [
      "The Lawn Club (real grass deck)",
      "AquaClass spa cabins",
      "Glass showers",
    ],
  },

  // -------------------------------------------------------------------------
  // Princess Cruises
  // -------------------------------------------------------------------------
  {
    id: "star-princess",
    name: "Star Princess",
    cruiseLineId: "princess",
    shipClass: "Sphere",
    yearBuilt: 2025,
    grossTonnage: 175_500,
    passengerCapacity: 4_300,
    decks: 21,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 549, balcony: 850, suite: 1_600 },
    notableFeatures: [
      "The Dome (glass-enclosed terrace)",
      "Love by Britto dining",
      "Sanctuary Collection",
    ],
  },
  {
    id: "sun-princess",
    name: "Sun Princess",
    cruiseLineId: "princess",
    shipClass: "Sphere",
    yearBuilt: 2024,
    grossTonnage: 175_500,
    passengerCapacity: 4_300,
    decks: 21,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 549, balcony: 850, suite: 1_600 },
    notableFeatures: [
      "Spellbound magic venue",
      "The Dome",
      "3-story Piazza",
      "Umai Teppanyaki",
    ],
  },
  {
    id: "sky-princess",
    name: "Sky Princess",
    cruiseLineId: "princess",
    shipClass: "Royal",
    yearBuilt: 2019,
    grossTonnage: 144_650,
    passengerCapacity: 3_660,
    decks: 19,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 464, balcony: 700, suite: 1_400 },
    notableFeatures: [
      "Sky Suites (largest balconies at sea)",
      "Catch by Rudi",
      "MedallionNet",
    ],
  },
  {
    id: "enchanted-princess",
    name: "Enchanted Princess",
    cruiseLineId: "princess",
    shipClass: "Royal",
    yearBuilt: 2020,
    grossTonnage: 144_650,
    passengerCapacity: 3_660,
    decks: 19,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 444, balcony: 650, suite: 1_350 },
    notableFeatures: [
      "Infinity-style wake pool",
      "Chef's Table Lumiere",
    ],
  },
  {
    id: "regal-princess",
    name: "Regal Princess",
    cruiseLineId: "princess",
    shipClass: "Royal",
    yearBuilt: 2014,
    grossTonnage: 142_229,
    passengerCapacity: 3_560,
    decks: 19,
    homePorts: ["Galveston, TX", "Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 444, balcony: 600, suite: 1_200 },
    notableFeatures: [
      "Overwater SeaWalk",
      "WaterColor Fantasy show",
      "Princess Live!",
    ],
  },

  // -------------------------------------------------------------------------
  // Holland America Line
  // -------------------------------------------------------------------------
  {
    id: "nieuw-statendam",
    name: "Nieuw Statendam",
    cruiseLineId: "holland-america",
    shipClass: "Pinnacle",
    yearBuilt: 2018,
    grossTonnage: 99_902,
    passengerCapacity: 2_666,
    decks: 12,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 579, balcony: 1_099, suite: 1_499 },
    notableFeatures: [
      "Music Walk",
      "Rolling Stone Lounge",
      "Sel de Mer",
      "Grand Dutch Cafe",
    ],
  },
  {
    id: "rotterdam",
    name: "Rotterdam",
    cruiseLineId: "holland-america",
    shipClass: "Pinnacle",
    yearBuilt: 2021,
    grossTonnage: 99_902,
    passengerCapacity: 2_668,
    decks: 12,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 650, balcony: 1_200, suite: 1_800 },
    notableFeatures: [
      "Music Walk",
      "B.B. King's Blues Club",
      "Tamarind Pan-Asian dining",
    ],
  },
  {
    id: "koningsdam",
    name: "Koningsdam",
    cruiseLineId: "holland-america",
    shipClass: "Pinnacle",
    yearBuilt: 2016,
    grossTonnage: 99_863,
    passengerCapacity: 2_650,
    decks: 13,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 600, balcony: 1_099, suite: 1_600 },
    notableFeatures: [
      "Blend wine tasting",
      "World Stage",
      "Nami Sushi",
      "Club Orange",
    ],
  },
  {
    id: "eurodam",
    name: "Eurodam",
    cruiseLineId: "holland-america",
    shipClass: "Signature",
    yearBuilt: 2008,
    grossTonnage: 86_273,
    passengerCapacity: 2_104,
    decks: 11,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_014, balcony: 1_279, suite: 2_299 },
    notableFeatures: [
      "Morimoto by Sea",
      "Pinnacle Grill steakhouse",
      "High Score! game room",
    ],
  },
  {
    id: "nieuw-amsterdam",
    name: "Nieuw Amsterdam",
    cruiseLineId: "holland-america",
    shipClass: "Signature",
    yearBuilt: 2010,
    grossTonnage: 86_700,
    passengerCapacity: 2_106,
    decks: 11,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 799, balcony: 1_100, suite: 1_900 },
    notableFeatures: [
      "B.B. King's Blues Club",
      "Morimoto by Sea",
      "Tamarind",
    ],
  },

  // -------------------------------------------------------------------------
  // Disney Cruise Line
  // -------------------------------------------------------------------------
  {
    id: "disney-destiny",
    name: "Disney Destiny",
    cruiseLineId: "disney",
    shipClass: "Wish",
    yearBuilt: 2025,
    grossTonnage: 144_000,
    passengerCapacity: 4_000,
    decks: 15,
    homePorts: ["Ft. Lauderdale, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_309, balcony: 1_800, suite: 4_000 },
    notableFeatures: [
      "Heroes & Villains theme",
      "LNG power",
      "Marvel dining experiences",
    ],
  },
  {
    id: "disney-treasure",
    name: "Disney Treasure",
    cruiseLineId: "disney",
    shipClass: "Wish",
    yearBuilt: 2024,
    grossTonnage: 144_256,
    passengerCapacity: 4_000,
    decks: 15,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_645, balcony: 2_200, suite: 5_000 },
    notableFeatures: [
      "Haunted Mansion Parlor",
      "Plaza de Coco",
      "AquaMouse coaster",
    ],
  },
  {
    id: "disney-wish",
    name: "Disney Wish",
    cruiseLineId: "disney",
    shipClass: "Wish",
    yearBuilt: 2022,
    grossTonnage: 144_000,
    passengerCapacity: 4_000,
    decks: 15,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    // 3-night fares scaled to 7-night: $1,100 → ~$2,567, $1,500 → ~$3,500, $3,500 → ~$8,167
    fare7Night: { inside: 2_567, balcony: 3_500, suite: 8_167 },
    notableFeatures: [
      "Star Wars Hyperspace Lounge",
      "AquaMouse",
      "Arendelle dining",
    ],
  },
  {
    id: "disney-fantasy",
    name: "Disney Fantasy",
    cruiseLineId: "disney",
    shipClass: "Dream",
    yearBuilt: 2012,
    grossTonnage: 129_690,
    passengerCapacity: 4_000,
    decks: 14,
    homePorts: ["Port Canaveral, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_500, balcony: 1_900, suite: 4_200 },
    notableFeatures: [
      "AquaDuck water coaster",
      "Pixar Day at Sea",
      "Animator's Palate",
    ],
  },
  {
    id: "disney-dream",
    name: "Disney Dream",
    cruiseLineId: "disney",
    shipClass: "Dream",
    yearBuilt: 2011,
    grossTonnage: 129_690,
    passengerCapacity: 4_000,
    decks: 14,
    homePorts: ["Ft. Lauderdale, FL", "San Juan, PR"],
    regions: ["caribbean"],
    fare7Night: { inside: 1_400, balcony: 1_800, suite: 4_000 },
    notableFeatures: [
      "AquaDuck",
      "Refurbished Oceaneer Club",
      "New funnel suites",
    ],
  },

  // -------------------------------------------------------------------------
  // Virgin Voyages
  // -------------------------------------------------------------------------
  {
    id: "brilliant-lady",
    name: "Brilliant Lady",
    cruiseLineId: "virgin-voyages",
    shipClass: "Lady",
    yearBuilt: 2025,
    grossTonnage: 110_000,
    passengerCapacity: 2_770,
    decks: 17,
    homePorts: ["Miami, FL", "San Juan, PR"],
    regions: ["caribbean"],
    fare7Night: { inside: 595, balcony: 945, suite: 2_268 },
    notableFeatures: [
      "Rojo by Razzle Dazzle",
      "16-night Panama Canal transit",
      "RockStar Quarters",
    ],
  },
  {
    id: "resilient-lady",
    name: "Resilient Lady",
    cruiseLineId: "virgin-voyages",
    shipClass: "Lady",
    yearBuilt: 2023,
    grossTonnage: 110_000,
    passengerCapacity: 2_770,
    decks: 17,
    homePorts: ["San Juan, PR", "Miami, FL"],
    regions: ["caribbean"],
    fare7Night: { inside: 595, balcony: 945, suite: 2_200 },
    notableFeatures: [
      "The Manor night club",
      "The Dock outdoor lounge",
      "Scarlet Night party",
    ],
  },
  {
    id: "valiant-lady",
    name: "Valiant Lady",
    cruiseLineId: "virgin-voyages",
    shipClass: "Lady",
    yearBuilt: 2022,
    grossTonnage: 110_000,
    passengerCapacity: 2_770,
    decks: 17,
    homePorts: ["Miami, FL", "San Juan, PR"],
    regions: ["caribbean"],
    fare7Night: { inside: 595, balcony: 945, suite: 2_200 },
    notableFeatures: [
      "Test Kitchen",
      "Gunbae (Korean BBQ)",
      "Redemption Spa",
    ],
  },
  {
    id: "scarlet-lady",
    name: "Scarlet Lady",
    cruiseLineId: "virgin-voyages",
    shipClass: "Lady",
    yearBuilt: 2020,
    grossTonnage: 110_000,
    passengerCapacity: 2_770,
    decks: 17,
    homePorts: ["Miami, FL", "San Juan, PR"],
    regions: ["caribbean"],
    fare7Night: { inside: 595, balcony: 945, suite: 2_200 },
    notableFeatures: [
      "The Wake restaurant",
      "Squid Ink tattoo parlor",
      "Richard's Rooftop",
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Returns all ships for a given cruise line ID. */
export function getShipsByLine(cruiseLineId: string): ShipData[] {
  return SHIPS.filter((ship) => ship.cruiseLineId === cruiseLineId);
}

/** Returns a single ship by its unique ID, or undefined if not found. */
export function getShipById(shipId: string): ShipData | undefined {
  return SHIPS.find((ship) => ship.id === shipId);
}
