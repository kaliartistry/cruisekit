# Weekly fare verification candidate

## October 6 renewed project goal and decision log

This dedicated project continues in the existing thread and draft PR 79. The
measurable goal is a permitted source with a complete comparable quote, one real
sailing verified end to end, then a reliable weekly refresh and a bounded
verified publication path. The goal is not achieved by a report, rules check,
fixture, rebuild or approval flag. No working live collector or active fare
refresh is claimed. Parent coordination handles routine implementation choices;
only concrete source-access, spending, security, unique-data or release decisions
need escalation. Preserve the live pricing site and held native work.

| Milestone | Required evidence | Current state / next step |
| --- | --- | --- |
| M1: legitimate source | Source-specific collection, public display, attribution and caching rights; exact feed/API scope and update semantics | Blocked: no established usable grant in the reviewed project evidence. Review the access analysis, then use existing legitimate access if supplied or consider one unsent bounded rights inquiry. |
| M2: one real complete quote | One named sailing, full quote tuple, permitted bounded transport, raw evidence hash, actual observation/provider timestamps and immutable retained/candidate audit | Blocked on M1 and a real collector. No denied source retry or fabricated missing fields. |
| M3: reviewed first baseline | Specific human review bound to proposal/before/evidence hashes; complete candidate and rollback files; current context and age revalidated | Candidate-only machinery is tested with synthetic fixtures; no real baseline has been approved or adopted. |
| M4: reliable weekly refresh | Explicit cohort, reused weekly job, bounded requests/batch, stable identity, exact-context comparisons, seven-day checks, quarantine/retention, same-run alerts and repeat/replay/failure tests | Missing permitted collector and approved live context. The draft pilot emits no observations under the present restriction. Keep global coverage distinct from one-sailing success. |
| M5: bounded publication | Explicit destination/cohort and write authority; atomic seed/ledger/evidence binding; review/CI/build/UI and freshness gates; deployment receipt and rollback | Design/release gate remains open. Current scripts create candidates only. Do not enable unattended writes or merge merely to activate reporting. |

The complete tuple and current validator limits below remain required. A weekly
cron does not guarantee a run within seven days; delayed/failed checks must leave
the actual prior observation date and stale fallback intact. A single verified
cohort cannot make the remaining catalog fresh. A global freshness gate must not
be weakened or silently converted to a pilot-success gate.

Decision log, 2026-10-06:

- D1 — Reuse this project, PR 79, existing workflows and Issue 52. No new daemon,
  duplicate task, schedule, paid service, signup, key, outreach or permission
  change is authorized by the renewed goal.
- D2 — The bounded public-source pass reviewed Carnival, Princess, Azamara and
  the already-recorded Widgety API. Carnival reusable-data permission remains
  unresolved; Princess's light feed lacks exact fares and its US legal link
  redirected internationally; Azamara's legal read returned 403 and was not
  retried. Widgety's documented trial requires contacting it for a test key.
  The vendor tracker records offers/eligibility, not an executed grant or issued
  CruiseKit key. Absence of an established source does not prove every free
  source forbidden. Virgin section 11 and denied NCL booking paths stay respected.
- D3 — Existing project evidence does not document an accepted current fare
  license or public syndication grant. `docs/data-pipeline.md` describes provider
  access as pending and licensed alternatives as conditional; the watchlist is
  a review queue, not a license. Affiliate paths are outside this project.
- D4 — Prepare a sanitized review packet for actual Claude Desktop Opus 5.5
  Ultracode, with access and architecture challenged independently. Invocation
  and foreground ownership stay with the coordinator. No CLI/headless `max`
  substitution, completed-review claim or private payload is permitted.
- D5 — New material coupling: `apps/web/package.json` prebuild invokes bundle
  building/public copying; both canonical and mobile bundles come from shared
  seed (`scripts/build-data-bundles.mjs`, `scripts/publish-data-bundles.mjs`).
  Future web fare adoption can therefore change the public mobile feed without
  changing native code. Before M5, the parent must decide the intended feed
  scope or approve isolation; native hold cannot be inferred to protect feed data.
- D6 — Architecture questions for review, not completed fixes: same-run artifact
  binding, review receipt authority, HTTP cache/provider-age semantics, ingest
  failure propagation, partial-cohort/global-freshness separation, and a deploy
  gate that depends on the exact verified candidate. Existing Pages deployment
  does not depend on the report-only job or its freshness result.

If no existing legitimate access is supplied, the smallest consequential next
decision is whether to authorize one provider rights inquiry. Its unsent scope:
one named sailing, US/USD, adult-only explicit occupancy, one cabin/category and
rate/package; a nonprivate sample/schema and exact source/update timestamps;
collection/public-display/cache/attribution rights and limits; whether access
can be granted without account, key, fee, affiliate agreement or booking access.
Any required new access or contract returns to the parent before action. This is
an option, not outreach authorization or a commercial commitment.

