"use client";

import React from "react";
import Link from "next/link";
import { dummyPwMembers } from "@/data";
import { DataToolbar } from "@/components/DataToolbar";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { formatDate, formatMk } from "@/lib/format";

export default function ProgrammedWithdrawalsPage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [dueOnly, setDueOnly] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return dummyPwMembers.filter((m) => {
      if (dueOnly) {
        const d = new Date(m.nextDueDate);
        if (d.getMonth() !== month || d.getFullYear() !== year) return false;
      }
      if (!t) return true;
      const blob = `${m.firstName} ${m.lastName} ${m.district} ${m.planType}`.toLowerCase();
      return blob.includes(t);
    });
  }, [q, dueOnly]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Withdrawals</h1>
        <p className="text-xs text-slate-600">Programmed withdrawal (PW) members — installments, balances, and next due dates.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Active PW members</div>
          <div className="mt-0.5 text-xl font-bold text-ink">{dummyPwMembers.length}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Combined fund balance</div>
          <div className="mt-0.5 text-xl font-bold text-ink">
            {formatMk(dummyPwMembers.reduce((a, m) => a + m.fundBalanceMk, 0))}
          </div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Monthly outflow</div>
          <div className="mt-0.5 text-xl font-bold text-ink">
            {formatMk(dummyPwMembers.reduce((a, m) => a + m.monthlyInstallmentMk, 0))}
          </div>
        </div>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">PW member list</h2>
            <p className="cps-panel-sub">{rows.length} of {dummyPwMembers.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="withdrawals-search"
              search={q}
              onSearchChange={setQ}
              searchPlaceholder="Search pensioner or plan…"
              actions={
                <>
                  <button
                    type="button"
                    className={`cps-btn shrink-0 whitespace-nowrap ${dueOnly ? "ring-2 ring-sky-400" : ""}`}
                    onClick={() => setDueOnly((v) => !v)}
                  >
                    Due this month
                  </button>
                  <button type="button" className="cps-btn-primary shrink-0 whitespace-nowrap" onClick={() => setScheduleOpen(true)}>
                    Schedule payment
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
                <th>Pensioner</th>
                <th>District</th>
                <th>Plan</th>
                <th className="text-right">Fund balance (MK)</th>
                <th className="text-right">Installment (MK)</th>
                <th>Next due</th>
                <th className="w-36 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link href={`/programmed-withdrawals/${m.id}`} className="font-semibold text-ink hover:text-cps-800 hover:underline">
                      {m.firstName} {m.lastName}
                    </Link>
                  </td>
                  <td className="text-slate-700">{m.district}</td>
                  <td className="text-slate-800">{m.planType}</td>
                  <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(m.fundBalanceMk)}</td>
                  <td className="text-right tabular-nums text-slate-800">{formatMk(m.monthlyInstallmentMk)}</td>
                  <td className="tabular-nums text-slate-700">{formatDate(m.nextDueDate)}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/programmed-withdrawals/${m.id}`} className="cps-btn py-1 text-[11px]">
                        Open
                      </Link>
                      <button
                        type="button"
                        className="cps-btn py-1 text-[11px]"
                        onClick={() =>
                          pushToast(`Bank file line queued for ${m.firstName} ${m.lastName}.`, "success")
                        }
                      >
                        Bank line
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
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule PW payment run"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setScheduleOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setScheduleOpen(false);
                pushToast("Payment run PW-RUN-DRAFT-12 scheduled for authorizer.", "success");
              }}
            >
              Queue run
            </button>
          </div>
        }
      >
        <p className="mb-2 text-sm text-slate-600">Select value date and bank account for the combined PW batch.</p>
        <label className="block text-[11px] font-semibold text-slate-700">Value date</label>
        <input className="cps-input mb-2 mt-0.5 w-full" type="date" />
        <label className="block text-[11px] font-semibold text-slate-700">Disbursement account</label>
        <select className="cps-input mt-0.5 w-full" defaultValue="main">
          <option value="main">Main operating — FDH ****9021</option>
          <option value="pw">PW suspense — NBM ****4410</option>
        </select>
      </Modal>
    </div>
  );
}
