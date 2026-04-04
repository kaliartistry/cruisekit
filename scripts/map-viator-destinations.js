/**
 * Maps CruiseKit port slugs to Viator destination IDs.
 * Uses the Viator Partner API /destinations endpoint (sandbox).
 */

const VIATOR_API_KEY = '78b1a715-977a-4433-ad11-3f0fd09dea58';
const BASE_URL = 'https://api.sandbox.viator.com/partner';

const PORTS = [
  { slug: 'cozumel', search: 'Cozumel' },
  { slug: 'grand-cayman', search: 'Grand Cayman' },
  { slug: 'roatan', search: 'Roatan' },
  { slug: 'key-west', search: 'Key West' },
  { slug: 'costa-maya', search: 'Costa Maya' },
  { slug: 'progreso', search: 'Progreso' },
  { slug: 'belize-city', search: 'Belize City' },
  { slug: 'falmouth', search: 'Falmouth' },
  { slug: 'ocho-rios', search: 'Ocho Rios' },
  { slug: 'montego-bay', search: 'Montego Bay' },
  { slug: 'harvest-caye', search: 'Harvest Caye' },
  { slug: 'port-royal', search: 'Port Royal' },
  { slug: 'nassau', search: 'Nassau' },
  { slug: 'st-thomas', search: 'St Thomas' },
  { slug: 'st-maarten', search: 'St Maarten' },
  { slug: 'san-juan', search: 'San Juan' },
  { slug: 'grand-turk', search: 'Grand Turk' },
  { slug: 'bermuda', search: 'Bermuda' },
  { slug: 'puerto-plata', search: 'Puerto Plata' },
  { slug: 'tortola', search: 'Tortola' },
  { slug: 'cartagena', search: 'Cartagena' },
  { slug: 'martinique', search: 'Martinique' },
  { slug: 'st-lucia', search: 'St Lucia' },
  { slug: 'dominica', search: 'Dominica' },
  { slug: 'barbados', search: 'Barbados' },
  { slug: 'aruba', search: 'Aruba' },
  { slug: 'curacao', search: 'Curacao' },
  { slug: 'bonaire', search: 'Bonaire' },
  { slug: 'cococay', search: 'CocoCay' },
  { slug: 'labadee', search: 'Labadee' },
  { slug: 'great-stirrup-cay', search: 'Great Stirrup Cay' },
  { slug: 'celebration-key', search: 'Celebration Key' },
];

async function fetchDestinations() {
  const res = await fetch(BASE_URL + '/destinations', {
    headers: {
      'exp-api-key': VIATOR_API_KEY,
      'Accept': 'application/json;version=2.0',
      'Accept-Language': 'en-US',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error('Destinations API error: ' + res.status + ' ' + body);
  }
  const data = await res.json();
  return data.destinations;
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function findBestMatch(destinations, searchTerm) {
  const lower = normalize(searchTerm);

  // Exact name match
  const exact = destinations.find(d => normalize(d.name) === lower);
  if (exact) return exact;

  // Contains match — prefer CITY, then ISLAND, then anything
  const partials = destinations.filter(d => {
    const dn = normalize(d.name);
    return dn.includes(lower) || lower.includes(dn);
  });

  if (partials.length === 0) return null;

  const city = partials.find(d => d.type === 'CITY');
  if (city) return city;

  const island = partials.find(d => d.type === 'ISLAND');
  if (island) return island;

  return partials[0];
}

async function main() {
  console.log('Fetching Viator destination taxonomy...');
  const destinations = await fetchDestinations();
  console.log('Got ' + destinations.length + ' destinations\n');

  const mapping = {};
  const unmatched = [];

  for (const port of PORTS) {
    const match = findBestMatch(destinations, port.search);
    if (match) {
      const id = match.destinationId || match.ref;
      mapping[port.slug] = { destinationId: id, name: match.name, type: match.type };
      console.log('OK  ' + port.slug + ' -> ' + match.name + ' (' + match.type + ', ID: ' + id + ')');
    } else {
      unmatched.push(port.slug);
      console.log('XX  ' + port.slug + ' -- no match for "' + port.search + '"');
    }
  }

  console.log('\n--- RESULTS ---');
  console.log('Matched: ' + Object.keys(mapping).length + '/' + PORTS.length);
  if (unmatched.length) console.log('Unmatched: ' + unmatched.join(', '));

  console.log('\n--- MAPPING JSON ---');
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch(console.error);
