# Truthful pricing integration review — October 5, 2026

Recommendation: **No Go for release**. This is isolated source work on `codex/truthful-pricing-main-integration-20261005`, based on exact GitHub main `5df4a4726212440470b746f729f2ff20083bbbce`. No merge, deployment, store changes, fresh-fare approval, paid provider, credential or security change. Website HOLD and frozen native 1.0.28 (56) artifacts remain.

## Scope and compatibility

The held web pricing commit `01010ecf60c85bc774eb05c5fa0176eb36835b16` cannot be merged wholesale. Its preserved baseline differs from current main in 240 files, including newer calculator tools, canonical PRICE_FACTS, source audits, save/restore, package timing, gratuity exemptions, Wi-Fi quantities and bundle handling. Five pricing patch files failed direct application; this isolated integration resolves those overlaps while preserving current main's features, routes, data, price facts and dependency lockfile. Held design work is not part of this integration.

Quote units are explicit booking/person/cabin USD amounts, normalized once. Exact nights distinguish five and six. Required taxes are included, explicit extra whole-party amount, or unknown subtotal. Daily government-fee averages never establish quote taxes. Displayed rows retain cents and reconcile. Comparisons retain the other line’s own gratuity rate instead of inheriting the primary line’s cohort or exemptions. Shared engine powers running totals; saved per-person quotes retain their unit, and legacy party totals default to booking/unknown tax basis instead of multiplying again.

Conditional two-adult Carnival arithmetic, seven nights at the stored USD 17 standard gratuity assumption: tax-inclusive 2,000 + 238 = 2,238; tax-exclusive 2,000 + 308 + 238 = 2,546. Five nights adds 170; six adds 204. These are fixtures, not fresh quotes or universal booking terms. Princess bundle adult inclusions prevent duplicate gratuity/Wi-Fi amounts; additional children retain standard gratuities unless separately exempted. Booking terms still govern eligibility and inclusions.

Browser cards and homepage tiles disclose currency, source, recorded check date/status and unit/occupancy. Historical fares cannot auto-seed current calculator quotes. The existing daily workflow gains the same seven-day gate and existing issue updater; the new gate is inactive until approved integration. No scheduler or publishing workflow was changed.

## Source and data limits

[Official Carnival US terms](https://www.carnival.com/legal/specials-terms-conditions) were checked October 5. Matching offers use the stated occupancy and include required fees/taxes; confirm the specific offer. Gratuities and optional packages have separate terms.

[Official MedjetAssist](https://medjetassist.com/medjetassist) and [membership options](https://medjetassist.com/membership-options), checked October 5: individual eight-day from USD 99 versus annual from USD 315. Standard short-term eligibility is US/Canada/Mexico residents under 75; Diamond, family, discounts and Horizon differ. Enroll before departure; qualifying inpatient hospitalization at least 150 miles from home, destination inpatient care and medical stability apply. It is transport membership, not treatment insurance. The old USD 99 annual claim was corrected.

Current-main canonical PRICE_FACTS stays byte-identical (Git blob `dde9f976bb5872b86ce2f99f518a2b784c09ffda`). **Fourteen** material facts are past October 4 recheck dates: Carnival CHEERS and six Wi-Fi timings, NCL current/legacy package gratuities, Princess Plus/Premier bundles, and two corroborated MSC gratuity assumptions. The existing freshness test intentionally fails; no dates or policy were weakened. Recheck exact products/periods/eligibility with official sources before release.

Virgin Bar Tab source entries divide fixed credits by seven days and use the daily-person package model. Fixed-credit quantity/unit semantics are still unresolved for non-seven-night trips and require a separate implementation/source decision before truthful pricing release. No fresh Bar Tab price is claimed by this review.

[Issue 52](https://github.com/kaliartistry/cruisekit/issues/52), run 37304778690/job 111745718915/artifact 11343353124: actual downloaded artifact SHA-256 `5d55ccd23a0678a2b4d467518b1cc18e586426e9dc9c61276d8c4bce219f07f6` reports 362/362 freshly generated public records stale against seven days. The committed main bundle contains 422/422 stale records; build-data-bundles excludes past departures, explaining the distinct cohorts. Held web has 388/388; native has 373/373. Do not confuse generated timestamps with per-fare checks. The 53 staged material changes are review candidates and remain untouched; missing records are not confirmed cancellations.

## Verification and remaining gates

Current-main candidate: TypeScript and full ESLint pass; 193-page direct static build passes. Full tests: 125 pass, one intentional expired-price-fact failure, one export test skipped by default. Separate bounded export test passes and matches native's preserved cost JSON exactly. Focused contract/regression tests: 48 pass. Desktop 1440 and phone 390 headless flows cover keyboard/error/repeat, inclusive/exclusive/unknown taxes, person/cabin units, cents, save/restore, comparison-line own-rate isolation, stale fare suppression, homepage disclosures and Medjet guide. No uncaught page errors; one intentionally blocked external resource warning per viewport. No route duplicates.

Native paired candidate: 365 full tests and clean analyzer; real isolated iPhone simulator passes actual wizard keyboard/error/repeat and running-total assertions. Native source preserves package inclusion flags, quote-context price-watch guards and legacy watches. New release version/build selection, signed artifacts, Android/physical-device release QA and Kali's specific release approval remain required. Frozen build 56 is not this modified debug source.

Neither original pushed pricing commit nor the frozen56 source has an applicable GitHub CI run/check/status. Branch pushes do not trigger the PR workflows, and no PR or dispatch was created. Local results are not a GitHub CI green. Require applicable CI on the exact proposed integration commits after resolving blockers. Current-main daily deployment automation already exists and was observed running; this task did not trigger or alter it.

Rollback before release: discard the isolated integration commit or return to pinned main; discard native pricing commits to preserved baseline `cf954e2a9f72233f0576297bc7893883e6b82c5f`. Source fixtures and frozen binaries are unchanged. No production rollback is needed because no publication occurred. Native master remains divergent; issue 17 still controls lineage reconciliation.
