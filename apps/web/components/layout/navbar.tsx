"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Deals", href: "/cruises", icon: Anchor },
  { label: "Plan", href: "/calculator", icon: Calculator },
  { label: "Explore", href: "/ports", icon: Map },
  { label: "Coordinate", href: "/groups", icon: Users },
  { label: "Track", href: "/track", icon: Navigation },
  { label: "Optimize", href: "/loyalty", icon: Star },
  { label: "Blog", href: "/blog", icon: BookOpen },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

        {/* Desktop CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
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
