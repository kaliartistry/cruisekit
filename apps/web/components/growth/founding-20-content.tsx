"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, ClipboardCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import { getGrowthAttribution } from "@/lib/growth/attribution";
import { HERO_MESSAGE_EXPERIMENT, getHeroMessageVariant, isHeroMessageExperimentEligible } from "@/lib/growth/experiments";
import { trackGrowthEvent } from "@/lib/growth/analytics";
import GrowthApplicationForm from "./growth-application-form";

const steps = [
  { icon: ClipboardCheck, title: "Apply", copy: "Tell us about your upcoming sailing and what you want to solve." },
  { icon: CalendarCheck2, title: "We review your sailing", copy: "We’ll confirm the details and see whether the pilot is a good fit." },
  { icon: HeartHandshake, title: "Set up CruiseKit together", copy: "We’ll build your true-cost plan and start your MyDay setup." },
];

export default function Founding20Content() {
  // Start with a deterministic server-compatible variant, then restore the
  // locally persisted assignment after hydration. This avoids a visible SSR
  // mismatch while preserving assignment on return visits.
  const [variant, setVariant] = useState<"A" | "B">("A");
  const headline = HERO_MESSAGE_EXPERIMENT.variants[variant];

  useEffect(() => {
    const assigned = getHeroMessageVariant(getGrowthAttribution().anonymousId);
    if (assigned !== "A") {
      Promise.resolve().then(() => setVariant(assigned));
    }
    if (isHeroMessageExperimentEligible()) {
      trackGrowthEvent("experiment_variant_viewed", {
        experimentId: HERO_MESSAGE_EXPERIMENT.id,
        experimentVariant: assigned,
      });
    }
  }, []);

  return (
    <>
      <section className="overflow-hidden border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight text-navy sm:text-5xl lg:text-6xl">{headline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-700">We’re personally setting up CruiseKit for 20 cruisers with upcoming sailings. You’ll receive a true-cost plan, MyDay setup, and early access. In exchange, we ask for honest feedback before, during, and after the trip.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#application" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ocean px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-ocean/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">Apply for Founding 20 <ArrowRight className="h-4 w-4" /></a>
              <Link href="/tools/true-cruise-cost" className="inline-flex h-12 items-center justify-center text-base font-semibold text-teal underline-offset-4 hover:text-teal-dark hover:underline">Try the cost calculator</Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-gray-500"><ShieldCheck className="h-4 w-4 text-teal" /> Applying does not guarantee acceptance. We review each upcoming sailing first.</p>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute inset-x-4 bottom-0 h-3/4 rounded-3xl bg-seafoam" aria-hidden="true" />
            <div className="relative mx-auto w-[min(78vw,306px)] overflow-hidden rounded-[2rem] border-[8px] border-navy bg-white shadow-[var(--shadow-xl)]">
              <Image src="/assets/app-screenshots/myday-today.png" alt="CruiseKit MyDay itinerary view" width={560} height={1120} priority className="h-auto w-full" />
            </div>
            <div className="relative -mt-14 ml-auto mr-3 max-w-[245px] rounded-xl border border-white/70 bg-white/95 p-4 shadow-[var(--shadow-lg)] backdrop-blur">
              <p className="text-sm font-bold text-navy">A plan that travels with you</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">Start with the true cost. Keep the days, ports, spend, and crew in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-navy">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return <div key={step.title} className="relative flex gap-4 md:block md:px-4 md:text-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal md:mx-auto"><Icon className="h-6 w-6" /></div>
                <div><p className="mt-1 text-sm font-semibold text-teal md:mt-4">{index + 1}.</p><h3 className="text-lg font-bold text-navy">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-gray-600">{step.copy}</p></div>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section id="application" className="scroll-mt-24 bg-white py-14 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.64fr_1.36fr] lg:px-8">
          <aside className="rounded-2xl bg-navy p-7 text-white sm:p-9">
            <ShipIllustration />
            <h2 className="mt-7 text-3xl font-bold leading-tight">A real sailing gets a real plan.</h2>
            <p className="mt-4 leading-relaxed text-white/75">We’re looking for cruisers with a real upcoming trip—not a hypothetical quote—so we can learn what makes CruiseKit useful before, during, and after sailing.</p>
            <div className="mt-8 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/75">Your details stay private. We use them only to review your application and coordinate the pilot.</div>
          </aside>
          <GrowthApplicationForm type="founding20" />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-navy">Questions before you apply?</h2>
            <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
              <div className="py-4"><dt className="font-semibold text-navy">What happens after I apply?</dt><dd className="mt-1 text-sm leading-relaxed text-gray-600">We review the sailing details and contact selected applicants directly. Submitting an application does not create an account or guarantee a space.</dd></div>
              <div className="py-4"><dt className="font-semibold text-navy">Do I need the app now?</dt><dd className="mt-1 text-sm leading-relaxed text-gray-600">No. You can start with the calculator on the web. We’ll help selected participants continue in CruiseKit when it makes sense.</dd></div>
              <div className="py-4"><dt className="font-semibold text-navy">What feedback are you asking for?</dt><dd className="mt-1 text-sm leading-relaxed text-gray-600">Honest feedback about planning, onboard use, and what could make the next cruise easier. We only ask for a review after you have experienced real value.</dd></div>
            </dl>
          </div>
          <div className="self-end rounded-2xl border border-teal/25 bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="text-lg font-bold text-navy">Curious what your cruise might cost?</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">Use the calculator without creating an account. Add only the amounts you know, then save a real sailing when you’re ready.</p>
            <Link href="/tools/true-cruise-cost" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark">Try the true-cost calculator <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ShipIllustration() {
  return <svg viewBox="0 0 180 100" className="h-auto w-40 text-teal" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 73h138l-14 12H42L22 73Z" /><path d="M54 72V45h64v27M77 45V28h21v17M63 55h7M78 55h7M94 55h7M109 55h7M45 88c11 5 23 5 34 0 11-5 23-5 34 0 11 5 23 5 34 0" /><path d="M85 22c2-7 5-10 10-14M62 46V35M116 46V35" /></svg>;
}
