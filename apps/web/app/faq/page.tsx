import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

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
      "Yes. CruiseKit uses Firebase Authentication (Google sign-in) for accounts and Firebase Firestore for saved trip data. We do not use tracking cookies, we do not sell your data, and we do not share personal information with third parties for marketing. MyDay is built around user-entered schedule, spend, and crew status data, not background location tracking.",
  },
  {
    question: "How do I save cruises and trips?",
    answer:
      "Sign in with your Google account using the sign-in button in the navigation bar. Once signed in, you can save cruise comparisons and trip plans to your \"My Trips\" dashboard. Your saved data syncs across devices and is stored securely in Firebase.",
  },
  {
    question: "What is MyDay?",
    answer:
      "MyDay is CruiseKit's during-cruise command center. It includes a daily schedule with ship time / port time clocks, itinerary-based all-aboard context, an onboard spend tracker that compares actual spending to your Plan budget, and MyCrew status check-ins for lightweight group coordination.",
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

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about CruiseKit and how it works."
          breadcrumbs={[{ label: "FAQ" }]}
        />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl divide-y divide-gray-200">
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
                Email Us
              </a>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-navy hover:text-navy"
              >
                Help Center
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
