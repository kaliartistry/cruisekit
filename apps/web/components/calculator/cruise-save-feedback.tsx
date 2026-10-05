"use client";

import { Check, Ship } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/** Confirmation appears only after the caller's save has succeeded. */
export default function CruiseSaveFeedback({ saved }: { saved: boolean }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      key={saved ? "saved" : "ready"}
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white"
      initial={saved && reducedMotion === false ? { opacity: 0.35, scale: 0.98 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion === false ? 0.18 : 0, ease: "easeOut" }}
    >
      {saved ? <Check className="h-5 w-5" /> : <Ship className="h-5 w-5" />}
    </motion.span>
  );
}
