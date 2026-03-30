import { cn } from "@/lib/utils/cn";

// Logo file extensions — some are real downloads, some are text-based placeholders
// Real logos: carnival, msc, virgin-voyages, princess
// Placeholder text SVGs: royal-caribbean, norwegian, celebrity, holland-america, disney
const LOGO_EXT: Record<string, string> = {
  "royal-caribbean": "svg",
  "carnival": "svg",
  "norwegian": "svg",
  "msc": "svg",
  "celebrity": "svg",
  "princess": "png",
  "holland-america": "svg",
  "disney": "svg",
  "virgin-voyages": "svg",
};

interface CruiseLineLogoProps {
  /** Cruise line identifier (e.g. "royal-caribbean") */
  cruiseLineId: string;
  /** Display size (default "md") */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

const SIZE_MAP = {
  sm: { width: 80, height: 24 },
  md: { width: 120, height: 36 },
  lg: { width: 160, height: 48 },
};

export default function CruiseLineLogo({
  cruiseLineId,
  size = "md",
  className,
}: CruiseLineLogoProps) {
  const dims = SIZE_MAP[size];
  const ext = LOGO_EXT[cruiseLineId];

  if (!ext) {
    // Fallback for unknown cruise lines
    return (
      <span className={cn("text-xs font-semibold text-gray-500", className)}>
        {cruiseLineId}
      </span>
    );
  }

  return (
    <img
      src={`/images/cruise-lines/${cruiseLineId}.${ext}`}
      alt={`${cruiseLineId} logo`}
      width={dims.width}
      height={dims.height}
      className={cn("object-contain", className)}
    />
  );
}
