"use client";

import type { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { dummyCompanies } from "@/data";
import { DataToolbar } from "@/components/DataToolbar";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import { downloadTableCsv } from "@/lib/documents";
import { formatMk } from "@/lib/format";

function Badge({ children, tone }: { children: ReactNode; tone: "ok" | "warn" | "muted" }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-100/90 text-emerald-900 ring-emerald-700/20"
      : tone === "warn"
        ? "bg-amber-100/90 text-amber-950 ring-amber-700/25"
        : "bg-slate-100 text-slate-800 ring-slate-600/15";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${cls}`}>
      {children}
    </span>
  );
}

export default function PensionEmployerSchemesPage() {
  const { pushToast } = useToast();
  const [q, setQ] = React.useState("");
  const [newCompanyOpen, setNewCompanyOpen] = React.useState(false);

  const companies = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return dummyCompanies;
    return dummyCompanies.filter((c) => c.name.toLowerCase().includes(t) || c.district.toLowerCase().includes(t));
  }, [q]);

  return (
    <section className="cps-panel">
      <div className="cps-panel-hd">
        <div>
          <h2 className="cps-panel-title">Employer schemes</h2>
          <p className="cps-panel-sub">
            {companies.length} of {dummyCompanies.length} shown
          </p>
        </div>
        <div className="cps-panel-hd-toolbar">
          <DataToolbar
            inputId="pension-companies-search"
            search={q}
            onSearchChange={setQ}
            searchPlaceholder="Search company or district…"
            actions={
              <>
                <button
                  type="button"
                  className="cps-btn shrink-0"
                  onClick={() => {
                    downloadTableCsv(
                      `employer-schemes-${new Date().toISOString().slice(0, 10)}.csv`,
                      companies.map((c) => ({
                        id: c.id,
                        name: c.name,
                        scheme: c.scheme,
                        district: c.district,
                        memberCount: c.memberCount,
                        monthlyContributionMk: c.monthlyContributionMk,
                      })),
                      [
                        { key: "id", header: "ID" },
                        { key: "name", header: "Company" },
                        { key: "scheme", header: "Scheme" },
                        { key: "district", header: "District" },
                        { key: "memberCount", header: "Members" },
                        { key: "monthlyContributionMk", header: "Monthly MK" },
                      ],
                    );
                    pushToast(`Exported ${companies.length} employer row(s) to CSV.`, "success");
                  }}
                >
                  Export
                </button>
                <button type="button" className="cps-btn-primary shrink-0 whitespace-nowrap" onClick={() => setNewCompanyOpen(true)}>
                  New company
                </button>
              </>
            }
          />
        </div>
      </div>

      <div className="cps-table-wrap">
        <table className="cps-table min-w-[640px]">
          <thead>
            <tr>
              <th>Company</th>
              <th>Type</th>
              <th>District</th>
              <th className="text-right">Members</th>
              <th className="text-right">Est. monthly receipts (MK)</th>
              <th className="w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td className="font-semibold text-ink">{c.name}</td>
                <td>
                  <Badge tone={c.scheme === "restricted" ? "muted" : "ok"}>
                    {c.scheme === "restricted" ? "Restricted" : "Unrestricted"}
                  </Badge>
                </td>
                <td className="text-slate-700">{c.district}</td>
                <td className="text-right tabular-nums text-slate-800">{c.memberCount.toLocaleString()}</td>
                <td className="text-right font-semibold tabular-nums text-cps-900">{formatMk(c.monthlyContributionMk)}</td>
                <td className="text-right">
                  <Link href={`/pension/companies/${c.id}`} className="cps-btn inline-block py-1 text-[11px]">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={newCompanyOpen}
        onClose={() => setNewCompanyOpen(false)}
        title="Register employer scheme"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setNewCompanyOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setNewCompanyOpen(false);
                pushToast("Draft employer scheme saved to authorizer queue.", "success");
              }}
            >
              Save draft
            </button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-slate-600">Capture scheme rules, trustee contacts, and contribution frequency.</p>
        <label className="block text-[11px] font-semibold text-slate-700">Company name</label>
        <input className="cps-input mb-2 mt-0.5 w-full" placeholder="e.g. Example Holdings Ltd" />
        <label className="block text-[11px] font-semibold text-slate-700">Scheme type</label>
        <select className="cps-input mb-2 mt-0.5 w-full" defaultValue="restricted">
          <option value="restricted">Restricted</option>
          <option value="unrestricted">Unrestricted</option>
        </select>
        <label className="block text-[11px] font-semibold text-slate-700">District</label>
        <input className="cps-input mt-0.5 w-full" placeholder="Lilongwe" />
      </Modal>
    </section>
  );
}
