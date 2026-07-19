"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { Download, ExternalLink, Loader2, LogOut, Plus, RefreshCw, ShieldAlert } from "lucide-react";
import { db, functions } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type GrowthStatus = "new" | "reviewed" | "contacted" | "scheduled" | "onboarded" | "activated" | "sailing_completed" | "interview_completed" | "declined";
type Application = {
  id: string;
  applicationType: string;
  status: GrowthStatus;
  createdAt?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  cruiseLine?: string;
  ship?: string;
  departureDate?: string;
  platform?: string;
  campaign?: string;
  referralCode?: string;
  referralPartner?: string;
  activation?: { isActivated?: boolean; activatedAt?: string };
  meaningfulActions?: string[];
  invites?: { sent?: number; accepted?: number };
  founderNotes?: string;
  followUpDate?: string;
};

type Funnel = Record<string, number>;

const statusLabels: Record<GrowthStatus, string> = {
  new: "New", reviewed: "Reviewed", contacted: "Contacted", scheduled: "Scheduled", onboarded: "Onboarded", activated: "Activated", sailing_completed: "Sailing completed", interview_completed: "Interview completed", declined: "Declined",
};

const listGrowth = httpsCallable<{ action: "list"; filters?: Record<string, string> }, { applications?: Application[]; funnel?: Funnel }>(functions, "manageGrowthApplication");
const updateGrowth = httpsCallable<{ action: "update"; applicationId: string; patch: Partial<Application> }, { ok: boolean }>(functions, "manageGrowthApplication");
const manageReferrals = httpsCallable<{ action: "list" | "create" | "revoke"; code?: string; partnerType?: string; label?: string }, { referrals?: Referral[]; referral?: Referral }>(functions, "manageReferralCode");

type Referral = { code: string; partnerType: string; label?: string; active: boolean; createdAt?: string };

function text(value: unknown) { return typeof value === "string" ? value : ""; }
function dateText(value: unknown) { if (typeof value === "string") return value; if (value && typeof value === "object" && "_seconds" in value) return new Date(Number((value as { _seconds: number })._seconds) * 1000).toISOString(); return ""; }
function cleanApplication(value: Application): Application { return { ...value, id: text(value.id), applicationType: text(value.applicationType), status: value.status in statusLabels ? value.status : "new", createdAt: dateText(value.createdAt), firstName: text(value.firstName), email: text(value.email), phone: text(value.phone), cruiseLine: text(value.cruiseLine), ship: text(value.ship), departureDate: text(value.departureDate), platform: text(value.platform), campaign: text(value.campaign), referralCode: text(value.referralCode), referralPartner: text(value.referralPartner), founderNotes: text(value.founderNotes), followUpDate: text(value.followUpDate), meaningfulActions: Array.isArray(value.meaningfulActions) ? value.meaningfulActions.filter((item): item is string => typeof item === "string") : [] }; }
function formatDate(value?: string) { if (!value) return "—"; const parsed = new Date(value); if (Number.isNaN(parsed.getTime())) return value; return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(parsed); }

