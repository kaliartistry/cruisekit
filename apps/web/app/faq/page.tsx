import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "FAQ — CruiseKit",
  description:
    "Frequently asked questions about CruiseKit, the free cruise planning toolkit. Learn about the True Cost Calculator, MyDay, data accuracy, and more.",
  keywords: [
    "cruisekit faq",
    "cruise planning questions",
    "true cost calculator help",
    "cruise day planner",
    "cruise planning tool help",
  ],
};

const FAQS = [
  {
    question: "What is CruiseKit?",
    answer:
      "CruiseKit is a free, independent cruise planning toolkit. It gives you tools to calculate the true cost of a cruise, explore port-day options, coordinate group trips, manage your daily cruise schedule and spending, and compare loyalty programs across major cruise lines. Think of it as your planning companion before and during a cruise.",
  },
  {
    question: "Is CruiseKit a travel agency?",
    answer:
      "No. CruiseKit does not sell, book, or arrange cruises. We are a planning tool that helps you research and compare before you book directly with a cruise line or your preferred travel agent. Some links on our site are affiliate links, which means we may earn a small commission if you book through them, but we never handle bookings ourselves.",
  },
  {
    question: "How accurate is the True Cost Calculator?",
    answer:
      "The True Cost Calculator uses publicly available pricing data for gratuities, drink packages, Wi-Fi, specialty dining, and other common add-ons across 9 major cruise lines. Prices are updated regularly but are estimates — actual costs may vary based on your sailing date, ship, cabin category, and current promotions. Always confirm final pricing directly with the cruise line before booking.",
  },
  {
    question: "Where does the pricing data come from?",
    answer:
      "Our pricing data is sourced from official cruise line websites, public fare listings, and published add-on pricing schedules. We cross-reference multiple sources and update data regularly. However, cruise lines frequently adjust their pricing, so we recommend verifying any numbers that are critical to your booking decision.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. CruiseKit uses Firebase Authentication (Google sign-in) for accounts and Firebase Firestore for saved trip data. We do not use tracking cookies, we do not sell your data, and we do not share personal information with third parties for marketing. The MyDay MyCrew location feature processes your location entirely on your device — we never store or transmit your location to our servers.",
  },
  {
    question: "How do I save cruises and trips?",
    answer:
      "Sign in with your Google account using the sign-in button in the navigation bar. Once signed in, you can save cruise comparisons and trip plans to your \"My Trips\" dashboard. Your saved data syncs across devices and is stored securely in Firebase.",
  },
  {
    question: "What is MyDay?",
    answer:
      "MyDay is CruiseKit's during-cruise command center. It includes a daily schedule with ship time / port time clocks and all-aboard countdown, an onboard spend tracker that compares your actual spending to your budget from the Plan calculator, and a Crew tab for real-time group coordination with location sharing and chat.",
  },
  {
    question: "Is CruiseKit free?",
    answer:
      "Yes, CruiseKit is completely free to use. We sustain the platform through affiliate links — when you click through to a cruise line's website and book, we may earn a small commission at no extra cost to you. This model lets us keep all tools free and accessible.",
  },
  {
    question: "Can I use CruiseKit on my phone?",
    answer:
      "Yes. CruiseKit is fully responsive and works on mobile browsers. The MyDay feature is specifically designed for mobile use during your cruise. No app download is required — just visit cruisekit.app in your phone's browser.",
  },
  {
    question: "How do I contact you?",
    answer:
      "CruiseKit is built and maintained by a solo developer. You can reach us directly at kali@shipsafesdk.com for bug reports, feature requests, data corrections, or general feedback. We read every email.",
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
                href="mailto:kali@shipsafesdk.com"
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
