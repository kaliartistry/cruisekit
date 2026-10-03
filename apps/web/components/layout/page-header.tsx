import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PILLARS, type PillarKey } from "@/lib/constants/pillars";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  pillar?: PillarKey;
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({
  pillar,
  title,
  subtitle,
  breadcrumbs,
}: PageHeaderProps) {
  const pillarData = pillar ? PILLARS[pillar] : null;

  return (
    <section className="border-b border-gray-200 bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-gray-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-navy"
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  {crumb.href && index < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-navy"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-700 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Pillar badge */}
        {pillarData && (
          <div className="mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                pillarData.bgClass,
                pillarData.borderClass,
                "border"
              )}
              style={{ color: pillarData.color }}
            >
              <pillarData.icon className="h-3.5 w-3.5" />
              {pillarData.label}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
