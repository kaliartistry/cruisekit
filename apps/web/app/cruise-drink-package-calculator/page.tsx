import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DrinkPackageCalculator from "@/components/calculator/drink-package-calculator";

const PAGE_URL = "https://cruisekit.app/cruise-drink-package-calculator/";
const PAGE_TITLE =
  "Cruise Drink Package Calculator: Find the Best Value for Your Sailing";
const PAGE_DESCRIPTION =
  "Use our cruise drink package calculator to estimate whether Carnival CHEERS, Royal Caribbean Deluxe, NCL Free at Sea, Princess Plus, MSC, Celebrity, Holland America, or Virgin Bar Tab is worth it based on your planned onboard purchases.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "cruise drink package calculator",
    "cruise drink package break even calculator",
    "best cruise drink package calculator",
    "drink package calculator cruise",
    "cruise beverage package calculator",
    "is a cruise drink package worth it",
    "how many drinks to break even on a cruise",
    "Carnival CHEERS calculator",
    "Royal Caribbean drink package calculator",
    "NCL Free at Sea drinks worth it",
    "Princess Plus worth it",
    "MSC Premium Extra worth it",
    "Celebrity Classic vs Premium drink package",
    "Holland America drink package worth it",
    "Virgin Voyages Bar Tab calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/cruisekit_square.png",
        width: 512,
        height: 512,
        alt: "CruiseKit cruise drink package calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/cruisekit_square.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqs = [
  {
    question: "What is the best cruise drink package calculator?",
    answer:
      "The best calculator for your cruise is one that uses your actual sailing price, applies cruise-line-specific rules, and lets you compare package cost against what you already plan to buy onboard.",
  },
  {
    question:
      "How many drinks do you need to break even on a cruise drink package?",
    answer:
      "The break-even point depends on the package price, service charge, required buyers, cruise length, and the menu value of drinks or non-alcoholic items you would already buy. Many packages land near 5 to 8 paid drinks per day for one buyer, but cabin rules and port days can change the result.",
  },
  {
    question: "Is Carnival CHEERS worth it?",
    answer:
      "Carnival CHEERS can be worth it when the cabin's planned daily beverage value beats the package price plus 20% service charge. The all-adults-in-cabin rule, 15 alcoholic-drink daily cap, and private destination restrictions are important parts of the math.",
  },
  {
    question: "Is Royal Caribbean's Deluxe Beverage Package worth it?",
    answer:
      "Royal Caribbean uses dynamic package pricing, so the calculator asks for the exact Cruise Planner price. Once you enter that price, compare it against your planned daily onboard purchases and the all-adults-in-cabin rule.",
  },
  {
    question: "Is NCL Free at Sea worth it for drinks?",
    answer:
      "NCL Free at Sea is a bundle, not a clean standalone drink package. Use a drinks-only view if you want beverage math, or include Wi-Fi, dining, excursion credit, and other perks when those are items you would otherwise buy.",
  },
  {
    question: "Is Princess Plus worth it?",
    answer:
      "Princess Plus can be worth it when drinks, Wi-Fi, crew appreciation, dining, and other included perks beat the daily bundle price for the guests covered by the package. For a drinks-only answer, set non-drink perk values to zero.",
  },
  {
    question: "Is Virgin Voyages Bar Tab a drink package?",
    answer:
      "No. Virgin Voyages Bar Tab is prepaid drink credit. The calculator compares available credit against expected total spend and avoids unlimited package or break-even drink language.",
  },
  {
    question: "Why do some cruise lines require me to enter the package price?",
    answer:
      "Some cruise lines change beverage package prices by ship, date, itinerary, booking portal, offer, or fare selection. Entering the price from your cruise planner gives a more useful estimate than hardcoding a generic number.",
  },
];

