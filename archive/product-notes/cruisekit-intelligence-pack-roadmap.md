# CruiseKit Intelligence Pack Roadmap

Last updated: May 31, 2026

## Executive Summary

CruiseKit Intelligence should be an embedded signal layer, not a separate AI
destination. The product promise is simple: wherever a traveler is already
planning, CruiseKit should surface the next useful thing to understand, decide,
or fix.

The first version should be deterministic and explainable. It can feel smart
without using a generative model by combining existing CruiseKit data, user trip
state, calculator inputs, port data, saved plans, and loyalty details into
compact cards with one clear action.

The recommended first product shape is the CruiseKit Intelligence Pack: a set
of explainable planning, cost, port, MyDay, group, and loyalty insights that
appear inside the five existing pillars.

## Product Position

CruiseKit already helps travelers answer:

- What will this cruise really cost?
- Which sailing is a good fit?
- What should we do in port?
- What does today look like onboard?
- How do I keep a group coordinated?
- How do I get more value from loyalty?

CruiseKit Intelligence should answer the next question:

> Given what I know right now, what matters most next?

The pack should not be branded as a chatbot-first feature. The user should not
have to ask the right prompt. CruiseKit should recognize useful planning gaps
and bring them forward in plain English.

## Non-Negotiable Boundaries

These are product boundaries, not just implementation notes:

- No GPS navigation, walking ETAs, route finding, port-day safety, or
  return-to-ship tracking.
- No emergency, rescue, or safety assurance language.
- No cruise-line account integrations for embarkation, muster, cabin access, or
  ship Wi-Fi login.
- No in-app booking agency behavior. CruiseKit can hand off to affiliate
  partners, but it should not hold reservations or checkout.
- No hidden sponsored ranking. If a partner handoff affects availability or
  monetization, the UI needs clear disclosure.
- No real-time server dependency for core onboard MyDay utility.
- No generated claims about prices, schedules, loyalty benefits, port rules, or
  partner offers unless source evidence exists.
- No "AI says" tone. Use practical, source-backed language.

## Pack Definition

The Intelligence Pack is a product bundle made of signals, cards, surfaces, and
guardrails.

| Term | Meaning |
| --- | --- |
| Signal | A computed condition based on static data, user trip state, calculator inputs, or saved plans. |
| Card | A compact user-facing insight with one status, one reason, and one action. |
| Surface | The screen or component where a card appears, such as Home, Calculator, Cruises, Ports, My Trips, or MyDay. |
| Guardrail | A rule that blocks unsafe, misleading, unsupported, or off-brand advice. |
| Evidence | The source data shown or referenced so the card feels trustworthy. |

### Launch Pack Modules

| Module | Pillar | Purpose |
| --- | --- | --- |
| Plan Readiness | Plan | Shows the next planning gap or decision to handle. |
| True Cost Intelligence | Plan | Explains when the fare is not the full expected trip cost. |
| Deal Fit Intelligence | Plan | Helps compare a sailing against budget, duration, port mix, and data confidence. |
| Port Day Fit | Explore | Checks whether a planned port day is too thin, too full, or missing basics. |
| MyDay Brief | MyDay | Gives a calm daily overview during the cruise. |
| Spend Pace | MyDay | Compares onboard spend against the budget set before sailing. |
| Group Gaps | Coordinate | Flags missing group decisions without becoming chat. |
| Loyalty Opportunity | Optimize | Points out loyalty setup, tier, or value opportunities. |

## Experience Model

Every card should follow the same user-facing pattern:

1. One short title.
2. One concrete status or recommendation.
3. One plain-English reason.
4. One primary action.
5. One evidence line or disclosure.

Example card anatomy:

```text
Title: Your $499 fare is probably closer to $1,180
Reason: Gratuities, port fees, Wi-Fi, drinks, and one excursion add more than the fare itself for this sailing.
Action: Open true cost breakdown
Evidence: Based on Carnival 5-night averages last updated March 28, 2026.
```

Card priority rules:

- Home should show at most one leading intelligence card and one supporting
  compact insight. It should not feel like an intelligence dashboard.
- Each pillar screen should show the best next card for that context.
- Cards should always point somewhere concrete: a calculator section, port
  guide, saved trip, MyDay tab, group setup, loyalty profile, or partner handoff.
