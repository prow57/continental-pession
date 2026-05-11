export type Period = "day" | "week" | "month" | "year";

export type SchemeType = "restricted" | "unrestricted";

export type MemberStatus = "Active" | "Dormant" | "Deceased";

export type AuthStatus = "Draft" | "Pending" | "Approved" | "Rejected";

export interface Company {
  id: string;
  name: string;
  scheme: SchemeType;
  district: string;
  memberCount: number;
  monthlyContributionMk: number;
}

export interface PensionMember {
  id: string;
  firstName: string;
  lastName: string;
  companyId: string | null;
  district: string;
  gender: "Male" | "Female" | "Other";
  dateJoined: string;
  balanceMk: number;
  status: MemberStatus;
  kycComplete: boolean;
}

export interface FundReceipt {
  id: string;
  memberId: string;
  date: string;
  reference: string;
  description: string;
  amountMk: number;
  authStatus: AuthStatus;
}

export interface PensionPayment {
  id: string;
  memberId: string;
  date: string;
  reference: string;
  description: string;
  type: "Retirement Payout" | "50% Withdrawal" | "Death Benefits" | "Early Withdrawal" | "Other";
  amountMk: number;
  authStatus: AuthStatus;
}

export interface PWMember {
  id: string;
  firstName: string;
  lastName: string;
  district: string;
  planType: "Monthly Annuity" | "Life-based PW" | "Fixed-Term PW";
  fundBalanceMk: number;
  monthlyInstallmentMk: number;
  nextDueDate: string;
}

export interface VoluntaryMember {
  id: string;
  firstName: string;
  lastName: string;
  district: string;
  pensionPortionMk: number;
  personalSavingsMk: number;
  lastContributionDate: string;
}

export interface ComplianceFlag {
  id: string;
  memberRef: string;
  issue: string;
  severity: "low" | "medium" | "high";
  since: string;
}

export const dummyCompanies: Company[] = [
  {
    id: "co-1",
    name: "Press Corporation Limited",
    scheme: "restricted",
    district: "Blantyre",
    memberCount: 842,
    monthlyContributionMk: 48_500_000,
  },
  {
    id: "co-2",
    name: "National Bank of Malawi",
    scheme: "restricted",
    district: "Blantyre",
    memberCount: 612,
    monthlyContributionMk: 36_200_000,
  },
  {
    id: "co-3",
    name: "Ethanol Company Malawi",
    scheme: "restricted",
    district: "Dowa",
    memberCount: 198,
    monthlyContributionMk: 9_850_000,
  },
  {
    id: "co-4",
    name: "Individual & SME Pool (Unrestricted)",
    scheme: "unrestricted",
    district: "Lilongwe",
    memberCount: 1240,
    monthlyContributionMk: 22_100_000,
  },
  {
    id: "co-5",
    name: "Illovo Sugar (Malawi) Limited",
    scheme: "restricted",
    district: "Chikwawa",
    memberCount: 526,
    monthlyContributionMk: 18_650_000,
  },
  {
    id: "co-6",
    name: "FDH Financial Holdings",
    scheme: "restricted",
    district: "Blantyre",
    memberCount: 389,
    monthlyContributionMk: 21_040_000,
  },
  {
    id: "co-7",
    name: "Admarc Limited",
    scheme: "restricted",
    district: "Lilongwe",
    memberCount: 912,
    monthlyContributionMk: 14_775_000,
  },
];

