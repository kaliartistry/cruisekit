# Weekly fare verification candidate

Status: local candidate; publication disabled. Live remains
`c0e6390c31ed808ac50929aa2bc401bf2e45878d`. No public fare has been updated,
new schedule enabled, or staged change approved. This foundation does not
implement or activate an approved live quote adapter or unattended publication.

## Why scheduled jobs left fares stale

Monday 11:34 UTC ingest stages discovery data and reports only; it never updates
approved seed. The separate Monday/Wednesday/Friday publish-candidate job produces
a report, not a commit/deploy. Its schedule condition makes it skip a Monday
ingest invocation; it is not an ingest-to-publish dependency. Pages rebuilds
approved seed at 12:16 UTC daily/on main pushes. Rebuilding cannot observe prices.

Authorized artifact 11343353124 from run 37304778690 / job 111745718915 has SHA-256
`5d55ccd23a0678a2b4d467518b1cc18e586426e9dc9c61276d8c4bce219f07f6`.
Its October 5 11:48:09 UTC report confirms 362 public fares were 40–96 days old
against seven-day policy: NCL 184, Carnival 136, Virgin 27, Holland 15.
Ingest succeeded; freshness failed. The artifact also contains older reports;
old latest filenames are not evidence for this run.

Discovery importers conflate retrieval with lastVerified, hardcode some unit/tax
fields, and use some cheapest-cabin/itinerary fallbacks. Review matches mainly
ship/date rather than the quote tuple. NCL samples Caribbean itineraries and its
promotion skips existing IDs. The 30 NCL/23 Carnival material changes are review
candidates, not live quotes. Missing sampled listings do not prove cancellation.

## Actual price provenance

The additive seed fare ledger is separate from canonical/native models.
lastVerified remains legacy record history; import/promotion/report/build/deploy
timestamps never become fare-check dates. The ledger starts empty because existing
prices lack an independently confirmed complete context. No migration certifies them.

An owner-reviewed initial context includes provider, ship, sailing ID, departure/
return dates, exact nights/ordered itinerary/ports, cabin category, rate/package,
market, adults/children/cabins, currency/unit, required tax inclusion and source URL.
This candidate accepts US/USD, one cabin and adult-only explicit occupancy;
other cases require review. Actual observedAt must be in the current run and newer
than the prior successful check. Local raw evidence must match its SHA-256.
Source timestamp and HTTP cache age are distinct; stale/unknown evidence is
rejected. Cents are preserved without guessing or rounding missing amounts.

Only complete unchanged contexts with changes below 15% yield eligible candidates.
Changes >=15%, first quotes, new/unmatched/ambiguous IDs and changed contexts need
owner review. Sold-out/missing/changed itineraries or blocked sources retain the
fare and prior successful check; none means cancellation. No apply mode exists.

The site consumes a sanitized additive provenance bundle. Confirmed observations
show Price checked on, age and seven-day Recheck due. Legacy fares show Price check
date unverified and the original Record reviewed date. Only actual recent checks
can earn price badges or prefill current estimates. Provider price/availability
confirmation remains required before booking; weekly snapshots are not guarantees.
Native payloads/models are unchanged; native integration remains separately held.

## Source blockers and controlled evidence

On October 5, [NCL robots](https://www.ncl.com/robots.txt) disallows
/vacation-builder/, including its date-specific endpoint. At 23:59:48 UTC, the
single controlled dry run read rules hash
`777750a8716f4abb81030822c65170043ac080ff5b67784655442805fd7f229c` and stopped.
One anonymous request, zero fare requests, zero eligible changes, all 362 fares
retained, unchanged inputs. Exit 1 is expected; it proves honest failure and
retention, not a successful live quote. No bypass or retry occurred.

[Carnival website terms](https://www.carnival.com/about-carnival/legal-notice)
restrict reuse of site material. Collection is held for an approved source/reuse
path; this is not a legal conclusion about price facts, and robots alone does not
authorize reuse. Holland/Virgin access and exact contracts remain unreviewed.
Royal's existing denial remains. Discovery importers are not approved quote adapters.

Bounded transport: honest CruiseKit user agent, anonymous same-origin reads,
no redirects/cookies/credentials, ten-second timeout, two attempts, 750 ms spacing,
maximum five-second Retry-After wait, two-megabyte body and forty-request ceiling.
Long throttles, denials, challenges/waiting rooms and errors defer without evasion.
The current live probe is further limited to one provider/two rules requests and
never requests fares. No credentials, paid source or private customer data is used.

## Schedule, alerts, audit and activation scope

Keep one existing weekly job, Mondays 11:34 UTC (next expected October 12), and
daily freshness at 10:21 UTC. Cron may be delayed; neither cron is changed.
The candidate gates source access, skips reviews without same-run approved imports,
bounds child execution/output and returns failure for blocked verification.
Weekly CI continues to freshness/the existing Issue 52 updater, uploads audit and
fails visibly. Permissions remain contents:read/issues:write. No bot contents write,
secret, paid runner or deploy dispatch is added. This branch is not active on main.

Each run keeps immutable audit/before/candidate seed and ledger files with hashes
and per-sailing reasons. Seed/public assets/commits/push/deploy are outside the
verifier. Owner-adopted data candidates require schema/provenance/freshness,
tests/build and actual UI QA. Roll back only reviewed before files in a PR and
rebuild; never reset unrelated work or weaken seven-day policy to pass a run.

Next review scope: report-only controls and truthful website date disclosures,
preserving fare amounts. Publication requires specific website approval. Before
unattended collection, resolve an authorized free source path, implement/test a
bounded source-specific adapter, approve exact initial quote contexts and prove a
successful live quote dry run. Merely flipping flags or promoting old staging is
insufficient. Paid feeds, credentials, legal arrangements or permissions need a
separate scope decision.

Before unattended production writes, approve exact providers/cohorts, thresholds,
batch cap, schedule, alerts, bot permissions, rollback and deployment gates.
None of those writes is added. Normal verified changes remain candidates;
ambiguous changes always need owner review. Existing
[needs-kali Issue 52](https://github.com/kaliartistry/cruisekit/issues/52)
is the review location; no duplicate automation/issue is needed.

Local tests cover tuple changes, cents/exact nights, access, stale/replayed/future
observations, cache/source dates, first contexts, large changes, unavailable
listings, raw evidence, HTTP bounds and immutable retention. Web tests cover
checked-on/age/due labels, legacy fallback and mismatched provenance. The task's
WEEKLY-FARE-VERIFICATION-RESULT.md pins build/UI evidence and exact branch/CI;
this document does not claim remote CI passed or deployment occurred.