- Cards should never say "attention needed" without explaining what and why.
- Cards should degrade gracefully to "not enough information yet" with a useful
  setup action.

Recommended card statuses:

| Status | Use |
| --- | --- |
| Do this next | There is one clear next action. |
| Worth checking | The signal is useful but not urgent. |
| Looks ready | The key setup is complete. |
| Missing detail | CruiseKit needs a specific input before it can help. |
| Cost watch | The issue is budget or spend related. |
| Good fit | A sailing, port plan, or loyalty action matches the user profile. |

## Real-Life Scenarios

### 1. The cheap fare is not cheap

A first-time cruiser sees a $499 fare and thinks the trip is under $1,000.
CruiseKit combines cruise-line cost assumptions, gratuities, port fees, drinks,
Wi-Fi, excursions, and travel insurance into an estimated all-in cost.

Card:

```text
This $499 fare is probably a $1,180 trip
The fare is low, but onboard basics and one shore day can more than double the checkout price.
Open true cost breakdown
```

Why it matters: this is CruiseKit's clearest trust-builder. It helps users
avoid false bargains without feeling like an ad.

### 2. The drink package does not match the traveler

A couple adds a beverage package because the cruise line makes it feel standard.
CruiseKit estimates the break-even point using package price, service charge,
cruise length, and user drinking preference.

Card:

```text
The drink package needs heavy daily use to pay off
For this sailing, the package only makes sense if both adults expect about 6 premium drinks per day.
Compare drink package math
```

Why it matters: this saves real money and reinforces that CruiseKit is not just
trying to drive purchases.

### 3. The traveler picked a deal with weak price confidence

A sailing has verified itinerary data but price still needs a current check.
CruiseKit can explain that the itinerary is useful while keeping the price
language conservative.

Card:

```text
Good itinerary, price needs a fresh check
The ship, date, and ports are verified, but this fare should be confirmed before you compare it against other sailings.
Review deal details
```

Why it matters: this fits the current data pipeline, where confidence levels are
already part of canonical sailing records.

### 4. The pre-cruise plan is missing the boring but important part

A user saves a sailing from Miami, arrives the morning of embarkation, and has no
hotel or transfer note. CruiseKit should not create panic, but it can nudge the
setup.

Card:

```text
Add your arrival plan before pricing extras
Your cruise leaves from Miami, but your trip does not yet include a pre-cruise hotel or arrival note.
Add arrival details
```

Why it matters: planning mistakes usually come from boring logistics, not just
headline cruise decisions.

### 5. A port day is overstuffed

A user saves breakfast, an excursion, beach time, shopping, and dinner for a
single port call. CruiseKit compares scheduled time blocks against the port
window without making route or GPS claims.

Card:

```text
This port day has very little buffer
Your saved activities fill most of the port window, so one delay could squeeze the rest of the plan.
Review port schedule
```

Why it matters: the app gives planning clarity while staying out of navigation
and safety territory.

### 6. A sea day has no schedule

On a sea day, MyDay should not feel empty. It can show clocks, dining notes,
spend pace, ship events the user saved, and crew status.

Card:

```text
Sea day looks light
You have no saved plans yet. Keep your dinner time, spend total, and crew check-ins visible here.
Add a sea-day note
```

Why it matters: this makes MyDay useful even when there is nothing urgent.

### 7. Onboard spend is drifting over budget

The user set a $900 onboard budget, then logs drinks, specialty dining, photos,
and excursions. CruiseKit compares current spend against cruise-day pacing.

Card:

```text
You are spending ahead of pace
At this rate, your onboard total may land about $180 over the budget you set before boarding.
Open spend tracker
```

Why it matters: this is useful on the day of and does not require live cruise
line folio integrations.

### 8. The group organizer is missing decisions

A group organizer has 12 travelers but only 7 have selected dinner preference or
excursion interest. CruiseKit surfaces the gap without becoming messaging.

Card:

```text
Five people still need dinner preferences
Your group plan is almost ready, but dinner preference is missing for five travelers.
Open group checklist
```

Why it matters: this supports group coordination without adding chat or social
features.

### 9. Loyalty setup is incomplete

