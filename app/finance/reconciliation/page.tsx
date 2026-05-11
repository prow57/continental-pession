"use client";

import React from "react";
import { BackLink } from "@/components/BackLink";
import { formatMk } from "@/lib/format";
import { useToast } from "@/components/ToastProvider";
import type { ReconciliationBatch } from "@/data";

export default function FinanceReconciliationPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = React.useState<ReconciliationBatch[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let c = false;
    fetch("/api/operations/reconciliation", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { status?: number; data?: ReconciliationBatch[] }) => {
        if (c) return;
        if (j?.status === 1 && j.data) setRows(j.data);
        else setErr("Could not load batches");
      })
      .catch(() => {
        if (!c) setErr("Network error");
      });
    return () => {
      c = true;
    };
  }, []);

  return (
    <div className="space-y-3">
      <BackLink href="/finance">Finance</BackLink>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-cps-950">Reconciliation</h1>
          <p className="text-xs text-slate-600">Bank vs fund control batches · approve variances and close periods.</p>
        </div>
        <button
          type="button"
          className="cps-btn-primary shrink-0 text-[11px]"
          onClick={() => {
            pushToast("New reconciliation period wizard opened.", "success");
          }}
        >
          New period
        </button>
      </div>

      {err ? <p className="text-sm text-red-700">{err}</p> : null}
      {!rows && !err ? <p className="text-sm text-slate-600">Loading batches…</p> : null}

      {rows ? (
        <section className="cps-panel">
          <div className="cps-panel-hd">
            <div>
              <h2 className="cps-panel-title">Open &amp; closed batches</h2>
              <p className="cps-panel-sub">{rows.length} batches</p>
            </div>
          </div>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Status</th>
                  <th className="text-right">Variance</th>
                  <th className="text-right">Bank lines</th>
                  <th className="text-right">Fund lines</th>
                  <th className="w-36 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
                    <td className="font-medium text-ink">{b.periodLabel}</td>
                    <td className="text-slate-800">{b.status}</td>
                    <td className="text-right tabular-nums text-slate-800">{formatMk(b.varianceMk)}</td>
                    <td className="text-right tabular-nums text-slate-700">{b.bankStatementLines}</td>
                    <td className="text-right tabular-nums text-slate-700">{b.fundLines}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="cps-btn py-1 text-[11px]"
                        onClick={() => pushToast(`Opened variance workspace for ${b.id}.`, "info")}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
