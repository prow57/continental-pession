"use client";

import React from "react";
import Link from "next/link";
import { dummyMembers, dummyPayments, type PensionPayment } from "@/data";
import { DataToolbar } from "@/components/DataToolbar";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { downloadBrandedPdfDocument, downloadTableCsv } from "@/lib/documents";
import { formatMk } from "@/lib/format";

function memberName(id: string): string {
  const m = dummyMembers.find((x) => x.id === id);
  return m ? `${m.firstName} ${m.lastName}` : id;
}

export default function PaymentsPage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [typeF, setTypeF] = React.useState<"all" | PensionPayment["type"]>("all");
  const [newPaymentOpen, setNewPaymentOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return dummyPayments.filter((p) => {
      if (typeF !== "all" && p.type !== typeF) return false;
      if (!t) return true;
      const blob = `${p.reference} ${memberName(p.memberId)} ${p.type} ${p.description}`.toLowerCase();
      return blob.includes(t);
    });
  }, [q, typeF]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Payments</h1>
        {/* <p className="text-xs text-slate-600">Benefit disbursements — voucher / letter generation would plug in here.</p> */}
        <p className="text-xs text-slate-600">Benefit disbursements.</p>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Payment register</h2>
            <p className="cps-panel-sub">{rows.length} of {dummyPayments.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="payments-search"
              leading={
                <select
                  className="cps-input w-auto shrink-0 min-w-[10rem] max-w-[14rem]"
                  value={typeF}
                  onChange={(e) => setTypeF(e.target.value as typeof typeF)}
                  aria-label="Filter by payment type"
                >
                  <option value="all">All payment types</option>
                  <option value="Retirement Payout">Retirement payout</option>
                  <option value="50% Withdrawal">50% withdrawal</option>
                  <option value="Death Benefits">Death benefits</option>
                  <option value="Early Withdrawal">Early withdrawal</option>
                  <option value="Other">Other</option>
                </select>
              }
              search={q}
              onSearchChange={setQ}
              searchPlaceholder="Search reference, member, type…"
              actions={
                <>
                  <button
                    type="button"
                    className="cps-btn shrink-0 whitespace-nowrap"
                    onClick={() => {
                      downloadTableCsv(
                        `payments-${new Date().toISOString().slice(0, 10)}.csv`,
                        rows.map((p) => ({
                          id: p.id,
                          reference: p.reference,
                          member: memberName(p.memberId),
                          date: p.date,
                          type: p.type,
                          description: p.description,
                          amountMk: p.amountMk,
                          authStatus: p.authStatus,
                        })),
                        [
                          { key: "id", header: "ID" },
                          { key: "reference", header: "Reference" },
                          { key: "member", header: "Member" },
                          { key: "date", header: "Date" },
                          { key: "type", header: "Type" },
                          { key: "description", header: "Description" },
                          { key: "amountMk", header: "Amount MK" },
                          { key: "authStatus", header: "Auth" },
                        ],
                      );
                      pushToast(`Exported ${rows.length} payment row(s).`, "success");
                    }}
                  >
                    Export
                  </button>
                  <button type="button" className="cps-btn-primary shrink-0 whitespace-nowrap" onClick={() => setNewPaymentOpen(true)}>
                    New payment
                  </button>
                </>
              }
            />
          </div>
        </div>
        <div className="cps-table-wrap">
          <table className="cps-table min-w-[880px]">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Member</th>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
                <th>Auth</th>
                <th className="w-52 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-[11px] font-medium text-slate-900">{p.reference}</td>
                  <td className="font-medium text-slate-900">{memberName(p.memberId)}</td>
                  <td className="tabular-nums text-slate-700">{p.date}</td>
                  <td className="text-slate-800">{p.type}</td>
                  <td className="text-slate-600">{p.description}</td>
                  <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(p.amountMk)}</td>
                  <td className="text-[11px] font-semibold text-slate-700">{p.authStatus}</td>
                  <td className="text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      <Link href={`/payments/${p.id}`} className="cps-btn py-1 text-[11px]">
                        View
                      </Link>
                      <button
                        type="button"
                        className="cps-btn py-1 text-[11px]"
                        onClick={async () => {
                          await downloadBrandedPdfDocument(`Payment voucher ${p.reference}`, [
                            `Payee: ${memberName(p.memberId)}`,
                            `Amount: ${formatMk(p.amountMk)}`,
                            `Type: ${p.type}`,
                            `Status: ${p.authStatus}`,
                            "",
                            "Signatory blocks and cheque details appear on the printed voucher.",
                          ]);
                          pushToast(`Voucher downloaded for ${p.reference}.`, "success");
                        }}
                      >
                        Voucher
                      </button>
                      <button
                        type="button"
                        className="cps-btn py-1 text-[11px]"
                        onClick={async () => {
                          await downloadBrandedPdfDocument(`Member letter ${p.reference}`, [
                            `Dear ${memberName(p.memberId)},`,
                            "",
                            `Re: ${p.type} — reference ${p.reference}`,
                            "",
                            "This letter confirms the benefit instruction captured in CPS. Banking details on file will be used for settlement.",
                          ]);
                          pushToast(`Letter downloaded for ${p.reference}.`, "success");
                        }}
                      >
                        Letter
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
        open={newPaymentOpen}
        onClose={() => setNewPaymentOpen(false)}
        title="New benefit payment"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setNewPaymentOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setNewPaymentOpen(false);
                pushToast("Payment draft queued for authorizer.", "success");
              }}
            >
              Save draft
            </button>
          </div>
        }
      >
        <label className="block text-[11px] font-semibold text-slate-700">Member ID</label>
        <input className="cps-input mb-2 mt-0.5 w-full font-mono text-sm" />
        <label className="block text-[11px] font-semibold text-slate-700">Payment type</label>
        <select className="cps-input mb-2 mt-0.5 w-full" defaultValue="Retirement Payout">
          <option>Retirement Payout</option>
          <option>50% Withdrawal</option>
          <option>Death Benefits</option>
          <option>Early Withdrawal</option>
          <option>Other</option>
        </select>
        <label className="block text-[11px] font-semibold text-slate-700">Amount (MK)</label>
        <input className="cps-input mt-0.5 w-full" type="number" />
      </Modal>
    </div>
  );
}
