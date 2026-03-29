"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CalculatorForm from "@/components/calculator/calculator-form";

function CalculatorFormWithSearchParams() {
  const searchParams = useSearchParams();

  // Parse `line` param: comma-separated string -> string[]
  const lineParam = searchParams.get("line");
  const defaultCruiseLineIds = lineParam
    ? lineParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 2)
    : undefined;

  // Parse `duration` param
  const durationParam = searchParams.get("duration");
  const defaultDuration =
    durationParam && !isNaN(parseInt(durationParam, 10))
      ? parseInt(durationParam, 10)
      : undefined;

  // Parse `adults` param
  const adultsParam = searchParams.get("adults");
  const defaultAdults =
    adultsParam && !isNaN(parseInt(adultsParam, 10))
      ? parseInt(adultsParam, 10)
      : undefined;

  // Parse `month` param (0-indexed: 0=Jan, 11=Dec)
  const monthParam = searchParams.get("month");
  const defaultMonth =
    monthParam && !isNaN(parseInt(monthParam, 10))
      ? Math.min(11, Math.max(0, parseInt(monthParam, 10)))
      : undefined;

  return (
    <CalculatorForm
      defaultCruiseLineIds={defaultCruiseLineIds}
      defaultDuration={defaultDuration}
      defaultAdults={defaultAdults}
      defaultMonth={defaultMonth}
    />
  );
}

export default function CalculatorWithParams() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-400">Loading calculator...</div>}>
      <CalculatorFormWithSearchParams />
    </Suspense>
  );
}
