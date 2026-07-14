# Email Capture Scope - 2026-06-14

## Status

Scoped only. No email capture implementation was added.

## Existing Backend And Privacy State

Existing email-related infrastructure:

- Firebase Cloud Functions in `functions/index.js`.
- Resend dependency in `functions/package.json`.
- Existing lead email automation docs: `docs/lead-email-automation.md`.
- Internal lead dashboard: `apps/web/app/internal/leads/lead-dashboard.tsx`.

Existing privacy posture:

- `apps/web/app/privacy/page.tsx` states CruiseKit does not sell data and does not share personal information with third parties for marketing.
- `apps/web/app/how-we-make-money/page.tsx` states the site is not monetized through email sponsorships or brand placements.

## Recommendation

Do not add broad marketing email capture until the privacy policy, consent model, storage location, unsubscribe process, retention plan, and email provider configuration are reviewed.

If email capture is approved later, start with a narrow calculator result email feature:

- User explicitly enters email.
- Clear purpose: send this estimate or save this trip.
- No pre-checked marketing consent.
- Separate optional checkbox for product updates.
- Store consent timestamp and source.
- Add unsubscribe process before sending marketing email.

## Approval Gate

Ask for approval before implementation because email capture changes privacy, consent, storage, and compliance scope.
# Historical note

The personal deal-help capture and its Resend automation were retired on
2026-07-14. This document is retained only as a record of the earlier scope.
