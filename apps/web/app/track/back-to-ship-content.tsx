"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Navigation,
  Shield,
  WifiOff,
  Clock,
  Users,
  MapPin,
  Smartphone,
  Bell,
  ArrowRight,
  Download,
  Route,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                   */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Feature data                                                        */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Clock,
    title: "Personalized Walking ETA",
    description:
      "Not just distance — your actual walking pace, adjusted in real-time.",
    color: "text-alert-green",
    bg: "bg-alert-green/10",
    border: "border-alert-green/25",
  },
  {
    icon: Bell,
    title: "Escalating Alerts",
    description:
      "Green \u2192 Yellow \u2192 Orange \u2192 Red. Alerts intensify as your time runs out.",
    color: "text-alert-orange",
    bg: "bg-alert-orange/10",
    border: "border-alert-orange/25",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description:
      "No WiFi. No data. No roaming charges. Pure GPS — works anywhere on Earth.",
    color: "text-teal",
    bg: "bg-teal/10",
    border: "border-teal/25",
  },
  {
    icon: MapPin,
    title: "Excursion Awareness (GoTime)",
    description:
      "Alerts before you miss your shore excursion meeting point, not just the ship.",
    color: "text-alert-yellow",
    bg: "bg-alert-yellow/10",
    border: "border-alert-yellow/25",
  },
  {
    icon: Users,
    title: "Group Tracking",
    description:
      "See where your travel companions are and whether they\u2019re on track to make it back.",
    color: "text-coral",
    bg: "bg-coral/10",
    border: "border-coral/25",
  },
  {
    icon: Download,
    title: "Pre-Trip Download",
    description:
      "Download your port data on WiFi before you leave the ship. Everything works offline from there.",
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/25",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Steps data                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    number: "01",
    icon: Smartphone,
    title: "Download your trip packet",
    description:
      "Connect to ship WiFi before going ashore and download your port data with one tap.",
  },
  {
    number: "02",
    icon: Navigation,
    title: "Explore freely",
    description:
      "BackToShip tracks your walking time in the background. No data connection needed.",
  },
  {
    number: "03",
    icon: Route,
    title: "Get alerts when it\u2019s time",
    description:
      "Receive escalating alerts when it\u2019s time to head back, with turn-by-turn walking directions.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Alert bar visualization                                             */
/* ------------------------------------------------------------------ */

function AlertBar() {
  const states = [
    { label: "Safe", color: "bg-alert-green", textColor: "text-white", width: "w-[35%]" },
    { label: "Watch", color: "bg-alert-yellow", textColor: "text-gray-900", width: "w-[25%]" },
    { label: "Hurry", color: "bg-alert-orange", textColor: "text-white", width: "w-[22%]" },
    { label: "Critical", color: "bg-alert-red", textColor: "text-white", width: "w-[18%]" },
  ];

  return (
    <div className="flex h-8 overflow-hidden rounded-full border border-gray-200 shadow-sm">
      {states.map((state, i) => (
        <motion.div
          key={state.label}
          className={`${state.color} ${state.textColor} ${state.width} flex items-center justify-center text-xs font-semibold`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        >
          {state.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page content                                                        */
/* ------------------------------------------------------------------ */

export default function BackToShipContent() {
  return (
    <>
      {/* ============================================================= */}
      {/*  HERO                                                          */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-navy">
        {/* Subtle background gradient orb */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-teal/8 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full bg-ocean/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            {/* Coming soon badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
                </span>
                Coming Soon
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Never miss your ship.
            </motion.h1>

            {/* Subline */}
            <motion.p
              className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              BackToShip uses offline GPS to track your walking time back to the
              pier — so you can explore every port with confidence.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <a
                href="mailto:kali@shipsafesdk.com?subject=BackToShip%20Waitlist&body=I%27d%20like%20to%20be%20notified%20when%20BackToShip%20launches!"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-dark hover:shadow-xl hover:shadow-teal/30 active:scale-[0.97]"
              >
                Get Notified When It Launches
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Alert bar preview */}
            <motion.div
              className="mt-12 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Alert Levels
              </p>
              <AlertBar />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  PROBLEM                                                       */}
      {/* ============================================================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p
              className="text-sm font-semibold uppercase tracking-wider text-alert-red"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
            >
              The problem
            </motion.p>

            <motion.h2
              className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
            >
              Every year, thousands of cruise passengers are left behind at port.
            </motion.h2>

            <motion.p
              className="mt-5 text-lg leading-relaxed text-gray-600"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={2}
            >
              Your phone&apos;s clock auto-adjusts to local time. The ship stays
              on ship time. That difference has stranded families in Cozumel,
              Roatan, and ports across the Caribbean.
            </motion.p>

            <motion.p
              className="mt-6 text-xl font-semibold text-navy"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={3}
            >
              BackToShip solves this with one simple number:{" "}
              <span className="text-teal">
                how many minutes you need to walk back.
              </span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FEATURES                                                      */}
      {/* ============================================================= */}
      <section className="border-b border-gray-200 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              className="text-sm font-semibold uppercase tracking-wider text-teal"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
            >
              Features
            </motion.p>
            <motion.h2
              className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
            >
              Everything you need to explore with confidence
            </motion.h2>
          </div>

          <motion.div
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  className={`rounded-2xl border ${feature.border} bg-white p-6 shadow-sm transition-shadow hover:shadow-md`}
                >
                  <div
                    className={`inline-flex rounded-xl ${feature.bg} p-3`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  HOW IT WORKS                                                  */}
      {/* ============================================================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              className="text-sm font-semibold uppercase tracking-wider text-ocean"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
            >
              How it works
            </motion.p>
            <motion.h2
              className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
            >
              Three steps. Total peace of mind.
            </motion.h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="relative text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  {/* Step number */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-teal">
                    Step {step.number}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>

                  {/* Connector line (desktop) */}
                  {i < STEPS.length - 1 && (
                    <div className="pointer-events-none absolute right-0 top-8 hidden w-[calc(50%-2rem)] border-t-2 border-dashed border-gray-200 lg:block translate-x-full" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  POWERED BY SHIPSAFE SDK                                       */}
      {/* ============================================================= */}
      <section className="border-b border-gray-200 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <motion.div
              className="rounded-2xl border border-navy/10 bg-navy/[0.03] p-8 sm:p-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl bg-navy p-3">
                  <Shield className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                    Powered by ShipSafe SDK
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    BackToShip is powered by the ShipSafe SDK — the same
                    maritime safety technology trusted by cruise industry
                    professionals.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    Patent pending technology. Offline-first. Conservative ETA
                    calculations because missing your ship isn&apos;t an option.
                  </p>
                  <a
                    href="https://shipsafesdk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-teal-dark"
                  >
                    Learn more about ShipSafe SDK
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  CTA SECTION                                                   */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal via-ocean to-navy">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={0}
            >
              Be the first to know when BackToShip launches.
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-white/80"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
            >
              We&apos;ll notify you when it&apos;s available for your next
              cruise.
            </motion.p>
            <motion.div
              className="mt-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={2}
            >
              <a
                href="mailto:kali@shipsafesdk.com?subject=BackToShip%20Waitlist&body=I%27d%20like%20to%20be%20notified%20when%20BackToShip%20launches!"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-navy shadow-xl transition-all hover:bg-gray-50 hover:shadow-2xl active:scale-[0.97]"
              >
                Join the Waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
