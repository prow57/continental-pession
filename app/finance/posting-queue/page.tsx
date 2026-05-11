"use client";

import React from "react";
import { BackLink } from "@/components/BackLink";
import { formatMk } from "@/lib/format";
import { useToast } from "@/components/ToastProvider";
import type { PostingQueueItem } from "@/data";

export default function FinancePostingQueuePage() {
  const { pushToast } = useToast();
  const [rows, setRows] = React.useState<PostingQueueItem[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let c = false;
    fetch("/api/operations/posting-queue", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { status?: number; data?: PostingQueueItem[] }) => {
        if (c) return;
        if (j?.status === 1 && j.data) setRows(j.data);
        else setErr("Could not load queue");
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
          <h1 className="text-lg font-bold tracking-tight text-cps-950">Posting queue</h1>
          <p className="text-xs text-slate-600">Batches awaiting second eyes before GL posting.</p>
        </div>
      </div>

      {err ? <p className="text-sm text-red-700">{err}</p> : null}
      {!rows && !err ? <p className="text-sm text-slate-600">Loading queue…</p> : null}

      {rows ? (
        <section className="cps-panel">
          <div className="cps-panel-hd">
            <div>
              <h2 className="cps-panel-title">Batches</h2>
              <p className="cps-panel-sub">{rows.length} items</p>
            </div>
          </div>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-[800px]">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Module</th>
                  <th className="text-right">Lines</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th>Captured</th>
                  <th className="w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((q) => (
                  <tr key={q.id}>
                    <td className="font-mono text-[11px] font-semibold text-ink">{q.batchRef}</td>
                    <td className="text-slate-800">{q.module}</td>
                    <td className="text-right tabular-nums text-slate-700">{q.lines}</td>
                    <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(q.amountMk)}</td>
                    <td className="text-sm text-slate-800">{q.status}</td>
                    <td className="text-[11px] text-slate-600">
                      {q.capturedBy}
                      <br />
                      {new Date(q.capturedAt).toLocaleString("en-MW")}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="cps-btn py-1 text-[11px]"
                          onClick={() => pushToast(`Held ${q.batchRef} for query.`, "info")}
                          disabled={q.status === "Posted"}
                        >
                          Hold
                        </button>
                        <button
                          type="button"
                          className="cps-btn-primary py-1 text-[11px]"
                          onClick={() => pushToast(`Approved ${q.batchRef} for posting.`, "success")}
                          disabled={q.status === "Posted"}
                        >
                          Approve
                        </button>
                      </div>
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
