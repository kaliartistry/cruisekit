import { cn } from "@/lib/utils/cn";

interface CruiseLineLogoProps {
  cruiseLineId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const BRANDS: Record<string, { abbr: string; name: string; color: string }> = {
  "royal-caribbean": { abbr: "RCI", name: "Royal Caribbean", color: "#0066CC" },
  carnival: { abbr: "CCL", name: "Carnival", color: "#003DA5" },
  norwegian: { abbr: "NCL", name: "Norwegian", color: "#00BCD4" },
  msc: { abbr: "MSC", name: "MSC Cruises", color: "#003B73" },
  celebrity: { abbr: "CEL", name: "Celebrity", color: "#1C1C1C" },
  princess: { abbr: "PCL", name: "Princess", color: "#003366" },
  "holland-america": { abbr: "HAL", name: "Holland America", color: "#003B6F" },
  disney: { abbr: "DCL", name: "Disney", color: "#0066B2" },
  "virgin-voyages": { abbr: "VV", name: "Virgin Voyages", color: "#E4002B" },
};

const SIZE_MAP = {
  sm: "h-10 w-16 text-xs",
  md: "h-14 w-24 text-sm",
  lg: "h-16 w-28 text-base",
};

export default function CruiseLineLogo({
  cruiseLineId,
  size = "md",
  className,
}: CruiseLineLogoProps) {
  const brand = BRANDS[cruiseLineId];
  const sizeClass = SIZE_MAP[size];

  if (!brand) {
    return (
      <span className={cn("text-xs font-semibold text-gray-500", className)}>
        {cruiseLineId}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl border bg-white shadow-sm",
        sizeClass,
        className
      )}
      style={{ borderColor: `${brand.color}20` }}
      title={brand.name}
    >
      <span
        className="font-black tracking-tight"
        style={{ color: brand.color }}
      >
        {brand.abbr}
      </span>
    </div>
  );
}
