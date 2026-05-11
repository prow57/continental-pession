import {
  dummyCompanies,
  dummyCompliance,
  dummyMembers,
  dummyPayments,
  dummyPwMembers,
  dummyReceipts,
  dummyVoluntary,
  memberCompanyName,
  type Company,
  type ComplianceFlag,
  type FundReceipt,
  type PensionMember,
  type PensionPayment,
  type PWMember,
  type VoluntaryMember,
} from "@/data";

export function getCompanyById(id: string): Company | undefined {
  return dummyCompanies.find((c) => c.id === id);
}

export function getMemberById(id: string): PensionMember | undefined {
  return dummyMembers.find((m) => m.id === id);
}

export function getReceiptById(id: string): FundReceipt | undefined {
  return dummyReceipts.find((r) => r.id === id);
}

export function getPaymentById(id: string): PensionPayment | undefined {
  return dummyPayments.find((p) => p.id === id);
}

export function getPwMemberById(id: string): PWMember | undefined {
  return dummyPwMembers.find((m) => m.id === id);
}

export function getVoluntaryById(id: string): VoluntaryMember | undefined {
  return dummyVoluntary.find((v) => v.id === id);
}

export function getComplianceById(id: string): ComplianceFlag | undefined {
  return dummyCompliance.find((c) => c.id === id);
}

export function membersForCompany(companyId: string): PensionMember[] {
  return dummyMembers.filter((m) => m.companyId === companyId);
}

export type LedgerLine =
  | { kind: "receipt"; at: string; label: string; amountMk: number; ref: string; status: string }
  | { kind: "payment"; at: string; label: string; amountMk: number; ref: string; status: string }
  | { kind: "audit"; at: string; label: string; detail: string };

export function memberLedger(memberId: string): LedgerLine[] {
  const lines: LedgerLine[] = [];
  dummyReceipts
    .filter((r) => r.memberId === memberId)
    .forEach((r) => {
      lines.push({
        kind: "receipt",
        at: r.date,
        label: r.description,
        amountMk: r.amountMk,
        ref: r.reference,
        status: r.authStatus,
      });
    });
  dummyPayments
    .filter((p) => p.memberId === memberId)
    .forEach((p) => {
      lines.push({
        kind: "payment",
        at: p.date,
        label: `${p.type} — ${p.description}`,
        amountMk: -p.amountMk,
        ref: p.reference,
        status: p.authStatus,
      });
    });
  lines.push({
    kind: "audit",
    at: "2026-01-15T09:00:00",
    label: "KYC packet archived",
    detail: "National ID and employment letter indexed.",
  });
  lines.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return lines;
}

export function memberDisplayName(memberId: string): string {
  const m = getMemberById(memberId);
  return m ? `${m.firstName} ${m.lastName}` : memberId;
}

export { memberCompanyName };
