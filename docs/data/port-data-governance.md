# Port data governance

CruiseKit treats port identity, civil time, and editorial guidance as different
data classes. A port page can be published only when the catalog passes the
structural and time-zone checks below. Passing those checks does **not** mean
that its editorial claims have been source-reviewed.

## Cross-surface contract

`data/reference/port-timezones.json` is the language-neutral contract for the
website and mobile app. Each key is the shared port slug and each value is an
IANA Time Zone Database identifier. Web records derive a stable ID in the form
`cruisekit:port:<slug>`; mobile should use the same ID and generate its time-zone
lookup from this file rather than maintain a second hand-edited map.

Run `pnpm data:build:port-timezones` to create the flattened mobile-consumable
artifact at `data/bundles/mobile/port-timezones.json`. It includes current web
ports, distinct mobile-only ports, and resolved aliases in one deterministic
`portTimeZones` map. The web prebuild regenerates it automatically, and the
normal bundle publisher copies it to
`apps/web/public/data/bundles/mobile/port-timezones.json` for delivery.

The contract currently covers all 106 web ports, the known mobile-only guide
ports, and explicit aliases. Mobile tests separately assert that every bundled
guide slug resolves to an IANA identifier, while the generated artifact gives
both surfaces a deterministic input for future release automation.

The contract also distinguishes aliases from real ports. `piraeus-athens`
explicitly resolves to the canonical `piraeus` record. Known mobile-only ports
live under `externalTimeZones` until they receive full canonical web records.
For example, Cape Liberty has its own external assignment; it is **not** treated
as an alias for Manhattan. Publication validation rejects alias/concrete-record
collisions, unknown alias targets, and alias chains.

## Evidence and freshness

Every `PortData` record exposes:

- `canonicalId`: stable identity independent of the page URL;
- `ianaTimeZone`: exact civil time-zone rules, including daylight changes;
- `governance.reviewStatus`: catalog-level editorial review state;
- `governance.fieldProvenance`: source evidence by field path; and
- `governance.fieldFreshness`: verification date and re-review trigger.

The current catalog intentionally starts at `needs-review`. Only the
`ianaTimeZone` field has baseline provenance. A future editorial review may set
`reviewStatus` to `reviewed` only when it also supplies a review date and source
evidence. Volatile claims should use their own field-level freshness entry
rather than inherit a page-wide date.

Recommended review triggers:

| Data class | Review trigger | Stale behavior |
| --- | --- | --- |
| Port identity and coordinates | coordinate, terminal, or alias change | block conflicting records |
| IANA time zone | new IANA release or coordinate change | fail publication |
| Terminal and arrival guidance | quarterly or official change | mark needs review; link to official source |
| Emergency, visa, and day-of operations | official-source change | hide stale copied details; show official link |
| General editorial guidance | quarterly | show reviewed date or needs-review state |

## Publication gate

`pnpm --filter web test:ports` validates:

1. unique slugs and canonical IDs;
2. complete one-to-one time-zone coverage;
3. valid IANA identifiers;
4. valid latitude/longitude bounds; and
5. evidence requirements for any record marked `reviewed`.

The web `prebuild` script runs this gate before data bundles are generated or
published. A new port therefore requires a catalog record and a time-zone
contract entry in the same change. The gate should later be extended to schema
validation for terminal IDs, country codes, aliases, and field-specific source
expiry as those fields are populated.

## Time boundary

Website port time is port-local civil time. Phone time is the browser device
clock. Neither is ship time. CruiseKit must never infer or label either as ship
time; the cruise line's official clock and all-aboard instructions remain the
source of truth. Invalid time-zone data displays as unavailable rather than
falling back to the device clock.
