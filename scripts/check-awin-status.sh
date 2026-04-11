#!/bin/bash
# Check Awin programme approval status for CruiseKit
# Usage: ./scripts/check-awin-status.sh

API_KEY="64938435-2778-41f7-a8d7-8e21d05adf2f"
PUB_ID="2850709"

echo "=== CruiseKit Awin Programme Status ==="
echo ""

for status in joined pending; do
  echo "--- ${status^^} ---"
  curl -s -H "Authorization: Bearer $API_KEY" \
    "https://api.awin.com/publishers/$PUB_ID/programmes?relationship=$status" | \
    python3 -c "
import sys, json
data = json.loads(sys.stdin.read())
targets = {
    57795: 'GoToSea (cruise booking)',
    11018: 'Viator US (excursions)',
    49127: 'Generali (travel insurance)',
    98699: 'Triptogo (cruise packages)',
    18925: 'GetYourGuide (excursions)',
    20001: 'Medjet (medical evac)',
    6776:  'Booking.com (hotels)',
    32679: 'SamBoat (boat rental)',
    96367: 'Undercover Tourist (theme parks)',
    54341: 'One Stop Parking',
}
if isinstance(data, list):
    for p in data:
        pid = p.get('id')
        if pid in targets:
            print(f'  ✓ {pid} — {targets[pid]}')
    if not any(p.get('id') in targets for p in data):
        print('  (none)')
else:
    print(f'  Error: {data}')
" 2>&1
  echo ""
done

echo "Run this script periodically to check for approvals."
echo "Once programmes move to JOINED, update apps/web/lib/affiliate-config.ts"
