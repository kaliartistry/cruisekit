# CruiseKit Lead Email Automation

The mobile app writes high-intent deal requests to Firestore at
`dealLeadRequests/{requestId}`. The Firebase Function in `functions/index.js`
turns each new request into email:

1. Internal notification to `info@cruisekit.app`.
2. Customer receipt from `CruiseKit <info@cruisekit.app>`.
3. Firestore status update on the original lead document.

## Runtime

- Firebase Cloud Functions 2nd gen
- Firestore `onDocumentCreated` trigger
- Resend for outbound email
- Secret Manager for `RESEND_API_KEY`

## Required Manual Setup

### 1. Firebase Billing

Cloud Functions requires the Firebase project to support paid Google Cloud
services. Upgrade `cruisekit-app` to Blaze if it is not already on Blaze.
Small beta usage should remain inside the no-cost Cloud Functions allowance, but
the project needs billing enabled to deploy and run the function.

Set budget alerts in Google Cloud Billing before launch:

- `$5`
- `$10`
- `$20`

Budget alerts notify; they do not hard-cap usage.

### 2. Resend Domain

Create a Resend account and add the domain:

```text
cruisekit.app
```

Resend will provide DNS records for SPF/DKIM, and optionally DMARC. Add those
records in Squarespace Domains. Once the domain is verified, the function can
send from:

```text
CruiseKit <info@cruisekit.app>
```

### 3. Firebase Secret

Create a Resend API key, then store it in Firebase Secret Manager:

```bash
firebase functions:secrets:set RESEND_API_KEY --project cruisekit-app
```

Paste the Resend API key when prompted.

### 4. Optional Function Environment

Defaults are already production-safe:

```text
LEAD_EMAIL_TO=info@cruisekit.app
LEAD_EMAIL_FROM="CruiseKit <info@cruisekit.app>"
LEAD_EMAIL_SEND_CUSTOMER_CONFIRMATION=true
```

If these need to change, add `functions/.env.cruisekit-app` locally. Do not
commit real environment files.

## Deploy

Run checks:

```bash
pnpm functions:lint
pnpm test:rules
```

Deploy rules and functions:

```bash
firebase deploy --only firestore:rules,functions --project cruisekit-app
```

Deploy only the email function:

```bash
firebase deploy --only functions:emailDealLeadRequest --project cruisekit-app
```

## Internal Lead Dashboard

The internal lead queue lives at:

```text
/internal/leads
```

Build or run the web app with internal tools enabled:

```bash
NEXT_PUBLIC_ENABLE_INTERNAL_TOOLS=true pnpm --filter web dev
```

Production GitHub Pages builds publish only this lead dashboard by setting:

```text
NEXT_PUBLIC_ENABLE_LEAD_DASHBOARD=true
```

The dashboard reads `dealLeadRequests`, filters by funnel status, opens source
booking links, and lets an admin mark leads as contacted, booked, lost, or
archived. It also stores a private `internalNote` on the lead document, can
retry failed Resend notifications through `retryDealLeadEmail`, and can send
customer replies from `info@cruisekit.app` through `sendDealLeadReply`.

Access is controlled by Firestore, not just the hidden route. A user must have a
document at:

```text
adminUsers/{firebaseAuthUid}
```

The client can read its own admin marker, but only trusted Admin SDK or console
operations can create or edit those documents.

## Firestore Status Fields

When the function succeeds, it updates the lead document:

- `status: "email_sent"`
- `notifiedAt`
- `notificationTo`
- `resendNotificationId`
- `customerConfirmationSent`
- `resendConfirmationId` when a customer receipt was sent

When sending fails, it updates:

- `status: "email_failed"`
- `emailFailedAt`
- `emailError`

When an admin retries a failed email from `/internal/leads`, the callable
function writes:

- `emailRetryRequestedAt`
- `emailRetryRequestedBy`
- `emailRetriedAt`
- `emailRetryCount`

When an admin sends a customer reply from `/internal/leads`, the callable
function writes:

- `status: "contacted"`
- `contactedAt`
- `lastCustomerReplyAt`
- `lastCustomerReplyBy`
- `lastCustomerReplyPreview`
- `lastCustomerReplyResendId`
- `customerReplyCount`

These fields are written by the Admin SDK and are intentionally not allowed in
client-created payloads.
