# Retired CruiseKit Deal-Help Email Automation

The personal "Ask MyDay for Help" offer was retired on 2026-07-14 before
CruiseKit had enough traffic or revenue to justify an operator-assisted sales
workflow.

The retirement intentionally:

- removes the contact/request form from the mobile deal handoff;
- denies all new `dealLeadRequests` client creates;
- removes the Resend dependency and the `emailDealLeadRequest`,
  `retryDealLeadEmail`, and `sendDealLeadReply` Cloud Functions;
- removes retry and reply controls from the internal dashboard; and
- preserves existing Firestore records as a read-only historical queue, with
  the existing admin-only status/note controls and account-deletion cleanup.

Do not redeploy the removed functions or re-enable client creation without a
new product decision, a staffed response process, updated privacy copy, and an
approved outbound-email provider.
