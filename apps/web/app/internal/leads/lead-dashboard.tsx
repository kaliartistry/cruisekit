"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Archive,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Ship,
  UserRound,
  XCircle,
} from "lucide-react";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type LeadStatus =
  | "new"
  | "email_sent"
  | "email_failed"
  | "contacted"
  | "booked"
  | "lost"
  | "archived";

type FilterKey = "all" | "open" | "contacted" | "booked" | "failed" | "archived";

type LeadRequest = {
  id: string;
  createdAt: Date | null;
  status: LeadStatus;
  sourcePlatform: string;
  sourceSurface: string;
  requesterUid: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note: string;
  dealId: string;
  cruiseLineId: string;
  cruiseLine: string;
  shipName: string;
  itineraryTitle: string;
  departureDate: string;
  fromPrice: number | null;
  currency: string;
  lastVerified: string;
  bookingUrl: string;
  notificationTo: string;
  resendNotificationId: string;
  resendConfirmationId: string;
  emailError: string;
  emailRetryCount: number;
  emailRetriedAt: Date | null;
  customerReplyCount: number;
  lastCustomerReplyAt: Date | null;
  lastCustomerReplyPreview: string;
  lastCustomerReplyResendId: string;
  internalNote: string;
  updatedAt: Date | null;
  contactedAt: Date | null;
  bookedAt: Date | null;
  lostAt: Date | null;
  archivedAt: Date | null;
};

const STATUS_META: Record<
  LeadStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  new: {
    label: "New",
    className: "bg-blue-50 text-blue-700",
    icon: Inbox,
  },
  email_sent: {
    label: "Emailed",
    className: "bg-emerald-50 text-emerald-700",
    icon: Mail,
  },
  email_failed: {
    label: "Email failed",
    className: "bg-rose-50 text-rose-700",
    icon: XCircle,
  },
  contacted: {
    label: "Contacted",
    className: "bg-amber-50 text-amber-700",
    icon: CheckCircle2,
  },
  booked: {
    label: "Booked",
    className: "bg-teal/10 text-teal-dark",
    icon: CircleDollarSign,
  },
  lost: {
    label: "Lost",
    className: "bg-slate-100 text-slate-600",
    icon: XCircle,
  },
  archived: {
    label: "Archived",
    className: "bg-slate-100 text-slate-600",
    icon: Archive,
  },
};

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "contacted", label: "Contacted" },
  { key: "booked", label: "Booked" },
  { key: "failed", label: "Failed" },
  { key: "archived", label: "Archived" },
];

const OPS_TIME_ZONE = "America/New_York";

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readStatus(value: unknown): LeadStatus {
  return typeof value === "string" && value in STATUS_META
    ? (value as LeadStatus)
    : "new";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function formatDate(value: Date | string | null) {
  if (!value) return "Not set";
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: typeof value === "string" ? "UTC" : undefined,
  }).format(date);
}

function formatDateTime(value: Date | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: OPS_TIME_ZONE,
    timeZoneName: "short",
  }).format(value);
}

function leadActivityLabel(lead: LeadRequest) {
  if (lead.lastCustomerReplyAt) {
    return `Last reply ${formatDateTime(lead.lastCustomerReplyAt)}`;
  }
  if (lead.bookedAt) {
    return `Booked ${formatDateTime(lead.bookedAt)}`;
  }
  if (lead.lostAt) {
    return `Lost ${formatDateTime(lead.lostAt)}`;
  }
  if (lead.archivedAt) {
    return `Archived ${formatDateTime(lead.archivedAt)}`;
  }
  if (lead.contactedAt) {
    return `Contacted ${formatDateTime(lead.contactedAt)}`;
  }
  if (lead.emailRetriedAt) {
    return `Retried ${formatDateTime(lead.emailRetriedAt)}`;
  }
  return `Received ${formatDateTime(lead.createdAt)}`;
}

