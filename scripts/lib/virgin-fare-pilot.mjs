import { validInstant } from "./fare-verification.mjs";

export const VIRGIN_ORIGIN = "https://www.virginvoyages.com";
export const VIRGIN_TERMS_URL = `${VIRGIN_ORIGIN}/terms-and-conditions`;
export const VIRGIN_PILOT_ID = "virgin-voyages-brilliant-lady-20261024-5nlah";

export function virginTermsRestriction(html) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  return /shall not harvest or otherwise collect any data.{0,500}(?:crawl|scrape|spider)/i.test(text)
    ? { status: "terms-collection-prohibited", section: "Part I, section 11 (Proprietary rights)", url: VIRGIN_TERMS_URL }
    : { status: "terms-review-inconclusive", section: null, url: VIRGIN_TERMS_URL };
}

function sourceDate(value, year) {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const match = String(value).trim().replace(/^[-–]\s*/, "").match(/^([A-Za-z]{3,9})\s+(\d{1,2})$/);
  const month = match && months.indexOf(match[1].slice(0, 3).toLowerCase());
  if (!match || month < 0 || !/^\d{4}$/.test(String(year))) return null;
  const date = `${year}-${String(month + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
  return validInstant(`${date}T00:00:00Z`) ? date : null;
}

/** Inspect the EXISTING discovery card shape. It is never a complete quote.
 * No card fallback, tax assumption, ship-prefix mapping or guest defaults.
 * Fixture captures are explicitly offline; this module performs no collection.
 */
export function inspectVirginDiscovery(cards, target) {
  if (target.cruiseLine !== "virgin-voyages") throw new Error("Virgin target required");
  const url = new URL(target.sourceUrl);
  if (url.origin !== VIRGIN_ORIGIN || url.username || url.password) throw new Error("Invalid Virgin source");
  const voyageId = url.searchParams.get("voyageId"), packageCode = url.searchParams.get("packageCode");
  if (!voyageId || !packageCode || !Array.isArray(cards)) throw new Error("Explicit voyage/package capture required");
  const matches = cards.flatMap(card => (card.sailings ?? []).filter(s => s.voyageId === voyageId && card.packageCode === packageCode).map(sailing => ({ card, sailing })));
  const missing = ["cabinCategory", "cabinType", "rateCode", "adults", "children", "cabins", "market", "returnedCurrency", "taxesAndFeesIncluded", "sourceContract"];
  const observed = { sourceSailingId: voyageId, packageCode, requestedCurrency: url.searchParams.get("currencyCode"), requestedPriceType: url.searchParams.get("priceType") };
  if (matches.length !== 1) return { status: "incomplete-discovery-not-quote", matches: matches.length, observed, missing: [...missing, matches.length ? "unambiguous-sailing" : "dated-sailing"], observations: [] };
  const { card, sailing } = matches[0];
  observed.shipName = card.shipName || null;
  observed.departureDate = sourceDate(sailing.start, sailing.year);
  observed.returnDate = sourceDate(sailing.end, sailing.year);
  observed.nights = Number.isInteger(card.nights) ? card.nights : null;
  observed.itineraryPorts = Array.isArray(card.ports) && card.ports.every(v => typeof v === "string" && v.trim()) ? card.ports : null;
  observed.priceBasisText = card.priceBasis || null;
  // Only the matched sailing price. A package card headline is never substituted.
  observed.sailingPriceText = sailing.price || null;
  const amount = String(sailing.price ?? "").match(/^\$?((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?)$/);
  observed.amount = amount ? Number(amount[1].replaceAll(",", "")) : null;
  for (const key of ["shipName", "departureDate", "returnDate", "nights", "itineraryPorts", "priceBasisText", "sailingPriceText", "amount"]) if (observed[key] == null) missing.push(key);
  for (const key of ["shipName", "departureDate", "returnDate", "nights", "itineraryPorts"]) if (observed[key] != null && JSON.stringify(observed[key]) !== JSON.stringify(target[key])) missing.push(`mismatched-${key}`);
  if (observed.departureDate && observed.returnDate && (Date.parse(observed.returnDate) - Date.parse(observed.departureDate)) / 86400000 !== observed.nights) missing.push("nights-date-mismatch");
  return { status: "incomplete-discovery-not-quote", matches: 1, observed, missing, observations: [] };
}
