import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "./hero-section";
import HomeGuideTeaser from "./home-guide-teaser";
import ContentSections from "./pillar-cards";
import MobileLaunchSection from "./mobile-launch-section";
import MapFeatureTeaser from "./map-feature-teaser";
import AuthorityHubTeaser from "./authority-hub-teaser";

export const metadata: Metadata = {
  title: "CruiseKit - MyDay Cruise Planner, Spend Tracker, Port Maps",
  description:
    "Download CruiseKit for iPhone and Android to save your cruise, use MyDay, track spending and drink package value, and open itinerary port maps.",
  alternates: { canonical: "/" },
  keywords: [
    "cruise planner app",
    "cruise spend tracker",
    "cruise drink package tracker",
    "MyDay cruise planner",
    "free cruise planning app",
    "cruise port map app",
  ],
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MobileLaunchSection />
        <MapFeatureTeaser />
        <AuthorityHubTeaser />
        <HomeGuideTeaser />
        <ContentSections />
      </main>
      <Footer />
    </>
  );
}
