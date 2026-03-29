import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CruiseSearchPage from "./cruise-search";

export const metadata: Metadata = {
  title: "Caribbean Cruise Deals — Compare 708+ Sailings | CruiseKit",
  description:
    "Browse and filter real cruise deals from Carnival, Norwegian, and Virgin Voyages. Compare prices, ships, ports, and durations. Find the lowest Caribbean cruise fares.",
};

export default function CruisesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <CruiseSearchPage />
      </main>
      <Footer />
    </>
  );
}
