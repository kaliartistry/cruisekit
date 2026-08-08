import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FeaturePage } from "@/components/marketing/feature-page";

export const metadata: Metadata = {
  title: "Cruise Itinerary Planner With Port Maps and Guides",
  description:
    "CruiseKit helps travelers organize cruise days, visualize routes, compare destinations, and plan better port days in a free cruise planning app.",
  keywords: [
    "cruise itinerary planner",
    "cruise planning app",
    "free cruise planning app",
    "cruise itinerary map",
    "cruise travel app",
  ],
  alternates: { canonical: "/features/cruise-itinerary-planner" },
  openGraph: {
    title: "Cruise Itinerary Planner With Port Maps and Guides",
    description:
      "Organize cruise days, visualize routes, compare ports, and plan destination time with CruiseKit.",
    url: "/features/cruise-itinerary-planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cruise Itinerary Planner With Port Maps and Guides",
    description:
      "CruiseKit combines route visualization, port guides, and planning tools for cruise travelers.",
  },
};

const FAQS = [
  {
    question: "Can CruiseKit help plan a cruise itinerary?",
    answer:
      "Yes. CruiseKit helps organize cruise days, sea days, port stops, destination guides, and planning details in one app.",
  },
  {
    question: "Can I compare cruise destinations before booking?",
    answer:
      "Yes. CruiseKit port guides help travelers compare destinations by region, walkability, activities, food, and basic travel details.",
  },
  {
    question: "Does CruiseKit include map-style planning tools?",
    answer:
      "Yes. CruiseKit includes a visual route map for your saved itinerary plus static map snapshots in port guides under More, then Ports.",
  },
  {
    question: "Does CruiseKit replace official cruise-line information?",
    answer:
      "No. CruiseKit is a planning companion. Travelers should always confirm schedules, policies, and day-of details with the cruise line.",
  },
];

export default function CruiseItineraryPlannerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturePage
          title="Cruise Itinerary Planner With Port Maps and Guides"
          description="CruiseKit is a free cruise planning app that helps travelers visualize cruise routes, explore cruise ports, compare destinations, and plan better cruise days."
          shortAnswer="CruiseKit combines itinerary planning, visual route maps, cruise port guides, and destination discovery tools for cruise travelers."
          visual="planner"
          featureBullets={[
            "Organize port days and sea days in a simple itinerary view.",
            "Use route maps to understand where your cruise is going.",
            "Open port guides for destination facts and planning ideas.",
            "Compare sailings, costs, ports, and planning details before you go.",
          ]}
          does={[
            "Help travelers plan cruise days and destinations.",
            "Make itinerary details easier to understand visually.",
            "Connect destination planning to port guide content.",
            "Stay free during launch for core planning features.",
          ]}
          doesNot={[
            "Sell fake affiliate links or unsupported offers.",
            "Gate core launch planning tools behind a paywall.",
            "Provide live directions or user-location tracking.",
            "Use expensive map APIs for simple route and guide visuals.",
          ]}
          faqs={FAQS}
          relatedLinks={[
            { label: "Explore sailings", href: "/cruises" },
            { label: "True Cost Calculator", href: "/calculator" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