Public source evidence: [Carnival terms](https://www.carnival.com/about-carnival/legal-notice),
[Princess terms (redirect destination)](https://www.princess.com/en-int/legal/legal-information),
[Azamara legal link (403)](https://www.azamara.com/about-azamara/legal),
[Widgety API access](https://widgety.org/product/api/),
[Widgety sharing terms](https://widgety.org/terms-conditions/).
October 6 task-local receipts preserve six hashed public document/homepage
bodies; none is quote evidence. The review packet is prepared separately on
internal task storage and is not a Claude response or source-access grant.

Older schedule/gating descriptions below are historical where the October 6
pilot revision supersedes them. Current draft source policy remains review-only;
all provider contract versions are null and the verification ledger is empty.

## October 6 pilot revision — source failure, no verified fare

PR 79 stays draft. The previous blanket gate is removed: the weekly discovery
runner and all nine importer files match production `c0e6390c` byte-for-byte.
The pilot is an independent step in the existing Monday 11:34 UTC job; it does
not replace discovery. Cron/permissions/Pages behavior remain unchanged. It must
not be merged as an assertion that a working fare updater exists. Existing
discovery scripts were not executed during this pilot, and preservation does not
certify their source permissions or fare semantics.

The chosen existing record is `virgin-voyages-brilliant-lady-20261024-5nlah`,
voyage `BR2610245NLAH`, October 24–29 (five nights). Its stored USD 1,192/per-cabin
amount and false tax flag are historical, unverified inputs, not current facts.

[Virgin website terms](https://www.virginvoyages.com/terms-and-conditions),
effective March 18, 2026, Part I section 11, expressly prohibit collecting site
data through manual/automated crawling or scraping. The actual bounded pilot
read that source at `2026-10-06T00:46:58.362Z`, evidence SHA-256
`540bf34142f3eb2c0ce164ced2cb148a8dd94bbf9061da4f7f6d2d3c1cf08454`, and stopped:
one terms request, zero fare requests, zero complete quotes/baseline proposals,
one retained fare, 360 other upcoming public records outside scope, unchanged
seed/ledger, expected exit 1. The terms check is not a price verification date.
No provider permission, credentials or permitted alternative source was obtained.

The existing Virgin discovery shape has voyage/package IDs and some dates,
headline/dated price strings and ports. It does not prove exact cabin category,
rate plan, guest/cabin counts, US market, returned USD currency or tax inclusion.
`inspectVirginDiscovery` diagnoses those gaps, preserves decimal cents and never
substitutes the card price, guesses a ship from a prefix, or emits a complete
quote. Synthetic fixtures are clearly marked; none is live evidence. A complete
Virgin live quote adapter cannot be established against the prohibited website.

The fresh [Holland robots](https://www.hollandamerica.com/robots.txt) evidence
at `2026-10-06T00:38:34.819Z` has SHA-256
`d6a726e4c1885c0d89251ca83fb2c456d22481bab4fda092955b8ed9971eed05` and disallows
the booking funnel. Its public discovery access/terms and exact quote contract
remain unresolved; no alternate quote was collected. NCL's exact dated path
remains denied. Carnival's broad material-reuse terms need precise source review;
they have not established a blanket permission requirement for factual fare
research. Missing normalizers and source-contract review are engineering work,
not new Kali permission requirements. Respect actual restrictions and seek a
permitted free source; no bypass, private access, key or paid service is added.

## Working observation and first-baseline path

The verifier now consumes explicit scoped observations:

```sh
pnpm run data:fare:recheck --target EXACT_EXISTING_ID --observations /local/run/observations.json --run-started-at CURRENT_RUN_UTC --output /local/run/audit
```

The source adapter must supply the full existing quote tuple and hashed raw
evidence. `coverage.outsideScope` remains explicit; `ready` cannot be true for
a partial catalog. The public freshness gate is unchanged and does not treat
pilot success or candidate dates as public certification.

Complete first observations now emit `initial-baselines.pending.json`, including
the exact before hashes, proposed record, evidence/observation and proposal hash.
They do not change seed or create an approved ledger entry. First proposals may
correct legacy unit/tax metadata only with an explicit complete source context;
sailing/itinerary identity must match. Missing/unknown/denied evidence produces
no proposal. The selected Virgin source failure produced an empty pending file.

After a specific human data review, supply a JSON array of receipts with
`targetId`, `proposalSha256`, `reviewedBy` and `contextApprovedAt`. The tool does
not manufacture approvals or accept broad provider approval as a data review:

```sh
pnpm run data:fare:recheck --review-audit /local/run/audit --reviews /local/specific-reviews.json --output /local/reviewed-candidates
```

This revalidates current before hashes, context, raw evidence hashes/path bounds,
review identity/timing and the seven-day observation age. It writes separate
immutable candidate/before/evidence files, never seed, feeds, a commit or deploy.
Approval time never replaces observation time. Specific adoption remains a
reviewed data PR/release action. Once adopted, later weekly exact-context checks
can produce ordinary candidate changes; >=15%/changed/ambiguous results still
retain the prior fare for review. Fixture integration proves this path without
representing its synthetic prices or receipts as actual quotes/approvals.

The independent weekly pilot passes an observations file and explicit target to
the verifier. Under current Virgin terms that file is empty and the job fails
visibly. It reports actual source failure/evidence/coverage via the existing
Issue 52 updater and uploaded dated artifacts. If terms become inconclusive it
still stops; absence of a detected restriction does not establish a contract or
activate a collector. The selected departure expires October 24; the pilot then
fails before access until a new concrete target is selected, never silently
substituting a different sailing.

Remaining path: establish a permitted free exact-quote source; implement its
actual field mapping/collector and prove one complete live quote; prepare/review
one initial baseline; then expand explicitly bounded cohorts with coverage tests.
Source restriction/research and unfinished implementation are distinct. No real
verified-fare dry run has passed. Pricing-data adoption, website/native feed
publication and unattended production writes remain specifically gated.

## Previous candidate description (superseded where noted above)

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
It rechecks NCL's public robots rules on this cadence with at most two anonymous
requests and zero fare requests; a rules check never advances a quote date.
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
