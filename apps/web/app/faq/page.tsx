import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calculator,
  HelpCircle,
  Mail,
  MapPinned,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

const PAGE_URL = "https://cruisekit.app/faq";

export const metadata: Metadata = {
  title: "Cruise Cost FAQ: Hidden Fees, Tips, WiFi, Drinks & Budgeting",
  description:
    "Answers to cruise cost questions about hidden fees, taxes, port fees, gratuities, drink packages, WiFi, cash, CruiseKit's calculator, and saved trip planning.",
  keywords: [
    "cruise cost faq",
    "hidden cruise fees",
    "what costs are not included in a cruise",
    "are cruise prices per person or room",
    "cruise gratuities",
    "cruise drink package worth it",
    "cruisekit faq",
    "cruise planning questions",
    "true cost calculator help",
    "cruise day planner",
    "cruise planning tool help",
  ],
  alternates: {
    canonical: "https://cruisekit.app/faq",
  },
  openGraph: {
    title: "Cruise Cost FAQ: Hidden Fees, Tips, WiFi, Drinks & Budgeting",
    description:
      "Answers to cruise cost questions about hidden fees, taxes, port fees, gratuities, drink packages, WiFi, cash, and CruiseKit's calculator.",
    url: "https://cruisekit.app/faq",
    type: "website",
    images: [
      {
        url: "/assets/app-screenshots/mobile-feature-graphic.png",
        width: 1024,
        height: 500,
        alt: "CruiseKit mobile app showing MyDay and drink package tracking",
      },
    ],
  },
};

const FAQS = [
  {
    question: "What costs are not included on a cruise?",
    answer:
      "Most base fares do not include taxes, port fees, daily gratuities, drink packages, WiFi, shore excursions, specialty dining, spa treatments, photos, casino spend, parking, hotels, travel insurance, or port spending. CruiseKit's calculator is built to add those items before you book.",
  },
  {
    question: "Are cruise prices per person or room?",
    answer:
      "Cruise prices are usually shown per person based on double occupancy. The first price you see may not be the room total, and it may not include taxes, port fees, gratuities, or onboard extras.",
  },
  {
    question: "How do I calculate the real cruise cost before booking?",
    answer:
      "Start with the fare you found, then add guests, nights, cabin type, taxes and port fees, gratuities, drinks, WiFi, excursions, dining, insurance, transportation, and port spending. The CruiseKit True Cost Calculator keeps those assumptions in one estimate.",
  },
  {
    question: "Are taxes, port fees, and gratuities included in cruise prices?",
    answer:
      "Taxes and port fees often appear later in checkout, while gratuities are usually prepaid or charged daily on the ship. They are not always included in the first advertised fare, so they should be part of every cruise budget.",
  },
  {
    question: "How much cash should I bring on a cruise?",
    answer:
      "Bring enough cash for port-day taxis, tips, small vendors, beach clubs, and backup spending. Many onboard purchases are cashless, but port days can still require small bills, especially outside major terminals.",
  },
  {
    question: "Is the drink package worth it?",
    answer:
      "A drink package is worth it only if your daily drinks, specialty coffees, bottled water, and cabin rules beat the package price plus service charge. Couples should calculate the average across both adults because many lines require every adult in the cabin to buy the package.",
  },
  {
    question: "What is CruiseKit?",
    answer:
      "CruiseKit is a free, independent cruise planning toolkit. It gives you tools to calculate the true cost of a cruise, explore port-day options, coordinate group trips, manage your daily cruise schedule and spending, and compare loyalty programs across major cruise lines. Think of it as your planning companion before and during a cruise.",
  },
  {
    question: "Is CruiseKit a travel agency?",
    answer:
      "No. CruiseKit does not sell, book, or arrange cruises. We are a planning tool that helps you research and compare before you book directly with a cruise line or your preferred travel agent. Some links on our site are affiliate links, which means we may earn a small commission if you make a purchase through them, but we never handle bookings ourselves.",
  },
  {
    question: "How accurate is the True Cost Calculator?",
    answer:
      "The True Cost Calculator uses publicly available and manually reviewed pricing inputs for gratuities, drink packages, Wi-Fi, specialty dining, and other common add-ons across major cruise lines. The result is an estimate, not a booking quote. Actual costs may vary based on sailing date, ship, cabin category, and current promotions. Always confirm final pricing directly with the cruise line or booking platform before booking.",
  },
  {
    question: "Where does the pricing data come from?",
    answer:
      "Our pricing inputs come from official cruise line websites, public fare listings where available, and published add-on pricing schedules. We do not scrape restricted consumer booking pages. Cruise lines change pricing frequently, so CruiseKit treats fares as planning references and recommends verifying any number that matters to your booking decision.",
  },
  {
    question: "Why don't I see live Royal Caribbean prices?",
    answer:
      "Some cruise lines, including Royal Caribbean, restrict how third parties can access or redistribute live pricing and availability. CruiseKit will not scrape prohibited booking pages or publish unverified live fares. You can still use the calculator for Royal Caribbean by entering the fare you see on Royal Caribbean's site or from your travel agent.",
  },
  {
    question: "Is my data safe?",
    answer:
      "CruiseKit uses Firebase Authentication and Firestore for account-linked features, keeps website analytics off unless you allow it, and does not sell personal information or share it for third-party marketing. MyDay uses user-entered schedule, spend, and manual crew status data; the current app does not request or collect location. See the Privacy Policy for the full data and deletion details.",
  },
  {
    question: "How do I save cruises and trips?",
    answer:
      "Sign in with your Google account using the sign-in button in the navigation bar. Once signed in, you can save cruise comparisons and trip plans to your \"My Trips\" dashboard. Your saved data syncs across devices and is stored securely in Firebase.",
  },
  {
    question: "What is MyDay?",
    answer:
      "MyDay is CruiseKit's during-cruise command center. It includes a daily schedule, device-time and port-local clocks with a reminder to verify official ship time, itinerary-based all-aboard context, an onboard spend tracker, and MyCrew status check-ins for lightweight group coordination. CruiseKit does not schedule event notifications yet.",
  },
  {
    question: "Is CruiseKit free?",
    answer:
      "Yes, CruiseKit is free to use. We may sustain the platform through clearly disclosed affiliate links for approved partners such as excursions, hotels, insurance, or booking platforms. Those links do not change the price you pay, and CruiseKit does not handle your booking.",
  },
  {
    question: "Can I use CruiseKit on my phone?",
    answer:
      "Yes. CruiseKit is available for iPhone on the App Store and Android on Google Play. The website still works in mobile browsers, but for during-cruise tools like MyDay, ship-time context, and spend tracking, we recommend the app.",
  },
  {
    question: "How do I contact you?",
    answer:
      "CruiseKit is built and maintained by a solo developer. You can reach us directly at info@cruisekit.app for bug reports, feature requests, data corrections, or general feedback. We read every email.",
  },
];

