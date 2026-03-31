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
  Users,
  Navigation,
  Star,
  Anchor,
  BookOpen,
  Heart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";

const NAV_LINKS = [
  { label: "Deals", href: "/cruises", icon: Anchor },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Ports", href: "/ports", icon: Map },
  { label: "Groups", href: "/groups", icon: Users },
  { label: "Track", href: "/track", icon: Navigation },
  { label: "Loyalty", href: "/loyalty", icon: Star },
  { label: "Guides", href: "/guides", icon: BookOpen },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "?";

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
          {NAV_LINKS.map((link) => {
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
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
