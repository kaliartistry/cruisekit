# CruiseKit Growth Engine V1 Experiments

Status: V1 experiment protocol. No experiment is live until its configuration is enabled, QA passes, and the launch is approved.

## Guardrails

- Use a lightweight, config-driven system; do not build an enterprise experimentation platform.
- Keep assignment stable for returning visitors using the same opaque anonymous ID used by attribution.
- Emit one exposure event only after the assigned variant is actually visible.
- Do not use email, Firebase UID, or private sailing data to assign variants.
- Do not claim statistical significance from the first 20 users. Results are directional learning only.
- Do not alter price, legal, consent, or data-collection behavior through an experiment without approval.

## Configuration Contract

Each experiment configuration contains:

| Field | Meaning |
| --- | --- |
| `id` | Stable, human-readable experiment identifier. |
| `status` | `draft`, `active`, `paused`, or `complete`. |
| `startDate` / `endDate` | Inclusive eligibility window. |
| `eligibility` | Route, device, campaign, or other non-sensitive inclusion rule. |
| `variants` | Named variants and their UI payload. |
| `assignmentVersion` | Increment when a materially new assignment population is intended. |
| `primarySuccessEvent` | The one behavior the experiment is intended to improve. |
| `guardrailEvents` | Events that must not regress materially. |
| `notes` | Decision context and implementation notes. |

Assignment should be deterministic from `anonymous_id + experiment_id + assignmentVersion`, then persisted in first-party storage. If first-party storage is unavailable, use a deterministic in-memory fallback for the current page and emit the exposure event with an `assignment_persisted=false` flag.

## Initial Experiment: Founding 20 Hero Message

| Field | Value |
| --- | --- |
| Experiment ID | `founding20-hero-message-v1` |
| Status | Active configuration in the feature branch; not live until approved deployment |
| Audience | New, eligible visitors to `/founding-20`; exclude internal QA and bots where detectable |
| Assignment | 50/50 stable anonymous visitor assignment |
| Variant A | “Know what your cruise will really cost.” |
| Variant B | “Keep every cruise day organized.” |
| Primary metric | `founding20_application_started` per eligible exposed visitor |
| Secondary metric | `founding20_application_submitted` per eligible exposed visitor |
| Guardrail metric | Calculator completion and error rate; no material accessibility or load-time regression |
| Minimum directional sample | At least 20 eligible exposed visitors per variant and at least five completed applications overall, unless the program closes first |
| Decision rule | Choose a direction only when the signal is consistent across starts, submissions, and qualitative feedback; otherwise keep or pause the control |
| Result | Pending |
| Decision | Pending |

### Hypothesis

For visitors with a real upcoming sailing, a specific outcome-oriented hero message will increase application starts. Variant A emphasizes pre-cruise cost confidence; Variant B emphasizes daily organization. The test learns which message better matches the first cohort; it does not prove a durable population-wide preference.

### Exposure event

When the message is visible, emit:

```text
experiment_variant_viewed
  experiment_id: founding20-hero-message-v1
  experiment_variant: A | B
  landing_page: /founding-20
```

The event must include standard non-sensitive analytics context from [ANALYTICS_SPEC.md](ANALYTICS_SPEC.md).

## Operating Record Template

Copy this section for each additional experiment.

```text
Experiment ID:
Owner:
Status:
Start / end:
Hypothesis:
Audience and exclusions:
Variant A:
Variant B (and any further variants):
Primary success event:
Guardrail event(s):
Minimum directional sample:
Data-quality checks:
Result:
Decision:
Follow-up:
```

## QA Checklist

- Same anonymous visitor receives the same variant after refresh, navigation, and calculator handoff.
- A new anonymous visitor is assigned deterministically and approximately evenly over a meaningful sample.
- The assignment is not changed by UTM, referral, sign-in, or device changes during the same browser profile unless eligibility explicitly calls for it.
- Exposure fires after visible rendering, once per visitor/experiment/version according to the dedupe rule.
- Both variants retain equal form behavior, consent wording, accessibility labels, error states, and privacy disclosures.
- Console reporting shows exposed visitors, starts, submissions, and guardrail counts by variant without exposing PII.
