import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Cruise Route Map for Visual Cruise Planning",
  description:
    "CruiseKit helps travelers see cruise itineraries as simple visual routes with port stops, sea days, and guide links organized by day.",
  keywords: [
    "cruise route map app",
    "cruise itinerary map",
    "visual cruise planner",
    "cruise route planner",
    "free cruise planning app",
  ],
  alternates: { canonical: "/features/cruise-route-map/" },
  openGraph: {
    title: "Cruise Route Map for Visual Cruise Planning",
    description:
      "See your cruise itinerary as a simple visual route with ports, sea days, and destination guide links.",
    url: "/features/cruise-route-map",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cruise Route Map for Visual Cruise Planning",
    description:
      "CruiseKit turns cruise itineraries into simple visual route maps for planning and destination discovery.",
  },
};

const FAQS = [
  {
    question: "Does CruiseKit show my cruise route?",
    answer:
      "Yes. CruiseKit can show a sailing as a simple visual route with each cruise day, sea day, and port stop organized in order.",
  },
  {
    question: "Is the cruise route map free?",
    answer:
      "CruiseKit is free during launch, including core cruise planning and destination discovery features such as visual route maps.",
  },
  {
    question: "Does CruiseKit use live directions?",
    answer:
      "No. CruiseKit route maps are for planning and discovery, not live directions, turn-by-turn instructions, or user-location tracking.",
  },
  {
    question: "Can I tap a port to see a guide?",
    answer:
      "Yes. When a CruiseKit port guide is available, a route stop can open destination details such as walkability, tender status, activities, food, and local planning notes.",
  },
  {
    question: "Does it work for Caribbean cruises?",
    answer:
      "CruiseKit includes many Caribbean cruise destinations and is designed to expand across more regions as the port guide data grows.",
  },
];

export default function CruiseRouteMapPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturePage
          title="Cruise Route Map for Visual Cruise Planning"
          description="See your itinerary as a simple visual route. CruiseKit organizes each cruise day, sea day, and port stop into a clean route view so your trip is easier to understand at a glance."
          shortAnswer="CruiseKit helps travelers see their cruise itinerary as a simple visual route, with each port organized by day."
          visual="route"
          featureBullets={[
            "Ports appear in sailing order with day labels.",
            "Sea days are shown clearly without overwhelming port stops.",
            "Available ports can open CruiseKit destination guides.",
            "The route graphic is custom-built and does not need live map tiles.",
          ]}
          does={[
            "Visualize cruise routes and itinerary order.",
            "Preview port stops and sea days before sailing.",
            "Connect route stops to CruiseKit port guides when available.",
            "Keep map-style planning lightweight and affordable.",
          ]}
          doesNot={[
            "Provide turn-by-turn directions.",
            "Use paid directions, route, or places APIs.",
            "Track precise user location for route planning.",
            "Download offline map tiles for route guidance.",
          ]}
          faqs={FAQS}
          relatedLinks={[
            { label: "Cruise port guides", href: "/features/cruise-port-guides" },
            { label: "Explore ports", href: "/ports" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