A user cruises Royal Caribbean often but has not added loyalty status or cruise
history. CruiseKit explains what completing the profile unlocks.

Card:

```text
Add your loyalty status before comparing value
CruiseKit can show better loyalty opportunities once your current tier and cruise history are saved.
Set up loyalty profile
```

Why it matters: loyalty can become a durable reason to return to CruiseKit after
the initial planning session.

### 10. A partner handoff needs trust context

A port guide recommends a shore excursion partner. CruiseKit should make it
clear why that handoff is shown and whether CruiseKit may earn a commission.

Card:

```text
Compare independent excursions for this port
These options are outside the cruise line and may cost less, but you should still confirm pickup location and cancellation terms.
View excursion options
```

Why it matters: affiliate revenue can coexist with trust only if the product
explains the tradeoff plainly.

## Roadmap

### Phase 0: Pack Spec And Guardrails

Goal: define the pack before implementation so the product does not drift into a
generic AI feature.

Tasks:

- Name the pack and decide whether the public label is "CruiseKit Intelligence",
  "Smart Planning", or a quieter pillar-specific label.
- Define the shared card contract, priority rules, copy rules, and evidence
  requirements.
- Create a signal registry listing each signal, input data, output status, and
  blocked claims.
- Decide which cards are free, which belong in a future premium pack, and which
  should never be paywalled because they are trust-critical.
- Audit existing data sources: calculator cost data, canonical sailings, ports,
  loyalty programs, affiliate config, user trip state, and mobile bundles.
- Write a restricted-claim checklist covering safety, GPS, booking, and
  unsupported price claims.

Exit criteria:

- A product spec exists for the first 8 to 12 cards.
- Each card has a named owner surface and one primary action.
- Every card has an evidence requirement.
- No card requires a generative model to be correct.

### Phase 1: Deterministic Web Intelligence Prototype

Goal: ship the first useful version on the website using existing data and
static-export-safe logic.

Recommended implementation:

- Add a pure TypeScript signal engine under `packages/shared` if the logic will
  be reused by mobile, or under `apps/web/lib/intelligence` if it is web-only
  for the first slice.
- Start with deterministic rules and fixture-based tests.
- Consume existing data from `apps/web/lib/data/cruise-costs.ts`,
  `apps/web/lib/data/real-deals.ts`, `apps/web/lib/data/ports.ts`, and
  `apps/web/lib/data/loyalty-programs.ts`.
- Add a single reusable card renderer that can fit into Home, Calculator,
  Cruises, Ports, My Trips, and Loyalty without taking over the page.
- Use feature flags or a local constant so the pack can be previewed before it
  becomes public.

First web cards:

| Card | Surface | Data |
| --- | --- | --- |
| True cost delta | Calculator results, Home after calculator use | Cruise-line cost table and calculator inputs |
| Fare confidence | Cruise deal cards and deal detail | Sailing confidence, last verified, price basis |
| Best next planning step | My Trips, Home | Saved trip completeness |
| Port window buffer | Port detail, saved trip | Port call window and saved activities |
| Partner trust note | Port excursions | Affiliate config and disclosure rules |
| Loyalty setup | Loyalty hub, Home | Loyalty profile completeness |

Exit criteria:

- Cards are compact, specific, and action-oriented.
- Home still feels like CruiseKit home, not an intelligence dashboard.
- Calculator and deal recommendations show evidence and confidence.
- No card implies CruiseKit is booking, repricing, navigating, or tracking a
  traveler.

### Phase 2: Trip Plan Intelligence Pack

Goal: make saved trips feel actively guided instead of static.

Tasks:

- Define a trip readiness model with sections for sailing, budget, arrival,
  port plans, group needs, loyalty, and MyDay setup.
- Add a "Do this next" card to My Trips or Trip Detail that chooses one concrete
  next action.
- Create planning-gap signals:
  - Missing arrival plan.
  - Missing budget.
  - Missing port plan for a port day.
  - No onboard spend budget.
  - Group details incomplete.
  - Loyalty profile incomplete.
- Add test fixtures for first-timer, family cruiser, group organizer, and
  loyalty maximizer.

Persistence note:

If the current saved-trip model is not ready for these fields, ship a local
prototype first. Firestore schema and rules changes should be a separate
implementation gate with tests and audit updates.

