# CruiseKit Firestore Security Audit

**Project:** `cruisekit-app`
**Scope:** Both apps that share the `cruisekit-app` Firebase project — the Next.js web app in this repo and the Flutter mobile app at `~/CruiseKit-Mobile`. Both audits are reflected in the single [`firestore.rules`](../firestore.rules) deployed to the project.

---

## Audit (web repo)

### Firestore call sites

| # | File | Operation | Path |
|---|---|---|---|
| 1 | [apps/web/lib/firebase/auth.tsx:59](../apps/web/lib/firebase/auth.tsx#L59) | `setDoc({merge:true})` | `users/{uid}` |
| 2 | [apps/web/lib/firebase/auth.tsx:60-75](../apps/web/lib/firebase/auth.tsx#L60) | `setDoc({merge:true})` (idempotent `createdAt`) | `users/{uid}` |
| 3 | [apps/web/components/shared/heart-button.tsx:63](../apps/web/components/shared/heart-button.tsx#L63) | `getDoc` | `users/{uid}/savedDeals/{dealId}` |
| 4 | [apps/web/components/shared/heart-button.tsx:83](../apps/web/components/shared/heart-button.tsx#L83) | `setDoc` | `users/{uid}/savedDeals/{dealId}` |
| 5 | [apps/web/components/shared/heart-button.tsx:98](../apps/web/components/shared/heart-button.tsx#L98) | `deleteDoc` | `users/{uid}/savedDeals/{dealId}` |
| 6 | [apps/web/app/my-trips/page.tsx:234](../apps/web/app/my-trips/page.tsx#L234) | `getDocs` | `users/{uid}/savedDeals` |
| 7 | [apps/web/app/my-trips/page.tsx:265](../apps/web/app/my-trips/page.tsx#L265) | `deleteDoc` | `users/{uid}/savedDeals/{dealId}` |

No `query/where/orderBy`, no `onSnapshot`, no transactions, no batches, no `collectionGroup`, no Admin SDK, no `app/api/` routes, no Cloud Functions.

### Collection map (web)

| Collection | Type | Read by | Written by | Notes |
|---|---|---|---|---|
| `users/{uid}` | user-owned | client (owner only) | client (owner only) | Profile doc; created on Google sign-in. Fields: `displayName`, `email`, `photoURL`, `createdAt`, `lastLoginAt`. |
| `users/{uid}/savedDeals/{dealId}` | user-owned | client (owner only) | client (owner only) | Saved cruise deals. Variable-shape payload of cruise metadata + `savedAt`. |

### Auth pattern
- Firebase init at [apps/web/lib/firebase/config.ts](../apps/web/lib/firebase/config.ts). Auth + Firestore only (no Storage / Functions / RTDB).
- Provider: Google OAuth only (live). Apple is a disabled "Coming soon" placeholder.
- Every Firestore call site is auth-gated. No unauthenticated reads exist in this repo.
- `request.auth.uid` is reliably present on every web call.

### What's NOT in the web repo
- No public-reference, admin-only, or shared-collaborative collections.
- No client writes to reference data — all cruise/port/ship/deal data ships via static imports from `apps/web/lib/data/*.ts` and is bundled at build time. **No Admin SDK seed scripts are required.** Future contributors should not reintroduce client-side writes to reference data.
- No group / shared-trip Firestore yet. The `/groups` page is a stateless calculator with React-state-only inputs.

### Cross-repo dependency
The mobile repo (`~/CruiseKit-Mobile`) has an active Firestore group system for the MyDay pillar. Its rule fragment is merged into [`firestore.rules`](../firestore.rules) — see the next section.

---

## Audit (Flutter mobile repo)

### Firestore call sites

All Flutter Firestore traffic is concentrated in [`group_service.dart`](file:///Users/kaliartistry-mac/CruiseKit-Mobile/lib/services/group_service.dart) and the providers that consume it. No client touches `users/` or `savedDeals/` from Flutter — those are web-only collections. Three top-level operations reach Firestore:

| Operation | Path | Mode |
|---|---|---|
| Create / lookup / join / leave / kick / metadata stream / "my groups" query | `groups/{groupId}` (and the `groups` collection) | `add`, `where`, `update`, `get`, `snapshots` |
| Per-member presence | `groups/{groupId}/locations/{userId}` | `set(merge:true)`, `delete`, `snapshots` |
| Crew chat | `groups/{groupId}/messages/{msgId}` | `add`, `orderBy + limitToLast(100).snapshots` |

No Cloud Functions, no Firebase Storage, no Realtime Database. Firebase Auth uses anonymous sign-in on cold start with upgrade-to-Google for any group features (Apple is referenced in UI copy but not yet wired).

### Collection map (Flutter)

| Collection | Type | Read by | Written by | Notes |
|---|---|---|---|---|
| `groups/{groupId}` | shared-collaborative | any signed-in user (see read-leak note) | organizer (create/kick/metadata), self-join, self-leave | Top-level fields: `name`, `organizerId`, `organizerName`, `inviteCode`, `createdAt`, `cruiseLineId?`, `shipName?`, `departureDate?`, `memberUserIds: string[]`, `members: {userId, name, role, joinedAt}[]`. Source of truth for membership is `memberUserIds`. |
| `groups/{groupId}/locations/{userId}` | per-member presence | group members only | self only (doc id == uid); organizer can delete on kick | Fields: `lat`, `lng`, `whereabouts`, `quickStatus?`, `distanceFromShipMeters?`, `lastUpdated`. |
| `groups/{groupId}/messages/{msgId}` | group chat | group members only | members only with `senderId == auth.uid` | Fields: `senderId`, `senderName`, `text`, `timestamp`. Append-only — no update or delete. |

### Group access pattern

- **Membership** is tracked in two parallel arrays on `groups/{groupId}`:
  - `memberUserIds: string[]` — source of truth for the rules' `isGroupMember` helper.
  - `members: {userId, name, role, joinedAt}[]` — display-only shape; `role` and `name` are presentational, not authority-bearing. Rules deliberately do not validate the contents of this array.
- **Join flow**: a non-member queries `groups` collection with `where('inviteCode', isEqualTo: code).limit(1)`, then runs an `arrayUnion` update adding themselves to `memberUserIds` and `members`.
- **Leave flow**: a member runs an `arrayRemove` update on themselves, then deletes their own `locations/{uid}` doc.
- **Kick flow**: organizer (only) runs `arrayRemove` on the target uid in both arrays and deletes the target's `locations/{uid}` doc.

### Auth pattern (Flutter)

All group operations require `_auth.currentUser?.uid` and the UI gates group features behind `isLinked` (i.e., upgraded out of anonymous to Google). `request.auth.uid` is reliably present on every Firestore call that reaches a group collection. Rules also block any anonymous user implicitly because the group create/update rules require the writer to match an authenticated UID.

---

## Ruleset rationale

### `users/{uid}`
Owner-only read. Create whitelists exactly the five expected fields so arbitrary payloads can't sneak in. Update uses `diff().affectedKeys().hasOnly(...)` to keep `createdAt` immutable and to require a deliberate rule change before any new field can be written. Delete is denied — user-deletion belongs in an Admin SDK flow that hasn't been built yet.

### `users/{uid}/savedDeals/{dealId}`
Owner-only CRUD. Validation is intentionally light: `savedAt` must be a string, `fromPrice` must be a number, and the field count is capped at <30 as a sanity guard. The deal payload shape is intentionally loose because cruise-line data varies, and over-constraining it costs more in churn than it gains in safety.

### Default deny
The trailing `match /{document=**} { allow read, write: if false; }` is the safety net. Anything not explicitly allowed above is rejected. There are no `request.time` expirations anywhere — that pattern is the Test Mode trap we're escaping.

### `groups/{groupId}` (Flutter)
Reads are open to any signed-in user; subcollections (`locations`, `messages`) are gated to members. This is a **deliberate compromise** — see [Known follow-ups](#known-follow-ups) for the reasoning. Create requires `organizerId == auth.uid` and that the organizer be present in `memberUserIds`. Updates fall into three valid shapes: organizer-mutates-metadata (everything except `organizerId` and `inviteCode`), self-join (exactly one element appended to `memberUserIds`, must be self), or self-leave (exactly one element removed, must be self). Delete is denied — the Flutter code has no group-delete flow, so there's no legitimate caller.

### `groups/{groupId}/locations/{userId}`
Reads gated by group membership via the `isGroupMember` helper that consults the parent doc's `memberUserIds`. Writes gated by both membership AND `userId == auth.uid` so users can only update their own dot on the map. Deletes are allowed for the user themselves (leave flow) or the organizer (kick flow).

### `groups/{groupId}/messages/{messageId}`
Append-only. Members can read; members can create with `senderId == auth.uid` and `text.size() < 5000` to cap payload; nobody can update or delete (Flutter has no edit-message flow). The size cap is a sanity guard against pathological payloads, not a strict UX constraint.

---

## How to add a new collection

1. Add a row to the collection map above.
2. Edit `firestore.rules` with an explicit owner / member / public-reference rule, sitting above the default-deny block.
3. Add test cases to `firestore.rules.test.ts` covering owner / non-owner / unauthed access.
4. Run `pnpm test:rules` and confirm all green.
5. Open a PR. Reviewer should sanity-check the rule against the collection map.
6. Once merged, redeploy: `firebase deploy --only firestore:rules`.

---

## Deployment

### Hard gate
~~Do not deploy until the mobile audit's rule fragment is merged here and tested.~~ **Resolved 2026-04-25.** The mobile audit is reflected in [`firestore.rules`](../firestore.rules) and covered by tests in [`firestore.rules.test.ts`](../firestore.rules.test.ts). All 46 rule assertions pass against the Firestore emulator.

### Pre-deploy checklist
- [x] All `pnpm test:rules` cases pass (46 / 46, web + mobile combined)
- [x] Combined `firestore.rules` reflects both audits
- [x] This audit doc updated with the mobile-side findings
- [x] `.gitignore` covers service-account JSONs (`*service-account*.json`, `*-firebase-adminsdk-*.json`)
- [ ] User has explicitly approved the deploy command

### Deploy command
```bash
firebase deploy --only firestore:rules
```

### Deploy record
_To be filled in when the deploy happens._

| Date | Release ID | Deployed by | Notes |
|---|---|---|---|
| | | | |

### Post-deploy smoke tests (Console → Firestore → Rules Playground)

| # | Scenario | Expected |
|---|---|---|
| 1 | Unauthed read of `users/anyDoc` | DENY |
| 2 | Authed (uid=A) read of `users/A` | ALLOW |
| 3 | Authed (uid=A) read of `users/B` | DENY |
| 4 | Unauthed read of `users/A/savedDeals/x` | DENY |
| 5 | Authed (uid=A) read of `users/A/savedDeals/x` | ALLOW |
| 6 | Authed (uid=A) write to `randomCollection/foo` | DENY |

Document the actual results next to each row when running them.

### Live smoke test (post-deploy)
- Sign into [cruisekit.app](https://cruisekit.app) with Google.
- Save a deal via the heart button → confirm `users/{uid}/savedDeals/{id}` write succeeds.
- Open `/my-trips` → confirm saved deal renders.
- Unsave the deal → confirm delete succeeds.
- Watch browser console + Firebase Console → Firestore → Usage for unexpected `permission-denied` errors over 30 minutes.
- Run the analogous flow in the Flutter app (MyDay / MyCrew).

---

## Known follow-ups

- **User-deletion flow** — rules deny client deletes on `users/{uid}`. When the product needs account deletion, build an Admin-SDK-backed Cloud Function or admin endpoint.
- **Apple OAuth** — when implemented, no rule change is needed (`request.auth != null` is provider-agnostic).
- **Field validation depth** — kept minimal. Tighten only if a real abuse pattern emerges.
- **`groups/{groupId}` read-leak (open to any signed-in user).** The Flutter join flow runs `where('inviteCode', isEqualTo: code).limit(1).get()` BEFORE the user is in `memberUserIds`. A strict member-only read rule would break joining, and Firestore rules can't introspect `where`-clause contents to scope an exception. Group IDs are 20-char auto-IDs and invite codes are 6-char from a 32-char alphabet (~1B combinations), so direct enumeration is impractical, but a determined signed-in attacker could brute-force invite codes if they had unlimited requests. The proper fix is one of:
  1. Move invite lookup to a separate `groupInvites/{inviteCode}` collection (small, just stores `groupId`); allow signed-in reads only on that collection. Then lock `groups/{groupId}` reads to members.
  2. Replace the client-side join with a Cloud Function that runs as admin, validates the code, and adds the user.
  Both require Flutter code changes + a backfill migration; deferred from this rules deploy. Track separately.
- **`members[]` array contents not validated.** The rule only checks `memberUserIds` size deltas on join/leave; it does not enforce that the appended `members` element has `userId == auth.uid` or `role == 'member'`. `role` is display-only — actual authority comes from the immutable `organizerId`, so tampering is cosmetic. If `role` ever becomes authority-bearing, tighten this.
