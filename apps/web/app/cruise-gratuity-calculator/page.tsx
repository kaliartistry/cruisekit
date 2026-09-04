import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CalculatorSwitcher from "@/components/calculator/calculator-switcher";
import GratuityCalculator from "@/components/calculator/gratuity-calculator";

const PAGE_URL = "https://cruisekit.app/cruise-gratuity-calculator/";
const TITLE = "Cruise Gratuity Calculator: What Tips Add, by Line";

export const metadata: Metadata = {
  title: TITLE,
  description: "Calculate daily cruise gratuities by line, cabin class, guests, and nights with dated source links and correct Virgin Voyages booking cohorts.",
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: "See the per-person daily rate and full-voyage gratuity estimate before you sail.", url: PAGE_URL },
};

export default function CruiseGratuityCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader pillar="plan" title="Cruise Gratuity Calculator" subtitle="Choose the exact line, cabin class, and booking cohort, then see the daily rate and total for the whole voyage." breadcrumbs={[{ label: "Cruise Gratuity Calculator" }]} />
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"><CalculatorSwitcher active="gratuity" /></section>
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"><GratuityCalculator /></section>
        <section className="border-t border-gray-200 bg-gray-50/70">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy">Why the booking cohort matters</h2>
            <p className="mt-3 leading-7 text-gray-600">Cruise gratuities are not one universal number. Cabin class, guest age, regional terms, fare bundles, and booking date can change what applies. Virgin Voyages is especially important: older bookings included gratuities, while current bookings use a prepaid-versus-onboard choice rather than a standard-versus-suite split.</p>
            <p className="mt-6 text-sm text-gray-600">Want the full fare, fees, Wi-Fi, and excursion estimate? <Link href="/calculator/" className="font-semibold text-teal-dark underline">Open the total cruise cost calculator</Link>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
