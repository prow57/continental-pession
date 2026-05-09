import { Receipt, AuthorizationStatus } from "../types";

export const receipts: Receipt[] = [
  {
    id: "rec-001",
    memberId: "mem-001",
    memberName: "Chisomo Banda",
    receiptDate: "2025-05-08",
    referenceNumber: "REC-2025-05-001",
    description: "Monthly contribution - May 2025",
    amount: 250000,
    receiptType: "Monthly Contribution",
    authorizationStatus: AuthorizationStatus.APPROVED,
    createdBy: "user-2",
    createdAt: "2025-05-08T09:00:00Z",
    authorizedBy: "user-3",
    authorizedAt: "2025-05-08T10:30:00Z",
  },
  {
    id: "rec-002",
    memberId: "mem-002",
    memberName: "Mphatso Phiri",
    receiptDate: "2025-05-08",
    referenceNumber: "REC-2025-05-002",
    description: "Monthly contribution - May 2025",
    amount: 200000,
    receiptType: "Monthly Contribution",
    authorizationStatus: AuthorizationStatus.APPROVED,
    createdBy: "user-2",
    createdAt: "2025-05-08T09:15:00Z",
    authorizedBy: "user-3",
    authorizedAt: "2025-05-08T10:45:00Z",
  },
  {
    id: "rec-003",
    memberId: "mem-003",
    memberName: "Thandiwe Mwale",
    receiptDate: "2025-05-08",
    referenceNumber: "REC-2025-05-003",
    description: "Monthly contribution - May 2025",
    amount: 180000,
    receiptType: "Monthly Contribution",
    authorizationStatus: AuthorizationStatus.SUBMITTED,
    createdBy: "user-4",
    createdAt: "2025-05-08T09:30:00Z",
  },
  {
    id: "rec-004",
    memberId: "mem-004",
    memberName: "Limbani Kachingwe",
    receiptDate: "2025-05-07",
    referenceNumber: "REC-2025-05-004",
    description: "Monthly contribution - May 2025",
    amount: 300000,
    receiptType: "Monthly Contribution",
    authorizationStatus: AuthorizationStatus.APPROVED,
    createdBy: "user-2",
    createdAt: "2025-05-07T14:00:00Z",
    authorizedBy: "user-3",
    authorizedAt: "2025-05-07T15:20:00Z",
  },
  {
    id: "rec-005",
    memberId: "mem-005",
    memberName: "Chimwemwe Tembo",
    receiptDate: "2025-05-07",
    referenceNumber: "REC-2025-05-005",
    description: "Lump sum contribution",
    amount: 500000,
    receiptType: "Lump Sum",
    authorizationStatus: AuthorizationStatus.APPROVED,
    createdBy: "user-4",
    createdAt: "2025-05-07T11:00:00Z",
    authorizedBy: "user-3",
    authorizedAt: "2025-05-07T12:30:00Z",
  },
];

// Generate more receipts for realistic data
export const generateAdditionalReceipts = (): Receipt[] => {
  const additionalReceipts: Receipt[] = [];
  const memberIds = Array.from({ length: 60 }, (_, i) => `mem-${String(i + 1).padStart(3, "0")}`);
  
  for (let i = 6; i <= 100; i++) {
    const memberId = memberIds[Math.floor(Math.random() * memberIds.length)];
    const dayOffset = Math.floor(Math.random() * 30);
    const date = new Date(2025, 3, 8 - dayOffset); // April-May 2025
    const dateStr = date.toISOString().split("T")[0];
    
    additionalReceipts.push({
      id: `rec-${String(i).padStart(3, "0")}`,
      memberId,
      memberName: `Member ${memberId}`,
      receiptDate: dateStr,
      referenceNumber: `REC-2025-${String(i).padStart(5, "0")}`,
      description: Math.random() > 0.8 ? "Lump sum contribution" : "Monthly contribution",
      amount: Math.floor(Math.random() * 400000) + 100000,
      receiptType: Math.random() > 0.8 ? "Lump Sum" : "Monthly Contribution",
      authorizationStatus: Math.random() > 0.1 ? AuthorizationStatus.APPROVED : AuthorizationStatus.SUBMITTED,
      createdBy: Math.random() > 0.5 ? "user-2" : "user-4",
      createdAt: new Date(date.getTime() + 3600000).toISOString(),
      authorizedBy: Math.random() > 0.1 ? "user-3" : undefined,
      authorizedAt: Math.random() > 0.1 ? new Date(date.getTime() + 7200000).toISOString() : undefined,
    });
  }
  
  return additionalReceipts;
};

export const allReceipts = [...receipts, ...generateAdditionalReceipts()];