function formatMoney(value: number | null, currency: string) {
  if (value == null) return "Price check";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function leadFromDoc(id: string, data: Record<string, unknown>): LeadRequest {
  return {
    id,
    createdAt: readDate(data.createdAt),
    status: readStatus(data.status),
    sourcePlatform: readString(data.sourcePlatform),
    sourceSurface: readString(data.sourceSurface),
    requesterUid: readString(data.requesterUid),
    contactName: readString(data.contactName),
    contactEmail: readString(data.contactEmail),
    contactPhone: readString(data.contactPhone),
    note: readString(data.note),
    dealId: readString(data.dealId),
    cruiseLineId: readString(data.cruiseLineId),
    cruiseLine: readString(data.cruiseLine),
    shipName: readString(data.shipName),
    itineraryTitle: readString(data.itineraryTitle),
    departureDate: readString(data.departureDate),
    fromPrice: readNumber(data.fromPrice),
    currency: readString(data.currency),
    lastVerified: readString(data.lastVerified),
    bookingUrl: readString(data.bookingUrl),
    notificationTo: readString(data.notificationTo),
    resendNotificationId: readString(data.resendNotificationId),
    resendConfirmationId: readString(data.resendConfirmationId),
    emailError: readString(data.emailError),
    emailRetryCount: readCount(data.emailRetryCount),
    emailRetriedAt: readDate(data.emailRetriedAt),
    customerReplyCount: readCount(data.customerReplyCount),
    lastCustomerReplyAt: readDate(data.lastCustomerReplyAt),
    lastCustomerReplyPreview: readString(data.lastCustomerReplyPreview),
    lastCustomerReplyResendId: readString(data.lastCustomerReplyResendId),
    internalNote: readString(data.internalNote),
    updatedAt: readDate(data.updatedAt),
    contactedAt: readDate(data.contactedAt),
    bookedAt: readDate(data.bookedAt),
    lostAt: readDate(data.lostAt),
    archivedAt: readDate(data.archivedAt),
  };
}

function matchesFilter(lead: LeadRequest, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "open") {
    return lead.status === "new" || lead.status === "email_sent";
  }
  if (filter === "failed") return lead.status === "email_failed";
  return lead.status === filter;
}

function statusCounts(leads: LeadRequest[]) {
  return {
    all: leads.length,
    open: leads.filter((lead) => matchesFilter(lead, "open")).length,
    contacted: leads.filter((lead) => lead.status === "contacted").length,
    booked: leads.filter((lead) => lead.status === "booked").length,
    failed: leads.filter((lead) => lead.status === "email_failed").length,
    archived: leads.filter((lead) => lead.status === "archived").length,
  } satisfies Record<FilterKey, number>;
}

export default function LeadDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("open");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const loadLeads = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const adminSnap = await getDoc(doc(db, "adminUsers", user.uid));
      if (!adminSnap.exists()) {
        setIsAdmin(false);
        setLeads([]);
        setSelectedId(null);
        return;
      }

      setIsAdmin(true);
      const leadQuery = query(
        collection(db, "dealLeadRequests"),
        orderBy("createdAt", "desc"),
        limit(100),
      );
      const snapshot = await getDocs(leadQuery);
      const nextLeads = snapshot.docs.map((leadDoc) =>
        leadFromDoc(leadDoc.id, leadDoc.data()),
      );
      setLeads(nextLeads);
      setSelectedId((current) => {
        if (current && nextLeads.some((lead) => lead.id === current)) {
          return current;
        }
        return nextLeads[0]?.id ?? null;
      });
    } catch (err) {
      console.error("Failed to load deal leads:", err);
      setError(
        "Could not load the lead queue. Check that the admin rules are deployed and this account has an adminUsers record.",
      );
    } finally {
      setAdminChecked(true);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    setAdminChecked(false);
    setIsAdmin(false);
    setLeads([]);
    setSelectedId(null);

    if (!user) {
      setAdminChecked(true);
      return;
    }

    void loadLeads();
  }, [authLoading, loadLeads, user]);

  const counts = useMemo(() => statusCounts(leads), [leads]);

  const filteredLeads = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (!matchesFilter(lead, filter)) return false;
      if (!normalized) return true;

      return [
        lead.contactName,
        lead.contactEmail,
        lead.contactPhone,
        lead.cruiseLine,
        lead.shipName,
        lead.itineraryTitle,
        lead.departureDate,
        lead.note,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [filter, leads, search]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? null,
    [filteredLeads, leads, selectedId],
  );

  useEffect(() => {
    setNoteDraft(selectedLead?.internalNote ?? "");
  }, [selectedLead?.id, selectedLead?.internalNote]);

  const updateLocalLead = useCallback((id: string, patch: Partial<LeadRequest>) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)),
    );
  }, []);

  const setLeadStatus = async (lead: LeadRequest, status: LeadStatus) => {
    if (!user) return;

    setSavingId(lead.id);
    setError(null);

    const now = new Date();
    const timestampField =
      status === "contacted"
        ? "contactedAt"
        : status === "booked"
          ? "bookedAt"
          : status === "lost"
            ? "lostAt"
            : status === "archived"
              ? "archivedAt"
              : null;

    try {
      await updateDoc(doc(db, "dealLeadRequests", lead.id), {
        status,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        ...(timestampField ? { [timestampField]: serverTimestamp() } : {}),
      });

      updateLocalLead(lead.id, {
        status,
        updatedAt: now,
        ...(timestampField ? { [timestampField]: now } : {}),
      });
    } catch (err) {
      console.error("Failed to update lead status:", err);
      setError("Could not update this lead. Refresh and try again.");
    } finally {
      setSavingId(null);
    }
  };

  const saveNote = async (lead: LeadRequest) => {
    if (!user) return;

    setSavingId(lead.id);
    setError(null);

    try {
      await updateDoc(doc(db, "dealLeadRequests", lead.id), {
        internalNote: noteDraft.trim(),
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });

      updateLocalLead(lead.id, {
        internalNote: noteDraft.trim(),
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to save lead note:", err);
      setError("Could not save the note. Refresh and try again.");
    } finally {
      setSavingId(null);
    }
  };

  if (authLoading || !adminChecked) {
    return <CenteredState icon={Loader2} title="Loading leads" spin />;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <CenteredState
          icon={UserRound}
          title="Sign in required"
          action={
            <>
              <Button onClick={() => setShowSignIn(true)}>Sign in</Button>
              <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
            </>
          }
        />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <CenteredState
          icon={XCircle}
          title="No lead dashboard access"
          body={`${user.email ?? "This account"} is signed in, but it is not in adminUsers.`}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => void loadLeads()}>
                <RefreshCw className="h-4 w-4" />
                Recheck
              </Button>
              <Button variant="outline" onClick={() => void signOut()}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          }
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">
              Internal Ops
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy">Lead Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
              Historical deal requests retained after the personal-help offer was retired. No new requests or automated emails are accepted. Times are shown in Eastern Time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void loadLeads()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Open" value={counts.open} />
          <Metric label="Contacted" value={counts.contacted} />
          <Metric label="Booked" value={counts.booked} />
          <Metric label="Failed email" value={counts.failed} tone="danger" />
          <Metric label="All leads" value={counts.all} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {FILTERS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilter(item.key)}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-semibold transition-colors",
                      filter === item.key
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px]",
                        filter === item.key ? "bg-white/15" : "bg-white",
                      )}
                    >
                      {counts[item.key]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search leads"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-3">
              {loading && leads.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8">
                  <CenteredState icon={Loader2} title="Loading lead queue" spin compact />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8">
                  <CenteredState icon={Inbox} title="No leads in this view" compact />
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    selected={selectedLead?.id === lead.id}
                    onSelect={() => setSelectedId(lead.id)}
                  />
                ))
              )}
            </div>
          </div>

          <LeadDetail
            lead={selectedLead}
            noteDraft={noteDraft}
            onNoteChange={setNoteDraft}
            onSaveNote={saveNote}
            onSetStatus={setLeadStatus}
            saving={Boolean(selectedLead && savingId === selectedLead.id)}
          />
        </section>
      </div>
    </main>
  );
}

