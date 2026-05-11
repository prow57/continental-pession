import type { FundReceipt, PensionPayment } from "@/data";

/** Last six calendar months (inclusive of current month): approved receipts vs approved payments, MK totals. */
export function lastSixMonthsReceiptPaymentSeries(
  receipts: FundReceipt[],
  payments: PensionPayment[],
  now = new Date(),
): { labels: string[]; receipts: number[]; payments: number[] } {
  const labels: string[] = [];
  const receiptTotals: number[] = [];
  const paymentTotals: number[] = [];

  for (let i = 5; i >= 0; i--) {
    const anchor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    labels.push(anchor.toLocaleString("en-MW", { month: "short", year: "numeric" }));

    const monthStart = new Date(y, m, 1, 0, 0, 0, 0).getTime();
    const monthEnd = new Date(y, m + 1, 0, 23, 59, 59, 999).getTime();

    let rSum = 0;
    for (const r of receipts) {
      if (r.authStatus !== "Approved") continue;
      const t = new Date(r.date).getTime();
      if (t >= monthStart && t <= monthEnd) rSum += r.amountMk;
    }

    let pSum = 0;
    for (const p of payments) {
      if (p.authStatus !== "Approved") continue;
      const t = new Date(p.date).getTime();
      if (Number.isNaN(t)) continue;
      if (t >= monthStart && t <= monthEnd) pSum += p.amountMk;
    }

    receiptTotals.push(rSum);
    paymentTotals.push(pSum);
  }

  return { labels, receipts: receiptTotals, payments: paymentTotals };
}
