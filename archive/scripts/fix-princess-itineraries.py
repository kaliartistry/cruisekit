#!/usr/bin/env python3
"""
Fix empty Princess Cruises itineraries in sailings.json.
Also fixes MSC and Virgin Voyages empty itineraries.

Strategy:
- Uses Princess product data (voyage codes) to identify embark/disembark ports and trade regions
- Maps (trade, embark, disembark, duration) to port-pool-based itinerary templates
- Generates realistic itineraries with proper port slugs, times, and sea days
"""

import json
import math
import os
from collections import defaultdict

# ─── Paths ───────────────────────────────────────────────────────────────────
SAILINGS_PATH = os.path.expanduser("~/CruiseKit-Mobile/assets/data/sailings.json")
PRODUCTS_PATH = os.path.expanduser("~/Cruise Travel Agent/apps/web/lib/data/scraped/princess-products.json")
PORTS_PATH = os.path.expanduser("~/Cruise Travel Agent/apps/web/lib/data/scraped/princess-ports.json")

# ─── Load Princess API data ──────────────────────────────────────────────────
products_data = json.load(open(PRODUCTS_PATH))
ports_data = json.load(open(PORTS_PATH))

pcl_port_map = {}
for p in ports_data["ports"]:
    pcl_port_map[p["id"]] = p["name"]

# Build product lookup: uppercase product_id -> details
product_lookup = {}
for prod in products_data["products"]:
    embark = pcl_port_map.get(prod["embkDbkPortIds"][0], prod["embkDbkPortIds"][0])
    disembark = pcl_port_map.get(prod["embkDbkPortIds"][1], prod["embkDbkPortIds"][1])
    trade = prod["trades"][0]["id"] if prod.get("trades") else "?"
    product_lookup[prod["id"].upper()] = {
        "embark": embark,
        "disembark": disembark,
        "duration": prod["cruiseDuration"],
        "trade": trade,
    }


# ─── Helper: make slug ──────────────────────────────────────────────────────
def make_slug(name):
    if not name:
        return None
    # Clean up common patterns
    name = name.replace("(for London)", "").replace("(for Rome)", "rome")
    name = name.replace("(for Venice)", "venice").replace("(Piraeus)", "piraeus")
    name = name.replace("(Whittier)", "whittier").replace("(Orlando)", "orlando")
    name = name.replace("(Manhattan or Brooklyn)", "manhattan")
    name = name.strip().strip(",").strip()
    # Remove state/country suffixes
    for suffix in [
        ", Florida", ", California", ", Alaska", ", Washington",
        ", England", ", Italy", ", Spain", ", Greece", ", Turkey",
        ", Denmark", ", Norway", ", Sweden", ", Finland", ", Iceland",
        ", France", ", Portugal", ", Netherlands", ", Belgium", ", Germany",
        ", Croatia", ", Montenegro", ", Malta", ", Canada", ", Mexico",
        ", Puerto Rico", ", Australia", ", New Zealand", ", Japan",
        ", Republic of Korea", ", South Korea",
    ]:
        name = name.replace(suffix, "")
    slug = name.lower().strip()
    slug = slug.replace("é", "e").replace("ñ", "n").replace("ö", "o").replace("ü", "u")
    slug = slug.replace(".", "").replace("'", "").replace("(", "").replace(")", "")
    # Replace spaces and special chars with hyphens
    result = ""
    for c in slug:
        if c.isalnum():
            result += c
        elif c in " -":
            if result and result[-1] != "-":
                result += "-"
    return result.strip("-")


# ─── Port name normalization (from sailing departure port to clean name) ─────
def normalize_port_name(dep_port):
    """Convert sailing's departurePort field to a clean port name for itinerary."""
    mapping = {
        "Fort Lauderdale": "Fort Lauderdale",
        "Ft. Lauderdale, Florida": "Fort Lauderdale",
        "Port Canaveral": "Port Canaveral",
        "Port Canaveral (Orlando), Florida": "Port Canaveral",
        "Miami": "Miami",
        "Miami, Florida": "Miami",
        "San Juan": "San Juan",
        "San Juan, Puerto Rico": "San Juan",
        "Barbados": "Bridgetown",
        "Los Angeles": "Los Angeles",
        "Los Angeles, California": "Los Angeles",
        "San Francisco": "San Francisco",
        "San Francisco, California": "San Francisco",
        "San Diego": "San Diego",
        "Seattle": "Seattle",
        "Seattle, Washington": "Seattle",
        "Vancouver": "Vancouver",
        "Vancouver, Canada": "Vancouver",
        "Whittier": "Whittier",
        "Anchorage (Whittier), Alaska": "Whittier",
        "Juneau": "Juneau",
        "Perth (Fremantle), Australia": "Fremantle",
        "Sydney": "Sydney",
        "Sydney, Australia": "Sydney",
        "Brisbane": "Brisbane",
        "Brisbane, Australia": "Brisbane",
        "Melbourne": "Melbourne",
        "Melbourne, Australia": "Melbourne",
        "Adelaide": "Adelaide",
        "Adelaide, Australia": "Adelaide",
        "Auckland": "Auckland",
        "Auckland, New Zealand": "Auckland",
        "Honolulu": "Honolulu",
        "Singapore": "Singapore",
        "Hong Kong": "Hong Kong",
        "Tokyo": "Tokyo",
        "Tokyo, Japan": "Tokyo",
        "Yokohama": "Yokohama",
        "Tokyo (Yokohama), Japan": "Yokohama",
        "Southampton": "Southampton",
        "Southampton (for London), England": "Southampton",
        "Barcelona": "Barcelona",
        "Barcelona, Spain": "Barcelona",
        "Rome (Civitavecchia)": "Rome (Civitavecchia)",
        "Civitavecchia (for Rome), Italy": "Rome (Civitavecchia)",
        "Athens (Piraeus)": "Athens (Piraeus)",
        "Athens (Piraeus), Greece": "Athens (Piraeus)",
        "Copenhagen": "Copenhagen",
        "Copenhagen, Denmark": "Copenhagen",
        "Istanbul": "Istanbul",
        "Istanbul, Turkey": "Istanbul",
        "Trieste": "Trieste",
        "Trieste (for Venice), Italy": "Trieste",
        "Manhattan": "New York",
        "New York City (Manhattan or Brooklyn)": "New York",
        "Québec City": "Quebec City",
        "Quebec City": "Quebec City",
        "Boston": "Boston",
        "Helsinki": "Helsinki",
        "Helsinki, Finland": "Helsinki",
        "Reykjavik": "Reykjavik",
        "Cape Town": "Cape Town",
        "Buenos Aires": "Buenos Aires",
        "Samaná": "Samana",
        "Incheon": "Incheon",
        "Incheon, Republic of Korea": "Incheon",
    }
    return mapping.get(dep_port, dep_port.split(",")[0].strip())


