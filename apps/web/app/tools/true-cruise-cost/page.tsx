import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TrueCostCalculator from "@/components/growth/true-cost-calculator";

export const metadata: Metadata = {
  title: "True Cruise Cost Calculator",
  description: "Add the cruise costs you know to see a transparent total before you sail. No account required.",
  alternates: { canonical: "/calculator" },
};

export default function TrueCruiseCostPage() {
  return <><Navbar /><main className="flex-1 bg-gray-50/50"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><TrueCostCalculator /></div></main><Footer /></>;
}
