# CruiseKit Growth Engine V1 Analytics Specification

Status: proposed contract. Event names in this document are the V1 target names; current GA4 event names remain compatibility inputs until implementation migrates them deliberately.

## Principles

- Track product learning, not personal details.
- GA4 is the current adapter; product code calls a vendor-neutral analytics interface.
- A browser event is useful for funnel analysis, but trusted server/domain events determine saved-sailing and activation state.
- Do not put email, phone, name, cabin number, private notes, payment data, raw location history, or full URLs with user-entered values in analytics.
- Send no raw Firebase UID to third-party analytics. Internal durable events may link a UID only in protected Firestore data.

## Identity and Attribution

### Identifiers

| Identifier | Use | Storage | Privacy rule |
| --- | --- | --- | --- |
| `anonymous_id` | Stable browser visitor assignment and funnel stitching | First-party local storage | Random opaque ID; no PII encoded in it. |
| `growth_profile_id` | Durable internal identity | Firestore, server-written | Random opaque ID or protected UID linkage. |
| `user_id` | Known authenticated identity | Protected Firestore only | Firebase UID is never sent as an analytics event property to GA4. |
| `referral_code` | Partner/campaign attribution | Query context and protected event data | Opaque, random, revocable; no sequential ID. |

### Attribution record

Persist both of these records before a conversion whenever storage is available:

```text
first_touch: immutable first eligible landing context
last_touch: most recent eligible landing context before conversion
```

Each record contains only:

```text
landing_path
utm_source
utm_medium
utm_campaign
utm_content
utm_term
referral_code
referral_type (when resolved)
captured_at
```

Values must be normalized, allowlisted where appropriate, and length-limited. Use a path rather than a complete URL so accidental query-string PII is not stored. Capture query parameters from `utm_*`, `ref`, and `referral_code`; `referral_code` takes precedence when both are supplied and resolve to different values only after server-side validation.

When a visitor signs in, link the anonymous profile to the authenticated profile without overwriting first touch. Preserve the attribution record across calculator completion, application, saved sailing, store click, and invitation flows.

## Standard Context

Every Growth Engine event includes the following when available:

| Property | Notes |
| --- | --- |
| `event_name` | One of the event names in this specification. |
| `occurred_at` | Client or server timestamp; server timestamp wins for durable conversion state. |
| `anonymous_id` | Opaque browser ID. |
| `growth_profile_id` | Internal only when linked. |
| `campaign` | Normalized UTM campaign. |
| `referral_code` | Opaque code only. |
| `landing_page` | Path, not full URL/query. |
| `device_category` | `mobile`, `tablet`, or `desktop`. |
| `platform` | `web`, `ios`, or `android` where known. |
| `experiment_id` / `experiment_variant` | Only for exposed experiments. |
| `sailing_departure_window` | Coarse window such as `0_30_days`, `31_90_days`, `91_180_days`, `181_plus_days`, or `unknown`. |

Do not include form answers other than non-sensitive categorical values needed for aggregate reporting, and never include a free-text field in an analytics event.

## Event Taxonomy

