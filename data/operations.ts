export interface ReconciliationBatch {
  id: string;
  periodLabel: string;
  status: "Balanced" | "Variance review" | "Open";
  varianceMk: number;
  bankStatementLines: number;
  fundLines: number;
  openedOn: string;
  closedOn: string | null;
}

export const dummyReconciliationBatches: ReconciliationBatch[] = [
  {
    id: "rec-2026-04",
    periodLabel: "Apr 2026 · Main operating account",
    status: "Balanced",
    varianceMk: 0,
    bankStatementLines: 184,
    fundLines: 184,
    openedOn: "2026-05-02",
    closedOn: "2026-05-04",
  },
  {
    id: "rec-2026-05-w1",
    periodLabel: "May 2026 · Week 1 (partial)",
    status: "Variance review",
    varianceMk: 12_500,
    bankStatementLines: 52,
    fundLines: 51,
    openedOn: "2026-05-08",
    closedOn: null,
  },
  {
    id: "rec-2026-03",
    periodLabel: "Mar 2026 · Consolidated",
    status: "Balanced",
    varianceMk: 0,
    bankStatementLines: 201,
    fundLines: 201,
    openedOn: "2026-04-01",
    closedOn: "2026-04-03",
  },
  {
    id: "rec-voluntary-suspense",
    periodLabel: "Voluntary suspense · Q1 2026",
    status: "Open",
    varianceMk: 3_200_000,
    bankStatementLines: 36,
    fundLines: 28,
    openedOn: "2026-05-10",
    closedOn: null,
  },
];

export interface PostingQueueItem {
  id: string;
  batchRef: string;
  module: string;
  lines: number;
  amountMk: number;
  status: "Awaiting approval" | "Posted" | "Held";
  capturedBy: string;
  capturedAt: string;
}

export const dummyPostingQueue: PostingQueueItem[] = [
  {
    id: "pq-901",
    batchRef: "BATCH-EMP-MAY-11",
    module: "Pension · receipts",
    lines: 42,
    amountMk: 18_400_000,
    status: "Awaiting approval",
    capturedBy: "L. Kumwenda",
    capturedAt: "2026-05-11T08:14:00",
  },
  {
    id: "pq-902",
    batchRef: "PW-RUN-2026-05A",
    module: "Programmed withdrawals",
    lines: 7,
    amountMk: 2_173_000,
    status: "Awaiting approval",
    capturedBy: "E. Tembo",
    capturedAt: "2026-05-11T09:02:00",
  },
  {
    id: "pq-903",
    batchRef: "VOL-BOOK-9021",
    module: "Voluntary",
    lines: 15,
    amountMk: 4_220_000,
    status: "Held",
    capturedBy: "M. Sakala",
    capturedAt: "2026-05-10T16:40:00",
  },
  {
    id: "pq-890",
    batchRef: "BEN-PAY-APR-28",
    module: "Payments",
    lines: 6,
    amountMk: 9_850_000,
    status: "Posted",
    capturedBy: "T. Banda",
    capturedAt: "2026-04-28T11:30:00",
  },
];

export interface AuditTrailEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
}

export function dummyComplianceTimeline(flagId: string): AuditTrailEvent[] {
  const base = [
    { id: `${flagId}-e1`, at: "2026-05-10T10:00:00", actor: "System", action: "Flag raised", detail: "Rule engine matched control threshold." },
    { id: `${flagId}-e2`, at: "2026-05-10T10:12:00", actor: "Compliance queue", action: "Assigned", detail: "Routed to regional compliance officer pool." },
    { id: `${flagId}-e3`, at: "2026-05-10T14:30:00", actor: "C. Moyo", action: "Note added", detail: "Awaiting employer confirmation letter." },
  ];
  return base;
}
