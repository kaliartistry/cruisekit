# CruiseKit Growth Engine V1 Launch Checklist

Status: release gate. Completion of a checkbox means evidence was reviewed; it does not authorize deployment, outreach, or production changes without Kali’s approval.

## 1. Product and Content

- [ ] `/founding-20` is mobile-first, accessible, and uses the approved Founding 20 message.
- [ ] Application collects only first name, email, optional phone, cruise line, ship, departure date, travelers, experience level, concern, platform, and program-contact consent.
- [ ] Application success state says “received” and does not claim acceptance.
- [ ] `/captains`, `/advisors`, and `/creators` use the approved positioning and avoid payment, revenue-share, replacement, partnership, or authority claims.
- [ ] Calculator remains usable before sign-in and has no fabricated default price presented as a real quote.
- [ ] Any public price has a source and accurate last-verified date; freshness text does not imply a newer review date.
- [ ] Calculator result includes save-to-sailing, continue, Founding 20, and sharing flows; the share card supports hidden amounts.
- [ ] A saved sailing is validated as real/upcoming before it can contribute to activation.

## 2. Data, Security, and Privacy

- [ ] All public form writes go through a Firebase Function; no unauthenticated Firestore collection is opened solely for convenience.
- [ ] Function validates field shape, allowed enums, sizes, consent, and sanitizes/rejects hostile values.
- [ ] Honeypot and rate limiting are tested. Rate limits use a non-reversible, salted key rather than retained raw IP addresses.
- [ ] New Firestore collections are default-deny or admin-only unless a client permission is explicitly documented and tested.
- [ ] `adminUsers/{uid}` authorization is verified in each privileged Function and console path.
- [ ] Referral codes are random, unique, revocable, non-sequential, and do not expose user IDs.
- [ ] Analytics excludes email, phone, notes, raw Firebase UID, payment data, precise location, and private sailing details.
- [ ] Privacy disclosure explains program contact consent, retention, analytics use, and manual deletion path for unauthenticated applicants.
- [ ] Deletion playbook identifies all application/profile/event records to remove or anonymize and records fulfillment.
- [ ] No secrets, `.env` files, keys, or service-account files are staged.

## 3. Analytics and Activation

- [ ] Every V1 event in [ANALYTICS_SPEC.md](ANALYTICS_SPEC.md) has a named producer and an automated/manual verification step.
- [ ] First touch, last touch, UTM term, referral code, landing path, anonymous ID, device, platform, and experiment context survive the intended journey.
- [ ] `activation_completed` is server-derived and emits only once per profile.
- [ ] Current event-name compatibility mapping is documented and dashboard queries use the V1 canonical names.
- [ ] GA4 receives only allowed non-sensitive properties.
- [ ] A test confirms a real save plus qualifying action activates; a generic calculator snapshot, application, page view, or download does not.

## 4. Console and Operations

- [ ] Growth Console is protected with Firebase authentication and `adminUsers` authorization, not a hard-coded password or route obscurity.
- [ ] It shows the complete Founding 20 status pipeline and supports private founder notes and follow-up date.
- [ ] It filters by date, campaign, referral partner, platform, cruise line, and activation status.
- [ ] CSV export contains only approved operational fields and is restricted to admins.
- [ ] Funnel counts are sourced from documented event/data sources.
- [ ] The dashboard visibly labels first-20 sample sizes as directional.
- [ ] On-call/owner and support-response expectations are clear for the pilot.

## 5. Tests and Accessibility

- [ ] Calculator unit tests pass, including the new manual cost categories and zero/edge cases.
- [ ] Form/Function integration tests pass for valid, invalid, rate-limited, spam, and consent cases.
- [ ] Firestore rules tests cover every modified rule and all unauthorized paths.
- [ ] Admin authorization tests prove non-admin denial.
- [ ] E2E funnel passes: attributed arrival -> calculator -> result -> application or real save -> qualifying action -> activation -> console -> invitation/referral preservation.
- [ ] Keyboard navigation, labels, error announcements, focus management, loading, empty, and error states are manually checked.
- [ ] Mobile viewport checks pass on the public pages, calculator, forms, console, and share card.
- [ ] `pnpm --filter web lint`, type checking, Functions lint, rules tests, and build results are captured honestly.

## 6. Configuration Readiness

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured in the approved static-site build environment.
- [ ] Firebase Functions runtime and billing readiness are verified.
- [ ] Distinct high-entropy `GROWTH_RATE_LIMIT_SECRET` and `GROWTH_IDENTITY_SECRET` values are configured in the approved Firebase project; neither value is committed.
- [ ] Firestore TTL is configured operationally for `growthRateLimits.expiresAt`.
- [ ] `RESEND_API_KEY` and verified sending domain are configured only if transactional application email is enabled.
- [ ] Any CAPTCHA/App Check configuration is documented without committing a secret.
- [ ] iOS Universal Link and Android App Link behavior is tested for the intended handoff routes.
- [ ] The approved admin Firebase UIDs are present in `adminUsers` through a trusted operation.

## 7. Staging and Deployment

### Current blocker

The repository has only the production Firebase project alias, `cruisekit-app`. There is no configured staging Firebase project, Firebase alias, or staging deployment workflow. Do not label an emulator or production project as staging.

### Required staging setup before a real staging deploy

1. Obtain Kali approval and the intended staging Firebase project ID.
2. Add a local Firebase alias without committing credentials:

```bash
firebase use --add
```

3. Confirm the selected alias points to the approved staging project:

```bash
firebase projects:list
firebase use
```

4. Configure staging-only Function secrets/environment according to the approved provider setup. Never copy production secrets into a committed file.
5. Deploy only after review and approval:

```bash
firebase deploy --only firestore:rules,functions --project <approved-staging-project-id>
```

6. Build the static site with staging-safe public configuration, publish it to an approved non-production static host, and run the full E2E funnel there.

### Production deployment steps, only after explicit approval

1. Review the exact diff and staged files; run secret scan/review.
2. Run:

```bash
pnpm --filter web lint
pnpm --filter web exec tsc --noEmit
pnpm functions:lint
pnpm test:rules
pnpm --filter web build
```

3. Record any skipped checks and the reason.
4. Deploy rules/functions deliberately, not through the GitHub Pages workflow:

```bash
firebase deploy --only firestore:rules,functions --project cruisekit-app
```

5. Merge/push only after approval. The existing GitHub Pages workflow builds and deploys static web output from `main`.
6. Verify the live route, Function responses, admin access, GA4 event delivery, referral link, app handoff, and deletion contact path.
7. Monitor errors, Function usage, Firestore permission denials, and application spam closely during the first 48 hours.

## 8. Launch Decision

- [ ] Launch approved by Kali
- [ ] Deployment owner:
- [ ] Rollback owner:
- [ ] Support owner:
- [ ] Start time:
- [ ] First 24-hour review time:
- [ ] First weekly scorecard time:
- [ ] Known risks accepted:
