import type { SavedDealData } from "@/components/shared/heart-button";

type SavedDealCalculatorContext = SavedDealData & {
  id?: string;
};

export function buildCalculatorHref(deal: SavedDealCalculatorContext) {
  const params = new URLSearchParams({
    line: deal.cruiseLineId,
    duration: String(deal.duration),
    adults: "2",
    fare: String(deal.fromPrice),
  });

  setWhenPresent(params, "sailing", deal.id);
  setWhenPresent(params, "ship", deal.shipName);
  setWhenPresent(params, "departure", deal.departureDate);
  setWhenPresent(params, "port", deal.departurePort);

  return `/calculator?${params.toString()}`;
}

function setWhenPresent(
  params: URLSearchParams,
  key: string,
  value: string | null | undefined,
) {
  const trimmed = value?.trim();
  if (trimmed) params.set(key, trimmed);
}
