"use client";

import type { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { dummyCompanies, dummyMembers, memberCompanyName } from "@/data";
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

export default function PensionPage() {
  const { pushToast } = useToast();
  const [coQ, setCoQ] = React.useState("");
  const [memQ, setMemQ] = React.useState("");
  const [statusF, setStatusF] = React.useState<"all" | "Active" | "Dormant" | "Deceased">("all");
  const [newCompanyOpen, setNewCompanyOpen] = React.useState(false);
  const [newMemberOpen, setNewMemberOpen] = React.useState(false);
  const [bulkImportOpen, setBulkImportOpen] = React.useState(false);

  const companies = React.useMemo(() => {
    const q = coQ.trim().toLowerCase();
    if (!q) return dummyCompanies;
    return dummyCompanies.filter(
      (c) => c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q),
    );
  }, [coQ]);

  const members = React.useMemo(() => {
    const q = memQ.trim().toLowerCase();
    return dummyMembers.filter((m) => {
      if (statusF !== "all" && m.status !== statusF) return false;
      if (!q) return true;
      const blob = `${m.firstName} ${m.lastName} ${m.id} ${m.district} ${memberCompanyName(m)}`.toLowerCase();
      return blob.includes(q);
    });
  }, [memQ, statusF]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Pension</h1>
        {/* <p className="text-xs text-slate-600">Employer schemes and members (restricted and unrestricted) — demo Malawian data.</p> */}
        <p className="text-xs text-slate-600">Employer schemes and members (restricted and unrestricted).</p>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Employer schemes</h2>
            <p className="cps-panel-sub">{companies.length} of {dummyCompanies.length} shown</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="pension-companies-search"
              search={coQ}
              onSearchChange={setCoQ}
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
                <th className="text-right">Est. monthly receipts</th>
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
      </section>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Member register</h2>
            <p className="cps-panel-sub">{members.length} of {dummyMembers.length} shown · capturer / authorizer workflow</p>
          </div>
          <div className="cps-panel-hd-toolbar">
            <DataToolbar
              inputId="pension-members-search"
              leading={
                <select
                  className="cps-input w-auto shrink-0 min-w-[9.5rem] max-w-[12rem]"
                  value={statusF}
                  onChange={(e) => setStatusF(e.target.value as typeof statusF)}
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Dormant">Dormant</option>
                  <option value="Deceased">Deceased</option>
                </select>
              }
              search={memQ}
              onSearchChange={setMemQ}
              searchPlaceholder="Search member, ID, district…"
              actions={
                <>
                  <button
                    type="button"
                    className="cps-btn shrink-0 whitespace-nowrap"
                    onClick={() => {
                      downloadTableCsv(
                        `member-register-${new Date().toISOString().slice(0, 10)}.csv`,
                        members.map((m) => ({
                          id: m.id,
                          name: `${m.firstName} ${m.lastName}`,
                          employer: memberCompanyName(m),
                          district: m.district,
                          dateJoined: m.dateJoined,
                          kyc: m.kycComplete ? "Complete" : "Pending",
                          status: m.status,
                          balanceMk: m.balanceMk,
                        })),
                        [
                          { key: "id", header: "ID" },
                          { key: "name", header: "Member" },
                          { key: "employer", header: "Employer" },
                          { key: "district", header: "District" },
                          { key: "dateJoined", header: "Joined" },
                          { key: "kyc", header: "KYC" },
                          { key: "status", header: "Status" },
                          { key: "balanceMk", header: "Balance MK" },
                        ],
                      );
                      pushToast(`Exported ${members.length} member row(s).`, "success");
                    }}
                  >
                    Export
                  </button>
                  <button type="button" className="cps-btn shrink-0 whitespace-nowrap" onClick={() => setBulkImportOpen(true)}>
                    Bulk import
                  </button>
                  <button type="button" className="cps-btn-primary shrink-0 whitespace-nowrap" onClick={() => setNewMemberOpen(true)}>
                    New member
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
                <th>Member</th>
                <th>Employer / pool</th>
                <th>District</th>
                <th>Joined</th>
                <th>KYC</th>
                <th>Status</th>
                <th className="text-right">Balance</th>
                <th className="w-36 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="font-semibold text-ink">
                      {m.firstName} {m.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500">{m.id}</div>
                  </td>
                  <td className="max-w-[220px] truncate text-slate-700">{memberCompanyName(m)}</td>
                  <td className="text-slate-700">{m.district}</td>
                  <td className="tabular-nums text-slate-700">{m.dateJoined}</td>
                  <td>
                    <Badge tone={m.kycComplete ? "ok" : "warn"}>{m.kycComplete ? "Complete" : "Pending"}</Badge>
                  </td>
                  <td>
                    <Badge tone={m.status === "Active" ? "ok" : "muted"}>{m.status}</Badge>
                  </td>
                  <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(m.balanceMk)}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/pension/members/${m.id}`} className="cps-btn py-1 text-[11px]">
                        Profile
                      </Link>
                      <Link href={`/pension/members/${m.id}?trail=1`} className="cps-btn py-1 text-[11px]">
                        Trail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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

      <Modal
        open={newMemberOpen}
        onClose={() => setNewMemberOpen(false)}
        title="New member"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setNewMemberOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setNewMemberOpen(false);
                pushToast("Member draft created — reference MEM-TMP-9021.", "success");
              }}
            >
              Create draft
            </button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-slate-600">Links to employer scheme and KYC pack upload.</p>
        <label className="block text-[11px] font-semibold text-slate-700">First name</label>
        <input className="cps-input mb-2 mt-0.5 w-full" />
        <label className="block text-[11px] font-semibold text-slate-700">Last name</label>
        <input className="cps-input mb-2 mt-0.5 w-full" />
        <label className="block text-[11px] font-semibold text-slate-700">National ID</label>
        <input className="cps-input mt-0.5 w-full" placeholder="Optional for draft" />
      </Modal>

      <Modal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        title="Bulk import members"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="cps-btn text-[11px]" onClick={() => setBulkImportOpen(false)}>
              Close
            </button>
            <button
              type="button"
              className="cps-btn-primary text-[11px]"
              onClick={() => {
                setBulkImportOpen(false);
                pushToast("CSV validated — 0 errors, 12 rows staged.", "success");
              }}
            >
              Validate file
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          Drop a CSV with columns: national_id, first_name, last_name, employer_id, join_date. The file is validated before
          staging.
        </p>
        <input type="file" accept=".csv" className="mt-3 block w-full text-sm text-slate-600" />
      </Modal>
    </div>
  );
}
