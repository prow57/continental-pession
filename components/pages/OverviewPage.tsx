"use client";

import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  dummyMembers,
  dummyReceipts,
  filterReceiptsByPeriod,
  genderBreakdown,
  schemeMix,
  sumReceiptsMk,
  type Period,
} from "@/data";
import { KpiCard } from "@/components/KpiCard";
import { cpsColor, defaultOptions } from "@/components/ChartConfig";
import { useToast } from "@/components/ToastProvider";
import { computeAnalytics } from "@/lib/computeAnalytics";
import { formatMk } from "@/lib/format";

type AnalyticsPayload = {
  totalMembersManaged: number;
  activeCompanies: number;
  pendingAuthorizations: number;
  clientFundsMk: number;
  receivablesMk: number;
  reconciledPercentage: number;
  receiptsLast7Days: number[];
};

const gold = "rgba(217, 119, 6, 0.92)";
const goldSoft = "rgba(251, 191, 36, 0.55)";

export default function OverviewPage() {
  const { pushToast } = useToast();
  const [period, setPeriod] = React.useState<Period>("month");
  const [api, setApi] = React.useState<AnalyticsPayload | null>(null);
  const [refreshedAt, setRefreshedAt] = React.useState<string>("");
  const [apiLoading, setApiLoading] = React.useState(false);

  const snapshot = React.useMemo(() => computeAnalytics(), []);

  const loadApi = React.useCallback(
    (opts?: { announce?: boolean }) => {
      setApiLoading(true);
      fetch("/api/analytics", { cache: "no-store" })
        .then((r) => r.json())
        .then((j: { status?: number; data?: AnalyticsPayload }) => {
          if (j && j.status === 1 && j.data) {
            setApi(j.data);
            setRefreshedAt(new Date().toLocaleTimeString("en-MW", { hour: "2-digit", minute: "2-digit" }));
            if (opts?.announce) pushToast("Management metrics refreshed from API.", "success");
          } else {
            if (opts?.announce) pushToast("Analytics API returned an unexpected payload.", "error");
          }
        })
        .catch(() => {
          if (opts?.announce) pushToast("Could not reach analytics API — showing computed fallback.", "error");
          setApi(snapshot);
          setRefreshedAt(new Date().toLocaleTimeString("en-MW", { hour: "2-digit", minute: "2-digit" }));
        })
        .finally(() => setApiLoading(false));
    },
    [pushToast, snapshot],
  );

  React.useEffect(() => {
    loadApi();
  }, [loadApi]);

  const filteredReceipts = React.useMemo(() => filterReceiptsByPeriod(dummyReceipts, period), [period]);
  const receiptTotal = sumReceiptsMk(filteredReceipts);
  const pendingAuth = api?.pendingAuthorizations ?? snapshot.pendingAuthorizations;
  const totalManaged = api?.totalMembersManaged ?? snapshot.totalMembersManaged;

  const gender = React.useMemo(() => genderBreakdown(dummyMembers), []);
  const schemes = React.useMemo(() => schemeMix(), []);

  const receiptsByAuth = React.useMemo(() => {
    const counts: Record<string, number> = { Approved: 0, Pending: 0, Draft: 0, Rejected: 0 };
    filteredReceipts.forEach((r) => {
      counts[r.authStatus] = (counts[r.authStatus] || 0) + 1;
    });
    const labels = Object.keys(counts).filter((k) => counts[k] > 0);
    const values = labels.map((k) => counts[k]);
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const pct = values.map((v) => Math.round((v / total) * 100));
    return { labels, pct };
  }, [filteredReceipts]);

  const activityByDaypart = React.useMemo(() => {
    const buckets = Array.from({ length: 12 }).map(() => 0);
    filteredReceipts.forEach((r) => {
      const h = new Date(r.date).getHours();
      const slot = Math.floor(h / 2);
      buckets[slot] += 1;
    });
    const max = Math.max(1, ...buckets);
    return buckets.map((v) => Math.round((v / max) * 100));
  }, [filteredReceipts]);

  const last7 = api?.receiptsLast7Days;
  const revenueLast7 = React.useMemo(() => {
    if (last7 && last7.length === 7) {
      const labels = last7.map((_, i) => (i === 6 ? "Today" : `-${6 - i}d`));
      return { values: last7, labels };
    }
    const out: number[] = [];
    const labels: string[] = [];
    const ref = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(ref);
      d.setDate(ref.getDate() - i);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const sum = dummyReceipts.reduce((acc, s) => {
        const t = new Date(s.date).getTime();
        if (t >= dayStart.getTime() && t <= dayEnd.getTime() && s.authStatus === "Approved") return acc + s.amountMk;
        return acc;
      }, 0);
      out.push(sum);
      labels.push(i === 0 ? "Today" : `-${i}d`);
    }
    return { values: out, labels };
  }, [last7]);

  const kycComplete = dummyMembers.filter((m) => m.kycComplete).length;
  const kycPct = Math.round((kycComplete / dummyMembers.length) * 100);

  return (
    <div className="space-y-3">
      <div className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h1 className="cps-panel-title">Management overview</h1>
            {/* <p className="cps-panel-sub">
              KPIs across CPS modules · MK · demo cohort (Lilongwe, Blantyre, Zomba, Mzuzu, …)
            </p> */}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {refreshedAt ? (
              <span className="text-[11px] text-slate-500" title="Last API refresh">
                Updated {refreshedAt}
              </span>
            ) : null}
            <button type="button" className="cps-btn-primary" disabled={apiLoading} onClick={() => loadApi({ announce: true })}>
              {apiLoading ? "Refreshing…" : "Refresh data"}
            </button>
            <span className="rounded border border-cps-200 bg-cps-50/80 px-2 py-1 text-[11px] font-medium text-cps-900">
              Role: <span className="text-amber-800">Management</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-cps-200/60 bg-cps-50/50 px-3 py-2">
          <label htmlFor="overview-period" className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Reporting period
          </label>
          <select
            id="overview-period"
            className="cps-input w-auto min-w-[11rem]"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label="Reporting period for dashboard metrics"
          >
            <option value="day">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last month</option>
            <option value="year">Last year</option>
          </select>
          <span className="text-[11px] text-slate-500">
            Applies to receipt activity, authorization mix, and period totals.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Members (system)" value={`${totalManaged.toLocaleString()}`} sub="Across all schemes" />
        <KpiCard label="Receipts (period)" value={formatMk(receiptTotal)} sub="Approved receipts only" />
        <KpiCard label="Pending authorizations" value={`${pendingAuth}`} sub="Capturer → authorizer queue" />
        <KpiCard label="KYC complete" value={`${kycPct}%`} />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="cps-panel p-3">
          {/* <div className="text-sm font-semibold text-cps-950">Gender mix (demo cohort)</div> */}
          <div className="text-sm font-semibold text-cps-950">Gender mix</div>
          <div className="cps-panel-sub mb-1.5">Management dashboard grouping</div>
          <div className="flex items-center gap-3">
            <div className="h-32 w-32 shrink-0">
              <Doughnut
                data={{
                  labels: gender.labels,
                  datasets: [
                    {
                      data: gender.values,
                      backgroundColor: [cpsColor(700, 0.95), cpsColor(400, 0.9), goldSoft],
                      borderWidth: 2,
                      borderColor: "#ffffff",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
            <div className="space-y-1 text-sm">
              {gender.labels.map((l, i) => (
                <div key={l} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm ring-1 ring-black/10"
                    style={{
                      backgroundColor: [cpsColor(700, 0.95), cpsColor(400, 0.9), goldSoft][i],
                    }}
                  />
                  <span className="font-medium text-slate-800">{l}</span>
                  <span className="tabular-nums text-slate-500">{gender.values[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cps-panel p-3">
          <div className="text-sm font-semibold text-cps-950">Scheme membership</div>
          <div className="cps-panel-sub mb-1.5">Restricted vs unrestricted (headcount)</div>
          <div className="flex items-center gap-3">
            <div className="h-32 w-32 shrink-0">
              <Doughnut
                data={{
                  labels: schemes.labels,
                  datasets: [
                    {
                      data: schemes.values,
                      backgroundColor: [cpsColor(600, 0.95), gold],
                      borderWidth: 2,
                      borderColor: "#ffffff",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
            <div className="space-y-1 text-sm">
              {schemes.labels.map((l, i) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm ring-1 ring-black/10"
                      style={{ backgroundColor: [cpsColor(600, 0.95), gold][i] }}
                    />
                    <span className="font-medium text-slate-800">{l}</span>
                  </div>
                  <span className="pl-5 text-xs text-slate-500">{schemes.values[i].toLocaleString()} members</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="cps-panel p-3 lg:col-span-2">
          <div className="text-sm font-semibold text-cps-950">Receipt capture activity</div>
          <div className="cps-panel-sub mb-1">Entries by 2-hour slot (period filter)</div>
          <div className="h-36">
            <Bar
              options={{ ...defaultOptions, plugins: { ...defaultOptions.plugins } }}
              data={{
                labels: Array.from({ length: 12 }).map((_, i) => `${i * 2}:00`),
                datasets: [
                  {
                    label: "Receipts",
                    data: activityByDaypart,
                    backgroundColor: cpsColor(500, 0.82),
                    borderRadius: 6,
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="cps-panel p-3">
          <div className="text-sm font-semibold text-cps-950">Receipt volume (7 days)</div>
          <div className="cps-panel-sub mb-1">Approved MK / day</div>
          <div className="h-36">
            <Bar
              options={{ ...defaultOptions, plugins: { ...defaultOptions.plugins } }}
              data={{
                labels: revenueLast7.labels,
                datasets: [
                  {
                    label: "MK",
                    data: revenueLast7.values,
                    backgroundColor: cpsColor(300, 0.9),
                    borderRadius: 6,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="cps-panel p-3">
          <div className="text-sm font-semibold text-cps-950">Authorization status</div>
          <div className="cps-panel-sub mb-1.5">Share of receipts in selected period</div>
          <div className="flex items-center gap-3">
            <div className="h-32 w-32 shrink-0">
              <Doughnut
                data={{
                  labels: receiptsByAuth.labels,
                  datasets: [
                    {
                      data: receiptsByAuth.pct,
                      backgroundColor: [cpsColor(700, 0.92), gold, "#94a3b8", "#ef4444"],
                      borderWidth: 2,
                      borderColor: "#ffffff",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
            <div className="space-y-1 text-sm">
              {receiptsByAuth.labels.map((l, i) => (
                <div key={l} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm ring-1 ring-black/10"
                    style={{ backgroundColor: [cpsColor(700, 0.92), gold, "#94a3b8", "#ef4444"][i] }}
                  />
                  <span className="font-medium text-slate-800">{l}</span>
                  <span className="tabular-nums text-slate-500">{receiptsByAuth.pct[i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cps-panel bg-gradient-to-br from-white via-cps-50/50 to-amber-50/40 p-3">
          <div className="text-sm font-semibold text-cps-950">Finance snapshot</div>
          {/* <div className="cps-panel-sub mb-2">From `/api/analytics`</div> */}
          <div className="cps-panel-sub mb-2">Key balances and reconciliation</div>
          <dl className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
            <div className="rounded-md border border-cps-300/60 bg-white/90 p-2 shadow-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Client funds</dt>
              <dd className="text-base font-bold tabular-nums text-ink">{api ? formatMk(api.clientFundsMk) : "—"}</dd>
            </div>
            <div className="rounded-md border border-cps-300/60 bg-white/90 p-2 shadow-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Receivables</dt>
              <dd className="text-base font-bold tabular-nums text-ink">{api ? formatMk(api.receivablesMk) : "—"}</dd>
            </div>
            <div className="rounded-md border border-cps-300/60 bg-white/90 p-2 shadow-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Reconciliation</dt>
              <dd className="text-base font-bold tabular-nums text-ink">{api ? `${api.reconciledPercentage}%` : "—"}</dd>
            </div>
            <div className="rounded-md border border-cps-300/60 bg-white/90 p-2 shadow-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Employer schemes</dt>
              <dd className="text-base font-bold tabular-nums text-ink">{api ? `${api.activeCompanies}` : "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
