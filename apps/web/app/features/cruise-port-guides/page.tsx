import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Cruise Port Guides With Simple Map-Style Overviews",
  description:
    "CruiseKit port guides include destination snapshots, walkability, tender or docked status, currency, connectivity, food, beaches, shopping, and attractions.",
  keywords: [
    "cruise port guide app",
    "cruise port map",
    "port guide for cruise travelers",
    "cruise destination guide",
    "cruise planning app with port maps",
  ],
  alternates: { canonical: "/features/cruise-port-guides" },
  openGraph: {
    title: "Cruise Port Guides With Simple Map-Style Overviews",
    description:
      "Preview cruise destinations with visual port snapshots, quick facts, activities, restaurants, and planning notes.",
    url: "/features/cruise-port-guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cruise Port Guides With Simple Map-Style Overviews",
    description:
      "CruiseKit helps travelers understand ports with simple visual destination snapshots and cruise-specific guide details.",
  },
};

const FAQS = [
  {
    question: "What does a CruiseKit port guide include?",
    answer:
      "A CruiseKit port guide can include an overview, walkability, tender or docked status, currency, Wi-Fi, cell coverage, food, free activities, excursions, and getting-around context.",
  },
  {
    question: "Are the port maps live maps?",
    answer:
      "Port guide map cards are lightweight custom snapshots by default. They are designed to explain the destination area without loading live map tiles.",
  },
  {
    question: "Can I see beaches and attractions?",
    answer:
      "Yes. Where data is available, CruiseKit highlights beaches, food, shopping, free things to do, excursions, and local activity categories.",
  },
  {
    question: "Is CruiseKit free?",
    answer:
      "CruiseKit is free during launch, including core cruise planning, itinerary visualization, and destination discovery features.",
  },
];

export default function CruisePortGuidesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturePage
          title="Cruise Port Guides With Simple Map-Style Overviews"
          description="Each port guide includes a simple map-style destination snapshot with key details like walkability, tender status, currency, Wi-Fi, cell coverage, and top things to do."
          shortAnswer="CruiseKit helps cruise travelers understand a port area before they arrive, using cruise-specific guide data and simple destination snapshots."
          visual="port-card"
          featureBullets={[
            "See walkability, tender status, currency, Wi-Fi, and cell coverage.",
            "Browse beaches, food, shopping, free activities, and attractions.",
            "Use a visual port area snapshot without loading live map tiles.",
            "Open deeper planning tools when you are ready to plan a port day.",
          ]}
          does={[
            "Explain port areas with cruise-specific context.",
            "Show practical destination facts in a scannable format.",
            "Help compare ports before booking or before sailing.",
            "Render useful snapshots even when only basic data is available.",
          ]}
          doesNot={[
            "Replace local maps or official cruise-line instructions.",
            "Provide turn-by-turn directions.",
            "Require a live map provider for every port guide view.",
            "Request location permission for guide cards.",
          ]}
          faqs={FAQS}
          relatedLinks={[
            { label: "Browse all ports", href: "/ports" },
            { label: "Itinerary & port maps", href: "/features/explore-map" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
