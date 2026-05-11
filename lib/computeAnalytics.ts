import {
  dummyCompanies,
  dummyMembers,
  dummyPayments,
  dummyPwMembers,
  dummyReceipts,
  dummyVoluntary,
} from "@/data";

export type AnalyticsPayload = {
  totalMembersManaged: number;
  activeCompanies: number;
  pendingAuthorizations: number;
  clientFundsMk: number;
  receivablesMk: number;
  reconciledPercentage: number;
  receiptsLast7Days: number[];
};

function receiptsLast7DaysApproved(): number[] {
  const receipts = dummyReceipts;
  const now = new Date();
  const out: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    const sum = receipts.reduce((acc, r) => {
      const t = new Date(r.date).getTime();
      if (t >= dayStart.getTime() && t <= dayEnd.getTime() && r.authStatus === "Approved") return acc + r.amountMk;
      return acc;
    }, 0);
    out.push(sum);
  }
  return out;
}

export function computeAnalytics(): AnalyticsPayload {
  const totalMembersManaged = dummyCompanies.reduce((a, c) => a + c.memberCount, 0);
  const activeCompanies = dummyCompanies.length;

  const pendingReceipts = dummyReceipts.filter((r) => r.authStatus === "Pending" || r.authStatus === "Draft").length;
  const pendingPayments = dummyPayments.filter((p) => p.authStatus === "Pending" || p.authStatus === "Draft").length;
  const pendingAuthorizations = pendingReceipts + pendingPayments;

  const memberBalances = dummyMembers.reduce((a, m) => a + m.balanceMk, 0);
  const pwBalances = dummyPwMembers.reduce((a, m) => a + m.fundBalanceMk, 0);
  const voluntaryBalances = dummyVoluntary.reduce((a, v) => a + v.pensionPortionMk + v.personalSavingsMk, 0);
  const clientFundsMk = memberBalances + pwBalances + voluntaryBalances;

  const receivablesMk = dummyReceipts
    .filter((r) => r.authStatus === "Pending" || r.authStatus === "Draft")
    .reduce((a, r) => a + r.amountMk, 0);

  const authReceipts = dummyReceipts.filter((r) => r.authStatus !== "Rejected");
  const approved = authReceipts.filter((r) => r.authStatus === "Approved").length;
  const denom = authReceipts.length || 1;
  const reconciledPercentage = Math.round((approved / denom) * 100);

  return {
    totalMembersManaged,
    activeCompanies,
    pendingAuthorizations,
    clientFundsMk,
    receivablesMk,
    reconciledPercentage,
    receiptsLast7Days: receiptsLast7DaysApproved(),
  };
}
