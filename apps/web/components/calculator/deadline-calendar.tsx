"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download } from "lucide-react";
import { FINAL_PAYMENT_RULES, PACKAGE_CUTOFFS } from "@/lib/data/deadline-facts";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function displayDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function calculatePlanningDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return isoDate(date);
}

function escapeIcs(value: string) {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

export default function DeadlineCalendar() {
  const [sailDate, setSailDate] = useState("");
  const [ruleId, setRuleId] = useState(FINAL_PAYMENT_RULES[0].id);
  const rule = FINAL_PAYMENT_RULES.find((item) => item.id === ruleId)!;
  const cutoff = PACKAGE_CUTOFFS.find((item) => item.cruiseLine === rule.cruiseLine);

  const dates = useMemo(() => {
    if (!sailDate) return null;
    return {
      finalPayment: calculatePlanningDate(sailDate, rule.daysBeforeSailing),
      packageCutoff: cutoff ? calculatePlanningDate(sailDate, cutoff.daysBeforeSailing) : null,
    };
  }, [cutoff, rule.daysBeforeSailing, sailDate]);

  const download = () => {
    if (!dates) return;
    const events = [
      { date: dates.finalPayment, title: `${rule.cruiseLine} final payment deadline` },
      ...(dates.packageCutoff && cutoff
        ? [{ date: dates.packageCutoff, title: `${rule.cruiseLine} ${cutoff.label}` }]
        : []),
    ];
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CruiseKit//Cruise Deadline Calendar//EN",
      ...events.flatMap((event, index) => [
        "BEGIN:VEVENT",
        `UID:${rule.id}-${event.date}-${index}@cruisekit.app`,
        `DTSTART;VALUE=DATE:${event.date.replaceAll("-", "")}`,
        `SUMMARY:${escapeIcs(event.title)}`,
        `DESCRIPTION:${escapeIcs("Planning reminder from CruiseKit. Confirm the exact deadline on your cruise-line or travel-advisor booking confirmation.")}`,
        "END:VEVENT",
      ]),
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cruisekit-${rule.id}-deadlines.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-navy">
          Cruise and booking cohort
          <select value={ruleId} onChange={(event) => setRuleId(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base font-normal text-gray-800">
            {FINAL_PAYMENT_RULES.map((item) => (
              <option key={item.id} value={item.id}>{item.cruiseLine} — {item.appliesWhen}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy">
          Sailing date
          <input type="date" value={sailDate} onChange={(event) => setSailDate(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-base font-normal text-gray-800" />
        </label>
      </div>

      <div aria-live="polite" className="mt-6 rounded-xl bg-navy p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-light">Planning date</p>
        <p className="mt-2 text-2xl font-bold">{dates ? displayDate(dates.finalPayment) : "Choose your sailing date"}</p>
        <p className="mt-2 text-sm text-white/75">{rule.daysBeforeSailing} days before sailing · {rule.appliesWhen}</p>
        {dates?.packageCutoff && cutoff && (
          <div className="mt-5 border-t border-white/15 pt-4">
            <p className="font-semibold">{cutoff.label}: {displayDate(dates.packageCutoff)}</p>
            <p className="mt-1 text-sm text-white/75">{cutoff.priceDifference}</p>
          </div>
        )}
      </div>

      <button type="button" disabled={!dates} onClick={download} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal px-5 py-3 font-bold text-navy disabled:cursor-not-allowed disabled:opacity-45">
        <Download className="h-4 w-4" /> Download calendar (.ics)
      </button>

      <div className="mt-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0" />
        <p>This is a planning reminder, not your contractual due date. Promotions, groups, regions, travel advisors, air, and booking cohorts can change the deadline. Confirm the date printed on your invoice.</p>
      </div>

      <p className="mt-5 text-xs text-gray-500">Source checked {rule.retrievedAt}; recheck by {rule.recheckBy}. <a href={rule.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-teal-dark underline">Read the official source</a>.</p>
    </div>
  );
}
