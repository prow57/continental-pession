export function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="cps-stat-tile">
      <div className="text-[10px] font-bold uppercase tracking-wide text-cps-800">{label}</div>
      <div className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-ink">{value}</div>
      {sub ? <div className="mt-0.5 text-[11px] leading-snug text-slate-600">{sub}</div> : null}
    </div>
  );
}
