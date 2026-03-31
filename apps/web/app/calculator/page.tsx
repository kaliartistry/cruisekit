import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CalculatorWithParams from "./calculator-with-params";

export const metadata: Metadata = {
  title:
    "True Cost Calculator — See What Your Cruise Really Costs | CruiseKit",
  description:
    "Calculate the true cost of your cruise vacation. Our free calculator reveals hidden fees including gratuities, drink packages, WiFi, excursions, port fees, and more for Royal Caribbean, Carnival, Norwegian, Disney, and all major cruise lines.",
};

export default function CalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="plan"
          title="True Cost Calculator"
          subtitle="See what your cruise will actually cost — beyond the advertised price"
          breadcrumbs={[{ label: "True Cost Calculator" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <CalculatorWithParams />
        </section>

        {/* Server-rendered SEO content */}
        <section className="border-t border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy">
              Why Use a True Cost Calculator?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Cruise lines advertise base fares that exclude mandatory costs like daily gratuities ($16–$26/day per person),
              port fees ($20–$22/day), drink packages ($60–$110/day), WiFi ($16–$42/day), and specialty dining ($24–$135/meal).
              These hidden costs can add 40–80% to your advertised fare. Our calculator shows you the real total before you book.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4 border border-gray-200">
                <p className="text-sm font-semibold text-navy">9 Cruise Lines</p>
                <p className="mt-1 text-xs text-gray-500">Royal Caribbean, Carnival, Norwegian, Celebrity, Princess, Holland America, MSC, Disney, Virgin Voyages</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-gray-200">
                <p className="text-sm font-semibold text-navy">Real Cost Data</p>
                <p className="mt-1 text-xs text-gray-500">Gratuities, drink packages, WiFi, dining, excursions, insurance, and port fees — all itemized</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-gray-200">
                <p className="text-sm font-semibold text-navy">Side-by-Side Compare</p>
                <p className="mt-1 text-xs text-gray-500">Select two cruise lines to see a full cost comparison with the same trip parameters</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
