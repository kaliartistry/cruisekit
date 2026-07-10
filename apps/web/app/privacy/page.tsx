import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AnalyticsPreferenceButton } from "@/components/shared/analytics-loader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CruiseKit handles account, MyDay, MyCrew, local device, analytics, diagnostics, and support data.",
  alternates: {
    canonical: "https://cruisekit.app/privacy",
  },
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
            Last updated: July 10, 2026
          </p>

          <div className="mt-10 space-y-9 text-base leading-relaxed text-gray-700">
            <PolicySection title="1. Scope">
              <p>
                CruiseKit (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) operates cruisekit.app and the CruiseKit
                mobile app, including the MyDay and MyCrew experiences. This
                policy describes the information those services handle, why we
                use it, and the controls available to you.
              </p>
            </PolicySection>

            <PolicySection title="2. Information we handle">
              <Subheading>Account and sign-in information</Subheading>
              <p>
                CruiseKit can use anonymous Firebase Authentication and, when
                you choose to link an account, Google or Apple sign-in. Depending
                on the method, Firebase Authentication and the identity provider
                may provide a user ID, name, email address, profile image, and
                provider identifier. Anonymous accounts generally have a user ID
                without a name or email address.
              </p>

              <Subheading>Saved cruise and MyDay information</Subheading>
              <p>
                Saved cruises, itinerary choices, cabin details you enter,
                schedule items, all-aboard entries, and related planning data may
                be associated with your account in Firebase Firestore or kept on
                your device, depending on the feature. Spend entries, budgets,
                drink-package tracking, and port-planning notes are planning
                records you enter; they are not bank, card, or payment-processor
                records and are currently stored locally on the device.
              </p>

              <Subheading>MyCrew information</Subheading>
              <p>
                If you use MyCrew, Firestore stores group details, membership,
                display names, messages, and manual status check-ins you
                intentionally share. The current app does not request or collect
                precise or approximate location and does not provide live or
                background location tracking. Other members of a group can see
                shared group content while they remain members. Account deletion
                also removes any legacy MyCrew location records from older builds.
              </p>

              <Subheading>Support and deal requests</Subheading>
              <p>
                When you contact us or request help with a cruise deal, we handle
                the name, email, phone number, note, cruise details, and other
                information you submit so we can respond. These requests may
                also create support emails through our email provider.
              </p>

              <Subheading>Usage, device, and diagnostic information</Subheading>
              <p>
                If you allow optional website analytics, Google Analytics may
                receive page and feature interactions, device/browser details,
                approximate region, and campaign information. The mobile app may
                use Firebase Analytics and Firebase Crashlytics for feature use,
                app/device details, crash reports, diagnostics, and identifiers
                used by those services. Do not include private information in
                free-text fields when reporting a problem.
              </p>
            </PolicySection>

            <PolicySection title="3. Website analytics choice and local technologies">
              <p>
                CruiseKit keeps Google Analytics off on this website unless you
                choose to allow it. We save only your analytics choice in local
                storage for this control. Essential browser storage used for
                authentication, security, saved preferences, or core site
                operation is not disabled by the analytics choice.
              </p>
              <p className="mt-3">
                <AnalyticsPreferenceButton />.
              </p>
            </PolicySection>

            <PolicySection title="4. How we use information">
              <ul className="list-disc space-y-2 pl-5">
                <li>Authenticate accounts and restore account-linked data.</li>
                <li>Provide MyDay, saved cruise, MyCrew, and support features.</li>
                <li>Keep shared groups working for their remaining members.</li>
                <li>Respond to support and deal requests.</li>
                <li>
                  Understand reliability and feature use, where analytics or
                  diagnostics are enabled.
                </li>
                <li>Prevent abuse, investigate errors, and protect the service.</li>
              </ul>
            </PolicySection>

            <PolicySection title="5. Service providers and sharing">
              <p>
                We do not sell personal information and do not share it with
                third parties for their independent marketing. Providers process
                information for CruiseKit only as needed to deliver their
                services:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Google Firebase</strong> for Authentication,
                  Firestore, Analytics, and Crashlytics.
                </li>
                <li>
                  <strong>Google Analytics</strong> for optional website usage
                  measurement after consent.
                </li>
                <li>
                  <strong>Google and Apple</strong> when you choose their sign-in
                  methods.
                </li>
                <li>
                  <strong>Resend and our email systems</strong> for support,
                  deal-request notifications, and replies.
                </li>
                <li>
                  <strong>GitHub</strong> for static website hosting and
                  deployment infrastructure.
                </li>
              </ul>
              <p className="mt-3">
                Affiliate or booking sites receive information under their own
                policies only after you choose to follow an outbound link. We do
                not send them your MyDay or MyCrew records.
              </p>
            </PolicySection>

            <PolicySection title="6. Payments and financial information">
              <p>
                CruiseKit does not process cruise bookings, card payments, or
                bank transactions, and we do not collect card or bank account
                numbers. The Spend feature stores user-entered planning amounts
                locally so you can compare onboard spending with a budget; it is
                not connected to your payment card or cruise-line folio.
              </p>
            </PolicySection>

            <PolicySection title="7. Retention and deletion">
              <p>
                Account profile and account-linked Firestore data are generally
                kept while the account remains active. MyCrew messages and group
                data remain available to group members until removed through the
                product or account-deletion process. Local device data remains
                until you clear it in the app or remove the app.
              </p>
              <p className="mt-3">
                You can request deletion from MyDay by CruiseKit even if you can
                no longer access the app. Authenticated deletion removes the
                account, account-linked Firestore records, MyCrew membership,
                check-in/location data, messages authored by the account, and
                requester-linked lead records. Shared groups remain for other
                members; an empty group owned only by the requester is deleted.
                See the{" "}
                <Link
                  href="/account-deletion"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 hover:text-teal-dark"
                >
                  account-deletion instructions
                </Link>
                .
              </p>
              <p className="mt-3">
                In-app deletion begins immediately. Verified email requests are
                completed within 30 days. Limited security logs, provider
                backups, diagnostics, and prior support or deal-request emails
                may remain until their normal retention periods end. We do not
                use retained copies to recreate a deleted account.
              </p>
            </PolicySection>

            <PolicySection title="8. Security and your choices">
              <p>
                We use access controls and Firebase security rules to limit
                account and MyCrew data to authorized users. No internet service
                can promise absolute security. You can choose whether to link an
                identity provider, whether to share a manual MyCrew status, and
                whether to allow website analytics. Do not send passwords,
                sign-in codes, or card details to CruiseKit support.
              </p>
            </PolicySection>

            <PolicySection title="9. Children">
              <p>
                CruiseKit is not directed to children under 13, and we do not
                knowingly collect personal information from children under 13.
                A parent or guardian who believes a child submitted information
                can contact us to request review and deletion.
              </p>
            </PolicySection>

            <PolicySection title="10. Changes and contact">
              <p>
                We may update this policy as CruiseKit changes. We will update
                the date at the top when we make changes. Questions, privacy
                requests, and account-deletion support can be sent to{" "}
                <a
                  href="mailto:info@cruisekit.app"
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 hover:text-teal-dark"
                >
                  info@cruisekit.app
                </a>
                , or through the{" "}
                <Link
                  className="font-medium text-teal underline decoration-teal/30 underline-offset-2 hover:text-teal-dark"
                  href="/contact"
                >
                  contact page
                </Link>
                .
              </p>
            </PolicySection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-navy">{title}</h2>
      {children}
    </section>
  );
}

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-gray-800 first:mt-0">
      {children}
    </h3>
  );
}