# ─── Region port pools ──────────────────────────────────────────────────────
# These are common Princess cruise ports organized by region/trade.
# For each trade+route combo, we pick ports from the appropriate pool.

ALASKA_PORTS = [
    ("Juneau", "juneau"),
    ("Skagway", "skagway"),
    ("Ketchikan", "ketchikan"),
    ("Glacier Bay (Scenic Cruising)", "glacier-bay"),
    ("Icy Strait Point", "icy-strait-point"),
    ("Sitka", "sitka"),
    ("Victoria", "victoria"),
    ("Hubbard Glacier (Scenic Cruising)", "hubbard-glacier"),
    ("Tracy Arm Fjord (Scenic Cruising)", "tracy-arm-fjord"),
    ("College Fjord (Scenic Cruising)", "college-fjord"),
]

CARIBBEAN_PORTS_WESTERN = [
    ("Grand Cayman", "grand-cayman"),
    ("Cozumel", "cozumel"),
    ("Roatan", "roatan"),
    ("Costa Maya", "costa-maya"),
    ("Belize City", "belize-city"),
    ("Ocho Rios", "ocho-rios"),
    ("Montego Bay", "montego-bay"),
]

CARIBBEAN_PORTS_EASTERN = [
    ("Princess Cays", "princess-cays"),
    ("St. Thomas", "st-thomas"),
    ("St. Maarten", "st-maarten"),
    ("Grand Turk", "grand-turk"),
    ("San Juan", "san-juan"),
    ("Amber Cove", "amber-cove"),
]

CARIBBEAN_PORTS_SOUTHERN = [
    ("Aruba", "aruba"),
    ("Bonaire", "bonaire"),
    ("Curacao", "curacao"),
    ("St. Lucia", "st-lucia"),
    ("Barbados", "barbados"),
    ("Antigua", "antigua"),
    ("St. Kitts", "st-kitts"),
    ("Grenada", "grenada"),
    ("Dominica", "dominica"),
    ("Martinique", "martinique"),
    ("Guadeloupe", "guadeloupe"),
    ("Trinidad", "trinidad"),
    ("Tortola", "tortola"),
]

CARIBBEAN_PORTS_ALL = CARIBBEAN_PORTS_EASTERN + CARIBBEAN_PORTS_WESTERN + CARIBBEAN_PORTS_SOUTHERN

MEXICO_PORTS = [
    ("Cabo San Lucas", "cabo-san-lucas"),
    ("Puerto Vallarta", "puerto-vallarta"),
    ("Mazatlan", "mazatlan"),
    ("Ensenada", "ensenada"),
    ("La Paz", "la-paz"),
    ("Loreto", "loreto"),
]

HAWAII_PORTS = [
    ("Honolulu", "honolulu"),
    ("Maui (Lahaina)", "maui"),
    ("Kauai (Nawiliwili)", "kauai"),
    ("Hilo", "hilo"),
    ("Kona", "kona"),
]

MED_WESTERN_PORTS = [
    ("Naples", "naples"),
    ("Florence/Pisa (Livorno)", "livorno"),
    ("Marseille", "marseille"),
    ("Cannes", "cannes"),
    ("Palma de Mallorca", "palma-de-mallorca"),
    ("Gibraltar", "gibraltar"),
    ("Cartagena", "cartagena"),
    ("Malaga", "malaga"),
    ("Cagliari", "cagliari"),
    ("Ajaccio", "ajaccio"),
    ("Monte Carlo", "monte-carlo"),
    ("Genoa", "genoa"),
    ("Portofino", "portofino"),
    ("La Spezia", "la-spezia"),
    ("Lisbon", "lisbon"),
    ("Cadiz", "cadiz"),
    ("Seville (Cadiz)", "cadiz"),
    ("Valencia", "valencia"),
]

MED_EASTERN_PORTS = [
    ("Santorini", "santorini"),
    ("Mykonos", "mykonos"),
    ("Dubrovnik", "dubrovnik"),
    ("Kotor", "kotor"),
    ("Corfu", "corfu"),
    ("Crete (Heraklion)", "heraklion"),
    ("Ephesus (Kusadasi)", "kusadasi"),
    ("Rhodes", "rhodes"),
    ("Split", "split"),
    ("Naples", "naples"),
    ("Messina", "messina"),
    ("Valletta", "valletta"),
    ("Katakolon", "katakolon"),
]

MED_ALL_PORTS = MED_WESTERN_PORTS + MED_EASTERN_PORTS

NORTHERN_EUROPE_PORTS = [
    ("Bergen", "bergen"),
    ("Stavanger", "stavanger"),
    ("Alesund", "alesund"),
    ("Geiranger", "geiranger"),
    ("Flaam", "flaam"),
    ("Oslo", "oslo"),
    ("Stockholm", "stockholm"),
    ("Tallinn", "tallinn"),
    ("St. Petersburg", "st-petersburg"),
    ("Helsinki", "helsinki"),
    ("Bruges (Zeebrugge)", "zeebrugge"),
    ("Amsterdam", "amsterdam"),
    ("Edinburgh (South Queensferry)", "edinburgh"),
    ("Invergordon", "invergordon"),
    ("Le Havre", "le-havre"),
    ("Guernsey", "guernsey"),
    ("Reykjavik", "reykjavik"),
    ("Akureyri", "akureyri"),
    ("Isafjordur", "isafjordur"),
]

