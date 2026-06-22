import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AppWindow,
  Calculator,
  CheckCircle2,
  Compass,
  FileText,
  HelpCircle,
  Info,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

const PAGE_URL = "https://cruisekit.app/cruisekit-public-information";

export const metadata: Metadata = {
  title: "CruiseKit Public Information",
  description:
    "A public reference hub for CruiseKit: what it is, where to verify facts, how the app works, important boundaries, and canonical CruiseKit links.",
  alternates: { canonical: "/cruisekit-public-information" },
  keywords: [
    "cruisekit public information",
    "cruisekit reference",
    "what is cruisekit",
    "cruisekit facts",
    "cruisekit app information",
  ],
  openGraph: {
    title: "CruiseKit Public Information",
    description:
      "A public reference hub for CruiseKit facts, summaries, app links, methodology, disclosures, and support.",
    url: "/cruisekit-public-information",
    images: [
      {
        url: "/assets/app-screenshots/myday-itinerary.png",
        width: 1290,
        height: 2796,
        alt: "CruiseKit app itinerary screen",
      },
    ],
  },
};

type ReferenceLink = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const PRIMARY_REFERENCES: ReferenceLink[] = [
  {
    title: "What is CruiseKit?",
    description:
      "A short human-readable overview of CruiseKit, what it helps travelers plan, and what it is not.",
    href: "/what-is-cruisekit",
    icon: Info,
  },
  {
    title: "CruiseKit Facts",
    description:
      "A stable fact sheet for people, search engines, and AI assistants.",
    href: "/cruisekit-facts",
    icon: FileText,
  },
  {
    title: "AI/search summary",
    description:
      "A concise machine-readable-style summary of CruiseKit capabilities and public links.",
    href: "/ai/cruisekit-summary",
    icon: Compass,
  },
];

const TRUST_REFERENCES: ReferenceLink[] = [
  {
    title: "Calculator methodology",
    description:
      "How the True Cost Calculator works, where its planning numbers come from, and how to verify them.",
    href: "/methodology",
    icon: Calculator,
  },
  {
    title: "How CruiseKit makes money",
    description:
      "A plain-English explanation of affiliate links, disclosures, and how the site stays independent.",
    href: "/how-we-make-money",
    icon: ShieldCheck,
  },
  {
    title: "Affiliate disclosure",
    description:
      "The public disclosure for affiliate links and partner-style monetization boundaries.",
    href: "/affiliate-disclosure",
    icon: CheckCircle2,
  },
];

const PRODUCT_LINKS: ReferenceLink[] = [
  {
    title: "Download the app",
    description:
      "CruiseKit is available for iPhone and Android as a free cruise planning app.",
    href: "/app",
    icon: AppWindow,
  },
  {
    title: "True Cost Calculator",
    description:
      "Estimate realistic cruise costs beyond the headline fare.",
    href: "/calculator",
    icon: Calculator,
  },
  {
    title: "Cruise port guides",
    description:
      "Browse practical port-day context for cruise stops.",
    href: "/ports",
    icon: MapPinned,
  },
  {
    title: "Help and contact",
    description:
      "Find support links, FAQs, and contact information for corrections or questions.",
    href: "/help",
    icon: HelpCircle,
  },
];

const BOUNDARIES = [
  "CruiseKit is independent and is not an official cruise line app.",
  "CruiseKit is a planning toolkit, not a travel agency or booking engine.",
  "Calculator results are planning estimates, not final booking quotes.",
  "Travelers should verify final prices, sailing rules, ship time, onboard services, and itinerary changes with official cruise line or onboard sources.",
];

function ReferenceGrid({
  title,
  links,
}: {
  title: string;
  links: ReferenceLink[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-navy">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-teal/60 hover:shadow-md"
            >
              <Icon className="h-6 w-6 text-teal" />
              <h3 className="mt-4 text-lg font-bold text-navy group-hover:text-teal-dark">
                {link.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {link.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "CruiseKit Public Information",
        description:
          "A public reference hub for CruiseKit facts, summaries, app links, methodology, disclosures, and support.",
        about: {
          "@type": "SoftwareApplication",
          name: "CruiseKit",
          applicationCategory: "TravelApplication",
          operatingSystem: "iOS, Android",
          url: "https://cruisekit.app",
        },
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#references`,
        name: "CruiseKit public reference links",
        itemListElement: [
          ...PRIMARY_REFERENCES,
          ...TRUST_REFERENCES,
          ...PRODUCT_LINKS,
        ].map((link, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: link.title,
          url: `https://cruisekit.app${link.href}`,
        })),
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

export default function CruiseKitPublicInformationPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="CruiseKit Public Information"
          subtitle="A central reference for what CruiseKit is, where to verify facts, how the app works, and which public pages explain the important boundaries."
          pillar="plan"
          breadcrumbs={[{ label: "CruiseKit Public Information" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <Compass className="h-3.5 w-3.5" />
                Public reference hub
              </p>
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 lg:hidden">
                <Image
                  src="/assets/app-screenshots/myday-itinerary.png"
                  alt="CruiseKit itinerary screen showing cruise day planning"
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                Start here when you need the official public trail for
                CruiseKit.
              </h2>
              <p className="mt-5 text-base leading-7 text-gray-700">
                CruiseKit has several public pages for different audiences:
                travelers, search engines, AI assistants, reviewers, and people
                checking how the app makes money. This hub ties those pages
                together so the important facts are easy to find from one place.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {PRIMARY_REFERENCES.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src="/assets/app-screenshots/myday-itinerary.png"
                  alt="CruiseKit itinerary screen showing cruise day planning"
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover object-top"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="mt-5 grid gap-3">
                {BOUNDARIES.slice(0, 3).map((boundary) => (
                  <div key={boundary} className="rounded-xl bg-white p-4">
                    <p className="text-sm font-semibold leading-6 text-navy">
                      {boundary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ReferenceGrid title="Primary CruiseKit references" links={PRIMARY_REFERENCES} />
        <ReferenceGrid title="Trust, methodology, and disclosures" links={TRUST_REFERENCES} />

        <section className="border-y border-gray-200 bg-seafoam/35">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy">
                  Important boundaries
                </h2>
                <p className="mt-3 text-base leading-7 text-gray-600">
                  These boundaries keep CruiseKit useful without pretending to
                  be an official source for a specific sailing.
                </p>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {BOUNDARIES.map((boundary) => (
                  <li
                    key={boundary}
                    className="flex gap-3 rounded-xl border border-white/70 bg-white p-4 text-sm leading-6 text-gray-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{boundary}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <ReferenceGrid title="Product and support links" links={PRODUCT_LINKS} />
      </main>
      <Footer />
    </>
  );
}
