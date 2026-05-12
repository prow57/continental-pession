import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatMk } from "@/lib/format";
import { getMemberById, memberCompanyName, memberLedger } from "@/lib/entities";
import Link from "next/link";
import { memberProfileExtraFor } from "@/data";

type Props = { params: Promise<{ memberId: string }>; searchParams: Promise<{ trail?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { memberId } = await params;
  const member = getMemberById(memberId);
  if (!member) return { title: "Member" };
  const name = `${member.firstName} ${member.lastName}`;
  return {
    title: `${name} · Member`,
    description: `${name} — ${member.id}, ${member.district}.`,
  };
}

export default async function MemberDetailPage({ params, searchParams }: Props) {
  const { memberId } = await params;
  const { trail } = await searchParams;
  const member = getMemberById(memberId);
  if (!member) notFound();

  const ledger = memberLedger(memberId);
  const showTrail = trail === "1" || trail === "true";
  const profile = memberProfileExtraFor(memberId);

  return (
    <div className="space-y-3">
      <BackLink href="/pension/members">Member register</BackLink>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-cps-950">
            {member.firstName} {member.lastName}
          </h1>
          <p className="text-xs text-slate-600">
            {member.id} · {memberCompanyName(member)} · {member.district}
            {member.companyId ? (
              <>
                {" "}
                ·{" "}
                <Link href={`/pension/companies/${member.companyId}`} className="font-medium text-blue-800 hover:underline">
                  Employer scheme
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/pension/members/${memberId}`} className={`cps-btn py-1 text-[11px] ${!showTrail ? "ring-2 ring-cps-500" : ""}`}>
            Profile
          </Link>
          <Link href={`/pension/members/${memberId}?trail=1`} className={`cps-btn py-1 text-[11px] ${showTrail ? "ring-2 ring-cps-500" : ""}`}>
            Trail
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Balance</div>
          <div className="mt-0.5 text-lg font-bold tabular-nums text-ink">{formatMk(member.balanceMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Status</div>
          <div className="mt-0.5 text-lg font-bold text-ink">{member.status}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">KYC</div>
          <div className="mt-0.5 text-lg font-bold text-ink">{member.kycComplete ? "Complete" : "Pending"}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Joined</div>
          <div className="mt-0.5 text-lg font-bold tabular-nums text-ink">{member.dateJoined}</div>
        </div>
      </div>

      {showTrail ? (
        <section className="cps-panel">
          <div className="cps-panel-hd">
            <div>
              <h2 className="cps-panel-title">Transaction &amp; audit trail</h2>
              <p className="cps-panel-sub">Receipts, payments, and control events (chronological)</p>
            </div>
          </div>
          <ul className="divide-y divide-cps-200/80 px-3 py-2">
            {ledger.map((line, i) => (
              <li key={i} className="flex flex-wrap gap-2 py-2 text-sm">
                <span className="w-36 shrink-0 tabular-nums text-slate-500">{new Date(line.at).toLocaleString("en-MW")}</span>
                <span className="min-w-0 flex-1 text-slate-800">
                  {line.kind === "audit" ? (
                    <>
                      <span className="font-semibold text-cps-900">{line.label}</span>
                      <span className="text-slate-600"> — {line.detail}</span>
                    </>
                  ) : (
                    <>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                        {line.kind}
                      </span>{" "}
                      <span className="font-medium">{line.label}</span>
                      <span className="text-slate-500"> ({line.ref}) · {line.status}</span>
                    </>
                  )}
                </span>
                {line.kind !== "audit" ? (
                  <span className={`font-bold tabular-nums ${line.amountMk >= 0 ? "text-emerald-800" : "text-amber-900"}`}>
                    {line.amountMk >= 0 ? "+" : ""}
                    {formatMk(Math.abs(line.amountMk))}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="cps-panel p-4">
          <h2 className="cps-panel-title mb-2">Member profile</h2>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-500">Date of birth</dt>
              <dd className="font-medium text-ink">{profile.dateOfBirth}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-500">National ID (masked)</dt>
              <dd className="font-mono text-sm font-medium text-ink">{profile.nationalIdMasked}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-500">Gender</dt>
              <dd className="font-medium text-ink">{member.gender}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-500">Job title</dt>
              <dd className="font-medium text-ink">{profile.jobTitle}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-500">Employer / pool</dt>
              <dd className="font-medium text-ink">{memberCompanyName(member)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-500">Phone</dt>
              <dd className="font-medium text-ink">{profile.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-bold uppercase text-slate-500">Email</dt>
              <dd className="break-all font-medium text-ink">{profile.email}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-bold uppercase text-slate-500">Beneficiary designation</dt>
              <dd className="text-slate-800">{profile.beneficiaryName}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-bold uppercase text-slate-500">Pay-out bank (masked)</dt>
              <dd className="font-mono text-sm text-ink">{profile.bankNameMasked}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-bold uppercase text-slate-500">Case notes</dt>
              <dd className="text-slate-700">{profile.internalNotes}</dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
