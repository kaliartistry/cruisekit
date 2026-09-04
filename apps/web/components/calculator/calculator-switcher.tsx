import Link from "next/link";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CalculatorSwitcherProps = {
  active: "total-cost" | "drink-package" | "gratuity" | "deadlines";
  className?: string;
};

const calculatorOptions = [
  {
    id: "total-cost",
    href: "/calculator",
    label: "Total Cruise Cost",
    description: "Fare, fees, gratuities, drinks, WiFi, excursions, and extras.",
  },
  {
    id: "gratuity",
    href: "/cruise-gratuity-calculator",
    label: "Gratuities",
    description: "Daily crew charges by line, cabin, guests, and booking cohort.",
  },
  {
    id: "deadlines",
    href: "/cruise-payment-deadline-calculator",
    label: "Payment Deadlines",
    description: "Final-payment and pre-cruise package calendar reminders.",
  },
  {
    id: "drink-package",
    href: "/cruise-drink-package-calculator",
    label: "Drink Package",
    description: "Packages, bundled fares, service charges, and Bar Tab credit.",
  },
] as const;

export default function CalculatorSwitcher({
  active,
  className,
}: CalculatorSwitcherProps) {
  return (
    <nav
      aria-label="Cruise calculators"
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-2 shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {calculatorOptions.map((option) => {
          const isActive = option.id === active;

          return (
            <Link
              key={option.id}
              href={option.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[76px] items-start gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-teal/50",
                isActive
                  ? "bg-navy text-white"
                  : "text-navy hover:bg-gray-50 hover:text-teal-dark"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isActive ? "bg-white/15 text-white" : "bg-teal/10 text-teal"
                )}
              >
                <Calculator className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span>
                <span className="block text-sm font-bold">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs leading-5",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}
                >
                  {option.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
