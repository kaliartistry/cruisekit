# Account deletion and MyCrew release handoff

## Shipped in this branch

- Public `/account-deletion` instructions for **MyDay by CruiseKit**, including
  an email path for users who cannot access the app.
- Updated `/privacy` language for anonymous, Google, and Apple authentication;
  Firebase Auth, Firestore, Analytics, and Crashlytics; local planning data;
  MyCrew; support/deal requests; processors; retention; and deletion.
- Website analytics consent that defaults `analytics_storage` to denied and
  loads Google Analytics only after opt-in. The control persists only the
  `granted` or `denied` choice and can be reopened from `/privacy`.
- Authenticated `deleteUserAccount` callable. It requires
  `{ confirmation: "DELETE" }`, deletes account-owned Firestore data and lead
  requests, removes MyCrew location/messages/membership, transfers a non-empty
  owned group, deletes an empty owned group, and deletes Firebase Auth last.
- Authenticated `findGroupByInvite` callable. It accepts a normalized
  six-character `inviteCode` and returns only:
  `{ id, name, cruiseLineId, shipName, departureDate, isMember }`.
- Member-only direct reads for `groups/{groupId}`. The existing self-join write
  constraint remains in place.
- Static `/mycrew/join?code=ABC123` handoff and iOS Universal Link association
  for `8FCKSS2JB5.com.cruisekit.mobile`.

## Required deployment order

The repository changes are complete, but deployment must be coordinated to
avoid breaking the currently released mobile join flow.

1. Deploy the new Firestore collection-group index, then the callable functions:

   ```bash
   firebase deploy --only firestore:indexes,functions:findGroupByInvite,functions:deleteUserAccount
   ```

2. Publish the static website so `/account-deletion`, `/mycrew/join`, the AASA
   file, privacy changes, consent control, map assets, and port-timezone data are
   live before the mobile candidate is distributed.
3. Verify live website assets and both callables. Exercise invite lookup,
   self-join, deletion, and surviving-member group access with test accounts
   while the existing group-read rule remains compatible with store build
   1.0.14.
4. Release the mobile build that uses `findGroupByInvite` and the in-app
   `deleteUserAccount` confirmation flow. Use staged rollout and monitor adoption.
5. Only after 1.0.15 reaches 100% rollout and Kali approves an adoption/grace
   threshold, deploy the member-only Firestore rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

   Older builds use direct invite lookup, so deploying these rules earlier
   breaks their create/join flow.

Deploys require Kali's explicit approval under the repository approval gates.

## Post-deploy checks

- `https://cruisekit.app/account-deletion` names MyDay by CruiseKit and has a
  working support email path.
- `https://cruisekit.app/.well-known/apple-app-site-association` returns the
  extensionless JSON file without a redirect and is also reachable on `www` if
  that hostname remains in use.
- A non-member direct Firestore read of a group is denied; an authenticated
  callable lookup followed by the existing self-join update succeeds.
- Deleting an account with no groups succeeds; deleting an organizer with
  remaining members transfers organizer role in both the top-level fields and
  `members[]`; deleting a sole-member organizer removes the empty group.
- Google Analytics network requests do not occur before opt-in. Declining or
  changing the choice to denied stops subsequent CruiseKit analytics events.

## Remaining console-dependent Android step

Do **not** publish `/.well-known/assetlinks.json` until the SHA-256 certificate
fingerprint from Google Play App Signing is verified. The package name alone is
not sufficient. After Kali confirms the Play App Signing certificate, add the
verified statement for `com.cruisekit.mobile`, test it with Google's Digital
Asset Links endpoint, and then enable the Android intent filter.
