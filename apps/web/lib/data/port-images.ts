/**
 * Port image mapping for deal cards and homepage.
 * Uses local destination images from the public asset bundle.
 */

export const PORT_IMAGES: Record<string, string> = {
  // Caribbean
  "cozumel": "/assets/ports/cozumel.jpg",
  "nassau": "/assets/ports/nassau.jpg",
  "bahamas": "/assets/ports/nassau.jpg",
  "grand cayman": "/assets/ports/grand-cayman.jpg",
  "george town": "/assets/ports/grand-cayman.jpg",
  "st. thomas": "/assets/ports/st-thomas.jpg",
  "charlotte amalie": "/assets/ports/st-thomas.jpg",
  "st. maarten": "/assets/ports/st-maarten.jpg",
  "philipsburg": "/assets/ports/st-maarten.jpg",
  "roatan": "/assets/ports/roatan.jpg",
  "aruba": "/assets/ports/aruba.jpg",
  "oranjestad": "/assets/ports/aruba.jpg",
  "san juan": "/assets/ports/san-juan.jpg",
  "curacao": "/assets/ports/curacao.jpg",
  "willemstad": "/assets/ports/curacao.jpg",
  "barbados": "/assets/ports/barbados.jpg",
  "antigua": "/assets/ports/antigua.jpg",
  "tortola": "/assets/ports/tortola.jpg",
  "grenada": "/assets/ports/grenada.jpg",
  "ocho rios": "/assets/ports/ocho-rios.jpg",
  "jamaica": "/assets/ports/ocho-rios.jpg",
  "montego bay": "/assets/ports/montego-bay.jpg",
  "costa maya": "/assets/ports/costa-maya.jpg",
  "progreso": "/assets/ports/progreso.jpg",
  "puerto plata": "/assets/ports/puerto-plata.jpg",
  "bonaire": "/assets/ports/bonaire.jpg",
  "kralendijk": "/assets/ports/bonaire.jpg",
  "st. lucia": "/assets/ports/st-lucia.jpg",
  "st. kitts": "/assets/ports/st-kitts.jpg",
  "st. croix": "/assets/ports/st-croix.jpg",
  "dominica": "/assets/ports/dominica.jpg",
  "martinique": "/assets/ports/martinique.jpg",
  "guadeloupe": "/assets/ports/guadeloupe.jpg",
  "st. vincent": "/assets/ports/st-vincent.jpg",
  "grand turk": "/assets/ports/grand-turk.jpg",
  "key west": "/assets/ports/key-west.jpg",
  "bermuda": "/assets/ports/bermuda.jpg",
  "belize": "/assets/ports/belize-city.jpg",
  "harvest caye": "/assets/ports/belize-city.jpg",
  "falmouth": "/assets/ports/falmouth.jpg",

  // Bahamas / Private Islands
  "cococay": "/assets/ports/cococay.jpg",
  "perfect day": "/assets/ports/cococay.jpg",
  "labadee": "/assets/ports/labadee.jpg",
  "bimini": "/assets/ports/bimini.jpg",
  "half moon": "/assets/ports/half-moon-cay.jpg",
  "celebration key": "/assets/ports/celebration-key.jpg",
  "ocean cay": "/assets/ports/ocean-cay.jpg",
  "princess cays": "/assets/ports/princess-cays.jpg",
  "great stirrup": "/assets/ports/great-stirrup-cay.jpg",
  "freeport": "/assets/ports/freeport.jpg",

  // Homeports
  "miami": "/assets/ports/miami.jpg",
  "fort lauderdale": "/assets/ports/fort-lauderdale.jpg",
  "port canaveral": "/assets/ports/port-canaveral.jpg",
  "galveston": "/assets/ports/galveston.jpg",
  "tampa": "/assets/ports/tampa.jpg",
  "new orleans": "/assets/ports/new-orleans.jpg",
  "baltimore": "/assets/ports/baltimore.jpg",
  "norfolk": "/assets/ports/norfolk.jpg",
  "manhattan": "/assets/ports/manhattan.jpg",
  "new york": "/assets/ports/manhattan.jpg",
  "seattle": "/assets/ports/seattle.jpg",
  "vancouver": "/assets/ports/vancouver.jpg",
  "mobile": "/assets/ports/mobile.jpg",

  // Alaska
  "juneau": "/assets/ports/juneau.jpg",
  "ketchikan": "/assets/ports/ketchikan.jpg",
  "skagway": "/assets/ports/skagway.jpg",
  "sitka": "/assets/ports/sitka.jpg",
  "icy strait": "/assets/ports/icy-strait-point.jpg",
  "victoria": "/assets/ports/victoria.jpg",

  // Europe
  "barcelona": "/assets/ports/barcelona.jpg",
  "rome": "/assets/ports/rome-civitavecchia.jpg",
  "civitavecchia": "/assets/ports/rome-civitavecchia.jpg",
  "valletta": "/assets/ports/valletta.jpg",
  "malta": "/assets/ports/valletta.jpg",
  "sicily": "/assets/ports/sicily-messina.jpg",
  "messina": "/assets/ports/sicily-messina.jpg",
  "olympia": "/assets/ports/olympia-katakolon.jpg",
  "katakolon": "/assets/ports/olympia-katakolon.jpg",
  "chania": "/assets/ports/chania-souda.jpg",
  "crete": "/assets/ports/chania-souda.jpg",
  "le havre": "/assets/ports/le-havre.jpg",
  "hamburg": "/assets/ports/hamburg.jpg",

  // Region fallbacks
  "western caribbean": "/assets/ports/cozumel.jpg",
  "eastern caribbean": "/assets/ports/st-thomas.jpg",
  "southern caribbean": "/assets/ports/curacao.jpg",
  "caribbean": "/assets/ports/nassau.jpg",
  "alaska": "/assets/ports/juneau.jpg",
  "mediterranean": "/assets/ports/barcelona.jpg",
  "europe": "/assets/ports/barcelona.jpg",
  "mexico": "/assets/ports/cozumel.jpg",
  "hawaii": "/assets/ports/miami.jpg",
};

export const DEFAULT_CRUISE_IMAGE = "/assets/ports/nassau.jpg";

/** Get the best image for a deal, checking ports then itinerary title */
export function getDealImage(deal: {
  imageUrl: string | null;
  ports: string[];
  itineraryTitle: string;
  departurePort: string;
}): string {
  if (deal.imageUrl) {
    if (deal.imageUrl.startsWith("assets/images/")) {
      return `/${deal.imageUrl.replace(/^assets\/images\//, "assets/")}`;
    }
    return deal.imageUrl;
  }

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