export const dummyMembers: PensionMember[] = [
  {
    id: "m-101",
    firstName: "Thokozani",
    lastName: "Banda",
    companyId: "co-1",
    district: "Zomba",
    gender: "Male",
    dateJoined: "2016-03-14",
    balanceMk: 18_450_000,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-102",
    firstName: "Wezi",
    lastName: "Moyo",
    companyId: "co-2",
    district: "Lilongwe",
    gender: "Female",
    dateJoined: "2019-07-01",
    balanceMk: 9_820_500,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-103",
    firstName: "Chisomo",
    lastName: "Phiri",
    companyId: "co-3",
    district: "Salima",
    gender: "Female",
    dateJoined: "2021-11-22",
    balanceMk: 4_125_800,
    status: "Active",
    kycComplete: false,
  },
  {
    id: "m-104",
    firstName: "Lameck",
    lastName: "Kumwenda",
    companyId: "co-4",
    district: "Mzuzu",
    gender: "Male",
    dateJoined: "2020-02-10",
    balanceMk: 6_980_200,
    status: "Dormant",
    kycComplete: true,
  },
  {
    id: "m-105",
    firstName: "Tiyamike",
    lastName: "Ngwira",
    companyId: "co-1",
    district: "Blantyre",
    gender: "Other",
    dateJoined: "2018-05-06",
    balanceMk: 12_340_000,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-106",
    firstName: "Grace",
    lastName: "Chirwa",
    companyId: null,
    district: "Lilongwe",
    gender: "Female",
    dateJoined: "2023-01-16",
    balanceMk: 1_890_000,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-107",
    firstName: "Joseph",
    lastName: "Mzumara",
    companyId: "co-5",
    district: "Chikwawa",
    gender: "Male",
    dateJoined: "2017-09-20",
    balanceMk: 7_955_400,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-108",
    firstName: "Bertha",
    lastName: "Chavula",
    companyId: "co-6",
    district: "Thyolo",
    gender: "Female",
    dateJoined: "2020-04-03",
    balanceMk: 5_222_900,
    status: "Active",
    kycComplete: false,
  },
  {
    id: "m-109",
    firstName: "Macdonald",
    lastName: "Mbendera",
    companyId: "co-7",
    district: "Ntcheu",
    gender: "Male",
    dateJoined: "2015-12-01",
    balanceMk: 21_090_000,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-110",
    firstName: "Towera",
    lastName: "Msiska",
    companyId: "co-2",
    district: "Dedza",
    gender: "Female",
    dateJoined: "2022-06-15",
    balanceMk: 3_708_250,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-111",
    firstName: "Kondwani",
    lastName: "Chimera",
    companyId: null,
    district: "Blantyre",
    gender: "Male",
    dateJoined: "2024-02-29",
    balanceMk: 645_000,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-112",
    firstName: "Esther",
    lastName: "Lungu",
    companyId: "co-7",
    district: "Kasungu",
    gender: "Female",
    dateJoined: "2019-01-08",
    balanceMk: 8_442_600,
    status: "Dormant",
    kycComplete: true,
  },
  {
    id: "m-113",
    firstName: "Bright",
    lastName: "Kachaje",
    companyId: "co-6",
    district: "Lilongwe",
    gender: "Male",
    dateJoined: "2021-10-05",
    balanceMk: 2_994_800,
    status: "Active",
    kycComplete: true,
  },
  {
    id: "m-114",
    firstName: "Tamara",
    lastName: "Nyirenda",
    companyId: "co-4",
    district: "Mzuzu",
    gender: "Female",
    dateJoined: "2018-08-22",
    balanceMk: 10_125_000,
    status: "Active",
    kycComplete: true,
  },
];

