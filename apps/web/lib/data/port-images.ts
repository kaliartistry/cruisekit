/**
 * Port image mapping for deal cards and homepage.
 * Uses local images harvested from Google Places API.
 */

export const PORT_IMAGES: Record<string, string> = {
  // Caribbean
  "cozumel": "/images/ports/cozumel.jpg",
  "nassau": "/images/ports/nassau.jpg",
  "bahamas": "/images/ports/nassau.jpg",
  "grand cayman": "/images/ports/grand-cayman.jpg",
  "george town": "/images/ports/grand-cayman.jpg",
  "st. thomas": "/images/ports/st-thomas.jpg",
  "charlotte amalie": "/images/ports/st-thomas.jpg",
  "st. maarten": "/images/ports/st-maarten.jpg",
  "philipsburg": "/images/ports/st-maarten.jpg",
  "roatan": "/images/ports/roatan.jpg",
  "aruba": "/images/ports/aruba.jpg",
  "oranjestad": "/images/ports/aruba.jpg",
  "san juan": "/images/ports/san-juan.jpg",
  "curacao": "/images/ports/curacao.jpg",
  "willemstad": "/images/ports/curacao.jpg",
  "barbados": "/images/ports/barbados.jpg",
  "antigua": "/images/ports/antigua.jpg",
  "tortola": "/images/ports/tortola.jpg",
  "grenada": "/images/ports/grenada.jpg",
  "ocho rios": "/images/ports/ocho-rios.jpg",
  "jamaica": "/images/ports/ocho-rios.jpg",
  "montego bay": "/images/ports/montego-bay.jpg",
  "costa maya": "/images/ports/costa-maya.jpg",
  "progreso": "/images/ports/progreso.jpg",
  "puerto plata": "/images/ports/puerto-plata.jpg",
  "bonaire": "/images/ports/bonaire.jpg",
  "kralendijk": "/images/ports/bonaire.jpg",
  "st. lucia": "/images/ports/st-lucia.jpg",
  "st. kitts": "/images/ports/st-kitts.jpg",
  "st. croix": "/images/ports/st-croix.jpg",
  "dominica": "/images/ports/dominica.jpg",
  "martinique": "/images/ports/martinique.jpg",
  "guadeloupe": "/images/ports/guadeloupe.jpg",
  "st. vincent": "/images/ports/st-vincent.jpg",
  "grand turk": "/images/ports/grand-turk.jpg",
  "key west": "/images/ports/key-west.jpg",
  "bermuda": "/images/ports/bermuda.jpg",
  "belize": "/images/ports/belize-city.jpg",
  "harvest caye": "/images/ports/belize-city.jpg",
  "falmouth": "/images/ports/falmouth.jpg",

  // Bahamas / Private Islands
  "cococay": "/images/ports/cococay.jpg",
  "perfect day": "/images/ports/cococay.jpg",
  "labadee": "/images/ports/labadee.jpg",
  "bimini": "/images/ports/bimini.jpg",
  "half moon": "/images/ports/half-moon-cay.jpg",
  "celebration key": "/images/ports/celebration-key.jpg",
  "ocean cay": "/images/ports/ocean-cay.jpg",
  "princess cays": "/images/ports/princess-cays.jpg",
  "great stirrup": "/images/ports/great-stirrup-cay.jpg",
  "freeport": "/images/ports/freeport.jpg",

  // Homeports
  "miami": "/images/ports/miami.jpg",
  "fort lauderdale": "/images/ports/fort-lauderdale.jpg",
  "port canaveral": "/images/ports/port-canaveral.jpg",
  "galveston": "/images/ports/galveston.jpg",
  "tampa": "/images/ports/tampa.jpg",
  "new orleans": "/images/ports/new-orleans.jpg",
  "baltimore": "/images/ports/baltimore.jpg",
  "norfolk": "/images/ports/norfolk.jpg",
  "manhattan": "/images/ports/manhattan.jpg",
  "new york": "/images/ports/manhattan.jpg",
  "seattle": "/images/ports/seattle.jpg",
  "vancouver": "/images/ports/vancouver.jpg",
  "mobile": "/images/ports/mobile.jpg",

  // Alaska
  "juneau": "/images/ports/juneau.jpg",
  "ketchikan": "/images/ports/ketchikan.jpg",
  "skagway": "/images/ports/skagway.jpg",
  "sitka": "/images/ports/sitka.jpg",
  "icy strait": "/images/ports/icy-strait-point.jpg",
  "victoria": "/images/ports/victoria.jpg",

  // Europe
  "barcelona": "/images/ports/barcelona.jpg",
  "rome": "/images/ports/rome-civitavecchia.jpg",
  "civitavecchia": "/images/ports/rome-civitavecchia.jpg",
  "valletta": "/images/ports/valletta.jpg",
  "malta": "/images/ports/valletta.jpg",
  "sicily": "/images/ports/sicily-messina.jpg",
  "messina": "/images/ports/sicily-messina.jpg",
  "olympia": "/images/ports/olympia-katakolon.jpg",
  "katakolon": "/images/ports/olympia-katakolon.jpg",
  "chania": "/images/ports/chania-souda.jpg",
  "crete": "/images/ports/chania-souda.jpg",
  "le havre": "/images/ports/le-havre.jpg",
  "hamburg": "/images/ports/hamburg.jpg",

  // Region fallbacks
  "western caribbean": "/images/ports/cozumel.jpg",
  "eastern caribbean": "/images/ports/st-thomas.jpg",
  "southern caribbean": "/images/ports/curacao.jpg",
  "caribbean": "/images/ports/nassau.jpg",
  "alaska": "/images/ports/juneau.jpg",
  "mediterranean": "/images/ports/barcelona.jpg",
  "europe": "/images/ports/barcelona.jpg",
  "mexico": "/images/ports/cozumel.jpg",
  "hawaii": "/images/ports/miami.jpg",
};

export const DEFAULT_CRUISE_IMAGE = "/images/ports/nassau.jpg";

/** Get the best image for a deal, checking ports then itinerary title */
export function getDealImage(deal: {
  imageUrl: string | null;
  ports: string[];
  itineraryTitle: string;
  departurePort: string;
}): string {
  // 1. Match by ports of call (local images — always reliable)
  for (const port of deal.ports) {
    const portLower = port.toLowerCase();
    for (const [key, img] of Object.entries(PORT_IMAGES)) {
      if (portLower.includes(key)) return img;
    }
  }

  // 2. Match by itinerary title
  const titleLower = deal.itineraryTitle.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (titleLower.includes(key)) return img;
  }

  // 3. Match by departure port
  const depLower = deal.departurePort.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (depLower.includes(key)) return img;
  }

  return DEFAULT_CRUISE_IMAGE;
}
