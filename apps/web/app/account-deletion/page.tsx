import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock3,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const DELETE_EMAIL =
  "mailto:info@cruisekit.app?subject=MyDay%20account%20deletion%20request";

export const metadata: Metadata = {
  title: "Delete Your MyDay by CruiseKit Account",
  description:
    "Request deletion of your MyDay by CruiseKit account and associated cloud data, including options when you cannot access the app.",
  alternates: {
    canonical: "https://cruisekit.app/account-deletion",
  },
};

export default function AccountDeletionPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50/60">
        <section className="border-b border-slate-200 bg-navy text-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/15 text-coral">
              <Trash2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-teal">
              Account and data controls
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Delete your MyDay by CruiseKit account
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
              This page covers the MyDay experience inside the CruiseKit mobile
              app. You can start deletion in the app or request help here if you
              cannot sign in or no longer have access to the app.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <DeletionOption
              icon={<Smartphone className="h-5 w-5" aria-hidden="true" />}
              title="Delete from the app"
              body="Open MyDay by CruiseKit, go to More, open Settings, and choose Delete account. Review the scope, enter the confirmation shown in the app, and submit."
            />
            <DeletionOption
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              title="Cannot access the app?"
              body="Email us from the address connected to your account when possible. We may ask for limited information to verify account ownership, but we will never ask for your password or sign-in code."
              action={
                <a
                  href={DELETE_EMAIL}
                  className="mt-5 inline-flex rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
                >
                  Email a deletion request
                </a>
              }
            />
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-teal" aria-hidden="true" />
              <div>
                <h2 className="text-2xl font-bold text-navy">
                  What account deletion covers
                </h2>
                <p className="mt-2 leading-7 text-slate-600">
                  An authenticated deletion removes the Firebase Authentication
                  account and CruiseKit cloud records linked to its user ID.
                </p>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-700 sm:grid-cols-2">
              <li className="rounded-xl bg-slate-50 p-4">
                Account profile and saved CruiseKit data stored under your user
                record, including saved deals or saved cruises.
              </li>
              <li className="rounded-xl bg-slate-50 p-4">
                MyCrew membership, manual check-ins, any legacy location record,
                and messages authored by your account.
              </li>
              <li className="rounded-xl bg-slate-50 p-4">
                Deal-request records in Firestore that are linked to your user
                ID.
              </li>
              <li className="rounded-xl bg-slate-50 p-4">
                An empty MyCrew group you solely own. If other members remain,
                the group stays available to them and ownership transfers.
              </li>
            </ul>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <InfoCard
              icon={<Users className="h-5 w-5" aria-hidden="true" />}
              title="Shared and local data"
            >
              <p>
                Deleting your account does not delete another member&rsquo;s
                MyCrew data. Spend entries, budgets, port notes, and other data
                stored only on your device must be cleared in the app or by
                removing the app; CruiseKit cannot remotely erase local device
                storage.
              </p>
            </InfoCard>
            <InfoCard
              icon={<Clock3 className="h-5 w-5" aria-hidden="true" />}
              title="Timing and limited retention"
            >
              <p>
                In-app deletion begins immediately. Support requests are
                completed within 30 days after we can verify the account.
                Limited security logs, provider backups, and prior support or
                deal-request emails may remain until their normal retention
                period ends.
              </p>
            </InfoCard>
          </div>

          <div className="mt-10 rounded-2xl border border-teal/20 bg-teal/5 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy">Need more detail?</h2>
            <p className="mt-2 leading-7 text-slate-600">
              Read how CruiseKit handles account, MyDay, MyCrew, local device,
              analytics, and support data in the Privacy Policy, or contact us
              with a deletion question.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/privacy"
                className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Read the Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
              >
                Contact CruiseKit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function DeletionOption({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal-dark">
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-bold text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      {action}
    </article>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-teal-dark">
        {icon}
        <h2 className="text-lg font-bold text-navy">{title}</h2>
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
    </article>
  );
}
