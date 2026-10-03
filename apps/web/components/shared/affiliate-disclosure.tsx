import Link from "next/link";
import { Info } from "lucide-react";

interface AffiliateDisclosureProps {
  variant?: "inline" | "block";
  className?: string;
}

export default function AffiliateDisclosure({
  variant = "inline",
  className = "",
}: AffiliateDisclosureProps) {
  if (variant === "block") {
    return (
      <div
        className={`flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-600 ${className}`}
      >
        <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
        <p>
          We earn a commission if you book. It never changes the price you pay.{" "}
          <Link
            href="/how-we-make-money"
            className="text-teal hover:underline font-medium"
          >
            How we make money
          </Link>
        </p>
      </div>
    );
  }

  return (
    <p
      className={`text-[11px] text-gray-500 leading-snug ${className}`}
    >
      We earn a commission if you book. It never changes the price you pay.{" "}
      <Link
        href="/how-we-make-money"
        className="text-teal hover:underline"
      >
        How we make money
      </Link>
    </p>
  );
}