const FAQ_STARTERS = [
  {
    title: "Real cruise cost",
    description:
      "Start with fare, taxes, fees, gratuities, drinks, WiFi, excursions, and port spending.",
    href: "/calculator",
    icon: Calculator,
  },
  {
    title: "Port-day planning",
    description:
      "Use port guides when the question is about cash, taxis, excursions, food, or getting around.",
    href: "/ports",
    icon: MapPinned,
  },
  {
    title: "App and data basics",
    description:
      "Read how CruiseKit works, what it stores, and where to verify public facts.",
    href: "/cruisekit-public-information",
    icon: ShieldCheck,
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
        name: "CruiseKit FAQ",
        description:
          "Frequently asked questions about CruiseKit, cruise costs, hidden fees, app features, privacy, and cruise planning.",
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
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

export default function FAQPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about CruiseKit and how it works."
          breadcrumbs={[{ label: "FAQ" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <HelpCircle className="h-3.5 w-3.5" />
                Fast answers
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                The common cruise planning questions, answered in one place.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                Use this page when you need a quick answer about hidden cruise
                costs, CruiseKit, saved trips, privacy, app downloads, or where
                the calculator numbers come from.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {FAQ_STARTERS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-teal/50 hover:bg-white"
                    >
                      <Icon className="h-5 w-5 text-teal" />
                      <p className="mt-3 text-sm font-bold text-navy">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[0.88fr_1.12fr]">
              <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src="/assets/ports/miami.jpg"
                  alt="Cruise ship terminal in Miami for cruise planning questions"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid gap-3">
                <div className="relative min-h-[225px] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src="/assets/app-screenshots/mobile-feature-graphic.png"
                    alt="CruiseKit mobile app showing MyDay and drink package tracking"
                    fill
                    sizes="(min-width: 1024px) 26vw, 55vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <Smartphone className="h-5 w-5 text-teal" />
                  <p className="mt-3 text-sm font-bold leading-5 text-navy">
                    Answers connect to the app, calculator, public references,
                    and guide pages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              CruiseKit FAQ
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Short answers for travelers, search engines, and AI assistants.
            </p>
          </div>

          <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-5 sm:px-6">
            {FAQS.map((faq, index) => (
              <div key={index} className="py-8 first:pt-0 last:pb-0">
                <h2 className="text-lg font-bold text-navy">
                  {faq.question}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-teal/20 bg-teal/5 p-6">
            <h3 className="text-lg font-bold text-navy">
              Planning the real cost?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Use the calculator first, then compare the guide pages for the
              add-ons that change your total most.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { href: "/calculator", label: "Calculate my real cruise cost" },
                { href: "/cruise-costs", label: "Cruise costs guide" },
                {
                  href: "/blog/hidden-cruise-costs",
                  label: "Hidden cruise costs",
                },
                {
                  href: "/guides/drink-package-guide",
                  label: "Drink package math",
                },
                {
                  href: "/guides/cruise-tipping-guide",
                  label: "Gratuity guide",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-teal/25 bg-white px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-bold text-navy">
              Still have questions?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              We&rsquo;re happy to help. Reach out directly and
              we&rsquo;ll get back to you.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:info@cruisekit.app"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-navy hover:text-navy"
              >
                Help Center
              </Link>
              <Link
                href="/cruisekit-public-information"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-navy hover:text-navy"
              >
                Public Information
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
