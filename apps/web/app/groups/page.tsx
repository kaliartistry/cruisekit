import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import GroupsContent from "./groups-content";

const PAGE_URL = "https://cruisekit.app/groups";

export const metadata: Metadata = {
  title: "Group Hub — Plan & Split Costs for Group Cruises",
  description:
    "Estimate per-person costs for your group cruise, follow a step-by-step planning timeline, and coordinate your group booking across all major cruise lines.",
  alternates: { canonical: "/groups" },
  keywords: [
    "group cruise planning",
    "group cruise cost calculator",
    "split cruise costs",
    "group cruise booking",
    "cruise group rates",
    "group cruise checklist",
  ],
  openGraph: {
    title: "Group Hub - Plan & Split Costs for Group Cruises",
    description:
      "Estimate group cruise costs, follow a planning timeline, and connect Group Hub with MyCrew check-ins for cruise-day coordination.",
    url: "/groups",
    type: "website",
  },
};

const GROUP_FAQS = [
  {
    question: "How many people do you need for a group cruise rate?",
    answer:
      "Most cruise lines require 8 or more staterooms to qualify for group rates. Some lines offer group benefits starting at 5 cabins. Group rates can include perks such as onboard credit, organizer cabins, or reduced deposits, depending on the cruise line and sailing.",
  },
  {
    question: "Who should be the group coordinator?",
    answer:
      "Pick someone organized who is comfortable managing deadlines and communication. The coordinator keeps the group booking, payment reminders, room assignments, transportation, and planning decisions easier to follow.",
  },
  {
    question: "How does CruiseKit help with group cruise planning?",
    answer:
      "CruiseKit Group Hub helps groups estimate per-person costs, follow a planning timeline, and connect pre-cruise planning with MyCrew-oriented cruise-day coordination.",
  },
  {
    question: "Is CruiseKit an official cruise line group booking tool?",
    answer:
      "No. CruiseKit is an independent cruise planning toolkit. Travelers should confirm group booking rules, deposits, final prices, onboard services, and sailing-specific details with the cruise line or their travel advisor.",
  },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "CruiseKit Group Hub",
        description:
          "A CruiseKit planning page for estimating group cruise costs, following a planning timeline, and coordinating group cruise context.",
        about: {
          "@type": "SoftwareApplication",
          name: "CruiseKit",
          applicationCategory: "TravelApplication",
          operatingSystem: "iOS, Android",
          url: "https://cruisekit.app",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "CruiseKit",
          url: "https://cruisekit.app",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: GROUP_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
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
            name: "Group Hub",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function GroupsPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="coordinate"
          title="Group Hub"
          subtitle="Estimate per-person costs, plan your timeline, and coordinate your group cruise — all in one place."
          breadcrumbs={[{ label: "Group Hub" }]}
        />
        <section className="border-b border-gray-200 bg-seafoam/35">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase text-teal-dark">
                MyCrew check-ins
              </p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-700">
                Need day-of group status during the cruise? Read how CruiseKit
                handles lightweight MyCrew coordination without replacing
                official onboard information.
              </p>
            </div>
            <Link
              href="/cruise-group-check-in-app"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-teal/40 bg-white px-4 py-2 text-sm font-bold text-teal-dark transition-colors hover:border-teal hover:text-teal"
            >
              Cruise group check-ins
            </Link>
          </div>
        </section>
        <GroupsContent />
      </main>
      <Footer />
    </>
  );
}
