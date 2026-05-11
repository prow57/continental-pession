export function formatMk(amount: number, opts?: { maximumFractionDigits?: number }): string {
  const digits = opts?.maximumFractionDigits ?? 0;
  return `MK ${amount.toLocaleString("en-MW", { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-MW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
