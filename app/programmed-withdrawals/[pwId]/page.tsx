import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatDate, formatMk } from "@/lib/format";
import { getPwMemberById } from "@/lib/entities";
import Link from "next/link";

type Props = { params: Promise<{ pwId: string }>; searchParams: Promise<{ section?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pwId } = await params;
  const m = getPwMemberById(pwId);
  if (!m) return { title: "Programmed withdrawal" };
  const name = `${m.firstName} ${m.lastName}`;
  return {
    title: `${name} · PW`,
    description: `${m.planType} — fund ${formatMk(m.fundBalanceMk)}, next due ${formatDate(m.nextDueDate)}.`,
  };
}

export default async function PwMemberDetailPage({ params, searchParams }: Props) {
  const { pwId } = await params;
  const { section } = await searchParams;
  const m = getPwMemberById(pwId);
  if (!m) notFound();
  const current = section === "schedule" || section === "history" ? section : "overview";
  const recentRunRef = `PW-RUN-${new Date().getFullYear()}-${m.id.toUpperCase()}`;
  const scheduleRows = [0, 1, 2, 3].map((i) => {
    const d = new Date(m.nextDueDate);
    d.setMonth(d.getMonth() + i);
    return {
      key: i,
      period: d.toLocaleString("en-MW", { month: "long", year: "numeric" }),
      dueDate: formatDate(d.toISOString()),
      amount: m.monthlyInstallmentMk,
      status: i === 0 ? "Pending release" : "Scheduled",
    };
  });
  const historyRows = [
    {
      title: "Scheduled bank file generated",
      detail: `Reference ${recentRunRef}`,
      when: "May 2026",
      status: "Completed",
    },
    {
      title: "Installment paid",
      detail: "Beneficiary confirmation received · no arrears",
      when: "Apr 2026",
      status: "Completed",
    },
    {
      title: "Installment paid",
      detail: "Settlement matched with payment control batch",
      when: "Mar 2026",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-3">
      <BackLink href="/programmed-withdrawals">PW member list</BackLink>
      <div className="text-[11px] font-medium text-slate-500">
        Withdrawals <span className="px-1 text-slate-300">/</span> Members <span className="px-1 text-slate-300">/</span>{" "}
        <span className="text-cps-900">{m.firstName} {m.lastName}</span>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-cps-950">
            {m.firstName} {m.lastName}
          </h1>
          <p className="text-xs text-slate-600">
            {m.planType} · {m.district} · {m.id}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Link
            href={`/programmed-withdrawals/${m.id}`}
            className={`cps-btn py-1 text-[11px] ${current === "overview" ? "ring-2 ring-cps-500" : ""}`}
          >
            Overview
          </Link>
          <Link
            href={`/programmed-withdrawals/${m.id}?section=schedule`}
            className={`cps-btn py-1 text-[11px] ${current === "schedule" ? "ring-2 ring-cps-500" : ""}`}
          >
            Schedule
          </Link>
          <Link
            href={`/programmed-withdrawals/${m.id}?section=history`}
            className={`cps-btn py-1 text-[11px] ${current === "history" ? "ring-2 ring-cps-500" : ""}`}
          >
            History
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Fund balance</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(m.fundBalanceMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Monthly installment</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(m.monthlyInstallmentMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Next due</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatDate(m.nextDueDate)}</div>
        </div>
      </div>

      {current === "overview" ? (
        <section className="cps-panel">
          <div className="cps-panel-hd">
            <div>
              <h2 className="cps-panel-title">Member overview</h2>
              <p className="cps-panel-sub">Account setup and run controls</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
            <div className="rounded-md border border-cps-200 bg-white p-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Current plan</div>
              <div className="mt-1 text-sm font-semibold text-ink">{m.planType}</div>
            </div>
            <div className="rounded-md border border-cps-200 bg-white p-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Latest run reference</div>
              <div className="mt-1 font-mono text-sm font-semibold text-cps-900">{recentRunRef}</div>
            </div>
            <div className="rounded-md border border-cps-200 bg-cps-50/50 p-3 sm:col-span-2">
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Operational note</div>
              <p className="mt-1 text-sm text-slate-700">
                Installments are prepared in the monthly pay run queue and released after maker-checker approval.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {current === "schedule" ? (
        <section className="cps-panel">
          <div className="cps-panel-hd">
            <div>
              <h2 className="cps-panel-title">Upcoming installments</h2>
              <p className="cps-panel-sub">Projected monthly schedule</p>
            </div>
          </div>
          <div className="cps-table-wrap">
            <table className="cps-table min-w-[640px]">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Due date</th>
                  <th className="text-right">Installment (MK)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => (
                  <tr key={row.key}>
                    <td className="text-slate-800">{row.period}</td>
                    <td className="tabular-nums text-slate-700">{row.dueDate}</td>
                    <td className="text-right font-semibold tabular-nums text-cps-950">{formatMk(row.amount)}</td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                          row.status === "Pending release"
                            ? "bg-amber-100/90 text-amber-950 ring-amber-700/25"
                            : "bg-emerald-100/90 text-emerald-900 ring-emerald-700/20"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-cps-200/80 bg-cps-50/40 px-3 py-2 text-xs text-slate-600">
            Next due installment participates in the upcoming release batch after control checks.
          </div>
        </section>
      ) : null}

      {current === "history" ? (
        <section className="cps-panel">
          <div className="cps-panel-hd">
            <div>
              <h2 className="cps-panel-title">Pay run history</h2>
              <p className="cps-panel-sub">Recent settlement events</p>
            </div>
          </div>
          <div className="space-y-2 p-3">
            {historyRows.map((row, idx) => (
              <div key={idx} className="rounded-md border border-cps-200 bg-white p-3 shadow-sm">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-ink">{row.title}</div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 ring-1 ring-emerald-700/20">
                    {row.status}
                  </span>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.when}</div>
                <p className="mt-1 text-sm text-slate-700">{row.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
