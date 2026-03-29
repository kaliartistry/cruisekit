import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "./hero-section";
import ContentSections from "./pillar-cards";

export const metadata: Metadata = {
  title: "True Cruise Cost Calculator — See What Your Cruise Really Costs | CruiseKit",
  description:
    "Calculate the true total cost of your cruise including drinks, WiFi, gratuities, and hidden fees. Compare 9 major cruise lines side by side. 100% free.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ContentSections />
      </main>
      <Footer />
    </>
  );
}
