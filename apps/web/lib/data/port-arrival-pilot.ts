export type PortArrivalStatus = "docked" | "tender" | "conditional";

export type PortArrivalPilot = {
  status: PortArrivalStatus;
  title: string;
  description: string;
  h1: string;
  answerHeading: string;
  answer: string;
  dayImpact: string;
  verifiedAt: string;
  sources: ReadonlyArray<{
    label: string;
    url: string;
  }>;
};

/**
 * Single rollback switch for the five-port search-result pilot.
 *
 * Keep the records below even when disabling the pilot so a rollback is one
 * reviewed boolean change instead of a template rewrite.
 */
export const TENDER_PORT_ANSWER_PILOT_ENABLED = true;

const PORT_ARRIVAL_PILOT: Readonly<Record<string, PortArrivalPilot>> = {
  "half-moon-cay": {
    status: "conditional",
    title: "Is Half Moon Cay a Tender Port? Ship-Specific Answer",
    description:
      "Half Moon Cay arrival now depends on the ship: Carnival can use the new pier, while Holland America still publishes tender guidance. Plan your return safely.",
    h1: "Is Half Moon Cay a Tender Port?",
    answerHeading: "It depends on your ship: some dock, some still tender.",
    answer:
      "Carnival says its new north-side pier is open and allows ships to dock. Holland America still publishes priority-tendering guidance for its visits on the south side. Check your ship's daily programme because the arrival method is sailing-specific.",
    dayImpact:
      "If your ship tenders, allow time for boat queues in both directions and follow the posted last-tender time. If it docks, you can walk ashore from the pier, but the official all-aboard time still controls.",
    verifiedAt: "September 4, 2026",
    sources: [
      {
        label: "Carnival: new Half Moon Cay pier is open",
        url: "https://www.carnival-news.com/2026/06/01/carnival-cruise-line-celebrates-expansion-of-relaxaway-half-moon-cay",
      },
      {
        label: "Holland America: current priority-tendering guidance",
        url: "https://www.hollandamerica.com/content/dam/hal/marketing-assets/PDFs/2026-2027-hal-caribbean-planner.pdf",
      },
    ],
  },
  falmouth: {
    status: "docked",
    title: "Is Falmouth, Jamaica a Tender Port? Dock & Walk Times",
    description:
      "Falmouth is normally a docked cruise port. See the short walk to town, ship-time warning, and what to confirm before leaving the pier.",
    h1: "Is Falmouth, Jamaica a Tender Port?",
    answerHeading: "Normally docked: ships use the Falmouth cruise terminal.",
    answer:
      "Current Royal Caribbean itineraries identify Falmouth as a docked call, and Jamaica's official tourism site describes guests stepping off at the cruise port. Verify your own itinerary because operational changes can still happen.",
    dayImpact:
      "The historic town center is about a five-minute walk from the terminal. For trips beyond Falmouth, leave a generous return buffer for road traffic and follow the ship's all-aboard time.",
    verifiedAt: "September 4, 2026",
    sources: [
      {
        label: "Royal Caribbean: Falmouth itinerary marked docked",
        url: "https://www.royalcaribbean.com/itinerary/7-night-western-caribbean-perfect-day-from-miami-on-independence-ID07W643?country=USA&groupId=ID07MIA-664227586&packageCode=ID07W643&sailDate=2026-11-08",
      },
      {
        label: "Jamaica Tourist Board: Port of Falmouth",
        url: "https://www.visitjamaica.com/cruises/ports/falmouth/",
      },
    ],
  },
  aruba: {
    status: "conditional",
    title: "Is Aruba a Tender Port? Dock, Pier & Walk Times",
    description:
      "Aruba is usually docked at an Oranjestad cruise berth. See the walk time, berth caveat, all-aboard warning, and what to do if arrival plans change.",
    h1: "Is Aruba a Tender Port?",
    answerHeading: "Usually docked: Aruba assigns cruise ships to terminal berths.",
    answer:
      "Aruba Ports Authority publishes cruise calls with assigned berths at the Port of Oranjestad. Those assignments are provisional, so treat Aruba as usually docked and confirm any changed arrival instructions with your ship.",
    dayImpact:
      "From the terminal, central Oranjestad is about a five-minute walk. If your ship announces a changed arrival arrangement, add transfer and queue time before planning the rest of the day.",
    verifiedAt: "September 4, 2026",
    sources: [
      {
        label: "Aruba Ports Authority: cruise schedules and provisional berths",
        url: "https://www.arubaports.com/main/cruiseship-schedules/",
      },
      {
        label: "Aruba Ports Authority: cruise terminal facilities",
        url: "https://www.arubaports.com/main/facilities-services/",
      },
    ],
  },
  curacao: {
    status: "docked",
    title: "Is Curaçao a Tender Port? Cruise Piers & Walk Times",
    description:
      "Curaçao is normally docked at a Willemstad cruise terminal. Compare the piers, walk time, ship-time warning, and port-day basics.",
    h1: "Is Curaçao a Tender Port?",
    answerHeading: "Normally docked: cruise ships use Willemstad's cruise terminals.",
    answer:
      "Curaçao Ports Authority lists the Mega Cruise Terminal and Mathey Wharf as its cruise facilities. Most visits therefore dock, but passengers should follow their sailing's final berth and arrival instructions.",
    dayImpact:
      "The colorful Willemstad waterfront is roughly a five-minute walk from the Mega Pier area. Keep the ship's time and all-aboard instruction separate from local clocks when you plan your return.",
    verifiedAt: "September 4, 2026",
    sources: [
      {
        label: "Curaçao Ports Authority: cruise terminals",
        url: "https://curports.com/cruise/cruise-terminals/",
      },
    ],
  },
  "celebration-key": {
    status: "docked",
    title: "Is Celebration Key a Tender Port? Pier & Walk Times",
    description:
      "Celebration Key is a docked destination with a purpose-built cruise pier. See the walk-in route, all-aboard warning, and port-day basics.",
    h1: "Is Celebration Key a Tender Port?",
    answerHeading: "Docked: ships arrive at Celebration Key's cruise pier.",
    answer:
      "Carnival's purpose-built pier carries guests directly into Celebration Key. The current destination map shows the central pier and entrance, and Carnival's pier plan supports its largest ships.",
    dayImpact:
      "You walk from the ship into Paradise Plaza rather than queue for a tender boat. Allow time for the long pier and follow the ship's stated all-aboard time on the return.",
    verifiedAt: "September 4, 2026",
    sources: [
      {
        label: "Carnival: Celebration Key pier and berths",
        url: "https://www.carnival-news.com/2024/02/22/carnival-corporation-announces-new-pier-extension-for-celebration-key-in-the-bahamas",
      },
      {
        label: "Carnival: current Celebration Key destination map",
        url: "https://www.carnival.com/-/media/Images/celebration-key/destination-guide/celebration-key-destination-guide.pdf",
      },
    ],
  },
};

export function getPortArrivalPilot(
  slug: string
): PortArrivalPilot | undefined {
  if (!TENDER_PORT_ANSWER_PILOT_ENABLED) return undefined;
  return PORT_ARRIVAL_PILOT[slug];
}

export function getPortArrivalPilotSlugs(): string[] {
  return TENDER_PORT_ANSWER_PILOT_ENABLED
    ? Object.keys(PORT_ARRIVAL_PILOT)
    : [];
}

export function getPortPlaceLabel(name: string, country: string): string {
  return name.localeCompare(country, undefined, { sensitivity: "base" }) === 0
    ? name
    : `${name}, ${country}`;
}