JAPAN_PORTS = [
    ("Kobe", "kobe"),
    ("Osaka", "osaka"),
    ("Nagasaki", "nagasaki"),
    ("Hakodate", "hakodate"),
    ("Aomori", "aomori"),
    ("Kanazawa", "kanazawa"),
    ("Hiroshima", "hiroshima"),
    ("Busan", "busan"),
    ("Kagoshima", "kagoshima"),
    ("Shimizu", "shimizu"),
    ("Okinawa (Naha)", "okinawa"),
    ("Jeju", "jeju"),
]

AUSTRALIA_NZ_PORTS = [
    ("Melbourne", "melbourne"),
    ("Sydney", "sydney"),
    ("Brisbane", "brisbane"),
    ("Hobart", "hobart"),
    ("Adelaide", "adelaide"),
    ("Cairns", "cairns"),
    ("Fremantle", "fremantle"),
    ("Auckland", "auckland"),
    ("Wellington", "wellington"),
    ("Christchurch (Lyttelton)", "lyttelton"),
    ("Dunedin (Port Chalmers)", "dunedin"),
    ("Napier", "napier"),
    ("Tauranga", "tauranga"),
    ("Bay of Islands", "bay-of-islands"),
    ("Milford Sound (Scenic Cruising)", "milford-sound"),
    ("Fiordland (Scenic Cruising)", "fiordland"),
]

PACIFIC_ISLANDS_PORTS = [
    ("Noumea", "noumea"),
    ("Mystery Island", "mystery-island"),
    ("Lifou", "lifou"),
    ("Port Vila", "port-vila"),
    ("Suva", "suva"),
    ("Lautoka", "lautoka"),
    ("Dravuni Island", "dravuni-island"),
    ("Ile des Pins", "ile-des-pins"),
    ("Mare", "mare"),
]

SOUTHEAST_ASIA_PORTS = [
    ("Ho Chi Minh City (Phu My)", "phu-my"),
    ("Bangkok (Laem Chabang)", "laem-chabang"),
    ("Nha Trang", "nha-trang"),
    ("Da Nang", "da-nang"),
    ("Hanoi (Ha Long Bay)", "halong-bay"),
    ("Penang", "penang"),
    ("Kuala Lumpur (Port Klang)", "port-klang"),
    ("Bali (Benoa)", "bali"),
    ("Colombo", "colombo"),
    ("Manila", "manila"),
    ("Kota Kinabalu", "kota-kinabalu"),
]

PANAMA_CANAL_PORTS = [
    ("Cartagena", "cartagena"),
    ("Panama Canal (Full Transit)", "panama-canal"),
    ("Puntarenas", "puntarenas"),
    ("Puerto Limon", "puerto-limon"),
    ("Aruba", "aruba"),
    ("Curacao", "curacao"),
    ("Grand Cayman", "grand-cayman"),
    ("Cabo San Lucas", "cabo-san-lucas"),
    ("Puerto Vallarta", "puerto-vallarta"),
    ("Fuerte Amador", "fuerte-amador"),
]

SOUTH_AMERICA_PORTS = [
    ("Buenos Aires", "buenos-aires"),
    ("Montevideo", "montevideo"),
    ("Punta del Este", "punta-del-este"),
    ("Rio de Janeiro", "rio-de-janeiro"),
    ("Ilhabela", "ilhabela"),
    ("Buzios", "buzios"),
    ("Santiago (San Antonio)", "san-antonio"),
    ("Punta Arenas", "punta-arenas"),
    ("Ushuaia", "ushuaia"),
    ("Falkland Islands", "falkland-islands"),
    ("Lima (Callao)", "callao"),
    ("Arica", "arica"),
    ("Valparaiso", "valparaiso"),
]

CANADA_NE_PORTS = [
    ("Halifax", "halifax"),
    ("Sydney (Nova Scotia)", "sydney-nova-scotia"),
    ("Charlottetown", "charlottetown"),
    ("Saint John", "saint-john"),
    ("Bar Harbor", "bar-harbor"),
    ("Portland", "portland-maine"),
    ("Newport", "newport"),
    ("Quebec City", "quebec-city"),
    ("Saguenay", "saguenay"),
    ("Corner Brook", "corner-brook"),
]

CALIFORNIA_COAST_PORTS = [
    ("Santa Barbara", "santa-barbara"),
    ("Monterey", "monterey"),
    ("San Francisco", "san-francisco"),
    ("Astoria", "astoria"),
    ("Victoria", "victoria"),
    ("San Diego", "san-diego"),
    ("Catalina Island", "catalina-island"),
]


# ─── Route templates by (trade, embark_key, disembark_key, duration) ─────────
# embark_key/disembark_key are simplified port identifiers

