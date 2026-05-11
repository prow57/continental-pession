import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { dummyComplianceTimeline } from "@/data";
import { getComplianceById } from "@/lib/entities";

type Props = { params: Promise<{ flagId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { flagId } = await params;
  const c = getComplianceById(flagId);
  if (!c) return { title: "Compliance" };
  return {
    title: `${c.id} · Compliance`,
    description: c.issue,
  };
}

export default async function ComplianceDetailPage({ params }: Props) {
  const { flagId } = await params;
  const c = getComplianceById(flagId);
  if (!c) notFound();

  const timeline = dummyComplianceTimeline(c.id);

  return (
    <div className="space-y-3">
      <BackLink href="/compliance">Flagged items</BackLink>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Compliance case</h1>
        <p className="text-xs text-slate-600">{c.id} · Since {c.since}</p>
      </div>

      <section className="cps-panel p-4">
        <h2 className="cps-panel-title mb-1">Issue</h2>
        <p className="text-sm font-medium text-ink">{c.issue}</p>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Reference:</span> {c.memberRef}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Severity:</span>{" "}
          <span className="capitalize">{c.severity}</span>
        </p>
      </section>

      <section className="cps-panel">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Timeline</h2>
            <p className="cps-panel-sub">Case notes and system events</p>
          </div>
        </div>
        <ul className="divide-y divide-cps-200/80 px-3">
          {timeline.map((e) => (
            <li key={e.id} className="py-2 text-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {new Date(e.at).toLocaleString("en-MW")}
              </div>
              <div className="font-semibold text-cps-950">
                {e.actor} — {e.action}
              </div>
              <div className="text-slate-700">{e.detail}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
