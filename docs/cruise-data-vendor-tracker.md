# Cruise Data Vendor Tracker

Last updated: May 27, 2026

## Working Decisions

- Launch should be data-first, not booking-first.
- Do not scrape prohibited consumer booking pages.
- Do not pay for agency setup, host-agency setup, vendor setup fees, monthly data licenses, or API access until CruiseKit is earning money or has committed funding for data.
- First test lines: Royal Caribbean and Norwegian Cruise Line.
- Show "from" prices only when the provider can support current advertised pricing in USD with mandatory taxes, fees, port expenses, or non-commissionable charges where available.
- Cabin-level selection is not required for launch, but cabin-category pricing should be captured if available.
- Paid vendor paths are paused. Widgety and Traveltek remain relationship/roadmap options, not active implementation dependencies.

## Outreach Status

| Provider | Contact path | Status | Date | Main ask | Follow-up |
| --- | --- | --- | --- | --- | --- |
| Widgety | `sales@widgety.co.uk` | Replied: software-company licensing allowed, but no USD pricing for Royal/Celebrity without Royal commercial agreement | May 26, 2026 | USA/USD test API for Royal Caribbean and Norwegian with full pricing/content, plus pricing/access rules | Reply asking for trial with Norwegian + one non-Royal operator, and whether Royal/Celebrity content-only can be included |
| Traveltek | Official contact/demo form and discovery call | Call completed with Neil Welsh, Head of Sales | May 27, 2026 | Cruise API/CruiseConnect demo, sandbox, U.S./USD coverage, and credential requirements | Await emailed product/cache-file info; evaluate cache file at $1,500 setup + $800/month floor |
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

Response received May 26, 2026 from Sandra Barnes-Keywood, Sales Director:
- CruiseKit can license Widgety as a software/technology company before becoming a travel agency.
- Widgety cannot offer USD pricing for Royal Caribbean or Celebrity because Royal does not want pricing distributed to businesses without a commercial agreement with them.
- Widgety does have all other Royal/Celebrity content.
- Production pricing depends on number of operators, amount of content, and usage location.
- No setup fee.
- Minimum term: 90 days.
- No refresh/caching rules were stated.
- Deck plans/images, port imagery, itinerary coordinates/UN/LOCODE, and cabin-linked pricing are available for supported operators.
- Current product should be treated as pre-booking/research data.
- Booking API expected Summer 2026, subject to operator integrations.
- Trial: 4-week free trial, up to two operators.

Key reply items to capture:
- Test key availability.
- Production monthly/API cost.
- Required market/currency flags for USA/USD.
- Whether Royal Caribbean and Norwegian include pricing in the test account.
- Whether taxes/fees/non-commissionable charges are exposed.
- Whether booking/deep links exist or Widgety should be treated as research-only.

Current recommendation:
- Do not spend the two-operator trial on Royal Caribbean if it cannot include pricing.
- Ask for Norwegian + Carnival, MSC, or Princess with full USA/USD pricing.
- Ask whether Royal Caribbean and Celebrity content-only can be included in the trial or priced separately from full pricing operators.
- Keep Traveltek as the best path to Royal Caribbean pricing through credentialed/commercial access.

### Traveltek

Best long-term live pricing, availability, repricing, and booking candidate if startup/API access is feasible.

Response received May 25, 2026 from Neil Welsh, Head of Sales. He asked to schedule a discovery Zoom call through Calendly.

Discovery call notes from May 27, 2026:
- Traveltek has 30+ cruise lines directly integrated.
- Their normal customers are enterprise travel companies; examples mentioned included large U.S./global cruise/OTA/airline businesses.
- They do not have a free/startup program.
- The direct API is likely not useful until CruiseKit has cruise-line commercial agreements/API keys or a fulfillment/host-agency partner with those credentials.
- API pricing expectation: about $1,400-$2,000/month.
- Content/cache file may be a better near-term fit because it does not require direct cruise-line deals.
- Cache/content file includes cruise-line, ship, itinerary, and port content plus a level of pricing: latest gross/travel-agent price by broad cabin category such as inside, outside/oceanview, balcony, and suite.
- Cache/content delivery: FTP file plus webhook notifications when Traveltek receives updates from cruise lines.
- Cache/content pricing expectation: $1,500 setup fee plus a monthly floor of $800/month.
- Neil offered to email additional information and examples.

Key reply items to capture:
- Whether Cruise API can be used data-only before agency credentials.
- Whether CruiseConnect requires agency, CLIA, host agency, or supplier registration.
- REST/XML/GraphQL recommendation for production.
- Sandbox availability.
- Cost, setup fee, minimum term, and implementation timeline.

Current recommendation:
- Do not pursue the full API immediately unless a host agency/fulfillment partner provides credentials and economics.
- Ask for a sample cache file/schema before paying setup.
- Confirm whether the cache includes Royal Caribbean pricing, whether display is allowed for a consumer-facing planning app, and whether taxes/fees/port expenses or non-commissionable charges are included.
- Compare Traveltek cache economics against Widgety and CruiseHost before committing.

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
