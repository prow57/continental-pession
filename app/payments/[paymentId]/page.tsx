import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { formatMk } from "@/lib/format";
import { getPaymentById, memberDisplayName } from "@/lib/entities";
import Link from "next/link";

type Props = { params: Promise<{ paymentId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paymentId } = await params;
  const p = getPaymentById(paymentId);
  if (!p) return { title: "Payment" };
  return {
    title: `${p.reference} · Payment`,
    description: `${p.type} — ${formatMk(p.amountMk)}.`,
  };
}

export default async function PaymentDetailPage({ params }: Props) {
  const { paymentId } = await params;
  const p = getPaymentById(paymentId);
  if (!p) notFound();

  return (
    <div className="space-y-3">
      <BackLink href="/payments">Payment register</BackLink>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">{p.reference}</h1>
        <p className="text-xs text-slate-600">
          {p.type} · {p.date}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Amount</div>
          <div className="mt-0.5 text-xl font-bold tabular-nums text-ink">{formatMk(p.amountMk)}</div>
        </div>
        <div className="cps-stat-tile">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Authorization</div>
          <div className="mt-0.5 text-xl font-bold text-ink">{p.authStatus}</div>
        </div>
        <div className="cps-stat-tile sm:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">Member</div>
          <div className="mt-0.5 text-base font-bold text-ink">{memberDisplayName(p.memberId)}</div>
          <Link href={`/pension/members/${p.memberId}`} className="mt-1 inline-block text-[12px] font-semibold text-cps-800 hover:underline">
            Open member record
          </Link>
        </div>
      </div>

      <section className="cps-panel p-4">
        <h2 className="cps-panel-title mb-2">Disbursement</h2>
        <p className="text-sm text-slate-700">{p.description}</p>
        <p className="mt-2 text-sm text-slate-600">
          Use the payment register to download the payment voucher and member letter as PDF.
        </p>
      </section>
    </div>
  );
}
