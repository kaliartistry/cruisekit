/**
 * Shared port image mapping used by homepage deal cards and /cruises search.
 *
 * Image sources:
 * - Royal Caribbean CDN (real destination photos from their API)
 * - Celebrity Cruises CDN (real destination photos from their API)
 * - Carnival CDN (real port destination photos from their website)
 * - Disney CDN (real destination photos from their API)
 *
 * NOTE: Some images may not perfectly match the port. These are cruise line
 * marketing photos for the same destinations — better than stock but still
 * need manual verification by a human.
 */

const RCI_CDN = "https://www.royalcaribbean.com/content/dam/royal";
const CARNIVAL_CDN = "https://www.carnival.com/-/media/Images/explore/destinations/ports";
const CELEBRITY_CDN = "https://www.celebritycruises.com/celebrity/new-images";

export const PORT_IMAGES: Record<string, string> = {
  // --- RCI CDN ---
  "perfect day": `${RCI_CDN}/ports-and-destinations/destinations/perfect-day/arrivals-plaza-perfect-day-at-cococay-aerial-view.jpg`,
  "cococay": `${RCI_CDN}/ports-and-destinations/destinations/perfect-day/arrivals-plaza-perfect-day-at-cococay-aerial-view.jpg`,
  "labadee": `${RCI_CDN}/data/ports/labadee-haiti/labadee-haiti-zipline-coast.jpg`,
  "cozumel": `${RCI_CDN}/data/ports/cozumel-mexico/1920x1080.jpg`,
  "nassau": `${CELEBRITY_CDN}/itineraries/caribbean/aerial-view-nassau-bahamas-2560x1440.jpg`,
  "bahamas": `${CELEBRITY_CDN}/itineraries/caribbean/aerial-view-nassau-bahamas-2560x1440.jpg`,
  "grand turk": `${RCI_CDN}/ports-and-destinations/ports/grand-turk-turks-caicos/overview/grand-turk-island-coast.jpg`,
  "st. thomas": `${RCI_CDN}/data/ports/charlotte-amalie-st-thomas/charlotte-amalie-st-thomas-magens-bay.jpg`,
  "charlotte amalie": `${RCI_CDN}/data/ports/charlotte-amalie-st-thomas/charlotte-amalie-st-thomas-magens-bay.jpg`,
  "grand cayman": `${RCI_CDN}/data/ports/george-town-grand-cayman/george-town-grand-cayman-stingray-city.jpg`,
  "george town": `${RCI_CDN}/data/ports/george-town-grand-cayman/george-town-grand-cayman-stingray-city.jpg`,
  "falmouth": `${RCI_CDN}/data/ports/falmouth-jamaica/falmouth-jamaica-port-aerial-coast.jpg`,
  "key west": `${RCI_CDN}/data/ports/key/key-west-florida-southernmost-point.jpg`,
  "bermuda": `${RCI_CDN}/data/ports/kings-wharf-bermuda/kings-wharf-bermuda-horseshoe-bay-rock-formations.jpg`,
  "cartagena": `${RCI_CDN}/data/ports/cartagena-colombia/overview/cartagena-colombia-close-up-church-of-st-peter-claver.jpg`,
  "bimini": `${RCI_CDN}/data/ports/bimini/bimini-bahamas-island-shore-beach.jpg`,
  "belize": `${RCI_CDN}/data/ports/belize-city-belize/belize-crystal-caves-limestone.jpg`,
  "harvest caye": `${RCI_CDN}/data/ports/belize-city-belize/belize-crystal-caves-limestone.jpg`,
  "amber cove": `${RCI_CDN}/ports-and-destinations/ports/cabo-rojo-dominican-republic/overview/beach-playa-cabo-rojo-north-bahia-de-las-aguilas-around-pedernales-jaragua-national-park-dominican-republic.jpg`,

  // --- Carnival CDN ---
  // --- Wikimedia Commons (verified destination photos, CC licensed) ---
  "st. maarten": "https://upload.wikimedia.org/wikipedia/commons/8/87/Maho_Beach_Saint_Martin.jpg",
  "philipsburg": "https://upload.wikimedia.org/wikipedia/commons/8/87/Maho_Beach_Saint_Martin.jpg",
  "san juan": "https://upload.wikimedia.org/wikipedia/commons/7/71/Modern_Skyline_of_San_Juan,_Puerto_Rico.jpg",
  "aruba": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Divi_divi_tree_Eagle_Beach.jpg",
  "oranjestad": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Divi_divi_tree_Eagle_Beach.jpg",
  "curacao": "https://upload.wikimedia.org/wikipedia/commons/5/59/Facades_of_Handelskade,_Willemstad,_Cura%C3%A7ao_-_February_2020.jpg",
  "willemstad": "https://upload.wikimedia.org/wikipedia/commons/5/59/Facades_of_Handelskade,_Willemstad,_Cura%C3%A7ao_-_February_2020.jpg",
  "barbados": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Brandon's_Beach.jpg",
  "antigua": "https://upload.wikimedia.org/wikipedia/commons/a/af/St._John's_Antigua_Cruise_Port_1.jpg",
  "tortola": "https://upload.wikimedia.org/wikipedia/commons/b/b6/BVI-tortola-cane-garden-bay.jpg",
  "grenada": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Grand_Anse_Beach_Grenada.jpg",
  "roatan": "https://upload.wikimedia.org/wikipedia/commons/4/45/West_Bay_Beach_-Roatan_-Honduras-23May2009-g.jpg",
  "ocho rios": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Dunn's_River_Falls_%26_Park.jpg",
  "jamaica": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Dunn's_River_Falls_%26_Park.jpg",
  "montego bay": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Doctors-Cave-Beach.jpg",
  "costa maya": "https://upload.wikimedia.org/wikipedia/commons/7/76/Costa_maya_beach.jpg",
  "progreso": "https://upload.wikimedia.org/wikipedia/commons/3/33/Yucat%C3%A1n,_Progreso_de_Castro,_its_beach_and_the_pier.jpg",
  "puerto plata": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Puerto_Plata_Dominican_Republic_Town_Architecture.jpg",
  // Keep Carnival CDN for ports where Wikimedia wasn't sourced
  "bonaire": `${CARNIVAL_CDN}/carnival-caribbean-port-bonaire-1.jpg`,
  "kralendijk": `${CARNIVAL_CDN}/carnival-caribbean-port-bonaire-1.jpg`,
  "st. lucia": `${CARNIVAL_CDN}/carnival-caribbean-port-st-lucia-2.jpg`,
  "st. kitts": `${CARNIVAL_CDN}/carnival-caribbean-port-st-maarten-1.jpg`,

  // --- Celebrity CDN ---
  "half moon": `${CELEBRITY_CDN}/pdcc/drone-shot-hideaway-beach-perfect-day-at-cococay-bahamas-2560x1440.jpg`,

  // --- Carnival private destinations ---
  "celebration key": "https://upload.wikimedia.org/wikipedia/commons/5/54/Gold_Rock_Beach_Grand_Bahama_Island.jpg",

  // --- Cruise type fallbacks (use representative destination for that region) ---
  "western caribbean": `${RCI_CDN}/data/ports/cozumel-mexico/1920x1080.jpg`,
  "eastern caribbean": `${CARNIVAL_CDN}/carnival-caribbean-port-san-juan-1.jpg`,
  "southern caribbean": `${CARNIVAL_CDN}/carnival-caribbean-port-curacao-4.jpg`,
  "caribbean": `${CELEBRITY_CDN}/itineraries/caribbean/aerial-view-nassau-bahamas-2560x1440.jpg`,
};

export const DEFAULT_CRUISE_IMAGE = `${CELEBRITY_CDN}/itineraries/caribbean/aerial-view-nassau-bahamas-2560x1440.jpg`;

/** Get the best image for a deal, checking API images first, then port matching */
export function getDealImage(deal: {
  imageUrl: string | null;
  ports: string[];
  itineraryTitle: string;
  departurePort: string;
}): string {
  // 1. Use cruise line CDN image if available
  if (deal.imageUrl) return deal.imageUrl;

  // 2. Match by ports of call
  for (const port of deal.ports) {
    const portLower = port.toLowerCase();
    for (const [key, img] of Object.entries(PORT_IMAGES)) {
      if (portLower.includes(key)) return img;
    }
  }

  // 3. Match by itinerary title
  const titleLower = deal.itineraryTitle.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (titleLower.includes(key)) return img;
  }

  // 4. Match by departure port
  const depLower = deal.departurePort.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (depLower.includes(key)) return img;
  }

  return DEFAULT_CRUISE_IMAGE;
}
