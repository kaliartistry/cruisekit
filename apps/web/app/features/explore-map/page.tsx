import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Cruise Itinerary and Port Maps in MyDay",
  description:
    "CruiseKit connects a saved-itinerary route map with static map snapshots and guides for itinerary stops under More, then Ports.",
  keywords: [
    "cruise port map app",
    "cruise destination map",
    "explore cruise ports",
    "cruise map app",
    "cruise app with map",
  ],
  alternates: { canonical: "/features/explore-map/" },
  openGraph: {
    title: "Cruise Itinerary and Port Maps in MyDay",
    description:
      "See your saved cruise route, then open map snapshots and guides for itinerary stops under More, then Ports.",
    url: "/features/explore-map",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cruise Itinerary and Port Maps in MyDay",
    description:
      "CruiseKit connects your saved itinerary with route context and map-backed port guides.",
  },
};

const FAQS = [
  {
    question: "What map views does CruiseKit include?",
    answer:
      "CruiseKit shows a route map for your saved itinerary and static map snapshots inside port guides. It does not have a separate Explore tab or live pin-browsing surface.",
  },
  {
    question: "Where do I find port maps in the app?",
    answer:
      "Open More, then Ports, to see the stops on your saved itinerary. Each available port guide includes cruise-specific context and a map snapshot.",
  },
  {
    question: "Do CruiseKit maps need my location?",
    answer:
      "No. Saved-itinerary route visuals and port-guide map snapshots work without tracking your precise location.",
  },
  {
    question: "Can I browse every port in the app?",
    answer:
      "The app's Ports area focuses on stops from your saved itinerary. The CruiseKit website remains available for browsing the wider port-guide library.",
  },
];

export default function ExploreMapPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturePage
          title="Cruise Itinerary and Port Maps in MyDay"
          description="See your saved cruise route in itinerary context, then open More and Ports for map snapshots and guides tied to the stops on your sailing."
          shortAnswer="CruiseKit connects your saved itinerary to a route map and cruise-specific port guides; Ports and MyCrew check-ins live under More."
          visual="route"
          featureBullets={[
            "See port calls and sea days in your saved itinerary.",
            "Use the itinerary route map to understand the order of stops.",
            "Open More, then Ports, for stops on your saved sailing.",
            "View static map snapshots inside available port guides.",
          ]}
          does={[
            "Connect a saved cruise to its itinerary and route context.",
            "Link itinerary stops to available CruiseKit port guides.",
            "Show map snapshots with cruise-specific port context.",
            "Keep the wider port-guide library available on the website.",
          ]}
          doesNot={[
            "Present a separate Explore tab or live pin-browsing surface.",
            "Provide turn-by-turn directions or paid route APIs.",
            "Track precise user location for itinerary planning.",
            "Show unrelated destinations in the app's saved-itinerary Ports list.",
          ]}
          faqs={FAQS}
          relatedLinks={[
            { label: "Cruise Route Map", href: "/features/cruise-route-map" },
            { label: "Cruise Port Guides", href: "/features/cruise-port-guides" },
            { label: "See MyDay", href: "/myday" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
