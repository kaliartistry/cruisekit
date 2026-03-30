/**
 * Shared port image mapping used by homepage deal cards and /cruises search.
 *
 * Image sources (in priority order):
 * 1. Cruise line CDN images from RCI/Celebrity APIs (real destination photos)
 * 2. Unsplash photos searched by destination name (NOT verified by human eyes)
 *
 * NOTE: These images have NOT all been visually verified to show the actual
 * destination. Some may be generic or incorrect. If you spot a wrong image,
 * replace it with a verified URL.
 */

// Real destination images from Royal Caribbean's CDN (from their API responses)
const RCI_CDN = "https://www.royalcaribbean.com/content/dam/royal/ports-and-destinations";

export const PORT_IMAGES: Record<string, string> = {
  // --- Real cruise line CDN images (verified source) ---
  "perfect day": `${RCI_CDN}/destinations/perfect-day/arrivals-plaza-perfect-day-at-cococay-aerial-view.jpg`,
  "cococay": `${RCI_CDN}/destinations/perfect-day/arrivals-plaza-perfect-day-at-cococay-aerial-view.jpg`,
  "labadee": `${RCI_CDN}/ports/grp-labadee-haiti-702702702702702.jpg`,

  // --- Unsplash images (searched by destination, not all visually verified) ---
  // Mexico
  "cozumel": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "costa maya": "https://images.unsplash.com/photo-1719857664707-60ebe8852aa0?w=600&q=80",
  "progreso": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&q=80",
  // Bahamas
  "nassau": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  "bahamas": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  "bimini": "https://images.unsplash.com/photo-1706455986634-225f93284c0c?w=600&q=80",
  "grand turk": "https://images.unsplash.com/photo-1558923240-2672e219374b?w=600&q=80",
  "celebration key": "https://images.unsplash.com/photo-1603756009316-20fafbee4a3e?w=600&q=80",
  "half moon": "https://images.unsplash.com/photo-1728994532864-1410da4e2037?w=600&q=80",
  // Caribbean islands
  "st. thomas": "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=600&q=80",
  "charlotte amalie": "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=600&q=80",
  "st. maarten": "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=600&q=80",
  "philipsburg": "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=600&q=80",
  "san juan": "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=600&q=80",
  "aruba": "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=600&q=80",
  "oranjestad": "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=600&q=80",
  "curacao": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "willemstad": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "bonaire": "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=600&q=80",
  "kralendijk": "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=600&q=80",
  "barbados": "https://images.unsplash.com/photo-1712086353412-512d17c08403?w=600&q=80",
  "antigua": "https://images.unsplash.com/photo-1746208440749-b25fcc19e025?w=600&q=80",
  "st. lucia": "https://images.unsplash.com/photo-1745156705689-eef88991849d?w=600&q=80",
  "tortola": "https://images.unsplash.com/photo-1504659728239-b005b35c5d69?w=600&q=80",
  "st. kitts": "https://images.unsplash.com/photo-1706400486972-6b40488814af?w=600&q=80",
  "grenada": "https://images.unsplash.com/photo-1616464654572-43996d6b0133?w=600&q=80",
  // Central America
  "roatan": "https://images.unsplash.com/photo-1668813922137-e5dcda303af6?w=600&q=80",
  "belize": "https://images.unsplash.com/photo-1585540036061-a57122a5aa3f?w=600&q=80",
  "harvest caye": "https://images.unsplash.com/photo-1585540036061-a57122a5aa3f?w=600&q=80",
  // Jamaica
  "falmouth": "https://images.unsplash.com/photo-1614529168796-cb235d6a2557?w=600&q=80",
  "ocho rios": "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600&q=80",
  "jamaica": "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600&q=80",
  "montego bay": "https://images.unsplash.com/photo-1700807306801-929cd1b686fb?w=600&q=80",
  // Cayman
  "grand cayman": "https://images.unsplash.com/photo-1555744164-728dd59f9d8b?w=600&q=80",
  // Dominican Republic
  "amber cove": "https://images.unsplash.com/photo-1678816331175-a61a6835e889?w=600&q=80",
  "puerto plata": "https://images.unsplash.com/photo-1684805675906-e2c924d77fd1?w=600&q=80",
  // Other
  "bermuda": "https://images.unsplash.com/photo-1584558701762-387e5d31e441?w=600&q=80",
  "key west": "https://images.unsplash.com/photo-1617202830798-cf48261fb70d?w=600&q=80",
  "cartagena": "https://images.unsplash.com/photo-1536308037887-165852797016?w=600&q=80",
  // Cruise type fallbacks
  "western caribbean": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "eastern caribbean": "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=600&q=80",
  "southern caribbean": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "caribbean": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
};

export const DEFAULT_CRUISE_IMAGE = "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80";

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
