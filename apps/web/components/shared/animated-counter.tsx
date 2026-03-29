"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface AnimatedCounterProps {
  /** Target number to count up to */
  value: number;
  /** Symbol shown before the number (default "$") */
  prefix?: string;
  /** Symbol shown after the number */
  suffix?: string;
  /** Animation duration in seconds (default 1.5) */
  duration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Decimal places to display (default 0) */
  decimals?: number;
}

function formatNumber(n: number, decimals: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function AnimatedCounter({
  value,
  prefix = "$",
  suffix,
  duration = 1.5,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();

  const motionValue = useMotionValue(0);

  // Convert duration (seconds) to a spring config.
  // A higher damping + lower stiffness = slower, smoother animation.
  const spring = useSpring(motionValue, {
    stiffness: 100 / duration,
    damping: 30 / duration,
    mass: 1,
  });

  const display = useTransform(spring, (current: number) =>
    formatNumber(Math.round(current * Math.pow(10, decimals)) / Math.pow(10, decimals), decimals),
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }

    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className={cn(prefix === "$" && "font-price", className)}
    >
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
