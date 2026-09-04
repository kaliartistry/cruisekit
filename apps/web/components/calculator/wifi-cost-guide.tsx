import Link from "next/link";
import { CRUISE_LINES } from "@cruise/shared/constants";
import type { PackageTier } from "@cruise/shared/types";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { getWifiPurchasePricePair } from "@/lib/data/price-facts";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function WifiTierPrice({
  cruiseLineId,
  tier,
}: {
  cruiseLineId: string;
  tier: PackageTier;
}) {
  const pair = getWifiPurchasePricePair(cruiseLineId, tier.name);

  if (tier.priceEntryRequired) {
    return (
      <p className="mt-1 text-xs font-semibold leading-5 text-amber-800">
        Enter your current sailing quote in the calculator; this line does not publish one fixed price for every voyage.
      </p>
    );
  }

  if (tier.pricePerDay === 0) {
    return (
      <p className="mt-1 text-xs font-semibold text-teal-dark">
        Included in the applicable fare or bundle
      </p>
    );
  }

  if (pair) {
    return (
      <div className="mt-2 text-xs leading-5 text-gray-600">
        <p>
          <span className="font-price font-bold text-navy">
            {formatMoney(pair.prePurchase.amount)}
          </span>{" "}
          before sailing · {formatMoney(pair.prePurchase.amount * 7)} for one 7-night plan
        </p>
        <p>
          <span className="font-price font-bold text-navy">
            {formatMoney(pair.onboard.amount)}
          </span>{" "}
          onboard · {formatMoney(pair.onboard.amount * 7)} for one 7-night plan
        </p>
        <p className="mt-1 font-semibold text-teal-dark">
          Pre-purchasing saves {formatMoney((pair.onboard.amount - pair.prePurchase.amount) * 7)} per plan on a 7-night cruise.
        </p>
      </div>
    );
  }

  return (
    <p className="mt-1 text-xs leading-5 text-gray-600">
      <span className="font-price font-bold text-navy">
        {formatMoney(tier.pricePerDay)} per plan/day
      </span>{" "}
      · {formatMoney(tier.pricePerDay * 7)} for one 7-night plan · planning input, confirm against your booking
    </p>
  );
}

function WifiTierList({ cruiseLineId }: { cruiseLineId: string }) {
  const costs = CRUISE_LINE_COSTS[cruiseLineId];
  if (!costs) return null;

  return (
    <ul className="mt-3 space-y-3">
      {costs.wifiPackages.tiers.map((tier) => (
        <li key={tier.name} className="border-t border-gray-100 pt-3 first:border-0 first:pt-0">
          <p className="text-sm font-semibold text-navy">{tier.name}</p>
          <p className="mt-0.5 text-xs leading-5 text-gray-500">
            {tier.description}
          </p>
          <WifiTierPrice cruiseLineId={cruiseLineId} tier={tier} />
        </li>
      ))}
    </ul>
  );
}

export function WifiCostGuide() {
  const lines = CRUISE_LINES.filter((line) => CRUISE_LINE_COSTS[line.id]);

  return (
    <section className="border-t border-gray-200 bg-white" aria-labelledby="wifi">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 id="wifi" className="scroll-mt-24 text-2xl font-bold tracking-tight text-navy">
            Cruise WiFi cost calculator
          </h2>
          <p className="mt-3 leading-7 text-gray-600">
            Select your cruise line in the calculator above, continue to Add-Ons, then choose a Wi-Fi tier, purchase timing, and number of plans. CruiseKit shows the per-day assumption and the total for your voyage instead of silently charging every guest.
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            A port-heavy itinerary may reduce how much ship internet you need. Check your mobile plan and shore access first, but remember that some cruise-long packages cannot be bought for only the sea days.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lines.map((line) => (
            <article key={line.id} className="rounded-xl border border-gray-200 bg-gray-50/60 p-5">
              <h3 className="text-lg font-bold text-navy">
                {line.name.replace(" International", "")}
              </h3>
              <WifiTierList cruiseLineId={line.id} />
              <Link
                href={`/calculator/${line.id}/`}
                className="mt-4 inline-flex text-xs font-bold text-teal-dark underline decoration-teal/30 underline-offset-4"
              >
                Open this line&apos;s full cost calculator
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs leading-5 text-gray-500">
          Dollar figures without an official paired-price label are planning inputs, not live quotes. Royal Caribbean and Celebrity prices vary by sailing, so the calculator asks for the price shown in your cruise planner.
        </p>
      </div>
    </section>
  );
}

export function LineWifiSummary({
  cruiseLineId,
  displayName,
}: {
  cruiseLineId: string;
  displayName: string;
}) {
  return (
    <section className="border-t border-gray-200 bg-gray-50/60">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-navy">
          {displayName} WiFi costs
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Compare the tier, daily assumption, and one-plan voyage total before deciding how many people truly need simultaneous access.
        </p>
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">
          <WifiTierList cruiseLineId={cruiseLineId} />
        </div>
        <Link
          href="/calculator/#wifi"
          className="mt-5 inline-flex text-sm font-bold text-teal-dark underline decoration-teal/30 underline-offset-4"
        >
          Compare Wi-Fi assumptions across every cruise line
        </Link>
      </div>
    </section>
  );
}
