#!/usr/bin/env python3
"""
Harvest port photos from Google Places API (New).
Uses the EventSync service account for authentication.

Usage: python3 scripts/harvest-port-photos.py
"""

import json
import os
import time
import base64
import urllib.request
import urllib.parse
from pathlib import Path
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# Config
SA_KEY_PATH = os.path.expanduser("~/Desktop/EventSync/Keys/eventsync-de8c0-f24ac5f11474.json")
OUTPUT_DIR = Path(__file__).parent.parent / "apps" / "web" / "public" / "images" / "ports"
PORTS_TS = Path(__file__).parent.parent / "apps" / "web" / "lib" / "data" / "ports.ts"

# Search queries for each port — tuned for scenic/iconic photos
PORT_QUERIES = {
    "nassau": "Nassau Bahamas cruise port downtown",
    "st-maarten": "Maho Beach St Maarten planes",
    "roatan": "Roatan Honduras West Bay Beach",
    "aruba": "Aruba Eagle Beach",
    "san-juan": "Old San Juan Puerto Rico colorful streets",
    "costa-maya": "Costa Maya Mexico cruise port",
    "progreso": "Progreso Yucatan Mexico beach pier",
    "ocho-rios": "Ocho Rios Jamaica Dunns River Falls",
    "curacao": "Willemstad Curacao Handelskade colorful",
    "puerto-plata": "Puerto Plata Dominican Republic",
    "montego-bay": "Montego Bay Jamaica beach",
    "tortola": "Tortola BVI Cane Garden Bay",
    "barbados": "Barbados beach coast",
    "grenada": "Grand Anse Beach Grenada",
    "antigua": "Antigua cruise port St Johns",
    "st-lucia": "St Lucia Pitons aerial",
    "bonaire": "Bonaire Kralendijk waterfront",
    "great-stirrup-cay": "Great Stirrup Cay Bahamas beach",
    "celebration-key": "Grand Bahama beach turquoise water",
    "port-royal": "Port Royal Jamaica waterfront",
    "miami": "Miami skyline Biscayne Bay cruise port",
    "fort-lauderdale": "Fort Lauderdale Florida beach skyline",
    "port-canaveral": "Port Canaveral Florida cruise ships",
    "galveston": "Galveston Texas seawall beach",
    "tampa": "Tampa Florida skyline waterfront",
    "new-orleans": "New Orleans French Quarter Jackson Square",
    "baltimore": "Baltimore Inner Harbor waterfront",
    "norfolk": "Norfolk Virginia waterfront skyline",
    "manhattan": "Manhattan New York City skyline cruise",
    "seattle": "Seattle skyline Space Needle waterfront",
    "vancouver": "Vancouver Canada Place cruise terminal mountains",
    "mobile": "Mobile Alabama downtown waterfront",
    "juneau": "Juneau Alaska Mendenhall Glacier cruise",
    "ketchikan": "Ketchikan Alaska Creek Street",
    "skagway": "Skagway Alaska Broadway Street",
    "sitka": "Sitka Alaska waterfront Mount Edgecumbe",
    "icy-strait-point": "Icy Strait Point Alaska Hoonah",
    "victoria": "Victoria BC Inner Harbour Empress Hotel",
    "bimini": "Bimini Bahamas beach turquoise",
    "half-moon-cay": "Half Moon Cay Bahamas white sand beach",
    "ocean-cay": "Ocean Cay MSC Marine Reserve Bahamas",
    "princess-cays": "Eleuthera Bahamas beach turquoise water",
    "dominica": "Dominica Roseau waterfront mountains",
    "freeport": "Freeport Grand Bahama Port Lucaya",
    "martinique": "Fort-de-France Martinique waterfront",
    "guadeloupe": "Pointe-a-Pitre Guadeloupe harbor",
    "st-kitts": "Basseterre St Kitts cruise port",
    "st-croix": "Frederiksted St Croix USVI beach",
    "la-romana": "Altos de Chavon La Romana Dominican Republic",
    "samana": "Samana Dominican Republic bay",
    "st-vincent": "Kingstown St Vincent waterfront",
    "barcelona": "Barcelona Spain waterfront Sagrada Familia",
    "rome-civitavecchia": "Rome Colosseum Italy",
    "valletta": "Valletta Malta Grand Harbour",
    "sicily-messina": "Messina Sicily Italy waterfront Etna",
    "olympia-katakolon": "Katakolon Greece harbor waterfront",
    "chania-souda": "Chania Crete Venetian Harbour lighthouse",
    "le-havre": "Le Havre France beach waterfront",
    "hamburg": "Hamburg Germany Elbphilharmonie harbour",
}


