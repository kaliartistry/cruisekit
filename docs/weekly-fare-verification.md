# Weekly fare verification candidate

## October 9 website/control release verified

The narrowed website/control release is published through
[PR 82](https://github.com/kaliartistry/cruisekit/pull/82), candidate `093ff4b`,
merge `3f370772`. GitHub also records former draft PR 79 as merged at 18:44:11
UTC, with its `mergeCommit` field pointing to head `52940e7`, which is included in
the ancestry. This task issued only the PR 82 merge; actual published main remains
`3f370772`. The published automation blob exactly matches pre-release production.
Exact-candidate PR Checks `37974978373` and normal Pages
`37975341830` passed; provider deployment `6968435220` succeeded at 18:45:54 UTC.
Full live desktop/phone calculator/disclosure and actual sailing navigation QA
passed with zero uncaught errors. All four public fare feeds retain their exact
pre-release bytes, and the new public verification ledger is empty. Source check
dates remain explicitly unverified. No current quote or live weekly refresh is
claimed, the unfinished pilot is inactive, and the 53 staged fares are unapproved.

Production automation, source policy, discovery, existing pricing/SEO, ShipSafe,
native frozen56/stores, credentials/security, simulator and external storage are
preserved. The final merged PR body records evidence and rollback. This note is
held on a receipt-only source branch for the next routine integration, avoiding a
second Pages deployment just for documentation.

## October 9 narrowed website/control release

Kali authorized deployment of ready validated non-ShipSafe work. The separate
release branch starts from reviewed draft PR 79 head `52940e7`, restores the
existing production automation workflow unchanged, and retains the existing live
pricing/SEO website. The unfinished weekly Virgin source pilot is not activated.
The code remains available for offline validation and future permitted capture;
this release is not a successful live weekly refresh.

The normal production export passed. Its canonical sailing/deal and mobile
sailing/deal payloads are byte-identical to the actual live October 9 baseline.
The new public fare verification ledger is empty. Cards identify price-check
dates as unverified, retain separate record-review provenance, and cannot use
these historical prices for current calculator estimates. No seed/check date,
53 staged price candidates, provider policy, dependency, native artifact, store,
ShipSafe or credential/security setting changes. Seven-day freshness and finite
0–300-second transport age gates remain unchanged.

All 102 offline verification tests passed on Node 22.23.2. Production build,
static SEO, desktop/phone rendered calculator/disclosure and synthetic cabin QA
passed. Exact release PR CI and final Pages/live read-back remain required; the
release PR records their final evidence. The task retains the underlying logs, screenshots and exact feed
hashes. Deployment status must be read from that final receipt, not inferred from
older candidate/HOLD entries below. Rollback is a reviewed revert of this release
merge, preserving later unrelated main work. Source collection, real baseline
adoption and native release remain separate scope decisions.

## October 9 offline implementation — candidate only

The saved October 7 engineering sequence resumed after the Mac update. It had
been unstarted, rather than partially written. The code now preserves unknown
HTTP Age with explicit reasons and separates document Last-Modified from quote
time. Missing age cannot enter an initial baseline or advance a verified date;
the existing 300-second and seven-day gates are unchanged.

`fare-run.mjs` provides canonical logical input hashes and bounded manifests.
A quote capture must supply `runId`, `collectionEventId`, actual `observedAt`,
complete context and raw evidence. The manifest binds exact selected targets,
code/policy/seed/ledger hashes and receipts; ingestion requires `--manifest` and
matching `--run-id`/`--run-started-at` for nonempty quote files. It never supplies
missing capture identity to legacy observations. The only unbound field is the
local `evidenceRef` path, which is remapped after containment and raw-hash checks.
Manifest target order follows the selected seed order. Identical bodies are
permitted for different evidenced collection events, while prior-run receipts,
duplicate events and persisted used-event identities are rejected. Each target
keeps at most 1,024 events and stops for review instead of dropping history.
These are integrity consistency checks, not origin authentication or proof that a
collector actually viewed the offer. Actual source use and extraction review
remain required.

Initial proposals carry their manifest. Specific baseline review revalidates
the completed source audit, code/input hashes, exact proposal and retained raw
bytes before writing separate candidates. It cannot adopt seed or certify other
targets. A synthetic file integration exercises pending proposal → fixture review
→ candidates → later-week check with equal body hashes, retaining historical
record review dates and unchanged actual repository files.

Research artifacts have `{schemaVersion:1, kind:"research-observations",
observations:[…]}`, outside seed/bundles/public assets. They cannot carry ledger
certification fields and are rejected by quote ingestion. No real research store
or automatic migration was introduced; flags on an otherwise valid legacy ledger
entry remain insufficient to define a research boundary.

`terminal.json` binds the execution result to its run and audit hash. Catchable
parsing, raw-evidence, expired-target or pre-audit failures produce failed records
when their output directory can be reserved. Original errors propagate even when
terminal storage fails; an existing successful output is never overwritten.
Completed execution can still have pending baselines or false scope/global
readiness. Hard termination, invalid initial run identity or unavailable storage
can leave evidence missing; check runner status rather than infer success.

Pure alert formatting requires explicit exact-run correlation plus a completed
terminal/audit match. Same-day foreign reports and incomplete evidence are omitted
with “Audit unavailable”; a matching terminal failure is shown even if a nested
audit completed. Tests hard-fail accidental network and child/external-writer
calls. No production CLI, `latest` write, issue mutation, source probe, credential
read, build/feed generation, schedule or unattended adoption ran. Existing workflow
run-identity propagation is a later integration decision; absent bindings remain
unavailable, without weakening the freshness gate.

Validation: `pnpm run data:test:fare-verification` passes all 102 tests on Node
22.23.2. Seed/ledger/policy are parsed from the same captured byte snapshot and
all three plus the executable fingerprint are checked again. Synthetic seed and
policy changes after capture fail before audit creation. The existing discovery
runner and all nine importers retain their exact production hashes. New web/native
build or UI QA is skipped because this offline repair changes no customer UI or
verified feed; October 5 release QA remains dated evidence.

The new code stays on draft PR 79 for review. Source holds remain as recorded;
there is still no permitted complete source, actual fresh quote or reviewed real
baseline. Website pricing/SEO releases are separate completed work, and frozen
native 56 and the pricing QA simulator are unchanged. Revert only the offline
repair commit through a separate branch if needed; no customer rollback is needed.

## October 7 practical two-exchange outcome — no collector activation

Two actual focused Claude Desktop replies were collected and reviewed against
current code and primary-source evidence. Displayed mode was Opus 5.5 Medium,
distinct from the October 6 session. Neither consultation is a source permission,
code audit or actual quote verification. Two current-phase exchanges are complete;
no additional inference is required merely to answer the storage question.

**Research observations belong in a distinct schema/file set.** At the inspected
`d3385eff` snapshot, `ledgerProblems()` in `scripts/lib/fare-verification.mjs:42`
does not interpret research/eligibility flags. `assessFares()` uses any valid
entry as a prior baseline and advances ordinary eligible dates at line 114.
`scripts/data-freshness-report.mjs:142` reads that successful-verification date;
`scripts/build-data-bundles.mjs:494` projects every public entry and drops extra
flags. A synthetic in-memory probe confirmed ineffective flags remain present
while an eligible candidate advances. Invalid research entries instead fail
provenance validation. Existing source/context gates still apply; flags supply
no additional exclusion once an entry satisfies them.

Keep research artifacts outside `data/seed/fare-verifications.json`, generated
bundles and public assets, with a distinct kind/schema, no verified-state dates
and no automatic conversion into ledger entries. Physical/schema separation is
an ordinary consistency boundary, not authentication. Synthetic fixtures may
exercise it now; actual collection still needs an established applicable source
use. No store, migration or source admission change was implemented here.

The practical local sequence is: repair missing/malformed Age and separate HTTP
Last-Modified; bind actual run/collection events without requiring changed body
hashes; then test conservative failure envelopes and same-run report matching
through temporary inputs. Keep first proposals, specific fixture reviews,
later-week candidates, selected scope and global recency distinct. Unknown-age
research never advances the verified ledger or certifies freshness. HTTP Age
does not measure backend quote age; see [RFC 9111 section 5.1](https://www.rfc-editor.org/rfc/rfc9111.html#section-5.1).

Existing 67 tests passed earlier October 7; they include safe synthetic
`recheck`, baseline-review and injected-pilot integration. Those existing tests
and pure issue formatting are permitted in the offline experiment. No external
issue writer, `gh` mutation, production CLI/source probe, `latest` output or
build/feed generation is included. Proposed new fixes/tests remain unimplemented.

Source evidence and internal scope approval must stay separate. An owner's
internal checkbox cannot create third-party rights; applicable published terms,
existing legitimate authorization or a defensible applicability assessment may
establish a method without a universal bespoke-license rule. Carnival's reviewed
[website terms](https://www.carnival.com/en-US/about-carnival/legal-notice/website-terms-and-conditions)
and [copyright section](https://www.carnival.com/en-US/about-carnival/legal-notice/copyright)
still do not establish this exact CruiseKit method. The assumed 30-day retention
was withdrawn. No provider outreach, account, key, grant, payment or quote request.

No one-target result certifies the 361-record catalog. Existing seven-day global
failure remains. New real collection, a changed human admission/partial-publication
policy, unattended adoption and exact release require their concrete source/scope
decisions. Shared-seed web prebuild also changes mobile feeds; frozen native 56
and mobile release effects remain held. PR 79 remains draft, executable snapshot
`13b5c8bc` unchanged and main/live `c0e6390c` unchanged.

## October 6 bounded Carnival applicability review — no fare collection

This source-specific pass separates personal viewing, product evaluation,
automated recording and customer redistribution. It establishes no complete
permitted quote source and no legal conclusion about all price facts. No fare
endpoint, booking page, account or trial was accessed. Current Carnival policy
remains `review-required` with null contract; existing discovery is preserved.

Primary text, read October 6:

- [US website terms](https://www.carnival.com/en-US/about-carnival/legal-notice/website-terms-and-conditions),
  **OWNERSHIP AND RESTRICTIONS ON USE**, first two paragraphs: copied material is
  limited to one personal home-use copy; the exact qualifier is **“personal,
  non-commercial home use only”**. Other-site use is restricted.
- [Copyright section](https://www.carnival.com/en-US/about-carnival/legal-notice/copyright),
  third paragraph: website copying/modification requires **“prior written
  authorization”**. The next paragraph's travel-agent exception depends on
  Carnival's agency guidelines; its following image restriction concerns images.
- The same combined legal page includes Carnival's mobile-app EULA section
  2.2(j), restricting automated queries made *using that application*. This is
  not a demonstrated general website scraping clause. The website section has
  no located scraper/robot-specific clause. No effective date is shown for those
  website paragraphs; the privacy date and copyright year are not their date.
- [Current robots](https://www.carnival.com/robots.txt) lists search/error and
  login/enrollment-query exclusions, not `/cruisesearch/api/search`. No robots
  denial for that path was found. This is not a reuse license.

| Proposed action | Bounded conclusion |
| --- | --- |
| Person views a trip for themselves | Not expressly barred by the reviewed copying clauses. |
| Person records a quote/screenshots for CruiseKit | Product evaluation is not established as personal home use; scope unresolved. |
| Agent records weekly factual quotes | No specific web automation prohibition located; recording/reuse scope remains unresolved. |
| CruiseKit stores/transforms/displays quotes | No applicable grant established; bare facts versus protected material and contract applicability remain unresolved. |

A free product does not establish the personal-use exception. This is a source
applicability question, not a ruling that price numbers are copyrighted or that
every factual read requires written permission. If proceeding without source
clarification is proposed, counsel should assess the specific fact-only method,
protected selection/layout, contractual assent/enforceability and intended use.
Owner risk acceptance must not be recorded as Carnival permission. Concrete
terms interpretation is useful; another broad provider search is not required.

### Documented routes and source completeness

Carnival's [GoCCL portal](https://www.goccl.com/) and linked
[agency policy](https://www.goccl.com/en/travel-agency-policy) redirect to login.
The review stopped there, without authentication or alternate access. The
travel-agent exception is not evidence CruiseKit qualifies or has a feed grant.

[Widgety's API](https://widgety.org/product/api/) is a documented supplier route
for eligible agencies/technology firms, with pricing/availability and website
content. It requires contact for a time-limited two-operator test key. Its
[markets page](https://widgety.org/markets/) links a USD list, but the linked
public document returned no readable text in this review; Carnival/USD coverage
is unconfirmed. Marketing coverage, historical trial eligibility and local
vendor notes are not current access, caching, evidence-retention or display
rights. No key, contract, fee, affiliate path or inquiry was activated. Other
local vendor proposals remain prospective; no new paid-provider pass was made.

Independent local audit confirms `scripts/ingest/carnival.mjs` requests
`/cruisesearch/api/search` with two adults/USD/locality=1 and pagination, without
exact sailing/cabin/rate selection (lines 17, 160–183). Optional room price,
currency/category/rate fields are saved separately (69–82). Canonical price is
the minimum positive room amount without excluding sold-out rooms, or a lead
price fallback (85–90, 113); category/rate association is lost. Currency can
come from a different room, then defaults to USD (133). Unit/tax flags are
hardcoded (134–135); ports use the lead sailing's schedule and `lastVerified`
uses import day (104–112, 141–150). Reachability and those fields cannot certify
a current exact quote. No importer was executed during this review.

The possible inquiry example is the *historical catalog reference*
`carnival-carnival-valor-20261022-22098`: Carnival Valor, October 22–26, four
nights, New Orleans round trip. These are not freshly confirmed source facts.
Its stored itinerary contains only Cozumel, while the current validator requires
at least two entries and exact seed agreement. Even after source scope is
established, this target cannot qualify unchanged; the source's complete ordered
itinerary and the intended normalized representation require explicit review.
One-port itineraries can be a valid design case; do not pad duplicate ports or
invent stops to satisfy the current minimum, or label the voyage unavailable.
No seed correction or cancellation is inferred from this mismatch.

### Minimum unsent rights inquiry

An owner-review draft is preserved in the internal task directory as
`CARNIVAL-FARE-RIGHTS-INQUIRY-DRAFT.md`; it has not been sent. Ask Carnival to
identify a permitted no-cost method or supplied nonprivate example for **one
internal US/USD adult-only cabin quote**, separately answering human recording,
automated weekly checks and eventual web/mobile fact display; attribution,
retention/cache limits; exact cabin/rate/package/occupancy/tax/itinerary fields
and price observation/cache timestamps. No signup, key, trial, acceptance,
payment or production use is requested or authorized by this draft.

Practical decision: authorize the single information-only inquiry through a
confirmed appropriate contact, or obtain a narrow counsel interpretation of the
fact-only internal method before treating it as permitted. Pending that choice,
stop Carnival fare collection and preserve the existing dated/stale fallback.
One complete quote is still unproven; weekly verification remains unfinished.

## October 6 completed Claude consultation — browser interim option

The actual initial packet review and one focused browser follow-up completed in
the same native Desktop Code session, visibly Opus 5.5 / Plan / Effort Ultracode.
This was a bounded single-context review with no source/code/CI audit by Claude,
no fanout, no new inference on final collection and no CLI effort substitution.
Full substantive responses and completion/model/hash receipts are retained in
the existing internal task directory, alongside the reconciliation. Foreground
was released immediately after collection. The prepared/pending status below is
historical; no fresh quote or release is inferred from this completed review.

Decision log additions:

- D7 — A small human-browser study may be useful only once applicable terms or
  existing legitimate access establish the intended provider-specific scope.
  Bespoke written grants are not established as a universal requirement for
  factual human reads. Claude corrected that initial recommendation's breadth
  and withdrew its Azamara 403 inference/retry suggestion. No provider in the
  supplied packet is presently established as allowed for the study. Ordinary
  viewing, systematic manual recording, automation and public reuse differ.
- D8 — An interim study could first prove one complete real future quote, then
  measure 3–5 explicitly selected voyages twice, 14 days apart, including actual
  incomplete/unavailable outcomes. This is exploratory, not source collection
  authorization or a Muse handoff. Muse browser control remains automated.
- D9 — Keep seven-day freshness. Fourteen-day visits cannot maintain a current
  subset for the full cycle or clear the stale global catalog. Unknown browser
  cache/backend age remains unknown. Current verifier requires a distinct
  evidence contract before accepting human observations; do not insert age 0,
  fabricate missing tuple fields or use policy/build dates as checks.
- D10 — Preserve pending first-baseline review versus later eligible candidates.
  The initial audit retains old input and does not set `scopeReady`; specific
  reviewed candidates do not publish themselves. No global gate is relaxed and
  no prior blanket discovery-import gate is restored by Claude's recommendation.
- D11 — A reasonable concrete next source-research candidate is Carnival's full
  applicable US collection/reuse scope, not its fare endpoint. This is ordinary
  already-authorized research; it does not declare Carnival permitted. A narrow
  uncertainty or actual restriction returns for a concrete scope decision.
  Existing Widgety information-only inquiry remains an unsent alternative; no
  new service, key, commercial agreement, fee or outreach is authorized here.

The labour estimate remains unmeasured: at 10–15 minutes per complete quote,
five cost 50–75 minutes plus review; the historical 362-target set costs
60h20–90h30 before review. Current counts change as departures age out. Measure
actual completeness, transcription errors and review effort before expansion;
Claude's proposed 15-minute median/four-of-five threshold is not adopted policy.
Public partial-cohort/feed scope and shared mobile-feed implications remain
specific release decisions. No real source, baseline, collector or M1–M5 pass
has been established. This local documentation follow-up is not pushed under
the latest no-public-writes instruction; no executable/data/customer change.

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
