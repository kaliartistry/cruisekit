#!/usr/bin/env python3
"""
Harvest ship photos from Google Places API (New).
Uses the EventSync service account for authentication.

Reads ships from CruiseKit-Mobile/assets/data/ships.json (126 ships)
and downloads hero photos to CruiseKit-Mobile/assets/images/ships/.

Usage: python3 scripts/harvest-ship-photos.py
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
SHIPS_JSON = Path(os.path.expanduser("~/CruiseKit-Mobile/assets/data/ships.json"))
OUTPUT_DIR = Path(os.path.expanduser("~/CruiseKit-Mobile/assets/images/ships"))
MAX_WIDTH = 640  # Thumbnails — keeps total under ~20MB


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


def download_photo(photo_name, token, max_width=MAX_WIDTH):
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


def load_ships():
    """Load ship list from ships.json and build query map."""
    with open(SHIPS_JSON) as f:
        ships = json.load(f)

    queries = {}
    for ship in ships:
        ship_id = ship["id"]
        ship_name = ship["name"]
        queries[ship_id] = f"{ship_name} cruise ship"

    return queries


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading ships from ships.json...")
    ship_queries = load_ships()
    total = len(ship_queries)
    print(f"Found {total} ships.\n")

    print("Authenticating with Google Cloud...")
    token = get_access_token()
    print("Authenticated.\n")

    results = {}
    downloaded = 0
    skipped = 0
    failed = 0

    for i, (ship_id, query) in enumerate(ship_queries.items(), 1):
        out_path = OUTPUT_DIR / f"{ship_id}.jpg"

        # Skip if already downloaded
        if out_path.exists() and out_path.stat().st_size > 10000:
            print(f"[{i}/{total}] {ship_id}: already exists, skipping")
            results[ship_id] = f"assets/images/ships/{ship_id}.jpg"
            skipped += 1
            continue

        print(f"[{i}/{total}] {ship_id}: searching '{query}'...", end=" ", flush=True)

        try:
            place = search_place(query, token)
            if not place or not place.get("photos"):
                print("no photos found")
                failed += 1
                continue

            photo_name = place["photos"][0]["name"]
            image_data = download_photo(photo_name, token)
            if not image_data:
                print("download failed")
                failed += 1
                continue

            with open(out_path, "wb") as f:
                f.write(image_data)

            size_kb = len(image_data) / 1024
            print(f"saved ({size_kb:.0f}KB) — {place.get('displayName', {}).get('text', '')}")
            results[ship_id] = f"assets/images/ships/{ship_id}.jpg"
            downloaded += 1

            # Rate limit: stay under 5 req/sec
            time.sleep(0.5)

        except Exception as e:
            print(f"error: {e}")
            failed += 1
            time.sleep(1)

    # Write manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nDone! {downloaded} downloaded, {skipped} skipped, {failed} failed")
    print(f"Total in manifest: {len(results)} ships")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
