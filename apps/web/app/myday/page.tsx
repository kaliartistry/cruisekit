import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MyDayContent from "./myday-content";

const PAGE_URL = "https://cruisekit.app/myday";
const PAGE_TITLE = "MyDay - Your Cruise Day, Handled";
const PAGE_DESCRIPTION =
  "CruiseKit MyDay helps cruisers manage ship time, port time, daily schedules, onboard spend, and MyCrew check-ins from the mobile app.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/myday" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/myday",
    images: [
      {
        url: "/assets/app-screenshots/myday-today.png",
        width: 1290,
        height: 2796,
        alt: "CruiseKit MyDay Today screen showing ship time, port time, and daily plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/assets/app-screenshots/myday-today.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      isPartOf: {
        "@type": "WebSite",
        name: "CruiseKit",
        url: "https://cruisekit.app",
      },
      about: {
        "@type": "SoftwareApplication",
        name: "CruiseKit MyDay",
        applicationCategory: "TravelApplication",
        operatingSystem: "iOS, Android",
        url: PAGE_URL,
        description:
          "CruiseKit MyDay is a cruise-day planning feature for ship-time context, port-time context, daily schedules, onboard spend tracking, and MyCrew check-ins.",
        publisher: {
          "@type": "Organization",
          name: "CruiseKit",
          url: "https://cruisekit.app",
        },
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
          name: "MyDay",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function MyDayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex-1">
        <MyDayContent />
      </main>
      <Footer />
    </>
  );
}
