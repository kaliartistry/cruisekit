# CruiseKit Growth Engine V1 Weekly Scorecard

Week ending: `YYYY-MM-DD`
Prepared by:
Data-quality note: Counts from the first 20 users are directional. Do not present them as statistically conclusive.

## Executive Readout

- Biggest movement:
- Biggest blocker:
- Most repeated user problem:
- Decision for next week:
- Approval needed from Kali:

## Cohort Health

| Metric | This week | Prior week | Change | Definition / note |
| --- | ---: | ---: | ---: | --- |
| Qualified applications |  |  |  | Submitted applications that pass program review; not automatic acceptances. |
| Users contacted |  |  |  | Unique approved applicants contacted by CruiseKit. |
| Users onboarded |  |  |  | Users who completed the agreed concierge/self-serve setup. |
| Activated users |  |  |  | Derived state only: real sailing + qualifying value action. |
| Activation rate |  |  |  | Activated users / onboarded users. |
| Median time to activation |  |  |  | Median duration from onboarding or first eligible touch to activation; state the chosen start point. |
| Sailing completed |  |  |  | Users whose tracked sailing has ended. |
| Interviews completed |  |  |  | Voluntary completed research interviews. |

## Funnel

| Metric | This week | Prior week | Change | Notes |
| --- | ---: | ---: | ---: | --- |
| Landing-page visitors |  |  |  | Eligible public growth landing views. |
| Calculator starts |  |  |  | `calculator_started`. |
| Calculator completions |  |  |  | `calculator_completed`. |
| Calculator completion rate |  |  |  | Completions / starts. |
| Calculator result shares |  |  |  | `calculator_result_shared`. |
| Share rate |  |  |  | Shares / completions. |
| Founding 20 applications |  |  |  | Valid submitted applications. |
| Sailing save starts |  |  |  | `sailing_save_started`. |
| Real sailings saved |  |  |  | Valid `sailing_saved`, excluding placeholders/synthetic dates. |
| Save rate |  |  |  | Real sailings saved / calculator completions. |
| Activated users |  |  |  | See derived-state definition. |

## Distribution and App Handoff

| Metric | This week | Prior week | Change | Notes |
| --- | ---: | ---: | ---: | --- |
| App Store clicks |  |  |  | `store_link_clicked`, store `app_store`. |
| Google Play clicks |  |  |  | `store_link_clicked`, store `google_play`. |
| Store click rate |  |  |  | Total store clicks / eligible calculator results or landing views; state denominator. |
| Invitations created |  |  |  | Real MyCrew invites only. |
| Invitations sent |  |  |  | Link was actually shared/sent. |
| Invitations accepted |  |  |  | Successful membership acceptance. |
| Invitations per activated user |  |  |  | Invites sent / activated users. |
| Invitation acceptance rate |  |  |  | Accepted / sent. |
| Referral-attributed activated users |  |  |  | Aggregate only; no partner PII export. |

## Source, Campaign, and Partner Mix

| Source / campaign / referral partner | Visitors | Calculator completions | Applications | Real sailings saved | Activated users | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
|  |  |  |  |  |  |  |

Never use a small cell to reveal a named traveler. Suppress or combine any partner view that could expose an individual’s activity.

## Product and Support Learning

| Signal | Count | Examples / evidence | Owner | Next action |
| --- | ---: | --- | --- | --- |
| User-reported problems |  |  |  |  |
| Product failures |  |  |  |  |
| Data freshness/source issues |  |  |  |  |
| Support time per user |  |  |  |  |
| Accessibility/mobile issues |  |  |  |  |
| Privacy/consent concerns |  |  |  |  |

## Experiment Readout

| Experiment | Variant | Exposed visitors | Starts | Submissions | Guardrail observations | Directional result | Decision |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| `founding20-hero-message-v1` | A |  |  |  |  |  |  |
| `founding20-hero-message-v1` | B |  |  |  |  |  |  |

Use the word “directional” unless the cohort grows beyond the explicitly documented experiment threshold and data quality has been reviewed.

## Data Sources and Completeness

| Source | Expected data | This week’s completeness | Caveat |
| --- | --- | --- | --- |
| GA4 adapter | Page, calculator, share, store, experiment events |  | Client blockers/ad blockers can reduce counts. |
| Firestore growth data | Applications, real saves, activation, statuses |  | Must be server-derived for trusted conversions. |
| Mobile instrumentation | MyDay, Spend, MyCrew actions |  | External Flutter work may be incomplete. |
| Search Console | Organic impressions/clicks |  | Use only authenticated/exported data. |
| Support/interviews | Qualitative issues |  | Private notes stay outside analytics. |

## Decisions

- Ship:
- Hold:
- Investigate:
- Ask Kali for approval:
- Carry into next week:

## Metric Definitions

```text
activation_rate = activated_users / onboarded_users
calculator_completion_rate = calculator_completed / calculator_started
share_rate = calculator_result_shared / calculator_completed
save_rate = real_sailings_saved / calculator_completed
invitation_acceptance_rate = invitations_accepted / invitations_sent
```

Use `N/A` rather than `0%` when the denominator is zero. Keep the prior-week denominator visible when a rate changes so a one-person movement is not mistaken for a trend.