export const dummyReceipts: FundReceipt[] = [
  {
    id: "r-1",
    memberId: "m-101",
    date: "2026-05-02T09:12:00",
    reference: "RCP-2026-88421",
    description: "Monthly Contribution",
    amountMk: 285_000,
    authStatus: "Approved",
  },
  {
    id: "r-2",
    memberId: "m-102",
    date: "2026-05-03T11:40:00",
    reference: "RCP-2026-88433",
    description: "Monthly Contribution",
    amountMk: 198_500,
    authStatus: "Approved",
  },
  {
    id: "r-3",
    memberId: "m-103",
    date: "2026-05-04T08:05:00",
    reference: "RCP-2026-88440",
    description: "Lump Sum",
    amountMk: 750_000,
    authStatus: "Pending",
  },
  {
    id: "r-4",
    memberId: "m-105",
    date: "2026-05-05T14:22:00",
    reference: "RCP-2026-88451",
    description: "Monthly Contribution",
    amountMk: 312_000,
    authStatus: "Approved",
  },
  {
    id: "r-5",
    memberId: "m-106",
    date: "2026-05-06T10:00:00",
    reference: "RCP-2026-88462",
    description: "Voluntary Top-up",
    amountMk: 120_000,
    authStatus: "Draft",
  },
  {
    id: "r-6",
    memberId: "m-101",
    date: "2026-05-07T09:30:00",
    reference: "RCP-2026-88470",
    description: "Monthly Contribution",
    amountMk: 285_000,
    authStatus: "Approved",
  },
  {
    id: "r-7",
    memberId: "m-104",
    date: "2026-05-08T16:45:00",
    reference: "RCP-2026-88488",
    description: "Arrears",
    amountMk: 95_000,
    authStatus: "Pending",
  },
  {
    id: "r-8",
    memberId: "m-107",
    date: "2026-05-02T07:50:00",
    reference: "RCP-2026-88501",
    description: "Monthly Contribution",
    amountMk: 178_000,
    authStatus: "Approved",
  },
  {
    id: "r-9",
    memberId: "m-109",
    date: "2026-05-03T13:10:00",
    reference: "RCP-2026-88512",
    description: "Employer match",
    amountMk: 410_000,
    authStatus: "Approved",
  },
  {
    id: "r-10",
    memberId: "m-110",
    date: "2026-05-04T09:00:00",
    reference: "RCP-2026-88520",
    description: "Monthly Contribution",
    amountMk: 142_500,
    authStatus: "Pending",
  },
  {
    id: "r-11",
    memberId: "m-111",
    date: "2026-05-05T12:18:00",
    reference: "RCP-2026-88531",
    description: "Voluntary Top-up",
    amountMk: 85_000,
    authStatus: "Approved",
  },
  {
    id: "r-12",
    memberId: "m-112",
    date: "2026-05-06T08:40:00",
    reference: "RCP-2026-88540",
    description: "Arrears clearance",
    amountMk: 220_000,
    authStatus: "Draft",
  },
  {
    id: "r-13",
    memberId: "m-113",
    date: "2026-05-07T15:05:00",
    reference: "RCP-2026-88555",
    description: "Monthly Contribution",
    amountMk: 256_000,
    authStatus: "Approved",
  },
  {
    id: "r-14",
    memberId: "m-114",
    date: "2026-05-08T10:22:00",
    reference: "RCP-2026-88566",
    description: "Lump Sum",
    amountMk: 500_000,
    authStatus: "Pending",
  },
  {
    id: "r-15",
    memberId: "m-108",
    date: "2026-05-09T11:11:00",
    reference: "RCP-2026-88577",
    description: "Monthly Contribution",
    amountMk: 165_000,
    authStatus: "Rejected",
  },
  {
    id: "r-16",
    memberId: "m-101",
    date: "2026-05-10T09:00:00",
    reference: "RCP-2026-88590",
    description: "Monthly Contribution",
    amountMk: 285_000,
    authStatus: "Approved",
  },
  {
    id: "r-17",
    memberId: "m-105",
    date: "2026-05-10T14:30:00",
    reference: "RCP-2026-88595",
    description: "Extra voluntary",
    amountMk: 75_000,
    authStatus: "Pending",
  },
  {
    id: "r-18",
    memberId: "m-106",
    date: "2026-05-10T16:00:00",
    reference: "RCP-2026-88599",
    description: "Monthly Contribution",
    amountMk: 92_000,
    authStatus: "Approved",
  },
];

export const dummyPayments: PensionPayment[] = [
  {
    id: "p-1",
    memberId: "m-104",
    date: "2026-04-18",
    reference: "PAY-2026-12001",
    description: "Regular Pension",
    type: "Retirement Payout",
    amountMk: 420_000,
    authStatus: "Approved",
  },
  {
    id: "p-2",
    memberId: "m-102",
    date: "2026-04-22",
    reference: "PAY-2026-12008",
    description: "Programmed withdrawal installment",
    type: "50% Withdrawal",
    amountMk: 265_000,
    authStatus: "Approved",
  },
  {
    id: "p-3",
    memberId: "m-101",
    date: "2026-05-01",
    reference: "PAY-2026-12015",
    description: "Death Benefits (beneficiary)",
    type: "Death Benefits",
    amountMk: 1_200_000,
    authStatus: "Pending",
  },
  {
    id: "p-4",
    memberId: "m-109",
    date: "2026-04-30",
    reference: "PAY-2026-12022",
    description: "Monthly pension",
    type: "Retirement Payout",
    amountMk: 512_000,
    authStatus: "Approved",
  },
  {
    id: "p-5",
    memberId: "m-110",
    date: "2026-04-26",
    reference: "PAY-2026-12028",
    description: "Early partial access",
    type: "Early Withdrawal",
    amountMk: 340_000,
    authStatus: "Pending",
  },
  {
    id: "p-6",
    memberId: "m-113",
    date: "2026-04-20",
    reference: "PAY-2026-12033",
    description: "Other settlement",
    type: "Other",
    amountMk: 88_000,
    authStatus: "Approved",
  },
  {
    id: "p-7",
    memberId: "m-114",
    date: "2026-05-05",
    reference: "PAY-2026-12040",
    description: "Death Benefits (estate)",
    type: "Death Benefits",
    amountMk: 2_400_000,
    authStatus: "Pending",
  },
  {
    id: "p-8",
    memberId: "m-105",
    date: "2026-05-08",
    reference: "PAY-2026-12045",
    description: "Programmed withdrawal",
    type: "50% Withdrawal",
    amountMk: 198_000,
    authStatus: "Approved",
  },
];

