import { Transaction, TransactionType, AuthorizationStatus } from "../types";

export const generateTransactions = (memberId: string, openingBalance: number, currentBalance: number): Transaction[] => {
  const transactions: Transaction[] = [];
  let balance = openingBalance;
  
  // Opening balance
  transactions.push({
    id: `txn-${memberId}-000`,
    memberId,
    date: "2024-01-01",
    referenceNumber: "OB-2024",
    type: TransactionType.RECEIPT,
    description: "Opening Balance",
    debit: 0,
    credit: openingBalance,
    balance: openingBalance,
    status: AuthorizationStatus.APPROVED,
    authorizedBy: "user-3",
  });
  
  // Generate monthly contributions
  const months = 16; // Jan 2024 to May 2025
  for (let i = 1; i <= months; i++) {
    const month = ((i - 1) % 12) + 1;
    const year = 2024 + Math.floor((i - 1) / 12);
    const contribution = Math.floor(Math.random() * 100000) + 100000;
    balance += contribution;
    
    transactions.push({
      id: `txn-${memberId}-${String(i).padStart(3, "0")}`,
      memberId,
      date: `${year}-${String(month).padStart(2, "0")}-05`,
      referenceNumber: `REC-${year}-${String(month).padStart(2, "0")}-${memberId}`,
      type: TransactionType.RECEIPT,
      description: `Monthly contribution - ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
      debit: 0,
      credit: contribution,
      balance,
      status: AuthorizationStatus.APPROVED,
      authorizedBy: "user-3",
    });
  }
  
  // Add some earnings
  const earningsCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < earningsCount; i++) {
    const earning = Math.floor(balance * 0.08); // 8% annual return
    balance += earning;
    
    transactions.push({
      id: `txn-${memberId}-earn-${i}`,
      memberId,
      date: `${2024 + i}-12-31`,
      referenceNumber: `EARN-${2024 + i}-${memberId}`,
      type: TransactionType.EARNING,
      description: `Annual investment earnings ${2024 + i}`,
      debit: 0,
      credit: earning,
      balance,
      status: AuthorizationStatus.APPROVED,
      authorizedBy: "user-3",
    });
  }
  
  // Add occasional withdrawals for some members
  if (Math.random() > 0.7) {
    const withdrawal = Math.floor(balance * 0.1);
    balance -= withdrawal;
    
    transactions.push({
      id: `txn-${memberId}-pay-001`,
      memberId,
      date: "2025-03-15",
      referenceNumber: `PAY-2025-${memberId}`,
      type: TransactionType.PAYMENT,
      description: "Partial withdrawal",
      debit: withdrawal,
      credit: 0,
      balance,
      status: AuthorizationStatus.APPROVED,
      authorizedBy: "user-3",
    });
  }
  
  // Adjust final balance to match current balance
  if (balance !== currentBalance) {
    const adjustment = currentBalance - balance;
    transactions.push({
      id: `txn-${memberId}-adj`,
      memberId,
      date: "2025-05-08",
      referenceNumber: `ADJ-2025-${memberId}`,
      type: adjustment > 0 ? TransactionType.EARNING : TransactionType.PAYMENT,
      description: "Balance adjustment",
      debit: adjustment < 0 ? Math.abs(adjustment) : 0,
      credit: adjustment > 0 ? adjustment : 0,
      balance: currentBalance,
      status: AuthorizationStatus.APPROVED,
      authorizedBy: "user-3",
    });
  }
  
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
