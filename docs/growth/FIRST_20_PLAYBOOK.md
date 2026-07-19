# CruiseKit First 20 Playbook

Status: operating guide for a small, concierge-style learning cohort. This is not a mass-acquisition or automated marketing program.

## Who Qualifies

A strong Founding 20 candidate:

- Has a real upcoming sailing with enough lead time to use CruiseKit before departure.
- Can provide a cruise line, ship, and departure date, or is willing to complete that information during onboarding.
- Has a genuine planning need around cost, daily organization, ports, group coordination, packing, or a drink package.
- Consents to program-specific contact and understands that applying does not equal acceptance.
- Is willing to offer honest feedback before, during, or after the sailing.

Deprioritize applicants without a real upcoming sailing, duplicate/spam submissions, people seeking booking, price guarantees, payment, or services CruiseKit does not provide, and any applicant who does not consent to program contact.

## Recruitment Rules

- Use only approved channels and approved messages.
- Do not send DMs, email, creator outreach, paid promotion, or community posts without Kali’s exact approval for the recipient/channel and message.
- Do not promise payment, revenue share, special cruise pricing, booking assistance, guaranteed acceptance, or outcomes not available in the product.
- Do not use private group data, scrape private profiles, or import contacts into a marketing list.
- Keep referral partners to aggregate reporting; never disclose traveler identities, itineraries, spending, or crew details.

Recruitment sources may include a personal invitation, approved advisor/creator/captain links, existing users, and public organic pages. Record source, campaign, referral code, landing page, and date in the Growth Console.

## Applicant Review

### Initial review within two business days

1. Confirm the required fields are present and consent is recorded.
2. Review upcoming-sailing reality and approximate departure window.
3. Check for duplicate applications without merging or overwriting the original record.
4. Set the status to `New`, then `Reviewed` with a factual founder note.
5. Decide whether the candidate is a fit for a concierge session, a self-serve trial, waitlist, or decline.

### Status pipeline

Use only these Founding 20 statuses:

```text
New -> Reviewed -> Contacted -> Scheduled -> Onboarded -> Activated
                                      |                 |
                                      v                 v
                                  Declined       Sailing completed -> Interview completed
```

`Activated` is product-derived, not a manually optimistic label. See [ANALYTICS_SPEC.md](ANALYTICS_SPEC.md).

## Onboarding Flow

### Before the session

- Confirm a contact method and the program-contact consent.
- Ask the traveler to bring the fare or booking information they are comfortable using. Do not ask for payment details.
- Prepare the calculator and the real sailing record; do not create a synthetic date or placeholder ship just to complete the flow.
- Verify the journey is mobile-friendly and that app handoff instructions match the current app links.

### Concierge session (20–30 minutes)

1. Restate the scope: CruiseKit is an independent planning companion, not a booking engine or cruise-line replacement.
2. Enter or validate the real upcoming sailing.
3. Complete a true-cost calculation using traveler-provided assumptions.
4. Save the real sailing only when the traveler confirms the ship/date context.
5. Demonstrate the most relevant next action: a budget/spend setup, port/day plan, MyCrew invite, or MyDay handoff.
6. Confirm that the traveler knows how to return to the saved sailing and how to request help.
7. Ask which moment felt most useful and capture only a short internal summary.

### Follow-up cadence

| Timing | Purpose |
| --- | --- |
| Within 24 hours of onboarding | Confirm access, answer a blocker, and restate the next useful action. |
| 7–14 days before departure | Ask whether the cost plan or daily plan needs an update. |
| During sailing, only if invited/appropriate | Ask one low-effort feedback question; do not interrupt travel. |
| 3–7 days after return | Request an interview; ask for a review only after demonstrated value. |

Respect an applicant’s preferred contact method and stop contacting anyone who withdraws consent.

## What to Observe

Track observable product behavior and reported friction, not assumptions about intent:

- Whether they can complete the calculator without help
- Whether the saved sailing is real and retrievable
- Whether they understand the difference between planning estimates and a booking quote
- The first meaningful action after saving
- Time from first contact to activation
- Whether app handoff works for their platform
- Whether they invite a crew member and what stopped them if not
- Confusion, errors, missing data, or unsupported expectations
- Support time required per user

Record short factual notes in the protected console. Never copy notes into GA4 or referral reports.

## Activation Classification

Mark activation only when the system records both:

1. A validated real upcoming sailing saved/submitted; and
2. At least one qualifying value event, such as calculator completion, budget change, spend action, port/day plan, MyCrew invitation sent/accepted, or real MyDay use.

The following do **not** count by themselves: page view, download, store click, email application, account creation, invitation open, or staff contact.

If the user has value actions but no validated real sailing, keep the candidate as onboarded or engaged—not activated—and record the missing step for follow-up.

## Asking for Feedback and a Review

### Feedback

Ask for feedback at a natural value moment:

- After the first true-cost result is used in a decision
- After a saved sailing is reopened successfully
- After a port/day plan or MyCrew action solves a real coordination problem
- After the cruise, during a voluntary interview

Use open questions. Do not lead with a positive claim or ask users to publicly endorse an unfinished experience.

### Review

Ask only after demonstrated value and after checking that the person is not in an unresolved support state. The request must be optional, non-incentivized unless separately approved, and free of rating language. Record `review_prompt_displayed`; do not record the review’s contents in analytics.

## Closing the Loop

Every interview, support issue, and user-reported problem ends with one of:

- Fixed or shipped
- Added to a prioritized backlog
- Explained as a known limitation
- Declined with a reason

At the weekly review, identify the three largest repeated frictions, assign an owner, and report back to affected users when there is a meaningful update. The goal of the first 20 is learning quality, not volume.

## Privacy and Deletion

The program collects only what is required to support the traveler. Applications, notes, and contact details stay in protected operations records. A participant may withdraw consent or request deletion through `info@cruisekit.app`; record the request, remove/anonymize the relevant growth records, and confirm completion under the documented manual process.