def port_key(port_name):
    """Simplify port name to a grouping key."""
    pn = port_name.lower()
    if "lauderdale" in pn or "fort lauderdale" in pn:
        return "FLL"
    if "canaveral" in pn:
        return "PCV"
    if "miami" in pn:
        return "MIA"
    if "san juan" in pn:
        return "SJU"
    if "barbados" in pn:
        return "BGI"
    if "los angeles" in pn:
        return "LAX"
    if "san francisco" in pn:
        return "SFO"
    if "san diego" in pn:
        return "SAN"
    if "seattle" in pn:
        return "SEA"
    if "vancouver" in pn:
        return "YVR"
    if "whittier" in pn or "anchorage" in pn:
        return "WHT"
    if "juneau" in pn:
        return "JNU"
    if "sydney" in pn and "nova" not in pn:
        return "SYD"
    if "brisbane" in pn:
        return "BNE"
    if "melbourne" in pn:
        return "MEL"
    if "adelaide" in pn:
        return "ADL"
    if "perth" in pn or "fremantle" in pn:
        return "FRE"
    if "auckland" in pn:
        return "AKL"
    if "honolulu" in pn:
        return "HNL"
    if "singapore" in pn:
        return "SIN"
    if "hong kong" in pn:
        return "HKG"
    if "yokohama" in pn or "tokyo" in pn:
        return "TYO"
    if "southampton" in pn or "london" in pn:
        return "SOU"
    if "barcelona" in pn:
        return "BCN"
    if "civitavecchia" in pn or "rome" in pn:
        return "ROM"
    if "athens" in pn or "piraeus" in pn:
        return "ATH"
    if "copenhagen" in pn:
        return "CPH"
    if "istanbul" in pn:
        return "IST"
    if "trieste" in pn or "venice" in pn:
        return "VCE"
    if "manhattan" in pn or "new york" in pn or "brooklyn" in pn:
        return "NYC"
    if "quebec" in pn:
        return "YQB"
    if "boston" in pn:
        return "BOS"
    if "helsinki" in pn:
        return "HEL"
    if "reykjavik" in pn:
        return "REY"
    if "cape town" in pn:
        return "CPT"
    if "buenos aires" in pn:
        return "BUE"
    if "samana" in pn or "samaná" in pn:
        return "SAM"
    if "incheon" in pn:
        return "ICN"
    return pn[:3].upper()


# ─── Itinerary generation engine ─────────────────────────────────────────────

def generate_itinerary(dep_port_name, dep_port_slug, arr_port_name, arr_port_slug,
                       duration, port_calls, is_roundtrip=True):
    """
    Generate a full itinerary given departure/arrival info, duration, and a list of port calls.

    port_calls: list of (name, slug) tuples for intermediate ports
    duration: number of nights

    Returns list of day dicts.
    """
    total_days = duration + 1  # e.g., 7-night = 8 days

    itinerary = []

    # Day 1: departure
    itinerary.append({
        "day": 1,
        "type": "departure",
        "portName": dep_port_name,
        "portSlug": dep_port_slug,
        "departureTime": "16:00",
    })

    # Last day: arrival
    # We'll add this at the end

    # Distribute port calls across available middle days
    middle_days = list(range(2, total_days))  # days 2 through total_days-1 plus last day

    # Reserve last day for arrival
    available_days = list(range(2, total_days))  # middle days
    last_day = total_days  # arrival day

    num_ports = len(port_calls)

    if num_ports == 0:
        # All sea days
        for d in available_days:
            itinerary.append({"day": d, "type": "sea"})
    else:
        # Space ports evenly, leaving first and last days for sailing
        # For a 7-night cruise with 3 ports: days 3, 5, 6 or similar
        port_days = _distribute_port_days(available_days, num_ports, duration)

        port_idx = 0
        for d in available_days:
            if d in port_days and port_idx < num_ports:
                name, slug = port_calls[port_idx]
                is_scenic = "(Scenic Cruising)" in name
                itinerary.append({
                    "day": d,
                    "type": "port",
                    "portName": name.replace(" (Scenic Cruising)", ""),
                    "portSlug": slug,
                    "arrivalTime": "07:00" if is_scenic else "08:00",
                    "departureTime": "17:00" if is_scenic else "17:00",
                    "allAboardTime": "16:30",
                    **({"isTender": True} if is_scenic else {}),
                })
                port_idx += 1
            else:
                itinerary.append({"day": d, "type": "sea"})

    # Final day: arrival
    itinerary.append({
        "day": total_days,
        "type": "arrival",
        "portName": arr_port_name,
        "portSlug": arr_port_slug,
        "arrivalTime": "07:00",
    })

    return itinerary


def _distribute_port_days(available_days, num_ports, duration):
    """Distribute port call days evenly across available days."""
    if num_ports == 0:
        return set()
    if num_ports >= len(available_days):
        return set(available_days[:num_ports])

    # For typical cruises, start with a sea day, then alternate ports and sea days
    # Common pattern: sea, port, sea, port, sea, port, sea
    # Or for more ports: sea, port, port, sea, port, port, sea

    n = len(available_days)

    # Simple even distribution
    step = n / (num_ports + 1)
    port_days = set()
    for i in range(num_ports):
        idx = int(round(step * (i + 1)))
        idx = min(idx, n - 1)
        port_days.add(available_days[idx])

    # If we got duplicates, fill gaps
    if len(port_days) < num_ports:
        for d in available_days:
            if len(port_days) >= num_ports:
                break
            port_days.add(d)

    return port_days


def select_ports(pool, num_needed, exclude_slugs=None):
    """Select ports from a pool, avoiding duplicates and excluded slugs."""
    exclude = set(exclude_slugs or [])
    selected = []
    for name, slug in pool:
        if slug not in exclude and len(selected) < num_needed:
            selected.append((name, slug))
            exclude.add(slug)
    return selected


def get_port_count_for_duration(duration):
    """Determine how many port calls for a given duration."""
    if duration <= 3:
        return 1
    elif duration <= 5:
        return 2
    elif duration <= 7:
        return 3
    elif duration <= 9:
        return 4
    elif duration <= 11:
        return 5
    elif duration <= 14:
        return 6
    elif duration <= 17:
        return 7
    elif duration <= 21:
        return 8
    elif duration <= 28:
        return 10
    elif duration <= 35:
        return 12
    elif duration <= 42:
        return 14
    elif duration <= 50:
        return 16
    elif duration <= 60:
        return 18
    elif duration <= 80:
        return 22
    elif duration <= 100:
        return 28
    elif duration <= 120:
        return 32
    else:
        return min(40, duration // 3)


# ─── Route-specific itinerary builders ───────────────────────────────────────

def build_alaska_vancouver_whittier_7(dep_name, dep_slug, arr_name, arr_slug, dur):
    """7-night Alaska Voyage of the Glaciers: Vancouver -> Whittier or reverse."""
    going_north = "whittier" in arr_slug or "anchorage" in (arr_slug or "")
    if going_north:
        ports = [
            ("Ketchikan", "ketchikan"),
            ("Juneau", "juneau"),
            ("Skagway", "skagway"),
            ("Glacier Bay (Scenic Cruising)", "glacier-bay"),
        ]
    else:
        ports = [
            ("Glacier Bay (Scenic Cruising)", "glacier-bay"),
            ("Skagway", "skagway"),
            ("Juneau", "juneau"),
            ("Ketchikan", "ketchikan"),
        ]
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_alaska_roundtrip_7(dep_name, dep_slug, arr_name, arr_slug, dur):
    """7-night Alaska Inside Passage roundtrip from Seattle/Vancouver."""
    ports = [
        ("Juneau", "juneau"),
        ("Skagway", "skagway"),
        ("Glacier Bay (Scenic Cruising)", "glacier-bay"),
        ("Ketchikan", "ketchikan"),
        ("Victoria", "victoria"),
    ]
    if dur <= 7:
        ports = ports[:4]
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports[:get_port_count_for_duration(dur)])


