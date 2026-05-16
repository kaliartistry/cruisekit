import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

type Candidate = {
  id: string;
  shipName: string;
  sailingName: string;
  departureDate: string;
  returnDate: string;
  nights: number;
  departurePort: string;
  destinationRegion: string;
  itineraryPorts?: string[];
  startingPrice: number | null;
  directLink: string;
  confidence: string;
};

type ReviewReport = {
  generatedAt: string;
  provider: string;
  sourceRunId?: string;
  counts: Record<string, number>;
  recommendedNew?: Candidate[];
  priceChanges?: Array<{ staged: Candidate; seed: Candidate; priceDelta: number }>;
};

type ImportReport = {
  generatedAt: string;
  provider: string;
  staging: { sailings: number; schemaErrors: number; minPrice: number | null; maxPrice: number | null };
  blockers?: string[];
  warnings?: string[];
};

export const metadata: Metadata = {
  title: "Deal Promotion Workbench",
  robots: { index: false, follow: false },
};

const reviewFiles = [
  "latest-carnival-staging-review.json",
  "latest-norwegian-staging-review.json",
  "latest-virgin-voyages-staging-review.json",
  "latest-princess-staging-review.json",
];

const statusFiles = ["latest-royal-caribbean-staging-import.json"];

function reportPath(file: string) {
  return join(process.cwd(), "..", "..", "data", "reports", file);
}

