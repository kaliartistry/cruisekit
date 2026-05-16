import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CruiseKit privacy policy. Learn how we handle your data, what we collect, and what we don't.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: May 16, 2026
          </p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-gray-700">
            {/* 1 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                1. Introduction
              </h2>
              <p>
                CruiseKit (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) operates the website at{" "}
                <strong>cruisekit.app</strong> and the CruiseKit mobile app.
                This Privacy Policy explains what information we collect, how
                we use it, and the choices you have. We are committed to
                protecting your privacy and being transparent about our data
                practices.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                2. Information We Collect
              </h2>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                2.1 Account Information
              </h3>
              <p className="mb-4">
                When you sign in with Google via Firebase Authentication, we
                receive your name, email address, and profile photo from your
                Google account. We use this information solely to identify
                your account and personalize your experience.
              </p>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                2.2 Saved Trip Data
              </h3>
              <p className="mb-4">
                If you save trips or cruise comparisons, that data is stored
                in Firebase Firestore and associated with your account. This
                data is used only to provide the &ldquo;My Trips&rdquo;
                feature and is not shared with any third party.
              </p>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                2.3 Analytics Data
              </h3>
              <p className="mb-4">
                We use Google Analytics and Firebase Analytics to understand
                how visitors and app testers use CruiseKit. Analytics events
                may include pages viewed, feature usage, deal shortlist
                actions, deal handoff actions, device type, and general
                geographic region. Deal funnel analytics do not include lead
                form names, emails, phone numbers, or notes.
              </p>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                2.4 Location Data
              </h3>
              <p className="mb-4">
                In the mobile app, CruiseKit may request location permission
                for active GoTime return-to-ship guidance and for one-time
                MyCrew check-ins that you choose to share. MyCrew check-ins
                are intentional status updates; CruiseKit does not use MyCrew
                as continuous live tracking.
              </p>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                2.5 Deal and Support Requests
              </h3>
              <p>
                If you ask CruiseKit for help with a deal or contact support,
                we may collect the name, email address, phone number, and note
                you provide so we can respond to your request.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                3. What We Do NOT Collect
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>No tracking cookies.</strong> CruiseKit does not use
                  cookies for advertising or cross-site tracking. The only
                  cookies on the site are those required by Firebase
                  Authentication and Google Analytics.
                </li>
                <li>
                  <strong>No payment information.</strong> CruiseKit is a free
                  tool. We do not process payments or store any financial
                  data.
                </li>
                <li>
                  <strong>No always-on MyCrew tracking.</strong> MyCrew uses
                  one-time check-ins. GoTime location guidance is used only
                  while active return-to-ship guidance is running.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                4. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  Provide, maintain, and improve CruiseKit&rsquo;s features
                </li>
                <li>
                  Authenticate your account and restore saved trips
                </li>
                <li>
                  Understand usage patterns so we can improve the product
                </li>
                <li>
                  Measure deal shortlist, handoff, and booking-link funnel
                  performance
                </li>
                <li>
                  Respond to support requests and feedback
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                5. Data Sharing
              </h2>
              <p>
                <strong>We do not sell your personal data.</strong> We do not
                share your personal information with third parties for
                marketing purposes. The only third-party services that
                receive data are:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  <strong>Firebase (Google)</strong> &mdash; for
                  authentication and data storage
                </li>
                <li>
                  <strong>Google Analytics</strong> &mdash; for anonymized
                  usage analytics
                </li>
                <li>
                  <strong>Firebase Analytics</strong> &mdash; for mobile app
                  usage and deal funnel analytics
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                6. Affiliate Links
              </h2>
              <p>
                CruiseKit contains affiliate links to cruise line websites
                and booking platforms. When you click these links and make a
                purchase, we may earn a small commission. These links do not
                track you on CruiseKit&rsquo;s site. Once you click an
                affiliate link, you are subject to that third party&rsquo;s
                own privacy policy.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                7. Data Retention
              </h2>
              <p>
                Your account data and saved trips are retained as long as you
                have an active account. If you wish to delete your data,
                contact us at{" "}
                <a
                  href="mailto:hello@cruisekit.app"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
                >
                  hello@cruisekit.app
                </a>{" "}
                and we will delete your account and all associated data
                within 30 days.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                8. Children&rsquo;s Privacy
              </h2>
              <p>
                CruiseKit is not directed at children under the age of 13. We
                do not knowingly collect personal information from children.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. If we
                make material changes, we will update the &ldquo;Last
                updated&rdquo; date at the top of this page. Your continued
                use of CruiseKit after any changes constitutes acceptance of
                the updated policy.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-navy">
                10. Contact
              </h2>
              <p>
                If you have questions about this Privacy Policy, contact us
                at{" "}
                <a
                  href="mailto:hello@cruisekit.app"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
                >
                  hello@cruisekit.app
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
