"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Menu,
  X,
  Calculator,
  Map,
  Navigation,
  Star,
  Anchor,
  BookOpen,
  ChevronDown,
  Heart,
  LogOut,
  Scale,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";
import {
  APP_STORE_STATUS,
  APP_STORE_URL,
  PLAY_STORE_STATUS,
  PLAY_STORE_URL,
  isStoreLive,
} from "@/lib/config/app-store-urls";
import { trackDownloadCtaClicked } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Compare", href: "/compare", icon: Scale },
  { label: "Sailings", href: "/cruises", icon: Anchor },
  { label: "Ports", href: "/ports", icon: Map },
  { label: "MyDay", href: "/myday", icon: Navigation },
  { label: "Loyalty", href: "/loyalty", icon: Star },
  { label: "Guides", href: "/guides", icon: BookOpen },
] as const;

const CALCULATOR_LINKS = [
  {
    label: "Total Cruise Cost Calculator",
    shortLabel: "Total Cruise Cost",
    href: "/calculator",
    description: "Estimate fare, fees, gratuities, drinks, WiFi, and port spending.",
  },
  {
    label: "Drink Package Calculator",
    shortLabel: "Drink Package",
    href: "/cruise-drink-package-calculator",
    description: "Compare drink packages, bundled fares, service charges, and Bar Tab credit.",
  },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCalculatorsOpen, setMobileCalculatorsOpen] = useState(false);
  const [calculatorsOpen, setCalculatorsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const calculatorsMenuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileCalculatorsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close floating menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }

      if (
        calculatorsMenuRef.current &&
        !calculatorsMenuRef.current.contains(e.target as Node)
      ) {
        setCalculatorsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCalculatorsOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "?";
  const iosLive = isStoreLive(APP_STORE_STATUS, APP_STORE_URL);
  const androidLive = isStoreLive(PLAY_STORE_STATUS, PLAY_STORE_URL);
  const mobileAppLive = iosLive || androidLive;
  const mobileLaunchText =
    iosLive && androidLive
      ? "CruiseKit is live on iPhone and Android."
      : iosLive
        ? "CruiseKit for iPhone is live."
        : "CruiseKit for Android is live.";
  const trackAppDownload = () => trackDownloadCtaClicked("unknown", "other");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-md bg-white/85",
        scrolled
          ? "border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "border-b border-transparent"
      )}
    >
      {mobileAppLive && (
        <div className="border-b border-white/10 bg-navy text-white">
          <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2 font-semibold">
              <Smartphone className="h-3.5 w-3.5 shrink-0 text-teal" strokeWidth={2.2} />
              <span className="truncate">{mobileLaunchText}</span>
            </div>
            <Link
              href="/app"
              onClick={trackAppDownload}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-bold text-navy transition-colors hover:bg-teal hover:text-white"
            >
              Download free
              <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      )}

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Ship className="h-7 w-7 text-teal" strokeWidth={2} />
          <span className="text-lg font-bold tracking-tight text-navy font-sans">
            CruiseKit
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.slice(0, 1).map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                    "text-gray-600 transition-colors",
                    "hover:text-navy hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}

          <li className="relative" ref={calculatorsMenuRef}>
            <button
              type="button"
              onClick={() => setCalculatorsOpen((prev) => !prev)}
              aria-expanded={calculatorsOpen}
              aria-haspopup="menu"
              aria-controls="desktop-calculators-menu"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                "text-gray-600 transition-colors",
                "hover:bg-gray-50 hover:text-navy",
                "focus:outline-none focus:ring-2 focus:ring-teal/40"
              )}
            >
              <Calculator className="h-4 w-4" />
              Calculators
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  calculatorsOpen && "rotate-180"
                )}
                strokeWidth={2.4}
              />
            </button>

            <AnimatePresence>
              {calculatorsOpen && (
                <motion.div
                  id="desktop-calculators-menu"
                  role="menu"
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                >
                  {CALCULATOR_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setCalculatorsOpen(false)}
                      className="block rounded-lg px-3 py-3 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <span className="block text-sm font-bold text-navy">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        {link.description}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {NAV_LINKS.slice(1).map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                    "text-gray-600 transition-colors",
                    "hover:text-navy hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA + Auth + Mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Auth: Sign-in or User avatar */}
          {!authLoading && (
            <>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-teal/30"
                    aria-label="User menu"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                        {userInitial}
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg"
                      >
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-navy truncate">
                            {user.displayName || "Cruiser"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/my-trips"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          My Trips
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut();
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-navy transition-colors"
                >
                  Sign In
                </button>
              )}
            </>
          )}

          {mobileAppLive ? (
            <Link
              href="/app"
              onClick={trackAppDownload}
              className={cn(
                "hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold",
                "bg-navy text-white shadow-sm",
                "transition-all hover:bg-teal hover:shadow-md",
                "active:scale-[0.97]"
              )}
            >
              <Smartphone className="h-4 w-4" strokeWidth={2.2} />
              Get the App
            </Link>
          ) : (
            <Link
              href="/calculator"
              className={cn(
                "hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold",
                "bg-teal text-white shadow-sm",
                "transition-all hover:bg-teal-dark hover:shadow-md",
                "active:scale-[0.97]"
              )}
            >
              Start Planning
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn(
              "lg:hidden inline-flex items-center justify-center rounded-lg p-2",
              "text-gray-600 hover:text-navy hover:bg-gray-100",
              "transition-colors"
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Sign-in modal */}
        <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-gray-100"
          >
            <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
              {mobileAppLive && (
                <Link
                  href="/app"
                  onClick={() => {
                    setMobileOpen(false);
                    trackAppDownload();
                  }}
                  className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-teal/20 bg-teal/10 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white">
                      <Smartphone className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-navy">
                        Download CruiseKit
                      </span>
                      <span className="block text-xs text-gray-600">
                        Free on App Store and Google Play
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-teal" strokeWidth={2.4} />
                </Link>
              )}

              <ul className="flex flex-col gap-1">
                {NAV_LINKS.slice(0, 1).map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          "text-gray-600 transition-colors",
                          "hover:text-navy hover:bg-gray-50",
                          "active:bg-gray-100"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                <li>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileCalculatorsOpen((prev) => !prev)
                    }
                    aria-expanded={mobileCalculatorsOpen}
                    aria-controls="mobile-calculators-menu"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      "text-gray-600 transition-colors",
                      "hover:text-navy hover:bg-gray-50",
                      "active:bg-gray-100"
                    )}
                  >
                    <Calculator className="h-4 w-4" />
                    <span className="flex-1 text-left">Calculators</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        mobileCalculatorsOpen && "rotate-180"
                      )}
                      strokeWidth={2.4}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileCalculatorsOpen && (
                      <motion.div
                        id="mobile-calculators-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden pl-7"
                      >
                        <div className="mt-1 grid gap-1 border-l border-gray-200 pl-3">
                          {CALCULATOR_LINKS.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileCalculatorsOpen(false);
                              }}
                              className="rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
                            >
                              <span className="block text-sm font-bold text-navy">
                                {link.shortLabel}
                              </span>
                              <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                                {link.description}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {NAV_LINKS.slice(1).map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          "text-gray-600 transition-colors",
                          "hover:text-navy hover:bg-gray-50",
                          "active:bg-gray-100"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {/* Auth links (mobile) */}
              {!authLoading && (
                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                  {user ? (
                    <>
                      <Link
                        href="/my-trips"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          "text-gray-600 transition-colors",
                          "hover:text-navy hover:bg-gray-50"
                        )}
                      >
                        <Heart className="h-4 w-4" />
                        My Trips
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signOut();
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          "text-gray-600 transition-colors",
                          "hover:text-red-600 hover:bg-red-50"
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setShowSignIn(true);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                        "text-gray-600 transition-colors",
                        "hover:text-navy hover:bg-gray-50"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign In
                    </button>
                  )}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100">
                {mobileAppLive ? (
                  <div className="grid gap-2">
                    <Link
                      href="/app"
                      onClick={() => {
                        setMobileOpen(false);
                        trackAppDownload();
                      }}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
                        "bg-navy text-white",
                        "transition-all hover:bg-teal",
                        "active:scale-[0.97]"
                      )}
                    >
                      <Smartphone className="h-4 w-4" strokeWidth={2.2} />
                      Download the App
                    </Link>
                    <Link
                      href="/calculator"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
                    >
                      Use cost calculator
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/calculator"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
                      "bg-teal text-white",
                      "transition-all hover:bg-teal-dark",
                      "active:scale-[0.97]"
                    )}
                  >
                    Start Planning
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