export const dummyPwMembers: PWMember[] = [
  {
    id: "pw-1",
    firstName: "Yamikani",
    lastName: "Mkandawire",
    district: "Lilongwe",
    planType: "Monthly Annuity",
    fundBalanceMk: 28_500_000,
    monthlyInstallmentMk: 385_000,
    nextDueDate: "2026-05-15",
  },
  {
    id: "pw-2",
    firstName: "Ellen",
    lastName: "Tembo",
    district: "Blantyre",
    planType: "Life-based PW",
    fundBalanceMk: 19_200_000,
    monthlyInstallmentMk: 298_000,
    nextDueDate: "2026-05-12",
  },
  {
    id: "pw-3",
    firstName: "Stanley",
    lastName: "Gondwe",
    district: "Mzuzu",
    planType: "Fixed-Term PW",
    fundBalanceMk: 11_750_000,
    monthlyInstallmentMk: 210_000,
    nextDueDate: "2026-05-20",
  },
  {
    id: "pw-4",
    firstName: "Malita",
    lastName: "Kachali",
    district: "Zomba",
    planType: "Monthly Annuity",
    fundBalanceMk: 15_330_000,
    monthlyInstallmentMk: 242_000,
    nextDueDate: "2026-05-18",
  },
  {
    id: "pw-5",
    firstName: "Henderson",
    lastName: "Mbeta",
    district: "Lilongwe",
    planType: "Life-based PW",
    fundBalanceMk: 33_800_000,
    monthlyInstallmentMk: 445_000,
    nextDueDate: "2026-05-11",
  },
  {
    id: "pw-6",
    firstName: "Rhoda",
    lastName: "Kapito",
    district: "Blantyre",
    planType: "Fixed-Term PW",
    fundBalanceMk: 9_420_000,
    monthlyInstallmentMk: 175_000,
    nextDueDate: "2026-05-25",
  },
  {
    id: "pw-7",
    firstName: "Gift",
    lastName: "Mwale",
    district: "Karonga",
    planType: "Monthly Annuity",
    fundBalanceMk: 22_100_000,
    monthlyInstallmentMk: 318_000,
    nextDueDate: "2026-05-14",
  },
];

export const dummyVoluntary: VoluntaryMember[] = [
  {
    id: "v-1",
    firstName: "Patience",
    lastName: "Kalua",
    district: "Blantyre",
    pensionPortionMk: 3_420_000,
    personalSavingsMk: 2_280_000,
    lastContributionDate: "2026-05-01",
  },
  {
    id: "v-2",
    firstName: "Mavuto",
    lastName: "Sakala",
    district: "Lilongwe",
    pensionPortionMk: 5_100_000,
    personalSavingsMk: 3_400_000,
    lastContributionDate: "2026-04-28",
  },
  {
    id: "v-3",
    firstName: "Ruth",
    lastName: "Jere",
    district: "Mangochi",
    pensionPortionMk: 1_980_000,
    personalSavingsMk: 1_320_000,
    lastContributionDate: "2026-05-06",
  },
  {
    id: "v-4",
    firstName: "Peter",
    lastName: "Chibwe",
    district: "Zomba",
    pensionPortionMk: 2_640_000,
    personalSavingsMk: 1_760_000,
    lastContributionDate: "2026-05-02",
  },
  {
    id: "v-5",
    firstName: "Mary",
    lastName: "Kachale",
    district: "Lilongwe",
    pensionPortionMk: 6_840_000,
    personalSavingsMk: 4_560_000,
    lastContributionDate: "2026-05-09",
  },
  {
    id: "v-6",
    firstName: "Jones",
    lastName: "Malunga",
    district: "Nkhotakota",
    pensionPortionMk: 1_116_000,
    personalSavingsMk: 744_000,
    lastContributionDate: "2026-04-29",
  },
  {
    id: "v-7",
    firstName: "Ida",
    lastName: "Nkhoma",
    district: "Blantyre",
    pensionPortionMk: 4_500_000,
    personalSavingsMk: 3_000_000,
    lastContributionDate: "2026-05-08",
  },
  {
    id: "v-8",
    firstName: "Francis",
    lastName: "Zimba",
    district: "Mzimba",
    pensionPortionMk: 900_000,
    personalSavingsMk: 600_000,
    lastContributionDate: "2026-05-10",
  },
];

