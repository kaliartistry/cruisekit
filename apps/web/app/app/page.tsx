import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/config/app-store-urls";
import AppLandingClient from "./app-landing-client";

const PAGE_URL = "https://cruisekit.app/app";
const PAGE_TITLE = "CruiseKit App - MyDay, Spend Tracker, Port Maps";
const PAGE_DESCRIPTION =
  "Download CruiseKit to save your cruise, use MyDay, track spending and drink package value, open itinerary port maps, and invite MyCrew.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "cruise planner app",
    "cruise spend tracker",
    "cruise drink package tracker",
    "MyDay cruise planner",
    "cruise port map app",
    "cruise crew invite app",
    "cruise hidden costs",
  ],
  alternates: {
    canonical: "/app",
  },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Save your cruise, use MyDay, track spend and drink package value, open itinerary port maps, and invite MyCrew.",
    url: "/app",
  },
};

const appPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      isPartOf: {
        "@type": "WebSite",
        name: "CruiseKit",
        url: "https://cruisekit.app",
      },
      about: {
        "@id": `${PAGE_URL}#software`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${PAGE_URL}#software`,
      name: "CruiseKit",
      applicationCategory: "TravelApplication",
      operatingSystem: "iOS, Android",
      url: PAGE_URL,
      downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
      description:
        "CruiseKit is an independent cruise companion app for MyDay planning, onboard spend tracking, drink package value, itinerary port maps, and MyCrew coordination.",
      screenshot: [
        "https://cruisekit.app/assets/app-screenshots/myday-home.png",
        "https://cruisekit.app/assets/app-screenshots/drink-package.png",
        "https://cruisekit.app/assets/app-screenshots/itinerary-ports.png",
        "https://cruisekit.app/assets/app-screenshots/mycrew-invite.png",
      ],
      featureList: [
        "MyDay cruise-day planning",
        "Onboard spend tracking",
        "Drink package value tracking",
        "Itinerary port maps",
        "MyCrew invites",
      ],
      publisher: {
        "@type": "Organization",
        name: "CruiseKit",
        url: "https://cruisekit.app",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://cruisekit.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "CruiseKit App",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function AppPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex-1">
        <AppLandingClient />
      </main>
      <Footer />
    </>
  );
}