const lineSections = [
  {
    title: "Carnival Drink Package Calculator",
    body: "Carnival CHEERS uses a public default price, a 20% service charge, the all-adults-in-cabin rule, and a 15 alcoholic-drink daily cap. The calculator also keeps private destination restrictions visible.",
  },
  {
    title: "Royal Caribbean Drink Package Calculator",
    body: "Royal Caribbean Deluxe Beverage Package prices vary by sailing, so use the exact Cruise Planner price. The calculator applies buyer rules and compares the result with your planned onboard purchases.",
  },
  {
    title: "NCL Free at Sea Drink Value",
    body: "NCL Free at Sea and Free at Sea Plus are modeled as bundle packages, not simple standalone drink packages. You can compare drinks only or count Wi-Fi, dining, shore excursion credit, and other perks.",
  },
  {
    title: "Princess Plus and Premier Drink Value",
    body: "Princess beverage-only packages use standard package math, while Princess Plus and Princess Premier use bundle logic so crew appreciation, Wi-Fi, dining, photos, and other perks can be included or excluded.",
  },
  {
    title: "MSC Premium Extra Drink Package",
    body: "MSC Premium Extra requires the price from MyMSC before showing a result. The calculator keeps the all-guests-in-cabin rule and 15 alcoholic-drinks-per-day cap visible.",
  },
  {
    title: "Celebrity Classic vs Premium Drink Package",
    body: "Celebrity Classic and Premium require user-entered pricing and preserve the 20% gratuity assumption where applicable. Celebrity All Included is treated as a bundled fare.",
  },
  {
    title: "Holland America Signature, Elite, and Have It All",
    body: "Holland America Signature and Elite use standard package math, while Have It All uses bundle logic. Signature notes that the 15-drink cap includes alcoholic and non-alcoholic drinks.",
  },
  {
    title: "Virgin Voyages Bar Tab Calculator",
    body: "Virgin Bar Tab is modeled as prepaid credit. The result compares available credit against expected spend and warns that unused credit may be forfeited.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Cruise Drink Package Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description: PAGE_DESCRIPTION,
      publisher: {
        "@type": "Organization",
        name: "CruiseKit",
        url: "https://cruisekit.app",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://cruisekit.app/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cruise Drink Package Calculator",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
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

export default function CruiseDrinkPackageCalculatorPage() {
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
        <section className="border-b border-gray-200 bg-gray-50/70">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-1 text-sm text-gray-500">
                <li>
                  <Link href="/" className="transition-colors hover:text-navy">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gray-400">
                  /
                </li>
                <li className="font-medium text-gray-700">
                  Cruise Drink Package Calculator
                </li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
                Cruise Drink Package Calculator
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-700">
                Estimate whether a drink package, bundled fare, or prepaid Bar
                Tab is the best value for your sailing based on planned onboard
                purchases, cabin rules, service charges, and line-specific
                package limits.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  Cruise-line-specific rules
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  Service charges and buyer limits
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  Source-backed assumptions
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <DrinkPackageCalculator />
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy">
              How This Calculator Works
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-700">
              <p>
                The calculator compares the package cost against the estimated
                pay-as-you-go value of drinks and non-alcoholic beverages you
                would probably buy anyway. For standard drink packages, the key
                number is the daily break-even value after service charges and
                required buyers.
              </p>
              <p>
                Dynamic-price packages, including Royal Caribbean Deluxe,
                MSC Premium Extra, and Celebrity Classic or Premium, require
                your actual cruise planner or booking portal price before the
                estimate is useful.
              </p>
              <p>
                Bundles such as NCL Free at Sea, Princess Plus, Princess
                Premier, Celebrity All Included, and Holland America Have It All
                are not pure beverage products. Use drinks-only mode for a
                beverage comparison, or count the Wi-Fi, crew appreciation,
                dining, excursion credit, and other perks you would otherwise
                buy.
              </p>
              <p>
                Virgin Voyages Bar Tab is prepaid credit, so it uses credit
                math instead of unlimited-package break-even language. The
                result compares available credit with expected total spend and
                notes that unused credit may be forfeited.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50/70">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-navy">
                Cruise Line Drink Package Sections
              </h2>
              <p className="mt-3 text-gray-600">
                Use the same calculator for cruise beverage package calculator
                math across major lines, while keeping each line&apos;s limits,
                warnings, and package classifications separate.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {lineSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <h3 className="text-lg font-bold text-navy">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy">
              Cruise Drink Package FAQ
            </h2>
            <div className="mt-7 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-xl border border-gray-200 bg-gray-50"
                >
                  <summary className="cursor-pointer px-5 py-4 text-base font-bold text-navy">
                    {faq.question}
                  </summary>
                  <p className="border-t border-gray-200 px-5 py-4 text-sm leading-relaxed text-gray-700">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
