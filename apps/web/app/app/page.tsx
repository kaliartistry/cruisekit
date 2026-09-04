import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AppLandingClient from "./app-landing-client";

export const metadata: Metadata = {
  title: "CruiseKit App - MyDay, Spend Tracker, Port Maps",
  description:
    "Download CruiseKit to save your cruise, use MyDay, track spending and drink package value, open itinerary port maps, and invite MyCrew.",
  keywords: [
    "cruise planner app",
    "cruise spend tracker",
    "cruise drink package tracker",
    "MyDay cruise planner",
    "cruise port map app",
    "cruise crew invite app",
    "cruise hidden costs",
  ],
  alternates: {
    canonical: "/app/",
  },
  openGraph: {
    title: "CruiseKit App - MyDay, Spend Tracker, Port Maps",
    description:
      "Save your cruise, use MyDay, track spend and drink package value, open itinerary port maps, and invite MyCrew.",
    url: "/app",
  },
};

export default function AppPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AppLandingClient />
      </main>
      <Footer />
    </>
  );
}
