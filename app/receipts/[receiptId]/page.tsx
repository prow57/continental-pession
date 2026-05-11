import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatDate, formatMk } from "@/lib/format";
import { getReceiptById, memberDisplayName } from "@/lib/entities";
import Link from "next/link";

type Props = { params: Promise<{ receiptId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { receiptId } = await params;
  const r = getReceiptById(receiptId);
  if (!r) return { title: "Receipt" };
  return {
    title: `${r.reference} · Receipt`,
    description: `${r.description} — ${formatMk(r.amountMk)}.`,
  };
}

export default async function ReceiptDetailPage({ params }: Props) {
  const { receiptId } = await params;
  const r = getReceiptById(receiptId);
  if (!r) notFound();

  return (
    <div className="space-y-3">
      <BackLink href="/receipts">Receipt register</BackLink>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">{r.reference}</h1>
        <p className="text-xs text-slate-600">Contribution receipt · {formatDate(r.date)}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Amount</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(r.amountMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Authorization</div>
          <div className="mt-0.5 text-xl font-bold text-ink">{r.authStatus}</div>
        </div>
        <div className="cps-stat-tile sm:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Member</div>
          <div className="mt-0.5 text-base font-bold text-ink">{memberDisplayName(r.memberId)}</div>
          <Link href={`/pension/members/${r.memberId}`} className="mt-1 inline-block text-[12px] font-semibold text-cps-800 hover:underline">
            Open member record
          </Link>
        </div>
      </div>

      <section className="cps-panel p-4">
        <h2 className="cps-panel-title mb-2">Line detail</h2>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="text-[10px] font-bold uppercase text-slate-500">Description</dt>
            <dd className="text-ink">{r.description}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase text-slate-500">Workflow</dt>
            <dd className="text-slate-700">
              Capturer entry → authorizer queue → GL interface. Current status: <strong>{r.authStatus}</strong>.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
