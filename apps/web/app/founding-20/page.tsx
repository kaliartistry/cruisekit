import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Founding20Content from "@/components/growth/founding-20-content";

export const metadata: Metadata = {
  title: "Founding 20 Concierge Onboarding",
  description: "Apply to join CruiseKit’s Founding 20 pilot for cruisers with real upcoming sailings.",
  openGraph: { url: "https://cruisekit.app/founding-20", type: "website" },
};

export default function Founding20Page() {
  return <><Navbar /><main className="flex-1"><Founding20Content /></main><Footer /></>;
}
