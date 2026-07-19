# CruiseKit Growth Engine V1: Next 30 Days

Status: prioritized execution and learning plan for the first 20-user program. It does not authorize outreach, paid activity, deployment, or new external claims without Kali’s approval.

## Success Definition

The goal is not downloads or traffic volume. The goal is to learn how real travelers move from a real upcoming sailing to at least one valuable action.

By day 30, target evidence should include:

- A working, privacy-conscious Founding 20 funnel
- A protected operational view of applicants and activation
- At least one tested attribution/referral path
- A small number of properly onboarded real travelers
- Clear evidence about the most valuable and most confusing product moments
- A prioritized product backlog based on observed behavior and interviews

## Next Ten Tasks, in Priority Order

1. Confirm the Firebase/staging decision, abuse-control approach, and any Resend/App Check prerequisites.
2. Implement the server-backed Growth Engine data model, validation, and admin authorization path.
3. Implement durable first/last-touch attribution, opaque anonymous identity, referral-code resolution, and the analytics interface.
4. Correct calculator readiness gaps: real-sailing validation, source/freshness accuracy, missing cost inputs, required CTAs, and share-card privacy controls.
5. Build the Founding 20 public page/form and success flow with accessible validation and privacy disclosure.
6. Build the protected Growth Console with pipeline, filters, CSV export, and directional funnel dashboard.
7. Build Captain, Advisor, and Creator pages/forms with approved positioning and no unsupported commercial claims.
8. Add the lightweight hero experiment with stable assignment and exposure tracking.
9. Add unit, Function/integration, Firestore authorization, and critical E2E tests; complete staging QA.
10. Begin approved, manual recruitment; onboard the first qualified travelers and run the weekly learning loop.

## Week 1: Make the Funnel Trustworthy

### Product and infrastructure

- Finalize the proposed growth collections and server functions.
- Decide whether App Check, a CAPTCHA provider, or a documented server-only rate limit is the launch abuse-control mechanism.
- Add the analytics schema and activation derivation before building dashboard metrics.
- Preserve `/calculator` as the canonical route and fix any false freshness/default-price signals before promoting it.
- Define what constitutes a real upcoming sailing and reject placeholders from activation.

### Required evidence

- A reviewed schema/field inventory
- Function validation tests
- Admin authorization tests
- Attribution test from UTM/referral landing through a durable conversion
- Written staging-project decision or a documented blocker

## Week 2: Build the Public and Internal Surfaces

### Public

- Launch-readiness version of `/founding-20`.
- Reusable partner application form primitives for Captain, Advisor, and Creator routes.
- Calculator result CTAs and privacy-safe share card.
- Experiment configuration for the two approved hero messages.

### Internal

- Growth Console pipeline and filtered applicant list.
- Follow-up-date and founder-note workflow.
- CSV export with admin-only access.
- Weekly scorecard data collection path.

### Required evidence

- Mobile and keyboard QA
- Error/loading/empty-state review
- Console shows a seeded/test application without exposing it publicly
- E2E test covers the primary funnel

## Week 3: Controlled Pilot

### Before inviting anyone

- Receive Kali approval for every outreach batch, recipient, message, channel, and any use of a community link.
- Confirm no public price or partner claim is unsupported.
- Confirm privacy disclosure, deletion path, and contact consent are live.
- Verify admin access, Function logs, GA4 events, referral links, and app handoffs in the approved environment.

### Pilot behavior

- Start with a small number of qualified applicants; do not optimize for volume.
- Review applications within two business days.
- Schedule concierge onboarding for travelers with real sailing context.
- Record factual friction and support time.
- Run the hero experiment only after the baseline funnel works.

## Week 4: Learn and Iterate

- Complete the first weekly scorecard using documented data sources.
- Review activation evidence, not downloads.
- Conduct voluntary post-onboarding or post-cruise interviews.
- Prioritize the top three repeated product failures or points of confusion.
- Close the loop with participating users when a fix or decision is made.
- Decide whether to continue, narrow, pause, or expand the pilot based on directional evidence.

## Daily Operating Rhythm

| Cadence | Action |
| --- | --- |
| Daily | Review new applications, Function errors, rate-limit/spam indicators, and support requests. |
| Twice weekly | Update applicant statuses/follow-up dates and inspect activation gaps. |
| Weekly | Fill [WEEKLY_SCORECARD.md](WEEKLY_SCORECARD.md), review experiment exposure, prioritize product work, and request required approvals. |
| After every significant change | Run relevant tests, record skipped checks, and retest the complete attributed funnel. |

## Decision Gates

| Gate | Proceed when | Hold when |
| --- | --- | --- |
| Public Founding 20 launch | Form, privacy, Function validation, rate limit, and admin view pass QA | Staging/configuration, consent, or abuse controls are incomplete. |
| Referral distribution | Codes resolve, attribution survives, aggregate reporting is ready | Referral might expose user data or code revocation is untested. |
| Advisor/creator outreach | Kali has approved the exact batch and message | No approval, unsupported claim, or unclear community rule. |
| Review request | Participant has demonstrated value and has no unresolved issue | User is frustrated, inactive, or has not received value. |
| Scale beyond 20 | Repeatable activation and support burden are understood | Activation is based on unreliable data or support is unsustainable. |

## Known Constraints to Revisit

- GitHub Pages is static; backend work must remain in Firebase Functions/Firestore.
- No staging Firebase project is configured yet.
- Mobile action telemetry requires coordination with the external Flutter repository.
- App Check/abuse controls are not currently enabled.
- Resend configuration must be verified before transactional program email is used.
- Existing cost data and calculator result freshness wording require source-date review.
- No deployment, merge, push, outreach, paid campaign, or new public authority claim occurs without required approval.
