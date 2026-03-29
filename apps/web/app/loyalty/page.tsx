import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Loyalty Hub",
  description:
    "Track loyalty points, find the best deals, and maximize every dollar across all major cruise lines.",
};

export default function LoyaltyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="optimize"
          title="Loyalty Hub"
          subtitle="Track loyalty points, find the best deals, and maximize every dollar across all major cruise lines."
          breadcrumbs={[{ label: "Loyalty Hub" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p className="text-lg font-medium text-gray-500">
              Coming soon — Optimize your loyalty rewards.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
