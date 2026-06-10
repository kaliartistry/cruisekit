import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AppLandingClient from "./app-landing-client";

export const metadata: Metadata = {
  title: "CruiseKit App — Free Cruise Planner for iPhone and Android",
  description:
    "Download the free CruiseKit app for iPhone and Android to calculate true cruise costs, plan ship time and port time, use MyDay, and prepare port days. No booking required.",
  keywords: [
    "cruise planner app",
    "cruise cost calculator app",
    "ship time planner",
    "port day planner",
    "cruise hidden costs",
  ],
  alternates: {
    canonical: "/app",
  },
  openGraph: {
    title: "CruiseKit App — Free Cruise Planner",
    description:
      "Know what your cruise really costs and plan ship time, port time, MyDay, and port days before you board.",
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
