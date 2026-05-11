"use client";

import React from "react";
import Link from "next/link";
import { dummyCompliance, dummyMembers } from "@/data";
import { DataToolbar } from "@/components/DataToolbar";
import { useToast } from "@/components/ToastProvider";
import { downloadTableCsv } from "@/lib/documents";

function SeverityPill({ s }: { s: "low" | "medium" | "high" }) {
  const map = {
    low: "bg-slate-100 text-slate-900 ring-slate-600/15",
    medium: "bg-amber-100/90 text-amber-950 ring-amber-700/25",
    high: "bg-red-100/90 text-red-950 ring-red-700/25",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ring-1 ring-inset ${map[s]}`}>
      {s}
    </span>
  );
}

export default function CompliancePage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [sev, setSev] = React.useState<"all" | "low" | "medium" | "high">("all");

  const flagged = dummyMembers.filter((m) => !m.kycComplete).length;

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return dummyCompliance.filter((c) => {
      if (sev !== "all" && c.severity !== sev) return false;
      if (!t) return true;
      return `${c.issue} ${c.memberRef}`.toLowerCase().includes(t);
    });
  }, [q, sev]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Compliance</h1>
        {/* <p className="text-xs text-slate-600">KYC and control flags — queue for compliance officers (demo).</p> */}
        <p className="text-xs text-slate-600">KYC and control flags — queue for compliance officers.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Open flags</div>
          <div className="mt-0.5 text-xl font-bold text-ink">{dummyCompliance.length}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">KYC incomplete</div>
          <div className="mt-0.5 text-xl font-bold text-ink">{flagged}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Last audit export</div>
          <div className="mt-0.5 text-xl font-bold text-ink">2026-05-09</div>
          <button
            type="button"
            className="cps-btn mt-2 w-full py-1 text-[11px]"
            onClick={() => {
              downloadTableCsv(
                `compliance-open-flags-${new Date().toISOString().slice(0, 10)}.csv`,
                dummyCompliance.map((c) => ({
                  id: c.id,
                  issue: c.issue,
                  memberRef: c.memberRef,
                  since: c.since,
                  severity: c.severity,
                })),
                [
                  { key: "id", header: "ID" },
                  { key: "issue", header: "Issue" },
                  { key: "memberRef", header: "Reference" },
                  { key: "since", header: "Since" },
                  { key: "severity", header: "Severity" },
                ],
              );
              pushToast("Audit pack CSV generated.", "success");
            }}
          >
            Download pack
          </button>
        </div>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Flagged items</h2>
            <p className="cps-panel-sub">{rows.length} of {dummyCompliance.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="compliance-search"
              leading={
                <select
                  className="cps-input w-auto shrink-0 min-w-[8rem] max-w-[11rem]"
                  value={sev}
                  onChange={(e) => setSev(e.target.value as typeof sev)}
                  aria-label="Filter by severity"
                >
                  <option value="all">All severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              }
              search={q}
              onSearchChange={setQ}
              searchPlaceholder="Search issue or member…"
              actions={
                <button
                  type="button"
                  className="cps-btn-primary shrink-0 whitespace-nowrap"
                  onClick={() => pushToast("Sanctions & PEP screening job queued.", "success")}
                >
                  Run screening
                </button>
              }
            />
          </div>
        </div>
        <div className="cps-table-wrap">
          <table className="cps-table min-w-[640px]">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Reference</th>
                <th>Since</th>
                <th>Severity</th>
                <th className="w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="max-w-[280px] font-medium text-ink">{c.issue}</td>
                  <td className="text-sm text-slate-700">{c.memberRef}</td>
                  <td className="tabular-nums text-slate-700">{c.since}</td>
                  <td>
                    <SeverityPill s={c.severity} />
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/compliance/${c.id}`} className="cps-btn py-1 text-[11px]">
                        Open
                      </Link>
                      <button
                        type="button"
                        className="cps-btn py-1 text-[11px]"
                        onClick={() => pushToast(`Resolution workflow started for ${c.id}.`, "success")}
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
