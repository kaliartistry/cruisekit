/* ------------------------------------------------------------------ */
/*  Cruise Port Data — 66 Ports                                        */
/* ------------------------------------------------------------------ */

export type PortRegion = "western" | "eastern" | "southern" | "bahamas" | "alaska" | "europe-med" | "europe-north" | "homeport" | "private-island" | "asia";

export interface PortExcursion {
  name: string;
  priceRange: { min: number; max: number };
  typicalDuration: string;
}

export interface PortFreeActivity {
  name: string;
  description: string;
}

export interface PortRestaurant {
  name: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
}

export interface PortData {
  slug: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  timezone: string;
  safetyRating: number;
  walkabilityRating: number;
  isTenderPort: boolean;
  typicalPortHours: number;
  walkingDistanceToTown: string;
  currency: string;
  usdAccepted: boolean;
  wifiAvailability: "none" | "limited" | "good" | "excellent";
  cellularCoverage: "none" | "limited" | "good" | "excellent";
  overview: string;
  timeZoneAlert: string | null;
  excursionCategories: PortExcursion[];
  freeActivities: PortFreeActivity[];
  restaurants: PortRestaurant[];
  gettingAround: string;
  emergencyInfo: {
    police: string;
    hospital: string;
    usConsulate?: string;
  };
  region: PortRegion;
  imageUrl: string;
}

