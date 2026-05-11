import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatMk } from "@/lib/format";
import { getCompanyById, membersForCompany } from "@/lib/entities";
import Link from "next/link";

type Props = { params: Promise<{ companyId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyId } = await params;
  const company = getCompanyById(companyId);
  if (!company) return { title: "Employer scheme" };
  return {
    title: `${company.name} · Employer scheme`,
    description: `${company.name} — ${company.district}, ${company.scheme === "restricted" ? "restricted" : "unrestricted"} scheme.`,
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { companyId } = await params;
  const company = getCompanyById(companyId);
  if (!company) notFound();

  const members = membersForCompany(companyId);

  return (
    <div className="space-y-3">
      <BackLink href="/pension/employer-schemes">Employer schemes</BackLink>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">{company.name}</h1>
        <p className="text-xs text-slate-600">
          {company.scheme === "restricted" ? "Restricted" : "Unrestricted"} scheme · {company.district}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Registered members</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{company.memberCount.toLocaleString()}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Est. monthly receipts</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(company.monthlyContributionMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Members in register</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{members.length}</div>
        </div>
      </div>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Members linked to this employer</h2>
            <p className="cps-panel-sub">Linked from the pension member register</p>
          </div>
        </div>
        <div className="cps-table-wrap">
          <table className="cps-table min-w-[520px]">
            <thead>
              <tr>
                <th>Member</th>
                <th>District</th>
                <th className="text-right">Balance (MK)</th>
                <th className="w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="font-semibold text-ink">
                    {m.firstName} {m.lastName}
                    <div className="text-[11px] font-normal text-slate-500">{m.id}</div>
                  </td>
                  <td className="text-slate-700">{m.district}</td>
                  <td className="text-right font-medium tabular-nums text-cps-950">{formatMk(m.balanceMk)}</td>
                  <td className="text-right">
                    <Link href={`/pension/members/${m.id}`} className="cps-btn inline-block py-1 text-[11px]">
                      Open
                    </Link>
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
