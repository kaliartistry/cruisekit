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
      </main>
      <Footer />
    </>
  );
}
