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
  title: "Free Cruise Planner App With Route Maps + Port Guides",
  description:
    "Download CruiseKit for iPhone and Android to visualize cruise routes, explore cruise port guides, compare destinations, and calculate true cruise costs.",
  keywords: [
    "cruise app with map",
    "cruise route map app",
    "cruise port guide app",
    "free cruise planning app",
    "cruise itinerary planner",
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