def get_access_token():
    """Get OAuth2 access token from service account."""
    with open(SA_KEY_PATH) as f:
        sa = json.load(f)

    header = base64.urlsafe_b64encode(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()).rstrip(b"=")
    now = int(time.time())
    claims = {
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/cloud-platform",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600,
    }
    payload = base64.urlsafe_b64encode(json.dumps(claims).encode()).rstrip(b"=")

    private_key = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
    message = header + b"." + payload
    signature = private_key.sign(message, padding.PKCS1v15(), hashes.SHA256())
    sig_b64 = base64.urlsafe_b64encode(signature).rstrip(b"=")
    jwt_token = (header + b"." + payload + b"." + sig_b64).decode()

    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt_token,
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())["access_token"]


def search_place(query, token):
    """Search for a place and return the first result with photos."""
    req = urllib.request.Request(
        "https://places.googleapis.com/v1/places:searchText",
        data=json.dumps({"textQuery": query, "maxResultCount": 3}).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "X-Goog-FieldMask": "places.displayName,places.photos,places.id",
        },
    )
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    places = result.get("places", [])

    # Pick the place with the most photos
    best = None
    best_count = 0
    for place in places:
        count = len(place.get("photos", []))
        if count > best_count:
            best = place
            best_count = count

    return best


def download_photo(photo_name, token, max_width=1280):
    """Download a photo by its resource name."""
    url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx={max_width}&skipHttpRedirect=true"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    photo_url = data.get("photoUri")
    if not photo_url:
        return None

    # Download the actual image
    req2 = urllib.request.Request(photo_url)
    resp2 = urllib.request.urlopen(req2)
    return resp2.read()


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Authenticating with Google Cloud...")
    token = get_access_token()
    print("Authenticated.\n")

    results = {}
    total = len(PORT_QUERIES)

    for i, (slug, query) in enumerate(PORT_QUERIES.items(), 1):
        out_path = OUTPUT_DIR / f"{slug}.jpg"

        # Skip if already downloaded
        if out_path.exists() and out_path.stat().st_size > 10000:
            print(f"[{i}/{total}] {slug}: already exists, skipping")
            results[slug] = str(out_path.relative_to(Path(__file__).parent.parent))
            continue

        print(f"[{i}/{total}] {slug}: searching '{query}'...", end=" ", flush=True)

        try:
            place = search_place(query, token)
            if not place or not place.get("photos"):
                print("no photos found")
                continue

            photo_name = place["photos"][0]["name"]
            image_data = download_photo(photo_name, token)
            if not image_data:
                print("download failed")
                continue

            with open(out_path, "wb") as f:
                f.write(image_data)

            size_kb = len(image_data) / 1024
            print(f"saved ({size_kb:.0f}KB) — {place.get('displayName', {}).get('text', '')}")
            results[slug] = f"/images/ports/{slug}.jpg"

            # Rate limit: stay under 5 req/sec
            time.sleep(0.5)

        except Exception as e:
            print(f"error: {e}")
            time.sleep(1)

    # Write manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nDone! {len(results)} photos saved to {OUTPUT_DIR}")
    print(f"Manifest: {manifest_path}")
    print("\nNext step: Update ports.ts imageUrl fields to use /images/ports/{slug}.jpg")


if __name__ == "__main__":
    main()
