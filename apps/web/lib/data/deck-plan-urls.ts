/**
 * Deck-plan URLs per cruise line. Link-out MVP — we point users to the
 * cruise line's official deck plan page rather than host our own.
 *
 * Rationale: deck plans are copyrighted, cruise lines update them per
 * refit, and the official pages are always authoritative. Hosting raw
 * copies creates a DMCA risk and a maintenance burden without giving
 * us an interactive advantage (which would require SVG + coordinate
 * data per ship — a 4-8 week project we haven't prioritized yet).
 *
 * Each entry points to the cruise line's ship/deck-plan hub. Users
 * pick their ship there. We'll deep-link per-ship when we have a
 * structured ship → slug mapping.
 */

export interface DeckPlanLink {
  cruiseLineId: string;
  label: string;
  url: string;
  /** Description of what the user will see when they click. */
  note: string;
}

export const DECK_PLAN_URLS: Record<string, DeckPlanLink> = {
  "royal-caribbean": {
    cruiseLineId: "royal-caribbean",
    label: "Royal Caribbean deck plans",
    url: "https://www.royalcaribbean.com/cruise-ships",
    note: "Pick your ship, then scroll to deck plans.",
  },
  carnival: {
    cruiseLineId: "carnival",
    label: "Carnival deck plans",
    url: "https://www.carnival.com/cruise-ships",
    note: "Pick your ship for interactive decks.",
  },
  norwegian: {
    cruiseLineId: "norwegian",
    label: "Norwegian deck plans",
    url: "https://www.ncl.com/cruise-ship",
    note: "Deck plans live under each ship.",
  },
  msc: {
    cruiseLineId: "msc",
    label: "MSC deck plans",
    url: "https://www.msccruisesusa.com/cruise-ships",
    note: "Pick your ship, then deck plans.",
  },
  celebrity: {
    cruiseLineId: "celebrity",
    label: "Celebrity deck plans",
    url: "https://www.celebritycruises.com/ships",
    note: "Deck plans under each ship page.",
  },
  princess: {
    cruiseLineId: "princess",
    label: "Princess deck plans",
    url: "https://www.princess.com/en-us/ships",
    note: "Browse ships, then deck plans.",
  },
  "holland-america": {
    cruiseLineId: "holland-america",
    label: "Holland America deck plans",
    url: "https://www.hollandamerica.com/en/us/cruise-ships",
    note: "Deck plans under each ship.",
  },
  disney: {
    cruiseLineId: "disney",
    label: "Disney Cruise Line deck plans",
    url: "https://disneycruise.disney.go.com/ships/",
    note: "Pick your ship, then deck plans tab.",
  },
  "virgin-voyages": {
    cruiseLineId: "virgin-voyages",
    label: "Virgin Voyages deck plans",
    url: "https://www.virginvoyages.com/ships",
    note: "Deck plans under each Lady Ship.",
  },
};

export function getDeckPlanLink(cruiseLineId: string): DeckPlanLink | null {
  return DECK_PLAN_URLS[cruiseLineId] ?? null;
}