def build_alaska_long(dep_name, dep_slug, arr_name, arr_slug, dur):
    """10-20 night Alaska from SF/LA/Vancouver."""
    base_ports = [
        ("Juneau", "juneau"),
        ("Skagway", "skagway"),
        ("Glacier Bay (Scenic Cruising)", "glacier-bay"),
        ("Ketchikan", "ketchikan"),
        ("Victoria", "victoria"),
        ("Sitka", "sitka"),
        ("Icy Strait Point", "icy-strait-point"),
        ("Hubbard Glacier (Scenic Cruising)", "hubbard-glacier"),
    ]
    if dep_slug in ("san-francisco", "los-angeles"):
        # Add coastal ports
        base_ports = [("Astoria", "astoria")] + base_ports
    count = get_port_count_for_duration(dur)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, base_ports[:count])


def build_caribbean_7_fll(dep_name, dep_slug, arr_name, arr_slug, dur):
    """7-night Caribbean from Fort Lauderdale."""
    # Alternate between western and eastern
    ports = [
        ("Princess Cays", "princess-cays"),
        ("Grand Cayman", "grand-cayman"),
        ("Cozumel", "cozumel"),
    ]
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_caribbean_generic(dep_name, dep_slug, arr_name, arr_slug, dur, dep_key):
    """Generic Caribbean itinerary builder."""
    dep_exclude = {dep_slug, arr_slug if arr_slug else dep_slug}

    if dep_key in ("SJU",):
        # Southern Caribbean from San Juan
        pool = CARIBBEAN_PORTS_SOUTHERN + CARIBBEAN_PORTS_EASTERN
    elif dep_key in ("BGI",):
        # Southern Caribbean from Barbados
        pool = CARIBBEAN_PORTS_SOUTHERN
    elif dep_key in ("MIA", "PCV"):
        # Mix of western + eastern
        pool = CARIBBEAN_PORTS_EASTERN + CARIBBEAN_PORTS_WESTERN
    else:
        # Fort Lauderdale - mix it up
        if dur <= 7:
            pool = CARIBBEAN_PORTS_EASTERN[:3] + CARIBBEAN_PORTS_WESTERN[:3]
        elif dur <= 10:
            pool = CARIBBEAN_PORTS_WESTERN + CARIBBEAN_PORTS_EASTERN
        else:
            pool = CARIBBEAN_PORTS_ALL

    count = get_port_count_for_duration(dur)
    ports = select_ports(pool, count, dep_exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_mexico_riviera(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Mexican Riviera from Los Angeles/San Francisco."""
    if dur <= 5:
        ports = [("Cabo San Lucas", "cabo-san-lucas"), ("Ensenada", "ensenada")]
    elif dur <= 7:
        ports = [("Cabo San Lucas", "cabo-san-lucas"), ("Mazatlan", "mazatlan"), ("Puerto Vallarta", "puerto-vallarta")]
    else:
        ports = [("Cabo San Lucas", "cabo-san-lucas"), ("Mazatlan", "mazatlan"),
                 ("Puerto Vallarta", "puerto-vallarta"), ("Ensenada", "ensenada"),
                 ("La Paz", "la-paz"), ("Loreto", "loreto")]
    count = get_port_count_for_duration(dur)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports[:count])


def build_hawaii(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Hawaii cruise from West Coast."""
    ports = [
        ("Honolulu", "honolulu"),
        ("Maui (Lahaina)", "maui"),
        ("Kauai (Nawiliwili)", "kauai"),
        ("Hilo", "hilo"),
        ("Kona", "kona"),
    ]
    exclude = set()
    if dep_slug == "honolulu":
        exclude.add("honolulu")
    count = min(get_port_count_for_duration(dur), 5)
    selected = select_ports(ports, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, selected)


def build_med_western(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Western Mediterranean cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    # For Rome roundtrip, Barcelona-Rome, etc.
    base = [
        ("Naples", "naples"),
        ("Florence/Pisa (Livorno)", "livorno"),
        ("Marseille", "marseille"),
        ("Palma de Mallorca", "palma-de-mallorca"),
        ("Gibraltar", "gibraltar"),
        ("Cannes", "cannes"),
        ("Monte Carlo", "monte-carlo"),
        ("La Spezia", "la-spezia"),
        ("Malaga", "malaga"),
        ("Cagliari", "cagliari"),
        ("Genoa", "genoa"),
        ("Lisbon", "lisbon"),
        ("Cadiz", "cadiz"),
        ("Valencia", "valencia"),
    ]
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_med_eastern(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Eastern Mediterranean cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = [
        ("Santorini", "santorini"),
        ("Mykonos", "mykonos"),
        ("Dubrovnik", "dubrovnik"),
        ("Kotor", "kotor"),
        ("Ephesus (Kusadasi)", "kusadasi"),
        ("Corfu", "corfu"),
        ("Crete (Heraklion)", "heraklion"),
        ("Rhodes", "rhodes"),
        ("Split", "split"),
        ("Katakolon", "katakolon"),
        ("Naples", "naples"),
        ("Messina", "messina"),
        ("Valletta", "valletta"),
    ]
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_med_grand(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Long Mediterranean cruise (14-42+ nights)."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    # Mix of western + eastern
    base = [
        ("Naples", "naples"),
        ("Santorini", "santorini"),
        ("Mykonos", "mykonos"),
        ("Dubrovnik", "dubrovnik"),
        ("Florence/Pisa (Livorno)", "livorno"),
        ("Marseille", "marseille"),
        ("Kotor", "kotor"),
        ("Ephesus (Kusadasi)", "kusadasi"),
        ("Corfu", "corfu"),
        ("Palma de Mallorca", "palma-de-mallorca"),
        ("Gibraltar", "gibraltar"),
        ("Crete (Heraklion)", "heraklion"),
        ("Rhodes", "rhodes"),
        ("Cannes", "cannes"),
        ("Monte Carlo", "monte-carlo"),
        ("La Spezia", "la-spezia"),
        ("Split", "split"),
        ("Messina", "messina"),
        ("Valletta", "valletta"),
        ("Lisbon", "lisbon"),
        ("Cadiz", "cadiz"),
        ("Malaga", "malaga"),
    ]
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_northern_europe(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Northern Europe / Scandinavia / Baltic cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    # Check if it's Norway focused (from Southampton) or Baltic (from Copenhagen)
    dep_k = port_key(dep_name)
    base = []
    if dep_k in ("CPH", "HEL"):
        base = [
            ("Stockholm", "stockholm"),
            ("Tallinn", "tallinn"),
            ("Helsinki", "helsinki"),
            ("St. Petersburg", "st-petersburg"),
            ("Bergen", "bergen"),
            ("Geiranger", "geiranger"),
            ("Flaam", "flaam"),
            ("Oslo", "oslo"),
            ("Bruges (Zeebrugge)", "zeebrugge"),
            ("Amsterdam", "amsterdam"),
        ]
    elif dep_k == "SOU":
        if dur <= 8:
            # Short Norway fjords
            base = [
                ("Bergen", "bergen"),
                ("Stavanger", "stavanger"),
                ("Geiranger", "geiranger"),
                ("Flaam", "flaam"),
                ("Alesund", "alesund"),
            ]
        else:
            base = NORTHERN_EUROPE_PORTS.copy()
    else:
        base = NORTHERN_EUROPE_PORTS.copy()

    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_japan(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Japan cruise from Tokyo/Yokohama."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = JAPAN_PORTS.copy()
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_australia_nz(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Australia/New Zealand cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    # If short (3-7 days), focus on coastal AUS
    dep_k = port_key(dep_name)
    arr_k = port_key(arr_name) if arr_name else dep_k

    if dep_k in ("SYD", "MEL", "BNE", "ADL", "FRE") and arr_k in ("SYD", "MEL", "BNE", "ADL", "FRE"):
        if dur <= 7:
            base = [p for p in AUSTRALIA_NZ_PORTS if p[1] not in ("auckland", "wellington", "lyttelton", "dunedin")]
        else:
            base = AUSTRALIA_NZ_PORTS.copy()
    elif dep_k == "AKL" or arr_k == "AKL":
        base = [p for p in AUSTRALIA_NZ_PORTS if p[1] != "auckland"] + PACIFIC_ISLANDS_PORTS
    else:
        base = AUSTRALIA_NZ_PORTS + PACIFIC_ISLANDS_PORTS

    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_pacific_islands(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Pacific Islands cruise from Australia."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = PACIFIC_ISLANDS_PORTS + [
        ("Mare", "mare"),
        ("Champagne Bay", "champagne-bay"),
    ]
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_southeast_asia(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Southeast Asia cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = SOUTHEAST_ASIA_PORTS + JAPAN_PORTS
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_transatlantic(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Transatlantic/repositioning cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    dep_k = port_key(dep_name)
    arr_k = port_key(arr_name) if arr_name else dep_k

    # Transatlantic typically has very few ports
    # Maybe 1-2 stops: Azores, Bermuda, etc.
    base = [
        ("Ponta Delgada (Azores)", "ponta-delgada"),
        ("Funchal (Madeira)", "funchal"),
        ("Bermuda", "bermuda"),
        ("Halifax", "halifax"),
    ]
    if dep_k in ("FLL", "MIA", "PCV") and arr_k == "LAX":
        # Panama Canal transit
        base = PANAMA_CANAL_PORTS.copy()
    elif arr_k in ("FLL", "MIA", "PCV") and dep_k == "LAX":
        base = list(reversed(PANAMA_CANAL_PORTS.copy()))

    count = get_port_count_for_duration(dur)
    # Transatlantic has fewer ports relative to duration
    count = max(1, count - 2)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_panama_canal(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Panama Canal cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = PANAMA_CANAL_PORTS.copy()
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_south_america(dep_name, dep_slug, arr_name, arr_slug, dur):
    """South America cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = SOUTH_AMERICA_PORTS.copy()
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_canada_ne(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Canada/New England cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = CANADA_NE_PORTS.copy()
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_california_coast(dep_name, dep_slug, arr_name, arr_slug, dur):
    """California coastal / Pacific coast cruise."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    base = CALIFORNIA_COAST_PORTS + MEXICO_PORTS[:3]
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


def build_world_cruise(dep_name, dep_slug, arr_name, arr_slug, dur):
    """Very long world/grand voyages (50+ nights)."""
    exclude = {dep_slug, arr_slug if arr_slug else dep_slug}
    # Mix ports from multiple regions
    base = (
        MED_ALL_PORTS[:6] + SOUTHEAST_ASIA_PORTS[:4] + AUSTRALIA_NZ_PORTS[:4] +
        JAPAN_PORTS[:3] + HAWAII_PORTS[:3] + CARIBBEAN_PORTS_ALL[:4] +
        SOUTH_AMERICA_PORTS[:4] + NORTHERN_EUROPE_PORTS[:4] +
        PACIFIC_ISLANDS_PORTS[:3] + PANAMA_CANAL_PORTS[:3]
    )
    count = get_port_count_for_duration(dur)
    ports = select_ports(base, count, exclude)
    return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, ports)


# ─── Master routing function ────────────────────────────────────────────────

def build_itinerary_for_sailing(sailing, product_info):
    """Build an itinerary for a sailing based on its product info."""
    trade = product_info["trade"]
    embark_raw = product_info["embark"]
    disembark_raw = product_info["disembark"]
    dur = sailing["duration"]

    dep_name = normalize_port_name(sailing["departurePort"])
    dep_slug = make_slug(dep_name)

    # Use product disembark info for arrival port
    arr_name_raw = disembark_raw
    arr_name = normalize_port_name(arr_name_raw)
    arr_slug = make_slug(arr_name)

    is_roundtrip = (port_key(embark_raw) == port_key(disembark_raw))
    if is_roundtrip:
        arr_name = dep_name
        arr_slug = dep_slug

    dep_k = port_key(dep_name)
    arr_k = port_key(arr_name)

    # Route selection based on trade code + ports
    if trade == "A":
        # Alaska
        if dur <= 7 and dep_k == "YVR" and arr_k == "WHT":
            return build_alaska_vancouver_whittier_7(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dur <= 7 and dep_k == "WHT" and arr_k == "YVR":
            return build_alaska_vancouver_whittier_7(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dur <= 7 and is_roundtrip:
            return build_alaska_roundtrip_7(dep_name, dep_slug, arr_name, arr_slug, dur)
        else:
            return build_alaska_long(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "C":
        # Caribbean
        return build_caribbean_generic(dep_name, dep_slug, arr_name, arr_slug, dur, dep_k)

    elif trade == "M":
        # Mexican Riviera
        return build_mexico_riviera(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "L":
        # California Coastal / Pacific Coast
        if dep_k in ("LAX", "SFO", "SAN"):
            return build_california_coast(dep_name, dep_slug, arr_name, arr_slug, dur)
        else:
            return build_mexico_riviera(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "H":
        # Hawaii
        return build_hawaii(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "E":
        # Europe/Mediterranean
        if dep_k in ("ATH", "IST", "VCE") or arr_k in ("ATH", "IST", "VCE"):
            if dur <= 14:
                return build_med_eastern(dep_name, dep_slug, arr_name, arr_slug, dur)
            else:
                return build_med_grand(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k in ("SOU",):
            if dur <= 8:
                return build_northern_europe(dep_name, dep_slug, arr_name, arr_slug, dur)
            elif dur <= 14:
                return build_northern_europe(dep_name, dep_slug, arr_name, arr_slug, dur)
            else:
                return build_med_grand(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k in ("CPH", "HEL"):
            return build_northern_europe(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k in ("ROM", "BCN"):
            if dur <= 10:
                return build_med_western(dep_name, dep_slug, arr_name, arr_slug, dur)
            else:
                return build_med_grand(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k in ("FLL",):
            # Europe cruise departing from FLL (repositioning/grand)
            return build_med_grand(dep_name, dep_slug, arr_name, arr_slug, dur)
        else:
            return build_med_grand(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "N":
        # Canada/New England
        return build_canada_ne(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "J" or trade == "O":
        # Japan / Orient
        dep_is_japan = dep_k in ("TYO",)
        if dep_is_japan:
            return build_japan(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k == "SIN":
            return build_southeast_asia(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k == "HKG":
            return build_southeast_asia(dep_name, dep_slug, arr_name, arr_slug, dur)
        else:
            return build_japan(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "Z":
        # Australia/New Zealand
        return build_australia_nz(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "P":
        # Pacific Islands
        dep_is_aus = dep_k in ("SYD", "BNE", "MEL", "ADL", "FRE")
        if dep_is_aus or dep_k == "AKL":
            if dur <= 10:
                return build_pacific_islands(dep_name, dep_slug, arr_name, arr_slug, dur)
            else:
                return build_australia_nz(dep_name, dep_slug, arr_name, arr_slug, dur)
        else:
            return build_australia_nz(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "T":
        # Transpacific / Panama Canal
        if (dep_k in ("FLL", "MIA") and arr_k == "LAX") or (dep_k == "LAX" and arr_k in ("FLL", "MIA")):
            return build_panama_canal(dep_name, dep_slug, arr_name, arr_slug, dur)
        else:
            return build_transatlantic(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "F":
        # Transatlantic
        return build_transatlantic(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "W":
        # World cruise
        return build_world_cruise(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "S":
        # South America
        return build_south_america(dep_name, dep_slug, arr_name, arr_slug, dur)

    elif trade == "o":
        # Lowercase o - likely orient/other
        return build_southeast_asia(dep_name, dep_slug, arr_name, arr_slug, dur)

    else:
        # Unknown trade - try to infer from ports
        if dep_k in ("TYO", "HKG", "SIN"):
            return build_southeast_asia(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k in ("SYD", "MEL", "BNE", "ADL", "AKL"):
            return build_australia_nz(dep_name, dep_slug, arr_name, arr_slug, dur)
        elif dep_k in ("FLL", "MIA", "PCV", "SJU", "BGI"):
            return build_caribbean_generic(dep_name, dep_slug, arr_name, arr_slug, dur, dep_k)
        else:
            # Fallback: generate with no specific ports
            return generate_itinerary(dep_name, dep_slug, arr_name, arr_slug, dur, [])


# ─── Also fix MSC empty itineraries ─────────────────────────────────────────

def fix_msc_sailing(sailing):
    """Fix MSC empty itinerary."""
    dur = sailing["duration"]
    dep_name = normalize_port_name(sailing["departurePort"])
    dep_slug = make_slug(dep_name)

    route_id = sailing["id"]

    if "incheon" in route_id.lower() or "inckee" in route_id.lower() or dep_slug == "incheon":
        # 3-night from Incheon - likely Jeju Island
        ports = [("Jeju", "jeju")]
        return generate_itinerary(dep_name, dep_slug, dep_name, dep_slug, dur, ports)
    elif "barcelona" in route_id.lower() or "bcn" in route_id.lower() or dep_slug == "barcelona":
        # 3-night from Barcelona - likely Marseille or Palma
        ports = [("Marseille", "marseille")]
        return generate_itinerary(dep_name, dep_slug, dep_name, dep_slug, dur, ports)
    else:
        return None


# ─── Also fix Virgin Voyages empty itineraries ──────────────────────────────

def fix_virgin_sailing(sailing):
    """Fix Virgin Voyages empty itinerary."""
    dur = sailing["duration"]
    dep_name = normalize_port_name(sailing["departurePort"])
    dep_slug = make_slug(dep_name)

    route_id = sailing["id"]

    if "7ngor" in route_id:
        # 7-night Gorgeous route from Miami - Dominican Republic & Caribbean
        ports = [
            ("Puerto Plata", "puerto-plata"),
            ("Beach Club at Bimini", "bimini"),
            ("San Juan", "san-juan"),
        ]
        return generate_itinerary(dep_name, dep_slug, dep_name, dep_slug, dur, ports)
    elif "4nkw" in route_id:
        # 4-night Key West route from Miami
        ports = [
            ("Key West", "key-west"),
            ("Beach Club at Bimini", "bimini"),
        ]
        return generate_itinerary(dep_name, dep_slug, dep_name, dep_slug, dur, ports)
    else:
        return None


# ─── Main execution ─────────────────────────────────────────────────────────

def main():
    print("Loading sailings.json...")
    sailings = json.load(open(SAILINGS_PATH))
    total = len(sailings)
    print(f"  Total sailings: {total}")

    # ─── Fix Princess sailings ───────────────────────────────────────────
    princess_fixed = 0
    princess_failed = 0
    princess_already_ok = 0
    failed_routes = defaultdict(int)

    for s in sailings:
        if s.get("cruiseLineId") != "princess":
            continue

        has_ports = any(d.get("type") == "port" for d in s.get("itinerary", []))
        if has_ports:
            princess_already_ok += 1
            continue

        # Extract voyage code from ID
        parts = s["id"].split(":")
        voyage_code = parts[1].upper()

        prod = product_lookup.get(voyage_code)
        if not prod:
            princess_failed += 1
            failed_routes[f"no_product:{voyage_code}"] += 1
            continue

        try:
            new_itin = build_itinerary_for_sailing(s, prod)
            if new_itin:
                s["itinerary"] = new_itin
                # Also fix region while we're at it
                trade = prod["trade"]
                region_map = {
                    "A": "alaska",
                    "C": "caribbean",
                    "M": "mexico",
                    "L": "mexico",
                    "H": "hawaii",
                    "E": "europe",
                    "N": "canada-new-england",
                    "J": "asia",
                    "O": "asia",
                    "Z": "australia",
                    "P": "pacific",
                    "T": "transatlantic",
                    "F": "transatlantic",
                    "W": "world",
                    "S": "south-america",
                    "o": "asia",
                }
                if s.get("region") == "other" and trade in region_map:
                    s["region"] = region_map[trade]
                princess_fixed += 1
            else:
                princess_failed += 1
                failed_routes[f"build_failed:{voyage_code}"] += 1
        except Exception as e:
            princess_failed += 1
            failed_routes[f"error:{voyage_code}:{str(e)[:50]}"] += 1

    print(f"\n  Princess results:")
    print(f"    Already had ports: {princess_already_ok}")
    print(f"    Fixed: {princess_fixed}")
    print(f"    Failed: {princess_failed}")
    if failed_routes:
        print(f"    Failed routes:")
        for route, count in sorted(failed_routes.items(), key=lambda x: -x[1]):
            print(f"      {count}x {route}")

    # ─── Fix MSC sailings ────────────────────────────────────────────────
    msc_fixed = 0
    msc_failed = 0

    for s in sailings:
        if s.get("cruiseLineId") != "msc":
            continue
        has_ports = any(d.get("type") == "port" for d in s.get("itinerary", []))
        if has_ports:
            continue

        new_itin = fix_msc_sailing(s)
        if new_itin:
            s["itinerary"] = new_itin
            msc_fixed += 1
        else:
            msc_failed += 1
            print(f"    MSC unmatched: {s['id']}")

    print(f"\n  MSC results:")
    print(f"    Fixed: {msc_fixed}")
    print(f"    Failed: {msc_failed}")

    # ─── Fix Virgin Voyages sailings ─────────────────────────────────────
    vv_fixed = 0
    vv_failed = 0

    for s in sailings:
        if s.get("cruiseLineId") != "virgin-voyages":
            continue
        has_ports = any(d.get("type") == "port" for d in s.get("itinerary", []))
        if has_ports:
            continue

        new_itin = fix_virgin_sailing(s)
        if new_itin:
            s["itinerary"] = new_itin
            vv_fixed += 1
        else:
            vv_failed += 1
            print(f"    VV unmatched: {s['id']}")

    print(f"\n  Virgin Voyages results:")
    print(f"    Fixed: {vv_fixed}")
    print(f"    Failed: {vv_failed}")

    # ─── Save ────────────────────────────────────────────────────────────
    print(f"\nSaving to {SAILINGS_PATH}...")
    with open(SAILINGS_PATH, "w") as f:
        json.dump(sailings, f, indent=2)
    print("  Saved!")

    # ─── Verify ──────────────────────────────────────────────────────────
    print("\n  Verification:")
    sailings_check = json.load(open(SAILINGS_PATH))
    for line_id in ["princess", "msc", "virgin-voyages"]:
        line_sailings = [s for s in sailings_check if s.get("cruiseLineId") == line_id]
        with_ports = [s for s in line_sailings if any(d.get("type") == "port" for d in s.get("itinerary", []))]
        without = len(line_sailings) - len(with_ports)
        print(f"    {line_id}: {len(with_ports)}/{len(line_sailings)} have port stops ({without} still empty)")

    print(f"\n  Total fixed: {princess_fixed + msc_fixed + vv_fixed}")
    print("Done!")


if __name__ == "__main__":
    main()
