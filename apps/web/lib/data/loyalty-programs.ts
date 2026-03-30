/**
 * Cruise line loyalty program database for CruiseKit.
 *
 * Covers all 9 major cruise lines with tier structures, qualifying thresholds,
 * per-tier perks, and status match availability.
 *
 * Updated: 2026-03-30
 * Source: Official cruise line loyalty program pages and published program guides.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoyaltyTier {
  name: string;
  qualifyingPoints: number; // sail nights or points to reach tier
  perks: string[];
  color: string; // hex color for visual representation
}

export interface StatusMatch {
  fromLine: string;
  matchedTier: string;
  notes: string;
}

export interface LoyaltyProgram {
  cruiseLineId: string;
  programName: string;
  pointsUnit: string; // "cruise credits" | "sail nights" | "points"
  tiers: LoyaltyTier[];
  keyPerks: string[]; // top 3-5 perks across all tiers
  statusMatchAvailable: boolean;
  enrollmentUrl: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Loyalty program data — 9 cruise lines
// ---------------------------------------------------------------------------

export const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  // -------------------------------------------------------------------------
  // Royal Caribbean — Crown & Anchor Society
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "royal-caribbean",
    programName: "Crown & Anchor Society",
    pointsUnit: "cruise points",
    tiers: [
      {
        name: "Gold",
        qualifyingPoints: 1,
        perks: [
          "Crown & Anchor Society welcome-back event",
          "Members-only offers and promotions",
          "Exclusive onboard shopping discounts",
          "Pin recognition at milestone sailings",
        ],
        color: "#D4AF37",
      },
      {
        name: "Platinum",
        qualifyingPoints: 30,
        perks: [
          "All Gold perks",
          "Robes for use during sailing",
          "Priority check-in and departure",
          "Welcome-back cocktail reception",
          "Exclusive onboard discounts on select balcony cabins",
        ],
        color: "#E5E4E2",
      },
      {
        name: "Emerald",
        qualifyingPoints: 55,
        perks: [
          "All Platinum perks",
          "Priority waitlist for dining and entertainment",
          "Behind-the-scenes ship tour (subject to availability)",
          "Complimentary 24-hour room service snack delivery",
        ],
        color: "#50C878",
      },
      {
        name: "Diamond",
        qualifyingPoints: 80,
        perks: [
          "All Emerald perks",
          "Access to Diamond Lounge with complimentary drinks and snacks",
          "Complimentary pressing of formal night clothing",
          "Behind-the-scenes tour guaranteed",
          "Complimentary Voom Surf internet (1 device)",
        ],
        color: "#B9F2FF",
      },
      {
        name: "Diamond Plus",
        qualifyingPoints: 175,
        perks: [
          "All Diamond perks",
          "4 complimentary beverages daily (premium spirits included)",
          "Complimentary Voom Surf & Stream internet (2 devices)",
          "Priority access to My Time Dining",
          "Exclusive Diamond Plus pin",
        ],
        color: "#C0C0C0",
      },
      {
        name: "Pinnacle Club",
        qualifyingPoints: 700,
        perks: [
          "All Diamond Plus perks",
          "Annual complimentary cruise (up to 7 nights balcony)",
          "Pinnacle Club lounge access with premium drinks",
          "Complimentary specialty dining (1 per sailing)",
          "Pinnacle Club lapel pin and recognition",
          "Unlimited Voom Surf & Stream internet",
        ],
        color: "#FFD700",
      },
    ],
    keyPerks: [
      "Private Diamond Lounge with complimentary drinks",
      "Priority check-in and departure",
      "Behind-the-scenes ship tours",
      "Complimentary internet (Diamond+)",
      "Annual free cruise at Pinnacle level",
    ],
    statusMatchAvailable: true,
    enrollmentUrl: "https://www.royalcaribbean.com/loyalty",
    notes:
      "Points earned per night vary by cabin category: 1 point for Inside/Ocean View, 2 for Balcony/Mini-Suite, 3 for Suite. Points earned on all Royal Caribbean International sailings.",
  },

  // -------------------------------------------------------------------------
  // Carnival — VIFP Club (Very Important Fun Person)
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "carnival",
    programName: "VIFP Club",
    pointsUnit: "cruise points",
    tiers: [
      {
        name: "Blue",
        qualifyingPoints: 0,
        perks: [
          "Automatic enrollment upon first booking",
          "Access to members-only deals and offers",
          "Birthday and anniversary recognition",
          "VIFP Club newsletter with exclusive promotions",
        ],
        color: "#0057B7",
      },
      {
        name: "Red",
        qualifyingPoints: 25,
        perks: [
          "All Blue perks",
          "Priority check-in at terminal",
          "Exclusive Red-tier onboard offers",
          "Limited-time upgrade offers",
        ],
        color: "#CC0000",
      },
      {
        name: "Gold",
        qualifyingPoints: 75,
        perks: [
          "All Red perks",
          "Priority debarkation",
          "Gold welcome gift in stateroom",
          "Priority waitlist for Faster to the Fun",
          "10% discount at onboard shops",
        ],
        color: "#D4AF37",
      },
      {
        name: "Platinum",
        qualifyingPoints: 200,
        perks: [
          "All Gold perks",
          "Complimentary laundry (wash & fold, limit per sailing)",
          "Complimentary Drink of the Day",
          "Priority spa appointment booking",
          "Platinum welcome-aboard lunch",
          "Fresh fruit basket in stateroom",
        ],
        color: "#E5E4E2",
      },
      {
        name: "Diamond",
        qualifyingPoints: 500,
        perks: [
          "All Platinum perks",
          "Priority boarding — first to board",
          "Unlimited complimentary laundry (wash & fold)",
          "Complimentary specialty coffee and cake at patisserie",
          "Fresh flower arrangement in stateroom",
          "Diamond exclusive cocktail party with officers",
          "Priority tender tickets",
        ],
        color: "#B9F2FF",
      },
    ],
    keyPerks: [
      "Priority boarding and debarkation",
      "Complimentary laundry service (Platinum+)",
      "Free Drink of the Day (Platinum+)",
      "Spa and dining discounts",
      "Diamond-exclusive officer cocktail party",
    ],
    statusMatchAvailable: true,
    enrollmentUrl: "https://www.carnival.com/loyalty",
    notes:
      "Earn 1 point per day sailed in standard cabins, 2 points per day in suites. Points are tied to the booking guest and do not expire. Status match promotions run periodically.",
  },

  // -------------------------------------------------------------------------
  // Norwegian Cruise Line — Latitudes Rewards
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "norwegian",
    programName: "Latitudes Rewards",
    pointsUnit: "cruise points",
    tiers: [
      {
        name: "Bronze",
        qualifyingPoints: 1,
        perks: [
          "Welcome-back cocktail party invitation",
          "Members-only deals and early booking access",
          "Latitudes Rewards newsletter",
          "10% off shore excursion purchases",
        ],
        color: "#CD7F32",
      },
      {
        name: "Silver",
        qualifyingPoints: 14,
        perks: [
          "All Bronze perks",
          "Priority check-in at terminal",
          "Complimentary welcome aboard sparkling wine",
          "15% off shore excursion purchases",
        ],
        color: "#C0C0C0",
      },
      {
        name: "Gold",
        qualifyingPoints: 29,
        perks: [
          "All Silver perks",
          "Priority tender tickets",
          "Complimentary stateroom upgrade (subject to availability)",
          "20% off shore excursion purchases",
          "Behind-the-scenes ship tour invitation",
        ],
        color: "#D4AF37",
      },
      {
        name: "Platinum",
        qualifyingPoints: 54,
        perks: [
          "All Gold perks",
          "Complimentary dinner at specialty restaurant (1 per sailing)",
          "Priority embarkation and debarkation",
          "Dedicated Latitudes phone line for reservations",
          "25% off shore excursion purchases",
        ],
        color: "#E5E4E2",
      },
      {
        name: "Platinum Plus",
        qualifyingPoints: 79,
        perks: [
          "All Platinum perks",
          "Guaranteed complimentary balcony upgrade (subject to availability)",
          "Complimentary Internet Package (150 minutes)",
          "Concierge-level priority for dining reservations",
          "30% off shore excursion purchases",
        ],
        color: "#D4C5A9",
      },
      {
        name: "Ambassador",
        qualifyingPoints: 700,
        perks: [
          "All Platinum Plus perks",
          "Ambassador-exclusive cocktail party with officers",
          "Complimentary unlimited internet",
          "Complimentary specialty dining package",
          "Priority suite access and upgrades",
          "Personal cruise vacation concierge",
        ],
        color: "#4B0082",
      },
    ],
    keyPerks: [
      "Complimentary balcony upgrades (Gold+)",
      "Officers' cocktail party invitation",
      "Behind-the-scenes ship tours",
      "Dedicated reservations phone line (Platinum+)",
      "Complimentary specialty dining (Platinum+)",
    ],
    statusMatchAvailable: false,
    enrollmentUrl: "https://www.ncl.com/latitudes-rewards",
    notes:
      "Earn 1 point per cruise night sailed. Points accumulate across all NCL sailings. Norwegian generally does not offer competitive status matching from other cruise lines.",
  },

  // -------------------------------------------------------------------------
  // MSC Cruises — MSC Voyagers Club
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "msc",
    programName: "MSC Voyagers Club",
    pointsUnit: "sail nights",
    tiers: [
      {
        name: "Classic",
        qualifyingPoints: 1,
        perks: [
          "Automatic enrollment after first cruise",
          "Welcome-back discount on future sailings",
          "Members-only promotions and early access sales",
          "Birthday recognition onboard",
        ],
        color: "#1C3A6E",
      },
      {
        name: "Silver",
        qualifyingPoints: 5,
        perks: [
          "All Classic perks",
          "Priority check-in at terminal",
          "10% discount at MSC onboard shops",
          "Invitation to cocktail party",
          "Complimentary MSC Voyagers Club pin",
        ],
        color: "#C0C0C0",
      },
      {
        name: "Gold",
        qualifyingPoints: 15,
        perks: [
          "All Silver perks",
          "Priority boarding and debarkation",
          "Complimentary cabin upgrade (subject to availability)",
          "24-hour room service included",
          "Free laundry pressing (2 items per sailing)",
          "Exclusive Gold-tier events onboard",
        ],
        color: "#D4AF37",
      },
      {
        name: "Diamond",
        qualifyingPoints: 25,
        perks: [
          "All Gold perks",
          "MSC Yacht Club experience invitation (one evening per sailing)",
          "Complimentary premium beverage package upgrade",
          "Guaranteed cabin upgrade (next category up)",
          "Priority spa and excursion booking",
          "Private Voyagers Club lounge access (where available)",
          "Exclusive Diamond-only shore events",
        ],
        color: "#B9F2FF",
      },
    ],
    keyPerks: [
      "Priority boarding and embarkation",
      "Cabin upgrades (Gold+)",
      "MSC Yacht Club experience invitations (Diamond)",
      "Exclusive onboard events and cocktail parties",
      "Premium beverage package upgrades (Diamond)",
    ],
    statusMatchAvailable: true,
    enrollmentUrl: "https://www.msccruisesusa.com/voyagers-club",
    notes:
      "MSC frequently runs competitive status-match promotions, especially for guests holding elite status with other cruise lines. Points are based on sail nights across all MSC brands.",
  },

  // -------------------------------------------------------------------------
  // Celebrity Cruises — Captain's Club
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "celebrity",
    programName: "Captain's Club",
    pointsUnit: "club points",
    tiers: [
      {
        name: "Classic",
        qualifyingPoints: 2,
        perks: [
          "Automatic enrollment after first sailing",
          "Captain's Club welcome event onboard",
          "Members-only promotions and offers",
          "Access to Captain's Club newsletter",
        ],
        color: "#2C3E50",
      },
      {
        name: "Select",
        qualifyingPoints: 150,
        perks: [
          "All Classic perks",
          "Priority check-in at terminal",
          "Complimentary Classic beverage upgrade",
          "Exclusive onboard seminar events",
          "Select-tier recognition pin",
        ],
        color: "#8E44AD",
      },
      {
        name: "Honored",
        qualifyingPoints: 300,
        perks: [
          "All Select perks",
          "Complimentary specialty dining (1 per sailing)",
          "Priority tender tickets",
          "Behind-the-scenes ship tour",
          "Exclusive Honored cocktail reception",
        ],
        color: "#2980B9",
      },
      {
        name: "Elite",
        qualifyingPoints: 750,
        perks: [
          "All Honored perks",
          "Complimentary premium drinks at select bars",
          "Complimentary basic internet package",
          "Guaranteed cabin upgrade (subject to availability)",
          "Priority boarding — early embarkation",
          "Complimentary laundry pressing (evening wear)",
        ],
        color: "#E5E4E2",
      },
      {
        name: "Elite Plus",
        qualifyingPoints: 1500,
        perks: [
          "All Elite perks",
          "Unlimited complimentary premium beverages",
          "Complimentary streaming internet package",
          "Exclusive Elite Plus lounge access",
          "Complimentary specialty dining package (2 per sailing)",
          "Priority restaurant seating",
        ],
        color: "#D4AF37",
      },
      {
        name: "Zenith",
        qualifyingPoints: 5000,
        perks: [
          "All Elite Plus perks",
          "Annual complimentary cruise (up to 7 nights)",
          "Complimentary unlimited premium internet",
          "Permanent suite-level amenities regardless of cabin booked",
          "Zenith-exclusive events with senior officers",
          "Dedicated personal concierge",
        ],
        color: "#FFD700",
      },
    ],
    keyPerks: [
      "Priority boarding and check-in",
      "Complimentary premium drinks (Elite+)",
      "Specialty dining discounts and complimentary meals",
      "Complimentary internet packages (Elite+)",
      "Annual free cruise at Zenith level",
    ],
    statusMatchAvailable: false,
    enrollmentUrl: "https://www.celebritycruises.com/loyalty",
    notes:
      "Points earned per night vary by cabin class: 2 for standard, 4 for Concierge, 6 for Suite, 12 for The Retreat. Celebrity is a sister brand to Royal Caribbean but loyalty programs are separate.",
  },

  // -------------------------------------------------------------------------
  // Princess Cruises — Captain's Circle
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "princess",
    programName: "Captain's Circle",
    pointsUnit: "cruise days",
    tiers: [
      {
        name: "Gold",
        qualifyingPoints: 1,
        perks: [
          "Automatic enrollment after first sailing",
          "Members-only savings and promotions",
          "Captain's Circle welcome pin",
          "Access to onboard loyalty events",
        ],
        color: "#D4AF37",
      },
      {
        name: "Ruby",
        qualifyingPoints: 30,
        perks: [
          "All Gold perks",
          "Priority check-in at terminal",
          "Complimentary wine tasting event",
          "10% discount on future cruise deposits",
          "Ruby-tier recognition pin",
        ],
        color: "#E0115F",
      },
      {
        name: "Platinum",
        qualifyingPoints: 75,
        perks: [
          "All Ruby perks",
          "Complimentary laundry and pressing",
          "Priority tender tickets",
          "Complimentary internet (150 minutes)",
          "10% off future cruise fares",
          "Platinum cocktail reception with officers",
        ],
        color: "#E5E4E2",
      },
      {
        name: "Elite",
        qualifyingPoints: 150,
        perks: [
          "All Platinum perks",
          "Complimentary MedallionNet internet (unlimited)",
          "Complimentary specialty dining (1 per sailing)",
          "Guaranteed cabin upgrade (next category, subject to availability)",
          "Elite lounge access at embarkation ports",
          "Priority disembarkation",
          "Exclusive Elite shoreside events",
        ],
        color: "#1C1C1C",
      },
    ],
    keyPerks: [
      "Priority boarding and disembarkation",
      "Complimentary laundry service (Platinum+)",
      "Complimentary wine tasting events",
      "10% off future cruise fares (Platinum+)",
      "Complimentary internet and specialty dining (Elite)",
    ],
    statusMatchAvailable: true,
    enrollmentUrl: "https://www.princess.com/loyalty",
    notes:
      "Earn 1 cruise day per night sailed. Princess offers limited status match promotions periodically. Program is part of the Carnival Corporation family but operates independently.",
  },

  // -------------------------------------------------------------------------
  // Holland America Line — Mariner Society
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "holland-america",
    programName: "Mariner Society",
    pointsUnit: "cruise days",
    tiers: [
      {
        name: "Star Mariner",
        qualifyingPoints: 1,
        perks: [
          "Automatic enrollment after first cruise",
          "Welcome-back cocktail party",
          "Members-only promotions and early access",
          "Mariner Society lapel pin",
        ],
        color: "#1C3A6E",
      },
      {
        name: "2-Star Mariner",
        qualifyingPoints: 50,
        perks: [
          "All Star Mariner perks",
          "Priority check-in and boarding",
          "Complimentary photo (1 per sailing)",
          "15% discount at Pinnacle Bar",
          "Fresh fruit in stateroom upon embarkation",
        ],
        color: "#C0C0C0",
      },
      {
        name: "3-Star Mariner",
        qualifyingPoints: 100,
        perks: [
          "All 2-Star perks",
          "Complimentary pressing (2 items per sailing)",
          "50% off internet packages",
          "Priority tender tickets",
          "Complimentary Pinnacle Grill lunch (1 per sailing)",
          "25% discount at Pinnacle Bar",
        ],
        color: "#D4AF37",
      },
      {
        name: "4-Star Mariner",
        qualifyingPoints: 200,
        perks: [
          "All 3-Star perks",
          "Complimentary laundry (wash & fold, 1 bag per sailing)",
          "Complimentary specialty dining (1 dinner per sailing)",
          "Complimentary unlimited WiFi",
          "Verandah upgrade priority (subject to availability)",
          "Behind-the-scenes ship tour",
        ],
        color: "#E5E4E2",
      },
      {
        name: "5-Star Mariner",
        qualifyingPoints: 500,
        perks: [
          "All 4-Star perks",
          "Unlimited complimentary laundry and pressing",
          "Complimentary premium beverage package",
          "Guaranteed verandah cabin upgrade",
          "Exclusive 5-Star reception with captain",
          "Dedicated Mariner Society concierge",
          "Complimentary specialty dining package",
        ],
        color: "#FFD700",
      },
    ],
    keyPerks: [
      "Priority boarding and check-in",
      "Pinnacle Bar discounts (2-Star+)",
      "Complimentary laundry (4-Star+)",
      "Half-off WiFi packages (3-Star+)",
      "Complimentary specialty dining (4-Star+)",
    ],
    statusMatchAvailable: false,
    enrollmentUrl: "https://www.hollandamerica.com/mariner-society",
    notes:
      "Earn 1 cruise day per night in standard cabins, 1.5 days per night in suites. Holland America does not generally offer status matching from other lines. Part of the Carnival Corporation family.",
  },

  // -------------------------------------------------------------------------
  // Disney Cruise Line — Castaway Club
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "disney",
    programName: "Castaway Club",
    pointsUnit: "completed cruises",
    tiers: [
      {
        name: "Silver",
        qualifyingPoints: 1,
        perks: [
          "Automatic enrollment after first completed cruise",
          "Castaway Club welcome-back stateroom gift",
          "Members-only offers and early booking notifications",
          "Exclusive Castaway Club lanyard",
        ],
        color: "#C0C0C0",
      },
      {
        name: "Gold",
        qualifyingPoints: 5,
        perks: [
          "All Silver perks",
          "Priority booking window (before general public)",
          "Upgraded stateroom gift",
          "Gold Castaway Club pin",
          "Priority check-in at terminal",
          "Early access to Port Adventures booking",
        ],
        color: "#D4AF37",
      },
      {
        name: "Platinum",
        qualifyingPoints: 10,
        perks: [
          "All Gold perks",
          "Earliest booking window for new itineraries",
          "Premium stateroom gift (exclusive merchandise)",
          "Platinum Castaway Club pin",
          "Concierge-level boarding priority",
          "Exclusive onboard Platinum events and meet-and-greets",
          "Priority Palo / Enchanté dining reservations",
        ],
        color: "#E5E4E2",
      },
      {
        name: "Pearl",
        qualifyingPoints: 25,
        perks: [
          "All Platinum perks",
          "Exclusive Pearl Castaway Club stateroom gift",
          "Pearl recognition pin and certificate",
          "First-access booking window (before Platinum)",
          "Private Pearl-exclusive character meet-and-greet",
          "Complimentary Rainforest Room spa access (1 day per sailing)",
          "Dedicated concierge for Pearl members",
        ],
        color: "#F5F5DC",
      },
    ],
    keyPerks: [
      "Priority booking windows for new itineraries",
      "Exclusive stateroom gifts each sailing",
      "Special character meet-and-greet events",
      "Early Port Adventures booking access",
      "Priority check-in and boarding",
    ],
    statusMatchAvailable: false,
    enrollmentUrl: "https://disneycruise.disney.go.com/why-cruise/castaway-club/",
    notes:
      "Points are based on completed cruises (sailings), not nights. Each separate booking counts as 1 cruise regardless of length. Enrollment is automatic after completing your first Disney Cruise Line sailing.",
  },

  // -------------------------------------------------------------------------
  // Virgin Voyages — The Sailing Club
  // -------------------------------------------------------------------------
  {
    cruiseLineId: "virgin-voyages",
    programName: "The Sailing Club",
    pointsUnit: "voyages",
    tiers: [
      {
        name: "Deep Blue",
        qualifyingPoints: 1,
        perks: [
          "Automatic enrollment after first voyage",
          "Sailor-only pricing and promotions",
          "Early access to new itinerary releases",
          "Birthday recognition onboard",
          "The Sailing Club insider newsletter",
        ],
        color: "#0A1128",
      },
      {
        name: "Blue Extra",
        qualifyingPoints: 3,
        perks: [
          "All Deep Blue perks",
          "Complimentary cabin upgrade (subject to availability)",
          "$50 Bar Tab credit per voyage",
          "Early embarkation access",
          "Complimentary WiFi upgrade to premium tier",
          "Blue Extra welcome gift in cabin",
        ],
        color: "#1E3A5F",
      },
      {
        name: "Mermaids Rock",
        qualifyingPoints: 5,
        perks: [
          "All Blue Extra perks",
          "Guaranteed cabin upgrade (next category up)",
          "$100 Bar Tab credit per voyage",
          "Complimentary premium WiFi",
          "Priority booking for all ship experiences and events",
          "Exclusive Mermaids Rock onboard events",
          "First access to new ship and itinerary launches",
          "Dedicated Sailor Services concierge line",
        ],
        color: "#E6007E",
      },
    ],
    keyPerks: [
      "Cabin upgrades (Blue Extra+)",
      "Bar Tab credits ($50-$100 per voyage)",
      "Early booking access for new itineraries",
      "Complimentary WiFi upgrades",
      "Exclusive onboard events (Mermaids Rock)",
    ],
    statusMatchAvailable: false,
    enrollmentUrl: "https://www.virginvoyages.com/sailing-club",
    notes:
      "Points are based on completed voyages (sailings), not nights. Virgin Voyages is a newer line with a simpler tier structure. Enrollment is automatic upon completing your first voyage. All Virgin Voyages fares include WiFi, dining, and basic beverages.",
  },
];

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Look up a loyalty program by cruise line ID */
export function getLoyaltyProgram(cruiseLineId: string): LoyaltyProgram | undefined {
  return LOYALTY_PROGRAMS.find((p) => p.cruiseLineId === cruiseLineId);
}

/** Get the tier a member would qualify for given their points/nights/voyages */
export function getMemberTier(cruiseLineId: string, points: number): LoyaltyTier | undefined {
  const program = getLoyaltyProgram(cruiseLineId);
  if (!program) return undefined;

  // Return the highest tier the member qualifies for
  const qualifiedTiers = program.tiers.filter((t) => points >= t.qualifyingPoints);
  return qualifiedTiers.length > 0 ? qualifiedTiers[qualifiedTiers.length - 1] : undefined;
}

/** Get all programs that offer status matching */
export function getStatusMatchPrograms(): LoyaltyProgram[] {
  return LOYALTY_PROGRAMS.filter((p) => p.statusMatchAvailable);
}
