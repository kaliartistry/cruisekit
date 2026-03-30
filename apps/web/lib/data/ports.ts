/* ------------------------------------------------------------------ */
/*  Caribbean Port Data — 33 Ports                                     */
/* ------------------------------------------------------------------ */

export type PortRegion = "western" | "eastern" | "southern" | "bahamas";

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
    imageUrl: "https://www.celebritycruises.com/celebrity/new-images/itineraries/caribbean/aerial-view-nassau-bahamas-2560x1440.jpg",
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
    imageUrl: "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1668813922137-e5dcda303af6?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1719857664707-60ebe8852aa0?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1504659728239-b005b35c5d69?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1712086353412-512d17c08403?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1616464654572-43996d6b0133?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1746208440749-b25fcc19e025?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1745156705689-eef88991849d?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=800&q=80",
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
    imageUrl: "https://www.celebritycruises.com/celebrity/new-images/itineraries/caribbean/aerial-view-nassau-bahamas-2560x1440.jpg",
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
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&q=80",
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
};
