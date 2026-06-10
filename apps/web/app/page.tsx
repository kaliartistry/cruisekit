import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "./hero-section";
import HomeGuideTeaser from "./home-guide-teaser";
import ContentSections from "./pillar-cards";
import MobileLaunchSection from "./mobile-launch-section";

export const metadata: Metadata = {
  title: "Free Cruise Planner App + True Cruise Cost Calculator",
  description:
    "Download CruiseKit for iPhone and Android or use the free web calculator to plan hidden cruise costs, ship time, port time, MyDay, and port days.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MobileLaunchSection />
        <HomeGuideTeaser />
        <ContentSections />
      </main>
      <Footer />
    </>
  );
}