export const dummyCompliance: ComplianceFlag[] = [
  {
    id: "c-1",
    memberRef: "m-103 — Chisomo Phiri",
    issue: "National ID document pending verification",
    severity: "medium",
    since: "2026-04-12",
  },
  {
    id: "c-2",
    memberRef: "m-104 — Lameck Kumwenda",
    issue: "Beneficiary percentages do not total 100%",
    severity: "high",
    since: "2026-05-03",
  },
  {
    id: "c-3",
    memberRef: "Bulk import batch B-14",
    issue: "Duplicate receipt reference detected",
    severity: "low",
    since: "2026-05-07",
  },
  {
    id: "c-4",
    memberRef: "m-108 — Bertha Chavula",
    issue: "Missing proof of residence on file",
    severity: "medium",
    since: "2026-05-09",
  },
  {
    id: "c-5",
    memberRef: "Co-ilovo payroll feed",
    issue: "Employer contribution file late beyond SLA",
    severity: "low",
    since: "2026-05-10",
  },
  {
    id: "c-6",
    memberRef: "m-114 — Tamara Nyirenda",
    issue: "Bank mandate signature mismatch",
    severity: "high",
    since: "2026-05-06",
  },
  {
    id: "c-7",
    memberRef: "Voluntary cohort V-PRINT",
    issue: "60/40 booking validation warning on batch V-902",
    severity: "medium",
    since: "2026-05-08",
  },
];

function startOfPeriod(period: Period): number {
  const now = new Date();
  const d = new Date(now);
  if (period === "day") {
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (period === "week") {
    d.setDate(d.getDate() - 7);
    return d.getTime();
  }
  if (period === "month") {
    d.setMonth(d.getMonth() - 1);
    return d.getTime();
  }
  d.setFullYear(d.getFullYear() - 1);
  return d.getTime();
}

export function filterReceiptsByPeriod(receipts: FundReceipt[], period: Period): FundReceipt[] {
  const t0 = startOfPeriod(period);
  return receipts.filter((r) => new Date(r.date).getTime() >= t0);
}

export function sumReceiptsMk(receipts: FundReceipt[]): number {
  return receipts.filter((r) => r.authStatus === "Approved").reduce((a, r) => a + r.amountMk, 0);
}

export function memberCompanyName(member: PensionMember): string {
  if (!member.companyId) return "Individual (Unrestricted)";
  return dummyCompanies.find((c) => c.id === member.companyId)?.name ?? "—";
}

export function genderBreakdown(members: PensionMember[]): { labels: string[]; values: number[] } {
  const map: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
  members.forEach((m) => {
    map[m.gender] = (map[m.gender] || 0) + 1;
  });
  return { labels: Object.keys(map), values: Object.values(map) };
}

export function schemeMix(): { labels: string[]; values: number[] } {
  const restricted = dummyCompanies.filter((c) => c.scheme === "restricted").reduce((a, c) => a + c.memberCount, 0);
  const unrestricted = dummyCompanies.filter((c) => c.scheme === "unrestricted").reduce((a, c) => a + c.memberCount, 0);
  return {
    labels: ["Restricted schemes", "Unrestricted pool"],
    values: [restricted, unrestricted],
  };
}

export {
  dummyPostingQueue,
  dummyReconciliationBatches,
  dummyComplianceTimeline,
  type AuditTrailEvent,
  type PostingQueueItem,
  type ReconciliationBatch,
} from "./operations";
