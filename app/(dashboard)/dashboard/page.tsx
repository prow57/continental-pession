"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allMembers } from "@/lib/data/members";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AccountStatus, Gender } from "@/lib/types";

export default function DashboardPage() {
  // Calculate statistics
  const totalMembers = allMembers.length;
  const activeMembers = allMembers.filter(
    (m) => m.accountStatus === AccountStatus.ACTIVE
  ).length;
  const dormantMembers = allMembers.filter(
    (m) => m.accountStatus === AccountStatus.DORMANT
  ).length;
  const totalBalance = allMembers.reduce((sum, m) => sum + m.currentBalance, 0);
  const totalContributions = allMembers.reduce(
    (sum, m) => sum + (m.currentBalance - m.openingBalance),
    0
  );
  const pendingAuthorizations = 5; // Simulated

  // Gender distribution
  const maleCount = allMembers.filter((m) => m.gender === Gender.MALE).length;
  const femaleCount = allMembers.filter((m) => m.gender === Gender.FEMALE).length;

  // Recent transactions (simulated)
  const recentTransactions = allMembers.slice(0, 5).map((member) => ({
    id: member.id,
    memberName: `${member.firstName} ${member.lastName}`,
    type: "Receipt",
    amount: 150000,
    date: "2025-05-08",
    status: "Approved",
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Welcome back! Here's what's happening with your pension fund.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalMembers}
            </div>
            <div className="mt-1 flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>12% from last month</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {activeMembers} active, {dormantMembers} dormant
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Fund Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalBalance)}
            </div>
            <div className="mt-1 flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>8.2% growth</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Across all member accounts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Monthly Contributions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalContributions / 12)}
            </div>
            <div className="mt-1 flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>5.1% increase</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Average monthly intake
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Authorizations
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {pendingAuthorizations}
            </div>
            <div className="mt-1 flex items-center text-xs text-amber-600">
              <span>Requires attention</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              3 receipts, 2 members
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Member Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Male</span>
                  <span className="font-medium text-slate-900">
                    {maleCount} ({Math.round((maleCount / totalMembers) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(maleCount / totalMembers) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Female</span>
                  <span className="font-medium text-slate-900">
                    {femaleCount} ({Math.round((femaleCount / totalMembers) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-pink-600"
                    style={{ width: `${(femaleCount / totalMembers) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Active Accounts</span>
                  <span className="font-medium text-slate-900">
                    {activeMembers} ({Math.round((activeMembers / totalMembers) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${(activeMembers / totalMembers) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Dormant Accounts</span>
                  <span className="font-medium text-slate-900">
                    {dormantMembers} ({Math.round((dormantMembers / totalMembers) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-amber-600"
                    style={{ width: `${(dormantMembers / totalMembers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {transaction.memberName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {transaction.type} • {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +{formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant="status" status={transaction.status}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-blue-600 hover:bg-blue-50">
              <Users className="mb-2 h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Register Member
              </span>
            </button>
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-blue-600 hover:bg-blue-50">
              <DollarSign className="mb-2 h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Enter Receipt
              </span>
            </button>
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-blue-600 hover:bg-blue-50">
              <TrendingUp className="mb-2 h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Setup PW
              </span>
            </button>
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-blue-600 hover:bg-blue-50">
              <AlertCircle className="mb-2 h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                View Authorizations
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