export default function GrowthDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apps, setApps] = useState<Application[]>([]);
  const [funnel, setFunnel] = useState<Funnel>({});
  const [statusFilter, setStatusFilter] = useState<"all" | GrowthStatus>("all");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [cruiseLineFilter, setCruiseLineFilter] = useState("");
  const [referralFilter, setReferralFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [newReferralType, setNewReferralType] = useState("founding_user");
  const [newReferralLabel, setNewReferralLabel] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const admin = await getDoc(doc(db, "adminUsers", user.uid));
      if (!admin.exists()) { setIsAdmin(false); setApps([]); return; }
      setIsAdmin(true);
      const [growth, referralResult] = await Promise.all([listGrowth({ action: "list" }), manageReferrals({ action: "list" })]);
      setApps((growth.data.applications ?? []).map(cleanApplication));
      setFunnel(growth.data.funnel ?? {});
      setReferrals(referralResult.data.referrals ?? []);
    } catch {
      setError("We couldn’t load the Growth Console. Confirm this account has an adminUsers record and the Growth Functions are deployed.");
    } finally { setChecked(true); setLoading(false); }
  }, [user]);

  useEffect(() => { if (authLoading) return; setChecked(false); setIsAdmin(false); setApps([]); if (!user) { setChecked(true); return; } void load(); }, [authLoading, load, user]);

  const filtered = useMemo(() => apps.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (campaignFilter && app.campaign !== campaignFilter) return false;
    if (platformFilter && app.platform !== platformFilter) return false;
    if (cruiseLineFilter && app.cruiseLine !== cruiseLineFilter) return false;
    if (referralFilter && app.referralCode !== referralFilter) return false;
    if (dateFilter && !app.createdAt?.startsWith(dateFilter)) return false;
    return true;
  }), [apps, campaignFilter, cruiseLineFilter, dateFilter, platformFilter, referralFilter, statusFilter]);
  const selected = apps.find((app) => app.id === selectedId) ?? filtered[0] ?? null;
  const options = (field: keyof Application) => [...new Set(apps.map((app) => text(app[field])).filter(Boolean))].sort();

  const updateSelected = async (patch: Partial<Application>) => { if (!selected) return; setSaving(true); setError(""); try { await updateGrowth({ action: "update", applicationId: selected.id, patch }); setApps((current) => current.map((app) => app.id === selected.id ? { ...app, ...patch } : app)); } catch { setError("We couldn’t save that update. Try again."); } finally { setSaving(false); } };
  const createReferral = async () => { setSaving(true); setError(""); try { const result = await manageReferrals({ action: "create", partnerType: newReferralType, label: newReferralLabel }); if (result.data.referral) setReferrals((current) => [result.data.referral!, ...current]); setNewReferralLabel(""); } catch { setError("We couldn’t create that referral code."); } finally { setSaving(false); } };
  const revokeReferral = async (code: string) => { setSaving(true); try { await manageReferrals({ action: "revoke", code }); setReferrals((current) => current.map((item) => item.code === code ? { ...item, active: false } : item)); } catch { setError("We couldn’t revoke that referral code."); } finally { setSaving(false); } };
  const exportCsv = () => { const headers = ["Application type", "Status", "Name", "Email", "Cruise line", "Ship", "Departure", "Campaign", "Referral code", "Platform", "Activated", "Actions", "Invites sent", "Invites accepted", "Follow-up", "Founder notes"]; const rows = filtered.map((app) => [app.applicationType, statusLabels[app.status], app.firstName, app.email, app.cruiseLine, app.ship, app.departureDate, app.campaign, app.referralCode, app.platform, app.activation?.isActivated ? "Yes" : "No", app.meaningfulActions?.join("; "), app.invites?.sent ?? 0, app.invites?.accepted ?? 0, app.followUpDate, app.founderNotes]); const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n"); const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `cruisekit-growth-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url); };

  if (!checked || authLoading) return <main className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="h-6 w-6 animate-spin text-teal" /></main>;
  if (!user) return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><section className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-[var(--shadow-md)]"><ShieldAlert className="mx-auto h-9 w-9 text-teal" /><h1 className="mt-4 text-2xl font-bold text-navy">Growth Console</h1><p className="mt-2 text-sm leading-relaxed text-gray-600">Sign in with an authorized CruiseKit account to continue.</p><Button className="mt-6" onClick={() => setShowSignIn(true)}>Sign in</Button><SignInModal open={showSignIn} onOpenChange={setShowSignIn} /></section></main>;
  if (!isAdmin) return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><section className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-[var(--shadow-md)]"><ShieldAlert className="mx-auto h-9 w-9 text-coral" /><h1 className="mt-4 text-2xl font-bold text-navy">Admin access required</h1><p className="mt-2 text-sm leading-relaxed text-gray-600">{user.email ?? "This account"} is signed in but has no Growth Console access.</p><Button variant="outline" className="mt-6" onClick={() => void signOut()}>Sign out</Button></section></main>;

  const metrics = [
    ["Landing visitors", "landing_page_viewed"], ["Calculator starts", "calculator_started"], ["Calculator completes", "calculator_completed"], ["Founding 20 applications", "founding20_application_submitted"], ["Sailings saved", "sailing_saved"], ["Activated users", "activation_completed"], ["Invitations sent", "mycrew_invite_sent"], ["Invitations accepted", "mycrew_invite_accepted"], ["App Store clicks", "app_store_click"], ["Google Play clicks", "google_play_click"],
  ] as const;
  return <main className="min-h-screen bg-gray-50"><header className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6"><div><p className="text-sm font-semibold text-teal">CruiseKit internal</p><h1 className="text-2xl font-bold text-navy">Growth Console</h1></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button><Button variant="ghost" size="sm" onClick={() => void signOut()}><LogOut className="h-4 w-4" />Sign out</Button></div></div></header><div className="mx-auto max-w-[1600px] space-y-7 px-4 py-7 sm:px-6"><div className="rounded-xl border border-warning/30 bg-warning-light/60 p-4 text-sm leading-relaxed text-amber-900"><strong>Directional only:</strong> the Founding 20 sample is for product learning, not statistical significance. Review qualitative evidence alongside these counts.</div>{error && <p role="alert" className="rounded-lg border border-error/25 bg-error-light/60 p-3 text-sm font-medium text-error">{error}</p>}<section><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-navy">Funnel</h2><span className="text-xs text-gray-500">Server ledger + product-derived activation</span></div><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{metrics.map(([label, key]) => <div key={key} className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-xs font-medium text-gray-500">{label}</p><p className="mt-2 font-price text-2xl font-bold text-navy">{funnel[key] ?? 0}</p></div>)}</div></section><section className="grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"><div className="rounded-xl border border-gray-200 bg-white"><div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-xl font-bold text-navy">Founding 20 applicants</h2><p className="mt-1 text-sm text-gray-600">{filtered.length} of {apps.length} applications shown</p></div><Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" />Export CSV</Button></div><div className="grid grid-cols-2 gap-3 border-b border-gray-100 p-5 sm:grid-cols-3 lg:grid-cols-6"><Filter label="Date" value={dateFilter} onChange={setDateFilter} type="date" /><SelectFilter label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as "all" | GrowthStatus)} values={["all", ...Object.keys(statusLabels)]} labels={{ all: "All statuses", ...statusLabels }} /><SelectFilter label="Campaign" value={campaignFilter} onChange={setCampaignFilter} values={["", ...options("campaign")]} /><SelectFilter label="Partner" value={referralFilter} onChange={setReferralFilter} values={["", ...options("referralCode")]} /><SelectFilter label="Platform" value={platformFilter} onChange={setPlatformFilter} values={["", ...options("platform")]} /><SelectFilter label="Cruise line" value={cruiseLineFilter} onChange={setCruiseLineFilter} values={["", ...options("cruiseLine")]} /></div><div className="max-h-[620px] overflow-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="sticky top-0 bg-gray-50 text-xs font-semibold text-gray-500"><tr><th className="px-5 py-3">Applicant</th><th className="px-3 py-3">Cruise</th><th className="px-3 py-3">Source</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Activation</th><th className="px-3 py-3">Follow-up</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((app) => <tr key={app.id} className={`cursor-pointer transition-colors hover:bg-teal/5 ${selected?.id === app.id ? "bg-teal/5" : ""}`} onClick={() => setSelectedId(app.id)}><td className="px-5 py-4"><p className="font-semibold text-navy">{app.firstName || "Applicant"}</p><p className="text-xs text-gray-500">{app.email || app.applicationType} · {formatDate(app.createdAt)}</p></td><td className="px-3 py-4 text-gray-600"><p>{app.cruiseLine || "—"}</p><p className="text-xs text-gray-500">{app.ship || app.departureDate || "—"}</p></td><td className="px-3 py-4 text-gray-600"><p>{app.campaign || "Direct"}</p><p className="text-xs text-gray-500">{app.referralCode || "—"}</p></td><td className="px-3 py-4"><span className="rounded-full bg-navy/5 px-2.5 py-1 text-xs font-semibold text-navy">{statusLabels[app.status]}</span></td><td className="px-3 py-4 text-xs text-gray-600">{app.activation?.isActivated ? "Activated" : "Not yet"}<p className="mt-1 max-w-32 truncate text-gray-400">{app.meaningfulActions?.join(", ") || "—"}</p></td><td className="px-3 py-4 text-gray-600">{formatDate(app.followUpDate)}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No applications match these filters.</td></tr>}</tbody></table></div></div><ApplicantDetail selected={selected} saving={saving} onUpdate={updateSelected} /></section><section className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-bold text-navy">Referral links</h2><p className="mt-1 text-sm text-gray-600">Codes are opaque, revocable, and never derived from database IDs. Static hosting uses a query-based referral link.</p></div><div className="grid gap-2 sm:grid-cols-[160px_200px_auto]"><div><Label htmlFor="partner-type">Partner type</Label><select id="partner-type" value={newReferralType} onChange={(event) => setNewReferralType(event.target.value)} className="mt-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-navy"><option value="founding_user">Founding user</option><option value="sailing_captain">Sailing captain</option><option value="cruise_creator">Cruise creator</option><option value="travel_advisor">Travel advisor</option><option value="community_admin">Community administrator</option><option value="internal_campaign">Internal campaign</option></select></div><Input inputId="referral-label" label="Label (optional)" value={newReferralLabel} onChange={(event) => setNewReferralLabel(event.target.value)} /><Button onClick={createReferral} disabled={saving}><Plus className="h-4 w-4" />Create</Button></div></div><div className="mt-5 divide-y divide-gray-100">{referrals.map((referral) => <div key={referral.code} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-sm font-bold text-navy">{referral.code}</p><p className="text-xs text-gray-500">{referral.partnerType}{referral.label ? ` · ${referral.label}` : ""} · {referral.active ? "Active" : "Revoked"}</p></div><div className="flex items-center gap-2"><a href={`/r/?code=${encodeURIComponent(referral.code)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark">Open link <ExternalLink className="h-3.5 w-3.5" /></a>{referral.active && <Button size="sm" variant="outline" onClick={() => void revokeReferral(referral.code)} disabled={saving}>Revoke</Button>}</div></div>)}{referrals.length === 0 && <p className="py-5 text-sm text-gray-500">No referral codes created yet.</p>}</div></section></div></main>;
}

function Filter({ label, value, onChange, type }: { label: string; value: string; onChange: (value: string) => void; type: string }) { return <div><Label htmlFor={`filter-${label}`}>{label}</Label><input id={`filter-${label}`} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs text-navy" /></div>; }
function SelectFilter({ label, value, onChange, values, labels }: { label: string; value: string; onChange: (value: string) => void; values: string[]; labels?: Record<string, string> }) { return <div><Label htmlFor={`filter-${label}`}>{label}</Label><select id={`filter-${label}`} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-xs text-navy">{values.map((item) => <option key={item || "all"} value={item}>{labels?.[item] ?? (item || `All ${label.toLowerCase()}s`)}</option>)}</select></div>; }
// The editor intentionally resets draft fields when a different applicant is selected.
// eslint-disable-next-line react-hooks/set-state-in-effect
function ApplicantDetail({ selected, saving, onUpdate }: { selected: Application | null; saving: boolean; onUpdate: (patch: Partial<Application>) => Promise<void> }) { const [notes, setNotes] = useState(""); const [followUp, setFollowUp] = useState(""); useEffect(() => { setNotes(selected?.founderNotes ?? ""); setFollowUp(selected?.followUpDate ?? ""); }, [selected?.id, selected?.founderNotes, selected?.followUpDate]); if (!selected) return <aside className="rounded-xl border border-dashed border-gray-300 p-7 text-sm text-gray-500">Select an application to review its details.</aside>; return <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)]"><p className="text-sm font-semibold text-teal">Applicant details</p><h2 className="mt-1 text-2xl font-bold text-navy">{selected.firstName || "Applicant"}</h2><p className="mt-1 text-sm text-gray-600">{selected.email || "No email captured"}</p><dl className="mt-5 space-y-3 border-y border-gray-100 py-4 text-sm"><Detail label="Cruise" value={[selected.cruiseLine, selected.ship, selected.departureDate].filter(Boolean).join(" · ") || "—"} /><Detail label="Source" value={[selected.campaign || "Direct", selected.referralCode].filter(Boolean).join(" · ")} /><Detail label="Meaningful actions" value={selected.meaningfulActions?.join(", ") || "None yet"} /><Detail label="MyCrew" value={`${selected.invites?.sent ?? 0} sent · ${selected.invites?.accepted ?? 0} accepted`} /></dl><div className="mt-5 grid gap-4"><div><Label htmlFor="app-status">Pipeline status</Label><select id="app-status" value={selected.status} onChange={(event) => void onUpdate({ status: event.target.value as GrowthStatus })} disabled={saving} className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-navy">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><Input inputId="follow-up" label="Follow-up date" type="date" value={followUp} onChange={(event) => setFollowUp(event.target.value)} /><div className="grid gap-1.5"><Label htmlFor="founder-notes">Founder notes</Label><textarea id="founder-notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} className="min-h-28 rounded-lg border border-gray-200 bg-white p-3 text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal" /></div><Button onClick={() => void onUpdate({ founderNotes: notes, followUpDate: followUp })} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : "Save notes"}</Button></div></aside>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt><dd className="mt-1 leading-relaxed text-gray-700">{value || "—"}</dd></div>; }
