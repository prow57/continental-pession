"use client";

import React from "react";
import Link from "next/link";
import { dummyMembers, dummyReceipts, type FundReceipt } from "@/data";
import { DataToolbar } from "@/components/DataToolbar";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { downloadTableCsv } from "@/lib/documents";
import { formatDate, formatMk } from "@/lib/format";

function memberName(id: string): string {
  const m = dummyMembers.find((x) => x.id === id);
  return m ? `${m.firstName} ${m.lastName}` : id;
}

function statusStyle(s: string) {
  if (s === "Approved") return "bg-emerald-100/90 text-emerald-900 ring-emerald-700/20";
  if (s === "Pending") return "bg-amber-100/90 text-amber-950 ring-amber-700/25";
  if (s === "Rejected") return "bg-red-100/90 text-red-900 ring-red-700/25";
  return "bg-slate-100 text-slate-800 ring-slate-600/15";
}

export default function ReceiptsPage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [auth, setAuth] = React.useState<"all" | FundReceipt["authStatus"]>("all");
  const [newReceiptOpen, setNewReceiptOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return dummyReceipts.filter((r) => {
      if (auth !== "all" && r.authStatus !== auth) return false;
      if (!t) return true;
      const blob = `${r.reference} ${memberName(r.memberId)} ${r.description} ${r.amountMk}`.toLowerCase();
      return blob.includes(t);
    });
  }, [q, auth]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Receipts</h1>
        {/* <p className="text-xs text-slate-600">Contribution receipts with authorization states (dummy).</p> */}
        <p className="text-xs text-slate-600">Contribution receipts with authorization states.</p>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Receipt register</h2>
            <p className="cps-panel-sub">{rows.length} of {dummyReceipts.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="receipts-search"
              leading={
                <select
                  className="cps-input w-auto shrink-0 min-w-[8.75rem] max-w-[11rem]"
                  value={auth}
                  onChange={(e) => setAuth(e.target.value as typeof auth)}
                  aria-label="Filter by authorization"
                >
                  <option value="all">All auth states</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              }
              search={q}
              onSearchChange={setQ}
              searchPlaceholder="Search reference, member, amount…"
              actions={
                <>
                  <button
                    type="button"
                    className="cps-btn shrink-0 whitespace-nowrap"
                    onClick={() => {
                      downloadTableCsv(
                        `receipts-${new Date().toISOString().slice(0, 10)}.csv`,
                        rows.map((r) => ({
                          id: r.id,
                          reference: r.reference,
                          member: memberName(r.memberId),
                          date: r.date,
                          description: r.description,
                          amountMk: r.amountMk,
                          authStatus: r.authStatus,
                        })),
                        [
                          { key: "id", header: "ID" },
                          { key: "reference", header: "Reference" },
                          { key: "member", header: "Member" },
                          { key: "date", header: "Date" },
                          { key: "description", header: "Description" },
                          { key: "amountMk", header: "Amount MK" },
                          { key: "authStatus", header: "Auth" },
                        ],
                      );
                      pushToast(`Exported ${rows.length} receipt row(s).`, "success");
                    }}
                  >
                    Export CSV
                  </button>
                  <button type="button" className="cps-btn-primary shrink-0 whitespace-nowrap" onClick={() => setNewReceiptOpen(true)}>
                    New receipt
                  </button>
                </>
              }
            />
          </div>
        </div>
        <div className="cps-table-wrap">
          <table className="cps-table min-w-[760px]">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Member</th>
                <th>Date</th>
                <th>Description</th>
                <th className="text-right">Amount (MK)</th>
                <th>Auth</th>
                <th className="w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-[11px] font-medium text-slate-900">{r.reference}</td>
                  <td className="font-medium text-slate-900">{memberName(r.memberId)}</td>
                  <td className="tabular-nums text-slate-700">{formatDate(r.date)}</td>
                  <td className="text-slate-700">{r.description}</td>
                  <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(r.amountMk)}</td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyle(r.authStatus)}`}
                    >
                      {r.authStatus}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/receipts/${r.id}`} className="cps-btn py-1 text-[11px]">
                        View
                      </Link>
                      <button
                        type="button"
                        className="cps-btn py-1 text-[11px]"
                        onClick={() => {
                          if (r.authStatus === "Approved") {
                            pushToast(`${r.reference} is already approved.`, "info");
                            return;
                          }
                          pushToast(`${r.reference} submitted to authorizer queue.`, "success");
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={newReceiptOpen}
        onClose={() => setNewReceiptOpen(false)}
        title="New contribution receipt"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setNewReceiptOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setNewReceiptOpen(false);
                pushToast("Receipt draft RCP-TMP-44102 saved.", "success");
              }}
            >
              Save draft
            </button>
          </div>
        }
      >
        <label className="block text-[11px] font-semibold text-slate-700">Member ID</label>
        <input className="cps-input mb-2 mt-0.5 w-full font-mono text-sm" placeholder="m-101" />
        <label className="block text-[11px] font-semibold text-slate-700">Amount (MK)</label>
        <input className="cps-input mb-2 mt-0.5 w-full" type="number" placeholder="285000" />
        <label className="block text-[11px] font-semibold text-slate-700">Description</label>
        <input className="cps-input mt-0.5 w-full" placeholder="Monthly contribution" />
      </Modal>
    </div>
  );
}
