"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allMembers } from "@/lib/data/members";
import { formatCurrency, calculatePWFundMovement, calculateMonthlyPayment } from "@/lib/utils";
import { Search, Calculator, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { PWOption, AccountStatus } from "@/lib/types";

export default function PWSetupPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [pwOption, setPwOption] = useState<PWOption>(PWOption.MONTHLY_ANNUITY);
  const [investmentRate, setInvestmentRate] = useState("8");
  const [tenure, setTenure] = useState("120"); // months
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [fundMovements, setFundMovements] = useState<any[]>([]);

  // Filter eligible members (Active accounts with balance > 0)
  const eligibleMembers = allMembers.filter(
    (m) => m.accountStatus === AccountStatus.ACTIVE && m.currentBalance > 0
  );

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return eligibleMembers
      .filter(
        (m) =>
          m.firstName?.toLowerCase().includes(query) ||
          m.lastName?.toLowerCase().includes(query) ||
          m.idNumber?.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, eligibleMembers]);

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setSearchQuery("");
    setCalculated(false);
    setFundMovements([]);
  };

  const handleCalculate = () => {
    if (!selectedMember) {
      alert("Please select a member");
      return;
    }

    const rate = parseFloat(investmentRate);
    const months = parseInt(tenure);
    const payment = monthlyPayment
      ? parseFloat(monthlyPayment)
      : calculateMonthlyPayment(selectedMember.currentBalance, rate, months);

    setMonthlyPayment(payment.toString());

    const movements = calculatePWFundMovement(
      selectedMember.currentBalance,
      rate,
      months,
      payment
    );

    setFundMovements(movements);
    setCalculated(true);
  };

  const handleSave = () => {
    if (!calculated) {
      alert("Please calculate the PW setup first");
      return;
    }
    alert(
      `PW Setup saved for ${selectedMember.firstName} ${selectedMember.lastName}!\n\nMonthly Payment: ${formatCurrency(parseFloat(monthlyPayment))}\nTenure: ${tenure} months\nInvestment Rate: ${investmentRate}%`
    );
  };

  const totalInterest = fundMovements.reduce((sum, m) => sum + m.interestEarned, 0);
  const totalWithdrawals = fundMovements.reduce((sum, m) => sum + m.withdrawal, 0);
  const finalBalance = fundMovements.length > 0 ? fundMovements[fundMovements.length - 1].closingBalance : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Programmed Withdrawal Setup
        </h1>
        <p className="text-sm text-slate-500">
          Configure investment and withdrawal schedules for pension members
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">About Programmed Withdrawals</h3>
              <p className="mt-1 text-sm text-blue-700">
                Programmed Withdrawals allow members to receive regular pension payments while
                their remaining funds continue to earn investment returns. The system calculates
                an optimal payment schedule based on the member's balance, expected returns, and
                desired tenure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select Member</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMember ? (
            <div className="flex items-center justify-between rounded-lg border-2 border-blue-600 bg-blue-50 p-4">
              <div>
                <p className="font-medium text-slate-900">
                  {selectedMember.firstName} {selectedMember.lastName}
                </p>
                <p className="text-sm text-slate-600">
                  {selectedMember.idNumber} • Age:{" "}
                  {new Date().getFullYear() -
                    new Date(selectedMember.dateOfBirth).getFullYear()}{" "}
                  years
                </p>
                <p className="mt-1 text-lg font-bold text-blue-900">
                  Available Balance: {formatCurrency(selectedMember.currentBalance)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedMember(null);
                  setCalculated(false);
                  setFundMovements([]);
                }}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search eligible members by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {filteredMembers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMember(member)}
                      className="w-full border-b border-slate-100 p-3 text-left hover:bg-slate-50 last:border-0"
                    >
                      <p className="font-medium text-slate-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {member.idNumber} • Balance: {formatCurrency(member.currentBalance)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {eligibleMembers.length} eligible members available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PW Configuration */}
      {selectedMember && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Configure PW Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PW Option */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                PW Option <span className="text-red-500">*</span>
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                <button
                  onClick={() => setPwOption(PWOption.MONTHLY_ANNUITY)}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    pwOption === PWOption.MONTHLY_ANNUITY
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <p className="font-medium text-slate-900">Monthly Annuity</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Fixed monthly payments over specified period
                  </p>
                </button>
                <button
                  onClick={() => setPwOption(PWOption.LIFE_BASED)}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    pwOption === PWOption.LIFE_BASED
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <p className="font-medium text-slate-900">Life-based PW</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Payments based on life expectancy
                  </p>
                </button>
                <button
                  onClick={() => setPwOption(PWOption.FIXED_TERM)}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    pwOption === PWOption.FIXED_TERM
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <p className="font-medium text-slate-900">Fixed-Term PW</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Payments for a fixed number of years
                  </p>
                </button>
              </div>
            </div>

            {/* Investment Parameters */}
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Annual Investment Rate (%)"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={investmentRate}
                onChange={(e) => {
                  setInvestmentRate(e.target.value);
                  setCalculated(false);
                }}
              />
              <Input
                label="Tenure (Months)"
                type="number"
                min="12"
                max="360"
                value={tenure}
                onChange={(e) => {
                  setTenure(e.target.value);
                  setCalculated(false);
                }}
              />
              <Input
                label="Monthly Payment (Optional)"
                type="number"
                min="0"
                step="0.01"
                value={monthlyPayment}
                onChange={(e) => {
                  setMonthlyPayment(e.target.value);
                  setCalculated(false);
                }}
                placeholder="Auto-calculated"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Fund Movement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Calculation Results */}
      {calculated && fundMovements.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Monthly Payment
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(parseFloat(monthlyPayment))}
                </div>
                <p className="mt-1 text-xs text-slate-500">Fixed amount</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Interest
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{formatCurrency(totalInterest)}
                </div>
                <p className="mt-1 text-xs text-slate-500">Over {tenure} months</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Withdrawals
                </CardTitle>
                <Calendar className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -{formatCurrency(totalWithdrawals)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {fundMovements.length} payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Final Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(finalBalance)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {finalBalance < 1000 ? "Fully depleted" : "Remaining"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fund Movement Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fund Movement Schedule</CardTitle>
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save PW Setup
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                        Period
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                        Opening Balance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                        Interest Earned
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                        Withdrawal
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                        Closing Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {fundMovements.map((movement, index) => (
                      <tr
                        key={movement.period}
                        className={`hover:bg-slate-50 ${
                          movement.closingBalance < 1000 ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                          {movement.periodLabel}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-900">
                          {formatCurrency(movement.openingBalance)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-green-600">
                          +{formatCurrency(movement.interestEarned)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-red-600">
                          -{formatCurrency(movement.withdrawal)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-slate-900">
                          {formatCurrency(movement.closingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Warning if fund depletes early */}
          {finalBalance < 1000 && fundMovements.length < parseInt(tenure) && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="rounded-lg bg-amber-600 p-2">
                    <TrendingDown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900">Fund Depletion Warning</h3>
                    <p className="mt-1 text-sm text-amber-700">
                      The fund will be depleted in {fundMovements.length} months, which is{" "}
                      {parseInt(tenure) - fundMovements.length} months earlier than the
                      planned tenure. Consider reducing the monthly payment or increasing
                      the investment rate.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
