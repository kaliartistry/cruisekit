import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Explore Cruise Ports on a Map",
  description:
    "CruiseKit Explore Map helps travelers browse cruise ports visually, filter by region, tap pins, and open cruise-specific port guides.",
  keywords: [
    "cruise port map app",
    "cruise destination map",
    "explore cruise ports",
    "cruise map app",
    "cruise app with map",
  ],
  alternates: { canonical: "/features/explore-map" },
  openGraph: {
    title: "Explore Cruise Ports on a Map",
    description:
      "Browse cruise ports visually, filter by region, preview destinations, and open full CruiseKit port guides.",
    url: "/features/explore-map",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Cruise Ports on a Map",
    description:
      "CruiseKit's Explore Map is built for browsing cruise destinations and opening port guides.",
  },
};

const FAQS = [
  {
    question: "What is the CruiseKit Explore Map?",
    answer:
      "Explore Map is a visual way to browse cruise ports, filter by region, tap a destination, and open the full CruiseKit port guide.",
  },
  {
    question: "Does Explore Map use cruise-specific data?",
    answer:
      "Yes. Pins come from CruiseKit's existing port guide data rather than a generic places database.",
  },
  {
    question: "Does Explore Map need my location?",
    answer:
      "No. Explore Map is designed for destination browsing and works without tracking precise user location.",
  },
  {
    question: "Can I filter cruise ports by region?",
    answer:
      "Yes. CruiseKit supports region filtering so travelers can browse destinations such as the Bahamas, Caribbean, Alaska, Europe, and homeports.",
  },
];

export default function ExploreMapPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturePage
          title="Explore Cruise Ports on a Map"
          description="Browse cruise ports visually. Filter by region, tap a destination, and open the full CruiseKit port guide with cruise-specific planning details."
          shortAnswer="CruiseKit's Explore Map helps travelers browse cruise destinations by region and open port guides from visual pins."
          visual="explore-map"
          featureBullets={[
            "Browse ports visually from the Explore area.",
            "Filter destinations by region before opening a guide.",
            "Tap pins to preview port name, country, region, and quick stats.",
            "Load the live map only when a traveler explicitly opens Map view.",
          ]}
          does={[
            "Show cruise ports as pins from CruiseKit guide data.",
            "Support destination browsing and trip inspiration.",
            "Open port guide previews and full guide pages.",
            "Keep list browsing available as the default experience.",
          ]}
          doesNot={[
            "Use Places API for generic attraction search.",
            "Use paid directions or route APIs.",
            "Track precise user location for destination browsing.",
            "Auto-load a live map on app launch.",
          ]}
          faqs={FAQS}
          relatedLinks={[
            { label: "Cruise Route Map", href: "/features/cruise-route-map" },
            { label: "Cruise Port Guides", href: "/features/cruise-port-guides" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
