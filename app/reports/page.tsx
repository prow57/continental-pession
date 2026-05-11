"use client";

import React from "react";
import { DataToolbar } from "@/components/DataToolbar";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { downloadReportCataloguePdf, downloadReportOutputPdf } from "@/lib/documents";

const reports = [
  { name: "Member balances", module: "Pension / PW / Voluntary", format: "PDF · Excel · CSV" },
  { name: "Transaction trail", module: "All modules", format: "PDF · Excel" },
  { name: "Control & reconciliation", module: "Finance", format: "PDF" },
  { name: "Beneficiaries", module: "Pension / PW", format: "Excel" },
  { name: "Member grouping (gender, employer, age)", module: "Pension", format: "Excel" },
  { name: "Fees (management)", module: "Voluntary", format: "PDF · Excel" },
  { name: "Fund movement by period", module: "Voluntary", format: "PDF · Excel · CSV" },
  { name: "User activity & security", module: "ICT reporting", format: "PDF" },
];

export default function ReportsPage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [mod, setMod] = React.useState<string>("all");
  const [preview, setPreview] = React.useState<{ name: string; module: string; format: string } | null>(null);
  const [runBusy, setRunBusy] = React.useState<string | null>(null);

  const modules = React.useMemo(() => {
    const set = new Set(reports.map((r) => r.module));
    return ["all", ...Array.from(set)];
  }, []);

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return reports.filter((r) => {
      if (mod !== "all" && r.module !== mod) return false;
      if (!t) return true;
      return `${r.name} ${r.module} ${r.format}`.toLowerCase().includes(t);
    });
  }, [q, mod]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Reports</h1>
        {/* <p className="text-xs text-slate-600">Catalogue mapped to requirements — export formats are placeholders.</p> */}
        <p className="text-xs text-slate-600">Report catalogue by module and export format.</p>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Report catalogue</h2>
            <p className="cps-panel-sub">{rows.length} of {reports.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="reports-search"
              actions={
                <button
                  type="button"
                  className="cps-btn shrink-0 whitespace-nowrap text-[11px]"
                  onClick={async () => {
                    await downloadReportCataloguePdf(rows.slice(0, 24));
                    pushToast("Catalogue snapshot downloaded.", "success");
                  }}
                >
                  Export catalogue
                </button>
              }
              leading={
                <select
                  className="cps-input w-auto shrink-0 min-w-[10rem] max-w-[16rem]"
                  value={mod}
                  onChange={(e) => setMod(e.target.value)}
                  aria-label="Filter by module"
                >
                  {modules.map((m) => (
                    <option key={m} value={m}>
                      {m === "all" ? "All modules" : m}
                    </option>
                  ))}
                </select>
              }
              search={q}
              onSearchChange={setQ}
              searchPlaceholder="Search reports…"
            />
          </div>
        </div>
        <div className="cps-table-wrap">
          <table className="cps-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Module</th>
                <th>Preview / export</th>
                <th className="w-44 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="font-semibold text-ink">{r.name}</td>
                  <td className="text-slate-700">{r.module}</td>
                  <td className="text-slate-600">{r.format}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button type="button" className="cps-btn py-1 text-[11px]" onClick={() => setPreview(r)}>
                        Preview
                      </button>
                      <button
                        type="button"
                        className="cps-btn-primary py-1 text-[11px]"
                        disabled={runBusy === r.name}
                        onClick={async () => {
                          setRunBusy(r.name);
                          try {
                            const res = await fetch("/api/reports/run", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ reportName: r.name, format: "PDF", module: r.module }),
                            });
                            const j = (await res.json()) as { status?: number; jobId?: string; message?: string };
                            if (j?.status === 1) {
                              await downloadReportOutputPdf({
                                reportName: r.name,
                                module: r.module,
                                jobId: j.jobId ?? "—",
                                message: j.message ?? "Queued",
                                parameters: "Last closed month · all schemes · MK · authorization status included",
                              });
                              pushToast(j.message ?? "Report queued.", "success");
                            } else pushToast("Report request failed.", "error");
                          } catch {
                            pushToast("Network error starting report.", "error");
                          } finally {
                            setRunBusy(null);
                          }
                        }}
                      >
                        {runBusy === r.name ? "…" : "Run"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview ? `Preview · ${preview.name}` : "Preview"}>
        {preview ? (
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-ink">Module:</span> {preview.module}
            </p>
            <p>
              <span className="font-semibold text-ink">Formats:</span> {preview.format}
            </p>
            <p className="rounded-md border border-cps-200 bg-cps-50/80 p-2 text-xs">
              Live preview renders paginated output when connected to the reporting service. Run queues the job and downloads a
              summary PDF with the returned job reference.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
