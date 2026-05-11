import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatMk } from "@/lib/format";
import { getVoluntaryById } from "@/lib/entities";

type Props = { params: Promise<{ voluntaryId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { voluntaryId } = await params;
  const v = getVoluntaryById(voluntaryId);
  if (!v) return { title: "Voluntary member" };
  const name = `${v.firstName} ${v.lastName}`;
  return {
    title: `${name} · Voluntary`,
    description: `${name} — ${v.district}, total balance ${formatMk(v.pensionPortionMk + v.personalSavingsMk)}.`,
  };
}

export default async function VoluntaryDetailPage({ params }: Props) {
  const { voluntaryId } = await params;
  const v = getVoluntaryById(voluntaryId);
  if (!v) notFound();

  const total = v.pensionPortionMk + v.personalSavingsMk;

  return (
    <div className="space-y-3">
      <BackLink href="/voluntary">Voluntary balances</BackLink>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">
          {v.firstName} {v.lastName}
        </h1>
        <p className="text-xs text-slate-600">
          {v.id} · {v.district} · Last contribution {v.lastContributionDate}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Pension (60%)</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(v.pensionPortionMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Personal (40%)</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(v.personalSavingsMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Total</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(total)}</div>
        </div>
      </div>

      <section className="cps-panel p-4">
        <h2 className="cps-panel-title mb-2">Statement summary</h2>
        <p className="text-sm text-slate-700">
          Opening balances and period movements would appear on the exported member statement. 60/40 split is applied on each voluntary credit per scheme rules.
        </p>
      </section>
    </div>
  );
}
