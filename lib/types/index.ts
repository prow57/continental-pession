// Core Type Definitions for CPS Back Office System

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum MaritalStatus {
  SINGLE = "Single",
  MARRIED = "Married",
  DIVORCED = "Divorced",
  WIDOWED = "Widowed",
}

export enum AccountStatus {
  ACTIVE = "Active",
  DORMANT = "Dormant",
  DECEASED = "Deceased",
  CLOSED = "Closed",
}

export enum IDType {
  NATIONAL_ID = "National ID",
  PASSPORT = "Passport",
  DRIVERS_LICENSE = "Driver's License",
}

export enum PaymentType {
  EARLY_WITHDRAWAL = "Early Withdrawal",
  FIFTY_PERCENT_WITHDRAWAL = "50% Withdrawal",
  RETIREMENT_PAYOUT = "Retirement Payout",
  DEATH_BENEFITS = "Death Benefits",
  MONTHLY_PENSION = "Monthly Pension",
  MEDICAL_PREMIUM = "Medical Premium",
  FUNERAL_BENEFITS = "Funeral Benefits",
  OTHER = "Other",
}

export enum TransactionType {
  RECEIPT = "Receipt",
  PAYMENT = "Payment",
  EARNING = "Earning",
  TRANSFER = "Transfer",
  BONUS = "Bonus",
}

export enum AuthorizationStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum UserRole {
  ADMIN = "Admin",
  CAPTURER = "Capturer",
  AUTHORIZER = "Authorizer",
  READ_ONLY = "Read Only",
}

export enum RecordType {
  MEMBER = "Member",
  RECEIPT = "Receipt",
  PAYMENT = "Payment",
  TRANSFER = "Transfer",
  EARNING = "Earning",
}

export enum PWOption {
  MONTHLY_ANNUITY = "Monthly Annuity",
  LIFE_BASED = "Life-based PW",
  FIXED_TERM = "Fixed-Term PW",
}

export interface NextOfKin {
  fullName: string;
  idNumber: string;
  address: string;
  phoneNumber: string;
  relationship: string;
}

export interface Beneficiary {
  id: string;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  relationship: string;
  benefitRate: number; // Percentage
}

export interface Member {
  id: string;
  type: "Individual" | "Company";
  // Personal/Company Info
  firstName?: string;
  lastName?: string;
  companyName?: string;
  dateOfBirth?: string;
  companyCreationDate?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  idType: IDType;
  idNumber: string;
  phoneNumber: string;
  dateOfJoining: string;
  // Address
  physicalAddress: {
    location: string;
    district: string;
  };
  placeOfBirth?: {
    location: string;
    district: string;
  };
  village?: string;
  // Relations
  nextOfKin?: NextOfKin;
  beneficiaries: Beneficiary[];
  // Account Info
  accountStatus: AccountStatus;
  companyId?: string; // For individual members
  currentBalance: number;
  openingBalance: number;
  // Metadata
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
  authorizedBy?: string;
  authorizedAt?: string;
  authorizationStatus: AuthorizationStatus;
}

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  creationDate: string;
  address: {
    location: string;
    district: string;
  };
  phoneNumber: string;
  email?: string;
  memberCount: number;
  totalContributions: number;
  status: AccountStatus;
  createdAt: string;
}

export interface Receipt {
  id: string;
  memberId: string;
  memberName: string;
  receiptDate: string;
  referenceNumber: string;
  description: string;
  amount: number;
  receiptType: string;
  authorizationStatus: AuthorizationStatus;
  createdBy: string;
  createdAt: string;
  authorizedBy?: string;
  authorizedAt?: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  paymentDate: string;
  referenceNumber: string;
  description: string;
  amount: number;
  paymentType: PaymentType;
  authorizationStatus: AuthorizationStatus;
  createdBy: string;
  createdAt: string;
  authorizedBy?: string;
  authorizedAt?: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  date: string;
  referenceNumber: string;
  type: TransactionType;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  status: AuthorizationStatus;
  authorizedBy?: string;
}

export interface Transfer {
  id: string;
  memberId: string;
  memberName: string;
  fromCompanyId: string;
  fromCompanyName: string;
  toCompanyId: string;
  toCompanyName: string;
  transferDate: string;
  effectiveDate: string;
  reason: string;
  balanceTransferred: number;
  authorizationStatus: AuthorizationStatus;
  createdBy: string;
  createdAt: string;
  authorizedBy?: string;
  authorizedAt?: string;
}

export interface Earning {
  id: string;
  effectiveDate: string;
  rate: number; // Percentage
  description: string;
  affectedMembers: string[]; // Member IDs or "ALL"
  totalAmount: number;
  authorizationStatus: AuthorizationStatus;
  createdBy: string;
  createdAt: string;
  authorizedBy?: string;
  authorizedAt?: string;
}

export interface PWSetup {
  id: string;
  memberId: string;
  memberName: string;
  pwOption: PWOption;
  openingBalance: number;
  investmentRate: number; // Percentage
  tenure: number; // In months
  monthlyPayment: number;
  estimatedLifespan?: number;
  fundMovements: PWFundMovement[];
  createdBy: string;
  createdAt: string;
  status: "Active" | "Completed" | "Cancelled";
}

export interface PWFundMovement {
  period: number;
  periodLabel: string;
  openingBalance: number;
  interestEarned: number;
  withdrawal: number;
  closingBalance: number;
}

export interface AuthorizationRecord {
  id: string;
  recordType: RecordType;
  recordId: string;
  recordData: any;
  submittedBy: string;
  submittedAt: string;
  status: AuthorizationStatus;
  authorizedBy?: string;
  authorizedAt?: string;
  reason?: string;
  auditTrail: AuditLog[];
}

export interface AuditLog {
  id: string;
  recordType: RecordType;
  recordId: string;
  action: "Created" | "Modified" | "Submitted" | "Approved" | "Rejected" | "Deleted";
  performedBy: string;
  performedAt: string;
  reason?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  dormantMembers: number;
  totalContributions: number;
  totalPayments: number;
  pendingAuthorizations: number;
  monthlyGrowth: number;
}

export interface ReportFilter {
  dateFrom?: string;
  dateTo?: string;
  memberId?: string;
  companyId?: string;
  status?: AccountStatus;
  transactionType?: TransactionType;
}