export const PORTS: PortData[] = [
  /* ================================================================ */
  /*  1. Cozumel, Mexico                                              */
  /* ================================================================ */
  {
    slug: "cozumel",
    name: "Cozumel",
    country: "Mexico",
    coordinates: { lat: 20.4318, lng: -86.9203 },
    timezone: "EST (no DST)",
    safetyRating: 8.5,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "15-20 min from southern piers to San Miguel",
    currency: "MXN",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Cozumel is Mexico's largest Caribbean island and one of the world's top diving destinations. The island features stunning coral reefs, Mayan ruins, and a laid-back downtown area called San Miguel. Most cruise ships dock at the southern piers, a fair distance from town.",
    timeZoneAlert:
      "Cozumel does NOT observe Daylight Saving Time. In summer (Mar-Nov) it is 1 hour behind Florida/Eastern Time. Double-check your all-aboard time!",
    excursionCategories: [
      { name: "Tulum Ruins (ferry + bus)", priceRange: { min: 80, max: 120 }, typicalDuration: "6-7 hours" },
      { name: "Beach Club Day Pass", priceRange: { min: 40, max: 70 }, typicalDuration: "3-5 hours" },
      { name: "Atlantis Submarine", priceRange: { min: 105, max: 105 }, typicalDuration: "2 hours" },
      { name: "San Gervasio Mayan Ruins", priceRange: { min: 40, max: 50 }, typicalDuration: "2-3 hours" },
      { name: "Snorkeling Reef Tour", priceRange: { min: 40, max: 60 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "San Miguel Walking Tour", description: "Stroll the colorful downtown streets, browse shops, and soak in the authentic Mexican atmosphere." },
      { name: "Zocalo (Town Square)", description: "The central plaza with benches, Wi-Fi, and local vendors. A great spot to people-watch." },
      { name: "Museo de la Isla de Cozumel", description: "Small island history museum near the waterfront (~$4 entry). Learn about Mayan heritage and marine ecosystems." },
    ],
    restaurants: [
      { name: "Pancho's Backyard", priceRange: "$$" },
      { name: "La Mission", priceRange: "$$" },
      { name: "La Choza", priceRange: "$" },
    ],
    gettingAround:
      "Taxis use fixed-rate pricing — $8 USD from the cruise port to San Miguel town center. Rates are posted at the pier. Negotiate before boarding. Renting a scooter ($25-35/day) is popular for exploring the island's east side.",
    emergencyInfo: {
      police: "911",
      hospital: "CMC Hospital — Calle 1 Sur",
      usConsulate: "(52) 872-4574 (Consular Agency Cozumel)",
    },
    region: "western",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/cozumel-mexico/1920x1080.jpg",
  },

  /* ================================================================ */
  /*  2. Nassau, Bahamas                                              */
  /* ================================================================ */
  {
    slug: "nassau",
    name: "Nassau",
    country: "Bahamas",
    coordinates: { lat: 25.0343, lng: -77.3963 },
    timezone: "EST/EDT",
    safetyRating: 6.5,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "5 min walk to Bay Street",
    currency: "BSD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Nassau is the vibrant capital of the Bahamas, offering a mix of colonial history, lively markets, and stunning beaches. The cruise port is right downtown, making it one of the most walkable Caribbean stops. Paradise Island and the Atlantis resort are just a bridge away.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Atlantis Aquaventure Waterpark", priceRange: { min: 100, max: 200 }, typicalDuration: "4-6 hours" },
      { name: "Blue Lagoon Island", priceRange: { min: 70, max: 150 }, typicalDuration: "4-5 hours" },
      { name: "Pearl Island Beach Escape", priceRange: { min: 80, max: 80 }, typicalDuration: "4-5 hours" },
      { name: "John Watling's Rum Distillery", priceRange: { min: 20, max: 20 }, typicalDuration: "1-2 hours" },
      { name: "Dolphin Encounter", priceRange: { min: 100, max: 200 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Junkanoo Beach", description: "The closest public beach to the cruise port — walk west along Bay Street for about 15 minutes." },
      { name: "Queen's Staircase", description: "Sixty-six steps carved from solid limestone in the late 1700s, shaded by tropical canopy." },
      { name: "Straw Market", description: "A bustling open-air market selling handmade crafts, straw bags, and souvenirs. Haggling is expected." },
    ],
    restaurants: [
      { name: "Fish Fry at Arawak Cay", priceRange: "$" },
      { name: "Graycliff Restaurant", priceRange: "$$$$" },
      { name: "Salty Dog Sea Grille", priceRange: "$$" },
    ],
    gettingAround:
      "Taxi to Atlantis/Paradise Island is $10-15 per person. Water taxis to Paradise Island run $5 each way. Jitney buses cover the island for $1.25. Walking downtown is easy and the best way to explore Bay Street.",
    emergencyInfo: {
      police: "911 or 919",
      hospital: "Princess Margaret Hospital — Shirley Street",
      usConsulate: "(242) 322-1181",
    },
    region: "bahamas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Beaches_in_Nassau%2C_Bahamas.jpg",
  },

  /* ================================================================ */
  /*  3. Grand Cayman                                                 */
  /* ================================================================ */
  {
    slug: "grand-cayman",
    name: "Grand Cayman",
    country: "Cayman Islands",
    coordinates: { lat: 19.3133, lng: -81.2546 },
    timezone: "EST (no DST)",
    safetyRating: 9.5,
    walkabilityRating: 8,
    isTenderPort: true,
    typicalPortHours: 7,
    walkingDistanceToTown: "5 min tender ride + 5 min walk to George Town",
    currency: "KYD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Grand Cayman is one of the safest and most polished Caribbean ports. George Town is compact and walkable, with duty-free shopping and waterfront restaurants. The island is best known for Stingray City, Seven Mile Beach, and crystal-clear waters.",
    timeZoneAlert:
      "Grand Cayman does NOT observe DST. In summer it is 1 hour behind Florida/Eastern Time. Verify your ship's time zone before heading out.",
    excursionCategories: [
      { name: "Stingray City Sandbar", priceRange: { min: 60, max: 100 }, typicalDuration: "2-3 hours" },
      { name: "Seven Mile Beach Day", priceRange: { min: 15, max: 30 }, typicalDuration: "3-5 hours" },
      { name: "Cayman Turtle Centre", priceRange: { min: 40, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "Crystal Caves", priceRange: { min: 50, max: 70 }, typicalDuration: "1.5-2 hours" },
      { name: "Snorkeling at Eden Rock", priceRange: { min: 30, max: 50 }, typicalDuration: "1-2 hours" },
    ],
    freeActivities: [
      { name: "George Town Walking Tour", description: "Explore colorful Caribbean architecture, duty-free shops, and the waterfront promenade." },
      { name: "Heroes Square", description: "Central plaza honoring Caymanian heroes, with historic buildings and shaded benches." },
      { name: "Fort George Ruins", description: "Remains of an 18th-century fort with harbor views — a quick 5-minute photo stop." },
    ],
    restaurants: [
      { name: "Breezes by the Bay", priceRange: "$$" },
      { name: "Casanova by the Sea", priceRange: "$$$" },
      { name: "Guy's Beach Bar", priceRange: "$" },
    ],
    gettingAround:
      "Public buses run along the main road for $2.50 CI. Taxis are plentiful but pricey — $20+ to Seven Mile Beach. Shared shuttle options are available for popular spots. This is a tender port, so allow extra time for the boat ride to shore.",
    emergencyInfo: {
      police: "911",
      hospital: "Health City Cayman Islands",
      usConsulate: "No US Consulate — nearest in Jamaica. UK Governor's Office: (345) 244-2401",
    },
    region: "western",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/george-town-grand-cayman/george-town-grand-cayman-stingray-city.jpg",
  },

  /* ================================================================ */
  /*  4. St. Thomas, USVI                                             */
  /* ================================================================ */
  {
    slug: "st-thomas",
    name: "St. Thomas",
    country: "U.S. Virgin Islands",
    coordinates: { lat: 18.3358, lng: -64.9307 },
    timezone: "AST (no DST)",
    safetyRating: 8.5,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "10-15 min walk to Charlotte Amalie from Crown Bay; 5 min from Havensight",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "St. Thomas is a U.S. territory, so no passport is needed for American citizens. Charlotte Amalie offers world-class duty-free shopping and historic Danish colonial architecture. The island's hilly terrain means taxis are common, but the harbor area is walkable.",
    timeZoneAlert:
      "St. Thomas is on AST (Atlantic Standard Time) year-round, which is the same as EDT. In winter, it is 1 hour ahead of EST. Check your ship schedule carefully.",
    excursionCategories: [
      { name: "Magens Bay Beach", priceRange: { min: 10, max: 25 }, typicalDuration: "3-5 hours" },
      { name: "Coral World Ocean Park", priceRange: { min: 25, max: 40 }, typicalDuration: "2-3 hours" },
      { name: "Ferry to St. John", priceRange: { min: 15, max: 30 }, typicalDuration: "4-6 hours" },
      { name: "Zip Lining at Tree Limin'", priceRange: { min: 100, max: 120 }, typicalDuration: "2-3 hours" },
      { name: "Kayak & Snorkel Eco Tour", priceRange: { min: 70, max: 90 }, typicalDuration: "3 hours" },
    ],
    freeActivities: [
      { name: "99 Steps", description: "Historic staircase built by the Danes in the 1700s. Climb to the top for panoramic harbor views." },
      { name: "Fort Christian", description: "The oldest standing structure in the USVI (1672), now a museum. Free to view from outside." },
      { name: "Main Street Shopping", description: "Window-shop the duty-free stores along Dronningens Gade — the deals are real." },
    ],
    restaurants: [
      { name: "Gladys' Cafe", priceRange: "$" },
      { name: "Greenhouse Restaurant", priceRange: "$$" },
      { name: "Amalia Cafe", priceRange: "$$$" },
    ],
    gettingAround:
      "Open-air safari taxis (shared trucks) run set routes for $2-4/person. Private taxis charge $10-15 to popular beaches. The island is hilly — wear comfortable shoes even for short walks. Two cruise docks: Havensight and Crown Bay.",
    emergencyInfo: {
      police: "911",
      hospital: "Schneider Regional Medical Center",
    },
    region: "eastern",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/charlotte-amalie-st-thomas/charlotte-amalie-st-thomas-magens-bay.jpg",
  },

  /* ================================================================ */
  /*  5. St. Maarten                                                  */
  /* ================================================================ */
  {
    slug: "st-maarten",
    name: "St. Maarten",
    country: "Sint Maarten / Saint-Martin",
    coordinates: { lat: 18.0425, lng: -63.0548 },
    timezone: "AST (no DST)",
    safetyRating: 9,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "5 min walk to Philipsburg from cruise pier",
    currency: "ANG / EUR",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "St. Maarten is unique: one island shared by two nations (Dutch and French). The cruise port is on the Dutch side in Philipsburg, with great beaches and duty-free shopping steps away. The French side offers European flair, topless beaches, and gourmet dining.",
    timeZoneAlert:
      "St. Maarten uses AST year-round. Same as EDT in summer. In winter it is 1 hour ahead of EST.",
    excursionCategories: [
      { name: "Maho Beach (Plane Spotting)", priceRange: { min: 15, max: 20 }, typicalDuration: "2-4 hours" },
      { name: "Orient Bay Beach", priceRange: { min: 20, max: 40 }, typicalDuration: "3-5 hours" },
      { name: "Loterie Farm Treetop Pool", priceRange: { min: 60, max: 80 }, typicalDuration: "3-4 hours" },
      { name: "12 Metre Sailing Regatta", priceRange: { min: 100, max: 120 }, typicalDuration: "3 hours" },
      { name: "Rhino Rider Power Boat", priceRange: { min: 60, max: 80 }, typicalDuration: "2 hours" },
    ],
    freeActivities: [
      { name: "Great Bay Beach", description: "Long stretch of sand right next to the cruise terminal. Lounge for free or rent a chair for $5." },
      { name: "Front Street Shopping", description: "Duty-free shopping along the Philipsburg boardwalk — jewelry, electronics, and liquor deals." },
      { name: "Courthouse & Historic Philipsburg", description: "Walk the old town center and see the 1793 Courthouse, the oldest in the Dutch Caribbean." },
    ],
    restaurants: [
      { name: "The Greenhouse", priceRange: "$$" },
      { name: "Ocean Lounge", priceRange: "$$$" },
      { name: "Chesterfield's", priceRange: "$$" },
    ],
    gettingAround:
      "Water taxis run from the pier to downtown Philipsburg for $7 round trip. Taxis to Maho Beach are $15-20 per person (fixed rate). Buses to the French side run $2-3. Rent a car ($40-50/day) to explore both sides of the island.",
    emergencyInfo: {
      police: "911 (Dutch side) / 17 (French side)",
      hospital: "St. Maarten Medical Center",
      usConsulate: "No US Consulate — nearest in Curacao",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Maho_Beach_Saint_Martin.jpg",
  },

  /* ================================================================ */
  /*  6. Roatan, Honduras                                             */
  /* ================================================================ */
  {
    slug: "roatan",
    name: "Roatan",
    country: "Honduras",
    coordinates: { lat: 16.3220, lng: -86.5287 },
    timezone: "CST (no DST)",
    safetyRating: 7,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "15 min walk to Mahogany Bay area; West End is 30 min by taxi",
    currency: "HNL",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Roatan is the largest of Honduras' Bay Islands, famous for its world-class diving, lush jungle, and budget-friendly excursions. The Mahogany Bay cruise port has its own beach, shops, and a chairlift to the waterfront. Venture beyond for incredible reef snorkeling.",
    timeZoneAlert:
      "Roatan is on CST and does NOT observe DST. In summer it is 2 hours behind Florida/Eastern Time. This is the biggest time gap of any major Caribbean port — triple-check your all-aboard time!",
    excursionCategories: [
      { name: "Sloth & Monkey Sanctuary", priceRange: { min: 40, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "West Bay Beach Day", priceRange: { min: 30, max: 50 }, typicalDuration: "3-5 hours" },
      { name: "Scuba Diving (2-tank)", priceRange: { min: 60, max: 90 }, typicalDuration: "3-4 hours" },
      { name: "Zip Line Canopy Tour", priceRange: { min: 60, max: 80 }, typicalDuration: "2-3 hours" },
      { name: "Glass-Bottom Boat", priceRange: { min: 25, max: 40 }, typicalDuration: "1-2 hours" },
    ],
    freeActivities: [
      { name: "Mahogany Beach", description: "15-minute walk (or free chairlift) from the cruise terminal to a public beach with calm waters." },
      { name: "Port Area Shopping", description: "Browse souvenir shops and local vendors in the Mahogany Bay complex." },
      { name: "Nature Walk", description: "Trails near the port area wind through tropical vegetation — keep an eye out for iguanas." },
    ],
    restaurants: [
      { name: "Herby's Sports Bar", priceRange: "$" },
      { name: "Ginger's Caribbean Grill", priceRange: "$$" },
      { name: "Vintage Pearl Restaurant", priceRange: "$$$" },
    ],
    gettingAround:
      "IMPORTANT: Confirm if taxi prices are per person or per taxi — it varies by driver and can cause nasty surprises. Taxi to West Bay Beach is $10-15 per person. Water taxis to West Bay run about $5. The port chairlift to the beach is free.",
    emergencyInfo: {
      police: "199",
      hospital: "Roatan Public Hospital — Coxen Hole",
      usConsulate: "No US Consulate — nearest in Tegucigalpa. Emergency: (504) 2236-9320",
    },
    region: "western",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/West_Bay_Beach_-Roatan_-Honduras-23May2009-g.jpg",
  },

  /* ================================================================ */
  /*  7. Aruba                                                        */
  /* ================================================================ */
  {
    slug: "aruba",
    name: "Aruba",
    country: "Aruba",
    coordinates: { lat: 12.5211, lng: -69.9683 },
    timezone: "AST (no DST)",
    safetyRating: 9.3,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "5 min walk to downtown Oranjestad",
    currency: "AWG",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Aruba is one of the safest islands in the Caribbean and sits outside the hurricane belt, so weather is almost always sunny. The cruise terminal is steps from colorful downtown Oranjestad. Eagle Beach consistently ranks among the world's best beaches.",
    timeZoneAlert:
      "Aruba uses AST year-round. Same as EDT in summer, 1 hour ahead of EST in winter.",
    excursionCategories: [
      { name: "Eagle Beach & Flamingos", priceRange: { min: 5, max: 10 }, typicalDuration: "3-5 hours" },
      { name: "Arikok National Park 4x4", priceRange: { min: 80, max: 120 }, typicalDuration: "4-5 hours" },
      { name: "Butterfly Farm", priceRange: { min: 20, max: 20 }, typicalDuration: "1 hour" },
      { name: "Snorkeling Catamaran", priceRange: { min: 50, max: 80 }, typicalDuration: "3-4 hours" },
      { name: "ATV Island Tour", priceRange: { min: 90, max: 130 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Solar-Powered Tram", description: "Free trolley that loops through downtown Oranjestad — hop on to see the colorful Dutch architecture." },
      { name: "Renaissance Marketplace", description: "Waterfront shopping and dining complex right next to the cruise port. Window-shop and enjoy the views." },
      { name: "Linear Park Walk", description: "Paved walking and biking path along the coast from the port toward Eagle Beach." },
    ],
    restaurants: [
      { name: "Driftwood Restaurant", priceRange: "$$" },
      { name: "The West Deck", priceRange: "$$" },
      { name: "Eduardo's Beach Shack", priceRange: "$" },
    ],
    gettingAround:
      "Arubus public buses run along the hotel strip for $2.50 one-way. Taxis are metered; downtown to Eagle Beach is about $10. The free solar tram loops through Oranjestad. Renting a car is easy ($40-50/day) for exploring Arikok and the rugged north coast.",
    emergencyInfo: {
      police: "100",
      hospital: "Dr. Horacio E. Oduber Hospital",
      usConsulate: "No US Consulate — nearest in Curacao: (599-9) 461-3066",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Divi_divi_tree_Eagle_Beach.jpg",
  },

  /* ================================================================ */
  /*  8. San Juan, Puerto Rico                                        */
  /* ================================================================ */
  {
    slug: "san-juan",
    name: "San Juan",
    country: "Puerto Rico (U.S.)",
    coordinates: { lat: 18.4655, lng: -66.1057 },
    timezone: "AST (no DST)",
    safetyRating: 8.5,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Immediate — you dock in Old San Juan",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "San Juan is one of the oldest cities in the Americas and a U.S. territory — no passport needed. The cruise port is right in the heart of Old San Juan, surrounded by 500-year-old fortresses, colorful colonial streets, and fantastic food. It's often a homeport for Caribbean itineraries.",
    timeZoneAlert:
      "Puerto Rico uses AST year-round. Same as EDT in summer. In winter, it is 1 hour ahead of EST.",
    excursionCategories: [
      { name: "El Yunque Rainforest", priceRange: { min: 80, max: 120 }, typicalDuration: "5-6 hours" },
      { name: "Bioluminescent Bay (Fajardo)", priceRange: { min: 100, max: 140 }, typicalDuration: "4-5 hours" },
      { name: "Bacardi Rum Distillery", priceRange: { min: 40, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "Food Walking Tour", priceRange: { min: 60, max: 90 }, typicalDuration: "2-3 hours" },
      { name: "Flamenco Beach (Culebra)", priceRange: { min: 120, max: 180 }, typicalDuration: "Full day" },
    ],
    freeActivities: [
      { name: "Paseo de la Princesa", description: "Stunning tree-lined promenade along the old city wall with fountains, art, and harbor views." },
      { name: "El Morro Fort Grounds", description: "The grounds outside Castillo San Felipe del Morro are free — fly a kite on the vast lawn with ocean views." },
      { name: "Old San Juan Streets", description: "Wander the iconic blue cobblestone streets, pastel buildings, and plazas of this 500-year-old city." },
    ],
    restaurants: [
      { name: "La Bombonera", priceRange: "$" },
      { name: "Marmalade", priceRange: "$$$" },
      { name: "El Jibarito", priceRange: "$" },
    ],
    gettingAround:
      "Old San Juan is best explored on foot. A free trolley runs between the port area and the main attractions. Taxis to Condado beach area cost $10-15. Uber/Lyft work throughout PR. For El Yunque, book a tour or rent a car ($40-50/day).",
    emergencyInfo: {
      police: "911",
      hospital: "Centro Medico — San Juan",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Modern_Skyline_of_San_Juan,_Puerto_Rico.jpg",
  },

  /* ================================================================ */
  /*  9. Key West, Florida                                            */
  /* ================================================================ */
  {
    slug: "key-west",
    name: "Key West",
    country: "United States",
    coordinates: { lat: 24.5551, lng: -81.7800 },
    timezone: "EST/EDT",
    safetyRating: 9.5,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Immediate — Mallory Square is at the pier",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Key West is the southernmost point in the continental U.S. and one of the most walkable cruise ports anywhere. Everything is within a 20-minute walk of the pier. The vibe is laid-back, quirky, and full of history — from Hemingway to Harry Truman. No passport needed.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Conch Tour Train / Trolley", priceRange: { min: 35, max: 40 }, typicalDuration: "1.5 hours" },
      { name: "Sunset Sailing Trip", priceRange: { min: 60, max: 90 }, typicalDuration: "2 hours" },
      { name: "Hemingway Home & Museum", priceRange: { min: 18, max: 18 }, typicalDuration: "1-1.5 hours" },
      { name: "Snorkeling at the Reef", priceRange: { min: 50, max: 70 }, typicalDuration: "3 hours" },
      { name: "Jet Ski Island Tour", priceRange: { min: 80, max: 120 }, typicalDuration: "1.5 hours" },
    ],
    freeActivities: [
      { name: "Southernmost Point Buoy", description: "The iconic red/yellow/black marker at the tip of the U.S. Great photo op — arrive early to beat lines." },
      { name: "Mallory Square Sunset", description: "Nightly sunset celebration with street performers, food vendors, and artists. Starts 2 hours before sunset." },
      { name: "Duval Street Walk", description: "Key West's famous mile-long main drag — bars, galleries, shops, and people-watching galore." },
    ],
    restaurants: [
      { name: "Blue Heaven", priceRange: "$$" },
      { name: "El Meson de Pepe", priceRange: "$$" },
      { name: "Garbo's Grill", priceRange: "$" },
    ],
    gettingAround:
      "Key West is best on foot or by bicycle. Rent a bike for $15-20/day. The Conch Tour Train ($40) and Old Town Trolley ($40) offer hop-on/hop-off service. Duval Street is the main artery. Everything you want is within a 20-minute walk of the pier.",
    emergencyInfo: {
      police: "911",
      hospital: "Lower Keys Medical Center",
    },
    region: "western",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/key/key-west-florida-southernmost-point.jpg",
  },

  /* ================================================================ */
  /*  10. Grand Turk                                                  */
  /* ================================================================ */
  {
    slug: "grand-turk",
    name: "Grand Turk",
    country: "Turks & Caicos",
    coordinates: { lat: 21.4674, lng: -71.1389 },
    timezone: "EST/EDT",
    safetyRating: 9,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "20-25 min walk to Cockburn Town",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Grand Turk is a tiny, sleepy island that sees most of its visitors from cruise ships. The Carnival-built cruise center has a pool, beach, shops, and a Margaritaville. Beyond the center, the island offers incredible wall diving, historic Cockburn Town, and wild horses.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Stingray Encounter", priceRange: { min: 60, max: 100 }, typicalDuration: "2 hours" },
      { name: "Scuba Diving (Wall)", priceRange: { min: 100, max: 150 }, typicalDuration: "3-4 hours" },
      { name: "Island Safari Tour", priceRange: { min: 60, max: 70 }, typicalDuration: "2-3 hours" },
      { name: "Whale Watching (seasonal)", priceRange: { min: 70, max: 90 }, typicalDuration: "2-3 hours" },
      { name: "Horseback Beach Ride", priceRange: { min: 80, max: 100 }, typicalDuration: "1.5 hours" },
    ],
    freeActivities: [
      { name: "Cruise Center Beach", description: "Large beach with lounge chairs right at the cruise terminal. The water is crystal clear and the reef is close." },
      { name: "NASA / John Glenn Exhibit", description: "Small museum at the cruise center commemorating the 1962 Mercury space capsule recovery near Grand Turk." },
      { name: "Cockburn Town Walk", description: "20-minute walk to the colonial capital with 200-year-old stone buildings and the Turks & Caicos National Museum." },
    ],
    restaurants: [
      { name: "Jack's Shack Beach Bar", priceRange: "$" },
      { name: "Margaritaville", priceRange: "$$" },
      { name: "Beached Whale", priceRange: "$$" },
    ],
    gettingAround:
      "The island is very small. Taxis are available at the port for $5-10 to most spots. Golf carts can be rented for $60-80/day. Walking to Cockburn Town takes 20-25 minutes along the coast road. The cruise center itself has plenty to keep you busy.",
    emergencyInfo: {
      police: "911",
      hospital: "Grand Turk Hospital",
      usConsulate: "No US Consulate — nearest in Nassau, Bahamas",
    },
    region: "eastern",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/ports-and-destinations/ports/grand-turk-turks-caicos/overview/grand-turk-island-coast.jpg",
  },

  /* ================================================================ */
  /*  11. Costa Maya, Mexico                                          */
  /* ================================================================ */
  {
    slug: "costa-maya",
    name: "Costa Maya",
    country: "Mexico",
    coordinates: { lat: 18.7291, lng: -87.6940 },
    timezone: "EST (no DST)",
    safetyRating: 8,
    walkabilityRating: 2,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Mahahual village is a $5 taxi ride (3 km)",
    currency: "MXN",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Costa Maya's port is a purpose-built cruise complex on Mexico's remote southern Caribbean coast. The port itself has a pool, shops, and restaurants, but the real draw is the laid-back village of Mahahual and easy access to Mayan ruins like Chacchoben.",
    timeZoneAlert:
      "Costa Maya does NOT observe DST. In summer it is 1 hour behind Florida/Eastern Time.",
    excursionCategories: [
      { name: "Chacchoben Mayan Ruins", priceRange: { min: 60, max: 90 }, typicalDuration: "4-5 hours" },
      { name: "Beach Break at Mahahual", priceRange: { min: 15, max: 30 }, typicalDuration: "3-5 hours" },
      { name: "Bacalar Lagoon (7 Colors)", priceRange: { min: 80, max: 120 }, typicalDuration: "5-6 hours" },
      { name: "Snorkeling Reef Tour", priceRange: { min: 40, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "Kayak & Paddleboard", priceRange: { min: 30, max: 50 }, typicalDuration: "2 hours" },
    ],
    freeActivities: [
      { name: "Port Complex Pool", description: "Large swimming pool right at the cruise terminal — free for cruise passengers." },
      { name: "Mahahual Boardwalk", description: "Short taxi ride to the village boardwalk (malecon) with beach access and local atmosphere." },
      { name: "Beach Walking", description: "The coastline near the port has calm, clear waters perfect for wading." },
    ],
    restaurants: [
      { name: "Nacional Beach Club", priceRange: "$$" },
      { name: "Tropicante", priceRange: "$" },
      { name: "Krazy Lobster", priceRange: "$$" },
    ],
    gettingAround:
      "Taxis from the port to Mahahual village cost about $5 per person. The port complex itself is walkable. For Chacchoben ruins, you'll need a tour ($60-90). There's not much public transport — taxis and tours are the main options.",
    emergencyInfo: {
      police: "911",
      hospital: "Centro de Salud Mahahual (basic clinic)",
      usConsulate: "(52) 872-4574 (Consular Agency — shared with Cozumel)",
    },
    region: "western",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Costa_maya_beach.jpg",
  },

  /* ================================================================ */
  /*  12. Progreso, Mexico                                            */
  /* ================================================================ */
  {
    slug: "progreso",
    name: "Progreso",
    country: "Mexico",
    coordinates: { lat: 21.2808, lng: -89.6630 },
    timezone: "CST (no DST)",
    safetyRating: 8,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "10 min walk from the pier head (long pier)",
    currency: "MXN",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Progreso is the gateway to the Yucatan interior, home to Merida and the iconic Chichen Itza. The port features one of the longest piers in the world (4 miles). The town itself is a quiet Mexican beach community with authentic local flavor.",
    timeZoneAlert:
      "Progreso is on CST and does NOT observe DST. In summer it is 2 hours behind Florida. Double-check your all-aboard time!",
    excursionCategories: [
      { name: "Chichen Itza Day Trip", priceRange: { min: 80, max: 130 }, typicalDuration: "7-8 hours" },
      { name: "Merida City Tour", priceRange: { min: 40, max: 70 }, typicalDuration: "4-5 hours" },
      { name: "Cenote Swimming", priceRange: { min: 40, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Uxmal Ruins", priceRange: { min: 70, max: 100 }, typicalDuration: "5-6 hours" },
      { name: "Beach Day in Progreso", priceRange: { min: 10, max: 20 }, typicalDuration: "3-5 hours" },
    ],
    freeActivities: [
      { name: "Progreso Malecon", description: "Waterfront boardwalk with ocean views, local food stalls, and a relaxed atmosphere." },
      { name: "Town Square", description: "Central plaza with a church, shaded benches, and local vendors selling Yucatecan snacks." },
      { name: "Beach Walking", description: "Wide sandy beaches extend in both directions from the pier — calm, shallow waters." },
    ],
    restaurants: [
      { name: "Eladio's Bar", priceRange: "$" },
      { name: "Flamingos Restaurant", priceRange: "$$" },
      { name: "Casa de los Abuelos", priceRange: "$" },
    ],
    gettingAround:
      "A shuttle bus runs the 4-mile pier to shore. Taxis wait at the pier head — $20-30 to Merida. For Chichen Itza, a tour is essential (3-hour drive each way). Walking around Progreso town is easy and flat.",
    emergencyInfo: {
      police: "911",
      hospital: "Hospital General de Progreso",
      usConsulate: "(999) 942-5700 (US Consulate in Merida)",
    },
    region: "western",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Yucat%C3%A1n,_Progreso_de_Castro,_its_beach_and_the_pier.jpg",
  },

  /* ================================================================ */
  /*  13. CocoCay, Bahamas (Royal Caribbean Private Island)           */
  /* ================================================================ */
  {
    slug: "cococay",
    name: "Perfect Day at CocoCay",
    country: "Bahamas (Private Island)",
    coordinates: { lat: 25.7820, lng: -77.9200 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "N/A — private island, everything is within walking distance",
    currency: "USD (ship card)",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "limited",
    overview:
      "CocoCay is Royal Caribbean's private island in the Berry Islands chain. After a $250 million transformation, it features Thrill Waterpark, an enormous freshwater pool, zip lines, a hot-air balloon ride, and multiple beach areas. All food and basic beach access are included.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Thrill Waterpark", priceRange: { min: 80, max: 100 }, typicalDuration: "All day" },
      { name: "Up, Up and Away Balloon", priceRange: { min: 30, max: 40 }, typicalDuration: "15 min" },
      { name: "Zip Line", priceRange: { min: 50, max: 70 }, typicalDuration: "30 min" },
      { name: "Floating Cabana Rental", priceRange: { min: 200, max: 600 }, typicalDuration: "All day" },
      { name: "Jet Ski Tour", priceRange: { min: 90, max: 120 }, typicalDuration: "1 hour" },
    ],
    freeActivities: [
      { name: "Chill Island Beach", description: "Huge stretch of beach with free lounge chairs, included as part of your cruise." },
      { name: "South Beach", description: "Quieter beach area at the far end of the island. Fewer crowds, same gorgeous water." },
      { name: "Oasis Lagoon Pool", description: "The largest freshwater pool in the Caribbean. Free for all guests with swim-up bar." },
    ],
    restaurants: [
      { name: "Snack Shack (included)", priceRange: "$" },
      { name: "Chill Grill (included)", priceRange: "$" },
      { name: "Captain Jack's (a la carte)", priceRange: "$$" },
    ],
    gettingAround:
      "The island is walkable end to end in about 20 minutes. Tram service runs between the dock and the main attractions. Everything is designed for easy foot traffic. No roads, no cars — just pathways and beaches.",
    emergencyInfo: {
      police: "Ship security (island is staffed by Royal Caribbean)",
      hospital: "First aid station on island; medical center on ship",
    },
    region: "bahamas",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/ports-and-destinations/destinations/perfect-day/arrivals-plaza-perfect-day-at-cococay-aerial-view.jpg",
  },

  /* ================================================================ */
  /*  14. Labadee, Haiti (Royal Caribbean Private Resort)             */
  /* ================================================================ */
  {
    slug: "labadee",
    name: "Labadee",
    country: "Haiti (Private Resort)",
    coordinates: { lat: 19.7830, lng: -72.2490 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "N/A — private fenced resort, no town access",
    currency: "USD (ship card)",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "none",
    overview:
      "Labadee is Royal Caribbean's private resort on Haiti's northern coast. It's a fully fenced and secured beach destination with multiple beaches, a zip line over the water, and an alpine coaster. The beaches are stunning and included with your cruise.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Dragon's Breath Zip Line", priceRange: { min: 90, max: 100 }, typicalDuration: "30 min" },
      { name: "Dragon's Tail Alpine Coaster", priceRange: { min: 40, max: 55 }, typicalDuration: "20 min" },
      { name: "Kayaking", priceRange: { min: 40, max: 60 }, typicalDuration: "1 hour" },
      { name: "Wave Jet Tour", priceRange: { min: 80, max: 100 }, typicalDuration: "1 hour" },
      { name: "Private Cabana Rental", priceRange: { min: 250, max: 600 }, typicalDuration: "All day" },
    ],
    freeActivities: [
      { name: "Barefoot Beach", description: "Main beach with calm waters, free lounge chairs, and a great swimming area." },
      { name: "Adrenaline Beach", description: "More active beach near the zip line and coaster — popular with families." },
      { name: "Artisan Market", description: "Browse handmade Haitian art, paintings, and crafts at the market near the pier." },
    ],
    restaurants: [
      { name: "Beach BBQ (included)", priceRange: "$" },
      { name: "Nellie's Beach Bar", priceRange: "$" },
      { name: "Hilltop Grill (included)", priceRange: "$" },
    ],
    gettingAround:
      "Labadee is walkable but hilly. A tram runs between the pier and the beaches. Wear good shoes for the paths between beaches. Everything is within the resort fence — there is no access to the surrounding area.",
    emergencyInfo: {
      police: "Ship security (resort is staffed by Royal Caribbean)",
      hospital: "First aid station on site; medical center on ship",
    },
    region: "eastern",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/labadee-haiti/labadee-haiti-zipline-coast.jpg",
  },

  /* ================================================================ */
  /*  15. Amber Cove, Dominican Republic                              */
  /* ================================================================ */
  {
    slug: "amber-cove",
    name: "Amber Cove",
    country: "Dominican Republic",
    coordinates: { lat: 19.8120, lng: -70.7120 },
    timezone: "AST (no DST)",
    safetyRating: 8,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Puerto Plata is a 15-min taxi ride",
    currency: "DOP",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Amber Cove is Carnival Corporation's purpose-built cruise port on the Dominican Republic's north coast. The complex features a large pool, water slides, zip lines, and shops. Puerto Plata and its 27 Waterfalls of Damajagua are popular excursions.",
    timeZoneAlert:
      "The DR uses AST year-round. Same as EDT in summer, 1 hour ahead of EST in winter.",
    excursionCategories: [
      { name: "27 Waterfalls of Damajagua", priceRange: { min: 70, max: 100 }, typicalDuration: "4-5 hours" },
      { name: "Puerto Plata Cable Car & Fort", priceRange: { min: 40, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Sosua Beach Day", priceRange: { min: 30, max: 50 }, typicalDuration: "4-5 hours" },
      { name: "Catamaran Snorkel Cruise", priceRange: { min: 60, max: 80 }, typicalDuration: "3-4 hours" },
      { name: "Zip Line Adventure", priceRange: { min: 50, max: 70 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Amber Cove Pool Complex", description: "Large pool with swim-up bar, water slides, and lounge chairs — included for cruise guests." },
      { name: "Port Shopping Village", description: "Browse local crafts, amber jewelry, and Dominican souvenirs at the port shops." },
      { name: "Nature Trail Walk", description: "Short walking path through tropical gardens near the port area." },
    ],
    restaurants: [
      { name: "Port Complex Grill", priceRange: "$" },
      { name: "Luper's Restaurant (Puerto Plata)", priceRange: "$" },
      { name: "La Tarappa (Puerto Plata)", priceRange: "$$" },
    ],
    gettingAround:
      "Taxis from the port to Puerto Plata cost $20-25 for up to 4 people. The port complex itself is walkable. For excursions like the 27 Waterfalls, book a tour. Public guagua (minibus) service is available but not recommended for cruise passengers.",
    emergencyInfo: {
      police: "911",
      hospital: "Centro Medico Dr. Bournigal — Puerto Plata",
      usConsulate: "(809) 567-7775 (Santo Domingo)",
    },
    region: "eastern",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/ports-and-destinations/ports/cabo-rojo-dominican-republic/overview/beach-playa-cabo-rojo-north-bahia-de-las-aguilas-around-pedernales-jaragua-national-park-dominican-republic.jpg",
  },

  /* ================================================================ */
  /*  16. Belize City, Belize                                         */
  /* ================================================================ */
  {
    slug: "belize-city",
    name: "Belize City",
    country: "Belize",
    coordinates: { lat: 17.4989, lng: -88.1886 },
    timezone: "CST (no DST)",
    safetyRating: 5.5,
    walkabilityRating: 3,
    isTenderPort: true,
    typicalPortHours: 7,
    walkingDistanceToTown: "Tender to Tourism Village + 5 min walk",
    currency: "BZD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Belize City is the tender port gateway to incredible Mayan ruins (Altun Ha, Lamanai), the world's second-largest barrier reef, cave tubing, and jungle adventures. The city itself is rough around the edges — most cruisers book excursions rather than exploring independently.",
    timeZoneAlert:
      "Belize is on CST and does NOT observe DST. In summer it is 2 hours behind Florida/Eastern Time.",
    excursionCategories: [
      { name: "Cave Tubing", priceRange: { min: 60, max: 90 }, typicalDuration: "4-5 hours" },
      { name: "Altun Ha Mayan Ruins", priceRange: { min: 50, max: 80 }, typicalDuration: "3-4 hours" },
      { name: "Snorkeling the Barrier Reef", priceRange: { min: 70, max: 100 }, typicalDuration: "4-5 hours" },
      { name: "Lamanai River Safari", priceRange: { min: 80, max: 120 }, typicalDuration: "5-6 hours" },
      { name: "Zip Line & Zoo Combo", priceRange: { min: 80, max: 100 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Tourism Village", description: "Small shopping and dining area near the tender dock. Safe and designed for cruise visitors." },
      { name: "Swing Bridge", description: "Manually operated swing bridge in the city center — one of the last of its kind in the world." },
      { name: "Fort George Lighthouse", description: "Short walk to the Baron Bliss Lighthouse with harbor views." },
    ],
    restaurants: [
      { name: "Tourism Village Food Court", priceRange: "$" },
      { name: "Wet Lizard", priceRange: "$" },
      { name: "Celebrity Restaurant", priceRange: "$$" },
    ],
    gettingAround:
      "Stay in the Tourism Village area or book an excursion — independent walking beyond the tourist zone is not recommended. Taxis should be pre-arranged through the port. Water taxis to Caye Caulker run $20-25 one way (1 hour) but timing is tight for cruise schedules.",
    emergencyInfo: {
      police: "911",
      hospital: "Karl Heusner Memorial Hospital",
      usConsulate: "(501) 822-4011 (US Embassy Belmopan)",
    },
    region: "western",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/belize-city-belize/belize-crystal-caves-limestone.jpg",
  },

  /* ================================================================ */
  /*  17. Falmouth, Jamaica                                           */
  /* ================================================================ */
  {
    slug: "falmouth",
    name: "Falmouth",
    country: "Jamaica",
    coordinates: { lat: 18.4913, lng: -77.6564 },
    timezone: "EST (no DST)",
    safetyRating: 7,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "5 min walk from port to Falmouth town center",
    currency: "JMD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Falmouth is a historic Georgian town on Jamaica's north coast, purpose-built as a cruise port by Royal Caribbean. It's the gateway to Dunn's River Falls, Martha Brae River rafting, and Jamaica's famous Luminous Lagoon bioluminescent bay.",
    timeZoneAlert:
      "Jamaica does NOT observe DST. In summer it is 1 hour behind Florida/Eastern Time.",
    excursionCategories: [
      { name: "Dunn's River Falls", priceRange: { min: 60, max: 90 }, typicalDuration: "4-5 hours" },
      { name: "Martha Brae River Rafting", priceRange: { min: 70, max: 90 }, typicalDuration: "3-4 hours" },
      { name: "Luminous Lagoon Night Tour", priceRange: { min: 30, max: 50 }, typicalDuration: "2 hours" },
      { name: "Montego Bay Beach Day", priceRange: { min: 30, max: 50 }, typicalDuration: "4-5 hours" },
      { name: "Mystic Mountain Bobsled", priceRange: { min: 80, max: 110 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Falmouth Heritage Walk", description: "Stroll through one of the best-preserved Georgian towns in the Caribbean — colorful buildings and history." },
      { name: "Water Square", description: "Historic center of Falmouth with a restored fountain and colonial-era architecture." },
      { name: "Port Shopping Area", description: "Duty-free shopping and Jamaican crafts near the cruise terminal." },
    ],
    restaurants: [
      { name: "Peppa's Jerk Centre", priceRange: "$" },
      { name: "Gloria's Seafood Restaurant", priceRange: "$$" },
      { name: "Time N' Place Beach Bar", priceRange: "$" },
    ],
    gettingAround:
      "Taxis from Falmouth to Montego Bay are $25-30 for a car (not per person). Negotiate before departure. Route taxis are cheap ($2-3) but crowded. For Dunn's River Falls, book a tour — it's a 40-minute drive east. Walking Falmouth town is safe during the day.",
    emergencyInfo: {
      police: "119",
      hospital: "Falmouth Public Hospital",
      usConsulate: "(876) 702-6000 (US Embassy Kingston)",
    },
    region: "western",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/falmouth-jamaica/falmouth-jamaica-port-aerial-coast.jpg",
  },

  /* ================================================================ */
  /*  18. Ocho Rios, Jamaica                                          */
  /* ================================================================ */
  {
    slug: "ocho-rios",
    name: "Ocho Rios",
    country: "Jamaica",
    coordinates: { lat: 18.4075, lng: -77.1100 },
    timezone: "EST (no DST)",
    safetyRating: 6.5,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "10 min walk to Main Street and beaches",
    currency: "JMD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Ocho Rios ('Ochi' to locals) is Jamaica's most popular cruise port, set against a backdrop of lush mountains and waterfalls. Dunn's River Falls is the star attraction, and the town has a vibrant local market, great jerk food, and easy beach access.",
    timeZoneAlert:
      "Jamaica does NOT observe DST. In summer it is 1 hour behind Florida/Eastern Time.",
    excursionCategories: [
      { name: "Dunn's River Falls Climb", priceRange: { min: 25, max: 50 }, typicalDuration: "2-3 hours" },
      { name: "Mystic Mountain (Bobsled/Zip)", priceRange: { min: 80, max: 120 }, typicalDuration: "3-4 hours" },
      { name: "Blue Hole Secret Falls", priceRange: { min: 30, max: 50 }, typicalDuration: "2-3 hours" },
      { name: "Dolphin Cove", priceRange: { min: 70, max: 150 }, typicalDuration: "2-3 hours" },
      { name: "Bamboo Rafting on White River", priceRange: { min: 50, max: 70 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Ocho Rios Bay Beach", description: "Public beach a short walk from the pier with calm turquoise waters. Free entry." },
      { name: "Craft Market", description: "Large open-air market next to the port with Jamaican carvings, clothing, and souvenirs. Haggling expected." },
      { name: "Main Street Walk", description: "Browse shops, grab a patty from a bakery, and soak in the local Jamaican vibes." },
    ],
    restaurants: [
      { name: "Scotchie's Jerk Centre", priceRange: "$" },
      { name: "Ocho Rios Jerk Centre", priceRange: "$" },
      { name: "Toscanini (Italian)", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis to Dunn's River Falls cost about $10-15 per person round trip. Walking downtown is manageable but watch for traffic. Route taxis are cheap. For distant excursions, always book through a tour operator for reliable return times.",
    emergencyInfo: {
      police: "119",
      hospital: "St. Ann's Bay Hospital (15 min drive)",
      usConsulate: "(876) 702-6000 (US Embassy Kingston)",
    },
    region: "western",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Dunn's_River_Falls_%26_Park.jpg",
  },

  /* ================================================================ */
  /*  19. Curacao                                                     */
  /* ================================================================ */
  {
    slug: "curacao",
    name: "Curacao",
    country: "Curacao",
    coordinates: { lat: 12.1696, lng: -68.9900 },
    timezone: "AST (no DST)",
    safetyRating: 8.5,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "5 min walk across Queen Emma Bridge to Punda",
    currency: "ANG",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Curacao is a colorful Dutch Caribbean island known for its UNESCO World Heritage waterfront in Willemstad, excellent diving, and unique liqueur. The cruise terminal is right in the historic Otrobanda district, steps from the iconic Queen Emma floating bridge.",
    timeZoneAlert:
      "Curacao uses AST year-round. Same as EDT in summer, 1 hour ahead of EST in winter.",
    excursionCategories: [
      { name: "Curacao Sea Aquarium & Dolphins", priceRange: { min: 40, max: 100 }, typicalDuration: "2-3 hours" },
      { name: "Beach Hopping Tour", priceRange: { min: 50, max: 80 }, typicalDuration: "4-5 hours" },
      { name: "Hato Caves", priceRange: { min: 15, max: 25 }, typicalDuration: "1.5 hours" },
      { name: "Curacao Liqueur Distillery Tour", priceRange: { min: 10, max: 15 }, typicalDuration: "1 hour" },
      { name: "Snorkeling at Tugboat Beach", priceRange: { min: 30, max: 50 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Queen Emma Floating Bridge", description: "Unique pontoon bridge that swings open for ships. Walk across to Punda for postcard-perfect views." },
      { name: "Punda & Handelskade Walk", description: "The most photographed street in the Caribbean — colorful Dutch colonial facades along the waterfront." },
      { name: "Fort Amsterdam", description: "Historic fort that now houses the Governor's residence and a small church. Free to walk through." },
    ],
    restaurants: [
      { name: "Plasa Bieu (Old Market)", priceRange: "$" },
      { name: "Gouverneur de Rouville", priceRange: "$$$" },
      { name: "Iguana Cafe", priceRange: "$$" },
    ],
    gettingAround:
      "Walking around Willemstad (Punda and Otrobanda) is easy and safe. Buses run to beaches for $2. Taxis to popular beaches cost $15-25. Renting a car ($35-45/day) is the best way to explore hidden coves and Shete Boka National Park.",
    emergencyInfo: {
      police: "911",
      hospital: "Curacao Medical Center",
      usConsulate: "(599-9) 461-3066",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Facades_of_Handelskade,_Willemstad,_Cura%C3%A7ao_-_February_2020.jpg",
  },

  /* ================================================================ */
  /*  20. Bermuda                                                     */
  /* ================================================================ */
  {
    slug: "bermuda",
    name: "Bermuda",
    country: "Bermuda",
    coordinates: { lat: 32.3078, lng: -64.7505 },
    timezone: "AST/ADT",
    safetyRating: 9.5,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 48,
    walkingDistanceToTown: "5 min walk from Royal Naval Dockyard; Hamilton is 30 min by ferry",
    currency: "BMD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Bermuda is unique among Caribbean cruise destinations — ships typically dock for 2-3 days, giving you ample time to explore. Pink sand beaches, pastel houses, and British colonial charm define this mid-Atlantic island. It's north of the Caribbean but a staple of cruise itineraries.",
    timeZoneAlert:
      "Bermuda uses AST/ADT (same as Atlantic Canada). It is 1 hour ahead of Eastern Time year-round. Plan accordingly!",
    excursionCategories: [
      { name: "Horseshoe Bay Beach", priceRange: { min: 5, max: 15 }, typicalDuration: "3-5 hours" },
      { name: "Crystal & Fantasy Caves", priceRange: { min: 25, max: 35 }, typicalDuration: "1.5-2 hours" },
      { name: "Hamilton City & Shopping", priceRange: { min: 0, max: 10 }, typicalDuration: "3-4 hours" },
      { name: "Snorkeling / Helmet Diving", priceRange: { min: 60, max: 100 }, typicalDuration: "2-3 hours" },
      { name: "Glass-Bottom Boat Tour", priceRange: { min: 45, max: 60 }, typicalDuration: "1.5 hours" },
    ],
    freeActivities: [
      { name: "Royal Naval Dockyard", description: "Explore the historic dockyard complex with shops, museums, and the National Museum of Bermuda (small fee)." },
      { name: "Hamilton Ferry Ride", description: "Take the public ferry ($5) to Hamilton — the journey through the Great Sound is scenic and a destination itself." },
      { name: "Bermuda Railway Trail", description: "Walk or bike sections of this converted railway line for stunning coastal views and nature." },
    ],
    restaurants: [
      { name: "Frog & Onion Pub (Dockyard)", priceRange: "$$" },
      { name: "Art Mel's Spicy Dicy", priceRange: "$" },
      { name: "The Swizzle Inn", priceRange: "$$" },
    ],
    gettingAround:
      "Public buses and ferries are excellent and affordable ($5 tokens, $19 for a day pass). No rental cars allowed in Bermuda — rent a scooter ($50-70/day) or electric minicar (Twizys, $90/day). Ferries from Dockyard to Hamilton take 20-30 minutes.",
    emergencyInfo: {
      police: "911",
      hospital: "King Edward VII Memorial Hospital",
      usConsulate: "(441) 295-1342",
    },
    region: "eastern",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/kings-wharf-bermuda/kings-wharf-bermuda-horseshoe-bay-rock-formations.jpg",
  },

  /* ================================================================ */
  /*  21. Puerto Plata, Dominican Republic                            */
  /* ================================================================ */
  {
    slug: "puerto-plata",
    name: "Puerto Plata",
    country: "Dominican Republic",
    coordinates: { lat: 19.798416, lng: -70.701464 },
    timezone: "AST (no DST)",
    safetyRating: 6.5,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "15-20 min from Taino Bay; 7 miles from Amber Cove",
    currency: "DOP",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Puerto Plata operates a dual-terminal system — Taino Bay offers direct access to the historic city center with its 16th-century San Felipe Fortress, while Amber Cove functions as a gated resort-style complex with pools and bird sanctuaries. The blend of colonial history and modern amenities makes it one of the Dominican Republic's most versatile cruise stops.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Damajagua Falls", priceRange: { min: 75, max: 110 }, typicalDuration: "4-5 hours" },
      { name: "Mt. Isabel de Torres Cable Car", priceRange: { min: 25, max: 45 }, typicalDuration: "2-3 hours" },
      { name: "Ocean World", priceRange: { min: 90, max: 160 }, typicalDuration: "3-4 hours" },
      { name: "Historic City & Rum Tasting", priceRange: { min: 40, max: 70 }, typicalDuration: "2-3 hours" },
      { name: "Cayo Paraiso", priceRange: { min: 120, max: 150 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "Terminal Pool & Bird Sanctuary", description: "Enjoy the pool complex and walk through the bird sanctuary at the terminal — free for cruise guests." },
      { name: "Malecón Coastal Walk", description: "Scenic waterfront promenade along the coast, perfect for a leisurely stroll." },
      { name: "San Felipe Fortress Views", description: "Take in the exterior views of the 16th-century fortress overlooking the harbor." },
    ],
    restaurants: [
      { name: "Bocaditos", priceRange: "$$" },
      { name: "Kaffe", priceRange: "$$" },
      { name: "Casita Azul", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis are unmetered — negotiate a flat rate of $20-$25 to town from Amber Cove. Taino Bay is within walking distance of downtown.",
    emergencyInfo: {
      police: "911",
      hospital: "Centro Médico Bournigal — 809-586-2342",
      usConsulate: "Santo Domingo 809-567-7775",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Puerto_Plata_Dominican_Republic_Town_Architecture.jpg",
  },

  /* ================================================================ */
  /*  22. Montego Bay, Jamaica                                        */
  /* ================================================================ */
  {
    slug: "montego-bay",
    name: "Montego Bay",
    country: "Jamaica",
    coordinates: { lat: 18.465, lng: -77.939 },
    timezone: "EST (no DST)",
    safetyRating: 5,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "3+ miles to Hip Strip/beaches",
    currency: "JMD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Montego Bay delivers a vibrant, high-energy Jamaican experience centered on the famous Hip Strip and historic Great Houses. The port's industrial location requires vehicular transport for nearly all activities, but the reward is authentic jerk cuisine, legendary beaches, and the iconic Dunn's River Falls day trip.",
    timeZoneAlert:
      "Ships from Florida may be on EDT while Jamaica stays on EST year-round — a potential 1-hour difference in summer.",
    excursionCategories: [
      { name: "Dunn's River Falls", priceRange: { min: 90, max: 130 }, typicalDuration: "5-6 hours" },
      { name: "Martha Brae Rafting", priceRange: { min: 80, max: 110 }, typicalDuration: "3-4 hours" },
      { name: "Rose Hall Great House", priceRange: { min: 30, max: 50 }, typicalDuration: "2 hours" },
      { name: "Undersea Tour", priceRange: { min: 45, max: 65 }, typicalDuration: "1.5 hours" },
      { name: "Chukka Ride & Swim", priceRange: { min: 100, max: 140 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Doctor's Cave Beach", description: "Famous beach with a small entry fee — one of Jamaica's most iconic stretches of sand." },
      { name: "Craft Markets", description: "Browse vibrant Jamaican craft markets for handmade souvenirs and local art." },
      { name: "Hip Strip Walking", description: "Walk the famous Gloucester Avenue strip lined with shops, restaurants, and bars." },
    ],
    restaurants: [
      { name: "The Pork Pit", priceRange: "$$" },
      { name: "Marguerites", priceRange: "$$$$" },
      { name: "Pelican Grill", priceRange: "$$" },
    ],
    gettingAround:
      "Book taxis through JUTA or MAXI associations only. Shared shuttle to Hip Strip is $5-$10 per person. Avoid unlicensed drivers.",
    emergencyInfo: {
      police: "119",
      hospital: "Hospiten Montego Bay — 876-618-4455",
      usConsulate: "876-953-0620",
    },
    region: "western",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Doctors-Cave-Beach.jpg",
  },

  /* ================================================================ */
  /*  23. Tortola, British Virgin Islands                             */
  /* ================================================================ */
  {
    slug: "tortola",
    name: "Tortola",
    country: "British Virgin Islands",
    coordinates: { lat: 18.4215, lng: -64.6165 },
    timezone: "AST (no DST)",
    safetyRating: 8.5,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 10,
    walkingDistanceToTown: "Immediate — terminal is in town center",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Tortola's Pier Park puts you directly in the heart of Road Town with upscale shopping, craft markets, and restaurants steps from the gangway. As the gateway to the BVI's stunning archipelago, it offers some of the Caribbean's best sailing and snorkeling excursions, including the famous Baths on Virgin Gorda.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Virgin Gorda Baths", priceRange: { min: 110, max: 160 }, typicalDuration: "5-6 hours" },
      { name: "Cane Garden Bay Beach", priceRange: { min: 30, max: 55 }, typicalDuration: "3-5 hours" },
      { name: "Sailing Catamaran", priceRange: { min: 120, max: 180 }, typicalDuration: "4-5 hours" },
      { name: "Sage Mountain Hike", priceRange: { min: 60, max: 90 }, typicalDuration: "2-3 hours" },
      { name: "Callwood Rum Distillery", priceRange: { min: 40, max: 70 }, typicalDuration: "1.5-2 hours" },
    ],
    freeActivities: [
      { name: "Pier Park Shops", description: "Walk through the upscale Pier Park shopping complex directly at the cruise terminal." },
      { name: "Road Town Waterfront", description: "Stroll the scenic waterfront of Road Town with views of the harbor and surrounding hills." },
      { name: "Main Street Historic Buildings", description: "Explore the historic buildings along Road Town's Main Street." },
    ],
    restaurants: [
      { name: "Pusser's Road Town Pub", priceRange: "$$" },
      { name: "Capriccio di Mare", priceRange: "$$" },
      { name: "Maria's by the Sea", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis are open-air safari buses. Trip to Cane Garden Bay costs ~$12 per person for groups of 3+.",
    emergencyInfo: {
      police: "999 or 911",
      hospital: "Peebles Hospital — 284-852-7500",
      usConsulate: "Nearest in Barbados",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/BVI-tortola-cane-garden-bay.jpg",
  },

  /* ================================================================ */
  /*  24. Cartagena, Colombia                                         */
  /* ================================================================ */
  {
    slug: "cartagena",
    name: "Cartagena",
    country: "Colombia",
    coordinates: { lat: 10.4065, lng: -75.5275 },
    timezone: "COT (UTC-5, no DST)",
    safetyRating: 4,
    walkabilityRating: 2,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "~3 miles to the Walled City",
    currency: "COP",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Cartagena's UNESCO-listed Walled City is one of the most spectacular colonial destinations in the Americas, with centuries-old fortifications, vibrant plazas, and world-class dining. The port is in an industrial zone requiring a taxi or Uber to reach the historic heart, but the reward is unmatched cultural immersion.",
    timeZoneAlert:
      "Ships arriving from the Eastern Caribbean may be an hour ahead of local Colombian time (COT/UTC-5).",
    excursionCategories: [
      { name: "Rosario Islands", priceRange: { min: 70, max: 110 }, typicalDuration: "5-6 hours" },
      { name: "Walled City & San Felipe Fortress", priceRange: { min: 30, max: 65 }, typicalDuration: "3-4 hours" },
      { name: "Totumo Mud Volcano", priceRange: { min: 50, max: 85 }, typicalDuration: "3-4 hours" },
      { name: "Bay Sunset Cruise", priceRange: { min: 35, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "Electric Car City Tour", priceRange: { min: 25, max: 45 }, typicalDuration: "2 hours" },
    ],
    freeActivities: [
      { name: "Port Oasis Eco Park", description: "Explore the eco park near the port featuring wild macaws and tropical greenery." },
      { name: "Walk the Walled City Ramparts", description: "Stroll along the top of the centuries-old city walls for panoramic views." },
      { name: "Plaza Santo Domingo", description: "Iconic colonial plaza with cafes, street performers, and the famous Botero sculpture." },
    ],
    restaurants: [
      { name: "La Cevicheria", priceRange: "$$" },
      { name: "Restaurante 1621", priceRange: "$$$$" },
      { name: "Carmen", priceRange: "$$$$" },
    ],
    gettingAround:
      "Taxis are unmetered — always agree on a fare in COP before departing. Uber is widely used and more predictable.",
    emergencyInfo: {
      police: "123",
      hospital: "Hospital Naval de Cartagena",
      usConsulate: "Bogotá +57 1 275-2000",
    },
    region: "southern",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/cartagena-colombia/overview/cartagena-colombia-close-up-church-of-st-peter-claver.jpg",
  },

  /* ================================================================ */
  /*  25. Bridgetown, Barbados                                        */
  /* ================================================================ */
  {
    slug: "barbados",
    name: "Bridgetown",
    country: "Barbados",
    coordinates: { lat: 13.1065, lng: -59.6275 },
    timezone: "AST (no DST)",
    safetyRating: 7.5,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 10,
    walkingDistanceToTown: "1 mile (20-25 min) to Broad Street",
    currency: "BBD (2 BBD = 1 USD)",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Bridgetown's British colonial charm meets Caribbean warmth at this UNESCO World Heritage port. The historic Careenage, duty-free shopping on Broad Street, and proximity to premium beach clubs like The Boatyard make it a favorite for repeat cruisers seeking a sophisticated Southern Caribbean experience.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Harrison's Cave", priceRange: { min: 60, max: 95 }, typicalDuration: "2-3 hours" },
      { name: "Mount Gay Rum Distillery", priceRange: { min: 30, max: 50 }, typicalDuration: "1.5-2 hours" },
      { name: "Carlisle Bay Snorkel", priceRange: { min: 35, max: 65 }, typicalDuration: "2-3 hours" },
      { name: "Island Safari 4x4", priceRange: { min: 90, max: 130 }, typicalDuration: "4-5 hours" },
      { name: "Hunte's Gardens & Bathsheba", priceRange: { min: 130, max: 180 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "Walk the Careenage", description: "Stroll along the historic inner harbor where boats bob and colonial buildings line the waterfront." },
      { name: "Broad Street Shopping", description: "Browse duty-free shops along Bridgetown's main commercial street." },
      { name: "Chamberlain Bridge Views", description: "Take in views of the Careenage and Parliament Buildings from this historic bridge." },
    ],
    restaurants: [
      { name: "The Boatyard", priceRange: "$$" },
      { name: "Waterfront Cafe", priceRange: "$$" },
      { name: "Brown Sugar", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis are unmetered — always confirm if the rate quoted is in USD or BBD (big difference!).",
    emergencyInfo: {
      police: "211",
      hospital: "Queen Elizabeth Hospital — 246-436-6450",
      usConsulate: "246-227-4000",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Brandon's_Beach.jpg",
  },

  /* ================================================================ */
  /*  26. St. George's, Grenada                                       */
  /* ================================================================ */
  {
    slug: "grenada",
    name: "St. George's",
    country: "Grenada",
    coordinates: { lat: 12.0525, lng: -61.7555 },
    timezone: "AST (no DST)",
    safetyRating: 8,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "Immediate — terminal is in the historic district",
    currency: "XCD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "St. George's horseshoe-shaped Carenage is frequently called the most scenic harbor in the Caribbean. The Melville Street terminal places you directly in the colorful historic district, where spice shops, colonial architecture, and the world's first underwater sculpture park are all within reach.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Underwater Sculpture Park", priceRange: { min: 65, max: 95 }, typicalDuration: "2-3 hours" },
      { name: "Grand Etang Rainforest", priceRange: { min: 55, max: 85 }, typicalDuration: "3-4 hours" },
      { name: "Seven Sisters Waterfalls", priceRange: { min: 45, max: 75 }, typicalDuration: "3-4 hours" },
      { name: "River Tubing", priceRange: { min: 70, max: 100 }, typicalDuration: "2-3 hours" },
      { name: "Belmont Estate Chocolate Tour", priceRange: { min: 50, max: 80 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Walk the Carenage", description: "Stroll along the picturesque horseshoe-shaped harbor lined with colorful buildings." },
      { name: "Fort George Views", description: "Climb to Fort George for panoramic views of the harbor and St. George's." },
      { name: "Spice Market Browsing", description: "Browse the fragrant spice stalls selling nutmeg, cinnamon, and other Grenadian spices." },
    ],
    restaurants: [
      { name: "BB's Crabback", priceRange: "$$$" },
      { name: "Nutmeg Restaurant", priceRange: "$$" },
      { name: "Carenage Cafes", priceRange: "$" },
    ],
    gettingAround:
      "Water taxis to Grand Anse Beach are a highlight — approximately $10 return trip.",
    emergencyInfo: {
      police: "911",
      hospital: "General Hospital St. George's — 473-440-2051",
      usConsulate: "473-444-1173",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Grand_Anse_Beach_Grenada.jpg",
  },

  /* ================================================================ */
  /*  27. St. John's, Antigua                                         */
  /* ================================================================ */
  {
    slug: "antigua",
    name: "St. John's",
    country: "Antigua",
    coordinates: { lat: 17.1215, lng: -61.8465 },
    timezone: "AST (no DST)",
    safetyRating: 7.5,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 10,
    walkingDistanceToTown: "0 miles — gangway leads directly into Heritage Quay shopping",
    currency: "XCD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Antigua's Heritage Quay puts you directly in the heart of St. John's with duty-free shopping steps from the gangway. The island's 365 beaches and UNESCO-listed Nelson's Dockyard make it one of the Eastern Caribbean's most complete port experiences.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Nelson's Dockyard & Shirley Heights", priceRange: { min: 55, max: 85 }, typicalDuration: "4-5 hours" },
      { name: "Stingray City", priceRange: { min: 85, max: 115 }, typicalDuration: "3-4 hours" },
      { name: "Reef Riders", priceRange: { min: 90, max: 130 }, typicalDuration: "2-3 hours" },
      { name: "Zipline Canopy", priceRange: { min: 95, max: 135 }, typicalDuration: "2-3 hours" },
      { name: "Devil's Bridge", priceRange: { min: 40, max: 70 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "St. John's Cathedral", description: "Visit the iconic twin-towered cathedral, a landmark of St. John's skyline." },
      { name: "Redcliffe Quay Historic Streets", description: "Explore the restored historic quarter with boutiques, galleries, and cafes." },
      { name: "Heritage Quay Browsing", description: "Browse duty-free shops and local vendors steps from the cruise ship gangway." },
    ],
    restaurants: [
      { name: "Hemingway's", priceRange: "$$" },
      { name: "Big Banana", priceRange: "$$" },
      { name: "C&C Wine House", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis operate on government-regulated zone pricing. No meters — rates are standardized.",
    emergencyInfo: {
      police: "999",
      hospital: "Sir Lester Bird Medical Centre — 268-484-2700",
      usConsulate: "Nearest in Barbados",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/St._John's_Antigua_Cruise_Port_1.jpg",
  },

  /* ================================================================ */
  /*  28. Castries, St. Lucia                                         */
  /* ================================================================ */
  {
    slug: "st-lucia",
    name: "Castries",
    country: "St. Lucia",
    coordinates: { lat: 14.0165, lng: -60.9945 },
    timezone: "AST (no DST)",
    safetyRating: 6,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "La Place Carenage is in town; Pointe Seraphine is 20 min walk",
    currency: "XCD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "St. Lucia's dramatic volcanic topography — crowned by the iconic Pitons — makes it one of the Caribbean's most visually striking destinations. The northern port requires long transit to reach southern attractions, but catamaran cruises to the Pitons and volcanic mud bath experiences make the journey worthwhile.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Soufriere Mud Bath", priceRange: { min: 85, max: 125 }, typicalDuration: "5-6 hours" },
      { name: "Pitons Catamaran", priceRange: { min: 110, max: 160 }, typicalDuration: "6-7 hours" },
      { name: "Rainforest Aerial Tram", priceRange: { min: 95, max: 135 }, typicalDuration: "3-4 hours" },
      { name: "Pigeon Island", priceRange: { min: 45, max: 75 }, typicalDuration: "3-4 hours" },
      { name: "Banana Plantation", priceRange: { min: 35, max: 60 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Castries Market", description: "Vibrant open-air market with fresh produce, spices, and handmade crafts." },
      { name: "Derek Walcott Square", description: "Charming public square named after the Nobel Prize-winning poet, shaded by a massive samaan tree." },
      { name: "Cathedral Basilica", description: "Visit the stunning Cathedral of the Immaculate Conception with its colorful painted interior." },
    ],
    restaurants: [
      { name: "Chef Robby's", priceRange: "$$" },
      { name: "Auberge Seraphine", priceRange: "$$$" },
      { name: "Pink Plantation", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis are unmetered — always confirm the currency. Transit to Soufriere/Pitons takes 1+ hour each way.",
    emergencyInfo: {
      police: "999",
      hospital: "Tapion Hospital — 758-459-2000",
      usConsulate: "Nearest in Barbados",
    },
    region: "eastern",
    imageUrl: "https://www.carnival.com/-/media/Images/explore/destinations/ports/carnival-caribbean-port-st-lucia-2.jpg",
  },

  /* ================================================================ */
  /*  29. Kralendijk, Bonaire                                         */
  /* ================================================================ */
  {
    slug: "bonaire",
    name: "Kralendijk",
    country: "Bonaire",
    coordinates: { lat: 12.1485, lng: -68.2765 },
    timezone: "AST (no DST)",
    safetyRating: 9,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 11,
    walkingDistanceToTown: "Immediate — piers are in the heart of town",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Bonaire is the Caribbean's premier eco-tourism destination, famous for world-class diving, flamingo sanctuaries, and pristine marine parks. As a special municipality of the Netherlands, it offers exceptional safety and infrastructure alongside an unhurried, nature-focused atmosphere.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Marine Park Snorkel", priceRange: { min: 55, max: 85 }, typicalDuration: "2-3 hours" },
      { name: "Lac Bay Kayaking", priceRange: { min: 75, max: 110 }, typicalDuration: "3-4 hours" },
      { name: "Washington-Slagbaai Park", priceRange: { min: 85, max: 125 }, typicalDuration: "5-6 hours" },
      { name: "Salt Flats & Flamingos", priceRange: { min: 40, max: 70 }, typicalDuration: "2-3 hours" },
      { name: "Land Sailing", priceRange: { min: 70, max: 100 }, typicalDuration: "2 hours" },
    ],
    freeActivities: [
      { name: "Downtown Kralendijk Walking", description: "Explore the charming, colorful streets of this small Dutch Caribbean town." },
      { name: "Waterfront Promenade", description: "Walk the scenic waterfront with views of Klein Bonaire island across the harbor." },
      { name: "Slave Huts Historical Site", description: "Visit the preserved 19th-century slave huts near the southern salt pans — a somber historical landmark." },
    ],
    restaurants: [
      { name: "It Rains Fishes", priceRange: "$$$" },
      { name: "Sebastian's", priceRange: "$$$" },
      { name: "Karel's Beach Bar", priceRange: "$$" },
    ],
    gettingAround:
      "Walking is preferred for town exploration. Taxis available for beach/dive site trips.",
    emergencyInfo: {
      police: "911",
      hospital: "Fundashon Mariadal — 599-717-8900",
      usConsulate: "Nearest in Curacao 599-9-461-3066",
    },
    region: "southern",
    imageUrl: "https://www.carnival.com/-/media/Images/explore/destinations/ports/carnival-caribbean-port-bonaire-1.jpg",
  },

  /* ================================================================ */
  /*  30. Harvest Caye, Belize (NCL Private Destination)              */
  /* ================================================================ */
  {
    slug: "harvest-caye",
    name: "Harvest Caye",
    country: "Belize (NCL Private Destination)",
    coordinates: { lat: 16.5165, lng: -88.3905 },
    timezone: "CST (no DST)",
    safetyRating: 10,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "N/A — private island resort",
    currency: "USD/BZD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Harvest Caye is Norwegian Cruise Line's exclusive 75-acre private island destination off the coast of Belize, featuring a 7-acre beach, 15,000 sq ft pool, flighthouse zipline, and wildlife sanctuary with toucans and butterflies. Unlike some private islands, food and drinks are NOT included — they cost extra.",
    timeZoneAlert:
      "Harvest Caye is CST (UTC-6), often creating a 2-hour difference from ships based on Florida time.",
    excursionCategories: [
      { name: "Flighthouse Zipline", priceRange: { min: 85, max: 115 }, typicalDuration: "1-2 hours" },
      { name: "Mayan Ruins Nim Li Punit", priceRange: { min: 120, max: 180 }, typicalDuration: "4-5 hours" },
      { name: "Barrier Reef Snorkeling", priceRange: { min: 100, max: 145 }, typicalDuration: "3-4 hours" },
      { name: "River Tubing", priceRange: { min: 90, max: 130 }, typicalDuration: "3-4 hours" },
      { name: "Parasailing", priceRange: { min: 95, max: 125 }, typicalDuration: "1 hour" },
    ],
    freeActivities: [
      { name: "7-Acre Beach with Loungers", description: "Relax on the expansive white-sand beach with complimentary lounge chairs." },
      { name: "15,000 Sq Ft Lagoon Pool", description: "Take a dip in the massive lagoon-style pool at the heart of the island." },
      { name: "Wildlife Experience", description: "Visit the toucan aviary, butterfly garden, and wildlife sanctuary — free for all guests." },
    ],
    restaurants: [
      { name: "LandShark Bar & Grill", priceRange: "$$" },
      { name: "Flight House", priceRange: "$$" },
    ],
    gettingAround:
      "Tram from ship to resort. Everything is self-contained within the island.",
    emergencyInfo: {
      police: "On-site security",
      hospital: "On-site medical facility, coordinates with ship medical staff",
    },
    region: "western",
    imageUrl: "https://www.royalcaribbean.com/content/dam/royal/data/ports/belize-city-belize/belize-crystal-caves-limestone.jpg",
  },

  /* ================================================================ */
  /*  31. Great Stirrup Cay, Bahamas (NCL Private Island)             */
  /* ================================================================ */
  {
    slug: "great-stirrup-cay",
    name: "Great Stirrup Cay",
    country: "Bahamas (NCL Private Island)",
    coordinates: { lat: 25.8235, lng: -77.9015 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "N/A — private island",
    currency: "USD (ship card)",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Great Stirrup Cay is NCL's flagship private island in the Berry Islands, featuring a heated 28,000 sq ft lagoon pool, underwater snorkel sculpture garden, and Jumbey Beach Grill. Unlike Harvest Caye, food IS included in the cruise fare here, and beverage packages extend from ship to shore.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Swimming with Pigs", priceRange: { min: 110, max: 150 }, typicalDuration: "2-3 hours" },
      { name: "Flighthouse Zipline", priceRange: { min: 90, max: 125 }, typicalDuration: "1 hour" },
      { name: "Wave Runner Tour", priceRange: { min: 115, max: 160 }, typicalDuration: "1.5 hours" },
      { name: "Silver Cove Villa", priceRange: { min: 600, max: 1500 }, typicalDuration: "All day" },
      { name: "Stingray Encounter", priceRange: { min: 75, max: 110 }, typicalDuration: "1.5 hours" },
    ],
    freeActivities: [
      { name: "Jumbey Beach Grill", description: "Buffet lunch included free for all cruise guests — burgers, jerk chicken, and Caribbean fare." },
      { name: "Abaco Taco Bar", description: "Additional free dining option with tacos and tropical sides." },
      { name: "Underwater Snorkel Garden & Great Life Lagoon", description: "Explore the underwater sculpture garden and relax in the massive heated lagoon pool — all included." },
    ],
    restaurants: [
      { name: "Jumbey Beach Grill (included)", priceRange: "$" },
      { name: "Abaco Taco Bar (included)", priceRange: "$" },
    ],
    gettingAround:
      "Tram service from pier. Everything designed for easy walking.",
    emergencyInfo: {
      police: "On-site security",
      hospital: "On-site medical facility, coordinates with ship medical staff",
    },
    region: "bahamas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/Perfect_Day_Coco_Cay_PANO.jpg",
  },

  /* ================================================================ */
  /*  32. Celebration Key, Bahamas (Carnival Private Destination)     */
  /* ================================================================ */
  {
    slug: "celebration-key",
    name: "Celebration Key",
    country: "Bahamas (Carnival Private Destination)",
    coordinates: { lat: 26.52, lng: -78.7 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 10,
    walkingDistanceToTown: "N/A — private destination",
    currency: "USD (ship card)",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Celebration Key is Carnival's brand-new $100M+ private destination on Grand Bahama, opening July 19, 2025. Engineered to handle multiple Excel-class mega-ships simultaneously, it features four distinct zones: Calypso Lagoon (adults-only with 166-seat swim-up bar), Starfish Lagoon (family zone with Suncastle waterslides), Pearl Cove Beach Club (18+ premium retreat), and Lokono Cove (retail village).",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Premium Cabanas", priceRange: { min: 200, max: 800 }, typicalDuration: "All day" },
      { name: "Water Sports", priceRange: { min: 50, max: 150 }, typicalDuration: "1-2 hours" },
      { name: "Island Tours", priceRange: { min: 40, max: 100 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Beach Access", description: "Enjoy the pristine beaches across all four themed zones of the island." },
      { name: "Pools & Waterslides", description: "Multiple pool areas and Suncastle waterslides included with standard Carnival inclusions." },
    ],
    restaurants: [
      { name: "Multiple Dining Venues (details pending)", priceRange: "$$" },
    ],
    gettingAround:
      "Engineered for easy pedestrian flow between four themed zones.",
    emergencyInfo: {
      police: "On-site security",
      hospital: "On-site medical facility planned",
    },
    region: "bahamas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Gold_Rock_Beach_Grand_Bahama_Island.jpg",
  },

  /* ================================================================ */
  /*  33. Port Royal, Jamaica                                         */
  /* ================================================================ */
  {
    slug: "port-royal",
    name: "Port Royal",
    country: "Jamaica",
    coordinates: { lat: 17.9375, lng: -76.8415 },
    timezone: "EST (no DST)",
    safetyRating: 5,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "Immediate — small flat historical village",
    currency: "JMD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Port Royal is Jamaica's newest cruise port, offering a heritage-focused experience on the historic Palisadoes spit — once the 'wickedest city on earth' and the pirate capital of the Caribbean. The SeaWalk floating pier provides direct access to the quiet village, though reaching vibrant Kingston requires a taxi.",
    timeZoneAlert:
      "Ships from Florida may differ by 1 hour during summer EDT.",
    excursionCategories: [
      { name: "Bob Marley Museum & Kingston", priceRange: { min: 75, max: 110 }, typicalDuration: "4-5 hours" },
      { name: "Fort Charles & Giddy House", priceRange: { min: 25, max: 45 }, typicalDuration: "1.5-2 hours" },
      { name: "Blue Mountain Coffee Trail", priceRange: { min: 95, max: 135 }, typicalDuration: "5-6 hours" },
      { name: "Lime Cay Beach Day", priceRange: { min: 55, max: 85 }, typicalDuration: "3-4 hours" },
      { name: "Devon House Tour", priceRange: { min: 45, max: 65 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Walk Port Royal Village", description: "Explore the quiet historic village that was once the pirate capital of the Caribbean." },
      { name: "Fort Charles Exterior Views", description: "View the exterior of the historic fort and the famous Giddy House tilted by an earthquake." },
      { name: "Waterfront Promenade", description: "Stroll the waterfront with views across Kingston Harbour." },
    ],
    restaurants: [
      { name: "Gloria's Seafood City", priceRange: "$$" },
      { name: "Grand Port Royal Hotel", priceRange: "$$$" },
    ],
    gettingAround:
      "Taxis needed to reach Kingston (30+ minutes). Port Royal itself is easily walkable.",
    emergencyInfo: {
      police: "119",
      hospital: "Kingston Public Hospital",
      usConsulate: "Kingston 876-702-6000",
    },
    region: "western",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Port_Royal_in_Tranquility.jpg/1280px-Port_Royal_in_Tranquility.jpg",
  },

  /* ================================================================ */
  /*  HOMEPORTS                                                        */
  /* ================================================================ */

  /* ---------------------------------------------------------------- */
  /*  Miami, Florida                                                   */
  /* ---------------------------------------------------------------- */
  {
    slug: "miami",
    name: "Miami",
    country: "United States",
    coordinates: { lat: 25.7753, lng: -80.1800 },
    timezone: "EST/EDT",
    safetyRating: 7.5,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Downtown is adjacent to port; South Beach is 15 min by car",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "PortMiami is the cruise capital of the world, handling more passengers than any other port. Located on Dodge Island in Biscayne Bay, it's connected to downtown Miami by bridges. The city offers world-class dining, nightlife, art deco architecture, and beaches.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "South Beach & Art Deco Tour", priceRange: { min: 30, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Everglades Airboat Tour", priceRange: { min: 40, max: 80 }, typicalDuration: "4-5 hours" },
      { name: "Wynwood Walls Art District", priceRange: { min: 0, max: 20 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "South Beach", description: "Iconic beach with art deco architecture along Ocean Drive. Free to visit." },
      { name: "Bayside Marketplace", description: "Outdoor shopping and entertainment complex on the waterfront, near the port." },
      { name: "Little Havana - Calle Ocho", description: "Walk through Miami's Cuban cultural heart. Free to explore, with cheap cafecito everywhere." },
    ],
    restaurants: [
      { name: "Versailles (Little Havana)", priceRange: "$" },
      { name: "Joe's Stone Crab", priceRange: "$$$" },
      { name: "Casablanca Seafood Bar", priceRange: "$$" },
    ],
    gettingAround:
      "Uber/Lyft are plentiful. The free Metromover downtown connects to Metrorail. Taxis from port to South Beach ~$25-30. Many hotels offer port shuttle service.",
    emergencyInfo: {
      police: "911",
      hospital: "Jackson Memorial Hospital — 1611 NW 12th Ave",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Miami_Skyline_Brickell.jpg/1280px-Miami_Skyline_Brickell.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Fort Lauderdale (Port Everglades), Florida                       */
  /* ---------------------------------------------------------------- */
  {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale",
    country: "United States",
    coordinates: { lat: 26.0934, lng: -80.1120 },
    timezone: "EST/EDT",
    safetyRating: 8,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Port Everglades is 3 miles from Las Olas Blvd",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Port Everglades is one of the busiest cruise ports in the world, located in Fort Lauderdale. The city is known for its canals, beaches, and the upscale Las Olas Boulevard. Fort Lauderdale-Hollywood International Airport (FLL) is just minutes from the port.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Water Taxi Tour", priceRange: { min: 25, max: 35 }, typicalDuration: "2-3 hours" },
      { name: "Las Olas Boulevard Shopping", priceRange: { min: 0, max: 0 }, typicalDuration: "2-3 hours" },
      { name: "Flamingo Gardens", priceRange: { min: 20, max: 25 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Fort Lauderdale Beach", description: "Wide, clean beach along A1A with a promenade for walking and biking." },
      { name: "Riverwalk Fort Lauderdale", description: "Mile-long linear park along the New River with public art and scenic views." },
      { name: "Hugh Taylor Birch State Park", description: "Coastal hammock park with nature trails and a freshwater lagoon." },
    ],
    restaurants: [
      { name: "Casablanca Cafe", priceRange: "$$" },
      { name: "Coconuts by the water", priceRange: "$$" },
      { name: "Rustic Inn Crabhouse", priceRange: "$$" },
    ],
    gettingAround:
      "Uber/Lyft from port to beach ~$10-15. Water Taxi covers the Intracoastal ($28 all day). Sun Trolley has free and $1 routes. The port is NOT walkable to main attractions.",
    emergencyInfo: {
      police: "911",
      hospital: "Broward Health Medical Center — 1600 S Andrews Ave",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Fort_Lauderdale_skyline_2024.jpg/1280px-Fort_Lauderdale_skyline_2024.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Port Canaveral (Orlando), Florida                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "port-canaveral",
    name: "Port Canaveral",
    country: "United States",
    coordinates: { lat: 28.4085, lng: -80.6327 },
    timezone: "EST/EDT",
    safetyRating: 9,
    walkabilityRating: 2,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Cocoa Beach is 5 min by car; Orlando theme parks 45-60 min",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Port Canaveral serves the Orlando area and is the departure point for many Disney, Carnival, Royal Caribbean, and Norwegian sailings. The Kennedy Space Center is just 15 minutes away, and Orlando's theme parks are about an hour's drive.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Kennedy Space Center", priceRange: { min: 57, max: 80 }, typicalDuration: "4-6 hours" },
      { name: "Cocoa Beach Day", priceRange: { min: 0, max: 20 }, typicalDuration: "3-4 hours" },
      { name: "Airboat Ride", priceRange: { min: 30, max: 50 }, typicalDuration: "1-2 hours" },
    ],
    freeActivities: [
      { name: "Cocoa Beach", description: "Classic Florida beach town with surfing, swimming, and Ron Jon Surf Shop nearby." },
      { name: "Jetty Park Beach", description: "Right next to the port — watch ships come and go from the beach or fishing pier." },
      { name: "Exploration Tower", description: "Seven-story observation tower at the port with exhibits about the region ($7 entry)." },
    ],
    restaurants: [
      { name: "Grills Seafood Deck", priceRange: "$$" },
      { name: "Fishlips Waterfront", priceRange: "$$" },
      { name: "Fat Kahuna's", priceRange: "$" },
    ],
    gettingAround:
      "You need a car or rideshare for anything beyond the port area. Uber/Lyft to Cocoa Beach ~$10. Shuttles to Orlando International Airport available (~$35/person).",
    emergencyInfo: {
      police: "911",
      hospital: "Health First Cape Canaveral Hospital",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Port_Canaveral_Florida.jpg/1280px-Port_Canaveral_Florida.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Galveston, Texas                                                 */
  /* ---------------------------------------------------------------- */
  {
    slug: "galveston",
    name: "Galveston",
    country: "United States",
    coordinates: { lat: 29.2856, lng: -94.7977 },
    timezone: "CST/CDT",
    safetyRating: 7.5,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "The Strand historic district is 5 min walk from port",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Galveston is a barrier island city on the Texas Gulf Coast and a major cruise port for Carnival and Royal Caribbean. The historic Strand district offers Victorian architecture, shops, and restaurants. Seawall Boulevard runs along miles of beach.",
    timeZoneAlert: "Galveston is Central Time — 1 hour behind Eastern. Confirm ship times if connecting from East Coast.",
    excursionCategories: [
      { name: "Moody Gardens", priceRange: { min: 30, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Strand Historic District Tour", priceRange: { min: 0, max: 20 }, typicalDuration: "2-3 hours" },
      { name: "Pleasure Pier Amusement Park", priceRange: { min: 20, max: 40 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Seawall Beach", description: "Miles of free public beach along the famous Galveston Seawall." },
      { name: "The Strand District", description: "Walk the historic downtown with 19th-century architecture, galleries, and shops." },
      { name: "Pier 21", description: "Waterfront area with the Texas Seaport Museum and harbor views." },
    ],
    restaurants: [
      { name: "Gaido's Seafood", priceRange: "$$" },
      { name: "The Spot", priceRange: "$" },
      { name: "Miller's Seawall Grill", priceRange: "$$" },
    ],
    gettingAround:
      "The Strand is walkable from port. Uber/Lyft available. Island Transit buses run along the Seawall. Houston Hobby Airport is ~75 min drive.",
    emergencyInfo: {
      police: "911",
      hospital: "UTMB Health — 301 University Blvd",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Galveston_Texas_Pleasure_Pier.jpg/1280px-Galveston_Texas_Pleasure_Pier.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Tampa, Florida                                                   */
  /* ---------------------------------------------------------------- */
  {
    slug: "tampa",
    name: "Tampa",
    country: "United States",
    coordinates: { lat: 27.9420, lng: -82.4465 },
    timezone: "EST/EDT",
    safetyRating: 8,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Ybor City and Channelside are 10 min walk from port",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Tampa's cruise terminal is on the Channelside waterfront, close to downtown. The city offers the historic Ybor City district, Busch Gardens theme park, and is near the beaches of Clearwater and St. Pete. A popular departure point for Western Caribbean cruises.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Busch Gardens", priceRange: { min: 80, max: 120 }, typicalDuration: "6-8 hours" },
      { name: "Clearwater Beach Day", priceRange: { min: 0, max: 30 }, typicalDuration: "4-5 hours" },
      { name: "Ybor City Walking Tour", priceRange: { min: 0, max: 25 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Tampa Riverwalk", description: "2.6-mile waterfront path connecting parks, museums, and restaurants along the Hillsborough River." },
      { name: "Ybor City", description: "Tampa's historic Latin Quarter with cobblestone streets, cigar shops, and nightlife." },
      { name: "Curtis Hixon Park", description: "Downtown waterfront park with skyline views and regular events." },
    ],
    restaurants: [
      { name: "Columbia Restaurant (Ybor)", priceRange: "$$" },
      { name: "Ulele", priceRange: "$$$" },
      { name: "Datz", priceRange: "$$" },
    ],
    gettingAround:
      "TECO Line streetcar connects the port area to Ybor City (free). Uber/Lyft to Clearwater Beach ~$35-40. Tampa International Airport is 20 min from port.",
    emergencyInfo: {
      police: "911",
      hospital: "Tampa General Hospital — 1 Tampa General Circle",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Tampa_FL_skyline_from_Platt_St_bridge_-_2022.jpg/1280px-Tampa_FL_skyline_from_Platt_St_bridge_-_2022.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  New Orleans, Louisiana                                           */
  /* ---------------------------------------------------------------- */
  {
    slug: "new-orleans",
    name: "New Orleans",
    country: "United States",
    coordinates: { lat: 29.9435, lng: -90.0591 },
    timezone: "CST/CDT",
    safetyRating: 6.5,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "French Quarter is a 10 min walk from the cruise terminal",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "The Julia Street Cruise Terminal sits along the Mississippi River, walking distance from the French Quarter. New Orleans offers incredible food, live jazz, and unique culture. Many cruisers arrive a day or two early to enjoy the city.",
    timeZoneAlert: "New Orleans is Central Time — 1 hour behind Eastern.",
    excursionCategories: [
      { name: "French Quarter Walking Tour", priceRange: { min: 20, max: 40 }, typicalDuration: "2-3 hours" },
      { name: "Swamp Tour", priceRange: { min: 30, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Plantation Tour", priceRange: { min: 50, max: 80 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Jackson Square", description: "Iconic plaza with street performers, artists, and St. Louis Cathedral." },
      { name: "Bourbon Street", description: "The legendary nightlife strip — free to walk and soak in the atmosphere." },
      { name: "Magazine Street", description: "Six miles of local shops, galleries, and restaurants through the Garden District." },
    ],
    restaurants: [
      { name: "Café Du Monde", priceRange: "$" },
      { name: "Commander's Palace", priceRange: "$$$" },
      { name: "Central Grocery (Muffuletta)", priceRange: "$" },
    ],
    gettingAround:
      "The French Quarter is very walkable from the port. St. Charles Streetcar ($1.25) runs to the Garden District. Uber/Lyft plentiful. Louis Armstrong Airport (MSY) is 30 min by car.",
    emergencyInfo: {
      police: "911",
      hospital: "University Medical Center — 2000 Canal St",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/New_Orleans_Skyline_from_Crescent_Park.jpg/1280px-New_Orleans_Skyline_from_Crescent_Park.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Baltimore, Maryland                                              */
  /* ---------------------------------------------------------------- */
  {
    slug: "baltimore",
    name: "Baltimore",
    country: "United States",
    coordinates: { lat: 39.2654, lng: -76.5779 },
    timezone: "EST/EDT",
    safetyRating: 6,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Inner Harbor attractions are steps from the cruise terminal",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Baltimore's cruise terminal at the South Locust Point Marine Terminal is minutes from the Inner Harbor. The city offers the National Aquarium, historic Fells Point, and amazing seafood. A convenient no-fly option for mid-Atlantic cruisers.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "National Aquarium", priceRange: { min: 40, max: 50 }, typicalDuration: "2-3 hours" },
      { name: "Fort McHenry Tour", priceRange: { min: 10, max: 15 }, typicalDuration: "1-2 hours" },
      { name: "Fells Point Food Tour", priceRange: { min: 50, max: 70 }, typicalDuration: "3 hours" },
    ],
    freeActivities: [
      { name: "Inner Harbor Promenade", description: "Walk along the waterfront past historic ships, restaurants, and the marina." },
      { name: "Fells Point", description: "Cobblestone streets with pubs, shops, and the oldest standing residence in Baltimore." },
      { name: "Federal Hill Park", description: "Hilltop park with panoramic views of the Inner Harbor and downtown skyline." },
    ],
    restaurants: [
      { name: "LP Steamers (crab house)", priceRange: "$$" },
      { name: "Thames Street Oyster House", priceRange: "$$$" },
      { name: "Lexington Market", priceRange: "$" },
    ],
    gettingAround:
      "Water Taxi connects the terminal to Inner Harbor, Fells Point, and Canton ($14/day). Charm City Circulator bus is free. Uber/Lyft available. BWI Airport is 20 min south.",
    emergencyInfo: {
      police: "911",
      hospital: "Johns Hopkins Hospital — 1800 Orleans St",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Baltimore_Inner_Harbor_Panorama.jpg/1280px-Baltimore_Inner_Harbor_Panorama.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Norfolk, Virginia                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "norfolk",
    name: "Norfolk",
    country: "United States",
    coordinates: { lat: 36.8460, lng: -76.2951 },
    timezone: "EST/EDT",
    safetyRating: 7.5,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Downtown waterfront is adjacent to Half Moone Cruise Terminal",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Norfolk's Half Moone Cruise Terminal sits on the downtown waterfront, making it one of the most walkable U.S. homeports. Home to the world's largest naval station, Norfolk offers nautical heritage, the Chrysler Museum of Art, and access to Virginia Beach.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Naval Station Norfolk Tour", priceRange: { min: 0, max: 15 }, typicalDuration: "1-2 hours" },
      { name: "Virginia Beach Day Trip", priceRange: { min: 0, max: 30 }, typicalDuration: "4-5 hours" },
      { name: "Nauticus & Battleship Wisconsin", priceRange: { min: 15, max: 20 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Town Point Park", description: "Waterfront park along the Elizabeth River with walking paths and views." },
      { name: "Chrysler Museum of Art", description: "World-class art museum with free admission, including a glass studio." },
      { name: "Freemason District", description: "Historic neighborhood with 18th-century homes and cobblestone sidewalks." },
    ],
    restaurants: [
      { name: "Freemason Abbey", priceRange: "$$" },
      { name: "Saltine", priceRange: "$$$" },
      { name: "Doumar's (historic drive-in)", priceRange: "$" },
    ],
    gettingAround:
      "Downtown is walkable from the terminal. The Tide light rail connects to Virginia Beach direction. Norfolk International Airport is 15 min by car.",
    emergencyInfo: {
      police: "911",
      hospital: "Sentara Norfolk General — 600 Gresham Dr",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Norfolk_Skyline_Panorama.jpg/1280px-Norfolk_Skyline_Panorama.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Manhattan (New York City), New York                              */
  /* ---------------------------------------------------------------- */
  {
    slug: "manhattan",
    name: "Manhattan",
    country: "United States",
    coordinates: { lat: 40.7648, lng: -73.9998 },
    timezone: "EST/EDT",
    safetyRating: 7,
    walkabilityRating: 10,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Manhattan Cruise Terminal is at Pier 88-90 on the Hudson, midtown",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "The Manhattan Cruise Terminal (Piers 88-90) sits on the west side of Midtown, steps from Times Square and Hell's Kitchen. Sailing in or out of New York City offers iconic views of the Statue of Liberty and Manhattan skyline. One of the most exciting embarkation experiences in cruising.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Statue of Liberty & Ellis Island", priceRange: { min: 20, max: 25 }, typicalDuration: "4-5 hours" },
      { name: "Broadway Show", priceRange: { min: 80, max: 300 }, typicalDuration: "3 hours" },
      { name: "Central Park Bike Tour", priceRange: { min: 35, max: 50 }, typicalDuration: "2 hours" },
    ],
    freeActivities: [
      { name: "Times Square", description: "The iconic crossroads of the world — bright lights, street performers, and energy." },
      { name: "High Line", description: "Elevated linear park built on a former rail line with city views and public art." },
      { name: "Central Park", description: "843 acres of urban parkland with trails, lakes, and free performances." },
    ],
    restaurants: [
      { name: "Joe's Pizza", priceRange: "$" },
      { name: "Los Tacos No.1 (Chelsea Market)", priceRange: "$" },
      { name: "The Smith", priceRange: "$$" },
    ],
    gettingAround:
      "NYC subway is the fastest way around ($2.90/ride). Uber/Lyft available but traffic is heavy. The terminal is near the 42nd St subway stations. JFK is 60-90 min; Newark (EWR) is 45-60 min.",
    emergencyInfo: {
      police: "911",
      hospital: "Mount Sinai West — 1000 10th Ave",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1280px-New_york_times_square-terabass.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Seattle, Washington                                              */
  /* ---------------------------------------------------------------- */
  {
    slug: "seattle",
    name: "Seattle",
    country: "United States",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    timezone: "PST/PDT",
    safetyRating: 7,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Pike Place Market is 10 min walk from Pier 91",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Seattle is the primary embarkation point for Alaska cruises. The city offers Pike Place Market, the Space Needle, a thriving food scene, and stunning Pacific Northwest scenery. Most cruisers spend a day or two exploring before or after their Alaska voyage.",
    timeZoneAlert: "Seattle is Pacific Time — 3 hours behind Eastern.",
    excursionCategories: [
      { name: "Pike Place Market Tour", priceRange: { min: 30, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "Space Needle + Chihuly Garden", priceRange: { min: 50, max: 70 }, typicalDuration: "2-3 hours" },
      { name: "Underground Tour", priceRange: { min: 22, max: 28 }, typicalDuration: "1.5 hours" },
    ],
    freeActivities: [
      { name: "Pike Place Market", description: "Iconic farmers market with fish-throwing vendors, craft stalls, and the original Starbucks." },
      { name: "Olympic Sculpture Park", description: "Free outdoor sculpture park on the waterfront with mountain views." },
      { name: "Pioneer Square", description: "Seattle's oldest neighborhood with galleries, bookshops, and brick architecture." },
    ],
    restaurants: [
      { name: "Pike Place Chowder", priceRange: "$" },
      { name: "Ivar's Acres of Clams", priceRange: "$$" },
      { name: "Japonessa", priceRange: "$$$" },
    ],
    gettingAround:
      "Link Light Rail connects the airport to downtown ($3). Buses are plentiful. Seattle is walkable downtown. Uber/Lyft from airport to cruise terminal ~$40-50. Sea-Tac Airport (SEA) is 30-45 min south.",
    emergencyInfo: {
      police: "911",
      hospital: "Virginia Mason Medical Center — 1100 9th Ave",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Seattle_Kerry_Park_Skyline.jpg/1280px-Seattle_Kerry_Park_Skyline.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Vancouver, British Columbia                                      */
  /* ---------------------------------------------------------------- */
  {
    slug: "vancouver",
    name: "Vancouver",
    country: "Canada",
    coordinates: { lat: 49.2880, lng: -123.1115 },
    timezone: "PST/PDT",
    safetyRating: 9,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Canada Place cruise terminal is in the heart of downtown",
    currency: "CAD",
    usdAccepted: false,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Canada Place is one of the most scenic cruise terminals in the world, set against a backdrop of mountains and the waterfront. Vancouver is a vibrant, multicultural city known for Stanley Park, Granville Island, and exceptional Asian cuisine. A major Alaska cruise homeport.",
    timeZoneAlert: "Vancouver is Pacific Time — 3 hours behind Eastern.",
    excursionCategories: [
      { name: "Stanley Park & Aquarium", priceRange: { min: 0, max: 40 }, typicalDuration: "3-4 hours" },
      { name: "Capilano Suspension Bridge", priceRange: { min: 50, max: 60 }, typicalDuration: "3 hours" },
      { name: "Granville Island Market", priceRange: { min: 0, max: 0 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Stanley Park Seawall", description: "10 km paved path around the park with mountain and ocean views. Walk, bike, or rollerblade." },
      { name: "Gastown", description: "Vancouver's oldest neighborhood with the Steam Clock, galleries, and cafes." },
      { name: "English Bay Beach", description: "Sandy urban beach popular for sunset watching, a short walk from downtown." },
    ],
    restaurants: [
      { name: "Japadog", priceRange: "$" },
      { name: "Miku (waterfront sushi)", priceRange: "$$$" },
      { name: "Granville Island Public Market", priceRange: "$" },
    ],
    gettingAround:
      "Canada Line SkyTrain connects airport to downtown in 25 min ($9 CAD). Downtown is very walkable. Aquabus ferry to Granville Island ($4 CAD). Uber/Lyft available.",
    emergencyInfo: {
      police: "911",
      hospital: "St. Paul's Hospital — 1081 Burrard St",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Vancouver_skyline_from_Stanley_Park.jpg/1280px-Vancouver_skyline_from_Stanley_Park.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Mobile, Alabama                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "mobile",
    name: "Mobile",
    country: "United States",
    coordinates: { lat: 30.6954, lng: -88.0399 },
    timezone: "CST/CDT",
    safetyRating: 7,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "Dauphin Street downtown is 5-10 min walk from terminal",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Mobile's cruise terminal on the Mobile River serves as a budget-friendly departure point for Western Caribbean cruises, primarily with Carnival. The city is the birthplace of Mardi Gras in America and features a charming downtown with French-influenced architecture.",
    timeZoneAlert: "Mobile is Central Time — 1 hour behind Eastern.",
    excursionCategories: [
      { name: "USS Alabama Battleship Park", priceRange: { min: 15, max: 20 }, typicalDuration: "2-3 hours" },
      { name: "Bellingrath Gardens", priceRange: { min: 22, max: 30 }, typicalDuration: "3-4 hours" },
      { name: "Gulf Shores Beach Day", priceRange: { min: 0, max: 20 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Dauphin Street", description: "Downtown's main drag with bars, restaurants, and art galleries." },
      { name: "Bienville Square", description: "Historic park surrounded by iron-lace balconied buildings." },
      { name: "Mobile Carnival Museum", description: "Learn about Mobile's Mardi Gras traditions (small entry fee)." },
    ],
    restaurants: [
      { name: "Wintzell's Oyster House", priceRange: "$" },
      { name: "The Noble South", priceRange: "$$$" },
      { name: "Callaghan's Irish Social Club", priceRange: "$" },
    ],
    gettingAround:
      "Downtown is walkable from the terminal. Uber/Lyft for anything beyond downtown. Mobile Regional Airport (MOB) is 25 min away. Gulf Shores Beach is 1 hour south.",
    emergencyInfo: {
      police: "911",
      hospital: "Mobile Infirmary — 5 Mobile Infirmary Circle",
    },
    region: "homeport",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mobile_Alabama_skyline.jpg/1280px-Mobile_Alabama_skyline.jpg",
  },

  /* ================================================================ */
  /*  ALASKA PORTS                                                     */
  /* ================================================================ */

  /* ---------------------------------------------------------------- */
  /*  Juneau, Alaska                                                   */
  /* ---------------------------------------------------------------- */
  {
    slug: "juneau",
    name: "Juneau",
    country: "United States",
    coordinates: { lat: 58.3005, lng: -134.4197 },
    timezone: "AKST/AKDT",
    safetyRating: 9.5,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "Downtown is directly adjacent to the cruise ship docks",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Alaska's capital city is only accessible by sea or air — there are no roads in or out. Juneau is surrounded by the Tongass National Forest and sits at the foot of Mount Juneau and Mount Roberts. Mendenhall Glacier is just 12 miles from downtown. One of the most popular Alaska cruise stops.",
    timeZoneAlert: "Juneau is Alaska Time — 4 hours behind Eastern, 1 hour behind Pacific.",
    excursionCategories: [
      { name: "Mendenhall Glacier & Whale Watch", priceRange: { min: 150, max: 250 }, typicalDuration: "4-5 hours" },
      { name: "Dog Sled on Glacier (Helicopter)", priceRange: { min: 500, max: 650 }, typicalDuration: "3-4 hours" },
      { name: "Whale Watching Cruise", priceRange: { min: 100, max: 180 }, typicalDuration: "3-4 hours" },
      { name: "Rainforest Zipline", priceRange: { min: 150, max: 200 }, typicalDuration: "3 hours" },
      { name: "Mendenhall Glacier Trek", priceRange: { min: 180, max: 250 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "Downtown Juneau Walking", description: "Explore the compact downtown with gift shops, galleries, the Capitol building, and the Red Dog Saloon." },
      { name: "Mount Roberts Trails", description: "Free hiking trails start right from the cruise ship dock. The lower basin trail is beginner-friendly." },
      { name: "Juneau-Douglas Bridge Viewpoint", description: "Walk to the bridge for panoramic views of the Gastineau Channel." },
    ],
    restaurants: [
      { name: "Tracy's King Crab Shack", priceRange: "$$" },
      { name: "The Hangar on the Wharf", priceRange: "$$" },
      { name: "Deckhand Dave's (fish tacos)", priceRange: "$" },
    ],
    gettingAround:
      "Downtown is very walkable from the docks. City buses run to Mendenhall Glacier ($2). Taxi to glacier ~$35. Most excursions include pickup at the dock.",
    emergencyInfo: {
      police: "911",
      hospital: "Bartlett Regional Hospital — 3260 Hospital Dr",
    },
    region: "alaska",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Juneau_from_Douglas_Island.jpg/1280px-Juneau_from_Douglas_Island.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Ketchikan, Alaska                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "ketchikan",
    name: "Ketchikan",
    country: "United States",
    coordinates: { lat: 55.3422, lng: -131.6461 },
    timezone: "AKST/AKDT",
    safetyRating: 9.5,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Creek Street and downtown are steps from the cruise berths",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Known as the 'Salmon Capital of the World,' Ketchikan is often the first Alaska port of call for northbound cruises from Seattle. The town stretches along the waterfront with colorful Creek Street boardwalk, totem pole parks, and surrounded by the Tongass National Forest.",
    timeZoneAlert: "Ketchikan is Alaska Time — 4 hours behind Eastern.",
    excursionCategories: [
      { name: "Misty Fjords Flightseeing", priceRange: { min: 250, max: 350 }, typicalDuration: "2-3 hours" },
      { name: "Salmon Fishing Charter", priceRange: { min: 200, max: 300 }, typicalDuration: "4-5 hours" },
      { name: "Lumberjack Show", priceRange: { min: 40, max: 45 }, typicalDuration: "1.5 hours" },
      { name: "Totem Pole & Nature Tour", priceRange: { min: 60, max: 100 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Creek Street", description: "Historic boardwalk built on stilts over Ketchikan Creek — the former red-light district, now shops and galleries." },
      { name: "Totem Heritage Center", description: "Small museum with the world's largest collection of unrestored 19th-century totem poles ($6 entry)." },
      { name: "Salmon Ladder at Creek Street", description: "In season (July-Sept), watch salmon swimming upstream right through downtown." },
    ],
    restaurants: [
      { name: "Alaska Fish House", priceRange: "$$" },
      { name: "Bar Harbor Restaurant", priceRange: "$$" },
      { name: "Annabelle's (at the Gilmore Hotel)", priceRange: "$$" },
    ],
    gettingAround:
      "Very walkable downtown. The local bus goes to Totem Bight State Park (free). Most excursions pick up at the dock. Taxis available for Saxman Village (~$15).",
    emergencyInfo: {
      police: "911",
      hospital: "PeaceHealth Ketchikan Medical Center",
    },
    region: "alaska",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ketchikan_-_Creek_Street.jpg/1280px-Ketchikan_-_Creek_Street.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Skagway, Alaska                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "skagway",
    name: "Skagway",
    country: "United States",
    coordinates: { lat: 59.4583, lng: -135.3139 },
    timezone: "AKST/AKDT",
    safetyRating: 10,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Broadway Street shops start 2 min from the dock",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "A Gold Rush-era town at the head of the Lynn Canal, Skagway was the gateway to the Klondike Gold Rush in 1898. Today its restored boardwalk downtown (part of a National Historic District) welcomes cruise ships. The White Pass & Yukon Route railroad is the star attraction.",
    timeZoneAlert: "Skagway is Alaska Time — 4 hours behind Eastern.",
    excursionCategories: [
      { name: "White Pass & Yukon Route Railroad", priceRange: { min: 120, max: 250 }, typicalDuration: "3-4 hours" },
      { name: "Yukon Suspension Bridge & Sled Dogs", priceRange: { min: 150, max: 200 }, typicalDuration: "3-4 hours" },
      { name: "Chilkoot Trail Hike", priceRange: { min: 80, max: 150 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Broadway Street", description: "Walk the restored Gold Rush-era main street with wooden boardwalks, saloons, and shops." },
      { name: "Gold Rush Cemetery", description: "Short hike to the cemetery where notorious outlaw Soapy Smith is buried. Lower Reid Falls nearby." },
      { name: "Klondike Gold Rush NHP Visitor Center", description: "Free National Park Service center with ranger talks and gold rush history exhibits." },
    ],
    restaurants: [
      { name: "Skagway Brewing Co.", priceRange: "$$" },
      { name: "Starfire (Thai)", priceRange: "$$" },
      { name: "Bonanza Bar & Grill", priceRange: "$" },
    ],
    gettingAround:
      "Everything in town is walkable. The SMART bus runs free in summer. Most excursions pick up at the dock or on Broadway. No taxis needed for downtown.",
    emergencyInfo: {
      police: "911",
      hospital: "Dahl Memorial Clinic — 350 14th Ave",
    },
    region: "alaska",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Skagway_Alaska_Broadway.jpg/1280px-Skagway_Alaska_Broadway.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Sitka, Alaska                                                    */
  /* ---------------------------------------------------------------- */
  {
    slug: "sitka",
    name: "Sitka",
    country: "United States",
    coordinates: { lat: 57.0531, lng: -135.3300 },
    timezone: "AKST/AKDT",
    safetyRating: 9.5,
    walkabilityRating: 7,
    isTenderPort: true,
    typicalPortHours: 7,
    walkingDistanceToTown: "Tender drops at the downtown lightering facility; 5 min walk to Lincoln Street",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Sitka sits on the outer coast of Baranof Island, facing the open Pacific. It was the capital of Russian America and the site of Alaska's transfer from Russia to the US in 1867. The town blends Tlingit and Russian heritage with stunning natural scenery including Mount Edgecumbe.",
    timeZoneAlert: "Sitka is Alaska Time — 4 hours behind Eastern.",
    excursionCategories: [
      { name: "Sea Otter & Wildlife Quest", priceRange: { min: 120, max: 180 }, typicalDuration: "3 hours" },
      { name: "Sitka Sound Kayaking", priceRange: { min: 100, max: 150 }, typicalDuration: "2.5 hours" },
      { name: "Fortress of the Bear (rescue center)", priceRange: { min: 15, max: 35 }, typicalDuration: "1-2 hours" },
    ],
    freeActivities: [
      { name: "Sitka National Historical Park", description: "Totem-lined trail through coastal rainforest at the site of the 1804 Tlingit-Russian battle. Free entry." },
      { name: "St. Michael's Cathedral", description: "Iconic Russian Orthodox cathedral in the center of town (small entry fee)." },
      { name: "Castle Hill", description: "Short climb to the spot where the Alaska transfer ceremony took place. Panoramic views." },
    ],
    restaurants: [
      { name: "Ludvig's Bistro", priceRange: "$$$" },
      { name: "The Larkspur Cafe", priceRange: "$$" },
      { name: "Highliner Coffee", priceRange: "$" },
    ],
    gettingAround:
      "Downtown is walkable. Free shuttle buses run between the tender dock and town. Taxis go to Fortress of the Bear (~$20). Sitka is a tender port — weather can affect schedule.",
    emergencyInfo: {
      police: "911",
      hospital: "SEARHC Mt. Edgecumbe Hospital",
    },
    region: "alaska",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sitka_Alaska.jpg/1280px-Sitka_Alaska.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Icy Strait Point, Alaska                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: "icy-strait-point",
    name: "Icy Strait Point",
    country: "United States",
    coordinates: { lat: 58.1298, lng: -135.4443 },
    timezone: "AKST/AKDT",
    safetyRating: 10,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Hoonah is a 1.5 mile walk from the cruise dock",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Icy Strait Point is a privately owned cruise destination near the Tlingit village of Hoonah on Chichagof Island. It's home to the world's largest zipline (ZipRider) and offers authentic Alaska wilderness experiences including whale watching in nearby Point Adolphus, one of the best humpback whale habitats in the world.",
    timeZoneAlert: "Alaska Time — 4 hours behind Eastern.",
    excursionCategories: [
      { name: "ZipRider (world's largest zipline)", priceRange: { min: 150, max: 180 }, typicalDuration: "1 hour" },
      { name: "Whale & Marine Mammals Cruise", priceRange: { min: 170, max: 220 }, typicalDuration: "2.5-3 hours" },
      { name: "Brown Bear Search", priceRange: { min: 200, max: 280 }, typicalDuration: "3 hours" },
    ],
    freeActivities: [
      { name: "Hoonah Village Walk", description: "Walk to the small Tlingit village of Hoonah — one of the largest Tlingit communities in Alaska." },
      { name: "Beach & Shoreline Walks", description: "Explore the wild shoreline and look for eagles, seals, and sea otters." },
      { name: "Cannery Museum", description: "Restored 1912 salmon cannery with exhibits on the fishing and Tlingit history." },
    ],
    restaurants: [
      { name: "The Crab Station", priceRange: "$$" },
      { name: "The Cookhouse", priceRange: "$$" },
    ],
    gettingAround:
      "Shuttle runs between the dock and Hoonah village. This is a wilderness destination — most visitors stick to the excursion area or walk to Hoonah.",
    emergencyInfo: {
      police: "911",
      hospital: "Hoonah Medical Clinic",
    },
    region: "alaska",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Icy_Strait_Point_Alaska.jpg/1280px-Icy_Strait_Point_Alaska.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Victoria, British Columbia                                       */
  /* ---------------------------------------------------------------- */
  {
    slug: "victoria",
    name: "Victoria",
    country: "Canada",
    coordinates: { lat: 48.4284, lng: -123.3656 },
    timezone: "PST/PDT",
    safetyRating: 9.5,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Inner Harbour and downtown are directly at the cruise ship dock",
    currency: "CAD",
    usdAccepted: false,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Victoria is the charming capital of British Columbia, on the southern tip of Vancouver Island. With its English gardens, historic parliament buildings, and the famous Empress Hotel overlooking the Inner Harbour, it's often called the most British city in Canada. A common stop on Alaska cruise itineraries.",
    timeZoneAlert: "Victoria is Pacific Time — 3 hours behind Eastern.",
    excursionCategories: [
      { name: "Butchart Gardens", priceRange: { min: 35, max: 100 }, typicalDuration: "3-4 hours" },
      { name: "Whale Watching", priceRange: { min: 100, max: 150 }, typicalDuration: "3 hours" },
      { name: "Royal BC Museum", priceRange: { min: 20, max: 30 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Inner Harbour Walk", description: "Stroll the picturesque harbour front past the Empress Hotel, Parliament, and street performers." },
      { name: "Beacon Hill Park", description: "200-acre park with gardens, a petting zoo, and views of the Olympic Mountains and Strait of Juan de Fuca." },
      { name: "Fisherman's Wharf", description: "Colorful floating homes and food stalls with fish & chips and ice cream. Watch for harbour seals." },
    ],
    restaurants: [
      { name: "Red Fish Blue Fish (wharf)", priceRange: "$" },
      { name: "Il Terrazzo", priceRange: "$$$" },
      { name: "Jam Cafe", priceRange: "$$" },
    ],
    gettingAround:
      "Downtown is extremely walkable from the cruise dock. Double-decker hop-on-hop-off buses are popular ($40 CAD). Local buses go to Butchart Gardens. Taxis available.",
    emergencyInfo: {
      police: "911",
      hospital: "Royal Jubilee Hospital — 1952 Bay St",
    },
    region: "alaska",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/British_Columbia_Parliament_Buildings_-_Victoria.jpg/1280px-British_Columbia_Parliament_Buildings_-_Victoria.jpg",
  },

  /* ================================================================ */
  /*  PRIVATE ISLANDS                                                  */
  /* ================================================================ */

  /* ---------------------------------------------------------------- */
  /*  Bimini, Bahamas                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "bimini",
    name: "Bimini",
    country: "Bahamas",
    coordinates: { lat: 25.7267, lng: -79.2694 },
    timezone: "EST/EDT",
    safetyRating: 9,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Resorts World Bimini is at the dock; Alice Town is a short shuttle ride",
    currency: "BSD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "limited",
    overview:
      "Bimini is the westernmost island in the Bahamas, just 50 miles from Miami. It's a key stop for Virgin Voyages' short Caribbean cruises. The island features Resorts World Bimini with a beach club, pools, and casino, plus the famous crystal-clear waters that Hemingway loved.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Beach Club Day Pass", priceRange: { min: 0, max: 60 }, typicalDuration: "4-5 hours" },
      { name: "Snorkeling Trip", priceRange: { min: 50, max: 80 }, typicalDuration: "2-3 hours" },
      { name: "Deep Sea Fishing", priceRange: { min: 150, max: 300 }, typicalDuration: "4 hours" },
    ],
    freeActivities: [
      { name: "Radio Beach", description: "Beautiful public beach on North Bimini, popular with locals and visitors." },
      { name: "Alice Town Walk", description: "Tiny main street with colorful bars and shops — Hemingway's old haunts." },
    ],
    restaurants: [
      { name: "Stuart's Conch Stand", priceRange: "$" },
      { name: "Sabor (Resorts World)", priceRange: "$$" },
    ],
    gettingAround:
      "Golf cart rentals are the main transport ($80/day). Shuttle from dock to Alice Town. The island is tiny — everything is close.",
    emergencyInfo: {
      police: "911 or 919",
      hospital: "Bimini Medical Clinic — Alice Town",
    },
    region: "private-island",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Bimini_Bahamas.jpg/1280px-Bimini_Bahamas.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Half Moon Cay, Bahamas (Carnival/HAL)                            */
  /* ---------------------------------------------------------------- */
  {
    slug: "half-moon-cay",
    name: "Half Moon Cay",
    country: "Bahamas",
    coordinates: { lat: 24.2208, lng: -75.7600 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 6,
    isTenderPort: true,
    typicalPortHours: 6,
    walkingDistanceToTown: "N/A — private island with beach area at the tender landing",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "none",
    cellularCoverage: "none",
    overview:
      "Half Moon Cay (officially Little San Salvador Island) is Carnival Corporation's private island in the Bahamas. It features a stunning 2-mile white sand beach, consistently rated among the best private cruise islands. Used by Carnival and Holland America ships. Tender required.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Horseback Riding on Beach", priceRange: { min: 100, max: 130 }, typicalDuration: "1.5 hours" },
      { name: "Stingray Adventure", priceRange: { min: 50, max: 70 }, typicalDuration: "1 hour" },
      { name: "Private Cabana Rental", priceRange: { min: 300, max: 600 }, typicalDuration: "All day" },
    ],
    freeActivities: [
      { name: "Beach", description: "Two miles of white sand beach with free lounge chairs. The main reason to visit." },
      { name: "Nature Trail", description: "Short hiking trail through the island's interior with birdwatching opportunities." },
    ],
    restaurants: [
      { name: "Complimentary BBQ Lunch", priceRange: "$" },
      { name: "Captain Morgan Bar", priceRange: "$" },
    ],
    gettingAround:
      "Walk along the beach. Tram service connects the tender landing to the far end of the beach. This is a small, self-contained beach destination.",
    emergencyInfo: {
      police: "Ship security",
      hospital: "Ship's medical center — no hospital on island",
    },
    region: "private-island",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Half_Moon_Cay.jpg/1280px-Half_Moon_Cay.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Ocean Cay MSC Marine Reserve, Bahamas                            */
  /* ---------------------------------------------------------------- */
  {
    slug: "ocean-cay",
    name: "Ocean Cay MSC Marine Reserve",
    country: "Bahamas",
    coordinates: { lat: 25.3606, lng: -79.2427 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 10,
    walkingDistanceToTown: "N/A — private island; beaches start at the pier",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "none",
    overview:
      "MSC's private island, transformed from an industrial sand extraction site into a marine reserve. Features 7 beaches, a lighthouse, a nature preserve, and late-night stay (ships often dock until 11 PM). Unique among private islands for its eco-restoration focus and evening programming.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Catamaran Cruise", priceRange: { min: 70, max: 100 }, typicalDuration: "1.5 hours" },
      { name: "Snorkeling Tour", priceRange: { min: 40, max: 60 }, typicalDuration: "1.5 hours" },
      { name: "Cabana Rental", priceRange: { min: 200, max: 900 }, typicalDuration: "All day" },
    ],
    freeActivities: [
      { name: "7 Beaches", description: "Explore all seven beaches — each has a different vibe from party to secluded." },
      { name: "Lighthouse Walk", description: "Walk to the island's lighthouse for sunset views." },
      { name: "Food Hall", description: "Complimentary BBQ and buffet lunch included for all guests." },
    ],
    restaurants: [
      { name: "Complimentary BBQ Buffet", priceRange: "$" },
      { name: "Beach Bars (various)", priceRange: "$" },
    ],
    gettingAround:
      "The island is walkable. A tram connects the pier to the far beaches. Ships dock directly — no tender needed.",
    emergencyInfo: {
      police: "Ship security",
      hospital: "Ship's medical center",
    },
    region: "private-island",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ocean_Cay_Bahamas.jpg/1280px-Ocean_Cay_Bahamas.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Princess Cays, Bahamas                                           */
  /* ---------------------------------------------------------------- */
  {
    slug: "princess-cays",
    name: "Princess Cays",
    country: "Bahamas",
    coordinates: { lat: 24.0937, lng: -76.3134 },
    timezone: "EST/EDT",
    safetyRating: 10,
    walkabilityRating: 5,
    isTenderPort: true,
    typicalPortHours: 6,
    walkingDistanceToTown: "N/A — private beach resort on the southern tip of Eleuthera",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "none",
    cellularCoverage: "none",
    overview:
      "Princess Cays is Princess Cruises' private resort on the southern tip of Eleuthera island. It's a classic beach day stop with calm turquoise waters, white sand, and a laid-back atmosphere. Tender service from the ship to shore.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Snorkeling Gear Rental", priceRange: { min: 25, max: 35 }, typicalDuration: "Self-guided" },
      { name: "Kayak Rental", priceRange: { min: 30, max: 40 }, typicalDuration: "1 hour" },
      { name: "Bungalow Rental", priceRange: { min: 250, max: 500 }, typicalDuration: "All day" },
    ],
    freeActivities: [
      { name: "Beach & Swimming", description: "Beautiful beach with free lounge chairs and calm, shallow water." },
      { name: "Nature Walk", description: "Short path through native vegetation on the point." },
    ],
    restaurants: [
      { name: "Complimentary BBQ Lunch", priceRange: "$" },
      { name: "Beach Bar", priceRange: "$" },
    ],
    gettingAround:
      "Walk along the beach. The resort area is compact. Tender from ship to shore.",
    emergencyInfo: {
      police: "Ship security",
      hospital: "Ship's medical center",
    },
    region: "private-island",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Princess_Cays_Bahamas.jpg/1280px-Princess_Cays_Bahamas.jpg",
  },

  /* ================================================================ */
  /*  ADDITIONAL CARIBBEAN PORTS                                       */
  /* ================================================================ */

  /* ---------------------------------------------------------------- */
  /*  Curaçao (Willemstad)                                             */
  /* ---------------------------------------------------------------- */
  {
    slug: "curacao",
    name: "Curaçao",
    country: "Curaçao",
    coordinates: { lat: 12.1696, lng: -68.9900 },
    timezone: "AST (no DST)",
    safetyRating: 7.5,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Willemstad's Handelskade is 5 min walk from the Mega Pier",
    currency: "ANG",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Curaçao is a Dutch Caribbean island known for its colorful UNESCO-listed Willemstad waterfront, excellent diving, and the famous Blue Curaçao liqueur. Less touristy than many Caribbean ports, it offers an authentic island experience with Dutch, Caribbean, and Latin influences.",
    timeZoneAlert: "Curaçao does NOT observe Daylight Saving Time. In summer it is 1 hour ahead of Eastern.",
    excursionCategories: [
      { name: "Beach Hopping Tour", priceRange: { min: 50, max: 80 }, typicalDuration: "4-5 hours" },
      { name: "Hato Caves", priceRange: { min: 10, max: 20 }, typicalDuration: "1.5 hours" },
      { name: "Snorkel/Dive Trip", priceRange: { min: 50, max: 100 }, typicalDuration: "3 hours" },
      { name: "Blue Curaçao Distillery Tour", priceRange: { min: 10, max: 15 }, typicalDuration: "1 hour" },
    ],
    freeActivities: [
      { name: "Willemstad Waterfront Walk", description: "Walk across the Queen Emma pontoon bridge between Punda and Otrobanda — the iconic colorful Handelskade." },
      { name: "Punda Shopping District", description: "Narrow streets with pastel Dutch colonial buildings, boutiques, and cafes." },
      { name: "Fort Amsterdam", description: "Historic Dutch fort that now serves as the governor's residence. Free to view from outside." },
    ],
    restaurants: [
      { name: "Plasa Bieu (Old Market)", priceRange: "$" },
      { name: "Gouverneur de Rouville", priceRange: "$$" },
      { name: "Seaside Terrace", priceRange: "$$" },
    ],
    gettingAround:
      "Willemstad is walkable. Taxis have fixed rates — to beaches like Mambo Beach ~$15-20. Car rental recommended for remote beaches. No Uber.",
    emergencyInfo: {
      police: "911",
      hospital: "Curaçao Medical Center — Weg Naar Sint Elisabeth",
      usConsulate: "+599 9 461-3066",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Willemstad_Curacao.jpg/1280px-Willemstad_Curacao.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Dominica                                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: "dominica",
    name: "Dominica",
    country: "Dominica",
    coordinates: { lat: 15.3010, lng: -61.3872 },
    timezone: "AST (no DST)",
    safetyRating: 8,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Roseau town center is 5 min walk from the cruise port",
    currency: "XCD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Known as the 'Nature Island of the Caribbean,' Dominica is one of the most unspoiled islands in the region. It's volcanic, mountainous, and covered in lush rainforest. The island offers incredible hiking, hot springs, and the world's second-largest boiling lake. Not to be confused with the Dominican Republic.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Trafalgar Falls & Rainforest", priceRange: { min: 50, max: 80 }, typicalDuration: "3-4 hours" },
      { name: "Champagne Reef Snorkeling", priceRange: { min: 40, max: 60 }, typicalDuration: "2-3 hours" },
      { name: "Titou Gorge & Emerald Pool", priceRange: { min: 60, max: 100 }, typicalDuration: "4-5 hours" },
      { name: "Whale & Dolphin Watch", priceRange: { min: 60, max: 90 }, typicalDuration: "3 hours" },
    ],
    freeActivities: [
      { name: "Roseau Market", description: "Colorful waterfront market selling tropical fruit, spices, and crafts." },
      { name: "Roseau Cathedral Walk", description: "Walk through the small capital past the stone cathedral and colonial buildings." },
      { name: "Bayfront Boardwalk", description: "Stroll along the waterfront promenade for mountain and ocean views." },
    ],
    restaurants: [
      { name: "Old Stone Grill", priceRange: "$$" },
      { name: "Cocorico Cafe", priceRange: "$" },
      { name: "Pearl's Cuisine", priceRange: "$" },
    ],
    gettingAround:
      "Roseau is walkable but attractions are in the mountains. Hire a guide/taxi for waterfalls — roads are winding and narrow. A guided tour is recommended.",
    emergencyInfo: {
      police: "999",
      hospital: "Princess Margaret Hospital — Roseau",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Trafalgar_Falls_Dominica.jpg/1280px-Trafalgar_Falls_Dominica.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Freeport, Bahamas                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "freeport",
    name: "Freeport",
    country: "Bahamas",
    coordinates: { lat: 26.5285, lng: -78.6967 },
    timezone: "EST/EDT",
    safetyRating: 7,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Lucaya is 10 min by taxi from the cruise port",
    currency: "BSD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "Freeport is the main city on Grand Bahama Island, the closest Bahamian island to Florida. Port Lucaya Marketplace is the main tourist area with shops, restaurants, and Count Basie Square. The island has beautiful beaches but is more spread out than Nassau.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "UNEXSO Dolphin Encounter", priceRange: { min: 80, max: 200 }, typicalDuration: "2-3 hours" },
      { name: "Lucayan National Park & Caves", priceRange: { min: 40, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Snorkel/Glass-Bottom Boat", priceRange: { min: 40, max: 60 }, typicalDuration: "2 hours" },
    ],
    freeActivities: [
      { name: "Port Lucaya Marketplace", description: "Open-air marketplace with shops, restaurants, and live music at Count Basie Square." },
      { name: "Lucaya Beach", description: "Beautiful public beach near the marketplace — free to enjoy." },
    ],
    restaurants: [
      { name: "Zorba's Greek Restaurant", priceRange: "$$" },
      { name: "Billy Joe's on the Beach", priceRange: "$" },
      { name: "Sabor (Port Lucaya)", priceRange: "$$" },
    ],
    gettingAround:
      "You need a taxi or shuttle from the cruise port to Lucaya ($10-15/person). No walkable attractions near the port itself. Car rental or organized tour recommended for the island.",
    emergencyInfo: {
      police: "911 or 919",
      hospital: "Rand Memorial Hospital — East Atlantic Dr",
    },
    region: "bahamas",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Port_Lucaya_Marketplace.jpg/1280px-Port_Lucaya_Marketplace.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Martinique                                                       */
  /* ---------------------------------------------------------------- */
  {
    slug: "martinique",
    name: "Martinique",
    country: "France (Overseas Region)",
    coordinates: { lat: 14.6042, lng: -61.0742 },
    timezone: "AST (no DST)",
    safetyRating: 8,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Fort-de-France center is a 5 min walk from the cruise terminal",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Martinique is a French Caribbean island that's an overseas region of France — you'll find boulangeries, patisseries, and French culture blended with Caribbean vibes. Fort-de-France is the bustling capital, while the north has the dramatic Mount Pelée volcano and black sand beaches.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Mount Pelée & St. Pierre Tour", priceRange: { min: 60, max: 100 }, typicalDuration: "5-6 hours" },
      { name: "Les Salines Beach Day", priceRange: { min: 40, max: 60 }, typicalDuration: "4-5 hours" },
      { name: "Rum Distillery Tour (Clément/JM)", priceRange: { min: 40, max: 60 }, typicalDuration: "3 hours" },
    ],
    freeActivities: [
      { name: "Fort-de-France Market", description: "The covered Grand Marché sells spices, rum, and tropical produce. The adjacent craft market has souvenirs." },
      { name: "Bibliothèque Schoelcher", description: "Stunning 19th-century library with a colorful, ornate facade — originally built for the 1889 Paris Exposition." },
      { name: "La Savane Park", description: "Central park with palm trees, benches, and a statue of Empress Joséphine (born here)." },
    ],
    restaurants: [
      { name: "Le Petibonum (beach restaurant)", priceRange: "$$" },
      { name: "Chez Carole (Creole)", priceRange: "$" },
      { name: "La Table de Marcel", priceRange: "$$$" },
    ],
    gettingAround:
      "Fort-de-France is walkable. Taxis use fixed rates — to Les Salines beach ~€60. Local buses ('taxi collectif') are cheap (~€2) but confusing for tourists. Car rental recommended for exploring the island.",
    emergencyInfo: {
      police: "17",
      hospital: "CHU de Martinique — Fort-de-France",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Fort-de-France_Martinique.jpg/1280px-Fort-de-France_Martinique.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Guadeloupe                                                       */
  /* ---------------------------------------------------------------- */
  {
    slug: "guadeloupe",
    name: "Guadeloupe",
    country: "France (Overseas Region)",
    coordinates: { lat: 16.2411, lng: -61.5331 },
    timezone: "AST (no DST)",
    safetyRating: 8,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "Pointe-à-Pitre center is a 5 min walk from the cruise terminal",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Guadeloupe is a butterfly-shaped French Caribbean archipelago. Ships dock in Pointe-à-Pitre on Grande-Terre. The island offers French-Creole cuisine, volcano hikes on Basse-Terre (La Soufrière), and gorgeous beaches. Like Martinique, it uses the euro and feels distinctly French.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "La Soufrière Volcano Hike", priceRange: { min: 60, max: 100 }, typicalDuration: "5-6 hours" },
      { name: "Snorkeling at Jacques Cousteau Reserve", priceRange: { min: 40, max: 70 }, typicalDuration: "3 hours" },
      { name: "Sainte-Anne Beach Day", priceRange: { min: 30, max: 50 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Pointe-à-Pitre Market", description: "Colorful spice and produce market — great for local vanilla, rum, and handmade hot sauce." },
      { name: "Place de la Victoire", description: "Main public square with colonial buildings, palm trees, and waterfront views." },
      { name: "Mémorial ACTe", description: "Striking modern museum about Caribbean slavery and memory (small entry fee)." },
    ],
    restaurants: [
      { name: "La Route du Rhum", priceRange: "$$" },
      { name: "Chez Coco", priceRange: "$" },
    ],
    gettingAround:
      "Pointe-à-Pitre center is walkable. Taxis use fixed rates. Car rental recommended to explore Basse-Terre side. Buses exist but schedules are infrequent.",
    emergencyInfo: {
      police: "17",
      hospital: "CHU de Guadeloupe — Pointe-à-Pitre",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Guadeloupe_Pointe-a-Pitre.jpg/1280px-Guadeloupe_Pointe-a-Pitre.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  St. Kitts                                                        */
  /* ---------------------------------------------------------------- */
  {
    slug: "st-kitts",
    name: "St. Kitts",
    country: "St. Kitts & Nevis",
    coordinates: { lat: 17.2960, lng: -62.7249 },
    timezone: "AST (no DST)",
    safetyRating: 8,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Basseterre town center is 5 min walk from Port Zante",
    currency: "XCD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "St. Kitts is the larger half of the Federation of St. Kitts and Nevis. Port Zante in Basseterre is right downtown. The island features a scenic railway (the last in the Caribbean), the imposing Brimstone Hill Fortress, and lush rainforest on Mount Liamuiga.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "St. Kitts Scenic Railway", priceRange: { min: 90, max: 120 }, typicalDuration: "3 hours" },
      { name: "Brimstone Hill Fortress", priceRange: { min: 40, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Rainforest Zipline", priceRange: { min: 80, max: 120 }, typicalDuration: "3 hours" },
      { name: "Mount Liamuiga Volcano Hike", priceRange: { min: 70, max: 100 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "Basseterre Walking Tour", description: "Walk to Independence Square, the Circus (modeled after Piccadilly), and colonial-era churches." },
      { name: "Port Zante Shopping", description: "Duty-free shopping complex right at the cruise port." },
      { name: "Frigate Bay Beach", description: "Popular beach a short taxi ride from port — North Frigate Bay is calm, South has beach bars." },
    ],
    restaurants: [
      { name: "Sprat Net", priceRange: "$" },
      { name: "Marshalls", priceRange: "$$$" },
      { name: "Reggae Beach Bar", priceRange: "$$" },
    ],
    gettingAround:
      "Basseterre is walkable. Taxis have fixed rates — to Frigate Bay ~$10, Brimstone Hill ~$30. Island tours by taxi available for $25-30/hour. No Uber.",
    emergencyInfo: {
      police: "911",
      hospital: "Joseph N. France General Hospital — Basseterre",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Basseterre_St_Kitts.jpg/1280px-Basseterre_St_Kitts.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  St. Croix, USVI                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "st-croix",
    name: "St. Croix",
    country: "US Virgin Islands",
    coordinates: { lat: 17.7466, lng: -64.7024 },
    timezone: "AST (no DST)",
    safetyRating: 7,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Frederiksted town is directly at the cruise pier",
    currency: "USD",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "The largest of the US Virgin Islands, St. Croix is less crowded than St. Thomas and offers a more authentic Caribbean experience. Ships dock in the charming town of Frederiksted. Christiansted on the east end is the main historic town. No passport needed for US citizens.",
    timeZoneAlert: "USVI does NOT observe Daylight Saving Time.",
    excursionCategories: [
      { name: "Buck Island Snorkeling", priceRange: { min: 60, max: 100 }, typicalDuration: "4-5 hours" },
      { name: "Christiansted Historic Tour", priceRange: { min: 30, max: 50 }, typicalDuration: "3-4 hours" },
      { name: "Cruzan Rum Distillery", priceRange: { min: 15, max: 25 }, typicalDuration: "1.5 hours" },
    ],
    freeActivities: [
      { name: "Frederiksted Beach", description: "Beautiful sandy beach right next to the cruise pier — walk off the ship and onto the sand." },
      { name: "Fort Frederik", description: "18th-century Danish fort right at the pier with a small museum." },
      { name: "Frederiksted Waterfront Walk", description: "Stroll the colorful colonial streets along the waterfront." },
    ],
    restaurants: [
      { name: "Polly's at the Pier", priceRange: "$" },
      { name: "Beach Side Cafe", priceRange: "$$" },
      { name: "Turtles Deli", priceRange: "$" },
    ],
    gettingAround:
      "Frederiksted is walkable. Taxi to Christiansted ~$25 each way. Buck Island boat trips depart from Christiansted. Car rental available if you want to explore both towns.",
    emergencyInfo: {
      police: "911",
      hospital: "Juan F. Luis Hospital — Christiansted",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Frederiksted_St_Croix.jpg/1280px-Frederiksted_St_Croix.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  La Romana, Dominican Republic                                    */
  /* ---------------------------------------------------------------- */
  {
    slug: "la-romana",
    name: "La Romana",
    country: "Dominican Republic",
    coordinates: { lat: 18.4274, lng: -68.9734 },
    timezone: "AST (no DST)",
    safetyRating: 7,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 8,
    walkingDistanceToTown: "La Romana town is 10 min by taxi; Altos de Chavón is 5 min",
    currency: "DOP",
    usdAccepted: true,
    wifiAvailability: "good",
    cellularCoverage: "good",
    overview:
      "La Romana is home to Casa de Campo resort and the stunning replica Mediterranean village of Altos de Chavón. Cruise ships dock at the resort's port. Nearby Saona Island and Catalina Island offer pristine beach excursions. Some cruises use La Romana as an embarkation port.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Saona Island Catamaran", priceRange: { min: 80, max: 120 }, typicalDuration: "6-7 hours" },
      { name: "Altos de Chavón & Chavón River", priceRange: { min: 30, max: 60 }, typicalDuration: "3 hours" },
      { name: "Catalina Island Snorkeling", priceRange: { min: 60, max: 90 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "Altos de Chavón", description: "Stunning replica 16th-century Mediterranean village with an amphitheater, galleries, and river views." },
      { name: "Marina Walk", description: "Stroll the Casa de Campo marina with yachts, shops, and restaurants." },
    ],
    restaurants: [
      { name: "La Piazzetta (Altos de Chavón)", priceRange: "$$" },
      { name: "Pepperoni Cafe", priceRange: "$" },
    ],
    gettingAround:
      "You'll need a taxi or shuttle from the port to attractions. Altos de Chavón is a short ride. Beach excursions include transportation. Not really walkable beyond the port area.",
    emergencyInfo: {
      police: "911",
      hospital: "Hospital Dr. Francisco Gonzalvo — La Romana",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Altos_de_Chavon_La_Romana.jpg/1280px-Altos_de_Chavon_La_Romana.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Samaná, Dominican Republic                                       */
  /* ---------------------------------------------------------------- */
  {
    slug: "samana",
    name: "Samaná",
    country: "Dominican Republic",
    coordinates: { lat: 19.2060, lng: -69.3370 },
    timezone: "AST (no DST)",
    safetyRating: 7.5,
    walkabilityRating: 4,
    isTenderPort: true,
    typicalPortHours: 7,
    walkingDistanceToTown: "Santa Bárbara de Samaná town is at the tender pier",
    currency: "DOP",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "The Samaná Peninsula is one of the most beautiful and least developed areas of the Dominican Republic. Famous for humpback whale watching (January-March), the El Limón waterfall, and the stunning Rincón Beach. Ships typically tender to shore.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "Whale Watching (Jan-Mar)", priceRange: { min: 50, max: 80 }, typicalDuration: "2-3 hours" },
      { name: "El Limón Waterfall", priceRange: { min: 40, max: 70 }, typicalDuration: "3-4 hours" },
      { name: "Cayo Levantado Beach Day", priceRange: { min: 30, max: 50 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Samaná Town Walk", description: "Small, colorful town with a Malecón waterfront promenade and local vendors." },
      { name: "Cayacoa Bridge", description: "Walk across the bridge connecting the town to the small island with restaurants." },
    ],
    restaurants: [
      { name: "El Cabito (cliff restaurant)", priceRange: "$$" },
      { name: "Restaurante Xaman", priceRange: "$$" },
    ],
    gettingAround:
      "Town is walkable. Motoconchos (motorcycle taxis) are the cheapest local transport. Taxis for excursions. Roads to waterfalls are rough — a guided tour is recommended.",
    emergencyInfo: {
      police: "911",
      hospital: "Hospital Municipal de Samaná",
    },
    region: "eastern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Samana_Dominican_Republic.jpg/1280px-Samana_Dominican_Republic.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  St. Vincent                                                      */
  /* ---------------------------------------------------------------- */
  {
    slug: "st-vincent",
    name: "St. Vincent",
    country: "St. Vincent & the Grenadines",
    coordinates: { lat: 13.1560, lng: -61.2270 },
    timezone: "AST (no DST)",
    safetyRating: 7,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Kingstown is directly at the cruise ship berth",
    currency: "XCD",
    usdAccepted: true,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "St. Vincent is the volcanic main island of St. Vincent and the Grenadines. Less polished than some Caribbean stops, it offers raw natural beauty — the La Soufrière volcano, black sand beaches, and the Vermont Nature Trail through tropical rainforest. Kingstown is the small, bustling capital.",
    timeZoneAlert: null,
    excursionCategories: [
      { name: "La Soufrière Volcano Hike", priceRange: { min: 70, max: 120 }, typicalDuration: "5-6 hours" },
      { name: "Botanical Gardens Tour", priceRange: { min: 20, max: 40 }, typicalDuration: "1.5-2 hours" },
      { name: "Catamaran to Bequia", priceRange: { min: 80, max: 130 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "Kingstown Market", description: "Loud, colorful market selling produce, spices, and local goods. Saturday mornings are busiest." },
      { name: "Botanical Gardens", description: "One of the oldest botanical gardens in the Western Hemisphere (1765). Breadfruit from Captain Bligh's voyage." },
      { name: "Fort Charlotte", description: "Hillside fort with views of Kingstown, the Grenadines, and the coastline." },
    ],
    restaurants: [
      { name: "Basil's Bar (Kingstown)", priceRange: "$$" },
      { name: "Cobblestone Inn Restaurant", priceRange: "$$" },
    ],
    gettingAround:
      "Kingstown center is walkable but hilly. Minibuses ('dollar vans') go everywhere for ~$1-2 EC. Taxis for volcano hikes or beaches. Roads are steep and winding.",
    emergencyInfo: {
      police: "911",
      hospital: "Milton Cato Memorial Hospital — Kingstown",
    },
    region: "southern",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Kingstown_St_Vincent.jpg/1280px-Kingstown_St_Vincent.jpg",
  },

  /* ================================================================ */
  /*  EUROPEAN PORTS                                                   */
  /* ================================================================ */

  /* ---------------------------------------------------------------- */
  /*  Barcelona, Spain                                                 */
  /* ---------------------------------------------------------------- */
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    coordinates: { lat: 41.3784, lng: 2.1799 },
    timezone: "CET/CEST",
    safetyRating: 7,
    walkabilityRating: 9,
    isTenderPort: false,
    typicalPortHours: 10,
    walkingDistanceToTown: "La Rambla is 15 min walk or a short shuttle from the cruise terminals",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Barcelona is one of Europe's most popular cruise ports, both as a port of call and embarkation city. The city offers Gaudí's masterpieces (Sagrada Família, Park Güell), Gothic Quarter charm, world-class food, and Mediterranean beaches. Multiple cruise terminals line the waterfront.",
    timeZoneAlert: "Barcelona is Central European Time — 6 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Sagrada Família Tour", priceRange: { min: 26, max: 50 }, typicalDuration: "2-3 hours" },
      { name: "Gothic Quarter Walking Tour", priceRange: { min: 15, max: 30 }, typicalDuration: "2 hours" },
      { name: "Park Güell & Casa Batlló", priceRange: { min: 30, max: 60 }, typicalDuration: "3-4 hours" },
      { name: "Montserrat Day Trip", priceRange: { min: 50, max: 80 }, typicalDuration: "5-6 hours" },
    ],
    freeActivities: [
      { name: "La Rambla", description: "Barcelona's famous tree-lined pedestrian boulevard from Plaça de Catalunya to the waterfront." },
      { name: "Gothic Quarter", description: "Medieval streets and plazas with the cathedral, hidden squares, and Roman ruins." },
      { name: "Barceloneta Beach", description: "City beach just minutes from the cruise port with a lively boardwalk." },
    ],
    restaurants: [
      { name: "La Boqueria Market", priceRange: "$" },
      { name: "Cal Pep (tapas)", priceRange: "$$$" },
      { name: "Cervecería Catalana", priceRange: "$$" },
    ],
    gettingAround:
      "Metro is fast and cheap (€2.40/ride, T-casual 10-ride card €11.35). Free port shuttle bus to the bottom of La Rambla. Taxis from port to Sagrada Família ~€15-20. The city is very walkable.",
    emergencyInfo: {
      police: "112 (EU emergency) or 091 (national police)",
      hospital: "Hospital del Mar — Passeig Marítim",
      usConsulate: "+34 93-280-2227",
    },
    region: "europe-med",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sagrada_Familia_nave_roof_detail.jpg/1280px-Sagrada_Familia_nave_roof_detail.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Rome (Civitavecchia), Italy                                      */
  /* ---------------------------------------------------------------- */
  {
    slug: "rome-civitavecchia",
    name: "Rome (Civitavecchia)",
    country: "Italy",
    coordinates: { lat: 42.0936, lng: 11.7863 },
    timezone: "CET/CEST",
    safetyRating: 7,
    walkabilityRating: 3,
    isTenderPort: false,
    typicalPortHours: 12,
    walkingDistanceToTown: "Civitavecchia town is 15 min walk; Rome is 60-90 min by train",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Civitavecchia is the port city for Rome, about 50 miles northwest of the Eternal City. Most cruisers head straight to Rome via train or organized tour. The port is a major embarkation point for Mediterranean cruises. Civitavecchia itself has a Michelangelo-designed fort and seafood restaurants.",
    timeZoneAlert: "Italy is 6 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Rome: Colosseum & Vatican", priceRange: { min: 100, max: 200 }, typicalDuration: "10-12 hours" },
      { name: "Rome: Skip-the-Line Vatican", priceRange: { min: 80, max: 150 }, typicalDuration: "8-10 hours" },
      { name: "Civitavecchia & Tuscia Wine Country", priceRange: { min: 50, max: 100 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Civitavecchia Fort & Waterfront", description: "Walk to the Forte Michelangelo and the fishing harbor — a pleasant half day if not going to Rome." },
      { name: "Civitavecchia Town Center", description: "Small Italian town with markets, gelato shops, and a train station." },
    ],
    restaurants: [
      { name: "La Bomboniera (Civitavecchia)", priceRange: "$$" },
      { name: "Ristorante Ideale (Civitavecchia)", priceRange: "$$" },
    ],
    gettingAround:
      "Regional train from Civitavecchia to Roma Termini takes ~60-80 min (€5-8). Shuttle from port to train station. Organized shore excursions handle all logistics. Going independently to Rome is very doable but plan for the long day.",
    emergencyInfo: {
      police: "112",
      hospital: "San Paolo Hospital — Civitavecchia",
      usConsulate: "US Embassy Rome: +39 06-46741",
    },
    region: "europe-med",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007.jpg/1280px-Colosseum_in_Rome-April_2007.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Valletta, Malta                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "valletta",
    name: "Valletta",
    country: "Malta",
    coordinates: { lat: 35.8989, lng: 14.5146 },
    timezone: "CET/CEST",
    safetyRating: 9,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "Grand Harbour cruise terminal has an elevator up to Barrakka Gardens in the city",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Valletta is a UNESCO World Heritage city and one of the most concentrated historic areas in the world. Built by the Knights of St. John in the 1500s, the fortified city sits on a peninsula between two harbors. Despite being tiny (less than 1 km long), it's packed with baroque architecture, museums, and cafes.",
    timeZoneAlert: "Malta is 6 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Valletta Walking Tour", priceRange: { min: 20, max: 40 }, typicalDuration: "2-3 hours" },
      { name: "Mdina & Rabat (ancient capital)", priceRange: { min: 40, max: 70 }, typicalDuration: "3-4 hours" },
      { name: "Blue Grotto Boat Trip", priceRange: { min: 30, max: 50 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Upper Barrakka Gardens", description: "Stunning viewpoint overlooking the Grand Harbour. The noon cannon salute fires daily." },
      { name: "St. John's Co-Cathedral", description: "Baroque masterpiece with two Caravaggio paintings (€15 entry, worth every cent)." },
      { name: "Republic Street Walk", description: "Main pedestrian street through the city with cafes, shops, and historic buildings." },
    ],
    restaurants: [
      { name: "Noni", priceRange: "$$$" },
      { name: "Pastizzeria (any)", priceRange: "$" },
      { name: "Trabuxu Wine Bar", priceRange: "$$" },
    ],
    gettingAround:
      "Valletta is tiny and walkable but very hilly with steep stairs. Elevator from harbour to Upper Barrakka. Buses go everywhere on the island (€2/ride). Ferry to Three Cities from the harbour.",
    emergencyInfo: {
      police: "112",
      hospital: "Mater Dei Hospital — Msida",
    },
    region: "europe-med",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Valletta_from_Upper_Barrakka_Gardens.jpg/1280px-Valletta_from_Upper_Barrakka_Gardens.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Sicily (Messina), Italy                                          */
  /* ---------------------------------------------------------------- */
  {
    slug: "sicily-messina",
    name: "Sicily (Messina)",
    country: "Italy",
    coordinates: { lat: 38.1938, lng: 15.5540 },
    timezone: "CET/CEST",
    safetyRating: 7.5,
    walkabilityRating: 7,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "Messina's Duomo and center are 10 min walk from the cruise pier",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Messina is the gateway to Sicily, sitting on the northeast tip of the island across the strait from mainland Italy. The city itself is pleasant with a famous astronomical clock, but most cruisers use it as a base to visit Taormina and Mount Etna — two of Sicily's most spectacular attractions.",
    timeZoneAlert: "Italy is 6 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Taormina & Greek Theatre", priceRange: { min: 50, max: 90 }, typicalDuration: "4-5 hours" },
      { name: "Mount Etna Excursion", priceRange: { min: 70, max: 130 }, typicalDuration: "5-7 hours" },
      { name: "Godfather Movie Sites Tour", priceRange: { min: 80, max: 120 }, typicalDuration: "6 hours" },
    ],
    freeActivities: [
      { name: "Duomo & Astronomical Clock", description: "Messina's cathedral with the world's largest astronomical clock — the noon show is a must-see." },
      { name: "Piazza del Duomo", description: "Main square with the Orion Fountain and surrounding cafes." },
      { name: "Via Garibaldi", description: "Main shopping street from the port to the cathedral." },
    ],
    restaurants: [
      { name: "Fratelli La Bufala", priceRange: "$$" },
      { name: "Pasticceria Irrera", priceRange: "$" },
    ],
    gettingAround:
      "Messina center is walkable. Taormina is 1 hour by bus or taxi (~€80-100 round trip). Mount Etna requires an organized tour. Train to Taormina-Giardini station takes 45 min.",
    emergencyInfo: {
      police: "112",
      hospital: "Policlinico Universitario — Via Consolare Valeria",
    },
    region: "europe-med",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Messina_Duomo_Clock.jpg/1280px-Messina_Duomo_Clock.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Olympia (Katakolon), Greece                                      */
  /* ---------------------------------------------------------------- */
  {
    slug: "olympia-katakolon",
    name: "Olympia (Katakolon)",
    country: "Greece",
    coordinates: { lat: 37.6400, lng: 21.3186 },
    timezone: "EET/EEST",
    safetyRating: 9,
    walkabilityRating: 5,
    isTenderPort: false,
    typicalPortHours: 7,
    walkingDistanceToTown: "Katakolon village shops and tavernas start right at the pier",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "limited",
    cellularCoverage: "good",
    overview:
      "Katakolon is a tiny fishing village on Greece's western Peloponnese coast, serving as the port for Ancient Olympia — the birthplace of the Olympic Games. Most visitors head straight to the archaeological site 35 km inland. The village itself has a pretty waterfront with tavernas and olive oil shops.",
    timeZoneAlert: "Greece is 7 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Ancient Olympia Archaeological Site", priceRange: { min: 40, max: 80 }, typicalDuration: "4-5 hours" },
      { name: "Olympia Museum & Site Combo", priceRange: { min: 50, max: 90 }, typicalDuration: "5-6 hours" },
      { name: "Beach & Olive Oil Tasting", priceRange: { min: 30, max: 50 }, typicalDuration: "3 hours" },
    ],
    freeActivities: [
      { name: "Katakolon Waterfront Walk", description: "Charming harbor promenade with fishing boats, tavernas, and souvenir shops." },
      { name: "Kourouta Beach", description: "Sandy beach a short walk south of the village — uncrowded and scenic." },
      { name: "Museum of Ancient Greek Technology", description: "Small museum in Katakolon village showcasing reconstructions of ancient inventions." },
    ],
    restaurants: [
      { name: "Taverna Bacchus", priceRange: "$" },
      { name: "Elia Restaurant", priceRange: "$$" },
    ],
    gettingAround:
      "Katakolon village is walkable. Taxi to Ancient Olympia ~€50-60 round trip. Hop-on-hop-off train runs to Olympia in season. Most people book a ship excursion.",
    emergencyInfo: {
      police: "112",
      hospital: "Pyrgos General Hospital (25 min drive)",
    },
    region: "europe-med",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Olympia_Greece_Stadium.jpg/1280px-Olympia_Greece_Stadium.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Chania (Souda), Crete, Greece                                    */
  /* ---------------------------------------------------------------- */
  {
    slug: "chania-souda",
    name: "Chania (Souda)",
    country: "Greece",
    coordinates: { lat: 35.4850, lng: 24.0959 },
    timezone: "EET/EEST",
    safetyRating: 9,
    walkabilityRating: 4,
    isTenderPort: false,
    typicalPortHours: 9,
    walkingDistanceToTown: "Souda port is 7 km from Chania old town — shuttle or taxi needed",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Souda Bay is the deep-water port serving Chania, Crete's most beautiful city. Chania's Venetian harbor, with its iconic lighthouse and pastel buildings, is one of the most photogenic spots in the Greek islands. Crete offers ancient Minoan ruins, dramatic gorges, and exceptional cuisine.",
    timeZoneAlert: "Crete/Greece is 7 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Chania Old Town Walking Tour", priceRange: { min: 30, max: 50 }, typicalDuration: "3-4 hours" },
      { name: "Knossos Palace (Heraklion)", priceRange: { min: 80, max: 130 }, typicalDuration: "6-7 hours" },
      { name: "Samariá Gorge Hike", priceRange: { min: 50, max: 80 }, typicalDuration: "8 hours" },
      { name: "Cretan Wine & Olive Oil Tasting", priceRange: { min: 40, max: 70 }, typicalDuration: "3-4 hours" },
    ],
    freeActivities: [
      { name: "Venetian Harbour & Lighthouse", description: "Walk the harbor promenade to the iconic Egyptian Lighthouse — one of the oldest in the world." },
      { name: "Old Town Streets", description: "Wander the narrow lanes of the Venetian, Turkish, and Jewish quarters. Beautiful architecture and hidden gems." },
      { name: "Chania Municipal Market", description: "Cross-shaped covered market from 1913 selling Cretan cheese, herbs, honey, and olive oil." },
    ],
    restaurants: [
      { name: "Tamam (Cretan)", priceRange: "$$" },
      { name: "Bougatsa Iordanis", priceRange: "$" },
      { name: "To Maridaki (seafood)", priceRange: "$$" },
    ],
    gettingAround:
      "Shuttle bus from Souda port to Chania old town (often free or €5). Chania old town is very walkable. Taxi from port ~€15. Public bus to Heraklion takes 2.5 hours.",
    emergencyInfo: {
      police: "112",
      hospital: "Chania General Hospital — Mournies",
    },
    region: "europe-med",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Chania_-_Venetian_harbor.jpg/1280px-Chania_-_Venetian_harbor.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Le Havre (Paris), France                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: "le-havre",
    name: "Le Havre (Paris)",
    country: "France",
    coordinates: { lat: 49.4944, lng: 0.1079 },
    timezone: "CET/CEST",
    safetyRating: 8,
    walkabilityRating: 6,
    isTenderPort: false,
    typicalPortHours: 12,
    walkingDistanceToTown: "Le Havre city center is 15 min walk from cruise terminal",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "good",
    cellularCoverage: "excellent",
    overview:
      "Le Havre is the port for Paris, about 2-2.5 hours away by bus or train. The city itself is a UNESCO World Heritage Site for its post-war modernist architecture by Auguste Perret. Most cruisers choose between a whirlwind Paris day trip or exploring Normandy's D-Day beaches and the charming town of Honfleur.",
    timeZoneAlert: "France is 6 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Paris Highlights (Eiffel Tower area)", priceRange: { min: 120, max: 250 }, typicalDuration: "12-14 hours" },
      { name: "D-Day Beaches of Normandy", priceRange: { min: 80, max: 150 }, typicalDuration: "8-10 hours" },
      { name: "Honfleur & Normandy Countryside", priceRange: { min: 50, max: 90 }, typicalDuration: "4-5 hours" },
    ],
    freeActivities: [
      { name: "Le Havre Beach", description: "Long pebble beach along the promenade — nice for a walk even if not swimming weather." },
      { name: "Perret Model Apartment", description: "UNESCO-recognized modernist architecture — free guided tours of a restored 1950s apartment." },
      { name: "Saint-Joseph Church", description: "Stunning modernist church with a 107-meter tower and incredible stained glass interior." },
    ],
    restaurants: [
      { name: "Le Lyonnais (seafood)", priceRange: "$$" },
      { name: "Les Enfants Sages", priceRange: "$$" },
    ],
    gettingAround:
      "Train to Paris Saint-Lazare takes 2-2.5 hours (€15-25 each way). Book in advance. Shuttle to train station from port. Honfleur is 30 min by bus. Le Havre has a modern tram system.",
    emergencyInfo: {
      police: "17 or 112",
      hospital: "Groupe Hospitalier du Havre",
      usConsulate: "US Embassy Paris: +33 1-43-12-22-22",
    },
    region: "europe-north",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Le_Havre_St_Joseph.jpg/1280px-Le_Havre_St_Joseph.jpg",
  },

  /* ---------------------------------------------------------------- */
  /*  Hamburg, Germany                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "hamburg",
    name: "Hamburg",
    country: "Germany",
    coordinates: { lat: 53.5511, lng: 9.9937 },
    timezone: "CET/CEST",
    safetyRating: 8.5,
    walkabilityRating: 8,
    isTenderPort: false,
    typicalPortHours: 0,
    walkingDistanceToTown: "HafenCity cruise terminal is in the heart of Hamburg",
    currency: "EUR",
    usdAccepted: false,
    wifiAvailability: "excellent",
    cellularCoverage: "excellent",
    overview:
      "Hamburg is Germany's second-largest city and a major European cruise embarkation port. The Elbe River harbor city offers the stunning Elbphilharmonie concert hall, the Speicherstadt warehouse district (UNESCO), and the famous Reeperbahn nightlife. A cosmopolitan, maritime city with incredible architecture.",
    timeZoneAlert: "Germany is 6 hours ahead of US Eastern.",
    excursionCategories: [
      { name: "Harbour Boat Tour", priceRange: { min: 15, max: 30 }, typicalDuration: "1.5-2 hours" },
      { name: "Elbphilharmonie Plaza Visit", priceRange: { min: 0, max: 0 }, typicalDuration: "1 hour" },
      { name: "Miniatur Wunderland", priceRange: { min: 15, max: 20 }, typicalDuration: "2-3 hours" },
    ],
    freeActivities: [
      { name: "Speicherstadt Walk", description: "Walk through the UNESCO World Heritage warehouse district — stunning red-brick architecture on canals." },
      { name: "Elbphilharmonie Plaza", description: "Free visit to the observation plaza of Hamburg's iconic concert hall. Panoramic harbour views." },
      { name: "Jungfernstieg & Alster Lake", description: "Elegant boulevard along the inner Alster Lake — the heart of the city." },
    ],
    restaurants: [
      { name: "Fischbrötchen at Brücke 10", priceRange: "$" },
      { name: "Block House (steak)", priceRange: "$$" },
      { name: "Speicherstadt Kaffeerösterei", priceRange: "$" },
    ],
    gettingAround:
      "Excellent U-Bahn/S-Bahn metro system (day pass ~€8). HafenCity terminal is walkable to Speicherstadt. Hamburg Airport is 30 min by S-Bahn.",
    emergencyInfo: {
      police: "110 or 112",
      hospital: "UKE Hamburg — Martinistr. 52",
      usConsulate: "+49 40-4117-1100",
    },
    region: "europe-north",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Elbphilharmonie_Hamburg_2016.jpg/1280px-Elbphilharmonie_Hamburg_2016.jpg",
  },
];

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                   */
/* ------------------------------------------------------------------ */

export function getPortBySlug(slug: string): PortData | undefined {
  return PORTS.find((port) => port.slug === slug);
}

export function getAllPortSlugs(): string[] {
  return PORTS.map((port) => port.slug);
}

export function getPortsByRegion(region: PortRegion): PortData[] {
  return PORTS.filter((port) => port.region === region);
}

export const REGION_LABELS: Record<PortRegion, string> = {
  western: "Western Caribbean",
  eastern: "Eastern Caribbean",
  southern: "Southern Caribbean",
  bahamas: "Bahamas",
  alaska: "Alaska",
  "europe-med": "Mediterranean",
  "europe-north": "Northern Europe",
  homeport: "US & Canada Homeports",
  "private-island": "Private Islands",
  asia: "Asia",
};
