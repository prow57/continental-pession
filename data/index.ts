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
  /** Employer / scheme administration (demo) */
  industrySector?: string;
  registrationNo?: string;
  payrollContactEmail?: string;
  trusteeSummary?: string;
  establishedYear?: number;
}

export interface PensionMember {
  id: string;
  firstName: string;
  lastName: string;
  companyId: string | null;
  district: string;
  gender: "Male" | "Female";
  dateJoined: string;
  balanceMk: number;
  status: MemberStatus;
  kycComplete: boolean;
}

/** KYC / contact overlay for member profile screens (demo). */
export interface MemberProfileExtra {
  dateOfBirth: string;
  phone: string;
  email: string;
  nationalIdMasked: string;
  beneficiaryName: string;
  bankNameMasked: string;
  jobTitle: string;
  internalNotes: string;
}

export interface FinanceLiquidityLine {
  label: string;
  institution: string;
  balanceMk: number;
  asOf: string;
}

export interface FinancePipelineStat {
  stage: string;
  count: number;
  amountMk: number;
}

export interface SchemeConcentrationRow {
  scheme: string;
  receiptsLast90dMk: number;
  pctOfInflows: number;
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
  commencementDate?: string;
  schemeMemberRef?: string;
  taxWithheldPct?: number;
  cumPaidMk?: number;
  bankMasked?: string;
  actuaryRiskBand?: "Low" | "Standard" | "Elevated";
  lastReviewDate?: string;
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
    industrySector: "Conglomerate — manufacturing, retail & logistics",
    registrationNo: "CPS-REG-PCL-2011-0842",
    payrollContactEmail: "group.payroll@presscorp.mw",
    trusteeSummary: "Employer trustee sub-committee (4) · quarterly scheme reviews with CPS",
    establishedYear: 1996,
  },
  {
    id: "co-2",
    name: "National Bank of Malawi",
    scheme: "restricted",
    district: "Blantyre",
    memberCount: 612,
    monthlyContributionMk: 36_200_000,
    industrySector: "Financial services — banking",
    registrationNo: "CPS-REG-NBM-2008-0311",
    payrollContactEmail: "hr.operations@nbm.mw",
    trusteeSummary: "HR & risk co-chairs · monthly contribution reconciliation to CPS",
    establishedYear: 1964,
  },
  {
    id: "co-3",
    name: "Ethanol Company Malawi",
    scheme: "restricted",
    district: "Dowa",
    memberCount: 198,
    monthlyContributionMk: 9_850_000,
    industrySector: "Agro-processing — ethanol & co-products",
    registrationNo: "CPS-REG-ECM-2015-1204",
    payrollContactEmail: "people@ethanolmw.mw",
    trusteeSummary: "Single employer trustee with CPS delegated compliance checks",
    establishedYear: 2014,
  },
  {
    id: "co-4",
    name: "Individual & SME Pool (Unrestricted)",
    scheme: "unrestricted",
    district: "Lilongwe",
    memberCount: 1240,
    monthlyContributionMk: 22_100_000,
    industrySector: "Multi-employer unrestricted pool",
    registrationNo: "CPS-POOL-SME-2019-0001",
    payrollContactEmail: "pool.ops@cps.mw",
    trusteeSummary: "CPS board oversight · SME segment capped exposure rules",
    establishedYear: 2019,
  },
  {
    id: "co-5",
    name: "Illovo Sugar (Malawi) Limited",
    scheme: "restricted",
    district: "Chikwawa",
    memberCount: 526,
    monthlyContributionMk: 18_650_000,
    industrySector: "Agriculture — sugar estates & milling",
    registrationNo: "CPS-REG-ILLOVO-2004-0098",
    payrollContactEmail: "mw.payroll@illovo.com",
    trusteeSummary: "Seasonal payroll peaks · harvest bonus accruals flagged to finance",
    establishedYear: 1967,
  },
  {
    id: "co-6",
    name: "FDH Financial Holdings",
    scheme: "restricted",
    district: "Blantyre",
    memberCount: 389,
    monthlyContributionMk: 21_040_000,
    industrySector: "Financial services — banking & insurance",
    registrationNo: "CPS-REG-FDH-2010-0555",
    payrollContactEmail: "talent@fdh.mw",
    trusteeSummary: "Group HR policy alignment · cross-subsidiary transfers monitored",
    establishedYear: 2008,
  },
  {
    id: "co-7",
    name: "Admarc Limited",
    scheme: "restricted",
    district: "Lilongwe",
    memberCount: 912,
    monthlyContributionMk: 14_775_000,
    industrySector: "Public marketing — grain & inputs",
    registrationNo: "CPS-REG-ADMARC-2012-0770",
    payrollContactEmail: "payroll@admarc.mw",
    trusteeSummary: "Parastatal governance layer · RBM reporting cadence",
    establishedYear: 1971,
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
    gender: "Female",
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
    commencementDate: "2024-08-01",
    schemeMemberRef: "PW-ANN-2019-88421",
    taxWithheldPct: 15,
    cumPaidMk: 6_930_000,
    bankMasked: "NBM · ****9021",
    actuaryRiskBand: "Standard",
    lastReviewDate: "2026-02-14",
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
    commencementDate: "2023-11-15",
    schemeMemberRef: "PW-LIFE-2020-44102",
    taxWithheldPct: 15,
    cumPaidMk: 4_172_000,
    bankMasked: "FDH · ****3308",
    actuaryRiskBand: "Low",
    lastReviewDate: "2025-11-01",
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
    commencementDate: "2025-01-10",
    schemeMemberRef: "PW-FT-2025-11007",
    taxWithheldPct: 10,
    cumPaidMk: 1_890_000,
    bankMasked: "Standard Bank · ****7712",
    actuaryRiskBand: "Standard",
    lastReviewDate: "2026-04-22",
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
    commencementDate: "2024-03-20",
    schemeMemberRef: "PW-ANN-2018-22019",
    taxWithheldPct: 15,
    cumPaidMk: 3_876_000,
    bankMasked: "NBM · ****6644",
    actuaryRiskBand: "Elevated",
    lastReviewDate: "2026-01-30",
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
    commencementDate: "2022-06-01",
    schemeMemberRef: "PW-LIFE-2017-00901",
    taxWithheldPct: 15,
    cumPaidMk: 12_240_000,
    bankMasked: "FDH · ****1188",
    actuaryRiskBand: "Standard",
    lastReviewDate: "2026-03-05",
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
    commencementDate: "2025-09-01",
    schemeMemberRef: "PW-FT-2025-22044",
    taxWithheldPct: 10,
    cumPaidMk: 875_000,
    bankMasked: "NBM · ****5500",
    actuaryRiskBand: "Low",
    lastReviewDate: "2026-05-01",
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
    commencementDate: "2023-05-18",
    schemeMemberRef: "PW-ANN-2021-77190",
    taxWithheldPct: 15,
    cumPaidMk: 5_724_000,
    bankMasked: "FDH · ****2093",
    actuaryRiskBand: "Standard",
    lastReviewDate: "2025-09-18",
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

export const dummyFinanceLiquidity: FinanceLiquidityLine[] = [
  { label: "Operating — contributions & benefits", institution: "FDH Bank", balanceMk: 2_842_500_000, asOf: "2026-05-11" },
  { label: "PW disbursement suspense", institution: "NBM", balanceMk: 486_200_000, asOf: "2026-05-11" },
  { label: "Investment custody (CPS MMF)", institution: "Treasury unit trusts", balanceMk: 1_120_000_000, asOf: "2026-05-10" },
  { label: "Statutory liquidity buffer", institution: "FDH + NBM (pooled)", balanceMk: 310_000_000, asOf: "2026-05-09" },
  { label: "FX nostro — ZAR leg", institution: "Standard Bank SA", balanceMk: 98_400_000, asOf: "2026-05-08" },
];

export const dummyFinanceReceiptPipeline: FinancePipelineStat[] = [
  { stage: "Draft / captured", count: 3, amountMk: 955_000 },
  { stage: "Pending authorizer", count: 4, amountMk: 1_567_500 },
  { stage: "Approved (posting eligible)", count: 12, amountMk: 3_812_000 },
  { stage: "Rejected / returned", count: 1, amountMk: 165_000 },
];

export const dummyFinancePaymentPipeline: FinancePipelineStat[] = [
  { stage: "Draft / captured", count: 1, amountMk: 2_400_000 },
  { stage: "Pending authorizer", count: 2, amountMk: 706_000 },
  { stage: "Approved (released)", count: 5, amountMk: 1_988_000 },
  { stage: "Held — compliance", count: 1, amountMk: 120_000 },
];

export const dummySchemeConcentration: SchemeConcentrationRow[] = [
  { scheme: "Press Corporation Ltd", receiptsLast90dMk: 4_320_000_000, pctOfInflows: 21 },
  { scheme: "National Bank of Malawi", receiptsLast90dMk: 3_180_000_000, pctOfInflows: 16 },
  { scheme: "Admarc Limited", receiptsLast90dMk: 2_910_000_000, pctOfInflows: 14 },
  { scheme: "Individual and SME pool", receiptsLast90dMk: 2_652_000_000, pctOfInflows: 13 },
  { scheme: "FDH Financial Holdings", receiptsLast90dMk: 2_301_000_000, pctOfInflows: 11 },
  { scheme: "Other employers (combined)", receiptsLast90dMk: 5_001_000_000, pctOfInflows: 25 },
];

const defaultMemberProfileExtra: MemberProfileExtra = {
  dateOfBirth: "—",
  phone: "Not on file",
  email: "—",
  nationalIdMasked: "—",
  beneficiaryName: "See master beneficiary schedule",
  bankNameMasked: "—",
  jobTitle: "—",
  internalNotes: "Complete extended KYC at next contribution batch.",
};

export const memberProfileExtras: Record<string, MemberProfileExtra> = {
  "m-101": {
    dateOfBirth: "1978-04-12",
    phone: "+265 888 120 441",
    email: "t.banda.work@example.mw",
    nationalIdMasked: "MWCHO****91L",
    beneficiaryName: "Spouse 50%, children equal 50%",
    bankNameMasked: "NBM · ****9021",
    jobTitle: "Operations supervisor",
    internalNotes: "Hard-copy statement Q4. Pensioner counselling flag if balance exceeds MK 25m.",
  },
  "m-102": {
    dateOfBirth: "1985-09-03",
    phone: "+265 991 204 882",
    email: "wezi.moyo@example.mw",
    nationalIdMasked: "MWLIL****44F",
    beneficiaryName: "Mother (dependant) 40%, siblings 60%",
    bankNameMasked: "FDH · ****3308",
    jobTitle: "Credit analyst II",
    internalNotes: "Mobile number verified OTP · e-statement only.",
  },
  "m-103": {
    dateOfBirth: "1996-01-20",
    phone: "+265 888 771 009",
    email: "chisomo.phiri@example.mw",
    nationalIdMasked: "MWSAL****02F",
    beneficiaryName: "Estate (pending court letter)",
    bankNameMasked: "NBM · ****4410",
    jobTitle: "Lab technician",
    internalNotes: "KYC ID scan pending back-office match. Hold voluntary top-up until cleared.",
  },
  "m-104": {
    dateOfBirth: "1982-11-30",
    phone: "+265 999 330 118",
    email: "l.kumwenda@example.mw",
    nationalIdMasked: "MWMZU****77M",
    beneficiaryName: "Two children (minor) — guardian payout rules",
    bankNameMasked: "FDH · ****1188",
    jobTitle: "Driver — logistics",
    internalNotes: "Dormant: no receipts 18 months. SMS re-activation campaign sent Mar 2026.",
  },
  "m-105": {
    dateOfBirth: "1990-06-18",
    phone: "+265 888 554 200",
    email: "tiyamike.ngwira@example.mw",
    nationalIdMasked: "MWBLA****33X",
    beneficiaryName: "Spouse primary 100%",
    bankNameMasked: "NBM · ****5500",
    jobTitle: "HR officer",
    internalNotes: "Maker-checker on address change completed 02 May 2026.",
  },
  "m-106": {
    dateOfBirth: "2001-02-02",
    phone: "+265 991 660 441",
    email: "grace.chirwa@example.mw",
    nationalIdMasked: "MWLIL****19F",
    beneficiaryName: "Parents joint 100%",
    bankNameMasked: "FDH · ****2093",
    jobTitle: "Graduate trainee",
    internalNotes: "SME pool member — quarterly pooled statement.",
  },
  "m-107": {
    dateOfBirth: "1975-08-08",
    phone: "+265 888 221 903",
    email: "joseph.mzumara@example.mw",
    nationalIdMasked: "MWCHI****55M",
    beneficiaryName: "Spouse + estate trust",
    bankNameMasked: "NBM · ****7712",
    jobTitle: "Agricultural engineer",
    internalNotes: "Seasonal bonus receipts flagged in finance dashboard.",
  },
  "m-108": {
    dateOfBirth: "1988-12-01",
    phone: "+265 999 441 002",
    email: "bertha.chavula@example.mw",
    nationalIdMasked: "MWTHY****88F",
    beneficiaryName: "Children 100% (equal)",
    bankNameMasked: "FDH · ****6644",
    jobTitle: "Branch cashier",
    internalNotes: "Proof of residence upload requested — compliance ticket C-4.",
  },
  "m-109": {
    dateOfBirth: "1970-03-25",
    phone: "+265 888 990 331",
    email: "macdonald.mbendera@example.mw",
    nationalIdMasked: "MWNTC****12M",
    beneficiaryName: "Spouse 60%, daughter 40%",
    bankNameMasked: "NBM · ****9028",
    jobTitle: "Warehouse manager",
    internalNotes: "High balance tier — annual actuarial note attached.",
  },
  "m-110": {
    dateOfBirth: "1994-07-14",
    phone: "+265 991 300 774",
    email: "towera.msiska@example.mw",
    nationalIdMasked: "MWDED****66F",
    beneficiaryName: "Spouse 100%",
    bankNameMasked: "FDH · ****4412",
    jobTitle: "Loan officer",
    internalNotes: "Linked employer NBM — payroll file auto-match enabled.",
  },
  "m-111": {
    dateOfBirth: "2003-10-10",
    phone: "+265 888 445 661",
    email: "kondwani.chimera@example.mw",
    nationalIdMasked: "MWBLA****04M",
    beneficiaryName: "Parents 100%",
    bankNameMasked: "NBM · ****3301",
    jobTitle: "IT support",
    internalNotes: "SME pool — first contribution 2024; onboarding pack archived.",
  },
  "m-112": {
    dateOfBirth: "1986-05-22",
    phone: "+265 999 220 889",
    email: "esther.lungu@example.mw",
    nationalIdMasked: "MWKAS****77F",
    beneficiaryName: "Sister (authorised payee)",
    bankNameMasked: "FDH · ****5509",
    jobTitle: "Teacher",
    internalNotes: "Dormant profile — employer last file Admarc Oct 2024.",
  },
  "m-113": {
    dateOfBirth: "1992-09-09",
    phone: "+265 888 778 120",
    email: "bright.kachaje@example.mw",
    nationalIdMasked: "MWLIL****21M",
    beneficiaryName: "Spouse 50%, mother 50%",
    bankNameMasked: "NBM · ****8821",
    jobTitle: "Finance assistant",
    internalNotes: "FDH group cross-hire from subsidiary — HR reference on file.",
  },
  "m-114": {
    dateOfBirth: "1984-04-04",
    phone: "+265 991 551 400",
    email: "tamara.nyirenda@example.mw",
    nationalIdMasked: "MWMZU****40F",
    beneficiaryName: "Estate executor (law firm letter)",
    bankNameMasked: "FDH · ****1199",
    jobTitle: "Programme officer",
    internalNotes: "Bank mandate mismatch — compliance C-6; hold outbound payments.",
  },
};

export function memberProfileExtraFor(memberId: string): MemberProfileExtra {
  return memberProfileExtras[memberId] ?? defaultMemberProfileExtra;
}

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
  const map: Record<string, number> = { Male: 0, Female: 0};
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
