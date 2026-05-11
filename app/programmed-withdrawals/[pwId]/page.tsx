import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatDate, formatMk } from "@/lib/format";
import { getPwMemberById } from "@/lib/entities";

type Props = { params: Promise<{ pwId: string }> };

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

export default async function PwMemberDetailPage({ params }: Props) {
  const { pwId } = await params;
  const m = getPwMemberById(pwId);
  if (!m) notFound();

  return (
    <div className="space-y-3">
      <BackLink href="/programmed-withdrawals">PW member list</BackLink>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">
          {m.firstName} {m.lastName}
        </h1>
        <p className="text-xs text-slate-600">
          {m.planType} · {m.district} · {m.id}
        </p>
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

      <section className="cps-panel p-4">
        <h2 className="cps-panel-title mb-2">Pay run history</h2>
        <ul className="list-inside list-disc text-sm text-slate-700">
          <li>May 2026 — scheduled bank file generated (reference PW-MAY-2026)</li>
          <li>Apr 2026 — paid in full · no arrears</li>
          <li>Mar 2026 — paid in full</li>
        </ul>
      </section>
    </div>
  );
}
