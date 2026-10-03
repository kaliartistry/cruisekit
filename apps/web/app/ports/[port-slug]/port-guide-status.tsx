import { BadgeCheck, BookOpenCheck } from "lucide-react";
import type { PortGovernanceMetadata } from "@/lib/ports/port-governance";

interface PortGuideStatusProps {
  governance: PortGovernanceMetadata;
}

export default function PortGuideStatus({
  governance,
}: PortGuideStatusProps) {
  const isReviewed = governance.reviewStatus === "reviewed";
  const statusCopy = reviewStatusCopy[governance.reviewStatus];
  const timeZoneReview = governance.fieldFreshness.find(
    (field) => field.fieldPath === "ianaTimeZone",
  );

  return (
    <aside
      aria-label="Guide review status"
      className="mb-10 rounded-xl border border-sky-200 bg-sky-50/70 p-5"
    >
      <div className="flex items-start gap-3">
        {isReviewed ? (
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
        ) : (
          <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Guide status
          </p>
          <p className="mt-1 font-semibold text-navy">
            {statusCopy.label}
          </p>
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
            <div className="flex gap-1.5">
              <dt>Editorial last reviewed:</dt>
              <dd className="font-semibold text-navy">
                {formatReviewDate(governance.lastEditorialReviewAt) ??
                  "Not yet source-reviewed"}
              </dd>
            </div>
            {timeZoneReview?.lastVerifiedAt && (
              <div className="flex gap-1.5">
                <dt>Time zone checked:</dt>
                <dd className="font-semibold text-navy">
                  {formatReviewDate(timeZoneReview.lastVerifiedAt)}
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-600">
            {statusCopy.description} Confirm time-sensitive safety, prices, and
            emergency information with the cruise line and relevant official
            sources before acting.
          </p>
        </div>
      </div>
    </aside>
  );
}

const reviewStatusCopy: Record<
  PortGovernanceMetadata["reviewStatus"],
  { label: string; description: string }
> = {
  "needs-review": {
    label: "Needs source review",
    description: "Editorial details have not completed source review.",
  },
  reviewed: {
    label: "Source-reviewed",
    description: "Review dates apply only to the fields shown.",
  },
  stale: {
    label: "Review expired",
    description: "One or more previously reviewed fields need rechecking.",
  },
  blocked: {
    label: "Review blocked",
    description: "This guide has an unresolved source-review issue.",
  },
};

function formatReviewDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
