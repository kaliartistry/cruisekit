import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CalculatorSwitcher from "@/components/calculator/calculator-switcher";
import DeadlineCalendar from "@/components/calculator/deadline-calendar";
import { FINAL_PAYMENT_RULES, PACKAGE_CUTOFFS } from "@/lib/data/deadline-facts";

const PAGE_URL = "https://cruisekit.app/cruise-payment-deadline-calculator/";

export const metadata: Metadata = {
  title: "Cruise Final Payment Deadline Calculator & Calendar",
  description: "Calculate a cruise final-payment planning date, see verified pre-cruise package cutoffs, and download calendar reminders.",
  alternates: { canonical: PAGE_URL },
  openGraph: { title: "Cruise Final Payment Deadline Calculator & Calendar", description: "Turn your sailing date into practical payment and package reminders.", url: PAGE_URL },
};

export default function CruisePaymentDeadlinePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader pillar="plan" title="Cruise Final Payment Deadline Calendar" subtitle="Enter your sailing date, select the rule that matches the cruise and booking cohort, then save the planning reminders to your calendar." breadcrumbs={[{ label: "Cruise Payment Deadline Calculator" }]} />
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"><CalculatorSwitcher active="deadlines" /></section>
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"><DeadlineCalendar /></section>
        <section className="border-t border-gray-200 bg-gray-50/70">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy">Current source-backed rules</h2>
            <p className="mt-3 max-w-3xl leading-7 text-gray-600">CruiseKit keeps different voyage lengths and booking cohorts separate. The Princess rule changed for bookings made September 2, 2026 or later, so an older 90-day rule must not be applied automatically.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {FINAL_PAYMENT_RULES.map((rule) => (
                <article key={rule.id} className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-bold text-navy">{rule.cruiseLine}: {rule.daysBeforeSailing} days</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{rule.appliesWhen}</p>
                  <a href={rule.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-teal-dark underline">{rule.sourceTitle}</a>
                </article>
              ))}
            </div>
            <h2 className="mt-12 text-2xl font-bold text-navy">Pre-cruise package cutoffs</h2>
            <div className="mt-5 space-y-3">
              {PACKAGE_CUTOFFS.map((cutoff) => (
                <p key={cutoff.cruiseLine} className="rounded-lg border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-700"><strong className="text-navy">{cutoff.cruiseLine}:</strong> {cutoff.daysBeforeSailing} days before sailing for {cutoff.label.toLowerCase()}. {cutoff.priceDifference}</p>
              ))}
            </div>
            <p className="mt-8 text-sm text-gray-600">Need the full trip estimate too? <Link href="/calculator/" className="font-semibold text-teal-dark underline">Open the cruise cost calculator</Link>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