Exit criteria:

- A saved trip has one clear next action.
- The readiness model is transparent, not a mysterious score.
- The product explains why an action matters in practical language.

### Phase 3: Mobile MyDay Intelligence

Goal: bring intelligence onboard as calm daily utility, especially when Wi-Fi is
unreliable.

Tasks:

- Mirror the stable card contract for mobile after the web rules settle.
- Keep core MyDay signals local-first:
  - Sea-day empty schedule.
  - Port-day activity buffer.
  - Spend pace.
  - Dinner or event note.
  - Crew status gaps.
- Use mobile bundles and local trip state for onboard operation.
- Show ship time and port time context without claiming navigation or safety
  coverage.
- Keep all-aboard as itinerary reference language, not a safety promise.

Recommended MyDay cards:

| Card | MyDay tab | Purpose |
| --- | --- | --- |
| Today brief | Today | Summarizes schedule, clocks, and next saved item. |
| Sea day setup | Today | Makes an empty sea day useful. |
| Port buffer | Today | Flags a crowded schedule without route claims. |
| Spend pace | Spend | Compares logged spend with budget pace. |
| Crew check-in gap | MyCrew | Shows who has not shared a simple status. |

Exit criteria:

- MyDay remains calm and utilitarian.
- Cards work with no live server call.
- No card uses safety, tracking, or navigation language.

### Phase 4: Explore And Affiliate Trust

Goal: make port and excursion recommendations useful while protecting trust.

Tasks:

- Define partner handoff copy that is consistent across Viator, GetYourGuide,
  Booking.com, CruiseDirect, Medjet, SamBoat, and future partners.
- Rank port/excursion recommendations by traveler fit first, not commission.
- Add visible disclosure when CruiseKit may earn a commission.
- Separate editorial guidance from paid partner handoffs.
- Add port-plan checks for activity density, cancellation terms, pickup
  location awareness, and missing reservation details.

Exit criteria:

- Recommendations feel impartial.
- Affiliate copy is clear but not visually dominant.
- Port advice stays within planning and reference boundaries.

### Phase 5: Optimize And Loyalty Intelligence

Goal: create repeat engagement after the first trip planning session.

Tasks:

- Add loyalty profile completeness cards.
- Add cruise-line comparison insights tied to loyalty benefits.
- Add upcoming tier or benefit reminders when the user has enough saved data.
- Add "value fit" explanations that combine fare, likely extras, benefits, and
  preferences.
- Keep future credit-card affiliate opportunities separated from core loyalty
  advice until the trust model is mature.

Exit criteria:

- Loyalty insights are useful without feeling like financial advice.
- The user can see why a recommendation is being made.
- Any future affiliate relationship is disclosed.

### Phase 6: Optional Generative Layer

Goal: use a model only where it improves clarity, not correctness.

Do this only after the deterministic pack is stable.

Allowed model uses:

- Summarizing existing deterministic insights in friendlier language.
- Turning a fixed set of evidence into a short trip brief.
- Helping users understand tradeoffs already computed by rules.
- Drafting a checklist from saved trip data.

Blocked model uses:

- Inventing prices, fees, port rules, schedules, loyalty benefits, or partner
  availability.
- Ranking paid partners without deterministic evidence.
- Giving safety, route, return-to-ship, or emergency advice.
- Running onboard-only core utility when offline.

Exit criteria:

- The deterministic card still exists without the model.
- Model output cites the same evidence as the underlying card.
- The UI can fall back to rules-only copy.

## Technical Shape

Recommended data flow:

```text
Static data bundles
User trip state
Calculator inputs
Saved plans
Loyalty profile
        |
        v
Signal evaluator
        |
        v
Ranked intelligence cards
        |
        v
Existing CruiseKit surfaces
```

Recommended TypeScript contract:

```ts
export type IntelligencePillar =
  | "plan"
  | "coordinate"
  | "explore"
  | "myday"
  | "optimize";

export type IntelligenceStatus =
  | "do_this_next"
  | "worth_checking"
  | "looks_ready"
  | "missing_detail"
  | "cost_watch"
  | "good_fit";

export interface IntelligenceCard {
  id: string;
  pillar: IntelligencePillar;
  status: IntelligenceStatus;
  title: string;
  body: string;
  whyItMatters: string;
  actionLabel: string;
  actionHref: string;
  evidenceLabel: string;
  sourceIds: string[];
  confidence: "high" | "medium" | "needs_check";
  validUntil?: string;
  guardrailTags: string[];
}
```