function CenteredState({
  icon: Icon,
  title,
  body,
  action,
  spin = false,
  compact = false,
}: {
  icon: typeof Inbox;
  title: string;
  body?: string;
  action?: React.ReactNode;
  spin?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6" : "min-h-[60vh]",
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal shadow-sm">
        <Icon className={cn("h-6 w-6", spin && "animate-spin")} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
      {body && <p className="mt-2 max-w-md text-sm text-slate-500">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "danger";
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div
        className={cn(
          "font-price text-2xl font-bold",
          tone === "danger" ? "text-rose-600" : "text-navy",
        )}
      >
        {value.toLocaleString("en-US")}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

function LeadRow({
  lead,
  selected,
  onSelect,
}: {
  lead: LeadRequest;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border bg-white p-4 text-left transition-colors",
        selected
          ? "border-teal shadow-[var(--shadow-md)]"
          : "border-slate-200 hover:border-slate-300",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            <span className="text-xs font-medium text-slate-500">
              {leadActivityLabel(lead)}
            </span>
          </div>
          <h2 className="mt-2 truncate text-base font-bold text-navy">
            {lead.contactName || "Unnamed cruiser"}
          </h2>
          <p className="mt-1 truncate text-sm text-slate-600">{lead.contactEmail}</p>
          <p className="mt-3 line-clamp-2 text-sm font-medium text-slate-800">
            {lead.itineraryTitle || lead.shipName || "Cruise request"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {lead.cruiseLine || lead.cruiseLineId || "Cruise line"} -{" "}
            {formatDate(lead.departureDate)}
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <div className="font-price text-base font-bold text-coral">
            {formatMoney(lead.fromPrice, lead.currency)}
          </div>
          <p className="mt-1 text-xs text-slate-400">starting fare</p>
        </div>
      </div>
    </button>
  );
}

function LeadDetail({
  lead,
  noteDraft,
  onNoteChange,
  onSaveNote,
  onSetStatus,
  saving,
}: {
  lead: LeadRequest | null;
  noteDraft: string;
  onNoteChange: (value: string) => void;
  onSaveNote: (lead: LeadRequest) => void;
  onSetStatus: (lead: LeadRequest, status: LeadStatus) => void;
  saving: boolean;
}) {
  if (!lead) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-6">
        <CenteredState icon={Inbox} title="Select a lead" compact />
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <StatusBadge status={lead.status} />
            <h2 className="mt-3 text-xl font-bold text-navy">
              {lead.contactName || "Unnamed cruiser"}
            </h2>
          </div>
          <Badge variant="outline">{lead.sourcePlatform || "mobile"}</Badge>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <InfoLine icon={Mail} text={lead.contactEmail || "No email"} />
          {lead.contactPhone && <InfoLine icon={Phone} text={lead.contactPhone} />}
          <InfoLine icon={Clock3} text={`Received ${formatDateTime(lead.createdAt)}`} />
        </div>
      </div>

      <section className="border-b border-slate-100 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Requested cruise
        </h3>
        <div className="mt-3 grid gap-3 text-sm">
          <InfoLine icon={Ship} text={lead.itineraryTitle || "Cruise request"} strong />
          <InfoLine icon={Calendar} text={formatDate(lead.departureDate)} />
          <InfoLine
            icon={CircleDollarSign}
            text={`${formatMoney(lead.fromPrice, lead.currency)} starting fare`}
          />
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">{lead.cruiseLine}</div>
            <div className="mt-1">{lead.shipName}</div>
            <div className="mt-1 text-xs text-slate-500">Deal ID: {lead.dealId}</div>
            <div className="mt-1 text-xs text-slate-500">
              Last verified: {lead.lastVerified || "Unknown"}
            </div>
          </div>
        </div>
      </section>

      {lead.note && (
        <section className="border-b border-slate-100 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Customer note
          </h3>
          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {lead.note}
          </p>
        </section>
      )}

      <section className="border-b border-slate-100 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Actions
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {lead.bookingUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={lead.bookingUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Source
              </a>
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            disabled={saving || lead.status === "contacted"}
            onClick={() => onSetStatus(lead, "contacted")}
          >
            Contacted
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={saving || lead.status === "booked"}
            onClick={() => onSetStatus(lead, "booked")}
          >
            Booked
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={saving || lead.status === "lost"}
            onClick={() => onSetStatus(lead, "lost")}
          >
            Lost
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={saving || lead.status === "archived"}
            onClick={() => onSetStatus(lead, "archived")}
          >
            Archive
          </Button>
        </div>
      </section>

      <section className="border-b border-slate-100 py-4">
        <label
          htmlFor="internal-note"
          className="text-sm font-bold uppercase tracking-wide text-slate-500"
        >
          Internal note
        </label>
        <textarea
          id="internal-note"
          value={noteDraft}
          onChange={(event) => onNoteChange(event.target.value)}
          maxLength={2000}
          className="mt-3 min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">{noteDraft.length}/2000</span>
          <Button
            size="sm"
            disabled={saving || noteDraft.trim() === lead.internalNote}
            onClick={() => onSaveNote(lead)}
          >
            {saving ? "Saving" : "Save note"}
          </Button>
        </div>
      </section>

      <section className="pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Timeline
        </h3>
        <dl className="mt-3 grid gap-2 text-sm">
          <TimelineRow label="Email sent" value={lead.resendNotificationId ? "Yes" : "Not recorded"} />
          <TimelineRow label="Retries" value={lead.emailRetryCount.toLocaleString("en-US")} />
          <TimelineRow label="Last retry" value={formatDateTime(lead.emailRetriedAt)} />
          <TimelineRow label="CruiseKit replies" value={lead.customerReplyCount.toLocaleString("en-US")} />
          <TimelineRow label="Last reply" value={formatDateTime(lead.lastCustomerReplyAt)} />
          <TimelineRow label="Contacted" value={formatDateTime(lead.contactedAt)} />
          <TimelineRow label="Booked" value={formatDateTime(lead.bookedAt)} />
          <TimelineRow label="Lost" value={formatDateTime(lead.lostAt)} />
          <TimelineRow label="Archived" value={formatDateTime(lead.archivedAt)} />
          <TimelineRow label="Updated" value={formatDateTime(lead.updatedAt)} />
        </dl>
        {lead.emailError && (
          <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700">
            {lead.emailError}
          </p>
        )}
        {lead.lastCustomerReplyPreview && (
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            {lead.lastCustomerReplyPreview}
          </p>
        )}
      </section>
    </aside>
  );
}

function InfoLine({
  icon: Icon,
  text,
  strong = false,
}: {
  icon: typeof Mail;
  text: string;
  strong?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-dark" />
      <span className={cn("min-w-0 break-words", strong && "font-semibold text-slate-900")}>
        {text}
      </span>
    </div>
  );
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
