import type { Metadata } from "next";

/**
 * The clean calculator hub is the bounded canonical for query-string estimate
 * URLs. Parameter URLs remain live and indexable for sharing and measured
 * search traffic; this metadata intentionally does not add a robots directive.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/calculator/" },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
