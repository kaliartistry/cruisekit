import { validInstant } from "./fare-verification.mjs";

const ORIGIN = "https://www.carnival.com";
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const text = value => typeof value === "string" && value.trim().length > 0;
const sourceId = value => text(value) ? value : Number.isSafeInteger(value) && value > 0 ? String(value) : null;
const amount = value => Number.isFinite(value) && value > 0 && Math.abs(value * 100 - Math.round(value * 100)) < 1e-7 ? value : null;
const pointer = value => value.replaceAll("~", "~0").replaceAll("/", "~1");
function nights(value) {
  const parsed = typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : value;
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function calendarDate(value) {
  // These are source calendar dates, not quote timestamps. Do not roll invalid
  // dates forward, apply the host timezone, or infer a date from another sailing.
  const match = typeof value === "string" && value.match(/^(\d{4}-\d{2}-\d{2})(?:T00:00:00(?:\.000)?Z?)?$/);
  return match && validInstant(`${match[1]}T00:00:00Z`) ? match[1] : null;
}

function sourceUrl(value) {
  if (!text(value)) return null;
  try {
    const url = new URL(value, ORIGIN);
    return url.origin === ORIGIN && !url.username && !url.password && !url.hash ? url.href : null;
  } catch { return null; }
}

/** Inspect an already supplied Carnival discovery response, never collect it.
 * Explicit sailing/room selection preserves amount/category/rate/currency ties.
 * Discovery cannot establish returned occupancy, tax/package semantics, itinerary
 * mapping, collection time/cache age or a reviewed source contract. This result
 * is a diagnostic object, NOT a normalized observation array or verified quote.
 */
export function inspectCarnivalDiscovery(page, target, { sailingId, roomKey } = {}) {
  if (target?.cruiseLine !== "carnival" || sourceUrl(target.sourceUrl) !== target.sourceUrl) throw new Error("Valid Carnival target required");
  if (!text(sailingId) || !text(roomKey)) throw new Error("Explicit source sailing ID and room key required");
  if (!Array.isArray(page?.results?.itineraries)) throw new Error("Carnival discovery response required");

  const matches = [];
  page.results.itineraries.forEach((itinerary, itineraryIndex) => {
    if (!Array.isArray(itinerary?.sailings)) return;
    itinerary.sailings.forEach((sailing, sailingIndex) => {
      if (sourceId(sailing?.sailingId) === sailingId) matches.push({ itinerary, sailing, path: `/results/itineraries/${itineraryIndex}/sailings/${sailingIndex}` });
    });
  });
  const missing = ["sourceContract", "collectionEvent", "observedAt", "responseAgeSeconds", "cabinType", "packageCode", "adults", "children", "cabins", "market", "priceBasis", "taxesAndFeesIncluded", "departurePort", "returnPort", "itineraryPorts"];
  const observed = { sourceSailingId: sailingId, selectedRoomKey: roomKey };
  const result = () => ({ status: "incomplete-discovery-not-quote", matches: matches.length, observed, missing: [...new Set(missing)], observations: [] });
  if (matches.length !== 1) {
    missing.push(matches.length ? "unambiguous-sailing" : "dated-sailing");
    return result();
  }

  const { itinerary, sailing, path } = matches[0];
  observed.sourcePath = path;
  observed.shipName = text(itinerary.shipName) ? itinerary.shipName : null;
  observed.departureDate = calendarDate(sailing.departureDate);
  observed.returnDate = calendarDate(sailing.arrivalDate);
  observed.nights = nights(itinerary.dur);
  observed.sourceUrl = sourceUrl(sailing.sailingURL);
  // Preserve only this sailing's schedule for later contract/mapping review.
  // The itinerary leadSailing schedule is never substituted or padded to match.
  observed.selectedSchedulePortNames = Array.isArray(sailing.schedule)
    ? sailing.schedule.map(stop => text(stop?.port) ? stop.port : null) : null;
  for (const key of ["shipName", "departureDate", "returnDate", "nights", "sourceUrl"]) {
    if (observed[key] === null) missing.push(key);
    else if (observed[key] !== target[key]) missing.push(`mismatched-${key}`);
  }
  if (observed.departureDate && observed.returnDate && observed.nights !== null && (Date.parse(observed.returnDate) - Date.parse(observed.departureDate)) / 86400000 !== observed.nights) missing.push("nights-date-mismatch");

  // Never select the minimum, mix currencies, coerce a soldOut flag, or fall
  // back to leadSailing.fromPrice. A room with unknown availability stays so.
  // "available" only describes the supplied soldOut:false flag, not bookability
  // today; an old capture never establishes current inventory.
  observed.rooms = object(sailing.rooms) ? Object.entries(sailing.rooms).map(([key, room]) => ({
    roomKey: key,
    sourcePath: `${path}/rooms/${pointer(key)}`,
    amount: amount(room?.price),
    currency: text(room?.priceCurrency) ? room.priceCurrency : null,
    categoryCode: text(room?.categoryCode) ? room.categoryCode : null,
    rateCode: text(room?.rateCode) ? room.rateCode : null,
    availability: room?.soldOut === true ? "sold-out" : room?.soldOut === false ? "available" : "unknown",
  })) : [];
  observed.selectedRoom = observed.rooms.find(room => room.roomKey === roomKey) ?? null;
  if (!observed.selectedRoom) {
    missing.push("selected-room");
    return result();
  }
  const room = observed.selectedRoom;
  for (const key of ["amount", "currency", "categoryCode", "rateCode"]) if (room[key] === null) missing.push(key);
  if (room.currency !== null && room.currency !== "USD") missing.push("unsupported-returned-currency");
  if (room.availability !== "available") missing.push(`availability-${room.availability}-not-cancellation`);
  return result();
}
