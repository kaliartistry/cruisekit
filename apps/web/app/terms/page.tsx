import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms of Service — CruiseKit",
  description:
    "CruiseKit terms of service. Understand the terms under which CruiseKit provides its free cruise planning tools.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: March 30, 2026
          </p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-gray-700">
            {/* 1 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using CruiseKit (&ldquo;the Service&rdquo;),
                operated at <strong>cruisekit.app</strong>, you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use the Service.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                2. Nature of the Service
              </h2>
              <p>
                CruiseKit is a free cruise planning toolkit.{" "}
                <strong>
                  CruiseKit is not a travel agency and does not book cruises.
                </strong>{" "}
                We do not sell, arrange, or facilitate travel bookings. All
                booking decisions are made directly between you and the cruise
                line or booking platform you choose.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                3. Pricing Data and Estimates
              </h2>
              <p>
                The pricing information displayed on CruiseKit, including
                data from the True Cost Calculator, cruise deal listings, and
                cost comparisons, consists of{" "}
                <strong>estimates based on publicly available data</strong>.
                Prices are subject to change at any time and may not reflect
                current fares, promotions, or availability. Always verify
                pricing directly with the cruise line before booking.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                4. BackToShip GPS Disclaimer
              </h2>
              <p>
                The BackToShip GPS feature is a{" "}
                <strong>planning aid only and not a guarantee</strong>.
                CruiseKit is not responsible for missed departures, delayed
                returns, or any consequences resulting from reliance on the
                BackToShip feature. GPS accuracy depends on your device and
                environmental conditions. Always allow ample time to return to
                your ship and follow the cruise line&rsquo;s official
                all-aboard time.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                5. Informational Content
              </h2>
              <p>
                All content on CruiseKit, including guides, blog posts, port
                information, and cost breakdowns, is provided{" "}
                <strong>for informational purposes only</strong>. We make
                reasonable efforts to ensure accuracy, but we do not guarantee
                that all information is complete, current, or error-free. You
                should independently verify any information before making
                travel decisions.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                6. Affiliate Disclosure
              </h2>
              <p>
                CruiseKit contains affiliate links to cruise lines and
                booking platforms. When you click these links and complete a
                purchase, we may earn a small commission at no additional cost
                to you. Affiliate relationships do not influence our
                editorial content, cost calculations, or recommendations.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                7. User Accounts
              </h2>
              <p>
                Some features (such as saving trips) require you to sign in
                with a Google account via Firebase Authentication. You are
                responsible for maintaining the security of your account. We
                reserve the right to suspend or terminate accounts that
                violate these terms.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                8. Intellectual Property
              </h2>
              <p>
                All content, design, code, and data compilations on CruiseKit
                are the property of CruiseKit and its creator, unless
                otherwise noted. Cruise line names, logos, and trademarks
                belong to their respective owners and are used on CruiseKit
                for identification purposes only.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                9. Limitation of Liability
              </h2>
              <p>
                CruiseKit is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, express or
                implied. To the maximum extent permitted by law, CruiseKit
                and its creator shall not be liable for any direct, indirect,
                incidental, consequential, or punitive damages arising from
                your use of the Service, including but not limited to
                financial losses from reliance on pricing estimates or missed
                ship departures.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                10. Changes to These Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time. If we
                make material changes, we will update the &ldquo;Last
                updated&rdquo; date at the top of this page. Your continued
                use of CruiseKit after any changes constitutes acceptance of
                the updated terms.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                11. Contact
              </h2>
              <p>
                If you have questions about these Terms of Service, contact
                us at{" "}
                <a
                  href="mailto:kali@shipsafesdk.com"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
                >
                  kali@shipsafesdk.com
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
