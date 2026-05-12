"use client";

import React from "react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import { dummyPayments, dummyReceipts, dummyFinanceLiquidity, dummyFinanceReceiptPipeline, dummyFinancePaymentPipeline, dummySchemeConcentration } from "@/data";
import { cpsColor, defaultOptions } from "@/components/ChartConfig";
import { KpiCard } from "@/components/KpiCard";
import { lastSixMonthsReceiptPaymentSeries } from "@/lib/financeMonthlySeries";
import { formatMk } from "@/lib/format";

type AnalyticsPayload = {
  clientFundsMk: number;
  receivablesMk: number;
  reconciledPercentage: number;
  receiptsLast7Days: number[];
};

export default function FinancePage() {
  const [api, setApi] = React.useState<AnalyticsPayload | null>(null);

  React.useEffect(() => {
    let c = false;
    fetch("/api/analytics", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { status?: number; data?: AnalyticsPayload }) => {
        if (!c && j?.status === 1 && j.data) setApi(j.data);
      })
      .catch(() => {});
    return () => {
      c = true;
    };
  }, []);

  const approvedReceipts = dummyReceipts.filter((r) => r.authStatus === "Approved");
  const approvedPayments = dummyPayments.filter((p) => p.authStatus === "Approved");
  const inflow = approvedReceipts.reduce((a, r) => a + r.amountMk, 0);
  const outflow = approvedPayments.reduce((a, p) => a + p.amountMk, 0);

  const monthBuckets = React.useMemo(
    () => lastSixMonthsReceiptPaymentSeries(dummyReceipts, dummyPayments),
    [],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-cps-950">Finance</h1>
          {/* <p className="text-xs text-slate-600">Receivables, client funds, and illustrative movements.</p> */}
          <p className="text-xs text-slate-600">Receivables, client funds, and cash movements.</p>
        </div>
        <div className="flex shrink-0 flex-row flex-nowrap items-center gap-2">
          <Link href="/finance/reconciliation" className="cps-btn shrink-0 whitespace-nowrap text-[11px]">
            Reconciliation
          </Link>
          <Link href="/finance/posting-queue" className="cps-btn-primary shrink-0 whitespace-nowrap text-[11px]">
            Posting queue
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Client funds" value={api ? formatMk(api.clientFundsMk) : "—"} />
        <KpiCard label="Receivables" value={api ? formatMk(api.receivablesMk) : "—"} />
        <KpiCard label="Reconciliation" value={api ? `${api.reconciledPercentage}%` : "—"} />
        <KpiCard label="Net (receipts − payments)" value={formatMk(inflow - outflow)} sub="Approved transactions" />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <section className="cps-panel p-3">
          <h2 className="cps-panel-title">Receipt authorisation pipeline</h2>
          <p className="cps-panel-sub mb-2">Counts and MK still inside each workflow stage (demo)</p>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-0">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th className="text-right">Items</th>
                  <th className="text-right">Amount (MK)</th>
                </tr>
              </thead>
              <tbody>
                {dummyFinanceReceiptPipeline.map((row) => (
                  <tr key={row.stage}>
                    <td className="text-slate-800">{row.stage}</td>
                    <td className="text-right tabular-nums text-slate-700">{row.count}</td>
                    <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(row.amountMk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="cps-panel p-3">
          <h2 className="cps-panel-title">Payment authorisation pipeline</h2>
          <p className="cps-panel-sub mb-2">Benefit runs and ad-hoc settlements awaiting release</p>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-0">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th className="text-right">Items</th>
                  <th className="text-right">Amount (MK)</th>
                </tr>
              </thead>
              <tbody>
                {dummyFinancePaymentPipeline.map((row) => (
                  <tr key={row.stage}>
                    <td className="text-slate-800">{row.stage}</td>
                    <td className="text-right tabular-nums text-slate-700">{row.count}</td>
                    <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(row.amountMk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <section className="cps-panel p-3">
          <h2 className="cps-panel-title">Liquidity and bank balances</h2>
          <p className="cps-panel-sub mb-2">Consolidated view for trustee pack (MK, illustrative)</p>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-[520px]">
              <thead>
                <tr>
                  <th>Bucket</th>
                  <th>Institution</th>
                  <th className="text-right">Balance (MK)</th>
                  <th className="text-right">As of</th>
                </tr>
              </thead>
              <tbody>
                {dummyFinanceLiquidity.map((row) => (
                  <tr key={row.label}>
                    <td className="font-medium text-ink">{row.label}</td>
                    <td className="text-slate-700">{row.institution}</td>
                    <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(row.balanceMk)}</td>
                    <td className="text-right tabular-nums text-slate-600">{row.asOf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="cps-panel p-3">
          <h2 className="cps-panel-title">Employer concentration (90d receipts)</h2>
          <p className="cps-panel-sub mb-2">Where approved contribution inflows cluster — risk monitoring</p>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-[400px]">
              <thead>
                <tr>
                  <th>Employer / pool</th>
                  <th className="text-right">Receipts (MK)</th>
                  <th className="text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {dummySchemeConcentration.map((row) => (
                  <tr key={row.scheme}>
                    <td className="text-slate-800">{row.scheme}</td>
                    <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(row.receiptsLast90dMk)}</td>
                    <td className="text-right tabular-nums text-slate-700">{row.pctOfInflows}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="cps-panel p-3">
        <div className="mb-2">
          <h2 className="cps-panel-title">Receipts vs benefit payments</h2>
          {/* <p className="cps-panel-sub">MK — synthetic six-month trend</p> */}
          <p className="cps-panel-sub">MK — approved receipts and payments by calendar month (rolling six months)</p>
        </div>
        <div className="h-52">
          <Bar
            options={{
              ...defaultOptions,
              plugins: {
                ...defaultOptions.plugins,
                legend: { display: true, position: "bottom", labels: { boxWidth: 12, color: "#334155", font: { size: 11 } } },
              },
            }}
            data={{
              labels: monthBuckets.labels,
              datasets: [
                {
                  label: "Receipts",
                  data: monthBuckets.receipts,
                  backgroundColor: cpsColor(600, 0.88),
                  borderRadius: 6,
                },
                {
                  label: "Payments",
                  data: monthBuckets.payments,
                  backgroundColor: "rgba(217, 119, 6, 0.75)",
                  borderRadius: 6,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