Implementation guidance:

- Keep signal functions pure and testable.
- Keep card copy templated at first.
- Keep generated model text out of the first implementation.
- Store evidence with the card so the UI never renders unsupported claims.
- Use the existing canonical confidence fields instead of inventing a separate
  trust system.
- Prefer shared package logic once mobile reuse is real.
- Do not add Firestore writes until the persisted trip-state shape is explicit.

## Suggested First Build Slice

The strongest first slice is web-first, rules-only, and trust-focused.

Build these first:

1. Card contract and signal registry.
2. True cost delta card on Calculator results.
3. Fare confidence card on Cruises or deal detail.
4. Loyalty setup card on Loyalty.
5. Port plan setup card on Ports.
6. Small Home intelligence strip that links to the strongest current card.

This first slice proves the core behavior without touching mobile MyDay,
Firestore rules, payment packaging, or external model behavior.

## Product Packaging

Recommended packaging approach:

- Free: basic public insights that prove trust, such as fare confidence and
  true-cost warnings.
- Account-based free: saved-trip "Do this next" and planning gaps.
- Future premium: multi-trip planning intelligence, group readiness, richer
  loyalty optimization, and advanced spend pacing.

Do not paywall trust-critical warnings that prevent users from being misled by
prices or partner links. Those warnings are part of CruiseKit's brand promise.

Possible public names:

| Name | Pros | Cons |
| --- | --- | --- |
| CruiseKit Intelligence | Clear, premium, direct | May sound too AI-heavy if overused |
| Smart Planning | Friendly and embedded | Less ownable |
| CruiseKit Smart Cards | Explains the UI pattern | Sounds less premium |
| Trip Guidance | Practical and calm | Less distinct as a product pack |

Recommended internal name: CruiseKit Intelligence Pack.

Recommended user-facing copy: use pillar-specific language first, such as "Do
this next", "Cost watch", "Good fit", and "Worth checking". Let the product feel
intelligent before asking users to understand a new product name.

## Copy Rules

Use:

- "Based on..."
- "Worth checking..."
- "This looks ready..."
- "This trip is missing..."
- "This fare should be confirmed..."
- "Open..."
- "Review..."
- "Add..."

Avoid:

- "AI recommends..."
- "Guaranteed..."
- "Safe..."
- "You will make it back..."
- "We tracked..."
- "Best deal on the internet..."
- "Book now before it disappears..."
- "Sponsored pick" as the only explanation for a recommendation.

## QA Checklist

Every pack release should verify:

- Each card has one clear action.
- Each card has evidence or source context.
- Home remains visually focused on CruiseKit's main product value.
- Cards do not overcrowd calculator, deal, port, or MyDay screens.
- No card creates safety, GPS, tracking, or booking expectations.
- No card hides affiliate disclosure.
- Unknown or stale data degrades to "needs check" rather than confident advice.
- Mobile cards remain useful offline where MyDay needs to work offline.
- Screen-reader labels and focus states make the card action clear.

## Open Questions

- Should the first public label be "CruiseKit Intelligence" or should the name
  stay internal until the UI pattern is proven?
- Which saved-trip model is authoritative across web and mobile today?
- Does the Flutter app already have a reusable card component for MyDay, or
  should mobile wait until the web signal contract stabilizes?
- Which insights should be free forever because they protect trust?
- What is the minimum useful group-planning state before Group Gaps can ship?
- Should the first pack be account-gated, or should Calculator and Deals show
  anonymous intelligence immediately?
- What level of analytics is acceptable for measuring card usefulness without
  making the product feel surveillant?

## Recommended Next Step

Create a Phase 0 implementation ticket set:

1. Define the first 8 cards and their exact copy templates.
2. Create the `IntelligenceCard` contract and signal registry.
3. Build fixtures for the real-life scenarios in this document.
4. Prototype the web Home, Calculator, Cruises, Ports, and Loyalty surfaces.
5. Review the prototype against the non-negotiable boundaries before starting
   MyDay mobile work.
