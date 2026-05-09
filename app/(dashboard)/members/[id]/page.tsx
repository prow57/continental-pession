"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allMembers } from "@/lib/data/members";
import { companies } from "@/lib/data/companies";
import { generateTransactions } from "@/lib/data/transactions";
import { formatCurrency, formatDate, exportToCSV } from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function MemberLedgerPage() {
  const params = useParams();
  const memberId = params.id as string;
  const [period, setPeriod] = useState("all");

  const member = allMembers.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Member Not Found</h1>
          <Link href="/members">
            <Button className="mt-4">Back to Members</Button>
          </Link>
        </div>
      </div>
    );
  }

  const transactions = generateTransactions(
    member.id,
    member.openingBalance,
    member.currentBalance
  );

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    if (period === "all") return transactions;

    const now = new Date();
    const filterDate = new Date();

    switch (period) {
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter((t) => new Date(t.date) >= filterDate);
  }, [transactions, period]);

  // Calculate period statistics
  const periodStats = useMemo(() => {
    const opening = filteredTransactions[0]?.balance - (filteredTransactions[0]?.credit || 0) + (filteredTransactions[0]?.debit || 0) || member.openingBalance;
    const totalCredits = filteredTransactions.reduce((sum, t) => sum + t.credit, 0);
    const totalDebits = filteredTransactions.reduce((sum, t) => sum + t.debit, 0);
    const closing = member.currentBalance;

    return { opening, totalCredits, totalDebits, closing };
  }, [filteredTransactions, member]);

  const company = member.companyId
    ? companies.find((c) => c.id === member.companyId)
    : null;

  const handleExport = () => {
    const exportData = filteredTransactions.map((t) => ({
      Date: formatDate(t.date),
      Reference: t.referenceNumber,
      Type: t.type,
      Description: t.description,
      Debit: t.debit,
      Credit: t.credit,
      Balance: t.balance,
      Status: t.status,
    }));
    exportToCSV(exportData, `member-ledger-${member.id}-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {member.type === "Individual"
                ? `${member.firstName} ${member.lastName}`
                : member.companyName}
            </h1>
            <p className="text-sm text-slate-500">
              {member.idNumber} • Member since {formatDate(member.dateOfJoining)}
            </p>
          </div>
        </div>
        <Badge variant="status" status={member.accountStatus}>
          {member.accountStatus}
        </Badge>
      </div>

      {/* Member Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-600">Member ID</p>
              <p className="mt-1 font-medium text-slate-900">{member.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Phone Number</p>
              <p className="mt-1 font-medium text-slate-900">{member.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Company</p>
              <p className="mt-1 font-medium text-slate-900">
                {company?.name || "Individual"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Beneficiaries</p>
              <p className="mt-1 font-medium text-slate-900">
                {member.beneficiaries.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={period === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
          >
            Last Month
          </Button>
          <Button
            variant={period === "quarter" ? "primary" : "outline"}
            size="sm"
            onClick={() => setPeriod("quarter")}
          >
            Last Quarter
          </Button>
          <Button
            variant={period === "year" ? "primary" : "outline"}
            size="sm"
            onClick={() => setPeriod("year")}
          >
            Last Year
          </Button>
          <Button
            variant={period === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setPeriod("all")}
          >
            All Time
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Statement
        </Button>
      </div>

      {/* Balance Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Opening Balance
            </CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(periodStats.opening)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Start of period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Contributions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(periodStats.totalCredits)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Receipts & earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Withdrawals
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(periodStats.totalDebits)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Payments & fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Current Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(periodStats.closing)}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {periodStats.closing > periodStats.opening ? (
                <span className="text-green-600">
                  +{formatCurrency(periodStats.closing - periodStats.opening)} growth
                </span>
              ) : (
                <span className="text-red-600">
                  {formatCurrency(periodStats.opening - periodStats.closing)} decrease
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-slate-600">Opening</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(periodStats.opening)}
              </p>
            </div>
            <div className="flex-1 px-4">
              <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500"
                  style={{
                    width: `${(periodStats.totalCredits / (periodStats.totalCredits + periodStats.totalDebits)) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-green-600">
                  +{formatCurrency(periodStats.totalCredits)}
                </span>
                <span className="text-red-600">
                  -{formatCurrency(periodStats.totalDebits)}
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Closing</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(periodStats.closing)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Trail</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Debit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Credit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {transaction.referenceNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge
                        variant="status"
                        status={
                          transaction.type === "Receipt"
                            ? "Active"
                            : transaction.type === "Payment"
                            ? "Closed"
                            : "Approved"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transaction.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-red-600">
                      {transaction.debit > 0 ? formatCurrency(transaction.debit) : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-green-600">
                      {transaction.credit > 0 ? formatCurrency(transaction.credit) : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-slate-900">
                      {formatCurrency(transaction.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
