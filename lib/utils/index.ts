import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInYears } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MW", {
    style: "currency",
    currency: "MWK",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, formatStr: string = "dd MMM yyyy"): string {
  return format(new Date(date), formatStr);
}

export function calculateAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), new Date(dateOfBirth));
}

export function validateBeneficiaryPercentages(percentages: number[]): boolean {
  const total = percentages.reduce((sum, p) => sum + p, 0);
  return Math.abs(total - 100) < 0.01; // Allow for floating point errors
}

export function generateReferenceNumber(prefix: string = "REF"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

export function calculateBalance(
  openingBalance: number,
  receipts: number,
  payments: number,
  earnings: number
): number {
  return openingBalance + receipts + earnings - payments;
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Dormant: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Deceased: "bg-gray-100 text-gray-800 border-gray-200",
    Closed: "bg-red-100 text-red-800 border-red-200",
    Draft: "bg-slate-100 text-slate-800 border-slate-200",
    Submitted: "bg-blue-100 text-blue-800 border-blue-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getTransactionTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    Receipt: "text-blue-600",
    Payment: "text-red-600",
    Earning: "text-green-600",
    Transfer: "text-purple-600",
    Bonus: "text-emerald-600",
  };
  return typeColors[type] || "text-gray-600";
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function searchMembers(members: any[], query: string): any[] {
  const lowerQuery = query.toLowerCase();
  return members.filter(
    (member) =>
      member.firstName?.toLowerCase().includes(lowerQuery) ||
      member.lastName?.toLowerCase().includes(lowerQuery) ||
      member.companyName?.toLowerCase().includes(lowerQuery) ||
      member.idNumber?.toLowerCase().includes(lowerQuery) ||
      member.phoneNumber?.includes(query)
  );
}

export function sortData<T>(data: T[], key: keyof T, direction: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    if (direction === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
}

export function filterByDateRange(
  data: any[],
  dateField: string,
  startDate?: string,
  endDate?: string
): any[] {
  if (!startDate && !endDate) return data;

  return data.filter((item) => {
    const itemDate = new Date(item[dateField]);
    if (startDate && itemDate < new Date(startDate)) return false;
    if (endDate && itemDate > new Date(endDate)) return false;
    return true;
  });
}

export function calculatePWFundMovement(
  openingBalance: number,
  annualRate: number,
  tenureMonths: number,
  monthlyWithdrawal: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const movements = [];
  let balance = openingBalance;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate;
    const withdrawal = monthlyWithdrawal;
    const closingBalance = balance + interest - withdrawal;

    movements.push({
      period: month,
      periodLabel: `Month ${month}`,
      openingBalance: balance,
      interestEarned: interest,
      withdrawal: withdrawal,
      closingBalance: Math.max(0, closingBalance),
    });

    balance = Math.max(0, closingBalance);
    if (balance === 0) break;
  }

  return movements;
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / tenureMonths;

  // Annuity formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  return principal * (numerator / denominator);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
