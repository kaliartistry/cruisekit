/* ------------------------------------------------------------------ */
/*  Guide Data — First-Timer Cruise Guides for CruiseKit              */
/* ------------------------------------------------------------------ */

export interface GuideQA {
  question: string;
  answer: string;
  appliesTo?: string;
  productRecommendation?: { name: string; description: string };
}

export interface GuideSection {
  id: string;
  title: string;
  content: GuideQA[];
}

export type GuideCategory =
  | "first-timer"
  | "packing"
  | "budget"
  | "onboard"
  | "port-days"
  | "insurance";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  icon: string;
  readTime: string;
  updatedDate: string;
  sections: GuideSection[];
}

/* ------------------------------------------------------------------ */
/*  Category metadata                                                  */
/* ------------------------------------------------------------------ */

export const GUIDE_CATEGORIES: {
  key: GuideCategory | "all";
  label: string;
}[] = [
  { key: "all", label: "All Guides" },
  { key: "first-timer", label: "First-Timer" },
  { key: "packing", label: "Packing" },
  { key: "budget", label: "Budget" },
  { key: "onboard", label: "Onboard" },
  { key: "port-days", label: "Port Days" },
  { key: "insurance", label: "Insurance" },
];

/* ------------------------------------------------------------------ */
/*  Guide 1 — The Complete First-Timer's Cruise Guide                  */
/* ------------------------------------------------------------------ */

