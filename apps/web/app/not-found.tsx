import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Page Not Found | CruiseKit",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          This page has sailed.
        </h1>
        <p className="mt-4 max-w-md text-base text-gray-600">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          Head back to the homepage or try one of these.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-teal px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-dark"
          >
            Back to home
          </Link>
          <Link
            href="/calculator/"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Cost calculator
          </Link>
          <Link
            href="/ports/"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Port guides
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
