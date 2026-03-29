import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Compare Cruise Lines",
  description:
    "Side-by-side comparison of cruise lines, ships, and itineraries to find your perfect match.",
};

export default function ComparePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="plan"
          title="Compare Cruise Lines"
          subtitle="Side-by-side comparison of cruise lines, ships, and itineraries to find your perfect match."
          breadcrumbs={[{ label: "Compare Cruise Lines" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p className="text-lg font-medium text-gray-500">
              Coming soon — Compare every major cruise line.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