function readJson<T>(file: string): T | null {
  const path = reportPath(file);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function money(value: number | null | undefined) {
  if (!Number.isFinite(value)) return "Price check";
  return `$${Math.round(value as number).toLocaleString("en-US")}`;
}

function dateLabel(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function providerLabel(provider: string) {
  return provider
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function statusFor(candidate: Candidate) {
  if (candidate.startingPrice == null) return "Needs fare";
  if (candidate.confidence === "itinerary_verified_price_check_required") return "Verify then promote";
  return "Review";
}

function scoreCandidate(candidate: Candidate) {
  let score = 0;
  if (candidate.destinationRegion === "caribbean" || candidate.destinationRegion === "bahamas") score += 3;
  if (candidate.nights >= 5 && candidate.nights <= 8) score += 2;
  if (candidate.startingPrice != null && candidate.startingPrice <= 900) score += 3;
  if (candidate.departurePort.toLowerCase().includes("miami")) score += 1;
  if (candidate.departurePort.toLowerCase().includes("port canaveral")) score += 1;
  if (candidate.departurePort.toLowerCase().includes("fort lauderdale")) score += 1;
  return score;
}

export default function DealPromotionWorkbenchPage() {
  const reviews = reviewFiles
    .map((file) => readJson<ReviewReport>(file))
    .filter((report): report is ReviewReport => report !== null);
  const statuses = statusFiles
    .map((file) => readJson<ImportReport>(file))
    .filter((report): report is ImportReport => report !== null);

  const candidates = reviews.flatMap((report) =>
    (report.recommendedNew ?? []).map((candidate) => ({
      ...candidate,
      provider: report.provider,
      score: scoreCandidate(candidate),
    })),
  );
  const topReady = candidates
    .filter((candidate) => candidate.startingPrice != null)
    .sort((a, b) => b.score - a.score || (a.startingPrice ?? 0) - (b.startingPrice ?? 0))
    .slice(0, 16);
  const topPriceCheck = candidates
    .filter((candidate) => candidate.startingPrice == null)
    .sort((a, b) => b.score - a.score || a.departureDate.localeCompare(b.departureDate))
    .slice(0, 16);
  const priceChanges = reviews.flatMap((report) =>
    (report.priceChanges ?? []).map((change) => ({ ...change, provider: report.provider })),
  );
  const totalNew = reviews.reduce((sum, report) => sum + (report.counts.newCandidates ?? 0), 0);
  const totalRecommended = reviews.reduce((sum, report) => sum + (report.counts.recommendedNew ?? 0), 0);
  const totalPriceChecks = reviews.reduce((sum, report) => sum + (report.counts.priceCheckRequired ?? 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Internal Ops</p>
            <h1 className="mt-2 text-3xl font-bold text-navy">Deal Promotion Workbench</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              Review staging imports, verify fares, and choose which sailings should move into the live CruiseKit catalog.
            </p>
          </div>
          <Link
            href="/cruises"
            className="inline-flex h-10 items-center justify-center rounded-sm bg-navy px-4 text-sm font-semibold text-white"
          >
            View live deals
          </Link>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Providers reviewed" value={reviews.length} />
          <Metric label="New staged candidates" value={totalNew} />
          <Metric label="Recommended queue" value={totalRecommended} />
          <Metric label="Price checks required" value={totalPriceChecks} tone="warning" />
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {reviews.map((report) => (
            <ProviderCard key={report.provider} report={report} />
          ))}
          {statuses.map((report) => (
            <BlockedProviderCard key={report.provider} report={report} />
          ))}
        </section>

        {priceChanges.length > 0 && (
          <section className="rounded-sm border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-lg font-semibold text-slate-950">Price Changes To Review</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {priceChanges.map((change) => (
                <CandidateRow
                  key={`${change.provider}-${change.staged.id}`}
                  candidate={change.staged}
                  provider={change.provider}
                  status="Price changed"
                />
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-6 xl:grid-cols-2">
          <QueuePanel title="Ready For Fare Verification" subtitle="Has observed pricing. Verify source page, then promote manually.">
            {topReady.map((candidate) => (
              <CandidateRow
                key={`${candidate.provider}-${candidate.id}`}
                candidate={candidate}
                provider={candidate.provider}
                status={statusFor(candidate)}
              />
            ))}
          </QueuePanel>

          <QueuePanel title="Inventory Needs Fare Check" subtitle="Useful sailings, but the source feed did not expose a fare.">
            {topPriceCheck.map((candidate) => (
              <CandidateRow
                key={`${candidate.provider}-${candidate.id}`}
                candidate={candidate}
                provider={candidate.provider}
                status={statusFor(candidate)}
              />
            ))}
          </QueuePanel>
        </section>

        <section className="rounded-sm border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Promotion Steps</h2>
          <ol className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
            <li className="rounded-sm border border-slate-200 p-3">
              <strong className="block text-slate-950">1. Open source</strong>
              Confirm ship, date, nights, itinerary, availability, and current fare.
            </li>
            <li className="rounded-sm border border-slate-200 p-3">
              <strong className="block text-slate-950">2. Promote carefully</strong>
              Use the existing provider promotion script or edit seed data with the verified fare.
            </li>
            <li className="rounded-sm border border-slate-200 p-3">
              <strong className="block text-slate-950">3. Publish bundles</strong>
              Run data validation, bundle generation, and mobile refresh publish.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "warning" }) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white p-4">
      <div className={tone === "warning" ? "text-2xl font-bold text-amber-700" : "text-2xl font-bold text-navy"}>
        {value.toLocaleString("en-US")}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function ProviderCard({ report }: { report: ReviewReport }) {
  const counts = report.counts;
  return (
    <article className="rounded-sm border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{providerLabel(report.provider)}</h2>
          <p className="mt-1 text-xs text-slate-500">{dateLabel(report.generatedAt.slice(0, 10))}</p>
        </div>
        <span className="rounded-sm bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Active</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Staged" value={counts.stagedCarnival ?? counts.stagedNorwegian ?? counts.stagedVirgin ?? counts.stagedPrincess ?? 0} />
        <Stat label="New" value={counts.newCandidates ?? 0} />
        <Stat label="Recommended" value={counts.recommendedNew ?? 0} />
        <Stat label="Price checks" value={counts.priceCheckRequired ?? 0} />
      </dl>
    </article>
  );
}

function BlockedProviderCard({ report }: { report: ImportReport }) {
  return (
    <article className="rounded-sm border border-rose-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{providerLabel(report.provider)}</h2>
          <p className="mt-1 text-xs text-slate-500">{dateLabel(report.generatedAt.slice(0, 10))}</p>
        </div>
        <span className="rounded-sm bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">Blocked</span>
      </div>
      <p className="mt-4 text-sm text-slate-700">{report.blockers?.[0] ?? "Needs manual review."}</p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-950">{value.toLocaleString("en-US")}</dd>
    </div>
  );
}

function QueuePanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function CandidateRow({
  candidate,
  provider,
  status,
}: {
  candidate: Candidate;
  provider: string;
  status: string;
}) {
  return (
    <article className="rounded-sm border border-slate-200 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {providerLabel(provider)}
            </span>
            <span className="rounded-sm bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{status}</span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-slate-950">{candidate.sailingName}</h3>
          <p className="mt-1 text-xs text-slate-600">
            {candidate.shipName} · {dateLabel(candidate.departureDate)} · {candidate.nights} nights ·{" "}
            {candidate.departurePort}
          </p>
          {candidate.itineraryPorts && candidate.itineraryPorts.length > 0 && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{candidate.itineraryPorts.slice(0, 5).join(" · ")}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          <div className="font-price text-sm font-semibold text-slate-950">{money(candidate.startingPrice)}</div>
          <a
            href={candidate.directLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center rounded-sm border border-slate-300 px-3 text-xs font-semibold text-slate-800"
          >
            Source
          </a>
        </div>
      </div>
    </article>
  );
}