const firstTimerGuide: Guide = {
  slug: "first-time-cruise-guide",
  title: "The Complete First-Timer's Cruise Guide",
  description:
    "Everything you need to know before your first cruise — from embarkation day to loyalty programs. Real answers from experienced cruisers.",
  category: "first-timer",
  icon: "\uD83C\uDF92",
  readTime: "15 min read",
  updatedDate: "2026-03-28",
  sections: [
    {
      id: "embarkation-day",
      title: "Embarkation Day",
      content: [
        {
          question: "What time should I actually get to the port?",
          answer:
            "Arrive as early as your assigned boarding window allows. Getting on board early means you can explore the ship while it's empty, eat a relaxed lunch before the crowds, and start your vacation hours before sail-away. If you arrive before your window, some ports may make you wait outside, but many major terminals (like Miami and Port Canaveral) are flexible and will process you quickly. Pro tip: book the earliest check-in window the moment it opens — it's free and fills up fast.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What documents do I need to board?",
          answer:
            "For closed-loop cruises (departing from and returning to the same U.S. port), U.S. citizens technically only need a government-issued photo ID and a certified birth certificate. However, we strongly recommend bringing a passport. If there's a medical emergency and you need to fly home from a foreign port, an airline won't let you board without one. For all other itineraries — including one-way cruises, European sailings, and anything touching a non-U.S. port where you'll deplane — a valid passport is required. Check your specific cruise line's requirements at least 60 days before sailing.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What should I pack in my carry-on bag for day one?",
          answer:
            "Your checked luggage may not arrive at your cabin for several hours after boarding, so pack a small bag with everything you'll need for the first afternoon: swimsuit, sunscreen, phone charger, any medications, a change of clothes if you want to swap out of travel wear, and your cruise documents. Don't forget to print (or screenshot) your luggage tags and boarding pass. Many experienced cruisers also pack a lanyard for their cruise card and a small power strip or USB hub since cabin outlets are limited.",
          appliesTo: "All cruise lines",
        },
        {
          question: "How does the muster drill work?",
          answer:
            "Every cruise ship is required to conduct a safety muster drill before departure. Most major cruise lines have switched to an \"e-muster\" system where you watch a safety video on the ship's app or your stateroom TV, then briefly visit your assigned muster station so a crew member can scan your card. The whole process takes about 10 minutes and must be completed before the ship departs. Don't skip it — the ship literally cannot leave until every passenger has checked in at their station.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "cabin-selection",
      title: "Cabin Selection",
      content: [
        {
          question: "Inside, oceanview, balcony, or suite — which cabin should I book?",
          answer:
            "For first-timers, a balcony cabin offers the best value-to-experience ratio. You get fresh air, natural light, and a private space to enjoy morning coffee or watch port arrivals — and it's a significant upgrade from an inside cabin for a moderate price difference. Inside cabins are great if you're on a tight budget and plan to spend most of your time out of the room. Oceanview cabins with a porthole feel like a compromise that satisfies neither — go balcony or save money with an inside. Suites are wonderful but unnecessary for a first cruise; save them for when you know what you love about cruising.",
          appliesTo: "All cruise lines",
        },
        {
          question: "Does cabin location on the ship really matter?",
          answer:
            "Yes, more than most people realize. Midship cabins on lower decks experience the least motion, which is important if you're prone to seasickness. Avoid cabins directly below the pool deck, above the theater, or near the anchor machinery (forward, lowest deck) — all are noise hotspots. Also avoid cabins near elevator banks if you're a light sleeper. On the ship's deck plan, look for a midship cabin on decks 6-10 for the sweet spot of minimal motion and reasonable elevator access. For port-intensive itineraries, a cabin on the port side (left when facing forward) often gives you the better view when docking.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "motion-sickness",
      title: "Motion Sickness",
      content: [
        {
          question: "Will I get seasick on a cruise ship?",
          answer:
            "Modern cruise ships are enormous — the largest ones are over 230,000 gross tons — and equipped with advanced stabilizer systems that dramatically reduce rocking. Most people who get carsick or mildly motion-sensitive do perfectly fine on a cruise. That said, rough seas happen, especially on transatlantic crossings or during storm season in the Caribbean (August-October). Pack Dramamine or Bonine just in case. Sea-Bands (acupressure wristbands) work for some people. The ship's medical center also stocks prescription-strength patches (scopolamine). Choose a midship, lower-deck cabin if you're concerned, and keep your eyes on the horizon if you start feeling queasy. Green apples and ginger ale from the buffet are classic cruiser remedies too.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Dramamine Non-Drowsy",
            description:
              "Meclizine-based motion sickness prevention — take 1 hour before boarding for all-day relief without drowsiness.",
          },
        },
      ],
    },
    {
      id: "life-onboard",
      title: "Life Onboard",
      content: [
        {
          question: "Is the food really free on a cruise?",
          answer:
            "Yes — and it's plentiful. Your cruise fare includes all meals at the main dining room (multi-course dinners with waiter service), the buffet (open for breakfast, lunch, and dinner), and various casual eateries that vary by cruise line (think pizza, burgers, tacos, Asian noodle bars). Room service is usually free or costs a small delivery fee ($3-5 on some lines). The food you pay extra for includes specialty restaurants (typically $25-$80 per person), premium desserts like gelato or crème brûlée at dedicated shops, and some à la carte snack items. Honestly, you could eat phenomenally well for your entire cruise without spending a single extra dollar on food.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What drinks are included in the cruise fare?",
          answer:
            "Every cruise line includes water, iced tea, lemonade, drip coffee, and hot tea at no charge. Some lines include more: Virgin Voyages includes sodas and specialty coffee for everyone; Norwegian includes open bar with their Free at Sea promotion (though you pay a mandatory $21.80/day gratuity on it). Most other lines charge for sodas ($3-4 each), specialty coffee ($5-7), and alcoholic drinks ($8-15). That's why drink packages exist — and whether they're worth it depends on how much you drink. See our drink package guide for the full breakdown.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What's the dress code on a cruise?",
          answer:
            "During the day, anything goes — swimsuits, shorts, flip-flops, you name it. For dinner in the main dining room, most lines ask for \"cruise casual\" (think nice jeans or khakis with a collared shirt for men; a sundress or blouse for women). On formal nights (usually 1-2 per 7-night cruise), the main dining room expects cocktail attire or suits/tuxedos. However, you can always skip the formal dining room on those nights and eat at the buffet or casual venues in whatever you're wearing. Lines like Norwegian, Virgin Voyages, and Carnival are more relaxed overall. Disney, Celebrity, and Holland America lean slightly dressier.",
          appliesTo: "All cruise lines",
        },
        {
          question: "Do I need to bring cash on a cruise?",
          answer:
            "Almost everything on board is charged to your cruise card (SeaPass, Sail & Sign, etc.), which is linked to a credit card you provide at check-in. You won't need cash on the ship itself. However, bring small bills ($1-5) for tipping excursion guides, porters at the port, and bartenders if you want to leave a little extra beyond the auto-gratuity. At ports of call, local vendors and taxi drivers often prefer cash — especially in the Caribbean and Mexico. An ATM is available on most ships but charges hefty fees ($5-8 per transaction).",
          appliesTo: "All cruise lines",
        },
        {
          question: "Is there cell service and WiFi on a cruise ship?",
          answer:
            "Your phone will work at sea via satellite roaming — and the charges are astronomical ($2-5 per minute for calls, $5-10 per MB of data). Turn off cellular data and roaming immediately when you board. Ship WiFi packages are the way to go: expect to pay $15-45 per day depending on the cruise line and speed tier. Basic \"social\" plans allow messaging apps; premium plans support streaming. Virgin Voyages includes basic WiFi free. Princess includes it in their Plus bundle. At port, look for free WiFi at the terminal or nearby restaurants. Our True Cost Calculator includes WiFi in total cost estimates.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "CruiseKit True Cost Calculator",
            description:
              "Calculate your real cruise cost including WiFi, drinks, tips, and excursions — so there are no surprises.",
          },
        },
        {
          question: "What happens on sea days?",
          answer:
            "Sea days are many cruisers' favorite part of the trip. The ship comes alive with activities: trivia contests, cooking demonstrations, poolside DJs, live music, art auctions, casino tournaments, bingo, craft classes, fitness classes, and more. The daily schedule (delivered to your cabin each evening or available on the ship's app) lists everything happening that day, hour by hour. Or do absolutely nothing — grab a book, find a quiet deck chair, and watch the ocean. The spa runs specials on sea days. The pool deck can get crowded by 10 AM, so grab chairs early if that's your thing.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "loyalty-programs",
      title: "Loyalty Programs",
      content: [
        {
          question: "How do cruise line loyalty programs work?",
          answer:
            "Every major cruise line has a loyalty program that rewards repeat cruisers with escalating perks. You earn points or \"cruise nights\" based on the number of nights you sail (and sometimes your cabin category). Benefits start modest — priority check-in, a welcome-back party — and grow to include free internet, complimentary laundry, drink discounts, and even free cruises at the highest tiers. The key thing to know: loyalty programs are line-specific, so sailing Royal Caribbean builds your Crown & Anchor Society status but does nothing for your Carnival VIFP status. If you love your first cruise, it's worth sticking with one line (or line family) to build status faster. Some lines (Celebrity and Royal Caribbean) offer status matching if you have elite status on a competitor.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "missing-the-ship",
      title: "Missing the Ship",
      content: [
        {
          question: "What happens if I miss the ship at a port?",
          answer:
            "The ship will leave without you — full stop. Cruise ships operate on strict schedules and cannot wait for individual passengers (the only exception is if you're on a ship-sponsored excursion that runs late). If you miss the ship, you're responsible for getting yourself to the next port at your own expense. This might mean a taxi ride, a domestic flight, or even an international journey. Travel insurance that covers \"catch-up\" transportation is essential for this reason. To avoid this nightmare: always be back on board at least 1 hour before the published departure time, set multiple alarms, and consider booking excursions through the cruise line for the built-in guarantee.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "getting-sick",
      title: "Getting Sick Onboard",
      content: [
        {
          question: "What if I get sick on the cruise?",
          answer:
            "Every cruise ship has a medical center staffed with licensed doctors and nurses, open for scheduled hours and 24/7 for emergencies. Expect to pay for medical visits ($150-300 for a consultation) and medications — these costs are not covered by your cruise fare and are often not covered by domestic health insurance. This is a major reason to buy travel insurance with medical coverage before your cruise. For minor issues like colds or stomach bugs, the medical center can help quickly. For serious emergencies, the ship can arrange medical evacuation by helicopter or divert to the nearest port. Norovirus outbreaks get media attention but are actually rare — the number one thing you can do to prevent illness is wash your hands frequently and use the hand sanitizer stations positioned at every dining entrance.",
          appliesTo: "All cruise lines",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Guide 2 — Cruise Packing List 2026                                 */
/* ------------------------------------------------------------------ */

const packingGuide: Guide = {
  slug: "cruise-packing-list",
  title: "Cruise Packing List 2026: What to Bring (and What to Skip)",
  description:
    "The ultimate cruise packing checklist — luggage tags, cabin hacks, toiletries, and banned items. Updated for 2026 cruise line policies.",
  category: "packing",
  icon: "\uD83E\uDDF3",
  readTime: "10 min read",
  updatedDate: "2026-03-28",
  sections: [
    {
      id: "luggage-tags",
      title: "Luggage Tags & Boarding",
      content: [
        {
          question: "Do I need to print luggage tags before the cruise?",
          answer:
            "Yes — most cruise lines require you to print color luggage tags and attach them to each piece of checked luggage before arriving at the port. You'll receive these via email or download them from the cruise line's app or website after completing online check-in (which typically opens 45-60 days before sailing). Print them on regular paper and slip them into the clear plastic tag holders from your last cruise, or fold and tape them securely. Some lines (Royal Caribbean, Celebrity) now offer the option to use digital luggage tags via the app if you have NFC-enabled label printers, but paper is still the standard. Don't have a printer? Most hotel business centers or FedEx locations near the port can print them for a small fee.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Cruise Luggage Tag Holders (8-Pack)",
            description:
              "Reusable zip-top luggage tag holders that fit all major cruise lines. No tape or staples needed.",
          },
        },
      ],
    },
    {
      id: "cabin-hacks",
      title: "Cabin Hacks & Must-Bring Items",
      content: [
        {
          question: "What cabin essentials do experienced cruisers always bring?",
          answer:
            "Cruise cabins are compact, so smart packing makes a big difference. Here's what seasoned cruisers swear by: a magnetic hook set (cabin walls are metal — hang hats, bags, and lanyards without taking up counter space), a small power strip or USB hub (cabins typically have only 1-2 outlets, and they're often European-style — note that surge protectors and extension cords are banned on most lines), a hanging toiletry organizer, a nightlight for the bathroom, a waterproof phone pouch for pool days and shore excursions, and a collapsible tote bag for port days. A door-mounted shoe organizer doubles as brilliant over-the-bathroom-door storage for toiletries, sunscreen, and small items.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Cruise Cabin Magnetic Hook Kit",
            description:
              "Heavy-duty magnetic hooks that attach to metal cabin walls. Holds up to 40 lbs — perfect for hats, bags, and towels.",
          },
        },
        {
          question: "Should I bring a power strip for the cabin?",
          answer:
            "Bring a non-surge-protected power strip or a USB charging hub. Cruise ships ban surge protectors and extension cords (fire hazard), but most allow basic multi-outlet adapters and USB hubs. Look for ones labeled \"cruise ship approved\" — they won't have a circuit breaker or power switch, which is what security flags. With 2-4 people in a cabin and only 1-2 outlets, a USB hub with 4-6 ports is a lifesaver for charging phones, watches, tablets, and cameras overnight. European-to-US adapters are also handy since some ships have mixed outlet types.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Cruise-Approved USB Charging Hub",
            description:
              "6-port USB charging station with no surge protector — approved for all major cruise lines.",
          },
        },
      ],
    },
    {
      id: "toiletries",
      title: "Toiletries & Personal Items",
      content: [
        {
          question: "Does the cruise ship provide shampoo and soap?",
          answer:
            "Yes, but quality varies. Most modern cruise ships provide wall-mounted dispensers with body wash, shampoo, and conditioner in the shower (the days of tiny bottles are mostly over). The products are usually a mid-range brand — pleasant but not luxurious. If you're particular about your hair care or skin care, bring your own in travel-size containers. Full-size bottles are fine in checked luggage; there are no TSA-style liquid restrictions for cruise ships. Sunscreen is the one toiletry you should absolutely bring from home — it's dramatically overpriced in the ship's gift shop ($15-25 for a small bottle). Bring reef-safe sunscreen if you're visiting Caribbean ports, as many islands now require it.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Reef-Safe Mineral Sunscreen SPF 50",
            description:
              "Mineral-based, reef-safe formula accepted at all Caribbean ports. Bring from home to save 60% vs. onboard prices.",
          },
        },
      ],
    },
    {
      id: "banned-items",
      title: "Banned & Restricted Items",
      content: [
        {
          question: "What items are banned on cruise ships?",
          answer:
            "Every cruise line prohibits: surge protectors and extension cords, irons and steamers (use the ship's laundry or pack wrinkle-release spray), candles and incense, hot plates and cooking appliances, weapons of any kind, and illegal drugs (including marijuana, even if legal in your home state — ships operate under federal and international maritime law). Most lines also ban drones, hoverboards, and walkie-talkies that use public frequencies. Each line has its own nuances, so check your specific carrier's prohibited items list.",
          appliesTo: "All cruise lines",
        },
        {
          question: "Can I bring alcohol on a cruise ship?",
          answer:
            "Policies vary significantly by cruise line. Carnival allows one 750ml bottle of wine or champagne per person in carry-on luggage (no liquor). Royal Caribbean allows the same — one bottle of wine per person, no hard liquor. Norwegian allows one bottle of wine or champagne per stateroom. Celebrity allows two bottles of wine per stateroom. Disney allows two bottles of wine or one six-pack of beer per person. MSC allows none at all. Virgin Voyages allows none. If you bring more than allowed, the extra bottles are confiscated and returned on the last day. Corkage fees in the dining room range from $15-25 per bottle. Purchasing alcohol at port and bringing it aboard is generally prohibited — security will hold it until disembarkation.",
          appliesTo: "All cruise lines",
        },
        {
          question: "Can I bring a drone on a cruise?",
          answer:
            "Almost all cruise lines ban drones entirely — both on the ship and in port. Royal Caribbean, Carnival, Norwegian, MSC, Celebrity, Disney, and Virgin Voyages all prohibit drones. Holland America and Princess have similar policies. Even at ports of call, many Caribbean islands and European cities have strict no-fly zones around harbors and historic areas. If security finds a drone in your luggage, it will be confiscated and held until disembarkation. Leave it at home.",
          appliesTo: "All cruise lines",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Guide 3 — Is the Drink Package Worth It?                           */
/* ------------------------------------------------------------------ */

const drinkPackageGuide: Guide = {
  slug: "drink-package-guide",
  title: "Is the Drink Package Worth It? The 2026 Break-Even Math",
  description:
    "A line-by-line breakdown of every major cruise line's drink package pricing, break-even points, and whether it's actually worth it for you.",
  category: "budget",
  icon: "\uD83C\uDF79",
  readTime: "12 min read",
  updatedDate: "2026-03-28",
  sections: [
    {
      id: "break-even-math",
      title: "Break-Even Math: How Many Drinks Do You Need?",
      content: [
        {
          question: "How do I figure out if the drink package is worth it for me?",
          answer:
            "The math is simple: divide the daily package price (including service charge/gratuity) by the average price of the drinks you'd order. If the package costs $92/day after gratuity and your average cocktail is $14, you need to drink about 6.5 drinks per day to break even. That's doable for some people on a vacation, but remember — that's every single day for the entire cruise, including embarkation day (when you board late) and port days (when you're off the ship for hours). Most casual drinkers average 3-4 drinks per day and won't break even. Heavy social drinkers who enjoy poolside cocktails, wine with lunch, drinks at dinner, and nightcaps will come out ahead. Specialty coffee drinkers should factor those in too — a $7 latte twice a day adds up.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "CruiseKit True Cost Calculator",
            description:
              "Use our calculator to see your true drink package cost and whether you'll break even based on your actual drinking habits.",
          },
        },
        {
          question: "Do all adults in the cabin have to buy the drink package?",
          answer:
            "On most cruise lines, yes. Royal Caribbean, Carnival, Holland America, and Celebrity all require that every adult of legal drinking age in the same stateroom purchases the drink package if one person does. This is the rule that catches many couples off guard — if one of you is a heavy drinker and the other barely touches alcohol, you're both paying full price. Norwegian includes open bar with Free at Sea for all guests. Princess bundles it into their Plus/Premier packages for all guests. Virgin Voyages uses a pre-paid bar tab system that's per-person with no sharing requirement. Disney doesn't offer drink packages at all — everything is pay-as-you-go.",
          appliesTo: "All cruise lines",
        },
        {
          question:
            "What's the best strategy for saving on drinks without a package?",
          answer:
            "Several tried-and-true strategies: First, pre-order drinks at port — you can often bring one bottle of wine per person aboard. Second, attend the art auction (they often give out free champagne). Third, join the loyalty program — even low tiers sometimes include a welcome-back cocktail party with free drinks. Fourth, buy duty-free liquor at ports (the ship will hold it until the last day, but you can enjoy it at home). Fifth, drink at the included venues — water, tea, coffee, lemonade, and iced tea are free everywhere. Sixth, if your line allows it, buy individual drink packages for specific needs — a soda package or coffee package is much cheaper than the full unlimited bar.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "line-by-line-pricing",
      title: "Drink Package Pricing by Cruise Line (2026)",
      content: [
        {
          question:
            "How much is the Royal Caribbean drink package?",
          answer:
            "Royal Caribbean's Deluxe Beverage Package costs approximately $78/day per person before the mandatory 18% gratuity, bringing the real cost to about $92/day. Prices use dynamic pricing and range from $56-$120/day depending on sailing date, ship, and when you purchase. Buy pre-cruise for the best rate — onboard prices are consistently higher. The package covers unlimited cocktails, beer, wine by the glass, sodas, specialty coffee, bottled water, and fresh-squeezed juices. It does not cover room service drinks, mini-bar items, or bottles of wine. All adults in the same stateroom must purchase if one does. As of March 2026, the Coca-Cola Freestyle cup is no longer included in the package.",
          appliesTo: "Royal Caribbean",
        },
        {
          question: "How much is the Carnival drink package?",
          answer:
            "Carnival's CHEERS! Beverage Program costs $82.54/day per person pre-cruise or $90.60/day onboard, plus a 20% gratuity (recently raised from 18%). That makes the real pre-cruise cost about $99/day. The package includes drinks priced at $20 or less — covering most cocktails, beer, wine, sodas, specialty coffee, and bottled water. The 15-drink-per-day limit was quietly removed in 2025. All adults in the cabin must purchase. Their Zero Proof package at $43.95/day is a solid option for non-drinkers who want specialty coffees and premium non-alcoholic beverages.",
          appliesTo: "Carnival",
        },
        {
          question:
            "Does Norwegian include drinks for free?",
          answer:
            "Effectively, yes. Norwegian's standard Free at Sea promotion includes open bar for all guests in the booking. However, there's a mandatory $21.80/day per person gratuity on the \"free\" drinks that you cannot remove — so it's not truly free. On a 7-night cruise, that's $152.60 per person just in drink gratuity. The Free at Sea bar covers most standard cocktails, beer, wine, and spirits. As of March 2026, Free at Sea drink packages no longer work at Great Stirrup Cay (Norwegian's private island). You can upgrade to Free at Sea Plus for $49.99/day which adds unlimited streaming WiFi, Starbucks drinks, and premium spirits.",
          appliesTo: "Norwegian",
        },
        {
          question: "How much is the Celebrity drink package?",
          answer:
            "Celebrity offers two main tiers: the Classic Beverage Package at $89.99/day (drinks up to $12) and the Premium Beverage Package at $104.99/day (drinks up to $19). Both are subject to a 20% gratuity, making real costs $108/day and $126/day respectively. The Classic package covers most standard cocktails, house wine, domestic beer, sodas, and specialty coffee. Premium adds top-shelf spirits, premium wine, and craft cocktails. Celebrity also offers a Zero Proof Package at $45/day + 20% ($54/day real cost) for non-drinkers. All adults in the stateroom must purchase the same tier.",
          appliesTo: "Celebrity",
        },
        {
          question:
            "How does the Princess drink package work?",
          answer:
            "Princess doesn't sell drink packages standalone — they're bundled into Princess Plus ($65/day) and Princess Premier ($100/day, or $105 on Sphere-class ships). Princess Plus includes drinks up to $15, WiFi for 1 device, gratuities, and 4 casual specialty dining meals. Princess Premier bumps it to drinks up to $20, WiFi for 4 devices, unlimited specialty dining, unlimited photos, a $100 excursion credit on 7+ night sailings, and reserved theater seating. The bundle approach means you're getting multiple perks, not just drinks — making it harder to do simple break-even math but often a strong value overall. The 20% service charge is included in the bundle price.",
          appliesTo: "Princess",
        },
        {
          question:
            "How does Holland America handle drink packages?",
          answer:
            "Holland America offers three standalone drink package tiers: Quench (non-alcoholic) at $17.95/day, Signature (drinks up to $11) at $60.95/day, and Elite (drinks up to $15) at $65.95/day. All are subject to an 18% gratuity. Their Have It All bundle ($60/day) includes the Signature Beverage Package, Surf WiFi, one specialty dinner, and a $100 shore excursion credit — which is often the best deal if you want more than just drinks. All legal-drinking-age adults in the same cabin must purchase a drink package if one does.",
          appliesTo: "Holland America",
        },
        {
          question: "Does Disney offer a drink package?",
          answer:
            "No. Disney Cruise Line intentionally does not offer unlimited drink packages to maintain a family-friendly atmosphere. All alcoholic beverages are pay-as-you-go. Cocktails run $10-16, beer $7-10, and wine by the glass $9-15. Soft drinks at meals are complimentary. Specialty coffee is available at Cove Cafe. This is actually a refreshing approach for many families — you don't feel pressure to \"get your money's worth\" and can simply enjoy drinks at your own pace.",
          appliesTo: "Disney",
        },
        {
          question: "How do drinks work on Virgin Voyages?",
          answer:
            "Virgin Voyages takes a unique approach: no unlimited drink packages at all. Instead, they offer a pre-paid Bar Tab system where you buy credit in advance and receive bonus spending power. For example, a $300 Bar Tab gives you $350 in spending power ($50 bonus), while a $500 Bar Tab gives $600 ($100 bonus). There's no service charge or gratuity added to individual drinks — the price you see on the menu is what you pay. Sodas, regular coffee, and tea are included in the fare. Basic WiFi is also included. This system rewards moderate drinkers who don't want to commit to an unlimited package but appreciate a discount.",
          appliesTo: "Virgin Voyages",
        },
        {
          question: "How does the MSC drink package work?",
          answer:
            "MSC's main offering is the Premium Extra package at approximately $85/day, which includes up to 15 alcoholic drinks per day plus unlimited non-alcoholic beverages. Service charge is included in the package price (no separate gratuity). MSC eliminated their budget drink packages in April 2025, and new package tiers are expected by summer 2026. For the best value, look at MSC's Yacht Club fare class — it's their ship-within-a-ship luxury option that includes all beverages, WiFi, a dedicated pool and restaurant, and butler service. Their Alcohol-Free Package runs about $30/day.",
          appliesTo: "MSC",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Guide 4 — Cruise Tipping Guide 2026                                */
/* ------------------------------------------------------------------ */

const tippingGuide: Guide = {
  slug: "cruise-tipping-guide",
  title: "Cruise Tipping Guide 2026: Auto-Gratuities, Cash Tips & More",
  description:
    "Understand cruise ship gratuities — how much, who to tip, and whether you can remove auto-gratuities. Updated rates for all 9 major cruise lines.",
  category: "budget",
  icon: "\uD83D\uDCB0",
  readTime: "10 min read",
  updatedDate: "2026-03-28",
  sections: [
    {
      id: "auto-gratuities",
      title: "Auto-Gratuities Explained",
      content: [
        {
          question: "What are auto-gratuities and how do they work?",
          answer:
            "Auto-gratuities (also called \"daily service charges\" or \"crew appreciation\") are a fixed daily charge added automatically to your onboard account. They typically range from $16-25 per person per day depending on the cruise line and cabin category, and they're designed to compensate the behind-the-scenes crew who make your cruise possible — cabin stewards, dining room staff, kitchen workers, and other service personnel. These charges appear on your final bill and are paid with whatever payment method you linked to your cruise card. On a 7-night cruise for two people, auto-gratuities alone can add $224-$350 to your total cost. This is one of the biggest \"hidden\" costs that surprises first-time cruisers.",
          appliesTo: "All cruise lines",
        },
        {
          question:
            "How much are auto-gratuities on each cruise line in 2026?",
          answer:
            "Here are the current daily per-person gratuity rates for 2026: Royal Caribbean — $18.50 standard, $21.00 suites. Carnival — $17.00 standard, $19.00 suites (effective April 2, 2026). Norwegian — $20.00 standard, $25.00 suites. MSC — $16.00 for all cabin types (Caribbean itineraries; varies by region). Celebrity — $18.00 standard, $23.00 suites (Concierge/AquaClass $19.00). Princess — $18.00 standard, $20.00 suites (mini-suite $19.00). Holland America — $17.00 standard, $19.00 suites. Disney — $16.00 standard, $27.25 suites. Virgin Voyages — $20.00 prepaid, $22.00 if paid onboard. These rates have been climbing steadily — most lines raised them 8-16% in the past two years.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "removing-gratuities",
      title: "Can You Remove Gratuities?",
      content: [
        {
          question: "Can I remove auto-gratuities from my cruise bill?",
          answer:
            "Technically, yes — on most cruise lines you can visit Guest Services and request to have auto-gratuities reduced or removed. However, there are strong reasons not to: these gratuities are a significant portion of crew members' income, and the crew works incredibly hard (often 10-14 hour days, 7 days a week, for months at a time away from their families). Some cruise lines have made it increasingly difficult to remove them — requiring an in-person visit to Guest Services and sometimes a conversation about why. Norwegian's drink package gratuity ($21.80/day) cannot be removed at all. Princess and Celebrity include gratuities in their bundle pricing (Plus, Premier, All Included), making them non-removable when you purchase those packages. Our honest advice: budget for gratuities as a non-negotiable part of your cruise cost.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "extra-cash-tips",
      title: "Extra Cash Tips: Who, When & How Much",
      content: [
        {
          question: "Should I give extra cash tips beyond auto-gratuities?",
          answer:
            "Auto-gratuities cover the baseline, but extra cash tips are a wonderful way to recognize exceptional service. Here's who experienced cruisers commonly tip extra: Your cabin steward — $20-50 in cash at the end of the cruise (they often clean your room twice a day and handle special requests). Your main dining room waiter and assistant waiter — $20-40 and $10-20 respectively if you dine in the main dining room regularly. Bartenders — $1-2 per drink if you have a favorite bar and want preferential service (auto-gratuity is already added to each drink check). Specialty restaurant servers — $5-10 per meal. Room service delivery — $2-5 per delivery. None of these are required, but they're deeply appreciated.",
          appliesTo: "All cruise lines",
        },
        {
          question: "When and how do I give cash tips?",
          answer:
            "The standard approach is to hand cash tips directly to crew members on the last evening of the cruise or on the final morning. Put the cash in an envelope (you can request envelopes from Guest Services) with a brief thank-you note. For your cabin steward, leave the envelope on the bed or hand it to them directly. For dining staff, hand it to them at your last dinner. Some cruisers prefer to tip at the beginning of the cruise to build rapport — handing your cabin steward $20 on day one with a friendly introduction can result in exceptional service all week. For drink service at the pool or bar, tip per-drink throughout the cruise. Small bills ($1, $5, $10, $20) are easiest — crew members often have difficulty breaking larger bills.",
          appliesTo: "All cruise lines",
        },
        {
          question:
            "What about tipping on shore excursions?",
          answer:
            "Tipping excursion guides and drivers is standard practice and separate from your onboard gratuities. For a half-day group tour, $5-10 per person for the guide and $2-5 for the driver is customary. For private tours, 15-20% of the tour cost is appropriate. For water-based excursions (snorkeling, diving, boat tours), $5-10 per person for the crew. Porters at the cruise terminal on embarkation and debarkation day should receive $1-2 per bag. These are cash-only situations, so plan accordingly — Caribbean and Mexican ports especially are cash-preferred economies.",
          appliesTo: "All cruise lines",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Guide 5 — Port Day Tips                                            */
/* ------------------------------------------------------------------ */

const portDayGuide: Guide = {
  slug: "port-day-tips",
  title: "Port Day Tips: How to Make the Most of Every Stop",
  description:
    "Passport requirements, ship time vs. local time, booking excursions, and everything else you need to know for stress-free port days.",
  category: "port-days",
  icon: "\uD83C\uDFDD\uFE0F",
  readTime: "10 min read",
  updatedDate: "2026-03-28",
  sections: [
    {
      id: "passport-requirements",
      title: "Passport & Documentation Requirements",
      content: [
        {
          question: "Do I need a passport for a cruise?",
          answer:
            "For closed-loop cruises departing from and returning to the same U.S. port, U.S. citizens can legally sail with just a birth certificate and government-issued photo ID. However, we cannot stress this enough: bring a passport anyway. Here's why — if there's a medical emergency and you need to be airlifted to a hospital in a foreign country, or if the ship has a mechanical issue and passengers need to fly home from a foreign port, you will be stranded without a passport. Airlines will not board you. The U.S. passport card ($65) works for land and sea border crossings to Canada, Mexico, the Caribbean, and Bermuda but not for air travel — so it's only a partial solution. A full passport book ($145) is always the safest choice. Apply at least 3-4 months before your cruise, as processing times can be lengthy.",
          appliesTo: "All cruise lines",
        },
        {
          question: "Are there ports that require additional visas?",
          answer:
            "Yes, and this catches some cruisers off guard. U.S. citizens need visas for: Russia (St. Petersburg — though most cruises offer visa-free shore excursion programs), China (some ports require a transit visa), India, Brazil, and Australia/New Zealand (electronic visa or ETA required in advance). Your cruise line will notify you of specific visa requirements for your itinerary, usually at booking and again 60-90 days before sailing. Some countries allow visa-free transit if you're in port for less than 24 hours and have booked a ship-sponsored excursion — always verify the current rules, as they change frequently. European ports do not require visas for U.S. citizens staying under 90 days (but as of 2025, the EU's ETIAS system requires a pre-travel authorization — similar to the U.S. ESTA).",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "ship-time-vs-local-time",
      title: "Ship Time vs. Local Time",
      content: [
        {
          question:
            "What's the difference between ship time and local time, and which one matters?",
          answer:
            "Ship time is the official time maintained by the cruise ship, and it's the one that matters for getting back on board. In most Caribbean itineraries, ship time stays constant throughout the voyage (typically Eastern Time). But when you step off the ship at a port, the local time might be different — for example, Cozumel is in Central Time (1 hour behind Eastern). Your phone will automatically switch to local time, which can cause dangerous confusion. The all-aboard time printed on your daily schedule is always in SHIP time. If the ship says \"all aboard at 4:00 PM\" and local time is 1 hour behind, you need to be back by 3:00 PM local time. Set a manual alarm in ship time, wear a watch set to ship time, or keep the cruise line's app open — it always shows ship time. Missing the ship because of a time zone mix-up is more common than you'd think.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What time should I return to the ship?",
          answer:
            "The \"all aboard\" time is typically 30 minutes before departure — but don't cut it that close. Experienced cruisers recommend being back at the port terminal at least 60-90 minutes before departure. This gives you a buffer for unexpected delays: long taxi lines, traffic, a late-running excursion, or a longer-than-expected walk back to the ship. Security re-screening at the port takes 5-15 minutes. Also keep in mind that the gangway can close before the official all-aboard time if the ship needs to depart early due to weather or port scheduling. When in doubt, err on the side of getting back early — you can always enjoy a drink on your balcony and watch the latecomers sprint down the pier.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "booking-excursions",
      title: "Booking Excursions",
      content: [
        {
          question:
            "Should I book excursions through the cruise line or independently?",
          answer:
            "Both approaches have real advantages. Ship-sponsored excursions offer one critical guarantee: if the excursion runs late, the ship will wait for you. That alone is worth the premium for many people, especially at ports where the ship docks far from town. Ship excursions are also easy to book (through the app or onboard), refundable if the port is skipped due to weather, and require no research. The downside: they cost 30-60% more than comparable independent tours and often move in large groups. Independent excursions (booked through platforms like Viator, GetYourGuide, or directly with local operators) are cheaper, more personalized, and offer more variety. The risk: if your tour runs late, the ship leaves without you. A balanced strategy: book through the ship at ports where tendering is involved (small boats ferry you to shore, and these can be delayed), and book independently at ports where the ship docks close to town and you can easily manage your own time.",
          appliesTo: "All cruise lines",
        },
        {
          question: "Is it worth doing anything at port, or should I just stay on the ship?",
          answer:
            "Port days with the ship nearly empty are a hidden gem — shorter lines at the pool, spa specials, quiet dining rooms, and run of the ship. Some experienced cruisers deliberately skip certain ports and enjoy the ship. That said, the ports are a major reason to cruise in the first place. Our recommendation for first-timers: explore every port on your first cruise, even if it's just walking around the immediate area for an hour or two. You'll quickly learn which types of ports excite you (beach days, historical cities, adventure excursions, shopping) and which you'd skip on future cruises. Free options at port include: walking to the nearest beach, exploring the cruise terminal shopping area, and wandering the local town. You don't need to book a $100 excursion to have a great port day.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What should I bring off the ship at port?",
          answer:
            "Keep it minimal: your cruise card (it's your boarding pass to get back on), a government-issued photo ID (passport if visiting a port where you might need it), cash in small denominations (USD is widely accepted in the Caribbean; euros for European ports), sunscreen, a reusable water bottle, your phone, and a light daypack or crossbody bag. Leave valuables in the in-room safe. Don't bring your entire wallet — just one credit card and the cash you plan to spend. Many ports have vendors who accept credit cards, but market stalls and taxis are cash-only. If you plan to swim, wear your swimsuit under your clothes and pack a small towel (or bring a ship towel — check if your line allows it off the ship; most do).",
          appliesTo: "All cruise lines",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Guide 6 — Cruise Insurance Explained                               */
/* ------------------------------------------------------------------ */

const insuranceGuide: Guide = {
  slug: "cruise-insurance-explained",
  title: "Cruise Insurance Explained: Trip Insurance vs. Medical Evacuation",
  description:
    "What cruise insurance actually covers, why trip insurance alone isn't enough, and how medical evacuation coverage could save you from a $100,000 bill.",
  category: "insurance",
  icon: "\uD83D\uDEE1\uFE0F",
  readTime: "9 min read",
  updatedDate: "2026-04-17",
  sections: [
    {
      id: "do-i-need-cruise-insurance",
      title: "Do I actually need cruise insurance?",
      content: [
        {
          question: "Is cruise insurance worth it?",
          answer:
            "Short answer: almost always yes — but probably not the type your cruise line is selling you. The cruise line's own protection plan is typically the most expensive and the most limited option, often with coverage caps that don't match what a real emergency would cost. Third-party trip insurance from companies like Generali, Allianz, or Travelex usually costs 5-10% of your total trip cost (so $200-400 for a $4,000 cruise) and covers trip cancellation, trip interruption, baggage loss, and basic medical costs. Where most cruisers get burned: trip insurance medical coverage typically pays the NEAREST adequate facility, not your home hospital. If you have a cardiac event in Cozumel, standard trip insurance will fly you to a hospital in Mexico City — not Miami. That's where medical evacuation coverage like Medjet fills the gap.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What does cruise insurance typically NOT cover?",
          answer:
            "The most common gaps people discover too late: (1) Pre-existing medical conditions — most policies exclude them unless you buy insurance within 14-21 days of your initial cruise deposit, (2) Transportation home to your preferred hospital — standard policies cover the nearest facility only, (3) Cancel-for-any-reason coverage — this is typically a premium add-on (40-50% more expensive), (4) Adventure activities — ziplining, scuba diving below certain depths, and some excursion types are excluded from many policies, (5) Pregnancy complications past a certain trimester, and (6) Pandemic-related cancellations (post-2020 policies vary wildly here, read carefully). Always read the policy wording, not just the marketing summary.",
          appliesTo: "All cruise lines",
        },
      ],
    },
    {
      id: "trip-insurance-vs-medical-evac",
      title: "Trip insurance vs. medical evacuation — you probably need both",
      content: [
        {
          question: "What's the difference between trip insurance and medical evacuation coverage?",
          answer:
            "Trip insurance is broad but shallow — it reimburses you for a wide range of things (cancellations, lost bags, basic medical care abroad) but caps out quickly on the big-ticket items. Medical evacuation coverage is narrow but deep — it only covers medical transport, but it covers it completely and to a hospital of YOUR choice. Here's the scenario that most clearly shows the difference: you fall ill on a cruise in the Eastern Caribbean. The ship's medical team stabilizes you but recommends you disembark at the next port for higher-level care. Standard trip insurance will pay to fly you from, say, St. Maarten to the best hospital in St. Maarten or maybe Puerto Rico. Medical evacuation coverage like Medjet will fly you from St. Maarten directly to your chosen home hospital — Cleveland Clinic, MD Anderson, wherever your own doctors are. For a complex medical situation, the difference can easily be $75,000-150,000 and measurably better care outcomes.",
          appliesTo: "All cruise lines",
        },
        {
          question: "How much does medical evacuation actually cost if I pay out of pocket?",
          answer:
            "The real-world numbers are sobering. Basic helicopter evacuation from a ship to the nearest hospital: $25,000-50,000. Fixed-wing air ambulance between countries (e.g., Caribbean to Florida): $30,000-75,000. International air ambulance with medical staff (e.g., Mediterranean or Asia back to the US): $100,000-250,000. These are bills that have bankrupted families. Most credit card travel insurance and standard trip insurance caps medical evacuation at $50,000-100,000 — which sounds like a lot until you see a single flight quote come in at $180,000. Medjet (and similar membership-based services like MedjetHorizon, Global Rescue, and Covac Global) charges an annual membership fee of roughly $99-365 depending on your age and coverage level, and there's no cap on the transport cost — they absorb it.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Medjet",
            description:
              "Medical evacuation membership that transports you to your home hospital, not just the nearest facility. Annual memberships start around $99 for travelers under 75.",
          },
        },
      ],
    },
    {
      id: "what-medjet-covers",
      title: "What Medjet covers (and what it doesn't)",
      content: [
        {
          question: "How does Medjet's coverage work?",
          answer:
            "Medjet is a membership service, not traditional insurance — and that's actually why it works the way it does. When you become a member, you're not filing a claim; you're calling a 24/7 operations center that arranges your transport. If you're hospitalized more than 150 miles from home (domestic) or anywhere internationally, they arrange medical air transport to the hospital of your choice, in your home state. No deductibles, no claim paperwork, no reimbursement model — they handle the logistics and pay the bill directly. The base Medjet Assist membership covers medical transport. MedjetHorizon is the upgraded tier that also includes non-medical evacuation (political unrest, natural disasters, kidnap-for-ransom response). Pricing as of 2026: Medjet Assist is $295/year for an individual under 75, or $99 for 7-day coverage for shorter trips.",
          appliesTo: "All cruise lines",
        },
        {
          question: "What are the limitations I should know about?",
          answer:
            "Medjet isn't a catch-all. Key limitations: (1) You must be a member BEFORE you get sick or injured — there's typically a 7-day waiting period after enrolling, (2) You must be hospitalized as an inpatient to trigger coverage — outpatient visits and minor injuries that don't require admission aren't covered for transport, (3) The flight home is determined by medical necessity, not convenience — Medjet decides when you're stable enough to fly, (4) Pre-existing conditions are covered (unlike most trip insurance) but the service doesn't cover the medical treatment itself — only the transport. You still need trip insurance or regular health insurance to cover the actual hospital bills. For most cruisers, the ideal combination is: standard trip insurance ($200-400) PLUS Medjet membership ($99-295). Total annual cost for a frequent traveler: $300-700. Total financial exposure if you skip it: potentially six figures.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Medjet",
            description:
              "Medical transport membership that works alongside your existing trip and health insurance. Pairs well with Generali or Allianz trip insurance.",
          },
        },
      ],
    },
    {
      id: "when-to-buy",
      title: "When to buy cruise insurance",
      content: [
        {
          question: "When should I buy trip insurance — at booking or later?",
          answer:
            "Buy trip insurance within 14-21 days of your initial cruise deposit. This is the single most important timing rule for cruise insurance. Most quality trip insurance policies offer a \"pre-existing conditions waiver\" that covers medical issues you already have — BUT only if you buy the policy within this early window. Miss this window and any pre-existing condition is excluded, which for cruisers over 50 can mean the policy is nearly useless (since most claims at that age involve cardiac, diabetes, or joint issues). The cruise line will pressure you to buy THEIR insurance at booking — you don't have to. You can buy a third-party policy (often better coverage, lower price) as long as you do it within the 14-21 day window after your deposit.",
          appliesTo: "All cruise lines",
        },
        {
          question: "When should I enroll in Medjet?",
          answer:
            "Medjet membership has a 7-day waiting period from enrollment before coverage begins. For a specific trip, enroll at least two weeks before sailing to be safe. Better yet: if you cruise or travel internationally more than once a year, the annual membership ($295) is almost always better value than the per-trip option. Once enrolled, you're covered for every trip that year — not just the cruise you were thinking about when you signed up. For families, the family membership covers you, your spouse/partner, and dependent children for around $495/year total — significantly cheaper than buying individual trip-specific coverage for each person.",
          appliesTo: "All cruise lines",
          productRecommendation: {
            name: "Medjet",
            description:
              "Annual membership typically pays for itself if you take more than one trip per year. Family memberships cover spouse and dependent children.",
          },
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Export                                                              */
/* ------------------------------------------------------------------ */

export const GUIDES: Guide[] = [
  firstTimerGuide,
  packingGuide,
  drinkPackageGuide,
  tippingGuide,
  portDayGuide,
  insuranceGuide,
];

/** Look up a single guide by slug. */
export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Get all unique guide slugs. */
export function getAllGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