| Event | Trigger | Minimum useful properties | Durable source of truth |
| --- | --- | --- | --- |
| `landing_page_viewed` | Eligible Growth Engine landing page becomes visible | standard context, `page_type` | Analytics adapter only unless needed for aggregate server counts. |
| `founding20_application_started` | User focuses/advances in Founding 20 form | standard context | Analytics adapter only. |
| `founding20_application_submitted` | Valid Function submission succeeds | standard context, `application_id` internal only | `growthApplications` server write. |
| `calculator_started` | Visitor makes the first calculator-progress action | standard context, `calculator_context` | Analytics adapter only. |
| `calculator_completed` | Result is rendered after a valid calculation | standard context, `has_manual_fare`, `cost_categories_count` | Event ledger if used for activation. |
| `calculator_result_shared` | Native/share-card export succeeds | standard context, `share_method`, `amounts_hidden` | Analytics adapter only. |
| `sailing_save_started` | User chooses save-to-sailing | standard context | Analytics adapter only. |
| `sailing_saved` | A validated real upcoming sailing is persisted | standard context, `sailing_source` | Trusted saved-sailing write/trigger. |
| `store_link_clicked` | App Store or Google Play link is chosen | standard context, `store` | Analytics adapter only. |
| `activation_completed` | Server derives activation for the first time | standard context, `qualifying_event` | `growthProfiles` server write. |
| `mycrew_invite_created` | A real invite is created | standard context | Mobile/web domain write. |
| `mycrew_invite_sent` | An invite link is actually sent/shared | standard context, `share_method` | Mobile/web domain action. |
| `mycrew_invite_accepted` | A recipient joins successfully | standard context | Trusted membership update. |
| `captain_application_submitted` | Valid Captain application succeeds | standard context | `growthApplications` server write. |
| `advisor_application_submitted` | Valid Advisor application succeeds | standard context | `growthApplications` server write. |
| `creator_application_submitted` | Valid Creator application succeeds | standard context | `growthApplications` server write. |
| `feedback_submitted` | Valid feedback is submitted | standard context, `feedback_stage` | Protected feedback/application update. |
| `review_prompt_displayed` | Review prompt is shown after demonstrated value | standard context, `prompt_reason` | Analytics adapter only. |
| `experiment_variant_viewed` | Eligible experiment variant is rendered | standard context, `experiment_id`, `experiment_variant` | Client exposure event; assignment persisted first-party. |

### Compatibility mapping

Current event names should remain available only long enough to preserve historical reporting:

| Current name | V1 name |
| --- | --- |
| `result_shared` | `calculator_result_shared` |
| `save_cruise_started` | `sailing_save_started` |
| `save_cruise_completed` | `sailing_saved` after real-sailing validation |
| `app_store_click` / `google_play_click` | `store_link_clicked` with `store=app_store` or `store=google_play` |

`mycrew_invite_opened` may remain as a supplemental diagnostic event, but it does not replace the required create, sent, or accepted events.

## Activation Logic

### Qualifying events

The following are meaningful value events:

- `calculator_completed`
- `cruise_budget_updated`
- `spend_recorded`
- `spend_prepared`
- `port_day_planned`
- `sailing_day_planned`
- `mycrew_invite_sent`
- `mycrew_invite_accepted`
- `myday_used`

The first five beyond the required public taxonomy are domain events used only to calculate activation; they must be defined in the shared mobile/web contract before mobile instrumentation begins.

### Derived-state rule

```text
activation_completed when:
  real_upcoming_sailing_saved == true
  AND qualifying_value_events.length >= 1
  AND activated_at is null
```

Rules:

1. A generic calculator snapshot, placeholder ship, or synthetic future date is not a real upcoming sailing.
2. The qualifying action may occur before or after the real sailing is saved; activation occurs once both conditions are true.
3. The server records the first qualifying event and timestamp. Later actions do not create duplicate activations.
4. A page view, app-store click, email submission, application submission, or invitation-open does not qualify by itself.

## Provider Interface

The application should call a small interface conceptually equivalent to:

```text
track(eventName, context)
identify(anonymousId, knownProfile)
```

The GA4 adapter maps safe fields to `gtag`. A durable server/event adapter records only conversion and domain events needed by the Growth Console. Both adapters must fail open: analytics failures cannot block calculator use, applications, sign-in, or saved-sailing writes.

## Privacy, Retention, and Deletion

- Keep application PII in `growthApplications`, not `growthEvents`.
- Store founder notes only in the protected application/console record.
- Store a program-contact consent timestamp and disclosure version with each submitted application.
- Do not use program consent for unrelated marketing.
- A deletion request sent to `info@cruisekit.app` must remove or anonymize the applicant record, linked growth profile, and event records that can identify the person, while retaining non-identifying aggregate counts where lawful and necessary.
- Document the manual deletion steps and fulfillment date in the Growth Console or an internal operations log.

## Verification Checklist

- Verify all event names and properties against this document before release.
- Test anonymous first touch, later last touch, and post-sign-in identity linking.
- Verify a UTM/referral survives calculator completion, application, saved sailing, store click, and invitation journey.
- Verify no email, phone, free text, UID, or private sailing details appear in GA4 requests.
- Verify activation fires once and only after both required conditions are met.
- Verify mobile event producers use the same event names and coarse departure-window rules.
