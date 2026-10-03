/* ------------------------------------------------------------------ */
/*  Viator Destination ID Mapping                                      */
/*                                                                     */
/*  Maps CruiseKit port slugs → Viator destination IDs.               */
/*  Used by /api/viator/products to filter product searches.           */
/*  IDs are from Viator's /destinations taxonomy endpoint.             */
/*                                                                     */
/*  null = private island or no Viator presence (skip API call).       */
/*  Once the sandbox key activates, run:                               */
/*    node scripts/map-viator-destinations.js                          */
/*  to verify / update these IDs.                                      */
/* ------------------------------------------------------------------ */

export const VIATOR_DESTINATIONS: Record<string, number | null> = {
  // Western Caribbean
  "cozumel": 4383,
  "grand-cayman": 4242,
  "roatan": 22288,
  "key-west": 4279,
  "costa-maya": 22302,
  "progreso": 26037,
  "belize-city": 4172,
  "falmouth": 24095,
  "ocho-rios": 4423,
  "montego-bay": 4376,
  "harvest-caye": null,       // NCL private island
  "port-royal": 4292,         // Kingston area

  // Eastern Caribbean
  "nassau": 4197,
  "st-thomas": 4537,
  "st-maarten": 4524,
  "san-juan": 4470,
  "grand-turk": 28826,
  "bermuda": 4173,
  "puerto-plata": 4459,
  "tortola": 4551,
  "antigua": 4155,
  "st-lucia": 4526,
  "barbados": 4167,
  "amber-cove": 4459,         // Same as Puerto Plata region

  // Southern Caribbean
  "cartagena": 4184,
  "curacao": 4211,
  "aruba": 4157,
  "bonaire": 4174,
  "grenada": 4243,

  // Bahamas / Private Islands
  "cococay": null,             // Royal Caribbean private island
  "labadee": null,             // Royal Caribbean private island
  "great-stirrup-cay": null,   // NCL private island
  "celebration-key": null,     // Carnival private island
};

/**
 * Returns the Viator destination ID for a port slug, or null if
 * the port has no Viator destination (private island, etc.).
 */
export function getViatorDestinationId(slug: string): number | null {
  return VIATOR_DESTINATIONS[slug] ?? null;
}

/**
 * Returns true if this port has Viator products available.
 */
export function hasViatorProducts(slug: string): boolean {
  return VIATOR_DESTINATIONS[slug] != null;
}
