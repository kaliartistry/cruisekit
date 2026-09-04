"use client";

import { useMemo, useState } from "react";
import { PRICE_FACTS, type PriceFact } from "@/lib/data/price-facts";

type Option = { id: string; line: string; fact: PriceFact };

const OPTIONS: Option[] = [
  { id: "royal-standard", line: "Royal Caribbean — standard stateroom", fact: PRICE_FACTS.royalCaribbeanStandardGratuity },
  { id: "royal-suite", line: "Royal Caribbean — Grand Suite and above", fact: PRICE_FACTS.royalCaribbeanSuiteGratuity },
  { id: "carnival-standard", line: "Carnival — standard stateroom", fact: PRICE_FACTS.carnivalStandardGratuity },
  { id: "carnival-suite", line: "Carnival — suite", fact: PRICE_FACTS.carnivalSuiteGratuity },
  { id: "ncl-standard", line: "Norwegian — Club Balcony Suite and below", fact: PRICE_FACTS.nclStandardGratuity },
  { id: "ncl-suite", line: "Norwegian — The Haven or Suite", fact: PRICE_FACTS.nclSuiteGratuity },
  { id: "celebrity-standard", line: "Celebrity — inside, ocean-view, or veranda", fact: PRICE_FACTS.celebrityStandardGratuity },
  { id: "celebrity-suite", line: "Celebrity — The Retreat", fact: PRICE_FACTS.celebritySuiteGratuity },
  { id: "princess-standard", line: "Princess — interior, oceanview, or balcony", fact: PRICE_FACTS.princessStandardGratuity },
  { id: "princess-mini", line: "Princess — mini-suite, cabana, or Reserve Collection", fact: PRICE_FACTS.princessMiniSuiteGratuity },
  { id: "princess-suite", line: "Princess — suite", fact: PRICE_FACTS.princessSuiteGratuity },
  { id: "hal-standard", line: "Holland America — non-suite", fact: PRICE_FACTS.hollandAmericaStandardGratuity },
  { id: "hal-suite", line: "Holland America — suite", fact: PRICE_FACTS.hollandAmericaSuiteGratuity },
  { id: "msc-standard", line: "MSC — Caribbean/Alaska standard", fact: PRICE_FACTS.mscStandardCaribbean },
  { id: "msc-suite", line: "MSC — Caribbean/Alaska Yacht Club", fact: PRICE_FACTS.mscSuiteCaribbean },
  { id: "disney-standard", line: "Disney — standard stateroom", fact: PRICE_FACTS.disneyStandardGratuity },
  { id: "disney-concierge", line: "Disney — Concierge or suite", fact: PRICE_FACTS.disneyConciergeGratuity },
  { id: "virgin-legacy", line: "Virgin Voyages — booked before Oct. 7, 2025", fact: PRICE_FACTS.virginLegacyIncluded },
  { id: "virgin-prepaid", line: "Virgin Voyages — current booking, prepaid", fact: PRICE_FACTS.virginCurrentPrepaid },
  { id: "virgin-onboard", line: "Virgin Voyages — current booking, charged onboard", fact: PRICE_FACTS.virginCurrentOnboard },
];

const formatMoney = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function GratuityCalculator() {
  const [optionId, setOptionId] = useState(OPTIONS[0].id);
  const [nights, setNights] = useState(7);
  const [chargedGuests, setChargedGuests] = useState(2);
  const option = OPTIONS.find((item) => item.id === optionId)!;
  const total = useMemo(() => option.fact.amount * nights * chargedGuests, [chargedGuests, nights, option.fact.amount]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 md:grid-cols-3">
        <label className="text-sm font-semibold text-navy md:col-span-3">
          Cruise line, cabin, and booking cohort
          <select value={optionId} onChange={(event) => setOptionId(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base font-normal text-gray-800">
            {OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.line}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy">
          Nights
          <input aria-label="Nights" type="number" min="1" max="180" value={nights} onChange={(event) => setNights(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-base font-normal" />
        </label>
        <label className="text-sm font-semibold text-navy md:col-span-2">
          Guests charged the daily gratuity
          <input aria-label="Guests charged the daily gratuity" type="number" min="1" max="20" value={chargedGuests} onChange={(event) => setChargedGuests(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-base font-normal" />
          <span className="mt-2 block text-xs font-normal leading-5 text-gray-500">Enter only guests covered by the line&apos;s age and regional rules. Carnival generally charges age 2+, NCL age 3+, and Disney includes infants and children.</span>
        </label>
      </div>

      <div aria-live="polite" className="mt-7 rounded-xl bg-navy p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-light">Estimated voyage gratuities</p>
        <p className="mt-2 text-4xl font-bold">{formatMoney(total)}</p>
        <p className="mt-2 text-sm text-white/75">{formatMoney(option.fact.amount)} × {chargedGuests} guest{chargedGuests === 1 ? "" : "s"} × {nights} night{nights === 1 ? "" : "s"}</p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
        <p className="font-bold text-navy">{option.fact.label}</p>
        <p className="mt-1">{option.fact.conditions}</p>
        <p className="mt-3 text-xs text-gray-500">Status: {option.fact.status}. Source checked {option.fact.retrievedAt}; recheck by {option.fact.recheckBy}.</p>
        <a href={option.fact.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex font-semibold text-teal-dark underline">{option.fact.sourceTitle}</a>
      </div>
      <p className="mt-5 text-xs leading-5 text-gray-500">Planning estimate only. Suggested or automatic gratuities can be adjusted, prepaid, included by a fare or promotion, or governed by different regional terms. Confirm the booking confirmation before paying.</p>
    </div>
  );
}
