"use client";

import React from "react";
import Link from "next/link";
import { dummyVoluntary } from "@/data";
import { DataToolbar } from "@/components/DataToolbar";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { downloadTableCsv, downloadVoluntaryStatementPdf } from "@/lib/documents";
import { formatMk } from "@/lib/format";

export default function VoluntaryPage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [bookOpen, setBookOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return dummyVoluntary;
    return dummyVoluntary.filter((v) => {
      const blob = `${v.firstName} ${v.lastName} ${v.district} ${v.id}`.toLowerCase();
      return blob.includes(t);
    });
  }, [q]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Voluntary</h1>
        {/* <p className="text-xs text-slate-600">
          Voluntary contributions — 60% pension benefit account, 40% personal savings (dummy balances in MK).
        </p> */}
        <p className="text-xs text-slate-600">
          Voluntary contributions — 60% pension benefit account, 40% personal savings (MK).
        </p>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Voluntary member balances</h2>
            <p className="cps-panel-sub">{rows.length} of {dummyVoluntary.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="voluntary-search"
              search={q}
              onSearchChange={setQ}
              searchPlaceholder="Search name, district…"
              actions={
                <>
                  <button
                    type="button"
                    className="cps-btn shrink-0 whitespace-nowrap"
                    onClick={() => {
                      downloadTableCsv(
                        `voluntary-balances-${new Date().toISOString().slice(0, 10)}.csv`,
                        rows.map((v) => ({
                          id: v.id,
                          name: `${v.firstName} ${v.lastName}`,
                          district: v.district,
                          pensionPortionMk: v.pensionPortionMk,
                          personalSavingsMk: v.personalSavingsMk,
                          lastContributionDate: v.lastContributionDate,
                        })),
                        [
                          { key: "id", header: "ID" },
                          { key: "name", header: "Member" },
                          { key: "district", header: "District" },
                          { key: "pensionPortionMk", header: "Pension MK" },
                          { key: "personalSavingsMk", header: "Personal MK" },
                          { key: "lastContributionDate", header: "Last contribution" },
                        ],
                      );
                      pushToast("Sage-compatible CSV exported.", "success");
                    }}
                  >
                    Sage export
                  </button>
                  <button type="button" className="cps-btn-primary shrink-0 whitespace-nowrap" onClick={() => setBookOpen(true)}>
                    Book receipt
                  </button>
                </>
              }
            />
          </div>
        </div>
        <div className="cps-table-wrap">
          <table className="cps-table min-w-[720px]">
            <thead>
              <tr>
                <th>Member</th>
                <th>District</th>
                <th className="text-right">Pension (60%) (MK)</th>
                <th className="text-right">Personal (40%) (MK)</th>
                <th className="text-right">Total (MK)</th>
                <th>Last contribution</th>
                <th className="w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => {
                const total = v.pensionPortionMk + v.personalSavingsMk;
                return (
                  <tr key={v.id}>
                    <td className="font-semibold text-ink">
                      {v.firstName} {v.lastName}
                    </td>
                    <td className="text-slate-700">{v.district}</td>
                    <td className="text-right font-medium tabular-nums text-cps-950">{formatMk(v.pensionPortionMk)}</td>
                    <td className="text-right tabular-nums text-slate-800">{formatMk(v.personalSavingsMk)}</td>
                    <td className="text-right font-bold tabular-nums text-ink">{formatMk(total)}</td>
                    <td className="tabular-nums text-slate-700">{v.lastContributionDate}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/voluntary/${v.id}`} className="cps-btn py-1 text-[11px]">
                          Statement
                        </Link>
                        <button
                          type="button"
                          className="cps-btn py-1 text-[11px]"
                        onClick={async () => {
                            await downloadVoluntaryStatementPdf({
                              statementId: v.id,
                              memberName: `${v.firstName} ${v.lastName}`,
                              district: v.district,
                              pensionPortionMk: v.pensionPortionMk,
                              personalSavingsMk: v.personalSavingsMk,
                            });
                            pushToast(`Statement saved for ${v.id}.`, "success");
                          }}
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* <div className="rounded-lg border border-cps-200/80 bg-cps-50/60 p-3 text-xs leading-relaxed text-slate-800">
        <span className="font-bold text-cps-900">Controls:</span> booking rules, reversals, fee on earnings, and full audit trail
        are applied on every voluntary credit and booking.
      </div> */}

      <Modal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        title="Book voluntary receipt"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setBookOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setBookOpen(false);
                pushToast("Receipt booked to 60/40 split with journal VOL-TMP-771.", "success");
              }}
            >
              Post booking
            </button>
          </div>
        }
      >
        <label className="block text-[11px] font-semibold text-slate-700">Member ID</label>
        <input className="cps-input mb-2 mt-0.5 w-full font-mono text-sm" placeholder="v-3" />
        <label className="block text-[11px] font-semibold text-slate-700">Gross amount (MK)</label>
        <input className="cps-input mb-2 mt-0.5 w-full" type="number" />
        <label className="block text-[11px] font-semibold text-slate-700">Value date</label>
        <input className="cps-input mt-0.5 w-full" type="date" />
      </Modal>
    </div>
  );
}
