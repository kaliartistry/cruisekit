# Cruise Data Vendor Tracker

Last updated: May 25, 2026

## Working Decisions

- Launch should be data-first, not booking-first.
- Do not scrape prohibited consumer booking pages.
- Do not pay for agency or host-agency setup just to start.
- First test lines: Royal Caribbean and Norwegian Cruise Line.
- Show "from" prices only when the provider can support current advertised pricing in USD with mandatory taxes, fees, port expenses, or non-commissionable charges where available.
- Cabin-level selection is not required for launch, but cabin-category pricing should be captured if available.

## Outreach Status

| Provider | Contact path | Status | Date | Main ask | Follow-up |
| --- | --- | --- | --- | --- | --- |
| Widgety | `sales@widgety.co.uk` | Email sent from `info@cruisekit.app` | May 25, 2026 | USA/USD test API for Royal Caribbean and Norwegian with full pricing/content, plus pricing/access rules | Follow up May 29 if no reply |
| Traveltek | Official contact/demo form | Replied: Neil Welsh, Head of Sales, requested discovery Zoom via Calendly | May 25, 2026 | Cruise API/CruiseConnect demo, sandbox, U.S./USD coverage, and credential requirements | Book discovery call and keep call focused on data-first access, Royal Caribbean/Norwegian, pricing, and credential path |
| CRUISEHOST / CRUISE-API | `sales@cruisehost.net` | Email sent from `info@cruisekit.app` | May 25, 2026 | CRUISE-API USA/USD access, content-only catalogue, Royal Caribbean/Norwegian test access, pricing/credential rules | Follow up May 29 if no reply |
| Odysseus Solutions | Official request-a-demo form | Submitted | May 25, 2026 | Cruise Data Cache, Cruise Static Content, and longer-term Cruise Booking Engine path | Follow up May 29 if no reply |

## Evaluation Criteria

Use these questions to score each reply:

| Criterion | Why it matters |
| --- | --- |
| Non-agency access | CruiseKit should not need CLIA, host agency, or supplier credentials just to ingest launch data. |
| Royal Caribbean access | This is the hard line and the most important proof point. |
| USA/USD support | CruiseKit launch is U.S.-market. |
| 2026+ sailing coverage | Data must be useful immediately for launch and SEO. |
| Pricing quality | Prefer provider-supplied total/lead-in prices with taxes/fees/non-commissionable charges where available. |
| Cabin category pricing | Needed for useful comparison, even if cabin-level availability waits. |
| Static content quality | Ship images, deck plans, port images, coordinates, and itinerary metadata reduce internal maintenance. |
| Refresh/caching rules | We need to know how often prices can be updated and how they can be displayed. |
| Cost and contract friction | Watch for setup fees, long minimum terms, or enterprise-only commitments. |
| Booking path | Booking is not required for launch, but the provider should not block a future live pricing/reprice/booking path. |

## Provider Notes

### Widgety

Best near-term candidate for licensed content plus search/pricing data. The request asked whether CruiseKit can license data as a software company before becoming a travel agency.

Key reply items to capture:
- Test key availability.
- Production monthly/API cost.
- Required market/currency flags for USA/USD.
- Whether Royal Caribbean and Norwegian include pricing in the test account.
- Whether taxes/fees/non-commissionable charges are exposed.
- Whether booking/deep links exist or Widgety should be treated as research-only.

### Traveltek

Best long-term live pricing, availability, repricing, and booking candidate if startup/API access is feasible.

Response received May 25, 2026 from Neil Welsh, Head of Sales. He asked to schedule a discovery Zoom call through Calendly.

Key reply items to capture:
- Whether Cruise API can be used data-only before agency credentials.
- Whether CruiseConnect requires agency, CLIA, host agency, or supplier registration.
- REST/XML/GraphQL recommendation for production.
- Sandbox availability.
- Cost, setup fee, minimum term, and implementation timeline.

Call stance:
- CruiseKit is launching data-first, not checkout-first.
- We need licensed U.S./USD cruise inventory and display rights.
- Royal Caribbean and Norwegian are the proof-point lines.
- Booking/reprice can be phase two, but we need to understand the path and credentials now.
- Do not imply CruiseKit will scrape or use unofficial cruise-line endpoints.

### CRUISEHOST / CRUISE-API

Credible fallback API. Public site says CRUISE-API supports REST/JSON, optional JSON catalogue download, USA price market, content-only tiers, and cruise lines including Royal Caribbean, Norwegian, Carnival, MSC, Celebrity, Holland America, Princess, Disney, and Virgin.

Key reply items to capture:
- Whether USA/USD coverage is commercially available to a U.S. startup.
- Whether Royal Caribbean and Norwegian are live API, daily cache, or display-only.
- Whether content-only catalogue with all categories/prices is available without booking credentials.
- Whether taxes/fees/port expenses are included.
- Pricing and contract minimums.

### Odysseus Solutions

Strong candidate if Cruise Data Cache and Cruise Static Content can be licensed separately from a full booking engine.

Key reply items to capture:
- Whether data-cache/static-content access is available before agency credentials.
- Whether U.S./USD Royal Caribbean and Norwegian are available.
- Update frequency for cached pricing and availability.
- Whether taxes/fees/non-commissionable charges are included.
- Whether the booking engine requires CLIA/host/supplier credentials.

## Reply Triage

Green-light a provider for integration only if:
- It can legally provide CruiseKit with licensed data.
- It supports USA/USD.
- It includes Royal Caribbean or can clearly explain the path to Royal Caribbean.
- Pricing is within a startup-reasonable range or has a trial/sandbox path.
- Display/caching terms allow consumer-facing CruiseKit pages.

Pause or reject if:
- They require scraping, browser automation, or unofficial cruise-line endpoints.
- They require paid agency setup before any data test.
- They cannot confirm display rights for public consumer pages.
- They cannot disclose pricing until after a long sales process.

## Follow-Up Message

Use this if no response by May 29, 2026:

```text
Hi [Name/team],

I’m following up on my note about CruiseKit, a U.S.-market cruise planning app looking for licensed cruise data/API access.

The short version: we need data-first access for 2026+ USA/USD sailings, especially Royal Caribbean and Norwegian, with itinerary, ship, port, cabin-category, and pricing data. Booking can come later if credentials are required.

Could you let me know whether this is a fit and what the next step is for sandbox/demo access and pricing?

Thanks,
Kali
CruiseKit
info@cruisekit.app
https://cruisekit.app
```
