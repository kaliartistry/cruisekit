import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  CRUISEKIT_BOILERPLATE,
  CRUISEKIT_DESCRIPTION,
  CRUISEKIT_KEY_FACTS,
  CRUISEKIT_PRESS_EMAIL,
  CRUISEKIT_TAGLINE,
} from "@/lib/config/brand-facts";

export const metadata: Metadata = {
  title: "Press Kit",
  description: CRUISEKIT_DESCRIPTION,
  alternates: { canonical: "/press/" },
  openGraph: {
    title: "CruiseKit Press Kit",
    description: CRUISEKIT_DESCRIPTION,
    url: "/press/",
    images: [{ url: "/cruisekit-logo-square.png", width: 512, height: 512 }],
  },
};

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Link href="/" className="text-sm text-gray-600 underline underline-offset-4">
              CruiseKit home
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Press kit
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              CruiseKit
            </h1>
            <p className="mt-4 text-xl text-gray-600">{CRUISEKIT_TAGLINE}</p>
          </div>
        </section>
        <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-bold text-navy">About CruiseKit</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">{CRUISEKIT_BOILERPLATE}</p>
          </section>
          <section aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="text-2xl font-bold text-navy">Key facts</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {CRUISEKIT_KEY_FACTS.map((fact) => (
                <li key={fact} className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-base font-medium text-navy">
                  {fact}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="logo-heading" className="grid gap-8 rounded-2xl border border-gray-200 p-6 sm:grid-cols-[160px_1fr] sm:p-8">
            <Image src="/cruisekit-logo-square.png" alt="CruiseKit logo" width={160} height={160} className="h-40 w-40 object-contain" />
            <div>
              <h2 id="logo-heading" className="text-2xl font-bold text-navy">Official logo</h2>
              <p className="mt-3 text-gray-600">Download the existing CruiseKit logo in PNG or SVG format.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/cruisekit-logo-square.png" download="cruisekit-logo.png" className="rounded-lg bg-navy px-5 py-3 font-semibold text-white">Download PNG</a>
                <a href="/cruisekit-logo-square.svg" download="cruisekit-logo.svg" className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-navy">Download SVG</a>
              </div>
            </div>
          </section>
          <section aria-labelledby="contact-heading" className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-navy">Founder</h2>
              <p className="mt-3 text-lg text-gray-600">Kali McCarthy, Kali Artistry</p>
            </div>
            <div>
              <h2 id="contact-heading" className="text-2xl font-bold text-navy">Press contact</h2>
              <a href={`mailto:${CRUISEKIT_PRESS_EMAIL}`} className="mt-3 inline-block break-all text-lg font-medium text-navy underline underline-offset-4">{CRUISEKIT_PRESS_EMAIL}</a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
