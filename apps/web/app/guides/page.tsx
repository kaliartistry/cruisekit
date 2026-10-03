import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calculator, ChevronRight, MapPinned } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GUIDES, GUIDE_CATEGORIES } from "@/lib/data/guides";
import GuidesIndexClient from "./guides-index-client";

const PAGE_URL = "https://cruisekit.app/guides";

export const metadata: Metadata = {
  title: "Cruise Guides: Costs, Packing, Ports, Drinks, Tips & Insurance",
  description:
    "CruiseKit cruise guides for first-time cruisers, packing, drink package math, gratuities, port days, insurance, and realistic cruise budgeting.",
  keywords: [
    "cruise guides",
    "first time cruise guide",
    "cruise packing list",
    "cruise drink package guide",
    "cruise tipping guide",
    "cruise port day tips",
    "cruise insurance explained",
  ],
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Cruise Guides from CruiseKit",
    description:
      "Practical cruise planning guides for costs, packing, port days, drink packages, gratuities, and insurance.",
    url: "/guides",
    images: [
      {
        url: "/assets/app-screenshots/myday-itinerary.png",
        width: 1290,
        height: 2796,
        alt: "CruiseKit itinerary screen for cruise planning",
      },
    ],
  },
};

function GuidesJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${PAGE_URL}#guides`,
    name: "CruiseKit cruise guides",
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      description: guide.description,
      url: `https://cruisekit.app/guides/${guide.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function GuidesPage() {
  const guideCount = GUIDES.length;
  const categoryCount = GUIDE_CATEGORIES.length - 1;

  return (
    <>
      <GuidesJsonLd />
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
            <div>
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-1 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="transition-colors hover:text-navy">
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-medium text-gray-700">Guides</span>
                  </li>
                </ol>
              </nav>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-dark">
                <BookOpen className="h-3.5 w-3.5" />
                Cruise planning guides
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
                Cruise Guides
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                Practical CruiseKit guides for planning the real trip: first
                cruise questions, packing, drink package math, gratuities, port
                days, insurance, and budget decisions.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-extrabold text-navy">{guideCount}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                    Guides
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-extrabold text-navy">{categoryCount}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                    Topics
                  </p>
                </div>
                <Link
                  href="/calculator"
                  className="rounded-xl border border-teal/30 bg-teal/10 p-4 transition-colors hover:border-teal/60"
                >
                  <Calculator className="h-5 w-5 text-teal" />
                  <p className="mt-2 text-sm font-bold text-navy">
                    Pair guides with the calculator
                  </p>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[310px] overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src="/assets/app-screenshots/myday-itinerary.png"
                  alt="CruiseKit itinerary screen used for cruise guide planning"
                  fill
                  priority
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 32vw, 60vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="grid gap-3">
                <div className="relative min-h-[180px] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src="/assets/ports/cozumel.jpg"
                    alt="Cozumel cruise port guide preview"
                    fill
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <MapPinned className="h-5 w-5 text-teal" />
                  <p className="mt-3 text-sm font-bold leading-5 text-navy">
                    Built for decisions travelers make before they sail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <GuidesIndexClient />
      </main>
      <Footer />
    </>
  );
}
